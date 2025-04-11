import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ProductCard from '../components/ui/ProductCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { productService } from '../services/product.service';
import { websocketService } from '../services/websocket.service';

const CatalogPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // Cargar productos y categorías
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Cargar productos
        const productsData = await productService.getAllProducts();
        setProducts(productsData);
        
        // Obtener categorías únicas de los productos
        const uniqueCategories = [...new Set(productsData.map(product => product.category))];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('No se pudieron cargar los productos');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Configurar WebSocket
  useEffect(() => {
    // Conectar WebSocket
    websocketService.connect('products-updates');
    
    // Manejar mensajes de WebSocket
    const handleWebSocketMessage = (data) => {
      if (data.type === 'PRODUCT_UPDATED') {
        // Actualizar el producto en nuestro estado
        setProducts(prevProducts => 
          prevProducts.map(product => 
            product._id === data.product._id 
              ? { ...product, ...data.product } 
              : product
          )
        );
      } else if (data.type === 'PRODUCT_CREATED') {
        // Agregar nuevo producto
        setProducts(prevProducts => [...prevProducts, data.product]);
      } else if (data.type === 'PRODUCT_DELETED') {
        // Eliminar producto
        setProducts(prevProducts => 
          prevProducts.filter(product => product._id !== data.productId)
        );
      }
    };
    
    // Manejar cambios de conexión
    const handleConnectionChange = (connected) => {
      setIsConnected(connected);
    };
    
    // Registrar listeners
    websocketService.addMessageListener(handleWebSocketMessage);
    websocketService.addConnectionListener(handleConnectionChange);
    
    // Limpiar al desmontar
    return () => {
      websocketService.removeMessageListener(handleWebSocketMessage);
      websocketService.removeConnectionListener(handleConnectionChange);
      websocketService.disconnect();
    };
  }, []);

  // Filtrar productos
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    
    return matchesSearch && matchesCategory;
  });

  // Manejar búsqueda
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Manejar selección de categoría
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  return (
    <div className="catalog-page">
      <Navbar />
      
      <main>
        <div className="catalog-container container">
          <h1 className="catalog-title">Catálogo de Productos</h1>
          
          {isConnected && (
            <div className="websocket-status connected">
              <span className="status-dot"></span> Actualizaciones en tiempo real
            </div>
          )}
          
          <div className="catalog-filters">
            <div className="search-filter">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={handleSearch}
                className="form-control"
              />
            </div>
            
            <div className="category-filter">
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="form-control"
              >
                <option value="">Todas las categorías</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {loading ? (
            <div className="loading-container">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : filteredProducts.length === 0 ? (
            <div className="no-results">
              <p>No se encontraron productos que coincidan con tu búsqueda.</p>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CatalogPage;