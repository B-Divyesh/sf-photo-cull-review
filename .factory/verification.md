# Independent verification — Photo Cull Review

**Verdict: FAIL**  
Date: 2026-08-28  
Candidate: `47dce2f037032e60de330ab1409d40d6e047d819`  
Live: `https://photo-cull-review.sociobot.in/`

## Scope and identity

- Started on a clean repository at the candidate SHA. `git status --short` was empty.
- `origin/main` is the same SHA.
- Built candidate files were byte-compared with the live response for `index.html`, `assets/app.js`, `assets/app.css`, `sw.js`, `manifest.webmanifest`, `offline.html`, `privacy/index.html`, and `terms/index.html`: all matched.
- The live root response was HTTPS 200. Checked headers: `Strict-Transport-Security`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Content-Type-Options: nosniff`, and 30-second revalidation cache. `sw.js` was also revalidated at 30 seconds.

## Local quality gates

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 60 packages, 0 install-audit vulnerabilities |
| `npm test` | PASS — 5/5 Vitest tests |
| `npm run build` | PASS — `tsc --noEmit` and Vite build; `dist/` produced |
| `npm run test:e2e` | PASS — 6/6 Playwright tests on Chromium desktop and Pixel-5 390×844 |
| `npm audit --audit-level=high` | PASS — 0 vulnerabilities |
| `/opt/fleet/lib/verify-url.sh` | PASS — live 200, 771 ms, no console/page errors; title/lang/one H1/main/alt/button checks passed |

Build sizes: app JS 28,002 B raw (11,030 B gzip), CSS 14,710 B raw (4,440 B gzip), self-hosted font 56,976 B, desktop hero 62,082 B, mobile hero 37,170 B. Initial JS/CSS/font/hero budgets pass.

## Live functional evidence

- On desktop and 390 px mobile, the welcome page had exactly one H1, semantic main/footer/navigation, local image/font assets, a designed 3 px visible focus outline, no console/page errors, and zero axe serious/critical violations on the welcome screen.
- A real folder with two byte-identical JPEGs grouped as “These files are exact copies.” Keyboard-only K then R (refocusing the review H1 after render) selected both decisions. Exported CSV began with `# PLAN ONLY — Photo Cull Review never moved or deleted these files.` and contained the review path, SHA-256, exact-group type, and explanation. Arrow-right completed the review.
- Unsupported text-only folder: `No supported photos or videos were found…`; following valid folder scan recovered successfully.
- Backup recovery: malformed `{` JSON produced a parse error; a valid `photo-cull-review` workspace backup returned the app to welcome state.
- Free-limit boundary: 750 supported files accepted (4,063 ms fixture scan); 751 correctly rejected with `The free archive desk scans up to 750; choose a smaller folder or unlock unlimited scans.`
- After service-worker control, offline reload displayed the saved-review offline banner and retained an H1. Reduced-motion context computed `scroll-behavior: auto` and hero transition `0.00001s`.
- Worker implementation was inspected: versioned cache, app-shell precache, cache-first same-origin assets, navigation fallback, `skipWaiting`, `clientsClaim`, and update toast listener are present. A manual `registration.update()` against unchanged live `sw.js` found no new worker, as expected.

## Accessibility and performance

- Axe Playwright scans: zero serious/critical issues on the live welcome screen; repository e2e axe scans also passed welcome and populated review screens.
- Keyboard actions, visible focus, skip link, labels, live status/error roles, desktop/mobile rendering, and reduced-motion behavior were checked.
- Lighthouse 12.8.2 against live URL: Performance 94; Accessibility 100; Best Practices 100; SEO 100. FCP 1.0 s, LCP 1.5 s, TBT 290 ms, CLS 0, Speed Index 1.0 s. It emitted a post-audit “Browser tab has unexpectedly crashed” warning after producing the complete report; retained metrics are valid but this should be rerun when deployment hardening is complete.

## Privacy, network, and policy evidence

- Fresh free-flow request capture found only same-origin assets. With a deliberately invalid local test license, the sole cross-origin request was `GET https://api.sociobot.in/api/v1/products/photo-cull-review/verify?license=qa-invalid-license`. No analytics, tracker, CDN, cloud-media upload, or sign-in request was observed. Source URL inventory matches this; images, thumbnails, hashes, and workspace persist locally.
- No product sign-in exists, so no identity-provider tenant applies.
- Privacy/terms pages, local PWA manifest/icons, generated-art provenance, JSON export/import, and CSV export are present.
- Non-blocking policy gaps: no CSP, frame protection, Permissions-Policy, COOP, or CORP response headers; assets are only cached for 30 seconds and not immutable. Documented for deployment follow-up.

## Defects

### High — mandatory unlock API rate limit absent (release blocker)

Endpoint: `GET https://api.sociobot.in/api/v1/products/photo-cull-review/verify?license=<invalid-token>`.

An initial direct request returned HTTP 200 with `{ "valid": false, "reason": "invalid" }`. A burst of 80 requests at concurrency 20 and then 200 requests at concurrency 40 returned **280/280 HTTP 200**. No 429 was observed and the sampled response had no `Retry-After` header. Observed threshold: **none through 280 requests**.

This fails the work-order requirement that every server-side endpoint, including product unlock calls, begin responding 429 with `Retry-After` during a rapid burst. The product cannot be accepted until the Sociobot billing API applies and exposes that limit, and this test is rerun.

### Low — response hardening/caching follow-up

The static deployment has beneficial HSTS/referrer/nosniff headers but lacks CSP/frame/permissions/isolation policies and immutable cache controls for app assets. This is not why the verdict is FAIL, but should be addressed in the deploy configuration.

## Required next step

Deploy a bounded rate limit for verification (and checkout/API endpoints as applicable) that returns HTTP 429 plus a meaningful `Retry-After`. Re-run the 200+ request burst and attach its threshold and response headers. Then rerun this verification report’s local/live suite.
