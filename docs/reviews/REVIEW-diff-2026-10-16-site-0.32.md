# DIFF review — the site catches up with Croftweaver 0.32

Base `63d320f` · depth: **Normal** (shipped page copy) · verdict: **CLEAN** — 3 rounds, 16 findings (3 BUG, all fixed; 8 RISK, all refuted from the v0.32 sources; 5 NIT: 3 fixed, 1 left, 1 refuted). The last NIT (E1) was fixed in `STORY.md` prose after round 3 and not sent back to a reviewer.

Files in the change: `src/data/skills.ts`, `src/pages/roadmap.astro`, `src/pages/start.astro`, `src/pages/index.astro`, `src/pages/established-sites.astro`, `STORY.md`, `README.md`, and this file.

Each round's artifact began with a context block: the facts the session that oversaw release 0.32 had checked, and the release notes' address.

| Round | Head | Artifact | Reviewers | seconds, tokens per seat | BUG/RISK/NIT |
|---|---|---|---|---|---|
| 1 | `980f2f0` | full `63d320f...980f2f0` | codex-cli (read-only); melious glm-5.3 (HTTP API, text only) | codex 215 s / 75,778; melious 179 s / 15,047 | 2 / 6 / 4 |
| 2 | `c1e4459` | delta `980f2f0..c1e4459`, with round 1's record | codex (effort medium); melious glm-5.3 | codex 98 s / 45,112; melious 196 s / 10,653 | 1 / 1 / 1 |
| 3 | `98fad6e` | delta `c1e4459..98fad6e`, with round 2's record | codex (effort medium); melious glm-5.3 | codex 57 s / 50,541; melious 59 s / 5,250 | 0 / 0 / 1 |

| id | Sev | Source | Round | Finding — one line | Status | Evidence |
|---|---|---|---|---|---|---|
| C1 | BUG | codex | 1 | "which pages bring you enquiries" overstates a click | fixed `c1e4459`, finished in D1 | see D1 |
| M1 | BUG | melious | 1 | `/start` "Or install by hand" heads the plugin route | fixed `c1e4459` — externally_reverified (round 2, both) | the heading is "Or install it yourself" |
| C2 | RISK | codex | 1 | the installer's checksum check, Node version, Windows and `--codex` not shown | refuted | v0.32 `packages/create-croftweaver/index.mjs:17,90-111` (SHA-256 against `SHA256SUMS` before unpacking, throws on a mismatch); `package.json` engines `>=22.12.0`, also on npm for 0.2.0; its README lines 16-24 (macOS, Linux and Windows; `-- --codex`) |
| C3 | RISK | codex | 1 | the yes on setup day and launch day not shown | refuted | v0.32 `skills/new-website/scripts/cloudflare-setup.mjs:7-11,93,108-112`: both stages change nothing and exit 3, "waiting for a yes", until run again with `--confirm <code>` |
| C4 | RISK | codex | 1 | the plugin commands not shown to work | refuted | copied word for word from the v0.32 README, lines 167-197; "no Node, no script" is that README's wording for the Claude Code plugin |
| C5 | RISK | codex | 1 | the Email Tap counting not shown | refuted | `src/components/EmailLink.astro:38-43` here; v0.32 `skills/new-website/SKILL.md` lines 197-221 (a click, and in script mode a press of the contact form; server mode leaves the form out) |
| M2 | RISK | melious | 1 | "on Windows too" not shown | refuted | the v0.32 README: "It runs in any terminal, on Windows too"; the package README says the same |
| M3 | RISK | melious | 1 | "comparing each one twice" not shown | refuted | v0.32 `skills/new-website/references/CLOUDFLARE_FIRST_DEPLOY.md:378-387`: "verify twice", "check every record twice" |
| C6 | NIT | codex | 1 | "Most people already have a domain" has no source | fixed `c1e4459` | "Many people" |
| M4 | NIT | melious | 1 | "if you install two ways" says more than the README | fixed `c1e4459` | "with a plugin and a copy from one of the other ways"; see D2 |
| M5 | NIT | melious | 1 | a straight apostrophe in `skills.ts`, a curly one in `established-sites.astro` | left | each file keeps its own convention, straight throughout `skills.ts`, curly throughout the page |
| M6 | NIT | melious | 1 | a dash in the README's evidence cell | refuted | the tone rule covers the built pages; the README's status table uses "—" for "no evidence yet" (codex confirmed in round 2) |
| D1 | BUG | codex | 2 | "lead visitors to write to you" still says more than a click | fixed `98fad6e` — externally_reverified (round 3, codex clean) | `/start`: "from which pages visitors click your email address … Whether they then write and send the mail, the site cannot know"; `/roadmap` and `STORY.md` say the same. The closed roadmap item keeps its name, "A standard way to count enquiries" |
| D2 | RISK | melious | 2 | the duplicate-skills note's scope not shown | refuted | v0.32 README lines 180-184: the plugin and a copy in `~/.claude/skills/` list every skill twice; the Codex paragraph says the same |
| D3 | NIT | melious | 2 | "a mail" | fixed `98fad6e` | "the mail" |
| E1 | NIT | melious | 3 | `STORY.md` states the count without its condition | fixed after round 3 — locally_verified only | "can count clicks on an email address, once Plausible is on" |

Codex marked the toolkit claims "unverifiable" in rounds 1 and 2 because the toolkit is not in this checkout. The host read each one in the v0.32 tag, as cited above.

## What the change does

`/skills` lists the 37 skills of release 0.32 (new: `website-brand-kit` and `website-tagline` under Build, `wordpress-inspector` under Launch), and 0.32 heads the three recent releases. `/roadmap` has a new section, "Done in release 0.32" (the enquiry count; the install without Node). "An easier install" becomes the plugin directory listings, which are not submitted yet. The assistant-led DNS move is first under "Next", called a written plan with nothing built. `/start` gains the two plugins and `npm create croftweaver` with its download check, the Email Tap count and Plausible's server mode (not tested with the paid cloud service), and Cloudflare set up and checked by the assistant, with the owner's yes. The home page and `/established-sites` gain one sentence each. All 274 tests pass on each head.
