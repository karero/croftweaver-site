# webcroft.dev

Project homepage for **Webcroft**, the open-source suite of website skills for AI
coding assistants (https://github.com/karero/webcroft). Built with Webcroft itself.

## Decision record (new-website interview, 2026-07-02)

1. **Pages:** three flat pages (`/`, `/privacy`, `/imprint`) — no collections.
2. **Dynamic:** Tier 1, fully static. No functions, no forms.
3. **Editors:** owner + AI assistant via git. No CMS.
4. **Language:** English only, unprefixed default (German stays additive later).
5. **Analytics:** none — Google Search Console only. No cookies, no banner.
6. **Publish model:** two-stage. `main` = noindexed preview (`*.pages.dev`),
   `production` = live at https://webcroft.dev. Publish with `npm run ship`.

## Differentiation contract

genai-wednesday.de/builder-lab is the community showcase (scorecards, FAQ,
FAQPage schema). This site is the project home (origin story, quickstart, skills
catalogue, SoftwareSourceCode schema). No shared copy; the pages crosslink.
Details: `POSITIONING.md`.

## Working on the site

```bash
npm install          # once
npm run dev          # local dev server
npm run build        # static build into dist/ (+ anchor ids + build marker)
npm test             # a11y / seo / navigation / anchors / orphans / images /
                     # tone / positioning / email / links / llms-coverage
npm run og           # regenerate OG share cards after brand/copy changes
```

Add a page: add the route to `tests/_helpers.ts` `PAGES` first (suite goes red),
build the page until green, update `public/llms.txt`, commit. Voice rules live in
`CONTENT_GUIDE.md`, positioning in `POSITIONING.md`, visuals in `BRAND.md`.

## Before launch (owner checklist)

- [ ] GitHub repo rename `website-builder` → `webcroft` (site links assume it).
- [ ] Fill the `[STREET AND NUMBER]` / `[POSTCODE]` slots in
      `src/pages/imprint.astro` and `src/pages/privacy.astro`.
- [ ] Set up `hello@webcroft.dev` (Cloudflare Email Routing forward) or change
      the address on both legal pages.
- [ ] Real favicon/app icons in `public/` (icon-192/512, apple-touch, favicon).
- [ ] Cloudflare Pages project + `production` branch; attach webcroft.dev
      (replaces the interim redirect); then Search Console registration
      (`search-console-setup` skill).
