# Flow: Facturacion rapida / POS

## Goal

- Flow ID: `facturacion-rapida-pos`
- User goal: registrar una venta de mostrador donde el cliente compra y paga en el momento.
- Business outcome: venta rapida, stock afectado cuando corresponde, pago registrado y comprobante interno/fiscal resuelto.
- Documentation status: `partially-confirmed`.
- Delivery status: `prototype-built`.
- Evidence: `demo-confirmed` for functional flow; `needs-user-validation` for speed, frequency, shortcuts and pressure.

## Primary Users

| Role | Job in this flow | Frequency | Pressure | Notes |
| --- | --- | --- | --- | --- |
| Cajero / mostrador | Cargar productos, elegir cliente si aplica, cobrar e imprimir/enviar comprobante | `needs-user-validation` | Alta en hora pico (`needs-user-validation`) | La demo no valida uso real. |
| Vendedor | Puede quedar asociado a la venta segun rubro | `demo-confirmed` | Media | Puede sugerirse por usuario o seleccionarse manualmente. |
| Administrador | Configura permisos, medios, formatos, ARCA y parametros | `demo-confirmed` | Variable | No opera necesariamente la venta diaria. |

## Current Legacy Flow

| Step | User goal | Legacy surface | Pain / friction | Step classification | Notes |
| --- | --- | --- | --- | --- | --- |
| Iniciar venta | Abrir POS con cliente por defecto | Facturacion rapida | No se valido si el usuario llega por menu/favorito/login | essential decision | Consumidor Final por defecto (`demo-confirmed`). |
| Elegir vendedor | Asociar venta si el rubro lo requiere | Campo/selector vendedor | En algunos rubros no aplica | useful confirmation | Usuario con vendedor asignado lo sugiere. |
| Cargar productos | Escanear, buscar, usar camara o favoritos | Buscador/lector/favoritos | Proporcion real por metodo pendiente | essential decision | Stock no se muestra en venta rapida. |
| Ajustar cantidad/descuento | Corregir cantidad o aplicar descuento autorizado | Item/cart | Correccion antes de cobrar no fue detallada | expert shortcut / permission-gated | Descuentos requieren autorizacion. |
| Cobrar | Elegir efectivo/factura/tarjeta/transferencia/MP | Acciones de cobro | Estados y validaciones exactas pendientes | essential decision | Multipago soportado. |
| Entregar comprobante | Imprimir/PDF/WhatsApp/captura | Impresion/configuracion | Impacto de espera de impresora pendiente | useful confirmation | Formatos parametrizados. |

## Target Modern Flow

| Step | Modern behavior | Surface | User decision | Validation / recovery | Notes |
| --- | --- | --- | --- | --- | --- |
| Venta lista para operar | POS abre con cliente, vendedor sugerido si aplica y foco en carga de producto | POS main view | Cambiar cliente/vendedor solo si hace falta | Mostrar estado de configuracion critica | No asumir atajos hasta entrevista real. |
| Cargar items | Lector, busqueda, camara o favoritos agregan items al carrito | Item entry + carrito | Seleccionar producto/cantidad | Producto no encontrado, codigo ilegible, favorito faltante | Resaltar ultimo item agregado es hipotesis. |
| Preparar cobro | Total, pagos posibles y estado fiscal visibles | Panel/barra de cobro | Medio(s) de pago y factura interna/electronica | Validaciones fiscales y permisos | Debe conectarse con `cobro-y-fiscalizacion`. |
| Finalizar | Registrar pago, emitir o dejar pendiente, entregar comprobante | Cobro + comprobante | Confirmar operacion | Si falla ARCA, no perder venta | Estados exactos pendientes. |

## Screens / Surfaces

| Surface | Legacy source | Modern destination | Pattern | Status |
| --- | --- | --- | --- | --- |
| Pantalla principal de facturacion rapida | Demo IM5 | POS critical viewport | main view | prototype-built |
| Selector/alta cliente | Demo IM5 | Alta contextual minima | drawer / dialog | prototype-built |
| Panel de cobro | Demo IM5 | Cobro y fiscalizacion | drawer / panel | prototype-built |
| Favoritos por usuario | Demo IM5 | Acceso rapido a productos frecuentes | panel | prototype-built |

## Entry Points

- Perfil ventas/admin redirige a facturacion de ventas (`demo-confirmed`).
- Menu o navegacion real pendiente (`open-question`).

## Exit Points

- Nueva venta.
- Impresion, PDF, captura o WhatsApp.
- Comprobante pendiente en lote si falla ARCA.
- Rendicion/caja o cambio segun operacion posterior.

## Blocking Dependencies

| Dependency | Type | Blocking? | Current status | Notes |
| --- | --- | --- | --- | --- |
| Validaciones que bloquean cobro/emision | data | yes | open | Pregunta prioritaria. |
| Correccion de item/cantidad/descuento antes de cobrar | flow | yes | open | No cubierto en detalle. |
| Atajos reales y foco de teclado | UX / interaction | yes | needs-user-validation | No disenar final sin cajeros reales. |
| Estados fiscales de venta | data | yes | partial | Inferidos desde demo. |

## Data And Rules

- Core entities: Venta, Cliente, Vendedor, Producto, Pago, Comprobante, Usuario.
- Required data: cliente por defecto, items, total, medio de pago.
- Optional data: vendedor, cliente fiscal identificado, descuento, favoritos.
- Derived data: total, impuestos, percepciones, estado fiscal, vuelto/diferencia.
- Visible business rules: permisos de descuento, topes consumidor final, factura electronica si corresponde.
- Validation rules: pendientes de lista formal.
- Recovery behavior: venta no debe perderse si falla ARCA; puede quedar pendiente en lote.

## UX Decisions

| Decision | Rationale | Confirmation |
| --- | --- | --- |
| Consumidor Final como default | Reduce pasos de venta comun | demo-confirmed |
| No mostrar stock por defecto en POS | Se asume que cliente ya llega con productos disponibles | demo-confirmed but needs-user-validation |
| Favortios por usuario | Aceleran productos frecuentes | demo-confirmed |
| No cerrar venta Mercado Pago hasta confirmacion | Evita registrar venta sin pago confirmado | demo-confirmed |

## Open Questions

| Question | Risk if unresolved | Blocking? |
| --- | --- | --- |
| Que atajos son sagrados y cual es el foco esperado | Romper velocidad/memoria muscular | yes |
| Como se corrige un item mal cargado antes de cobrar | Errores frecuentes pueden quedar lentos | yes |
| Que volumen de items y ventas hay en hora pico | Layout podria no soportar carga real | yes |
| Que necesita ver el cajero bajo presion | Primer viewport podria priorizar mal | yes |

## Evidence

| Claim | Source | Confidence |
| --- | --- | --- |
| POS rapido es foco principal de beta IM5 | minuta tecnica 2026-07-08 | demo-confirmed |
| Metodos de carga: lector, descripcion, camara, favoritos | minuta tecnica 2026-07-08 | demo-confirmed |
| Falta validar atajos, volumen y hora pico | cobertura guia 2026-07-08 | needs-user-validation |

## Views To Build

| View ID | Purpose | Handoff path | Destination | Status |
| --- | --- | --- | --- | --- |
| facturacion-rapida-pos | POS principal | `docs/product-redesign/views/facturacion-rapida-pos.md` | `pos-workspace.tsx` | prototype-built |
