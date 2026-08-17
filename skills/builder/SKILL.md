---
name: builder
description: Build React views from legacy modernization UI handoffs using shadcn/ui adapted to the design system.
---

Use this skill when the user has a `<view-name>-ui-handoff.md` from `planner` and wants to generate a React web app view.

The skill builds code in the user-specified destination. It does not deeply integrate routing, providers, app shell, or global navigation unless the user explicitly asks.

## Required References

Before writing code, read:

- The provided `<view-name>-ui-handoff.md`
- `../shared/references/product-modernization-rules.md`
- `references/design.md`
- `references/component-library.md`
- `references/product-domain.md`
- `references/ui-build-checklist.md`

If `<view-name>-ui-handoff.md` references `<view-name>-ux-brief.md`, read it only when the handoff is ambiguous or when UX intent is unclear.

If the handoff references `docs/ux/product-context.md` or `docs/ux/flows/<flow-id>.md`, read them before implementation. Treat documented roles, journeys, labels, entities, permissions, reusable patterns, and global UX rules as product requirements.

If the handoff contains a field traceability matrix or data shape contract, treat them as implementation requirements. Do not omit, rename, exclude, or reclassify fields, actions, statuses, or data relationships unless the handoff explicitly allows it.

## Inputs

Required:

- Path to `<view-name>-ui-handoff.md`
- Destination path for generated code
- React project or target folder

Recommended:

- `<view-name>-ux-brief.md`
- `<view-name>-ui-review.md` or another UI correction plan
- `docs/ux/product-context.md`
- `docs/ux/flows/<flow-id>.md`
- Legacy screenshot
- Existing repo conventions
- Completed design system reference

## Design System Priority

Use this priority order:

1. Existing project conventions and design system.
2. shadcn/ui primitives adapted to the design system.
3. Composition of shadcn primitives.

Do not create new visual primitives outside shadcn or the design system.

Allowed:

- Local composition components for readability, such as `CustomerSummaryPanel`.
- Installing or adding missing shadcn components when needed and appropriate.
- Styling shadcn components with the client's tokens, colors, radius, spacing, density, and typography.

Not allowed:

- New design system primitives such as `CustomButton`, `FancyCard`, or `StatusPill` that invent a separate visual language.
- Decorative UI that conflicts with the handoff or design system.
- Reintroducing legacy fields listed under `Do Not Include`.

## Incomplete Design System Rule

If `design.md` is incomplete, continue with conservative shadcn-compatible defaults. Do not block.

Write assumptions in `<view-name>-implementation-notes.md`, including missing tokens or component rules.

If the design system is complete, follow it directly.

## Repo Exploration

Before implementation, inspect the target project for:

- package manager
- React framework
- Tailwind setup
- `components.json`
- existing shadcn components
- existing CSS variables or theme files
- existing font imports, `@font-face` declarations, local font files, or framework font configuration
- component import aliases
- lint/build/test commands

Prefer existing repo patterns over generic examples.

## Handoff Contract Rules

Before writing code, identify from `<view-name>-ui-handoff.md`:

- product context references
- flow integration requirements
- field traceability matrix
- critical viewport contract
- data shape entities
- fields and nullability
- arrays, tables, and row actions
- status values and visual treatments
- derived/display-only values
- example data notes

Use these sections to create mock data, props, types, UI states, table columns, labels, fallbacks, and status displays.

If the handoff is missing a required field, data key, nullability rule, or status value, do not silently invent product semantics. Use conservative UI placeholders and record the assumption in `<view-name>-implementation-notes.md`.

## Product Context Contract Rules

When product context or flow context is available:

- use product-level labels, entities, roles, permissions, and navigation language
- preserve reusable product patterns listed in the context
- do not create a one-off interaction when the context defines a shared pattern
- do not duplicate an existing modern view if the flow context says to modify or extend it
- do not mark a blocking dependency as complete unless the handoff or context confirms it
- record any product-context conflict or missing dependency in implementation notes

`builder` implements contracts. It may adapt layout, density, and component composition to the target React project, but it should not invent product semantics that belong in product context, flow context, or the handoff.

## UI Review / Fix Plan Rule

If the user provides `<view-name>-ui-review.md`, `ui-fix-plan.md`, or a screenshot-based correction plan, treat it as a corrective implementation contract layered on top of the original `<view-name>-ui-handoff.md`.

Before editing, identify:

- Critical and High findings
- required changes
- areas marked "Do not change"
- acceptance checks
- open questions that block safe implementation

Apply the review findings without reinterpreting the UX from scratch. Preserve working behavior and the original handoff unless the review explicitly corrects it.

Record completed fixes, skipped findings, and reasons for any skipped acceptance checks in `<view-name>-implementation-notes.md`.

## Critical Viewport Rule

For high-frequency operational workflows, especially billing, POS, fast entry, approvals, or irreversible submission flows, the critical path must fit in the baseline desktop viewport stated by the handoff.

Do not finish if the user must scroll to discover or reach:

- primary input or command area
- current working record/list
- total, status, or blocking validation
- primary completion action

For item-entry workflows, the primary search/code/name input must be visually and structurally attached to the list/table it fills. Place it directly above the working items table/list, not in the global header, unless the handoff explicitly says the command area is global.

If the first implementation fails this rule, revise density and layout before final response:

- reduce card padding and vertical chrome
- use a fixed or sticky action rail/bar
- keep secondary actions collapsed, grouped, or below the critical path
- make the main list/table the flexible scroll region
- preserve useful legacy layout strengths such as dense grids, visible totals, keyboard command areas, and compact action rails
- avoid dashboard/card-heavy layouts for POS and billing screens

Document the viewport checked and whether the critical path was visible in `<view-name>-implementation-notes.md`.

## Typography Implementation Rule

The design system font names are implementation requirements, not decorative suggestions.

Before finishing:

- verify whether the target repo already loads `Suisse Intl`, `Geist Mono`, and `Neue Montreal`
- wire generated components to the repo's real font variables/classes when available
- if fonts are missing, document the exact missing font setup in `<view-name>-implementation-notes.md`
- do not claim typography was followed if the rendered app is falling back silently to browser defaults

## Output

Write code to the destination path requested by the user.

Write `<view-name>-implementation-notes.md` to the view documentation directory when available:

```txt
docs/ux/<view-name>-implementation-notes.md
```

If the handoff lives in another folder and no `docs/ux/` path can be inferred, place `<view-name>-implementation-notes.md` next to the provided handoff. Do not put implementation notes inside the generated app code unless the user explicitly asks for that.

Include:

- shadcn components used
- design tokens used
- product context and flow context applied
- assumptions due to incomplete references
- design system gaps
- integration notes
- field traceability or data contract gaps
- verification performed

Do not modify global styles automatically. If global token changes are needed, create proposed files or notes and ask for confirmation before changing existing globals.

## Verification

When feasible:

- run lint/typecheck/build/test commands relevant to the changed files
- start the local app if needed
- inspect the rendered view with a browser or screenshot
- check for text overflow, broken layout, missing states, and visual mismatch with the design system
- for high-frequency operational workflows, verify that the critical path is visible without scrolling on the baseline desktop viewport

If verification cannot run, state why in `<view-name>-implementation-notes.md` and in the final response.

## Completion Checklist

Before finishing, verify:

- The generated view follows `<view-name>-ui-handoff.md`.
- shadcn primitives are used as the implementation substrate.
- The design system controls colors, radius, spacing, density, typography, and states.
- Local components are composition-only.
- Missing design system data is documented as assumptions.
- Field traceability and data contract gaps are documented as assumptions.
- Provided UI review findings and acceptance checks are addressed or documented as not applicable.
- No excluded legacy content was reintroduced.
- Required states and actions are represented.
- For operational workflows, primary input, total/status, blocking validation, and primary completion action are visible without scrolling.
