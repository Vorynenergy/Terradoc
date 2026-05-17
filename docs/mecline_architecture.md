# mecline_architecture.md — Arquitectura técnica
**Producto:** MecLine LATAM v1.0.0 · Voryn Energy  
**Prefijo:** `mecline_` — NO mezclar con DimElec, TerraDoc ni Landing Voryn

---

## Tipo de aplicación
SPA (Single Page Application) — JavaScript puro, sin framework, sin bundler.  
Desplegable como HTML estático en cualquier servidor HTTP.

## Principios

1. **Motor primero:** Todo cálculo numérico en `mecline_calculations.js`. La IA solo interpreta.
2. **Resultados siempre preliminares:** Nunca se afirma cumplimiento definitivo.
3. **Sin build:** Un servidor HTTP estático es suficiente (`python3 -m http.server`).
4. **Prefijo único:** Todo archivo usa `mecline_` para coexistir con otros productos Voryn.
5. **Planes frontend:** El sistema de plan es demostración. Producción requiere backend + auth.

## Orden de carga JS (crítico)

```
1. mecline_app.js        → NORMATIVA, CONDUCTORES, CONJUNTOS, estado global, nav
2. mecline_calculations.js → motorCalculo, calcular, calcularHipotesis
3. mecline_validations.js  → recomendarConjunto, validarConjunto
4. mecline_ui.js           → renderResultados, renderDashboard, renderWizPaso
5. mecline_exports.js      → exportarXLSX, genMemHTML
6. mecline_modals.js       → keyboard close, backdrop close
7. mecline_ai_assistant.js → sendMsg (base) — parchado por pricing en mecline_app.js
```

## Monkey-patching del sistema de planes

`mecline_app.js` (sección pricing) parchea `sendMsg` y `setMode` post-carga:

```js
const _sendMsgOrig = sendMsg;
sendMsg = async function(aid, iid, esP) {
  if (!puedeEnviarIA()) { /* muestra lock UI */ return; }
  registrarMensajeIA();
  return _sendMsgOrig.call(this, aid, iid, esP);
};
```
**Riesgo:** El orden de scripts en index.html es crítico. `mecline_ai_assistant.js` debe cargarse **antes** de que el patch se ejecute en `mecline_app.js` — pero actualmente el patch está al final del `DOMContentLoaded` init.

## Estado global en mecline_app.js

```js
let NORMATIVA, CONDUCTORES, CONJUNTOS    // Datos técnicos embebidos
let currentMode = 'unit'                 // Modo activo
let ultimoResultado = null               // Último cálculo
let proyData = []                        // Estructuras del proyecto
let brandData = {}                       // Branding empresa
let conjSeleccionado = null              // Conjunto en modal

let PLAN = 'free'                        // Plan activo
let AI_MSGS_USED = 0                     // Contador IA diario
```

## Integración futura en Voryn

Para integrar en la arquitectura principal de Voryn Energy:

```
voryn-platform/
├── mecline-latam/           ← Este proyecto (mecline_ prefix)
├── dimelec-latam/           ← Otro producto (dimelec_ prefix)
├── terradoc-spt/            ← Otro producto (terradoc_ prefix)
└── landing/                 ← Landing principal Voryn
```

**Puntos de integración:**
- Navbar Voryn: añadir enlace a `/mecline-latam/`
- Auth Voryn: reemplazar `sessionStorage` de plan por JWT del backend
- API Gateway: proxy `/api/mecline/ia/chat` → Claude API
- Analytics: añadir eventos de conversión al modal pricing

## Seguridad

| Aspecto | Estado | Acción requerida |
|---|---|---|
| API key Claude en frontend | ⚠️ Demo | Proxy backend en producción |
| XSS en innerHTML | ⚠️ Presente | Sanitizar inputs en producción |
| Plan en sessionStorage | Informativo | Auth real con backend |
