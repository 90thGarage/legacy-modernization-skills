# Flow: Catalogo / ABM articulos

## Goal

- Flow ID: `catalogo-articulos`
- User goal: crear, mantener, clasificar y consultar articulos/productos.
- Business outcome: productos vendibles correctamente configurados para venta, balanza, etiquetas, series y consultas.
- Documentation status: `partially-confirmed`.
- Delivery status: `prototype-built`.
- Evidence: demo, capturas, decisiones del cliente, brief/handoff historicos de `catalogo-productos` e implementacion actual; campos y reglas de dominio finas requieren validacion.

## Primary Users

| Role | Job in this flow | Frequency | Pressure | Notes |
| --- | --- | --- | --- | --- |
| Administrativo / encargado | Alta y mantenimiento de productos | needs-user-validation | Media | Falta patron real: carga masiva vs edicion puntual. |
| Cajero / mostrador | Consulta rapida de precio o producto | demo-inferred | Alta si cliente espera | Consulta rapida puede ser para cliente/tablet. |
| Soporte/admin | Configurar balanza, etiquetas, rubros, caracteristicas | demo-confirmed | Variable | Depende del rubro. |

## Current Legacy Flow

| Step | User goal | Legacy surface | Pain / friction | Step classification | Notes |
| --- | --- | --- | --- | --- | --- |
| Alta/mantenimiento articulos | Crear o editar producto comun | ABM articulos | Uso real no cubierto | essential decision | Productos de supermercado. |
| Clasificar | Rubros/subrubros | ABM | Frecuencia pendiente | useful confirmation | Agrupa productos. |
| Etiquetar | Imprimir etiquetas propias | Etiquetas | Configuracion pendiente | occasional | Carniceria/hamburguesas. |
| Consultar precio | Cliente o usuario consulta precio | Consulta rapida | Surface no detallada | useful confirmation | Tablet en pasillo/pared. |
| Trazar seriados | Lote/serie/proveedor/cliente | Articulos seriados | Reglas pendientes | compliance / traceability | Veterinaria/vacunas. |
| Configurar balanza | Vincular PLU/precio/modelo | Balanza | Depende hardware | integration-gated | Relacion con flow balanza. |
| Caracteristicas | Agregar detalles no-stock | Caracteristicas | Uso/filtros pendientes | optional | Talle/tela/color/bordado. |

## Target Modern Flow

| Step | Modern behavior | Surface | User decision | Validation / recovery | Notes |
| --- | --- | --- | --- | --- | --- |
| Buscar/editar articulo | Tabla/listado y panel de datos clave | Catalogo | Producto correcto | Duplicados, estado, precio | No hay datos reales de frecuencia. |
| Crear articulo | Alta guiada con basicos y capacidades | Catalogo / drawer | Que capacidades aplican | Campos minimos, precio, codigo | Requiere entrevista ABM. |
| Configurar capacidades | Balanza, series, etiquetas, caracteristicas | Secciones secundarias | Activar segun producto | Validacion contextual | No mezclar todo en primer viewport. |
| Consulta rapida | Lectura de producto/precio | Consulta dedicada | Buscar item | Producto no encontrado | Para cliente o pasillo. |

## Screens / Surfaces

| Surface | Legacy source | Modern destination | Pattern | Status |
| --- | --- | --- | --- | --- |
| ABM articulos | Demo IM5 | `ArticlesWorkspace` | main view | prototype-built |
| Rubros/subrubros | Demo + capturas | `CategoriesWorkspace` | panel / route | prototype-built |
| Etiquetas | Demo + capturas | Flujos de diseno e impresion | route | prototype-built |
| Consulta rapida | Demo + captura | `KioskPriceLookup` | main view / kiosk | prototype-built |
| Articulos seriados | Demo + captura | Seccion del editor de Articulos | panel | prototype-built |
| Balanza | Demo + captura | Seccion del editor de Articulos | panel | prototype-built |
| Caracteristicas | Demo + captura | Seccion del editor de Articulos | panel | prototype-built |

## Entry Points

- Menu ABM / articulos.
- Desde POS si falta producto o se necesita consulta.
- Desde balanza/etiquetas/produccion segun configuracion.

## Exit Points

- Producto creado/editado.
- Producto consultado.
- Etiqueta impresa.
- Producto configurado para balanza/serie/caracteristicas.

## Blocking Dependencies

| Dependency | Type | Blocking? | Current status | Notes |
| --- | --- | --- | --- | --- |
| Campos obligatorios reales de articulo | data | yes | open | No cubierto. |
| Uso real de ABM | research | yes before UI | needs-user-validation | Buscar/editar vs cargar muchos. |
| Reglas de seriados/lotes | business rule | yes | partial | Ejemplo veterinaria. |
| Relacion con stock/costo/produccion | flow | no | future-scope | Produccion no migrada completa. |

## Data And Rules

- Core entities: Articulo, Rubro, Subrubro, Etiqueta, Serie/Lote, Balanza, Caracteristica, Stock.
- Required data: nombre/descripcion, precio/codigo segun producto; exacto pendiente.
- Optional data: receta, PLU, serie/lote, caracteristicas, etiqueta, vencimiento.
- Derived data: precio consulta, trazabilidad, etiquetas, costo.
- Visible business rules: seriados requieren trazabilidad proveedor/cliente; etiquetas pueden incluir receta/peso/vencimiento.
- Validation rules: pendientes de ABM real.
- Recovery behavior: no definido.

## UX Decisions

| Decision | Rationale | Confirmation |
| --- | --- | --- |
| Mantener un unico flujo canonico `catalogo-articulos`; `catalogo-productos` queda como alias historico | Evita dos fuentes para el mismo objetivo | user-confirmed |
| Separar capacidades por producto | Balanza/series/etiquetas no aplican a todos | demo-inferred |
| Consulta rapida puede requerir experiencia tipo kiosk/tablet | Caso de pasillo/pared | demo-confirmed |

## Open Questions

| Question | Risk if unresolved | Blocking? |
| --- | --- | --- |
| Que campos se llenan siempre y cuales casi nunca | UI puede priorizar mal | yes |
| Como buscan/editan articulos los administrativos | Flujo base incorrecto | yes |
| Que validaciones frenan grabar articulo | Guardado puede fallar tarde | yes |
| Que datos de series/lotes son obligatorios | Trazabilidad incompleta | yes |

## Evidence

| Claim | Source | Confidence |
| --- | --- | --- |
| ABM agrupa articulos, rubros, etiquetas, consulta rapida, seriados, balanza y caracteristicas | minuta tecnica 2026-07-08 | demo-confirmed |
| Falta entrevistar administrativos para ABM | cobertura guia 2026-07-08 | needs-user-validation |
| Produccion/costo no esta completo en IM5 | minuta tecnica 2026-07-08 | future-scope |

## Views To Build

| View ID | Purpose | Handoff path | Destination | Status |
| --- | --- | --- | --- | --- |
| catalogo-articulos | Catalogo / ABM articulos | `docs/ux/catalogo-productos-ui-handoff.md` | `entity-workspaces.tsx` | prototype-built |
| rubros-subrubros | Clasificacion jerarquica relacionada | `docs/ux/rubros-subrubros-ui-handoff.md` | `categories-workspace.tsx` | prototype-built |
