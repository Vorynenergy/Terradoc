# mecline_dependencies.md — Dependencias externas
**Producto:** MecLine LATAM v1.0.0 · Voryn Energy

---

## Librerías CDN

| # | Librería | Versión | Uso | CDN | Crítico |
|---|---|---|---|---|---|
| 1 | Tabler Icons | 2.47.0 | Iconografía UI (600+ iconos) | jsdelivr.net | ⚠️ Visual |
| 2 | SheetJS (XLSX) | 0.18.5 | Importar/exportar .xlsx | cdnjs.cloudflare.com | ✅ Sí |
| 3 | Google Fonts | latest | Syne, JetBrains Mono, Instrument Sans | fonts.googleapis.com | ⚠️ Visual |
| 4 | Claude API | sonnet-4-20250514 | Asistente IA técnico | api.anthropic.com | ⚠️ IA |

---

## Detalle por dependencia

### 1. Tabler Icons 2.47.0
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@2.47.0/tabler-icons.min.css"/>
```
- **Offline:** `npm install @tabler/icons-webfont@2.47.0` → copiar `/dist/` a `assets/icons/tabler/`
- **Si falla:** UI sin iconos — funcionalidad intacta — degradación visual únicamente

### 2. SheetJS 0.18.5 ⚠️ CRÍTICO
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
```
- **Offline:** Descargar `xlsx.full.min.js` → `js/lib/xlsx.full.min.js`
- **Si falla:** ❌ Importación Excel y exportación XLSX no funcionan

### 3. Google Fonts
```html
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&..."/>
```
- **Offline:** Usar [google-webfonts-helper](https://gwfh.mranftl.com/) → `assets/fonts/`
- **Si falla:** Fuentes del sistema — degradación visual únicamente

### 4. Claude API ⚠️ SEGURIDAD CRÍTICA
```
POST https://api.anthropic.com/v1/messages
Header: x-api-key: <NUNCA EN FRONTEND>
Modelo: claude-sonnet-4-20250514
```
- **NUNCA** incluir la API key en código JavaScript frontend
- **Arquitectura recomendada:** Frontend → Proxy backend → Claude API
- **Si falla:** Chat IA no disponible — motor de cálculo intacto

---

## Riesgos de producción

| Riesgo | Severidad | Solución |
|---|---|---|
| API key Claude expuesta en JS | 🔴 CRÍTICO | Proxy backend obligatorio en producción |
| SheetJS CDN caído | 🟡 ALTO | Descargar localmente para producción |
| Google Fonts bloqueado (redes corp.) | 🟢 BAJO | Font-family fallback en CSS |
| Tabler Icons CDN caído | 🟢 BAJO | Descargar localmente para producción |
| CORS al cargar /data/*.json | 🟡 MEDIO | Servir desde mismo origen |

---

## Migración offline (intranet corporativa)

```bash
# Paso 1: Tabler Icons
npm install @tabler/icons-webfont@2.47.0
cp -r node_modules/@tabler/icons-webfont/dist assets/icons/tabler
# En index.html: href="assets/icons/tabler/tabler-icons.min.css"

# Paso 2: SheetJS
curl -o js/lib/xlsx.full.min.js \
  https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
# En index.html: src="js/lib/xlsx.full.min.js"

# Paso 3: Fuentes
# Descargar desde gwfh.mranftl.com → assets/fonts/
# Crear css/mecline_fonts.css con @font-face
# Reemplazar link Google Fonts en index.html

# Paso 4: Proxy IA
# Montar endpoint POST /api/mecline/ia/chat en backend Voryn
# En mecline_ai_assistant.js: cambiar URL fetch a /api/mecline/ia/chat
```
