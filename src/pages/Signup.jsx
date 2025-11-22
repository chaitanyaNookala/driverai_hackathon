import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../services/api';
import Spline from '@splinetool/react-spline';
import GlowingInput from '../components/GlowingInput';
import './Auth.css';

function Signup({ onSignup }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        age: '',
        street: '',
        city: '',
        state: '',
        pincode: '',
        height: '',
        weight: '',
        comfortable: false,
        allergies: [],
        otherAllergy: '',
        healthIssues: [],
        otherHealth: '',
        dietaryPreferences: [],
        otherDiet: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox' && name === 'comfortable') {
            setFormData({ ...formData, comfortable: checked });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleCheckboxArray = (e, arrayName) => {
        const { value, checked } = e.target;

        setFormData(prev => {
            const currentArray = prev[arrayName];

            // If "None" is checked, clear all other selections
            if (value === 'None' && checked) {
                return { ...prev, [arrayName]: ['None'] };
            }

            // If other option is checked while "None" is selected, remove "None"
            if (checked && currentArray.includes('None')) {
                return {
                    ...prev,
                    [arrayName]: [value]
                };
            }

            // Normal checkbox behavior
            if (checked) {
                return {
                    ...prev,
                    [arrayName]: [...currentArray, value]
                };
            } else {
                return {
                    ...prev,
                    [arrayName]: currentArray.filter(item => item !== value)
                };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (!formData.comfortable) {
            setError('Please confirm you are comfortable sharing your details');
            return;
        }

        setLoading(true);

        try {
            // Combine selected allergies with "other" if specified
            let finalAllergies = [...formData.allergies];
            if (formData.allergies.includes('Other') && formData.otherAllergy.trim()) {
                finalAllergies = finalAllergies.filter(a => a !== 'Other');
                finalAllergies.push(formData.otherAllergy.trim());
            }

            // Combine health issues with "other" if specified
            let finalHealth = [...formData.healthIssues];
            if (formData.healthIssues.includes('Other') && formData.otherHealth.trim()) {
                finalHealth = finalHealth.filter(h => h !== 'Other');
                finalHealth.push(formData.otherHealth.trim());
            }

            // Combine dietary preferences with "other" if specified
            let finalDiet = [...formData.dietaryPreferences];
            if (formData.dietaryPreferences.includes('Other') && formData.otherDiet.trim()) {
                finalDiet = finalDiet.filter(d => d !== 'Other');
                finalDiet.push(formData.otherDiet.trim());
            }

            const response = await signup({
                email: formData.email,
                password: formData.password,
                age: formData.age || null,
                address: {
                    street: formData.street,
                    city: formData.city,
                    state: formData.state,
                    pincode: formData.pincode
                },
                height: formData.height || null,
                weight: formData.weight || null,
                allergies: finalAllergies,
                healthIssues: finalHealth,
                dietaryPreferences: finalDiet
            });

            onSignup(response.token, response.user);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Signup failed');
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

            {/* RIGHT SIDE - Signup Form */}
            <div className="auth-form-section">
                <div className="auth-form-container">
                    <div className="auth-header">
                        <h2>Create Your Account</h2>
                        <p>Start your personalized health journey today</p>
                    </div>

                    {error && (
                        <div className="error-message">
                            <span className="error-icon">⚠️</span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        {/* Email */}
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

                        {/* Password */}
                        <div className="form-row-new">
                            <div className="form-group-new">
                                <label htmlFor="password">Password</label>
                                <GlowingInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Min 6 characters"
                                    required
                                    minLength={6}
                                    autoComplete="new-password"
                                />
                            </div>

                            <div className="form-group-new">
                                <label htmlFor="confirmPassword">Confirm</label>
                                <GlowingInput
                                    id="confirmPassword"
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Re-enter"
                                    required
                                    autoComplete="new-password"
                                />
                            </div>
                        </div>

                        {/* Age */}
                        <div className="form-group-new">
                            <label htmlFor="age">Age</label>
                            <GlowingInput
                                id="age"
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                placeholder="e.g., 21"
                                min="1"
                                max="150"
                                required
                            />
                        </div>

                        {/* Address */}
                        <div className="form-group-new">
                            <label htmlFor="street">Address</label>
                            <GlowingInput
                                id="street"
                                type="text"
                                name="street"
                                value={formData.street}
                                onChange={handleChange}
                                placeholder="Street / House No."
                                required
                            />
                            <div style={{ marginTop: '8px' }}>
                                <GlowingInput
                                    id="city"
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="City"
                                    required
                                />
                            </div>
                            <div style={{ marginTop: '8px' }}>
                                <GlowingInput
                                    id="state"
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    placeholder="State / Province"
                                    required
                                />
                            </div>
                        </div>

                        {/* Pincode */}
                        <div className="form-group-new">
                            <label htmlFor="pincode">Pincode</label>
                            <GlowingInput
                                id="pincode"
                                type="text"
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleChange}
                                placeholder="5-6 digits"
                                required
                            />
                        </div>

                        {/* Height & Weight */}
                        <div className="form-row-new">
                            <div className="form-group-new">
                                <label htmlFor="height">Height (cm)</label>
                                <GlowingInput
                                    id="height"
                                    type="number"
                                    name="height"
                                    value={formData.height}
                                    onChange={handleChange}
                                    placeholder="170"
                                    min="50"
                                    max="300"
                                />
                            </div>

                            <div className="form-group-new">
                                <label htmlFor="weight">Weight (kg)</label>
                                <GlowingInput
                                    id="weight"
                                    type="number"
                                    name="weight"
                                    value={formData.weight}
                                    onChange={handleChange}
                                    placeholder="70"
                                    min="20"
                                    max="500"
                                />
                            </div>
                        </div>

                        {/* Comfortable Sharing Checkbox */}
                        <div className="form-group-new">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="comfortable"
                                    checked={formData.comfortable}
                                    onChange={handleChange}
                                    className="checkbox-input"
                                />
                                <span>I am comfortable sharing my details</span>
                            </label>
                        </div>

                        {/* Food Allergies */}
                        <div className="form-group-new">
                            <label>Food Allergies (check all that apply):</label>
                            <div className="checklist">
                                {['None', 'Milk', 'Eggs', 'Peanuts', 'Tree nuts', 'Fish', 'Shellfish', 'Wheat', 'Soy', 'Sesame'].map(allergy => (
                                    <label key={allergy} className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            value={allergy}
                                            checked={formData.allergies.includes(allergy)}
                                            onChange={(e) => handleCheckboxArray(e, 'allergies')}
                                            className="checkbox-input"
                                        />
                                        <span>{allergy}</span>
                                    </label>
                                ))}
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        value="Other"
                                        checked={formData.allergies.includes('Other')}
                                        onChange={(e) => handleCheckboxArray(e, 'allergies')}
                                        className="checkbox-input"
                                    />
                                    <span>Other:</span>
                                    <input
                                        type="text"
                                        name="otherAllergy"
                                        value={formData.otherAllergy}
                                        onChange={handleChange}
                                        placeholder="Enter other allergy"
                                        disabled={!formData.allergies.includes('Other')}
                                        className="other-input"
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Health Issues */}
                        <div className="form-group-new">
                            <label>Health Issues (check all that apply):</label>
                            <div className="checklist">
                                {['None', 'Diabetes', 'Blood Pressure', 'Heart disease', 'Asthma', 'Arthritis', 'Cancer', 'Depression/Anxiety'].map(health => (
                                    <label key={health} className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            value={health}
                                            checked={formData.healthIssues.includes(health)}
                                            onChange={(e) => handleCheckboxArray(e, 'healthIssues')}
                                            className="checkbox-input"
                                        />
                                        <span>{health}</span>
                                    </label>
                                ))}
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        value="Other"
                                        checked={formData.healthIssues.includes('Other')}
                                        onChange={(e) => handleCheckboxArray(e, 'healthIssues')}
                                        className="checkbox-input"
                                    />
                                    <span>Other:</span>
                                    <input
                                        type="text"
                                        name="otherHealth"
                                        value={formData.otherHealth}
                                        onChange={handleChange}
                                        placeholder="Enter other condition"
                                        disabled={!formData.healthIssues.includes('Other')}
                                        className="other-input"
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Dietary Preferences */}
                        <div className="form-group-new">
                            <label>Dietary Preferences (check all that apply):</label>
                            <div className="checklist">
                                {['None', 'Vegetarian', 'Vegan', 'Pescatarian', 'Flexitarian', 'Gluten-free', 'Dairy-free', 'Keto', 'Paleo', 'Halal', 'Kosher'].map(diet => (
                                    <label key={diet} className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            value={diet}
                                            checked={formData.dietaryPreferences.includes(diet)}
                                            onChange={(e) => handleCheckboxArray(e, 'dietaryPreferences')}
                                            className="checkbox-input"
                                        />
                                        <span>{diet}</span>
                                    </label>
                                ))}
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        value="Other"
                                        checked={formData.dietaryPreferences.includes('Other')}
                                        onChange={(e) => handleCheckboxArray(e, 'dietaryPreferences')}
                                        className="checkbox-input"
                                    />
                                    <span>Other:</span>
                                    <input
                                        type="text"
                                        name="otherDiet"
                                        value={formData.otherDiet}
                                        onChange={handleChange}
                                        placeholder="Enter other preference"
                                        disabled={!formData.dietaryPreferences.includes('Other')}
                                        className="other-input"
                                    />
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn-primary-new"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="btn-loading">
                                    <span className="spinner"></span>
                                    Creating Account...
                                </span>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    <div className="auth-footer-new">
                        <p>Already have an account? <Link to="/login">Login</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;