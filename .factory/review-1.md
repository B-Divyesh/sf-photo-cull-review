# Adversarial first-read review 1 — Photo Cull Review

**Verdict: FAIL**  
**Reviewed:** 1 September 2026 UTC  
**Live product:** <https://photo-cull-review.sociobot.in>  
**Repository base:** `df345aa669f9344bc1ac16292cff4e7a0ba24626`

The first screen and demo are clear and usable, all 12 declared commands exit successfully, and the full local suite passes. The product does not pass this review because six claim checks do not confirm their complete registered claims, nine claim groups are absent from `.factory/claims.json`, route changes do not focus the new heading, and the copy audit has plain-language flags.

## Findings

### Blocking

#### F-1-1 — The exact-copy test does not confirm the claimed complete SHA-256 result

- **Quote/location:** `.factory/claims.json`, `exact-duplicates`: “Finds byte-for-byte duplicate media with complete SHA-256 hashes.”
- **Check:** The declared command passes in both browser projects. The tagged test confirms an exact-copy group and confirms that the source fixture does not change. It computes a fixture hash outside the app but never compares that value with the hash produced or exported by the app.
- **Why this blocks acceptance:** A size-, name-, or partial-hash implementation could satisfy the current assertion while the complete-hash claim remained false.
- **Concrete fix:** Read the exported hash for each fixture and compare it with Node’s complete SHA-256 digest. Keep that assertion in the test tagged `@claim:exact-duplicates`.

#### F-1-2 — The 30-second similarity limit is not tested at its stated boundary

- **Quote/location:** `.factory/claims.json`, `similar-suggestions`: “Suggests visually close photos captured within 30 seconds without calling them duplicates.”
- **Check:** The tagged unit test confirms a pair 1 second apart and excludes a record 89 seconds later. It does not check 30 seconds and 31 seconds.
- **Why this blocks acceptance:** The numeric limit is part of the claim. The test would still pass with several incorrect thresholds.
- **Concrete fix:** Assert inclusion at exactly 30 seconds and exclusion immediately above 30 seconds, while retaining the “suggestion,” not “duplicate,” classification assertion.

#### F-1-3 — The CSV test does not confirm the declared CSV contents

- **Quote/location:** `.factory/claims.json`, `csv-export` sandbox: “assert header row and one row per record.”
- **Check:** The command passes, but the tagged test checks only the filename, safety comment, and unchanged fixture digest. It does not parse the header or count and validate exported records.
- **Why this blocks acceptance:** A blank or malformed plan with the expected comment could pass.
- **Concrete fix:** Parse the download and confirm the six declared columns, one row for every “Move to review” decision, quoted paths, group type, reason, and complete hash.

#### F-1-4 — The demo test does not fully confirm the four-file sample or preservation of existing real data

- **Quote/location:** First screen: “Opens a four-file sample review immediately.” Demo claim: “Sample decisions use a separate demo workspace that can be reset or discarded.”
- **Check:** The command passes and the live demo shows two realistic groups. The test starts with an empty real workspace, checks one demo decision and Reset, then confirms that the real landing page is empty. It never seeds real decisions before entering demo and never asserts the four-file count.
- **Why this blocks acceptance:** A demo that clears or replaces existing real state could pass this test. The quantitative four-file promise is also unconfirmed.
- **Concrete fix:** Seed a real workspace and decision, enter the demo, confirm four sample files and both groups, change and reset the demo, leave it, and confirm the original real workspace and decision are unchanged.

#### F-1-5 — The offline test does not use the sandbox declared in the claims registry

- **Quote/location:** `.factory/claims.json`, `offline-reload` sandbox: “fresh browser context, demo data, context.setOffline(true) after first load.”
- **Check:** The command passes in a dedicated fresh context, but it opens `/`, not `/?demo=1`, and confirms only the empty shell after offline reload. A separate manual live check confirmed the populated demo currently reloads offline.
- **Why this blocks acceptance:** The registered test would pass if the shell cached correctly but sample assets or saved demo decisions were unavailable offline.
- **Concrete fix:** Open `/?demo=1`, make a decision, wait for service-worker control, go offline, reload, and confirm the sample images, groups, banner, and saved decision remain available.

#### F-1-6 — The Archive pass test does not confirm a validated license or the US$19 one-time price

- **Quote/location:** `.factory/claims.json`, `archive-pass-unlimited`: “A one-time US$19 Archive pass lets a licensed user scan folders above the 750-file free limit.”
- **Check:** The command passes by calling `scanFiles(files, true, ...)`. It does not establish `true` through license verification, confirm the checkout amount or one-time billing basis, or scan through the browser flow.
- **Why this blocks acceptance:** The test confirms only that an internal boolean removes the file limit, not the paid claim shown to a visitor.
- **Concrete fix:** Use a recorded valid-license response to activate the pass through the UI and scan 751 files. Add a billing contract check that confirms the product’s one-time US$19 configuration without starting a purchase.

### Major

#### F-1-7 — Group-explanation claims are not registered

- **Quote/location:** Landing: “See why files were grouped.” README: “explains each group”.
- **Why this matters:** This is a useful product outcome, but no claim entry confirms that exact and similar groups show the correct reason.
- **Concrete fix:** Add a claim and test that opens both sample groups and confirms the complete-hash explanation for exact copies and the cautious time/visual explanation for a likely burst.

#### F-1-8 — The capture-time source claim is not registered

- **Quote/location:** README: “It never guesses capture time from file modification dates.”
- **Why this matters:** A regression test exists, but visitors cannot trace this statement to `.factory/claims.json`.
- **Concrete fix:** Add a claim entry pointing to the existing capture-time regression, or expand `similar-suggestions` to state and test this behavior.

#### F-1-9 — The supported-format and preview claims are not registered

- **Quote/location:** Landing format list; README: “Supported inputs are JPEG, PNG, WebP, GIF, BMP, MP4, MOV, M4V, and WebM. Images get local previews”.
- **Why this matters:** A visitor may choose the product based on a particular file type, yet the complete format matrix and image-preview result have no claim test.
- **Concrete fix:** Add a fixture-driven claim covering every listed type, unsupported-file handling, image previews, and the documented no-preview video behavior.

#### F-1-10 — The free-export claim is not registered

- **Quote/location:** License dialog: “exporting your plan is always free.” README: “Exporting is never paywalled.” Terms: “Core safety behavior and exports remain free.”
- **Why this matters:** This pricing boundary is distinct from “exports a CSV” and from the 750-file scan limit.
- **Concrete fix:** Register the free-export claim and test CSV plus JSON export with no license token at the 750-file boundary.

#### F-1-11 — The no-setup claim is not registered

- **Quote/location:** README: “No server, account, or API key is required for the free experience.”
- **Why this matters:** This is a visitor-relevant setup promise with no claim entry.
- **Concrete fix:** Add a fresh-context claim test that starts a normal folder review with empty cookies and storage and no request to an account or key service.

#### F-1-12 — Detailed storage-control claims are not registered

- **Quote/location:** Privacy: “A license token stays in localStorage if you provide one.” and “Choose New scan to clear the saved workspace.”
- **Why this matters:** The existing local-only claim confirms request origins, not these storage locations or deletion behavior.
- **Concrete fix:** Register and test token storage/removal behavior and confirm that New scan removes the real IndexedDB workspace after confirmation.

#### F-1-13 — Export-content claims are not registered or fully checked

- **Quote/location:** Privacy: “CSV manifests and JSON workspace backups download locally. They can contain file paths and hashes”.
- **Why this matters:** The backup claim checks restoration, but neither registered claim confirms the stated sensitive fields in both downloads.
- **Concrete fix:** Expand the CSV and backup claims and parse both downloads to confirm local delivery and their documented path/hash fields.

#### F-1-14 — The no-tracking and no-third-party-runtime claim is not registered

- **Quote/location:** Privacy: “The app includes no ads, analytics, tracking pixels, third-party fonts, or runtime scripts.”
- **Why this matters:** The current request test supports this statement during one demo flow, but the sentence has no matching claim entry and does not inspect script/font origins or tracking storage.
- **Concrete fix:** Add a privacy claim that inventories requests and loaded script/font resources across home, demo, and legal routes and checks that no tracking cookies or known tracking storage keys appear.

#### F-1-15 — Merchant and refund behavior is not registered

- **Quote/location:** Landing dialog and legal pages: “Sociobot/Dodo is the merchant of record.” and “A refund revokes the license.”
- **Why this matters:** These are purchase and entitlement statements a buyer can rely on, but no claim test covers them.
- **Concrete fix:** Add billing contract tests against recorded checkout, refund, and verification fixtures, or remove claims that the product cannot confirm.

### Minor

#### F-1-16 — Page navigation does not focus the new heading

- **Quote/location:** Landing → “Try it with sample data”; demo → “Start for real”; browser Back.
- **Check:** The URLs, titles, deep links, and Back behavior are correct. After each full navigation, `document.activeElement` is `BODY`; the demo `<h1>` has `tabindex="-1"` but is not focused.
- **Why this matters:** Keyboard and screen-reader users do not receive the required route-change focus cue.
- **Concrete fix:** On initial route rendering, focus the page `<h1>` when navigation came from an in-product route and announce its text in the polite live region. Add forward and Back assertions.

#### F-1-17 — The same export is named four different ways

- **Quote/location:** “move plan,” “review plan,” “CSV move manifest,” and “move-to-review-folder manifest” across the landing page and README.
- **Why this matters:** A first-time visitor must infer that all four phrases mean the same downloaded CSV.
- **Concrete fix:** Use “move plan” everywhere. Example: “Download a CSV move plan for a separate review folder.”

#### F-1-18 — The hero eyebrow uses specialist wording

- **Quote/location:** “A local, reversible photo cull”.
- **Why this matters:** “Cull” and “local” as a storage description require interpretation before the clearer headline.
- **Concrete fix:** “Review duplicate photos on this device.”

#### F-1-19 — The image caption uses a metaphor for product behavior

- **Quote/location:** “The red thread is only a review plan.”
- **Why this matters:** The sentence depends on the illustration rather than naming what the software does.
- **Concrete fix:** “The app creates a move plan and does not move photos.”

#### F-1-20 — A section label is a mood phrase

- **Quote/location:** “The cautious path”.
- **Why this matters:** It does not name the section when headings are read out of context.
- **Concrete fix:** “How it works”.

#### F-1-21 — The process heading does not name the task

- **Quote/location:** “Evidence, then judgment, then a plan.”
- **Why this matters:** It could describe many products and makes the reader interpret a slogan.
- **Concrete fix:** “Review duplicate and burst photos in three steps.”

#### F-1-22 — The pricing eyebrow is vague

- **Quote/location:** “For the big archive”.
- **Why this matters:** “Big” hides the exact threshold already known by the product.
- **Concrete fix:** “For folders over 750 files”.

#### F-1-23 — The pricing sentence contains an untestable slogan

- **Quote/location:** “stays useful every cleanup season.”
- **Why this matters:** It adds no concrete entitlement and is not in the claims registry.
- **Concrete fix:** “A one-time US$19 pass removes the 750-file scan limit.”

#### F-1-24 — The Archive pass navigation button does not name its action

- **Quote/location:** Header button: “Archive pass”.
- **Why this matters:** It opens a dialog but reads like a label.
- **Concrete fix:** “View Archive pass”.

#### F-1-25 — The README opens with jargon and a marketing adjective

- **Quote/location:** “Photo Cull Review is a cautious, local-first review desk for households with crowded photo archives.”
- **Why this matters:** “cautious,” “local-first,” and “review desk” delay the concrete job.
- **Concrete fix:** “Photo Cull Review helps households compare duplicate and burst photos before moving any files.”

#### F-1-26 — A README sentence exceeds 22 words

- **Quote/location:** “It indexes a folder in the browser, finds byte-identical media and likely burst photos, explains each group, saves human keep/review decisions, and exports a move-to-review-folder manifest.” — 26 words.
- **Why this matters:** The sentence combines five outcomes and introduces three technical terms.
- **Concrete fix:** “It finds exact copies and likely bursts in a folder. You review each group and export a move plan.”

#### F-1-27 — The README uses unexplained image-comparison jargon

- **Quote/location:** “Uses a small visual difference hash plus embedded JPEG camera capture time to suggest burst candidates.”
- **Why this matters:** “visual difference hash” and “embedded JPEG camera capture time” are implementation terms in the user-facing feature list.
- **Concrete fix:** “Compares compact visual fingerprints and JPEG capture times to suggest photos taken in one burst.”

#### F-1-28 — The README uses a storage implementation name before the user benefit

- **Quote/location:** “Stores thumbnails, hashes, candidate groups, and decisions in IndexedDB so the review survives refreshes and works offline.”
- **Why this matters:** Most visitors do not need the database name to understand persistence.
- **Concrete fix:** “Saves thumbnails, file details, groups, and decisions in your browser. Your review survives refreshes and remains available offline.”

#### F-1-29 — A README pricing sentence exceeds 22 words and uses “useful” as promotion

- **Quote/location:** “Offers a useful free tier for folders up to 750 supported files; a one-time US$19 Archive pass lets a licensed user scan larger folders.” — 24 words.
- **Why this matters:** The adjective adds no information and the sentence combines two pricing rules.
- **Concrete fix:** “Folders with up to 750 supported files are free. A one-time US$19 Archive pass scans larger folders.”

#### F-1-30 — The README uses unexplained video jargon

- **Quote/location:** “Images get local previews; videos participate in exact matching without preview decoding.”
- **Why this matters:** “preview decoding” describes implementation rather than the visible result.
- **Concrete fix:** “Images show previews. Videos are checked only for exact copies and do not show previews.”

#### F-1-31 — The README privacy summary uses protocol jargon

- **Quote/location:** “Free review sends no cross-origin requests.”
- **Why this matters:** “cross-origin” is precise for developers but not plain language for households.
- **Concrete fix:** “Free review contacts no other website or service.”

## 1. Cold first screen

Fresh Chromium contexts were used with no saved site state.

| View | What does it do? | For whom? | What should I click first? | Result |
| --- | --- | --- | --- | --- |
| 390 × 844 | Compares duplicate photos and likely bursts before producing a move plan. | Households with large or crowded photo archives. | “Try it with sample data”; the adjacent line says it opens a four-file review. | Pass; headline, audience sentence, action, outcome, and all three facts end by 816 px. |
| 1440 × 900 | Same answer. | Same answer. | Same action. | Pass; all required first-screen content ends by 866 px. |

The first screen has one `<h1>`, one `<main>`, `lang="en"`, no horizontal overflow, no console error, and no serious or critical axe result.

## 2. Copy audit

Counts treat hyphenated terms, URLs, prices, and file formats as one word. Code blocks are commands rather than sentences. “Flag” points to the corresponding finding above.

### Landing page

| Text | Words | Result |
| --- | ---: | --- |
| Photo Cull Review | 3 | Pass — product wordmark |
| Demo | 1 | Pass — navigation link |
| Archive pass | 2 | Flag F-1-24 when used as the header button |
| How / How it works | 1 / 3 | Pass — responsive navigation label |
| Privacy | 1 | Pass — navigation link |
| A local, reversible photo cull | 5 | Flag F-1-18 |
| Clean up duplicate photos. | 4 | Pass |
| Before anything moves. | 3 | Pass |
| For households with large or crowded photo archives, compare exact copies and likely bursts before exporting a move plan. | 19 | Pass |
| Try it with sample data | 5 | Pass |
| Opens a four-file sample review immediately. | 6 | Claim coverage flag F-1-4 |
| Choose your photo folder | 4 | Pass |
| JPEG, PNG, WebP, GIF, BMP, MP4, MOV, M4V, WebM | 9 | Claim coverage flag F-1-9 |
| Photos stay on this device | 5 | Pass — `local-only` |
| Works offline after the first visit | 6 | Claim check flag F-1-5 |
| Free for up to 750 files | 6 | Pass — `free-limit` |
| Every frame stays where it is. | 6 | Pass — `csv-export` safety boundary |
| The red thread is only a review plan. | 8 | Flag F-1-19 |
| The cautious path | 3 | Flag F-1-20 |
| Evidence, then judgment, then a plan. | 6 | Flag F-1-21 |
| Index locally | 2 | Pass |
| Complete SHA-256 hashes find exact files. | 6 | Claim check flag F-1-1 |
| A small visual hash suggests nearby burst frames. | 8 | Pass — `similar-suggestions` |
| Review every group | 3 | Pass |
| See why files were grouped. | 5 | Claim coverage flag F-1-7 |
| Mark each one keep or move to review; suggestions never become facts. | 12 | Pass |
| Export, don’t delete | 3 | Pass |
| Download a CSV move manifest for a separate review folder. | 10 | Terminology flag F-1-17; claim check F-1-3 |
| Your source archive remains untouched. | 5 | Pass — `csv-export` |
| For the big archive | 4 | Flag F-1-22 |
| Archive pass | 2 | Pass as a section heading |
| Free for folders up to 750 supported files. | 8 | Pass — `free-limit` |
| A one-time US$19 pass unlocks unlimited scans and stays useful every cleanup season. | 13 | Claim check F-1-6; copy flag F-1-23 |
| US$19 one time | 3 | Claim check F-1-6 |
| Buy archive pass | 3 | Pass |
| Restore a license | 3 | Pass |
| Local photo review before anything moves. | 6 | Pass |
| Original generated archive illustration · Built by Param Factory · v1.0.5 | 9 | Pass |
| Close license dialog | 3 | Pass |
| One-time unlock | 2 | Pass |
| Scan folders of any size for US$19 once. | 8 | Claim check F-1-6 |
| The free desk handles up to 750 files, and exporting your plan is always free. | 14 | Claim coverage flag F-1-10 |
| Have a license? | 3 | Pass |
| Paste it here. | 3 | Pass |
| Verify and restore | 3 | Pass |
| Sociobot/Dodo is the merchant of record. | 6 | Claim coverage flag F-1-15 |
| Refunds are handled there and revoke the license. | 8 | Claim coverage flag F-1-15 |
| We could not recheck this Archive pass. | 7 | Pass |
| Its last successful check remains active. | 6 | Pass |
| We could not verify this license. | 6 | Pass |
| Free limits remain active. | 4 | Pass |
| Check your connection and try again. | 6 | Pass |
| This license is no longer active. | 6 | Pass |
| Free limits are in use. | 5 | Pass |
| That license is no longer active for this product. | 9 | Pass |
| Check the token and try again. | 6 | Pass |
| Terms | 1 | Pass — legal link |

No landing sentence exceeds 22 words. No banned marketing word appears. Terminology is otherwise consistent for exact copies, likely bursts, candidate groups, workspace backups, and the Archive pass.

### README

| Text | Words | Result |
| --- | ---: | --- |
| Photo Cull Review | 3 | Pass — title |
| Photo Cull Review is a cautious, local-first review desk for households with crowded photo archives. | 15 | Flag F-1-25 |
| It indexes a folder in the browser, finds byte-identical media and likely burst photos, explains each group, saves human keep/review decisions, and exports a move-to-review-folder manifest. | 26 | Flag F-1-26; terminology flag F-1-17 |
| It never uploads, moves, or deletes originals. | 7 | Pass — `local-only` and `csv-export` |
| Live product: | 2 | Pass |
| Try the isolated sample at https://photo-cull-review.sociobot.in/?demo=1. | 6 | Pass |
| It opens a four-file family archive without reading or writing your real workspace. | 13 | Claim check flag F-1-4 |
| What it does | 3 | Pass |
| Streams complete files through local SHA-256 hashing to find exact copies without loading a large video whole into memory. | 19 | Pass — technical detail tied to `exact-duplicates` and `video-streaming` |
| Uses a small visual difference hash plus embedded JPEG camera capture time to suggest burst candidates. | 16 | Flag F-1-27 |
| It never guesses capture time from file modification dates. | 9 | Claim coverage flag F-1-8 |
| Stores thumbnails, hashes, candidate groups, and decisions in IndexedDB so the review survives refreshes and works offline. | 17 | Flag F-1-28 |
| Exports a CSV move plan and a restorable JSON workspace backup. | 11 | Pass — `csv-export` and `workspace-backup` |
| Exporting is never paywalled. | 4 | Claim coverage flag F-1-10 |
| Offers a useful free tier for folders up to 750 supported files; a one-time US$19 Archive pass lets a licensed user scan larger folders. | 24 | Flag F-1-29; claim check F-1-6 |
| Supported inputs are JPEG, PNG, WebP, GIF, BMP, MP4, MOV, M4V, and WebM. | 13 | Claim coverage flag F-1-9 |
| Images get local previews; videos participate in exact matching without preview decoding. | 12 | Flag F-1-30; claim coverage F-1-9 |
| Run locally | 2 | Pass |
| Requirements: Node.js 20 or newer. | 5 | Pass — developer requirement |
| Open http://localhost:5173. | 2 | Pass |
| No server, account, or API key is required for the free experience. | 12 | Claim coverage flag F-1-11 |
| Test and build | 3 | Pass |
| The static deploy root is dist/, with dist/index.html at its root. | 11 | Pass — deployment context |
| For a production-like local check, run npm run preview after building. | 11 | Pass — deployment context |
| The billing URL defaults to the production Sociobot API. | 9 | Pass — configuration context |
| Factory staging may set VITE_BILLING_BASE=https://pilot-api.sociobot.in/api/v1; VITE_PRODUCT_SLUG can override the default slug. | 11 | Pass — configuration context |
| No provider credentials belong in this repository. | 7 | Pass — repository instruction |
| Privacy and safety model | 4 | Pass |
| All photo data stays in browser storage. | 7 | Pass — `local-only` |
| Free review sends no cross-origin requests. | 6 | Flag F-1-31; covered by `local-only` |
| With a supplied license token, verification is the app’s only cross-origin runtime request. | 13 | Pass — `license-verification-request` |
| A manifest is an instruction sheet, not an executable deletion script. | 11 | Pass — defines the term |
| Users should review it and keep an independent backup before moving media. | 12 | Pass — safety instruction |
| See the product brief, visual system, privacy policy, and terms. | 10 | Pass |
| Deploy | 1 | Pass |
| Upload the contents of dist/ to the static host with SPA fallback to index.html. | 14 | Pass — deployment context |
| Preserve /privacy/ and /terms/ directory indexes and serve sw.js without long-lived immutable caching so PWA updates can be detected. | 19 | Pass — deployment context |
| Licensed under the MIT License. | 5 | Pass |

The README has two sentences above 22 words: 26 words at F-1-26 and 24 words at F-1-29.

## 3. Demo and sandbox

- One click from the cold first screen opens `/?demo=1`.
- The first demo screen already shows “Your review desk,” “Exact copies,” “Likely burst,” realistic filenames, paths, dates, file sizes, and image previews.
- The persistent banner says “Demo — sample data, separate from your workspace” and includes Reset demo and Start for real.
- A decision changes state. Reset returns that decision to undecided after the IndexedDB operation completes.
- Start for real clears the demo record and returns to `/`.
- Code uses `photo-cull-review-demo` for demo data and `photo-cull-review` for normal data.
- A fresh-context live request log contained only `https://photo-cull-review.sociobot.in` during landing, demo decisions, Reset, and exit.
- The product behavior passes; the automated coverage gap is F-1-4.

## 4. Claims

Every command was run exactly as listed after `npm ci`.

| Claim | Declared command result | Coverage review |
| --- | --- | --- |
| `exact-duplicates` | Pass — 2 browser projects | Blocking gap F-1-1 |
| `similar-suggestions` | Pass — 1 unit check | Blocking gap F-1-2 |
| `csv-export` | Pass — 2 browser projects | Blocking gap F-1-3 |
| `workspace-persistence` | Pass — 2 browser projects | Adequate |
| `offline-reload` | Pass — 2 browser projects | Blocking gap F-1-5 |
| `local-only` | Pass — 2 browser projects | Adequate |
| `demo-sandbox` | Pass — 2 browser projects | Blocking gap F-1-4 |
| `free-limit` | Pass — 1 unit check | Adequate; tests 750 and 751 |
| `workspace-backup` | Pass — 2 browser projects | Adequate |
| `archive-pass-unlimited` | Pass — 1 unit check | Blocking gap F-1-6 |
| `video-streaming` | Pass — 1 unit check | Adequate |
| `license-verification-request` | Pass — 2 browser projects | Adequate |

No declared command failed. The blocking results concern incomplete assertions or a mismatch with the declared sandbox. Unlisted claim findings are F-1-7 through F-1-15.

## 5. Offline and privacy behavior

- A fresh live demo context loaded under service-worker control, used `photo-cull-shell-v7`, then reloaded offline with the saved review desk and offline status visible.
- Demo interactions issued only same-origin requests.
- The licensed request test confirms one request to the named Sociobot verification endpoint and no other external runtime request.
- Valid routes produced no console errors. The expected 404 document request reports HTTP 404 and serves the designed not-found page.
- CSP, HSTS, `nosniff`, referrer policy, Permissions Policy, COOP, CORP, and frame restrictions are present as response headers.

## 6. Earlier findings checked again

There are no earlier `.factory/review-*.md` or `.factory/polish-*.md` files. The six repair groups in the earlier handoff were checked live and in code.

| Earlier repair | Live confirmation | Code/test confirmation | Status |
| --- | --- | --- | --- |
| Paid access requires a successful verdict | An unavailable fresh license showed free limits, stored no verdict, rejected 751 files, and did not start scanning. | `license.ts` requires a positive timestamped verdict; `@regression:unverified-license` passes. | Fixed |
| License failures stay visible and quiet | The connection notice, free-limit status, purchase action, and restore action were visible. | Cached-valid and invalid-return checks pass. | Fixed |
| 390 px header interaction baseline | Header targets measured at least 44 px high with at least 8 px separation; first-screen facts ended at 816 px. | `@regression:mobile-header` passes. | Fixed |
| Text at 200% reflows | Home, demo, Privacy, Terms, and 404 each had `clientWidth = scrollWidth = 390`. | `@regression:text-reflow` passes. | Fixed |
| Every public route has a social card | Titles, descriptions, canonicals, OG fields, Twitter fields, and the local social image are present. | `@regression:route-social-metadata` passes. | Fixed |
| PWA release is cache-safe | The active worker used `photo-cull-shell-v7`; offline reload worked; footer shows `v1.0.5`. | Versioned assets and update notification checks pass. | Fixed |

None of these earlier items regressed.

## 7. Structure, links, identity, and accessibility

- Home title: “Photo Cull Review — plan duplicate photo moves”. Demo, Privacy, Terms, and 404 each use route-specific titles.
- Every checked route has one `<h1>`, one `<main>`, a description, canonical, OG/Twitter card, favicon, consistent header, and consistent footer.
- The sitemap lists home, demo, Privacy, and Terms. `robots.txt` points to it.
- A missing path returns HTTP 404 and the designed archive-style 404 page with a home action.
- Same-origin links return 200, in-page targets exist, `sociobot.in` returns 200, and the checkout link returns a valid redirect.
- Browser Back restores home and demo URLs and state. Route focus fails F-1-16.
- Axe found no serious or critical issue on home, populated demo, Privacy, Terms, or 404. The full browser suite also checks keyboard controls, dialog focus, reduced motion, 200% text, and mobile targets.
- The warm-paper darkroom palette, editorial serif, mounted-photo shapes, red review thread, original archive illustration, and light-table workspace are distinct to this product. It does not resemble a generic centered software template.

## 8. Missed leverage

No additional feature finding is warranted. The brief’s useful loop is present: folder import, exact and cautious similar grouping, human decisions, CSV export, and JSON backup/restore. Sync would conflict with the local-only promise. A model-assisted feature is not an obvious fit because exact hashes and explicit human judgment are the product’s safety basis.

## Verification summary

- `npm ci` — pass, 60 packages, 0 vulnerabilities
- All 12 exact claim commands — exit 0
- `npm test` — pass, 11/11
- `npm run build` — pass; `dist/` produced; application JavaScript 13.87 KB gzip
- `npm run test:e2e` — pass, 36 passed and 2 intentional project skips
- Live URL verifier — pass; title/lang/H1/main/alts/buttons; 0 console errors
- Live Playwright/axe review — no serious or critical violations on checked routes
- `git diff --check` — pass before review files were written

## What would make this perfect

Confirm every registered claim with assertions that match the complete wording and declared sandbox. Register or remove every remaining claim-like sentence. Replace the flagged mood, metaphor, jargon, and terminology variants with the proposed copy. Move focus to the new `<h1>` on forward and Back navigation. Then rerun this entire review from a fresh context and require zero findings.
