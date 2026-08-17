# Dashboard financiero UI Handoff

## Build Goal

Agregar al prototipo de InfoManager 5 un dashboard financiero gráfico, compacto y de solo lectura para usuarios administrativos. Debe resumir disponibilidad, cuentas por cobrar, cuentas por pagar, antigüedad, resultado y alertas; permitir filtrar el alcance y abrir detalle sin ejecutar operaciones financieras.

## Product Context References

- Product context: `./product-context.md`
- Flow context: `./flows/dashboard-financiero.md`.
- Full UX brief: `./dashboard-financiero-ux-brief.md`
- Legacy capture: `./dashboard-financiero-main-screen.png`
- Request classification: single-view modernization inside a partially defined product area.

## Product UX Intent

- Operational truth to preserve: comparación clientes/proveedores, saldos totales, antigüedad, disponibilidades, resultado, consolidación y frescura de datos.
- Legacy friction to remove: tortas pequeñas, tablas simultáneas, menú superpuesto, recálculo por bloque, selector lateral permanente y datos de contacto en primer plano.
- Primary workflow improvement: pasar de “ver muchos datos” a “reconocer posición, detectar excepción y abrir detalle”.
- Existing user recognition to preserve: etiquetas financieras conocidas, totales visibles y posibilidad de ver valores exactos.
- Training-free adoption requirements: títulos explícitos, etiquetas de ejes, tooltips con importes, misma escala para cobrar/pagar y estados con texto además de color.
- Product-level decisions to preserve: filtros de reporte coherentes, exportación del resultado actual, ancho completo y reutilización del shell.
- Product-level assumptions: solo lectura; `admin` tiene acceso; ARS y últimos 30 días por defecto; mock data entregado por snapshot.
- Product-level conflicts or contradictions: no cambiar el home de `admin` desde POS porque el contexto confirma entrada directa a facturación. Dashboard se agrega como destino de navegación.

## Target Prototype Integration

- Target app: `skill-flow-test/next-sandbox`.
- Existing shell: `src/features/infomanager/components/app-shell.tsx`.
- View controller: `src/features/infomanager/index.tsx`.
- View types: `src/features/infomanager/types.ts`.
- Access rules: `src/features/infomanager/access-control.ts`.
- Mock source: `src/features/infomanager/mock-data.ts` or a focused dashboard mock module if size justifies it.
- New workspace recommendation: `src/features/infomanager/components/financial-dashboard-workspace.tsx`.
- Add `dashboard` to `ViewId`.
- Add a top-level `Dashboard` entry with `ChartNoAxesCombined` or equivalent Lucide icon before the grouped business navigation.
- Allow `dashboard` only for `admin` in the current prototype. Do not add it to the seller allowlist.
- Keep `admin.homeView` as `pos`.

## Layout Contract

- Header: page title, short context, global filters, freshness and actions.
- Primary region: KPI strip followed by a two-column result/alerts row and a two-column aging row.
- Secondary region: rankings de clientes/proveedores and disponibilidades; exact tables under tabs or expandable sections.
- Tabs/drawer/accordion: tabs for gráfico/listado and monto/porcentaje; Sheet for contextual details.
- Dialogs/modals/secondary surfaces: no modal blocking; use right Sheet.
- Action area: Actualizar and Exportar in header; module-level “Ver detalle” links.
- Responsive behavior:
  - `>=1280px`: five KPI cards in one row; result `2fr` + alerts `1fr`; paired charts in two columns.
  - `768-1279px`: KPI grid 2/3 columns; primary modules stack when labels would truncate.
  - `<768px`: one column; filters in wrapped toolbar or Sheet; charts keep at least 280 px height; tables scroll horizontally.
  - No chart may be narrower than necessary to display labels; stack before shrinking illegibly.

## Critical Viewport Contract

- Baseline viewport: 1366x768.
- Must be visible without scroll: title, global filters, freshness, five KPIs, at least 70% of result chart and first three alerts.
- Primary input area: filter toolbar directly under title.
- Primary input placement relative to working list/table: filters remain above every module they affect.
- Working record/list: not required above fold; summary and exceptions take priority.
- Total/status: disponibilidad, por cobrar, vencido, por pagar, posición neta/resultado.
- Blocking validation: partial/error/stale banner immediately below filters.
- Primary completion action: none; `Actualizar` remains visible.
- Fixed/sticky areas: use existing shell; optional sticky filter toolbar on long scroll.
- Scrollable areas: dashboard body and table detail.
- Content allowed below the fold: rankings, full tables, contacts and account-level detail.
- Max layout budget: KPI cards 116-132 px high; primary chart 300-340 px; alert column same visual height.
- Secondary actions demotion: export and full reports are secondary/ghost actions, never primary filled buttons.

## Visual Hierarchy And Chart Contract

### KPI strip

Render five compact `Card` components:

1. `Disponibilidad`
2. `Por cobrar`
3. `Vencido por cobrar`
4. `Por pagar`
5. `Posición neta`

Each card includes label, formatted amount, one contextual line, optional trend badge and a small sparkline. Avoid nested cards and oversized icons. When a formula is an assumption in mock data, do not add an explanatory accounting claim.

### Resultado

- Dominant chart: Recharts composed chart inside shadcn `ChartContainer`.
- Use translucent `Area` for ingresos and egresos; use a stronger `Line` for resultado.
- Draw a visible zero reference line.
- Include `ChartTooltip`, `ChartTooltipContent`, `ChartLegend`, `ChartLegendContent` and `accessibilityLayer`.
- Controls: `ToggleGroup` or compact buttons for 30 días / 90 días / 12 meses; tabs `Evolución` / `Detalle`.
- Do not use gradient-heavy decoration or 3D effects.

### Antigüedad

- Two sibling modules: `Cuentas por cobrar` and `Cuentas por pagar`.
- Use horizontal `BarChart` or 100% stacked bars with identical bucket order and color semantics.
- Toggle `Montos` / `Porcentajes` changes scale without changing filters.
- Selecting a bucket sets `selectedDetail` and opens a Sheet with matching mock invoices.
- Do not use Pie or Donut charts.

### Rankings

- Two sibling modules: `Principales clientes` and `Próximos pagos a proveedores`.
- Default five rows as horizontal bars with name, amount and status badge.
- Tabs `Gráfico` / `Tabla` or a “Ver todos” action reveal exact values.
- Client bar length represents balance; supplier bar length represents payable amount. Status color represents timing, not entity type.

### Disponibilidades

- Large total plus horizontal composition bars for Banco, Caja and Otras.
- Show `Comprometido próximos 7 días` and `Disponible luego de compromisos` as textual metrics.
- `Progress` may represent committed vs. available only when both values share the same denominator.
- Include a compact account table below or under `Detalle`.

### Alerts

- Render a flat list, not a chart.
- Use `Alert`, `Badge`, icon, short consequence and `Ver` action.
- Priority order: critical, warning, info.
- Examples: customer debt >30 days, payments due this week, stale bank balance and projected negative availability.

## Color And Formatting Contract

- Positive/healthy: emerald, but do not rely on color alone.
- Warning/due soon: amber.
- Critical/overdue/error: destructive/red.
- Neutral comparison and labels: slate/muted.
- Primary result line: product blue.
- Income and expense must remain distinguishable in light/dark themes and in tooltip labels.
- Currency format: `Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 })` for summaries; two decimals in tables/tooltips when useful.
- Percentages: one decimal by default.
- Dates: `dd/MM/yyyy`; timestamps include hour.
- Never communicate status only with red/green.

## Capture Inventory

| Capture | Source file / reference | Surface type | Modern destination | Notes |
| --- | --- | --- | --- | --- |
| Main dashboard legacy | `./dashboard-financiero-main-screen.png` | main screen | `FinancialDashboardWorkspace` | Single source capture; parts obscured by legacy menu. |

## Information To Render

### Always Visible

- Dashboard title and scope.
- Company/consolidated scope, unit, period and currency.
- Data freshness and refresh state.
- Five KPI cards.
- Result trend, alert summary and aging comparison.

### Secondary / Progressive Disclosure

- Customer and supplier rankings.
- Availability account composition.
- Exact tables.
- CUIT, VAT condition, phone and address.
- Detailed report navigation/export.

### Hidden Unless Requested

- Internal IDs and account codes.
- Audit/source metadata.
- Contact data before entity selection.
- Full invoice rows.

### Excluded From UI

Only confirmed exclusions:

- Windows taskbar and window chrome.
- Legacy global menu rendered inside dashboard.
- Legacy pie charts as the visualization pattern.

The following are not confirmed exclusions and stay as open assumptions: `$Tot A$`, colored row indicators and per-block Calculate/All behavior.

## Field Traceability Matrix

| Legacy item | Modern label | Source | Decision | Render location | Component/pattern | Data key | Requirement | Confirmation | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Empresa `[7 - INFOMANAGER]` | Empresa | screenshot | always visible | filter toolbar | Select/Popover | `filters.companyIds` | required | screenshot-inferred | Can be consolidated. |
| Empresas 1-7 | Empresas incluidas | screenshot | always visible | multi-select popover | Popover + Checkbox | `companies[]` | array | screenshot-inferred | Use mock labels from capture. |
| Consolidar | Consolidado | screenshot | always visible, replaced | scope control | checkbox/toggle label | `filters.consolidated` | required | assumption | No separate Calculate action. |
| Buscar clientes | Buscar clientes | screenshot | secondary | customer detail | Input | `customerQuery` | optional interaction | screenshot-inferred | |
| Calcular/Todo clientes | Actualizar | screenshot | needs confirmation/replaced | global header | Button | `refresh()` | action | needs user confirmation | One action for prototype. |
| Nombre cliente | Cliente | screenshot | always visible | ranking/table | bar label/table cell | `customerBalances[].name` | required | screenshot-inferred | |
| Saldo cliente | Saldo por cobrar | screenshot | always visible | ranking/table/KPI | Chart + currency | `customerBalances[].balance` | required | needs user confirmation | Do not equate to invoices. |
| IVA cliente | Condición de IVA | screenshot | secondary | detail Sheet | text | `customerBalances[].vatCategory` | optional | screenshot-inferred | |
| CUIT cliente | CUIT | screenshot | secondary | detail Sheet | text | `customerBalances[].taxId` | optional | screenshot-inferred | |
| Teléfonos cliente | Teléfono | screenshot | secondary | detail Sheet | text/link | `customerBalances[].phone` | optional | screenshot-inferred | |
| Punto/color cliente | Estado | screenshot | needs confirmation | detail/ranking | Badge only if defined | `customerBalances[].status` | optional | needs user confirmation | Text label required. |
| Total clientes | Total por cobrar | screenshot | always visible | KPI | MetricCard | `metrics.receivables` | display-only | needs user confirmation | |
| Actualización clientes | Actualizado | screenshot | secondary | freshness tooltip | Badge/Tooltip | `freshness.receivables` | required | screenshot-inferred | |
| Buscar proveedores | Buscar proveedores | screenshot | secondary | supplier detail | Input | `supplierQuery` | optional interaction | screenshot-inferred | |
| Calcular/Todo proveedores | Actualizar | screenshot | needs confirmation/replaced | global header | Button | `refresh()` | action | needs user confirmation | |
| Nombre proveedor | Proveedor | screenshot | always visible | ranking/table | bar label/table cell | `supplierBalances[].name` | required | screenshot-inferred | |
| Saldo proveedor | Saldo por pagar | screenshot | always visible | ranking/table/KPI | Chart + currency | `supplierBalances[].balance` | required | needs user confirmation | Present positive payable amount in mock. |
| IVA proveedor | Condición de IVA | screenshot | secondary | detail Sheet | text | `supplierBalances[].vatCategory` | optional | screenshot-inferred | |
| CUIT proveedor | CUIT | screenshot | secondary | detail Sheet | text | `supplierBalances[].taxId` | optional | screenshot-inferred | |
| Teléfonos proveedor | Teléfono | screenshot | secondary | detail Sheet | text/link | `supplierBalances[].phone` | optional | screenshot-inferred | |
| Domicilio proveedor | Domicilio | screenshot | secondary | detail Sheet | text | `supplierBalances[].address` | optional | screenshot-inferred | |
| Punto/color proveedor | Estado | screenshot | needs confirmation | detail/ranking | Badge only if defined | `supplierBalances[].status` | optional | needs user confirmation | |
| Total proveedores | Total por pagar | screenshot | always visible | KPI | MetricCard | `metrics.payables` | display-only | needs user confirmation | |
| Actualización proveedores | Actualizado | screenshot | secondary | freshness tooltip | Badge/Tooltip | `freshness.payables` | required | screenshot-inferred | |
| Buscar disponibilidades | Buscar cuentas | screenshot | secondary | availability detail | Input | `accountQuery` | optional interaction | screenshot-inferred | |
| Recalcular disponibilidades | Actualizar | screenshot | needs confirmation/replaced | global header | Button | `refresh()` | action | needs user confirmation | |
| Cod cuenta | Código | screenshot | hidden unless requested | account table | table cell | `availabilityAccounts[].code` | optional | screenshot-inferred | |
| Cuenta/Descripción | Cuenta | screenshot | secondary | availability bars/table | bar/table | `availabilityAccounts[].name` | required | screenshot-inferred | |
| Saldo disponibilidad | Disponible | screenshot | always visible | KPI/module/table | Metric/Chart | `availabilityAccounts[].balance` | required | screenshot-inferred | |
| Tipo disponibilidad | Tipo | screenshot | secondary | account table | Badge | `availabilityAccounts[].type` | optional | screenshot-inferred | |
| Actualización disponibilidades | Actualizado | screenshot | secondary | freshness tooltip | Badge/Tooltip | `freshness.availability` | required | screenshot-inferred | |
| Fact. Impagas Clientes | Antigüedad por cobrar | screenshot | always visible | aging grid | BarChart | `receivableAging[]` | required | screenshot-inferred | No PieChart. |
| Id rango cliente | ID rango | screenshot | hidden | data only | n/a | `receivableAging[].id` | required | screenshot-inferred | |
| Descrip. rango cliente | Antigüedad | screenshot | always visible | axis/legend | chart label | `receivableAging[].label` | required | needs user confirmation | Mock labels must say “Demo”. |
| Monto rango cliente | Monto | screenshot | always visible | bar/tooltip | Chart | `receivableAging[].amount` | required | screenshot-inferred | |
| Porc.% cliente | Participación | screenshot | secondary | tooltip/% mode | Chart | `receivableAging[].percentage` | derived/provided | screenshot-inferred | |
| Deu.Tot. cliente | Total pendiente | screenshot | always visible | aging header | Metric | `metrics.pendingReceivables` | required | needs user confirmation | |
| `$Tot A$` cliente | Total alternativo | screenshot | needs confirmation | not rendered in prototype | n/a | `legacyAlternativeTotal?` | unknown | needs user confirmation | Keep in type notes only. |
| Actualización impagas cliente | Actualizado | screenshot | secondary | freshness tooltip | Badge | `freshness.receivableAging` | required | screenshot-inferred | |
| Fact. Impagas Proveedores | Antigüedad por pagar | screenshot | always visible | aging grid | BarChart | `payableAging[]` | required | screenshot-inferred | Same scale/order. |
| Id/Descrip./Monto/Porc. proveedor | Rango/monto/participación | screenshot | always visible/secondary | chart/tooltip | Chart | `payableAging[]` | required | screenshot-inferred | |
| Deu.Tot. proveedor | Total pendiente | screenshot | always visible | aging header | Metric | `metrics.pendingPayables` | required | needs user confirmation | |
| `$Tot A$` proveedor | Total alternativo | screenshot | needs confirmation | not rendered in prototype | n/a | `legacyAlternativeTotal?` | unknown | needs user confirmation | |
| Actualización impagas proveedor | Actualizado | screenshot | secondary | freshness tooltip | Badge | `freshness.payableAging` | required | screenshot-inferred | |
| Gráfico Resultado | Evolución | screenshot | always visible | result tabs | Tabs | `resultView` | interaction | screenshot-inferred | Default. |
| Listados | Detalle | screenshot | secondary | result tabs | Tabs + Table | `resultView` | interaction | screenshot-inferred | |
| Empresa resultado | Empresa | screenshot | always visible/deduplicated | global filter | Select | `filters.companyIds` | required | screenshot-inferred | |
| UN | Unidad de negocio | screenshot | always visible | global filter | Select | `filters.businessUnitId` | optional | needs user confirmation | |
| Recalcular resultado | Actualizar | screenshot | replaced | global header | Button | `refresh()` | action | needs user confirmation | |
| Inf. detallado | Ver informe detallado | screenshot | secondary | result module header | Button/link | `openResultReport()` | action | screenshot-inferred | Prototype may show Sheet if route absent. |
| Ingresos | Ingresos | screenshot | always visible | result chart/table | Area | `resultSeries[].income` | required | screenshot-inferred | |
| Egresos | Egresos | screenshot | always visible | result chart/table | Area | `resultSeries[].expense` | required | screenshot-inferred | |
| Margen | Resultado | screenshot | always visible | result line/KPI | Line | `resultSeries[].result` | required | needs user confirmation | Do not label percentage. |
| Calcular/Todo/Recalcular repetidos | Actualizar dashboard | screenshot | needs confirmation/replaced | header | Button + Spinner | `refreshState` | required state | assumption | Show per-source timestamps. |
| Menú Archivo/Movimientos/etc. | App navigation | screenshot | excluded from content | existing shell | Sidebar | n/a | n/a | confirmed exclusion from content | |
| Refrescar listas | Actualizar datos | screenshot | replaced | header | Button | `refresh()` | action | needs user confirmation | |
| Configuración/Ayuda/Cierre/Salir | Global utilities | screenshot | secondary/existing | shell footer | existing controls | n/a | n/a | screenshot-inferred | Do not duplicate. |

## Workflow Contract

### Step Model

| Step | Modern behavior | Step type | Component / area | Validation | Notes |
| --- | --- | --- | --- | --- | --- |
| 1. Ingresar | Admin abre Dashboard desde navegación | essential decision | AppShell | permission | Keep POS as admin home. |
| 2. Definir alcance | Select company/consolidated, unit, period | essential decision | filter toolbar | permitted scope/date range | Updates all modules. |
| 3. Leer position | Scan KPIs and freshness | useful confirmation | metric strip | partial/stale states | |
| 4. Detectar change | Inspect result trend and alerts | essential decision | chart + alert list | data availability | |
| 5. Compare aging | Compare receivable/payable buckets | essential decision | paired BarCharts | shared bucket config | |
| 6. Investigate party/account | Click segment or row | expert shortcut | Sheet | entity access | Keep filters. |
| 7. Open full report | Navigate or mock detail | occasional | secondary action | route/permission | No financial mutation. |
| 8. Export | Export current filtered result | permission-gated | menu action | data + permission | Prototype may demonstrate toast only if export not built. |

### Simplifications To Implement

- Legacy steps removed or collapsed: individual calculate links, fixed company checkbox column, duplicate local company filters and pie legends as tables.
- Defaults to apply: current shell company, last 30 days, ARS, amount mode, top five entities.
- Technical choices translated to user choices: consolidated scope, business unit and period.
- Validation moved earlier: missing/stale/partial source states.
- User control preserved: exact table, filters, refresh and detail access.

### Flow Integration

- Entry points: top-level Dashboard item in existing sidebar.
- Exit points: existing customer, supplier, account statement, sales documents, purchase documents, receipts and payments views; if direct filtered navigation is not implemented, show a clear Sheet action without faking successful routing.
- Previous flow step: navigation or login into product.
- Next flow step: investigation in existing workspaces.
- Blocking dependencies: none for visual prototype if actions remain read-only and formulas are mock-labelled internally.
- Existing modern views to modify instead of duplicate: reuse AppShell and existing entity/workspace components; do not build new customer/supplier CRUD.
- Integration assumptions: `dashboard` is admin-only; add mock data locally.

## Component Strategy

- Preferred primitives: `Card`, `Chart`, `Tabs`, `Badge`, `Alert`, `Button`, `Popover`, `Checkbox`, `Select`, `Calendar`, `Sheet`, `Table`, `Skeleton`, `Tooltip`, `Separator` and `DropdownMenu`.
- Client design system constraints: continue existing small radius, operational typography, muted borders, light/dark theme and compact density.
- shadcn components already present: Alert, Badge, Button, Calendar, Card, Checkbox, Popover, Select, Sheet, Skeleton, Table, Tabs and Tooltip.
- shadcn components likely needed: `chart`, `progress`, `toggle-group`; add only those actually used.
- Runtime dependency: current prototype does not list Recharts. Add via shadcn chart installation rather than hand-rolling SVG chart primitives.
- Reusable product components: `DashboardFilterBar`, `FinancialMetricCard`, `AgingChart`, `PartyRankingChart`, `AvailabilityBreakdown`, `FinancialDetailSheet`, `FreshnessBadge`.
- Components that should not be one-off: date range filter, currency formatter, chart tooltip, stale/partial status and report detail Sheet.
- Density constraints: 16-24 px gaps, compact card padding, readable charts, no empty decorative panels.
- Avoid card-heavy layouts when: rendering rankings/tables; one bordered section can contain chart and table tab.
- Avoid: PieChart, 3D charts, gauges without meaningful targets, rainbow palettes, gradients as decoration, icons for every metric, nested cards and detached legends.

## Actions And Interactions

- Primary actions: none transactional. `Actualizar` is the most prominent utility action.
- Secondary actions: Ver detalle, Ver todos, Exportar and change chart modes.
- Destructive actions: none.
- Filters/search/sort: global company/unit/period; local search/sort in detail tables.
- Selection/bulk actions: chart segment and row selection; no bulk actions.

### Action State Model

| Action | Frequency | Risk | Permission | Enabled when | Disabled reason | Confirmation / recovery |
| --- | --- | --- | --- | --- | --- | --- |
| Open Dashboard | frequent | safe | admin | access granted | no financial dashboard permission | Explain access denial. |
| Change company scope | always visible | safe | scope-gated | at least one company allowed | no companies available | Restore prior valid scope. |
| Change period | always visible | safe | admin | valid range | invalid/unsupported range | Inline message. |
| Refresh | frequent secondary | safe | admin | not already refreshing | refresh in progress | Keep old data; retry on error. |
| Select chart segment | frequent secondary | safe | admin | segment has rows | no underlying detail | Tooltip explains no detail. |
| Open detail | frequent secondary | safe | entity/report permission | identifiable row | missing permission/id | Sheet remains closed; explain. |
| Export | occasional | data-sensitive | unknown/admin | data loaded and permission | no data/permission | Export active filters; toast on failure. |
| Collect/pay/edit | never in dashboard | risky | role-gated | never | use operational flow | Not implemented here. |

## Roles And Permissions

| Role | Visible information | Allowed actions | Disabled/hidden actions | UI behavior |
| --- | --- | --- | --- | --- |
| Admin prototype | Full dashboard mock | filter, refresh, inspect, export/demo | financial mutations | Dashboard nav visible. |
| Seller prototype | None | none | dashboard and consolidated finance | Dashboard nav hidden by allowlist. |
| Future finance/owner | Configured scope | inspect/export | according to policy | Not implemented until roles exist. |

## Dialogs, Drawers, And Secondary Surfaces

```txt
Surface: Financial detail Sheet
Trigger: click KPI, aging bucket, ranking bar, alert or account row
Modern pattern: right Sheet, width 520-680 px desktop; full-width mobile
Purpose: reveal exact records without losing dashboard filters
Content: context title, filtered total, status/freshness, compact rows, entity contact/tax metadata when applicable
Actions: open related workspace/report, close
Validation: selected detail type and identifier; permission
Data received from parent: detailType, entityId/bucketId/accountId, active filters
Data returned to parent: none
Close/cancel behavior: close without resetting filters
Required states: loading, empty, partial, error, permission denied
```

```txt
Surface: Filter popover (companies)
Trigger: company/consolidated control
Modern pattern: Popover + Checkbox list
Purpose: select one or more permitted companies
Content: company name, code, active scope, select all permitted
Actions: Apply, Cancel
Validation: at least one company
Data received from parent: permitted companies and current selection
Data returned to parent: companyIds + consolidated boolean
Close/cancel behavior: cancel restores prior selection
Required states: loading, no permitted companies
```

## Required States

- Loading: Skeleton cards and chart shapes on first load.
- Empty: each module states why it has no data and preserves filters.
- Error: module Alert with retry; global error only if snapshot cannot load at all.
- Permission denied: hide nav; direct view shows non-destructive explanation.
- Partial data: render available modules and list missing sources.
- Validation: invalid date/scope inline.
- Failed submit: not applicable; refresh/export failure uses alert/toast.
- Unsaved changes: only temporary unapplied company popover selection.
- Conflicting update: not applicable for read-only snapshot.
- Stale data: show last successful timestamp and keep values visible.

## Defaults, Validation, And Recovery Contract

- Safe auto-filled defaults: current shell company, ARS, last 30 days, amount mode, top five.
- Suggested editable defaults: current unit, comparison with previous period.
- Defaults requiring confirmation: consolidated mode and net-position calculation.
- Manual-only decisions: multi-company scope and export.
- Inline validation: date range and selected company access.
- Validation summary: use one compact Alert only for global problems.
- Action gating: disable Export without rows and Refresh while refreshing.
- Failed submit recovery: failed refresh preserves last successful snapshot.
- Data that must never be lost on failure: active filters and last successful snapshot.

## Data Shape

This is a prototype contract. Values may be mock data, but relationships, nullability and state coverage must be realistic.

### Entities

```ts
type DashboardFilters = {
  companyIds: string[]
  consolidated: boolean
  businessUnitId: string | null
  dateFrom: string
  dateTo: string
  currency: "ARS"
}

type DashboardMetric = {
  key: "availability" | "receivables" | "overdueReceivables" | "payables" | "netPosition"
  label: string
  value: number
  trendPercent: number | null
  contextLabel: string
  sparkline: number[]
}

type PartyBalance = {
  id: string
  kind: "customer" | "supplier"
  name: string
  balance: number
  overdueAmount: number
  nextDueDate: string | null
  agingDays: number | null
  status: "current" | "due-soon" | "overdue" | "critical"
  taxId?: string
  vatCategory?: string
  phone?: string
  address?: string
}

type AgingBucket = {
  id: string
  label: string
  minDays: number | null
  maxDays: number | null
  amount: number
  percentage: number
  count: number
  status: "current" | "due-soon" | "overdue" | "critical"
}

type AvailabilityAccount = {
  id: string
  code?: string
  name: string
  type: "bank" | "cash" | "other"
  balance: number
  committedNext7Days: number
  updatedAt: string
  status: "fresh" | "stale" | "error"
}

type ResultPoint = {
  date: string
  income: number
  expense: number
  result: number
}

type DashboardAlert = {
  id: string
  severity: "critical" | "warning" | "info"
  title: string
  description: string
  amount?: number
  count?: number
  detailType: "customer" | "supplier" | "aging" | "availability" | "result"
  targetId?: string
}

type SourceFreshness = {
  source: "receivables" | "payables" | "availability" | "aging" | "result"
  status: "fresh" | "stale" | "partial" | "error"
  updatedAt: string | null
  message?: string
}

type DashboardSnapshot = {
  generatedAt: string
  filters: DashboardFilters
  metrics: DashboardMetric[]
  customerBalances: PartyBalance[]
  supplierBalances: PartyBalance[]
  receivableAging: AgingBucket[]
  payableAging: AgingBucket[]
  availabilityAccounts: AvailabilityAccount[]
  resultSeries: ResultPoint[]
  alerts: DashboardAlert[]
  freshness: SourceFreshness[]
  legacyAlternativeTotals?: {
    receivables?: number
    payables?: number
  }
}
```

### Companies And Units

```txt
Array key: companies
Row identity: company.id
Fields: id, code, name, allowed, active
Minimum mock: seven entries matching Central, Tucumán, Salta-Jujuy Comercial, Córdoba-San Luis, Cuyo, Paraguay and INFOMANAGER

Array key: businessUnits
Row identity: unit.id
Fields: id, companyId optional, code, name
Minimum mock: UN 1 plus at least one alternate unit to demonstrate filter state
```

### Arrays / Tables

```txt
Array key: customerBalances
Row identity: id
Columns: customer, balance, overdue amount, aging/status, next due date
Default sort: balance descending
Empty state: “No hay saldos de clientes para este alcance.”
Row actions: View detail
Bulk actions: none
```

```txt
Array key: supplierBalances
Row identity: id
Columns: supplier, payable balance, overdue amount, next due date, status
Default sort: next due date ascending, then balance descending
Empty state: “No hay pagos pendientes para este alcance.”
Row actions: View detail
Bulk actions: none
```

```txt
Array key: availabilityAccounts
Row identity: id
Columns: account, type, balance, committed, updated, status
Default sort: balance descending
Empty state: “No hay cuentas de disponibilidad configuradas.”
Row actions: View detail
Bulk actions: none
```

```txt
Array key: resultSeries
Row identity: date
Columns: period/date, income, expense, result
Default sort: date ascending in chart, descending in table
Empty state: “No hay resultados para el período seleccionado.”
Row actions: none
Bulk actions: none
```

### Status Values

```txt
Status key: financial timing
Allowed values: current, due-soon, overdue, critical
Modern labels: Al día, Próximo a vencer, Vencido, Vencimiento crítico
Visual treatment: neutral/emerald, amber, red, red strong + text
Business meaning: demo-only until production thresholds are confirmed
```

```txt
Status key: data freshness
Allowed values: fresh, stale, partial, error
Modern labels: Actualizado, Desactualizado, Datos parciales, Error de actualización
Visual treatment: Badge + timestamp + optional Alert
Business meaning: source availability, not financial health
```

### Derived / Display-Only Values

```txt
Value: aging percentage
Derived from: amount / sum of bucket amounts, or provided by snapshot
Display rule: one decimal; total should be approximately 100% allowing rounding
```

```txt
Value: net position
Derived from: do not derive in UI until formula is confirmed
Display rule: consume metrics.netPosition supplied by mock/snapshot
```

```txt
Value: result
Derived from: do not silently derive if accounting source differs
Display rule: consume resultSeries[].result; mock can equal income - expense
```

### Example Data Notes

- Normal state: at least 6 result points, 5 customers, 5 suppliers, 4 aging buckets per side, 4 availability accounts and 4 alerts.
- Empty state: one filter scope with no supplier balances but other modules populated.
- Partial state: availability marked stale while result and aging remain fresh.
- Error state: one failed source with retained previous values.
- Permission state: seller cannot navigate to dashboard.
- Use realistic ARS values in millions; labels may reuse names and approximate magnitudes from the capture.
- Do not force totals from the capture to reconcile: legacy customer balance, supplier balance and unpaid invoice totals appear to represent different measures.
- Do not display `legacyAlternativeTotals` until its meaning is confirmed.

## Visible Business Rules

- All modules display the active scope and date range through the global filter state.
- Aging clients and suppliers share bucket definitions and visual order.
- A chart selection must have an equivalent textual/table detail.
- Refresh never clears the last successful snapshot before a new one succeeds.
- Dashboard is read-only; operational changes require navigation.
- Missing or stale sources must be visible, not silently treated as zero.
- Export, if implemented, uses current filters and visible table filters.

## Do Not Include

- Pie/donut charts for aging.
- Global legacy menu inside the workspace.
- Repeated Calculate/All/Recalculate links.
- CUIT, IVA, phone and address in primary rankings.
- Transaction buttons such as Collect, Pay, Edit balance or Post entry.
- A second sidebar or duplicated company selector unrelated to the shell.
- Cards nested inside cards or a marketing-style hero.
- Unlabelled red/green dots.
- `$Tot A$` or a converted total without confirmed meaning.
- A margin percentage unless its formula and semantics are confirmed.

## UX Intent

- Summary: five metrics establish the financial position without requiring the user to add table totals mentally.
- Trend: result occupies the largest chart area because time reveals direction that a snapshot cannot.
- Comparison: receivable and payable aging use the same visual grammar to make imbalance obvious.
- Investigation: rankings identify concentration; exact tables and Sheets preserve operational detail.
- Safety: the dashboard guides attention but does not move money or alter account state.
- Freshness: data quality is displayed independently from financial health.

## Open Assumptions

- Admin-only access is appropriate for the prototype.
- `Dashboard` is a top-level navigation item and not the default home.
- Company multiselect can coexist with the shell's active store for analysis.
- Mock net position is supplied, not calculated in the view.
- Mock aging buckets use human labels but are not production rules.
- Result is an amount line, not a margin percentage.
- `Ver informe detallado` may open a Sheet when a complete report route does not exist.
- Exact export behavior can be represented by a disabled or demo action if not in prototype scope; do not fake a downloaded file.

## Acceptance Criteria

- A new admin-only Dashboard entry opens a workspace inside the existing shell.
- Admin home remains POS; seller navigation remains unchanged.
- The dashboard uses shadcn `Chart`/Recharts and contains no aging pie charts.
- Five compact KPI cards render with realistic mock values and state labels.
- Result chart displays income, expense and result with tooltip, legend, zero line and accessible chart layer.
- Receivable and payable aging are visually comparable and support amount/percentage mode.
- Customer/supplier rankings and availability composition are graphical, with exact tables available secondarily.
- Selecting an actionable visual opens a contextual Sheet and preserves active filters.
- Loading, empty, partial, error, stale and permission states are demonstrable.
- Filters affect all mock modules consistently.
- Refresh preserves old data while loading and on failure.
- Primary rankings do not show CUIT, VAT, phone or address.
- No financial mutation action exists in the dashboard.
- Layout is usable at 1366x768 and stacks before chart labels become unreadable.
- Every identified legacy item is represented in the traceability matrix.
- Build follows this handoff before consulting the full UX brief.

## Source References

- Full UX brief: `./dashboard-financiero-ux-brief.md`
- Product context: `./product-context.md`
- Flow context: `./flows/dashboard-financiero.md`.
- Legacy screenshot: `./dashboard-financiero-main-screen.png`
- shadcn dashboard block: <https://ui.shadcn.com/blocks>
- shadcn Chart: <https://ui.shadcn.com/docs/components/base/chart>
- shadcn chart gallery: <https://ui.shadcn.com/charts/area>
