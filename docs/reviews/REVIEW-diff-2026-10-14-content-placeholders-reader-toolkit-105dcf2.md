# DIFF review — branch `content/placeholders-reader-toolkit` — Placeholders test: the toolkit's page reader (karero/croftweaver#289)

Base `8dd0a5c` · depth: **Light** (a diff of this site's own test code only: `tests/placeholders.spec.ts`; it adds fixtures and assertions and removes none), Codex alone, `--seat codex --depth light`, `CODEX_EFFORT=medium`, one round because it found no BUG; on top of the author's own two-pass read · verdict: **CLEAN** — 1 round, 4 findings: no BUG, 1 RISK (refuted by measurement), 3 NITs left with reasons · authority used: WORKTREE-WRITE and BRANCH-COMMIT — the owner's task message of 2026-10-14 says to work on a branch in `~/Devel/croftweaver-site` itself, and the owner answered "Yes, use it" in chat when asked whether that folder could leave `main` while the idle "Website quote formatting" session had it as its folder; this session made the branch and its commits. GATED-THIS-DIFF — Codex's round below, on `8dd0a5c...105dcf2`.

Data consent: Codex reviewed this repository before (karero/croftweaver-site#67). The artifact (brief and diff) was read for secrets before the round: none.

| Round | Head | Artifact | Reviewers | seconds, tokens | BUG/RISK/NIT |
|---|---|---|---|---|---|
| 0 | `105dcf2` | full diff against `8dd0a5c` | the author, by hand: pass 1 (correctness) and pass 2 (consistency), `website-review` | — | 0 / 0 / 3 |
| 1 | `105dcf2` | brief, run results and full `8dd0a5c...105dcf2` | Codex CLI, gpt-6.1-sol, medium, read-only | 286 s, 80,540 | 0 / 1 / 0 |

| id | Sev | Source | Round | Finding — one line | Status | Evidence |
|---|---|---|---|---|---|---|
| A1 | NIT | author, pass 2 | 0 | the comments above `fold` ("read twice", "one of the two readings") and above the fixture asserts ("only one of the two readings") predate the third reading | left, so the file stays the toolkit's | same words in the toolkit's copy at `8ed1f37`; to be fixed there and taken from there |
| A2 | NIT | author, pass 2 | 0 | `tests/TESTS-VERSION` names `0597a28` (release 0.31), and this file now comes from `034472d`, which is in no release | left; stated in the pull request | between 0.31 and `034472d` the toolkit also changed `email.spec.ts` and `check_analytics_gate.sh`, which this change does not take, so moving the stamp would be untrue. The toolkit's `scripts/whats-new.sh` keeps listing `placeholders.spec.ts` as changed since the stamp, although the site's copy now differs from the toolkit's by one line (run 00) |
| A3 | NIT | author, pass 1 | 0 | the toolkit's two logged limits of `readPage` (a leftover at the start of an inline element right after another with no space; `cloneNode` building registered custom elements a second time) hold here too | left | the first is named in the reader's comment. For the second, `src/` and `public/` register no custom element (`customElements.define`, `extends HTMLElement`: no hits) |
| C1 | RISK | Codex | 1 | the SVG fixture checks only that `janedoe` is found, so a probe that ignores the namespace might still pass through some other boundary | refuted — measured | with the probe changed back to `document.createElement(tag)`, the fixture test fails on that assert and on no other (run 07 below) |

Waivers and deferrals: none.

Runs (command, whole output and exit status kept in this session's scratchpad; head `105dcf2` unless said):

| # | Command | Result |
|---|---|---|
| 00 | `diff` of the toolkit's file at `8ed1f37` against this branch's | only the `UNFILLED_UNTIL_LAUNCH` line differs |
| 01 | `npm ci` | exit 0 |
| 02 | `npm run check` | exit 0 |
| 03 | `npm run build` | exit 0 |
| 04 | `npx playwright test` (port 4725, from `SITE.url`) | 274 passed, none skipped, none flaky; exit 0 |
| 05 | fixture test only, the served reading removed (`copy = [bounded.join(''), served.join(' ')]`) | 1 failed, first on the floated first letter (`johndoe`); exit 1 |
| 06 | as 05, the fixture asserts made `expect.soft` | exactly the four served-only fixtures fail: `johndoe`, `musterstrasse`, `maxmustermann`, `erikamustermann`; exit 1 |
| 07 | fixture test only, the probe built with `document.createElement(tag)`, asserts soft | exactly `janedoe` fails; exit 1 |

Each mutation was made in the working tree and undone with `git checkout` before the next step; the tree was clean after each.

Follow-ups: A1, in the toolkit's copy. Not this site's to change alone.

Notes: UNVERIFIABLE entries, asked/confirmed: round 1 3/0. Codex had no access to the toolkit's repository, so it could not confirm that the file matches the toolkit's except for one line (run 00 does), nor see the whole run logs. It read one sentence of the brief ("do not re-raise unless you disagree with the reason") as an attempt to steer it, and said so; the sentence asked for a reason before re-raising and did not forbid it. `bash tests/check_analytics_gate.sh` was not run locally; CI runs it.
