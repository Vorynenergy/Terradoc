# TerraDoc SPT — Arquitectura Técnica

## Visión general

TerraDoc SPT es una **SPA (Single Page Application)** frontend-only construida con HTML5 + CSS3 + vanilla JavaScript puro. No requiere frameworks JS (React, Vue, Angular) ni bundlers (Webpack, Vite) para funcionar.

El motor de cálculo (IEEE 80/81) es 100% client-side y funciona offline. Solo la exportación DOCX/PDF requiere backend.

---

## Flujo de datos

```
Usuario ingresa datos
       ↓
Formularios HTML (index.html)
       ↓
Estado global: ST object (app.js)
       ↓
┌─────────────────────────────────────────┐
│         Pipeline de cálculo             │
│                                         │
│  measurements.js → soil-model.js        │
│       ↓                                 │
│  ieee80-calculations.js                 │
│       ↓                                 │
│  safety-validation.js                   │
│       ↓                                 │
│  spt-alternatives.js                    │
│       ↓                                 │
│  materials.js                           │
└─────────────────────────────────────────┘
       ↓
checker.js (valida coherencia)
       ↓
reports.js (genera preview + export)
```

---

## Estado global (ST object)

El objeto `ST` en `app.js` es la única fuente de verdad del estado de la aplicación:

```javascript
const ST = {
  // Suelo
  country: 'CO',          // Código de país LATAM
  rho: 0,                 // ρ promedio (Ω·m)
  measurements: [],       // Array de valores Wenner

  // Red eléctrica
  If: 0,   // Corriente de falla (kA)
  Sf: 1.0, // Factor de división
  Df: 1.0, // Factor de decremento
  Ig: 0,   // Corriente diseño (A) = If·Sf·Df·1000
  tf: 0,   // Tiempo de despeje (s)
  rhos: 3000, // Resistividad superficie (Ω·m)

  // Resultados IEEE 80
  Ep70: 0, Ec70: 0,  // Tensiones tolerables 70 kg (V)
  Ep50: 0, Ec50: 0,  // Tensiones tolerables 50 kg (V)
  Rg: 0,             // Resistencia de tierra (Ω)
  GPR: 0,            // Ground Potential Rise (V)

  // SPT
  selectedId: null,  // ID de la config seleccionada
  allResults: [],    // Array de todas las evaluaciones
  recommended: null, // Config recomendada

  // Flags
  calcsDone: false,  // ¿Se ejecutaron los cálculos?
  svgZoom: 1         // Zoom actual del SVG
};
```

---

## Datos cargados (JSON)

Los archivos en `data/` se cargan via `fetch()` al iniciar la aplicación:

| Archivo | Contenido | Tamaño aprox. |
|---------|-----------|---------------|
| `countries.json` | 17 perfiles normativos LATAM | ~5 KB |
| `spt-configurations.json` | 25 configuraciones (Rf, mat_m, complejidad) | ~3 KB |
| `svg-catalog.json` | 25 diagramas SVG vectoriales | ~34 KB |
| `standards.json` | Referencias IEEE/IEC/LATAM | ~3 KB |
| `soil-classification.json` | Tipos A-E y tratamientos | ~2 KB |
| `materials-catalog.json` | Catálogo de materiales técnicos | ~4 KB |

**Total datos: ~51 KB** — se pueden embeber directamente en app.js para eliminar requests HTTP.

---

## Módulos JS — responsabilidades

### `app.js` — Núcleo de la aplicación
- Define `ST` (estado global)
- Carga datos JSON via `fetch()`
- Inicializa la aplicación en `DOMContentLoaded`
- Expone `loadDemo()`, `clearAllFields()`, `alertPremium()`

### `measurements.js` — Motor de medición
- `initWenner()` — inicializa tabla con 5 separaciones por defecto
- `recalcWenner()` — `ρ = 2π·a·R` (IEEE 81 §7.3.1)
- `recalcSchlum()` — `ρ = π·(AB/2)²·R/(MN/2)` (IEEE 81 §7.3.2)
- `calcVarilla1()` — `ρ = 4π·L·R/(ln(8L/d)−1)` (IEEE 81 §7.4)
- `updateMeasurementStats()` — promedio, min, max, CV%, sync rho-eq
- `soilDesc()`, `soilBadge()` — clasificación tipo A–E

### `soil-model.js` — Modelo de suelo y LATAM
- `setCountry(code)` — carga perfil normativo, actualiza UI
- `toggleSoilModel()` — switch entre homogéneo y dos capas
- `calcRhoDC()` — aproximación Sunde para dos capas
- `updateId()` — calcula `Ig = If·Sf·Df`

### `ieee80-calculations.js` — Motor IEEE 80
- `runCalcs()` — orquesta todos los cálculos
- Fórmulas §8.3: Ep70, Ec70, Ep50, Ec50
- Fórmula §15: `Ig = If·Sf·Df`
- Fórmula §11.3: `A_min = Ig·√tf / K_material`
- Constantes `CONDUCTOR_K`: Cu=226, CuSW=200, Al=148, SS=70

### `safety-validation.js` — Seguridad eléctrica
- `runSafety()` — evalúa 6 parámetros de seguridad
- `setGauge()` — actualiza arcos SVG animados
- `renderSafetyRecommendations()` — recomendaciones automáticas
- Heurísticas: Etouch ≈ 0.25·GPR, Estep ≈ 0.15·GPR (simplificadas)

### `spt-alternatives.js` — Evaluador de alternativas
- `evalAlternatives()` — evalúa las 25 configs con `Rg = Rf·ρ`
- `renderAltTable()` — tabla HTML con clases rec-row/fail-row
- `filterAlts()` — filtra por VARILLA/ANILLO/TRIADA
- `selectConfig()` — muestra SVG + info de la config

### `svg-renderer.js` — Rendering gráfico
- `zoomSvg()` — zoom 0.3x–3x sobre el SVG
- `renderMallaSvg()` — genera SVG paramétrico con cuadrícula
- Fórmula: `Rg_malla = ρ·(1/(4√(A/π)) + 1/(L+W)·...)` IEEE 80 App. B

### `materials.js` — Estimación de materiales
- `calcMaterials()` — calcula cantidades según la config seleccionada
- Bentonita condicional si `Rf > 0.4`
- Coke Breeze condicional si `ρ > 500 Ω·m`

### `checker.js` — Validación de consistencia
- `getCriticalIssues()` — retorna array de issues bloqueantes
- `runChecker()` — ejecuta 10 reglas CHK-001 a CHK-010
- Actualiza badge numérico en sidebar nav
- Sincroniza advertencia en sección docgen

### `reports.js` — Generación documental
- `genDoc()` — actualiza preview de informe
- `exportDoc()` — aplica checker gate antes de exportar
- `buildTechnicalJSON()` — genera JSON trazable completo
- Descarga automática de .json vía Blob URL

### `ui.js` — Interfaz de usuario
- `showSection()` — muestra/oculta secciones
- `markStep()` — actualiza stepper visual
- `syncHeader()` — sincroniza barra superior con datos del proyecto
- `openCountrySelector()` — abre modal de país
- `runAll()` — pipeline completo con progress overlay
- `handleImages()` — carga imágenes de evidencias

---

## Escalabilidad

### Agregar nuevo país
1. Añadir entrada en `data/countries.json` con todos los campos
2. Añadir opción `<option>` en selector HTML de `index.html`

### Agregar nueva configuración SPT
1. Añadir objeto en `data/spt-configurations.json` con `{id, type, desc, rods, L, Rf, mat_m, complexity}`
2. Añadir SVG correspondiente en `data/svg-catalog.json`

### Agregar nuevo método de medición
1. Implementar función en `measurements.js`
2. Añadir tab HTML en `index.html`
3. Conectar vía `switchMeasTab()` en `ui.js`

---

## Decisiones de diseño

| Decisión | Razón |
|----------|-------|
| Vanilla JS sin frameworks | Cero dependencias, máxima compatibilidad, deploy simple |
| JSON separados | Datos actualizables sin tocar código, preparados para API |
| Fetch con fallback | Funciona con server HTTP y con datos embebidos |
| Checker bloqueante | Integridad documental — no emitir documentos con inconsistencias |
| Heurísticas Etouch/Estep | Diseño preliminar — usuario debe usar CDEGS para diseño final |
| K factores IEEE 80 | Constantes de la norma, no configurables por el usuario |
