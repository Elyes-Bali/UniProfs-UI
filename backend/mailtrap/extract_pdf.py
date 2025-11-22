# backend/mailtrap/extract_pdf.py
import sys
import fitz  # PyMuPDF
import json

pdf_path = sys.argv[1]

try:
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    print(json.dumps({"text": text}))  # Node.js can parse this JSON
except Exception as e:
    print(json.dumps({"error": str(e)}))
