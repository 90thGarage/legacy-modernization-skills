# <View Name> UI Handoff

## Build Goal

Describe the exact view to build and the primary task it supports.

## Layout Contract

- Header:
- Primary region:
- Secondary region:
- Tabs/drawer/accordion:
- Action area:
- Responsive behavior:

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

## Component Strategy

- Preferred primitives:
- Client design system constraints:
- shadcn components likely needed:
- Avoid:

## Actions And Interactions

- Primary actions:
- Secondary actions:
- Destructive actions:
- Filters/search/sort:
- Selection/bulk actions:

## Required States

- Loading:
- Empty:
- Error:
- Permission denied:
- Partial data:
- Validation:

## Data Shape

This section is the implementation data contract. Be explicit enough for the UI build skill to create mock data without rereading the UX discussion.

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
- Required content and states are represented.
- Excluded legacy content is not reintroduced.
- Every identified legacy item is represented in the field traceability matrix.
- The data shape is specific enough to build realistic mock data and UI states.
- Visual implementation follows the client design system and shadcn strategy.

## Source References

- Full UX brief: `./view-ux-brief.md`
- Legacy screenshot:
