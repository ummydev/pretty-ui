#!/usr/bin/env node
// Finds common AI tells in UI source files: HTML, CSS, JSX, TSX, Vue and Svelte.
// Usage: node check.mjs <file or folder> [...] [--json]
// Exits 1 when it finds errors, 0 otherwise. Node 18+, no dependencies.

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

const EXTENSIONS = new Set(['.html', '.htm', '.css', '.scss', '.jsx', '.tsx', '.js', '.ts', '.vue', '.svelte', '.astro', '.mdx']);
const SKIP_DIRS = new Set(['node_modules', '.git', '.next', 'dist', 'build', '.output', 'out', 'coverage', 'pretty-ui']);

const args = process.argv.slice(2);
const asJson = args.includes('--json');
const targets = args.filter((a) => !a.startsWith('--'));
if (targets.length === 0) {
  console.error('Usage: node check.mjs <file or folder> [...] [--json]');
  process.exit(2);
}

// Hue in degrees of a #rgb or #rrggbb color, or null for greys.
function hue(hex) {
  let h = hex.replace('#', '');
  if (h.length === 3) h = [...h].map((c) => c + c).join('');
  if (h.length !== 6) return null;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  if (d < 0.12) return null;
  let x;
  if (max === r) x = ((g - b) / d) % 6;
  else if (max === g) x = (b - r) / d + 2;
  else x = (r - g) / d + 4;
  return (x * 60 + 360) % 360;
}
const isViolet = (hex) => {
  const h = hue(hex);
  return h !== null && h >= 245 && h <= 320;
};

const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F000}-\u{1F2FF}]\u{FE0F}?/u;
const FILLER = /\b(seamless(ly)?|unlock(s|ing)? the|supercharg\w*|revolutioni[sz]\w*|game[- ]chang\w*|next[- ]gen(eration)?|cutting[- ]edge|elevate your|unleash\w*|empower\w* your|effortless(ly)?)\b/i;
const PLACEHOLDER = /\b(lorem ipsum|john doe|jane doe|jane smith|acme( inc| corp)?)\b/i;

const RULES = [
  {
    id: 'violet-gradient',
    severity: 'error',
    message: 'Purple, violet or indigo gradient. Use a flat color from the design system.',
    test: (line) =>
      /\b(from|via|to)-(purple|violet|indigo|fuchsia)-\d{2,3}\b/.test(line) ||
      (/gradient\(/i.test(line) && (line.match(/#[0-9a-f]{3,6}\b/gi) || []).some(isViolet)),
  },
  {
    id: 'gradient-text',
    severity: 'error',
    message: 'Gradient text. Use one solid color and let size carry emphasis.',
    test: (line) => /\bbg-clip-text\b|background-clip:\s*text|-webkit-background-clip:\s*text/i.test(line),
  },
  {
    id: 'glassmorphism',
    severity: 'warning',
    message: 'Backdrop blur. Use solid surfaces unless this is an overlay that really floats.',
    test: (line) => /\bbackdrop-blur(-\w+)?\b|backdrop-filter:\s*blur/i.test(line),
  },
  {
    id: 'glow',
    severity: 'warning',
    message: 'Glow or colored shadow. Keep things at rest flat; shadow only what floats.',
    test: (line) =>
      /\bshadow-(purple|violet|indigo|fuchsia|pink|cyan|blue)-\d{2,3}\b/.test(line) ||
      /box-shadow:[^;]*0\s+0\s+\d{2,}px[^;]*(rgba?\((?!0,\s*0,\s*0)|#(?!000))/i.test(line) ||
      /\bdrop-shadow-\[0_0_/.test(line),
  },
  {
    id: 'emoji-icon',
    severity: 'error',
    message: 'Emoji used in the UI. Use a real icon set, or no icon.',
    test: (line, ext) => {
      if (ext === '.css' || ext === '.scss') return false;
      const text = line.replace(/\/\/.*$|\/\*.*?\*\/|<!--.*?-->/g, '');
      return EMOJI.test(text);
    },
  },
  {
    id: 'tracked-uppercase',
    severity: 'warning',
    message: 'Small uppercase letter-spaced label. Use sentence case at a readable size.',
    test: (line) =>
      (/\buppercase\b/.test(line) && /\btracking-(wide|wider|widest|\[0?\.\d+em\])\b/.test(line)) ||
      (/text-transform:\s*uppercase/i.test(line) && /letter-spacing:\s*0?\.\d+em/i.test(line)),
  },
  {
    id: 'numbered-sections',
    severity: 'warning',
    message: 'Numbered section label like "01 /". Show order by position instead.',
    test: (line) => />\s*0[1-9]\s*(\/|—|–|\.)?\s*</.test(line) || /["'`]0[1-9]\s*\/\s*/.test(line),
  },
  {
    id: 'default-font',
    severity: 'warning',
    message: 'Default font (Inter, Roboto, Arial). Use the fonts from DESIGN.md.',
    test: (line) => /font-family:\s*["']?(Inter|Roboto|Arial)\b/i.test(line) || /fonts\.googleapis\.com\/css2?\?family=(Inter|Roboto)[:&]/.test(line),
  },
  {
    id: 'decorative-pulse',
    severity: 'warning',
    message: 'Pulse or ping animation. Keep it for things that are actually live.',
    test: (line) => /\banimate-(pulse|ping|bounce)\b/.test(line),
  },
  {
    id: 'filler-copy',
    severity: 'warning',
    message: 'Filler marketing word. Say what the product does.',
    test: (line, ext) => ext !== '.css' && ext !== '.scss' && FILLER.test(line),
  },
  {
    id: 'placeholder-content',
    severity: 'error',
    message: 'Placeholder name or text. Use realistic content for this product.',
    test: (line, ext) => ext !== '.css' && ext !== '.scss' && PLACEHOLDER.test(line),
  },
];

function walk(path, out) {
  const s = statSync(path);
  if (s.isDirectory()) {
    for (const name of readdirSync(path)) {
      if (SKIP_DIRS.has(name) || name.startsWith('.')) continue;
      walk(join(path, name), out);
    }
  } else if (EXTENSIONS.has(extname(path).toLowerCase())) out.push(path);
}

const files = [];
for (const t of targets) walk(t, files);

const findings = [];
for (const file of files) {
  const ext = extname(file).toLowerCase();
  const spacing = new Map();
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    for (const rule of RULES) {
      if (rule.test(line, ext)) findings.push({ file: relative(process.cwd(), file), line: i + 1, rule: rule.id, severity: rule.severity, message: rule.message });
    }
    for (const m of line.matchAll(/\b(?:p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|space-[xy])-\[(\d+)px\]/g)) spacing.set(m[1], (spacing.get(m[1]) || 0) + 1);
    for (const m of line.matchAll(/(?:padding|margin|gap)[^:;]*:\s*([^;]+)/gi)) {
      for (const v of m[1].matchAll(/(\d+)px/g)) spacing.set(v[1], (spacing.get(v[1]) || 0) + 1);
    }
  });
  const offGrid = [...spacing.keys()].map(Number).filter((v) => v > 2 && v % 4 !== 0).sort((a, b) => a - b);
  if (offGrid.length >= 3) {
    findings.push({ file: relative(process.cwd(), file), line: 0, rule: 'arbitrary-spacing', severity: 'warning', message: `Spacing values off a 4px grid: ${offGrid.join(', ')}px. Use one spacing unit and its multiples.` });
  }
}

const errors = findings.filter((f) => f.severity === 'error').length;
const warnings = findings.length - errors;
if (asJson) {
  console.log(JSON.stringify({ files: files.length, errors, warnings, findings }, null, 2));
} else {
  for (const f of findings) console.log(`${f.severity === 'error' ? 'ERROR' : 'WARN '} ${f.file}${f.line ? ':' + f.line : ''}  [${f.rule}] ${f.message}`);
  console.log(`\n${files.length} files checked: ${errors} errors, ${warnings} warnings.`);
  if (findings.length === 0) console.log('No AI tells found by the checker. Still look at the screen yourself.');
}
process.exit(errors > 0 ? 1 : 0);
