document.addEventListener('DOMContentLoaded', () => {
    const pCanvas = document.getElementById('particles');
    const wCanvas = document.getElementById('waves');
    const pCtx = pCanvas.getContext('2d');
    const wCtx = wCanvas.getContext('2d');
  
    // Ajuste de tamaño
    function resize() {
      pCanvas.width = wCanvas.width = window.innerWidth;
      pCanvas.height = wCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();
  
    // — Partículas —
    const particles = [];
    const N = 120;
    for (let i = 0; i < N; i++) {
      particles.push({
        x: Math.random() * pCanvas.width,
        y: Math.random() * pCanvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 1
      });
    }
  
    // — Ondas —
    let waveOffset = 0;
  
    function animate() {
      // Limpia
      pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
      wCtx.clearRect(0, 0, wCanvas.width, wCanvas.height);
  
      // --- Dibuja partículas ---
      pCtx.fillStyle = 'rgba(0,0,0,0.4)';
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        // rebote en bordes
        if (p.x < 0) p.x = pCanvas.width;
        if (p.x > pCanvas.width) p.x = 0;
        if (p.y < 0) p.y = pCanvas.height;
        if (p.y > pCanvas.height) p.y = 0;
  
        pCtx.beginPath();
        pCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        pCtx.fill();
      });
  
      // --- Dibuja ondas senoidales ---
      waveOffset += 0.02;
      const amp = 20;
      const freq = 0.008;
      wCtx.lineWidth = 2;
      wCtx.strokeStyle = 'rgba(0,0,0,0.2)';
  
      [wCanvas.height * 0.4, wCanvas.height * 0.6].forEach(baseY => {
        wCtx.beginPath();
        for (let x = 0; x <= wCanvas.width; x++) {
          const y = baseY + Math.sin(x * freq + waveOffset) * amp;
          x === 0 ? wCtx.moveTo(x, y) : wCtx.lineTo(x, y);
        }
        wCtx.stroke();
      });
  
      requestAnimationFrame(animate);
    }
  
    animate();
  });
  