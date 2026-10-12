# DIFF review — karero/croftweaver-site#57 — /proof: the Gemini passage also reports the attempt without a sign-in

Base `1ec53b5` · depth: **Normal** (shipped page copy with factual claims) · verdict: **CLEAN** — the one BUG fixed; of 5 RISKs, 4 fixed and 1 refuted; of 6 NITs, 5 fixed and 1 refuted; both seats confirmed all of it in round 2 and found nothing new · authority used: POST AUTHORITY and BRANCH-COMMIT AUTHORITY — this session opened the pull request and created the branch; WORKTREE-WRITE AUTHORITY — the owner's messages of 2026-10-12: "They still do not support automated testing with a not logged in users, that's why I manually tested it. I think that's worth mentioning." and "It's a lot af text about gemini", then the two facts this session asked for before building.

Files in the change: `src/data/proof.ts`, `src/pages/proof.astro`, `README.md` (from round 1 on), and this file.

| Round | Head | Artifact | Reviewers | seconds, tokens per seat | BUG/RISK/NIT (all seats, before dedup) |
|---|---|---|---|---|---|
| 1 | `4ac55d3` | full `main...4ac55d3` | codex-cli 0.162.1, gpt-6.1-sol, config effort, read-only; melious glm-5.3 (HTTP API, text only); fresh-eyes (Sonnet sub-agent, read-only, given both screenshots and the linked guide) | codex 163 s / 62,934; glm 74 s / 21,439; fresh-eyes 249 s / 138,852 | 3 / 6 / 7 · 11 questions asked, 0 confirmed beyond the findings |
| 2 | `c005faf` | delta `4ac55d3..c005faf`, with the author's record of round 1 | codex (effort medium), melious glm-5.3 | codex 101 s / 48,297; glm 137 s / 36,881 | 0 / 0 / 0 in scope; 1 NIT outside it · 6 questions asked, 0 confirmed |

| id | Sev | Source | Round | Finding — one line | Status | Evidence |
|---|---|---|---|---|---|---|
| H1 | BUG | codex, melious, fresh-eyes | 1 | "So the maintainer asked by hand, signed in" made the attempt of 12 October the reason for the answer of 10 October | fixed `9a4b50a` — locally_verified, externally_reverified (round 2, both seats) | the passage gives the check as the reason for asking by hand, as it did before this change, and reports the attempt without a sign-in after both answers |
| H2 | RISK | codex, fresh-eyes; as NIT: melious | 1 | "showed its results too briefly to read" was stated as what the Gemini web app does, on one report; the screenshot shows only the start page | fixed `9a4b50a` — locally_verified, externally_reverified (round 2, both seats) | "Also by the maintainer's report, an attempt without a sign-in on 12 October 2026, in a private browser window on a computer, showed its results too briefly to read." |
| H3 | RISK | codex, fresh-eyes | 1 | "signed in" was said of both answers, but is on record for the first only | fixed `9a4b50a` — locally_verified, externally_reverified (round 2, both seats) | "signed in on a phone" sits in the sentence about 10 October; the closing sentence says "one person"; the code comment says what is on record for each |
| H4 | RISK | fresh-eyes | 1 | "Asked again" implied the same question, app and model; the limit "nothing else of it was recorded" was gone | fixed `9a4b50a` — locally_verified, externally_reverified (round 2, both seats) | "By the maintainer's report, a second asking on 12 October 2026 also named GenAI Wednesday; nothing else of it was recorded." |
| H5 | RISK | fresh-eyes; as NIT: melious | 1 | "That much is from an unpublished screenshot" covered the date, which the screenshot does not show | fixed `9a4b50a` — locally_verified, externally_reverified (round 2, both seats) | "…and the date from the maintainer." |
| H6 | RISK | melious | 1 | the test records name `e83afd3`, the reviewed head is `4ac55d3` | refuted; codex confirmed the evidence in round 2 | `git diff --stat e83afd3..4ac55d3` lists only this file; codex and fresh-eyes confirmed it; the pre-push gate also ran on `4ac55d3` with 223 passed |
| H7 | NIT | fresh-eyes | 1 | "it named" pointed at the screenshot | fixed `9a4b50a` | the sentence is rewritten (H4) |
| H8 | NIT | fresh-eyes, melious | 1 | "the Gemini web app" and then "the app"; "on a phone" was gone | fixed `9a4b50a` | "signed in on a phone" for the first answer; "in a private browser window on a computer" for the attempt |
| H9 | NIT | fresh-eyes | 1 | the README calls `byHand` two answers; it now also holds the attempt without a sign-in | fixed `9a4b50a` | README, launch requirements |
| H10 | NIT | fresh-eyes | 1 | "the file" has no antecedent in the paragraph | fixed `9a4b50a` | "the published file" |
| H11 | NIT | melious | 1 | the closing limit "nothing more" was gone | fixed `9a4b50a` | "They show what one person got on two days, nothing more." |
| H12 | NIT | melious | 1 | `signedOut` repeats the date literal of `again` | refuted; both seats accepted the reason in round 2 | two separate facts that share a day; tying one to the other would move both when one is corrected. The code comment now says so |

## Where each fact in the passage comes from

| Fact | Source | Who can check it |
|---|---|---|
| By the maintainer's report: an attempt without a sign-in on 12 October 2026, in a private browser window on a computer, showed its results too briefly to read. The date: the owner reported it in the session of 12 October 2026, hours after this session suggested the attempt, and the screenshot file was created that day | the owner, 2026-10-12: "sign-in request, private window on the computer", "it briefly shows results", "it shows the screenshotteed page again – no time to read the results, and you cannot scroll", "so, NOT possible to use, not supported". The owner's screenshot shows the Gemini start page with "ki treffen in münchen" typed in and "Sign in to connect to Google apps, create images, and more" | the owner; the fresh-eyes reviewer was given the image |
| The first answer was asked signed in, on a phone | its screenshot: a phone screen, and "Your organization's chats aren't used to improve our models" under the answer. The page says this of the first answer only | the owner; the fresh-eyes reviewer read the image |
| The answer of 10 October 2026: model label, question, four events, first among the communities, six source labels, four of them on passages about others | unchanged from karero/croftweaver-site#53: the owner's screenshot, read by the author and by that review's fresh-eyes seat | the owner |
| A second asking on 12 October 2026 also named GenAI Wednesday | the owner, asked on which day the answer was run: "Today Oct 12", then "Well Oct 10 I tested it for the first time", then "Screenshot is from Oct 10, both runs named it" | the owner only |
| Why the check does not ask Gemini with web search | the toolkit's guide at tag `v0.31`, linked from the page | anyone |

What left the passage: "which lies in Google's terms for the Gemini API" (the linked guide says it) and "the first was to a question the check does not ask" (the check's two questions are listed above the table). Round 1 put back what the first version of this change had also cut. The passage is 173 words where the live one has 182.

## Test records (head `e83afd3`)

| Run | Result | Exit status |
|---|---|---|
| `npm ci` | installed, 0 vulnerabilities | 0 |
| `npm run check` | 0 errors, 0 warnings, 0 hints | 0 |
| `npx playwright test` (its web server runs `npm run build` first) | 223 passed, none skipped or failed | 0 |
| `git push` (the pre-push gate: build, then the tests) | 223 passed; "pre-push gate passed" | 0 |

The change adds no build check and no test: it changes sentences and one date.

On head `9a4b50a`, after the round-1 fixes: `npm run check` 0 errors, exit status 0; `npx playwright test` 223 passed, none skipped or failed, exit status 0.

Waivers: none. Deferrals: none.

Follow-ups, for the owner:
- Round 2, outside its scope (melious): the live page said of the first answer that it "was to a question the check does not ask"; this change leaves that clause out, because the check's two questions are listed above the table. The owner decides whether it comes back.
- The owner asked for less text about Gemini. With the reviewers' caveats back, the passage is 173 words where the live one has 182. A shorter one needs a fact dropped, such as the six source labels; that is the owner's call.

Notes:
- Round 2 was owed by H1 to H5: each changed what the page claims. It found nothing in scope, so the rounds stop there. Fresh-eyes ran in round 1 only, as Normal depth says.
- No wording pass and no re-check: nothing but this file changed after the head both seats saw in round 2. The stamp on the review comment relies on both seats' chains: round 1 in full, round 2's delta.
- Two questions of round 2 were looked at and not made findings: the day of the second asking (the owner's words are now quoted in the table above), and "the published file", which the paragraph that follows introduces with its download link.
- Data check: the artifact holds no credentials, and the repository is public. Destinations: Codex and GLM 5.3 on melious, as in the gates of karero/croftweaver-site#46, #53 and #54 earlier in the same session, where the owner said "Do it" (2026-10-12) to a review described as "Codex plus GLM 5.3".
- The owner's two screenshots are not in this repository and not published.
