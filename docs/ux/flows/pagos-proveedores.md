# Flow: Pagos a proveedores

## Goal

- Flow ID: `pagos-proveedores`.
- User goal: consultar pagos existentes y registrar una orden de pago para un proveedor.
- Business outcome: salida de dinero identificada y trazable, separada del documento de compra que origina la deuda.
- Documentation status: `inferred`.
- Delivery status: `prototype-built`.
- Evidence: decisiones de arquitectura, contrato de vista y prototipo; imputación contable y bancaria pendientes.

## Primary Users

| Role | Job in this flow | Frequency | Pressure | Notes |
| --- | --- | --- | --- | --- |
| Administrativo / tesorería | Registrar y consultar pagos | Frecuente | Alta por movimiento de dinero | Permisos pendientes. |
| Encargado | Autorizar o controlar pagos | Variable | Alta | Circuito de aprobación no mapeado. |

## Current Legacy Flow

| Step | User goal | Legacy surface | Pain / friction | Step classification | Notes |
| --- | --- | --- | --- | --- | --- |
| Consultar obligación | Saber qué pagar | Compras/documentos/cuenta | Flujo completo no relevado | essential decision | Evidencia insuficiente. |
| Registrar pago | Cancelar deuda | Orden de pago legacy | Efectos y validaciones desconocidos | irreversible | No inferir reglas. |

## Target Modern Flow

| Step | Modern behavior | Surface | User decision | Validation / recovery | Notes |
| --- | --- | --- | --- | --- | --- |
| Consultar | Buscar y filtrar órdenes de pago | `Compras > Pagos` | Elegir período/estado/proveedor | Vacío permite limpiar filtros | Lista compartida visualmente con Cobros. |
| Ver detalle | Revisar contraparte, importes y estado | Drawer | Elegir acción autorizada | Solo lectura por defecto | Auditoría secundaria. |
| Crear borrador | Elegir proveedor, fecha, medio, importe y referencia | Drawer/formulario | Definir pago | Validaciones básicas; no ejecutar integración | Prototipo simulado. |
| Confirmar | Registrar orden de pago | Finalización explícita | Confirmar movimiento | Bloquear doble envío y conservar error | Reglas reales pendientes. |

## Screens / Surfaces

| Surface | Legacy source | Modern destination | Pattern | Status |
| --- | --- | --- | --- | --- |
| Pagos | Sin captura completa | `MoneyTransactionsWorkspace(context=payment)` | list-detail workspace | prototype-built |

## Entry Points

- `Compras > Pagos`.
- Proveedor, factura de compra o dashboard, cuando se confirme navegación contextual.

## Exit Points

- Orden de pago registrada.
- Regreso al proveedor/documento de origen.

## Blocking Dependencies

| Dependency | Type | Blocking? | Current status | Notes |
| --- | --- | --- | --- | --- |
| Deuda e imputación | data | yes | not mapped | Cuenta corriente de proveedor pendiente. |
| Medios/cuentas financieras | entity | yes | mock | Integración bancaria no definida. |
| Autorización | permission | yes | not mapped | Puede requerir aprobación. |

## Data And Rules

- Core entities: Orden de pago, Proveedor, Documento, Medio, Cuenta financiera.
- Required data: proveedor, fecha, importe y medio; imputaciones reales pendientes.
- Visible business rules: Pagos no pertenece a Documentos y no debe presentarse como efecto simulado definitivo.
- Recovery behavior: conservar borrador ante error y evitar duplicados.

## UX Decisions

| Decision | Rationale | Confirmation |
| --- | --- | --- |
| Mantener Pagos dentro de Compras | Conserva contexto comercial | user-confirmed |
| Reutilizar estructura visual de Cobros | Reduce duplicación de interfaz | user-confirmed |
| Separar reglas de negocio de Cobros | La dirección del dinero y contraparte cambian | document-inferred |

## Open Questions

| Question | Risk if unresolved | Blocking? |
| --- | --- | --- |
| ¿Cómo se imputan facturas, anticipos, retenciones y diferencias? | Saldo incorrecto | yes |
| ¿Qué medios, cuentas y aprobaciones existen? | Movimiento no autorizado | yes |
| ¿Se permite editar, anular o revertir un pago confirmado? | Riesgo contable | yes |

## Views To Build

| View ID | Purpose | Handoff path | Destination | Status |
| --- | --- | --- | --- | --- |
| pagos | Consultar y registrar órdenes de pago | `docs/product-redesign/views/pagos-y-cobros.md` | `money-transactions-workspace.tsx` | prototype-built |
