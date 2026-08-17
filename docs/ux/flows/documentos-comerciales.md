# Flow: Documentos comerciales de compra y venta

## Goal

- Flow ID: `documentos-comerciales`.
- User goal: encontrar, consultar y generar facturas, notas o remitos dentro del contexto comercial correcto.
- Business outcome: documentos trazables sin duplicar navegación y formularios por cada variante.
- Documentation status: `partially-confirmed`.
- Delivery status: `prototype-built`.
- Evidence: decisiones del cliente, contrato de vista y prototipo; efectos fiscales, contables y de stock pendientes.

## Primary Users

| Role | Job in this flow | Frequency | Pressure | Notes |
| --- | --- | --- | --- | --- |
| Administrativo | Consultar y generar documentos | Alta | Media/alta | Exactitud y trazabilidad. |
| Encargado | Autorizar correcciones/anulaciones | Variable | Alta | Acciones sensibles. |

## Current Legacy Flow

| Step | User goal | Legacy surface | Pain / friction | Step classification | Notes |
| --- | --- | --- | --- | --- | --- |
| Elegir variante | Llegar al documento | Múltiples destinos por tipo | Navegación duplicada | legacy workaround | Compra/venta y tipo se eligen demasiado temprano. |
| Consultar | Encontrar documento | Listados separados | Filtros y columnas repetidos | essential decision | Densidad útil a preservar. |
| Crear nota | Corregir factura | Formularios independientes | Se pierde el documento de origen | compliance-fiscal | Origen preferido: factura. |

## Target Modern Flow

| Step | Modern behavior | Surface | User decision | Validation / recovery | Notes |
| --- | --- | --- | --- | --- | --- |
| Entrar con contexto | Navegación resuelve compra o venta | Workspace Documentos | Ninguna decisión repetida | Contexto visible siempre | Componentes compartidos. |
| Consultar | Buscar y filtrar Todos/Facturas/Notas/Remitos | Listado | Elegir familia y período | Vacío con opción de limpiar | Los filtros no son rutas nuevas. |
| Ver detalle | Revisar estado, relaciones y auditoría | Drawer | Elegir acción permitida | Conservar filtros al cerrar | Acciones según tipo/estado. |
| Crear | Elegir tipo permitido desde `Nuevo documento` | Menú + formulario adaptable | Factura, nota o remito | Tipo/contexto bloquean campos incompatibles | No mostrar superformulario. |
| Crear nota desde origen | Heredar factura, contraparte e ítems válidos | Formulario adaptable | Crédito/débito y motivo | Mostrar qué se heredó | Camino recomendado. |
| Emitir o cancelar | Ejecutar acción explícita | Barra de finalización | Confirmar efecto | Conservar borrador ante fallas | Integraciones reales pendientes. |

## Screens / Surfaces

| Surface | Legacy source | Modern destination | Pattern | Status |
| --- | --- | --- | --- | --- |
| Documentos de compra/venta | Listados legacy | `CommercialDocumentsWorkspace` | contextual list | prototype-built |
| Facturas de venta | Factura legacy | `SalesInvoiceWorkbench` | documento transaccional | prototype-built |
| Detalle/formulario | Formularios legacy | Drawer/workbench adaptable | drawer / main view | prototype-built |

## Entry Points

- Compras: facturas, notas de débito/crédito y remitos del contexto compra.
- Ventas: facturas, notas de débito/crédito y remitos del contexto venta.
- Factura, cliente, proveedor o reporte como origen contextual.

## Exit Points

- Documento emitido, actualizado o consultado.
- Pago/cobro en su flujo separado.
- Retorno al origen con filtros y contexto preservados.

## Blocking Dependencies

| Dependency | Type | Blocking? | Current status | Notes |
| --- | --- | --- | --- | --- |
| Tipos, estados y acciones por documento | data | yes | needs-user-validation | No inventar estados desde UI. |
| ARCA, stock, contabilidad y cuenta corriente | integration | yes for production | not integrated | Efectos varían por tipo. |
| Documento de origen | entity / flow | yes for some notes | partial | Obligatoriedad pendiente. |

## Data And Rules

- Core entities: Documento, Contraparte, Ítem, Impuesto, Documento de origen, Estado.
- Required data: contexto compra/venta, tipo, contraparte, fecha, ítems/importes según documento.
- Visible business rules: compra/venta proviene de la navegación; notas y remitos conservan diferencias reales.
- Validation rules: cambiar tipo con datos dependientes requiere confirmación; emitir usa un verbo específico.
- Recovery behavior: evitar doble envío, conservar datos y explicar fallas fiscales o de integración.

## UX Decisions

| Decision | Rationale | Confirmation |
| --- | --- | --- |
| Un workspace adaptable por contexto | Reduce duplicación sin mezclar compras y ventas | user-confirmed |
| Tipos como filtros/opciones, no destinos técnicos | Simplifica navegación | user-confirmed |
| Crear notas desde la factura cuando existe | Preserva trazabilidad y precarga | user-confirmed |
| Mantener pagos y cobros fuera de Documentos | Son movimientos de dinero con objetivos propios | user-confirmed |

## Open Questions

| Question | Risk if unresolved | Blocking? |
| --- | --- | --- |
| ¿Qué notas pueden existir sin documento de origen? | Flujo y trazabilidad incorrectos | yes |
| ¿Qué estados, anulaciones y efectos tiene cada tipo? | Riesgo fiscal/contable/stock | yes |
| ¿Qué facturas/remitos nacen aquí y cuáles desde POS u otro flujo? | Opciones duplicadas | yes |

## Views To Build

| View ID | Purpose | Handoff path | Destination | Status |
| --- | --- | --- | --- | --- |
| documentos-comerciales | Consultar y generar documentos | `docs/product-redesign/views/documentos-comerciales.md` | `commercial-documents-workspace.tsx` | prototype-built |
| facturas-venta | Crear y consultar facturas de venta | `docs/product-redesign/views/documentos-comerciales.md` | `sales-invoice-workbench.tsx` | prototype-built |
