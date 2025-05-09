// js/background.js

// Animación de partículas simple en el canvas de fondo
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  const particleCount = 50;
  const maxVelocity = 0.5;
  const particleSize = 3;

  // Ajustar tamaño del canvas
  function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Crear partículas iniciales
  function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * maxVelocity,
        vy: (Math.random() - 0.5) * maxVelocity,
      });
    }
  }

  // Dibujar todas las partículas
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = getComputedStyle(document.documentElement)
      .getPropertyValue('--color-primary')?.trim() || '#6C63FF';
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, particleSize, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // Actualizar posición de partículas
  function update() {
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      // Rebotar en bordes
      if (p.x <= 0 || p.x >= canvas.width) p.vx *= -1;
      if (p.y <= 0 || p.y >= canvas.height) p.vy *= -1;
    });
  }

  // Loop de animación
  function animate() {
    update();
    draw();
    requestAnimationFrame(animate);
  }

  initParticles();
  animate();
});