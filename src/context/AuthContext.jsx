import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/auth.service';
import { websocketService } from '../services/websocket.service';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Verificar si hay un usuario logueado (token en localStorage)
    const checkAuthStatus = () => {
      try {
        const isAuthenticated = authService.isAuthenticated();
        
        if (isAuthenticated) {
          const user = authService.getUser();
          setCurrentUser(user);
          
          // Iniciar conexión WebSocket si el usuario está autenticado
          const token = authService.getToken();
          if (token) {
            websocketService.connect(token);
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error al verificar estado de autenticación:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    checkAuthStatus();
    
    // Limpiar al desmontar
    return () => {
      websocketService.disconnect();
    };
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login({ email, password });
      
      // Si se requiere MFA, devolver el tempToken
      if (response.requiresMFA) {
        return {
          requiresMFA: true,
          tempToken: response.tempToken
        };
      }
      
      // Si no se requiere MFA, actualizar el estado del usuario
      setCurrentUser(response.user);
      
      // Iniciar conexión WebSocket
      websocketService.connect(response.token);
      
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const completeMfaLogin = async (tempToken, mfaToken) => {
    try {
      const response = await authService.completeMfaLogin(tempToken, mfaToken);
      setCurrentUser(response.user);
      
      // Iniciar conexión WebSocket
      websocketService.connect(response.token);
      
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      setCurrentUser(response.user);
      
      // Iniciar conexión WebSocket
      websocketService.connect(response.token);
      
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setCurrentUser(null);
      
      // Desconectar WebSocket
      websocketService.disconnect();
      
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const forgotPassword = async (email, phone = null) => {
    try {
      return await authService.forgotPassword(email, phone);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const resetPassword = async (token, phone = null, verificationCode = null, newPassword = null) => {
    try {
      return await authService.resetPassword(token, phone, verificationCode, newPassword);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const verifySecurityQuestion = async (email) => {
    try {
      return await authService.verifySecurityQuestion(email);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const resetPasswordWithQuestion = async (email, answer, newPassword = null) => {
    try {
      return await authService.resetPasswordWithQuestion(email, answer, newPassword);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const setupMFA = async () => {
    try {
      return await authService.setupMFA();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const verifyMFA = async (secret, verificationCode) => {
    try {
      return await authService.verifyMFA(secret, verificationCode);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const disableMFA = async (verificationCode) => {
    try {
      return await authService.disableMFA(verificationCode);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateUserInContext = (updatedUser) => {
    setCurrentUser(prevUser => ({ ...prevUser, ...updatedUser }));
  };

  const value = {
    user: currentUser,
    isAuthenticated: !!currentUser,
    loading,
    error,
    login,
    completeMfaLogin,
    register,
    logout,
    forgotPassword,
    resetPassword,
    verifySecurityQuestion,
    resetPasswordWithQuestion,
    setupMFA,
    verifyMFA,
    disableMFA,
    updateUserInContext
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};