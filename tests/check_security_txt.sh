#!/usr/bin/env bash
# Guard for public/.well-known/security.txt, the file RFC 9116 asks a site to publish so that
# someone who finds a security problem knows where to send it.
#
# What it checks, on the file in the repository (the build copies public/ into dist/ unchanged;
# the live copy is a separate look after each ship: `git log tests/check_security_txt.sh` says how):
#   - every line is a comment, blank, or "Field: value" with exactly one space after the colon
#     (the ABNF in RFC 9116 section 4), and the field is one the RFC defines (section 2.5);
#   - Contact (2.5.3): at least one, each an https URL, a mailto: or a tel: URI. Every https value
#     in the file is parsed with `new URL` and must have the protocol https: and a host, so
#     "https://[" and "https://" fail;
#   - Expires (2.5.5): exactly one, an RFC 3339 date-time whose parts are checked one by one (month
#     1 to 12, day up to the length of that month, leap years included, hour 0 to 23, minute 0 to 59,
#     second 0 to 60, where 60 is a leap second and counts as 59), and still in the future. The date
#     maths uses Date.UTC on those parts and not Date.parse, so no Node version can read a date
#     differently (CI uses Node 24, this was written on Node 26; Node 24 was not available to run it);
#   - Canonical (2.5.2): one of the lines is exactly SITE.url from src/config.ts plus
#     /.well-known/security.txt (the RFC says a file fetched from an address not listed there SHOULD
#     NOT be trusted); more than one Canonical line is allowed, as in the RFC's own example;
#   - Policy (2.5.7): an https URL; when it points at this site, its path is a route in tests/_helpers.ts
#     PAGES;
#   - Encryption (2.5.4): an https URL, a dns: URI or an openpgp4fpr: URI (all three are in the RFC's
#     examples); Hiring (2.5.6) and Acknowledgments (2.5.1): https URLs; Preferred-Languages (2.5.8):
#     language tags, at most once.
# On purpose, a file with a field the RFC does not define is rejected, and so is a clear-signed file
# (the RFC recommends a signature, section 2.3; this site does not sign): a typo such as "Contct:"
# must not pass. To allow another field or signing, add the field name to KNOWN in READER below
# and a rule for its value next to the others, and add self-test files for it.
#
# Time to Expires, as elapsed time and not as counted days: 30 days or less is a WARNING, 7 days or
# less is a FAILURE. Why not fail at 30: a red check blocks the pre-push hook, `npm run ship` and CI.
# CI skips this script for Dependabot's own pull requests so that a lapse cannot hold up a security
# update (.github/workflows/ci.yml), but that exemption covers pull requests only: an expired or
# 7-days-away file also holds up `npm run ship`, because the pre-push hook and the push-triggered CI
# run still check it. That delay is accepted. The failure message names the fix (edit Expires in
# public/.well-known/security.txt), and `git push --no-verify` skips the hook for one push. A lapse is
# found only when someone pushes: the site README's status table has the date to renew by.
#
# Before it looks at the real file it runs its own reader on about 70 hand-made files, covering
# the field rules above, each date part, both Expires limits one second either side, and its own
# matching helper. Needs bash and node. No network. It reads the file, src/config.ts and
# tests/_helpers.ts, and writes the hand-made files to a temporary folder.
set -euo pipefail
CDPATH= cd -- "$(dirname -- "$0")/.."

if ! command -v node >/dev/null 2>&1; then
  echo "security.txt check: node is not installed or not on PATH; it needs node for the date maths." >&2
  exit 1
fi

FILE=public/.well-known/security.txt
WARN_DAYS=30
FAIL_DAYS=7

# This site's address from src/config.ts (the first url: inside SITE), as tests/check_analytics_gate.sh reads its pins.
SITE_URL=$(awk '/^export const SITE = \{/{f=1} f && /^[[:space:]]*url:/{print; exit}' src/config.ts \
  | sed -nE "s/^[[:space:]]*url:[[:space:]]*['\"]([^'\"]*)['\"].*/\1/p")
if [ -z "$SITE_URL" ]; then
  echo "security.txt check: no url: '...' line inside SITE in src/config.ts to read the site address from." >&2
  exit 1
fi
# The routes of the site, from PAGES in tests/_helpers.ts, as a comma-separated list.
PAGES_CSV=$(awk '/^export const PAGES = \[/{f=1; next} f && /^\] as const/{exit} f' tests/_helpers.ts \
  | grep -oE "'/[^']*'" | tr -d "'" | paste -sd, -)
if [ -z "$PAGES_CSV" ]; then
  echo "security.txt check: no PAGES list found in tests/_helpers.ts." >&2
  exit 1
fi

# argv: file, site address, warn days, fail days, "now" as an ISO date-time ("" = the real now), routes (comma-separated).
# Prints "FAIL ...", "WARN ..." and one "ok ..." line; exits 1 if any FAIL.
READER='
const fs = require("node:fs");
const [file, site, warnDays, failDays, nowIso, routesCsv] = process.argv.slice(1);
const canonical = site + "/.well-known/security.txt";
const routes = routesCsv ? routesCsv.split(",") : [];
const DAY = 86400000;
const fails = [];
const warns = [];

// Date parts, one by one: Date.parse and Date.UTC both roll an impossible day over into the next month.
const daysIn = (y, m) => [31, (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1];
function parseRfc3339(v) {
  const m = /^(\d{4})-(\d{2})-(\d{2})[Tt](\d{2}):(\d{2}):(\d{2})(\.\d+)?(?:[Zz]|([+-])(\d{2}):(\d{2}))$/.exec(v);
  if (!m) return null;
  const [y, mo, d, h, mi, s] = m.slice(1, 7).map(Number);
  if (mo < 1 || mo > 12 || d < 1 || d > daysIn(y, mo) || h > 23 || mi > 59 || s > 60) return null;
  let offset = 0;
  if (m[8]) {
    const oh = Number(m[9]), om = Number(m[10]);
    if (oh > 23 || om > 59) return null;
    offset = (m[8] === "-" ? -1 : 1) * (oh * 60 + om);
  }
  // A leap second (second 60) counts as 59.
  return Date.UTC(y, mo - 1, d, h, mi, Math.min(s, 59)) + (m[7] ? Math.round(Number(m[7]) * 1000) : 0) - offset * 60000;
}
// A web address must be https with a host: new URL rejects "https://[" and "https://".
function httpsUrl(v) {
  try { const u = new URL(v); return u.protocol === "https:" && u.hostname !== "" ? u : null; } catch (e) { return null; }
}

const now = nowIso ? Date.parse(nowIso) : Date.now();
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

for (const c of all("contact")) {
  if (!(httpsUrl(c.value) || /^mailto:[^\s@]+@\S+$/.test(c.value) || /^tel:\+?[0-9-]+$/.test(c.value))) {
    fails.push("line " + c.line + ": Contact must be an https URL, a mailto: or a tel: URI: " + c.value);
  }
}
if (all("contact").length === 0) fails.push("no Contact line (RFC 9116 section 2.5.3: it MUST be present)");
for (const n of ["canonical", "acknowledgments", "hiring"]) {
  for (const f of all(n)) if (!httpsUrl(f.value)) fails.push("line " + f.line + ": " + n + " must be an https URL with a host: " + f.value);
}
for (const f of all("encryption")) {
  if (!(httpsUrl(f.value) || /^dns:\S+$/.test(f.value) || /^openpgp4fpr:[0-9A-Fa-f]{40,64}$/.test(f.value))) {
    fails.push("line " + f.line + ": encryption must be an https URL, a dns: URI or an openpgp4fpr: URI: " + f.value);
  }
}
for (const f of all("policy")) {
  const u = httpsUrl(f.value);
  if (!u) fails.push("line " + f.line + ": policy must be an https URL with a host: " + f.value);
  else if (u.origin === site && routes.length && !routes.includes(u.pathname.replace(/\/$/, "") || "/")) {
    fails.push("line " + f.line + ": policy " + u.pathname + " is not a page of this site (PAGES in tests/_helpers.ts)");
  }
}
const langs = all("preferred-languages");
if (langs.length > 1) fails.push("Preferred-Languages must not appear more than once (RFC 9116 section 2.5.8), found " + langs.length);
for (const f of langs) {
  if (!/^[A-Za-z]{2,8}(-[A-Za-z0-9]{1,8})*(\s*,\s*[A-Za-z]{2,8}(-[A-Za-z0-9]{1,8})*)*$/.test(f.value)) {
    fails.push("line " + f.line + ": Preferred-Languages must be language tags separated by commas: " + f.value);
  }
}
if (!all("canonical").some((f) => f.value === canonical)) {
  fails.push("no Canonical line equal to " + canonical + " (SITE.url in src/config.ts plus /.well-known/security.txt)");
}

const expires = all("expires");
let daysLeft = null;
if (expires.length !== 1) {
  fails.push("Expires must appear exactly once (RFC 9116 section 2.5.5), found " + expires.length);
} else {
  const v = expires[0].value;
  const when = parseRfc3339(v);
  if (when === null) {
    fails.push("line " + expires[0].line + ": Expires is not a real RFC 3339 date-time such as 2027-04-22T00:00:00Z: " + v);
  } else {
    const msLeft = when - now;
    daysLeft = Math.floor(msLeft / DAY);
    const renew = "edit Expires in " + file + " to a date about six months ahead";
    if (msLeft <= 0) fails.push("Expires " + v + " has passed: " + renew);
    else if (msLeft <= Number(failDays) * DAY) fails.push("Expires " + v + " is " + daysLeft + " day(s) away (fails at " + failDays + " days or less): " + renew);
    else if (msLeft <= Number(warnDays) * DAY) warns.push("Expires " + v + " is " + daysLeft + " day(s) away (warns at " + warnDays + " days or less): " + renew);
    if (msLeft > 366 * DAY) warns.push("Expires is more than a year away; RFC 9116 recommends less than a year");
  }
}
for (const f of fails) console.log("FAIL " + f);
for (const w of warns) console.log("WARN " + w);
if (fails.length === 0) console.log("ok " + file + ": " + (daysLeft === null ? "" : daysLeft + " day(s) to Expires"));
process.exit(fails.length ? 1 : 0);
'

read_file() { # read_file <file> [now]: runs the reader, sets $out and $rc
  set +e
  out=$(node -e "$READER" "$1" "$SITE_URL" "$WARN_DAYS" "$FAIL_DAYS" "${2-}" "$PAGES_CSV" 2>&1)
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
GOOD_CANON="Canonical: $SITE_URL/.well-known/security.txt"

# has TEXT WORDS: WORDS appear in TEXT as plain text, never as a pattern (a "." or "(" is itself).
has() { grep -qF -- "$2" <<<"$1"; }

# make NAME EXPIRES_OR_EMPTY [extra lines...]: a valid file, with Expires and extras swapped in.
make() {
  local name=$1 exp=$2; shift 2
  { echo "$GOOD_CONTACT"; if [ -n "$exp" ]; then echo "Expires: $exp"; fi; echo "$GOOD_CANON"; for l in "$@"; do echo "$l"; done; } > "$tmp/$name"
}
# expect NAME fail|pass|warn WORDS: the reader's verdict on tmp/NAME at NOW, and the words in its output.
expect() {
  local name=$1 verdict=$2 words=${3-} warns
  read_file "$tmp/$name" "$NOW"
  warns=$(grep '^WARN' <<<"$out" || true)
  case "$verdict" in
    fail) if [ "$rc" -ne 0 ] && has "$out" "$words"; then pass "$name fails ($words)"; else fail "$name should fail with '$words', got rc=$rc: $out"; fi ;;
    pass) if [ "$rc" -eq 0 ] && [ -z "$warns" ]; then pass "$name passes"; else fail "$name should pass without a warning, got rc=$rc: $out"; fi ;;
    warn) if [ "$rc" -eq 0 ] && has "$warns" "$words"; then pass "$name passes with a warning ($words)"; else fail "$name should pass with a warning '$words', got rc=$rc: $out"; fi ;;
  esac
}
# raw NAME CONTENT...: a file written line by line exactly as given, for files that are not "a valid file with one change".
raw() { local name=$1; shift; printf '%s\n' "$@" > "$tmp/$name"; }

echo "security.txt check: the reader on hand-made files (now = $NOW, site = $SITE_URL)"
echo " the helper that matches words"
if has "abcd" "ab.d"; then fail "has treats . as a pattern"; else pass "has: 'ab.d' does not match 'abcd'"; fi
if has "a.b" "a.b"; then pass "has: 'a.b' matches 'a.b'"; else fail "has should match a.b"; fi
if has "x -y z" "-y"; then pass "has: a word starting with - is a word"; else fail "has should accept a leading dash"; fi
if has "42 day(s)" "(s)"; then pass "has: parentheses are plain"; else fail "has should match (s)"; fi

echo " valid files"
make good 2027-04-22T00:00:00Z;                                  expect good pass
make plus-mailto 2027-04-22T00:00:00Z 'Contact: mailto:security@croftweaver.com'; expect plus-mailto pass
make tel-contact 2027-04-22T00:00:00Z 'Contact: tel:+49-89-1234567'; expect tel-contact pass
make lower-tz 2027-04-22t00:00:00z;                              expect lower-tz pass
make offset 2027-04-22T02:00:00+02:00;                           expect offset pass
make fraction 2027-04-22T00:00:00.250Z;                          expect fraction pass
make leap-second 2027-06-30T23:59:60Z;                           expect leap-second pass
make comment-ok 2027-04-22T00:00:00Z '# a comment' '' ;          expect comment-ok pass
make policy-route 2027-04-22T00:00:00Z 'Policy: https://croftweaver.com/support'; expect policy-route pass
make policy-elsewhere 2027-04-22T00:00:00Z 'Policy: https://example.org/policy'; expect policy-elsewhere pass
make enc-https 2027-04-22T00:00:00Z 'Encryption: https://croftweaver.com/pgp-key.txt'; expect enc-https pass
make enc-dns 2027-04-22T00:00:00Z 'Encryption: dns:5d2d37ab76d47d36._openpgpkey.croftweaver.com?type=OPENPGPKEY'; expect enc-dns pass
make enc-fpr 2027-04-22T00:00:00Z 'Encryption: openpgp4fpr:5f2de5521c63a801ab59ccb603d49de44b29100f'; expect enc-fpr pass
make hiring-https 2027-04-22T00:00:00Z 'Hiring: https://croftweaver.com/about'; expect hiring-https pass
make ack-https 2027-04-22T00:00:00Z 'Acknowledgments: https://croftweaver.com/thanks'; expect ack-https pass
make langs-ok 2027-04-22T00:00:00Z 'Preferred-Languages: en, de, pt-BR'; expect langs-ok pass
make two-canonicals-one-right 2027-04-22T00:00:00Z 'Canonical: https://www.croftweaver.com/.well-known/security.txt'; expect two-canonicals-one-right pass
make same-canonical-twice 2027-04-22T00:00:00Z "$GOOD_CANON"; expect same-canonical-twice pass
printf '%s\r\nExpires: 2027-04-22T00:00:00Z\r\n%s\r\n' "$GOOD_CONTACT" "$GOOD_CANON" > "$tmp/crlf"; expect crlf pass

echo " Expires: both limits, one second either side (now = $NOW)"
make days-31 2026-11-22T12:00:00Z;                               expect days-31 pass
make d30-plus-1s 2026-11-21T12:00:01Z;                           expect d30-plus-1s pass
make days-30 2026-11-21T12:00:00Z;                               expect days-30 warn "30 day"
make d30-minus-1s 2026-11-21T11:59:59Z;                          expect d30-minus-1s warn "29 day"
make d7-plus-1s 2026-10-29T12:00:01Z;                            expect d7-plus-1s warn "7 day"
make days-7 2026-10-29T12:00:00Z;                                expect days-7 fail "7 day"
make days-6 2026-10-29T11:59:59Z;                                expect days-6 fail "6 day"
make past 2026-10-22T11:59:59Z;                                  expect past fail "has passed"
make now-exactly 2026-10-22T12:00:00Z;                           expect now-exactly fail "has passed"
make far 2028-10-22T00:00:00Z;                                   expect far warn "more than a year"
make fix-named 2026-10-25T00:00:00Z;                             expect fix-named fail "edit Expires"

echo " Expires: the parts of a date"
make feb30 2027-02-30T00:00:00Z;                                 expect feb30 fail "real RFC 3339"
make sep31 2027-09-31T00:00:00Z;                                 expect sep31 fail "real RFC 3339"
make feb29-not-leap 2027-02-29T00:00:00Z;                        expect feb29-not-leap fail "real RFC 3339"
make feb29-2100 2100-02-29T00:00:00Z;                            expect feb29-2100 fail "real RFC 3339"
make feb29-leap 2028-02-29T00:00:00Z;                            expect feb29-leap warn "more than a year"
make hour24 2027-04-22T24:00:00Z;                                expect hour24 fail "real RFC 3339"
make minute60 2027-04-22T12:60:00Z;                              expect minute60 fail "real RFC 3339"
make second61 2027-04-22T12:00:61Z;                              expect second61 fail "real RFC 3339"
make month13 2027-13-01T00:00:00Z;                               expect month13 fail "real RFC 3339"
make month00 2027-00-10T00:00:00Z;                               expect month00 fail "real RFC 3339"
make day32 2027-01-32T00:00:00Z;                                 expect day32 fail "real RFC 3339"
make day00 2027-01-00T00:00:00Z;                                 expect day00 fail "real RFC 3339"
make offset24 2027-04-22T00:00:00+24:00;                         expect offset24 fail "real RFC 3339"
make date-only 2027-04-22;                                       expect date-only fail "real RFC 3339"
make not-a-date 2027-13-45T99:00:00Z;                            expect not-a-date fail "real RFC 3339"
make no-expires "";                                              expect no-expires fail "exactly once"
make two-expires 2027-04-22T00:00:00Z 'Expires: 2027-05-22T00:00:00Z'; expect two-expires fail "exactly once"

echo " addresses and fields"
raw no-contact 'Policy: https://croftweaver.com/support' 'Expires: 2027-04-22T00:00:00Z' "$GOOD_CANON"
expect no-contact fail "no Contact"
make http-contact 2027-04-22T00:00:00Z;                          sed -i.bak 's#Contact: https#Contact: http#' "$tmp/http-contact"; expect http-contact fail "Contact must be"
make bare-contact 2027-04-22T00:00:00Z 'Contact: security@croftweaver.com'; expect bare-contact fail "Contact must be"
make bad-tel 2027-04-22T00:00:00Z 'Contact: tel:call-me'; expect bad-tel fail "Contact must be"
make bracket-contact 2027-04-22T00:00:00Z 'Contact: https://['; expect bracket-contact fail "Contact must be"
make empty-host-contact 2027-04-22T00:00:00Z 'Contact: https://'; expect empty-host-contact fail "Contact must be"
make bracket-policy 2027-04-22T00:00:00Z 'Policy: https://['; expect bracket-policy fail "policy must be an https URL"
make empty-host-policy 2027-04-22T00:00:00Z 'Policy: https://'; expect empty-host-policy fail "policy must be an https URL"
make http-policy 2027-04-22T00:00:00Z 'Policy: http://croftweaver.com/support'; expect http-policy fail "policy must be an https"
make policy-not-a-page 2027-04-22T00:00:00Z 'Policy: https://croftweaver.com/no-such-page'; expect policy-not-a-page fail "not a page of this site"
raw other-canonical "$GOOD_CONTACT" 'Expires: 2027-04-22T00:00:00Z' 'Canonical: https://example.com/.well-known/security.txt'
expect other-canonical fail "no Canonical line equal"
raw no-canonical "$GOOD_CONTACT" 'Expires: 2027-04-22T00:00:00Z'
expect no-canonical fail "no Canonical line equal"
make bracket-canonical 2027-04-22T00:00:00Z 'Canonical: https://['; expect bracket-canonical fail "canonical must be an https URL"
make http-enc 2027-04-22T00:00:00Z 'Encryption: http://croftweaver.com/pgp-key.txt'; expect http-enc fail "encryption must be"
make key-in-enc 2027-04-22T00:00:00Z 'Encryption: -----BEGIN PGP PUBLIC KEY BLOCK-----'; expect key-in-enc fail "encryption must be"
make short-fpr 2027-04-22T00:00:00Z 'Encryption: openpgp4fpr:abcd'; expect short-fpr fail "encryption must be"
make http-hiring 2027-04-22T00:00:00Z 'Hiring: http://croftweaver.com/about'; expect http-hiring fail "hiring must be"
make langs-twice 2027-04-22T00:00:00Z 'Preferred-Languages: en' 'Preferred-Languages: de'; expect langs-twice fail "more than once"
make langs-bad 2027-04-22T00:00:00Z 'Preferred-Languages: en,'; expect langs-bad fail "language tags"
make typo 2027-04-22T00:00:00Z 'Contct: https://example.com';    expect typo fail "does not define"
make no-space 2027-04-22T00:00:00Z 'Policy:https://croftweaver.com/support'; expect no-space fail "one space"
raw clear-signed '-----BEGIN PGP SIGNED MESSAGE-----' 'Hash: SHA512' '' "$GOOD_CONTACT" 'Expires: 2027-04-22T00:00:00Z' "$GOOD_CANON" '-----BEGIN PGP SIGNATURE-----'
expect clear-signed fail "is not"
read_file "$tmp/missing-file" "$NOW"
if [ "$rc" -ne 0 ] && has "$out" "cannot be read"; then pass "a missing file fails"; else fail "a missing file should fail, got rc=$rc: $out"; fi

if [ "$failures" -ne 0 ]; then
  echo "security.txt check: the reader itself is wrong ($failures case(s) above); not looking at the real file."
  exit 1
fi

echo "security.txt check: $FILE (site $SITE_URL)"
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
