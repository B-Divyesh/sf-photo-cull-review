# Independent verification 7 — FAIL

- Candidate: `c6589c1f64a454ae61f43f93c7b3184e1a5de4ab`
- Verified URL: <https://photo-cull-review.sociobot.in/>
- Demo URL: <https://photo-cull-review.sociobot.in/?demo=1>
- Date: 2026-09-01 UTC
- Work order: `photo-cull-review-verify-7`
- Result: **FAIL — do not release this candidate.**

The product and deployment pass the functional, privacy, PWA, accessibility,
performance, and mandatory first-read gates. Release is nevertheless blocked by
a material live price contradiction: the product advertises a one-time **US$19**
Archive pass, while its Sociobot checkout opens a Dodo order for **$12.00**.

## First read and demo

**PASS.** A cold 1440 × 900 visit answers all three required questions in the
first viewport:

- What it does: **“Clean up duplicate photos. Before anything moves.”**
- Who it is for: households with large or crowded photo archives.
- What to click first: **“Try it with sample data”**, followed by “Opens a
  four-file sample review immediately.”

The three visible facts say photos stay on the device, the app works offline
after its first visit, and folders up to 750 files are free. The one-click action
opened a ready four-file review with an exact-copy pair, a cautious burst
suggestion, and the persistent demo/reset/start-for-real controls. Evidence:
[desktop](verification-7-artifacts/first-read-desktop.png) and
[390 px mobile](verification-7-artifacts/live-cold-mobile.png).

## Mandatory claim commands

`.factory/claims.json` exists with 21 entries. From a clean candidate checkout,
after `npm ci`, every recorded command was run separately and exited zero.
Each claim ID occurs on exactly one test definition.

| Claim | Declared test result |
| --- | --- |
| `exact-duplicates` | PASS — 2 browser projects |
| `similar-suggestions` | PASS — 1 unit test |
| `csv-export` | PASS — 2 browser projects |
| `workspace-persistence` | PASS — 2 browser projects |
| `offline-reload` | PASS — 2 browser projects |
| `local-only` | PASS — 2 browser projects |
| `demo-sandbox` | PASS — 2 browser projects |
| `free-limit` | PASS — 1 unit test |
| `workspace-backup` | PASS — 2 browser projects |
| `archive-pass-unlimited` | **Command PASS; live price claim FAILS** |
| `video-streaming` | PASS — 1 unit test |
| `license-verification-request` | PASS — 2 browser projects |
| `group-explanations` | PASS — 2 browser projects |
| `capture-time` | PASS — 1 unit test |
| `supported-formats` | PASS — 1 unit test |
| `image-previews` | PASS — 2 browser projects |
| `free-export` | PASS — 2 browser projects |
| `no-setup` | PASS — 2 browser projects |
| `storage-controls` | PASS — 2 browser projects |
| `runtime-privacy` | PASS — 2 browser projects |
| `merchant-refund` | PASS — 2 browser projects |

The `archive-pass-unlimited` test asserts the page's US$19 text, a mocked valid
verification response, and the 751-file licensed path. It never follows the
real checkout to verify the amount. Therefore its zero exit code does not prove
the complete quantitative claim and allowed the live $12/$19 contradiction to
pass unnoticed.

## Clean-checkout gates

| Check | Result |
| --- | --- |
| Candidate identity | PASS — clean detached checkout at the supplied SHA before QA |
| `npm ci` | PASS — 60 packages installed; 0 reported vulnerabilities |
| `npm test` | PASS — 12/12 tests in 3 files |
| `npm run test:e2e` | PASS — 52 passed, 2 intentional project skips |
| `npm run build` | PASS — TypeScript check and Vite production build; `dist/` produced |
| Lint | Not available — no lint script or configuration is supplied |
| `npm audit --audit-level=high` | PASS — 0 vulnerabilities |
| `git diff --check` | PASS before documentation changes |

The build produced 37,972 B raw / 13,988 B gzip JavaScript and 18,633 B raw /
5,154 B gzip CSS. The local font is 56,976 B, mobile hero 37,170 B, and desktop
hero 62,082 B. All static-product budgets pass.

## Live deployment identity and workflow

- All 22 served build files matched the fresh candidate build byte-for-byte by
  SHA-256. `staticwebapp.config.json` is host configuration and is not served.
- A real live folder scan of the two shipped JPEGs produced “These files are
  exact copies” with complete SHA-256 evidence. Keyboard K/R decisions reached
  the completed state and exported a one-row CSV containing the source path,
  review path, byte count, full hash, group type, and reason.
- Both source fixtures retained their original
  `df7f3caabf0c8df1c65d89d8d40fc11da04acff2d76542c0402e17bdb51e9e9c`
  digest after review and export. New scan cleared the workspace across reload.
- The live demo completed through both candidate groups using keyboard
  shortcuts, exported two planned moves, and reset to undecided sample data.
- Invalid media and malformed JSON produced specific recovery messages and
  left the app usable. The 750/751 free boundary rejected 751 files before a
  scan began. A newly supplied license whose verification was unavailable did
  not unlock the paid path; a previously verified cached license remained
  usable during its scheduled recheck failure.

## Privacy, server allowance, and headers

- Cold load, a complete demo review, a real folder review, export, reset, and
  the legal pages contacted only `photo-cull-review.sociobot.in`. No media,
  thumbnail, path, hash, or decision left the product origin.
- The only cross-origin app request is the documented Sociobot license check.
  No analytics, trackers, CDN fonts/scripts, cloud-media service, or sign-in
  integration is present. The Entra tenant requirement is not applicable.
- A fresh 35-request check of the product-scoped verification endpoint returned
  **30 HTTP 200 and 5 HTTP 429** responses. The first 429 was request 31 and
  included `Retry-After: 3`. Successful responses used `Cache-Control: no-store`.
- Root, assets, service worker, manifest, legal pages, and 404 responses include
  CSP with header-level `frame-ancestors`, HSTS, `nosniff`, strict referrer
  policy, Permissions-Policy, COOP, CORP, and `X-Frame-Options: DENY`.
  Versioned JS/CSS are immutable for one year; `sw.js` is `no-cache, no-store,
  must-revalidate`. HTTP redirects to HTTPS.
- Every discovered same-origin link returned 200. An unknown route returned the
  designed page with HTTP 404. The checkout link returned its expected 303 to
  Dodo-hosted checkout.

## PWA, accessibility, and performance

- The live service worker controlled the page, activated
  `photo-cull-shell-v8`, and cached 20 shell entries. `registration.update()`
  left no waiting worker when the deployed version was unchanged. Offline
  reload retained the demo data, preview images, banner, and decision state.
  The full browser suite also passed the update-ready announcement test.
- Axe 4.13.0 found no serious or critical issues on home, populated demo,
  Privacy, Terms, or 404. Valid routes had no console or page errors.
- Keyboard testing reached the skip link and header controls with a visible
  3 px focus outline; K/R/arrow review shortcuts worked. Dialog Escape and
  focus return passed the browser suite. Reduced motion disabled hero animation
  and smooth scrolling.
- At 390 px there was no horizontal overflow; first-screen content remained
  visible, header controls were at least 44 px high, and all public routes
  reflowed at 200% text without horizontal overflow.
- Lighthouse 13.4.1 mobile scored Performance 100, Accessibility 100, Best
  Practices 100, SEO 100. FCP was 1.1 s, LCP 1.5 s, TBT 0 ms, CLS 0, and Speed
  Index 1.1 s. Evidence:
  [Lighthouse JSON](verification-7-artifacts/lighthouse-live.json) and
  [URL verifier](verification-7-artifacts/verify-url/verify.json).

## Findings by severity

### High — F-7-1: advertised and charged Archive pass prices disagree

The landing page, license dialog, README, terms, and registered claim promise
**US$19 one time**. On two fresh requests, the linked Sociobot checkout created
a Photo Cull Review order whose item price, subtotal, and total were all
**$12.00**, with no discount applied. Evidence:
[site price](verification-7-artifacts/site-price.png) and
[hosted checkout](verification-7-artifacts/checkout-price-mismatch.png).

This is a material purchase-contract contradiction and makes the quantitative
claim false at the point of payment. Fix the product's configured checkout
price or change all product copy to the intended amount. Then add a release
check that follows the product-scoped checkout redirect and asserts its actual
item name, currency, and total; a local mocked entitlement response is not
sufficient.

### Low — F-7-2: “move plan” terminology is not fully consistent

The privacy page says the app does not upload “manifests,” and the downloaded
filename is `photo-cull-move-manifest-<date>.csv`, although the current copy
audit defines “move plan” as the sole visitor-facing term and `polish-1.md`
claims the replacement was made everywhere. Use “move plan” consistently in
the privacy sentence and download name, or document why the filename is an
intentional technical exception.

### Low — F-7-3: committed browser-test count is inaccurate

`.factory/polish-1.md` and the previous handoff report “54 passed; 2 skipped.”
The actual complete run contains 54 outcomes: **52 passed and 2 skipped**.
Correct the evidence count so the handoff reflects reproducible output.

## Acceptance decision

**FAIL.** Candidate `c6589c1f64a454ae61f43f93c7b3184e1a5de4ab`
must not be released while its US$19 purchase claim resolves to a $12 checkout.
No product code was changed during this verification.
