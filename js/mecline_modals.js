/* ═══════════════════════════════════════════════════════════════════
   MecLine LATAM — mecline_modals.js
   Proyecto: Voryn Energy / MecLine LATAM
   Prefijo: mecline_  |  NO mezclar con DimElec, TerraDoc ni Landing Voryn
   ═══════════════════════════════════════════════════════════════════ */

'use strict';

/* ══════════════════════════════════════════════════════════════════
   GESTIÓN DE MODALES
   - showModal(id): muestra modal-{id}
   - closeModal(id): cierra modal-{id}
   - verConjunto(codigo): modal de detalle de conjunto constructivo
   - aplicarConjunto(): aplica conjunto seleccionado al formulario
   ══════════════════════════════════════════════════════════════════ */

/* NOTE: showModal y closeModal están definidos en mecline_app.js (NAVEGACIÓN).
   Este archivo contiene lógica específica de modales de contenido.
   Los modales disponibles son:
     - modal-pricing   → planes Free/Pro/Enterprise
     - modal-conj      → detalle de conjunto constructivo
*/

// conjSeleccionado — referenciado desde mecline_app.js (estado global)
// verConjunto y aplicarConjunto están en mecline_validations.js (sección CONJUNTOS)

/* ══ MODAL HELPERS ═══════════════════════════════════════════════ */

/** Cierra el modal activo al hacer clic en el fondo */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.modal-bg').forEach(bg => {
    bg.addEventListener('click', (e) => {
      if (e.target === bg) {
        bg.classList.remove('on');
      }
    });
  });

  /** Cierra con Escape */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-bg.on').forEach(m => m.classList.remove('on'));
    }
  });
});
