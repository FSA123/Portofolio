/* ================================================================
   LOADER
   ================================================================ */
(function initLoader() {
  const loader = document.getElementById('loader');
  const fill   = document.getElementById('loader-fill');
  let progress = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 18 + 6;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      fill.style.width = '100%';
      setTimeout(() => loader.classList.add('hidden'), 400);
    }
    fill.style.width = progress + '%';
  }, 60);
})();

/* ================================================================
   CUSTOM CURSOR
   ================================================================ */
(function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;
  if (window.matchMedia('(pointer: coarse)').matches) {
    dot.style.display = ring.style.display = 'none';
    return;
  }

  let mx = 0, my = 0;
  let rx = 0, ry = 0;
  let rafId;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.transform  = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    dot.classList.remove('hidden');
    ring.classList.remove('hidden');
  });

  document.addEventListener('mouseleave', () => {
    dot.classList.add('hidden');
    ring.classList.add('hidden');
  });

  function animateRing() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    rafId = requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, [data-tilt], .nav-cta, .email-cta').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });
})();

/* ================================================================
   PARTICLE CANVAS NETWORK
   ================================================================ */
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];
  const MAX_DIST = 130;
  const PARTICLE_COUNT = () => Math.floor((W * H) / 12000);

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    spawnParticles();
  }

  function spawnParticles() {
    particles = [];
    const count = PARTICLE_COUNT();
    for (let i = 0; i < count; i++) {
      particles.push({
        x:  Math.random() * W,
        y:  Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r:  Math.random() * 1.5 + 0.4,
        hue: Math.random() > 0.5 ? 263 : 192,
      });
    }
  }

  let mouseX = -9999, mouseY = -9999;
  window.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mouseX = e.clientX - r.left;
    mouseY = e.clientY - r.top;
  });

  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 70%, 65%, 0.55)`;
      ctx.fill();
    }

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < MAX_DIST) {
          const alpha = 0.18 * (1 - dist / MAX_DIST);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
      // Mouse interaction glow
      const p = particles[i];
      const mdx = p.x - mouseX, mdy = p.y - mouseY;
      const md  = Math.hypot(mdx, mdy);
      if (md < 120) {
        const alpha = 0.35 * (1 - md / 120);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouseX, mouseY);
        ctx.strokeStyle = `rgba(34, 211, 238, ${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
})();

/* ================================================================
   TYPING ANIMATION
   ================================================================ */
(function initTyping() {
  const el = document.getElementById('typing-text');
  if (!el) return;

  const words = [
    'IoT Systems',
    'Web Applications',
    'Computer Vision',
    'Embedded Software',
    'Full-Stack Apps',
    'AI-Powered Tools',
  ];

  let wordIdx = 0, charIdx = 0, deleting = false;

  function type() {
    const word = words[wordIdx];
    el.textContent = word.slice(0, charIdx);

    if (!deleting && charIdx === word.length) {
      setTimeout(() => { deleting = true; type(); }, 2200);
      return;
    }
    if (deleting && charIdx === 0) {
      deleting = false;
      wordIdx  = (wordIdx + 1) % words.length;
    }
    charIdx += deleting ? -1 : 1;
    setTimeout(type, deleting ? 45 : 90);
  }
  setTimeout(type, 1200);
})();

/* ================================================================
   NAV: SCROLL BEHAVIOUR
   ================================================================ */
(function initNav() {
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ================================================================
   MOBILE MENU
   ================================================================ */
(function initMobileMenu() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  const toggle = () => {
    const open = menu.classList.toggle('open');
    btn.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  const close = () => {
    menu.classList.remove('open');
    btn.classList.remove('open');
    document.body.style.overflow = '';
  };

  btn.addEventListener('click', toggle);
  menu.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', close));
})();

/* ================================================================
   SCROLL REVEAL (IntersectionObserver)
   ================================================================ */
(function initReveal() {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('.reveal-up, .reveal-fade').forEach(el => observer.observe(el));
})();

/* ================================================================
   ANIMATED STAT COUNTERS
   ================================================================ */
(function initCounters() {
  const easeOut = t => 1 - Math.pow(1 - t, 3);

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el     = e.target;
      const target = parseInt(el.dataset.target, 10);
      const dur    = 1600;
      const start  = performance.now();

      function update(now) {
        const p = Math.min((now - start) / dur, 1);
        el.textContent = Math.floor(easeOut(p) * target);
        if (p < 1) requestAnimationFrame(update);
        else el.textContent = target;
      }
      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-num[data-target]').forEach(el => observer.observe(el));
})();

/* ================================================================
   3D CARD TILT
   ================================================================ */
(function initTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r   = card.getBoundingClientRect();
      const cx  = r.left + r.width  / 2;
      const cy  = r.top  + r.height / 2;
      const dx  = (e.clientX - cx) / (r.width  / 2);
      const dy  = (e.clientY - cy) / (r.height / 2);
      card.style.transform =
        `perspective(900px) rotateY(${dx * 5}deg) rotateX(${-dy * 5}deg) translateZ(8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform =
        'perspective(900px) rotateY(0) rotateX(0) translateZ(0)';
    });
  });
})();

/* ================================================================
   MAGNETIC BUTTONS
   ================================================================ */
(function initMagnetic() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r   = el.getBoundingClientRect();
      const cx  = r.left + r.width  / 2;
      const cy  = r.top  + r.height / 2;
      const dx  = (e.clientX - cx) * 0.22;
      const dy  = (e.clientY - cy) * 0.22;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
})();

/* ================================================================
   SMOOTH ACTIVE NAV LINK HIGHLIGHTING
   ================================================================ */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');
  if (!links.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => {
          const match = l.getAttribute('href') === `#${e.target.id}`;
          l.style.color = match ? 'var(--text-1)' : '';
        });
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });

  sections.forEach(s => observer.observe(s));
})();
