<!--
  STORY.md — the home page told as the visitor's story. Optional layer, adopted for the
  home page on 2026-10-08 (owner decision). Derived from POSITIONING.md, which is the
  source of truth for WHAT is claimed (target customer, competitive alternatives,
  unique attributes and proof, value, market category). This file decides only HOW the
  home page narrates it. On any conflict POSITIONING.md wins and this file is corrected.
  Do not restate the positioning here; cite it.
  Owned by the website-story skill. Inspired by Donald Miller's StoryBrand framework,
  in this suite's own words. Croftweaver is not affiliated with Donald Miller, and he
  does not endorse it. StoryBrand is a trademark of its owner.
-->
# Croftweaver — story layer

## Source map (every line below cites POSITIONING.md)

| Story element | From POSITIONING.md |
|---|---|
| Character + want | §4 Target customer and "why they care most" |
| Problem and villain | §1 the status quo; §4 "why they care most"; "Routes not chosen" (agencies are not the villain) |
| Guide: empathy and authority | §4 (the situation); §2 and §3 (proof) |
| Plan | §2 how the attributes are delivered |
| Calls to action | owner decision: "Get Croftweaver on GitHub" |
| Stakes | §1 the status quo; §4 |
| Success | §3 value rows |
| Market category | §5, unchanged |
| One-liner and controlling idea | the positioning statement and the core term "website skills"; the reference line "Stop waiting on someone else for every change." |

## 1. Character (the hero is the visitor)

- **Who:** founders, community organizers, experts and small teams who need their website
  to be found, and the people who build sites for them (§4).
- **What they want (one thing):** a site that people find on Google and in AI answers,
  and that they can change without waiting on anyone (§4, §2).

## 2. Problem

- **Villain:** the situation, never a named agency: an old site, or none, and someone
  else to ask for every update, with a brief, a wait and often a bill each time (§1, §4).
  Agencies are also customers, and the home page lists small studio and agency sites as a
  good fit.
- **External:** the site is old or missing, every update waits on someone else, and the
  search and AI basics are skipped when a site goes live fast or slip after an edit (§1,
  §4).
- **Internal:** you cannot tell what has slipped, and changes pile up.
- **Philosophical:** it is your site; changing a sentence should not need a brief and a
  wait.

## 3. Guide (the brand)

- **Empathy:** the search and AI work is the part that gets skipped when a site has to
  go live fast (§4, restated).
- **Authority (proof from §3 only):** three sites built with Croftweaver score 99 to 100
  in Google's PageSpeed Insights (measured 4 October 2026); genai-wednesday.de, relaunched
  on 27 March 2026, went from 3 clicks from Google per 28 days to a best 99. Both are on
  the home page's proof strip and on `/proof`, with their limits.

## 4. Plan

**Title:** Three steps to a site people can find

1. **Describe** → your assistant works out what the site says before it writes a word
   (§2: the pipeline starts with positioning; `/start`: six questions).
2. **Build and check** → pages with the search and AI work done by default, and the test
   suites check every change by default (§2, §3).
3. **Publish and keep improving** → free hosting you control, and once Search Console is
   connected your own data points to the next edit, week by week (§2).

- **Promise:** none. The wording rule forbids a ranking guarantee (POSITIONING.md,
  wording rule 1); the proof strip carries the evidence.
- **Rebuilding an old site:** the old pages are the brief. There is no automatic import
  yet (`/roadmap`).

## 5. Calls to action

- **Direct CTA (one label, verbatim everywhere):** `Get Croftweaver on GitHub` →
  `SITE.repo`. Used in the header, after the plan and in the sign-off, as on the other pages.
- **Transitional CTA (lead generator):** none. The site has no email-gated guide, and
  none is invented.

## 6. Stakes (what stays wrong if nothing changes)

- Every update waits on someone else, so changes pile up and the site falls behind (§1).
- Without a check after each edit, a site slips: a description goes missing, a link
  breaks, and nothing tells you (§1).

## 7. Success (life after)

- **You make the changes yourself.** Everyday updates are a conversation with your
  assistant (§3, independence row).
- **Search and AI can read it from the first build** (§3 rows 1 and 2).
- **Nothing slips unnoticed.** The test suites check every change by default, and your
  own search data points to the next edit (§3 rows 3 and 4).

## One-liner (30 words)

> Stop waiting on someone else for every change. Build or rebuild your site with your AI
> assistant and Croftweaver, so people can find it on Google and in AI answers.

Owner-approved 2026-10-08. Opens on the visitor's moment, second person, present tense,
active voice. "Build or rebuild" covers a new site and an old one.

## Controlling idea

> Website skills that help search and AI find your site.

Owner-approved 2026-10-08. It pairs the two channels (search and AI), not a person and a
machine, and narrows the core term "website skills".

## Home page map (seven sections → src/pages/index.astro)

POSITIONING.md's wording rule 2 keeps the proof strip directly under the hero, so it sits
at the end of section 1.

| # | Section | Carries | Direct CTA |
|---|---|---|---|
| 1 | Header | the kicker (positioning term and market category, the first `<p>`), the `<h1>` "Weave websites that rank.", the one-liner, three short outcomes (one per §7 line), then the proof strip. No customer image: the site has none, and none is invented | yes |
| 2 | Stakes | §6, then a one-line pivot to the guide | no |
| 3 | Plan | §4 as an ordered list, and the note on rebuilding | yes |
| 4 | Value stack | the three §7 lines, each a headline and a sentence, each linking to its detail | no |
| 5 | Explanatory paragraph | what Croftweaver is, the guide's empathy, three objections answered from POSITIONING.md only (coding, ranking, cost), a link to `/why` | no |
| 6 | Lead generator | omitted (§5 is blank) | no |
| 7 | Junk drawer | the detail sections (built in, the test suites, the weekly loop, "The site is yours", fit, quickstart), the learning section below, then the sign-off | yes |

## Beyond the seven sections: the learning section

A short section after "The site is yours". It carries a secondary benefit (POSITIONING.md
§3 and §4: a rebuild as a project to learn with), based on the owner's experience with one
team, and stays low on the page and out of the headline, the one-liner and the share card.
The owner approved the passage on 2026-10-08, in the first person, with a byline.

## Not adopted: tests/story.spec.ts

`src/data/suites.ts` counts every file in `tests/` as one of the suites that every
Croftweaver site ships with, and the home page renders that count. The story test is
opt-in, so adding it would make the page claim 13 suites while POSITIONING.md §2 says 12.
The direct CTA, the one-liner and the plan are guarded by review instead.
