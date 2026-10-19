# Review: Support, Terms of Use and privacy section 6, 2026-10-17

Why: OpenAI's plugin directory asks every listing for a support, a privacy policy and a terms
address. The owner's instructions: support "a page with some blabla and hello@croftweaver.com",
privacy "go for it", terms "refer to MIT license".

Gate: Normal, Codex and GLM 5.3 on melious. 3 rounds, 14 findings (1 BUG, 8 RISKs, 5 NITs),
clean in round 3. Sources given to the reviewers: the toolkit's LICENSE, its
docs/WHAT-THE-SKILLS-RUN.md (short version, network calls, telemetry) and its SECURITY.md.

## Round 1 (335378e): 1 BUG, 5 RISKs, 3 NITs

Nearly all were claims stronger than the sources. Fixed in d30548d by cutting:
- BUG: "with your own account or key" for every outside call; some calls only read public
  pages or download packages. Now: many calls use your own account or key, others read
  public pages or download packages.
- RISK: "only when you ask for it"; in Claude Code routine commands run without asking. Cut.
- RISK (both seats): GitHub and npm "show us only totals"; not in the sources. Cut.
- RISK: terms section 3 promised ownership of what the skills build and gave the user
  responsibility. Now it says only that we neither see nor check what the skills build.
- RISK: "only the maintainers see the report until it is fixed". Cut.
- NITs: "send us nothing" against the badge fetch; the badge attribution; an imperative on
  the terms page. Fixed.

## Round 2 (d30548d): 3 RISKs, 2 NITs

Fixed in 06ad27b and f7117ea:
- RISK (both seats): the reworded badge sentence claimed Plausible counts the visit as coming
  through the badge; not in the sources. Cut to "the visit is counted on this website as
  described in section 3".
- RISK: section 6 did not say that Astro and Wrangler send anonymous usage data to their own
  makers. Added, from the toolkit's telemetry section.
- NITs: the installer does not run inside the assistant; a sentence starting "Which". Fixed.

## Round 3 (f7117ea): clean

No BUG, RISK or NIT from either seat.

## Test records

`npm ci`, `npm run check`, `npm run build`, `npx playwright test`: 0 errors, 296 passed, none
skipped (round 1); after each fix round `npm run check && npm run build && npx playwright
test`: 296 passed.

## Open, for the owner (not legal advice)

- Terms: no liability clause under German law beside the licence's "as is"; no governing law.
- A German version of /terms, as already open for /privacy.

## Re-review at High depth, 2026-10-19

Why: privacy and legal texts belong to the High row of `independent-review`; the gate above ran
at Normal, with no fresh-eyes pass, no final full read and no wording pass. Taken over by the
session that shipped the analytics off switch (#336 in the toolkit), on the owner's ask. Artifact:
the PR's own change merged with `main` at `ceedb37` (`7bb9fa6`), with the toolkit's `LICENSE`,
`docs/WHAT-THE-SKILLS-RUN.md` and `SECURITY.md` at its `main` (`400c424`) as sources.

Gate: High. Three rounds, a final full read and a wording pass; 36 findings before merging
duplicates (1 BUG, introduced by round 1's own fix and fixed; none open).

| Round | Head | Seats | Time, tokens | BUG / RISK / NIT |
|---|---|---|---|---|
| 1 | `7bb9fa6` | Codex (config effort), Melious glm-5.3, fresh-eyes Claude Opus | 202 s, 96,343 · 66 s, 20,478 · 226 s, 134,294 | 0 / 8 / 6 |
| 2 | `d260e0a` | same | 247 s, 93,730 · 120 s, 10,443 · 70 s, 102,678 | 1 / 5 / 6 |
| 3 | `0f4dc99` | same | 206 s, 63,851 · 150 s, 9,832 · 90 s, 92,951 | 0 / 3 / 4 |
| final full read | `944a068` | ollama kimi-k3:cloud | 210 s, not recorded | 0 / 1 / 1 |
| wording pass | `944a068` (delta since `0f4dc99`) | Codex | 162 s, 63,255 | 0 / 1 / 0 |

What changed:
- The publisher and the operator are named apart (owner's decision, 2026-10-19): Daniel Melter
  publishes Croftweaver under MIT ("Copyright (c) 2026 Daniel Melter" in its LICENSE);
  `COMPANY.legalName` runs the website. Terms §2: neither the author nor we promise; privacy §6:
  nothing goes to us or to Daniel Melter.
- The skills and plugins run where the assistant runs (own computer, or its maker's servers in the
  cloud); the installer runs where it is started.
- A `skills` command install is also counted by skills.sh (toolkit README 217-218).
- The credit's code is fetched for the text link too; the badge adds its image files.
- Astro and Wrangler send their makers usage data "which the makers describe as anonymous", on by
  default with an opt-out: Astro from `@astrojs/telemetry` (sends unless an environment variable or
  the setting turns it off), Wrangler from `packages/wrangler/telemetry.md` in cloudflare/workers-sdk
  (read 2026-10-19: "non-user identifying", opt out at any time, Cloudflare receives the IP).
- Terms §3 says neither we nor the author see or check what the skills build. Round 1's fix had
  said "nobody checks it", which the toolkit's own checks contradict (round 2's BUG).
- Support: no "on your computer"; for a skills.sh install, the date it was last installed or
  updated. Privacy §7 covers everything the page describes. `/terms` and `/support` are exempt from
  positioning. The README lists the open German-law items. "Last updated" is 19 October 2026 on
  both pages; the comments keep the creation date.

Refuted, with evidence:
- `EmailLink` without `text` renders empty (Melious r1, Kimi): `EmailLink.astro:20` falls back to
  `emailHint(...)`; the email spec passes.
- `THIRD-PARTY-LICENSES.md` may 404: it is on the toolkit's `main`.
- The new pages' `image` prop: the built pages carry `og:image` `/images/og/terms.jpg` and
  `/images/og/support.jpg`.
- The software's no-reporting promise is unsupported (Codex r1, r3 and the wording pass): fresh-eyes
  read `packages/create-croftweaver/index.mjs` (only the GitHub release zip and `SHA256SUMS`), the
  plugin manifests (metadata, no hooks or MCP servers) and every script under `skills/`, `packages/`
  and `scripts/` (none names croftweaver.com). Re-raised three times without new evidence; kept as
  a follow-up: an audit pinned to a release would make it checkable.
- Astro's default (Melious r3): read in `@astrojs/telemetry` in round 1.
- The creation and update dates differ (Kimi): on purpose, as above.

Tests on the merged result: `npm run check` 0 errors; `npx playwright test` 309 passed.

Follow-up for the toolkit: `docs/WHAT-THE-SKILLS-RUN.md` calls the Astro and Wrangler data
"anonymous" as plain fact; Cloudflare says it receives the IP. Worth the same "described as" wording.

Later edit, 2026-10-19 (owner's ask): privacy §6 links "MIT licence" to the toolkit's LICENSE.
Checked by Codex alone on that delta (40 s, 31,113 tokens): no findings. The owner chose not to add
a "use at your own risk" sentence to terms §2.
