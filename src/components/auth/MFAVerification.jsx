import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import AlertMessage from '../common/AlertMessage';
import Button from '../ui/Button';

const MFAVerification = ({ tempToken, onVerify, onCancel, onError }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { completeMfaLogin } = useAuth();
  const navigate = useNavigate();

  const handleVerificationCodeChange = (e) => {
    setVerificationCode(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Por favor, ingresa un código de verificación válido de 6 dígitos.');
      if (onError) onError('Por favor, ingresa un código de verificación válido de 6 dígitos.');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await completeMfaLogin(tempToken, verificationCode);
      
      if (onVerify) {
        onVerify();
      } else {
        navigate('/');
      }
    } catch (err) {
      const errorMsg = err.message || 'Error al verificar el código MFA. Por favor, intenta nuevamente.';
      setError(errorMsg);
      if (onError) onError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="mfa-verification-container">
      <h2>Verificación en dos pasos</h2>
      
      {error && <AlertMessage type="error" message={error} />}
      
      <div className="mfa-instructions">
        <p>
          Por favor, ingresa el código de verificación de 6 dígitos generado por tu aplicación de autenticación.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="verification-form">
        <div className="form-group">
          <label htmlFor="verification-code">Código de verificación:</label>
          <input
            type="text"
            id="verification-code"
            value={verificationCode}
            onChange={handleVerificationCodeChange}
            placeholder="Ingresa el código de 6 dígitos"
            maxLength="6"
            pattern="[0-9]*"
            inputMode="numeric"
            autoComplete="off"
            className="form-control verification-input"
            required
          />
        </div>
        
        <div className="form-actions">
          <Button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Verificando...' : 'Verificar'}
          </Button>
          
          <Button
            type="button"
            className="btn-secondary"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MFAVerification;