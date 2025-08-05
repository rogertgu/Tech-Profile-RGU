/**
 * contact-form.js
 * Script para manejar el formulario de contacto con validación,
 * animaciones y simulación de envío
 */

class ContactForm {
  constructor(options = {}) {
    // Opciones con valores predeterminados
    this.options = {
      formSelector: options.formSelector || '#contact-form',
      submitButtonSelector: options.submitButtonSelector || '#submit-button',
      successMessageSelector: options.successMessageSelector || '.success-message',
      errorMessageSelector: options.errorMessageSelector || '.error-message',
      inputSelectors: options.inputSelectors || 'input, textarea',
      requiredFields: options.requiredFields || ['name', 'email', 'message'],
      validationMessages: options.validationMessages || {
        required: 'Este campo es obligatorio',
        email: 'Por favor, introduce un email válido',
        minLength: 'Este campo debe tener al menos {min} caracteres'
      },
      simulateSubmission: options.simulateSubmission !== undefined ? options.simulateSubmission : true,
      simulationDelay: options.simulationDelay || 1500
    };
    
    // Estado
    this.isSubmitting = false;
    
    // Elementos DOM
    this.form = document.querySelector(this.options.formSelector);
    
    // Inicializar si el formulario existe
    if (this.form) {
      this.init();
    }
  }
  
  init() {
    // Obtener elementos del formulario
    this.submitButton = this.form.querySelector(this.options.submitButtonSelector) || 
                        this.form.querySelector('button[type="submit"]');
    this.successMessage = this.form.querySelector(this.options.successMessageSelector);
    this.errorMessage = this.form.querySelector(this.options.errorMessageSelector);
    this.inputs = this.form.querySelectorAll(this.options.inputSelectors);
    
    // Crear mensajes de éxito y error si no existen
    this.createMessages();
    
    // Añadir estilos CSS para las animaciones si no existen
    this.addFormStyles();
    
    // Configurar eventos de validación
    this.setupValidation();
    
    // Configurar evento de envío
    this.setupSubmission();
  }
  
  createMessages() {
    // Crear mensaje de éxito si no existe
    if (!this.successMessage) {
      this.successMessage = document.createElement('div');
      this.successMessage.className = 'success-message';
      this.successMessage.style.display = 'none';
      this.successMessage.innerHTML = '<p>¡Mensaje enviado con éxito! Me pondré en contacto contigo pronto.</p>';
      this.form.appendChild(this.successMessage);
    }
    
    // Crear mensaje de error si no existe
    if (!this.errorMessage) {
      this.errorMessage = document.createElement('div');
      this.errorMessage.className = 'error-message';
      this.errorMessage.style.display = 'none';
      this.errorMessage.innerHTML = '<p>Ha ocurrido un error al enviar el mensaje. Por favor, inténtalo de nuevo.</p>';
      this.form.appendChild(this.errorMessage);
    }
  }
  
  addFormStyles() {
    // Verificar si ya existen los estilos
    if (document.getElementById('contact-form-styles')) {
      return;
    }
    
    // Crear elemento de estilo
    const style = document.createElement('style');
    style.id = 'contact-form-styles';
    
    // Definir estilos para el formulario
    style.innerHTML = `
      /* Estilos para el formulario de contacto */
      ${this.options.formSelector} {
        position: relative;
      }
      
      ${this.options.formSelector} .form-group {
        margin-bottom: 20px;
        position: relative;
      }
      
      ${this.options.formSelector} input,
      ${this.options.formSelector} textarea {
        transition: border-color 0.3s, box-shadow 0.3s;
      }
      
      ${this.options.formSelector} input:focus,
      ${this.options.formSelector} textarea:focus {
        outline: none;
      }
      
      ${this.options.formSelector} input.error,
      ${this.options.formSelector} textarea.error {
        border-color: #e74c3c;
      }
      
      ${this.options.formSelector} input.valid,
      ${this.options.formSelector} textarea.valid {
        border-color: #2ecc71;
      }
      
      ${this.options.formSelector} .error-text {
        color: #e74c3c;
        font-size: 0.85em;
        margin-top: 5px;
        display: none;
      }
      
      ${this.options.formSelector} .error-text.visible {
        display: block;
        animation: fadeIn 0.3s;
      }
      
      ${this.options.formSelector} button[type="submit"] {
        position: relative;
        transition: all 0.3s;
      }
      
      ${this.options.formSelector} button[type="submit"].loading {
        padding-right: 40px;
      }
      
      ${this.options.formSelector} button[type="submit"].loading::after {
        content: '';
        position: absolute;
        right: 15px;
        top: 50%;
        transform: translateY(-50%);
        width: 15px;
        height: 15px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top: 2px solid #fff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      
      ${this.options.successMessageSelector},
      ${this.options.errorMessageSelector} {
        padding: 15px;
        border-radius: 5px;
        margin-top: 20px;
        display: none;
        animation: fadeIn 0.5s;
      }
      
      ${this.options.successMessageSelector} {
        background-color: rgba(46, 204, 113, 0.1);
        border: 1px solid #2ecc71;
        color: #2ecc71;
      }
      
      ${this.options.errorMessageSelector} {
        background-color: rgba(231, 76, 60, 0.1);
        border: 1px solid #e74c3c;
        color: #e74c3c;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes spin {
        0% { transform: translateY(-50%) rotate(0deg); }
        100% { transform: translateY(-50%) rotate(360deg); }
      }
    `;
    
    // Añadir estilos al documento
    document.head.appendChild(style);
  }
  
  setupValidation() {
    // Añadir eventos de validación a los campos
    this.inputs.forEach(input => {
      // Crear elemento para mensajes de error si no existe
      let errorElement = input.parentNode.querySelector('.error-text');
      if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-text';
        input.parentNode.appendChild(errorElement);
      }
      
      // Validar al perder el foco
      input.addEventListener('blur', () => {
        this.validateInput(input);
      });
      
      // Validar al escribir (después de un error)
      input.addEventListener('input', () => {
        if (input.classList.contains('error')) {
          this.validateInput(input);
        }
      });
    });
  }
  
  validateInput(input) {
    // Obtener el valor del campo
    const value = input.value.trim();
    
    // Obtener el nombre del campo
    const name = input.name || input.getAttribute('data-name') || '';
    
    // Obtener el elemento de error
    const errorElement = input.parentNode.querySelector('.error-text');
    
    // Comprobar si es un campo requerido
    const isRequired = this.options.requiredFields.includes(name) || 
                      input.hasAttribute('required') || 
                      input.getAttribute('data-required') === 'true';
    
    // Validar campo requerido
    if (isRequired && value === '') {
      this.showError(input, errorElement, this.options.validationMessages.required);
      return false;
    }
    
    // Validar email
    if (name === 'email' && value !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        this.showError(input, errorElement, this.options.validationMessages.email);
        return false;
      }
    }
    
    // Validar longitud mínima
    const minLength = parseInt(input.getAttribute('minlength') || input.getAttribute('data-minlength') || '0');
    if (minLength > 0 && value.length < minLength) {
      const message = this.options.validationMessages.minLength.replace('{min}', minLength);
      this.showError(input, errorElement, message);
      return false;
    }
    
    // Si pasa todas las validaciones
    this.showValid(input, errorElement);
    return true;
  }
  
  showError(input, errorElement, message) {
    // Añadir clase de error
    input.classList.add('error');
    input.classList.remove('valid');
    
    // Mostrar mensaje de error
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.add('visible');
    }
  }
  
  showValid(input, errorElement) {
    // Añadir clase de válido
    input.classList.remove('error');
    input.classList.add('valid');
    
    // Ocultar mensaje de error
    if (errorElement) {
      errorElement.classList.remove('visible');
    }
  }
  
  validateForm() {
    // Validar todos los campos
    let isValid = true;
    
    this.inputs.forEach(input => {
      if (!this.validateInput(input)) {
        isValid = false;
      }
    });
    
    return isValid;
  }
  
  setupSubmission() {
    // Añadir evento de envío al formulario
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Evitar envíos múltiples
      if (this.isSubmitting) {
        return;
      }
      
      // Validar el formulario
      if (this.validateForm()) {
        // Iniciar envío
        this.submitForm();
      } else {
        // Mostrar mensaje de error general
        this.showErrorMessage('Por favor, corrige los errores en el formulario.');
      }
    });
  }
  
  submitForm() {
    // Marcar como enviando
    this.isSubmitting = true;
    
    // Mostrar estado de carga en el botón
    if (this.submitButton) {
      this.submitButton.classList.add('loading');
      this.submitButton.disabled = true;
    }
    
    // Ocultar mensajes anteriores
    this.hideMessages();
    
    // Si estamos simulando el envío
    if (this.options.simulateSubmission) {
      setTimeout(() => {
        // Simular éxito
        this.handleSubmissionSuccess();
      }, this.options.simulationDelay);
    } else {
      // Aquí iría el código para enviar el formulario a un servidor real
      // Por ejemplo, usando fetch o XMLHttpRequest
      
      // Ejemplo con fetch:
      /*
      const formData = new FormData(this.form);
      
      fetch(this.form.action, {
        method: this.form.method || 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error en la respuesta del servidor');
        }
        return response.json();
      })
      .then(data => {
        this.handleSubmissionSuccess();
      })
      .catch(error => {
        this.handleSubmissionError(error.message);
      });
      */
      
      // Por ahora, simulamos éxito
      setTimeout(() => {
        this.handleSubmissionSuccess();
      }, this.options.simulationDelay);
    }
  }
  
  handleSubmissionSuccess() {
    // Mostrar mensaje de éxito
    this.showSuccessMessage();
    
    // Resetear el formulario
    this.form.reset();
    
    // Resetear clases de validación
    this.inputs.forEach(input => {
      input.classList.remove('valid', 'error');
    });
    
    // Resetear estado del botón
    if (this.submitButton) {
      this.submitButton.classList.remove('loading');
      this.submitButton.disabled = false;
    }
    
    // Resetear estado de envío
    this.isSubmitting = false;
    
    // Disparar evento personalizado
    const event = new CustomEvent('formSubmitted', {
      detail: {
        success: true,
        form: this.form
      }
    });
    document.dispatchEvent(event);
  }
  
  handleSubmissionError(errorMessage) {
    // Mostrar mensaje de error
    this.showErrorMessage(errorMessage || 'Ha ocurrido un error al enviar el formulario. Por favor, inténtalo de nuevo.');
    
    // Resetear estado del botón
    if (this.submitButton) {
      this.submitButton.classList.remove('loading');
      this.submitButton.disabled = false;
    }
    
    // Resetear estado de envío
    this.isSubmitting = false;
    
    // Disparar evento personalizado
    const event = new CustomEvent('formSubmitted', {
      detail: {
        success: false,
        error: errorMessage,
        form: this.form
      }
    });
    document.dispatchEvent(event);
  }
  
  showSuccessMessage() {
    // Mostrar mensaje de éxito
    if (this.successMessage) {
      this.successMessage.style.display = 'block';
      
      // Desplazar a la vista si está fuera de la pantalla
      this.scrollToMessage(this.successMessage);
    }
  }
  
  showErrorMessage(message) {
    // Mostrar mensaje de error
    if (this.errorMessage) {
      if (message) {
        this.errorMessage.innerHTML = `<p>${message}</p>`;
      }
      this.errorMessage.style.display = 'block';
      
      // Desplazar a la vista si está fuera de la pantalla
      this.scrollToMessage(this.errorMessage);
    }
  }
  
  hideMessages() {
    // Ocultar mensajes
    if (this.successMessage) {
      this.successMessage.style.display = 'none';
    }
    
    if (this.errorMessage) {
      this.errorMessage.style.display = 'none';
    }
  }
  
  scrollToMessage(element) {
    // Desplazar a la vista si está fuera de la pantalla
    const rect = element.getBoundingClientRect();
    const isInViewport = rect.top >= 0 && rect.bottom <= window.innerHeight;
    
    if (!isInViewport) {
      element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Crear instancia global
  window.contactForm = new ContactForm();
});