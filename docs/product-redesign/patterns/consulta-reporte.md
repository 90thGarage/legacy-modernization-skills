# Pattern: Consulta Y Reporte

## Metadata

- Pattern ID: `consulta-reporte`
- Status: draft
- First reference view: Comprobantes por periodo como ejemplo estructural
- Related patterns: ninguno

## Purpose

Estandarizar vistas de lectura orientadas a filtrar, comparar, resumir y exportar informacion sin modificar la operacion consultada.

Usar para consultas administrativas, reportes operativos y listados de control. No usar cuando la accion principal crea, confirma o modifica un documento.

## Stable Contract

### Layout

1. Header con nombre, alcance, cantidad de resultados y botones secundarios de exportacion.
2. Busqueda en una fila full-width.
3. Segunda fila unica con `Tabs` de acceso rapido a la izquierda y filtros compactos visibles a la derecha, siguiendo `search-filter-bar` y la vista `Documentos`.
4. Franja opcional de uno a cuatro indicadores derivados, sin cards ni espacio ornamental.
5. Tabla o visualizacion dominante, pegada al mismo bloque visual de busqueda y filtros.
6. Detalle contextual superpuesto para inspeccionar un resultado sin reducir permanentemente la tabla ni perder filtros.

### Information Hierarchy

- Siempre visible: busqueda, filtros activos, periodo, cantidad de resultados y columnas de comparacion.
- Resumen: metricas que responden la pregunta del reporte, no indicadores decorativos.
- Contextual: detalle del registro y vinculo a su vista fuente.
- Secundario: configuracion de columnas, formato y exportaciones avanzadas.

### Actions

- Los filtros se aplican inmediatamente salvo que la consulta sea costosa; no requieren labels superiores porque su valor visible identifica el criterio y conservan nombre accesible.
- Limpiar filtros restaura el estado sugerido del reporte.
- Ordenar, paginar y configurar columnas.
- Abrir detalle o vista fuente sin perder el contexto de consulta.
- Exportar como CSV, Excel o PDF respeta exactamente filtros, columnas, orden, agrupacion, permisos y alcance visible.
- Actualizar vuelve a consultar y muestra antiguedad de datos cuando sea relevante.

### Navigation And Return

Los filtros se conservan al abrir y volver de un detalle. Los links compartidos pueden serializar filtros cuando el producto lo soporte.

## Required States

- Inicial con filtros sugeridos seguros.
- Consultando/loading sin colapsar la estructura.
- Resultados.
- Sin resultados con filtros visibles y editables.
- Resultado parcial o datos desactualizados.
- Error de consulta con reintento.
- Sin permiso para columnas o alcance sensible.
- Exportacion en curso, lista o fallida.

## Required Decisions Per View

Cada adopcion debe definir pregunta que responde, periodo por defecto, filtros obligatorios, columnas, metricas, nivel de detalle, volumen/paginacion, frescura, permisos y formatos de exportacion.

## Allowed Variations

- Tabla sin franja de indicadores cuando el listado responde por si solo.
- Grafico cuando comunica mejor una tendencia o comparacion real.
- Filtros avanzados colapsados.
- Ejecucion manual para consultas costosas.
- Actualizacion automatica para monitoreo operativo.

## Not Allowed

- Dashboard de cards o franja de indicadores obligatoria sin una pregunta operativa clara.
- Filtros con labels superiores, anchos estirados o distribucion distinta del patron compartido de `Documentos`.
- Ocultar filtros principales en un drawer o popover.
- Ejecutar consultas costosas en cada tecla si requieren confirmacion.
- Exportar mas datos de los visibles o permitidos sin explicarlo.
- Perder filtros al consultar un registro.
- Mezclar edicion masiva con un reporte sin declarar otro patron.

## Responsive Contract

En mobile, filtros principales permanecen accesibles y la tabla puede transformarse en filas resumidas. Metricas y columnas secundarias no desplazan la pregunta principal.

## Builder Contract

Componer `SearchFilterBar`, `Tabs`, `Select`, `Checkbox`, `ResultMetrics`, `ResultsTable`, `ResultDetail` y `ExportActions`. Consulta, indicadores, paginacion y exportacion comparten el mismo contrato de filtros. La franja `ResultMetrics` es opcional por adopcion.

## Adoption

| View / flow | Variation | Status | Evidence |
| --- | --- | --- | --- |
| Comprobantes por periodo | Ejemplo inicial de tabla, estados y totales | candidate | Conversacion actual |
| Cuenta corriente de clientes | Consulta manual con criterios visibles, saldo y movimientos agrupados por moneda | draft | `views/cuenta-corriente-clientes.md` |
| Consultas/reportes | Prioridad y alcance pendientes | candidate | `docs/ux/product-context.md` |

## Open Questions

| Question | Affected adopters | Blocking? |
| --- | --- | --- |
| Cuales son las consultas mas importantes y que decisiones habilitan | Consultas/reportes | no para el patron; si para priorizar vistas reales |
