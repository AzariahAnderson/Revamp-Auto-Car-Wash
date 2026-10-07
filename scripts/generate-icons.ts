/**
 * One-off generator: favicon/manifest/apple icon PNGs + branded OG image.
 * Run: bun scripts/generate-icons.ts
 */
import sharp from 'sharp';
import { readFileSync } from 'node:fs';

const master = readFileSync('public/icon-master.svg');

/** PWA maskable icon: crown pushed into the safe zone (80% radius circle) on full-bleed bg. */
const maskable = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
     <rect width="512" height="512" fill="#0a0a0b"/>
     <g transform="translate(256 256) scale(0.62) translate(-256 -256)">
       <path d="M136 352 L160 190 L233 271 L256 130 L279 271 L352 190 L376 352 Z"
             fill="none" stroke="#ffc72c" stroke-width="20" stroke-linejoin="round"/>
       <circle cx="160" cy="190" r="14" fill="#ffc72c"/>
       <circle cx="256" cy="130" r="14" fill="#ffc72c"/>
       <circle cx="352" cy="190" r="14" fill="#ffc72c"/>
     </g>
   </svg>`
);

async function png(from: Buffer | string, size: number, out: string) {
  await sharp(from)
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toFile(out);
  console.log('✓', out);
}

await Promise.all([
  png(master, 32, 'public/icons/icon-32.png'),
  png(master, 96, 'public/icons/icon-96.png'),
  png(master, 192, 'public/icons/icon-192.png'),
  png(master, 512, 'public/icons/icon-512.png'),
  png(maskable, 192, 'public/icons/icon-192-maskable.png'),
  png(maskable, 512, 'public/icons/icon-512-maskable.png'),
  png(master, 180, 'public/icons/apple-icon-180.png'),
]);

/* Branded OG image 1200×630 — hero photo, darkened, with type-safe overlay band. */
const ogText = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
     <defs>
       <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
         <stop offset="0" stop-color="#0a0a0b" stop-opacity="0.55"/>
         <stop offset="0.45" stop-color="#0a0a0b" stop-opacity="0.12"/>
         <stop offset="1" stop-color="#0a0a0b" stop-opacity="0.92"/>
       </linearGradient>
     </defs>
     <rect width="1200" height="630" fill="url(#shade)"/>
     <g transform="translate(80 64) scale(1.5)">
       <path d="M4 16 L5.5 6 L9.5 11 L12 3.5 L14.5 11 L18.5 6 L20 16 Z"
             fill="none" stroke="#ffc72c" stroke-width="1.7" stroke-linejoin="round"/>
     </g>
     <text x="80" y="142" font-family="Arial, Helvetica, sans-serif" font-size="27"
           font-weight="700" letter-spacing="9" fill="#ffc72c">REVAMP AUTO CAR WASH</text>
     <text x="78" y="492" font-family="Arial Black, Arial, sans-serif" font-size="84"
           font-weight="900" fill="#f2f1ec" letter-spacing="1">CLEAN CARS</text>
     <text x="78" y="572" font-family="Arial Black, Arial, sans-serif" font-size="84"
           font-weight="900" fill="#f2f1ec" letter-spacing="1">HIT DIFFERENT.</text>
     <text x="82" y="606" font-family="Arial, Helvetica, sans-serif" font-size="21"
           font-weight="600" letter-spacing="3.5" fill="#98968e">BOSMONT, JOHANNESBURG&#160;&#160;·&#160;&#160;HALF HOUSE R65&#160;&#160;·&#160;&#160;FULL HOUSE R120</text>
   </svg>`
);

await sharp('public/images/hero.webp')
  .resize(1200, 630, { fit: 'cover', position: 'attention' })
  .composite([{ input: ogText }])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile('public/images/og.jpg');
console.log('✓ public/images/og.jpg');
