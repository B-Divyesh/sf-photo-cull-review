# Photo Cull Review — build handoff

Work order: `photo-cull-review-build-1`  
Completed: 2026-08-28  
Deploy type: static PWA, output `dist/`

## What was built

- A finished local-first photo review workflow: choose a folder, stream files through complete SHA-256 hashing, create local image thumbnails and 64-bit visual difference hashes, group exact copies and time-adjacent similar burst candidates, review every item, and export a CSV move-to-review-folder manifest.
- Clear evidence language separates byte identity from perceptual suggestions. No code path moves, renames, uploads, or deletes originals.
- Review state, thumbnails, hashes, group explanations, decision history, and progress persist in IndexedDB. Undo, JSON backup/restore, empty results, unsupported/read-error messaging, scan progress, and explicit reset are included.
- Keyboard paths: Tab/Enter/Space throughout, K to keep the first undecided item, R to mark it for review, S to skip a group, arrows to move between groups, visible focus, and no completion while candidates remain undecided.
- Offline PWA shell with a versioned service-worker cache, cache-first local assets, network-first billing calls, offline navigation fallback, install icons/manifest, update notification, and visible offline state.
- Responsive editorial UI verified at 390 px. The original generated “moonlit archive” scene is shipped in 37 KB mobile and 62 KB desktop WebP variants. Prompt, review, and provenance are in `.factory/design.md` and `assets/src/`.
- One-time Archive pass integration: hosted Sociobot checkout, return-token capture, local token storage, daily cached verification, optimistic offline behavior, invalid-license reconciliation, and paste-to-restore. Free folders support 750 files and core export/safety is never gated. Default price copy is US$19 one time.
- Static `/privacy/` and `/terms/` pages, MIT license, full README, hand-authored PWA icons, and no runtime CDNs, tracking, or analytics.

## Verification

Run from a clean checkout:

```sh
npm install
npm test
npm run build
npm run test:e2e
```

Results at handoff:

- `npm test`: 5/5 unit tests pass (streaming SHA-256, chunk boundaries, bit distance, exact grouping, cautious similar grouping).
- `npm run build`: passes; creates `dist/index.html` with JS 28,002 B, CSS 14,710 B, local font 56,976 B. The initial JS/CSS/font/hero are all within factory budgets.
- `npm run test:e2e`: 6/6 pass in Chromium desktop and 390×844 mobile. It covers axe checks on welcome and populated review states, real directory ingestion, exact-match review, manifest download, IndexedDB persistence after reload, and an explicit offline reopen.
- `npm audit --audit-level=high`: 0 vulnerabilities.
- `/opt/fleet/lib/verify-url.sh`: passes; title present, `lang=en`, one h1, main landmark present, no missing image alt, no unlabeled buttons, and no console/page errors. Recorded local load: 540 ms.
- Lighthouse 12.8.2 mobile against the production build: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.90 s, LCP 1.81 s, TBT 0 ms, CLS 0, Speed Index 0.90 s.
- Visual inspection completed at 1440×1000 and 390×844; content does not clip and touch controls remain usable.

Exact factory build command: `npm run build`  
Exact deploy directory: `dist/`

## Configuration and deployment notes

- Production billing defaults to `https://api.sociobot.in/api/v1` and slug `photo-cull-review`. Staging should set `VITE_BILLING_BASE=https://pilot-api.sociobot.in/api/v1`. `VITE_PRODUCT_SLUG` is available if registration supplies a different slug; no numeric or provider product ID is embedded.
- Serve `sw.js` with revalidation/no long-term immutable cache. Other immutable local assets can be cached long-term. Preserve directory indexes for `/privacy/` and `/terms/`; an SPA fallback to `index.html` is still recommended.
- The factory must register the paid product and confirm the final US$19 price/return URL before launch. No live purchase was made during this build.

## Known gaps and honest boundaries

- HEIC/RAW are not claimed because browser decoding support is inconsistent. JPEG, PNG, WebP, GIF, BMP, MP4, MOV, M4V, and WebM are accepted. A photo that cannot be previewed still participates in exact SHA-256 matching; videos are exact-match only and show a labeled placeholder.
- Burst grouping is intentionally conservative: visual hashes must be close and timestamps must be within 30 seconds. It may miss related frames whose copied files lost original timestamps; it is never presented as identity proof.
- Browser folder pickers provide relative paths but not persistent write authority. The CSV is a reviewable plan, not an executable mover. This is intentional to honor “never alter originals.”
- Large archives take time proportional to total bytes. Hashing is streamed to bound memory, but the tab must remain open during a scan. A future version could move hashing into workers for parallel throughput.

## Suggested next steps

1. Register the production and test billing products, verify hosted checkout return behavior, and confirm price copy.
2. Pilot with several 500+ asset household archives and track only opt-in qualitative outcomes externally; the app itself intentionally has no analytics.
3. Evaluate opt-in EXIF capture-time parsing and a Web Worker hash pool if pilot archives show copied timestamps or main-thread throughput are limiting recall.
