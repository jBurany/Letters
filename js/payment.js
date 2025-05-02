// js/payment.js

async function initPaymentPage() {
    // 1) Header/footer + theme
    await loadComponent('header','components/header.html');
    initThemeToggle();
    await loadComponent('footer','components/footer.html');
  
    // 2) Leer URL params
    const params    = new URLSearchParams(location.search);
    const producto  = params.get('producto');
    const plan      = params.get('plan');
    const status    = params.get('status'); // tras checkout
  
    // 3) Si venimos del gateway con éxito, redirigir al formulario
    if (status === 'success' && producto && plan) {
      return location.href = `formulario.html?producto=${producto}&plan=${plan}`;
    }
  
    // 4) Sino, creamos el link de pago
    try {
      const res = await fetch('/api/create-payment-link', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ producto, plan })
      });
      const { url } = await res.json();
      // redirigir al usuario
      window.location.href = url;
    } catch (err) {
      console.error(err);
      document.getElementById('payment-container').innerHTML = `
        <p>Error al generar enlace de pago. Intenta nuevamente más tarde.</p>
      `;
    }
  }
  
  document.addEventListener('DOMContentLoaded', initPaymentPage);
  