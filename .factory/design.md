# Photo Cull Review — visual thesis

## Direction: the impossible contact sheet

Photo cleanup is emotionally closer to editing a family contact sheet than running a disk utility. The product uses **surreal editorial scenery**: a quiet, moonlit archive room where oversized photographic slides stand like doorways and a red review thread leads safely between them. The scene explains the promise—look, compare, decide—without implying automatic deletion. It appears only at the welcome threshold; the review workspace becomes a calm, precise light table.

## Palette

The palette comes from a darkroom: near-black ink `#171713`, warm paper `#F4EEDC`, vellum `#E8DEC5`, safe-green `#316B55`, review-red `#B53A2F`, amber `#8B5A16`, and blue-black `#24384A`. Warm paper reduces the sterile “utility dashboard” feel; darkroom red marks action, never identity. The product is explicitly single-mode—warm editorial paper—because color judgments should not be altered by a theme switch. Every background is painted explicitly. Text contrast is at least 4.5:1; state also has text and symbols.

## Type and spacing

Headlines use self-hosted **Newsreader** (OFL, serif, editorial selection notes); controls and body use the platform sans stack for familiar utility ergonomics and zero extra font cost. One locally subset Newsreader WOFF2 is kept below 60 KB. Type steps: 14, 16, 20, 28, and clamp(40–68) px. Body leading is 1.55 and measures stay under 72 characters. Spacing follows a 4/8 px rhythm with 12, 16, 24, 32, 48, and 72 px landmarks.

## Composition and interaction grammar

Images sit in cream mounts with ink hairlines, never generic floating cards. Exact duplicates carry a square “same bytes” stamp. Similar bursts carry a softer circular “looks related” stamp and a plain-language explanation. The primary journey is linear: choose folder → inspect groups → mark keep/review → export manifest. Keyboard decisions use K (keep), R (review), S (skip), and arrow keys. All shortcuts have visible button equivalents. Decisions feel like moving a print across a light table: 180 ms transform/opacity, originating from the selected item.

At 390 px, the brand and navigation use separate rows so every target keeps a 44 px edge and 8 px separation. “How it works” and “Archive pass” become the compact visible labels “How” and “Archive”; their accessible names stay complete. Review decisions stack at narrow widths so the light-table cards continue to reflow when text is enlarged to 200%.

## Motion policy

Only three transitions move: the hero contact sheets settle once, a selected print lifts by 2 px, and progress bars expand. Durations are 160–240 ms with ease-out. Nothing loops. Under `prefers-reduced-motion: reduce`, transforms and smooth scrolling are removed and updates become immediate opacity/state changes.

## Asset plan and provenance

Hero prompt, 2026-08-28, generated with the factory Azure image model (`factory-image`):

> Wide surreal editorial illustration of a moonlit photographic archive room, enormous blank photo slides standing upright like doorways across warm paper-colored dunes, a single thin vermilion review thread safely connecting them, one tiny brass desk lamp, tactile cut-paper and matte gouache materials, deep charcoal sky, warm ivory, muted sage, oxblood red, calm trustworthy mood, wide 3:2 composition, sophisticated magazine illustration, no people, no text, no letters, no logos, no watermark, no brands, no UI, no camera branding.

Negative direction: glossy 3D SaaS render, neon gradient, photoreal people, faces, readable writing, logos, copyrighted characters, deletion/trash imagery. Candidate is reviewed for accidental text, symbols, seams, and palette fit. Shipping derivatives are local WebP/AVIF with explicit dimensions and under 300 KB. Source PNG and prompt sidecar remain in `assets/src/`. App icons are hand-authored SVG-derived darkroom apertures; no external icon set. Generated imagery is disclosed in the footer.

The 1200×630 social preview is a deterministic center crop of the reviewed source illustration, made on 2026-08-30 with ImageMagick; no new imagery or text was added. The demo’s picnic and sparkler previews are hand-authored SVG scenes created for this product on 2026-08-30. They use the darkroom palette, contain no brands or text, and are not presented as user photographs.
