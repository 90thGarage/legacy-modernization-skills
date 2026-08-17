# Flow: Gestión de rubros y subrubros

## Goal

- Flow ID: `rubros-subrubros`.
- User goal: mantener una clasificación jerárquica y crear valores desde Artículos sin perder el borrador.
- Business outcome: catálogo clasificado con relaciones padre-hijo consistentes.
- Documentation status: `user-confirmed` para arquitectura; semántica y bajas parcialmente confirmadas.
- Delivery status: `prototype-built`.
- Evidence: tres capturas legacy, decisiones del cliente, handoff e implementación.

## Primary Users

| Role | Job in this flow | Frequency | Pressure | Notes |
| --- | --- | --- | --- | --- |
| Administrativo | Mantener rubros y sus hijos | Variable | Media | Entrada administrativa. |
| Usuario que carga artículos | Crear clasificación faltante sin abandonar | Variable | Alta durante carga | Entrada contextual. |

## Current Legacy Flow

| Step | User goal | Legacy surface | Pain / friction | Step classification | Notes |
| --- | --- | --- | --- | --- | --- |
| Mantener rubro | Crear padre | ABM Rubros | Relación con hijos fragmentada | essential decision | Capturas confirmadas. |
| Mantener subrubro | Crear hijo | Superficie legacy relacionada | Puede perder contexto | essential decision | No debe ser destino principal. |
| Volver a artículo | Usar clasificación | ABM Artículos | Riesgo de perder carga | legacy workaround | Debe preservarse borrador. |

## Target Modern Flow

| Step | Modern behavior | Surface | User decision | Validation / recovery | Notes |
| --- | --- | --- | --- | --- | --- |
| Buscar rubro | Consultar padre, hijos, uso y estado | Tabla dominante | Elegir rubro | Búsqueda sin resultados | Lista full width. |
| Crear/editar jerarquía | Editar rubro y colección de subrubros | Drawer ancho | Definir padre e hijos | Duplicados bloquean guardado | Una sola intención. |
| Gestionar uso | Deshabilitar o decidir reasignación | Drawer/dialog | Confirmar impacto | No quitar hijos usados inline | Reasignación masiva futura. |
| Crear desde Artículos | Abrir editor contextual conservando formulario | Drawer superpuesto | Crear rubro/subrubro | Volver con valor seleccionado | Borrador completo preservado. |

## Screens / Surfaces

| Surface | Legacy source | Modern destination | Pattern | Status |
| --- | --- | --- | --- | --- |
| Rubros | ABM Rubros | `CategoriesWorkspace` | ABM jerárquico | prototype-built |
| Creación contextual | ABM Artículos | Editor compartido | drawer | prototype-built |

## Entry Points

- `Catálogo > Rubros`.
- `Administrar rubros` desde Artículos.
- Combobox Rubro/Subrubro en alta o edición de artículo.

## Exit Points

- Listado de rubros actualizado.
- Retorno al artículo con nueva clasificación seleccionada.

## Blocking Dependencies

| Dependency | Type | Blocking? | Current status | Notes |
| --- | --- | --- | --- | --- |
| Artículos asociados | entity | yes | prototype | Determina bloqueos. |
| Política de baja/reasignación | data / permission | yes for production | partial | Deshabilitar es fallback seguro. |
| Semántica de subrubro | domain | no for prototype | needs-user-validation | Puede representar marca u otra clasificación. |

## Data And Rules

- Core entities: Rubro, Subrubro, Artículo.
- Required data: identidad del rubro; subrubro opcional en el prototipo.
- Visible business rules: Subrubro siempre pertenece a Rubro; selectores en Artículos son dependientes.
- Validation rules: código/nombre de rubro únicos y nombre de subrubro único dentro del padre.
- Recovery behavior: conservar borrador y volver al origen con selección aplicada.

## UX Decisions

| Decision | Rationale | Confirmation |
| --- | --- | --- |
| No crear destino separado para Subrubros | No tiene sentido sin padre | user-confirmed |
| Guardar padre e hijos como una intención | Conserva consistencia | user-confirmed |
| Bloquear eliminación en uso y ofrecer deshabilitar | Protege historial | user-confirmed |

## Open Questions

| Question | Risk if unresolved | Blocking? |
| --- | --- | --- |
| ¿Todos los subrubros representan marcas? | Lenguaje de producto incorrecto | no |
| ¿Cuándo Rubro/Subrubro son obligatorios? | Artículos incompletos | yes for production |
| ¿Cómo funciona reasignación y borrado físico? | Pérdida o registros huérfanos | yes |

## Views To Build

| View ID | Purpose | Handoff path | Destination | Status |
| --- | --- | --- | --- | --- |
| rubros-subrubros | Mantener jerarquía | `docs/ux/rubros-subrubros-ui-handoff.md` | `categories-workspace.tsx` | prototype-built |
