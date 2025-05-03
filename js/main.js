// js/main.js

let translations = {};

async function loadComponent(id, url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error cargando ${url}: ${res.statusText}`);
  document.getElementById(id).innerHTML = await res.text();
}

async function loadTranslations(lang) {
  const res = await fetch(`locales/${lang}.json`);
  if (!res.ok) throw new Error(`Error cargando locales/${lang}.json}: ${res.statusText}`);
  translations = await res.json();
}

function renderProducts() {
  const container = document.getElementById('products');
  if (!container || !Array.isArray(translations.products)) return;
  container.innerHTML = '';
  const iconMap = {
    'carta-amor':'heart.svg','carta-perdon':'handshake.svg',
    'carta-agradecimiento':'gratitude.svg','carta-cumpleanos':'cake.svg',
    'carta-condolencias':'dove.svg','carta-futuro':'clock.svg'
  };
  translations.products.forEach(p => {
    const card = document.createElement('div');
    card.className = `card card--${p.id} listing`;
    card.setAttribute('role','button');
    card.setAttribute('tabindex','0');
    card.onclick = () => location.href = `product.html?id=${p.id}`;
    card.onkeydown = e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    };
    const shortDesc = p.description.length > 80
      ? p.description.slice(0,80).trim() + '…'
      : p.description;
    card.innerHTML = `
      <div class="card__header">
        <img src="assets/icons/${iconMap[p.id]}" class="card__icon" alt="">
        <h2 class="card__title">${p.title}</h2>
      </div>
      <p class="card__desc">${shortDesc}</p>
      <div class="card__footer">
        <button class="card__btn listing">${translations.cta || 'Ver más'}</button>
      </div>
    `;
    container.appendChild(card);
  });
}

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

function showLanguageModal() {
  const modal = document.getElementById('language-modal');
  const content = document.getElementById('content');
  if (modal && content) {
    modal.classList.remove('hidden');
    content.classList.add('hidden');
  }
}

async function applyLanguage(lang) {
  localStorage.setItem('lang', lang);
  const modal = document.getElementById('language-modal');
  const content = document.getElementById('content');
  if (modal && content) {
    modal.classList.add('hidden');
    content.classList.remove('hidden');
  }
  // header/footer + theme
  await loadComponent('header','components/header.html');
  initThemeToggle();
  // enlazar globo SI existe
  document.getElementById('lang-toggle')?.addEventListener('click', showLanguageModal);
  await loadComponent('footer','components/footer.html');
  // traducciones + productos
  await loadTranslations(lang);
  renderProducts();
}

document.addEventListener('DOMContentLoaded', async () => {
  // 1) siempre inyectamos header/footer y tema
  await loadComponent('header','components/header.html');
  initThemeToggle();
  await loadComponent('footer','components/footer.html');

  // 2) idioma
  const savedLang = localStorage.getItem('lang');
  const confirmBtn = document.getElementById('language-confirm');
  const langSel    = document.getElementById('language');

  if (confirmBtn && langSel) {
    confirmBtn.addEventListener('click', () => applyLanguage(langSel.value));
    if (savedLang) {
      await applyLanguage(savedLang);
    } else {
      showLanguageModal();
    }
  } else if (savedLang) {
    // No estamos en la landing (no hay modal) pero sí cargamos traducciones
    await loadTranslations(savedLang);
    // Y si hay container de productos, lo renderizamos
    if (document.getElementById('products')) {
      renderProducts();
    }
  }
});
