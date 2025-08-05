# Contexto del Proyecto para IA

Este documento proporciona un resumen detallado del proyecto para facilitar la comprensión y futuras modificaciones por parte de una inteligencia artificial o un nuevo desarrollador.

## Resumen del Proyecto

- **Objetivo**: Presentar un portafolio profesional interactivo para un experto en redes y sistemas.
- **Tecnologías Principales**: HTML5, CSS3, JavaScript (ES6+).
- **Frameworks/Librerías**: Ninguno. Todo el código es vainilla.
- **Entorno de Ejecución**: Navegador web moderno. No requiere compilación ni empaquetado (ej. Webpack, Vite).
- **Despliegue**: Optimizado para GitHub Pages, pero puede ser servido desde cualquier servidor web estático.

## Estructura del Proyecto

```
/
├── index.html              # Archivo principal HTML con todo el contenido y estructura.
├── css/
│   └── styles.css          # Hoja de estilos principal. Contiene todos los estilos, incluyendo variables para temas, animaciones y diseño responsivo.
├── js/
│   ├── main.js             # Script principal que inicializa otros módulos.
│   ├── network-animation.js # Controla la animación de red de fondo en la sección de inicio.
│   ├── particles.js        # Genera un efecto de partículas en el fondo.
│   ├── glitch-text.js      # Aplica un efecto de "glitch" a ciertos textos.
│   ├── typing-effect.js    # Simula un efecto de máquina de escribir.
│   ├── scroll-animations.js # Activa animaciones cuando los elementos entran en el viewport.
│   ├── theme-switcher.js   # Lógica para cambiar entre tema oscuro y claro.
│   ├── projects-filter.js  # Funcionalidad para filtrar los proyectos por categoría.
│   ├── skills-animation.js # Anima las barras de progreso de las habilidades.
│   ├── contact-form.js     # Validación básica para el formulario de contacto.
│   └── config-loader.js    # Carga la configuración desde config.yml y actualiza el DOM.
├── img/
│   ├── profile.svg         # Imagen de perfil (formato vectorial).
│   └── projects/           # Imágenes de los proyectos (formato vectorial).
├── firebase.json           # Configuración específica para el despliegue en Firebase.
├── .firebaserc             # Configuración del proyecto de Firebase.
├── package.json            # Define metadatos y dependencias (solo para desarrollo, ej. `serve`).
├── config.yml              # Archivo de configuración para datos de usuario (ej. URLs de LinkedIn, foto de perfil).
└── README.md               # Este archivo.
```