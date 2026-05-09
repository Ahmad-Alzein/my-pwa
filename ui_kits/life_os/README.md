# Life OS — UI Kit (Atelier · navy)

Hi-fi recreation of the **v2** Life OS PWA, recoloured with the navy + paper-white system and extended with the new requested features:

- **Statements** sub-route under Finance — monthly + yearly archive cards, click to see breakdown by tag.
- **Multi-select bulk delete** on every finance + family list — checkbox per row, header check-all, contextual action bar appears when ≥1 row selected.
- **Family · Saving HUB** — running balance ledger between Ahmad and Mohtadi, free-form notes ("ghadi bado: 100", "1850 mom"), and bank/cash snapshots, mirroring the structure of the user's existing Notion page.

## Files
- `index.html` — entry, mounts the full prototype
- `icons.jsx` — Lucide-style 1.5-stroke SVG icon set
- `primitives.jsx` — `Card`, `Button`, `Input`, `Select`, `Segmented`, `Amount`, `Pill`, `Modal`, `Caps`, `PageTitle`, `SectionTitle`, `Checkbox`
- `data.jsx` — seed expenses, income, family ledger, family notes, snapshots
- `Sidebar.jsx` — left nav with active gutter mark + statements sub-item
- `Home.jsx` — Today dashboard
- `Finance.jsx` — Overview (with multi-select), Statements (monthly/yearly)
- `Family.jsx` — Saving HUB (ledger, notes, snapshots) — also multi-select
- `App.jsx` — router + shell

## Source of truth
Components were copied from `Ahmad-Alzein/my-pwa@main` `src/v2/*`. Behaviour and seed data follow the v2 finance/family models; visuals were re-skinned to the navy palette per request.
