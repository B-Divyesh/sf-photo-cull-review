# Copy audit — 2 September 2026

Counts treat prices, file formats, and hyphenated terms as one word. No sentence below exceeds 22 words or uses a banned marketing word.

## Landing page

| Text | Words | Result |
| --- | ---: | --- |
| Opening Photo Cull Review | 4 | Pass |
| Review duplicate photos on this device | 6 | Pass |
| Clean up duplicate photos. | 4 | Pass |
| Before anything moves. | 3 | Pass |
| For households with large or crowded photo archives, compare exact copies and likely bursts before exporting a move plan. | 19 | Pass |
| Opens a four-file sample review immediately. | 6 | Pass |
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
| A one-time US$12 pass removes the 750-file scan limit. | 10 | Pass — `archive-pass-unlimited` |
| The free product handles up to 750 files. | 8 | Pass — `free-limit` |

## README and legal pages

| Text | Words | Result |
| --- | ---: | --- |
| Photo Cull Review helps households compare duplicate and burst photos before moving any files. | 13 | Pass |
| It finds exact copies and likely bursts in a folder. | 10 | Pass |
| You review each group and export a move plan. | 10 | Pass |
| It never uploads, moves, or deletes originals. | 7 | Pass — `local-only`, `csv-export` |
| It opens a four-file family archive without reading or writing your real workspace. | 13 | Pass — `demo-sandbox` |
| Checks every byte to find exact copies. | 7 | Pass — `exact-duplicates` |
| Large videos are checked in small pieces to limit memory use. | 11 | Pass — `video-streaming` |
| Compares how photos look and when the camera recorded them to suggest likely bursts. | 14 | Pass — `similar-suggestions`, `capture-time` |
| Images show previews. | 3 | Pass — `image-previews` |
| Videos are checked only for exact copies and do not show previews. | 12 | Pass — `video-streaming` |
| No server, account, or API key is required for the free experience. | 12 | Pass — `no-setup` |
| Free review contacts no other website or service. | 8 | Pass — `local-only` |
| CSV move plans and JSON workspace backups download locally. | 9 | Pass — `free-export`, `workspace-backup` |
| Start a new scan clears the saved review workspace. | 9 | Pass — `storage-controls` |

## Demo workspace

| Text | Words | Result |
| --- | ---: | --- |
| Review duplicate and burst photos | 5 | Pass |
| Start a new scan | 4 | Pass |
| These files are exact copies | 6 | Pass — `exact-duplicates` |
| IMG_2041.jpg | 1 | Pass — realistic sample item |

## Terminology

| Concept | One term used |
| --- | --- |
| Downloaded CSV instructions | move plan |
| Saved review | workspace |
| Exact matching result | exact copies |
| Cautious visual/time result | likely burst |
| Paid entitlement | Archive pass |
