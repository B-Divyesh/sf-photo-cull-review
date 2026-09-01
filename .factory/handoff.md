# Photo Cull Review — repair 14 handoff

## Result

**PASS — deployed to production.** Commit
`5aa0abe5afadec0b29ace13d5e894f2bae5c46f1` closes verification 7’s
price-contract blocker without changing the researched local-first workflow.

## Reproduction and root cause

Before editing product copy, following the product-scoped checkout URL
`https://api.sociobot.in/api/v1/products/photo-cull-review/checkout` returned
a Dodo Photo Cull Review order in USD. Its item, subtotal, and total were each
`$12.00`, while the landing page, license dialog, README, Terms, and claim
advertised `US$19`.

The product did not assert the checkout outcome. Its prior claim test only
checked local text and a mocked license-verification response, so the live
purchase contract could drift unnoticed.

## Changes made

- Aligned every current advertised Archive pass price to **US$12 one time**.
- Added a real checkout contract assertion to `@claim:archive-pass-unlimited`.
  It follows the product checkout redirect and requires the live Dodo response
  to identify Photo Cull Review in USD with a `$12.00` subtotal and total.
- Renamed the downloaded CSV to `photo-cull-move-plan-<date>.csv` and changed
  Privacy copy to use the single visitor-facing term “move plan.”
- Corrected the committed browser-test evidence to **52 passed, 2 skipped**.
- Versioned immutable PWA assets as `app-v8`, cache as
  `photo-cull-shell-v9`, manifest install URL as `install-v8`, and build label
  as `v1.0.7` so clients receive the repair instead of an immutable v7 asset.

## Local verification

- `npm ci` — passed; 60 packages, 0 audit findings.
- `npm test` — **12 passed**.
- `npm run build` — passed; `dist/` created. App JS: 37,978 B raw / 14.08 KB
  gzip. CSS: 18,633 B raw / 5.15 KB gzip.
- `npm run test:e2e -- --reporter=line` — **52 passed, 2 intentional
  project-specific skips** across desktop and 390 px mobile. This includes
  keyboard shortcuts, offline/update, PWA install behavior, route metadata,
  text reflow, and Playwright axe scans with no serious/critical violations.
- Every one of the **21** commands in `.factory/claims.json` was run separately
  and passed. The Archive pass command passed in both browser projects against
  the real checkout outcome.
- `npm audit --audit-level=high` and `git diff --check` — passed.
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173/` — passed: 200, no
  console errors, title/lang, one H1, main landmark, and complete image/button
  labeling. Evidence: `repair-14-artifacts/verify-url/verify.json`.
- `npx @axe-core/cli` could not start because its Selenium Chrome lookup cannot
  find a system Chrome binary in this worker. The repository’s required
  Playwright AxeBuilder scans ran instead and passed for home, review, legal,
  and 404 routes.

## Production deployment and verification

- `/opt/fleet/lib/deploy-static.sh photo-cull-review dist` — passed. It reused
  only the assigned `sf-photo-cull-review` Static Web App in `centralus` and
  served HTTPS 200 at `https://photo-cull-review.sociobot.in`.
- SHA-256 checks match all **22** served product artifacts to the fresh `dist/`
  build, including v8 JS/CSS, legal pages, worker, manifest, icons, local font,
  sample art, and social preview.
- `node .factory/live-qa.mjs` — passed. Home, demo, Privacy, Terms, and 404
  have the expected route status, title, one H1, main landmark, social metadata,
  no horizontal overflow, and no serious/critical Axe violations. The designed
  404 naturally logs its requested missing resource; valid routes have no
  console or page errors. Evidence: `repair-14-artifacts/live-qa.json`.
- Cold first screen: at 1440 × 900, the sample action is fully visible at
  y=532.55. At 390 × 844, it is fully visible at y=575.75; all visible header
  targets are at least 44 px high and routes reflow at 200% text.
- Live demo completed two groups, reset safely, and downloaded
  `photo-cull-move-plan-2026-09-01.csv`. Free/demo requests stayed same-origin.
- Live PWA: controlled `photo-cull-shell-v9` contains 20 entries; after the
  first visit the demo reloads offline with its banner, review, and decision.
  No update was waiting when v9 was current.
- Live checkout contract: the product checkout redirected to a Photo Cull
  Review Dodo order in USD with `$12.00` item subtotal and total.
- Live URL verifier passed at
  `repair-14-artifacts/verify-url-live/verify.json`: HTTPS 200, 638 ms,
  title/lang/one H1/main, image alternatives, named buttons, and no console
  errors.
- Response policy is live: CSP with header-level `frame-ancestors 'none'`,
  HSTS, `nosniff`, strict referrer policy, Permissions-Policy, COOP, CORP, and
  `X-Frame-Options`. `app-v8.js` is one-year immutable and `sw.js` is no-store.
- Lighthouse 13.4.1 mobile: **100 Performance, 100 Accessibility, 100 Best
  Practices, 100 SEO**; FCP 1.1 s, LCP 1.5 s, TBT 0 ms, CLS 0. Evidence:
  `repair-14-artifacts/lighthouse-live.json`.

## Known gaps

None in the repaired product behavior. The standalone Axe CLI could not locate
a system Chrome binary in this worker, but the checked-in Playwright AxeBuilder
coverage passed locally and on the live product.
