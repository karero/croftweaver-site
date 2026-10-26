// The deck for companies (16:9, 1280 x 720 px): a handout for an M-Squad pitch to a company that
// will not build its site itself. Pure functions, like scripts/deck-slides.mjs, whose frame and
// style it uses; scripts/build-deck.mjs renders it to handouts/croftweaver-for-companies.pdf.
//
// Figures and the sentences that carry a claim are read from the BUILT /why, /from-wordpress and
// /security pages, so the deck and the pages cannot disagree. Headlines and the few typed lines
// follow those pages and /about. Voice rules: CONTENT_GUIDE.md; the wording rule: POSITIONING.md.
import { parse } from 'node-html-parser';
import { esc, squash, inline, needIn, readWhyEvidence, renderDeck } from './deck-slides.mjs';

// The one element under `parent` matching `selector` whose text starts with `start`, or a stop.
function startingWith(parent, selector, start, page, what) {
  const found = parent.querySelectorAll(selector).filter((el) => squash(el.text).startsWith(start));
  if (found.length !== 1) throw new Error(`deck: the ${page} page has ${found.length} ${what} starting "${start}", expected 1. Update scripts/company-deck-slides.mjs.`);
  return found[0];
}

// The first `n` sentences of a text (a sentence ends with ". ").
const sentences = (html, n) => html.split(/(?<=\.) /).slice(0, n).join(' ');

// The figures in the /why evidence, as numbers for the graphics on slide 2. Each pattern is the
// sentence /why prints; a reworded sentence stops the build rather than draw a wrong chart.
export function readWhyFigures(evidence) {
  const body = (label) => {
    const item = evidence.items.find((i) => i.label === label);
    if (!item) throw new Error(`deck: the /why evidence has no item "${label}". Update scripts/company-deck-slides.mjs.`);
    return item.body;
  };
  const match = (label, pattern) => {
    const m = pattern.exec(body(label));
    if (!m) throw new Error(`deck: the /why evidence item "${label}" is worded differently now, so slide 2 cannot read its figures. Update scripts/company-deck-slides.mjs.`);
    return m;
  };
  const speed = match('Speed and search basics.', /^PageSpeed Insights on a simulated phone, ([^:]+): (\d+), (\d+), (\d+) and (\d+) out of 100 for performance, accessibility, best practices and SEO\./);
  const clicks = match('Clicks from Google.', /^From (\d+) in the 28 days that include the launch \(([^)]+)\) to a best 28 days of (\d+) \(([^)]+)\), and (\d+) in the latest 28 days \(([^)]+)\)\./);
  const ai = match('AI assistants.', /^On ([^,]+), (\d+) of (\d+) answers given with web search named the site, and (\d+) of (\d+) given from memory\./);
  return {
    speed: { date: speed[1], scores: ['Performance', 'Accessibility', 'Best practices', 'SEO'].map((name, i) => ({ name, value: Number(speed[i + 2]) })) },
    clicks: [['At launch', 1], ['Best', 3], ['Latest', 5]].map(([name, i]) => ({ name, value: Number(clicks[i]), span: clicks[i + 1] })),
    ai: { date: ai[1], withSearch: [Number(ai[2]), Number(ai[3])], fromMemory: [Number(ai[4]), Number(ai[5])] },
  };
}

// A score from 0 to 100 as a ring, drawn here: no outside image or logo.
function ring({ name, value }) {
  const r = 34, c = 2 * Math.PI * r, arc = (c * value) / 100;
  return `<figure class="ring"><svg viewBox="0 0 84 84" role="img" aria-label="${esc(name)}: ${value} out of 100"><circle cx="42" cy="42" r="${r}" class="track"/><circle cx="42" cy="42" r="${r}" class="arc" stroke-dasharray="${arc.toFixed(2)} ${c.toFixed(2)}" transform="rotate(-90 42 42)"/><text x="42" y="49" text-anchor="middle">${value}</text></svg><figcaption>${esc(name)}</figcaption></figure>`;
}

// Clicks per 28 days as bars on a scale from zero to the largest value.
function bars(rows) {
  const max = Math.max(...rows.map((r) => r.value));
  return `<div class="bars">${rows.map((r) => `<div class="bar"><div class="col"><span class="value">${r.value}</span><span class="fill" style="height:${Math.max(2, Math.round((66 * r.value) / max))}px"></span></div><span class="name">${esc(r.name)}</span><span class="span">${esc(r.span)}</span></div>`).join('')}</div>`;
}

// What the deck takes from the built /from-wordpress page.
export function readWordpressFacts(html, base) {
  const page = '/from-wordpress';
  const root = parse(html);
  const need = needIn(page);
  // The step names are the headings of the numbered list; other headings in the section are not steps.
  const steps = need(root, '#move', 'move section').querySelectorAll('ol > li h3').map((h) => squash(h.text));
  if (steps.length !== 6) throw new Error(`deck: the /from-wordpress move has ${steps.length} steps, expected 6. Update scripts/company-deck-slides.mjs.`);
  const faq = (q) => {
    const item = need(root, '#faq', 'questions section').querySelectorAll('.faq-item').find((el) => squash(el.querySelector('h3')?.text ?? '') === q);
    if (!item) throw new Error(`deck: the /from-wordpress page has no question "${q}". Update scripts/company-deck-slides.mjs.`);
    // The slide shows the whole answer, so it must be one paragraph and nothing else.
    const answer = need(item, '.faq-answer', `answer to "${q}"`);
    const blocks = answer.childNodes.filter((n) => n.nodeType === 1 || squash(n.text) !== '');
    if (blocks.length !== 1 || blocks[0].tagName !== 'P') throw new Error(`deck: the answer to "${q}" on /from-wordpress is no longer one paragraph. Update scripts/company-deck-slides.mjs.`);
    return squash(inline(blocks[0], base, page));
  };
  const rankings = faq('Will I lose my Google rankings?');
  const stayCard = need(root, '#fit', 'fit section').querySelectorAll('.card').find((c) => squash(c.querySelector('h3')?.text ?? '') === 'Stay on WordPress when');
  if (!stayCard) throw new Error('deck: the /from-wordpress page has no "Stay on WordPress when" list in #fit. Update scripts/company-deck-slides.mjs.');
  const stay = stayCard.querySelectorAll('li').map((li) => squash(inline(li, base, page)));
  if (stay.length === 0) throw new Error('deck: the "Stay on WordPress when" list on /from-wordpress is empty.');
  return { steps, rankings, stay };
}

// What the deck takes from the built /security page: the two request paths and the no-ranking line.
export function readSecurityFacts(html, base) {
  const page = '/security';
  const root = parse(html);
  const need = needIn(page);
  const paths = need(root, '#runs', 'section on what runs').querySelectorAll('article.path').map((a) => ({
    title: squash(need(a, 'h3', 'path heading').text),
    steps: a.querySelectorAll('li.step').map((li) => {
      const [tag, text] = li.querySelectorAll('span');
      if (!text || !tag.classList.contains('tag')) throw new Error('deck: a step in the /security "what runs" section is no longer a label and a text. Update scripts/company-deck-slides.mjs.');
      const kind = li.classList.contains('is-code') ? 'code' : li.classList.contains('is-file') ? 'file' : '';
      return { tag: squash(tag.text), text: squash(inline(text, base, page)), kind };
    }),
  }));
  if (paths.length !== 2 || paths.some((p) => p.steps.length === 0)) throw new Error(`deck: the /security "what runs" section has ${paths.length} paths, expected 2 with steps. Update scripts/company-deck-slides.mjs.`);
  const noRanking = sentences(squash(inline(startingWith(need(root, '#safer', 'safer section'), 'p', 'We give no overall ranking', page, 'paragraphs'), base, page)), 2);
  return { paths, noRanking };
}

// "80798 Munich, Germany" gives "Munich": all between the postcode and the first comma.
export function cityOf(postcodeCity) {
  const m = /^\d{4,5} ([^,]+),/.exec(postcodeCity);
  if (!m) throw new Error(`deck: COMPANY.postcodeCity "${postcodeCity}" is not "<postcode> <city>, <country>". Update scripts/company-deck-slides.mjs.`);
  return m[1].trim();
}

// The address on the last slide is the person's own; the site itself shows COMPANY.email.
const CONTACT_EMAIL = 'daniel@m-squad.com';

const EXTRA_CSS = `
.path { padding: 22px 26px 22px; }
.path h3 { font-size: 20px; margin-bottom: 10px; }
.path ol { margin: 0; padding: 0; list-style: none; }
.path li { display: flex; gap: 12px; align-items: baseline; font-size: 18px; line-height: 1.3; margin-bottom: 6px; color: var(--muted); }
.path .tag { flex: none; width: 104px; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; color: var(--heading); }
.path .code .tag { color: #9a3b1f; }
.path .file .tag { color: var(--brand); }
.tight .card p { font-size: 18px; line-height: 1.45; }
.steps6 { margin: 0; padding-left: 26px; }
.steps6 li { font-size: 20px; line-height: 1.35; margin-bottom: 6px; }
.contact { margin: 30px 0 0; font-size: 26px; line-height: 1.5; }
.figs { display: grid; grid-template-columns: 1.2fr 1.2fr 0.85fr; gap: 20px; margin: 0; padding: 0; list-style: none; }
.figs .card { padding: 16px 20px; display: flex; flex-direction: column; }
.figs h3 { font-size: 19px; margin: 0 0 8px; }
.figs .when { margin: auto 0 0; padding-top: 10px; font-size: 15px; line-height: 1.35; color: var(--muted); }
.rings { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
.ring { margin: 0; text-align: center; }
.ring svg { width: 74px; margin: 0 auto; }
.ring .track { fill: none; stroke: var(--mint); stroke-width: 7; }
.ring .arc { fill: none; stroke: var(--brand); stroke-width: 7; stroke-linecap: round; }
.ring text { font-size: 24px; font-weight: 700; fill: var(--heading); font-family: var(--font); }
.ring figcaption { font-size: 14px; line-height: 1.25; color: var(--muted); margin-top: 6px; }
.bars { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.bar { display: flex; flex-direction: column; align-items: center; text-align: center; }
.bar .col { height: 96px; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; border-bottom: 1px solid var(--line); width: 100%; }
.bar .value { font-size: 22px; font-weight: 700; margin-bottom: 4px; }
.bar .fill { width: 52px; background: var(--brand); border-radius: 6px 6px 0 0; }
.bar .name { font-size: 15px; font-weight: 600; margin-top: 6px; }
.bar .span { font-size: 12px; line-height: 1.25; color: var(--muted); }
.big { margin: 0 0 12px; }
.big strong { display: block; font-size: 40px; line-height: 1.05; color: var(--brand); white-space: nowrap; }
.big span { font-size: 15px; line-height: 1.3; color: var(--muted); }
.contact strong { font-size: 30px; }
`;

function slideList(why, wp, sec, site, company, logo) {
  const figs = readWhyFigures(why);
  const host = site.url.replace(/^https?:\/\//, '');
  const link = (path) => `<a href="${site.url}${path}">${host}${path}</a>`;
  const tel = company.phone.replace(/ /g, '');
  // Slide 6 names the site slide 2 measures: the one link in the /why evidence intro whose text is
  // its own host name ("genai-wednesday.de" for https://genai-wednesday.de/).
  const named = [...why.intro.matchAll(/<a href="https?:\/\/(?:www\.)?([^/"]+)[^"]*">([^<]+)<\/a>/g)].filter((m) => m[1] === m[2]);
  if (named.length !== 1) throw new Error(`deck: the /why evidence introduction has ${named.length} links named after their own site, expected 1 (the measured site). Update scripts/company-deck-slides.mjs.`);
  const measured = named[0][2];
  const pathCard = (p) => `<div class="card path"><h3>${esc(p.title)}</h3><ol>${p.steps
    .map((st) => `<li class="${st.kind}"><span class="tag">${esc(st.tag)}</span><span>${st.text}</span></li>`)
    .join('')}</ol></div>`;
  return [
    // 1. Cover
    { cls: 'moss cover', body: `
      <div class="logo">${logo}</div>
      <h1>A website built to be found, in plain files you own</h1>
      <p class="lead">And a move off WordPress that lists your old addresses and checks each one on the list.</p>
      <p class="web">${host}</p>` },
    // 2. Being found: the /why evidence, drawn
    { cls: 'dense', kicker: 'Being found', title: 'Build high-ranking websites. The proof so far comes from one site.', body: `
      <p class="intro" style="margin-bottom:8px">${why.intro}</p>
      <ul class="figs" role="list">
        <li class="card"><h3>Speed and search basics</h3><div class="rings">${figs.speed.scores.map(ring).join('')}</div><p class="when">PageSpeed Insights, simulated phone, ${esc(figs.speed.date)}</p></li>
        <li class="card"><h3>Clicks from Google, per 28 days</h3>${bars(figs.clicks)}</li>
        <li class="card"><h3>Named by AI assistants</h3>
          <p class="big"><strong>${figs.ai.withSearch[0]} of ${figs.ai.withSearch[1]}</strong><span>answers given with web search</span></p>
          <p class="big"><strong>${figs.ai.fromMemory[0]} of ${figs.ai.fromMemory[1]}</strong><span>given from memory</span></p>
          <p class="when">${esc(figs.ai.date)}. <a href="${site.url}/proof#ai">Why the second is zero</a></p></li>
      </ul>
      <p class="note" style="margin-top:10px;font-size:18px;max-width:none">${why.caveat} By default, tests run before each push: ${link('/checks')}.</p>` },
    // 3. The move
    { cls: 'dense', kicker: 'Moving off WordPress', title: 'Nobody can promise your rankings. A move can keep your addresses working.', body: `
      <div class="cards two tight">
        <div class="card"><h3>The move, in six steps</h3><ol class="steps6">${wp.steps.map((st) => `<li>${esc(st)}</li>`).join('')}</ol></div>
        <div class="card"><h3>Will we lose our Google rankings?</h3><p>${wp.rankings}</p></div>
      </div>
      <p class="note">The helper is a Croftweaver skill. Its first trial on a real site: ${link('/from-wordpress#proof')}.</p>` },
    // 4. What runs on a visit
    { kicker: 'Security', title: 'Less of the site’s own code runs when someone opens a page.', body: `
      <div class="cards two">${sec.paths.map(pathCard).join('')}</div>
      <p class="note">${sec.noRanking} The flaws on each side, with their sources: ${link('/security#risks')}.</p>` },
    // 5. Fit, and what is yours afterwards
    { kicker: 'Is it for you?', title: 'Made for content sites. For the rest, stay on WordPress.', body: `
      <div class="cards two">
        <div class="card"><h3>Stay on WordPress when</h3><ul class="list">${wp.stay.map((s) => `<li>${s}</li>`).join('')}</ul></div>
        <div class="card good"><h3>After the move</h3><ul class="list">
          <li>Changes are made by someone working with an AI coding assistant: a person on your team, or someone you ask.</li>
          <li>There is no editor in the browser; an editor on your own computer can be added.</li>
          <li>The domain and the GitHub and Cloudflare accounts are in your name.</li>
        </ul></div>
      </div>` },
    // 6. Next step
    { cls: 'moss', kicker: 'Next step', title: 'Talk it through in a first call.', body: `
      <p class="lead" style="margin-top:0">${esc(company.managingDirector)} of M-Squad maintains Croftweaver, and <span style="white-space:nowrap">${measured}</span>, the site measured on slide 2, is his.</p>
      <p class="contact"><strong>${esc(company.managingDirector)}</strong><br>${esc(company.legalName)}, ${esc(cityOf(company.postcodeCity))}<br><a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a><br><a href="tel:${esc(tel)}">${esc(company.phone)}</a></p>
      <p class="note" style="border-color:var(--mint);color:var(--mint)">Moving from WordPress, in full: ${link('/from-wordpress')}.</p>` },
  ];
}

// Builds the deck for companies.
export function makeCompanyDeck({ whyHtml, wordpressHtml, securityHtml, site, company, logoSvg }) {
  const logo = logoSvg.trim();
  const slides = slideList(readWhyEvidence(whyHtml, site.url), readWordpressFacts(wordpressHtml, site.url), readSecurityFacts(securityHtml, site.url), site, company, logo);
  return renderDeck({ slides, title: 'A website built to be found, in plain files you own | Croftweaver for companies', site, logo, css: EXTRA_CSS });
}
