# DIFF review: croftweaver.com wording after the move to Workers
Base `4fb48a2` · depth: Normal · verdict: CLEAN at round 4 (no BUG or RISK open) · 4 rounds, 26 findings from the reviewers and 1 from the host

Task: the wording of the site brought in line with the Worker that has served croftweaver.com since 2026-11-18. The change touches `AGENTS.md`, `astro.config.mjs`, `wrangler.jsonc` (comments only) and `tests/` (a new `workers-config.spec.ts` and the stamp); it does not touch `package.json`. Seats: Codex gpt-6.1-sol (read-only, medium) and GLM 5.3 on melious every round; a fresh-eyes Sonnet subagent in round 1. The review ran in a worktree of its own, `croftweaver-site-q2`.

| Round | Head | Seconds, tokens |
|---|---|---|
| 1 | `020876c` | Codex 200 s / 79,303; GLM 381 s / 34,386; fresh-eyes about 271 s / 158,578 |
| 2 | `211d762` | Codex 162 s / 105,251; GLM 445 s / 40,865 |
| 3 | `6f2181c` | Codex 119 s / 47,998; GLM 114 s / 13,401 |
| 4 | `4ab19b9` | Codex 85 s / 41,787; GLM 84 s / 11,266 |

| Sev | Round | Finding | Status | Evidence |
|---|---|---|---|---|
| BUG | 1 | `PUBLISHING.md` named the Pages project's Rollback for a Worker | fixed | The Worker's Deployments page, or `npx wrangler deployments list` then `npx wrangler rollback <version-id>` |
| BUG | 1 | `PUBLISHING.md`: `wrangler deployments list` has no "Active" field | fixed | The bullet names the `Workers Builds: croftweaver-site` check and the deployment list |
| BUG | 1 | `PUBLISHING.md`: "workers.dev is not this site's" against `preview_urls: true` | fixed | The sentence states only the two settings |
| BUG | 1 | `workers-config.spec.ts`: a message about script order that nothing shows | fixed | "a script of its own is not part of this site's setup"; recorded in `tests/TESTS-VERSION` |
| RISK | 1 | Pre-build bullet sent new-page checks to the Pages hash URL | fixed | It says the hash URL shows the Pages copy, not the Worker |
| RISK | 1 | Copy date of the spec had no evidence | refuted | The file's modification time in the earlier session's folder was 2026-11-18 21:57 |
| RISK | 1 | Method sentence of `/security` widened to the new sources | fixed | Back to 22 and 23 October, with one new sentence for the later sources |
| RISK | 1 | Owner's sentence named the Worker, which the owner did not say | fixed | Registrar and DNS zone only; the Worker's `account_id` is the site's own fact |
| RISK | 1 | No evidence the domain is on the Worker and not on Pages | fixed | The Pages project lists only its `pages.dev` domain; claim `site-moved-to-workers` |
| NIT | 1 | Move date had no registered claim; four live results dated before the move; `SETUP.md`, README row 11, `AGENTS.md` ruleset, `checks.astro`, `wrangler.jsonc` comment and a garbled spec token | fixed | Claims re-run (same results) and re-dated; wording corrected; the ruleset on `main` requires `Cloudflare Pages`, said in `AGENTS.md` |
| NIT | 1 | Spec calls `workersConfigs()` at module scope | refuted | With a trailing comma in `wrangler.jsonc` Playwright prints the file, the cause and the position, then exits |
| NIT | 1 | The deck copies a "Runs code" step that says there is none | refuted | The step on `main` already read that way under the same label |
| RISK | 1 | Host: five file claims no longer cited their text after lines were added above them | fixed in round 1, wrongly | See round 3 |
| BUG | 2 | File-claim ranges cite current files, links pin to `7b18dd7` | fixed | The new claim became a command claim |
| RISK | 2 | Bare `npx wrangler rollback` | fixed | `npx wrangler rollback --help` prints `[version-id]`; the sentence names it |
| NIT | 2 | Stamp says "wording fixes in the file's comments"; one is a message | fixed | "one in a comment and one in a test's message" |
| NIT | 2 | Heading "before its build is Active" | not changed | Unchanged context outside this change |
| BUG | 3 | At `7b18dd7` the ranges of `site-publish`, `site-publish-owner`, `site-hsts`, `site-dashboard-switches` cite other text | fixed | The same ranges were already wrong on `main`. Now L139-L145, L201 and L216-L223, each read with `git show 7b18dd7:<file>`; `site-canonical-url`, `site-one-function` and `site-headers` read the same way and right |
| BUG | 3 | The grep of `site-moved-to-workers` printed line 12, the date is on line 11 | fixed | `grep -n -B1` prints both lines |
| NIT | 3 | The rollback sentence was one 145-character line | fixed | Rewrapped |

Rounds past 3 were earned by the file-claim ranges and the command claim's coverage. The cut named for round 4: ranges are read from the pinned commit, not worked out from the working tree, and the move claim cites no README lines.

Deferrals: none. Left as they are, recorded by GLM as outside the change: the "Active" heading; after merge, the move claim runs against a clone of `main`, whose README lines 11 and 12 carry the date and the phrase.

After the last edit: `npm run check` clean, `npm run build`, both decks current (`build-deck --check`), the eight shell checks (`tests/check_*.sh`), and the full Playwright suite (552 passed) on the head with the trail added.
