import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Scanner.css';

function Scanner({ user }) {
    const navigate = useNavigate();

    // Existing barcode scanner states
    const [barcode, setBarcode] = useState('');
    const [scanning, setScanning] = useState(false);

    // NEW AI scanner states
    const [analysis, setAnalysis] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // ===== Barcode manual entry =====
    const handleManualEntry = (e) => {
        e.preventDefault();
        if (barcode.trim()) {
            navigate(`/product/${barcode}`);
        }
    };

    const handleQuickTest = () => {
        navigate('/product/5449000000996');
    };

    // ===== AI image scanner upload =====
    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setLoading(true);
        setError("");
        setAnalysis("");

        try {
            const formData = new FormData();
            formData.append("image", file); // must match multer field

            const res = await fetch("http://localhost:5000/api/take-picture", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                setAnalysis(data.analysis || "No analysis returned.");
            } else {
                setError(data.error || "Backend error.");
            }
        } catch (err) {
            console.error(err);
            setError("Failed to send image to backend.");
        }

        setLoading(false);
    };
    console.log("Scanner page loaded!");

    return (
        <div className="scanner-container">

            {/* ===== Top Navigation ===== */}
            <nav className="scanner-nav">
                <button onClick={() => navigate('/dashboard')} className="btn-back">
                    ← Back to Dashboard
                </button>
                <h2>Product Scanner</h2>
            </nav>

            <div className="scanner-content">

                {/* ===== AI CAMERA SCANNER SECTION ===== */}
                <div className="scanner-box">
                    <div className="camera-placeholder">
                        <h3>AI Product Scanner (Photo)</h3>

                        <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={handleImageUpload}
                            className="camera-input"
                        />

                        {loading && <p>Processing image… please wait.</p>}
                        {error && <p style={{ color: "red" }}>{error}</p>}

                        {analysis && (
                            <div className="analysis-box">
                                <h3>AI Analysis</h3>
                                <pre style={{ whiteSpace: "pre-wrap" }}>
                                    {analysis}
                                </pre>
                            </div>
                        )}
                    </div>
                </div>

                {/* ===== Manual Barcode Entry ===== */}
                <div className="manual-entry">
                    <h3>Enter Barcode Manually</h3>
                    <form onSubmit={handleManualEntry}>
                        <input
                            type="text"
                            value={barcode}
                            onChange={(e) => setBarcode(e.target.value)}
                            placeholder="Enter product barcode"
                            className="barcode-input"
                        />
                        <button type="submit" className="btn-primary">
                            Search Product
                        </button>
                    </form>

                    <div className="quick-test">
                        <p>Want to test? Try this sample:</p>
                        <button onClick={handleQuickTest} className="btn-test">
                            Test with Coca-Cola (5449000000996)
                        </button>
                    </div>
                </div>

                {/* ===== Scanning Tips ===== */}
                <div className="scanner-tips">
                    <h4>Scanning Tips:</h4>
                    <ul>
                        <li>Make sure the barcode is clearly visible</li>
                        <li>Hold your device steady</li>
                        <li>Ensure good lighting</li>
                        <li>The barcode should be centered</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Scanner;
