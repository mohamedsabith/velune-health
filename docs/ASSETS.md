# Assets

## Photographs

The 33 photographs in `src/assets/photos/` are **stand-ins** chosen for the concept: stock photography and public-domain medical imagery, enlarged to 2048 px for sharpness. Agency logos (for example NIH, NCI and CDC marks on clothing or walls) were retouched out so no organisation appears to endorse the site.

They are registered in `src/content/images.ts`, which gives each one a key, alt text and an optional crop position. Pages refer to photos by key, so replacing one is a single file swap.

**Before a real launch:**

- Replace every photograph with the hospital's own commissioned photography, with written consent from every recognisable person (patients and staff).
- Do not present stock models as the hospital's doctors. The doctor portraits are placeholders, and so are the names.
- The source of each stand-in was not recorded in this repository. If any are kept, confirm the licence of each one first.

## Generated and original assets

| Asset                                                   | How it was made                                                                 |
| ------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Logo (`src/components/ui/Logo.tsx`, `src/app/icon.svg`) | Original SVG: a royal-blue tile with a white V and a gold plus                  |
| `src/app/opengraph-image.tsx`                           | 1200×630 social card rendered at build time with `next/og` and the site's fonts |
| Area map (`src/sections/shared/AreaMap.tsx`)            | Original SVG drawing; not a real map of Kochi                                   |
| Icons (`src/components/ui/Icon.tsx`)                    | One inline SVG sprite drawn for this site                                       |

## Fonts

Self-hosted from SIL Open Font License releases (licence in `src/fonts/LICENSE-OFL.txt`): Newsreader 400/500 for headings and Figtree 400–700 for text. No request is made to Google Fonts at build or run time.
