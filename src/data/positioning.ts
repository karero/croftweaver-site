// The positioning spine as the test enforces it, read from the test file itself, so the
// table on /positioning cannot drift from what is checked (CONTENT_GUIDE.md, spec for
// /positioning). The file is read as text and never imported: importing it would
// register tests outside the test runner.
import spec from '../../tests/positioning.spec.ts?raw';

type Clause = string | string[];
type Rule = { term?: unknown; title?: unknown; desc?: unknown; h1?: unknown; body?: unknown };

const WHERE = 'tests/positioning.spec.ts';
const fail = (why: string): never => {
  throw new Error(`${WHERE}: ${why} /positioning renders its table from the POSITIONING map; fix the map or src/data/positioning.ts.`);
};

const found = spec.match(/export const POSITIONING: Record<string, TermRule \| SurfaceRule> = \{([\s\S]*?)\n\};/);
if (!found) fail('the POSITIONING map was not found.');
const literal = found![1]
  .split('\n')
  .filter((line) => !line.trim().startsWith('//'))
  .join('\n');
// The map is written with single-quoted strings and bare keys. Turn exactly that into
// JSON; any other way of writing it (double quotes, an escaped quote, a template string)
// stops the build here instead of producing a wrong table.
if (/["\\`]/.test(literal)) fail('the map uses a quote style this reader does not handle.');
const json = `{${literal}}`
  .replace(/'/g, '"')
  .replace(/([{,]\s*)([A-Za-z_][A-Za-z0-9_]*)\s*:/g, '$1"$2":')
  .replace(/,(\s*[}\]])/g, '$1');

let map: Record<string, Rule> = {};
try {
  map = JSON.parse(json);
} catch {
  fail('the map could not be read.');
}

const isClause = (c: unknown): c is Clause =>
  typeof c === 'string' || (Array.isArray(c) && c.length > 0 && c.every((p) => typeof p === 'string'));
const clauses = (path: string, key: string, value: unknown): Clause[] => {
  if (value === undefined) return [];
  if (!Array.isArray(value) || !value.every(isClause)) fail(`the "${key}" rule of ${path} has a form this reader does not handle.`);
  return value as Clause[];
};
// A clause is one phrase, or a list of phrases of which any one will do.
const say = (c: Clause) => (Array.isArray(c) ? c.join(' or ') : c);

export const SPINE: { path: string; term: string; body: string[] }[] = Object.entries(map).map(([path, rule]) => {
  if (!path.startsWith('/')) fail(`"${path}" is not a page address.`);
  const known = ['term', 'title', 'desc', 'h1', 'body'];
  const odd = Object.keys(rule).filter((k) => !known.includes(k));
  if (odd.length) fail(`${path} has a rule this reader does not know: ${odd.join(', ')}.`);
  const body = clauses(path, 'body', rule.body).map(say);
  if (rule.term !== undefined) {
    if (typeof rule.term !== 'string' || !rule.term) fail(`the term of ${path} is not a phrase.`);
    return { path, term: rule.term as string, body };
  }
  // Separate rules per surface: show each phrase once, in the order title, description, heading.
  const phrases = [...new Set(['title', 'desc', 'h1'].flatMap((k) => clauses(path, k, rule[k as keyof Rule]).map(say)))];
  if (!phrases.length && !body.length) fail(`${path} declares no term.`);
  return { path, term: phrases.join('; '), body };
});

if (!SPINE.length) fail('the map is empty.');
// This page shows its own term too: an entry for it must exist.
if (!SPINE.some((row) => row.path === '/positioning')) fail('there is no entry for /positioning.');
