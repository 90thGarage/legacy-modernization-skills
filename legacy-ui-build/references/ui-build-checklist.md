# UI Build Checklist

Use this checklist before finishing a generated view.

## Handoff Compliance

- The build goal from `ui-handoff.md` is satisfied.
- The layout contract is followed.
- Always-visible information is visible.
- Secondary information uses progressive disclosure.
- Hidden or excluded legacy information is not reintroduced.
- Required actions are present.
- Required states are represented.

## shadcn Usage

- UI uses shadcn primitives or client wrappers around shadcn.
- Missing shadcn components were installed or documented.
- Local components are composition-only.
- No new visual primitives were invented.

## Client Design System

- Colors match `client-design-system.md`.
- Radius matches the client token.
- Spacing and density match the client rules.
- Typography follows the client rules.
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

## Verification

Record commands run and results in `implementation-notes.md`.

```txt
lint:
typecheck:
test:
build:
browser/screenshot:
```
