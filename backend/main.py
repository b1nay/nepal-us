import io
import os

# from typing import Optional
from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
import fitz  # PyMuPDF
import pytesseract
from PIL import Image
import uvicorn
from pdf2image import convert_from_bytes
from dotenv import load_dotenv

# Azure Speech SDK
# import azure.cognitiveservices.speech as speechsdk

# load_dotenv()
# AZURE_SPEECH_KEY = os.getenv("AZURE_SPEECH_KEY")
# AZURE_SPEECH_REGION = os.getenv("AZURE_SPEECH_REGION")

app = FastAPI(title="OSO API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- KEEPING YOUR ORIGINAL OCR ROUTE UNTOUCHED ---
def perform_ocr(pdf_content: bytes):
    images = convert_from_bytes(pdf_content)
    full_text = []
    for i, image in enumerate(images):
        text = pytesseract.image_to_string(image, lang='eng')
        full_text.append({"page": i + 1, "content": text.strip()})
    return full_text

@app.post("/process-pdf")
async def process_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="File must be a PDF")
    try:
        pdf_bytes = await file.read()
        # Open the PDF directly from memory
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        pages_data = []
        needs_ocr = False
        for page_num, page in enumerate(doc):
            text = page.get_text("text").strip()
            if len(text) < 50:
                is_scanned = True
                break
            pages_data.append({"page": page_num + 1, "content": text})
        if needs_ocr:
            pages_data = perform_ocr(pdf_bytes)
        return {"filename": file.filename, "page_count": len(pages_data), "data": pages_data}
    except Exception as e:
        return {"error": str(e)}


# # --- UPDATED AUDIO LIBRARY ROUTE (AZURE) ---
# @app.post("/audio-library")
# async def audio_library(
#     file: UploadFile = File(...),
#     voice_name: Optional[str] = Form("en-US-AvaMultilingualNeural"),
#     speed: Optional[float] = Form(1.0)
# ):
#     try:
#         # 1. Extract Text from PDF
#         pdf_bytes = await file.read()
#         doc = fitz.open(stream=pdf_bytes, filetype="pdf")
#         full_text = " ".join([page.get_text() for page in doc]).strip()

#         if not full_text:
#             return {"error": "No text found in PDF"}

#         # 2. Azure Speech Configuration
#         speech_config = speechsdk.SpeechConfig(subscription=AZURE_SPEECH_KEY, region=AZURE_SPEECH_REGION)
#         speech_config.speech_synthesis_voice_name = voice_name
        
#         # Set format to standard WAV (Riff) for browser compatibility
#         speech_config.set_speech_synthesis_output_format(speechsdk.SpeechSynthesisOutputFormat.Riff24Khz16BitMonoPcm)

#         # 3. Setup Word Boundary Capture for "Karaoke" Highlighting
#         word_map = []
        
#         def word_boundary_callback(evt):
#             # audio_offset is in ticks (100ns). 10,000,000 ticks = 1 second.
#             start_seconds = evt.audio_offset / 10000000
#             # Azure provides duration in ticks as well
#             duration_seconds = evt.duration.total_seconds() if hasattr(evt, 'duration') else 0.15
            
#             word_map.append({
#                 "id": len(word_map),
#                 "text": evt.text,
#                 "start": round(start_seconds, 3),
#                 "end": round(start_seconds + duration_seconds, 3),
#                 "is_confusion_word": any(c in evt.text.lower() for c in 'bdpq')
#             })

#         # Synthesizer setup (audio_config=None keeps it in memory)
#         synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=None)
        
#         # Connect the correct event name
#         synthesizer.synthesis_word_boundary.connect(word_boundary_callback)

#         # 4. Synthesize using SSML (Required for Speed/Prosody)
#         # We escape common XML characters to prevent SSML errors
#         safe_text = full_text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
        
#         ssml = f"""
#         <speak version='1.0' xml:lang='en-US' xmlns='http://www.w3.org/2001/10/synthesis' xmlns:mstts='http://www.w3.org/2001/mstts'>
#             <voice name='{voice_name}'>
#                 <prosody rate='{speed}'>
#                     {safe_text}
#                 </prosody>
#             </voice>
#         </speak>
#         """
        
#         result = synthesizer.speak_ssml_async(ssml).get()

#         if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
#             return {
#                 "filename": file.filename,
#                 "audio_base64": base64.b64encode(result.audio_data).decode('utf-8'),
#                 "word_map": word_map,
#                 "full_text": full_text
#             }
        
#         # Enhanced error reporting if it fails again
#         elif result.reason == speechsdk.ResultReason.Canceled:
#             details = result.cancellation_details
#             return {"error": f"Canceled: {details.reason}. Details: {details.error_details}"}
#         else:
#             return {"error": f"Synthesis failed: {result.reason}"}

#     except Exception as e:
#         return {"error": str(e)}


if __name__ == "__main__":

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)