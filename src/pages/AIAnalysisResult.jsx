import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import './AIAnalysisResult.css';

function AIAnalysisResult({ user }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        // Get analysis data from navigation state
        const data = location.state?.analysisData;
        const image = location.state?.imagePreview;

        if (!data) {
            navigate('/scanner');
            return;
        }

        setAnalysis(data);
        setImagePreview(image);
        setLoading(false);

        // Check for allergen warnings
        if (user?.allergies && data.analysis) {
            checkForAllergens(data.analysis);
        }
    }, [location, navigate, user]);

    const [allergyWarning, setAllergyWarning] = useState(false);
    const [allergyMatches, setAllergyMatches] = useState([]);

    const checkForAllergens = (analysisText) => {
        if (!user?.allergies || user.allergies.length === 0) return;

        const matches = [];
        const textLower = analysisText.toLowerCase();

        user.allergies.forEach(allergy => {
            const allergyLower = allergy.toLowerCase();
            if (textLower.includes(allergyLower)) {
                matches.push(allergy);
            }
        });

        setAllergyMatches(matches);
        setAllergyWarning(matches.length > 0);
    };

    if (loading) {
        return (
            <div className="ai-result-container">
                <div className="loading-state">
                    <div className="loader"></div>
                    <p>Loading analysis...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="ai-result-container">
            {/* Header */}
            <div className="result-header">
                <button className="btn-back" onClick={() => navigate('/scanner')}>
                    ← Back to Scanner
                </button>
                <h1>🤖 AI Product Analysis</h1>
            </div>

            <div className="result-content">
                {/* Left Column - Analysis */}
                <div className="result-main">
                    {/* Allergy Warning (if applicable) */}
                    {allergyWarning && allergyMatches.length > 0 && (
                        <div className="allergy-alert glass-card alert-error">
                            <div className="alert-header">
                                <span className="alert-icon">⚠️ ALLERGEN WARNING</span>
                            </div>
                            <div className="alert-content">
                                <p><strong>This product may contain:</strong></p>
                                <div className="allergen-badges">
                                    {allergyMatches.map(allergen => (
                                        <span key={allergen} className="allergen-badge">
                                            {allergen}
                                        </span>
                                    ))}
                                </div>
                                <p className="alert-note">
                                    Based on your profile allergies: {user.allergies.join(', ')}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* AI Analysis Card */}
                    <div className="analysis-card glass-card">
                        <div className="analysis-header">
                            <h2>📋 Detailed Analysis</h2>
                            <span className="analysis-method">
                                {analysis.method === 'ocr' ? '🔤 OCR Analysis' : '👁️ Vision Analysis'}
                            </span>
                        </div>

                        {/* Markdown Rendered Analysis */}
                        <div className="analysis-content">
                            <ReactMarkdown
                                components={{
                                    h1: ({ node, ...props }) => <h2 className="md-h1" {...props} />,
                                    h2: ({ node, ...props }) => <h3 className="md-h2" {...props} />,
                                    h3: ({ node, ...props }) => <h4 className="md-h3" {...props} />,
                                    ul: ({ node, ...props }) => <ul className="md-list" {...props} />,
                                    ol: ({ node, ...props }) => <ol className="md-list" {...props} />,
                                    li: ({ node, ...props }) => <li className="md-list-item" {...props} />,
                                    p: ({ node, ...props }) => <p className="md-paragraph" {...props} />,
                                    strong: ({ node, ...props }) => <strong className="md-strong" {...props} />,
                                    code: ({ node, inline, ...props }) =>
                                        inline ?
                                            <code className="md-code-inline" {...props} /> :
                                            <code className="md-code-block" {...props} />,
                                }}
                            >
                                {analysis.analysis}
                            </ReactMarkdown>
                        </div>

                        {/* OCR Text (if available) */}
                        {analysis.ocr_text && (
                            <details className="ocr-details">
                                <summary>📝 View Extracted Text (OCR)</summary>
                                <pre className="ocr-text">{analysis.ocr_text}</pre>
                            </details>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="action-buttons">
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/scanner')}
                        >
                            📸 Scan Another Product
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => navigate('/dashboard')}
                        >
                            🏠 Back to Dashboard
                        </button>
                    </div>
                </div>

                {/* Right Sidebar - Image & Info */}
                <div className="result-sidebar">
                    {/* Product Image Preview */}
                    {imagePreview && (
                        <div className="image-card glass-card">
                            <h3>📷 Scanned Image</h3>
                            <img
                                src={imagePreview}
                                alt="Scanned product"
                                className="scanned-image"
                            />
                        </div>
                    )}

                    {/* Analysis Info */}
                    <div className="info-card glass-card">
                        <h3>ℹ️ Analysis Info</h3>
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">Method</span>
                                <span className="info-value">
                                    {analysis.method === 'ocr' ? 'OCR + AI' : 'Direct Vision'}
                                </span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Timestamp</span>
                                <span className="info-value">
                                    {new Date(analysis.timestamp).toLocaleString()}
                                </span>
                            </div>
                            {user && (
                                <div className="info-item">
                                    <span className="info-label">User</span>
                                    <span className="info-value">{user.email}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Health Profile Match */}
                    {user && (
                        <div className="profile-card glass-card">
                            <h3>👤 Your Profile</h3>
                            <div className="profile-info">
                                {user.allergies && user.allergies.length > 0 && (
                                    <div className="profile-section">
                                        <strong>Your Allergies:</strong>
                                        <div className="profile-tags">
                                            {user.allergies.map(allergy => (
                                                <span
                                                    key={allergy}
                                                    className={`profile-tag ${allergyMatches.includes(allergy) ? 'match' : ''}`}
                                                >
                                                    {allergy} {allergyMatches.includes(allergy) && '⚠️'}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {user.dietaryPreferences && user.dietaryPreferences.length > 0 && (
                                    <div className="profile-section">
                                        <strong>Dietary Preferences:</strong>
                                        <div className="profile-tags">
                                            {user.dietaryPreferences.map(pref => (
                                                <span key={pref} className="profile-tag">
                                                    {pref}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AIAnalysisResult;