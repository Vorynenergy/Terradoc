/**
 * TerraDoc SPT — terradoc_modals.js
 * Voryn Energy Platform — TerraDoc module
 * Modal management: country selector, SPT detail, confirmation dialogs
 */

'use strict';

/* ════════════════════════════════════════════════
   COUNTRY SELECTOR MODAL
════════════════════════════════════════════════ */
function openCountrySelector() {
  const modal = document.getElementById('country-modal');
  const list  = document.getElementById('country-list');
  if (!modal || !list) return;

  list.innerHTML = Object.entries(LATAM_ENGINE).map(([code, n]) => {
    const isSelected = ST.country === code;
    return `<div class="country-item${isSelected ? ' selected' : ''}" onclick="setCountry('${code}')">
  <span class="country-flag">${n.flag}</span>
  <div style="flex:1">
    <div class="country-name">${n.name}</div>
    <div class="country-norms">${n.standards.slice(0, 3).join(' · ')}</div>
  </div>
  <div>
    <span class="badge ${n.validated ? 'ok' : 'warn'}" style="font-size:9px">${n.validated ? '✓ Validado' : '~ En revisión'}</span>
    <div style="font-size:10px;color:var(--ink4);margin-top:3px;font-family:var(--mono)">Rg ≤ ${n.rgLimits.apoyo} Ω</div>
  </div>
</div>`;
  }).join('');

  modal.style.display = 'flex';
  modal.classList.add('open');
}

function closeCountryModal() {
  const modal = document.getElementById('country-modal');
  if (modal) { modal.style.display = 'none'; modal.classList.remove('open'); }
}

// Close on backdrop click
document.addEventListener('click', (e) => {
  const modal = document.getElementById('country-modal');
  if (modal && e.target === modal) closeCountryModal();
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeCountryModal();
});

/* ════════════════════════════════════════════════
   SPT CONFIG DETAIL MODAL (optional future use)
════════════════════════════════════════════════ */
function openConfigDetail(id) {
  // PENDIENTE IMPLEMENTACIÓN — modal con detalle completo de configuración
  // Incluirá: SVG fullscreen, tabla de parámetros, Rg calculada, materiales
  console.warn('[TerraDoc] openConfigDetail — PENDIENTE IMPLEMENTACIÓN:', id);
  selectConfig(id); // Fallback: selects in main panel
}

/* ════════════════════════════════════════════════
   CONFIRMATION DIALOG (blocker export gate)
════════════════════════════════════════════════ */
function confirmDialog(message, onConfirm, onCancel) {
  // Uses native confirm() — PENDIENTE IMPLEMENTACIÓN: custom modal
  if (window.confirm(message)) {
    if (onConfirm) onConfirm();
  } else {
    if (onCancel) onCancel();
  }
}

/* ════════════════════════════════════════════════
   PREMIUM FEATURE ALERT
════════════════════════════════════════════════ */
function alertPremium(feat) {
  // PENDIENTE IMPLEMENTACIÓN: custom modal with upgrade CTA
  alert(
    feat + ' es una función PRO/Premium de TerraDoc.\n\n' +
    'Disponible en el plan Voryn Energy Pro:\n' +
    '• Multi-SPT por proyecto (SPT-01, SPT-02, ...)\n' +
    '• Proyectos: líneas de distribución, campus solares\n' +
    '• Exportación masiva multi-SPT\n' +
    '• Integración con MecLine LATAM y DimElec LATAM'
  );
}
