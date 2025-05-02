// Carga un fragmento HTML en un elemento por su ID
async function loadComponent(id, url) {
    const res = await fetch(url);
    document.getElementById(id).innerHTML = await res.text();
  }
  
  // Traducciones cargadas desde JSON
  let translations = {};
  
  async function loadTranslations(lang) {
    const url = `locales/${lang}.json?t=${Date.now()}`;
    const res = await fetch(url);
    translations = await res.json();
    console.log('Traducciones cargadas:', lang, translations);
  }
  
  // Renderiza las tarjetas de producto con modificadores de clase
  function renderProducts() {
    const container = document.getElementById('products');
    container.innerHTML = '';
    translations.products.forEach(p => {
      const card = document.createElement('article');
      card.className = `card card--${p.id}`;
      card.innerHTML = `
        <figure class="card__thumb">
          <img src="assets/images/${p.id}.jpg" alt="${p.title}" />
        </figure>
        <div class="card__body">
          <h2 class="card__title">${p.title}</h2>
          <p class="card__desc">${p.description}</p>
          <a href="product.html?id=${p.id}" class="card__btn">${translations.cta}</a>
        </div>
      `;
      container.appendChild(card);
    });
  }
  
  document.getElementById('language').addEventListener('change', async e => {
    await loadTranslations(e.target.value);
    renderProducts();
  });
  
  // Inicialización al cargar la página
  (async () => {
    await loadComponent('header', 'components/header.html');
    await loadComponent('footer', 'components/footer.html');
    await loadTranslations('es');
    renderProducts();
  })();