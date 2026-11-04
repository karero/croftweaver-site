# DIFF gate: the card check stops with one plain line when the log file is missing (branch fix/card-check-missing-log)

Follow-up from the #168 merge-link review. Depth: Normal, because the change is to a check script's logic (not Light). Seats: Codex and GLM 5.3 on melious. Base origin/main c04788c.

Checks before round 1: `npm run build`, then `bash tests/check_case_study_card.sh` (all checks passed, including the new missing-file scenario) and `bash tests/check_case_study_audit.sh` (all checks passed). Mutation by hand: with the old static import put back, the new scenario fails (exit 1, an `ERR_MODULE_NOT_FOUND` stack trace instead of the line).

## Round 1 (head d622b15)

Codex: no findings. GLM 5.3: 1 RISK, 4 NITs. Gate 20261104T221601Z-87340, 37,739 tokens.

- RISK, the dynamic `import()` of a `.ts` file may not get type stripping where the static import did: refuted. The local run (Node 26.13) loads the log through the dynamic import, and every C1–C5 check after it ran. CI runs the same script on Node 24 for every pull request, so a loader that refused it would fail the check loudly; this pull request's own pipeline is that check.
- NIT, the script assumes the repository root as its folder: refuted. Line 6 already changes to the root (`cd -- "$(dirname -- "$0")/.."`).
- NIT, no `node_modules` gives a misleading failure: re-sorted, rare. CI installs before this step, and without `node_modules` the main run fails anyway, loudly.
- NIT, a file removed between the check and the import: re-sorted, rare. Nothing deletes the log while the check runs.
- NIT, the message is written in two files with no pointer: fixed. Each copy now names the other.
