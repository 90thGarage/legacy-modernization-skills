# Presupuestos — notas de implementación del prototipo

## Alcance implementado

- Nuevo destino `Ventas > Presupuestos` dentro del shell existente.
- Listado dominante con búsqueda por número, cliente o CUIT.
- Filtros siempre visibles para período e inclusión de anulados.
- Detalle de lectura en drawer lateral al seleccionar una fila.
- Alta y edición en un Sheet transaccional ancho sobre el listado, consistente con Documentos, Pagos y Cobros.
- Búsqueda de artículos junto a la tabla y totales unidos al bloque de ítems.
- Confirmación únicamente al abandonar cambios sin guardar.
- Acciones de persistencia explícitas: `Crear presupuesto` y `Guardar cambios`.

## Componentes y decisiones visuales

- Se reutiliza el shell, la navegación, la tabla, los campos y los tokens actuales del prototipo.
- Los selectores de fecha usan el Date Picker de shadcn compuesto por `Popover`, `Calendar` y `Button`; no se usan fechas nativas del navegador.
- Los datos técnicos, relaciones, auditoría, entrega y observaciones tienen jerarquía secundaria mediante divulgación progresiva.
- En tablet se preservan cliente, cantidad, precio e importe; las columnas de detalle tributario se ocultan antes de forzar una tabla ilegible.
- La barra inferior del editor conserva a la vista el total y la acción de guardado sin separar el contenido en tarjetas laterales.
- El listado permanece detrás del overlay como contexto de origen; alta y edición no crean una pestaña ni cambian el destino activo del shell.
- El listado reutiliza el contrato visual de tablas de Documentos, Pagos y Cobros: sin card exterior, gutter uniforme, tabla con borde propio, encabezado mono compacto y columna de acciones sticky.
- Como Presupuestos no tiene Tabs y solo expone dos filtros secundarios, búsqueda, período y anulados comparten una única fila compacta.

## Datos simulados y placeholders

- Los presupuestos, clientes, artículos, vigencias y relaciones son datos simulados locales.
- Guardar modifica únicamente el estado local del prototipo; no existe integración con backend.
- Crear o guardar no factura, no reserva stock, no mueve cuenta corriente y no produce efectos fiscales.
- La vigencia se muestra como un valor descriptivo de demostración; no se modeló un ciclo de estados no validado.
- El cálculo interactivo de totales usa una aproximación de demostración con IVA 21 %. No representa una regla fiscal ni comercial definitiva.
- Los descuentos del detalle de artículo se preservan como valores de interfaz, pero su aplicación fiscal y comercial queda pendiente de validación.
- Percepciones, vencimientos, trazabilidad, balanza y relaciones con documentos posteriores permanecen como placeholders explícitos.
- El requisito de contar con uno o más artículos antes de crear un presupuesto no se fuerza porque esa regla todavía no fue validada; el cliente sí es requerido para la demostración.

## Verificación

- `npm run lint`: correcto.
- `npm run build`: correcto.
- Recorrido automatizado en navegador: listado, apertura del Sheet de alta/edición sobre la tabla, cierre, datos cargados, acción sticky y adaptación a 1024 × 768; correcto.
