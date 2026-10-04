// Proof strip on the home page: Google PageSpeed Insights, mobile test, home page of
// each site. Every figure is per named site and dated (CONTENT_GUIDE.md, honesty
// rules). One run each, lab data. Re-measure all three before changing the date.
export const PROOF_MEASURED = { iso: '2026-10-04', label: '4 October 2026' } as const;

export const PROOF = [
  { site: 'genai-wednesday.de', url: 'https://genai-wednesday.de/', performance: 99, accessibility: 100, bestPractices: 100, seo: 100 },
  { site: 'm-squad.com', url: 'https://m-squad.com/', performance: 99, accessibility: 100, bestPractices: 100, seo: 100 },
  { site: 'apreet.com', url: 'https://apreet.com/', performance: 100, accessibility: 100, bestPractices: 100, seo: 100 },
] as const;
