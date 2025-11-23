const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'DriverAI Backend Running' });
});

// === Camera Upload + Python Processing ===
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

// Multer upload handler
const upload = multer({ dest: "uploads/" });

// Route the frontend will call when user uploads an image
app.post("/api/take-picture", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No image uploaded" });
        }

        const filePath = req.file.path;

        // Build form-data to send to Python
        const formData = new FormData();
        formData.append("image", fs.createReadStream(filePath)); // MUST match Python field name

        // Send to Python FastAPI backend
        const pythonResponse = await axios.post(
            "http://127.0.0.1:5001/process-image",
            formData,
            { headers: formData.getHeaders() }
        );

        // Remove temporary file
        fs.unlinkSync(filePath);

        // Return AI analysis to frontend
        res.json({
            analysis: pythonResponse.data.analysis,
        });

    } catch (error) {
        console.error("Error sending image to Python:", error.message);
        res.status(500).json({ error: "Failed to process image" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
