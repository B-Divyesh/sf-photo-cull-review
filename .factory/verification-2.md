# Independent verification 2 — Photo Cull Review

**Verdict: FAIL — acceptance baseline not fully met.**

- Date: 2026-08-28
- Candidate: `47dce2f037032e60de330ab1409d40d6e047d819`
- Live URL: `https://photo-cull-review.sociobot.in/`
- Work order: `photo-cull-review-verify-2`

The high-severity rate-limit defect in the first verification is resolved in fresh evidence. This verification still finds two medium acceptance defects: advertised review shortcuts stop working after the first shortcut decision, and three visible mobile navigation targets are below the contract's 44×44 CSS-pixel minimum.

## Candidate and deployment identity

- Verification ran from a detached, clean checkout at the exact candidate SHA. `git status --short` was empty before install and again after removing temporary QA-only fixtures/specs.
- `npm ci` used the committed lockfile. No product source was changed.
- The exact production command was `npm run build` (`tsc --noEmit && vite build`), producing `dist/`.
- SHA-256 byte comparisons matched the live response for 14 candidate artifacts: `index.html`, app JS/CSS, `sw.js`, manifest, offline page, privacy and terms pages, three PNG icons, local font, and desktop/mobile hero images. This is stronger build identity evidence than a deploy label because the static host exposes no commit header.
- HTTPS root returned 200. Plain HTTP returned 301 to HTTPS.

## Clean-checkout quality gates

| Check | Fresh result |
| --- | --- |
| `npm ci` | PASS — 60 packages installed; 61 audited; 0 vulnerabilities |
| `npm test` | PASS — 5/5 Vitest tests in 2 files |
| Type check | PASS — `tsc --noEmit` within production build |
| Lint | Not present — repository exposes no lint script/configuration |
| `npm run build` | PASS — Vite 7.3.6; `dist/` produced |
| `npm run test:e2e` | PASS — 6/6 Chromium tests across desktop and Pixel 5 / 390×844 |
| `npm audit --audit-level=high` | PASS — 0 vulnerabilities |
| Factory `verify-url.sh` | PASS — HTTPS 200; 876 ms; title/lang/one H1/main/alt/button checks; no console/page errors |

Build sizes: app JS 28,002 B raw / 11,030 B gzip; CSS 14,710 B raw / 4,440 B gzip; self-hosted font 56,976 B; mobile hero 37,170 B; desktop hero 62,082 B. A compressed live mobile-shell sample (HTML + JS + CSS + font + mobile hero) transferred about 110 KB. The 200 KB JS, 50 KB CSS, 120 KB font, and 300 KB hero budgets pass.

## End-to-end product evidence

- Desktop at 1440×1000: a selected folder containing two byte-identical JPEGs became an exact-copy group using full SHA-256. Keep/review decisions, decision undo, blocked completion while a candidate remained undecided, completion, refresh persistence, and CSV download all worked.
- The CSV began `# PLAN ONLY — Photo Cull Review never moved or deleted these files.` and contained the source path, `_photo-review/` destination, size, full SHA-256, `exact` group type, and explanation. Fixture hashes were identical before and after the browser workflow.
- Two distinct JPEG files with equal capture time and a small visual change were grouped as `These frames look related`, stamped `Suggestion`, and explicitly said the grouping does not prove duplication. This confirms the brief's perceptual-candidate path end to end.
- A single valid image produced `No candidates to review` and a clear no-change state.
- An unsupported text-only folder produced the supported-format error; selecting a valid folder immediately afterward recovered.
- Malformed JSON produced a visible restore error. A valid product/version backup then restored a named empty workspace.
- Free-tier boundary: 750 supported images were accepted and indexed in 8.4 seconds in the test environment; 751 were rejected before scanning with the stated 750-file limit, and a following valid scan recovered.
- Invalid license return: `?license=qa-invalid-license-verifier-2` was stored under `sb_license:photo-cull-review`, stripped from the address bar, verified once, cached as invalid, and returned the UI to the free state. The buy link targets only the Sociobot checkout URL and price/legal copy states US$19 one time.
- There is no sign-in feature or identity-provider request, so the Entra External ID authority requirement is not applicable.

## PWA, offline, and update behavior

- Chrome recognized `manifest.webmanifest` with no manifest errors, standalone display, versioned start URL, 192/512/maskable icons, and the design-token theme/background colors. The host serves the manifest as `application/octet-stream`, but Chrome parsed it successfully.
- After worker control, the live cache was `photo-cull-shell-v1` with 13 shell entries. A saved review reloaded offline with its decision intact and the visible offline banner.
- The worker source has a versioned cache, shell precache, same-origin cache-first assets, navigation network-first/fallback behavior, billing network-first behavior, old-cache removal, `skipWaiting()`, and `clients.claim()`.
- In a controlled local update check using the exact candidate build and a changed worker response, `registration.update()` installed the replacement and the app displayed `An update is ready. Reload to use it.`

## Accessibility, responsive behavior, and browser quality

- Axe 4.13.0 found zero violations (and therefore zero serious/critical findings) on live desktop welcome, populated review, and 390×844 mobile welcome screens.
- Factory URL verification and additional capture found no console errors, page errors, or failed requests. Pages have one H1, `lang=en`, title, main landmark, image alternatives, named buttons, labels, status/error live regions, and a skip link.
- The visible focus treatment is a 3 px solid `#a93228` outline; its contrast against paper is 5.71:1. Native license-dialog focus entered on Close, Escape closed it, and focus returned to the trigger.
- The 390 px viewport had no horizontal overflow (`scrollWidth = innerWidth = 390`). Reduced motion computed `scroll-behavior: auto` and transition duration `0.00001s`. Visual inspection found no clipping on desktop or mobile.
- Lighthouse 13.4.1 mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.1 s, LCP 1.5 s, TBT 60 ms, CLS 0, Speed Index 1.1 s; no run warnings.

## Privacy, outbound traffic, policies, and rate limiting

- A fresh free workflow requested only `https://photo-cull-review.sociobot.in`. No analytics, tracking, CDN, hosted font/script, media upload, or sign-in request was observed.
- With the invalid local license, the only cross-origin request was the documented `GET https://api.sociobot.in/api/v1/products/photo-cull-review/verify?license=…`. Source inventory likewise contains no other runtime endpoint.
- Media previews, hashes, file paths, groups, history, and decisions persist in IndexedDB; the token/verdict persist in localStorage; CSV/JSON are local downloads. Privacy and terms pages accurately describe this boundary.
- Verification API policy response: 200 JSON, `Cache-Control: no-store`, origin-specific CORS, and `Vary: origin, access-control-request-method, access-control-request-headers`.
- **Fresh rate-limit result: PASS.** A burst of 300 verification requests at concurrency 50 completed in 975 ms: 30 returned 200 and 270 returned 429. A sampled 429 included `Retry-After: 4` and `Too Many Requests! Wait for 4s`. Observed burst allowance was 30 responses before the limiter accounted for the rest; precise arrival ordering is indeterminate under concurrency. A follow-up during refill returned 3×200 and 42×429, with `Retry-After` still present. This supersedes the first report's no-limit finding.
- Static response policy: HSTS (`max-age=10886400; includeSubDomains; preload`), `Referrer-Policy: strict-origin-when-cross-origin`, `X-Content-Type-Options: nosniff`, legacy XSS protection, and DNS-prefetch off are present. CSP/frame protection, Permissions-Policy, COOP, and CORP are absent.
- Root, worker, app JS/CSS, font, and images all use `Cache-Control: public, must-revalidate, max-age=30`; stable app assets do not receive long-lived immutable caching.

## Defects

### Medium — advertised decision shortcuts stop after the first shortcut decision

Reproduction on the exact-copy group:

1. Focus `Your review desk` and press K. The first asset becomes Keep.
2. The render deliberately focuses that asset's Keep button.
3. Press R. The second asset remains undecided; the decision count stays 1.

The global shortcut handler ignores events whose target is a button/link/input, so K/R/S/arrow shortcuts are unavailable after the first shortcut places focus on a decision button. All decisions remain reachable with Tab plus Space/Enter, so this is not a keyboard trap, but it conflicts with `.factory/design.md` and the visible `K keep · R review` instruction. Restore sequential shortcut behavior without interfering with native control activation.

### Medium — visible mobile link targets are below 44×44 CSS px

At 390×844, computed visible target boxes included:

- Brand/home: 185×34 px
- Footer Privacy: 47×20 px
- Footer Terms: 39×20 px

The visually hidden 1×1 folder input was excluded because its labeled visible button is 44+ px. Add padding/minimum block size to the three visible links while preserving spacing and safe-area behavior.

### Low — deployment response hardening and immutable caching are incomplete

The static host lacks CSP/frame controls, Permissions-Policy, COOP, and CORP. Stable assets are revalidated after 30 seconds instead of using versioned/hash-named immutable caching. These did not cause a functional, axe, privacy, or Lighthouse failure, but remain policy/performance hardening gaps.

## Acceptance decision and required recheck

**FAIL.** The prior high rate-limit blocker is fixed, and the core local-first product works end to end. Release acceptance still requires the two medium keyboard/touch defects to be corrected because keyboard and ≥44 px touch targets are explicit non-negotiable contract requirements. Rebuild and redeploy, then repeat the desktop sequential K/R check, all visible 390 px target measurements, repository gates, artifact parity, offline/update checks, axe, and the API burst.
