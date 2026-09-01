# Polish 1 — adversarial review closure

Base reviewed: `df345aa669f9344bc1ac16292cff4e7a0ba24626`  
Repair version: `1.0.6`

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | CSV claim now parses every exported row and compares each full exported SHA-256 with Node’s digest of both fixtures. | `@claim:exact-duplicates`; `@claim:csv-export` |
| F-1-2 | Similarity test asserts inclusion at 30 seconds and exclusion at 31 seconds, plus cautious wording. | `@claim:similar-suggestions` |
| F-1-3 | CSV claim parses all six columns, quoted paths, group type, reason, row count, and source hashes. | `@claim:csv-export` |
| F-1-4 | Demo test seeds real work, confirms four sample files and both groups, resets sample data, exits, and confirms the real decision remains. | `@claim:demo-sandbox`; `/?demo=1` |
| F-1-5 | Offline test now starts in demo, makes a decision, waits for SW control, reloads offline, and checks sample previews, banner, groups, and decision. | `@claim:offline-reload` |
| F-1-6 | Browser test activates a recorded valid license response, follows checkout, checks the US$12 one-time order item, currency, subtotal, and total, then scans 751 files. | `@claim:archive-pass-unlimited` |
| F-1-7 | Added registered group-explanation claim and demo test for exact and cautious burst reasons. | `@claim:group-explanations` |
| F-1-8 | Added capture-time claim and test proving copied-file modification time is ignored. | `@claim:capture-time` |
| F-1-9 | Added supported-format claim with all documented MIME types and unsupported-file behavior; added image-preview claim. | `@claim:supported-formats`; `@claim:image-previews` |
| F-1-10 | Added free-export claim that downloads and parses CSV and JSON with no stored license. | `@claim:free-export` |
| F-1-11 | Added clean-context no-setup test for a normal fixture review and no account/key requests. | `@claim:no-setup` |
| F-1-12 | Added storage-controls claim covering stored license token and New scan persistence clearing. | `@claim:storage-controls` |
| F-1-13 | CSV and JSON tests parse documented path and complete hash fields. | `@claim:csv-export`; `@claim:free-export` |
| F-1-14 | Added runtime-privacy claim checking request/resource origins and tracking storage across home, demo, and legal pages. | `@claim:runtime-privacy` |
| F-1-15 | Added merchant/refund contract test using a recorded revoked verification response and hosted checkout URL. | `@claim:merchant-refund` |
| F-1-16 | In-product route navigation and Back now focus the incoming h1 and announce it through the status region. | `@regression:route-focus` |
| F-1-17 | Replaced visitor-facing “manifest” variants with “move plan” across UI, README, legal copy, tests, and audit. | `npm run test:e2e`; copy audit |
| F-1-18 | Replaced the hero eyebrow with “Review duplicate photos on this device.” | first-viewport regression; copy audit |
| F-1-19 | Replaced red-thread metaphor caption with a direct move-plan safety statement. | `@claim:csv-export`; copy audit |
| F-1-20 | Renamed the mood label to “How it works.” | copy audit |
| F-1-21 | Replaced the generic process heading with “Review duplicate and burst photos in three steps.” | copy audit |
| F-1-22 | Replaced vague pricing eyebrow with the 750-file threshold. | `@claim:archive-pass-unlimited`; copy audit |
| F-1-23 | Replaced the slogan with the tested one-time US$12 scan-limit entitlement. | `@claim:archive-pass-unlimited`; copy audit |
| F-1-24 | Renamed header control to “View Archive pass.” | `npm run test:e2e`; mobile-header regression |
| F-1-25 | Rewrote README opening in plain household language. | `.factory/copy-audit.md` |
| F-1-26 | Split the 26-word README overview into short task sentences. | `.factory/copy-audit.md` |
| F-1-27 | Replaced visual-hash implementation jargon in README with plain comparison language. | `.factory/copy-audit.md` |
| F-1-28 | Put the browser-storage benefit before implementation detail in README and privacy copy. | `.factory/copy-audit.md` |
| F-1-29 | Split free and paid README pricing into short factual sentences. | `.factory/copy-audit.md` |
| F-1-30 | Rewrote README video behavior as visible result rather than decoding jargon. | `@claim:video-streaming`; copy audit |
| F-1-31 | Replaced README protocol wording with “contacts no other website or service.” | `@claim:local-only`; copy audit |

## Evidence summary

- **Live recheck for every row:** <https://photo-cull-review.sociobot.in> cold-loaded after deployment; 390 px first-screen screenshot: [live-cold-mobile.png](repair-4-artifacts/live-cold-mobile.png). The live run verified titles, routes, demo isolation, offline cache, legal links, mobile reflow, and no valid-route console errors.
- `npm test` — 12 passed.
- `npm run build` — passed; `dist/` generated; app JS 14.07 KB gzip and CSS 5.15 KB gzip.
- `npm run test:e2e -- --reporter=line` — 52 passed, 2 project-specific skips before this repair; rerun evidence is recorded in the handoff.
- All 21 IDs in `.factory/claims.json` map to exactly one tagged test and are rerun from a fresh clone after the repair commit.
- Live URL recheck and deployment evidence are recorded in `.factory/handoff.md` after release.
