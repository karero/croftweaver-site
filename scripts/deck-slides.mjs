// The /why case as a slide deck (16:9, 1280 x 720 px). Pure functions: no browser, no
// file access. scripts/build-deck.mjs renders the result to public/croftweaver-why.pdf,
// and tests/tone.spec.ts reads the same text.
//
// Figures never live here. The evidence slide and the test-suite count are read from the
// BUILT /why page (dist/why.html), which gets them from src/data, and the suite names from
// the built /checks page, so the deck and the pages cannot disagree. The rest is copy
// written for slides: short headlines that follow the arguments of /why. Voice rules: CONTENT_GUIDE.md (no em dash, no contraction, no
// buzzword); the wording rule: POSITIONING.md.
import { parse } from 'node-html-parser';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const squash = (s) => s.replace(/\s+/g, ' ').trim();

// A node's content as text, keeping links (with an absolute address) and dropping every
// other tag and attribute, so that a changed style hash on the page does not change the deck.
function inline(node, base) {
  return node.childNodes
    .map((n) => {
      if (n.nodeType === 3) return esc(n.text);
      if (n.tagName === 'A') {
        const href = n.getAttribute('href') ?? '';
        return `<a href="${esc(href.startsWith('/') ? base + href : href)}">${inline(n, base)}</a>`;
      }
      return inline(n, base);
    })
    .join('');
}

// What the deck takes from the built /why page. Fails loudly when the page changes shape.
export function readWhyFacts(whyHtml, base) {
  const root = parse(whyHtml);
  const need = (parent, selector, what) => {
    const el = parent.querySelector(selector);
    if (!el) throw new Error(`deck: the /why page has no ${what} (${selector}). Update scripts/deck-slides.mjs.`);
    return el;
  };
  const evidence = need(root, '#evidence', 'evidence section');
  const intro = squash(inline(need(evidence, 'p', 'evidence introduction'), base));
  const items = evidence.querySelectorAll('ul li').map((li) => {
    const label = squash(need(li, 'strong', 'evidence label').text);
    const all = squash(inline(li, base));
    // `all` is escaped HTML and `label` is decoded text: compare like with like.
    const head = esc(label);
    if (!all.startsWith(head)) throw new Error(`deck: an evidence item does not start with its label "${label}".`);
    return { label, body: all.slice(head.length).trim() };
  });
  if (items.length !== 3) throw new Error(`deck: the /why evidence list has ${items.length} items, expected 3. Update scripts/deck-slides.mjs.`);
  const caveat = squash(inline(need(evidence, '.aside', 'evidence caveat'), base));
  const checkCard = root.querySelectorAll('#steps li.card').find((li) => /Check/.test(li.querySelector('h3')?.text ?? ''));
  if (!checkCard) throw new Error('deck: the /why page has no "Check" step in #steps.');
  const checkText = squash(need(checkCard, 'p', 'text of the Check step').text);
  if (!/^\d+ test suites: /.test(checkText)) throw new Error(`deck: the Check step no longer starts with the suite count: "${checkText}".`);
  return { intro, items, caveat, checkText };
}

// The suites in groups, from the built /checks page: [{ title, suites: ['Accessibility', ...] }].
export function readChecksFacts(checksHtml) {
  const root = parse(checksHtml);
  const groups = root.querySelectorAll('section').flatMap((section) => {
    const names = section.querySelectorAll('.suites article h3').map((h3) => {
      const clone = parse(h3.outerHTML).querySelector('h3');
      clone.querySelectorAll('code').forEach((c) => c.remove());
      return squash(clone.text);
    });
    const title = squash(section.querySelector('h2')?.text ?? '');
    return names.length ? [{ title, suites: names }] : [];
  });
  if (groups.length === 0) throw new Error('deck: the /checks page lists no suites (.suites article h3). Update scripts/deck-slides.mjs.');
  return groups;
}

const CSS = `
@page { size: 1280px 720px; margin: 0; }
:root { --brand: #2e6e4e; --heading: #1a1f1b; --muted: #586157; --line: #dfe3d9; --bg: #fbfaf6; --soft: #f1f0e9; --surface: #ffffff; --mint: #dcebe2;
  --font: system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; background: #ffffff; }
body { font-family: var(--font); color: var(--heading); -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.slide { width: 1280px; height: 720px; position: relative; overflow: hidden; background: var(--bg); padding: 70px 80px 90px; break-after: page; display: flex; flex-direction: column; }
.content { flex: 1; display: flex; flex-direction: column; justify-content: center; padding-bottom: 10px; }
.slide:last-child { break-after: auto; }
.slide::before { content: ""; position: absolute; left: 80px; top: 0; width: 96px; height: 10px; background: var(--brand); }
.moss { background: var(--brand); color: #ffffff; }
.moss::before { display: none; }
.kicker { margin: 0 0 14px; font-size: 18px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--brand); }
.moss .kicker { color: var(--mint); }
h1 { margin: 0; font-size: 68px; line-height: 1.08; max-width: 980px; }
h2 { margin: 0 0 24px; font-size: 40px; line-height: 1.16; max-width: 1120px; text-wrap: balance; }
h3 { margin: 0 0 8px; font-size: 22px; line-height: 1.25; }
p, li { font-size: 22px; line-height: 1.5; }
p { margin: 0 0 14px; }
.lead { font-size: 28px; line-height: 1.4; max-width: 900px; color: var(--mint); margin-top: 30px; }
.cover .logo { width: 300px; margin-bottom: 120px; }
.cover .web { position: absolute; left: 80px; bottom: 60px; margin: 0; font-size: 22px; color: var(--mint); }
.dense p, .dense li { font-size: 20px; line-height: 1.45; }
.dense .note { font-size: 19px; margin-top: 18px; }
.list { margin: 0; padding-left: 26px; max-width: 1080px; }
.list li { margin-bottom: 12px; }
.list li::marker { color: var(--brand); }
.moss .list li::marker { color: #ffffff; }
.intro { color: var(--muted); max-width: 1080px; }
.note { margin: 26px 0 0; padding-left: 18px; border-left: 4px solid var(--brand); color: var(--muted); font-size: 20px; max-width: 1080px; }
.cards { display: grid; gap: 22px; margin: 0; padding: 0; list-style: none; }
.cards.three { grid-template-columns: repeat(3, 1fr); }
.cards.four { grid-template-columns: repeat(4, 1fr); }
.cards.two { grid-template-columns: repeat(2, 1fr); }
.card { background: var(--surface); border: 1px solid var(--line); border-radius: 14px; padding: 28px 28px 30px; }
.card p { margin: 0; font-size: 21px; line-height: 1.5; color: var(--muted); }
.four .card p { font-size: 19px; }
.card h3 { color: var(--heading); font-size: 24px; margin-bottom: 12px; }
.four .card h3 { font-size: 22px; }
.groups .card { padding: 16px 24px; }
.groups h3 { font-size: 20px; }
.groups .list { padding-left: 20px; }
.groups .list li { line-height: 1.25; }
.card.good { border-color: var(--brand); border-width: 2px; }
.card .list { padding-left: 22px; }
.card .list li { font-size: 20px; margin-bottom: 8px; }
.stat { display: flex; align-items: baseline; gap: 20px; margin: 0 0 26px; }
.stat strong { font-size: 84px; line-height: 1; color: var(--brand); }
.stat span { font-size: 28px; line-height: 1.3; max-width: 900px; }
a { color: inherit; text-decoration: underline; text-underline-offset: 3px; }
.foot { position: absolute; left: 80px; right: 80px; bottom: 34px; display: flex; justify-content: space-between; align-items: center; color: var(--muted); font-size: 16px; }
.foot .mark { width: 150px; color: var(--muted); }
.moss .foot { color: var(--mint); }
.moss .foot .mark { color: var(--mint); }
svg { display: block; width: 100%; height: auto; }
`;

// The slides. `f` holds the facts read from the /why page; `s` is SITE from src/config.ts.
function slideList(f, s, logo) {
  const host = s.url.replace(/^https?:\/\//, '');
  const link = (path) => `<a href="${s.url}${path}">${host}${path}</a>`;
  const card = (h, p) => `<li class="card"><h3>${h}</h3><p>${p}</p></li>`;
  return [
    // 1. Title
    { cls: 'moss cover', body: `
      <div class="logo">${logo}</div>
      <h1>Why build a website for search and AI visibility</h1>
      <p class="lead">The case for the person who decides.</p>
      <p class="web">${host}/why</p>` },
    // 2. The evidence, copied from the page
    { cls: 'dense', kicker: 'The evidence', title: 'Build high-ranking websites. The proof so far comes from one site.', body: `
      <p class="intro">${f.intro}</p>
      <ul class="list">${f.items.map((i) => `<li><strong>${esc(i.label)}</strong> ${i.body}</li>`).join('')}</ul>
      <p class="note">${f.caveat}</p>` },
    // 3. The recommendation
    { kicker: 'The recommendation', title: 'Choose a tool built for being found, not one that merely permits it.', body: `
      <ol class="cards three" role="list">
        ${card('1. Built in from the first build', 'Search basics, trust signals and readability for AI assistants are part of every page. Tests check what a machine can check.')}
        ${card('2. Improved after launch', 'Real search data replaces guesswork about keywords. When there is enough of it, it helps pick two or three edits a week to look into.')}
        ${card('3. Owned, with no platform fee', 'A static site in your repository, on your domain. Croftweaver is MIT-licensed and charges nothing.')}
      </ol>` },
    // 4. What the tool is for
    { kicker: 'What the tool is for', title: 'A tool can hand you every control and still leave the work to you.', body: `
      <div class="cards two">
        <div class="card"><h3>A tool that permits</h3><ul class="list"><li>You decide what to do.</li><li>You do it on every page.</li><li>You keep it done, and a check that depends on memory can be forgotten.</li></ul></div>
        <div class="card good"><h3>A tool built for being found</h3><ul class="list"><li>It does that work by default.</li><li>It tests what can be tested.</li><li>The result is meant to hold on the hundredth page, two years later.</li></ul></div>
      </div>
      <p class="note">None of this is a case against design. Being found helps people arrive; design helps them stay. If you use a website builder and like it, keep it, and ask what the site earns you in search.</p>` },
    // 5. Reason 1
    { kicker: 'Reason 1: built in', title: 'Search basics, trust signals and AI readability come with every page.', body: `
      <ul class="cards four" role="list">
        ${card('Search basics', 'Titles and descriptions within set limits, structured data that says what each page is, a sitemap, internal links that resolve.')}
        ${card('Trust signals', 'The structure that carries your experience, expertise, authority and trust: named authors, profile links, legal pages, sources. It cannot earn the reputation for you.')}
        ${card('AI answers', 'Pages are structured so that an AI assistant can read and quote them, and every site ships a file that maps it for assistants.')}
        ${card('Shared links', 'Every content page gets its own share card, and a content page without one fails a test.')}
      </ul>` },
    // 6. The test gate
    { kicker: 'The test gate', title: 'Tests check each change before it goes out.', body: `
      <p class="stat"><strong>${esc(f.checkText.match(/^\d+/)[0])}</strong><span>${esc(f.checkText.replace(/^\d+ /, ''))}</span></p>
      <ul class="cards four groups" role="list">
        ${f.groups.map((g) => `<li class="card"><h3>${esc(g.title)}</h3><ul class="list">${g.suites.map((n) => `<li>${esc(n)}</li>`).join('')}</ul></li>`).join('')}
      </ul>
      <p class="note">A pass means the listed checks passed, nothing more. It does not prove that the positioning is good or that a page will rank. ${link('/checks')} lists every suite, an example of a failure and what a pass does not prove.</p>` },
    // 7. Reason 2
    { kicker: 'Reason 2: improved after launch', title: 'Real search data replaces guesswork about keywords.', body: `
      <p class="intro">Google Search Console collects data only from the day a site is verified, so that is done at launch. From then on the skills read the data and point at edits:</p>
      <ul class="list">
        <li><strong>Searches with an average position around 8 to 20.</strong> Candidates to look at first.</li>
        <li><strong>Pages seen but rarely clicked.</strong> The skill checks the real results page before it suggests a new title or description.</li>
        <li><strong>Whether AI assistants name you.</strong> An optional weekly check, run with your own API keys.</li>
      </ul>
      <p class="note">Runs of the tracker are recorded, so you can see what moved. Every edit goes back through the same tests.</p>` },
    // 8. Reason 3
    { kicker: 'Reason 3: owned', title: 'You own plain files, and Croftweaver charges no fee.', body: `
      <ul class="cards four" role="list">
        ${card('Plain files', 'The site is built once and served as static pages. There is no database to wait for or to keep alive.')}
        ${card('No content system to run', 'Content is text files in your repository. The default setup has no login and no plugins.')}
        ${card('Room for a second language', 'It can be added later without moving the addresses you already have.')}
        ${card('No fee to Croftweaver', 'The licence is MIT. Your domain, your hosting and your AI assistant can still cost money.')}
      </ul>` },
    // 9. How it goes
    { kicker: 'How it goes', title: 'Four steps, and you decide at each.', body: `
      <ol class="cards four" role="list">
        ${card('1. Brief', 'A few questions about your audience, your offer and your tone.')}
        ${card('2. Build', 'Positioning first, then content, pages and metadata.')}
        ${card('3. Check', esc(f.checkText))}
        ${card('4. Launch', 'Live on your own domain, as static pages.')}
      </ol>
      <p class="note">How long it takes depends on how much content you have and how fast the decisions are made. There is no honest number to print here.</p>` },
    // 10. Where it fits
    { kicker: 'Where it fits', title: 'Made for content sites, with its limits stated.', body: `
      <div class="cards two">
        <div class="card good"><h3>A good fit</h3><ul class="list"><li>Event and community sites</li><li>Landing pages for a startup</li><li>Expert and personal profiles</li><li>Resource hubs</li><li>The site of a small studio or agency</li></ul></div>
        <div class="card"><h3>Look elsewhere</h3><ul class="list"><li>A shop</li><li>A booking platform</li><li>A web application</li><li>A managed builder, if you want no code at all</li></ul></div>
      </div>
      <p class="note">${link('/compare')} sets Croftweaver beside its alternatives. If you already run a large site, ${link('/established-sites')} lists the parts that work on established sites.</p>` },
    // 11. Start
    { cls: 'moss', kicker: 'Start this week', title: 'Build one site, then decide whether to continue.', body: `
      <ol class="list">
        <li>Install an AI coding assistant and build one site from the starter prompt at ${link('/start')}.</li>
        <li>Verify the site in Search Console on the first day. It collects no history before that.</li>
        <li>Read the first weekly report together, then decide whether to continue.</li>
      </ol>
      <p class="note" style="border-color:var(--mint);color:var(--mint)">Open source under the MIT licence: <a href="${s.repo}">${s.repo.replace(/^https?:\/\//, '')}</a>. The evidence in full: ${link('/proof')}.</p>` },
  ];
}

// Builds the deck. Returns the page to print, its plain text and the slide count.
export function makeDeck({ whyHtml, checksHtml, site, logoSvg }) {
  const facts = { ...readWhyFacts(whyHtml, site.url), groups: readChecksFacts(checksHtml) };
  // /why says how many suites there are, /checks lists them: the two must agree.
  const listed = facts.groups.reduce((n, g) => n + g.suites.length, 0);
  const claimed = Number(facts.checkText.match(/^\d+/)[0]);
  if (listed !== claimed) throw new Error(`deck: /why says ${claimed} test suites and /checks lists ${listed}.`);
  const logo = logoSvg.trim();
  const slides = slideList(facts, site, logo);
  const total = slides.length;
  const sections = slides.map((sl, i) => {
    const head = i === 0 ? '' : `${sl.kicker ? `<p class="kicker">${sl.kicker}</p>` : ''}<h2>${sl.title}</h2>`;
    const foot = i === 0 ? '' : `<div class="foot"><span class="mark">${logo}</span><span>${i + 1} / ${total}</span></div>`;
    const body = i === 0 ? sl.body : `<div class="content">${sl.body}</div>`;
    return `<section class="slide${sl.cls ? ' ' + sl.cls : ''}">${head}${body}${foot}</section>`;
  });
  const title = 'Why build a website for search and AI visibility | Croftweaver';
  const html = `<!doctype html><html lang="${site.locale}"><head><meta charset="utf-8"><title>${esc(title)}</title><style>${CSS}</style></head><body><main>${sections.join('\n')}</main></body></html>`;
  const text = parse(html).querySelector('main').structuredText;
  return { html, text, title, slideCount: total };
}
