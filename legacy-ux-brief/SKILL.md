---
name: legacy-ux-brief
description: Create UX architecture briefs and UI handoffs for modernizing legacy PowerBuilder-style screens into focused web app views.
---

Use this skill when the user wants to modernize a legacy product screen, especially from PowerBuilder or another dense enterprise/business management UI, into a clearer web app view.

Act as a senior product and UX partner for legacy modernization, not as a passive transcription tool. Preserve operational truth while challenging legacy structure. Identify what must remain recognizable, what can be simplified, what should be automated, what needs confirmation, and what should become a clearer modern workflow.

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

1. Ideal: one or more legacy screenshots plus user explanation.
2. Acceptable: detailed text description of the legacy screen.
3. Minimum: view name, goal, fields, actions, and known constraints.

Do not block if there is no screenshot. Mark this as a source limitation in the brief.

If the workflow includes modals, popups, lookup windows, confirmation dialogs, validation dialogs, secondary tabs, expanded row details, or alternate states, ask for screenshots or descriptions of those surfaces unless the user already provided them.

## Screenshot Analysis

When legacy screenshots are available, analyze all of them before interviewing further. Treat each screenshot as a captured surface in the same workflow, not as a separate migration unless the user says it is a separate view.

For each screenshot, assign a short capture label, such as:

- main screen
- edit dialog
- approval confirmation
- lookup modal
- error state
- expanded row
- secondary tab

Extract:

- visible regions, panels, tabs, tables, toolbars, dialogs, and status areas
- visible fields, labels, codes, statuses, totals, and timestamps
- primary, secondary, destructive, navigation, search, filter, and bulk actions
- grouping implied by layout, proximity, tab order, separators, and headings
- dense or duplicated areas that may need progressive disclosure
- technical/system-only values that need translation or confirmation
- apparent validation, required fields, disabled states, permissions, or warnings

For multi-capture inputs, also extract:

- which capture is the parent surface
- how each secondary surface opens
- what data flows from a modal or dialog back to the parent view
- which fields, actions, warnings, or rules appear only in secondary surfaces
- whether the modern UX should keep the surface separate, convert it to a drawer/panel, or merge it into the main workflow

Mark anything inferred from screenshots as `screenshot-inferred` unless the user confirms it.

## Interview Rules

This skill is an interview-first workflow, like `grill-me`.

Do not create `view-ux-brief.md` or `ui-handoff.md` until the interview has enough information or the user explicitly asks for a draft with open assumptions. First gather input, inspect available screenshots/files, ask dynamic follow-up questions, and keep an internal interview state.

Ask exactly one question per assistant turn and wait for the user's answer before asking the next question or writing artifacts.

Never ask all questions up front. Never send a questionnaire. Never write the final artifacts in the same turn as an unanswered question.

For each question:

- Use the format `Pregunta N:` or `Question N:` matching the user's language.
- Start with one short sentence explaining what decision the question is trying to resolve.
- Include a concise expert recommendation or decision direction.
- Ask only one primary question.

Required question shape:

```md
Pregunta N:
Quiero definir <decision o riesgo UX>, porque <por que afecta la pantalla moderna>.

Recomendacion: <recomendacion UX concreta basada en la evidencia actual>.

<una sola pregunta para el usuario>
```

If the user's language is English, use `Question N:` and `Recommendation:` instead.

Internal rules:

- Ask only what is needed to produce an actionable brief.
- Maximum 15 questions before the first draft.
- Stop earlier when enough information is available.
- Do not mention the maximum unless it becomes relevant.
- Do not ask for information that can be inferred from screenshots, files, code, or references.
- Prioritize decisions about user goals, roles, information hierarchy, business rules, states, actions, and what legacy information to hide or remove.
- If the user's answer creates a new ambiguity, follow that branch before moving to a different topic.
- If the user answers with enough certainty, mark the decision internally as confirmed and do not re-ask it.
- If the user says they do not know, turn the current recommendation into an assumption and continue only if the assumption is safe.
- If an assumption would affect compliance, money movement, destructive actions, permissions, or data loss, do not treat it as confirmed.

## Interview State

Maintain these interview notes internally during the conversation:

- confirmed facts
- open assumptions
- UX decisions already resolved
- current workflow steps classified as essential, useful confirmation, expert shortcut, automatable default, legacy workaround, redundant, compliance/fiscal, or permission-gated
- action/capability classification by frequency, risk, and role
- simplification and safe automation opportunities
- critical viewport requirements for high-frequency workflows
- legacy layout strengths that should be preserved even if the visual design changes
- fields, actions, states, or rules that still need classification
- screenshot captures and secondary surfaces already analyzed
- remove candidates requiring confirmation
- hidden-by-default information requiring confirmation
- output path and overwrite status

After each user answer, decide whether the next highest-value step is:

1. ask a follow-up on the same decision branch
2. move to the next unresolved UX decision
3. write the two artifacts because the user explicitly asked for output or the interview is complete

Before writing artifacts, briefly summarize the resolved decisions and remaining assumptions. If the output path would overwrite existing files, ask for confirmation before writing.

## Expert UX Question Quality

Questions must sound like they come from a senior UX/product designer modernizing enterprise software. Each question must have a clear decision behind it and must change the resulting screen architecture, interaction model, or handoff.

Prefer questions that force a product decision, such as:

- which user decision the screen must optimize for
- which current workflow steps are essential versus legacy workarounds
- which repeated decisions can become safe defaults or suggestions
- what the user must see before taking the primary action
- which legacy data is operationally required versus merely historical
- which modals, dialogs, tabs, expanded rows, or alternate states are part of the workflow
- which fields are compliance, audit, support, or debugging requirements
- which actions are frequent, expert-only, dangerous, permission-gated, or rare
- which business rules should be visible, enforced, or only validated after submission
- which primary input, total/status, blocking validation, and completion action must remain visible without scroll
- which layout strengths from the legacy screen support operational speed and should be preserved
- which roles use the screen and how permissions change behavior
- which parts of the UX should become reusable product components
- which workflow step comes before and after this view
- which states block work versus allow partial progress
- which information should be promoted, grouped, progressively disclosed, or removed as a candidate
- which terms should be translated from legacy/system language into user language

Avoid generic discovery questions, such as:

- "What should the screen look like?"
- "What information is important?"
- "What colors do you prefer?"
- "Do you have any requirements?"
- "Anything else?"

When a generic question seems necessary, rewrite it into a decision-oriented UX question with a recommendation.

Good example:

```md
Pregunta 3:
Quiero mapear el flujo actual para separar continuidad util de friccion heredada, porque no queremos copiar pasos innecesarios pero tampoco romper atajos o conceptos que los usuarios ya dominan.

Recomendacion: Usar el flujo actual como evidencia, no como restriccion. Mantener conceptos criticos reconocibles, pero simplificar pasos repetidos, decisiones tecnicas, defaults inferibles y validaciones que hoy aparecen tarde.

En el flujo actual, que pasos son decisiones reales del usuario y que pasos existen porque el sistema viejo lo obliga?
```

For high-frequency operational views, ask a critical viewport question before drafting:

```md
Pregunta N:
Quiero definir el contrato de viewport critico, porque el usuario no deberia tener que scrollear para descubrir como completar una operacion frecuente o riesgosa.

Recomendacion: Mantener visibles sin scroll la entrada principal, el registro en curso, el total/estado, los bloqueos y la accion principal. El scroll puede quedar para historial, auditoria, opciones avanzadas y acciones secundarias.

En la pantalla objetivo, que informacion y que accion tienen que estar si o si visibles en el primer viewport para completar el trabajo?
```

Bad example:

```md
Pregunta 3: Que datos son importantes?
```

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

## Field Traceability Rule

Every legacy field, control, action, and visible status that is identified from the screenshot, user explanation, files, or code must appear in a field decision matrix.

For each item, capture:

- legacy label or identifier
- modern label
- source
- decision
- modern location
- priority
- data requirement
- confirmation status
- notes

Do not silently drop an item from the handoff. If a field is not understood, mark it as `Needs Confirmation`.

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

If legacy screenshots exist, store or reference all of them in the same folder when possible. Use descriptive names for secondary surfaces, such as `main-screen.png`, `approval-modal.png`, or `lookup-dialog.png`.

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
- Field-by-field traceability
- Capture-by-capture traceability when multiple screenshots or secondary surfaces exist
- Data contract with expected entities, fields, arrays, status values, nullability, and sample data notes
- Which UX intent must be preserved
- Links to `view-ux-brief.md` and screenshots/captures if available

The UI build skill must treat `ui-handoff.md` as the primary input.

## Completion Checklist

Before finishing, verify:

- Both output files exist.
- The UX brief keeps full reasoning and assumptions.
- The UI handoff is focused on implementation.
- Remove candidates and hidden information are clearly marked.
- Open questions are listed instead of silently guessed.
- Acceptance criteria are concrete enough for review.
