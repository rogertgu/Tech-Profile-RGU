/**
 * typing-effect.js
 * Script para crear un efecto de tipado de texto que muestra
 * diferentes habilidades o roles de forma secuencial
 */

class TypingEffect {
  constructor(element, options = {}) {
    // El elemento donde se mostrará el efecto
    this.element = element;
    
    // Opciones con valores predeterminados
    this.options = {
      strings: options.strings || ['Network Engineer', 'Systems Expert', 'Security Specialist'],
      typeSpeed: options.typeSpeed || 80,
      backSpeed: options.backSpeed || 50,
      backDelay: options.backDelay || 1500,
      startDelay: options.startDelay || 500,
      loop: options.loop !== undefined ? options.loop : true,
      cursorChar: options.cursorChar || '|',
      showCursor: options.showCursor !== undefined ? options.showCursor : true
    };
    
    // Estado
    this.currentStringIndex = 0;
    this.currentCharIndex = 0;
    this.isDeleting = false;
    this.isWaiting = false;
    
    // Inicializar
    this.init();
  }
  
  init() {
    // Crear el contenedor para el texto
    this.createTextContainer();
    
    // Crear el cursor si está habilitado
    if (this.options.showCursor) {
      this.createCursor();
    }
    
    // Iniciar el efecto de tipado
    setTimeout(() => {
      this.type();
    }, this.options.startDelay);
  }
  
  createTextContainer() {
    // Crear un span para el texto
    this.textContainer = document.createElement('span');
    this.textContainer.className = 'typing-text';
    this.element.appendChild(this.textContainer);
  }
  
  createCursor() {
    // Crear un span para el cursor
    this.cursor = document.createElement('span');
    this.cursor.className = 'typing-cursor';
    this.cursor.innerHTML = this.options.cursorChar;
    this.cursor.style.animation = 'typing-blink 1s step-end infinite';
    this.element.appendChild(this.cursor);
    
    // Agregar la animación del cursor si no existe
    if (!document.getElementById('typing-cursor-style')) {
      const style = document.createElement('style');
      style.id = 'typing-cursor-style';
      style.innerHTML = `
        @keyframes typing-blink {
          from, to { opacity: 1; }
          50% { opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  type() {
    // Obtener el texto actual
    const currentString = this.options.strings[this.currentStringIndex];
    
    // Calcular el tiempo de espera
    let typeSpeed = this.options.typeSpeed;
    
    if (this.isDeleting) {
      // Velocidad de borrado
      typeSpeed = this.options.backSpeed;
    }
    
    // Actualizar el texto
    if (this.isDeleting) {
      // Borrar caracteres
      this.currentCharIndex--;
    } else {
      // Añadir caracteres
      this.currentCharIndex++;
    }
    
    // Establecer el texto actual
    this.textContainer.textContent = currentString.substring(0, this.currentCharIndex);
    
    // Lógica para cambiar entre escribir y borrar
    if (!this.isDeleting && this.currentCharIndex === currentString.length) {
      // Completó la escritura, esperar antes de borrar
      this.isDeleting = true;
      this.isWaiting = true;
      typeSpeed = this.options.backDelay;
    } else if (this.isDeleting && this.currentCharIndex === 0) {
      // Completó el borrado, pasar al siguiente string
      this.isDeleting = false;
      this.currentStringIndex++;
      
      // Reiniciar al primer string si es necesario
      if (this.currentStringIndex === this.options.strings.length) {
        if (this.options.loop) {
          this.currentStringIndex = 0;
        } else {
          // Detener si no hay bucle
          return;
        }
      }
    }
    
    // Continuar el efecto
    setTimeout(() => {
      this.type();
    }, this.isWaiting ? typeSpeed : Math.max(typeSpeed, 50));
    
    // Resetear el estado de espera
    this.isWaiting = false;
  }
  
  // Métodos públicos
  stop() {
    // Detener el efecto (por ejemplo, al desmontar el componente)
    this.options.loop = false;
  }
  
  updateStrings(newStrings) {
    // Actualizar los strings
    if (Array.isArray(newStrings) && newStrings.length > 0) {
      this.options.strings = newStrings;
      this.currentStringIndex = 0;
      this.currentCharIndex = 0;
      this.isDeleting = false;
    }
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Aplicar a elementos con la clase 'typing-effect'
  const typingElements = document.querySelectorAll('.typing-effect');
  
  typingElements.forEach(element => {
    // Obtener strings de atributos data-*
    let strings = [];
    if (element.dataset.strings) {
      try {
        strings = JSON.parse(element.dataset.strings);
      } catch (e) {
        strings = element.dataset.strings.split(',').map(s => s.trim());
      }
    }
    
    // Obtener opciones personalizadas
    const options = {
      strings: strings.length > 0 ? strings : undefined,
      typeSpeed: parseInt(element.dataset.typeSpeed) || undefined,
      backSpeed: parseInt(element.dataset.backSpeed) || undefined,
      backDelay: parseInt(element.dataset.backDelay) || undefined,
      startDelay: parseInt(element.dataset.startDelay) || undefined,
      loop: element.dataset.loop === 'false' ? false : undefined,
      showCursor: element.dataset.showCursor === 'false' ? false : undefined,
      cursorChar: element.dataset.cursorChar || undefined
    };
    
    // Filtrar opciones indefinidas
    Object.keys(options).forEach(key => {
      if (options[key] === undefined) {
        delete options[key];
      }
    });
    
    // Crear instancia de TypingEffect
    new TypingEffect(element, options);
  });
  
  // Aplicar automáticamente al elemento con ID 'typing-roles' si existe
  const typingRoles = document.getElementById('typing-roles');
  if (typingRoles && !typingRoles.classList.contains('typing-effect')) {
    new TypingEffect(typingRoles, {
      strings: [
        'Network Architect',
        'Systems Engineer',
        'Security Specialist',
        'Cloud Infrastructure Expert',
        'DevOps Engineer'
      ],
      typeSpeed: 70,
      backSpeed: 40,
      backDelay: 2000
    });
  }
});