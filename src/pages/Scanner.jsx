import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Scanner.css';

function Scanner({ user }) {
    const navigate = useNavigate();
    const [barcode, setBarcode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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
    };

    return (
        <div className="scanner-container">
            {/* Back Button */}
            <button className="btn-back" onClick={() => navigate('/dashboard')}>
                ← Back to Dashboard
            </button>

            {/* Main Content */}
            <div className="scanner-content">
                <div className="scanner-card glass-card">
                    {/* Header */}
                    <div className="scanner-header">
                        <h1>Product Scanner</h1>
                        <p>Scan or enter a barcode to find product details</p>
                    </div>

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
                </div>
            </div>
        </div>
    );
}

export default Scanner;