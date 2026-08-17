# Pattern: ABM Jerarquico

## Metadata

- Pattern ID: `abm-jerarquico`
- Status: draft
- First reference view: Rubros y subrubros
- Related patterns: `list-detail-workspace`, `formulario-seccionado`

## Purpose

Estandarizar el mantenimiento de una entidad padre que contiene una coleccion de entidades hijas y cuya relacion debe permanecer visible. Ejemplos: rubros/subrubros, familias/modelos o zonas/localidades.

No es un ABM complejo solamente porque tenga muchos campos. Es jerarquico porque una entidad hija no tiene sentido operativo sin su padre.

## Stable Contract

### Collection Workspace

1. Header con titulo, cantidad y CTA `Crear <padre>`.
2. Busqueda y filtros compartidos.
3. Tabla dominante de entidades padre con cantidad de hijos y cantidad de usos.
4. Seleccion abre detalle contextual superpuesto; no muestra un formulario persistente debajo de la tabla.
5. Los hijos no son otro destino principal de navegacion.

### Parent Editor

1. Drawer ancho o vista dedicada con `Datos del <padre>`.
2. Seccion `Hijos` con contador, busqueda cuando el volumen lo requiere y CTA `Agregar <hijo>`.
3. Alta de hijos inline o en dialog corto, sin abandonar el borrador del padre.
4. Padre e hijos nuevos se guardan como una unica intencion del usuario aunque la persistencia tecnica necesite varias operaciones.
5. Barra de finalizacion al pie con cambios pendientes, cancelar y accion especifica.

### Contextual Creation

Cuando otra vista necesita una clasificacion inexistente, el selector abre el mismo editor en modo contextual, conserva el borrador de origen y vuelve con el nuevo padre o hijo seleccionado.

## Data Rules

- Cada hijo pertenece a exactamente un padre.
- La unicidad del hijo se valida dentro de su padre salvo regla explicita distinta.
- El padre y cada hijo exponen cantidad de registros asociados antes de una baja.
- Un registro utilizado no se elimina silenciosamente: se deshabilita o se reasignan sus usos.
- Cambiar el padre de una seleccion dependiente limpia el hijo incompatible y explica el cambio.

## Required States

- Lista cargando, vacia, sin resultados y error.
- Padre seleccionado.
- Alta y edicion con cambios sin guardar.
- Sin hijos.
- Agregando/editando hijo.
- Duplicado de padre o hijo.
- Eliminacion bloqueada por usos.
- Deshabilitado con referencias historicas conservadas.
- Guardado parcial fallido con datos locales preservados.

## Not Allowed

- Tabla arriba y formulario persistente abajo.
- Toolbar global con `Nuevo / Editar / Grabar / Eliminar / Cancelar` cuyo alcance depende de una seleccion implicita.
- Hijos como otro ABM desconectado del padre.
- Exigir guardar manualmente el padre antes de poder cargar hijos nuevos.
- Dejar una region vacia grande cuando el padre no tiene hijos.
- Eliminar padre o hijo utilizado sin impacto, reasignacion o recuperacion.

## Builder Contract

Reutilizar `ListDetailWorkspace`, `DataGrid`, `ContextDrawer`, `HierarchicalEntityForm`, `ChildCollectionEditor`, `FormCompletionBar` y confirmaciones del design system. La adopcion aporta campos, reglas de unicidad, permisos, politica de baja y reglas de asociacion.

## Adoption

| View / flow | Parent | Child | Status | Evidence |
| --- | --- | --- | --- | --- |
| Rubros y subrubros | Rubro | Subrubro | candidate | Capturas de ABM Rubros y conversacion 2026-07-22 |

