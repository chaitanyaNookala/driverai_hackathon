from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
import pytesseract
from PIL import Image, ImageEnhance, ImageOps, ImageFilter
import google.generativeai as genai
import uvicorn
import os
import tempfile
import logging

# -------------------------------------------------------
# LOGGING SETUP
# -------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("backend")

# -------------------------------------------------------
# GEMINI API KEY
# -------------------------------------------------------
GEMINI_API_KEY = "AIzaSyCz-k2V7UxSceeHeuSl-sOlTgVLLB7vQqo"   # <–– PASTE IT HERE

if not GEMINI_API_KEY or GEMINI_API_KEY.strip() == "":
    raise ValueError("❌ ERROR: GEMINI_API_KEY missing! Add it in main.py.")

genai.configure(api_key=GEMINI_API_KEY)

try:
    model = genai.GenerativeModel("models/gemini-2.5-pro")
    logger.info("✅ Gemini model initialized successfully")
except Exception as e:
    logger.error(f"❌ Gemini model initialization failed: {e}")
    raise

# -------------------------------------------------------
# TESSERACT OCR PATH
# -------------------------------------------------------
TESSERACT_PATH = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

if os.path.exists(TESSERACT_PATH):
    pytesseract.pytesseract.tesseract_cmd = TESSERACT_PATH
    logger.info(f"🔍 Using Tesseract at: {TESSERACT_PATH}")
else:
    logger.warning("⚠ Tesseract not found, OCR may fail.")

# -------------------------------------------------------
# FASTAPI INSTANCE
# -------------------------------------------------------
app = FastAPI()


# -------------------------------------------------------
# PROCESS IMAGE ENDPOINT
# -------------------------------------------------------
@app.post("/process-image")
async def process_image(image: UploadFile = File(...)):
    temp_path = None

    try:
        logger.info(f"📸 Received image: {image.filename}")

        # Save temp file
        suffix = os.path.splitext(image.filename)[1] or ".jpg"
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            content = await image.read()
            tmp.write(content)
            temp_path = tmp.name

        logger.info(f"📝 Temp file saved: {temp_path} ({len(content)} bytes)")

        # Load image
        img = Image.open(temp_path).convert("RGB")
        logger.info(f"🖼 Image opened: {img.size}, mode={img.mode}")

        # Preprocess image
        gray = img.convert("L")
        enhanced = ImageEnhance.Contrast(gray).enhance(2.0)
        sharp = enhanced.filter(ImageFilter.SHARPEN)

        # OCR – black text
        text_black = pytesseract.image_to_string(sharp, lang="eng")

        # OCR – white text
        inverted = ImageOps.invert(sharp)
        text_white = pytesseract.image_to_string(inverted, lang="eng")

        full_text = (text_black + "\n" + text_white).strip()

        if not full_text:
            logger.warning("⚠ OCR returned no text.")

        # -------------------------------------------------------
        # GEMINI PROMPT (YOUR EXACT ORIGINAL PROMPT)
        # -------------------------------------------------------
        prompt = f"""
You are analyzing text extracted from a product label.

Instructions:
1. Product Name (detect or guess logically)
2. Ingredients
3. Allergen Warnings (detect milk, nuts, gluten, soy, wheat, eggs)
4. Nutrition summary
5. 3 similar product recommendations (add approx prices)
6. Review summary (rating out of 5)
7. Translations:
   - Spanish
   - Chinese
   - Hindi
   (DO NOT translate the product name)
8. Give pairing suggestions (if relevant)
9. Mention whether it's vegan / halal / dietary status

Context (OCR text):
{full_text}

Return all output in Markdown with clear section headers.
"""

        # -------------------------------------------------------
        # CALL GEMINI API
        # -------------------------------------------------------
        try:
            logger.info("🤖 Sending OCR text to Gemini...")
            response = model.generate_content(prompt)
        except Exception as e:
            logger.error(f"❌ Gemini API error: {e}")
            return JSONResponse({"error": str(e)}, status_code=500)

        # Extract Gemini response
        analysis_text = ""

        if hasattr(response, "text"):
            analysis_text = response.text
        elif hasattr(response, "candidates"):
            try:
                parts = response.candidates[0].content.parts
                analysis_text = "".join([p.text for p in parts])
            except:
                analysis_text = str(response)
        else:
            analysis_text = "❌ Unexpected Gemini response format."

        # Cleanup
        if temp_path:
            os.remove(temp_path)

        logger.info("✅ Processing complete.")

        return {
            "ocr_text": full_text,
            "analysis": analysis_text,
        }

    except Exception as e:
        logger.error(f"❌ Fatal error: {e}")

        if temp_path:
            try:
                os.remove(temp_path)
            except:
                pass

        return JSONResponse({"error": str(e)}, status_code=500)


# -------------------------------------------------------
# RUN SERVER
# -------------------------------------------------------
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5001)
