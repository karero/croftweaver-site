// The questions and answers at the bottom of /established-sites, in four groups.
// Source: the reviewed FAQ the owner supplied on 9 October 2026 (two deliberate edits: no dollar
// figure in the cost answer, and the AI check "returns" sources where it cannot say they are citations).
// Answers are HTML written here, so the same text feeds the page and the FAQPage structured data.
// Status as of 9 October 2026: the facts check and the positioning check of live pages are built and in
// review (toolkit pull request 230), not merged. The answers on several audiences, facts and "what can
// Croftweaver do today" say "in review"; change those to the present tense once it merges.

export interface FaqItem { q: string; a: string; ld?: string }
export interface FaqGroup { title: string; items: FaqItem[] }

export const FAQ_GROUPS: FaqGroup[] = [
  {
    title: 'Getting started',
    items: [
      {
        q: 'Where should I start?',
        a: '<p>With the pages Google already shows. Connect Search Console, pull the last 90 days and list the pages with the most impressions. Write three questions your buyers ask and run the first AI check. Then work on the top 10 pages before you plan new ones.</p>',
      },
      {
        q: 'How do we pick the first 10, 25 or 50 pages?',
        a: '<p>Your assistant sorts the Search Console data: pages with many impressions, searches at positions 8 to 20, and pages that are seen often but rarely clicked. Your team adds what the data cannot know: which pages sell, and which are about to change. Start with 10, and widen to 25 and then 50 once the first changes are measured.</p>',
      },
      {
        q: 'Do we need a new site or CMS first?',
        a: '<p>No. The checks and measurements work from the live pages and your Search Console data, on any system. You keep your CMS. The ready-made test suite needs a site built with the Croftweaver starter.</p>',
      },
      {
        q: 'How long until we see results?',
        a: '<p>We do not promise a result or a date. A first pass takes about four weeks on one section: a baseline, a first AI check, fixes on the 20 to 30 pages already seen, and a review. A grading run 3 to 6 weeks after shipping sets the prediction next to what happened. Search moves slowly, so read it over weeks.</p>',
      },
    ],
  },
  {
    title: 'Who does the work',
    items: [
      {
        q: 'Can AI replace my SEO agency?',
        a: '<p>AI will take over much of the repeatable agency work, but not all of it, and Croftweaver does not try to replace the rest. AI does the repeatable work well: audits, structured data, drafts, checks and reports. On a corporate site it can do much of that work with people in charge. People still set the direction, decide which markets are worth pursuing, approve what the brand and legal team can say, build relationships and answer for the result. What changes is what you can check yourself: where the site stands, and what moved.</p>',
      },
      {
        q: 'Which work stays in-house?',
        a: '<p>Run the two measuring loops in-house: Search Console and the weekly AI check. The data is yours, and the numbers should not depend on who is paid to improve them. Keep what only you can know or approve in-house too: product facts, brand voice, legal sign-off, access to your experts, priorities and the technical platform. An agency adds most when it reads the results with you, benchmarks you against competitors, produces content at volume, and handles outreach and public relations. Both sides then work from the same numbers.</p>',
      },
      {
        q: 'How should a company and its agency work together?',
        a: '<p>Share the facts and the checks, and change the site in small steps. The company hands over approved facts and brand rules once. The agency, or your own assistant, proposes each change as a draft your team can review. Guard tests, where the setup allows them, are written before the copy changes and say what done means. The weekly check shows what moved, and your own staging and sign-off decide what goes live.</p>',
      },
      {
        q: 'How do new answers and page updates reach our CMS?',
        a: '<p>Through the CMS’s own interface for programs (its API), with an account that can write drafts but cannot publish. The assistant writes each answer as its own entry, with its question, its answer, its source, its owner and the pages it belongs on. Your team reviews the draft and publishes it as usual. Croftweaver ships no connector for every CMS; connecting one is setup work.</p>',
      },
      {
        q: 'How does an assistant work through a site with hundreds of pages?',
        a: '<p>It reads the content from two places and keeps a copy of both in one repository that a weekly job refreshes. The CMS stays the source of truth: every change goes back into it as a draft, never into the copy. Scripts do the sweeps across all pages; the assistant reads the results, then works page by page, starting with the pages Google already shows.</p><div class="table-wrap"><table><thead><tr><th scope="col">Method</th><th scope="col">What you get</th><th scope="col">Verdict</th></tr></thead><tbody><tr><th scope="row">Your CMS’s API (WordPress, Contentful, Storyblok, Sanity and others)</th><td>What editors wrote, as separate fields: title, body, Q&amp;A entries, language versions, entry IDs, last-changed dates, unpublished drafts</td><td>The main source. It is also the channel the assistant later writes drafts back through.</td></tr><tr><th scope="row">The sitemap and the published pages (what the Croftweaver facts check reads)</th><td>What Google and AI assistants actually see: page templates, meta descriptions, structured data, footers, cookie text</td><td>Always add it. Set next to the CMS, it shows problems that sit in the templates, not in the content. It needs no access, so it also works on a competitor’s site.</td></tr><tr><th scope="row">A full offline copy (SiteSucker, wget, HTTrack)</th><td>Every file, images and scripts included, but no IDs, no dates and no structure</td><td>Only for a one-off look. A frozen copy is the wrong base for a weekly loop, and much of what it stores is noise.</td></tr><tr><th scope="row">A Search Console export</th><td>Which pages matter: impressions, clicks and position for each page</td><td>It joins onto both, and it decides where the work starts.</td></tr></tbody></table></div><p>If a site builds its text in the browser rather than on the server, a plain fetch sees empty pages, and a headless browser such as Playwright is needed. Most sites, including most built with Next.js, send their text from the server, so a plain fetch works.</p>',
        ld: '<p>It reads the content from two places and keeps a copy of both in one repository that a weekly job refreshes. The CMS stays the source of truth: every change goes back into it as a draft, never into the copy. Scripts do the sweeps across all pages; the assistant reads the results, then works page by page, starting with the pages Google already shows.</p>',
      },
    ],
  },
  {
    title: 'Visibility in AI answers',
    items: [
      {
        q: 'What is SEO for AI called, and what does it look like for a large company?',
        a: '<p>It goes by several names: GEO (generative engine optimization), AEO (answer engine optimization) or AI SEO. It builds on SEO, not in place of it. For a large company it is a loop: a baseline of where the site ranks, a check of what assistants say about the company, fixes on the pages already seen, and a new measurement weeks later. It works best when every page and every profile states the same facts.</p>',
      },
      {
        q: 'What hurts our visibility in AI answers?',
        a: '<p>Three things come up most often.</p><p><strong>Answers that are hard to quote.</strong> An assistant quotes short passages that stand on their own: a clear answer at the start of a section, a figure with its source, a table, a question with its answer. Long marketing paragraphs give it little to quote, and figures shown only in images give it nothing. Structured data tells machines what a page is about, such as the company, a service or a product. It supports the visible text and does not replace it.</p><p><strong>Facts that disagree.</strong> If one page says 500 clients and another says 700, an assistant may quote either, or neither. Keep one list of approved facts, each with a source and an owner, and have your assistant compare every page with it. The weekly AI check shows what assistants already say about you, including any wrong figure that has spread.</p><p><strong>A blurred position.</strong> If your pages describe the company in different words, an assistant cannot tell what kind of company you are or whom you serve. Croftweaver works out your <a href="/positioning">positioning</a> before any copy is written, and a check confirms that every page carries it.</p>',
      },
      {
        q: 'How does that work on a corporate site with several audiences?',
        a: '<p>A large company often speaks to several groups at once, for example buyers, job applicants and investors. Each group gets its own positioning: what it would use instead, what you offer it, and why it should believe you. What stays the same for every group is the company itself: one name, one category, one set of facts.</p><p>Every page then belongs to one audience and carries that audience’s term in its title, its description and its main heading. In most CMSs this is one field per page. A check reads the published pages, on staging or on the live site, and lists every page that has lost its term. Your team decides whether the page or the term needs to change.</p><p>The weekly AI check asks the questions each audience would ask, so you can see which audience the assistants already understand.</p><p>Croftweaver ships the positioning method, and the test for sites built with its starter. The check of the published pages on any other system is in review.</p>',
      },
      {
        q: 'How can AI keep our facts consistent?',
        a: '<p>Your team keeps one list of approved facts, each with a source and an owner. The facts check (in review) reads every page and compares each figure with that list, then reports every mismatch with the page and the sentence it is in. It does the same for your profiles on review sites and directories, and reads what AI assistants say about you, to see which wrong figure has already spread. After the cleanup, the check runs again with every change.</p>',
      },
      {
        q: 'How can we tell whether AI assistants name our company?',
        a: '<p>Ask the same buyer questions every week, without naming the company, and count how often each assistant names it. The AI check does this for ChatGPT, Claude, Gemini and Perplexity, and optionally Google’s AI Mode and AI Overview, and, with web search on, lists the sources each one returned. A third question asks what each assistant knows about your company; it is read for accuracy, not counted. The check counts mentions. It does not tell you whether an assistant recommends you.</p>',
      },
    ],
  },
  {
    title: 'Safety, cost and scope',
    items: [
      {
        q: 'Is it safe to let an AI assistant change a corporate site?',
        a: '<p>Treat it like any other contributor. The assistant proposes a change, your team reviews it, and it goes through your own staging, approval and rollback. Have your security team approve the assistant first, and check each provider’s terms before confidential questions leave your network. The scripts make no call to a Croftweaver server, and the Search Console sign-in stays on your own computer.</p>',
      },
      {
        q: 'Does Croftweaver replace our SEO tools or our agency’s reports?',
        a: '<p>No, it sits beside them. It adds checks you can run yourself on the public pages and your own Search Console data, so any report, from anyone, can be set next to numbers you can rerun.</p>',
      },
      {
        q: 'What does it cost?',
        a: '<p>Croftweaver is open source and free to use. You pay for your AI assistant and for the AI services the weekly check asks. Search Console and Bing Webmaster Tools are free.</p>',
      },
      {
        q: 'What can Croftweaver already do today?',
        a: '<p><strong>Ready today, on any live site:</strong></p><ul><li>Search Console and Bing reports: where each search ranks, searches just below page 1, pages that are seen often but rarely clicked, and a weekly history.</li><li>The weekly AI check: two buyer questions and one question about your company, asked of ChatGPT, Claude, Gemini and Perplexity, and optionally Google’s AI Mode and AI Overview.</li><li>Skills your assistant follows for a technical SEO audit, structured data, answers AI can quote, a positioning check and copy.</li><li>Reviews of plans and changes by independent AI reviewers before anything is built or merged.</li></ul><p><strong>Ready for sites built with the Croftweaver starter:</strong></p><ul><li>The full test gate, including the positioning test and the tone test, on every change.</li></ul><p><strong>In review (built, not merged yet), on any live site:</strong></p><ul><li>The facts check: every figure on every page compared with your approved facts list, plus old names and claims that are still in use.</li><li>The positioning check: every page against the term its audience rule says it owns, in the title, the description and the heading.</li></ul><p><strong>A method you apply, written for your site:</strong></p><ul><li>Guard tests on other systems.</li><li>A separate positioning for each audience: the method is run once per audience.</li><li>The connection to your CMS through its API.</li></ul><p><strong>Not built yet:</strong></p><ul><li>A weekly snapshot of every page’s text, so you see what changed on the site.</li><li>More than two buyer questions per site in the AI check.</li><li>A ready-made list of the first 10, 25 or 50 pages: today your assistant builds it from the Search Console report.</li><li>Moving an existing site onto the Croftweaver starter.</li></ul>',
      },
    ],
  },
];

export const FAQ_COUNT = FAQ_GROUPS.reduce((n, g) => n + g.items.length, 0);

// Plain text of an answer: tags out, a space where a block or a cell ends, whitespace collapsed.
export function plain(htmlText: string): string {
  return htmlText
    .replace(/<\/(p|li|tr|th|td|ul|div|table)>/g, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

// FAQPage markup built from the same data, so what the page shows and what machines read cannot drift.
// Google's documentation, read 9 October 2026, says FAQ rich results are shown only for well-known,
// authoritative government and health websites, so this adds no snippet in Google; it describes the
// questions and answers to machines.
export const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_GROUPS.flatMap((g) => g.items).map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: plain(item.ld ?? item.a) },
  })),
};
