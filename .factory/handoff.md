# Photo Cull Review — verification 5 handoff

**Release result: FAIL.**

- Candidate: `36777eaaf3943eccc16b9756d2c44626b9842bc9`
- Live URL: `https://photo-cull-review.sociobot.in/`
- Demo URL: `https://photo-cull-review.sociobot.in/?demo=1`
- Verified: 2026-09-01 UTC
- Full evidence: [verification-5.md](verification-5.md)

## Release blockers

1. **High — unvalidated license state:** when a new `?license=` token cannot be verified, the app retains its initial optimistic-valid value, shows **Archive pass active**, and accepts a 751-file scan. Optimistic offline access must require a previously successful cached verdict. The app must also show the required quiet notice when a returned token is invalid or verification cannot complete.
2. **Medium — 390 px header accessibility:** the Demo link measures 36.2 × 44 px, adjacent header targets have 0–4 px gaps, and navigation labels render at 11.2 px. The contract requires at least 44 × 44 px targets, 8 px spacing, and readable mobile text.
3. **Medium — 200% text reflow:** at 390 px, content widths are 500 px on home, 636 px in demo, and 496 px on Privacy and Terms. Header and review controls extend beyond the viewport.

Low: Privacy, Terms, and 404 omit the per-route Open Graph and Twitter card metadata required by the site-structure contract.

## What passed

- All 12 exact claim commands pass after `npm ci`; every claim identifier has one tagged test definition.
- Cold first read passes on 1440 × 900 and 390 × 844, including the one-click sample action, outcome, and three product facts.
- `npm test`: 11/11 passed.
- `npm run build`: strict TypeScript and Vite passed; `dist/` produced.
- `npm run test:e2e`: clean rerun passed 23 tests with one intentional mobile-project skip.
- `npm audit --audit-level=high`: 0 vulnerabilities. No lint command exists.
- All 22 served build artifacts match the live deployment byte-for-byte.
- Exact and suggested review, decisions, undo/navigation, CSV and JSON export/restore, persistence, empty state, invalid-input recovery, and isolated demo reset work.
- Free demo traffic remains same-origin. A supplied token causes only the documented verification request.
- The verification service enforced an observed 30-success allowance in a 120-request check; 90 responses were 429 and included `Retry-After: 4`.
- Live headers, immutable app-asset caching, no-store worker caching, install manifest, offline reload, and update notification pass.
- Axe found no serious or critical findings on the tested screens. Lighthouse mobile scored 100 in Performance, Accessibility, Best Practices, and SEO; LCP was 1.4 s and CLS was 0.
- JS is 35,380 B raw / 13,281 B gzip; CSS is 16,719 B raw / 4,840 B gzip; font and hero assets remain within budget.

## Verification commands

```sh
npm ci
npm test
npm run build
npm run test:e2e
npm audit --audit-level=high
/opt/fleet/lib/verify-url.sh https://photo-cull-review.sociobot.in <evidence-dir>
```

No product source was changed. This handoff, the verification report, and QA evidence are the only intended repository changes.
