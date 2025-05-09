// js/form.js

// Inicializa la página de formulario: extrae parámetros y maneja envío al pago
document.addEventListener('DOMContentLoaded', async () => {
    // Extraer productId y planId de la URL
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('product');
    const planId = params.get('plan');
  
    // Poner valores ocultos en el form
    document.getElementById('product-id').value = productId;
    document.getElementById('plan-id').value = planId;
  
    // Cargar traducciones para poder usar textos si necesario
    const lang = localStorage.getItem('lang') || 'es';
    await loadTranslations(lang);
  
    // Opcional: mostrar resumen breve en el formulario
    const summaryEl = document.getElementById('form-summary');
    if (summaryEl) {
      const product = translations.products.find(p => p.id === productId);
      const plan = Array.isArray(translations.plans)
        ? translations.plans.find(pl => pl.id === planId)
        : null;
      if (product && plan) {
        summaryEl.innerHTML = `
          <p><strong>Producto:</strong> ${product.title}</p>
          <p><strong>Plan:</strong> ${plan.name}</p>
          <p><strong>Precio:</strong> ${plan.price}</p>
        `;
      }
    }
  
    // Al enviar el formulario, redirigir a payment.html con todos los campos como query params
    const form = document.getElementById('order-form');
    form.addEventListener('submit', e => {
      e.preventDefault();
      const data = new FormData(form);
      const query = new URLSearchParams(data).toString();
      window.location.href = `payment.html?${query}`;
    });
  });