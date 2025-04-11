import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import AlertMessage from '../common/AlertMessage';
import Button from '../ui/Button';

const MFASetup = ({ onComplete, onCancel }) => {
  const [qrCode, setQrCode] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [setupLoading, setSetupLoading] = useState(true);
  const [error, setError] = useState('');
  const [secret, setSecret] = useState('');
  const { setupMFA, verifyMFA } = useAuth();

  useEffect(() => {
    const generateMFASetup = async () => {
      try {
        setSetupLoading(true);
        const response = await setupMFA();
        setQrCode(response.qrCodeUrl);
        setSecret(response.secret);
        setSetupLoading(false);
      } catch (err) {
        setError('Error al generar el código QR para MFA. Por favor, intenta nuevamente.');
        setSetupLoading(false);
      }
    };

    generateMFASetup();
  }, [setupMFA]);

  const handleVerificationCodeChange = (e) => {
    setVerificationCode(e.target.value);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Por favor, ingresa un código de verificación válido de 6 dígitos.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await verifyMFA(secret, verificationCode);
      onComplete();
    } catch (err) {
      setError(err.message || 'Código de verificación incorrecto. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mfa-setup-container">
      <h2>Configuración de autenticación de dos factores</h2>
      
      {error && <AlertMessage type="error" message={error} />}
      
      {setupLoading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Generando código QR...</p>
        </div>
      ) : (
        <>
          <div className="mfa-instructions">
            <p>
              Para mejorar la seguridad de tu cuenta, configura la autenticación de dos factores siguiendo estos pasos:
            </p>
            <ol>
              <li>Descarga una aplicación de autenticación como Google Authenticator o Authy en tu dispositivo móvil.</li>
              <li>Escanea el código QR con la aplicación o ingresa manualmente el código secreto.</li>
              <li>Ingresa el código de verificación de 6 dígitos que se muestra en tu aplicación.</li>
            </ol>
          </div>
          
          <div className="qr-code-container">
            {qrCode ? (
              <img src={qrCode} alt="Código QR para MFA" className="qr-code" />
            ) : (
              <div className="qr-placeholder">
                Error al generar el código QR
              </div>
            )}
          </div>
          
          <div className="secret-key">
            <p>¿No puedes escanear el código QR? Ingresa esta clave en tu aplicación:</p>
            <div className="secret-key-value">
              {secret}
            </div>
          </div>
          
          <form onSubmit={handleVerify} className="verification-form">
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
                disabled={loading}
              >
                {loading ? 'Verificando...' : 'Verificar y activar'}
              </Button>
              
              <Button
                type="button"
                className="btn-secondary"
                onClick={onCancel}
                disabled={loading}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default MFASetup;