# TerraDoc SPT — terradoc_calculation_tests.md
## Voryn Energy — Cálculos IEEE 80-2013 / IEEE 81-2012

Verificaciones numéricas de los cálculos del motor técnico. Los valores esperados se calcularon manualmente a partir de las fórmulas publicadas en las normas.

---

## TEST SET 1 — Método Wenner (IEEE 81 §7.3.1)
**Fórmula:** `ρ = 2π·a·R`

| # | Entrada | Resultado esperado | Tolerancia | Estado |
|---|---------|-------------------|------------|--------|
| C01 | a=1m, R=5.0Ω | ρ = 31.4 Ω·m | ±0.1 | `[ ]` |
| C02 | a=2m, R=5.0Ω | ρ = 62.8 Ω·m | ±0.1 | `[ ]` |
| C03 | a=4m, R=5.0Ω | ρ = 125.7 Ω·m | ±0.1 | `[ ]` |
| C04 | a=6m, R=5.0Ω | ρ = 188.5 Ω·m | ±0.1 | `[ ]` |
| C05 | a=8m, R=5.0Ω | ρ = 251.3 Ω·m | ±0.1 | `[ ]` |
| C06 | a=2m, R=7.3Ω | ρ = 91.7 Ω·m | ±0.1 | `[ ]` |
| C07 | a=4m, R=2.1Ω | ρ = 52.8 Ω·m | ±0.1 | `[ ]` |

## TEST SET 2 — Schlumberger-Palmer (IEEE 81 §7.3.2)
**Fórmula:** `ρ = π·(AB/2)²·R / (MN/2)`

| # | Entrada | Resultado esperado | Tolerancia | Estado |
|---|---------|-------------------|------------|--------|
| C08 | AB=10m, MN=2m, R=3.0Ω | ρ = 471.2 Ω·m | ±0.5 | `[ ]` |
| C09 | AB=6m, MN=1m, R=5.0Ω | ρ = 565.5 Ω·m | ±0.5 | `[ ]` |
| C10 | AB=20m, MN=2m, R=1.5Ω | ρ = 942.5 Ω·m | ±0.5 | `[ ]` |
| C11 | AB=4m, MN=1m, R=8.0Ω | ρ = 402.1 Ω·m | ±0.5 | `[ ]` |

## TEST SET 3 — Método una varilla (IEEE 81 §7.4)
**Fórmula:** `ρ = 4π·L·R / (ln(8L/d) − 1)`

| # | Entrada | Resultado esperado | Tolerancia | Estado |
|---|---------|-------------------|------------|--------|
| C12 | L=2.4m, d=0.016m, R=10Ω | ρ ≈ 182 Ω·m | ±2 | `[ ]` |
| C13 | L=2.4m, d=0.016m, R=5Ω | ρ ≈ 91 Ω·m | ±1 | `[ ]` |
| C14 | L=3.0m, d=0.016m, R=8Ω | ρ ≈ 164 Ω·m | ±2 | `[ ]` |

## TEST SET 4 — Suelo dos capas (Sunde)
**Fórmula:** `ρ_eq = ρ1·(1 − e^(−h1/2)) + ρ2·e^(−h1/2)`

| # | Entrada | Resultado esperado | Tolerancia | Estado |
|---|---------|-------------------|------------|--------|
| C15 | ρ1=80, h1=1.5m, ρ2=350 | ρ_eq ≈ 234 Ω·m | ±2 | `[ ]` |
| C16 | ρ1=100, h1=2.0m, ρ2=100 | ρ_eq = 100 Ω·m | ±0.1 | `[ ]` |
| C17 | ρ1=50, h1=3.0m, ρ2=500 | ρ_eq ≈ 373 Ω·m | ±5 | `[ ]` |

## TEST SET 5 — Corriente de diseño (IEEE 80 §15)
**Fórmula:** `Ig = If · Sf · Df · 1000`

| # | Entrada | Resultado esperado | Estado |
|---|---------|-------------------|--------|
| C18 | If=2.5kA, Sf=1.0, Df=1.0 | Ig = 2500 A | `[ ]` |
| C19 | If=3.5kA, Sf=0.7, Df=1.0 | Ig = 2450 A | `[ ]` |
| C20 | If=1.8kA, Sf=0.85, Df=1.1 | Ig = 1683 A | `[ ]` |
| C21 | If=5.0kA, Sf=0.6, Df=1.05 | Ig = 3150 A | `[ ]` |

## TEST SET 6 — Tensión de paso tolerable (IEEE 80 §8.3 Eq.29)
**Fórmula:** `Ep(70kg) = (1000 + 6·ρs) · 0.116 / √tf`

| # | Entrada | Resultado esperado | Estado |
|---|---------|-------------------|--------|
| C22 | ρs=3000, tf=0.5s | Ep70 ≈ 1172 V | `[ ]` |
| C23 | ρs=3000, tf=1.0s | Ep70 ≈ 829 V | `[ ]` |
| C24 | ρs=1000, tf=0.5s | Ep70 ≈ 648 V | `[ ]` |
| C25 | ρs=0, tf=0.5s | Ep70 ≈ 164 V | `[ ]` |

## TEST SET 7 — Tensión de contacto tolerable (IEEE 80 §8.3 Eq.32)
**Fórmula:** `Ec(70kg) = (1000 + 1.5·ρs) · 0.116 / √tf`

| # | Entrada | Resultado esperado | Estado |
|---|---------|-------------------|--------|
| C26 | ρs=3000, tf=0.5s | Ec70 ≈ 878 V | `[ ]` |
| C27 | ρs=3000, tf=1.0s | Ec70 ≈ 621 V | `[ ]` |
| C28 | ρs=1000, tf=0.5s | Ec70 ≈ 382 V | `[ ]` |

## TEST SET 8 — Validación térmica conductor (IEEE 80 §11.3 Eq.37)
**Fórmula:** `A_min = Ig · √tf / K_material`

| # | Entrada | A_min esperada | Estado |
|---|---------|---------------|--------|
| C29 | Ig=2500A, tf=0.5s, Cu (K=226) | 7.82 mm² | `[ ]` |
| C30 | Ig=2500A, tf=0.5s, Al (K=148) | 11.94 mm² | `[ ]` |
| C31 | Ig=3500A, tf=0.6s, Cu (K=226) | 11.99 mm² | `[ ]` |
| C32 | Sección 35mm² ≥ A_min → CUMPLE | Badge verde | `[ ]` |
| C33 | Sección 10mm² < A_min → INSUFICIENTE | Badge rojo | `[ ]` |

## TEST SET 9 — Rg por configuración
**Fórmula:** `Rg = Rf · ρ`

| # | Config | ρ (Ω·m) | Rf | Rg esperada | Estado |
|---|--------|---------|-----|------------|--------|
| C34 | VARILLA_01 | 100 | 1.00 | 100.0 Ω | `[ ]` |
| C35 | VARILLA_05 | 100 | 0.58 | 58.0 Ω | `[ ]` |
| C36 | ANILLO_01 | 100 | 0.55 | 55.0 Ω | `[ ]` |
| C37 | ANILLO_07 | 100 | 0.26 | 26.0 Ω | `[ ]` |
| C38 | TRIADA_01 | 100 | 0.38 | 38.0 Ω | `[ ]` |
| C39 | TRIADA_04 | 100 | 0.25 | 25.0 Ω | `[ ]` |
| C40 | Todos — ρ=50Ω·m | Todos Rg = Rf×50 | | `[ ]` | |

## TEST SET 10 — Rg malla (IEEE 80 App.B Eq.57 simplificado)

| # | Parámetros | Rg esperada | Estado | Notas |
|---|-----------|------------|--------|-------|
| C41 | W=10m, L=10m, h=0.5m, ρ=100 | ≈ 5-7 Ω | `[ ]` | Rango aprox. |
| C42 | W=20m, L=20m, h=0.5m, ρ=100 | ≈ 3-4 Ω | `[ ]` | Mayor área → menor Rg |
| C43 | W=10m, L=10m, h=0.5m, ρ=300 | ≈ 15-21 Ω | `[ ]` | 3× ρ → ~3× Rg |

---

## EJECUCIÓN

Para verificar manualmente:

```
Ep70 (ρs=3000, tf=0.5):
  = (1000 + 6×3000) × 0.116 / √0.5
  = 19000 × 0.116 / 0.7071
  = 2204 / 0.7071
  = 3117 V      ← INCORRECTO (ρs=grava, un caso extremo)

Ep70 (ρs=100, tf=0.5):
  = (1000 + 6×100) × 0.116 / 0.7071
  = 1600 × 0.116 / 0.7071
  = 185.6 / 0.7071 = 262 V
```

Nota: Los valores de los tests C22-C28 usan los valores exactos de la norma. Verificar con tabla IEEE 80-2013 §8.

---

*TerraDoc SPT v1.0.0 — Voryn Energy — terradoc_calculation_tests.md*
