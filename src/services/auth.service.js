import api from './api';

export const authService = {
  async login(credentials) {
    try {
      const response = await api.post('/api/auth/login', credentials);
      
      // Verificar si se requiere MFA
      if (response.data.mfaRequired) {
        return {
          requiresMFA: true,
          tempToken: response.data.tempToken || 'temp-token'
        };
      }
      
      // Si no se requiere MFA, almacenar token y datos del usuario
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.user._id);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
    }
  },
  
  async completeMfaLogin(tempToken, mfaToken) {
    try {
      const response = await api.post('/api/auth/login', {
        mfaToken,
        tempToken
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.user._id);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al verificar el código MFA');
    }
  },
  
  async register(userData) {
    try {
      const response = await api.post('/api/auth/register', userData);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.user._id);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al registrar usuario');
    }
  },
  
  async logout() {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('user');
      return true;
    } catch (error) {
      throw new Error('Error al cerrar sesión');
    }
  },
  
  async forgotPassword(email, phone = null) {
    try {
      const response = await api.post('/api/auth/forgot-password', { email, phone });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al recuperar contraseña');
    }
  },
  
  async resetPassword(token, phone = null, verificationCode = null, newPassword = null) {
    try {
      let url = `/api/auth/reset-password/${token}`;
      const data = {};
      
      // Si se proporciona nueva contraseña, incluirla en los datos
      if (newPassword) {
        data.password = newPassword;
        // Añadir código de verificación si está disponible
        data.verificationCode = token;
      }
      
      if (phone) {
        data.phone = phone;
      }
      
      if (verificationCode) {
        data.verificationCode = verificationCode;
      }
      
      const response = await api.post(url, data);
      return response.data;
    } catch (error) {
      // Manejar diferentes tipos de errores
      const errorMessage = error.response?.data?.message || 'Error al restablecer contraseña';
      
      throw new Error(errorMessage);
    }
  },
   
  async verifySecurityQuestion(email) {
    try {
      const response = await api.post('/api/auth/security-question', { email });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener pregunta de seguridad');
    }
  },
  
  async resetPasswordWithQuestion(email, answer, newPassword = null) {
    try {
      const data = { email, answer };
      
      if (newPassword) {
        data.password = newPassword;
      }
      
      const response = await api.post('/api/auth/reset-password-question', data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al verificar respuesta');
    }
  },
  
  // Funciones de Multi-Factor Authentication (MFA)
  async setupMFA() {
    try {
      const response = await api.post('/api/auth/setup-mfa');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al configurar MFA');
    }
  },
  
  async verifyMFA(secret, verificationCode) {
    try {
      const response = await api.post('/api/auth/verify-mfa', {
        secret,
        verificationCode
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al verificar código MFA');
    }
  },
  
  async disableMFA(verificationCode) {
    try {
      const response = await api.post('/api/auth/disable-mfa', {
        verificationCode
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al desactivar MFA');
    }
  },
  
  // Métodos de autenticación
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },
  
  getToken() {
    return localStorage.getItem('token');
  },
  
  getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
};

export default authService;