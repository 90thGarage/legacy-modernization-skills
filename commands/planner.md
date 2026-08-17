---
description: Start the interview-first UX planning flow for a legacy screen or workflow.
---

# /planner

Use the `planner` skill.

## Arguments

- `legacy_view_or_workflow`: the legacy screen, workflow, screenshots, or text description to modernize.
- `view_name`: optional kebab-case filename prefix. Infer it from the workflow if omitted.

## Workflow

1. Read the `planner` skill and its required references.
2. Read `docs/ux/product-context.md` and the relevant `docs/ux/flows/<flow-id>.md` when present.
3. Follow the product-context-aware interview contract.
4. Ask exactly one UX question before drafting unless product context already resolves the high-risk decisions or the user explicitly asks for a draft with open assumptions.
5. When approved to write artifacts, save flat files under `docs/ux/`.

## Outputs

```txt
docs/ux/<view-name>-ux-brief.md
docs/ux/<view-name>-ui-handoff.md
```

Do not create a folder per view.
