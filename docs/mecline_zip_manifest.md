# mecline_zip_manifest.md — Validación ZIP
**Producto:** MecLine LATAM v1.0.0 · Voryn Energy  
**ZIP:** mecline-latam_v1.0.0_voryn-ready.zip

---

## Inventario completo de archivos

| # | Archivo | Carpeta | Propósito | Crítico | Prefijo OK | Validado |
|---|---|---|---|---|---|---|
| 1 | `README.md` | `./` | Documentación principal | 🔴 Sí | ✅ (estándar) | ✅ |
| 2 | `mecline_favicon.svg` | `assets/icons/` | Favicon SVG del producto | 🟢 No | ✅ mecline_ | ✅ |
| 3 | `mecline_components.css` | `css/` | Cards, modales, pricing, chat, conjuntos | 🔴 Sí | ✅ mecline_ | ✅ |
| 4 | `mecline_main.css` | `css/` | Design tokens, shell, topbar, sidebar | 🔴 Sí | ✅ mecline_ | ✅ |
| 5 | `mecline_print.css` | `css/` | Reglas de impresión/PDF | 🔴 Sí | ✅ mecline_ | ✅ |
| 6 | `mecline_responsive.css` | `css/` | Breakpoints tablet/mobile | 🔴 Sí | ✅ mecline_ | ✅ |
| 7 | `mecline_constructive_sets.json` | `data/` | 18 conjuntos constructivos MT/BT | 🔴 Sí | ✅ mecline_ | ✅ |
| 8 | `mecline_countries.json` | `data/` | Normativa 8 países LATAM | 🔴 Sí | ✅ mecline_ | ✅ |
| 9 | `mecline_hypotheses.json` | `data/` | 4 hipótesis + constantes físicas | 🔴 Sí | ✅ mecline_ | ✅ |
| 10 | `mecline_report_templates.json` | `data/` | Plantillas memoria técnica | 🟢 No | ✅ mecline_ | ✅ |
| 11 | `mecline_standards.json` | `data/` | 16 conductores + suministros 7 tipos | 🔴 Sí | ✅ mecline_ | ✅ |
| 12 | `mecline_structures.json` | `data/` | Esquema importación Excel (columnas) | 🟢 No | ✅ mecline_ | ✅ |
| 13 | `mecline_architecture.md` | `docs/` | Arquitectura técnica detallada | 🟢 No | ✅ mecline_ | ✅ |
| 14 | `mecline_dependencies.md` | `docs/` | CDN, versiones, riesgos, migración offline | 🔴 Sí | ✅ mecline_ | ✅ |
| 15 | `mecline_project_map.md` | `docs/` | Mapa de módulos y dependencias | 🔴 Sí | ✅ mecline_ | ✅ |
| 16 | `mecline_validation_checklist.md` | `docs/` | Checklist pre-deploy | 🔴 Sí | ✅ mecline_ | ✅ |
| 17 | `index.html` | `./` | Shell HTML — punto de entrada | 🔴 Sí | ✅ (estándar) | ✅ |
| 18 | `mecline_ai_assistant.js` | `js/` | Asistente IA: Claude API, streaming | 🔴 Sí | ✅ mecline_ | ✅ |
| 19 | `mecline_app.js` | `js/` | Datos embebidos, estado global, navegación, planes | 🔴 Sí | ✅ mecline_ | ✅ |
| 20 | `mecline_calculations.js` | `js/` | Motor mecánico 4 hipótesis | 🔴 Sí | ✅ mecline_ | ✅ |
| 21 | `mecline_exports.js` | `js/` | XLSX, JSON, memoria técnica HTML/PDF | 🔴 Sí | ✅ mecline_ | ✅ |
| 22 | `mecline_modals.js` | `js/` | Helpers modales: keyboard, backdrop | 🟢 No | ✅ mecline_ | ✅ |
| 23 | `mecline_ui.js` | `js/` | Renderizado: catálogo, dashboard, wizard, normativa | 🔴 Sí | ✅ mecline_ | ✅ |
| 24 | `mecline_validations.js` | `js/` | Conjuntos: recomendador, validador, suministros | 🔴 Sí | ✅ mecline_ | ✅ |
| 25 | `manifest.json` | `./` | Metadatos del producto para Voryn | 🔴 Sí | ✅ (estándar) | ✅ |
| 26 | `mecline_button_tests.md` | `tests/` | Validación 61 botones/onclick | 🔴 Sí | ✅ mecline_ | ✅ |
| 27 | `mecline_calculation_tests.md` | `tests/` | Casos prueba motor mecánico | 🟢 No | ✅ mecline_ | ✅ |
| 28 | `mecline_export_tests.md` | `tests/` | Tests exportación XLSX/PDF | 🟢 No | ✅ mecline_ | ✅ |

---

## Validación de rutas en index.html

| Tipo | Archivo referenciado | Existe | Estado |
|---|---|---|---|
| CSS | `css/mecline_main.css` | Sí | ✅ |
| CSS | `css/mecline_components.css` | Sí | ✅ |
| CSS | `css/mecline_responsive.css` | Sí | ✅ |
| CSS | `css/mecline_print.css` | Sí | ✅ |
| JS | `js/mecline_app.js` | Sí | ✅ |
| JS | `js/mecline_calculations.js` | Sí | ✅ |
| JS | `js/mecline_validations.js` | Sí | ✅ |
| JS | `js/mecline_ui.js` | Sí | ✅ |
| JS | `js/mecline_exports.js` | Sí | ✅ |
| JS | `js/mecline_modals.js` | Sí | ✅ |
| JS | `js/mecline_ai_assistant.js` | Sí | ✅ |
| Asset | `assets/icons/mecline_favicon.svg` | Sí | ✅ |

---

## Errores encontrados

**✅ NINGUNO — proyecto listo para integración Voryn**

---

## Resumen

| Métrica | Valor |
|---|---|
| Total archivos | 28 |
| Con prefijo mecline_ | 25 |
| Estándar (index/README/manifest) | 3 |
| Archivos ambiguos | 0 |
| Rutas CSS en index.html | 4 |
| Rutas JS en index.html | 7 |
| Errores totales | 0 |
