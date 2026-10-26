(() => {
  const canvas = document.getElementById('starfield');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = canvas.width = window.innerWidth;
  let h = canvas.height = window.innerHeight;

  const DPR = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = w * DPR; canvas.height = h * DPR; canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
  ctx.scale(DPR, DPR);

  const starCount = Math.round((w*h) / 14000);
  const stars = Array.from({length: starCount}, () => newStar());
  const shooting = [];

  function newStar(){
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.2 + 0.2,
      a: Math.random() * Math.PI * 2,
      d: Math.random() * 0.5 + 0.2 // parallax depth
    };
  }

  function newShooting(){
    const fromLeft = Math.random() < 0.5;
    const startX = fromLeft ? -50 : w + 50;
    const startY = Math.random() * h * 0.6;
    const vx = fromLeft ? (2 + Math.random()*2) : -(2 + Math.random()*2);
    const vy = 0.5 + Math.random();
    return {x:startX, y:startY, vx, vy, life: 0, max: 180 + Math.random()*120};
  }

  let last = performance.now();
  function draw(now){
    const dt = Math.min(32, now - last); last = now;
    ctx.clearRect(0,0,w,h);

    // background glow
    const grad = ctx.createRadialGradient(w*0.8, -h*0.2, h*0.1, w*0.8, -h*0.2, h*0.9);
    grad.addColorStop(0, 'rgba(60,80,180,0.15)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad; ctx.fillRect(0,0,w,h);

    // stars
    for(const s of stars){
      s.a += 0.015; // twinkle
      const tw = 0.7 + Math.sin(s.a) * 0.3;
      ctx.globalAlpha = 0.6 + tw*0.4;
      ctx.fillStyle = '#cfe3ff';
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r*tw, 0, Math.PI*2); ctx.fill();
      // subtle parallax drift
      s.x += 0.01 * (1-s.d); if(s.x > w) s.x = 0; if(s.x < 0) s.x = w;
    }
    ctx.globalAlpha = 1;

    // occasionally create a shooting star
    if(Math.random() < 0.01 && shooting.length < 2) shooting.push(newShooting());
    for(let i=shooting.length-1;i>=0;i--){
      const sh = shooting[i];
      sh.x += sh.vx * (dt/16);
      sh.y += sh.vy * (dt/16);
      sh.life += dt;
      ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(sh.x, sh.y); ctx.lineTo(sh.x - sh.vx*10, sh.y - sh.vy*10); ctx.stroke();
      if(sh.life > sh.max || sh.x < -100 || sh.x > w+100 || sh.y > h+100){ shooting.splice(i,1); }
    }

    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);

  // Boost stars handler: tăng số sao và thêm sao mới
  document.addEventListener('boost-stars', () => {
    const add = Math.round(stars.length * 0.25) + 20;
    for(let i=0;i<add;i++) stars.push(newStar());
  });

  window.addEventListener('resize', () => {
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w * DPR; canvas.height = h * DPR; canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    ctx.setTransform(1,0,0,1,0,0); ctx.scale(DPR, DPR);
  });
})();