import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Scanner.css';

function Scanner({ user }) {
    const navigate = useNavigate();
    const [barcode, setBarcode] = useState('');
    const [scanning, setScanning] = useState(false);

    const handleManualEntry = (e) => {
        e.preventDefault();
        if (barcode.trim()) {
            navigate(`/product/${barcode}`);
        }
    };

    const handleQuickTest = () => {
        // Test barcode for Coca-Cola (works with OpenFoodFacts)
        navigate('/product/5449000000996');
    };

    return (
        <div className="scanner-container">
            <nav className="scanner-nav">
                <button onClick={() => navigate('/dashboard')} className="btn-back">
                    ← Back to Dashboard
                </button>
                <h2>Product Scanner</h2>
            </nav>

            <div className="scanner-content">
                <div className="scanner-box">
                    <div className="camera-placeholder">
                        <div className="camera-icon">📷</div>
                        <p>Camera Scanner Coming Soon</p>
                        <small>For now, enter barcode manually below</small>
                    </div>
                </div>

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