# Flow: Cobros a clientes

## Goal

- Flow ID: `cobros-clientes`.
- User goal: consultar recibos existentes y registrar un cobro para un cliente.
- Business outcome: entrada de dinero identificada y trazable, separada de la consulta de cuenta corriente y de los documentos de venta.
- Documentation status: `inferred`.
- Delivery status: `prototype-built`.
- Evidence: decisiones de arquitectura, contrato de vista y prototipo; imputación y efectos reales pendientes.

## Primary Users

| Role | Job in this flow | Frequency | Pressure | Notes |
| --- | --- | --- | --- | --- |
| Cajero / administrativo | Registrar y consultar cobros | Frecuente | Alta por movimiento de dinero | Distinto del cobro inmediato del POS. |
| Encargado | Controlar o corregir recibos | Variable | Alta | Permisos pendientes. |

## Current Legacy Flow

| Step | User goal | Legacy surface | Pain / friction | Step classification | Notes |
| --- | --- | --- | --- | --- | --- |
| Consultar saldo | Saber cuánto cobrar | Cuenta corriente/documentos | Alcance de IM5 no relevado | essential decision | Evidencia parcial. |
| Registrar recibo | Aplicar ingreso | Recibo legacy | Imputación y correcciones desconocidas | irreversible | No inferir reglas. |

## Target Modern Flow

| Step | Modern behavior | Surface | User decision | Validation / recovery | Notes |
| --- | --- | --- | --- | --- | --- |
| Consultar | Buscar y filtrar recibos | `Ventas > Cobros` | Elegir período/estado/cliente | Vacío permite limpiar filtros | Flujo independiente. |
| Ver detalle | Revisar cliente, importes y estado | Drawer | Elegir acción autorizada | Solo lectura por defecto | Auditoría secundaria. |
| Crear borrador | Elegir cliente, fecha, medio, importe y referencia | Drawer/formulario | Definir cobro | Validaciones básicas | Prototipo simulado. |
| Confirmar | Registrar recibo | Finalización explícita | Confirmar movimiento | Bloquear doble envío y conservar error | Efectos reales pendientes. |

## Screens / Surfaces

| Surface | Legacy source | Modern destination | Pattern | Status |
| --- | --- | --- | --- | --- |
| Cobros | Sin captura completa | `MoneyTransactionsWorkspace(context=receipt)` | list-detail workspace | prototype-built |

## Entry Points

- `Ventas > Cobros`.
- Cliente, cuenta corriente, factura o dashboard, cuando se confirme navegación contextual.

## Exit Points

- Recibo registrado.
- Regreso al cliente, cuenta o documento de origen.

## Blocking Dependencies

| Dependency | Type | Blocking? | Current status | Notes |
| --- | --- | --- | --- | --- |
| Cuenta corriente e imputación | data | yes | partial | Consulta existe; modificación no. |
| Medios/cuentas financieras | entity | yes | mock | Efectos reales pendientes. |
| Autorización y auditoría | permission | yes | not mapped | Correcciones sensibles. |

## Data And Rules

- Core entities: Recibo, Cliente, Documento, Medio, Cuenta corriente.
- Required data: cliente, fecha, importe y medio; imputaciones reales pendientes.
- Visible business rules: Cuenta corriente consulta saldo; Cobros registra dinero; Documentos conserva comprobantes.
- Recovery behavior: conservar borrador ante error y evitar recibos duplicados.

## UX Decisions

| Decision | Rationale | Confirmation |
| --- | --- | --- |
| Mantener Cobros dentro de Ventas | Conserva contexto comercial | user-confirmed |
| No registrar cobros desde Cuenta corriente | Separa lectura de movimiento de dinero | user-confirmed |
| Reutilizar estructura visual de Pagos | Mantiene coherencia sin igualar dominio | user-confirmed |

## Open Questions

| Question | Risk if unresolved | Blocking? |
| --- | --- | --- |
| ¿Cómo se imputan facturas, anticipos, parciales y diferencias? | Saldo incorrecto | yes |
| ¿Qué medios y estados reales tiene un recibo? | Movimiento ambiguo | yes |
| ¿Cómo se anula o corrige un cobro confirmado? | Riesgo contable y de auditoría | yes |

## Views To Build

| View ID | Purpose | Handoff path | Destination | Status |
| --- | --- | --- | --- | --- |
| cobros | Consultar y registrar recibos | `docs/product-redesign/views/pagos-y-cobros.md` | `money-transactions-workspace.tsx` | prototype-built |
