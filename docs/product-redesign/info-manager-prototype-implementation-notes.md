# InfoManager 5 Prototype Implementation Notes

## Destination

- App: `skill-flow-test/next-sandbox`
- Main route: `/`
- Implementation root: `src/features/infomanager`

## Covered Product Contracts

- App shell: collapsible business-area sidebar, company/store switcher, user menu, theme and density preferences.
- Catalogo / Articulos: dominant table, visible row actions, same-width detail/edit drawers, guided creation, optional image, serials, stock and advanced steps.
- Clientes: dominant table, contextual detail, guided fiscal creation/editing and explicit tax treatment.
- Proveedores: dominant table, contextual detail, guided fiscal/accounting creation/editing, retention and tax sections.
- Depositos: dominant table, contextual detail, creation/editing drawer and visible cost-center configuration.
- Facturacion Rapida / POS: cash-state gate, open-cash dialog, scanner, ticket, customer/seller context, compact favorites, cash operations, payment and exchange flows.
- Pagos y Cobros: reusable operational list for purchase payment orders and sales receipts, with compact filters, detail and simulated draft creation.
- Consulta Rapida: kiosk surface without administrative shell; found, multiple, no-price, no-image and not-found states.
- Etiquetas: shared local flow for reusable label design and batch printing, including the no-design round trip.
- Cuenta corriente de clientes: consulta de solo lectura con criterios visibles, saldo, movimientos y acceso contextual desde Clientes.

## Reused Product Patterns

- `list-detail-workspace`: shared table, visible row actions, detail drawer and editor drawer behavior.
- `sidebar-navigation`: business areas, nested items with chevrons, compact state and tooltips.
- `quick-access-favorites`: six visible items per page, compact tiles, price and scanner-focus return.

## shadcn/ui Substrate

- Existing: `Button`, `Input`, `Textarea`, `Select`, `DropdownMenu`, `Checkbox`, `Table`, `Tabs`, `Sheet`, `Sidebar`, `Tooltip`, `Alert`.
- Added: `Dialog`, implemented with the repository's existing `radix-ui` package and shadcn composition conventions.
- Product components are compositions only; they do not define a second visual primitive library.

## Design System Applied

- InfoManager blue: `#0057FF`; hover token: `#0041BF`.
- Radius: `4px` across operational controls, drawers, dialogs, tables and panels.
- Density: compact 4px-based spacing, mono labels/numbers and table-first administrative layouts.
- Light theme variables were preserved.
- Dark theme now uses the documented Vercel-inspired neutrals: black background/surfaces, `#1A1A1A` muted surfaces, `#2E2E2E` borders and `#EDEDED` foreground.

Typography gap:

- The sandbox does not contain licensed `Suisse Intl` or `Neue Montreal` font files.
- The implementation uses the documented explicit fallbacks: Arial/system sans and system monospace. Real font assets remain an integration requirement.

## Mock Data Coverage

- Products with and without images, with and without price, serialized/non-serialized, low stock, disabled state and service/product types.
- Consumer-final and registered-taxpayer customers.
- Suppliers with registered-taxpayer and monotributista categories plus different retention/tax treatments.
- Origin and destination warehouses.
- Eight POS favorites with six visible per page.
- Payment methods: cash, card, bank transfer, Mercado Pago and PayWay.

## Prototype Assumptions

- One active cash register per user/store; opening asks for balance, seller, context and optional notes, without denomination counting.
- Card/PayWay payments require card/processor, plan and authorization. Transfer/Mercado Pago require a reference.
- A negative exchange prepares a generic negative voucher state; the final fiscal document type remains undefined.
- Warehouses live under `Stock`; code is manually entered and type is limited to `ORIGEN`/`DESTINO` in the prototype.
- Customer document is optional for `Consumidor final` and required for other represented VAT categories.
- Supplier CUIT and VAT category block minimum save; accounting accounts are visible defaults but do not block the mock save.
- Permission-dependent actions are shown as available to the demo operator.

## Known Prototype Limits

- State is local and resets on reload. There is no API, persistence, authentication or permission backend.
- ARCA, fiscalization, printing, camera, scanner and scale integrations are simulated.
- File-image preview uses a browser object URL and is not uploaded or persisted.
- External mock product photos require network access; no-image placeholders remain functional without it.
- Exact fiscal validation, duplicate CUIT/barcode checks, auditing and stock movement persistence are not implemented.
- Complex accounting and line-item tables retain bounded horizontal scrolling on mobile when hiding columns would remove operational meaning. Primary lists use mobile cards instead.

## Product-wide mobile responsive pass · 2026-07-28

- Standardized the mobile shell at `390 × 844`: the header preserves the current view title, the navigation drawer uses a bounded mobile width and closes immediately after selecting a destination.
- Replaced the POS desktop grid with a dedicated mobile ticket surface. Customer, commercial condition, seller, scanner and cash actions remain above a vertically scrollable item list; total and `Cobrar` remain fixed in the bottom action area.
- Converted product entities to mobile-first surfaces: Artículos uses the existing catalog cards, while Clientes, Proveedores and Depósitos use compact field cards with visible edit, duplicate and delete actions.
- Converted Presupuestos, Documentos de compra/venta, Pagos, Cobros and Cuenta corriente de clientes from wide primary tables to scan-friendly mobile cards. Desktop tables are preserved from `md` upward.
- Reflowed search/filter bars into mobile grids so criteria remain visible without a page-level horizontal scrollbar.
- Reduced the Rubros table to the mobile-critical fields and kept row actions visible; secondary metrics return at larger breakpoints.
- Reflowed label-design headers and reduced the print table to Código, Descripción and Cantidad on phones. Barcode, price and scale-specific columns return progressively.
- Made right/left sheets use 94% of the viewport on phones while keeping the navigation drawer narrower.

Responsive verification:

- `npm run lint`: pass.
- `npm run build`: pass; TypeScript and static route generation completed.
- Browser QA at `390 × 844`: login, sidebar, POS, Artículos, Presupuestos, Documentos de venta, Clientes and Cuenta corriente.
- No document-level horizontal overflow in the checked views.
- POS `Cobrar` remained visible at the bottom of the viewport with a populated ticket.

## POS mobile layout comparison · 2026-07-28

- Added the compact `A / B / C` comparison control to the mobile app header, beside `Facturacion rapida`; the full labels remain visible from `md` upward.
- Adapted the three existing POS proposals for phone use without changing ticket state or sale behavior: `A · Cabecera` keeps editable cards, `B · Minimalista` uses compact operational rows and a split bottom bar, and `C · Talonario` uses receipt-like line items and totals.
- This is a prototype comparison aid, not a persisted per-user product preference; the selected option remains local React state and resets on reload.
- Reused the existing shadcn `Button`, `Input` and app-shell composition with InfoManager spacing, mono operational labels, theme tokens and 4 px radius.
- Verified all three options at `390 × 844` and `360 × 800`: selector state changed correctly, document width matched the viewport, populated ticket remained scrollable, and total plus `Cobrar` stayed visible.
- `npm run lint` and `npm run build`: pass. Browser console: no warnings or errors from the application.
- Refined `B · Minimalista` so the repeated customer/commercial-condition/seller block is removed only from that mobile proposal. `A · Cabecera` and `C · Talonario` retain their visible context block.

## Mobile bottom navigation experiment · 2026-07-28

- Replaced the mobile header hamburger with a persistent app-style bottom navigation while preserving the desktop sidebar unchanged.
- Admin direct destinations are `Inicio` (Dashboard), `Facturar`, `Articulos` and `Clientes`; permissions automatically remove unavailable destinations for other roles.
- `Más` opens the complete existing navigation drawer, so Compras, Stock, Rubros, Etiquetas and secondary destinations remain available without crowding the bottom bar.
- Secondary destinations mark `Más` as the current navigation area; direct destinations mark their own tab.
- The bar participates in the shell layout instead of overlaying content, keeping the POS total and `Cobrar` visible immediately above it.
- Browser QA at `390 × 844` covered POS, Articulos, the complete `Más` drawer and navigation to Rubros without horizontal overflow.
- Desktop sidebar now starts collapsed at its 52 px icon rail and can still be expanded to the existing 247 px width from the trigger in the sidebar header.
- The cash-opening modal now measures itself against the actual workspace between the app header and bottom navigation instead of the full device viewport. Its header and actions remain fixed while only the form body scrolls under large Android/browser display scales.
- Browser QA covered normal `100%`, app-scale `150%` at `390 × 844`, and the stricter `150%` at `320 × 720`; the dialog stayed within its overlay with no horizontal overflow.
- Added an explicit device-width viewport with `viewport-fit=cover` and a global `text-size-adjust: 100%` contract so Android browsers do not apply a second, unpredictable text inflation pass. Manual browser zoom remains available.
- The shared dialog primitive now uses the visual viewport height and internal overscroll instead of clipping tall content.
- Product-wide QA at `150%` covered Dashboard, Articulos, Clientes and Facturacion at `390 × 844`; all retained zero document-level horizontal overflow.
- Added separate compact actions in B: `Facturacion` opens the existing billing sheet with the current customer, VAT category, sale condition, price list, seller and receipt context; `Caja` opens only the cash/shift sheet.
- Extended the billing sheet with the current seller selector so moving the repeated context into progressive disclosure does not remove an editable operational field.
- Rechecked B at `390 × 844` and `360 × 800`: all five compact actions fit one row, both drawers open with the expected data, the customer context block is absent, total and `Cobrar` remain visible, and there is no horizontal overflow.
- Navigation drawer closed automatically after every checked destination change.

## POS corrective pass

- Scoped the `Caja sin abrir` overlay and opening form to the POS workspace. The application sidebar remains sharp, enabled and navigable while sales operations are blocked.
- Replaced the `Turno / Caja` dropdown with an always-visible `Caja del turno` panel in the right rail.
- Added direct `Cambio` and `Movimiento` actions without moving payment controls out of the first viewport.
- Added a recent-movements ledger with running cash balance; opening balance, manual movements and cash sales update it immediately.
- Unified cash income and withdrawal in one `Movimiento de caja` dialog with type, amount, reason and optional observations.
- Removed the manual exchange scenario selector. Incoming and outgoing article lists now calculate positive, zero or negative balance automatically.
- Exchange lines support product search, quantity changes and removal, and an empty exchange cannot be confirmed.

## Documentos corrective pass · 2026-07-22

- The initial corrective pass moved filters out of a `Sheet`; the later explicit correction removed the temporary popover entirely.
- Search, period, exact type, status, point of sale/deposit and annulled state are now permanently visible and apply immediately.
- `Todos`, `Facturas`, `Notas` and `Remitos` use the repository's Radix/shadcn `Tabs`, not `Button` or `ToggleGroup`.
- Reorganized the sidebar to expose `Documentos`, `Pagos` and `Proveedores` under Compras, and `Facturacion rapida`, `Documentos`, `Cobros` and `Clientes` under Ventas.
- Added Pagos and Cobros to the navigation architecture; the later corrective pass replaced their temporary placeholders with the shared operational workspace documented in `views/pagos-y-cobros.md`.

Corrective-pass verification:

- `npm run lint`: pass.
- `npx tsc --noEmit`: pass.
- `npm run build`: pass; static `/` route generated.
- `git diff --check`: pass.
- Browser smoke test at the available desktop viewport: purchase and sale navigation, anchored filter panel, exact-type filtering, result/count update, active-filter badge, Escape dismissal with focus return, and Pagos placeholder.
- Local prototype remains available at `http://localhost:3100` and returned HTTP 200 after the production build.

## Pagos y Cobros corrective pass · 2026-07-22

- Replaced the temporary navigation placeholders with one reusable `MoneyTransactionsWorkspace` configured by `context: payment | receipt`.
- `Compras > Pagos` now lists payment orders, searches by number/provider/CUIT and exposes `Nueva orden de pago`.
- `Ventas > Cobros` now lists receipts, searches by number/customer/CUIT and exposes `Nuevo recibo`.
- Both views reuse the compact visible filter bar, dense table, detail sheet, audit disclosure and creation sheet.
- Creation inherits the business context and does not ask purchase/sale again. It creates a local `Borrador · demo` and opens its detail without executing money movement.
- Mock data covers three payment orders and three receipts, with counterpart, total, detail, state, related document, location and audit.
- Domain placeholders were narrowed to the genuinely unvalidated rules: document application, payment/collection methods, retentions, permissions and accounting effects.
- Table minimum width was kept compact so the operational list fits the available desktop workspace while retaining horizontal fallback on narrower screens.

Corrective-pass verification:

- `npm run lint`: pass.
- `npx tsc --noEmit`: pass.
- Browser smoke: payment-order list, filters, creation form, enabled validation, draft insertion, detail opening and receipt-list context.

## Visible filters and Tabs correction · 2026-07-22

- Removed every `Mas filtros` trigger and filter popover from Documentos, Pagos and Cobros.
- Exposed all available criteria directly in compact labeled filter bars with responsive wrapping.
- Replaced the document-family button group with the actual shadcn/Radix `Tabs`, preserving counts and keyboard selection semantics.
- Removed the now-unused local `Popover` primitive.
- Browser QA confirmed a real `tablist`/`tab` accessibility tree, immediate filtering through `Notas`, all criteria visible, and the table still present in the first desktop viewport.

## Search and filter bar contract · 2026-07-22

- Separated search into a full-width first row in Documentos, Pagos and Cobros.
- Consolidated the second row as one filter bar: scope `Tabs` on the left and the flexible filter group on the right.
- Removed visual field titles above filters. Each control now identifies its criterion in the visible value, such as `Periodo: 30 d` or `Estado: todos`, while retaining an explicit accessible name.
- Kept all criteria permanently visible and immediately applied; there is no `Mas filtros`, popover, drawer, sheet or apply action.
- Added `patterns/search-filter-bar.md` as the general product contract for filtered lists.

## Unified query surface correction · 2026-07-22

- Removed the `flex: 1` wrappers that stretched filter controls beyond their visible content.
- Period, type, state, point/local and annulled controls now use compact content width; remaining space separates the scope Tabs from the filter group.
- Moved title/CTA, search, filters and table into one visual work surface with one shared padding contract.
- Removed the border and background change that visually separated filters from their results.
- Kept the table border only as the boundary of the data grid, not as a separate page section.

## Diseño e impresión de etiquetas · 2026-07-22

- Added `Diseño de etiquetas` and `Impresión de etiquetas` as distinct destinations under `Catalogo`.
- Implemented the documented four-zone designer with visible save, unsaved state, inline validation, a selectable mock canvas and conservative property placeholders.
- Implemented the operational print list with direct search, inline quantities, persistent totals, visible design/preview/action rail and explicit disabled reasons.
- Connected both views through shared local state: `Crear diseño` preserves the print batch, saving returns to printing and preselects the new design.
- Left weight-to-label calculation, scales, printer APIs, element-specific properties and real barcode/QR generation explicitly unimplemented pending domain validation.

Verification for this pass:

- `npm run lint`: pass.
- `npx tsc --noEmit`: pass.
- `npm run build`: pass; static `/` route generated.
- `git diff --check`: pass.
- Browser smoke at `1280 × 720`: no-design blocker, create/name/add/select/save, automatic return and preselection, quantity totals, representative preview and simulated print feedback.
- Tablet check at `1024 × 768`: no document-level horizontal overflow; print rail remains visible and the multi-row designer exposes its lower configuration through bounded internal scroll.
- Browser console: no errors or warnings.

## Cuenta corriente de clientes · 2026-07-22

- Added `Cuenta corriente` under `Ventas`, separate from the receipt-creation flow in `Cobros`.
- Replaced the empty query-first state with a searchable table of customers that have current accounts.
- Clicking a row opens a focused report-criteria drawer; generating the report moves to a full-width accounting surface.
- Removed the unconfirmed `Empresa` criterion and all explanatory helper copy from the drawer; `Consolidado` and `Remitos` remain label-only checkbox rows.
- Added the same destination from the selected customer detail with the report drawer preloaded for that customer.
- Preserved the neutral balance summary, local concept filtering and currency-grouped movements in the generated report.
- Kept accounting calculations as supplied mock data and left signs, pesification, days, consolidation, remittance impact and permissions as explicit placeholders.
- Print, export and related-document actions are simulated and do not modify or clear the account statement.

- `npm run lint`, `npx tsc --noEmit`, `npm run build` and `git diff --check`: pass.
- Desktop `1280 × 720`: list, drawer action and generated report critical path remain in the first viewport.
- Tablet `1024 × 768`: no page overflow and the drawer CTA remains visible.
- Browser smoke covered list search, row selection, report drawer, generation, return and contextual client preload; console clean.

## Verification

- `npm run lint`: pass, no warnings.
- `npx tsc --noEmit`: pass.
- `npm run build`: pass; static `/` route generated.
- `git diff --check`: pass.
- Browser console: no errors or warnings.
- Desktop viewport: `1440x900`.
- Mobile viewport: `390x844`, no document-level horizontal overflow.

Browser smoke coverage:

- POS with closed cash register and blurred/disabled workspace while sidebar navigation remains enabled.
- Cash-register opening and seller propagation.
- Open POS with ticket, all required columns, trash actions, scanner and six visible favorites.
- Cash, card and mixed payments; confirm disabled until amount and required method fields are complete.
- Exchange positive, zero and negative results derived from incoming/outgoing article totals.
- Article detail drawer, creation drawer, optional image validation and all edit steps.
- Customer fiscal detail, supplier minimum creation and warehouse cost-center creation.
- Kiosk found, multiple, no-price, no-image and not-found states.
- Collapsible desktop sidebar and mobile sidebar trigger.

## Facturacion rapida · tres acciones directas · 2026-07-31

- Replaced the single `Cobrar` CTA in POS alternatives A, B and C with three adjacent actions: `Efectivo`, `Fac. E · Efectivo` and `Fac. E · Tarjeta`.
- Cash actions preload `Efectivo`; the card action preloads `Tarjeta`. Completion feedback distinguishes a cash sale from either electronic-invoice path.
- Removed the `CANTIDAD` summary metric from the bottom totals area in A, B, C and mobile; item-level quantity controls and the explicit unit information remain unchanged.
- Verified all desktop alternatives at `2048 × 1178`: three actions visible, no document overflow, no horizontal overflow and no bottom quantity metric.
- `npm run lint` and `npx tsc --noEmit`: pass.

Critical viewport result:

- At `1440x900`, scanner, active ticket, item removal, totals and both direct payment actions are visible without page scroll.
