# Flow: Cambios de producto

## Goal

- Flow ID: `cambios-producto`
- User goal: resolver cambios simples de mostrador sin generar notas de credito innecesarias.
- Business outcome: stock ajustado y diferencia cobrada/devuelta cuando corresponde.
- Documentation status: `partially-confirmed`.
- Delivery status: `prototype-built`.
- Evidence: `demo-confirmed` for high-level cases; `needs-user-validation` for frequency and real exceptions.

## Primary Users

| Role | Job in this flow | Frequency | Pressure | Notes |
| --- | --- | --- | --- | --- |
| Cajero / mostrador | Registrar cambio simple y diferencia | needs-user-validation | Media/alta con cliente esperando | Caso de mostrador. |
| Encargado / administrador | Autorizar o resolver casos mayores | demo-inferred | Variable | Nota de credito puede corresponder en operaciones mayores. |

## Current Legacy Flow

| Step | User goal | Legacy surface | Pain / friction | Step classification | Notes |
| --- | --- | --- | --- | --- | --- |
| Elegir producto devuelto | Identificar lo que vuelve | Flujo de cambio | No se cubrio busqueda/validacion real | essential decision | Producto roto, abierto, talle/color. |
| Elegir producto nuevo | Identificar reemplazo | Flujo de cambio | No se cubrio si requiere venta original | essential decision | Compara precios. |
| Comparar precios | Saber diferencia | Sistema calcula | Reglas exactas pendiente | useful confirmation | Igual, mas caro, mas barato. |
| Ajustar stock | Reflejar devolucion/salida | Stock | Riesgo de inventario | risky | Afecta stock. |
| Cobrar/devolver diferencia | Cerrar cambio | Caja/venta | Recibo negativo si mas barato | risky | No reemplaza nota de credito en casos mayores. |

## Target Modern Flow

| Step | Modern behavior | Surface | User decision | Validation / recovery | Notes |
| --- | --- | --- | --- | --- | --- |
| Iniciar cambio | Seleccionar producto devuelto y motivo/contexto si aplica | Cambio main | Producto correcto | Producto no encontrado, permiso | Requiere validar necesidad de venta original. |
| Seleccionar reemplazo | Elegir producto que lleva | Cambio main | Producto/cantidad | Stock/precio | Comparacion clara. |
| Resolver diferencia | Mostrar mismo precio, cobrar o devolver | Resumen diferencia | Confirmar accion | Medio de pago/caja | Casos mayores a nota de credito. |
| Confirmar | Ajustar stock y registrar caja | Confirmacion | Confirmar cambio | Auditoria y permisos | No perder trazabilidad. |

## Screens / Surfaces

| Surface | Legacy source | Modern destination | Pattern | Status |
| --- | --- | --- | --- | --- |
| Flujo de cambio | Demo IM5 | Cambio simple de mostrador | main view / dialog | prototype-built |
| Cobro/devolucion diferencia | Demo IM5 | Cobro asociado | panel | prototype-simulated |

## Entry Points

- Acceso lateral desde facturacion/POS.
- Cliente vuelve con producto para cambio.

## Exit Points

- Cambio cerrado sin diferencia.
- Factura/cobro por diferencia.
- Recibo negativo/salida de efectivo.
- Escalar a nota de credito/nueva factura/saldo a favor.

## Blocking Dependencies

| Dependency | Type | Blocking? | Current status | Notes |
| --- | --- | --- | --- | --- |
| Cuando corresponde nota de credito vs cambio simple | business rule | yes | partial | Depende de monto/operacion/rubro. |
| Permisos para cambio/devolucion | permission | yes | open | No detallado. |
| Relacion con venta original | data | no | open | No cubierto. |

## Data And Rules

- Core entities: Producto devuelto, Producto nuevo, Stock, Pago/Caja, Venta/Comprobante.
- Required data: producto devuelto, producto nuevo, precio de ambos.
- Optional data: venta original, motivo, cliente.
- Derived data: diferencia a cobrar/devolver.
- Visible business rules: mismo precio solo mueve stock; nuevo mas caro cobra diferencia; nuevo mas barato genera salida/recibo negativo.
- Validation rules: permisos, stock, casos mayores.
- Recovery behavior: cancelar sin afectar stock/caja hasta confirmar.

## UX Decisions

| Decision | Rationale | Confirmation |
| --- | --- | --- |
| Mantener este flujo acotado a cambios simples | Casos mayores requieren nota de credito u otro tratamiento | demo-confirmed |
| Mostrar diferencia antes de confirmar | Evita errores de caja/stock | demo-inferred |

## Open Questions

| Question | Risk if unresolved | Blocking? |
| --- | --- | --- |
| Cuando exactamente se debe usar nota de credito | Flujo podria violar regla fiscal/comercial | yes |
| Se exige venta original o comprobante | Trazabilidad incompleta | no |
| Que permisos autorizan devolucion de efectivo | Riesgo de caja | yes |

## Evidence

| Claim | Source | Confidence |
| --- | --- | --- |
| Cambio compara precios y ajusta stock | minuta tecnica 2026-07-08 | demo-confirmed |
| No reemplaza casos mayores con nota de credito | minuta tecnica 2026-07-08 | demo-confirmed |
| Falta incidente real y frecuencia | cobertura guia 2026-07-08 | needs-user-validation |

## Views To Build

| View ID | Purpose | Handoff path | Destination | Status |
| --- | --- | --- | --- | --- |
| cambios-producto | Cambio simple de mostrador | `docs/product-redesign/views/facturacion-rapida-pos.md` | `pos-workspace.tsx` | prototype-built |
