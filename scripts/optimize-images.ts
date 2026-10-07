/**
 * Optimize site imagery for data-friendly delivery.
 * Run: bun run scripts/optimize-images.ts
 *  - hero: recompress desktop (1600w) + create 720w mobile variant
 *  - logo: downscale sticker to display size (480w)
 */
import sharp from "sharp";
import { statSync } from "fs";

const q = { quality: 66, effort: 6 } as const;

async function main() {
  // desktop hero — recompress in place at same width
  await sharp("public/images/hero.webp")
    .resize({ width: 1600, withoutEnlargement: true })
    .webp(q)
    .toFile("public/images/hero.opt.webp");

  // mobile hero — 720w is plenty for ≤700px screens at 2x
  await sharp("public/images/hero.webp")
    .resize({ width: 720 })
    .webp(q)
    .toFile("public/images/hero-mob.webp");

  // logo sticker — displayed at ~170px, 480w covers 2x retina
  await sharp("public/images/logo.webp")
    .resize({ width: 480, withoutEnlargement: true })
    .webp({ quality: 72, effort: 6 })
    .toFile("public/images/logo.opt.webp");

  for (const f of ["hero.opt", "hero-mob", "logo.opt"]) {
    const kb = Math.round(statSync(`public/images/${f}.webp`).size / 1024);
    console.log(`${f}.webp: ${kb}KB`);
  }
}

main();
