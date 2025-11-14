import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import './Header.css';

function HeaderTemplate() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    const toggleProfileMenu = () => {
        setProfileMenuOpen(!profileMenuOpen);
    };

    const handleLogout = () => {
        logout();
        setProfileMenuOpen(false);
        setMenuOpen(false);
        navigate('/');
    };

    // Initiales de l'utilisateur pour l'avatar
    const getUserInitials = () => {
        if (!user) return '';
        return `${user.userName.charAt(0)}${user.userLastname.charAt(0)}`.toUpperCase();
    };

    return (
        <header className="header">
            <div className="header-container">
                <Link to="/" className="logo-link" onClick={closeMenu}>
                    <div className="logo">
                        <span className="logo-icon">✨</span>
                        <span className="logo-text">Good Pics</span>
                    </div>
                </Link>
                
                {/* Burger Menu Button */}
                <button 
                    className={`burger-menu ${menuOpen ? 'active' : ''}`}
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    <span className="burger-line"></span>
                    <span className="burger-line"></span>
                    <span className="burger-line"></span>
                </button>

                {/* Navigation */}
                <nav className={`nav ${menuOpen ? 'active' : ''}`}>
                    <Link to="/" className="nav-link" onClick={closeMenu}>Accueil</Link>
                    <Link to="/generate" className="nav-link" onClick={closeMenu}>Générer</Link>
                    <Link to="/galery" className="nav-link" onClick={closeMenu}>Galerie d'images</Link>
                    <Link
                        to="/usergalery"
                        className="nav-link"
                        onClick={closeMenu}
                    >
                        Ma galerie
                    </Link>
                </nav>

                {/* Actions */}
                <div className={`header-actions ${menuOpen ? 'active' : ''}`}>
                    {isAuthenticated ? (
                        <div className="user-menu">
                            <button 
                                className="user-profile-btn" 
                                onClick={toggleProfileMenu}
                                aria-label="User menu"
                            >
                                <div className="user-avatar">
                                    {getUserInitials()}
                                </div>
                                <div className="user-info">
                                    <span className="user-name">{user?.userName} {user?.userLastname}</span>
                                    <span className="user-email">{user?.userEmail}</span>
                                </div>
                                <svg 
                                    className={`chevron ${profileMenuOpen ? 'rotated' : ''}`}
                                    xmlns="http://www.w3.org/2000/svg" 
                                    width="20" 
                                    height="20" 
                                    viewBox="0 0 24 24" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    strokeWidth="2" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round"
                                >
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                            </button>

                            {/* Dropdown Menu */}
                            {profileMenuOpen && (
                                <div className="profile-dropdown">
                                    <Link to="/user" className="dropdown-item" onClick={() => { setProfileMenuOpen(false); closeMenu(); }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="12" cy="7" r="4"></circle>
                                        </svg>
                                        Mon Profil
                                    </Link>
                                    <Link to="/settings" className="dropdown-item" onClick={() => { setProfileMenuOpen(false); closeMenu(); }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="3"></circle>
                                            <path d="M12 1v6m0 6v6m7.07-7.07l-4.24 4.24m0-8.49l4.24 4.25M1 12h6m6 0h6m-7.07 7.07l4.24-4.24m-8.49 0l4.25 4.24"></path>
                                        </svg>
                                        Paramètres
                                    </Link>
                                    <div className="dropdown-divider"></div>
                                    <button className="dropdown-item logout-btn" onClick={handleLogout}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                            <polyline points="16 17 21 12 16 7"></polyline>
                                            <line x1="21" y1="12" x2="9" y2="12"></line>
                                        </svg>
                                        Déconnexion
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link to="/login" className="btn-secondary" onClick={closeMenu}>Connexion</Link>
                            <Link to="/register" className="btn-primary" onClick={closeMenu}>S'inscrire</Link>
                        </>
                    )}
                </div>
            </div>

            {/* Overlay pour fermer les menus */}
            {(menuOpen || profileMenuOpen) && (
                <div className="menu-overlay" onClick={() => { closeMenu(); setProfileMenuOpen(false); }}></div>
            )}
        </header>
    );
}

export default HeaderTemplate;