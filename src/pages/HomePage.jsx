import React, { useEffect, useState, useRef } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ProductCard from '../components/ui/ProductCard';
import WebSocketStatus from '../components/common/WebSocketStatus';
import { productService } from '../services/product.service';


const HomePage = () => {
  const { isAuthenticated, user } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const bannerImages = [
    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1089&q=80",
    "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1087&q=80",
    "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1087&q=80"
  ];
  
  // Carousel auto-scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prevSlide => (prevSlide + 1) % bannerImages.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [bannerImages.length]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Cargar productos destacados
        const featured = await productService.getFeaturedProducts();
        setFeaturedProducts(featured);

        // Cargar favoritos si el usuario está autenticado
        if (isAuthenticated && user) {
          const favorites = await productService.getUserFavorites();
          setFavoriteProducts(favorites);
        }
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated, user]);

  // Redirigir a login si no está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="home-page">
      <Navbar />
      
      <div className="home-banner-container">
        <div className="product-banner">
          <div className="banner-carousel" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {bannerImages.map((image, index) => (
              <div key={index} className="banner-image">
                <img src={image} alt={`Delicious product ${index + 1}`} />
              </div>
            ))}
          </div>
          <div className="carousel-indicators">
            {bannerImages.map((_, index) => (
              <button 
                key={index} 
                className={`indicator ${currentSlide === index ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
        
        <div className="welcome-text-container">
          <div className="welcome-text">
            <h1>¡Bienvenido/a, {user?.name}!</h1>
            <p>Descubre nuestras deliciosas creaciones</p>
            <Link to="/catalogo" className="btn-primary">
              Ver productos
            </Link>
          </div>
        </div>
      </div>

      <div className="home-content">
        {/* Remove the WebSocketStatus component that likely contains the heart icon */}
        
        <section className="featured-products">
          <div className="container">
            <h2 className="section-title">Productos Destacados</h2>
            <div className="lorem-section">
              <h3>Loreum procesium latium natin lerium larou lero liuri</h3>
            </div>
            <div className="products-grid">
              {loading ? (
                <div className="loading">Cargando productos...</div>
              ) : (
                featuredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
              )}
            </div>
          </div>
        </section>

        {isAuthenticated && favoriteProducts.length > 0 && (
          <section className="recent-favorites">
            <div className="container">
              <h2 className="section-title">Tus Favoritos Recientes</h2>
              <div className="products-grid">
                {favoriteProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
