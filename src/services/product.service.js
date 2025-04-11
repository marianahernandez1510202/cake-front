import api from './api';

export const productService = {
  /**
   * Obtener todos los productos
   * @param {Object} filters - Filtros opcionales (búsqueda, categoría)
   * @returns {Promise<Array>} Lista de productos
   */
  async getAllProducts(filters = {}) {
    try {
      const { search, category } = filters;
      let queryParams = '';
      
      if (search || category) {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (category) params.append('category', category);
        queryParams = `?${params.toString()}`;
      }
      
      const response = await api.get(`/api/products${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener productos:', error);
      throw error;
    }
  },
  
  /**
   * Obtener productos destacados
   * @param {number} limit - Límite de productos a obtener
   * @returns {Promise<Array>} Lista de productos destacados
   */
  async getFeaturedProducts(limit = 6) {
    try {
      const response = await api.get('/api/products');
      // Aquí podrías añadir un parámetro en tu API para filtrar destacados
      // Por ahora, simplemente devolvemos los primeros [limit] productos
      return response.data.slice(0, limit);
    } catch (error) {
      console.error('Error al obtener productos destacados:', error);
      throw error;
    }
  },
  
  /**
   * Obtener un producto por su ID
   * @param {string} id - ID del producto
   * @returns {Promise<Object>} Datos del producto
   */
  async getProductById(id) {
    try {
      const response = await api.get(`/api/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener producto ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Obtener categorías únicas de productos
   * @returns {Promise<Array>} Lista de categorías
   */
  async getCategories() {
    try {
      // Si tu API no tiene un endpoint específico para categorías,
      // puedes obtenerlas de los productos
      const response = await api.get('/api/products');
      const uniqueCategories = [...new Set(response.data.map(product => product.category))];
      return uniqueCategories;
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      throw error;
    }
  },
  
  /**
   * Crear un nuevo producto (requiere permisos de administrador)
   * @param {Object} productData - Datos del producto
   * @returns {Promise<Object>} Producto creado
   */
  async createProduct(productData) {
    try {
      const response = await api.post('/api/products', productData);
      return response.data;
    } catch (error) {
      console.error('Error al crear producto:', error);
      throw error;
    }
  },
  
  /**
   * Actualizar un producto (requiere permisos de administrador)
   * @param {string} id - ID del producto
   * @param {Object} productData - Datos a actualizar
   * @returns {Promise<Object>} Producto actualizado
   */
  async updateProduct(id, productData) {
    try {
      const response = await api.put(`/api/products/${id}`, productData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar producto ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Eliminar un producto (requiere permisos de administrador)
   * @param {string} id - ID del producto
   * @returns {Promise<Object>} Mensaje de confirmación
   */
  async deleteProduct(id) {
    try {
      const response = await api.delete(`/api/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar producto ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Obtener productos favoritos del usuario
   * @returns {Promise<Array>} Lista de productos favoritos
   */
  async getUserFavorites() {
    try {
      const response = await api.get('/api/favorites');
      return response.data;
    } catch (error) {
      console.error('Error al obtener favoritos:', error);
      throw error;
    }
  },
  
  /**
   * Añadir producto a favoritos
   * @param {string} productId - ID del producto
   * @returns {Promise<Object>} Mensaje de confirmación
   */
  async addToFavorites(productId) {
    try {
      const response = await api.post(`/api/favorites/${productId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al añadir producto ${productId} a favoritos:`, error);
      throw error;
    }
  },
  
  /**
   * Eliminar producto de favoritos
   * @param {string} productId - ID del producto
   * @returns {Promise<Object>} Mensaje de confirmación
   */
  async removeFromFavorites(productId) {
    try {
      const response = await api.delete(`/api/favorites/${productId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar producto ${productId} de favoritos:`, error);
      throw error;
    }
  }
};

export default productService;