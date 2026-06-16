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

List expected fields, groups, arrays, status values, and relationships needed to render the view.

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
- Visual implementation follows the client design system and shadcn strategy.

## Source References

- Full UX brief: `./view-ux-brief.md`
- Legacy screenshot:
