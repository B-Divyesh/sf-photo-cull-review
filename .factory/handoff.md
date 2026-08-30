# Photo Cull Review — repair handoff

**READY — verifier blockers repaired and deployed.**

- Work order: `photo-cull-review-repair-1`
- Original candidate: `47dce2f037032e60de330ab1409d40d6e047d819`
- Verifier report commit: `ac589c59a84c5fffe414e3c32ca6b1acf68b9f35`
- Repair commits: `e0b6c59` and `e3e3593`
- Live URL: `https://photo-cull-review.sociobot.in/`
- Demo URL: `https://photo-cull-review.sociobot.in/?demo=1`
- Deployment: Azure Static Web Apps resource `sf-photo-cull-review`; deployment ID `53860138-0819-486b-84ba-350c88e9ab56`
- Verified: 2026-08-30 UTC

## Release-blocking repairs

1. **Sequential shortcuts:** the global shortcut handler now accepts K, R, S, and arrow keys when focus is on a decision button. It still ignores editable fields, links, dialogs, and unrelated buttons. In live Chromium, K marked the first item Keep, focus remained on that Keep button, R marked the second item Move to review, and ArrowRight opened “Your plan is ready.”
2. **Mobile targets:** the home link and footer legal links now have 44 px minimum target dimensions. Live 390×844 measurements are 185.28×44 px for home, 55.47×44 px for Privacy, and 46.61×44 px for Terms. The page has zero horizontal overflow.

Exact browser regressions are in `tests/app.spec.ts`. They assert the second decision’s actual `aria-pressed` state, completion via ArrowRight, and rendered target boxes at 390 px.

## Baseline work completed with the repair

- Added a one-click four-file sample review at `?demo=1`. Demo data uses the separate `photo-cull-review-demo` IndexedDB database, never reads the real workspace or license, can be reset, and is deleted when choosing **Start for real**.
- Added `.factory/claims.json`, exact claim tests, `.factory/demo.md`, and `.factory/copy-audit.md`.
- Added original hand-drawn SVG sample previews. The social image is a reviewed 1200×630 crop of the existing generated archive art; provenance is recorded in `.factory/design.md`.
- Added canonical/social metadata, sitemap, a designed 404, manifest MIME configuration, and versioned PWA shell/cache names.
- Added deployment response policies: CSP with `frame-ancestors 'none'`, Permissions-Policy, COOP, CORP, and `X-Frame-Options`. Versioned JS/CSS use one-year immutable caching; `sw.js` uses `no-cache, no-store, must-revalidate`.
- Added skip links and 44×44 px link targets to the legal pages.

## Verification evidence

Clean install and repository gates:

```text
npm ci                       PASS — 60 packages; 0 vulnerabilities
npm test                     PASS — 6/6 Vitest tests
npm run build                PASS — strict tsc --noEmit + Vite; dist/ created
npm run test:e2e             PASS — 13 passed, 1 intentional project skip
npm audit --audit-level=high PASS — 0 vulnerabilities
git diff --check             PASS
```

The intentional skip is the 390 px geometry test in the desktop project; it runs and passes in the mobile project. Playwright is pinned to 1.58.2. The repository has no separate lint configuration; strict TypeScript checking includes `src`, tests, and Vite configuration.

Every command in `.factory/claims.json` passed independently. Evidence covers exact SHA-256 grouping, cautious similarity suggestions, CSV contents plus unchanged source hashes, refresh persistence, offline reload in a dedicated browser context, same-origin-only free use, isolated demo reset/exit, and the 750/751 free boundary.

Browser and accessibility checks:

- Chromium desktop 1440×1000 and mobile 390×844: PASS.
- Axe 4.13.0: zero violations on live landing, populated review, demo, privacy, terms, and 404 screens.
- Factory `verify-url.sh`: PASS — HTTPS 200, title, `lang=en`, one H1, main landmark, alt text, named buttons, and zero console/page errors on the live landing page; measured load 741 ms.
- Keyboard: skip link, native controls, sequential K/R, ArrowRight completion, dialog Escape/focus return, and visible 3 px focus ring pass.
- Reduced motion: `scroll-behavior: auto`; transitions reduce to `0.00001s`.
- Mobile: no clipping or horizontal overflow; all visible controls checked at 44×44 px or larger on landing, demo, privacy, and terms.

PWA and privacy checks:

- A fresh live demo was controlled by `/sw.js`; `photo-cull-shell-v3` held 19 entries. Offline reload retained the sample review and showed both the offline status and demo banner.
- A controlled two-version service-worker server fetched the worker twice and displayed `An update is ready. Reload to use it.`
- The free live scan requested only `https://photo-cull-review.sociobot.in`; media was not uploaded. Source inventory contains only the documented Sociobot checkout/verification origin.
- The demo does not inspect localStorage license state and uses a separate IndexedDB database.
- No sign-in exists, so an identity-provider check is not applicable.
- The shared Sociobot verification API rate-limit burst was not repeated because this work order forbids connecting to resources outside `sf-photo-cull-review`. The independent report already records a passing 30×200 / 270×429 burst with `Retry-After: 4`; no billing code was changed.

Production and performance:

- `dist/index.html` is at the deploy root. SHA-256 values matched live bytes for 21 artifacts: HTML, JS, CSS, service worker, manifest, offline/legal/404 pages, icons, font, hero images, social image, sample images, sitemap, and robots file.
- Build sizes: JS 30,742 B raw / 11.84 KB gzip; CSS 15,480 B raw / 4.59 KB gzip; font 56,976 B; mobile hero 37,170 B; social image 113,073 B and not loaded on first paint.
- Live Lighthouse 13.4.1: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.0 s, LCP 1.5 s, TBT 0 ms, CLS 0, Speed Index 1.4 s. Lighthouse emitted its known post-report browser-tab crash message after writing the complete JSON report.
- Live headers: CSP, frame protection, Permissions-Policy, COOP, CORP, HSTS, strict referrer policy, and `nosniff` present. `app-v2.js` and `app-v2.css` are immutable for one year; `sw.js` is no-store. The manifest is `application/manifest+json`. Unknown URLs return the designed page with HTTP 404.

## Known gaps and next steps

No release-blocking product gap remains. A future functional release must increment both the `app-v2` asset names and `photo-cull-shell-v3` cache name before deploying changed bundles. A separate linter may be added later; strict TypeScript and the complete test suite are the current static-analysis gates.
