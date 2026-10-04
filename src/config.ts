// Central site configuration. Edit company facts / analytics HERE only — Base.astro,
// schema, llms.txt and the tests all read from this single source. Keep SITE.url in
// sync with `site:` in astro.config.mjs.

export const SITE = {
  url: 'https://webcroft.dev',         // production origin, no trailing slash
  name: 'Webcroft',
  legalName: 'Daniel Melter',
  locale: 'en',
  themeColor: '#2e6e4e',               // croft moss-green; matches brand primary + manifest
  // Home <title> is special-cased (NOT "Example | Example"). Keep ≤ 60 chars.
  titleHome: 'Webcroft: website skills for search and AI visibility',
  tagline: 'Your own plot of the web.',
  // 120–160 chars: default meta description + Organization/WebPage schema text.
  description:
    'Webcroft is a suite of open-source website skills for AI coding assistants. ' +
    'Build websites that rank, then keep improving SEO and GEO, week by week.',
  repo: 'https://github.com/karero/webcroft',   // the toolkit; goes live with the repo rename
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

export const COMPANY = {
  legalName: 'Daniel Melter',
  logo: '/images/logo.png',            // resolved against SITE.url for schema
} as const;

// External profiles that corroborate the entity (EEAT). Only ship URLs that
// resolve — a broken sameAs is worse than none. .filter(Boolean) drops the slots.
// github.com/karero/webcroft goes live with the repo rename — publish is gated on it.
export const SAME_AS: string[] = [
  'https://github.com/karero/webcroft',
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

// Decision (interview Q5): Google Search Console only — no analytics script,
// no consent banner. Flip `enabled` to the CF_PAGES_BRANCH check if that changes.
export const ANALYTICS = {
  enabled: false,
  domain: 'webcroft.dev',
  scriptHost: 'https://plausible.io',
} as const;
