# Adversarial first-read review 2 — Photo Cull Review

**Verdict: FAIL**

**Reviewed:** 2 September 2026 UTC

**Live product:** <https://photo-cull-review.sociobot.in>

**Repository base:** `6f2841c2b48280b4d3563485750aac9d1807a91b`

One blocking demo finding and ten minor copy or navigation findings remain. All
21 registered claim commands pass from a clean clone, and no claim-like
sentence is unlisted. A zero-finding pass is therefore not available.

## Findings

### Blocking

#### F-2-1 — The one-click demo hides the sample work below the first screen

- **Quote/location:** `/?demo=1`, 390 × 844 first viewport. The screen says
  “4 files indexed on this device. 2 candidate groups need a human decision,”
  but no candidate group, filename, preview, or decision control is visible.
- **Measured evidence:** On mobile, the first group heading starts at 1,167 px,
  the first sample card at 1,542 px, the first preview at 1,577 px, and the
  first Keep control at 1,893 px. On desktop, the first card starts at 817 px
  but its preview starts at 905 px, below the 900 px viewport. See
  [demo-mobile.png](review-2-artifacts/demo-mobile.png) and
  [demo-desktop.png](review-2-artifacts/demo-desktop.png).
- **Why this blocks acceptance:** The required first screen after the one-click
  demo does not show realistic sample media being reviewed. A phone visitor
  sees setup-like summary and export controls, then must scroll more than one
  viewport to discover the actual comparison task.
- **Concrete fix:** On demo entry, place the active candidate group before
  export/backup actions and the progress summary. At 390 × 844, show at least
  the group type, one realistic filename or preview, and a Keep or Move to
  review control without scrolling. Add a mobile first-demo-viewport test that
  asserts those elements end at or above 844 px.

### Minor

#### F-2-2 — The loading label uses an archive-desk metaphor

- **Quote/location:** landing loading state, “Opening the archive desk”.
- **Why this matters:** It does not say what the product is doing and could be
  reused by an unrelated archive product.
- **Concrete rewrite:** “Opening Photo Cull Review”.

#### F-2-3 — The first process heading uses technical jargon

- **Quote/location:** landing, How it works, “Index locally”.
- **Why this matters:** “Index” and “locally” do not name the result in a
  household photo-cleanup task.
- **Concrete rewrite:** “Find exact copies and likely bursts”.

#### F-2-4 — The landing page exposes an unexplained hash name

- **Quote/location:** landing, “Complete SHA-256 hashes find exact files.”
- **Why this matters:** A visitor should not need to know a hashing algorithm
  to understand exact matching.
- **Concrete rewrite:** “The app checks every byte to find exact copies.”

#### F-2-5 — The landing page uses unexplained “visual hash” jargon

- **Quote/location:** landing, “A small visual hash suggests nearby burst
  frames.”
- **Why this matters:** The implementation term obscures the visible behavior.
- **Concrete rewrite:** “The app compares photos and capture times to suggest
  likely bursts.”

#### F-2-6 — The license dialog renames the product as a “desk”

- **Quote/location:** landing license dialog, “The free desk handles up to 750
  files.”
- **Why this matters:** “Desk” is a metaphor and conflicts with “free product”
  in Terms and “free review” in Privacy.
- **Concrete rewrite:** “The free product handles up to 750 files.”

#### F-2-7 — The README leads a feature with implementation jargon

- **Quote/location:** README, “Streams complete files through local SHA-256
  hashing to find exact copies without loading a large video whole into
  memory.”
- **Why this matters:** “Streams,” “local SHA-256 hashing,” and “loading ...
  whole into memory” require implementation knowledge.
- **Concrete rewrite:** “Checks every byte to find exact copies. Large videos
  are checked in small pieces to limit memory use.”

#### F-2-8 — The README replaces one hash term with a metaphor

- **Quote/location:** README, “Compares compact visual fingerprints and JPEG
  capture times to suggest photos taken in one burst.”
- **Why this matters:** “Visual fingerprints” is metaphorical, and “JPEG
  capture times” does not explain that the camera-recorded time is used.
- **Concrete rewrite:** “Compares how photos look and when the camera recorded
  them to suggest likely bursts.”

#### F-2-9 — The demo h1 does not name the task

- **Quote/location:** demo, “Your review desk”.
- **Why this matters:** The metaphor is the main heading on the product screen,
  yet it does not say what is being reviewed.
- **Concrete rewrite:** “Review duplicate and burst photos”.

#### F-2-10 — “New scan” is not a result-naming verb action

- **Quote/location:** demo workspace button, “New scan”.
- **Why this matters:** The control clears the saved workspace after
  confirmation, but its noun label does not state the action.
- **Concrete rewrite:** “Start a new scan”.

#### F-2-11 — Legal-page route changes leave focus on the document body

- **Quote/location:** header Home → Privacy, Privacy → Demo, and footer Privacy
  → Terms.
- **Check:** After each navigation and a 500 ms wait, `document.activeElement`
  was `BODY`. Privacy and Terms also contain no polite live region. Home → Demo
  and browser Back correctly focus the new h1.
- **Why this matters:** Keyboard and screen-reader users do not get the required
  heading focus cue on all in-product route changes.
- **Concrete fix:** Apply the same route-focus marker and h1 focus/announcement
  behavior to the static Privacy, Terms, and 404 shell. Add forward and Back
  assertions for every public route.

## 1. Cold first screen

Fresh Chromium contexts had no cookies, local storage, or IndexedDB data.

| View | What does it do? | For whom? | What should I click first? | Result |
| --- | --- | --- | --- | --- |
| 390 × 844 | Compares duplicate photos and likely bursts before creating a move plan. | Households with large or crowded photo archives. | “Try it with sample data”; the next line says it opens a four-file review. | Pass. The action, outcome, real-folder action, and three facts fit by 835 px. |
| 1440 × 900 | Same answer. | Same answer. | Same action. | Pass. Required copy and facts fit by 866 px. |

Evidence: [cold-mobile.png](review-2-artifacts/cold-mobile.png) and
[cold-desktop.png](review-2-artifacts/cold-desktop.png). Both views have one h1,
one main landmark, `lang="en"`, no horizontal overflow, and no console error.

## 2. Copy audit

Counts treat URLs, prices, hyphenated terms, and file-format names as one word.
Responsive alternatives show separate counts. No sentence exceeds 22 words and
no banned marketing adjective appears. Every flag below has its own finding and
rewrite above.

### Landing page

| Text | Words | Result |
| --- | ---: | --- |
| Skip to main content | 4 | Pass |
| Photo Cull Review | 3 | Pass — wordmark |
| Demo | 1 | Pass — destination link |
| How it works / How | 3 / 1 | Pass — responsive nav labels; accessible name is complete |
| Privacy | 1 | Pass — destination link |
| View Archive pass / Pass | 3 / 1 | Pass — responsive control; accessible name names the action |
| Opening the archive desk | 4 | Flag F-2-2 |
| Loading your local review… | 4 | Pass |
| Review duplicate photos on this device | 6 | Pass |
| Clean up duplicate photos. | 4 | Pass |
| Before anything moves. | 3 | Pass — states the safety boundary |
| For households with large or crowded photo archives, compare exact copies and likely bursts before exporting a move plan. | 19 | Pass |
| Try it with sample data | 5 | Pass — result-naming action |
| Opens a four-file sample review immediately. | 6 | Pass — `demo-sandbox` |
| Choose your photo folder | 4 | Pass — result-naming action |
| JPEG, PNG, WebP, GIF, BMP, MP4, MOV, M4V, WebM | 9 | Pass — `supported-formats` |
| Photos stay on this device | 5 | Pass — `local-only` |
| Works offline after the first visit | 6 | Pass — `offline-reload` |
| Free for up to 750 files | 6 | Pass — `free-limit` |
| An imagined moonlit archive where a red thread connects photographic slides across paper dunes | 14 | Pass — image alt text |
| The app creates a move plan and does not move photos. | 11 | Pass — `csv-export` |
| How it works | 3 | Pass |
| Review duplicate and burst photos in three steps. | 8 | Pass |
| Index locally | 2 | Flag F-2-3 |
| Complete SHA-256 hashes find exact files. | 6 | Flag F-2-4 |
| A small visual hash suggests nearby burst frames. | 8 | Flag F-2-5 |
| Review every group | 3 | Pass |
| See why files were grouped. | 5 | Pass — `group-explanations` |
| Mark each one keep or move to review; suggestions never become facts. | 12 | Pass |
| Export, don’t delete | 3 | Pass |
| Download a CSV move plan for a separate review folder. | 10 | Pass — `csv-export` |
| Your source archive remains untouched. | 5 | Pass — `csv-export` |
| For folders over 750 files | 5 | Pass |
| Archive pass | 2 | Pass — paid tier name |
| Free for folders up to 750 supported files. | 8 | Pass — `free-limit` |
| A one-time US$12 pass removes the 750-file scan limit. | 9 | Pass — `archive-pass-unlimited` |
| US$12 one time | 3 | Pass |
| Buy archive pass | 3 | Pass — result-naming action |
| Restore a license | 3 | Pass — result-naming action |
| Local photo review before anything moves. | 6 | Pass — footer description |
| Original generated archive illustration · Built by Param Factory · v1.0.7 | 9 | Pass — provenance/build label |
| Close license dialog | 3 | Pass — accessible button name |
| One-time pass | 2 | Pass |
| Archive pass | 2 | Pass |
| This device has an active archive pass. | 7 | Pass — conditional state |
| Scan folders of any size for US$12 once. | 8 | Pass — `archive-pass-unlimited` |
| The free desk handles up to 750 files. | 8 | Flag F-2-6 |
| Exporting your move plan is always free. | 7 | Pass — `free-export` |
| Buy Archive pass | 3 | Pass — result-naming action |
| Have a license? | 3 | Pass |
| Paste it here. | 3 | Pass |
| Verify and restore | 3 | Pass — result-naming action |
| Sociobot/Dodo is the merchant of record. | 6 | Pass — `merchant-refund` |
| Refunds are handled there and revoke the license. | 8 | Pass — `merchant-refund` |
| Terms | 1 | Pass — destination link |
| Privacy | 1 | Pass — destination link |
| We could not recheck this Archive pass. | 7 | Pass — conditional error |
| Its last successful check remains active. | 6 | Pass — conditional state |
| We could not verify this license. | 6 | Pass — conditional error |
| Free limits remain active. | 4 | Pass — consequence |
| Check your connection and try again. | 6 | Pass — recovery action |
| This license is no longer active. | 6 | Pass — conditional error |
| Free limits are in use. | 5 | Pass — consequence |
| That license is no longer active for this product. | 9 | Pass — form error |
| Check the token and try again. | 6 | Pass — recovery action |

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
| Streams complete files through local SHA-256 hashing to find exact copies without loading a large video whole into memory. | 19 | Flag F-2-7 |
| Compares compact visual fingerprints and JPEG capture times to suggest photos taken in one burst. | 15 | Flag F-2-8 |
| It never uses file modification dates for this suggestion. | 9 | Pass — `capture-time` |
| Saves thumbnails, file details, groups, and decisions in your browser. | 10 | Pass |
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
| Factory staging may set VITE_BILLING_BASE=https://pilot-api.sociobot.in/api/v1; VITE_PRODUCT_SLUG can override the default slug. | 16 | Pass — configuration instruction |
| No provider credentials belong in this repository. | 7 | Pass — repository instruction |
| Privacy and safety model | 4 | Pass |
| All photo data stays in browser storage. | 7 | Pass — `local-only` |
| Free review contacts no other website or service. | 8 | Pass — `local-only` |
| With a supplied license token, verification is the app’s only outside request. | 12 | Pass — `license-verification-request` |
| A move plan is an instruction sheet, not an executable deletion script. | 12 | Pass — `csv-export` |
| Review it and keep an independent backup before moving media. | 10 | Pass — safety instruction |
| See the product brief, visual system, privacy policy, and terms. | 10 | Pass — documentation links |
| Deploy | 1 | Pass |
| Upload the contents of dist/ to the static host with SPA fallback to index.html. | 14 | Pass — deployment instruction |
| Preserve /privacy/ and /terms/ directory indexes and serve sw.js without long-lived immutable caching so PWA updates can be detected. | 19 | Pass — deployment instruction |
| Licensed under the MIT License. | 5 | Pass |

### Demo copy checked with the first screen

| Text | Words | Result |
| --- | ---: | --- |
| Demo — sample data, separate from your workspace | 7 | Pass — persistent banner |
| Changes stay only in this sample. | 6 | Pass — isolation explanation |
| Reset demo | 2 | Pass — result-naming action |
| Start for real | 3 | Pass — required demo exit |
| Your review desk | 3 | Flag F-2-9 |
| New scan | 2 | Flag F-2-10 |
| Export move plan | 3 | Pass |
| Back up workspace | 3 | Pass |
| Restore workspace | 2 | Pass |

Terminology is otherwise consistent: the CSV is a “move plan,” saved state is
a “workspace,” exact results are “exact copies,” suggestions are “likely
bursts,” and the paid entitlement is the “Archive pass.”

## 3. Demo and sandbox

- The first-screen action opens `/?demo=1` in one click.
- The demo contains four named family-archive files, two groups, dates, sizes,
  paths, and three original sample previews. The data is realistic once the
  visitor scrolls to it.
- The persistent banner says “Demo — sample data, separate from your
  workspace,” explains that changes stay in the sample, and provides Reset
  demo and Start for real.
- A live fresh-context check seeded a real fixture review and Keep decision,
  entered demo, changed and reset a sample decision, exited, and confirmed the
  original real Keep decision remained selected.
- Source and live IndexedDB inspection confirmed separate
  `photo-cull-review` and `photo-cull-review-demo` databases. Start for real
  removed the demo workspace record.
- Reset works after its IndexedDB operation completes. The demo failure is the
  first-viewport presentation in F-2-1, not isolation or reset behavior.

## 4. Claims

The clean clone was `/tmp/photo-cull-review-review2.kou25D/repo` at the exact
reviewed commit. After `npm ci`, every command below was run separately exactly
as listed in `.factory/claims.json`. Each claim ID appears on exactly one test.

| Claim | Declared command result | Coverage check |
| --- | --- | --- |
| `exact-duplicates` | Pass — 2 browser checks | Exported hashes equal complete Node SHA-256 digests |
| `similar-suggestions` | Pass — 1 unit check | Includes 30 seconds, excludes 31, retains suggestion wording |
| `csv-export` | Pass — 2 browser checks | Parses six columns, two rows, paths, reasons, types, and full hashes |
| `workspace-persistence` | Pass — 2 browser checks | Decisions survive reload |
| `offline-reload` | Pass — 1 dedicated browser check | Populated demo, previews, banner, and decision survive offline reload |
| `local-only` | Pass — 2 browser checks | Demo requests are same-origin only |
| `demo-sandbox` | Pass — 2 browser checks | Four files, two groups, reset, exit, and seeded real decision preserved |
| `free-limit` | Pass — 1 unit check | Accepts 750 and rejects 751 before scan |
| `workspace-backup` | Pass — 2 browser checks | JSON exports and restores the decision and sensitive fields |
| `archive-pass-unlimited` | Pass — 2 browser checks | Recorded valid license, live US$12 checkout, and 751-file browser scan |
| `video-streaming` | Pass — 1 unit check | Stream-only doubles hash exactly with no preview |
| `license-verification-request` | Pass — 2 browser checks | The verify URL is the sole cross-origin request |
| `group-explanations` | Pass — 2 browser checks | Exact and cautious likely-burst reasons are visible |
| `capture-time` | Pass — 1 unit check | Embedded capture time wins over modification time |
| `supported-formats` | Pass — 1 unit check | All nine documented formats accepted; text skipped |
| `image-previews` | Pass — 2 browser checks | Both groups show same-origin sample previews |
| `free-export` | Pass — 2 browser checks | CSV and JSON export without a license |
| `no-setup` | Pass — 2 browser checks | Empty storage/cookies; review starts without account or key request |
| `storage-controls` | Pass — 2 browser checks | Token stays local; New scan clears and remains clear after reload |
| `runtime-privacy` | Pass — 2 browser checks | Home, demo, and legal routes load local resources and no tracking state |
| `merchant-refund` | Pass — 2 browser checks | Recorded revoked response is inactive; merchant copy and checkout URL match |

The landing page, demo, README, Privacy, Terms, and 404 copy were cross-checked
against this registry. No unlisted claim-like sentence or untested registered
claim remains.

## 5. Sandbox, offline, and privacy behavior

- The live demo interaction request log contained only
  `https://photo-cull-review.sociobot.in`.
- A dedicated fresh context reached service-worker control, stored a demo
  decision, went offline, reloaded, and retained the demo banner, review state,
  and two visible previews.
- Demo actions never read or changed the seeded real workspace.
- No ad, analytics, tracking, font, or runtime-script request left the product
  origin during the checked routes.

## 6. Earlier findings checked again

Every finding in `.factory/review-1.md`, every closure row in
`.factory/polish-1.md`, and the preview-lifecycle repair in the earlier handoff
was checked against live behavior and source/tests.

| Earlier finding | Live and code confirmation | Status |
| --- | --- | --- |
| F-1-1 | CSV rows expose full hashes and the test compares them with complete Node digests. | Fixed |
| F-1-2 | Unit test includes exactly 30 seconds and excludes 31 seconds. | Fixed |
| F-1-3 | CSV test parses headers, row count, quoted paths, types, reasons, and hashes. | Fixed |
| F-1-4 | Demo test seeds real work, checks four files/two groups, resets, exits, and preserves real state; live check agrees. | Fixed |
| F-1-5 | Dedicated context reloads populated demo data and a decision offline. | Fixed |
| F-1-6 | UI verification, live Dodo checkout at US$12, and 751-file scan all pass. | Fixed |
| F-1-7 | `group-explanations` is registered and tests both group types. | Fixed |
| F-1-8 | `capture-time` is registered and ignores modification time. | Fixed |
| F-1-9 | Format and preview claims are registered and pass. | Fixed |
| F-1-10 | Unlicensed CSV and JSON export are registered and pass. | Fixed |
| F-1-11 | Fresh empty context starts a review without account or key. | Fixed |
| F-1-12 | License storage and New scan clearing are registered and pass. | Fixed |
| F-1-13 | CSV and JSON tests inspect path and complete-hash fields. | Fixed |
| F-1-14 | Runtime privacy is registered and checks requests and tracking storage. | Fixed |
| F-1-15 | Merchant/refund behavior is registered and uses recorded revoked verification. | Fixed |
| F-1-16 | Home → Demo and browser Back focus the incoming h1 and announce it. The new legal-route gap is F-2-11. | Fixed as scoped |
| F-1-17 | Visitor copy consistently calls the CSV a “move plan”; old “manifest” variants are absent. | Fixed |
| F-1-18 | Live eyebrow says “Review duplicate photos on this device.” | Fixed |
| F-1-19 | Live caption directly says the app creates a plan and does not move photos. | Fixed |
| F-1-20 | Live section label is “How it works.” | Fixed |
| F-1-21 | Live process heading names duplicate and burst review in three steps. | Fixed |
| F-1-22 | Live pricing eyebrow states the 750-file boundary. | Fixed |
| F-1-23 | Live pricing sentence states the US$12 entitlement with no seasonal slogan. | Fixed |
| F-1-24 | Header control’s accessible name is “View Archive pass.” | Fixed |
| F-1-25 | README opens with the household task and no “local-first review desk.” | Fixed |
| F-1-26 | README overview is split into short sentences. | Fixed |
| F-1-27 | The old “visual difference hash plus embedded ...” wording is gone. The replacement has a new metaphor finding, F-2-8. | Fixed as prescribed |
| F-1-28 | README leads with browser persistence and omits IndexedDB from user-facing copy. | Fixed |
| F-1-29 | Free and paid pricing are separate sentences and use US$12 consistently. | Fixed |
| F-1-30 | README describes visible video behavior without “preview decoding.” | Fixed |
| F-1-31 | README says “contacts no other website or service.” | Fixed |
| Handoff F-8-1 | Full suite finishes with 52 passed and 2 intended target skips; offline teardown leaves the preview usable. | Fixed |

No earlier finding regressed under its original scope.

## 7. Structure, links, identity, and accessibility

- Titles are route-specific and follow the required pattern: home, Demo,
  Privacy, Terms, and Page not found. All are under 60 characters.
- Every checked route has `lang="en"`, one h1, one main landmark, a description,
  canonical, OG/Twitter data, SVG favicon, 192 px touch icon, and the shared
  header/footer. The social image is 1200 × 630.
- A missing path returns HTTP 404 with the designed archive-style page.
  `/404.html` itself returns 200 as the hosted error document.
- All same-origin links and assets crawled successfully; every in-page fragment
  exists. `sociobot.in` returns 200. The registered paid-claim test followed the
  checkout URL to a valid Dodo session.
- Home → Demo and Back preserve history and focus. F-2-11 records the uncovered
  legal-route focus failure.
- Playwright Axe found zero serious or critical violations on home, demo,
  Privacy, Terms, 404, and a missing-path response. The live URL verifier found
  one h1, `lang`, main, complete image/button labels, and no home-page console
  error. The expected missing-document request is the only 404 console entry.
- The full browser suite confirms keyboard decisions, dialog focus return,
  200% text reflow, reduced motion, 44 px mobile controls, and no horizontal
  overflow.
- The deployed app JS, CSS, and index hashes exactly match the clean build.
  App JS is 37,978 bytes raw and 14.08 kB gzip.
- The darkroom-paper palette, editorial serif, mounted-photo geometry, red
  review thread, original archive illustration, and light-table workspace form
  a distinct product identity rather than a generic SaaS template.

## 8. Missed leverage

No feature finding is warranted. The brief’s complete loop exists: folder
import, exact matching, cautious burst suggestions, human decisions, CSV move
plan, and JSON backup/restore. Sync would contradict the local-only boundary.
An AI step is not an obvious expectation because exact hashes and explicit
human judgment are the safety model; adding one would not close F-2-1.

## Verification summary

- Clean clone `npm ci` — pass; 60 packages, 0 audit findings.
- All 21 exact `.factory/claims.json` commands — pass individually.
- `npm test` — 12/12 passed.
- `npm run build` — passed; `dist/` produced.
- `npm run test:e2e` — 52 passed, 2 intentional target-specific skips.
- `/opt/fleet/lib/verify-url.sh` against production — pass.
- Live routes, links, demo storage, request log, offline reload, Axe, route
  focus, and 390 px/desktop viewport measurements were independently checked.

## What would make this perfect

Put one real sample comparison and decision control inside the first demo
viewport at both 390 × 844 and desktop sizes. Replace every flagged metaphor or
technical phrase with its concrete rewrite, rename “New scan,” and extend h1
focus/announcement behavior to Privacy, Terms, and 404 navigation. Add
regressions for the demo content position and every route transition, then rerun
all 21 claims and this full review with zero findings.
