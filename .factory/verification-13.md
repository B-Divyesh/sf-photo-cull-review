# Independent verification 13 — Photo Cull Review

**Result: PASS**

- Candidate commit: `9ed7897481f36414701c1f4d5c0c321b1e4f1137`
- Verified URL: <https://photo-cull-review.sociobot.in/>
- Verification date: 2026-09-02
- Work order: `photo-cull-review-verify-13`
- Artifact class: `pwa-offline`

No product code was changed during verification.

## Mandatory first read

A cold visit at 1440 × 1000 and 390 × 844 passes the gate:

- What it does: compares exact copies and likely photo bursts, then exports a
  move plan without moving originals.
- Who it is for: households with large or crowded photo archives.
- What to click first: **Try it with sample data**. Its adjacent note says,
  “Opens a four-file sample review in this browser.”

The primary action and all three privacy/offline/price facts fit within the
first 390 × 844 viewport. One click opens a populated four-file, two-group
review. Its persistent banner identifies separate sample data and offers both
**Reset demo** and **Start for real**.

## Claims-first gate

`.factory/claims.json` exists and lists 21 claims. After the clean checkout's
required `npm ci`, every listed `test` command was run separately and exactly
as written: **21/21 passed, 0 failed**. A source cross-check also found exactly
one `@claim:<id>` tag for every listed claim.

| Claim IDs | Result |
| --- | --- |
| `exact-duplicates`, `similar-suggestions`, `csv-export`, `workspace-persistence`, `offline-reload` | PASS |
| `local-only`, `demo-sandbox`, `free-limit`, `workspace-backup`, `archive-pass-above-limit` | PASS |
| `video-streaming`, `license-verification-request`, `group-explanations`, `capture-time`, `supported-formats` | PASS |
| `image-previews`, `free-export`, `no-setup`, `storage-controls`, `runtime-privacy`, `merchant-refund` | PASS |

Landing, workspace, README, Privacy, Terms, and `.factory/copy-audit.md` were
cross-checked. No material unlisted claim was found.

## Clean local gates

- `npm ci` — passed; 60 packages installed, 0 audit vulnerabilities.
- `npm test` — **12/12 passed**.
- `npm run build` — passed; TypeScript `tsc --noEmit` passed and `dist/` was
  produced.
- `npm run test:e2e` — **55 passed, 3 intentional project-specific skips, 0
  failed** across desktop, 390 px mobile, and isolated PWA projects. The skips
  are mobile-only measurements omitted from desktop projects.
- `npm audit --audit-level=high` — passed with 0 vulnerabilities.
- No lint script or lint configuration exists.
- `git diff --check` — passed before report edits.

Production output is 38,692 B JavaScript (14,095 B gzip), 20,340 B CSS (5,431
B gzip), 56,976 B font, and 37,170 B mobile hero art. These are below the
200/50/120/300 kB budgets.

## End-to-end product evidence

- The live sample was completed with keyboard K/R/arrow decisions through the
  exact-copy and cautious likely-burst groups. It reached “Your plan is ready,”
  downloaded a CSV with source/review paths, full hashes, group types, and
  reasons, and reset to undecided.
- A fresh live upload of the two shipped 298-byte JPEGs formed an exact-copy
  group. The exported row contained the independently computed full SHA-256
  `df7f3caabf0c8df1c65d89d8d40fc11da04acff2d76542c0402e17bdb51e9e9c`.
  The source files had the same digest before and after export, and the saved
  decision survived reload.
- A fresh live unlicensed context accepted exactly 750 supported one-byte MP4
  files and showed all 750 ready for review. A separate 751-file attempt was
  rejected before scanning with the documented free-limit message.
- Unit coverage passed the 30-second burst boundary and excluded 31 seconds,
  used embedded capture time rather than modification time, streamed video
  hashing, and accepted every documented format.
- A text-only folder produced the supported-format recovery message. A broken
  JSON backup produced the specific restore error while leaving the review
  workspace usable.
- Workspace backup/restore, new-scan clearing, undo, empty results, unverified,
  cached, invalid, and refunded-license states passed in the full browser suite.
- Hosted checkout redirected via the Sociobot API to Dodo and displayed Photo
  Cull Review, USD, and US$12.00 subtotal and total.

No sign-in exists, so the Entra External ID requirement is not applicable. No
AI feature is warranted for this deterministic local hashing/review job; the
brief's useful exchange paths are covered by folder import, CSV export, and
JSON backup.

## Deployment identity, privacy, and endpoint policy

All **24/24** deployable files in the fresh `dist/` matched production byte for
byte by SHA-256. `staticwebapp.config.json` was excluded because it is consumed
by the host rather than served.

| Artifact | Local and live SHA-256 |
| --- | --- |
| `index.html` | `8b6a3761df326e8bcd8b399a4d81f14dbce3742b88a6729bcbab1acac74c0365` |
| `assets/app-v11.js` | `cc5d60ab523a87774abe424f9812f308ed1533d2aa8c4d14d1e25d5adff5057b` |
| `assets/app-v11.css` | `d95e45fc2364672a60f7e6a1ca867acfdff21459bed278fdb9ffa9701ade03cb` |
| `sw.js` | `9f4df76c7db9ec9feffebee6799eae8ef19f42f2e54792ea439be276f6f8a5ab` |
| `manifest.webmanifest` | `a04fa454b7ade78a0ae3f8ed0253121b855229403129052e3ae38ab22a8aefb0` |

The outgoing-request log for Home, Demo, Privacy, Terms, the complete sample
review, reset, export, and the real fixture flow contained only
`https://photo-cull-review.sociobot.in`. A supplied license adds only the
documented Sociobot product verification request. There are no analytics,
ads, tracking pixels, CDN fonts, third-party runtime scripts, or raw model
credentials.

The live verification endpoint enforced **30 requests per client window**:
requests 1–30 returned 200, and requests 31–35 returned **429** with
`Retry-After: 4`. Successful responses used `Cache-Control: no-store`; CORS
echoed only `https://photo-cull-review.sociobot.in` in this check.

HTML and manifest responses use 30-second revalidation. Versioned app JS/CSS
use one-year immutable caching, and `sw.js` is `no-cache, no-store,
must-revalidate`. Responses include CSP with header-level `frame-ancestors`,
HSTS, `nosniff`, strict referrer policy, Permissions-Policy, COOP/CORP, and
frame denial. Every discovered link returned 200 or the expected checkout 303.

## Accessibility, responsive behavior, and PWA

- `/opt/fleet/lib/verify-url.sh` passed live: HTTP 200, 878 ms load, title,
  `lang`, one H1, one main, complete image alternatives, labelled controls,
  and no console/page errors.
- Playwright Axe found **0 serious or critical violations** on Home, populated
  Demo, Privacy, Terms, and the designed 404.
- Desktop and 390 px routes have no horizontal overflow. Home, Demo, Privacy,
  Terms, and 404 also reflow without overflow at 200% text.
- Keyboard traversal begins at the skip link with a designed 3 px focus ring.
  Shortcuts, dialog focus/Escape return, route focus/announcement, native
  button operation, and undo passed.
- All measured visible mobile controls are at least 44 px. The first demo
  filename and both decision controls fit in the 390 × 844 first viewport and
  receive pointer events.
- Reduced motion computes `scroll-behavior: auto` and disables hero motion.
- The live service worker is active and controlling the page. Its
  `photo-cull-shell-v12` cache has 21 shell entries. A live update check found
  the current worker active with none waiting; the update-toast path passed in
  the browser suite. Offline reload retained the demo banner, heading, local
  previews, and saved decision.
- The deliberate missing-route navigation returned HTTP 404 with the designed
  recovery page. Its browser resource-status console line was expected; no
  application script or page exception occurred.

## Performance

Three valid Lighthouse 13.4.1 mobile runs scored **98, 97, and 93** for
performance (median **97**) and **100** for Accessibility, Best Practices, and
SEO in every run. Across the runs: FCP 0.95–1.39 s, LCP 1.50–1.70 s, TBT
135–311 ms, CLS 0, and transferred bytes 117,859–132,267. Lighthouse does not
emit field INP for this synthetic navigation.

## Defects by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none.

## Verdict

**PASS.** Candidate `9ed7897481f36414701c1f4d5c0c321b1e4f1137` is the
exact code served at the verified URL and satisfies the researched brief and
acceptance contract. Fresh evidence does not reproduce a deployment blocker.

Evidence is in `.factory/verification-13-artifacts/`, including live route,
network, responsive, PWA, screenshot, verifier, and Lighthouse results.
