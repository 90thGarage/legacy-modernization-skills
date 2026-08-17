# Dashboard financiero UX Brief

## Metadata

- View ID: `dashboard-financiero`
- Source: captura legacy `./dashboard-financiero-main-screen.png` y análisis solicitado por el usuario.
- Product context: `./product-context.md`
- Flow context: `./flows/dashboard-financiero.md`.
- Created: 2026-07-23
- Status: Draft con supuestos abiertos, listo para revisión visual e implementación de prototipo.
- Confidence: alta para arquitectura visual; media-baja para definiciones contables, rangos de antigüedad, permisos y navegación final.
- Language: Español.

## Product Context Alignment

- Product context source: `./product-context.md`.
- Flow context source: `./flows/dashboard-financiero.md`.
- Request classification: single-view modernization inside a partially defined product area.
- Product-level decisions reused: reportes con filtros persistentes; indicadores opcionales; exportación del resultado actual; recuperación del ancho disponible; web, tablet y celular; permisos por rol.
- Product-level conflicts or contradictions: la captura usa “empresa” y “UN” además de un selector de consolidación; el producto moderno usa empresa/local en el shell. Falta definir si unidad de negocio, local y empresa son dimensiones distintas.
- Product-level assumptions: la vista es de lectura y exploración; no ejecuta cobros, pagos ni asientos. El usuario principal es dueño/administrador. El prototipo puede usar datos mock sin afirmar fórmulas contables no confirmadas.
- Related reusable product patterns: `Consulta y reporte`, filtros globales persistentes, detalle contextual en `Sheet`, indicadores opcionales y tablas exportables.

## Module Context

- Module: Control / Finanzas / Consultas y reportes.
- Previous step: ingreso desde navegación principal o acceso inicial de un usuario administrativo.
- Next step: abrir clientes por cobrar, proveedores por pagar, disponibilidades, comprobantes o informe de resultados.
- Related views: Clientes, Proveedores, Cuenta corriente de clientes, Recibos, Órdenes de pago, Documentos de compra, Documentos de venta y patrón Consulta y reporte.
- Shared entities: Empresa, Unidad de negocio, Cliente, Proveedor, Cuenta financiera, Factura, Saldo de cuenta corriente, Movimiento, Período e Indicador financiero.
- Role or permission dependencies: la información consolidada y el resultado/margen deben quedar restringidos a perfiles autorizados. En el prototipo actual, `admin` puede acceder y `seller` no.
- Blocking dependencies: significado de los totales legacy, fórmulas de posición neta y margen, rangos de antigüedad, permisos finos y rutas definitivas de detalle.
- Integration assumptions: agregar una vista `dashboard` al shell existente; reutilizar navegación, empresa/local activa, estilos y entidades mock. No crear un segundo shell.

## User And Context

- Primary user: dueño, administrador o encargado con responsabilidad financiera.
- Secondary users: administrativo, tesorería y contable.
- Usage context: revisión diaria o periódica para detectar vencimientos, falta de liquidez, concentración de deuda y cambios en el resultado.
- Primary task: entender rápidamente qué requiere atención financiera.
- Secondary tasks: comparar períodos o empresas, identificar responsables de los mayores saldos y abrir el detalle correspondiente.
- Frequency: diaria o varias veces por semana, según rol.
- Decision pressure: media-alta; la vista no mueve dinero, pero puede orientar decisiones sensibles.

## Product And Adoption Context

- Existing user base: usuarios acostumbrados a tablas densas, totales visibles y cálculos manuales por bloque.
- Adoption expectation: conservar conceptos financieros reconocibles y mejorar jerarquía, comparación y acceso al detalle.
- Training constraints: los gráficos deben incluir etiquetas, montos y leyendas comprensibles sin capacitación específica.
- Known business language to preserve: empresa, cliente, proveedor, saldo, facturas impagas, disponibilidad, ingresos, egresos, margen, resultado y unidad de negocio.
- Legacy concepts that can be renamed: `Fact. Impagas` a `Facturas pendientes`; `Deu.Tot.` a una etiqueta confirmada; `UN` a `Unidad de negocio`; `Inf. detallado` a `Ver informe detallado`.
- Product maintainability concerns: filtros, tarjetas de indicadores, gráficos, tablas y paneles de detalle deben ser componentes reutilizables para futuros reportes.

## Legacy Screen Assessment

- What the legacy screen does: consolida saldos de clientes y proveedores, disponibilidades, antigüedad de facturas impagas y evolución de ingresos/egresos/resultado en una única pantalla.
- Main UX problems: bloques con igual peso, gráficos pequeños, datos secundarios dentro de listados principales, controles de recálculo repetidos, navegación superpuesta y ausencia de prioridades accionables.
- Information overload: clientes, proveedores, disponibilidades, dos tortas de antigüedad, resultados y selector multempresa compiten en el mismo viewport.
- Duplicated content: `Calcular`, `Todo`, `Recalcular` y “Última actualización” aparecen por bloque; los mismos importes se representan como tabla y torta sin explicar su relación.
- Obsolete or unclear content: rangos `0-10`, `11-25`, `41-0`, `Deu.Tot.`, `$Tot A$`, signos negativos y algunos iconos no tienen significado confirmado.
- Technical/system-only content: menú de escritorio, taskbar de Windows y controles de ventana no pertenecen a la nueva vista.
- Source limitations: una sola captura; el menú tapa parte de la pantalla; no hay estados vacíos, errores, permisos, detalle, filtros abiertos, exportación ni comportamiento al seleccionar gráficos.

## Workflow Modernization Assessment

### Current Workflow

| Step | User goal | Legacy behavior | Step classification | Keep / simplify / automate / remove candidate | Notes |
| --- | --- | --- | --- | --- | --- |
| Elegir alcance | Ver una empresa o consolidado | Checkboxes de empresas y botón Consolidar | essential decision | Simplify | Llevar a filtro global multiselección. |
| Buscar entidad | Encontrar cliente/proveedor | Campo Buscar por tabla | expert shortcut | Keep | Búsqueda contextual en detalle. |
| Calcular bloque | Actualizar información | Links Calcular/Todo/Recalcular repetidos | legacy workaround | Automate | Una actualización global con estado y timestamp. |
| Revisar saldos | Detectar mayores cuentas | Tablas densas con total al pie | essential decision | Keep, mejorar | Ranking gráfico más tabla exacta. |
| Revisar antigüedad | Entender vencimientos | Tortas por rangos y leyenda numérica | essential decision | Replace visualization | Barras apiladas comparables. |
| Revisar disponibilidades | Entender liquidez | Tabla de cuentas; aparece vacía | essential decision | Keep, mejorar | KPI, composición y tabla corta. |
| Revisar resultado | Comparar ingresos y egresos | Gráfico pequeño y link a informe | essential decision | Promote | Gráfico dominante con rango temporal. |
| Abrir detalle | Investigar un dato | `Inf. detallado` y posibles filas clickeables | useful confirmation | Keep, standardize | Sheet contextual o navegación a workspace existente. |
| Cambiar vista de resultado | Ver gráfico o listados | Tabs `Gráfico Resultado` / `Listados` | useful confirmation | Keep concept | Tabs dentro del módulo de resultados. |

### Simplification Opportunities

- Repeated work to reduce: reemplazar recálculos por bloque por actualización global y estados de frescura individuales.
- Data that can be safely defaulted: empresa/local activo del shell, período “Últimos 30 días” y moneda ARS para el prototipo.
- Technical decisions that can become user-facing choices: “Empresa / Consolidado”, “Unidad de negocio” y “Período”.
- Validation that should move earlier: incompatibilidad de períodos, falta de datos, series desactualizadas y dimensiones sin acceso.
- Legacy workarounds to remove: menú desplegable que tapa contenido; selector permanente de empresas; links subrayados para recalcular.
- User control that must remain: alcance por empresa, unidad y período; comparación por montos/porcentajes; acceso a valores exactos.

## Critical Workflow Notes

- Critical workflow: lectura financiera; no debe iniciar movimientos irreversibles desde el dashboard.
- Document/entity lifecycle: no modifica facturas, cuentas o resultados; refleja estados calculados por fuentes externas.
- Irreversible or high-risk actions: ninguna en esta vista. Cobrar, pagar, corregir o contabilizar debe ocurrir en su flujo autorizado.
- Fiscal/tax/authorization impact: los documentos pueden tener impacto fiscal, pero el dashboard solo los resume.
- Stock/account/payment impact: ninguno directo. Los saldos y pagos son datos de lectura.
- Safe draft or recovery behavior: no aplica; filtros pueden persistir en sesión.
- Preconditions before submission: no aplica. Exportar debe respetar filtros actuales y permisos.

## Critical Viewport Contract

- Baseline viewport: desktop 1366x768 como mínimo funcional; ideal 1440x900.
- Primary input that must be visible without scroll: empresa/consolidado, unidad de negocio y período.
- Relationship between primary input and working list/table: filtros globales afectan todos los indicadores y gráficos; filtros locales solo afectan su tabla de detalle.
- Working record/list that must be visible without scroll: no se exige tabla completa; sí resumen de resultado, alertas y antigüedad.
- Total/status that must be visible without scroll: disponibilidad, por cobrar, vencido por cobrar, por pagar, posición neta y última actualización.
- Primary action that must be visible without scroll: Actualizar y acceso al informe detallado.
- Blocking validation that must be visible without scroll: error de carga, datos parciales o desactualizados.
- Content allowed below the fold: rankings completos, tablas, metadatos de entidad, auditoría y exportación.
- Legacy layout strengths to preserve: totales visibles, comparación clientes/proveedores, consolidación y acceso directo al detalle.
- Density target: informativa y compacta; evitar tarjetas altas o decorativas.

## Roles And Permissions

| Role | Primary goal | Visible information | Allowed actions | Restricted actions | Notes |
| --- | --- | --- | --- | --- | --- |
| Dueño / administrador | Entender posición y riesgos | Todos los KPIs, margen, empresas y detalle | Filtrar, comparar, abrir detalle, exportar | No ejecutar cobros/pagos desde dashboard | Rol primario asumido. |
| Administrativo / tesorería | Gestionar vencimientos y liquidez | Saldos, antigüedad, disponibilidades | Filtrar, abrir entidades y comprobantes | Margen/consolidado según permiso | Permisos por confirmar. |
| Contable | Revisar resultado y consistencia | Resultados, saldos y documentos | Exportar y abrir informe | Acciones operativas | Rol no modelado aún en prototipo. |
| Vendedor | No necesita control financiero consolidado | Ninguno o resumen limitado | Sin acceso en prototipo | Dashboard completo | Decisión conservadora. |

## Screenshot / Capture Extraction

### Capture Inventory

| Capture | Surface type | Parent surface | Trigger / entry point | Purpose | Confirmation |
| --- | --- | --- | --- | --- | --- |
| `dashboard-financiero-main-screen.png` | main screen | Dashboard legacy | inicio / navegación legacy no visible | Resumen financiero consolidado | screenshot-inferred |

### Visible Structure

- Regions/panels/tabs/dialogs: menú superior y menú Archivo superpuesto; selector de empresas; tres tablas centrales; dos gráficos de torta; gráfico de resultados con tab Listados.
- Tables/lists: clientes, proveedores, disponibilidades, leyendas/tablas de facturas impagas y lista de empresas.
- Toolbars/action areas: Buscar, Calcular, Todo, Recalcular, Consolidar, Inf. detallado e iconos no identificados.
- Status/error/warning areas: “Última actualización” por bloque; no se observan alertas explícitas.
- Navigation or workflow indicators: menú global por módulos y tabs Gráfico Resultado / Listados.

### Extracted UI Inventory

- Alcance: empresa activa `7 - INFOMANAGER`, lista de siete empresas/sucursales, checkboxes y `Consolidar`.
- Clientes: Buscar, Calcular, Todo, Nombre, Saldo, IVA, CUIT, Teléfonos, última actualización, filas y total `72.873.092,06`.
- Proveedores: Buscar, Calcular, Todo, Nombre, Saldo, IVA, CUIT, Teléfonos, Domicilio, última actualización, filas y total `-9.096.271,54`.
- Disponibilidades: Buscar, Recalcular, Cod, Cuenta/Descripción, Saldo, Tipo y última actualización.
- Facturas impagas de clientes: título, Calcular, Todo, actualizado, Id, Descrip., Monto, Porc.%, rangos, `Deu.Tot.` y `$Tot A$`.
- Facturas impagas de proveedores: misma estructura con rangos y totales.
- Resultado: tabs Gráfico Resultado/Listados, Empresa, UN, Recalcular, Inf. detallado, título Resultado - Ingresos vs. Egresos, series Egresos, Ingresos y Margen.
- Navegación global visible: Archivo, Movimientos, Consultas, Varios, Fiscal, Ayuda; Refrescar listas, Tablas Maestras, Artículos, Gestión de Precios, Gestión de Ventas, Gestión Contable/Financiera, Impuestos, Configuración, Centro de Ayuda, Cierre de Sesión y Salir.

### Screenshot-Inferred Assumptions

- Los saldos centrales representan cuenta corriente y no necesariamente coinciden con el total de facturas impagas.
- Los rangos representan días de antigüedad, pero su semántica exacta no es legible.
- `$Tot A$` podría ser un total alternativo o convertido; no debe implementarse sin confirmación.
- Los puntos de color junto a filas podrían indicar estado o semáforo; su significado es desconocido.
- Los valores negativos de proveedores pueden ser una convención contable legacy, no un monto “malo”.
- `UN` significa unidad de negocio.
- Las filas y gráficos podrían abrir detalles, pero no está demostrado en la captura.

### Secondary Surface Decisions

- Legacy surface: `Listados` de resultado.
  - Modern pattern: tab secundaria dentro del módulo de resultados.
  - Data passed from parent: filtros globales y serie seleccionada.
  - Data returned to parent: ninguno; conserva selección.
  - Required validation: período y permisos.
  - Rationale: gráfico y tabla son representaciones pares del mismo informe.

- Legacy surface: información detallada.
  - Modern pattern: `Sheet` contextual para entidad/factura; navegación a workspace existente para informes completos.
  - Data passed from parent: entidad, rango, empresa, unidad y período.
  - Data returned to parent: ninguno; mantiene filtros al cerrar/volver.
  - Required validation: acceso al detalle.
  - Rationale: permite investigar sin perder la lectura consolidada.

## Information Architecture

### Keep Visible

- Filtros globales, estado de actualización y moneda.
- KPIs: disponibilidad, por cobrar, vencido por cobrar, por pagar y posición neta/resultado con etiqueta de supuesto.
- Gráfico dominante de ingresos, egresos y resultado.
- Alertas derivadas de deuda, pagos, disponibilidad y frescura.
- Antigüedad de cuentas por cobrar y por pagar con la misma escala.

### Move To Secondary

- Rankings de clientes y proveedores completos.
- Tablas exactas de facturas, cuentas y disponibilidades.
- CUIT, IVA, teléfono, domicilio y metadatos.
- Listado tabular del resultado.

### Hide By Default

- Identificadores técnicos, códigos internos y auditoría.
- Leyendas extendidas y definiciones de fórmula.
- Información de contacto hasta seleccionar entidad.

### Remove Candidate

- Tortas de antigüedad.
- Links repetidos Calcular/Todo/Recalcular.
- Selector lateral permanente de empresas.
- Menú legacy superpuesto y navegación duplicada.
- Colores de fila sin semántica confirmada.
- `$Tot A$` hasta confirmar significado.

### Needs Confirmation

- Definición y fórmula de cada KPI.
- Diferencia entre saldo de cuenta corriente y facturas impagas.
- Rangos formales de antigüedad.
- Signo y presentación de saldos proveedores.
- Significado de `$Tot A$` y puntos de color.
- Permisos para margen, consolidado y exportación.
- Acciones disponibles desde cada detalle.

## Field Decision Matrix

| Legacy item | Modern label | Source | Decision | Modern location | Priority | Data requirement | Confirmation | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Empresa `[7 - INFOMANAGER]` | Empresa activa | screenshot | Keep visible | filtro global | Primary | required | screenshot-inferred | Reutilizar contexto del shell. |
| Empresas 1-7 + checkboxes | Empresas incluidas | screenshot | Keep visible, simplify | combobox multiselección | Primary | array | screenshot-inferred | No panel fijo. |
| Consolidar | Ver consolidado | screenshot | Keep visible, simplify | selector de alcance | Primary | action | screenshot-inferred | Cambio de filtro, no CTA separado. |
| Buscar clientes | Buscar clientes | screenshot | Move to secondary | tab/ranking de clientes | Secondary | interaction | screenshot-inferred | Filtra ranking/tabla. |
| Calcular/Todo clientes | Actualizar dashboard | screenshot | Remove candidate | acción global | Low | action | needs user confirmation | Reemplazar repetición. |
| Nombre cliente | Cliente | screenshot | Keep visible | ranking/tabla | Primary | required | screenshot-inferred | |
| Saldo cliente | Saldo por cobrar | screenshot | Keep visible | barra + tabla | Primary | currency | needs user confirmation | Definición contable abierta. |
| IVA cliente | Condición de IVA | screenshot | Move to secondary | Sheet cliente | Low | optional | screenshot-inferred | |
| CUIT cliente | CUIT | screenshot | Move to secondary | Sheet cliente | Secondary | optional | screenshot-inferred | |
| Teléfonos cliente | Teléfono | screenshot | Move to secondary | Sheet cliente | Secondary | optional | screenshot-inferred | |
| Indicador de color cliente | Estado | screenshot | Needs confirmation | badge si se confirma | Secondary | unknown | needs user confirmation | No copiar color sin semántica. |
| Total clientes | Total por cobrar | screenshot | Keep visible | KPI | Primary | derived/display-only | needs user confirmation | No asumir igualdad con impagas. |
| Última actualización clientes | Actualizado | screenshot | Keep visible | estado global + tooltip por fuente | Secondary | datetime | screenshot-inferred | |
| Buscar proveedores | Buscar proveedores | screenshot | Move to secondary | tab/ranking proveedores | Secondary | interaction | screenshot-inferred | |
| Calcular/Todo proveedores | Actualizar dashboard | screenshot | Remove candidate | acción global | Low | action | needs user confirmation | |
| Nombre proveedor | Proveedor | screenshot | Keep visible | ranking/tabla | Primary | required | screenshot-inferred | |
| Saldo proveedor | Saldo por pagar | screenshot | Keep visible | barra + tabla | Primary | currency | needs user confirmation | Normalizar signo solo visualmente. |
| IVA proveedor | Condición de IVA | screenshot | Move to secondary | Sheet proveedor | Low | optional | screenshot-inferred | |
| CUIT proveedor | CUIT | screenshot | Move to secondary | Sheet proveedor | Secondary | optional | screenshot-inferred | |
| Teléfonos proveedor | Teléfono | screenshot | Move to secondary | Sheet proveedor | Secondary | optional | screenshot-inferred | |
| Domicilio proveedor | Domicilio | screenshot | Move to secondary | Sheet proveedor | Low | optional | screenshot-inferred | |
| Indicador de color proveedor | Estado | screenshot | Needs confirmation | badge si se confirma | Secondary | unknown | needs user confirmation | |
| Total proveedores | Total por pagar | screenshot | Keep visible | KPI | Primary | derived/display-only | needs user confirmation | |
| Última actualización proveedores | Actualizado | screenshot | Keep visible | estado global + tooltip | Secondary | datetime | screenshot-inferred | |
| Buscar disponibilidades | Buscar cuentas | screenshot | Move to secondary | detalle de disponibilidades | Low | interaction | screenshot-inferred | |
| Recalcular disponibilidades | Actualizar dashboard | screenshot | Remove candidate | acción global | Low | action | needs user confirmation | |
| Cod | Código de cuenta | screenshot | Hide by default | tabla de detalle | Low | optional | screenshot-inferred | |
| Cuenta/Descripción | Cuenta | screenshot | Keep visible | composición/tabla | Secondary | required | screenshot-inferred | Texto de encabezado parcialmente legible. |
| Saldo disponibilidad | Disponible | screenshot | Keep visible | KPI/barra/tabla | Primary | currency | screenshot-inferred | |
| Tipo disponibilidad | Tipo de cuenta | screenshot | Move to secondary | tabla | Secondary | optional | screenshot-inferred | |
| Última actualización disponibilidades | Actualizado | screenshot | Keep visible | estado global + tooltip | Secondary | datetime | screenshot-inferred | |
| Fact. Impagas de Clientes | Antigüedad de cuentas por cobrar | screenshot | Keep visible, transform | barras apiladas | Primary | array | screenshot-inferred | Reemplazar torta. |
| Id rango cliente | Rango | screenshot | Move to secondary | tooltip/tabla | Low | required | screenshot-inferred | Identificador no visible al usuario. |
| Descrip. rango cliente | Antigüedad | screenshot | Keep visible | eje/leyenda | Primary | required | needs user confirmation | Traducir cuando se confirmen rangos. |
| Monto rango cliente | Monto | screenshot | Keep visible | barra/tooltip | Primary | currency | screenshot-inferred | |
| Porc.% rango cliente | Participación | screenshot | Keep visible | tooltip/alternancia % | Secondary | derived | screenshot-inferred | |
| Deu.Tot. cliente | Total pendiente | screenshot | Keep visible | KPI/subtítulo | Primary | currency | needs user confirmation | Etiqueta exacta abierta. |
| `$Tot A$` cliente | Total alternativo | screenshot | Needs confirmation | no renderizar en MVP | Low | unknown | needs user confirmation | No excluir definitivamente. |
| Calcular/Todo impagas cliente | Actualizar dashboard | screenshot | Remove candidate | acción global | Low | action | needs user confirmation | |
| Actualizado impagas cliente | Actualizado | screenshot | Keep visible | tooltip de frescura | Secondary | datetime | screenshot-inferred | |
| Fact. Impagas de Proveedores | Antigüedad de cuentas por pagar | screenshot | Keep visible, transform | barras apiladas | Primary | array | screenshot-inferred | Misma escala que clientes. |
| Id/Descrip./Monto/Porc. proveedor | Rango, antigüedad, monto, participación | screenshot | Keep visible/secondary | gráfico + tooltip | Primary | array | screenshot-inferred | Agrupado por repetición. |
| Deu.Tot. proveedor | Total pendiente | screenshot | Keep visible | KPI/subtítulo | Primary | currency | needs user confirmation | |
| `$Tot A$` proveedor | Total alternativo | screenshot | Needs confirmation | no renderizar en MVP | Low | unknown | needs user confirmation | |
| Calcular/Todo impagas proveedor | Actualizar dashboard | screenshot | Remove candidate | acción global | Low | action | needs user confirmation | |
| Actualizado impagas proveedor | Actualizado | screenshot | Keep visible | tooltip de frescura | Secondary | datetime | screenshot-inferred | |
| Gráfico Resultado | Evolución | screenshot | Keep visible | tab por defecto | Primary | interaction | screenshot-inferred | |
| Listados | Detalle tabular | screenshot | Move to secondary | tab | Secondary | interaction | screenshot-inferred | |
| Empresa resultado | Empresa | screenshot | Keep visible, deduplicate | filtro global | Primary | required | screenshot-inferred | No duplicar localmente. |
| UN | Unidad de negocio | screenshot | Keep visible | filtro global | Primary | optional | needs user confirmation | |
| Recalcular resultado | Actualizar dashboard | screenshot | Remove candidate | acción global | Low | action | needs user confirmation | |
| Inf. detallado | Ver informe detallado | screenshot | Keep visible | acción secundaria del gráfico | Secondary | action | screenshot-inferred | |
| Ingresos | Ingresos | screenshot | Keep visible | área/línea + tooltip | Primary | currency/time-series | screenshot-inferred | |
| Egresos | Egresos | screenshot | Keep visible | área/línea + tooltip | Primary | currency/time-series | screenshot-inferred | |
| Margen | Resultado / margen | screenshot | Keep visible | línea + KPI | Primary | derived | needs user confirmation | Confirmar si margen es monto o porcentaje. |
| Menú global legacy | Navegación del producto | screenshot | Remove candidate from view | shell existente | Low | n/a | screenshot-inferred | No recrear Archivo/Movimientos/etc. |
| Refrescar listas | Actualizar datos | screenshot | Remove candidate | botón Actualizar | Low | action | needs user confirmation | Unificar. |
| Configuración/Ayuda/Cierre/Salir | Utilidades globales | screenshot | Move to existing shell | sidebar/footer | Low | n/a | screenshot-inferred | No son contenido del dashboard. |

## Action And Capability Model

| Action / capability | Frequency | Risk | Permission | Modern placement | Confirmation | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Cambiar empresa/consolidado | always visible | safe | scope-gated | header | assumption | Actualiza todos los módulos. |
| Cambiar período | always visible | safe | all dashboard users | header | assumption | Default últimos 30 días. |
| Cambiar unidad de negocio | frequent secondary | safe | scope-gated | header | needs user confirmation | Puede omitirse si no existe. |
| Actualizar | frequent secondary | safe | all dashboard users | header | assumption | Estado loading sin borrar datos previos. |
| Alternar monto/porcentaje | frequent secondary | safe | all dashboard users | tabs/toggle del gráfico | assumption | Para antigüedad. |
| Seleccionar segmento/barra | frequent secondary | safe | all dashboard users | gráfico | assumption | Filtra detalle. |
| Abrir cliente/proveedor | frequent secondary | safe | entity permission | Sheet / workspace | assumption | Mantener filtros. |
| Ver informe detallado | occasional | safe | report permission | acción del módulo | screenshot-inferred | |
| Exportar | occasional | data-sensitive | export permission | menú de acciones | product-confirmed pattern | Exporta filtros actuales. |
| Cobrar/pagar/corregir | dangerous from dashboard | risky/irreversible | role-gated | Do not include | assumption | Navegar al flujo correspondiente si se agrega. |

## Proposed View Structure

### Layout And Viewport Strategy

- First viewport: título y filtros; cinco KPIs compactos; gráfico dominante de resultados; panel de alertas; inicio de antigüedad por cobrar/pagar.
- Fixed/sticky areas: shell existente; filtros pueden quedar sticky bajo header en scroll largo.
- Scrollable areas: contenido completo del dashboard y tablas de detalle.
- Right/left action rail: no crear rail permanente; usar `Sheet` para detalle contextual.
- Bottom summary/action bar: no aplica.
- Rationale: prioriza decisión y tendencia, deja precisión tabular disponible sin copiar la densidad legacy.

### Header

- Purpose: establecer alcance y frescura.
- Content: Dashboard financiero, empresa/consolidado, unidad, período, moneda y última actualización.
- Actions: Actualizar y menú Exportar.
- Rationale: un solo contrato de filtros reemplaza controles repetidos.

### Primary Content

- Purpose: mostrar posición actual, evolución y excepciones.
- Content: KPIs, gráfico combinado de ingresos/egresos/resultado, alertas, barras apiladas de antigüedad.
- Actions: cambiar rango, seleccionar serie/segmento y abrir detalle.
- Rationale: las visualizaciones comparativas son más útiles que tortas y tablas simultáneas.

### Secondary Content

- Purpose: investigar entidades y valores exactos.
- Content: rankings de clientes/proveedores, composición de disponibilidades y tablas.
- Disclosure pattern: tabs, secciones bajo fold y Sheet contextual.
- Rationale: preserva capacidad sin competir con el panorama financiero.

### Navigation

- Entry points: nuevo ítem `Dashboard` o `Control > Dashboard` en el shell; solo admin en prototipo.
- Exit points: clientes, proveedores, cuenta corriente, documentos, recibos, pagos e informe de resultados.
- Related views: workspaces existentes del prototipo.
- Rationale: el dashboard orienta; las operaciones ocurren en módulos especializados.

### Dialogs, Drawers, And Secondary Surfaces

- Surface: detalle contextual de entidad/rango/cuenta.
- Trigger: clic en barra, fila, KPI o alerta.
- Purpose: mostrar composición, documentos y metadatos sin perder filtros.
- Content: resumen, tabla corta, CUIT/contacto si aplica y acción para abrir workspace completo.
- Actions: Abrir cuenta corriente/documentos/proveedor; cerrar.
- Validation: acceso y existencia del registro.
- Rationale: investigación rápida sin navegación destructiva.

## Interaction And States

- Loading: Skeleton en KPIs y gráficos; conservar filtros y, en refresh, datos previos con indicador de carga.
- Empty: mensaje específico por módulo, no dashboard vacío global si otras fuentes tienen datos.
- Error: Alert por fuente fallida y opción Reintentar; datos parciales permanecen visibles.
- Permission denied: vista no disponible en navegación; acceso directo muestra explicación.
- Partial data: badge `Datos parciales` y módulos afectados identificados.
- Validation: impedir rangos inválidos y explicar incompatibilidad de filtros.
- Unsaved changes: no aplica.
- Destructive actions: no existen.
- Stale data: badge con antigüedad y timestamp; no confundir “sin datos” con “sin actualizar”.

## Business Rules

- Los filtros globales deben afectar todos los módulos o cada módulo debe declarar por qué no aplica.
- Los importes deben mostrar moneda y formato local argentino.
- Los totales de cuenta corriente y facturas pendientes son métricas distintas hasta confirmación.
- El dashboard no debe convertir signos ni derivar posición neta con fórmulas no confirmadas.
- Los rangos de antigüedad deben provenir de datos/configuración, no hardcodearse como verdad de negocio.
- Los gráficos deben conservar valores accesibles en tooltip, etiquetas o tabla equivalente.
- Exportar usa exactamente empresa, unidad, período y filtros activos.

## Defaults, Automation, And Validation

- Safe defaults: empresa/local activo, ARS, últimos 30 días, vista monto y cinco principales entidades.
- Suggested editable defaults: consolidado si el rol tiene acceso; período anterior para comparación.
- Defaults requiring confirmation: unidad de negocio y fórmula de posición neta.
- Decisions that must remain manual: alcance multempresa y exportación.
- Inline validation: período inválido, empresa sin acceso y dimensión incompatible.
- Action gating: exportar deshabilitado sin datos; detalle deshabilitado si la fuente no entrega identificador.
- Post-submit validation: no aplica.
- Recovery from failed submit: actualización fallida conserva última lectura y permite reintento.

## Data And State Notes

- Core entities: DashboardSnapshot, Company, BusinessUnit, FinancialMetric, AgingBucket, PartyBalance, AvailabilityAccount, ResultPoint y DashboardAlert.
- Field groups: filtros, KPIs, frescura, antigüedad, rankings, disponibilidades, resultado y alertas.
- Arrays/tables: companies, units, customerBalances, supplierBalances, receivableAging, payableAging, availabilityAccounts, resultSeries y alerts.
- Status values: fresh, stale, partial, loading, error; current, due-soon, overdue, critical.
- Required vs optional values: identificadores, labels, montos y fechas requeridos para render principal; contacto, IVA y domicilio opcionales.
- Derived/display-only values: porcentajes por rango, tendencias y totales solo si la fuente o mock los provee explícitamente.
- Unknown or ambiguous data: fórmulas de margen/posición, signos legacy, `$Tot A$`, semáforos y rangos.

## UX Rationale

- KPIs compactos: permiten reconocer la posición general antes de leer gráficos o tablas.
- Resultado dominante: conecta la foto actual con la evolución temporal y evita que el gráfico quede relegado como en legacy.
- Barras para antigüedad: permiten comparar rangos y clientes/proveedores usando una escala común.
- Rankings más tablas: el gráfico responde “quién concentra el monto”; la tabla conserva exactitud y búsqueda.
- Actualización global: reduce fricción sin ocultar la frescura individual de cada fuente.
- Detalle lateral: preserva contexto y evita multiplicar ventanas.

## Open Questions And Assumptions

### Confirmed

- La vista debe modernizar el dashboard legacy y ser lo más gráfica posible.
- Se usará shadcn/ui y se entregará documentación al builder.
- El dashboard debe cubrir clientes, proveedores, impagas, disponibilidades y resultado.

### Assumptions for prototype

- Usuario principal: administrador/dueño.
- Solo el rol `admin` accede en el prototipo actual.
- El dashboard es de solo lectura.
- Período por defecto: últimos 30 días; moneda ARS.
- `Sheet` contextual usa mock data y no ejecuta transacciones.
- Los gráficos se implementan con shadcn `Chart` + Recharts.

### Needs validation before production

- Fórmulas, rangos, permisos y rutas de detalle.
- Empresa vs. local vs. unidad de negocio.
- Significado de `$Tot A$`, colores y signos negativos.
- Si margen es monto, porcentaje o ambas cosas.

## Product Context References

- Product context: `./product-context.md`
- Flow context: `./flows/dashboard-financiero.md`; conserva como abiertas las formulas, dimensiones y permisos que requieren validacion.

## UI Handoff Notes

- Implementar desde `./dashboard-financiero-ui-handoff.md`.
- Mantener el shell y navegación existentes.
- Priorizar gráficos legibles, no decoración ni card-grid excesivo.
- No inventar comportamiento transaccional ni fórmulas contables.

## Reusable Product Components

- DashboardFilterBar.
- FinancialMetricCard.
- FinancialTrendChart.
- AgingComparisonChart.
- PartyBalanceRanking.
- AvailabilityBreakdown.
- DashboardAlertList.
- FinancialDetailSheet.
- DataFreshnessBadge.
- ReportExportMenu.

## Acceptance Criteria

- El primer viewport muestra alcance, frescura, KPIs, resultado, alertas y antigüedad sin depender de tablas completas.
- Clientes y proveedores usan visualizaciones comparables.
- Las tortas legacy no se recrean.
- Todo gráfico tiene valores accesibles y alternativa tabular.
- Los filtros globales son coherentes y visibles.
- Los datos secundarios permanecen disponibles en tabla o Sheet.
- No se ejecutan cobros, pagos, correcciones ni asientos desde el dashboard.
- Los estados loading, empty, error, partial, stale y permission denied están representados.
- Cada elemento identificado en la captura aparece en la matriz de decisión.
- Los supuestos contables y de permisos no se presentan como hechos confirmados.
