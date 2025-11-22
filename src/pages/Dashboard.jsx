import { useNavigate } from 'react-router-dom';
import { useRef, useEffect } from 'react';
import LaserFlow from '../components/LaserFlow';
import ScrollVelocity from '../components/ScrollVelocity';
import groceryStore from '../components/assets/images/image.png';
import './Dashboard.css';

function Dashboard({ user, onLogout }) {
    const navigate = useNavigate();
    const revealImgRef = useRef(null);

    useEffect(() => {
        const handleMouseMove = (e) => {
            const x = e.clientX;
            const y = e.clientY;
            const el = revealImgRef.current;
            if (el) {
                el.style.setProperty('--mx', `${x}px`);
                el.style.setProperty('--my', `${y}px`);
            }
        };

        const handleMouseLeave = () => {
            const el = revealImgRef.current;
            if (el) {
                el.style.setProperty('--mx', '-9999px');
                el.style.setProperty('--my', '-9999px');
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <div className="dashboard-container">
            {/* Laser Background Effect */}
            <div className="laser-background">
                <LaserFlow
                    horizontalBeamOffset={0.5}
                    verticalBeamOffset={0.0}
                    color="#a099d8"
                    fogIntensity={0.6}
                    wispDensity={1.2}
                    flowSpeed={0.4}
                />
            </div>

            {/* Revealed Background Image */}
            <img
                ref={revealImgRef}
                src={groceryStore}
                alt="Grocery Store"
                className="reveal-image"
                style={{
                    '--mx': '-9999px',
                    '--my': '-9999px'
                }}
            />

            {/* Dashboard Content */}
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

                <div className="user-info-card glass-card">
                    <h3>Your Profile</h3>
                    <div className="info-grid">
                        <div className="info-item">
                            <span className="label">Email:</span>
                            <span className="value">{user?.email}</span>
                        </div>
                        {user?.age && (
                            <div className="info-item">
                                <span className="label">Age:</span>
                                <span className="value">{user.age} years</span>
                            </div>
                        )}
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
                        {user?.address && (
                            <div className="info-item">
                                <span className="label">Address:</span>
                                <span className="value">
                                    {user.address.street}, {user.address.city}, {user.address.state} - {user.address.pincode}
                                </span>
                            </div>
                        )}
                        <div className="info-item">
                            <span className="label">Allergies:</span>
                            <span className="value">
                                {user?.allergies?.length > 0 ? user.allergies.join(', ') : 'None'}
                            </span>
                        </div>
                        {user?.healthIssues && user.healthIssues.length > 0 && (
                            <div className="info-item">
                                <span className="label">Health Issues:</span>
                                <span className="value">{user.healthIssues.join(', ')}</span>
                            </div>
                        )}
                        {user?.dietaryPreferences && user.dietaryPreferences.length > 0 && (
                            <div className="info-item">
                                <span className="label">Diet:</span>
                                <span className="value">{user.dietaryPreferences.join(', ')}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="action-cards">
                    <div className="action-card glass-card" onClick={() => navigate('/scanner')}>
                        <div className="card-icon">📷</div>
                        <h3>Scan Product</h3>
                        <p>Scan barcode to get product information</p>
                        <button className="btn-primary">Start Scanning</button>
                    </div>

                    <div className="action-card glass-card disabled">
                        <div className="card-icon">📊</div>
                        <h3>Scan History</h3>
                        <p>View your previously scanned products</p>
                        <button className="btn-secondary" disabled>Coming Soon</button>
                    </div>

                    <div className="action-card glass-card disabled">
                        <div className="card-icon">⭐</div>
                        <h3>Favorites</h3>
                        <p>Save products you love</p>
                        <button className="btn-secondary" disabled>Coming Soon</button>
                    </div>
                </div>

                {/* Scrolling Text with Scroll Velocity */}
                <ScrollVelocity
                    texts={[
                        'SCAN PRODUCTS • NUTRITION INFO • CHECK ALLERGIES •',
                        'FIND ALTERNATIVES • TRANSLATE • STAY HEALTHY •'
                    ]}
                    velocity={26}
                    className="custom-scroll-text"
                    damping={50}
                    stiffness={400}
                    numCopies={8}
                />
            </div>
        </div>
    );
}

export default Dashboard;