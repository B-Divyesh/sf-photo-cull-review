# Polish 3 — zero-finding closure

Reviewed candidate: `a019e240bf48a887b0324139cc051d178300e3a3`  
Repair code: `48d37bcf25fc625282fa9b4bdca38713bd660769`  
Verification commit: `5d8fd35`  
Production: <https://photo-cull-review.sociobot.in>  
Deployment: `e307ccba-145c-4273-9c46-0b4d2f3b3d4c`

## Review 1 findings retained and reverified

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Full exported hashes remain compared with Node SHA-256 fixture digests. | `@claim:exact-duplicates`; 21-command clean-clone run |
| F-1-2 | The exact 30-second inclusion and 31-second exclusion remain asserted. | `@claim:similar-suggestions` |
| F-1-3 | CSV parsing still checks six headers, row count, quoted paths, types, reasons, and full hashes. | `@claim:csv-export` |
| F-1-4 | Demo coverage still seeds real work, confirms four files and two groups, resets, exits, and preserves the real decision. | `@claim:demo-sandbox`; `live-qa.json` |
| F-1-5 | The populated demo still reloads offline in its own browser context with decisions and previews. | `@claim:offline-reload`; `live-qa.json` cache `photo-cull-shell-v10` |
| F-1-6 | The pass still requires a recorded valid verdict, reaches the live US$12 checkout contract, and scans 751 files. | `@claim:archive-pass-above-limit` |
| F-1-7 | Exact and likely-burst reasons remain registered and exercised. | `@claim:group-explanations` |
| F-1-8 | Embedded camera time, not modification time, remains registered and tested. | `@claim:capture-time` |
| F-1-9 | All nine formats and local image previews remain registered and tested. | `@claim:supported-formats`; `@claim:image-previews` |
| F-1-10 | CSV and JSON exports remain available without a pass. | `@claim:free-export` |
| F-1-11 | A clean browser still starts review without an account, server, or key. | `@claim:no-setup` |
| F-1-12 | Browser token storage and Start a new scan clearing remain covered. | `@claim:storage-controls` |
| F-1-13 | CSV and JSON assertions still inspect paths and complete hashes. | `@claim:csv-export`; `@claim:free-export` |
| F-1-14 | Runtime requests, resources, and tracking storage remain inventoried. | `@claim:runtime-privacy`; live same-origin demo flow |
| F-1-15 | Merchant and refunded-license behavior remain covered with recorded responses. | `@claim:merchant-refund`; live checkout contract |
| F-1-16 | Forward and Back navigation continue to focus and announce the incoming h1. | `@regression:route-focus`; `live-findings.json` |
| F-1-17 | The exported CSV is still called a “move plan” throughout. | `copy-audit.md`; full browser suite |
| F-1-18 | The eyebrow remains “Review duplicate photos on this device.” | `live-qa.json` first read |
| F-1-19 | The illustration caption directly states that the app creates a plan and moves nothing. | `@claim:csv-export`; `copy-audit.md` |
| F-1-20 | The process label remains “How it works.” | `copy-audit.md` |
| F-1-21 | The process heading still names duplicate and burst review. | `copy-audit.md` |
| F-1-22 | Pricing still names the 750-file threshold. | `@claim:free-limit` |
| F-1-23 | Pricing now states only the tested US$12 entitlement, with no slogan or unbounded wording. | `@claim:archive-pass-above-limit`; live dialog copy |
| F-1-24 | The desktop label remains “View Archive pass”; the reopened mobile label now says “View pass.” | `@regression:mobile-header`; `live-findings.json` |
| F-1-25 | README still opens with the household photo-review task. | `copy-audit.md` |
| F-1-26 | README overview remains split into short sentences. | `copy-audit.md` |
| F-1-27 | README continues to explain visual/time comparison without hash terminology. | `copy-audit.md` |
| F-1-28 | README leads with browser persistence rather than a database name. | `copy-audit.md` |
| F-1-29 | Free and paid pricing remain separate factual sentences. | `copy-audit.md`; `@claim:archive-pass-above-limit` |
| F-1-30 | README still describes video behavior as a visible result. | `@claim:video-streaming`; `copy-audit.md` |
| F-1-31 | README still says free review contacts no other site or service. | `@claim:local-only`; `copy-audit.md` |

## Review 2 findings retained and reverified

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-2-1 | Demo content stays before tools/progress. Desktop sample images are now compact, placing a filename and Keep control above 900px; mobile remains above 844px. | `@regression:demo-first-viewport`; `demo-desktop-1440x900.png`; `demo-mobile-390x844.png`; live bottoms 749px/840px |
| F-2-2 | Loading still says “Opening Photo Cull Review.” | `copy-audit.md` |
| F-2-3 | The first process step still says “Find exact copies and likely bursts.” | `copy-audit.md` |
| F-2-4 | Landing copy still explains exact matching as checking every byte. | `@claim:exact-duplicates` |
| F-2-5 | Landing copy still describes comparing photos and capture times. | `@claim:similar-suggestions` |
| F-2-6 | The license dialog still says “free product.” | live dialog copy in `live-findings.json` |
| F-2-7 | README keeps the two plain exact-copy/video sentences. | `copy-audit.md` |
| F-2-8 | README keeps the plain photo-and-camera-time description. | `copy-audit.md` |
| F-2-9 | Demo h1 remains “Review duplicate and burst photos.” | `@regression:demo-first-viewport` |
| F-2-10 | The workspace action remains “Start a new scan.” | `@claim:storage-controls` |
| F-2-11 | Home, Demo, Privacy, Terms, 404, and Back retain h1 focus and announcement behavior. | `@regression:route-focus`; live Terms focus in `live-findings.json` |

## Review 3 findings closed

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-2-1 | Added a desktop demo layout with 210px mounted previews and extended the regression to both required viewports. | `@regression:demo-first-viewport`; live group/filename/Keep bottoms 390/656/749px at 1440×900; `demo-desktop-1440x900.png` |
| F-1-24 | Replaced visible mobile “Pass” with the verb label “View pass” on app and static routes. | `@regression:mobile-header`; shared-shell regression; `live-findings.json` |
| F-3-1 | Removed “any size,” “unlimited,” and “unlock” purchase wording. The pass is now bounded as scanning above the 750-file free limit; the error says to buy a pass. The claim ID is now `archive-pass-above-limit`. | `@claim:archive-pass-above-limit`; `@claim:free-limit`; live dialog/error in `live-qa.json` |
| F-3-2 | Replaced “immediately” with “in this browser.” | `@regression:first-viewport`; `live-qa.json` |
| F-3-3 | Replaced “indexed” with “files are ready to review.” | `@claim:demo-sandbox`; `live-findings.json` |
| F-3-4 | Replaced the scan metaphor with “Checking photos for copies and likely bursts.” | `live-scan-copy.png`; `live-findings.json` |
| F-3-5 | Replaced scan-time hash jargon with “File checks and small previews stay on this device.” | `live-scan-copy.png`; `live-findings.json` |
| F-3-6 | Changed the 404 action to “Return to photo review.” | live HTTP 404 and action in `live-findings.json` |
| F-3-7 | Added and referenced a real 180×180 `apple-touch-icon.png` on Home, Demo, Privacy, Terms, and 404. | `@regression:route-social-metadata`; live decoded dimensions 180×180; `live-parity.json` |
| F-3-8 | Both purchase actions now visibly say “at checkout” and expose “opens external checkout” to assistive technology. | `@claim:archive-pass-above-limit`; `@claim:merchant-refund`; live accessible-name checks in `live-findings.json` |

## Verification

- Clean clone `/tmp/photo-cull-review-polish3.NhtYX5/repo`: `npm ci` and all 21 distinct commands from `.factory/claims.json` passed separately. Every claim tag occurs exactly once.
- `npm test`: 12/12 passed. `npm run build`: passed; `dist/` contains the site root. App JavaScript is 38.46 kB raw / 14.14 kB gzip; CSS is 20.19 kB raw / 5.40 kB gzip.
- Full Playwright run: 53 passed, two intended project skips, and one Chromium process retry; the affected mobile license test then passed 1/1 in an isolated rerun.
- Playwright Axe: no serious or critical issue on Home, Demo, Privacy, Terms, or 404. `/opt/fleet/lib/verify-url.sh` passed locally and live with no home-page console errors.
- Lighthouse 13.4.1, live mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.4s, CLS 0, TBT 0ms.
- Production cold check: demo isolation/reset/export/offline pass; 200% text reflows on all routes; missing paths return the designed HTTP 404; all nine deployment artifact hashes match `dist/`.

There are no unresolved findings from Reviews 1, 2, or 3.
