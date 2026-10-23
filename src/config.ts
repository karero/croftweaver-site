// Central site configuration. Edit company facts / analytics HERE only — Base.astro,
// the schema, the legal pages and the tests read from this single source. public/llms.txt
// does not: it is a static file kept in step by hand (tests/llms-coverage.spec.ts checks
// which pages it lists). Keep SITE.url in sync with `site:` in astro.config.mjs.

export const SITE = {
  url: 'https://croftweaver.com',         // production origin, no trailing slash
  name: 'Croftweaver',
  legalName: 'M-Squad GmbH',
  locale: 'en',
  themeColor: '#2e6e4e',               // croft moss-green; matches brand primary + manifest
  // Home <title> is special-cased (NOT "Example | Example"). Keep ≤ 60 chars.
  titleHome: 'Croftweaver: website skills for search and AI visibility',
  tagline: 'Your own plot of the web.',
  // The line under the logo in the header, on every page: what Croftweaver is for, in the
  // words that open the toolkit's README.
  claim: 'Build for search and AI.',
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
//
// An item is a link, or a group of links that opens under its name. A group needs two
// pages: while only one page of a set is on main it stays a plain link under its own label
// (Security was one, until /what-it-runs-on made the two the Technology group), and the navigation
// work's pull request that adds the second page's place turns the link into the group. Header
// places are the navigation work's; a page's own pull request adds only its FOOTER entry (below). The
// header is a curated subset of the pages: tests/navigation.spec.ts checks that every group
// holds at least two links, and that every link resolves.
export type NavLink = { label: string; href: string };
export type NavGroup = { label: string; items: NavLink[] };
export type NavItem = NavLink | NavGroup;
export const isNavGroup = (item: NavItem): item is NavGroup => 'items' in item;

export const NAV: NavItem[] = [
  { label: 'Proof', href: '/proof' },
  {
    label: 'Skills & checks',
    items: [
      { label: 'Skills', href: '/skills' },
      { label: 'Checks', href: '/checks' },
      { label: 'SEO Checklist', href: '/ai-website-seo-checklist' },
    ],
  },
  {
    label: 'Technology',
    items: [
      { label: 'What It Runs On', href: '/what-it-runs-on' },
      { label: 'Security', href: '/security' },
    ],
  },
  {
    label: 'For your site',
    items: [
      { label: 'Existing Sites', href: '/established-sites' },
      { label: 'From WordPress', href: '/from-wordpress' },
    ],
  },
  { label: 'Quickstart', href: '/start' },
];

// Every link in NAV, the groups' links included, in order.
export const NAV_LINKS: NavLink[] = NAV.flatMap((item) => (isNavGroup(item) ? item.items : [item]));

// Footer navigation, in labelled columns, in order. Every page appears once, apart from the home
// page, and GitHub is the one link that leaves the site. A page's pull request adds its own entry
// here; header places are not part of that (the header is a curated subset). Like NAV, link only
// to pages that exist: tests/navigation.spec.ts rejects a dead target, and its footer test
// rejects an indexable page other than the home page (one in tests/_helpers.ts PAGES) that is
// left out.
export const FOOTER: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: 'Toolkit',
    links: [
      { label: 'Skills', href: '/skills' },
      { label: 'Checks', href: '/checks' },
      { label: 'SEO checklist', href: '/ai-website-seo-checklist' },
      { label: 'Quickstart', href: '/start' },
      { label: 'Roadmap', href: '/roadmap' },
      { label: 'GitHub', href: SITE.repo },
    ],
  },
  {
    heading: 'Why Croftweaver',
    links: [
      { label: 'Why', href: '/why' },
      { label: 'Alternatives', href: '/compare' },
      { label: 'Positioning', href: '/positioning' },
      { label: 'Proof', href: '/proof' },
      { label: 'More proof', href: '/more-proof' },
      { label: 'Case study', href: '/case-study' },
    ],
  },
  {
    heading: 'Your site',
    links: [
      { label: 'Existing sites', href: '/established-sites' },
      { label: 'From WordPress', href: '/from-wordpress' },
      { label: 'What it runs on', href: '/what-it-runs-on' },
      { label: 'Security', href: '/security' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Support', href: '/support' },
      { label: 'Partner assets', href: '/partner-assets' },
      { label: 'Imprint', href: '/imprint' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Use', href: '/terms' },
    ],
  },
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
  url: 'https://m-squad.com',          // the company's own website; the structured data gives it as the operator's address
  street: 'Schellingstr. 141 Rgb.',
  postcodeCity: '80798 Munich, Germany',
  managingDirector: 'Daniel Melter',
  email: 'hello@croftweaver.com',      // every page that shows it reads it here, through EmailLink
  phone: '+49 179 6913629',            // the imprint shows it, through PhoneNumber
  logo: '/images/logo.png',            // the Croftweaver logo: the software's image in the structured data, not the company's logo
} as const;

// The structured data keeps three things apart (owner decision, 2026-10-13): the operator
// (an Organization, M-Squad GmbH), this website, and the software (Croftweaver, a
// SoftwareSourceCode node on the home page). Croftweaver is a product, not a trading name
// of the company, so the Organization carries no product facts. tests/seo.spec.ts checks it.
//
// The @id of a thing in the structured data: a name in URL form, not a page that has to
// load. Two nodes with the same @id describe the same thing, and other nodes point at it.
// Base.astro and the home page both build them here, so a reference always meets its node.
// Once published an @id must not change.
export const schemaId = (origin: string, thing: 'organization' | 'software' | 'daniel-melter') => `${origin}/#${thing}`;

// External profiles of the OPERATOR (Organization sameAs). Only ship URLs that resolve — a
// broken sameAs is worse than none. Empty from 2026-10-13: the two links that stood here,
// the toolkit's repository and the Builder Lab, identify the software and not the company.
// The repository is the software's codeRepository; the pages link to the Lab. Since
// 2026-10-20 (owner) it holds three profiles of M-Squad itself: the LinkedIn company page, the
// commercial register entry on North Data (HRB 138365, as in the imprint) and the Wikidata item.
// All three are in the Organization node on https://m-squad.com (its sameAs), so the company
// names them itself. Loaded in a browser on 2026-10-20: each shows M-Squad GmbH.
export const SAME_AS: string[] = [
  'https://www.linkedin.com/company/m-squad-gmbh/',
  'https://www.northdata.de/M-Squad%20GmbH,%20München/HRB%20138365',
  'https://www.wikidata.org/wiki/Q141270739',
];

// Topics the operator is authoritative on (Organization knowsAbout).
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
// the script; tests/check_analytics_gate.sh checks both against this file and pins the
// script address. Base.astro
// writes two tags: the script, and the short stub that calls plausible.init(); without
// the stub the script never starts.
export const ANALYTICS = {
  enabled: process.env.CF_PAGES_BRANCH === PROD_BRANCH,
  scriptHost: 'https://analytics.m-squad.com',
  scriptId: 'pa--pMhz1-dKjwaTf3D6ArFS',
} as const;
