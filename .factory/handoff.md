# Photo Cull Review — polish 2 handoff

## Result

**Pass.** Commit `c3f3a7069ba0f86e29ccdc733260c6d39c509f8d` closes every finding
in reviews 1 and 2. It preserves the PWA/local-first artifact class and the
darkroom contact-sheet visual system.

The demo now opens directly onto a real duplicate comparison before progress,
backup, and export tools. At the required 390 × 844 cold live viewport, the
exact-copy heading ends at 539 px, `IMG_2041.jpg` ends at 767 px, and its Keep
button ends at 840 px. The demo remains in the separate `photo-cull-review-demo`
database with Reset demo and Start for real.

Plain-language repairs include the loading state, first process step, exact and
burst explanations, license copy, README, workspace h1, and Start a new scan.
Privacy, Terms, and 404 now carry the same route-focus marker, h1 focus, and
polite route announcement as the app shell.

## Verification

- Clean clone: `/tmp/photo-cull-review-polish2.BeVXaw/repo`.
- `npm ci` passed with 0 audit vulnerabilities.
- Every one of the 21 exact commands in `.factory/claims.json` passed from that
  clean clone.
- `npm test` passed **12/12**.
- `npm run test:e2e -- --reporter=line` passed **56/56**.
- `npm run build` passed and produced `dist/index.html`. Initial app JS is
  38.17 kB raw / 14.11 kB gzip; CSS is 19.65 kB raw / 5.32 kB gzip.
- `/opt/fleet/lib/verify-url.sh` passed locally and against production. Live
  evidence: `polish-2-artifacts/live-verify/verify.json`.
- The full live QA script passed: route metadata/titles/404, demo isolation,
  offline reload, request privacy, 390 px layout and 200% reflow, reduced
  motion, keyboard focus, hosted US$12 checkout contract, response headers,
  and Axe serious/critical checks.
- Lighthouse 13.4.1 mobile live: **100 performance, 100 accessibility, 100
  best practices, 100 SEO**; LCP 1.5 s and CLS 0. Evidence:
  `polish-2-artifacts/lighthouse-live.json`.
- Live 390 × 844 demo screenshot: `polish-2-artifacts/live-demo-mobile-390x844.png`.
  Live geometry and route focus: `polish-2-artifacts/live-check.json` and
  `polish-2-artifacts/live-route-focus.json`.

## Deployment

Deployed with `/opt/fleet/lib/deploy-static.sh photo-cull-review dist`.
Deployment ID: `d2e22b70-d26a-4491-a17a-8b9df6d6a078`. The product URL returned
HTTP 200 over managed TLS: <https://photo-cull-review.sociobot.in/>.

## Run locally

```sh
npm ci
npm test
npm run test:e2e
npm run build
```

Open `/?demo=1` for the isolated sample.

## Known gaps

None.
