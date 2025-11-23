import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeImage } from '../services/api';
import './Scanner.css';

function Scanner({ user }) {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    // ===== Barcode States =====
    const [barcode, setBarcode] = useState('');
    const [barcodeLoading, setBarcodeLoading] = useState(false);
    const [barcodeError, setBarcodeError] = useState('');
    const [barcodeSuccess, setBarcodeSuccess] = useState('');

    // ===== AI Image Scanner States =====
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState('');
    const [aiSuccess, setAiSuccess] = useState('');
    const [analysis, setAnalysis] = useState('');
    const [ocrText, setOcrText] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);

    // ===== Tab State =====
    const [activeTab, setActiveTab] = useState('barcode'); // 'barcode' or 'ai'

    // ===== BARCODE SCANNER =====
    const handleManualEntry = (e) => {
        e.preventDefault();

        if (!barcode.trim()) {
            setBarcodeError('Please enter a valid barcode');
            return;
        }

        setBarcodeLoading(true);
        setBarcodeError('');
        setBarcodeSuccess('');

        // Simulate API call delay
        setTimeout(() => {
            setBarcodeSuccess('Product found! Redirecting...');
            setTimeout(() => {
                navigate(`/product/${barcode}`);
            }, 500);
            setBarcodeLoading(false);
        }, 500);
    };

    const handleQuickTest = () => {
        setBarcodeLoading(true);
        setBarcodeError('');
        setBarcodeSuccess('');

        // Test barcode for Coca-Cola (works with OpenFoodFacts)
        const testBarcode = '5449000000996';

        setTimeout(() => {
            setBarcodeSuccess('Test product loaded! Redirecting...');
            setBarcode(testBarcode);
            setTimeout(() => {
                navigate(`/product/${testBarcode}`);
            }, 500);
            setBarcodeLoading(false);
        }, 500);
    };

    // ===== AI IMAGE SCANNER =====
    const handleImageSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setAiError('Please select a valid image file');
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            setAiError('Image size must be less than 10MB');
            return;
        }

        setSelectedImage(file);
        setAiError('');
        setAnalysis('');
        setOcrText('');

        // Show preview
        const reader = new FileReader();
        reader.onload = (event) => {
            // You can use this for image preview if needed
        };
        reader.readAsDataURL(file);
    };

    const handleImageUpload = async () => {
        if (!selectedImage) {
            setAiError('Please select an image first');
            return;
        }

        setAiLoading(true);
        setAiError('');
        setAiSuccess('');
        setAnalysis('');
        setOcrText('');

        try {
            // Call Python AI backend via api.js
            const result = await analyzeImage(selectedImage, false); // false = direct vision

            if (!result.success) {
                throw new Error(result.error || 'Failed to process image');
            }

            // Create image preview URL for the results page
            const imagePreview = URL.createObjectURL(selectedImage);

            // Navigate to AI Analysis Result page
            navigate('/ai-analysis', {
                state: {
                    analysisData: result,
                    imagePreview: imagePreview
                }
            });

        } catch (err) {
            console.error('Error:', err);
            setAiError(
                err.message ||
                'Failed to process image. Make sure Python backend is running on http://localhost:5001'
            );
        } finally {
            setAiLoading(false);
        }
    };

    const handleClearAnalysis = () => {
        setAnalysis('');
        setOcrText('');
        setSelectedImage(null);
        setAiError('');
        setAiSuccess('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // ===== RENDER =====
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
                        <p>Scan products by barcode or AI image analysis</p>
                    </div>

                    {/* Tab Navigation */}
                    <div className="tab-navigation">
                        <button
                            className={`tab-btn ${activeTab === 'barcode' ? 'active' : ''}`}
                            onClick={() => setActiveTab('barcode')}
                        >
                            📱 Barcode Scanner
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'ai' ? 'active' : ''}`}
                            onClick={() => setActiveTab('ai')}
                        >
                            📷 AI Image Scanner
                        </button>
                    </div>

                    {/* ===== BARCODE TAB ===== */}
                    {activeTab === 'barcode' && (
                        <div className="tab-content">
                            {/* Scanner Placeholder */}
                            <div className="scanner-placeholder">
                                <div className="camera-icon">📱</div>
                                <p className="scanner-status">Barcode Scanner</p>
                                <span className="scanner-note">Enter barcode manually</span>
                            </div>

                            {/* Error Message */}
                            {barcodeError && (
                                <div className="alert alert-error">
                                    <span className="alert-icon">⚠️</span>
                                    <p>{barcodeError}</p>
                                </div>
                            )}

                            {/* Success Message */}
                            {barcodeSuccess && (
                                <div className="alert alert-success">
                                    <span className="alert-icon">✅</span>
                                    <p>{barcodeSuccess}</p>
                                </div>
                            )}

                            {/* Input Form */}
                            <form onSubmit={handleManualEntry} className="scanner-form">
                                <div className="form-group">
                                    <label htmlFor="barcode" className="form-label">
                                        Enter Product Barcode
                                    </label>
                                    <input
                                        id="barcode"
                                        type="text"
                                        placeholder="e.g., 5449000000996"
                                        value={barcode}
                                        onChange={(e) => setBarcode(e.target.value)}
                                        className="form-input"
                                        disabled={barcodeLoading}
                                    />
                                </div>

                                {/* Buttons */}
                                <div className="button-group">
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-lg"
                                        disabled={barcodeLoading || !barcode.trim()}
                                    >
                                        {barcodeLoading ? 'Scanning...' : 'Search Product'}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleQuickTest}
                                        className="btn btn-secondary btn-lg"
                                        disabled={barcodeLoading}
                                    >
                                        {barcodeLoading ? 'Loading...' : 'Try Test Product'}
                                    </button>
                                </div>
                            </form>

                            {/* Info Section */}
                            <div className="scanner-info">
                                <h3 className="info-title">How Barcode Scanner Works:</h3>
                                <ul className="info-list">
                                    <li>Enter the product barcode</li>
                                    <li>Click "Search Product" to find details</li>
                                    <li>View nutrition and ingredient data</li>
                                    <li>Get instant allergy warnings</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* ===== AI IMAGE TAB ===== */}
                    {activeTab === 'ai' && (
                        <div className="tab-content">
                            {/* AI Scanner Placeholder */}
                            <div className="scanner-placeholder">
                                <div className="camera-icon">📷</div>
                                <p className="scanner-status">AI Product Scanner</p>
                                <span className="scanner-note">
                                    Take a photo of the product label
                                </span>
                            </div>

                            {/* Error Message */}
                            {aiError && (
                                <div className="alert alert-error">
                                    <span className="alert-icon">⚠️</span>
                                    <p>{aiError}</p>
                                </div>
                            )}

                            {/* Success Message */}
                            {aiSuccess && (
                                <div className="alert alert-success">
                                    <span className="alert-icon">✅</span>
                                    <p>{aiSuccess}</p>
                                </div>
                            )}

                            {/* Image Upload */}
                            <div className="ai-scanner-form">
                                <div className="form-group">
                                    <label htmlFor="image-upload" className="form-label">
                                        Select Product Image
                                    </label>
                                    <div className="file-input-wrapper">
                                        <input
                                            ref={fileInputRef}
                                            id="image-upload"
                                            type="file"
                                            accept="image/*"
                                            capture="environment"
                                            onChange={handleImageSelect}
                                            className="file-input"
                                        />
                                        <label htmlFor="image-upload" className="file-input-label">
                                            {selectedImage ? selectedImage.name : '📸 Choose Image or Take Photo'}
                                        </label>
                                    </div>
                                </div>

                                {/* Upload Button */}
                                <div className="button-group">
                                    <button
                                        type="button"
                                        onClick={handleImageUpload}
                                        className="btn btn-primary btn-lg"
                                        disabled={!selectedImage || aiLoading}
                                    >
                                        {aiLoading ? 'Processing...' : '🔍 Analyze Image'}
                                    </button>

                                    {analysis && (
                                        <button
                                            type="button"
                                            onClick={handleClearAnalysis}
                                            className="btn btn-secondary btn-lg"
                                            disabled={aiLoading}
                                        >
                                            Clear
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Loading State */}
                            {aiLoading && (
                                <div className="loading-box">
                                    <div className="spinner"></div>
                                    <p>Processing image with AI...</p>
                                    <small>This may take 10-30 seconds</small>
                                </div>
                            )}

                            {/* Analysis Results */}
                            {analysis && (
                                <div className="analysis-results">
                                    {ocrText && (
                                        <div className="result-section">
                                            <h3>📝 Extracted Text (OCR)</h3>
                                            <div className="result-content ocr-text">
                                                {ocrText}
                                            </div>
                                        </div>
                                    )}

                                    <div className="result-section">
                                        <h3>🤖 AI Analysis</h3>
                                        <div className="result-content analysis-text">
                                            {analysis.split('\n').map((line, idx) => (
                                                <div key={idx}>{line}</div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Info Section */}
                            <div className="scanner-info">
                                <h3 className="info-title">How AI Scanner Works:</h3>
                                <ul className="info-list">
                                    <li>📸 Take a clear photo of product label</li>
                                    <li>🔍 AI extracts text using OCR</li>
                                    <li>🤖 Analyzes with Gemini AI</li>
                                    <li>📊 Shows detailed product info</li>
                                    <li>🌍 Provides translations & recommendations</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>

                {/* Side Info Card */}
                <div className="scanner-sidebar glass-card">
                    <div className="sidebar-content">
                        <h3 className="sidebar-title">About Scanner</h3>

                        <div className="feature-item">
                            <div className="feature-icon">🎯</div>
                            <div className="feature-text">
                                <h4>Dual Scanning</h4>
                                <p>Barcode or AI image</p>
                            </div>
                        </div>

                        <div className="feature-item">
                            <div className="feature-icon">📚</div>
                            <div className="feature-text">
                                <h4>Rich Data</h4>
                                <p>Millions of products</p>
                            </div>
                        </div>

                        <div className="feature-item">
                            <div className="feature-icon">🤖</div>
                            <div className="feature-text">
                                <h4>AI Powered</h4>
                                <p>Gemini AI analysis</p>
                            </div>
                        </div>

                        <div className="feature-item">
                            <div className="feature-icon">🔒</div>
                            <div className="feature-text">
                                <h4>Secure Data</h4>
                                <p>Your privacy protected</p>
                            </div>
                        </div>

                        <div className="feature-item">
                            <div className="feature-icon">⚠️</div>
                            <div className="feature-text">
                                <h4>Allergy Safe</h4>
                                <p>Instant warnings</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Scanner;