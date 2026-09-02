# Photo Cull Review

Photo Cull Review helps households compare duplicate and burst photos before moving any files. It finds exact copies and likely bursts in a folder. You review each group and export a move plan. It never uploads, moves, or deletes originals.

Live product: <https://photo-cull-review.sociobot.in>

Try the isolated sample at <https://photo-cull-review.sociobot.in/?demo=1>. It opens a four-file family archive without reading or writing your real workspace.

## What it does

- Checks every byte to find exact copies. Large videos are checked in small pieces to limit memory use.
- Compares how photos look and when the camera recorded them to suggest likely bursts. It never uses file modification dates for this suggestion.
- Saves thumbnails, file details, groups, and decisions in your browser. Your review survives refreshes and remains available offline.
- Exports a CSV move plan and a restorable JSON workspace backup. Exporting is never paywalled.
- Folders with up to 750 supported files are free. A validated one-time US$12 Archive pass scans folders above that limit.

Supported inputs are JPEG, PNG, WebP, GIF, BMP, MP4, MOV, M4V, and WebM. Images show previews. Videos are checked only for exact copies and do not show previews.

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

All photo data stays in browser storage. Free review contacts no other website or service. With a supplied license token, verification is the app’s only outside request. A move plan is an instruction sheet, not an executable deletion script. Review it and keep an independent backup before moving media.

See [the product brief](.factory/brief.json), [visual system](.factory/design.md), [privacy policy](public/privacy/index.html), and [terms](public/terms/index.html).

## Deploy

Upload the contents of `dist/` to the static host with SPA fallback to `index.html`. Preserve `/privacy/` and `/terms/` directory indexes and serve `sw.js` without long-lived immutable caching so PWA updates can be detected.

Licensed under the MIT License.
