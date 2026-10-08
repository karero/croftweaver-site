import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Set `site` to the real production domain BEFORE first deploy — it drives the
// sitemap, canonical tags and OG URLs. Keep in sync with SITE.url in src/config.ts.
export default defineConfig({
  site: 'https://croftweaver.com',
  // Astro 7 defaults compressHTML to 'jsx' rules: a source line-break between two inline
  // elements (or between text and an inline element) collapses to ZERO characters instead
  // of a space — this bit real prose here (words ran together across a `</a>`/`<strong>`
  // line boundary in normal paragraph writing, not just layout). `true` restores the old
  // "lossless" behavior (still compresses, just keeps a rendered space where one exists in
  // source) — a source-level fix, not per-paragraph patching that a future edit can undo.
  compressHTML: true,
  trailingSlash: 'never',           // CONVENTION: clean URLs with NO trailing slash (/about, not /about/)
  build: {
    format: 'file',                 // emit /about.html → Cloudflare Pages serves it at /about (no slash)
    inlineStylesheets: 'always',    // drop the render-blocking CSS request (LCP)
  },
  integrations: [
    // No lastmod: stamping build time on every URL tells crawlers all pages changed
    // when none did. If a page sets noindex, exclude it here too, e.g.
    //   sitemap({ filter: (url) => !url.endsWith('/internal') })
    // — and remove it from tests/_helpers.ts PAGES (seo.spec.ts compares the two).
    sitemap({ changefreq: 'monthly', priority: 0.7 }),
  ],
  // reuseExistingServer:false in playwright.config.ts only helps if a taken port fails
  // loudly. Vite's preview defaults to sliding to the next free port instead, which
  // would leave Playwright waiting on the wrong one until it times out. strictPort
  // makes the preview itself refuse to start on collision.
  vite: { preview: { strictPort: true } },
});
