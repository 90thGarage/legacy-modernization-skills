# Flow: Diseño de etiquetas

## Goal

- Flow ID: `diseno-etiquetas`.
- User goal: crear y guardar una plantilla visual reutilizable para imprimir datos de artículos.
- Business outcome: diseños consistentes disponibles para distintos lotes de impresión.
- Documentation status: `partially-confirmed`.
- Delivery status: `prototype-built`.
- Evidence: captura legacy, decisión del cliente, contrato de vista e implementación; capacidades gráficas reales pendientes.

## Primary Users

| Role | Job in this flow | Frequency | Pressure | Notes |
| --- | --- | --- | --- | --- |
| Administrativo / encargado | Crear o mantener plantillas | Ocasional | Media | Necesita precisión visual. |
| Soporte / implementador | Preparar formatos por comercio | Ocasional | Media/alta | Permisos no definidos. |

## Current Legacy Flow

| Step | User goal | Legacy surface | Pain / friction | Step classification | Notes |
| --- | --- | --- | --- | --- | --- |
| Elegir herramientas | Componer etiqueta | Editor legacy | Controles densos pero reconocibles | expert shortcut | Estructura útil a preservar. |
| Configurar página | Ajustar formato | Panel de página | Reglas físicas no documentadas | essential decision | Impresora fuera de alcance. |
| Guardar | Reutilizar diseño | Acción legacy | Pérdida de cambios pendiente | essential decision | Captura disponible. |

## Target Modern Flow

| Step | Modern behavior | Surface | User decision | Validation / recovery | Notes |
| --- | --- | --- | --- | --- | --- |
| Elegir o iniciar diseño | Seleccionar plantilla, crear, duplicar o renombrar | Rail de diseños | Elegir base | Advertir cambios sin guardar | Permisos pendientes. |
| Componer | Agregar y seleccionar elementos | Herramientas + canvas | Tipo y posición | Mantener límites visibles | Propiedades reales pendientes. |
| Configurar | Editar propiedades y página | Rail de propiedades | Valores visuales/físicos | No permitir geometría inválida | Sin drivers. |
| Guardar | Persistir diseño | Acción del editor | Confirmar nombre/configuración | Diseño queda disponible para imprimir | Estado local en prototipo. |
| Volver a impresión | Regresar con diseño seleccionado si ese fue el origen | Navegación contextual | Continuar lote | Preservar lote existente | Implementado. |

## Screens / Surfaces

| Surface | Legacy source | Modern destination | Pattern | Status |
| --- | --- | --- | --- | --- |
| Editor de etiquetas | Captura legacy | `LabelDesignWorkspace` | visual editor | prototype-built |

## Entry Points

- `Catálogo > Diseño de etiquetas`.
- Acción `Crear diseño` desde Impresión de etiquetas.

## Exit Points

- Diseño guardado disponible para impresión.
- Retorno al lote de impresión con diseño seleccionado.

## Blocking Dependencies

| Dependency | Type | Blocking? | Current status | Notes |
| --- | --- | --- | --- | --- |
| Modelo de elementos/propiedades | data | yes for production | needs-user-validation | Tipografías, códigos, fuentes y capas. |
| Formatos físicos | integration / data | yes | partial | Medidas y límites de impresora. |
| Persistencia y permisos | permission | yes | local prototype | Empresa/local pendientes. |

## Data And Rules

- Core entities: Diseño, Elemento, Página, Fuente de datos.
- Required data: nombre, dimensiones y al menos una composición válida según reglas futuras.
- Visible business rules: diseñar no imprime; guardar hace disponible la plantilla para el flujo de impresión.
- Recovery behavior: advertir antes de perder cambios y conservar el origen para volver.

## UX Decisions

| Decision | Rationale | Confirmation |
| --- | --- | --- |
| Mantener herramientas, canvas, propiedades y página | Preserva modelo mental del editor | user-confirmed |
| Separar diseño de impresión | Son trabajos y frecuencias diferentes | user-confirmed |
| Reutilizar el mismo editor desde entrada directa/contextual | Evita implementaciones divergentes | document-inferred |

## Open Questions

| Question | Risk if unresolved | Blocking? |
| --- | --- | --- |
| ¿Qué elementos, propiedades y simbologías están soportados? | Editor promete capacidades inexistentes | yes |
| ¿Qué formatos y límites físicos son válidos? | Impresión recortada o inválida | yes |
| ¿Cómo funcionan permisos, alcance y compatibilidad con IM4? | Diseños inaccesibles o inseguros | yes |

## Views To Build

| View ID | Purpose | Handoff path | Destination | Status |
| --- | --- | --- | --- | --- |
| diseno-etiquetas | Crear plantillas | `docs/product-redesign/views/diseno-etiquetas.md` | `label-workspaces.tsx` | prototype-built |
