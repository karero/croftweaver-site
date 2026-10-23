# Vendor facts behind /what-it-runs-on, read on 2026-10-22

A record, so the figures on the page have a source that outlives the session. Two kinds of reading:

1. **Vendor pages**, read by a Sonnet sub-agent with WebFetch. WebFetch answers come from a small model's reading of each page, so each quote below is that model's rendering, not a copy of the page. The agent changed no file. Brief: the 2026-10-05 figures of the spec, checked one by one.
2. **Repository settings and toolkit files**, read by the host (`gh api`, `git show origin/main:…`).

Result of the vendor read: no figure changed since 2026-10-05. Four wording limits, applied on the page.

## 1. Vendor pages (sub-agent, verdict against the 2026-10-05 statement)

| # | Page read | What it says today | Verdict |
|---|---|---|---|
| 1 | developers.cloudflare.com/pages/platform/limits/ | Free plan: 500 builds a month, 1 build at a time, 20,000 files per site, 25 MiB per file, 100 projects per account. Custom domains: 100 on Free, 250 on Pro, 500 on Business and Enterprise. Anyone hosting more than 100 sites is pointed to Workers for Platforms or Workers Static Assets | SAME |
| 2 | …/pages/functions/pricing/ and developers.cloudflare.com/workers/platform/limits/ | "On both free and paid plans, requests to static assets are free and unlimited." Functions requests count toward the Workers Free quota. The Pages page does not state 100,000 itself; the Workers limits page does: 100,000 requests a day, reset at midnight UTC | SAME |
| 3 | …/pages/functions/routing/ | "once you add Functions on a Pages project, all requests by default will invoke your Function." The Fail open / Fail closed setting applies on the Workers Free plan when the daily allowance runs out: fail open keeps serving static assets, fail closed returns an error page | SAME |
| 4 | …/pages/functions/middleware/ | A `functions/_middleware.js` file runs in front of static files | SAME |
| 5 | …/pages/configuration/preview-deployments/ | Every new branch gets a preview address. For pull requests: "This is only true when pull requests originate from the repository itself." Fork pull requests are not described further | SAME |
| 6 | developers.cloudflare.com/pages/ | Workers is "Cloudflare's primary platform for building applications. Start new projects with Workers." Workers "supports most Pages use cases." Pages: "Available on all plans." | SAME |
| 7 | developers.cloudflare.com/dns/, /dns/faq/, /dns/zone-setups/full-setup/, /registrar/ | DNS "Available on all plans"; full setup "the only one available for Free or Pro plans". FAQ: "You do not need to move away from your registrar." Registrar sells domains "at cost, without markup fees". Caveat: no Registrar page read says in so many words that Registrar is optional; that rests on the DNS FAQ line | SAME |
| 8 | developers.cloudflare.com/email-service/ (overview, get-started/route-emails/, platform/pricing/) | Email Routing forwards incoming mail to destination addresses (each must be verified first); "Available on Free and Paid plans"; "You must be using Cloudflare DNS to use Email Service"; onboarding adds MX, SPF and DKIM records; sending to any recipient needs Workers Paid and is labelled Beta | SAME |
| 9 | docs.github.com/en/get-started/learning-about-github/githubs-plans | "unlimited collaborators on unlimited public repositories with a full feature set." Private repositories are unlimited too, with a "limited feature set." No collaborator cap is stated for private ones | SAME, wording limit: "unlimited collaborators" is stated for public repositories only |
| 10 | docs.github.com/en/billing/concepts/product-billing/github-actions | Free for self-hosted runners and for public repositories on standard GitHub-hosted runners; GitHub Free includes 2,000 minutes a month for private repositories; "usage is blocked once you use up your quota"; overage is billed to the payment method on file | SAME, wording limit: the payment-method condition for standard runners is not in one sentence |
| 11 | git-scm.com/docs/gitfaq#sync-working-tree | Under "How do I sync a working tree across systems?": "not to use a cloud syncing service to sync any portion of a Git repository", continuing "since this can cause corruption". Names no product | SAME |
| 12 | plausible.io/data-policy; /privacy-focused-web-analytics; /#pricing; /docs/billing; github.com/plausible/community-edition | "We do not use cookies, browser cache or local storage"; no persistent visitor identifiers; no cookie banners needed. Pricing page: Starter "$9 /month", "Up to 10k monthly pageviews", one site, 3 years of retention; Growth $14, Business $19 at that tier. A Monthly/Yearly toggle with "2 months free" is shown, and the text does not say which is selected. 30-day free trial. Community Edition: MIT licence, v3.2.1 the latest version, an example Docker Compose setup | SAME on cookies and the repository; the $9 billing period (monthly or yearly) is not shown in the page text |

## 2. Repository settings (host, `gh api`, read-only, 2026-10-22)

`gh api repos/karero/croftweaver-site/rulesets/<id>`, each read back by its ID:

- `24992030` "protect main": enforcement active; target branch; include `~DEFAULT_BRANCH`; bypass actors 0; rules `deletion`, `non_fast_forward`, `pull_request` (0 approvals required; extra approval for unattributed changes on), `required_status_checks` with contexts `test` and `Cloudflare Pages` (integration 85455), strict policy off.
- `24992045` "protect production": enforcement active; include `refs/heads/production`; bypass actors 0; rules `deletion`, `non_fast_forward`. No required checks, no pull request rule.
- `gh repo view`: visibility PUBLIC. PR #115 state: OPEN.
- `.github/workflows/ci.yml`: `on:` push to `main` and `production`, `pull_request`, `workflow_dispatch`; the job is named `test` (line 30).
- Branch protection API for `main` and `production`: 404 "Branch not protected" (the rulesets are the mechanism).

## 3. Toolkit files (host, `git show origin/main:…`, toolkit at `001c68b7`)

- `skills/new-website/references/CLOUDFLARE_FIRST_DEPLOY.md`: section S "Setup by script, connected to GitHub — RECOMMENDED for a site on GitHub" (line 25), which creates the Pages project connected to the repository; line 172: direct upload, "Ongoing deploys are then `wrangler pages deploy`, not Cloudflare's git-push auto-build"; lines 257 and 276: `wrangler pages deploy dist`; section B "GitHub git-integration — RECOMMENDED if the owner wants push-to-deploy and no token" (line 290).
- `docs/WHAT-THE-SKILLS-RUN.md` lines 34 and 38: "In Claude Code, routine build commands run without asking" … "`npm run` and `git push` run without asking. It saves clicks; it is not a safety fence."
- `skills/new-website/references/WEBSITE_ARCHITECTURE.md` lines 199, 200, 241: Plausible is cookieless and needs a paid licence from 9 euro a month.
- `docs/GETTING-STARTED.md` lines 53 to 56: "If your Documents folder syncs to iCloud or OneDrive, pick a folder outside it".
- `skills/new-website/templates/AGENTS.md` lines 73 to 95: Codex in the cloud starts every task from a fresh copy from GitHub; for an older resumed task, "Whether GitHub has moved on since is not checked."
- `skills/keystatic-setup/SKILL.md` lines 24 and 100 to 111: local mode is what the skill sets up; GitHub mode is a documented upgrade needing an adapter, a GitHub App and secrets, "not wired by default".
- `skills/new-website/templates/astro/functions/_middleware.ts` header: three jobs (preview noindex; pages.dev alias redirect once `CANONICAL_URL` is set; in server mode, page views to Plausible).
- `skills/new-website/references/CLOUDFLARE_FIRST_DEPLOY.md` lines 415 to 426, step 4 of the going-live steps: "Disable DNSSEC at the registrar before touching nameservers" (flipping them with the old DS record live makes resolvers return SERVFAIL and "the domain goes dark"); step 5: change the name servers only after the passes agree and DNSSEC is handled. **Correction:** an earlier version of this file said DNSSEC was absent from the toolkit's checklist. The search was cut off after four lines (`head -4`), all of them review trails; the DIFF review's fresh-eyes seat found the step.
- Lines 312 to 318 of the same file: the free plan's 100,000 requests a day are "shared by every Pages Function and Worker in the account", reset at midnight UTC; the guide's heading is "After the first deploy, whichever option: set 'Fail open'".

## 4. Not read from a vendor page

- "Every preview build counts toward the monthly builds": the spec's claim. A second read of developers.cloudflare.com/pages/platform/limits/ on the same day (WebFetch): the page "does not say whether the 500 monthly builds on the Free plan include preview deployments"; its closest line is "Each time you push new code to your Git repository, Pages will build and deploy your site." The page no longer makes the claim.
- Whether the Cloudflare dashboard counts every request to croftweaver.com as a Functions request: Daniel's check.

## 5. Layout measurement (host, Chromium via Playwright, 2026-10-22)

The question (DIFF review, Codex): which layout rule keeps a long word inside the screen on `/what-it-runs-on`?
Method: the built page (`dist/what-it-runs-on.html`) loaded in Chromium with each rule removed from its inline
CSS; a 60-character word appended to the first box's paragraph; overflow = `scrollWidth - innerWidth`. The
page's rules: `overflow-wrap: anywhere` on `.place`, and `minmax(0, 1fr)` on the column; the site's
`global.css` line 71 sets `overflow-wrap: break-word` on the page.

| Variant | 360 px | 320 px |
|---|---|---|
| as built | 0 | 0 |
| without `overflow-wrap: anywhere` (the box inherits `break-word`) | 0 | 0 |
| without `minmax(0, 1fr)` (plain `1fr`) | 0 | 0 |
| without both | 191 | 231 |

Either rule alone is enough; the phone test in `tests/a11y.spec.ts` fails only when both are gone. An earlier
comment credited `overflow-wrap: anywhere` alone, because the first check removed both rules at once.

## 6. Added 2026-10-23: Cloudflare as one of the networks the web runs on (owner's request: two to five lines)

- **W3Techs**, `w3techs.com/technologies/details/cn-cloudflare` (WebFetch, 2026-10-23): the page title is "Usage Statistics and Market Share of Cloudflare, October 2026"; it says "This is 27.8% of all websites"; Cloudflare "is used by" 85.9% of the websites whose reverse proxy service is known. The page shows no other date and says the reports are updated daily; its method is on W3Techs' technologies overview. The page on croftweaver.com uses the first figure only, as "October 2026 (read 23 October 2026)".
- **Cloudflare's developer docs, "How Cloudflare works"**, `developers.cloudflare.com/fundamentals/concepts/how-cloudflare-works/` (WebFetch, 2026-10-23): Cloudflare as a DNS provider and reverse proxy that sits between visitors and the origin; CDN and caching (nearby users get locally stored copies); in the default full setup Cloudflare is the primary authoritative DNS; the anycast network helps protect against DDoS and other attacks. Workers is not on that page, so the paragraph does not mention it.
- Cloudflare's marketing page `cloudflare.com/learning/what-is-cloudflare/` returned HTTP 403 to WebFetch and was not used.
- **Not used, and why.** The Google summary's "generally trusted and safe": an opinion with no source, and the page makes no safety claim. The word "backbone": in networking it names the long-haul transit networks, a narrower thing than Cloudflare's service; the paragraph says "one of the companies a large part of the web runs on", which the W3Techs share supports. The Wikipedia sentences: not copied, the wording is the page's own. The company's headquarters and "ICANN-accredited": Cloudflare's own Registrar page does not say it, and only the pasted Wikipedia text does.
- The paragraph's last sentence ("That also ties a site's availability to Cloudflare's") is the author's inference from the reverse-proxy design, not a vendor statement.

## 7. Added 2026-10-23: what GitHub is (owner's request; readings by WebFetch, a small model's rendering of each page)

- `docs.github.com/en/get-started/start-your-journey/about-github-and-git`: GitHub is a platform for building software (planning, writing and reviewing code, testing, deploying, maintaining); Git is an open-source version control tool that tracks changes to files, keeps a history and merges work from different people; "GitHub is based on the open-source software, Git"; GitHub hosts Git repositories in the cloud and adds planning and collaboration tools. The page does not say who owns GitHub.
- `git-scm.com`: Git is "a free and open source distributed version control system".
- `blogs.microsoft.com/blog/2018/10/26/microsoft-completes-github-acquisition/`: "Microsoft has completed its acquisition of GitHub", dated 26 October 2018; GitHub to operate independently and remain an open platform (as stated then). The page says only "has belonged to Microsoft since October 2018".
- Reverting a pull request (`docs.github.com/…/reverting-a-pull-request`): after a pull request is merged, Revert creates a new pull request that undoes it; write permission is needed; reverting individual commits may be needed if the revert conflicts or the original was not merged on GitHub.
- About pull requests (`docs.github.com/…/about-pull-requests`): a proposal to merge changes, discussed and reviewed before merging. It does not mention merge conflicts and does not say "without overwriting each other's work"; the page does not use that phrase.
- About merge conflicts (`docs.github.com/…/about-merge-conflicts`): Git usually merges changes on different lines or files automatically; a conflict happens when two people change the same line of the same file, or one edits a file another deletes; every conflict must be resolved before GitHub allows a pull request to merge, and the merge button is disabled meanwhile. The page does not say outright that Git never silently overwrites; the page says only what is on the page.
- Not used: the 2018 price ($7.5 billion in stock; seen only in a search summary of Microsoft's SEC filing); usage statistics (Stack Overflow survey figures appear only in secondary reports and could not be confirmed); GitHub's 2025 move into Microsoft's CoreAI organisation (press reports, secondary); any claim that GitHub is a "standard" (Git is the open tool; GitHub is one company's service; the page says so and says that other services host Git repositories).

## 8. Added 2026-10-23: the technologies named in the picture (host, from the repository)

- `package.json`: `engines` node `>=22.12.0`; dependencies `@astrojs/sitemap ^3.7.4`, `astro ^7.4.1`, `node-html-parser ^9.0.5`; devDependencies `@astrojs/check ^0.9.11`, `@axe-core/playwright ^4.14.0`, `@playwright/test ^1.64.1`, `@types/node ^24.19.2`, `typescript ^6.0.3`.
- Vite: Astro's own dependencies include `vite` (checked in `node_modules/astro/package.json`); installed `vite` 8.3.5.
- What a visitor receives: the built page carries three inline `<script>` elements and three JSON-LD blocks (`type="application/ld+json"`, data, not code); no external stylesheet (the CSS is inlined). So "plain HTML and CSS and a little JavaScript".
- Markdown: the starter's pages are `.astro` files; Markdown is the default content workflow (`skills/new-website/SKILL.md`: "no CMS (default; markdown + …)"; `keystatic-setup`: "Markdown-in-git"). This site's own text is in `.astro` files and there is no `src/content`. Hence the box says "Astro pages, Markdown".
- Playwright and axe: `@playwright/test`, `@axe-core/playwright`; the tests run in Chromium. TypeScript: the `typescript` devDependency, used by `astro check` (0 errors). Claude Code or Codex: a plugin exists for both (`src/data/skills.ts`, release 0.32 text).
- Pages, CDN, DNS, the small function, Git, pull requests, Actions: sections 1, 6 and 7 of this record.

## 9. Added 2026-10-23: analytics (Cloudflare, Plausible) and who is behind Keystatic (host)

Method. Each page below was fetched raw with `curl` (user agent `Mozilla/5.0`) and the phrases were found with
`rg` in the page text, not taken from a small model's rendering (the WebFetch rendering was read first and then
checked against the raw page). The price was read in a real browser (the Browser pane), because the pricing page
fills it in with a script.

- Cloudflare zone analytics (`developers.cloudflare.com/analytics/account-and-zone-analytics/zone-analytics/`):
  "Analytics are based on Cloudflare's edge logs, with no need for third party scripts or trackers." Under the
  heading for the Free plan: "These metrics include legitimate user requests as well as crawlers and threats."
  The Web Traffic panel lists Requests, Bandwidth and Unique Visitors. **Not read:** a definition of "unique
  visitors" (the page gives none), and whether the dashboard's Overview chart (the owner's screenshot) uses the same
  logs as the Analytics tab; the page says "Cloudflare's analytics" and calls the screenshot "overview", and claims
  no more. The screenshot's zone carries the "free" label.
- Plausible, about (`plausible.io/about`): "an independent, open source analytics company based in the EU"; "Built
  and hosted in the EU"; "Funded entirely by our subscribers"; Uku Taht started it in December 2018, alone; Marko
  Saric joined in 2020. Imprint (`plausible.io/imprint`): Plausible Insights OÜ, Västriku tn 2, 50403 Tartu, Estonia,
  registration number 14709274, represented by Uku Täht. The terms say Estonian law governs.
- Plausible, data policy (`plausible.io/data-policy`): "We do not use cookies, browser cache or local storage."
  "We do not generate persistent identifiers." "By using Plausible, you do not need cookie banners for analytics or to
  collect consent for tracking." The page does not mention bot filtering. This is the vendor's statement, not a legal
  finding; the page says so.
- Plausible, pricing (`plausible.io/#pricing`, in a browser with a German locale on 2026-10-23): Starter, up to 10k
  monthly pageviews: **€9 /month** on the monthly view (the view the page opens on); after choosing Yearly: **€90 /year**
  (€7.50 a month, with the €9 struck), and the label "2 months free". The currency comes from a script
  (`currency=data.currency` in the page source): a fetch from a US address showed "$9 /month". The yearly price in
  dollars was **not read**; the page gives the yearly price in euros only. "30-day free trial · No credit card
  required" is on the home page and the self-hosting page.
- Plausible, self-hosting (`plausible.io/docs/self-hosting`): "Plausible Community Edition (CE) is the free,
  self-hosted, AGPL-licensed release: you run it on your own server and manage everything yourself." The Community
  Edition's GitHub README, in a small model's rendering, said "MIT license" and did not say "free"; the two disagree
  on the licence, so the page names no licence for it and cites the docs page for "free".
- Keystatic (`keystatic.com`, raw): "Keystatic is a Thinkmill project"; footer: "Made with ♥ in Australia by a team
  from 30 countries." Thinkmill (`thinkmill.com.au`, raw): the structured data gives the address as Level 10, 191
  Clarence St, Sydney, New South Wales 2000, AU; the page lists AI Development ("Custom apps and tools built with
  AI-enabled engineering"), Product Design & Engineering, API Platforms and Design Systems. The page says "builds
  software for other companies", not "agency" or "software house". A web search also found secondary sources that call
  Thinkmill a Sydney-based company behind Keystone and Keystatic; the page does not rely on them.
- The owner's screenshots (2026-10-23, from the chat): Plausible, genai-wednesday.de, last 28 days: 230 unique
  visitors (+10%), 238 visits, 383 pageviews; Cloudflare overview, genai-wednesday.com, 23 September to 23 October,
  "free": 1.77k unique visitors. `curl -I https://genai-wednesday.com/` on 2026-10-23: **302, location
  https://genai-wednesday.de** (so the Cloudflare figure is for the forwarding address, not the site Plausible
  counts). `https://genai-wednesday.de/` loads Plausible's script from a subdomain of its own (script mode). The page
  says both facts and calls the comparison rough. **Open question for the owner:** a screenshot of the Cloudflare
  overview of genai-wednesday.de would make the pair like for like.
- The toolkit's guide (`skills/new-website/SKILL.md` on `origin/main` of the public repo, f680e440, "Script or server
  mode" paragraph): server mode sends each page view from the site's Cloudflare Function; loses scroll depth and
  engaged time; counts visitors who block scripts; skips requests without Fetch Metadata for a page navigation (most
  crawlers); forwards the visitor's IP; uses the Functions quota; "a stronger position, not a way out of a review"
  (the EDPB's Guidelines 2/2023 on IP-based tracking).
- The skip rule for server mode, from code (`skills/new-website/templates/astro/functions/_middleware.ts` on `origin/main`,
  f680e440): `navigationSkip()` skips a request that is not a GET, that names itself a prefetch, prerender or preview
  (`Sec-Purpose`, `Purpose`, `X-Purpose`, `X-Moz`), whose `Sec-Fetch-Dest` is present and not `document` or absent,
  whose `Sec-Fetch-Mode` is present and not `navigate`, or that has no `User-Agent`. Its comment says: "curl, scripts,
  scanners and most crawlers send neither" Fetch Metadata header. **Not traced by a test in the toolkit** (a search
  for `navigationSkip` finds only the two functions that use it), so the page says "many crawlers and scripts", cites
  the code, and does not say "most". The `SKILL.md` paragraph says nothing about crawlers, so it is not cited for that.
