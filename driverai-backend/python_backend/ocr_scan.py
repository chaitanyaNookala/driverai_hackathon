all_text = ""

for path in image_paths:
    img = Image.open(path).convert("RGB")
    img_gray = img.convert("L")
    enhancer = ImageEnhance.Contrast(img_gray)
    img_contrast = enhancer.enhance(2.0)
    img_sharp = img_contrast.filter(ImageFilter.SHARPEN)

    # Black text
    text_black = pytesseract.image_to_string(img_sharp, lang='eng')
    # White text
    text_white = pytesseract.image_to_string(ImageOps.invert(img_sharp), lang='eng')

    # Combine results for this image
    combined_text = text_black.strip() + "\n" + text_white.strip()
    all_text += combined_text + "\n"

print("\n=== OCR TEXT FROM ALL IMAGES (COMBINED) ===\n")
print(all_text)

# ---- SEND COMBINED OCR TEXT TO GEMINI FOR ANALYSIS ----
prompt = f"""
You are analyzing text extracted from a product label.

Instructions:
- If the actual product name is not clearly present, intelligently guess the most likely product name using all clues and the descriptive text ( for context if it says trident vtastics gum, it means its just trident sugarfree gum ignore the random text).
- Display the product name (guessed or detected) at the top.
- Extract information in clean sections:

1. Product Name (display only, do not translate)
2. Ingredients (list all found or likely ingredients)
3. Allergen Warnings (detect all mentioned: milk, nuts, gluten, soy, wheat, eggs)
4. Nutrition summary (summarize any found nutrition facts)
5. 3 similar product recommendations (based on context and product type) give one high price similar product in the market (like similar product but better quality) and also add approximate prices) 
6. Review summary (give ratings from online if possible like a star rating out of 5 would be relevant)
7. Translations:
   - Spanish: A simple product description using the product name (do not translate the name itself)
   - Chinese: A simple product description using the product name (do not translate the name itself)
   - Hindi: A simple product description using the product name (do not translate the name itself)
8.if relevant give some pairing options for this product only if relevant
9.give the dietary preference of this product like tell if its vegan, halal or stuff like that
Context:
Here is the product text extracted from one or more label images (some repetition or partial info is possible):

{all_text}

Return only the sections above. For translations, write a simple, natural product description using the product name exactly as shown, and do not translate the name. Format in clear Markdown headers for each section.
"""
response = model.generate_content(prompt)
print("\n=== AI ANALYSIS ===\n")
print(response.text)