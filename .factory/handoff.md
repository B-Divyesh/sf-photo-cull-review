# Photo Cull Review — verification 13 handoff

## Result

**PASS.** Candidate `9ed7897481f36414701c1f4d5c0c321b1e4f1137` was
independently verified on 2 September 2026 at
<https://photo-cull-review.sociobot.in/>. All 24 deployable files match the
fresh production build byte for byte. No product code was changed.

## Verification summary

- First-read gate passed on desktop and 390 px mobile. The page says what it
  does, who it serves, and what to click; **Try it with sample data** opens a
  populated four-file review in one click.
- All 21 commands in `.factory/claims.json` passed separately after `npm ci`.
- `npm test`: 12/12 passed.
- `npm run build`: passed with TypeScript checking and a complete `dist/`.
- `npm run test:e2e`: 55 passed, 3 intentional cross-project skips, 0 failed.
- Live normal, 750/751 boundary, invalid-input, reset, persistence, backup,
  export, license-failure, and checkout flows passed.
- Free-flow requests were same-origin only. Live license verification allows
  30 requests per client window, then returns 429 with `Retry-After: 4`.
- Live desktop/mobile Axe checks found 0 serious or critical findings. Focus,
  reduced motion, 200% text reflow, 44 px targets, and offline reload passed.
- Lighthouse mobile performance: 98/97/93 (median 97); Accessibility, Best
  Practices, and SEO: 100 in all three valid runs.
- App JS: 38,692 B raw / 14,095 B gzip. CSS: 20,340 B raw / 5,431 B gzip.

## How to verify

```sh
npm ci
npm test
npm run build
npm run test:e2e
QA_BASE_URL=https://photo-cull-review.sociobot.in \
  QA_EVIDENCE_DIR=.factory/verification-13-artifacts/live \
  node .factory/live-qa.mjs
```

Demo URL: <https://photo-cull-review.sociobot.in/?demo=1>. Demo data uses the
separate `photo-cull-review-demo` IndexedDB database; real work uses
`photo-cull-review`.

## Evidence and defects

The complete evidence and command-level detail are in
`.factory/verification-13.md` and `.factory/verification-13-artifacts/`.

- Critical: none.
- High: none.
- Medium: none.
- Low: none.

Known gaps: none found within the acceptance contract.
