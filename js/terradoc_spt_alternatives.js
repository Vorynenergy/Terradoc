/**
 * TerraDoc SPT — terradoc_spt_alternatives.js
 * * Voryn Energy — TerraDoc module
 * 25 SPT configurations: VARILLA(×10), ANILLO(×11), TRIADA(×4)
 */

'use strict';

/* ════════════════════════════════════════════════
   ALTERNATIVES EVALUATOR
════════════════════════════════════════════════ */
function evalAlternatives() {
  runCalcs(); // Ensure all values are current

  const rho = ST.rho || 100;
  const Ig = ST.Ig || 2500;
  const Ep = ST.Ep70 || 800;
  const Ec = ST.Ec70 || 400;
  const norm = LATAM_ENGINE[ST.country] || LATAM_ENGINE['CO'];
  const rgLim = norm.rgLimits.apoyo || 25;

  const results = [];
  let firstOk = null;

  CONFIGS.forEach(cfg => {
    const Rg = +(cfg.Rf * rho).toFixed(3);
    const GPR = +(Ig * Rg).toFixed(0);
    // Heuristic voltage estimates (IEEE 80 §16.5 simplified)
    const Estep = +(GPR * 0.15).toFixed(0);
    const Etouch = +(GPR * 0.25).toFixed(0);
    const rgOk = Rg <= rgLim;
    const stepOk = Estep <= Ep;
    const touchOk = Etouch <= Ec;
    const passes = rgOk && stepOk && touchOk;
    const r = { ...cfg, Rg, GPR, Estep, Etouch, passes };
    results.push(r);
    if (passes && !firstOk) firstOk = r;
  });

  // Sort: safety first → complexity → material quantity
  results.sort((a, b) => {
    if (a.passes && !b.passes) return -1;
    if (!a.passes && b.passes) return 1;
    if (a.passes && b.passes) {
      if (a.complexity !== b.complexity) return a.complexity - b.complexity;
      return a.mat_m - b.mat_m;
    }
    return a.Rg - b.Rg;
  });

  const rec = results.filter(r => r.passes)[0] || null;
  ST.recommended = rec;
  ST.allResults = results;

  // Render table
  renderAltTable(results, rec, 'all');

  // Auto-select recommended
  if (rec) selectConfig(rec.id);

  // Show/hide mesh panel
  const mallaPanel = document.getElementById('malla-panel');
  const selPanel = document.getElementById('sel-config-panel');

  if (!rec) {
    if (mallaPanel) mallaPanel.style.display = '';
    if (selPanel) selPanel.style.display = '';
    renderMallaSvg();
    const sc = document.getElementById('svg-container');
    const st = document.getElementById('svg-title');
    if (sc) sc.innerHTML = '';
    if (st) st.textContent = 'Ninguna configuración estándar cumple — ver malla especial';
  } else {
    if (mallaPanel) mallaPanel.style.display = 'none';
  }

  // Alert summary
  const passN = results.filter(r => r.passes).length;
  const altAlert = document.getElementById('alt-alert');
  if (altAlert) {
    altAlert.innerHTML = rec
      ? '<div class="alert ok"><span class="ai">✓</span><div><strong>' + passN + '/25 configuraciones cumplen los requisitos técnicos.</strong> Recomendada: <b>' + rec.id + '</b> — ' + rec.desc + ' · Rg = ' + rec.Rg.toFixed(2) + ' Ω · Complejidad: ' + rec.complexity + '/4</div></div>'
      : '<div class="alert danger"><span class="ai">⚠</span><div><strong>Ninguna de las 25 configuraciones cumple (ρ = ' + rho.toFixed(0) + ' Ω·m)</strong>Se activa generador de malla especial. Considere: bentonita, grafito, reducción de tf o malla a medida.</div></div>';
  }
}

/* ════════════════════════════════════════════════
   TABLE RENDERER
════════════════════════════════════════════════ */
function renderAltTable(results, rec, filter) {
  const tbody = document.getElementById('alt-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  results.filter(r => filter === 'all' || r.type === filter).forEach(r => {
    const isRec = rec && r.id === rec.id;
    const tr = tbody.insertRow();
    if (isRec) tr.classList.add('rec-row');
    if (!r.passes) tr.classList.add('fail-row');
    tr.innerHTML =
      '<td><span class="badge info" style="font-size:10px">' + r.id + '</span>' +
      (isRec ? '<span class="badge rec" style="margin-left:3px;font-size:9px">REC</span>' : '') + '</td>' +
      '<td style="font-size:11.5px">' + r.desc + '</td>' +
      '<td style="font-family:var(--mono)">' + r.Rg.toFixed(2) + '</td>' +
      '<td style="font-family:var(--mono)">' + r.GPR + '</td>' +
      '<td style="font-size:11px">' + r.Estep + ' / ' + (ST.Ep70 || '—') + ' V</td>' +
      '<td style="font-size:11px">' + r.Etouch + ' / ' + (ST.Ec70 || '—') + ' V</td>' +
      '<td style="font-family:var(--mono)">' + r.mat_m + ' m</td>' +
      '<td><span class="badge neutral">' + r.complexity + '/4</span></td>' +
      '<td><span class="badge ' + (r.passes ? 'ok' : 'fail') + '">' + (r.passes ? '✓ SÍ' : '✗ NO') + '</span></td>' +
      '<td><button class="btn xs" onclick="selectConfig(\'' + r.id + '\')">SVG</button></td>';
  });
}

/* ════════════════════════════════════════════════
   FILTER BUTTONS
════════════════════════════════════════════════ */
function filterAlts(f) {
  ['all', 'VARILLA', 'ANILLO', 'TRIADA'].forEach(k => {
    const el = document.getElementById('fb-' + k);
    if (el) {
      el.style.background = k === f ? 'var(--ink)' : '#fff';
      el.style.color = k === f ? '#fff' : 'var(--ink2)';
    }
  });
  renderAltTable(ST.allResults, ST.recommended, f);
}

/* ════════════════════════════════════════════════
   CONFIG SELECTION & SVG DISPLAY
════════════════════════════════════════════════ */
function selectConfig(id) {
  ST.selectedId = id;
  const cfg = CONFIGS.find(c => c.id === id);
  const svgStr = SVGS[id] || '<svg viewBox="0 0 200 100"><text x="10" y="50" font-size="14" fill="#666">' + id + '</text></svg>';

  const selPanel = document.getElementById('sel-config-panel');
  if (selPanel) selPanel.style.display = '';

  const mallaPanel = document.getElementById('malla-panel');
  if (mallaPanel) mallaPanel.style.display = 'none';

  const svgTitle = document.getElementById('svg-title');
  if (svgTitle) svgTitle.textContent = id + ' — ' + (cfg?.desc || '');

  const svgContainer = document.getElementById('svg-container');
  if (svgContainer) svgContainer.innerHTML = svgStr;

  const norm = LATAM_ENGINE[ST.country] || LATAM_ENGINE['CO'];
  const selInfo = document.getElementById('sel-config-info');
  if (selInfo && cfg) {
    selInfo.innerHTML = `
<div class="card">
  <h3>Configuración: ${id}</h3>
  <table style="width:100%;font-size:12px;border-collapse:collapse">
    <tr style="border-bottom:1px solid var(--border)"><td style="padding:5px 0;color:var(--ink3)">Descripción</td><td style="font-weight:500">${cfg.desc}</td></tr>
    <tr style="border-bottom:1px solid var(--border)"><td style="padding:5px 0;color:var(--ink3)">Tipo</td><td>${cfg.type}</td></tr>
    <tr style="border-bottom:1px solid var(--border)"><td style="padding:5px 0;color:var(--ink3)">Varillas/Electrodos</td><td style="font-family:var(--mono)">${cfg.rods}</td></tr>
    <tr style="border-bottom:1px solid var(--border)"><td style="padding:5px 0;color:var(--ink3)">Conductor enterrado</td><td style="font-family:var(--mono)">${cfg.mat_m} m</td></tr>
    <tr style="border-bottom:1px solid var(--border)"><td style="padding:5px 0;color:var(--ink3)">Rg estimada</td><td style="font-family:var(--mono);color:var(--accent);font-weight:600">${(cfg.Rf * (ST.rho || 100)).toFixed(2)} Ω</td></tr>
    <tr><td style="padding:5px 0;color:var(--ink3)">Complejidad</td><td><span class="badge neutral">${cfg.complexity}/4</span></td></tr>
  </table>
  <div style="margin-top:10px;font-size:12px;color:var(--ink3)">Criterio: seguridad humana → cumplimiento ${norm.standards[0]} → menor complejidad constructiva.</div>
</div>`;
  }
}
