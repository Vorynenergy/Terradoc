/**
 * TerraDoc SPT — terradoc_checker.js
 * * Voryn Energy — TerraDoc module
 * Consistency Checker: 10 rules CHK-001→CHK-010, blocking export gate
 */

'use strict';

/* ════════════════════════════════════════════════
   CRITICAL ISSUES (block export)
════════════════════════════════════════════════ */
function getCriticalIssues() {
  const issues = [];
  if (!ST.rho || ST.rho <= 0) issues.push('ρ suelo no calculada — complete las mediciones de resistividad');
  if (!ST.If || ST.If <= 0) issues.push('If corriente de falla no ingresada — campo obligatorio');
  if (!ST.tf || ST.tf <= 0) issues.push('tf tiempo de despeje no ingresado — campo obligatorio');
  if (!ST.calcsDone) issues.push('Cálculos IEEE 80 no ejecutados — vaya a sección Cálculos');
  if (!ST.selectedId) issues.push('Configuración SPT no seleccionada — vaya a Alternativas SPT');
  const norm = LATAM_ENGINE[ST.country];
  if (norm && ST.Rg > 0 && ST.Rg > norm.rgLimits.apoyo) {
    issues.push('Rg = ' + ST.Rg.toFixed(2) + ' Ω excede límite normativo ' + norm.rgLimits.apoyo + ' Ω (' + norm.name + ')');
  }
  if (!document.getElementById('f-prof')?.value) issues.push('Responsable técnico no registrado — campo obligatorio para emisión');
  return issues;
}

/* ════════════════════════════════════════════════
   FULL CHECKER — 10 rules
════════════════════════════════════════════════ */
function runChecker() {
  const norm = LATAM_ENGINE[ST.country] || LATAM_ENGINE['CO'];

  const checks = [
    { id: 'CHK-001', label: 'ρ en mediciones ↔ modelo de suelo', ok: ST.rho > 0, detail: 'ρ = ' + (ST.rho || 0).toFixed(1) + ' Ω·m · ' + soilDesc(ST.rho || 0).name },
    { id: 'CHK-002', label: 'Parámetros de red completos (If, tf)', ok: ST.If > 0 && ST.tf > 0, detail: 'If = ' + ST.If + ' kA · tf = ' + ST.tf + ' s' },
    { id: 'CHK-003', label: 'Corriente de diseño Ig calculada', ok: ST.Ig > 0, detail: 'Ig = ' + (ST.Ig || 0).toFixed(0) + ' A (If·Sf·Df)' },
    { id: 'CHK-004', label: 'Tensiones tolerables calculadas', ok: ST.Ep70 > 0 && ST.Ec70 > 0, detail: 'Ep70 = ' + ST.Ep70 + ' V · Ec70 = ' + ST.Ec70 + ' V' },
    { id: 'CHK-005', label: 'Configuración SPT seleccionada', ok: !!ST.selectedId, detail: ST.selectedId || 'Sin selección — requerido' },
    { id: 'CHK-006', label: 'SVG de configuración disponible', ok: !!(SVGS && SVGS[ST.selectedId]), detail: (SVGS && SVGS[ST.selectedId]) ? 'Asset SVG OK (' + ST.selectedId + ')' : 'No disponible' },
    { id: 'CHK-007', label: 'Rg dentro del límite normativo', ok: ST.Rg > 0 && ST.Rg <= norm.rgLimits.apoyo, detail: 'Rg = ' + (ST.Rg || 0).toFixed(3) + ' Ω · Lím = ' + norm.rgLimits.apoyo + ' Ω (' + norm.name + ')' },
    { id: 'CHK-008', label: 'Normativa del país validada', ok: norm.validated, detail: ST.country + ' — ' + (norm.validated ? 'Validada ✓' : 'En proceso de validación ⚠') },
    { id: 'CHK-009', label: 'Cálculos IEEE 80 ejecutados', ok: ST.calcsDone, detail: ST.calcsDone ? 'Ejecutados correctamente' : 'Pendientes de ejecución' },
    { id: 'CHK-010', label: 'Responsable técnico registrado', ok: !!(document.getElementById('f-prof')?.value), detail: document.getElementById('f-prof')?.value || 'Sin registrar — obligatorio para emisión' },
  ];

  const allOk = checks.every(c => c.ok);
  const failCount = checks.filter(c => !c.ok).length;

  // Update nav badge
  const nb = document.getElementById('nb-checker');
  if (nb) {
    nb.textContent = failCount || '✓';
    nb.style.background = failCount ? '#991b1b' : 'var(--accent)';
  }

  // Render output
  const output = document.getElementById('checker-output');
  if (output) {
    output.innerHTML =
      '<div class="alert ' + (allOk ? 'ok' : 'warn') + '" style="margin-bottom:12px">' +
      '<span class="ai">' + (allOk ? '✓' : '⚠') + '</span>' +
      '<div><strong>Consistency Checker: ' + (allOk ? 'APROBADO — El documento puede ser emitido' : 'ISSUES DETECTADOS — Corrija antes de exportar (' + failCount + ' pendiente' + (failCount > 1 ? 's' : '') + ')') + '</strong></div></div>' +
      checks.map(c => {
        const cls = c.ok ? 'ok' : 'fail';
        return '<div class="alert ' + cls + '" style="margin-bottom:4px;padding:8px 12px">' +
          '<span class="ai" style="font-size:13px">' + (c.ok ? '✓' : '✗') + '</span>' +
          '<div><strong>[' + c.id + '] ' + c.label + '</strong>' +
          '<span style="font-size:11px;opacity:.8;margin-left:6px">' + c.detail + '</span></div></div>';
      }).join('');
  }

  // Sync docgen warning
  const ckWarn = document.getElementById('ck-warn-docgen');
  if (ckWarn) {
    const crit = getCriticalIssues();
    ckWarn.innerHTML = crit.length
      ? '<div class="alert danger"><span class="ai">🚨</span><div><strong>Checker: ' + crit.length + ' issue(s) crítico(s) — exportación bloqueada</strong><br>' + crit.map(i => '· ' + i).join('<br>') + '</div></div>'
      : '<div class="alert ok"><span class="ai">✓</span><div><strong>Consistency Checker: APROBADO</strong></div></div>';
  }
}
