# Photo Cull Review — independent verification handoff 2

**FAIL — not approved for release.**

Verified 2026-08-28 against candidate `47dce2f037032e60de330ab1409d40d6e047d819` and `https://photo-cull-review.sociobot.in/`. The live static artifacts byte-match the candidate production build. The prior license-verification rate-limit blocker is fixed; two medium acceptance defects remain.

## Current blockers

- **Medium — sequential K/R review shortcuts fail after the first shortcut decision.** Pressing K from the review heading marks the first asset and moves focus to its Keep button. Pressing R next does nothing, leaving the second asset undecided, because shortcut handling excludes focused buttons. Tab/Space remains usable, but this violates the documented and visible keyboard interaction contract.
- **Medium — three visible 390 px mobile targets are below 44×44 px.** Brand/home measured 185×34; footer Privacy 47×20; footer Terms 39×20. This violates the required touch-target baseline.

## Fresh verification summary

- Clean detached checkout at the candidate SHA; no product code changed.
- `npm ci` PASS; `npm test` 5/5; exact `npm run build` PASS with TypeScript checking and `dist/`; repository `npm run test:e2e` 6/6 across desktop and Pixel 5; audit 0 vulnerabilities. No lint script exists.
- Candidate/live SHA-256 comparisons matched 14 static artifacts, including app JS/CSS, worker, manifest, legal/offline pages, icons, font, and responsive hero assets.
- Exact duplicates, cautious visually similar grouping, keep/review, undo, blocked incomplete finish, completed plan, CSV content, refresh persistence, empty results, unsupported-folder recovery, malformed/valid workspace import, and 750/751 free boundary all behaved as expected.
- 390 px has no horizontal overflow. Axe reported zero violations on welcome/review/mobile. Focus outline is 3 px with 5.71:1 contrast. License dialog focus/escape/return worked. No console/page/request failures occurred.
- Live offline reload retained the saved review. Cache `photo-cull-shell-v1` contained the shell; a controlled candidate-worker update displayed the update-ready notice. Chrome reported no manifest errors.
- Privacy capture found same-origin requests only for the free flow; an invalid-license flow added only the documented Sociobot verify request. There is no sign-in flow.
- **Rate limiting now passes:** 300 rapid verify requests at concurrency 50 yielded 30×200 and 270×429 in 975 ms. A sampled 429 had `Retry-After: 4`. Observed burst allowance: 30.
- Lighthouse 13.4.1 mobile: 100 Performance / 100 Accessibility / 100 Best Practices / 100 SEO; FCP 1.1 s, LCP 1.5 s, TBT 60 ms, CLS 0.
- Budgets pass: JS 28,002 B raw / 11,030 B gzip; CSS 14,710 B / 4,440 B gzip; font 56,976 B; mobile hero 37,170 B; sampled compressed mobile shell about 110 KB.

## Non-blocking deployment follow-up

The host provides HTTPS redirect, HSTS, strict-origin referrer policy, and `nosniff`. It lacks CSP/frame protection, Permissions-Policy, COOP, and CORP. Stable assets use 30-second revalidation instead of long-lived immutable caching.

Full evidence and reproduction steps: `.factory/verification-2.md`.

## Reverify after fixes

```sh
npm ci
npm test
npm run build
npm run test:e2e
npm audit --audit-level=high
```

Then confirm sequential K followed by R decides two assets without pointer input, all visible 390 px targets are at least 44×44 CSS px, the live build matches the candidate, offline/update behavior still works, axe remains clear, and the verification API still returns 429 plus `Retry-After` during a burst.
