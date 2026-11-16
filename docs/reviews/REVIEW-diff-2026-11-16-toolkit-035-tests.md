# DIFF review: croftweaver.com tests and skills brought up to toolkit 0.35
Base `3876e36` · depth: Normal · verdict: CLEAN at round 3 (no BUG or RISK open; one NIT fixed after it) · 3 rounds

Task: the tests, bundled skills and a few documents of the site brought to release 0.35 (tag `8825573b`). The change touches `AGENTS.md`, `scripts/` and `tests/`; it does not touch `package.json`. Seats: Codex gpt-6.1-sol (read-only, medium) and GLM 5.3 on melious, every round; a fresh-eyes Sonnet subagent in round 1 (byte comparison of the copied files with the v0.35 template).

| Round | Head | Seconds, tokens |
|---|---|---|
| 1 | `812d2ba` | Codex 236 s / 117,541; GLM 1,314 s / 150,842; fresh-eyes about 433 s / 237,000 |
| 2 | `cadd8c3` | Codex 175 s / 69,762; GLM 215 s / 24,445 |
| 3 | working tree after `cadd8c3` | Codex 86 s / 43,381; GLM 54 s / 4,831 |

| Sev | Round | Finding | Status | Evidence |
|---|---|---|---|---|
| BUG | 1 | Site's old Email Tap tests ran in place of the template's | fixed | `tests/email.spec.ts` is the template's file plus the site's two phone-number tests; 184 then 549 tests pass |
| BUG | 1 | `generate_og_cards.py` crashed without fonts instead of saying so | fixed | `_no_font()` ported; `--check` prints the font used |
| BUG | 1 | `/imprint` not covered by the legal-page guard | fixed | Added to `LEGAL_LAST_SEGMENTS` and to the pinned examples in `tests/placeholders.spec.ts` |
| BUG | 1 | `placeholders.spec.ts` points to a legal-pages rule that `AGENTS.md` lacked | fixed | The template's rule is in section 5 |
| BUG | 1 | Breaks document named the old stamp | fixed | Now `8825573b` |
| RISK/NIT | 1 | "Up to 4 min", a11y wording in `suites.ts`, tense in the breaks document | fixed | `PUBLISHING.md`, `src/data/suites.ts`, `docs/ai-website-seo-checklist-breaks.md` |
| BUG | 1 | Codex: `tests/icons.spec.ts` SVG regex accepts a truncated file; logo check reads the config, not the page | deferred | Template file, byte-identical to v0.35 (fresh-eyes check); sent to the kit manager for 0.36 |
| RISK | 1 | Codex: `ship.sh` with no route and no `build.txt` exits 0; `make-icons.mjs --setup` can overwrite a hand-made favicon | deferred | Template files, byte-identical to v0.35; sent to the kit manager |
| BUG | 2 | `AGENTS.md` points to `src/pages/_impressum.astro`, which this site lacks | fixed | Sentence added naming `/imprint`; reworded again after GLM's round 3 NIT so the pointer says "the kit's" file; Codex round 3 confirmed `imprint.astro` exists |
| BUG | 2 | `PUBLISHING.md` "up to 6 min" under-counts: 36 checks 10 s apart plus request time | fixed | "about 6 min", the wording `ship.sh` itself uses |
| BUG | 2 | `email.spec.ts:193` assumes no tracker; false if run with `CF_PAGES_BRANCH=production` | deferred | Template copy. Fails loudly, not silently; only when that variable is set, which Cloudflare's build sets and this site's CI and push gate do not (`tests/check_analytics_gate.sh` sets it per command only). Sent to the kit manager |
| RISK | 2 | A `mailto:` click may not raise a Playwright request event | refuted | The email tests pass in the full run (549 passed) |
| NIT | 2 | `LEGAL_LAST_SEGMENTS` is also in the kit's `cloudflare-setup.mjs`, which lacks `imprint` | deferred | Named in README row 11 and sent to the kit manager |
| NIT | 3 | Rule still said "`_impressum.astro`, whose header has the steps" | fixed | Reworded to "the kit's" file |

Waivers and deferrals: the four kit findings above stay in the toolkit for 0.36; none was introduced by this change. Not fixed here by the brief's order.

After the last edit: `npm run check` clean, `npm run build`, the eight shell checks (`tests/check_*.sh`), both decks current, and the full Playwright suite (549 passed) on the head before the round-3 edits; after them only text in `AGENTS.md`, `PUBLISHING.md` and `README.md` changed, and the tone, placeholders and checks specs were run again.
