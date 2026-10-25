// /compare: alternatives to Croftweaver, in five groups. The rule (CONTENT_GUIDE.md):
// comparisons are factual, sourced and dated. Every `fact` below restates what the
// linked page says about its own product, in this site's words, as of CHECKED, or as of
// the group's own `checked` where it has one. Nothing here says what another product
// lacks. Re-check every link a date covers before changing that date.
export const CHECKED = { iso: '2026-10-14', label: '14 October 2026' } as const;

// The section "Croftweaver starts with your positioning and keeps your pages on it" on
// /compare (until 2026-10-14 "Croftweaver begins with the end in mind") says what Croftweaver
// does first: positioning. Starting with the message is not Croftweaver's alone, so the
// section names the projects from the skills group whose own README says they do the same
// kind of thing, in that README's terms. Read on FIRST_CHECKED; the links in GROUPS keep
// their own date.
export const FIRST_CHECKED = { iso: '2026-10-13', label: '13 October 2026' } as const;
export const MESSAGE_FIRST = [
  { name: 'marketingskills', url: 'https://github.com/coreyhaines31/marketingskills', fact: 'has a product-marketing skill for your product, audience and positioning, which its other skills read first' },
  { name: 'The Wondel.ai skills', url: 'https://github.com/wondelai/skills', fact: "include a positioning skill built on April Dunford's book Obviously Awesome, as Croftweaver's is, and a website journey that puts the message before the design" },
  { name: 'website-build-kit', url: 'https://github.com/nurkamol/website-build-kit', fact: 'opens its method with discovery' },
] as const;

// The short answer at the top of /compare, one line per choice, so it can be quoted on its
// own. The Croftweaver and AI-app-builder lines sum up the sections below. The WordPress and
// Webflow lines restate their own linked pages, read on SHORT_CHECKED; each is one of several
// in its group below. A line says when to choose, never which is best.
export const SHORT_CHECKED = { iso: '2026-10-18', label: '18 October 2026' } as const;
export const SHORT = [
  { choose: 'Croftweaver', when: 'you want a content site as files in your own repository, built and changed with your AI coding assistant, with the site\'s tests running before each push and on each pull request, on hosting you control.' },
  { choose: 'WordPress', url: 'https://wordpress.org/', when: 'you want to start from a theme, edit in the block editor and see the page as you change it, add features such as a store from its library of plugins, and find hosting for it yourself.' },
  { choose: 'Webflow', url: 'https://webflow.com/pricing', when: 'you want to build your site visually, with Webflow hosting it, and a paid site plan is fine: one is needed to publish on your own domain.' },
  { choose: 'an AI app builder', href: '#apps', when: 'you need an application, with accounts, stored data or a checkout, built and run by the service from a chat.' },
] as const;

export const GROUPS = [
  {
    // Added 2026-10-25 (owner's request): WordPress, Joomla and Drupal are free and open source
    // too, so the difference is said about Croftweaver only. Sources and quotes: docs/competitors.md.
    id: 'cms',
    title: 'WordPress, Joomla and Drupal',
    what: 'Open-source content management systems that you install on your own server or with a host. For a content site, Croftweaver is an alternative to WordPress, Joomla or Drupal. Croftweaver has no visual editor, shop or member accounts.',
    examples: [
      { name: 'WordPress', url: 'https://wordpress.org/about/', fact: 'Open-source software for websites, built on PHP. GPL licence.' },
      { name: 'Joomla', url: 'https://www.joomla.org/about-joomla.html', fact: 'A free, open-source content management system with thousands of extensions. GPL licence.' },
      { name: 'Drupal', url: 'https://www.drupal.org/about', fact: 'Open-source content management software, extended with thousands of add-ons. GPL licence.' },
    ],
    needs: {
      text: 'Each runs on a web server with PHP and a database, and you edit the pages on the site itself.',
      sources: [
        { label: 'WordPress requirements', url: 'https://wordpress.org/about/requirements/' },
        { label: 'Joomla requirements', url: 'https://manual.joomla.org/docs/get-started/technical-requirements/' },
        { label: 'Drupal requirements', url: 'https://www.drupal.org/docs/getting-started/system-requirements' },
        { label: 'WordPress editing', url: 'https://wordpress.org/' },
        { label: 'Joomla editing', url: 'https://www.joomla.org/core-features.html' },
        { label: 'Drupal editing', url: 'https://www.drupal.org/docs/user_guide/en/content-create.html' },
      ],
    },
    checked: { iso: '2026-10-25', label: '25 October 2026' },
    chooseThem: 'You want to edit pages on the site itself, or you need a feature one of their plugins, extensions or modules adds, and keeping a PHP server and its database updated, yourself or through a host, is fine.',
    chooseCroftweaver: 'You run a content site and want no PHP, database or admin login on a server to keep updated: built pages served by your host, as files in your own repository that your AI assistant changes, with the site\'s tests running before each push and on each pull request. Its npm packages still need security updates.',
    more: { href: '/from-wordpress', label: 'From WordPress to Astro' },
  },
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
    chooseCroftweaver: 'You want the site as files in your own repository, and you are happy to work with an AI assistant in plain language instead of a visual editor.',
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
    chooseCroftweaver: 'You need a content site that is fast, readable for search engines and AI assistants, and cheap to host.',
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
    chooseCroftweaver: 'You prefer to edit files with an assistant, with the tests of your site running before each push and on each pull request. The default setup needs no editor.',
  },
  {
    id: 'skills',
    title: 'Skills for AI coding assistants',
    what: 'Instructions that an assistant such as Claude Code follows. This is the group Croftweaver belongs to.',
    examples: [
      { name: 'website-build-kit', url: 'https://github.com/nurkamol/website-build-kit', fact: 'A method and an Astro starter on Cloudflare Workers for marketing sites, with a playbook for moving a WordPress site to Astro. MIT licence.' },
      { name: 'claude-seo', url: 'https://github.com/AgriciDaniel/claude-seo', fact: 'An SEO skill for Claude Code that covers technical SEO, structured data and AI search. MIT licence.' },
      { name: 'geo-seo-claude', url: 'https://github.com/zubair-trabzada/geo-seo-claude', fact: 'An SEO skill for Claude Code that puts AI search first. MIT licence.' },
      { name: 'marketingskills', url: 'https://github.com/coreyhaines31/marketingskills', fact: 'Marketing skills for Claude Code and other agents. MIT licence. Seven of the skills in Croftweaver are derived from it, with credit.' },
      { name: 'Wondel.ai skills', url: 'https://github.com/wondelai/skills', fact: 'Fifty-one skills built on business, marketing, UX and coding books and style guides, with fourteen guided journeys, one of them for creating a website. MIT licence.' },
    ],
    chooseThem: 'You want one focused SEO or AI-search audit (the two SEO skills), you are moving off WordPress (website-build-kit), or you want marketing help beyond a website (marketingskills, the Wondel.ai skills).',
    // Added 2026-10-20: Croftweaver now has its own WordPress page, so the WordPress clause
    // above points there too. website-build-kit's playbook is still a sourced fact.
    themMore: { lead: 'Croftweaver\'s own route off WordPress:', href: '/from-wordpress', label: 'From WordPress to Astro' },
    chooseCroftweaver: 'You want one suite that builds the site, does the search and AI work by default, runs its tests before each push and on each pull request, and includes tools that read your Search Console data and point to the next edits. Its checks and measurements also work on a site that is already live, on any stack, without a rebuild; the ready-made test suite needs the Croftweaver starter.',
    more: { href: '/established-sites', label: 'Croftweaver for established sites' },
    // Owner decision, 2026-10-14: present Croftweaver as the layer that builds and tests
    // the website, next to marketingskills, not as its rival. The clause about
    // marketingskills restates its README, read on that date.
    together: {
      name: 'marketingskills on GitHub',
      url: 'https://github.com/coreyhaines31/marketingskills',
      text: 'marketingskills covers marketing beyond the website, such as conversion, email, ads and launches. Croftweaver builds the website itself and tests it on every change. Seven Croftweaver skills come from marketingskills, with credit.',
    },
  },
] as const;
