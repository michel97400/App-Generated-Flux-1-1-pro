import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CirclePower, User, Home, Settings } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import './Header.css';

function HeaderTemplate() {
    const { isAuthenticated, logout, user } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleLogout = async () => {
        await logout();
        navigate('/');
        setIsMenuOpen(false);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    // Fermer le menu quand on clique en dehors
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    return (
        <header className="header">
            <div className="header-container">
                <Link to="/" className="logo-link">
                    <div className="logo">
                        <span className="logo-icon">✨</span>
                        <span className="logo-text">Good Pics</span>
                    </div>
                </Link>
                
                {/* Actions */}
                <div className="header-actions">
                    {isAuthenticated ? (
                        <div className="user-menu-container" ref={menuRef}>
                            <button className="user-menu-button" onClick={toggleMenu}>
                                <User size={20} />
                                <span className="user-name">
                                    {user ? `${user.userName} ${user.userLastname}` : 'Utilisateur'}
                                </span>
                                <span className="menu-arrow">{isMenuOpen ? '▲' : '▼'}</span>
                            </button>
                            
                            {isMenuOpen && (
                                <div className="user-dropdown-menu">
                                    <Link to="/" className="menu-item" onClick={closeMenu}>
                                        <Home size={16} />
                                        <span>Accueil</span>
                                    </Link>
                                    <Link to="/user" className="menu-item" onClick={closeMenu}>
                                        <Settings size={16} />
                                        <span>Mon Compte</span>
                                    </Link>
                                    <div className="menu-divider"></div>
                                    <button className="menu-item logout-item" onClick={handleLogout}>
                                        <CirclePower size={16} />
                                        <span>Déconnexion</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link to="/login" className="btn-secondary">Connexion</Link>
                            <Link to="/register" className="btn-primary">S'inscrire</Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

export default HeaderTemplate;