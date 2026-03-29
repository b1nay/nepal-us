from typing import Literal
import base64
import io
import os
import re
import wave
from pathlib import Path
from xml.sax import saxutils
import fitz  # PyMuPDF
from google.cloud import texttospeech as gtts
import pytesseract
from fastapi import File, HTTPException, UploadFile, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel, Field
from pdf2image import convert_from_bytes
from dotenv import load_dotenv

load_dotenv(dotenv_path=Path(__file__).resolve().parent / ".env")

MAX_FILE_MB    = 15
MAX_PAGES      = 80
MIN_TEXT_CHARS = 120

# ---------------------------------------------------------------------------
# Resolve SSML_MARK timepoint enum safely across ALL library versions.
#
# The google-cloud-texttospeech proto layout changed across versions:
#   v2.14+ : SynthesizeSpeechRequest.TimepointType.SSML_MARK  (nested)
#   v1.x   : gtts.TimepointType.SSML_MARK                     (top-level)
#   fallback: integer 1  (SSML_MARK is always proto ordinal 1)
#
# Separately, the FIELD that accepts this enum also changed names:
#   Some builds : request.enable_time_pointing = [enum]
#   Other builds: not settable via attribute at all → use proto dict merge
# ---------------------------------------------------------------------------
def _resolve_ssml_mark_enum():
    for path in [
        lambda: gtts.SynthesizeSpeechRequest.TimepointType.SSML_MARK,
        lambda: gtts.TimepointType.SSML_MARK,
    ]:
        try:
            return path()
        except AttributeError:
            pass
    return 1  # raw proto ordinal — always valid

_SSML_MARK_ENUM = _resolve_ssml_mark_enum()

# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------
tags_metadata = [
    {"name": "health",   "description": "Liveness / readiness."},
    {"name": "pdf",      "description": "PDF upload + text extraction + OCR fallback."},
    {"name": "screener", "description": "Non-diagnostic dyslexia / ADHD / Irlen screener."},
    {"name": "reader",   "description": "Reader config derived from screener or scores."},
    {"name": "metrics",  "description": "Session WPM + heatmap bucket computation."},
]

app = FastAPI(
    title="Neurodivergent Reader API",
    version="0.3.0",
    openapi_tags=tags_metadata,
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# PDF
# ---------------------------------------------------------------------------
def _validate_pdf(file: UploadFile, payload: bytes) -> None:
    if len(payload) / (1024 * 1024) > MAX_FILE_MB:
        raise HTTPException(413, "PDF too large")
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(400, "File must be a PDF")

def _perform_ocr(pdf_content: bytes):
    return [
        {"page": i + 1, "content": pytesseract.image_to_string(img, lang="eng").strip(), "source": "ocr"}
        for i, img in enumerate(convert_from_bytes(pdf_content))
    ]

def _extract_text(doc: fitz.Document):
    pages_data, scanned = [], 0
    for pn, page in enumerate(doc):
        text = page.get_text("text").strip()
        if not text or len(text) < MIN_TEXT_CHARS:
            scanned += 1
        pages_data.append({"page": pn + 1, "content": text, "source": "text"})
    return pages_data, scanned

class PageContent(BaseModel):
    page: int; content: str; source: str

class ProcessPdfResponse(BaseModel):
    filename: str; page_count: int; scanned_pages: int; data: list[PageContent]

@app.post("/process-pdf", response_model=ProcessPdfResponse, tags=["pdf"])
async def process_pdf(
    file: UploadFile = File(...),
    ocr_if_scanned: bool = False,
    max_pages: int | None = None,
):
    pdf_bytes = await file.read()
    _validate_pdf(file, pdf_bytes)
    try:
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    except Exception as exc:
        raise HTTPException(400, "Invalid or corrupted PDF") from exc
    if max_pages and len(doc) > max_pages:
        raise HTTPException(413, "PDF exceeds allowed page count")
    if len(doc) > MAX_PAGES:
        raise HTTPException(413, "PDF exceeds allowed page count")
    pages_data, scanned = _extract_text(doc)
    if scanned and ocr_if_scanned:
        pages_data = _perform_ocr(pdf_bytes)
    elif scanned:
        raise HTTPException(422, "PDF appears scanned; rerun with ocr_if_scanned=true")
    return {"filename": file.filename, "page_count": len(pages_data), "scanned_pages": scanned, "data": pages_data}

@app.get("/health", tags=["health"])
async def health():
    return {"status": "ok", "version": "0.3.0"}

# ---------------------------------------------------------------------------
# Screener
# ---------------------------------------------------------------------------
class ScreenerQuestion(BaseModel):
    id: str; prompt: str; domain: str
    scale: list[str] = Field(default=["Never","Rarely","Sometimes","Often","Always"])

class ScreenerAnswer(BaseModel):
    id: str; score: int = Field(ge=1, le=5)

class ScreenerSubmission(BaseModel):
    answers: list[ScreenerAnswer]

class ProfileConfig(BaseModel):
    profile: str
    scores: dict[str, float]
    recommendations: dict[str, str | bool | int | float]
    features: dict[str, bool]

SCREENER_QUESTIONS: list[ScreenerQuestion] = [
    ScreenerQuestion(id="dyslexia_bdpq",     prompt="I mix up letters like b/d/p/q when reading.",                  domain="dyslexia"),
    ScreenerQuestion(id="dyslexia_tracking",  prompt="I lose my place easily or skip lines while reading.",          domain="dyslexia"),
    ScreenerQuestion(id="visual_stress",      prompt="Bright white pages make reading uncomfortable or tiring.",     domain="irlen"),
    ScreenerQuestion(id="adhd_focus",         prompt="I struggle to stay focused on a passage for more than a minute.", domain="adhd"),
    ScreenerQuestion(id="adhd_reread",        prompt="I often re-read the same sentence because my mind wandered.",  domain="adhd"),
]

def _score_answers(sub: ScreenerSubmission) -> dict[str, float]:
    buckets: dict[str, list[int]] = {}
    for ans in sub.answers:
        q = next((q for q in SCREENER_QUESTIONS if q.id == ans.id), None)
        if q:
            buckets.setdefault(q.domain, []).append(ans.score)
    return {d: round(sum(v) / (len(v) * 5) * 100, 1) for d, v in buckets.items()}

def _derive_profile(scores: dict[str, float]) -> ProfileConfig:
    dys  = scores.get("dyslexia", 0.0)
    adhd = scores.get("adhd", 0.0)
    irlen= scores.get("irlen", 0.0)
    dominant = max(("dyslexia",dys),("adhd",adhd),("irlen",irlen), key=lambda x: x[1])[0]
    features = {
        "open_dyslexic_font": dominant=="dyslexia" or dys>=50,
        "bdpq_highlight":     dominant=="dyslexia" or dys>=60,
        "karaoke_tts":        True,
        "focus_mode":         dominant=="adhd"     or adhd>=60,
        "rsvp_mode":          dys>=70,
        "pastel_overlay":     dominant=="irlen"    or irlen>=60,
    }
    recs: dict[str, str|bool|int|float] = {
        "font":         "OpenDyslexic" if features["open_dyslexic_font"] else "Default",
        "background":   "pastel"       if features["pastel_overlay"]     else "default",
        "bdpq_palette": "b-blue d-red p-purple q-green" if features["bdpq_highlight"] else "off",
        "speed_wpm":    140 if dominant=="adhd" else 110,
        "line_spacing": 1.6 if dominant in {"dyslexia","irlen"} else 1.4,
    }
    return ProfileConfig(profile=dominant, scores=scores, recommendations=recs, features=features)

def _default_profile() -> ProfileConfig:
    return ProfileConfig(
        profile="neutral", scores={},
        recommendations={"font":"Default","background":"default","bdpq_palette":"off","speed_wpm":120,"line_spacing":1.4},
        features={"open_dyslexic_font":False,"bdpq_highlight":False,"karaoke_tts":True,"focus_mode":False,"rsvp_mode":False,"pastel_overlay":False},
    )

@app.get("/screener/questions", response_model=list[ScreenerQuestion], tags=["screener"])
async def screener_questions(): return SCREENER_QUESTIONS

@app.post("/screener/submit", response_model=ProfileConfig, tags=["screener","reader"])
async def screener_submit(submission: ScreenerSubmission):
    if not submission.answers:
        raise HTTPException(400, "No answers provided")
    scores = _score_answers(submission)
    if not scores:
        raise HTTPException(400, "Answers did not match known questions")
    return _derive_profile(scores)

@app.get("/reader/config", response_model=ProfileConfig, tags=["reader"])
async def reader_config(dyslexia: float|None=None, adhd: float|None=None, irlen: float|None=None):
    clamp = lambda v: None if v is None else max(0.0, min(100.0, v))
    dyslexia, adhd, irlen = clamp(dyslexia), clamp(adhd), clamp(irlen)
    if all(v is None for v in [dyslexia, adhd, irlen]):
        return _default_profile()
    scores = {k:v for k,v in [("dyslexia",dyslexia),("adhd",adhd),("irlen",irlen)] if v is not None}
    return _derive_profile(scores)

# ---------------------------------------------------------------------------
# Metrics
# ---------------------------------------------------------------------------
class ParagraphMetrics(BaseModel):
    paragraph_id: str; word_count: int = Field(gt=0); duration_ms: int = Field(gt=0)

class MetricsRequest(BaseModel):
    paragraphs: list[ParagraphMetrics]

class ParagraphScore(BaseModel):
    paragraph_id: str; wpm: float; bucket: str

class MetricsResponse(BaseModel):
    average_wpm: float; paragraphs: list[ParagraphScore]

def _bucket(wpm: float) -> str:
    return "red" if wpm < 80 else "yellow" if wpm < 140 else "green"

@app.post("/sessions/metrics", response_model=MetricsResponse, tags=["metrics","reader"])
async def session_metrics(payload: MetricsRequest):
    if not payload.paragraphs:
        raise HTTPException(400, "No paragraphs provided")
    scores = [
        ParagraphScore(
            paragraph_id=p.paragraph_id,
            wpm=round(p.word_count / (p.duration_ms / 60000), 1),
            bucket=_bucket(p.word_count / (p.duration_ms / 60000)),
        )
        for p in payload.paragraphs
    ]
    return MetricsResponse(
        average_wpm=round(sum(s.wpm for s in scores)/len(scores), 1),
        paragraphs=scores,
    )

# ---------------------------------------------------------------------------
# TTS helpers
# ---------------------------------------------------------------------------
OutputFormat = Literal["stream","json"]
AudioFormat  = Literal["wav","mp3"]

class TTSRequest(BaseModel):
    text:              str          = Field(min_length=1, max_length=2000)
    speed:             float | None = Field(default=1.0, ge=0.5, le=2.0)
    speaker_id:        str | None   = Field(default=None)
    return_timepoints: bool         = Field(default=False)
    output:            OutputFormat = Field(default="stream")
    audio_format:      AudioFormat  = Field(default="wav")

def _map_fmt(fmt: AudioFormat):
    if fmt == "mp3":
        return gtts.AudioEncoding.MP3, 0, "audio/mpeg", "mp3"
    return gtts.AudioEncoding.LINEAR16, 22050, "audio/wav", "wav"

def _pcm_to_wav(pcm: bytes, rate: int = 22050) -> bytes:
    buf = io.BytesIO()
    with wave.open(buf, "wb") as wf:
        wf.setnchannels(1); wf.setsampwidth(2); wf.setframerate(rate)
        wf.writeframes(pcm)
    return buf.getvalue()

def _build_ssml_with_marks(text: str, rate_attr: str) -> tuple[str, list[str]]:
    """
    Inject <mark name='wN'/> before each whitespace-split token.
    Returns (ssml, token_list).  token_list[i] aligns to timepoints[i].
    """
    tokens = text.split()
    parts  = [f"<mark name='w{i}'/>{saxutils.escape(t)}" for i, t in enumerate(tokens)]
    ssml = (
        f"<speak version='1.0' xml:lang='en-US'>"
        f"<prosody rate='{rate_attr}'>{' '.join(parts)}</prosody>"
        f"</speak>"
    )
    return ssml, tokens

def _synthetic_timepoints(word_count: int, duration_ms: float) -> list[dict]:
    """
    Fallback when GCP does not return mark timepoints.
    Distribute words evenly across the audio duration.
    """
    if word_count == 0 or duration_ms == 0:
        return []
    interval = duration_ms / word_count
    return [{"time_ms": round(i * interval, 1)} for i in range(word_count)]

def _audio_duration_ms(audio_bytes: bytes, fmt: AudioFormat) -> float:
    """Estimate audio duration from raw bytes."""
    try:
        if fmt == "wav":
            buf = io.BytesIO(audio_bytes)
            with wave.open(buf, "rb") as wf:
                return wf.getnframes() / wf.getframerate() * 1000.0
        # MP3: rough estimate — average ~128 kbps
        return len(audio_bytes) * 8 / 128_000 * 1000.0
    except Exception:
        return 0.0

# ---------------------------------------------------------------------------
# Core synthesis function
# ---------------------------------------------------------------------------
def _synthesize_gcp(
    text: str,
    speed: float | None,
    voice: str | None,
    with_timepoints: bool,
    fmt: AudioFormat,
) -> tuple[bytes, list[dict]]:
    cred = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    if not cred:
        raise HTTPException(500, "GOOGLE_APPLICATION_CREDENTIALS not set")
    if not os.path.isfile(cred):
        raise HTTPException(500, f"Credential file not found: {cred}")

    try:
        client = gtts.TextToSpeechClient()
    except Exception as exc:
        raise HTTPException(500, f"GCP TTS client init failed: {exc}") from exc

    rate_attr  = f"{int((speed or 1.0) * 100)}%"
    word_count = len(text.split())

    if with_timepoints:
        ssml, _ = _build_ssml_with_marks(text, rate_attr)
    else:
        ssml = (
            f"<speak version='1.0' xml:lang='en-US'>"
            f"<prosody rate='{rate_attr}'>{saxutils.escape(text)}</prosody>"
            f"</speak>"
        )

    encoding, sample_rate, _, _ = _map_fmt(fmt)

    try:
        request = gtts.SynthesizeSpeechRequest(
            input=gtts.SynthesisInput(ssml=ssml),
            voice=gtts.VoiceSelectionParams(
                language_code="en-US",
                name=voice or "en-US-Neural2-D",
                ssml_gender=gtts.SsmlVoiceGender.SSML_VOICE_GENDER_UNSPECIFIED,
            ),
            audio_config=gtts.AudioConfig(
                audio_encoding=encoding,
                sample_rate_hertz=sample_rate or None,
            ),
        )

      
        if with_timepoints:
            set_ok = False
            # Strategy 1 — direct attribute
            try:
                request.enable_time_pointing = [_SSML_MARK_ENUM]
                set_ok = True
            except (AttributeError, ValueError, TypeError):
                pass

            # Strategy 2 — proto-plus wrapper (_pb exposes raw proto)
            if not set_ok:
                try:
                    request._pb.enable_time_pointing.append(_SSML_MARK_ENUM)
                    set_ok = True
                except (AttributeError, ValueError, TypeError):
                    pass

            # Strategy 3 — construct a raw proto request with timepointing
            if not set_ok:
                try:
                    from google.cloud.texttospeech_v1.types import cloud_tts_pb2  # type: ignore
                    raw = cloud_tts_pb2.SynthesizeSpeechRequest()
                    raw.enable_time_pointing.append(1)  # SSML_MARK ordinal
                    request._pb.MergeFrom(raw)
                    set_ok = True
                except Exception:
                    pass

            # Strategy 4 — give up on GCP timepoints; use synthetic fallback
            if not set_ok:
                with_timepoints = False

        response = client.synthesize_speech(request=request)

    except Exception as exc:
        raise HTTPException(500, f"GCP TTS request failed: {exc}") from exc

    if not response.audio_content:
        raise HTTPException(500, "GCP TTS returned empty audio")

    # ---- Extract GCP mark timepoints (if returned) ----------------------
    timepoints: list[dict] = []
    raw_tps = getattr(response, "timepoints", None) or []

    if with_timepoints and raw_tps:
        raw: list[tuple[int, float]] = []
        for tp in raw_tps:
            name  = getattr(tp, "mark_name", "") or ""
            match = re.match(r"^w(\d+)$", name)
            if match:
                raw.append((int(match.group(1)), tp.time_seconds * 1000.0))
        raw.sort(key=lambda x: x[0])
        timepoints = [{"time_ms": t} for _, t in raw]

    # ---- Synthetic fallback if GCP returned no marks --------------------
    if not timepoints and word_count > 0:
        raw_audio_for_dur = (
            _pcm_to_wav(response.audio_content, sample_rate)
            if fmt == "wav"
            else response.audio_content
        )
        dur_ms = _audio_duration_ms(raw_audio_for_dur, fmt)
        timepoints = _synthetic_timepoints(word_count, dur_ms)

    return response.audio_content, timepoints


# ---------------------------------------------------------------------------
# TTS endpoint
# ---------------------------------------------------------------------------
@app.post(
    "/tts",
    response_class=StreamingResponse,
    tags=["reader"],
    summary="Synthesise speech (GCP Neural2) with word-level timepoints",
    description=(
        "Word timepoints use SSML <mark/> tags. If the installed library version "
        "does not support enable_time_pointing, synthetic evenly-spaced timepoints "
        "are returned as fallback. output=json → base64 + timepoints; "
        "output=stream → audio binary."
    ),
)
async def tts_endpoint(payload: TTSRequest):
    text = payload.text.strip()
    if not text:
        raise HTTPException(400, "Text is required")

    wants_json      = payload.output == "json"
    with_timepoints = payload.return_timepoints or wants_json

    audio_bytes, timepoints = _synthesize_gcp(
        text, payload.speed, payload.speaker_id, with_timepoints, payload.audio_format
    )

    _, sample_rate, media_type, ext = _map_fmt(payload.audio_format)
    # Wrap raw LINEAR16 PCM in a RIFF/WAV container
    output_bytes = (
        _pcm_to_wav(audio_bytes, sample_rate)
        if payload.audio_format == "wav"
        else audio_bytes
    )

    if wants_json:
        return JSONResponse(content={
            "audio_base64":  base64.b64encode(output_bytes).decode("ascii"),
            "sample_rate_hz": sample_rate or None,
            "timepoints":    timepoints if payload.return_timepoints else [],
            "word_count":    len(text.split()),
            "synthetic_timepoints": not bool(
                # flag so frontend knows whether times are exact or estimated
                getattr(tts_endpoint, "_last_gcp_marks", True)
            ),
        })

    headers = {
        "Content-Length":      str(len(output_bytes)),
        "Content-Disposition": f"inline; filename=tts.{ext}",
        "Cache-Control":       "no-store",
    }
    return StreamingResponse(io.BytesIO(output_bytes), media_type=media_type, headers=headers)