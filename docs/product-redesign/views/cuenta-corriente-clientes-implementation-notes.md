# Cuenta Corriente de Clientes · Implementation Notes

## Prototype destination

- App: `skill-flow-test/next-sandbox`.
- Navigation: `Ventas > Cuenta corriente`.
- Contextual entry: `Clientes > detalle > Ver cuenta corriente`.
- Component: `src/features/infomanager/components/customer-account-statement-workspace.tsx`.

## Corrective UX contract applied

The original implementation began with an empty report form. The user correction changes that architecture:

- The initial state is now a clear table of customers whose commercial condition is `Cuenta corriente`.
- Search filters that table by code, customer name or tax ID and is accent-insensitive.
- The whole row is keyboard/click selectable and exposes the explicit action `Generar reporte`.
- Selecting a customer opens a focused shadcn `Sheet` with report criteria.
- The customer is fixed in the drawer and is not selected a second time.
- Consolidation, date range, currency and delivery notes remain visible together in the drawer.
- Removed the invented `Empresa` selector because it is not present in the confirmed original UI.
- Removed the visible drawer subtitle, helper copy and placeholder disclaimer.
- `Consolidado` and `Remitos` now render as compact checkbox rows with only their requested labels.
- `Desde` and `Hasta` now use the shadcn Date Picker composition (`Popover` + `Calendar` + `Button`) and display `dd/MM/yyyy`; the native browser date input was removed.
- `Generar reporte` closes the drawer and moves to a full-width report surface; the wide accounting table is never compressed into the drawer.
- `Cambiar criterios` reopens the drawer with the current customer and criteria.
- `Volver a cuentas corrientes` restores the list and its local search state.
- The contextual entry from the customer detail opens the same drawer with that customer preloaded.

## Report behavior preserved

- Read-only statement with no payment, receipt creation, allocation, edit or annulment actions.
- Full-width local filter directly above the movement table.
- Every documented movement column remains visible in the report.
- Movements remain grouped by currency with supplied debit, credit and running-balance totals.
- `Saldo total pesificado` remains neutral and visible in the header and final summary.
- Print, export and related-document opening remain simulated without changing account data.

## shadcn/ui substrate

- `Sheet`, `Popover`, `Calendar`, `Button`, `Input`, `Select`, `Checkbox`, `Badge`, `Skeleton` and `Table`.
- Local components (`AccountsList`, `ReportCriteriaDrawer`, `ReportSurface`) are composition-only.

## Conservative placeholders

- A prototype customer is considered to have an account when `saleCondition === "Cuenta corriente"`; the formal backend flag remains pending.
- Last movement, movement count and balance are displayed from supplied statement-shaped mock data.
- Debit, credit, running balances, currency totals and pesified balance are not calculated by the UI.
- `Consolidado`, currency and `Remitos` retain unvalidated backend semantics.
- Sign interpretation, `Días`, `Pago`, `{P}`, conversion rules and permissions remain pending.
- Disabled customers remain visible because the user requested all account customers; whether they can be reported/exported needs validation.
- State remains local and resets on reload.

## Design system gaps

- Licensed `Suisse Intl`, `Geist Mono` and `Neue Montreal` files are not present in the sandbox. Existing documented system/Arial and monospace fallbacks remain in use.

## Verification

- `npm run lint`: pass.
- `npx tsc --noEmit`: pass.
- `npm run build`: pass; static `/` route generated.
- `git diff --check`: pass.
- Desktop `1280 × 720`: search and account rows begin in the first viewport; no document-level overflow.
- Drawer desktop/tablet: all criteria and `Generar reporte` remain reachable; at `1024 × 768` the CTA bottom is `756px` inside a `768px` viewport.
- Generated report at `1280 × 720`: balance, actions, local filter and full movement table start in the first viewport.
- Functional browser coverage: account list, accent-insensitive search, row selection, drawer configuration, report generation, back to list and contextual entry from Customer detail.
- Corrective drawer check at `1280 × 720`: no visible `Empresa`, helper copy or placeholder disclaimer; `Consolidado` and `Remitos` are label-only rows and the CTA remains visible.
- Date Picker correction at `1280 × 720`: both date buttons render `dd/MM/yyyy`; the shadcn calendar opens above the drawer, exposes localized grid semantics, updates the selected date and closes after selection.
- Browser console: no errors or warnings in the final verification session.
