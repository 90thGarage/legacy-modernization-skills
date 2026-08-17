# Flow: Gestión de roles y permisos

## Goal

- Flow ID: `roles-y-permisos`.
- User goal: definir qué áreas y operaciones puede usar cada rol y asignar usuarios sin perder trazabilidad.
- Business outcome: acceso coherente con la responsabilidad y el riesgo de cada usuario.
- Documentation status: `inferred`.
- Delivery status: `prototype-built`.
- Evidence: implementación y decisiones de navegación; taxonomía y enforcement reales pendientes.

## Primary Users

| Role | Job in this flow | Frequency | Pressure | Notes |
| --- | --- | --- | --- | --- |
| Administrador | Crear roles, asignar permisos y usuarios | Ocasional | Alta por impacto | Único acceso en el prototipo. |
| Soporte / implementador | Configurar perfiles iniciales | Ocasional | Alta | Alcance pendiente. |

## Current Legacy Flow

| Step | User goal | Legacy surface | Pain / friction | Step classification | Notes |
| --- | --- | --- | --- | --- | --- |
| Elegir usuario/perfil | Configurar acceso | Permisos visibles por usuario | Modelo fino no relevado | permission-gated | Evidencia parcial. |
| Marcar capacidades | Autorizar operaciones | Matriz legacy no disponible | Dependencias implícitas | risky | Requiere validación con producto. |

## Target Modern Flow

| Step | Modern behavior | Surface | User decision | Validation / recovery | Notes |
| --- | --- | --- | --- | --- | --- |
| Seleccionar rol | Ver identidad, usuarios y estado | Lista de roles | Elegir rol existente | Roles de sistema protegidos | Implementado. |
| Crear o duplicar | Definir base del rol | Dialog / acción | Nombre, descripción y color | Cancelar no crea cambios | Datos simulados. |
| Configurar permisos | Marcar Ver/Crear/Modificar/Eliminar y sensibles | Matriz agrupada | Autorizar capacidades | Operar habilita Ver; quitar Ver limpia dependencias | Propuesta conservadora. |
| Asignar usuarios | Relacionar miembros | Tab Usuarios | Elegir usuarios | Multiplicidad pendiente | Mock. |
| Guardar | Persistir intención completa | Barra de acción | Confirmar cambios | LocalStorage; no cambia autorización real | No es seguridad backend. |

## Screens / Surfaces

| Surface | Legacy source | Modern destination | Pattern | Status |
| --- | --- | --- | --- | --- |
| Roles y permisos | Referencias parciales | `RolesPermissionsWorkspace` | list-detail workspace | prototype-built |
| Crear rol | Inferido | Dialog | dialog | prototype-built |

## Entry Points

- Menú del usuario administrador.

## Exit Points

- Regreso al workspace anterior.
- Navegación futura afectada por la configuración guardada.

## Blocking Dependencies

| Dependency | Type | Blocking? | Current status | Notes |
| --- | --- | --- | --- | --- |
| Taxonomía de permisos | permission | yes for production | proposal | Derivada de la navegación del prototipo. |
| Enforcement backend | integration | yes for production | not implemented | La UI no reemplaza autorización. |
| Auditoría y alcance | data / permission | yes | not mapped | Empresa, local y cambios históricos. |

## Data And Rules

- Core entities: Rol, Usuario, Área, Capacidad, Permiso sensible.
- Required data: nombre de rol, permisos y usuarios asignados.
- Visible business rules: `Ver` controla navegación; una operación requiere visibilidad; roles protegidos no se eliminan.
- Validation rules: un rol con usuarios no se elimina; nombres duplicados y rol mínimo requieren definición.
- Recovery behavior: cancelar creación no altera la lista; guardar debe ser atómico.

## UX Decisions

| Decision | Rationale | Confirmation |
| --- | --- | --- |
| Separar visibilidad de operación | Permite ver sin modificar | user-confirmed |
| Agrupar permisos por área de negocio | Refleja la navegación moderna | prototype-confirmed |
| Tratar permisos sensibles fuera del CRUD genérico | Expone riesgos fiscales y de caja | document-inferred |

## Open Questions

| Question | Risk if unresolved | Blocking? |
| --- | --- | --- |
| ¿Un usuario puede tener varios roles y cómo se combinan? | Acceso efectivo ambiguo | yes |
| ¿Los permisos varían por empresa o local? | Exceso o falta de acceso | yes |
| ¿Qué cambios deben auditarse y quién puede recuperar un rol? | Falta de trazabilidad | yes |

## Views To Build

| View ID | Purpose | Handoff path | Destination | Status |
| --- | --- | --- | --- | --- |
| roles-permisos | Mantener roles, permisos y usuarios | `docs/ux/roles-permissions-implementation-notes.md` | `roles-permissions-workspace.tsx` | prototype-built |
