// The checklist on /ai-website-seo-checklist: eight things to check on a site an AI assistant built, the
// suite that covers each, what happened when we broke it, and what a pass does not prove.
// Plan and proof: the private hub's vibe-coded-seo/PAGE-PLAN.md and RED-RUNS-2026-10-22.md.
//
// Every "what happened" cell is something we saw, on 22 October 2026, in a copy of the starter at
// toolkit version 0.32: we made one edit, ran the suite that covers it, and wrote down what failed.
// The page prints no failure message word for word: several carry a long dash or a contraction,
// which tests/tone.spec.ts rejects in body text.
//
// Two guards run when the site builds, so the page cannot go on describing tests that changed:
//  1. the suites the rows name must exist, and must be among the four the breaks covered;
//  2. the suite copy named in tests/TESTS-VERSION must be the toolkit commit whose template specs
//     the breaks were run against. If the site's suites are copied from a newer toolkit commit, run
//     the breaks again (they are listed on the page), then change RED_RUNS.suiteCommit.
// Not guarded: this site's own copies of seo, images and navigation have assertions the toolkit
// template lacks, so a hash of them would trip on unrelated edits and say nothing about the
// template the page describes. The suite names, group and file come from src/data/suites.ts, so a
// rename there reaches this page.
import { SUITES, SUITE_FILES, SUITES_VERSION } from './suites';

export const RED_RUNS = {
  toolkit: '0.32',
  iso: '2026-10-22',
  label: '22 October 2026',
  // The toolkit commit named in tests/TESTS-VERSION. Its template specs for the four suites below
  // are byte-identical to the v0.32 ones the breaks were run against (checked 2026-10-22).
  suiteCommit: '0597a282412eeae9461e7e95efb009ca218a8457',
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
      'A canonical address on another host turned the suite red on every page, with a message that it must be the full production address of that page. With the canonical link removed the suite also failed, but by waiting 30 seconds for a link that was not there and timing out, with no message about the canonical.',
    limit: 'That the address is the page’s own production address, not that it is the address you want search engines to prefer.',
  },
  {
    check: 'One main heading',
    suites: ['seo'],
    broke: 'A second main heading on a page turned the suite red for that page.',
    limit: 'It counts main headings. It does not check the order of the headings below them, and no test here looks for hidden headings.',
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
      'Links written relative to the current page are not followed, and links to other sites are not checked. A section link can exist and still point at the wrong section.',
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
      'Replacing the rule that allows everything with one that blocks everything turned the suite red. Adding the blocking rule beside the allowing one did not: when both apply, the allowing rule wins, and so does the check.',
    limit:
      'It reads the two common whole-site rules, a single slash and a slash with an asterisk. Other ways of closing a site are not checked, and single pages are not tested.',
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
  'That a page’s text is in the HTML as served. A Croftweaver site is built as plain pages, so it is by default. The only checks that read the served HTML are the section ids and the email link.',
  'Speed on each change. Page speed is measured by hand, with PageSpeed Insights.',
  'Hidden headings.',
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
