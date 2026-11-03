# DIFF gate: /established-sites#help, the M-Squad sentence and link

Depth: Normal (one sentence of page copy, one outside link and a test; no box, user data, logins,
money, deletion or schema). The plan passed its PLAN gate in a private repository. Seats: Codex and
GLM 5.3 on melious (one command).

## Round 1 (2026-11-03, base 98cab11, head c93d059)

Codex: 1 RISK, clean otherwise (92 s, 38,509 tokens). GLM 5.3: 1 RISK, 2 NIT (87 s, 10,156 tokens).

| # | Seat | Kind | Finding | Disposition |
|---|---|---|---|---|
| 1 | Codex, GLM | RISK | nothing shows that Plausible reads `?ref=croftweaver` as the source; GLM says it drops query strings other than UTM | refuted: Plausible's traffic-sources page lists `ref`, `source` and `utm_source` as supported, and its UTM Source report shows "any traffic tagged with "ref" and "source" parameters" (https://plausible.io/docs/top-referrers, read 2026-11-03). Whether m-squad.com's own instance shows it is checked live in a clean browser after publishing |
| 2 | GLM | NIT | "Site-specific (not in the shipped suite)" contradicts the test sitting in navigation.spec.ts | refuted: the phrase means not in the toolkit's shipped suite, and the file's other site-only tests carry the same line |
| 3 | GLM | NIT | the period sits outside the link | refuted: the link text is "What this help covers"; the period ends the sentence, as with the site's other inline links |

Codex marked three claims unverifiable from the files alone. The live page: `curl` of
https://m-squad.com/croftweaver-help?ref=croftweaver answered 200 on 2026-11-03. The test: with the
`ref` dropped from the URL, with the email subject changed, and with the sentence changed, the new
test failed each time ("1 failed"); on the change it passes, and the full suite passed (501 tests,
`astro check` 0 errors). The owner's approval of the wording is in the pull request.

Clean after round 1: no BUG; both RISKs and both NITs refuted, no change needed.
