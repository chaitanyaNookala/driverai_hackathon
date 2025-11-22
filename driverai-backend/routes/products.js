const express = require('express');
const router = express.Router();
const axios = require('axios');

// Get product by barcode
router.get('/:barcode', async (req, res) => {
    try {
        const { barcode } = req.params;

        // Call OpenFoodFacts API
        const response = await axios.get(
            `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
        );

        if (response.data.status === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const product = response.data.product;

        // Extract relevant data
        const productData = {
            barcode: barcode,
            name: product.product_name || 'Unknown Product',
            brand: product.brands || 'Unknown Brand',
            image: product.image_url,
            ingredients: product.ingredients_text || 'No ingredients available',
            allergens: product.allergens_tags || [],
            nutrition: {
                calories: product.nutriments?.['energy-kcal_100g'] || 0,
                fat: product.nutriments?.fat_100g || 0,
                carbs: product.nutriments?.carbohydrates_100g || 0,
                protein: product.nutriments?.proteins_100g || 0,
                sugar: product.nutriments?.sugars_100g || 0,
                fiber: product.nutriments?.fiber_100g || 0,
                sodium: product.nutriments?.sodium_100g || 0
            },
            categories: product.categories_tags || [],
            labels: product.labels_tags || []
        };

        res.json(productData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Translate text
router.post('/translate', async (req, res) => {
    try {
        const { text, targetLang = 'en' } = req.body;

        // Using LibreTranslate (you can also use Google Translate API)
        const response = await axios.post('https://libretranslate.de/translate', {
            q: text,
            source: 'auto',
            target: targetLang,
            format: 'text'
        });

        res.json({
            original: text,
            translated: response.data.translatedText,
            targetLanguage: targetLang
        });
    } catch (error) {
        res.status(500).json({ error: 'Translation failed' });
    }
});

// Get similar products (simplified - based on category)
router.get('/:barcode/similar', async (req, res) => {
    try {
        const { barcode } = req.params;

        // Get original product first
        const productResponse = await axios.get(
            `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
        );

        if (productResponse.data.status === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const product = productResponse.data.product;
        const category = product.categories_tags?.[0] || 'snacks';

        // Search for similar products in same category
        const searchResponse = await axios.get(
            `https://world.openfoodfacts.org/category/${category}.json?page_size=5`
        );

        const similarProducts = searchResponse.data.products
            .filter(p => p.code !== barcode)
            .slice(0, 3)
            .map(p => ({
                barcode: p.code,
                name: p.product_name,
                brand: p.brands,
                image: p.image_url,
                nutrition: {
                    calories: p.nutriments?.['energy-kcal_100g'] || 0
                }
            }));

        res.json(similarProducts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;