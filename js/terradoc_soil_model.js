/**
 * TerraDoc SPT — terradoc_soil_model.js
 * * Voryn Energy — TerraDoc module
 * LATAM Normative Engine (17 countries), Sunde two-layer model
 */

'use strict';

/* ════════════════════════════════════════════════
   LATAM NORMATIVE ENGINE
════════════════════════════════════════════════ */
function setCountry(code) {
  ST.country = code;
  const n = LATAM_ENGINE[code];
  if (!n) return;

  const setText = (id, t) => { const el = document.getElementById(id); if (el) el.textContent = t; };
  const cd = document.getElementById('country-display');
  if (cd) cd.textContent = n.name;

  const tags = document.getElementById('norm-tags');
  if (tags) tags.innerHTML = n.standards.map(s => '<span class="norm-tag">' + s + '</span>').join('');

  setText('ph-pais', n.flag + ' ' + n.name);

  const infoBox = document.getElementById('country-info-box');
  if (infoBox) {
    infoBox.innerHTML = `
<div class="alert ${n.validated ? 'ok' : 'warn'}">
  <span class="ai">${n.flag}</span>
  <div>
    <strong>${n.name} — ${n.validated ? 'Normativa validada' : 'Normativa en revisión (advertencia técnica)'}</strong>
    Normas: ${n.standards.join(' · ')}<br>
    Rg máx. subestación: <b>${n.rgLimits.subestacion} Ω</b> · apoyo: <b>${n.rgLimits.apoyo} Ω</b> · edificio: <b>${n.rgLimits.edificio} Ω</b><br>
    ${n.disclaimer}
    ${!n.validated ? '<br><em>⚠ Esta normativa no ha sido validada en la plataforma. Úsela como referencia orientativa.</em>' : ''}
  </div>
</div>`;
  }

  const modal = document.getElementById('country-modal');
  if (modal) modal.style.display = 'none';
}

/* ════════════════════════════════════════════════
   SOIL MODEL — HOMOGENEOUS
════════════════════════════════════════════════ */
function toggleSoilModel() {
  const v = document.getElementById('soil-type')?.value;
  const hom = document.getElementById('soil-hom');
  const dc = document.getElementById('soil-dc');
  if (hom) hom.style.display = v === 'hom' ? '' : 'none';
  if (dc) dc.style.display = v === 'dc' ? '' : 'none';
  if (v === 'dc') calcRhoDC();
}

function updateRhoEq() {
  const rho = parseFloat(document.getElementById('rho-eq')?.value) || 0;
  ST.rho = rho;
}

/* ════════════════════════════════════════════════
   SOIL MODEL — TWO LAYERS (Sunde approximation)
   ρ_eq = ρ1·(1 - e^(-h1/2)) + ρ2·e^(-h1/2)
   Valid for preliminary estimates. For accuracy use CDEGS/RESAP.
════════════════════════════════════════════════ */
function calcRhoDC() {
  const r1 = parseFloat(document.getElementById('rho1')?.value) || 100;
  const h1 = parseFloat(document.getElementById('h1')?.value) || 2;
  const r2 = parseFloat(document.getElementById('rho2')?.value) || 300;

  // Sunde simplified equivalent
  const rhoEq = +(r1 * (1 - Math.exp(-h1 / 2)) + r2 * Math.exp(-h1 / 2)).toFixed(1);

  const out = document.getElementById('rho-dc-eq');
  if (out) out.value = rhoEq + ' Ω·m';
  ST.rho = rhoEq;

  const box = document.getElementById('soil-summary-box');
  if (box) {
    const k = r2 / r1;
    const typeStr = k > 1.5 ? 'Tipo H (capa profunda más resistiva — desfavorable)' :
                   k < 0.67 ? 'Tipo K (capa profunda menos resistiva — favorable)' :
                   'Tipo A (suelo aproximadamente homogéneo)';
    box.innerHTML = `<div class="alert info"><span class="ai">📐</span><div>
<strong>Modelo dos capas — Sunde</strong>
ρ₁ = ${r1} Ω·m (h₁ = ${h1} m) · ρ₂ = ${r2} Ω·m<br>
K = ρ₂/ρ₁ = ${k.toFixed(2)} → ${typeStr}<br>
ρ equivalente estimada: <b>${rhoEq} Ω·m</b>
<br><em style="font-size:10.5px;opacity:.7">Nota: Para mayor precisión use RESAP (CDEGS) o SafeGrid con datos de campo.</em>
</div></div>`;
  }
}

/* ════════════════════════════════════════════════
   CURRENT DESIGN — IEEE 80 §15
   Ig = If · Sf · Df
════════════════════════════════════════════════ */
function updateId() {
  const If = parseFloat(document.getElementById('If')?.value) || 0;
  const Sf = parseFloat(document.getElementById('Sf')?.value) || 1.0;
  const Df = parseFloat(document.getElementById('Df')?.value) || 1.0;
  const Ig = If * Sf * Df * 1000; // kA → A

  ST.If = If; ST.Sf = Sf; ST.Df = Df; ST.Ig = Ig;

  const el = document.getElementById('Ig');
  if (el) el.value = Ig > 0 ? Ig.toFixed(0) : '—';
}
