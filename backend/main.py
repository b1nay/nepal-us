# import io
# from fastapi import FastAPI, UploadFile, File, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# import fitz  # PyMuPDF
# import pytesseract
# from pdf2image import convert_from_bytes
# from PIL import Image
# import uvicorn 

# app = FastAPI(title="Neurodivergent Reader API")

# # Enable CORS for frontend integration
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# def perform_ocr(pdf_content: bytes):
#     """Fallback: Converts PDF pages to images and runs OCR."""
#     images = convert_from_bytes(pdf_content)
#     full_text = []
    
#     for i, image in enumerate(images):
#         text = pytesseract.image_to_string(image, lang='eng')
#         full_text.append({"page": i + 1, "content": text.strip()})
#     return full_text

# @app.post("/process-pdf")
# async def process_pdf(file: UploadFile = File(...)):
#     if not file.filename.endswith(".pdf"):
#         raise HTTPException(status_code=400, detail="File must be a PDF")

#     try:
#         pdf_bytes = await file.read()
#         doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        
#         pages_data = []
#         needs_ocr = False

#         for page_num, page in enumerate(doc):
#             # Extract text blocks to maintain some paragraph structure
#             text = page.get_text("text").strip()
            
#             # If a page has very little text, it's likely a scan
#             if len(text) < 50:
#                 needs_ocr = True
#                 break
                
#             pages_data.append({
#                 "page": page_num + 1,
#                 "content": text
#             })

#         # If we detected an image-based PDF, trigger the heavy lifting
#         if needs_ocr:
#             pages_data = perform_ocr(pdf_bytes)

#         return {
#             "filename": file.filename,
#             "page_count": len(pages_data),
#             "data": pages_data
#         }

#     except Exception as e:
#         return {"error": str(e)}

# if __name__ == "__main__":
#     uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)


import io
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import fitz  # PyMuPDF
import pytesseract
from PIL import Image
import uvicorn

app = FastAPI(title="Neurodivergent Reader API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def perform_ocr_with_pymupdf(doc):
    """
    Converts PDF pages to images using PyMuPDF and runs OCR via Tesseract.
    This avoids the need for the Poppler library.
    """
    full_text = []
    
    for page_num, page in enumerate(doc):
        # 1. Render page to an image (Pixmap)
        # We use a Matrix to scale the image up (2x) for better OCR accuracy
        zoom = 2.0 
        mat = fitz.Matrix(zoom, zoom)
        pix = page.get_pixmap(matrix=mat)
        
        # 2. Convert Pixmap to a PIL Image
        img_data = pix.tobytes("png")
        img = Image.open(io.BytesIO(img_data))
        
        # 3. Run Tesseract OCR
        text = pytesseract.image_to_string(img, lang='eng')
        
        full_text.append({
            "page": page_num + 1, 
            "content": text.strip(),
            "method": "ocr"
        })
        
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
        is_scanned = False

        # Quick check: is this a 'searchable' PDF or a scan?
        for page in doc:
            text = page.get_text().strip()
            # If the first few pages have almost no text, assume it's a scan
            if len(text) < 50:
                is_scanned = True
                break
            
            pages_data.append({
                "page": page.number + 1,
                "content": text,
                "method": "direct_extraction"
            })

        # If it looks like a scan, re-process everything with OCR
        if is_scanned:
            pages_data = perform_ocr_with_pymupdf(doc)

        doc.close()

        return {
            "filename": file.filename,
            "page_count": len(pages_data),
            "is_ocr_processed": is_scanned,
            "data": pages_data
        }

    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)