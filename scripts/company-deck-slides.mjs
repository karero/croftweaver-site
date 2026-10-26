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

// What the deck takes from the built /from-wordpress page.
export function readWordpressFacts(html, base) {
  const page = '/from-wordpress';
  const root = parse(html);
  const need = needIn(page);
  const steps = need(root, '#move', 'move section').querySelectorAll('h3').map((h) => squash(h.text));
  if (steps.length !== 6) throw new Error(`deck: the /from-wordpress move has ${steps.length} steps, expected 6. Update scripts/company-deck-slides.mjs.`);
  const faq = (q) => {
    const item = need(root, '#faq', 'questions section').querySelectorAll('.faq-item').find((el) => squash(el.querySelector('h3')?.text ?? '') === q);
    if (!item) throw new Error(`deck: the /from-wordpress page has no question "${q}". Update scripts/company-deck-slides.mjs.`);
    return squash(inline(need(item, '.faq-answer p', `answer to "${q}"`), base, page));
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
      return { tag: squash(tag.text), text: squash(inline(text, base, page)) };
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

// The person on the last slide writes from this address (Daniel's choice, 2026-10-25); the site
// itself shows COMPANY.email.
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
.contact strong { font-size: 30px; }
`;

function slideList(why, wp, sec, site, company, logo) {
  const host = site.url.replace(/^https?:\/\//, '');
  const link = (path) => `<a href="${site.url}${path}">${host}${path}</a>`;
  const tel = company.phone.replace(/ /g, '');
  const pathCard = (p) => `<div class="card path"><h3>${esc(p.title)}</h3><ol>${p.steps
    .map((st) => `<li class="${st.tag === 'Runs code' ? 'code' : st.tag === 'No code' ? 'file' : ''}"><span class="tag">${esc(st.tag)}</span><span>${st.text}</span></li>`)
    .join('')}</ol></div>`;
  return [
    // 1. Cover
    { cls: 'moss cover', body: `
      <div class="logo">${logo}</div>
      <h1>A website built to be found, in plain files you own</h1>
      <p class="lead">And a move off WordPress that lists your old addresses and checks each one on the list.</p>
      <p class="web">${host}</p>` },
    // 2. Being found: the /why evidence
    { cls: 'dense', kicker: 'Being found', title: 'Build high-ranking websites. The proof so far comes from one site.', body: `
      <p class="intro">${why.intro}</p>
      <ul class="list">${why.items.map((i) => `<li><strong>${esc(i.label)}</strong> ${i.body}</li>`).join('')}</ul>
      <p class="note">${why.caveat} Tests check each change before it goes out: ${link('/checks')}.</p>` },
    // 3. The move
    { cls: 'dense', kicker: 'Moving off WordPress', title: 'Nobody can promise your rankings. A move can keep your addresses working.', body: `
      <div class="cards two tight">
        <div class="card"><h3>The move, in six steps</h3><ol class="steps6">${wp.steps.map((st) => `<li>${esc(st)}</li>`).join('')}</ol></div>
        <div class="card"><h3>Will we lose our Google rankings?</h3><p>${wp.rankings}</p></div>
      </div>
      <p class="note">The helper's first trial on a real WordPress site, what it found and where it stops: ${link('/from-wordpress#proof')}.</p>` },
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
          <li>There is no editor in the browser.</li>
          <li>The domain and the GitHub and Cloudflare accounts are in your name.</li>
        </ul></div>
      </div>` },
    // 6. Next step
    { cls: 'moss', kicker: 'Next step', title: 'Talk it through in a first call.', body: `
      <p class="lead" style="margin-top:0">${esc(company.managingDirector)} of M-Squad maintains Croftweaver, and <span style="white-space:nowrap">genai-wednesday.de</span>, the site measured on slide 2, is his.</p>
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
