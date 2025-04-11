import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { productService } from '../services/product.service';
import { websocketService } from '../services/websocket.service';

const FavoritesPage = () => {
  const { isAuthenticated, user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setLoading(true);
        const favoriteProducts = await productService.getUserFavorites();
        setFavorites(favoriteProducts);
      } catch (err) {
        console.error('Error al cargar favoritos:', err);
        setError('No se pudieron cargar tus productos favoritos');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      loadFavorites();
    }
  }, [isAuthenticated]);

  // Configurar WebSocket para actualizar favoritos en tiempo real
  useEffect(() => {
    if (!isAuthenticated) return;
    
    // Conectar WebSocket
    websocketService.connect('favorites-updates');
    
    // Manejar mensajes de WebSocket
    const handleWebSocketMessage = (data) => {
      if (data.type === 'FAVORITE_ADDED') {
        // Verificar si el producto ya existe en favoritos
        setFavorites(prevFavorites => {
          if (prevFavorites.some(fav => fav._id === data.product._id)) {
            return prevFavorites;
          }
          return [...prevFavorites, data.product];
        });
      } else if (data.type === 'FAVORITE_REMOVED') {
        // Eliminar producto de favoritos
        setFavorites(prevFavorites => 
          prevFavorites.filter(product => product._id !== data.productId)
        );
      }
    };
    
    // Registrar listener
    websocketService.addMessageListener(handleWebSocketMessage);
    
    // Limpiar al desmontar
    return () => {
      websocketService.removeMessageListener(handleWebSocketMessage);
      websocketService.disconnect();
    };
  }, [isAuthenticated]);

  // Redirigir a login si no está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Manejar eliminación de favorito
  const handleRemoveFavorite = async (productId) => {
    try {
      await productService.removeFromFavorites(productId);
      // La actualización real se hará a través del WebSocket
    } catch (error) {
      console.error('Error al eliminar favorito:', error);
    }
  };

  return (
    <div className="favorites-page">
      <Navbar />
      
      <main>
        <div className="favorites-container container">
          <h1 className="page-title">Mis Favoritos</h1>
          
          {loading ? (
            <div className="loading-container">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : favorites.length === 0 ? (
            <div className="empty-favorites">
              <div className="empty-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
              <h2>Aún no tienes favoritos</h2>
              <p>Explora nuestro catálogo y añade tus pasteles favoritos</p>
              <Link to="/catalogo" className="btn-primary">
                Ver catálogo
              </Link>
            </div>
          ) : (
            <>
              <div className="favorites-count">
                {favorites.length} {favorites.length === 1 ? 'producto' : 'productos'} en tus favoritos
              </div>
              
              {/* Lista de productos favoritos en formato ovalado */}
              <div className="favorites-oval-list">
                {favorites.map(product => (
                  <div key={product._id} className="favorite-oval-item">
                    <div className="oval-product-image">
                      <img 
                        src={product.image || product.imageUrl || '/placeholder-cake.jpg'} 
                        alt={product.name} 
                      />
                      <button 
                        className="remove-favorite-button"
                        onClick={() => handleRemoveFavorite(product._id)}
                        aria-label="Eliminar de favoritos"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                      </button>
                    </div>
                    <div className="oval-product-info">
                      <h2 className="oval-product-name">{product.name}</h2>
                      <p className="oval-product-description">{product.description}</p>
                      <div className="oval-product-price">
                        ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                      </div>
                      <Link to={`/producto/${product._id}`} className="view-product-link">
                        Ver detalles
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FavoritesPage;