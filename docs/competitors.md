# Competitors: working notes

Notes for the people and assistants who work on this site. No page serves this file.

The public comparison is https://croftweaver.com/compare. Its statements about other products
live in `src/data/compare.ts`, each with a link and a date. This file keeps what was looked up
and why, so that the next person does not have to look it up again. When a note here and the
other project's own page disagree, the project's page is right: read it again and correct the
note.

## Who else starts with the message (checked 13 October 2026)

**The question.** The owner wanted `/compare` to say that Croftweaver starts with positioning
(what you offer, for whom, and the proof for it) and that none of the alternatives does. He
asked for the second half to be checked first.

**The answer.** It does not hold. Three of the five projects in the group "Skills for AI
coding assistants" start with the message or with a discovery step. So `/compare` says what
Croftweaver does first and names those three. It makes no claim that others lack it, which is
also the page's rule.

Each row is what the project's own README or page says, in this file's words.

| Project | What it says about its starting point | Where to read it |
|---|---|---|
| marketingskills | A `product-marketing` skill holds the product, the audience and the positioning. The README calls it the foundation, and every other skill reads it first. | https://github.com/coreyhaines31/marketingskills (section "How Skills Work Together") and https://github.com/coreyhaines31/marketingskills/tree/main/skills/product-marketing |
| Wondel.ai skills | An `obviously-awesome` skill for positioning, built on April Dunford's book, the same one Croftweaver's positioning skill uses. A `create-website` journey runs ten skills in order: message first, then design, then conversion, then a final review. It writes a `POSITIONING.md` among other files. | https://github.com/wondelai/skills, https://skills.wondel.ai/skills/obviously-awesome/ and https://skills.wondel.ai/skills/create-website/ |
| website-build-kit | The method runs from discovery through stack decisions, build and verification to handover. Its kickoff reference describes three discovery rounds, and its archetypes reference names a proof model for each type of site. | https://github.com/nurkamol/website-build-kit and https://github.com/nurkamol/website-build-kit/blob/master/skills/website-build/references/kickoff.md |

**Checked, and no such step named.** Both describe themselves as audit tools for a site that
exists:

- claude-seo: https://github.com/AgriciDaniel/claude-seo
- geo-seo-claude: https://github.com/zubair-trabzada/geo-seo-claude

**Not checked for this question.** The hosted website builders (Wix, Squarespace, Webflow,
Framer), the AI app builders (Lovable, Bolt, v0) and the open-source visual builders
(Webstudio, Instatic). `/compare` says nothing about how they start.

**What Croftweaver does, for comparison.** Checked against the toolkit on the same day:

- Positioning is step 2 of a new build and is required, before the content guide and any copy.
- The positioning skill asks for the value of each unique attribute together with evidence: a
  metric, a mechanism or a reference.
- Customer quotes are built in from one data file, with the author and the thing reviewed.
  That happens only where a site has quotes: the toolkit does not ask for them unprompted.
- The answers go into `POSITIONING.md`, and a test checks that each page carries its term.

**Closest to Croftweaver on this point:** the Wondel.ai `create-website` journey. It also puts
the message first and also writes a positioning file. Worth reading in full before the next
change to the skills group on `/compare`.

## Where this was used

- The section "Croftweaver begins with the end in mind" on `/compare`
  (karero/croftweaver-site#71, merged 13 October 2026).
- `MESSAGE_FIRST` in `src/data/compare.ts` holds the three public statements and their date.

## Broader review (14 October 2026)

**The question.** The owner asked for a wider review than the three projects above: a feature
gap table against those three, ideas for how to stand out, and what else is moving in this
space.

**How it was done.** Three research passes on 14 October 2026: one read the three projects'
repositories (README, skill files, scripts, commit history), one searched GitHub and the skill
directories for other projects, one read the news from March to October 2026. Croftweaver's own
column was checked against `karero/croftweaver` on `origin/main` the same day (commit
`e038603`, after release 0.31). Facts carry a source. A fact marked *unverified* comes from one
secondary source. Section 5 is opinion, and says so.

### 1. The short version

- **No project found does all of what Croftweaver does**: positioning that tests enforce, a
  built site, the search and AI work by default, a test gate shipped into the site, and a loop
  from Search Console and AI-answer checks after launch. Each competitor has some of these and
  none has all five: website-build-kit comes closest on building and checks, with no positioning
  step and no AI-answer work.
- **The gap is reach and proof, not features.** Croftweaver has 6 GitHub stars. marketingskills
  has 54,623. On skills.sh, Croftweaver is still listed under its old name
  (`karero/website-builder`), about 7 installs per skill, and a search for "croftweaver" there
  finds nothing. It is in none of the big lists or directories checked.
- **Watching whether AI names you is becoming a cheap or free feature.** Wix includes an AI
  visibility overview, Squarespace announced AI Visibility, and HubSpot has a free one-off AEO
  grader (sources in sections 4 and 6; plan limits not checked), Google and Bing now report AI impressions and
  citations themselves, and paid tools start at about $25 a month (Otterly, per a third-party
  comparison: https://rankai.ai/articles/otterly-alternatives , *unverified*). What stays scarce is *fixing* the site and re-testing it.
- **The closest competitor after launch is marketingskills.** Its "SEO operator" recipe runs
  SEO from the site's repository on a schedule and opens pull requests from Search Console
  data. **The closest on build and checks is website-build-kit**, which goes further than
  Croftweaver on migration, forms and some accessibility checks.

### 2. The three projects today

| | Croftweaver | marketingskills | Wondel.ai skills | website-build-kit |
|---|---|---|---|---|
| GitHub stars (14 Oct) | 6 | 54,623 | 2,415 | 29 |
| Created | 2026-06-18 | 2026-01-15 | 2026-01-29 | 2026-08-26 |
| Releases | 0.29 to 0.31 since 29 Sep | 29 since 1 Oct (now 2.11.29) | v1.8.0 on 29 Aug; no commit since 10 Sep | 0.1.22 on 11 Oct (a security fix) |
| Skills | 36 | 50, plus 67 command-line tools and 104 tool guides | 51 skills plus 14 guided journeys | 2 skills, 2 commands, a starter |
| Builds a site | Yes: Astro on Cloudflare Pages | No: advises and edits | No: writes planning documents | Yes: Astro on Cloudflare Workers |
| How it earns | Nothing | Paid "Verified Partners", sponsors, agency, newsletter | Amazon affiliate links, studio | Nothing |

Sources: GitHub API; https://github.com/coreyhaines31/marketingskills ,
https://github.com/wondelai/skills , https://github.com/nurkamol/website-build-kit .

### 3. Feature gap table

✓ = has it. Partial = some of it. ✗ = not found. "Gap?" is about Croftweaver: **Gap** = one or
more of the three has it and Croftweaver does not; **Lead** = Croftweaver has it and none of the
three does; **Ahead** = Croftweaver has more of it than any of the three; **Shared gap** = none has it; **Partial** (in this column) = Croftweaver has some of it and so does a competitor, neither fully; **Gap** wins over Partial when a competitor has it fully; **Closing** = done on `main`, not yet released; **None** = no gap for Croftweaver; **Out** = left out on purpose (see `/roadmap`, "Out, on purpose", and §4 of
`POSITIONING.md`).

**Install and reach**

| Capability | Croftweaver | marketingskills | Wondel | website-build-kit | Gap? |
|---|---|---|---|---|---|
| Claude Code plugin | Partial: manifest on `main`, ships with 0.32 (not yet released) | ✓ | ✓ | ✓ | Closing |
| Codex plugin | ✗ | ✓ (since 2.11.16) | ✓ | ✗ | Gap |
| `npx skills add` / skills.sh | Listed under the old name only | ✓ | ✓ | ✗ | Gap |
| One-line install | ✓ `npm create croftweaver` (published 12 Oct) | ✓ | ✓ | ✓ `npm create website-build-kit` | None |
| Named support beyond Claude Code | Codex and Antigravity guides, not tested end to end | Codex, Cursor, Windsurf | Codex, Cursor, Cowork and others | Claude Code only || Gap |
| Evaluations per skill | 10 skills | All 50 | ✗ | ✗ | Gap |

**The message**

| Capability | Croftweaver | marketingskills | Wondel | website-build-kit | Gap? |
|---|---|---|---|---|---|
| Positioning on April Dunford's method | ✓ required, step 2 | Partial: a product-marketing file with positioning sections, not Dunford | ✓ `obviously-awesome`, optional in its website journey | ✗ discovery rounds, no positioning file | None |
| Positioning term checked on each mapped page | ✓ `positioning.spec.ts` (legal pages exempt; a page with no term only warns) | ✗ other skills read the file | ✗ a review step by judgment | ✗ | **Lead** |
| Tone test in the site | ✓ `tone.spec.ts` | ✗ (a list of AI-sounding phrases, no test) | ✗ | ✗ | **Lead** |
| Placeholder test | ✓ `placeholders.spec.ts` | ✗ | ✗ | ✓ `check:copy` | None |
| Story layer (StoryBrand-style) | ✓ optional `website-story` | ✗ | ✓ | ✗ | None |

**Build**

| Capability | Croftweaver | marketingskills | Wondel | website-build-kit | Gap? |
|---|---|---|---|---|---|
| Design system | ✓ skill | ✗ | ✓ advice only | ✓ tokens | None |
| A check against a "generated" look | ✗ | ✗ | ✗ | ✓ `npm run tells`, blocks production | Gap |
| Share cards | ✓ `npm run og` | Partial | ✗ | ✓ `npm run cards` | None |
| Import from WordPress, Wix, Webflow, Squarespace | Partial: `wordpress-inspector` counts a WordPress site before a move and checks every old address after it (karero/croftweaver#281, merged 13 October, not in 0.31; planned for 0.32). No content extract, import or design move, as agreed with the owner (owner in chat, 14 October); the recommendation is to write them during the first real migration | Advice | ✗ | ✓ playbooks for 7 platforms, content extract, redirect map, before/after screenshots | Gap; work to close it is under way (owner, 14 October). Checked 14 October on toolkit `main`, its branches and its pull requests: the inspector is the only migration skill |
| Git-based CMS | Partial: optional Keystatic | Advice | ✗ | ✓ PagesCMS by default, plus a check that guards CMS content | Gap (small) |
| Contact form that sends | Opens the visitor's own email program, ready to send | ✗ | ✗ | ✓ storage, spam guard, email service | Out, on purpose (owner, 14 Oct: the visitor's own email is more personal, leaves them a copy, and has nothing to maintain or attack) |
| Blog collection with RSS | ✗ no RSS in the starter | ✗ | ✗ | ✓ | Gap |
| Several languages | ✓ `astro-i18n-setup`, with tests | Advice | ✗ | Advice | **Lead** |

**Search and AI**

| Capability | Croftweaver | marketingskills | Wondel | website-build-kit | Gap? |
|---|---|---|---|---|---|
| Metadata, sitemap, schema.org | ✓ with a test | Advice and skills | ✗ | ✓ from one data file | None |
| `llms.txt` | ✓ with a coverage test | Recommended | ✗ | ✗ | Ahead |
| Weekly check whether AI assistants name you | ✓ four assistants plus Google's AI Mode and AI Overview | Partial: a manual method and paid tools | ✗ | ✗ | Ahead |
| Google's and Bing's own AI reports | ✗ not used yet | ✗ | ✗ | ✗ | Shared gap: none of the four |
| Programmatic SEO | ✗ | ✓ | ✗ | ✗ | Gap, not on the roadmap (owner to decide) |
| Keyword research | Partial: Search Console data, optional SERP lookup | ✓ through paid tools | ✗ | ✗ | Gap |

**Checks and launch**

| Capability | Croftweaver | marketingskills | Wondel | website-build-kit | Gap? |
|---|---|---|---|---|---|
| Tests shipped into the site | ✓ 13 Playwright suites | ✗ | ✗ | ✓ many scripts (pa11y, Puppeteer) | None |
| CI on pull requests | ✓ the full suite | ✗ | ✗ | Partial: build, types, look, sitemap | Ahead |
| Accessibility, light and dark | ✓ axe | ✗ | ✗ | ✓ pa11y at WCAG 2.2 AA | None |
| Reflow at 320px and 200% text | ✗ | ✗ | ✗ | ✓ | Gap |
| Crawl of the live site after deploy (headers, 404, redirects, page weight) | Partial: `npm run ship` checks the live build | ✗ | ✗ | ✓ `verify` | Gap |
| Snapshot of DNS records before a change | ✗ | ✗ | ✗ | ✓ | Gap (small) |
| Analytics with a conversion | Partial: optional, cookieless, no conversion (on `/roadmap`) | ✓ GA4 skill | ✗ | ✓ | Gap |
| Search Console and business listings | ✓ two skills | Partial | ✗ | Partial: runbook and checklist | Ahead (more complete) |
| Independent review | ✓ | ✗ | Partial: review by judgment | Partial | None |

**After launch**

| Capability | Croftweaver | marketingskills | Wondel | website-build-kit | Gap? |
|---|---|---|---|---|---|
| Search Console data, rankings, report page | ✓ weekly; scheduled automatically on macOS only | ✓ command-line tools | ✗ | ✗ | None |
| Edits go back through the site's tests | ✓ | ✗ no tests in the site | ✗ | ✗ | **Lead** |
| A scheduled agent that opens pull requests | ✗ the owner asks the assistant | ✓ "SEO operator" | ✗ | ✗ | Gap |
| Checks for a site on any stack | ✓ facts check, SEO audit, positioning check | ✓ advice | ✓ advice | ✓ `site-repair` | None |
| Conversion work, A/B tests, email, ads, social | ✗ | ✓ | Advice | ✗ | Out |

Sources for the competitors' columns: their repositories, read on 14 October 2026, including
`skills/product-marketing/SKILL.md`, `skills/marketing-loops/references/seo-operator.md`
(marketingskills); `create-website/SKILL.md`, `obviously-awesome/SKILL.md` (Wondel);
`skills/website-build/references/kickoff.md`, `template/package.json`,
`template/.github/workflows/gates.yml` (website-build-kit).

### 4. Others in the space (new since 13 October's notes)

Ranked by how directly they compete. Stars and dates from the GitHub API on 14 October 2026.

| Project | What it is | Size | Why it matters |
|---|---|---|---|
| PageKit, https://github.com/kraayenjon/claude-pagekit | Builds one landing page with Next.js, deploys to Vercel, adds JSON-LD, `llms.txt` and an AI-quotable rewrite | 2 stars | Same buyer, same pitch. Says "nobody else in this category ships this" about `llms.txt` |
| Higgsfield Websites, https://github.com/higgsfield-ai/skills | A skill that drives a hosted builder: React on one Cloudflare Worker, paid in credits | 119,569 installs on skills.sh | Owns the "build me a website" request in agents. Hosted, so the opposite of owned |
| Pagewell, https://github.com/ReScienceLab/pagewell | Builds SEO, GEO and landing pages inside an existing site, from a facts file | 1 star; the same organisation's `opc-skills` has 1,864 stars and a `seo-geo` skill with 52,098 installs | Their reach to founders is the point, not this repository |
| GEO Optimizer, https://github.com/Auriti-Labs/geo-optimizer-skill | A GEO audit, citation tracking and monitoring, with its own Astro integration | 1,064 stars, MIT | Overlaps the weekly AI check. Could be a part to use, not only a rival |
| OpenSEO, https://github.com/every-app/open-seo | "Open source alternative to Semrush and Ahrefs", with skills and an MCP server | 23,532 stars | A possible data source for keyword research |
| aaron-marketing-skills, https://github.com/aaron-he-zhu/aaron-marketing-skills | 120 marketing skills with an SEO and GEO layer; advises and audits | 2,947 stars | Competes for the same install and the same searches |
| kostja94/marketing-skills and Pagina | 160 marketing skills; building pages goes to Pagina, which checks pages before it calls them done | marketing-skills 1,035 stars, Pagina 1 star | The closest idea to a test gate in this group |
| Design-first builders: website-building-skill, website-builder-setup | Builders for non-coders, focused on looks; no SEO | 8 and 356 stars | Same buyer, no search work. Their creator communities could be a channel |
| Vendor skills: Vercel `agent-skills`, Cloudflare `skills`, Webflow `webflow-skills`, Sanity | Deploy, speed and CMS skills; none builds a content site | Vercel 32,385 stars; Cloudflare 3,056 | Astro has no official skills, only a docs MCP server and an agent-aware dev server since Astro 7.0 (https://docs.astro.build/en/guides/build-with-ai/) |

Hosted builders, new in 2026:

- **Wix Harmony** (21 January 2026): an AI agent plus the drag-and-drop editor.
  https://www.techwyse.com/news/ai-search/wix-launches-harmony-ai-website-builder . Wix's free
  AI Visibility Overview dates from July 2025:
  https://www.nasdaq.com/press-release/wix-launches-ai-visibility-overview-full-generative-engine-optimization-support-ai .
  Claude can edit a Wix site through the Wix MCP server:
  https://dev.wix.com/docs/api-reference/articles/ai-tools/wix-mcp/about-the-wix-mcp
- **HubSpot**: a free AEO grader, and a paid HubSpot AEO from 14 April 2026 (third-party
  review, *unverified*): https://salesdorado.com/en/ai/review-hubspot-aeo-grader/
- **Webflow AEO** (announced 13 April, generally available to Enterprise on 21 May 2026): it
  measures AI visibility, agents suggest fixes, and you publish. Its MCP server is on every plan.
  https://webflow.com/updates/introducing-webflow-aeo-for-enterprise
- **Squarespace AI Visibility** (in its July 2026 product update).
  https://www.squarespace.com/blog/product-updates-july-2026
- **Durable** "SEO & GEO": AI rank tracking on five platforms on the paid tier (its own claim,
  undated). https://durable.com/blog/launch

**Where Croftweaver is listed.** skills.sh: only as `karero/website-builder`, about 7 installs
per skill. Not found in: claudemarketplaces.com, skillsmp.com, `anthropics/claude-plugins-official`,
`openai/skills`, `davila7/claude-code-templates`, and the lists ComposioHQ/awesome-claude-skills,
VoltAgent/awesome-agent-skills, travisvn/awesome-claude-skills, hesreallyhim/awesome-claude-code,
RankSpotAI/awesome-seo-agent-skills, amplifying-ai/awesome-generative-engine-optimization. The
repository's GitHub topics lack `agent-skills`, `claude-skills` and `codex-skills`, where the
others gather.

### 5. How Croftweaver could stand out (opinion)

These are proposals for the owner to decide. Each says what it rests on and the best argument
against it.

1. **Say "keeps your pages on it", not only "starts with positioning".**
   Starting with the message is shared (section above). Testing the site against it is not:
   none of the three ships a positioning or tone test (read in their code). The line on
   `/compare` could move from what happens first to what holds on every change. Not "keeps
   every page true to it": the test checks that each page in its map carries the phrases
   declared for it, by default in the title, the description, and the H1 or the sentence
   under it. That is not proof the page is true to the
   positioning, and legal pages and pages without a term are outside it.
   *Against:* buyers do not shop for tests. That is why "lead with the test gate" was turned
   down on 3 October (`POSITIONING.md`, "Routes considered").
2. **Sell the fix, not the watching.** Checking whether AI names you comes with Wix and
   Squarespace, HubSpot grades it for free once, and Google and Bing now report AI impressions
   and citations themselves (plan limits not checked). Croftweaver's part is
   the next step: the edit, made by your assistant, that goes back through the site's tests.
   Careful: marketingskills' SEO operator also turns Search Console data into pull requests.
   What it does not have is a site with its own tests. *Against:* paid monitoring tools still
   raise money (Profound: $180M at $1.8B, 15 September 2026), so buyers may value the watching.
3. **Be the build-and-test layer next to marketingskills, not its rival.** It has 54,623 stars,
   builds nothing, and seven Croftweaver skills already come from it (the toolkit's
   `THIRD-PARTY-LICENSES.md` names them). "For marketing beyond the
   website, marketingskills; for the website itself, Croftweaver" is honest and borrows its
   reach. `/compare` already says something close. *Against:* it moves fast and could add a
   starter of its own; its partner listing is paid.
4. **Keep the owner as the customer.** website-build-kit is built for someone who delivers a
   site to a client (a handover PDF, the client's DNS). Croftweaver's owner keeps making the
   changes. That split is clear and worth keeping. *Against:* agencies and freelancers are the
   people who install skill kits today.
5. **Make "safe to install, safe to run" a point of its own.** Snyk found critical issues in
   13.4% of 3,984 public skills (February 2026), and a Lovable showcase app exposed 18,697 user
   records (February 2026, https://www.theregister.com/2026/02/27/lovable_app_vulnerabilities ). A static site with no database, an MIT licence and a short page on
   what the skills run (commands, network calls, files outside the repository) speaks to both
   worries. It does not make installing safe by itself: claim only what that page documents,
   once it is checked against the scripts. *Against:* it is a hygiene point, and few will
   choose a tool for it.
6. **Stop presenting `llms.txt` as a way to be found.** Google's AI-search guide (15 May 2026)
   says it is not needed
   (https://www.searchenginejournal.com/googles-llms-txt-guidance-depends-on-which-product-you-ask/575431/ ,
   secondary; Google's own page not re-read), and Ahrefs found that 97% of `llms.txt` files got no request in May
   2026. Present it as cheap readiness for agents. The new "Agentic Browsing" audit in
   Lighthouse 13.3 is a checkable claim to put beside it. *Against:* Claude Code was the second
   biggest fetcher in the same study, so for people who build with assistants it is not
   pointless.
7. **Test whether "AI visibility" now sounds like a dashboard.** Semrush, Wix and Squarespace
   all sell "AI Visibility" as monitoring. The category "website skills for search and AI
   visibility" may read as one more of those. Low confidence: test it with strangers before
   changing anything.

The plainest point: the next gains come from reach (the directories, the plugin, the topics)
and from a second and third proof site, more than from closing any row in the table.

### 6. What else is happening

| What | When | Why it matters here | Source |
|---|---|---|---|
| Cloudflare acquired the Astro team; Astro stays MIT. Astro 7.3 is current, and the starter pins `^7.3.5` | 16 Jan 2026; 7.3 on 3 Sep | Both main dependencies are now one company. The starter is up to date | https://thenewstack.io/cloudflare-acquires-team-behind-open-source-framework-astro/ |
| Cloudflare recommends Workers with static assets for new projects and has a guide for moving from Pages. No end date for Pages found | 2026 | New features go to Workers. A Workers deploy path is worth planning | https://developers.cloudflare.com/workers/static-assets/migrate-from-pages/ |
| Cloudflare's new defaults: on new domains, training and agent crawlers blocked on pages that show ads. Crawlers that do search and training together (Googlebot, Bingbot, Applebot) follow the strictest rule the owner sets | 15 Sep 2026 | Most Croftweaver sites show no ads. The real risk: an owner who blocks AI training in Cloudflare can block Googlebot too. Covered as advice: the toolkit's `docs/CLOUDFLARE-CHECKLIST.md`, "AI crawlers: allow", names both. Not detected automatically: its check script reads `robots.txt`, but the AI-crawler policy itself is a dashboard setting the script only lists for the owner to look at | https://blog.cloudflare.com/content-independence-day-ai-options/ (read 14 Oct) |
| Search Console reports impressions in AI Overviews, AI Mode and Discover (no clicks, no queries), for some sites first | 3 Jun 2026 | Free first-party AI data the weekly loop does not read yet | https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports |
| Bing Webmaster Tools reports citations in Copilot and Bing's AI answers; CSV export, no API | Feb 2026 | Real citation counts, better than asking assistants. A monthly download step would add them | https://searchengineland.com/bing-webmaster-tools-testing-new-ai-performance-report-468039 , https://www.practicalecommerce.com/bings-improved-ai-performance-section |
| Reported: Google ended FAQ rich results for all sites. *Conflicting:* Google's documentation as read on 9 October 2026 (comment in `src/data/established-faq.ts`) still said they show for well-known government and health sites only | 7 May 2026 (reported) | Either way, a small site gets no FAQ rich result: no copy should promise one. FAQ markup still describes the page to machines. Re-read Google's page before relying on the stronger claim | https://searchengineland.com/google-to-remove-more-search-features-including-practice-problems-nutrition-facts-nearby-offers-and-more-464255 |
| Google: `llms.txt` not needed for Search; Lighthouse 13.3 adds an "Agentic Browsing" audit that checks it; Ahrefs: 97% of files unread | May to June 2026 | See proposal 6 | https://ahrefs.com/blog/llmstxt-study/ , https://debugbear.com/blog/lighthouse-agentic-browsing |
| AI Overviews cut clicks on the top result by about 58% (Ahrefs) | Updated Feb 2026 | Rankings alone no longer measure success; being named matters more | https://ahrefs.com/blog/ai-overviews-reduce-clicks-update |
| Codex plugins and plugin marketplace launched | Late Mar 2026 | A second marketplace to be listed in | https://developers.openai.com/codex/plugins.md |
| skills.sh (`npx skills`) indexes skills by install, with security audits from Snyk, Socket and Gen | Since 20 Jan 2026 | Where people look for skills; Croftweaver's entry is under the old name | https://vercel.com/changelog/introducing-skills-the-open-agent-skills-ecosystem |
| Snyk's "ToxicSkills" audit of public skills | Feb 2026 | See proposal 5 | https://snyk.io/blog/toxicskills-malicious-ai-agent-skills-clawhub/ |
| SKILL.md read by Codex, Gemini CLI, Antigravity, GitHub Copilot, Cursor and more | 2026 | Adding Cursor and Copilot may cost little | https://codelabs.developers.google.com/getting-started-with-antigravity-skills |
| GEO tools: Profound raised $180M at $1.8B (*unverified*, one secondary source); Adobe closed its $1.9B purchase of Semrush; HubSpot's AEO grader is free | 15 Sep, 28 Apr, 14 Apr 2026 | See proposal 2 | https://www.vktr.com/digital-experience/profound-nabs-180m-to-scale-ai-marketing-platform/ , https://pulse2.com/adobe-completes-acquisition-of-semrush-expanding-brand-visibility-and-ai-search-capabilities/ , https://salesdorado.com/en/ai/review-hubspot-aeo-grader/ |
| WebMCP in a Chrome origin trial (M149 to M156) | From May 2026 | Watch only: a content site has few tools to offer agents | https://groups.google.com/a/chromium.org/g/blink-dev/c/gmYffo5WOE8/m/OJxuQRP3AAAJ |
| OpenAI retired the ChatGPT Atlas browser into its desktop app | 9 Aug 2026 | No Atlas mention found on this site | https://searchengineland.com/openai-chatgpt-atlas-deprecation-482003 |
| First court cases under the European Accessibility Act in France (single source) | May to Jun 2026 | The accessibility tests matter to any client selling in the EU | https://www.pinmeto.com/news/eu-accessibility-act-enforcement-french-courts-2026/ *(unverified)* |

### 7. Found on the way, not changed here

- `/roadmap` says "A one-line install. Today you clone the repository and run a script." Since
  12 October, `npm create croftweaver` does it in one line (toolkit README, "Install"). The page
  is out of date there.
  **Fixed in karero/croftweaver-site#77** (merged and live 14 October): the line now reads "An
  install without Node" and names `npm create croftweaver`.
- `/compare` describes the Wondel.ai skills as "Fifty skills". Their README now says 51 skills
  and 14 journeys. `CHECKED` in `src/data/compare.ts` is 4 October; re-read before the next
  change.
  **Fixed in karero/croftweaver-site#77** (merged and live 14 October): the entry now says
  fifty-one skills and fourteen journeys, and `CHECKED`, the date the page gives for its
  sources, is now 14 October 2026.
- The weekly tracking is set up automatically only on macOS (launchd). On Linux the script's
  header says to run it from a systemd timer or cron by hand; Windows is not mentioned. Owners
  there get the report when they ask for it unless they set that up.
  **Still open** (toolkit `main` on 14 October).

## WordPress, Joomla and Drupal (checked 25 October 2026)

**The question.** The owner asked whether the site does, or could, say "Croftweaver, the free
alternative to WordPress, Joomla, etc.", and then for a WordPress, Joomla and Drupal group on
`/compare`, with "alternative to WordPress" wording on `/compare` and `/from-wordpress`, factual
and not a headline claim.

**The answer.** "Free" sets nothing apart: all three are free and open source too. The difference
the record backs is on Croftweaver's side: no PHP, database or admin login on a server to keep
updated (`/from-wordpress`, "What changes on a static Astro site"; `/security`). So the group's
rows restate what each project says about itself, and what Croftweaver lacks (a visual editor, a
shop, member accounts) is said about Croftweaver. The phrase "alternative to WordPress" comes with
"for a content site" or "for content sites" each time it appears.

What each page says. Read with curl, except the three drupal.org pages, marked WebFetch: drupal.org
answered curl with a "Client Challenge" page (/about once came through earlier in the day), and
WebFetch returns a model's reading of the page.

| Page | What it says | Used for |
|---|---|---|
| https://wordpress.org/about/ | "WordPress is open source software"; "built on PHP and MariaDB, and licensed under the GPLv2"; "the platform of choice for millions of sites across the web" | the WordPress row |
| https://www.joomla.org/about-joomla.html | "a free and open-source content management system (CMS) for publishing web content"; "Joomla! is free, open, and available to anyone under the GPL license."; "thousands of extensions (most for free under the GPL license)" | the Joomla row; "extensions" |
| https://www.drupal.org/about (WebFetch) | "Drupal is content management software"; "The Drupal project is open source software"; "thousands of add-ons"; "Modules expand Drupal's functionality"; distributed under the GNU General Public License | the Drupal row; "modules" |
| https://wordpress.org/about/requirements/ | "To run WordPress, it's recommended your host supports:"; "PHP version 8.3 or greater"; "MariaDB version 10.11 or greater OR MySQL version 8.0 or greater"; older PHP and MySQL versions "have reached their official End Of Life and may expose your site to security vulnerabilities" | "a web server with PHP and a database"; "with a host"; keeping the server "updated" |
| https://manual.joomla.org/docs/get-started/technical-requirements/ | Joomla 6.1 (current): PHP; MySQL, MariaDB, PostgreSQL | the same |
| https://www.drupal.org/docs/getting-started/system-requirements (WebFetch) | "Database servers for Drupal, such as MariaDB, MySQL, PostgreSQL, and SQLite"; PHP on its own sub-page | the same |
| https://wordpress.org/ | "See how your site will look in real time, even as you add, edit, and rearrange content"; "an extensive library of plugins" | "you edit the pages on the site itself"; "plugins" |
| https://www.joomla.org/core-features.html | "Edit your content while browsing your site." | "on the site itself" |
| https://www.drupal.org/docs/user_guide/en/content-create.html (WebFetch) | "In the Manage administrative menu, navigate to Content > Add content > Basic page (node/add/page)." | "on the site itself" |

"With a host" and keeping the server "updated" are quoted from WordPress's page only; for Joomla
and Drupal they are this site's reading of their requirements pages (a PHP version and a database
server you run), not a quote. The page names no versions and no databases: they go stale and add claims. "On the site itself"
also keeps the line clear of the optional Keystatic editor as the toolkit sets it up, which runs in
the browser on the owner's own computer (`/what-it-runs-on`, the Keystatic section).

Left out on purpose: the home page and its headline, POSITIONING.md, EmDash (already on
`/from-wordpress`, "Other ways to leave WordPress").
