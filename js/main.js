// js/main.js

let translations = {};

// Mapa de iconos según el ID de producto
const iconMap = {
  'carta-amor': 'heart.svg',
  'carta-perdon': 'handshake.svg',
  'carta-agradecimiento': 'gratitude.svg',
  'carta-cumpleanos': 'cake.svg',
  'carta-condolencias': 'dove.svg',
  'carta-futuro': 'clock.svg'
};

// Carga un componente HTML inyectable
async function loadComponent(id, url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error cargando ${url}: ${res.statusText}`);
  document.getElementById(id).innerHTML = await res.text();
}

// Carga el JSON de traducciones según idioma
async function loadTranslations(lang) {
  const res = await fetch(`locales/${lang}.json`);
  if (!res.ok) throw new Error(`Error cargando locales/${lang}.json: ${res.statusText}`);
  translations = await res.json();
}

// Renderiza las tarjetas de producto como enlaces <a>
function renderProducts() {
  console.log('🔍 renderProducts() invoked, products:', translations.products);
  const container = document.getElementById('products');
  if (!container || !Array.isArray(translations.products)) return;
  container.innerHTML = '';

  translations.products.forEach(p => {
    const link = document.createElement('a');
    link.href = `product.html?id=${p.id}`;
    link.setAttribute('data-link', '');  // para SPA navigation
    link.classList.add('card', `card--${p.id}`, 'listing');

    const shortDesc = p.description.length > 80
      ? p.description.slice(0, 80).trim() + '…'
      : p.description;

    link.innerHTML = `
      <div class="card__header">
        <img src="assets/icons/${iconMap[p.id]}" class="card__icon" alt="">
        <h2 class="card__title">${p.title}</h2>
      </div>
      <p class="card__desc">${shortDesc}</p>
      <div class="card__footer">
        <button class="card__btn listing">${translations.cta || 'Ver más'}</button>
      </div>
    `;

    container.appendChild(link);
  });
}

// Renderiza el detalle de un producto según el ?id
function renderProductDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const p = translations.products.find(prod => prod.id === id);
  if (!p) return;

  // Hero del producto
  const detail = document.getElementById('product-detail');
  detail.innerHTML = `
    <div class="product-hero__img">
      <img src="${p.img}" alt="${p.title}">
    </div>
    <div class="product-hero__info">
      <h1>${p.title}</h1>
      <p>${p.description}</p>
    </div>
  `;

  // Lista de planes (definidos en traducciones o en código)
  const planList = document.getElementById('plan-list');
  if (planList && Array.isArray(translations.plans)) {
    planList.innerHTML = translations.plans.map(plan => `
      <div class="plan-card">
        <h3>${plan.name}</h3>
        <p>${plan.desc}</p>
        <p class="price">${plan.price}</p>
        <a href="payment.html?product=${id}&plan=${plan.id}" data-link class="plan-card__btn">${plan.cta || 'Seleccionar'}</a>
      </div>
    `).join('');
  }
}

// Inicializa toggle de tema claro/oscuro
function initThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;
  const root = document.documentElement;
  const saved = localStorage.getItem('theme');
  const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  let theme = saved || system;
  root.setAttribute('data-theme', theme);
  toggle.textContent = theme === 'dark' ? '🌕' : '🌑';
  toggle.onclick = () => {
    theme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    toggle.textContent = theme === 'dark' ? '🌕' : '🌑';
  };
}

// Muestra el modal de selección de idioma
function showLanguageModal() {
  const modal   = document.getElementById('language-modal');
  const content = document.getElementById('content');
  if (modal) {
    modal.classList.remove('hidden');
    // Oculta todo lo demás
    document.body.classList.add('modal-open');
  }
}

async function applyLanguage(lang) {
  localStorage.setItem('lang', lang);
  const modal   = document.getElementById('language-modal');
  const content = document.getElementById('content');
  if (modal && content) {
    modal.classList.add('hidden');
    content.classList.remove('hidden');
    // Vuelve a mostrar header, footer y página
    document.body.classList.remove('modal-open');
  }

  await loadComponent('header','components/header.html');
  initThemeToggle();
  document.getElementById('lang-toggle')?.addEventListener('click', showLanguageModal);
  await loadComponent('footer','components/footer.html');
  await loadTranslations(lang);
  if (document.getElementById('products')) renderProducts();
  if (document.getElementById('product-detail')) renderProductDetail();
}

console.log('main.js cargado');

// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
  // 1) Inyecta siempre header/footer y tema
  await loadComponent('header', 'components/header.html');
  initThemeToggle();
  await loadComponent('footer', 'components/footer.html');

  const confirmBtn = document.getElementById('language-confirm');
  const langSel    = document.getElementById('language');

  // 2) Si estamos en la landing (index.html), mostramos siempre el modal
  if (confirmBtn && langSel) {
    // Forzamos abrir el modal
    showLanguageModal();

    confirmBtn.addEventListener('click', async () => {
      // Guardas la elección y ocultas el modal
      await applyLanguage(langSel.value);
      // Y te quedas en index mostrando los productos
      // Si prefieres recargar, descomenta:
      // window.location.href = 'index.html';
    });

  } else {
    // Páginas internas: usamos el idioma ya guardado o redirigimos a index
    const savedLang = localStorage.getItem('lang');
    if (savedLang) {
      await applyLanguage(savedLang);
    } else {
      window.location.href = 'index.html';
    }
  }
});

