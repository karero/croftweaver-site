// The test suites every Webcroft site ships with, described once for the site's copy.
// The list must match tests/*.spec.ts one to one: a suite without an entry here, or an
// entry without a suite, fails the build. A count in copy is rendered from SUITE_COUNT,
// never typed (CONTENT_GUIDE.md, honesty rules).
export const SUITE_GROUPS = [
  { id: 'people', title: 'People can use it' },
  { id: 'search', title: 'Search and AI can read it' },
  { id: 'message', title: 'It says what you mean' },
  { id: 'publish', title: 'It is safe to publish' },
] as const;

type GroupId = (typeof SUITE_GROUPS)[number]['id'];

// `file` is the spec file name without ".spec.ts".
export const SUITES: { file: string; group: GroupId; name: string; checks: string }[] = [
  { file: 'a11y', group: 'people', name: 'Accessibility', checks: 'Automated WCAG A and AA checks on every page, in light and dark.' },
  { file: 'navigation', group: 'people', name: 'Navigation', checks: 'Every page loads, and internal links written from the site root resolve.' },
  { file: 'anchors', group: 'people', name: 'Anchors', checks: 'Every link to a section lands on a real section.' },
  { file: 'images', group: 'people', name: 'Images', checks: 'Modern formats, fixed dimensions, alt text.' },
  { file: 'seo', group: 'search', name: 'SEO', checks: 'Title and description lengths, canonical address, one main heading, structured data that parses, a share card of the right size.' },
  { file: 'llms-coverage', group: 'search', name: 'llms.txt coverage', checks: 'Every page is listed for AI assistants, and no listing is stale.' },
  { file: 'orphans', group: 'search', name: 'Orphans', checks: 'Every page can be reached from the home page.' },
  { file: 'positioning', group: 'message', name: 'Positioning', checks: 'The term a page stands for appears in its title, its description and its opening.' },
  { file: 'tone', group: 'message', name: 'Tone', checks: 'No em dashes, no contractions, no words from the buzzword list.' },
  { file: 'email', group: 'publish', name: 'Email', checks: 'No plaintext email address in the served HTML.' },
  { file: 'links', group: 'publish', name: 'Links', checks: 'Domains you have retired never come back.' },
  { file: 'middleware', group: 'publish', name: 'Preview handling', checks: 'Preview addresses ask search engines not to index them.' },
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
