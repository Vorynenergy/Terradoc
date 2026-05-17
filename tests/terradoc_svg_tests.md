# TerraDoc SPT — terradoc_svg_tests.md
## Voryn Energy — SVG catalog and rendering tests

---

## TEST SET 1 — Catálogo SVG (25 configuraciones)

| # | ID Config | Tipo | Descripción | Carga | Visible | Zoom | Estado |
|---|-----------|------|-------------|-------|---------|------|--------|
| S01 | VARILLA_01 | VARILLA | 1 varilla vertical | `[ ]` | `[ ]` | `[ ]` | |
| S02 | VARILLA_02 | VARILLA | 1 varilla + cp 3m | `[ ]` | `[ ]` | `[ ]` | |
| S03 | VARILLA_03 | VARILLA | 1 varilla + cp 6m | `[ ]` | `[ ]` | `[ ]` | |
| S04 | VARILLA_04 | VARILLA | 1 varilla + cp 9m | `[ ]` | `[ ]` | `[ ]` | |
| S05 | VARILLA_05 | VARILLA | 2 varillas L=3m | `[ ]` | `[ ]` | `[ ]` | |
| S06 | VARILLA_06 | VARILLA | 2 varillas L=6m | `[ ]` | `[ ]` | `[ ]` | |
| S07 | VARILLA_07 | VARILLA | 2 varillas L=9m | `[ ]` | `[ ]` | `[ ]` | |
| S08 | VARILLA_08 | VARILLA | 3 varillas L=3m | `[ ]` | `[ ]` | `[ ]` | |
| S09 | VARILLA_09 | VARILLA | 3 varillas L=6m | `[ ]` | `[ ]` | `[ ]` | |
| S10 | VARILLA_10 | VARILLA | 3 varillas L=9m | `[ ]` | `[ ]` | `[ ]` | |
| S11 | ANILLO_01 | ANILLO | Doble anillo sin cp | `[ ]` | `[ ]` | `[ ]` | |
| S12 | ANILLO_02 | ANILLO | Doble anillo + 1 varilla | `[ ]` | `[ ]` | `[ ]` | |
| S13 | ANILLO_03 | ANILLO | Doble anillo + 2 varillas | `[ ]` | `[ ]` | `[ ]` | |
| S14 | ANILLO_04 | ANILLO | Doble anillo + cp 5m ×1 | `[ ]` | `[ ]` | `[ ]` | |
| S15 | ANILLO_05 | ANILLO | Doble anillo + cp 5m ×2 | `[ ]` | `[ ]` | `[ ]` | |
| S16 | ANILLO_06 | ANILLO | Doble anillo + cp 5m ×3 | `[ ]` | `[ ]` | `[ ]` | |
| S17 | ANILLO_07 | ANILLO | Doble anillo + cp 6m ×4 | `[ ]` | `[ ]` | `[ ]` | |
| S18 | ANILLO_08 | ANILLO | Doble anillo + cp 10m ×1 | `[ ]` | `[ ]` | `[ ]` | |
| S19 | ANILLO_09 | ANILLO | Doble anillo + cp 10m ×2 | `[ ]` | `[ ]` | `[ ]` | |
| S20 | ANILLO_10 | ANILLO | Doble anillo + cp 10m ×3 | `[ ]` | `[ ]` | `[ ]` | |
| S21 | ANILLO_11 | ANILLO | Doble anillo + cp 10m ×4 | `[ ]` | `[ ]` | `[ ]` | |
| S22 | TRIADA_01 | TRIADA | Tríada básica L=5m | `[ ]` | `[ ]` | `[ ]` | |
| S23 | TRIADA_02 | TRIADA | Tríada + cp 5m ×1 | `[ ]` | `[ ]` | `[ ]` | |
| S24 | TRIADA_03 | TRIADA | Tríada + cp 5m ×2 | `[ ]` | `[ ]` | `[ ]` | |
| S25 | TRIADA_04 | TRIADA | Tríada + cp 5m ×3 | `[ ]` | `[ ]` | `[ ]` | |

---

## TEST SET 2 — SVG viewer controls

| # | Acción | Resultado esperado | Estado |
|---|--------|--------------------|--------|
| S26 | Botón "Ver SVG" en fila tabla | SVG aparece en panel derecho | `[ ]` |
| S27 | Zoom − (-0.2) | SVG se reduce (zoom < 1) | `[ ]` |
| S28 | Zoom + (+0.2) | SVG se amplía (zoom > 1) | `[ ]` |
| S29 | Zoom ↺ (reset) | SVG vuelve a escala 1:1 | `[ ]` |
| S30 | Zoom máx. (3x) | No supera 3× | `[ ]` |
| S31 | Zoom mín. (0.3x) | No baja de 0.3× | `[ ]` |
| S32 | SVG aparece en preview informe | rep-config-svg-box tiene SVG | `[ ]` |

---

## TEST SET 3 — Malla paramétrica (svg-renderer)

| # | Parámetros | Resultado esperado | Estado |
|---|-----------|-------------------|--------|
| S33 | W=10, L=8, sp=2, h=0.5, rods=4 | SVG cuadrícula 5×4 + 4 electrodos | `[ ]` |
| S34 | W=5, L=5, sp=1, h=0.5, rods=8 | SVG cuadrícula densa + 8 electrodos | `[ ]` |
| S35 | W=20, L=15, sp=5, h=0.8, rods=0 | SVG cuadrícula grande sin electrodos | `[ ]` |
| S36 | Rg malla se muestra | Valor numérico en Ω en campo m-rg | `[ ]` |
| S37 | Rg malla actualiza al cambiar params | Cambio en W/L/sp/h/rods recalcula Rg | `[ ]` |
| S38 | SVG escala proporcional | No desborda el contenedor | `[ ]` |

---

## TEST SET 4 — Integridad del catálogo JSON

| # | Verificación | Estado |
|---|-------------|--------|
| S39 | data/terradoc_svg_catalog.json carga OK | `[ ]` |
| S40 | 25 claves en el catálogo JSON | `[ ]` |
| S41 | Claves VARILLA_01…VARILLA_10 presentes | `[ ]` |
| S42 | Claves ANILLO_01…ANILLO_11 presentes | `[ ]` |
| S43 | Claves TRIADA_01…TRIADA_04 presentes | `[ ]` |
| S44 | Cada SVG empieza con `<svg` | `[ ]` |
| S45 | Cada SVG tiene viewBox | `[ ]` |
| S46 | Color accent #1b5e40 en líneas | `[ ]` |

---

*TerraDoc SPT v1.0.0 — Voryn Energy — terradoc_svg_tests.md*
