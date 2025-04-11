import React, { useState, useEffect } from 'react';
import { websocketService } from '../../services/websocket.service';

const WebSocketStatus = () => {
  const [connected, setConnected] = useState(websocketService.isConnected());
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Función para actualizar el estado de conexión
    const handleConnectionChange = (isConnected) => {
      setConnected(isConnected);
      // Mostrar el indicador cuando cambia el estado
      setVisible(true);
      // Ocultar después de 5 segundos si está conectado
      if (isConnected) {
        const timer = setTimeout(() => {
          setVisible(false);
        }, 5000);
        return () => clearTimeout(timer);
      }
    };

    // Suscribirse a eventos de conexión
    websocketService.addConnectionListener(handleConnectionChange);

    // Limpiar suscripción
    return () => {
      websocketService.removeConnectionListener(handleConnectionChange);
    };
  }, []);

  const hideStatus = () => {
    setVisible(false);
  };

  if (!visible && connected) {
    return null;
  }

  return (
    <div className={`websocket-status ${visible ? '' : 'hidden'}`}>
      <div className={`status-indicator ${connected ? 'connected' : 'disconnected'}`}></div>
      <span className="status-text">
        {connected ? 'Conectado' : 'Desconectado'}
      </span>
      {connected && (
        <button className="close-button" onClick={hideStatus}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      )}
    </div>
  );
};

export default WebSocketStatus;