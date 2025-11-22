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

    useEffect(() => {
        fetchProduct();
    }, [barcode]);

    const fetchProduct = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getProductByBarcode(barcode);
            setProduct(data);

            // Check for allergies
            if (user?.allergies && user.allergies.length > 0) {
                const hasAllergen = user.allergies.some(allergy =>
                    data.ingredients?.toLowerCase().includes(allergy.toLowerCase()) ||
                    data.allergens.some(a => a.includes(allergy.toLowerCase()))
                );
                setAllergyWarning(hasAllergen);
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
                <div className="loading">Loading product...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="product-container">
                <div className="error-box">
                    <h2>❌ {error}</h2>
                    <button onClick={() => navigate('/scanner')} className="btn-primary">
                        Try Another Product
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="product-container">
            <nav className="product-nav">
                <button onClick={() => navigate('/scanner')} className="btn-back">
                    ← Back to Scanner
                </button>
                <h2>Product Details</h2>
            </nav>

            {allergyWarning && (
                <div className="allergy-alert">
                    ⚠️ <strong>ALLERGY WARNING:</strong> This product may contain ingredients you're allergic to!
                </div>
            )}

            <div className="product-content">
                <div className="product-header">
                    {product.image && (
                        <img src={product.image} alt={product.name} className="product-image" />
                    )}
                    <div className="product-title-section">
                        <h1>{product.name}</h1>
                        <p className="brand">{product.brand}</p>
                        <p className="barcode">Barcode: {product.barcode}</p>
                    </div>
                </div>

                <div className="product-details">
                    <div className="nutrition-section">
                        <h3>Nutrition Facts (per 100g)</h3>
                        <div className="nutrition-grid">
                            <div className="nutrition-item">
                                <span className="label">Calories</span>
                                <span className="value">{product.nutrition.calories} kcal</span>
                            </div>
                            <div className="nutrition-item">
                                <span className="label">Fat</span>
                                <span className="value">{product.nutrition.fat}g</span>
                            </div>
                            <div className="nutrition-item">
                                <span className="label">Carbs</span>
                                <span className="value">{product.nutrition.carbs}g</span>
                            </div>
                            <div className="nutrition-item">
                                <span className="label">Protein</span>
                                <span className="value">{product.nutrition.protein}g</span>
                            </div>
                            <div className="nutrition-item">
                                <span className="label">Sugar</span>
                                <span className="value">{product.nutrition.sugar}g</span>
                            </div>
                            <div className="nutrition-item">
                                <span className="label">Fiber</span>
                                <span className="value">{product.nutrition.fiber}g</span>
                            </div>
                        </div>
                    </div>

                    <div className="ingredients-section">
                        <div className="section-header">
                            <h3>Ingredients</h3>
                            <button onClick={handleTranslate} className="btn-translate" disabled={translating}>
                                {translating ? 'Translating...' : '🌐 Translate'}
                            </button>
                        </div>
                        <p className="ingredients-text">
                            {translatedIngredients || product.ingredients || 'No ingredients available'}
                        </p>
                    </div>

                    {product.allergens && product.allergens.length > 0 && (
                        <div className="allergens-section">
                            <h3>Allergens</h3>
                            <div className="allergen-tags">
                                {product.allergens.map((allergen, index) => (
                                    <span key={index} className="allergen-tag">
                                        {allergen.replace('en:', '')}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {similar && similar.length > 0 && (
                        <div className="similar-section">
                            <h3>Similar Products</h3>
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
                                        <small>{item.nutrition.calories} kcal/100g</small>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="reviews-section">
                        <h3>Customer Reviews</h3>
                        <div className="review-placeholder">
                            <p>⭐⭐⭐⭐☆ 4.2 / 5.0</p>
                            <p className="review-text">"Great product! Good value for money." - Demo User</p>
                            <p className="review-text">"Tastes amazing, would buy again!" - Another User</p>
                            <small>Reviews feature coming soon...</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;