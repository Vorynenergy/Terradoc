/**
 * TerraDoc SPT — terradoc_app.js
 * Voryn Energy Platform — TerraDoc module
 * Namespace: TERRADOC_* (isolated from MecLine, DimElec, Voryn landing)
 * 
 * Entry point: loads data, initializes state, wires DOM
 * IEEE 80-2013 | IEEE 81-2012 | LATAM Normative Engine ×17
 */
'use strict';

/* ════════════════════════════════════════════════
   VORYN ENERGY — TERRADOC MODULE NAMESPACE
   Isolated from: MecLine, DimElec, Voryn Landing
   Global prefix: TERRADOC_ / ST (TerraDoc-only state)
   Integration point: window.TERRADOC_* exports
════════════════════════════════════════════════ */


/* ════════════════════════════════════════════════
   GLOBAL APPLICATION STATE
════════════════════════════════════════════════ */
const ST = {
  // Soil
  country: 'CO',
  rho: 0,
  measurements: [],
  // Network
  If: 0, Sf: 1.0, Df: 1.0, Ig: 0,
  tf: 0, rhos: 3000,
  // Results
  Ep70: 0, Ec70: 0, Ep50: 0, Ec50: 0,
  Rg: 0, GPR: 0,
  // SPT
  selectedId: null,
  allResults: [],
  recommended: null,
  // Flags
  calcsDone: false,
  svgZoom: 1,
};

/* ════════════════════════════════════════════════
   DATA CACHES (loaded from JSON or embedded)
════════════════════════════════════════════════ */
let LATAM_ENGINE = {};
let SVGS = {};
let CONFIGS = [];

/* ════════════════════════════════════════════════
   DEMO TEMPLATES (all fictitious — no real data)
════════════════════════════════════════════════ */
const DEMOS = {
  solar: {
    nombre: 'Planta Solar Fotovoltaica 1 MWp — Campo Norte',
    empresa: 'Energía Renovable Demo S.A.S.', city: 'Municipio Demo', dpto: 'Región Demo',
    tension: '13.2 kV', tipo: 'Parque solar', or: 'Operador de red (demo)',
    prof: 'Ing. Demo Apellido', mat: 'XX-0000-000', rev: '01', fecha: '2025-10-15',
    If: '2.0', tf: '0.5', rhos: '3000', rho: 130, Rs: [6.5, 4.8, 3.2, 2.7, 2.1]
  },
  subest: {
    nombre: 'Subestación Transformadora MT/BT 33/13.2 kV',
    empresa: 'Distribuidora Demo S.A.', city: 'Ciudad Demo', dpto: 'Departamento Demo',
    tension: '33 kV', tipo: 'Subestación MT/BT', or: 'Operador regional (demo)',
    prof: 'Ing. Demo Apellido', mat: 'XX-0000-001', rev: '00', fecha: '2025-11-01',
    If: '3.5', tf: '0.6', rhos: '3000', rho: 180, Rs: [9.2, 6.5, 4.8, 3.9, 3.1]
  },
  linea: {
    nombre: 'Apoyo N° 48 Línea MT 13.2 kV — Tramo Norte',
    empresa: 'Red de Distribución Demo S.A.', city: 'Municipio Demo', dpto: 'Región Demo',
    tension: '13.2 kV', tipo: 'Apoyo línea MT', or: 'Distribuidora demo',
    prof: 'Ing. Demo Apellido', mat: 'XX-0000-002', rev: '00', fecha: '2025-09-20',
    If: '1.8', tf: '0.4', rhos: '2500', rho: 95, Rs: [4.8, 3.4, 2.5, 2.0, 1.6]
  },
  edificio: {
    nombre: 'Sistema de Puesta a Tierra — Edificio Industrial Demo',
    empresa: 'Industrial Demo Ltda.', city: 'Ciudad Demo', dpto: 'Región Demo',
    tension: 'BT ≤ 1 kV', tipo: 'Edificio industrial', or: 'Propietario privado',
    prof: 'Ing. Demo Apellido', mat: 'XX-0000-003', rev: '00', fecha: '2025-08-15',
    If: '1.2', tf: '0.3', rhos: '1000', rho: 70, Rs: [3.5, 2.5, 1.8, 1.5, 1.2]
  },
  datacenter: {
    nombre: 'Sistema SPT — Data Center Tier III Demo',
    empresa: 'Tech Cloud Demo S.A.', city: 'Ciudad Demo', dpto: 'Región Demo',
    tension: 'BT ≤ 1 kV', tipo: 'Edificio industrial', or: 'Propietario data center',
    prof: 'Ing. Demo Apellido', mat: 'XX-0000-004', rev: '01', fecha: '2025-12-01',
    If: '1.5', tf: '0.2', rhos: '100', rho: 45, Rs: [2.3, 1.6, 1.1, 0.9, 0.7]
  }
};

/* ════════════════════════════════════════════════
   DATA LOADING
════════════════════════════════════════════════ */
async function loadData() {
  try {
    // Load countries (LATAM engine)
    const cResp = await fetch('data/terradoc_countries.json');
    LATAM_ENGINE = await cResp.json();

    // Load SPT configurations
    const cfgResp = await fetch('data/terradoc_spt_configurations.json');
    CONFIGS = await cfgResp.json();

    // Load SVG catalog
    const svgResp = await fetch('data/terradoc_svg_catalog.json');
    SVGS = await svgResp.json();

    const stdResp = await fetch('data/terradoc_standards.json');
    const stdData = await stdResp.json();
    // Standards data available globally for reports
    window.TERRADOC_STANDARDS = stdData;

    const soilResp = await fetch('data/terradoc_soil_classification.json');
    window.TERRADOC_SOIL_CLASSES = await soilResp.json();

    const matResp = await fetch('data/terradoc_materials_catalog.json');
    window.TERRADOC_MATERIALS_CATALOG = await matResp.json();

    console.log('[TerraDoc] Data loaded:', {
      countries: Object.keys(LATAM_ENGINE).length,
      configs: CONFIGS.length,
      svgs: Object.keys(SVGS).length
    });
    return true;
  } catch (err) {
    console.warn('[TerraDoc] JSON fetch failed, using embedded data:', err.message);
    // Fallback to embedded data (set by data-embed.js)
    if (typeof LATAM_ENGINE_EMBEDDED !== 'undefined') LATAM_ENGINE = LATAM_ENGINE_EMBEDDED;
    if (typeof CONFIGS_EMBEDDED !== 'undefined') CONFIGS = CONFIGS_EMBEDDED;
    if (typeof SVGS_EMBEDDED !== 'undefined') SVGS = SVGS_EMBEDDED;
    return false;
  }
}

/* ════════════════════════════════════════════════
   DEMO LOADER
════════════════════════════════════════════════ */
function loadDemo(t) {
  const d = DEMOS[t];
  if (!d) return;
  const set = (id, v) => { const el = document.getElementById(id); if (el && v !== undefined) el.value = v; };
  set('f-nombre', d.nombre); set('f-empresa', d.empresa); set('f-city', d.city);
  set('f-dpto', d.dpto); set('f-tension', d.tension); set('f-tipo', d.tipo);
  set('f-or', d.or); set('f-prof', d.prof); set('f-matricula', d.mat);
  set('f-rev', d.rev); set('f-fecha', d.fecha);
  set('If', d.If); set('tf', d.tf); set('rhos', d.rhos);
  const rhoEq = document.getElementById('rho-eq');
  if (rhoEq) { rhoEq.value = d.rho; ST.rho = d.rho; }
  syncHeader(); updateId();
  // Pre-fill Wenner readings
  const rows = document.querySelectorAll('#wenner-body tr');
  rows.forEach((row, i) => {
    const inputs = row.querySelectorAll('input');
    const inp = inputs.length === 1 ? inputs[0] : inputs[1];
    if (inp && i < d.Rs.length) inp.value = d.Rs[i];
  });
  recalcWenner();
  const infoBox = document.getElementById('country-info-box');
  if (infoBox) infoBox.innerHTML = '<div class="alert info"><span class="ai">✓</span><div><strong>Demo cargado: ' + d.nombre + '</strong>Datos ficticios para demostración — sin información real.</div></div>';
}

function clearAllFields() {
  ['f-nombre','f-empresa','f-city','f-dpto','f-tension','f-tipo','f-or',
   'f-prof','f-matricula','f-rev','f-codigo','f-email','If','tf','rhos','rho-eq'
  ].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.tagName === 'SELECT' ? el.selectedIndex = 0 : el.value = ''; }
  });
  document.querySelectorAll('#wenner-body input').forEach(inp => inp.value = '');
  ST.rho = 0; ST.If = 0; ST.tf = 0;
  syncHeader();
  const ib = document.getElementById('country-info-box');
  if (ib) ib.innerHTML = '';
}

function alertPremium(feat) {
  alert(feat + ' es una función PRO/Premium de TerraDoc.\n\nPermite gestionar múltiples sistemas de puesta a tierra dentro de un mismo proyecto:\n• Líneas de distribución con múltiples apoyos\n• Campus solares con varios transformadores\n• Subestaciones con múltiples SPT independientes');
}

/* ════════════════════════════════════════════════
   INIT
════════════════════════════════════════════════ */
window.addEventListener('DOMContentLoaded', async () => {
  await loadData();

  // Default country
  ST.country = 'CO';
  const norm = LATAM_ENGINE['CO'];
  if (norm) {
    const tags = document.getElementById('norm-tags');
    if (tags) tags.innerHTML = norm.standards.map(s => '<span class="norm-tag">' + s + '</span>').join('');
    const cd = document.getElementById('country-display');
    if (cd) cd.textContent = norm.name;
    const phPais = document.getElementById('ph-pais');
    if (phPais) phPais.textContent = norm.flag + ' ' + norm.name;
  }

  // Today's date
  const fFecha = document.getElementById('f-fecha');
  if (fFecha) fFecha.value = new Date().toISOString().split('T')[0];

  initWenner();
  showSection('proyecto');

  console.log('[TerraDoc SPT v3] Ready — IEEE 80-2013 | IEEE 81-2012 | LATAM Engine');
});
