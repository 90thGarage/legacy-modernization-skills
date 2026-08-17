# Facturacion Avanzada - Implementation Notes

## Status

- Implemented on 2026-07-31 as an interactive prototype.
- Desktop layout revised on 2026-07-31 after client feedback about viewport overflow, unused card space and weak fiscal-type hierarchy.
- A/B comparison added on 2026-07-31 to preserve the previous tabbed composition while testing the guided composition.
- Option C added on 2026-07-31 to test a block-free, hierarchy-first header.
- Option D added on 2026-07-31 to test a physical-invoice mental model.
- Responsive tablet/mobile pass completed on 2026-07-31 for options A, B, C and D without changing the approved desktop composition.
- Canonical UX contract: `./facturacion-avanzada.md`.
- Prototype component: `../../../skill-flow-test/next-sandbox/src/features/infomanager/components/advanced-invoicing-workspace.tsx`.
- Runtime route: single-page prototype, available from `Ventas > Facturacion avanzada` after signing in as `admin / infomanager`.

## Implemented

- Independent `advanced-invoicing` view and navigation entry, separate from Facturacion Rapida.
- Fixed visual sequence: Cabecera, Items, preparacion del comprobante y barra unificada de resumen/finalizacion.
- Header blocks:
  - Cliente y comprobante.
  - Condiciones comerciales.
  - Logistica.
  - Control interno.
- Local configuration sheet with:
  - visibility toggles by block;
  - visibility toggles by field;
  - visibility toggles by item column;
  - complete and essential presets;
  - automatic layout recomposition without empty reserved columns.
- Stable anchors in the prototype:
  - Cliente y comprobante block;
  - client, document type, point of sale and date;
  - article identity, quantity and amount;
  - summary, total and emission action.
- Item table with a legacy-derived sample line, product addition from mock catalog, inline quantity/price/discount editing, removal and live recalculation.
- The item surface now uses the same full-grid treatment as Facturacion Rapida: persistent column separators and empty horizontal rows fill the available height in both A and B.
- Column proportions are content-aware, and numeric inputs use bounded widths instead of stretching across their cells.
- Item-entry refinement after visual feedback:
  - removed the redundant Items title/count toolbar;
  - placed a full-width search row immediately above the grid headers;
  - replaced the select-plus-button interaction with searchable suggestions;
  - selecting a suggestion or pressing Enter on an exact/unique match adds the item immediately.
- Added an A/B switcher to the right side of the application header. Switching is immediate and keeps the same invoice state.
- Option A restores extension tabs: Items, Percepciones, Vencimientos, Remitos, Presupuestos and Pagos. Its metrics, total and actions share one footer without a redundant summary heading.
- Option B is the default guided alternative. It replaces extension tabs with a preparation checklist above item search: Cobro, Impuestos, Entrega, Origen and Pagos.
- The checklist reports total progress and explicit `Definido`, `Opcional` or `Falta definir` states. It avoids numbering because the decisions are not strictly sequential.
- `Completar pendientes` opens the first missing decision. Each item remains independently clickable and opens a contextual editor; the item grid never disappears.
- Option C removes the redundant invoice identity bar and all header cards. The fiscal letter is embedded beside the primary fields in one continuous surface.
- C uses a compact currency selector (`$ · ARS` / `US$ · USD`), keeps frequent commercial fields visible and moves internal number, company, cost center and batch into a `Mas datos` sheet.
- C intentionally omits the local view configurator; field visibility is treated as a user-profile concern.
- C now reuses A's extension tabs instead of B's preparation checklist, and renders Observaciones as a 64px multiline field so the item grid yields some vertical space.
- Option D divides the header into customer and document halves, places the fiscal letter across their divider, and reuses A's extension tabs.
- D caps the physical-document header with `clamp(326px, 37vh, 360px)` and assigns the remaining height to items. Invoice data appears on the left, customer data on the right, and Observaciones uses a compact responsive height immediately below its label. The document actions sit directly below the last field row instead of being pushed to the panel bottom, and only the first customer row reserves space for the centered fiscal letter. Twelve-pixel panel padding and slightly wider field gaps keep the compact header from touching its borders. At `1366 x 768`, the complete workspace remains within the viewport while the grid retains useful editing space.
- Summary with discount, net, VAT, internal taxes, perceptions and dominant total.
- Both alternatives use a unified summary/completion bar with one row on wide desktop and two internal rows on medium desktop. A intentionally omits the summary heading and prototype disclaimer.
- Single-viewport desktop composition:
  - compact fiscal letter tile;
  - asymmetric header modules instead of equal-height cards;
  - item grid consumes remaining height;
  - only the item body can scroll;
  - summary remains visible above the completion actions.
- Responsive composition below the desktop breakpoint:
  - A and B use a two-column tablet header and stacked mobile fields;
  - C keeps its compact fiscal-letter/client relationship while recomposing frequent fields into two or three columns;
  - D exposes a compact fiscal tile inside the document panel when the centered desktop tile is unavailable;
  - item rows become editable cards, eliminating the rigid table-width dependency on tablet and mobile;
  - the A/B/C/D switcher uses full labels on tablet and single-letter labels on mobile;
  - metrics scroll within their own strip on mobile, while total and actions receive dedicated rows;
  - action buttons use a two-column mobile grid and remain fully visible above the mobile navigation.

## Prototype Decisions

- Configuration lives in local React state and resets on reload. This deliberately avoids inventing a tenant persistence contract before client validation.
- Configuration changes presentation only. Fiscal rules, derivations and permissions remain outside the UI configuration model.
- The sample values reproduce the intent of the legacy capture: Factura A, internal number `51950660`, point of sale `00002`, date `29/07/2026`, a discounted monthly service and a total close to `$ 498.941,44`.
- The complete preset demonstrates the maximum-density configuration; the essential preset demonstrates recomposition when optional logistics, fields and columns are hidden.
- Existing prototype permissions apply: Administrator can access this view; Seller remains limited to Facturacion Rapida and Articulos.

## Not Implemented

- Persistence by organization, company, location, point of sale or user profile.
- Real ARCA, CAE, fiscal validation, stock, accounting, current-account or audit side effects.
- Effective generation of delivery notes, receipts, notes or payment records.
- Authorization workflow for price lists, discounts or sale conditions.
- Final field dependency engine and per-document-type configuration.

## Verification

- `npm run lint -- --no-warn-ignored`: pass.
- `npx tsc --noEmit`: pass.
- `npm run build`: pass with Next.js production build.
- Browser smoke test with Chromium at `1600 x 1100`:
  - admin login: pass;
  - navigation to `Ventas > Facturacion avanzada`: pass;
  - complete configuration renders four header blocks: pass;
  - essential preset hides Logistica and secondary fields/columns while preserving the three structural zones: pass;
  - adding a catalog product creates a second item row: pass;
  - simulated invoice emission returns confirmation feedback: pass.
- Desktop viewport regression:
  - `2048 x 1178`, option A: workspace `clientHeight` and `scrollHeight` both `1130`; pass.
  - `2048 x 1178`, option B: workspace `clientHeight` and `scrollHeight` both `1130`; pass.
  - `1440 x 900`: workspace `clientHeight` and `scrollHeight` both `852`; pass.
  - `1366 x 768`: workspace `clientHeight` and `scrollHeight` both `720`; pass.
  - Cabecera, Items, Resumen and `Emitir factura` visible together at every tested size: pass.
- Responsive browser regression across A, B, C and D:
  - `768 x 1024`: document, body and workspace horizontal overflow all `0`; pass.
  - `390 x 844`: document, body, workspace and item editor horizontal overflow all `0`; pass.
  - mobile item card remains fully editable after scrolling to the end of the document: pass.
  - total and all four completion actions remain inside the viewport above the mobile navigation: pass.
  - `1440 x 900` rerun after responsive changes: horizontal overflow `0` for all four alternatives and desktop composition preserved; pass.

## Next Validation

The next review should focus on product decisions rather than visual polish:

1. Confirm the default block set for the first real client.
2. Mark each captured legacy field as always required, configurable or obsolete.
3. Decide whether configuration varies by organization, company, branch, point of sale or role.
4. Compare option A (tabs) and option B (guided steps), then validate the chosen extension model and its order.
5. Validate whether `Guardar borrador`, `Vista previa` and `Emitir factura` match the real lifecycle and terminology.
