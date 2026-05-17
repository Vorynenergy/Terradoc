# MecLine LATAM — Voryn Energy
**Versión:** 1.0.0 · **Plataforma:** Voryn Energy · **Prefijo de archivos:** `mecline_`

> Herramienta profesional de diseño electromecánico preliminar de redes aéreas de distribución para LATAM.  
> Parte de la suite Voryn Energy. NO mezclar con DimElec LATAM, TerraDoc SPT ni Landing Voryn.

---

## Inicio rápido

```bash
cd mecline-latam
python3 -m http.server 8080
# → http://localhost:8080
```

---

## Funcionalidades

- **Motor mecánico v6:** 4 hipótesis de carga (A-B-C-D), aproximación parabólica, verificación %UTS
- **8 países LATAM:** Colombia, México, Perú, Chile, Ecuador, Argentina, Bolivia, Panamá
- **16 conductores:** ACSR, AAAC, ACAR, AAC, Cu, Multiplex BT
- **18 conjuntos constructivos:** MT/BT, recomendador automático, validador
- **Modos:** Unitario · Wizard 7 pasos · Proyecto multi-estructura · Catálogo conjuntos
- **Exportaciones:** XLSX resultados · JSON proyecto · Memoria técnica HTML/PDF
- **Asistente IA:** Claude API, interpreta resultados, redacta conclusiones
- **Planes:** Free / Pro ($49/mes) / Enterprise

---

## Estructura de archivos

```
mecline-latam/
├── index.html
├── css/  mecline_main.css · mecline_components.css · mecline_responsive.css · mecline_print.css
├── js/   mecline_app.js · mecline_calculations.js · mecline_validations.js · mecline_ui.js
│         mecline_exports.js · mecline_modals.js · mecline_ai_assistant.js
├── data/ mecline_countries.json · mecline_constructive_sets.json · mecline_standards.json
│         mecline_hypotheses.json · mecline_structures.json · mecline_report_templates.json
├── docs/ mecline_project_map.md · mecline_architecture.md · mecline_dependencies.md · mecline_validation_checklist.md
├── tests/ mecline_button_tests.md · mecline_calculation_tests.md · mecline_export_tests.md
├── assets/ icons/mecline_favicon.svg · logos/ · images/ · screenshots/
├── manifest.json
└── README.md
```

---

## Integración en Voryn

```
voryn-platform/
├── mecline-latam/     ← Este proyecto
├── dimelec-latam/
├── terradoc-spt/
└── landing/
```

Para producción:
1. Montar proxy `/api/mecline/ia/chat` → Claude API (no exponer API key)
2. Reemplazar `sessionStorage` de plan por auth JWT del backend Voryn
3. Servir desde subdominio: `mecline.voryn.energy` o ruta `/mecline/`

---

## Dependencias externas

| Librería | CDN | Crítico |
|---|---|---|
| Tabler Icons 2.47.0 | jsdelivr.net | No (visual) |
| SheetJS 0.18.5 | cdnjs.cloudflare.com | Sí (Excel) |
| Google Fonts | fonts.googleapis.com | No (visual) |
| Claude API | api.anthropic.com | No (IA) |

Ver `docs/mecline_dependencies.md` para detalle y migración offline.

---

## Limitaciones

1. Motor parabólico — sin ecuación completa de cambio de estado
2. Hipótesis B y D por aproximación paramétrica
3. Sistema de planes es demo frontend (no es auth real)
4. Proyecto máx. 200 estructuras en plan Pro

---

*Todos los resultados son preliminares. La aceptación final es responsabilidad del profesional de ingeniería responsable.*
