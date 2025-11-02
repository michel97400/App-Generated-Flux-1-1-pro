import { Link } from "react-router-dom";
import { useState } from "react";
import './Header.css';

function HeaderTemplate() {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const closeMenu = () => {
        setMenuOpen(false);
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
                    <Link to="/gallery" className="nav-link" onClick={closeMenu}>Galerie</Link>
                </nav>

                {/* Actions */}
                <div className={`header-actions ${menuOpen ? 'active' : ''}`}>
                    <Link to="/login" className="btn-secondary" onClick={closeMenu}>Connexion</Link>
                    <Link to="/register" className="btn-primary" onClick={closeMenu}>S'inscrire</Link>
                </div>
            </div>

            {/* Overlay pour fermer le menu en cliquant à côté */}
            {menuOpen && <div className="menu-overlay" onClick={closeMenu}></div>}
        </header>
    );
}

export default HeaderTemplate;