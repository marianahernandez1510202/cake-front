/**
 * Formatea un precio en moneda local
 * @param {number} price - Precio a formatear
 * @param {string} locale - Localización (por defecto es-MX)
 * @param {string} currency - Moneda (por defecto MXN)
 * @returns {string} Precio formateado
 */
export const formatPrice = (price, locale = 'es-MX', currency = 'MXN') => {
    if (typeof price !== 'number') {
      return '';
    }
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };
  
  /**
   * Formatea una fecha
   * @param {string|Date} date - Fecha a formatear
   * @param {string} locale - Localización (por defecto es-MX)
   * @param {Object} options - Opciones de formato
   * @returns {string} Fecha formateada
   */
  export const formatDate = (date, locale = 'es-MX', options = {}) => {
    if (!date) {
      return '';
    }
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    const defaultOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      ...options
    };
    
    return new Intl.DateTimeFormat(locale, defaultOptions).format(dateObj);
  };
  
  /**
   * Trunca un texto a una longitud máxima
   * @param {string} text - Texto a truncar
   * @param {number} maxLength - Longitud máxima
   * @param {string} suffix - Sufijo para indicar que el texto fue truncado
   * @returns {string} Texto truncado
   */
  export const truncateText = (text, maxLength = 100, suffix = '...') => {
    if (!text || text.length <= maxLength) {
      return text;
    }
    
    return text.substring(0, maxLength).trim() + suffix;
  };
  
  /**
   * Genera un ID único
   * @returns {string} ID único
   */
  export const generateUniqueId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };
  
  /**
   * Filtra un objeto eliminando propiedades con valores undefined o null
   * @param {Object} obj - Objeto a filtrar
   * @returns {Object} Objeto filtrado
   */
  export const filterObject = (obj) => {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, value]) => value !== undefined && value !== null)
    );
  };
  
  /**
   * Obtiene el token del localStorage
   * @returns {string|null} Token o null si no existe
   */
  export const getToken = () => {
    return localStorage.getItem('token');
  };
  
  /**
   * Guarda el token en localStorage
   * @param {string} token - Token a guardar
   */
  export const setToken = (token) => {
    localStorage.setItem('token', token);
  };
  
  /**
   * Elimina el token del localStorage
   */
  export const removeToken = () => {
    localStorage.removeItem('token');
  };
  
  /**
   * Maneja errores HTTP
   * @param {Error} error - Error a manejar
   * @returns {Object} Objeto con mensaje de error y código
   */
  export const handleHttpError = (error) => {
    if (error.response) {
      // La solicitud fue hecha y el servidor respondió con un código de estado
      // que cae fuera del rango de 2xx
      return {
        message: error.response.data.message || 'Error en la solicitud',
        code: error.response.status
      };
    } else if (error.request) {
      // La solicitud fue hecha pero no se recibió respuesta
      return {
        message: 'No se pudo conectar al servidor',
        code: 'NETWORK_ERROR'
      };
    } else {
      // Algo sucedió al configurar la solicitud que desencadenó un error
      return {
        message: 'Error al procesar la solicitud',
        code: 'REQUEST_ERROR'
      };
    }
  };
  
  /**
   * Calcula la diferencia entre dos fechas
   * @param {string|Date} startDate - Fecha de inicio
   * @param {string|Date} endDate - Fecha de fin
   * @param {string} unit - Unidad de tiempo (days, hours, minutes, seconds)
   * @returns {number} Diferencia en la unidad especificada
   */
  export const dateDiff = (startDate, endDate, unit = 'days') => {
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const end = endDate ? (typeof endDate === 'string' ? new Date(endDate) : endDate) : new Date();
    
    const diffMs = Math.abs(end - start);
    
    const units = {
      days: 1000 * 60 * 60 * 24,
      hours: 1000 * 60 * 60,
      minutes: 1000 * 60,
      seconds: 1000
    };
    
    return Math.floor(diffMs / units[unit]);
  };
  
  /**
   * Agrupa un array de objetos por una propiedad
   * @param {Array} array - Array a agrupar
   * @param {string|Function} key - Propiedad o función para obtener la clave
   * @returns {Object} Objeto agrupado
   */
  export const groupBy = (array, key) => {
    return array.reduce((result, item) => {
      const groupKey = typeof key === 'function' ? key(item) : item[key];
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(item);
      return result;
    }, {});
  };
  
  /**
   * Ordena un array de objetos por una propiedad
   * @param {Array} array - Array a ordenar
   * @param {string|Function} key - Propiedad o función para obtener el valor
   * @param {string} order - Orden (asc o desc)
   * @returns {Array} Array ordenado
   */
  export const sortBy = (array, key, order = 'asc') => {
    const sorted = [...array].sort((a, b) => {
      const valueA = typeof key === 'function' ? key(a) : a[key];
      const valueB = typeof key === 'function' ? key(b) : b[key];
      
      if (valueA < valueB) return order === 'asc' ? -1 : 1;
      if (valueA > valueB) return order === 'asc' ? 1 : -1;
      return 0;
    });
    
    return sorted;
  };
  
  /**
   * Maneja la detección de actividad del usuario
   * @param {number} timeout - Tiempo de inactividad en milisegundos
   * @param {Function} callback - Función a ejecutar al detectar inactividad
   * @returns {Object} Objeto con métodos para iniciar y detener la detección
   */
  export const userActivityMonitor = (timeout = 30 * 60 * 1000, callback) => {
    let activityTimer;
    
    const resetTimer = () => {
      if (activityTimer) {
        clearTimeout(activityTimer);
      }
      activityTimer = setTimeout(() => {
        if (typeof callback === 'function') {
          callback();
        }
      }, timeout);
    };
    
    const startMonitoring = () => {
      // Eventos para detectar actividad del usuario
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
      
      // Agregar listeners
      events.forEach(event => {
        document.addEventListener(event, resetTimer);
      });
      
      // Iniciar el timer
      resetTimer();
      
      return () => {
        // Función para detener la monitorización
        if (activityTimer) {
          clearTimeout(activityTimer);
        }
        
        // Eliminar listeners
        events.forEach(event => {
          document.removeEventListener(event, resetTimer);
        });
      };
    };
    
    return {
      start: startMonitoring,
      stop: () => {
        if (activityTimer) {
          clearTimeout(activityTimer);
        }
      }
    };
  };
  
  /**
   * Obtiene un parámetro de la URL
   * @param {string} name - Nombre del parámetro
   * @returns {string|null} Valor del parámetro o null si no existe
   */
  export const getQueryParam = (name) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  };
  
  /**
   * Crea una URL con parámetros
   * @param {string} url - URL base
   * @param {Object} params - Parámetros a agregar
   * @returns {string} URL con parámetros
   */
  export const createUrlWithParams = (url, params = {}) => {
    const urlObj = new URL(url, window.location.origin);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        urlObj.searchParams.append(key, value);
      }
    });
    return urlObj.toString();
  };
  
  /**
   * Convierte un objeto a FormData
   * @param {Object} obj - Objeto a convertir
   * @returns {FormData} Objeto FormData
   */
  export const objectToFormData = (obj) => {
    const formData = new FormData();
    
    Object.entries(obj).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });
    
    return formData;
  };
  
  /**
   * Verifica si un objeto está vacío
   * @param {Object} obj - Objeto a verificar
   * @returns {boolean} Verdadero si el objeto está vacío
   */
  export const isEmptyObject = (obj) => {
    return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
  };
  
  /**
   * Sanitiza una cadena para prevenir XSS
   * @param {string} string - Cadena a sanitizar
   * @returns {string} Cadena sanitizada
   */
  export const sanitizeString = (string) => {
    if (!string) return '';
    
    const temp = document.createElement('div');
    temp.textContent = string;
    return temp.innerHTML;
  };
  
  /**
   * Debounce una función
   * @param {Function} func - Función a debounce
   * @param {number} wait - Tiempo de espera en milisegundos
   * @returns {Function} Función con debounce
   */
  export const debounce = (func, wait = 300) => {
    let timeout;
    
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };