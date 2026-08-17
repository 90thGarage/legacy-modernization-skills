---
name: reviewer
description: Review generated legacy modernization UIs against UX brief, UI handoff, design system, legacy/current screenshots, and user feedback, then produce an executable fix plan for builder. Use when a generated UI needs visual/product QA, screenshot comparison, or correction planning before implementation fixes.
---

Use this skill after `builder` has produced a view and the user wants to evaluate whether the result actually solves the legacy modernization problem.

This skill does not edit code. It produces `<view-name>-ui-review.md`, a review document and correction plan that `builder` can execute.

## Required References

Before reviewing, read only the relevant files:

- The generated UI screenshot or rendered view provided by the user
- The legacy screenshot or screenshots used as source material
- The provided `<view-name>-ui-handoff.md`
- `../shared/references/product-modernization-rules.md`
- `../builder/references/design.md`
- `references/ui-review-template.md`

If available, also read:

- `docs/ux/product-context.md`
- the relevant `docs/ux/flows/<flow-id>.md`
- `<view-name>-ux-brief.md`
- `<view-name>-implementation-notes.md`
- User feedback about what feels wrong
- Additional screenshots for modal, drawer, expanded row, error, empty, or payment states
- Target code, only when needed to confirm implementation constraints

## Review Goal

Act like a senior product and UX reviewer for operational business software.

The goal is not to preserve the legacy UI literally. The goal is to preserve what makes expert users fast, remove unnecessary work, make the new screen understandable without training, and ensure the generated implementation respects the handoff and design system.

Review the UI as part of the product journey. A screen can pass visual review and still fail if it breaks product language, role behavior, flow continuity, dependencies, or reusable product patterns documented in product context.

For each finding, explain what is wrong, why it hurts the workflow, what evidence supports it, what `builder` should change, and how to verify the fix.

## Review Priorities

Review in this order and report the highest-risk problems first:

1. Product journey fit and blocking dependencies
2. Critical workflow visibility
3. Legacy strength preservation
4. Workflow simplification without losing intent
5. Information architecture and hierarchy
6. Action priority, permissions, and destructive action placement
7. Design system compliance
8. Typography, density, spacing, and radius
9. Missing states, modals, drawers, errors, and edge cases

## Non-Negotiable Rules

For billing, POS, fast entry, approvals, or irreversible submit flows, flag as Critical if the baseline desktop viewport hides any of these behind scroll:

- primary item search/code/name input
- working item list or current record
- total, status, or blocking validation
- primary completion action

For item-entry screens, the search/code/name input must sit directly above the table/list it fills. If it is in the global header or detached from the working list, flag it unless the handoff explicitly requires that placement.

Border radius must be 4px for buttons, inputs, panels, tables, and operational sections unless an existing component forces otherwise.

Required fonts must be actually loaded or missing setup must be documented. Do not accept silent browser fallback as typography compliance.

Flag as High when a sequential form places its only completion action above the input sequence, forcing the user to reverse direction to finish. A bottom sticky action bar is acceptable when it is last in DOM order and reflects the current next step.

Flag as High when a layout reserves an empty column, rail, or fixed-height region after its contextual content ends while the primary workflow continues in a narrower adjacent area.

Flag as High when a lateral summary reduces the primary working surface only to repeat values derived from that surface, particularly when the dominant total is already visible in a sticky completion bar. Prefer an aligned table footer or inline closing region unless the side panel supports an independent contextual task or decision.

## Legacy Comparison

Compare screenshots by workflow role, not visual style.

Preserve useful legacy strengths such as:

- dense table scanning
- visible totals
- keyboard-heavy command areas
- compact payment/action rails
- clear selected row or active item
- fields that support expert speed

Do not preserve legacy weaknesses such as:

- redundant steps
- unclear labels
- hidden validation
- excessive modal hopping
- duplicated commands
- outdated visual styling

## Design System Review

Check the generated UI against `design.md`: color, radius, spacing, density, typography, components, state styles, action hierarchy, and operational layout rules.

## Product Context Review

When product context or flow context is available, check:

- the view fits the target journey and does not skip required previous/next steps
- entry points and exit points are represented or documented
- labels and entities match product language
- roles and permissions affect visible actions correctly
- risky, destructive, fiscal, stock, account, or irreversible actions use the documented confirmation/recovery behavior
- reusable product patterns are reused instead of reinvented
- blocking dependencies are not hidden or treated as complete
- implementation notes record unresolved product assumptions

## Output

Write or propose a file named:

```txt
docs/ux/<view-name>-ui-review.md
```

Use `references/ui-review-template.md`.

The output must include an overall verdict, screenshot inputs reviewed, critical workflow assessment, findings ordered by severity, fix plan for `builder`, acceptance checks, and unresolved questions only when they block a safe correction.

## Boundaries

Do not redesign from scratch unless the current implementation is structurally unfixable.

Do not ask for a new UX interview unless the screenshots, handoff, and feedback are insufficient to decide a correction.

Do not edit production code. If the user asks to apply fixes, hand the generated `<view-name>-ui-review.md` to `builder`.
