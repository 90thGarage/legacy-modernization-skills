# Flow: Cobro y fiscalizacion

## Goal

- Flow ID: `cobro-y-fiscalizacion`
- User goal: cobrar una venta por uno o mas medios y fiscalizarla cuando corresponde.
- Business outcome: pago registrado, comprobante correcto y estado fiscal/comercial claro.
- Documentation status: `partially-confirmed`.
- Delivery status: `prototype-built`.
- Evidence: `demo-confirmed` for payment options; `open-question` for exact validations and states.

## Primary Users

| Role | Job in this flow | Frequency | Pressure | Notes |
| --- | --- | --- | --- | --- |
| Cajero | Elegir medio, confirmar importe, entregar comprobante | needs-user-validation | Alta | Debe entender si quedo fiscalizado o pendiente. |
| Administrador | Configurar medios, formatos, certificados y licencia | demo-confirmed | Variable | Define condiciones para operar. |

## Current Legacy Flow

| Step | User goal | Legacy surface | Pain / friction | Step classification | Notes |
| --- | --- | --- | --- | --- | --- |
| Elegir efectivo | Registrar venta interna o factura electronica en efectivo | Accion efectivo | Puede ser informal o fiscal segun eleccion | essential decision / fiscal | Debe ser claro. |
| Multipago | Combinar efectivo y otro medio | Cobro | Vuelto/pago parcial no detallado | useful confirmation | Soportado. |
| Tarjeta | Elegir credito/debito y plan/tipo | Cobro tarjeta | Detalle de validaciones pendiente | essential decision | Puede ir con factura electronica. |
| Transferencia | Elegir banco/billetera virtual | Cobro transferencia | Parametros pendientes | essential decision | Soportado. |
| Mercado Pago | Esperar confirmacion | Integracion MP | La venta cierra recien al confirmar | integration-gated | QR/link/posnet. |
| Factura electronica | Enviar a ARCA | ARCA | Fallas generan pendiente | compliance-fiscal | Certificado/licencia requeridos. |

## Target Modern Flow

| Step | Modern behavior | Surface | User decision | Validation / recovery | Notes |
| --- | --- | --- | --- | --- | --- |
| Ver total y opciones | Mostrar medios disponibles, fiscalizacion y cliente | Panel de cobro | Medio(s) de pago | Medio no configurado, permisos | No ocultar si es venta informal/fiscal. |
| Registrar pagos | Permitir monto parcial o combinado | Cobro multipago | Importes por medio | Total incompleto/excedente, vuelto | Reglas exactas pendientes. |
| Confirmar fiscalizacion | Mostrar si se emite factura electronica o venta interna | Fiscal state | Confirmar impacto | ARCA/certificado/licencia | Deriva a pendiente si falla. |
| Entregar comprobante | Imprimir/PDF/WhatsApp/captura | Comprobante | Salida deseada | Impresora/configuracion | Formato predeterminado por usuario/base. |

## Screens / Surfaces

| Surface | Legacy source | Modern destination | Pattern | Status |
| --- | --- | --- | --- | --- |
| Acciones de cobro POS | Demo IM5 | Cobro unificado | panel / drawer | prototype-built |
| Mercado Pago | Demo IM5 | Estado de pago externo | dialog / panel | prototype-simulated |
| Factura electronica | Demo IM5 | Fiscal state and recovery | panel | prototype-simulated |
| Impresion/comprobante | Demo IM5 | Delivery options | dialog / panel | prototype-simulated |

## Entry Points

- Desde POS con venta cargada.
- Desde efectivo cuando el cliente requiere factura electronica.
- Desde tarjeta/transferencia/Mercado Pago segun medio elegido.

## Exit Points

- Venta interna grabada.
- Factura electronica enviada a ARCA.
- Comprobante pendiente en lote.
- Pago Mercado Pago pendiente o confirmado.
- Nueva venta o impresion/envio.

## Blocking Dependencies

| Dependency | Type | Blocking? | Current status | Notes |
| --- | --- | --- | --- | --- |
| Estados formales de venta/factura | data | yes | partial | Inferidos, no confirmados como enum. |
| Validaciones bloqueantes | data | yes | open | Pregunta prioritaria. |
| Reglas de venta informal con posnet tercero | product decision | yes | evaluating | Decision en evaluacion. |
| Comportamiento de vuelto/pago parcial | business rule | no | partial | Cubierto en alto nivel. |

## Data And Rules

- Core entities: Venta, Pago, Medio de pago, Comprobante, Cliente, ARCA.
- Required data: total, medio(s), importe, cliente fiscal si aplica.
- Optional data: plan tarjeta, banco/billetera, QR/link, formato comprobante.
- Derived data: saldo pendiente, vuelto, impuestos, percepciones, estado ARCA.
- Visible business rules: Mercado Pago cierra venta al confirmar pago; factura electronica requiere certificado/licencia.
- Validation rules: total pagado, datos fiscales, estado ARCA, medio configurado.
- Recovery behavior: si ARCA falla, venta puede quedar pendiente en lote.

## UX Decisions

| Decision | Rationale | Confirmation |
| --- | --- | --- |
| Mostrar diferencia entre venta interna y factura electronica | Impacta fiscalizacion e informes ARCA | demo-confirmed |
| Esperar confirmacion Mercado Pago antes de cerrar | Evita registrar venta sin pago confirmado | demo-confirmed |
| Mostrar estado fiscal antes/despues de confirmar | Reduce errores de "crei que estaba facturado" | demo-inferred |

## Open Questions

| Question | Risk if unresolved | Blocking? |
| --- | --- | --- |
| Cuales son todos los estados formales de cobro/factura | Estados UI incorrectos | yes |
| Que validaciones bloquean el cobro o emision | Accion primaria podria habilitarse mal | yes |
| Como se maneja venta interna con posnet tercero | Riesgo fiscal/comercial | yes |
| Como se muestra pago parcial/vuelto | Confusion de caja | no |

## Evidence

| Claim | Source | Confidence |
| --- | --- | --- |
| Medios: efectivo, tarjeta, transferencia, Mercado Pago y multipago | minuta tecnica 2026-07-08 | demo-confirmed |
| Factura electronica requiere certificado/licencia | minuta tecnica 2026-07-08 | demo-confirmed |
| Estados exactos quedan pendientes | cobertura guia 2026-07-08 | open-question |

## Views To Build

| View ID | Purpose | Handoff path | Destination | Status |
| --- | --- | --- | --- | --- |
| cobro-y-fiscalizacion | Cobro y estado fiscal | `docs/product-redesign/views/facturacion-rapida-pos.md` | `pos-workspace.tsx` | prototype-built |
