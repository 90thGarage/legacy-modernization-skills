# Builder Checklist

Use this checklist before finishing a generated view.

## Handoff Compliance

- The build goal from `<view-name>-ui-handoff.md` is satisfied.
- Product context and flow references from the handoff were read when available.
- Product-level labels, entities, roles, permissions, and reusable patterns are followed.
- Flow integration requirements, entry points, exit points, and blocking dependencies are represented or documented.
- The layout contract is followed.
- Always-visible information is visible.
- Secondary information uses progressive disclosure.
- Hidden or excluded legacy information is not reintroduced.
- The field traceability matrix is followed.
- Each data key required by the handoff is rendered, mocked, or explicitly documented as unavailable.
- Required actions are present.
- Required states are represented.

## Data Contract

- Shared entities from product context are not renamed or reshaped without a handoff instruction.
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
- No column, rail, or fixed-height region remains empty while the primary workflow continues in a narrower adjacent area.
- Derived values stay attached to the table or input surface that produces them unless a separate panel has an independent contextual purpose.
- A lateral summary does not duplicate a dominant total already visible in the completion bar.
- Sequential forms follow a clear context → input → review → completion order.
- The only completion action is not placed above a form that progresses downward.
- Sticky completion bars are last in DOM order and explain the next action or blocking state.

## UI Review Fix Plan Compliance

Use when a `<view-name>-ui-review.md`, `ui-fix-plan.md`, or screenshot-based correction plan is provided.

- Every Critical finding is fixed or explicitly documented as not applicable.
- Every High finding is fixed or explicitly documented as not applicable.
- Required changes are applied without replacing the original handoff.
- Areas marked "Do not change" are preserved.
- Review acceptance checks are verified.
- Skipped findings include a concrete reason in `<view-name>-implementation-notes.md`.

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

Record commands run and results in `<view-name>-implementation-notes.md`.

```txt
product context:
flow context:
lint:
typecheck:
test:
build:
browser/screenshot:
critical viewport:
```
