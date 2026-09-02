# Adversarial first-read review 3 — Photo Cull Review

**Verdict: FAIL**

**Reviewed:** 2 September 2026 UTC  
**Live product:** <https://photo-cull-review.sociobot.in>  
**Repository base:** `a019e240bf48a887b0324139cc051d178300e3a3`

Two earlier findings remain only partly fixed, so they are blocking again under
the review contract. The 390 px demo now exposes a sample decision, but the
desktop demo does not. The header control has an actionable accessible name,
but a sighted phone visitor still sees only “Pass.” Eight additional claim,
copy, and metadata findings remain. All 21 registered claim commands pass.

## Findings

### Blocking

#### F-2-1 — The desktop demo still hides every decision below the first screen

- **Quote/location:** `/?demo=1`, 1440 × 900 first viewport. “These files are
  exact copies” and two sample previews are visible, but no filename or decision
  control is visible.
- **Measured evidence:** The first filename begins at 1,014 px. The first Keep
  control begins at 1,088 px. Both are below the 900 px viewport. The mobile
  repair works narrowly: `IMG_2041.jpg` ends at 767 px and Keep ends at 840 px
  in a 390 × 844 viewport.
- **Why this blocks acceptance:** Review 2 required the product to show a real
  sample item and a decision in the first demo viewport on mobile and desktop.
  The fix and regression test cover only 390 px. A desktop visitor still cannot
  act without scrolling.
- **Concrete fix:** Compact the desktop sample cards so a filename and Keep or
  Move to review control finish above 900 px. Extend
  `@regression:demo-first-viewport` to a 1440 × 900 context and assert the group,
  filename, and decision-control bounds.

#### F-1-24 — The visible mobile Archive-pass control still does not name its action

- **Quote/location:** 390 px header button: “Pass.” Source:
  `<span class="compact-label">Pass</span>` inside a button whose accessible name
  is “View Archive pass.”
- **Why this blocks acceptance:** The accessible name repairs the screen-reader
  case, but the visible phone label remains a noun. A sighted first-time visitor
  cannot tell that it opens price and license options. The original finding is
  therefore only partly fixed.
- **Concrete fix:** Show a verb label such as “View pass” at 390 px, retain the
  full accessible name, and make the mobile-header regression assert the visible
  text as well as target size and accessible name.

### Major

#### F-3-1 — “Any size” and “unlimited” are unlisted, unbounded paid claims

- **Quote/location:** Archive-pass dialog: “Scan folders of any size for US$12
  once.” The 751-file error says “unlock unlimited scans.”
- **Why this matters:** `archive-pass-unlimited` promises only that a validated
  pass accepts folders above the 750-file limit. Its test checks exactly 751
  files. It does not and cannot establish “any size” or an unlimited browser
  capacity. These stronger purchase claims are absent from `claims.json`.
- **Concrete fix:** Use “Scan folders above the 750-file free limit for US$12
  once.” In the error, use “choose a smaller folder or buy an Archive pass.” If
  there is a tested upper bound, state and test that number instead.

### Minor

#### F-3-2 — “Immediately” is an unmeasured speed claim

- **Quote/location:** Hero action note: “Opens a four-file sample review
  immediately.”
- **Why this matters:** The demo test checks the one-click result, but it defines
  no timing threshold. “Immediately” is therefore not testable evidence.
- **Concrete rewrite:** “Opens a four-file sample review in this browser.”

#### F-3-3 — The demo summary uses implementation jargon

- **Quote/location:** Demo: “4 files indexed on this device.”
- **Why this matters:** “Indexed” describes an implementation step rather than
  what is ready for the visitor.
- **Concrete rewrite:** “4 files are ready to review on this device.”

#### F-3-4 — The scan heading is a metaphor instead of the current task

- **Quote/location:** Folder-scan h1: “Reading evidence, not changing files.”
- **Why this matters:** “Evidence” is editorial mood copy. It does not say that
  the app is checking photos for exact copies and likely bursts.
- **Concrete rewrite:** “Checking photos for copies and likely bursts.”

#### F-3-5 — The scan assurance exposes unexplained hashing jargon

- **Quote/location:** Folder scan: “Hashes and small previews stay on this
  device.”
- **Why this matters:** “Hashes” is an implementation term in a user-facing
  status message.
- **Concrete rewrite:** “File checks and small previews stay on this device.”

#### F-3-6 — The 404 action retains the rejected “review desk” metaphor

- **Quote/location:** 404 button: “Return to your review desk.”
- **Why this matters:** Earlier copy repairs removed “desk” from the README,
  license dialog, and demo h1, but it remains on a public route. It does not
  name the destination in product terms.
- **Concrete rewrite:** “Return to photo review.”

#### F-3-7 — The Apple touch icon is not the required 180 px asset

- **Quote/location:** Every route links
  `<link rel="apple-touch-icon" href="/icons/icon-192.png">`; the referenced PNG
  is 192 × 192 and there is no 180 × 180 icon.
- **Why this matters:** The site-structure contract explicitly requires an SVG
  favicon and a 180 px Apple touch icon. The SVG favicon is present; the touch
  asset is the wrong size.
- **Concrete fix:** Add a real 180 × 180 derivative and reference it on home,
  Privacy, Terms, and 404. Add a metadata assertion for its dimensions.

#### F-3-8 — The purchase links do not identify their external destination

- **Quote/location:** Landing pricing and license dialog: “Buy archive pass” /
  “Buy Archive pass.” Both links leave the product through the Sociobot billing
  endpoint and continue to hosted Dodo checkout.
- **Why this matters:** The site-structure contract requires external links to
  say so. A buyer is not told before navigation that checkout leaves the local
  app.
- **Concrete fix:** Use visible copy such as “Buy Archive pass at checkout” and
  add an accessible “opens external checkout” cue to both links.

## 1. Cold first screen

Fresh Chromium contexts had empty cookies, local storage, and IndexedDB. No
scrolling occurred before these observations.

| View | What does it do? | For whom? | What should I click first? | Result |
| --- | --- | --- | --- | --- |
| 390 × 844 | Compares exact copies and likely bursts before creating a move plan. | Households with large or crowded photo archives. | “Try it with sample data”; its adjacent note describes the four-file sample. | Pass. The three facts finish at 835 px, with no horizontal overflow. |
| 1440 × 900 | Same answer. | Same answer. | Same action. | Pass. The three facts finish at 866 px. |

The live home has one h1, one main landmark, `lang="en"`, no load-time console
error, and no serious or critical Axe result.

## 2. Copy audit

Counts treat hyphenated terms, URLs, prices, and file-format names as one word.
Code blocks are commands rather than prose. No sentence exceeds 22 words and
no banned marketing adjective appears. The banned word “unlock,” a noun-only
button, jargon, metaphor, and unmeasured wording are flagged below.

### Landing page and license dialog

| Text | Words | Result |
| --- | ---: | --- |
| Skip to main content | 4 | Pass |
| Photo Cull Review | 3 | Pass — wordmark |
| Demo | 1 | Pass — destination link |
| How it works / How | 3 / 1 | Pass — responsive navigation link |
| Privacy | 1 | Pass — destination link |
| View Archive pass / Pass | 3 / 1 | Flag F-1-24 — visible mobile button is not a verb |
| Opening Photo Cull Review | 4 | Pass |
| Loading your photo review… | 4 | Pass |
| Review duplicate photos on this device | 6 | Pass |
| Clean up duplicate photos. | 4 | Pass |
| Before anything moves. | 3 | Pass |
| For households with large or crowded photo archives, compare exact copies and likely bursts before exporting a move plan. | 19 | Pass |
| Try it with sample data | 5 | Pass |
| Opens a four-file sample review immediately. | 6 | Flag F-3-2 |
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
| Mark each one keep or move to review; suggestions never become facts. | 12 | Pass |
| Export, don’t delete | 3 | Pass |
| Download a CSV move plan for a separate review folder. | 10 | Pass — `csv-export` |
| Your source archive remains untouched. | 5 | Pass — `csv-export` |
| For folders over 750 files | 5 | Pass |
| Archive pass | 2 | Pass — paid tier name |
| Free for folders up to 750 supported files. | 8 | Pass — `free-limit` |
| A one-time US$12 pass removes the 750-file scan limit. | 9 | Pass — registered entitlement |
| US$12 one time | 3 | Pass |
| Buy archive pass | 3 | Flag F-3-8 — external checkout is not identified |
| Restore a license | 3 | Pass |
| Local photo review before anything moves. | 6 | Pass |
| Original generated archive illustration · Built by Param Factory · v1.0.8 | 9 | Pass — provenance/build label |
| Close license dialog | 3 | Pass |
| One-time pass | 2 | Pass |
| This device has an active archive pass. | 7 | Pass — conditional state |
| Scan folders of any size for US$12 once. | 8 | Flag F-3-1 |
| The free product handles up to 750 files. | 8 | Pass — `free-limit` |
| Exporting your move plan is always free. | 7 | Pass — `free-export` |
| Buy Archive pass | 3 | Flag F-3-8 — external checkout is not identified |
| Have a license? | 3 | Pass |
| Paste it here. | 3 | Pass |
| Verify and restore | 3 | Pass |
| Sociobot/Dodo is the merchant of record. | 6 | Pass — `merchant-refund` |
| Refunds are handled there and revoke the license. | 8 | Pass — `merchant-refund` |
| Terms | 1 | Pass — destination link |
| Privacy | 1 | Pass — destination link |
| We could not recheck this Archive pass. | 7 | Pass — error statement |
| Its last successful check remains active. | 6 | Pass — consequence |
| We could not verify this license. | 6 | Pass — error statement |
| Free limits remain active. | 4 | Pass — consequence |
| Check your connection and try again. | 6 | Pass — recovery action |
| This license is no longer active. | 6 | Pass — error statement |
| Free limits are in use. | 5 | Pass — consequence |
| That license is no longer active for this product. | 9 | Pass — form error |
| Check the token and try again. | 6 | Pass — recovery action |
| This folder contains 751 supported files. | 6 | Pass — measured boundary |
| The free product scans up to 750; choose a smaller folder or unlock unlimited scans. | 15 | Flag F-3-1 — banned “unlock” and unbounded claim |
| No supported photos or videos were found. | 7 | Pass — error statement |
| Choose a folder containing JPEG, PNG, WebP, GIF, BMP, MP4, MOV, M4V, or WebM files. | 15 | Pass — recovery action |

### README

| Text | Words | Result |
| --- | ---: | --- |
| Photo Cull Review | 3 | Pass — title |
| Photo Cull Review helps households compare duplicate and burst photos before moving any files. | 14 | Pass |
| It finds exact copies and likely bursts in a folder. | 10 | Pass |
| You review each group and export a move plan. | 9 | Pass |
| It never uploads, moves, or deletes originals. | 7 | Pass — `local-only`, `csv-export` |
| Live product | 2 | Pass |
| Try the isolated sample at https://photo-cull-review.sociobot.in/?demo=1. | 6 | Pass |
| It opens a four-file family archive without reading or writing your real workspace. | 13 | Pass — `demo-sandbox` |
| What it does | 3 | Pass |
| Checks every byte to find exact copies. | 7 | Pass — `exact-duplicates` |
| Large videos are checked in small pieces to limit memory use. | 11 | Pass — `video-streaming` |
| Compares how photos look and when the camera recorded them to suggest likely bursts. | 14 | Pass — `similar-suggestions`, `capture-time` |
| It never uses file modification dates for this suggestion. | 9 | Pass — `capture-time` |
| Saves thumbnails, file details, groups, and decisions in your browser. | 10 | Pass — `workspace-persistence` |
| Your review survives refreshes and remains available offline. | 8 | Pass — `workspace-persistence`, `offline-reload` |
| Exports a CSV move plan and a restorable JSON workspace backup. | 11 | Pass — `csv-export`, `workspace-backup` |
| Exporting is never paywalled. | 4 | Pass — `free-export` |
| Folders with up to 750 supported files are free. | 9 | Pass — `free-limit` |
| A validated one-time US$12 Archive pass scans larger folders. | 9 | Pass — `archive-pass-unlimited` |
| Supported inputs are JPEG, PNG, WebP, GIF, BMP, MP4, MOV, M4V, and WebM. | 13 | Pass — `supported-formats` |
| Images show previews. | 3 | Pass — `image-previews` |
| Videos are checked only for exact copies and do not show previews. | 12 | Pass — `video-streaming` |
| Run locally | 2 | Pass |
| Requirements: Node.js 20 or newer. | 5 | Pass |
| Open http://localhost:5173. | 2 | Pass |
| No server, account, or API key is required for the free experience. | 12 | Pass — `no-setup` |
| Test and build | 3 | Pass |
| The static deploy root is dist/, with dist/index.html at its root. | 11 | Pass — developer instruction |
| For a production-like local check, run npm run preview after building. | 11 | Pass — developer instruction |
| The billing URL defaults to the production Sociobot API. | 9 | Pass — configuration instruction |
| Factory staging may set VITE_BILLING_BASE=https://pilot-api.sociobot.in/api/v1; VITE_PRODUCT_SLUG can override the default slug. | 11 | Pass — configuration instruction |
| No provider credentials belong in this repository. | 7 | Pass — repository instruction |
| Privacy and safety model | 4 | Pass |
| All photo data stays in browser storage. | 7 | Pass — `local-only` |
| Free review contacts no other website or service. | 8 | Pass — `local-only` |
| With a supplied license token, verification is the app’s only outside request. | 12 | Pass — `license-verification-request` |
| A move plan is an instruction sheet, not an executable deletion script. | 12 | Pass — `csv-export` |
| Review it and keep an independent backup before moving media. | 10 | Pass — safety instruction |
| See the product brief, visual system, privacy policy, and terms. | 10 | Pass |
| Deploy | 1 | Pass |
| Upload the contents of dist/ to the static host with SPA fallback to index.html. | 14 | Pass — deployment instruction |
| Preserve /privacy/ and /terms/ directory indexes and serve sw.js without long-lived immutable caching so PWA updates can be detected. | 19 | Pass — deployment instruction |
| Licensed under the MIT License. | 5 | Pass |

### Additional product-copy flags

| Text/location | Words | Result |
| --- | ---: | --- |
| “4 files indexed on this device.” — demo | 6 | Flag F-3-3 |
| “Reading evidence, not changing files.” — scan h1 | 5 | Flag F-3-4 |
| “Hashes and small previews stay on this device.” — scan status | 8 | Flag F-3-5 |
| “Return to your review desk” — 404 action | 5 | Flag F-3-6 |

Terminology is otherwise consistent: “move plan,” “workspace,” “exact copies,”
“likely burst,” and “Archive pass.”

## 3. Demo and sandbox

- The home action reaches `/?demo=1` in one click.
- The demo has four named family-archive files, two groups, local image
  previews, dates, sizes, and paths. The banner remains visible and provides
  Reset demo and Start for real.
- On live production, Reset returned the changed sample decision to undecided.
- A fresh context seeded a real fixture review and Keep decision, entered and
  changed the demo, reset it, then selected Start for real. The real Keep
  decision remained selected.
- IndexedDB uses `photo-cull-review` and `photo-cull-review-demo`; the source
  selects the namespace before every load/save/clear operation.
- Every request during the live home → real review → demo → reset → real flow
  used `https://photo-cull-review.sociobot.in`.
- The demo presentation still fails on desktop as F-2-1.

## 4. Claims

The clean clone was `/tmp/photo-cull-review-review3.On0ubI/repo` at the reviewed
commit. After `npm ci`, every command was run separately and exactly as listed
in `.factory/claims.json`. Each claim tag occurs in exactly one test.

| Claim | Result | Evidence checked |
| --- | --- | --- |
| `exact-duplicates` | Pass — 2 browser checks | Exported hashes equal complete Node SHA-256 fixture digests |
| `similar-suggestions` | Pass — 1 unit check | Includes 30 seconds, excludes 31 seconds, remains a suggestion |
| `csv-export` | Pass — 2 browser checks | Six columns, rows, quoted paths, types, reasons, hashes, unchanged sources |
| `workspace-persistence` | Pass — 2 browser checks | Decisions survive reload |
| `offline-reload` | Pass — 1 dedicated browser check | Populated demo, previews, banner, and decision survive offline reload |
| `local-only` | Pass — 2 browser checks | Demo requests stay same-origin |
| `demo-sandbox` | Pass — 2 browser checks | Four files, two groups, Reset, exit, and real-decision preservation |
| `free-limit` | Pass — 1 unit check | Accepts 750; rejects 751 before scanning |
| `workspace-backup` | Pass — 2 browser checks | JSON backup restores the decision and sensitive fields |
| `archive-pass-unlimited` | Pass — 2 browser checks | Recorded license, live US$12 checkout, and 751-file browser scan; F-3-1 records the stronger unlisted copy |
| `video-streaming` | Pass — 1 unit check | Stream-only video doubles hash exactly without previews |
| `license-verification-request` | Pass — 2 browser checks | Verification URL is the only cross-origin request |
| `group-explanations` | Pass — 2 browser checks | Exact and cautious likely-burst reasons are visible |
| `capture-time` | Pass — 1 unit check | Embedded capture time wins over modification time |
| `supported-formats` | Pass — 1 unit check | All nine formats accepted; text rejected |
| `image-previews` | Pass — 2 browser checks | Every displayed sample candidate has a same-origin preview |
| `free-export` | Pass — 2 browser checks | CSV and JSON export without a license |
| `no-setup` | Pass — 2 browser checks | Empty browser starts a review without account or key |
| `storage-controls` | Pass — 2 browser checks | Token stays local; Start a new scan clears real workspace |
| `runtime-privacy` | Pass — 2 browser checks | Product/legal routes use local resources and create no tracking state |
| `merchant-refund` | Pass — 2 browser checks | Recorded revoked response is inactive; merchant and checkout contract match |

No declared command fails. F-3-1 and F-3-2 are the claim-copy gaps found by
cross-checking the live page against the registry.

## 5. Offline and privacy behavior

- A dedicated live browser context reached service-worker control, saved a demo
  decision, reloaded offline, and retained the demo heading, banner, previews,
  and saved state. The active cache was `photo-cull-shell-v9`.
- Live demo interactions and legal routes loaded only the product origin. No
  ad, analytics, tracking-pixel, external font, or external runtime-script
  request appeared.
- The sole allowed licensed cross-origin path is the Sociobot verification
  endpoint. No Azure key, endpoint, or direct payment-provider integration is
  present in the product.

## 6. Earlier findings checked again

The table covers every finding in reviews 1 and 2. The matching polish rows and
the current handoff were checked against live behavior and source/tests.

| Earlier finding | Live and code confirmation | Status |
| --- | --- | --- |
| F-1-1 | CSV output exposes full hashes and the test compares them with Node digests. | Fixed |
| F-1-2 | The unit test includes 30 seconds and excludes 31 seconds. | Fixed |
| F-1-3 | CSV assertions cover headers, row count, paths, types, reasons, and hashes. | Fixed |
| F-1-4 | Demo coverage seeds real work, checks four files/two groups, resets, exits, and preserves real work. | Fixed |
| F-1-5 | A dedicated context reloads populated demo data offline. | Fixed |
| F-1-6 | Recorded validation, live US$12 checkout, and a 751-file UI scan pass. | Fixed |
| F-1-7 | Group explanations are registered and test both group types. | Fixed |
| F-1-8 | Capture-time behavior is registered and ignores modification time. | Fixed |
| F-1-9 | All formats and local previews are registered and pass. | Fixed |
| F-1-10 | Unlicensed CSV and JSON exports are registered and pass. | Fixed |
| F-1-11 | A clean browser starts a review without an account or key. | Fixed |
| F-1-12 | Token storage and Start a new scan clearing are registered and pass. | Fixed |
| F-1-13 | Both exports are parsed for documented path/hash fields. | Fixed |
| F-1-14 | Runtime privacy is registered and checks requests and tracking state. | Fixed |
| F-1-15 | Merchant/refund behavior is registered and tested with recorded responses. | Fixed |
| F-1-16 | Home, Demo, Privacy, Terms, 404 exits, and Back focus the incoming h1 when navigation originates in-product. | Fixed |
| F-1-17 | Visitor copy consistently calls the CSV a “move plan.” | Fixed |
| F-1-18 | The hero eyebrow names device-local duplicate review. | Fixed |
| F-1-19 | The caption directly states the plan/no-move boundary. | Fixed |
| F-1-20 | The section label is “How it works.” | Fixed |
| F-1-21 | The process heading names duplicate and burst review. | Fixed |
| F-1-22 | Pricing states the 750-file threshold. | Fixed |
| F-1-23 | The seasonal slogan is gone; pricing states the US$12 entitlement. | Fixed |
| F-1-24 | Accessible name is fixed, but visible mobile text is still noun-only “Pass.” | **Half-fixed; blocking again** |
| F-1-25 | README opens with the household task. | Fixed |
| F-1-26 | README overview uses short sentences. | Fixed |
| F-1-27 | README explains visual/time comparison in plain language. | Fixed |
| F-1-28 | Browser-storage benefit precedes implementation detail. | Fixed |
| F-1-29 | Free and paid pricing are separate factual sentences. | Fixed |
| F-1-30 | README describes video behavior as a visible result. | Fixed |
| F-1-31 | README says “contacts no other website or service.” | Fixed |
| F-2-1 | Mobile now exposes a filename and Keep control; desktop still puts every decision below 900 px. | **Half-fixed; blocking again** |
| F-2-2 | Loading says “Opening Photo Cull Review.” | Fixed |
| F-2-3 | Landing says “Find exact copies and likely bursts.” | Fixed |
| F-2-4 | Landing explains exact matching as checking every byte. | Fixed |
| F-2-5 | Landing explains likely bursts with photos and capture times. | Fixed |
| F-2-6 | License dialog says “free product.” | Fixed |
| F-2-7 | README exact-copy explanation uses two concrete sentences. | Fixed |
| F-2-8 | README describes appearance and camera-recorded time. | Fixed |
| F-2-9 | Demo h1 is “Review duplicate and burst photos.” F-3-6 records the separate 404 occurrence. | Fixed at the cited location |
| F-2-10 | Workspace and Privacy use “Start a new scan.” | Fixed |
| F-2-11 | Live Home → Privacy → Demo, browser Back, Privacy → Terms, and 404 → Home all focus the incoming h1. | Fixed |

## 7. Structure, links, identity, and accessibility

- Home, Demo, Privacy, Terms, and 404 have route-specific titles under 60
  characters, one h1, one main, `lang="en"`, descriptions, canonicals, OG and
  Twitter cards, and SVG favicons. F-3-7 records the touch-icon defect.
- The social image is 1200 × 630. The missing-route response is a designed
  archive-style 404 with HTTP 404 and a route back to the product.
- Every same-origin link returned 200, every fragment target exists,
  `sociobot.in` returned 200, and the registered checkout test reached a valid
  Dodo session. F-3-8 records the missing external-destination cue.
- Browser Back and in-product navigation restore the route and focus its h1.
- The live URL verifier reports one h1, `lang=en`, main, complete alt/button
  labels, and no console errors on home. Playwright Axe reports no serious or
  critical issue on home, Demo, Privacy, Terms, or 404.
- At 200% text, all checked routes remain 390 px wide without horizontal
  overflow. Mobile header targets are at least 44 px. Reduced motion disables
  the hero animation and smooth scrolling.
- Clean-build and deployed hashes match for HTML, JS, CSS, service worker, and
  manifest. App JavaScript is 38.17 kB raw and 14.11 kB gzip.
- The warm-paper darkroom palette, Newsreader display face, mounted-photo
  geometry, red review thread, original archive art, and light-table workspace
  are distinct rather than a generic SaaS template.

## 8. Missed leverage

No feature finding is warranted. The brief’s loop is present: folder import,
exact-copy matching, cautious burst suggestions, human decisions, CSV move
plan, and JSON backup/restore. Sync would conflict with the local-only safety
boundary. AI is not an obvious addition because complete hashes and explicit
human judgment are the product’s core safety model.

## Verification summary

- Clean clone `npm ci` — pass; 60 packages, 0 audit findings.
- All 21 exact commands in `.factory/claims.json` — pass individually.
- `npm test` — 12/12 passed.
- `npm run build` — passed; `dist/` produced.
- `npm run test:e2e` — 54 passed, 2 intentional target-specific skips.
- Live URL verifier — pass.
- Live Axe, route metadata, 404, links, demo isolation, request logging,
  offline reload, focus, text reflow, reduced motion, checkout, and artifact
  parity were checked independently.

## What would make this perfect

Bring a desktop demo decision into the first 900 px and test that viewport.
Give the visible mobile pass control a verb. Remove the two unbounded paid
claims, the unmeasured “immediately,” and the remaining jargon/metaphor copy.
Mark checkout links as external. Ship and assert a 180 × 180 Apple touch icon.
Then rerun all 21 claims and the full live review with zero findings.
