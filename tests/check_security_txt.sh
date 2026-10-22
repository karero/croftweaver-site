#!/usr/bin/env bash
# Guard for public/.well-known/security.txt, the file RFC 9116 asks a site to publish so that
# someone who finds a security problem knows where to send it.
#
# What it checks, on the file in the repository (the build copies public/ into dist/ unchanged;
# the live copy is a separate look after each ship, see the pull request that added this):
#   - every line is a comment, blank, or "Field: value" with exactly one space after the colon
#     (RFC 9116 section 4), and the field is one the RFC defines;
#   - Contact: at least one, each an https URL or a mailto: or tel: URI (section 2.5.3);
#   - Expires: exactly one, an RFC 3339 date-time, still in the future (section 2.5.5);
#   - Canonical: one of the lines is exactly this site's address (section 2.5.2, which says a
#     file fetched from an address not listed there SHOULD NOT be trusted);
#   - Canonical, Policy, Acknowledgments, Encryption, Hiring: https URLs where the RFC says so.
# Time to Expires: 30 days or fewer is a WARNING, 7 days or fewer is a FAILURE. Why not fail at
# 30: a red check blocks the pre-push hook, `npm run ship` and CI, so a lapse would also hold
# up a Dependabot security update. CI skips this script for Dependabot's own pull requests for
# the same reason (.github/workflows/ci.yml); it still runs on the push that merges them.
# A site that sits untouched needs a calendar entry 45 days before Expires: this script runs
# only when someone pushes.
#
# It also runs its own reader on hand-made files first (a check that has never been seen to
# fail proves nothing): each way the file can be wrong, and each boundary of the two limits.
# The date maths runs in `node -e` because `date` differs between macOS and Linux.
# Needs bash and node. No network.
set -euo pipefail
cd "$(dirname "$0")/.."

FILE=public/.well-known/security.txt
CANONICAL=https://croftweaver.com/.well-known/security.txt
WARN_DAYS=30
FAIL_DAYS=7

# argv: file, canonical, warn days, fail days, "now" as an ISO date-time ("" = the real now).
# Prints "FAIL ...", "WARN ..." and one "ok ..." line; exits 1 if any FAIL.
READER='
const fs = require("node:fs");
const [file, canonical, warnDays, failDays, nowIso] = process.argv.slice(1);
const now = nowIso ? Date.parse(nowIso) : Date.now();
const fails = [];
const warns = [];
let text;
try { text = fs.readFileSync(file, "utf8"); } catch (e) {
  console.log("FAIL " + file + " cannot be read (" + e.code + ")");
  process.exit(1);
}
const KNOWN = ["acknowledgments", "canonical", "contact", "encryption", "expires", "hiring", "policy", "preferred-languages"];
const fields = [];
text.split("\n").forEach((raw, i) => {
  const line = raw.replace(/[ \t\r]+$/, "");
  if (line === "" || line.startsWith("#")) return;
  const m = line.match(/^([A-Za-z0-9-]+): (\S.*)$/);
  if (!m) { fails.push("line " + (i + 1) + " is not \"Field: value\" with one space after the colon: " + line); return; }
  const name = m[1].toLowerCase();
  if (!KNOWN.includes(name)) { fails.push("line " + (i + 1) + " has a field RFC 9116 does not define: " + m[1]); return; }
  fields.push({ name, value: m[2], line: i + 1 });
});
const all = (n) => fields.filter((f) => f.name === n);

const contacts = all("contact");
if (contacts.length === 0) fails.push("no Contact line (RFC 9116 section 2.5.3: it MUST be present)");
for (const c of contacts) {
  if (!/^(https:\/\/\S+|mailto:\S+@\S+|tel:\+?[0-9-]+)$/.test(c.value)) {
    fails.push("line " + c.line + ": Contact must be an https URL, a mailto: or a tel: URI: " + c.value);
  }
}
for (const n of ["canonical", "policy", "acknowledgments", "encryption", "hiring"]) {
  for (const f of all(n)) {
    if (!/^https:\/\/\S+$/.test(f.value)) fails.push("line " + f.line + ": " + f.name + " must be an https URL: " + f.value);
  }
}
if (!all("canonical").some((f) => f.value === canonical)) {
  fails.push("no Canonical line equal to " + canonical);
}

const expires = all("expires");
let daysLeft = null;
if (expires.length !== 1) {
  fails.push("Expires must appear exactly once (RFC 9116 section 2.5.5), found " + expires.length);
} else {
  const v = expires[0].value;
  // RFC 3339 allows a lower-case "t" and "z" (RFC 9116 itself shows "...07z"); Date.parse wants upper case.
  const when = /^\d{4}-\d{2}-\d{2}[Tt]\d{2}:\d{2}:\d{2}(\.\d+)?([Zz]|[+-]\d{2}:\d{2})$/.test(v) ? Date.parse(v.toUpperCase()) : NaN;
  if (Number.isNaN(when)) {
    fails.push("line " + expires[0].line + ": Expires is not an RFC 3339 date-time such as 2027-04-22T00:00:00Z: " + v);
  } else {
    daysLeft = Math.floor((when - now) / 86400000);
    if (when <= now) fails.push("Expires " + v + " has passed");
    else if (daysLeft <= Number(failDays)) fails.push("Expires " + v + " is " + daysLeft + " day(s) away (fails at " + failDays + " or fewer): renew it");
    else if (daysLeft <= Number(warnDays)) warns.push("Expires " + v + " is " + daysLeft + " day(s) away (warns at " + warnDays + " or fewer): renew it soon");
    if (daysLeft > 366) warns.push("Expires is more than a year away; RFC 9116 recommends less than a year");
  }
}
for (const f of fails) console.log("FAIL " + f);
for (const w of warns) console.log("WARN " + w);
if (fails.length === 0) console.log("ok " + file + ": " + (daysLeft === null ? "" : daysLeft + " day(s) to Expires"));
process.exit(fails.length ? 1 : 0);
'

read_file() { # read_file <file> [now]: runs the reader, sets $out and $rc
  set +e
  out=$(node -e "$READER" "$1" "$CANONICAL" "$WARN_DAYS" "$FAIL_DAYS" "${2-}" 2>&1)
  rc=$?
  set -e
}

tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
failures=0
pass() { echo "  ok   $1"; }
fail() { echo "  FAIL $1"; failures=$((failures + 1)); }
NOW=2026-10-22T12:00:00Z
GOOD_CONTACT='Contact: https://github.com/karero/croftweaver/security/advisories/new'
GOOD_CANON="Canonical: $CANONICAL"

# make NAME EXPIRES_OR_EMPTY [extra lines...]: a valid file, with Expires and extras swapped in.
make() {
  local name=$1 exp=$2; shift 2
  { echo "$GOOD_CONTACT"; [ -n "$exp" ] && echo "Expires: $exp"; echo "$GOOD_CANON"; for l in "$@"; do echo "$l"; done; } > "$tmp/$name"
}
# expect NAME fail|pass|warn WORDS: the reader's verdict on tmp/NAME at NOW, and a word in its output.
expect() {
  local name=$1 verdict=$2 words=${3-}
  read_file "$tmp/$name" "$NOW"
  case "$verdict" in
    fail) if [ "$rc" -ne 0 ] && grep -q "$words" <<<"$out"; then pass "$name fails ($words)"; else fail "$name should fail with '$words', got rc=$rc: $out"; fi ;;
    pass) if [ "$rc" -eq 0 ] && ! grep -q '^WARN' <<<"$out"; then pass "$name passes"; else fail "$name should pass without a warning, got rc=$rc: $out"; fi ;;
    warn) if [ "$rc" -eq 0 ] && grep -q "^WARN.*$words" <<<"$out"; then pass "$name passes with a warning ($words)"; else fail "$name should pass with a warning '$words', got rc=$rc: $out"; fi ;;
  esac
}

echo "security.txt check: the reader on hand-made files (now = $NOW)"
make good 2027-04-22T00:00:00Z;                                  expect good pass
make plus-mailto 2027-04-22T00:00:00Z 'Contact: mailto:security@croftweaver.com'; expect plus-mailto pass
make lower-z 2027-04-22t00:00:00z;                               expect lower-z pass
make offset 2027-04-22T02:00:00+02:00;                           expect offset pass
make days-31 2026-11-22T12:00:00Z;                               expect days-31 pass
make days-30 2026-11-21T12:00:00Z;                               expect days-30 warn "30 day"
make days-8 2026-10-30T12:00:00Z;                                expect days-8 warn "8 day"
make days-7 2026-10-29T12:00:00Z;                                expect days-7 fail "7 day"
make days-6 2026-10-29T11:59:59Z;                                expect days-6 fail "6 day"
make past 2026-10-22T11:59:59Z;                                  expect past fail "has passed"
make far 2028-10-22T00:00:00Z;                                   expect far warn "more than a year"
make no-expires "";                                              expect no-expires fail "exactly once"
make two-expires 2027-04-22T00:00:00Z 'Expires: 2027-05-22T00:00:00Z'; expect two-expires fail "exactly once"
make date-only 2027-04-22;                                       expect date-only fail "RFC 3339"
make not-a-date 2027-13-45T99:00:00Z;                            expect not-a-date fail "RFC 3339"
printf '%s\nExpires: 2027-04-22T00:00:00Z\n%s\n' 'Policy: https://croftweaver.com/support' "$GOOD_CANON" > "$tmp/no-contact"
expect no-contact fail "no Contact"
make http-contact 2027-04-22T00:00:00Z;                          sed -i.bak 's#Contact: https#Contact: http#' "$tmp/http-contact"; expect http-contact fail "Contact must be"
make bare-contact 2027-04-22T00:00:00Z 'Contact: security@croftweaver.com'; expect bare-contact fail "Contact must be"
printf '%s\nExpires: 2027-04-22T00:00:00Z\nCanonical: https://example.com/.well-known/security.txt\n' "$GOOD_CONTACT" > "$tmp/other-canonical"
expect other-canonical fail "no Canonical line equal"
printf '%s\nExpires: 2027-04-22T00:00:00Z\n' "$GOOD_CONTACT" > "$tmp/no-canonical"
expect no-canonical fail "no Canonical line equal"
make http-policy 2027-04-22T00:00:00Z 'Policy: http://croftweaver.com/support'; expect http-policy fail "policy must be an https"
make typo 2027-04-22T00:00:00Z 'Contct: https://example.com';    expect typo fail "does not define"
make no-space 2027-04-22T00:00:00Z 'Policy:https://croftweaver.com/support'; expect no-space fail "one space"
make comment-ok 2027-04-22T00:00:00Z '# a comment' '' ;           expect comment-ok pass
printf '%s\r\nExpires: 2027-04-22T00:00:00Z\r\n%s\r\n' "$GOOD_CONTACT" "$GOOD_CANON" > "$tmp/crlf"
expect crlf pass
read_file "$tmp/missing-file" "$NOW"
if [ "$rc" -ne 0 ] && grep -q "cannot be read" <<<"$out"; then pass "a missing file fails"; else fail "a missing file should fail, got rc=$rc: $out"; fi

if [ "$failures" -ne 0 ]; then
  echo "security.txt check: the reader itself is wrong ($failures case(s) above); not looking at the real file."
  exit 1
fi

echo "security.txt check: $FILE"
read_file "$FILE"
echo "  $out"
if [ "${GITHUB_ACTIONS:-}" = true ]; then
  grep '^WARN' <<<"$out" | sed 's/^WARN /::warning::security.txt: /' || true
fi
if [ "$rc" -ne 0 ]; then
  echo "security.txt check: failed. RFC 9116: https://www.rfc-editor.org/rfc/rfc9116" >&2
  exit 1
fi
echo "security.txt check: passed."
