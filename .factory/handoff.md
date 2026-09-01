# Photo Cull Review — repair handoff

**READY — verifier blockers repaired, pushed, and deployed.**

- Work order: `photo-cull-review-repair-2`
- Repaired candidate: `4188b4c65407c06fc07e233521b230be04855393`
- Verifier report commit: `ab9f0d35875d2010a4a3c799f087400cd93532c5`
- Code repair commits: `2c91694`, `c863b2c`
- Live URL: `https://photo-cull-review.sociobot.in/`
- Demo URL: `https://photo-cull-review.sociobot.in/?demo=1`
- Artifact/deployment class: unchanged `pwa-offline` static build
- Verified: 2026-09-01 UTC

## Release-blocking repairs

1. The cold first screen now says **“Clean up duplicate photos. Before anything moves.”** Its supporting sentence names households with large or crowded photo archives and explains the compare-and-export job in 19 words. The visible sample action and three product facts remain in place.
2. Malformed, unreadable, wrong-product, and wrong-shape JSON imports now use one stable error: **“That file is not a Photo Cull Review backup. Choose a valid JSON backup exported from Photo Cull Review.”** Raw parser text is never forwarded. Valid-backup storage failures have a separate explanation and next step.
3. Two browser regressions in `tests/app.spec.ts` pin the exact normalized first read and the exact malformed-import message, assert the sample action remains visible, reject parser terms, and confirm the review desk remains usable.
4. The immutable bundles are now `app-v4.js` and `app-v4.css`; the PWA uses `photo-cull-shell-v5` and install marker `install-v5`. This ensures installed copies receive the final repair.

Before the fix, the focused regressions failed with the verifier’s exact values: “Decide what leaves. Before anything moves.” and `Expected property name or '}' in JSON at position 1 (line 1 column 2)`. After the fix, both pass on desktop and mobile and were confirmed on the live deployment.

## Verification evidence

Clean install and repository gates:

```text
npm ci                       PASS — 60 packages; 0 vulnerabilities
npm test                     PASS — 6/6 Vitest tests
npm run test:e2e             PASS — 17 passed; 1 intentional desktop skip
npm run build                PASS — strict tsc --noEmit + Vite; dist/ created
npm audit --audit-level=high PASS — 0 vulnerabilities
git diff --check             PASS
```

The intentional skip is the mobile-only 390 px geometry test in the desktop project; it runs in the mobile project. There is no separate lint script. The production build performs strict TypeScript checking. This static PWA has no package-consumer, backend API, sign-in, or runtime AI path.

Every exact command in `.factory/claims.json` passed independently. Evidence covers complete-hash exact matching, cautious similarity suggestions, CSV contents and unchanged inputs, workspace persistence, offline reload in a dedicated context, same-origin-only free use, isolated demo reset/exit, and the 750/751 free boundary.

Browser, keyboard, accessibility, and copy:

- Chromium desktop and 390×844 mobile: PASS; no horizontal overflow.
- Factory `verify-url.sh`: PASS live — HTTPS 200, 847 ms load, title, `lang=en`, one H1, main landmark, alt text, named buttons, and no console/page errors.
- Axe 4.13.0: zero serious/critical findings and zero console/page errors on live landing, populated demo, Privacy, Terms, and 404 pages.
- The existing browser suite passes skip-link/focus behavior, a visible 3 px `#A93228` focus ring, 44 px targets, sequential K/R decisions, ArrowRight completion, and the dialog path.
- Reduced motion reports `scroll-behavior: auto`. The exact first-read test passes in both configured browser projects.
- `.factory/copy-audit.md` was refreshed; the new copy has no sentence over 22 words and no banned marketing term.

PWA, privacy, response policy, and deployment identity:

- A fresh live demo is controlled by an activated `/sw.js`; `photo-cull-shell-v5` contains 19 entries, `registration.update()` completes with no waiting worker, and an offline reload retains the demo desk and offline status.
- Live request recording through landing, demo, and invalid restore observed only `https://photo-cull-review.sociobot.in`. No media or review data left the product origin.
- Live responses retain CSP with `frame-ancestors 'none'`, HSTS, strict referrer policy, `nosniff`, Permissions-Policy, COOP, CORP, and `X-Frame-Options`.
- `app-v4.js` is one-year immutable; `sw.js` is `no-cache, no-store, must-revalidate`; the manifest is `application/manifest+json`; unknown routes return the designed page with HTTP 404.
- SHA-256 comparison found 22/22 deployed artifacts identical to the clean `dist/` build, excluding the host-consumed Static Web Apps config.
- Deployment used only the existing `sf-photo-cull-review` Static Web App token and direct static upload. No DNS, billing, database, key-vault, shared service, or other Azure resource was read or changed.

Performance:

- Live Lighthouse 13.0.1: Performance 99, Accessibility 100, Best Practices 100, SEO 100; FCP 1.6 s, LCP 1.6 s, TBT 0 ms, CLS 0, Speed Index 1.5 s.
- Initial JS: 32,497 B raw / 12,269 B gzip. CSS: 15,480 B raw / 4,592 B gzip. Local font: 56,976 B. Mobile hero: 37,170 B. All are within the product budgets.
- Lighthouse emitted its known post-report browser-tab crash line after writing the complete valid report; the scores and metrics above were read from that report.

## Known gaps and next steps

No release-blocking product gap remains. Paid checkout and verification behavior, researched scope, visual assets, demo isolation, and all previously passing behavior were left unchanged. Future functional releases must increment both immutable bundle names and the service-worker cache name.
