import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { productService } from '../../services/product.service';

const ProductCard = ({ product }) => {
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(product.isFavorite || false);
  const [loading, setLoading] = useState(false);

  const toggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      if (isFavorite) {
        await productService.removeFromFavorites(product._id);
      } else {
        await productService.addToFavorites(product._id);
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error al actualizar favorito:', error);
    } finally {
      setLoading(false);
    }
  };

  // Manejar la imagen en caso de que el servidor tenga una estructura diferente
  const imageUrl = product.image || product.imageUrl || '/placeholder-cake.jpg';

  // Formatear precio correctamente
  const formattedPrice = typeof product.price === 'number' 
    ? `$${product.price.toFixed(2)}`
    : product.price;

  return (
    <div className="product-card">
      <Link to={`/producto/${product._id}`} className="product-link">
        <div className="product-image">
          <img src={imageUrl} alt={product.name} />
          
          {isAuthenticated && (
            <button 
              className={`favorite-button ${isFavorite ? 'active' : ''} ${loading ? 'loading' : ''}`}
              onClick={toggleFavorite}
              disabled={loading}
              aria-label={isFavorite ? "Eliminar de favoritos" : "Añadir a favoritos"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </button>
          )}
        </div>
        
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-description">{product.description}</p>
          <div className="product-price">{formattedPrice}</div>
          {!product.isAvailable && <div className="product-unavailable">No disponible</div>}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;