/**
 * Validador de correo electrónico
 * @param {string} email - Correo electrónico para validar
 * @returns {boolean} Verdadero si el correo es válido
 */
export const validateEmail = (email) => {
    if (!email) return false;
    
    // Expresión regular para validar un correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  /**
   * Validador de contraseña
   * Verifica que la contraseña cumpla con los requisitos mínimos:
   * - Al menos 8 caracteres
   * - Al menos una letra mayúscula
   * - Al menos una letra minúscula
   * - Al menos un número
   * 
   * @param {string} password - Contraseña para validar
   * @returns {boolean} Verdadero si la contraseña cumple los requisitos
   */
  export const validatePassword = (password) => {
    if (!password) return false;
    
    // Verificar longitud mínima
    if (password.length < 8) return false;
    
    // Verificar al menos una letra mayúscula
    if (!/[A-Z]/.test(password)) return false;
    
    // Verificar al menos una letra minúscula
    if (!/[a-z]/.test(password)) return false;
    
    // Verificar al menos un número
    if (!/[0-9]/.test(password)) return false;
    
    return true;
  };
  
  /**
   * Validador de teléfono
   * @param {string} phone - Número de teléfono para validar
   * @returns {boolean} Verdadero si el teléfono es válido
   */
  export const validatePhone = (phone) => {
    if (!phone) return false;
    
    // Eliminar cualquier caracter que no sea un número
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Verificar que tenga entre 10 y 15 dígitos (estándar internacional)
    return cleanPhone.length >= 10 && cleanPhone.length <= 15;
  };
  
  /**
   * Validador de nombre completo
   * @param {string} name - Nombre completo para validar
   * @returns {boolean} Verdadero si el nombre es válido
   */
  export const validateName = (name) => {
    if (!name) return false;
    
    // Verificar que tenga al menos dos palabras (nombre y apellido)
    const words = name.trim().split(/\s+/);
    if (words.length < 2) return false;
    
    // Verificar que cada palabra tenga al menos 2 caracteres
    return words.every(word => word.length >= 2);
  };
  
  /**
   * Validador de URL
   * @param {string} url - URL para validar
   * @returns {boolean} Verdadero si la URL es válida
   */
  export const validateUrl = (url) => {
    if (!url) return false;
    
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };
  
  /**
   * Validador de igualdad entre dos valores
   * @param {any} value1 - Primer valor
   * @param {any} value2 - Segundo valor
   * @returns {boolean} Verdadero si los valores son iguales
   */
  export const validateEqual = (value1, value2) => {
    return value1 === value2;
  };
  
  /**
   * Validador de código postal
   * @param {string} zipCode - Código postal para validar
   * @returns {boolean} Verdadero si el código postal es válido
   */
  export const validateZipCode = (zipCode) => {
    if (!zipCode) return false;
    
    // Verificar que sea un número de 5 dígitos (formato común en muchos países)
    return /^\d{5}(-\d{4})?$/.test(zipCode);
  };
  
  /**
   * Validador de tarjeta de crédito
   * @param {string} cardNumber - Número de tarjeta para validar
   * @returns {boolean} Verdadero si el número de tarjeta es válido
   */
  export const validateCreditCard = (cardNumber) => {
    if (!cardNumber) return false;
    
    // Eliminar espacios y guiones
    const cleanCardNumber = cardNumber.replace(/[\s-]/g, '');
    
    // Verificar que sean solo dígitos y tenga entre 13 y 19 caracteres
    if (!/^\d{13,19}$/.test(cleanCardNumber)) return false;
    
    // Algoritmo de Luhn (mod 10)
    let sum = 0;
    let shouldDouble = false;
    
    // Suma dígitos en orden inverso
    for (let i = cleanCardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanCardNumber.charAt(i));
      
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    
    return sum % 10 === 0;
  };
  
  /**
   * Validador de fecha
   * @param {string} date - Fecha en formato YYYY-MM-DD
   * @returns {boolean} Verdadero si la fecha es válida
   */
  export const validateDate = (date) => {
    if (!date) return false;
    
    // Verificar formato YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
    
    // Verificar que la fecha sea válida
    const [year, month, day] = date.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    
    return (
      dateObj.getFullYear() === year &&
      dateObj.getMonth() + 1 === month &&
      dateObj.getDate() === day
    );
  };
  
  /**
   * Validador de fecha futura
   * @param {string} date - Fecha en formato YYYY-MM-DD
   * @returns {boolean} Verdadero si la fecha es futura
   */
  export const validateFutureDate = (date) => {
    if (!validateDate(date)) return false;
    
    const inputDate = new Date(date);
    const today = new Date();
    
    // Establecer horas, minutos, segundos y milisegundos a 0 para comparar solo fechas
    today.setHours(0, 0, 0, 0);
    
    return inputDate >= today;
  };
  
  /**
   * Validador de formulario
   * Valida múltiples campos según las reglas proporcionadas
   * 
   * @param {Object} data - Objeto con los datos del formulario
   * @param {Object} rules - Objeto con las reglas de validación
   * @returns {Object} Objeto con los errores encontrados
   */
  export const validateForm = (data, rules) => {
    const errors = {};
    
    Object.entries(rules).forEach(([field, validations]) => {
      // Obtener el valor del campo
      const value = data[field];
      
      // Ejecutar cada validación para el campo
      validations.forEach(validation => {
        const { rule, message, params = [] } = validation;
        const isValid = rule(value, ...params);
        
        if (!isValid && !errors[field]) {
          errors[field] = message;
        }
      });
    });
    
    return errors;
  };