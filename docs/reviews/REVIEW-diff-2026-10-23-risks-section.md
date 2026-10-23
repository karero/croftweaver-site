# DIFF review — branch `content/security-risks` — the section "What can still go wrong with a static website" on /security

Base `046d344` (`main`) · depth: **Normal, without the fresh-eyes pass** (the owner's choice: "Go: build the risks section on content/security-risks now, with the diff review at Normal depth, Codex and GLM 5.3, no fresh-eyes pass.", 2026-10-23) · verdict: **CLEAN at round 2** (no BUG and no RISK in the last round; one NIT pair fixed in a closing edit) · the plan behind the section had its own review in a separate gate (one round, closed by the owner after the fixes without a second round), so this is the first outside review of the built page text.

| Round | Head | Artifact | Reviewers | seconds, tokens per seat | BUG/RISK/NIT (reviewer lines, before dedup) |
|---|---|---|---|---|---|
| 1 | `fec3bdf` | `046d344..fec3bdf` (2 commits, 21 KB), with a record of the plan review's fixes (`--verify`) | codex-cli, gpt-6.1-sol, read-only · melious, glm-5.3, HTTP API | codex 288 s / 75,651 · melious 248 s / 30,288 | codex 2 / 1 / 0 · melious 0 / 2 / 3 |
| 2 | `45b5f75` | `fec3bdf..45b5f75` (the fix commit, 7 KB), with round 1's findings (`--verify`) | codex, effort medium · melious, glm-5.3 | codex 166 s / 52,597 · melious 86 s / 9,689 | codex 0 / 0 / 0 · melious 0 / 0 / 2 |

Gate total from the cost log: 2 rounds, 168,225 tokens (no fresh-eyes pass). Not counted: the fixes, the host's own reading and checks. Estimate said before: 150,000 to 300,000.

Before round 1 the reviewing host read the first commit (`872a6ae`) and had five things fixed first, in `fec3bdf`, so the reviewers never saw them: the list "four kinds of hacked content" held a definition and three kinds (Google's spam policy lists four; the missing one, code injection, is now the claim `g-code-injection`); "the break-in can be over in an hour" had no source (cut); the reasoning "Astro is maintained by Cloudflare employees" had no claim (now `astro-staff`, quoting Cloudflare's post); the owner's account was checked against his own words (no page text changed); the claim `subdomailing` carried three facts (split into `subdomailing` and `subdomailing-example`).

## Round 1 — 6 fixes, 1 refuted (fixed in `45b5f75`)

| id | Sev | Source | Finding | Status | Evidence |
|---|---|---|---|---|---|
| 1 | BUG | codex | "A compromise of Astro's release path would hit every Astro user on any host" is wrong: a built static site does not take up a new release until its owner builds with it | fixed (externally_reverified in round 2) | Now "could reach any site that builds with the compromised release, on any host, not one account" |
| 2 | BUG | codex | "The only code that runs for a visit is one short function" leaves out browser code (the menu script, the analytics script) | fixed (externally_reverified) | Now "The only server-side code that runs for a visit ..." plus "Scripts that run in the visitor's browser are a separate door ..." |
| 3 | RISK | codex | "An outage or a policy change at Cloudflare would reach host, registrar and DNS together" states a failure scope as fact | fixed (externally_reverified) | Now "could expose host, registrar and DNS to the same incident" |
| 4 | RISK | codex, melious | The claim `astro-advisories` names the critical advisory, but its registered command printed year counts only | fixed (externally_reverified) | The command now prints year and severity; run by the host on 2026-10-23 it printed `1 2024 high`, `2 2024 medium`, `2 2025 high`, `2 2025 low`, `7 2025 medium`, `1 2026 critical`, `3 2026 high`, `4 2026 low`, `7 2026 medium` (29; 3, 11 and 15 by year); the sentence ends "one of them rated critical" and the description stays with `astro-critical-range` |
| 5 | NIT | melious | "One point of failure, in three separate ways" contradicts the three points listed | fixed (externally_reverified) | Now "three separate points of failure under one roof" |
| 6 | NIT | codex (open questions) | Two universals in the advice: "runs whatever that domain serves", "The build runs other people's code" | fixed (externally_reverified) | Both now say "can run" |
| X1 | RISK | melious | The claim `astro-cloudflare` says "open governance"; the recorded read of Cloudflare's post does not | refuted | Cloudflare's post, fetched by the host on 2026-10-23, reads: "Astro will remain open source, MIT-licensed, and open to contributions, with a public roadmap and open governance." (the record given to the reviewers quoted it cut short). Astro's own post: "Astro continues to support a wide set of deployment targets, not just Cloudflare" and "Astro's open governance and current roadmap remain in place" |

## Round 2 — no BUG, no RISK, 2 NITs (closing edit, locally_verified)

| id | Sev | Source | Finding | Status | Evidence |
|---|---|---|---|---|---|
| 7 | NIT | melious | The cross-reference "covered under 'A script from someone else' below" is plain text; the page links its other cross-references, and the card has no id | fixed in the closing edit | An id on the card and a link to it |
| 8 | NIT | melious | "Scripts that run in the visitor's browser are a separate door": plural subject, singular predicate | fixed in the closing edit | Reworded |

Questions (UNVERIFIABLE entries) looked at: both reviewers work offline, so most entries were source captures they could not fetch (CISA, GitHub's and Cloudflare's documentation, Google, Spamhaus, Patchstack, Sansec, The Hacker News, Astro). The log kept outside the repository holds the passage read for each claim. The host also read, on 2026-10-23: the advisory counts and ranges (including the two of 22 October, which do not reach astro 7.4.1); Cloudflare's post (16 January 2026: open source under the MIT licence, employees "are now employees of Cloudflare"); Astro's post; Google Search Help 190597 ("likely to be reinfected", no mention of backups); Google's spam policy (four kinds); CISA's page for ED 19-01 (22 January 2019). Reported by the build session and not re-run by the host: the page check (94 of 94 claims), the analytics gate, `npm run check`, the 13 security specs, the cut test (section, claim group and paragraph change removed: all pass), and one full-suite run on `872a6ae` (361 passed); on `fec3bdf` one test (`images.spec.ts`) timed out under a machine load of 575 and passed alone (28 of 28); the pre-push gate runs the whole suite on the final head.

## Owner's constraints, as the section honours them

A labelled judgment with no figure; the comparison covers a typical WordPress site only; the one-Cloudflare-login fact is the owner's statement, marked as such; the owner's account is labelled not independently checkable, names no domain, prints "about two years" as his recollection only, and says "he believes the way in had not been closed". Reported deviations from the plan: prose outside the claims is 777 words (the plan said about 450); `subdomailing` is narrower than the plan's draft; two source labels lost their quote marks; the step "check.spamhaus.org" links a page that answers 403 to the link script (bot-blocked, not dead); the `polyfill` claim leaves out "Chinese".

## Open

None for the gate. Not done: the pull request is not merged and the page is not shipped; both wait for the owner's word. Round 3: not owed. Deferrals: none. Waivers: none.

Notes: before sending, the artifacts were scanned for secrets and for the owner's domain name: none. Destinations: Codex and GLM 5.3 on melious.ai, named by the owner. Closing edit (items 7 and 8): "closing edits not externally re-verified".
