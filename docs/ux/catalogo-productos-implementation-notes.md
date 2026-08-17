# Catalogo de productos implementation notes

## Summary

- Destination: `skill-flow-test/next-sandbox`.
- Route: `/`.
- Main files:
  - `skill-flow-test/next-sandbox/src/app/page.tsx`
  - `skill-flow-test/next-sandbox/src/features/catalogo-productos/catalogo-productos-view.tsx`
- Handoff: `docs/ux/catalogo-productos-ui-handoff.md`

## shadcn components used

- `Button`
- `Input`
- `Table`
- `Badge`
- `Sheet`
- `Select`
- `Checkbox`
- `Alert`
- `DropdownMenu`
- `Separator`
- `Textarea`
- `TooltipProvider` from the existing app layout

No new shadcn components were installed. `Accordion`, `Dialog`, and `Switch` were not present in the sandbox, so the prototype uses existing `Sheet`, composition sections, and compact custom toggle buttons styled with InfoManager tokens.

## Design tokens used

- Colors: existing CSS variables mapped to InfoManager values in `src/app/globals.css`.
- Radius: `rounded-[4px]` on operational panels, inputs, buttons, badges, sheets, and table-adjacent controls.
- Density: compact rows, fixed header, scrollable table region, persistent side panel.
- Typography: `font-sans` and `font-mono` variables already configured in the sandbox.

## Font setup

The sandbox declares:

- `--font-suisse-intl`
- `--font-geist-mono`
- `--font-neue-montreal`

No actual font files or external font imports were found. The prototype therefore uses the declared variables with system fallbacks. This should be wired to real font assets before production review.

## Implemented UX contract

- Single `Catalogo de productos` workspace instead of legacy ABM tabs.
- Product search directly above the product table.
- Mobile catalog uses a two-column product grid with compact responsive cards; desktop list/grid behavior remains unchanged.
- Mobile cards preserve image, two-line name, code/barcode, price, enabled state, stock, classification and row actions without horizontal overflow.
- Product table renders codigo, nombre, codigo de barras, precio, stock, rubro/subrubro and estado.
- Persistent right-side quick panel renders selected product, price, code, barcode, enabled state, stock summary, stock by warehouse and actions.
- Quick edit supports code, barcode, price and enabled state in local mock state.
- Stock adjustment is a sheet with deposito, current stock, new quantity and required motivo.
- Creation and full edit use a guided sheet with base fields and capability sections.
- Capability sections include venta/codigos, stock/depositos, proveedor/logistica, balanza/PLU, series, variaciones and costos/receta.
- Rubro/subrubro contextual creation is represented with duplicate warning behavior.
- Destructive delete is demoted and disabled with a permission note.

## Data contract notes

- Mock `Product`, `Category`, warehouse stock, serials, characteristics and scale plugin status are represented locally in the feature file.
- The prototype includes examples for normal product, missing barcode, disabled product, multiple warehouses, missing scale plugin, serials, variations and incomplete price.
- Backend-required fields remain unknown per the handoff and are represented as UI assumptions rather than hard validation.
- Stock adjustment does not mutate stock in the mock dataset yet; it validates the required audit fields and closes on valid confirmation.

## Verification

```txt
lint: npm run lint -> passed
build: npm run build -> passed
browser/screenshot: opened http://127.0.0.1:3000 at 1366x768 and captured viewport
critical viewport: passed visually and via DOM snapshot; search, table, selected product, stock/status, Crear producto, Ajustar stock, Guardar cambios and Editar completo were visible without scrolling
```

### Mobile two-column correction · 2026-07-28

- Browser QA at 390x844: two equal 171.5 px columns, no card or document horizontal overflow.
- Browser QA at 320x720: two equal 136.5 px columns, no card or document horizontal overflow.
- Edit, duplicate and delete actions remain inside each card at both mobile widths.
- Desktop QA at 1366x768: the default compact table remains active and has no document overflow.

## Browser interaction limitation

In the in-app browser automation, the rendered page and client chunks were present, but automated React interactions did not update state: filling search changed the DOM input value but did not filter rows, and clicking `Crear producto` did not open the sheet. No browser console errors were reported, and the HTML included Next client page chunks. This appears specific to the verification surface and should be rechecked in a normal browser session at `http://127.0.0.1:3000`.

## Open assumptions

- Real backend validation for minimum product fields.
- Whether rubro/subrubro is required or recommended.
- Fiscal validation for Concepto AFIP and units.
- Permission model for destructive and expert actions.
- Exact persistence model for stock audit records.
