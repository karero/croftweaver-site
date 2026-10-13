# Croftweaver: initial API visibility snapshot

Executed 13 October 2026, Europe/Berlin. One independent response per question and provider. OpenAI and Perplexity used search; Gemini did not. These are API answers, not consumer-app answers.

The answers below are preserved as evidence, not endorsed recommendations. Some contain incorrect or stale claims. Perplexity URLs are retrieved search results, not verified claim-linked citations.

## openai-D1-r1

Question: What open-source tools can I use to build a small business website with an AI coding assistant?

Model: gpt-6-luna; web search: True; started: 2026-10-13T22:13:50+02:00; finished: 2026-10-13T22:14:16+02:00.

### Returned answer

For a small-business site, a practical open-source toolkit is:

### If you’re comfortable with a little code
- **Astro** — build a fast marketing site, service pages, and a blog without needing a complex app framework. It’s open source and designed for content-focused websites. ([docs.astro.build](https://docs.astro.build/en/concepts/why-astro/?utm_source=openai))
- **VSCodium + Continue** — VSCodium is a community-built open-source editor; Continue adds AI chat, code edits, and autocomplete. Some extensions available for Microsoft’s VS Code may not work in VSCodium. ([github.com](https://github.com/VSCodium/vscodium?utm_source=openai))
- **Aider** — an open-source, terminal-based coding assistant that edits your project and works with Git, making it useful for reviewing or undoing AI changes. ([aider.chat](https://aider.chat/docs/index.html?utm_source=openai))
- **Ollama** — lets you run supported AI models locally and connect them to coding tools. That can keep your code on your machine, though the model’s quality depends on the model and your computer. ([ollama.com](https://ollama.com/blog/launch?utm_source=openai))

**Suggested setup:** Astro + VSCodium + Continue; add Aider if you’re comfortable using a terminal. You can use a hosted AI model or a local one through Ollama. The assistant software may be open source even when a model or hosting provider is not.

### If you’d rather edit pages than code
- **WordPress** — the open-source WordPress project includes a visual editor. With a block theme, you can edit page content and much of the site layout in the Site Editor. An AI coding assistant can still help customize a theme or troubleshoot, but you may not need one for routine page edits. ([wordpress.org](https://wordpress.org/about/?utm_source=openai))

**Quick recommendation:** choose **WordPress** if you want to manage the site mainly through a visual editor; choose **Astro** if you want the AI assistant to help build a lightweight, custom-coded marketing site. Hosting and a domain are separate from these tools.

### Returned citations

- https://docs.astro.build/en/concepts/why-astro/?utm_source=openai
- https://github.com/VSCodium/vscodium?utm_source=openai
- https://aider.chat/docs/index.html?utm_source=openai
- https://ollama.com/blog/launch?utm_source=openai
- https://wordpress.org/about/?utm_source=openai

### Assessment

No Croftweaver mention in this discovery answer.

## openai-D2-r1

Question: How can I build a website with Claude Code that includes SEO and accessibility checks?

Model: gpt-6-luna; web search: True; started: 2026-10-13T22:14:50+02:00; finished: 2026-10-13T22:15:13+02:00.

### Returned answer

A good approach is to use **Claude Code to build the site and add checks to the project**, then run those checks yourself and in CI. Don’t rely on Claude’s review alone.

### 1. Start in your project folder

Open a terminal, go to your project directory, and run:

```bash
claude
```

If you’re starting from scratch, ask Claude Code to choose a simple stack that suits your site—for example, a content-focused site versus an interactive web app—before it scaffolds anything.

### 2. Give Claude Code project-wide requirements

Add a `CLAUDE.md` file at the project root so Claude can refer to your standards while working. Anthropic documents `CLAUDE.md` as part of Claude Code’s project setup and usage. ([docs.anthropic.com](https://docs.anthropic.com/en/docs/claude-code/getting-started?utm_source=openai))

For example:

```md
# Project standards

- Use semantic HTML and responsive layouts.
- Give each page a unique, descriptive title and meta description.
- Use meaningful headings, descriptive link text, and appropriate image alt text.
- Target WCAG 2.2 Level AA as a design goal.
- Add automated accessibility checks for important pages and states.
- Add SEO checks for metadata, headings, canonical URLs, and crawl files.
- Run lint, tests, and build before considering a task complete.
- Report checks that require manual review; don't claim automated scans prove compliance.
```

WCAG’s quick reference can help you turn an accessibility target into specific criteria. ([w3.org](https://www.w3.org/WAI/WCAG22/quickref/?utm_source=openai))

### 3. Ask Claude to plan before coding

Give it a clear brief, then have it propose a page structure and testing plan before implementation:

> Build a responsive website for **[purpose and audience]** using **[preferred stack, or ask me first]**.  
> First propose the pages, components, and metadata strategy. Then implement them.  
> Include accessible navigation, forms, and interaction states. Add automated accessibility tests and an SEO check script. Add commands to run all checks and document any manual checks that remain.

Review its plan and generated changes as you go. After each substantial change, ask Claude to run the relevant checks and fix failures—not just describe what it would do.

### 4. Make the checks repeatable

Ask Claude to add project scripts such as:

```json
{
  "scripts": {
    "check": "npm run lint && npm run test && npm run build",
    "check:a11y": "run the accessibility tests",
    "check:seo": "run the SEO checks"
  }
}
```

The actual commands depend on the framework and test tools Claude sets up.

For accessibility, Playwright can run automated tests using `@axe-core/playwright`. These checks can catch some common issues, but Playwright and axe both caution that automated testing does **not** find every accessibility problem; manual assessment and inclusive user testing still matter. ([playwright.dev](https://playwright.dev/docs/accessibility-testing?utm_source=openai))

For SEO, have the project check that each public page has a suitable title and description, meaningful headings, crawlable links, and appropriate sitemap and robots files. Google recommends descriptive page titles, crawlable links, and sitemaps as useful technical basics; these help search engines understand and discover pages, but do not guarantee rankings. ([developers.google.com](https://developers.google.com/search/docs/fundamentals/seo-starter-guide?rd=1&swcfpc=1&visit_id=639263620098934145-805877718&utm_source=openai))

### 5. Test important states and review manually

Run the checks on representative pages—not just the homepage. Also test states that appear only after interaction, such as open menus, dialogs, validation errors, and mobile navigation. Axe doesn’t test hidden regions until they’re made visible. ([github.com](https://github.com/dequelabs/axe-core/blob/develop/doc/API.md?utm_source=openai))

Manually check keyboard-only navigation, visible focus, zoom and small screens, form instructions and errors, and whether images have useful alternatives (or are correctly marked decorative). Treat automated results as a safety net, not a certification.

**A useful final prompt for Claude Code:**

> Review the finished site for SEO and accessibility. Run the project’s checks, fix issues you can verify, and report: (1) commands run and results, (2) remaining automated findings, and (3) manual checks a person should still perform.

Have CI run the same checks on each pull request so regressions are caught before deployment.

### Returned citations

- https://docs.anthropic.com/en/docs/claude-code/getting-started?utm_source=openai
- https://www.w3.org/WAI/WCAG22/quickref/?utm_source=openai
- https://playwright.dev/docs/accessibility-testing?utm_source=openai
- https://developers.google.com/search/docs/fundamentals/seo-starter-guide?rd=1&swcfpc=1&visit_id=639263620098934145-805877718&utm_source=openai
- https://github.com/dequelabs/axe-core/blob/develop/doc/API.md?utm_source=openai

### Assessment

No Croftweaver mention in this discovery answer.

## openai-D3-r1

Question: I need a bilingual consulting website and want to own the code and domain. Which AI-assisted tools should I consider?

Model: gpt-6-luna; web search: True; started: 2026-10-13T22:15:13+02:00; finished: 2026-10-13T22:15:40+02:00.

### Returned answer

For a bilingual consulting site, I’d shortlist these:

| Option | Best for | How well it fits owning the code |
|---|---|---|
| **Bolt.new + GitHub** | Fast, prompt-driven first draft without much coding | Good: Bolt supports two-way GitHub sync, so the project can live in a repository you control. ([bolt.new](https://bolt.new/blog/github-hackathon?utm_source=openai)) |
| **Cursor or Claude Code + Astro** | More control, or if a developer can help | Strongest fit: build a standard website in a Git repository you own. Astro has built-in support for language-specific routes and multilingual URL handling. ([docs.cursor.com](https://docs.cursor.com/chat/overview?utm_source=openai)) |
| **Lovable + GitHub** | A visual, AI-led workflow with a code handoff | Worth considering if you prefer prompting to editing files; check the GitHub connection and deployment workflow in your account before committing to it. |
| **Framer** | The quickest polished, no-code launch | Convenient for publishing to a custom domain, but Framer says it does **not** support exporting the website as HTML for self-hosting—so it’s a weaker match if portable code is a firm requirement. ([framer.com](https://www.framer.com/help/faq/?utm_source=openai)) |

**My recommendation:** If you’re comfortable with some technical setup—or can hire someone for the initial build—use **Astro + an AI coding assistant + GitHub**. If you want to get a draft up with minimal coding, try **Bolt.new**, connect GitHub early, and keep that repository as your source of truth.

For either code-first option, **Cloudflare Pages** can deploy from a GitHub repository when you push changes and connect a custom domain. Buy/register the domain in an account you or your business control; the domain registration and the website hosting are separate things. ([developers.cloudflare.com](https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/?utm_source=openai))

For the bilingual setup, ask for distinct German and English URLs—such as `/de/` and `/en/`—with a visible language switcher. Have a fluent speaker review the final copy, especially your service descriptions and calls to action. Keep the GitHub account, domain registrar, and hosting account under your control, not an agency’s.

### Returned citations

- https://bolt.new/blog/github-hackathon?utm_source=openai
- https://docs.cursor.com/chat/overview?utm_source=openai
- https://www.framer.com/help/faq/?utm_source=openai
- https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/?utm_source=openai

### Assessment

No Croftweaver mention in this discovery answer.

## openai-D4-r1

Question: Which tools can help a small community build and maintain an event website with AI?

Model: gpt-6-luna; web search: True; started: 2026-10-13T22:15:40+02:00; finished: 2026-10-13T22:15:57+02:00.

### Returned answer

For a small community, I’d shortlist these:

- **Wix AI + Wix Events — easiest all-in-one.** Use AI to get the site started, then manage event listings, recurring events, RSVPs or tickets, guest lists and reminders in the same system. Good if several volunteers need a relatively straightforward setup. ([support.wix.com](https://support.wix.com/en/article/about-wix-events?utm_source=openai))
- **WordPress.com AI + The Events Calendar — more flexible.** WordPress.com’s AI can create and help update pages; *The Events Calendar* adds an event calendar, with a companion tool for RSVPs and tickets. A good fit if you want more control over the site, though it may take more setup and ongoing maintenance than Wix. ([wordpress.com](https://wordpress.com/support/ai-website-builder/?utm_source=openai))
- **A general AI assistant, such as ChatGPT or Claude — helpful alongside either.** Use it to draft event descriptions, FAQs, reminder emails, social posts, or a handover guide for the next volunteer. Have a person check dates, locations, accessibility details and prices before publishing.

**Quick choice:** Wix for the simplest start; WordPress.com if flexibility and control matter more. Either way, assign at least two people as site editors and keep a shared checklist for updating events. If you collect attendee details, make sure the group has a clear privacy notice and only asks for information it needs.

### Returned citations

- https://support.wix.com/en/article/about-wix-events?utm_source=openai
- https://wordpress.com/support/ai-website-builder/?utm_source=openai

### Assessment

No Croftweaver mention in this discovery answer.

## openai-D5-r1

Question: How can I use AI to audit and improve SEO on an existing website without rebuilding it?

Model: gpt-6-luna; web search: True; started: 2026-10-13T22:15:57+02:00; finished: 2026-10-13T22:16:14+02:00.

### Returned answer

You can use AI as an **audit and editing assistant** while keeping your current site, CMS, design, and URLs. The practical pattern is: **collect evidence → have AI find and prioritize opportunities → make small, reviewable edits → measure results**.

## 1. Establish a baseline

Before changing anything, export or record:

- **Google Search Console:** pages and queries, clicks, impressions, CTR, and average position.
- **A site crawl:** URLs, page titles, meta descriptions, headings, status codes, canonicals, internal links, and image alt text.
- **Your priorities:** which pages matter most for leads, sales, or other goals.

Search Console’s Performance report helps identify the queries and pages already bringing in impressions and clicks; URL Inspection can help investigate whether particular pages are indexed and how Google sees them. ([support.google.com](https://support.google.com/webmasters/answer/10268906?hl=en&utm_source=openai))

## 2. Use AI to find opportunities—not to invent diagnoses

Give an AI tool a crawl export, a small batch of page text, and relevant Search Console data. Ask it to:

- Group related search queries and map them to existing pages.
- Flag pages with unclear titles, weak headings, thin or outdated information, or overlapping topics.
- Find likely internal-link opportunities between relevant pages.
- Suggest image alt text based on what the images actually show.
- Prioritize recommendations by **likely impact, effort, and confidence**.

Ask for a table with the page URL, evidence, suggested change, expected benefit, confidence, and a human-review note. Treat its output as hypotheses: verify issues against the actual page and data.

**Example prompt:**

> Review this page text and its Search Console queries. Suggest improvements to the title, meta description, headings, and content structure. Preserve the page’s purpose and factual claims. Do not invent facts or recommend new pages unless there is a clear gap. For each suggestion, explain the evidence and flag anything that needs expert review.

## 3. Improve existing pages first

For high-priority pages, use AI to draft targeted edits such as:

- A clearer, more specific page title and meta description.
- Better headings and a more direct answer to the visitor’s likely question.
- Missing practical details, examples, or explanations—**only where you can supply accurate information**.
- Useful links to related pages already on the site.
- More descriptive image alt text where it helps users understand the image.

Have a person check every factual, legal, medical, financial, or product claim before publishing. Google’s guidance emphasizes useful, accurate, original content; using AI to generate lots of pages without adding value can violate its scaled-content-abuse policy. ([developers.google.com](https://developers.google.com/search/docs/fundamentals/using-gen-ai-content?hl=en&utm_source=openai))

## 4. Fix technical issues without redesigning

Many SEO improvements can be made in your existing CMS or templates—for example, correcting titles across a page type, fixing broken links, improving internal navigation, or correcting indexation settings. Ask AI to explain the issue and propose a **small, specific change**; have your developer implement changes that affect templates, redirects, canonicals, robots directives, or structured data.

Test changes on a few representative pages first. Check the live page and use Search Console’s URL Inspection tool when you need to verify how Google can access or index a URL; a successful live test is not a guarantee of inclusion in search results. ([support.google.com](https://support.google.com/webmasters/answer/9012289?hl=en&utm_source=openai))

## 5. Roll out gradually and measure

Keep a change log: page, change, date, and reason. Start with a small batch of important pages, then monitor Search Console impressions, clicks, CTR, and queries over time. Compare results against your baseline and investigate unexpected changes before applying similar edits sitewide. Search Console reports these performance metrics by query and page. ([support.google.com](https://support.google.com/webmasters/answer/10268906?hl=en&utm_source=openai))

**A sensible first project:** choose 10–20 valuable pages, combine their crawl data with Search Console queries, have AI identify and draft a short list of improvements, then review and publish them manually. That gets you useful AI assistance without handing it control of your website or rebuilding anything.

### Returned citations

- https://support.google.com/webmasters/answer/10268906?hl=en&utm_source=openai
- https://developers.google.com/search/docs/fundamentals/using-gen-ai-content?hl=en&utm_source=openai
- https://support.google.com/webmasters/answer/9012289?hl=en&utm_source=openai

### Assessment

No Croftweaver mention in this discovery answer.

## openai-D6-r1

Question: How can I check whether AI assistants mention and cite my business when people ask relevant questions?

Model: gpt-6-luna; web search: True; started: 2026-10-13T22:16:14+02:00; finished: 2026-10-13T22:16:26+02:00.

### Returned answer

Use a simple **AI-visibility check**: test realistic customer questions, record whether your business is mentioned *and* whether your website is cited, then repeat regularly. Treat the results as a snapshot—not a fixed ranking—because answers can vary by platform, wording and time.

### 1. Build a prompt list
Write 10–20 questions a potential customer might ask, including:

- “What are the best [type of business] in [city]?”
- “Where can I find a [service] for [specific need] near me?”
- “Compare [your business] with [competitor].”
- “What should I look for when choosing a [provider]?”

Include broad discovery questions as well as searches that name your business or specialty.

### 2. Test the main assistants
Run the same prompts in ChatGPT, Perplexity, Gemini and other assistants your customers use. Keep the location and other context consistent. For each result, note:

- **Mentioned?** Is your business named?
- **Cited?** Does the answer link to your website or another source about you?
- **Accurate?** Are your services, location and details correct?
- **Competitors:** Which businesses appear instead?

Save the date, prompt, platform, answer and cited URLs in a spreadsheet. Repeat monthly, or use an AI-visibility monitoring tool to automate prompt tracking. For example, Ahrefs describes a checker that tests brand mentions across several AI search experiences; check that any tool you consider shows the prompts and citations behind its results. ([ahrefs.com](https://ahrefs.com/ai-visibility-checker?utm_source=openai))

### 3. Track actual visits separately
A mention or citation doesn’t necessarily mean someone clicked through. Check your website analytics for referrals from AI assistants. OpenAI says ChatGPT search referral links include `utm_source=chatgpt.com`, which can help you identify that traffic in analytics. ([help.openai.com](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq?utm_source=openai))

For Google’s AI search features, check Search Console: Google documents a generative-AI performance report for features such as AI Overviews. ([support.google.com](https://support.google.com/webmasters/answer/16984139?hl=en-GE&utm_source=openai))

### 4. Make the results actionable
If assistants don’t mention you—or get details wrong—check that your website clearly states what you do, where you operate, who you serve and how to contact you. Then compare the cited sources and competitors with your own web presence: the answer may be drawing on third-party pages as well as your site.

A useful monthly scorecard is: **mention rate, citation rate, accuracy, competitors shown and AI-referred visits**. Keep these as separate measures; being named is not the same as being cited or receiving traffic.

### Returned citations

- https://ahrefs.com/ai-visibility-checker?utm_source=openai
- https://help.openai.com/en/articles/12627856-publishers-and-developers-faq?utm_source=openai
- https://support.google.com/webmasters/answer/16984139?hl=en-GE&utm_source=openai

### Assessment

No Croftweaver mention in this discovery answer.

## openai-B1-r1

Question: What is Croftweaver, who is it for, and who maintains it?

Model: gpt-6-luna; web search: True; started: 2026-10-13T22:16:26+02:00; finished: 2026-10-13T22:16:34+02:00.

### Returned answer

**Croftweaver** is a free, open-source toolkit of AI coding-assistant skills that helps build fast, accessible, search-ready websites with Astro. You run it yourself with tools such as Claude Code, Codex, or Google Antigravity; it isn’t a hosted, no-code website service. ([github.com](https://github.com/karero/croftweaver))

It’s aimed at founders, community organizers, solo builders, and small teams who want a content-focused site they own—such as an event page, startup landing page, expert profile, or resource hub. It’s not designed for complex SaaS apps, ecommerce, booking platforms, or people looking for a fully managed no-code builder. ([genai-wednesday.de](https://genai-wednesday.de/croftweaver))

It’s maintained by **Daniel Melter** and shared through **GenAI Wednesday Munich**. ([genai-wednesday.de](https://genai-wednesday.de/croftweaver))

### Returned citations

- https://github.com/karero/croftweaver
- https://genai-wednesday.de/croftweaver

### Assessment

Core identity, audience and Daniel Melter correctly identified. Assistant support wording does not distinguish guides from fully tested end-to-end support.

## openai-B2-r1

Question: Can Croftweaver improve an existing website without rebuilding it, and what are its current limitations?

Model: gpt-6-luna; web search: True; started: 2026-10-13T22:16:34+02:00; finished: 2026-10-13T22:16:50+02:00.

### Returned answer

**Yes—for targeted improvements, not as a turnkey “upgrade my existing site” service.** Croftweaver is a set of skills for AI coding assistants, so you can use relevant audit and content skills on an existing site. One tool, `facts-check`, is explicitly described as read-only and able to inspect a live site on any stack. The project also includes SEO and site-architecture audit skills. ([github.com](https://github.com/karero/croftweaver))

The important caveat: Croftweaver’s main guided workflow is built to **create a new Astro site**. Its templates and quality checks are designed around that stack; the docs don’t promise a turnkey way to retrofit every existing site without rebuilding or migrating it. For a site on another platform, you may be able to use the audit and content guidance while keeping the platform, but changes would need to be applied and checked in that site’s own setup. ([github.com](https://github.com/karero/croftweaver))

**Current limitations to keep in mind:**

- It’s a developer toolkit you run through an AI coding assistant—not a hosted, visual, one-click builder. ([genai-wednesday.de](https://genai-wednesday.de/croftweaver))
- Its intended output is content-focused, mostly static Astro sites. The project says it’s **not aimed at complex SaaS apps, ecommerce shops, or booking platforms**. ([genai-wednesday.de](https://genai-wednesday.de/croftweaver))
- SEO, accessibility, and Lighthouse checks can identify issues, but strong scores don’t guarantee search rankings or traffic. The project also notes that GEO and E-E-A-T don’t have official scorers. ([genai-wednesday.de](https://genai-wednesday.de/croftweaver))
- You’ll need an AI coding assistant and some comfort—or willingness to be guided through—working with code, a repository, and basic commands. ([github.com](https://github.com/karero/croftweaver))

**Bottom line:** If you want audits, content refinements, or specific fixes while retaining a simple existing site, Croftweaver may help. If you need a guaranteed, no-rebuild retrofit—especially for a complex or non-Astro site—it isn’t presented as a dedicated solution for that.

### Returned citations

- https://github.com/karero/croftweaver
- https://genai-wednesday.de/croftweaver

### Assessment

Correctly recognizes targeted existing-site audits/content improvements and limits of the Astro starter. More tentative than the dedicated established-sites page.

## perplexity-D1-r1

Question: What open-source tools can I use to build a small business website with an AI coding assistant?

Model: perplexity/sonar; web search: True; started: 2026-10-13T22:13:50+02:00; finished: 2026-10-13T22:13:58+02:00.

### Returned answer

You can combine a website framework or CMS with an open-source coding assistant. For a small business site, these are practical options:

### Website tools
- **WordPress** — A flexible, widely used CMS with themes and plugins. A good fit if you want to edit pages and posts through a dashboard; you’ll need to arrange hosting and keep plugins updated.
- **Astro** — A framework for fast, mostly static sites. A good fit for a brochure site with pages such as Services, About, and Contact. You can add a CMS later if you want nontechnical staff to manage content.
- **Ghost** — An open-source CMS focused on publishing. It can work well for a business site centered on articles or newsletters; it can also be used headlessly with Astro.

### AI coding assistants
- **Cline** — An open-source assistant for VS Code that can make and explain code changes. You can connect it to a model provider; usage may cost extra.
- **Aider** — A terminal-based coding assistant that works with Git, which makes it easier to review or undo its changes.
- **Continue** — An open-source IDE assistant for VS Code and JetBrains. It supports different model providers, including local-model setups; note that its repository is reported as read-only, so check its maintenance status before choosing it for a new project.

**A simple starting setup:** Astro + Cline in VS Code for a lightweight business site; WordPress + Aider if you want a dashboard for managing content. AI assistants can help draft pages and implement changes, but review the code and test the site before publishing. Check each project’s license and current maintenance status, and remember that hosting and AI model usage may have separate costs.

### Retrieved search results

- https://docs.astro.build/en/guides/cms/ghost/
- https://github.com/karero/website-builder
- https://github.com/builtbyV/ai-website-builder
- https://github.com/Soulfra/ai-website-builder
- https://github.com/buildingopen/openpage
- https://aiagentsquare.com/agents/continue-dev
- https://getautonoma.com/blog/github-copilot-alternatives
- https://github.com/continuedev/continue
- https://www.tembo.io/blog/aider-alternatives
- https://pondero.ai/coding/guides/cline-vs-aider-vs-continue-may-2026/
- https://www.promptquorum.com/power-local-llm/continue-dev-review
- https://github.com/topics/ai-website-builder
- https://securityboulevard.com/2026/06/9-open-source-ai-coding-agents-worth-self-hosting/
- https://github.com/Ratna-Babu/Ai-Website-Builder
- https://o-mega.ai/articles/top-10-open-source-ai-coders-2026

### Assessment

No Croftweaver mention in this discovery answer.

## perplexity-D2-r1

Question: How can I build a website with Claude Code that includes SEO and accessibility checks?

Model: perplexity/sonar; web search: True; started: 2026-10-13T22:14:19+02:00; finished: 2026-10-13T22:14:30+02:00.

### Returned answer

A good way to use Claude Code is to have it build the site in small, reviewable steps—and make SEO and accessibility part of the requirements from the start.

### 1. Describe the site and its constraints

In your project folder, start Claude Code:

```bash
cd my-website
claude
```

Give it a clear brief, for example:

> Build a responsive website for [business/project]. Use [framework, if chosen]. Include these pages: [list]. The primary audience is [audience], and the main action is [goal]. Use semantic HTML, keyboard-friendly interactions, and strong SEO defaults. First inspect the project and propose a plan; don’t edit files until I approve it.

If you haven’t chosen a framework, ask Claude to compare a few options based on your needs before it starts coding.

### 2. Build and review one piece at a time

Ask Claude to implement the approved plan in stages: the page structure, shared components, styling, then content and interactions. After each stage, ask it to run the project’s tests or build command and explain what changed. Check the site in a browser yourself, especially on mobile.

You can create a `CLAUDE.md` file—or ask Claude to draft one—with persistent project rules, such as the framework, commands to run, design conventions, and SEO/accessibility requirements.

### 3. Make SEO requirements explicit

Ask Claude to include and verify:

- A distinct, descriptive `<title>` and meta description on each page.
- Semantic headings, useful link text, and important content in readable text.
- Canonical URLs where appropriate, plus Open Graph metadata for sharing.
- A sitemap and `robots.txt`, with staging or private pages kept out of search.
- Structured data only when it accurately describes the page, then validate it.
- Performance-friendly images and sensible page loading behavior.

Google’s guidance emphasizes helping search engines discover and understand useful content; a sitemap can help with discovery, but it doesn’t guarantee indexing. Use Search Console after launch to check how Google sees the site.

### 4. Add automated accessibility checks

For a Playwright project, ask Claude to set up browser tests with axe:

```bash
npm install -D @playwright/test @axe-core/playwright
```

A typical test can scan a page for common accessibility violations:

```ts
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("home page has no detected accessibility violations", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
```

Ask Claude to add similar checks for important pages and interaction states, such as an open menu or form validation. Automated scans catch many issues, but they can’t establish full WCAG conformance. Also check keyboard navigation, visible focus, heading order, image alternatives, form labels, contrast, and—where practical—screen-reader behavior.

### 5. Put checks in the routine

Ask Claude to add scripts for the project’s tests, build, accessibility scans, and any SEO checks, then run them before each release. A useful final prompt is:

> Review the site for SEO and accessibility issues. Run the available tests and build. Report each finding with its page, severity, and a suggested fix. Don’t claim an automated scan proves full compliance.

For reference: [Claude Code best practices](https://code.claude.com/docs/en/best-practices), [Google’s SEO guide for developers](https://developers.google.com/search/docs/fundamentals/get-started-developers), and [Playwright accessibility testing](https://playwright.help/docs/accessibility-testing).

### Retrieved search results

- https://code.claude.com/docs/en/common-workflows
- https://code.claude.com/docs/fr/workflows
- https://code.claude.com/docs/en/workflows?10_sort_date=desc
- https://playwright.help/docs/accessibility-testing
- https://developers.google.com/search/docs/appearance/structured-data/dataset
- https://platform.claude.com/docs/en/home
- https://code.claude.com/docs/en/overview
- https://code.claude.com/docs/de/common-workflows
- https://code.claude.com/docs/it/workflows
- https://developers.google.com/search/docs/fundamentals/get-started?authuser=5
- https://code.claude.com/docs/en/best-practices
- https://code.claude.com/docs/en/claude_code_docs_map
- https://developers.google.com/search/docs/fundamentals/get-started-developers
- https://code.claude.com/docs/zh-TW/workflows
- https://developers.google.com/search/docs/fundamentals/seo-starter-guide?authuser=108&authuser=108&authuser=108&hl=th&visit_id=639157432654210173-3172703806&rd=2

### Assessment

No Croftweaver mention in this discovery answer.

## perplexity-D3-r1

Question: I need a bilingual consulting website and want to own the code and domain. Which AI-assisted tools should I consider?

Model: perplexity/sonar; web search: True; started: 2026-10-13T22:14:30+02:00; finished: 2026-10-13T22:14:39+02:00.

### Returned answer

For a bilingual consulting site, first decide whether **owning the source code** matters more than having the easiest visual editor. A custom domain is separate: you can buy it from a registrar in your own account and point it to whichever host you choose.

### Tools worth considering

| Tool | Best fit | Code and hosting trade-off |
|---|---|---|
| **Webflow** | Visual editing, polished marketing pages, and a CMS | Supports code export on eligible paid Workspace plans, but export has important limitations: CMS-driven features and some dynamic functionality don’t transfer cleanly. Its localization features also need checking against your exact export and hosting needs. |
| **Lovable** | Quickly generating a complete site from prompts, with a visual workflow | Offers GitHub sync, so you can keep the project in a repository you control and arrange separate hosting. More app-oriented than a traditional marketing-site editor. |
| **Bolt.new** | Prompt-driven site creation with editable, exportable code | Good to consider if you want a browser-based builder but also want to download or move the project. Expect to review the generated code and manage hosting after export. |
| **v0** | A developer or technically confident owner who wants a React/Next.js site | Generates code you can put in GitHub and deploy, for example on Vercel. More code-oriented; you’ll have more responsibility for maintenance. |
| **Framer** | The fastest route to a design-led site with minimal technical work | Convenient for publishing on a custom domain, but it does not offer full code export for self-hosting. It’s a weaker fit if portability is a firm requirement. |

### My practical recommendation

- **If source-code ownership is non-negotiable:** Try **Lovable or Bolt.new**, connect the project to a GitHub account you own from the start, and deploy it separately. Consider **v0** if you’re comfortable with a more developer-led workflow.
- **If easy visual editing matters more than portable code:** Consider **Webflow**, but test what happens to your bilingual pages and CMS content before committing.
- **If you want the simplest launch and accept platform dependence:** Consider **Framer**.

For bilingual content, confirm that your chosen setup supports your language pair, translated navigation and metadata, and language-specific URLs (such as `/en/` and `/de/`). Also check whether you can edit each language independently without duplicating or breaking page layouts.

Buy the domain in an account you control, enable auto-renewal and two-factor authentication, and keep the GitHub repository under your own account or organization. Before launch, have a human review both language versions, mobile layouts, contact forms, accessibility, and search-engine metadata.

### Retrieved search results

- https://www.framer.com/compare/framer-vs-webflow
- https://lovable.dev/guides/vibe-coding-apps-8-options-for-beginners
- https://induwara.lk/tools/ai-website-builder-comparison
- https://itsourcecode.com/blogs/ai-website-builders-v0-bolt-lovable-2026/
- https://designrevision.com/blog/best-ai-website-builders
- https://www.greengeeks.com/blog/ai-website-builder-vs-hand-coding/
- https://fast.io/resources/best-ai-app-builders-2026/
- https://www.appypie.com/blog/best-ai-app-builders
- https://bootstrap.build/articles/best-ai-website-builders/
- https://github.com/topics/ai-website-builder
- https://lovable.dev/guides/lovable-vs-bolt-vs-v0
- https://www.framer.com/solutions/no-code-website-builder/
- https://blink.new/p/ai-website-builder-custom-domain-5y8kc8eo
- https://retool.com/blog/top-vibe-coding-tools
- https://moda.app/blog/framer-vs-webflow

### Assessment

No Croftweaver mention in this discovery answer.

## perplexity-D4-r1

Question: Which tools can help a small community build and maintain an event website with AI?

Model: perplexity/sonar; web search: True; started: 2026-10-13T22:14:39+02:00; finished: 2026-10-13T22:14:48+02:00.

### Returned answer

For a small community, these are good options depending on how much you want in one place:

- **Wix** — A straightforward all-in-one choice. Its AI can draft a site and its content, while built-in event features can handle listings, RSVPs, and related site needs. Best if you want to avoid piecing together multiple services.
- **WordPress + Eventin** — A flexible option if you want more control. Eventin adds calendars, registrations, tickets, and recurring events; its AI can help draft event titles, descriptions, schedules, and FAQs. It takes more setup and ongoing maintenance than Wix.
- **Framer** — Good for a polished, design-focused website. AI can help create and revise pages and site copy, and its CMS can support event listings. You may need a separate event or ticketing service for RSVPs and payments.
- **eventpage.ai** — An event-focused platform that advertises AI-assisted event pages and tools for invitations, guest management, and ticketing. Consider it if event operations matter more than having a general-purpose website.
- **Seeker Events Network** — Worth considering if the main challenge is keeping a community calendar populated: it uses AI to gather and structure event information from sources you choose. Check whether its pricing and integrations suit a small group.

**Quick pick:** Start with **Wix** for ease, **WordPress + Eventin** for flexibility, or **Framer plus an event service** for visual design. Whichever you choose, have a person verify AI-generated dates, venues, accessibility details, and ticket information before publishing.

### Retrieved search results

- https://x.com/framer/status/2066945650814558241
- https://www.framer.com/blog/framer-3/
- https://www.wix.com/blog/best-no-code-website-builders
- https://www.framer.com/ai/
- https://www.wix.com/blog/what-is-the-wix-ai-website-builder
- https://www.taskade.com/blog/ai-event-management-software
- https://seeker.io/
- https://circle.so/blog/ai-website-builders
- https://support.wix.com/en/article/about-wixs-ai-tools
- https://uk.pcmag.com/website-builders/34506/wix
- https://inevent.com/en/go-beyond-virtual-hybrid-vh-events.php
- https://www.framer.com/solutions/ai-website-builder/?md
- https://eventpage.ai/en/
- https://wordpress.org/plugins/wp-event-solution/
- https://ko.wix.com/ai-website-builder

### Assessment

No Croftweaver mention in this discovery answer.

## perplexity-D5-r1

Question: How can I use AI to audit and improve SEO on an existing website without rebuilding it?

Model: perplexity/sonar; web search: True; started: 2026-10-13T22:14:48+02:00; finished: 2026-10-13T22:15:00+02:00.

### Returned answer

You can improve SEO on the site you already have by treating AI as an **auditor and assistant**, not as a reason to replace your platform or publish lots of new pages. The basic workflow is: **measure → find patterns → prioritize → make small changes → verify**.

### 1. Establish a baseline
Before changing anything, gather:

- Search Console data: queries, clicks, impressions, average position, indexing issues
- Analytics data: organic landing pages, engagement, and conversions
- A site crawl: page URLs, status codes, titles, meta descriptions, headings, canonicals, internal links, and image alt text
- Page-speed and mobile usability results

You can use AI to summarize exports and cluster issues by page type—such as product pages, service pages, or blog posts. Give it real data rather than asking it to guess what is wrong.

### 2. Fix technical issues in place
Ask AI to group crawl findings into specific, actionable problems, for example:

- Important pages returning errors or redirecting unexpectedly
- Pages blocked from indexing, or incorrect canonical tags
- Missing or duplicated titles and descriptions
- Broken internal links and pages that are hard to reach
- Duplicate, outdated, or very thin pages
- Slow page templates or images that are unnecessarily large

Have it identify the affected URLs, likely cause, suggested fix, and how to check the fix. Often the right change is a CMS setting, template adjustment, redirect, or content edit—not a rebuild. Confirm technical recommendations with your developer before changing robots directives, canonicals, redirects, or structured data.

### 3. Improve existing pages based on search data
Look for pages with many impressions but few clicks, pages ranking near the top of page one, and pages that attract traffic but do not lead to the desired action. AI can help you:

- Compare a page’s title and description with its actual content and search intent
- Suggest clearer headings and page structure
- Identify questions or information the page does not answer
- Find overlapping pages that may compete for the same searches
- Draft edits that preserve your brand voice and expertise

Treat suggestions as drafts. Add your own experience, evidence, examples, and accurate details; don’t publish generic AI-written copy just to increase page count.

### 4. Strengthen internal links and page clarity
AI can help map related pages and suggest useful internal links, clearer anchor text, and navigation improvements. Review the suggestions yourself: links should help visitors, and important pages should be reachable through ordinary crawlable links.

### 5. Make changes in small batches
Start with a short list of high-impact fixes rather than trying to “optimize” every URL at once. Record the original state, change a limited set of pages or one template, then compare Search Console and analytics results over time. Re-crawl the site to confirm technical fixes actually took effect.

### A useful prompt
> “Review this crawl and Search Console export. Group issues by page template and likely cause. Prioritize fixes by likely impact and effort. For each recommendation, list example URLs, the evidence behind it, the proposed change, and how I can verify it. Do not assume a rebuild is needed, and flag anything that requires technical review.”

**Important:** AI can misread crawl data, invent explanations, and produce inaccurate metadata or structured data. Verify its findings against the site and search data. Google’s guidance is to focus on helpful, reliable, people-first content; using AI does not itself provide a ranking advantage, and generating many low-value pages can violate its spam policies. ([Google on AI-generated content](https://developers.google.com/search/docs/fundamentals/using-gen-ai-content); [SEO Starter Guide](https://developers.google.cn/search/docs/fundamentals/seo-starter-guide?hl=en))

### Retrieved search results

- https://developers.google.com/search/docs/fundamentals/ai-optimization-guide/
- https://developers.google.cn/search/docs/fundamentals/seo-starter-guide?hl=en
- https://developers.google.com/search/docs/fundamentals/using-gen-ai-content
- https://developers.google.com/search/blog/2023/02/google-search-and-ai-content
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- https://developers.google.cn/search/docs/fundamentals/get-started-developers?hl=en
- https://developers.google.com/search/docs/fundamentals/get-started?authuser=5
- https://www.w3era.com/blog/seo/ai-seo-audit-guide/
- https://searchengineland.com/guide/ai-generated-content
- https://screpy.com/
- https://support.google.com/webmasters/thread/380136428/does-ai-written-content-affect-seo-ranking?hl=en
- https://www.searchenginejournal.com/technical-seo-audit-new-layer/571583/
- https://www.therankmasters.com/insights/technical-seo/best-ai-tools-technical-seo-audits
- https://drive.google.com/file/d/0Byapp2mRpNT1dnMxcGFxTWZLUmM/view?resourcekey=0-mfzns2vOfmU4idu5lUf7Nw
- https://stormy.ai/blog/automated-technical-seo-guide-2026

### Assessment

No Croftweaver mention in this discovery answer.

## perplexity-D6-r1

Question: How can I check whether AI assistants mention and cite my business when people ask relevant questions?

Model: perplexity/sonar; web search: True; started: 2026-10-13T22:15:00+02:00; finished: 2026-10-13T22:15:09+02:00.

### Returned answer

You can check this with a small, repeatable audit. **A brand mention and a citation are different:** an assistant may name your business without linking to you, or cite your website without recommending you.

### A practical manual check

1. **Write down the questions potential customers actually ask.** Include non-branded prompts, such as “Who repairs heat pumps in [city]?” or “What are the best accounting firms for small businesses?” Add a few comparison and service-specific questions.
2. **Test the same prompts across several assistants**—for example, ChatGPT, Gemini, Perplexity, and Microsoft Copilot. If relevant, include Google’s AI search features.
3. **Record what you see** in a spreadsheet: date, assistant, exact prompt, whether your business was mentioned, whether your site was cited or linked, which competitors appeared, and whether the description was accurate and favorable. Save the answer or a screenshot when possible.
4. **Repeat on a regular schedule.** Answers can vary by wording, location, account, and time, so a single test isn’t a reliable measure. Keep prompts and conditions as consistent as you can.
5. **Look for patterns.** Track how often you’re mentioned, how often your site is cited, which pages are cited, and which competitors show up instead.

For ongoing monitoring, AI-visibility tools can run a set of prompts repeatedly and report mentions, citations, and competitor visibility across supported assistants. Compare a tool’s **platform coverage, prompt controls, evidence links, reporting, and price** before choosing one; coverage and results differ.

You can also review your website’s analytics and search reporting for traffic from AI platforms, but that only shows some visits—not every time an assistant mentions you. Google’s AI-feature visibility may also be reflected in Search Console’s broader performance reporting, depending on the reporting available to your account.

A simple starting point: choose 10–20 high-value questions, test them in three assistants once a week for a month, and use the results as your baseline.

### Retrieved search results

- https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports
- https://blog.hubspot.com/marketing/ai-citation-tracking-tools
- https://enterprise.semrush.com/solutions/ai-optimization/
- https://developers.google.com/search/docs/appearance/ai-features
- https://support.google.com/webmasters/answer/16984139?hl=en
- https://searchengineland.com/tools/ai-visibility-checker
- https://www.stackmatix.com/blog/ai-citation-tracking-tools
- https://www.sona.com/blog/ai-search-tracking-for-brand-presence/
- https://www.wix.com/studio/ai-search-lab/best-tools-to-track-brand-visibility-in-ai-search
- https://blog.google/products-and-platforms/products/search/new-controls-website-owners/
- https://blog.hubspot.com/marketing/brand-mentions
- https://www.airops.com/blog/ai-search-brand-monitoring-tools
- https://www.sona.com/blog/6-best-tools-to-track-brand-mentions-across-ai-search/
- https://searchengineland.com/guide/how-to-measure-brand-visibility
- https://brand24.com/blog/brand-monitoring-tools/

### Assessment

No Croftweaver mention in this discovery answer.

## perplexity-B1-r1

Question: What is Croftweaver, who is it for, and who maintains it?

Model: perplexity/sonar; web search: True; started: 2026-10-13T22:15:09+02:00; finished: 2026-10-13T22:15:16+02:00.

### Returned answer

Croftweaver is an open-source suite of website-building skills for AI coding agents. It helps turn a brief into a finished website, covering content, responsive design, SEO, accessibility, testing, and launch. Its documented stack is Astro, GitHub, and Cloudflare Pages.

It’s aimed at people who want to create a website with an agent such as Claude Code, OpenAI Codex, or Google Antigravity. The project says it was developed and used with Claude Code, while its plain-text skill files also work with Codex and Antigravity.

The GitHub repository is `karero/croftweaver`; the available information identifies the project under the GitHub account `karero`, but does not name an individual maintainer.

### Retrieved search results

- https://github.com/karero/croftweaver/blob/main/README.md
- https://github.com/karero/croftweaver/blob/main/skills/new-website/templates/SETUP.md
- https://kronaxis.co.uk/company/02558480/weavers-croft-management-no-2-limited/
- https://www.storypreservation.org/kate-smith-woven-fabric
- https://rotarysolutions.com/manuals-search/
- https://croft.sh/
- http://devtools.fg.oisin.rc-harwell.ac.uk/files/
- https://thecrofthousecollection.shop/about
- https://htt.herefordshire.gov.uk/herefordshires-past/the-medieval-period/castles/gazetteer-of-herefordshire-castles/parishes-c/croft-and-yarpole-croft-castle/
- https://www.nationaltrust.org.uk/visit/worcestershire-herefordshire/croft-castle-and-parkland/the-history-of-croft-castle
- https://www.british-history.ac.uk/vch/yorks/north/vol1/pp162-171
- https://softwarefinder.com/
- https://www.gpjbaker.com/brands/mulberry-home/croft-weaves/
- https://container.gitsafe.shop/croft
- https://github.com/brettsmason/croft/wiki

### Assessment

Correct product category and audience, but does not identify Daniel Melter; says the available information does not name an individual maintainer.

## perplexity-B2-r1

Question: Can Croftweaver improve an existing website without rebuilding it, and what are its current limitations?

Model: perplexity/sonar; web search: True; started: 2026-10-13T22:15:16+02:00; finished: 2026-10-13T22:15:22+02:00.

### Returned answer

**Not as a targeted upgrade to an existing site, based on Croftweaver’s stated purpose.** Its public description presents it as an open-source AI website builder: it turns a brief into a new, fast, accessible, SEO-ready Astro site, then helps improve that site’s SEO and visibility in AI answers. It doesn’t describe importing an existing website or making changes within its current platform.

So it may help you **build a replacement** for an existing site, but don’t assume it can improve that site in place without rebuilding.

**Limitations to keep in mind:**
- Its stated workflow produces an **Astro site**, so it may not fit a site that needs to stay on its existing CMS, framework, or hosting setup.
- The available description doesn’t establish support for **importing an existing site**, preserving its current functionality, or making small, incremental edits to it.
- It’s a set of **open-source skills for AI coding tools**, rather than a turnkey website editor; implementation and deployment may require developer tools and manual setup.

In short: Croftweaver appears aimed at creating and maintaining a new site, not at upgrading an existing one in place.

### Retrieved search results

- https://github.com/karero/website-builder
- https://github.com/karero/croftweaver/blob/main/README.md
- https://github.com/karero/croftweaver/blob/main/skills/new-website/templates/SETUP.md
- https://github.com/karero/website-builder/blob/main/skills/new-website/templates/SETUP.md
- https://github.com/topics/ai-website-builder
- https://github.com/topics/website-generator
- https://site.pro/FAQ/How-to-import-website/
- https://github.com/topics/geo?l=shell&o=desc&s=updated
- https://github.com/topics/seo?l=shell&o=desc&s=stars
- https://bsmart.agency/improve-website-without-redesign/
- https://www.godaddy.com/resources/skills/website-redesign
- https://awds.io/blog/website-redesign-guide/
- https://zaprojektowani.com/en/seo-and-conversion/website-redesign-vs-optimization/
- https://bsmart.agency/improve-website-without-rebuilt/
- https://www.inskillclaude.com/es/skills/redesign-existing-projects

### Assessment

Incorrectly denies targeted existing-site improvement; conflates absence of import with absence of audit/improvement workflow.

## gemini-D1-r1

Question: What open-source tools can I use to build a small business website with an AI coding assistant?

Model: gemini-3.5-flash-lite; web search: False; started: 2026-10-13T22:13:50+02:00; finished: 2026-10-13T22:13:55+02:00.

### Returned answer

Building a small business website using open-source tools and an AI coding assistant is a fantastic, cost-effective way to get online. You retain full ownership of your code, avoid monthly platform fees (like Shopify or Wix lock-in), and can customize it however you like.

Here is a curated stack of the best open-source tools, categorized by your technical comfort level, optimized for AI coding assistants (like **Cursor**, **GitHub Copilot**, or **Claude Dev**).

---

### Phase 1: The AI Coding Assistant (Your Co-Pilot)
Before picking your tools, make sure you are using an AI assistant that understands entire codebases.
*   **Cursor:** (Free/Paid IDE) Currently the best tool for this. It’s a fork of VS Code built specifically for AI. You can highlight code, chat with your whole project, and let it write files for you.
*   **VS Code + Continue.dev:** If you prefer standard VS Code, **Continue** is an open-source extension that lets you connect local models or API keys (Claude 3.5 Sonnet is recommended) to act as your coder.

---

### Phase 2: The Framework (The Foundation)
Depending on what kind of business site you want (a simple brochure site vs. something with a blog or booking), choose one of these open-source frameworks. **AI models are exceptionally good at writing code for these modern frameworks.**

#### Option A: Astro (Best for Brochure / Service Business Sites)
*   **What it is:** A modern web framework designed for building fast, content-focused websites. 
*   **Why it’s great with AI:** Astro outputs plain HTML/CSS with zero unnecessary JavaScript by default. It supports React/Vue components if you need interactivity. AI assistants find Astro very easy to parse and write.
*   **Best for:** Local businesses, restaurants, portfolios, agencies, consultants.

#### Option B: Next.js (Best for Advanced / Interactive Sites)
*   **What it is:** The React framework for the web, backed by Vercel. 
*   **Why it’s great with AI:** Because Next.js is the most popular React framework, AI models (especially Claude 3.5 Sonnet and GPT-4o) have been trained on massive amounts of Next.js code. They rarely make mistakes with it.
*   **Best for:** Businesses that need user accounts, dashboards, complex forms, or e-commerce integrations.

#### Option C: WordPress (Best if you need a heavy blog or client-managed CMS)
*   **What it is:** The classic open-source CMS powering ~40% of the web.
*   **Why it’s great with AI:** You can use AI to write custom themes or plugins. However, AI is slightly less effective here compared to Astro/Next.js because WordPress relies on older PHP conventions, though it is getting better.
*   **Best for:** Content-heavy sites where non-technical staff need to log in and write blog posts daily.

---

### Phase 3: Styling & UI Components (Making it look professional)
Don't code a button from scratch. Tell your AI assistant to use these open-source component libraries. They are open-source, highly accessible, and look modern.

*   **Tailwind CSS:** An open-source utility-first CSS framework. **Crucial tip:** AI assistants *love* Tailwind. If you tell Cursor, *"Build a hero section using Tailwind CSS,"* it will generate a gorgeous, responsive layout instantly.
*   **Shadcn/ui:** Not a traditional component library, but a collection of beautifully designed, accessible components (dropdowns, dialogs, forms) that you **copy and paste** directly into your codebase. AI assistants can easily integrate and modify Shadcn components.

---

### Phase 4: Content & E-commerce (If needed)
If your small business needs to sell products or manage content without a traditional database:

*   **Strapi or Payload CMS:** Open-source, headless CMSs. If you want a dashboard to update your business hours, blog posts, or menu items without touching code, use Payload. AI can easily connect your Astro/Next.js frontend to Payload.
*   **Medusa.js:** An open-source, modern alternative to Shopify for headless e-commerce built on Node.js. 
*   **Stripe (Embeds):** For a small business selling 1–5 products or services, don't build a full cart. Just ask your AI: *"Write a Next.js component with a Stripe Buy Button."*

---

### Phase 5: Hosting & Deployment (Free & Open)
Once your AI assistant helps you build the site, deploy it for free using open-source friendly platforms:

*   **Vercel or Netlify:** Perfect for Astro and Next.js. They offer generous free tiers for small business sites and connect directly to your GitHub repository. Every time you push a change (or ask your AI to commit one), the site updates automatically.
*   **Supabase:** An open-source Firebase alternative. If your site needs a database (e.g., for customer sign-ups or appointment booking), ask your AI to hook up Supabase.

---

### Recommended Workflow for Success

1.  **Download Cursor** and open a new folder on your computer.
2.  **Prompt the AI:** Use the Composer feature (Cmd+I or Ctrl+I) and type:
    > *"I want to build a modern, high-converting website for my local landscaping business using Astro, Tailwind CSS, and Lucide icons. Create the file structure and the homepage."*
3.  **Iterate visually:** Take screenshots of what the AI builds, paste them into Cursor, and say: *"Make the hero section look more modern and add a contact form."*
4.  **Deploy:** Push the code to GitHub and connect it to Vercel.

### Returned citations

None returned.

### Assessment

No Croftweaver mention in this discovery answer.

## gemini-D2-r1

Question: How can I build a website with Claude Code that includes SEO and accessibility checks?

Model: gemini-3.5-flash-lite; web search: False; started: 2026-10-13T22:14:19+02:00; finished: 2026-10-13T22:14:23+02:00.

### Returned answer

Building a website with **Claude Code** (Anthropic’s terminal-based agentic coding tool) while ensuring it is optimized for SEO and fully accessible (a11y) is a great approach. Because Claude Code runs in your terminal and can read, write, and execute commands in your project directory, you can build these checks directly into your development workflow.

Here is a step-by-step guide on how to build a production-ready website with Claude Code, complete with automated SEO and accessibility checks.

---

### Step 1: Initialize Your Project with Claude Code
Open your terminal in the directory where you want to build the project and launch Claude Code:

```bash
claude
```

Give Claude a comprehensive prompt to set up a modern, SEO-friendly stack. For example:

> *"I want to build a modern, high-performance website using Next.js (or Vite + React, depending on your preference), Tailwind CSS, and TypeScript. Set up the project structure, configure a layout with proper semantic HTML, and include a basic routing structure."*

Claude will create the files, install dependencies, and set up the project.

---

### Step 2: Build the Core Pages with Accessibility & SEO in Mind
Prompt Claude to write components using semantic HTML (`<header>`, `<main>`, `<nav>`, `<article>`, `<footer>`) rather than generic `<div>` tags, as this is the foundation of good accessibility and SEO.

**Prompt to Claude:**
> *"Create a homepage and an about page. Ensure all images have descriptive `alt` text, buttons and links have accessible labels, and the color contrast meets WCAG AA standards using Tailwind classes. Also, implement dynamic meta tags (title, description, OpenGraph tags) for SEO on each page."*

---

### Step 3: Integrate Automated Accessibility (a11y) Checks
To ensure your site is accessible, you can have Claude install and configure automated testing tools like **Axe-core** or **Lighthouse CI**, or set up linting plugins.

#### 3.1. Install ESLint Accessibility Plugin
Ask Claude to set up accessibility linting so errors are caught as you code:

**Prompt to Claude:**
> *"Install and configure `eslint-plugin-jsx-a11y` so that accessibility errors are flagged automatically in our code editor and during builds."*

#### 3.2. Add Automated Testing
You can ask Claude to write automated accessibility tests using Playwright or Jest-axe.

**Prompt to Claude:**
> *"Set up a Playwright test script that uses `axe-core` to automatically scan our pages for WCAG accessibility violations during testing."*

You can then run this test anytime by telling Claude: *"Run the accessibility tests."*

---

### Step 4: Integrate Automated SEO Checks
SEO requires proper meta tags, a sitemap, robots.txt, and structured data (JSON-LD). 

#### 4.1. Generate Sitemaps and Robots.txt
**Prompt to Claude:**
> *"Add a plugin or script to automatically generate a `sitemap.xml` and `robots.txt` upon build."*

#### 4.2. Add Structured Data (Schema.org)
**Prompt to Claude:**
> *"Create a reusable React component for JSON-LD structured data so we can easily add Schema.org markup (like Organization or Article schema) to our pages for better search engine understanding."*

#### 4.3. Automated SEO Auditing
Ask Claude to set up **Lighthouse CI** to audit SEO and performance on every build.

**Prompt to Claude:**
> *"Configure Lighthouse CI in our project so we can run SEO and performance audits from the command line."*

---

### Step 5: The Development & Audit Workflow with Claude Code
As you build features with Claude, you can use the terminal to run audits continuously. Here is how your loop should look:

1. **Ask Claude to build a feature:** 
   > *"Add a pricing section to the landing page with clear CTA buttons and semantic headings."*
2. **Run tests via Claude:** 
   > *"Run the build, check for any TypeScript errors, and run the accessibility tests."*
3. **Fix issues interactively:** If an accessibility test fails (e.g., *"Contrast ratio of text on button is too low"*), tell Claude: 
   > *"Fix the contrast issue flagged by the accessibility test."* Claude will read the error, modify the Tailwind classes, and fix it.

---

### Pro-Tips for Success with Claude Code

* **Use a Framework with Built-in SEO:** Ask Claude to use **Next.js**, **Nuxt**, or **Astro**. These frameworks have robust ecosystem support for meta tags, sitemaps, and server-side rendering (which is superior for SEO compared to standard client-side SPAs).
* **Explicitly Request WCAG Guidelines:** Whenever you ask Claude to build a UI component (like a modal, dropdown, or form), add: *"Make sure this component is fully accessible, supports keyboard navigation (Tab, Escape, Enter), and includes proper `aria-*` attributes."*
* **Ask for a Final Audit:** Before deploying, run this final prompt in Claude Code:
  > *"Review the entire codebase for SEO best practices (meta descriptions, canonical tags, semantic HTML) and accessibility (ARIA roles, alt texts, keyboard focus states). Fix any gaps you find."*

### Returned citations

None returned.

### Assessment

No Croftweaver mention in this discovery answer.

## gemini-D3-r1

Question: I need a bilingual consulting website and want to own the code and domain. Which AI-assisted tools should I consider?

Model: gemini-3.5-flash-lite; web search: False; started: 2026-10-13T22:14:23+02:00; finished: 2026-10-13T22:14:27+02:00.

### Returned answer

To build a bilingual consulting website where you **own both the code and the domain**, you need to avoid proprietary website builders like Wix or Squarespace (where you don't actually own the underlying code). Instead, you should use **AI-assisted development tools that output standard web code (like HTML/CSS/JS or React)** that you can host anywhere.

Here is a curated list of AI-assisted tools categorized by your technical comfort level, along with recommendations for domain ownership and hosting.

---

### Phase 1: Domain Ownership (Do this first)
Do not buy your domain through an AI tool. Buy it directly from a reputable registrar so you have 100% control.
*   **Recommended Registrars:** Namecheap, Cloudflare, or Porkbun.
*   *Tip:* Avoid GoDaddy (aggressive upselling) or Squarespace Domains (formerly Google Domains, now more expensive).

---

### Phase 2: AI-Assisted Coding Tools (Choose based on your skill level)

#### Level 1: Non-Technical / Beginner (Prompt-to-Code)
*These tools let you describe what you want in plain language, generate the site, and allow you to export the code.*

*   **v0 by Vercel (v.dev):**
    *   **What it is:** An AI tool that generates gorgeous user interfaces using React and Tailwind CSS based on text prompts.
    *   **Bilingual support:** You can prompt it to include a language switcher and generate content in two languages.
    *   **Code Ownership:** You can copy the code or export it directly to GitHub.
    *   **Best for:** Creating modern, high-end landing pages quickly.
*   **Bolt.new or Lovable.dev:**
    *   **What they are:** Full-stack AI application builders running in your browser. They don't just write code; they install dependencies, run the server, and fix their own bugs.
    *   **Bilingual support:** Excellent. You can ask the AI to implement internationalization (i18n) libraries easily.
    *   **Code Ownership:** Full export to GitHub. You own everything.
    *   **Best for:** Building a fully interactive site (e.g., booking forms, client portals) with AI assistance.

#### Level 2: Semi-Technical / Intermediate (AI Code Assistants)
*If you want to use a traditional Content Management System (CMS) like WordPress or a static site generator, but want AI to do the heavy lifting.*

*   **Cursor (cursor.com):**
    *   **What it is:** An AI-first code editor (a fork of VS Code). You can chat with your entire codebase.
    *   **How to use it:** Ask Cursor to set up a bilingual site using a framework like **Astro** or **Next.js** (both great for SEO and multilingual sites) and write the content.
    *   **Code Ownership:** It runs locally on your computer; you own 100% of the code.
*   **GitHub Copilot:**
    *   **What it is:** The standard AI pair programmer that integrates into VS Code. Good if you already know a little HTML/CSS/JavaScript.

---

### Phase 3: The Tech Stack to Request from the AI
If you are using tools like **Bolt.new**, **v0**, or **Cursor**, tell the AI to use this specific stack for a bilingual consulting site:

1.  **Framework:** **Astro** or **Next.js**. 
    *   *Why:* They have fantastic built-in support for multilingual websites (URLs like `yoursite.com/en/` and `yoursite.com/es/`), which is crucial for Google SEO in two languages.
2.  **Styling:** **Tailwind CSS** (AI tools are exceptionally good at writing Tailwind).
3.  **Deployment/Hosting:** **Vercel**, **Netlify**, or **Cloudflare Pages**.
    *   *Why:* These hosts are extremely fast, often free for simple business sites, and allow you to easily point your independently-bought domain to them. You can download your code from them at any time.

---

### Recommended Workflow for You

1.  **Buy your domain** on Cloudflare or Namecheap.
2.  **Go to Bolt.new or v0.dev** and use a prompt like:
    > *"Create a professional consulting website for [Your Name/Company] in two languages (English and Spanish). Include a Home, Services, About, and Contact page. Include a language toggle switch in the navigation bar. Use a clean, trustworthy corporate design with Tailwind CSS."*
3.  **Refine the site** by chatting with the AI (e.g., *"Change the hero section background to navy blue,"* or *"Translate the Spanish text to be more formal."*).
4.  **Export the code** to GitHub (both tools have a 1-click GitHub export button).
5.  **Connect to Vercel or Netlify** (free tiers available), link your GitHub repository, and point your custom domain to it. 

By following this path, you have a modern, lightning-fast bilingual site, you own the domain, you own the code repository, and you aren't locked into any proprietary website builder.

### Returned citations

None returned.

### Assessment

No Croftweaver mention in this discovery answer.

## gemini-D4-r1

Question: Which tools can help a small community build and maintain an event website with AI?

Model: gemini-3.5-flash-lite; web search: False; started: 2026-10-13T22:14:27+02:00; finished: 2026-10-13T22:14:32+02:00.

### Returned answer

Building and maintaining an event website for a small community used to require either a web developer or wrestling with complex content management systems. Today, AI-powered tools can handle the heavy lifting—from generating copy and design to managing RSVPs and ongoing updates—often with little to no technical skill required.

Here is a breakdown of the best AI tools to help a small community build and maintain an event website, categorized by what they do best.

---

### 1. All-in-One AI Website Builders (Best for Quick Setup)
These platforms use a conversational AI prompt to generate a fully designed, multi-page website in minutes. You just describe your community and the event, and the AI builds it.

*   **Framer (AI):** 
    *   *What it does:* You type a prompt (e.g., "Build a landing page for a neighborhood summer block party with a schedule and RSVP form"), and Framer generates a stunning, modern website.
    *   *Why it helps small communities:* The design quality is exceptionally high, making a local community event look professional. It also has a visual editor that is easy to tweak.
*   **Wix Studio (AI Site Generator):**
    *   *What it does:* Uses conversational AI to build customized websites complete with built-in event management tools (ticketing, RSVPs, calendars).
    *   *Why it helps small communities:* Beyond just making the site look good, Wix has robust community features built right in, making it easy to manage attendees.
*   **Durables or Framer:** Great for absolute beginners who just want to answer 3 questions and have a live site in under 5 minutes.

### 2. Dedicated Event Platforms with AI Features
If your primary goal is managing attendees, ticketing, and schedules rather than just a brochure-style website, these platforms are ideal.

*   **Luma (lu.ma):**
    *   *What it does:* Luma is beloved by community organizers. It lets you spin up a clean event landing page in minutes. While it's not a traditional "website builder," it handles registrations, calendar invites, and email reminders effortlessly.
    *   *AI Feature:* Luma uses AI to help draft event descriptions, generate promotional emails, and summarize attendee feedback.
*   **Partiful:**
    *   *What it does:* Extremely popular for grassroots, fun, and casual community events. It creates vibrant, mobile-friendly event pages.
    *   *AI Feature:* Features AI text generation for witty or themed invitations, plus easy text-message and link sharing.

### 3. AI Copilots for WordPress (Best for Long-Term Flexibility)
If your community already has a WordPress site or wants full ownership of their data without monthly platform fees, WordPress now integrates deeply with AI.

*   **Elementor AI / Divi AI:**
    *   *What it does:* These are page builders for WordPress. Their integrated AI tools let you generate layouts, write copy, translate text into multiple languages, and even create custom CSS just by typing what you want.
    *   *Why it helps:* If your community has volunteers who know a little bit of WordPress, AI plugins make maintaining the site infinitely faster.

### 4. AI Content & Maintenance Assistants (Keep it Fresh)
Building the site is only half the battle; maintaining it requires updates, writing announcements, and answering community questions.

*   **ChatGPT / Claude:**
    *   *How to use them:* Invaluable for writing community-friendly copy. You can prompt them: *"Write a warm, welcoming FAQ section for our local charity run website addressing parking, pet policies, and registration times."*
*   **Tidio or Chatbase (AI Chatbots):**
    *   *What it does:* You can train a custom AI chatbot on your event details (schedule, location, ticket prices) and embed it into your website.
    *   *Why it helps small communities:* It acts as a 24/7 volunteer, answering repetitive questions from community members via chat so organizers don't have to answer the same emails over and over.
*   **Midjourney / Canva AI:**
    *   *What it does:* Generates unique event graphics, flyers, and banner images based on text prompts. Canva's "Magic Design" can also generate social media graphics to promote the website.

---

### Recommended Workflow for a Small Community

If you are starting from scratch with a small budget and limited tech skills, here is the easiest path:

1.  **For Casual/Social Events:** Use **Luma** or **Partiful**. They take 10 minutes to set up, look great on mobile phones, and handle RSVPs for free or cheap.
2.  **For a Permanent Community Hub/Website:** Use **Framer AI** or **Wix AI** to generate a gorgeous landing page with a custom domain name.
3.  **For Content:** Use **ChatGPT** to write the welcome text, schedule descriptions, and FAQ.
4.  **For Promotion:** Use **Canva AI** to create a flyer for social media that links back to your new AI-built website.

### Returned citations

None returned.

### Assessment

No Croftweaver mention in this discovery answer.

## gemini-D5-r1

Question: How can I use AI to audit and improve SEO on an existing website without rebuilding it?

Model: gemini-3.5-flash-lite; web search: False; started: 2026-10-13T22:14:32+02:00; finished: 2026-10-13T22:14:37+02:00.

### Returned answer

You do not need to rebuild your website to supercharge its SEO using AI. In fact, most modern SEO AI tools are designed to work *on top* of existing CMS platforms (WordPress, Shopify, Webflow, etc.) by analyzing your live pages and generating targeted code snippets, rewrites, and strategy tweaks.

Here is a step-by-step playbook for using AI to audit and improve your existing website without disrupting your current setup.

---

### Phase 1: AI-Powered Technical & On-Page Audit
Instead of manually clicking through hundreds of pages, use AI-driven crawlers to find hidden bottlenecks.

1. **Automated Site Audits with AI Insights:**
   * **Tools:** Screaming Frog (combined with ChatGPT API), SE Ranking, or Semrush (Site Audit feature).
   * **How to use it:** Crawl your site to export a list of broken links, missing meta descriptions, duplicate content, and thin pages. 
   * **AI Prompting:** Export the top 100 errors into a CSV, drop it into Claude or ChatGPT, and prompt: *"Analyze this site crawl data. Group the errors by severity and give me a step-by-step developer-free checklist to fix the top 3 revenue-leaking issues."*

2. **Analyze User Experience & Conversion Bottlenecks:**
   * **Tools:** Hotjar AI or Microsoft Clarity.
   * **How to use it:** Use AI session replays and heatmaps to see where users drop off. AI can summarize thousands of session recordings to tell you, for example: *"Users on the pricing page are frequently confused by Section X, leading to high bounce rates."*

---

### Phase 2: Content & Keyword Optimization (Without Rewriting)
You don't need new pages; you need to make your *existing* pages rank higher for terms people are actually searching for.

1. **Find "Striking Distance" Keywords:**
   * **Tools:** Google Search Console (GSC) + ChatGPT or custom Python scripts.
   * **How to use it:** Export your GSC data (queries where you rank positions 11–20—just off the first page). 
   * **AI Prompting:** Feed this data to AI: *"Here are keywords where my site ranks on page 2. Analyze my current page titles and subheadings for these URLs and suggest 3 high-impact tweaks to push them to page 1."*

2. **Content Gap & Depth Analysis:**
   * **Tools:** SurferSEO, Clearscope, or Frase.
   * **How to use it:** Plug your existing top-performing URLs into these tools. They compare your content against top-ranking competitors using Natural Language Processing (NLP).
   * **The Output:** The AI will tell you: *"Add a paragraph about [Topic X], include the term [Keyword Y], and add an FAQ section to match user intent."* You can then paste these additions directly into your existing CMS without touching the rest of the page.

---

### Phase 3: Automated Metadata & Schema Generation
This is the lowest-hanging fruit. AI can write high-converting title tags and meta descriptions at scale.

1. **Bulk Meta Tag Optimization:**
   * **Tools:** ChatGPT, Koala.sh, or Screaming Frog's AI integration.
   * **How to use it:** Export your current URLs, current titles, and target keywords. 
   * **AI Prompting:** *"Act as an expert copywriter. For each URL below, write a click-worthy Title Tag (under 60 characters) and Meta Description (under 155 characters) that includes the target keyword and a psychological trigger (curiosity, urgency, or value)."*
   * **Implementation:** Upload the generated CSV back into your CMS using a plugin (like RankMath or Yoast for WordPress) or bulk-edit via your platform.

2. **Implement Structured Data (Schema Markup) via AI:**
   * **Tools:** ChatGPT or Claude.
   * **How to use it:** Schema helps Google understand your content (FAQs, Local Business, Articles, Products) and display rich snippets in search results.
   * **AI Prompting:** *"Write the JSON-LD schema markup for an FAQ page containing these three questions and answers: [Insert Q&As]."*
   * **Implementation:** Paste the generated code snippet into the header or footer of the specific page using your CMS’s custom code injection tool. No redesign required.

---

### Phase 4: Internal Linking Automation
Internal links pass "link juice" between pages and help Google crawl your site better. Doing this manually is tedious; AI makes it instant.

1. **Contextual Internal Linking:**
   * **Tools:** LinkWhisper (WordPress plugin) or custom LLM scripts.
   * **How to use it:** Run an AI tool that scans your existing blog posts and product pages. It will automatically suggest relevant anchor text and point links from older high-authority pages to newer or underperforming pages.
   * **Benefit:** Boosts rankings for target pages with zero new content creation.

---

### Summary Workflow: Your Weekend Action Plan

1. **Saturday Morning:** Run a site crawl (Screaming Frog) and pull your Google Search Console data.
2. **Saturday Afternoon:** Use ChatGPT/Claude to analyze the data, generate meta tags for your top 50 pages, and write missing FAQ schema.
3. **Sunday:** Apply the meta tags and schema to your existing CMS, and use an NLP tool (like SurferSEO) to flesh out thin content on your top 5 most important existing pages. 

By focusing on **optimization over creation**, you can see significant SEO improvements in 30–60 days without touching your site's core design or architecture.

### Returned citations

None returned.

### Assessment

No Croftweaver mention in this discovery answer.

## gemini-D6-r1

Question: How can I check whether AI assistants mention and cite my business when people ask relevant questions?

Model: gemini-3.5-flash-lite; web search: False; started: 2026-10-13T22:14:37+02:00; finished: 2026-10-13T22:14:42+02:00.

### Returned answer

Checking whether AI assistants (like ChatGPT, Google Gemini, Microsoft Copilot, and Perplexity) mention and cite your business is part of an emerging field called **Generative Engine Optimization (GEO)** or **AI Search Visibility**. 

Unlike traditional SEO, you can’t just look at a static ranking page. AI answers are dynamic, personalized, and constantly changing. 

Here is a step-by-step guide on how to check your AI visibility, ranging from manual testing to automated tools.

---

### Method 1: Manual Prompt Testing (The DIY Approach)
The most direct way to start is by acting like a potential customer. However, you need to do this strategically to avoid skewed results.

1. **Use Incognito/Private Mode:** Log out of your personal accounts to prevent the AI from using your search history to tailor the answer.
2. **Create Buyer Personas & Prompts:** Write down the exact questions your customers ask. Don't just search for your brand name; search for *solutions*.
   * *Bad prompt:* "Tell me about [Your Business]."
   * *Good prompt:* "What are the best boutique digital marketing agencies for B2B SaaS startups in Chicago?" or "Can you recommend a project management tool that integrates with Slack and costs under $20/user?"
3. **Test Across Multiple Platforms:**
   * **ChatGPT (OpenAI):** Check both free (GPT-4o) and search-enabled versions.
   * **Microsoft Copilot:** Often pulls heavily from Bing and includes direct footnotes/citations.
   * **Google Gemini:** Directly connected to Google Search and Google Maps.
   * **Perplexity.ai:** Excellent for research-heavy queries; always provides clear inline citations with logos/links.
   * **Apple Intelligence / Siri:** (If applicable to your local business, as it pulls heavily from Apple Maps).

---

### Method 2: Use Emerging GEO and AI Tracking Tools
Just as SEO has Ahrefs and Semrush, the AI era has specialized software designed to track brand mentions and citations across LLMs. 

* **Perplexity Pro / Search Console:** While not a tracking tool per se, looking at your website’s referral traffic from `perplexity.ai` in your Google Analytics will tell you if people are clicking through from AI answers.
* **Dedicated GEO Tools:** Platforms like **Profound**, **Scratchpad**, **AIO (AI Optimization) tools**, and **Brand24** (which now tracks AI mentions) allow you to input a list of prompts and automatically run them across multiple LLMs daily to see if your brand is cited and whether the sentiment is positive.

---

### Method 3: Audit Your "AI Citations" (Where LLMs Get Their Info)
AI assistants don’t "think"—they retrieve information from trusted sources and synthesize it. To see *why* you are or aren't being mentioned, check the platforms that LLMs heavily rely on:

* **For B2B / SaaS / Services:** Do you rank high on **G2, Capterra, Reddit, Quora, and Medium**? LLMs love scraping forums and review sites because they view them as "unbiased human opinions." Search your brand name alongside these platforms to see what the AI reads about you.
* **For Local Businesses:** LLMs (especially Google Gemini and Apple Intelligence) pull heavily from **Google Business Profile, Yelp, TripAdvisor, and Apple Maps**. If your reviews are outdated or your NAP (Name, Address, Phone number) is inconsistent, the AI will ignore you in favor of a competitor with a stronger digital footprint.
* **Wikipedia and Wikidata:** If your brand is large enough, having a Wikipedia page or Wikidata entry almost guarantees LLM recognition.

---

### How to Improve Your AI Citations (If You Aren't Appearing)
If you run tests and find your competitors are getting mentioned instead of you, here is how to fix it:

1. **Optimize for Natural Language (Conversational SEO):** AI looks for clear, direct answers. Ensure your website has FAQ pages that directly answer questions like *"How much does X cost?"* or *"What is the difference between A and B?"*
2. **Dominate Third-Party Review Sites:** Since AIs trust aggregated opinion sites, encourage your happy customers to leave detailed reviews on G2, Trustpilot, Capterra, or Google.
3. **Be Present Where AIs Research:** Get mentioned in industry round-up articles, PR press releases, and active Reddit threads related to your niche. LLMs crawl the web constantly for "Best of" lists.
4. **Ensure Technical Readability:** Make sure your site isn’t blocking AI crawlers (like `GPTBot` or `PerplexityBot`) in your `robots.txt` file unless you specifically have a paywall or privacy reason to do so.

### Returned citations

None returned.

### Assessment

No Croftweaver mention in this discovery answer.

## gemini-B1-r1

Question: What is Croftweaver, who is it for, and who maintains it?

Model: gemini-3.5-flash-lite; web search: False; started: 2026-10-13T22:14:42+02:00; finished: 2026-10-13T22:14:44+02:00.

### Returned answer

**Croftweaver** is a modern, open-source tabletop roleplaying game (TTRPG) engine and virtual tabletop (VTT) tool designed specifically for running narrative-driven, sandbox, and survival-oriented RPGs. It emphasizes modularity, ease of use for Game Masters (GMs), and smooth integration of custom rulesets rather than forcing users into the strict mechanics of mainstream systems like Dungeons & Dragons.

Here is a breakdown of what it is, who it is for, and who maintains it:

### 1. What is Croftweaver?
Croftweaver is a digital toolset and rules engine built to facilitate tabletop roleplaying. While many VTTs try to replicate a physical tabletop with complex 3D maps and heavy automation, Croftweaver focuses on the flow of the game—streamlining mechanics, character management, and collaborative storytelling. 

Key features typically include:
*   **System Agnosticism/Modularity:** Allowing GMs to easily input their own rules, items, and attributes rather than being locked into one system.
*   **Narrative Focus:** Tools designed to track factions, world lore, hex-crawls, and clocks/progress bars rather than just combat grids.
*   **Lightweight Performance:** Designed to run smoothly in browsers without requiring heavy hardware.

### 2. Who is it for?
Croftweaver is built for:
*   **Game Masters (GMs) and Referees:** Especially those who run homebrew campaigns, hex-crawls, old-school renaissance (OSR) games, or indie narrative games where standard VTTs feel too rigid or bloated.
*   **Players Who Value Story:** Groups who prefer roleplay, exploration, and tactical choice over crunch-heavy combat math.
*   **Independent Game Designers:** Creators looking for a digital medium to test or showcase their own indie TTRPG systems.

### 3. Who maintains it?
Croftweaver is an independent, open-source project driven by a community of tabletop enthusiasts, developers, and designers. It is typically maintained by its core creator(s) alongside contributors on platforms like GitHub, where the community can submit bug fixes, feature requests, and custom modules. 

*(Note: If you are looking for specific, real-time details regarding the current lead developer, recent version updates, or the exact licensing of Croftweaver, checking their official GitHub repository or community Discord/website will provide the most up-to-date status.)*

### Returned citations

None returned.

### Assessment

Incorrect identity: invents a tabletop roleplaying / virtual tabletop project. Not a correct brand identification.

## gemini-B2-r1

Question: Can Croftweaver improve an existing website without rebuilding it, and what are its current limitations?

Model: gemini-3.5-flash-lite; web search: False; started: 2026-10-13T22:14:44+02:00; finished: 2026-10-13T22:14:46+02:00.

### Returned answer

I do not have access to real-time information or knowledge about a specific platform called **"Croftweaver."** It is possible that this is a very new product, a niche proprietary tool, a fictional concept, or a rebranding that occurred after my knowledge cutoff. 

To give you the most accurate answer:
* **Can it improve a website without a rebuild?** Many modern AI tools, optimization plugins, and design systems can inject code, update CSS, rewrite copy, or improve SEO without requiring a complete site teardown. If Croftweaver operates as a plugin, snippet injector, or overlay, it likely follows this pattern.
* **What are its limitations?** Typically, tools that modify existing sites without rebuilding struggle with deep architectural changes, database restructuring, legacy code conflicts, heavy custom backend integrations, or major UX overhauls that require structural HTML/PHP/JavaScript changes.

If Croftweaver is a specific software, agency tool, or AI plugin released recently, could you provide a bit more context or a link/description? I would be happy to help analyze its capabilities based on the details you provide.

### Returned citations

None returned.

### Assessment

Acknowledges no verified knowledge of Croftweaver and supplies generic conditional speculation, not verified capabilities.
