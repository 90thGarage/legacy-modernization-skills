# Pattern: ABM Simple

## Metadata

- Pattern ID: `abm-simple`
- Status: draft
- First reference view: Depositos
- Related patterns: `list-detail-workspace`, `abm-compuesto`

## Purpose

Estandarizar el mantenimiento de una entidad con pocos campos, relaciones limitadas y un ciclo de vida directo.

Usar cuando el trabajo principal sea buscar, comparar, crear, consultar, editar y deshabilitar o eliminar registros independientes. Ejemplos: depositos, rubros, unidades de medida y tipos auxiliares.

No usar cuando el registro tenga colecciones hijas, configuraciones por seccion, calculos transaccionales o estados de aprobacion. En esos casos usar `abm-compuesto` o `documento-transaccional`.

## Stable Contract

### Layout

1. Header con titulo, cantidad de registros y CTA `Crear <entidad>`.
2. Busqueda y filtros compactos.
3. Tabla dominante con campos comparables y acciones frecuentes visibles.
4. Drawer contextual al seleccionar una fila.
5. Drawer de alta/edicion con un formulario corto, sin stepper salvo necesidad validada.

### Information Hierarchy

- Siempre visible: identidad, nombre, estado y campos usados para comparar.
- Contextual: datos secundarios, auditoria y relaciones de baja frecuencia.
- Oculto hasta solicitarlo: configuracion tecnica y acciones riesgosas.

### Actions

- Crear es la unica accion primaria global.
- Consultar se activa al seleccionar una fila.
- Editar, duplicar y eliminar/deshabilitar reutilizan las mismas superficies desde fila y detalle.
- Eliminar o deshabilitar debe mostrar impacto, permiso y posibilidad de recuperacion.

### Navigation And Return

Alta, edicion y confirmaciones conservan busqueda, filtros y posicion de la lista. Al guardar se vuelve al registro actualizado.

## Required States

- Loading con estructura de tabla preservada.
- Vacio inicial con CTA de creacion.
- Sin resultados por filtros con accion para limpiarlos.
- Detalle seleccionado.
- Alta y edicion.
- Error de validacion junto al campo y resumen cuando corresponda.
- Guardado en curso, exito y fallo recuperable.
- Permiso denegado sin ocultar el motivo.
- Cambios sin guardar antes de cerrar el drawer.

## Required Decisions Per View

Cada adopcion debe definir campos de comparacion, clave unica, significado de estado, si se elimina o deshabilita, dependencias que bloquean la baja y permisos por accion.

## Allowed Variations

- Filtros adicionales.
- Seleccion multiple y acciones masivas cuando el volumen lo justifique.
- Importacion/exportacion como accion secundaria.
- Formulario en dialog en entidades extremadamente pequenas.

## Not Allowed

- Formulario completo persistente debajo de la tabla.
- Doble click como unica forma de abrir o editar.
- Acciones de fila que llevan a experiencias distintas del detalle.
- Usar un stepper para un formulario corto.
- Borrar sin explicar dependencias o recuperacion.

## Responsive Contract

En mobile, la lista se adapta a filas resumidas o cards densas; detalle y formulario pasan a sheet/pantalla completa. La accion de crear y la busqueda permanecen accesibles.

## Builder Contract

Reutilizar `ListDetailWorkspace`, `DataGrid`, `RowActions`, `ContextDrawer` y `EntityForm`. La vista aporta columnas, campos, validaciones, acciones y permisos; no redefine el comportamiento base.

## Adoption

| View / flow | Variation | Status | Evidence |
| --- | --- | --- | --- |
| Depositos | Incluye tipo, empresa, punto de venta y centro de costo | validated candidate | `views/depositos.md` y sandbox |
| Clientes | Puede superar el limite simple por datos fiscales y comerciales | candidate | `views/clientes.md` |

## Open Questions

| Question | Affected adopters | Blocking? |
| --- | --- | --- |
| Que entidades permiten eliminacion real y cuales solo deshabilitacion | Todos los ABM | no, debe definirse por vista |
