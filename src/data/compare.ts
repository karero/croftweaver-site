// /compare: alternatives to Webcroft, in four groups. The rule (CONTENT_GUIDE.md):
// comparisons are factual, sourced and dated. Every `fact` below restates what the
// linked page says about its own product, in this site's words, as of CHECKED. Nothing
// here says what another product lacks. Re-check every link before changing the date.
export const CHECKED = { iso: '2026-10-04', label: '4 October 2026' } as const;

export const GROUPS = [
  {
    id: 'hosted',
    title: 'Hosted website builders',
    what: 'You design in a visual editor in the browser, and the company hosts the site.',
    examples: [
      { name: 'Wix', url: 'https://www.wix.com/plans', fact: 'A website builder with templates and a drag-and-drop editor. Paid plans and a free plan.' },
      { name: 'Squarespace', url: 'https://www.squarespace.com/pricing', fact: 'A website builder with templates and shop features. Paid plans and a free trial, no free plan.' },
      { name: 'Webflow', url: 'https://webflow.com/pricing', fact: 'A visual website builder. Paid site plans and a free starter plan.' },
      { name: 'Framer', url: 'https://www.framer.com/pricing', fact: 'A website builder and design tool. Paid plans and a free plan.' },
    ],
    chooseThem: 'You want to design by pointing and dragging, you want hosting taken care of, and a monthly or yearly fee is fine.',
    chooseWebcroft: 'You want the site as files in your own repository, and you are happy to work with an AI assistant in plain language instead of a visual editor.',
  },
  {
    id: 'apps',
    title: 'AI app builders',
    what: 'You describe what you want in a chat, and the service builds and runs it.',
    examples: [
      { name: 'Lovable', url: 'https://lovable.dev/pricing', fact: 'Builds websites and web apps from a chat. Free and paid plans.' },
      { name: 'Bolt', url: 'https://bolt.new/pricing', fact: 'Builds websites and apps from a description. Free and paid plans.' },
      { name: 'v0', url: 'https://v0.app/pricing', fact: 'Builds apps and code from a description. Free and paid plans.' },
    ],
    chooseThem: 'You need an application: accounts, stored data, a checkout.',
    chooseWebcroft: 'You need a content site that is fast, readable for search engines and AI assistants, and cheap to host.',
  },
  {
    id: 'visual',
    title: 'Open-source visual builders',
    what: 'A visual editor whose code is open and which you can host yourself.',
    examples: [
      { name: 'Webstudio', url: 'https://github.com/webstudio-is/webstudio', fact: 'An open-source visual builder that can be hosted anywhere. AGPL-3.0 licence.' },
      { name: 'Instatic', url: 'https://github.com/CoreBunch/Instatic', fact: 'An open-source, self-hosted visual CMS that outputs static pages. MIT licence.' },
    ],
    chooseThem: 'You want a visual editor and open-source code.',
    chooseWebcroft: 'You want tests on every change, and no editor to run or maintain.',
  },
  {
    id: 'skills',
    title: 'Skills for AI coding assistants',
    what: 'Instructions that an assistant such as Claude Code follows. This is the group Webcroft belongs to.',
    examples: [
      { name: 'website-build-kit', url: 'https://github.com/nurkamol/website-build-kit', fact: 'A method and an Astro starter on Cloudflare Workers for marketing sites, with a playbook for moving a WordPress site to Astro. MIT licence.' },
      { name: 'claude-seo', url: 'https://github.com/AgriciDaniel/claude-seo', fact: 'An SEO skill for Claude Code that covers technical SEO, structured data and AI search. MIT licence.' },
      { name: 'geo-seo-claude', url: 'https://github.com/zubair-trabzada/geo-seo-claude', fact: 'An SEO skill for Claude Code that puts AI search first. MIT licence.' },
      { name: 'marketingskills', url: 'https://github.com/coreyhaines31/marketingskills', fact: 'Marketing skills for Claude Code and other agents. MIT licence. Seven of the skills in Webcroft are derived from it, with credit.' },
      { name: 'Wondel.ai skills', url: 'https://github.com/wondelai/skills', fact: 'Fifty skills built on business, marketing, UX and coding books, with guided journeys, one of them for creating a website. MIT licence.' },
    ],
    chooseThem: 'You already have a site and want it analysed (the two SEO skills), you are moving off WordPress (website-build-kit), or you want marketing help beyond a website (marketingskills, the Wondel.ai skills).',
    chooseWebcroft: 'You want one suite that builds the site, does the search and AI work by default, tests every change, and keeps improving the site from search data.',
  },
] as const;
