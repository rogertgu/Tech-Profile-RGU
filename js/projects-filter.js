/**
 * projects-filter.js
 * Script para implementar un sistema de filtrado de proyectos por categoría
 * con animaciones suaves y efectos visuales
 */

class ProjectsFilter {
  constructor(options = {}) {
    // Opciones con valores predeterminados
    this.options = {
      containerSelector: options.containerSelector || '.projects-container',
      itemSelector: options.itemSelector || '.project-item',
      filterSelector: options.filterSelector || '.projects-filter',
      activeClass: options.activeClass || 'active',
      hiddenClass: options.hiddenClass || 'hidden',
      animationDuration: options.animationDuration || 400,
      defaultFilter: options.defaultFilter || 'all',
      useHash: options.useHash || false
    };
    
    // Estado
    this.currentFilter = this.options.defaultFilter;
    
    // Elementos DOM
    this.container = document.querySelector(this.options.containerSelector);
    this.items = document.querySelectorAll(this.options.itemSelector);
    this.filterButtons = document.querySelectorAll(`${this.options.filterSelector} button, ${this.options.filterSelector} .filter-btn`);
    
    // Inicializar si los elementos existen
    if (this.container && this.items.length > 0) {
      this.init();
    }
  }
  
  init() {
    // Añadir estilos CSS para las animaciones si no existen
    this.addFilterStyles();
    
    // Configurar los botones de filtro
    this.setupFilterButtons();
    
    // Manejar el hash en la URL si está habilitado
    if (this.options.useHash) {
      this.handleHash();
      
      // Escuchar cambios en el hash
      window.addEventListener('hashchange', () => this.handleHash());
    } else {
      // Aplicar el filtro predeterminado
      this.filterProjects(this.options.defaultFilter);
    }
    
    // Añadir clases de animación a los proyectos
    this.setupProjectAnimations();
  }
  
  addFilterStyles() {
    // Verificar si ya existen los estilos
    if (document.getElementById('projects-filter-styles')) {
      return;
    }
    
    // Crear elemento de estilo
    const style = document.createElement('style');
    style.id = 'projects-filter-styles';
    
    // Definir estilos para las animaciones
    style.innerHTML = `
      /* Estilos para los elementos de proyecto */
      ${this.options.itemSelector} {
        transition: opacity ${this.options.animationDuration}ms ease, 
                    transform ${this.options.animationDuration}ms ease;
      }
      
      /* Clase para ocultar proyectos */
      ${this.options.itemSelector}.${this.options.hiddenClass} {
        opacity: 0;
        transform: scale(0.8);
        pointer-events: none;
        position: absolute;
      }
      
      /* Contenedor de proyectos */
      ${this.options.containerSelector} {
        position: relative;
        min-height: 200px;
      }
      
      /* Botones de filtro */
      ${this.options.filterSelector} button,
      ${this.options.filterSelector} .filter-btn {
        transition: all 0.3s ease;
      }
      
      ${this.options.filterSelector} button.${this.options.activeClass},
      ${this.options.filterSelector} .filter-btn.${this.options.activeClass} {
        font-weight: bold;
      }
    `;
    
    // Añadir estilos al documento
    document.head.appendChild(style);
  }
  
  setupFilterButtons() {
    // Añadir eventos de clic a los botones de filtro
    this.filterButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Obtener el valor del filtro
        const filter = button.getAttribute('data-filter');
        
        // Aplicar el filtro
        this.filterProjects(filter);
        
        // Actualizar el hash si está habilitado
        if (this.options.useHash && filter) {
          window.location.hash = filter;
        }
      });
    });
  }
  
  handleHash() {
    // Obtener el filtro del hash
    const hash = window.location.hash.substring(1);
    
    if (hash) {
      // Comprobar si existe un botón con este filtro
      const filterExists = Array.from(this.filterButtons).some(
        button => button.getAttribute('data-filter') === hash
      );
      
      // Aplicar el filtro si existe
      if (filterExists) {
        this.filterProjects(hash);
      } else {
        // Si no existe, usar el filtro predeterminado
        this.filterProjects(this.options.defaultFilter);
      }
    } else {
      // Si no hay hash, usar el filtro predeterminado
      this.filterProjects(this.options.defaultFilter);
    }
  }
  
  filterProjects(filter) {
    // Si el filtro es el mismo que el actual, no hacer nada
    if (filter === this.currentFilter) {
      return;
    }
    
    // Actualizar el filtro actual
    this.currentFilter = filter;
    
    // Actualizar clases de los botones
    this.filterButtons.forEach(button => {
      const buttonFilter = button.getAttribute('data-filter');
      
      if (buttonFilter === filter) {
        button.classList.add(this.options.activeClass);
      } else {
        button.classList.remove(this.options.activeClass);
      }
    });
    
    // Filtrar los proyectos
    this.items.forEach(item => {
      // Obtener las categorías del proyecto
      const categories = item.getAttribute('data-categories');
      
      // Comprobar si el proyecto debe mostrarse
      const shouldShow = filter === 'all' || 
                         (categories && categories.split(',').map(c => c.trim()).includes(filter));
      
      // Aplicar clases según el resultado
      if (shouldShow) {
        item.classList.remove(this.options.hiddenClass);
      } else {
        item.classList.add(this.options.hiddenClass);
      }
    });
    
    // Reorganizar el contenedor después de la animación
    setTimeout(() => {
      this.layoutProjects();
    }, this.options.animationDuration);
    
    // Disparar evento personalizado
    const event = new CustomEvent('projectsFiltered', {
      detail: {
        filter: filter,
        visibleItems: Array.from(this.items).filter(
          item => !item.classList.contains(this.options.hiddenClass)
        )
      }
    });
    document.dispatchEvent(event);
  }
  
  layoutProjects() {
    // Reorganizar los proyectos visibles
    // Esta función puede adaptarse según el diseño específico
    
    // Ejemplo simple para un diseño de cuadrícula
    let visibleIndex = 0;
    
    this.items.forEach(item => {
      if (!item.classList.contains(this.options.hiddenClass)) {
        // Restablecer la posición para elementos visibles
        item.style.position = '';
        item.style.left = '';
        item.style.top = '';
        
        // Incrementar el índice visible
        visibleIndex++;
      }
    });
    
    // Si se está utilizando una biblioteca como Isotope o Masonry,
    // aquí se llamaría a su método de layout
  }
  
  setupProjectAnimations() {
    // Añadir animaciones de entrada a los proyectos
    this.items.forEach((item, index) => {
      // Añadir un retraso escalonado para una entrada secuencial
      item.style.transitionDelay = `${index * 50}ms`;
      
      // Si se está utilizando scroll-animations.js, podemos integrarlo
      if (window.scrollAnimations) {
        window.scrollAnimations.animate(item, 'fade-in-up', index * 100);
      }
    });
  }
  
  // Métodos públicos
  refresh() {
    // Actualizar la lista de elementos
    this.items = document.querySelectorAll(this.options.itemSelector);
    
    // Volver a aplicar el filtro actual
    this.filterProjects(this.currentFilter);
  }
  
  addItem(item) {
    // Añadir un nuevo elemento al contenedor
    if (this.container && item) {
      this.container.appendChild(item);
      this.refresh();
    }
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Crear instancia global
  window.projectsFilter = new ProjectsFilter();
  
  // Si no existen botones de filtro, crearlos automáticamente
  const filterContainer = document.querySelector('.projects-filter');
  const projectItems = document.querySelectorAll('.project-item');
  
  if (projectItems.length > 0 && !filterContainer) {
    // Recopilar todas las categorías únicas
    const categories = new Set();
    categories.add('all'); // Añadir la categoría 'all'
    
    projectItems.forEach(item => {
      const itemCategories = item.getAttribute('data-categories');
      if (itemCategories) {
        itemCategories.split(',').forEach(category => {
          categories.add(category.trim());
        });
      }
    });
    
    // Crear el contenedor de filtros si hay más de una categoría
    if (categories.size > 1) {
      const projectsSection = document.querySelector('#projects') || 
                             document.querySelector('.projects-section');
      
      if (projectsSection) {
        // Crear el contenedor de filtros
        const newFilterContainer = document.createElement('div');
        newFilterContainer.className = 'projects-filter';
        
        // Crear los botones de filtro
        categories.forEach(category => {
          const button = document.createElement('button');
          button.className = 'filter-btn';
          button.setAttribute('data-filter', category);
          button.textContent = category.charAt(0).toUpperCase() + category.slice(1);
          
          if (category === 'all') {
            button.classList.add('active');
          }
          
          newFilterContainer.appendChild(button);
        });
        
        // Insertar el contenedor antes de los proyectos
        const projectsContainer = projectsSection.querySelector('.projects-container');
        if (projectsContainer) {
          projectsSection.insertBefore(newFilterContainer, projectsContainer);
        } else {
          projectsSection.appendChild(newFilterContainer);
        }
        
        // Reinicializar el filtro
        window.projectsFilter = new ProjectsFilter();
      }
    }
  }
});