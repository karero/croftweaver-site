# DIFF review — branch `content/wordpress-trial-wording` — two trial claims on /from-wordpress

Base `ad3c98a` (`main`) · depth: **Normal** (Codex + GLM 5.3 on melious) · verdict: **CLEAN at round 1** (no BUG; two RISKs and three NITs, each refuted by the trial record or left as outside this change).

| Round | Head | Artifact | Reviewer | seconds, tokens | BUG/RISK/NIT |
|---|---|---|---|---|---|
| 1 | `1532b82` | `ad3c98a..1532b82` (one commit, `src/pages/from-wordpress.astro`), with verbatim excerpts of the trial record | codex-cli, gpt-6.1-sol, read-only | 217 s / 53,330 | 0 / 2 / 0 |
| 1 | `1532b82` | same | melious, glm-5.3 | 74 s / 9,272 | 0 / 0 / 3 |

Gate total from the cost log: 1 round, 62,602 tokens.

## What the change is

Two sentences in "What has been tested so far" said more than the trial's record (private hub, `wordpress-page/trial-2026-10/RESULT.md`) shows:
1. "54 media files" becomes "54 media items". The helper counted 54 media items through the REST API and the database held 54 attachment records; nobody checked the files themselves (the record lists them under "Content the count cannot see").
2. "/locations.kml, a file for local search" becomes "the old site's local sitemap listed /locations.kml". The record shows only that it was listed in `local-sitemap.xml`; its purpose was not checked.

Also checked, no change needed: the header comment already says the helper's tests use stand-in sites and that the proof section reports its first real run (20 October 2026); the closing line still says outside pages were checked on 18 October and the trial ran on 20 October.

## Findings and dispositions

- **RISK (Codex), lines 245–247, "sensible", "matching page", "as intended" unverifiable:** refuted. These sentences are unchanged, and the reviewer saw only excerpts. RESULT.md's table gives each result: `/cookie-policy-eu/` to `/privacy` (hand-written in apreet-site's `_redirects`), `/terms/`, `/privacy/` and four article pages to the same path without the slash, `/home/` to `/` ("intended", per `_redirects`: `/home/  /  301`), `/locations.kml` "missing (404)".
- **RISK (Codex), lines 249–251, "four content types" and "nothing hidden in three" unverifiable:** refuted. RESULT.md: "named its four gaps: four content types answered 401"; its table gives Elementor templates 14 in the database, and "Jetpack forms, feedback, activity log | ? (401) | 0 | the three gaps hide nothing".
- **NIT (GLM), keep "Rank Math's file for local search":** declined. RESULT.md's summary uses those words, but nothing in the trial checked the file's purpose; the page keeps to what was observed.
- **NIT (GLM), 11 addresses on the list but 10 asked:** outside this change (unchanged sentence). The page says "the other nine", which counts the ten addresses asked; RESULT.md records the eleventh as dropped before sending.
- **NIT (GLM), "media items" here and "media files themselves" on line 116:** no change. They name different things on purpose: the records were counted, the files were not.

Checks before the round: `npm run check` 0 errors / 0 warnings / 0 hints, `npm run build` green, `npx playwright test` 421 passed (none skipped).

## Open

Nothing for the gate. Not shipped: `npm run ship` waits for the owner.
