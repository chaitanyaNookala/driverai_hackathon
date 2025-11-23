const express = require('express');
const cors = require('cors');
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// FIREBASE ADMIN INITIALIZATION
// ============================================
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// ============================================
// MIDDLEWARE
// ============================================
app.use(cors());
app.use(express.json());

// Make db available to all routes
app.use((req, res, next) => {
    req.db = db;
    req.admin = admin;
    next();
});

// ============================================
// ROUTES
// ============================================
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'DriverAI Backend Running with Firebase 🔥' });
});

// ============================================
// CAMERA UPLOAD + PYTHON AI PROCESSING
// ============================================

// Multer upload handler
const upload = multer({ dest: "uploads/" });

// Route the frontend calls when user uploads/captures an image
app.post("/api/take-picture", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No image uploaded" });
        }

        const filePath = req.file.path;

        // Build form-data to send to Python FastAPI backend
        const formData = new FormData();
        formData.append("image", fs.createReadStream(filePath));

        console.log("📤 Sending image to Python AI backend...");

        // Send to Python AI backend with longer timeout
        const pythonResponse = await axios.post(
            "http://127.0.0.1:5001/process-image",
            formData,
            {
                headers: formData.getHeaders(),
                timeout: 150000, // 2.5 minutes timeout
                maxContentLength: Infinity,
                maxBodyLength: Infinity
            }
        );

        // Remove temporary file
        fs.unlinkSync(filePath);

        console.log("✅ AI analysis complete");

        // Return AI analysis to frontend
        res.json({
            success: true,
            analysis: pythonResponse.data.analysis,
            ocr_text: pythonResponse.data.ocr_text,
            method: 'ocr',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error("❌ Error processing image:", error.message);

        // Clean up file if it exists
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        // Better error messages
        let errorMessage = "Failed to process image";
        if (error.code === 'ECONNREFUSED') {
            errorMessage = "Python backend not running. Start it with: python main.py";
        } else if (error.code === 'ECONNABORTED') {
            errorMessage = "Request timeout - AI processing took too long";
        } else if (error.response) {
            errorMessage = error.response.data?.error || error.message;
        }

        res.status(500).json({
            error: errorMessage,
            details: error.message
        });
    }
});

// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🔥 Firebase Firestore connected`);
    console.log(`🤖 Python AI backend expected at http://127.0.0.1:5001`);
});