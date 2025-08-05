/**
 * skills-animation.js
 * Script para animar las barras de habilidades cuando se hacen visibles
 * durante el scroll, mostrando el nivel de competencia de forma visual
 */

class SkillsAnimation {
  constructor(options = {}) {
    // Opciones con valores predeterminados
    this.options = {
      containerSelector: options.containerSelector || '.skills-container',
      skillBarSelector: options.skillBarSelector || '.skill-bar',
      progressSelector: options.progressSelector || '.skill-progress',
      valueSelector: options.valueSelector || '.skill-value',
      threshold: options.threshold || 0.2,
      animationDuration: options.animationDuration || 1000,
      animationEasing: options.animationEasing || 'ease-out',
      animateOnce: options.animateOnce !== undefined ? options.animateOnce : true,
      showPercentage: options.showPercentage !== undefined ? options.showPercentage : true
    };
    
    // Estado
    this.animated = false;
    
    // Elementos DOM
    this.container = document.querySelector(this.options.containerSelector);
    this.skillBars = document.querySelectorAll(this.options.skillBarSelector);
    
    // Inicializar si los elementos existen
    if (this.container && this.skillBars.length > 0) {
      this.init();
    }
  }
  
  init() {
    // Añadir estilos CSS para las animaciones si no existen
    this.addAnimationStyles();
    
    // Configurar las barras de habilidades
    this.setupSkillBars();
    
    // Configurar el observador de intersección
    this.setupIntersectionObserver();
  }
  
  addAnimationStyles() {
    // Verificar si ya existen los estilos
    if (document.getElementById('skills-animation-styles')) {
      return;
    }
    
    // Crear elemento de estilo
    const style = document.createElement('style');
    style.id = 'skills-animation-styles';
    
    // Definir estilos para las animaciones
    style.innerHTML = `
      /* Estilos para las barras de habilidades */
      ${this.options.skillBarSelector} {
        position: relative;
        margin-bottom: 20px;
      }
      
      ${this.options.progressSelector} {
        height: 100%;
        width: 0; /* Inicialmente en 0 */
        transition: width ${this.options.animationDuration}ms ${this.options.animationEasing};
      }
      
      ${this.options.valueSelector} {
        position: absolute;
        right: 0;
        top: 0;
        opacity: 0;
        visibility: hidden;
        transition: opacity ${this.options.animationDuration / 2}ms ${this.options.animationEasing}, visibility ${this.options.animationDuration / 2}ms ${this.options.animationEasing};
      }
      
      /* Clase para barras animadas */
      ${this.options.skillBarSelector}.animated ${this.options.valueSelector} {
        opacity: 0;
        visibility: hidden;
      }
    `;
    
    // Añadir estilos al documento
    document.head.appendChild(style);
  }
  
  setupSkillBars() {
    // Configurar cada barra de habilidades
    this.skillBars.forEach(skillBar => {
      // Obtener el valor de la habilidad
      const skillValue = parseInt(skillBar.getAttribute('data-value') || '0');
      
      // Obtener o crear el elemento de progreso
      let progressElement = skillBar.querySelector(this.options.progressSelector);
      if (!progressElement) {
        progressElement = document.createElement('div');
        progressElement.className = this.options.progressSelector.substring(1); // Quitar el punto inicial
        // Asegurarse de que no tenga contenido de texto
        progressElement.textContent = '';
        skillBar.appendChild(progressElement);
      }
      
      // Obtener o crear el elemento de valor
      if (this.options.showPercentage) {
        let valueElement = skillBar.querySelector(this.options.valueSelector);
        if (!valueElement) {
          valueElement = document.createElement('span');
          valueElement.className = this.options.valueSelector.substring(1); // Quitar el punto inicial
          valueElement.textContent = `${skillValue}%`;
          skillBar.appendChild(valueElement);
        }
      }
    });
  }
  
  setupIntersectionObserver() {
    // Configurar el observador de intersección
    const observerOptions = {
      root: null, // viewport
      rootMargin: '0px',
      threshold: this.options.threshold
    };
    
    // Crear el observador
    this.observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        // Si el contenedor es visible
        if (entry.isIntersecting && !this.animated) {
          // Animar las barras de habilidades
          this.animateSkillBars();
          
          // Marcar como animado
          this.animated = true;
          
          // Dejar de observar si la opción 'animateOnce' está habilitada
          if (this.options.animateOnce) {
            observer.unobserve(entry.target);
          }
        } else if (!entry.isIntersecting && !this.options.animateOnce) {
          // Resetear la animación si no es 'animateOnce'
          this.resetAnimation();
          this.animated = false;
        }
      });
    }, observerOptions);
    
    // Observar el contenedor
    this.observer.observe(this.container);
  }
  
  animateSkillBars() {
    // Animar cada barra de habilidades
    this.skillBars.forEach((skillBar, index) => {
      // Obtener el valor de la habilidad
      const skillValue = parseInt(skillBar.getAttribute('data-value') || '0');
      
      // Obtener el elemento de progreso
      const progressElement = skillBar.querySelector(this.options.progressSelector);
      
      if (progressElement) {
        // Asegurarse de que no tenga contenido de texto
        progressElement.textContent = '';
        
        // Añadir un retraso escalonado para una animación secuencial
        setTimeout(() => {
          // Animar la barra de progreso
          progressElement.style.width = `${skillValue}%`;
          
          // Añadir clase para animar el valor
          skillBar.classList.add('animated');
        }, index * 100);
      }
    });
    
    // Disparar evento personalizado
    const event = new CustomEvent('skillsAnimated', {
      detail: {
        container: this.container,
        skillBars: this.skillBars
      }
    });
    document.dispatchEvent(event);
  }
  
  resetAnimation() {
    // Resetear la animación de cada barra de habilidades
    this.skillBars.forEach(skillBar => {
      // Obtener el elemento de progreso
      const progressElement = skillBar.querySelector(this.options.progressSelector);
      
      if (progressElement) {
        // Resetear la barra de progreso
        progressElement.style.width = '0';
        
        // Quitar clase de animación
        skillBar.classList.remove('animated');
      }
    });
  }
  
  // Métodos públicos
  refresh() {
    // Actualizar la lista de barras de habilidades
    this.skillBars = document.querySelectorAll(this.options.skillBarSelector);
    
    // Configurar las nuevas barras
    this.setupSkillBars();
    
    // Animar si ya estaba animado
    if (this.animated) {
      this.animateSkillBars();
    }
  }
  
  forceAnimation() {
    // Forzar la animación independientemente de la visibilidad
    this.animateSkillBars();
    this.animated = true;
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Crear instancia global
  window.skillsAnimation = new SkillsAnimation();
  
  // Crear barras de habilidades si no existen pero hay datos
  const skillsSection = document.querySelector('#skills') || 
                       document.querySelector('.skills-section');
  
  if (skillsSection) {
    const skillsContainer = skillsSection.querySelector('.skills-container');
    
    // Si no hay contenedor de habilidades pero hay datos, crear uno
    if (!skillsContainer) {
      const skillsData = [
        { name: 'Network Architecture', value: 95 },
        { name: 'System Administration', value: 90 },
        { name: 'Cloud Infrastructure', value: 85 },
        { name: 'Security & Compliance', value: 88 },
        { name: 'Automation & Scripting', value: 80 },
        { name: 'DevOps Practices', value: 75 }
      ];
      
      // Crear el contenedor
      const newSkillsContainer = document.createElement('div');
      newSkillsContainer.className = 'skills-container';
      
      // Crear las barras de habilidades
      skillsData.forEach(skill => {
        const skillBar = document.createElement('div');
        skillBar.className = 'skill-bar';
        skillBar.setAttribute('data-value', skill.value.toString());
        
        const skillName = document.createElement('div');
        skillName.className = 'skill-name';
        skillName.textContent = skill.name;
        
        const skillProgress = document.createElement('div');
        skillProgress.className = 'skill-progress';
        
        const skillValue = document.createElement('span');
        skillValue.className = 'skill-value';
        skillValue.textContent = `${skill.value}%`;
        
        skillBar.appendChild(skillName);
        skillBar.appendChild(skillProgress);
        skillBar.appendChild(skillValue);
        
        newSkillsContainer.appendChild(skillBar);
      });
      
      // Añadir el contenedor a la sección
      skillsSection.appendChild(newSkillsContainer);
      
      // Reinicializar la animación
      window.skillsAnimation = new SkillsAnimation();
    }
  }
});