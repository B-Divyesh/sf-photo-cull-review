# Photo Cull Review — polish 3 handoff

## Result

Review 3 is closed and version 1.0.9 is live at
<https://photo-cull-review.sociobot.in>. No reviewed finding is left open.

## What changed

- Put a real sample filename and Keep decision in the first 390×844 and
  1440×900 demo viewports while preserving the darkroom contact-sheet design.
- Changed the mobile control to “View pass”; removed unbounded paid wording,
  unmeasured speed wording, remaining scan jargon, and the 404 metaphor.
- Identified Sociobot/Dodo checkout before both external purchase links.
- Added a real 180×180 Apple touch icon to every public route and the offline
  cache. Bumped assets to `app-v9` and the PWA cache to
  `photo-cull-shell-v10`.
- Renamed the bounded paid claim to `archive-pass-above-limit` and updated its
  browser contract test. All 21 claim IDs still map to exactly one test.
- Updated the catalog sentence, copy audit, demo documentation, and complete
  finding map in `.factory/polish-3.md`.

## Verification evidence

- Clean clone `/tmp/photo-cull-review-polish3.NhtYX5/repo` at repair commit
  `48d37bc`: `npm ci` succeeded with zero audit findings, then all 21 distinct
  commands in `.factory/claims.json` passed separately.
- `npm test`: 12/12 passed.
- `npm run build`: passed; `dist/index.html` exists. Output is 38.46 kB JS
  (14.14 kB gzip) and 20.19 kB CSS (5.40 kB gzip).
- `npm run test:e2e`: 53 passed and two intended target skips. One Chromium
  process crashed once; Playwright retried it successfully, and the exact
  mobile license test then passed independently 1/1.
- Local and production `/opt/fleet/lib/verify-url.sh`: title, `lang`, one h1,
  main landmark, alt text, controls, and valid-route console checks passed.
- Playwright Axe on Home, Demo, Privacy, Terms, and 404: zero serious or
  critical violations. Keyboard focus, dialog return focus, reduced motion,
  200% text reflow, 44px targets, and route h1 focus passed.
- Live Lighthouse 13.4.1 mobile: Performance 100, Accessibility 100, Best
  Practices 100, SEO 100; LCP 1.4s, CLS 0, TBT 0ms.
- Live demo: sample group bottom 390px, filename bottom 656px, and Keep bottom
  749px at 1440×900. At 390×844 they end at 539px, 767px, and 840px.
- Live PWA: populated sample and decisions reopen offline under cache
  `photo-cull-shell-v10`; demo requests remain same-origin; Reset restores the
  sample decision.
- Live routes have distinct titles/social cards, focus their h1, and a missing
  path returns the designed HTTP 404. The Apple icon decodes at 180×180.
- Nine key live artifact SHA-256 values match the deployed `dist/` files.

Evidence: `.factory/polish-3-artifacts/live-qa.json`, `live-findings.json`,
`live-parity.json`, `lighthouse-live.json`, the local/live verifier folders,
and the 390px/1440px screenshots in the same directory.

## Deploy

`/opt/fleet/lib/deploy-static.sh photo-cull-review /work/repo/dist` completed
with deployment ID `e307ccba-145c-4273-9c46-0b4d2f3b3d4c`. The existing
`sf-photo-cull-review` app in `centralus` and its existing custom domain were
reused. No unrelated resource, secret, database, slot, or storage was read or
changed.

## Known gaps and next steps

None for the reviewed scope. Future changes should rerun every claim command,
the full browser/PWA suite, the live verifier, and the cold viewport checks.
