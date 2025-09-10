# Datathon Site

Web estática para el Datathon (sponsors Gold/Silver/Bronze), lista para desplegar en **GitHub Pages**.

## Cómo desplegar
1. Crea un repositorio nuevo y sube todos los archivos tal cual (carpeta raíz).
2. Entra en *Settings → Pages* y selecciona *Source: Deploy from Branch*, branch `main`, carpeta `/ (root)`.
3. Guarda. A los pocos minutos tendrás la web publicada.

### Editar contenido
- Fecha del evento: `app.js` → `EVENT_DATE`.
- Enlace al formulario de registro: `app.js` → `FORM_URL`.
- Avisos del banner: `data/notices.json`.
- Sponsors: `data/sponsors.json` (logos en `img/sponsors/`).

### Nota sobre caché
El *service worker* está en modo **network-only** para evitar problemas de actualización en Pages.
