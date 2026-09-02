# Independent verification 8 — FAIL

- Candidate: `5aa0abe5afadec0b29ace13d5e894f2bae5c46f1`
- URL: <https://photo-cull-review.sociobot.in/>
- Demo: <https://photo-cull-review.sociobot.in/?demo=1>
- Date: 2026-09-02 UTC
- Result: **FAIL — do not release.**

## Release decision

The required clean-checkout browser command fails:

```text
npm run test:e2e
14 passed, 38 failed, 2 skipped (3.5m), exit 1
```

The first failure is Chromium `@claim:demo-sandbox` at
`tests/app.spec.ts:375`: after navigation to `/?demo=1`, “Your review desk”
does not appear within seven seconds. The preview server then stops accepting
connections and subsequent checks fail with `net::ERR_CONNECTION_REFUSED` at
`127.0.0.1:4173`. The repeated run has the same non-zero result. This fails a
mandatory quality gate.

## First read and demo

**PASS.** The cold first screen says “Clean up duplicate photos. Before
anything moves.” It identifies households with large/crowded photo archives,
and has a visible “Try it with sample data” action with “Opens a four-file
sample review immediately.” The first viewport also states local storage,
offline-after-first-visit, and the 750-file free limit. The one-click action
opened the separate four-file demo with persistent demo, reset, and
start-for-real controls.

## Required claim commands

`.factory/claims.json` exists with 21 entries. After `npm ci`, every declared
command was run separately, exactly as recorded, and exited zero. This includes
all browser claims through the demo entry point and all selected unit claims:

| Claims | Result |
| --- | --- |
| `exact-duplicates`, `csv-export`, `workspace-persistence`, `offline-reload`, `local-only`, `demo-sandbox`, `workspace-backup` | PASS |
| `archive-pass-unlimited`, `license-verification-request`, `group-explanations`, `image-previews`, `free-export`, `no-setup`, `storage-controls`, `runtime-privacy`, `merchant-refund` | PASS |
| `similar-suggestions`, `free-limit`, `video-streaming`, `capture-time`, `supported-formats` | PASS |

No claim is missing or individually failing. The complete-suite failure above
remains a release block.

## Local quality gates

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 60 packages, 0 audit findings |
| `npm test` | PASS — 12/12 |
| `npm run test:e2e` | **FAIL — 14 passed, 38 failed, 2 skipped** |
| `npm run build` | PASS — `dist/` produced |
| `npm audit --audit-level=high` | PASS — 0 vulnerabilities |
| Lint | No lint script/configuration supplied |
| `git diff --check` | PASS before documentation edits |

The production build is 37,978 B raw / 14.08 kB gzip JavaScript and 18,633 B
raw / 5.15 kB gzip CSS. The self-hosted font is 56,976 B. A fresh Lighthouse
CLI attempt could not finish because its supplied Chromium tab crashed.

## Live verification

**PASS, apart from the local full-suite blocker.**

- All 22 public artifacts byte-match fresh `dist/`; `staticwebapp.config.json`
  correctly returns 404 because it is deployment configuration. Live
  `assets/app-v8.js` matches local SHA-256
  `28e8768f49aae800788b41b759705bc89aa11f8b0ade3e77cf496f8679ed0df6`.
- The live demo completed both groups with keyboard decisions and exported
  `photo-cull-move-plan-2026-09-02.csv` containing source/review paths, byte
  counts, complete hashes, group type, and reasons. It exports a plan and does
  not move source media.
- Unsupported files and malformed backup JSON offer specific recovery text and
  leave the desk usable. A 751-file scan remains limited after unavailable
  first license verification; a cached successful license stays active if its
  daily recheck is unavailable.
- A cold load and full demo flow requested only the product origin. There were
  no console/page errors on valid home, demo, legal, or mobile routes, and no
  analytics, tracking, third-party scripts, or CDN fonts. Optional license
  verification is the only documented cross-origin feature.
- The product verification endpoint returned 200 for requests 1–30, then 429
  for requests 31–35 with `Retry-After: 4`. Successful responses were
  `Cache-Control: no-store`.
- Root, assets, worker, manifest, and 404 provide CSP with header-level
  `frame-ancestors`, HSTS, nosniff, strict referrer policy, COOP/CORP,
  Permissions-Policy, and `X-Frame-Options: DENY`. Versioned JS/CSS are
  immutable for one year; `sw.js` is no-cache/no-store.
- The live service worker controlled the page (`photo-cull-shell-v9`, 20 cache
  entries). In a dedicated context the demo reloaded offline after first visit
  with its banner and saved decision. No waiting update existed because the
  worker was current.
- Playwright AxeBuilder found no serious/critical issues on home, populated
  demo, Privacy, Terms, or 404. At 390 px there was no horizontal overflow;
  all checked controls were at least 44 px high; every public route reflowed at
  200% text. Keyboard focus shows a 3 px ring and reduced motion disables hero
  animation and smooth scrolling.
- The advertised US$12 one-time Archive pass matches live Dodo checkout:
  Photo Cull Review, USD, `$12.00` subtotal and `$12.00` total.

Evidence: `.factory/verification-8-artifacts/npm-test-e2e-full.txt`,
`npm-build.txt`, `live-qa-output.json`, `live-artifact-parity.json`,
`license-rate-limit.json`, and the screenshots.

## Findings

### High — F-8-1: complete browser suite is unstable

`npm run test:e2e` is non-zero from this clean checkout. The demo-sandbox
navigation fails and the Vite preview server subsequently refuses connections,
leaving mobile, PWA update, accessibility, and routing checks without a
reproducible full-suite result. Repair the preview/test lifecycle or state
interaction, then rerun the complete suite to zero before release.

### Informational — F-8-2: Lighthouse CLI unavailable in this worker

Lighthouse 13.4.1 could not complete because its Chromium tab crashed. Repeat
the fresh Lighthouse measurement in the release browser environment after
F-8-1 is fixed.

No product code was modified by this verification.
