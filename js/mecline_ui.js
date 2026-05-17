/* ═══════════════════════════════════════════════════════════════════
   MecLine LATAM — mecline_ui.js
   Proyecto: Voryn Energy / MecLine LATAM
   Prefijo: mecline_  |  NO mezclar con DimElec, TerraDoc ni Landing Voryn
   ═══════════════════════════════════════════════════════════════════ */

'use strict';

// ══════════════════════════════════════════════════════════════════
//  NORMATIVA LATAM
// ══════════════════════════════════════════════════════════════════
const NORMATIVA={
  colombia:{pais:'Colombia',flag:'🇨🇴',norma_principal:'RETIE 2013 + NTC 2050',complementarias:['IEC 60826','IEEE 524','UPME'],limites:{uts_viento:0.50,uts_eds:0.18,deflexion:0.03,factor_seguridad:2.5},viento_ref:27,tmin:5,tmax:40,teds:25},
  mexico:{pais:'México',flag:'🇲🇽',norma_principal:'NOM-001-SEDE-2012',complementarias:['CFE L0000-45','IEC 60826'],limites:{uts_viento:0.50,uts_eds:0.18,deflexion:0.03,factor_seguridad:2.5},viento_ref:28,tmin:5,tmax:42,teds:25},
  peru:{pais:'Perú',flag:'🇵🇪',norma_principal:'CNE Suministro 2011',complementarias:['IEC 60826','DGE-032'],limites:{uts_viento:0.50,uts_eds:0.18,deflexion:0.025,factor_seguridad:2.5},viento_ref:25,tmin:5,tmax:38,teds:24},
  chile:{pais:'Chile',flag:'🇨🇱',norma_principal:'SEC / NCh 433',complementarias:['IEC 60826','IEEE 659'],limites:{uts_viento:0.50,uts_eds:0.20,deflexion:0.03,factor_seguridad:2.5},viento_ref:30,tmin:0,tmax:40,teds:22},
  ecuador:{pais:'Ecuador',flag:'🇪🇨',norma_principal:'Regulación ARCONEL',complementarias:['IEC 60826','IEEE 524'],limites:{uts_viento:0.50,uts_eds:0.18,deflexion:0.03,factor_seguridad:2.5},viento_ref:26,tmin:8,tmax:38,teds:25},
  argentina:{pais:'Argentina',flag:'🇦🇷',norma_principal:'ENRE / AEA 95302',complementarias:['IEC 60826','IRAM 2186'],limites:{uts_viento:0.50,uts_eds:0.18,deflexion:0.03,factor_seguridad:2.5},viento_ref:28,tmin:-5,tmax:42,teds:20},
  bolivia:{pais:'Bolivia',flag:'🇧🇴',norma_principal:'CNE Bolivia',complementarias:['IEC 60826'],limites:{uts_viento:0.50,uts_eds:0.18,deflexion:0.03,factor_seguridad:2.5},viento_ref:24,tmin:0,tmax:38,teds:22},
  panama:{pais:'Panamá',flag:'🇵🇦',norma_principal:'ETESA / ASEP',complementarias:['IEC 60826','IEEE 524'],limites:{uts_viento:0.50,uts_eds:0.18,deflexion:0.03,factor_seguridad:2.5},viento_ref:30,tmin:20,tmax:35,teds:28},
};


// ══════════════════════════════════════════════════════════════════
//  CATÁLOGO DE CONDUCTORES v5
// ══════════════════════════════════════════════════════════════════
const CONDUCTORES=[
  {id:'acsr_1_0',tipo:'ACSR',calibre:'1/0 AWG',nombre:'ACSR 1/0 AWG — RAVEN',nivel:'mt',diam_mm:11.68,peso_km:0.347,uts_kn:20.9,seccion_mm2:53.5,moe_kg_mm2:7100,alpha_1e6:19.3,tmax:75,ampacidad:185},
  {id:'acsr_2_0',tipo:'ACSR',calibre:'2/0 AWG',nombre:'ACSR 2/0 AWG — QUAIL',nivel:'mt',diam_mm:13.26,peso_km:0.420,uts_kn:25.2,seccion_mm2:67.4,moe_kg_mm2:7100,alpha_1e6:19.3,tmax:75,ampacidad:230},
  {id:'acsr_3_0',tipo:'ACSR',calibre:'3/0 AWG',nombre:'ACSR 3/0 AWG — PIGEON',nivel:'mt',diam_mm:14.88,peso_km:0.529,uts_kn:31.5,seccion_mm2:85.0,moe_kg_mm2:7000,alpha_1e6:19.3,tmax:75,ampacidad:270},
  {id:'acsr_4_0',tipo:'ACSR',calibre:'4/0 AWG',nombre:'ACSR 4/0 AWG — PENGUIN',nivel:'mt',diam_mm:16.76,peso_km:0.668,uts_kn:38.4,seccion_mm2:107.2,moe_kg_mm2:6900,alpha_1e6:19.3,tmax:75,ampacidad:310},
  {id:'acsr_336',tipo:'ACSR',calibre:'336.4 kcmil',nombre:'ACSR 336.4 kcmil — MERLIN',nivel:'mt',diam_mm:18.80,peso_km:0.769,uts_kn:51.6,seccion_mm2:170.5,moe_kg_mm2:6800,alpha_1e6:19.3,tmax:75,ampacidad:460},
  {id:'acsr_477',tipo:'ACSR',calibre:'477 kcmil',nombre:'ACSR 477 kcmil — HAWK',nivel:'mt',diam_mm:23.60,peso_km:1.081,uts_kn:70.1,seccion_mm2:241.7,moe_kg_mm2:6800,alpha_1e6:19.3,tmax:75,ampacidad:590},
  {id:'acsr_556',tipo:'ACSR',calibre:'556.5 kcmil',nombre:'ACSR 556.5 kcmil — DOVE',nivel:'mt',diam_mm:24.21,peso_km:1.141,uts_kn:78.2,seccion_mm2:281.9,moe_kg_mm2:6700,alpha_1e6:19.3,tmax:75,ampacidad:640},
  {id:'aaac_350',tipo:'AAAC',calibre:'350 kcmil',nombre:'AAAC 350 kcmil',nivel:'mt',diam_mm:17.27,peso_km:0.482,uts_kn:30.0,seccion_mm2:177.3,moe_kg_mm2:6900,alpha_1e6:23.0,tmax:90,ampacidad:420},
  {id:'aaac_500',tipo:'AAAC',calibre:'500 kcmil',nombre:'AAAC 500 kcmil',nivel:'mt',diam_mm:20.65,peso_km:0.688,uts_kn:42.5,seccion_mm2:253.4,moe_kg_mm2:6900,alpha_1e6:23.0,tmax:90,ampacidad:530},
  {id:'acar_250',tipo:'ACAR',calibre:'250 kcmil',nombre:'ACAR 250 kcmil',nivel:'mt',diam_mm:16.51,peso_km:0.532,uts_kn:35.0,seccion_mm2:126.7,moe_kg_mm2:7000,alpha_1e6:21.0,tmax:85,ampacidad:380},
  {id:'aac_2_0',tipo:'AAC',calibre:'2/0 AWG',nombre:'AAC 2/0 AWG — BRANT',nivel:'mt',diam_mm:11.18,peso_km:0.183,uts_kn:11.6,seccion_mm2:67.4,moe_kg_mm2:5700,alpha_1e6:23.0,tmax:75,ampacidad:240},
  {id:'cu_2_0',tipo:'Cu',calibre:'2/0 AWG',nombre:'Cu sólido 2/0 AWG',nivel:'mt',diam_mm:10.40,peso_km:0.546,uts_kn:18.4,seccion_mm2:67.4,moe_kg_mm2:12500,alpha_1e6:17.0,tmax:75,ampacidad:290},
  {id:'mx_4x4',tipo:'Multiplex',calibre:'4×#4 AWG',nombre:'Multiplex 4×#4 AWG Cu',nivel:'bt',diam_mm:18.6,peso_km:0.940,uts_kn:10.3,seccion_mm2:21.1,moe_kg_mm2:12500,alpha_1e6:17.0,tmax:75,ampacidad:100},
  {id:'mx_4x2',tipo:'Multiplex',calibre:'4×#2 AWG',nombre:'Multiplex 4×#2 AWG Cu',nivel:'bt',diam_mm:22.3,peso_km:1.430,uts_kn:16.1,seccion_mm2:33.6,moe_kg_mm2:12500,alpha_1e6:17.0,tmax:75,ampacidad:130},
  {id:'mx_4x1_0',tipo:'Multiplex',calibre:'4×1/0 AWG',nombre:'Multiplex 4×1/0 AWG Cu',nivel:'bt',diam_mm:26.8,peso_km:2.200,uts_kn:25.5,seccion_mm2:53.5,moe_kg_mm2:12500,alpha_1e6:17.0,tmax:75,ampacidad:170},
  {id:'mx_4x2_0',tipo:'Multiplex',calibre:'4×2/0 AWG',nombre:'Multiplex 4×2/0 AWG Cu',nivel:'bt',diam_mm:30.2,peso_km:2.900,uts_kn:32.0,seccion_mm2:67.4,moe_kg_mm2:12500,alpha_1e6:17.0,tmax:75,ampacidad:210},
];


// ══════════════════════════════════════════════════════════════════
//  CATÁLOGO CONDUCTORES
// ══════════════════════════════════════════════════════════════════
function filtrarCat(){
  const tipo=document.getElementById('cat-filt-tipo')?.value||'';
  const nivel=document.getElementById('cat-filt-nivel')?.value||'';
  const nivel_actual=currentNivel;
  const filtrados=CONDUCTORES.filter(c=>{
    if(tipo&&c.tipo!==tipo)return false;
    if(nivel&&c.nivel!==nivel)return false;
    if(!tipo&&!nivel&&c.nivel!==nivel_actual)return false;
    return true;
  });

  // Poblar select del wizard
  const sel=document.getElementById('f-cat-cond');
  if(sel){
    sel.innerHTML='<option value="">— Seleccione o ingrese manual —</option>'+
    CONDUCTORES.filter(c=>c.nivel===currentNivel).map(c=>`<option value="${c.id}">[${c.tipo}] ${c.nombre}</option>`).join('');
  }

  document.getElementById('cat-grid').innerHTML=filtrados.map(c=>`
<div class="cat-card" onclick="aplicarCatCond('${c.id}')">
  <div class="cat-tipo">${c.tipo} · ${c.nivel.toUpperCase()}</div>
  <div class="cat-nombre">${c.nombre}</div>
  <div class="cat-params">
    <div class="cat-row"><span class="cat-lbl">Diámetro</span><span class="cat-val">${c.diam_mm} mm</span></div>
    <div class="cat-row"><span class="cat-lbl">Peso</span><span class="cat-val">${c.peso_km} kg/m</span></div>
    <div class="cat-row"><span class="cat-lbl">UTS</span><span class="cat-val">${c.uts_kn} kN</span></div>
    <div class="cat-row"><span class="cat-lbl">Sección</span><span class="cat-val">${c.seccion_mm2} mm²</span></div>
    <div class="cat-row"><span class="cat-lbl">Módulo E</span><span class="cat-val">${c.moe_kg_mm2} kg/mm²</span></div>
    <div class="cat-row"><span class="cat-lbl">Ampacidad</span><span class="cat-val">${c.ampacidad} A</span></div>
  </div>
</div>`).join('');
}

function aplicarCatCond(id){
  const c=CONDUCTORES.find(x=>x.id===id);
  if(!c)return;
  document.getElementById('f-cond').value=c.nombre;
  document.getElementById('f-diam').value=c.diam_mm;
  document.getElementById('f-peso').value=c.peso_km;
  document.getElementById('f-uts').value=c.uts_kn;
  document.getElementById('f-seccion').value=c.seccion_mm2;
  document.getElementById('f-moe').value=c.moe_kg_mm2;
  document.getElementById('f-alpha').value=c.alpha_1e6;
  if(document.getElementById('f-cat-cond'))document.getElementById('f-cat-cond').value=id;
  showPanel('calc');showTab(null,'t-cond',true);
}


// ══════════════════════════════════════════════════════════════════
//  NORMATIVA
// ══════════════════════════════════════════════════════════════════
function renderNorm(){
  document.getElementById('norm-grid').innerHTML=Object.values(NORMATIVA).map(n=>`
<div class="norm-card">
  <div class="norm-flag">${n.flag}</div>
  <div class="norm-country">${n.pais}</div>
  <div class="norm-norma">${n.norma_principal}</div>
  <div class="norm-params">
    <div class="norm-row"><span class="norm-lbl">%UTS viento</span><span class="norm-val">≤ ${(n.limites.uts_viento*100).toFixed(0)}%</span></div>
    <div class="norm-row"><span class="norm-lbl">%UTS EDS</span><span class="norm-val">≤ ${(n.limites.uts_eds*100).toFixed(0)}%</span></div>
    <div class="norm-row"><span class="norm-lbl">Deflexión f/L</span><span class="norm-val">≤ ${(n.limites.deflexion*100).toFixed(1)}%</span></div>
    <div class="norm-row"><span class="norm-lbl">Viento ref.</span><span class="norm-val">${n.viento_ref} m/s</span></div>
    <div class="norm-row"><span class="norm-lbl">T_min / T_max</span><span class="norm-val">${n.tmin}°C / ${n.tmax}°C</span></div>
  </div>
</div>`).join('');
}


// ══════════════════════════════════════════════════════════════════
//  SINCRONIZACIÓN PAÍS
// ══════════════════════════════════════════════════════════════════
function sincPais(){
  const pais=document.getElementById('f-pais').value;
  const n=NORMATIVA[pais]||NORMATIVA.colombia;
  document.getElementById('calc-sub').textContent=`${currentNivel.toUpperCase()} · ${n.norma_principal} · ${n.pais}`;
  document.getElementById('f-viento').value=n.viento_ref;
  document.getElementById('f-tmax').value=n.tmax;
  document.getElementById('f-tmin').value=n.tmin;
  document.getElementById('f-teds').value=n.teds;
}


// ══════════════════════════════════════════════════════════════════
//  DASHBOARD DEL PROYECTO
// ══════════════════════════════════════════════════════════════════
function renderDashboard(){
  const d=proyData;const t=d.length;
  const cumple=d.filter(e=>e.estado==='cumple').length;
  const revisar=d.filter(e=>e.estado==='revisar').length;
  const critico=d.filter(e=>e.estado==='critico').length;
  const indet=d.filter(e=>e.estado==='indeterminado').length;
  const pais=document.getElementById('f-pais')?.value||'colombia';
  const norm=NORMATIVA[pais]||NORMATIVA.colombia;

  document.getElementById('dash-sub').textContent=`${t} estructuras · ${norm.pais} · ${norm.norma_principal}`;
  document.getElementById('nb-err').style.display=critico>0?'':'none';
  document.getElementById('nb-err').textContent=critico;

  const topRiesgo=[...d].sort((a,b)=>(b.score||0)-(a.score||0)).slice(0,5);
  document.getElementById('dash-body').innerHTML=`
<div class="metric-grid">
  <div class="metric ok"><div class="m-label">Sin incumplimientos</div><div class="m-val">${cumple}</div><div class="m-unit">${t>0?Math.round(cumple/t*100):0}% del proyecto</div><div class="progress"><div class="pf pf-ok" style="width:${t>0?cumple/t*100:0}%"></div></div></div>
  <div class="metric warn"><div class="m-label">Revisión</div><div class="m-val">${revisar}</div><div class="m-unit">Próximas a límite</div><div class="progress"><div class="pf pf-warn" style="width:${t>0?revisar/t*100:0}%"></div></div></div>
  <div class="metric err"><div class="m-label">Críticas</div><div class="m-val">${critico}</div><div class="m-unit">Con incumplimientos</div><div class="progress"><div class="pf pf-err" style="width:${t>0?critico/t*100:0}%"></div></div></div>
  <div class="metric info"><div class="m-label">Indeterminadas</div><div class="m-val">${indet}</div><div class="m-unit">Datos insuficientes</div></div>
</div>
<div class="g2">
  <div class="card"><div class="sec-lbl">Top estructuras por riesgo</div>
    <div class="rank-list">${topRiesgo.map((e,i)=>`<div class="rank-item"><span class="rank-n">${i+1}</span><div class="rank-info"><div class="rank-id">${e.id_estructura}</div><div class="rank-det">${e.tipo_apoyo||'—'} · vano ${e.vano||'—'}m · %UTS ${fp(e.pct_uts_viento)}</div></div><span class="badge ${e.estado==='critico'?'b-err':e.estado==='revisar'?'b-warn':'b-ok'}">${e.estado||'—'}</span></div>`).join('')}</div>
  </div>
  <div class="card"><div class="sec-lbl">Distribución de estados</div>
    <div style="display:flex;flex-direction:column;gap:9px;margin-top:4px">
      ${[{lbl:'Sin incumplimientos',v:cumple,t,cls:'pf-ok',bcls:'b-ok'},{lbl:'Revisión recomendada',v:revisar,t,cls:'pf-warn',bcls:'b-warn'},{lbl:'Incumplimiento detectado',v:critico,t,cls:'pf-err',bcls:'b-err'}].map(({lbl,v,t,cls,bcls})=>`
      <div>
        <div style="display:flex;justify-content:space-between;margin-bottom:4px"><span style="font-size:11.5px;color:var(--t2)">${lbl}</span><span class="badge ${bcls}">${v} (${t>0?Math.round(v/t*100):0}%)</span></div>
        <div class="progress"><div class="pf ${cls}" style="width:${t>0?v/t*100:0}%"></div></div>
      </div>`).join('')}
    </div>
  </div>
</div>
<div class="alert a-info"><i class="ti ti-info-circle"></i><div>Resultados preliminares por aproximación parabólica. La aceptación final del diseño es responsabilidad del profesional de ingeniería responsable.</div></div>`;
}

function renderTabla(){
  document.getElementById('tbl-sub').textContent=`${proyData.length} estructuras`;
  renderTablaFiltrada(proyData);
}

function renderTablaFiltrada(data){
  const pais=document.getElementById('f-pais')?.value||'colombia';
  const norm=NORMATIVA[pais]||NORMATIVA.colombia;
  const lim=norm.limites;
  document.getElementById('flt-count').textContent=`${data.length} / ${proyData.length}`;
  document.getElementById('res-tbody').innerHTML=data.map(e=>`<tr class="${e.estado==='critico'?'r-err':''}">
    <td><strong>${e.id_estructura}</strong></td>
    <td class="lc">${e.tipo_apoyo||'—'}</td>
    <td class="lc">${(e.conductor||'—').toString().substring(0,18)}</td>
    <td>${e.vano||'—'}</td>
    <td>${e.angulo!=null?e.angulo+'°':'—'}</td>
    <td style="color:${e.pct_uts_viento>lim.uts_viento?'var(--err)':'var(--ok)'}">${fp(e.pct_uts_viento)}</td>
    <td style="color:${e.pct_estructura>1?'var(--err)':'var(--ok)'}">${fp(e.pct_estructura)}</td>
    <td>${fn(e.flecha_vert)}</td>
    <td><span class="score-bar"><span class="score-fill" style="width:${Math.min(e.score||0,100)}%;background:${(e.score||0)>=75?'var(--err)':(e.score||0)>=45?'var(--accent)':'var(--ok)'}"></span></span>${e.score||0}</td>
    <td><span class="badge ${e.estado==='cumple'?'b-ok':e.estado==='critico'?'b-err':e.estado==='revisar'?'b-warn':'b-indet'}">${(e.estado||'INDET').toUpperCase()}</span></td>
  </tr>`).join('');
}

function filtrarTabla(){
  const est=document.getElementById('flt-estado').value;
  const busq=document.getElementById('flt-busq').value.toLowerCase();
  const data=proyData.filter(e=>{
    if(est&&e.estado!==est)return false;
    if(busq&&!(e.id_estructura||'').toLowerCase().includes(busq))return false;
    return true;
  });
  renderTablaFiltrada(data);
}

function renderCriticas(){
  const criticas=proyData.filter(e=>e.estado==='critico'||e.estado==='revisar');
  document.getElementById('crit-sub').textContent=`${criticas.length} estructura(s) requieren atención`;
  if(!criticas.length){document.getElementById('crit-body').innerHTML='<div class="empty"><i class="ti ti-mood-happy"></i><div class="empty-title">Sin estructuras críticas</div><div class="empty-sub">Todas las estructuras cumplen los criterios preliminares</div></div>';return;}
  document.getElementById('crit-body').innerHTML=criticas.map(e=>`
<div class="card-sm" style="border-left:3px solid ${e.estado==='critico'?'var(--err)':'var(--accent)'}">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:7px">
    <strong style="font-family:var(--f-display)">${e.id_estructura}</strong>
    <span class="badge ${e.estado==='critico'?'b-err':'b-warn'}">${e.estado.toUpperCase()}</span>
  </div>
  <div class="g3" style="gap:7px">
    <div style="font-size:11px"><span style="color:var(--t3)">%UTS:</span> <strong>${fp(e.pct_uts_viento)}</strong></div>
    <div style="font-size:11px"><span style="color:var(--t3)">Uso est.:</span> <strong>${fp(e.pct_estructura)}</strong></div>
    <div style="font-size:11px"><span style="color:var(--t3)">Score:</span> <strong>${e.score}</strong></div>
  </div>
</div>`).join('');
}

function cargarDemo(){
  procesarProyecto([
    {id_estructura:'E-001',tipo_apoyo:'Alineación',conductor:'ACSR 2/0 — QUAIL',vano:75,angulo:0,diam_mm:13.26,peso_km:0.420,uts_kn:25.2,carga_rot_kn:7.35},
    {id_estructura:'E-002',tipo_apoyo:'Angular',conductor:'ACSR 2/0 — QUAIL',vano:80,angulo:15,diam_mm:13.26,peso_km:0.420,uts_kn:25.2,carga_rot_kn:7.35},
    {id_estructura:'E-003',tipo_apoyo:'Retención',conductor:'ACSR 4/0 — PENGUIN',vano:100,angulo:35,diam_mm:16.76,peso_km:0.668,uts_kn:38.4,carga_rot_kn:10.0},
    {id_estructura:'E-004',tipo_apoyo:'Alineación',conductor:'ACSR 2/0 — QUAIL',vano:60,angulo:0,diam_mm:13.26,peso_km:0.420,uts_kn:25.2,carga_rot_kn:7.35},
    {id_estructura:'E-005',tipo_apoyo:'Terminal',conductor:'ACSR 4/0 — PENGUIN',vano:50,angulo:0,diam_mm:16.76,peso_km:0.668,uts_kn:38.4,carga_rot_kn:10.0},
    {id_estructura:'E-006',tipo_apoyo:'Alineación',conductor:'AAAC 350',vano:90,angulo:2,diam_mm:17.27,peso_km:0.482,uts_kn:30.0,carga_rot_kn:7.35},
    {id_estructura:'E-007',tipo_apoyo:'Angular',conductor:'ACSR 336 — MERLIN',vano:120,angulo:22,diam_mm:18.80,peso_km:0.769,uts_kn:51.6,carga_rot_kn:12.5},
  ]);
}

function exportarXLSX(){
  if(!proyData.length){alert('No hay datos para exportar.');return;}
  const ws=XLSX.utils.json_to_sheet(proyData.map(e=>({
    ID:e.id_estructura,Tipo:e.tipo_apoyo,Conductor:e.conductor,
    Vano_m:e.vano,'Angulo_deg':e.angulo,
    '%UTS_viento':e.pct_uts_viento?((e.pct_uts_viento*100).toFixed(1)+'%'):'—',
    'Uso_estructura':e.pct_estructura?((e.pct_estructura*100).toFixed(1)+'%'):'—',
    Flecha_m:e.flecha_vert,Score:e.score,Estado:e.estado
  })));
  const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Resultados');
  XLSX.writeFile(wb,'mecline_resultados_v5.xlsx');
}
function exportarDatos(){
  const blob=new Blob([JSON.stringify({proyData,brandData},null,2)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='mecline_proyecto_v5.json';a.click();
}


// ══════════════════════════════════════════════════════════════════
//  WIZARD v5 (7 pasos incluyendo conjunto)
// ══════════════════════════════════════════════════════════════════
let wizPaso=0;
const PASOS=['Proyecto','Condiciones','Conductor','Geometría','Estructura','Conjunto','Verificar'];
const ICONS=['ti-info-circle','ti-cloud','ti-bolt','ti-vector-triangle','ti-building','ti-building-factory','ti-check'];

function renderWizNav(){
  document.getElementById('wiz-steps').innerHTML=PASOS.map((p,i)=>`
<div class="ws ${i<wizPaso?'done':i===wizPaso?'active':''}" id="ws-${i}">
  <div class="ws-circle">${i<wizPaso?'✓':i+1}</div>
  <div class="ws-label">${p}</div>
</div>${i<PASOS.length-1?'<div class="ws-sep"></div>':''}`).join('');
  for(let i=0;i<PASOS.length;i++){
    const nav=document.getElementById(`nav-wiz-${i}`);
    if(nav){nav.classList.toggle('on',i===wizPaso);}
  }
}

function irPaso(n){wizPaso=n;renderWizNav();renderWizPaso();}
function renderWizPaso(){
  const contenidos=[
    `<div class="card"><div class="sec-lbl">Datos del proyecto</div><div class="g2">
      <div class="fg"><label>Nombre del proyecto</label><input id="wf-nombre" value="Red Aérea Rural L-01"/></div>
      <div class="fg"><label>Cliente</label><input id="wf-cliente" value="Empresa distribuidora"/></div>
      <div class="fg"><label>País</label><select id="wf-pais"><option value="colombia">🇨🇴 Colombia</option><option value="mexico">🇲🇽 México</option><option value="peru">🇵🇪 Perú</option><option value="chile">🇨🇱 Chile</option></select></div>
      <div class="fg"><label>Elaborado por</label><input id="wf-elab" value="Ing. diseñador"/></div>
    </div></div>`,
    `<div class="card"><div class="sec-lbl">Condiciones ambientales</div><div class="g3">
      <div class="fg"><label>Viento máx. (m/s)</label><input id="wf-viento" type="number" value="27"/></div>
      <div class="fg"><label>T_máx (°C)</label><input id="wf-tmax" type="number" value="40"/></div>
      <div class="fg"><label>T_mín (°C)</label><input id="wf-tmin" type="number" value="5"/></div>
    </div></div>`,
    `<div class="card"><div class="sec-lbl">Selección de conductor</div><div class="g2">
      <div class="fg span2"><label>Catálogo</label><select id="wf-cat" onchange="wizApCond(this.value)"><option value="">— Seleccione —</option>${CONDUCTORES.map(c=>`<option value="${c.id}">[${c.tipo}] ${c.nombre}</option>`).join('')}</select></div>
      <div class="fg"><label>Diámetro (mm)</label><input id="wf-diam" type="number" value="13.26"/></div>
      <div class="fg"><label>Peso (kg/m)</label><input id="wf-peso" type="number" value="0.420"/></div>
      <div class="fg"><label>UTS (kN)</label><input id="wf-uts" type="number" value="25.2"/></div>
    </div></div>`,
    `<div class="card"><div class="sec-lbl">Geometría</div><div class="g3">
      <div class="fg"><label>Vano (m)</label><input id="wf-vano" type="number" value="75"/></div>
      <div class="fg"><label>Ángulo (°)</label><input id="wf-ang" type="number" value="0"/></div>
      <div class="fg"><label>Tipo de apoyo</label><select id="wf-tipo"><option value="alineacion">Alineación</option><option value="angular">Angular</option><option value="retencion">Retención</option><option value="terminal">Terminal</option></select></div>
    </div></div>`,
    `<div class="card"><div class="sec-lbl">Estructura y apoyo</div><div class="g2">
      <div class="fg"><label>Tipo de poste</label><select id="wf-poste"><option value="concreto">Concreto</option><option value="acero">Acero</option><option value="madera">Madera</option></select></div>
      <div class="fg"><label>Carga rotura (kN)</label><input id="wf-crot" type="number" value="7.35"/></div>
      <div class="fg"><label>Altura poste (m)</label><input id="wf-hposte" type="number" value="12"/></div>
      <div class="fg"><label>Equipos</label><select id="wf-equipos" multiple style="height:70px"><option value="ninguno" selected>Ninguno</option><option value="transformador">Transformador</option><option value="cortacircuito">Cortacircuito</option><option value="dps">DPS</option></select></div>
    </div></div>`,
    `<div class="card"><div class="sec-lbl">Conjunto constructivo</div>
      <div class="alert a-violet"><i class="ti ti-building-factory"></i><div>El sistema sugerirá automáticamente el conjunto constructivo aplicable según los datos ingresados.</div></div>
      <div class="fg" style="margin-top:10px"><label>¿Hay equipos instalados?</label><select id="wf-eq2" multiple style="height:70px"><option value="ninguno" selected>Ninguno</option><option value="transformador">Transformador</option><option value="cortacircuito">Cortacircuito</option><option value="dps">DPS</option></select></div>
      <div class="fg" style="margin-top:8px"><label>Estado de la estructura</label><select id="wf-est-e"><option value="nueva">Nueva</option><option value="existente">Existente</option></select></div>
      <div id="wiz-conj-result" style="margin-top:10px"></div>
    </div>`,
    `<div id="wiz-ver-body"><div class="empty"><i class="ti ti-calculator"></i><div class="empty-title">Listo para verificar</div><div class="empty-sub">Haga clic en "Calcular" para ver los resultados</div></div></div>`,
  ];
  document.getElementById('wiz-body').innerHTML=contenidos[wizPaso]||'';
  document.getElementById('wiz-actions').innerHTML=`
    ${wizPaso>0?`<button class="btn" onclick="irPaso(${wizPaso-1})"><i class="ti ti-arrow-left"></i>Anterior</button>`:''}
    ${wizPaso<PASOS.length-1?`<button class="btn btn-primary" onclick="irPaso(${wizPaso+1})"><i class="ti ti-arrow-right"></i>Siguiente</button>`:''}
    ${wizPaso===PASOS.length-1?`<button class="btn btn-accent" onclick="wizCalc()"><i class="ti ti-calculator"></i>Calcular y verificar</button>`:''}
    ${wizPaso===5?`<button class="btn btn-violet" onclick="wizRecomConjunto()"><i class="ti ti-wand"></i>Sugerir conjunto</button>`:''}
  `;
  renderWizNav();
}

function wizApCond(id){
  const c=CONDUCTORES.find(x=>x.id===id);if(!c)return;
  const d=v=>document.getElementById(v);
  if(d('wf-diam'))d('wf-diam').value=c.diam_mm;
  if(d('wf-peso'))d('wf-peso').value=c.peso_km;
  if(d('wf-uts'))d('wf-uts').value=c.uts_kn;
}

function wizRecomConjunto(){
  const ang=parseFloat(document.getElementById('wf-ang')?.value)||0;
  const vano=parseFloat(document.getElementById('wf-vano')?.value)||75;
  const tipo=document.getElementById('wf-tipo')?.value||'alineacion';
  const pais=document.getElementById('wf-pais')?.value||'colombia';
  const equipos=[...document.getElementById('wf-eq2')?.selectedOptions||[]].map(o=>o.value);
  const angForzado=tipo==='terminal'?0:tipo==='retencion'?45:ang;
  const angMin=tipo==='suspension'?0:tipo==='angular'?5:tipo==='retencion'?30:angForzado;
  const cands=CONJUNTOS.filter(c=>c.ang_min<=angForzado&&c.ang_max>=angForzado&&(c.vano_max===999||(vano>=c.vano_min&&vano<=c.vano_max)));
  const rec=equipos.includes('transformador')?cands.find(c=>c.tipo==='transformador')||cands[0]:cands[0];
  document.getElementById('wiz-conj-result').innerHTML=rec?`<div class="alert a-ok"><i class="ti ti-circle-check"></i><div><strong>Conjunto recomendado:</strong> ${rec.codigo}<br>${rec.nombre}<br><small>Aplicable preliminarmente bajo los criterios evaluados.</small></div></div>`:
  `<div class="alert a-warn"><i class="ti ti-alert-triangle"></i><div>No se encontró conjunto estándar para estos parámetros. Consulte al diseñador.</div></div>`;
}

function wizCalc(){
  const pais=document.getElementById('wf-pais')?.value||'colombia';
  const norm=NORMATIVA[pais]||NORMATIVA.colombia;
  const params={
    vano:parseFloat(document.getElementById('wf-vano')?.value)||75,
    angulo:parseFloat(document.getElementById('wf-ang')?.value)||0,
    viento_ms:parseFloat(document.getElementById('wf-viento')?.value)||norm.viento_ref,
    diam_m:(parseFloat(document.getElementById('wf-diam')?.value)||13.26)/1000,
    peso_km:parseFloat(document.getElementById('wf-peso')?.value)||0.420,
    uts_kn:parseFloat(document.getElementById('wf-uts')?.value)||25.2,
    carga_rot_kn:parseFloat(document.getElementById('wf-crot')?.value)||7.35,
    h_poste:parseFloat(document.getElementById('wf-hposte')?.value)||12,
    h_amarre:parseFloat(document.getElementById('wf-hposte')?.value)||11,
    tipo_poste:document.getElementById('wf-poste')?.value||'concreto',
    tmax:norm.tmax,tmin:norm.tmin,teds:norm.teds
  };
  const calc=motorCalculo(params,norm.limites);
  const estado=determinarEstado(calc,norm.limites);
  ultimoResultado={calc,estado,conf:nivelConfianza(params,calc),params,norm,lim:norm.limites};
  document.getElementById('wiz-ver-body').innerHTML=`
<div class="metric-grid">
  <div class="metric ${calc.ok_uts?'ok':'err'}"><div class="m-label">%UTS viento</div><div class="m-val">${fp(calc.pct_uts_viento)}</div><div class="m-unit">Límite: ${fp(norm.limites.uts_viento)}</div></div>
  <div class="metric ${calc.ok_est?'ok':'err'}"><div class="m-label">Uso estructura</div><div class="m-val">${fp(calc.pct_estructura)}</div></div>
  <div class="metric ${calc.ok_eds?'ok':'warn'}"><div class="m-label">%UTS EDS</div><div class="m-val">${fp(calc.hip_eds.pct_uts)}</div></div>
  <div class="metric info"><div class="m-label">Flecha EDS</div><div class="m-val">${fn(calc.flecha_vert)}</div><div class="m-unit">m</div></div>
</div>
<div class="alert ${estado==='cumple'?'a-ok':estado==='critico'?'a-err':'a-warn'}">
  <i class="ti ti-${estado==='cumple'?'circle-check':estado==='critico'?'alert-octagon':'alert-triangle'}"></i>
  <div><strong>Estado preliminar: ${estado.toUpperCase()}</strong><br><small>${calc.supuesto}<br><strong>La aceptación final es responsabilidad del profesional responsable.</strong></small></div>
</div>`;
}

