# Photo Cull Review — verification 12 handoff

## Result

**PASS** for candidate `e3461f63d21f9f6a5f463c1fba46ebe1cb198c33` at
<https://photo-cull-review.sociobot.in/> on 2026-09-02.

Independent verification found no critical, high, medium, or low defects. No
product code was modified. The complete report is
`.factory/verification-12.md`; supporting evidence is under
`.factory/verification-12-artifacts/`.

## Required gates

- `.factory/claims.json`: present; every listed command passed independently,
  **21/21 claims**.
- First read: passes on desktop and 390 × 844. The first screen says what the
  tool does, names households with large archives, and offers a visible
  one-click **Try it with sample data** action with its outcome.
- `npm ci`: passed, 0 audit vulnerabilities.
- `npm test`: 12/12 passed.
- `npm run test:e2e`: 55 passed, 3 intentional project-specific skips.
- `npm run build`: passed, including `tsc --noEmit`; `dist/` produced. No
  separate lint command exists.
- `/opt/fleet/lib/verify-url.sh`: passed live with no normal-route console or
  page errors.
- Axe: zero serious/critical findings on Home, Demo, Privacy, Terms, and 404.

## Live verification

- All 24 deployable files match the fresh candidate build byte for byte.
- The live demo and a real duplicate-JPEG folder completed through keyboard
  decisions and CSV export; source hashes remained unchanged.
- Unsupported input, malformed backup, 750/751 limits, license failures,
  reset, backup/restore, and checkout/revocation paths behave as documented.
- Free review made same-origin requests only. Normal responses carry the
  expected CSP, HSTS, nosniff, referrer, permissions, isolation, cache, and
  framing policies.
- Unlock verification allowed requests 1–30, then requests 31–35 returned 429
  with `Retry-After: 4`.
- Desktop and 390 px layouts, keyboard focus, 44 px targets, 200% text reflow,
  reduced motion, service-worker update handling, and offline reload passed.
- Lighthouse mobile performance runs were 88/95/94 (median 94); Accessibility,
  Best Practices, and SEO were 100 throughout. LCP was 1.51–1.68 s and CLS 0.
- JS is 38,511 B raw / 14,060 B gzip; CSS is 20,340 B raw / 5,431 B gzip;
  font is 56,976 B; mobile hero is 37,170 B.

## Reproduce

```sh
npm ci
npm test
npm run build
npm run test:e2e
QA_BASE_URL=https://photo-cull-review.sociobot.in \
  QA_EVIDENCE_DIR=.factory/verification-12-artifacts/live \
  node .factory/live-qa.mjs
```

## Known gaps and next steps

None for the acceptance contract. Lighthouse is sensitive to shared-runner CPU
contention; use isolated repeated runs and the median when tracking performance.
