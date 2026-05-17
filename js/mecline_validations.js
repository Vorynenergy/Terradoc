/* ═══════════════════════════════════════════════════════════════════
   MecLine LATAM — mecline_validations.js
   Proyecto: Voryn Energy / MecLine LATAM
   Prefijo: mecline_  |  NO mezclar con DimElec, TerraDoc ni Landing Voryn
   ═══════════════════════════════════════════════════════════════════ */

'use strict';

// ══════════════════════════════════════════════════════════════════
//  CATÁLOGO DE CONJUNTOS CONSTRUCTIVOS
// ══════════════════════════════════════════════════════════════════
const CONJUNTOS=[
  // ── SUSPENSIÓN MT ──
  {codigo:'MT-SUSP-3F-URB',nombre:'Suspensión trifásica urbana MT',pais:'latam',nivel_kv:[11,13.2,22],zona:['urbana','semiurbana'],tipo:'suspension',fases:'3F',ang_min:0,ang_max:5,vano_min:30,vano_max:80,conductores:['ACSR','AAAC','ACAR'],requiere_retenida:false,componentes:['Poste concreto','Cruceta metálica','Aislador tipo PIN','Grapa de suspensión','Perno pasante','Varilla armar'],observaciones:'Para tramos rectos o deflexiones mínimas en zona urbana.'},
  {codigo:'MT-SUSP-3F-RUR',nombre:'Suspensión trifásica rural MT',pais:'latam',nivel_kv:[11,13.2,22,33],zona:['rural','semiurbana'],tipo:'suspension',fases:'3F',ang_min:0,ang_max:8,vano_min:40,vano_max:120,conductores:['ACSR','AAAC','ACAR'],requiere_retenida:false,componentes:['Poste concreto','Cruceta madera/metálica','Aislador PIN o suspensión','Grapa preformada','Varilla armar'],observaciones:'Para vanos largos en zonas rurales con terreno abierto.'},
  {codigo:'MT-SUSP-1F',nombre:'Suspensión monofásica MT',pais:'latam',nivel_kv:[7.6,13.2],zona:['rural'],tipo:'suspension',fases:'1F',ang_min:0,ang_max:5,vano_min:30,vano_max:100,conductores:['ACSR','Cu'],requiere_retenida:false,componentes:['Poste concreto','Ménsola','Aislador PIN','Grapa de amarre','Varilla armar'],observaciones:'Para ramales rurales monofásicos.'},
  // ── ANGULAR MT ──
  {codigo:'MT-ANG-3F-URB',nombre:'Angular trifásica urbana MT',pais:'latam',nivel_kv:[11,13.2,22],zona:['urbana','semiurbana'],tipo:'angular',fases:'3F',ang_min:5,ang_max:30,vano_min:30,vano_max:70,conductores:['ACSR','AAAC'],requiere_retenida:false,componentes:['Poste concreto reforzado','Cruceta angular','Aislador de suspensión cadenal','Herraje de suspensión','Varilla armar'],observaciones:'Ángulo de 5° a 30°. Verificar retenida para ángulos > 20° con vanos largos.'},
  {codigo:'MT-ANG-3F-RUR',nombre:'Angular trifásica rural MT',pais:'latam',nivel_kv:[11,13.2,22,33],zona:['rural'],tipo:'angular',fases:'3F',ang_min:5,ang_max:30,vano_min:40,vano_max:100,conductores:['ACSR','AAAC','ACAR'],requiere_retenida:true,componentes:['Poste concreto','Cruceta angular reforzada','Cadena de aisladores doble','Grapa de amarre angular','Retenida inclinada','Bloque de anclaje'],observaciones:'Requiere retenida en la mayoría de configuraciones. Verificar capacidad del terreno.'},
  // ── RETENCIÓN / ANCLAJE MT ──
  {codigo:'MT-RET-3F',nombre:'Retención/anclaje trifásica MT',pais:'latam',nivel_kv:[11,13.2,22,33],zona:['rural','urbana','semiurbana'],tipo:'retencion',fases:'3F',ang_min:30,ang_max:90,vano_min:0,vano_max:999,conductores:['ACSR','AAAC','ACAR','Cu'],requiere_retenida:true,componentes:['Poste concreto alta resistencia','Cruceta retención doble','Cadena de aisladores tipo retención','Grapa de retención','Retenidas (2 o más)','Bloque anclaje'],observaciones:'Ángulo > 30°. Obligatoria verificación estructural detallada. Factor de seguridad mínimo 2.5.'},
  // ── TERMINAL MT ──
  {codigo:'MT-TERM-3F',nombre:'Terminal trifásica MT',pais:'latam',nivel_kv:[11,13.2,22,33],zona:['rural','urbana','semiurbana','industrial'],tipo:'terminal',fases:'3F',ang_min:0,ang_max:90,vano_min:0,vano_max:999,conductores:['ACSR','AAAC','ACAR','Cu'],requiere_retenida:true,componentes:['Poste concreto alta resistencia','Cruceta terminal','Cadena de aisladores retención','Grapa de terminal','Retenidas (2-3)','Bloque anclaje en V','Puesta a tierra'],observaciones:'Estructura de inicio/fin de tramo. Retenidas obligatorias. Incluir SPT.'},
  // ── DERIVACIÓN MT ──
  {codigo:'MT-DER-3F',nombre:'Derivación trifásica MT',pais:'latam',nivel_kv:[11,13.2,22],zona:['rural','urbana','semiurbana'],tipo:'derivacion',fases:'3F',ang_min:0,ang_max:10,vano_min:0,vano_max:999,conductores:['ACSR','AAAC'],requiere_retenida:false,componentes:['Poste concreto','Cruceta derivación','Aisladores PIN+suspensión','Conectores de derivación','Varilla armar'],observaciones:'Derivación sin cambio de dirección. Para taps con ángulo > 30° usar retención.'},
  // ── TRANSFORMADOR ──
  {codigo:'MT-TRANSF-URB',nombre:'Transformador en poste urbano',pais:'latam',nivel_kv:[11,13.2,22],zona:['urbana','semiurbana'],tipo:'transformador',fases:'3F',ang_min:0,ang_max:5,vano_min:0,vano_max:999,conductores:['ACSR','AAAC','Cu'],requiere_retenida:false,componentes:['Poste concreto','Plataforma transformador','Cortacircuito fusible (3u)','Pararrayos DPS (3u)','Caja BT','Neutro cableado','SPT'],observaciones:'Incluye protección completa MT/BT. SPT obligatorio. Verificar corriente de corto para selección de fusibles.'},
  {codigo:'MT-TRANSF-RUR',nombre:'Transformador en poste rural',pais:'latam',nivel_kv:[11,13.2,22],zona:['rural'],tipo:'transformador',fases:'1F',ang_min:0,ang_max:5,vano_min:0,vano_max:999,conductores:['ACSR','Cu'],requiere_retenida:false,componentes:['Poste concreto','Ménsola transformador','Cortacircuito fusible (1u)','Pararrayos DPS','Bajante BT','SPT'],observaciones:'Monofásico rural. Verificar capacidad de transformador y selección de fusible.'},
  // ── SECCIONAMIENTO ──
  {codigo:'MT-SECC-3F',nombre:'Seccionamiento trifásico MT',pais:'latam',nivel_kv:[11,13.2,22,33],zona:['rural','urbana','semiurbana'],tipo:'seccionamiento',fases:'3F',ang_min:0,ang_max:5,vano_min:0,vano_max:999,conductores:['ACSR','AAAC'],requiere_retenida:false,componentes:['Poste concreto','Seccionador tripolar','Cortacircuito (opcional)','SPT','Señalización'],observaciones:'Para seccionalización de circuito. Coordinar con protecciones.'},
  // ── PROTECCIÓN ──
  {codigo:'MT-PROT-CC',nombre:'Protección con cortacircuito MT',pais:'latam',nivel_kv:[11,13.2,22],zona:['rural','urbana'],tipo:'proteccion',fases:'3F',ang_min:0,ang_max:5,vano_min:0,vano_max:999,conductores:['ACSR','AAAC','Cu'],requiere_retenida:false,componentes:['Poste concreto','Cortacircuito fusible (3u)','Pararrayos DPS','SPT'],observaciones:'Protección de ramales y transformadores. Seleccionar fusible según corriente de falla.'},
  {codigo:'MT-DPS',nombre:'Protección con pararrayos (DPS) MT',pais:'latam',nivel_kv:[11,13.2,22,33],zona:['rural','urbana','semiurbana'],tipo:'proteccion',fases:'3F',ang_min:0,ang_max:5,vano_min:0,vano_max:999,conductores:['ACSR','AAAC','ACAR'],requiere_retenida:false,componentes:['Poste existente/nuevo','Pararrayos DPS (3u)','Soporte DPS','SPT','Bajante tierra'],observaciones:'Protección contra sobretensiones. Coordinar nivel de aislamiento.'},
  // ── RETENIDAS ──
  {codigo:'MT-RETENIDA-SIMP',nombre:'Retenida simple MT/BT',pais:'latam',nivel_kv:[0.4,11,13.2,22],zona:['rural','urbana','semiurbana'],tipo:'retenida',fases:'3F',ang_min:0,ang_max:90,vano_min:0,vano_max:999,conductores:['ACSR','AAAC','Cu'],requiere_retenida:false,componentes:['Cable de acero 3/8"','Abrazadera poste','Tensor guardacabo','Bloque anclaje','Varilla anclaje'],observaciones:'Retenida simple a tierra. Verificar ángulo y carga de tracción.'},
  {codigo:'MT-RETENIDA-VOL',nombre:'Retenida en vuelo MT',pais:'latam',nivel_kv:[11,13.2,22],zona:['rural','urbana'],tipo:'retenida',fases:'3F',ang_min:0,ang_max:90,vano_min:0,vano_max:999,conductores:['ACSR','AAAC'],requiere_retenida:false,componentes:['Cable de acero 3/8"','Abrazaderas apoyo','Tensores guardacabo','Barra de equilibrio','Aislador de retenida'],observaciones:'Cuando no es posible anclar a tierra. Retenida entre dos apoyos.'},
  // ── TRANSICIÓN A/S ──
  {codigo:'MT-TRANS-AS',nombre:'Transición aérea-subterránea MT',pais:'latam',nivel_kv:[11,13.2,22],zona:['urbana','semiurbana','industrial'],tipo:'transicion',fases:'3F',ang_min:0,ang_max:5,vano_min:0,vano_max:999,conductores:['ACSR','AAAC','Cu'],requiere_retenida:true,componentes:['Poste terminal','Terminaciones de cable MT','Pararrayos DPS','Tubo galvanizado protección','SPT','Retenidas terminal'],observaciones:'Empalme red aérea con red subterránea. Coordinar nivel de aislamiento con el cable.'},
  // ── SUSPENSIÓN BT ──
  {codigo:'BT-SUSP-MUL',nombre:'Suspensión Multiplex BT',pais:'latam',nivel_kv:[0.4],zona:['urbana','semiurbana','rural'],tipo:'suspension',fases:'3F',ang_min:0,ang_max:5,vano_min:15,vano_max:50,conductores:['Multiplex','Cu'],requiere_retenida:false,componentes:['Poste concreto','Soporte gancho BT','Grapa suspensión Multiplex','Cinta mensajera'],observaciones:'Para Multiplex autosoportado. Verificar flecha máxima y distancias de seguridad.'},
  {codigo:'BT-TERM-MUL',nombre:'Terminal Multiplex BT',pais:'latam',nivel_kv:[0.4],zona:['urbana','semiurbana','rural'],tipo:'terminal',fases:'3F',ang_min:0,ang_max:90,vano_min:0,vano_max:999,conductores:['Multiplex','Cu'],requiere_retenida:true,componentes:['Poste concreto','Gancho terminal','Grapa retención Multiplex','Retenida simple','Caja de conexión BT'],observaciones:'Inicio o fin del tramo BT. Retenida recomendada.'},
];


// ══════════════════════════════════════════════════════════════════
//  CONJUNTOS CONSTRUCTIVOS
// ══════════════════════════════════════════════════════════════════
function renderConjuntoCatalogo(){
  const fpais=document.getElementById('flt-conj-pais')?.value||'';
  const ftipo=document.getElementById('flt-conj-tipo')?.value||'';
  const filtrados=CONJUNTOS.filter(c=>{
    if(fpais&&c.pais!=='latam'&&c.pais!==fpais)return false;
    if(ftipo&&c.tipo!==ftipo)return false;
    return true;
  });
  const tipoCls={suspension:'b-info',angular:'b-warn',retencion:'b-err',terminal:'b-err',derivacion:'b-violet',transformador:'b-gold',seccionamiento:'b-ok',proteccion:'b-warn',retenida:'b-neutral',transicion:'b-indet'};
  const tipoIcon={suspension:'ti-wave-sine',angular:'ti-angle',retencion:'ti-anchor',terminal:'ti-flag',derivacion:'ti-git-fork',transformador:'ti-transformer-bolt',seccionamiento:'ti-switch',proteccion:'ti-shield',retenida:'ti-arrow-up-right',transicion:'ti-transfer'};

  document.getElementById('conj-grid').innerHTML=filtrados.map(c=>`
<div class="conj-card" onclick="verConjunto('${c.codigo}')">
  <div class="conj-top">
    <div>
      <div class="conj-codigo">${c.codigo}</div>
      <div class="conj-nombre">${c.nombre}</div>
    </div>
    <span class="badge ${tipoCls[c.tipo]||'b-neutral'}"><i class="ti ${tipoIcon[c.tipo]||'ti-building-factory'}"></i></span>
  </div>
  <div class="conj-body">
    <div class="conj-row"><span class="conj-lbl">Tensión</span><span class="conj-val">${c.nivel_kv.join(' / ')} kV</span></div>
    <div class="conj-row"><span class="conj-lbl">Ángulo</span><span class="conj-val">${c.ang_min}° – ${c.ang_max}°</span></div>
    <div class="conj-row"><span class="conj-lbl">Vano</span><span class="conj-val">${c.vano_min===0&&c.vano_max===999?'Sin restricción':c.vano_min+'–'+c.vano_max+' m'}</span></div>
    <div class="conj-row"><span class="conj-lbl">Zona</span><span class="conj-val">${c.zona.join(', ')}</span></div>
    <div class="conj-tag-row">
      ${c.conductores.map(ct=>`<span class="conj-tag">${ct}</span>`).join('')}
      ${c.requiere_retenida?'<span class="conj-tag" style="background:var(--err-dim);color:var(--err)">+Retenida</span>':''}
    </div>
  </div>
  <div class="conj-footer">
    <span style="font-size:10px;color:var(--t3);font-family:var(--f-mono)">${c.fases} · ${c.componentes.length} componentes</span>
    <button class="btn btn-sm btn-ghost" onclick="event.stopPropagation();verConjunto('${c.codigo}')"><i class="ti ti-eye"></i></button>
  </div>
</div>`).join('')||'<div class="empty" style="grid-column:1/-1"><i class="ti ti-filter-off"></i><div class="empty-title">Sin resultados</div><div class="empty-sub">Ajuste los filtros</div></div>';
}

function filtrarConjuntos(){renderConjuntoCatalogo();}

function verConjunto(codigo){
  const c=CONJUNTOS.find(x=>x.codigo===codigo);
  if(!c)return;
  conjSeleccionado=c;
  document.getElementById('modal-conj-title').textContent=c.codigo+' — '+c.nombre;
  document.getElementById('modal-conj-body').innerHTML=`
<div style="display:flex;flex-direction:column;gap:12px">
<div class="alert a-violet"><i class="ti ti-info-circle"></i><div><strong>Resultado preliminar.</strong> Este conjunto es aplicable bajo los criterios evaluados. Validar con las normas constructivas vigentes del operador de red.</div></div>
<div class="card-sm"><div class="sec-lbl" style="padding-bottom:7px;margin-bottom:9px">Parámetros de aplicación</div>
  <table class="val-tabla">
    <thead><tr><th>Criterio</th><th>Rango del conjunto</th></tr></thead>
    <tbody>
      <tr><td class="lc">Nivel de tensión</td><td>${c.nivel_kv.join(' / ')} kV</td></tr>
      <tr><td class="lc">Ángulo de deflexión</td><td>${c.ang_min}° a ${c.ang_max}°</td></tr>
      <tr><td class="lc">Rango de vano</td><td>${c.vano_min===0&&c.vano_max===999?'Sin restricción de vano':c.vano_min+' a '+c.vano_max+' m'}</td></tr>
      <tr><td class="lc">Zona de aplicación</td><td>${c.zona.join(', ')}</td></tr>
      <tr><td class="lc">Fases</td><td>${c.fases}</td></tr>
      <tr><td class="lc">Conductores compatibles</td><td>${c.conductores.join(', ')}</td></tr>
      <tr><td class="lc">Requiere retenida</td><td>${c.requiere_retenida?'<span style="color:var(--err);font-weight:700">Sí — obligatoria</span>':'<span style="color:var(--ok)">No requerida</span>'}</td></tr>
    </tbody>
  </table>
</div>
<div class="card-sm"><div class="sec-lbl" style="padding-bottom:7px;margin-bottom:9px">Componentes principales</div>
  <div style="display:flex;flex-direction:column;gap:4px">
    ${c.componentes.map((comp,i)=>`<div style="display:flex;align-items:center;gap:7px;font-size:12px"><span style="width:18px;height:18px;border-radius:50%;background:var(--brand-dim);color:var(--brand);display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;font-family:var(--f-mono);flex-shrink:0">${i+1}</span>${comp}</div>`).join('')}
  </div>
</div>
<div class="alert a-info"><i class="ti ti-message-report"></i><div>${c.observaciones}</div></div>
</div>`;
  document.getElementById('modal-conj').classList.add('on');
}

function aplicarConjunto(){
  if(conjSeleccionado) closeModal('conj');
}
function closeModal(id){document.getElementById('modal-'+id).classList.remove('on');}
function showModal(id){document.getElementById('modal-'+id).classList.add('on');}


// ══════════════════════════════════════════════════════════════════
//  RECOMENDADOR
// ══════════════════════════════════════════════════════════════════
function recomendarConjunto(){
  // Si viene de resultados, usar valores calculados
  if(ultimoResultado&&document.getElementById('panel-conj-rec').classList.contains('on')||true){
    if(ultimoResultado){
      const ang=parseFloat(document.getElementById('f-angulo').value)||0;
      const vano=parseFloat(document.getElementById('f-vano').value)||75;
      if(document.getElementById('rec-ang'))document.getElementById('rec-ang').value=ang;
      if(document.getElementById('rec-vano'))document.getElementById('rec-vano').value=vano;
    }
  }
  const pais=document.getElementById('rec-pais')?.value||'latam';
  const kv=parseFloat(document.getElementById('rec-kv')?.value)||13.2;
  const zona=document.getElementById('rec-zona')?.value||'rural';
  const ang=parseFloat(document.getElementById('rec-ang')?.value)||0;
  const vano=parseFloat(document.getElementById('rec-vano')?.value)||75;
  const condTipo=document.getElementById('rec-cond-tipo')?.value||'ACSR';
  const fases=document.getElementById('rec-fases')?.value||'3F';
  const equiposSel=[...document.getElementById('rec-equipos')?.selectedOptions||[]].map(o=>o.value);

  // Filtrar candidatos
  let candidatos=CONJUNTOS.filter(c=>{
    if(!c.nivel_kv.some(k=>Math.abs(k-kv)<0.2))return false;
    if(!c.zona.includes(zona))return false;
    if(ang<c.ang_min||ang>c.ang_max)return false;
    if(c.vano_max!==999&&(vano<c.vano_min||vano>c.vano_max))return false;
    if(!c.conductores.includes(condTipo))return false;
    if(c.fases!=='3F'&&c.fases!==fases)return false;
    // Equipos
    if(equiposSel.includes('transformador')&&c.tipo!=='transformador'&&!['proteccion','seccionamiento'].includes(c.tipo))return false;
    return true;
  });

  // Si tiene transformador, priorizar conjunto transformador
  if(equiposSel.includes('transformador')) candidatos.sort((a,b)=>(b.tipo==='transformador'?1:0)-(a.tipo==='transformador'?1:0));

  const alertas=[];
  const recs=[];
  if(ang>30)alertas.push('Ángulo > 30°: se requiere retención o anclaje obligatorio.');
  if(ang>5&&ang<=30)alertas.push('Ángulo entre 5° y 30°: verificar retenida según carga transversal.');
  if(vano>100)alertas.push('Vano > 100 m: requiere análisis de flecha máxima y temperatura.');
  if(equiposSel.includes('transformador'))recs.push('Incluya puesta a tierra SPT completa según normativa.');
  if(equiposSel.includes('dps'))recs.push('Coordinar nivel de protección del DPS con aislamiento del circuito.');
  if(candidatos.length===0)alertas.push('No se encontraron conjuntos que cumplan todos los criterios. Amplíe la búsqueda o consulte al diseñador.');

  const rec=candidatos[0];
  document.getElementById('rec-result').innerHTML=`
<div class="card" style="margin-top:4px">
  <div class="sec-lbl">Resultado de recomendación</div>
  ${rec?`
  <div class="alert a-ok" style="margin-bottom:12px"><i class="ti ti-circle-check"></i><div>
    <strong>Conjunto recomendado preliminarmente:</strong> ${rec.codigo} — ${rec.nombre}<br>
    <small>Aplicable bajo los criterios evaluados. Validar con las normas constructivas del operador de red.</small>
  </div></div>
  <table class="val-tabla" style="margin-bottom:12px">
    <thead><tr><th>Criterio</th><th>Valor del proyecto</th><th>Rango del conjunto</th><th>Estado</th></tr></thead>
    <tbody>
      <tr><td class="lc">Nivel de tensión</td><td>${kv} kV</td><td>${rec.nivel_kv.join('/')} kV</td><td class="val-ok">✓ Cumple</td></tr>
      <tr><td class="lc">Ángulo</td><td>${ang}°</td><td>${rec.ang_min}°–${rec.ang_max}°</td><td class="${ang>=rec.ang_min&&ang<=rec.ang_max?'val-ok':'val-no'}">${ang>=rec.ang_min&&ang<=rec.ang_max?'✓ Cumple':'✗ Fuera de rango'}</td></tr>
      <tr><td class="lc">Vano</td><td>${vano} m</td><td>${rec.vano_min===0&&rec.vano_max===999?'S/R':rec.vano_min+'–'+rec.vano_max+' m'}</td><td class="${rec.vano_max===999||vano<=rec.vano_max?'val-ok':'val-no'}">${rec.vano_max===999||vano<=rec.vano_max?'✓ Cumple':'✗ Excede'}</td></tr>
      <tr><td class="lc">Zona</td><td>${zona}</td><td>${rec.zona.join(', ')}</td><td class="${rec.zona.includes(zona)?'val-ok':'val-no'}">${rec.zona.includes(zona)?'✓ Cumple':'✗ No aplica'}</td></tr>
    </tbody>
  </table>
  <div style="margin-bottom:10px"><strong style="font-size:11px;color:var(--t2)">Componentes principales:</strong>
    <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:5px">${rec.componentes.map(c=>`<span class="conj-tag">${c}</span>`).join('')}</div>
  </div>
  ${rec.requiere_retenida?'<div class="alert a-err" style="margin-bottom:8px"><i class="ti ti-alert-triangle"></i><div>Este conjunto requiere <strong>retenida obligatoria</strong>. Incluir en el diseño.</div></div>':''}`:''}
  ${alertas.length?`<div class="alert a-warn"><i class="ti ti-alert-triangle"></i><div><strong>Alertas:</strong><ul style="margin-top:4px;padding-left:16px">${alertas.map(a=>`<li>${a}</li>`).join('')}</ul></div></div>`:''}
  ${recs.length?`<div class="alert a-info"><i class="ti ti-bulb"></i><div><strong>Recomendaciones:</strong><ul style="margin-top:4px;padding-left:16px">${recs.map(r=>`<li>${r}</li>`).join('')}</ul></div></div>`:''}
  ${candidatos.length>1?`<div style="margin-top:10px"><div class="sec-lbl">Otros candidatos (${candidatos.length-1} más)</div><div class="conj-tag-row">${candidatos.slice(1,4).map(c=>`<span class="conj-tag" style="cursor:pointer" onclick="verConjunto('${c.codigo}')">${c.codigo}</span>`).join('')}</div></div>`:''}
  <div class="alert a-violet" style="margin-top:12px"><i class="ti ti-info-circle"></i><div>Esta selección corresponde a una <strong>recomendación preliminar</strong> basada en la información ingresada. Validar con las normas constructivas vigentes del operador de red o autoridad competente.</div></div>
</div>`;
}


// ══════════════════════════════════════════════════════════════════
//  VALIDADOR DE CONJUNTO
// ══════════════════════════════════════════════════════════════════
function validarConjunto(){
  const codigo=document.getElementById('val-conj-select').value;
  if(!codigo){alert('Seleccione un conjunto.');return;}
  const c=CONJUNTOS.find(x=>x.codigo===codigo);
  if(!c)return;
  const ang=parseFloat(document.getElementById('val-ang').value)||0;
  const vano=parseFloat(document.getElementById('val-vano').value)||75;
  const kv=parseFloat(document.getElementById('val-kv').value)||13.2;
  const zona=document.getElementById('val-zona').value;
  const cond=document.getElementById('val-cond-tipo').value;

  const criterios=[
    {criterio:'Nivel de tensión',valor:`${kv} kV`,rango:`${c.nivel_kv.join('/')} kV`,ok:c.nivel_kv.some(k=>Math.abs(k-kv)<0.2)},
    {criterio:'Ángulo de deflexión',valor:`${ang}°`,rango:`${c.ang_min}° – ${c.ang_max}°`,ok:ang>=c.ang_min&&ang<=c.ang_max},
    {criterio:'Vano',valor:`${vano} m`,rango:c.vano_max===999?'Sin restricción':`${c.vano_min} – ${c.vano_max} m`,ok:c.vano_max===999||(vano>=c.vano_min&&vano<=c.vano_max)},
    {criterio:'Zona',valor:zona,rango:c.zona.join(', '),ok:c.zona.includes(zona)},
    {criterio:'Conductor',valor:cond,rango:c.conductores.join(', '),ok:c.conductores.includes(cond)},
  ];
  const allOk=criterios.every(cr=>cr.ok);
  const estado=allOk?'Aplicable':criterios.some(cr=>!cr.ok&&['Nivel de tensión','Conductor'].includes(cr.criterio))?'No aplicable':'Requiere revisión';

  document.getElementById('val-result').innerHTML=`
<div class="card" style="margin-top:4px">
  <div class="sec-lbl">Validación: ${c.codigo}</div>
  <div class="alert ${allOk?'a-ok':estado==='No aplicable'?'a-err':'a-warn'}" style="margin-bottom:12px">
    <i class="ti ti-${allOk?'circle-check':estado==='No aplicable'?'circle-x':'alert-triangle'}"></i>
    <div><strong>Estado: ${estado}</strong><br><small>${allOk?'Conjunto aplicable bajo los criterios evaluados.':'Uno o más criterios fuera de rango. Revisar antes de implementar.'}</small></div>
  </div>
  <table class="val-tabla">
    <thead><tr><th>Criterio</th><th>Valor proyecto</th><th>Rango conjunto</th><th>Estado</th></tr></thead>
    <tbody>${criterios.map(cr=>`<tr><td class="lc">${cr.criterio}</td><td>${cr.valor}</td><td>${cr.rango}</td><td class="${cr.ok?'val-ok':'val-no'}">${cr.ok?'✓ Cumple':'✗ Fuera'}</td></tr>`).join('')}</tbody>
  </table>
  ${c.requiere_retenida?'<div class="alert a-err" style="margin-top:10px"><i class="ti ti-alert-triangle"></i><div>Este conjunto requiere <strong>retenida obligatoria</strong>.</div></div>':''}
  <div class="alert a-violet" style="margin-top:10px"><i class="ti ti-info-circle"></i><div>Resultado preliminar. Validar con normas constructivas del operador de red.</div></div>
</div>`;
}


// ══════════════════════════════════════════════════════════════════
//  SUMINISTROS REFERENCIALES
// ══════════════════════════════════════════════════════════════════
const SUMINISTROS_TIPO={
  suspension:['Poste concreto 12m','Cruceta metálica 1.2m','Aislador tipo PIN 15kV (x3)','Grapa de suspensión (x3)','Perno pasante Ø5/8" (x6)','Varilla armar #2 (x6)','Cinta de amarre (x1)'],
  angular:['Poste concreto 12m reforzado','Cruceta angular 1.2m (x2)','Cadena aisladores 15kV suspensión (x3)','Herraje de suspensión Ø5/8" (x3)','Varilla armar (x3)','Pernos pasantes (x8)'],
  retencion:['Poste concreto 14m alta resistencia','Cruceta doble retención 1.5m','Cadena aisladores 15kV retención (x3)','Grapa de retención (x3)','Cable retenida 3/8" (50m)','Tensor guardacabo (x2)','Bloque anclaje 400x400x200mm (x2)'],
  terminal:['Poste concreto 14m alta resistencia','Cruceta terminal 1.5m','Cadena retención 15kV (x3)','Grapa terminal (x3)','Cable retenida 3/8" (x3×50m)','Tensor guardacabo (x3)','Bloque anclaje 400x400x200mm (x3)','Electrodo SPT Cu 5/8"×3m (x1)'],
  transformador:['Poste concreto 12m','Plataforma transformador galvanizada','Abrazadera poste (x2)','Cortacircuito fusible 15kV (x3)','Pararrayos DPS 15kV (x3)','Caja BT 4 salidas','Cable bajante Cu 1/0 AWG (10m)','Electrodo SPT Cu 5/8"×3m (x1)','Varilla bayoneta Cu (x1)'],
  proteccion:['Cortacircuito fusible 15kV (x3)','Pararrayos DPS 15kV (x3)','Soporte DPS (x3)','Cable bajante Cu #4 AWG (5m)','Electrodo SPT Cu 5/8"×3m (x1)'],
  retenida:['Cable acero galvanizado 3/8" (50m)','Abrazadera poste Ø200mm (x1)','Tensor guardacabo 3/8" (x1)','Varilla anclaje 5/8"×2.4m (x1)','Placa anclaje 400x400mm (x1)'],
};
function renderSuministros(){
  const cod=document.getElementById('mat-conj').value;
  if(!cod){document.getElementById('mat-body').innerHTML='<div class="empty"><i class="ti ti-list"></i><div class="empty-title">Seleccione un conjunto</div></div>';return;}
  const c=CONJUNTOS.find(x=>x.codigo===cod);
  if(!c){return;}
  const lista=SUMINISTROS_TIPO[c.tipo]||c.componentes;
  document.getElementById('mat-body').innerHTML=`
<div class="card">
  <div class="sec-lbl">${c.codigo} — Lista referencial de materiales</div>
  <div class="alert a-warn"><i class="ti ti-alert-triangle"></i><div>Lista referencial conceptual. No reemplaza el listado de materiales definitivo del proyecto. Cantidades sujetas a verificación por el proyectista.</div></div>
  <div class="tbl-wrap" style="margin-top:10px"><table class="tbl">
    <thead><tr><th>#</th><th>Descripción del material</th><th>Tipo</th></tr></thead>
    <tbody>${lista.map((m,i)=>`<tr><td>${i+1}</td><td class="lc">${m}</td><td><span class="badge b-neutral">${c.tipo}</span></td></tr>`).join('')}</tbody>
  </table></div>
  <div style="margin-top:10px;font-size:10.5px;color:var(--t3)">Fuente: catálogo referencial MecLine LATAM v5. No representa catálogo propietario de ningún operador de red.</div>
</div>`;
}


// ══════════════════════════════════════════════════════════════════
//  POBLAR SELECTS DE CONJUNTOS
// ══════════════════════════════════════════════════════════════════
function poblarSelectsConjuntos(){
  const opts=CONJUNTOS.map(c=>`<option value="${c.codigo}">${c.codigo} — ${c.nombre}</option>`).join('');
  ['val-conj-select','mat-conj'].forEach(id=>{
    const sel=document.getElementById(id);
    if(sel&&sel.options.length<=1)sel.innerHTML=`<option value="">— Seleccione —</option>`+opts;
  });
}

function cargarEjemplo(){
  document.getElementById('f-vano').value=80;
  document.getElementById('f-angulo').value=10;
  document.getElementById('f-diam').value=13.26;
  document.getElementById('f-peso').value=0.420;
  document.getElementById('f-uts').value=25.2;
  document.getElementById('f-crot').value=7.35;
  document.getElementById('f-viento').value=27;
}

function resetCalc(){
  ultimoResultado=null;
  document.getElementById('res-body').innerHTML='<div class="empty"><i class="ti ti-calculator"></i><div class="empty-title">Sin resultados</div><div class="empty-sub">Ingrese datos y ejecute el cálculo</div></div>';
}

