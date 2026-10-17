# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

"Chiao 的蟻丘 / Chiao's Anthill" is a static, multi-page personal portfolio site. It collects Chiao's writing about art and fintech so it isn't scattered across platforms. It's plain HTML, one shared `style.css`, and one shared `script.js`. There's no build step, no package manager, no framework, and no tests.

## Running it

Open `index.html` directly in a browser, or serve the folder:

```bash
python3 -m http.server 5173
```

The Google Fonts stylesheet loads over the network, so the typography falls back to system fonts when offline.

## Architecture

**Pages.** There are four pages: `index.html`, `about.html`, `writing.html` and `contact.html`. Each one contains its own copy of the `<head>`, the header/nav, the footer and the toast element. No include or templating system exists, so a change to the nav, footer, fonts link or `<head>` must be made in all four files. Each page marks its own nav link with `aria-current="page"`.

**Bilingual zh/en content.** Both languages are in the markup at the same time, and CSS hides one of them:
- Text pairs are siblings marked `data-l="zh"` and `data-l="en"`. `style.css` hides the inactive language based on `html[data-lang]`.
- Attributes that can't hold markup get swapped by `script.js` `applyLang()`:
  - `<html data-title-zh/en>` for the document title
  - `data-ph-zh/en` for input placeholders
  - `data-text-zh/en` for `<option>` text
  - `data-aria-zh/en` for aria-labels
- The choice is stored in `localStorage` under the key `lang`. A one-line inline script in each `<head>` applies it before the page paints, so there's no flash of the wrong language. Every new piece of user-facing text needs both languages.

**Display typography.** Headings use the `.display` class. Chinese headings use Noto Sans TC 900. Dela Gothic One is used only when the page is in English (`html[data-lang="en"] .display`) or through the `.latin` class. Dela contains Japanese kanji glyphs, and applying it to Chinese text would mix glyph styles. Body text uses Nunito, which has no CJK glyphs, followed by Noto Sans TC for the Chinese characters.

**Mascot animation.** The home hero is the site's single orchestrated motion moment: an inline SVG of Kui the anteater (`svg.anteater`). The animation runs whenever a `.is-slurping` class is added to a `[data-slurp]` container. With `data-slurp="auto"` it plays on load, and clicking `.mascot-btn` replays it. The tongue uses a stroke-dash animation and the ant (`.ant-prey`) uses translate values in SVG user units. Under `prefers-reduced-motion` the tongue is hidden and the animation never runs. The about and contact pages reuse the same SVG without the tongue or ant.

**Page-specific behavior in `script.js`.** All of these are guarded, so they do nothing on pages that lack the elements:
- Writing filters: `.filter[data-filter]` buttons toggle `li[data-cat]` items in `.archive`.
- Copy-to-clipboard: `[data-copy]` buttons copy their value and show a toast.
- Contact form: `#contact-form` validates the required fields, then builds a `mailto:` link to its `data-to` address. There is no backend.

## Content status

- Every article is a placeholder with `href="#"` and is flagged on the page with a "示意文章 / Sample" note.
- Only the art category exists. The Fintech and AI agent filters are `disabled` "即將上線 / coming soon" buttons; enable them once real articles exist.
- The owner chose not to include an experience/resume section, testimonials, a services page or social links.

## Design constraints (from the owner's brief)

- **Style:** Japanese Retro Pop, Heisei Y2K, Kitsch and playful editorial design.
- **Palette:** use only these colors, defined as tokens in `:root`:

  | Token | Color | Role |
  |---|---|---|
  | `--bg` | `#EFF0F3` | Background |
  | `--ink` | `#0D0D0D` | Headlines and strokes |
  | `--text` | `#2A2A2A` | Body text |
  | `--orange` | `#FF8E3C` | Primary CTA and highlights |
  | `--white` | `#FFFFFE` | Cards |
  | `--berry` | `#D9376E` | Small decorations only |

  Don't introduce any other high-saturation colors.
- **Components:** use thick black outlines and flat color fills, with hard offset "pop" shadows (`--pop`) instead of soft shadows. Don't use gradients, glassmorphism or corporate-tech blue.
- **Labels:** avoid all-caps eyebrow labels and `→` arrows in button text. Numbered markers are used only for the real sequence on the about page (the four process steps).
- **Floor for every change:** responsive down to 375px with no horizontal scroll, visible `:focus-visible` styles, and `prefers-reduced-motion` support.
