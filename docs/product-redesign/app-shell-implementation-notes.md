# App Shell Implementation Notes

## 2026-07-23 — Prototype roles

- Added two hardcoded prototype accounts: `admin / infomanager` and `vendedor / infomanager`.
- Centralized credential matching, home view and view access in `src/features/infomanager/access-control.ts`.
- Sidebar groups and children are filtered using the same access rule used by internal navigation.
- The active user name and role are shown in the existing footer account control.
- This is client-side prototype behavior only. Production authentication, route protection, action authorization and data scoping remain backend responsibilities.
- shadcn components reused: `Input`, `Button`, `Sidebar`, `DropdownMenu` and existing shell primitives.
- Verification completed: ESLint passed; Playwright passed for administrator navigation, seller-only navigation, logout and invalid credentials; production build passed.

## 2026-07-23 — Soft charcoal dark theme

- Replaced pure black surfaces and near-white text with a charcoal tonal scale: `#101113` canvas, `#151619` sidebar, `#191a1e` panels and `#1d1e22` overlays.
- Kept InfoManager blue for primary actions while softening focus rings and secondary states.
- Used low-alpha borders for operational tables and controls; elevated panels, popovers, sheets and dialogs use a subtle directional edge gradient, top highlight and restrained shadow.
- Inputs use a darker control surface so they remain distinguishable inside cards without relying on a bright outline.
- The change is token- and CSS-based in `src/app/globals.css`; no workflow, layout, data contract or component behavior changed.
- This palette is a prototype dark-theme extension because the current `skills/builder/references/design.md` only defines the light palette.
- Verification completed: ESLint and `git diff --check` passed; browser review covered dark login, sidebar, article table, inputs and dialogs at 100% scale with no console errors. The production build compiled successfully, then stopped on the unrelated existing `ViewId.dashboard` / `viewTitles` type mismatch in `app-shell.tsx`.

## 2026-08-14 — Shell without persistent top bar

- Removed the shell-level top bar that repeated the active view title.
- Moved the expand/collapse trigger into the sidebar brand row, with explicit `Expandir sidebar` and `Contraer sidebar` accessible labels.
- Preserved prototype controls by moving POS layout selection into `Configuración POS` and advanced invoicing layouts into the user menu while that view is active.
- Moved `ARCA operativo` into the POS command area so the fiscal state remains visible without recreating global chrome.
- shadcn components reused: `SidebarTrigger`, `SidebarHeader`, `DropdownMenu`, `Sheet` and `Button`.
- No product fields, navigation permissions or workspace actions changed.
- Verification completed at 1280 × 720 in the production app: collapsed sidebar, expanded sidebar and `Ventas > Facturas` all render without the global bar; browser console has no warnings/errors. ESLint and the production build pass.
