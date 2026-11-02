// The slide decks this site makes, and the one comparison that says whether a deck's PDF is
// current. scripts/build-deck.mjs uses both for --check and for what it remakes; the tests use
// them too. No browser and no file access here.
import { createHash } from 'node:crypto';
import { makeDeck } from './deck-slides.mjs';
import { makeCompanyDeck } from './company-deck-slides.mjs';

export const sha = (data) => createHash('sha256').update(data).digest('hex');

// `make` gets `dist(name)`, the text of a built page, and the site facts; it returns makeDeck's shape.
export const DECKS = [
  {
    name: 'why',
    pdf: 'public/croftweaver-why.pdf', // served on the site, so the build also refreshes dist/
    lock: 'scripts/deck.lock.json',
    served: true,
    make: ({ dist, site, logoSvg }) => makeDeck({ whyHtml: dist('why.html'), checksHtml: dist('checks.html'), site, logoSvg }),
  },
  {
    name: 'company',
    pdf: 'handouts/croftweaver-for-companies.pdf', // a handout: not in public/, not on the site
    lock: 'scripts/company-deck.lock.json',
    served: false,
    make: ({ dist, site, company, logoSvg }) =>
      makeCompanyDeck({ whyHtml: dist('why.html'), wordpressHtml: dist('from-wordpress.html'), securityHtml: dist('security.html'), site, company, logoSvg }),
  },
];

// null when the PDF is current; otherwise why not. `lockText` and `pdfBytes` are null when missing.
// The lock holds two hashes: the slides' HTML and the PDF's bytes (a hand edit changes the second).
export function checkDeck({ deck, html, lockText, pdfBytes }) {
  if (lockText === null || pdfBytes === null) return `there is no ${deck.pdf} or ${deck.lock} yet. Run \`npm run deck\`.`;
  const lock = JSON.parse(lockText);
  if (lock.source !== sha(html)) return `out of date: something it reads on a page, a line of its slides, the logo or the site address changed since the PDF was made. Run \`npm run deck\` and commit ${deck.pdf} and ${deck.lock}.`;
  if (lock.pdf !== sha(pdfBytes)) return `${deck.pdf} was changed without scripts/build-deck.mjs. Run \`npm run deck\` to make it again.`;
  return null;
}

// Which decks `npm run deck` makes: the one named, or else each one checkDeck does not call current.
export function decksToMake(results, named) {
  if (named) return results.filter((r) => r.deck.name === named);
  return results.filter((r) => r.problem !== null);
}
