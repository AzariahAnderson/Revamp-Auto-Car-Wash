# Revamp Auto Car Wash — Website

Single-file, self-contained website (`index.html`) for **Revamp Auto Car Wash**, Bosmont, Johannesburg.
Open `index.html` in any browser or drop it on any host (Netlify, Vercel, cPanel, WhatsApp-hosted storage — anywhere). No build step, no CDN, no internet required: all fonts, images and animation libraries are inlined.

## Business content (edit in `src/template.html`, then rebuild)
- **Address:** 89 Stormberg Avenue, Bosmont, Johannesburg
- **Phones:** +27 76 302 6570 · +27 75 037 8818
- **Prices:** Half House **R65** (exterior wash & dry) · Full House **R120** (wash + interior vacuum) · Bigger vehicles (SUVs, bakkies) **+R20**
- WhatsApp deep-links prefill a booking message per service.

## Stack & motion
- **GSAP 3.13 + ScrollTrigger** (line-mask & word reveals, batched staggers, scrub parallax, `gsap.matchMedia` device-aware effects)
- **Lenis** smooth scrolling (synced to GSAP ticker)
- **Anton + Space Grotesk** embedded as base64 woff2, injected via the FontFace API
- Liquid-glass UI: frosted capsule header, glass pill buttons with light-sweep hover, glass stat pill
- Splash screen: “Developed by Azariah Anderson and Joshua Boraine”
- Hidden scrollbars, no custom cursor, `prefers-reduced-motion` respected
- SEO: meta/OG tags + JSON-LD `AutoWash` schema with offers & phone numbers

## Project layout
```
index.html          <- THE deliverable (self-contained, deploy this)
src/template.html   <- HTML + CSS source (tokens like __IMG_HERO__)
src/app.js          <- motion / interaction source
vendor/             <- gsap.js, st.js (ScrollTrigger), lenis.js, *.woff2 fonts
assets/             <- optimized webp images (also used for og:image)
build.py            <- inlines everything into index.html
smoke.js            <- Playwright visual smoke test (writes shots/)
```

## Rebuild after editing
```bash
python3 build.py     # regenerates index.html
node smoke.js        # optional: screenshots into shots/
```

## Publish to Vercel

The `site/` folder is the deploy-ready folder (index.html + assets).

**Option A — Vercel CLI (fastest, ~2 minutes)**
```bash
npm i -g vercel
cd site
vercel          # login in browser, answer: Y / your account / N / revamp-auto-car-wash / . / N
vercel --prod   # pushes the live production deploy
```
You get a `https://revamp-auto-car-wash.vercel.app` style URL instantly.

**Option B — GitHub (best for future edits)**
1. Create a repo on github.com and upload the contents of `site/` (drag & drop in the web UI).
2. On vercel.com: **Add New… → Project → Import** that repo.
3. Framework Preset: **Other** → **Deploy**. Done.
Every future `git push` redeploys automatically.

**Custom domain:** Vercel dashboard → your project → Settings → Domains → add e.g. `revampautocarwash.co.za` and follow the DNS instructions.

## Credits
Developed by **Azariah Anderson and Joshua Boraine**.
