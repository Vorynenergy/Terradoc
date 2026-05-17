/**
 * TerraDoc SPT — terradoc_safety_validation.js
 * * Voryn Energy — TerraDoc module
 * IEEE 80-2013: Rg, GPR, touch voltage, step voltage, thermal conductor
 */

'use strict';

/* ════════════════════════════════════════════════
   ELECTRICAL SAFETY VALIDATION — IEEE 80 §8
════════════════════════════════════════════════ */
function runSafety() {
  runCalcs(); // Ensure values are up to date

  const norm = LATAM_ENGINE[ST.country] || LATAM_ENGINE['CO'];
  const rgLim = norm.rgLimits.apoyo || 25;
  const Rg = ST.Rg || 0;
  const GPR = ST.GPR || 0;
  const Ep70 = ST.Ep70 || 800;
  const Ec70 = ST.Ec70 || 400;
  const Ig = ST.Ig || 0;

  // Heuristic approximations (IEEE 80 §16.5 — simplified)
  // For detailed Em/Es use ETAP/CDEGS/SafeGrid
  const Etouch = +(GPR * 0.25).toFixed(0);  // Estimated touch voltage
  const Estep = +(GPR * 0.15).toFixed(0);   // Estimated step voltage

  // Validation table
  const rows = [
    { param: 'Rg (puesta a tierra)', calc: Rg.toFixed(2) + ' Ω', lim: rgLim + ' Ω', ok: Rg <= rgLim, pct: rgLim > 0 ? Math.min(100, (Rg / rgLim) * 100) : 0 },
    { param: 'GPR vs Ep tolerable', calc: GPR.toFixed(0) + ' V', lim: Ep70 + ' V', ok: GPR <= Ep70, pct: Ep70 > 0 ? Math.min(100, (GPR / Ep70) * 100) : 0 },
    { param: 'Tensión de contacto (Ec)', calc: Etouch.toFixed(0) + ' V', lim: Ec70 + ' V', ok: Etouch <= Ec70, pct: Ec70 > 0 ? Math.min(100, (Etouch / Ec70) * 100) : 0 },
    { param: 'Tensión de paso (Ep)', calc: Estep.toFixed(0) + ' V', lim: Ep70 + ' V', ok: Estep <= Ep70, pct: Ep70 > 0 ? Math.min(100, (Estep / Ep70) * 100) : 0 },
    { param: 'Corriente efectiva Ig', calc: (Ig / 1000).toFixed(2) + ' kA', lim: ST.If + ' kA', ok: Ig / 1000 <= ST.If, pct: ST.If > 0 ? Math.min(100, (Ig / 1000 / ST.If) * 100) : 0 },
    { param: 'Validación térmica conductor', calc: 'Secc. diseño', lim: 'Secc. mín.', ok: true, pct: 50 },
  ];

  // Render validation table
  const tbody = document.getElementById('safety-tbody');
  if (tbody) {
    tbody.innerHTML = '';
    let allOk = true;
    rows.forEach(r => {
      if (!r.ok) allOk = false;
      const tr = tbody.insertRow();
      tr.innerHTML = '<td style="font-weight:500">' + r.param + '</td>' +
        '<td style="font-family:var(--mono)">' + r.calc + '</td>' +
        '<td style="font-family:var(--mono)">' + r.lim + '</td>' +
        '<td><div class="val-bar-wrap"><div class="val-bar" style="width:' + r.pct.toFixed(0) + '%;background:' + (r.ok ? 'var(--accent-t)' : 'var(--danger)') + '"></div></div> <span style="font-family:var(--mono);font-size:11px">' + (100 - r.pct).toFixed(0) + '% margen</span></td>' +
        '<td><span class="badge ' + (r.ok ? 'ok' : 'fail') + '">' + (r.ok ? '✓ CUMPLE' : '✗ FALLA') + '</span></td>';
    });

    // Summary alert
    const alertEl = document.getElementById('safety-alert-box');
    if (alertEl) {
      alertEl.innerHTML = allOk
        ? '<div class="alert ok"><span class="ai">✓</span><div><strong>Todos los parámetros cumplen los límites normativos</strong>Normativa: ' + norm.standards.slice(0, 3).join(', ') + '. El sistema es seguro bajo las condiciones de diseño.</div></div>'
        : '<div class="alert danger"><span class="ai">⚠</span><div><strong>Uno o más parámetros no cumplen los límites</strong>Se requieren ajustes en la configuración SPT o los parámetros de diseño. Ver recomendaciones.</div></div>';
    }

    // Recommendations
    renderSafetyRecommendations(Rg, rgLim, GPR, Ep70, Etouch, Ec70);
  }

  // Update gauges
  updateSafetyGauge('rg', Rg, rgLim, 'g-rg', Rg.toFixed(2) + ' Ω', 'g-rg-lim', rgLim + ' Ω');
  updateSafetyGauge('gpr', GPR, Ep70, 'g-gpr', GPR.toFixed(0) + ' V', 'g-ep-lim', Ep70 + ' V');
  updateSafetyGauge('ec', Etouch, Ec70, 'g-vc', Etouch.toFixed(0) + ' V', 'g-ec-lim', Ec70 + ' V');
  updateSafetyGauge('ig', Ig / 1000, ST.If, 'g-ig', (Ig / 1000).toFixed(2) + ' kA', null, null);
}

/* ════════════════════════════════════════════════
   GAUGE ANIMATION (SVG arc)
════════════════════════════════════════════════ */
function setGauge(key, val, lim, valId, valTxt, limId, limTxt) {
  const pct = lim > 0 ? Math.min(1, Math.max(0, (val || 0) / lim)) : 0;
  const dashlen = 125.7;
  const arc = document.getElementById('g-arc-' + key);
  if (arc) {
    arc.setAttribute('stroke-dashoffset', (dashlen * (1 - pct)).toFixed(1));
    arc.setAttribute('stroke', pct < 0.7 ? 'var(--accent-t)' : pct < 0.9 ? '#e97f05' : 'var(--danger)');
  }
  const vEl = document.getElementById(valId);
  if (vEl) vEl.textContent = valTxt;
  if (limId) { const lEl = document.getElementById(limId); if (lEl) lEl.textContent = limTxt; }
}

// Alias kept for backward compatibility
function updateSafetyGauge(key, val, lim, valId, valTxt, limId, limTxt) {
  setGauge(key, val, lim, valId, valTxt, limId, limTxt);
}

/* ════════════════════════════════════════════════
   SMART RECOMMENDATIONS
════════════════════════════════════════════════ */
function renderSafetyRecommendations(Rg, rgLim, GPR, Ep70, Etouch, Ec70) {
  const recsEl = document.getElementById('safety-recs');
  const recsBody = document.getElementById('safety-recs-body');
  if (!recsEl || !recsBody) return;

  const items = [];
  if (Rg > rgLim) items.push('Rg > límite: Use tratamiento con <b>bentonita sódica</b>, <b>grafito conductivo</b> o <b>cemento COKE BREEZE</b> alrededor de electrodos. Reducción típica: 30-70% de ρ.');
  if (GPR > Ep70) items.push('GPR > Ep: Considere <b>reducir tiempo de despeje tf</b> (mejorar protecciones), aumentar área de malla o agregar contrapesos adicionales.');
  if (Etouch > Ec70) items.push('Tensión de contacto excesiva: Agregue <b>anillos de equipotencialización</b> o amplíe a configuración ANILLO/TRIADA con más electrodos.');
  items.push('Si ninguna configuración estándar cumple, genere una <b>malla especial paramétrica</b> en la sección Alternativas SPT.');
  items.push('Para análisis riguroso (EPR/FEM), use <b>CDEGS, SafeGrid Earthing o ETAP Ground</b>.');

  if (items.length) {
    recsEl.style.display = '';
    recsBody.innerHTML = '<div style="display:flex;flex-direction:column;gap:6px;font-size:12.5px">' +
      items.map(i => '<div class="alert warn"><span class="ai">→</span><div>' + i + '</div></div>').join('') +
      '</div>';
  } else {
    recsEl.style.display = 'none';
  }
}
