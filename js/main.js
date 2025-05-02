// js/main.js

// Global para almacenar traducciones
let translations = {};

/**
 * Carga un fragmento HTML en el elemento con el id dado.
 */
async function loadComponent(id, url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error cargando ${url}: ${res.statusText}`);
  const html = await res.text();
  document.getElementById(id).innerHTML = html;
}

/**
 * Carga el JSON de traducciones para el idioma seleccionado.
 */
async function loadTranslations(lang) {
  const res = await fetch(`locales/${lang}.json`);
  if (!res.ok) throw new Error(`Error cargando locales/${lang}.json: ${res.statusText}`);
  translations = await res.json();
}

/**
 * Renderiza las tarjetas de productos en la landing.
 */
function renderProducts() {
  const container = document.getElementById('products');
  container.innerHTML = '';

  const iconMap = {
    'carta-amor': 'heart.svg',
    'carta-perdon': 'handshake.svg',
    'carta-agradecimiento': 'gratitude.svg',
    'carta-cumpleanos': 'cake.svg',
    'carta-condolencias': 'dove.svg',
    'carta-futuro': 'clock.svg'
  };

  translations.products.forEach(p => {
    const card = document.createElement('div');
    card.className = `card card--${p.id} listing`;
    card.addEventListener('click', () => {
      location.href = `product.html?id=${p.id}`;
    });
    // js/main.js → renderProducts()
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });


    // Descripción truncada
    const fullDesc = p.description;
    const shortDesc = fullDesc.length > 80
      ? fullDesc.slice(0, 80).trim() + '…'
      : fullDesc;

    card.innerHTML = `
      <div class="card__header">
        <img src="assets/icons/${iconMap[p.id]}" alt="" class="card__icon">
        <h2 class="card__title">${p.title}</h2>
      </div>
      <p class="card__desc">${shortDesc}</p>
      <div class="card__footer">
        <button class="card__btn listing">${translations.cta}</button>
      </div>
    `;
    container.appendChild(card);
  });
}

/**
 * Inicializa el toggle de tema Claro/Oscuro.
 * Debe llamarse después de inyectar el header.
 */
function initThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  const root = document.documentElement;
  const saved = localStorage.getItem('theme');
  const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const theme = saved || system;

  root.setAttribute('data-theme', theme);
  toggle.textContent = theme === 'dark' ? '🌕' : '🌑';

  toggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    toggle.textContent = next === 'dark' ? '🌕' : '🌑';
  });
}

// Al cargar el DOM, gestionamos el selector de idioma
document.addEventListener('DOMContentLoaded', () => {
  const modal   = document.getElementById('language-modal');
  const content = document.getElementById('content');
  const langSel = document.getElementById('language');
  const confirm = document.getElementById('language-confirm');

  confirm.addEventListener('click', async () => {
    const lang = langSel.value;
    if (!lang) return;

    // Ocultamos modal y mostramos contenido
    modal.classList.add('hidden');
    content.classList.remove('hidden');

    // 1) Header + toggle de tema
    await loadComponent('header', 'components/header.html');
    initThemeToggle();

    // 2) Footer
    await loadComponent('footer', 'components/footer.html');

    // 3) Traducciones y renderizado de productos
    await loadTranslations(lang);
    renderProducts();
  });
});

