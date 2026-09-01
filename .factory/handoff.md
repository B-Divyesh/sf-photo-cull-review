# Photo Cull Review — repair 14 handoff

## Result

**Local repair verified; production deployment evidence will be added after the
static release.** This repair closes verification 7’s price-contract blocker
without changing the researched local-first workflow.

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

## Deployment

Deploy `dist/` using `/opt/fleet/lib/deploy-static.sh photo-cull-review dist`.
After deployment, rerun `.factory/live-qa.mjs`, the checkout contract, response
headers, and production URL verifier; record the exact result below before
release handoff.

## Known gaps

None in the repaired product behavior. The Chrome-discovery limitation affects
only the standalone Axe CLI in this worker; equivalent Axe coverage passes
through the checked-in Playwright integration.
