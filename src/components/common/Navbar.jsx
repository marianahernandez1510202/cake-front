import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import logoImage from '../../assets/images/logo.png';
import cakeIconImage from '../../assets/images/image.png';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo-container">
          <Link to="/" className="logo-link">
            <img src={logoImage} alt="SweetCake Logo" className="logo" />
            <span className="brand-name">SweetCake</span>
          </Link>
        </div>

        <div className="navbar-center">
          <Link to="/conocenos" className={location.pathname === '/conocenos' ? 'active' : ''}>
            Conócenos
          </Link>
          <Link to="/catalogo" className={location.pathname === '/catalogo' ? 'active' : ''}>
            Catálogo
          </Link>
        </div>

        <div className="navbar-right">
          {/* Icono de pastel con corazón (favoritos) */}
          <Link to="/favoritos" className={`cake-heart-icon ${location.pathname === '/favoritos' ? 'active' : ''}`}>
            <div className="cake-icon-container">
              <img src={cakeIconImage} alt="Favoritos" className="cake-icon-image" />
            </div>
          </Link>

          {isAuthenticated ? (
            <div className="user-menu">
              <button className="user-button" onClick={toggleDropdown}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                  <path fill="none" d="M0 0h24v24H0z"/>
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                </svg>
              </button>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    Hola, {user?.name || 'Mariana'}
                  </div>
                  <Link to="/perfil" className="dropdown-item">Mi Perfil</Link>
                  <Link to="/favoritos" className="dropdown-item">Mis Favoritos</Link>
                  <div className="dropdown-divider"></div>
                  <button onClick={handleLogout} className="dropdown-item logout-button">
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="login-button">Ingresa</Link>
              <div className="auth-dropdown">
                <Link to="/login" className="dropdown-item">Iniciar sesión</Link>
                <Link to="/register" className="dropdown-item">Registrarse</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;