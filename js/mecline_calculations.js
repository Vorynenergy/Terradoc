/* ═══════════════════════════════════════════════════════════════════
   MecLine LATAM — mecline_calculations.js
   Proyecto: Voryn Energy / MecLine LATAM
   Prefijo: mecline_  |  NO mezclar con DimElec, TerraDoc ni Landing Voryn
   ═══════════════════════════════════════════════════════════════════ */

'use strict';

// ══════════════════════════════════════════════════════════════════
//  CONSTANTES FÍSICAS
// ══════════════════════════════════════════════════════════════════
const G=9.81,RHO=1.225,CD=1.0,FA=1.10,DL=0.30;
const FS_APOYO={concreto:2.5,acero:2.0,fibra:2.0,madera:3.0};


// ══════════════════════════════════════════════════════════════════
//  MOTOR DE CÁLCULO v5
// ══════════════════════════════════════════════════════════════════
function motorCalculo(p,lim){
  const {vano,angulo=0,viento_ms,diam_m,peso_km,uts_kn,carga_rot_kn,h_amarre=11,h_poste=12,tipo_poste='concreto',tmax=40,tmin=5,teds=25,vreg=0}=p;

  // Carga de viento (N/m)
  const Qv=0.5*RHO*Math.pow(viento_ms,2)*CD*diam_m;
  // Peso propio (kg/m)
  const w_pp=peso_km/1000;
  // Peso accesoriado
  const w_acc=w_pp*FA;
  // Carga resultante (kg/m)
  const w_v=Qv/G;
  const w_res=Math.sqrt(Math.pow(w_acc,2)+Math.pow(w_v,2));

  // T_EDS ≈ 18% UTS (hipótesis de partida)
  const T_eds_kn=uts_kn*lim.uts_eds;
  const T_eds_kg=T_eds_kn*1000/G;

  // ── HIPÓTESIS A: VIENTO MÁXIMO ──
  const f_viento_m=T_eds_kg>0?(w_res*vano*vano)/(8*T_eds_kg):null;
  const T_viento_kn=f_viento_m&&f_viento_m>0?(w_res*vano*vano)/(8*f_viento_m)/1000*G:T_eds_kn;
  const pct_uts_viento=T_viento_kn/uts_kn;
  const sl_viento=f_viento_m&&vano>0?f_viento_m/vano:null;

  // ── HIPÓTESIS B: TEMPERATURA MÍNIMA (sin viento — tensión máxima térmica) ──
  // Aproximación: ΔT_min comprime -> mayor tensión que EDS aprox 1.08×EDS
  const T_tmin_kn=T_eds_kn*1.08;
  const f_tmin_m=(w_acc*vano*vano)/(8*T_tmin_kn*1000/G);
  const pct_uts_tmin=T_tmin_kn/uts_kn;
  const sl_tmin=f_tmin_m&&vano>0?f_tmin_m/vano:null;

  // ── HIPÓTESIS C: EDS (condición de operación diaria) ──
  const f_eds_m=(w_acc*vano*vano)/(8*T_eds_kg);
  const pct_uts_eds=T_eds_kn/uts_kn;
  const sl_eds=f_eds_m&&vano>0?f_eds_m/vano:null;

  // ── HIPÓTESIS D: TEMPERATURA MÁXIMA (flecha máxima) ──
  // Aproximación: a T_max flecha crece ~15% respecto EDS
  const f_tmax_m=f_eds_m*1.15;
  const T_tmax_kn=T_eds_kn*0.88;
  const pct_uts_tmax=T_tmax_kn/uts_kn;
  const sl_tmax=f_tmax_m&&vano>0?f_tmax_m/vano:null;

  // ── VERIFICACIONES ──
  const ok_uts=pct_uts_viento<=lim.uts_viento;
  const ok_defl=sl_viento!=null?sl_viento<=lim.deflexion:true;
  const ok_eds=pct_uts_eds<=lim.uts_eds;

  // Cargas sobre el apoyo
  const cv=(w_acc*vano*FA+0)*G/2;
  const ct=(w_v*vano+Math.abs(2*T_eds_kg*Math.sin((angulo*Math.PI/180)/2)))*G;
  const cl=DL*T_eds_kg*G;
  const momento=ct*h_amarre;
  const fs_tipo=FS_APOYO[tipo_poste]||2.5;
  const cap_transv_kg=(carga_rot_kn*1000/G)/fs_tipo;
  const pct_est=cap_transv_kg>0?ct/cap_transv_kg:null;
  const ok_est=pct_est!=null?pct_est<=1.0:true;

  // SCORE (0-100)
  let score=0;
  if(ok_uts)score+=35;
  if(ok_defl)score+=15;
  if(ok_eds)score+=15;
  if(ok_est)score+=25;
  if(T_eds_kg>0)score+=10;
  score=Math.round(Math.min(score,100));

  return {
    // Hipótesis
    hip_viento:{T_kn:parseFloat(T_viento_kn.toFixed(2)),f_m:f_viento_m?parseFloat(f_viento_m.toFixed(3)):null,pct_uts:parseFloat(pct_uts_viento.toFixed(4)),sl:sl_viento,ok:ok_uts&&ok_defl},
    hip_tmin:{T_kn:parseFloat(T_tmin_kn.toFixed(2)),f_m:parseFloat(f_tmin_m.toFixed(3)),pct_uts:parseFloat(pct_uts_tmin.toFixed(4)),sl:sl_tmin,ok:pct_uts_tmin<=lim.uts_viento},
    hip_eds:{T_kn:parseFloat(T_eds_kn.toFixed(2)),f_m:parseFloat(f_eds_m.toFixed(3)),pct_uts:parseFloat(pct_uts_eds.toFixed(4)),sl:sl_eds,ok:ok_eds},
    hip_tmax:{T_kn:parseFloat(T_tmax_kn.toFixed(2)),f_m:parseFloat(f_tmax_m.toFixed(3)),pct_uts:parseFloat(pct_uts_tmax.toFixed(4)),sl:sl_tmax,ok:pct_uts_tmax<=lim.uts_viento},
    // Resumen
    flecha_vert:f_eds_m?parseFloat(f_eds_m.toFixed(3)):null,
    pct_uts_viento:parseFloat(pct_uts_viento.toFixed(4)),
    pct_estructura:pct_est?parseFloat(pct_est.toFixed(4)):null,
    carga_transversal_kg:parseFloat(ct.toFixed(1)),
    momento_flector_kgm:parseFloat(momento.toFixed(1)),
    T_eds_kn:parseFloat(T_eds_kn.toFixed(2)),
    ok_uts,ok_defl,ok_eds,ok_est,score,
    Qv_N_m:parseFloat(Qv.toFixed(2)),
    w_pp_kg_m:parseFloat(w_pp.toFixed(4)),
    supuesto:'Aproximación parabólica preliminar. Sin ecuación de cambio de estado completa.',
  };
}

function determinarEstado(calc,lim){
  const uts=calc.pct_uts_viento;const est=calc.pct_estructura;
  if(uts==null)return'indeterminado';
  if(uts>lim.uts_viento||est>1.0||calc.score>=80)return'critico';
  if(uts>lim.uts_viento*0.90||est>0.85||calc.score>=55)return'revisar';
  return'cumple';
}

function nivelConfianza(p,calc){
  if(!p.vano||!p.diam_m||!p.peso_km||!p.uts_kn)return'BAJO';
  if(p.vano>150||p.angulo>45)return'BAJO';
  if(calc.flecha_vert&&p.vano>0&&calc.flecha_vert/p.vano>0.08)return'BAJO';
  if(p.vano>100)return'MEDIO';
  return'ALTO';
}


// ══════════════════════════════════════════════════════════════════
//  CALCULAR (BOTÓN PRINCIPAL)
// ══════════════════════════════════════════════════════════════════
function calcular(){
  const pais=document.getElementById('f-pais').value;
  const norm=NORMATIVA[pais]||NORMATIVA.colombia;
  const lim=norm.limites;

  const vano=parseFloat(document.getElementById('f-vano').value)||80;
  const angulo=parseFloat(document.getElementById('f-angulo').value)||0;
  const viento_ms=parseFloat(document.getElementById('f-viento').value)||27;
  const diam_mm=parseFloat(document.getElementById('f-diam').value)||13.26;
  const peso_km=parseFloat(document.getElementById('f-peso').value)||0.420;
  const uts_kn=parseFloat(document.getElementById('f-uts').value)||25.2;
  const carga_rot_kn=parseFloat(document.getElementById('f-crot').value)||7.35;
  const h_poste=parseFloat(document.getElementById('f-hposte').value)||12;
  const h_amarre=parseFloat(document.getElementById('f-hamarre').value)||11;
  const tipo_poste=document.getElementById('f-tipo-poste').value;
  const tmax=parseFloat(document.getElementById('f-tmax').value)||40;
  const tmin=parseFloat(document.getElementById('f-tmin').value)||5;
  const teds=parseFloat(document.getElementById('f-teds').value)||25;

  const params={vano,angulo,viento_ms,diam_m:diam_mm/1000,peso_km,uts_kn,carga_rot_kn,h_poste,h_amarre,tipo_poste,tmax,tmin,teds};
  const calc=motorCalculo(params,lim);
  const estado=determinarEstado(calc,lim);
  const conf=nivelConfianza(params,calc);

  ultimoResultado={calc,estado,conf,params,norm,lim};
  renderResultados(calc,estado,conf,norm,lim);
  calcularHipotesis();
  showPanel('res');
}

function renderResultados(calc,estado,conf,norm,lim){
  const eb={cumple:'b-ok',revisar:'b-warn',critico:'b-err',indeterminado:'b-indet'};
  const cl={cumple:'ok',revisar:'warn',critico:'err',indeterminado:'info'};

  document.getElementById('res-sub').textContent=`${norm.pais} · ${norm.norma_principal} · Confianza: ${conf}`;
  document.getElementById('res-body').innerHTML=`
<div class="metric-grid">
  <div class="metric ${calc.ok_uts?'ok':'err'}">
    <div class="m-label">%UTS viento</div>
    <div class="m-val">${fp(calc.pct_uts_viento)}</div>
    <div class="m-unit">Límite: ${fp(lim.uts_viento)}</div>
    <div class="progress"><div class="pf ${calc.ok_uts?'pf-ok':'pf-err'}" style="width:${Math.min(calc.pct_uts_viento*100/lim.uts_viento*100,100)}%"></div></div>
  </div>
  <div class="metric ${calc.ok_est?'ok':'err'}">
    <div class="m-label">Uso estructura</div>
    <div class="m-val">${fp(calc.pct_estructura)}</div>
    <div class="m-unit">Límite: 100%</div>
    <div class="progress"><div class="pf ${calc.ok_est?'pf-ok':'pf-err'}" style="width:${calc.pct_estructura?Math.min(calc.pct_estructura*100,100):0}%"></div></div>
  </div>
  <div class="metric ${calc.ok_eds?'ok':'warn'}">
    <div class="m-label">%UTS EDS</div>
    <div class="m-val">${fp(calc.hip_eds.pct_uts)}</div>
    <div class="m-unit">Límite: ${fp(lim.uts_eds)}</div>
    <div class="progress"><div class="pf ${calc.ok_eds?'pf-ok':'pf-warn'}" style="width:${Math.min(calc.hip_eds.pct_uts*100/lim.uts_eds*100,100)}%"></div></div>
  </div>
  <div class="metric info">
    <div class="m-label">Flecha EDS</div>
    <div class="m-val">${fn(calc.flecha_vert)}</div>
    <div class="m-unit">metros</div>
    <div class="m-sub">f/L = ${calc.hip_eds.sl?((calc.hip_eds.sl*100).toFixed(2))+'%':'—'}</div>
  </div>
  <div class="metric ${cl[estado]}">
    <div class="m-label">Score riesgo</div>
    <div class="m-val">${calc.score}</div>
    <div class="m-unit">/ 100</div>
    <div class="progress"><div class="pf ${calc.score>=75?'pf-err':calc.score>=45?'pf-warn':'pf-ok'}" style="width:${calc.score}%"></div></div>
  </div>
  <div class="metric violet">
    <div class="m-label">T_EDS</div>
    <div class="m-val">${fn(calc.T_eds_kn)}</div>
    <div class="m-unit">kN</div>
    <div class="m-sub">${fp(calc.hip_eds.pct_uts)} UTS</div>
  </div>
</div>

<div class="alert ${estado==='cumple'?'a-ok':estado==='critico'?'a-err':'a-warn'}">
  <i class="ti ti-${estado==='cumple'?'circle-check':estado==='critico'?'alert-octagon':'alert-triangle'}"></i>
  <div>
    <strong>Estado: ${estado.toUpperCase()}</strong> · Confianza del análisis: ${conf}<br>
    ${estado==='cumple'?'No se detectaron incumplimientos preliminares bajo las hipótesis evaluadas.':estado==='critico'?'Se detectaron incumplimientos. Revisar diseño antes de implementar.':'Estructura próxima a límites. Se recomienda revisión de detalle.'}
    <br><small style="opacity:.8">${calc.supuesto}</small>
  </div>
</div>

<div class="card">
  <div class="sec-lbl">Cargas sobre el apoyo</div>
  <div class="tbl-wrap"><table class="tbl">
    <thead><tr><th>Componente</th><th>Valor</th><th>Unidad</th></tr></thead>
    <tbody>
      <tr><td class="lc">Carga de viento (Qv)</td><td>${fn(calc.Qv_N_m)}</td><td class="lc">N/m</td></tr>
      <tr><td class="lc">Peso propio conductor</td><td>${fn(calc.w_pp_kg_m)}</td><td class="lc">kg/m</td></tr>
      <tr><td class="lc">Carga transversal sobre apoyo</td><td>${fn(calc.carga_transversal_kg)}</td><td class="lc">kg</td></tr>
      <tr><td class="lc">Momento flector</td><td>${fn(calc.momento_flector_kgm)}</td><td class="lc">kg·m</td></tr>
      <tr><td class="lc">Tensión EDS (T_EDS)</td><td>${fn(calc.T_eds_kn)}</td><td class="lc">kN</td></tr>
    </tbody>
  </table></div>
</div>

<div class="alert a-info"><i class="ti ti-gavel"></i><div><strong>Nota legal:</strong> Esta verificación es de carácter preliminar. La aceptación final, ajuste y firma del diseño son responsabilidad exclusiva del profesional de ingeniería responsable.</div></div>
`;
}


// ══════════════════════════════════════════════════════════════════
//  HIPÓTESIS DE CARGA
// ══════════════════════════════════════════════════════════════════
function calcularHipotesis(){
  if(!ultimoResultado){document.getElementById('hip-grid').innerHTML='<div style="grid-column:1/-1;text-align:center;padding:32px;color:var(--t3)">Ejecute un cálculo primero.</div>';return;}
  const {calc,norm,lim}=ultimoResultado;
  const hips=[
    {key:'hip_viento',label:'A — Viento máximo',cls:'h-viento',icon:'ti-wind',desc:'Temperatura coincidente · Tensión máxima',cond:'Cumple si %UTS ≤ '+fp(lim.uts_viento)},
    {key:'hip_tmin',label:'B — Temperatura mínima',cls:'h-tmin',icon:'ti-snowflake',desc:'Sin viento · Mayor tensión térmica',cond:'Cumple si %UTS ≤ '+fp(lim.uts_viento)},
    {key:'hip_eds',label:'C — Operación EDS',cls:'h-eds',icon:'ti-activity',desc:'Temperatura promedio · Sin viento · Control vibración',cond:'Cumple si %UTS ≤ '+fp(lim.uts_eds)},
    {key:'hip_tmax',label:'D — Temperatura máxima',cls:'h-tmax',icon:'ti-sun',desc:'Sin viento · Flecha máxima · Verificar distancias',cond:'Cumple si f/L ≤ '+fp(lim.deflexion)},
  ];

  document.getElementById('hip-grid').innerHTML=hips.map(h=>{
    const d=calc[h.key];
    const sl_ok=d.sl!=null?d.sl<=lim.deflexion:true;
    const cumple=d.ok&&sl_ok;
    const stCls=cumple?'hip-cumple':d.pct_uts<lim.uts_viento*1.1?'hip-revisar':'hip-no';
    const stTxt=cumple?'✓ Cumple':d.pct_uts<lim.uts_viento*1.1?'⚠ Revisar':'✗ No cumple';
    return`<div class="hip-card">
      <div class="hip-header ${h.cls}"><i class="ti ${h.icon}"></i>${h.label}</div>
      <div class="hip-body">
        <div style="font-size:10.5px;color:rgba(255,255,255,0.7);font-family:var(--f-body);background:rgba(0,0,0,0.15);border-radius:4px;padding:4px 8px;margin-bottom:2px;color:var(--t3)">${h.desc}</div>
        <div class="hip-row"><span class="hip-lbl">T horizontal</span><span class="hip-val">${d.T_kn!=null?d.T_kn.toFixed(2):' —'} kN</span></div>
        <div class="hip-row"><span class="hip-lbl">Flecha</span><span class="hip-val">${d.f_m!=null?d.f_m.toFixed(3):' —'} m</span></div>
        <div class="hip-row"><span class="hip-lbl">%UTS</span><span class="hip-val">${fp(d.pct_uts)}</span></div>
        <div class="hip-row"><span class="hip-lbl">f/L</span><span class="hip-val">${d.sl!=null?((d.sl*100).toFixed(2))+'%':' —'}</span></div>
        <div class="hip-row"><span class="hip-lbl" style="font-size:9.5px">${h.cond}</span></div>
        <div class="hip-status ${stCls}">${stTxt}</div>
      </div>
    </div>`;
  }).join('');

  // Tabla comparativa
  document.getElementById('hip-tabla-wrap').style.display='block';
  document.getElementById('hip-tbody').innerHTML=hips.map(h=>{
    const d=calc[h.key];
    const sl_ok=d.sl!=null?d.sl<=lim.deflexion:true;
    const cumple=d.ok&&sl_ok;
    const cls=cumple?'val-ok':d.pct_uts<lim.uts_viento*1.1?'val-warn':'val-no';
    const comentarios={hip_viento:'Hipótesis regulatoria principal',hip_tmin:'Aprox. preliminar (+8% EDS)',hip_eds:'Tensión de partida adoptada',hip_tmax:'Aprox. preliminar (−12% EDS)'};
    return`<tr>
      <td class="lc">${h.label}</td>
      <td>${d.T_kn!=null?d.T_kn.toFixed(2):' —'}</td>
      <td>${d.f_m!=null?d.f_m.toFixed(3):' —'}</td>
      <td>${fp(d.pct_uts)}</td>
      <td>${d.sl!=null?((d.sl*100).toFixed(2))+'%':' —'}</td>
      <td class="${cls}">${cumple?'CUMPLE':d.pct_uts<lim.uts_viento*1.1?'REVISAR':'NO CUMPLE'}</td>
      <td class="lc" style="font-size:10.5px">${comentarios[h.key]}</td>
    </tr>`;
  }).join('');
}


// ══════════════════════════════════════════════════════════════════
//  PROYECTO: IMPORTAR Y CALCULAR BATCH
// ══════════════════════════════════════════════════════════════════
function onDrop(e){e.preventDefault();document.getElementById('drop-z').classList.remove('over');const f=e.dataTransfer.files[0];if(f)leerExcel({files:[f]});}
function leerExcel(inp){
  const f=inp.files[0];if(!f)return;
  const r=new FileReader();
  r.onload=function(e){
    try{
      const wb=XLSX.read(e.target.result,{type:'binary'});
      const ws=wb.Sheets[wb.SheetNames[0]];
      const data=XLSX.utils.sheet_to_json(ws,{defval:''});
      procesarProyecto(data);
    }catch(err){alert('Error al leer el archivo: '+err.message);}
  };
  r.readAsBinaryString(f);
}

function procesarProyecto(filas){
  const pais=document.getElementById('f-pais')?.value||'colombia';
  const norm=NORMATIVA[pais]||NORMATIVA.colombia;
  const lim=norm.limites;

  proyData=filas.map((fila,i)=>{
    const vano=parseFloat(fila.vano)||0;
    const angulo=parseFloat(fila.angulo)||0;
    const diam_mm=parseFloat(fila.diam_mm)||13.26;
    const peso_km=parseFloat(fila.peso_km)||0.420;
    const uts_kn=parseFloat(fila.uts_kn)||25.2;
    const carga_rot_kn=parseFloat(fila.carga_rot_kn)||7.35;

    if(!vano||!diam_mm||!uts_kn)return{...fila,id_estructura:fila.id_estructura||`E-${String(i+1).padStart(3,'0')}`,estado:'indeterminado',score:0};

    const params={vano,angulo,viento_ms:norm.viento_ref,diam_m:diam_mm/1000,peso_km,uts_kn,carga_rot_kn,h_poste:parseFloat(fila.h_poste)||12,h_amarre:parseFloat(fila.h_amarre)||11,tipo_poste:fila.tipo_poste||'concreto',tmax:norm.tmax,tmin:norm.tmin,teds:norm.teds};
    const calc=motorCalculo(params,lim);
    const estado=determinarEstado(calc,lim);
    const confianza=nivelConfianza(params,calc);
    return{
      ...fila,
      id_estructura:fila.id_estructura||`E-${String(i+1).padStart(3,'0')}`,
      conductor:fila.conductor||'—',
      tipo_apoyo:fila.tipo_apoyo||'Alineación',
      vano,angulo,
      pct_uts_viento:calc.pct_uts_viento,
      pct_estructura:calc.pct_estructura,
      flecha_vert:calc.flecha_vert,
      momento_flector_kgm:calc.momento_flector_kgm,
      carga_transversal_kg:calc.carga_transversal_kg,
      T_eds_kn:calc.T_eds_kn,
      score:calc.score,
      estado,confianza,
      hip_viento:calc.hip_viento,
    };
  });
  renderDashboard();renderTabla();renderCriticas();
  showPanel('dash');
}

