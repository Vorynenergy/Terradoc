/**
 * TerraDoc SPT — terradoc_svg_renderer.js
 * * Voryn Energy — TerraDoc module
 * SVG catalog (25 diagrams), zoom, parametric mesh (IEEE 80 App.B Eq.57)
 */

'use strict';

/* ════════════════════════════════════════════════
   SVG ZOOM
════════════════════════════════════════════════ */
function zoomSvg(delta) {
  if (delta === 0) { ST.svgZoom = 1; }
  else ST.svgZoom = Math.max(0.3, Math.min(3, ST.svgZoom + delta));
  const svg = document.querySelector('#svg-container svg');
  if (svg) svg.style.transform = 'scale(' + ST.svgZoom + ')';
}

/* ════════════════════════════════════════════════
   PARAMETRIC MESH GENERATOR
   Rg (Schwarz simplified) — IEEE 80 App. B Eq. 57
   Rg = ρ·(1/(4·√(A/π)) + 1/(L·(1+1/(1+h·√(20/A)))))
════════════════════════════════════════════════ */
function renderMallaSvg() {
  const W = parseFloat(document.getElementById('m-w')?.value) || 10;
  const L = parseFloat(document.getElementById('m-l')?.value) || 10;
  const sp = parseFloat(document.getElementById('m-sp')?.value) || 2;
  const h = parseFloat(document.getElementById('m-h')?.value) || 0.5;
  const rods = parseInt(document.getElementById('m-rods')?.value) || 4;
  const rho = ST.rho || 100;

  // Rg mesh — IEEE 80 App. B Eq. 57 (simplified)
  const A = W * L;
  const Rg_malla = +(rho * (1 / (4 * Math.sqrt(A / Math.PI)) + 1 / (L + W) * (1 + 1 / (1 + h * Math.sqrt(20 / A))))).toFixed(3);

  const norm = LATAM_ENGINE[ST.country] || LATAM_ENGINE['CO'];
  const rgLim = norm.rgLimits.apoyo || 25;
  const rgOk = Rg_malla <= rgLim;

  const out = document.getElementById('m-rg');
  if (out) out.value = Rg_malla + ' Ω ' + (rgOk ? '✓' : '✗');

  // Generate SVG
  const pw = 400, ph = 300;
  const scale = Math.min((pw - 40) / W, (ph - 40) / L);
  const ox = 20, oy = 20;
  const fw = W * scale, fh = L * scale;

  let lines = '';
  // Grid conductors
  for (let x = 0; x <= W; x += sp) {
    const sx = ox + x * scale;
    lines += `<line x1="${sx.toFixed(1)}" y1="${oy}" x2="${sx.toFixed(1)}" y2="${(oy + fh).toFixed(1)}" stroke="var(--accent-t)" stroke-width="2"/>`;
  }
  for (let y = 0; y <= L; y += sp) {
    const sy = oy + y * scale;
    lines += `<line x1="${ox}" y1="${sy.toFixed(1)}" x2="${(ox + fw).toFixed(1)}" y2="${sy.toFixed(1)}" stroke="var(--accent-t)" stroke-width="2"/>`;
  }

  // Perimeter rods
  let rodMarkers = '';
  for (let i = 0; i < rods; i++) {
    const angle = (2 * Math.PI * i / rods);
    const rx = ox + fw / 2 + Math.cos(angle) * fw / 2 * 0.88;
    const ry = oy + fh / 2 + Math.sin(angle) * fh / 2 * 0.88;
    rodMarkers += `<circle cx="${rx.toFixed(1)}" cy="${ry.toFixed(1)}" r="6" fill="var(--ink)" stroke="var(--accent)" stroke-width="1.5"/>`;
  }

  // Boundary
  const boundary = `<rect x="${ox}" y="${oy}" width="${fw.toFixed(1)}" height="${fh.toFixed(1)}" fill="none" stroke="var(--ink2)" stroke-width="1.5" stroke-dasharray="4 3"/>`;

  // Dimension annotations
  const annotations = `
    <text x="${ox + fw / 2}" y="${oy + fh + 22}" text-anchor="middle" font-family="DM Mono,monospace" font-size="11" fill="var(--ink3)">W = ${W} m</text>
    <text x="${ox - 12}" y="${oy + fh / 2}" text-anchor="middle" transform="rotate(-90,${ox - 12},${oy + fh / 2})" font-family="DM Mono,monospace" font-size="11" fill="var(--ink3)">L = ${L} m</text>
    <text x="${ox}" y="${oy + fh + 38}" font-family="DM Mono,monospace" font-size="10" fill="var(--ink3)">Esp. = ${sp} m · h = ${h} m · ${rods} varillas · Rg ≈ ${Rg_malla} Ω</text>`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${pw} ${ph + 45}">
    ${boundary}${lines}${rodMarkers}${annotations}
  </svg>`;

  const container = document.getElementById('malla-svg-container');
  if (container) container.innerHTML = svg;
}
