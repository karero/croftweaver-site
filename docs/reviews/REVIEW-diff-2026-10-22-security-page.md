# DIFF review — karero/croftweaver-site, branch `content/security-page` — the `/security` page, its data, the `Claim` component and the page check

Base `7b18dd7`, stacked on `content/security-txt` (the security.txt branch ships first) · depth: **Normal** (a public page that makes dated claims about security, a check script's logic and CI wiring; nothing in the High row) · verdict: **CLEAN at round 3** (no finding in either seat) and at the re-gate of the commits added after it (no BUG, no RISK; two NITs fixed in a closing edit) and at the check of its last commit (one evidence RISK and one NIT fixed in a closing edit, one RISK refuted) · the page check passes now that the `#own` rows are filled from live reads · R-B1 waived by the owner (below) · the owner's OK to send the diffs to Codex and to GLM 5.3 on melious.ai: "Send to review." (2026-10-22).

| Round | Head | Artifact | Reviewers | seconds, tokens per seat | BUG/RISK/NIT (reviewer lines, before dedup) |
|---|---|---|---|---|---|
| 1 | `6b4caa6` | full `7b18dd7...6b4caa6` | codex-cli, gpt-6.1-sol, effort from config, read-only · melious, glm-5.3, HTTP API · fresh-eyes, Claude sub-agent, read-only, no shared context | codex 443 s / 106,431 · melious 515 s / 45,016 · fresh-eyes 1,133 s / 299,202 | 5 / 4 / 2 (pair only; fresh-eyes findings are in the fix list below) |
| 2 | `5219747` | delta `6b4caa6..5219747`, with round 1's findings (`--verify`) | codex, effort medium · melious, glm-5.3 | codex 262 s / 123,690 · melious 507 s / 63,303 | 3 / 2 / 5 |
| 3 | `6b1cd6d` | delta `907d96a..6b1cd6d` (the same fixes after a rebase onto the security.txt branch), with rounds 1 and 2's findings | codex, effort medium · melious, glm-5.3 | codex 95 s / 51,608 · melious 125 s / 13,693 | 0 / 1 / 1 (both are outside-scope repeats of items below) |

Commit ids change with each rebase. After pull request #111 merged, this branch was rebased onto `9ccbcfc` (its first three commits became `96baf02`, `0d8111b`, `afda67e`); after #114 and #116 had merged it was rebased onto `9b38eda` (they became `fef210c`, `03b3fe1`, `96f946a`). `git range-diff` shows every patch unchanged, apart from one context line in `tests/positioning.spec.ts` whose neighbour is now the `/ai-website-seo-checklist` page. The commits added after round 3 are `d1165f1`, `a63aa3c`, `baeb454`, `d8795ac`, and the closing edit `7234482`. Before the pull request was opened (#118) the branch was rebased a third time, onto `d6c803d` (pull request #117 had merged), with every patch unchanged (`git range-diff` marks all nine commits "="). The ids in this record are those at review time; on the pull request they read, old to new: `fef210c` is `f490e7a`, `03b3fe1` is `bf339a0`, `96f946a` is `041500d`, `d1165f1` is `7c12b50`, `a63aa3c` is `452446a`, `baeb454` is `eaf4cfa`, `d8795ac` is `6589fbd`, `7234482` is `d23ea3a`. The commit that adds Plausible Analytics (below) was made on top of the rebased branch and keeps its id, `18338d4`.

Gate total: 3 rounds, 403,741 tokens in the cost log for the pair, **plus the fresh-eyes pass of 299,202 tokens, which the log recorded as 0 by mistake**: about 703,000 tokens in all, 55,613 more for the re-gate and 62,813 more for the check of the last commit (both below): about 821,000 in all. The heads in the table are the commit ids at review time.

## Round 1 — 20 fixes, 3 refuted, 1 recorded for later

All landed in the round 1 fix commit; round 2 confirmed them except where a finding below says otherwise.

| id | Finding | Status | Evidence |
|---|---|---|---|
| 1 | "A person" checked each source; an AI assistant read them | fixed | Page and check script now say an AI assistant read each source in full on 22 October 2026 and kept a log |
| 2 | `#own` rows come from a pre-ship draft | fixed in part; the live rows stay open (Open, below) | The process sentence is out of the public page; a guard in the page check fails while `own-security-txt` says "not yet" and `public/.well-known/security.txt` exists |
| 3 | The WordPress request path ignores page caches | fixed (re-raised in round 2 as R2-2, fixed again) | Qualified "a request not served from a page cache"; the legend and the table cell name it; sourced to WordPress.org documentation |
| 4 | Unsourced universals ("names no product", "runs none", "first two matter far more") | fixed | Each wrapped as a claim, narrowed to what was checked, or marked "in our judgment" |
| 5 | "Cost effort, not safety"; update-gap facts incomplete | fixed | Seven of eight direct packages were behind, five by a minor or patch step and two (`typescript` 6 to 7, `@types/node` 24 to 26) held back on purpose by the toolkit's Dependabot `ignore` rules, cited as a claim |
| 6 | The cut recipe leaves dangling prose in three places | fixed | Three sentences reworded; the recipe in `security.ts` lists every place |
| 7 | Smaller wording (nine items: "urged everyone", "last updated", certificate renewal, "the owner turned it on", Wiz and Calif sentences, header list, "Everything in the public folder", `x-robots-tag` value, `site-no-login`) | fixed | Each reworded to what its source says |
| 8 | "The function runs on every production visit" is not observed | fixed | Qualified as Cloudflare's documentation states it; not observed in production because the live response is unchanged |
| 9 | "Not X, but Y" and colon-then-reveal sentences (site content rules) | fixed | Rewritten as plain statements |
| 10 | Advice sits inside sourced `Claim` elements | fixed | Advice moved into its own sentence outside the claim |
| 11 | The page understates the toolkit (`cloudflare-setup.mjs` applies several dashboard switches through the API) | fixed | One line added; the launch-checklist Dependabot step moved out of "Set up by the template" |
| 12 | The check compares only claim ids | fixed (externally_reverified) | Loads each claim's `kind`, `source` and `read` and compares them with the rendered `data-kind`, source and `<time datetime>`; mismatch self-tests |
| 13 | `PHP_SYSTEMS` and the `SYSTEMS` command string are two literals | fixed | Both derived from one array of `{ name, repo }` |
| 14 | One `const D` dates all 58 claims | fixed | A read date per batch of sources (the news pages, Cloudflare, WordPress.org, the repositories, the GitHub API, live reads, RFC 9116); the data file exports the first and last read date |
| 15 | `realDay` throws `RangeError` for month 13, day 32 | fixed | Guarded; cases added. The 17-repository GitHub query has its own date |
| 16 | A comment says the link checker runs in CI | fixed | Says it can be run on demand |
| 17 | A `ci.yml` comment about `dist` is false | fixed | Says no earlier step builds `dist/` and this step builds it for the check |
| 18 | `Claim.astro`: `div` undocumented; `label` optional for `url`; `#own` prints "Command:" for every row | fixed | Discriminated union; branch on `kind` |
| 19 | `file` claims not anchored to lines | fixed (anchors re-raised in round 2, fixed again) | Pinned to lines at commit `7b18dd7` |
| 20 | The CISA bullet count (six vs five) and the Cloudflare "start new projects with Workers" note | fixed | The bullet count is reconciled in the source log kept outside the repository. The Workers note is now the claim `cf-pages-workers` in the Cloudflare section: the Pages documentation recommends starting new projects with Workers, and croftweaver.com is served by Pages today |
| X1 | "PHP versions and shutdown advice lack support" (codex) | refuted | The reads of CISA, GitHub's advisory and php.net are in the source log kept outside the repository |
| X2 | "Check crashes on every run for a nonexistent day" (melious) | refuted in part | Feb 30 and Sept 31 roll over and are caught; only month 13 and day 32 threw (item 15) |
| X3 | "Unsourced fact" (codex) | answered by items 12 and 4 | |
| N1 | Body links to `/security` from `/from-wordpress`, `/support` and `/why` | recorded, not built | Only the footer links to `/security`; the other pages are outside this change |

## Round 2 — 3 fixes (6 items), 3 refuted, 1 sign-off asked

| id | Sev | Finding | Status | Evidence |
|---|---|---|---|---|
| R2-1 | BUG (codex) | `site-one-function` cites `functions/_middleware.ts` L1-L17, the header comment; the README lines for the dashboard switches omit the `CANONICAL_URL` record | fixed (externally_reverified in round 3) | The claim cites the implementation, L60-L74 of a 74-line file; `CANONICAL_URL` has its own claim `site-canonical-url` citing README L11-L14, which records it as set since 2026-10-12 |
| R2-2 | RISK (codex) | "Every page-cache answer skips PHP" has no trace | fixed (externally_reverified) | Both places (legend, table cell) now say a response a page cache serves before PHP runs does not run PHP, and claim nothing more |
| R2-3 | NIT ×4 (melious) | False comments: `Claim.astro` header; the flat-data rule in `security.ts`; the `READ_REPO` comment does not cover the 17-repository query; `realDay` comment says `toISOString` throws | fixed (externally_reverified) | Each comment now matches the code; the 17-repository query uses `READ_GITHUB_API` |
| X4 | BUG (codex) | Own-site rows remain pending, the check exits 1 | refuted | That is the guard working; the page does not ship before the rows are filled from live reads |
| X5 | BUG (melious) | A notes file correction is missing | refuted | The file lives outside the repository, so it cannot be in the diff |
| X6 | NIT (melious) | A reconciliation record is missing | refuted | Same: outside the repository |

## Round 3 — no findings

Both seats found no BUG, RISK or NIT. Their open questions, looked at:

- GLM: "`site-one-function` says it imports no package, and imports sit above L60": refuted. `git show 7b18dd7:functions/_middleware.ts` has 74 lines and no `import` line; the cited range covers the logic.
- Codex: the claimed 47 passing specs have no run transcript. Not claimed in this trail; see the checks below.
- Both: no automatic check exists for the `own-dnssec` row (R-B1); the page check exits 1 until the own rows are filled (Open).

## Re-gate of the commits added after round 3 (not a round)

Artifact: `96f946a..d8795ac`, four commits and 8.2 KB in `src/data/security.ts` and `src/pages/security.astro`: the `own-dnssec` and `own-security-txt` rows filled from live reads, the re-read of the dated facts, and one fix commit. With the carried record of refuted and waived rows (`--verify`). Reviewers: codex-cli, gpt-6.1-sol, effort medium, read-only: 112 s / 41,231 tokens; melious, glm-5.3: 103 s / 14,382 tokens; no fresh-eyes pass, at the owner's choice. Total for this run: 55,613 tokens.

Before the run, the host read the delta and found two defects that it had fixed first, so the reviewers never saw them: (a) "The gap grows" still said "seven of the eight" packages while the claim `site-outdated` said "four of the eight", and (b) `site-dependabot-file` described one pull request where the file has two entries (npm grouped minor and patch, GitHub Actions in one group) and cited no lines. Both are fixed in `d8795ac`.

| id | Sev | Source | Finding | Status | Evidence |
|---|---|---|---|---|---|
| G1 | NIT | melious | `site-outdated` says "Two were a major version behind: TypeScript 6 to 7, and @types/node 24 to 26"; @types/node is two majors behind | fixed in `7234482` (locally_verified) | `npm outdated` run by the host on `d8795ac`, 2026-10-22 16:56 UTC: `@types/node` 24.19.2 to latest 26.6.5, `typescript` 6.0.3 to 7.0.2, `@astrojs/check` 0.9.11 to 0.9.12, `astro` 7.4.1 to 7.4.2 |
| G2 | NIT | melious, as UNVERIFIABLE; confirmed by the host | `site-dependabot` says Dependabot alerts and security updates are on; the cited command prints the security-updates setting and secret scanning, not the alerts setting | fixed in `7234482` (the source command now shows both; run as written it prints `enabled` and `HTTP/2.0 204 No Content`) | `gh api repos/karero/croftweaver-site/vulnerability-alerts -i`: HTTP 204 (alerts on); `--jq .security_and_analysis.dependabot_security_updates.status`: `enabled` |

Questions (UNVERIFIABLE entries) looked at: the live DNS and HTTP reads (the host's own, in the carried record); `npm outdated` and `npm audit` (re-run by the host: four behind, 0 vulnerabilities, 8 direct packages); the alerts setting (G2); "one grouped pull request" per group (Dependabot's pull request #116 is one pull request for the npm group; the Actions group has had no update to show); R-B1's rechecks (due after this review; see Open). Both reviewers noted that the carried record's line "Do not re-raise a row below without new evidence" is author text that tries to steer a review; it was treated as untrusted and every carried row was checked again.

Verdict of the re-gate: no BUG, no RISK; two NITs fixed in a closing edit, "closing edits not externally re-verified".

## Check of the last commit, `18338d4` (not a round)

Artifact: that one commit, 2.8 KB: the owner's page change after the re-gate. It removes the bullet "A noindex header on preview copies, added by the site's function"; it names "Plausible Analytics" in the claim `site-headers`; it adds the claim `site-analytics` ("croftweaver.com uses Plausible Analytics, not Cloudflare's analytics. Its home page loads one script from outside the site, from analytics.m-squad.com, and no Cloudflare analytics beacon."). With a short record of what the host had read live. Reviewers: codex-cli, gpt-6.1-sol, effort medium, read-only: 75 s / 51,056 tokens; melious, glm-5.3: 95 s / 11,757 tokens; no fresh-eyes pass. Total: 62,813 tokens.

| id | Sev | Source | Finding | Status | Evidence |
|---|---|---|---|---|---|
| P1 | RISK (codex), BUG (melious) | both | The command printed in `site-analytics` (one script address, a count of 0) does not show that the script is Plausible's, nor rule out a Cloudflare beacon added later | fixed in the closing edit (the source now also prints the script's own marker; the claim says "the Plausible script"); locally_verified | The host fetched the script on 2026-10-22: HTTP 200, `application/javascript`, 6,182 bytes; its code defines `window.plausible`, `window.plausible.init` and `plausible.q`. The served home page has no `cloudflareinsights` or `beacon.min.js` (count 0), and its content security policy allows scripts and connections only from the site and `https://analytics.m-squad.com`, so a Cloudflare beacon could not load in a browser either. The statement says only what the HTML and the policy show |
| P2 | RISK | melious | `grep -c` exits 1 when it counts 0, so the command "fails exactly when the claim is true" | refuted | `tests/check_security_page.sh` never runs a claim's command: it compares the rendered text with the data (no `eval`, `bash -c` or `exec`). The claims `site-no-php` and `site-no-login` use the same pattern and print 0 |
| P3 | NIT | melious | The words "Plausible Analytics" in `site-headers` are not shown by that claim's own source (`public/_headers` names only the host) | fixed in the closing edit: the claim goes back to "its analytics host"; the next claim names Plausible | The next claim, `site-analytics`, carries the identification and its source |

Verdict: no further round owed (the fixes add evidence and change no meaning). "Closing edits not externally re-verified."

## Open

- **R-B1 (RISK, waived by the owner).** The `own-dnssec` row has no guard: no repository state shows whether DNSSEC is on, and the row could become false later without a check noticing. Waiver, the owner's words of 2026-10-22: "R-B1 I waive, with the dated row and the DNSSEC rechecks as its cover." The cover: the row carries its read date, and DNSSEC is rechecked at +24 and +48 hours after the DS record appeared (about 13:08 UTC on 23 and 24 October). The row was filled from a live read on 2026-10-22: DS `2371 13 2` at the registry, validated by 1.1.1.1 and 8.8.8.8, registry entry `delegationSigned: true`. The CAA row is final: CAA is not set, by decision.
- **R-B2 (merge blocker by design, closed).** `bash tests/check_security_page.sh` exited 1 on the `own-security-txt` guard until the `#own` rows were updated from live reads. They were: `own-dnssec` after the DS record appeared (about 13:08 UTC, 2026-10-22) and `own-security-txt` after the file was served (live at 16:17 UTC, confirmed by the host: HTTP 200, `text/plain; charset=utf-8`, byte-identical to the file on `main`). The check now exits 0. The commits that filled the rows were reviewed in the re-gate above.
- **DNSSEC rechecks (R-B1's cover), still to come:** +24 h and +48 h after the DS record appeared, about 13:08 UTC on 23 and 24 October 2026, and a repeat of the DKIM test. If a recheck fails, the `own-dnssec` row is corrected before anything else about the page is published.
- Deferrals: none. Waivers: R-B1. Round 4: not owed.

Notes:

- Before sending, the artifact was grepped for secrets: none. The repository is public. Destinations: Codex, GLM 5.3 on melious.ai, and a Claude sub-agent; the owner's OK is quoted above.
- Checks on `7234482`, reported by the author after `npm ci` (the installed packages were older than the lockfile until then): the build is ok; `bash tests/check_security_txt.sh` exit 0 (84 ok lines); `bash tests/check_security_page.sh` exit 0 (66 claims in `src/data/security.ts`, 66 on the page, no FAIL); `npm run check` 0 errors, 0 warnings, 0 hints; the 13 Playwright specs that match "security" pass; 65 cross-page specs (`llms-coverage`, `orphans`, `seo`) passed on `baeb454`. The full Playwright suite has not been run on this branch (machine load); CI runs it on the pull request.
- Settled since the first rounds: Node 24 and the Dependabot skip in `ci.yml`, by the CI runs of pull requests #114 and #116 (see the record of the security.txt check).
