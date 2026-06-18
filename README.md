# Legacy Modernization Skills

Two autonomous Codex skills for migrating legacy PowerBuilder-style screens into modern React web app views.

## Skills

- `legacy-ux-brief`: interviews the user, analyzes the legacy screen, and creates UX handoff artifacts.
- `legacy-ui-build`: consumes the UI handoff and builds a React view using shadcn/ui adapted to the design system.

## Installation

Copy each skill folder into the client's skills directory:

```txt
.agents/skills/
  legacy-ux-brief/
  legacy-ui-build/
```

Each skill is self-contained. Do not install only the `SKILL.md` files; keep their `references/` folders with them.

## Recommended Project Structure

The UX skill writes one folder per migrated view:

```txt
legacy-modernization/
  views/
    customer-detail/
      view-ux-brief.md
      ui-handoff.md
      legacy-screenshot.png
```

The UI skill reads `ui-handoff.md` first and writes code to the user-specified destination.

## Client Setup

Before using `legacy-ui-build`, the client should complete:

```txt
legacy-ui-build/references/design.md
legacy-ui-build/references/component-library.md
legacy-ui-build/references/product-domain.md
```

Assets can be placed in:

```txt
legacy-ui-build/assets/
```

The UI skill can continue when these references are incomplete, but it must mark assumptions in `implementation-notes.md`.
