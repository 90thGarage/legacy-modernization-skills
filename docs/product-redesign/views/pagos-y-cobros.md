# View: Pagos y Cobros

## Metadata

- View ID: `pagos-y-cobros`
- Product area: Compras / Ventas / Caja
- Status: draft
- Source material:
  - Conversacion de redisenio del 2026-07-22.
  - Captura legacy de `Ordenes de Pago` provista el 2026-07-22.
- Related patterns:
  - `../patterns/list-detail-workspace.md`
  - `../patterns/search-filter-bar.md`
  - `../patterns/sidebar-navigation.md`
  - `./documentos-comerciales.md`

## Product Job

- En `Compras > Pagos`, consultar y crear ordenes de pago a proveedores.
- En `Ventas > Cobros`, consultar y crear recibos asociados a clientes/cobranzas.
- Encontrar una operacion por numero, contraparte o periodo sin navegar pantallas tecnicas separadas.
- Consultar detalle y auditoria sin convertirlos en columnas permanentes de la grilla.

## Scope And Separation

Pagos y Cobros comparten estructura de experiencia y componentes, pero no representan el mismo tipo de registro.

| Context | Collection | Primary action | Counterparty |
| --- | --- | --- | --- |
| `payment` | Ordenes de pago | `Nueva orden de pago` | Proveedor |
| `receipt` | Recibos | `Nuevo recibo` | Cliente |

Reglas:

- `Compras > Pagos` no muestra facturas, notas ni remitos como tipos del listado. Puede relacionarlos desde el detalle o alta cuando la regla real lo permita.
- `Ventas > Cobros` es una lista de recibos; no se presenta como una coleccion generica de documentos comerciales.
- Pagos y cobros permanecen fuera de `Documentos` porque representan movimiento de dinero.
- `Facturacion rapida / POS` conserva su flujo de cobro operativo. Los recibos administrativos se consultan desde `Ventas > Cobros`.
- La reutilizacion es visual y estructural; no implica asumir que ordenes de pago y recibos tienen iguales permisos, imputaciones, medios o efectos contables.

## Layout Contract

### Header

- Titulo `Ordenes de pago` o `Recibos`.
- CTA unico `Nueva orden de pago` o `Nuevo recibo`.
- Conteo de resultados y marca de datos simulados en el prototipo.

### Search And Filters

Aplicar la variante de una sola fila de `../patterns/search-filter-bar.md`: busqueda flexible por numero, proveedor/cliente o identificacion fiscal a la izquierda y grupo compacto de filtros a la derecha.

Cada filtro conserva ancho de contenido y nunca usa el espacio libre para ensancharse. La busqueda ocupa el espacio restante. Titulo/CTA, busqueda, filtros y tabla comparten un unico bloque visual, el mismo fondo y gutter horizontal, sin divisor entre filtros y resultados.

Filtros siempre visibles:

- Periodo resumido en un unico control, por ejemplo `Periodo: 30 d`.
- estado;
- punto de venta, caja o empresa cuando corresponda;
- medio, si existe en el contrato real;
- incluir anulados.

No mostrar titulos individuales encima de los controles. El texto visible identifica el criterio y cada control conserva nombre accesible. No usar `Mas filtros`, popover, drawer o modal. Todos los criterios disponibles se muestran en la segunda fila compacta y se aplican al instante.

### Primary List

Tabla densa full-width:

- Fecha.
- Numero.
- Proveedor o cliente.
- Total.
- Detalle o concepto breve.
- Estado.
- Documento relacionado, si aporta reconocimiento.
- Acciones.

Usuario, fecha y hora de auditoria viven en el detalle, no en columnas principales.

### Detail

Click en una fila abre drawer lateral con:

- tipo, numero y estado;
- contraparte e identificacion fiscal;
- fecha, total y moneda;
- detalle/concepto;
- documentos relacionados o aplicados;
- medios representados cuando exista contrato real;
- auditoria como seccion secundaria;
- acciones permitidas por estado y rol.

## Creation Flow

El CTA abre una superficie de alta reutilizable configurada mediante:

```ts
context: "payment" | "receipt"
```

Estructura base:

1. Tipo y contexto heredados de la navegacion.
2. Fecha.
3. Proveedor o cliente.
4. Importe total.
5. Detalle/concepto.
6. Documentos a aplicar, si corresponde.
7. Medios de pago/cobro, si corresponde.
8. Observaciones.
9. Resumen e impacto.
10. CTA explicito `Crear orden de pago` o `Crear recibo`.

Progressive disclosure:

- No preguntar compra/venta dentro del formulario.
- No mostrar simultaneamente campos exclusivos de ordenes de pago y recibos.
- No inventar imputaciones, retenciones, medios, permisos ni asientos contables.
- Las secciones sin contrato validado se muestran como placeholder identificado en el prototipo.
- La simulacion puede crear un registro `Borrador · demo`; no representa movimiento de dinero real.

## States

- Loading: skeleton de tabla conservando header y filtros.
- Loaded: resultados del contexto actual.
- Empty without data: explicar que todavia no existen ordenes/recibos y ofrecer el CTA de alta.
- Empty by filters: ofrecer limpiar filtros sin sugerir una creacion.
- Detail open: drawer sin abandonar el listado.
- Creating: alta contextualizada como orden de pago o recibo.
- Created in prototype: agregar un `Borrador · demo` a la lista y abrir su detalle.
- Annulled: solo lectura; motivo y auditoria quedan en detalle.

## Builder Contract

- Componente reutilizable: `MoneyTransactionsWorkspace`.
- Configuracion: `context: payment | receipt`.
- Componentes: header, barra visible de filtros, tabla, detail sheet y creation sheet.
- Datos minimos: id, contexto, fecha, numero, contraparte, identificacion fiscal, total, moneda, detalle, estado, documento relacionado y auditoria.
- Debe reutilizar tokens, densidad, controles de formulario, tabla y sheets existentes.
- Debe evitar placeholders de pantalla completa cuando el contrato base de listado y creacion ya esta definido.

## Prototype Acceptance

1. `Compras > Pagos` muestra una lista de ordenes de pago y `Nueva orden de pago`.
2. `Ventas > Cobros` muestra una lista de recibos y `Nuevo recibo`.
3. Ambos contextos usan la misma estructura sin selector compra/venta.
4. Busqueda, periodo y filtros actualizan la misma tabla.
5. Todos los filtros son visibles y no abren superficies secundarias.
6. Seleccionar una fila abre detalle y mantiene el listado.
7. El alta simulada agrega un borrador identificable sin ejecutar dinero real.
8. Facturas, notas y remitos no aparecen como tipos de Pago/Cobro.

## Open Domain Questions

- Estados reales y transiciones de ordenes de pago y recibos.
- Reglas de aplicacion total/parcial a comprobantes.
- Medios de pago/cobro habilitados y combinaciones mixtas.
- Retenciones, percepciones, diferencias de cambio y efectos contables.
- Permisos para confirmar, anular, imprimir o reabrir.
- Relacion exacta entre recibos administrativos y cobros originados en POS.
