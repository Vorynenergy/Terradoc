# TerraDoc SPT — Dependencias

## Dependencias frontend (browser)

| Nombre | Tipo | CDN / URL | Uso | Versión | Crítica | Offline |
|--------|------|-----------|-----|---------|---------|---------|
| DM Mono | Font | fonts.googleapis.com | Tipografía monoespaciada (valores técnicos) | Variable | ❌ No | Fallback: `monospace` |
| DM Sans | Font | fonts.googleapis.com | Tipografía sans-serif (UI general) | Variable | ❌ No | Fallback: `system-ui, sans-serif` |
| Sora | Font | fonts.googleapis.com | Tipografía display (títulos de sección) | Variable | ❌ No | Fallback: `sans-serif` |

**TerraDoc SPT no usa ninguna librería JavaScript externa.**  
Todo el motor de cálculo (IEEE 80, resistividad, seguridad eléctrica) es vanilla JS puro sin dependencias.

---

## Dependencias de producción (backend — no incluido en v3)

Para habilitar exportación DOCX y PDF, se requiere backend separado:

| Paquete npm | Versión rec. | Uso | Riesgo |
|-------------|-------------|-----|--------|
| `docxtemplater` | `^3.40` | Generación DOCX desde plantilla Word | Bajo |
| `pizzip` | `^3.1` | Requerido por docxtemplater para ZIP | Bajo |
| `docxtemplater-image-module-free` | `^3.x` | Insertar SVG/imágenes en DOCX | Medio |
| `puppeteer` | `^21.x` | Conversión HTML → PDF | Alto (Chromium ~130 MB) |
| `@nestjs/core` | `^10.x` | Framework API REST | Bajo |
| `express` | `^4.x` | Alternativa ligera a NestJS | Bajo |
| `multer` | `^1.4` | Upload de evidencias fotográficas | Bajo |
| `sharp` | `^0.33` | Resize/compresión de imágenes | Medio |

### Alternativas a Puppeteer para PDF

| Opción | Pros | Contras |
|--------|------|---------|
| `@react-pdf/renderer` | Sin Chromium | Solo React |
| `pdfmake` | Puro Node | Sin CSS complejo |
| `wkhtmltopdf` | Rápido | Requiere binario sistema |
| Puppeteer | Fidelidad perfecta | ~130 MB adicional |

---

## Recomendaciones de producción

### Fuentes (Google Fonts)
Para eliminar la dependencia de red en producción:

```bash
# Descargar fuentes localmente con google-webfonts-helper
npx google-fonts-helper download \
  --family "DM Mono:400,500" \
  --family "DM Sans:300,400,500,600" \
  --family "Sora:600,700" \
  --output ./assets/fonts
```

Luego reemplazar en `index.html`:
```html
<!-- Antes: -->
<link href="https://fonts.googleapis.com/css2?..." rel="stylesheet">

<!-- Después: -->
<link rel="stylesheet" href="assets/fonts/fonts.css">
```

### JSON data files
Los archivos en `data/` se cargan vía `fetch()`. En producción:
- Configurar headers CORS si frontend y backend están en dominios distintos
- Opcionalmente embeber datos directamente en `app.js` para eliminar requests HTTP

### HTTPS
Requerido para:
- PWA (service worker)
- Algunas APIs del navegador
- Confianza profesional del usuario

---

## Riesgos identificados

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| Google Fonts caída | Baja | Bajo (fallback) | Fonts locales |
| fetch() bloqueado (CORS) | Media si file:// | Alto | Usar servidor HTTP |
| Puppeteer versión | Media | Medio | Fijar versión en package.json |
| docxtemplater licensing | Baja | Bajo | Versión open-source disponible |
| Cambios API IEEE | Muy baja | Medio | Fórmulas embebidas en código |
