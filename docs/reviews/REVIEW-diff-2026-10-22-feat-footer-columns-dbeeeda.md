# DIFF review — branch feat/footer-columns — the footer in four labelled columns from FOOTER, with tests that every page is in it
Base `d6c803d` (merge base with origin/main after one rebase; round 1 saw base `9b38eda` at head `dbeeeda`) · depth: Normal (shipped markup, styles and test logic; nothing in the High row) · verdict: OPEN until the prose-only re-gate below is recorded · authority used: WORKTREE-WRITE and BRANCH-COMMIT, atom A for both (this session created the worktree `croftweaver-site-nav` and the branch); POST AUTHORITY not used, there is no PR yet; GATED-THIS-DIFF waits for the PR comment

| Round | Head | Artifact (full / delta since <sha>) | Reviewers: CLI version, model, effort, sandbox | seconds, tokens per seat | BUG/RISK/NIT |
|---|---|---|---|---|---|
| 1 | `dbeeeda` | full change (`9b38eda...dbeeeda`) | codex-cli 0.163.0, gpt-6.1-sol, config effort, read-only; GLM 5.3 on melious.ai, HTTP, text only; fresh-eyes Claude Sonnet sub-agent, read-only by instruction, no running of tests | codex 248 s / 90,069; GLM 118 s / 12,642; fresh-eyes 481 s / 205,981 | 3 / 2 / 6 (three seats, de-duplicated) |
| rebase | `ec17093` | onto `d6c803d` (PR 117 merged); bridged by the merge link | — | — | — |
| 2 | `7005ce5` | merge link `dbeeeda` → `7005ce5` (`merge_link.sh 9b38eda dbeeeda d6c803d`, `--verify`) | Codex medium, read-only; GLM 5.3 | codex 116 s / 68,087; GLM 169 s / 19,746 | 1 / 0 / 1 |
| prose-only re-gate | `bf97416` | delta `7005ce5..bf97416` (one comment) | Codex medium, read-only | see the Notes | see the Notes |

Tokens logged for the gate: 396,525 across rounds 1 and 2 (five seat runs, fresh-eyes included). No round past 2.

| id | Sev | Source | Round | Finding | Status | Evidence |
|---|---|---|---|---|---|---|
| D1 | BUG | Codex, fresh-eyes | 1 | Base.astro comment: "anchor-ids.mjs gives every built h2 an id" is false | fixed; externally_reverified (round 2, both seats) | `scripts/anchor-ids.mjs`: `if (h.getAttribute('id')) return null; // explicit id wins`. The comment now gives the outline reason and makes no claim about the script |
| D2 | BUG | Codex | 1 | config.ts comment: "a page that is built but left out" overstates; `/404` is built and not indexable | fixed in `7005ce5`; round 2 found the wording still omitted the home exemption (D13) | `src/pages/404.astro` exists; `/404` is not in `dist/sitemap-0.xml` or in `PAGES` |
| D3 | BUG | fresh-eyes | 1 | test comment: "no test requires a page in the header" is false | fixed; externally_reverified (round 2) | `tests/navigation.spec.ts` line 390 asserts the established-sites link; the comment now says so |
| D4 | RISK | fresh-eyes | 1 | the footer links every page, so `orphans.spec.ts` and `scripts/check_internal_links.sh` can no longer flag a page without an in-body link | waived by the owner | see Waivers |
| D5 | RISK | GLM | 1 | "every page is in the footer" rests on a sitemap drift alarm that is not in the diff | refuted | `tests/seo.spec.ts` lines 323 to 343 compare the built sitemap with `PAGES`; Codex, the fresh-eyes pass and the author read it; the whole suite passes with it; the comment says "indexable" |
| D6 | NIT | fresh-eyes | 1 | `AGENTS.md` section 6 "New page" step 2 does not name FOOTER | fixed; externally_reverified (round 2) | `AGENTS.md` line 238 onwards: "add it to FOOTER in `src/config.ts`" |
| D7 | NIT | fresh-eyes | 1 | the completeness test's message is wrong for a duplicate and stops at the first missing page | fixed; externally_reverified (round 2) | mutation run D: three problems at once: `/skills is linked 2 times`, `/about` and `/support` not linked |
| D8 | NIT | fresh-eyes | 1 | `aria-label="Footer"` on the footer nav is never asserted | fixed; externally_reverified (round 2) | mutation run D: removing the attribute fails the columns test, expected "Footer", received "" |
| D9 | NIT | fresh-eyes | 1 | between about 520 and 688 px the four columns are three plus one on a second row; the plan says columns stack on a phone | follow-up: the owner's visual check | screenshots sent to the owner (1280, 360 and 320 px) |
| D10 | NIT | GLM | 1 | the commit message's "grown to 17" is stale because FOOTER holds 20 | refuted | the sentence describes the old flat footer (14 links plus 3 pages); the new footer also lists the header's pages. The PR text gives both numbers |
| D11 | NIT | GLM | 1 | the CSS comment's column count depends on the footer's side padding | fixed; externally_reverified (round 2) | `src/styles/global.css` comment names the 1.25rem padding; 2 x 144 px + 24 px = 312 px fits the 320 px content width at 360 px; screenshots show two columns at 360 px and one at 320 px |
| D12 | NIT | GLM | 2 | PR 117's table test loops over 360 and 320 px only, though its CSS stacks below 40rem | outside scope: not this change's code, it arrived through the rebase and passed its own Light review | `git diff d6c803d^1 d6c803d` is another PR's merge |
| D13 | BUG | GLM | 2 | config.ts comment: the home page is indexable and the test skips it, so "rejects an indexable page" is still imprecise | fixed in `bf97416` (comment only); the prose-only re-gate reads it | `tests/navigation.spec.ts`: `PAGES.filter((r) => r !== '/')` |

Waivers and deferrals:
- D4 waived by the owner, in chat, 2026-10-22: "Yes, waive it: the footer makes orphan and thin-page signals blind. The PR description says so, and the audit script gets its own later PR." Recorded in a test comment above the footer tests; the PR text will say it too. Reason: the orphan test's own message accepts nav and footer entries; the audit script is a shipped template script and a change to it is its own PR. Deferrals: none.

Follow-ups:
- The orphan test and `scripts/check_internal_links.sh` should learn to ignore footer links, in their own PR (the owner's decision on D4).
- D9: the owner's visual check of the 520 to 688 px band and the phone footer's length (650 px at 360 px, 993 px at 320 px).
- D12: PR 117's table test could cover a width just under 40rem.
- Footer text links keep today's size; BRAND.md asks 44 px tap targets, and no test checks them for the footer (the plan keeps this, "Left as it is, on purpose").
- Every worktree of this site shares one Playwright port; a sibling session's `astro preview` answered for mine twice. Deriving the port from the worktree path would fix it, in its own change.

Notes:
- Two local test runs and one mutation run were invalid, because another session's server held port 4725 and Playwright tested its older build; they were discarded and rerun on a private port (an untracked local config, `pw.own-port.config.ts`, not committed). After the fixes: the whole suite 344 passed, `npm run check` 0 errors, the analytics gate passes. Four mutation runs covering seven breaks (a page dropped, a list unnamed, a phone overflow, the badge below the columns, a dead footer link, a duplicate link, a removed `aria-label`) each turned the test it targets red for its own reason; run D also showed the three problems listed at once.
- One rebase onto main (`d6c803d`, PR 117 merged), bridged by `merge_link.sh`. Fresh-eyes ran in round 1 only, by design at Normal depth, so its chain ends there; both script seats hold an unbroken chain through round 2.
- The review script ran from the worktree; the skill's script has `SECOND_SEAT` (16 matches). The owner's OK to send the diff to Codex and GLM 5.3 on melious.ai, quoted: "Yes: I OK sending the footer diff to Codex and to GLM 5.3 on melious.ai. Run the DIFF gate at Normal depth."
- Prose-only re-gate on `bf97416` (one comment): result below once recorded.
