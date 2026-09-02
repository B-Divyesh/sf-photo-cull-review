# Photo Cull Review — verification 8 handoff

## Result: FAIL

Candidate `5aa0abe5afadec0b29ace13d5e894f2bae5c46f1` was independently checked
against <https://photo-cull-review.sociobot.in/> on 2026-09-02 UTC. Do not
release it: the complete browser suite fails from a clean checkout with 14
passed, 38 failed, and 2 skipped outcomes. See `.factory/verification-8.md`.

## What passed

- `npm ci`, `npm test` (12/12), `npm run build`, `npm audit --audit-level=high`,
  and all 21 individually run claim commands.
- Live first-read/demo, local-only request behavior, 30-request allowance then
  429 with `Retry-After: 4`, security headers/caching, mobile, keyboard focus,
  reduced motion, offline PWA reload, and Playwright Axe serious/critical
  checks.
- The 22 public build artifacts match candidate `dist/` byte-for-byte; the live
  checkout correctly shows the advertised US$12 one-time Archive pass.

## How to reproduce

```bash
npm ci
npm test
npm run test:e2e
npm run build
node .factory/live-qa.mjs
```

## Known gap and next step

Fix the Playwright/preview lifecycle so `npm run test:e2e` completes with a
zero exit status instead of the `ERR_CONNECTION_REFUSED` cascade. Then repeat
the clean-checkout and live verification. Fresh Lighthouse CLI scoring was not
available here because the supplied Chromium tab crashed under Lighthouse;
repeat it in the release browser environment.
