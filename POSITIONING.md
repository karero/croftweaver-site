<!--
  POSITIONING.md — per-site positioning, worked out FIRST (before SEO, before any
  page copy). Single source of truth for WHAT we offer, FOR WHOM, and the MARKET
  CATEGORY. Built on April Dunford's framework. Enforced by tests/positioning.spec.ts.
-->
# Webcroft — positioning

## 1. Competitive alternatives

- Hosted no-code builders (Wix, Squarespace, Framer AI): rented platform, monthly fee, lock-in.
- AI app builders (Lovable, Bolt, Claudable): great for interactive apps, heavier than a content site needs.
- A web agency: quality, but slow and expensive for a small site.
- Hand-building an Astro site with an AI assistant and no guardrails: fast start, silent quality gaps (a11y, SEO, links, tone).

## 2. Unique attributes

- A suite of skills for AI coding assistants (Claude Code, Codex, Antigravity), not a hosted product.
- Every generated site ships with its own test gate: accessibility, SEO consistency, internal links, tone, AI readability (llms.txt).
- Output is a static-first Astro repo the user fully owns: code, domain, content.
- The skills travel inside the generated repo, so the site is handoff-ready.

## 3. Value + proof

| Unique attribute | Value it enables | Proof |
|---|---|---|
| Skill suite, not SaaS | No platform rent, no lock-in; works in the assistant you already use | Public repo; runs in three assistants |
| Built-in test gate | Quality is verified, not claimed | genai-wednesday.de scores: Lighthouse 98/100/100/100 (linked, re-runnable) |
| Static-first Astro output | Fast, secure, cheap to host | Cloudflare Pages free tier; no server to patch |
| Skills travel with the repo | A third party can take over the site | Self-contained handoff set in every scaffold |

## 4. Target customer

- **Best-fit customer:** founders, community organizers and small teams who want a credible website they fully own, plus the developers and AI tinkerers who build for them.
- **Why they care most:** platform rent and lock-in feel wrong for something as simple as a content site; agency overhead is out of budget.
- **Where they are:** global, English-speaking, GitHub-native; discovery via the repo, word of mouth and the GenAI Wednesday Builder Lab.

## 5. Market category

- **Market category:** website skills for AI coding assistants

## Positioning statement (one paragraph)

> For founders, communities and small teams who want a credible website they fully
> own, Webcroft is a suite of open-source website skills for AI coding assistants
> that ships fast, accessible, SEO-ready Astro sites with quality gates built in,
> unlike hosted builders and AI app platforms, because the output is a static-first
> repo with its own test suite and no platform in the loop.

- **Core positioning term:** website skills
- **One-line boilerplate (≤ 12 words):** Your own plot of the web.
- **~50-word boilerplate:** Webcroft is a suite of open-source website skills for AI coding assistants. It turns Claude Code, Codex or Antigravity into a careful website builder: fast, accessible, SEO-ready Astro sites with quality gates built in, in a repo you fully own. A croft is a small farm its occupier works and owns.

## The positioning spine (per-page terms → tests/positioning.spec.ts)

| Page | URL | Positioning term | Market category (home only) |
|---|---|---|---|
| Home | `/` | website skills | website skills for AI coding assistants |
| Privacy | `/privacy` | exempt (legal) | — |
| Imprint | `/imprint` | exempt (legal) | — |

## Differentiation contract (vs genai-wednesday.de/builder-lab)

The Builder Lab page is the community showcase: proof scorecards, AI score table,
FAQPage schema. webcroft.dev is the project home: origin story, quickstart, skills
catalogue, SoftwareSourceCode schema. No copy is shared between the two pages; each
links to the other (Lab → project home, home → Lab for proof).

## Hand-off to the rest of the pipeline

- **Voice + EEAT + page copy:** `website-content-guide` (owns tone, not positioning).
- **Keyword / SERP research:** `seo-audit` — positioning leads, keywords follow.
- **AI / answer-engine phrasing (GEO):** `ai-seo`.
- **Schema description + head metadata:** `website-seo-geo` (50-word boilerplate verbatim).
