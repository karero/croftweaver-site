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
