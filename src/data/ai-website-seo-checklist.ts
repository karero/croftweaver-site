// The checklist on /ai-website-seo-checklist: eight things to check on a site an AI assistant built, the
// suite that covers each, what happened when we broke it, and what a pass does not prove.
// The breaks, the commands and what failed: docs/ai-website-seo-checklist-breaks.md.
//
// Every "what happened" cell is something we saw, on 25 October 2026 (and the same on 22 October), in a copy of the starter at
// toolkit version 0.33: we made one edit, ran the suite that covers it, and wrote down what failed.
// The page prints no failure message word for word: several carry a long dash or a contraction,
// which tests/tone.spec.ts rejects in body text.
//
// Two guards run when the site builds. They check inventory and provenance, not what the tests assert:
//  1. the suites the rows name must exist, and must be among the four the breaks covered;
//  2. the suite copy named in tests/TESTS-VERSION must be the toolkit commit whose template specs
//     the breaks were run against. If the site's suites are copied from a newer toolkit commit, run
//     the breaks again (they are listed on the page), then change RED_RUNS.suiteCommit.
// Not guarded: edits to the specs, what their assertions say, and new toolkit releases. This site's
// own copies of seo, images and navigation already have assertions the toolkit template lacks, so a
// hash of them would trip on unrelated edits and say nothing about the template the page
// describes. When a release changes the template tests, run the breaks again before merging. The suite names, group and file come from src/data/suites.ts, so a
// rename there reaches this page.
import { SUITES, SUITE_FILES, SUITES_VERSION } from './suites';

export const RED_RUNS = {
  toolkit: '0.33',
  node: '26',
  nodeStarterAsks: '24',
  iso: '2026-10-25',
  label: '25 October 2026',
  // The toolkit commit named in tests/TESTS-VERSION: v0.34 (99b72e10). The breaks ran on v0.33
  // (2026-10-25); at v0.34 the tests they use are unchanged (seo.spec.ts only gained the generator-tag
  // test), and the baseline, T, C2 and break 15 were rerun there on 2026-10-29 (the breaks notes).
  suiteCommit: '99b72e10d765ad0925b4598a7430d604b1d2c244',
} as const;

const COVERED = ['seo', 'images', 'navigation', 'anchors'] as const;

export type CheckRow = {
  check: string;
  suites: (typeof COVERED)[number][];
  broke: string;
  limit: string;
};

export const CHECKS: CheckRow[] = [
  {
    check: 'Title and description length',
    suites: ['seo'],
    broke:
      'A page title of 63 characters, a description of 170 and one of 100 each turned the suite red, and the message gave the limit: 60 characters for the whole title, 120 to 160 for the description.',
    limit: 'Length, not quality. The words can pass and still be poor.',
  },
  {
    check: 'Canonical address',
    suites: ['seo'],
    broke:
      'A canonical address on another host turned the suite red on every page, with a message that it must be the full production address of that page. With the canonical link removed the suite also failed, but by waiting 30 seconds for a link that was not there and timing out, with no message that the canonical is missing; the log only names the link it waited for.',
    limit: 'That this is the address you want search engines to prefer. The suite checks only that it is the page’s own production address.',
  },
  {
    check: 'One main heading',
    suites: ['seo'],
    broke: 'A second main heading on a page turned the suite red for that page.',
    limit: 'It counts main headings, hidden ones included. The accessibility suite checks heading order through axe’s best-practice rules. Nothing looks for hidden h2 or h3 headings.',
  },
  {
    check: 'Images: alt text, width and height, format, loading',
    suites: ['images'],
    broke:
      'An image without alt text, one without width and height, one as a JPEG and one with no loading setting each turned the suite red, and the message named the image and the missing part.',
    limit:
      'The format check reads the file name, not the file. An empty alt text passes, because a decorative image needs one, and no test can tell whether a description fits the picture.',
  },
  {
    check: 'Links to pages and to sections',
    suites: ['navigation', 'anchors'],
    broke:
      'A link to a page that does not exist turned the navigation suite red, and the message reported the 404. A link to a section that does not exist turned the anchors suite red.',
    limit:
      'The navigation suite does not follow links to pages written relative to the current page, and does not check links to other sites. The anchors suite does follow relative section links, but skips section links into other sites and into files such as PDFs. A section link can exist and still point at the wrong section.',
  },
  {
    check: 'The sitemap matches the pages',
    suites: ['seo'],
    broke:
      'A new page that was not added to the site’s list of pages turned the suite red: the sitemap and the list disagreed.',
    limit: 'It compares two lists the site keeps. It does not check that Google has fetched the sitemap.',
  },
  {
    check: 'robots.txt does not close the site',
    suites: ['seo'],
    broke:
      'Replacing the rule that allows everything with one that blocks everything turned the suite red. Adding the same blocking rule beside the allowing one did not: when an allow and a block match equally well, the allow wins, and so does the check.',
    limit:
      'It reads the two common whole-site rules, a single slash and a slash with an asterisk, and the longer pattern wins, as RFC 9309 says: the suite’s own unit cases show a longer block beside an allow is caught. Only six named search crawlers are checked. Other ways of closing a site are not checked, and single pages are not tested.',
  },
  {
    check: 'Hreflang entries, for translated pages only',
    suites: ['seo'],
    broke: 'Two entries with the same language code in one page’s set turned the suite red.',
    limit:
      'It applies only to translated twin pages. A one-language site needs no hreflang, and this site has none, so the test does nothing here.',
  },
];

const NUMBER_WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
export const CHECK_COUNT_WORD = NUMBER_WORDS[CHECKS.length] ?? String(CHECKS.length);

// What the starter's tests do not look at (read in the test sources at v0.32, 22 October 2026).
export const NOT_COVERED = [
  'That a page’s text is in the HTML as served. A Croftweaver site is built as plain pages, so it is by default. The email suite fetches the served HTML of every page, and the anchors suite does so for a link target outside the page list. None checks that a page’s text is there.',
  'Speed on each change. Page speed is measured by hand, with PageSpeed Insights.',
  'Hidden h2 and h3 headings.',
  'Whether Google has found, indexed or ranked a page.',
];

export const QUESTIONS: { q: string; a: string }[] = [
  {
    q: 'Will this make my site rank?',
    a: '<p>No promise. These checks catch mistakes that can keep a page from being found or read. They say nothing about where a page ranks. <a href="/checks">The checks page</a> says what each suite proves and what it does not.</p>',
  },
  {
    q: 'Are llms.txt and structured data worth it?',
    a: '<p>Croftweaver builds both and tests that they are in place and that the structured data parses. Whether a search engine or an assistant uses them is not shown on this page. The report of Mueller’s 2025 review says Google does not use an llms.txt file.</p>',
  },
  {
    q: 'Do I need Croftweaver to use this checklist?',
    a: '<p>No. The list is free to use on any site. What Croftweaver adds is the tests: they come with every site it builds.</p>',
  },
  {
    q: 'Where do I start?',
    a: '<p>With <a href="/start">the quickstart</a>, or, if your site is live already, with <a href="/established-sites">Croftweaver for established sites</a>.</p>',
  },
];

// ── Guards (run when the site builds) ────────────────────────────────────────────────────────────
for (const row of CHECKS) {
  for (const id of row.suites) {
    if (!SUITES.some((s) => s.file === id) || !(id in SUITE_FILES)) {
      throw new Error(`src/data/ai-website-seo-checklist.ts: the row "${row.check}" names the suite "${id}", which is not in src/data/suites.ts or has no file under tests/.`);
    }
    if (!(COVERED as readonly string[]).includes(id)) {
      throw new Error(`src/data/ai-website-seo-checklist.ts: the row "${row.check}" names the suite "${id}", which the breaks did not cover. Run a break for it, then add it to COVERED.`);
    }
  }
}

if (SUITES_VERSION.commit !== RED_RUNS.suiteCommit) {
  throw new Error(
    `src/data/ai-website-seo-checklist.ts: the checklist was checked against suite copy ${RED_RUNS.suiteCommit.slice(0, 7)}, but tests/TESTS-VERSION now names ${SUITES_VERSION.commit.slice(0, 7)}. ` +
      'Run the breaks again against the new copy, then change RED_RUNS.suiteCommit.',
  );
}

export const checkedSuites = (row: CheckRow) =>
  row.suites.map((id) => {
    const s = SUITES.find((x) => x.file === id)!;
    return { name: s.name, group: s.group };
  });
