# <View Name> UI Handoff

## Build Goal

Describe the exact view to build and the primary task it supports.

## Product UX Intent

- Operational truth to preserve:
- Legacy friction to remove:
- Primary workflow improvement:
- Existing user recognition to preserve:
- Training-free adoption requirements:

## Layout Contract

- Header:
- Primary region:
- Secondary region:
- Tabs/drawer/accordion:
- Dialogs/modals/secondary surfaces:
- Action area:
- Responsive behavior:

## Critical Viewport Contract

Use for high-frequency operational workflows. The implementation must allow the critical path to be completed without scrolling on the stated baseline desktop viewport.

- Baseline viewport:
- Must be visible without scroll:
- Primary input area:
- Primary input placement relative to working list/table:
- Working record/list:
- Total/status:
- Blocking validation:
- Primary completion action:
- Fixed/sticky areas:
- Scrollable areas:
- Content allowed below the fold:
- Max layout budget:
- Secondary actions demotion:

## Capture Inventory

List every source capture used to define the UI, including main screens, modals, dialogs, tabs, expanded rows, and alternate states.

| Capture | Source file / reference | Surface type | Modern destination | Notes |
| --- | --- | --- | --- | --- |
|  |  | main screen / modal / dialog / tab / expanded row / state | main view / modal / drawer / inline panel / secondary tab / excluded |  |

## Information To Render

### Always Visible

### Secondary / Progressive Disclosure

### Hidden Unless Requested

### Excluded From UI

Only include confirmed exclusions. Otherwise use `Open Assumptions`.

## Field Traceability Matrix

Every legacy field, control, action, visible status, code, total, and repeated group identified in the UX brief must appear here.

| Legacy item | Modern label | Source | Decision | Render location | Component/pattern | Data key | Requirement | Confirmation | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  |  | screenshot / user / code / file | always visible / secondary / hidden unless requested / excluded / needs confirmation |  |  |  | required / optional / derived / display-only / unknown | confirmed / screenshot-inferred / assumption / needs user confirmation |  |

## Workflow Contract

### Step Model

| Step | Modern behavior | Step type | Component / area | Validation | Notes |
| --- | --- | --- | --- | --- | --- |
|  |  | essential decision / useful confirmation / expert shortcut / automated default / compliance-fiscal / permission-gated |  |  |  |

### Simplifications To Implement

- Legacy steps removed or collapsed:
- Defaults to apply:
- Technical choices translated to user choices:
- Validation moved earlier:
- User control preserved:

## Component Strategy

- Preferred primitives:
- Client design system constraints:
- shadcn components likely needed:
- Reusable product components:
- Components that should not be one-off:
- Density constraints:
- Avoid card-heavy layouts when:
- Avoid:

## Actions And Interactions

- Primary actions:
- Secondary actions:
- Destructive actions:
- Filters/search/sort:
- Selection/bulk actions:

### Action State Model

| Action | Frequency | Risk | Permission | Enabled when | Disabled reason | Confirmation / recovery |
| --- | --- | --- | --- | --- | --- | --- |
|  | always visible / frequent secondary / occasional / expert | safe / risky / irreversible / destructive | all users / role-gated / supervisor / admin / unknown |  |  |  |

## Roles And Permissions

| Role | Visible information | Allowed actions | Disabled/hidden actions | UI behavior |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

## Dialogs, Drawers, And Secondary Surfaces

For each non-primary surface:

```txt
Surface:
Trigger:
Modern pattern:
Purpose:
Content:
Actions:
Validation:
Data received from parent:
Data returned to parent:
Close/cancel behavior:
Required states:
```

## Required States

- Loading:
- Empty:
- Error:
- Permission denied:
- Partial data:
- Validation:
- Failed submit:
- Unsaved changes:
- Conflicting update:
- Stale data:

## Defaults, Validation, And Recovery Contract

- Safe auto-filled defaults:
- Suggested editable defaults:
- Defaults requiring confirmation:
- Manual-only decisions:
- Inline validation:
- Validation summary:
- Action gating:
- Failed submit recovery:
- Data that must never be lost on failure:

## Data Shape

This section is the implementation data contract. Be explicit enough for `builder` to create mock data without rereading the UX discussion.

### Entities

```txt
Entity:
Purpose in view:
Relationship to other entities:
```

### Fields

```txt
Field key:
Modern label:
Type:
Required: yes/no/unknown
Nullable: yes/no/unknown
Source legacy item:
Display format:
Validation or constraints:
Fallback when missing:
```

### Arrays / Tables

```txt
Array key:
Row identity:
Columns:
Default sort:
Empty state:
Row actions:
Bulk actions:
```

### Status Values

```txt
Status key:
Allowed values:
Modern labels:
Visual treatment:
Business meaning:
```

### Derived / Display-Only Values

```txt
Value:
Derived from:
Display rule:
```

### Example Data Notes

Describe the minimum mock dataset needed to demonstrate normal, empty, partial, error, and permission states.

## Visible Business Rules

List only business rules that must affect the UI.

## Do Not Include

List legacy fields, controls, duplicated sections, or visual patterns that the UI skill must not revive.

## UX Intent

Use mini-rationales by area. Keep each under 70 words.

## Open Assumptions

List unresolved decisions that the UI implementation must not silently treat as confirmed.

## Acceptance Criteria

- The implementation follows this handoff before the full UX brief.
- The view preserves the specified layout contract.
- The critical viewport contract is satisfied before any secondary content is considered complete.
- Required content and states are represented.
- Excluded legacy content is not reintroduced.
- Every identified legacy item is represented in the field traceability matrix.
- The data shape is specific enough to build realistic mock data and UI states.
- Visual implementation follows the design system and shadcn strategy.

## Source References

- Full UX brief: `./<view-name>-ux-brief.md`
- Legacy screenshots / captures:
