# <View Name> UX Brief

## Metadata

- View ID:
- Source:
- Product context:
- Flow context:
- Created:
- Status:
- Confidence:
- Language:

## Product Context Alignment

- Product context source:
- Flow context source:
- Request classification: new flow / existing flow extension / existing flow correction / single-view modernization / missing dependency
- Product-level decisions reused:
- Product-level conflicts or contradictions:
- Product-level assumptions:
- Related reusable product patterns:

## Module Context

Include only if the view belongs to a larger workflow.

- Module:
- Previous step:
- Next step:
- Related views:
- Shared entities:
- Role or permission dependencies:
- Blocking dependencies:
- Integration assumptions:

## User And Context

- Primary user:
- Secondary users:
- Usage context:
- Primary task:
- Secondary tasks:
- Frequency:
- Decision pressure:

## Product And Adoption Context

Use for business management systems, high-frequency operational screens, or migrations with existing users.

- Existing user base:
- Adoption expectation:
- Training constraints:
- Known business language to preserve:
- Legacy concepts that can be renamed:
- Product maintainability concerns:

## Legacy Screen Assessment

- What the legacy screen does:
- Main UX problems:
- Information overload:
- Duplicated content:
- Obsolete or unclear content:
- Technical/system-only content:
- Source limitations:

## Workflow Modernization Assessment

Map the current workflow before proposing changes. The current flow is evidence, not a constraint.

### Current Workflow

| Step | User goal | Legacy behavior | Step classification | Keep / simplify / automate / remove candidate | Notes |
| --- | --- | --- | --- | --- | --- |
|  |  |  | essential decision / useful confirmation / expert shortcut / automatable default / legacy workaround / redundant / compliance-fiscal / permission-gated |  |  |

### Simplification Opportunities

- Repeated work to reduce:
- Data that can be safely defaulted:
- Technical decisions that can become user-facing choices:
- Validation that should move earlier:
- Legacy workarounds to remove:
- User control that must remain:

## Critical Workflow Notes

Use when the view affects billing, invoicing, payments, stock, fiscal authorization, customer account state, irreversible submission, or other high-risk business operations.

- Critical workflow:
- Document/entity lifecycle:
- Irreversible or high-risk actions:
- Fiscal/tax/authorization impact:
- Stock/account/payment impact:
- Safe draft or recovery behavior:
- Preconditions before submission:

## Critical Viewport Contract

Use for high-frequency operational workflows where the user must complete the job quickly and safely.

- Baseline viewport:
- Primary input that must be visible without scroll:
- Relationship between primary input and working list/table:
- Working record/list that must be visible without scroll:
- Total/status that must be visible without scroll:
- Primary action that must be visible without scroll:
- Blocking validation that must be visible without scroll:
- Content allowed below the fold:
- Legacy layout strengths to preserve:
- Density target:

## Roles And Permissions

| Role | Primary goal | Visible information | Allowed actions | Restricted actions | Notes |
| --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |

## Screenshot / Capture Extraction

Include when one or more legacy screenshots, dialogs, secondary windows, expanded rows, tabs, or alternate states are available.

### Capture Inventory

| Capture | Surface type | Parent surface | Trigger / entry point | Purpose | Confirmation |
| --- | --- | --- | --- | --- | --- |
|  | main screen / modal / dialog / tab / expanded row / error / state |  |  |  | confirmed / screenshot-inferred / needs user confirmation |

### Visible Structure

- Regions/panels/tabs/dialogs:
- Tables/lists:
- Toolbars/action areas:
- Status/error/warning areas:
- Navigation or workflow indicators:

### Extracted UI Inventory

List visible fields, controls, actions, statuses, codes, totals, timestamps, and repeated groups.

### Screenshot-Inferred Assumptions

List anything inferred from layout or visual cues that has not been confirmed by the user.

### Secondary Surface Decisions

For each modal, dialog, tab, expanded row, lookup, confirmation, or alternate state:

- Legacy surface:
- Modern pattern: keep as modal / convert to drawer / convert to inline panel / merge into main view / remove candidate
- Data passed from parent:
- Data returned to parent:
- Required validation:
- Rationale:

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

## Action And Capability Model

Classify actions by frequency, risk, and permission. Do not put every legacy action at the same visual level.

| Action / capability | Frequency | Risk | Permission | Modern placement | Confirmation | Notes |
| --- | --- | --- | --- | --- | --- | --- |
|  | always visible / frequent secondary / occasional / expert / legacy candidate | safe / risky / irreversible / destructive | all users / role-gated / supervisor / admin / unknown |  | confirmed / assumption / needs user confirmation |  |

## Proposed View Structure

### Layout And Viewport Strategy

- First viewport:
- Fixed/sticky areas:
- Scrollable areas:
- Right/left action rail:
- Bottom summary/action bar:
- Rationale:

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

### Dialogs, Drawers, And Secondary Surfaces

- Surface:
- Trigger:
- Purpose:
- Content:
- Actions:
- Validation:
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

## Defaults, Automation, And Validation

- Safe defaults:
- Suggested editable defaults:
- Defaults requiring confirmation:
- Decisions that must remain manual:
- Inline validation:
- Action gating:
- Post-submit validation:
- Recovery from failed submit:

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

## Product Context References

- Product context: `./product-context.md`
- Flow context: `./flows/<flow-id>.md`

## UI Handoff Notes

Summarize what the implementation agent must preserve.

## Reusable Product Components

- Components or patterns to reuse:
- Screens/workflows likely to reuse them:
- State or permission behavior to centralize:
- Avoid one-off implementation:

## Acceptance Criteria

- The view supports the primary task without exposing unnecessary legacy complexity.
- Information marked `Keep Visible` is immediately accessible.
- Information marked `Move To Secondary` remains available without dominating the screen.
- `Remove Candidate` items are not excluded unless confirmed.
- Every identified legacy item appears in the field decision matrix.
- Required states are represented in the proposed structure.
- Current workflow steps are classified before they are changed.
- Frequent, expert, risky, and permission-gated actions are visually distinguished.
- Safe defaults and validation behavior are documented.
- The critical path can be completed without scrolling on the baseline desktop viewport.
- Secondary content does not push primary input, total/status, or primary action below the fold.
