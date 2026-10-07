'use client';

/**
 * REVAMP — custom live map panel.
 * MapLibre GL with a fully hand-authored BLACK & GOLD vector style
 * (OpenFreeMap planet tiles — free, keyless OpenMapTiles schema):
 * matte-black canvas, gold road hierarchy, muted gold labels — matches
 * the site tokens (--bg / --gold) exactly, no raster filter hacks.
 * REAL-TIME: live SAST clock + open/closed status computed from the
 * shop's trading hours, ticking every second.
 *
 * Data-friendly: the map bundle + tiles only load when scrolled near
 * (IntersectionObserver) and are skipped entirely for Data-Saver browsers.
 */

import { useEffect, useRef, useState } from 'react';
import type { Map as MLMap, StyleSpecification } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const TZ = 'Africa/Johannesburg';
const SHOP = { lat: -26.18905, lng: 27.95321 }; // Stormberg Avenue, Bosmont
const ZOOM = 15.6;

const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=89+Stormberg+Avenue+Bosmont+Johannesburg';

const CROWN_PATH = 'M4 16 L5.5 6 L9.5 11 L12 3.5 L14.5 11 L18.5 6 L20 16 Z';

/**
 * Trading hours (24h SAST) — 09:00–18:00 every day.
 * Keys are JS day indexes (0 = Sunday). Single source of truth for the
 * live status + the visible hours table (mirrored into the JSON-LD in
 * src/app/page.tsx).
 */
const HOURS: Record<number, [number, number] | null> = {
  0: [9, 18], // Sun
  1: [9, 18], // Mon
  2: [9, 18],
  3: [9, 18],
  4: [9, 18],
  5: [9, 18], // Fri
  6: [9, 18], // Sat
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

/* ============ hand-authored BLACK & GOLD vector style ============ */

const C = {
  bg: '#09090a',
  water: '#101013',
  building: '#131316',
  boundary: '#3a3112',
  minor: '#4a4117',
  tertiary: '#8a7019',
  secondary: '#b28e1f',
  primary: '#d3a624',
  trunk: '#eeba2a',
  motorway: '#ffc72c',
  rail: '#2a2818',
  roadLabel: '#6a5b1f',
  suburb: '#7d6b20',
  place: '#b28e1f',
  storm: '#ffc72c',
};

const widths = (stops: [number, number][]) => [
  'interpolate',
  ['linear'],
  ['zoom'],
  ...stops.flat(),
];

const road = (
  id: string,
  filter: unknown,
  color: string,
  stops: [number, number][],
  minzoom: number,
  dash?: number[]
) => ({
  id,
  type: 'line',
  source: 'omt',
  'source-layer': 'transportation',
  filter,
  minzoom,
  layout: { 'line-cap': 'round', 'line-join': 'round' },
  paint: {
    'line-color': color,
    'line-width': widths(stops),
    ...(dash ? { 'line-dasharray': dash } : {}),
  },
});

const RV_STYLE = {
  version: 8,
  glyphs: 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf',
  sources: {
    omt: {
      type: 'vector',
      // TileJSON endpoint — OpenFreeMap rotates dated tile snapshots, so the
      // live {z}/{x}/{y} template must always be resolved from here.
      url: 'https://tiles.openfreemap.org/planet',
      maxzoom: 14,
      attribution:
        '&copy; <a href="https://www.openfreemap.org" target="_blank" rel="noopener noreferrer">OpenFreeMap</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
    },
  },
  layers: [
    { id: 'bg', type: 'background', paint: { 'background-color': C.bg } },
    {
      id: 'water',
      type: 'fill',
      source: 'omt',
      'source-layer': 'water',
      paint: { 'fill-color': C.water },
    },
    {
      id: 'waterway',
      type: 'line',
      source: 'omt',
      'source-layer': 'waterway',
      minzoom: 10,
      paint: { 'line-color': C.water, 'line-width': widths([[10, 0.5], [16, 1.5], [18, 3]]) },
    },
    {
      id: 'building',
      type: 'fill',
      source: 'omt',
      'source-layer': 'building',
      minzoom: 14,
      paint: {
        'fill-color': C.building,
        'fill-opacity': ['interpolate', ['linear'], ['zoom'], 14, 0.45, 16, 1],
      },
    },
    {
      id: 'admin',
      type: 'line',
      source: 'omt',
      'source-layer': 'boundary',
      filter: ['<=', ['get', 'admin_level'], 4],
      paint: {
        'line-color': C.boundary,
        'line-width': 0.8,
        'line-dasharray': [2, 2],
        'line-opacity': 0.9,
      },
    },
    road('rail', ['==', ['get', 'class'], 'rail'], C.rail, [[12, 0.4], [16, 0.9], [18, 1.6]], 12, [3, 2]),
    road(
      'road-minor',
      ['in', ['get', 'class'], ['literal', ['minor', 'service', 'track', 'pedestrian', 'living_street']]],
      C.minor,
      [[13, 0.3], [15, 0.7], [17, 1.3], [18.5, 2.1]],
      13
    ),
    road('road-tertiary', ['==', ['get', 'class'], 'tertiary'], C.tertiary, [[12, 0.4], [15, 0.9], [17, 1.6], [18.5, 2.4]], 12),
    road('road-secondary', ['==', ['get', 'class'], 'secondary'], C.secondary, [[11, 0.4], [14, 1], [16, 1.8], [18.5, 2.8]], 11),
    road('road-primary', ['==', ['get', 'class'], 'primary'], C.primary, [[11, 0.5], [14, 1.1], [16, 2.1], [18.5, 3.3]], 11),
    road('road-trunk', ['==', ['get', 'class'], 'trunk'], C.trunk, [[10, 0.5], [14, 1.3], [16, 2.4], [18.5, 3.8]], 10),
    road('road-motorway', ['==', ['get', 'class'], 'motorway'], C.motorway, [[9, 0.6], [14, 1.5], [16, 2.7], [18.5, 4.4]], 9),
    {
      id: 'road-labels',
      type: 'symbol',
      source: 'omt',
      'source-layer': 'transportation_name',
      minzoom: 15,
      layout: {
        'symbol-placement': 'line',
        'text-font': ['Noto Sans Regular'],
        'text-field': ['coalesce', ['get', 'name:latin'], ['get', 'name']],
        'text-size': 9.5,
        'text-letter-spacing': 0.08,
        'text-max-angle': 30,
      },
      paint: { 'text-color': C.roadLabel, 'text-halo-color': C.bg, 'text-halo-width': 1.2 },
    },
    {
      id: 'stormberg-label',
      type: 'symbol',
      source: 'omt',
      'source-layer': 'transportation_name',
      minzoom: 13,
      filter: [
        'in',
        ['downcase', ['coalesce', ['get', 'name:latin'], ['get', 'name']]],
        ['literal', ['stormberg avenue', 'stormberg ave', 'stormberg straat', 'stormberg road', 'stormberg rd']],
      ],
      layout: {
        'symbol-placement': 'line',
        'text-font': ['Noto Sans Bold'],
        'text-field': ['coalesce', ['get', 'name:latin'], ['get', 'name']],
        'text-size': 11,
        'text-letter-spacing': 0.14,
      },
      paint: { 'text-color': C.storm, 'text-halo-color': C.bg, 'text-halo-width': 1.6 },
    },
    {
      id: 'place-suburb',
      type: 'symbol',
      source: 'omt',
      'source-layer': 'place',
      minzoom: 11,
      filter: ['in', ['get', 'class'], ['literal', ['suburb', 'neighbourhood', 'village', 'hamlet', 'quarter']]],
      layout: {
        'text-field': ['coalesce', ['get', 'name:latin'], ['get', 'name']],
        'text-font': ['Noto Sans Regular'],
        'text-size': ['interpolate', ['linear'], ['zoom'], 11, 8.5, 16, 11],
        'text-letter-spacing': 0.12,
        'text-max-width': 8,
      },
      paint: { 'text-color': C.suburb, 'text-halo-color': C.bg, 'text-halo-width': 1.2 },
    },
    {
      id: 'place-city',
      type: 'symbol',
      source: 'omt',
      'source-layer': 'place',
      minzoom: 7,
      filter: ['in', ['get', 'class'], ['literal', ['city', 'town']]],
      layout: {
        'text-field': ['coalesce', ['get', 'name:latin'], ['get', 'name']],
        'text-font': ['Noto Sans Bold'],
        'text-size': ['interpolate', ['linear'], ['zoom'], 7, 10, 14, 14],
        'text-letter-spacing': 0.16,
        'text-transform': 'uppercase',
        'text-max-width': 8,
      },
      paint: { 'text-color': C.place, 'text-halo-color': C.bg, 'text-halo-width': 1.4 },
    },
  ],
} as unknown as StyleSpecification;

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
  { label: 'Monday – Sunday', open: 9, close: 18, days: [0, 1, 2, 3, 4, 5, 6] },
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

    let map: MLMap | null = null;
    let io: IntersectionObserver | null = null;
    let ro: ResizeObserver | null = null;
    let safety = 0;
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
        const maplibregl = await import('maplibre-gl');
        if (cancelled) return;
        // MapLibre v6 resolves its module worker relative to the bundled main
        // file, which no bundler can serve — point it at the self-hosted copy
        // in /public (same version, single self-contained file).
        maplibregl.setWorkerUrl('/maplibre-gl-worker.mjs');

        const m = new maplibregl.Map({
          container: canvas,
          style: RV_STYLE,
          center: [SHOP.lng, SHOP.lat],
          zoom: ZOOM,
          minZoom: 4,
          maxZoom: 18.5,
          attributionControl: false,
          scrollZoom: false, // page scroll first — zoom unlocks on click
          dragRotate: false,
          touchPitch: false,
          pitchWithRotate: false,
          fadeDuration: 160,
        });
        map = m;

        m.addControl(
          new maplibregl.NavigationControl({ showCompass: false, visualizePitch: false }),
          'bottom-right'
        );
        m.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-left');

        /* bespoke crown pin + permanent label chip (pure CSS, moves with the pin) */
        const el = document.createElement('div');
        el.className = 'rv-marker';
        el.setAttribute('role', 'img');
        el.setAttribute('aria-label', 'Revamp Auto Car Wash — 89 Stormberg Avenue, Bosmont');
        el.innerHTML =
          '<span class="rv-pin">' +
          '<i class="rv-pin-pulse" aria-hidden="true"></i>' +
          `<svg viewBox="0 0 24 20" aria-hidden="true"><path d="${CROWN_PATH}"/></svg>` +
          '</span>' +
          '<b class="rv-tag" aria-hidden="true">Revamp Auto Car Wash</b>';
        new maplibregl.Marker({ element: el, anchor: 'center' })
          .setLngLat([SHOP.lng, SHOP.lat])
          .addTo(m);

        /* wheel-zoom unlock flow: click to zoom (Lenis keeps the page scrolling
           before that; data-lenis-prevent is toggled alongside zoom) */
        const unlock = () => {
          m.scrollZoom.enable();
          shell.classList.add('zoom-on');
          shell.setAttribute('data-lenis-prevent', '');
        };
        const lock = () => {
          m.scrollZoom.disable();
          shell.classList.remove('zoom-on');
          shell.removeAttribute('data-lenis-prevent');
        };
        m.on('click', unlock);
        m.getCanvasContainer().addEventListener('mouseleave', lock);

        m.on('load', () => {
          if (!cancelled) shell.classList.add('map-ready');
        });
        safety = window.setTimeout(() => shell.classList.add('map-ready'), 6000);

        ro = new ResizeObserver(() => {
          if (!cancelled) m.resize();
        });
        ro.observe(canvas);
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
      window.clearTimeout(safety);
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
      <div className="map-shell fade-up" ref={shellRef}>
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
