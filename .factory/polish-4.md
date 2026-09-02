# Polish round 4 — Photo Cull Review

**Repair commits:** `54802b8` and `efef8df`  
**Deployed:** `fc9fbc80-0d8e-4ae1-81b5-5dd404f5c181` on 2 September 2026  
**Live check:** <https://photo-cull-review.sociobot.in/?demo=1>

All review reports and previous polish reports were re-read. This table maps
every unique finding to its final implementation and evidence. The clean-clone
claim run used `/tmp/photo-cull-review-polish4.Szlnrj/repo`; all 21 registry
commands passed independently. The live evidence is in
`.factory/polish-4-artifacts/live/qa.json` and its screenshots.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | CSV exports expose the complete SHA-256 digest for each selected source. | Clean-clone `@claim:exact-duplicates`; `@claim:csv-export` |
| F-1-2 | Similarity accepts exactly 30 seconds and rejects 31 seconds. | Clean-clone `@claim:similar-suggestions` |
| F-1-3 | CSV tests parse all six headers, quoted rows, types, reasons, paths, and hashes. | Clean-clone `@claim:csv-export` |
| F-1-4 | Demo uses `photo-cull-review-demo`, confirms four files/two groups, resets, exits, and preserves seeded real work. | Clean-clone `@claim:demo-sandbox`; live `qa.json` `demoFlow` |
| F-1-5 | Populated demo state, preview assets, banner, and decision reload offline in a dedicated context. | Clean-clone `@claim:offline-reload`; live `qa.json` `pwa` |
| F-1-6 | A recorded valid verdict activates the US$12 one-time pass before the browser scans 751 files. | Clean-clone `@claim:archive-pass-above-limit`; live checkout contract in `qa.json` |
| F-1-7 | Exact-copy and likely-burst evidence are shown before a decision. | Clean-clone `@claim:group-explanations` |
| F-1-8 | Burst grouping reads embedded JPEG capture time, never modification time. | Clean-clone `@claim:capture-time` |
| F-1-9 | The full documented image/video format list and local image previews are covered. | Clean-clone `@claim:supported-formats`; `@claim:image-previews` |
| F-1-10 | CSV plans and JSON backups remain usable without a pass. | Clean-clone `@claim:free-export` |
| F-1-11 | A fresh browser starts a review without a server, account, or key. | Clean-clone `@claim:no-setup` |
| F-1-12 | License storage and Start a new scan clearing are observable and covered. | Clean-clone `@claim:storage-controls` |
| F-1-13 | Both export types are parsed for the documented path and full-hash fields. | Clean-clone `@claim:csv-export`; `@claim:free-export` |
| F-1-14 | Runtime request, resource, and tracking-storage inventory covers product and legal routes. | Clean-clone `@claim:runtime-privacy`; live `qa.json` origins |
| F-1-15 | Recorded refunded-license verification and the hosted checkout merchant contract are covered. | Clean-clone `@claim:merchant-refund`; live `qa.json` `checkoutContract` |
| F-1-16 | In-product and static routes focus the incoming h1 and send a polite route announcement. | `@regression:route-focus`; live `qa.json` `routeFocus` |
| F-1-17 | Visitor copy consistently calls the CSV a move plan. | `.factory/copy-audit.md`; full browser suite |
| F-1-18 | The eyebrow names review on this device in plain language. | `.factory/copy-audit.md`; live `/` |
| F-1-19 | The art caption now states the plan/no-move boundary directly. | `.factory/copy-audit.md`; clean-clone `@claim:csv-export` |
| F-1-20 | The process section is named How it works. | `.factory/copy-audit.md`; live `/` |
| F-1-21 | The process heading names duplicate and burst review. | `.factory/copy-audit.md`; live `/` |
| F-1-22 | Pricing names the 750-file threshold. | `.factory/copy-audit.md`; clean-clone `@claim:free-limit` |
| F-1-23 | Purchase wording states the bounded, one-time US$12 entitlement. | Clean-clone `@claim:archive-pass-above-limit`; live checkout contract |
| F-1-24 | Desktop says View Archive pass and the narrow label says View pass. | `@regression:mobile-header`; live `qa.json` `passVisibleText` |
| F-1-25 | README opens with the household photo-review job. | `.factory/copy-audit.md` |
| F-1-26 | README overview is split into short sentences. | `.factory/copy-audit.md` |
| F-1-27 | README describes visual/time comparison in user language. | `.factory/copy-audit.md` |
| F-1-28 | README leads with browser persistence before implementation detail. | `.factory/copy-audit.md` |
| F-1-29 | README separates free and paid pricing into factual sentences. | `.factory/copy-audit.md` |
| F-1-30 | README states the visible video behavior without decoding jargon. | Clean-clone `@claim:video-streaming`; `.factory/copy-audit.md` |
| F-1-31 | README says free review contacts no other website or service. | Clean-clone `@claim:local-only`; `.factory/copy-audit.md` |
| F-2-1 | Demo review precedes tools; responsive mounted previews place a group, filename, Keep, and Move control in the first viewport. | `@regression:demo-first-viewport`; live `demo-mobile-390x844.png`, `demo-desktop-1440x900.png`, `qa.json` |
| F-2-2 | Loading copy says Opening Photo Cull Review. | `.factory/copy-audit.md`; full browser suite |
| F-2-3 | The first process step says Find exact copies and likely bursts. | `.factory/copy-audit.md`; live `/` |
| F-2-4 | Exact matching is explained as checking every byte. | Clean-clone `@claim:exact-duplicates`; `.factory/copy-audit.md` |
| F-2-5 | Likely bursts are explained using photos and capture times. | Clean-clone `@claim:similar-suggestions`; `.factory/copy-audit.md` |
| F-2-6 | The license dialog calls the free product a product, not a desk. | Full browser suite; live `qa.json` `review3Copy` |
| F-2-7 | README uses concrete exact-copy language. | `.factory/copy-audit.md` |
| F-2-8 | README uses plain photo and camera-time language. | `.factory/copy-audit.md` |
| F-2-9 | Demo h1 names duplicate and burst photo review. | `@regression:demo-first-viewport`; live demo URL |
| F-2-10 | The clear-workspace action says Start a new scan everywhere. | Clean-clone `@claim:storage-controls`; live Privacy route |
| F-2-11 | Privacy, Terms, 404, forward navigation, and Back focus and announce their h1. | `@regression:route-focus`; live `qa.json` routes |
| F-3-1 | Unbounded paid words are removed; the pass is explicitly above the 750-file limit. | Clean-clone `@claim:archive-pass-above-limit`; live checkout contract |
| F-3-2 | The sample outcome says in this browser rather than making a speed promise. | `.factory/copy-audit.md`; live `/` |
| F-3-3 | Demo summary says files are ready to review. | Clean-clone `@claim:demo-sandbox`; live `qa.json` summary |
| F-3-4 | Scan heading names checking photos for copies and likely bursts. | `.factory/copy-audit.md`; full browser suite |
| F-3-5 | Scan assurance says file checks and small previews stay on this device. | `.factory/copy-audit.md`; live scan QA |
| F-3-6 | 404 action says Return to photo review. | Live `qa.json` `review3Copy.notFoundAction` |
| F-3-7 | Every route references the decoded 180×180 Apple touch icon. | `@regression:route-social-metadata`; live `qa.json` route metadata |
| F-3-8 | Both purchase controls say at checkout and expose the external cue. | Clean-clone `@claim:archive-pass-above-limit`; live `qa.json` `review3Copy` |
| F-8-1 | The offline test closes only its own browser context; the shared preview/browser lifecycle remains usable. | `@regression:preview-lifecycle`; full 58-test browser suite |
| F-4-1 | Route messages now use a visually hidden polite region; visible action toasts remain separate. The mobile regression follows the real one-click route and immediately checks the filename, Keep, and Move centers with `elementFromPoint`. | `@regression:demo-first-viewport`; live `demo-mobile-390x844.png`; live `qa.json` shows focus `true`, announcement text, and all three pointer checks `true` |

## Final verification

- Clean clone: `npm ci`, then every one of the 21 commands in
  `.factory/claims.json` passed independently.
- Local: `npm test` passed 12/12; `npm run build` produced `dist/`; the full
  Playwright suite passed 58 tests with the intended mobile-suite skips.
- Live cold check: Home, demo, Privacy, Terms, and a deliberate missing route
  have the expected titles, one h1, one main landmark, no horizontal overflow,
  and zero serious/critical Axe findings. The missing route returns HTTP 404.
- Live PWA: a controlling `photo-cull-shell-v12` precaches 21 requests;
  populated demo data remains available after offline reload.
- Live Lighthouse mobile: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; LCP 1502 ms, CLS 0, TBT 0.

No review finding remains open.
