/**
 * TerraDoc SPT — terradoc_ieee80_calculations.js
 * * Voryn Energy — TerraDoc module
 * IEEE 80-2013: §8 tolerables, §11.3 thermal, §15 design current, App.B Schwarz
 */

'use strict';

/* ════════════════════════════════════════════════
   CONDUCTOR THERMAL CONSTANTS — IEEE 80 §11.3 Table 1
════════════════════════════════════════════════ */
const CONDUCTOR_K = {
  Cu: { K: 226, Tmax: 450, label: 'Cobre desnudo' },
  CuSW: { K: 200, Tmax: 400, label: 'Cu estañado 30%' },
  Al: { K: 148, Tmax: 350, label: 'Aluminio desnudo' },
  SS: { K: 70, Tmax: 300, label: 'Acero inoxidable' }
};

/* ════════════════════════════════════════════════
   MAIN CALCULATION ENGINE
════════════════════════════════════════════════ */
function runCalcs() {
  const rho = parseFloat(document.getElementById('rho-eq')?.value) || ST.rho || 100;
  const If = parseFloat(document.getElementById('If')?.value) || 2.5;
  const Sf = parseFloat(document.getElementById('Sf')?.value) || 1.0;
  const Df = parseFloat(document.getElementById('Df')?.value) || 1.0;
  const tf = parseFloat(document.getElementById('tf')?.value) || 0.5;
  const rhos = parseFloat(document.getElementById('rhos')?.value) || 3000;

  // Store in state
  ST.rho = rho; ST.If = If; ST.Sf = Sf; ST.Df = Df; ST.tf = tf; ST.rhos = rhos;

  // Design current — IEEE 80 §15: Ig = If·Sf·Df (A)
  const Ig = If * Sf * Df * 1000;
  ST.Ig = Ig;

  // Normative constants from LATAM engine
  const norm = LATAM_ENGINE[ST.country] || LATAM_ENGINE['CO'];
  const K70 = norm.K70 || 0.116;
  const K50 = norm.K50 || 0.157;
  const sqrtTf = Math.sqrt(tf);

  // Tolerable step voltage — IEEE 80 §8.3 Eq. 29
  // Ep = (1000 + 6·ρs) · SB / √tf
  const Ep70 = +((1000 + 6 * rhos) * K70 / sqrtTf).toFixed(0);
  const Ep50 = +((1000 + 6 * rhos) * K50 / sqrtTf).toFixed(0);

  // Tolerable touch voltage — IEEE 80 §8.3 Eq. 32
  // Ec = (1000 + 1.5·ρs) · SB / √tf
  const Ec70 = +((1000 + 1.5 * rhos) * K70 / sqrtTf).toFixed(0);
  const Ec50 = +((1000 + 1.5 * rhos) * K50 / sqrtTf).toFixed(0);

  ST.Ep70 = Ep70; ST.Ec70 = Ec70; ST.Ep50 = Ep50; ST.Ec50 = Ec50;

  // Schwarz Rg reference (simplified IEEE 80 App. B Eq. 57)
  // Assumes area ~50 m², L_total ~Lr, h = 0.5 m
  const area = 50;
  const h = 0.5;
  const Lr = Math.PI * 2 * 1.5;
  const Rg_ref = +(rho / (4 * Math.sqrt(Math.PI / area)) + rho / Lr * (1 + 1 / (1 + h * Math.sqrt(20 / area)))).toFixed(4);
  ST.Rg = Rg_ref;

  // GPR = Ig · Rg
  const GPR = +(Ig * Rg_ref).toFixed(1);
  ST.GPR = GPR;

  ST.calcsDone = true;

  // Update UI
  const setText = (id, t) => { const el = document.getElementById(id); if (el) el.textContent = t; };
  setText('m-rho', rho.toFixed(0) + ' Ω·m');
  setText('m-Ig', Ig.toFixed(0) + ' A');
  setText('m-ep', Ep70 + ' V');
  setText('m-ec', Ec70 + ' V');
  setText('c-ep70', Ep70 + ' V');
  setText('c-ec70', Ec70 + ' V');
  setText('c-ep50', Ep50 + ' V');
  setText('c-ec50', Ec50 + ' V');

  calcThermal();
  return { rho, If, Sf, Df, tf, rhos, Ig, Ep70, Ec70, Ep50, Ec50, Rg: Rg_ref, GPR };
}

/* ════════════════════════════════════════════════
   CONDUCTOR THERMAL SIZING — IEEE 80 §11.3 Eq. 37
   A_min = I · √tf / K
════════════════════════════════════════════════ */
function calcThermal() {
  const sec = parseFloat(document.getElementById('cond-sec')?.value) || 50;
  const matKey = document.getElementById('cond-mat')?.value || 'Cu';
  const mat = CONDUCTOR_K[matKey] || CONDUCTOR_K['Cu'];

  const If = parseFloat(document.getElementById('If')?.value) || ST.If || 2.5;
  const tf = parseFloat(document.getElementById('tf')?.value) || ST.tf || 0.5;

  // Minimum conductor cross-section
  const Amin = +(If * 1000 * Math.sqrt(tf) / mat.K).toFixed(1);
  const ok = sec >= Amin;

  const setText = (id, t) => { const el = document.getElementById(id); if (el) el.textContent = t; };
  setText('c-amin', Amin + ' mm²');
  setText('c-tmax', mat.Tmax + ' °C');

  const badge = document.getElementById('c-thermal-badge');
  if (badge) badge.innerHTML = '<span class="badge ' + (ok ? 'ok' : 'fail') + '">' + (ok ? '✓ CUMPLE' : '✗ INSUFICIENTE') + '</span>';
}
