# Independent verification 12 — Photo Cull Review

**Result: PASS**

- Candidate commit: `e3461f63d21f9f6a5f463c1fba46ebe1cb198c33`
- Verified URL: <https://photo-cull-review.sociobot.in/>
- Verification date: 2026-09-02
- Work order: `photo-cull-review-verify-12`
- Scope: clean claims-first verification, locked install, complete local suites,
  exact production build, and independent live desktop/mobile/PWA review.

No product code was changed during verification.

## Mandatory first read

A cold visit passes the first-read gate on desktop and at 390 × 844:

- What it does: “Clean up duplicate photos. Before anything moves.”
- Who it is for: households with large or crowded photo archives.
- What to click first: **Try it with sample data**. The adjacent note says,
  “Opens a four-file sample review in this browser.”

The sample action and all three privacy/offline/price facts fit in the first
390 × 844 viewport. One click opens four realistic files and two candidate
groups. The persistent banner identifies a separate sample workspace and
provides **Reset demo** and **Start for real**.

## Claims-first gate

`.factory/claims.json` exists with 21 entries. Immediately after `npm ci`, I
ran every listed `test` command separately and exactly as written. Result:
**21/21 passed, 0 failed**.

| Claim IDs | Result |
| --- | --- |
| `exact-duplicates`, `similar-suggestions`, `csv-export`, `workspace-persistence`, `offline-reload` | PASS |
| `local-only`, `demo-sandbox`, `free-limit`, `workspace-backup`, `archive-pass-above-limit` | PASS |
| `video-streaming`, `license-verification-request`, `group-explanations`, `capture-time`, `supported-formats` | PASS |
| `image-previews`, `free-export`, `no-setup`, `storage-controls`, `runtime-privacy`, `merchant-refund` | PASS |

Landing, workspace, README, Privacy, and Terms statements were cross-checked
against the claim manifest. No unlisted material product claim was found.

## Clean local verification

- `npm ci` — passed; 60 packages installed and 0 audit vulnerabilities.
- `npm test` — **12/12 passed**.
- `npm run test:e2e` — **55 passed, 3 intentional project-specific skips, 0
  failed** across desktop, 390 px mobile, and isolated PWA projects.
- `npm run build` — passed; this runs `tsc --noEmit` and Vite and creates
  `dist/`. There is no separate lint command or configuration.
- `npm audit --audit-level=high` — passed with 0 vulnerabilities.
- `git diff --check` — passed before report edits.

Build output is 38,511 B JavaScript (14,060 B gzip), 20,340 B CSS (5,431 B
gzip), 56,976 B font, and 37,170 B mobile hero. All are well below the stated
200/50/120/300 kB budgets.

## Product and recovery evidence

- The one-click live sample was completed with keyboard K/R/arrow decisions
  through its exact-copy and cautious likely-burst groups. It reached “Your
  plan is ready,” exported CSV paths, full SHA-256 hashes, group types, and
  plain explanations, and reset to undecided.
- A fresh live folder containing two shipped 298-byte JPEG fixtures grouped as
  exact copies. Keyboard-only decisions selected Keep and Move to review. The
  CSV contained hash
  `df7f3caabf0c8df1c65d89d8d40fc11da04acff2d76542c0402e17bdb51e9e9c`,
  and both source hashes were unchanged after export.
- Unit and browser coverage exercised exact 30-second inclusion and 31-second
  exclusion, all documented media types, streamed video hashing, the 750/751
  free boundary, paid 751-file acceptance, reload persistence, workspace
  backup/restore, and demo/real database isolation.
- On live, an unsupported text-only folder produced a specific supported-type
  error. A malformed JSON backup produced a specific restore error while the
  review desk remained usable. An unavailable first license check stayed on
  free limits; a previously valid cached pass remained usable when its daily
  recheck was unavailable.
- Hosted checkout redirected through the Sociobot API to Dodo and showed Photo
  Cull Review, USD, and a US$12.00 subtotal and total. Refund/revocation and
  restore-license paths passed recorded-response browser tests.
- No sign-in exists, so the Microsoft Entra authority requirement is not
  applicable. No AI feature is needed for the deterministic, private review
  job; folder import, CSV export, and JSON backup cover the implied exchange
  paths.

## Deployment identity, privacy, and response policy

All **24/24** public files from the fresh `dist/` matched production byte for
byte by SHA-256; only deployment-only `staticwebapp.config.json` was excluded.
Representative matches:

| Artifact | Local and live SHA-256 |
| --- | --- |
| `index.html` | `af714cdf0e32b5b233189392af33fd42eecd6661724ab915ab2dc78a06da60e1` |
| `assets/app-v10.js` | `177bc0e279db0b460410c827ab4809c6b9f9797cbfcbcfbab7b9ef16f85b23f9` |
| `assets/app-v10.css` | `d95e45fc2364672a60f7e6a1ca867acfdff21459bed278fdb9ffa9701ade03cb` |
| `sw.js` | `796c6246cb375d42af598d78e622a47543a033d66f302610486970b3d38d8aa0` |
| `manifest.webmanifest` | `a52a2622ab6b41d6b44798f7f9d1b09c60584bd8571653102efc925b786ab362` |

The live request log for home, demo, legal pages, complete sample review, real
fixture review, reset, and export contained only
`https://photo-cull-review.sociobot.in`. With a supplied token, the only
permitted cross-origin runtime request is the documented product verification
URL. Source inspection found no analytics, ads, tracking pixels, CDN fonts,
runtime third-party scripts, Azure keys, or other network clients.

The unlock endpoint independently enforced an allowance of **30 requests per
client window**: requests 1–30 returned 200 with `Cache-Control: no-store`;
requests 31–35 returned **429** with `Retry-After: 4`. CORS echoed only the
supplied product origin in this check.

HTML/manifest responses revalidate after 30 seconds. Versioned JS/CSS use a
one-year immutable cache. `sw.js` is `no-cache, no-store, must-revalidate`.
Responses include CSP with header-level `frame-ancestors`, HSTS, `nosniff`,
strict referrer policy, Permissions-Policy, COOP/CORP, and frame denial. Every
discovered product/external link returned its expected status; checkout
returned its expected 303.

## Accessibility, responsive behavior, and PWA

- `/opt/fleet/lib/verify-url.sh` passed live: HTTP 200, 1,259 ms load, correct
  title/lang, one H1, one main, complete image alternatives, labelled buttons,
  and no console/page errors.
- Playwright Axe found **0 serious or critical violations** on Home, populated
  Demo, Privacy, Terms, and the designed 404.
- Desktop and 390 px routes had no horizontal overflow. Home, Demo, Privacy,
  Terms, and 404 reflowed without horizontal overflow at 200% text.
- Keyboard traversal begins at the skip link with a designed 3 px focus ring.
  The end-to-end suite also passed sequential shortcuts after focus changes,
  dialog focus/Escape return, route focus/announcement, and undo.
- Every measured visible mobile control has at least a 44 px activation area.
  The previously defective Privacy contact is 225.22 × 44 px; dialog Terms and
  Privacy links are 45.69 × 44 and 54.34 × 44 px with a 12.22 px gap.
- Reduced motion computes `scroll-behavior: auto` and disables the hero
  animation.
- The active service worker controls the page and holds 21 shell entries in
  `photo-cull-shell-v11`. An update check completed cleanly with no waiting
  worker because production was current. The full browser suite verified the
  update toast. Offline reload retained the demo banner, saved decision,
  review heading, and local previews.

## Performance

Three live Lighthouse 13.4.1 mobile runs scored **88, 95, and 94** for
performance; the median is **94**. The first run shared the host with three
concurrent browser/network checks; both isolated reruns passed the ≥90 target.
Accessibility, Best Practices, and SEO scored 100 in every run. Across runs:
FCP 1.08–1.37 s, LCP 1.51–1.68 s, TBT 245.5–461.5 ms, CLS 0, and transferred
bytes 117,878–132,178. The product meets the LCP, CLS, and bundle budgets.
Lighthouse does not emit field INP for this synthetic navigation.

## Defects by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none.

## Verdict

**PASS.** Candidate `e3461f63d21f9f6a5f463c1fba46ebe1cb198c33` is the
exact code deployed at the verified URL and satisfies the brief and supplied
acceptance contract. The previously reported deployment-only rate-limit
failure and mobile touch-target failure are not present in fresh evidence.

Evidence is in `.factory/verification-12-artifacts/`, including route/network/
PWA results, desktop/mobile screenshots, verifier output, and all three
Lighthouse reports.
