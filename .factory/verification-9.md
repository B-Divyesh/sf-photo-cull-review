# Independent verification 9 — Photo Cull Review

**Result: PASS**

- Candidate commit: `122e36f4232cc7ccff5b09170182eaeef54d4bd2`
- Verified URL: <https://photo-cull-review.sociobot.in/>
- Verification date: 2026-09-02
- Scope: clean locked install, local production build, full automated suite, all
  declared claims through the demo entry point, and independent live-browser QA.

## First read

Cold-opening the live desktop page answered the required questions in plain
words: it helps households clean up duplicate photos before moving anything;
it is for people with large or crowded photo archives; and the first action is
**Try it with sample data**. The adjacent explanation says it opens a
four-file sample review immediately. The action was in the first screen on
desktop (`y=532.5`, 900 px viewport) and at 390 px (`y=575.75`, 844 px
viewport). The one-click demo loads an isolated review desk with the persistent
“Demo — sample data, separate from your workspace” banner.

## Required claims

`.factory/claims.json` is present and contains 20 claims. From the clean
checkout after `npm ci`, I executed every declared command exactly as listed.
All completed successfully. The subsequently run unfiltered suite independently
covered the same browser claims and finished with Playwright status `passed`.

| Claims | Result | Evidence |
| --- | --- | --- |
| `exact-duplicates`, `csv-export`, `workspace-persistence`, `offline-reload`, `local-only` | PASS | individual declared commands; full suite |
| `demo-sandbox`, `workspace-backup`, `archive-pass-unlimited`, `license-verification-request`, `group-explanations` | PASS | individual declared commands; full suite |
| `image-previews`, `free-export`, `no-setup`, `storage-controls`, `runtime-privacy`, `merchant-refund` | PASS | individual declared commands; full suite |
| `similar-suggestions`, `free-limit`, `video-streaming`, `capture-time`, `supported-formats` | PASS | individual declared commands; full suite |

## Local verification

- `npm ci` — passed; 60 packages installed, 0 audit vulnerabilities.
- `npm test` — **12/12 passed**.
- `npm run build` — passed (`tsc --noEmit` and Vite); produced `dist/`.
- `npm run test:e2e` — **54 checks passed** (the suite records its expected
  target-specific skips); `test-results/.last-run.json` reports `"status":
  "passed"` and no failed tests.
- Production bundle: JavaScript 37,978 B raw / **14.08 kB gzip**; CSS 18,633 B
  raw / **5.15 kB gzip**. This is well under the static initial-JS and CSS
  budgets.

The automated and live flows exercised exact-copy grouping, cautious
30-second burst suggestions, a decision/export flow, backup restore, demo
reset/isolation, the 750/751-file boundary, unsupported-folder recovery,
invalid-backup recovery, license unavailable/cached recovery, and the US$12
hosted checkout contract. CSV output is explicitly a plan and includes source
path, review path, complete SHA-256, group type, and reason; originals are not
moved or deleted.

## Live deployment, privacy, PWA, and accessibility

- Candidate identity matches deployment: SHA-256 values match byte-for-byte for
  local and live `assets/app-v8.js`
  (`28e8768f49aae800788b41b759705bc89aa11f8b0ade3e77cf496f8679ed0df6`),
  `assets/app-v8.css`
  (`aa9b28c79dc72cb9834e7129680f3706b03754f17e94e184e7285201c3207f9b`),
  and `sw.js`
  (`aabe6bb193de86a45d0a3bffc160a5e79ab8f97966ef558032796a7b6a6837fe`).
- `/opt/fleet/lib/verify-url.sh` on the live home passed: HTTP 200, title,
  `lang=en`, one h1, main landmark, no missing image alt text or unlabelled
  buttons, and no page/console errors. It loaded in 873 ms in this run.
- Independent Playwright/Axe checks found **zero serious or critical** issues
  on home, demo, Privacy, Terms, and the designed 404 route. Desktop and 390 px
  mobile had no horizontal overflow; 200% text reflow passed on all routes;
  focus began with the skip link and used a visible 3 px ring; reduced motion
  disabled hero animation and smooth scrolling.
- Outgoing requests during the unlicensed home, demo, legal, and complete demo
  decision/export flow were only to `https://photo-cull-review.sociobot.in`.
  The browser suite also verifies that, with a license, the sole cross-origin
  request is the documented Sociobot verification endpoint. No third-party
  fonts, scripts, analytics, ads, or tracking requests were observed.
- Service worker update/offline check passed: a controlled fresh context used
  `photo-cull-shell-v9` (20 cached entries); after `context.setOffline(true)` a
  reload retained the demo banner, review desk, saved decision, and offline
  status.
- Response checks passed: HTML and manifest are revalidated; hashed JS/CSS are
  one-year immutable; `sw.js` is no-cache. CSP, HSTS, `nosniff`, strict
  referrer policy, permissions policy, COOP/CORP, and frame denial were present.
- Lighthouse 13.4.0 mobile, independent live run: **97 performance, 100
  accessibility, 100 best practices, 100 SEO**; FCP 1.1 s, LCP 1.5 s, TBT
  190 ms, CLS 0.
- Hosted checkout returned Photo Cull Review in USD with a US$12.00 subtotal
  and total.
- License verification allowance check: requests 1–30 from one client returned
  200; request 31 returned **429** with `Retry-After: 3`.

The missing-route navigation naturally logs the browser’s failed 404 resource
message; the designed `/404.html` itself has no application console/page error.
This is not an application defect.

## Defects by severity

None found.

## Handoff

The candidate is acceptable for release. Re-run with `npm ci`, `npm test`,
`npm run test:e2e`, and `npm run build`; use `/?demo=1` for a deterministic
manual smoke test.
