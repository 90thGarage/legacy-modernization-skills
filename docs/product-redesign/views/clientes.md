# View: Clientes

## Metadata

- View ID: `clientes`
- Product area: Clientes / Facturacion
- Status: draft
- Source material:
  - Screenshots provided on 2026-07-10.
- Related legacy views: ABM Clientes, Consulta Clientes, Cuenta Corriente, Saldos.
- Related patterns:
  - `../patterns/list-detail-workspace.md`
  - `../patterns/sidebar-navigation.md`

## Product Job

- Primary user: administrador, encargado, usuario de facturacion o vendedor con permisos de clientes.
- Primary job: buscar, consultar, crear y mantener clientes que luego se usan en venta/facturacion.
- Secondary jobs: configurar condicion fiscal, contacto, domicilios, acuerdos comerciales, condiciones de venta e impuestos aplicables.
- Frequency: busqueda/seleccion frecuente; alta y edicion media; configuracion fiscal con alto impacto.
- Pressure: precision fiscal y velocidad operativa, porque un cliente mal configurado puede bloquear o emitir mal una factura.
- Success event: el usuario encuentra o crea un cliente facturable sin perder contexto y sin dejar incompleta la configuracion fiscal critica.

## Current UX Problem

La vista legacy repite el anti-patron de ABM:

- Lista de clientes arriba.
- Formulario persistente abajo con tabs del cliente seleccionado.
- Acciones globales `Alta Rapida`, `Nuevo`, `Editar`, `Grabar`, `Eliminar`, `Cancelar` que dependen del estado activo.
- Alta rapida y alta completa compiten como caminos distintos.
- La informacion fiscal queda mezclada entre datos generales e impuestos, aunque define como se factura.
- Las tabs `Datos Generales`, `Contacto`, `Acuerdos`, `Domicilios` e `Impuestos` obligan a descubrir donde esta cada dato.
- El usuario puede crear o editar un cliente sin entender claramente si esta listo para facturar.

Lo util a preservar:

- Tabla compacta.
- Busqueda visible.
- Columnas clave: codigo, razon social, CUIT/documento, categoria IVA, condicion de venta.
- Lenguaje del dominio: cliente, razon social, categoria IVA, CUIT, condicion de venta, domicilio, impuestos.
- Secciones actuales como informacion del cliente, pero reordenadas por prioridad.

## Target UX Decision

Usar `list-detail workspace`.

La tabla de clientes debe ser la superficie principal. Al hacer click en un cliente, se abre un drawer lateral derecho con el detalle y acciones contextuales. El detalle no debe quedar como formulario persistente debajo de la lista.

`Alta Rapida` y `Nuevo` deben unificarse en un solo CTA: `Crear cliente`.

La creacion debe ser guiada. El primer paso debe ser `Identificacion fiscal`, porque esos datos condicionan la facturacion y no son informacion secundaria.

Regla fiscal principal:

- Si el cliente es `Consumidor final`, el flujo debe permitir cargar CUIT/CUIL/documento y dejar esa identificacion visible.
- La configuracion de impuestos debe distinguir claramente entre cliente exento y cliente con impuestos aplicables.
- No se debe esconder la configuracion fiscal en una tab avanzada si afecta la emision de comprobantes.

## Navigation Contract

Recommended entry:

1. Sidebar: `Clientes`.
2. Item: `Clientes` o `Listado de clientes`.
3. Header CTA: `Crear cliente`.

Sidebar simplification:

- `ABM` no debe aparecer como agrupador principal.
- `Consulta` y `Consultas Clasicas` permanecen como herramientas pendientes de clasificacion; no deben competir con el alta/mantenimiento principal.
- La cuenta corriente confirmada se resuelve como `Ventas > Cuenta corriente`, con acceso contextual `Ver cuenta corriente` desde el detalle del cliente. `Saldos` no se duplica como otro destino: es el resumen de esa consulta.
- La seleccion/alta contextual desde una venta debe volver a la venta con el cliente seleccionado.

Fast creation rule:

- Crear un cliente desde la navegacion no debe requerir entrar en un subgrupo tecnico.
- Crear un cliente desde una venta debe abrir el mismo flujo de alta minima, adaptado al contexto, y volver a la venta.

## Layout Contract

Header:

- Titulo `Clientes`.
- Busqueda por codigo, razon social/nombre, CUIT/CUIL/documento, telefono o email si aplica.
- Filtros principales: categoria IVA, condicion de venta, estado, con deuda/saldo si aplica.
- CTA principal: `Crear cliente`.

Primary region:

- Tabla densa de clientes.
- Columnas base:
  - Codigo.
  - Razon social / Nombre.
  - CUIT / CUIL / Documento.
  - Categoria IVA.
  - Condicion de venta.
  - Estado.
  - Acciones.
- Columna final `Acciones` con botones visibles: `Editar`, `Duplicar` y `Eliminar`, segun permisos.
- No usar menu de tres puntos para estas acciones principales en desktop.
- En mobile o viewport angosto puede colapsar a menu.

Context drawer:

- Drawer/sheet lateral derecho del cliente seleccionado, abierto bajo demanda.
- Debe usar el mismo ancho que alta/edicion de la entidad: 45-50vw en desktop, minimo util de 720px cuando el viewport lo permita.
- No ocupa columna fija dentro del grid principal.
- La tabla debe recuperar todo el ancho disponible cuando el drawer esta cerrado.
- Contenido:
  - Identidad: razon social/nombre, codigo, estado.
  - Identificacion fiscal: categoria IVA, CUIT/CUIL/documento, tipo documento.
  - Resumen de facturacion: condicion de venta, lista de precios, cuenta corriente si aplica.
  - Impuestos: exento/no exento, cantidad de impuestos aplicables, alertas de configuracion.
  - Contacto principal.
  - Domicilio principal.
  - Acciones frecuentes.

Creation / edit drawer:

- `Crear cliente` abre drawer ancho de alta guiada.
- `Editar` abre el mismo drawer en modo edicion.
- Ancho desktop recomendado: 60-72vw.
- Ancho minimo recomendado: 760px cuando el viewport lo permita.
- Ancho maximo recomendado: 1180px.
- En mobile/tablet angosto, usar pantalla completa.
- Si incluye stepper, usar puntos numerados en una franja horizontal arriba; cada punto explica por tooltip o foco qué datos contiene y el formulario utiliza todo el ancho inferior.
- Distribuir los puntos sobre todo el ancho util de la franja y no mostrar nombre, progreso ni comentarios persistentes debajo.

## Guided Creation Drawer

Entry point:

- Un unico CTA en el header: `Crear cliente`.
- `Alta Rapida` y `Nuevo` no deben existir como caminos separados compitiendo en la misma toolbar.

Step model:

| Step | Purpose | Fields / content | Required to save? |
| --- | --- | --- | --- |
| 1. Identificacion fiscal | Crear un cliente facturable y fiscalmente valido | Nombre o razon social, categoria IVA, tipo documento, CUIT/CUIL/documento, condicion fiscal de impuestos, condicion de venta default | yes |
| 2. Condiciones comerciales | Definir como opera comercialmente | Lista de precios, cuenta contable, vendedor habitual, condicion de venta, controlar margenes, acuerdos si aplica | no/segun negocio |
| 3. Contacto y domicilios | Completar datos de comunicacion y entrega | Email, telefonos, contacto principal, domicilio legal, domicilios de entrega | no, salvo regla de facturacion |
| 4. Clasificacion y datos opcionales | Organizar datos secundarios | Rubro, zona, transporte, grupo, cantidad sucursales, lote, ajuste por %, observaciones, fechas y estado avanzado | no |

Step 1 required fields:

| Field | Purpose | Required? | Notes |
| --- | --- | --- | --- |
| Nombre o Razon Social | Identidad visible del cliente | yes | Para consumidor final puede ser nombre simple o valor sugerido si el negocio lo permite. |
| Categoria IVA | Define tratamiento fiscal | yes | Ejemplos legacy: Consumidor final, Responsable inscripto. |
| Tipo Documento | Define formato y validacion del identificador | yes | Debe cambiar validaciones del campo documento. |
| CUIT / CUIL / Documento | Identificador fiscal/documental | yes when applicable | Si es Consumidor final con CUIT/CUIL, se carga y se conserva visible. |
| Condicion de impuestos | Define si aplica percepciones/impuestos adicionales | yes | Debe ser explicita: exento o no exento. |
| Condicion de venta | Default comercial para facturacion | yes/default | Puede venir sugerida como `Efectivo` o `Cta Cte` segun negocio. |

Tax behavior:

- Mostrar un control claro: `Cliente exento de impuestos` o `Tratamiento de impuestos`.
- Si `Cliente exento de impuestos = Si`, no pedir impuestos aplicables y mostrar resumen: `No se aplicaran impuestos/percepciones adicionales al facturar`.
- Si `Cliente exento de impuestos = No`, mostrar seccion `Impuestos aplicables`.
- `Impuestos aplicables` debe permitir agregar filas con: impuesto/formula, percepcion porcentaje, fecha, categoria, inscripto, activo.
- Si no hay impuestos aplicables, el estado debe ser explicito, no silencioso.
- La categoria IVA y la condicion de impuestos deben quedar visibles en el resumen del drawer antes de guardar.
- Los errores fiscales deben bloquear `Guardar` cuando puedan generar facturacion incorrecta.

Consumer final rule:

- `Consumidor final` no significa ocultar siempre la identificacion.
- Si el usuario carga CUIT/CUIL/documento para un consumidor final, el sistema debe conservarlo, mostrarlo en el resumen y usarlo para facturacion cuando corresponda.
- El formulario debe adaptar labels y validaciones, pero no borrar ni esconder el dato cargado.

Footer actions:

- `Cancelar`: cierra con confirmacion si hay cambios.
- `Guardar`: habilitado cuando el paso 1 obligatorio esta completo. Guarda el cliente y vuelve al listado con ese cliente seleccionado.
- `Guardar y completar detalles`: habilitado cuando el paso 1 obligatorio esta completo. Guarda el cliente y avanza a condiciones comerciales o contacto.
- `Anterior` / `Siguiente`: disponibles para recorrer pasos.
- `Guardar cambios`: accion principal en edicion.

No usar dentro del drawer:

- Otro boton llamado `Crear cliente`; ese label queda reservado para el CTA que abre el flujo.
- Tabs legacy como navegacion principal del alta.
- Formulario completo sin jerarquia.
- Drawer angosto que corte campos fiscales, labels o selects.

## Interaction Contract

| Trigger | Result | Surface | Returns to origin? | Notes |
| --- | --- | --- | --- | --- |
| Buscar | Filtra tabla | Header/listado | yes | Debe aceptar codigo, razon social, CUIT/CUIL/documento. |
| Filtros | Filtra por categoria IVA, condicion de venta, estado o saldo | Header/listado | yes | No deben ocupar demasiado alto. |
| Click en fila | Selecciona cliente y abre detalle | Drawer lateral contextual | yes | No agrega columna fija. |
| Crear cliente | Inicia alta guiada | Drawer ancho | yes | Unifica `Alta Rapida` y `Nuevo`. |
| Guardar en paso 1 | Crea cliente con datos fiscales minimos | Drawer ancho | yes | Debe dejarlo listo para facturar segun reglas. |
| Guardar y completar detalles | Crea cliente y avanza a datos complementarios | Drawer ancho | yes | Evita obligar a completar todo para crear el cliente. |
| Editar desde fila | Abre edicion | Drawer ancho | yes | Misma edicion que desde el drawer contextual. |
| Duplicar desde fila | Crea copia editable | Drawer ancho | yes | Debe limpiar CUIT/CUIL/documento si no puede repetirse. |
| Eliminar desde fila | Abre confirmacion | Dialog | yes | Accion destructiva y permission-gated. |
| Agregar impuesto | Agrega fila o abre formulario corto | Drawer section / dialog | yes | Solo visible si cliente no es exento. |
| Marcar exento | Oculta impuestos aplicables y muestra resumen | Drawer active step | yes | Confirmar si habia impuestos cargados. |
| Agregar contacto | Agrega contacto al cliente | Drawer section / dialog | yes | Debe indicar si queda como predefinido. |
| Agregar domicilio | Agrega domicilio de entrega | Drawer section / dialog | yes | Debe indicar si queda por defecto. |
| Crear cliente desde venta | Abre alta minima contextual | Drawer ancho / modal segun POS | yes | Vuelve a venta con el cliente seleccionado. |

## Information Architecture

### Always Visible

- Busqueda.
- Filtros principales.
- Tabla.
- Codigo.
- Razon social / Nombre.
- CUIT/CUIL/documento.
- Categoria IVA.
- Condicion de venta.
- Estado.
- Acciones visibles por fila.

### Contextual / Secondary

- Contacto principal.
- Domicilio principal.
- Lista de precios.
- Cuenta contable.
- Vendedor habitual.
- Acuerdos.
- Impuestos aplicables detallados.
- Domicilios de entrega.
- Clasificaciones: rubro, zona, transporte, grupo.
- Observaciones.

### Hidden Unless Requested

- Auditoria.
- Fechas avanzadas.
- Lote.
- Ajuste por porcentaje.
- Datos tecnicos de integracion.
- Historico de cambios.

### Candidate To Remove From Primary Surface

- Formulario persistente debajo de la tabla.
- Tabs inferiores como forma principal de navegar el cliente.
- `Alta Rapida` y `Nuevo` como flujos separados.
- Toolbar global con `Grabar`, `Eliminar`, `Cancelar` cuando no hay formulario activo.
- Impuestos como tab secundaria desconectada del alta minima.
- Menu de tres puntos para `Editar`, `Duplicar` y `Eliminar` cuando esas son acciones principales de fila.

## Actions

| Action | Frequency | Risk | Placement | Confirmation | Permission |
| --- | --- | --- | --- | --- | --- |
| Buscar | alta | baja | header | no | todos |
| Crear cliente | media/alta | alta fiscal | header | no, validacion en drawer | segun permiso |
| Editar desde fila | media | alta fiscal si cambia impuestos | boton visible en acciones | no | segun permiso |
| Duplicar desde fila | baja/media | alta si duplica identificadores | boton visible en acciones | confirmar/validar identificadores | segun permiso |
| Eliminar desde fila | baja | destructiva | boton visible en acciones | si | admin/permiso |
| Guardar | media | alta fiscal | drawer footer | no | segun permiso |
| Guardar y completar detalles | media | media | drawer footer | no | segun permiso |
| Agregar impuesto | baja/media | alta fiscal | seccion fiscal | no/validacion | segun permiso |
| Marcar exento | baja/media | alta fiscal | seccion fiscal | confirmar si habia impuestos | segun permiso |
| Agregar contacto | media | baja | seccion contacto | no | segun permiso |
| Agregar domicilio | media | media | seccion domicilios | no | segun permiso |

## States

- Loading: tabla skeleton o estado de carga sin desplazar header.
- Empty: explicar que no hay clientes y ofrecer `Crear cliente`.
- No selection: tabla a ancho completo; drawer cerrado.
- Selected: drawer lateral contextual abierto con resumen fiscal/comercial y acciones.
- Creating: drawer ancho con alta guiada.
- Editing: drawer ancho con formulario editable.
- Fiscal incomplete: guardar deshabilitado y errores junto a campos fiscales.
- Exempt selected: se oculta impuestos aplicables y se muestra resumen de exencion.
- Non-exempt selected: se muestra seccion `Impuestos aplicables`.
- Validation error: errores junto al campo y resumen si afecta facturacion.
- Save success: feedback no intrusivo; mantener cliente seleccionado.
- Save failure: conservar datos ingresados.
- Permission denied: ocultar o deshabilitar acciones con motivo.
- Unsaved changes: confirmar antes de cerrar drawer o cambiar cliente.

## Builder Handoff

- Components needed:
  - `ListDetailWorkspace`
  - `WorkspaceHeader`
  - `CustomerTable`
  - `RowActions`
  - `CustomerDetailDrawer`
  - `CustomerFormDrawer`
  - `CustomerCreationStepper`
  - `FiscalIdentificationStep`
  - `TaxTreatmentSection`
  - `CustomerContactSection`
  - `CustomerAddressesSection`
  - `CustomerCommercialTermsSection`
- Data needed:
  - clientes con codigo, razonSocial/nombre, categoriaIVA, tipoDocumento, cuitCuilDocumento, condicionVenta, estado.
  - catalogos de categoria IVA, tipo documento, condicion de venta, listas de precio, impuestos/formulas.
  - permisos por accion.
  - errores de validacion fiscal.
  - estados de guardado.
- Reusable pattern: `list-detail-workspace`.
- Must preserve:
  - tabla compacta;
  - busqueda visible;
  - categoria IVA y CUIT/CUIL/documento como datos principales;
  - contacto, domicilios, acuerdos e impuestos como informacion del cliente.
- Must avoid:
  - formulario persistente bajo tabla;
  - columna fija persistente de detalle;
  - alta rapida y nuevo como flujos separados;
  - esconder impuestos como informacion avanzada si bloquea facturacion;
  - drawer angosto que corte campos fiscales;
  - menu de tres puntos para acciones principales de fila en desktop.

## Open Questions

| Question | Why it matters | Blocking? |
| --- | --- | --- |
| Que categorias IVA exactas maneja el producto | Define defaults, validaciones y copy fiscal | yes before final build |
| Que tipo de documento se exige para cada categoria IVA | Define validacion del paso 1 | yes |
| La condicion de venta default depende del local, categoria o cliente | Evita pedir datos innecesarios | no |
| Cliente exento debe ser booleano simple o selector de tratamiento fiscal | Define el componente exacto | yes |
| Impuestos aplicables son obligatorios para alguna categoria | Define bloqueo de guardado | yes |
| Crear cliente desde venta debe usar el mismo drawer o una version compacta | Define integracion con POS | no |
