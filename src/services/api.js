import axios from 'axios';

// Crear instancia de axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://cake-back.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor de peticiones
api.interceptors.request.use(
  (config) => {
    // Obtener token de autenticación del localStorage
    const token = localStorage.getItem('token');
    
    // Si existe un token, agregarlo al header de autorización
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuestas
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Manejar errores de respuesta
    if (error.response) {
      // Errores de autenticación (401)
      if (error.response.status === 401) {
        // Si el token expiró o es inválido, limpiar localStorage y redirigir al login
        if (localStorage.getItem('token')) {
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          localStorage.removeItem('user');
          
          // Redirigir a la página de login si no estamos ya en ella
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
        }
      }
      
      // Errores de permiso (403)
      if (error.response.status === 403) {
        console.error('Acceso denegado:', error.response.data.message);
      }
    } else if (error.request) {
      // Error de red o servidor no disponible
      console.error('Error de red:', error.request);
    } else {
      // Error en la configuración de la petición
      console.error('Error en la configuración de la petición:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;