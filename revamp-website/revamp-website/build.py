#!/usr/bin/env python3
"""Builds the self-contained index.html: inlines GSAP, Lenis, fonts and images."""
import base64, pathlib, re, sys

root = pathlib.Path(__file__).parent
tpl = (root / 'src' / 'template.html').read_text(encoding='utf-8')

def b64(p):
    return base64.b64encode((root / p).read_bytes()).decode()

def read(p):
    return (root / p).read_text(encoding='utf-8')

tokens = {
    '__FONT_ANTON__': b64('vendor/font_Anton_400.woff2'),
    '__FONT_SG400__': b64('vendor/font_SpaceGrotesk_400.woff2'),
    '__FONT_SG500__': b64('vendor/font_SpaceGrotesk_500.woff2'),
    '__FONT_SG700__': b64('vendor/font_SpaceGrotesk_700.woff2'),
    '__IMG_HERO__':  'data:image/webp;base64,' + b64('assets/hero.webp'),
    '__IMG_HALF__':  'data:image/webp;base64,' + b64('assets/half-house.webp'),
    '__IMG_FULL__':  'data:image/webp;base64,' + b64('assets/full-house.webp'),
    '__IMG_LOGO__':  'data:image/webp;base64,' + b64('assets/logo.webp'),
    '__GSAP__':  read('vendor/gsap.js'),
    '__ST__':    read('vendor/st.js'),
    '__LENIS__': read('vendor/lenis.js'),
    '__APP__':   read('src/app.js'),
}

# safety: no inline script may contain a closing script tag
for k in ('__GSAP__', '__ST__', '__LENIS__', '__APP__'):
    if '</script' in tokens[k].lower():
        sys.exit(f'ERROR: {k} contains </script>')

app_src = read('src/app.js')
for k, v in tokens.items():
    if k not in tpl and k not in app_src:
        print('WARN: token unused:', k)
    tpl = tpl.replace(k, v)

# second pass: tokens introduced by the __APP__ insertion (font payloads in app.js)
for k, v in tokens.items():
    tpl = tpl.replace(k, v)

left = re.findall(r'__[A-Z0-9]+__', tpl)
if left:
    sys.exit(f'ERROR: unreplaced tokens: {set(left)}')

(root / 'index.html').write_text(tpl, encoding='utf-8')
print('index.html written:', (root / 'index.html').stat().st_size, 'bytes')
