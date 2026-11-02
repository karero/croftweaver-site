# Review — home proof strip, measured figures first

Branch `claude/audit-followups-9daedf`. Owner decision 2026-10-27 (option B of three), after the
follow-up growth audit of the same day: "Option B: lead the strip with measured figures and move
the score table to /more-proof. Write the one-page plan and review it."

## PLAN gate (Normal)

Plan: `home-proof-measured-first-plan-2026-10-27.md` in the session group's shared notes folder,
outside the repo. Both rounds Codex alone: melious out of balance; by the owner's rule
(2026-10-27) no rerun was owed.

| round | codex | findings | outcome |
|---|---|---|---|
| 1 | 281 s, 75,608 tokens | 1 BUG, 1 RISK | BUG: the plan said the /more-proof share card names the three scores; it does not (only the description does). Fixed in the plan. RISK: the planned guard could pass with a score as "9 out of 10" or placed before the list. Fixed: ordered checks and a wider regex |
| 2 | 244 s, 59,231 tokens | 1 RISK | The guard still overclaimed (a "9 of 10" placed above the heading). Fixed: the test checks the section's exact child order, and the plan states what it does not cover. No BUG open, so the gate closed |

## DIFF gate (Normal)

Shipped page copy. Seats: Codex and GLM 5.3 on melious. Evidence: the plan, the test run and
the mutation self-check.

Runs on `f04e01e`: `npm ci`, `npm run check`, `npm run build` exit 0;
`npx playwright test tests/positioning.spec.ts` 21 passed. Mutation self-check, each applied to
`src/pages/index.astro`, the test run, the file restored; every one red on the expected assertion:
the old strip from `origin/main`; a `<p>` with "8.3" above the heading; "9 out of 10", "9/10" and
"8.3" in the opinions line; "rated" instead of "named" in the first figure.

### Round 1 — `f04e01e`, base `df70d0f`
`codex OK` 162 s (69,514 tokens) · `melious OK` 378 s (26,418 tokens)

| id | sev | seat | status | why |
|---|---|---|---|---|
| M1 | NIT | melious | refuted | The test names genai-wednesday.de while the page renders `SITE_PROOF.site`. /proof shows that one site by owner decision (2026-10-04); a change of site is a rewrite of /proof and the home copy, and the test's message names what to look at |
| M2 | NIT | melious | refuted | README's Lab re-read note names only more-proof.astro. The home line ("Those are opinions, not measurements") is the site's own wording, not one of the Lab's caveats, so a change at the Lab does not touch it |
| M3 | NIT | melious | fixed | The test's failure message and comment overstated what the regex means; both now name the forms caught (8.3, 8 out of 10, 8/10) and those not caught ("8 of 10", words) |
| — | — | melious | checked | "/proof has the two questions, the counts for each assistant": `src/pages/proof.astro:169-199` lists both questions and one row per assistant |

Codex: no findings.

### Round 2 — `555d0ce`, delta from `f04e01e` (`--verify` round 1)
`codex OK` 145 s (22,170 tokens) · `melious OK` 86 s (7,486 tokens)

Both seats: M3 fixed in full, nothing new. Both repeated M1 and M2 as open NITs; they stay
refuted for the reasons above.

Stop: no BUG and no RISK. Gate closed on `555d0ce`.
