# Backend API (FastAPI)

## Setup
1) Python 3.11+ recommended.
2) Create venv and install deps:
   - `python -m venv .venv`
   - `.venv\Scripts\activate` (Windows) or `source .venv/bin/activate` (Unix)
   - `pip install -r requirements.txt`

## Run locally
- `uvicorn main:app --reload`
- Swagger UI: http://localhost:8000/docs (Redoc at /redoc)

## Endpoints
- `GET /health` — liveness.
- `POST /process-pdf` — extract text per page; optional OCR for scanned PDFs.
  - Query: `ocr_if_scanned` (bool, default false), `max_pages` (optional int).
  - Response: filename, page_count, scanned_pages, data[ { page, content, source } ].
- `GET /screener/questions` — non-diagnostic screener prompts (dyslexia/ADHD/visual stress signals).
- `POST /screener/submit` — Likert answers → reading profile with feature toggles and recommendations.
- `GET /reader/config` — returns reader configuration; accepts optional `dyslexia|adhd|irlen` scores (0-100) or returns a neutral baseline.
- `POST /sessions/metrics` — compute WPM and heatmap buckets for a reading session.

## Example requests (Swagger UI works too)

Extract a PDF (with OCR fallback):
```bash
curl -X POST "http://localhost:8000/process-pdf?ocr_if_scanned=true" \
  -F "file=@/path/to/book.pdf"
```

Get screener questions:
```bash
curl http://localhost:8000/screener/questions
```

Submit screener answers (Likert 1-5):
```bash
curl -X POST http://localhost:8000/screener/submit \
  -H "Content-Type: application/json" \
  -d '{"answers":[{"id":"dyslexia_bdpq","score":5},{"id":"adhd_focus","score":4}]}'
```

Get reader config from scores:
```bash
curl "http://localhost:8000/reader/config?dyslexia=70&adhd=40&irlen=20"
```

Compute session metrics:
```bash
curl -X POST http://localhost:8000/sessions/metrics \
  -H "Content-Type: application/json" \
  -d '{"paragraphs":[{"paragraph_id":"p1","word_count":120,"duration_ms":60000},{"paragraph_id":"p2","word_count":90,"duration_ms":90000}]}'
```

## Notes
- PDF guardrails: 15 MB max, 80 pages max; scanned PDFs require `ocr_if_scanned=true` to run OCR.
- Screener is non-diagnostic; phrasing is for personalization only.
- Use the feature toggles/recommendations from screener/config to drive front-end reader (OpenDyslexic, bdpq highlighting, focus mode, RSVP, pastel themes).
