/**
 * particles.js
 * Script para crear un efecto de partículas interactivas en el fondo
 * que simula conexiones de red y datos
 */

class ParticleNetwork {
  constructor(canvas) {
    // Verificar si el canvas es válido
    if (!canvas) {
      console.error('Canvas no encontrado');
      return;
    }
    
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    
    if (!this.ctx) {
      console.error('No se pudo obtener el contexto 2D del canvas');
      return;
    }
    
    this.particleCount = 100;
    this.particles = [];
    this.maxDistance = 120;
    this.sizeMultiplier = 1;
    this.speed = 0.5;
    
    // Colores para las partículas y conexiones
    this.colors = {
      particles: {
        light: 'rgba(189, 195, 199, 0.7)',
        dark: 'rgba(52, 152, 219, 0.7)'
      },
      connections: {
        light: 'rgba(189, 195, 199, 0.15)',
        dark: 'rgba(52, 152, 219, 0.15)'
      }
    };
    
    // Estado actual del tema
    this.isDarkTheme = document.body.classList.contains('dark-theme');
    
    // Interacción con el mouse
    this.mouse = {
      x: null,
      y: null,
      radius: 150
    };
    
    // Escuchar cambios en el tema
    document.addEventListener('themeChanged', (e) => {
      this.isDarkTheme = e.detail.isDark;
    });
    
    // Ajustar el canvas al redimensionar la ventana
    window.addEventListener('resize', () => this.resize());
    
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
    
    window.addEventListener('mouseout', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
    
    // Inicializar y comenzar la animación
    this.init();
    this.animate();
  }
  
  init() {
    // Configurar el tamaño del canvas
    this.resize();
    
    // Crear partículas
    this.createParticles();
  }
  
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
    // Ajustar la cantidad de partículas según el tamaño de la pantalla
    this.particleCount = Math.floor((this.canvas.width * this.canvas.height) / 8000);
    if (this.particleCount < 50) this.particleCount = 50;
    if (this.particleCount > 150) this.particleCount = 150;
    
    // Recrear partículas cuando se redimensiona
    this.createParticles();
  }
  
  createParticles() {
    this.particles = [];
    
    for (let i = 0; i < this.particleCount; i++) {
      const size = Math.random() * 2 + 1;
      const x = Math.random() * (this.canvas.width - size * 2);
      const y = Math.random() * (this.canvas.height - size * 2);
      const directionX = (Math.random() * 2) - 1;
      const directionY = (Math.random() * 2) - 1;
      
      this.particles.push({
        x,
        y,
        size,
        directionX,
        directionY
      });
    }
  }
  
  animate() {
    requestAnimationFrame(this.animate.bind(this));
    
    // Verificar si el canvas existe y tiene un contexto válido
    if (!this.canvas || !this.ctx) return;
    
    // Verificar si hay partículas para animar
    if (!this.particles || this.particles.length === 0) return;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i];
      
      // Verificar si la partícula es válida
      if (!particle || typeof particle.x === 'undefined' || typeof particle.y === 'undefined') continue;
      
      // Dibujar partícula
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = this.isDarkTheme ? this.colors.particles.dark : this.colors.particles.light;
      this.ctx.fill();
      
      // Actualizar posición
      particle.x += particle.directionX * this.speed;
      particle.y += particle.directionY * this.speed;
      
      // Rebotar en los bordes
      if (particle.x < 0 || particle.x > this.canvas.width) {
        particle.directionX = -particle.directionX;
      }
      
      if (particle.y < 0 || particle.y > this.canvas.height) {
        particle.directionY = -particle.directionY;
      }
      
      // Interacción con el mouse
      if (this.mouse && this.mouse.x !== null && this.mouse.y !== null) {
        const dx = particle.x - this.mouse.x;
        const dy = particle.y - this.mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.mouse.radius) {
          const angle = Math.atan2(dy, dx);
          const force = (this.mouse.radius - distance) / this.mouse.radius;
          
          particle.x += Math.cos(angle) * force * 2;
          particle.y += Math.sin(angle) * force * 2;
        }
      }
      
      // Conectar partículas cercanas
      for (let j = i + 1; j < this.particles.length; j++) {
        const particle2 = this.particles[j];
        
        // Verificar si la segunda partícula es válida
        if (!particle2 || typeof particle2.x === 'undefined' || typeof particle2.y === 'undefined') continue;
        
        const dx = particle.x - particle2.x;
        const dy = particle.y - particle2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.maxDistance) {
          // Opacidad basada en la distancia
          const opacity = 1 - (distance / this.maxDistance);
          
          this.ctx.beginPath();
          this.ctx.moveTo(particle.x, particle.y);
          this.ctx.lineTo(particle2.x, particle2.y);
          this.ctx.strokeStyle = this.isDarkTheme 
            ? `rgba(52, 152, 219, ${opacity * 0.15})` 
            : `rgba(189, 195, 199, ${opacity * 0.15})`;
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      }
    }
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    new ParticleNetwork(canvas);
  } else {
    // Crear el canvas si no existe
    const newCanvas = document.createElement('canvas');
    newCanvas.id = 'particles-canvas';
    newCanvas.style.position = 'fixed';
    newCanvas.style.top = '0';
    newCanvas.style.left = '0';
    newCanvas.style.width = '100%';
    newCanvas.style.height = '100%';
    newCanvas.style.zIndex = '-1';
    newCanvas.style.pointerEvents = 'none';
    document.body.appendChild(newCanvas);
    
    new ParticleNetwork(newCanvas);
  }
});