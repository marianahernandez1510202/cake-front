import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import cakeIconImage from '../../assets/images/image.png'; // Asegúrate de que la ruta sea correcta

const CakeHeartIcon = () => {
  const location = useLocation();
  const isActive = location.pathname === '/favoritos';

  return (
    <Link to="/favoritos" className={`cake-heart-icon ${isActive ? 'active' : ''}`}>
      <div className="cake-icon-container">
        <img 
          src={cakeIconImage} 
          alt="Favoritos" 
          className="cake-icon-image" 
        />
      </div>
    </Link>
  );
};

export default CakeHeartIcon;