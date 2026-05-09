# Life OS — Atelier Design System

A personal life-OS dashboard combining task management, finance tracking, family ledger, and learning logs. Originally a PWA at `Ahmad-Alzein/my-pwa` (the Atelier v2). This design system documents the visual language, codifies tokens for a **white + dark blue** repaint, and packages reusable JSX primitives plus a clickable UI kit.

## What's in this project

| Path | Purpose |
| --- | --- |
| `README.md` | This document |
| `colors_and_type.css` | Color + type tokens (light + dark, navy palette) |
| `SKILL.md` | Agent skill manifest — usable in Claude Code |
| `assets/icons/` | Brand icon (the "A" mark) |
| `fonts/` | (Webfonts loaded from Google Fonts; no local TTFs needed) |
| `preview/` | Design-system swatch + spec cards (registered for the Design System tab) |
| `ui_kits/life_os/` | Hi-fi clickable recreation of the Atelier app |
| `src/v2/*.jsx` | Original source — imported from upstream for reference |

## Product context

**Life OS** ("Atelier") is a single-user personal dashboard. The owner uses it as a daily workspace covering five surfaces:

- **Home** — greeting, focus queue, week rhythm, recent activity
- **Tasks** — inbox/today/projects with priorities (P0–P3) and Jira refs
- **Finance** — overview, expenses, income, savings (multiple goal accounts)
- **Family** — a separate ledger for IOUs / shared spend with a sibling ("Mohtadi"); pulled from the user's Notion *Saving HUB* page
- **Learn** — coursework with progress + study minutes

The aesthetic is **editorial-meets-software**: serif display headlines (Playfair Display) sit on quiet sans-serif body (DM Sans), with monospace numbers (IBM Plex Mono). The original used a warm "Atelier" palette (cream + terracotta accent). **This design system replaces the warm palette with white + dark blue** while preserving every other aspect of the visual language.

## New features in this revision

These are documented in the UI kit:

1. **Monthly + yearly statements** — Finance has new `Statements` tab with month/year toggles; archived periods nest in a `finance/statements/<period>/` view.
2. **Multi-select delete** — Expense, Income, Family-ledger and Savings rows expose a checkbox column when in *Select* mode; a sticky bulk-action bar appears at the bottom with "Delete selected" / "Cancel".
3. **Family Ledger** — already wired to the Saving HUB pattern (Mohtadi tags: Rent/Housing, Groceries, Utilities, Healthcare, Transportation, Education, Gift/Support, Loan Repayment, Other). See `src/v2/data.jsx`.
4. **Navy repaint** — `--accent` is now `#1E3A8A` (light) and `#6E94E0` (dark). All other tokens migrated.

## Sources

- **Codebase** — `Ahmad-Alzein/my-pwa@main` (imported into `src/`, `assets/`, plus root `Life OS v2.html`).
- **Notion** — *Saving HUB* (https://www.notion.so/Saving-HUB-19b54e03a5478046b8a9d51bb084e72b) — referenced patterns: tags, snapshot reconciliation, IOU notes. Already mirrored in `src/v2/data.jsx` (`SEED_FAMILY_TX`, `SEED_FAMILY_SNAPSHOTS`, `SEED_FAMILY_NOTES`).
- **Fonts** — Google Fonts (Playfair Display, DM Sans, IBM Plex Mono). Loaded via CDN; no local files required.

---

## CONTENT FUNDAMENTALS

**Voice.** First-person and personal — the app is owned by a single person ("Ahmad's Life OS"). UI copy uses short, declarative sentences. The owner is *you* in actions ("Log expense", "View all"); the system is impersonal in headers and section titles.

**Casing.** Sentence case throughout — never Title Case. Eyebrow labels use UPPERCASE with `letter-spacing: 0.08em` and `font-size: 11px`. Examples:
- Page title: "Family ledger" (not "Family Ledger")
- Eyebrow: "RECONCILIATION", "WHERE IT WENT", "TRAIL"
- Buttons: "Log expense", "New entry", "View all"

**Tone.** Calm, considered, slightly literary. The empty-state copy reads almost like a journal:
> *"A clear afternoon."*  
> *"Nothing due today."*

Section eyebrows are evocative single nouns: *Trail*, *Rhythm*, *Flow*, *Reserves*, *Ledger*. Avoid corporate-software clichés ("Dashboard", "Manage your finances", "Get started").

**Mixed-language content is fine.** The owner's notes mix English, French and Arabic transliteration ("ghadi bado: 100", "envoi espèces"). Don't sanitize — preserve the multilingual, idiosyncratic character.

**Numbers.** Always tabular monospace (`IBM Plex Mono`, `font-variant-numeric: tabular-nums`). Currency is `€`, prefix-style: `€62.40`. Negatives use the typographic minus `−`, not hyphen. Locale `fr-FR` for thousands separators ("4 120,00 €"… we display as `€4,120` in the app — French-leaning data, English-leaning UI is fine).

**Emoji.** Effectively never. Status uses colored dots (`<Dot>`), not emoji. The one exception is a single check ✓ inside the day-rhythm bars.

**Date formatting.** ISO (`2025-04-21`) for monospace contexts (tables, raw data). Long form (`Monday, 21 April`) for greetings. Relative (`Today`, `Yesterday`, `2d ago`, `in 3d`) for activity feeds.

---

## VISUAL FOUNDATIONS

**Color philosophy — navy + paper white.** A two-temperature system: cool warm-whites (`#FAFBFD` page, `#FFFFFF` raised) for surfaces, dark navy (`#0E1A2B` ink, `#1E3A8A` accent) for emphasis. Semantic colors (success / warning / danger / info) are muted and slightly desaturated so they coexist with the navy without shouting. Dark mode flips into deep navy (`#0A1322`) with light navy accent (`#6E94E0`).

**Typography.**
- Serif (`Playfair Display`) for page titles and section h2s — *only* at the top of compositions. Never inside dense tables or sidebars.
- Sans (`DM Sans`) for everything else — body, navigation, buttons.
- Mono (`IBM Plex Mono`) for numbers, dates, IDs, keyboard hints.
- Three sizes for headings (32 / 22 / 18), body at 14, fine print at 11–13.
- Letter-spacing: `-0.02em` on h1, `-0.01em` on h2/numbers, `0.08em` uppercase on eyebrows.

**Spacing.** 8-point grid. Tokens: 4 / 8 / 16 / 24 / 32 / 48 / 64. Pages get 48px outer padding; cards get 24–32px internal padding. Stat-card grid auto-fits at min 220px column.

**Backgrounds.** Predominantly flat paper white. The `--paper-grain` token exists as a navy-tinted SVG noise overlay at ~3% opacity for hero surfaces, used sparingly. **No** full-bleed photography, **no** gradients beyond a single radial-soft glow on the family-ledger hero (`radial-gradient(circle, var(--accent-soft) 0%, transparent 70%)`). **No** repeating patterns or hand-drawn illustrations.

**Animation.** Restrained.
- Theme switch: 300ms `ease`
- Modal enter: `slide-up` 250ms `cubic-bezier(0.25, 0.1, 0.25, 1)`, opacity fade 150ms
- Hover state changes: 150ms
- Bar/progress fill: 500ms
- No bounces, no parallax, no auto-playing motion.

**Hover states.** Buttons darken (`--accent` → `--accent-hover`) or fill with soft accent (`--accent-soft`). Cards raise from `--shadow-sm` to `--shadow-md`. Nav rows shift background to `--bg-tertiary`. No scale, no glow.

**Press states.** No explicit shrink; the color shift is the affordance. Active routes show a 2px navy bar in the gutter (left of the nav button, `top: 8px; bottom: 8px; border-radius: 2px`).

**Borders.** 1px solid `--border` (`#C9D2DF` light, navy-mute dark). Soft variant `--border-soft` for nested separators (table rows, list items). Borders are always 1px — never 2 or 0.5.

**Shadows.** Three levels (`--shadow-sm` / `--shadow-md` / `--shadow-lg`). Composed of two layers (a soft tall + a tight close), tinted with navy ink (`rgba(14, 26, 43, …)`). Modals get `--shadow-lg`; cards rest at `--shadow-sm` and lift to `--shadow-md` on hover.

**Capsules > protection gradients.** Where labels overlay color (priority pills, status chips, savings badges) we use solid soft-tinted capsules (`bg: var(--*-soft)`, `color: var(--*)`, `border: 1px solid var(--*-soft)` or transparent). Never a gradient overlay.

**Layout rules.** Sidebar fixed at 240px (collapses to 68px). Page container max-width 1280px, centered. Stat-card grids `repeat(auto-fit, minmax(220px, 1fr))` with 20px gap. Two-column splits use `1.4fr 1fr` (primary / secondary) or `1fr 1fr` (equal pair).

**Transparency + blur.** Only on modal backdrops: `rgba(20,19,18,0.4)` with `backdrop-filter: blur(4px)`. Nothing else uses transparency or blur.

**Imagery.** None in the product. Brand identity is typographic — the "A" monogram in a 32×32 `--accent` square, white serif glyph. No stock photography, no illustrations.

**Corner radii.** `--radius-sm` 6 (pills, small inputs), `--radius-md` 8 (buttons, fields), `--radius-lg` 12 (cards, modals), `--radius-xl` 16 (mobile bottom-sheet handle / hero containers).

**Cards.** Rounded 12px, 1px soft border, `var(--shadow-sm)`, 24–32px internal padding. The "raised" variant uses `--bg-raised` (pure white) instead of `--bg-secondary`. Hover lifts shadow only — no color shift.

---

## ICONOGRAPHY

The codebase ships its own minimal **Lucide-style line icon set** at `src/v2/icons.jsx` — a single `<Icon name="…" />` component drawing from a path map. ~30 icons total, drawn with:

- 24×24 viewBox
- 1.5 stroke width (configurable via `stroke` prop)
- `stroke-linecap: round`, `stroke-linejoin: round`
- `fill: none`, color `currentColor`
- Default size 18px

Available names: `home, check, tasks, wallet, book, users, sun, moon, plus, x, arrowRight, arrowUp, arrowDown, chevronRight, chevronDown, search, settings, bell, calendar, filter, trendUp, clock, circle, circleCheck, circleDot, alert, heart, edit, trash, sparkle, menu, phone`.

**No icon font, no SVG sprite** — paths are JSX fragments inlined per render. Tradeoff: small bundle, easy to extend; not the most efficient at large repeat counts.

**Brand mark.** A single SVG (`assets/icons/life-os-icon.svg`) plus rasterized 180/192/512px PNGs for PWA install. The mark renders large in the manifest theme but is rarely shown inside the app — instead, a CSS-drawn 32×32 navy square with a serif "A" stands in.

**Emoji.** Not used.

**Unicode glyphs.** Three intentional uses: typographic minus (`−`) in negative amounts; thin-space separators in long currency strings; ✓ in day-rhythm bars.

**Substitutions.** The icon set is in-repo, so nothing is substituted. Lucide React is the closest CDN equivalent if a downstream consumer wants the same vocabulary.

---

## INDEX (manifest)

- **README.md** *(this file)*
- **SKILL.md** — agent skill metadata
- **colors_and_type.css** — token sheet (light + dark)
- **assets/icons/** — brand mark assets
- **preview/** — Design System tab cards
- **ui_kits/life_os/** — clickable hi-fi recreation; start at `index.html`
- **src/v2/** — original source from upstream (reference only)
