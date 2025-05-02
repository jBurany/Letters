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
  
      const shortDesc = p.description.length > 80
        ? p.description.slice(0, 80).trim() + '…'
        : p.description;
  
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
  

  document.addEventListener('DOMContentLoaded', () => {
    const modal   = document.getElementById('language-modal');
    const content = document.getElementById('content');
    const langSel = document.getElementById('language');
    const confirm = document.getElementById('language-confirm');
  
    confirm.addEventListener('click', async () => {
      const lang = langSel.value;
      // Si no hay valor (por si pones placeholder), sales:
      if (!lang) return;
  
      // 1) Ocultar modal y mostrar contenido
      modal.classList.add('hidden');
      content.classList.remove('hidden');
  
      // 2) Cargar header/footer y traducciones + productos
      await loadComponent('header', 'components/header.html');
      await loadComponent('footer', 'components/footer.html');
      await loadTranslations(lang);
      renderProducts();
    });
  });
  
  