# Photo Cull Review — independent verification handoff

**FAIL — not approved for release.**

Verified 2026-08-28 against candidate commit `47dce2f037032e60de330ab1409d40d6e047d819` and live URL `https://photo-cull-review.sociobot.in/`. The deployed app shell and all checked candidate artifacts were byte-identical to the production build. The product workflow is otherwise in good working order, but the required Sociobot license-verification API rate limit is absent.

## Blocking defect

- **High — license verification has no observed rate limit.** `GET https://api.sociobot.in/api/v1/products/photo-cull-review/verify?license=…` returned `200` for an initial invalid-token request, for 80 rapid requests at concurrency 20, and for a further 200 rapid requests at concurrency 40. No request returned `429` and no `Retry-After` header was present. Observed threshold: **none through 280 requests**. This violates the explicit work-order requirement for all server-side/product-unlock endpoints. Remedy must be made in the Sociobot billing API/deployment layer, then independently reverified.

## What passed

- Clean checkout at the specified SHA; `npm ci`, `npm test` (5/5), `npm run build`, `npm run test:e2e` (6/6 desktop + 390 px mobile), and `npm audit --audit-level=high` (0 vulnerabilities) all passed.
- Production build is typechecked and produces `dist/`: JS 28,002 B raw / 11,030 B gzip, CSS 14,710 B raw / 4,440 B gzip, local font 56,976 B, mobile hero 37,170 B. All are within stated budgets.
- Live files `index.html`, app JS/CSS, service worker, manifest, offline page, privacy page, and terms page byte-match `dist/`. Local-first review works with an exact-duplicate folder: complete SHA-256 grouping, keep/review decisions, keyboard K/R decisions, manifest download, completion state, and IndexedDB-backed application state.
- Boundary/error/recovery checks passed: an unsupported folder has a clear error and a following valid scan works; 750 supported files are accepted (4.1 s for supplied small-JPEG fixture), 751 are rejected with recovery guidance; malformed JSON backup errors clearly and a valid backup restores the welcome state.
- Offline reload works after service-worker installation. Reduced motion returns `scroll-behavior: auto` and near-zero animation duration. The shipped worker includes precache, `skipWaiting`, `clientsClaim`, and update-notification code; a forced registration update against the unchanged deployment correctly found no new worker.
- Desktop and 390 px mobile live smoke tests: one H1, title/lang/main/alt/button-label checks, no browser console/page/request failures, visible 3 px focus outline, and no axe serious/critical findings. `/opt/fleet/lib/verify-url.sh` recorded 771 ms live load with no errors.
- Lighthouse 12.8.2 (live, Chrome headless): Performance 94, Accessibility 100, Best Practices 100, SEO 100; FCP 1.0 s, LCP 1.5 s, TBT 290 ms, CLS 0. (Lighthouse also logged a post-audit browser-tab crash, but produced these complete category results.)
- No analytics or third-party runtime assets were observed. Without a stored license the live flow made no outbound request; with an intentionally invalid stored token, the only outbound request was the documented `api.sociobot.in` verification endpoint. There is no sign-in flow.

## Deployment observations (non-blocking)

- HTTPS has HSTS, strict-origin referrer policy, `nosniff`, and `max-age=30, must-revalidate`; it lacks CSP, X-Frame-Options/frame-ancestors, Permissions-Policy, COOP, and CORP headers. App assets are also not immutable cached. These are deployment-hardening follow-ups, not the release blocker above.
- `/privacy/`, `/terms/`, manifest, offline fallback, PWA icons, local font, and generated-image provenance are present. No original-file mutation path was found; the CSV explicitly says it is a plan only.

## Reverify

```sh
npm ci
npm test
npm run build
npm run test:e2e
npm audit --audit-level=high
```

After rate limiting is deployed, burst the verification endpoint with at least 200 requests and record the first `429` plus its `Retry-After` header before changing this verdict.
