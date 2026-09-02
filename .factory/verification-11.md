# Independent verification 11 — Photo Cull Review

**Result: FAIL**

- Candidate commit: `dd405cb64a5d37b16d7ce0bfdb473262a1160abe`
- Verified URL: <https://photo-cull-review.sociobot.in/>
- Verification date: 2026-09-02
- Work order: `photo-cull-review-verify-11`
- Scope: claims-first verification, clean locked install, complete local suites,
  exact production build, and independent live desktop/mobile/PWA review.

The candidate is not acceptable for release because three visible links fail
the supplied non-negotiable 44 px touch-target baseline at 390 px. No product
code was modified during verification.

## Mandatory first read

The cold live page passes the first-read gate on desktop and at 390 × 844:

- What it does: “Clean up duplicate photos. Before anything moves.”
- Who it is for: households with large or crowded photo archives.
- What to click first: **Try it with sample data**. The adjacent text says it
  opens a four-file sample review in this browser.

The sample action is fully visible in the first viewport at 390 px
(`y=561.75–614.09`) and desktop (`y=532.55–583.34`). One click opens four
sample files and two candidate groups. The persistent banner identifies the
separate sample workspace and provides **Reset demo** and **Start for real**.

## Claims-first gate

`.factory/claims.json` exists with 21 entries. Immediately after `npm ci`, I
ran every listed `test` command separately and exactly as written. Result:
**21/21 passed, 0 failed**. Every claim ID occurs exactly once in the test
sources.

| Claim IDs | Result |
| --- | --- |
| `exact-duplicates`, `similar-suggestions`, `csv-export`, `workspace-persistence`, `offline-reload` | PASS |
| `local-only`, `demo-sandbox`, `free-limit`, `workspace-backup`, `archive-pass-above-limit` | PASS |
| `video-streaming`, `license-verification-request`, `group-explanations`, `capture-time`, `supported-formats` | PASS |
| `image-previews`, `free-export`, `no-setup`, `storage-controls`, `runtime-privacy`, `merchant-refund` | PASS |

Landing, workspace, README, Privacy, and Terms copy was cross-checked against
the claim manifest. No unlisted material product claim was found.

## Clean local verification

- `npm ci` — passed; 60 packages installed, 0 audit vulnerabilities.
- `npm test` — **12/12 passed**.
- `npm run test:e2e` — **54 passed, 2 intentional target-specific skips, 0
  failed**.
- `npm run build` — passed; this includes `tsc --noEmit` and generated `dist/`.
- `git diff --check` — passed before report edits.
- No separate lint command or configuration is supplied.
- Production output: JavaScript 38,460 B raw / 14.14 kB gzip; CSS 20,188 B raw
  / 5.40 kB gzip; font 56,976 B; mobile hero 37,170 B. All stated budgets pass.

## Useful-product and recovery checks

The live sample was completed through both the exact-copy and likely-burst
groups with keyboard decisions. It reached “Your plan is ready” and exported
`photo-cull-move-plan-2026-09-02.csv`. The CSV contained source and separate
review paths, byte counts, complete SHA-256 hashes, group type, and cautious
reasons. It explicitly says it is a plan and does not move or delete originals.
Reset returned the sample decisions to undecided.

Fresh checks covered shipped JPEG exact copies, 30/31-second similarity
boundaries, streamed video hashing, all documented formats, the 750/751-file
free boundary, demo/real storage separation, reload persistence, workspace
backup/restore, an unsupported-text-only folder, malformed JSON recovery, an
unavailable first license verification, and a previously valid cached license
during a failed recheck. Recovery messages named what happened and the next
action, and the review desk remained usable.

The hosted checkout redirected to Dodo and showed Photo Cull Review in USD
with a **US$12.00 subtotal and total**. The product has no sign-in, so the
Microsoft Entra authority requirement is not applicable.

## Deployment identity, privacy, and response behavior

All 24 public files in fresh `dist/` matched the live files byte-for-byte.
Representative SHA-256 matches include:

| Artifact | Local and live SHA-256 |
| --- | --- |
| `index.html` | `719a5d1a8bf676d558bf6800e326ec435485fb9e09db25e1c47e244b1b61d27e` |
| `assets/app-v9.js` | `9de526ad9bd25c47bf5cf0a0200b7bdda16797a18cc584afa139fa0b9cb8b81f` |
| `assets/app-v9.css` | `2c136ba5a28f113fb0472f1bee836768e7d73256758ff18bfa289033b835eb20` |
| `sw.js` | `27e8960738a0671246bd5a0ba517f9e17889a7dae74b187db2ddf972abbbe68e` |
| `manifest.webmanifest` | `45d19610f3699ef32fb8d2ec9e3f95e3598f6c7bbc42b9e04a5d8305455294d5` |

`staticwebapp.config.json` correctly returns 404 because it is deployment
configuration, not a public artifact.

The outgoing request log for the cold page, demo, legal pages, and complete
unlicensed review/export flow contained only the product origin. A fresh live
invalid-license flow made exactly one cross-origin request, to the documented
`https://api.sociobot.in/api/v1/products/photo-cull-review/verify` endpoint;
it returned 200, stored the token locally, removed it from the address bar,
and showed the inactive-license recovery notice. No ads, analytics, trackers,
third-party scripts, or CDN fonts were observed.

HTML and manifest responses use 30-second revalidation. Hashed JS/CSS use
one-year immutable caching. `sw.js` is `no-cache, no-store, must-revalidate`.
Live responses include CSP with header-level `frame-ancestors`, HSTS,
`nosniff`, strict referrer policy, Permissions-Policy, COOP/CORP, and frame
denial. Normal routes had no console or page errors. The deliberate missing
route returns the designed HTTP 404; its browser resource error is expected.

The product verification endpoint enforced an allowance of **30 requests per
client window**. Requests 1–30 returned 200 with `Cache-Control: no-store`.
Requests 31–35 returned **429**, each with `Retry-After: 4`.

All discovered links were checked: product routes and `sociobot.in` returned
200; the product checkout returned the expected 303 to Dodo. `robots.txt`,
`sitemap.xml`, and the manifest returned 200 with appropriate content types.

## Accessibility, responsive behavior, and PWA

- `/opt/fleet/lib/verify-url.sh` passed live: HTTP 200, 688 ms load, title,
  `lang=en`, one h1, main landmark, image alternatives, labelled buttons, and
  zero home-page console/page errors.
- Playwright Axe found **0 serious/critical violations** on home, populated
  demo, Privacy, Terms, and the designed 404.
- Desktop and 390 px pages had no horizontal overflow. Every checked route
  reflowed at 200% text without horizontal overflow.
- Keyboard traversal begins at the skip link and shows a 3 px focus ring. The
  demo's K/R/arrow decision sequence completed both groups. Dialog focus/Escape,
  undo, native controls, and route focus behavior passed the full browser suite.
- Reduced motion computed `scroll-behavior: auto` and disabled the hero
  animation. Focus-ring contrast was 5.71:1 against the paper background.
- The service worker controlled the live page, was activated, and used
  `photo-cull-shell-v10` with 21 entries. `registration.update()` completed
  with no waiting worker because the live worker was current. Offline reload
  retained the demo banner, review heading, saved state, and local previews.

The release-blocking touch-target defect is detailed below. Hidden 1 × 1 file
inputs are excluded because separate visible controls with compliant targets
activate them.

## Performance

Fresh Lighthouse 13.4.1 mobile result: **97 performance, 100 accessibility,
100 best practices, 100 SEO**. FCP was 1.16 s, LCP 1.50 s, total blocking time
200.5 ms, Speed Index 1.16 s, and CLS 0. Total transfer was 117,830 B with no
third-party bytes. The lab run had no INP because it made no interaction.

## Defects by severity

### Medium — F-11-1: visible mobile links miss the required 44 px touch area

At a 390 × 844 viewport, these visible links have measured browser hit areas
below the supplied 44 × 44 px baseline:

- `/privacy/` contact link `sociobot.in`: **92.5 × 20 px**.
- Archive-pass dialog `Terms`: **37.7 × 15 px**.
- Archive-pass dialog `Privacy`: **46.3 × 15 px**.

The external `sociobot.in` link also lacks the site's required visible or
accessible external-link indication. Enlarge the hit areas to at least 44 px
in both dimensions, preserve adequate separation, and identify the external
destination. Add a 390 px regression test that opens the dialog and measures
all visible interactive targets.

- Critical: none.
- High: none.
- Medium: F-11-1.
- Low: none beyond the external-link indication included in F-11-1.

## Verdict

**FAIL.** All functional, claims, privacy, deployment, performance, and PWA
checks pass, but F-11-1 violates the attached non-negotiable accessibility
baseline. Repair it and rerun the mobile target measurements plus the complete
claims and browser suites.
