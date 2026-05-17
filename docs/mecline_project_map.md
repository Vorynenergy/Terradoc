# mecline_project_map.md — MecLine LATAM
**Plataforma:** Voryn Energy  
**Producto:** MecLine LATAM v1.0.0  
**Prefijo de archivos:** `mecline_`  
**NO mezclar con:** DimElec LATAM · TerraDoc SPT · Landing principal Voryn

---

## Mapa de módulos

```
mecline-latam/
├── index.html                          Shell HTML — sin JS ni CSS inline
│
├── css/
│   ├── mecline_main.css                Design tokens, shell, topbar, sidebar (17KB)
│   ├── mecline_components.css          Cards, modales, pricing, chat, wizard (13KB)
│   ├── mecline_responsive.css          Breakpoints tablet/mobile (2KB)
│   └── mecline_print.css              Reglas de impresión PDF (1KB)
│
├── js/                                 ORDEN DE CARGA CRÍTICO (ver index.html)
│   ├── mecline_app.js          [1]     Datos, estado global, navegación, init
│   ├── mecline_calculations.js [2]     Motor mecánico 4 hipótesis, EDS, cargas
│   ├── mecline_validations.js  [3]     Conjuntos, recomendador, validador
│   ├── mecline_ui.js           [4]     Render: catálogo, dashboard, wizard, normativa
│   ├── mecline_exports.js      [5]     XLSX, JSON, memoria técnica HTML/PDF
│   ├── mecline_modals.js       [6]     Helpers modales: keyboard, backdrop
│   └── mecline_ai_assistant.js [7]     Claude API, streaming, contexto técnico
│
├── data/
│   ├── mecline_countries.json          8 países: norma, límites, viento, temps
│   ├── mecline_constructive_sets.json  18 conjuntos constructivos MT/BT
│   ├── mecline_standards.json         16 conductores + suministros 7 tipos
│   ├── mecline_hypotheses.json        4 hipótesis + constantes físicas
│   ├── mecline_structures.json        Esquema importación Excel (columnas)
│   └── mecline_report_templates.json  Plantillas memoria técnica
│
├── docs/
│   ├── mecline_project_map.md         (este archivo)
│   ├── mecline_architecture.md        Arquitectura técnica detallada
│   ├── mecline_dependencies.md        CDN, versiones, riesgos
│   └── mecline_validation_checklist.md Checklist pre-deploy
│
├── tests/
│   ├── mecline_button_tests.md        Validación de 71 onclick
│   ├── mecline_calculation_tests.md   Casos de prueba del motor
│   └── mecline_export_tests.md        Tests de exportación XLSX/PDF
│
├── assets/
│   ├── icons/mecline_favicon.svg
│   ├── logos/                         (pendiente: logo SVG empresa)
│   ├── images/                        (pendiente: imágenes UI)
│   └── screenshots/                   (pendiente: capturas para docs)
│
├── manifest.json                       Metadatos producto
└── README.md                           Documentación principal
```

---

## Matriz de dependencias entre módulos JS

| Módulo | Depende de | Expone |
|---|---|---|
| mecline_app.js | XLSX (CDN) | NORMATIVA, CONDUCTORES, CONJUNTOS, PLAN, proyData, showPanel, setMode, leerExcel |
| mecline_calculations.js | mecline_app.js (G, FS_APOYO, NORMATIVA) | motorCalculo, determinarEstado, nivelConfianza, calcular, calcularHipotesis |
| mecline_validations.js | mecline_app.js (CONJUNTOS, SUMINISTROS_TIPO) | recomendarConjunto, validarConjunto, renderSuministros |
| mecline_ui.js | mecline_app.js, mecline_calculations.js | renderResultados, renderDashboard, renderWizPaso, filtrarCat, renderNorm |
| mecline_exports.js | mecline_app.js (proyData, brandData), XLSX | exportarXLSX, exportarDatos, genMemHTML |
| mecline_modals.js | DOM (DOMContentLoaded) | Keyboard/backdrop handlers |
| mecline_ai_assistant.js | mecline_app.js | hk, addMsg, updMsg, sendMsg (base) |
| pricing.js (en mecline_app.js) | mecline_ai_assistant.js (parchea sendMsg) | PLAN, iniciarSesion, activarPlan, puedeEnviarIA |

---

## Flujo de datos

```
Usuario
  ↓ selecciona país / condiciones / conductor / geometría
mecline_app.js → sincPais() → actualiza campos con NORMATIVA[pais]
  ↓ clic Calcular
mecline_calculations.js → motorCalculo() → calc = {T_eds, flecha, pct_uts, ...}
  → determinarEstado(calc, lim) → 'cumple' | 'revisar' | 'critico'
  ↓ resultado
mecline_ui.js → renderResultados(calc, estado, conf, params, norm, lim)
  ↓ Sugerir conjunto
mecline_validations.js → recomendarConjunto() → tabla de criterios
  ↓ Exportar
mecline_exports.js → exportarXLSX() | genMemHTML()
  ↓ Consultar IA
mecline_ai_assistant.js → sendMsg() → Claude API → respuesta contextual
```

---

## Estados globales críticos

```js
// mecline_app.js
let currentMode    // 'unit' | 'wizard' | 'proj' | 'conj'
let ultimoResultado // último cálculo unitario
let proyData       // array estructuras proyecto
let brandData      // datos empresa (branding)
let conjSeleccionado // conjunto en modal

// pricing (en mecline_app.js)
let PLAN           // 'free' | 'pro' | 'enterprise'
let AI_MSGS_USED   // contador diario
```
