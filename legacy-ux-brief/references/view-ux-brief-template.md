# <View Name> UX Brief

## Metadata

- View ID:
- Source:
- Created:
- Status:
- Confidence:
- Language:

## Module Context

Include only if the view belongs to a larger workflow.

- Module:
- Previous step:
- Next step:
- Related views:
- Shared entities:
- Role or permission dependencies:

## User And Context

- Primary user:
- Secondary users:
- Usage context:
- Primary task:
- Secondary tasks:
- Frequency:
- Decision pressure:

## Legacy Screen Assessment

- What the legacy screen does:
- Main UX problems:
- Information overload:
- Duplicated content:
- Obsolete or unclear content:
- Technical/system-only content:
- Source limitations:

## Screenshot Extraction

Include when a legacy screenshot is available.

### Visible Structure

- Regions/panels/tabs:
- Tables/lists:
- Toolbars/action areas:
- Status/error/warning areas:
- Navigation or workflow indicators:

### Extracted UI Inventory

List visible fields, controls, actions, statuses, codes, totals, timestamps, and repeated groups.

### Screenshot-Inferred Assumptions

List anything inferred from layout or visual cues that has not been confirmed by the user.

## Information Architecture

### Keep Visible

Fields, summaries, statuses, and controls that must remain visible for the primary task.

### Move To Secondary

Useful information that should move to tabs, drawers, accordions, expandable rows, or supporting panels.

### Hide By Default

Information that should exist but only appear on demand.

### Remove Candidate

Information that appears unnecessary, duplicated, obsolete, or technical. These items require confirmation before exclusion.

### Needs Confirmation

Items whose operational, legal, reporting, or business use is unclear.

## Field Decision Matrix

Every visible or described legacy field, control, action, and status must appear here.

| Legacy item | Modern label | Source | Decision | Modern location | Priority | Data requirement | Confirmation | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  |  | screenshot / user / code / file | Keep visible / Move to secondary / Hide by default / Remove candidate / Needs confirmation |  | Primary / Secondary / Low | required / optional / derived / display-only / unknown | confirmed / screenshot-inferred / assumption / needs user confirmation |  |

## Proposed View Structure

### Header

- Purpose:
- Content:
- Actions:
- Rationale:

### Primary Content

- Purpose:
- Content:
- Actions:
- Rationale:

### Secondary Content

- Purpose:
- Content:
- Disclosure pattern:
- Rationale:

### Navigation

- Entry points:
- Exit points:
- Related views:
- Rationale:

## Interaction And States

- Loading:
- Empty:
- Error:
- Permission denied:
- Partial data:
- Validation:
- Unsaved changes:
- Destructive actions:

## Business Rules

List rules that must be visible or enforced in the UI.

## Data And State Notes

- Core entities:
- Field groups:
- Arrays/tables:
- Status values:
- Required vs optional values:
- Derived/display-only values:
- Unknown or ambiguous data:

## UX Rationale

Use short rationales, each under 70 words.

## Open Questions And Assumptions

Separate confirmed facts from assumptions.

## UI Handoff Notes

Summarize what the implementation agent must preserve.

## Acceptance Criteria

- The view supports the primary task without exposing unnecessary legacy complexity.
- Information marked `Keep Visible` is immediately accessible.
- Information marked `Move To Secondary` remains available without dominating the screen.
- `Remove Candidate` items are not excluded unless confirmed.
- Every identified legacy item appears in the field decision matrix.
- Required states are represented in the proposed structure.
