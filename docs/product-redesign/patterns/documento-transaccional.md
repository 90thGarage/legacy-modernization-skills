# Pattern: Documento Transaccional

## Metadata

- Pattern ID: `documento-transaccional`
- Status: draft
- First reference view: Nota de credito como ejemplo estructural
- Related patterns: `fiscal-state-and-recovery`, `audit-aware-correction`

## Purpose

Estandarizar documentos que registran una operacion de negocio con cabecera, partes, items, importes, estado y trazabilidad. Ejemplos posibles: facturas, notas de credito/debito, pedidos, compras, remitos y ajustes.

No es un reporte: el documento modifica o representa estado operativo, fiscal, contable, stock o dinero. Cada tipo debe declarar sus efectos reales.

## Stable Contract

### Layout

1. Header informativo con tipo, numero/estado, fecha y referencia; no concentra la finalizacion antes del formulario.
2. Contexto de partes y documento de origen.
3. Entrada y tabla de items como region principal a ancho completo, con busqueda/carga directamente encima.
4. Subtotal, impuestos y descuentos cierran la tabla a la que pertenecen; no se separan en una tarjeta lateral de resumen.
5. Informacion secundaria y motivo continuan a ancho completo.
6. Barra inferior sticky, ultima en orden visual y DOM, con total, estado de validacion, siguiente paso y accion de finalizacion.

### Information Hierarchy

- Siempre visible: tipo, estado, contraparte, items, total, moneda, validaciones bloqueantes y accion primaria.
- Contextual: condiciones comerciales, impuestos detallados y documento relacionado.
- Secundario: auditoria, integraciones, notas internas e historial de eventos.

### Actions

- Guardar borrador cuando el negocio lo permita.
- Validar antes de confirmar, emitir o contabilizar.
- La accion irreversible nombra el efecto real: `Emitir nota de credito`, `Confirmar compra`, etc.
- La accion de finalizacion aparece despues de los datos que debe revisar; si permanece visible, lo hace desde una barra inferior sticky.
- Anular, revertir o reintentar dependen de estado, permisos y reglas del documento.
- Exportar/imprimir no cambia el estado del documento.

### Navigation And Return

Si nace desde otro documento, conserva referencia y permite volver al origen. Tras confirmar, presenta el resultado, numero/estado y siguientes acciones sin perder trazabilidad.

### Collection And Creation Entry

- Cuando factura, nota de credito/debito y remito comparten el mismo trabajo de consulta, pueden vivir en un unico workspace contextual con `Tipo` como columna y filtro.
- El contexto de negocio conocido, como compra o venta, debe heredarse de la navegacion o del documento de origen; no se vuelve a preguntar en el formulario.
- Un CTA `Nuevo documento` puede exponer los tipos habilitados sin convertir cada tipo en una vista permanente.
- Si una correccion nace de una factura, la accion contextual sobre esa factura es el camino preferido y debe precargar origen, contraparte e informacion compatible.
- Compartir shell y componentes no habilita a compartir reglas sin validacion: estados, campos, calculos y efectos siguen perteneciendo a cada documento.

## Required States

- Nuevo y borrador.
- Validando y con errores por campo/item.
- Listo para confirmar.
- Confirmando o emitiendo.
- Confirmado/emitido.
- Parcial, rechazado o pendiente de integracion cuando aplique.
- Anulado/revertido.
- Solo lectura por estado o permiso.
- Cambios sin guardar.

## Required Decisions Per View

Cada adopcion debe definir estados formales, efectos en stock/dinero/fiscal/contabilidad, numeracion, documento origen, items permitidos, calculos, permisos, irreversibilidad, recuperacion y auditoria.

## Allowed Variations

- Documento sin items para movimientos conceptuales.
- Wizard cuando la seleccion del origen precede obligatoriamente a la carga.
- Panel de pagos, percepciones o distribuciones como seccion especializada.
- Vista compacta de solo lectura para consulta posterior.

## Not Allowed

- Llamarlo reporte si crea o cambia una operacion.
- Ocultar total, estado o validacion bloqueante fuera del primer viewport operativo.
- Colocar la unica accion de finalizacion en el header, antes del formulario.
- Mantener una columna lateral vacia mientras el formulario continua en una columna mas angosta.
- Separar los importes derivados de los items en una tarjeta lateral si pueden cerrar naturalmente la tabla.
- Usar `Guardar` para una accion fiscal o irreversible.
- Permitir editar un documento emitido sin una accion formal de correccion.
- Inventar estados genericos cuando existen estados fiscales o contables especificos.

## Responsive Contract

En mobile, items y resumen deben seguir accesibles sin perder la accion primaria. Totales y bloqueos usan barra o panel sticky; detalles secundarios se colapsan.

## Builder Contract

Componer `TransactionHeader`, `PartySummary`, `DocumentReference`, `LineItemEditor`, `TransactionTotals`, `ValidationSummary` y `StateTimeline`. Los calculos y transiciones se reciben del dominio; la UI no los inventa.

## Adoption

| View / flow | Variation | Status | Evidence |
| --- | --- | --- | --- |
| Nota de credito | Ejemplo inicial; reglas fiscales pendientes | candidate | Conversacion actual |
| Factura completa | Comprobante fiscal con pagos/cuenta corriente | candidate | `docs/ux/product-context.md` |
| Presupuesto de venta | Propuesta comercial editable; crear/guardar no ejecuta efectos fiscales, de stock, dinero o cuenta corriente | draft | `docs/product-redesign/views/presupuestos.md` |
| Documentos de compra y venta | Listado contextual + entrada unificada + formulario adaptable | draft | `docs/product-redesign/views/documentos-comerciales.md` |

## Open Questions

| Question | Affected adopters | Blocking? |
| --- | --- | --- |
| Estados, efectos y recuperacion exactos de cada comprobante | Facturas y notas | si antes de implementar un flujo real |
