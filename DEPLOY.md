# Despliegue en GitHub Pages

## Configuración Local

### Opción 1: Servidor Python (Recomendado)
```bash
python -m http.server 8000
```
Luego visita: http://localhost:8000

### Opción 2: Servidor Node.js
```bash
npm install
npm start
```

## Despliegue en GitHub Pages

### Pasos para configurar GitHub Pages:

1. **Subir el código a GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Configurar GitHub Pages:**
   - Ve a tu repositorio en GitHub
   - Navega a Settings > Pages
   - En "Source", selecciona "GitHub Actions"
   - El workflow ya está configurado en `.github/workflows/deploy.yml`

3. **Activar GitHub Pages:**
   - El despliegue se ejecutará automáticamente con cada push a la rama `main`
   - Tu sitio estará disponible en: `https://tu-usuario.github.io/nombre-repositorio`

### Archivos importantes para el despliegue:

- `.github/workflows/deploy.yml` - Workflow de GitHub Actions
- `config.yml` - Configuración del sitio
- `index.html` - Página principal
- Todos los archivos estáticos (CSS, JS, imágenes)

### Notas:

- El sitio es completamente estático, no requiere servidor backend
- GitHub Pages sirve archivos estáticos directamente
- Los cambios se despliegan automáticamente al hacer push
- El dominio personalizado se puede configurar en Settings > Pages