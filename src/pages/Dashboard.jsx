import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard({ user, onLogout }) {
    const navigate = useNavigate();

    return (
        <div className="dashboard-container">
            <nav className="dashboard-nav">
                <h1>DriverAI Nutrition</h1>
                <div className="nav-actions">
                    <span className="user-email">{user?.email}</span>
                    <button onClick={onLogout} className="btn-logout">
                        Logout
                    </button>
                </div>
            </nav>

            <div className="dashboard-content">
                <div className="welcome-section">
                    <h2>Welcome back! 👋</h2>
                    <p>Scan products to get instant nutrition information and allergy warnings.</p>
                </div>

                <div className="user-info-card">
                    <h3>Your Profile</h3>
                    <div className="info-grid">
                        <div className="info-item">
                            <span className="label">Email:</span>
                            <span className="value">{user?.email}</span>
                        </div>
                        {user?.height && (
                            <div className="info-item">
                                <span className="label">Height:</span>
                                <span className="value">{user.height} cm</span>
                            </div>
                        )}
                        {user?.weight && (
                            <div className="info-item">
                                <span className="label">Weight:</span>
                                <span className="value">{user.weight} kg</span>
                            </div>
                        )}
                        <div className="info-item">
                            <span className="label">Allergies:</span>
                            <span className="value">
                                {user?.allergies?.length > 0
                                    ? user.allergies.join(', ')
                                    : 'None'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="action-cards">
                    <div className="action-card" onClick={() => navigate('/scanner')}>
                        <div className="card-icon">📷</div>
                        <h3>Scan Product</h3>
                        <p>Scan barcode to get product information</p>
                        <button className="btn-primary">Start Scanning</button>
                    </div>

                    <div className="action-card disabled">
                        <div className="card-icon">📊</div>
                        <h3>Scan History</h3>
                        <p>View your previously scanned products</p>
                        <button className="btn-secondary" disabled>Coming Soon</button>
                    </div>

                    <div className="action-card disabled">
                        <div className="card-icon">⭐</div>
                        <h3>Favorites</h3>
                        <p>Save products you love</p>
                        <button className="btn-secondary" disabled>Coming Soon</button>
                    </div>
                </div>

                <div className="features-section">
                    <h3>What You Can Do</h3>
                    <ul className="features-list">
                        <li>✅ Scan product barcodes instantly</li>
                        <li>✅ View detailed nutrition information</li>
                        <li>✅ Get allergy warnings based on your profile</li>
                        <li>✅ See similar product recommendations</li>
                        <li>✅ Translate ingredients to English</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;