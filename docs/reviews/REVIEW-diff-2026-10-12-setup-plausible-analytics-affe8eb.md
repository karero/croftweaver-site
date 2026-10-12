# DIFF review — setup/plausible-analytics — Plausible on the live build (analytics.m-squad.com), privacy page, analytics gate test

Base `59a8983` (main at the start; main has since moved and is merged into the branch at `3c2fd55`) · depth: **High** (privacy and legal text) · verdict: **OPEN** — round 7 found 2 BUGs and 1 RISK, fixed in `0b36840` and not re-verified; the owner confirmations listed in the README ("Launch requirements") are still empty, and the storage-period slot in the privacy page is deliberately unfilled (CI is red until it is) · authority used: BRANCH-COMMIT — atom A (this session created the branch and its commits); POST AUTHORITY — atom A (this session opens the PR). GATED-THIS-DIFF is not claimed.

| Round | Head | Artifact | Reviewers | seconds, tokens per seat | BUG/RISK/NIT (both seats, before dedup) |
|---|---|---|---|---|---|
| 1 | `affe8eb` | full `main...affe8eb` | codex-cli 0.162.1 gpt-6.1-sol high read-only; ollama-cloud glm-5.3 (melious FAILED: quota); fresh-eyes (Sonnet sub-agent) | codex 447 s / 76,618; glm 736 s | 3 / 7 / 4 |
| 2 | `1045704` | delta | codex, glm, fresh-eyes | codex 563 s / 79,752; glm 532 s | 4 / 3 / 7 |
| 3 | `2962b02` | delta | codex, glm, fresh-eyes | codex 804 s / 92,610; glm 386 s | 3 / 4 / 5 |
| 4 | `ba34637` | delta | codex, glm, fresh-eyes | codex 754 s / 104,018; glm 870 s | 5 / 4 / 8 |
| 5 | `3ab16ac` | delta | codex only | codex 645 s / 99,493 | 2 / 1 / 1 |
| 6 | `825e926` | delta (gate script) | codex only | codex 662 s / 83,837 | 4 / 1 / 0 |
| 7 | `da35070` | delta (gate script) | codex only | codex 386 s / 70,967 | 2 / 1 / 0 |

| id | Sev | Source | Round | Finding — one line | Status | Evidence |
|---|---|---|---|---|---|---|
| S1 | BUG | codex | 1 | privacy header says "only the page address and referrer" are read; the script also reads the opt-out flag and checks for automation, and sends scroll and engaged time | fixed `1045704` | sentences rewritten from the script's source (v33) |
| S2 | RISK | codex, fresh-eyes | 1 | "our own server", no stored IP, no onward use: no evidence | OPEN — owner; the README lists each as a confirmation to write down | the page words the instance facts as the owner's to confirm |
| S3 | RISK | codex, fresh-eyes | 1 | banner-free position rests on no checked assessment | OPEN — owner; the header comment gives sources (EDPB 2/2023, DSK OH Digitale Dienste, § 25 TDDDG) and no conclusion; the README says the position is not accepted until a name and a date are written | |
| S4 | RISK | codex | 1 | the gate accepted a wrong host or ID, inert JSON scripts, prose, duplicates | fixed `1045704`, `2962b02` | pins on the script address; counter tested on fixtures |
| S5 | BUG | codex | 2 | gate: commented-out or logged init counts; CSP accepts host suffixes; a wrong configured ID passes | fixed `2962b02` | stub executed; exact tokens; pin on `https://analytics.m-squad.com/js/pa--pMhz1-dKjwaTf3D6ArFS.js` |
| S6 | BUG | codex | 2 | README decision 2 says "No functions"; `functions/_middleware.ts` exists | fixed `2962b02`; re-fixed in the merge `3c2fd55` (main had put the old wording back) | the file is present on main |
| S7 | BUG, RISK | codex | 3–5 | only the home page's stub executed; CSP not tied to the stub's hash; empty `script-src-elem`; `strict-dynamic` not rejected; unseeded run never calls init | fixed `ba34637`, `3ab16ac` | same changes as the toolkit gate (see its trail) |
| S8 | BUG | codex | 4 | meta description claim in the header; "and and" in the README | fixed `3ab16ac` | |
| S9 | BUG | codex | 5–7 | replacement init passes without the seed spy; init before plausible; checksum de-duplication; comment removal inside JS strings; `<script-x>`; quoted `>` in the opening tag; init alias; inherited init | fixed `825e926`, `da35070`, `0b36840` | fixtures in the gate's self-test (30 pages, 16 policies); last round not re-verified |
| S10 | RISK | codex | 4–7 | "sends and stores" for outbound and download addresses assumes the instance keeps them | OPEN — owner; the README asks for one test click and a look at the report | |
| S11 | RISK | codex, glm | 1–4 | identifier, salt and stored fields lack schema evidence for the running version | OPEN — owner; README: "What the instance does, from the instance itself" | the compose file names Community Edition v3.2.1, ClickHouse 24.12, no retention |

Waivers: none. Deferrals: none. Follow-ups: the `website-qa` skill text saying `defer` for the analytics script was corrected in the toolkit PR, not here. The privacy page's `[MISSING: how long the analytics records are kept.]` slot is the owner's decision (a TTL or a job first, then the period).

Notes:
- The branch merges `main` at `3c2fd55`; one README conflict (decision record, cache-rule line) was resolved by hand: main's page count and dates kept, this branch's analytics wording and the middleware description kept.
- Rounds 5–7 ran Codex alone (the gate script only); the second seat had hit quota limits. Fresh-eyes ran in rounds 1–4 and its findings are folded into the rows above.
- Checks on `0b36840`: the gate (4 builds, 30 fixtures, 16 policies) passed; `npm run check` 0 errors; `npm test` 203 passed.
- Data check: no credentials. The repo is the owner's; the instance address is already public in the page's CSP.
