# View: Documentos de Compra y Venta

## Metadata

- View ID: `documentos-comerciales`
- Product area: Compras / Ventas / Fiscalizacion
- Status: draft
- Source material:
  - Screenshots de navegacion y listado provistas el 2026-07-22.
  - Conversacion de redisenio del 2026-07-22.
- Related legacy views: Facturas de Compra, Notas de Credito de Compra, Notas de Debito de Compra, Remitos de Compra, Facturas de Venta, Notas de Credito de Venta, Notas de Debito de Venta y Remitos de Venta.
- Related patterns:
  - `../patterns/documento-transaccional.md`
  - `../patterns/sidebar-navigation.md`
  - `../patterns/list-detail-workspace.md`
  - `./facturacion-rapida-pos.md`
  - `./proveedores.md`

## Product Job

- Primary user: usuario administrativo, de compras, ventas o contabilidad con permisos sobre comprobantes.
- Primary job: encontrar, consultar y generar documentos comerciales sin tener que conocer que formulario legacy corresponde a cada variante.
- Secondary jobs: filtrar por periodo, contraparte, numero, tipo y estado; consultar relaciones entre documentos; imprimir/exportar; anular o corregir segun permisos.
- Frequency: consulta alta; creacion variable segun tipo de documento y rol.
- Pressure: media/alta. El usuario necesita velocidad, pero una eleccion incorrecta puede afectar fiscalizacion, stock, cuenta corriente o contabilidad.
- Success event: el usuario llega al documento correcto en no mas de cuatro interacciones, reutiliza datos del documento de origen cuando existen y completa solamente los campos aplicables.

## Scope

Esta vista define una experiencia reutilizable, no una lista global que mezcle todas las operaciones.

Instancias recomendadas:

- `Compras > Documentos`: facturas, notas de credito, notas de debito y remitos de compra.
- `Ventas > Documentos`: facturas, notas de credito, notas de debito y remitos de venta.

Ambas instancias deben compartir componentes, reglas de interaccion y formulario adaptable. El contexto de entrada resuelve si el documento es de compra o de venta.

Queda fuera de esta vista:

- Ordenes de pago: pertenecen a `Compras > Pagos`.
- Recibos/cobranzas: pertenecen a la lista de recibos de `Ventas > Cobros`.
- Facturacion rapida/POS: conserva su workspace operativo propio; sus comprobantes emitidos aparecen luego en `Ventas > Documentos`.
- Reportes globales y auditoria cruzada de compras/ventas: pertenecen a `Reportes` o a una consulta especifica.

## Current UX Problem

El producto expone cada combinacion de operacion y documento como una vista independiente:

- nota de credito de compra;
- nota de debito de compra;
- nota de credito de venta;
- nota de debito de venta.

Facturas y remitos repiten ademas el mismo esquema de navegacion y listado. Esto produce:

- demasiados destinos equivalentes en el sidebar y en las pestanas superiores;
- cuatro formularios visualmente separados aunque comparten casi todos sus campos;
- necesidad de decidir compra/venta y credito/debito antes de tener contexto;
- filtros de fecha que ocupan demasiado alto aun cuando el usuario no los esta modificando;
- tablas con columnas tecnicas y de auditoria compitiendo con los datos necesarios para reconocer el documento;
- perdida de contexto al crear una nota que nace de una factura existente;
- mantenimiento duplicado del frontend y riesgo de diferencias accidentales entre variantes.

Lo util a preservar:

- tabla densa para consulta administrativa;
- busqueda por contraparte o numero;
- filtro por periodo;
- distincion explicita entre factura, nota de credito, nota de debito y remito;
- trazabilidad de usuario, fecha y hora, pero fuera de la superficie primaria;
- lenguaje fiscal y comercial conocido por los usuarios.

## Target UX Decision

Consolidar las vistas repetidas en un workspace `Documentos` dentro de cada contexto de negocio.

Reglas principales:

- La navegacion define compra o venta. No volver a preguntar ese dato dentro del flujo normal.
- Una sola tabla muestra los documentos del contexto actual.
- `Todos`, `Facturas`, `Notas` y `Remitos` son filtros rapidos de la misma lista implementados con el componente `Tabs`; no son botones, `ToggleGroup`, pantallas ni pestanas globales independientes.
- La columna `Tipo` conserva la distincion entre nota de credito y nota de debito.
- Un unico CTA `Nuevo documento` expone solamente los tipos habilitados para el rol y contexto actuales.
- Factura, nota de credito, nota de debito y remito reutilizan un mismo shell de documento transaccional; cada tipo declara campos, calculos, estados y efectos propios.
- Cuando una nota nace de una factura, el camino principal comienza en esa factura y precarga la informacion disponible.
- Los subtipos o motivos de nota se solicitan dentro del formulario, despues de definir credito/debito o de heredar el tipo desde la accion elegida.
- No construir un superformulario con todos los campos posibles visibles a la vez.

La unificacion es de arquitectura de experiencia y componentes. No implica asumir que todos los documentos tienen las mismas reglas fiscales, contables o de stock.

## Conceptual Model

| Dimension | Values | How it is resolved |
| --- | --- | --- |
| Contexto comercial | Compra / Venta | Por la entrada de navegacion o el documento de origen; no se pregunta de nuevo. |
| Familia | Factura / Nota / Remito | Por `Nuevo documento`, filtro o accion contextual. |
| Efecto de la nota | Credito / Debito | Por la accion elegida antes de abrir el formulario. |
| Subtipo o motivo | Devolucion, bonificacion, diferencia, intereses u otros | Dentro del formulario; solo opciones compatibles con contexto, documento y reglas reales. |
| Documento de origen | Factura u otro documento relacionado | Se hereda si el flujo nace desde el origen; se selecciona dentro del formulario si se inicia desde `Nuevo documento`. |
| Estado | Borrador, emitido, anulado, rechazado u otros | Lo provee el dominio de cada documento; no se inventa desde la UI. |

## Navigation Contract

Recommended entries:

### Compras

1. Sidebar: `Compras`.
2. Item: `Documentos`.
3. Destinos relacionados, pero separados: `Pagos` y `Proveedores`.

### Ventas

1. Sidebar: `Ventas`.
2. Items operativos: `Facturacion rapida / POS` y `Documentos`.
3. Destino relacionado, pero separado: `Cobros`.

Rules:

- `Facturas`, `Notas de Credito`, `Notas de Debito` y `Remitos` no deben competir como cuatro subitems permanentes del sidebar.
- No abrir una pestana superior distinta por cada familia solo para cambiar el filtro del mismo listado.
- Si el usuario abre un documento concreto como contexto de trabajo, la pestana superior puede representar ese documento o su detalle; no debe representar cada filtro de la coleccion.
- La vista conserva el contexto de compra/venta al abrir detalle, crear, cancelar o volver.
- Un acceso desde una factura, proveedor, cliente o reporte debe volver al origen cuando el flujo sea secundario.

## Click Budget

El objetivo de cuatro clics se mide hasta llegar al formulario correcto y listo para completar. No incluye escribir datos obligatorios ni confirmar una emision irreversible.

| Goal | Recommended path | Target |
| --- | --- | --- |
| Abrir documentos desde un grupo cerrado | `Compras/Ventas` > `Documentos` | 2 clics maximo |
| Crear una nota desde el listado | `Nuevo documento` > `Nota de credito/debito` | 2 clics dentro de la vista |
| Crear una nota desde una factura | Abrir factura > `Crear nota` > `Credito/Debito` | 3 clics dentro de la vista; 2 si la accion esta visible en la fila |
| Filtrar por familia | `Facturas`, `Notas` o `Remitos` | 1 clic |
| Cambiar compra por venta | Navegar al otro contexto del sidebar | No agregar un selector dentro del formulario |

Desde cualquier destino visible del sidebar, el formulario correspondiente debe alcanzarse en no mas de cuatro interacciones de puntero.

## Layout Contract

### Header

- Titulo contextual: `Documentos de compra` o `Documentos de venta`.
- CTA principal: `Nuevo documento`.
- No mostrar cuatro botones de creacion simultaneos.
- Si existe estado fiscal o bloqueo que afecte la accion, mostrarlo de forma compacta junto al titulo o CTA.

### Search and filters

Aplicar el contrato transversal de `../patterns/search-filter-bar.md`:

1. Primera fila: busqueda principal full-width por numero, cliente/proveedor o identificacion fiscal.
2. Segunda fila unica: `Todos / Facturas / Notas / Remitos` a la izquierda y el grupo de filtros a la derecha, separados con `space-between`.

Titulo/CTA, busqueda, filtros y tabla viven en un mismo bloque visual, con el mismo fondo y gutter horizontal. No agregar divisor ni padding de seccion entre la barra de filtros y la tabla. Cada filtro usa el ancho de su contenido; ninguno se estira para rellenar la fila.

El grupo de filtros contiene:

- periodo activo resumido, por ejemplo `Periodo: 30 d`;
- tipo exacto;
- estado;
- punto de venta/deposito;
- incluir anulados;
- accion de recarga solo si los datos no se actualizan automaticamente y la necesidad esta validada.

Filtros rapidos de familia:

- `Todos`;
- `Facturas`;
- `Notas`;
- `Remitos`.

Estos controles cambian la consulta de la misma tabla. Deben usar `Tabs`, conservar busqueda, periodo y filtros compatibles, y exponer estado seleccionado y navegacion por teclado propios del componente.

Filtros visibles adicionales:

- desde/hasta;
- tipo exacto: factura, nota de credito, nota de debito, remito;
- estado;
- cliente/proveedor;
- punto de venta;
- usuario;
- anulados;
- otros criterios reales del dominio.

No mostrar dos campos de fecha a ancho completo ocupando el primer viewport cuando el periodo no se esta editando.

Patron de interaccion de filtros:

- No usar `Mas filtros`, popover, drawer, sheet ni modal para ocultar criterios de esta vista.
- Todos los filtros se muestran en la segunda fila visible y compacta, junto con los Tabs.
- No mostrar titulos individuales encima de los controles: el valor visible identifica el criterio y cada control conserva nombre accesible inequivoco.
- Los cambios se aplican al instante y el conteo de resultados se actualiza sin confirmacion adicional.
- `Todos / Facturas / Notas / Remitos` usa `TabsList` y `TabsTrigger`; no recrear tabs con `Button` ni usar `ToggleGroup`.
- En anchos reducidos, la barra puede usar scroll horizontal compacto, pero no ocultar los filtros detras de otra accion ni alterar el orden.

### Primary list

Tabla densa y full-width con columnas base:

- Fecha.
- Numero.
- Cliente o proveedor, segun contexto.
- Tipo.
- Total.
- Estado.
- Documento relacionado, si aporta reconocimiento.
- Acciones.

Columnas opcionales segun tipo o configuracion:

- Punto de venta.
- Moneda.
- Facturado/aplicado.
- Estado fiscal.

Usuario, fecha/hora de auditoria y otros datos tecnicos viven en el detalle, en columnas configurables o en filtros; no deben ocupar espacio primario por defecto.

### Document detail

Click en una fila abre un drawer lateral de consulta con:

- identidad, tipo, numero y estado;
- cliente/proveedor;
- fecha, total y moneda;
- documento de origen y documentos relacionados;
- resumen de items;
- efectos relevantes en stock, cuenta corriente, fiscalizacion o contabilidad;
- acciones permitidas segun tipo, estado y rol;
- auditoria e historial como seccion secundaria.

El drawer permite consultar sin abandonar la lista. Una edicion o emision compleja puede abrir una superficie dedicada usando el patron de documento transaccional.

### Responsive behavior

- Desktop: tabla full-width y detalle en drawer lateral superpuesto.
- Tablet: filtros visibles pueden envolver o usar scroll horizontal compacto; el detalle puede abrirse como sheet.
- Mobile: lista resumida/cards densas; detalle y formulario pasan a pantalla completa con accion principal sticky.
- La prioridad en cualquier ancho es reconocer tipo, contraparte, fecha, total y estado.

## New Document Entry

`Nuevo documento` abre un menu/popover compacto anclado al CTA, no una pantalla intermedia de cards grandes.

Opciones posibles, filtradas por contexto, rol y configuracion:

- `Factura`.
- `Nota de credito`.
- `Nota de debito`.
- `Remito`.

Cada opcion puede tener una descripcion de una linea solo si ayuda a evitar errores. No agregar confirmacion antes de abrir el formulario.

Behavior:

- En `Compras > Documentos`, todos los documentos nuevos son de compra.
- En `Ventas > Documentos`, todos los documentos nuevos son de venta.
- Si el tipo requiere documento de origen, el formulario comienza con el selector/busqueda de origen.
- Si el tipo puede existir sin origen, permitir continuar pero explicar las consecuencias o restricciones reales.
- Una vez cargados datos dependientes del tipo, cambiar de tipo requiere confirmacion si descarta informacion.

## Credit And Debit Note Flow

### Preferred entry: from an invoice

1. El usuario abre o actua sobre una factura.
2. Selecciona `Crear nota`.
3. Elige `Nota de credito` o `Nota de debito`.
4. Se abre el mismo formulario adaptable con contexto y origen precargados.

Data to inherit when valid:

- compra o venta;
- cliente o proveedor;
- factura relacionada;
- moneda;
- condicion fiscal;
- punto de venta;
- items y cantidades/importes disponibles para ajustar;
- impuestos y percepciones aplicables;
- referencias necesarias para trazabilidad.

La UI no debe copiar silenciosamente informacion que pueda haber cambiado o que necesite validacion. Los datos heredados deben verse como contexto confirmado o editable segun la regla real.

### Alternate entry: from `Nuevo documento`

1. El usuario selecciona `Nota de credito` o `Nota de debito`.
2. El formulario abre dentro del contexto actual de compra/venta.
3. Se solicita buscar/seleccionar el documento de origen cuando corresponda.
4. Al elegirlo, se precargan datos y se muestran solamente motivos y campos compatibles.

### Adaptive form structure

1. Header con `Nueva nota de credito/debito de compra/venta` y estado de borrador si aplica.
2. Documento de origen y contraparte.
3. Motivo/subtipo compatible.
4. Items o conceptos a ajustar.
5. Importes, impuestos y total.
6. Observaciones/referencias solo si aplican.
7. Resumen de impacto y validaciones.
8. Accion irreversible con nombre explicito: `Emitir nota de credito` o `Emitir nota de debito`.

Progressive disclosure rules:

- No mostrar el selector compra/venta cuando ya existe contexto.
- No mostrar todos los subtipos antes de elegir credito/debito y origen.
- No mostrar campos exclusivos de otros subtipos.
- No pedir nuevamente cliente/proveedor si proviene del documento de origen, salvo que la regla permita modificarlo.
- Mostrar configuracion fiscal avanzada solo cuando afecta el resultado o existe un error que resolver.
- Conservar diferencias reales de validacion y efectos entre credito y debito aunque compartan componentes.

## Interaction Contract

| Trigger | Result | Surface | Returns to origin? | Notes |
| --- | --- | --- | --- | --- |
| Buscar | Filtra documentos del contexto actual | Header/listado | yes | Numero, contraparte o identificacion fiscal. |
| Cambiar periodo | Actualiza la consulta | Barra de filtros visible | yes | Mostrar el periodo activo resumido. |
| Filtrar familia | Cambia el subconjunto de la misma tabla | Filtro rapido | yes | No abre otra vista/pestana global. |
| Click en fila | Abre detalle del documento | Drawer lateral | yes | La tabla recupera todo el ancho al cerrar. |
| Nuevo documento | Muestra tipos disponibles | Menu/popover | yes | No pregunta compra/venta. |
| Elegir tipo | Abre formulario adaptable | Vista dedicada o drawer ancho | yes | Segun complejidad del documento. |
| Crear nota desde factura | Hereda factura y contexto | Formulario adaptable | yes | Camino recomendado. |
| Elegir documento de origen | Precarga datos compatibles | Formulario activo | yes | Mantener trazabilidad visible. |
| Emitir/confirmar | Valida y ejecuta el efecto real | Formulario/dialog de confirmacion si aplica | yes | No usar un label generico `Guardar`. |
| Cancelar creacion | Vuelve a lista u origen | Formulario activo | yes | Confirmar si hay cambios. |
| Imprimir/exportar | Genera salida sin cambiar estado | Detalle/accion contextual | yes | Mostrar progreso/error. |
| Anular/revertir | Ejecuta flujo formal segun estado | Dialog o flujo dedicado | yes | Requiere impacto, motivo y permiso. |

## Information Architecture

### Always Visible

- Contexto `Compra` o `Venta` en el titulo/breadcrumb.
- Busqueda.
- Periodo activo.
- Filtros rapidos.
- Tabla.
- Tipo, numero, fecha, contraparte, total y estado.
- CTA `Nuevo documento` si el rol tiene permiso.

### Contextual / Secondary

- Punto de venta.
- Documento relacionado.
- Estado fiscal detallado.
- Moneda si normalmente hay una sola.
- Acciones de ciclo de vida.
- Items resumidos.
- Efectos en stock, cuenta corriente y contabilidad.

### Hidden Unless Requested

- Usuario, fecha y hora de creacion/modificacion.
- Auditoria completa.
- Metadata tecnica de integracion.
- Filtros avanzados.
- Configuracion fiscal que no cambia la decision actual.

### Candidate To Remove From Primary Surface

- Cuatro destinos separados para factura/credito/debito/remito cuando comparten el mismo trabajo de consulta.
- Cuatro formularios independientes para las combinaciones compra/venta y credito/debito.
- Campos `Desde` y `Hasta` a ancho completo siempre visibles.
- Selector compra/venta dentro de un flujo que ya nacio en Compras o Ventas.
- Columnas de auditoria visibles por defecto.
- Botones separados para todos los tipos de creacion.

## Actions

| Action | Frequency | Risk | Placement | Confirmation | Permission |
| --- | --- | --- | --- | --- | --- |
| Buscar/filtrar | alta | baja | header | no | todos con acceso |
| Nuevo documento | media/alta | variable | header | no al abrir | segun tipo/rol |
| Crear nota desde factura | alta para correcciones | alta fiscal/contable | detalle o accion contextual de factura | no al abrir; si al emitir | segun permiso |
| Ver detalle | alta | baja | fila | no | todos con acceso |
| Emitir/confirmar | media | alta/irreversible | footer sticky del formulario | segun regla | permiso especifico |
| Imprimir/exportar | media | baja | detalle | no | segun permiso |
| Anular/revertir | baja | critica | menu secundario del detalle | si, con impacto y motivo | permiso especifico |

## States

- Loading: conservar header y filtros; skeleton de tabla.
- Empty without filters: explicar que todavia no hay documentos y ofrecer `Nuevo documento` si tiene permiso.
- Empty with filters: `No hay documentos para los filtros aplicados`; ofrecer limpiar filtros, no crear automaticamente.
- Loaded: tabla con contexto y periodo visibles.
- Detail open: drawer con resumen y acciones permitidas.
- Creating from list: formulario con tipo y contexto definidos; origen pendiente si aplica.
- Creating from origin: formulario con origen y datos compatibles precargados.
- Validation error: error junto al campo/item y resumen de bloqueos.
- Confirming/emitting: bloquear doble envio y conservar datos.
- Success: mostrar tipo, numero, estado y siguientes acciones; actualizar lista y origen.
- Fiscal/integration failure: conservar borrador/datos y ofrecer recuperacion valida.
- Permission denied: ocultar tipos no permitidos o explicar por que una accion esta deshabilitada.
- Unsaved changes: confirmar antes de cerrar o cambiar de documento.
- Annulled/reverted: solo lectura con motivo, autor y relacion de recuperacion.

## Builder Handoff

- Components needed:
  - `CommercialDocumentsWorkspace`
  - `DocumentsHeader`
  - `DocumentFamilyFilters`
  - `DocumentFilterBar`
  - `DocumentsTable`
  - `DocumentDetailDrawer`
  - `NewDocumentMenu`
  - `TransactionalDocumentForm`
  - `SourceDocumentPicker`
  - `NoteReasonFields`
  - `DocumentImpactSummary`
  - `DocumentStateTimeline`
- Configuration inputs:
  - `context: purchase | sale`;
  - tipos y subtipos habilitados;
  - permisos por tipo/accion;
  - columnas disponibles;
  - estados y acciones de ciclo de vida;
  - reglas de documento de origen;
  - efectos fiscales, contables, stock y cuenta corriente.
- Data needed:
  - documentos con tipo, numero, fecha, contraparte, total, moneda, estado y relaciones;
  - catalogos de tipos/subtipos/motivos;
  - documentos elegibles como origen;
  - items e importes ajustables;
  - validaciones y permisos reales.
- Reusable patterns: `documento-transaccional`, `sidebar-navigation` y detalle contextual de `list-detail-workspace`.
- Must preserve:
  - densidad de tabla;
  - busqueda y periodo;
  - lenguaje fiscal/comercial;
  - diferencias reales entre documentos;
  - trazabilidad.
- Must avoid:
  - mezclar compras y ventas en una lista operativa global;
  - duplicar formularios por cada combinacion;
  - mostrar decisiones que el contexto ya resolvio;
  - convertir filtros en nuevas vistas;
  - inventar reglas fiscales para completar el prototipo.

## Prototype Acceptance Scenarios

El sandbox debe permitir validar como minimo:

1. Entrar a `Compras > Documentos`, filtrar `Notas` y volver a `Todos` sin abrir nuevas vistas.
2. Usar `Nuevo documento > Nota de credito` y llegar al formulario ya contextualizado como compra.
3. Abrir una factura de compra y crear una nota con factura/proveedor/items precargados.
4. Entrar a `Ventas > Documentos` y reutilizar la misma estructura con cliente y documentos de venta.
5. Ver y operar todos los filtros sin abrir superficies secundarias; la tabla permanece dentro del primer viewport.
6. Consultar auditoria desde el detalle sin mostrarla como columnas primarias.
7. Ver que pagos/cobros permanecen fuera del selector `Nuevo documento`.
8. Alcanzar cualquier formulario de documento en no mas de cuatro clics desde un destino visible del sidebar.

El prototipo puede usar datos simulados, pero debe marcar como placeholder cualquier estado, subtipo, calculo o efecto todavia no validado con el dominio real.

## Open Questions

| Question | Why it matters | Blocking? |
| --- | --- | --- |
| Toda nota de credito/debito debe estar vinculada a una factura o existen notas independientes | Define si el selector de origen es obligatorio y el camino alternativo permitido. | yes antes de implementar reglas reales |
| Cuales son los subtipos/motivos reales por compra/venta y credito/debito | Define campos condicionales, validaciones y labels. | yes antes de construir formulario final |
| Que campos comparten realmente las cuatro variantes y cuales cambian efectos/calculos | Evita que la reutilizacion de UI oculte diferencias de dominio. | yes |
| Que tipos de factura/remito pueden crearse desde este workspace y cuales solo nacen en POS u otro flujo | Define opciones de `Nuevo documento`. | yes |
| Que acciones y estados existen por documento y rol | Define detalle, menus, confirmaciones y recuperacion. | yes |
| Que relacion existe entre remito y factura en compra y venta | Define origen, links y acciones contextuales. | yes |
| El usuario necesita comparar compras y ventas en una misma consulta | Si existe, se resuelve como reporte, no mezclando los workspaces operativos por defecto. | no |
| Que columnas se usan diariamente y cuales son solo auditoria | Permite cerrar la tabla base y sus columnas configurables. | no |
