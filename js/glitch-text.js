/**
 * glitch-text.js
 * Script para crear un efecto de glitch en textos, dando una apariencia
 * tecnológica y moderna a los títulos principales
 */

class GlitchText {
  constructor(element, options = {}) {
    // El elemento al que aplicaremos el efecto
    this.element = element;
    
    // Texto original
    this.originalText = element.textContent;
    
    // Opciones con valores predeterminados
    this.options = {
      glitchInterval: options.glitchInterval || 3000, // Intervalo entre glitches
      glitchDuration: options.glitchDuration || 200,  // Duración de cada glitch
      glitchIntensity: options.glitchIntensity || 5,  // Número de cambios durante el glitch
      characters: options.characters || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?', // Caracteres para el glitch
      enabled: options.enabled !== undefined ? options.enabled : true, // Habilitar/deshabilitar
      hoverTrigger: options.hoverTrigger || false // Activar al pasar el mouse
    };
    
    // Estado
    this.isGlitching = false;
    this.glitchInterval = null;
    
    // Inicializar
    if (this.options.enabled) {
      this.init();
    }
  }
  
  init() {
    // Crear contenedor para el efecto
    this.createContainer();
    
    // Iniciar el intervalo de glitch
    if (!this.options.hoverTrigger) {
      this.startGlitchInterval();
    } else {
      // Eventos de mouse para activar el glitch
      this.element.addEventListener('mouseenter', () => this.triggerGlitch());
    }
  }
  
  createContainer() {
    // Crear un contenedor para mantener el mismo tamaño durante el glitch
    const container = document.createElement('span');
    container.style.display = 'inline-block';
    container.style.position = 'relative';
    
    // Mover el texto al contenedor
    container.textContent = this.originalText;
    this.element.textContent = '';
    this.element.appendChild(container);
    
    // Guardar referencia al contenedor
    this.container = container;
  }
  
  startGlitchInterval() {
    // Iniciar intervalo para el efecto de glitch
    this.glitchInterval = setInterval(() => {
      this.triggerGlitch();
    }, this.options.glitchInterval);
  }
  
  stopGlitchInterval() {
    // Detener el intervalo
    if (this.glitchInterval) {
      clearInterval(this.glitchInterval);
      this.glitchInterval = null;
    }
  }
  
  triggerGlitch() {
    // Evitar múltiples glitches simultáneos
    if (this.isGlitching) return;
    
    this.isGlitching = true;
    let glitchCount = 0;
    const maxGlitches = this.options.glitchIntensity;
    
    // Función para un solo paso de glitch
    const glitchStep = () => {
      // Generar texto con glitch
      const glitchedText = this.generateGlitchedText();
      this.container.textContent = glitchedText;
      
      glitchCount++;
      
      // Continuar o finalizar el glitch
      if (glitchCount < maxGlitches) {
        setTimeout(glitchStep, this.options.glitchDuration / maxGlitches);
      } else {
        // Restaurar texto original
        setTimeout(() => {
          this.container.textContent = this.originalText;
          this.isGlitching = false;
        }, this.options.glitchDuration / maxGlitches);
      }
    };
    
    // Iniciar el proceso de glitch
    glitchStep();
  }
  
  generateGlitchedText() {
    const text = this.originalText;
    let result = '';
    
    // Determinar cuántos caracteres cambiar (entre 1 y 3)
    const charsToChange = Math.floor(Math.random() * 3) + 1;
    
    // Posiciones a cambiar
    const positions = [];
    for (let i = 0; i < charsToChange; i++) {
      let pos;
      do {
        pos = Math.floor(Math.random() * text.length);
      } while (positions.includes(pos));
      positions.push(pos);
    }
    
    // Generar texto con glitch
    for (let i = 0; i < text.length; i++) {
      if (positions.includes(i)) {
        // Reemplazar con un carácter aleatorio
        const randomChar = this.options.characters.charAt(
          Math.floor(Math.random() * this.options.characters.length)
        );
        result += randomChar;
      } else {
        result += text[i];
      }
    }
    
    return result;
  }
  
  // Métodos públicos para controlar el efecto
  enable() {
    if (!this.options.enabled) {
      this.options.enabled = true;
      if (!this.options.hoverTrigger) {
        this.startGlitchInterval();
      }
    }
  }
  
  disable() {
    if (this.options.enabled) {
      this.options.enabled = false;
      this.stopGlitchInterval();
    }
  }
  
  updateText(newText) {
    this.originalText = newText;
    this.container.textContent = newText;
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Aplicar a elementos con la clase 'glitch-text'
  const glitchElements = document.querySelectorAll('.glitch-text');
  
  glitchElements.forEach(element => {
    // Obtener opciones personalizadas de atributos data-*
    const options = {
      glitchInterval: parseInt(element.dataset.glitchInterval) || 3000,
      glitchDuration: parseInt(element.dataset.glitchDuration) || 200,
      glitchIntensity: parseInt(element.dataset.glitchIntensity) || 5,
      hoverTrigger: element.dataset.hoverTrigger === 'true'
    };
    
    // Crear instancia de GlitchText
    new GlitchText(element, options);
  });
  
  // Aplicar automáticamente al título principal si tiene el ID 'hero-title'
  const heroTitle = document.getElementById('hero-title');
  if (heroTitle && !heroTitle.classList.contains('glitch-text')) {
    new GlitchText(heroTitle, {
      glitchInterval: 5000,
      glitchDuration: 300,
      glitchIntensity: 7,
      hoverTrigger: true
    });
  }
});