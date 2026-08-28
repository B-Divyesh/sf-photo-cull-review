# Photo Cull Review

Photo Cull Review is a cautious, local-first review desk for households with crowded photo archives. It indexes a folder in the browser, finds byte-identical media and likely burst photos, explains each group, saves human keep/review decisions, and exports a move-to-review-folder manifest. It never uploads, moves, or deletes originals.

Live product: <https://photo-cull-review.sociobot.in>

## What it does

- Streams complete files through local SHA-256 hashing to find exact copies without loading a large video whole into memory.
- Uses a small visual difference hash plus capture-time proximity to suggest burst candidates. Suggestions are clearly distinguished from proof.
- Stores thumbnails, hashes, candidate groups, and decisions in IndexedDB so the review survives refreshes and works offline.
- Exports a CSV move plan and a restorable JSON workspace backup. Exporting is never paywalled.
- Offers a useful free tier for folders up to 750 supported files; a one-time Archive pass unlocks unlimited scans through the Sociobot billing API.

Supported inputs are JPEG, PNG, WebP, GIF, BMP, MP4, MOV, M4V, and WebM. Images get local previews; videos participate in exact matching without preview decoding.

## Run locally

Requirements: Node.js 20 or newer.

```sh
npm install
npm run dev
```

Open <http://localhost:5173>. No server, account, or API key is required for the free experience.

## Test and build

```sh
npm test          # unit tests
npm run test:e2e # Chromium desktop + 390 px mobile, axe, offline PWA
npm run build     # exact factory build command; output is dist/
```

The static deploy root is `dist/`, with `dist/index.html` at its root. For a production-like local check, run `npm run preview` after building.

The billing URL defaults to the production Sociobot API. Factory staging may set `VITE_BILLING_BASE=https://pilot-api.sociobot.in/api/v1`; `VITE_PRODUCT_SLUG` can override the default slug. No provider credentials belong in this repository.

## Privacy and safety model

All photo data stays in browser storage. The only network request made by the app is license verification when a user supplies a license. A manifest is an instruction sheet, not an executable deletion script. Users should review it and keep an independent backup before moving media.

See [the product brief](.factory/brief.json), [visual system](.factory/design.md), [privacy policy](public/privacy/index.html), and [terms](public/terms/index.html).

## Deploy

Upload the contents of `dist/` to the static host with SPA fallback to `index.html`. Preserve `/privacy/` and `/terms/` directory indexes and serve `sw.js` without long-lived immutable caching so PWA updates can be detected.

Licensed under the MIT License.
