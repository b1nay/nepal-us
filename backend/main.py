import io
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import fitz  # PyMuPDF
import pytesseract
from pdf2image import convert_from_bytes
from PIL import Image

app = FastAPI(title="Neurodivergent Reader API")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def perform_ocr(pdf_content: bytes):
    """Fallback: Converts PDF pages to images and runs OCR."""
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
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        
        pages_data = []
        needs_ocr = False

        for page_num, page in enumerate(doc):
            # Extract text blocks to maintain some paragraph structure
            text = page.get_text("text").strip()
            
            # If a page has very little text, it's likely a scan
            if len(text) < 50:
                needs_ocr = True
                break
                
            pages_data.append({
                "page": page_num + 1,
                "content": text
            })

        # If we detected an image-based PDF, trigger the heavy lifting
        if needs_ocr:
            pages_data = perform_ocr(pdf_bytes)

        return {
            "filename": file.filename,
            "page_count": len(pages_data),
            "data": pages_data
        }

    except Exception as e:
        return {"error": str(e)}

