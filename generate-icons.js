/**
 * generate-icons.js
 * Script para generar los iconos de la PWA en diferentes tamaños a partir del SVG base
 * 
 * Para ejecutar este script, necesitas tener instalado Node.js y las siguientes dependencias:
 * npm install sharp svgexport
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuración
const SVG_SOURCE = path.join(__dirname, 'img/icons/icon.svg');
const OUTPUT_DIR = path.join(__dirname, 'img/icons');
const ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

// Asegurarse de que el directorio de salida existe
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`Directorio creado: ${OUTPUT_DIR}`);
}

// Función para generar los iconos
async function generateIcons() {
  console.log('Generando iconos para PWA...');
  
  try {
    // Verificar que el archivo SVG fuente existe
    if (!fs.existsSync(SVG_SOURCE)) {
      console.error(`Error: El archivo SVG fuente no existe en ${SVG_SOURCE}`);
      return;
    }
    
    // Generar cada tamaño de icono
    for (const size of ICON_SIZES) {
      const outputFile = path.join(OUTPUT_DIR, `icon-${size}x${size}.png`);
      
      // Comando para convertir SVG a PNG usando svgexport
      const command = `npx svgexport "${SVG_SOURCE}" "${outputFile}" ${size}:${size}`;
      
      console.log(`Generando icono de ${size}x${size} píxeles...`);
      execSync(command);
      console.log(`✓ Icono generado: ${outputFile}`);
    }
    
    console.log('\n¡Todos los iconos han sido generados con éxito!');
    console.log('\nPara usar estos iconos, asegúrate de que las rutas en manifest.json son correctas.');
  } catch (error) {
    console.error('Error al generar los iconos:', error.message);
    console.log('\nPara ejecutar este script, necesitas instalar las dependencias:');
    console.log('npm install sharp svgexport');
  }
}

// Ejecutar la función principal
generateIcons();