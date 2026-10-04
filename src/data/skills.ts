// The skills in the toolkit, by the stage of a site's life they serve (the same four
// stages as the diagram on the home page). One line each, in plain words, taken from
// the skill's own description in the toolkit (skills/<name>/SKILL.md).
// This list describes ONE toolkit release. When the toolkit ships a new release,
// update RELEASE and the list together; the site cannot check the toolkit at build time.
export const RELEASE = { version: '0.29', iso: '2026-09-29', label: '29 September 2026' } as const;

export const STAGES = [
  { id: 'build', title: 'Build', intro: 'From a brief to a finished site.' },
  { id: 'verify', title: 'Verify', intro: 'Tests first, then reviews that read what a test cannot.' },
  { id: 'launch', title: 'Launch', intro: 'Getting the site in front of search engines, and ready for a team.' },
  { id: 'grow', title: 'Grow', intro: 'Reading real data and acting on it.' },
] as const;

type StageId = (typeof STAGES)[number]['id'];

// `more` links a skill to the page that explains it.
export const SKILLS: { name: string; stage: StageId; does: string; optional?: true; more?: string }[] = [
  { name: 'new-website', stage: 'build', does: 'Runs the whole build: an interview of six questions, the project with its tests, then the other skills in order.' },
  { name: 'website-positioning', stage: 'build', does: 'Works out what you offer, for whom and in which market category, before any copy is written.', more: '/positioning' },
  { name: 'customer-research', stage: 'build', does: 'Collects and analyses what customers say, so the positioning rests on their words.' },
  { name: 'website-content-guide', stage: 'build', does: 'Sets the tone of voice and the trust signals that every page follows.' },
  { name: 'website-story', stage: 'build', optional: true, does: 'Tells the home page as the story of your visitor, in seven sections.' },
  { name: 'copywriting', stage: 'build', does: 'Writes and rewrites page copy: headlines, calls to action, whole pages.' },
  { name: 'site-architecture', stage: 'build', does: 'Plans pages, navigation, addresses and internal links.' },
  { name: 'website-design-system', stage: 'build', does: 'Sets the visual standards: responsive images, dark mode, contrast in both themes.' },
  { name: 'image', stage: 'build', does: 'Creates and optimizes images.' },
  { name: 'website-seo-geo', stage: 'build', does: 'The contract for every page head: title and description limits, share tags, canonical address, structured data, llms.txt.' },
  { name: 'schema-markup', stage: 'build', does: 'Adds and fixes structured data (schema.org JSON-LD).' },
  { name: 'og-images', stage: 'build', does: 'Generates a share card for every page.' },
  { name: 'website-testimonials', stage: 'build', optional: true, does: 'For a site with testimonials: shows them on the page and encodes them as review data, from one source.' },
  { name: 'website-motion', stage: 'build', optional: true, does: 'Adds two restrained motion effects, and respects visitors who turn motion off.' },
  { name: 'astro-i18n-setup', stage: 'build', optional: true, does: 'Makes the site multilingual: routing, language tags, a language switcher, tests per language.' },
  { name: 'keystatic-setup', stage: 'build', optional: true, does: 'Adds an editor (Keystatic) for people who do not edit files.' },
  { name: 'website-permissions', stage: 'build', does: 'Cuts permission prompts in the routine build loop and keeps destructive actions gated.' },

  { name: 'website-qa', stage: 'verify', does: 'The gate before launch: run the tests, fix until green, then check speed.' },
  { name: 'website-review', stage: 'verify', does: 'A review in two passes: bugs first, then consistency across files.' },
  { name: 'double-knuth', stage: 'verify', does: 'The same two-pass review for any repository or set of files.' },
  { name: 'independent-review', stage: 'verify', does: 'Sends a plan or a change to independent AI models for a second opinion.' },
  { name: 'website-positioning-check', stage: 'verify', optional: true, does: 'A quick look from outside: can a visitor tell what is on offer, for whom, and why to believe it?' },
  { name: 'seo-audit', stage: 'verify', does: 'Audits a site for technical and on-page SEO problems.' },
  { name: 'internal-link-audit', stage: 'verify', does: 'Finds pages that are orphaned, thinly linked or buried, and suggests where to link.' },
  { name: 'outgoing-link-audit', stage: 'verify', does: 'Checks every link to another site: alive, redirected, rebranded or dead.' },

  { name: 'search-console-setup', stage: 'launch', does: 'Registers the live site with Google Search Console and Bing, submits the sitemap, turns on IndexNow.' },
  { name: 'business-listings-setup', stage: 'launch', optional: true, does: 'For a business with listings: claims Google Business Profile, Bing Places and directory entries, and checks that the profile links resolve.' },
  { name: 'website-team-setup', stage: 'launch', optional: true, does: 'Readies the repository for several people and assistants: collaborators, a rule that changes arrive as pull requests, automatic checks, previews.' },

  { name: 'search-console-insights', stage: 'grow', does: 'Reads your Search Console data: where you rank, what sits just below the first page, which pages are seen but not clicked. Also runs the optional weekly AI check.' },
  { name: 'ai-seo', stage: 'grow', does: 'Improves pages so that AI assistants can read and cite them.' },
  { name: 'seo-reposition', stage: 'grow', does: 'Repositions a live site whose category wording is not ranking.' },
];

const names = SKILLS.map((s) => s.name);
if (new Set(names).size !== names.length) throw new Error('src/data/skills.ts lists a skill twice.');

export const SKILL_COUNT = SKILLS.length;

// What the three most recent releases added (from the toolkit's release notes).
export const RECENT = [
  { version: '0.29', label: '29 September 2026', text: 'One prepaid key covers the weekly AI check for four assistants, and every run shows what it cost. Measured on 26 September 2026 through OpenRouter, a full weekly check for one site (42 questions) cost 0.72 US dollars, before the fee for topping up credit. Prices change.' },
  { version: '0.28', label: '27 September 2026', text: 'A report page on how people find you on Google: week by week, up to 16 months back, with the searches just below the first page and the pages seen but rarely clicked. It stays on your own computer.' },
  { version: '0.27', label: '27 September 2026', text: 'An optional story layer for the home page, the weekly check of whether AI assistants name you, a report on it that reads in plain words, and a guided setup for teams.' },
] as const;
