# Flow: Factura pendiente por ARCA

## Goal

- Flow ID: `factura-pendiente-arca`
- User goal: entender y resolver una venta que no pudo enviarse a ARCA en el momento.
- Business outcome: no perder la venta y completar fiscalizacion posterior cuando sea posible.
- Documentation status: `partially-confirmed`.
- Delivery status: `prototype-partial`.
- Evidence: `demo-confirmed` for fallback behavior; `open-question` for queue/retry operations.

## Primary Users

| Role | Job in this flow | Frequency | Pressure | Notes |
| --- | --- | --- | --- | --- |
| Cajero | Saber que la venta quedo pendiente y que comprobante puede entregar | needs-user-validation | Alta cuando falla en caja | No debe creer que tiene CAE si no lo tiene. |
| Administrador / encargado | Revisar pendientes y reintentar o corregir | open-question | Media | Quien reintenta no fue confirmado. |

## Current Legacy Flow

| Step | User goal | Legacy surface | Pain / friction | Step classification | Notes |
| --- | --- | --- | --- | --- | --- |
| Intentar factura electronica | Enviar a ARCA | Cobro/fiscalizacion | Puede fallar conexion, certificado o licencia | compliance-fiscal | Necesita certificado/licencia. |
| Registrar internamente | No perder venta | Fallback interno | Comprobante sin numero/CAE/vencimiento | recovery | Queda pendiente en lote. |
| Resolver pendiente | Enviar luego | Lote/pendientes | No se cubrio donde se ve ni quien reintenta | open-question | Pregunta prioritaria. |

## Target Modern Flow

| Step | Modern behavior | Surface | User decision | Validation / recovery | Notes |
| --- | --- | --- | --- | --- | --- |
| Error fiscal claro | Mostrar motivo y consecuencia | Fiscal error state | Aceptar pendiente / reintentar si aplica | Conexion, certificado, licencia | No perder venta. |
| Comprobante interno | Mostrar que no tiene CAE/numero fiscal | Comprobante/print state | Imprimir o enviar comprobante interno | Mensaje claro al cliente | Evitar confusion fiscal. |
| Cola de pendientes | Listar pendientes, estado y acciones | Pendientes ARCA | Reintentar, revisar, resolver | Permisos y errores | No cubierto en demo. |

## Screens / Surfaces

| Surface | Legacy source | Modern destination | Pattern | Status |
| --- | --- | --- | --- | --- |
| Error ARCA en cobro | Demo IM5 | Fiscal state and recovery | dialog / panel | prototype-built |
| Lote de pendientes | Mencionado | Pendientes fiscales | route / list | not-planned |

## Entry Points

- Falla de conexion ARCA.
- Certificado vencido.
- Licencia o configuracion fiscal incorrecta.

## Exit Points

- Venta interna pendiente.
- Reintento exitoso con CAE.
- Pendiente sigue abierto con error accionable.

## Blocking Dependencies

| Dependency | Type | Blocking? | Current status | Notes |
| --- | --- | --- | --- | --- |
| Ubicacion de pendientes | flow | yes | open | Donde se ve y quien opera. |
| Acciones permitidas sobre pendiente | permission | yes | open | Reintentar, cancelar, editar, imprimir. |
| Estados exactos y mensajes | data | yes | partial | Inferidos desde demo. |

## Data And Rules

- Core entities: Venta, Comprobante pendiente, ARCA, Usuario.
- Required data: error, estado, fecha, cliente, total, intentos.
- Optional data: detalle tecnico, certificado/licencia.
- Derived data: prioridad, accion recomendada.
- Visible business rules: ticket sin CAE no debe parecer factura electronica emitida.
- Validation rules: no marcar emitido sin CAE/numero/vencimiento.
- Recovery behavior: reintentar cuando ARCA/configuracion este disponible.

## UX Decisions

| Decision | Rationale | Confirmation |
| --- | --- | --- |
| Estado pendiente debe ser visible y accionable | Evita que ventas queden sin fiscalizar | demo-inferred |
| Comprobante impreso sin CAE debe distinguirse | Riesgo fiscal y comunicacion al cliente | demo-confirmed |

## Open Questions

| Question | Risk if unresolved | Blocking? |
| --- | --- | --- |
| Donde se ve el lote de pendientes | Flujo incompleto | yes |
| Quien puede reintentar o corregir | Permisos incorrectos | yes |
| Que errores son recuperables por cajero vs admin | Mensajes accionables incorrectos | yes |

## Evidence

| Claim | Source | Confidence |
| --- | --- | --- |
| Si falla ARCA se factura internamente y queda pendiente en lote | minuta tecnica 2026-07-08 | demo-confirmed |
| Ticket pendiente no tiene numero de factura, CAE ni vencimiento | minuta tecnica 2026-07-08 | demo-confirmed |
| Falta saber donde se ve y quien reintenta | cobertura guia 2026-07-08 | open-question |

## Views To Build

| View ID | Purpose | Handoff path | Destination | Status |
| --- | --- | --- | --- | --- |
| factura-pendiente-arca | Estado pendiente dentro del POS | `docs/product-redesign/views/facturacion-rapida-pos.md` | `pos-workspace.tsx` | prototype-built |
| pendientes-arca | Consultar y reintentar pendientes |  |  | not-planned |
