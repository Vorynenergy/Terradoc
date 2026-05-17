/**
 * TerraDoc SPT — terradoc_ui.js
 * * Voryn Energy — TerraDoc module
 * Navigation, stepper, header sync, modal, section display
 */

'use strict';

const ALL_SECS = [
  'proyecto','mediciones','suelo','calculos',
  'seguridad','alternativas','materiales','evidencias','reporte','checker'
];

/* ════════════════════════════════════════════════
   SECTION NAVIGATION
════════════════════════════════════════════════ */
function showSection(name) {
  ALL_SECS.forEach(s => {
    const el = document.getElementById('sec-' + s);
    if (el) el.style.display = s === name ? '' : 'none';
  });
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.sec === name);
  });
  // Auto-trigger section actions
  if (name === 'reporte') genDoc('completo');
  if (name === 'checker') runChecker();
}

/* ════════════════════════════════════════════════
   STEPPER
════════════════════════════════════════════════ */
function markStep(n) {
  for (let i = 0; i <= 6; i++) {
    const st = document.getElementById('st' + i);
    const sl = document.getElementById('sl' + i);
    if (st) { st.classList.toggle('done', i < n); st.classList.toggle('active', i === n); }
    if (sl) sl.classList.toggle('done', i < n);
  }
}

/* ════════════════════════════════════════════════
   HEADER SYNC
════════════════════════════════════════════════ */
function syncHeader() {
  const get = id => document.getElementById(id)?.value || '';
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set('ph-name', get('f-nombre') || 'Nuevo proyecto');
  set('ph-tension', get('f-tension') || '—');
  set('ph-rev', get('f-rev') || '00');
}

/* ════════════════════════════════════════════════
   COUNTRY SELECTOR MODAL
════════════════════════════════════════════════ */
function openCountrySelector() {
  const modal = document.getElementById('country-modal');
  const list = document.getElementById('country-list');
  if (!modal || !list) return;

  list.innerHTML = Object.entries(LATAM_ENGINE).map(([code, n]) => `
<div onclick="setCountry('${code}')" style="display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:5px;cursor:pointer;border:1px solid ${ST.country === code ? 'var(--accent)' : 'var(--border)'};background:${ST.country === code ? 'var(--accent-l)' : '#fff'};margin-bottom:5px">
  <span style="font-size:18px">${n.flag}</span>
  <div style="flex:1">
    <div style="font-size:13px;font-weight:500;color:var(--ink)">${n.name}</div>
    <div style="font-size:10.5px;color:var(--ink3)">${n.standards.slice(0, 3).join(' · ')}</div>
  </div>
  ${n.validated ? '<span class="badge ok" style="font-size:9px">✓</span>' : '<span class="badge warn" style="font-size:9px">~</span>'}
</div>`).join('');

  modal.style.display = 'flex';
}

/* ════════════════════════════════════════════════
   RUN ALL (full pipeline with progress)
════════════════════════════════════════════════ */
function runAll() {
  const steps = [
    'Leyendo parámetros de red...',
    'Calculando resistividad...',
    'Ejecutando IEEE 80...',
    'Evaluando tensiones tolerables...',
    'Evaluando 25 alternativas SPT...',
    'Validando seguridad eléctrica...',
    'Estimando materiales...',
    'Listo ✓'
  ];

  const overlay = document.getElementById('progress-overlay');
  const bar = document.getElementById('prog-bar');
  const step = document.getElementById('prog-step');
  const title = document.getElementById('prog-title');

  if (!overlay) return;
  title.textContent = 'Calculando todo el sistema SPT...';
  overlay.classList.add('show');
  let i = 0;

  const go = () => {
    if (i >= steps.length) {
      overlay.classList.remove('show');
      showSection('alternativas');
      markStep(5);
      return;
    }
    step.textContent = steps[i];
    bar.style.width = ((i + 1) / steps.length * 100) + '%';
    if (i === 2) runCalcs();
    if (i === 3) runSafety();
    if (i === 4) evalAlternatives();
    if (i === 5) runSafety();
    if (i === 6) calcMaterials();
    i++;
    setTimeout(go, 480);
  };
  go();
}

/* ════════════════════════════════════════════════
   MEASUREMENT TAB SWITCHER
════════════════════════════════════════════════ */
function switchMeasTab(tab) {
  ['wenner', 'schlum', 'varilla'].forEach(t => {
    const panel = document.getElementById('meas-' + t);
    const tabEl = document.getElementById('tab-' + t);
    if (panel) panel.style.display = t === tab ? '' : 'none';
    if (tabEl) tabEl.classList.toggle('active', t === tab);
  });
}

/* ════════════════════════════════════════════════
   EVIDENCIAS / IMAGES
════════════════════════════════════════════════ */
function handleImages(inp) {
  const prev = document.getElementById('img-preview');
  if (!prev) return;
  Array.from(inp.files).forEach(f => {
    const reader = new FileReader();
    reader.onload = e => {
      const div = document.createElement('div');
      div.style.cssText = 'position:relative;width:120px';
      const img = document.createElement('img');
      img.src = e.target.result;
      img.style.cssText = 'width:120px;height:80px;object-fit:cover;border-radius:5px;border:1px solid var(--border)';
      const cap = document.createElement('div');
      cap.style.cssText = 'font-size:10px;color:var(--ink3);margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:120px';
      cap.textContent = f.name;
      div.appendChild(img); div.appendChild(cap);
      prev.appendChild(div);
    };
    reader.readAsDataURL(f);
  });
}
