import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';
import GlowingInput from '../components/GlowingInput';
import './Auth.css';
import Spline from '@splinetool/react-spline';

function Login({ onLogin }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await login(formData);
            onLogin(response.token, response.user);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container-new">
            {/* LEFT SIDE - Spline Animation */}
            <div className="auth-visual">
                <Spline
                    scene="https://prod.spline.design/aDfp7bALkuovClH6/scene.splinecode"
                />
            </div>

            {/* RIGHT SIDE - Login Form */}
            <div className="auth-form-section">
                <div className="auth-form-container">
                    <div className="auth-header">
                        <h2>Welcome Back</h2>
                        <p>Login to continue your health journey</p>
                    </div>

                    {error && (
                        <div className="error-message">
                            <span className="error-icon">⚠️</span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group-new">
                            <label htmlFor="email">Email Address</label>
                            <GlowingInput
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                required
                                autoComplete="email"
                            />
                        </div>

                        <div className="form-group-new">
                            <label htmlFor="password">Password</label>
                            <GlowingInput
                                id="password"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                                autoComplete="current-password"
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn-primary-new"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="btn-loading">
                                    <span className="spinner"></span>
                                    Logging in...
                                </span>
                            ) : (
                                'Login'
                            )}
                        </button>
                    </form>

                    <div className="auth-footer-new">
                        <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
                    </div>

                    <div className="auth-features">
                        <div className="feature-item">
                            <span className="feature-icon">🔍</span>
                            <span>Product Scanning</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">⚡</span>
                            <span>Instant Analysis</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">🛡️</span>
                            <span>Allergy Protection</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;