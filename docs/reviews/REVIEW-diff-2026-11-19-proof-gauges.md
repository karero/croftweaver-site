# DIFF review: the PageSpeed gauges on /proof, and PROOF moved to the 19 November 2026 runs
Base `2c13f02` · depth: Normal · verdict: CLEAN at round 3 (no BUG or RISK open) · 3 rounds, 10 findings (11 raised, one by both seats)

Task: `ScoreGauges.astro` on `/proof` (four rings and the Agentic Browsing pill), `PROOF`, `PROOF_MEASURED` and the new `AGENTIC` record in `src/data/proof.ts` moved to the three runs of 19 November 2026, the build-time check that ties them together, the new tests in `tests/a11y.spec.ts`, one string in `tests/seo.spec.ts`, `POSITIONING.md` and `STORY.md`, the evidence under `docs/evidence/`, and the two remade PDF decks.

Seats: Codex gpt-6.1-sol (read-only) alone every round, and a fresh-eyes Sonnet subagent in round 1. The plan named Codex and GLM 5.3 on melious for this gate; the owner's rule for seats (Codex alone unless the diff touches a risky topic; nothing here does) was applied instead, and GLM was not run. Round 2 and 3 were deltas.

| Round | Head | Seconds, tokens |
|---|---|---|
| 1 | `81688d1` | Codex 230 s / 74,062; fresh-eyes 186 s / 171,046 |
| 2 | `1a42ae9` | Codex 128 s / 73,901 |
| 3 | `da4c860` | Codex 70 s / 55,414 |

| Sev | Round | Finding | Status | Evidence |
|---|---|---|---|---|
| RISK | 1 | The contrast measure of the four numbers over a ring ignored their alpha and opacity (Codex and fresh-eyes) | fixed | The test now needs an opaque `rgb()` ink and an opacity product of 1; mutations `opacity: .4` and an `rgb(… / .4)` ink both fail the readable test |
| RISK | 1 | A filled ring would put the number on its own colour unseen | fixed | The computed fill of `.arc` and `.track` must be `none`; mutation `.track { fill: … }` fails |
| RISK | 1 | "Ring is shown" read only the arc's own `display`, so a hidden parent passed | fixed | `checkVisibility` with opacity and CSS visibility, plus the svg's width above 0; mutation `display: none` on the svg fails |
| RISK | 1 | The ring test read the `stroke-dasharray` attribute, which a stylesheet rule overrides | fixed | It reads the computed style; mutation `stroke-dasharray: 0 999` fails the ring test |
| NIT | 1 | The axe count of 4 could be loosened by someone | fixed | A comment says to edit the count, not loosen it |
| NIT | 1 | The evidence note's sentence about an earlier run at 4:12 PM had no record in the repository | fixed | Cut |
| NIT | 1 | Checks were last run on `ed682f7`, not on the head | fixed | All re-run on the head after round 3 (see below) |
| NIT | 1 | `docs/evidence/…-psi-apreet-com-mobile.jpg` shows a stock portrait from apreet.com's own public page | not changed | Unedited screenshot of a public page; named in the PR for the owner to decide |
| RISK | 2 | The computed dash array was parsed without its units, so a percentage override passed | fixed | The string must match two lengths in px; mutation `stroke-dasharray: 100% 100%` fails the ring test |

Round 3: No BUG/RISK/NIT findings. Its UNVERIFIABLE entries ask for a raw runner record of the mutation results; the loop's output is quoted in the PR, and each row above was run on the commit that carries its fix.

Deviation from the plan, approved by the manager after round 3: the plan's T4 asks that axe's `incomplete` list for `#speed .gauges` be empty. On the built page axe cannot see a background behind text drawn over an inline SVG, so it leaves the four numbers over the rings undecided (light and dark). T4 instead holds exactly four undecided nodes, each a `.num` with axe's `imgNode` reason, and measures those numbers by hand at 4.5:1 against the first opaque background up the tree (no image or gradient on the way, opacity product 1, opaque ink); every circle of a ring must have no fill, so nothing painted sits under the number. Codex confirmed the reason in axe's source and raised only the findings above about the replacement.

After round 3 the manager's conditions changed two guards (the `imgNode` reason in the allowlist; the fill check over every circle and path instead of two). The round budget allows no round 4 without a finding that earns it, and round 3 was clean. At the owner's request the delta (`da4c860..44b6319`, 15 lines of `tests/a11y.spec.ts`) was read once by Codex (verification read, no `--round`, so not counted as round 4; 86 s, 46,784 tokens): no BUG, RISK or NIT. It confirmed both conditions and axe's `imgNode` source lines, and ran the contrast function (1.25:1 light, 1.44:1 dark). Its two UNVERIFIABLE entries asked for a browser trace; it was taken on the head: baseline 2 passed; ring numbers only in `var(--line)` fails at "a number over a ring against the page" (`toBeGreaterThanOrEqual`) in both themes; every `.num` in `var(--line)` fails at axe's violations list; a solid fill on the track fails at "a ring has a painted fill (rgb(46, 110, 78), none)" in light and the dark equivalent. The delta is also covered by mutations: changing the colour of the ring numbers only fails through the hand measure (1.25:1 against 4.5:1); changing every `.num`, the plan's mutation, fails earlier through axe, because the pill's number is decided by axe; a solid fill on the track fails the fill check.

Known limit, as in the plan: every value is 100, so the track is decoration; for a score below 100 the track colour `var(--line)` is far below 3:1 and nothing tests it.

Mutation loop: the `mutation-check` helper's load gate cannot pass on this machine, so a script applied each edit to the working tree, ran the new tests, and restored. 18 mutations, all fail their test, the T4 ones re-run on the final head (the two build-stop mutations print the check's own message).
