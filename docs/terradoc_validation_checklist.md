# TerraDoc SPT — Checklist de Validación Pre-deploy

## Instrucciones
Ejecutar este checklist antes de cada deploy o entrega al cliente.  
Marcar cada ítem como `[x]` cuando esté verificado, `[!]` si tiene issues.

---

## 1. Botones y acciones UI

| Botón / Acción | Funcionamiento esperado | Estado |
|----------------|------------------------|--------|
| Selector de país (topbar) | Abre modal con 17 países | [ ] |
| Seleccionar país → CO/CL/MX/PE/EC | Carga normativa y límites Rg | [ ] |
| Plantilla demo — Solar | Carga datos ficticios + Wenner | [ ] |
| Plantilla demo — Subestación | Carga datos ficticios + Wenner | [ ] |
| Plantilla demo — Apoyo línea | Carga datos ficticios + Wenner | [ ] |
| Plantilla demo — Edificio | Carga datos ficticios + Wenner | [ ] |
| Plantilla demo — Data center | Carga datos ficticios + Wenner | [ ] |
| Limpiar formulario | Limpia todos los campos | [ ] |
| Continuar → Mediciones | Navega a sección mediciones | [ ] |
| Tab Wenner | Muestra tabla Wenner | [ ] |
| Tab Schlumberger-Palmer | Muestra tabla Schlumberger | [ ] |
| Tab Método una varilla | Muestra formulario varilla | [ ] |
| Input R en Wenner | Calcula ρ automáticamente | [ ] |
| + Separación Wenner | Agrega fila extra a tabla | [ ] |
| + Sondeo Schlumberger | Agrega fila AB/2, MN/2, R | [ ] |
| Input R varilla | Calcula ρ con fórmula IEEE 81 §7.4 | [ ] |
| Continuar → Suelo | Navega a modelo de suelo | [ ] |
| Selector modelo homogéneo | Muestra campo ρ equivalente | [ ] |
| Selector modelo dos capas | Muestra campos ρ1, h1, ρ2 | [ ] |
| Input ρ equivalente | Actualiza ST.rho | [ ] |
| Input ρ1/h1/ρ2 | Calcula ρ_eq Sunde automáticamente | [ ] |
| Input If (corriente falla) | Actualiza Ig = If·Sf·Df | [ ] |
| Input Sf / Df | Actualiza Ig | [ ] |
| Continuar → Cálculos IEEE 80 | Ejecuta runCalcs() | [ ] |
| Recalcular | Re-ejecuta runCalcs() | [ ] |
| Input sección conductor (mm²) | Recalcula validación térmica | [ ] |
| Selector material conductor | Recalcula K, Tmax | [ ] |
| Continuar → Seguridad eléctrica | Ejecuta runSafety() | [ ] |
| Recalcular seguridad | Re-ejecuta runSafety() | [ ] |
| Continuar → Alternativas | Ejecuta evalAlternatives() | [ ] |
| Filtro Todas (25) | Muestra todas las configs | [ ] |
| Filtro Varilla | Filtra solo VARILLA | [ ] |
| Filtro Anillo | Filtra solo ANILLO | [ ] |
| Filtro Tríada | Filtra solo TRIADA | [ ] |
| Botón "SVG" en tabla | Muestra SVG + info config | [ ] |
| Zoom − en SVG | Reduce escala | [ ] |
| Zoom + en SVG | Aumenta escala | [ ] |
| Zoom ↺ en SVG | Reset escala 1:1 | [ ] |
| Input dimensiones malla | Regenera SVG malla + Rg | [ ] |
| Continuar → Cantidades | Calcula materiales | [ ] |
| Evidencias — click/drop | Carga imágenes | [ ] |
| Continuar → Documento | Genera preview informe | [ ] |
| Botón DOCX | Checker gate → alerta o export | [ ] |
| Botón PDF | Checker gate → alerta o export | [ ] |
| Botón JSON | Descarga .json sin bloqueo | [ ] |
| Consistency Checker | Muestra 10 CHK + badge nav | [ ] |
| Navegación lateral (todos) | Cambia sección activa | [ ] |
| Stepper (pasos 1-7) | Actualiza estado visual | [ ] |
| Calcular todo (topbar) | Ejecuta pipeline completo | [ ] |
| Agregar SPT (PRO) | Muestra alerta premium | [ ] |

---

## 2. Cálculos IEEE 80-2013

| Cálculo | Fórmula | Verificación manual | Estado |
|---------|---------|---------------------|--------|
| Ig = If·Sf·Df | kA → A | If=2.5kA, Sf=1, Df=1 → Ig=2500A | [ ] |
| Ep(70kg) = (1000+6·ρs)·0.116/√tf | §8.3 | ρs=3000, tf=0.5 → Ep≈1173V | [ ] |
| Ec(70kg) = (1000+1.5·ρs)·0.116/√tf | §8.3 | ρs=3000, tf=0.5 → Ec≈746V | [ ] |
| Ep(50kg) con K=0.157 | §8.3 | Verificar > Ep(70kg) | [ ] |
| GPR = Ig·Rg | §16.5 | Coherente con Rg y Ig | [ ] |
| A_min = Ig·√tf/K_Cu | §11.3 | If=2.5kA,tf=0.5,Cu → A_min≈7.8mm² | [ ] |
| Rg = Rf·ρ por configuración | Config catalog | VARILLA_01: Rf=1.0, ρ=100 → Rg=100Ω | [ ] |
| Rg malla Schwarz simplificado | App. B | 10×10m, ρ=100 → Rg≈6Ω aprox. | [ ] |

---

## 3. Mediciones

| Método | Fórmula | Test | Estado |
|--------|---------|------|--------|
| Wenner: ρ = 2π·a·R | IEEE 81 §7.3.1 | a=2m, R=5Ω → ρ=62.8Ω·m | [ ] |
| Schlumberger: ρ = π·(AB/2)²·R/(MN/2) | IEEE 81 §7.3.2 | AB=10,MN=2,R=3 → ρ≈471Ω·m | [ ] |
| Una varilla: ρ=4πLR/(ln(8L/d)-1) | IEEE 81 §7.4 | L=2.4,d=0.016,R=10 → ρ≈182Ω·m | [ ] |
| Clasificación tipo A (<10 Ω·m) | | Entrada ρ=5 → "Tipo A" badge | [ ] |
| Clasificación tipo E (>1000 Ω·m) | | Entrada ρ=1500 → "Tipo E" badge | [ ] |
| Sincronización ρ-eq con mediciones | | ρ promedio sync a campo suelo | [ ] |

---

## 4. SVG y visualización

| Item | Verificación | Estado |
|------|-------------|--------|
| 25 SVGs cargan correctamente | Verificar cada tipo | [ ] |
| VARILLA_01 a VARILLA_10 | Visible en selector | [ ] |
| ANILLO_01 a ANILLO_11 | Visible en selector | [ ] |
| TRIADA_01 a TRIADA_04 | Visible en selector | [ ] |
| Zoom − / + / ↺ funciona | SVG escala correctamente | [ ] |
| Malla paramétrica se genera | Cambiar W, L, sp → nuevo SVG | [ ] |
| Rg malla se actualiza | Cambiar parámetros → nuevo Rg | [ ] |
| SVG aparece en preview informe | Seleccionar config → preview | [ ] |

---

## 5. Alternativas SPT

| Verificación | Estado |
|-------------|--------|
| 25 filas en tabla (sin filtro) | [ ] |
| Filtro VARILLA muestra 10 filas | [ ] |
| Filtro ANILLO muestra 11 filas | [ ] |
| Filtro TRIADA muestra 4 filas | [ ] |
| Fila recomendada marcada "REC" | [ ] |
| Filas que no cumplen en rojo | [ ] |
| Rg calculada = Rf × ρ | [ ] |
| Ep/Ec real coherentes con GPR | [ ] |

---

## 6. Seguridad eléctrica

| Verificación | Estado |
|-------------|--------|
| 6 filas en tabla validación | [ ] |
| 4 gauges SVG animados | [ ] |
| Alert verde si todos cumplen | [ ] |
| Alert rojo si alguno falla | [ ] |
| Recomendaciones aparecen si falla | [ ] |
| Gauge proporcional al valor | [ ] |

---

## 7. Exportaciones

| Verificación | Estado |
|-------------|--------|
| JSON descarga archivo .json | [ ] |
| JSON contiene todos los datos (ST.*) | [ ] |
| JSON incluye consistency_checker | [ ] |
| DOCX bloqueado si issues críticos | [ ] |
| PDF bloqueado si issues críticos | [ ] |
| DOCX/PDF muestran alert + lista issues | [ ] |
| Progress overlay aparece al exportar | [ ] |

---

## 8. Consistency Checker

| Regla | Condición | Estado |
|-------|-----------|--------|
| CHK-001: ρ calculada | ST.rho > 0 | [ ] |
| CHK-002: If y tf ingresados | ST.If > 0 && ST.tf > 0 | [ ] |
| CHK-003: Ig calculado | ST.Ig > 0 | [ ] |
| CHK-004: Tensiones calculadas | ST.Ep70 > 0 && ST.Ec70 > 0 | [ ] |
| CHK-005: Config SPT seleccionada | ST.selectedId != null | [ ] |
| CHK-006: SVG disponible | SVGS[ST.selectedId] existe | [ ] |
| CHK-007: Rg ≤ límite normativo | ST.Rg ≤ norm.rgLimits.apoyo | [ ] |
| CHK-008: Normativa validada | norm.validated === true | [ ] |
| CHK-009: Cálculos ejecutados | ST.calcsDone === true | [ ] |
| CHK-010: Profesional registrado | f-prof.value != '' | [ ] |
| Badge nav actualizado | Número correcto de issues | [ ] |

---

## 9. Navegación y UX

| Verificación | Estado |
|-------------|--------|
| Todas las secciones accesibles desde sidebar | [ ] |
| Stepper refleja paso actual | [ ] |
| Sección activa highlight en sidebar | [ ] |
| Header muestra nombre proyecto | [ ] |
| Header muestra país/normativa activa | [ ] |
| Modal país cierra al seleccionar | [ ] |
| Progress overlay desaparece al finalizar | [ ] |

---

## 10. Responsividad y browser support

| Navegador / Dispositivo | Estado |
|------------------------|--------|
| Chrome (desktop) | [ ] |
| Firefox (desktop) | [ ] |
| Safari (desktop) | [ ] |
| Edge (desktop) | [ ] |
| Chrome Mobile | [ ] |
| Safari iOS | [ ] |
| Resolución 1280×720 | [ ] |
| Resolución 1920×1080 | [ ] |

---

## 11. Infraestructura y deploy

| Verificación | Estado |
|-------------|--------|
| Servidor HTTP activo (no file://) | [ ] |
| data/countries.json accesible | [ ] |
| data/spt-configurations.json accesible | [ ] |
| data/svg-catalog.json accesible | [ ] |
| HTTPS configurado (producción) | [ ] |
| Fuentes cargan (o fallback) | [ ] |
| Console sin errores JS | [ ] |
| Console sin errores 404 | [ ] |
| manifest.json válido | [ ] |

---

## 12. Datos normativos

| País | Normativa | Rg límites | Estado |
|------|-----------|-----------|--------|
| Colombia (CO) | RETIE, NTC 2050, IEEE 80/81 | Sub:10Ω Apo:25Ω Edi:5Ω | [ ] |
| Chile (CL) | SEC, RIC, RPTD | Sub:5Ω Apo:25Ω | [ ] |
| México (MX) | NOM-001-SEDE-2012 | Sub:5Ω Apo:25Ω | [ ] |
| Perú (PE) | CNE 2011 | Sub:10Ω Apo:25Ω | [ ] |
| Ecuador (EC) | NEC-SB-IE | Sub:10Ω Apo:25Ω | [ ] |
| Brasil (BR) | ABNT NBR 5410/14039 | Sub:10Ω Apo:20Ω | [ ] |
| Países no validados | Advertencia técnica visible | | [ ] |

---

**Resultado final:**  
- `[ ]` pendientes = NO liberar  
- Todos `[x]` = Apto para producción  
- Items `[!]` = Documentar como limitación conocida
