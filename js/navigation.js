// js/navigation.js

// Contenedor principal para la navegación suave
const container = document.getElementById('page-container');

// Intercepta clics en enlaces con data-link
document.addEventListener('click', e => {
  const link = e.target.closest('a[data-link]');
  if (!link) return;
  e.preventDefault();
  navigateTo(link.href);
});

// Función principal de navegación
async function navigateTo(url) {
  // Desvanece la página actual
  container.classList.add('fade-out');
  // Espera a que termine la transición
  await new Promise(resolve => container.addEventListener('transitionend', resolve, { once: true }));

  try {
    // Trae la nueva página
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Error ${res.status}`);
    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Reemplaza sólo el contenido de #page-container
    const newContent = doc.getElementById('page-container').innerHTML;
    container.innerHTML = newContent;

    // Actualiza la URL en el historial
    window.history.pushState(null, '', url);

    // Re-inicializa scripts según la página actual
    initializePage();
  } catch (err) {
    console.error('Navigation failed:', err);
    // En caso de error, recarga completa como fallback
    window.location.href = url;
  } finally {
    // Vuelve a mostrar el contenedor
    container.classList.remove('fade-out');
  }
}

// Manejo de atrás/adelante del navegador
window.addEventListener('popstate', () => navigateTo(location.href));

// Inicializa comportamiento según la ruta actual
function initializePage() {
  // Ejemplos:
  // loadComponent('header', 'components/header.html');
  // loadComponent('footer', 'components/footer.html');
  // if (location.pathname.includes('product.html')) renderProductDetail();
  // if (location.pathname.endsWith('index.html')) renderProducts();
  
  // Llama al entrypoint de tu main.js
  if (typeof main === 'function') main();
}

// Llamada inicial
document.addEventListener('DOMContentLoaded', initializePage);