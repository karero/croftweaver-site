# DIFF review — docs/privacy-plain-language — the privacy page says it in plain words, with no article numbers or law names

Base `5b2867f` (origin/main) · depth: **High** (privacy and legal text) · verdict: **OPEN** — the round-1 fixes are not re-verified · authority used: BRANCH-COMMIT — atom A (this session created the branch and commits); POST AUTHORITY — atom A (this session opens the PR). GATED-THIS-DIFF is not claimed.

| Round | Head | Artifact | Reviewers | seconds, tokens per seat | BUG/RISK/NIT (before dedup) |
|---|---|---|---|---|---|
| 1 | `fc069e5` | full `origin/main...fc069e5` | codex-cli 0.162.1 gpt-6.1-sol high read-only; melious glm-5.3 | codex 294 s / 66,400; melious 119 s / 13,536 | 4 / 3 / 4 |

| id | Sev | Source | Round | Finding — one line | Status | Evidence |
|---|---|---|---|---|---|---|
| P1 | BUG | codex | 1 | "we load fonts from this website": the site loads no fonts (system stack) | fixed `b78996d` | the page says it uses the fonts on the device; images come from this site |
| P2 | BUG | codex | 1 | the disclosed "user agent" became "browser type" | fixed `b78996d` | "your browser type and version" |
| P3 | BUG | codex, melious | 1 | the guard missed `Articles 15-21`, `art. 6`, long law names, statute numbers | fixed `b78996d` | case-insensitive; nine citation forms replayed, all caught; three clean strings not matched |
| P4 | BUG | codex | 1 | no retention period for hosting logs | not changed | pre-existing; Cloudflare's own setting, not stated on the sister pages either; owner follow-up |
| P5 | RISK | codex, melious | 1 | Do Not Track and "only other server" claims unverified | verified | the live Plausible script has no DNT reference; the live home page loads only this site and the analytics server |
| P6 | NIT | melious | 1 | company name twice in section 1; "server" read literally | fixed `b78996d` | lead-in reworded |
| P7 | NIT | melious | 1 | transfer-instrument names (Data Privacy Framework, standard contractual clauses) remain | no change | same wording as the sister site; they are not article citations |

Waivers: none. Deferrals: none. Follow-ups: P4 (logs); the identity-check promise is now "if we doubt a request comes from you", as on the sister site.

Notes:
- Fresh-eyes not run on this round; the page content was reviewed three times on the sister sites. Suite 205 passed; the analytics gate passes.
