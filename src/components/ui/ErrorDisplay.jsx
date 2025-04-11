import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

const ErrorDisplay = ({ 
  title = 'Ha ocurrido un error', 
  message = 'Lo sentimos, algo salió mal.', 
  code = '',
  onRetry = null,
  showHome = true,
  showBack = true
}) => {
  const handleRetry = () => {
    if (onRetry && typeof onRetry === 'function') {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="error-display">
      <div className="error-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12" y2="16" />
        </svg>
      </div>
      
      <h2 className="error-title">{title}</h2>
      
      {code && <div className="error-code">Código: {code}</div>}
      
      <p className="error-message">{message}</p>
      
      <div className="error-actions">
        {onRetry && (
          <Button 
            onClick={handleRetry}
            variant="primary"
            className="retry-button"
          >
            Intentar nuevamente
          </Button>
        )}
        
        {showBack && (
          <Button 
            onClick={handleBack}
            variant="secondary"
            className="back-button"
          >
            Volver atrás
          </Button>
        )}
        
        {showHome && (
          <Link to="/" className="home-link">
            <Button variant="outline" className="home-button">
              Ir al inicio
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;