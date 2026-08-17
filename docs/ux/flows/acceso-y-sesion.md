# Flow: Acceso y sesión

## Goal

- Flow ID: `acceso-y-sesion`.
- User goal: ingresar a la empresa correcta y comenzar a trabajar con las capacidades habilitadas para su rol.
- Business outcome: sesión identificada, navegación autorizada y entrada segura al trabajo principal.
- Documentation status: `partially-confirmed`.
- Delivery status: `prototype-built`.
- Evidence: `prototype-confirmed` para login y perfiles demo; autenticación, recuperación y alcance real necesitan validación.

## Primary Users

| Role | Job in this flow | Frequency | Pressure | Notes |
| --- | --- | --- | --- | --- |
| Usuario operativo | Ingresar y llegar a su vista inicial | Al inicio de cada sesión | Media/alta | El prototipo inicia en POS. |
| Administrador | Acceder a todas las áreas y configuraciones | Diaria | Media | El perfil demo tiene acceso total. |

## Current Legacy Flow

| Step | User goal | Legacy surface | Pain / friction | Step classification | Notes |
| --- | --- | --- | --- | --- | --- |
| Elegir base | Identificar empresa/datos | Login de escritorio | Alcance real no relevado | essential decision | `legacy-confirmed` parcialmente por el formulario. |
| Ingresar credenciales | Autenticarse | Login | Recuperación y errores no documentados | permission-gated | Requiere validación. |

## Target Modern Flow

| Step | Modern behavior | Surface | User decision | Validation / recovery | Notes |
| --- | --- | --- | --- | --- | --- |
| Completar acceso | Ingresar empresa/base, usuario y contraseña | Login | Elegir contexto e identidad | Error visible sin borrar los datos | Implementado con usuarios demo. |
| Iniciar sesión | Validar credenciales y construir sesión | Login | Confirmar ingreso | Credenciales inválidas mantienen el formulario | Sin backend real. |
| Entrar al producto | Abrir la vista inicial autorizada | App shell / POS | Ninguna | Navegación bloquea destinos no permitidos | Ambos perfiles demo abren POS. |
| Cerrar sesión | Volver al login y descartar sesión local | Menú de usuario | Confirmar salida si hay trabajo pendiente | Regla de borradores pendiente | Prototipo sin persistencia de sesión. |

## Screens / Surfaces

| Surface | Legacy source | Modern destination | Pattern | Status |
| --- | --- | --- | --- | --- |
| Login | Capturas de login | `InfoManagerPrototype / LoginScreen` | main view | prototype-built |
| App shell autorizado | Menú legacy | `AppShell` | route | prototype-built |

## Entry Points

- Apertura de la aplicación sin sesión.
- Regreso después de cerrar sesión.

## Exit Points

- POS como inicio actual para Administrador y Vendedor.
- Recuperación de contraseña, todavía no implementada.

## Blocking Dependencies

| Dependency | Type | Blocking? | Current status | Notes |
| --- | --- | --- | --- | --- |
| Proveedor de identidad y sesión | integration | yes for production | mock | Credenciales hardcodeadas. |
| Empresa/base autorizada | data / permission | yes for production | visual only | El campo no cambia el origen de datos del prototipo. |
| Roles y permisos | permission | yes | prototype | Ver `roles-y-permisos.md`. |

## Data And Rules

- Core entities: Usuario, Empresa/Base, Rol, Sesión.
- Required data: empresa/base, usuario y contraseña.
- Visible business rules: los destinos visibles y accesibles dependen del usuario autenticado.
- Validation rules: credenciales inválidas muestran un error; no revelar cuál dato falló.
- Recovery behavior: conservar empresa y usuario para permitir corregir; recuperación real pendiente.

## UX Decisions

| Decision | Rationale | Confirmation |
| --- | --- | --- |
| Separar login del shell administrativo | Evita exponer navegación sin sesión | prototype-confirmed |
| Aplicar la misma regla de acceso al sidebar y navegación interna | Evita accesos inconsistentes | user-confirmed |
| Tratar los usuarios demo como simulación | No confundir prototipo con seguridad real | prototype-confirmed |

## Open Questions

| Question | Risk if unresolved | Blocking? |
| --- | --- | --- |
| ¿Cómo se seleccionan empresa, base y local en producción? | Sesión sobre datos incorrectos | yes |
| ¿Cómo funcionan recuperación, expiración y cierre con borradores abiertos? | Pérdida de trabajo o acceso inseguro | yes |
| ¿Existe autenticación externa o segundo factor? | Arquitectura de acceso incompleta | yes for production |

## Views To Build

| View ID | Purpose | Handoff path | Destination | Status |
| --- | --- | --- | --- | --- |
| login | Autenticar y seleccionar contexto | `docs/ux/login-implementation-notes.md` | `src/features/infomanager/index.tsx` | prototype-built |
