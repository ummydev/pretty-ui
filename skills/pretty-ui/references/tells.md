# AI tells

Patterns that make a UI read as generated. None is wrong on its own; together they read as a template. Each entry says what to do instead. The checker (`scripts/check.mjs`) finds the ones marked **[checked]**.

The list moves: every round of fixes becomes the next round's default. Treat it as a review aid, not as taste. The lasting fix is a direction taken from the product.

## Color and surface

- **Purple, violet or indigo gradients [checked].** Buttons, hero backgrounds, headline text. Instead: flat color from the design system; at most one accent.
- **Gradient text [checked].** Instead: one solid color; let size and weight carry emphasis.
- **Glassmorphism [checked].** Frosted, blurred panels used as decoration. Instead: solid surfaces separated by a step in tone. Blur only for overlays that really float, like a sheet over content.
- **Glow and colored shadows [checked].** Neon outlines, colored drop shadows on cards. Instead: no shadow on things at rest; a soft neutral shadow only on menus, dialogs and sheets.
- **Rainbow charts.** Every series a different saturated hue. Instead: the system's chart colors in order, with the primary for the series that matters.
- **The second-wave palettes.** Cream with a serif headline and a terracotta accent; near-black with one acid-green or vermilion accent. Use them only when the product's world calls for them.

## Type

- **One default sans everywhere [checked].** Inter, Roboto or Arial at similar sizes. Instead: the system's fonts and scale, with clear jumps between levels.
- **Tiny uppercase letter-spaced labels [checked].** Above every heading and on every stat. Instead: sentence case at a readable size, or drop the label.
- **Styled accent words.** One italic or colored word in every headline. Instead: one face, one color; the words carry the emphasis.
- **Numbered section labels [checked].** "01 / 02 / 03" before each section. Instead: order shown by position; a real numbered list only for real steps.

## Layout

- **Three identical cards.** Icon, two-word title, one vague line, three times. Instead: show the product, or vary size and content by importance.
- **Everything centered.** Instead: a left edge to read from; center only short, single statements.
- **Uniform rhythm.** Every section the same height and padding. Instead: one dominant section, quieter ones around it.
- **Cards inside cards.** Instead: one level of surface; use spacing and dividers inside it.
- **Arbitrary spacing [checked].** Many one-off pixel values. Instead: one spacing unit and its multiples.

## Content and copy

- **Emoji as icons or labels [checked].** "🚀 Fast", "✨ New". Instead: a real icon set, or no icon.
- **Filler words [checked].** Seamless, unlock, supercharge, elevate, revolutionize, next-gen, cutting-edge, game-changer. Instead: say what the product does, with a number if you have one.
- **Placeholder people and companies [checked].** John Doe, Jane Smith, Acme, Lorem ipsum. Instead: realistic sample data that fits the product.
- **Vague social proof.** "Trusted by 10,000+ teams" over grey logos. Instead: a real number, a real quote with a name and role, or nothing.
- **Fake dashboards.** Grey bars standing in for a product. Instead: a real screen of the product, rendered in HTML.

## Motion

- **Fade-in or slide-up on every section.** Instead: no entrance animation by default; motion only for state changes.
- **Pulsing or pinging decoration [checked].** Instead: pulse only for something live, such as recording or a live connection.

## Mobile apps

- **Web layouts squeezed onto a phone.** Instead: one column, a bottom tab bar or a clear back button, primary actions in thumb reach.
- **Touch targets under 44pt (iOS) or 48dp (Android).**
- **Ignoring the safe areas** at the top and bottom of the screen.
- **A hamburger menu for three destinations.** Instead: a tab bar.
