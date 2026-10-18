// The questions and answers at the bottom of /from-wordpress. Written 18 October 2026 from the
// toolkit at tag v0.32 (skills/wordpress-inspector, skills/new-website/templates/SETUP.md,
// skills/website-contact-form, skills/keystatic-setup) and the outside pages each answer links,
// read that day. Answers are HTML written here, so the same text feeds the page and the FAQPage
// structured data (tests/seo.spec.ts compares them word for word). plain() is shared with
// /established-sites, so both pages turn answers into markup text the same way.
import { plain, type FaqItem } from './established-faq';

export const WORDPRESS_FAQ: FaqItem[] = [
  {
    q: 'Will I lose my Google rankings?',
    a: '<p>Nobody can promise that you keep them. What a move can do is keep every address that matters working: the same address on the new site, or a permanent redirect (301) to the page that replaced it. The helper lists the old addresses before the move and checks each one afterwards, so an address that leads nowhere is found before your visitors find it. Watch Search Console for a few weeks after the switch.</p>',
  },
  {
    q: 'Does Croftweaver import my posts and pages?',
    a: '<p>No. There is no import today. Your assistant rebuilds the pages from the live site, with you, under the site’s tests. Astro’s own guide for moving from WordPress lists tools that turn a WordPress export into Markdown files, which can save typing on a site with many posts: <a href="https://docs.astro.build/en/guides/migrate-to-astro/from-wordpress/">Migrating from WordPress</a>.</p>',
  },
  {
    q: 'What happens to my contact form, comments and site search?',
    a: '<p>The contact form becomes one that opens the visitor’s own mail program. Croftweaver builds no form that sends through a server, no comments and no site search. The helper names the form plugins it finds on the old site, so you know what needs a new home before you start.</p>',
  },
  {
    q: 'Who edits the site after the move?',
    a: '<p>You and your AI assistant: you say what should change, the assistant edits the files, and the tests run before the change goes out. There is no editor in the browser for a colleague who does not use an assistant. An editor screen on your own computer can be added with the <code>keystatic-setup</code> skill.</p>',
  },
  {
    q: 'What does it cost?',
    a: '<p>Croftweaver is free and open source. Cloudflare’s free plan covers a small site; a busy site can need Workers Paid at $5 a month (Cloudflare’s price, as the setup guide states it). You also pay for your domain and for your AI coding assistant’s plan, which is the main running cost.</p>',
  },
  {
    q: 'Can I keep WordPress as the editor and use Astro only for the pages?',
    a: '<p>Yes, that is possible: Astro can read content from WordPress, which then runs behind the scenes. Croftweaver does not set this up, and WordPress then still needs its updates.</p>',
  },
  {
    q: 'Should I look at EmDash instead?',
    a: '<p>If you want a content system with an admin screen and an importer for WordPress, yes. EmDash is Cloudflare’s open-source content system built on Astro. Its README, read on 18 October 2026, describes a full admin panel and imports posts, pages, media and taxonomies from WordPress: <a href="https://github.com/emdash-cms/emdash">EmDash on GitHub</a>. Croftweaver suits you if you would rather keep the site as plain files, change it with your assistant and have tests run on every change.</p>',
  },
];

// Google's documentation, read 9 October 2026, shows FAQ rich results only for well-known government
// and health websites, so this describes the questions to machines and adds no snippet in Google.
export const wordpressFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: WORDPRESS_FAQ.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: plain(item.a) },
  })),
};
