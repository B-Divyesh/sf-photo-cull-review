# Photo Cull Review — repair 15 handoff

## Result

**Release blocker repaired and verified locally.** This repair closes F-8-1
from `.factory/verification-8.md` without changing the researched product,
photo-handling behavior, price, privacy boundary, or deployment class.

## Reproduction and root cause

The verifier’s clean run stopped after 14 passing Chromium tests. The next
demo navigation timed out, Chromium became unavailable, and the preview at
`127.0.0.1:4173` then refused every remaining request.

The exact command passed once in this repair container, confirming the report
was intermittent. A three-repeat stress run then reproduced its underlying
browser failure: the long-lived Chromium worker segfaulted after accumulating
many fresh contexts and Playwright reported `browser.newContext: Target page,
context or browser has been closed`. The old setup also let a test command
reuse any process already listening on port 4173, so preview ownership was not
deterministic across back-to-back claim and full-suite commands.

## Changes made

- `npm run test:e2e` now builds first, then starts one strict Vite preview that
  the current Playwright command owns. It does not reuse a stale port 4173
  process.
- Desktop and 390 px coverage is split into four bounded Playwright projects.
  Each project gets a fresh worker/browser, avoiding the long context lifetime
  that produced the captured Chromium crash.
- Service-worker installation and `context.setOffline(true)` moved to the
  dedicated final `pwa-offline` project.
- Offline coverage closes only its own context. It never closes Playwright’s
  shared browser.
- Added `@regression:preview-lifecycle`. After offline teardown it asserts the
  shared browser is connected, opens a fresh context, fetches the preview, and
  loads the populated demo.

## Local verification

- `npm ci` — passed; 60 packages installed, 0 audit findings.
- `npm test` — **12/12 passed**.
- `npx tsc --noEmit` — passed.
- `npm run build` — passed; `dist/index.html` produced. App JavaScript is
  37,978 B raw / 14.08 kB gzip; CSS is 18,633 B raw / 5.15 kB gzip; the font is
  56,976 B; the mobile hero is 37,170 B.
- `npm run test:e2e` — **52 passed, 2 intentional target-specific skips**.
  Four consecutive complete invocations passed after worker partitioning.
- Every one of the **21** commands in `.factory/claims.json` was run separately
  and passed, including offline reload and the live US$12 checkout contract.
- Playwright AxeBuilder found no serious/critical issues on home, populated
  review, license dialog, Privacy, Terms, and 404 routes.
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173/` — passed with HTTP 200,
  no console errors, one H1, `lang`, main landmark, and complete image/button
  labeling. Evidence is in `repair-15-artifacts/verify-url-local/`.
- Lighthouse 13.4.1 mobile — **100 performance, 100 accessibility, 100 best
  practices, 100 SEO**; LCP 1.9 s, CLS 0, total blocking time 0 ms. Evidence:
  `repair-15-artifacts/lighthouse-local.json`.
- `npm audit --audit-level=high` and `git diff --check` — passed.

The complete browser suite covers desktop, 390 px mobile, keyboard decisions,
dialog focus return, 200% text reflow, demo isolation, local-only requests,
offline persistence, service-worker updates, legal/404 routes, and social
metadata.

## Deployment

Pending the product-scoped static deployment of `dist/` to
`sf-photo-cull-review`. After deployment, run the live URL verifier,
`.factory/live-qa.mjs`, response-policy checks, and artifact identity check.

## Known gaps

None in the repaired product behavior. No product runtime code changed; this
repair makes the required verification lifecycle deterministic.
