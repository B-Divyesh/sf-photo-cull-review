# Photo Cull Review — verification 7 handoff

## Result

**FAIL — do not release candidate
`c6589c1f64a454ae61f43f93c7b3184e1a5de4ab`.**

The complete independent report is in
[verification-7.md](verification-7.md). The deployed product matches the
candidate and passes its main workflow, first-read, demo, local test, PWA,
privacy, accessibility, performance, and rate-limit checks. Release is blocked
because the product advertises a one-time **US$19** Archive pass while the
linked live checkout charges **$12.00**.

## What was verified

- Ran all 21 commands in `.factory/claims.json` separately from a clean
  candidate checkout; every declared command exited zero.
- Ran `npm ci`, `npm test`, `npm run test:e2e`, `npm run build`,
  `npm audit --audit-level=high`, and `git diff --check`.
- Exercised cold desktop and 390 px first screens, the one-click demo, a real
  duplicate-folder scan, keyboard decisions, CSV export, reset, invalid input,
  malformed backup recovery, 750/751 limits, license fail-soft behavior,
  offline reload, update behavior, response headers, links, and request logs.
- Confirmed all 22 served build artifacts match the fresh candidate build by
  SHA-256.
- Confirmed the verification allowance: 30 successful requests, then HTTP 429
  with `Retry-After` (3 seconds observed).
- Ran axe on all public views and Lighthouse 13.4.1 mobile. Axe had no
  serious/critical findings. Lighthouse scored 100 in Performance,
  Accessibility, Best Practices, and SEO; LCP was 1.5 s and CLS was 0.

Local results: 12 unit tests passed; 52 browser tests passed and 2 intentional
project checks skipped; TypeScript and the production build passed. There is no
lint script in the repository. The build produced 13,988 B gzip JavaScript and
5,154 B gzip CSS.

## Release blocker

The site, license dialog, README, terms, and `archive-pass-unlimited` claim say
**US$19**. A fresh visit through
`https://api.sociobot.in/api/v1/products/photo-cull-review/checkout` shows a
Photo Cull Review order with a **$12.00** item price, subtotal, and total. The
claim test checks local copy and a mocked license response but never checks the
real checkout amount.

Fix the product-scoped billing configuration or all advertised price copy so
they agree. Then add a real checkout contract assertion before repeating the
verification. Do not alter unrelated Sociobot resources.

## Other findings

- Low: the privacy page and CSV filename still use “manifest,” despite “move
  plan” being the documented single user-facing term.
- Low: existing QA documentation says 54 browser tests passed plus 2 skipped;
  the reproducible result is 52 passed and 2 skipped.

## Evidence and rerun

Screenshots, Lighthouse output, and URL-verifier output are in
[`verification-7-artifacts`](verification-7-artifacts/). To repeat local gates:

```sh
npm ci
npm test
npm run test:e2e
npm run build
```

Then run every `test` command in `.factory/claims.json` separately, check the
live checkout total through the product's buy link, and repeat the live
privacy/PWA/accessibility checks described in `verification-7.md`.
