/* ========================================================
   MEHAR BROTHERS RENT A CAR — script.js  (English Version)
   Features: Navbar, Hamburger, Particles, Scroll Animations,
   Active Nav, Ripple Effects, Counter Animation
   ======================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────
     1. NAVBAR — scroll shrink effect
  ────────────────────────────────────── */
  const navbar = document.getElementById('navbar');

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    updateActiveNav();
  };

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ──────────────────────────────────────
     2. HAMBURGER MENU
  ────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ──────────────────────────────────────
     3. ACTIVE NAV LINK ON SCROLL
  ────────────────────────────────────── */
  const sectionIds = ['home', 'fleet', 'about', 'our-story', 'contact'];
  const navMap = {
    home:        document.getElementById('nav-home'),
    fleet:       document.getElementById('nav-fleet'),
    about:       document.getElementById('nav-about'),
    'our-story': document.getElementById('nav-story'),
    contact:     document.getElementById('nav-contact'),
  };

  const updateActiveNav = () => {
    const offset = window.scrollY + 140;
    let active = 'home';

    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (el && el.offsetTop <= offset) active = id;
    });

    Object.values(navMap).forEach(n => n?.classList.remove('active'));
    navMap[active]?.classList.add('active');
  };

  updateActiveNav();

  /* ──────────────────────────────────────
     4. SMOOTH SCROLL (anchor links)
  ────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 74;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ──────────────────────────────────────
     5. PARTICLE GENERATOR (Hero section)
  ────────────────────────────────────── */
  const container = document.getElementById('particles');
  const TOTAL     = 22;

  for (let i = 0; i < TOTAL; i++) {
    const p = document.createElement('div');
    p.className = 'particle';

    const size     = Math.random() * 5 + 3;          // 3–8 px
    const left     = Math.random() * 100;             // 0–100%
    const delay    = Math.random() * 15;              // 0–15s
    const duration = Math.random() * 12 + 14;        // 14–26s
    const hue      = Math.random() > 0.65 ? '24' : '210'; // orange or blue-ish
    const alpha    = (Math.random() * 0.2 + 0.05).toFixed(2);

    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      bottom: -30px;
      background: hsla(${hue}, 90%, 65%, ${alpha});
      animation-duration: ${duration}s;
      animation-delay: -${delay}s;
    `;

    container.appendChild(p);
  }

  /* ──────────────────────────────────────
     6. SCROLL-REVEAL (IntersectionObserver)
  ────────────────────────────────────── */
  const revealEls = [
    ...document.querySelectorAll('.svc-card'),
    ...document.querySelectorAll('.fleet-card'),
    ...document.querySelectorAll('.why-card'),
    ...document.querySelectorAll('.owner-card'),
    ...document.querySelectorAll('.address-card'),
    ...document.querySelectorAll('.map-container'),
    ...document.querySelectorAll('.sec-header'),
    document.querySelector('.trust-strip'),
  ].filter(Boolean);

  revealEls.forEach(el => el.classList.add('fade-up'));

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el    = entry.target;
      const delay = parseInt(el.dataset.delay || '0');
      setTimeout(() => el.classList.add('visible'), delay);
      revealObserver.unobserve(el);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ──────────────────────────────────────
     7. FLOATING WHATSAPP — entrance animation
  ────────────────────────────────────── */
  const waBtn = document.getElementById('wa-float-btn');
  if (waBtn) {
    waBtn.style.cssText = 'transform: scale(0); opacity: 0; transition: transform 0.5s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s ease;';
    setTimeout(() => {
      waBtn.style.transform = 'scale(1)';
      waBtn.style.opacity   = '1';
    }, 1800);
  }

  /* ──────────────────────────────────────
     8. RIPPLE EFFECT on buttons
  ────────────────────────────────────── */
  const injectRippleCSS = () => {
    if (document.getElementById('ripple-css')) return;
    const s = document.createElement('style');
    s.id = 'ripple-css';
    s.textContent = '@keyframes ripple { to { transform: scale(4); opacity: 0; } }';
    document.head.appendChild(s);
  };

  injectRippleCSS();

  const addRipple = (e) => {
    const btn  = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const r    = document.createElement('span');
    const size = Math.max(rect.width, rect.height) * 2.5;

    Object.assign(r.style, {
      position:     'absolute',
      borderRadius: '50%',
      width:        `${size}px`,
      height:       `${size}px`,
      left:         `${e.clientX - rect.left - size / 2}px`,
      top:          `${e.clientY - rect.top  - size / 2}px`,
      background:   'rgba(255,255,255,0.22)',
      transform:    'scale(0)',
      animation:    'ripple 0.65s ease-out forwards',
      pointerEvents:'none',
    });

    if (getComputedStyle(btn).position === 'static') btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.appendChild(r);
    setTimeout(() => r.remove(), 700);
  };

  document.querySelectorAll('.btn, .wa-book-btn, .btn-call, .btn-wa, .map-open-btn, .directions-btn, .social-btn').forEach(btn => {
    btn.addEventListener('click', addRipple);
  });

  /* ──────────────────────────────────────
     9. STAT NUMBER — bounce animation on enter
  ────────────────────────────────────── */
  const statsEl = document.querySelector('.hero-stats');
  if (statsEl) {
    const statsObserver = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      statsEl.querySelectorAll('.stat-num').forEach((num, i) => {
        setTimeout(() => {
          num.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
          num.style.transform  = 'scale(1.15)';
          setTimeout(() => { num.style.transform = 'scale(1)'; }, 250);
        }, i * 120);
      });
      statsObserver.unobserve(statsEl);
    }, { threshold: 0.7 });

    statsObserver.observe(statsEl);
  }

  /* ──────────────────────────────────────
     10. FOOTER YEAR auto-update
  ────────────────────────────────────── */
  const yearEls = document.querySelectorAll('.copy-text');
  const yr = new Date().getFullYear();
  yearEls.forEach(el => {
    el.innerHTML = el.innerHTML.replace('2026', yr);
  });

  /* ──────────────────────────────────────
     11. HIACE IMAGE SLIDER
  ────────────────────────────────────── */
  const hiaceSlider = document.getElementById('hiaceSlider');
  if (hiaceSlider) {
    const slides  = hiaceSlider.querySelectorAll('.hiace-slide');
    const dots    = hiaceSlider.querySelectorAll('.slider-dot');
    const btnPrev = document.getElementById('hiace-prev');
    const btnNext = document.getElementById('hiace-next');
    let current   = 0;
    let autoTimer = null;

    const goTo = (idx) => {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = (idx + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
    };

    const startAuto = () => {
      autoTimer = setInterval(() => goTo(current + 1), 3500);
    };

    const stopAuto = () => clearInterval(autoTimer);

    if (btnNext) btnNext.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });
    if (btnPrev) btnPrev.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        stopAuto();
        goTo(parseInt(dot.dataset.idx));
        startAuto();
      });
    });

    // Touch / swipe support for mobile
    let touchStartX = 0;
    hiaceSlider.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    hiaceSlider.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 40) {
        stopAuto();
        goTo(diff > 0 ? current + 1 : current - 1);
        startAuto();
      }
    });

    // Pause on hover
    hiaceSlider.addEventListener('mouseenter', stopAuto);
    hiaceSlider.addEventListener('mouseleave', startAuto);

    startAuto(); // kick off
  }

  console.log('%c🚗 Mehar Brothers Rent a Car', 'font-size:16px;font-weight:bold;color:#f97316;');
  console.log('%cDesigned & Developed by Ghulam Dastgeer', 'color:#94a3b8;font-size:12px;');
});
