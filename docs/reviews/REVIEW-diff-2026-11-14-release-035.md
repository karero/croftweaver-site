# DIFF review: croftweaver.com for Croftweaver 0.35
Base `d07e531` · depth: Normal · verdict: CLEAN at round 5 (no BUG or RISK from either seat) · 5 rounds, 27 findings before deduplication

Task: the site update for release 0.35 (tag `8825573b`, 40 skills, new `website-new-page`), per the toolkit's release runbook, Step 7. Seats: Codex gpt-6.1-sol (read-only, medium) and GLM 5.3 on melious, every round. Claims sweep before round 1 narrowed three sentences (commit `446c991`).

| Round | Head | Seconds, tokens | BUG/RISK/NIT |
|---|---|---|---|
| 1 | `446c991` | Codex 144 s / 63,730; GLM 202 s / 29,607 | 2 / 3 / 4 |
| 2 | `bd2b78d` | Codex 159 s / 68,742; GLM 146 s / 30,029 | 0 / 3 / 3 |
| 3 | `e937109` | Codex 116 s / 55,703; GLM 231 s / 35,330 | 0 / 4 / 2 |
| 4 | `5d248cb` | Codex 108 s / 54,729; GLM 208 s / 35,139 | 0 / 3 / 2 |
| 5 | `8ffbac2` | Codex 158 s / 57,955; GLM 196 s / 31,904 | 0 / 0 / 2 |

| Sev | Round | Finding | Status | Evidence |
|---|---|---|---|---|
| BUG | 1 | /security still said the template has two functions | fixed | Diagram, summary, step, table and claim now tell the template up to 0.34 from new sites; new claim `template-worker-none` cites the v0.35 `wrangler.jsonc` |
| BUG | 1 | /security `UPDATED` not moved | fixed | 14 November 2026 |
| RISK | 1–4 | Codex: Croftweaver claims not shown at the tag | refuted | Tag material quoted in the evidence; the tag's own 25 tests of `check_page_text.py` pass, including an altered-text failure; GLM upheld this in rounds 3 and 4 |
| RISK | 1–4 | Codex: "free and unlimited" static assets | refuted | Cloudflare's static assets billing page, read 14 November 2026 (updated 12 November); the template Worker has no script |
| RISK | 1 | README row named /start as saying Workers | fixed | Row reworded |
| RISK | 2 | "Made before 0.35" is the wrong test for the old function: a moved site has none | fixed | "Still on Pages" on /what-it-runs-on, /from-wordpress, /security |
| RISK | 3 | Workers build limits missing, against the page's rule "never free without its limits" | fixed | 3,000 build minutes, one build at a time, 20 minutes, from Cloudflare's Workers Builds limits page, read 14 November 2026 |
| RISK | 3 | Deck lock hash changed with no deck source change | refuted | The hash is of the HTML the deck reads (`scripts/decks.mjs`), which changed |
| RISK | 4 | "Preview links" on the Workers card had no source | fixed | Cut: the card names HTTPS certificates, sourced on /security |
| NIT | 1–5 | Card wording, swap list order, "optional server mode", plain list item in a proof list, README row, Pages page re-read, roadmap item dropped | fixed | Roadmap item restored as it was; Pages page re-read 14 November 2026 |
| NIT | 1 | `SCRIPT_OR_SERVER` unused | refuted | Still used in the "leave Plausible off" paragraph |
| NIT | 5 | "Two functions up to 0.34" half shown | refuted | `git ls-tree v0.34` lists `functions/_middleware.ts` and `functions/go/email.ts` |
| follow-up | 4–5 | `tests/TESTS-VERSION` still names 0.34 | out of scope | The brief takes the 0.35 suite only if Step 7 or the README asks; neither does. README row 5k says so |

Waivers and deferrals: none. After the last edit: `npm run check` clean, `npm run build`, `tests/check_security_page.sh` (87 claims, 87 on the page) and the full Playwright suite (533 passed; one earlier run had a single footer-badge timeout under load that passed on rerun).
