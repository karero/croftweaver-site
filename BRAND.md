<!--
  BRAND.md — per-site brand & visual guide.
  Copy into the project root and fill every [BRACKET]. Pairs with
  CONTENT_GUIDE.md (what it says). The colour source of truth is the theme-token
  block in the stylesheet — src/styles/global.css (in the kit:
  templates/astro/src/styles/global.css); keep this file and that block in sync.
-->
# Webcroft — brand & style guide

## Brand in one line

A croft on the web: calm, earthy, self-assured. Moss green on warm, green-tinted
neutrals, generous whitespace, soft cards, no stock photography, typography does the
work. The palette is Webcroft's own; it deliberately does not reuse the violet and
amber of genai-wednesday.de (owner decision, 2026-10-03).

## Logo

- The logo is in progress (owner). Until it lands, the name "Webcroft" set as text in
  the heading font is the mark.
- Name styling: "Webcroft" in text, never "WebCroft"; lower case only in code contexts
  (domain, repo). No "WC" monogram.
- When the logo exists: source SVGs in `src/assets/brand/` (mark, wordmark, horizontal
  lockup, each in dark and light ink), a transparent PNG at `public/images/logo.png`
  for structured data, a light variant for dark and OG use (see OG rules), favicon and
  app icons in `public/`.

## Colour palette

Mirror these into the theme-token block. Every text/background pair MUST pass
**WCAG AA (4.5:1 body, 3:1 large)** in BOTH themes — the a11y test checks this.

### Brand (fixed, theme-independent)
| Token | Hex | Use |
|---|---|---|
| Primary (`--brand`) | `#2e6e4e` | the fixed brand colour: theme colour, share cards, brand surfaces. It does not change with the theme, so text on it is always white (6.1:1), never a theme token |
| Accent (`--accent`) | `#2e6e4e` light / `#8fd4ab` dark | buttons, links, highlights; also the "pass" state |

### Light theme
| Token | Hex |
|---|---|
| Heading, body (`--heading`, `--ink`) | `#1a1f1b` |
| Muted (`--muted`) | `#586157` |
| Hairline (`--line`), borders only | `#dfe3d9` |
| Background (`--bg`) | `#fbfaf6` |
| Soft background (`--bg-soft`) | `#f1f0e9` |
| Surface, cards (`--surface`) | `#ffffff` |

### Dark theme
| Token | Hex |
|---|---|
| Heading, body | `#e3e8e1` |
| Muted | `#a2ac9f` |
| Link (`--link`) | `#a3e0bc` |
| Hairline, borders only | `#2a332b` |
| Background | `#0e1310` |
| Soft background | `#141a15` |
| Surface | `#182019` |

### States and secondary
| Token | Light | Dark | Use |
|---|---|---|---|
| Pass (`--pass`) | accent | accent | a passing check |
| Fail (`--fail`) | `#b3261e` | `#ff8a80` | a failing check |
| Warn (`--warn`) | `#8a5a00` | `#f0b84a` | a warning |
| Secondary (`--secondary`, heather) | `#6b4e9b` | `#c3acec` | sparing: highlights, illustration. Heather grows on crofts; it is also the one quiet link to GenAI Wednesday's violet |

### Pairings
- Text on a primary button uses the background colour (`color: var(--bg)` on
  `background: var(--accent)`): 5.8:1 light, 10.9:1 dark.
- Every text colour above was calculated against background, soft background and
  surface in both themes on 2026-10-04: the lowest pair is warn on soft background in
  light at 5.2:1 (AA needs 4.5:1). The a11y test in both themes is the judge.
- Hairline is a border colour and must never carry text (about 1.1 to 1.4:1 against
  the three backgrounds, by design).

## Typography

- Family: system stack (see `--font` in global.css); no webfonts to load.
- Headings: weight 700, default tracking.
- Body: weight 400, line-height ≈ 1.6.

## Shape & spacing

- Corner radius: 12px (`--radius`). Soft shadow: `--shadow` token.
- Max content width: 72rem (`--maxw`).

## Mobile & graphics rules (the website-design-system skill)

- **Responsive images:** serve WebP (or AVIF); generate width variants and use
  `srcset`/`sizes` (or `<picture>`); render at display size, never ship a
  2000px source into an 80px slot. Set explicit `width`/`height` to reserve
  space (no layout shift / CLS).
- **Lazy-load** below-the-fold images (`loading="lazy"`); eager-load the LCP
  image and `fetchpriority="high"` it.
- **Every image has descriptive `alt`** (or `alt=""` if purely decorative).
- **Mobile first:** design at 360px up; tap targets ≥ 44px; no horizontal
  scroll; test at 360 / 768 / 1280.

## OG / share image spec (1200 × 630)

This drives `scripts/generate_og_cards.py` (run `npm run og`). Fill its BRAND block
from the tokens below so `public/images/og/default.jpg` + the per-page cards stay on-brand:
1. Canvas 1200×630, deep-green to near-black gradient (24,54,40 → 14,19,16).
2. No logo emblem yet (LOGO = None).
3. Wordmark "Webcroft", top-left, white.
4. Headline per page; default card: "Your own plot of the web."
5. Footer URL "webcroft.dev", muted.

Per-page variants: change only the headline; keep everything else identical.

**Weight + format (hard rule — messengers enforce it):**
- **≤ 300 KB.** WhatsApp silently drops the preview image above ~300 KB (Teams/Slack
  also prefer small); the link then shares with no picture. Compress to fit.
- **Extension must match the bytes.** A PNG renamed `.jpg` (or vice-versa) trips strict
  scrapers. Use **JPEG** for photographic cards (e.g. a speaker headshot), PNG only for
  flat logo/gradient cards that still come in under 300 KB.
- Never ship a **square** image as `og:image` — it gets cropped to 1.91:1 on X/Teams.
- **Generate cards with the shipped script, not by hand** — `npm run og`
  (`scripts/generate_og_cards.py`) renders a 1200×630 JPEG ≤ 300 KB per page you list,
  keeping them consistent and re-runnable. Edit its BRAND + PAGES blocks; `tests/seo.spec.ts`
  then enforces that every page's card exists at the right size. See the **og-images** skill.
  For photo-driven cards (e.g. per-event speaker headshots), extend the script to read
  frontmatter and composite the portrait — one card per content-collection entry.
- **Logo on a dark card needs a light variant.** Most logo lockups ship a dark wordmark
  that vanishes on a dark OG background. Composite a **transparent PNG** (never a JPG — it
  boxes the logo) and use a white/light wordmark version; if only a dark one exists, recolour
  the wordmark region to white at build time (a build-time recolour step does this).

## Imagery style (do / don't)

- **Do:** moss green + green-tinted neutrals, hand-drawn or typographic motifs, breathing room;
  legible in both themes.
- **Don't:** rainbow palettes, busy gradients, AI robot/brain clichés, Tomb Raider
  references (the croft is Scottish farmland, not a game), low-contrast text on images.
