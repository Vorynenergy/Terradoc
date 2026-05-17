# TerraDoc SPT — terradoc_export_tests.md
## Voryn Energy — Export, docgen and consistency checker tests

---

## TEST SET 1 — Consistency Checker gate

| # | Escenario | Resultado esperado | Estado |
|---|-----------|-------------------|--------|
| E01 | Sin datos (campos vacíos) | 7+ issues en CHK, badge = "7+" | `[ ]` |
| E02 | Con ρ pero sin If/tf | CHK-002 FAIL, badge actualizado | `[ ]` |
| E03 | Sin config seleccionada | CHK-005 FAIL, exportación bloqueada | `[ ]` |
| E04 | Rg > límite normativo | CHK-007 FAIL, alerta en rojo | `[ ]` |
| E05 | Sin profesional en f-prof | CHK-010 FAIL | `[ ]` |
| E06 | País no validado (Bolivia) | CHK-008 FAIL, badge "~ En revisión" | `[ ]` |
| E07 | Todo completo y correcto | 0 issues, badge = "✓" | `[ ]` |

---

## TEST SET 2 — Exportación JSON (client-side, sin backend)

| # | Acción | Resultado esperado | Estado |
|---|--------|--------------------|--------|
| E08 | Click "Exportar JSON" con issues | Descarga sin bloqueo (JSON siempre disponible) | `[ ]` |
| E09 | Archivo descargado es .json | Extensión correcta | `[ ]` |
| E10 | JSON contiene _meta.tool = "TerraDoc SPT" | `[ ]` | |
| E11 | JSON contiene _meta.standard_primary | "IEEE 80-2013" | `[ ]` |
| E12 | JSON contiene pais.codigo | Código del país seleccionado | `[ ]` |
| E13 | JSON contiene pais.normativas | Array de normas | `[ ]` |
| E14 | JSON contiene resistividad.rho_avg_ohm_m | Valor numérico de ST.rho | `[ ]` |
| E15 | JSON contiene calculos_ieee80.Ep70_V | Valor de Ep70 | `[ ]` |
| E16 | JSON contiene calculos_ieee80.Rg_ohm | Valor de Rg con 4 decimales | `[ ]` |
| E17 | JSON contiene configuracion_spt.id | ST.selectedId | `[ ]` |
| E18 | JSON contiene consistency_checker.aprobado | Boolean | `[ ]` |
| E19 | JSON contiene consistency_checker.issues_criticos | Array | `[ ]` |
| E20 | JSON es JSON válido | JSON.parse() no arroja error | `[ ]` |

---

## TEST SET 3 — Exportación DOCX/PDF (requiere backend)

| # | Acción | Resultado esperado | Estado | Notas |
|---|--------|--------------------|--------|-------|
| E21 | Click "Exportar DOCX" con issues críticos | Alert bloqueante con lista de issues | `[ ]` | |
| E22 | Alert incluye todos los issues críticos | Lista completa visible | `[ ]` | |
| E23 | Click "Exportar DOCX" sin issues | Progress overlay animado | `[ ]` | |
| E24 | Progress overlay completa 7 pasos | Desaparece al finalizar | `[ ]` | |
| E25 | Mensaje final menciona backend NestJS | Informativo, no un error | `[ ]` | |
| E26 | Click "Exportar PDF" con issues | Bloqueado igual que DOCX | `[ ]` | |
| E27 | Click "Exportar PDF" sin issues | Progress overlay | `[ ]` | |

---

## TEST SET 4 — Report preview

| # | Verificación | Estado |
|---|-------------|--------|
| E28 | Preview se genera al entrar a sección Reporte | `[ ]` |
| E29 | rep-norm-line muestra país + normas | `[ ]` |
| E30 | rep-nombre muestra nombre del proyecto | `[ ]` |
| E31 | Parámetros: If, Sf, Df, tf visibles | `[ ]` |
| E32 | Parámetros: Ep70, Ec70, Rg visibles | `[ ]` |
| E33 | SVG de config seleccionada embebido | `[ ]` |
| E34 | Validación Rg: verde si cumple | `[ ]` |
| E35 | Validación Rg: rojo si no cumple | `[ ]` |
| E36 | Disclaimer normativo LATAM visible | `[ ]` |
| E37 | Nombre del profesional en footer | `[ ]` |
| E38 | Fecha y revisión en footer | `[ ]` |

---

## TEST SET 5 — Navegación docgen

| # | Verificación | Estado |
|---|-------------|--------|
| E39 | Selector tipo "Informe completo" | Muestra card seleccionada con borde | `[ ]` |
| E40 | Selector tipo "Resistividad" | Cambia selección visual | `[ ]` |
| E41 | Selector tipo "JSON técnico" | Cambia selección visual | `[ ]` |
| E42 | ck-warn-docgen refleja checker | Verde/rojo según estado del checker | `[ ]` |

---

*TerraDoc SPT v1.0.0 — Voryn Energy — terradoc_export_tests.md*
