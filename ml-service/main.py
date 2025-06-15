from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pytesseract
from PIL import Image
import io

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/ocr")
async def ocr_endpoint(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))
    text = pytesseract.image_to_string(image)
    # Stub: You can add regex to extract amount, description, etc.
    return {
        "ocr": {
            "text": text,
            "description": "Autodetected description",
            "amount": 123.45
        },
        "classification": "shared"
    }