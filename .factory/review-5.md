# Adversarial first-read review 5 — Photo Cull Review

**Verdict: PASS**

**Reviewed:** 2 September 2026 UTC  
**Live product:** <https://photo-cull-review.sociobot.in>  
**Repository base:** `70a9ef4719b76f94b5c5fcd3e3cc79a985ef1556`

No findings remain. A cold visitor can identify the task, audience, and first
action without scrolling at both required widths. The one-click demo opens a
populated review with usable decisions in the first viewport. Every registered
claim command passes from a clean clone, no claim-like sentence is unlisted,
and every earlier finding is fixed on production and in the current code or
tests.

## Findings

None.

## 1. Cold first screen

Fresh Chromium contexts had no cookies, local storage, or IndexedDB data. No
scrolling occurred before these observations.

| View | What does it do? | For whom? | What should I click first? | Result |
| --- | --- | --- | --- | --- |
| 390 × 844 | Compares exact copies and likely bursts before producing a move plan. | Households with large or crowded photo archives. | **Try it with sample data**; the adjacent note says it opens a four-file sample review. | Pass. The action, outcome, folder action, and three product facts all fit in the first viewport. |
| 1440 × 900 | Same answer. | Same answer. | Same action and stated result. | Pass. The primary action ends at 583 px and the required facts fit without scrolling. |

Exact first-screen text used for the answers:

- Headline: “Clean up duplicate photos. Before anything moves.”
- Audience/outcome: “For households with large or crowded photo archives,
  compare exact copies and likely bursts before exporting a move plan.”
- First action: “Try it with sample data.”
- Adjacent result: “Opens a four-file sample review in this browser.”

The cold page has `lang="en"`, one h1, one main landmark, no horizontal
overflow, no valid-page console error, and no serious or critical Axe result.
Evidence is in `review-5-artifacts/cold-mobile-390x844.png` and `qa.json`.

## 2. Copy audit

Counts treat a URL, price, version, file format, and hyphenated term as one
word. Repeated navigation/footer text is listed once. Commands in code blocks
are not sentences. No sentence exceeds 22 words, no banned marketing adjective
appears, terminology is consistent, and every button names an action or result.

### Landing page

| Text | Words | Result |
| --- | ---: | --- |
| Skip to main content | 4 | Pass |
| Photo Cull Review | 3 | Pass — wordmark |
| Demo | 1 | Pass — destination link |
| How it works / How | 3 / 1 | Pass — responsive destination link |
| Privacy | 1 | Pass — destination link |
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
| How it works | 3 | Pass — section heading |
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
| Archive pass | 2 | Pass — paid-tier heading |
| Free for folders up to 750 supported files. | 8 | Pass — `free-limit` |
| A one-time US$12 pass scans folders above the 750-file free limit. | 11 | Pass — `archive-pass-above-limit` |
| US$12 one time | 3 | Pass |
| Buy Archive pass at checkout | 5 | Pass — result and destination named |
| (opens external checkout) | 3 | Pass — accessible destination cue |
| Restore a license | 3 | Pass |
| Local photo review before anything moves. | 6 | Pass |
| Original generated archive illustration · Built by Param Factory · v1.0.11 | 9 | Pass — provenance/build label |

### Landing dialog and conditional states

| Text | Words | Result |
| --- | ---: | --- |
| Close license dialog | 3 | Pass |
| One-time pass | 2 | Pass |
| Archive pass | 2 | Pass |
| This device has an active archive pass. | 7 | Pass |
| Scan folders above the 750-file free limit for US$12 once. | 10 | Pass — `archive-pass-above-limit` |
| The free product handles up to 750 files. | 8 | Pass — `free-limit` |
| Exporting your move plan is always free. | 7 | Pass — `free-export` |
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
| This folder contains 751 supported files. | 6 | Pass |
| The free product scans up to 750; choose a smaller folder or buy an Archive pass. | 16 | Pass |
| No supported photos or videos were found. | 7 | Pass |
| Choose a folder containing JPEG, PNG, WebP, GIF, BMP, MP4, MOV, M4V, or WebM files. | 15 | Pass |

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
| Review it and keep an independent backup before moving media. | 10 | Pass |
| See the product brief, visual system, privacy policy, and terms. | 10 | Pass |
| Deploy | 1 | Pass — heading |
| Upload the contents of dist/ to the static host with SPA fallback to index.html. | 14 | Pass |
| Preserve /privacy/ and /terms/ directory indexes and serve sw.js without long-lived immutable caching so PWA updates can be detected. | 19 | Pass |
| Licensed under the MIT License. | 5 | Pass |

Terminology remains consistent: downloaded CSV instructions are a **move
plan**, saved state is a **workspace**, exact results are **exact copies**,
cautious visual/time groups are **likely bursts**, and the paid entitlement is
the **Archive pass**.

## 3. Demo and sandbox

- The first-screen action reaches `/?demo=1` in one click.
- At 390 × 844, the first group ends at 539 px, `IMG_2041.jpg` at 767 px,
  and both decision controls at 840 px. Their center points receive pointer
  events immediately. At 1440 × 900, all four checks end by 750 px.
- The first demo screen contains four named family files, two groups, dates,
  paths, sizes, local previews, and Keep/Move decisions.
- The persistent banner identifies sample data and separate storage. Reset demo
  returned a changed decision to undecided in 78 ms and displayed “Sample
  review reset.” Start for real returned to the existing real workspace.
- A live clean-context isolation check seeded a real review and Keep decision,
  entered and changed the demo, reset it, exited, and found the real Keep
  decision unchanged. IndexedDB exposed separate `photo-cull-review` and
  `photo-cull-review-demo` databases.
- The populated demo, banner, previews, and saved decision reload offline under
  the active `photo-cull-shell-v12` worker. The cache contains 21 requests.
- Home, demo decisions, export, reset, legal routes, and offline preparation
  contacted only `https://photo-cull-review.sociobot.in`.

## 4. Claims

The clean clone was `/tmp/photo-cull-review-review5.NzIcE1/repo`. After
`npm ci`, every command in `.factory/claims.json` was run separately and
exactly as listed. Every claim tag occurs in exactly one test.

| Claim | Result | Observable coverage confirmed |
| --- | --- | --- |
| `exact-duplicates` | Pass | Complete exported hashes equal Node SHA-256 fixture digests. |
| `similar-suggestions` | Pass | Exactly 30 seconds is included, 31 seconds is excluded, and the result remains a suggestion. |
| `csv-export` | Pass | Six headers, row count, quoted paths, types, reasons, full hashes, and unchanged sources are asserted. |
| `workspace-persistence` | Pass | Decisions survive reload. |
| `offline-reload` | Pass | A populated demo, previews, banner, and decision survive offline reload in a dedicated context. |
| `local-only` | Pass | Free demo requests remain same-origin. |
| `demo-sandbox` | Pass | Four files, two groups, Reset, exit, and preservation of seeded real work are asserted. |
| `free-limit` | Pass | 750 files are accepted and 751 are rejected before scanning. |
| `workspace-backup` | Pass | A JSON backup restores decisions and documented fields. |
| `archive-pass-above-limit` | Pass | Recorded validation, US$12 checkout details, and a 751-file browser scan are asserted. |
| `video-streaming` | Pass | Stream-only video doubles hash exactly and have no previews. |
| `license-verification-request` | Pass | The verification endpoint is the only cross-origin request after a token is supplied. |
| `group-explanations` | Pass | Exact-copy and cautious likely-burst reasons are visible before decisions. |
| `capture-time` | Pass | Embedded camera capture time wins over file modification time. |
| `supported-formats` | Pass | All nine documented formats are accepted and unsupported text is skipped. |
| `image-previews` | Pass | Every displayed image candidate has a local preview. |
| `free-export` | Pass | CSV and JSON exports work without a license. |
| `no-setup` | Pass | Empty browser storage can start a review without an account or key. |
| `storage-controls` | Pass | The token stays local and Start a new scan clears real workspace state. |
| `runtime-privacy` | Pass | Product and legal routes use local resources and create no tracking state. |
| `merchant-refund` | Pass | Recorded revoked-license behavior and the merchant/checkout contract are asserted. |

The live landing, demo, README, Privacy, Terms, dialog, and conditional error
copy were cross-checked against the registry. No unlisted claim-like sentence
or untested claim remains.

## 5. Earlier findings checked again

Every finding in Reviews 1–4 and every closure claim in Polish 1–4 and the
handoff was checked against production and current source/tests. Review 3 and
Review 4 reopen earlier IDs; the repeated IDs appear once with their final
status.

### Review 1

| ID | Current production and code/test evidence | Status |
| --- | --- | --- |
| F-1-1 | CSV rows expose full hashes; the tagged test compares them with complete Node digests. | Fixed |
| F-1-2 | The unit test includes exactly 30 seconds and excludes 31 seconds. | Fixed |
| F-1-3 | CSV assertions parse headers, rows, paths, types, reasons, and hashes. | Fixed |
| F-1-4 | Demo coverage seeds real work, checks four files/two groups, resets, exits, and preserves real work; the live flow agrees. | Fixed |
| F-1-5 | A dedicated context reloads populated demo data and its decision offline. | Fixed |
| F-1-6 | Recorded validation, live US$12 checkout, and a 751-file UI scan pass. | Fixed |
| F-1-7 | Exact and likely-burst explanations are registered and tested. | Fixed |
| F-1-8 | Embedded capture time, not modification time, is registered and tested. | Fixed |
| F-1-9 | All nine formats and local image previews are registered and tested. | Fixed |
| F-1-10 | Unlicensed CSV and JSON exports are registered and tested. | Fixed |
| F-1-11 | A clean browser starts review without an account, server, or key. | Fixed |
| F-1-12 | Token storage and Start a new scan clearing are registered and tested. | Fixed |
| F-1-13 | Both exports are parsed for documented path and full-hash fields. | Fixed |
| F-1-14 | Runtime requests, resources, and tracking storage are inventoried. | Fixed |
| F-1-15 | Merchant and refunded-license behavior use recorded contract responses. | Fixed |
| F-1-16 | Home, Demo, Privacy, Terms, 404, and Back focus and announce the incoming h1. | Fixed |
| F-1-17 | Visitor copy consistently calls the CSV a move plan. | Fixed |
| F-1-18 | The eyebrow says “Review duplicate photos on this device.” | Fixed |
| F-1-19 | The caption states directly that the app creates a plan and moves nothing. | Fixed |
| F-1-20 | The section is named “How it works.” | Fixed |
| F-1-21 | The process heading names duplicate and burst review. | Fixed |
| F-1-22 | Pricing names the 750-file threshold. | Fixed |
| F-1-23 | Pricing states only the tested US$12 entitlement. | Fixed |
| F-1-24 | Desktop says “View Archive pass”; mobile says “View pass.” | Fixed |
| F-1-25 | README opens with the household photo-review task. | Fixed |
| F-1-26 | README overview uses short sentences. | Fixed |
| F-1-27 | README explains visual/time comparison without hash jargon. | Fixed |
| F-1-28 | README leads with browser persistence rather than its database name. | Fixed |
| F-1-29 | README separates free and paid pricing into factual sentences. | Fixed |
| F-1-30 | README describes visible video behavior without decoding jargon. | Fixed |
| F-1-31 | README says free review contacts no other site or service. | Fixed |

### Reviews 2–4 and handoff

| ID | Current production and code/test evidence | Status |
| --- | --- | --- |
| F-2-1 / F-4-1 | Mobile and desktop show the first group, filename, and both decisions in the first viewport; the hidden route announcement does not intercept their pointer centers. | Fixed |
| F-2-2 | Loading says “Opening Photo Cull Review.” | Fixed |
| F-2-3 | The first process step says “Find exact copies and likely bursts.” | Fixed |
| F-2-4 | Landing copy explains exact matching as checking every byte. | Fixed |
| F-2-5 | Landing copy explains likely bursts by photo appearance and capture time. | Fixed |
| F-2-6 | The license dialog says “free product.” | Fixed |
| F-2-7 | README exact matching uses two concrete sentences. | Fixed |
| F-2-8 | README describes appearance and camera-recorded time plainly. | Fixed |
| F-2-9 | Demo h1 is “Review duplicate and burst photos.” | Fixed |
| F-2-10 | The workspace clear action is “Start a new scan.” | Fixed |
| F-2-11 | Legal-route forward and Back navigation focus and announce h1. | Fixed |
| F-3-1 | “Any size,” “unlimited,” and “unlock” are absent; the pass is bounded above 750 files. | Fixed |
| F-3-2 | The sample outcome says “in this browser,” with no speed claim. | Fixed |
| F-3-3 | Demo says files “are ready to review.” | Fixed |
| F-3-4 | Scan h1 says it checks photos for copies and likely bursts. | Fixed |
| F-3-5 | Scan assurance says “File checks and small previews.” | Fixed |
| F-3-6 | The 404 action says “Return to photo review.” | Fixed |
| F-3-7 | Every route references a decoded 180 × 180 Apple touch icon. | Fixed |
| F-3-8 | Both purchase actions say “at checkout” and expose an external cue. | Fixed |
| Handoff F-8-1 | The full 58-test run completes with 55 passes and three intended project skips; offline teardown leaves the browser usable. | Fixed |

## 6. Structure, accessibility, and identity

- Titles are route-specific and under 60 characters: Home uses “Photo Cull
  Review — plan duplicate photo moves”; Demo, Privacy, Terms, and 404 use
  route-first titles.
- Each route has `lang="en"`, one h1, one main landmark, a meta description,
  canonical, OG/Twitter data, SVG favicon, and 180 × 180 Apple touch icon. The
  social image is 1200 × 630.
- The sitemap lists Home, Demo, Privacy, and Terms. `robots.txt` points to it.
- A missing URL returns HTTP 404 with the designed archive-style page and a
  “Return to photo review” action.
- A crawl of every unique link on Home, Demo, Privacy, Terms, and 404 found no
  dead link. The checkout endpoint was separately confirmed to reach a Photo
  Cull Review USD US$12 hosted checkout.
- Forward and Back restore the route and focus/announce its h1. Keyboard focus
  is visible, reduced motion disables animation and smooth scrolling, and 200%
  text reflows at 390 px without horizontal overflow.
- Axe found zero serious or critical issues on Home, Demo, Privacy, Terms, and
  404. `/opt/fleet/lib/verify-url.sh` found no valid-page console error,
  missing alt text, or unnamed button.
- The generated moonlit archive art, warm-paper darkroom palette, editorial
  serif, mounted-photo geometry, red review thread, hand-drawn samples, and
  light-table workspace form a distinct identity rather than a generic SaaS
  template. Asset provenance is recorded in `.factory/design.md` and the
  footer.
- The application JavaScript is 38,692 bytes raw and 14.18 kB gzip. The
  checked live HTML, JS, CSS, worker, manifest, legal pages, and 404 hashes
  match the fresh local build.

## 7. Missed leverage

No finding is warranted. The brief’s complete loop exists: folder import,
exact-copy matching, cautious burst suggestions, human decisions, CSV move-plan
export, and JSON backup/restore. Sync would contradict the local-only safety
boundary. Model-assisted classification is not an obvious missing expectation
because exact hashing and explicit human judgment are the product’s safety
model.

## Verification summary

- Clean clone `npm ci`: pass; 60 packages, zero audit findings.
- All 21 exact claim commands: pass independently.
- `npm test`: 12/12 pass.
- `npm run build`: pass; `dist/` produced.
- `npm run test:e2e`: 55 pass, 3 intentional project-specific skips.
- Live URL verifier and Playwright/Axe audit: pass on all public routes.
- Live demo reset, real/demo isolation, export, offline reload, request log,
  route focus, link crawl, 390 px/desktop viewport checks, and artifact parity:
  pass.

## What would make this perfect

Nothing remains within this work order. Preserve the current claim tests,
first-viewport occlusion regression, demo namespace separation, route-focus
checks, and live parity checks on future releases.
