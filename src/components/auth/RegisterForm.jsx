import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AlertMessage from '../components/common/AlertMessage';
import cakeIcon from '../assets/images/cake-icon.png';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: '',
    domicilio: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  // Estilos en línea
  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      maxWidth: '450px',
      margin: '30px auto',
      padding: '30px',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e0e0e0'
    },
    logo: {
      display: 'block',
      width: '80px',
      height: '80px',
      margin: '0 auto 20px',
      borderRadius: '50%',
      objectFit: 'cover'
    },
    title: {
      textAlign: 'center',
      color: '#333',
      marginBottom: '20px',
      fontSize: '24px'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px'
    },
    input: {
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '16px',
      transition: 'border-color 0.3s ease'
    },
    inputFocus: {
      borderColor: '#ff6b6b'
    },
    button: {
      padding: '12px',
      backgroundColor: '#ff6b6b',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '16px',
      transition: 'background-color 0.3s ease'
    },
    buttonHover: {
      backgroundColor: '#ff4757'
    },
    link: {
      color: '#ff6b6b',
      textDecoration: 'none',
      textAlign: 'center',
      marginTop: '15px'
    },
    errorMessage: {
      color: '#d9534f',
      backgroundColor: '#f2dede',
      padding: '10px',
      borderRadius: '4px',
      textAlign: 'center',
      marginBottom: '15px'
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.nombre || !formData.apellido || !formData.email || !formData.password || !formData.domicilio) {
      setError('Por favor completa todos los campos obligatorios');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Enviar datos sin confirmPassword
      const { confirmPassword, ...userData } = formData;
      const result = await register(userData);
      
      if (result.success) {
        navigate('/login');
      } else if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message || 'Error durante el registro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      backgroundColor: '#f4f4f4'
    }}>
      <div style={styles.container}>
        <img 
          src={cakeIcon} 
          alt="SweetCake Logo" 
          style={styles.logo} 
        />
        
        <h2 style={styles.title}>Registro de Usuario</h2>
        
        {error && <div style={styles.errorMessage}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Nombre"
            style={styles.input}
            disabled={loading}
            required
          />
          
          <input
            type="text"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            placeholder="Apellido"
            style={styles.input}
            disabled={loading}
            required
          />
          
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            style={styles.input}
            disabled={loading}
            required
          />
          
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Contraseña"
            style={styles.input}
            disabled={loading}
            required
          />
          
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirmar Contraseña"
            style={styles.input}
            disabled={loading}
            required
          />
          
          <input
            type="text"
            name="domicilio"
            value={formData.domicilio}
            onChange={handleChange}
            placeholder="Domicilio"
            style={styles.input}
            disabled={loading}
            required
          />
          
          <button 
            type="submit" 
            style={styles.button}
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Crear Cuenta'}
          </button>
          
          <div style={{textAlign: 'center', marginTop: '15px'}}>
            <Link 
              to="/login" 
              style={styles.link}
            >
              ¿Ya tienes una cuenta? Iniciar Sesión
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;