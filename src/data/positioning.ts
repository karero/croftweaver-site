// The positioning spine as the test enforces it, read from the test file itself, so the
// table on /positioning cannot drift from what is checked (CONTENT_GUIDE.md, spec for
// /positioning). The file is read as text and never imported: importing it would
// register tests outside the test runner. The text is parsed with the TypeScript
// compiler, not with patterns: a phrase may hold commas, colons, braces or quotes, and
// the table has to show it exactly as the test reads it.
import ts from 'typescript';
import spec from '../../tests/positioning.spec.ts?raw';

type Clause = string | string[];

const WHERE = 'tests/positioning.spec.ts';
const fail = (why: string): never => {
  throw new Error(`${WHERE}: ${why} /positioning renders its table from this file; fix the file or src/data/positioning.ts.`);
};

const source = ts.createSourceFile('positioning.spec.ts', spec, ts.ScriptTarget.Latest, true);
const declared = (name: string): ts.Expression => {
  for (const statement of source.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const d of statement.declarationList.declarations) {
      if (ts.isIdentifier(d.name) && d.name.text === name && d.initializer) return d.initializer;
    }
  }
  return fail(`${name} was not found.`);
};

// Only plain values: a phrase, a list, or an object of those. Anything computed (a name,
// a spread, a template with a placeholder) stops the build instead of being guessed at.
const plain = (node: ts.Expression): unknown => {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(plain);
  if (ts.isObjectLiteralExpression(node)) {
    const out: Record<string, unknown> = {};
    for (const p of node.properties) {
      if (!ts.isPropertyAssignment(p) || !(ts.isIdentifier(p.name) || ts.isStringLiteral(p.name))) {
        return fail('an entry is written in a form this reader does not handle.');
      }
      out[p.name.text] = plain(p.initializer);
    }
    return out;
  }
  return fail('a value is not a plain phrase, list or object.');
};

const mapNode = declared('POSITIONING');
if (!ts.isObjectLiteralExpression(mapNode)) fail('POSITIONING is not written as a plain object.');
const map = plain(mapNode) as Record<string, Record<string, unknown>>;

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
  if (typeof rule !== 'object' || rule === null || Array.isArray(rule)) fail(`the entry for ${path} is not an object.`);
  const known = ['term', 'title', 'desc', 'h1', 'body'];
  const odd = Object.keys(rule).filter((k) => !known.includes(k));
  if (odd.length) fail(`${path} has a rule this reader does not know: ${odd.join(', ')}.`);
  const body = clauses(path, 'body', rule.body).map(say);
  if (rule.term !== undefined) {
    if (typeof rule.term !== 'string' || !rule.term) fail(`the term of ${path} is not a phrase.`);
    return { path, term: rule.term as string, body };
  }
  // Separate rules per surface: show each phrase once, in the order title, description, heading.
  const phrases = [...new Set(['title', 'desc', 'h1'].flatMap((k) => clauses(path, k, rule[k]).map(say)))];
  if (!phrases.length && !body.length) fail(`${path} declares no term.`);
  return { path, term: phrases.join('; '), body };
});

if (!SPINE.length) fail('the POSITIONING map is empty.');
// This page shows its own term too: an entry for it must exist.
if (!SPINE.some((row) => row.path === '/positioning')) fail('there is no entry for /positioning.');

// The pages that carry no term on purpose: new Set<string>(['/privacy', …]) in the test.
const exemptNode = declared('POSITIONING_EXEMPT');
if (!ts.isNewExpression(exemptNode) || !ts.isIdentifier(exemptNode.expression) || exemptNode.expression.text !== 'Set') {
  fail('POSITIONING_EXEMPT is not written as new Set([...]).');
}
const exemptArg = (exemptNode as ts.NewExpression).arguments?.[0];
const exemptValue = exemptArg ? plain(exemptArg) : [];
if (!Array.isArray(exemptValue) || !exemptValue.every((p) => typeof p === 'string')) {
  fail('POSITIONING_EXEMPT is not a list of page addresses.');
}
export const EXEMPT = exemptValue as string[];
