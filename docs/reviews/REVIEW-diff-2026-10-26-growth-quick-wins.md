# DIFF gate: /compare, /from-wordpress and /security quick wins (branch content/growth-quick-wins)

Depth: Normal (page copy and two new text tables; no box, user data, logins, money, deletion or
schema). Seats: Codex, and a fresh-eyes host pass in round 1 (a read-only sub-agent on Sonnet with
only the diff, the repo and the evidence). GLM 5.3 on melious ("Insufficient balance") and ollama
(429, session limit) were out of quota on every run, so the external seat was Codex alone.

Evidence sent with rounds 1 and 2: the wordpress-inspector SKILL.md of karero/croftweaver at
v0.33, excerpts with line numbers.

## Round 1 (2026-10-26, base 88c032e, head 95b56ee)

Codex: 1 BUG, 2 RISK (596 s, 77,343 tokens). Fresh-eyes: 3 BUG, 4 RISK, 4 NIT (304 s, 168,811
tokens). The site's own Playwright run on 95b56ee also failed three table tests (row 1).

| # | Seat | Kind | Finding | Disposition |
|---|---|---|---|---|
| 1 | Codex | BUG | links alone in a cell of the new /security table lack `class="tap"` | fixed (f4ddf7a): `tap`, and `long-head` for the long row headers; the three table tests pass |
| 2 | fresh | BUG | guide line "or a web framework made for applications" has no section behind it | fixed: cut; the line restates the #apps group |
| 3 | fresh | BUG | guide line "several people edit in the browser" is not what #cms says | fixed: "A site you edit on the site itself, extended with plugins" |
| 4 | fresh | BUG | a summary row bundled items from three sections; the Dependabot row linked the wrong section | fixed: row split, links point where each item is |
| 5 | fresh | RISK | "reaches no PHP, no database and no admin login" unscoped | fixed: "the Croftweaver template holds no PHP files" |
| 6 | fresh | RISK | the function stated to run on every request, flat | fixed: attributed to Cloudflare's documentation, "by default" |
| 7 | fresh | RISK | summary rows are not registered claims and can go stale | see rows 18 and 21 |
| 8 | fresh | RISK | "Fixes each finding before launch" overstates the assistant's part | fixed: "Fixes the findings it can … and asks you about the rest" |
| 9 | fresh | RISK | "lists any it refuses" misses the cases where nothing is written | fixed: "It lists what it refuses, or why it wrote nothing" |
| 10 | Codex, fresh | RISK | "not where you decided" needs the decisions sheet | fixed: "given your decisions sheet" |
| 11 | Codex | RISK | template and launch-step facts lack inspected support | see row 17 |
| 12 | Codex | UNVERIFIABLE | "tests run on every change" | fixed anyway: "before each push and on each pull request" |
| 13 | fresh | NIT | CONTENT_GUIDE.md and a test comment describe the old short answer | fixed |
| 14 | fresh | NIT | the #risks cut recipe does not name its #short row | fixed |
| 15 | fresh | NIT | headers called a "control" | fixed: "What", "security setting" |
| 16 | fresh | NIT | the commit message does not mention the panel move | declined: it does |

## Round 2 (2026-10-26, delta 95b56ee..031e28e), verification

Earned by rows 2-4 (BUG). Codex: 3 RISK (1,469 s, 82,700 tokens; the machine's load average
was near 300). Rows 1-16 verified as fixed or declined.

| # | Seat | Kind | Finding | Disposition |
|---|---|---|---|---|
| 17 | Codex | RISK | row 11 again | refuted with evidence read at karero/croftweaver 3b8a6c5f: the template has 0 `.php` files and two functions; its `public/_headers` sets the five headers; `cloudflare-setup.mjs` lines 45-76 set Always Use HTTPS and TLS 1.2; `new-website` SKILL.md line 758 is the Dependabot step. At v0.33 the script's `launch` stage "attaches the domain" (line 14) and checks "from outside" (line 884). Codex, without the toolkit, kept it UNVERIFIABLE |
| 18 | Codex | RISK | row 7 again: no guard keeps the summary in step | a claim map and a note were tried (c278099); see rows 20-21 |
| 19 | Codex | RISK | "a Croftweaver site has one or two" functions generalises | fixed: "croftweaver.com has one, and the template two" |

## Re-gate (2026-10-26, delta 031e28e..c278099), full scope

The delta held a code line, so it was re-gated whole instead of a wording pass; not a round.
Codex: 1 BUG, 1 RISK (240 s, 58,909 tokens).

| # | Seat | Kind | Finding | Disposition |
|---|---|---|---|---|
| 20 | Codex | BUG | the claim map was incomplete and two entries pointed elsewhere | fixed by a cut (b7a5f4c): the map is gone |
| 21 | Codex | RISK | rows 7 and 18 again | refuted: `tests/check_security_page.sh` leaves "everything on the page that is not a registered claim" to editorial review, and the summary rows are such prose, like the hero lead. One note in `src/data/security.ts`, where re-reads happen, asks for the row to change with the claim |

## Confirmation (2026-10-26, delta c278099..b7a5f4c)

Codex: No BUG/RISK/NIT findings (289 s, 45,572 tokens). Row 17 stays UNVERIFIABLE to Codex,
which cannot see the toolkit; the author's reads are above.

Result: clean on b7a5f4c05c74f7920bd2566a950563ed17935c8a. Two rounds, a re-gate and a
confirmation; 21 findings (5 BUG, 11 RISK, 1 UNVERIFIABLE, 4 NIT), three of the RISKs repeats.
Tests on b7a5f4c: `npm run check` 0 errors, `tests/check_security_page.sh` passed (103 claims),
Playwright 458 passed on c278099 (b7a5f4c only removes an unused field and edits two comments).
