#!/usr/bin/env bash
# Guard for /security: every fact on the page is a claim in src/data/security.ts, and the built page shows
# each one with a source and the day it was read. It holds the page to its data, nothing more. It cannot show
# that a source SUPPORTS its claim: a person read each source for that (the plan's raw-source log), and
# scripts/check_external_links.sh covers link rot.
#
# Reads dist/security.html, so it builds nothing and refuses a stale build: it fails with "run npm run build"
# unless dist/security.html is at least as new as the page, its data and the component that renders a claim.
# CI runs `npm run build` first; the pre-push hook has just built. (The site's build.format is "file", so the
# page is dist/security.html, astro.config.mjs.)
#
# What it checks, with node-html-parser (already a dependency of the site):
#   - the ids in src/data/security.ts (read with a regular expression: the file is flat data, one object per
#     claim, opened on its own line with the id as its first key) are a non-empty list without duplicates;
#   - every id has exactly one element data-claim="<id>" on the page, and the page has no other;
#   - each element shows its source: kind "url" an https address and a link to it; kind "command" a
#     non-empty one-line command shown in <code>; kind "file" a file that exists in this repository, linked;
#   - each element has a <time datetime> that is an ISO date (YYYY-MM-DD), a real day, and not in the future.
# It also runs its own reader on hand-made pages first (a check never seen to fail proves nothing). No network.
# Needs bash and node.
set -euo pipefail
cd "$(dirname "$0")/.."

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
import { readFileSync, existsSync } from "node:fs";

const KINDS = ["url", "command", "file"];
const realDay = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s) && new Date(s + "T00:00:00Z").toISOString().slice(0, 10) === s;

// ids: the claim ids of the data file; html: the built page; today: "YYYY-MM-DD"; fileExists: a path test.
function check({ ids, html, today, fileExists }) {
  const problems = [];
  if (ids.length === 0) problems.push("the data file lists no claims (no line opens with { id: \"...\" })");
  for (const id of new Set(ids.filter((x, i) => ids.indexOf(x) !== i))) problems.push("the data file lists \"" + id + "\" twice");
  const els = parse(html).querySelectorAll("[data-claim]");
  const count = new Map();
  for (const el of els) count.set(el.getAttribute("data-claim"), (count.get(el.getAttribute("data-claim")) || 0) + 1);
  for (const id of new Set(ids)) if (!count.has(id)) problems.push("claim \"" + id + "\" is in the data file but not on the page");
  for (const [id, n] of count) {
    if (!ids.includes(id)) problems.push("the page has a claim \"" + id + "\" that the data file does not list");
    if (n > 1) problems.push("claim \"" + id + "\" appears " + n + " times on the page");
  }
  for (const el of els) {
    const id = el.getAttribute("data-claim");
    const src = el.querySelector("[data-source]");
    if (!src) { problems.push("claim \"" + id + "\" shows no source"); continue; }
    const kind = src.getAttribute("data-kind");
    const source = src.getAttribute("data-source") || "";
    if (!KINDS.includes(kind)) { problems.push("claim \"" + id + "\" has source kind \"" + kind + "\" (url, command or file)"); }
    else if (kind === "url") {
      if (!/^https:\/\/\S+$/.test(source)) problems.push("claim \"" + id + "\": the source is not an https address: " + source);
      else if (!el.querySelectorAll("a").some((a) => a.getAttribute("href") === source)) problems.push("claim \"" + id + "\" does not link to its source " + source);
    } else if (kind === "command") {
      if (source.trim() === "" || /[\r\n]/.test(source)) problems.push("claim \"" + id + "\": a command must be one non-empty line");
      else if (!el.querySelectorAll("code").some((c) => c.text === source)) problems.push("claim \"" + id + "\" does not show its command in <code>");
    } else if (kind === "file") {
      if (!fileExists(source)) problems.push("claim \"" + id + "\": the file " + source + " is not in this repository");
      else if (!el.querySelectorAll("a").some((a) => (a.getAttribute("href") || "").endsWith("/" + source))) problems.push("claim \"" + id + "\" does not link to the file " + source);
    }
    const time = el.querySelector("time[datetime]");
    if (!time) { problems.push("claim \"" + id + "\" shows no date (<time datetime>)"); continue; }
    const d = time.getAttribute("datetime") || "";
    if (!realDay(d)) problems.push("claim \"" + id + "\": \"" + d + "\" is not a real ISO date");
    else if (d > today) problems.push("claim \"" + id + "\": the date " + d + " is in the future");
  }
  return { problems, claims: els.length };
}

// ---- the reader on hand-made pages ----
const TODAY = "2026-10-22";
const yes = () => true;
const item = (id, o = {}) => {
  const kind = o.kind || "url", source = o.source || "https://example.com/a";
  const link = o.noLink ? "" : kind === "url" ? "<a href=\"" + source + "\">x</a>" : kind === "file" ? "<a href=\"https://example.com/blob/abc/" + source + "\">f</a>" : (o.noCode ? "" : "<code>" + source.replace(/&/g, "&amp;") + "</code>");
  const time = o.noTime ? "" : "<time datetime=\"" + (o.date || "2026-10-22") + "\">d</time>";
  return "<li data-claim=\"" + id + "\">text <span " + (o.noSource ? "" : "data-kind=\"" + kind + "\" data-source=\"" + source.replace(/&/g, "&amp;").replace(/"/g, "&quot;") + "\"") + ">" + link + time + "</span></li>";
};
const page = (...items) => "<main><ul>" + items.join("") + "</ul></main>";
const cases = [
  ["a good page", { ids: ["a", "b", "c"], html: page(item("a"), item("b", { kind: "command", source: "dig +short DS x.com | grep \"a&b\"" }), item("c", { kind: "file", source: "AGENTS.md" })) }, []],
  ["no ids", { ids: [], html: page() }, ["no claims"]],
  ["an id twice in the data", { ids: ["a", "a"], html: page(item("a")) }, ["twice"]],
  ["an id missing on the page", { ids: ["a", "b"], html: page(item("a")) }, ["\"b\" is in the data file but not on the page"]],
  ["an unexpected id on the page", { ids: ["a"], html: page(item("a"), item("z")) }, ["does not list"]],
  ["an id twice on the page", { ids: ["a"], html: page(item("a"), item("a")) }, ["2 times"]],
  ["no source", { ids: ["a"], html: page(item("a", { noSource: true })) }, ["shows no source"]],
  ["a url that is not https", { ids: ["a"], html: page(item("a", { source: "http://example.com/a" })) }, ["not an https"]],
  ["a url without its link", { ids: ["a"], html: page(item("a", { noLink: true })) }, ["does not link"]],
  ["a command not in code", { ids: ["a"], html: page(item("a", { kind: "command", source: "npm audit", noCode: true })) }, ["in <code>"]],
  ["an empty command", { ids: ["a"], html: page(item("a", { kind: "command", source: " " })) }, ["non-empty"]],
  ["a file that is not there", { ids: ["a"], html: page(item("a", { kind: "file", source: "nope.md" })), fileExists: () => false }, ["not in this repository"]],
  ["an unknown kind", { ids: ["a"], html: page(item("a", { kind: "magic" })) }, ["source kind"]],
  ["no date", { ids: ["a"], html: page(item("a", { noTime: true })) }, ["no date"]],
  ["a date that is not ISO", { ids: ["a"], html: page(item("a", { date: "22 October 2026" })) }, ["not a real ISO date"]],
  ["a day that does not exist", { ids: ["a"], html: page(item("a", { date: "2026-02-30" })) }, ["not a real ISO date"]],
  ["a date in the future", { ids: ["a"], html: page(item("a", { date: "2026-10-23" })) }, ["in the future"]],
  ["today is not the future", { ids: ["a"], html: page(item("a", { date: "2026-10-22" })) }, []],
];
let bad = 0;
console.log("security page check: the reader on hand-made pages");
for (const [name, input, expect] of cases) {
  const { problems } = check({ today: TODAY, fileExists: yes, ...input });
  const ok = expect.length === 0 ? problems.length === 0 : expect.every((e) => problems.some((p) => p.includes(e)));
  console.log("  " + (ok ? "ok   " : "FAIL ") + name + (ok ? "" : ": got " + JSON.stringify(problems)));
  if (!ok) bad++;
}
if (bad) { console.log("security page check: the reader itself is wrong (" + bad + " case(s) above); not looking at the real page."); process.exit(1); }

// ---- the real page ----
const [pagePath, dataPath] = process.argv.slice(1);
const data = readFileSync(dataPath, "utf8");
const ids = [...data.matchAll(/^\s*\{ id: \x27([a-z0-9][a-z0-9-]*)\x27/gm)].map((m) => m[1]);
const today = new Date().toISOString().slice(0, 10);
const { problems, claims } = check({ ids, html: readFileSync(pagePath, "utf8"), today, fileExists: (p) => existsSync(p) });
console.log("security page check: " + pagePath + ", " + ids.length + " claim(s) in " + dataPath + ", " + claims + " on the page");
for (const p of problems) console.log("  FAIL " + p);
process.exit(problems.length ? 1 : 0);
'

if node --input-type=module -e "$READER" "$PAGE" "$DATA"; then
  echo "security page check: passed."
else
  echo "security page check: failed. Fix the page or src/data/security.ts, run npm run build, and run this again." >&2
  exit 1
fi
