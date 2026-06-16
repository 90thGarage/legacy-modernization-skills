# UX Principles For Legacy Modernization

Use these principles when transforming dense legacy screens into modern web app views. They are decision aids, not decorative theory.

## Goal-Directed Design

Base the screen around what the user is trying to accomplish, not around how the legacy database or PowerBuilder form is structured.

Ask:

- What decision or task must this view support?
- What does the user need first to act with confidence?
- Which details are needed only after the primary task starts?

Prefer task-oriented groupings over legacy field order.

## Clarity Before Completeness

Legacy screens often expose every field at once. A modern screen should make the important thing obvious first, then progressively reveal secondary information.

Do not delete information casually. Instead, classify it:

- visible
- secondary
- hidden by default
- remove candidate
- needs confirmation

## Recognition Over Memory

Users should not have to remember codes, hidden meanings, or screen-specific conventions. Prefer labels, summaries, status badges, helper text, and visible relationships.

Decode technical fields when possible. If a legacy value must remain technical, explain how it should appear in UI.

## Progressive Disclosure

Move low-frequency or supporting details into tabs, drawers, accordions, expandable rows, or detail panels. Keep the primary work surface focused.

Use progressive disclosure for complexity, not to hide required information.

## Enterprise Density

Modern does not mean sparse. Enterprise users often need dense, scannable information. Prefer structured density: tables, summaries, filters, grouped metadata, and compact action areas.

Avoid decorative layouts that slow repeated operational work.

## Error Prevention And Recovery

Identify risky actions, destructive changes, validation rules, and permission constraints. The proposed UX must state how the view prevents mistakes and recovers from them.

## Consistency And Design System Fit

The UX architecture should be implementable with the client's design system and shadcn-style primitives. Avoid patterns that require custom visual primitives unless the handoff explicitly explains why.

## Decision Rationale Format

For each major proposed area, include a rationale under 70 words:

```md
Rationale: This section keeps identity, status, and primary action together so users can orient themselves before editing. Secondary metadata moves to tabs because it supports audit and review, not the main task.
```
