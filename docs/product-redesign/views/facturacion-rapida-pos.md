# View: Facturacion Rapida / POS

## Metadata

- View ID: `facturacion-rapida-pos`
- Product area: Ventas / Caja / Fiscalizacion
- Status: draft
- Source material:
  - Screenshots provided on 2026-07-10.
- Related legacy views: Factura IMPOS, Ingreso de Rendiciones, Cambio Rapido de Mercaderia, Clientes, Consulta Rapida Articulos.
- Related patterns:
  - `../patterns/sidebar-navigation.md`
  - `./clientes.md`
  - `./catalogo-articulos.md`

## Product Job

- Primary user: cajero o vendedor de mostrador.
- Primary job: vender, cobrar y emitir comprobante rapido sin perder control de caja.
- Secondary jobs: abrir turno/caja, registrar retiros, cerrar caja, seleccionar o crear cliente, buscar articulos, usar favoritos, usar camara/scanner/balanza, resolver cambios de mercaderia.
- Frequency: muy alta; es la vista operativa central del comercio.
- Pressure: maxima. Hay cliente esperando, hardware involucrado, reglas fiscales, medios de pago y control de efectivo.
- Success event: el cajero abre caja, carga articulos, cobra y factura sin salir del flujo ni generar inconsistencias de caja/fiscalizacion.

## Current UX Problem

La vista actual es potente pero mezcla tareas con distinto riesgo:

- La pantalla permite llegar a facturacion sin que la apertura de caja sea el primer paso visible.
- La accion critica de iniciar caja/rendicion esta escondida dentro de operaciones de caja.
- Se pueden realizar facturaciones sin que el sistema comunique claramente el estado de caja.
- Retiros, rendiciones parciales y cierre de caja conviven como botones secundarios poco explicitos.
- Favoritos aparece como panel lateral que reduce espacio del ticket y no siempre aporta velocidad.
- Crear cliente desde facturacion saca al usuario de la vista, interrumpiendo la venta.
- El flujo de cambio de mercaderia es critico pero aparece como operacion secundaria, aunque puede generar saldo a cobrar, saldo cero o comprobante negativo.
- El cobro permite pago simple o mixto, pero necesita reglas claras de habilitacion, restante, vuelto y datos obligatorios por medio.

Lo util a preservar:

- Input principal para scanner/codigo/descripcion.
- Carga rapida por camara, scanner y busqueda.
- Boton de balanza para articulos pesables.
- Tabla de items con cantidad, descuentos, precio e importe.
- Total a pagar visible.
- Cliente, vendedor y lista de precios visibles.
- Pago en efectivo, tarjeta/transferencia y pago mixto.
- Cambio rapido de mercaderia con entrada/salida.

## Target UX Decision

Facturacion Rapida debe estar gobernada por el estado de caja.

Regla principal:

- Sin caja abierta para el usuario/local actual, no se puede facturar.
- Si no hay caja abierta, el workspace de facturacion debe mostrar un estado bloqueante `Caja sin abrir` y un CTA principal `Abrir caja`.
- El bloqueo aplica solo al contenido operativo del POS. El sidebar y la navegacion general del producto permanecen visibles, habilitados y sin blur.
- Abrir caja pide saldo inicial y datos operativos minimos.
- Una vez abierta la caja, la pantalla prioriza scanner + ticket + total + cobro.
- Cliente, favoritos, cambio, retiros, rendiciones y cierre son flujos contextuales que no deben sacar al cajero de la operacion.

Esta vista no usa el patron ABM list-detail. Usa un `POS workspace` orientado a estado, velocidad y continuidad operativa.

## Navigation Contract

Recommended entry:

1. Sidebar: `Ventas`.
2. Item principal: `Facturacion rapida` o `POS`.
3. Acceso secundario: `Caja` para historico, auditoria y administracion de rendiciones.

Rules:

- `Facturacion Rapida` debe abrir siempre el estado operativo actual del cajero.
- Los comprobantes emitidos se consultan en `Ventas > Documentos`, usando el contrato de `./documentos-comerciales.md`; facturas, notas y remitos no deben competir como destinos separados ni dentro del primer viewport del POS.
- `Caja`, rendiciones y cobros conservan su contexto de movimiento de dinero fuera del workspace `Documentos`.
- Si el usuario necesita crear cliente desde POS, abrir drawer/modal contextual y volver al ticket actual.
- Si el usuario necesita crear articulo desde POS, usar flujo contextual solo si el rol lo permite; no navegar al ABM completo por defecto.

## Required State Model

| State | Meaning | Primary UI | Allowed actions | Blocked actions |
| --- | --- | --- | --- | --- |
| Caja sin abrir | No hay caja/turno abierto para usuario/local | Workspace POS bloqueado con CTA `Abrir caja` | Abrir caja, navegar a otro modulo, cambiar local si permiso, ver ayuda/estado | Buscar articulo, agregar item, cobrar, facturar |
| Abriendo caja | Cajero carga saldo inicial | Dialog/drawer centrado | Confirmar apertura, cancelar | Venta y cobro |
| Caja abierta sin venta | Turno activo, ticket vacio | POS con input enfocado | Buscar/agregar articulo, cliente, favoritos, cambio, operaciones de caja | Cobrar/facturar sin items |
| Venta en curso | Hay items en ticket | POS con tabla y total | Editar cantidades, descuentos, cliente, cobrar, cancelar venta | Cerrar caja sin resolver venta |
| Pago en curso | Cajero define medios de pago | Modal/sheet de cobro | Agregar medios, confirmar y facturar, cancelar pago | Editar ticket sin volver |
| Facturando | Sistema emite comprobante/fiscaliza | Overlay/progreso | Esperar, cancelar solo si proceso lo permite | Cambiar ticket o pagos |
| Facturacion exitosa | Comprobante emitido | Feedback corto y reset | Imprimir/reintentar impresion, nuevo ticket | Modificar venta emitida |
| Error fiscal / ARCA | Fallo al emitir o autorizar | Error recuperable | Reintentar, corregir datos, guardar pendiente si aplica | Perder ticket o pagos cargados |
| Cambio en curso | Operacion de entrada/salida de mercaderia | Modal/sheet grande | Cargar entrada, cargar salida, calcular saldo | Facturar venta normal hasta cerrar/cancelar cambio |
| Cambio con diferencia | Cambio genera saldo positivo a cobrar | Vuelve a POS/pago con movimiento pendiente | Cobrar diferencia, aprobar movimiento | Editar como venta comun sin contexto de cambio |
| Cambio equilibrado | Entrada y salida tienen mismo importe | Cambio permite confirmar sin pago | Confirmar cambio | Cobro |
| Cambio negativo | Entrada mayor que salida | Flujo de comprobante negativo/credito | Generar comprobante negativo segun reglas | Cobrar |
| Caja lista para cerrar | Sin venta pendiente y cajero quiere cerrar | Dialog/drawer de cierre | Conteo, rendicion final, cerrar caja | Nueva venta si cierre esta en progreso |
| Caja cerrada | Turno finalizado | Estado cerrado | Abrir nueva caja si permiso | Facturar sobre turno cerrado |

## Layout Contract

### Caja sin abrir

- Primer viewport del POS bloqueante, pero conservando su contexto visual.
- Mostrar solo la vista de facturacion de fondo en estado deshabilitado con blur/overlay.
- La capa de bloqueo debe limitarse al workspace a la derecha del sidebar. No debe cubrir, desenfocar, deshabilitar ni interceptar eventos de la navegacion lateral.
- El formulario `Abrir caja` se centra dentro del workspace del POS, no respecto del viewport completo.
- Sobre ese fondo, abrir un modal centrado de apertura de caja.
- El modal debe mostrar:
  - Titulo: `Abrir caja`.
  - Mensaje corto: `Ingresa el saldo inicial para comenzar el turno`.
  - Saldo inicial como campo protagonista.
  - Selector de vendedor/cajero que va a operar la caja.
  - Datos de contexto minimos: usuario logueado, local, caja y moneda.
  - Observaciones como campo de texto multilinea.
  - CTA principal: `Abrir caja`.
  - Accion secundaria: `Cancelar` o `Salir`.
- El fondo puede mostrar el ticket vacio y la estructura real del POS, pero todo debe estar deshabilitado y visualmente subordinado al modal.
- No usar una pantalla vacia independiente para `Caja sin abrir`; el cajero debe entender que esta entrando al POS y que la apertura es el bloqueo inicial.
- No permitir que botones de cobro o facturacion aparezcan habilitados.

### POS con caja abierta

Header / search:

- Input principal siempre enfocado: `Escanear codigo de barras o escribir descripcion`.
- Debe aceptar codigo interno, codigo de barras y descripcion.
- Accesos compactos:
  - Favoritos.
  - Camara.
  - Balanza.
  - Teclado/manual si aplica.
- Estado de caja visible: `Caja abierta`, cajero, hora de apertura, saldo/turno si corresponde.
- Estado fiscal ARCA visible como linea compacta dentro del command area del POS, solo en esta vista.
- No duplicar `Estado fiscal ARCA` dentro del right rail del POS.
- No mostrar estos estados como tags decorativos si no aportan accion inmediata. Preferir una linea compacta superior o un control `Turno/Caja` que abra el detalle operativo.
- Evitar chips como `Caja abierta`, `ARCA conectado` y `Turno 08:10` ocupando espacio del command area si no son interactivos.

Primary region:

- Tabla/ticket de items como superficie dominante.
- Columnas base:
  - Codigo.
  - Item.
  - Unidad de venta.
  - Cantidad.
  - Descuento manual.
  - Descuento promocional.
  - Precio unitario.
  - Precio con descuento.
  - Importe.
  - Eliminar.
- Cantidad debe ser editable de forma rapida.
- Articulos pesables deben poder capturar peso desde balanza cuando corresponda.
- Eliminar item debe ser visible con icono de cesto/papelera, no con `x`.
- Eliminar item requiere confirmacion solo si la regla del negocio lo requiere.

Right rail / context:

- Selector de cliente actual. Debe permitir cambiar cliente sin salir del POS.
- Accion chica `+` junto al selector de cliente para crear cliente. No debe ser un boton grande ni competir con `Cobrar`.
- El alta de cliente abre drawer/modal contextual, sin salir del POS.
- Selector de vendedor/cajero que esta vendiendo en este momento, si el rol permite cambiarlo.
- Vendedor seleccionado debe quedar visible porque impacta la operacion.
- Accion visible `Cambio de mercaderia`. No debe quedar escondida dentro de un menu generico, porque es una operacion diaria de caja/mostrador y puede impactar stock, comprobantes y cobro.
- Accion visible `Caja / Turno` o panel `Caja`. No debe quedar escondida en un boton ambiguo; desde ahi se accede a movimientos, ingreso/retiro, rendicion parcial y cierre.
- Lista de precios, items y cantidad no deben mostrarse como cards/resumen en el panel lateral. Son datos irrelevantes en esa zona:
  - lista de precios se deriva del cliente o se muestra solo si hay accion para cambiarla;
  - items y cantidad ya existen en el ticket/footer;
  - totales ya viven en el footer de cobro.
- Operaciones de caja agrupadas bajo `Caja` o `Turno`, no dispersas ni mezcladas con medios de pago.
- El right rail debe ser compacto y accionable: cliente, vendedor, cambio, caja/turno y cobro. No usarlo para duplicar metricas del ticket.
- Cuando haya espacio libre debajo del contexto de cliente/vendedor y antes del bloque de cobro, aprovecharlo para un panel compacto de `Movimientos de caja`:
  - ultimos movimientos del turno: apertura, ingresos, retiros, rendiciones parciales y cierre pendiente si aplica;
  - saldo/estado del turno solo si aporta decision operativa;
  - acciones principales del panel: `Movimiento de caja`, `Rendicion parcial`, `Cerrar caja`, `Ver todos`;
  - no debe desplazar ni reducir el ticket principal.

Footer / totals:

- Subtotal.
- Descuento.
- Total a pagar como elemento protagonista.
- Acciones de cobro:
  - Boton `Efectivo` para registrar una venta en efectivo sin emision electronica.
  - Boton `Fac. E · Efectivo`.
  - Boton `Fac. E · Tarjeta`.
  - Los tres deben estar visibles, contiguos y con el mismo peso visual en las variantes A, B y C.
  - Las dos acciones de efectivo abren el flujo con `Efectivo` precargado; la accion con tarjeta lo abre con `Tarjeta` precargada.

### Favorites

Favoritos debe acelerar, no competir con el ticket.

Use `../patterns/quick-access-favorites.md` as the component contract.

Recommended behavior:

- Desktop: banda compacta o panel plegable cerca del input principal, usando tiles chicas.
- Mostrar hasta 6 favoritos visibles cuando el ancho lo permita.
- Los tiles deben ser mas chicos que los cards legacy: nombre en hasta 2 renglones, tipografia compacta y precio siempre visible.
- Si esta abierto, debe poder cerrarse sin afectar el ticket.
- Debe tener busqueda y paginacion si hay muchos favoritos.
- Los tiles deben mostrar nombre, precio y estado solo si no esta disponible.
- Click en favorito agrega item al ticket y devuelve foco al input principal.
- No debe ocupar espacio fijo como columna permanente si reduce demasiado el ticket.

### Responsive behavior

- Desktop: ticket central + right rail de contexto/cobro.
- Tablet: right rail puede convertirse en drawer.
- Mobile o pantalla chica: POS en modo dedicado, con input, ticket, total sticky y cobro como sheet.
- Hardware scanner debe funcionar sin click manual despues de cada operacion.

## Open Cash Drawer / Shift Flow

Entry:

- Automatico al entrar al POS si no hay caja abierta.
- Manual desde `Caja` / `Turno` si el usuario tiene permiso.

Required fields:

| Field | Purpose | Required? | Notes |
| --- | --- | --- | --- |
| Saldo inicial | Dinero fisico al comenzar turno | yes | Debe ser el dato principal. |
| Moneda | Moneda de caja | yes/default | Puede venir por local. |
| Empresa/local | Contexto operativo | yes/default | Debe venir del switcher activo. |
| Caja / centro de cobro | Identifica caja fisica o logica | yes | Ejemplo legacy: C.C. |
| Usuario | Cajero responsable | yes/default | No deberia editarse salvo permiso. |
| Vendedor | Vendedor/cajero que va a operar la caja | yes | Debe ser seleccionable si el usuario tiene permiso o si el local requiere elegir vendedor al abrir turno. |
| Fecha/hora | Auditoria | yes/default | Autogenerado. |
| Observacion | Contexto opcional | no | Campo de texto multilinea para aclaraciones de apertura. |

Rules:

- La apertura no requiere desglose fisico de billetes si el negocio no lo exige.
- Si se exige desglose, debe ser opcion avanzada o configuracion por local.
- Al confirmar apertura, el POS pasa a `Caja abierta sin venta`.
- Si falla la apertura, conservar datos y mostrar error.
- No permitir facturar con apertura pendiente o caja cerrada.
- El vendedor elegido al abrir caja debe alimentar el vendedor/cajero activo del POS.

## Cash Operations During Shift

Agrupar bajo un control visible `Caja` o `Turno`.

Placement:

- El acceso `Caja / Turno` debe estar visible en el POS, idealmente como panel compacto del right rail o boton claro dentro de ese panel.
- Si se muestra un panel de `Movimientos de caja`, debe incluir los ultimos eventos del turno y acciones directas.
- No esconder caja en un menu de overflow si hay espacio para mostrar el panel o boton.

Actions:

- `Movimiento de caja`: abre un unico formulario para registrar ingreso o retiro.
- `Rendicion parcial`: registra conteo parcial sin cerrar turno.
- `Cerrar caja`: inicia cierre final y debe ocupar todo el ancho disponible del panel de caja/turno, no ser un link chico.
- `Ver movimientos`: historial del turno actual.

Cash movement form:

| Field | Purpose | Required? | Notes |
| --- | --- | --- | --- |
| Tipo de movimiento | Define si es `Ingreso` o `Retiro` | yes | El flujo es el mismo; no crear dos formularios separados. |
| Monto | Importe del movimiento | yes | Debe validar monto mayor a 0. |
| Medio / caja | Donde impacta el movimiento | yes/default | Normalmente efectivo; puede extenderse si el negocio lo permite. |
| Motivo | Justificacion operativa | yes | Ej: retiro a encargado, reposicion, ajuste, gasto menor. |
| Observacion | Detalle libre | no | Multilinea si hace falta. |

Rules:

- Ingresos y retiros usan el mismo formulario; cambia el campo `Tipo de movimiento`.
- Cierre de caja no debe estar disponible si hay venta/pago/cambio en curso.
- Cierre de caja debe mostrar esperado vs contado y diferencia.
- Diferencias requieren motivo o permiso segun regla.
- Todas las operaciones de caja deben quedar auditadas por usuario, fecha/hora y local.
- El panel de movimientos debe actualizarse al registrar ingreso, retiro, rendicion o cierre.

## Sale Flow

Product entry:

- Scanner/codigo/descripcion agrega articulo al ticket.
- Camara agrega por lectura si esta disponible.
- Balanza se habilita para articulos pesables o para capturar peso antes de agregar.
- Si hay multiples resultados por descripcion, mostrar selector rapido sin perder foco.
- Si el articulo no tiene precio, esta deshabilitado o no puede venderse, mostrar error claro y no agregar silenciosamente.

Item behavior:

- Cantidad editable.
- Descuentos editables segun permiso.
- Precio editable solo si permiso y con trazabilidad.
- Eliminar item visible.
- Totales recalculan inmediatamente.
- Despues de agregar item, foco vuelve al input principal.

Client behavior:

- Cliente default puede ser consumidor final.
- El cliente debe ser un selector editable, no solo texto informativo.
- Cambiar cliente actualiza lista de precios, condicion fiscal y comprobante si aplica.
- Crear cliente desde POS se dispara con un boton chico `+` junto al selector de cliente y abre alta minima contextual basada en `./clientes.md`.
- Al guardar cliente, vuelve al ticket con el cliente seleccionado y los items intactos.
- Si el cambio de cliente afecta precios/impuestos, pedir confirmacion o mostrar recalculo claro.

Seller behavior:

- El vendedor/cajero de la operacion debe poder seleccionarse o cambiarse desde el POS cuando el rol lo permita.
- El vendedor no debe quedar como card estatica sin accion.
- Si el vendedor se define por la caja abierta y no puede cambiarse, mostrarlo como texto compacto dentro de `Turno/Caja`, no como bloque grande.

## Payment Flow

Entry:

- `Efectivo`, `Fac. E · Efectivo` y `Fac. E · Tarjeta` deben estar disponibles desde la pantalla de facturacion.
- Los tres botones abren el mismo flujo de confirmacion de pago y conservan si la operacion debe emitir comprobante electronico; cada uno preselecciona efectivo o tarjeta segun corresponda.
- El flujo debe ser un modal centrado, no un drawer/sheet lateral angosto.
- Ancho recomendado desktop: aproximadamente la mitad de la pantalla o un modal amplio de 760-920px.
- El POS queda de fondo con overlay/blur, porque el cobro bloquea la emision pero conserva contexto.
- No usar un panel estrecho alineado a un costado: dificulta leer medios, montos, tarjeta, cuotas y confirmacion.

Always visible:

- Total a pagar.
- Pagado.
- Restante.
- Vuelto cuando haya efectivo.
- `Confirmar y Facturar` como accion principal inferior.
- `Cancelar` como accion secundaria inferior.

Payment methods:

| Method | Required data | Notes |
| --- | --- | --- |
| Efectivo | monto recibido | Debe calcular vuelto. |
| Tarjeta | monto, tarjeta/procesador, plan si aplica, lote/cupon/autorizacion si aplica | No debe permitir confirmar si faltan datos requeridos. |
| Transferencia / Mercado Pago / PayWay | monto, referencia/autorizacion si aplica | Puede compartir estructura con tarjeta/procesador. |
| Mixto | multiples medios con monto | Restante debe llegar a 0 para confirmar. |

Rules:

- Si entra por `Cobrar con efectivo`, crear una fila inicial `Efectivo` con el monto total precargado.
- Si entra por `Cobrar con tarjeta`, crear una fila inicial `Tarjeta` con el monto total precargado y mostrar campos de tarjeta/cuotas.
- Pago simple prellena el monto total.
- Pago mixto permite `Agregar otro medio de pago`.
- Al agregar otro medio, el usuario elige metodo de pago y monto de ese metodo.
- El monto sugerido del nuevo medio debe ser el restante.
- Cada fila de medio debe mostrar:
  - medio de pago;
  - monto;
  - eliminar medio cuando haya mas de uno.
- Para tarjeta/transferencia/procesadores, mostrar campos adicionales solo cuando correspondan:
  - tipo de tarjeta/procesador;
  - plan/cuotas;
  - lote;
  - cupon;
  - autorizacion/referencia.
- Para cuotas, usar selector de plan/cuotas asociado al medio tarjeta.
- `Confirmar y Facturar` solo se habilita cuando `Restante = 0` y los medios estan completos.
- Si el efectivo supera el restante, mostrar vuelto.
- Si falta monto, tarjeta, plan, autorizacion o referencia requerida, marcar el campo.
- Al confirmar, pasar a `Facturando`.
- Si falla ARCA/fiscalizacion, conservar ticket y pagos cargados.
- La jerarquia visual debe parecerse al flujo legacy de confirmacion de pago: totales claros arriba, filas de medio al centro, pago/vuelto y acciones al pie.

## Exchange Flow

Entry:

- Boton visible `Cambio de mercaderia` dentro del POS, cerca del contexto de caja/turno o como accion operativa de mostrador.
- Abre modal/sheet grande `Cambio Rapido de Mercaderia`.
- Mantiene el POS de fondo, pero el cambio se resuelve como flujo dedicado.
- No debe quedar escondido dentro del menu de caja ni mezclado con medios de pago.

Structure:

- Header:
  - Titulo `Cambio Rapido de Mercaderia`.
  - Saldo calculado automaticamente.
  - CTA contextual: `Continuar a cobro`, `Confirmar cambio` o `Generar comprobante negativo` segun saldo.
  - `Cerrar`.
- Section `Entrada (Devuelve el Cliente)`:
  - Busqueda por descripcion, codigo o barra.
  - Tabla de articulos que vuelven.
  - Total entrada.
- Section `Salida (Lleva el Cliente)`:
  - Busqueda por descripcion, codigo o barra.
  - Tabla de articulos que se entregan.
  - Total salida.
- Resultado calculado:
  - muestra la diferencia entre salida y entrada;
  - label automatico segun saldo: `Diferencia a cobrar`, `Cambio equilibrado` o `Comprobante negativo`;
  - no usar tabs, segmented control ni botones para elegir manualmente el escenario.

Balance rules:

| Balance | Meaning | Result |
| --- | --- | --- |
| Saldo positivo / a cobrar | Salida mayor que entrada | Vuelve a POS/pago con diferencia pendiente; se debe aprobar/cobrar movimiento. |
| Saldo cero / equilibrado | Entrada y salida iguales | Permite confirmar cambio sin cobro adicional. |
| Saldo negativo | Entrada mayor que salida | Genera comprobante negativo/credito segun reglas fiscales. |

Rules:

- Entrada y salida deben mostrar claramente cantidad, precio, IVA e importe.
- No permitir confirmar cambio vacio.
- El usuario no elige si el cambio es diferencia a cobrar, saldo cero o comprobante negativo; el sistema lo calcula con `Total salida - Total entrada`.
- Si hay diferencia positiva, la vista de facturacion rapida recibe el movimiento pendiente y bloquea finalizar hasta cobrar/aprobar.
- Si hay diferencia negativa, no abrir cobro; iniciar flujo fiscal de comprobante negativo.
- Si hay error fiscal, conservar la operacion de cambio.

## Interaction Contract

| Trigger | Result | Surface | Returns to origin? | Notes |
| --- | --- | --- | --- | --- |
| Entrar a POS sin caja abierta | Muestra bloqueo `Caja sin abrir` | POS state | no | No permite vender/facturar. |
| Abrir caja | Pide saldo inicial | Dialog/drawer | yes | Al confirmar habilita venta. |
| Escanear/escribir articulo | Agrega item o muestra selector/error | POS ticket | yes | Foco vuelve al input. |
| Activar camara | Lee codigo y agrega item | Dialog/sheet/camera | yes | Debe manejar permisos de camara. |
| Activar balanza | Captura peso para articulo pesable | Inline/tool | yes | Debe mostrar peso capturado. |
| Abrir favoritos | Muestra panel plegable | Panel/drawer | yes | No debe bloquear scanner. |
| Click favorito | Agrega articulo | POS ticket | yes | Cierra o mantiene panel segun configuracion. |
| Crear cliente | Abre alta minima | Drawer/modal contextual | yes | Vuelve con cliente seleccionado y ticket intacto. |
| Cobrar | Abre confirmacion de pago | Modal/sheet | yes | Bloquea edicion hasta cancelar o confirmar. |
| Agregar medio pago | Agrega fila de medio | Modal/sheet pago | yes | Recalcula restante. |
| Confirmar y facturar | Emite comprobante | Estado facturando | yes | Solo habilitado con restante 0. |
| Error fiscal | Conserva ticket/pagos y muestra error | Modal/alerta recuperable | yes | Permite reintentar/corregir. |
| Movimiento de caja | Registra ingreso o retiro | Dialog/drawer | yes | Unico formulario con campo `Tipo de movimiento`. |
| Rendicion parcial | Registra conteo parcial | Dialog/drawer | yes | No cierra caja. |
| Cerrar caja | Inicia cierre final | Dialog/drawer | no/yes | Bloqueado si hay operacion pendiente. |
| Cambio | Abre cambio mercaderia | Modal/sheet grande | yes | No se mezcla con venta comun. |
| Cambio con saldo positivo | Vuelve a cobro con diferencia | POS/payment | yes | Se cobra/aprueba diferencia. |
| Cambio saldo cero | Confirma cambio | Exchange flow | yes | Sin cobro. |
| Cambio saldo negativo | Genera comprobante negativo | Exchange/fiscal flow | yes | No abre cobro. |

## Information Architecture

### Always Visible With Open Cash

- Input de articulo.
- Cliente actual.
- Selector de vendedor/cajero cuando aplique.
- Ticket de items.
- Total a pagar.
- Accion de cobro.
- Acceso visible a `Cambio de mercaderia`.
- Acceso visible a `Caja/Turno` y, si hay espacio, panel compacto de movimientos del turno.
- Estado de caja/fiscal solo como indicador compacto o dentro de `Turno/Caja`, sin tags decorativos redundantes.

### Contextual / Secondary

- Favoritos.
- Camara.
- Balanza.
- Crear cliente.
- Cambiar lista de precios.
- Descuentos avanzados.
- Pago mixto.
- Movimientos de caja/rendicion/cierre.

### Hidden Unless Requested

- Historico de facturas.
- Auditoria completa.
- Reportes de caja.
- Configuracion de medios de pago.
- Configuracion fiscal.
- Configuracion de balanza/camara.

### Candidate To Remove From Primary Surface

- Permitir venta/facturacion sin caja abierta.
- Operaciones de caja escondidas bajo labels ambiguos.
- Cambio de mercaderia escondido dentro de un menu generico o dentro de operaciones de caja.
- Separar `Retiro de efectivo` e `Ingreso de efectivo` como dos formularios distintos cuando comparten la misma estructura.
- Selector manual de escenario en cambio de mercaderia; el resultado debe calcularse automaticamente.
- Crear cliente navegando fuera del POS.
- Boton grande `Crear cliente` dentro del panel lateral.
- Cliente o vendedor como texto/card no editable cuando deben poder cambiarse.
- Cards laterales de `Lista`, `Items` o `Cantidad`; esos datos duplican informacion del ticket/footer.
- Favoritos como columna fija permanente si reduce demasiado el ticket.
- Tags/chips decorativos de estado que no aportan accion inmediata.
- Icono `x` para eliminar items; usar cesto/papelera.
- Acciones de caja mezcladas visualmente con medios de pago.
- Confirmar facturacion con restante distinto de 0.
- Perder ticket/pagos ante error fiscal.

## Actions

| Action | Frequency | Risk | Placement | Confirmation | Permission |
| --- | --- | --- | --- | --- | --- |
| Abrir caja | diaria/turno | alta caja | estado bloqueante / Turno | si, al confirmar saldo | cajero |
| Agregar articulo | muy alta | media | input principal | no | cajero |
| Editar cantidad | alta | media | ticket row | no/segun permiso | cajero |
| Editar descuento | media | media/alta | ticket row | no/segun permiso | permiso |
| Eliminar item | media | media | ticket row | segun regla | cajero |
| Crear cliente | media | alta fiscal | cliente panel | no, validacion en drawer | permiso |
| Cobrar | muy alta | alta fiscal/caja | footer/right rail | no, abre pago | cajero |
| Confirmar y facturar | muy alta | critica | payment modal footer | si/accion explicita | cajero |
| Movimiento caja | media | alta caja | panel Caja/Turno | si | permiso |
| Rendicion parcial | baja/media | alta caja | Turno/Caja | si | permiso |
| Cerrar caja | diaria/turno | critica | Turno/Caja | si | cajero/encargado |
| Cambio mercaderia | media | alta fiscal/stock/caja | accion visible POS / right rail | si al confirmar | permiso |
| Facturar cambio negativo | baja | critica fiscal | exchange flow | si | permiso |

## States

- Loading: recuperar estado de caja y venta pendiente antes de habilitar UI.
- Caja sin abrir: POS deshabilitado/desenfocado con apertura de caja encima; sidebar y navegacion general disponibles.
- Opening cash: formulario de apertura con saldo inicial.
- Open cash idle: input enfocado, ticket vacio.
- Sale in progress: items cargados, total visible.
- Favorites open: panel plegable abierto, input recupera foco al agregar.
- Customer creation: drawer/modal de alta minima sin perder ticket.
- Payment in progress: modal/sheet de pago con total, pagado, restante y vuelto.
- Mixed payment: multiples medios, restante recalculado.
- Invoicing: bloqueo de edicion mientras fiscaliza.
- Fiscal success: limpiar ticket y volver a input.
- Fiscal error: conservar ticket/pagos y permitir reintento.
- Cash movement: dialog/drawer unico para ingreso o retiro con tipo, monto, motivo, medio y observacion.
- Partial cash count: dialog/drawer de rendicion parcial.
- Closing cash: cierre con conteo esperado/real y diferencia.
- Exchange in progress: modal de entrada/salida.
- Exchange positive balance: diferencia a cobrar en POS/pago.
- Exchange zero balance: confirmacion sin cobro.
- Exchange negative balance: comprobante negativo/credito.
- Permission denied: accion oculta o disabled con motivo.
- Unsaved/pending operation: confirmar antes de cerrar/cambiar vista.

## Builder Handoff

- Components needed:
  - `POSWorkspace`
  - `CashStateGate`
  - `OpenCashDialog`
  - `CashStatusBar`
  - `ProductSearchInput`
  - `POSTicketTable`
  - `TicketItemRow`
  - `FavoritesPanel`
  - `CustomerContextPanel`
  - `SellerSelector`
  - `CustomerQuickCreateDrawer`
  - `PaymentSheet`
  - `PaymentMethodRow`
  - `CashActivityPanel`
  - `CashMovementDialog`
  - `CashCloseDrawer`
  - `ExchangeMerchandiseDialog`
  - `FiscalStatusBanner`
- Data needed:
  - estado de caja por usuario/local.
  - caja activa, saldo inicial, movimientos, ingresos, retiros, rendiciones, cierre.
  - ticket actual con items, cantidades, descuentos, precios, IVA y total.
  - cliente actual, opciones de cliente, lista de precios derivada y vendedor/local.
  - medios de pago, tarjetas/procesadores, planes, requisitos de autorizacion.
  - estado ARCA/fiscalizacion.
  - favoritos del local/usuario.
  - permisos por accion.
  - errores recuperables.
- Reusable references:
  - Alta contextual de cliente: `./clientes.md`.
  - Busqueda de articulos y capacidades de balanza/seriados: `./catalogo-articulos.md`.
- Must preserve:
  - velocidad de scanner/input;
  - total protagonista;
  - pago simple y mixto;
  - cambio de mercaderia con entrada/salida;
  - cambio de mercaderia como accion visible, no escondida;
  - operaciones de caja auditables.
- Must avoid:
  - facturar sin caja abierta;
  - reemplazar el POS por una pantalla vacia cuando falta abrir caja; usar POS desenfocado con modal de apertura;
  - sacar al cajero del POS para crear cliente;
  - boton grande de crear cliente en el right rail;
  - right rail con cards irrelevantes de lista/items/cantidad;
  - cliente o vendedor no editables cuando el flujo requiere cambiarlos;
  - tags/chips decorativos para caja/ARCA/turno;
  - `x` como accion de eliminar item;
  - esconder `Cambio de mercaderia` dentro de un menu de caja;
  - dos formularios distintos para ingreso y retiro de caja;
  - selector manual para tipo de resultado del cambio de mercaderia;
  - payment sheet/drawer angosto para cobrar;
  - cobro con efectivo/tarjeta escondido detras de un selector pequeño cuando son acciones principales;
  - modal de pago sin monto precargado para el medio elegido;
  - favoritos ocupando espacio fijo si no aportan;
  - confirmar pago con restante distinto de 0;
  - perder ticket ante error fiscal;
  - mezclar cambio de mercaderia con venta normal sin contexto.

## Open Questions

| Question | Why it matters | Blocking? |
| --- | --- | --- |
| La apertura de caja debe exigir solo saldo inicial o desglose de billetes por configuracion | Define formulario de apertura | yes before final build |
| Puede haber mas de una caja abierta por usuario/local | Define bloqueo y selector de caja | yes |
| Que operaciones se permiten con caja cerrada | Define permisos y estado bloqueante | yes |
| Retiros e ingresos requieren aprobacion de encargado | Define confirmaciones y permisos | yes |
| Cierre de caja debe bloquear con diferencia o permitir motivo | Define flujo de cierre | yes |
| Cuales medios de pago requieren lote, cupon, autorizacion o referencia | Define validacion del payment sheet | yes |
| Que comprobante fiscal corresponde a cambio con saldo negativo | Define flujo fiscal de cambio | yes |
| Cambio con saldo positivo debe volver al mismo payment sheet o crear ticket especial | Define integracion entre cambio y cobro | yes |
| Favoritos es por usuario, local o empresa | Define datos y administracion del panel | no |
| Balanza se activa por articulo o manualmente antes de buscar | Define interaccion exacta con peso | no |
