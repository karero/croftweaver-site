# DIFF review — PR #135 — a plan approval counts as the owner's merge ask

Base `7afae6c` (`main`) · depth: **High** (the rule decides when an agent may merge: the skill's "permissions" row; the brief asked for Normal at least) · verdict: **CLEAN at round 5**, wording pass below · authority used: POST AUTHORITY, WORKTREE-WRITE, BRANCH-COMMIT — atom A, this session created the PR, the worktree `croftweaver-site-quoted-go` and the branch `docs/merge-rule-quoted-go`.

| Round | Head | Artifact | Reviewers | seconds, tokens | BUG/RISK/NIT |
|---|---|---|---|---|---|
| 1 | `3f7bc81` | full, `7afae6c...3f7bc81` | codex-cli 0.164.0, gpt-6.1-sol, effort config, read-only · melious glm-5.3 · fresh-eyes Opus sub-agent | codex 90 s / 42,825 · melious 19 s / 2,877 · fresh-eyes 121 s / 101,863 | 1 / 6 / 3 |
| 2 | `2048ffc` | delta since `3f7bc81` | same three | codex 123 s / 42,187 · melious 71 s / 8,823 · fresh-eyes 103 s / 95,494 | 1 / 2 / 4 |
| 3 | `a40008e` | delta since `2048ffc` | same three | codex 120 s / 38,837 · melious 78 s / 10,658 · fresh-eyes 100 s / 96,542 | 0 / 2 / 3 |
| 4 | `4a863ef` | delta since `a40008e` | codex, melious | codex 155 s / 48,102 · melious 65 s / 10,019 | 0 / 1 / 1 |
| full read | `4a863ef` | full, `7afae6c...4a863ef` | fresh Opus sub-agent (Kimi on ollama failed: weekly quota) | 144 s / 108,808 | 0 / 2 / 4 |
| 5 | `bf6a5eb` | delta since `4a863ef` | codex, melious | codex 102 s / 48,597 · melious 37 s / 6,733 | 0 / 0 / 1 |

Gate total from the cost log: 5 rounds, 259,658 tokens for the scripted seats; the Opus seats add 402,707.

## Findings

| id | Sev | Source | Rd | Finding | Status | Evidence |
|---|---|---|---|---|---|---|
| F1 | BUG | fresh-eyes | 1 | "the pull requests the plan names" grants more than the global rule: any session's PRs, no clean review, no stops | fixed `2048ffc` | scope became the session's own PRs once review is clean |
| F2 | RISK | melious, fresh-eyes | 1 | a plan names steps, not PR numbers | fixed `2048ffc` | same |
| F3 | RISK | melious | 1 | the quote need not include the plan's PR list | fixed `2048ffc` | scope no longer depends on it |
| F4 | RISK | fresh-eyes | 1 | the grant would also allow auto-merge | fixed `2048ffc` | auto-merge excluded |
| F5 | RISK | fresh-eyes | 1 | the owner's preview look could be skipped | fixed `2048ffc` | "a check of the owner's own that the plan names" stays with the owner; "Preview before merging" unchanged |
| F6 | RISK | codex, fresh-eyes | 1 | the started session cannot verify the quote | refuted | the owner's global rule step 5 accepts this: "A session started for one step of the plan has the same go when its brief quotes his words." A check that rule lacks would recreate the conflict |
| F7 | NIT | melious | 1 | "since 2026-10-24" has no scope | refuted | the file's convention ("since 2026-10-13", "since 2026-10-14") |
| F8 | NIT | fresh-eyes | 1 | §5 summary not updated | refuted | the grant "counts as the owner asking in chat", so §5 stays true and defers to §2 |
| F9 | BUG | codex | 2 | a planned PR into `production` would qualify, and that publishes | fixed `a40008e` | grant limited to PRs into `main` |
| F10 | RISK | melious | 2 | the deploy stop was missing | fixed `a40008e`, reworded `4a863ef` | "a pull request that publishes the live site" |
| F11 | RISK | fresh-eyes | 2 | the permissions, logins, user data, money, deletion, schema stop was missing | fixed `a40008e` | stop added; "the box" left out, the site runs on Cloudflare Pages |
| F12 | NIT | fresh-eyes, melious | 2 | the merge did not pin the reviewed commit | superseded by F21 | — |
| F13 | NIT | melious | 2 | "once their review is clean" attached ambiguously | fixed `a40008e` | sentence rebuilt |
| F14 | NIT | fresh-eyes | 2 | AGENTS.md defines no review gate | refuted | the grant applies only under the owner's plan, whose rules name the gate |
| F15 | NIT | melious | 2 | checks re-run red while waiting | refuted | "if they are red, it reports that and does not merge" |
| F16 | RISK | fresh-eyes | 3 | the `--match-head-commit` pin clashes with the trail commit pushed after review (PRs #132–#134) | fixed `4a863ef` (cut: pin removed) | — |
| F17 | RISK | codex | 3 | the pin's server-side effect is unproven | fixed `4a863ef` | flag removed |
| F18 | NIT | melious | 3 | the second example command lacked the pin | fixed `4a863ef` | pin removed |
| F19 | NIT | fresh-eyes, melious | 3 | the date attached to the auto-merge clause only | fixed `4a863ef` | "Since 2026-10-24, the owner's approval …" |
| F20 | NIT | fresh-eyes | 3 | "deploys" could include the preview rebuild | fixed `4a863ef` | "publishes the live site" |
| F21 | RISK | codex (r4), full read | 4 | with the pin gone, a fix pushed after a clean review could merge | fixed `bf6a5eb` (cut: strict rule) | "clean on the commit merged (a later commit may only add that review's record under `docs/reviews/`)"; codex verified PRs #132–#134 end in such a commit |
| F22 | RISK | full read | fr | the session given the approval directly had no place in the grant | fixed `bf6a5eb` | "given to a session in chat or quoted word for word in the brief …" |
| F23 | NIT | full read | fr | "these rules" had no clear referent | fixed `bf6a5eb` | "(this file included)" |
| F24 | NIT | full read | fr | "deletion" could mean deleting pages | fixed `bf6a5eb` | "data deletion" |
| F25 | NIT | full read | fr | no mention of the round-8 stop | refuted | a gate past round 8 waits on the owner and is not clean |
| F26 | NIT | full read | fr | §5 summary, again | refuted as F8 | no new evidence |
| F27 | NIT | melious | 4 | "publishes the live site" would swallow every PR if `main` published | refuted | `origin/production` exists; `scripts/ship.sh` pushes `main:production`; AGENTS.md "Two-stage" |
| F28 | RISK | codex | 4 | the grant relied on the global reviewed-SHA rule, unstated here | fixed `bf6a5eb` | same text as F21 |
| F29 | NIT | melious | 5 | "given in chat" had no session of its own | fixed `27e2ff7` | "given to a session in chat" |

Checks before round 1: `npm run check` 0 errors, `npm run build` green, `npx playwright test` 421 passed; after the last wording, `tests/placeholders.spec.ts` 26 passed.

## Notes

- Round 4 was earned by F16 (kind `commit-pin`, cut: the pin removed). Round 5 by F21 and F22 (kinds `commit-pin`, `direct-go`; `commit-pin` came back, so its fix is a strict rule, not a patch).
- Final full read: Kimi on ollama failed on its weekly quota; a fresh Opus pass stood in.
- Wording pass: Codex over `bf6a5eb..` (F29's wording and this file), see the PR comment.

## Open

Nothing for the gate. Not merged: this change is the merge rule itself and touches permissions, so it needs the owner's go in chat.
