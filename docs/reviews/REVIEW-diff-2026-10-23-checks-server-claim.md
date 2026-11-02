# Review trail: /checks, the server-refusal sentence (DIFF gate, one seat)

Change: the limits paragraph on `/checks` said "today nothing on the server stops a person from publishing a build
that failed". The repository's rulesets contradict part of it (F36 in the private plan trail of `/what-it-runs-on`,
found 2026-10-22, put to the owner and fixed here at his request on 2026-10-23). The paragraph now says the refusal
depends on a branch rule the owner switches on; that on this repository it is on, so a change reaches `main` only
through a pull request that passes its checks; and that the push that publishes to `production` is gated by no
check. A guard test in `tests/a11y.spec.ts` fails if the old sentence returns or the ungated push is no longer named.

## The reading the sentence rests on (retained, as the review asked)

`gh api repos/karero/croftweaver-site/rulesets/<id>`, read on 2026-10-23 (UTC), summarised by `jq`:

```
protect main | enforcement: active | bypass actors: 0 | target: ~DEFAULT_BRANCH | rules: deletion,non_fast_forward,pull_request,required_status_checks
  required checks: test, Cloudflare Pages
protect production | enforcement: active | bypass actors: 0 | target: refs/heads/production | rules: deletion,non_fast_forward
```

Not done, on purpose: a push of a failing commit to `main` to watch GitHub refuse it. The sentence says what the
rules require, with the date they were read; it does not describe a refusal that was observed.

## Round (Codex, one seat; melious had no balance and ollama was at its weekly limit)

`reviewers: codex OK`; `timings: codex 143s (46903 tokens)`. No BUG. One RISK: the "main only by a passing pull
request" guarantee had no retained support for the 23 October reading. Disposition: fixed by the retained reading
above (rules, bypass count, required checks, enforcement); the sentence stays dated "read from GitHub's settings on
23 October 2026". The other claims Codex listed (the hook can be skipped with `--no-verify`, `ship.sh` pushes
`main:production`, CI triggers) were verified by it from the code.

The suite: 421 passed on a build served from this branch on its own port (the shared test port was held by another
session's server during two runs, which then tested a stale build; those results were discarded). `astro check`: 0 errors.
