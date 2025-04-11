import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../ui/LoadingSpinner';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, user, loading } = useAuth();

  // Mostrar indicador de carga mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="loading-container">
        <LoadingSpinner />
        <p>Verificando autenticación...</p>
      </div>
    );
  }

  // Verificar si el usuario está autenticado
  if (!isAuthenticated) {
    // Redirigir al login si no está autenticado
    return <Navigate to="/login" replace />;
  }

  // Verificar si se requiere rol de administrador
  if (requireAdmin && (!user || (user.role !== 'admin' && user.role !== 'superAdmin'))) {
    // Redirigir a la página principal si no es administrador
    return <Navigate to="/" replace />;
  }

  // Renderizar los componentes hijos si pasa todas las verificaciones
  return children;
};

export default ProtectedRoute;