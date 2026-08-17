# Impresión de Etiquetas · Implementation Notes

## Prototype destination

- App: `skill-flow-test/next-sandbox`.
- Navigation: `Catalogo > Impresión de etiquetas`.
- Component: `src/features/infomanager/components/label-workspaces.tsx`.

## Implemented contract

- Preserves the operational structure: search over the dominant article table, persistent batch summary and visible right print rail.
- Search filters by code, description and barcode without opening another surface.
- Quantity is edited in place; a value above zero incorporates the row into the mock batch and updates both row and total counts.
- The print rail contains design selection, representative preview, total, explicit disabled reason and the primary `Imprimir` action.
- The no-design state offers `Crear diseño` directly and preserves the current batch across the round trip.
- The scale warning is contextual and does not block products sold by unit.
- The article table and rail keep their own bounded working regions for desktop and reflow into one column on narrower tablet widths.

## Conservative placeholders

- For simple products, the prototype assumes `Cantidad = copias`, as permitted by the view contract.
- Weight entry and its relationship with quantity or label count remain disabled and marked as pending because the business rule is unvalidated.
- Scale and printer integrations are not executed.
- `Imprimir` produces explicit simulated feedback and represents opening the operating-system dialog; it does not select a printer or clear the batch.
- State is local and resets on reload; no API, hardware integration or audit persistence is integrated.

## Accessibility

- Search and per-row quantity controls have explicit accessible names.
- Disabled print state is explained in text instead of relying on opacity or color.
- Empty search, no-design and preview guidance remain visible in their relevant regions.

