# TerraDoc SPT — terradoc_project_map.md
## Voryn Energy — Mapa del proyecto para integración

**Versión:** 1.0.0  
**Módulo:** `terradoc` (aislado de MecLine, DimElec, Voryn Landing)  
**Prefijo de archivos:** `terradoc_`  
**Namespace JS:** `ST` (TerraDoc state), `TERRADOC_*` (exports globales)

---

## Mapa de archivos

```
terradoc-spt/
├── index.html                          ← Punto de entrada único
│
├── css/
│   ├── terradoc_main.css               ← Variables CSS, layout base, topbar, sidebar
│   ├── terradoc_components.css         ← Tables, gauges, SVG viewer, modals, forms
│   ├── terradoc_responsive.css         ← Mobile (≤768px), tablet (≤1024px), print
│   └── terradoc_print.css              ← Estilos @media print dedicados
│
├── js/
│   ├── terradoc_measurements.js        ← Wenner, Schlumberger, una varilla, estadísticas
│   ├── terradoc_soil_model.js          ← Suelo homogéneo/dos capas, LATAM engine, Ig
│   ├── terradoc_ieee80_calculations.js ← Ep/Ec tolerables, GPR, Rg Schwarz, térmico
│   ├── terradoc_safety_validation.js   ← Seguridad eléctrica, gauges SVG, recomendaciones
│   ├── terradoc_spt_alternatives.js    ← Evaluador 25 configs, ranker, filtros, selectConfig
│   ├── terradoc_svg_renderer.js        ← SVG catalog, zoom, malla paramétrica IEEE 80 App.B
│   ├── terradoc_materials.js           ← Estimación automática de cantidades
│   ├── terradoc_checker.js             ← Consistency checker 10 reglas, export gate
│   ├── terradoc_reports.js             ← Preview informe, export DOCX/PDF/JSON, JSON builder
│   ├── terradoc_ui.js                  ← Navegación, stepper, header sync, runAll
│   ├── terradoc_modals.js              ← Modales: país, configuración, confirmación
│   └── terradoc_app.js                 ← Estado global ST, carga de datos, init, demos
│
├── data/
│   ├── terradoc_countries.json         ← 17 perfiles normativos LATAM (K70, K50, rgLimits...)
│   ├── terradoc_spt_configurations.json← 25 configs SPT (id, type, Rf, mat_m, complexity)
│   ├── terradoc_svg_catalog.json       ← 25 diagramas SVG técnicos vectoriales
│   ├── terradoc_standards.json         ← Referencias IEEE 80, IEEE 81, normas LATAM
│   ├── terradoc_soil_classification.json← Tipos A-E, métodos de tratamiento
│   ├── terradoc_materials_catalog.json ← Catálogo técnico de 13 materiales
│   └── terradoc_report_templates.json  ← Tipos de informe, endpoints backend Voryn
│
├── assets/
│   ├── logos/                          ← Logotipo TerraDoc + Voryn (pendiente)
│   ├── icons/                          ← Favicon, PWA icons (pendiente)
│   ├── images/                         ← Imágenes estáticas (pendiente)
│   ├── screenshots/                    ← Capturas del producto (pendiente)
│   └── svg/                            ← SVG individuales exportables (pendiente)
│
├── docs/
│   ├── terradoc_project_map.md         ← Este archivo
│   ├── terradoc_architecture.md        ← Arquitectura técnica del sistema
│   ├── terradoc_dependencies.md        ← Dependencias externas y CDNs
│   └── terradoc_validation_checklist.md← Checklist pre-deploy
│
├── tests/
│   ├── terradoc_button_tests.md        ← 118 tests de botones y UI
│   ├── terradoc_calculation_tests.md   ← Tests numéricos IEEE 80/81
│   ├── terradoc_svg_tests.md           ← Tests catálogo SVG y rendering
│   └── terradoc_export_tests.md        ← Tests exportación y docgen
│
├── manifest.json                       ← PWA manifest + metadata producto
└── README.md                           ← Documentación técnica del producto
```

---

## Namespace y aislamiento (Voryn integration)

### Variables globales de TerraDoc (no colisionan)
```javascript
// Estado principal — prefijado TerraDoc
const ST = { /* TerraDoc-only state */ };

// Datos cargados — uppercase para distinguir
let LATAM_ENGINE = {};    // Normative profiles
let SVGS = {};            // SVG catalog
let CONFIGS = [];         // SPT configurations

// Exports a Voryn platform (opcionales)
window.TERRADOC_STANDARDS = {};         // IEEE/LATAM references
window.TERRADOC_SOIL_CLASSES = {};      // Soil types A-E
window.TERRADOC_MATERIALS_CATALOG = {}; // Materials data
```

### Punto de integración con Voryn Energy
```javascript
// Para integrar TerraDoc dentro de Voryn:
// 1. Cargar todos los terradoc_*.js en el bundle de Voryn
// 2. Inicializar con: window.TerraDocSPT = { init: loadData, state: ST }
// 3. Los datos normativos son independientes del router de Voryn
// 4. No hay conflicto con MecLine o DimElec (prefijos distintos)
```

---

## Flujo de datos interno

```
Inputs HTML (index.html)
       ↓
terradoc_measurements.js   → ST.rho, ST.measurements[]
terradoc_soil_model.js     → ST.country, ST.If, ST.Sf, ST.Df, ST.Ig
       ↓
terradoc_ieee80_calculations.js → ST.Ep70, ST.Ec70, ST.Rg, ST.GPR
       ↓
terradoc_safety_validation.js  → validación 6 parámetros
terradoc_spt_alternatives.js   → ST.allResults[], ST.recommended, ST.selectedId
       ↓
terradoc_materials.js          → tabla de cantidades
terradoc_checker.js            → 10 reglas CHK-001→010, getCriticalIssues()
       ↓
terradoc_reports.js            → preview + export JSON/DOCX/PDF
```

---

## Estado de funcionalidades

| Funcionalidad | Estado | Notas |
|--------------|--------|-------|
| Medición Wenner | ✅ Implementada | IEEE 81 §7.3.1 |
| Medición Schlumberger | ✅ Implementada | IEEE 81 §7.3.2 |
| Medición una varilla | ✅ Implementada | IEEE 81 §7.4 |
| Suelo homogéneo | ✅ Implementado | |
| Suelo dos capas (Sunde) | ✅ Implementado | Aproximación, no FEM |
| Cálculos IEEE 80 §8 | ✅ Implementados | Ep, Ec, 70kg y 50kg |
| Cálculos IEEE 80 §11.3 | ✅ Implementados | Validación térmica conductor |
| Cálculos IEEE 80 §15 | ✅ Implementados | Ig = If·Sf·Df |
| GPR | ✅ Implementado | GPR = Ig·Rg |
| Rg (Schwarz simplificado) | ✅ Implementado | App. B, no FEM completo |
| Seguridad eléctrica (6 parámetros) | ✅ Implementada | |
| 25 alternativas SPT | ✅ Implementadas | 10 VARILLA + 11 ANILLO + 4 TRIADA |
| 25 SVG vectoriales | ✅ Implementados | Vista superior, cotas, leyenda |
| Malla especial paramétrica | ✅ Implementada | IEEE 80 App. B Eq. 57 |
| Estimación de materiales | ✅ Implementada | 13 ítems, condicionales |
| Motor normativo LATAM ×17 | ✅ Implementado | CO validado; resto referencial |
| Consistency Checker 10 reglas | ✅ Implementado | CHK-001 a CHK-010 |
| Preview informe | ✅ Implementado | |
| Export JSON (client-side) | ✅ Implementado | Descarga automática |
| Export DOCX (backend) | 🔄 Pendiente backend | NestJS + docxtemplater |
| Export PDF (backend) | 🔄 Pendiente backend | Puppeteer |
| Evidencias fotográficas | ✅ UI implementada | Backend para persistencia pendiente |
| Multi-SPT | ⭐ Premium | Planificado Voryn Pro |
| FEM/EPR avanzado | ⭐ Fuera de alcance v1 | CDEGS, SafeGrid |
| Autenticación | 🔄 Pendiente Voryn auth | Integrar con Voryn auth layer |

---

## Integración con Voryn Energy Platform

### Ruta de integración sugerida
```
/voryn-energy/
  /landing/           ← Voryn Landing (no compartir estilos)
  /terradoc/          ← TerraDoc SPT (este módulo)
    index.html
    css/terradoc_*.css
    js/terradoc_*.js
    data/terradoc_*.json
  /mecline/           ← MecLine LATAM (futuro)
  /dimelec/           ← DimElec LATAM (futuro)
```

### API backend (cuando se implemente)
```
POST /api/terradoc/reports/docx    ← Genera DOCX
POST /api/terradoc/reports/pdf     ← Genera PDF
GET  /api/terradoc/projects        ← Lista proyectos del usuario
POST /api/terradoc/projects        ← Crea proyecto
PUT  /api/terradoc/projects/:id    ← Actualiza proyecto
GET  /api/terradoc/configs         ← Lista de 25 configs (mirror de JSON)
```

---

*TerraDoc SPT v1.0.0 — Voryn Energy — terradoc_project_map.md*
