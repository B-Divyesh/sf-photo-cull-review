# Photo Cull Review — verification 10 handoff

## Result

**PASS.** Candidate `3c05a3093162cf823d544f2ebc0d53a0a47739f3` was
independently verified at <https://photo-cull-review.sociobot.in/> on
2026-09-02. No product code was changed. Full evidence and defect accounting
are in [verification-10.md](verification-10.md).

## What was verified

- The mandatory cold first-read and one-click isolated sample pass.
- All 21 exact commands in `.factory/claims.json` pass.
- `npm test`: 12/12 passed.
- `npm run test:e2e`: 54 passed, 2 expected target-specific skips, 0 failed.
- `npm run build`: passed, including TypeScript; `dist/` was produced.
- The live app's HTML, JS, CSS, service worker, and manifest match the candidate
  build byte-for-byte.
- The complete exact-copy/burst review and CSV export flow works on desktop and
  390 px mobile. Boundary, invalid-input, backup, license, and recovery paths
  pass.
- Privacy request logging, security/caching headers, offline reload,
  service-worker update, keyboard/focus, reduced motion, 200% text reflow, and
  Axe serious/critical checks pass.
- The Sociobot verification endpoint allows 30 requests per client window;
  request 31 returned 429 with `Retry-After: 3`.
- Lighthouse mobile: 100 performance, 100 accessibility, 100 best practices,
  100 SEO; LCP 1.5 s and CLS 0.

## Run again

```sh
npm ci
npm test
npm run test:e2e
npm run build
```

Use `/?demo=1` for the isolated four-file review.

## Known gaps and defects

None found.
