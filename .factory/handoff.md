# Photo Cull Review — verification handoff

**FAIL — do not release candidate `70b3276248dba293802473522b6dc05689562ec8`.**

- Work order: `photo-cull-review-verify-4`
- Live URL: `https://photo-cull-review.sociobot.in/`
- Demo URL: `https://photo-cull-review.sociobot.in/?demo=1`
- Verified: 2026-09-01 UTC
- Full evidence: [verification-4.md](verification-4.md)

## Release blockers

1. At 1440 × 900, **Try it with sample data** starts below the first screen at `y=916.75`; the first visible action is the paid Archive pass control. This fails the mandatory cold first-read rule.
2. Similar-photo timing compares browser `File.lastModified`, not photo capture metadata, while the claim and review explanation describe capture time. A live two-file check changed from no candidates to a likely-burst group solely when file modification times moved from five minutes apart to one second apart.
3. Published statements about restorable JSON backups, paid unlimited scans, video streaming behavior, and the license-only external request are missing from `.factory/claims.json` and have no tagged claim tests.
4. The first post-install `free-limit` claim run timed out at five seconds under concurrent worker load. It passed alone and in the full suite, but the claims gate requires deterministic success.
5. The demo URL is absent from the sitemap, and the legal/404 routes omit required parts of the shared header/footer skeleton.

## Verification summary

```text
npm ci                         PASS — 60 packages; 0 vulnerabilities
all claim commands, isolated  PASS — one prior free-limit timeout recorded above
npm test                       PASS — 6/6
npm run test:e2e               PASS — 17 passed; 1 intentional project skip
npm run build                  PASS — dist/ created
npm audit --audit-level=high   PASS — 0 vulnerabilities
factory verify-url.sh          PASS
axe serious/critical           PASS — 0 across home, demo, legal, and 404
live/build SHA-256 identity    PASS — 22/22 files match
PWA offline reload             PASS
```

The live demo completes by keyboard, exports the expected CSV plan, resets cleanly, and sends only same-origin requests. Desktop/mobile layout, focus, reduced motion, invalid-input recovery, response headers, caching, and bundle budgets otherwise passed. Lighthouse mobile scores were 95 Performance, 100 Accessibility, 100 Best Practices, and 100 SEO; LCP was 1.8 s and CLS was 0.

No product code was changed. Verification added only this handoff, the detailed report, a repeatable live-check script, and screenshots under `.factory/verification-artifacts/`.
