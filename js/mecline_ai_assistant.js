/* ═══════════════════════════════════════════════════════════════════
   MecLine LATAM — mecline_ai_assistant.js
   Proyecto: Voryn Energy / MecLine LATAM
   Prefijo: mecline_  |  NO mezclar con DimElec, TerraDoc ni Landing Voryn
   ═══════════════════════════════════════════════════════════════════ */

'use strict';

// ══════════════════════════════════════════════════════════════════
//  ASISTENTE IA
// ══════════════════════════════════════════════════════════════════
function hk(e,aid,iid,esP){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMsg(aid,iid,esP);}}
let msgId=0;
function addMsg(aid,role,html){
  const id='m'+msgId++;const area=document.getElementById(aid);
  const ini=role==='ai'?'IA':'Tú';
  area.innerHTML+=`<div class="msg ${role}" id="${id}"><div class="msg-av ${role}">${ini}</div><div class="bubble">${html}</div></div>`;
  area.scrollTop=99999;return id;
}
function updMsg(aid,id,txt){const el=document.getElementById(id);if(el)el.querySelector('.bubble').textContent=txt;document.getElementById(aid).scrollTop=99999;}
async function sendMsg(aid,iid,esP){
  const inp=document.getElementById(iid);const msg=inp.value.trim();if(!msg)return;
  inp.value='';addMsg(aid,'user',msg);
  const lid=addMsg(aid,'ai','<span class="spin"></span> Analizando...');
  const btn=document.getElementById(esP?'send-pai':'send-ai');if(btn)btn.disabled=true;
  let ctx='';
  const pais=document.getElementById('f-pais')?.value||'colombia';
  const norm=NORMATIVA[pais]||NORMATIVA.colombia;
  if(esP&&proyData.length){
    const t=proyData.length,crit=proyData.filter(d=>d.estado==='critico').length;
    const top=([...proyData].sort((a,b)=>(b.score||0)-(a.score||0))).slice(0,5).map(d=>`${d.id_estructura}(score ${d.score})`).join(', ');
    ctx=`\nPROYECTO: ${norm.pais} · ${norm.norma_principal} · ${t} estructuras · Críticas: ${crit} · Top riesgo: ${top}`;
  }else if(ultimoResultado){
    const {calc,estado}=ultimoResultado;
    ctx=`\nRESULTADO: %UTS=${fp(calc.pct_uts_viento)} · Uso=${fp(calc.pct_estructura)} · Estado=${estado} · Score=${calc.score} · HipViento=${fp(calc.hip_viento?.pct_uts)} · HipEDS=${fp(calc.hip_eds?.pct_uts)}`;
  }
  const sys=`Actúa como asistente técnico senior especializado en diseño electromecánico de redes aéreas de distribución para LATAM.
País: ${norm.pais} | Norma: ${norm.norma_principal} | Nivel: ${currentNivel==='bt'?'BT':'MT'}

REGLAS CRÍTICAS — NUNCA las violes:
1. NUNCA calcules manualmente. NUNCA inventes valores técnicos.
2. Interpreta ÚNICAMENTE resultados del motor de cálculo.
3. No afirmes cumplimiento legal definitivo.
4. SIEMPRE incluye al final: "La aceptación final debe ser realizada por el profesional responsable."
5. Español técnico formal. Máximo 220 palabras.
6. Si te preguntan por conjuntos constructivos, orienta sobre criterios conceptuales de selección sin prescribir materiales específicos de ningún operador.
7. Los resultados son "preliminares" o "aproximación parabólica" — nunca "definitivos" o "aprobados".${ctx}`;
  try{
    const resp=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:800,system:sys,messages:[{role:'user',content:msg}]})});
    const data=await resp.json();
    const txt=data.content?.find(c=>c.type==='text')?.text||'Sin respuesta.';
    updMsg(aid,lid,txt);
  }catch(e){updMsg(aid,lid,'Error de conexión con el asistente.');}
  if(btn)btn.disabled=false;
}

