# View: Presupuestos de Venta

## Metadata

- View ID: `presupuestos`.
- Product area: Ventas / Presupuestos.
- Status: draft.
- Source material:
  - Captura del listado legacy provista el 2026-07-22.
  - Captura del formulario de alta vacío provista el 2026-07-22.
  - Captura del formulario con un artículo cargado provista el 2026-07-22.
  - Confirmación del usuario del 2026-07-22: `Grabar` solamente crea o guarda el presupuesto; no ejecuta otros efectos.
- Related views:
  - `./documentos-comerciales.md`.
  - `./facturacion-rapida-pos.md`.
  - `./clientes.md`.
  - `./catalogo-articulos.md`.
- Related patterns:
  - `../patterns/documento-transaccional.md`.
  - `../patterns/list-detail-workspace.md`.
  - `../patterns/search-filter-bar.md`.
  - `../patterns/sidebar-navigation.md`.

## Product Job

- Primary user: vendedor, administrativo o usuario autorizado a preparar propuestas comerciales.
- Primary job: encontrar presupuestos existentes o crear uno nuevo con cliente, condiciones comerciales, artículos e importes claros.
- Secondary jobs: revisar artículos y totales, editar un presupuesto existente, consultar relaciones posteriores y acceder a auditoría.
- Frequency: media/alta según el rubro.
- Pressure: media. La operación debe ser rápida, pero permite revisar antes de guardar.
- Success event: el usuario encuentra o crea el presupuesto sin navegar campos técnicos innecesarios y puede guardar sin perder la carga realizada.

## Scope

Incluye:

- listado de todos los presupuestos de venta;
- búsqueda por cliente o número;
- período e inclusión de anulados;
- creación y edición en un drawer transaccional ancho sobre el listado;
- datos generales y condiciones comerciales;
- entrega y logística;
- carga de artículos;
- descuentos, impuestos, percepciones y totales recibidos del dominio;
- vencimientos cuando correspondan;
- observaciones;
- relaciones posteriores y auditoría como información secundaria.

Queda fuera de alcance hasta validar reglas reales:

- facturar o convertir automáticamente al guardar;
- reservar o descontar stock;
- afectar cuenta corriente, caja o cobros;
- emitir un comprobante fiscal;
- inventar estados formales del presupuesto;
- calcular en frontend precios, descuentos, impuestos, percepciones o totales;
- definir qué representan `Facturado`, `Derivado`, `Validez`, `CC`, `Turno` o `Tip. IVA` más allá de lo visible en las capturas.

## Confirmed Business Decision

`Grabar` no representa una emisión, confirmación ni operación irreversible.

- En un presupuesto nuevo, la acción moderna se llama `Crear presupuesto`.
- En un presupuesto existente, la acción moderna se llama `Guardar cambios`.
- Guardar solamente persiste el presupuesto.
- No requiere una confirmación adicional por sí misma.
- No factura, no reserva stock y no afecta dinero ni cuenta corriente.
- Si el número definitivo se asigna al crear, el formulario lo comunica antes de guardar y muestra el resultado después.
- Si falla el guardado, cliente, artículos, condiciones y observaciones permanecen cargados.

Las acciones posteriores, como facturar, derivar, duplicar o enviar, deben documentarse como capacidades separadas cuando sus reglas estén confirmadas.

## Current UX Problem

La vista legacy conserva una grilla útil, pero al crear mezcla el contexto del listado con un formulario transaccional largo.

Problemas principales:

- búsqueda, filtros y formulario compiten dentro de la misma superficie activa durante el alta;
- `Grabar` y `Cancelar` aparecen arriba, antes de los datos que el usuario debe completar;
- `Grabar` es un término técnico y no distingue crear de guardar cambios;
- `Agregando` y el borde verde comunican estado interno sin ayudar a completar la tarea;
- campos comerciales, identificadores técnicos, valores derivados y metadatos tienen la misma jerarquía;
- el cliente no domina visualmente el comienzo del formulario;
- la carga de artículos no tiene un buscador principal directamente asociado a la tabla;
- `Agregar artículo` y el botón `+` duplican o vuelven ambigua la entrada;
- la tabla muestra demasiadas columnas simultáneas, incluidas varias representaciones de descuento, precio e IVA;
- `Ítems`, `Percepciones`, `Vencimientos` y `Trazabilidad` compiten como si tuvieran igual frecuencia;
- totales e impuestos están separados de la acción que guarda el resultado;
- la grilla del listado prioriza auditoría y códigos antes que reconocimiento del presupuesto;
- en tablet o anchos menores, la estructura depende de scroll horizontal y pierde jerarquía.

Fortalezas a preservar:

- tabla densa para consultar presupuestos;
- búsqueda por cliente o número;
- filtro por período y anulados;
- cliente, vendedor, lista de precios, condición de venta y moneda;
- grilla editable de artículos;
- detalle de impuestos y percepciones;
- total visible durante la carga;
- datos de entrega/logística;
- auditoría y relaciones, pero fuera de la superficie primaria.

## Target UX Decision

Separar claramente dos trabajos:

1. Buscar y consultar presupuestos.
2. Crear o editar un presupuesto.

El listado usa un workspace full-width. Click en una fila abre un drawer de consulta; crear o editar abre un `Sheet` transaccional ancho sobre el listado, siguiendo el mismo patrón usado por Documentos, Pagos y Cobros. El listado permanece como contexto de origen detrás del overlay y no se crea una pestaña ni un destino de navegación adicional.

El formulario en Sheet sigue una dirección única:

1. Identidad y cliente.
2. Condiciones comerciales necesarias.
3. Artículos.
4. Entrega, observaciones y configuración secundaria.
5. Totales y validaciones.
6. Acción de guardado al pie, visible mediante barra sticky.

No duplicar los filtros del listado dentro del formulario. Permanecen detrás del overlay como contexto, sin competir ni ser interactivos durante la edición.

## Navigation Contract

Entrada principal:

1. Sidebar: `Ventas`.
2. Item: `Presupuestos`.
3. Resultado: listado de presupuestos.

Entradas contextuales posibles:

- Desde `Clientes > detalle > Crear presupuesto`, con cliente precargado.
- Desde otra vista comercial solamente cuando la relación esté documentada.

Destinos relacionados:

- `Ventas > Documentos` para facturas, notas y remitos.
- `Ventas > Clientes` para consultar o mantener la contraparte.
- `Catálogo > Artículos` para el mantenimiento completo del producto.

`Presupuestos` permanece separado de `Documentos`: representa una propuesta comercial editable y guardarla no genera un comprobante fiscal.

## Target Flow

### Consultar un presupuesto

1. El usuario abre `Ventas > Presupuestos`.
2. Busca o filtra la tabla.
3. Selecciona una fila.
4. Un drawer muestra identidad, cliente, importes, artículos resumidos, relaciones y auditoría.
5. `Editar` abre el Sheet transaccional con el presupuesto cargado.

### Crear un presupuesto

1. El usuario usa `Nuevo presupuesto`.
2. Un Sheet transaccional ancho se abre sobre la lista con `Nuevo presupuesto` y cierre explícito.
3. Selecciona cliente y revisa las condiciones sugeridas.
4. Busca y agrega artículos desde la entrada ubicada directamente arriba de la tabla.
5. Ajusta cantidades y los campos editables permitidos.
6. Completa entrega, observaciones u opciones secundarias cuando correspondan.
7. Revisa el total y las validaciones.
8. Usa `Crear presupuesto` en la barra inferior sticky.
9. El sistema muestra el presupuesto guardado y su número definitivo.

### Editar un presupuesto

1. El usuario abre un presupuesto desde la lista o el drawer.
2. El mismo Sheet se completa con sus datos.
3. La acción final cambia a `Guardar cambios`.
4. Guardar no ejecuta ningún efecto adicional.

## Layout Contract

### Estado inicial: listado dominante

Título y CTA:

- `Presupuestos`.
- CTA principal `Nuevo presupuesto` arriba a la derecha.
- Conteo de resultados como información secundaria.

Búsqueda y filtros:

- una única fila compacta: `Buscar por cliente o número` ocupa el espacio flexible y `Período` + `Incluir anulados` conservan ancho de contenido a la derecha;
- filtros iniciales confirmados: `Período` e `Incluir anulados`;
- no inventar tabs de estado sin estados formales confirmados;
- cada filtro usa ancho de contenido;
- búsqueda, filtros y tabla forman un solo bloque visual, sin divisor ni cambios de fondo;
- la vista no se envuelve en una card exterior: la tabla tiene su propio borde, radio de 4 px y fondo, respetando el mismo gutter que el header y los filtros;
- encabezados compactos en mono y mayúsculas, filas operativas de altura consistente y acciones fijadas a la derecha;
- cambios aplicados de inmediato;
- recarga manual solamente si los datos no pueden actualizarse automáticamente.

Tabla primaria recomendada:

- Fecha.
- Número.
- Cliente.
- Validez o estado, cuando su significado esté confirmado.
- Total.
- Relación posterior relevante, cuando exista.
- Acciones.

Datos secundarios disponibles desde el drawer o configuración de columnas:

- Facturado.
- Empresa.
- Punto de venta.
- Número interno.
- Tipo.
- Detalle.
- Usuario.
- Usuario fecha.
- Usuario hora.
- Derivado.

No eliminar estos datos hasta confirmar su uso. Se desplazan porque no todos son necesarios para reconocer y comparar presupuestos en la tabla principal.

### Drawer de consulta

Click en una fila abre un drawer con:

- número y fecha;
- cliente;
- total y moneda;
- validez, facturado y derivado cuando su semántica esté confirmada;
- condiciones comerciales;
- resumen de artículos;
- observaciones;
- relaciones con documentos posteriores;
- auditoría secundaria;
- acción frecuente `Editar`.

El drawer de consulta no contiene la grilla editable completa. `Editar` lo reemplaza por el Sheet transaccional ancho, manteniendo el listado como origen.

### Sheet de creación/edición

#### Header

- cierre explícito con `X` y acción `Cancelar` al pie;
- título `Nuevo presupuesto` o `Presupuesto <número>`;
- cliente resumido cuando ya está seleccionado;
- estado de cambios sin guardar como estado de interfaz, no como estado formal del negocio;
- no mostrar filtros de la lista;
- no ubicar la única acción de guardado en el header.

#### Datos comerciales esenciales

Siempre visibles antes de los artículos:

- Cliente.
- Fecha.
- Validez.
- Vendedor.
- Lista de precios.
- Condición de venta.
- Moneda.

Reglas:

- Cliente es la primera decisión y el campo visualmente dominante.
- Lista de precios, condición de venta, vendedor y moneda pueden sugerirse desde cliente/usuario, pero permanecen visibles y editables cuando la regla lo permita.
- Los valores sugeridos no se ocultan ni se cambian silenciosamente después de cargar artículos.
- Número muestra `Se asignará al crear` mientras el presupuesto no exista.

#### Identificación y datos técnicos

Conservar como resumen compacto o sección secundaria:

- Destino.
- Punto de venta.
- Número.
- Letra.
- CC.
- Número interno.
- Turno.

Reglas:

- si el sistema puede resolver un valor por configuración, mostrarlo como dato heredado y no como decisión repetida;
- no permitir edición de identificadores generados;
- no eliminar ningún campo hasta validar su función operativa;
- `Destino` puede moverse a Entrega y logística si se confirma que describe la entrega y no la identificación del documento.

#### Región principal de artículos

La carga de artículos domina la superficie.

Encima de la tabla:

- búsqueda full-width `Buscar artículo por código o descripción`;
- lectura de código/lector cuando aplique;
- acción secundaria `Abrir catálogo` o `Agregar artículo` solo como alternativa al buscador;
- `Balanza` visible solamente cuando el comercio, artículo o hardware lo requiera;
- eliminar el botón `+` sin etiqueta y cualquier segunda acción que duplique agregar artículo.

Tabla base recomendada:

- Código.
- Descripción.
- Unidad / presentación.
- Cantidad.
- Precio.
- Descuento.
- IVA.
- Precio con IVA.
- Importe.
- Acción eliminar.

Información avanzada por fila, accesible mediante detalle/expansión sin perder contexto:

- Cant. U.
- Descuento manual.
- Descuento promocional.
- Dto. %.
- Precio final.
- Tipo de IVA.
- Lista de precio aplicada.
- Fecha de entrega.

La expansión no recalcula valores. Todos los importes y desgloses provienen del dominio.

#### Estado con artículos cargados

Al agregar un artículo:

- la fila aparece en la misma tabla;
- cantidad y campos permitidos son editables inline;
- descripción, unidad, impuestos y precios derivados se actualizan desde los datos recibidos;
- `Ítems` y `Cantidades` se muestran como resumen compacto;
- el neto y el total se actualizan sin desplazar la tabla;
- eliminar artículo usa una acción inequívoca y conserva el resto del presupuesto;
- si cambia cliente, lista de precios o moneda, cualquier impacto sobre líneas debe mostrarse antes de aplicar el cambio.

#### Entrega y logística

Sección secundaria, visible sin abandonar el formulario:

- Destino, si corresponde a entrega.
- Orden de compra.
- Turno.
- Fecha de entrega general o por artículo, según la regla real.

No duplicar fecha de entrega a nivel general y por línea sin explicar la precedencia.

#### Observaciones

- Campo de texto a ancho completo después de la configuración principal.
- No debe competir con cliente o artículos.

#### Percepciones, vencimientos y trazabilidad

- Percepciones: sección secundaria vinculada al resumen de importes; cualquier importe aplicado sigue visible en totales.
- Vencimientos: sección secundaria cuando las condiciones de venta los requieran.
- Trazabilidad: detalle contextual o sección colapsada; no compite con la carga habitual.
- No usar tabs para ocultar una validación que bloquea guardar.

#### Totales y acción final

Resumen visible:

- Neto.
- Bonificación.
- IVA 10,5.
- IVA 21.
- IVA 27.
- Otras percepciones.
- Total.

Barra inferior sticky, última en el orden visual y del DOM:

- total protagonista;
- errores bloqueantes o acceso al resumen de validaciones;
- acción secundaria `Cancelar` o `Volver`;
- `Crear presupuesto` para alta;
- `Guardar cambios` para edición.

No usar `Grabar` en la interfaz moderna.

## Interaction Contract

| Trigger | Result | Surface | Returns to origin? | Notes |
| --- | --- | --- | --- | --- |
| Buscar | Filtra presupuestos por cliente o número | Listado | yes | Aplicación inmediata. |
| Cambiar período | Actualiza la tabla | Barra de filtros | yes | Conserva búsqueda. |
| Incluir anulados | Incluye/excluye registros | Barra de filtros | yes | Semántica pendiente de estado formal. |
| Click en fila | Abre resumen del presupuesto | Drawer | yes | No reserva una columna fija. |
| Nuevo presupuesto | Abre alta sobre el listado | Sheet transaccional | yes | Conserva el listado como contexto detrás del overlay. |
| Editar | Abre el mismo formulario con datos existentes | Sheet transaccional | yes | CTA `Guardar cambios`. |
| Seleccionar cliente | Aplica datos sugeridos confirmados | Formulario | yes | Mostrar cambios que afecten líneas existentes. |
| Buscar/agregar artículo | Agrega una línea | Tabla de artículos | yes | Una sola entrada principal. |
| Editar línea | Actualiza valores permitidos | Tabla | yes | Cálculos recibidos del dominio. |
| Eliminar línea | Quita la línea seleccionada | Tabla | yes | No afecta las demás líneas. |
| Crear presupuesto | Persiste un presupuesto nuevo | Barra sticky | yes | Sin efectos adicionales. |
| Guardar cambios | Persiste la edición | Barra sticky | yes | Sin efectos adicionales. |
| Cancelar/cerrar | Cierra el Sheet y recupera el listado | Sheet transaccional | yes | Confirmar solo si existen cambios sin guardar. |
| Error de guardado | Conserva toda la carga | Formulario | yes | Permite reintentar. |

## Information Architecture

### Always Visible

- Identidad de la vista o presupuesto.
- Cliente.
- Fecha y validez.
- Vendedor, lista de precios, condición de venta y moneda.
- Entrada de artículos directamente encima de la tabla.
- Artículos cargados.
- Neto/total y validaciones bloqueantes.
- Acción `Crear presupuesto` o `Guardar cambios`.

### Contextual / Secondary

- Entrega y logística.
- Orden de compra.
- Destino y turno.
- Percepciones y vencimientos.
- Desglose avanzado por línea.
- Relaciones con facturas u otros documentos.

### Hidden Unless Requested

- Trazabilidad completa.
- Usuario, fecha y hora de creación/modificación.
- Códigos técnicos y metadatos de integración.
- Campos avanzados de precio, descuento o IVA que no se editan habitualmente.

### Candidate To Remove

- `Grabar` como etiqueta.
- Estado técnico `Agregando` y borde verde del formulario.
- Filtros del listado durante la creación/edición.
- Botón `+` sin etiqueta junto a `Agregar artículo`.
- Segunda entrada duplicada para agregar el mismo tipo de línea.
- Auditoría como columnas principales del listado.

Los campos del documento no se eliminan: se mantienen visibles, secundarios o pendientes según la matriz siguiente.

## Field Traceability

### Listado

| Legacy item | Modern decision | Modern location | Status |
| --- | --- | --- | --- |
| Presupuestos | Mantener | Título de la vista | confirmado |
| Cliente o número | Mantener como búsqueda full-width | Fila de búsqueda | confirmado |
| Desde / Hasta | Mantener como período compacto | Barra de filtros | confirmado |
| Incluir anulados | Mantener | Barra de filtros | confirmado; ciclo pendiente |
| Recargar | Secundario o automático | Barra de filtros | necesita confirmación |
| Nuevo | Renombrar `Nuevo presupuesto` | Header de la vista | confirmado |
| Facturado | Mover al resumen de relación/estado | Tabla o drawer | significado pendiente |
| Emp. | Mover a secundario | Drawer/columna configurable | significado pendiente |
| Fecha | Mantener | Tabla principal | confirmado |
| Pto. Vta. | Mover a secundario | Drawer/columna configurable | campo confirmado; prioridad pendiente |
| Número | Mantener | Tabla principal | confirmado |
| Nro. interno | Mover a secundario | Drawer/columna configurable | campo confirmado; uso pendiente |
| Cliente | Mantener | Tabla principal | confirmado |
| Tipo | Mover a secundario salvo que existan variantes comparables | Drawer/columna configurable | significado pendiente |
| Total | Mantener | Tabla principal | confirmado |
| Detalle | Mover al drawer | Drawer | significado pendiente |
| Usuario | Mover a auditoría | Drawer | confirmado |
| Usuario fecha | Mover a auditoría | Drawer | confirmado |
| Usuario hora | Mover a auditoría | Drawer | confirmado |
| Derivado | Mover a relaciones | Drawer/tabla cuando sea relevante | significado pendiente |

### Cabecera del presupuesto

| Legacy item | Modern decision | Modern location | Status |
| --- | --- | --- | --- |
| Agregando | Reemplazar por estado claro de interfaz | Header | estado técnico legacy |
| Cancelar | Mantener | Barra inferior sticky | confirmado |
| Grabar | Renombrar según modo | Barra inferior sticky | confirmado: solo crear/guardar |
| Datos generales | Reorganizar | Formulario principal | contenido confirmado |
| Entrega y logística | Mantener como secundario | Sección secundaria | contenido confirmado; reglas pendientes |
| Destino | Mantener como secundario | Sección logística/técnica | significado pendiente |
| Pto. Vta. | Mantener secundario/sugerido | Resumen de identificación | significado confirmado; edición pendiente |
| Número | Solo lectura/generado | Header/identificación | generado al crear según captura |
| Letra | Mantener como secundario | Resumen de identificación | significado pendiente en presupuestos |
| CC | Mantener como secundario | Resumen de identificación | significado pendiente |
| Fecha | Mantener visible | Datos comerciales | confirmado |
| Validez | Mantener visible | Datos comerciales | significado/opciones pendientes |
| Cliente | Promover | Primer campo comercial | confirmado |
| Nro. interno | Mantener como secundario | Resumen de identificación | uso pendiente |
| Vendedor | Mantener visible | Datos comerciales | confirmado |
| Lista de precios | Mantener visible | Datos comerciales | confirmado |
| Condición de venta | Mantener visible | Datos comerciales | confirmado |
| Moneda | Mantener visible | Datos comerciales | confirmado |
| Orden de compra | Mover a secundario | Entrega/logística | campo confirmado; obligatoriedad pendiente |
| Turno | Mover a secundario | Entrega/logística o sección técnica | significado pendiente |
| Observaciones | Mantener como secundario | Sección full-width | confirmado |

### Artículos y totales

| Legacy item | Modern decision | Modern location | Status |
| --- | --- | --- | --- |
| Bonificación | Mantener en totales | Resumen de totales | cálculo recibido |
| IVA 10.5 | Mantener en totales | Resumen de totales | cálculo recibido |
| IVA 21 | Mantener en totales | Resumen de totales | cálculo recibido |
| IVA 27 | Mantener en totales | Resumen de totales | cálculo recibido |
| Otras percep. | Mantener en totales | Resumen de totales | cálculo recibido |
| Total | Promover | Totales + barra sticky | confirmado |
| Ítems | Mantener como sección principal | Región de artículos | confirmado |
| Percepciones | Mantener como secundario | Sección secundaria | reglas pendientes |
| Vencimientos | Mantener como secundario | Sección secundaria | reglas pendientes |
| Trazabilidad | Mover a secundario | Sección colapsada/detalle | reglas pendientes |
| Balanza | Condicional | Entrada de artículos | hardware/configuración pendiente |
| Agregar artículo | Mantener como entrada secundaria | Sobre la tabla | confirmado |
| Botón + | Eliminar duplicado | — | candidato a eliminar |
| Cod. Art | Mantener | Tabla de artículos | confirmado |
| Descripción | Mantener | Tabla de artículos | confirmado |
| Unidad | Mantener | Tabla de artículos | confirmado |
| Cant. U. | Mover al detalle de fila salvo uso frecuente | Detalle de fila | significado pendiente |
| Cantidad | Mantener editable | Tabla de artículos | confirmado |
| Precio | Mantener | Tabla de artículos | origen/edición pendientes |
| Dto. Manual | Consolidar en detalle de descuento | Tabla/detalle de fila | reglas pendientes |
| Dto. Prom | Consolidar en detalle de descuento | Detalle de fila | reglas pendientes |
| Dto. % | Consolidar en detalle de descuento | Tabla/detalle de fila | reglas pendientes |
| Prec. Fin. | Mover al detalle derivado | Detalle de fila | cálculo recibido |
| IVA/% | Mantener | Tabla de artículos | cálculo/configuración recibidos |
| Tip. IVA | Mover al detalle de fila | Detalle de fila | significado pendiente |
| Precio c/IVA | Mantener visible | Tabla de artículos | cálculo recibido |
| Lista de precio | Mostrar valor aplicado como secundario | Detalle de fila | recibido de condición comercial |
| Fecha de entrega | Mover a logística/detalle de fila | Secundario | precedencia pendiente |
| Importe | Mantener | Tabla de artículos | cálculo recibido |
| Acc. / eliminar | Mantener explícito | Tabla de artículos | confirmado |
| Ítems / Cantidades | Mantener compacto | Debajo de la tabla | confirmado |
| Neto | Mantener | Resumen de totales | cálculo recibido |

## Actions

| Action | Frequency | Risk | Placement | Confirmation | Permission |
| --- | --- | --- | --- | --- | --- |
| Buscar/filtrar | alta | baja | Header del listado | no | permiso de consulta |
| Nuevo presupuesto | alta | baja | Header de la vista | no | permiso de creación |
| Ver detalle | alta | baja | Fila/drawer | no | permiso de consulta |
| Editar | media/alta | baja | Drawer/acción de fila | no | permiso de edición |
| Agregar artículo | alta durante la carga | baja | Sobre la tabla | no | permiso de edición |
| Eliminar artículo | alta durante la carga | baja | Fila del artículo | no, salvo pérdida sustancial | permiso de edición |
| Crear presupuesto | una vez por alta | persistencia reversible | Barra inferior sticky | no | permiso de creación |
| Guardar cambios | una vez por edición | persistencia reversible | Barra inferior sticky | no | permiso de edición |
| Cancelar con cambios sin guardar | ocasional | riesgo de pérdida de datos | Barra sticky/retorno | sí, solo si hay cambios | usuario editor |

## States

### Listado

- Loading: skeleton de búsqueda, filtros y filas.
- Loaded: presupuestos visibles.
- Empty: `Todavía no hay presupuestos`; ofrecer `Nuevo presupuesto` si tiene permiso.
- Filtered empty: `No hay presupuestos para los filtros aplicados`; permitir limpiar filtros.
- Error: conservar búsqueda y filtros y permitir reintentar.
- Detail open: drawer sobre la tabla, sin reservar columna fija.

### Formulario

- New empty: cliente pendiente, tabla sin artículos y total visible en cero.
- New with items: líneas editables y totales actualizados.
- Editing: número existente y CTA `Guardar cambios`.
- Invalid: errores inline y resumen junto a la barra final.
- Saving: bloquear doble guardado sin ocultar la carga.
- Save success: mostrar número y confirmación no bloqueante; actualizar listado.
- Save failure: conservar todos los datos y permitir reintentar.
- Unsaved changes: confirmar antes de abandonar.
- Permission denied: modo lectura o acciones ocultas/deshabilitadas con explicación.
- Related data unavailable: presupuesto visible aunque una relación posterior no cargue.

No inventar estados de negocio como `Borrador`, `Confirmado`, `Emitido` o `Facturado` hasta contar con su definición formal.

## Responsive Contract

Desktop:

- listado, búsqueda, filtros y primeras filas en el primer viewport;
- Sheet transaccional ancho con artículos como región flexible/scrollable;
- total y acciones en barra inferior sticky;
- secciones secundarias no reducen permanentemente el ancho de la tabla.

Tablet:

- filtros permanecen visibles en una fila con scroll horizontal compacto si es necesario;
- tabla del listado prioriza fecha, número, cliente y total;
- formulario mantiene cliente, entrada de artículos, tabla resumida, total y acción principal;
- detalle avanzado de línea abre sheet o expansión.

Mobile:

- requiere validación operativa;
- listado puede usar filas resumidas;
- alta/edición ocupa pantalla completa;
- artículos se editan mediante filas resumidas y detalle contextual;
- total y acción principal permanecen sticky.

## Data Contract

### BudgetSummary

- id.
- number, nullable antes de crear.
- internalNumber, nullable.
- date.
- customerId.
- customerName.
- validityValue/status, significado pendiente.
- currencyCode.
- total.
- annulled.
- invoicedRelation, nullable y semántica pendiente.
- derivedRelation, nullable y semántica pendiente.
- pointOfSaleId/label, nullable.
- companyId/label, nullable.
- type, nullable.
- createdBy/createdAt, auditoría secundaria.

### Budget

- id, nullable antes de crear.
- number, nullable/generado.
- destination.
- pointOfSale.
- letter.
- cc.
- date.
- validity.
- customerId.
- internalNumber.
- sellerId.
- priceListId.
- saleConditionId.
- currencyCode.
- purchaseOrderReference, nullable.
- shiftId, nullable.
- observations, nullable.
- lines.
- perceptions.
- installments/dueDates.
- logistics.
- totals.
- audit, solo lectura.
- relatedDocuments, solo lectura.

### BudgetLine

- id.
- articleId/code/description.
- unit/presentation.
- unitCount, significado pendiente.
- quantity.
- basePrice.
- manualDiscount.
- promotionalDiscount.
- discountPercent.
- finalPrice.
- vatRate.
- vatType.
- priceWithVat.
- appliedPriceListId/label.
- deliveryDate, nullable.
- amount.

### BudgetTotals

- itemCount.
- quantityTotal.
- net.
- bonus.
- vat10_5.
- vat21.
- vat27.
- otherPerceptions.
- total.

Todos los importes, descuentos, impuestos, percepciones y totales se reciben calculados. El frontend puede presentar y enviar entradas editables, pero no define reglas de cálculo.

## Builder Handoff

- Componentes necesarios:
  - `BudgetsWorkspace`.
  - `BudgetSearchRow`.
  - `BudgetFilterBar`.
  - `BudgetsTable`.
  - `BudgetDetailDrawer`.
  - `BudgetEditor`.
  - `CustomerCommercialTerms`.
  - `ArticleSearch`.
  - `BudgetLinesTable`.
  - `BudgetLineDetail`.
  - `BudgetLogisticsSection`.
  - `BudgetTotals`.
  - `BudgetStickyActions`.
- Reutilizar `search-filter-bar`, `list-detail-workspace` y la variación estructural de `documento-transaccional`.
- Usar primitivas shadcn y los tokens existentes de densidad y radio de InfoManager.
- Los datos simulados deben incluir: listado poblado, listado vacío, vacío por filtros, presupuesto nuevo vacío, presupuesto nuevo con una línea, presupuesto existente editable y error de guardado.
- No integrar backend ni implementar cálculos reales.
- No reutilizar los filtros del listado dentro del editor.
- No colocar la única acción de guardado en el header.
- No usar `Grabar`.
- No agregar estados de ciclo de vida ni efectos no documentados.

## Prototype Acceptance Scenarios

1. `Ventas > Presupuestos` abre una tabla poblada con búsqueda, período, anulados y `Nuevo presupuesto`.
2. La búsqueda cambia la tabla sin abrir otra superficie.
3. Click en una fila abre un drawer con resumen y auditoría secundaria.
4. `Nuevo presupuesto` abre un Sheet transaccional ancho sobre el listado; no crea otra pestaña y no duplica los filtros dentro del formulario.
5. Cliente y condiciones comerciales aparecen antes de la carga de artículos.
6. La búsqueda de artículos está directamente encima de la tabla de líneas.
7. Agregar un artículo produce el estado cargado de la tercera captura, con cantidad editable y totales visibles.
8. Los datos avanzados de línea siguen disponibles sin forzar todas las columnas legacy en la tabla principal.
9. Total, validación y `Crear presupuesto` permanecen visibles en el viewport crítico.
10. La edición usa `Guardar cambios`.
11. Un error de guardado conserva el formulario completo.
12. Guardar no implica facturación, reserva de stock, movimiento de cuenta ni emisión fiscal.

## Open Questions

| Pregunta | Por qué importa | ¿Bloqueante? |
| --- | --- | --- |
| Qué significa `Validez` y cuáles son sus valores reales | Define la etiqueta, el control y el estado mostrado en el listado. | sí, antes de la implementación final |
| Qué representan `Facturado` y `Derivado` y qué acciones exponen | Define el resumen de documentos relacionados y las acciones posteriores. | sí, antes de implementar flujos relacionados |
| Qué significan `Destino`, `CC`, `Turno`, `Tipo` y `Tip. IVA` en presupuestos | Define agrupación, valores sugeridos y posibilidad de edición. | sí, antes del comportamiento final de campos |
| Qué campos de cabecera pueden heredarse de usuario, cliente, punto de venta o configuración | Evita decisiones repetidas sin ocultar control. | sí |
| Si se puede guardar un presupuesto sin artículos | Define validación y habilitación del CTA. | sí |
| Si la fecha de entrega es global, por línea o ambas | Evita valores logísticos contradictorios. | sí |
| Qué campos de descuento son editables y cómo operan los permisos | Define la tabla principal y el detalle avanzado de línea. | sí |
| Si la numeración siempre se asigna al crear | Define identidad antes de guardar y recuperación. | no; la captura actual sugiere que sí |
| Qué función cumplen `Percepciones` y `Vencimientos` antes de guardar | Define secciones secundarias y validación. | sí para el flujo completo |
| Qué acciones existen después de crear: editar, duplicar, imprimir, enviar, derivar o facturar | Define el drawer de detalle sin inventar capacidades. | no para el prototipo básico de crear/guardar |
