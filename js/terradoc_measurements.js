/**
 * TerraDoc SPT — terradoc_measurements.js
 * * Voryn Energy — TerraDoc module
 * Methods: Wenner (IEEE 81 §7.3.1), Schlumberger-Palmer (§7.3.2), Single-rod (§7.4)
 * Soil classification: Types A–E
 */

'use strict';

const W_SPACINGS = [1, 2, 4, 6, 8]; // Default Wenner spacings (m)

/* ════════════════════════════════════════════════
   WENNER METHOD — IEEE 81 §7.3.1
   ρ = 2π·a·R  (Ω·m)
   Depth of investigation ≈ a/2
════════════════════════════════════════════════ */
function initWenner() {
  const tbody = document.getElementById('wenner-body');
  if (!tbody) return;
  tbody.innerHTML = '';
  W_SPACINGS.forEach(a => {
    const row = tbody.insertRow();
    row.innerHTML = `<td style="font-family:var(--mono)">${a}</td>
<td><input type="number" step="0.01" placeholder="Ej: 4.25" oninput="recalcWenner()"
  style="width:90px;padding:4px 6px;border:1px solid var(--border2);border-radius:3px;font-family:var(--mono)"></td>
<td class="rho-val" id="rho-w-${a}">—</td>
<td id="cls-w-${a}">—</td>`;
  });
}

function addWennerRow() {
  const tbody = document.getElementById('wenner-body');
  if (!tbody) return;
  const n = tbody.rows.length + 1;
  const row = tbody.insertRow();
  row.innerHTML = `<td><input type="number" step="0.5" placeholder="a (m)"
    style="width:60px;padding:4px 6px;border:1px solid var(--border2);border-radius:3px;font-family:var(--mono)" oninput="recalcWenner()"></td>
<td><input type="number" step="0.01" placeholder="R (Ω)" oninput="recalcWenner()"
  style="width:90px;padding:4px 6px;border:1px solid var(--border2);border-radius:3px;font-family:var(--mono)"></td>
<td class="rho-val" id="rho-ex-${n}">—</td>
<td id="cls-ex-${n}">—</td>`;
}

function recalcWenner() {
  const rows = document.querySelectorAll('#wenner-body tr');
  const vals = [];

  rows.forEach((row, i) => {
    const inputs = row.querySelectorAll('input');
    let a, R;

    if (inputs.length >= 2) {
      // Extra row: both a and R are inputs
      a = parseFloat(inputs[0].value) || 0;
      R = parseFloat(inputs[1].value) || 0;
    } else if (inputs.length === 1) {
      // Default row: a is fixed text in td[0], R is the single input
      a = parseFloat(row.cells[0]?.textContent) || W_SPACINGS[i] || 0;
      R = parseFloat(inputs[0].value) || 0;
    } else { return; }

    if (!a || !R) return;

    // IEEE 81 §7.3.1: ρ = 2π·a·R
    const rho = +(2 * Math.PI * a * R).toFixed(1);

    const rid = row.cells[2]?.id;
    const cid = row.cells[3]?.id;
    if (rid) document.getElementById(rid).textContent = rho + ' Ω·m';
    if (cid) document.getElementById(cid).innerHTML = soilBadge(rho);
    vals.push(rho);
  });

  updateMeasurementStats(vals);
}

/* ════════════════════════════════════════════════
   SCHLUMBERGER-PALMER METHOD — IEEE 81 §7.3.2
   ρ = π·(AB/2)²·R / (MN/2)  (Ω·m)
   Allows greater investigation depth than Wenner
════════════════════════════════════════════════ */
function addSchlumRow() {
  const tbody = document.getElementById('schlum-body');
  if (!tbody) return;
  const n = tbody.rows.length + 1;
  const row = tbody.insertRow();
  row.innerHTML = `<td><input type="number" step="0.5" placeholder="AB/2"
    style="width:70px;padding:4px 6px;border:1px solid var(--border2);border-radius:3px;font-family:var(--mono)" oninput="recalcSchlum()"></td>
<td><input type="number" step="0.1" placeholder="MN/2"
    style="width:70px;padding:4px 6px;border:1px solid var(--border2);border-radius:3px;font-family:var(--mono)" oninput="recalcSchlum()"></td>
<td><input type="number" step="0.01" placeholder="R (Ω)" oninput="recalcSchlum()"
  style="width:90px;padding:4px 6px;border:1px solid var(--border2);border-radius:3px;font-family:var(--mono)"></td>
<td class="rho-val" id="rho-s-${n}">—</td>`;
}

function recalcSchlum() {
  const rows = document.querySelectorAll('#schlum-body tr');
  const vals = [];

  rows.forEach((row, i) => {
    const ins = row.querySelectorAll('input');
    if (ins.length < 3) return;
    const ab = parseFloat(ins[0].value) || 0;
    const mn = parseFloat(ins[1].value) || 0;
    const R = parseFloat(ins[2].value) || 0;
    if (!ab || !mn || !R) return;

    // IEEE 81 §7.3.2: ρ = π·(AB/2)²·R / (MN/2)
    const rho = +(Math.PI * (ab ** 2) / mn * R).toFixed(1);
    const cel = document.getElementById('rho-s-' + (i + 1));
    if (cel) cel.textContent = rho + ' Ω·m';
    vals.push(rho);
  });

  updateMeasurementStats(vals);
}

/* ════════════════════════════════════════════════
   SINGLE-ROD METHOD — IEEE 81 §7.4 (Fall of Potential)
   ρ = 4π·L·R / (ln(8L/d) − 1)  (Ω·m)
════════════════════════════════════════════════ */
function calcVarilla1() {
  const L = parseFloat(document.getElementById('v1-L')?.value) || 2.4;
  const d = parseFloat(document.getElementById('v1-d')?.value) || 0.016;
  const R = parseFloat(document.getElementById('v1-R')?.value) || 0;
  const out = document.getElementById('v1-rho');
  if (!R) { if (out) out.value = '—'; return; }

  // IEEE 81 §7.4: ρ = 4π·L·R / (ln(8L/d) − 1)
  const rho = +(4 * Math.PI * L * R / (Math.log(8 * L / d) - 1)).toFixed(1);
  if (out) out.value = rho + ' Ω·m';
  updateMeasurementStats([rho]);
}

/* ════════════════════════════════════════════════
   STATISTICS & SOIL CLASSIFICATION
════════════════════════════════════════════════ */
function updateMeasurementStats(vals) {
  if (!vals.length) {
    ['s-avg','s-min','s-max','s-cv'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '—';
    });
    return;
  }

  const avg = vals.reduce((s, v) => s + v, 0) / vals.length;
  const std = Math.sqrt(vals.reduce((s, v) => s + (v - avg) ** 2, 0) / vals.length);
  ST.rho = avg;
  ST.measurements = vals;

  const setText = (id, t) => { const el = document.getElementById(id); if (el) el.textContent = t; };
  setText('s-avg', avg.toFixed(1) + ' Ω·m');
  setText('s-min', Math.min(...vals).toFixed(1) + ' Ω·m');
  setText('s-max', Math.max(...vals).toFixed(1) + ' Ω·m');
  setText('s-cv', avg > 0 ? ((std / avg) * 100).toFixed(1) + '%' : '—');

  const sd = soilDesc(avg);
  const el = document.getElementById('soil-class-box');
  if (el) {
    el.innerHTML = '<span class="badge ' + sd.badge + '" style="font-size:12px;padding:3px 10px;margin-bottom:6px;display:inline-block">' + sd.name + '</span>' +
      '<br><span style="font-size:12px;color:var(--ink2)">' + sd.desc + '</span>' +
      '<br><span style="font-size:11px;color:var(--ink3);margin-top:4px;display:block">ρ promedio = <b>' + avg.toFixed(1) + ' Ω·m</b></span>';
  }

  // Always sync to suelo section
  const rhoEq = document.getElementById('rho-eq');
  if (rhoEq) rhoEq.value = avg.toFixed(0);
}

/* ════════════════════════════════════════════════
   SOIL CLASSIFICATION HELPERS
════════════════════════════════════════════════ */
function soilBadge(rho) {
  const sd = soilDesc(rho);
  return '<span class="badge ' + sd.badge + '">' + (rho < 10 ? 'Tipo A' : rho < 100 ? 'Tipo B' : rho < 300 ? 'Tipo C' : rho < 1000 ? 'Tipo D' : 'Tipo E') + ' — ' + rho + ' Ω·m</span>';
}

function soilDesc(rho) {
  if (rho < 10) return { badge: 'ok', name: 'Tipo A — Excelente', desc: 'Terreno pantanoso, arcilla muy húmeda.' };
  if (rho < 100) return { badge: 'ok', name: 'Tipo B — Bueno', desc: 'Arcilla, suelo agrícola, arena fina húmeda.' };
  if (rho < 300) return { badge: 'info', name: 'Tipo C — Moderado', desc: 'Arena, turba, suelo superficial seco.' };
  if (rho < 1000) return { badge: 'warn', name: 'Tipo D — Pobre', desc: 'Roca meteorizada, grava, arena seca.' };
  return { badge: 'fail', name: 'Tipo E — Muy pobre', desc: 'Roca dura, arena muy seca.' };
}
