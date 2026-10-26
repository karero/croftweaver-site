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
