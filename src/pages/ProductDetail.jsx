import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductByBarcode, getSimilarProducts, translateText } from '../services/api';
import './ProductDetail.css';

function ProductDetail({ user }) {
    const { barcode } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [similar, setSimilar] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [translating, setTranslating] = useState(false);
    const [translatedIngredients, setTranslatedIngredients] = useState('');
    const [allergyWarning, setAllergyWarning] = useState(false);
    const [allergyMatches, setAllergyMatches] = useState([]);

    useEffect(() => {
        fetchProduct();
    }, [barcode]);

    const fetchProduct = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getProductByBarcode(barcode);
            setProduct(data);

            // Check for allergies - enhanced version
            if (user?.allergies && user.allergies.length > 0) {
                const matches = [];
                user.allergies.forEach(allergy => {
                    const allergyLower = allergy.toLowerCase();
                    if (data.ingredients?.toLowerCase().includes(allergyLower)) {
                        matches.push(allergy);
                    }
                    if (data.allergens?.some(a => a.toLowerCase().includes(allergyLower))) {
                        if (!matches.includes(allergy)) {
                            matches.push(allergy);
                        }
                    }
                });
                setAllergyMatches(matches);
                setAllergyWarning(matches.length > 0);
            }

            // Fetch similar products
            const similarData = await getSimilarProducts(barcode);
            setSimilar(similarData);
        } catch (err) {
            setError(err.response?.data?.error || 'Product not found');
        } finally {
            setLoading(false);
        }
    };

    const handleTranslate = async () => {
        if (!product?.ingredients) return;

        setTranslating(true);
        try {
            const result = await translateText(product.ingredients, 'en');
            setTranslatedIngredients(result.translated);
        } catch (err) {
            alert('Translation failed');
        } finally {
            setTranslating(false);
        }
    };

    if (loading) {
        return (
            <div className="product-container">
                <button className="btn-back" onClick={() => navigate('/scanner')}>
                    ← Back to Scanner
                </button>
                <div className="loading-state glass-card">
                    <div className="loader"></div>
                    <p>Loading product details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="product-container">
                <button className="btn-back" onClick={() => navigate('/scanner')}>
                    ← Back to Scanner
                </button>
                <div className="error-state glass-card">
                    <div className="error-icon">⚠️</div>
                    <h2>Product Not Found</h2>
                    <p>{error}</p>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/scanner')}
                    >
                        Try Another Barcode
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="product-container">
            {/* Back Button */}
            <button className="btn-back" onClick={() => navigate('/scanner')}>
                ← Back to Scanner
            </button>

            {/* Main Content */}
            <div className="product-content">
                {/* Left Column - Product Info */}
                <div className="product-main">
                    {/* Product Header Card */}
                    <div className="product-card glass-card">
                        <div className="product-header">
                            {product?.image && (
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="product-image"
                                />
                            )}
                            <div className="product-name-section">
                                <h1 className="product-name">{product?.name || 'Unknown Product'}</h1>
                                <p className="product-brand">{product?.brand || 'Unknown Brand'}</p>
                                <div className="product-meta">
                                    <span className="meta-item">📦 Code: {product?.barcode}</span>
                                    {product?.categories && (
                                        <span className="meta-item">🏷️ {product.categories}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Allergy Warning - Enhanced */}
                        {allergyWarning && allergyMatches.length > 0 && (
                            <div className="allergy-alert alert-error">
                                <div className="alert-header">
                                    <span className="alert-icon">⚠️ ALLERGEN WARNING</span>
                                </div>
                                <div className="alert-content">
                                    <p>This product contains:</p>
                                    <div className="allergen-badges">
                                        {allergyMatches.map(allergen => (
                                            <span key={allergen} className="allergen-badge">
                                                {allergen}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Nutrition Section */}
                        {product?.nutrition && (
                            <div className="nutrition-section">
                                <h3 className="section-title">Nutrition Facts (per 100g)</h3>
                                <div className="nutrition-grid">
                                    <div className="nutrition-item">
                                        <span className="nutrition-label">Calories</span>
                                        <span className="nutrition-value">
                                            {product.nutrition.calories} kcal
                                        </span>
                                    </div>
                                    <div className="nutrition-item">
                                        <span className="nutrition-label">Protein</span>
                                        <span className="nutrition-value">
                                            {product.nutrition.protein || 'N/A'} g
                                        </span>
                                    </div>
                                    <div className="nutrition-item">
                                        <span className="nutrition-label">Fat</span>
                                        <span className="nutrition-value">
                                            {product.nutrition.fat || 'N/A'} g
                                        </span>
                                    </div>
                                    <div className="nutrition-item">
                                        <span className="nutrition-label">Carbs</span>
                                        <span className="nutrition-value">
                                            {product.nutrition.carbs || 'N/A'} g
                                        </span>
                                    </div>
                                    <div className="nutrition-item">
                                        <span className="nutrition-label">Sugar</span>
                                        <span className="nutrition-value">
                                            {product.nutrition.sugar || 'N/A'} g
                                        </span>
                                    </div>
                                    <div className="nutrition-item">
                                        <span className="nutrition-label">Fiber</span>
                                        <span className="nutrition-value">
                                            {product.nutrition.fiber || 'N/A'} g
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Ingredients Section */}
                        {product?.ingredients && (
                            <div className="ingredients-section">
                                <div className="ingredients-header">
                                    <h3 className="section-title">Ingredients</h3>
                                    <button
                                        onClick={handleTranslate}
                                        className="btn btn-secondary btn-sm"
                                        disabled={translating}
                                    >
                                        {translating ? 'Translating...' : '🌐 Translate'}
                                    </button>
                                </div>
                                <div className="ingredients-text">
                                    {translatedIngredients || product.ingredients}
                                </div>
                            </div>
                        )}

                        {/* Allergens Section */}
                        {product?.allergens && product.allergens.length > 0 && (
                            <div className="allergens-section">
                                <h3 className="section-title">Declared Allergens</h3>
                                <div className="allergen-tags">
                                    {product.allergens.map((allergen, index) => (
                                        <span key={index} className="allergen-tag">
                                            {allergen.replace('en:', '')}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Similar Products */}
                        {similar && similar.length > 0 && (
                            <div className="similar-section">
                                <h3 className="section-title">Similar Products</h3>
                                <div className="similar-grid">
                                    {similar.map((item, index) => (
                                        <div
                                            key={index}
                                            className="similar-card"
                                            onClick={() => navigate(`/product/${item.barcode}`)}
                                        >
                                            {item.image && (
                                                <img src={item.image} alt={item.name} />
                                            )}
                                            <h4>{item.name}</h4>
                                            <p>{item.brand}</p>
                                            <small>{item.nutrition?.calories || 'N/A'} kcal/100g</small>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Reviews Section */}
                        {product && (
                            <div className="reviews-section">
                                <h3 className="section-title">Customer Reviews</h3>
                                <div className="review-placeholder">
                                    <p>⭐⭐⭐⭐☆ 4.2 / 5.0</p>
                                    <p className="review-text">"Great product! Good value for money." - Demo User</p>
                                    <p className="review-text">"Tastes amazing, would buy again!" - Another User</p>
                                    <small>Reviews feature coming soon...</small>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column - Sidebar */}
                <div className="product-sidebar">
                    {/* Quick Info Card */}
                    <div className="product-card glass-card sidebar-card">
                        <h3 className="section-title">Quick Info</h3>
                        <div className="quick-info">
                            <div className="info-row">
                                <span className="info-label">Category</span>
                                <span className="info-value">{product?.categories || 'Not specified'}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Brand</span>
                                <span className="info-value">{product?.brand || 'Unknown'}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Barcode</span>
                                <span className="info-value">{product?.barcode}</span>
                            </div>
                            {product?.nutrition && (
                                <div className="info-row">
                                    <span className="info-label">Energy</span>
                                    <span className="info-value">{product.nutrition.calories} kcal/100g</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Health Benefits Card */}
                    <div className="product-card glass-card sidebar-card">
                        <h3 className="section-title">Health Info</h3>
                        <div className="health-info">
                            {allergyWarning ? (
                                <div className="health-item warning">
                                    <div className="health-icon">⚠️</div>
                                    <div className="health-text">
                                        <h4>Contains Allergen</h4>
                                        <p>This product contains {allergyMatches.join(', ')}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="health-item safe">
                                    <div className="health-icon">✅</div>
                                    <div className="health-text">
                                        <h4>Safe for You</h4>
                                        <p>No detected allergens</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Card */}
                    <div className="product-card glass-card sidebar-card action-card">
                        <h3 className="section-title">Actions</h3>
                        <button className="btn btn-primary btn-block">
                            ⭐ Save Product
                        </button>
                        <button
                            className="btn btn-secondary btn-block"
                            onClick={() => navigate('/scanner')}
                        >
                            📸 Scan Another
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;