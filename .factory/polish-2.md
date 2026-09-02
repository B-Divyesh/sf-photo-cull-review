# Polish 2 — zero-finding closure

Reviewed base: `6f2841c2b48280b4d3563485750aac9d1807a91b`  
Repair: `c3f3a7069ba0f86e29ccdc733260c6d39c509f8d` · version `1.0.8`

Shared live check: <https://photo-cull-review.sociobot.in/?demo=1>. Cold live
390 × 844 evidence is `polish-2-artifacts/live-demo-mobile-390x844.png` and
`polish-2-artifacts/live-check.json`; all three required elements end at or
above 844 px. Route-focus evidence is `polish-2-artifacts/live-route-focus.json`.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept full exported SHA-256-to-Node-digest comparison. | `@claim:exact-duplicates` |
| F-1-2 | Kept the exact 30 s / 31 s suggestion boundary test. | `@claim:similar-suggestions` |
| F-1-3 | Kept parsed CSV headers, rows, reasons, types, paths, and hashes. | `@claim:csv-export` |
| F-1-4 | Kept seeded-real-work demo isolation, four-file sample, reset, and exit checks. | `@claim:demo-sandbox` |
| F-1-5 | Kept populated demo offline reload in a dedicated browser context. | `@claim:offline-reload` |
| F-1-6 | Kept recorded license activation, US$12 checkout contract, and 751-file UI scan. | `@claim:archive-pass-unlimited` |
| F-1-7 | Kept exact and likely-burst explanations registered and exercised. | `@claim:group-explanations` |
| F-1-8 | Kept embedded capture-time, not modification-time, coverage. | `@claim:capture-time` |
| F-1-9 | Kept all nine formats and local image-preview coverage. | `@claim:supported-formats`; `@claim:image-previews` |
| F-1-10 | Kept unlicensed CSV and JSON exports available. | `@claim:free-export` |
| F-1-11 | Kept fresh-context, no-account/no-key review coverage. | `@claim:no-setup` |
| F-1-12 | Renamed the clear action consistently and kept token/workspace-clear coverage. | `@claim:storage-controls` |
| F-1-13 | Kept sensitive path/hash fields parsed from both downloads. | `@claim:csv-export`; `@claim:free-export` |
| F-1-14 | Kept request/resource/storage privacy inventory across product and legal routes. | `@claim:runtime-privacy` |
| F-1-15 | Kept recorded revoked-license and merchant/checkout contract coverage. | `@claim:merchant-refund` |
| F-1-16 | Extended route focus beyond app routes to legal and error shells. | `@regression:route-focus`; live route-focus JSON |
| F-1-17 | Move-plan terminology remains consistent. | full browser suite; copy audit |
| F-1-18 | Direct device-review eyebrow remains in place. | cold live home check |
| F-1-19 | Direct move-plan/no-move caption remains in place. | `@claim:csv-export` |
| F-1-20 | “How it works” remains the section label. | copy audit |
| F-1-21 | Three-step heading remains task-specific. | copy audit |
| F-1-22 | Pricing continues to name the 750-file threshold. | `@claim:archive-pass-unlimited` |
| F-1-23 | One-time US$12 entitlement remains precise. | live checkout contract |
| F-1-24 | Archive-pass header action still names its result. | mobile-header regression |
| F-1-25 | README retains the plain household-task opening. | copy audit |
| F-1-26 | README overview remains split into short sentences. | copy audit |
| F-1-27 | README comparison wording is plain and concrete. | copy audit |
| F-1-28 | Browser-storage benefit still precedes implementation detail. | copy audit |
| F-1-29 | Free and paid pricing remain separate, factual sentences. | copy audit |
| F-1-30 | Video behavior remains described as a user-visible result. | `@claim:video-streaming` |
| F-1-31 | README retains “contacts no other website or service.” | `@claim:local-only` |
| F-2-1 | Moved the active demo review before tools and progress; mobile-specific compact light-table layout puts group, real preview/filename, and Keep action in the first viewport. | `@regression:demo-first-viewport`; `live-demo-mobile-390x844.png`; live demo URL |
| F-2-2 | Replaced “Opening the archive desk” with “Opening Photo Cull Review.” | unit/build copy audit |
| F-2-3 | Replaced “Index locally” with “Find exact copies and likely bursts.” | copy audit; live home |
| F-2-4 | Replaced exposed hash jargon with “The app checks every byte to find exact copies.” | copy audit; `@claim:exact-duplicates` |
| F-2-5 | Replaced visual-hash jargon with photo-and-capture-time wording. | copy audit; `@claim:similar-suggestions` |
| F-2-6 | Replaced “free desk” with “free product” in the license dialog. | full browser suite; live home |
| F-2-7 | Rewrote README exact-match explanation in two concrete sentences. | copy audit |
| F-2-8 | Rewrote README burst explanation around appearance and camera-recorded time. | copy audit |
| F-2-9 | Renamed the demo h1 to “Review duplicate and burst photos.” | `@regression:demo-first-viewport`; live demo |
| F-2-10 | Renamed “New scan” to “Start a new scan” in workspace, Privacy, claim registry, and tests. | `@claim:storage-controls`; live Privacy |
| F-2-11 | Added shared static-shell route-focus script and live region to Privacy, Terms, and 404; all in-product navigation writes the focus marker. | `@regression:route-focus`; `live-route-focus.json`; live Privacy/Terms |

## Verification

- Clean clone at `/tmp/photo-cull-review-polish2.BeVXaw/repo`: `npm ci`, all 21
  commands in `claims.json`, `npm test` (12/12), `npm run test:e2e` (56/56),
  and `npm run build` all passed.
- Local URL verifier: `polish-2-artifacts/local-verify/verify.json` reports no
  console errors, one h1, `lang=en`, main, and complete labels.
- Live URL verifier: `polish-2-artifacts/live-verify/verify.json` reports the
  same basics with no console errors. `node .factory/live-qa.mjs` passed live
  metadata, routes, 404, privacy, PWA offline, text reflow, Axe serious/critical,
  checkout contract, headers, and mobile layout checks.
- Lighthouse 13.4.1 mobile live: 100 performance, 100 accessibility, 100 best
  practices, 100 SEO; LCP 1.5 s and CLS 0. See
  `polish-2-artifacts/lighthouse-live.json`.
