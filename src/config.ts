// Central site configuration. Edit company facts / analytics HERE only — Base.astro,
// schema, llms.txt and the tests all read from this single source. Keep SITE.url in
// sync with `site:` in astro.config.mjs.

export const SITE = {
  url: 'https://croftweaver.com',         // production origin, no trailing slash
  name: 'Croftweaver',
  legalName: 'M-Squad GmbH',
  locale: 'en',
  themeColor: '#2e6e4e',               // croft moss-green; matches brand primary + manifest
  // Home <title> is special-cased (NOT "Example | Example"). Keep ≤ 60 chars.
  titleHome: 'Croftweaver: website skills for search and AI visibility',
  tagline: 'Your own plot of the web.',
  // 120–160 chars: default meta description + Organization/WebPage schema text.
  description:
    'Croftweaver is a suite of open-source website skills for AI coding assistants. ' +
    'Weave websites that rank, then keep improving them week by week.',
  repo: 'https://github.com/karero/croftweaver',   // the toolkit; goes live with the repo rename
} as const;

// Header navigation, in order. Labels live here so a second language can swap them.
// Link only to pages and anchors that exist: tests/navigation.spec.ts and
// tests/anchors.spec.ts reject a dead target. A home-page anchor becomes a page link
// in the pull request that adds that page.
export const NAV: { label: string; href: string }[] = [
  { label: 'Proof', href: '/proof' },
  { label: 'Checks', href: '/checks' },
  { label: 'Skills', href: '/skills' },
  { label: 'Quickstart', href: '/start' },
];

// og:locale derivation — ONE implementation shared by Base.astro (emission)
// and tests/seo.spec.ts (assertion), so they can't drift: 'de' → de_DE via
// the map; regioned tags use base + region ('de-AT' → de_AT); unmapped bases
// return undefined (og:locale is optional; a wrong en_US would contradict
// inLanguage).
export const OG_LOCALES: Record<string, string | undefined> = { en: 'en_US', de: 'de_DE', fr: 'fr_FR', es: 'es_ES', it: 'it_IT' };
export function ogLocaleFor(lang: string): string | undefined {
  const [base = '', ...rest] = lang.toLowerCase().split('-');
  const region = rest.at(-1);
  return region && region.length === 2 ? `${base}_${region.toUpperCase()}` : OG_LOCALES[base];
}

// The operator. The imprint and the privacy page print these facts and the structured
// data carries the name, so the three cannot disagree.
export const COMPANY = {
  legalName: SITE.legalName,
  street: 'Schellingstr. 141 Rgb.',
  postcodeCity: '80798 Munich, Germany',
  managingDirector: 'Daniel Melter',
  logo: '/images/logo.png',            // resolved against SITE.url for schema
} as const;

// External profiles that corroborate the entity (EEAT). Only ship URLs that
// resolve — a broken sameAs is worse than none. .filter(Boolean) drops the slots.
// github.com/karero/croftweaver goes live with the repo rename — publish is gated on it.
export const SAME_AS: string[] = [
  'https://github.com/karero/croftweaver',
  'https://genai-wednesday.de/builder-lab',
].filter(Boolean);

// Topics the site is authoritative on (schema knowsAbout).
export const KNOWS_ABOUT: string[] = [
  'Astro static websites',
  'AI coding assistants',
  'search engine optimization',
  'web accessibility',
];

// Plausible (cookieless; scriptHost is your own self-hosted instance, or
// https://plausible.io for the paid cloud version). Fire only on the production
// deploy: Cloudflare Pages sets CF_PAGES_BRANCH to the branch being built.
//
// IMPORTANT: PROD_BRANCH must equal the branch Cloudflare Pages calls "Production"
// for THIS project (house convention: 'production'; Cloudflare's default is 'main').
// A mismatch means analytics silently never loads — no error, no data.
export const PROD_BRANCH = 'production';

// The instance is M-Squad's own. scriptId is the per-site script its installer hands out
// (Settings > General > Tracking, next to "Site installation"): the domain and the optional
// measurements (outbound links, file downloads, form submissions) are switched in the
// instance, not here, and section 3 of the privacy page mirrors them. Changing scriptHost
// means changing script-src and connect-src in public/_headers too, or the browser blocks
// the script; tests/check_analytics_gate.sh checks both against this file and pins the script address. Base.astro
// writes two tags: the script, and the short stub that calls plausible.init(); without
// the stub the script never starts.
export const ANALYTICS = {
  enabled: process.env.CF_PAGES_BRANCH === PROD_BRANCH,
  scriptHost: 'https://analytics.m-squad.com',
  scriptId: 'pa--pMhz1-dKjwaTf3D6ArFS',
} as const;
