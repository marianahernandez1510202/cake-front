import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AlertMessage from '../components/common/AlertMessage';
import MFAVerification from '../components/auth/MFAVerification';
import RecoveryForm from '../components/auth/RecoveryForm';
import cakeIcon from '../assets/images/cake-icon.png';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showMFA, setShowMFA] = useState(false);
  const [tempToken, setTempToken] = useState('');
  const [showRecovery, setShowRecovery] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Array de imágenes de pasteles para el carrusel
  const cakeImages = [
    'https://images.unsplash.com/photo-1606890658317-7d14490b76fd',
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587',
    'https://images.unsplash.com/photo-1565958011703-44f9829ba187',
    'https://images.unsplash.com/photo-1488477181946-6428a0bfdf42',
    'https://images.unsplash.com/photo-1542124948-dc391252a940'
  ];

  // Cambiar la imagen cada 3 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % cakeImages.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(formData.email, formData.password);
      
      // Si se requiere MFA, mostrar la interfaz de verificación
      if (result.requiresMFA) {
        setTempToken(result.tempToken);
        setShowMFA(true);
        return;
      }
      
      // Si no hay MFA, redirigir al home
      navigate('/');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión. Por favor, verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  const handleMFASuccess = () => {
    navigate('/');
  };

  const handleMFACancel = () => {
    setShowMFA(false);
    setTempToken('');
  };

  const handleShowRecovery = () => {
    setShowRecovery(true);
  };

  const handleRecoveryCancel = () => {
    setShowRecovery(false);
  };

  // Si el usuario solicita recuperar su contraseña
  if (showRecovery) {
    return <RecoveryForm onCancel={handleRecoveryCancel} />;
  }

  // Si se requiere verificación MFA
  if (showMFA) {
    return (
      <MFAVerification
        tempToken={tempToken}
        onVerify={handleMFASuccess}
        onCancel={handleMFACancel}
        onError={setError}
      />
    );
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-grid">
          {/* Panel izquierdo con el formulario */}
          <div className="login-form-panel">
            <div className="login-logo">
              <img src={cakeIcon} alt="SweetCake Logo" className="cake-icon" />
            </div>
            
            <form onSubmit={handleSubmit} className="login-form">
              {error && <AlertMessage type="error" message={error} />}
              
              <div className="form-group">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                  className="form-control"
                />
              </div>

              <div className="form-actions">
                <button 
                  type="submit"
                  className="login-button"
                  disabled={loading}
                >
                  {loading ? 'Ingresando...' : 'Login Button'}
                </button>
                
                <Link to="/register" className="register-button">
                  Register Button
                </Link>
              </div>

              <div className="form-footer">
                <button 
                  type="button" 
                  onClick={handleShowRecovery}
                  className="forgot-password-link"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            </form>
          </div>
          
          {/* Panel derecho con la imagen */}
          <div className="login-image-panel">
            <img 
              src={cakeImages[currentImageIndex]} 
              alt="Deliciosos pasteles" 
              className="cake-image"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;