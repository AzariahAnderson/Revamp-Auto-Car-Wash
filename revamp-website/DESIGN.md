# REVAMP AUTO CAR WASH — Design System & Handoff Brief

**Read this before touching anything.** This folder is a complete, working starting
point: `index.html` + `assets/` (css, js, fonts, img) + `site.webmanifest`.
The page is a reference implementation of the brand. Extend it — do not restyle it.

---

## 1. Brand in one paragraph

Revamp is a hand car wash & detail studio at **89 Stormberg Avenue, Bosmont,
Johannesburg** (+27 76 302 6570). The voice is confident, plain-spoken, a little
cocky — never corporate, never cutesy. The signature line is
**“Clean cars hit different.”** The brand mark is a **crown** (the car gets the
royal treatment). The palette is **near-black + gold**, with one light “paper”
band for pricing. Everything is hand-done: hand wash, hand dry, real type,
real photography — no clip-art, no emoji, no stock-cheerfulness.

## 2. Confirmed business details (already baked in)

| Field      | Value                                   |
|------------|-----------------------------------------|
| Address    | 89 Stormberg Avenue, Bosmont, Johannesburg |
| Phone      | +27 76 302 6570 (`tel:+27763026570`)    |
| WhatsApp   | `https://wa.me/27763026570`             |

### Remaining placeholders (search the HTML for `[`)
`[OPENING HOURS]` (×3, visit panel) · `[YOUR EMAIL]` (×2) · `@[YOUR INSTAGRAM]` (×2).
Replace them in `index.html` (visit panel + footer + JSON-LD if relevant).
There are no other placeholders.

## 3. Prices (do not invent others)

- **Half House** (basic exterior wash & dry): **R40 – R90**, standard sedan **R65**
- **Full House** (exterior + interior vacuum): **R80 – R150**, standard sedan **R120**
- **Bigger vehicles** (SUVs, bakkies…): surcharge **+ R10 – R50**
- Footnote rule: ranges are vehicle-size dependent; sedan prices are the callout.
  Always keep both visible together, as in `#pricing`.

## 4. File map

```
index.html                  reference implementation (hero → marquee → services →
                            pricing → process → visit → footer)
site.webmanifest            PWA manifest, gold-on-ink icons
assets/css/styles.css       ALL styles + tokens (top of file)
assets/js/main.js           header scroll state, scroll reveals, year. Keep tiny.
assets/fonts/InterVariable.woff2       Inter (body/UI), variable 100–900
assets/fonts/InterTight-Variable.woff2 Inter Tight (display), variable 500–900
assets/img/hero-banner.jpg  2048×1152 hero, NO text in image (keep it that way)
assets/img/service-half-house.jpg  2048×1536 (4:3) rinse shot
assets/img/service-full-house.jpg  2048×1536 (4:3) foam shot, closed doors,
                                   cabin glow + towel = “interior included”
assets/img/og-cover.jpg     1200×630 social card (real Inter type, composited)
assets/img/mark.svg         crown mark, transparent
assets/img/favicon.svg      crown on ink tile (vector favicon)
assets/img/favicon.ico      16/32/48 fallback
assets/img/favicon-16x16.png, favicon-32x32.png
assets/img/apple-touch-icon.png (180), android-chrome-192/512.png
assets/img/mark-512.png     transparent crown raster (512)
assets/img/logo.svg         lockup for DARK backgrounds (needs Inter loaded)
assets/img/logo-dark.svg    lockup for LIGHT backgrounds (print, invoices)
```

## 5. Tokens (single source of truth: `:root` in styles.css)

| Token       | Value     | Use                                   |
|-------------|-----------|---------------------------------------|
| `--ink`     | `#0B0B0C` | page bg, dark surfaces                |
| `--ink-2`   | `#121214` | cards / panels on dark                |
| `--ink-3`   | `#1B1B1E` | hover surface on dark                 |
| `--paper`   | `#F5F3EE` | text on dark                          |
| `--paper-2` | `#ECE9E1` | light section bg (pricing)            |
| `--gold`    | `#FFC700` | CTAs, accents, mark, marquee bg       |
| `--gold-deep`| `#E0A400`| gold on light backgrounds             |
| `--line`    | rgba(245,243,238,.14) | hairlines on dark        |
| `--line-dark`| rgba(11,11,12,.14)  | hairlines on light        |
| `--muted` / `--muted-dark` | 62% paper / ink | secondary text |

Radii: `10px` cards/panels, `999px` buttons/chips only. Borders: 1px hairlines.
Easing: `--ease: cubic-bezier(.16,1,.3,1)`. Section rhythm: `--section-y`.
Container: `min(1200px, 100% - 2*--pad-x)`.

## 6. Type system (Inter only — no other families, ever)

- **Display** = `Inter Tight`, weight 800, tracking `-0.02em…-0.035em`, line-height ~0.98.
  H1 `clamp(3.1rem, 8.4vw, 7.2rem)` · H2 `.h2` `clamp(2.35rem, 5vw, 4.1rem)`.
- **Body/UI** = `Inter`, 400–650, body 1rem/1.6, `font-feature-settings:"cv05","ss01"`.
- **Eyebrow** = Inter 650, .78rem, `letter-spacing:.22em`, uppercase, gold,
  preceded by the 15px crown glyph.
- **Prices/numbers** = Inter Tight 800.
- Secondary text = `--muted` / `--muted-dark`, never pure grey hexes.

## 7. The mark (crown) — geometry & rules

One geometry everywhere (64-grid):
`polygon 14,45 8,17 22,29 32,7 42,29 56,17 50,45` + `rect x12 y50 w40 h6 rx1`.
In HTML use `<use href="#crown">` (symbol defined once in index.html) with
`color:` set to gold. Rules: gold on ink, or ink on gold (marquee). Never
outline it, never gradient it, never rotate it, never add drop shadows.
Minimum size 14px. Clear space = half the mark’s height. Favicon = mark on ink
tile (rx ≈ 21.5% of tile), mark inset ≈ 18.5%.

## 8. Imagery rules (this is what keeps the set “not AI-looking”)

One car, one studio, one grade, forever:
- **Car:** glossy black 1990s coupe, E36-era silhouette, mesh-spoke alloys,
  **no badges/emblems/lettering anywhere**.
- **Studio:** near-black charcoal wall, vertical amber-gold light strips on the
  right, cool steel-blue fill from the left.
- **Floor:** wet dark asphalt, mirror-like golden reflections.
- **Grade:** cinematic, moody, fine film grain, high dynamic range, 35mm look.
- **Composition:** minimal, uncluttered, three-quarter front, whole car in frame.
- **Never put text, logos, watermarks or people in photographs.** All type lives
  in HTML (or is composited with real Inter, as `og-cover.jpg` was).
- Regeneration recipe: always pass an existing image from this set as the
  reference and say “same car, same studio, same lighting recipe, same grade,
  same framing; the only difference is …”. Crop: hero 16:9, services 4:3,
  og 1200×630. Save JPEG q≈90 progressive.

## 9. Components (already built — reuse, don’t reinvent)

`.header` (fixed, blurs after 24px scroll) · `.hero` (100svh, Ken Burns image,
line-mask H1 reveal, 3-up meta strip with hairlines) · `.marquee` (gold band,
crown separators, pauses on hover) · `.card` (service: 4:3 media, tag pill,
price in Inter Tight gold, sedan chip, diamond-bullet feature list, `.tlink`
footer) · `.price-row` (light band 3-col grid) · `.chip` · `.step` (4-up
numbered process, hairline dividers) · `.visit__panel` (hours table + blocks) ·
`.footer__shout` (giant outlined tagline) · `.btn--gold/--ghost/--ghost-dark` ·
`.tlink` (underline-sweep link with arrow).

## 10. Motion spec

- Hero image: Ken Burns 28s alternate, scale 1.02→1.12.
- H1: per-line mask reveal, 1.05s `--ease`, 0.12s stagger.
- Scroll reveals: `[data-reveal]` → `.is-in` via IntersectionObserver,
  stagger with inline `--d`. Threshold .15.
- Marquee: 44s linear infinite, duplicated track, translateX(-50%).
- Hovers: cards lift 4px + border warms to gold; media scales 1.045 over 1.4s;
  buttons lift 2px (+ gold glow on `--gold`); `.tlink` underline sweeps.
- **Everything** must honour `prefers-reduced-motion: reduce` (already handled
  in CSS + JS — keep it that way for anything you add).

## 11. Accessibility & quality bar

Semantic landmarks (`header/main/footer/nav/section[aria]`), skip link,
focus-visible gold outline, `::selection` gold, alt text on every meaningful
image (decorative hero img is `alt=""` + `aria-hidden` wrapper), JSON-LD
`AutoWash` schema in `<head>`, self-hosted fonts with `font-display:swap`,
lazy-loading below the fold, `fetchpriority="high"` on the hero.

## 12. Anti-slop list (hard rules)

No emoji. No gradient headlines. No glassmorphism beyond the two existing
blurs (header, card tag). No rounded-2xl-everything (10px max on cards).
No centred hero trinity. No lorem. No fake awards/testimonials/stats.
No cursor-trail blobs, no parallax confetti. No stock photos of smiling
people with thumbs up. No additional font families. No new colours outside
the token set. No text baked into photographs. No exclamation marks in
headings. If a section can be cut without losing information, cut it.

## 13. Checklist for the next AI / developer

1. Replace remaining `[PLACEHOLDERS]` (§2) with real hours/email/Instagram.
2. Add pages/sections only from this kit: gallery (reuse grade rules §8),
   booking (tel/WhatsApp-first — there is no online payment), FAQ (prices §3),
   about (voice §1). Keep the section order rhythm: dark → gold band → dark →
   light → dark.
3. New UI = existing tokens + components (§5, §9). New motion = §10 + reduced-motion.
4. Keep `index.html` valid: one `<h1>`, sections in order, footer shout last.
5. Test at 360px, 768px, 1440px; check contrast of `--muted` on `--ink-2`.
6. Never regenerate images without a reference image from the existing set (§8).
