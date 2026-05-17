# mecline_validation_checklist.md — Checklist pre-deploy
**Producto:** MecLine LATAM v1.0.0 · Voryn Energy

---

## A. Navegación principal

| Elemento | Función | Estado | Obs. |
|---|---|---|---|
| Modo Unitario | `setMode('unit')` | ✅ | |
| Modo Wizard | `setMode('wizard')` | ✅ | |
| Modo Proyecto | `setMode('proj')` | ✅ | |
| Modo Conjuntos | `setMode('conj')` | ✅ 🔒 | Gate Free |
| MT / BT | `setNivel()` | ✅ | |
| Modo oscuro | `toggleDark()` | ✅ | |
| Badge plan | `showModal('pricing')` | ✅ | |
| 17 nav sidebar | `showPanel('id')` | ✅ | |
| Wizard pasos 1-7 | `irPaso(n)` | ✅ | |

## B. Selector de país y normativa

| Elemento | Estado | Obs. |
|---|---|---|
| Colombia | ✅ | RETIE 2013 + NTC 2050 |
| México | ✅ | NOM-001-SEDE |
| Perú | ✅ | CNE Suministro |
| Chile | ✅ | SEC Res. 254 |
| Ecuador | ✅ | Regulación ARCONEL 006/16 |
| Argentina | ✅ | Res. SE 444/94 |
| Bolivia | ✅ | NB 777:2012 |
| Panamá | ✅ | ETESA/ANDE-R-01 |
| Parámetros sincronizados (viento, T, límites) | ✅ | `sincPais()` |

## C. Cálculo electromecánico

| Elemento | Estado | Obs. |
|---|---|---|
| Carga de viento (Qv) | ✅ | ρ=1.25, Cd=1.0 |
| Peso propio conductor | ✅ | kg/m |
| Carga resultante w_res | ✅ | √(w_acc² + w_v²) |
| T_EDS (tensión de partida) | ✅ | 18% UTS por defecto |
| Hipótesis A — Viento máximo | ✅ | T_horizontal, flecha, %UTS |
| Hipótesis B — T. mínima | ✅ ⚠️ | Aprox. +8% EDS |
| Hipótesis C — EDS operación | ✅ | Tensión partida adoptada |
| Hipótesis D — T. máxima | ✅ ⚠️ | Aprox. −12% EDS |
| Cargas sobre apoyo | ✅ | Transversal, longitudinal, momento |
| Factor seguridad apoyo | ✅ | Concreto 2.5, acero 2.0, madera 3.0 |
| Score riesgo 0-100 | ✅ | |
| Nivel confianza ALTO/MEDIO/BAJO | ✅ | |
| Estado cumple/revisar/critico | ✅ | |

## D. Hipótesis de carga (panel-hip)

| Elemento | Estado |
|---|---|
| 4 cards hipótesis A-B-C-D | ✅ |
| Tabla comparativa T/flecha/%UTS/f-L | ✅ |
| Gate upgrade (plan Free) | ✅ |
| Alert nota preliminar | ✅ |

## E. Conjuntos constructivos

| Elemento | Estado | Obs. |
|---|---|---|
| Catálogo 18 conjuntos | ✅ | MT y BT |
| Filtros país/tipo | ✅ | |
| Modal detalle conjunto | ✅ | |
| Recomendador automático | ✅ | Por ángulo, vano, zona, equipos |
| Validador 5 criterios | ✅ | tensión, ángulo, vano, zona, conductor |
| Suministros referenciales | ✅ | 7 tipos |
| Gate plan Free | ✅ | |

## F. Proyecto multi-estructura

| Elemento | Estado |
|---|---|
| Drag & drop .xlsx/.xls | ✅ |
| Click upload Excel | ✅ |
| Parse columnas requeridas | ✅ |
| Cálculo batch | ✅ |
| KPI cards (4 métricas) | ✅ |
| Top 5 por riesgo | ✅ |
| Tabla resultados filtrable | ✅ |
| Panel críticas | ✅ |
| Branding empresa | ✅ |

## G. Exportaciones

| Exportación | Función | Estado | Obs. |
|---|---|---|---|
| XLSX resultados | `exportarXLSX()` | ✅ | Requiere SheetJS CDN |
| JSON proyecto | `exportarDatos()` | ✅ | |
| Memoria técnica HTML | `genMemHTML()` | ✅ | Nueva pestaña |
| PDF (print) | `window.print()` | ✅ | Desde pestaña HTML |

## H. Memoria técnica

| Sección | Estado |
|---|---|
| Carátula con branding empresa | ✅ |
| Marco normativo | ✅ |
| 4 hipótesis de carga | ✅ |
| Tabla resultados (max 100 estr.) | ✅ |
| Conjuntos constructivos | ✅ |
| Conclusiones automáticas | ✅ |
| Nota legal disclaimer | ✅ |
| 3 firmas (Elaboró/Revisó/Aprobó) | ✅ |

## I. Asistente IA

| Elemento | Estado | Obs. |
|---|---|---|
| Chat unitario | ✅ | Con contexto resultado |
| Chat proyecto | ✅ | Con contexto proyecto |
| System prompt técnico | ✅ | 7 reglas, español formal |
| Hotkey Enter | ✅ | Shift+Enter = nueva línea |
| Gate 5 msg/día (Free) | ✅ | |
| Contador sidebar | ✅ | |
| Manejo error API | ✅ | |

## J. Sistema de planes

| Elemento | Estado |
|---|---|
| Onboarding primera carga | ✅ |
| Plan Free / Pro / Enterprise | ✅ |
| activarPlan() | ✅ |
| Gates contextuales | ✅ |
| Persistencia sessionStorage | ✅ |
| Toast confirmación | ✅ |

## K. Validación técnica de archivos

| Archivo | Rutas válidas | JS balanceado | Estado |
|---|---|---|---|
| index.html | ✅ 4 CSS + 7 JS + 1 asset | N/A | ✅ |
| mecline_app.js | — | ✅ | ✅ |
| mecline_calculations.js | — | ✅ | ✅ |
| mecline_validations.js | — | ✅ | ✅ |
| mecline_ui.js | — | ✅ | ✅ |
| mecline_exports.js | — | ✅ | ✅ |
| mecline_ai_assistant.js | — | ✅ | ✅ |

## L. Consola JavaScript (esperado en carga inicial)

| Validación | Estado |
|---|---|
| 0 errores `undefined function` | ✅ |
| 0 paneles sin ID | ✅ 17/17 |
| 0 modales sin ID | ✅ 2/2 |
| 0 IDs faltantes en DOM | ✅ 0/115 |
| 18 funciones críticas presentes | ✅ 18/18 |
| Braces JS balanceados | ✅ 606=606 |

## M. Responsive

| Breakpoint | Estado | Obs. |
|---|---|---|
| Desktop ≥ 1024px | ✅ | |
| Tablet 768–1024px | ✅ | Sidebar 180px |
| Mobile ≤ 768px | ✅ | Sidebar oculto |
| Mobile ≤ 480px | ✅ | |
| Print | ✅ | Nav/topbar ocultos |

---

## Checklist pre-deploy Voryn

```
☐ 1. Servir desde HTTP (no file://)
☐ 2. Proxy backend configurado para Claude API (nunca exponer key)
☐ 3. Verificar CDN accesible: jsdelivr, cdnjs, fonts.google.com
☐ 4. Probar importación .xlsx con archivo real del proyecto
☐ 5. Probar exportación XLSX y memoria técnica en Chrome y Firefox
☐ 6. Verificar modo oscuro en todos los paneles
☐ 7. Probar wizard completo 7 pasos
☐ 8. Probar flujo: onboarding → Free → Pro → gates
☐ 9. Verificar gate IA (5 mensajes → bloqueo)
☐ 10. Consola browser: 0 errores en carga inicial
☐ 11. Verificar que mecline_ prefix en todos los archivos
☐ 12. Verificar que NO existe ningún archivo ambiguo (main.css, app.js, etc.)
```
