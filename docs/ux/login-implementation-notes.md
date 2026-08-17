# Login implementation notes

## Correction applied

- Used the user-provided screenshots as the corrective UI contract.
- Aligned the InfoManager wordmark and the headline to the same left inset: `45px` from the brand panel edge.
- Moved the headline upward by replacing the bottom-anchored layout with a fixed `128px` gap below the wordmark.
- Replaced the login panel's hardcoded dark neutrals with the shared `background`, `card`, `border`, `foreground`, `muted-foreground`, `input`, and `ring` theme tokens.
- Preserved the login form, typography, background artwork, brand colors, and responsive visibility rules.

## Implementation context

- Existing shadcn components preserved: `Button` and `Input`.
- Existing design assets preserved: `blue-rays.jpg` and `im-wordmark.svg`.
- Shared dark-theme colors now resolve from `src/app/globals.css`, matching the rest of the application.
- Product context applied: `docs/ux/product-context.md`.
- Flow context: `./flows/acceso-y-sesion.md`. No existe todavía un UX brief, UI handoff o matriz de trazabilidad específicos de Login; la corrección visual del usuario sigue teniendo precedencia para ese alcance.

## Verification

- `npx eslint src/features/infomanager/index.tsx`: passed.
- `npx tsc --noEmit`: passed.
- Browser at `1883x990`: wordmark inset `45px`; headline inset `45px`; vertical gap `128px`.
- Browser in dark theme: login background `#000`, foreground `#ededed`, input border `#454545`, muted foreground `#a0a0a0`, and primary `#0057ff`, all resolved from the shared theme variables.
- Browser at `900x900`: brand panel remains hidden, form remains visible, and no horizontal overflow is introduced.
