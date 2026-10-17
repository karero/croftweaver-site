# Review: Support, Terms of Use and privacy section 6, 2026-10-17

Why: OpenAI's plugin directory asks every listing for a support, a privacy policy and a terms
address. The owner's instructions: support "a page with some blabla and hello@croftweaver.com",
privacy "go for it", terms "refer to MIT license".

Gate: Normal, Codex and GLM 5.3 on melious. 3 rounds, 14 findings (1 BUG, 8 RISKs, 5 NITs),
clean in round 3. Sources given to the reviewers: the toolkit's LICENSE, its
docs/WHAT-THE-SKILLS-RUN.md (short version, network calls, telemetry) and its SECURITY.md.

## Round 1 (335378e): 1 BUG, 5 RISKs, 3 NITs

Nearly all were claims stronger than the sources. Fixed in d30548d by cutting:
- BUG: "with your own account or key" for every outside call; some calls only read public
  pages or download packages. Now: many calls use your own account or key, others read
  public pages or download packages.
- RISK: "only when you ask for it"; in Claude Code routine commands run without asking. Cut.
- RISK (both seats): GitHub and npm "show us only totals"; not in the sources. Cut.
- RISK: terms section 3 promised ownership of what the skills build and gave the user
  responsibility. Now it says only that we neither see nor check what the skills build.
- RISK: "only the maintainers see the report until it is fixed". Cut.
- NITs: "send us nothing" against the badge fetch; the badge attribution; an imperative on
  the terms page. Fixed.

## Round 2 (d30548d): 3 RISKs, 2 NITs

Fixed in 06ad27b and f7117ea:
- RISK (both seats): the reworded badge sentence claimed Plausible counts the visit as coming
  through the badge; not in the sources. Cut to "the visit is counted on this website as
  described in section 3".
- RISK: section 6 did not say that Astro and Wrangler send anonymous usage data to their own
  makers. Added, from the toolkit's telemetry section.
- NITs: the installer does not run inside the assistant; a sentence starting "Which". Fixed.

## Round 3 (f7117ea): clean

No BUG, RISK or NIT from either seat.

## Test records

`npm ci`, `npm run check`, `npm run build`, `npx playwright test`: 0 errors, 296 passed, none
skipped (round 1); after each fix round `npm run check && npm run build && npx playwright
test`: 296 passed.

## Open, for the owner (not legal advice)

- Terms: no liability clause under German law beside the licence's "as is"; no governing law.
- A German version of /terms, as already open for /privacy.
