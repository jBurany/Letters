// js/product.js

async function initProductPage() {
  // 1) Header + theme + footer
  await loadComponent('header','components/header.html');
  initThemeToggle();
  await loadComponent('footer','components/footer.html');

  // 2) Traducciones
  const lang = localStorage.getItem('lang') || 'es';
  await loadTranslations(lang);

  // 3) Leer params y buscar producto
  const params    = new URLSearchParams(location.search);
  const productId = params.get('id');
  const prod      = (translations.products || []).find(p => p.id === productId);

  const detailEl = document.getElementById('product-detail');
  const plansEl  = document.getElementById('plan-list');

  if (!prod) {
    detailEl.textContent = translations.productNotFound || 'Producto no encontrado';
    return;
  }

  // 4) Inyectar CSS específico
  const link = document.createElement('link');
  link.rel  = 'stylesheet';
  link.href = `css/products/${productId}.css`;
  document.head.appendChild(link);

  // 5) Renderizar hero
  const iconMap = {
    'carta-amor':'heart.svg','carta-perdon':'handshake.svg',
    'carta-agradecimiento':'gratitude.svg','carta-cumpleanos':'cake.svg',
    'carta-condolencias':'dove.svg','carta-futuro':'clock.svg'
  };
  detailEl.innerHTML = `
  <!-- Breadcrumb y Volver -->
  <nav aria-label="Breadcrumb" class="breadcrumb">
    <a href="index.html">🏠 Inicio</a>
    <span>›</span>
    <span id="breadcrumb-current">${prod.title}</span>
  </nav>
  <button class="btn-back" onclick="history.back()">← Volver</button>

  <!-- Hero del producto -->
  <div class="product-hero">
    <h1 class="product-hero__title">${prod.title}</h1>

    <!-- SVG de ondas animadas -->
    <svg
      class="waves"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
    >
      <path
        d="M0,40 C360,80 720,0 1080,40 C1440,80 1800,0 2160,40 L2160,80 L0,80 Z"
        fill="rgba(255,255,255,0.5)"
      />
    </svg>

    <p class="product-hero__desc">${prod.description}</p>
  </div>
`;

// Actualizar breadcrumb
document.getElementById('breadcrumb-current').textContent = prod.title;

  // 6) Renderizar planes
  plansEl.classList.add('plan-list');
  plansEl.innerHTML = prod.plans.map(plan => `
    <div class="plan-card">
      <div>
        <h3 class="plan-card__name">${plan.name}</h3>
        <p class="plan-card__words">${plan.words} palabras</p>
        <p class="plan-card__price"><strong>${plan.price}</strong></p>
      </div>
      <button
        class="plan-card__btn"
        data-producto="${prod.id}"
        data-plan="${plan.id}"
      >${translations.choosePlan || 'Elegir este plan'}</button>
    </div>
  `).join('');

  // 7) Botón → pago
  plansEl.querySelectorAll('.plan-card__btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id   = btn.dataset.producto;
      const plan = btn.dataset.plan;
      location.href = `payment.html?producto=${id}&plan=${plan}`;
    });
  });
}

document.addEventListener('DOMContentLoaded', initProductPage);
