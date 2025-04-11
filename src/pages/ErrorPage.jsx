import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Volver a la página anterior
  };

  return (
    <div className="error-page">
      <div className="error-container">
        <div className="error-icon">
          <div className="thought-bubble">
            <div className="alert-icon">
              <span className="exclamation">!</span>
            </div>
          </div>
        </div>
        
        <div className="error-content">
          <h1 className="error-title">404 Sin Glaseado</h1>
          <p className="error-message">Revisa tu conexión</p>
          
          <div className="error-actions">
            <Link to="/" className="home-link">
              Volver al inicio
            </Link>
            <button onClick={handleGoBack} className="back-button">
              Volver atrás
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;