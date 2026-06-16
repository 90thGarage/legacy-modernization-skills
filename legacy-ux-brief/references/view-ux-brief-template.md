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
- Required states are represented in the proposed structure.
