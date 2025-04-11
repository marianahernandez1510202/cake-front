import React, { createContext, useContext, useState } from 'react';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (type, message, timeout = 5000) => {
    const id = Date.now();
    
    const newNotification = {
      id,
      type,
      message,
      timeout
    };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto remove after timeout
    if (timeout > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, timeout);
    }
    
    return id;
  };
  
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };
  
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        clearAllNotifications,
        success: (message, timeout) => addNotification('success', message, timeout),
        error: (message, timeout) => addNotification('error', message, timeout),
        info: (message, timeout) => addNotification('info', message, timeout),
        warning: (message, timeout) => addNotification('warning', message, timeout)
      }}
    >
      {children}
      
      {/* Componente para mostrar notificaciones */}
      <div className="notifications-container">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`notification notification-${notification.type}`}
          >
            <span className="notification-message">{notification.message}</span>
            <button
              className="notification-close"
              onClick={() => removeNotification(notification.id)}
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

// Hook personalizado para usar el contexto de notificaciones
export const useNotification = () => {
  const context = useContext(NotificationContext);
  
  if (!context) {
    throw new Error('useNotification debe usarse dentro de un NotificationProvider');
  }
  
  return context;
};