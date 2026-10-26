// Typewriter for confession subtitle
(function(){
  const el = document.getElementById('typewriter');
  if(!el) return;
  const words = [
    'Anh thương em nhiều hơn những vì sao trên bầu trời.',
    'Mỗi khoảnh khắc bên em đều lấp lánh.',
    'Đi qua vũ trụ rộng lớn, anh chỉ muốn nắm tay em. ❤'
  ];
  let i=0, j=0, deleting=false, pause=900;
  function tick(){
    const w = words[i];
    if(!deleting){ j++; el.textContent = w.slice(0,j); }
    else { j--; el.textContent = w.slice(0,j); }

    if(!deleting && j === w.length){ deleting = true; setTimeout(tick, pause); return; }
    if(deleting && j === 0){ deleting = false; i = (i+1)%words.length; setTimeout(tick, 400); return; }
    setTimeout(tick, deleting ? 38 : 54);
  }
  tick();
})();

// Controls: mailbox modal, letters storage, sparkles and stars boost
(function(){
  const openBtn = document.getElementById('openMailbox');
  const modal = document.getElementById('mailbox');
  const closeBtn = document.getElementById('closeMailbox');
  const form = document.getElementById('mailForm');
  const chips = document.querySelectorAll('.chip');
  const msg = document.getElementById('message');
  const counter = document.getElementById('charCount');
  const list = document.getElementById('lettersList');
  const clearBtn = document.getElementById('clearLetters');
  const toggleTwinkle = document.getElementById('toggleTwinkle');
  const boostStars = document.getElementById('boostStars');

  if(openBtn && modal) openBtn.addEventListener('click', ()=>{ modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); });
  if(closeBtn && modal) closeBtn.addEventListener('click', ()=>{ modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); });
  if(modal) modal.addEventListener('click', (e)=>{ if(e.target === modal){ modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); } });
  document.addEventListener('keydown', (e)=>{ if(e.key==='Escape' && modal?.classList.contains('open')){ modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); } });

  // chip mood select
  let selectedMood = '';
  chips.forEach(c => c.addEventListener('click', ()=>{ chips.forEach(x=>x.classList.remove('active')); c.classList.add('active'); selectedMood = c.dataset.value || ''; }));

  // char counter
  if(msg && counter){
    const upd=()=> counter.textContent = String(msg.value.length);
    msg.addEventListener('input', upd); upd();
  }

  const KEY = 'confess_letters_v1';
  function load(){ try{ return JSON.parse(localStorage.getItem(KEY) || '[]'); }catch{ return []; } }
  function save(data){ localStorage.setItem(KEY, JSON.stringify(data)); }
  function render(){
    if(!list) return; list.innerHTML = '';
    const arr = load();
    arr.slice().reverse().forEach(it=>{
      const card = document.createElement('div'); card.className='letter-card';
      const head = document.createElement('div'); head.className='letter-head'; head.innerHTML = `<span>${escapeHtml(it.sender||'Ẩn danh')}</span><span class="letter-mood">${escapeHtml(it.mood||'')}</span>`;
      const text = document.createElement('div'); text.className='letter-text'; text.textContent = it.message || '';
      const time = document.createElement('div'); time.className='letter-time'; time.textContent = new Date(it.time||Date.now()).toLocaleString();
      card.append(head,text,time); list.appendChild(card);
    });
  }
  function escapeHtml(s){ return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[m])); }

  clearBtn?.addEventListener('click', ()=>{ if(confirm('Xóa tất cả thư đã lưu trên máy này?')){ save([]); render(); }});

  form?.addEventListener('submit', (e)=>{
    e.preventDefault();
    const sender = (document.getElementById('sender')||{}).value?.trim() || '';
    const message = msg?.value.trim() || '';
    if(!message){ alert('Hãy viết lời nhắn nhé!'); return; }
    const arr = load();
    arr.push({sender, mood:selectedMood, message, time: Date.now()});
    save(arr); render();
    heartFireworks();
    form.reset(); selectedMood=''; chips.forEach(x=>x.classList.remove('active')); counter && (counter.textContent='0');
    modal?.classList.remove('open'); modal?.setAttribute('aria-hidden','true');
  });

  function heartFireworks(){
    const n=22; const frag=document.createDocumentFragment();
    for(let i=0;i<n;i++){
      const s=document.createElement('span'); s.textContent='❤'; s.style.position='fixed'; s.style.left='50%'; s.style.top='50%'; s.style.transform='translate(-50%,-50%)'; s.style.pointerEvents='none'; s.style.fontSize=(16+Math.random()*18)+'px'; s.style.filter='drop-shadow(0 8px 20px rgba(255,111,179,.6))'; s.style.zIndex='9';
      const ang=Math.random()*Math.PI*2; const dist= 80 + Math.random()*220; const dx=Math.cos(ang)*dist; const dy=Math.sin(ang)*dist;
      s.animate([{transform:'translate(-50%,-50%) scale(0.6)', opacity:1},{transform:`translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(1.4)`, opacity:0}],{duration:900+Math.random()*600, easing:'cubic-bezier(.2,.7,.2,1)'}).onfinish=()=>s.remove();
      frag.appendChild(s);
    }
    document.body.appendChild(frag);
  }

  // toggles
  toggleTwinkle?.addEventListener('click', ()=>{ document.body.classList.toggle('twinkle-on'); });
  boostStars?.addEventListener('click', ()=>{ document.dispatchEvent(new CustomEvent('boost-stars')); });

  render();
})();

// Build 4 bands with 22 photos, infinite horizontal scroll
(function(){
  const images = [
    'z7384682563629_ad7e3b9dcd333b9acbcab8e633be56d0.jpg',
    'z7384682573094_d6f31079c09992533c1eac8dcc2446e3.jpg',
    'z7384682574972_25d26a818a156be57e7831a8241a264a.jpg',
    'z7384682587235_db20ab605513d4a4bcdc0aefe05c4418.jpg',
    'z7384682590177_ff397f41bf9a9fb1b67da0ef65496016.jpg',
    'z7384682605918_83a60727b5cd329fd90db8fd4859cfa9.jpg',
    'z7384682606203_9dde1a794d2808d761029ce8cb5a3468.jpg',
    'z7384682613517_b5f728afc6add53f9995829d0e1208cf.jpg',
    'z7384682619566_f292add528c52fb7ed613890d3c85c83.jpg',
    'z7384682623197_f5991f3f9178e9a30ae4e42202065e7e.jpg',
    'z7384682630199_b2b041eea86f3950250c30c98b814188.jpg',
    'z7384682646286_fa4119dab398d424a1aeb034d2fd19b3.jpg',
    'z7384682648443_ca0daeb67408657e89623c71cc9b9e68.jpg',
    'z7384682652457_e980a9a26ac851f51f7edf5fd0aab56b.jpg',
    'z7384682665019_cb9ebe0108ec608b50942ff089ed2199.jpg',
    'z7384682668989_d4a6f6b24cc25416a0b2339b1482b628.jpg',
    'z7384682680565_8f5d23844214bdc1e277690f5b749d9f.jpg',
    'z7384682689444_84a53c95875616643e9a432768f0cd2f.jpg',
    'z7384682689754_3d750d5ae05988cf24a3d42cc7cae9c3.jpg',
    'z7384682693739_f2a8ba98dbcf1100090e7c335f612dcc.jpg',
    'z7384688935919_973b5c2dc6faa806bfcafef78f39d85e.jpg',
    'z7384688938694_f7cf0b2669686301e2877ceef0218d30.jpg'
  ];

  const bands = [
    document.querySelector('.band-top'),
    document.querySelector('.band-upper'),
    document.querySelector('.band-lower'),
    document.querySelector('.band-bottom')
  ];
  if(bands.some(b => !b)) return;

  // Distribute images roughly equally into 4 arrays
  const buckets = [[],[],[],[]];
  images.forEach((src, idx) => buckets[idx % 4].push(src));

  const streams = [];
  bands.forEach((band, i) => {
    const dirLTR = band.classList.contains('ltr');
    const speed = Number(band.getAttribute('data-speed') || 40); // px per second

    const stream = document.createElement('div');
    stream.className = 'stream';

    // fill once + clone to create seamless loop
    const list = buckets[i];
    const addThumb = (url) => {
      const t = document.createElement('div'); t.className = 'thumb';
      const img = document.createElement('img'); img.src = url; img.alt = 'Khoảnh khắc';
      t.appendChild(img); stream.appendChild(t);
      // open as new tab on click
      t.addEventListener('click', () => window.open(url, '_blank'));
      return t;
    };

    list.forEach(addThumb);
    list.forEach(addThumb); // duplicate once

    band.appendChild(stream);

    // measure width
    const measure = () => Array.from(stream.children).reduce((acc, el) => acc + el.getBoundingClientRect().width + 10, 0) - 10;
    let totalWidth = 0;

    function ensureWidth(){
      totalWidth = measure();
      const bandWidth = band.clientWidth;
      // if still not enough to cover screen, duplicate more
      while(totalWidth < bandWidth * 2){
        list.forEach(addThumb);
        totalWidth = measure();
      }
    }

    ensureWidth();

    // animation state
    let offset = dirLTR ? 0 : -totalWidth/2;
    streams.push({band, stream, dirLTR, speed, offset, totalWidth, ensureWidth});
  });

  let last = performance.now();
  function tick(now){
    const dt = (now - last) / 1000; last = now;
    streams.forEach(s => {
      s.ensureWidth(); // handle resize/late image load
      const dist = s.speed * dt;
      s.offset += s.dirLTR ? dist : -dist;
      if(s.offset > s.totalWidth/2) s.offset -= s.totalWidth/2;
      if(s.offset < -s.totalWidth/2) s.offset += s.totalWidth/2;
      s.stream.style.transform = `translate3d(${s.dirLTR ? -s.offset : s.offset}px, -50%, 0)`;
    });
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  window.addEventListener('resize', () => { streams.forEach(s => s.ensureWidth()); });
})();
