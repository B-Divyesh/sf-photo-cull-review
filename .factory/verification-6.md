# Independent verification 6 — PASS

- Candidate: `75093ea3820c692a399e87f4b7b5b5a1e1876f68`
- Verified URL: <https://photo-cull-review.sociobot.in/>
- Demo URL: <https://photo-cull-review.sociobot.in/?demo=1>
- Date: 2026-09-01 UTC
- Work order: `photo-cull-review-verify-6`
- Result: **PASS — ready to release.**

No release-blocking product defect was found. The 22 deployable files from a
fresh local production build match the live files byte-for-byte by SHA-256.
`staticwebapp.config.json` is correctly excluded because it is host
configuration, not a served product asset.

## First read and demo

**PASS.** A cold 1440 × 900 visit gives all required first-screen answers in
plain words:

- It does: **“Clean up duplicate photos. Before anything moves.”**
- It is for: households with large or crowded photo archives.
- First action: **“Try it with sample data”**, with the visible outcome
  “Opens a four-file sample review immediately.”

The same first screen includes the three facts that photos stay on the device,
the app works offline after first visit, and the free limit is 750 files. The
action is a one-click demo. It opened a ready four-file review containing an
exact-copy pair and a cautious burst suggestion, plus the persistent
“Demo — sample data, separate from your workspace” banner, Reset demo, and
Start for real controls. The desktop cold-screen evidence is
[first-read-desktop.png](verification-6-artifacts/first-read-desktop.png); the
390 px evidence is [live-mobile.png](verification-6-artifacts/live-mobile.png).

## Required claim checks

`.factory/claims.json` is present with 12 entries. Each specified command was
run from the fresh dependency installation against the product's demo-capable
production entry point. All passed.

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

The landing page and README claims map to that inventory: local-only use,
offline reload, duplicate and burst grouping, plan-only CSV export, workspace
backup, demo isolation, file limits, streamed video matching, and the one
documented license verification request. No material unlisted visitor promise
was identified.

## Clean-checkout gates

| Check | Result |
| --- | --- |
| Candidate identity | PASS — local `HEAD` was the supplied SHA before QA documentation |
| `npm ci` | PASS — 60 packages installed; 0 reported vulnerabilities |
| `npm test` | PASS — 11/11 tests in 3 files |
| `npm run build` | PASS — strict TypeScript check and Vite build; `dist/` produced |
| `npm run test:e2e` | PASS — 36 passed; 2 expected project skips |
| Lint | Not available — no lint script or configuration is supplied |
| `npm audit --audit-level=high` | PASS — 0 vulnerabilities |
| `git diff --check` | PASS |

The factory URL checker passed on the live URL in 763 ms: HTTP 200, title,
`lang=en`, exactly one H1, a main landmark, image alternative text, labelled
buttons, and no console/page errors. Evidence:
[verify.json](verification-6-artifacts/verify-url/verify.json).

## Product workflow, limits, and recovery

- In the live demo, keyboard K then R made keep/review decisions. Export
  produced `photo-cull-move-manifest-2026-09-01.csv` and the visible plan
  count was “1 marked for the review folder so far.”
- The exact-copy claim compares an original fixture SHA-256 before and after
  review/export; the source was unchanged. The generated CSV is a move plan,
  not an operation on media.
- Full browser and unit coverage passed for a single-file no-candidate state,
  unsupported input recovery, malformed backup recovery, JSON backup restore,
  workspace persistence, the 750/751 boundary, successful licensed 751-file
  path, video stream hashing, and capture-time parsing.
- The previously reported new-token case was repeated on the live bundle. A
  first verification made unavailable left no cached verdict, showed no active
  Archive pass, created no scan work, and rejected 751 files before scanning
  with the stated free-limit message. A cached successful verdict continues to
  work if its scheduled recheck is unavailable; invalid returns show an
  inactive-license notice.

## Privacy, rate allowance, and response policy

- A full live demo review, decisions, CSV export, and reset made requests only
  to `https://photo-cull-review.sociobot.in`; no photo, thumbnail, hash, path,
  or decision went to another origin. No analytics, third-party font/script,
  cloud-media, or sign-in integration is present. Sign-in tenant checks are
  not applicable.
- The only additional runtime origin in the supplied-license path is the
  documented Sociobot verification endpoint. The test first-use unavailable
  path made no successful external data transfer and remained at the free
  limit.
- A fresh 35-request allowance check to the product verification endpoint
  yielded **30 HTTP 200 and 5 HTTP 429** responses. The first 429 supplied
  `Retry-After: 4`; a successful response supplied `Cache-Control: no-store`
  and origin-specific CORS. The observed allowance is 30 successful requests
  in this window.
- The live root, assets, worker, manifest, Privacy, Terms, and 404 responses
  provide CSP including response-header `frame-ancestors`, HSTS, `nosniff`,
  strict referrer policy, Permissions-Policy, COOP, CORP, and
  `X-Frame-Options: DENY`. Versioned JS/CSS are immutable for one year;
  `sw.js` is `no-cache, no-store, must-revalidate`. The unknown route returns
  the designed 404 with HTTP 404. Every discovered same-origin link returned
  200; the product checkout link returned its expected HTTP 303 to hosted
  checkout.

## PWA, accessibility, and performance

- The live manifest and icon set load without browser errors. The service
  worker controls the page, uses `photo-cull-shell-v7`, has no waiting update
  after `registration.update()`, and reloads the demo workspace offline with
  “Offline — your saved review is still available on this device.” The full
  suite also passes the update-ready announcement check.
- Axe 4.13.0 found zero serious or critical findings on populated demo,
  Privacy, Terms, and 404. Keyboard testing reached the visible 3 px skip-link
  focus state; the suite confirms shortcut use, dialog Escape/focus return,
  and normal review-button operation. Reduced motion computes
  `scroll-behavior: auto` and no hero animation.
- At 390 px, header targets measure 201.8 × 44, 59.8 × 44, 47.2 × 44,
  74.3 × 44, and 75.9 × 44 px with 16–17 px text; the mobile regression
  verifies their 8 px separation. At 200% text size, home, demo, Privacy,
  Terms, and 404 each measured `clientWidth: 390` and `scrollWidth: 390`.
- Fresh live Lighthouse 13.4.1 mobile scores were Performance 100,
  Accessibility 100, Best Practices 100, and SEO 100. FCP and LCP were
  0.4 s, TBT 0 ms, CLS 0, and Speed Index 0.3 s. Full output:
  [lighthouse-live.json](verification-6-artifacts/lighthouse-live.json).
- Production build sizes: JS 37,231 B raw / 13,777 B gzip; CSS 18,633 B raw /
  5,154 B gzip; self-hosted font 56,976 B; mobile hero 37,170 B; desktop hero
  62,082 B. All applicable budgets pass.

## Design and documentation

The shipped warm-paper/darkroom system matches `.factory/design.md`: one
self-hosted Newsreader font, original locally served moonlit archive artwork,
a cautious comparison-focused visual grammar, full reduced-motion fallback,
and documented asset provenance. README, MIT license, Privacy, Terms, demo
instructions, manifest, sitemap, and route metadata are present.

## Findings by severity

| Severity | Finding |
| --- | --- |
| Critical | None |
| High | None |
| Medium | None |
| Low | None |

## Acceptance decision

**PASS.** Candidate `75093ea3820c692a399e87f4b7b5b5a1e1876f68` meets the
researched brief and the stated PWA, privacy, demo, accessibility, performance,
and paid-license verification requirements at the tested live URL.
