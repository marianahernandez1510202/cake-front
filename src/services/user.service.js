import api from './api';

export const userService = {
  async getProfile() {
    try {
      const userId = localStorage.getItem('userId');
      const response = await api.get(`/api/users/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener perfil de usuario');
    }
  },
  
  async updateProfile(userData) {
    try {
      const userId = localStorage.getItem('userId');
      const response = await api.put(`/api/users/${userId}`, userData);
      
      // Actualizar datos del usuario en localStorage
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...currentUser, ...response.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al actualizar perfil de usuario');
    }
  },
  
  async changePassword(currentPassword, newPassword) {
    try {
      const userId = localStorage.getItem('userId');
      const response = await api.post(`/api/users/${userId}/change-password`, {
        currentPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al cambiar contraseña');
    }
  },
  
  async setupMFA() {
    try {
      const response = await api.post('/api/auth/setup-mfa');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al configurar MFA');
    }
  },
  
  async verifyMFA(verificationCode) {
    try {
      const response = await api.post('/api/auth/verify-mfa', {
        verificationCode
      });
      
      // Actualizar datos del usuario en localStorage para reflejar MFA habilitado
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...currentUser, mfaEnabled: true };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
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
      
      // Actualizar datos del usuario en localStorage para reflejar MFA deshabilitado
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...currentUser, mfaEnabled: false };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al desactivar MFA');
    }
  },
  
  async deleteAccount() {
    try {
      const userId = localStorage.getItem('userId');
      const response = await api.delete(`/api/users/${userId}`);
      
      // Limpiar localStorage al eliminar cuenta
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('user');
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al eliminar cuenta');
    }
  }
};

export default userService;