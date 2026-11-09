---
name: pretty-ui
description: Makes AI-built UI look designed instead of generated. Shows three real design directions side by side, lets the user pick one, saves it as a DESIGN.md the agent follows on every screen, then rebuilds or polishes the UI pass by pass and checks it for AI tells. Use when the user asks to make a website, landing page, dashboard or mobile app screen prettier, less generic, less "AI-looking", more designed or more on-brand, or to pick a design system, style or theme for a project. Works for web (HTML, React, Next.js, Vue, Svelte, Tailwind, shadcn) and mobile apps (React Native, Expo, SwiftUI, Jetpack Compose, Flutter).
license: MIT
metadata:
  author: Codex Design
  homepage: https://codexdesign.io/design-systems
  repository: https://github.com/ummydev/pretty-ui
---

# pretty-ui

AI-built screens look alike because nobody chose anything. The model fills every gap with the most common answer it has seen, and the result is a page that could belong to any product.

pretty-ui fixes that in the order a designer would: **choose a direction, write it down, then apply it everywhere and check the result.** The choice is made by the person, from real options they can see, not by the agent alone.

## The run

Follow these steps in order. Tell the user which step you are on.

### 1. Read the project

- Find what is being built: a page that is read and scrolled (landing page, marketing site, portfolio), a web app screen people work in (dashboard, settings, inbox), or a mobile app.
- Find the stack: plain HTML, Tailwind, shadcn/ui, React, Vue, Svelte, React Native, SwiftUI, Compose or Flutter. Work in that stack. Never migrate it.
- Look for an existing visual system: `DESIGN.md`, `AGENTS.md` or `CLAUDE.md` design notes, Tailwind or shadcn theme variables, a brand guide, a logo. **If the brand already has colors and fonts, keep them.** Directions in step 3 then vary layout, type scale, density and accents inside the brand, not the brand itself.
- Collect real content: the product name, what it does, who it is for, real numbers, real screenshots. Placeholder content makes every design look generic.

### 2. Audit (only when a UI already exists)

Read `references/tells.md`. Run the checker on the files that render the UI:

```bash
node <skill>/scripts/check.mjs <files or folders>
```

List the findings for the user, grouped by severity, with file and line. Add anything the checker can't see by reading the code: three identical cards, everything centered, no clear focal point, filler copy. If the screen is already well designed, say so and suggest two or three small refinements instead of a redesign.

### 3. Offer three directions

Read `references/systems.md`. It lists 24 complete design systems, 12 for the web and 12 for mobile apps, each with a public DESIGN.md.

1. Pick **three systems that differ on purpose**: for example one light and editorial, one dark and dense, one soft and friendly. Match the platform (web or app) and the product's world. Never offer three variations of the same look.
2. Fetch each system's DESIGN.md from its URL.
3. Build **the same key screen** in each direction, with the same real content, as self-contained HTML files:
   - `pretty-ui/directions/a-<slug>.html`, `b-<slug>.html`, `c-<slug>.html`
   - Web pages at 1440×900, mobile screens at 390×844. Inline CSS, Google Fonts links, no external images.
4. Make them easy to compare:
   - **If the Codex Design canvas tools are available** (for example `create_canvas` and `add_node`), put the three files on one canvas side by side and open it.
   - Otherwise run `node <skill>/scripts/compare.mjs pretty-ui/directions/*.html --out pretty-ui/directions/index.html` and tell the user to open that file.
5. Ask the user to pick one, or to combine parts ("A's type with C's colors"). If they asked you to decide, pick the one that best fits the product and say why in one sentence.

When the brand is fixed, the three directions use the brand's colors and fonts and differ in layout, scale and density instead.

### 4. Write the system down

- Save the chosen system as `DESIGN.md` in the project root. Keep its format: YAML front matter with tokens, then Overview, Colors, Typography, Layout, Shapes, Components and Do's and Don'ts.
- Apply any changes the user asked for (a brand color, a different heading font) to the file, not just to the code.
- Add one line to `AGENTS.md` (and `CLAUDE.md` if the project has one): `Follow DESIGN.md for every screen: colors, type, spacing, radius and components.` Codex reads AGENTS.md automatically but not DESIGN.md.
- For shadcn or Tailwind projects, map the tokens into the theme variables (`--background`, `--primary`, `--radius` and the rest). Every system page links a ready shadcn theme: `npx shadcn@latest add https://codexdesign.io/r/<slug>.json`.

### 5. Apply it, pass by pass

Work across the whole screen one layer at a time, like a designer's redline review. Keep the features, content and section order unless the user asked otherwise.

1. **Tokens.** Replace hard-coded colors, sizes and radii with the system's tokens.
2. **Type.** Two families at most. Use the system's scale. Make the one most important line on the screen clearly the largest. Tabular figures for numbers that line up.
3. **Spacing and layout.** One spacing unit from the system and its multiples. Align everything to the grid or screen padding. Group related things tightly and separate groups generously.
4. **Color.** Neutrals carry the screen. The primary color appears where the user acts, about once per view. Charts use the system's chart colors in order.
5. **Components.** Buttons, inputs, cards, lists and navigation follow the system's Components section. Real icons (Lucide, Phosphor, SF Symbols, Material Symbols), never emoji as icons.
6. **Copy.** Plain, specific words from the product. Cut filler ("seamless", "unlock", "supercharge"). Headlines say what the thing is or does.
7. **Details.** Hover, focus and pressed states; empty, loading and error states; contrast of at least 4.5:1 for text.
8. **Motion.** Only where it explains something: a state change, a transition between screens. No fade-in on every section, no pulsing decoration.

For mobile apps, also read `references/app.md`.

### 6. Check

- Run the checker again on the changed files and fix every error and as many warnings as make sense.
- Look at the result. If Playwright or a browser tool is available, screenshot it at 1440 and 390 wide (or the device size for apps) and fix what looks wrong: no focal point, cramped groups, text that wraps badly, low contrast.
- For a redesign, write a before and after page the user can share:

```bash
node <skill>/scripts/compare.mjs before.html after.html --labels "Before,After" --out pretty-ui/before-after.html
```

### 7. Report

Tell the user, briefly: the direction chosen and why, the files changed, what the checker found before and after, and anything left that needs their decision (real photos, a logo, copy only they can write).

## Rules that always apply

- Show options before committing to one. Never pick a style silently.
- Keep the user's brand, content and stack.
- One design system per product, written in DESIGN.md, followed everywhere.
- No purple or violet gradients, gradient text, glassmorphism panels, glowing shadows, emoji icons, pill badges above every heading, or rows of identical icon cards, unless the user explicitly wants them.
- Don't trade one cliché for another. Cream with a serif and a terracotta accent, or near-black with one acid-green accent, are the new defaults; use them only when the product's world calls for them.
- Removing decoration is half the job. Fill the space with real content, larger type for what matters, and one memorable element taken from the product itself.

## Files

- `references/systems.md`: the 24 design systems, with platform, style and DESIGN.md URL.
- `references/tells.md`: what makes a UI look AI-made, and what to do instead.
- `references/app.md`: rules for iOS, Android and cross-platform app screens.
- `scripts/check.mjs`: a static checker for AI tells in HTML, CSS, JSX, TSX, Vue and Svelte files. Node 18+, no dependencies.
- `scripts/compare.mjs`: writes one HTML page that shows several screens side by side, for choosing a direction or showing before and after.
