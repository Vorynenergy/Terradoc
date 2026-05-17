# mecline_calculation_tests.md — Casos de prueba del motor
**Producto:** MecLine LATAM v1.0.0 · Voryn Energy  
**Módulo:** `mecline_calculations.js`

---

## Caso de prueba 1 — Conductor ACSR 2/0 AWG (referencia Colombia)

**Parámetros de entrada:**
| Parámetro | Valor |
|---|---|
| País | Colombia (RETIE 2013) |
| Conductor | ACSR 2/0 AWG — QUAIL |
| Diámetro | 13.26 mm |
| Peso unitario | 0.420 kg/m |
| UTS | 25.2 kN |
| Vano | 80 m |
| Ángulo | 0° (alineación) |
| Viento ref. | 27 m/s |
| T_min / T_max / T_EDS | 5 / 40 / 25 °C |

**Resultados esperados (motor v6):**
| Variable | Esperado | Tolerancia |
|---|---|---|
| w_acc (kg/m) | 0.420 | ±0.001 |
| Qv (kgf/m) | ≈ 0.357 | ±0.01 |
| T_EDS (kN) | ≈ 4.536 (18% × 25.2) | ±0.05 |
| Flecha viento (m) | ≈ 1.19 | ±0.15 |
| %UTS viento | ≈ 28–35% | < 50% ✅ |
| f/L | < 0.03 | ✅ |
| Estado | cumple | |
| Score | < 40 | |

**Cómo verificar:**
1. Cargar el ejemplo (botón "Ejemplo")
2. Clic en "Calcular"
3. Verificar panel "Resultados"
4. Clic en "Ver hipótesis" → verificar las 4 tarjetas

---

## Caso de prueba 2 — Vano crítico (límite de falla)

**Parámetros:**
| Parámetro | Valor |
|---|---|
| Conductor | ACSR 1/0 AWG |
| Vano | 180 m |
| Viento | 35 m/s |
| País | Chile (límite %UTS: 0.50) |

**Resultado esperado:**
| Variable | Esperado |
|---|---|
| %UTS viento | > 50% |
| Estado | critico |
| Score | > 70 |
| Alerta UTS | Visible en panel |

---

## Caso de prueba 3 — Hipótesis C (EDS) con conductor rígido

**Parámetros:**
| Parámetro | Valor |
|---|---|
| Conductor | AAAC 350 kcmil |
| Vano | 60 m |
| T_EDS | 25°C |
| %UTS_EDS límite | 18% (Colombia) |

**Resultado esperado:**
- T_EDS < 18% UTS → estado hipótesis C: Cumple
- Score < 30

---

## Caso de prueba 4 — Procesamiento batch (proyecto)

**Parámetros:**
- Demo con 7 estructuras
- Botón "Demo" en modo Proyecto

**Resultado esperado:**
| KPI | Valor |
|---|---|
| Total estructuras | 7 |
| Sin incumplimientos | ≥ 3 |
| Con observaciones | ≥ 1 |
| Críticas | ≥ 1 |
| Score máx | > 60 |

---

## Verificación de constantes físicas

| Constante | Valor definido | Fuente |
|---|---|---|
| G (m/s²) | 9.81 | IEC 60826 |
| ρ_aire (kg/m³) | 1.25 | IEC 60826 Tabla |
| Cd (coef. arrastre) | 1.0 | Conductor circular |
| FA (factor adicional) | 1.05 | Tolerancia ±5% |
| DL (deflexión límite) | 0.03 | 3% = f/L |

---

## Factores de seguridad apoyo

| Tipo | FS | Normativa |
|---|---|---|
| Concreto centrifugado | 2.5 | RETIE / NOM-001 |
| Acero galvanizado | 2.0 | IEC 60826 |
| Fibra de vidrio | 2.5 | Fabricante ref. |
| Madera tratada | 3.0 | NESC / RETIE |

---

## ⚠️ Limitaciones conocidas del motor v6

1. **Hipótesis B y D:** Aproximación paramétrica (+8% / -12% sobre EDS). No implementa ecuación completa de cambio de estado.
2. **Deflexión:** Solo f/L parabólica — no verifica distancias reglamentarias absolutas.
3. **Vano regulador:** Usado en T_EDS pero no en cambio de estado completo.
4. **Temperatura:** No ajusta módulo de elasticidad ni coeficiente de dilatación por temperatura.
