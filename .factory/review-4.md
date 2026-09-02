# Adversarial first-read review 4 — Photo Cull Review

**Verdict: FAIL**

**Reviewed:** 2 September 2026 UTC  
**Live product:** <https://photo-cull-review.sociobot.in>  
**Repository base:** `1fbb79ad5f8900124cf4a20c5519c1f6713edb88`

One blocking regression remains. On a 390 px phone, the visible route-change
announcement covers the first sample filename and decision controls for 4.2
seconds after the one-click demo opens. This reopens F-2-1. All 21 registered
claim commands pass from a clean clone, the full test/build/browser suite
passes, and no copy or unlisted-claim finding remains.

## Findings

### Blocking

#### F-4-1 (reopens F-2-1) — The demo announcement covers the first decision

- **Quote/location:** `/?demo=1`, 390 × 844, immediately after choosing “Try
  it with sample data.” The fixed toast says “Review duplicate and burst photos
  opened.”
- **Measured evidence:** The toast occupies y=741.31–824.00. The first filename,
  “IMG_2041.jpg,” occupies y=748.08–767.27, and the first Keep control occupies
  y=794.11–840.11. `document.elementFromPoint()` at the center of both the
  filename and Keep control returns the toast. The toast clears after 4.2
  seconds. The screenshot and direct visual check confirm that neither the
  filename nor a usable decision control is visible while it is present.
- **Why this blocks acceptance:** The earlier F-2-1 repair required a realistic
  filename or preview **and** a Keep or Move control in the first demo viewport.
  The underlying layout fits, but the route announcement hides the only
  first-viewport decision controls at the moment the demo opens. A first-time
  phone visitor cannot immediately use the sample without waiting or scrolling.
- **Concrete fix:** Keep focus on the incoming `<h1>`, but announce the route in
  a visually hidden polite live region instead of the visible bottom toast.
  Alternatively, place a non-obscuring status above the workspace. Extend
  `@regression:demo-first-viewport` to check, immediately after navigation,
  that the center points of the first filename and Keep control are not covered
  by another element.

## 1. Cold first screen

Fresh Chromium contexts had no cookies, local storage, or IndexedDB data. No
scrolling occurred before these observations.

| View | What does it do? | For whom? | What should I click first? | Result |
| --- | --- | --- | --- | --- |
| 390 × 844 | Compares exact copies and likely bursts before producing a move plan. | Households with large or crowded photo archives. | “Try it with sample data”; the adjacent line says it opens a four-file review. | Pass. The action, outcome, real-folder action, and three facts end by 841 px. |
| 1440 × 900 | Same answer. | Same answer. | Same action. | Pass. The required facts end by 866 px. |

The cold page has one h1, one main landmark, `lang="en"`, no horizontal
overflow, and no console error. The first screen is clear without relying on
the illustration.

## 2. Copy audit

Counts treat a hyphenated term, URL, price, version, or file format as one word.
Responsive alternatives are counted separately. Commands in fenced code blocks
are instructions rather than prose sentences. Repeated identical navigation or
footer labels are listed once. No sentence exceeds 22 words, no banned
marketing adjective appears, and every action names its result. There are no
copy findings.

### Landing page

| Text | Words | Result |
| --- | ---: | --- |
| Skip to main content | 4 | Pass |
| Photo Cull Review | 3 | Pass — wordmark |
| Demo | 1 | Pass — destination link |
| How it works / How | 3 / 1 | Pass — responsive destination link |
| Privacy | 1 | Pass — destination link |
| Terms | 1 | Pass — destination link |
| View Archive pass / View pass | 3 / 2 | Pass — responsive verb action |
| Opening Photo Cull Review | 4 | Pass |
| Loading your photo review… | 4 | Pass |
| Review duplicate photos on this device | 6 | Pass |
| Clean up duplicate photos. | 4 | Pass |
| Before anything moves. | 3 | Pass — safety boundary |
| For households with large or crowded photo archives, compare exact copies and likely bursts before exporting a move plan. | 19 | Pass |
| Try it with sample data | 5 | Pass |
| Opens a four-file sample review in this browser. | 8 | Pass — `demo-sandbox` |
| Choose your photo folder | 4 | Pass |
| JPEG, PNG, WebP, GIF, BMP, MP4, MOV, M4V, WebM | 9 | Pass — `supported-formats` |
| Photos stay on this device | 5 | Pass — `local-only` |
| Works offline after the first visit | 6 | Pass — `offline-reload` |
| Free for up to 750 files | 6 | Pass — `free-limit` |
| An imagined moonlit archive where a red thread connects photographic slides across paper dunes | 14 | Pass — image alternative |
| The app creates a move plan and does not move photos. | 11 | Pass — `csv-export` |
| How it works | 3 | Pass |
| Review duplicate and burst photos in three steps. | 8 | Pass |
| Find exact copies and likely bursts | 6 | Pass |
| The app checks every byte to find exact copies. | 9 | Pass — `exact-duplicates` |
| It compares photos and capture times to suggest likely bursts. | 10 | Pass — `similar-suggestions` |
| Review every group | 3 | Pass |
| See why files were grouped. | 5 | Pass — `group-explanations` |
| Mark each one keep or move to review; suggestions never become facts. | 12 | Pass — `similar-suggestions` |
| Export, don’t delete | 3 | Pass |
| Download a CSV move plan for a separate review folder. | 10 | Pass — `csv-export` |
| Your source archive remains untouched. | 5 | Pass — `csv-export` |
| For folders over 750 files | 5 | Pass |
| Archive pass | 2 | Pass — paid-tier heading |
| Free for folders up to 750 supported files. | 8 | Pass — `free-limit` |
| A one-time US$12 pass scans folders above the 750-file free limit. | 11 | Pass — `archive-pass-above-limit` |
| US$12 one time | 3 | Pass |
| Buy Archive pass at checkout | 5 | Pass — result and destination named |
| (opens external checkout) | 3 | Pass — accessible destination cue |
| Restore a license | 3 | Pass |
| Local photo review before anything moves. | 6 | Pass |
| Original generated archive illustration · Built by Param Factory · v1.0.10 | 9 | Pass — provenance and build label |

### Landing license dialog and conditional messages

| Text | Words | Result |
| --- | ---: | --- |
| Close license dialog | 3 | Pass — accessible action name |
| One-time pass | 2 | Pass |
| Archive pass | 2 | Pass |
| This device has an active archive pass. | 7 | Pass |
| Scan folders above the 750-file free limit for US$12 once. | 10 | Pass — `archive-pass-above-limit` |
| The free product handles up to 750 files. | 8 | Pass — `free-limit` |
| Exporting your move plan is always free. | 7 | Pass — `free-export` |
| Buy Archive pass at checkout | 5 | Pass |
| Have a license? | 3 | Pass |
| Paste it here. | 3 | Pass |
| Verify and restore | 3 | Pass |
| Sociobot/Dodo is the merchant of record. | 6 | Pass — `merchant-refund` |
| Refunds are handled there and revoke the license. | 8 | Pass — `merchant-refund` |
| We could not recheck this Archive pass. | 7 | Pass |
| Its last successful check remains active. | 6 | Pass |
| We could not verify this license. | 6 | Pass |
| Free limits remain active. | 4 | Pass |
| Check your connection and try again. | 6 | Pass |
| This license is no longer active. | 6 | Pass |
| Free limits are in use. | 5 | Pass |
| That license is no longer active for this product. | 9 | Pass |
| Check the token and try again. | 6 | Pass |

### README

| Text | Words | Result |
| --- | ---: | --- |
| Photo Cull Review | 3 | Pass — title |
| Photo Cull Review helps households compare duplicate and burst photos before moving any files. | 14 | Pass |
| It finds exact copies and likely bursts in a folder. | 10 | Pass |
| You review each group and export a move plan. | 9 | Pass |
| It never uploads, moves, or deletes originals. | 7 | Pass — `local-only`, `csv-export` |
| Live product | 2 | Pass — heading |
| Try the isolated sample at https://photo-cull-review.sociobot.in/?demo=1. | 6 | Pass |
| It opens a four-file family archive without reading or writing your real workspace. | 13 | Pass — `demo-sandbox` |
| What it does | 3 | Pass — heading |
| Checks every byte to find exact copies. | 7 | Pass — `exact-duplicates` |
| Large videos are checked in small pieces to limit memory use. | 11 | Pass — `video-streaming` |
| Compares how photos look and when the camera recorded them to suggest likely bursts. | 14 | Pass — `similar-suggestions`, `capture-time` |
| It never uses file modification dates for this suggestion. | 9 | Pass — `capture-time` |
| Saves thumbnails, file details, groups, and decisions in your browser. | 10 | Pass — `workspace-persistence` |
| Your review survives refreshes and remains available offline. | 8 | Pass — `workspace-persistence`, `offline-reload` |
| Exports a CSV move plan and a restorable JSON workspace backup. | 11 | Pass — `csv-export`, `workspace-backup` |
| Exporting is never paywalled. | 4 | Pass — `free-export` |
| Folders with up to 750 supported files are free. | 9 | Pass — `free-limit` |
| A validated one-time US$12 Archive pass scans folders above that limit. | 11 | Pass — `archive-pass-above-limit` |
| Supported inputs are JPEG, PNG, WebP, GIF, BMP, MP4, MOV, M4V, and WebM. | 13 | Pass — `supported-formats` |
| Images show previews. | 3 | Pass — `image-previews` |
| Videos are checked only for exact copies and do not show previews. | 12 | Pass — `video-streaming` |
| Run locally | 2 | Pass — heading |
| Requirements: Node.js 20 or newer. | 5 | Pass |
| Open http://localhost:5173. | 2 | Pass |
| No server, account, or API key is required for the free experience. | 12 | Pass — `no-setup` |
| Test and build | 3 | Pass — heading |
| The static deploy root is dist/, with dist/index.html at its root. | 11 | Pass |
| For a production-like local check, run npm run preview after building. | 11 | Pass |
| The billing URL defaults to the production Sociobot API. | 9 | Pass |
| Factory staging may set VITE_BILLING_BASE=https://pilot-api.sociobot.in/api/v1; VITE_PRODUCT_SLUG can override the default slug. | 11 | Pass |
| No provider credentials belong in this repository. | 7 | Pass |
| Privacy and safety model | 4 | Pass — heading |
| All photo data stays in browser storage. | 7 | Pass — `local-only` |
| Free review contacts no other website or service. | 8 | Pass — `local-only` |
| With a supplied license token, verification is the app’s only outside request. | 12 | Pass — `license-verification-request` |
| A move plan is an instruction sheet, not an executable deletion script. | 12 | Pass — `csv-export` |
| Review it and keep an independent backup before moving media. | 10 | Pass — safety instruction |
| See the product brief, visual system, privacy policy, and terms. | 10 | Pass |
| Deploy | 1 | Pass — heading |
| Upload the contents of dist/ to the static host with SPA fallback to index.html. | 14 | Pass |
| Preserve /privacy/ and /terms/ directory indexes and serve sw.js without long-lived immutable caching so PWA updates can be detected. | 19 | Pass |
| Licensed under the MIT License. | 5 | Pass |

Terminology is consistent: downloaded CSV instructions are a “move plan,” the
saved review is a “workspace,” exact matches are “exact copies,” cautious
visual/time groups are “likely bursts,” and the paid entitlement is the
“Archive pass.”

## 3. Demo and sandbox

- The first-screen action opens `/?demo=1` in one click.
- The sample contains four named family-archive files, two groups, dates,
  sizes, paths, and three original sample previews.
- The persistent banner says “Demo — sample data, separate from your
  workspace,” says changes stay only in the sample, and includes Reset demo and
  Start for real.
- A sample decision changes state. Reset returns it to undecided.
- The demo uses `photo-cull-review-demo`; real work uses
  `photo-cull-review`. The clean-clone test seeds a real decision, changes and
  resets the demo, exits, and confirms that the real decision remains.
- Live requests during review, export, reset, and offline reload are
  same-origin only. The populated sample, previews, banner, and decision survive
  an offline reload.
- The sandbox behavior passes. The presentation fails only because F-2-1 hides
  the immediate decision controls on a phone.

## 4. Claims

The clean clone was `/tmp/photo-cull-review-review4.kBmVJ1/repo` at the reviewed
commit. After `npm ci`, every command was run separately and exactly as listed
in `.factory/claims.json`. Every claim tag occurs in exactly one test.

| Claim | Result | Observable coverage checked |
| --- | --- | --- |
| `exact-duplicates` | Pass — 2 browser checks | Exported hashes equal complete Node SHA-256 fixture digests |
| `similar-suggestions` | Pass — 1 unit check | Includes 30 seconds, excludes 31 seconds, remains a suggestion |
| `csv-export` | Pass — 2 browser checks | Six columns, rows, quoted paths, types, reasons, hashes, unchanged sources |
| `workspace-persistence` | Pass — 2 browser checks | Decisions survive reload |
| `offline-reload` | Pass — 1 dedicated browser check | Populated demo, previews, banner, and decision survive offline reload |
| `local-only` | Pass — 2 browser checks | Free demo requests stay same-origin |
| `demo-sandbox` | Pass — 2 browser checks | Four files, two groups, Reset, exit, and real-decision preservation |
| `free-limit` | Pass — 1 unit check | Accepts 750 and rejects 751 before scanning |
| `workspace-backup` | Pass — 2 browser checks | JSON backup restores the decision and sensitive fields |
| `archive-pass-above-limit` | Pass — 2 browser checks | Recorded license, live US$12 checkout, and 751-file browser scan |
| `video-streaming` | Pass — 1 unit check | Stream-only video doubles hash exactly without previews |
| `license-verification-request` | Pass — 2 browser checks | Verification endpoint is the sole cross-origin request |
| `group-explanations` | Pass — 2 browser checks | Exact and cautious likely-burst reasons are visible |
| `capture-time` | Pass — 1 unit check | Embedded camera time wins over modification time |
| `supported-formats` | Pass — 1 unit check | All nine formats accepted; unsupported text rejected |
| `image-previews` | Pass — 2 browser checks | Every displayed image candidate has a local preview |
| `free-export` | Pass — 2 browser checks | CSV and JSON export without a license |
| `no-setup` | Pass — 2 browser checks | Empty browser starts review without an account or key |
| `storage-controls` | Pass — 2 browser checks | Token stays local; Start a new scan clears real workspace |
| `runtime-privacy` | Pass — 2 browser checks | Product/legal routes use local resources and no tracking state |
| `merchant-refund` | Pass — 2 browser checks | Recorded revoked response is inactive; merchant and checkout contract match |

The live landing page, demo, README, Privacy, Terms, dialog, and conditional
error copy were cross-checked against the registry. There is no unlisted
claim-like sentence and no untested registered claim.

## 5. Sandbox, offline, and privacy behavior

- The live free flow contacted only
  `https://photo-cull-review.sociobot.in`.
- The live browser showed separate `photo-cull-review` and
  `photo-cull-review-demo` IndexedDB databases. Source routes all demo reads,
  writes, resets, and exits through the demo namespace.
- The active service worker controlled a fresh context. After a demo decision,
  offline reload retained the banner, sample heading, previews, and saved state.
- The app loads no ads, analytics, tracking pixels, external fonts, or external
  runtime scripts. The tested license-verification endpoint is the only allowed
  cross-origin runtime request after a visitor supplies a token.
- No Azure key, endpoint, model call, or direct provider credential exists in
  the runtime.

## 6. Earlier findings checked again

Every unique finding in Reviews 1–3 was checked on the live product and in the
current source or tests. Review 3 repeated F-1-24 and F-2-1; those IDs appear
once below with their current status.

| Earlier finding | Current evidence | Status |
| --- | --- | --- |
| F-1-1 | Exported hashes are compared with complete Node fixture digests. | Fixed |
| F-1-2 | The unit test includes 30 seconds and excludes 31 seconds. | Fixed |
| F-1-3 | CSV assertions parse headers, rows, paths, types, reasons, and hashes. | Fixed |
| F-1-4 | Demo coverage seeds real work, checks four files/two groups, resets, exits, and preserves real work. | Fixed |
| F-1-5 | A dedicated context reloads populated demo data offline. | Fixed |
| F-1-6 | Recorded validation, US$12 checkout, and a 751-file UI scan pass. | Fixed |
| F-1-7 | Exact and likely-burst explanations are registered and tested. | Fixed |
| F-1-8 | Embedded capture time, not modification time, is registered and tested. | Fixed |
| F-1-9 | All nine formats and local previews are registered and tested. | Fixed |
| F-1-10 | Unlicensed CSV and JSON export are registered and tested. | Fixed |
| F-1-11 | A clean browser starts review without an account or key. | Fixed |
| F-1-12 | Token storage and Start a new scan clearing are registered and tested. | Fixed |
| F-1-13 | Both exports are parsed for documented path and hash fields. | Fixed |
| F-1-14 | Runtime requests, resources, and tracking storage are inventoried. | Fixed |
| F-1-15 | Merchant and refunded-license behavior use recorded contract responses. | Fixed |
| F-1-16 | Demo, Home, Privacy, Terms, and Back focus and announce the incoming h1. | Fixed |
| F-1-17 | Visitor copy consistently calls the CSV a move plan. | Fixed |
| F-1-18 | The eyebrow says “Review duplicate photos on this device.” | Fixed |
| F-1-19 | The caption directly says the app creates a plan and moves nothing. | Fixed |
| F-1-20 | The section label is “How it works.” | Fixed |
| F-1-21 | The process heading names duplicate and burst review. | Fixed |
| F-1-22 | Pricing names the 750-file threshold. | Fixed |
| F-1-23 | Pricing states the tested US$12 entitlement without a slogan. | Fixed |
| F-1-24 | Desktop says “View Archive pass”; mobile says “View pass.” | Fixed |
| F-1-25 | README opens with the household photo-review task. | Fixed |
| F-1-26 | README overview is split into short sentences. | Fixed |
| F-1-27 | README explains visual/time comparison without hash jargon. | Fixed |
| F-1-28 | README leads with browser persistence, not a database name. | Fixed |
| F-1-29 | README separates free and paid pricing into factual sentences. | Fixed |
| F-1-30 | README states visible video behavior without decoding jargon. | Fixed |
| F-1-31 | README says free review contacts no other site or service. | Fixed |
| F-2-1 | Underlying filename and Keep boxes fit, but the 4.2-second route toast covers both on 390 px. | **Regressed — blocking** |
| F-2-2 | Loading says “Opening Photo Cull Review.” | Fixed |
| F-2-3 | The first step says “Find exact copies and likely bursts.” | Fixed |
| F-2-4 | Landing explains exact matching as checking every byte. | Fixed |
| F-2-5 | Landing describes comparing photos and capture times. | Fixed |
| F-2-6 | The license dialog says “free product.” | Fixed |
| F-2-7 | README exact matching uses two concrete sentences. | Fixed |
| F-2-8 | README describes appearance and camera-recorded time plainly. | Fixed |
| F-2-9 | Demo h1 is “Review duplicate and burst photos.” | Fixed |
| F-2-10 | Workspace action is “Start a new scan.” | Fixed |
| F-2-11 | Legal-route forward and Back navigation focus and announce h1. | Fixed |
| F-3-1 | “Any size,” “unlimited,” and “unlock” are absent; pricing is bounded above the free threshold. | Fixed |
| F-3-2 | The sample outcome says “in this browser,” with no speed claim. | Fixed |
| F-3-3 | Demo says files “are ready to review.” | Fixed |
| F-3-4 | Scan h1 says it is checking photos for copies and likely bursts. | Fixed |
| F-3-5 | Scan assurance says “File checks and small previews.” | Fixed |
| F-3-6 | 404 action is “Return to photo review.” | Fixed |
| F-3-7 | Every route references the decoded 180 × 180 Apple touch icon. | Fixed |
| F-3-8 | Purchase actions visibly say “at checkout” and expose the external cue. | Fixed |

## 7. Structure, links, identity, and accessibility

- Titles are route-specific and under 60 characters: Home uses “Photo Cull
  Review — plan duplicate photo moves”; Demo, Privacy, Terms, and 404 use the
  required route-first pattern.
- Every checked route has one h1, one main landmark, a description, canonical,
  Open Graph/Twitter card, SVG favicon, and 180 × 180 Apple touch icon.
- The sitemap lists Home, Demo, Privacy, and Terms. `robots.txt` points to it.
- A missing URL returns HTTP 404 and the designed archive-style page with
  “Return to photo review.”
- Every same-origin route returns 200, every fragment target exists,
  `sociobot.in` returns 200, and the checkout endpoint returns the expected 303
  to hosted checkout. No dead link was found.
- Forward and Back navigation restore the right URL and focus the incoming h1.
  The announcement mechanism causes F-2-1, but the focus behavior itself works.
- Home, populated Demo, Privacy, Terms, and 404 have zero serious or critical
  Axe results. Keyboard focus is visible, reduced motion disables hero motion,
  200% text reflows without horizontal overflow, and tested targets are at
  least 44 px.
- The warm-paper darkroom palette, editorial serif, mounted-photo workspace,
  hand-drawn samples, red review thread, and original moonlit archive scene are
  recognizably product-specific. The surface is not a generic SaaS template.

## 8. Missed leverage

No finding is warranted. The brief’s complete loop is present: folder import,
exact and cautious burst grouping, human decisions, CSV export, and JSON
backup/restore. Sync would conflict with the local-only promise. Model-assisted
classification would weaken the explicit exact-hash/human-review safety model
and is not an obvious missing user expectation.

## Verification summary

- `npm ci` in a clean clone — pass; 60 packages, 0 vulnerabilities.
- All 21 commands in `.factory/claims.json` — pass independently.
- `npm test` — 12/12 pass.
- `npm run build` — pass; `dist/` produced; application JavaScript 38.51 KB
  raw / 14.15 KB gzip.
- `npm run test:e2e` — 55 pass, 3 intentional project-specific skips.
- `/opt/fleet/lib/verify-url.sh` — pass; title, lang, one h1, main, alt text,
  labels, and zero console errors.
- Live Playwright/Axe audit — zero serious or critical results on all public
  routes; expected missing-route resource message only on the HTTP 404.
- Live link crawl, offline reload, request inventory, demo reset/export, route
  focus, mobile layout, text reflow, reduced motion, headers, and checkout
  contract — otherwise pass.

## What would make this perfect

Make the route-change announcement non-obscuring while retaining h1 focus and
the polite screen-reader cue. Add immediate occlusion assertions to the phone
demo regression, deploy, and rerun this full review. No other product, copy,
claim, structure, privacy, accessibility, or missed-leverage change is indicated
by this round.
