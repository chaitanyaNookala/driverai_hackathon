const express = require('express');
const router = express.Router();
const axios = require('axios');

// Mock product database (replace with real API later)
const products = {
    '8901030895364': {
        name: 'Britannia Good Day Cookies',
        ingredients: ['Wheat Flour', 'Sugar', 'Vegetable Oil', 'Milk Solids'],
        allergens: ['Wheat', 'Milk'],
        nutritionalInfo: {
            calories: 480,
            protein: 6,
            carbs: 65,
            fat: 21
        }
    }
};

// Get product by barcode
router.get('/:barcode', (req, res) => {
    const product = products[req.params.barcode];
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
});

// Get similar products
router.get('/:barcode/similar', (req, res) => {
    res.json([
        { name: 'Parle-G Biscuits', barcode: '8901030123456' },
        { name: 'Sunfeast Dark Fantasy', barcode: '8901030789012' }
    ]);
});

// Translate text
router.post('/translate', async (req, res) => {
    try {
        const { text, targetLang } = req.body;

        // Mock translation (replace with Google Translate API)
        const translations = {
            'en': text,
            'hi': 'अनुवादित पाठ',
            'es': 'texto traducido'
        };

        res.json({
            originalText: text,
            translatedText: translations[targetLang] || text,
            targetLanguage: targetLang
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;