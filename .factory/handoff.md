# Photo Cull Review — verification 11 handoff

## Result

**FAIL** for candidate `dd405cb64a5d37b16d7ce0bfdb473262a1160abe`
at <https://photo-cull-review.sociobot.in/>.

Independent verification found one medium, release-blocking accessibility
defect: at 390 px the Privacy contact link measures 92.5 × 20 px, while the
Archive-pass dialog Terms and Privacy links measure 37.7 × 15 px and
46.3 × 15 px. The supplied baseline requires every touch target to be at least
44 × 44 px. The external contact link also does not identify itself as an
external destination.

Full evidence and the repair requirement are in
[`verification-11.md`](verification-11.md).

## Verification summary

- All 21 commands in `.factory/claims.json`: PASS.
- `npm ci`: PASS, 0 audit vulnerabilities.
- `npm test`: PASS, 12/12.
- `npm run test:e2e`: PASS, 54 passed and 2 intentional skips.
- `npm run build`: PASS; TypeScript passed and `dist/` was produced.
- Live deploy parity: all 24 public build artifacts byte-match the candidate.
- First-read and one-click isolated demo: PASS on desktop and 390 × 844.
- Live sample review/export/reset and invalid-input recovery: PASS.
- Privacy request log and response security/caching headers: PASS.
- PWA control, update check, and offline reload: PASS.
- Axe serious/critical findings: 0 across all public routes.
- Verification API allowance: requests 1–30 returned 200; request 31 returned
  429 with `Retry-After: 4`.
- Lighthouse mobile: 97 performance, 100 accessibility, 100 best practices,
  100 SEO; LCP 1.50 s and CLS 0.

## Required next step

Increase the three visible mobile link hit areas to at least 44 × 44 px,
identify `sociobot.in` as external, and add a regression check for every
visible mobile target in the legal page and license dialog. Then rerun all
claims, the complete browser suite, and the live 390 px measurement.

No product code, deployment, infrastructure, DNS, storage, secrets, or other
resources were changed during this verification.
