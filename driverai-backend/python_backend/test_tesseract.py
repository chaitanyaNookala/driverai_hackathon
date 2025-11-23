import pytesseract
from PIL import Image

# Set tesseract path (Windows)
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# Test
try:
    version = pytesseract.get_tesseract_version()
    print(f"✅ Tesseract version: {version}")
    print("✅ pytesseract working correctly!")
except Exception as e:
    print(f"❌ Error: {e}")