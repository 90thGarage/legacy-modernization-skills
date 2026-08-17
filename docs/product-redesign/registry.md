# Redesign Registry

Indice vivo del redisenio del producto.

## Product Areas

| Area | Purpose | Documentation | Delivery | Notes |
| --- | --- | --- | --- | --- |
| Acceso y permisos | Sesion, visibilidad y capacidades por rol | inferred / partial | prototype-built | Flujos en `../ux/flows/acceso-y-sesion.md` y `../ux/flows/roles-y-permisos.md`. |
| App shell | Navegacion global, sidebar y contexto de empresa/local | draft | prototype-built | Regla transversal en `app-shell.md`; no es un flujo de negocio. |
| Dashboard financiero | Lectura de posicion, vencimientos, liquidez y resultado | partial | prototype-built | Brief/handoff en `../ux/`; formulas pendientes. |
| Catalogo / articulos | Buscar, consultar, crear y mantener productos | partial | prototype-built | Ver `views/catalogo-articulos.md`. |
| Etiquetas | Disenar plantillas e imprimir lotes | partial | prototype-built | Ver ambos contratos de Etiquetas. |
| Consulta rapida / autoservicio | Consulta de precio para clientes | partial | prototype-built | Kiosco sin shell administrativo. |
| Stock / depositos | Crear, consultar y mantener depositos | partial | prototype-built | Movimientos de stock fuera de alcance. |
| Facturacion rapida / POS | Venta de mostrador, caja, cobro y fiscalizacion | partial | prototype-built | Hardware e integraciones simulados. |
| Facturacion avanzada | Preparar comprobantes detallados configurables | partial | prototype-built | Emision real no integrada. |
| Presupuestos de venta | Mantener propuestas sin efectos al guardar | partial | prototype-built | Conversion pendiente. |
| Documentos comerciales | Consultar/generar facturas, notas y remitos | partial | prototype-built | Efectos por tipo pendientes. |
| Pagos y cobros | Ordenes de pago y recibos en flujos separados | inferred | prototype-built | Movimientos simulados. |
| Clientes | Alta, seleccion y mantenimiento | partial | prototype-built | Incluye entrada a cuenta corriente. |
| Cuenta corriente | Saldo y movimientos de clientes | partial | prototype-built | Solo lectura. |
| Proveedores | Mantenimiento de contrapartes de compra | inferred | prototype-built | Compra end-to-end pendiente. |
| Rubros / subrubros | Clasificacion jerarquica de articulos | partial | prototype-built | Arquitectura confirmada. |

## Flow Coverage

| Flow | Documentation | Delivery | Main surface |
| --- | --- | --- | --- |
| [`acceso-y-sesion`](../ux/flows/acceso-y-sesion.md) | partially-confirmed | prototype-built | Login + App shell |
| [`roles-y-permisos`](../ux/flows/roles-y-permisos.md) | inferred | prototype-built | RolesPermissionsWorkspace |
| [`dashboard-financiero`](../ux/flows/dashboard-financiero.md) | partially-confirmed | prototype-built | Dashboard financiero |
| [`facturacion-rapida-pos`](../ux/flows/facturacion-rapida-pos.md) | partially-confirmed | prototype-built | POS |
| [`alta-cliente-en-caja`](../ux/flows/alta-cliente-en-caja.md) | partially-confirmed | prototype-built | POS / cliente contextual |
| [`cobro-y-fiscalizacion`](../ux/flows/cobro-y-fiscalizacion.md) | partially-confirmed | prototype-built | POS / cobro |
| [`factura-pendiente-arca`](../ux/flows/factura-pendiente-arca.md) | partially-confirmed | prototype-partial | POS; cola pendiente |
| [`cambios-producto`](../ux/flows/cambios-producto.md) | partially-confirmed | prototype-built | POS / cambio |
| [`rendicion-caja`](../ux/flows/rendicion-caja.md) | partially-confirmed | prototype-built | POS / Caja y turno |
| [`balanza-en-venta`](../ux/flows/balanza-en-venta.md) | partially-confirmed | prototype-built | POS / balanza simulada |
| [`facturacion-avanzada`](../ux/flows/facturacion-avanzada.md) | partially-confirmed | prototype-built | Facturacion avanzada |
| [`presupuestos-venta`](../ux/flows/presupuestos-venta.md) | partially-confirmed | prototype-built | Presupuestos |
| [`documentos-comerciales`](../ux/flows/documentos-comerciales.md) | partially-confirmed | prototype-built | Documentos compra/venta |
| [`pagos-proveedores`](../ux/flows/pagos-proveedores.md) | inferred | prototype-built | Compras / Pagos |
| [`cobros-clientes`](../ux/flows/cobros-clientes.md) | inferred | prototype-built | Ventas / Cobros |
| [`cuenta-corriente-clientes`](../ux/flows/cuenta-corriente-clientes.md) | partially-confirmed | prototype-built | Cuenta corriente |
| [`gestion-clientes`](../ux/flows/gestion-clientes.md) | partially-confirmed | prototype-built | Clientes |
| [`gestion-proveedores`](../ux/flows/gestion-proveedores.md) | inferred | prototype-built | Proveedores |
| [`catalogo-articulos`](../ux/flows/catalogo-articulos.md) | partially-confirmed | prototype-built | Articulos |
| [`rubros-subrubros`](../ux/flows/rubros-subrubros.md) | partially-confirmed | prototype-built | Rubros |
| [`gestion-depositos`](../ux/flows/gestion-depositos.md) | partially-confirmed | prototype-built | Depositos |
| [`consulta-rapida-autoservicio`](../ux/flows/consulta-rapida-autoservicio.md) | partially-confirmed | prototype-built | Kiosco |
| [`diseno-etiquetas`](../ux/flows/diseno-etiquetas.md) | partially-confirmed | prototype-built | Diseno de etiquetas |
| [`impresion-etiquetas`](../ux/flows/impresion-etiquetas.md) | partially-confirmed | prototype-built | Impresion de etiquetas |

`catalogo-productos` se conserva como alias historico de `catalogo-articulos`; no se cuenta como flujo independiente.

## Reusable Patterns

| Pattern | File | Use When | Status |
| --- | --- | --- | --- |
| Formulario simple | `patterns/formulario-simple.md` | Se crea o edita una entidad mediante una carga breve y una unica finalizacion | draft |
| Formulario seccionado | `patterns/formulario-seccionado.md` | La carga combina varias decisiones, secciones o capacidades condicionales | draft |
| ABM jerarquico | `patterns/abm-jerarquico.md` | Una entidad padre contiene una coleccion hija que debe administrarse sin perder la relacion | draft |
| ABM simple | `patterns/abm-simple.md` | Se mantiene una entidad con pocos campos, relaciones limitadas y ciclo de vida directo | draft |
| ABM compuesto | `patterns/abm-compuesto.md` | Una entidad combina secciones, colecciones hijas o configuracion dependiente | draft |
| Documento transaccional | `patterns/documento-transaccional.md` | Una operacion tiene cabecera, items, importes, estados y efectos de negocio | draft |
| Consulta y reporte | `patterns/consulta-reporte.md` | Se filtra, compara, resume o exporta informacion sin modificar la operacion | draft |
| List-detail workspace | `patterns/list-detail-workspace.md` | Una vista mezcla grilla/listado con formulario o detalle del registro seleccionado | draft |
| Search and filter bar | `patterns/search-filter-bar.md` | Un listado necesita busqueda y criterios visibles sin ocultar controles ni desplazar la tabla | draft |
| Quick access favorites | `patterns/quick-access-favorites.md` | Un flujo operativo necesita agregar items frecuentes sin interrumpir la tarea principal | draft |
| Sidebar navigation | `patterns/sidebar-navigation.md` | La navegacion legacy expone modulos tecnicos, ABM o subpantallas como destinos principales | draft |

## View Contracts

| View ID | File | Primary job | Pattern | Documentation | Delivery |
| --- | --- | --- | --- | --- | --- |
| login | `../ux/login-implementation-notes.md` | Iniciar sesion en un contexto autorizado | authentication | partial | prototype-built |
| dashboard-financiero | `../ux/dashboard-financiero-ui-handoff.md` | Comprender posicion y riesgos financieros | consulta y reporte | draft | prototype-built |
| roles-permisos | `../ux/roles-permissions-implementation-notes.md` | Mantener roles, permisos y usuarios | list-detail + permission matrix | inferred | prototype-built |
| catalogo-articulos | `views/catalogo-articulos.md` | Buscar, consultar y mantener articulos/productos | list-detail workspace | draft | prototype-built |
| diseno-etiquetas | `views/diseno-etiquetas.md` | Crear y guardar plantillas visuales reutilizables | visual editor | draft | prototype-built |
| impresion-etiquetas | `views/impresion-etiquetas.md` | Preparar articulos, cantidades e imprimir | operational batch workspace | draft | prototype-built |
| clientes | `views/clientes.md` | Buscar, consultar, crear y mantener clientes | list-detail workspace | draft | prototype-built |
| cuenta-corriente-clientes | `views/cuenta-corriente-clientes.md` | Consultar saldo y movimientos | consulta y reporte | draft | prototype-built |
| consulta-rapida-autoservicio | `views/consulta-rapida-autoservicio.md` | Consultar precio en modo cliente/kiosco | kiosk price lookup | draft | prototype-built |
| depositos | `views/depositos.md` | Crear, consultar y mantener depositos | list-detail workspace | draft | prototype-built |
| facturacion-rapida-pos | `views/facturacion-rapida-pos.md` | Vender, cobrar, facturar y controlar caja | POS state workspace | draft | prototype-built |
| facturacion-avanzada | `views/facturacion-avanzada.md` | Preparar una factura detallada configurable | documento transaccional | draft | prototype-built |
| presupuestos | `views/presupuestos.md` | Buscar, crear y editar propuestas | documento transaccional + list-detail | draft | prototype-built |
| documentos-comerciales | `views/documentos-comerciales.md` | Consultar y generar documentos de compra/venta | documento transaccional + contextual list | draft | prototype-built |
| pagos-y-cobros | `views/pagos-y-cobros.md` | Consultar y crear ordenes de pago o recibos | list-detail workspace | draft | prototype-built |
| proveedores | `views/proveedores.md` | Buscar, consultar, crear y mantener proveedores | list-detail workspace | draft | prototype-built |
| rubros-subrubros | `views/rubros-subrubros.md` | Administrar clasificacion jerarquica | abm jerarquico + list-detail | draft | prototype-built |

## Decision Log

| Date | Decision | Applies to | Source |
| --- | --- | --- | --- |
| 2026-08-14 | El shell no usa una barra superior persistente: cada workspace muestra su propio titulo y acciones. El control de expandir/contraer vive en el header del sidebar; ARCA pasa al command area del POS y los selectores experimentales a configuraciones contextuales. Esta decision reemplaza la ubicacion de ARCA definida el 2026-07-14. | App shell, sidebar, POS y Facturacion avanzada | Correccion visual explicita del usuario |
| 2026-07-31 | Facturacion Avanzada es una vista independiente de Facturacion Rapida. Conserva siempre Cabecera, Items y Resumen; dentro de esas zonas permite configurar bloques, campos, columnas y extensiones por cliente sin alterar reglas fiscales ni de dominio. | Ventas, facturacion, documentos transaccionales y configuracion por cliente | Dos capturas legacy y feedback explicito del cliente |
| 2026-07-23 | El sandbox usa dos perfiles hardcodeados: Administrador accede a todo; Vendedor solo a `Ventas > Facturacion rapida` y `Catalogo > Articulos`. Sidebar y navegacion interna consumen la misma regla de acceso; es una simulacion y no reemplaza autorizacion backend. | Login, app shell, sidebar y permisos del prototipo | Definicion explicita del usuario |
| 2026-07-22 | Rubros y subrubros se modelan como un ABM jerarquico: Rubro es padre, Subrubro es hijo y no existe un ABM principal separado para Subrubros. `Catalogo > Rubros` ofrece el workspace administrativo; la lista ocupa todo el ancho y alta/edicion viven en un drawer ancho con ambos niveles. | Catalogo, Articulos, Rubros/Subrubros y futuras clasificaciones jerarquicas | Tres capturas legacy y aclaracion explicita del usuario |
| 2026-07-22 | El formulario de Articulos usa Rubro y Subrubro como comboboxes dependientes; permite crear valores sin perder el borrador y vuelve con el nuevo valor seleccionado. Un registro utilizado no se elimina sin mostrar impacto y ofrecer deshabilitar o reasignar. | Catalogo de articulos y Rubros/Subrubros | Aclaracion explicita del usuario y modernizacion del ABM legacy |
| 2026-07-22 | El Laboratorio UX estandariza formularios de carga y reportes. Expone `Formulario simple`, `Formulario seccionado` y `Consulta y reporte`; `Documento transaccional` deja de ser una template visible del laboratorio. | Laboratorio UX y futuras vistas de carga/consulta | Aclaracion explicita del usuario posterior a prueba de la template transaccional |
| 2026-07-22 | Los reportes reutilizan exactamente la barra de busqueda y filtros de `Documentos`: busqueda full-width, Tabs a la izquierda, filtros compactos visibles a la derecha y tabla en el mismo bloque. La franja de hasta cuatro indicadores es opcional. | Consulta y reporte, Search and filter bar y futuras vistas de reporte | Capturas y aclaracion explicita del usuario |
| 2026-07-22 | La exportacion de reportes ofrece CSV, Excel y PDF y debe representar el resultado actual con los mismos filtros, columnas, orden, agrupacion y permisos. | Consulta y reporte y futuras exportaciones | Aclaracion explicita del usuario |
| 2026-07-22 | En documentos transaccionales, subtotal e impuestos cierran la tabla que los produce; no se usa una tarjeta lateral de resumen si solo repite valores y el total dominante ya vive en la barra de finalizacion. | Documento transaccional, tablas de items y futuras templates operativas | Correccion explicita del usuario posterior a prueba visual |
| 2026-07-22 | `Ventas > Presupuestos` usa listado dominante y una superficie dedicada para alta/edicion; `Grabar` se reemplaza por `Crear presupuesto` o `Guardar cambios`, y guardar no factura, reserva stock ni afecta dinero o cuenta corriente. | Ventas, Presupuestos, app shell y documento transaccional | Capturas y aclaracion explicita del usuario |
| 2026-07-22 | `Ventas > Cuenta corriente` es una consulta de solo lectura con cliente y criterios visibles, saldo, movimientos y totales; no registra cobros ni duplica `Saldos` como destino separado. | Ventas, Clientes, Cuenta corriente, Cobros y sidebar | Capturas y definicion explicita del usuario |
| 2026-07-22 | `Catalogo` incorpora dos destinos relacionados pero independientes: `Diseno de etiquetas` conserva el editor visual de herramientas/canvas/propiedades/pagina, e `Impresion de etiquetas` conserva busqueda/tabla/lote/preview/accion de impresion. | Catalogo, etiquetas, sidebar y app shell | Capturas y definicion explicita del usuario |
| 2026-07-22 | Los filtros usan ancho de contenido y nunca se estiran para completar la fila. Titulo, busqueda, filtros y tabla forman un unico bloque visual con el mismo fondo y gutter, sin divisor entre controles y resultados. | Search and filter bar, Documentos, Pagos, Cobros y futuros listados | Correccion explicita del usuario posterior a prueba visual |
| 2026-07-22 | La busqueda ocupa una fila full-width; debajo, una unica barra usa Tabs a la izquierda y el grupo de filtros visibles a la derecha con `space-between`. Los controles no llevan titulos superiores: su texto visible identifica el criterio y conservan nombre accesible. | Todos los listados con filtros; inicialmente Documentos, Pagos y Cobros | Correccion explicita del usuario posterior a prueba con builder |
| 2026-07-22 | Facturas, notas de credito/debito y remitos se consultan desde un workspace `Documentos` dentro de Compras o Ventas; los tipos funcionan como filtros y opciones de un unico flujo adaptable, no como destinos/formularios separados. | Compras, Ventas, app shell y documentos transaccionales | Conversacion de redisenio |
| 2026-07-22 | El contexto de navegacion resuelve compra/venta y la factura es el origen preferido para crear una nota; pagos y cobros permanecen fuera del workspace de documentos. | Documentos de compra/venta, notas, pagos y cobros | Conversacion de redisenio |
| 2026-07-22 | Los filtros secundarios compactos de Documentos se abren en un popover anclado, con aplicacion inmediata, labels visibles, operacion por teclado y contador de filtros activos; no usan drawer ni desplazan la tabla. | Documentos de compra/venta y list-detail workspace | Correccion visual posterior a prueba con builder |
| 2026-07-22 | Esta decision reemplaza el popover anterior: todos los filtros quedan visibles, se elimina `Mas filtros` y `Todos / Facturas / Notas / Remitos` usa el componente `Tabs`, nunca `Button` ni `ToggleGroup`. | Documentos, Pagos, Cobros y list-detail workspace | Correccion explicita del usuario posterior a prueba con builder |
| 2026-07-22 | El sidebar agrupa `Documentos`, `Pagos` y `Proveedores` dentro de Compras, y `Facturacion rapida / POS`, `Documentos`, `Cobros` y `Clientes` dentro de Ventas; pagos/cobros siguen siendo flujos independientes. | App shell, Compras y Ventas | Correccion de arquitectura posterior a prueba con builder |
| 2026-07-22 | Pagos y Cobros comparten un workspace de listado, filtros, detalle y alta; `Compras > Pagos` lista ordenes de pago y `Ventas > Cobros` lista recibos, sin mezclarlos con Documentos. | Compras, Ventas, Pagos y Cobros | Aclaracion del usuario posterior a prueba con builder |
| 2026-07-22 | Los patrones de vistas se documentan y prueban juntos como drafts en un Laboratorio UX separado del sidebar productivo; se refinan y validan con cada flujo real. | ABM simple, ABM compuesto, documento transaccional y consulta/reporte | Conversacion de redisenio |
| 2026-07-22 | Las vistas recuperan el ancho cuando termina un panel contextual; los formularios secuenciales ubican la finalizacion al pie del flujo y pueden mantenerla visible con una barra inferior sticky. | Producto completo y patrones de vistas | Feedback visual sobre documento transaccional |
| 2026-07-10 | Las vistas de ABM con listado + formulario persistente deben migrar a grilla dominante + detalle contextual + edicion completa bajo demanda. | Catalogo/articulos y futuras vistas ABM similares | Conversacion de redisenio |
| 2026-07-10 | En `catalogo-articulos`, `Crear articulo` abre un drawer ancho de alta guiada; dentro del drawer no se usa otro CTA llamado `Crear articulo`, sino acciones de guardado y continuidad. | Catalogo/articulos | Conversacion de redisenio |
| 2026-07-10 | Las grillas pueden incluir una columna compacta de acciones por fila, siempre reutilizando las mismas superficies que el panel contextual. | Catalogo/articulos y futuras vistas ABM similares | Conversacion de redisenio |
| 2026-07-10 | El sidebar debe organizarse por areas de negocio, no por `ABM` ni subpantallas tecnicas; empresa/local vive arriba y usuario/preferencias/logout abajo. | App shell y navegacion global | Conversacion de redisenio |
| 2026-07-10 | En Catalogo, `Articulos` debe ser la entrada principal; seriados, caracteristicas, rubros, depositos, variaciones y costos pasan a capacidades, filtros, herramientas o secciones contextuales. | Catalogo/articulos | Conversacion de redisenio |
| 2026-07-10 | `Articulos Seriados` se resuelve como filtro/capacidad dentro de la grilla de Articulos; `Caracteristicas` se resuelve como campos opcionales dentro del alta/edicion del articulo, no como vista principal. | Catalogo/articulos | Conversacion de redisenio |
| 2026-07-10 | El detalle de articulo se abre como drawer/sheet lateral bajo demanda al seleccionar una fila; no debe implementarse como columna fija persistente junto a la tabla. | Catalogo/articulos y list-detail workspace | Correccion posterior a prueba con builder |
| 2026-07-10 | El drawer de alta/edicion de articulo debe ser ancho, 45-50vw en desktop con minimo util, y el formulario debe ocupar mas espacio que la columna de pasos. | Catalogo/articulos | Correccion posterior a prueba con builder |
| 2026-07-10 | El drawer de detalle de articulo debe tener el mismo ancho que alta/edicion, y la columna `Acciones` debe mostrar botones visibles para editar, duplicar y eliminar en lugar de menu de tres puntos. | Catalogo/articulos | Correccion posterior a prueba con builder |
| 2026-07-14 | `Catalogo > Articulos` debe permitir alternar entre vista `Lista` y vista `Grilla`; la grilla muestra cards con imagen, nombre, precio y descuento si aplica, y usa barra lateral de filtros. | Catalogo/articulos | Conversacion de redisenio |
| 2026-07-10 | Los items desplegables del sidebar deben mostrar chevron/indicador de abrir y cerrar a la derecha, manteniendo visible el estado abierto/cerrado. | App shell y sidebar navigation | Conversacion de redisenio |
| 2026-07-10 | El sidebar completo debe ser colapsable; en estado colapsado conserva iconos, tooltips, item activo, empresa/local compacta y usuario compacto. | App shell y sidebar navigation | Conversacion de redisenio |
| 2026-07-10 | Depositos usa el mismo patron de tabla dominante + drawer contextual + drawer de alta/edicion; no debe mostrar formulario persistente debajo de la grilla ni depender de doble click para centro de costo. | Stock/depositos | Conversacion de redisenio |
| 2026-07-10 | Consulta Rapida debe tener modo kiosco/autoservicio sin shell administrativo, con input siempre enfocado, resultado con precio protagonista y lista de precios bloqueada/preconfigurada. | Consulta rapida/autoservicio | Conversacion de redisenio |
| 2026-07-10 | Clientes usa tabla dominante + drawer contextual + drawer de alta guiada; `Alta Rapida` y `Nuevo` se unifican en `Crear cliente`. | Clientes | Conversacion de redisenio |
| 2026-07-10 | En Clientes, la identificacion fiscal e impuestos forman parte del alta minima porque impactan la facturacion; Consumidor Final puede conservar CUIT/CUIL/documento cargado. | Clientes | Conversacion de redisenio |
| 2026-07-10 | Proveedores usa tabla dominante + drawer contextual + drawer de alta guiada; `Rapida` y `Nuevo` se unifican en `Crear proveedor`. | Proveedores | Conversacion de redisenio |
| 2026-07-10 | En Proveedores, la identificacion fiscal, estado habilitado, configuracion contable, retenciones e impuestos deben tratarse como datos de riesgo porque impactan compras, pagos y registracion contable. | Proveedores | Conversacion de redisenio |
| 2026-07-10 | Facturacion Rapida debe estar gobernada por estado de caja: sin caja abierta, la venta/facturacion queda bloqueada y la accion principal es `Abrir caja`. | Facturacion rapida / POS | Conversacion de redisenio |
| 2026-07-10 | En POS, crear cliente, favoritos, retiros, rendiciones, cierre, cobro mixto y cambio de mercaderia son flujos contextuales que no deben sacar al cajero del ticket actual. | Facturacion rapida / POS | Conversacion de redisenio |
| 2026-07-10 | Los favoritos del POS se estandarizan como accesos rapidos compactos: hasta 6 visibles, cards mas chicas, nombre en hasta 2 renglones y precio visible, sin competir con el ticket. | Facturacion rapida / POS y flujos operativos con favoritos | Correccion posterior a prueba con builder |
| 2026-07-10 | En POS, `Cambio de mercaderia` y `Caja/Turno` deben ser acciones visibles de primer nivel; ingreso/retiro comparten un unico formulario de movimiento de caja y el resultado del cambio se calcula automaticamente. | Facturacion rapida / POS | Correccion posterior a prueba con builder |
| 2026-07-14 | El estado `Caja sin abrir` bloquea solamente el workspace operativo del POS; el sidebar y la navegacion general permanecen habilitados, sin blur y fuera del overlay de apertura. | Facturacion rapida / POS y app shell | Correccion visual posterior a prueba con builder |
| 2026-07-14 | En Facturacion Rapida, el estado fiscal ARCA vive en la barra superior junto al titulo de la vista y no se duplica en el right rail; `Cerrar caja` debe ser boton de ancho completo dentro del panel de caja/turno. | Facturacion rapida / POS | Correccion visual posterior a prueba con builder |
