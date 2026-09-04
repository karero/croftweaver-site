import { defineConfig, devices } from '@playwright/test';
import { SITE } from './src/config';

// One preview port per site, derived from SITE.url, so two sites on this machine
// never test against each other's server. Deliberately stable (same site → same
// port) rather than random: the port appears in baseURL and in error messages.
// Range 4330–4999 (skips 4321, astro dev's default). FNV-1a, 32-bit.
function portFor(key: string): number {
  let h = 2166136261;
  for (const ch of key) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return 4330 + (h % 670);
}
const PORT = portFor(SITE.url);
const BASE = `http://localhost:${PORT}`;

// Tests run against a PRODUCTION build served by `astro preview` — the same static
// output Cloudflare serves. Never test a dev mock of the thing you ship.
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: { baseURL: BASE, trace: 'on-first-retry' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `npm run build && npm run preview -- --port ${PORT}`,
    url: `${BASE}/`,
    timeout: 120_000,
    // Never reuse a server that already holds the port. Reuse skips the build and
    // runs the tests against whatever is listening — a stale build of this site, or
    // an orphaned preview of a different one on this machine.
    reuseExistingServer: false,
  },
});
