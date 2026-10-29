// The test suites every Croftweaver site ships with, described once for the site's copy.
// The list must match the test files under tests/ one to one: a suite without an entry
// here, or an entry without a suite, fails the build. A count in copy is rendered from
// SUITE_COUNT, never typed (CONTENT_GUIDE.md, honesty rules).
import versionFile from '../../tests/TESTS-VERSION?raw';

export const SUITE_GROUPS = [
  { id: 'people', title: 'People can use it' },
  { id: 'search', title: 'Search and AI can read it' },
  { id: 'message', title: 'It says what you mean' },
  { id: 'publish', title: 'It is safe to publish' },
] as const;

type GroupId = (typeof SUITE_GROUPS)[number]['id'];

// `file` is the test file's path under tests/ without its suffix (".spec.ts"). `checks`,
// `example` (a failure) and `limit` (what a pass does not prove) are shown on /checks;
// the home page shows only the number of suites. Each must say what the spec asserts and no more.
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
    checks: 'Every internal link to a section lands on a real section.',
    example: 'An internal link to a section fails when no element on the target page has that id.',
    limit: 'It cannot tell whether the section is the one you meant. Section links into other sites, and into files such as PDFs, are skipped.',
  },
  {
    file: 'images', group: 'people', name: 'Images',
    checks: 'A modern format, fixed dimensions, an alt text and a loading choice for every image.',
    example: 'A JPEG with no modern format beside it and no width and height fails on two counts: the format, and the missing dimensions.',
    limit: 'An empty alt text passes, because a decorative image needs one. It cannot tell whether a description fits the picture.',
  },
  {
    file: 'phone-images', group: 'people', name: 'Phone images',
    checks: 'Each page loads as a phone screen and scrolls to the end. A photo or other raster image the page downloads fails when it is more than 3.3 times as wide as it shows (three times, with a 10% allowance) and a copy that wide would save an estimated 4 KiB or more, or when it is downloaded but never shown and is 4 KiB or more.',
    example: 'A photo 1600 pixels wide, shown 372 pixels wide on a phone, fails: a phone uses at most 1228 pixels of it, and a copy that wide saves an estimated 26 KB.',
    limit: 'It measures one phone size, in one browser, Chromium. SVG files are not judged, nor images used only as borders, cursors or shapes, and the saving is an estimate. It does not judge how sharp an image looks or which file format it uses.',
  },
  {
    file: 'tables', group: 'people', name: 'Tables',
    checks: 'Every table on every page uses the shared table style. On a phone a table of sentences stacks into labelled rows and a table of numbers fits the screen; on a wider screen it is a table again, with no word broken across lines. A test table of each kind also runs on the home page, in light and dark.',
    example: 'A table of sentences that makes a phone scroll sideways at 320 px fails.',
    limit: 'It measures in one browser, Chromium. Safari and screen readers such as VoiceOver are not checked, and it cannot see a hyphen, only the setting that allows one.',
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
    limit: 'One link from a page that is itself reachable is enough to pass. Whether a page is linked from the right places is a judgment for a review.',
  },
  {
    file: 'positioning', group: 'message', name: 'Positioning',
    checks: 'The term a page stands for appears where the page’s rule says it must, normally in its title, its description and its opening.',
    example: 'A rewrite that drops a required term from the page title fails.',
    limit: 'It proves the term is present, not that the positioning is good. A page with no declared term only raises a warning.',
  },
  {
    file: 'tone', group: 'message', name: 'Tone',
    checks: 'No em dashes, no common contractions and no listed buzzwords, in copy and metadata. Quotations are exempt.',
    example: 'A headline with a common contraction fails. So does an em dash outside a quotation.',
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
    file: 'placeholders', group: 'publish', name: 'Placeholders',
    checks: 'No unfilled slot, filler text or note from the author in what a page serves: its copy, its metadata, the labels and alt texts a visitor meets, its structured data, and the web manifest.',
    example: 'A page that still carries an empty slot in square brackets fails. So does a description left as filler text.',
    limit: 'It knows a fixed set of shapes, chosen so that it rarely flags real copy, so a leftover in another shape passes. It does not read the 404 page, llms.txt, PDFs, text inside images or text that shows only when JavaScript is off.',
  },
  {
    file: 'privacy-host', group: 'publish', name: 'Privacy host',
    checks: 'The analytics host the privacy page names is the host the site loads its analytics from.',
    example: 'A privacy page that names one analytics host while the site loads its analytics from another fails.',
    limit: 'It reads only the host the page marks. A page with no mark passes without being checked, so this site keeps a separate test that a mark is present. It does not judge the wording around the host.',
  },
  {
    file: 'middleware', group: 'publish', name: 'Preview handling',
    checks: 'Preview addresses ask search engines not to index them.',
    example: 'A change that lets a preview address answer without the noindex header fails.',
    limit: 'It calls the function directly, so it does not prove that the hosting account runs it. A noindex header also does not stop every AI crawler from citing a preview address.',
  },
  {
    file: 'served-build', group: 'publish', name: 'Own build',
    checks: 'The server the tests run against serves this copy of the site, from its own build.',
    example: 'When another copy of the site on the same computer takes the test port during the build, the run fails instead of testing that copy.',
    limit: 'It compares one marker file, written fresh for each test build. Two runs in the same folder share one build, so it cannot tell them apart.',
  },
];

// The glob is resolved from the project root at build time, whatever directory the
// build was started from. It must find every file Playwright runs under tests/, or that
// suite escapes the check below and the count. playwright.config.ts leaves testMatch
// unset, so Playwright uses its default, `**/*.@(spec|test).?(c|m)[jt]s?(x)`: twelve
// extensions at any folder depth, hidden folders included, never inside node_modules,
// the name in any case but the extension in lower case only (foo.SPEC.ts runs,
// foo.spec.TS does not). `?raw` keeps the files from being bundled or run. A suite's
// id is its path under tests/ without the suffix.
const testFiles = Object.keys(
  import.meta.glob(
    '/tests/**/*.{spec,test}.{js,ts,jsx,tsx,cjs,cts,cjsx,ctsx,mjs,mts,mjsx,mtsx}',
    { query: '?raw', caseSensitive: false, exhaustive: true },
  ),
)
  // The extension in lower case; node_modules spelled exactly so (Playwright compares
  // the folder name as is, a negative glob here would ignore case).
  .filter((path) => /\.[a-z]+$/.test(path) && !path.includes('/node_modules/'))
  .map((path) => path.replace(/^\/tests\//, ''))
  .sort();
const idOf = (file: string) => file.replace(/\.(spec|test)\.[^.]+$/i, '');
const onDisk = testFiles.map(idOf);
// The file behind each suite id, for pages that name it.
export const SUITE_FILES: Record<string, string> = Object.fromEntries(testFiles.map((f) => [idOf(f), f]));
const described = SUITES.map((s) => s.file).sort();
const undescribed = testFiles.filter((f) => !described.includes(idOf(f)));
const stale = described.filter((f) => !onDisk.includes(f));
const twoFiles = onDisk.filter((f, i) => onDisk.indexOf(f) !== i);
if (undescribed.length || stale.length || twoFiles.length || new Set(described).size !== described.length) {
  throw new Error(
    'src/data/suites.ts does not match the test files under tests/. ' +
      `Suites without a description: [${undescribed.join(', ')}]. ` +
      `Descriptions without a suite: [${stale.join(', ')}]. ` +
      `Suites with more than one file: [${twoFiles.join(', ')}]. ` +
      'Describe each suite exactly once.',
  );
}

export const SUITE_COUNT = onDisk.length;

// Which toolkit template these suites were copied from (tests/TESTS-VERSION).
export const SUITES_VERSION = {
  commit: versionFile.match(/^suite_commit:\s*(\S+)/m)?.[1] ?? '',
  copied: versionFile.match(/^copied:\s*(\S+)/m)?.[1] ?? '',
};
// A real commit id and a real calendar date (2026-02-31 must not pass as "3 March").
const isCommit = (c: string) => /^[0-9a-f]{40}$/.test(c);
const isRealDate = (d: string) => {
  const t = new Date(`${d}T00:00:00Z`);
  return /^\d{4}-\d{2}-\d{2}$/.test(d) && !Number.isNaN(t.getTime()) && t.toISOString().slice(0, 10) === d;
};
if (!isCommit(SUITES_VERSION.commit) || !isRealDate(SUITES_VERSION.copied)) {
  throw new Error('tests/TESTS-VERSION needs a 40-character suite_commit and a real copied date (YYYY-MM-DD).');
}

// A suite taken from the toolkit ahead of a release, so not part of suite_commit:
// "added: <file under tests/> <40-character commit> <YYYY-MM-DD>", one line each. /checks names its source.
export const SUITES_ADDED = [...versionFile.matchAll(/^[ \t]*added:[ \t]*(.*)$/gm)].map((m) => {
  const fields = m[1].trim().split(/\s+/);
  const [file, commit, copied] = fields.length === 3 ? fields : [];
  const suite = SUITES.find((s) => SUITE_FILES[s.file] === file);
  if (!suite || !isCommit(commit ?? '') || !isRealDate(copied ?? '')) {
    throw new Error(`tests/TESTS-VERSION: "added: ${m[1]}" needs three fields: a test file this site has, a 40-character commit and a real date.`);
  }
  return { name: suite.name, commit, copied };
});
