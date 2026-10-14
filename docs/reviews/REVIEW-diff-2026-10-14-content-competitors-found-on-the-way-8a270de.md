# DIFF review — croftweaver-site `content/competitors-found-on-the-way` — two "found on the way" items in docs/competitors.md marked fixed in #77

Base `origin/main` (`adcc01d`) · depth: **Light** (prose no one runs: a working-notes document; the owner named Light, Codex alone) · verdict: **CLEAN** after round 2 · authority used: BRANCH-COMMIT and POST AUTHORITY — this session created the branch and opens the pull request

| Round | Head | Artifact | Reviewers: CLI version, model, effort, sandbox | seconds, tokens | BUG/RISK/NIT |
|---|---|---|---|---|---|
| 1 | `ecb250d` | full, `origin/main...ecb250d` without `docs/reviews/` | codex-cli 0.162.1, `gpt-6.1-sol`, effort medium, read-only | 115 s, 52,979 | 1 / 0 / 0 |
| 2 | `8a270de` | full, `origin/main...8a270de` without `docs/reviews/`, with round 1's findings to verify | codex-cli 0.162.1, `gpt-6.1-sol`, effort medium, read-only | 61 s, 30,705 | 0 / 0 / 0 |

| id | Sev | Source | Round | Finding — one line | Status | Evidence |
|---|---|---|---|---|---|---|
| F1 | BUG | codex | 1 | "all 17 links on the page were re-checked" does not match `src/data/compare.ts`, which names 14 distinct sources | fixed in `8a270de`; verified in round 2 | The live /compare links 17 distinct external addresses, but three are not sources (its own canonical, genai-wednesday.de, the toolkit repository). The line now gives only the `CHECKED` date, 14 October 2026 (`src/data/compare.ts:5`) |

Waivers: none. Deferrals: none. Follow-ups: none.

## Claims Codex could not check offline, checked by the author on 2026-10-14

- "Live 14 October": `https://croftweaver.com/build.txt` returned `adcc01d898db08fb4a9aa597314cd540f9be0165`, which contains #77's merge commit `84c5e45` (`git merge-base --is-ancestor` succeeds). The live /roadmap serves "An install without Node."; the live /compare serves "Fifty-one skills" and "14 October 2026".
- Weekly tracking still macOS-only: karero/croftweaver `origin/main` at `484bb00`, `skills/search-console-insights/SKILL.md` lines 116 ("macOS only") and 384 (no systemd or cron integration).

## Test record

`npm run check`: 0 errors. `npm run build`: clean. `npx playwright test`: 274 passed, none skipped, on `ecb250d`. Round 2's change is one sentence in the same document, which no test reads.

## Files the change takes

`docs/competitors.md`, plus this trail.

Notes:
- Light depth: the owner named it in chat, and every changed file is prose no agent loads as instructions.
- Two rounds because round 1 found a BUG (the Light rule allows one more round for that).
- The import row in the feature gap table is untouched on purpose: no import was found on karero/croftweaver `main`, its branches or its pull requests on 14 October; the owner is asked where it lives.
- Data check: no credentials, no private names. Destination: Codex only; the repository is public.
