# Documentos Comerciales - Implementation Notes

## Scope

- Implemented in: `skill-flow-test/next-sandbox`.
- Product contract: `docs/product-redesign/views/documentos-comerciales.md`.
- Integration type: existing flow extension inside the current InfoManager prototype.
- The product-redesign view contract was treated as the implementation handoff because there is no separate `documentos-comerciales-ui-handoff.md`.
- No backend, API, routing layer or real fiscal integration was added.

## Product Context Applied

- Compra/venta is inherited from navigation and is never requested again in the document form.
- `Compras > Documentos` and `Ventas > Documentos` reuse the same workspace configured with `context: "purchase" | "sale"`.
- `Facturacion rapida / POS` remains a separate operational destination.
- Payments, payment orders, collections and receipts are not exposed as document types.
- Invoice, credit note, debit note and delivery note are represented as types and filters in one collection instead of permanent separate screens.
- The preferred note path starts from an invoice and keeps the origin visible.
- Audit data is shown inside the detail drawer, not as primary table columns.

## Components Implemented

- `CommercialDocumentsWorkspace`
- `NewDocumentMenu`
- `CreateNoteMenu`
- `DetailSheet`
- `FiltersSheet`
- `DocumentFormSheet`
- Shared commercial document types and isolated mock records.

## shadcn Components Used

- `Alert`
- `Badge`
- `Button`
- `Checkbox`
- `Dialog`
- `DropdownMenu`
- `Input`
- `Select`
- `Sheet`
- `Skeleton`
- `Table`
- `Textarea`
- Existing sidebar primitives from the application shell.

Local components are compositions of these primitives. No new design-system primitive was introduced.

## Design Tokens Applied

- Existing InfoManager CSS variables for background, surface, foreground, muted text, border, primary blue and destructive states.
- `4px` radius on interactive controls, menus, panels, badges, tables, drawers and dialogs.
- Compact operational spacing based on the existing 4px scale.
- Dense table rows and mono table headers/numeric values.
- Primary blue is reserved for the dominant action and selected family filter.
- No global styles or token files were changed.

## Typography Gap

- The project declares `--font-suisse-intl` and `--font-neue-montreal`, but no local font files or imports were found.
- `--font-geist-mono` currently points to system mono fallbacks instead of loading Geist Mono.
- The implementation inherits the existing variables and fallbacks. It does not claim that the proprietary fonts are loaded.
- Required future setup: provide licensed Suisse Intl and Neue Montreal assets/imports and load Geist Mono, then point the existing CSS variables to the real font faces.

## Data And Field Traceability

Represented in `CommercialDocument`:

- context;
- family and exact type label;
- date and number;
- client/supplier identity and tax ID;
- subtotal, taxes, total and currency;
- status;
- related/origin document;
- point of sale/deposit;
- optional fiscal state;
- line items with code, description, quantity, unit price and VAT rate;
- creation/update audit.

The primary table renders date, number, counterparty, type, total, status, related document and contextual actions. Point of sale, fiscal state, items and audit remain in the detail surface.

## Interactive States Represented

- Initial loading skeleton.
- Loaded purchase and sale collections.
- Empty collection contract.
- Empty filtered result with reset action.
- Quick family filters.
- Secondary filters in a sheet.
- Selected document detail.
- Note creation without an origin selected.
- Note creation from an invoice with preloaded counterparty and items.
- Disabled emission until origin, reason and at least one item are present.
- Explicit confirmation before simulated emission.
- Simulated success added to the table and opened in the detail drawer.
- Non-authoritative status and fiscal-impact warnings.

## Assumptions And Product Gaps

- Purchase, note and invoice rules have insufficient evidence in `docs/ux/product-context.md`.
- Mock statuses ending in `· demo` are visual examples, not formal product states.
- Reason/subtype options ending in `· ejemplo` are placeholders and are not a final fiscal catalog.
- Totals and VAT calculations are visual prototype calculations only.
- It is not confirmed whether every credit/debit note must reference an invoice. The prototype requires an invoice to enable the simulated note action and labels this rule as pending validation.
- Permissions are not specified. The prototype assumes the logged-in demo user can view and start the represented flows.
- Fiscal, accounting, stock and current-account effects are not implemented.
- Invoice and delivery-note entry points open a contextual placeholder surface, but their completion action remains disabled until those contracts are defined. This avoids inventing required fields or irreversible effects.
- Annulment/reversal is not implemented because states, permissions, reasons and recovery rules are unresolved.

## Integration Notes

- Added view IDs `purchase-documents` and `sale-documents` to the existing state-based navigation model.
- Added `Documentos` beneath `Compras` and `Ventas` without introducing a router.
- Kept the existing shell, POS and entity workspaces unchanged.
- Mock documents live with the existing prototype mock data and are held in top-level prototype state so a simulated note remains visible while switching between purchase and sale views.
- The note form is a wide Sheet with a sticky footer. On desktop and 1024px tablet, the summary remains beside the working form so total and primary action remain visible.

## Verification Performed

- Focused ESLint during implementation: passed after removing synchronous state resets from effects.
- Full lint: `npm run lint` - passed.
- TypeScript and production build: `npm run build` - passed.
- Browser console warnings/errors: none during tested flows.
- Desktop visual QA: 1440x900.
  - Header, search, period, filters, quick scopes and table visible in the first viewport.
  - Table contained no body-level horizontal overflow.
  - Detail drawer preserved the underlying list context.
  - Note form showed origin, items, summary and sticky completion action without overlap.
- Tablet visual QA: 1024x768.
  - Body remained 1024x768 without document-level overflow.
  - Table used its internal horizontal scroll region.
  - Note form used a two-column critical layout with total and completion action visible.
- Interactions checked:
  - `Compras > Documentos`.
  - `Ventas > Documentos`.
  - `Todos > Notas > Todos` without navigation.
  - Invoice detail drawer.
  - `Invoice > Crear nota > Nota de credito` with origin preloaded.
  - `Nuevo documento > Nota de credito` with origin selection.
  - Simulated confirmation and resulting row/detail.
  - Purchase and sale labels/party columns.

## Files Changed For This Flow

- `skill-flow-test/next-sandbox/src/features/infomanager/components/commercial-documents-workspace.tsx`
- `skill-flow-test/next-sandbox/src/features/infomanager/components/app-shell.tsx`
- `skill-flow-test/next-sandbox/src/features/infomanager/index.tsx`
- `skill-flow-test/next-sandbox/src/features/infomanager/mock-data.ts`
- `skill-flow-test/next-sandbox/src/features/infomanager/types.ts`
- `docs/ux/documentos-comerciales-implementation-notes.md`
