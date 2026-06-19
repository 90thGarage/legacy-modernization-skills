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
- `../builder/references/design.md`
- `references/ui-review-template.md`

If available, also read:

- `<view-name>-ux-brief.md`
- `<view-name>-implementation-notes.md`
- User feedback about what feels wrong
- Additional screenshots for modal, drawer, expanded row, error, empty, or payment states
- Target code, only when needed to confirm implementation constraints

## Review Goal

Act like a senior product and UX reviewer for operational business software.

The goal is not to preserve the legacy UI literally. The goal is to preserve what makes expert users fast, remove unnecessary work, make the new screen understandable without training, and ensure the generated implementation respects the handoff and design system.

For each finding, explain what is wrong, why it hurts the workflow, what evidence supports it, what `builder` should change, and how to verify the fix.

## Review Priorities

Review in this order and report the highest-risk problems first:

1. Critical workflow visibility
2. Legacy strength preservation
3. Workflow simplification without losing intent
4. Information architecture and hierarchy
5. Action priority and destructive action placement
6. Design system compliance
7. Typography, density, spacing, and radius
8. Missing states, modals, drawers, errors, and edge cases

## Non-Negotiable Rules

For billing, POS, fast entry, approvals, or irreversible submit flows, flag as Critical if the baseline desktop viewport hides any of these behind scroll:

- primary item search/code/name input
- working item list or current record
- total, status, or blocking validation
- primary completion action

For item-entry screens, the search/code/name input must sit directly above the table/list it fills. If it is in the global header or detached from the working list, flag it unless the handoff explicitly requires that placement.

Border radius must be 4px for buttons, inputs, panels, tables, and operational sections unless an existing component forces otherwise.

Required fonts must be actually loaded or missing setup must be documented. Do not accept silent browser fallback as typography compliance.

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
