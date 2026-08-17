# Flow: Facturación avanzada

## Goal

- Flow ID: `facturacion-avanzada`.
- User goal: preparar, revisar y emitir un comprobante detallado con información fiscal, comercial, logística e interna.
- Business outcome: factura completa y trazable sin forzar el flujo rápido de mostrador.
- Documentation status: `partially-confirmed`.
- Delivery status: `prototype-built`.
- Evidence: capturas legacy, decisiones del cliente, contrato de vista e implementación; emisión real no integrada.

## Primary Users

| Role | Job in this flow | Frequency | Pressure | Notes |
| --- | --- | --- | --- | --- |
| Administrativo | Preparar un comprobante exacto | Variable | Media | Prima revisión sobre velocidad. |
| Encargado | Resolver condiciones y autorizaciones | Variable | Media/alta | Permisos finos pendientes. |

## Current Legacy Flow

| Step | User goal | Legacy surface | Pain / friction | Step classification | Notes |
| --- | --- | --- | --- | --- | --- |
| Completar cabecera | Definir cliente y documento | Factura legacy | Muchos campos compiten simultáneamente | essential decision | Dos capturas disponibles. |
| Cargar ítems y extensiones | Definir contenido e impactos | Grilla, laterales y pie | Jerarquía y continuidad débiles | essential decision | Funciones exactas parcialmente relevadas. |
| Revisar y grabar | Confirmar importes | Pie legacy | `Grabar` no comunica efecto fiscal | compliance-fiscal | Emisión real pendiente. |

## Target Modern Flow

| Step | Modern behavior | Surface | User decision | Validation / recovery | Notes |
| --- | --- | --- | --- | --- | --- |
| Definir cabecera | Completar cliente, comprobante, condiciones, logística y control | Cabecera modular | Elegir datos aplicables | Campos fiscales ocultos siguen validándose | Configuración cambia presentación, no reglas. |
| Cargar ítems | Buscar, agregar y editar renglones | Grilla | Cantidad, precio y descuentos autorizados | Recalcular al modificar | Prototipo con datos simulados. |
| Completar extensiones | Resolver cobro, impuestos, entrega, origen y pagos | Tabs/pasos contextuales | Definir o marcar opcional | `Completar pendientes` lleva al bloqueo | No todas las reglas están confirmadas. |
| Revisar | Leer neto, impuestos y total | Resumen unido a la grilla | Corregir o continuar | Bloqueos visibles junto al origen | Total dominante. |
| Finalizar | Guardar borrador, previsualizar o emitir | Barra inferior | Elegir efecto | Evitar doble envío y conservar datos ante falla | Emisión simulada. |

## Screens / Surfaces

| Surface | Legacy source | Modern destination | Pattern | Status |
| --- | --- | --- | --- | --- |
| Facturación avanzada | Capturas legacy | `AdvancedInvoicingWorkspace` | documento transaccional | prototype-built |
| Editores contextuales | Acciones legacy | Panels/dialogs | panel | prototype-built |

## Entry Points

- `Ventas > Facturación avanzada`.
- Posible conversión desde presupuesto o documento relacionado, todavía no confirmada.

## Exit Points

- Comprobante emitido o borrador guardado.
- Documento de venta, remito, cobro o cuenta corriente según reglas futuras.

## Blocking Dependencies

| Dependency | Type | Blocking? | Current status | Notes |
| --- | --- | --- | --- | --- |
| Reglas fiscales y ARCA | integration | yes for production | not integrated | Comparte dominio con POS. |
| Stock, remitos y cuenta corriente | flow | yes for effects | needs-user-validation | El prototipo no los afecta. |
| Configuración por organización/perfil | data / permission | no for prototype | local prototype | Persistencia multiempresa pendiente. |

## Data And Rules

- Core entities: Cliente, Comprobante, Ítem, Impuesto, Pago, Depósito, Remito.
- Required data: cliente, tipo, punto de venta, fecha, ítems y total; obligatoriedad exacta depende del documento.
- Derived data: letra, número, neto, impuestos y total cuando el dominio lo permita.
- Visible business rules: Cabecera, Ítems y Resumen siempre conservan ese orden.
- Recovery behavior: guardar borrador y conservar contenido ante error de validación o integración.

## UX Decisions

| Decision | Rationale | Confirmation |
| --- | --- | --- |
| Mantener Facturación avanzada separada del POS | Usuarios, presión y cantidad de datos diferentes | user-confirmed |
| Permitir configuración visual sin redefinir dominio | Flexibilidad segura por cliente | user-confirmed |
| Finalización y total al pie | Sigue la dirección real de carga | user-confirmed |

## Open Questions

| Question | Risk if unresolved | Blocking? |
| --- | --- | --- |
| ¿Qué campos son obligatorios por comprobante y cliente? | Emisión inválida | yes |
| ¿Qué extensiones se habilitan por empresa, perfil o tipo? | Configuración inconsistente | yes |
| ¿Cómo afectan emisión, stock, remitos, pagos y cuenta corriente? | Efectos de negocio incorrectos | yes |

## Views To Build

| View ID | Purpose | Handoff path | Destination | Status |
| --- | --- | --- | --- | --- |
| facturacion-avanzada | Preparar y emitir comprobante detallado | `docs/product-redesign/views/facturacion-avanzada.md` | `advanced-invoicing-workspace.tsx` | prototype-built |
