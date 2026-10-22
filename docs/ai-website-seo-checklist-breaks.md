# The breaks behind /ai-website-seo-checklist

Notes for the people and assistants who work on this site. No page serves this file.

The table on https://croftweaver.com/ai-website-seo-checklist says what happened when each check was
broken. This file keeps what was done, so that anyone can repeat it, and so that the breaks can be run
again when the toolkit changes. A row of the table is only as good as its break.

## What was run, and when

- 22 October 2026, on one Mac, with Node v26.12.0 and npm 11.20.0. The starter's `.nvmrc` says 24 and
  its `engines` say at least 22.12, so this was newer than the Node it names; nothing was run on 24.
- The subject is the Croftweaver starter at toolkit tag `v0.32`: the folder
  `skills/new-website/templates/astro` of https://github.com/karero/croftweaver, copied out with
  `git archive v0.32 skills/new-website/templates/astro`, then `npm ci` and `npm test`. The baseline gave
  91 passed and 1 skipped (the skip is the starter's own "no positioning terms declared yet"
  placeholder), on Playwright 1.64.0 from the starter's lockfile. No Cloudflare or GitHub account was
  needed.
- One edit at a time, then the one spec that covers it (`npx playwright test tests/<spec>.spec.ts`),
  then the files put back. A full run took about four minutes on a heavily loaded machine; fifteen of
  them would have taken an hour.
- This site's own copies of the specs are not the starter's. Compared with the `v0.32` template,
  `tests/seo.spec.ts` differs by 224 lines, `tests/images.spec.ts` by 62 and `tests/navigation.spec.ts`
  by 445; `tests/anchors.spec.ts` is identical. `tests/TESTS-VERSION` names toolkit commit `0597a28`,
  and at that commit the template's four specs are byte-identical to the `v0.32` ones. So the table
  describes the starter, and these breaks were not run against this site's copies.

## The breaks

The last column holds, depending on the row, an excerpt of the failing assertion's message, a timeout
diagnostic (run 4), or the summary of a passing run (the controls and the tie). Excerpts are shortened
with "...", with the arrows and the not-equal sign of the original written in ASCII (`->`, `!=`).
Some messages start with a heading line first (the images tests print `image issues on /:`).

| # | Check | The edit | Spec | Failing test | Message |
|---|---|---|---|---|---|
| 1 | Title and description length | home title set so `<title>` is 63 characters | seo | head contract on `/` | `<title> "..." is 63 chars > 60` |
| 2 | same | home description of 170 characters | seo | head contract on `/` | `meta description 170 chars > 160` |
| 3 | same | home description of 100 characters | seo | head contract on `/` | `meta description 100 chars < 120 (wastes SERP space ...)` |
| 4 | Canonical address | `<link rel="canonical">` deleted from `Base.astro` | seo | head contract on every page | a 30 second timeout, not a message: `locator.getAttribute: Test timeout of 30000ms exceeded`, call log `waiting for locator('link[rel="canonical"]')` (`seo.spec.ts:69`) |
| 5 | same | `canonical` built from `https://example.org` in `Base.astro` | seo | head contract on every page | `canonical must be the absolute production URL for this path` |
| 6 | One main heading | a second `<h1>` on the home page | seo | head contract on `/` | `each page must have exactly one <h1>` |
| C1 | control | one good image: alt, width and height, WebP, `loading="lazy"` | images | none | 3 passed |
| 7 | Images | the image without `alt` | images | the images test for `/` | `<img src="/images/t.webp"> has no alt attribute` |
| 8 | same | without `width` and `height` | images | same | `<img src="/images/t.webp"> missing width/height (CLS risk)` |
| 9 | same | as `.jpg` | images | same | `"/images/t.jpg" (via <img src="/images/t.jpg">) is raw JPEG/PNG/GIF ...` |
| 10 | same | without `loading` | images | same | `<img src="/images/t.webp"> has no loading attribute ...` |
| 11 | Links to pages | `<a href="/nope">` on the home page | navigation | home page loads and its links resolve | `internal link /nope returned 404 (expected 200, no redirect hop)` |
| 12 | Links to sections | `<a href="/#nope">` | anchors | every internal anchor points at an id | `dead internal anchor(s): [/] /#nope -> no element with id="nope" on "/"` |
| 13 | The sitemap matches the pages | a new page `src/pages/extra.astro` not added to `PAGES` | seo | sitemap matches PAGES | `sitemap pages != PAGES ...` |
| 14 | robots.txt does not close the site | `Allow: /` replaced by `Disallow: /` | seo | robots.txt stays open | `robots.txt blocks the whole site (Disallow: /) for these search crawlers ...` |
| T | the tie (not a break) | `Disallow: /` added beside `Allow: /` | seo | none | 9 passed: the suite stays green |
| C2 | control | a valid hreflang set on `/`: `en` and `x-default` | seo | none | 9 passed |
| 15 | Hreflang | the set with `en` twice | seo | twin-page hreflang alternates | `/: duplicate hreflang codes in the cluster (en, en, x-default)` |

Edits 7 to 10 add `<img src="/images/t.webp" alt="A test image" width="40" height="40" loading="lazy" />`
to the home page first (control C1), with a one-pixel `t.webp` and `t.jpg` in `public/images/`, and
take one attribute away per run. Several messages carry a long dash or a contraction, which
`tests/tone.spec.ts` rejects in a page's body; that is why the page describes what failed in its own words.

## What the runs showed besides the table

- Run 4 is the one that is red by timeout. The test reads the link with
  `page.locator('link[rel="canonical"]').getAttribute('href')`, which waits for the element, so
  `expect(canonical, 'canonical missing')` is never reached. A build with the link deleted has no
  canonical link in `dist/index.html`, and the other tests in that spec passed in the same run, so the
  machine's load was not the cause. It was not repeated on a calm machine.
- The tie (T) stays green because the guard in `seo.spec.ts` lets an allow win a tie. A longer block
  beside an allow, `Disallow: /*` next to `Allow: /`, is caught by the suite's own unit cases, which
  were read and not run as a break.
- The images suite judges the format by the file name (the `RASTER` pattern on `src`, `srcset` and
  `<source>`), not by the file's bytes. Read in the source, not tried.
- Four first-pass runs (1, 2, 4 and 10) ended in Playwright timeouts while other work kept the
  machine at a load average from 100 to 880. They were repeated with `--workers=1`. 1, 2 and 10 then
  gave real assertion failures; 4 timed out again, for the reason above.

## Running them again

The page names the toolkit version the breaks ran on (`RED_RUNS` in
`src/data/ai-website-seo-checklist.ts`). Run them again, by hand, from the table above, when a new
release changes the template's tests: compare `skills/new-website/templates/astro/tests/` and the
template's `public/robots.txt`, `astro.config.mjs`, `playwright.config.ts` and `package.json` between
the version in `RED_RUNS` and the new release, and if any file differs, run the eighteen lines again.
Then change `RED_RUNS`. The build fails by itself only when `tests/TESTS-VERSION` names a different
toolkit commit than `RED_RUNS.suiteCommit`; it does not see edits to the specs.
