// /security: where every dated fact on the page comes from. The page (src/pages/security.astro)
// renders each claim below as an item with data-claim="<id>", its source and the date it was read, and
// tests/check_security_page.sh holds the two to each other. Rules, as for /compare (CONTENT_GUIDE.md):
// - a claim is a fact about croftweaver.com, about the Croftweaver site template, or about someone else's
//   product, and the page says which. Advice and reasoning are not claims and are not listed here;
// - `source` is one of three kinds: an https address (kind 'url'), a command a reader can run (kind
//   'command'), or a file in this repository (kind 'file', path from the repository root);
// - `read` is the day the source was read or the command was run, as ISO 8601; it may not be in the future;
// - this file is flat data: one object per claim, opened on its own line with the id as its first key, because
//   tests/check_security_page.sh reads the ids from those lines with a regular expression. Keep that shape.
// Cutting the dated PHP panel (section #php-alert) and the PHP steps (#php-steps): delete those two sections
// from the page and the claims marked "PHP alert" below, and nothing else needs to change.
// A reading says what a source says, not that it still says it: Cloudflare, W3Techs and the news pages change.
// Re-read a source before changing its date.

export type ClaimKind = 'url' | 'command' | 'file';

export interface Claim {
  id: string;
  kind: ClaimKind;
  source: string;
  /** Link text for a 'url' source. */
  label?: string;
  /** More pages that say the same, each with its link text. */
  also?: { label: string; url: string }[];
  /** ISO date the source was read or the command was run. */
  read: string;
  /** For the results table (#own on the page): what was seen, and how it counts. Change these two lines when a check changes. */
  result?: string;
  status?: 'pass' | 'not yet' | 'optional';
}

// Files of this repository are linked at the commit they were read at, so the link shows what was read.
export const REPO_FILE_BASE = 'https://github.com/karero/croftweaver-site/blob/7b18dd7/';

const D = '2026-10-22';
const CISA = 'https://www.cisa.gov/news-events/alerts/2026/10/21/critical-vulnerabilities-php-require-immediate-patching';
const PHPNET = 'https://www.php.net/archive/2026.php#2026-10-21-5';
const PHPF = 'https://thephp.foundation/blog/2026/10/21/todays-php-security-release-and-how-were-strengthening-php-security/';
const KREBS = 'https://krebsonsecurity.com/2026/10/widespread-php-flaw-may-cause-many-site-outages-today/';
const RECORD = 'https://therecord.media/php-script-vulnerabilities-warnings';
const THN = 'https://thehackernews.com/2026/10/php-issues-emergency-patches-for-two.html';
const MALWAREBYTES = 'https://www.malwarebytes.com/blog/bugs/2026/10/php2shell-why-websites-are-going-offline-for-emergency-security-updates';
const NATIONAL = 'https://www.thenationalnews.com/future/technology/2026/10/21/php-security-issues-exploit/';
const WP_HARDENING = 'https://developer.wordpress.org/advanced-administration/security/hardening/';
const TEMPLATE_AT = 'https://github.com/karero/croftweaver/tree/3b8a6c5f/skills/new-website/templates/astro';

const SYSTEMS =
  'WordPress/wordpress-develop drupal/drupal joomla/joomla-cms magento/magento2 TYPO3/typo3 PrestaShop/PrestaShop ' +
  'shopware/shopware wikimedia/mediawiki moodle/moodle phpbb/phpbb nextcloud/server craftcms/cms opencart/opencart ' +
  'roundcube/roundcubemail phpmyadmin/phpmyadmin laravel/framework symfony/symfony';

export const CLAIMS: Claim[] = [
  // ---- PHP alert: the dated panel (section #php-alert) and the PHP steps (section #php-steps) ----
  { id: 'cisa-patch', kind: 'url', source: CISA, label: 'CISA alert', read: D },
  { id: 'cisa-no-exploitation', kind: 'url', source: CISA, label: 'CISA alert', read: D },
  { id: 'cisa-steps', kind: 'url', source: CISA, label: 'CISA alert', read: D },
  { id: 'php-advisory', kind: 'url', source: PHPNET, label: 'php.net advisory', read: D },
  { id: 'php-old-versions', kind: 'url', source: PHPNET, label: 'php.net advisory', read: D },
  { id: 'ghsa-109618', kind: 'url', source: 'https://github.com/php/php-src/security/advisories/GHSA-w8hw-w9fx-j79w', label: 'GitHub advisory GHSA-w8hw-w9fx-j79w', read: D },
  { id: 'ghsa-109619', kind: 'url', source: 'https://github.com/php/php-src/security/advisories/GHSA-6wmf-4rv5-p3rp', label: 'GitHub advisory GHSA-6wmf-4rv5-p3rp', read: D },
  { id: 'reported-by', kind: 'url', source: PHPF, label: 'PHP Foundation', read: D },
  { id: 'wiz-demo', kind: 'url', source: 'https://www.wiz.io/blog/php2shell-php-rce', label: 'Wiz Research', read: D },
  { id: 'calif-demo', kind: 'url', source: 'https://calif.io/php2shell/', label: 'Calif', read: D },
  { id: 'cloudflare-attacks', kind: 'url', source: THN, label: 'The Hacker News', also: [{ label: 'Krebs on Security', url: KREBS }, { label: 'The Record', url: RECORD }], read: D },
  { id: 'watchtowr-attempts', kind: 'url', source: THN, label: 'The Hacker News', also: [{ label: 'The Record', url: RECORD }], read: D },
  { id: 'krebs-in-the-wild', kind: 'url', source: KREBS, label: 'Krebs on Security', read: D },
  { id: 'no-confirmed-breakin', kind: 'url', source: THN, label: 'The Hacker News', read: D },
  { id: 'offline-precaution', kind: 'url', source: RECORD, label: 'The Record', also: [{ label: 'The Hacker News', url: THN }, { label: 'The National', url: NATIONAL }, { label: 'Malwarebytes', url: MALWAREBYTES }], read: D },
  { id: 'php-not-wordpress-update', kind: 'url', source: MALWAREBYTES, label: 'Malwarebytes', also: [{ label: 'The Hacker News', url: THN }], read: D },

  // ---- PHP as a fact about systems, not news: stays when the dated panel is cut (section #safer) ----
  { id: 'php-share', kind: 'url', source: 'https://w3techs.com/technologies/details/pl-php', label: 'W3Techs', read: D },
  { id: 'php-systems-news', kind: 'url', source: KREBS, label: 'Krebs on Security', also: [{ label: 'Malwarebytes', url: MALWAREBYTES }], read: D },
  { id: 'php-systems-repos', kind: 'command', source: `for r in ${SYSTEMS}; do echo "$r $(curl -s https://api.github.com/repos/$r | grep '"language"')"; done`, read: D },

  // ---- What runs: the Croftweaver template, croftweaver.com, and WordPress as its own documentation describes it ----
  { id: 'template-no-php', kind: 'command', source: "git clone https://github.com/karero/croftweaver && cd croftweaver && git checkout 3b8a6c5f && find skills/new-website/templates/astro -name '*.php' | wc -l", read: D },
  { id: 'site-no-php', kind: 'command', source: "git clone https://github.com/karero/croftweaver-site && cd croftweaver-site && git ls-files | grep -c '\\.php$'", read: D },
  { id: 'site-one-function', kind: 'file', source: 'functions/_middleware.ts', read: D },
  { id: 'template-two-functions', kind: 'url', source: `${TEMPLATE_AT}/functions`, label: 'the template at 3b8a6c5f', read: D },
  { id: 'functions-all-requests', kind: 'url', source: 'https://developers.cloudflare.com/pages/functions/routing/', label: 'Cloudflare docs, Pages Functions routing', read: D },
  { id: 'function-runs-on-static', kind: 'command', source: 'curl -sI https://main.croftweaver-site.pages.dev/favicon.svg | grep -i x-robots-tag', read: D },
  { id: 'wp-needs-php-db', kind: 'url', source: 'https://wordpress.org/about/requirements/', label: 'WordPress.org, requirements', read: D },
  { id: 'wp-admin-login', kind: 'url', source: WP_HARDENING, label: 'WordPress.org, hardening WordPress', read: D },
  { id: 'wp-updates', kind: 'url', source: WP_HARDENING, label: 'WordPress.org, hardening WordPress', read: D },
  { id: 'site-content-files', kind: 'command', source: 'git ls-files src/pages', read: D },
  { id: 'site-no-login', kind: 'command', source: "git ls-files src/pages functions | grep -ciE 'admin|login'", read: D },

  // ---- What Cloudflare handles (each claim is one page of Cloudflare's documentation) ----
  { id: 'cf-certs', kind: 'url', source: 'https://developers.cloudflare.com/ssl/edge-certificates/universal-ssl/', label: 'Cloudflare docs, Universal SSL (updated 14 August 2026)', read: D },
  { id: 'cf-ddos', kind: 'url', source: 'https://developers.cloudflare.com/ddos-protection/', label: 'Cloudflare docs, DDoS protection (updated 14 August 2026)', read: D },
  { id: 'cf-network', kind: 'url', source: 'https://developers.cloudflare.com/pages/', label: 'Cloudflare docs, Pages (updated 25 August 2026)', read: D },
  { id: 'cf-functions', kind: 'url', source: 'https://developers.cloudflare.com/workers/reference/security-model/', label: 'Cloudflare docs, Workers security model (updated 18 October 2026)', also: [{ label: 'How Workers works (updated 18 September 2026)', url: 'https://developers.cloudflare.com/workers/reference/how-workers-works/' }, { label: 'Pages Functions (updated 21 April 2026)', url: 'https://developers.cloudflare.com/pages/functions/' }], read: D },
  { id: 'cf-preview', kind: 'url', source: 'https://developers.cloudflare.com/pages/configuration/preview-deployments/', label: 'Cloudflare docs, preview deployments (updated 12 October 2026)', read: D },
  { id: 'cf-rollback', kind: 'url', source: 'https://developers.cloudflare.com/pages/', label: 'Cloudflare docs, Pages (updated 25 August 2026)', read: D },
  { id: 'cf-2fa', kind: 'url', source: 'https://developers.cloudflare.com/fundamentals/user-profiles/2fa/', label: 'Cloudflare docs, two-factor authentication (updated 20 April 2026)', read: D },
  { id: 'cf-dnssec', kind: 'url', source: 'https://developers.cloudflare.com/dns/dnssec/', label: 'Cloudflare docs, DNSSEC (updated 24 June 2026)', read: D },
  { id: 'cf-caa', kind: 'url', source: 'https://developers.cloudflare.com/ssl/edge-certificates/caa-records/', label: 'Cloudflare docs, CAA records (updated 21 April 2026)', also: [{ label: 'Pages custom domains, known issues (updated 21 April 2026)', url: 'https://developers.cloudflare.com/pages/configuration/custom-domains/' }], read: D },

  // ---- What the template sets up, and what the owner switches on ----
  { id: 'template-headers', kind: 'url', source: `${TEMPLATE_AT}/public/_headers`, label: 'the template at 3b8a6c5f', read: D },
  { id: 'site-headers', kind: 'file', source: 'public/_headers', read: D },
  { id: 'site-hsts', kind: 'file', source: 'README.md', read: D },
  { id: 'site-dashboard-switches', kind: 'file', source: 'README.md', read: D },
  { id: 'no-dnssec-caa-securitytxt-in-template', kind: 'url', source: TEMPLATE_AT, label: 'the template at 3b8a6c5f', read: D },
  { id: 'launch-dependabot', kind: 'url', source: 'https://github.com/karero/croftweaver/blob/3b8a6c5f/skills/new-website/SKILL.md#L758', label: 'the toolkit launch checklist at 3b8a6c5f', read: D },
  { id: 'site-publish', kind: 'file', source: 'AGENTS.md', read: D },

  // ---- Facts for the checklist ----
  { id: 'site-audit', kind: 'command', source: 'npm audit', read: D },
  { id: 'site-outdated', kind: 'command', source: 'npm outdated', read: D },
  { id: 'site-lockfile', kind: 'command', source: "git log -1 --format='%cI %s' -- package-lock.json", read: D },
  { id: 'site-dependabot', kind: 'command', source: 'gh api repos/karero/croftweaver-site --jq .security_and_analysis', read: D },
  { id: 'site-renewal', kind: 'command', source: "whois croftweaver.com | grep -i 'registry expiry'", read: D },
  { id: 'npm-attacks', kind: 'url', source: 'https://www.cisa.gov/news-events/alerts/2025/09/23/widespread-supply-chain-compromise-impacting-npm-ecosystem', label: 'CISA alert, 23 September 2025', read: D },
  { id: 'site-csp-inline', kind: 'command', source: 'curl -sI https://croftweaver.com/ | grep -i content-security-policy', read: D },
  { id: 'rfc-9116', kind: 'url', source: 'https://www.rfc-editor.org/rfc/rfc9116', label: 'RFC 9116', read: D },

  // ---- croftweaver.com's own results (#own on the page): change `result` and `status`, and `read`, when a check changes ----
  { id: 'own-headers', kind: 'command', source: 'curl -sI https://croftweaver.com/', read: D, status: 'pass', result: 'Pass. All five headers from the template are sent, and so is HSTS, which is a Cloudflare setting.' },
  { id: 'own-dnssec', kind: 'command', source: 'dig +short DS croftweaver.com', read: D, status: 'not yet', result: 'Not yet. The answer is empty, so DNSSEC is not on for croftweaver.com.' },
  { id: 'own-caa', kind: 'command', source: 'dig +short CAA croftweaver.com', read: D, status: 'optional', result: 'Not set. CAA is optional, and a wrong record can stop the certificate from renewing.' },
  { id: 'own-security-txt', kind: 'command', source: 'curl -s https://croftweaver.com/.well-known/security.txt', read: D, status: 'not yet', result: 'Not yet. The file goes live with a separate change that is published first.' },
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

// The date the page says its facts were read: the latest `read` of any claim.
export const LATEST_READ = CLAIMS.map((c) => c.read).sort().at(-1) as string;

// The 17 systems of the panel, in the order the page names them, from the same list the command reads.
export const PHP_SYSTEMS = [
  'WordPress', 'Drupal', 'Joomla', 'Magento', 'TYPO3', 'PrestaShop', 'Shopware', 'MediaWiki', 'Moodle', 'phpBB',
  'Nextcloud', 'Craft CMS', 'OpenCart', 'Roundcube', 'phpMyAdmin', 'Laravel', 'Symfony',
] as const;
