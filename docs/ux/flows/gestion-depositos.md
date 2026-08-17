# Flow: Gestión de depósitos

## Goal

- Flow ID: `gestion-depositos`.
- User goal: encontrar, crear y mantener depósitos utilizados por stock, logística y punto de venta.
- Business outcome: ubicaciones de stock consistentes y reutilizables por otros flujos.
- Documentation status: `partially-confirmed`.
- Delivery status: `prototype-built`.
- Evidence: captura legacy, decisiones del cliente, contrato de vista y prototipo; reglas de stock pendientes.

## Primary Users

| Role | Job in this flow | Frequency | Pressure | Notes |
| --- | --- | --- | --- | --- |
| Administrativo / encargado | Mantener depósitos | Ocasional | Media | Impacta operaciones posteriores. |
| Stock / logística | Consultar disponibilidad de ubicaciones | Frecuente | Media | Rol no modelado. |

## Current Legacy Flow

| Step | User goal | Legacy surface | Pain / friction | Step classification | Notes |
| --- | --- | --- | --- | --- | --- |
| Consultar | Encontrar depósito | ABM Depósitos | Formulario persistente bajo grilla | legacy workaround | Captura disponible. |
| Configurar centro de costo | Relacionar depósito | Interacción por doble clic | Descubribilidad baja | essential decision | Debe ser visible. |

## Target Modern Flow

| Step | Modern behavior | Surface | User decision | Validation / recovery | Notes |
| --- | --- | --- | --- | --- | --- |
| Buscar | Consultar depósitos y estado | Tabla dominante | Elegir registro | Estado vacío claro | Sin formulario permanente. |
| Ver detalle | Revisar identidad y relaciones | Drawer | Editar o cerrar | Mantener listado | Acciones visibles por fila. |
| Crear/editar | Completar datos breves y centro de costo | Drawer | Definir configuración | Validar código/nombre duplicado | Formulario simple. |
| Guardar/deshabilitar | Persistir o retirar de uso | Barra/acción contextual | Confirmar impacto | Bloquear eliminación en uso | Regla final pendiente. |

## Screens / Surfaces

| Surface | Legacy source | Modern destination | Pattern | Status |
| --- | --- | --- | --- | --- |
| Depósitos | ABM Depósitos | `WarehousesWorkspace` | list-detail workspace | prototype-built |
| Editor | Formulario legacy | Drawer | formulario simple | prototype-built |

## Entry Points

- `Stock > Depósitos`.
- Artículos, facturación o logística como contexto futuro.

## Exit Points

- Depósito creado o actualizado.
- Retorno al flujo que solicitó la selección.

## Blocking Dependencies

| Dependency | Type | Blocking? | Current status | Notes |
| --- | --- | --- | --- | --- |
| Stock por depósito | data | yes for production | partial | Movimientos no modelados aquí. |
| Centro de costo | entity | no for prototype | inferred | Semántica pendiente. |
| Política de baja | permission / data | yes | needs-user-validation | Registros usados. |

## Data And Rules

- Core entities: Depósito, Centro de costo, Empresa/Local, Stock.
- Required data: código, nombre y estado; relaciones exactas pendientes.
- Visible business rules: configuración se abre mediante acción visible, nunca por doble clic oculto.
- Recovery behavior: ofrecer deshabilitar si eliminar rompería referencias históricas.

## UX Decisions

| Decision | Rationale | Confirmation |
| --- | --- | --- |
| Tabla dominante y drawers | Mantiene foco en búsqueda/consulta | user-confirmed |
| Centro de costo visible en detalle/edición | Elimina interacción oculta | user-confirmed |
| No incluir movimientos de stock en el ABM | Son otro objetivo de usuario | document-inferred |

## Open Questions

| Question | Risk if unresolved | Blocking? |
| --- | --- | --- |
| ¿Qué relación real existe entre depósito, local y centro de costo? | Selección incorrecta | yes |
| ¿Qué depósitos pueden deshabilitarse o eliminarse? | Referencias rotas | yes |
| ¿Qué flujo administra transferencias y ajustes? | Alcance incompleto de stock | no for this CRUD |

## Views To Build

| View ID | Purpose | Handoff path | Destination | Status |
| --- | --- | --- | --- | --- |
| depositos | Mantener depósitos | `docs/product-redesign/views/depositos.md` | `entity-workspaces.tsx` | prototype-built |
