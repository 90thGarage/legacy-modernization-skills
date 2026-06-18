---
version: alpha
name: InfoManager
description: InfoManager design system for operational business management screens.
source:
  figmaChannel: "5x1o4fl5"
  figmaFile: "InfoManager"
  figmaPage: "Page 2"
  derivedFrom:
    - "Logo"
    - "Header/Nav Bar"
    - "Button"
    - "Components"
    - "Accordion"
    - "Category selection"
    - "Login"
    - "Footer"
assets:
  logoBlue: "../assets/logos/infomanager-blue.svg"
  logoNegative: "../assets/logos/infomanager-negative.svg"
  logoPositive: "../assets/logos/infomanager-positive.svg"
  logoBlueSubtitle: "../assets/logos/infomanager-blue-subtitle.svg"
  logoNegativeSubtitle: "../assets/logos/infomanager-negative-subtitle.svg"
  logoPositiveSubtitle: "../assets/logos/infomanager-positive-subtitle.svg"
colors:
  primary: "#0057FF"
  primary-hover: "#0041BF"
  secondary: "#1A1A1A"
  accent: "#0057FF"
  background: "#F5F5F5"
  surface: "#FFFFFF"
  muted-surface: "#F5F5F5"
  blue-muted-surface: "#D9E6FF"
  blue-icon-surface: "#BFD5FF"
  text-primary: "#1A1A1A"
  text-strong: "#353535"
  text-secondary: "#7A7A7A"
  text-muted: "#A7A7A7"
  text-inverse: "#FFFFFF"
  border: "#D3D3D3"
  border-strong: "#999999"
  divider: "#E6E6E6"
typography:
  body-14:
    fontFamily: "Suisse Intl"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
  body-16:
    fontFamily: "Suisse Intl"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
  title-16:
    fontFamily: "Suisse Intl"
    fontSize: 16px
    fontWeight: 500
    lineHeight: 24px
  title-20:
    fontFamily: "Suisse Intl"
    fontSize: 20px
    fontWeight: 400
    lineHeight: 26px
  heading-24:
    fontFamily: "Suisse Intl"
    fontSize: 24px
    fontWeight: 500
    lineHeight: 28.8px
  label-12-mono:
    fontFamily: "Geist Mono"
    fontSize: 12px
    fontWeight: 500
    lineHeight: 18px
  label-14-mono:
    fontFamily: "Geist Mono"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 20px
  button-12-mono:
    fontFamily: "Geist Mono"
    fontSize: 12px
    fontWeight: 600
    lineHeight: 20px
  button-14-mono:
    fontFamily: "Geist Mono"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 24px
  display-logo:
    fontFamily: "Neue Montreal"
    fontWeight: 800
spacing:
  1: 4px
  2: 8px
  3: 12px
  4: 16px
  5: 20px
  6: 24px
  8: 32px
  base: 4px
radius:
  default: 4px
  operational: 4px
components:
  button-primary-blue:
    backgroundColor: "{colors.primary}"
    hoverBackgroundColor: "{colors.primary-hover}"
    textColor: "{colors.text-inverse}"
    typography: "{typography.button-14-mono}"
    radius: "{radius.default}"
    height: 40px
    padding: "0 12px"
  button-primary-black:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.text-inverse}"
    typography: "{typography.button-14-mono}"
    radius: "{radius.default}"
    height: 40px
    padding: "0 12px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-strong}"
    borderColor: "{colors.border}"
    typography: "{typography.button-14-mono}"
    radius: "{radius.default}"
    height: 40px
    padding: "0 12px"
  button-small:
    typography: "{typography.button-12-mono}"
    radius: "{radius.default}"
    height: 36px
    padding: "0 10px"
  button-large:
    typography: "{typography.button-14-mono}"
    radius: "{radius.default}"
    height: 48px
    padding: "0 18px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    borderColor: "{colors.border-strong}"
    typography: "{typography.label-14-mono}"
    radius: "{radius.default}"
    height: 40px
    padding: "0 12px"
  input-compact:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    borderColor: "{colors.border}"
    typography: "{typography.label-12-mono}"
    radius: "{radius.default}"
    height: 36px
    padding: "0 10px"
  panel:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.border}"
    radius: "{radius.default}"
    paddingOperational: 12px
    paddingStandard: 24px
  table-operational:
    typography: "{typography.body-14}"
    headerTypography: "{typography.label-12-mono}"
    rowHeight: "36px-48px"
    radius: "{radius.default}"
operational:
  density: compact
  criticalViewport:
    requiredWithoutScroll:
      - primaryInput
      - workingList
      - totalStatus
      - blockingValidation
      - primaryCompletionAction
    itemSearchPlacement: "directly-above-working-list"
    scrollRegion: "workingList"
  avoid:
    - "card-heavy-operational-layouts"
    - "hidden-primary-action-below-fold"
    - "detached-item-search-in-global-header"
    - "large-radius-controls"
    - "decorative-operational-layouts"
---

# InfoManager

## Overview

InfoManager is a design system for business management software. The UI should feel professional, direct, compact, and operational. Prioritize fast scanning, clear hierarchy, visible state, and safe completion of high-frequency workflows.

The Figma source does not expose published styles, so the tokens above are derived from inspected local components. Treat the YAML frontmatter as the machine-readable contract. The sections below explain how to use it.

## Colors

Use the InfoManager blue `#0057FF` for the primary brand accent, selected states, and the single dominant action when blue is appropriate. Use black/dark neutral for strong operational actions when the workflow needs a serious, high-contrast control.

Use neutral surfaces first: `background` for the page, `surface` for panels, `border` and `divider` for structure. Do not invent a new palette unless the handoff requires a domain state that is missing. If error, warning, or success colors are not defined by the product context, choose conservative accessible values and document the assumption.

## Typography

Use `Suisse Intl` for readable business content. Use `Geist Mono` for buttons, labels, metadata, navigation, table headers, numeric/operational commands, and compact status text. Use `Neue Montreal` only for brand/display assets such as the logo.

Generated views must actually load or inherit these fonts. Do not only set `font-family` names if the repo has no font import. If fonts are missing, document the exact missing setup in `implementation-notes.md` and use explicit fallbacks:

- `Suisse Intl`, then Arial/system sans.
- `Geist Mono`, then Menlo/Consolas/monospace.
- `Neue Montreal`, then Arial Black/Arial/system sans.

## Layout

Spacing follows a 4px base scale. Use 8px inside tight groups, 12-16px between related groups, and 24-32px for larger sections. Operational screens should use compact density and should not wrap every region in large padded cards.

For billing, POS, stock, cash register, fast-entry, approvals, and other high-frequency workflows, preserve the critical viewport: primary input, active record/list, total/status, blocking validation, and primary completion action must be visible without scroll.

When the user is adding items, place the product/code/name search input directly above the list or table it fills. It should read as part of the working area, not as a global header control.

Use the main table/list as the scrollable region when vertical space is constrained. Keep action rails or bottom action bars fixed/sticky when needed. Secondary actions should be grouped, collapsed, or placed below the critical path.

## Shapes

Use 4px radius everywhere by default: buttons, inputs, panels, cards, tables, badges, tabs, dialogs, drawers, and operational sections. Do not mix radius families in the same view. Avoid pill controls unless an existing repo component requires them.

## Components

Use the `components` tokens in the frontmatter before inventing ad hoc CSS. Prefer shadcn/ui primitives styled to these tokens.

- Primary button: Blue or black fill, mono label, 4px radius. Use for the single dominant action.
- Secondary button: White surface, subtle border, mono label, 4px radius.
- Inputs: 40px standard height, 36px compact height, 4px radius, visible border.
- Panels: white surface, subtle border, 4px radius. Operational panels use 8-16px padding.
- Tables: compact density, 36-48px rows, mono headers, clear numeric alignment.
- Dialogs/drawers: use for focused sub-flows. Merge legacy modals into the main flow when the modal exists only because of old UI constraints.
- Badges/status: compact, mono, 4px radius, color plus text/icon.

## Operational Screens

Operational screens are tools, not dashboards. They should preserve useful legacy strengths such as dense grids, visible totals, keyboard command areas, compact action clusters, and clear completion actions.

Do not hide the primary completion action below scroll. Do not detach item search from the item list. Do not use large marketing spacing, decorative cards, or oversized CTAs unless the handoff explicitly calls for them.

## Voice & Content

Use direct business language. Preserve domain terms users already know. Translate technical/system labels only when they are implementation details rather than business vocabulary.

Errors should say what happened and what to do next. Disabled critical actions should show the reason nearby. Empty states should point to the next operational action.

## Do

- Use the YAML tokens for color, typography, spacing, radius, and component sizing.
- Keep operational screens compact and scannable.
- Use blue and black intentionally for hierarchy.
- Keep item search directly above the working list/table.
- Keep the primary action visible in the critical viewport.
- Verify that fonts are actually loaded.
- Document missing tokens, fonts, or states as assumptions.

## Don't

- Do not turn operational screens into spacious marketing/card layouts.
- Do not use border radius above 4px unless forced by an existing component.
- Do not hide the primary completion action below scroll.
- Do not make all actions visually equal.
- Do not invent colors outside the InfoManager blue/black/neutral base without product reason.
- Do not claim typography compliance when the app is falling back silently to browser defaults.
