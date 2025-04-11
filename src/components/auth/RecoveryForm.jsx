import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail } from '../../utils/validators';

const RecoveryForm = () => {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { forgotPassword, resetPassword } = useAuth();
  const navigate = useNavigate();

  // Estilos en línea
  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      maxWidth: '400px',
      margin: '50px auto',
      padding: '20px',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#ffffff'
    },
    title: {
      textAlign: 'center',
      color: '#333',
      marginBottom: '20px'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px'
    },
    input: {
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '16px'
    },
    button: {
      padding: '10px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '16px',
      transition: 'background-color 0.3s ease'
    },
    buttonHover: {
      backgroundColor: '#0056b3'
    },
    errorMessage: {
      color: '#d9534f',
      backgroundColor: '#f2dede',
      padding: '10px',
      borderRadius: '4px',
      textAlign: 'center'
    },
    successMessage: {
      color: '#28a745',
      backgroundColor: '#dff0d8',
      padding: '10px',
      borderRadius: '4px',
      textAlign: 'center'
    },
    link: {
      color: '#007bff',
      textDecoration: 'none',
      textAlign: 'center',
      marginTop: '10px'
    }
  };

  // Efecto para manejar redirección después de éxito
  useEffect(() => {
    let redirectTimer;
    if (successMessage) {
      redirectTimer = setTimeout(() => {
        navigate('/login');
      }, 3000);
    }
    return () => {
      if (redirectTimer) clearTimeout(redirectTimer);
    };
  }, [successMessage, navigate]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      setError('Por favor, ingresa un correo electrónico válido');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await forgotPassword(email);
      setSuccessMessage('Se ha enviado un código de recuperación a tu correo electrónico. Por favor, revisa tu bandeja de entrada.');
      setStep('token');
    } catch (err) {
      setError(err.message || 'No se pudo enviar el correo de recuperación');
    } finally {
      setLoading(false);
    }
  };

  const handleTokenSubmit = async (e) => {
    e.preventDefault();
    
    if (!token) {
      setError('Por favor, ingresa el código de recuperación');
      return;
    }
    
    // Validación de contraseña
    if (newPassword.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setError('La contraseña debe contener mayúsculas, minúsculas, números y caracteres especiales');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await resetPassword(token, null, token, newPassword);
      setSuccessMessage('Contraseña actualizada con éxito. Redirigiendo al inicio de sesión...');
    } catch (err) {
      setError(err.message || 'No se pudo restablecer la contraseña');
    } finally {
      setLoading(false);
    }
  };

  const renderEmailForm = () => (
    <div style={styles.container}>
      <h2 style={styles.title}>Recuperar Contraseña</h2>
      
      {error && <div style={styles.errorMessage}>{error}</div>}
      {successMessage && <div style={styles.successMessage}>{successMessage}</div>}
      
      <form onSubmit={handleEmailSubmit} style={styles.form}>
        <input
          type="email"
          placeholder="Correo Electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />
        
        <button 
          type="submit" 
          style={styles.button}
          disabled={loading}
        >
          {loading ? 'Enviando...' : 'Recuperar Contraseña'}
        </button>
      </form>
      
      <Link 
        to="/login" 
        style={styles.link}
      >
        Volver al Inicio de Sesión
      </Link>
    </div>
  );

  const renderTokenForm = () => (
    <div style={styles.container}>
      <h2 style={styles.title}>Restablecer Contraseña</h2>
      
      {error && <div style={styles.errorMessage}>{error}</div>}
      {successMessage && <div style={styles.successMessage}>{successMessage}</div>}
      
      <form onSubmit={handleTokenSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Código de Recuperación"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          style={styles.input}
          required
        />
        
        <input
          type="password"
          placeholder="Nueva Contraseña"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={styles.input}
          required
        />
        
        <input
          type="password"
          placeholder="Confirmar Contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={styles.input}
          required
        />
        
        <button 
          type="submit" 
          style={styles.button}
          disabled={loading}
        >
          {loading ? 'Restableciendo...' : 'Restablecer Contraseña'}
        </button>
      </form>
      
      <button 
        onClick={() => setStep('email')}
        style={styles.link}
      >
        Solicitar nuevo código
      </button>
    </div>
  );

  return (
    <div>
      {step === 'email' && renderEmailForm()}
      {step === 'token' && renderTokenForm()}
    </div>
  );
};

export default RecoveryForm;