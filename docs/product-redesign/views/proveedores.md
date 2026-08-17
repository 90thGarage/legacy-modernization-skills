# View: Proveedores

## Metadata

- View ID: `proveedores`
- Product area: Proveedores / Compras
- Status: draft
- Source material:
  - Screenshots provided on 2026-07-10.
- Related legacy views: ABM Proveedores, Consulta Proveedores.
- Related patterns:
  - `../patterns/list-detail-workspace.md`
  - `../patterns/sidebar-navigation.md`

## Product Job

- Primary user: administrador, encargado, usuario de compras o usuario contable con permisos de proveedores.
- Primary job: buscar, consultar, crear y mantener proveedores usados en compras, pagos, gastos y retenciones.
- Secondary jobs: configurar identidad fiscal, contacto, domicilio, cuentas contables, cuentas de gasto, categorias de retencion e impuestos aplicables.
- Frequency: busqueda/consulta frecuente; alta y edicion media; configuracion fiscal/contable con alto impacto.
- Pressure: precision fiscal y contable, porque un proveedor mal configurado puede generar problemas en compras, pagos, retenciones, rendiciones y registracion contable.
- Success event: el usuario encuentra o crea un proveedor operativo sin perder contexto y sin dejar incompleta la configuracion fiscal/contable critica.

## Current UX Problem

La vista legacy repite el anti-patron de ABM:

- Lista de proveedores arriba.
- Formulario persistente abajo con tabs del proveedor seleccionado.
- Acciones globales `Rapida`, `Nuevo`, `Editar`, `Grabar`, `Eliminar`, `Cancelar` que dependen del estado activo.
- Alta rapida y alta completa compiten como caminos distintos.
- La informacion fiscal, contable y de retenciones queda mezclada entre `Datos Principales` e `Impuestos`.
- Las tabs `Datos Principales` e `Impuestos` obligan a descubrir donde esta cada dato.
- El usuario puede crear un proveedor aparentemente valido sin tener claro si esta listo para compras, pagos o retenciones.

Lo util a preservar:

- Tabla compacta.
- Busqueda visible.
- Columnas clave: codigo, nombre, CUIT, telefono, email.
- Lenguaje del dominio: proveedor, razon social, CUIT, categoria IVA, cuenta contable, cuenta de gasto, retenciones, impuestos.
- Secciones actuales como informacion del proveedor, pero reordenadas por prioridad.

## Target UX Decision

Usar `list-detail workspace`.

La tabla de proveedores debe ser la superficie principal. Al hacer click en un proveedor, se abre un drawer lateral derecho con el detalle y acciones contextuales. El detalle no debe quedar como formulario persistente debajo de la lista.

`Rapida` y `Nuevo` deben unificarse en un solo CTA: `Crear proveedor`.

La creacion debe ser guiada. El primer paso debe ser `Identificacion fiscal`, porque esos datos definen si el proveedor puede operar correctamente en compras y pagos.

Regla fiscal/contable principal:

- Los campos minimos del alta deben cubrir identidad fiscal del proveedor.
- La configuracion de impuestos debe distinguir claramente entre proveedor exento/sin impuestos aplicables y proveedor con impuestos o retenciones configuradas.
- Las retenciones y cuentas contables no deben quedar como informacion accidental si impactan compras, pagos o registracion contable.

## Navigation Contract

Recommended entry:

1. Sidebar: `Proveedores`.
2. Item: `Proveedores` o `Listado de proveedores`.
3. Header CTA: `Crear proveedor`.

Sidebar simplification:

- `ABM` no debe aparecer como agrupador principal.
- `Consulta` puede existir como herramienta o subitem si es una tarea frecuente, pero no debe competir con el alta/mantenimiento principal.
- La seleccion/alta contextual desde una compra debe volver a la compra con el proveedor seleccionado.

Relationship with Compras:

- `Proveedores` puede ser area propia porque el mantenimiento fiscal/contable no es solo una subtarea de una compra.
- Desde `Compras`, si falta un proveedor, abrir alta contextual con retorno a la compra.
- No duplicar pantallas de proveedor entre `Compras` y `Proveedores`.

## Layout Contract

Header:

- Titulo `Proveedores`.
- Busqueda por codigo, nombre/razon social, CUIT, telefono o email.
- Filtros principales: categoria IVA, estado/habilitado, sujeto a rendicion, categoria de retencion si aplica.
- CTA principal: `Crear proveedor`.

Primary region:

- Tabla densa de proveedores.
- Columnas base:
  - Codigo.
  - Nombre / Razon Social.
  - CUIT.
  - Telefono.
  - Email.
  - Estado / Habilitado.
  - Acciones.
- Columna final `Acciones` con botones visibles: `Editar`, `Duplicar` y `Eliminar`, segun permisos.
- No usar menu de tres puntos para estas acciones principales en desktop.
- En mobile o viewport angosto puede colapsar a menu.

Context drawer:

- Drawer/sheet lateral derecho del proveedor seleccionado, abierto bajo demanda.
- Debe usar el mismo ancho que alta/edicion de la entidad: 45-50vw en desktop, minimo util de 720px cuando el viewport lo permita.
- No ocupa columna fija dentro del grid principal.
- La tabla debe recuperar todo el ancho disponible cuando el drawer esta cerrado.
- Contenido:
  - Identidad: nombre/razon social, codigo, proveedor habilitado.
  - Identificacion fiscal: categoria IVA, CUIT, tipo documento, numero documento si aplica.
  - Resumen contable: cuenta contable, cuenta de gasto, cliente vinculado si aplica, tipo persona.
  - Retenciones: categoria retencion ganancia, categoria retencion IIBB, alicuota.
  - Impuestos: exento/sin impuestos, cantidad de impuestos aplicables, alertas de configuracion.
  - Contacto y ubicacion principal.
  - Acciones frecuentes.

Creation / edit drawer:

- `Crear proveedor` abre drawer ancho de alta guiada.
- `Editar` abre el mismo drawer en modo edicion.
- Ancho desktop recomendado: 60-72vw.
- Ancho minimo recomendado: 760px cuando el viewport lo permita.
- Ancho maximo recomendado: 1180px.
- En mobile/tablet angosto, usar pantalla completa.
- Si incluye stepper, usar puntos numerados en una franja horizontal arriba; cada punto explica por tooltip o foco qué datos contiene y el formulario utiliza todo el ancho inferior.
- Distribuir los puntos sobre todo el ancho util de la franja y no mostrar nombre, progreso ni comentarios persistentes debajo.

## Guided Creation Drawer

Entry point:

- Un unico CTA en el header: `Crear proveedor`.
- `Rapida` y `Nuevo` no deben existir como caminos separados compitiendo en la misma toolbar.

Step model:

| Step | Purpose | Fields / content | Required to save? |
| --- | --- | --- | --- |
| 1. Identificacion fiscal | Crear un proveedor operativo y fiscalmente valido | Nombre o razon social, CUIT, categoria IVA, tipo documento si aplica, numero documento si aplica, proveedor habilitado | yes |
| 2. Configuracion contable | Dejarlo listo para compras, gastos y pagos | Cuenta contable, cuenta de gasto, cliente vinculado si aplica, tipo persona, sujeto a rendicion | no/segun negocio |
| 3. Contacto y ubicacion | Completar datos de contacto y domicilio | Contacto, email, telefono, domicilio, domicilio alternativo, CP, pais, localidad, provincia | no |
| 4. Retenciones e impuestos | Configurar reglas fiscales avanzadas | Cat. Ret. Ganancia, Cat. Ret. IIBB, alicuota, impuestos aplicables | no/segun categoria |
| 5. Datos opcionales | Organizar informacion secundaria | Observaciones, datos internos, auditoria si aplica | no |

Step 1 required fields:

| Field | Purpose | Required? | Notes |
| --- | --- | --- | --- |
| Nombre o Razon Social | Identidad visible del proveedor | yes | Campo principal del alta rapida actual. |
| CUIT | Identificador fiscal principal | yes | Campo minimo actual de alta rapida. Validar formato y duplicados. |
| Categoria IVA | Define tratamiento fiscal | yes | Campo minimo actual de alta rapida. |
| Tipo Documento | Define formato alternativo si no corresponde CUIT | unknown | Mostrar si el negocio admite proveedores sin CUIT. |
| Nro. Documento | Identificador alternativo | unknown | Depende de Tipo Documento. |
| Proveedor habilitado | Define si puede operar | yes/default | Debe venir activo por defecto salvo regla contraria. |

Accounting fields:

| Field | Purpose | Required? | Notes |
| --- | --- | --- | --- |
| Cuenta Contable | Registracion contable del proveedor | unknown | Debe poder venir sugerida por categoria/tipo. |
| Cuenta de Gasto | Imputacion habitual de compras/gastos | unknown | Importante para compras y registracion. |
| Cliente vinculado | Relacion si el proveedor tambien es cliente | no/unknown | Mantener como dato secundario. |
| Tipo Persona | Puede afectar validacion fiscal/retenciones | unknown | Confirmar si condiciona impuestos. |
| Cat. Ret. Ganancia | Retencion fiscal | no/segun negocio | Debe destacarse si aplica. |
| Cat. Ret. IIBB | Retencion fiscal | no/segun negocio | Debe destacarse si aplica. |
| Alicuota | Porcentaje asociado | no/segun negocio | Validar rango. |
| Sujeto a Rendicion | Regla operativa/contable | no/unknown | Mostrar en configuracion contable. |

Tax behavior:

- Mostrar un control claro: `Proveedor exento / sin impuestos aplicables` o `Tratamiento de impuestos`.
- Si `Proveedor exento / sin impuestos aplicables = Si`, no pedir impuestos aplicables y mostrar resumen: `No se aplicaran impuestos/percepciones adicionales en compras/pagos`.
- Si `Proveedor exento / sin impuestos aplicables = No`, mostrar seccion `Impuestos aplicables`.
- `Impuestos aplicables` debe permitir agregar filas con: codigo de impuesto, codigo de formula y alicuota.
- Si no hay impuestos registrados, el estado debe ser explicito, no silencioso.
- Categoria IVA, CUIT, estado habilitado y tratamiento de impuestos deben quedar visibles en el resumen del drawer antes de guardar.
- Los errores fiscales o contables deben bloquear `Guardar` cuando puedan generar compras, pagos o registracion incorrecta.

Footer actions:

- `Cancelar`: cierra con confirmacion si hay cambios.
- `Guardar`: habilitado cuando el paso 1 obligatorio esta completo. Guarda el proveedor y vuelve al listado con ese proveedor seleccionado.
- `Guardar y completar detalles`: habilitado cuando el paso 1 obligatorio esta completo. Guarda el proveedor y avanza a configuracion contable o contacto.
- `Anterior` / `Siguiente`: disponibles para recorrer pasos.
- `Guardar cambios`: accion principal en edicion.

No usar dentro del drawer:

- Otro boton llamado `Crear proveedor`; ese label queda reservado para el CTA que abre el flujo.
- Tabs legacy como navegacion principal del alta.
- Formulario completo sin jerarquia.
- Drawer angosto que corte campos fiscales, contables, labels o selects.

## Interaction Contract

| Trigger | Result | Surface | Returns to origin? | Notes |
| --- | --- | --- | --- | --- |
| Buscar | Filtra tabla | Header/listado | yes | Debe aceptar codigo, nombre, razon social, CUIT, telefono o email. |
| Filtros | Filtra por categoria IVA, habilitado, sujeto a rendicion o retenciones | Header/listado | yes | No deben ocupar demasiado alto. |
| Click en fila | Selecciona proveedor y abre detalle | Drawer lateral contextual | yes | No agrega columna fija. |
| Crear proveedor | Inicia alta guiada | Drawer ancho | yes | Unifica `Rapida` y `Nuevo`. |
| Guardar en paso 1 | Crea proveedor con datos fiscales minimos | Drawer ancho | yes | Debe dejarlo listo para completar compra si las reglas minimas alcanzan. |
| Guardar y completar detalles | Crea proveedor y avanza a datos complementarios | Drawer ancho | yes | Evita obligar a completar todo para crear el proveedor. |
| Editar desde fila | Abre edicion | Drawer ancho | yes | Misma edicion que desde el drawer contextual. |
| Duplicar desde fila | Crea copia editable | Drawer ancho | yes | Debe limpiar CUIT si no puede repetirse. |
| Eliminar desde fila | Abre confirmacion | Dialog | yes | Accion destructiva y permission-gated. |
| Agregar impuesto | Agrega fila o abre formulario corto | Drawer section / dialog | yes | Solo visible si proveedor no esta marcado como exento/sin impuestos. |
| Marcar exento/sin impuestos | Oculta impuestos aplicables y muestra resumen | Drawer active step | yes | Confirmar si habia impuestos cargados. |
| Cambiar categorias de retencion | Actualiza retenciones del proveedor | Drawer section | yes | Debe advertir si impacta compras/pagos pendientes. |
| Crear proveedor desde compra | Abre alta minima contextual | Drawer ancho / modal segun compra | yes | Vuelve a compra con el proveedor seleccionado. |

## Information Architecture

### Always Visible

- Busqueda.
- Filtros principales.
- Tabla.
- Codigo.
- Nombre / Razon social.
- CUIT.
- Telefono.
- Email.
- Estado / Proveedor habilitado.
- Acciones visibles por fila.

### Contextual / Secondary

- Contacto principal.
- Domicilio principal y alternativo.
- Cuenta contable.
- Cuenta de gasto.
- Cliente vinculado.
- Tipo persona.
- Categorias de retencion.
- Alicuota.
- Impuestos aplicables detallados.
- Sujeto a rendicion.
- Observaciones.

### Hidden Unless Requested

- Auditoria.
- Historial de cambios.
- Datos tecnicos de integracion.
- Metadata interna.

### Candidate To Remove From Primary Surface

- Formulario persistente debajo de la tabla.
- Tabs inferiores como forma principal de navegar el proveedor.
- `Rapida` y `Nuevo` como flujos separados.
- Toolbar global con `Grabar`, `Eliminar`, `Cancelar` cuando no hay formulario activo.
- Impuestos como tab secundaria desconectada de la configuracion fiscal/contable.
- Menu de tres puntos para `Editar`, `Duplicar` y `Eliminar` cuando esas son acciones principales de fila.

## Actions

| Action | Frequency | Risk | Placement | Confirmation | Permission |
| --- | --- | --- | --- | --- | --- |
| Buscar | alta | baja | header | no | todos |
| Crear proveedor | media | alta fiscal/contable | header | no, validacion en drawer | segun permiso |
| Editar desde fila | media | alta si cambia impuestos/retenciones/cuentas | boton visible en acciones | no | segun permiso |
| Duplicar desde fila | baja/media | alta si duplica CUIT/configuracion fiscal | boton visible en acciones | confirmar/validar identificadores | segun permiso |
| Eliminar desde fila | baja | destructiva | boton visible en acciones | si | admin/permiso |
| Guardar | media | alta fiscal/contable | drawer footer | no | segun permiso |
| Guardar y completar detalles | media | media | drawer footer | no | segun permiso |
| Agregar impuesto | baja/media | alta fiscal | seccion fiscal | no/validacion | segun permiso |
| Marcar exento/sin impuestos | baja/media | alta fiscal | seccion fiscal | confirmar si habia impuestos | segun permiso |
| Cambiar cuenta contable/gasto | media | alta contable | seccion contable | no/validacion | segun permiso |
| Cambiar categorias de retencion | baja/media | alta fiscal | seccion retenciones | no/validacion | segun permiso |

## States

- Loading: tabla skeleton o estado de carga sin desplazar header.
- Empty: explicar que no hay proveedores y ofrecer `Crear proveedor`.
- No selection: tabla a ancho completo; drawer cerrado.
- Selected: drawer lateral contextual abierto con resumen fiscal/contable y acciones.
- Creating: drawer ancho con alta guiada.
- Editing: drawer ancho con formulario editable.
- Fiscal incomplete: guardar deshabilitado y errores junto a campos fiscales.
- Accounting incomplete: advertencia o bloqueo segun regla de negocio.
- Exempt/no taxes selected: se oculta impuestos aplicables y se muestra resumen.
- Non-exempt selected: se muestra seccion `Impuestos aplicables`.
- Validation error: errores junto al campo y resumen si afecta compras/pagos/contabilidad.
- Save success: feedback no intrusivo; mantener proveedor seleccionado.
- Save failure: conservar datos ingresados.
- Permission denied: ocultar o deshabilitar acciones con motivo.
- Unsaved changes: confirmar antes de cerrar drawer o cambiar proveedor.

## Builder Handoff

- Components needed:
  - `ListDetailWorkspace`
  - `WorkspaceHeader`
  - `SupplierTable`
  - `RowActions`
  - `SupplierDetailDrawer`
  - `SupplierFormDrawer`
  - `SupplierCreationStepper`
  - `SupplierFiscalIdentificationStep`
  - `SupplierAccountingSection`
  - `SupplierTaxTreatmentSection`
  - `SupplierContactLocationSection`
  - `SupplierRetentionSection`
- Data needed:
  - proveedores con codigo, nombre/razonSocial, cuit, telefono, email, categoriaIVA, habilitado.
  - catalogos de categoria IVA, tipo documento, tipo persona, cuenta contable, cuenta de gasto, categorias de retencion, impuestos/formulas.
  - permisos por accion.
  - errores de validacion fiscal/contable.
  - estados de guardado.
- Reusable pattern: `list-detail-workspace`.
- Must preserve:
  - tabla compacta;
  - busqueda visible;
  - CUIT y categoria IVA como datos principales;
  - contacto, ubicacion, configuracion contable e impuestos como informacion del proveedor.
- Must avoid:
  - formulario persistente bajo tabla;
  - columna fija persistente de detalle;
  - rapida y nuevo como flujos separados;
  - esconder impuestos/retenciones como informacion avanzada si impactan compras o pagos;
  - drawer angosto que corte campos fiscales o contables;
  - menu de tres puntos para acciones principales de fila en desktop.

## Open Questions

| Question | Why it matters | Blocking? |
| --- | --- | --- |
| Que categorias IVA exactas maneja el producto para proveedores | Define defaults, validaciones y copy fiscal | yes before final build |
| Proveedores sin CUIT son validos en algun caso | Define si Tipo Doc. y Nro. Doc. son alternativos o secundarios | yes |
| Cuenta contable y cuenta de gasto son obligatorias para operar | Define bloqueo de guardado o advertencia | yes |
| Tipo persona afecta retenciones/impuestos | Define ubicacion y validacion del campo | yes |
| Proveedor exento debe ser booleano simple o selector de tratamiento fiscal | Define el componente exacto | yes |
| Impuestos aplicables o categorias de retencion son obligatorias para alguna categoria IVA | Define bloqueo de guardado | yes |
| Crear proveedor desde compra debe usar el mismo drawer o una version compacta | Define integracion con compras | no |
