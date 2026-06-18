# UI Build Checklist

Use this checklist before finishing a generated view.

## Handoff Compliance

- The build goal from `ui-handoff.md` is satisfied.
- The layout contract is followed.
- Always-visible information is visible.
- Secondary information uses progressive disclosure.
- Hidden or excluded legacy information is not reintroduced.
- The field traceability matrix is followed.
- Each data key required by the handoff is rendered, mocked, or explicitly documented as unavailable.
- Required actions are present.
- Required states are represented.

## Data Contract

- Entities from the handoff are represented in local types, props, mock data, or integration notes.
- Required, optional, nullable, derived, and display-only values are handled intentionally.
- Tables/arrays follow the specified row identity, columns, empty state, row actions, and bulk actions.
- Status values use the specified labels, business meaning, and visual treatment.
- Missing data rules use documented fallbacks rather than ad hoc placeholders.

## shadcn Usage

- UI uses shadcn primitives or client wrappers around shadcn.
- Missing shadcn components were installed or documented.
- Local components are composition-only.
- No new visual primitives were invented.

## Design System

- Colors match `design.md`.
- Radius matches the client token.
- Spacing and density match the client rules.
- Typography follows the client rules.
- Required fonts are actually loaded or missing font setup is documented.
- Buttons, panels, cards, inputs, badges, tabs, dialogs, and operational sections use 4px radius unless an existing repo component forces otherwise.
- Buttons, tables, forms, badges, tabs, and panels follow documented component rules.
- Incomplete design system inputs are recorded as assumptions.

## React Project Fit

- Imports follow repo aliases.
- File naming follows repo conventions.
- Styling follows repo conventions.
- Client/server component rules are respected.
- Mock data is isolated when used.
- Integration notes explain any manual steps.

## Visual QA

- Text does not overflow buttons, cards, table cells, or headers.
- Layout works at desktop and mobile widths when applicable.
- Empty, loading, error, and permission states do not look broken.
- Actions are visually prioritized.
- The screen looks like the client's product, not default shadcn.

## Critical Path / Viewport QA

Use for high-frequency operational workflows such as billing, POS, fast entry, approvals, or irreversible submit flows.

- The baseline desktop viewport from the handoff was checked.
- The primary input or command area is visible without scrolling.
- For item-entry screens, the search/code/name input is directly above the items table/list it fills.
- The active working record/list is visible without scrolling.
- The total/status/blocking validation area is visible without scrolling.
- The primary completion action is visible without scrolling.
- Secondary actions do not push the critical path below the fold.
- The main table/list is the scrollable region when vertical space is constrained.
- Card padding, decorative panels, and vertical chrome were reduced when they hurt operational fit.
- Useful legacy layout strengths were preserved even when the visual style changed.
- If any critical-path item is below the fold, revise the layout before finishing.

## Verification

Record commands run and results in `implementation-notes.md`.

```txt
lint:
typecheck:
test:
build:
browser/screenshot:
critical viewport:
```
