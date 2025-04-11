import React from 'react';

const LoadingSpinner = ({ size = 'medium', color = '#ff6b6b' }) => {
  // Mapear tamaños de spinner
  const sizeMap = {
    small: {
      width: '20px',
      height: '20px',
      borderWidth: '2px'
    },
    medium: {
      width: '40px',
      height: '40px',
      borderWidth: '4px'
    },
    large: {
      width: '60px',
      height: '60px',
      borderWidth: '6px'
    }
  };

  const spinnerSize = sizeMap[size] || sizeMap.medium;
  
  const spinnerStyle = {
    width: spinnerSize.width,
    height: spinnerSize.height,
    border: `${spinnerSize.borderWidth} solid rgba(0, 0, 0, 0.1)`,
    borderTop: `${spinnerSize.borderWidth} solid ${color}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  };

  return (
    <div className="spinner-container">
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .spinner-container {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
          }
        `}
      </style>
      <div style={spinnerStyle}></div>
    </div>
  );
};

export default LoadingSpinner;