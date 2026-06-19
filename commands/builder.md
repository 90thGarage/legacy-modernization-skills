---
description: Build a React view from a legacy modernization UI handoff.
---

# /builder

Use the `builder` skill.

## Arguments

- `handoff`: path to `docs/ux/<view-name>-ui-handoff.md`.
- `destination`: target React project folder or component path.
- `review`: optional path to `docs/ux/<view-name>-ui-review.md` for corrective implementation.

## Workflow

1. Read the `builder` skill and its required references.
2. Read the provided handoff before editing code.
3. If a review file is provided, treat it as a correction contract layered on top of the handoff.
4. Build in the user-specified destination.
5. Write implementation notes back to `docs/ux/`.

## Outputs

```txt
<destination>
docs/ux/<view-name>-implementation-notes.md
```

Do not put implementation notes inside generated app code unless the user explicitly asks for that.
