// js/product.js

async function initProductPage() {
    // 1) Inyectar header y activar toggle de tema
    await loadComponent('header', 'components/header.html');
    initThemeToggle();
  
    // 2) Cargar traducciones según preferencia guardada
    const lang = localStorage.getItem('lang') || 'es';
    await loadTranslations(lang);
  
    // 3) Obtener producto de la URL
    const params    = new URLSearchParams(location.search);
    const productId = params.get('id');
    const prod      = translations.products.find(p => p.id === productId);
  
    const detailEl = document.getElementById('product-detail');
    if (!prod) {
      detailEl.innerHTML = `<p>${translations.productNotFound}</p>`;
    } else {
      // 4) Cargar CSS específico del producto
      const link = document.createElement('link');
      link.rel  = 'stylesheet';
      link.href = `css/products/${productId}.css`;
      document.head.appendChild(link);
  
      // 5) Renderizar detalle
      detailEl.innerHTML = `
        <article class="product-detail ${productId}">
          <h1>${prod.title}</h1>
          <p>${prod.description}</p>
          <!-- Aquí puedes agregar galerías, sliders, etc. -->
        </article>
      `;
  
      // 6) Actualizar meta-tags para SEO y redes sociales
      const pageTitle = `${prod.title} – Letters`;
      document.getElementById('meta-title').textContent         = pageTitle;
      document.title                                         = pageTitle;
      document.getElementById('meta-description').content     = prod.description;
      document.getElementById('meta-canonical').href          = window.location.href;
      document.getElementById('og-title').content             = pageTitle;
      document.getElementById('og-description').content       = prod.description;
      document.getElementById('og-url').content               = window.location.href;
      // document.getElementById('og-image').content = prod.imageUrl; // si tienes URL de imagen
      document.getElementById('twitter-title').content        = pageTitle;
      document.getElementById('twitter-desc').content         = prod.description;
    }
  
    // 7) Inyectar footer
    await loadComponent('footer', 'components/footer.html');
  }
  
  document.addEventListener('DOMContentLoaded', initProductPage);
  