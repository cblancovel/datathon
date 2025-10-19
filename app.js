// =============================
// Configuración rápida
// =============================
const EVENT_DATE = '2025-11-21T14:00:00+01:00';
const FORM_URL   = 'https://forms.office.com/e/y8et5tJF9L';

// =============================
// Inicialización general
// =============================
document.addEventListener('DOMContentLoaded', () => {

  // Toggle de menú móvil
  const nav = document.getElementById('nav');
  const toggle = document.querySelector('.nav-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('show');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // Año en footer
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Pintar fecha legible en el hero
  const ed = document.getElementById('event-date');
  if (ed) {
    ed.textContent = new Date(EVENT_DATE).toLocaleString('es-ES', {
      dateStyle: 'full',
      timeStyle: 'short'
    });
  }

  // =============================
  // Countdown (robusto)
  // =============================
  const target = new Date(EVENT_DATE).getTime();
  const pad = (n) => String(n).padStart(2, '0');

  function tick() {
    const now = Date.now();
    const delta = Math.max(0, target - now);
    const d = Math.floor(delta / (1000 * 60 * 60 * 24));
    const h = Math.floor((delta / (1000 * 60 * 60)) % 24);
    const m = Math.floor((delta / (1000 * 60)) % 60);
    const s = Math.floor((delta / 1000) % 60);

    const dd = document.getElementById('cd-days');
    const hh = document.getElementById('cd-hours');
    const mm = document.getElementById('cd-mins');
    const ss = document.getElementById('cd-secs');

    if (dd && hh && mm && ss) {
      dd.textContent = d;
      hh.textContent = pad(h);
      mm.textContent = pad(m);
      ss.textContent = pad(s);
    }
  }

  tick();
  setInterval(tick, 1000);
});

// =============================
// Avisos dinámicos
// =============================
(async function loadNotices() {
  try {
    const res = await fetch('data/notices.json', { cache: 'no-store' });
    if (!res.ok) return;
    const noticeData = await res.json();
    if (noticeData && noticeData.visible) {
      const el = document.getElementById('notice');
      el.className = 'notice show ' + (noticeData.type || 'info');
      el.innerHTML = noticeData.message;
      el.hidden = false;
    }
  } catch (e) {
    /* noop */
  }
})();

// =============================
// Sponsors dinámicos
// =============================
async function renderSponsors() {
  try {
    const res = await fetch('data/sponsors.json', { cache: 'no-store' });
    if (!res.ok) return;
    const data = await res.json();
    const map = {
      gold: document.getElementById('sponsors-gold'),
      golde: document.getElementById('sponsors-golde'),
      silver: document.getElementById('sponsors-silver'),
      bronze: document.getElementById('sponsors-bronze'),
      colaboradores: document.getElementById('sponsors-colaboradores'),
    };

    ['gold', 'golde', 'silver', 'bronze', 'colaboradores'].forEach(tier => {
      const host = map[tier];
      if (!host) return;
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
          a.innerHTML = '<div class="placeholder">' + (sp.name || 'Sponsor') + '</div>';
        };

        a.appendChild(img);
        host.appendChild(a);
      });

      if (!host.children.length) {
        const empty = document.createElement('div');
        empty.className = 'sponsor';
        empty.innerHTML = '<div class="placeholder">Tu logo aquí</div>';
        host.appendChild(empty);
      }
    });
  } catch (err) {
    /* noop */
  }
}
renderSponsors();

// =============================
// Registrar Service Worker
// =============================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js').catch(() => {});
  });
}

// =============================
// Visor modal de PDFs o imágenes con spinner
// =============================
window.addEventListener('load', () => {
  const modal = document.getElementById('pdfModal');
  const viewer = document.getElementById('pdfViewer');
  const closeBtn = document.getElementById('pdfClose');
  const spinner = document.getElementById('pdfSpinner');

  // Crear contenedor de imagen si no existe
  let imgViewer = document.createElement('img');
  imgViewer.id = 'imgViewer';
  imgViewer.style.cssText = 'width:100%;height:100%;object-fit:contain;display:none;';
  modal.querySelector('.pdf-modal-content').appendChild(imgViewer);

  function closeModal() {
    viewer.src = '';
    imgViewer.src = '';
    modal.hidden = true;
    spinner.hidden = true;
    viewer.style.display = 'none';
    imgViewer.style.display = 'none';
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modal) modal.addEventListener('click', e => {
    if (e.target.classList.contains('pdf-modal') || e.target.classList.contains('pdf-modal-backdrop')) {
      closeModal();
    }
  });

  // Detectar clic en los enlaces de reto
  document.querySelectorAll('.reto-pdf a').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const url = link.getAttribute('href');
      if (!url) return;

      spinner.hidden = false;
      modal.hidden = false;
      document.body.style.overflow = 'hidden';
      viewer.style.display = 'none';
      imgViewer.style.display = 'none';

      // Según tipo de archivo: PDF → iframe | PNG/JPG → img
      const lower = url.toLowerCase();
      if (lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg')) {
        imgViewer.src = url;
        imgViewer.onload = () => {
          spinner.hidden = true;
          imgViewer.style.display = 'block';
        };
      } else {
        viewer.src = url;
        viewer.onload = () => {
          spinner.hidden = true;
          viewer.style.display = 'block';
        };
      }
    });
  });
});


