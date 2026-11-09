#!/usr/bin/env node
// Writes one HTML page that shows several screens side by side, scaled to fit.
// Usage: node compare.mjs <a.html> <b.html> [...] [--labels "A,B,C"] [--out compare.html] [--width 1440 --height 900]
// Use it to choose between design directions, or to show a before and after.

import { mkdirSync, writeFileSync } from 'node:fs';
import { basename, dirname, relative, resolve } from 'node:path';

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : fallback;
};
const valued = new Set(['--labels', '--out', '--width', '--height']);
const files = args.filter((a, i) => !a.startsWith('--') && !valued.has(args[i - 1]));
if (files.length < 2) {
  console.error('Usage: node compare.mjs <a.html> <b.html> [...] [--labels "A,B"] [--out compare.html]');
  process.exit(2);
}

const out = resolve(opt('out', 'pretty-ui/compare.html'));
const labels = (opt('labels', '') || '').split(',').map((s) => s.trim()).filter(Boolean);
const mobile = files.some((f) => /mobile|app|390/.test(f));
const width = Number(opt('width', mobile ? 390 : 1440));
const height = Number(opt('height', mobile ? 844 : 900));

const frames = files
  .map((file, i) => {
    const src = /^https?:/.test(file) ? file : relative(dirname(out), resolve(file));
    const label = labels[i] || basename(file).replace(/\.html?$/, '');
    return `<figure><figcaption>${label.replace(/</g, '&lt;')}</figcaption><div class="frame"><iframe src="${src}" loading="lazy" title="${label.replace(/"/g, '&quot;')}"></iframe></div></figure>`;
  })
  .join('\n');

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>pretty-ui: compare</title>
<style>
  :root { --w: ${width}px; --h: ${height}px; --n: ${files.length}; --gap: 24px; }
  * { box-sizing: border-box; }
  body { margin: 0; padding: 24px; background: #e9e9e6; color: #1a1a1a; font: 14px/1.4 system-ui, sans-serif; }
  main { display: grid; grid-template-columns: repeat(var(--n), 1fr); gap: var(--gap); align-items: start; }
  figure { margin: 0; }
  figcaption { margin: 0 0 8px; font-weight: 600; }
  .frame { position: relative; width: 100%; aspect-ratio: ${width} / ${height}; overflow: hidden; border-radius: 8px; background: #fff; box-shadow: 0 1px 2px rgba(0,0,0,.08); }
  iframe { position: absolute; top: 0; left: 0; width: var(--w); height: var(--h); border: 0; transform-origin: 0 0; }
</style>
</head>
<body>
<main>
${frames}
</main>
<script>
  const fit = () => document.querySelectorAll('.frame').forEach((f) => {
    f.querySelector('iframe').style.transform = 'scale(' + f.clientWidth / ${width} + ')';
  });
  addEventListener('resize', fit);
  fit();
</script>
</body>
</html>
`;

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, html);
console.log(`Wrote ${relative(process.cwd(), out)} with ${files.length} screens at ${width}×${height}. Open it in a browser.`);
