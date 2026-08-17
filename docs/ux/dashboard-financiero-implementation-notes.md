# Dashboard financiero Implementation Notes

## Status

- Implemented: 2026-07-23.
- Visual correction: 2026-07-28.
- Target: `skill-flow-test/next-sandbox`.
- Source contract: `./dashboard-financiero-ui-handoff.md`.
- Result: dashboard financiero gráfico de una sola pantalla, integrado al shell y restringido al usuario administrador.

## Correction Applied

The 2026-07-28 user correction is the highest-priority contract for this iteration.

- The desktop dashboard no longer grows beyond the available application height.
- Removed the five-card KPI strip, the separate alerts report, duplicated aging sections, rankings below the fold and the long availability footer.
- Kept only the six reports visible in the legacy dashboard: customers, suppliers, unpaid customer invoices, unpaid supplier invoices, availability and result.
- Totals now live inside the report that produces them instead of forming a separate KPI layer.
- The layout is a four-column, two-row desktop grid:
  - row 1: Customers / Result (double width) / Suppliers;
  - row 2: Unpaid customer invoices / Availability (double width) / Unpaid supplier invoices.
- Customer and supplier reports use compact horizontal rankings.
- Result uses an area/line chart as the dominant visual.
- The two unpaid-invoice reports use segmented donut charts with exact percentages and overdue totals.
- Availability uses type composition bars and account balance bars.
- Header, filters, freshness and utility actions were condensed into one row.
- Header selects, badges and utility buttons share the standard 32 px control height.
- The centered `1760px` maximum width was removed on 2026-07-28. The dashboard now consumes the shell width with a uniform 20 px gutter on all four sides.
- On mobile, `Disponibilidades` now keeps the natural height of its composition and account sections instead of shrinking both into the desktop card height; bars, account names, balances and freshness labels no longer overlap.

## User Correction Versus Original Handoff

- The handoff prohibited donut charts for aging.
- The current user explicitly supplied a donut reference and requested ultra-visual components while preserving only legacy reports.
- Following source precedence, the user correction overrides that visualization restriction. Donuts are used only for the two legacy unpaid-invoice distributions; no new report or accounting semantic was introduced.
- The previous alerts module and net-position KPI were removed because they were not reports visible in the legacy dashboard.

## shadcn Components Used

- `Badge`
- `Button`
- `Card`
- `ChartContainer` and `ChartTooltip`
- `Checkbox`
- `Popover`
- `Select`
- `Sheet`
- `Table`

Charts are composed with Recharts `Area`, `Line`, `Pie`, axes, grid and reference line through the existing shadcn chart substrate.

## Design System Applied

- Primary blue: existing `--primary` / `#0057FF`.
- Page, panel, border and muted colors: existing CSS variables.
- Operational radius: 4 px.
- Compact desktop gaps: 10 px; panel padding: 12-14 px.
- Numeric and metadata labels: existing `font-mono` token.
- Main copy: existing `font-sans` token.
- Status colors remain paired with text labels and percentages.
- Dark and light behavior is inherited from the shell.

No global styles or design tokens were modified.

## Product Context Applied

- Dashboard remains an admin-only, read-only `Consulta y reporte` surface.
- Admin home remains Facturación rápida.
- Seller access remains unchanged.
- Company, business unit, period and currency remain global filters.
- Exact values remain available through contextual Sheets.
- No collect, pay, edit, post or other financial mutation exists in the dashboard.

## Information Traceability

- Legacy customer list and total → `Clientes` ranking.
- Legacy supplier list and total → `Proveedores` ranking.
- Legacy unpaid customer invoice distribution → customer donut and legend.
- Legacy unpaid supplier invoice distribution → supplier donut and legend.
- Legacy availability list and total → type and account bars.
- Legacy result graph/list → dominant result chart and detail Sheet.
- Legacy per-module update timestamps → one compact freshness state in the header.
- Legacy company and unit scope → compact global filters.
- `$Tot A$`, unknown dots, repeated calculate links and contact data remain outside the primary screen.

## Assumptions And Gaps

- Aging labels and thresholds remain demonstration values.
- Customer and supplier balances are not forced to reconcile with unpaid-invoice totals.
- Source freshness is shown as operational state, not as a separate report.
- Export remains a demo notification because there is no file-generation contract.
- Exact Suisse Intl, Geist Mono and Neue Montreal font assets are still unavailable; the existing fallbacks remain in use.
- Responsive layouts below the desktop breakpoint may scroll and stack; the no-scroll constraint applies to the desktop critical viewport.
- Mobile report cards preserve their readable content height and participate in the dashboard's vertical scroll instead of clipping internal rows.
- The dashboard's fixed-height flex/grid contract now begins at the desktop breakpoint; smaller viewports use natural document height inside the workspace scroll container.

## Verification

- Product context: read `docs/ux/product-context.md`.
- Flow context: `./flows/dashboard-financiero.md` (creado despues de la implementacion y alineado con este prototipo).
- Lint: `npm run lint` — passed with zero warnings.
- Typecheck: included in `npm run build` — passed.
- Build: `npm run build` — passed; route `/` statically generated.
- Browser console: no warnings or errors during dashboard inspection.
- Detail interaction: Result `Detalle` opens the right Sheet with the exact table.
- Critical viewport 1366×768:
  - document `scrollHeight` = `clientHeight` = 768;
  - dashboard `scrollHeight` = `clientHeight` = 720;
  - all six report cards visible; last row ends at y=756.
- Reference viewport 1680×947:
  - document `scrollHeight` = `clientHeight` = 947;
  - dashboard `scrollHeight` = `clientHeight` = 899;
  - all six report cards visible; last row ends at y=935.

## Files Changed In This Correction

- `skill-flow-test/next-sandbox/src/features/infomanager/components/financial-dashboard-workspace.tsx`
- `docs/ux/dashboard-financiero-implementation-notes.md`
