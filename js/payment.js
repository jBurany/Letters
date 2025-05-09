// js/payment.js

// Inicializa la página de pago: carga datos y configura botones
async function initPaymentPage() {
  // Parámetros de URL
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('product');
  const planId = params.get('plan');

  // Carga traducciones según idioma guardado
  const lang = localStorage.getItem('lang') || 'es';
  await loadTranslations(lang);

  // Busca producto y plan
  const product = translations.products.find(p => p.id === productId);
  const plan = Array.isArray(translations.plans)
    ? translations.plans.find(pl => pl.id === planId)
    : null;

  // Rellena resumen
  document.getElementById('summary-product').textContent = product ? product.title : '';
  document.getElementById('summary-plan').textContent = plan ? plan.name : '';
  document.getElementById('summary-price').textContent = plan ? plan.price : '';

  // Configura botones de pago
  const btnPayPal = document.getElementById('btn-paypal');
  const btnMercadoPago = document.getElementById('btn-mercadopago');

  btnPayPal.addEventListener('click', () => {
    // TODO: integrar con tu backend para generar orden PayPal
    // Placeholder: redirige a PayPal con parámetros básicos
    const url = `https://www.paypal.com/checkout?amount=${encodeURIComponent(plan.price)}&currency=USD&item_name=${encodeURIComponent(product.title)}`;
    window.location.href = url;
  });

  btnMercadoPago.addEventListener('click', () => {
    // TODO: generar preferencia de pago vía API MercadoPago
    // Placeholder: redirige a la pasarela de MercadoPago
    const url = `https://www.mercadopago.com/checkout?amount=${encodeURIComponent(plan.price)}&item_name=${encodeURIComponent(product.title)}`;
    window.location.href = url;
  });
}

// Ejecuta al cargar la página
document.addEventListener('DOMContentLoaded', initPaymentPage);
