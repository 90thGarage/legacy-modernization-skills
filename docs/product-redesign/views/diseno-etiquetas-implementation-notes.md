# Diseño de Etiquetas · Implementation Notes

## Prototype destination

- App: `skill-flow-test/next-sandbox`.
- Navigation: `Catalogo > Diseño de etiquetas`.
- Component: `src/features/infomanager/components/label-workspaces.tsx`.

## Implemented contract

- Preserves the four working zones from the documented flow: tools and saved designs, canvas, selected-element properties and page configuration.
- Keeps `Guardar diseño` visible in the workspace header.
- Supports starting and naming a design, setting its dimensions and orientation, adding the four documented element types and selecting an element on the canvas.
- Shows zoom controls plus the small UX improvement `Ajustar al lienzo`.
- Shows `Sin guardar`, validates name and dimensions inline, and confirms before replacing or leaving the current draft through workspace actions.
- Saving adds or updates local shared prototype state, making the design immediately available in label printing.
- When entered from the no-design blocker in printing, saving returns to printing with the new design selected and the existing batch preserved.

## Conservative placeholders

- Element-specific properties remain explicitly marked as pending validation; the prototype does not invent typography, barcode, QR, data-binding, positioning or print-production rules.
- Canvas elements can be added and selected. Dragging, resizing, layers, undo history, autosave and real barcode/QR generation are outside the validated contract.
- The page-format list contains only `Formato personalizado` because additional physical formats are not documented.
- State is local and resets on reload; no API or persistence is integrated.

## Accessibility

- All tool and canvas controls are keyboard-focusable buttons with accessible names.
- Name and size errors are visible and exposed through invalid field state.
- Unsaved changes use a modal confirmation with an explicit safe return action.

