// Configuración rápida
const EVENT_DATE = '2025-11-08T09:00:00+01:00'; // Cambia aquí la fecha/hora del evento
const FORM_URL   = '#'; // Cambia por tu formulario de registro

// Toggle de menú móvil
const nav = document.getElementById('nav');
document.querySelector('.nav-toggle').addEventListener('click', () => {
  const isOpen = nav.classList.toggle('show');
  document.querySelector('.nav-toggle').setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});

// Año en footer
document.getElementById('year').textContent = new Date().getFullYear();

// Enlace de registro
document.querySelectorAll('a[href="#registro"], a.btn-primary.btn-lg').forEach(a => {
  a.addEventListener('click', (e) => {
    const mainCta = e.target.closest('a.btn-primary.btn-lg');
    if (mainCta && FORM_URL && FORM_URL !== '#') {
      mainCta.setAttribute('href', FORM_URL);
      mainCta.setAttribute('target', '_blank');
      mainCta.setAttribute('rel', 'noopener');
    }
  });
});

// Countdown
(function countdown(){
  const target = new Date(EVENT_DATE).getTime();
  const pad = (n)=> String(n).padStart(2,'0');
  function tick(){
    const now = Date.now();
    const delta = Math.max(0, target - now);
    const d = Math.floor(delta / (1000*60*60*24));
    const h = Math.floor((delta / (1000*60*60)) % 24);
    const m = Math.floor((delta / (1000*60)) % 60);
    const s = Math.floor((delta / 1000) % 60);
    document.getElementById('cd-days').textContent = d;
    document.getElementById('cd-hours').textContent = pad(h);
    document.getElementById('cd-mins').textContent = pad(m);
    document.getElementById('cd-secs').textContent = pad(s);
  }
  tick();
  setInterval(tick, 1000);
})();

// Avisos dinámicos
(async function loadNotices(){
  try{
    const res = await fetch('data/notices.json', {cache:'no-store'});
    if(!res.ok) return;
    const noticeData = await res.json();
    if(noticeData && noticeData.visible){
      const el = document.getElementById('notice');
      el.className = 'notice show ' + (noticeData.type || 'info');
      el.innerHTML = noticeData.message;
      el.hidden = false;
    }
  }catch(e){ /* noop */ }
})();

// Sponsors dinámicos
async function renderSponsors(){
  try{
    const res = await fetch('data/sponsors.json', {cache:'no-store'});
    if(!res.ok) return;
    const data = await res.json();
    const map = {
      gold: document.getElementById('sponsors-gold'),
      silver: document.getElementById('sponsors-silver'),
      bronze: document.getElementById('sponsors-bronze'),
    };
    const tiers = ['gold','silver','bronze'];
    tiers.forEach(tier => {
      const host = map[tier];
      host.innerHTML = '';
      (data[tier] || []).forEach(sp => {
        const a = document.createElement('a');
        a.className = 'sponsor';
        a.href = sp.url || '#';
        a.target = '_blank';
        a.rel = 'noopener';
        const img = document.createElement('img');
        img.alt = sp.name || 'Sponsor';
        img.src = sp.logo || 'logo.png';
        img.onerror = () => {
          a.innerHTML = '<div class="placeholder">'+(sp.name || 'Sponsor')+'</div>';
        };
        a.appendChild(img);
        host.appendChild(a);
      });
      if(!host.children.length){
        const empty = document.createElement('div');
        empty.className = 'sponsor';
        empty.innerHTML = '<div class="placeholder">Tu logo aquí</div>';
        host.appendChild(empty);
      }
    });
  }catch(err){
    // Si falla, dejamos placeholders
  }
}
renderSponsors();

// Registrar Service Worker (network-only)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js').catch(()=>{});
  });
}
