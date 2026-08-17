# Product Architecture For Redesign

## Product Frame

InfoManager 5 es un producto operativo para comercios chicos y medianos. El redisenio debe priorizar velocidad, claridad y bajo costo de aprendizaje, sin romper reglas fiscales, stock, caja, hardware ni compatibilidad con el sistema legacy.

El producto no debe sentirse como una landing ni como un dashboard decorativo. Debe sentirse como una herramienta de trabajo densa, predecible y confiable.

## Core UX Model

El producto combina tres tipos de trabajo:

| Work Type | Description | UX Direction |
| --- | --- | --- |
| Operacion rapida | Vender, cobrar, facturar, consultar precio, resolver cliente esperando | Primer viewport critico, acciones claras, baja friccion |
| Mantenimiento administrativo | Crear y editar productos, clientes, proveedores, rubros, configuraciones | Listados densos, detalle contextual, edicion por secciones |
| Control y auditoria | Caja, stock, permisos, fiscalizacion, reportes, correcciones | Estados claros, trazabilidad, confirmaciones y recuperacion |

## Entity Groups

| Entity Group | Examples | Notes |
| --- | --- | --- |
| Comercial | Venta, Presupuesto, Cliente, Producto, Precio, Vendedor | Debe estar optimizado para operacion y consulta rapida. |
| Fiscal | Comprobante, ARCA, CAE, IVA, condicion fiscal | No esconder estados que cambian el resultado fiscal. |
| Stock | Producto, Deposito, Movimiento, Serie, Balanza, PLU | Acciones que afectan stock requieren motivo o trazabilidad. |
| Caja | Pago, Medio, Rendicion, Retiro, Diferencia | Requiere permisos y auditoria. |
| Administracion | Proveedor, Rubro, Subrubro, Caracteristica, Usuario | Debe convivir con flujos contextuales sin abrir ABM completos innecesarios. |

## Cross-Product Rules

- Organizar navegacion por areas de negocio y tareas reales; evitar `ABM` y subpantallas tecnicas como destinos principales.
- Agrupar variantes de documentos que comparten el mismo trabajo de consulta y creacion bajo un workspace contextual; compra/venta se resuelve por el area de entrada y el tipo exacto se mantiene como dato, filtro y configuracion del flujo.
- Separar documentos comerciales de movimientos de dinero: facturas, notas y remitos viven en `Documentos`; ordenes de pago, recibos y cobranzas viven en `Pagos`, `Cobros` o `Caja` segun corresponda.
- Separar busqueda/listado de edicion profunda.
- Usar drawer/sheet lateral bajo demanda para detalle contextual de un registro seleccionado; no reservar columna fija salvo que la vista declare explicitamente un split view.
- Usar vista completa o modo dedicado para configuraciones largas, riesgosas o multi-seccion.
- No mostrar formularios vacios persistentes debajo de cada grilla.
- No poner todas las acciones al mismo nivel visual.
- Mantener acciones destructivas o masivas en menus secundarios con confirmacion.
- Preservar terminos del negocio: articulo, producto, rubro, subrubro, cliente, venta, caja, rendicion, ARCA, stock, deposito, balanza, PLU.
- Traducir terminos tecnicos solo si no son lenguaje operativo real.
- Dentro de Catalogo, separar la configuracion reutilizable de etiquetas de la operacion de impresion: `Diseno de etiquetas` define la plantilla y `Impresion de etiquetas` prepara el lote y abre el dialogo del sistema.
- Tratar la cuenta corriente de clientes como una consulta de estado separada de `Cobros`: muestra saldo y movimientos, pero no registra recibos, imputa documentos ni modifica dinero.
- Tratar `Presupuestos` como una propuesta comercial editable separada de `Documentos`: crear o guardar no factura, no fiscaliza, no reserva stock y no afecta dinero ni cuenta corriente; cualquier conversion posterior es un flujo relacionado con reglas propias.

## Information Timing

Cada vista debe ordenar informacion en este orden:

1. Identidad del registro.
2. Datos necesarios para elegir o actuar.
3. Estado, riesgo o bloqueo.
4. Acciones frecuentes.
5. Configuracion secundaria.
6. Historial, auditoria y datos tecnicos.

## Open Product Questions

| Question | Risk |
| --- | --- |
| Que vistas ABM repiten el patron listado + formulario inferior | Permite definir un patron unico y evitar redisenios inconsistentes. |
| Que subpantallas legacy deben desaparecer de la navegacion principal | Evita duplicar capacidades dentro y fuera de los flujos reales. |
| Que acciones necesitan permisos finos por rol | Puede cambiar visibilidad, disabled states y confirmaciones. |
| Que flujos deben volver al origen con un registro seleccionado | Afecta drawers, modales, navegacion y breadcrumbs. |
| Cuales son los casos reales de uso en celular/tablet | Afecta si el detalle lateral pasa a pantalla completa o bottom sheet. |
