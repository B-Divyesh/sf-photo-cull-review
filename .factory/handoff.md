# Photo Cull Review — repair handoff

**Local release result: PASS.** This repairs the independent-verification failure recorded at `bc64345f2c7dcf9966d9ea6ae3db0205d2e38723` for candidate `70b3276248dba293802473522b6dc05689562ec8`.

- Product repair: `8deb9c67f5686696c113cbbe53aceabe62c01c05`
- Accessibility regression coverage: `287e082450f7a04296e1183747f7e7d51e3a20e6`
- Deployment commit: recorded after the static-host push below.
- Demo: `/?demo=1` — isolated IndexedDB database `photo-cull-review-demo`.

## What changed

1. Reproduced the cold-screen failure before editing: at 1440×900, **Try it with sample data** was at `y=916.75`, fully below the viewport. The hero now puts the action, “Opens a four-file sample review immediately,” and all three facts in view. The regression test measures their bottom edge at 1440×900; final local values were `583.34`, `643.00`, and `866.47` CSS pixels. The 390×844 test also keeps the sample action and outcome in view with no horizontal overflow.
2. Similar-photo timing now reads JPEG EXIF `DateTimeOriginal` (including fractional seconds) into `captureTimestamp`. Candidate grouping sorts and compares that timestamp only; browser `File.lastModified` remains an identifier/detail, never burst evidence. Images without embedded camera time still participate in exact SHA-256 matching but are not guessed into a burst group. The regression moves file modification times while holding capture times apart/close and asserts the correct opposite outcomes.
3. Added a deterministic pre-scan `selectMediaFiles` boundary. Free 750/751 and paid 751 behavior now execute without hashing hundreds of files in the unit test.
4. Registered and tested the formerly unlisted backup, paid-limit, video-streaming, and license-verification-request statements in `.factory/claims.json`. The video test supplies stream-only files whose `arrayBuffer()` throws; the license test fulfills a fixture and records the one permitted cross-origin verify request.
5. Added `/?demo=1` to the sitemap, versioned the PWA asset/cache names to `app-v5` / `photo-cull-shell-v6`, and precached the designed 404 page.
6. Rebuilt Privacy, Terms, and 404 with the shared header, skip link, primary navigation, complete footer, titles, and product styling. The footer now names Param Factory and build `v1.0.4`.

## Verification evidence

Run from a clean dependency install on 2026-09-01 UTC:

```text
npm ci                         PASS — 60 packages; 0 vulnerabilities
npm test                       PASS — 11/11 Vitest tests
npm run build                  PASS — tsc --noEmit + Vite; dist/ created
npm audit --audit-level=high   PASS — 0 vulnerabilities
npm run test:e2e               PASS — 23 passed; 1 intentional mobile-project skip
verify-url.sh local build      PASS — HTTP 200; title/lang/one h1/main/alts/button labels; no console/page errors
git diff --check               PASS
```

Every command in `.factory/claims.json` was also invoked independently and passed. That includes all original eight claims plus `workspace-backup`, `archive-pass-unlimited`, `video-streaming`, and `license-verification-request`.

Playwright uses the pinned 1.58.2 Chromium browser at one worker with a single retry and `--disable-gpu`; this avoids an intermittent headless Chromium SIGSEGV during context creation in the constrained worker. It does not mask assertion failures. Axe scans had zero serious or critical findings on welcome, populated local workspace, demo workspace, Privacy, Terms, and 404.

Measured build sizes: initial JS 35,380 B raw / 13,281 B gzip; CSS 16,719 B raw / 4,840 B gzip; self-hosted font 56,976 B; mobile hero 37,170 B. All are within the PWA budgets.

`public/staticwebapp.config.json` supplies CSP (including response-header `frame-ancestors`), referrer policy, nosniff, Permissions-Policy, COOP, CORP, immutable versioned assets, and no-store service-worker caching. Package/consumer testing is not applicable: this is a private static PWA, not a published library.

## Deploy and use

```sh
npm ci
npm test
npm run build
npm run test:e2e
npm run preview
```

Deploy `dist/` using the included `staticwebapp.config.json`; its root contains `index.html`. The static-host deployment and live SHA/headers verification are performed after pushing `main`.

## Known product boundary

The product intentionally does not infer photo capture time from copied-file modification dates. JPEGs without EXIF `DateTimeOriginal` are therefore omitted from **similar** suggestions rather than receiving an unreliable timestamp; exact duplicates and video exact matching continue to work.
