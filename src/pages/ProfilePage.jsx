import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import AlertMessage from '../components/common/AlertMessage';
import MFASetup from '../components/auth/MFASetup';
import { userService } from '../services/user.service';
import Button from '../components/ui/Button';
import defaultProfileImage from '../assets/images/default-profile.jpg';

const ProfilePage = () => {
  const { user: authUser, logout } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    domicilio: '',
  });
  const [showMFASetup, setShowMFASetup] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const userData = await userService.getProfile();
        setUser(userData);
        setFormData({
          nombre: userData.nombre || '',
          apellido: userData.apellido || '',
          domicilio: userData.domicilio || '',
        });
        setLoading(false);
      } catch (err) {
        setError('Error al cargar el perfil. Por favor, intenta nuevamente.');
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Create form data to handle file upload if there's an image
      const formDataToSend = new FormData();
      
      // Add text fields
      Object.keys(formData).forEach(key => {
        if (formData[key]) formDataToSend.append(key, formData[key]);
      });
      
      // Add profile image if exists
      if (profileImage) {
        formDataToSend.append('profileImage', profileImage);
      }

      const updatedUser = await userService.updateProfile(formDataToSend);
      setUser(updatedUser);
      setSuccess('Perfil actualizado exitosamente');
    } catch (err) {
      setError(err.message || 'Error al actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleMFASetup = () => {
    setShowMFASetup(true);
  };

  const handleMFASetupComplete = () => {
    setShowMFASetup(false);
    setSuccess('Autenticación de dos factores configurada exitosamente');
  };

  const handleMFASetupCancel = () => {
    setShowMFASetup(false);
  };

  const handleDisableMFA = async () => {
    try {
      await userService.disableMFA();
      setSuccess('Autenticación de dos factores desactivada exitosamente');
      
      // Actualizar los datos del usuario
      const userData = await userService.getProfile();
      setUser(userData);
    } catch (err) {
      setError(err.message || 'Error al desactivar la autenticación de dos factores');
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <Navbar />
        <div className="profile-container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Cargando perfil...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (showMFASetup) {
    return (
      <div className="profile-page">
        <Navbar />
        <div className="profile-container">
          <MFASetup 
            onComplete={handleMFASetupComplete} 
            onCancel={handleMFASetupCancel} 
          />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Navbar />
      
      <div className="profile-container">
        <div className="profile-header">
          <h1>Mi Perfil</h1>
        </div>
        
        {error && <AlertMessage type="error" message={error} />}
        {success && <AlertMessage type="success" message={success} />}
        
        <div className="profile-content">
          {/* Foto de perfil - Nuevo componente */}
          <div className="profile-photo-container">
            <div className="profile-photo">
              {previewImage || (user && user.profileImage) ? (
                <img 
                  src={previewImage || user.profileImage} 
                  alt="Profile" 
                  className="profile-image" 
                />
              ) : (
                <div className="profile-placeholder">
                  <img src={defaultProfileImage} alt="Default Profile" />
                  <span>Foto</span>
                </div>
              )}
              
              <input 
                type="file" 
                id="profile-image-upload" 
                onChange={handleImageChange} 
                className="image-upload-input" 
              />
              <label htmlFor="profile-image-upload" className="upload-photo-btn">
                Cambiar foto
              </label>
            </div>
          </div>

          <div className="profile-sections-container">
            <div className="profile-section">
              <h2>Información Personal</h2>
              
              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-group">
                  <label htmlFor="nombre">Nombre</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="apellido">Apellido</label>
                  <input
                    type="text"
                    id="apellido"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={user?.email || ''}
                    className="form-control"
                    disabled
                  />
                  <small className="form-text text-muted">
                    El email no se puede modificar
                  </small>
                </div>
                
                <div className="form-group">
                  <label htmlFor="domicilio">Domicilio</label>
                  <textarea
                    id="domicilio"
                    name="domicilio"
                    value={formData.domicilio}
                    onChange={handleChange}
                    className="form-control"
                    rows="3"
                    required
                  />
                </div>
                
                <div className="form-actions">
                  <Button
                    type="submit"
                    className="btn-primary"
                    disabled={saving}
                  >
                    {saving ? 'Guardando...' : 'Guardar Cambios'}
                  </Button>
                </div>
              </form>
            </div>
            
            <div className="profile-section">
              <h2>Seguridad</h2>
              
              <div className="security-options">
                <div className="security-option">
                  <div className="security-option-info">
                    <h3>Cambiar Contraseña</h3>
                    <p>Actualiza regularmente tu contraseña para mantener tu cuenta segura.</p>
                  </div>
                  <Button
                    className="btn-secondary"
                    onClick={() => {}}
                  >
                    Cambiar Contraseña
                  </Button>
                </div>
                
                <div className="security-option">
                  <div className="security-option-info">
                    <h3>Autenticación de Dos Factores</h3>
                    <p>
                      Añade una capa adicional de seguridad a tu cuenta requiriendo un código 
                      además de tu contraseña.
                    </p>
                  </div>
                  {user?.mfaEnabled ? (
                    <Button
                      className="btn-danger"
                      onClick={handleDisableMFA}
                    >
                      Desactivar MFA
                    </Button>
                  ) : (
                    <Button
                      className="btn-primary"
                      onClick={handleMFASetup}
                    >
                      Configurar MFA
                    </Button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="profile-section">
              <h2>Cuenta</h2>
              
              <div className="account-options">
                <div className="account-option">
                  <div className="account-option-info">
                    <h3>Cerrar sesión en todos los dispositivos</h3>
                    <p>Cierra todas las sesiones activas en todos tus dispositivos.</p>
                  </div>
                  <Button
                    className="btn-secondary"
                    onClick={logout}
                  >
                    Cerrar Sesiones
                  </Button>
                </div>
                
                <div className="account-option">
                  <div className="account-option-info">
                    <h3>Eliminar cuenta</h3>
                    <p>
                      Esta acción no se puede deshacer. Eliminar tu cuenta borrará permanentemente 
                      todos tus datos.
                    </p>
                  </div>
                  <Button
                    className="btn-danger"
                    onClick={() => {}}
                  >
                    Eliminar Cuenta
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProfilePage;