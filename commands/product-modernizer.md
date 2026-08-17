---
description: Understand, improve, document, or rebuild a product flow through the product assistant.
---

# /product-modernizer

Use the `product-modernizer` skill. This is the backward-compatible expert entry point; `/producto` is the recommended conversational entry point.

Accept natural language and infer the intended action. Do not require a mode argument. Questions and ideas remain read-only unless the user explicitly asks to document or implement.

## Arguments

- `request`: any natural-language question, idea, documentation request, or modernization request.
- `flow`: optional product flow name, flow ID, or description.
- `destination`: optional target React project folder or component path.
- `legacy_source`: optional screenshots, files, or text describing the current legacy flow.
- `feedback`: optional product/user feedback about what is slow, hidden, confusing, or broken.

## Delivery Workflow

Follow this workflow only when the user explicitly asks to implement or rebuild:

1. Read the `product-modernizer` skill and its required references.
2. Read `docs/ux/product-context.md` if present.
3. Match the request to `docs/ux/flows/<flow-id>.md` or existing UX artifacts.
4. Classify the request as a new flow, extension, correction, single-view modernization, or missing dependency.
5. Ask one UX/product question only if a blocking decision cannot be inferred.
6. Use `planner` to produce or update the UX brief and UI handoff.
7. If a destination is provided and implementation is in scope, use `builder`.
8. Use `reviewer` after build to validate product-flow fit and UI quality.
9. If Critical or High findings are produced and implementation is in scope, use `builder` again with the review as a correction contract.

For questions, ideation, and documentation-only requests, follow the conversational routing and write boundaries in the skill instead of starting this delivery workflow.

## Outputs

```txt
docs/ux/product-context.md
docs/ux/flows/<flow-id>.md
docs/ux/<view-name>-ux-brief.md
docs/ux/<view-name>-ui-handoff.md
docs/ux/<view-name>-ui-review.md
docs/ux/<view-name>-implementation-notes.md
```

Only flow-level files go in `docs/ux/flows/`. View artifacts stay flat in `docs/ux/`.
