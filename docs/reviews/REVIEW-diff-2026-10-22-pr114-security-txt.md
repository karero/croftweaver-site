# DIFF review — karero/croftweaver-site#114 — `security.txt` and the check that keeps it valid

Merged as pull request #114 on 2026-10-22 at 15:08 UTC (merge commit `0fe4d4d`) and live since production was fast-forwarded to `0fe4d4d`. The three review rounds ran before the merge; this record was written afterwards and ships with the `/security` page's branch, because #114 merged first.

Base `7b18dd7` · depth: **Normal** (the logic of a check script, a CI step and a pre-push hook are never Light; nothing in the High row) · verdict: **CLEAN at round 3** (no substantive BUG in the last round) with **R-A1 settled by a real run and closed by the owner**, and R-A2 closed · the owner's OK to send the diffs to Codex and to GLM 5.3 on melious.ai: "Send to review." (2026-10-22).

| Round | Head | Artifact | Reviewers | seconds, tokens per seat | BUG/RISK/NIT (reviewer lines, before dedup) |
|---|---|---|---|---|---|
| 1 | `a155d3c` | full `7b18dd7...a155d3c` | codex-cli, gpt-6.1-sol, effort from config, read-only · melious, glm-5.3, HTTP API · fresh-eyes, Claude sub-agent, read-only, no shared context | codex 403 s / 68,047 · melious 434 s / 26,878 · fresh-eyes about 10 min | 4 / 1 / 4 (pair only; fresh-eyes findings are in the fix list below) |
| 2 | `3aee4e3` | delta `a155d3c..3aee4e3`, with round 1's findings (`--verify`) | codex, effort medium · melious, glm-5.3 | codex 303 s / 50,449 · melious 532 s / 47,816 | 1 / 4 / 6 |
| 3 | `12ebc7c` | delta `3aee4e3..12ebc7c`, with rounds 1 and 2's findings | codex, effort medium · melious, glm-5.3 | codex 173 s / 46,668 · melious 262 s / 26,896 | 1 / 0 / 1 |

Commit ids here are those at review time. After pull request #111 merged, the branch was rebased onto `9ccbcfc`; its four commits are now `0395be4`, `ba0d4d8`, `4e3aec6`, `88183c9`, and `git range-diff` shows every patch unchanged.

Gate total from the cost log: 3 rounds, 432,152 tokens (the log's total includes the fresh-eyes pass, about 165,000 by subtraction). Final head `b245698`: its two edits (below) are `locally_verified`, closing edits not externally re-verified.

## Round 1 — 13 fixes, 1 owner decision, 3 refuted

All 13 landed in `3aee4e3`; round 2 confirmed them except where a finding below says otherwise.

| id | Finding | Status | Evidence |
|---|---|---|---|
| 1 | Impossible dates pass (`2027-02-30` rolls to 2 March, `T24:00:00Z` passes) | fixed (externally_reverified) | The parts are read from the regex groups and checked one by one; self-tests for Feb 30, Sept 31, `T24`, month 13, day 32, `23:59:60Z` |
| 2 | `https://[` and `https://` pass as Contact or Policy | fixed (externally_reverified) | Every https value goes through `new URL`; reject fixtures added |
| 3 | Boundaries use `Math.floor` on days (7 d + 1 s fails, 30 d + 1 s warns) | fixed (externally_reverified) | Elapsed milliseconds are compared with the limits; plus and minus one-second cases |
| 4 | Comment "Date.parse wants upper case" is false on Node 26 | fixed | Comment now says the reader upper-cases as normalisation |
| 5 | `Encryption` forced to https; RFC 9116 allows `dns:` and `openpgp4fpr:` | fixed (externally_reverified) | RFC 9116 section 2.5.4 read raw 2026-10-22: https URL, `dns:` URI and `openpgp4fpr:` fingerprint are its examples |
| 6 | Docstring claims every way the file can be wrong | fixed | Narrowed; self-tests for a `tel:` Contact, `Encryption`, `Hiring`, `Preferred-Languages` and a duplicate Canonical |
| 7 | `grep -q "$words"` treats the message as a pattern | fixed | `grep -qF --`; WARN lines filtered first |
| 8 | `CANONICAL` is a literal; Policy path not checked against the site's pages | fixed (re-raised in round 2 as R2-2, then fixed again) | `SITE.url` read from `src/config.ts`; Policy must be a route in `PAGES` |
| 9 | No `command -v node`; plain `cd` | fixed | Message added; `CDPATH= cd --` |
| 10 | Wording: "reads one file", a pull request named but not identified, security.txt line 2 pointing at a page that documents one route | fixed | The mailbox `security@croftweaver.com` was tested by the owner on 2026-10-22, so its line stays |
| 11 | A lapse is noticed only on a push | fixed | README status row: `Expires` 2027-04-22, renew by 2027-03-08 (45 days before) |
| 12 | Hook output scrolls past the warning | fixed | Warning printed again after the tests |
| 13 | RFC section citations doubtful; `dependabot[bot]` condition unread | fixed; the condition stays R-A1 | RFC 9116 section 4 is "File Format Description and ABNF Grammar"; the Dependabot-with-Actions documentation was read, Actions cannot be run locally |
| D1 | An expired or near-expired file also holds up `npm run ship` (push-triggered CI and the hook still run the check) | decided: accepted, the renewal is a one-line edit | The owner answered "Accept it" on 2026-10-22; the script header and `ci.yml` say so |
| X1 | "Expires is more than a year out if this merges before 2026-04-23" (GLM) | refuted | Today is 2026-10-22; the script printed `181 day(s) to Expires` |
| X2 | "security@ delivery untested" (fresh-eyes) | refuted | The owner tested it on 2026-10-22 |
| X3 | GitHub private reporting may be off | refuted | `gh api` on 2026-10-22: `enabled: true` for karero/croftweaver, `enabled: false` for karero/croftweaver-site; the contact line names the toolkit's private-reporting link |

## Round 2 — 7 fixes, 2 refuted, 1 sign-off asked

| id | Sev | Finding | Status | Evidence |
|---|---|---|---|---|
| R2-1 | BUG (codex) | The extension note says to add fields to `KNOWN`, which cannot admit a clear-signed file because the armor lines fail first | fixed (externally_reverified in round 3) | Header now describes the signed envelope separately and says the reader rejects the armor header |
| R2-2 | RISK (codex) | Policy fixtures hard-code `croftweaver.com/support` | fixed (externally_reverified) | Fixture origins come from `SITE_URL`, the valid path from `PAGES`; round 3 changed the origin and only the real file's Canonical failed |
| R2-3 | RISK (melious) | `PAGES` extraction stops only at `] as const` | fixed (externally_reverified) | Stops at the next top-level declaration, exits 3 loudly when no closer is found; the SITE extraction resets on its closing brace |
| R2-4 | NIT (melious) | Second 60 accepted at any time | fixed (externally_reverified) | Accepted only at 23:59:60 UTC on 30 June or 31 December, offset applied first; removing the guard fails four fixtures |
| R2-5 | NIT | `openpgp4fpr:[0-9A-Fa-f]{40,64}` admits 41 to 63 digits | fixed (externally_reverified) | 40 or 64 digits; 41 and 63 are rejected. RFC 9580 section 5.5.4.3: a version 6 fingerprint is the 256-bit SHA2-256 hash, so 64 hex digits |
| R2-6 | NIT | The captured self-test run is silent for several seconds in the hook | fixed | Notice printed first |
| R2-7 | NIT | Encryption comment lacks the RFC section | fixed | Cites RFC 9116 section 2.5.4 |
| X4 | RISK (melious) | `dns:` and `openpgp4fpr:` acceptance rests on unread RFC text | refuted | RFC 9116 section 2.5.4, read raw 2026-10-22, gives both as examples |
| X5 | NIT (melious) | "ABNF in section 4" is unevidenced | refuted | The RFC's own contents read "4. File Format Description and ABNF Grammar" |

## Round 3 — 2 edits, 3 refuted, 0 substantive BUG

| id | Sev | Finding | Status | Evidence |
|---|---|---|---|---|
| R3-1 | BUG (codex), host rating: not substantive | With `PAGES` holding only `/`, the self-test setup exits with "no valid Policy path" while the reader accepts `Policy: https://croftweaver.com/` | fixed in `b245698` (locally_verified, not externally re-verified) | Not reachable today (the site has many routes) and the failure is loud, not a wrong pass, so no round is owed. Fix: the first route other than `/`, else `/`. On a temp copy whose `PAGES` is `['/']` only, all 83 self-test cases passed and the fixtures read `Policy: https://<host>/` with no double slash |
| R3-2 | UNVERIFIABLE (codex, melious) → confirmed in part | The header says RFC 3339 section 5.7 allows second 60 "only" on 30 June or 31 December | fixed in `b245698` (comments only) | RFC 3339 section 5.7, read raw 2026-10-22: "time-second may have the value 60 at the end of months in which a leap second occurs -- to date: June ... or December". It names the two dates "to date" and does not say they are the only ones. Both comments now say the check is stricter than the RFC on purpose |
| X6 | NIT (melious) | "RFC 9116 section 4 ABNF imports RFC 4880" is unsupported | refuted | `rfc9116.txt` lines 523 and 528: "imported from RFC 2045; see RFC 4880 Section 10.3.3" and "dash-escaped per RFC 4880 Section 7.1" |
| X7 | UNVERIFIABLE | OpenPGP version 6 fingerprints are 64 hex digits | confirmed, no change | RFC 9580 section 5.5.4.3 |
| X8 | UNVERIFIABLE (melious) | Is `s` numeric in `parseRfc3339`, so that `s === 60` fires | confirmed, no change | `const [y, mo, d, h, mi, s] = m.slice(1, 7).map(Number);` in `tests/check_security_txt.sh`, read 2026-10-22 |

Open and waived:

- **R-A1 (RISK, settled by a real run and closed by the owner).** Owner's words, 2026-10-22: "Yes, close R-A1 on the evidence: the step was skipped on Dependabot's PR #116 and ran on #114." The `ci.yml` step skips the check when the pull request's author is `dependabot[bot]` (`github.event.pull_request.user.login`; GitHub's page "Automating Dependabot with GitHub Actions", read 2026-10-22, uses that same expression to recognise Dependabot's pull requests). If it were wrong the check would simply run on Dependabot's pull requests, which is the safe direction. The first run after the merge answers it. Dependabot's pull request #116 (base `0fe4d4d`, which holds this workflow), CI run 39804298663, 2026-10-22: the step "security.txt (public/.well-known/security.txt)" ended `completed/skipped`, the other steps ran and the job `test` succeeded. The same step on this branch's own pull request #114 (run 39794967862) ended `completed/success`: it runs for everyone else.
- **R-A2 (follow-up, closed).** CI runs Node 24; the check was written and run on Node 26 only. Closed by the CI run of the pull request: `actions/setup-node` with `node-version: 24`, the step "security.txt (public/.well-known/security.txt)" ran the check, and the `test` job passed (run 39794967862, 2026-10-22).
- Deferrals: none. Round 4: not owed (no substantive BUG in round 3).

Notes:

- Before sending, the artifact was grepped for secrets: none. The repository is public. Destinations: Codex, GLM 5.3 on melious.ai, and a Claude sub-agent; the owner's OK is quoted above.
- Checks on `b245698`: `bash tests/check_security_txt.sh` 84 ok lines, "181 day(s) to Expires", passed; `npm run check` 0 errors, 0 warnings, 0 hints. No Playwright run in rounds 2 and 3 (machine load above 30; the changes were comments, a script and a hook).
- The file renews by 2027-03-08 (README row).
