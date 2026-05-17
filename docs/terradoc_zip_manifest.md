# TerraDoc SPT — terradoc_zip_manifest.md
## Voryn Energy — Manifiesto del paquete v1.0.0

**Paquete:** `terradoc-spt_v1.0.0_voryn-ready.zip`  
**Versión:** 1.0.0  
**Fecha:** 2025-05  
**Total archivos:** 33  
**Archivos críticos:** 19  
**Naming OK (prefijo terradoc_):** 33/33  
**Tamaño total:** 253 KB (0.25 MB)  

---

## Inventario completo

| Archivo | Carpeta | Propósito | Crítico | Validado |
|---------|---------|-----------|---------|---------|
| `index.html` | `root` | Punto de entrada | ✅ SÍ | `[ ]` |
| `manifest.json` | `root` | PWA manifest + metadatos Voryn | — | `[ ]` |
| `terradoc_components.css` | `css` | Tables, gauges, modales, SVG viewer | ✅ SÍ | `[ ]` |
| `terradoc_main.css` | `css` | Layout, variables, topbar, sidebar | ✅ SÍ | `[ ]` |
| `terradoc_print.css` | `css` | Estilos impresión | — | `[ ]` |
| `terradoc_responsive.css` | `css` | Mobile/tablet media queries | ✅ SÍ | `[ ]` |
| `terradoc_countries.json` | `data` | 17 perfiles normativos LATAM | ✅ SÍ | `[ ]` |
| `terradoc_materials_catalog.json` | `data` | Catálogo materiales técnicos | — | `[ ]` |
| `terradoc_report_templates.json` | `data` | Tipos informe, endpoints Voryn | — | `[ ]` |
| `terradoc_soil_classification.json` | `data` | Tipos A–E, tratamientos | — | `[ ]` |
| `terradoc_spt_configurations.json` | `data` | 25 configs SPT (Rf, mat_m, cx) | ✅ SÍ | `[ ]` |
| `terradoc_standards.json` | `data` | Referencias IEEE/IEC/LATAM | — | `[ ]` |
| `terradoc_svg_catalog.json` | `data` | 25 SVG vectoriales técnicos | ✅ SÍ | `[ ]` |
| `terradoc_architecture.md` | `docs` | Arquitectura técnica | — | `[ ]` |
| `terradoc_dependencies.md` | `docs` | Dependencias externas y CDNs | — | `[ ]` |
| `terradoc_project_map.md` | `docs` | Mapa proyecto, namespace, integración Voryn | — | `[ ]` |
| `terradoc_validation_checklist.md` | `docs` | Checklist pre-deploy | — | `[ ]` |
| `terradoc_app.js` | `js` | Estado ST, carga JSON, init, demos | ✅ SÍ | `[ ]` |
| `terradoc_checker.js` | `js` | CHK-001→010, export gate | ✅ SÍ | `[ ]` |
| `terradoc_ieee80_calculations.js` | `js` | Ep/Ec, térmico, GPR, Rg (IEEE 80) | ✅ SÍ | `[ ]` |
| `terradoc_materials.js` | `js` | Estimación 13 ítems materiales | ✅ SÍ | `[ ]` |
| `terradoc_measurements.js` | `js` | Wenner, Schlumberger, Varilla (IEEE 81) | ✅ SÍ | `[ ]` |
| `terradoc_modals.js` | `js` | Modal país, config, confirmación | ✅ SÍ | `[ ]` |
| `terradoc_reports.js` | `js` | Preview, DOCX/PDF/JSON, JSON builder | ✅ SÍ | `[ ]` |
| `terradoc_safety_validation.js` | `js` | Seguridad 6 parámetros, gauges SVG | ✅ SÍ | `[ ]` |
| `terradoc_soil_model.js` | `js` | Suelo hom./dos capas, LATAM engine, Ig | ✅ SÍ | `[ ]` |
| `terradoc_spt_alternatives.js` | `js` | Evaluador 25 configs, filtros, SVG | ✅ SÍ | `[ ]` |
| `terradoc_svg_renderer.js` | `js` | SVG zoom, malla paramétrica | ✅ SÍ | `[ ]` |
| `terradoc_ui.js` | `js` | Navegación, stepper, header, runAll | ✅ SÍ | `[ ]` |
| `terradoc_button_tests.md` | `tests` | 118 tests botones y UI | — | `[ ]` |
| `terradoc_calculation_tests.md` | `tests` | Tests numéricos IEEE 80/81 | — | `[ ]` |
| `terradoc_export_tests.md` | `tests` | Tests exportación y docgen | — | `[ ]` |
| `terradoc_svg_tests.md` | `tests` | 45 tests SVG y rendering | — | `[ ]` |

---

## Validaciones de paquete

| Check | Resultado |
|-------|-----------|
| ✅ No existen archivos ambiguos (main.css, app.js, etc.) | 33/33 con prefijo correcto |
| ✅ No existen archivos de otros productos Voryn | 0 archivos MecLine/DimElec |
| ✅ Todas las rutas CSS referenciadas en index.html | 4 CSS: terradoc_main, components, responsive, print |
| ✅ Todos los JS referenciados en index.html | 12 JS modules + terradoc_app.js |
| ✅ Todos los JSON en /data/ con prefijo terradoc_ | 7 archivos JSON |
| ✅ Documentación incluida | 4 docs en /docs/ |
| ✅ Suite de tests incluida | 4 archivos en /tests/ |
| ✅ manifest.json presente | PWA + metadatos Voryn |
| ✅ README.md presente | Documentación técnica completa |
| ✅ Namespace aislado (ST, TERRADOC_*) | No colisiona con MecLine/DimElec |
| ⬜ index.html carga sin errores | Verificar con servidor HTTP |
| ⬜ Console JS limpia (0 errores rojos) | F12 → 0 errores |
| ⬜ Console 0 errores 404 | Todas las rutas resuelven |
| ⬜ SVG catalog carga (terradoc_svg_catalog.json) | 25 SVGs disponibles |
| ⬜ Cálculos IEEE 80 producen valores correctos | Ver terradoc_calculation_tests.md |
| ⬜ Export JSON descarga archivo .json | Sin backend requerido |
| ⬜ Checker bloquea DOCX/PDF con issues | Gate funcionando |
| ⬜ Mobile responsive a 375px | Sidebar oculto, grids 1 col |

---

## Cómo desplegar

```bash
# 1. Descomprimir
unzip terradoc-spt_v1.0.0_voryn-ready.zip
cd terradoc-spt/

# 2. Servidor HTTP local (requerido para fetch() de JSON)
python3 -m http.server 8080
# → http://localhost:8080

# O con Node.js:
npx serve .
# → http://localhost:3000

# 3. Deploy a producción (estático)
# Netlify: drag & drop de la carpeta
# Vercel: vercel deploy
# S3: aws s3 sync . s3://bucket-voryn/terradoc/
# nginx: copiar carpeta a /var/www/voryn/terradoc/
```

---

## Archivos NO incluidos (pendientes)

| Asset | Razón | Prioridad |
|-------|-------|-----------|
| `assets/logos/terradoc_logo.svg` | Diseño gráfico pendiente | Alta |
| `assets/icons/icon-192.png` | Ícono PWA pendiente | Media |
| `assets/icons/icon-512.png` | Ícono PWA pendiente | Media |
| Backend NestJS | No es parte del frontend | Alta para DOCX/PDF |
| `js/terradoc_offline.js` | Service Worker PWA | Baja |

---

*TerraDoc SPT v1.0.0 — Voryn Energy Platform — terradoc_zip_manifest.md*
