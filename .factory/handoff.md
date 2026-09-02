# Photo Cull Review — adversarial review 4 handoff

## Result

**FAIL** for candidate `1fbb79ad5f8900124cf4a20c5519c1f6713edb88` at
<https://photo-cull-review.sociobot.in/> on 2026-09-02.

Adversarial first-read review found one blocking mobile demo regression. No
product code was modified. The complete report is `.factory/review-4.md`.

## Finding to repair

- **F-4-1 (reopens F-2-1):** at 390 × 844, the visible route
  announcement covers the first sample filename and Keep/Move controls for 4.2
  seconds. Keep h1 focus and the polite announcement, but make the live region
  visually hidden or otherwise non-obscuring. Add an immediate
  `elementFromPoint` occlusion assertion to the demo first-viewport regression.

## What passed

- Cold first read passes at 390 × 844 and 1440 × 900.
- Every landing and README sentence is at most 22 words; no jargon, banned
  marketing term, inconsistent product term, or weak action remains.
- All 21 claim commands pass independently from a clean clone, and every claim
  tag occurs in exactly one test. No unlisted claim was found.
- Demo reset, real-work isolation, same-origin free requests, populated offline
  reload, CSV export, and error recovery pass.
- Titles, metadata, 404, deep links, Back, h1 focus, link crawl, headers,
  200% reflow, reduced motion, and 44 px targets pass.
- Axe reports zero serious/critical results on Home, Demo, Privacy, Terms, and
  404. The visual identity remains distinct and product-specific.
- Every earlier finding except F-2-1 remains fixed on the live site and in the
  current source/tests.

## Reproduce

```sh
npm ci
npm test
npm run build
npm run test:e2e
QA_BASE_URL=https://photo-cull-review.sociobot.in \
  QA_EVIDENCE_DIR=/tmp/review4-live-qa \
  node .factory/live-qa.mjs
```

To reproduce the blocker, open Home in a fresh 390 × 844 browser context,
choose **Try it with sample data**, and inspect the first filename and Keep
control immediately after navigation. The toast spans y=741.31–824.00 and is
returned by `elementFromPoint()` at both centers until its 4.2-second timer
expires.

## Known gaps and next steps

Repair and deploy F-2-1, then rerun the complete adversarial review. The zero-
finding acceptance standard is not met until the immediate mobile demo control
is unobscured.
