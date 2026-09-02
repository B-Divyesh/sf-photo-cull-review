# Photo Cull Review — polish round 4 handoff

## Result

**PASS.** The production repair is live at
<https://photo-cull-review.sociobot.in/>. The repaired source is commit
`54802b8` (`fix: keep demo route announcements off controls`); live-QA and
catalog updates are in `efef8df`. Azure Static Web Apps deployment
`fc9fbc80-0d8e-4ae1-81b5-5dd404f5c181` completed on 2 September 2026.

The only round-4 blocker, F-4-1, is fixed. Route changes still focus the
incoming h1 and issue a polite announcement, but the route message now lives
in a visually hidden region. The visible toast remains for action feedback and
can no longer cover demo decisions. The PWA bundle moved to immutable
`app-v11` assets and a `photo-cull-shell-v12` cache so existing installs fetch
the repaired code.

## Verification

- Clean clone `/tmp/photo-cull-review-polish4.Szlnrj/repo`: `npm ci` passed,
  then all 21 commands in `.factory/claims.json` passed separately and with
  exactly one matching claim test each.
- Local product gates: `npm test` passed 12/12; `npm run build` passed and
  produced `dist/`; `npm run test:e2e` passed the full 58-test browser suite.
  App JS is 38.69 kB raw / 14.18 kB gzip; CSS is 20.34 kB raw / 5.42 kB gzip.
- The updated `@regression:demo-first-viewport` takes the actual one-click
  path from Home. At 390×844 it verifies the demo h1 focus, the polite
  announcement, first filename, Keep, and Move control; each center is
  immediately returned by `elementFromPoint()`.
- Cold production check:
  `QA_BASE_URL=https://photo-cull-review.sociobot.in QA_EVIDENCE_DIR=.factory/polish-4-artifacts/live node .factory/live-qa.mjs`.
  It found Home, Demo, Privacy, and Terms healthy; the designed missing route
  returned HTTP 404; every route had one h1/main and no serious or critical
  Axe result. The demo has four files and two groups, reset works, CSV export
  works, only same-origin free-flow requests occur, and the populated demo
  reloads offline under cache `photo-cull-shell-v12`.
- Live mobile evidence at
  `.factory/polish-4-artifacts/live/qa.json` reports
  `routeFocus: true`, `routeAnnouncement: "Review duplicate and burst photos opened."`,
  and pointer checks true for `IMG_2041.jpg`, `keep`, and `review`.
  Corresponding screenshots are
  `.factory/polish-4-artifacts/live/demo-mobile-390x844.png` and
  `.factory/polish-4-artifacts/live/demo-desktop-1440x900.png`.
- `/opt/fleet/lib/verify-url.sh https://photo-cull-review.sociobot.in .factory/polish-4-artifacts/live/verify-url`
  passed: HTTP 200, 647 ms load, title/lang/h1/main/image alternatives/named
  controls, and no console/page errors. The live `@axe-core/playwright`
  checks cover Home, Demo, Privacy, Terms, and 404 with zero serious/critical
  violations.
- Live mobile Lighthouse: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; LCP 1502 ms, CLS 0, TBT 0. Full report:
  `.factory/polish-4-artifacts/live/lighthouse-mobile.json`.

## Documentation and operation

- Demo: open `/?demo=1`; it uses the isolated
  `photo-cull-review-demo` IndexedDB namespace. Reset reseeds only demo data;
  Start for real discards it.
- Build/run: `npm ci`, `npm test`, `npm run build`, then `npm run test:e2e`.
  Deploy the contents of `dist/` with the included Static Web Apps config.
- `.factory/polish-4.md` maps F-1-1 through F-4-1 to their final change and
  evidence. The catalog line is verb-first and 10 words.

## Known gaps

None. All findings in `.factory/review-1.md` through
`.factory/review-4.md` are closed and rechecked live.
