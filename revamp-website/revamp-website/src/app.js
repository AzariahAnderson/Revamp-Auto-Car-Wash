/* =========================================================
   REVAMP AUTO CAR WASH — motion & interaction
   GSAP 3.13 + ScrollTrigger + Lenis smooth scroll
   ========================================================= */
(function () {
  'use strict';

  /* ---------- runtime font loading (FontFace API) ---------- */
  var FONT_SOURCES = [
    { family: 'Anton', weight: '400', data: '__FONT_ANTON__' },
    { family: 'Space Grotesk', weight: '400', data: '__FONT_SG400__' },
    { family: 'Space Grotesk', weight: '500', data: '__FONT_SG500__' },
    { family: 'Space Grotesk', weight: '700', data: '__FONT_SG700__' }
  ];
  function loadFonts() {
    if (!('FontFace' in window)) return Promise.resolve();
    return Promise.all(FONT_SOURCES.map(function (s) {
      var ff = new FontFace(s.family, 'url(data:font/woff2;base64,' + s.data + ')', { weight: s.weight, style: 'normal' });
      return ff.load().then(function (f) { document.fonts.add(f); }).catch(function () { /* keep fallbacks */ });
    }));
  }
  var fontsReady = loadFonts();

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: 'power4.out', duration: 1 });

  /* ---------- Lenis smooth scroll ---------- */
  var lenis = null;
  if (!reduced && window.Lenis) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true, touchMultiplier: 1.6 });
    window.lenis = lenis; // exposed for debugging / deep links
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  function scrollToTarget(sel) {
    var el = typeof sel === 'string' ? document.querySelector(sel) : sel;
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -70, duration: 1.3 });
    else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  }

  /* ---------- helpers: split words ---------- */
  function splitWords(el) {
    var text = el.textContent.trim();
    el.textContent = '';
    text.split(/\s+/).forEach(function (word, i) {
      var w = document.createElement('span'); w.className = 'w';
      var wi = document.createElement('span'); wi.className = 'wi';
      wi.textContent = word;
      w.appendChild(wi); el.appendChild(w);
      if (i < text.split(/\s+/).length - 1) el.appendChild(document.createTextNode(' '));
    });
  }
  document.querySelectorAll('[data-split]').forEach(splitWords);

  /* ---------- header hide/show ---------- */
  var head = document.getElementById('siteHead');
  var lastY = 0;
  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: function (self) {
      var y = self.scroll();
      head.classList.toggle('scrolled', y > 40);
      if (Math.abs(y - lastY) < 60) return;
      if (y > lastY && y > 320 && !document.body.classList.contains('menu-open')) {
        gsap.to(head, { yPercent: -170, duration: 0.55, ease: 'power3.inOut' });
      } else {
        gsap.to(head, { yPercent: 0, duration: 0.5, ease: 'power3.inOut' });
      }
      lastY = y;
    }
  });

  /* ---------- mobile menu ---------- */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');
  var menuTl = gsap.timeline({ paused: true });
  menuTl.to(menu, { clipPath: 'inset(0 0 0% 0)', visibility: 'visible', duration: 0.7, ease: 'power4.inOut' })
      .from(menu.querySelectorAll('.m-link'), { y: 46, opacity: 0, stagger: 0.07, duration: 0.7 }, '-=0.25')
      .from(menu.querySelector('.m-foot'), { opacity: 0, y: 20, duration: 0.5 }, '-=0.35');
  function setMenu(open) {
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open);
    menu.setAttribute('aria-hidden', !open);
    if (lenis) open ? lenis.stop() : lenis.start();
    open ? menuTl.play() : menuTl.reverse();
  }
  burger.addEventListener('click', function () {
    setMenu(!document.body.classList.contains('menu-open'));
  });
  menu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });

  /* ---------- anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length > 1 && document.querySelector(id)) {
        e.preventDefault();
        scrollToTarget(id);
      }
    });
  });
  document.getElementById('toTop').addEventListener('click', function () {
    if (lenis) lenis.scrollTo(0, { duration: 1.5 }); else window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- reveal builders ---------- */
  function buildScrollReveals() {
    gsap.set('.line-in', { y: '112%', rotate: 2.4 });

    // line-mask reveals
    gsap.utils.toArray('.sec-title, .book-title').forEach(function (title) {
      gsap.to(title.querySelectorAll('.line-in'), {
        y: 0, rotate: 0, duration: 1.2, stagger: 0.13, ease: 'power4.out',
        scrollTrigger: { trigger: title, start: 'top 86%' }
      });
    });

    // batched staggers: cards, table rows, method steps, info columns
    gsap.set('.card', { y: 52, opacity: 0 });
    gsap.set('.card .badge', { scale: 0.82, rotate: -8 });
    ScrollTrigger.batch('.card', {
      start: 'top 88%', once: true,
      onEnter: function (batch) {
        gsap.to(batch, { y: 0, opacity: 1, duration: 1.1, stagger: 0.14, ease: 'power3.out' });
        gsap.to(batch.map(function (c) { return c.querySelector('.badge'); }), {
          scale: 1, rotate: 0, duration: 1.3, stagger: 0.14, ease: 'back.out(1.5)'
        });
      }
    });

    gsap.set('.t-row:not(.t-head)', { y: 26, opacity: 0 });
    ScrollTrigger.batch('.t-row:not(.t-head)', {
      start: 'top 90%', once: true,
      onEnter: function (batch) {
        gsap.to(batch, { y: 0, opacity: 1, duration: 0.9, stagger: 0.1, ease: 'power3.out' });
      }
    });

    gsap.set('.step', { y: 34, opacity: 0 });
    ScrollTrigger.batch('.step', {
      start: 'top 88%', once: true,
      onEnter: function (batch) {
        gsap.to(batch, { y: 0, opacity: 1, duration: 1, stagger: 0.12, ease: 'power3.out' });
      }
    });

    gsap.set('.book-grid > div, .foot-grid > div', { y: 30, opacity: 0 });
    ScrollTrigger.batch('.book-grid > div, .foot-grid > div', {
      start: 'top 92%', once: true,
      onEnter: function (batch) {
        gsap.to(batch, { y: 0, opacity: 1, duration: 0.95, stagger: 0.11, ease: 'power3.out' });
      }
    });

    // word reveals (statements)
    gsap.set('.wi', { y: '115%', rotate: 2 });
    gsap.utils.toArray('[data-split]').forEach(function (p) {
      gsap.to(p.querySelectorAll('.wi'), {
        y: 0, rotate: 0, duration: 1.1, stagger: 0.026, ease: 'power4.out',
        scrollTrigger: { trigger: p, start: 'top 88%' }
      });
    });

    // generic fade-ups
    gsap.utils.toArray('.fade-up').forEach(function (el) {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 1.05, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%' }
      });
    });

    // price count-ups
    gsap.utils.toArray('[data-count]').forEach(function (el) {
      var target = parseInt(el.dataset.count, 10);
      var obj = { v: 0 };
      ScrollTrigger.create({
        trigger: el, start: 'top 90%', once: true,
        onEnter: function () {
          gsap.to(obj, {
            v: target, duration: 1.6, ease: 'power2.out',
            onUpdate: function () { el.textContent = Math.round(obj.v); }
          });
        }
      });
    });

    // footer giant fill
    ScrollTrigger.create({
      trigger: '#footGiant', start: 'top 82%', end: 'bottom 62%', scrub: 0.6,
      onUpdate: function (self) {
        document.querySelector('.fg-fill').style.clipPath = 'inset(0 0 ' + (100 - self.progress * 100) + '% 0)';
      }
    });
  }

  /* ---------- parallax (device aware) ---------- */
  function buildParallax() {
    gsap.fromTo('.hero-media img', { scale: 1.22 }, {
      scale: 1.06, duration: 2.6, ease: 'power3.out', delay: 0.15
    });
    gsap.fromTo('.book-crown', { yPercent: 26, rotate: 4 }, {
      yPercent: -22, rotate: -5, ease: 'none',
      scrollTrigger: { trigger: '#book', start: 'top bottom', end: 'bottom top', scrub: true }
    });

    var mm = gsap.matchMedia();
    mm.add('(min-width: 861px)', function () {
      gsap.to('.hero-media img', {
        yPercent: 16, ease: 'none',
        scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
      });
      gsap.to('.hero-content', {
        yPercent: -14, opacity: 0.25, ease: 'none',
        scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom 22%', scrub: true }
      });
      gsap.to('.sticker', {
        yPercent: -18, ease: 'none',
        scrollTrigger: { trigger: '.manifesto', start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });
    mm.add('(max-width: 860px)', function () {
      gsap.to('.hero-media img', {
        yPercent: 7, ease: 'none',
        scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
      });
    });
  }

  /* ---------- splash + hero intro ---------- */
  gsap.set('.loader-credit', { y: 14 });
  function heroIntro() {
    var tl = gsap.timeline();
    tl.from('.site-head', { y: -34, opacity: 0, duration: 1, ease: 'power3.out' }, 0)
      .to('.hero-title .line-in', { y: 0, rotate: 0, duration: 1.35, stagger: 0.14, ease: 'power4.out' }, 0.15)
      .to('.hero .fade-up', { opacity: 1, y: 0, duration: 1.05, stagger: 0.1, ease: 'power3.out' }, '-=0.85');
    return tl;
  }

  function runLoader() {
    var tl = gsap.timeline({ onComplete: function () {
      document.getElementById('loader').style.display = 'none';
    } });
    tl.to('.loader-crown path', { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut' }, 0.1)
      .to('.loader-credit', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.55)
      .add(function () { return fontsReady; }, 0.6)
      .to({}, { duration: 0.9 })                       // hold the credit on screen
      .to('#loader', { yPercent: -100, duration: 0.9, ease: 'power4.inOut' })
      .add(function () { document.body.classList.remove('loading'); }, 0)
      .add(heroIntro, '-=0.8');
  }

  /* ---------- boot ---------- */
  if (reduced) {
    document.body.classList.remove('loading');
    var loader = document.getElementById('loader');
    if (loader) loader.style.display = 'none';
    gsap.set('.line-in, .wi', { y: 0, rotate: 0 });
    gsap.set('.fade-up, .card, .t-row, .step, .book-grid > div, .foot-grid > div', { opacity: 1, y: 0 });
    gsap.set('.card .badge', { scale: 1, rotate: 0 });
    gsap.set('.hero-media img', { scale: 1 });
    document.querySelector('.fg-fill').style.clipPath = 'inset(0 0 0% 0)';
    document.querySelectorAll('[data-count]').forEach(function (el) { el.textContent = el.dataset.count; });
    ScrollTrigger.refresh();
  } else {
    buildScrollReveals();
    buildParallax();
    runLoader();
  }

  fontsReady.then(function () { ScrollTrigger.refresh(); });
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
