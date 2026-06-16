---
name: legacy-ux-brief
description: Create UX architecture briefs and UI handoffs for modernizing legacy PowerBuilder-style screens into focused web app views.
---

Use this skill when the user wants to modernize a legacy product screen, especially from PowerBuilder or another dense enterprise UI, into a clearer web app view.

The goal is to produce two artifacts:

- `view-ux-brief.md`: full UX reasoning and screen architecture for humans.
- `ui-handoff.md`: implementation-focused contract for the UI build skill.

## Required References

Before interviewing or writing artifacts, read:

- `references/ux-principles.md`
- `references/view-ux-brief-template.md`
- `references/ui-handoff-template.md`

## Inputs

Accept any of these input levels:

1. Ideal: legacy screenshot plus user explanation.
2. Acceptable: detailed text description of the legacy screen.
3. Minimum: view name, goal, fields, actions, and known constraints.

Do not block if there is no screenshot. Mark this as a source limitation in the brief.

## Interview Rules

Ask questions one at a time.

For each question:

- Use the format `Pregunta N:` or `Question N:` matching the user's language.
- Include a concise recommended answer or decision direction.
- Ask only one primary question.

Internal rules:

- Ask only what is needed to produce an actionable brief.
- Maximum 15 questions before the first draft.
- Stop earlier when enough information is available.
- Do not mention the maximum unless it becomes relevant.
- Do not ask for information that can be inferred from screenshots, files, code, or references.
- Prioritize decisions about user goals, roles, information hierarchy, business rules, states, actions, and what legacy information to hide or remove.

## Context Gate

Early in the interview, determine whether the view belongs to a larger workflow or module.

If yes, ask only the extra context needed and include a `Module Context` section in the brief. Do not turn this into a separate workflow unless the user asks.

## Information Removal Rule

Never permanently remove or exclude legacy information without confirmation.

Classify legacy information as:

- Keep visible
- Move to secondary
- Hide by default
- Remove candidate
- Needs confirmation

Before finalizing, explicitly call out remove candidates and hidden information that require user confirmation. If confirmation is not available, keep them under `Needs Confirmation`.

## Output Location

Use one folder per migrated view.

Default path:

```txt
legacy-modernization/views/<view-name-kebab-case>/
```

Write:

```txt
view-ux-brief.md
ui-handoff.md
```

If a legacy screenshot exists, store or reference it in the same folder when possible.

Do not overwrite existing files without user confirmation.

## Language

Write artifacts in the user's language. If the user switches language, prefer the language used for the current migration request.

## UX Rationale

Include short rationales for important UX decisions. Keep each rationale under 70 words. Use plain product language, not academic language.

## Handoff Rule

The `ui-handoff.md` must be prescriptive enough for an implementation agent to build the view without rereading the whole UX discussion.

It should include:

- What to build
- How to structure the view
- What information to render
- What not to include
- Which states and interactions are required
- Which UX intent must be preserved
- Links to `view-ux-brief.md` and screenshot if available

The UI build skill must treat `ui-handoff.md` as the primary input.

## Completion Checklist

Before finishing, verify:

- Both output files exist.
- The UX brief keeps full reasoning and assumptions.
- The UI handoff is focused on implementation.
- Remove candidates and hidden information are clearly marked.
- Open questions are listed instead of silently guessed.
- Acceptance criteria are concrete enough for review.
