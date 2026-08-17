# Product Modernization Rules

These rules apply across `product-modernizer`, `planner`, `builder`, and `reviewer`.

## Product Context First

Before planning, building, or reviewing a modernized flow, look for:

```txt
docs/ux/product-context.md
docs/ux/flows/<flow-id>.md
```

If available, read `product-context.md` first. Then read the relevant flow file if the target flow is listed in the product context, named by the user, or inferable from the request.

Do not ask the user for product facts that are already documented in these files.

## Canonical Source Rule

`product-context.md` is the global source of product truth. Flow files add detail for a specific journey. View briefs and handoffs interpret the flow for implementation.

Use this precedence:

1. User correction in the current thread.
2. `docs/ux/product-context.md`.
3. Relevant `docs/ux/flows/<flow-id>.md`.
4. Approved `<view-name>-ux-brief.md`.
5. Approved `<view-name>-ui-handoff.md`.
6. Screenshots, code, and local inference.

If two sources conflict, record the conflict as an open question or implementation assumption. Do not silently choose the convenient answer.

## Flow-Level Planning

When modernizing a request, classify it as one of:

- new flow
- existing flow extension
- existing flow correction
- single-view modernization inside a known flow
- missing dependency for another flow

Before producing a view handoff, identify:

- entry points and exit points
- previous and next workflow steps
- roles and permission changes
- data dependencies and shared entities
- blocking dependencies
- reusable product patterns
- whether a current modern view should be modified instead of creating a new one

## Spatial Hierarchy And Completion Flow

Every view must use the available space in service of the current task. Do not reserve a column, rail, card region, or fixed height after its content ends while the primary workflow continues in a narrower adjacent region. When parallel content no longer applies, subsequent sections must reclaim the available width.

Keep derived information attached to the surface that produces it. Totals from a working table should normally close that table through footer rows or an inline summary. Do not extract them into a lateral summary card merely to repeat values, especially when the final action bar already presents the dominant total. A side panel must earn its space with an independent contextual task or decision.

For sequential forms, visual and DOM order must match the user's direction of progress:

1. context and identity;
2. required input and decisions;
3. review, totals, or validation;
4. completion action.

Do not place the only completion action above a form the user completes from top to bottom. If the action must remain visible in the critical viewport, use a bottom sticky action bar that is also last in DOM order. Headers should primarily communicate identity, state, navigation, and genuinely global actions.

A view should be understandable from hierarchy, labels, state, and action placement without requiring an explanation of what to do next.

## Blocking Decision Rule

Ask one focused UX/product question only when an unresolved decision affects:

- money movement, fiscal authorization, stock, account state, or irreversible submission
- destructive actions or data loss
- permissions or role visibility
- legal, audit, or compliance behavior
- whether the flow should replace, merge with, or depend on an existing flow

If the missing information is not blocking, proceed with an explicit assumption.

## Builder Responsibility Rule

`builder` implements contracts. It may adapt layout to the target repo and design system, but it should not invent product semantics, roles, navigation, labels, permissions, or entity relationships when they are defined in product context or flow files.

When context is missing, use conservative UI placeholders and record assumptions in implementation notes.

## Reviewer Responsibility Rule

`reviewer` validates the generated UI against product context as well as the view handoff. It should flag product-level issues such as:

- the view does not fit the target journey
- labels conflict with product language
- permissions or risky actions are wrong
- reusable patterns were duplicated as one-off UI
- a flow dependency is hidden, skipped, or treated as complete when it is not
- the implementation improves a screen but regresses the end-to-end workflow
