# PageSpeed Insights, mobile, home pages, 19 November 2026

One run for each of three sites, started together in the browser at https://pagespeed.web.dev/
(Mobile tab), because the PageSpeed API had used up its daily quota (HTTP 429). Each report
page, read again at 19:40 UTC the same day, says "Captured at Nov 19, 2026, 8:35 PM GMT+1",
"Emulated Moto G Power with Lighthouse 13.6.0" and "HeadlessChromium 157.0.8103.38".

| Site | Report from | Report | Performance | Accessibility | Best Practices | SEO | Agentic Browsing |
|---|---|---|---|---|---|---|---|
| https://genai-wednesday.de/ | Nov 19, 2026, 8:35:46 PM (GMT+1) | https://pagespeed.web.dev/analysis/https-genai-wednesday-de/u1vnw1sue0?form_factor=mobile | 100 | 100 | 100 | 100 | 3/3 |
| https://m-squad.com/ | Nov 19, 2026, 8:35:46 PM (GMT+1) | https://pagespeed.web.dev/analysis/https-m-squad-com/iiguago78w?form_factor=mobile | 100 | 100 | 100 | 100 | 3/3 |
| https://apreet.com/ | Nov 19, 2026, 8:35:47 PM (GMT+1) | https://pagespeed.web.dev/analysis/https-apreet-com/tqxkgsmtjq?form_factor=mobile | 100 | 100 | 100 | 100 | 3/3 |

Screenshots, unedited, beside this file: `2026-11-19-psi-genai-wednesday-de-mobile.jpg`,
`2026-11-19-psi-m-squad-com-mobile.jpg` and `2026-11-19-psi-apreet-com-mobile.jpg`. Each shows
the report time, the page tested, the Mobile tab and the five results. The Lighthouse and
Chromium versions are read from the report pages' text, which the screenshots do not show.

Agentic Browsing reports checks passed, not a score out of 100:
`2026-11-19-lighthouse-agentic-scoring.txt`. The scores in `src/data/proof.ts` (`PROOF`,
`PROOF_MEASURED`, `AGENTIC`) are these runs; /proof draws genai-wednesday.de's.
