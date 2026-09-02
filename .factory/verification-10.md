# Independent verification 10 — Photo Cull Review

**Result: PASS**

- Candidate commit: `3c05a3093162cf823d544f2ebc0d53a0a47739f3`
- Verified URL: <https://photo-cull-review.sociobot.in/>
- Verification date: 2026-09-02
- Scope: clean locked install, every declared claim command, the complete local
  suite and production build, and independent live desktop/mobile/PWA QA.

## Mandatory first read

A cold 390 × 844 visit answers all three acceptance questions in its first
screen:

- What it does: “Clean up duplicate photos. Before anything moves.”
- Who it is for: households with large or crowded photo archives.
- What to click first: **Try it with sample data**, followed by “Opens a
  four-file sample review immediately.”

The action is fully visible at `y=575.75–628.09` in the 844 px viewport. One
click opens the actual review desk with four files and two candidate groups.
The persistent banner says “Demo — sample data, separate from your workspace”
and provides **Reset demo** and **Start for real**.

## Claims-first gate

`.factory/claims.json` is present with 21 entries. After `npm ci`, I ran every
listed `test` command individually and exactly as written. Result: **21/21
passed, 0 failed**.

| Claim IDs | Result |
| --- | --- |
| `exact-duplicates`, `similar-suggestions`, `csv-export`, `workspace-persistence`, `offline-reload` | PASS |
| `local-only`, `demo-sandbox`, `free-limit`, `workspace-backup`, `archive-pass-unlimited` | PASS |
| `video-streaming`, `license-verification-request`, `group-explanations`, `capture-time`, `supported-formats` | PASS |
| `image-previews`, `free-export`, `no-setup`, `storage-controls`, `runtime-privacy`, `merchant-refund` | PASS |

Landing, workspace, README, Privacy, and Terms claims were cross-checked
against the manifest. No unlisted material claim was found.

## Clean local verification

- `npm ci` — passed; 60 packages installed and 0 audit vulnerabilities.
- `npm test` — **12/12 passed**.
- `npm run test:e2e` — **54 passed, 2 expected target-specific skips, 0
  failed**; `test-results/.last-run.json` records `"status": "passed"`.
- `npm run build` — passed; this runs `tsc --noEmit` and Vite and creates
  `dist/`. The repository has no separate lint command.
- Production output: JS 38.17 kB raw / **14.11 kB gzip**; CSS 19.65 kB raw /
  **5.32 kB gzip**; font 56.98 kB; mobile hero 37.17 kB. All are under the
  contract budgets.

## Useful-product and recovery checks

The live one-click sample was reviewed with keyboard shortcuts and visible
controls through both exact-copy and likely-burst groups. It produced a CSV
move plan with source path, separate review path, size, complete SHA-256,
group type, and cautious reason. The page reached “Your plan is ready”; the
sample reset returned decisions to undecided. No originals were moved or
deleted.

Fresh checks also covered the 750/751 supported-file boundary, invalid license
verification, a stale cached license while offline, a folder containing only
unsupported text, malformed JSON backup recovery, workspace backup/restore,
demo/real IndexedDB isolation, exact hashes, 30/31-second burst boundaries,
image previews, and stream-only video hashing. Errors gave a recovery action
and the review desk remained usable.

The hosted checkout redirected to Dodo and showed Photo Cull Review in USD
with a **US$12.00 subtotal and total**. The product needs no sign-in, so the
Entra authority requirement is not applicable.

## Live identity, privacy, and response behavior

The candidate and deployment match byte-for-byte:

| Artifact | SHA-256 (local and live) |
| --- | --- |
| `index.html` | `ee558849cc4ce1a8814b533d4e8592d9b879c3652939b723b49ca787ebdda47e` |
| `assets/app-v8.js` | `01f24ada6d7ef2676e8a889eceb52ecb2b38490a63db258d50279c1a3005d29b` |
| `assets/app-v8.css` | `3121559bdf837b04c8bef5f970842dc385aa4dd255983992767147a77539be1b` |
| `sw.js` | `aabe6bb193de86a45d0a3bffc160a5e79ab8f97966ef558032796a7b6a6837fe` |
| `manifest.webmanifest` | `b8242dab67f15c27773a44ddd1b69c4b3608034879b888434caa9f97c9b2b853` |

The outgoing request log for home, demo, legal pages, and a complete
unlicensed review/export flow contained only
`https://photo-cull-review.sociobot.in`. The claim suite confirms that a
supplied license adds only the documented Sociobot verification request. No
ads, analytics, trackers, third-party fonts, or runtime scripts were observed.

HTML/manifest responses use short revalidation; hashed JS/CSS use one-year
immutable caching; `sw.js` is `no-cache, no-store, must-revalidate`. Live
responses include CSP, HSTS, `nosniff`, strict referrer policy, permissions
policy, COOP/CORP, and frame denial. The CSP permits only the product origin
plus the documented Sociobot billing origins for connections.

The product verification endpoint enforced **30 requests per client window**.
Requests 1–30 returned 200; request 31 returned **429** with
`Retry-After: 3`.

## Accessibility, responsive behavior, and PWA

- `/opt/fleet/lib/verify-url.sh` passed live: HTTP 200, title, `lang=en`, one
  h1, main landmark, image alternatives, labelled buttons, and zero home-page
  console/page errors (756 ms load in that run).
- Playwright Axe found **0 serious/critical findings** on home, demo, Privacy,
  Terms, and the designed 404.
- Desktop and 390 px mobile had no horizontal overflow. The demo's first exact
  comparison and both 46 px decision controls are visible in the first mobile
  screen. All tested routes reflowed at 200% text without horizontal overflow.
- Keyboard traversal begins with the skip link; focus uses a visible 3 px red
  ring. Enter/Space controls, K/R/S decisions, arrows, undo, and dialog focus
  behavior passed the browser suite. Reduced motion disables hero animation
  and smooth scrolling.
- All discovered same-origin links and assets returned 200; the external
  Sociobot site returned 200 and checkout returned the expected 303.
- The service worker was controlling and activated with 20 entries in
  `photo-cull-shell-v9`. `registration.update()` completed without a waiting
  worker; the update-ready notification regression test passed. After browser
  offline mode and reload, the demo banner, local previews, saved decision,
  workspace, and offline status remained available.

The intentional request to a nonexistent route returns the designed 404. Its
browser “failed to load resource: 404” message is expected for that probe;
normal product routes had no console or page errors.

## Performance

Fresh Lighthouse 13.4.1 mobile result: **100 performance, 100 accessibility,
100 best practices, 100 SEO**. FCP was 1.1 s, LCP 1.5 s, total blocking time
0 ms, Speed Index 1.1 s, and CLS 0. A cold service-worker-blocked request used
115,764 bytes for mobile subresources (about 116.4 kB including compressed
HTML), under the first-load budget.

## Defects by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none.

The candidate is acceptable for release.
