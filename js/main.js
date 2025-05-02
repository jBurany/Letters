// Carga un fragmento HTML en un elemento por su ID
en async function loadComponent(id, url) {
    const res = await fetch(url);
    document.getElementById(id).innerHTML = await res.text();
}

// Traducciones cargadas desde JSON\let translations = {};

async function loadTranslations(lang) {
    const res = await fetch(`locales/${lang}.json`);
    translations = await res.json();
}

// Renderiza las tarjetas de producto según translations.products
function renderProducts() {
    const container = document.getElementById('products');
    container.innerHTML = '';
    translations.products.forEach(p => {
        const card = document.createElement('article');
        card.innerHTML = `
            <h2>${p.title}</h2>
            <p>${p.description}</p>
        `;
        container.appendChild(card);
    });
}

document.getElementById('language').addEventListener('change', async e => {
    await loadTranslations(e.target.value);
    renderProducts();
});

// Inicialización al cargar la página
en (async () => {
    await loadComponent('header', 'components/header.html');
    await loadComponent('footer', 'components/footer.html');
    await loadTranslations('es');
    renderProducts();
})();
