import React, { useState, useEffect } from 'react';

const AlertMessage = ({ type, message, onClose, autoClose = true, duration = 5000 }) => {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    if (autoClose && visible) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) {
          onClose();
        }
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose, visible]);
  
  const handleClose = () => {
    setVisible(false);
    if (onClose) {
      onClose();
    }
  };
  
  if (!visible) {
    return null;
  }
  
  return (
    <div className={`alert alert-${type}`}>
      <div className="alert-content">
        {message}
      </div>
      <button className="alert-close" onClick={handleClose}>
        &times;
      </button>
    </div>
  );
};

export default AlertMessage;