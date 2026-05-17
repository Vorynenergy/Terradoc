/* ═══════════════════════════════════════════════════════════════════
   MecLine LATAM — mecline_app.js
   Proyecto: Voryn Energy / MecLine LATAM
   Prefijo: mecline_  |  NO mezclar con DimElec, TerraDoc ni Landing Voryn
   ═══════════════════════════════════════════════════════════════════ */

'use strict';

// ══════════════════════════════════════════════════════════════════
//  ESTADO GLOBAL
// ══════════════════════════════════════════════════════════════════
let currentMode='unit',currentNivel='mt',ultimoResultado=null,proyData=[],brandData={empresa:{},colores:{}};
let conjSeleccionado=null;
const fp=v=>v!=null?((v*100).toFixed(1)+'%'):'—';
const fn=v=>v!=null?v.toFixed(2):'—';


// ══════════════════════════════════════════════════════════════════
//  NAVEGACIÓN
// ══════════════════════════════════════════════════════════════════
function showPanel(id){
  document.querySelectorAll('.panel').forEach(p=>p.classList.remove('on'));
  const panel=document.getElementById('panel-'+id);
  if(panel)panel.classList.add('on');
  document.querySelectorAll('.nav').forEach(n=>{n.classList.remove('on');n.classList.remove('on-vio');});
  const nav=document.getElementById('nav-'+id);
  if(nav)nav.classList.add('on');
}

function showTab(e,id,silent){
  const pb=e?e.target.closest('.pb'):document.getElementById('panel-calc').querySelector('.pb');
  if(!pb)return;
  pb.querySelectorAll('.tc').forEach(t=>t.classList.remove('on'));
  pb.querySelectorAll('.tab').forEach(t=>t.classList.remove('on'));
  const tc=document.getElementById(id);if(tc)tc.classList.add('on');
  if(e)e.target.closest('.tab')?.classList.add('on');
}

function setMode(mode){
  currentMode=mode;
  ['unit','wizard','proj','conj'].forEach(m=>{
    document.getElementById(`mb-${m}`)?.classList.toggle('active',m===mode);
    document.getElementById(`sb-${m}`)&&(document.getElementById(`sb-${m}`).style.display=m===mode?'block':'none');
  });
  const defaults={unit:'calc',wizard:'wizard',proj:'dash',conj:'conj-cat'};
  showPanel(defaults[mode]||'calc');
  if(mode==='conj'){renderConjuntoCatalogo();poblarSelectsConjuntos();}
}

function setNivel(nivel){
  currentNivel=nivel;
  document.getElementById('nb-mt').className='nb'+(nivel==='mt'?' on-mt':'');
  document.getElementById('nb-bt').className='nb'+(nivel==='bt'?' on-bt':'');
  sincPais();filtrarCat();
}

function toggleDark(){
  const html=document.documentElement;
  const dark=html.getAttribute('data-theme')==='dark';
  html.setAttribute('data-theme',dark?'light':'dark');
  document.getElementById('dark-icon').className='ti '+(dark?'ti-moon-stars':'ti-sun');
}


// ══════════════════════════════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════════════════════════════
renderNorm();
filtrarCat();
sincPais();
renderWizPaso();
// Poblar select wizard conductores


// ══════════════════════════════════════════════════════════════════
//  SISTEMA DE PLAN Y SESIÓN v6
// ══════════════════════════════════════════════════════════════════
let PLAN = 'free'; // 'free' | 'pro' | 'enterprise'
let AI_MSGS_USED = 0;
const AI_LIMIT_FREE = 5;
const PLAN_LABELS = {free:'FREE', pro:'PRO ✦', enterprise:'ENTERPRISE'};
const PLAN_COLORS = {free:'var(--indet)', pro:'var(--gold)', enterprise:'var(--violet)'};

function iniciarSesion(plan) {
  PLAN = plan;
  document.getElementById('onb-bg').style.display = 'none';
  document.getElementById('demo-banner').style.display = 'flex';
  actualizarUIplan();
  // Guardar en sessionStorage
  try { sessionStorage.setItem('mecline_plan', plan); } catch(e) {}
}

function activarPlan(plan) {
  PLAN = plan;
  try { sessionStorage.setItem('mecline_plan', plan); } catch(e) {}
  actualizarUIplan();
  closeModal('pricing');
  // Feedback visual
  const msg = plan === 'pro' ? '✦ Plan Pro activado — IA ilimitada, conjuntos y 8 países desbloqueados.' :
               plan === 'enterprise' ? '✦ Plan Enterprise activado.' : 'Continuando en plan Free.';
  const banner = document.createElement('div');
  banner.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:var(--brand);color:#fff;padding:10px 22px;border-radius:10px;font-size:13px;font-weight:600;z-index:999;box-shadow:0 4px 20px rgba(0,0,0,0.25);font-family:var(--f-body);animation:onb-in .25s ease';
  banner.textContent = msg;
  document.body.appendChild(banner);
  setTimeout(() => banner.remove(), 3500);
  // Reset AI counter on upgrade
  if(plan !== 'free') AI_MSGS_USED = 0;
}

function actualizarUIplan() {
  // Topbar badge
  const badge = document.getElementById('tb-plan-badge');
  const chip = document.getElementById('chip-plan');
  if(badge) badge.textContent = '✦ ' + PLAN.toUpperCase();
  if(chip) { chip.textContent = PLAN.toUpperCase(); chip.style.color = PLAN_COLORS[PLAN]; }

  // Banner
  const banner = document.getElementById('banner-plan');
  const bannerMsg = document.getElementById('banner-msg');
  if(banner) banner.textContent = PLAN.toUpperCase();
  if(bannerMsg) {
    if(PLAN === 'free') bannerMsg.textContent = (AI_LIMIT_FREE - AI_MSGS_USED) + ' mensajes IA disponibles hoy';
    else if(PLAN === 'pro') bannerMsg.textContent = 'IA ilimitada · 8 países · 28 conjuntos';
    else bannerMsg.textContent = 'Acceso Enterprise completo';
  }
  // Ocultar banner "Activar Pro" si ya es Pro
  const bannerBtn = document.querySelector('.demo-banner button');
  if(bannerBtn) bannerBtn.style.display = PLAN === 'free' ? 'block' : 'none';

  // Usage bar
  actualizarUsageBar();

  // Conjuntos gate
  const gate = document.getElementById('conj-pro-gate');
  const navItems = document.getElementById('conj-nav-items');
  if(gate && navItems) {
    gate.style.display = PLAN === 'free' ? 'block' : 'none';
    navItems.style.display = PLAN === 'free' ? 'none' : 'block';
  }

  // Hipótesis gate
  const hipGate = document.getElementById('hip-upgrade-gate');
  if(hipGate) hipGate.style.display = PLAN === 'free' ? 'block' : 'none';

  // AI counters
  actualizarAIcounters();
}

function actualizarUsageBar() {
  if(PLAN !== 'free') {
    const bar = document.getElementById('sidebar-usage');
    if(bar) bar.style.display = 'none';
    return;
  }
  const fill = document.getElementById('usage-fill');
  const count = document.getElementById('usage-count');
  const pct = Math.min(AI_MSGS_USED / AI_LIMIT_FREE * 100, 100);
  if(fill) {
    fill.style.width = pct + '%';
    fill.className = 'usage-fill ' + (pct >= 100 ? 'over' : pct >= 60 ? 'warn' : 'safe');
  }
  if(count) count.textContent = AI_MSGS_USED + '/' + AI_LIMIT_FREE;
}

function actualizarAIcounters() {
  const remaining = Math.max(AI_LIMIT_FREE - AI_MSGS_USED, 0);
  const texts = document.querySelectorAll('[id^="ai-counter-text"]');
  const counters = document.querySelectorAll('[id^="ai-counter"]');
  texts.forEach(t => {
    if(PLAN !== 'free') t.textContent = 'IA ilimitada — Plan ' + PLAN.charAt(0).toUpperCase() + PLAN.slice(1);
    else t.textContent = remaining + ' mensaje' + (remaining !== 1 ? 's' : '') + ' disponible' + (remaining !== 1 ? 's' : '') + ' hoy (plan Free)';
  });
  counters.forEach(c => {
    c.className = 'ai-counter' + (PLAN === 'free' && remaining <= 1 ? ' over' : PLAN === 'free' && remaining <= 3 ? ' warn' : '');
  });
  // Ocultar upgrade CTA si no es Free
  document.querySelectorAll('[id^="ai-counter"] .btn').forEach(b => {
    b.style.display = PLAN !== 'free' ? 'none' : 'inline-flex';
  });
}

function puedeEnviarIA() {
  if(PLAN !== 'free') return true;
  return AI_MSGS_USED < AI_LIMIT_FREE;
}

function registrarMensajeIA() {
  if(PLAN === 'free') {
    AI_MSGS_USED++;
    actualizarUIplan();
  }
}

// ══ Patch sendMsg para control de plan ══
const _sendMsgOrig = sendMsg;
sendMsg = async function(aid, iid, esP) {
  if(!puedeEnviarIA()) {
    const inp = document.getElementById(iid);
    const msg = inp.value.trim();
    if(msg) {
      inp.value = '';
      addMsg(aid, 'user', msg);
      const lid = addMsg(aid, 'ai', `<div style="text-align:center;padding:10px"><div style="font-size:22px">🔒</div><strong>Límite diario alcanzado</strong><br><small>El plan Free incluye 5 mensajes IA por día.<br>Activa el Plan Pro para IA ilimitada.</small><br><br><button class="btn btn-primary btn-sm" onclick="showModal('pricing')" style="margin-top:8px"><i class="ti ti-crown"></i>Activar Pro — $49/mes</button></div>`);
    }
    return;
  }
  registrarMensajeIA();
  return _sendMsgOrig.call(this, aid, iid, esP);
};

// ══ Patch setMode para conjuntos gate ══
const _setModeOrig = setMode;
setMode = function(mode) {
  if(mode === 'conj' && PLAN === 'free') {
    _setModeOrig('conj');
    // Show gate panel
    setTimeout(() => actualizarUIplan(), 50);
    return;
  }
  _setModeOrig(mode);
};

// ══ Patch procesarProyecto para KPI cards ══
const _procesarProyectoOrig = procesarProyecto;
procesarProyecto = function(data) {
  _procesarProyectoOrig(data);
  setTimeout(actualizarKPIs, 100);
};

function actualizarKPIs() {
  if(!proyData.length) return;
  const total = proyData.length;
  const cumple = proyData.filter(e => e.estado === 'cumple').length;
  const revisar = proyData.filter(e => e.estado === 'revisar').length;
  const critico = proyData.filter(e => e.estado === 'critico').length;
  const row = document.getElementById('kpi-row');
  if(row) row.style.display = 'grid';
  const pct = v => total > 0 ? Math.round(v/total*100) + '%' : '—';
  document.getElementById('kpi-total').textContent = total;
  document.getElementById('kpi-cumple').textContent = cumple;
  document.getElementById('kpi-revisar').textContent = revisar;
  document.getElementById('kpi-critico').textContent = critico;
  document.getElementById('kpi-pct-ok').textContent = pct(cumple) + ' del total';
  document.getElementById('kpi-pct-rev').textContent = pct(revisar) + ' del total';
  document.getElementById('kpi-pct-crit').textContent = pct(critico) + ' del total';
}

// ══ Restaurar sesión si existe ══
try {
  const saved = sessionStorage.getItem('mecline_plan');
  if(saved) { iniciarSesion(saved); }
} catch(e) {}

