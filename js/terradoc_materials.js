/**
 * TerraDoc SPT — terradoc_materials.js
 * * Voryn Energy — TerraDoc module
 * Automatic material quantity estimation per SPT configuration
 */

'use strict';

function calcMaterials() {
  const tbody = document.getElementById('mat-tbody');
  if (!tbody) return;

  if (!ST.selectedId) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--ink3);padding:20px;font-style:italic">Seleccione una configuración SPT en la sección Alternativas primero.</td></tr>';
    return;
  }

  const cfg = CONFIGS.find(c => c.id === ST.selectedId) || CONFIGS[4];
  const rho = ST.rho || 100;
  const Rf = cfg.Rf;
  const needsBentonite = Rf > 0.4;
  const needsCoke = rho > 500;

  const items = [
    { desc: 'Varilla copperweld 5/8" × 2.40 m (Cu-clad steel)', unit: 'UN', qty: Math.max(1, cfg.rods), nota: 'Electrodo vertical principal — ASTM B227 / UL467' },
    { desc: 'Conductor Cu desnudo cableado 7H 35 mm² (enterrado)', unit: 'm', qty: cfg.mat_m, nota: 'Anillos y contrapesos — ASTM B3/B8 / IEC 60228' },
    { desc: 'Bajante Cu desnudo 35 mm² (sobre superficie)', unit: 'm', qty: Math.max(8, cfg.rods * 3), nota: 'Desde estructura/equipo hasta SPT — mín. 3 m/electrodo' },
    { desc: 'Conector mecánico tipo AB varilla 5/8"', unit: 'UN', qty: Math.max(1, cfg.rods), nota: 'Unión bajante–varilla en cabeza — UL467 / IEC 62561' },
    { desc: 'Soldadura exotérmica CAD-WELD 115/150 (Cu-Cu)', unit: 'UN', qty: Math.max(2, Math.ceil(cfg.mat_m / 5) + cfg.rods), nota: 'Uniones conductor-varilla y cruces — CADWELD / THERMOWELD' },
    { desc: 'Grapa de fijación bajante Cu (acero inox. SS304)', unit: 'UN', qty: Math.ceil(Math.max(8, cfg.rods * 3) / 2), nota: 'Cada 2 m de bajante sobre superficie' },
    needsBentonite && { desc: 'Bentonita sódica / ERICO GEM compuesto', unit: 'kg', qty: cfg.rods * 25, nota: 'Tratamiento de suelo alta ρ — reduce 30-60% resistividad' },
    needsCoke && { desc: 'Cemento conductivo COKE BREEZE', unit: 'kg', qty: cfg.rods * 50, nota: 'Reducción adicional de Rg — ρ > 500 Ω·m' },
    { desc: 'Excavación manual zanja h=0.5 m × 0.3 m', unit: 'm', qty: cfg.mat_m + (cfg.L || 0), nota: 'Para conductor enterrado' },
    { desc: 'Material granular fino relleno (grava lavada < 5 mm)', unit: 'm³', qty: +((cfg.mat_m + (cfg.L || 0)) * 0.5 * 0.3).toFixed(1), nota: 'Relleno y compactación alrededor de conductor' },
    { desc: 'Cinta señalización subterránea amarilla 100 mm', unit: 'm', qty: cfg.mat_m, nota: '"Puesta a Tierra" — instalada 0.3 m sobre conductor' },
    { desc: 'Placa identificación SPT (acero inox. 200×100 mm)', unit: 'UN', qty: 1, nota: 'Rotulación punto de inspección — SS316' },
  ].filter(Boolean).filter(i => parseFloat(i.qty) > 0);

  tbody.innerHTML = '';
  items.forEach((it, idx) => {
    const tr = tbody.insertRow();
    tr.innerHTML =
      '<td style="font-family:var(--mono);font-size:11px">' + String(idx + 1).padStart(2, '0') + '</td>' +
      '<td>' + it.desc + '</td>' +
      '<td style="font-family:var(--mono)">' + it.unit + '</td>' +
      '<td style="font-family:var(--mono);font-weight:600">' + it.qty + '</td>' +
      '<td style="font-size:11.5px;color:var(--ink3)">' + it.nota + '</td>';
  });
}
