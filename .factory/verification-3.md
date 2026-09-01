# Independent verification 3 — FAIL

- Candidate: `4188b4c65407c06fc07e233521b230be04855393`
- Verified URL: `https://photo-cull-review.sociobot.in/`
- Demo URL: `https://photo-cull-review.sociobot.in/?demo=1`
- Date: 2026-09-01 UTC
- Result: **FAIL — do not release this candidate.**

## Release-blocking findings

### High — the cold first screen does not identify the intended user

The required first-read check failed. On a new desktop browser context, the live page showed:

- H1: “Decide what leaves. Before anything moves.”
- Supporting copy: “Find byte-for-byte duplicates and likely bursts, compare them on a calm review desk, then export a move plan. Your originals are never changed.”
- Primary action: “Try it with sample data”.

This explains much of the workflow and gives a working one-click demo, but it never says that the product is for households with large or crowded photo archives. The H1 also does not name photos. A cold visitor therefore cannot confirm *for whom* the product is intended from the first screen, as required by the plain-words and acceptance contract.

### Medium — invalid workspace restore exposes a raw parser message

In a fresh live demo, selecting an invalid JSON backup displayed:

> Expected property name or '}' in JSON at position 1 (line 1 column 2)

This does not say that the selected file is not a Photo Cull Review backup or give the visitor a clear next action. **Reset demo** recovered to the review desk, but the initial error does not meet the required plain-language error behavior.

## Required claim tests

`.factory/claims.json` exists and contains eight claims. Before installation, the first claim command could not load `@playwright/test` in the clean checkout; that is the normal missing-dependency state. After the required `npm ci`, every exact command passed through the product demo entry point:

| Claim | Exact command | Result |
| --- | --- | --- |
| exact-duplicates | `npm run test:e2e -- --grep @claim:exact-duplicates` | PASS (2) |
| similar-suggestions | `npm test -- --testNamePattern @claim:similar-suggestions` | PASS (1) |
| csv-export | `npm run test:e2e -- --grep @claim:csv-export` | PASS (2) |
| workspace-persistence | `npm run test:e2e -- --grep @claim:workspace-persistence` | PASS (2) |
| offline-reload | `npm run test:e2e -- --grep @claim:offline-reload` | PASS (2) |
| local-only | `npm run test:e2e -- --grep @claim:local-only` | PASS (2) |
| demo-sandbox | `npm run test:e2e -- --grep @claim:demo-sandbox` | PASS (2) |
| free-limit | `npm test -- --testNamePattern @claim:free-limit` | PASS (1) |

## Repository and build checks

```text
npm ci                         PASS — 60 packages, 0 audit findings
npm test                       PASS — 6/6
npm run test:e2e               PASS — 13 passed, 1 configured desktop-project skip
npm run build                  PASS — tsc --noEmit and Vite; dist/ created
git diff --check               PASS
```

There is no separate lint script. The production build runs strict TypeScript checking.

## Independent live-product checks

- Demo workflow: PASS. A cold `?demo=1` context loaded the four-file sample; keyboard K/R decisions moved from “These files are exact copies” to “These frames look related” and then “Your plan is ready”. A CSV manifest downloaded with the plan-only line and expected columns. Attempting export before choosing an item gave the clear recovery message “Mark at least one file ‘Move to review’ before exporting.”
- Normal and recovery behavior: PASS except the invalid-backup finding above. A folder containing only `notes.txt` showed a clear supported-format message. Reset demo restored the sample review desk.
- Desktop and 390 px mobile: PASS for layout. The page had no horizontal overflow. Checked 390 px target boxes were 185.28×44 px (home), 55.47×44 px (Privacy), and 46.61×44 px (Terms).
- Keyboard and focus: PASS. Tab reached a visible 3 px `#A93228` focus ring on skip link, home, Archive pass, and sample-demo action. Sequential review shortcuts worked in the live demo. Reduced-motion rendering reported `scroll-behavior: auto`.
- Accessibility: PASS. Fresh axe-core 4.13.0 scans had zero serious/critical findings on live landing, populated demo, Privacy, Terms, and the designed 404. Landing and demo had no console or page errors. The expected 404 response itself reports a browser console resource error when deliberately requesting the missing route.
- Privacy: PASS for the free/demo path. Request recording during the live landing and complete demo review found only `https://photo-cull-review.sociobot.in`; no photo upload or cross-origin request occurred. The candidate source inventory confirms the only optional external path is documented license checkout/verification.
- Headers and caching: PASS. Live responses include CSP with `frame-ancestors 'none'`, `nosniff`, strict referrer policy, Permissions-Policy, COOP, CORP, X-Frame-Options, and HSTS. `app-v2.js` is `public, max-age=31536000, immutable`; `sw.js` is `no-cache, no-store, must-revalidate`; the manifest has `application/manifest+json`.
- PWA: PASS. The live demo obtained a controlled active `/sw.js`; after the first visit, offline reload showed “Offline — your saved review is still available on this device” and retained the demo banner. Calling `registration.update()` completed with the controlled worker active and no waiting revision. The live worker is no-store and the candidate includes `skipWaiting`, `clients.claim`, and the in-app update-ready toast handler.
- Deployment identity: PASS. SHA-256 bytes matched between the freshly built `dist/` and live deployment for all 22 shipped artifacts (HTML, JS, CSS, worker, manifest, legal/offline/404 pages, assets, icons, sample artwork, sitemap, and robots file).
- Performance budgets: PASS. Initial JS is 30,742 B raw / 11,837 B gzip; CSS is 15,480 B raw / 4,590 B gzip; local font 56,976 B; mobile hero 37,170 B. Each is within the stated static-product budget. A Lighthouse executable was not present in this clean checkout, so no fresh Lighthouse score is recorded.

## Scope notes

This is a static PWA with no product-owned server endpoint, so a product API request allowance is not applicable. The optional billing URL is an external service; it was not contacted, including for rate-limit checking, because this work order limits verification to the `sf-photo-cull-review` product resource. There is no sign-in path.

## Required follow-up

1. Rewrite the landing H1 and one supporting sentence so they plainly name photo cleanup and households with large/crowded archives, while retaining the visible sample action and facts.
2. Replace raw workspace-import parser output with a plain-language message that identifies an invalid Photo Cull Review backup and tells the visitor to choose a valid exported backup.
3. Add focused regression tests for both conditions, then re-run this verification.
