# DIFF gate: karero/croftweaver-site#145 (private case-study links; Squarespace row)

Depth: Normal (shipped page code and two test changes; no box, user data, logins, money, deletion
or schema). Seats: Codex, GLM 5.3 (melious out of credit, "Required: 85, Available: 0", so GLM ran
on ollama as the script's stand-in), and a fresh-eyes host pass.

## Round 1 (2026-10-26, base 88c032e, head fd8dd8c)

Codex: 2 RISK (1,333 s, 39,794 tokens). GLM 5.3 on ollama: 1 RISK, 4 NIT (234 s). Fresh-eyes: 1 BUG,
1 RISK, 5 NIT (143 s, 83,992 tokens).

| # | Seat | Kind | Finding | Disposition |
|---|---|---|---|---|
| 1 | fresh | BUG | the case study's lead still says each change "links the pull request" | fixed: "names the pull request (linked where its repository is public)" |
| 2 | fresh, GLM | RISK / NIT | a private entry without `checks` would say "The checks are in the pull request", which a visitor cannot open | fixed: the LOG loop refuses a private pull request without its own checks; seen to fail with #53's checks removed |
| 3 | Codex | RISK | privacy rests on a 404 alone | refuted: `gh api repos/GenAI-Wednesday/GenAI-Wednesday.de` gave private=true, visibility=private, and #53, #57, #58 merged; anonymous curl gave 404 for each (2026-10-26) |
| 4 | Codex | RISK | the substring entry would also match another repository such as `GenAI-Wednesday.de-tools` | fixed: the entry ends in `/` (checked with node: the PR URL matches, `-tools` does not) |
| 5 | GLM | RISK | the consumer may compare hostnames or skip, not fail | refuted: `tests/links.spec.ts` matches `href.includes(domain)` and fails on any match (`toEqual([])`); seen to fail with the links put back |
| 6 | fresh, GLM | NIT | the header says the list starts empty and holds domains | fixed: "Started empty…; an entry may also be a path on a domain" |
| 7 | fresh | NIT | `PRIVATE_REPOS` not tied to `PR_REPOS` | fixed: typed as members of `PR_REPOS` |
| 8 | fresh, GLM | NIT | the a11y test hard-codes the private repository | declined: a new private repository makes it fail, the safe direction; building the pattern from data would need a regex built from a variable |
| 9 | fresh | NIT | link match is case-sensitive | declined: rare; the data's repository check is exact-case |
| 10 | GLM | NIT | dropping "no free plan" loses a data point | declined: the owner's decision of 2026-10-26; the rule in `src/data/compare.ts` says the page never says what another product lacks |
| 11 | fresh | NIT | the short answer's Webflow line arguably says what its free plan lacks | out of scope; named to the owner |

## Round 2 (2026-10-26, delta fd8dd8c..c2817b0), verification

Earned by row 1 (BUG). Codex: 1 RISK, 1 NIT (312 s, 42,186 tokens). Second seat: none (melious out of
credit; ollama at its usage limit). Fresh-eyes: rows 1, 2, 6, 7 FIXED; 8, 9, 11 declines hold; row
4's fix broke something (row 12); 1 RISK, the same as Codex's (47 s).

| # | Seat | Kind | Finding | Disposition |
|---|---|---|---|---|
| 12 | Codex, fresh | RISK | row 4's trailing `/` lets a link to the repository's root (`…/GenAI-Wednesday.de`, `#readme`, `?tab=…`) pass the guard | fixed: the slash is removed, so the entry matches the root and every path again (checked with node) |
| 4 | Codex | RISK | (round 1) the entry also matches a repository whose name starts the same, such as `-tools` | re-sorted: rare. No such repository exists or is linked, and a match fails loudly, not silently |
| 13 | Codex | NIT | the short answer's Webflow line stays | out of scope, as row 11 |

## Round 3 (2026-10-26, delta c2817b0..621dd12), verification

Earned by row 12 (RISK). Codex: No BUG/RISK/NIT findings (1,280 s, 28,815 tokens). Second seat:
none (melious out of credit; ollama at its usage limit).

## Verdict

DIFF gate clean on 621dd123036409feaf708b59cea9a4c81466471e: no open BUG or RISK. 3 rounds, 13
findings (1 BUG, 6 RISK, 6 NIT): 7 fixed, 2 refuted, 1 re-sorted as rare, 3 declined or out of scope.
GLM 5.3 took part in round 1 only (on ollama, melious being out of credit); rounds 2 and 3 had no
second model seat, and round 2 had the fresh-eyes pass. Nothing changed after round 3 except this
record. Cost: Codex 3 runs, 2,925 s, 110,795 tokens; GLM one run, 234 s; fresh-eyes 2 rounds,
190 s, 91,552 tokens.
