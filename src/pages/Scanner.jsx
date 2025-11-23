import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Scanner.css';

function Scanner({ user }) {
    const navigate = useNavigate();

    // Existing barcode scanner states
    const [barcode, setBarcode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // NEW AI scanner states
    const [analysis, setAnalysis] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // ===== Barcode manual entry =====
    const handleManualEntry = (e) => {
        e.preventDefault();

        if (!barcode.trim()) {
            setError('Please enter a valid barcode');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        // Simulate API call delay
        setTimeout(() => {
            setSuccess('Product found! Redirecting...');
            setTimeout(() => {
                navigate(`/product/${barcode}`);
            }, 500);
            setLoading(false);
        }, 500);
    };

    const handleQuickTest = () => {
<<<<<<< HEAD
        setLoading(true);
        setError('');
        setSuccess('');

        // Test barcode for Coca-Cola (works with OpenFoodFacts)
        const testBarcode = '5449000000996';

        setTimeout(() => {
            setSuccess('Test product loaded! Redirecting...');
            setBarcode(testBarcode);
            setTimeout(() => {
                navigate(`/product/${testBarcode}`);
            }, 500);
            setLoading(false);
        }, 500);
=======
        navigate('/product/5449000000996');
>>>>>>> a718d7bf7b00594b6b333eb1f0e6117c60615425
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
<<<<<<< HEAD
            {/* Back Button */}
            <button className="btn-back" onClick={() => navigate('/dashboard')}>
                ← Back to Dashboard
            </button>
=======

            {/* ===== Top Navigation ===== */}
            <nav className="scanner-nav">
                <button onClick={() => navigate('/dashboard')} className="btn-back">
                    ← Back to Dashboard
                </button>
                <h2>Product Scanner</h2>
            </nav>
>>>>>>> a718d7bf7b00594b6b333eb1f0e6117c60615425

            {/* Main Content */}
            <div className="scanner-content">
<<<<<<< HEAD
                <div className="scanner-card glass-card">
                    {/* Header */}
                    <div className="scanner-header">
                        <h1>Product Scanner</h1>
                        <p>Scan or enter a barcode to find product details</p>
=======

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
>>>>>>> a718d7bf7b00594b6b333eb1f0e6117c60615425
                    </div>

<<<<<<< HEAD
                    {/* Scanner Placeholder */}
                    <div className="scanner-placeholder">
                        <div className="camera-icon">📷</div>
                        <p className="scanner-status">Camera Scanner Coming Soon</p>
                        <span className="scanner-note">For now, enter barcode manually below</span>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="alert alert-error">
                            <span className="alert-icon">⚠️</span>
                            <p>{error}</p>
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="alert alert-success">
                            <span className="alert-icon">✅</span>
                            <p>{success}</p>
                        </div>
                    )}

                    {/* Input Form */}
                    <form onSubmit={handleManualEntry} className="scanner-form">
                        <div className="form-group">
                            <label htmlFor="barcode" className="form-label">Enter Product Barcode</label>
                            <input
                                id="barcode"
                                type="text"
                                placeholder="e.g., 5449000000996"
                                value={barcode}
                                onChange={(e) => setBarcode(e.target.value)}
                                className="form-input"
                                disabled={loading}
                            />
                        </div>

                        {/* Buttons */}
                        <div className="button-group">
                            <button
                                type="submit"
                                className="btn btn-primary btn-lg"
                                disabled={loading || !barcode.trim()}
                            >
                                {loading ? 'Scanning...' : 'Search Product'}
                            </button>

                            <button
                                type="button"
                                onClick={handleQuickTest}
                                className="btn btn-secondary btn-lg"
                                disabled={loading}
                            >
                                {loading ? 'Loading...' : 'Try Test Product'}
                            </button>
                        </div>
=======
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
>>>>>>> a718d7bf7b00594b6b333eb1f0e6117c60615425
                    </form>

                    {/* Info Section */}
                    <div className="scanner-info">
                        <h3 className="info-title">How it works:</h3>
                        <ul className="info-list">
                            <li>📷 Point camera at product barcode</li>
                            <li>✨ App auto-detects and scans code</li>
                            <li>📊 See nutrition & ingredient data</li>
                            <li>⚠️ Get allergy warnings instantly</li>
                        </ul>
                    </div>
                </div>

<<<<<<< HEAD
                {/* Side Info Card */}
                <div className="scanner-sidebar glass-card">
                    <div className="sidebar-content">
                        <h3 className="sidebar-title">About Scanner</h3>

                        <div className="feature-item">
                            <div className="feature-icon">🎯</div>
                            <div className="feature-text">
                                <h4>Fast Scanning</h4>
                                <p>Scan products in seconds</p>
                            </div>
                        </div>

                        <div className="feature-item">
                            <div className="feature-icon">📚</div>
                            <div className="feature-text">
                                <h4>Rich Database</h4>
                                <p>Millions of products indexed</p>
                            </div>
                        </div>

                        <div className="feature-item">
                            <div className="feature-icon">🔒</div>
                            <div className="feature-text">
                                <h4>Secure Data</h4>
                                <p>Your allergies stay private</p>
                            </div>
                        </div>

                        <div className="feature-item">
                            <div className="feature-icon">🌍</div>
                            <div className="feature-text">
                                <h4>Global Coverage</h4>
                                <p>Works worldwide</p>
                            </div>
                        </div>
                    </div>
=======
                {/* ===== Scanning Tips ===== */}
                <div className="scanner-tips">
                    <h4>Scanning Tips:</h4>
                    <ul>
                        <li>Make sure the barcode is clearly visible</li>
                        <li>Hold your device steady</li>
                        <li>Ensure good lighting</li>
                        <li>The barcode should be centered</li>
                    </ul>
>>>>>>> a718d7bf7b00594b6b333eb1f0e6117c60615425
                </div>
            </div>
        </div>
    );
}

export default Scanner;
