// /security: where every dated fact on the page comes from. The page (src/pages/security.astro)
// renders each claim below as an item with data-claim="<id>", its source and the date it was read, and
// tests/check_security_page.sh holds the two to each other: each id, and each claim's kind, source and date.
// Rules, as for /compare (CONTENT_GUIDE.md):
// - a claim is a fact about croftweaver.com, about the Croftweaver site template, or about someone else's
//   product, and the page says which. Advice and reasoning are not claims and sit outside the claim's element;
// - `source` is one of three kinds: an https address (kind 'url', with a link text in `label`), a command a reader
//   can run (kind 'command'), or a file in this repository (kind 'file', path from the repository root, and `lines`
//   such as 'L216-L222' for the part that was read);
// - `read` is the day the source was read or the command was run, as ISO 8601; it may be at most one day ahead of
//   the check's UTC date. Each batch of sources has its own date below, so that re-reading one batch re-dates only it;
// - the check loads this file with the TypeScript compiler and compares each claim with the built page. The
//   file is transpiled on its own, so it may use constants and functions but must not import anything.
// To cut the dated PHP alert: delete the section #php-alert and the section #php-steps from the page (each has a
// PHP-DATED comment above it) and the claims of the "PHP alert" group below. Nothing else names the alert: the
// description, the share card, the first section, the "how this page was checked" section and public/llms.txt carry
// no mention of it, and the page, this file and tests/check_security_page.sh pass without them (tried on 2026-10-22).
// A reading says what a source says, not that it still says it: Cloudflare, W3Techs and the news pages change.
// Re-read a source before changing its date.

interface ClaimBase {
  id: string;
  source: string;
  /** More pages that say the same, each with its link text. */
  also?: { label: string; url: string }[];
  /** ISO date the source was read or the command was run. */
  read: string;
  /** For the results table (#own on the page): what was seen, and how it counts. Change these two lines when a check changes. */
  result?: string;
  status?: 'pass' | 'not yet' | 'optional';
}
export type Claim = ClaimBase &
  (
    | { kind: 'url'; label: string; lines?: undefined }
    | { kind: 'command'; label?: undefined; lines?: undefined }
    | { kind: 'file'; label?: undefined; lines?: string }
  );
export type ClaimKind = Claim['kind'];

// Files of this repository are linked at the commit they were read at, so the link shows what was read.
export const REPO_FILE_BASE = 'https://github.com/karero/croftweaver-site/blob/7b18dd7/';
/** 'L216-L222' as 'lines 216 to 222', 'L201' as 'line 201'. */
export function linesLabel(lines: string): string {
  const m = /^L(\d+)(?:-L(\d+))?$/.exec(lines);
  if (!m) throw new Error(`src/data/security.ts: "${lines}" is not a line range such as L12 or L12-L20.`);
  return m[2] ? `lines ${m[1]} to ${m[2]}` : `line ${m[1]}`;
}
/** The link to a file claim: the file at that commit, and the lines that were read. */
export function fileHref(source: string, lines?: string): string {
  return REPO_FILE_BASE + source + (lines ? `#${lines}` : '');
}

// One date per batch of sources.
const READ_NEWS = '2026-10-22'; // the PHP alert: CISA, php.net, the advisories, the news pages, W3Techs, the 2025 npm alert
const READ_CLOUDFLARE = '2026-10-22'; // Cloudflare's documentation
const READ_WORDPRESS = '2026-10-22'; // WordPress.org's pages
const READ_REPO = '2026-10-22'; // files and commands in croftweaver-site, the template and the toolkit
const READ_GITHUB_API = '2026-10-22'; // the GitHub API, for the main language of the 17 PHP systems' repositories
const READ_LIVE = '2026-10-22'; // commands run against the live site, and the results in #own
const READ_RFC = '2026-10-22'; // RFC 9116

const CISA = 'https://www.cisa.gov/news-events/alerts/2026/10/21/critical-vulnerabilities-php-require-immediate-patching';
const PHPNET = 'https://www.php.net/archive/2026.php#2026-10-21-5';
const PHPF = 'https://thephp.foundation/blog/2026/10/21/todays-php-security-release-and-how-were-strengthening-php-security/';
const KREBS = 'https://krebsonsecurity.com/2026/10/widespread-php-flaw-may-cause-many-site-outages-today/';
const RECORD = 'https://therecord.media/php-script-vulnerabilities-warnings';
const THN = 'https://thehackernews.com/2026/10/php-issues-emergency-patches-for-two.html';
const MALWAREBYTES = 'https://www.malwarebytes.com/blog/bugs/2026/10/php2shell-why-websites-are-going-offline-for-emergency-security-updates';
const NATIONAL = 'https://www.thenationalnews.com/future/technology/2026/10/21/php-security-issues-exploit/';
const WP_HARDENING = 'https://developer.wordpress.org/advanced-administration/security/hardening/';
const TOOLKIT_AT = 'https://github.com/karero/croftweaver/blob/3b8a6c5f';
const TEMPLATE_AT = 'https://github.com/karero/croftweaver/tree/3b8a6c5f/skills/new-website/templates/astro';

// The 17 PHP systems the page names: the name as shown, and the GitHub repository whose main language was read. The page
// lists the names (section #safer) and the command that proves them reads the repositories, both from this one list.
const PHP_SYSTEM_REPOS = [
  { name: 'WordPress', repo: 'WordPress/wordpress-develop' },
  { name: 'Drupal', repo: 'drupal/drupal' },
  { name: 'Joomla', repo: 'joomla/joomla-cms' },
  { name: 'Magento', repo: 'magento/magento2' },
  { name: 'TYPO3', repo: 'TYPO3/typo3' },
  { name: 'PrestaShop', repo: 'PrestaShop/PrestaShop' },
  { name: 'Shopware', repo: 'shopware/shopware' },
  { name: 'MediaWiki', repo: 'wikimedia/mediawiki' },
  { name: 'Moodle', repo: 'moodle/moodle' },
  { name: 'phpBB', repo: 'phpbb/phpbb' },
  { name: 'Nextcloud', repo: 'nextcloud/server' },
  { name: 'Craft CMS', repo: 'craftcms/cms' },
  { name: 'OpenCart', repo: 'opencart/opencart' },
  { name: 'Roundcube', repo: 'roundcube/roundcubemail' },
  { name: 'phpMyAdmin', repo: 'phpmyadmin/phpmyadmin' },
  { name: 'Laravel', repo: 'laravel/framework' },
  { name: 'Symfony', repo: 'symfony/symfony' },
];
export const PHP_SYSTEMS: string[] = PHP_SYSTEM_REPOS.map((s) => s.name);
const SYSTEMS = PHP_SYSTEM_REPOS.map((s) => s.repo).join(' ');

export const CLAIMS: Claim[] = [
  // ---- PHP alert: the dated panel (section #php-alert) and the PHP steps (section #php-steps) ----
  { id: 'cisa-patch', kind: 'url', source: CISA, label: 'CISA alert', read: READ_NEWS },
  { id: 'cisa-names-no-product', kind: 'url', source: CISA, label: 'CISA alert', read: READ_NEWS },
  { id: 'cisa-no-exploitation', kind: 'url', source: CISA, label: 'CISA alert', read: READ_NEWS },
  { id: 'cisa-steps', kind: 'url', source: CISA, label: 'CISA alert', read: READ_NEWS },
  { id: 'php-advisory', kind: 'url', source: PHPNET, label: 'php.net advisory', read: READ_NEWS },
  { id: 'php-old-versions', kind: 'url', source: PHPNET, label: 'php.net advisory', read: READ_NEWS },
  { id: 'ghsa-109618', kind: 'url', source: 'https://github.com/php/php-src/security/advisories/GHSA-w8hw-w9fx-j79w', label: 'GitHub advisory GHSA-w8hw-w9fx-j79w', read: READ_NEWS },
  { id: 'ghsa-109619', kind: 'url', source: 'https://github.com/php/php-src/security/advisories/GHSA-6wmf-4rv5-p3rp', label: 'GitHub advisory GHSA-6wmf-4rv5-p3rp', read: READ_NEWS },
  { id: 'reported-by', kind: 'url', source: PHPF, label: 'PHP Foundation', read: READ_NEWS },
  { id: 'wiz-demo', kind: 'url', source: 'https://www.wiz.io/blog/php2shell-php-rce', label: 'Wiz Research', read: READ_NEWS },
  { id: 'calif-demo', kind: 'url', source: 'https://calif.io/php2shell/', label: 'Calif', read: READ_NEWS },
  { id: 'cloudflare-attacks', kind: 'url', source: THN, label: 'The Hacker News', also: [{ label: 'Krebs on Security', url: KREBS }, { label: 'The Record', url: RECORD }], read: READ_NEWS },
  { id: 'watchtowr-attempts', kind: 'url', source: THN, label: 'The Hacker News', also: [{ label: 'The Record', url: RECORD }], read: READ_NEWS },
  { id: 'krebs-in-the-wild', kind: 'url', source: KREBS, label: 'Krebs on Security', read: READ_NEWS },
  { id: 'no-confirmed-breakin', kind: 'url', source: THN, label: 'The Hacker News', read: READ_NEWS },
  { id: 'offline-precaution', kind: 'url', source: RECORD, label: 'The Record', also: [{ label: 'The Hacker News', url: THN }, { label: 'The National', url: NATIONAL }, { label: 'Malwarebytes', url: MALWAREBYTES }], read: READ_NEWS },
  { id: 'php-not-wordpress-update', kind: 'url', source: MALWAREBYTES, label: 'Malwarebytes', also: [{ label: 'The Hacker News', url: THN }], read: READ_NEWS },

  // ---- PHP as a fact about systems, not news: stays when the dated alert is cut (section #safer) ----
  { id: 'php-share', kind: 'url', source: 'https://w3techs.com/technologies/details/pl-php', label: 'W3Techs', read: READ_NEWS },
  { id: 'php-systems-news', kind: 'url', source: KREBS, label: 'Krebs on Security', also: [{ label: 'Malwarebytes', url: MALWAREBYTES }], read: READ_NEWS },
  { id: 'php-systems-repos', kind: 'command', source: `for r in ${SYSTEMS}; do echo "$r $(curl -s https://api.github.com/repos/$r | grep '"language"')"; done`, read: READ_GITHUB_API },

  // ---- What runs: the Croftweaver template, croftweaver.com, and WordPress as its own documentation describes it ----
  { id: 'template-no-php', kind: 'command', source: "git clone https://github.com/karero/croftweaver && cd croftweaver && git checkout 3b8a6c5f && find skills/new-website/templates/astro -name '*.php' | wc -l", read: READ_REPO },
  { id: 'site-no-php', kind: 'command', source: "git clone https://github.com/karero/croftweaver-site && cd croftweaver-site && git ls-files | grep -c '\\.php$'", read: READ_REPO },
  { id: 'site-one-function', kind: 'file', source: 'functions/_middleware.ts', lines: 'L60-L74', read: READ_REPO },
  { id: 'template-two-functions', kind: 'url', source: `${TEMPLATE_AT}/functions`, label: 'the template at 3b8a6c5f', read: READ_REPO },
  { id: 'functions-all-requests', kind: 'url', source: 'https://developers.cloudflare.com/pages/functions/routing/', label: 'Cloudflare docs, Pages Functions routing', read: READ_CLOUDFLARE },
  { id: 'function-runs-on-static', kind: 'command', source: 'curl -sI https://main.croftweaver-site.pages.dev/favicon.svg | grep -i x-robots-tag', read: READ_LIVE },
  { id: 'wp-needs-php-db', kind: 'url', source: 'https://wordpress.org/about/requirements/', label: 'WordPress.org, requirements', read: READ_WORDPRESS },
  { id: 'wp-admin-login', kind: 'url', source: WP_HARDENING, label: 'WordPress.org, hardening WordPress', read: READ_WORDPRESS },
  { id: 'wp-updates', kind: 'url', source: WP_HARDENING, label: 'WordPress.org, hardening WordPress', read: READ_WORDPRESS },
  { id: 'wp-page-cache', kind: 'url', source: 'https://developer.wordpress.org/advanced-administration/performance/cache/', label: 'WordPress.org, caching', read: READ_WORDPRESS },
  { id: 'site-content-files', kind: 'command', source: 'git ls-files src/pages', read: READ_REPO },
  { id: 'site-no-login', kind: 'command', source: "git ls-files src/pages functions | grep -ciE 'admin|login'", read: READ_REPO },

  // ---- What Cloudflare handles (each claim is one page of Cloudflare's documentation) ----
  { id: 'cf-certs', kind: 'url', source: 'https://developers.cloudflare.com/ssl/edge-certificates/universal-ssl/', label: 'Cloudflare docs, Universal SSL (updated 14 August 2026)', read: READ_CLOUDFLARE },
  { id: 'cf-ddos', kind: 'url', source: 'https://developers.cloudflare.com/ddos-protection/', label: 'Cloudflare docs, DDoS protection (updated 14 August 2026)', read: READ_CLOUDFLARE },
  { id: 'cf-network', kind: 'url', source: 'https://developers.cloudflare.com/pages/', label: 'Cloudflare docs, Pages (updated 25 August 2026)', read: READ_CLOUDFLARE },
  { id: 'cf-pages-workers', kind: 'url', source: 'https://developers.cloudflare.com/pages/', label: 'Cloudflare docs, Pages (updated 25 August 2026)', read: READ_CLOUDFLARE },
  { id: 'cf-functions', kind: 'url', source: 'https://developers.cloudflare.com/workers/reference/security-model/', label: 'Cloudflare docs, Workers security model (updated 18 October 2026)', also: [{ label: 'How Workers works (updated 18 September 2026)', url: 'https://developers.cloudflare.com/workers/reference/how-workers-works/' }, { label: 'Pages Functions (updated 21 April 2026)', url: 'https://developers.cloudflare.com/pages/functions/' }], read: READ_CLOUDFLARE },
  { id: 'cf-preview', kind: 'url', source: 'https://developers.cloudflare.com/pages/configuration/preview-deployments/', label: 'Cloudflare docs, preview deployments (updated 12 October 2026)', read: READ_CLOUDFLARE },
  { id: 'cf-rollback', kind: 'url', source: 'https://developers.cloudflare.com/pages/', label: 'Cloudflare docs, Pages (updated 25 August 2026)', read: READ_CLOUDFLARE },
  { id: 'cf-2fa', kind: 'url', source: 'https://developers.cloudflare.com/fundamentals/user-profiles/2fa/', label: 'Cloudflare docs, two-factor authentication (updated 20 April 2026)', read: READ_CLOUDFLARE },
  { id: 'cf-dnssec', kind: 'url', source: 'https://developers.cloudflare.com/dns/dnssec/', label: 'Cloudflare docs, DNSSEC (updated 24 June 2026)', read: READ_CLOUDFLARE },
  { id: 'cf-caa', kind: 'url', source: 'https://developers.cloudflare.com/ssl/edge-certificates/caa-records/', label: 'Cloudflare docs, CAA records (updated 21 April 2026)', also: [{ label: 'Pages custom domains, known issues (updated 21 April 2026)', url: 'https://developers.cloudflare.com/pages/configuration/custom-domains/' }], read: READ_CLOUDFLARE },

  // ---- What the template and the toolkit set up, and what the owner switches on ----
  { id: 'template-headers', kind: 'url', source: `${TEMPLATE_AT}/public/_headers`, label: 'the template at 3b8a6c5f', read: READ_REPO },
  { id: 'site-headers', kind: 'file', source: 'public/_headers', lines: 'L7-L12', read: READ_REPO },
  { id: 'site-analytics', kind: 'command', source: "curl -s https://croftweaver.com/ | grep -o -E '<script[^>]*src=\"[^\"]*\"'; curl -s https://croftweaver.com/ | grep -c -i -E 'cloudflareinsights|beacon.min.js'", read: READ_LIVE },
  { id: 'toolkit-cloudflare-setup', kind: 'url', source: `${TOOLKIT_AT}/skills/new-website/scripts/cloudflare-setup.mjs#L45-L76`, label: 'the toolkit script cloudflare-setup.mjs at 3b8a6c5f', read: READ_REPO },
  { id: 'launch-dependabot', kind: 'url', source: `${TOOLKIT_AT}/skills/new-website/SKILL.md#L758`, label: 'the toolkit launch checklist at 3b8a6c5f', read: READ_REPO },
  { id: 'site-publish', kind: 'file', source: 'AGENTS.md', lines: 'L139-L145', read: READ_REPO },
  { id: 'site-publish-owner', kind: 'file', source: 'AGENTS.md', lines: 'L201', read: READ_REPO },
  { id: 'site-hsts', kind: 'file', source: 'README.md', lines: 'L216-L222', read: READ_REPO },
  { id: 'site-dashboard-switches', kind: 'file', source: 'README.md', lines: 'L216-L222', read: READ_REPO },
  { id: 'site-canonical-url', kind: 'file', source: 'README.md', lines: 'L11-L14', read: READ_REPO },
  { id: 'no-dnssec-caa-securitytxt-in-template', kind: 'url', source: TEMPLATE_AT, label: 'the template at 3b8a6c5f', read: READ_REPO },

  // ---- Facts for the checklist ----
  { id: 'site-audit', kind: 'command', source: 'npm audit', read: READ_REPO },
  { id: 'site-outdated', kind: 'command', source: 'npm outdated', read: READ_REPO },
  { id: 'toolkit-dependabot-ignores', kind: 'url', source: `${TOOLKIT_AT}/.github/dependabot.yml#L3-L17`, label: 'the toolkit Dependabot file at 3b8a6c5f', read: READ_REPO },
  { id: 'site-lockfile', kind: 'command', source: "git log -1 --format='%cI %s' -- package-lock.json", read: READ_REPO },
  { id: 'site-dependabot', kind: 'command', source: 'gh api repos/karero/croftweaver-site --jq .security_and_analysis.dependabot_security_updates.status; gh api -i repos/karero/croftweaver-site/vulnerability-alerts | head -1', read: READ_REPO },
  { id: 'site-dependabot-file', kind: 'url', source: 'https://github.com/karero/croftweaver-site/blob/9b38eda/.github/dependabot.yml#L7-L29', label: 'the Dependabot file of croftweaver-site at 9b38eda', read: READ_REPO },
  { id: 'site-renewal', kind: 'command', source: "whois croftweaver.com | grep -i 'registry expiry'", read: READ_LIVE },
  { id: 'npm-attacks', kind: 'url', source: 'https://www.cisa.gov/news-events/alerts/2025/09/23/widespread-supply-chain-compromise-impacting-npm-ecosystem', label: 'CISA alert, 23 September 2025', read: READ_NEWS },
  { id: 'site-csp-inline', kind: 'command', source: 'curl -sI https://croftweaver.com/ | grep -i content-security-policy', read: READ_LIVE },
  { id: 'rfc-9116', kind: 'url', source: 'https://www.rfc-editor.org/rfc/rfc9116', label: 'RFC 9116', read: READ_RFC },

  // ---- croftweaver.com's own results (#own on the page): update `result`, `status` and `read` from LIVE reads when a check changes ----
  // tests/check_security_page.sh fails while own-security-txt says "not yet" and public/.well-known/security.txt exists.
  // own-dnssec and own-security-txt were filled from live reads on 2026-10-22, after the DS record appeared and the file shipped.
  { id: 'own-headers', kind: 'command', source: 'curl -sI https://croftweaver.com/', read: READ_LIVE, status: 'pass', result: 'Pass. All five headers from the template are sent, and so is HSTS, which is a Cloudflare setting.' },
  { id: 'own-dnssec', kind: 'command', source: 'dig +short DS croftweaver.com', read: READ_LIVE, status: 'pass', result: 'Pass. The answer holds a key tag and algorithm 13, so DNSSEC is on for croftweaver.com.' },
  { id: 'own-caa', kind: 'command', source: 'dig +short CAA croftweaver.com', read: READ_LIVE, status: 'optional', result: 'Not set. CAA is optional, and a wrong record can stop a certificate from being issued.' },
  { id: 'own-security-txt', kind: 'command', source: 'curl -s https://croftweaver.com/.well-known/security.txt', read: READ_LIVE, status: 'pass', result: 'Pass. The file is served, and it holds a Contact and an Expires date.' },
];

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** "2026-10-22" as "22 October 2026". Plain arithmetic on the text, so no time zone or locale can change it. */
export function longDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) throw new Error(`src/data/security.ts: "${iso}" is not an ISO date (YYYY-MM-DD).`);
  return `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${m[1]}`;
}

export function claim(id: string): Claim {
  const c = CLAIMS.find((x) => x.id === id);
  if (!c) throw new Error(`src/data/security.ts has no claim "${id}"; the page asked for it.`);
  return c;
}

// The oldest and the newest day any claim was read. The page says "Read on D" when they are the same day and
// "Read from D1 to D2" when they differ, so a partial re-reading cannot make the page claim the newer date for everything.
const reads = CLAIMS.map((c) => c.read).sort();
export const READ_FIRST = reads[0] as string;
export const READ_LAST = reads[reads.length - 1] as string;
export function readPhrase(): string {
  return READ_FIRST === READ_LAST ? `Read on ${longDate(READ_FIRST)}` : `Read from ${longDate(READ_FIRST)} to ${longDate(READ_LAST)}`;
}
