// The test suites every Webcroft site ships with, described once for the site's copy.
// The list must match tests/*.spec.ts one to one: a suite without an entry here, or an
// entry without a suite, fails the build. A count in copy is rendered from SUITE_COUNT,
// never typed (CONTENT_GUIDE.md, honesty rules).
import versionFile from '../../tests/TESTS-VERSION?raw';

export const SUITE_GROUPS = [
  { id: 'people', title: 'People can use it' },
  { id: 'search', title: 'Search and AI can read it' },
  { id: 'message', title: 'It says what you mean' },
  { id: 'publish', title: 'It is safe to publish' },
] as const;

type GroupId = (typeof SUITE_GROUPS)[number]['id'];

// `file` is the spec file name without ".spec.ts". `checks` is shown on the home
// page and on /checks; `example` (a failure) and `limit` (what a pass does not prove)
// on /checks only. Each must say what the spec asserts and no more.
export const SUITES: {
  file: string; group: GroupId; name: string; checks: string; example: string; limit: string;
}[] = [
  {
    file: 'a11y', group: 'people', name: 'Accessibility',
    checks: 'Automated WCAG A and AA checks on every page, in light and dark.',
    example: 'A text colour with too little contrast in the dark theme fails, even when the light theme passes.',
    limit: 'Automated rules catch only part of what makes a page accessible, and the run uses one desktop-size browser. Keyboard use and screen readers still need a person.',
  },
  {
    file: 'navigation', group: 'people', name: 'Navigation',
    checks: 'Every page loads, and internal links written from the site root resolve.',
    example: 'A link to a page that was renamed fails. So does a link that only works through a redirect.',
    limit: 'Links written relative to the current page are not followed, and links to other sites are not checked.',
  },
  {
    file: 'anchors', group: 'people', name: 'Anchors',
    checks: 'Every link to a section lands on a real section.',
    example: 'A link to a section fails when no element on the target page has that id.',
    limit: 'It cannot tell whether the section is the one you meant.',
  },
  {
    file: 'images', group: 'people', name: 'Images',
    checks: 'A modern format, fixed dimensions, an alt text and a loading choice for every image.',
    example: 'A JPEG photo without width and height fails on two counts: the format, and the missing dimensions.',
    limit: 'An empty alt text passes, because a decorative image needs one. It cannot tell whether a description fits the picture.',
  },
  {
    file: 'seo', group: 'search', name: 'SEO',
    checks: 'Title and description lengths, canonical address, one main heading, structured data that parses, a share card of the right size.',
    example: 'A page title of 63 characters fails; the limit is 60.',
    limit: 'It checks form, not quality. Structured data can parse and still describe the wrong thing, and no test here measures rankings.',
  },
  {
    file: 'llms-coverage', group: 'search', name: 'llms.txt coverage',
    checks: 'Every page is listed for AI assistants, and no listing is stale.',
    example: 'A new page that nobody added to llms.txt fails. So does an entry for a page that no longer exists.',
    limit: 'It cannot tell whether the description of a page in llms.txt still matches the page.',
  },
  {
    file: 'orphans', group: 'search', name: 'Orphans',
    checks: 'Every page can be reached from the home page.',
    example: 'A page that sits in the sitemap but is linked from nowhere fails.',
    limit: 'One link is enough to pass. Whether a page is linked from the right places is a judgment for a review.',
  },
  {
    file: 'positioning', group: 'message', name: 'Positioning',
    checks: 'The term a page stands for appears in its title, its description and its opening.',
    example: 'A rewrite that drops the term from the page title fails.',
    limit: 'It proves the term is present, not that the positioning is good. A page with no declared term only raises a warning.',
  },
  {
    file: 'tone', group: 'message', name: 'Tone',
    checks: 'No em dashes, no contractions, no words from the buzzword list.',
    example: 'A headline with a contraction fails. So does an em dash anywhere in the copy.',
    limit: 'The word list is short and fixed. It cannot tell whether a sentence is clear or true.',
  },
  {
    file: 'email', group: 'publish', name: 'Email',
    checks: 'No plaintext email address in the served HTML.',
    example: 'An address typed straight into a page fails. It has to go through the component that hides it.',
    limit: 'It reads the HTML the way a simple scraper does. A scraper that runs the scripts of a page can still recover the address.',
  },
  {
    file: 'links', group: 'publish', name: 'Links',
    checks: 'Domains you have retired never come back.',
    example: 'A link to a domain you moved away from fails, once that domain is on the list.',
    limit: 'The list starts empty and grows by hand. Whether links to other sites still work is a separate audit, not part of this gate.',
  },
  {
    file: 'middleware', group: 'publish', name: 'Preview handling',
    checks: 'Preview addresses ask search engines not to index them.',
    example: 'A change that lets a preview address answer without the noindex header fails.',
    limit: 'It calls the function directly, so it does not prove that the hosting account runs it. A noindex header also does not stop every AI crawler from citing a preview address.',
  },
];

// The glob is resolved from the project root at build time, whatever directory the
// build was started from. `?raw` keeps the spec files from being bundled or run.
const onDisk = Object.keys(import.meta.glob('/tests/*.spec.ts', { query: '?raw' }))
  .map((path) => path.replace(/^.*\//, '').replace(/\.spec\.ts$/, ''))
  .sort();
const described = SUITES.map((s) => s.file).sort();
const undescribed = onDisk.filter((f) => !described.includes(f));
const stale = described.filter((f) => !onDisk.includes(f));
if (undescribed.length || stale.length || new Set(described).size !== described.length) {
  throw new Error(
    'src/data/suites.ts does not match tests/*.spec.ts. ' +
      `Suites without a description: [${undescribed.join(', ')}]. ` +
      `Descriptions without a suite: [${stale.join(', ')}]. ` +
      'Describe each suite exactly once.',
  );
}

export const SUITE_COUNT = onDisk.length;

// Which toolkit template these suites were copied from (tests/TESTS-VERSION).
export const SUITES_VERSION = {
  commit: versionFile.match(/^suite_commit:\s*(\S+)/m)?.[1] ?? '',
  copied: versionFile.match(/^copied:\s*(\S+)/m)?.[1] ?? '',
};
if (!/^[0-9a-f]{40}$/.test(SUITES_VERSION.commit) || !/^\d{4}-\d{2}-\d{2}$/.test(SUITES_VERSION.copied)) {
  throw new Error('tests/TESTS-VERSION is missing or has no suite_commit and copied lines.');
}
