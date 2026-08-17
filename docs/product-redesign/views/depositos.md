# View: Depositos

## Metadata

- View ID: `depositos`
- Product area: Stock / Configuracion operativa
- Status: draft
- Source material:
  - Screenshots provided on 2026-07-10.
- Related legacy views: ABM Depositos.
- Related patterns:
  - `../patterns/list-detail-workspace.md`
  - `../patterns/sidebar-navigation.md`

## Product Job

- Primary user: administrador, encargado o usuario con responsabilidad de stock/configuracion.
- Primary job: crear, consultar y mantener depositos usados por stock, reposicion, logistica y punto de venta.
- Secondary jobs: asociar empresa, punto de venta, domicilio y centro de costo si aplica.
- Frequency: baja/media; alta al configurar el sistema o al administrar sucursales/depositos.
- Pressure: precision y claridad, porque un deposito mal configurado afecta stock, reposicion y operaciones relacionadas.
- Success event: el usuario encuentra, crea o edita un deposito sin depender de formularios persistentes ni doble click oculto.

## Current UX Problem

La vista legacy repite el mismo anti-patron de ABM:

- Lista de depositos arriba.
- Formulario persistente abajo, aunque el usuario no haya pedido editar.
- Acciones globales `Nuevo`, `Editar`, `Grabar`, `Eliminar`, `Cancelar` que dependen del estado activo.
- Configuracion de centro de costo escondida en una interaccion poco visible: `Doble clic para configurar Centro de Costo`.
- Navegacion dentro de ABM Articulos, aunque Deposito pertenece mas a Stock/Configuracion operativa que a Articulos.

Lo util a preservar:

- Tabla compacta.
- Busqueda visible.
- Campos de negocio: codigo, descripcion, tipo, cod. empresa, punto de venta, domicilio.
- Acciones conocidas: nuevo, editar, guardar, eliminar, cancelar.

## Target UX Decision

Usar `list-detail workspace`.

La vista `Depositos` debe tener una tabla dominante. Al hacer click en un deposito, se abre un drawer lateral derecho con el detalle. El formulario no debe quedar siempre visible debajo de la lista.

`Nuevo deposito` abre un drawer ancho de creacion con los mismos campos visibles en la captura. `Editar` abre el mismo drawer en modo edicion.

## Navigation Contract

Recommended entry:

1. Sidebar: `Stock` o `Configuracion`, segun el modelo final del producto.
2. Item: `Depositos`.

Decision recomendada actual:

- Ubicar `Depositos` bajo `Stock` si el usuario lo piensa como lugar fisico/logistico que afecta movimientos y reposicion.
- Ubicarlo bajo `Configuracion` solo si el cliente lo usa como parametro administrativo de baja frecuencia.
- No ubicarlo como subitem de `Catalogo > Articulos`, porque un deposito no es una propiedad exclusiva del articulo.

Fast access rule:

- Desde Articulos, si el usuario necesita asignar stock/deposito, abrir selector contextual de deposito.
- Si falta un deposito, permitir crearlo contextualmente y volver al articulo, pero sin convertir Depositos en subpantalla de Articulos.

## Layout Contract

Header:

- Titulo `Depositos`.
- Busqueda por codigo, descripcion, tipo, empresa o punto de venta.
- Filtros principales: tipo de deposito, empresa, punto de venta si aplica.
- CTA principal: `Nuevo deposito`.

Primary region:

- Tabla densa de depositos.
- Columnas base:
  - Codigo.
  - Descripcion.
  - Tipo.
  - Cod. Empresa.
  - Punto de Venta.
  - Acciones.
- Columna final `Acciones` con tres botones visibles: `Editar`, `Duplicar` y `Eliminar`, segun permisos.
- No usar menu de tres puntos para estas acciones principales en desktop.
- En mobile o viewport angosto puede colapsar a menu.

Context drawer:

- Drawer/sheet lateral derecho del deposito seleccionado, abierto bajo demanda.
- Debe usar el mismo ancho que otros drawers de entidad: 45-50vw en desktop, minimo util de 720px cuando el viewport lo permita.
- No ocupa columna fija dentro del grid principal.
- La tabla debe recuperar todo el ancho disponible cuando el drawer esta cerrado.
- Contenido:
  - Codigo.
  - Descripcion.
  - Tipo de deposito.
  - Cod. empresa.
  - Punto de venta.
  - Domicilio.
  - Centro de costo si aplica.
- Acciones:
  - `Editar`.
  - `Duplicar`.
  - `Configurar centro de costo`.
  - `Eliminar`.

Creation / edit drawer:

- `Nuevo deposito` abre drawer ancho.
- `Editar` abre el mismo drawer en modo edicion.
- Ancho desktop recomendado: 45-50vw.
- Ancho minimo recomendado: 720px cuando el viewport lo permita.
- Ancho maximo recomendado: 960px.
- En mobile/tablet angosto, usar pantalla completa.
- El formulario debe tener mas espacio que cualquier columna secundaria o ayuda.

Fields:

| Field | Purpose | Required? | Notes |
| --- | --- | --- | --- |
| Codigo | Identificador del deposito | unknown | Si puede autogenerarse, mostrar como sugerido/editable. |
| Descripcion | Nombre del deposito | yes | Campo principal. |
| Tipo de Deposito | Clasificacion operativa | unknown | Ejemplos de captura: ORIGEN, DESTINO. |
| Cod. Empresa | Asociacion con empresa/local | unknown | Confirmar si deriva del local activo. |
| Punto de Venta | Relacion con punto de venta | unknown | Confirmar obligatoriedad. |
| Domicilio | Ubicacion fisica | no/unknown | Campo amplio. |
| Centro de costo | Configuracion contable/operativa | no/unknown | Debe ser accion o seccion visible, no doble click oculto. |

## Interaction Contract

| Trigger | Result | Surface | Returns to origin? | Notes |
| --- | --- | --- | --- | --- |
| Buscar | Filtra tabla | Header/listado | yes | Debe aceptar codigo, descripcion y tipo. |
| Filtros | Filtra por tipo/empresa/punto de venta | Header/listado | yes | No deben ocupar demasiado alto. |
| Click en fila | Selecciona deposito y abre detalle | Drawer lateral contextual | yes | No agrega columna fija. |
| Nuevo deposito | Abre formulario de alta | Drawer ancho | yes | Al guardar, vuelve a tabla con deposito seleccionado. |
| Editar desde fila | Abre edicion | Drawer ancho | yes | Boton visible en la fila. |
| Duplicar desde fila | Crea copia editable | Drawer ancho | yes | Debe limpiar codigo si no puede repetirse. |
| Eliminar desde fila | Abre confirmacion | Dialog | yes | Boton visible en la fila, destructive. |
| Configurar centro de costo | Abre configuracion asociada | Drawer section / dialog | yes | No usar doble click oculto. |
| Guardar | Guarda cambios del drawer activo | Drawer footer | yes | Mantener datos si falla. |
| Cancelar | Cierra drawer | Drawer footer | yes | Confirmar si hay cambios sin guardar. |

## Information Architecture

### Always Visible

- Busqueda.
- Filtros principales.
- Tabla.
- Codigo.
- Descripcion.
- Tipo.
- Cod. Empresa si aplica.
- Punto de Venta si aplica.
- Acciones visibles por fila.

### Contextual / Secondary

- Domicilio.
- Centro de costo.
- Auditoria.
- Relaciones con stock/movimientos si aplica.

### Hidden Unless Requested

- Datos tecnicos.
- Historial de cambios.
- Metadata de sistema.

### Candidate To Remove From Primary Surface

- Formulario persistente debajo de la tabla.
- Toolbar global con `Grabar`, `Eliminar`, `Cancelar` cuando no hay formulario activo.
- Doble click como unica forma de configurar centro de costo.
- Depositos como subitem de ABM Articulos.

## Actions

| Action | Frequency | Risk | Placement | Confirmation | Permission |
| --- | --- | --- | --- | --- | --- |
| Buscar | alta | baja | header | no | todos |
| Nuevo deposito | media | media | header | no, validacion en drawer | segun permiso |
| Editar desde fila | media | media | boton visible en columna acciones | no | segun permiso |
| Duplicar desde fila | baja/media | media | boton visible en columna acciones | confirmar si duplica datos sensibles | segun permiso |
| Eliminar desde fila | baja | destructiva | boton visible en columna acciones | si | admin/permiso |
| Guardar | media | media | drawer footer | no | segun permiso |
| Configurar centro de costo | baja/media | media | drawer contextual | no/unknown | segun permiso |

## States

- Loading: tabla skeleton o estado de carga sin desplazar header.
- Empty: explicar que no hay depositos y ofrecer `Nuevo deposito`.
- No selection: tabla a ancho completo; drawer cerrado.
- Selected: drawer lateral contextual abierto con detalle y acciones.
- Creating: drawer ancho con formulario de alta.
- Editing: drawer ancho con formulario editable.
- Validation error: errores junto al campo y resumen si aplica.
- Save success: feedback no intrusivo; mantener seleccion.
- Save failure: conservar datos ingresados.
- Permission denied: ocultar o deshabilitar acciones con motivo.
- Unsaved changes: confirmar antes de cerrar drawer o cambiar registro.

## Builder Handoff

- Components needed:
  - `ListDetailWorkspace`
  - `WorkspaceHeader`
  - `WarehouseTable`
  - `RowActions`
  - `WarehouseDetailDrawer`
  - `WarehouseFormDrawer`
  - `CostCenterConfigDialog` or `CostCenterConfigSection`
- Data needed:
  - depositos con codigo, descripcion, tipo, codEmpresa, puntoVenta, domicilio y centroCosto.
  - permisos por accion.
  - errores de validacion.
  - estados de guardado.
- Reusable pattern: `list-detail-workspace`.
- Must preserve:
  - tabla compacta;
  - busqueda visible;
  - lenguaje `Deposito`;
  - acceso a centro de costo.
- Must avoid:
  - formulario persistente bajo tabla;
  - columna fija persistente de detalle;
  - acciones globales que dependan de seleccion invisible;
  - doble click como unica accion para centro de costo;
  - menu de tres puntos para acciones principales de fila en desktop.

## Open Questions

| Question | Why it matters | Blocking? |
| --- | --- | --- |
| Depositos debe vivir finalmente bajo `Stock` o `Configuracion` | Define navegacion final y expectativas del usuario | yes before final build |
| Codigo de deposito se autogenera o lo carga el usuario | Define el formulario de alta | yes |
| Tipo de deposito tiene valores cerrados | Define select, filtros y validacion | yes |
| Cod. Empresa y Punto de Venta derivan del local activo o son manuales | Evita pedir datos innecesarios | yes |
| Centro de costo es obligatorio, opcional o permission-gated | Define si es paso principal o seccion secundaria | no |
