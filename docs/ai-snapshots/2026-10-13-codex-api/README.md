# AI visibility snapshot of croftweaver.com, 13 October 2026

A record of what three AI assistants answered about Croftweaver one day after the domain went
live. It is a starting point to compare later runs with, not a result to act on by itself.

The owner had it run by Codex on 13 October 2026 and asked for it to be filed here the same
day. The two files are kept as they were handed over:

- `results.csv`: one row per answer, 24 rows.
- `all-answers.md`: every answer in full, with the links each assistant returned and a short
  assessment written by Codex. The answers are evidence, not advice: some contain wrong or
  outdated claims about other tools, and nobody checked those.

Nothing on the website shows these figures.

## How it was run

- Eight questions, version 1 of the set in the outside audit of the same day: six that do not
  name Croftweaver (D1 to D6) and two that do (B1 and B2).
- Each question was asked once of three assistants through their APIs: OpenAI (`gpt-6-luna`),
  Perplexity (`perplexity/sonar`) and Gemini (`gemini-3.5-flash-lite`).
- OpenAI and Perplexity answered with web search. **Gemini answered without it.**
- No chat history, no system prompt and no mention of the brand outside the question.

## What it shows

Counted from `results.csv`:

- **Questions that do not name Croftweaver:** it was named in 0 of 18 answers.
- **Questions that name it:** OpenAI and Perplexity described the right project in 4 of 4
  answers. Gemini, without web search, did so in 0 of 2: one answer invented a tabletop
  role-playing tool of the same name, and the other said that it had no verified knowledge.
- **Sources:** no answer cited or retrieved a page of croftweaver.com. OpenAI cited the toolkit's
  repository and https://genai-wednesday.de/croftweaver. Perplexity retrieved the repository,
  also under its old name, `karero/website-builder`.
- **Two weak answers about the product,** both from Perplexity: it said the available
  information names no maintainer, and it said Croftweaver does not appear to improve a site
  that is already live. Among its sources was the toolkit's README, which on that day did not
  name the maintainer and mentioned work on a live site in one line of a list.

## What it does not show

- Whether an assistant recommends Croftweaver to the people who use its app. An API can answer
  differently from the app, and each question was asked once; answers change from run to run.
- A fair picture of Gemini: without web search it could not have found a site that was one day old.
- Anything about search engines. Whether Google has indexed the site is a separate question.

## To repeat it

Use the same eight questions, the same three assistants and the same settings, and file the run
in a folder of its own beside this one. Three points to settle first, raised when the
question set was reviewed on 13 October 2026:

- Turn web search on for Gemini, or leave Gemini out. Say which.
- Question D3 was written to match Croftweaver's own pitch, and D6 asks about its own category.
  Keep both for comparison, and read them apart from the other four.
- Decide what counts as a mention before the run: the name in the text, the domain among the
  sources, or a link that supports a claim. This run counted the three apart.

Croftweaver has its own weekly AI check, which is not set up for croftweaver.com. If it is set
up later, its runs are a second series and should not be mixed with this one.
