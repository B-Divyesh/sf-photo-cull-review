# Copy audit — 2 September 2026

Counts treat prices, file formats, and hyphenated terms as one word. No product
sentence exceeds 22 words. No banned marketing word remains in visitor copy.

## First screen and landing page

| Text | Words | Result |
| --- | ---: | --- |
| Review duplicate photos on this device | 6 | Pass |
| Clean up duplicate photos. | 4 | Pass |
| Before anything moves. | 3 | Pass |
| For households with large or crowded photo archives, compare exact copies and likely bursts before exporting a move plan. | 19 | Pass |
| Try it with sample data | 5 | Pass |
| Opens a four-file sample review in this browser. | 9 | Pass — `demo-sandbox` |
| Choose your photo folder | 4 | Pass |
| Photos stay on this device | 5 | Pass — `local-only` |
| Works offline after the first visit | 6 | Pass — `offline-reload` |
| Free for up to 750 files | 6 | Pass — `free-limit` |
| The app creates a move plan and does not move photos. | 11 | Pass — `csv-export` |
| Review duplicate and burst photos in three steps. | 8 | Pass |
| Find exact copies and likely bursts | 6 | Pass |
| The app checks every byte to find exact copies. | 9 | Pass — `exact-duplicates` |
| It compares photos and capture times to suggest likely bursts. | 10 | Pass — `similar-suggestions` |
| See why files were grouped. | 5 | Pass — `group-explanations` |
| Mark each one keep or move to review; suggestions never become facts. | 12 | Pass |
| Download a CSV move plan for a separate review folder. | 10 | Pass — `csv-export` |
| Your source archive remains untouched. | 5 | Pass — `csv-export` |
| Free for folders up to 750 supported files. | 8 | Pass — `free-limit` |
| A one-time US$12 pass scans folders above the 750-file free limit. | 11 | Pass — `archive-pass-above-limit` |
| Buy Archive pass at checkout | 5 | Pass — destination is explicit |

## Demo, scan, license, and error states

| Text | Words | Result |
| --- | ---: | --- |
| Demo — sample data, separate from your workspace | 7 | Pass |
| Changes stay only in this sample. | 6 | Pass |
| Reset demo | 2 | Pass |
| Start for real | 3 | Pass |
| Review duplicate and burst photos | 5 | Pass |
| 4 files are ready to review on this device. | 10 | Pass — `demo-sandbox` |
| Checking photos for copies and likely bursts. | 7 | Pass |
| Keep this tab open. | 4 | Pass |
| File checks and small previews stay on this device. | 9 | Pass — `local-only` |
| Scan folders above the 750-file free limit for US$12 once. | 10 | Pass — `archive-pass-above-limit` |
| The free product scans up to 750; choose a smaller folder or buy an Archive pass. | 15 | Pass — `free-limit` |
| Exporting your move plan is always free. | 7 | Pass — `free-export` |
| Return to photo review | 4 | Pass |

### Conditional status and recovery copy

| Text | Words | Result |
| --- | ---: | --- |
| This device has an active archive pass. | 7 | Pass |
| We could not recheck this Archive pass. | 7 | Pass |
| Its last successful check remains active. | 6 | Pass |
| We could not verify this license. | 6 | Pass |
| Free limits remain active. | 4 | Pass |
| Check your connection and try again. | 6 | Pass |
| This license is no longer active. | 6 | Pass |
| Free limits are in use. | 5 | Pass |
| That license is no longer active for this product. | 9 | Pass |
| Check the token and try again. | 6 | Pass |
| No supported photos or videos were found. | 7 | Pass |
| Choose a folder containing JPEG, PNG, WebP, GIF, BMP, MP4, MOV, M4V, or WebM files. | 15 | Pass |
| No exact copies or visually close photos with embedded camera capture time were found. | 14 | Pass |
| Nothing has been moved or changed. | 6 | Pass |
| Export the move plan, inspect it, and use your file manager to make the moves. | 15 | Pass |
| That file is not a Photo Cull Review backup. | 9 | Pass |
| Choose a valid JSON backup exported from Photo Cull Review. | 10 | Pass |
| An update is ready. | 4 | Pass |
| Reload to use it. | 4 | Pass |

## README and legal pages

| Text | Words | Result |
| --- | ---: | --- |
| Photo Cull Review helps households compare duplicate and burst photos before moving any files. | 14 | Pass |
| It finds exact copies and likely bursts in a folder. | 10 | Pass |
| You review each group and export a move plan. | 9 | Pass |
| It never uploads, moves, or deletes originals. | 7 | Pass — `local-only`, `csv-export` |
| It opens a four-file family archive without reading or writing your real workspace. | 13 | Pass — `demo-sandbox` |
| Checks every byte to find exact copies. | 7 | Pass — `exact-duplicates` |
| Large videos are checked in small pieces to limit memory use. | 11 | Pass — `video-streaming` |
| Compares how photos look and when the camera recorded them to suggest likely bursts. | 14 | Pass — `similar-suggestions`, `capture-time` |
| Your review survives refreshes and remains available offline. | 8 | Pass — `workspace-persistence`, `offline-reload` |
| Exports a CSV move plan and a restorable JSON workspace backup. | 11 | Pass — `csv-export`, `workspace-backup` |
| Folders with up to 750 supported files are free. | 9 | Pass — `free-limit` |
| A validated one-time US$12 Archive pass scans folders above that limit. | 11 | Pass — `archive-pass-above-limit` |
| No server, account, or API key is required for the free experience. | 12 | Pass — `no-setup` |
| Free review contacts no other website or service. | 8 | Pass — `local-only` |
| With a supplied license token, verification is the app’s only outside request. | 12 | Pass — `license-verification-request` |
| Start a new scan clears the saved review workspace. | 9 | Pass — `storage-controls` |

## Terminology

| Concept | One term used |
| --- | --- |
| Downloaded CSV instructions | move plan |
| Saved review | workspace |
| Exact matching result | exact copies |
| Cautious visual/time result | likely burst |
| Paid entitlement | Archive pass |
