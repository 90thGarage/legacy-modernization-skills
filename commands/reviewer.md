---
description: Review a generated UI against the UX handoff, legacy screenshots, design system, and user feedback.
---

# /reviewer

Use the `reviewer` skill.

## Arguments

- `generated_ui`: screenshot, URL, rendered view, or local target to review.
- `handoff`: path to `docs/ux/<view-name>-ui-handoff.md`.
- `legacy_source`: optional legacy screenshot or source material.
- `feedback`: optional user feedback about what feels wrong.

## Workflow

1. Read the `reviewer` skill and its required references.
2. Compare the generated UI against the handoff, design system, legacy evidence, and feedback.
3. Produce findings ordered by severity.
4. Save the correction plan under `docs/ux/`.

## Output

```txt
docs/ux/<view-name>-ui-review.md
```

Do not edit production code. The output is a fix plan for `builder`.
