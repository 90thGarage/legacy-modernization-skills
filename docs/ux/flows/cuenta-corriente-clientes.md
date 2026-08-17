# Flow: Consulta de cuenta corriente de clientes

## Goal

- Flow ID: `cuenta-corriente-clientes`.
- User goal: seleccionar un cliente, definir el alcance y comprender el saldo a partir de sus movimientos.
- Business outcome: estado de cuenta claro y exportable sin registrar cobros desde la consulta.
- Documentation status: `partially-confirmed`.
- Delivery status: `prototype-built`.
- Evidence: capturas, decisión del cliente, contrato de vista e implementación; reglas contables pendientes.

## Primary Users

| Role | Job in this flow | Frequency | Pressure | Notes |
| --- | --- | --- | --- | --- |
| Administrativo | Preparar y revisar estados de cuenta | Frecuente | Media | Necesita valores exactos. |
| Dueño / encargado | Entender exposición y vencimientos | Periódica | Media/alta | Puede ingresar desde dashboard. |
| Cajero autorizado | Consultar antes de derivar a cobro | Variable | Alta | No registra dinero aquí. |

## Current Legacy Flow

| Step | User goal | Legacy surface | Pain / friction | Step classification | Notes |
| --- | --- | --- | --- | --- | --- |
| Elegir cliente y criterio | Preparar consulta | Cuenta corriente/Saldos | Destinos posiblemente duplicados | essential decision | Evidencia parcial. |
| Generar reporte | Entender saldo | Reporte legacy | Reglas contables no relevadas | essential decision | No inferir signo ni aplicación. |

## Target Modern Flow

| Step | Modern behavior | Surface | User decision | Validation / recovery | Notes |
| --- | --- | --- | --- | --- | --- |
| Encontrar cliente | Buscar desde listado o recibir cliente contextual | Workspace | Elegir cuenta | Cliente inexistente permite volver | Entrada desde Clientes preservada. |
| Preparar reporte | Definir fechas, moneda y criterios disponibles | Drawer | Elegir alcance | Criterios inválidos se corrigen inline | No mostrar movimientos todavía. |
| Consultar | Generar saldo, totales y movimientos | Reporte | Revisar resultado | Estado sin movimientos explicativo | Solo lectura. |
| Continuar | Exportar o abrir Cobros/Documentos | Acciones contextuales | Elegir siguiente trabajo | Destino valida permisos | Filtros deben conservarse al volver. |

## Screens / Surfaces

| Surface | Legacy source | Modern destination | Pattern | Status |
| --- | --- | --- | --- | --- |
| Cuenta corriente | Capturas legacy | `CustomerAccountStatementWorkspace` | consulta y reporte | prototype-built |
| Preparar reporte | Criterios legacy | Drawer | drawer | prototype-built |

## Entry Points

- `Ventas > Cuenta corriente`.
- Acción contextual desde un cliente.
- Dashboard o documento, como entrada futura.

## Exit Points

- Exportación del reporte actual.
- `Ventas > Cobros` para registrar dinero.
- Documentos relacionados del cliente.

## Blocking Dependencies

| Dependency | Type | Blocking? | Current status | Notes |
| --- | --- | --- | --- | --- |
| Reglas de saldo y aplicación | data | yes for production | needs-user-validation | Signos, vencimientos e imputaciones. |
| Cobros y documentos | flow | no for read-only | prototype | Acciones en destinos separados. |
| Permisos y monedas | permission / data | yes | partial | Alcance pendiente. |

## Data And Rules

- Core entities: Cliente, Cuenta corriente, Movimiento, Documento, Recibo, Moneda.
- Required data: cliente, período y movimientos con fecha, concepto, débito/crédito y saldo.
- Derived data: saldo anterior, débitos, créditos y saldo final según reglas confirmadas.
- Visible business rules: la vista es de solo lectura y exporta el resultado actual con los mismos filtros.
- Recovery behavior: conservar criterios al corregir errores o volver de un destino relacionado.

## UX Decisions

| Decision | Rationale | Confirmation |
| --- | --- | --- |
| No duplicar `Saldos` como destino separado | Es parte del mismo trabajo de consulta | user-confirmed |
| Preparar criterios antes de generar | Evita mezclar selección con resultado | user-confirmed |
| Registrar dinero solamente en Cobros | Separa consulta de acción riesgosa | user-confirmed |

## Open Questions

| Question | Risk if unresolved | Blocking? |
| --- | --- | --- |
| ¿Cómo se calculan saldo anterior, vencido y aplicación de recibos/notas? | Reporte contablemente incorrecto | yes |
| ¿Qué monedas, agrupaciones y orden usa el reporte real? | Interpretación ambigua | yes |
| ¿Qué datos deben aparecer en PDF/Excel/CSV? | Exportación incompleta | no for prototype |

## Views To Build

| View ID | Purpose | Handoff path | Destination | Status |
| --- | --- | --- | --- | --- |
| cuenta-corriente-clientes | Consultar saldo y movimientos | `docs/product-redesign/views/cuenta-corriente-clientes.md` | `customer-account-statement-workspace.tsx` | prototype-built |
