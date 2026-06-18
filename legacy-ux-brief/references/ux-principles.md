# UX Principles For Legacy Modernization

Use these principles when transforming dense legacy business software into modern web app views. They are decision rules for interviewing, analyzing screenshots, challenging legacy workflows, and writing buildable UX briefs.

The skill acts as a senior product and UX partner, not a passive transcription tool. Preserve operational truth, question legacy structure, and produce a modern workflow that is easier to use, easier to understand, and easier to maintain.

## 1. Understand The Current Workflow Before Redesigning

The current flow is evidence, not a constraint. Map it before changing it so the redesign can preserve useful recognition while removing inherited friction.

Classify each step as:

- essential decision
- useful confirmation
- expert shortcut
- automatable default
- legacy workaround
- redundant step
- compliance/fiscal requirement
- permission-gated action

Preserve concepts, shortcuts, and sequencing that help users work confidently. Do not preserve steps that exist only because the legacy system could not infer, validate, or automate them.

## 2. Start From The User Decision

Legacy screens often mirror database tables, transactions, or internal modules. A modern view should start from the decision or job the user is trying to complete.

- What decision does the user need to make here?
- What action completes the job?
- What must be known before the user can act safely?
- What can be delayed until the user asks for detail?

Prefer task-oriented groupings over legacy field order. If a field does not help the user decide, act, verify, recover, audit, or comply, it should not dominate the primary view.

## 3. Preserve Capability Before Simplifying

Modernization is not visual cleanup. Do not remove operational capability just because the legacy screen looks cluttered.

Classify each legacy item:

- keep visible
- move to secondary
- hide by default
- remove candidate
- needs confirmation

Only confirmed exclusions can be removed from the modern UI. If a field's purpose is unclear, preserve it as secondary or mark it as needing confirmation.

## 4. Design For Business Software Adoption

Many users of management software repeat workflows all day and cannot rely on training to understand a redesign. The modern UI should be self-explanatory without becoming tutorial-heavy.

Optimize for:

- familiar business concepts and labels
- obvious next actions
- clear blockers and recovery paths
- predictable placement of repeated controls
- fast scanning for expert users
- safe defaults that remain visible and editable
- minimal novelty unless it removes real friction

Do not rename known business terms only to make them sound modern. Translate technical/system language, but preserve domain language users already rely on.

## 5. Design The Information Hierarchy

The first viewport should answer:

- Where am I?
- What object am I working on?
- What is its current state?
- What needs my attention?
- What can I do next?

Use this hierarchy:

1. Identity: name, ID, status, ownership, workflow step.
2. Decision signals: values, alerts, exceptions, eligibility, risk.
3. Primary actions: actions that complete or advance the job.
4. Supporting evidence: tables, history, notes, attachments, audit trail.
5. System metadata: debug, session, operator, technical codes.

Do not let audit history, raw metadata, or low-frequency fields compete with the main decision unless the user's job is audit or investigation.

## 6. Classify Capabilities By Frequency And Risk

Dense legacy screens often put every capability at the same visual level. A modern screen should separate common work from rare, expert, or dangerous work.

Classify actions and capabilities as:

- always visible
- frequent secondary
- occasional
- expert
- dangerous
- permission-gated
- legacy candidate

High-frequency actions should be easy to reach. Dangerous actions should expose consequences. Rare expert actions should remain available without dominating the main workflow.

## 7. Treat Billing/Invoicing As A Critical Workflow

Billing is not just a form. It can affect tax/fiscal authorization, stock, accounts receivable, payments, pricing, audit, printing, and customer communication.

For invoicing-like screens, identify:

- document type: invoice, quote, order, delivery note, credit note, debit note
- lifecycle: draft, issued, authorized, sent, printed, canceled, credited
- irreversible or high-risk actions
- fiscal/tax validation and recovery
- stock, pricing, discount, payment, and account impacts
- what must be checked before issuing
- what can be saved safely if issuing fails

Move validation earlier when possible. If fiscal authorization or submit fails, the user should not lose loaded customer, items, totals, or notes.

## 8. Keep The Critical Path Above The Fold

For high-frequency operational workflows, the user should not need to scroll to discover how to complete the job. The first desktop viewport must show the primary input, working record, total/status, blocking validation, and primary action.

For POS, billing, or fast-entry screens, preserve the legacy layout strengths when they support speed: command/search area, dense item grid, visible totals, fixed action rail, keyboard shortcuts, and always-visible completion action.

When the user is adding items, the search/code/name input belongs directly above the items list or grid it fills. Do not detach it into a global header if that makes the relationship between input and loaded items less clear.

Scrolling may reveal history, audit, secondary actions, advanced options, or extended item details. It must not hide the action that completes the workflow.

## 9. Use Progressive Disclosure Deliberately

Progressive disclosure should reduce cognitive load without hiding required work.

Good secondary candidates include audit trail, historical notes, raw technical metadata, low-frequency configuration, long investigation tables, row details, secondary row actions, and compliance evidence that must remain available.

Bad secondary candidates include blocking validation errors, eligibility or risk signals required before acting, values users compare repeatedly, and actions that define the main workflow.

Choose tabs for peer sections, drawers for contextual detail, accordions for optional groups, expandable rows for table detail, and dialogs only when focus and interruption are useful.

## 10. Treat Modals And Dialogs As Product Surface

Legacy workflows often hide important fields, warnings, or business rules inside dialogs. If a modal, lookup, confirmation, error dialog, or secondary window is part of the workflow, it must be captured and analyzed.

For each secondary surface, identify:

- how the user opens it
- what decision or task it supports
- required fields and validation
- actions and cancellation behavior
- warnings, errors, permissions, and confirmations
- data that flows back to the parent view

Decide whether the modern version should remain a modal, become an inline panel, become a drawer, or merge into the main workflow.

## 11. Make Rules, Defaults, And Automation Visible

Business rules should not surprise the user after submission if they can be known earlier. Defaults should reduce work without hiding control.

Classify rules as visible upfront, inline validation, action gating, post-submit validation, or audit-only.

Classify defaults as safe auto-fill, suggested but editable, requires confirmation, or must remain manual.

Common candidates include customer fiscal condition, price list, point of sale, salesperson, taxes, currency, warehouse, and payment terms.

## 12. Model Roles And Permissions

Management software often serves sellers, admins, cashiers, owners, accountants, supervisors, and support. Capture who uses the screen daily, who fixes exceptions, who approves discounts or overrides, who can cancel/credit/reissue, who can see margin/cost/fiscal/audit detail, and which actions become read-only or hidden by permission.

Permissions should affect action availability, explanations, validation, and recovery paths.

## 13. Prefer Maintainable, Reusable UX

The handoff should help developers build a product, not a one-off screen. Prefer reusable structures for recurring business workflows: customer selector, product/service selector, line items table, totals/taxes summary, payment or commercial terms panel, document status and authorization state, role-aware action bar, validation summary, and audit/history disclosure.

Avoid custom interaction patterns unless standard primitives cannot represent the workflow clearly.

## 14. Design For States, Not Just The Happy Path

Every migrated view should define loading, empty, partial, stale, validation, permission denied, failed load, failed submit, unsaved changes, and conflicting update behavior.

If a state changes what the user can do, capture it in the brief and handoff. Disabled actions should explain why. Risky actions should show consequence, not generic warnings.

## 15. Keep Traceability Complete

Every field, action, status, warning, table, tab, dialog, and repeated group found in screenshots, files, code, or user explanation must appear in the field decision matrix.

Traceability lets the implementation improve the UX without silently losing legacy behavior. Unknown items should be marked as `Needs Confirmation`, not ignored.

## Decision Rationale Format

For each major proposed area, include a rationale under 70 words:

```md
Rationale: This area keeps customer, document state, blocking validations, and the primary issuing action together so users can understand what will happen before committing. Advanced fiscal metadata moves to secondary disclosure because it supports review and troubleshooting, not routine billing.
```
