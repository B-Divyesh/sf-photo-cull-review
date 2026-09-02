# Photo Cull Review — repair 16 handoff

## Result

**PASS** for release code commit `54a6b3f` at
<https://photo-cull-review.sociobot.in/>.

The release-blocking finding in `verification-11.md` is fixed. The product
remains a static, local-first offline PWA and no previously accepted behavior
was removed.

## Reproduction and root cause

Before editing candidate `577b659`, Chromium at 390 × 844 reproduced the
verifier's measurements exactly:

- Privacy contact `sociobot.in`: 92.5 × 20 px, with no external label.
- Archive-pass dialog `Terms`: 37.6875 × 15 px.
- Archive-pass dialog `Privacy`: 46.34375 × 15 px.

All three were inline anchors whose text line box was their entire hit area.
The contact link also exposed only `sociobot.in` as its name.

## Repair

- Added one shared `legal-touch-link` treatment with an inline-flex hit area,
  a 44 px minimum width and height, and preserved inline alignment.
- Applied it to the Privacy contact and both dialog legal links.
- Changed the visible contact label to `sociobot.in (external site)`.
- Added `@regression:mobile-legal-targets`. At 390 px it enumerates every
  visible link, button, and form control on the Privacy page (8 targets) and
  inside the open Archive-pass dialog (6 targets), then measures every width
  and height. It also asserts the external label and at least 8 px separation
  between the dialog legal links.
- Advanced the release to v1.0.10, immutable assets to `app-v10`, the install
  URL to v10, and the offline cache to `photo-cull-shell-v11` so an installed
  client cannot keep the old CSS.

## Exact fixed measurements

Local and live Chromium produced the same 390 × 844 results:

| Target | Width | Height |
| --- | ---: | ---: |
| Privacy contact `sociobot.in (external site)` | 225.21875 px | 44 px |
| Dialog `Terms` | 45.6875 px | 44 px |
| Dialog `Privacy` | 54.34375 px | 44 px |

The two dialog links have 12.21875 px of horizontal separation. Every other
visible target in both measured scopes is also at least 44 × 44 px. Exact
target arrays and screenshots are in
`.factory/repair-16-artifacts/qa.json` and
`.factory/repair-16-artifacts/live/qa.json`.

## Verification

- `npm ci`: passed; 60 packages installed and 0 audit vulnerabilities.
- Every one of the 21 commands in `.factory/claims.json`: passed separately.
- `npm test`: 12/12 passed.
- `npm run test:e2e`: 55 passed, 3 intentional project-specific skips, 0
  failed. The suite covers desktop, 390 px mobile, keyboard operation, dialog
  focus/Escape, route focus, Axe, 200% text reflow, privacy requests, demo
  isolation, PWA update handling, and offline reload.
- `npm run build`: TypeScript passed and `dist/index.html` was produced. Output
  is 38,511 B JS (14.15 kB gzip), 20,340 B CSS (5.42 kB gzip), 56,976 B font,
  and 37,170 B mobile hero. No separate lint command is configured.
- `npm audit --audit-level=high`: 0 vulnerabilities. `git diff --check` passed.
- Local `/opt/fleet/lib/verify-url.sh`: HTTP 200, no console/page errors,
  `lang=en`, one H1, one main, complete image alternatives, and labelled
  buttons.
- Local Lighthouse 13.4.1 mobile: Performance 100, Accessibility 100, Best
  Practices 100, SEO 100; FCP 0.90 s, LCP 1.81 s, TBT 0 ms, CLS 0, and
  132,245 B transferred.

## Deployment and live evidence

`/opt/fleet/lib/deploy-static.sh photo-cull-review /work/repo/dist` reused only
the existing `sf-photo-cull-review` Static Web App in `centralus` and its
existing custom domain. Deployment ID:
`2c1857c6-b3f1-4655-8692-d96f33bc1334`.

- All 24 public files in `dist/` byte-match production by SHA-256.
- Live `/opt/fleet/lib/verify-url.sh`: HTTP 200 in 823 ms with no console/page
  errors and all semantic checks passing.
- Live Axe: zero serious or critical findings on Home, Demo, Privacy, Terms,
  and the designed 404. Valid routes have no console or page errors.
- Live 390 px pages have no horizontal overflow; every tested route also
  reflows without overflow at 200% text.
- Live first screen keeps the sample action and facts in the 390 × 844
  viewport. The one-click sample review, keyboard decisions, CSV export,
  reset, invalid-folder recovery, and invalid-backup recovery passed.
- Live request capture for the complete unlicensed demo flow was same-origin
  only. There are no analytics, trackers, third-party fonts, or runtime
  scripts.
- The active worker uses `photo-cull-shell-v11` with 21 cached entries.
  Offline reload retained the demo banner, review heading, previews, and saved
  workspace. The update check completed without a waiting worker because the
  deployed worker was current.
- Live responses retain CSP with header-level `frame-ancestors`, HSTS,
  `nosniff`, strict referrer policy, Permissions-Policy, COOP/CORP, and frame
  denial. Versioned JS/CSS are cached for one year as immutable; `sw.js` is
  `no-cache, no-store, must-revalidate`.
- The verification API returned 200 with `Cache-Control: no-store` for requests
  1–30, then 429 with `Retry-After: 4` for requests 31–35. CORS allowed only
  the supplied product origin in this check.
- The contact, robots, sitemap, manifest, and hosted checkout links returned
  their expected statuses. Checkout still identifies Photo Cull Review in USD
  with a US$12 subtotal and total.
- Live Lighthouse 13.4.1 mobile: Performance 100, Accessibility 100, Best
  Practices 100, SEO 100; FCP 1.13 s, LCP 1.52 s, TBT 0 ms, CLS 0, and
  117,824 B transferred.
- The product has no sign-in or product backend, so an identity-provider test
  is not applicable. No database, storage account, secret, slot, DNS record,
  or unrelated resource was read or changed.

## Evidence

Evidence is under `.factory/repair-16-artifacts/`: local and live QA JSON,
desktop/mobile screenshots, local/live verifier output, Lighthouse reports,
the 24-file parity report, and verification response-policy results.

## Known gaps

None for the requested repair scope.
