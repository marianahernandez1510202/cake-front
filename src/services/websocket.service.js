// websocket.service.js
let socket = null;
let reconnectTimeout = null;
let messageListeners = [];
let connectionListeners = [];

const BASE_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:5000';
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 3000; // 3 segundos

const websocketService = {
  connect(token, channel = 'global-updates') {
    // Limpiar cualquier conexión existente
    this.disconnect();
    
    try {
      // Crear nueva conexión WebSocket
      const wsUrl = `${BASE_URL}/${channel}?token=${token}`;
      socket = new WebSocket(wsUrl);
      
      let reconnectAttempts = 0;
      
      // Manejar eventos de la conexión
      socket.onopen = () => {
        console.log(`WebSocket conectado al canal: ${channel}`);
        reconnectAttempts = 0;
        this._notifyConnectionListeners({ connected: true, channel });
      };
      
      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this._notifyMessageListeners(data);
        } catch (error) {
          console.error('Error al procesar mensaje WebSocket:', error);
        }
      };
      
      socket.onclose = (event) => {
        console.log(`WebSocket desconectado. Código: ${event.code}, Razón: ${event.reason}`);
        this._notifyConnectionListeners({ connected: false, channel });
        
        // Intentar reconexión si no fue un cierre limpio
        if (event.code !== 1000 && event.code !== 1001) {
          if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
            reconnectAttempts++;
            
            console.log(`Intentando reconexión ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS} en ${RECONNECT_DELAY}ms...`);
            
            // Programar reconexión
            reconnectTimeout = setTimeout(() => {
              this.connect(token, channel);
            }, RECONNECT_DELAY);
          } else {
            console.log('Máximo número de intentos de reconexión alcanzado.');
          }
        }
      };
      
      socket.onerror = (error) => {
        console.error('Error en WebSocket:', error);
      };
      
      return true;
    } catch (error) {
      console.error('Error al crear conexión WebSocket:', error);
      return false;
    }
  },
  
  disconnect() {
    // Limpiar timeout de reconexión si existe
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
      reconnectTimeout = null;
    }
    
    // Cerrar socket si existe
    if (socket && socket.readyState !== WebSocket.CLOSED) {
      socket.close(1000, 'Cierre manual');
      socket = null;
    }
  },
  
  isConnected() {
    return socket && socket.readyState === WebSocket.OPEN;
  },
  
  send(message) {
    if (!this.isConnected()) {
      console.error('No se puede enviar mensaje, WebSocket no está conectado');
      return false;
    }
    
    try {
      const messageStr = typeof message === 'string' ? message : JSON.stringify(message);
      socket.send(messageStr);
      return true;
    } catch (error) {
      console.error('Error al enviar mensaje WebSocket:', error);
      return false;
    }
  },
  
  addMessageListener(listener) {
    if (typeof listener === 'function' && !messageListeners.includes(listener)) {
      messageListeners.push(listener);
      return true;
    }
    return false;
  },
  
  removeMessageListener(listener) {
    const index = messageListeners.indexOf(listener);
    if (index !== -1) {
      messageListeners.splice(index, 1);
      return true;
    }
    return false;
  },
  
  addConnectionListener(listener) {
    if (typeof listener === 'function' && !connectionListeners.includes(listener)) {
      connectionListeners.push(listener);
      return true;
    }
    return false;
  },
  
  removeConnectionListener(listener) {
    const index = connectionListeners.indexOf(listener);
    if (index !== -1) {
      connectionListeners.splice(index, 1);
      return true;
    }
    return false;
  },
  
  _notifyMessageListeners(data) {
    messageListeners.forEach(listener => {
      try {
        listener(data);
      } catch (error) {
        console.error('Error en listener de mensaje WebSocket:', error);
      }
    });
  },
  
  _notifyConnectionListeners(status) {
    connectionListeners.forEach(listener => {
      try {
        listener(status);
      } catch (error) {
        console.error('Error en listener de conexión WebSocket:', error);
      }
    });
  }
};

export { websocketService };