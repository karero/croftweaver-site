# DIFF gate: karero/croftweaver-site#144 (/compare WordPress, Joomla and Drupal group)

Depth: Normal (page copy with new sourced claims about other products, a template change and a new
test; no box, user data, logins, money, deletion or schema). The plan passed its own PLAN gate
(private feature hub, `compare-cms/`). Seats: Codex, GLM 5.3 on melious, and a fresh-eyes host
pass (a read-only sub-agent with only the diff, the plan and the repo).

## Round 1 (2026-10-25, base 83eee8d, head b44ff75)

Codex: No BUG/RISK/NIT findings (132 s, 61,214 tokens). GLM 5.3: 1 RISK, 2 NIT (112 s, 13,087
tokens). Fresh-eyes: 1 RISK, 3 NIT (271 s, 116,279 tokens).

| # | Seat | Kind | Finding | Disposition |
|---|---|---|---|---|
| 1 | GLM | RISK | a future group with `needs` but no `checked` reads `group.checked` and crashes the build | refuted: `npm run check` refuses it (removing `checked` gave 4 errors, `compare.astro:92` and `seo.spec.ts:707-708`), and CI runs `npm run check` (`ci.yml:92`); loud, not silent |
| 2 | GLM | NIT | the linked Drupal requirements page puts PHP on a sub-page | refuted: the page lists PHP among the requirements and links its own PHP section; the note links that page |
| 3 | GLM | NIT | "Site-specific (not in the shipped suite)" contradicts the test living in `seo.spec.ts` | refuted: the marker the site already uses for its own tests inside copied suite files (`a11y.spec.ts:966` and others) |
| 4 | fresh | RISK | the test's title and comment claim every source and date on /compare; it does not check the short answer's or the positioning note's dates and links | fixed: title and comment narrowed to each group's row and note links, each group's date and the hero's, and say what they do not check |
| 5 | fresh | NIT | Joomla's GPL quote in `docs/competitors.md` is about its extensions | fixed: "Joomla! is free, open, and available to anyone under the GPL license." added (curl) |
| 6 | fresh | NIT | WebFetch marked on some drupal.org quotes only | fixed: each drupal.org row marked as a whole |
| 7 | fresh | NIT | "with a host" and "updated" have no quoted source | fixed: WordPress requirements quotes added ("To run WordPress, it's recommended your host supports:"; older versions "have reached their official End Of Life…"); for Joomla and Drupal the notes say it is this site's reading, not a quote |

Preview (Cloudflare, branch preview of b44ff75): /compare#cms and /from-wordpress#fit looked at
on desktop in dark mode and at 375 px in light mode; no horizontal scroll.
