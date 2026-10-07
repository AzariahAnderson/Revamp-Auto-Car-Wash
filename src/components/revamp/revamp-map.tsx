'use client';

/**
 * REVAMP — custom live map panel.
 * Dark-themed Leaflet map (CARTO "dark matter" tiles) with a bespoke gold
 * crown pin, permanent label chip, custom zoom/attribution styling and a
 * REAL-TIME status panel: live SAST clock + open/closed computed from the
 * shop's trading hours, ticking every second.
 *
 * Data-friendly: the map only initialises when scrolled near (Intersection-
 * Observer) and tiles are skipped entirely for Data-Saver browsers.
 */

import { useEffect, useRef, useState } from 'react';
import type { Map as LeafletMap } from 'leaflet';
import 'leaflet/dist/leaflet.css';

const TZ = 'Africa/Johannesburg';
const SHOP = { lat: -26.18905, lng: 27.95321 }; // Stormberg Avenue, Bosmont
const ZOOM = 16;

const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=89+Stormberg+Avenue+Bosmont+Johannesburg';

const CROWN_PATH = 'M4 16 L5.5 6 L9.5 11 L12 3.5 L14.5 11 L18.5 6 L20 16 Z';

/**
 * Trading hours (24h SAST). Keys are JS day indexes (0 = Sunday).
 * Single source of truth for the live status + the visible hours table
 * (and mirrored into the JSON-LD in src/app/page.tsx).
 */
const HOURS: Record<number, [number, number] | null> = {
  0: [8, 13], // Sun
  1: [8, 17], // Mon
  2: [8, 17],
  3: [8, 17],
  4: [8, 17],
  5: [8, 17], // Fri
  6: [8, 15], // Sat
};

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_INDEX: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

type Sast = { day: number; secs: number; label: string };

function getSast(): Sast {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  const hour = get('hour');
  const day = DAY_INDEX[get('weekday')] ?? 0;
  const secs = Number(hour) * 3600 + Number(get('minute')) * 60 + Number(get('second'));
  return { day, secs, label: `${hour}:${get('minute')}:${get('second')}` };
}

const fmtHour = (h: number) => `${String(h).padStart(2, '0')}:00`;

function statusFor(s: Sast): { open: boolean; note: string } {
  const today = HOURS[s.day];
  if (today && s.secs >= today[0] * 3600 && s.secs < today[1] * 3600) {
    return { open: true, note: `Closes ${fmtHour(today[1])}` };
  }
  if (today && s.secs < today[0] * 3600) {
    return { open: false, note: `Opens today ${fmtHour(today[0])}` };
  }
  for (let i = 1; i <= 7; i++) {
    const h = HOURS[(s.day + i) % 7];
    if (h) {
      const when = i === 1 ? 'tomorrow' : DAY_NAMES[(s.day + i) % 7];
      return { open: false, note: `Opens ${when} ${fmtHour(h[0])}` };
    }
  }
  return { open: false, note: 'Call us' };
}

const iconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

const PinIcon = () => (
  <svg {...iconProps}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const ClockIcon = () => (
  <svg {...iconProps}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6.5V12l3.2 2" />
  </svg>
);

const HoursRows = [
  { label: 'Mon – Fri', open: 8, close: 17, days: [1, 2, 3, 4, 5] },
  { label: 'Saturday', open: 8, close: 15, days: [6] },
  { label: 'Sunday', open: 8, close: 13, days: [0] },
];

export default function LiveMapPanel() {
  const shellRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [now, setNow] = useState<Sast | null>(null);

  /* ---- real-time clock + open/closed status (1s tick) ---- */
  useEffect(() => {
    const id = window.setInterval(() => setNow(getSast()), 1000);
    return () => window.clearInterval(id);
  }, []);

  /* ---- lazy, data-friendly map init ---- */
  useEffect(() => {
    const shell = shellRef.current;
    const canvas = canvasRef.current;
    if (!shell || !canvas) return;

    let map: LeafletMap | null = null;
    let io: IntersectionObserver | null = null;
    let ro: ResizeObserver | null = null;
    let cancelled = false;

    const skipTiles =
      window.matchMedia('(prefers-reduced-data: reduce)').matches ||
      !('IntersectionObserver' in window);

    const init = async () => {
      if (map || cancelled) return;
      if (skipTiles) {
        shell.classList.add('map-offline');
        return;
      }
      try {
        const L = (await import('leaflet')).default;
        if (cancelled) return;

        map = L.map(canvas, {
          zoomControl: false,
          attributionControl: false,
          scrollWheelZoom: false, // page scroll first — zoom unlocks on click
          zoomSnap: 0.25,
        });
        map.setView([SHOP.lat, SHOP.lng], ZOOM, { animate: false });

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
        }).addTo(map);

        L.control.zoom({ position: 'bottomright' }).addTo(map);
        L.control.attribution({ position: 'bottomleft', prefix: false })
          .addAttribution('&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors')
          .addTo(map);

        const icon = L.divIcon({
          className: '',
          iconSize: [38, 38],
          iconAnchor: [19, 19],
          html:
            '<span class="rv-pin">' +
            '<i class="rv-pin-pulse" aria-hidden="true"></i>' +
            `<svg viewBox="0 0 24 20" aria-hidden="true"><path d="${CROWN_PATH}"/></svg>` +
            '</span>',
        });
        const marker = L.marker([SHOP.lat, SHOP.lng], {
          icon,
          keyboard: true,
          title: 'Revamp Auto Car Wash',
          alt: 'Revamp Auto Car Wash — 89 Stormberg Avenue, Bosmont',
        }).addTo(map);
        const labelSide = window.matchMedia('(max-width: 860px)').matches ? 'top' : 'right';
        marker.bindTooltip('Revamp Auto Car Wash', {
          permanent: true,
          direction: labelSide,
          offset: labelSide === 'top' ? [0, -16] : [18, 0],
          className: 'rv-tip',
        });

        const unlockZoom = () => {
          map?.scrollWheelZoom.enable();
          shell.classList.add('zoom-on');
        };
        map.on('click', unlockZoom);
        canvas.addEventListener('mouseleave', () => map?.scrollWheelZoom.disable());

        ro = new ResizeObserver(() => map?.invalidateSize());
        ro.observe(canvas);
        shell.classList.add('map-ready');
      } catch {
        shell.classList.add('map-offline');
      }
    };

    io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io?.disconnect();
          void init();
        }
      },
      { rootMargin: '480px 0px' }
    );
    io.observe(shell);

    return () => {
      cancelled = true;
      io?.disconnect();
      ro?.disconnect();
      map?.remove();
      map = null;
    };
  }, []);

  const status = now ? statusFor(now) : null;
  const todayIdx = now ? now.day : -1;

  return (
    <div className="book-map">
      {/* ---------- MAP SHELL ---------- */}
      <div className="map-shell fade-up" ref={shellRef} data-lenis-prevent>
        <div
          className="map-canvas"
          ref={canvasRef}
          role="region"
          aria-label="Live map showing Revamp Auto Car Wash on Stormberg Avenue, Bosmont, Johannesburg"
        />
        <div className="map-live" aria-hidden="true">
          <i className={status?.open ? 'dot open' : 'dot closed'} />
          <span>{status ? (status.open ? 'Open now' : 'Closed') : '—'}</span>
          <b>{now ? now.label : '--:--:--'}</b>
          <small>SAST</small>
        </div>
        <a
          className="map-dir"
          data-hover
          href={MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Get directions to 89 Stormberg Avenue, Bosmont"
        >
          <PinIcon />
          <span>Directions</span>
        </a>
        <div className="map-veil">
          <div className="veil-loading">
            <i className="veil-spin" aria-hidden="true" />
            <span>Plotting the map</span>
          </div>
          <div className="veil-offline">
            <PinIcon />
            <span>89 Stormberg Ave, Bosmont</span>
          </div>
        </div>
      </div>

      {/* ---------- LIVE SIDE PANEL ---------- */}
      <aside className="map-side">
        <div className="live-card fade-up" role="status">
          <i className={status?.open ? 'dot open' : 'dot closed'} aria-hidden="true" />
          <div className="live-main">
            <b>{status ? (status.open ? 'Open now' : 'Closed') : '—'}</b>
            <small>{status ? status.note : 'Bosmont, Johannesburg'}</small>
          </div>
          <div className="live-clock">
            <time>{now ? now.label : '--:--:--'}</time>
            <small>{now ? `${DAY_NAMES[now.day]} · SAST` : 'Local time'}</small>
          </div>
        </div>

        <div className="map-block fade-up">
          <h4>
            <PinIcon />
            Address
          </h4>
          <p>
            89 Stormberg Avenue
            <br />
            Bosmont, Johannesburg
            <br />
            Gauteng, South Africa
          </p>
        </div>

        <div className="map-block fade-up">
          <h4>
            <ClockIcon />
            Trading hours
          </h4>
          <ul className="hours">
            {HoursRows.map((row) => (
              <li key={row.label} className={row.days.includes(todayIdx) ? 'today' : ''}>
                <span>{row.label}</span>
                <b>
                  {fmtHour(row.open)} – {fmtHour(row.close)}
                </b>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
