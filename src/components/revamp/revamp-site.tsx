'use client';

/**
 * REVAMP AUTO CAR WASH — single-page site.
 * Ported 1:1 from the original self-contained deliverable
 * (index.html + src/app.js: GSAP 3 + ScrollTrigger + Lenis).
 */

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

declare global {
  interface Window {
    lenis?: Lenis;
  }
}

const WHATSAPP_BOOK =
  'https://wa.me/27763026570?text=Hey%20Revamp!%20I%27d%20like%20to%20book%20a%20wash.';
const WHATSAPP_HALF =
  'https://wa.me/27763026570?text=Hey%20Revamp!%20I%27d%20like%20to%20book%20a%20HALF%20HOUSE%20wash%20(R65).';
const WHATSAPP_FULL =
  'https://wa.me/27763026570?text=Hey%20Revamp!%20I%27d%20like%20to%20book%20a%20FULL%20HOUSE%20wash%20(R120).';
const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=89+Stormberg+Avenue+Bosmont+Johannesburg';

const CROWN_PATH = 'M4 16 L5.5 6 L9.5 11 L12 3.5 L14.5 11 L18.5 6 L20 16 Z';
const ARROW_PATH = 'M1 8h13M9 3l5 5-5 5';
const UP_PATH = 'M8 14V2M3 7l5-5 5 5';
const WA_PATH =
  'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z';

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d={WA_PATH} />
  </svg>
);

const iconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

const DropletIcon = () => (
  <svg {...iconProps}>
    <path d="M12 3.2c3 3.7 5.3 6.7 5.3 9.4a5.3 5.3 0 1 1-10.6 0C6.7 9.9 9 6.9 12 3.2Z" />
    <path d="M9.3 13.8a2.7 2.7 0 0 0 2.1 2.4" />
  </svg>
);

const CarIcon = () => (
  <svg {...iconProps}>
    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H8.7c-.6 0-1.1.2-1.5.7L5 10.4c-1.2.3-2 1.3-2 2.5V16c0 .6.4 1 1 1h2" />
    <path d="M8.7 10.1c1-1.3 1.9-2.1 3.3-2.1h1.6" />
    <circle cx="7" cy="17" r="2" />
    <path d="M9 17h6" />
    <circle cx="17" cy="17" r="2" />
  </svg>
);

const TruckIcon = () => (
  <svg {...iconProps}>
    <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
    <path d="M15 18H9" />
    <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
    <circle cx="17" cy="18" r="2" />
    <circle cx="7" cy="18" r="2" />
  </svg>
);

const PinIcon = () => (
  <svg {...iconProps}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const PhoneIcon = () => (
  <svg {...iconProps}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z" />
  </svg>
);

const InfoIcon = () => (
  <svg {...iconProps}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
);

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const MARQUEE_ITEMS = [
  'Snow foam',
  'Two-bucket wash',
  'Hand dried',
  'Interior vacuum',
  'Tyres dressed',
  'Bosmont, JHB',
];

const FONT_SOURCES = [
  { family: 'Anton', weight: '400', url: '/fonts/anton-400.woff2' },
  { family: 'Space Grotesk', weight: '400', url: '/fonts/space-grotesk-400.woff2' },
  { family: 'Space Grotesk', weight: '500', url: '/fonts/space-grotesk-500.woff2' },
  { family: 'Space Grotesk', weight: '700', url: '/fonts/space-grotesk-700.woff2' },
];

/** Runtime font loading (FontFace API) — same approach as the original. */
function loadFonts(): Promise<unknown> {
  if (!('FontFace' in window)) return Promise.resolve();
  return Promise.all(
    FONT_SOURCES.map(({ family, weight, url }) => {
      const ff = new FontFace(family, `url(${url})`, {
        weight,
        style: 'normal',
        display: 'swap',
      });
      return ff
        .load()
        .then((f) => {
          document.fonts.add(f);
        })
        .catch(() => {
          /* keep fallbacks */
        });
    })
  );
}

/** Split an element's text into masked word spans for staggered reveals. */
function splitWords(el: Element) {
  const text = (el.textContent ?? '').trim();
  const words = text.split(/\s+/);
  el.textContent = '';
  words.forEach((word, i) => {
    const w = document.createElement('span');
    w.className = 'w';
    const wi = document.createElement('span');
    wi.className = 'wi';
    wi.textContent = word;
    w.appendChild(wi);
    el.appendChild(w);
    if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
  });
}

export default function RevampSite() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let alive = true;
    let exitTl: gsap.core.Timeline | null = null;

    document.documentElement.classList.add('js');
    document.body.classList.add('loading');

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({ ease: 'power4.out', duration: 1 });

    const fontsReady = loadFonts();

    /* ---------- Lenis smooth scroll ---------- */
    let lenis: Lenis | null = null;
    let rafFn: ((time: number) => void) | null = null;
    if (!reduced) {
      lenis = new Lenis({ duration: 1.15, smoothWheel: true, touchMultiplier: 1.6 });
      window.lenis = lenis;
      lenis.on('scroll', ScrollTrigger.update);
      rafFn = (time) => {
        lenis?.raf(time * 1000);
      };
      gsap.ticker.add(rafFn);
      gsap.ticker.lagSmoothing(0);
    }

    const scrollToTarget = (sel: string) => {
      const el = document.querySelector(sel);
      if (!el) return;
      if (lenis) lenis.scrollTo(el as HTMLElement, { offset: -70, duration: 1.3 });
      else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    };

    /* ---------- split words ---------- */
    root.querySelectorAll('[data-split]').forEach(splitWords);

    /* ---------- listeners to clean up ---------- */
    const cleanups: Array<() => void> = [];

    const ctx = gsap.context(() => {
      /* ---------- header hide/show ---------- */
      const head = document.getElementById('siteHead');
      let lastY = 0;
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate(self) {
          const y = self.scroll();
          head?.classList.toggle('scrolled', y > 40);
          if (Math.abs(y - lastY) < 60) return;
          if (!head) return;
          if (y > lastY && y > 320 && !document.body.classList.contains('menu-open')) {
            gsap.to(head, { yPercent: -170, duration: 0.55, ease: 'power3.inOut' });
          } else {
            gsap.to(head, { yPercent: 0, duration: 0.5, ease: 'power3.inOut' });
          }
          lastY = y;
        },
      });

      /* ---------- mobile menu ---------- */
      const burger = document.getElementById('burger');
      const menu = document.getElementById('menu');
      const menuTl = gsap.timeline({ paused: true });
      menuTl
        .to(menu, {
          clipPath: 'inset(0 0 0% 0)',
          visibility: 'visible',
          duration: 0.7,
          ease: 'power4.inOut',
        })
        .from(
          menu ? menu.querySelectorAll('.m-link') : [],
          { y: 46, opacity: 0, stagger: 0.07, duration: 0.7 },
          '-=0.25'
        )
        .from(
          menu ? menu.querySelectorAll('.menu-cta') : [],
          { opacity: 0, y: 24, duration: 0.55 },
          '-=0.4'
        )
        .from(
          menu ? menu.querySelector('.m-foot') : [],
          { opacity: 0, y: 20, duration: 0.5 },
          '-=0.35'
        );

      const setMenu = (open: boolean) => {
        document.body.classList.toggle('menu-open', open);
        burger?.setAttribute('aria-expanded', String(open));
        menu?.setAttribute('aria-hidden', String(!open));
        if (lenis) {
          if (open) lenis.stop();
          else lenis.start();
        }
        if (open) {
          menuTl.play();
          window.setTimeout(() => {
            if (alive && document.body.classList.contains('menu-open')) {
              menu?.focus({ preventScroll: true });
            }
          }, 620);
        } else {
          menuTl.reverse();
        }
      };

      const onBurger = () => setMenu(!document.body.classList.contains('menu-open'));
      burger?.addEventListener('click', onBurger);
      cleanups.push(() => burger?.removeEventListener('click', onBurger));

      const menuLinks = menu ? Array.from(menu.querySelectorAll('a')) : [];
      const closeMenu = () => setMenu(false);
      menuLinks.forEach((a) => a.addEventListener('click', closeMenu));
      cleanups.push(() => menuLinks.forEach((a) => a.removeEventListener('click', closeMenu)));

      /* Escape closes the menu and hands focus back to the burger */
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && document.body.classList.contains('menu-open')) {
          setMenu(false);
          burger?.focus({ preventScroll: true });
        }
      };
      window.addEventListener('keydown', onKey);
      cleanups.push(() => window.removeEventListener('keydown', onKey));

      /* ---------- anchor links ---------- */
      const anchors = Array.from(root.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'));
      const onAnchor = (e: Event) => {
        const a = e.currentTarget as HTMLAnchorElement;
        const id = a.getAttribute('href');
        if (id && id.length > 1 && document.querySelector(id)) {
          e.preventDefault();
          scrollToTarget(id);
        }
      };
      anchors.forEach((a) => a.addEventListener('click', onAnchor));
      cleanups.push(() => anchors.forEach((a) => a.removeEventListener('click', onAnchor)));

      const toTop = document.getElementById('toTop');
      const onToTop = () => {
        if (lenis) lenis.scrollTo(0, { duration: 1.5 });
        else window.scrollTo({ top: 0, behavior: 'smooth' });
      };
      toTop?.addEventListener('click', onToTop);
      cleanups.push(() => toTop?.removeEventListener('click', onToTop));

      /* ---------- scrollspy: gold dot tracks the section in view ---------- */
      const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('.nav a'));
      const setActive = (href: string | null) => {
        navLinks.forEach((a) => {
          const on = href !== null && a.getAttribute('href') === href;
          a.classList.toggle('active', on);
          if (on) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      };
      (['#services', '#pricing', '#method', '#book'] as const).forEach((sel) => {
        const sec = document.querySelector(sel);
        if (!sec) return;
        ScrollTrigger.create({
          trigger: sec,
          start: 'top 45%',
          end: 'bottom 45%',
          onToggle(self) {
            if (self.isActive) setActive(sel);
            else {
              const active = document.querySelector('.nav a.active');
              if (active?.getAttribute('href') === sel) setActive(null);
            }
          },
        });
      });

      /* ---------- cursor spotlight on cards (visual gated by @media (hover:hover)) ---------- */
      {
        const spots = Array.from(root.querySelectorAll<HTMLElement>('.card, .strip'));
        const onSpot = (e: MouseEvent) => {
          const el = e.currentTarget as HTMLElement;
          const r = el.getBoundingClientRect();
          el.style.setProperty('--mx', `${e.clientX - r.left}px`);
          el.style.setProperty('--my', `${e.clientY - r.top}px`);
        };
        spots.forEach((el) => {
          el.addEventListener('mousemove', onSpot, { passive: true });
          cleanups.push(() => el.removeEventListener('mousemove', onSpot));
        });
      }

      /* ---------- reveal builders ---------- */
      function buildScrollReveals() {
        gsap.set('.line-in', { y: '112%', rotate: 2.4 });

        // line-mask reveals
        gsap.utils.toArray('.sec-title, .book-title').forEach((title) => {
          gsap.to(title.querySelectorAll('.line-in'), {
            y: 0,
            rotate: 0,
            duration: 1.2,
            stagger: 0.13,
            ease: 'power4.out',
            scrollTrigger: { trigger: title, start: 'top 86%' },
          });
        });

        // batched staggers: cards, table rows, method steps, info columns
        gsap.set('.card', { y: 52, opacity: 0 });
        gsap.set('.card .badge', { scale: 0.82, rotate: -8 });
        ScrollTrigger.batch('.card', {
          start: 'top 88%',
          once: true,
          onEnter(batch) {
            gsap.to(batch, { y: 0, opacity: 1, duration: 1.1, stagger: 0.14, ease: 'power3.out' });
            gsap.to(
              batch.map((c) => c.querySelector('.badge')),
              { scale: 1, rotate: 0, duration: 1.3, stagger: 0.14, ease: 'back.out(1.5)' }
            );
          },
        });

        gsap.set('.t-row:not(.t-head)', { y: 26, opacity: 0 });
        ScrollTrigger.batch('.t-row:not(.t-head)', {
          start: 'top 90%',
          once: true,
          onEnter(batch) {
            gsap.to(batch, { y: 0, opacity: 1, duration: 0.9, stagger: 0.1, ease: 'power3.out' });
          },
        });

        gsap.set('.step', { y: 34, opacity: 0 });
        ScrollTrigger.batch('.step', {
          start: 'top 88%',
          once: true,
          onEnter(batch) {
            gsap.to(batch, { y: 0, opacity: 1, duration: 1, stagger: 0.12, ease: 'power3.out' });
          },
        });

        gsap.set('.book-grid > div', { y: 30, opacity: 0 });
        ScrollTrigger.batch('.book-grid > div', {
          start: 'top 92%',
          once: true,
          onEnter(batch) {
            gsap.to(batch, { y: 0, opacity: 1, duration: 0.95, stagger: 0.11, ease: 'power3.out' });
          },
        });

        // word reveals (statements)
        gsap.set('.wi', { y: '115%', rotate: 2 });
        gsap.utils.toArray('[data-split]').forEach((p) => {
          gsap.to(p.querySelectorAll('.wi'), {
            y: 0,
            rotate: 0,
            duration: 1.1,
            stagger: 0.026,
            ease: 'power4.out',
            scrollTrigger: { trigger: p, start: 'top 88%' },
          });
        });

        // generic fade-ups
        gsap.utils.toArray('.fade-up').forEach((el) => {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 1.05,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 90%' },
          });
        });

        // price count-ups
        gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
          const target = parseInt(el.dataset.count ?? '0', 10);
          const obj = { v: 0 };
          ScrollTrigger.create({
            trigger: el,
            start: 'top 90%',
            once: true,
            onEnter() {
              gsap.to(obj, {
                v: target,
                duration: 1.6,
                ease: 'power2.out',
                onUpdate() {
                  el.textContent = String(Math.round(obj.v));
                },
              });
            },
          });
        });

        // footer giant fill
        const fgFill = document.querySelector<HTMLElement>('.fg-fill');
        ScrollTrigger.create({
          trigger: '#footGiant',
          start: 'top 82%',
          end: 'bottom 62%',
          scrub: 0.6,
          onUpdate(self) {
            if (fgFill) {
              fgFill.style.clipPath = `inset(0 0 ${100 - self.progress * 100}% 0)`;
            }
          },
        });
      }

      /* ---------- parallax (device aware) ---------- */
      function buildParallax() {
        gsap.fromTo(
          '.hero-media img',
          { scale: 1.22 },
          { scale: 1.06, duration: 2.6, ease: 'power3.out', delay: 0.15 }
        );
        gsap.fromTo(
          '.book-crown',
          { yPercent: 26, rotate: 4 },
          {
            yPercent: -22,
            rotate: -5,
            ease: 'none',
            scrollTrigger: { trigger: '#book', start: 'top bottom', end: 'bottom top', scrub: true },
          }
        );

        const mm = gsap.matchMedia();
        mm.add('(min-width: 861px)', () => {
          gsap.to('.hero-media img', {
            yPercent: 16,
            ease: 'none',
            scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
          });
          gsap.to('.hero-content', {
            yPercent: -14,
            opacity: 0.25,
            ease: 'none',
            scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom 22%', scrub: true },
          });
          gsap.to('.sticker', {
            yPercent: -18,
            ease: 'none',
            scrollTrigger: {
              trigger: '.manifesto',
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          });
        });
        mm.add('(max-width: 860px)', () => {
          gsap.to('.hero-media img', {
            yPercent: 7,
            ease: 'none',
            scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
          });
        });
      }

      /* ---------- splash + hero intro ---------- */

      const heroIntro = () => {
        const tl = gsap.timeline();
        tl.from('.site-head', { y: -34, opacity: 0, duration: 1, ease: 'power3.out' }, 0)
          .to(
            '.hero-title .line-in',
            { y: 0, rotate: 0, duration: 1.35, stagger: 0.14, ease: 'power4.out' },
            0.15
          )
          .to('.hero .fade-up', { opacity: 1, y: 0, duration: 1.05, stagger: 0.1, ease: 'power3.out' }, '-=0.85');
        return tl;
      };

      const runLoader = () => {
        const wrap = document.getElementById('loader');
        const panel = wrap?.querySelector<HTMLElement>('.loader-panel');
        const accent = wrap?.querySelector<HTMLElement>('.loader-accent');
        const barFill = wrap?.querySelector<HTMLElement>('.loader-bar i');

        /* intro: crown draws → wordmark rises → tagline settles → bar tracks */
        gsap
          .timeline()
          .to('.loader-crown path', { strokeDashoffset: 0, duration: 0.85, ease: 'power2.inOut' }, 0.05)
          .fromTo(
            '.loader-glow',
            { opacity: 0, scale: 0.72 },
            { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' },
            0.05
          )
          .to('.loader-word .lw', { y: 0, duration: 0.95, stagger: 0.055, ease: 'power4.out' }, 0.34)
          .fromTo(
            '.loader-tag',
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
            0.72
          )
          .to(barFill, { scaleX: 0.78, duration: 1.3, ease: 'power2.inOut' }, 0.4)
          .fromTo(
            '.loader-credit',
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' },
            0.95
          );

        /* exit once fonts are ready (min hold for rhythm, 3.2s safety net) */
        const fontsSafe = Promise.race([fontsReady, wait(3200)]);
        Promise.all([fontsSafe, wait(1500)]).then(() => {
          if (!alive) return;
          exitTl = gsap
            .timeline({
              onComplete() {
                if (wrap) wrap.style.display = 'none';
              },
            })
            .to(barFill, { scaleX: 1, duration: 0.3, ease: 'power2.in' })
            .to(
              '.loader-inner, .loader-credit',
              { opacity: 0, y: -26, filter: 'blur(6px)', duration: 0.4, ease: 'power2.in' },
              '+=0.05'
            )
            .add(() => {
              document.body.classList.remove('loading');
            })
            .to(panel, { yPercent: -100, duration: 0.85, ease: 'power4.inOut' }, '-=0.08')
            .to(accent, { yPercent: -100, duration: 0.85, ease: 'power4.inOut' }, '<0.14')
            .add(heroIntro, '<0.4');
        });
      };

      /* ---------- boot ---------- */
      if (reduced) {
        document.body.classList.remove('loading');
        const loaderEl = document.getElementById('loader');
        if (loaderEl) loaderEl.style.display = 'none';
        gsap.set('.line-in, .wi', { y: 0, rotate: 0 });
        gsap.set('.fade-up, .card, .t-row, .step, .book-grid > div', {
          opacity: 1,
          y: 0,
        });
        gsap.set('.card .badge', { scale: 1, rotate: 0 });
        gsap.set('.hero-media img', { scale: 1 });
        const fgFill = document.querySelector<HTMLElement>('.fg-fill');
        if (fgFill) fgFill.style.clipPath = 'inset(0 0 0% 0)';
        root.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
          el.textContent = el.dataset.count ?? '0';
        });
        ScrollTrigger.refresh();
      } else {
        buildScrollReveals();
        buildParallax();
        runLoader();
      }

      fontsReady.then(() => {
        ScrollTrigger.refresh();
      });
    }, root);

    const onLoad = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener('load', onLoad);

    return () => {
      alive = false;
      exitTl?.kill();
      window.removeEventListener('load', onLoad);
      cleanups.forEach((fn) => fn());
      if (rafFn) gsap.ticker.remove(rafFn);
      lenis?.destroy();
      window.lenis = undefined;
      ctx.revert();
      document.body.classList.remove('menu-open');
    };
  }, []);

  return (
    <div ref={rootRef}>
      {/* ============ SPLASH ============ */}
      <div id="loader" aria-hidden="true">
        <div className="loader-accent" />
        <div className="loader-panel">
          <div className="loader-inner">
            <span className="loader-glow" />
            <svg className="loader-crown" viewBox="0 0 24 20">
              <path d={CROWN_PATH} />
            </svg>
            <div className="loader-word">
              {'REVAMP'.split('').map((ch, i) => (
                <span className="lw-mask" key={i}>
                  <span className="lw">{ch}</span>
                </span>
              ))}
            </div>
            <div className="loader-tag">
              <span>Auto Car Wash — Bosmont, JHB</span>
            </div>
          </div>
          <div className="loader-credit">
            <span>Developed by</span>
            <b>Azariah Anderson and Joshua Boraine</b>
          </div>
          <div className="loader-bar">
            <i />
          </div>
        </div>
      </div>

      {/* ============ HEADER ============ */}
      <a className="skip" href="#top">
        Skip to content
      </a>
      <header className="site-head" id="siteHead">
        <a className="brand" href="#top" data-hover aria-label="Revamp Auto Car Wash — home">
          <svg viewBox="0 0 24 20" aria-hidden="true">
            <path
              d={CROWN_PATH}
              fill="none"
              stroke="#ffc72c"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
          <span>
            Revamp
            <small>Auto Car Wash</small>
          </span>
        </a>
        <nav className="nav" aria-label="Primary">
          <a href="#services" data-hover>
            Services
          </a>
          <a href="#pricing" data-hover>
            Pricing
          </a>
          <a href="#method" data-hover>
            Method
          </a>
          <a href="#book" data-hover>
            Book
          </a>
        </nav>
        <div className="head-actions">
          <a
            className="btn btn-gold btn-sm"
            data-hover
            href={WHATSAPP_BOOK}
            target="_blank"
            rel="noopener"
          >
            <WhatsAppIcon />
            <span>Book a wash</span>
          </a>
          <button
            className="burger"
            id="burger"
            aria-label="Menu"
            aria-expanded="false"
            aria-controls="menu"
          >
            <i />
            <i />
          </button>
        </div>
      </header>

      {/* ============ MOBILE MENU ============ */}
      <div className="menu" id="menu" aria-hidden="true" tabIndex={-1}>
        <nav aria-label="Menu">
          <a className="m-link" href="#services">
            <i>01</i>
            <span>Services</span>
          </a>
          <a className="m-link" href="#pricing">
            <i>02</i>
            <span>Pricing</span>
          </a>
          <a className="m-link" href="#method">
            <i>03</i>
            <span>Method</span>
          </a>
          <a className="m-link" href="#book">
            <i>04</i>
            <span>Book</span>
          </a>
        </nav>
        <div className="menu-cta">
          <a
            className="btn btn-gold"
            data-hover
            href={WHATSAPP_BOOK}
            target="_blank"
            rel="noopener"
          >
            <WhatsAppIcon />
            <span>WhatsApp us</span>
          </a>
          <a className="btn btn-ghost" data-hover href="tel:+27763026570">
            <PhoneIcon />
            <span>+27 76 302 6570</span>
          </a>
        </div>
        <div className="m-foot">
          <span>89 Stormberg Ave, Bosmont</span>
        </div>
      </div>

      <main id="top">
        {/* ============ HERO ============ */}
        <section className="hero" id="hero">
          <div className="hero-media">
            <img
              src="/images/hero.webp"
              alt="Glossy black BMW gleaming under golden light on the wet floor of Revamp Auto Car Wash"
              fetchPriority="high"
            />
          </div>
          <div className="hero-shade" aria-hidden="true" />
          <div className="hero-content container">
            <h1 className="hero-title">
              <span className="line">
                <span className="line-in">Clean cars</span>
              </span>
              <span className="line">
                <span className="line-in">
                  Hit different<em>.</em>
                </span>
              </span>
            </h1>
            <div className="hero-sub">
              <p className="fade-up">
                Snow-foamed and washed by hand. Walk in dirty, roll out renewed —{' '}
                <strong>from R65</strong>.
              </p>
              <div className="hero-cta fade-up">
                <a
                  className="btn btn-gold"
                  data-hover
                  href={WHATSAPP_BOOK}
                  target="_blank"
                  rel="noopener"
                >
                  <span>Book on WhatsApp</span>
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                    <path d={ARROW_PATH} />
                  </svg>
                </a>
                <a className="btn btn-ghost" data-hover href="tel:+27763026570">
                  <PhoneIcon />
                  <span>+27 76 302 6570</span>
                </a>
              </div>
            </div>
          </div>
          <div className="hero-foot container">
            <ul className="hero-stats fade-up">
              <li>
                <b>R65</b> Half House
              </li>
              <li>
                <b>R120</b> Full House
              </li>
              <li>
                <b>100%</b> Hand wash
              </li>
            </ul>
          </div>
        </section>

        {/* ============ MARQUEE ============ */}
        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <span key={i}>{item}</span>
            ))}
          </div>
        </div>

        {/* ============ MANIFESTO ============ */}
        <section className="manifesto" id="about">
          <div className="container manifesto-grid">
            <p className="statement" data-split>
              No machines. No shortcuts. No swirl marks. Every car that rolls into Revamp gets
              thick foam, soft mitts and patient hands — inside and out, done properly.
            </p>
            <div className="sticker fade-up">
              <img src="/images/logo.webp" alt="Revamp Auto Car Wash logo" loading="lazy" decoding="async" />
              <svg viewBox="0 0 200 200" aria-hidden="true">
                <defs>
                  <path
                    id="cir"
                    d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0"
                  />
                </defs>
                <text>
                  <textPath href="#cir">
                    Revamp Auto Car Wash • Bosmont, Johannesburg •{' '}
                  </textPath>
                </text>
              </svg>
            </div>
          </div>
        </section>

        {/* ============ SERVICES ============ */}
        <section className="services" id="services">
          <div className="container">
            <div className="sec-head">
              <h2 className="sec-title">
                <span className="line">
                  <span className="line-in">
                    Choose your wash<em>.</em>
                  </span>
                </span>
              </h2>
            </div>
            <div className="cards">
              <article className="card" data-hover>
                <div className="card-top">
                  <span className="badge" aria-hidden="true">
                    <DropletIcon />
                  </span>
                </div>
                <h3>Half House</h3>
                <div className="price">
                  R<span data-count="65">0</span>
                  <small>Wash &amp; dry</small>
                </div>
                <p className="card-desc">The outside only — washed, rinsed and hand-dried.</p>
                <ul className="inc">
                  <li>Exterior hand wash</li>
                  <li>Wheels, rims &amp; arches cleaned</li>
                  <li>Hand-dried, spot-free finish</li>
                  <li>Tyres dressed black</li>
                </ul>
                <a
                  className="btn btn-ghost"
                  data-hover
                  href={WHATSAPP_HALF}
                  target="_blank"
                  rel="noopener"
                >
                  <span>Book Half House</span>
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                    <path d={ARROW_PATH} />
                  </svg>
                </a>
              </article>
              <article className="card card-gold" data-hover>
                <div className="card-top">
                  <span className="badge" aria-hidden="true">
                    <CarIcon />
                  </span>
                </div>
                <h3>Full House</h3>
                <div className="price">
                  R<span data-count="120">0</span>
                  <small>Wash + vacuum</small>
                </div>
                <p className="card-desc">Outside shines, inside breathes — the complete wash.</p>
                <ul className="inc">
                  <li>Everything in Half House</li>
                  <li>Full interior vacuum</li>
                  <li>Dash, console &amp; door cards wiped</li>
                  <li>Glass cleaned inside &amp; out</li>
                </ul>
                <a
                  className="btn btn-gold"
                  data-hover
                  href={WHATSAPP_FULL}
                  target="_blank"
                  rel="noopener"
                >
                  <span>Book Full House</span>
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                    <path d={ARROW_PATH} />
                  </svg>
                </a>
              </article>
            </div>
            <a className="strip fade-up" data-hover href="#pricing">
              <span className="strip-ico" aria-hidden="true">
                <TruckIcon />
              </span>
              <span className="strip-body">
                <span className="strip-title">Driving something bigger?</span>
                <span className="strip-text">
                  SUVs and bakkies add <b>+R20</b> to any wash.
                </span>
              </span>
              <svg className="strip-arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d={ARROW_PATH} />
              </svg>
            </a>
          </div>
        </section>

        {/* ============ PRICING ============ */}
        <section className="pricing" id="pricing">
          <div className="container">
            <div className="sec-head">
              <h2 className="sec-title">
                <span className="line">
                  <span className="line-in">
                    Straight prices<em>.</em>
                  </span>
                </span>
                <span className="line">
                  <span className="line-in">
                    No surprises<em>.</em>
                  </span>
                </span>
              </h2>
            </div>
            <div className="price-table">
              <div className="t-row t-head">
                <span>Service</span>
                <span className="t-mid">What you get</span>
                <span className="t-price">Price</span>
              </div>
              <div className="t-row" data-hover>
                <span className="t-name">
                  <DropletIcon />
                  Half House
                </span>
                <span className="t-mid">Exterior wash &amp; dry</span>
                <span className="t-price">R65</span>
              </div>
              <div className="t-row" data-hover>
                <span className="t-name">
                  <CarIcon />
                  Full House
                </span>
                <span className="t-mid">Exterior wash + interior vacuum</span>
                <span className="t-price">R120</span>
              </div>
              <div className="t-row" data-hover>
                <span className="t-name">
                  <TruckIcon />
                  Bigger vehicles
                </span>
                <span className="t-mid">SUVs &amp; bakkies</span>
                <span className="t-price">+R20</span>
              </div>
            </div>
            <p className="fine fade-up">Prices for standard sedans. Walk-ins welcome.</p>
          </div>
        </section>

        {/* ============ METHOD ============ */}
        <section className="method" id="method">
          <div className="container">
            <div className="sec-head">
              <h2 className="sec-title">
                <span className="line">
                  <span className="line-in">
                    Foam. Mitts<em>.</em>
                  </span>
                </span>
                <span className="line">
                  <span className="line-in">
                    Patience<em>.</em>
                  </span>
                </span>
              </h2>
            </div>
            <ol>
              <li className="step">
                <i className="num" aria-hidden="true">01</i>
                <h3>Pre-rinse</h3>
                <p>Loose dirt and grit rinse away first, so nothing scratches your paint.</p>
              </li>
              <li className="step">
                <i className="num" aria-hidden="true">02</i>
                <h3>Snow foam</h3>
                <p>Thick, pH-neutral foam clings to the body and lifts the grime first.</p>
              </li>
              <li className="step">
                <i className="num" aria-hidden="true">03</i>
                <h3>Two-bucket hand wash</h3>
                <p>Clean mitts, grit guards, panel by panel, top to bottom.</p>
              </li>
              <li className="step">
                <i className="num" aria-hidden="true">04</i>
                <h3>Hand dry &amp; finish</h3>
                <p>
                  Plush microfibre dry, glass spotless, tyres dressed. Full House adds the interior
                  vacuum.
                </p>
              </li>
            </ol>
          </div>
        </section>

        {/* ============ BOOK ============ */}
        <section className="book" id="book">
          <svg className="book-crown" viewBox="0 0 24 20" aria-hidden="true">
            <path d={CROWN_PATH} />
          </svg>
          <div className="container">
            <h2 className="book-title">
              <span className="line">
                <span className="line-in">Book your</span>
              </span>
              <span className="line">
                <span className="line-in">
                  Wash<em>.</em>
                </span>
              </span>
            </h2>
            <a className="phone fade-up" data-hover href="tel:+27763026570">
              +27 76 302 6570
            </a>
            <div className="book-cta fade-up">
              <a
                className="btn btn-gold"
                data-hover
                href={WHATSAPP_BOOK}
                target="_blank"
                rel="noopener"
              >
                <span>WhatsApp us</span>
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <path d={ARROW_PATH} />
                </svg>
              </a>
              <a
                className="btn btn-ghost"
                data-hover
                href={MAPS_URL}
                target="_blank"
                rel="noopener"
              >
                <PinIcon />
                <span>Get directions</span>
              </a>
            </div>
            <div className="book-grid">
              <div>
                <h4>
                  <PinIcon />
                  Find us
                </h4>
                <p>
                  89 Stormberg Avenue
                  <br />
                  Bosmont, Johannesburg
                  <br />
                  Gauteng, South Africa
                </p>
              </div>
              <div>
                <h4>
                  <PhoneIcon />
                  Call / WhatsApp
                </h4>
                <p>
                  <a href="tel:+27763026570">+27 76 302 6570</a> ·{' '}
                  <a href="https://wa.me/27763026570" target="_blank" rel="noopener">
                    WhatsApp
                  </a>
                  <br />
                  <a href="tel:+27750378818">+27 75 037 8818</a> ·{' '}
                  <a href="https://wa.me/27750378818" target="_blank" rel="noopener">
                    WhatsApp
                  </a>
                </p>
              </div>
              <div>
                <h4>
                  <InfoIcon />
                  Good to know
                </h4>
                <p>
                  Walk-ins welcome.
                  <br />
                  Book ahead on WhatsApp to skip the queue.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ============ FOOTER ============ */}
      <footer className="foot">
        <div className="foot-giant" id="footGiant">
          <div className="fg-wrap">
            <span className="fg-base">Clean cars hit different.</span>
            <div className="fg-fill" aria-hidden="true">
              <span>Clean cars hit different.</span>
            </div>
          </div>
        </div>
        <div className="container foot-base">
          <span>© 2026 Revamp Auto Car Wash</span>
          <span>Developed by Azariah Anderson and Joshua Boraine</span>
          <button className="top-link" id="toTop" data-hover>
            <span>Back to top</span>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d={UP_PATH} />
            </svg>
          </button>
        </div>
      </footer>
    </div>
  );
}
