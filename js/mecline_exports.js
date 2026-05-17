/* ═══════════════════════════════════════════════════════════════════
   MecLine LATAM — mecline_exports.js
   Proyecto: Voryn Energy / MecLine LATAM
   Prefijo: mecline_  |  NO mezclar con DimElec, TerraDoc ni Landing Voryn
   ═══════════════════════════════════════════════════════════════════ */

'use strict';

// ══════════════════════════════════════════════════════════════════
//  MEMORIA TÉCNICA HTML
// ══════════════════════════════════════════════════════════════════
function genMemHTML(){
  const d=proyData;const pais=document.getElementById('f-pais')?.value||'colombia';
  const norm=NORMATIVA[pais]||NORMATIVA.colombia;
  const nom=document.getElementById('f-nombre')?.value||document.getElementById('br-nombre')?.value||'Proyecto';
  const emp=document.getElementById('br-nombre')?.value||document.getElementById('f-empresa')?.value||'Empresa';
  const elab=document.getElementById('f-elab')?.value||'Ing. Responsable';
  const ver=document.getElementById('mem-ver')?.value||'V01';
  const cod=document.getElementById('mem-cod')?.value||'CM-001';
  const pri=document.getElementById('br-c1')?.value||'#0B3D91';
  const total=d.length;
  const cumple=d.filter(e=>e.estado==='cumple').length;
  const revisar=d.filter(e=>e.estado==='revisar').length;
  const critico=d.filter(e=>e.estado==='critico').length;
  const indet=d.filter(e=>e.estado==='indeterminado').length;
  const pct=total>0?Math.round(cumple/total*100):0;
  const lim=norm.limites;
  const fecha=new Date().toLocaleDateString('es-CO');

  const html=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"/><title>Memoria Técnica — ${nom}</title>
<style>
body{font-family:'Segoe UI',sans-serif;max-width:900px;margin:0 auto;padding:24pt;font-size:10pt;color:#1a1a2e;line-height:1.6}
@media print{.no-print{display:none}body{padding:12pt}}
h1{font-size:16pt;color:${pri};border-bottom:2px solid ${pri};padding-bottom:6pt;margin-top:18pt}
h2{font-size:12pt;color:${pri};margin-top:14pt;margin-bottom:6pt;border-left:3px solid ${pri};padding-left:8pt}
h3{font-size:10.5pt;color:#3d4a5c;margin-top:10pt;margin-bottom:4pt}
table{width:100%;border-collapse:collapse;font-size:9.5pt;margin-bottom:10pt}
th{background:${pri};color:#fff;padding:5pt 7pt;text-align:left;font-weight:600}
td{padding:4pt 7pt;border-bottom:1px solid #dee2ea}tr:hover td{background:#f5f7fa}
.ok{color:#0d8a4e;font-weight:700}.warn{color:#9a5800;font-weight:700}.err{color:#c8190d;font-weight:700}
.nota{background:#f0f4fb;border-left:3px solid ${pri};padding:8pt 10pt;font-size:9pt;margin:8pt 0;color:#3d4a5c}
.firma-grid{display:flex;gap:20pt;margin-top:20pt}
.firma-box{flex:1;border-top:1px solid #dee2ea;padding-top:6pt;font-size:9pt;color:#5a6478}
.header{display:flex;align-items:center;justify-content:space-between;padding:10pt 0;border-bottom:2px solid ${pri};margin-bottom:16pt}
.legal{font-size:8pt;color:#8a92a8;border-top:1px solid #dee2ea;padding-top:8pt;margin-top:16pt;text-align:center}
.score-fill{display:inline-block;height:6px;background:${pri};border-radius:3px;vertical-align:middle}
.hip-table{margin-top:6pt}
</style></head><body>
<button class="no-print" onclick="window.print()" style="position:fixed;top:10px;right:10px;background:${pri};color:#fff;border:none;padding:7px 15px;border-radius:5px;cursor:pointer;font-size:10pt;z-index:100">🖨️ Imprimir / PDF</button>
<div class="header">
  <div>
    <div style="font-size:14pt;font-weight:700;color:${pri}">${emp.toUpperCase()}</div>
    <div style="font-size:8.5pt;color:#8a92a8">${document.getElementById('br-eslogan')?.value||'Ingeniería eléctrica'}</div>
  </div>
  <div style="text-align:right;font-size:9pt;color:#5a6478">
    <strong>MEMORIA TÉCNICA DE CÁLCULO MECÁNICO</strong><br>
    ${norm.flag} ${norm.pais} · ${norm.norma_principal}<br>
    Documento: ${cod}
  </div>
</div>
<h1>Memoria Técnica — Cálculo Mecánico de Redes Aéreas</h1>
<table><tr><th colspan="2">Identificación del documento</th></tr>
<tr><td><strong>Proyecto</strong></td><td>${nom}</td></tr>
<tr><td><strong>Empresa</strong></td><td>${emp}</td></tr>
<tr><td><strong>Elaborado por</strong></td><td>${elab}</td></tr>
<tr><td><strong>País / Normativa</strong></td><td>${norm.flag} ${norm.pais} · ${norm.norma_principal}</td></tr>
<tr><td><strong>Normas complementarias</strong></td><td>${norm.complementarias.join(', ')}</td></tr>
<tr><td><strong>Nivel de tensión</strong></td><td>${currentNivel==='bt'?'Baja Tensión':'Media Tensión'}</td></tr>
<tr><td><strong>Estructuras analizadas</strong></td><td>${total}</td></tr>
<tr><td><strong>Versión</strong></td><td>${ver}</td></tr>
<tr><td><strong>Código</strong></td><td>${cod}</td></tr>
<tr><td><strong>Fecha</strong></td><td>${fecha}</td></tr></table>
<table><tr><th>Rev.</th><th>Fecha</th><th>Descripción</th><th>Elaboró</th><th>Revisó</th></tr>
<tr><td>01</td><td>${fecha}</td><td>Emisión inicial — Verificación técnica preliminar</td><td>${elab}</td><td>—</td></tr></table>
<h2>1. Objeto y alcance</h2>
<p>El presente documento constituye la memoria técnica de verificación mecánica preliminar de la red aérea de ${currentNivel==='bt'?'baja':'media'} tensión correspondiente al proyecto <strong>${nom}</strong>. Se evalúan ${total} estructura(s) bajo los criterios de <strong>${norm.norma_principal}</strong> para ${norm.pais}, mediante aproximación parabólica de la catenaria y cuatro hipótesis de carga.</p>
<div class="nota">Este análisis corresponde a una verificación técnica preliminar. <strong>La aceptación final del diseño debe ser realizada por el profesional de ingeniería responsable.</strong> Los resultados no constituyen aprobación regulatoria ni definitiva.</div>
<h2>2. Marco normativo y parámetros de diseño</h2>
<table><tr><th>Parámetro</th><th>Valor adoptado</th></tr>
<tr><td>Norma principal</td><td>${norm.norma_principal}</td></tr>
<tr><td>Normas complementarias</td><td>${norm.complementarias.join(', ')}</td></tr>
<tr><td>%UTS hipótesis viento (límite)</td><td>≤ ${(lim.uts_viento*100).toFixed(0)}%</td></tr>
<tr><td>%UTS condición EDS (límite)</td><td>≤ ${(lim.uts_eds*100).toFixed(0)}%</td></tr>
<tr><td>Deflexión f/L máxima</td><td>≤ ${(lim.deflexion*100).toFixed(1)}%</td></tr>
<tr><td>Factor de seguridad apoyo</td><td>${lim.factor_seguridad}</td></tr>
<tr><td>Velocidad de viento de referencia</td><td>${norm.viento_ref} m/s</td></tr>
<tr><td>Temperatura mín. / promedio / máx.</td><td>${norm.tmin}°C / ${norm.teds}°C / ${norm.tmax}°C</td></tr></table>
<h2>3. Metodología y hipótesis de carga</h2>
<p>Motor de cálculo: aproximación parabólica de la catenaria (válida para relación f/L menor al 8%). Se evalúan cuatro hipótesis de carga:</p>
<table class="hip-table"><tr><th>Hipótesis</th><th>Descripción</th><th>Límite verificado</th></tr>
<tr><td><strong>A — Viento máximo</strong></td><td>Temperatura coincidente. Carga de viento máxima. Tensión horizontal máxima.</td><td>%UTS ≤ ${(lim.uts_viento*100).toFixed(0)}%</td></tr>
<tr><td><strong>B — Temperatura mínima</strong></td><td>Sin viento. Condición de mayor tensión térmica (aprox. +8% sobre EDS).</td><td>%UTS ≤ ${(lim.uts_viento*100).toFixed(0)}%</td></tr>
<tr><td><strong>C — EDS operación</strong></td><td>Temperatura promedio. Sin viento. Control de vibración y fatiga.</td><td>%UTS ≤ ${(lim.uts_eds*100).toFixed(0)}%</td></tr>
<tr><td><strong>D — Temperatura máxima</strong></td><td>Sin viento. Flecha máxima. Verificación de distancias de seguridad.</td><td>f/L ≤ ${(lim.deflexion*100).toFixed(1)}%</td></tr></table>
<h2>4. Resultados de la verificación</h2>
<table><tr><th>Indicador</th><th>Cantidad</th><th>%</th></tr>
<tr><td class="ok">Sin incumplimientos preliminares</td><td class="ok">${cumple}</td><td class="ok">${pct}%</td></tr>
<tr><td class="warn">Con observaciones — Revisión</td><td class="warn">${revisar}</td><td class="warn">${total>0?Math.round(revisar/total*100):0}%</td></tr>
<tr><td class="err">Con incumplimientos detectados</td><td class="err">${critico}</td><td class="err">${total>0?Math.round(critico/total*100):0}%</td></tr>
<tr><td>Datos insuficientes</td><td>${indet}</td><td>${total>0?Math.round(indet/total*100):0}%</td></tr></table>
<h2>5. Resultados por estructura</h2>
<table><tr><th>ID</th><th>Tipo apoyo</th><th>Conductor</th><th>Vano (m)</th><th>Ángulo</th><th>%UTS viento</th><th>Uso est.</th><th>Score</th><th>Estado</th></tr>
${d.slice(0,100).map(e=>`<tr>
<td><strong>${e.id_estructura||'—'}</strong></td>
<td>${e.tipo_apoyo||'—'}</td>
<td>${(e.conductor||'—').toString().substring(0,18)}</td>
<td>${e.vano||0}</td>
<td>${e.angulo!=null?e.angulo+'°':'—'}</td>
<td class="${e.pct_uts_viento>lim.uts_viento?'err':'ok'}">${fp(e.pct_uts_viento)}</td>
<td class="${e.pct_estructura>=1?'err':'ok'}">${fp(e.pct_estructura)}</td>
<td><span class="score-fill" style="width:${Math.min(e.score||0,100)*0.6}px;background:${(e.score||0)>=75?'#c8190d':(e.score||0)>=45?'#e07b00':'#0d8a4e'}"></span> ${e.score||0}</td>
<td class="${e.estado==='cumple'?'ok':e.estado==='critico'?'err':'warn'}">${(e.estado||'—').toUpperCase()}</td>
</tr>`).join('')}</table>
${total>100?`<div class="nota">Tabla parcial (100 de ${total}). Exporte el XLSX para la lista completa.</div>`:''}
<h2>6. Selección y validación del conjunto constructivo</h2>
<p>La selección del conjunto constructivo debe realizarse de forma individual para cada estructura, en función del ángulo, vano, nivel de tensión, zona y conductores del proyecto. A continuación se indica el criterio general de selección por ángulo de deflexión:</p>
<table><tr><th>Rango de ángulo</th><th>Tipo de conjunto sugerido</th><th>Observación</th></tr>
<tr><td>0° – 5°</td><td>Suspensión</td><td>Tramo recto o deflexión mínima</td></tr>
<tr><td>5° – 30°</td><td>Angular</td><td>Verificar necesidad de retenida para ángulos > 20°</td></tr>
<tr><td>> 30°</td><td>Retención / Anclaje</td><td>Retenidas obligatorias. Verificar capacidad del terreno.</td></tr>
<tr><td>Inicio/fin de línea</td><td>Terminal</td><td>Retenidas obligatorias. Incluir SPT.</td></tr></table>
<div class="nota">Esta selección corresponde a una recomendación preliminar basada en la información ingresada y debe validarse con las normas constructivas vigentes del operador de red o autoridad competente. Use el módulo Conjuntos Constructivos de MecLine LATAM para la recomendación y validación individual.</div>
<h2>7. Conclusiones</h2>
<p>${pct>=80?`El ${pct}% de las estructuras analizadas no presenta incumplimientos preliminares bajo las hipótesis adoptadas y los límites normativos de ${norm.norma_principal}.`:pct>=50?`El ${pct}% de las estructuras no presenta incumplimientos. La proporción con observaciones es significativa y requiere atención en el diseño de detalle.`:`Solo el ${pct}% de las estructuras no presenta incumplimientos preliminares. La mayoría del inventario requiere revisión técnica detallada.`} ${critico>0?`Se identificaron ${critico} estructura(s) con incumplimientos que <strong>no deben implementarse sin corrección del diseño</strong>.`:''} ${indet>0?`${indet} estructura(s) requieren información adicional para ser analizadas completamente.`:''}</p>
<div class="nota">Los resultados corresponden a una verificación técnica preliminar mediante aproximación parabólica. La aceptación final del diseño debe ser realizada por el profesional responsable de ingeniería. No se garantiza cumplimiento normativo definitivo. Verificación generada con apoyo de MecLine LATAM v5.</div>
<h2>8. Firmas y responsabilidades</h2>
<div class="firma-grid">
  <div class="firma-box"><div style="height:45pt"></div>Elaboró: <strong>${elab}</strong><br><small>${emp}</small></div>
  <div class="firma-box"><div style="height:45pt"></div>Revisó:<br><small>Ing. responsable</small></div>
  <div class="firma-box"><div style="height:45pt"></div>Aprobó:<br><small>Ing. responsable</small></div>
</div>
<div class="legal">Verificación técnica preliminar — Apoyo de MecLine LATAM v5 · ${emp} · ${fecha}</div>
</body></html>`;
  const w=window.open('','_blank');if(!w){alert('Active ventanas emergentes.');return;}w.document.write(html);w.document.close();
}

