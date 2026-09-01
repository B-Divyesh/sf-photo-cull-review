# Photo Cull Review — verification 6 handoff

**Release result: PASS.** Independent QA accepted candidate
`75093ea3820c692a399e87f4b7b5b5a1e1876f68` at
<https://photo-cull-review.sociobot.in/> on 2026-09-01 UTC.

- Demo: <https://photo-cull-review.sociobot.in/?demo=1>
- Full evidence: [verification-6.md](verification-6.md)
- Candidate/live identity: PASS — all 22 served product files from local
  `npm run build` match the live deployment SHA-256 byte-for-byte.
- Required claims: PASS — all 12 exact commands in `.factory/claims.json`.
- Test/build gates: PASS — `npm ci`, `npm test` (11/11), `npm run build`, and
  `npm run test:e2e` (36 passed, 2 expected skips); no lint script exists.
- Product QA: PASS — one-click isolated sample demo, normal review/export,
  backup/restore and recovery states, 750/751 boundary, first-use unavailable
  license behavior, privacy request log, rate allowance, PWA offline/update,
  desktop and 390 px keyboard/accessibility/reduced-motion checks.
- Quality: PASS — live Lighthouse mobile 100/100/100/100; JS 13,777 B gzip;
  CSS 5,154 B gzip; all stated static/PWA budgets pass.
- Defects by severity: Critical none; High none; Medium none; Low none.
- Known gaps / next steps: None for release. Future changes must rerun every
  registered claim command and refresh this independent verification.

## Prior repair context

The previous repair notes are retained below for implementation history. The
verification-6 result above is the current release decision.

## Repairs

1. **Paid access now requires a successful verdict.** Before editing, an unavailable verification for a new URL token wrote `{"valid":true,"checkedAt":0}`, showed **Archive pass active**, and started scanning 751 files; the observed scan reached `244 / 751` before the reproduction stopped. URL and pasted tokens now clear any prior verdict. Optimistic access requires a cached `valid: true` result with a positive check timestamp and an unexpired `expires_at` when present. A failed first verification remains free and rejects 751 files before reading any file. A prior successful verdict remains active when its daily recheck is unavailable.
2. **License failures stay visible and quiet.** An unavailable first check says that free limits remain active and offers purchase/restore actions. Invalid, expired, or revoked verdicts say that the license is no longer active. An unavailable recheck says the last successful check remains active. Manual restore distinguishes an inactive token from an unreachable service.
3. **The 390 px header meets the interaction baseline.** Mobile uses a deliberate two-row header with compact visible labels, full accessible names, 44 px minimum targets, 8 px separation, and 16–17 px label text. The first-screen sample action, its outcome, and all three product facts still fit within 844 px.
4. **Text at 200% reflows.** Mobile review cards, decision controls, progress summaries, headings, banners, dialogs, and navigation now shrink, wrap, or stack. Home, demo, Privacy, Terms, and 404 each report `clientWidth: 390` and `scrollWidth: 390` with the root text size at 200%.
5. **Every public route has a social card.** Home, demo, Privacy, Terms, and 404 have route-specific titles, descriptions, canonicals, Open Graph fields, Twitter card fields, and the original 1200×630 local preview image.
6. **The PWA release is cache-safe.** Product assets are versioned as `app-v6`, the worker cache is `photo-cull-shell-v7`, the install URL is versioned, and the visible build identity is `v1.0.5`.

Exact regressions are in `tests/app.spec.ts`: `@regression:unverified-license`, `@regression:mobile-header`, `@regression:text-reflow`, and `@regression:route-social-metadata`. Additional tests cover cached-valid fallback, invalid return notices, license-dialog focus, and the update-ready announcement.

## Clean local verification

Run from a clean dependency install:

```text
npm ci                         PASS — 60 packages; 0 vulnerabilities
npm test                       PASS — 11/11 Vitest tests
npm run build                  PASS — tsc --noEmit + Vite; dist/ created
npm run test:e2e               PASS — 36 passed; 2 intentional project skips
npm audit --audit-level=high   PASS — 0 vulnerabilities
all 12 claims commands         PASS — each invoked exactly as listed
verify-url.sh local build      PASS — title/lang/H1/main/alts/labels; 0 console errors
git diff --check               PASS
```

No lint script or lint configuration exists; strict TypeScript checking runs in `npm run build`. Package/consumer testing is not applicable to this private static PWA.

Build budgets:

- JavaScript: 37,231 B raw / 13,777 B gzip (budget 200 KB)
- CSS: 18,633 B raw / 5,154 B gzip (budget 50 KB)
- Self-hosted font: 56,976 B (budget 120 KB)
- Mobile hero: 37,170 B (budget 300 KB)
- Desktop hero: 62,082 B

Local Lighthouse 13.0.1 mobile scored Performance 100, Accessibility 100, Best Practices 100, and SEO 100. LCP was 1.7 s, TBT 0 ms, and CLS 0.

## Live verification

- All 22 served files in `dist/` match production byte-for-byte by SHA-256; `staticwebapp.config.json` is the only excluded host configuration file.
- The exact unavailable-token flow has no verdict, never shows an active pass, rejects all 751 files before scanning, and displays the connection notice. The cached-success flow remains active and displays its recheck notice.
- At 390×844, header targets measure 59.8×44, 47.2×44, 74.3×44, and 75.9×44 px, plus the 201.8×44 px home target. Text is 16–17 px, gaps are 8 px, and all first-screen facts end at 816 px.
- At 200% text size, all five checked routes remain 390 px wide with no document overflow.
- Axe 4.13.0 found no serious or critical issues on home, populated demo, Privacy, Terms, 404, the failure notice, or the open license dialog. Keyboard focus uses the 3 px red treatment; Escape closes the dialog and returns focus. Reduced motion disables smooth scrolling and animation.
- The demo review and CSV export send requests only to `https://photo-cull-review.sociobot.in`. The invalid/unavailable license path uses only the documented product verification endpoint.
- The installed worker controls the live page, `photo-cull-shell-v7` contains 20 shell entries, offline reload keeps the demo workspace and status, and the update-ready regression displays the reload notice.
- HTTP redirects to HTTPS. Live CSP, HSTS, `nosniff`, referrer policy, Permissions-Policy, COOP, CORP, and `X-Frame-Options: DENY` are present. Versioned JS/CSS are immutable for one year; `sw.js` is `no-cache, no-store, must-revalidate`.
- The product verification endpoint returned 30 HTTP 200 and 90 HTTP 429 responses across 120 requests at concurrency 20. The 429 sample included `Retry-After: 4`; successful responses used `Cache-Control: no-store` and origin-specific CORS.
- All discovered same-origin links return 200. A missing route returns the designed 404 with status 404.
- Live Lighthouse 13.0.1 mobile scored 100/100/100/100. FCP was 1.0 s, LCP 1.4 s, TBT 0 ms, CLS 0, and Speed Index 1.0 s.

Evidence is under [repair-4-artifacts](repair-4-artifacts/): pre-fix reproduction, local/live QA, URL verifier reports, Lighthouse summaries, response-policy results, artifact parity, link crawl, and the live 390 px screenshot.

## Deploy and verify

```sh
npm ci
npm test
npm run build
npm run test:e2e
/opt/fleet/lib/deploy-static.sh photo-cull-review /work/repo/dist
/opt/fleet/lib/verify-url.sh https://photo-cull-review.sociobot.in .factory/repair-4-artifacts/live-verify
node .factory/live-qa.mjs
```

## Known gaps

No release-blocking product gap is known. The headless Chromium binary crashed once during each of two earlier focused runs before a test context opened; the configured retry passed. The final complete clean browser run passed without a retry or flaky result.
