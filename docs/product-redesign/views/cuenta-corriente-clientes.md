# View: Cuenta Corriente de Clientes

## Metadata

- View ID: `cuenta-corriente-clientes`.
- Product area: Ventas / Clientes / Cuenta corriente.
- Status: draft con reglas contables pendientes de validacion.
- Source material:
  - Capturas de la consulta legacy provistas el 2026-07-22.
  - Correccion UX provista el 2026-07-22: listado inicial de clientes con cuenta corriente y drawer para preparar el reporte.
- Related views:
  - `./clientes.md`.
  - `./documentos-comerciales.md`.
  - `./pagos-y-cobros.md`.
- Related patterns:
  - `../patterns/consulta-reporte.md`.
  - `../patterns/list-detail-workspace.md`.
  - `../patterns/sidebar-navigation.md`.

## Product Job

- Primary user: administrativo, encargado, dueno o usuario autorizado a consultar saldos de clientes.
- Primary job: encontrar una cuenta corriente, definir el alcance del reporte y revisar el saldo con sus movimientos.
- Secondary jobs: filtrar movimientos por concepto, imprimir o exportar el reporte.
- Success event: el usuario parte de una lista reconocible de cuentas, genera un reporte en dos acciones y puede explicar el saldo desde sus movimientos.

## Scope

La vista es de solo lectura. No crea recibos, no registra cobros, no imputa documentos y no modifica el estado de cuenta.

Incluye:

- listado de clientes que tienen cuenta corriente;
- busqueda directa por codigo, nombre o identificacion fiscal;
- seleccion de una cuenta desde la tabla;
- drawer para configurar el reporte;
- opcion de consolidacion;
- periodo desde/hasta;
- moneda;
- opcion para incluir remitos;
- generacion manual del reporte;
- tabla de movimientos agrupada por moneda;
- filtro local por concepto;
- totales por moneda y saldo total pesificado;
- impresion y exportacion del reporte generado.

Queda fuera de alcance:

- registrar un cobro o crear un recibo;
- aplicar pagos a comprobantes;
- editar, anular o corregir movimientos;
- definir intereses, vencimientos, mora o limites de credito;
- inventar reglas de conversion, signos o pesificacion.

## Navigation Contract

Entrada principal:

1. Sidebar: `Ventas`.
2. Item: `Cuenta corriente`.
3. Resultado inicial: tabla de clientes que poseen cuenta corriente.

Entrada contextual:

- Desde `Clientes > detalle > Ver cuenta corriente`.
- Abre la misma vista con el drawer de reporte ya enfocado en ese cliente.

Destinos relacionados:

- `Ventas > Cobros` para consultar o crear recibos.
- `Ventas > Documentos` para abrir un comprobante relacionado.

No crear destinos separados para `Cta. Cte.` y `Saldos`.

## Target Flow

### Desde el sidebar

1. El usuario abre `Ventas > Cuenta corriente`.
2. Recorre o busca un cliente en la tabla.
3. Hace click en la fila.
4. Se abre `Generar reporte de cuenta corriente` en un drawer.
5. Revisa o ajusta los criterios y usa `Generar reporte`.
6. El drawer se cierra y el reporte ocupa la superficie principal.
7. `Volver a cuentas corrientes` recupera la lista y su busqueda.

### Desde un cliente

1. El usuario abre el detalle de un cliente.
2. Usa `Ver cuenta corriente`.
3. La vista abre directamente el drawer con el cliente precargado.
4. Genera el reporte sin volver a buscarlo.

El camino principal desde el sidebar requiere tres acciones: `Cuenta corriente > cliente > Generar reporte`.

## Layout Contract

### Estado inicial: listado dominante

El estado inicial nunca es un formulario vacio. Debe mostrar una tabla clara de las cuentas corrientes disponibles.

Encabezado:

- titulo `Cuenta corriente de clientes`;
- descripcion breve `Selecciona un cliente para generar su estado de cuenta`;
- cantidad de clientes con cuenta corriente;
- etiqueta `Datos simulados` solo en el prototipo.

Busqueda:

- full-width directamente arriba de la tabla;
- placeholder `Buscar por codigo, cliente o CUIT`;
- tolerante a mayusculas, minusculas y acentos;
- modifica la tabla inmediatamente.

Tabla:

- Codigo.
- Cliente.
- CUIT / CUIL / Documento.
- Ultimo movimiento.
- Movimientos.
- Saldo pesificado.
- Estado del cliente.
- Accion visible `Generar reporte`.

Reglas:

- Toda la fila es seleccionable y tiene estado hover/focus.
- La accion visible refuerza el resultado del click; no abre un menu adicional.
- El saldo usa tratamiento neutro hasta validar la convencion contable.
- `Ultimo movimiento`, cantidad y saldo llegan del backend o de datos simulados; no se derivan como regla contable en el frontend.
- Clientes deshabilitados permanecen visibles si poseen cuenta corriente, con estado explicito.
- No agregar cards de resumen, graficos, tabs ni filtros secundarios sin evidencia operativa.

### Drawer: preparar reporte

Titulo: `Generar reporte de cuenta corriente`.

El drawer contiene:

- resumen fijo del cliente: nombre, codigo e identificacion fiscal;
- `Consolidado`;
- `Desde`;
- `Hasta`;
- `Moneda`;
- `Remitos`;
- CTA principal `Generar reporte`;
- accion secundaria `Cancelar`.

Reglas:

- El cliente no se vuelve a elegir dentro del drawer.
- Todos los criterios permanecen visibles dentro del drawer; no usar `Mas filtros`, acordeones ni pasos.
- Los campos usan labels persistentes porque el drawer es un formulario de configuracion.
- `Desde` y `Hasta` usan el Date Picker de shadcn compuesto por `Popover`, `Calendar` y `Button`, con fecha visible en formato `dd/MM/yyyy`; no usar el selector nativo del navegador ni `input type="date"`.
- `Consolidado` y `Remitos` muestran solamente su etiqueta y checkbox, sin texto auxiliar.
- No mostrar un selector `Empresa`: no forma parte de la consulta original confirmada.
- No agregar subtitulos, disclaimers ni explicaciones de reglas pendientes dentro del drawer.
- `Generar reporte` queda deshabilitado con periodo invalido o datos obligatorios incompletos.
- El drawer no muestra la tabla de movimientos: no tiene ancho suficiente para el reporte contable.
- Cerrar el drawer no altera la lista ni su busqueda.

### Reporte generado

El reporte reemplaza temporalmente la lista dentro de la misma vista y usa todo el ancho disponible.

Encabezado del reporte:

- `Volver a cuentas corrientes`;
- cliente consultado e identificacion fiscal;
- periodo y cantidad de movimientos;
- `Saldo total pesificado` como valor numerico protagonista;
- `Cambiar criterios`;
- `Imprimir` y `Exportar` como acciones secundarias.

Debajo:

- busqueda full-width `Filtrar movimientos por concepto`;
- conteo filtrado;
- tabla agrupada por moneda;
- resumen final del saldo pesificado.

`Cambiar criterios` reabre el drawer con el cliente y los valores del reporte actual.

### Movement Table

Columnas:

- Pago.
- Empresa.
- Fecha.
- Concepto.
- Numero.
- Dias.
- Debe.
- Haber.
- Saldo acumulado.

Reglas:

- Importes y numeros alineados a la derecha y con tipografia monoespaciada.
- Cada moneda termina con `Total <moneda>`.
- `Saldo anterior` permanece como primer movimiento cuando forma parte de los datos recibidos.
- Un numero relacionado puede abrir su detalle conservando el reporte.
- No agregar acciones de cobro, edicion, anulacion o imputacion.

## Interaction Contract

| Trigger | Result | Surface |
| --- | --- | --- |
| Buscar cliente | Filtra cuentas visibles | Tabla principal |
| Click en fila | Abre criterios del cliente | Drawer |
| Cancelar/cerrar | Conserva listado y busqueda | Tabla principal |
| Generar reporte | Cierra drawer y obtiene el estado de cuenta | Superficie principal |
| Cambiar criterios | Reabre configuracion precargada | Drawer |
| Filtrar concepto | Reduce movimientos visibles sin nueva consulta | Tabla del reporte |
| Volver a cuentas corrientes | Recupera lista y busqueda | Tabla principal |
| Click en numero | Abre detalle relacionado | Drawer o vista relacionada |
| Imprimir / Exportar | Usa el reporte generado | Sistema / archivo |

## States

### Listado

- Loading: skeleton de busqueda y filas.
- Loaded: cuentas corrientes visibles.
- Search empty: `No hay cuentas que coincidan con la busqueda`.
- Empty: `No hay clientes con cuenta corriente configurada`.
- Error: conservar busqueda y permitir reintentar.

### Drawer

- Ready: cliente y criterios visibles.
- Invalid period: validacion inline y CTA deshabilitado.
- Generating: CTA `Generando...` sin duplicar accion.
- Closed: lista intacta.

### Reporte

- Loading: conservar encabezado y espacio de tabla con skeleton.
- Loaded with movements: saldo, grupos y totales visibles.
- Loaded without movements: mensaje claro y `Cambiar criterios` disponible.
- Filtered empty: permitir limpiar el filtro local.
- Error/stale: conservar ultimo reporte valido cuando exista.

## Responsive Contract

Desktop:

- Busqueda, inicio de tabla y primeras cuentas visibles en el primer viewport.
- Drawer de ancho compacto, sin convertirlo en una segunda pagina.
- Reporte usa todo el ancho y scroll interno de tabla solo si es necesario.

Tablet:

- Tabla principal puede ocultar visualmente `Ultimo movimiento` antes de ocultar identidad, saldo o accion.
- Drawer ocupa un ancho util sin cubrir la totalidad cuando el viewport lo permite.
- Tabla del reporte desplaza horizontalmente dentro de su bloque, nunca la pagina.

Mobile:

- Requiere validacion operativa.
- Si se representa, las cuentas pueden pasar a filas resumidas; la configuracion usa drawer de ancho completo.
- El reporte conserva cliente, saldo y acciones antes del historial resumido.

## Data Contract

### CustomerAccountSummary

- customerId.
- customerCode.
- customerName.
- customerTaxId.
- customerStatus.
- lastMovementDate, nullable.
- movementCount.
- pesifiedBalance.
- presentationCurrency.

### AccountStatementQuery

- customerId.
- consolidated.
- fromDate.
- toDate.
- currencyFilter.
- includeDeliveryNotes.

### AccountStatement

- customerId.
- movementCount.
- currencyGroups.
- pesifiedBalance.
- presentationCurrency.
- queriedAt.

### CurrencyGroup

- currencyCode.
- currencyLabel.
- movements.
- debitTotal.
- creditTotal.
- runningBalanceTotal.

### AccountMovement

- id.
- paymentIndicator or paymentReference.
- companyId/companyLabel.
- date.
- concept.
- number.
- days.
- debit.
- credit.
- runningBalance.
- currencyCode.
- sourceType/sourceId when available.

No calcular en el frontend Debe, Haber, Saldo acumulado, dias, saldo pesificado ni conversiones.

## Field Traceability

| Legacy item | Modern decision | Modern location | Status |
| --- | --- | --- | --- |
| Cliente + Clientes... | Replaced by account-customer list | Main table | user-corrected |
| Consolidado | Keep | Report drawer | meaning pending |
| Empresa | Do not include | — | removed by user correction; not present in original UI |
| Desde / Hasta | Keep with shadcn Date Picker | Report drawer | confirmed; native date input excluded |
| Moneda | Keep | Report drawer | conversion pending |
| Incl. Remitos | Keep as `Remitos` | Report drawer | effect pending |
| Ejecutar | Rename to `Generar reporte` | Drawer footer | user-corrected |
| Imprimir / Exportar | Keep secondary | Report header | permissions pending |
| Filtrar por concepto | Keep | Above movement table | confirmed |
| Pago, Empresa, Fecha, Concepto, Numero, Dias | Keep | Report table | meanings partially pending |
| Debe, Haber, Saldo acum. | Keep | Report table | backend supplied |
| Saldo Anterior {P} | Keep, suffix secondary | First movement | `{P}` pending |
| Total Peso | Keep group totals | Report table | confirmed |
| Saldo total pesificado | Promote | Account list + report | conversion/sign pending |

## Builder Contract

- Implementar `CustomerAccountStatementWorkspace` con dos estados principales: `accounts-list` y `report`.
- El estado inicial es una tabla de clientes con cuenta corriente, no un formulario de consulta.
- Click en fila abre un `Sheet` de shadcn con los criterios del reporte.
- El drawer no contiene la tabla contable.
- `Generar reporte` cierra el drawer y usa la superficie completa para los movimientos.
- La entrada contextual desde Clientes abre el mismo drawer con cliente precargado.
- Usar datos simulados coherentes y etiquetar reglas no validadas.
- No integrar backend ni habilitar acciones que cambien dinero o cuenta corriente.

## Acceptance Criteria

1. La vista inicial muestra todos los clientes simulados con cuenta corriente.
2. La busqueda filtra por codigo, nombre o identificacion fiscal y tolera acentos.
3. Click en cualquier fila abre el drawer del cliente correcto.
4. El cliente no se vuelve a elegir dentro del drawer.
5. Consolidado, periodo, moneda y remitos permanecen visibles en el drawer, sin textos auxiliares.
6. `Generar reporte` no se habilita con periodo invalido.
7. Generar cierra el drawer y muestra saldo, movimientos y totales en el ancho principal.
8. `Cambiar criterios` reabre el drawer precargado.
9. Volver recupera la lista y su busqueda.
10. La entrada desde Clientes abre directamente el drawer correcto.
11. No existen acciones de cobro, imputacion, edicion o anulacion.
12. Ninguna regla contable pendiente se calcula o interpreta en el frontend.
13. `Desde` y `Hasta` abren un calendario shadcn accesible y no el selector de fecha nativo del navegador.

## Open Domain Questions

- Como se determina formalmente que un cliente posee cuenta corriente.
- Si clientes deshabilitados pueden consultarse y exportarse.
- Significado de saldo positivo, negativo y cero.
- Definicion exacta de `Consolidado`.
- Que representa `Pago` y como se calcula `Dias`.
- Regla y fecha de pesificacion, conversion y redondeo.
- Si los remitos afectan saldo o son informativos.
- Permisos y formatos de impresion/exportacion.
- Volumen esperado, paginacion y orden inicial del listado.
