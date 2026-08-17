# Flow: Impresión de etiquetas

## Goal

- Flow ID: `impresion-etiquetas`.
- User goal: seleccionar artículos, cantidades y un diseño para preparar e imprimir un lote de etiquetas.
- Business outcome: lote reconocible y validado antes de abrir el diálogo de impresión del sistema.
- Documentation status: `partially-confirmed`.
- Delivery status: `prototype-built`.
- Evidence: captura legacy, decisión del cliente, contrato de vista e implementación; hardware y cálculos finales pendientes.

## Primary Users

| Role | Job in this flow | Frequency | Pressure | Notes |
| --- | --- | --- | --- | --- |
| Usuario operativo | Preparar lote e imprimir | Variable por rubro | Media/alta | Puede procesar muchas filas. |
| Administrativo / soporte | Resolver diseños y dispositivos | Ocasional | Media | Configuración técnica separada. |

## Current Legacy Flow

| Step | User goal | Legacy surface | Pain / friction | Step classification | Notes |
| --- | --- | --- | --- | --- | --- |
| Buscar artículos | Preparar lote | Tabla legacy | Selección exacta no confirmada | essential decision | Captura disponible. |
| Completar cantidad/peso | Definir copias | Celdas de tabla | Balanza y cálculos ambiguos | essential decision | No inventar regla. |
| Elegir diseño e imprimir | Producir etiquetas | Rail + sistema | Bloqueos deben ser claros | irreversible | Diálogo del sistema se conserva. |

## Target Modern Flow

| Step | Modern behavior | Surface | User decision | Validation / recovery | Notes |
| --- | --- | --- | --- | --- | --- |
| Buscar | Encontrar artículos por código, descripción o barras | Buscador + tabla | Elegir artículos | Sin resultados permite corregir | Tabla dominante. |
| Preparar lote | Cargar cantidad y peso cuando corresponda | Filas + resumen | Definir copias | Error queda en la fila | Totales se actualizan. |
| Elegir diseño | Seleccionar plantilla y revisar preview | Rail sticky | Elegir diseño | Sin diseño ofrece `Crear diseño` | Lote se conserva. |
| Imprimir | Abrir diálogo del sistema | CTA `Imprimir` | Confirmar sistema/impresora | Doble click bloqueado; cancelar conserva lote | No impresión silenciosa. |

## Screens / Surfaces

| Surface | Legacy source | Modern destination | Pattern | Status |
| --- | --- | --- | --- | --- |
| Impresión de etiquetas | Captura legacy | `LabelPrintWorkspace` | operational batch workspace | prototype-built |
| Diálogo de impresión | Sistema operativo | Browser/system dialog | system | simulated/host-provided |

## Entry Points

- `Catálogo > Impresión de etiquetas`.
- Artículos seleccionados como entrada contextual futura.

## Exit Points

- Diálogo del sistema abierto, impresión cancelada o completada.
- Diseño de etiquetas cuando no existe una plantilla.

## Blocking Dependencies

| Dependency | Type | Blocking? | Current status | Notes |
| --- | --- | --- | --- | --- |
| Diseños guardados | flow / data | yes | prototype local | Ver `diseno-etiquetas.md`. |
| Impresora y diálogo del sistema | integration | yes for real print | not integrated | Drivers fuera de la vista. |
| Balanza/peso/cantidad | integration / data | conditional | needs-user-validation | No bloquear artículos no pesables sin regla. |

## Data And Rules

- Core entities: Diseño, Artículo imprimible, Fila de lote, Impresora.
- Required data: diseño seleccionado y total de etiquetas mayor a cero.
- Derived data: artículos en lista, con cantidad y total de etiquetas.
- Visible business rules: editar diseño ocurre en otro flujo; imprimir abre confirmación del sistema.
- Recovery behavior: conservar lote y diseño si se cancela o falla la impresión.

## UX Decisions

| Decision | Rationale | Confirmation |
| --- | --- | --- |
| Tabla/lote y rail de impresión en una superficie | Mantiene causa, preview y acción visibles | user-confirmed |
| `Crear diseño` vuelve con la plantilla seleccionada | Evita callejón sin salida | user-confirmed |
| No agregar wizard ni impresión silenciosa | Preserva control y reduce pasos | user-confirmed |

## Open Questions

| Question | Risk if unresolved | Blocking? |
| --- | --- | --- |
| ¿Cómo se calculan cantidad, peso, copias, páginas y columnas? | Cantidad impresa incorrecta | yes |
| ¿Qué estados reales reportan impresora y balanza? | Error o bloqueo ambiguo | yes for integration |
| ¿Qué permisos habilitan imprimir y usar diseños? | Uso no autorizado | yes |

## Views To Build

| View ID | Purpose | Handoff path | Destination | Status |
| --- | --- | --- | --- | --- |
| impresion-etiquetas | Preparar e imprimir lotes | `docs/product-redesign/views/impresion-etiquetas.md` | `label-workspaces.tsx` | prototype-built |
