// The skills in the toolkit, by the stage of a site's life they serve (the same four
// stages as the diagram on the home page). One line each, in plain words, taken from
// the skill's own description in the toolkit (skills/<name>/SKILL.md).
// This list describes ONE toolkit release, plus any skills added since. When the toolkit
// ships a new release, update RELEASE (with the number of skills it had), the list, RECENT
// and AS_OF together, empty ADDED_SINCE, and change the release line in public/llms.txt
// (tests/llms-coverage.spec.ts fails until it matches). The site cannot check the toolkit at
// build time, but the build stops when the list, the release's skill count and ADDED_SINCE do not add up.
export const RELEASE = { version: '0.32', iso: '2026-10-16', label: '16 October 2026', skills: 37 } as const;
// The skills on the toolkit's main branch that the release above does not have, and the day
// the list was last checked against the toolkit. The page says both (tests/a11y.spec.ts).
export const ADDED_SINCE: readonly string[] = [];
export const AS_OF = { iso: '2026-10-16', label: '16 October 2026' } as const;

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
  { name: 'website-tagline', stage: 'build', optional: true, does: 'Finds the short line under your logo with you, starting from what your business does for its customers.' },
  { name: 'website-story', stage: 'build', optional: true, does: 'Tells the home page as the story of your visitor, in seven sections.' },
  { name: 'copywriting', stage: 'build', does: 'Writes and rewrites page copy: headlines, calls to action, whole pages.' },
  { name: 'site-architecture', stage: 'build', does: 'Plans pages, navigation, addresses and internal links.' },
  { name: 'website-design-system', stage: 'build', does: 'Sets the visual standards: responsive images, dark mode, contrast in both themes.' },
  { name: 'website-brand-kit', stage: 'build', optional: true, does: 'For an owner without colours or a logo: writes the requests for the design tool you like, checks what comes back for contrast in light and dark, then puts it into the site.' },
  { name: 'image', stage: 'build', does: 'Creates and optimizes images.' },
  { name: 'website-seo-geo', stage: 'build', does: 'The contract for every page head: title and description limits, share tags, canonical address, structured data, llms.txt.' },
  { name: 'schema-markup', stage: 'build', does: 'Adds and fixes structured data (schema.org JSON-LD).' },
  { name: 'og-images', stage: 'build', does: 'Generates a share card for every page.' },
  { name: 'website-testimonials', stage: 'build', optional: true, does: 'For a site with testimonials: shows them on the page and encodes them as review data, from one source.' },
  { name: 'website-contact-form', stage: 'build', optional: true, does: 'Adds a contact form that needs no server: the visitor\'s own email program opens with the message ready to send, and the site stores nothing.' },
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
  { name: 'facts-check', stage: 'verify', does: 'Compares the figures on every page of a live site with the facts you approved, and lists the pages that have lost the term their audience gives them.' },
  { name: 'website-scorecard', stage: 'verify', optional: true, does: 'Publishes what the site\'s own tests checked as a dated section on one page. A run with a failing test writes nothing.' },

  { name: 'search-console-setup', stage: 'launch', does: 'Registers the live site with Google Search Console and Bing, submits the sitemap, turns on IndexNow.' },
  { name: 'business-listings-setup', stage: 'launch', optional: true, does: 'For a business with listings: claims Google Business Profile, Bing Places and directory entries, and checks that the profile links resolve.' },
  { name: 'wordpress-inspector', stage: 'launch', optional: true, does: 'For a move from WordPress: counts the old site\'s posts, pages and addresses before the move, then names each old address that is missing on the new site or sent to its home page. It reads only and moves nothing.' },
  { name: 'website-team-setup', stage: 'launch', optional: true, does: 'Readies the repository for several people and assistants: collaborators, a rule that changes arrive as pull requests, automatic checks, previews.' },

  { name: 'search-console-insights', stage: 'grow', does: 'Reads your Search Console data: where you rank, what sits just below the first page, which pages are seen but not clicked. Also runs the optional weekly AI check.' },
  { name: 'ai-seo', stage: 'grow', does: 'Improves pages so that AI assistants can read and cite them.' },
  { name: 'seo-reposition', stage: 'grow', does: 'Repositions a live site whose category wording is not ranking.' },
];

const names = SKILLS.map((s) => s.name);
if (new Set(names).size !== names.length) throw new Error('src/data/skills.ts lists a skill twice.');
for (const n of ADDED_SINCE) if (!names.includes(n)) throw new Error(`src/data/skills.ts: ADDED_SINCE names ${n}, which is not in SKILLS.`);
if (new Set(ADDED_SINCE).size !== ADDED_SINCE.length) throw new Error('src/data/skills.ts: ADDED_SINCE lists a skill twice.');
if (SKILLS.length !== RELEASE.skills + ADDED_SINCE.length) {
  throw new Error(`src/data/skills.ts: SKILLS has ${SKILLS.length} skills, but release ${RELEASE.version} had ${RELEASE.skills} and ADDED_SINCE names ${ADDED_SINCE.length}. Update RELEASE, the list and ADDED_SINCE together.`);
}

export const SKILL_COUNT = SKILLS.length;

// What the three most recent releases added (from the toolkit's release notes).
export const RECENT = [
  { version: '0.32', label: '16 October 2026', text: 'New sites count no visitors until you switch on Plausible, and with it on, your site counts each click on your email address. Of three new helpers, one gets you colours and a logo, one finds the short line under your logo, and one counts what a WordPress site holds before a move. Croftweaver now comes as a plugin for Claude Code and for Codex, and for a site on GitHub your assistant can set up Cloudflare, with your yes before it changes anything.' },
  { version: '0.31', label: '12 October 2026', text: 'The toolkit takes the name Croftweaver. It is the same toolkit under the same licence. The old address on GitHub leads to the new one, and the download is now called croftweaver.zip.' },
  { version: '0.30', label: '11 October 2026', text: 'A contact form that needs no account and no setup, a check that catches an empty slot or leftover filler text on a finished page, and a facts check that reads every page of a live site and shows where a figure no longer matches your list.' },
] as const;
