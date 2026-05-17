# mecline_button_tests.md — Validación de botones
**Producto:** MecLine LATAM v1.0.0 · Voryn Energy

Total onclick únicos: 61

| # | Botón / onclick | Función llamada | Estado | Observación |
|---|---|---|---|---|
| 1 | `iniciarSesion('free')` | iniciarSesion | ✅ OK |  |
| 2 | `iniciarSesion('pro')` | iniciarSesion | ✅ OK |  |
| 3 | `showModal('pricing')` | showModal | ✅ OK |  |
| 4 | `setMode('unit')` | setMode | ✅ OK |  |
| 5 | `setMode('wizard')` | setMode | ✅ OK |  |
| 6 | `setMode('proj')` | setMode | ✅ OK |  |
| 7 | `setMode('conj')` | setMode | ✅ OK |  |
| 8 | `setNivel('mt')` | setNivel | ✅ OK |  |
| 9 | `setNivel('bt')` | setNivel | ✅ OK |  |
| 10 | `toggleDark()` | toggleDark | ✅ OK |  |
| 11 | `showPanel('calc')` | showPanel | ✅ OK |  |
| 12 | `showPanel('hip')` | showPanel | ✅ OK |  |
| 13 | `showPanel('res')` | showPanel | ✅ OK |  |
| 14 | `showPanel('cat')` | showPanel | ✅ OK |  |
| 15 | `showPanel('ai')` | showPanel | ✅ OK |  |
| 16 | `showPanel('norm')` | showPanel | ✅ OK |  |
| 17 | `irPaso(0)` | irPaso | ✅ OK |  |
| 18 | `irPaso(1)` | irPaso | ✅ OK |  |
| 19 | `irPaso(2)` | irPaso | ✅ OK |  |
| 20 | `irPaso(3)` | irPaso | ✅ OK |  |
| 21 | `irPaso(4)` | irPaso | ✅ OK |  |
| 22 | `irPaso(5)` | irPaso | ✅ OK |  |
| 23 | `irPaso(6)` | irPaso | ✅ OK |  |
| 24 | `showPanel('dash')` | showPanel | ✅ OK |  |
| 25 | `showPanel('imp')` | showPanel | ✅ OK |  |
| 26 | `showPanel('tbl')` | showPanel | ✅ OK |  |
| 27 | `showPanel('crit')` | showPanel | ✅ OK |  |
| 28 | `showPanel('brand')` | showPanel | ✅ OK |  |
| 29 | `showPanel('mem')` | showPanel | ✅ OK |  |
| 30 | `showPanel('pai')` | showPanel | ✅ OK |  |
| 31 | `showPanel('conj-cat')` | showPanel | ✅ OK |  |
| 32 | `showPanel('conj-rec')` | showPanel | ✅ OK |  |
| 33 | `showPanel('conj-val')` | showPanel | ✅ OK |  |
| 34 | `showPanel('conj-mat')` | showPanel | ✅ OK |  |
| 35 | `cargarEjemplo()` | cargarEjemplo | ✅ OK |  |
| 36 | `showTab(event,'t-gen')` | showTab | ✅ OK |  |
| 37 | `showTab(event,'t-amb')` | showTab | ✅ OK |  |
| 38 | `showTab(event,'t-geo')` | showTab | ✅ OK |  |
| 39 | `showTab(event,'t-cond')` | showTab | ✅ OK |  |
| 40 | `showTab(event,'t-est')` | showTab | ✅ OK |  |
| 41 | `resetCalc()` | resetCalc | ✅ OK |  |
| 42 | `showPanel('hip');calcularHipotesis()` | showPanel, calcularHipotesis | ✅ OK |  |
| 43 | `calcular()` | calcular | ✅ OK |  |
| 44 | `calcularHipotesis()` | calcularHipotesis | ✅ OK |  |
| 45 | `document.getElementById('hip-upgrade-gate').style.displ` | (inline JS) | ✅ OK (API nativa) | Método nativo del navegador |
| 46 | `showPanel('conj-rec');recomendarConjunto()` | showPanel, recomendarConjunto | ✅ OK |  |
| 47 | `sendMsg('chat-ai','ci-ai',false)` | sendMsg | ✅ OK |  |
| 48 | `cargarDemo()` | cargarDemo | ✅ OK |  |
| 49 | `exportarXLSX()` | exportarXLSX | ✅ OK |  |
| 50 | `document.getElementById('fi-xl').click()` | (inline JS) | ✅ OK (API nativa) | Método nativo del navegador |
| 51 | `genMemHTML()` | genMemHTML | ✅ OK |  |
| 52 | `exportarDatos()` | exportarDatos | ✅ OK |  |
| 53 | `sendMsg('chat-pai','ci-pai',true)` | sendMsg | ✅ OK |  |
| 54 | `recomendarConjunto()` | recomendarConjunto | ✅ OK |  |
| 55 | `validarConjunto()` | validarConjunto | ✅ OK |  |
| 56 | `closeModal('pricing')` | closeModal | ✅ OK |  |
| 57 | `activarPlan('free')` | activarPlan | ✅ OK |  |
| 58 | `activarPlan('pro')` | activarPlan | ✅ OK |  |
| 59 | `activarPlan('enterprise')` | activarPlan | ✅ OK |  |
| 60 | `closeModal('conj')` | closeModal | ✅ OK |  |
| 61 | `aplicarConjunto()` | aplicarConjunto | ✅ OK |  |
