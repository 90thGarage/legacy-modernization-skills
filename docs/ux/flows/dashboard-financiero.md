# Flow: Consulta del dashboard financiero

## Goal

- Flow ID: `dashboard-financiero`.
- User goal: entender posición, vencimientos, liquidez y evolución financiera para decidir qué requiere atención.
- Business outcome: detectar riesgos y abrir el detalle correcto sin ejecutar movimientos desde el dashboard.
- Documentation status: `partially-confirmed`.
- Delivery status: `prototype-built`.
- Evidence: captura legacy, brief/handoff y prototipo; fórmulas y permisos finos necesitan validación.

## Primary Users

| Role | Job in this flow | Frequency | Pressure | Notes |
| --- | --- | --- | --- | --- |
| Dueño / administrador | Detectar posición y riesgos | Diaria/semanal | Media/alta | Usuario primario asumido. |
| Administrativo / tesorería | Investigar vencimientos y liquidez | Frecuente | Media | Alcance por permiso pendiente. |
| Contable | Revisar resultados y consistencia | Periódica | Media | Rol aún no modelado. |

## Current Legacy Flow

| Step | User goal | Legacy surface | Pain / friction | Step classification | Notes |
| --- | --- | --- | --- | --- | --- |
| Elegir alcance | Ver empresa o consolidado | Selector y checkboxes | Controles ocupan espacio permanente | essential decision | Captura legacy. |
| Recalcular bloques | Obtener valores actuales | Acciones repetidas | Trabajo duplicado y frescura confusa | legacy workaround | Reemplazado por actualización global. |
| Revisar saldos y resultados | Encontrar riesgos | Tablas y gráficos con igual peso | Jerarquía débil | essential decision | Valores exactos deben preservarse. |
| Abrir detalle | Investigar una cifra | Links y filas | Navegación inconsistente | useful confirmation | Destinos finales pendientes. |

## Target Modern Flow

| Step | Modern behavior | Surface | User decision | Validation / recovery | Notes |
| --- | --- | --- | --- | --- | --- |
| Definir alcance | Elegir empresa/consolidado, unidad y período | Barra de filtros | Alcance de lectura | Mostrar dimensiones sin acceso | Defaults de prototipo: 30 días y ARS. |
| Revisar panorama | Leer KPIs, resultado, alertas y antigüedad | Dashboard | Priorizar riesgo | Estados parcial/desactualizado visibles | No mueve dinero. |
| Investigar | Seleccionar KPI, alerta, rango o entidad | Sheet contextual | Elegir foco | Conservar filtros al cerrar | Datos mock. |
| Continuar | Abrir workspace especializado | Navegación contextual | Decidir si actuar | El destino aplica sus permisos | Cobros/pagos no ocurren aquí. |

## Screens / Surfaces

| Surface | Legacy source | Modern destination | Pattern | Status |
| --- | --- | --- | --- | --- |
| Dashboard financiero | `dashboard-financiero-main-screen.png` | `FinancialDashboardWorkspace` | consulta y reporte | prototype-built |
| Detalle contextual | Inferido de links legacy | Sheet del dashboard | panel | prototype-built |

## Entry Points

- Sidebar `Dashboard`, visible para perfiles autorizados.
- Posible inicio de sesión de dueño/administrador, pendiente de decisión.

## Exit Points

- Clientes y cuenta corriente.
- Proveedores, documentos, cobros y pagos.
- Informe detallado o exportación del resultado filtrado.

## Blocking Dependencies

| Dependency | Type | Blocking? | Current status | Notes |
| --- | --- | --- | --- | --- |
| Fórmulas financieras | data | yes for production | needs-user-validation | Posición neta, margen y signos. |
| Empresa/local/unidad de negocio | entity | yes | partially mapped | Dimensiones posiblemente distintas. |
| Permisos financieros | permission | yes | prototype assumption | Vendedor no accede. |

## Data And Rules

- Core entities: Empresa, Unidad de negocio, Cliente, Proveedor, Cuenta financiera, Documento, Período.
- Required data: alcance, período, montos, fechas de vencimiento y frescura.
- Derived data: KPIs, tendencias, antigüedad y posición; solo usar fórmulas confirmadas.
- Visible business rules: el dashboard es de solo lectura y toda exportación respeta filtros y permisos.
- Recovery behavior: indicar carga parcial, datos viejos o error por fuente sin borrar el resto.

## UX Decisions

| Decision | Rationale | Confirmation |
| --- | --- | --- |
| Un único contrato de filtros globales | Reemplaza recálculos repetidos | document-inferred |
| Resultado y alertas dominan el primer viewport | Orienta la decisión antes del detalle | user-confirmed |
| Las operaciones ocurren en sus workspaces | Evita movimientos sensibles desde un resumen | document-inferred |

## Open Questions

| Question | Risk if unresolved | Blocking? |
| --- | --- | --- |
| ¿Qué fórmula y signo usa cada indicador? | Información financiera incorrecta | yes |
| ¿Empresa, local y unidad de negocio son dimensiones distintas? | Filtros ambiguos | yes |
| ¿Qué roles ven consolidado, margen y disponibilidades? | Exposición de información sensible | yes |

## Views To Build

| View ID | Purpose | Handoff path | Destination | Status |
| --- | --- | --- | --- | --- |
| dashboard-financiero | Resumir e investigar posición financiera | `docs/ux/dashboard-financiero-ui-handoff.md` | `financial-dashboard-workspace.tsx` | prototype-built |
