# DIFF review — docs/plausible-instance-facts — the README records Plausible's version and the daily salt, as read from the box

Base `origin/main` (`70c33fe`) · depth: **Light** (README prose for people; no page text, no code) · verdict: **CLEAN after fixes** — no BUG; 2 RISKs, both fixed; 1 pre-existing stale line outside the diff, fixed · closing edits not externally re-verified (Light: one round, one more only on a BUG) · authority used: BRANCH-COMMIT and POST AUTHORITY — the owner's instruction of 2026-10-12, "push open PR".

| Round | Head | Artifact | Reviewer | seconds, tokens | BUG/RISK/NIT |
|---|---|---|---|---|---|
| 1 | `0a32887` | full `origin/main...0a32887`, plus the owner's pasted box output as an evidence note | codex-cli, gpt-6.1-sol, effort medium, read-only, `--seat codex` | 82 s / 35,019 | 0 / 2 / 0 in scope; 1 line outside it |

| id | Sev | Source | Finding — one line | Status | Evidence |
|---|---|---|---|---|---|
| R1 | RISK | codex | "daily salt, CONFIRMED" treats two insertion timestamps as proof of daily replacement and deletion; they do not show which salt an identifier uses, so section 3's "can no longer recognise that browser" stays unsupported | fixed `88c2e14` — locally_verified | the label is now OBSERVED; the text says the snapshot fits daily replacement, "does not show which salt an identifier is built from or when a value stops being used", and that section 3's recognition sentence "is not confirmed by it"; the 16-random-bytes, daily and 48 h statements are marked as Plausible's source (master), not read from v3.2.1 on the box |
| R2 | RISK | codex | `docker inspect … .Config.Image` names an image reference, not a running state or a deployed-code identity; "runs v3.2.1" is too strong | fixed `88c2e14` — locally_verified | the text now reads "returns the image tag … That is the tag the container was created from, not a digest, and the lookup did not record whether it was running" |
| O1 | NIT, outside the diff | codex | README line 187, "Nothing here is recorded yet", was already stale | fixed `88c2e14` — locally_verified | the clause is removed; `rg "Nothing here is recorded"` finds no other use, and no test pins it |

Reviewer questions (UNVERIFIABLE entries), and how the text now stands:
- Whether `inserted_at` is UTC: the column has no zone and the schema was not read. The README says "read here as UTC, which the database clock's +00 offset at 20:55 suggests", and does not claim it as shown.
- The master-branch claims (16 random bytes, daily replacement, 48 h clean-up) have no commit or source citation. The README labels them as from Plausible's source and not read on the box. Pinning a commit is open (below).

Open, outside this change:
- Section 3 of `src/pages/privacy.astro` says that once the value is replaced the tool "can no longer recognise that browser". The lookup does not confirm it, and Plausible's source also tries the previous salt for a visit open at midnight (author's reading of master, not checked on v3.2.1). Changing legal page text is High depth; not done here. The README now says it is unconfirmed.
- The master-source claims could be pinned to a v3.2.1 commit and a file path. Not done.

Test records: pre-push gate on head `0a32887`, `npm run build` then `npm test`: 224 passed, "pre-push gate passed", exit 0 (the push went through). The fix commit `88c2e14` and this file change README and `docs/reviews/` only; its own gate result is in the PR.

Notes:
- Standard pair not run: Light depth, Codex alone, by the owner's standing choice for README prose (CLAUDE.md, "Review before merge"). `ollama list` auto-detect printed a note; `--seat codex` ran Codex only, so nothing went to ollama.
- Data check: the artifact holds no credentials; the repository is public. Destination: Codex only, as in the earlier gates of this session (the owner's consent of 2026-10-12).
