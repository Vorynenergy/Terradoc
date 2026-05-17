/**
 * TerraDoc SPT — terradoc_reports.js
 * * Voryn Energy — TerraDoc module
 * Report preview, DOCX/PDF/JSON export, technical JSON builder
 */

'use strict';

/* ════════════════════════════════════════════════
   REPORT PREVIEW BUILDER
════════════════════════════════════════════════ */
function genDoc(type) {
  const prev = document.getElementById('report-preview');
  if (prev) prev.style.display = '';

  const norm = LATAM_ENGINE[ST.country] || LATAM_ENGINE['CO'];
  const cfg = CONFIGS.find(c => c.id === ST.selectedId);
  const get = id => document.getElementById(id)?.value || '';

  // Header
  const normLine = [ST.country, ...norm.standards.slice(0, 3)].join(' · ');
  setRepEl('rep-norm-line', normLine);
  setRepEl('rep-nombre', get('f-nombre') || 'Proyecto sin nombre');
  setRepEl('rep-prof', get('f-prof') || 'Profesional responsable');
  setRepEl('rep-mat', get('f-matricula') || '—');
  setRepEl('rep-fecha-line', get('f-fecha') || new Date().toISOString().slice(0, 10));
  setRepEl('rep-rev', get('f-rev') || '00');

  // Summary
  const sumBox = document.getElementById('rep-summary-box');
  if (sumBox) {
    sumBox.innerHTML = `
<div><div style="font-size:10.5px;font-weight:600;color:var(--ink3);text-transform:uppercase;letter-spacing:.6px;margin-bottom:6px">Resumen ejecutivo</div>
<div style="font-size:12px;color:var(--ink2);line-height:1.7">
Memoria de cálculo SPT para <b>${get('f-nombre') || '—'}</b>.<br>
País: <b>${norm.name}</b> · Normativa: <b>${norm.standards[0]}</b><br>
ρ promedio: <b>${(ST.rho || 0).toFixed(1)} Ω·m</b> · ${soilDesc(ST.rho || 0).name}<br>
Config. recomendada: <b>${ST.selectedId || '—'}</b><br>
Rg estimada: <b>${cfg ? (cfg.Rf * (ST.rho || 100)).toFixed(2) : '—'} Ω</b>
</div></div>`;
  }

  // Parameters table
  const paramsBox = document.getElementById('rep-params-box');
  if (paramsBox) {
    const rows = [
      ['If diseño', ST.If + ' kA'],
      ['Sf / Df', ST.Sf + ' / ' + ST.Df],
      ['Ig efectiva', (ST.Ig || 0).toFixed(0) + ' A'],
      ['tf despeje', ST.tf + ' s'],
      ['ρs superficie', (ST.rhos || 3000) + ' Ω·m'],
      ['Ep tol. (70 kg)', ST.Ep70 + ' V'],
      ['Ec tol. (70 kg)', ST.Ec70 + ' V'],
      ['GPR', (ST.GPR || 0).toFixed(0) + ' V'],
      ['Rg', (ST.Rg || 0).toFixed(3) + ' Ω'],
      ['Rg límite', '≤ ' + norm.rgLimits.apoyo + ' Ω'],
    ];
    paramsBox.innerHTML = `
<div><div style="font-size:10.5px;font-weight:600;color:var(--ink3);text-transform:uppercase;letter-spacing:.6px;margin-bottom:6px">Parámetros de diseño</div>
<table style="width:100%;font-size:12px;border-collapse:collapse">
${rows.map(([k, v]) => '<tr><td style="color:var(--ink3);padding:3px 0">' + k + '</td><td style="font-family:var(--mono);font-weight:600;text-align:right">' + v + '</td></tr>').join('')}
</table></div>`;
  }

  // SVG config
  const svgBox = document.getElementById('rep-config-svg-box');
  if (svgBox && ST.selectedId && SVGS) {
    svgBox.innerHTML = `
<div style="font-size:10.5px;font-weight:600;color:var(--ink3);text-transform:uppercase;letter-spacing:.6px;margin-bottom:6px">Configuración seleccionada</div>
<div style="background:#fafaf9;border:1px solid var(--border);border-radius:5px;padding:10px;overflow:auto;max-height:220px">${SVGS[ST.selectedId] || ''}</div>
<div style="font-size:12px;color:var(--ink2);margin-top:6px"><b>${ST.selectedId}</b> — ${cfg?.desc || ''} · ${cfg?.rods || 0} varillas · ${cfg?.mat_m || 0} m conductor</div>`;
  }

  // Validations
  const valBox = document.getElementById('rep-validations-box');
  if (valBox) {
    valBox.innerHTML = ST.calcsDone
      ? `<div style="font-size:10.5px;font-weight:600;color:var(--ink3);text-transform:uppercase;letter-spacing:.6px;margin-bottom:6px">Validaciones técnicas</div>
<div class="alert ok" style="margin-bottom:5px"><span class="ai">✓</span><div>Ep tol. = ${ST.Ep70} V · Ec tol. = ${ST.Ec70} V (IEEE 80 §8, 70 kg)</div></div>
<div class="alert ${ST.Rg <= norm.rgLimits.apoyo ? 'ok' : 'danger'}" style="margin-bottom:5px"><span class="ai">${ST.Rg <= norm.rgLimits.apoyo ? '✓' : '✗'}</span><div>Rg = ${(ST.Rg || 0).toFixed(3)} Ω ${ST.Rg <= norm.rgLimits.apoyo ? '≤' : '>'} ${norm.rgLimits.apoyo} Ω (${norm.name})</div></div>
<div class="alert info"><span class="ai">ℹ</span><div>${norm.disclaimer}</div></div>`
      : '<div class="alert info"><span class="ai">ℹ</span><div>Complete los cálculos IEEE 80 primero para incluir validaciones.</div></div>';
  }

  // Disclaimer
  const discEl = document.getElementById('rep-disclaimer-text');
  if (discEl) {
    discEl.innerHTML = '<strong>AVISO LEGAL / DISCLAIMER TÉCNICO:</strong> Este documento fue generado con TerraDoc SPT v3 como herramienta de apoyo técnico al diseño de sistemas de puesta a tierra. ' + norm.disclaimer + ' La verificación in situ, validación final y firma son responsabilidad exclusiva del profesional competente habilitado conforme a la normativa vigente y las normas IEEE aplicables. TerraDoc no garantiza exactitud para condiciones de campo no contempladas en el modelo.';
  }

  // Update checker warning
  runChecker();
}

/* ════════════════════════════════════════════════
   EXPORT WITH CHECKER GATE
════════════════════════════════════════════════ */
function exportDoc(fmt, docType) {
  const critIssues = getCriticalIssues();

  if (critIssues.length && fmt !== 'json') {
    alert(
      '⛔ EXPORTACIÓN BLOQUEADA\n\n' +
      'El consistency checker detectó ' + critIssues.length + ' issue(s) crítico(s):\n\n' +
      critIssues.map(i => '• ' + i).join('\n') +
      '\n\nResuelva los issues antes de exportar documentación oficial.\nVaya a: Consistency Checker en el menú lateral.'
    );
    return;
  }

  const steps = [
    'Validando datos del proyecto...',
    'Ejecutando consistency checker...',
    'Compilando cálculos IEEE 80...',
    fmt === 'json' ? 'Generando JSON técnico trazable...' : 'Embebiendo SVG de configuración...',
    fmt === 'json' ? 'Exportando JSON...' : 'Construyendo ' + fmt.toUpperCase() + ' con plantilla docxtemplater...',
    'Aplicando normativa ' + (LATAM_ENGINE[ST.country]?.name || '') + '...',
    'Finalizando documento...',
  ];

  const norm = LATAM_ENGINE[ST.country] || LATAM_ENGINE['CO'];
  const overlay = document.getElementById('progress-overlay');
  const bar = document.getElementById('prog-bar');
  const step = document.getElementById('prog-step');
  const title = document.getElementById('prog-title');

  if (!overlay) return;
  title.textContent = 'Generando ' + fmt.toUpperCase() + ' — ' + docType;
  overlay.classList.add('show');
  let i = 0;

  const go = () => {
    if (i >= steps.length) {
      overlay.classList.remove('show');
      if (fmt === 'json') {
        const json = buildTechnicalJSON();
        console.log('[TerraDoc] JSON técnico trazable:');
        console.log(JSON.stringify(json, null, 2));
        // Create downloadable blob
        const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'terradoc-spt-' + (ST.selectedId || 'proyecto') + '.json';
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        alert(
          '✓ ' + fmt.toUpperCase() + ' listo para descarga.\n\n' +
          'En producción con backend NestJS + docxtemplater + Puppeteer PDF, el archivo se descarga automáticamente con:\n' +
          '• Plantilla Word con normativa ' + norm.name + '\n' +
          '• SVG de configuración embebido\n' +
          '• Firma digital del responsable técnico\n' +
          '• Disclaimer normativo LATAM'
        );
      }
      return;
    }
    step.textContent = steps[i];
    bar.style.width = ((i + 1) / steps.length * 100) + '%';
    i++;
    setTimeout(go, 500);
  };
  go();
}

/* ════════════════════════════════════════════════
   TECHNICAL JSON BUILDER (trazable)
════════════════════════════════════════════════ */
function buildTechnicalJSON() {
  const norm = LATAM_ENGINE[ST.country] || LATAM_ENGINE['CO'];
  const cfg = CONFIGS.find(c => c.id === ST.selectedId) || {};
  const get = id => document.getElementById(id)?.value || '';

  return {
    _meta: {
      tool: 'TerraDoc SPT',
      version: '3.0.0',
      standard_primary: 'IEEE 80-2013',
      standard_measurement: 'IEEE 81-2012',
      generated: new Date().toISOString(),
      schema: 'terradoc-v3'
    },
    pais: {
      codigo: ST.country,
      nombre: norm.name,
      normativas: norm.standards,
      validada: norm.validated,
      disclaimer: norm.disclaimer
    },
    proyecto: {
      nombre: get('f-nombre'), empresa: get('f-empresa'),
      ciudad: get('f-city'), tension: get('f-tension'),
      tipo: get('f-tipo'), profesional: get('f-prof'),
      matricula: get('f-matricula'), revision: get('f-rev'),
      fecha: get('f-fecha'), estado: get('f-estado')
    },
    resistividad: {
      metodo: 'Wenner — IEEE 81-2012 §7.3.1',
      rho_avg_ohm_m: +(ST.rho || 0).toFixed(1),
      clasificacion: soilDesc(ST.rho || 0).name,
      mediciones: ST.measurements || []
    },
    parametros_red: {
      If_kA: ST.If, Sf: ST.Sf, Df: ST.Df,
      tf_s: ST.tf, Ig_A: +(ST.Ig || 0).toFixed(0),
      rhos_ohm_m: ST.rhos || 3000
    },
    calculos_ieee80: {
      norma: 'IEEE 80-2013',
      Ep70_V: ST.Ep70, Ec70_V: ST.Ec70,
      Ep50_V: ST.Ep50, Ec50_V: ST.Ec50,
      Rg_ohm: +(ST.Rg || 0).toFixed(4),
      GPR_V: +(ST.GPR || 0).toFixed(1),
      rg_limite_ohm: norm.rgLimits.apoyo,
      rg_cumple: (ST.Rg || 0) <= norm.rgLimits.apoyo
    },
    configuracion_spt: {
      id: ST.selectedId,
      tipo: cfg.type || null,
      descripcion: cfg.desc || null,
      varillas: cfg.rods || null,
      conductor_enterrado_m: cfg.mat_m || null,
      factor_Rf: cfg.Rf || null,
      Rg_est_ohm: cfg.Rf ? +(cfg.Rf * (ST.rho || 100)).toFixed(3) : null,
      complejidad: cfg.complexity || null
    },
    consistency_checker: {
      issues_criticos: getCriticalIssues(),
      aprobado: getCriticalIssues().length === 0
    }
  };
}

/* ════════════════════════════════════════════════
   HELPER
════════════════════════════════════════════════ */
function setRepEl(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}
