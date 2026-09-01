# Independent verification 5 — FAIL

- Candidate: `36777eaaf3943eccc16b9756d2c44626b9842bc9`
- Verified URL: `https://photo-cull-review.sociobot.in/`
- Demo URL: `https://photo-cull-review.sociobot.in/?demo=1`
- Date: 2026-09-01 UTC
- Work order: `photo-cull-review-verify-5`
- Result: **FAIL — do not release this candidate.**

The repaired first screen, candidate grouping, local workflow, offline behavior, privacy boundary, and deployment identity all pass. Release is blocked by the paid-license validation state and mobile accessibility defects below.

## Release-blocking findings

### High — a new token enables paid limits when verification is unavailable

The app treats any token received in `?license=` as valid before that token has ever received a successful verification verdict. When the verification request is unavailable, `verifyLicense()` returns that unvalidated optimistic value and leaves the Archive pass active.

Fresh live reproduction in an isolated browser context:

1. The verification request for `qa-unavailable-verification-5` was intentionally made unavailable.
2. Opened `/?license=qa-unavailable-verification-5`.
3. The app removed the query parameter, stored the token, stored `{"valid":true,"checkedAt":0}`, and displayed **Archive pass active** after the request failed.
4. Selected 751 supported video files. The app accepted them and reached `720 / 751` in the scan instead of showing the 750-file free limit.

Machine-readable evidence: [license unavailable result](verification-5-artifacts/license-unavailable-result.json).

This does not meet the paid-unlock contract to verify on first use and only use a previously verified cached verdict for optimistic offline access. A newly supplied token must remain on the free limit until it receives a valid response. Previously verified customers may continue to use a still-valid cached verdict when the service is unavailable.

Related recovery gap: an invalid token returned in the URL is verified and correctly returns the UI to the free tier, but no visible “license no longer active” notice is shown. The manual restore form does provide a clear invalid-license message.

### Medium — mobile header controls remain too small and too close

At 390 × 844 CSS pixels, the visible header targets measured:

| Target | Size |
| --- | ---: |
| Photo Cull Review home | 133.0 × 44 px |
| Demo | **36.2 × 44 px** |
| How it works | 63.9 × 44 px |
| Privacy | 46.3 × 44 px |
| Archive pass | 66.5 × 50.7 px |

The Demo target is below the required 44 px width. Horizontal gaps are 0 px between the brand and Demo and 4 px among the remaining header controls, below the required 8 px. All four navigation labels compute to **11.2 px**, below the mobile readability baseline.

Machine-readable evidence: [mobile measurements](verification-5-artifacts/mobile-measurements.json).

### Medium — 200% text size does not reflow at 390 px

With the root text size set to 200% at the required mobile width, every checked route needs horizontal scrolling:

| Route | Viewport width | Content width |
| --- | ---: | ---: |
| `/` | 390 px | **500 px** |
| `/?demo=1` | 390 px | **636 px** |
| `/privacy/` | 390 px | **496 px** |
| `/terms/` | 390 px | **496 px** |

The home header extends past the viewport. In the demo, 622 px-wide review cards and their decision controls extend off-screen. See [200% mobile evidence](verification-5-artifacts/mobile-text-200.webp).

## Required claim checks

`.factory/claims.json` exists with 12 entries, and each identifier occurs on exactly one tagged test definition. The first pre-install command confirmed the expected clean-clone dependency state (`@playwright/test` was not yet installed). After the required `npm ci`, every exact claim command passed:

| Claim | Result |
| --- | --- |
| `exact-duplicates` | PASS — 2/2 browser projects |
| `similar-suggestions` | PASS — 1/1 unit test |
| `csv-export` | PASS — 2/2 browser projects |
| `workspace-persistence` | PASS — 2/2 browser projects |
| `offline-reload` | PASS — 2/2 browser projects |
| `local-only` | PASS — 2/2 browser projects |
| `demo-sandbox` | PASS — 2/2 browser projects |
| `free-limit` | PASS — 1/1 unit test |
| `workspace-backup` | PASS — 2/2 browser projects |
| `archive-pass-unlimited` | PASS — 1/1 unit test |
| `video-streaming` | PASS — 1/1 unit test |
| `license-verification-request` | PASS — 2/2 browser projects |

No material landing-page or README promise was found outside this inventory after accounting for related safety and privacy claims.

## First-read and one-click demo

**PASS.** On a cold 1440 × 900 load, the first screen says:

- What it does: **Clean up duplicate photos. Before anything moves.**
- Who it is for: households with large or crowded photo archives.
- What to click: **Try it with sample data**, followed by “Opens a four-file sample review immediately.”
- Plain facts: photos stay on this device, offline after first visit, free through 750 files.

The sample action, explanation, and facts ended at 583.34, 643.00, and 866.47 px respectively, all inside the 900 px desktop screen. At 390 × 844, they ended at 596.22, 629.05, and 822.72 px. One click opened a populated four-file workspace with an exact-copy pair, a likely-burst pair, persistent demo banner, Reset demo, and Start for real. See [desktop](verification-5-artifacts/first-read-desktop.webp), [mobile](verification-5-artifacts/mobile-full-page.webp), and [one-click demo](verification-5-artifacts/demo-after-one-click.webp).

## Clean-checkout gates

| Check | Result |
| --- | --- |
| Candidate identity | PASS — local `HEAD` and `origin/main` were the requested SHA before QA edits |
| `npm ci` | PASS — 60 packages installed; 0 vulnerabilities |
| `npm test` | PASS — 11/11 tests in 3 files |
| Type check | PASS — `tsc --noEmit` in the production build |
| Lint | Not available — no lint script or lint configuration is present |
| `npm run build` | PASS — Vite 7.3.6; `dist/` produced |
| `npm run test:e2e` | PASS on clean rerun — 23 passed, 1 intentional project skip |
| `npm audit --audit-level=high` | PASS — 0 vulnerabilities |
| Factory URL verifier | PASS — HTTP 200 in 744 ms; title/lang/H1/main/alts/button names; no console or page errors |

The first full browser-suite execution had one Chromium process crash during mobile context creation; its configured retry passed. A complete second execution passed without a retry or flaky result. No product assertion failed.

## Product workflow and recovery

- Completed both demo groups using the documented K/R/arrow keyboard flow. The finished state appeared and exported a two-row CSV plan.
- The CSV contained the plan-only warning, source and proposed review paths, byte counts, complete SHA-256 values, group types, and plain reasons. One row was an exact match and one was a capture-metadata-based suggestion.
- The exact-copy browser claim compared the source fixture hash before and after review/export; it was unchanged.
- A single supported image produced **No candidates to review** with a clear no-change message.
- An unsupported file produced a supported-format explanation. Selecting the valid fixture folder immediately afterward recovered to an exact-copy group.
- Malformed and structurally invalid workspace backups produce a product-specific message and leave the review usable.
- The 750/751 free boundary, validated 751-file paid path, streaming video hashing, capture-metadata parsing, and file-modification-time regression all pass deterministic unit tests.
- A demo decision survived reload and tab close in the same browser context. Reset demo returned the decision to undecided, and the separate real workspace remained isolated.

## Privacy, requests, and response policy

- A full live demo review, export, and reset requested only `https://photo-cull-review.sociobot.in`. No media, thumbnail, hash, path, or decision request left the product origin.
- With an invalid supplied license, the only cross-origin request was `GET https://api.sociobot.in/api/v1/products/photo-cull-review/verify?license=…`. The URL token was removed from the address bar, the invalid verdict was cached, and paid controls were disabled.
- The source URL inventory contains no analytics, tracking, CDN font/script, cloud-media, or sign-in integration. No sign-in exists, so the Entra authority requirement is not applicable.
- The live root, versioned assets, worker, manifest, and 404 responses include CSP with response-header `frame-ancestors`, HSTS, `nosniff`, strict referrer policy, Permissions-Policy, COOP, CORP, and `X-Frame-Options: DENY`.
- Versioned JS/CSS use `public, max-age=31536000, immutable`; `sw.js` uses `no-cache, no-store, must-revalidate`; the manifest is served as `application/manifest+json`.
- The license verification allowance is enforced. In a fresh 120-request check at concurrency 20, **30 returned 200 and 90 returned 429**. A sampled 429 included `Retry-After: 4`; successful responses used `Cache-Control: no-store` and origin-specific CORS. The observed allowance was 30 successful responses in this check.

## PWA, accessibility, and performance

- Chromium parsed the manifest without errors: standalone display, versioned start URL, 192/512/maskable icons, and matching theme/background colors.
- The live worker controlled the page and populated `photo-cull-shell-v6` with 20 entries. Offline reload retained the demo workspace and displayed the offline status.
- A controlled local replacement worker triggered **An update is ready. Reload to use it.** with no console error. An unchanged live `registration.update()` correctly left no waiting worker.
- Axe 4.13.0 found zero serious or critical findings on home, populated demo, Privacy, Terms, 404, and the open license dialog. Normal-size desktop and 390 px pages had no horizontal overflow.
- Keyboard checks confirmed the skip link, visible 3 px focus treatment, review shortcuts, button operation, license-dialog initial focus, Escape close, and focus return. Reduced motion computed `scroll-behavior: auto` and removed the hero animation.
- Lighthouse 13.0.1 mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.0 s, LCP 1.4 s, TBT 50 ms, CLS 0, Speed Index 1.0 s. See [summary](verification-5-artifacts/lighthouse-summary.json).
- Build sizes: JS 35,380 B raw / 13,281 B gzip; CSS 16,719 B raw / 4,840 B gzip; font 56,976 B; mobile hero 37,170 B; desktop hero 62,082 B. All stated budgets pass.

## Deployment identity and routes

All 22 deployable files from the fresh `dist/` build matched the live bytes by SHA-256, excluding only the host configuration file, which is not served. This confirms the live product matches the requested candidate’s product artifacts. HTTP redirects to HTTPS. Home, demo, Privacy, Terms, and the designed 404 resolve as intended; all discovered same-origin links return 200.

Low-severity metadata gap: Privacy, Terms, and 404 have route-specific titles, descriptions, canonicals, theme color, and favicons, but do not include the Open Graph and Twitter card metadata required for every route by the site-structure contract.

## Acceptance decision

**FAIL.** Correct the new-token verification state, provide its invalid/unavailable status to the user, repair mobile header target sizing/spacing/text size, and make the 200% mobile layouts reflow without horizontal content loss. Add route social metadata while making those changes. Then rerun every claim command, the full clean-checkout suite, live artifact parity, license-service unavailable state, 390 px target measurements, 200% text checks, offline/update checks, axe, Lighthouse, and the request-allowance check.
