import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { productService } from '../services/product.service';

const ProductPage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [customizationOpen, setCustomizationOpen] = useState(false);
  
  // Opciones de personalización
  const [customization, setCustomization] = useState({
    size: 'medium',
    message: '',
    decorationType: 'standard',
    additionalNotes: ''
  });
  
  // Cargar datos del producto
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const productData = await productService.getProductById(id);
        setProduct(productData);
        
        // Verificar si el producto está en favoritos
        if (isAuthenticated) {
          try {
            const favorites = await productService.getUserFavorites();
            setIsFavorite(favorites.some(fav => fav._id === id));
          } catch (err) {
            console.error('Error al verificar favoritos:', err);
          }
        }
      } catch (err) {
        console.error('Error al cargar producto:', err);
        setError('No se pudo cargar la información del producto');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductData();
  }, [id, isAuthenticated]);
  
  // Manejar cambio de cantidad
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };
  
  // Manejar incremento/decremento de cantidad
  const handleQuantityAdjust = (amount) => {
    const newQuantity = quantity + amount;
    if (newQuantity > 0) {
      setQuantity(newQuantity);
    }
  };
  
  // Manejar cambios en personalización
  const handleCustomizationChange = (e) => {
    const { name, value } = e.target;
    setCustomization(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Manejar agregar/quitar de favoritos
  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/producto/${id}` } });
      return;
    }
    
    try {
      if (isFavorite) {
        await productService.removeFromFavorites(id);
      } else {
        await productService.addToFavorites(id);
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error al actualizar favorito:', error);
    }
  };
  
  // Manejar agregar al carrito
  const handleAddToCart = () => {
    // Aquí implementarías la lógica para agregar al carrito
    alert(`${product.name} añadido al carrito (${quantity} unidades)`);
  };
  
  // Manejar envío del formulario de personalización
  const handleSubmitCustomization = (e) => {
    e.preventDefault();
    // Aquí implementarías la lógica para guardar la personalización
    alert(`${product.name} personalizado y añadido al carrito (${quantity} unidades)`);
    setCustomizationOpen(false);
  };
  
  if (loading) {
    return (
      <div className="product-page">
        <Navbar />
        <div className="container">
          <div className="loading-container">
            <LoadingSpinner />
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="product-page">
        <Navbar />
        <div className="container">
          <div className="error-message">
            {error || 'No se encontró el producto'}
          </div>
          <Link to="/catalogo" className="btn-secondary">
            Volver al catálogo
          </Link>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="product-page">
      <Navbar />
      
      <main className="container">
        <div className="product-detail-container">
          <div className="product-detail-image">
            <img src={product.image || product.imageUrl || '/placeholder-cake.jpg'} alt={product.name} />
            <button
              className={`favorite-button ${isFavorite ? 'active' : ''}`}
              onClick={handleToggleFavorite}
              aria-label={isFavorite ? 'Eliminar de favoritos' : 'Añadir a favoritos'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </button>
          </div>
          
          <div className="product-detail-info">
            <h1 className="product-title">{product.name}</h1>
            
            <div className="product-price">
              ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
            </div>
            
            <div className="product-description">
              <p>{product.description}</p>
            </div>
            
            <div className="product-category">
              <span className="category-label">Categoría:</span> 
              <span className="category-value">{product.category}</span>
            </div>
            
            <div className="product-availability">
              {product.isAvailable ? (
                <span className="available">Disponible</span>
              ) : (
                <span className="unavailable">No disponible</span>
              )}
            </div>
            
            {product.isAvailable && (
              <div className="product-actions">
                <div className="quantity-control">
                  <button 
                    className="quantity-btn"
                    onClick={() => handleQuantityAdjust(-1)}
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="quantity-input"
                  />
                  <button 
                    className="quantity-btn"
                    onClick={() => handleQuantityAdjust(1)}
                  >
                    +
                  </button>
                </div>
                
                <button 
                  className="btn-primary add-to-cart-btn"
                  onClick={handleAddToCart}
                >
                  Agregar al carrito
                </button>
                
                <button 
                  className="btn-secondary customize-btn"
                  onClick={() => setCustomizationOpen(true)}
                >
                  Personalizar pastel
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Modal de personalización */}
        {customizationOpen && (
          <div className="customization-modal">
            <div className="customization-content">
              <button 
                className="close-modal"
                onClick={() => setCustomizationOpen(false)}
              >
                ×
              </button>
              
              <h2>Personaliza tu {product.name}</h2>
              
              <form onSubmit={handleSubmitCustomization}>
                <div className="form-group">
                  <label htmlFor="size">Tamaño:</label>
                  <select 
                    id="size" 
                    name="size" 
                    value={customization.size}
                    onChange={handleCustomizationChange}
                    className="form-control"
                  >
                    <option value="small">Pequeño (6-8 porciones)</option>
                    <option value="medium">Mediano (10-12 porciones)</option>
                    <option value="large">Grande (15-20 porciones)</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="decorationType">Tipo de decoración:</label>
                  <select 
                    id="decorationType" 
                    name="decorationType" 
                    value={customization.decorationType}
                    onChange={handleCustomizationChange}
                    className="form-control"
                  >
                    <option value="standard">Estándar</option>
                    <option value="flowers">Flores</option>
                    <option value="chocolate">Decoración de chocolate</option>
                    <option value="fruits">Frutas</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Mensaje en el pastel:</label>
                  <input 
                    type="text" 
                    id="message" 
                    name="message"
                    value={customization.message}
                    onChange={handleCustomizationChange}
                    maxLength="50"
                    placeholder="Feliz Cumpleaños, etc."
                    className="form-control"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="additionalNotes">Instrucciones adicionales:</label>
                  <textarea 
                    id="additionalNotes" 
                    name="additionalNotes"
                    value={customization.additionalNotes}
                    onChange={handleCustomizationChange}
                    rows="3"
                    placeholder="Especificaciones adicionales para tu pastel..."
                    className="form-control"
                  ></textarea>
                </div>
                
                <div className="customization-actions">
                  <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={() => setCustomizationOpen(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary">
                    Agregar al carrito
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductPage;