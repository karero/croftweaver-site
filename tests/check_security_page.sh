#!/usr/bin/env bash
# Guard for /security: every registered claim in src/data/security.ts is on the built page, with the source and
# the day it was read that the data gives. It holds the page to its data, nothing more. It cannot show that a
# source SUPPORTS the sentence next to it: an AI assistant read each source for that (2026-10-22) and kept a log,
# and editorial review covers that and everything on the page that is not a registered claim. It does not look for
# dead links: scripts/check_external_links.sh does, warn-only, and is not in CI or the hook; run it on demand.
#
# Reads dist/security.html, so it builds nothing and refuses a stale build: it fails with "run npm run build"
# unless dist/security.html is at least as new as the page, its data and the component that renders a claim.
# CI builds first; the pre-push hook has just built. (The site's build.format is "file", so the page is
# dist/security.html, astro.config.mjs.)
#
# What it checks, with node-html-parser (already a dependency of the site). The data is loaded with the TypeScript
# compiler (also a dependency), not read with a pattern, so it is the very list the build used:
#   - the claim ids are a non-empty list without duplicates;
#   - every id has exactly one element data-claim="<id>" on the page, and the page has no other;
#   - each element shows what the data says for that id: the same kind and source (data-kind, data-source), a link
#     to the source (a url claim: the link text is its label, and each `also` page is linked; a file claim: the
#     file at the pinned commit with its lines; a command claim: the command in <code>), the same day in its
#     <time datetime>, and, for a claim with a `result`, that result as text;
#   - each date is a real ISO day (month 13, day 32 and 30 February are not) and at most one day after today's UTC date;
#   - while own-security-txt says "not yet", public/.well-known/security.txt must not exist: the rows of #own are
#     filled from live reads after that file has shipped, and this fails until then, on purpose.
# It runs its own reader on hand-made pages first (a check never seen to fail proves nothing). No network.
# Needs bash and node.
set -euo pipefail
CDPATH= cd -- "$(dirname -- "$0")/.."

if ! command -v node >/dev/null 2>&1; then
  echo "security page check: node is not installed or not on PATH." >&2
  exit 1
fi

PAGE=dist/security.html
DATA=src/data/security.ts

for f in src/pages/security.astro "$DATA" src/components/Claim.astro; do
  if [ ! -f "$f" ]; then echo "security page check: $f is missing" >&2; exit 1; fi
done
if [ ! -f "$PAGE" ]; then
  echo "security page check: $PAGE does not exist: run npm run build" >&2
  exit 1
fi
for f in src/pages/security.astro "$DATA" src/components/Claim.astro; do
  if [ "$f" -nt "$PAGE" ]; then
    echo "security page check: $PAGE is older than $f: run npm run build" >&2
    exit 1
  fi
done

READER='
import { parse } from "node-html-parser";
import ts from "typescript";
import { readFileSync, existsSync } from "node:fs";

const KINDS = ["url", "command", "file"];
const SEC_TXT = "public/.well-known/security.txt";
// A real day: month 13, day 32 and 30 February are not. Date.parse gives NaN for month 13 and day 32 and rolls 30
// February over into 2 March; the round trip through toISOString shows that the day changed.
const realDay = (s) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const t = Date.parse(s + "T00:00:00Z");
  return !Number.isNaN(t) && new Date(t).toISOString().slice(0, 10) === s;
};
const nextDay = (d) => new Date(Date.parse(d + "T00:00:00Z") + 86400000).toISOString().slice(0, 10);

// claims: the claim objects of the data file; html: the built page; today: "YYYY-MM-DD" (UTC);
// fileExists, fileHref: as the data module and the repository give them; securityTxtExists: the file is in the repository.
function check({ claims, html, today, fileExists, fileHref, securityTxtExists }) {
  const problems = [];
  const ids = claims.map((c) => c.id);
  if (ids.length === 0) problems.push("the data file lists no claims");
  for (const id of new Set(ids.filter((x, i) => ids.indexOf(x) !== i))) problems.push("the data file lists \"" + id + "\" twice");
  const els = parse(html).querySelectorAll("[data-claim]");
  const count = new Map();
  for (const el of els) count.set(el.getAttribute("data-claim"), (count.get(el.getAttribute("data-claim")) || 0) + 1);
  for (const id of new Set(ids)) if (!count.has(id)) problems.push("claim \"" + id + "\" is in the data file but not on the page");
  for (const [id, n] of count) {
    if (!ids.includes(id)) problems.push("the page has a claim \"" + id + "\" that the data file does not list");
    if (n > 1) problems.push("claim \"" + id + "\" appears " + n + " times on the page");
  }
  const limit = nextDay(today);
  for (const c of claims) {
    const el = els.find((e) => e.getAttribute("data-claim") === c.id);
    if (!el) continue;
    const id = c.id;
    if (!KINDS.includes(c.kind)) problems.push("claim \"" + id + "\" has source kind \"" + c.kind + "\" in the data (url, command or file)");
    const src = el.querySelector("[data-source]");
    if (!src) { problems.push("claim \"" + id + "\" shows no source"); continue; }
    const kind = src.getAttribute("data-kind");
    const source = src.getAttribute("data-source") || "";
    if (kind !== c.kind) problems.push("claim \"" + id + "\": the page shows source kind \"" + kind + "\", the data says \"" + c.kind + "\"");
    if (source !== c.source) problems.push("claim \"" + id + "\": the page shows the source \"" + source + "\", the data says \"" + c.source + "\"");
    const links = el.querySelectorAll("a");
    if (c.kind === "url") {
      if (!/^https:\/\/\S+$/.test(c.source)) problems.push("claim \"" + id + "\": the source is not an https address: " + c.source);
      const a = links.find((x) => x.getAttribute("href") === c.source);
      if (!a) problems.push("claim \"" + id + "\" does not link to its source " + c.source);
      else if (!c.label || a.text.trim() !== c.label) problems.push("claim \"" + id + "\": the link text is \"" + a.text.trim() + "\", the data says \"" + c.label + "\"");
      for (const al of c.also || []) if (!links.some((x) => x.getAttribute("href") === al.url)) problems.push("claim \"" + id + "\" does not link to " + al.url);
    } else if (c.kind === "command") {
      if (c.source.trim() === "" || /[\r\n]/.test(c.source)) problems.push("claim \"" + id + "\": a command must be one non-empty line");
      else if (!el.querySelectorAll("code").some((x) => x.text === c.source)) problems.push("claim \"" + id + "\" does not show its command in <code>");
    } else if (c.kind === "file") {
      if (!fileExists(c.source)) problems.push("claim \"" + id + "\": the file " + c.source + " is not in this repository");
      else if (!links.some((x) => x.getAttribute("href") === fileHref(c.source, c.lines))) problems.push("claim \"" + id + "\" does not link to " + fileHref(c.source, c.lines));
    }
    if (c.result && !el.text.replace(/\s+/g, " ").includes(c.result)) problems.push("claim \"" + id + "\": the page does not show the result the data gives");
    const time = el.querySelector("time[datetime]");
    if (!time) { problems.push("claim \"" + id + "\" shows no date (<time datetime>)"); continue; }
    const d = time.getAttribute("datetime") || "";
    if (d !== c.read) problems.push("claim \"" + id + "\": the page shows the date " + d + ", the data says " + c.read);
    if (!realDay(c.read)) problems.push("claim \"" + id + "\": \"" + c.read + "\" is not a real ISO date");
    else if (c.read > limit) problems.push("claim \"" + id + "\": the date " + c.read + " is in the future");
  }
  const own = claims.find((c) => c.id === "own-security-txt");
  if (own && own.status === "not yet" && securityTxtExists) {
    problems.push("own-security-txt says \"not yet\" but " + SEC_TXT + " exists: fill the rows of #own from live reads after the file has shipped (see src/data/security.ts)");
  }
  return { problems, claims: els.length };
}

// ---- the reader on hand-made pages ----
const TODAY = "2026-10-22";
const yes = () => true;
const stubHref = (s, l) => "https://example.com/blob/abc/" + s + (l ? "#" + l : "");
const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
const url = (id, o = {}) => ({ id, kind: "url", source: "https://example.com/" + id, label: "Label " + id, read: "2026-10-22", ...o });
const cmd = (id, o = {}) => ({ id, kind: "command", source: "dig +short DS x.com | grep \"a&b\"", read: "2026-10-22", ...o });
const file = (id, o = {}) => ({ id, kind: "file", source: "AGENTS.md", lines: "L10-L12", read: "2026-10-22", ...o });
// The element the page would show for a claim; o breaks one thing at a time.
const el = (c, o = {}) => {
  const kind = o.kind || c.kind, source = o.source !== undefined ? o.source : c.source, date = o.date || c.read;
  let body = "";
  if (!o.noLink) {
    if (c.kind === "url") body = "<a href=\"" + esc(o.href || c.source) + "\">" + (o.text || c.label) + "</a>" + (c.also || []).filter(() => !o.noAlso).map((a) => "; <a href=\"" + a.url + "\">" + a.label + "</a>").join("");
    else if (c.kind === "file") body = "<a href=\"" + esc(o.href || stubHref(c.source, c.lines)) + "\"><code>" + c.source + "</code></a>";
    else if (!o.noCode) body = "<code>" + esc(c.source).replace(/&quot;/g, "\"") + "</code>";
  }
  const time = o.noTime ? "" : "<time datetime=\"" + date + "\">d</time>";
  const result = c.result && !o.noResult ? c.result : "";
  return "<li data-claim=\"" + (o.id || c.id) + "\">text " + result + " <span " + (o.noSource ? "" : "data-kind=\"" + kind + "\" data-source=\"" + esc(source) + "\"") + ">" + body + time + "</span></li>";
};
const page = (...items) => "<main><ul>" + items.join("") + "</ul></main>";
const A = url("a"), B = cmd("b"), C = file("c");
const own = (status) => cmd("own-security-txt", { status, result: "Result text." });
const cases = [
  ["a good page", { claims: [A, B, C], html: page(el(A), el(B), el(C)) }, []],
  ["a url with an also page", { claims: [url("a", { also: [{ label: "Other", url: "https://example.com/other" }] })], html: page(el(url("a", { also: [{ label: "Other", url: "https://example.com/other" }] }))) }, []],
  ["no claims", { claims: [], html: page() }, ["no claims"]],
  ["an id twice in the data", { claims: [A, A], html: page(el(A)) }, ["twice"]],
  ["an id missing on the page", { claims: [A, url("b2")], html: page(el(A)) }, ["\"b2\" is in the data file but not on the page"]],
  ["an unexpected id on the page", { claims: [A], html: page(el(A), el(url("z"))) }, ["does not list"]],
  ["an id twice on the page", { claims: [A], html: page(el(A), el(A)) }, ["2 times"]],
  ["no source", { claims: [A], html: page(el(A, { noSource: true })) }, ["shows no source"]],
  ["a replaced source", { claims: [A], html: page(el(A, { source: "https://example.com/other" })) }, ["the page shows the source"]],
  ["a replaced kind", { claims: [A], html: page(el(A, { kind: "command" })) }, ["source kind \"command\""]],
  ["a replaced date", { claims: [A], html: page(el(A, { date: "2026-10-21" })) }, ["the page shows the date 2026-10-21, the data says 2026-10-22"]],
  ["a replaced link", { claims: [A], html: page(el(A, { href: "https://example.com/elsewhere" })) }, ["does not link to its source"]],
  ["a replaced link text", { claims: [A], html: page(el(A, { text: "Another label" })) }, ["the link text is"]],
  ["an also page not linked", { claims: [url("a", { also: [{ label: "Other", url: "https://example.com/other" }] })], html: page(el(url("a", { also: [{ label: "Other", url: "https://example.com/other" }] }), { noAlso: true })) }, ["does not link to https://example.com/other"]],
  ["a url that is not https", { claims: [url("a", { source: "http://example.com/a" })], html: page(el(url("a", { source: "http://example.com/a" }))) }, ["not an https"]],
  ["a url without its link", { claims: [A], html: page(el(A, { noLink: true })) }, ["does not link"]],
  ["a command not in code", { claims: [B], html: page(el(B, { noCode: true })) }, ["in <code>"]],
  ["an empty command", { claims: [cmd("b", { source: " " })], html: page(el(cmd("b", { source: " " }), { noCode: true })) }, ["non-empty"]],
  ["a file that is not there", { claims: [C], html: page(el(C)), fileExists: () => false }, ["not in this repository"]],
  ["a file link without its lines", { claims: [C], html: page(el(C, { href: stubHref("AGENTS.md") })) }, ["does not link to"]],
  ["an unknown kind in the data", { claims: [{ ...A, kind: "magic" }], html: page(el(A, { kind: "magic" })) }, ["source kind \"magic\""]],
  ["no date", { claims: [A], html: page(el(A, { noTime: true })) }, ["no date"]],
  ["a date that is not ISO", { claims: [url("a", { read: "22 October 2026" })], html: page(el(url("a", { read: "22 October 2026" }))) }, ["not a real ISO date"]],
  ["30 February", { claims: [url("a", { read: "2026-02-30" })], html: page(el(url("a", { read: "2026-02-30" }))) }, ["not a real ISO date"]],
  ["month 13 does not crash", { claims: [url("a", { read: "2026-13-01" })], html: page(el(url("a", { read: "2026-13-01" }))) }, ["not a real ISO date"]],
  ["month 00 does not crash", { claims: [url("a", { read: "2026-00-10" })], html: page(el(url("a", { read: "2026-00-10" }))) }, ["not a real ISO date"]],
  ["day 32 does not crash", { claims: [url("a", { read: "2026-10-32" })], html: page(el(url("a", { read: "2026-10-32" }))) }, ["not a real ISO date"]],
  ["two days ahead is the future", { claims: [url("a", { read: "2026-10-24" })], html: page(el(url("a", { read: "2026-10-24" }))) }, ["in the future"]],
  ["one day ahead is allowed (a local date after UTC midnight)", { claims: [url("a", { read: "2026-10-23" })], html: page(el(url("a", { read: "2026-10-23" }))) }, []],
  ["today is not the future", { claims: [A], html: page(el(A)) }, []],
  ["a result the page does not show", { claims: [own("pass")], html: page(el(own("pass"), { noResult: true })) }, ["does not show the result"]],
  ["security.txt exists, row says not yet", { claims: [own("not yet")], html: page(el(own("not yet"))), securityTxtExists: true }, ["says \"not yet\" but"]],
  ["security.txt exists, row says pass", { claims: [own("pass")], html: page(el(own("pass"))), securityTxtExists: true }, []],
  ["security.txt absent, row says not yet", { claims: [own("not yet")], html: page(el(own("not yet"))), securityTxtExists: false }, []],
];
let bad = 0;
console.log("security page check: the reader on hand-made pages");
for (const [name, input, expect] of cases) {
  const { problems } = check({ today: TODAY, fileExists: yes, fileHref: stubHref, securityTxtExists: false, ...input });
  const ok = expect.length === 0 ? problems.length === 0 : expect.every((e) => problems.some((p) => p.includes(e)));
  console.log("  " + (ok ? "ok   " : "FAIL ") + name + (ok ? "" : ": got " + JSON.stringify(problems)));
  if (!ok) bad++;
}
if (bad) { console.log("security page check: the reader itself is wrong (" + bad + " case(s) above); not looking at the real page."); process.exit(1); }

// ---- the real page ----
const [pagePath, dataPath] = process.argv.slice(1);
let mod;
try {
  const js = ts.transpileModule(readFileSync(dataPath, "utf8"), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
  mod = await import("data:text/javascript;base64," + Buffer.from(js).toString("base64"));
} catch (e) {
  console.log("FAIL " + dataPath + " could not be loaded: " + e.message);
  process.exit(1);
}
const today = new Date().toISOString().slice(0, 10);
const { problems, claims } = check({
  claims: mod.CLAIMS, html: readFileSync(pagePath, "utf8"), today,
  fileExists: (p) => existsSync(p), fileHref: mod.fileHref, securityTxtExists: existsSync(SEC_TXT),
});
console.log("security page check: " + pagePath + ", " + mod.CLAIMS.length + " claim(s) in " + dataPath + ", " + claims + " on the page");
for (const p of problems) console.log("  FAIL " + p);
process.exit(problems.length ? 1 : 0);
'

if node --input-type=module -e "$READER" "$PAGE" "$DATA"; then
  echo "security page check: passed."
else
  echo "security page check: failed. Fix the page or src/data/security.ts, run npm run build, and run this again." >&2
  exit 1
fi
