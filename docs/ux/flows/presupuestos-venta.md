# Flow: Presupuestos de venta

## Goal

- Flow ID: `presupuestos-venta`.
- User goal: consultar, crear y editar una propuesta comercial clara para un cliente.
- Business outcome: presupuesto reutilizable y trazable sin producir efectos fiscales, de stock, dinero o cuenta corriente al guardarlo.
- Documentation status: `user-confirmed` para el límite de negocio; reglas de conversión pendientes.
- Delivery status: `prototype-built`.
- Evidence: capturas, decisiones del cliente, contrato de vista e implementación.

## Primary Users

| Role | Job in this flow | Frequency | Pressure | Notes |
| --- | --- | --- | --- | --- |
| Vendedor | Preparar una propuesta | Frecuente según rubro | Media | Necesita precios y totales claros. |
| Administrativo / encargado | Revisar y modificar condiciones | Variable | Media | Permisos pendientes. |

## Current Legacy Flow

| Step | User goal | Legacy surface | Pain / friction | Step classification | Notes |
| --- | --- | --- | --- | --- | --- |
| Buscar presupuesto | Retomar propuesta | Listado legacy | Navegación y filtros densos | expert shortcut | Capturas existentes. |
| Cargar cabecera e ítems | Preparar propuesta | Formulario legacy | Acción `Grabar` no explica efectos | essential decision | Debe distinguirse de facturar. |

## Target Modern Flow

| Step | Modern behavior | Surface | User decision | Validation / recovery | Notes |
| --- | --- | --- | --- | --- | --- |
| Consultar | Buscar y filtrar presupuestos | Listado dominante | Elegir registro | Estado vacío permite limpiar filtros | Tabla conserva contexto. |
| Ver detalle | Revisar cliente, vigencia, ítems y total | Drawer | Editar o cerrar | Solo lectura hasta elegir editar | Mantiene listado. |
| Crear o editar | Completar cliente, condiciones e ítems | Sheet dedicado | Definir propuesta | Validación inline y borrador local | CTA explícito. |
| Guardar | Crear presupuesto o guardar cambios | Barra inferior | Confirmar intención | No factura ni afecta otras cuentas | Decisión confirmada. |

## Screens / Surfaces

| Surface | Legacy source | Modern destination | Pattern | Status |
| --- | --- | --- | --- | --- |
| Presupuestos | Capturas legacy | `BudgetsWorkspace` | list-detail workspace | prototype-built |
| Editor | Formulario legacy | Sheet de creación/edición | documento transaccional | prototype-built |

## Entry Points

- `Ventas > Presupuestos`.
- Cliente o futura oportunidad comercial, si se confirma navegación contextual.

## Exit Points

- Listado actualizado.
- Impresión, PDF o envío, según soporte futuro.
- Conversión a factura u otro documento, todavía no definida.

## Blocking Dependencies

| Dependency | Type | Blocking? | Current status | Notes |
| --- | --- | --- | --- | --- |
| Cliente y artículos | entity | yes | prototype | Datos compartidos. |
| Listas de precio/impuestos | data | yes for production | partial | Cálculos finales pendientes. |
| Conversión a documento | flow | no for basic flow | not mapped | Debe tener reglas propias. |

## Data And Rules

- Core entities: Presupuesto, Cliente, Ítem, Condición comercial, Totales.
- Required data: cliente, fecha/vigencia, al menos un ítem y valores válidos.
- Derived data: subtotales, descuentos, impuestos informativos y total según reglas confirmadas.
- Visible business rules: guardar no factura, fiscaliza, reserva stock ni mueve dinero/cuenta corriente.
- Recovery behavior: advertir antes de cerrar con cambios; conservar borrador cuando sea posible.

## UX Decisions

| Decision | Rationale | Confirmation |
| --- | --- | --- |
| Listado dominante con edición bajo demanda | Optimiza consulta y evita formulario permanente | user-confirmed |
| Usar `Crear presupuesto` y `Guardar cambios` | Comunica la intención sin ambigüedad | user-confirmed |
| Separar conversión de guardado | Evita efectos inesperados | user-confirmed |

## Open Questions

| Question | Risk if unresolved | Blocking? |
| --- | --- | --- |
| ¿Qué estados y vigencias reales tiene un presupuesto? | Listado y acciones incorrectos | yes for production |
| ¿Cómo se convierte y qué datos hereda una factura? | Duplicación o efectos inesperados | yes before conversion |
| ¿Qué permisos permiten modificar precios, descuentos o documentos vencidos? | Riesgo comercial | yes |

## Views To Build

| View ID | Purpose | Handoff path | Destination | Status |
| --- | --- | --- | --- | --- |
| presupuestos | Consultar y mantener propuestas | `docs/product-redesign/views/presupuestos.md` | `budgets-workspace.tsx` | prototype-built |
