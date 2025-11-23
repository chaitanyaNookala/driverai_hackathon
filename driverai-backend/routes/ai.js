const express = require("express");
const router = express.Router();
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");

// temporary upload folder
const upload = multer({ dest: "uploads/" });

router.post("/take-picture", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No image uploaded" });
        }

        // send file to Python backend
        const pythonURL = "http://127.0.0.1:5001/process-image";

        const form = new FormData();
        form.append("image", require("fs").createReadStream(req.file.path));

        const response = await axios.post(pythonURL, form, {
            headers: form.getHeaders(),
        });

        return res.json({ analysis: response.data.analysis });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Error processing image" });
    }
});

module.exports = router;
