# TerraDoc SPT — terradoc_button_tests.md
## Voryn Energy — TerraDoc module button validation

**Instrucciones:** Abrir `index.html` con servidor HTTP. Ejecutar cada test. Marcar `[x]` = PASS, `[!]` = FAIL/PENDIENTE.

---

## BLOQUE 1 — Topbar y navegación global

| # | Botón / Elemento | Acción esperada | Estado | Notas |
|---|----------------|-----------------|--------|-------|
| B01 | Bandera/país en topbar | Abre modal selector de país | `[ ]` | |
| B02 | Selector de país → Colombia 🇨🇴 | Carga RETIE, NTC 2050, IEEE 80/81; Rg: sub=10Ω, apo=25Ω | `[ ]` | |
| B03 | Selector de país → Chile 🇨🇱 | Carga SEC/RIC, badge "✓ Validado" | `[ ]` | |
| B04 | Selector de país → Brasil 🇧🇷 | Carga ABNT, badge "~ En revisión" visible | `[ ]` | |
| B05 | Selector de país → Otro/Personalizado 🌐 | Carga IEEE 80/81 genérico | `[ ]` | |
| B06 | "Calcular todo" (topbar) | Ejecuta pipeline completo con progress overlay | `[ ]` | |
| B07 | Progress overlay | Muestra pasos + barra progreso + desaparece al finalizar | `[ ]` | |
| B08 | Cerrar modal país (X) | Cierra modal | `[ ]` | |
| B09 | Cerrar modal país (click backdrop) | Cierra modal | `[ ]` | |
| B10 | Cerrar modal país (ESC) | Cierra modal | `[ ]` | |

---

## BLOQUE 2 — Navegación lateral (sidebar)

| # | Botón | Acción esperada | Estado | Notas |
|---|-------|-----------------|--------|-------|
| B11 | Datos del proyecto | Muestra sec-proyecto | `[ ]` | |
| B12 | Mediciones | Muestra sec-mediciones | `[ ]` | |
| B13 | Modelo de suelo | Muestra sec-suelo | `[ ]` | |
| B14 | Cálculos IEEE 80 | Muestra sec-calculos | `[ ]` | |
| B15 | Seguridad eléctrica | Muestra sec-seguridad | `[ ]` | |
| B16 | Alternativas SPT | Muestra sec-alternativas | `[ ]` | |
| B17 | Cantidades de materiales | Muestra sec-materiales | `[ ]` | |
| B18 | Evidencias fotográficas | Muestra sec-evidencias | `[ ]` | |
| B19 | Generar documento | Muestra sec-reporte + genera preview | `[ ]` | |
| B20 | Consistency Checker | Muestra sec-checker + ejecuta checker | `[ ]` | |
| B21 | Agregar SPT (PRO) | Muestra alerta premium Voryn | `[ ]` | |

---

## BLOQUE 3 — Datos del proyecto

| # | Botón / Acción | Acción esperada | Estado | Notas |
|---|---------------|-----------------|--------|-------|
| B22 | Demo "☀ Planta solar 1 MWp" | Carga datos ficticios + pre-llena Wenner | `[ ]` | |
| B23 | Demo "⚡ Subestación MT/BT" | Carga datos ficticios + pre-llena Wenner | `[ ]` | |
| B24 | Demo "〰 Apoyo línea MT" | Carga datos ficticios + pre-llena Wenner | `[ ]` | |
| B25 | Demo "🏗 Edificio industrial" | Carga datos ficticios + pre-llena Wenner | `[ ]` | |
| B26 | Demo "💻 Data center" | Carga datos ficticios + pre-llena Wenner | `[ ]` | |
| B27 | "Limpiar formulario" | Limpia todos los campos a vacío | `[ ]` | |
| B28 | Header refleja nombre proyecto | Teclear en f-nombre → actualiza ph-name | `[ ]` | |
| B29 | "Continuar → Mediciones" | Navega a sec-mediciones | `[ ]` | |

---

## BLOQUE 4 — Mediciones de resistividad

| # | Botón / Acción | Acción esperada | Estado | Notas |
|---|---------------|-----------------|--------|-------|
| B30 | Tab "Wenner" | Muestra meas-wenner | `[ ]` | |
| B31 | Tab "Schlumberger-Palmer" | Muestra meas-schlum | `[ ]` | |
| B32 | Tab "Método una varilla" | Muestra meas-varilla | `[ ]` | |
| B33 | Input R en Wenner (a=1m) | Calcula ρ = 2π·1·R automáticamente | `[ ]` | |
| B34 | Input R en Wenner (a=2m) | Calcula ρ = 2π·2·R | `[ ]` | |
| B35 | "+ Separación" (Wenner) | Agrega fila con input a y R | `[ ]` | |
| B36 | "+ Sondeo" (Schlumberger) | Agrega fila AB/2, MN/2, R | `[ ]` | |
| B37 | Input R en Schlumberger | Calcula ρ = π·(AB/2)²·R/(MN/2) | `[ ]` | |
| B38 | Input L/d/R varilla | Calcula ρ = 4πLR/(ln(8L/d)−1) | `[ ]` | |
| B39 | Stats actualizadas automáticamente | s-avg, s-min, s-max, s-cv se calculan | `[ ]` | |
| B40 | Clasificación terreno Tipo B | ρ entre 10-100 → badge "Tipo B — Bueno" | `[ ]` | |
| B41 | rho-eq sync desde Wenner | Campo rho-eq en suelo se pre-llena | `[ ]` | |
| B42 | "Continuar → Modelo de suelo" | Navega a sec-suelo | `[ ]` | |

---

## BLOQUE 5 — Modelo de suelo y parámetros de red

| # | Botón / Acción | Acción esperada | Estado | Notas |
|---|---------------|-----------------|--------|-------|
| B43 | Selector "Suelo homogéneo" | Muestra campo ρ equivalente único | `[ ]` | |
| B44 | Selector "Suelo dos capas" | Muestra campos ρ1, h1, ρ2 | `[ ]` | |
| B45 | Input ρ1/h1/ρ2 | Calcula ρ_eq Sunde automáticamente | `[ ]` | |
| B46 | Input If (corriente falla kA) | Actualiza Ig = If·Sf·Df·1000 | `[ ]` | |
| B47 | Input Sf | Actualiza Ig | `[ ]` | |
| B48 | Input Df | Actualiza Ig | `[ ]` | |
| B49 | Ig campo readonly | Muestra valor calculado, no editable | `[ ]` | |
| B50 | "Continuar → Cálculos IEEE 80" | Navega a sec-calculos + ejecuta runCalcs() | `[ ]` | |

---

## BLOQUE 6 — Cálculos IEEE 80

| # | Botón / Acción | Acción esperada | Estado | Notas |
|---|---------------|-----------------|--------|-------|
| B51 | Ejecutar runCalcs() | Ep70, Ec70, Ep50, Ec50, Rg, GPR calculados | `[ ]` | |
| B52 | "Recalcular" | Re-ejecuta runCalcs() con valores actuales | `[ ]` | |
| B53 | Input sección conductor mm² | Recalcula A_min y validación térmica | `[ ]` | |
| B54 | Selector material Cu | K=226, Tmax=450°C | `[ ]` | |
| B55 | Selector material CuSW 30% | K=200, Tmax=400°C | `[ ]` | |
| B56 | Selector material Aluminio | K=148, Tmax=350°C | `[ ]` | |
| B57 | Selector material Acero inox. | K=70, Tmax=300°C | `[ ]` | |
| B58 | Badge térmica CUMPLE | Verde si sección ≥ A_min | `[ ]` | |
| B59 | Badge térmica INSUFICIENTE | Rojo si sección < A_min | `[ ]` | |
| B60 | "Evaluar 25 alternativas" | Navega a sec-alternativas + evalAlternatives() | `[ ]` | |

---

## BLOQUE 7 — Seguridad eléctrica

| # | Botón / Acción | Acción esperada | Estado | Notas |
|---|---------------|-----------------|--------|-------|
| B61 | runSafety() ejecutado | Tabla 6 filas de validación | `[ ]` | |
| B62 | Gauge Rg | Arco SVG proporcional a Rg/límite | `[ ]` | |
| B63 | Gauge GPR | Arco SVG proporcional a GPR/Ep | `[ ]` | |
| B64 | Gauge Tensión contacto | Arco SVG proporcional a Ec_real/Ec_tol | `[ ]` | |
| B65 | Gauge Corriente Ig | Arco SVG proporcional a Ig | `[ ]` | |
| B66 | Alert verde (todos cumplen) | Visible si todos los checks OK | `[ ]` | |
| B67 | Alert rojo (falla) | Visible si algún check falla | `[ ]` | |
| B68 | Recomendaciones automáticas | Aparecen si falla (bentonita, tf, malla) | `[ ]` | |
| B69 | "Recalcular seguridad" | Re-ejecuta runSafety() | `[ ]` | |

---

## BLOQUE 8 — Alternativas SPT

| # | Botón / Acción | Acción esperada | Estado | Notas |
|---|---------------|-----------------|--------|-------|
| B70 | evalAlternatives() ejecutado | 25 filas en tabla | `[ ]` | |
| B71 | Filtro "Todas (25)" | 25 filas visibles | `[ ]` | |
| B72 | Filtro "Varilla" | 10 filas VARILLA | `[ ]` | |
| B73 | Filtro "Anillo" | 11 filas ANILLO | `[ ]` | |
| B74 | Filtro "Tríada" | 4 filas TRIADA | `[ ]` | |
| B75 | Fila recomendada "REC" | Badge visible en config recomendada | `[ ]` | |
| B76 | Filas que no cumplen | Fondo rojo visible | `[ ]` | |
| B77 | Botón "SVG" en fila | Muestra SVG + info de configuración | `[ ]` | |
| B78 | Zoom − en SVG | Reduce escala (-0.2) | `[ ]` | |
| B79 | Zoom + en SVG | Aumenta escala (+0.2) | `[ ]` | |
| B80 | Zoom ↺ en SVG | Reset escala = 1 | `[ ]` | |
| B81 | Panel malla especial | Visible si ninguna config cumple | `[ ]` | |
| B82 | Input W/L/sp/h/rods malla | Regenera SVG malla + Rg IEEE 80 App.B | `[ ]` | |
| B83 | "Continuar → Cantidades" | Navega + calcMaterials() | `[ ]` | |

---

## BLOQUE 9 — Materiales y evidencias

| # | Botón / Acción | Acción esperada | Estado | Notas |
|---|---------------|-----------------|--------|-------|
| B84 | calcMaterials() ejecutado | Tabla de materiales con cantidades | `[ ]` | |
| B85 | Bentonita condicional (Rf>0.4) | Aparece si configuración tiene Rf alto | `[ ]` | |
| B86 | Coke Breeze condicional (ρ>500) | Aparece si suelo muy resistivo | `[ ]` | |
| B87 | Click dropzone evidencias | Abre selector de archivos | `[ ]` | |
| B88 | Cargar imagen JPG/PNG | Muestra thumbnail 120×80px | `[ ]` | |

---

## BLOQUE 10 — Generación documental

| # | Botón / Acción | Acción esperada | Estado | Notas |
|---|---------------|-----------------|--------|-------|
| B89 | genDoc('completo') auto | Preview informe se genera al entrar a reporte | `[ ]` | |
| B90 | Preview: nombre proyecto | rep-nombre muestra f-nombre | `[ ]` | |
| B91 | Preview: parámetros de diseño | Tabla If, Sf, Df, tf, Ep70, Ec70, Rg | `[ ]` | |
| B92 | Preview: SVG config | Muestra SVG de la config seleccionada | `[ ]` | |
| B93 | Preview: validaciones | Alerts verde/rojo según Rg vs límite | `[ ]` | |
| B94 | Preview: disclaimer normativo | Texto disclaimers LATAM visible | `[ ]` | |
| B95 | "Exportar DOCX" — issues | Checker gate bloquea + lista issues | `[ ]` | |
| B96 | "Exportar PDF" — issues | Checker gate bloquea + lista issues | `[ ]` | |
| B97 | "Exportar JSON" — siempre | Descarga .json sin bloqueo | `[ ]` | |
| B98 | JSON contiene ST.* completo | All design parameters + checker result | `[ ]` | |
| B99 | "Exportar DOCX" — sin issues | Progress overlay + mensaje backend | `[ ]` | |

---

## BLOQUE 11 — Consistency Checker

| # | Regla | Condición de PASS | Estado | Notas |
|---|-------|-------------------|--------|-------|
| B100 | CHK-001: ρ calculada | ST.rho > 0 | `[ ]` | |
| B101 | CHK-002: If y tf ingresados | ST.If > 0 && ST.tf > 0 | `[ ]` | |
| B102 | CHK-003: Ig calculado | ST.Ig > 0 | `[ ]` | |
| B103 | CHK-004: Tensiones calculadas | ST.Ep70 > 0 && ST.Ec70 > 0 | `[ ]` | |
| B104 | CHK-005: Config seleccionada | ST.selectedId !== null | `[ ]` | |
| B105 | CHK-006: SVG disponible | SVGS[ST.selectedId] existe | `[ ]` | |
| B106 | CHK-007: Rg ≤ límite | ST.Rg ≤ norm.rgLimits.apoyo | `[ ]` | |
| B107 | CHK-008: Normativa validada | norm.validated === true | `[ ]` | |
| B108 | CHK-009: Cálculos ejecutados | ST.calcsDone === true | `[ ]` | |
| B109 | CHK-010: Profesional registrado | f-prof.value !== '' | `[ ]` | |
| B110 | Badge nav actualiza número | Muestra N de issues o ✓ | `[ ]` | |
| B111 | Docgen warning sincronizado | ck-warn-docgen refleja checker | `[ ]` | |

---

## BLOQUE 12 — Stepper y responsive

| # | Verificación | Estado | Notas |
|---|-------------|--------|-------|
| B112 | Stepper marca paso activo | Círculo azul en paso actual | `[ ]` | |
| B113 | Stepper marca pasos completados | Verde en pasos anteriores | `[ ]` | |
| B114 | Sidebar responsive (≤768px) | Sidebar oculto en mobile | `[ ]` | |
| B115 | Grids responsive (≤768px) | Columnas colapsan a 1 | `[ ]` | |
| B116 | Tablas con scroll horizontal | Tabla alternativas scrollable | `[ ]` | |
| B117 | Console sin errores JS | F12 → 0 errores rojos | `[ ]` | |
| B118 | Console sin 404 | F12 → 0 errores de archivo | `[ ]` | |

---

## Leyenda de estado
- `[ ]` = Pendiente de verificar
- `[x]` = PASS — funciona correctamente
- `[!]` = FAIL — error encontrado (documentar en Notas)
- `[P]` = PENDIENTE IMPLEMENTACIÓN — funcionalidad conocida como no implementada
- `[N/A]` = No aplica en esta versión

---

*TerraDoc SPT v1.0.0 — Voryn Energy — terradoc_button_tests.md*
