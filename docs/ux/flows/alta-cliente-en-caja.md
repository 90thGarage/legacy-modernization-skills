# Flow: Alta / seleccion de cliente en caja

## Goal

- Flow ID: `alta-cliente-en-caja`
- User goal: seleccionar o crear un cliente fiscal durante una venta sin abandonar innecesariamente el POS.
- Business outcome: comprobante fiscal correcto y cliente guardado historicamente cuando corresponde.
- Documentation status: `partially-confirmed`.
- Delivery status: `prototype-built`.
- Evidence: `demo-confirmed` for available paths; `open-question` for exact minimum data by fiscal condition.

## Primary Users

| Role | Job in this flow | Frequency | Pressure | Notes |
| --- | --- | --- | --- | --- |
| Cajero | Identificar cliente en caja para factura o tope legal | needs-user-validation | Alta cuando cliente espera | Alta completa puede ser pesada. |
| Administrativo / encargado | Cargar clientes completos, impuestos y datos comerciales | demo-confirmed | Media | En clientes grandes valida constancias antes de venta. |

## Current Legacy Flow

| Step | User goal | Legacy surface | Pain / friction | Step classification | Notes |
| --- | --- | --- | --- | --- | --- |
| Mantener Consumidor Final | Vender sin identificar cliente | POS | Puede superar tope legal | essential decision | Default de venta. |
| Seleccionar cliente existente | Usar cliente ya creado | Grilla/listado cliente | Busqueda real no validada | essential decision | Cliente puede tener impuestos configurados. |
| Crear cliente manual | Completar datos | Interfaz/ABM clientes | Puede ser pesada en celular/tablet | legacy workaround / essential decision | ABM tiene mas datos que POS necesita. |
| Alta automatizada ARCA | Traer datos por categoria + documento | Alta ARCA | Datos minimos exactos pendientes | useful confirmation | Principalmente CUIT/factura A/monotributo/exento. |

## Target Modern Flow

| Step | Modern behavior | Surface | User decision | Validation / recovery | Notes |
| --- | --- | --- | --- | --- | --- |
| Buscar cliente | Buscar existente desde POS | Selector contextual | Cliente correcto o alta nueva | Sin resultados, datos fiscales incompletos | No abrir ABM completo por defecto. |
| Alta fiscal minima | Capturar categoria/documento y consultar ARCA | Drawer/dialog | Condicion fiscal y documento | Error ARCA, dato incompleto, tope legal | Campos minimos pendientes. |
| Completar solo necesario | Pedir datos segun comprobante | Form contextual | Confirmar datos fiscales | Validar condicion y domicilio si aplica | Mantener ABM completo como secundario. |
| Volver a venta | Cliente queda seleccionado | POS | Continuar venta | Si falla alta, mantener venta | No perder carrito. |

## Screens / Surfaces

| Surface | Legacy source | Modern destination | Pattern | Status |
| --- | --- | --- | --- | --- |
| Selector cliente | Demo IM5 | Selector contextual | dialog / drawer | prototype-built |
| Alta manual cliente | Demo IM5 | Alta minima o ABM completo secundario | drawer / route | prototype-built |
| Alta automatizada ARCA | Demo IM5 | Consulta fiscal contextual | dialog / drawer | prototype-simulated |

## Entry Points

- Desde POS cuando se cambia Consumidor Final.
- Cuando venta supera tope de Consumidor Final.
- Cuando cliente pide factura A, monotributo, exento o comprobante identificado.

## Exit Points

- Cliente seleccionado vuelve a POS.
- Cliente nuevo queda guardado historicamente.
- Si falta dato critico, bloquear factura o registrar pregunta abierta segun regla.

## Blocking Dependencies

| Dependency | Type | Blocking? | Current status | Notes |
| --- | --- | --- | --- | --- |
| Datos minimos por condicion fiscal | data | yes | open | Pregunta prioritaria. |
| Reglas de tope Consumidor Final | fiscal | yes | partial | Depende de ARCA/rubro/inscripcion. |
| Errores consulta ARCA | integration | yes | open | Necesita recuperacion. |

## Data And Rules

- Core entities: Cliente, Venta, Condicion fiscal, Impuesto, ARCA.
- Required data: condicion fiscal, documento/CUIT y datos requeridos por comprobante.
- Optional data: condiciones comerciales, lista de precio, vendedor habitual, contactos, acuerdos, domicilios extendidos.
- Derived data: impuestos/percepciones aplicables, necesidad de identificar consumidor final.
- Visible business rules: cliente queda historico aunque compre una vez.
- Validation rules: validar condicion fiscal y datos minimos por tipo de factura.
- Recovery behavior: si alta falla, conservar venta en curso.

## UX Decisions

| Decision | Rationale | Confirmation |
| --- | --- | --- |
| No abrir ABM completo por defecto desde POS | El ABM contiene mas informacion que la venta rapida necesita | demo-confirmed as UX observation |
| Cliente creado queda historico | Mantener base y trazabilidad | demo-confirmed |
| Datos impositivos e impuestos son relevantes en POS | Afectan comprobante e impuestos | demo-confirmed |

## Open Questions

| Question | Risk if unresolved | Blocking? |
| --- | --- | --- |
| Que datos minimos pide cada condicion fiscal | Alta contextual puede quedar mal | yes |
| Que pasa si ARCA no responde al crear cliente | Caja puede trabarse | yes |
| Con que frecuencia ocurre alta de cliente en caja | Prioridad UX puede estar sobredimensionada | no |

## Evidence

| Claim | Source | Confidence |
| --- | --- | --- |
| Alta manual y alta automatizada con ARCA existen desde facturacion rapida | minuta tecnica 2026-07-08 | demo-confirmed |
| Alta completa puede ser pesada en celular/tablet | minuta tecnica 2026-07-08 | demo-confirmed |
| Falta validar frecuencia real de alta en caja | cobertura guia 2026-07-08 | needs-user-validation |

## Views To Build

| View ID | Purpose | Handoff path | Destination | Status |
| --- | --- | --- | --- | --- |
| alta-cliente-en-caja | Alta/seleccion contextual de cliente fiscal | `docs/product-redesign/views/facturacion-rapida-pos.md` | `pos-workspace.tsx` | prototype-built |
