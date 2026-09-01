# Photo Cull Review — polish 1 handoff

## Result

**PASS.** Repair commit `c6589c1f64a454ae61f43f93c7b3184e1a5de4ab` is deployed to <https://photo-cull-review.sociobot.in>.

The review’s 31 findings are closed in [polish-1.md](polish-1.md). The product remains a local-first offline PWA with its warm darkroom/contact-sheet visual system.

## What changed

- Strengthened all incomplete claims: full SHA-256 export checks, 30/31-second burst boundary, parsed CSV/JSON downloads, populated offline demo reload, real-data demo isolation, and UI-driven validated Archive pass behavior.
- Added nine missing claim groups and their isolated tests. `.factory/claims.json` now has 21 entries, each with exactly one `@claim:<id>` test.
- Rewrote the flagged first-screen, price, README, legal, and export wording in plain language. “Move plan” is now the one visitor-facing name for the CSV.
- Moved focus to the new page heading after demo navigation and Back navigation.
- Bumped the cache-safe PWA release to `1.0.6`: `app-v7` assets and `photo-cull-shell-v8` prevent the previous immutable app files from masking this repair.

## Verification

Fresh clone: `/tmp/photo-cull-review-clean-5JJJkK` at pushed commit `c6589c1`.

```sh
npm ci
npm test
npm run build
npm run test:e2e -- --reporter=line
# then every command recorded in .factory/claims.json, one by one
```

Results:

- Unit tests: 12 passed.
- Build: passed; `dist/index.html` exists; app JS 14.07 KB gzip and CSS 5.15 KB gzip.
- Browser/accessibility suite: 54 passed across Chromium and 390 px mobile; 2 project-specific skips.
- Claims: 21/21 declared commands passed from the clean clone.
- Live verifier: `/opt/fleet/lib/verify-url.sh https://photo-cull-review.sociobot.in /tmp/photo-cull-review-live-verify` passed. It found a title, `lang=en`, one h1, one main, complete image alt coverage, labelled buttons, and no errors on the landing route.
- Live axe integration: no serious or critical issues on home, demo, Privacy, Terms, or 404.
- Live cold check: desktop and 390 px first screens show the action and its outcome; no horizontal overflow; 44 px header targets; 200% text reflows on all public routes.
- Live PWA check: `photo-cull-shell-v8` controls the demo; a saved demo reloads offline with the banner and review desk present.
- Live focus check: demo forward navigation and browser Back both focus the destination h1.
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.5 s and CLS 0.

Live evidence: [cold mobile screenshot](repair-4-artifacts/live-cold-mobile.png), `/tmp/photo-cull-review-live-qa.json`, and `/tmp/photo-cull-review-lighthouse.json` from this repair run. The live QA captures only an expected browser console 404 for the intentionally missing-route check; valid routes had no console errors.

## Deployment

```sh
/opt/fleet/lib/deploy-static.sh photo-cull-review dist
```

The deployment reused only `sf-photo-cull-review` in resource group `sociobot` and its `photo-cull-review.sociobot.in` custom domain.

## Known gaps

None.
