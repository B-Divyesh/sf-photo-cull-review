# Independent verification 4 — FAIL

- Candidate: `70b3276248dba293802473522b6dc05689562ec8`
- Verified URL: `https://photo-cull-review.sociobot.in/`
- Demo URL: `https://photo-cull-review.sociobot.in/?demo=1`
- Date: 2026-09-01 UTC
- Result: **FAIL — do not release this candidate.**

## Release-blocking findings

### High — the desktop first screen does not show what to click first

The cold first-read check confirms that the headline names duplicate-photo cleanup and the supporting sentence names households with large or crowded archives. However, at a 1440 × 900 viewport the primary **Try it with sample data** action begins at `y=916.75` and is entirely below the first screen. The three required product facts follow it and are also below the first screen. The only visible action at the top is **Archive pass**, which is not the first step.

At 390 × 844, the sample action is visible at `y=640.72`, but the three facts start below the viewport. The desktop result independently fails the work order's mandatory first-screen acceptance rule.

Evidence: [cold desktop screenshot](verification-artifacts/live-cold-desktop.png) and [cold mobile screenshot](verification-artifacts/live-cold-mobile.png).

### High — burst timing uses file modification time, not capture time

The declared claim says suggestions are limited to photos “captured within 30 seconds,” and the review explanation says the files were “made within 30 seconds.” Source inspection confirms that grouping compares `File.lastModified`; the product does not read photo capture metadata.

A live representative check used two near-identical, non-byte-identical JPEGs. With file modification times five minutes apart, the result was **No candidates to review**. Changing only the second file's modification time to one second after the first produced a **Likely burst** group. Copying an archive can change file modification times, so the displayed reason and candidate behavior do not reliably represent when photos were captured.

Required correction: read capture metadata where available and explain the fallback, or describe and test the current file-modification-time behavior accurately.

### High — several published claims are absent from the claims inventory

`.factory/claims.json` exists, but the landing page, legal pages, and README make additional claims with no corresponding claim entry and test:

- A JSON workspace backup is restorable.
- A one-time US$19 Archive pass enables scans above the free limit.
- Video files are streamed for exact matching without whole-file memory loading or preview decoding.
- License verification is the app's only non-product-origin runtime request.

The claims contract requires each published claim to have one tagged test. These claims must be listed and tested, or the copy must be narrowed.

### High — the claim gate was not clean on its first installed run

The exact `free-limit` command timed out at Vitest's 5-second limit during the first post-install claim run. It passed when rerun alone in 1.1 seconds and passed in the full unit suite in 1.19 seconds. The first run also launched the browser claim commands concurrently, which created local preview-build contention. The isolated results below prove the behavior, but the contract states that any failing claim run blocks release. The test needs enough margin to remain deterministic under normal worker load.

## Other findings

### Medium — required route structure is incomplete

- `sitemap.xml` lists home, Privacy, and Terms, but omits the public demo URL.
- Privacy, Terms, and the designed 404 do not use the required complete shared header/footer skeleton. The legal footers also omit the factory attribution and build/version identity.

All listed routes otherwise load with correct titles, one H1, `lang="en"`, and a main landmark.

## Required claim checks

The commands were first invoked before dependency installation, as required; they could not load the repository-local Vitest and Playwright packages. After `npm ci`, every exact command was rerun. The table records the isolated results; the timing finding above records the earlier post-install timeout.

| Claim | Exact command | Isolated result |
| --- | --- | --- |
| exact-duplicates | `npm run test:e2e -- --grep @claim:exact-duplicates` | PASS — 2/2 |
| similar-suggestions | `npm test -- --testNamePattern @claim:similar-suggestions` | PASS — 1/1 |
| csv-export | `npm run test:e2e -- --grep @claim:csv-export` | PASS — 2/2 |
| workspace-persistence | `npm run test:e2e -- --grep @claim:workspace-persistence` | PASS — 2/2 |
| offline-reload | `npm run test:e2e -- --grep @claim:offline-reload` | PASS — 2/2 |
| local-only | `npm run test:e2e -- --grep @claim:local-only` | PASS — 2/2 |
| demo-sandbox | `npm run test:e2e -- --grep @claim:demo-sandbox` | PASS — 2/2 |
| free-limit | `npm test -- --testNamePattern @claim:free-limit` | PASS on isolated rerun — 1/1; first installed run timed out |

## Repository and production build

```text
npm ci                         PASS — 60 packages; 0 vulnerabilities
npm test                       PASS — 6/6
npm run test:e2e               PASS — 17 passed; 1 intentional project skip
npm run build                  PASS — strict tsc --noEmit + Vite; dist/ created
npm audit --audit-level=high   PASS — 0 vulnerabilities
git diff --check               PASS before report edits
```

There is no separate lint command. Type checking is part of the production build.

## Independent product checks

### Main workflow and recovery

- Confirmed the one-click sample opens a four-file review workspace with one exact group and one similarity suggestion.
- Confirmed keyboard decisions across both groups, the completed-plan state, a two-row CSV manifest, and demo reset.
- Confirmed the CSV identifies itself as a plan and includes source path, proposed review path, byte count, complete hash, group type, and reason.
- Confirmed a folder containing only `notes.txt` gets a supported-format explanation and next step.
- Confirmed malformed workspace JSON gets a product-specific message and leaves the review desk usable.
- Confirmed the 750/751 free boundary through the declared unit test.

### Accessibility and responsive behavior

- The factory URL checker passed: HTTP 200, 883 ms load, title, `lang`, one H1, main landmark, image alternatives, named buttons, and no landing console/page errors.
- Axe 4.13.0 found zero serious or critical issues on home, populated demo, Privacy, Terms, and the designed 404.
- Desktop and 390 px mobile had no horizontal overflow at normal text size. A desktop 200% text-size check also had no horizontal overflow on home, demo, Privacy, or Terms.
- Keyboard Tab order reaches the skip link, home, Archive pass, sample action, and folder action. A focused home link showed a designed 3 px red outline; [focus evidence](verification-artifacts/focus-brand-reduced.png).
- K/R/arrow review controls work. The license dialog receives focus on open, closes with Escape, and returns focus to its trigger.
- Reduced-motion mode reports `scroll-behavior: auto`, removes the hero animation, and keeps the interface usable.
- Visible mobile controls meet the 44 px target check; the hidden one-pixel file inputs have visible labeled button controls.

### Privacy, headers, and links

- During the full live demo review, export, and reset, every request used `https://photo-cull-review.sociobot.in`. No photo, thumbnail, hash, or decision request left the product origin.
- The live page, JS, CSS, worker, manifest, and 404 responses include the expected CSP, HSTS, `nosniff`, strict referrer policy, Permissions-Policy, COOP, CORP, and frame restriction headers.
- All discovered same-origin links returned 200. The separate missing-route check returned the designed page with HTTP 404; Chromium logged the expected 404 resource line for that deliberate request.
- The candidate has no sign-in path and no product-owned server endpoint. The external billing service was not contacted because the work order permits connections only to the `sf-photo-cull-review` product resource. Therefore, a product API request allowance is not applicable here.

### PWA and deployment identity

- Confirmed an activated, controlling `/sw.js`, `photo-cull-shell-v5` with 19 cached requests after demo navigation, and no waiting worker after `registration.update()`.
- Confirmed an offline reload retained the demo workspace and showed: “Offline — your saved review is still available on this device.”
- Confirmed `sw.js` is served with `no-cache, no-store, must-revalidate`; immutable JS/CSS receive one-year caching; the manifest has the correct MIME type.
- Confirmed all 22 deployable files from a fresh `dist/` build match the live bytes by SHA-256. The live deployment therefore matches candidate `70b3276248dba293802473522b6dc05689562ec8`.

### Performance

- Lighthouse 13.0.1 mobile: Performance 95, Accessibility 100, Best Practices 100, SEO 100.
- Lighthouse metrics: FCP 1.5 s, LCP 1.8 s, TBT 240 ms, CLS 0, Speed Index 1.5 s.
- A mobile review interaction measured a 24 ms Event Timing duration and no long tasks.
- Initial JS: 32,497 B raw / 12,269 B gzip. CSS: 15,480 B raw / 4,592 B gzip. Local font: 56,976 B. Mobile hero: 37,170 B. All are within budget.

## Required next steps

1. Keep the sample action and three product facts inside the first desktop screen.
2. Base burst timing on capture metadata or accurately explain and test the timestamp being used.
3. Add claim entries and tagged tests for the published backup, paid-limit, video-streaming, and network-behavior statements, or narrow those statements.
4. Make the free-limit claim test reliable within its configured timeout.
5. Add the demo URL to the sitemap and bring legal/404 pages into the required shared route skeleton.
