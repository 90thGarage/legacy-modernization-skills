# Catalogo de productos UX Brief

## Metadata

- View ID: `catalogo-productos`
- Source: capturas legacy de ABM Articulos, Articulos Seriados, Balanza, Caracteristicas, Costo Produccion, Depositos, Variaciones, Rubros y detalle de campos de articulo.
- Product context: `./product-context.md`
- Flow context: `./flows/catalogo-articulos.md` (`catalogo-productos.md` queda como alias historico).
- Created: 2026-07-03
- Status: Draft listo para aprobacion
- Confidence: Media-alta para arquitectura UX; media para reglas fiscales, permisos y reglas especificas de balanza/series/variaciones.
- Language: Espanol

## Product Context Alignment

- Product context source: `./product-context.md`.
- Flow context source: `./flows/catalogo-articulos.md`.
- Request classification: single-view modernization inside a known flow.
- Product-level decisions reused: catalogo como workspace unico; alta guiada reemplaza Alta Rapida; capacidades especiales se activan manualmente; rubro/subrubro pueden crearse contextualmente.
- Product-level conflicts or contradictions: ninguno documentado.
- Product-level assumptions: permisos finos, reglas fiscales y reglas exactas de stock siguen abiertas.
- Related reusable product patterns: busqueda + grilla compacta + panel rapido; alta guiada con capacidades opcionales; ajuste auditado.

## Module Context

- Module: Articulos / ABM / Catalogo comercial.
- Previous step: navegacion desde menu Articulos > ABM o accesos relacionados.
- Next step: uso del producto en venta, compra, etiquetas, balanza, stock, consultas y reportes.
- Related views: Articulos, Rubros, Caracteristicas, Depositos, Articulos Seriados, Balanza, Generacion de variaciones, Costo de Produccion.
- Shared entities: Producto, Rubro, Subrubro, Caracteristica, Valor de caracteristica, Deposito, Stock por deposito, Proveedor, Serie, Variacion, Precio, Codigo de barras, PLU, Unidad de medida, Concepto AFIP.
- Role or permission dependencies: todos los usuarios que cargan productos pueden crear clasificaciones simples. Permisos finos para acciones destructivas y configuraciones tecnicas quedan abiertos.

## User And Context

- Primary user: usuario de pyme, no necesariamente nativo tecnologico, con trabajo administrativo y de mostrador.
- Secondary users: responsable de catalogo, vendedor de mostrador, administrador, soporte.
- Usage context: carga administrativa de productos en momentos sin cliente; busqueda, consulta y edicion rapida pueden ocurrir con cliente esperando.
- Primary task: crear, encontrar y mantener productos vendibles.
- Secondary tasks: editar precio, codigo, estado, stock, clasificacion, proveedor/logistica, balanza, series, variaciones, receta/costo y datos fiscales.
- Frequency: alta y edicion son frecuentes; consulta y edicion rapida son criticas por presion de tiempo.
- Decision pressure: alta media para creacion; alta para busqueda/edicion rapida en mostrador.

## Product And Adoption Context

- Existing user base: usuarios acostumbrados a ABM separados, tablas densas y acciones de toolbar.
- Adoption expectation: debe sentirse reconocible pero mucho mas facil de entender.
- Training constraints: el producto debe guiar sin depender de capacitacion extensa.
- Known business language to preserve: articulo, producto, rubro, subrubro, proveedor, deposito, codigo de barras, precio, PLU, balanza, serie, variacion, receta, costo de produccion.
- Legacy concepts that can be renamed: ABM puede convertirse en Catalogo; Alta Rapida no debe ser el camino principal; Generacion de variaciones puede llamarse Variaciones; Art. Seriados puede llamarse Series.
- Product maintainability concerns: las pantallas comparten la misma logica ABM y deben convertirse en componentes reutilizables: listado, detalle lateral, formulario guiado, selector con creacion contextual, ajuste auditado.

## Legacy Screen Assessment

- What the legacy screen does: permite administrar productos y ABM auxiliares relacionados desde muchas pestanas separadas.
- Main UX problems: demasiadas superficies equivalentes, poca jerarquia entre tarea principal y configuraciones, dependencia de saber en que ABM entrar, formularios densos, campos opcionales mezclados con datos basicos.
- Information overload: Articulos muestra tabla, tabs, paneles de identidad, informacion basica, proveedor, logistica, medidas y configuraciones especiales al mismo tiempo.
- Duplicated content: Rubros, Caracteristicas y Depositos repiten patron de tabla + formulario; Variaciones, Series, Balanza y Costos son capacidades de producto pero aparecen como pantallas separadas.
- Obsolete or unclear content: codigos de compatibilidad, cod. fabricante, fecha de origen, porc. comision, cod. variacion y algunos campos de exportacion necesitan confirmacion de uso real.
- Technical/system-only content: Base `test_maxi`, version, usuario, zoom, modo claro, tabs tecnicas y algunos codigos internos no deben competir con el flujo.
- Source limitations: no hay capturas de modales de seleccion, errores de validacion, permisos, confirmaciones, historial de stock, listas de precio ni resultados de informes.

## Workflow Modernization Assessment

### Current Workflow

| Step | User goal | Legacy behavior | Step classification | Keep / simplify / automate / remove candidate | Notes |
| --- | --- | --- | --- | --- | --- |
| Buscar articulo | Encontrar un producto existente | Busqueda global en ABM Articulos y grilla paginada | essential decision | Keep, mejorar | Debe aceptar descripcion, codigo y codigo de barras. |
| Consultar datos | Ver precio, codigo, estado y stock | Seleccion en tabla y formulario inferior con tabs | essential decision | Simplify | Debe resolverse desde listado + panel lateral. |
| Crear articulo | Dar de alta un producto vendible | Boton Nuevo / Alta Rapida y formulario denso | essential decision | Simplify | Reemplazar camino principal por alta guiada. |
| Editar precio | Corregir precio de venta | Edicion dentro del formulario completo | expert shortcut | Keep visible | Es una de las ediciones mas frecuentes. |
| Editar codigo/codigo de barras | Corregir identificacion | Formulario completo | essential decision | Keep visible | Debe estar en edicion rapida. |
| Cambiar estado habilitado | Activar/desactivar venta | Checkbox Habilitado | essential decision / risky | Keep visible | Debe explicar impacto si deshabilita. |
| Ajustar stock | Corregir existencia | No se ve en captura principal; Depositos existe aparte | compliance/audit | Simplify | Debe ser operacion auditada con deposito y motivo. |
| Completar clasificacion | Asignar rubro/subrubro | ABM Rubros separado y selectores en Articulo | useful confirmation | Merge contextually | Crear rubro/subrubro desde producto con control de duplicados. |
| Completar caracteristicas | Agregar atributos | ABM Caracteristicas separado | optional/expert | Move to secondary | Usar panel "Caracteristicas". |
| Configurar balanza | Preparar producto pesable | Pantalla Balanza separada | optional/expert | Move to capability panel | Usuario decide manualmente si aplica. |
| Manejar series | Cargar numeros de serie | Pantalla Series separada | optional/expert | Move to capability panel | Aparece solo si producto maneja series. |
| Generar variaciones | Crear productos derivados | Pantalla Variaciones separada | optional/expert | Move to guided tool | Requiere producto base y caracteristicas. |
| Costo/receta | Ver o generar costo de produccion | Pantalla reporte con filtros | occasional/expert | Move to secondary tool | No debe dominar alta comun. |
| Gestionar depositos | Administrar depositos | ABM Depositos separado | admin/basic catalog | Keep as admin section | Tambien usado por ajuste de stock. |

### Simplification Opportunities

- Repeated work to reduce: salir del producto para crear rubros/subrubros o configurar capacidades relacionadas.
- Data that can be safely defaulted: producto habilitado, tipo `Compra & Venta`, concepto AFIP `Producto`, equivalencia UM `1`, tipo codigo de barra `Normal`, presentacion minima `1`.
- Technical decisions that can become user-facing choices: "Usa balanza", "Maneja series", "Tiene variaciones", "Usa receta/costo", "Controlar por deposito".
- Validation that should move earlier: descripcion vacia, rubro/subrubro faltante si el negocio lo exige, codigo duplicado, codigo de barras duplicado, precio invalido, stock sin motivo, deposito requerido en ajuste.
- Legacy workarounds to remove: abrir muchas pestanas ABM para completar un producto comun.
- User control that must remain: usuario decide manualmente que capacidades aplican al producto.

## Critical Workflow Notes

- Critical workflow: consulta y edicion rapida de productos en mostrador; ajuste de stock con auditoria.
- Document/entity lifecycle: Producto puede estar borrador/parcial, habilitado, deshabilitado, con configuracion incompleta o con capacidades activas.
- Irreversible or high-risk actions: eliminar producto, deshabilitar producto con stock/ventas, ajustar stock, generar variaciones masivas, editar precio.
- Fiscal/tax/authorization impact: Concepto AFIP aparece en articulo; reglas exactas necesitan confirmacion.
- Stock/account/payment impact: ajuste de stock afecta inventario y requiere deposito + motivo/auditoria.
- Safe draft or recovery behavior: alta guiada debe permitir guardar borrador o guardar producto incompleto con estado claro, si backend lo permite.
- Preconditions before submission: descripcion minima, estado, tipo de articulo, precio si se quiere vender, validaciones de codigo/codigo de barras y capacidades activadas.

## Critical Viewport Contract

- Baseline viewport: desktop 1366x768 como minimo funcional; ideal 1440+.
- Primary input that must be visible without scroll: buscador de productos por descripcion, codigo y codigo de barras.
- Relationship between primary input and working list/table: buscador inmediatamente encima del listado que filtra.
- Working record/list that must be visible without scroll: listado de productos con precio, codigo/codigo de barras, estado y stock resumido.
- Total/status that must be visible without scroll: estado habilitado/deshabilitado y alertas del producto seleccionado; stock resumido.
- Primary action that must be visible without scroll: Crear producto, Editar rapido, Ajustar stock, Editar completo.
- Blocking validation that must be visible without scroll: errores de busqueda/carga, duplicados, stock sin motivo, precio invalido, producto deshabilitado.
- Content allowed below the fold: historial, auditoria, configuraciones avanzadas, detalle completo, reportes, logs de balanza.
- Legacy layout strengths to preserve: grilla compacta para scanning, busqueda visible, acciones conocidas, datos tabulares.
- Density target: denso pero guiado; evitar tarjetas grandes de marketing.

## Roles And Permissions

| Role | Primary goal | Visible information | Allowed actions | Restricted actions | Notes |
| --- | --- | --- | --- | --- | --- |
| Usuario de mostrador | Buscar, consultar y corregir rapido | Precio, codigo, estado, stock, codigo de barras | Buscar, editar rapido, ajustar stock con motivo, crear producto guiado | Eliminar y acciones masivas pueden requerir confirmacion/permiso | Usuario poco tecnologico. |
| Administrativo | Crear y mantener catalogo | Todos los datos del producto y secciones opcionales | Alta guiada, edicion completa, crear rubros/subrubros, variaciones | Acciones destructivas segun politica | Carga no ocurre con cliente esperando. |
| Administrador/responsable | Ordenar catalogo y corregir estructura | ABM auxiliares, auditoria, duplicados | Administrar rubros, caracteristicas, depositos, configuraciones | N/A | Puede resolver inconsistencias. |
| Soporte | Diagnosticar problemas | Metadata, compatibilidad, logs | Ver datos tecnicos | Edicion segun permiso | Informacion tecnica debe estar secundaria. |

## Screenshot / Capture Extraction

### Capture Inventory

| Capture | Surface type | Parent surface | Trigger / entry point | Purpose | Confirmation |
| --- | --- | --- | --- | --- | --- |
| `catalogo-productos-main-articulos.png` | main screen | Catalogo | Articulos > ABM | Listar y editar articulos | screenshot-inferred |
| `catalogo-productos-datos-articulo-detalle.png` | detail/form section | Articulos | Tab Datos Generales | Ver campos del articulo | user-confirmed as optional/advanced except core not fully defined |
| `catalogo-productos-rubros.png` | ABM auxiliary | Catalogo | Rubros tab/menu | Administrar rubros y subrubros | screenshot-inferred |
| `catalogo-productos-caracteristicas.png` | ABM auxiliary | Catalogo | Caracteristicas tab/menu | Administrar caracteristicas y valores | screenshot-inferred |
| `catalogo-productos-depositos.png` | ABM auxiliary | Catalogo/stock | Depositos tab/menu | Administrar depositos | screenshot-inferred |
| `catalogo-productos-series.png` | state/tool | Producto | Articulos seriados | Manejar series de articulos | screenshot-inferred |
| `catalogo-productos-balanza.png` | tool/state | Producto | Balanza | Sincronizar productos pesables | screenshot-inferred |
| `catalogo-productos-variaciones.png` | generation tool | Producto | Generacion de variaciones | Crear variantes desde producto base | screenshot-inferred |
| `catalogo-productos-costo-produccion.png` | report/tool | Producto/costos | Costo Produccion | Generar informe de costo | screenshot-inferred |

### Visible Structure

- Regions/panels/tabs/dialogs: sidebar de navegacion, pestanas superiores, toolbar por vista, grilla principal, tabs inferiores de articulo, paneles de formulario, ABM auxiliares con tabla + formulario, herramientas separadas.
- Tables/lists: articulos, rubros, subrubros, caracteristicas, valores, depositos, series, resultados de balanza.
- Toolbars/action areas: Nuevo, Editar, Copiar, Grabar, Eliminar, Cancelar, Alta Rapida, Editar series, Generar informe, Imprimir, Exportar, Previsualizar, Generar.
- Status/error/warning areas: "Complemento local no detectado", "Sin resultados", "No hay articulos seriados", "Sin eventos".
- Navigation or workflow indicators: tabs superiores y menu lateral muestran separacion legacy por ABM.

### Extracted UI Inventory

- Producto: codigo, descripcion, codigo de barras, precio venta, habilitado, imagen, archivo, camara, cod. fabricante, rubro, subrubro, articulo de, PLU, tipo codigo barra, cod. compatibilidad, fecha de origen, proveedor, presentacion minima, ubicacion en deposito, unidad de medida, equivalencia UM, unidad medida exportar, concepto AFIP, cod. variacion, porc. comision, descripcion corta, compuesto/receta.
- Rubros: codigo, descripcion, subrubros, codigo compatibilidad, lista de subrubros.
- Caracteristicas: codigo, descripcion, orden, seleccion, agrupado, mostrar descripcion, valores, imp. check.
- Depositos: codigo, descripcion, tipo, cod. empresa, punto de venta, domicilio.
- Balanza: balanza destino, modo por articulo, modo masivo/lista de precios, busqueda, codigo, descripcion, PLU, precio, registro de eventos, alerta complemento local.
- Series: lista de articulos seriados, series, editar series, mensaje vacio.
- Variaciones: articulo base, caracteristica 1, caracteristica 2 opcional, previsualizar, generar.
- Costo: filtros rubro, subrubro, articulo codigo, generar informe, imprimir, exportar.

### Screenshot-Inferred Assumptions

- Precio de venta principal aparece como un unico precio visible.
- Las capacidades Series, Balanza, Variaciones y Costo aplican solo a algunos productos.
- Los ABM auxiliares comparten patrones que pueden convertirse en secciones contextuales.
- Los asteriscos de la captura no representan necesariamente obligatoriedad general; el usuario aclaro que muchos son opciones avanzadas segun producto.
- La creacion de producto debe ser guiada, no "Alta Rapida" como camino principal.

### Secondary Surface Decisions

- Legacy surface: Rubros/Subrubros.
  - Modern pattern: merge into selector contextual + administracion secundaria.
  - Data passed from parent: rubro/subrubro seleccionado o busqueda sin resultado.
  - Data returned to parent: nuevo rubro/subrubro seleccionado.
  - Required validation: nombre, duplicados, relacion subrubro-rubro.
  - Rationale: todos pueden crear clasificaciones, pero el flujo debe evitar desorden del catalogo.

- Legacy surface: Caracteristicas/Valores.
  - Modern pattern: panel secundario en producto + administracion avanzada.
  - Data passed from parent: producto y categoria.
  - Data returned to parent: caracteristicas asignadas.
  - Required validation: duplicados y valores requeridos si se usan para variaciones.
  - Rationale: es relevante para algunos productos, no para toda alta.

- Legacy surface: Balanza.
  - Modern pattern: capability panel "Usa balanza/PLU" y herramienta de sincronizacion secundaria.
  - Data passed from parent: producto, PLU, precio, balanza destino.
  - Data returned to parent: estado de sincronizacion/eventos.
  - Required validation: PLU, precio, balanza destino, complemento local.
  - Rationale: hacer visible cuando aplica sin obligar a todos los usuarios a entender la integracion.

- Legacy surface: Series.
  - Modern pattern: capability panel "Maneja series".
  - Data passed from parent: producto.
  - Data returned to parent: lista de numeros de serie.
  - Required validation: unicidad de serie y estado.
  - Rationale: ocultar por defecto, pero con acceso claro desde producto.

- Legacy surface: Variaciones.
  - Modern pattern: herramienta guiada desde producto base.
  - Data passed from parent: producto base, caracteristicas.
  - Data returned to parent: preview y productos variantes generados.
  - Required validation: caracteristicas seleccionadas, duplicados, confirmacion antes de generar.
  - Rationale: es una accion masiva de riesgo moderado.

- Legacy surface: Costo de produccion.
  - Modern pattern: seccion secundaria o reporte desde producto/filtros.
  - Data passed from parent: producto/rubro/subrubro.
  - Data returned to parent: informe.
  - Required validation: filtros minimos.
  - Rationale: reporte ocasional, no parte del alta comun.

## Information Architecture

### Keep Visible

- Buscador de productos.
- Listado de productos con codigo, descripcion, codigo de barras, precio, estado y stock resumido.
- Acciones Crear producto, Editar rapido, Ajustar stock, Editar completo.
- Panel lateral del producto seleccionado con precio, codigo, codigo de barras, estado, stock, rubro/subrubro y alertas.

### Move To Secondary

- Imagen, proveedor/logistica, unidad de medida, concepto AFIP, PLU/balanza, series, variaciones, receta/costo, caracteristicas, compatibilidad, fabricante, fecha de origen.
- Administracion completa de rubros, caracteristicas y depositos.
- Historial de cambios, auditoria de stock y eventos de balanza.

### Hide By Default

- Codigos tecnicos de compatibilidad.
- Metadata de sistema, version, base, zoom.
- Historial y eventos cuando no hay alerta.

### Remove Candidate

- Pestanas superiores legacy como mecanismo principal de trabajo.
- "Alta Rapida" como CTA principal.
- Formularios vacios siempre visibles debajo de cada ABM auxiliar.
- Duplicacion de navegacion lateral + tabs superiores para la misma familia.

### Needs Confirmation

- Reglas obligatorias exactas para guardar producto.
- Si rubro/subrubro es requerido por negocio.
- Reglas fiscales de Concepto AFIP.
- Reglas de permisos para eliminar, generar variaciones, editar costo y deshabilitar.
- Reglas exactas de series, balanza y listas de precio/descuento.

## Field Decision Matrix

| Legacy item | Modern label | Source | Decision | Modern location | Priority | Data requirement | Confirmation | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ABM Articulos | Catalogo de productos | screenshot | Keep visible | titulo de workspace | Primary | display-only | assumption | Cambiar de ABM a lenguaje de tarea. |
| Buscar | Buscar productos | screenshot/user | Keep visible | header/listado | Primary | required interaction | confirmed | Buscar por descripcion, codigo y codigo de barras. |
| Codigo | Codigo interno | screenshot/user | Keep visible | listado, panel rapido, formulario | Primary | optional/unknown | confirmed | Edicion frecuente. |
| Descripcion | Nombre del producto | screenshot/user | Keep visible | listado, alta guiada, panel | Primary | required/unknown | confirmed | Dato central del producto. |
| Cod. Barras | Codigo de barras | screenshot/user | Keep visible | listado, panel rapido, venta y codigos | Primary | optional | confirmed | Edicion frecuente. |
| Precio Vta. | Precio de venta | screenshot/user | Keep visible | listado y panel rapido | Primary | optional/required to sell | confirmed | Un solo precio principal. |
| Habilitado | Estado de venta | screenshot/user | Keep visible | listado/panel rapido | Primary | required/derived | confirmed | Activado por defecto; deshabilitar debe explicar impacto. |
| Nuevo | Crear producto | screenshot/user | Keep visible | header | Primary | action | confirmed | Abre alta guiada. |
| Alta Rapida | Alta guiada | screenshot/user | Remove candidate | reemplazar | Primary | action | confirmed | No como camino principal. |
| Editar | Editar completo | screenshot/user | Keep visible | panel/listado | Secondary | action | confirmed | Abre formulario guiado completo. |
| Copiar | Duplicar producto | screenshot | Move to secondary | menu acciones | Secondary | action | assumption | Util para expertos. |
| Grabar | Guardar | screenshot | Keep visible | formularios/panel | Primary | action | confirmed | Debe guardar solo cambios del contexto. |
| Eliminar | Eliminar producto | screenshot | Move to secondary | menu peligroso | Low | action | assumption | Requiere confirmacion/permiso. |
| Cancelar | Cancelar cambios | screenshot | Keep visible | formularios | Secondary | action | assumption | Debe advertir cambios sin guardar. |
| Imagen | Imagen del producto | screenshot | Move to secondary | panel multimedia | Secondary | optional | screenshot-inferred | No es clave para alta comun. |
| Archivo | Subir imagen | screenshot | Move to secondary | panel multimedia | Secondary | optional | screenshot-inferred | |
| Camara | Tomar foto | screenshot | Move to secondary | panel multimedia | Secondary | optional | screenshot-inferred | |
| Cod. Fabricante | Codigo de fabricante | screenshot | Hide by default | datos avanzados | Low | optional | needs user confirmation | |
| Rubro | Rubro | screenshot/user | Keep visible | alta guiada y panel | Primary | optional/unknown | confirmed | Selector con creacion contextual. |
| SubRubro | Subrubro | screenshot/user | Keep visible | alta guiada y panel | Primary | optional/unknown | confirmed | Depende de rubro. |
| Articulo de | Tipo de articulo | screenshot | Keep visible | alta guiada | Primary | required/unknown | assumption | Default Compra & Venta. |
| PLU | PLU balanza | screenshot | Move to secondary | panel Balanza | Secondary | optional | confirmed | Solo si usa balanza. |
| Tipo Cod. Barra | Tipo de codigo | screenshot | Move to secondary | venta y codigos | Secondary | optional/default | assumption | Default Normal. |
| Cod. Compatibilidad | Codigo compatibilidad | screenshot | Hide by default | datos tecnicos | Low | optional | needs user confirmation | |
| Fecha de Origen | Fecha de origen | screenshot | Hide by default | datos avanzados | Low | optional | needs user confirmation | |
| Proveedor | Proveedor | screenshot | Move to secondary | proveedor/logistica | Secondary | optional | confirmed | Usuario activa si aplica. |
| Presentacion Minima | Presentacion minima | screenshot | Move to secondary | proveedor/logistica | Secondary | optional/default | confirmed | Default 1. |
| Ubicacion en Deposito | Ubicacion en deposito | screenshot | Move to secondary | stock/deposito | Secondary | optional | confirmed | |
| Unidad de Medida | Unidad de medida | screenshot/user | Move to secondary | logistica/medidas | Secondary | optional/default | confirmed | No bloquear salvo regla del negocio. |
| Equivalencia UM | Equivalencia UM | screenshot | Move to secondary | logistica/medidas | Secondary | optional/default | assumption | Default 1. |
| Unid.Med Exportar | Unidad exportacion | screenshot | Hide by default | fiscal/exportacion | Low | optional | needs user confirmation | |
| Concepto AFIP | Concepto AFIP | screenshot | Move to secondary | fiscal | Secondary | optional/default | needs user confirmation | Default Producto; reglas abiertas. |
| Cod. Variacion | Codigo de variacion | screenshot | Move to secondary | variaciones | Secondary | optional | confirmed | |
| Porc. Comision | Porcentaje comision | screenshot | Hide by default | comercial avanzado | Low | optional/default | needs user confirmation | |
| Descripcion Corta | Descripcion corta | screenshot | Move to secondary | datos complementarios | Secondary | optional | assumption | |
| Compuesto (Receta) | Usa receta | screenshot/user | Move to secondary | costos/receta | Secondary | optional | confirmed | Activador de panel. |
| Rubros Codigo | Codigo de rubro | screenshot | Move to secondary | admin rubros | Secondary | required | screenshot-inferred | |
| Rubros Descripcion | Nombre de rubro | screenshot | Keep visible | selector/admin | Primary | required | confirmed | Todos pueden crear. |
| Subrubros | Subrubros | screenshot | Keep visible | selector/admin | Primary | array | confirmed | |
| Caracteristicas Codigo | Codigo caracteristica | screenshot | Move to secondary | admin caracteristicas | Secondary | optional | screenshot-inferred | |
| Caracteristicas Descripcion | Caracteristica | screenshot | Move to secondary | panel caracteristicas | Secondary | optional | confirmed | |
| Orden | Orden | screenshot | Hide by default | admin caracteristicas | Low | optional | screenshot-inferred | |
| Seleccion | Seleccion | screenshot | Move to secondary | admin caracteristicas | Secondary | optional | screenshot-inferred | |
| Agrupado | Agrupado | screenshot | Move to secondary | admin caracteristicas | Secondary | optional | screenshot-inferred | |
| Mostrar descripcion | Mostrar descripcion | screenshot | Move to secondary | admin caracteristicas | Secondary | optional | screenshot-inferred | |
| Valores | Valores de caracteristica | screenshot | Move to secondary | panel caracteristicas | Secondary | array | confirmed | |
| Deposito Codigo | Codigo deposito | screenshot | Move to secondary | admin depositos | Secondary | required | screenshot-inferred | |
| Deposito Descripcion | Deposito | screenshot/user | Keep visible | stock/ajuste/admin | Primary | required for stock adjustment | confirmed | |
| Tipo Deposito | Tipo de deposito | screenshot | Move to secondary | admin depositos | Secondary | optional | screenshot-inferred | ORIGEN/DESTINO. |
| Cod. Empresa | Codigo empresa | screenshot | Hide by default | admin deposito avanzado | Low | optional | needs user confirmation | |
| Punto de Venta | Punto de venta | screenshot | Move to secondary | admin deposito/fiscal | Secondary | optional | needs user confirmation | |
| Domicilio | Domicilio deposito | screenshot | Move to secondary | admin depositos | Secondary | optional | screenshot-inferred | |
| Balanza destino | Balanza destino | screenshot | Move to secondary | balanza | Secondary | required if sync | screenshot-inferred | |
| Complemento local no detectado | Estado del complemento | screenshot | Keep visible if relevant | balanza alert | Primary when balanza active | display-only | screenshot-inferred | |
| Por articulo | Sincronizar por articulo | screenshot | Move to secondary | balanza | Secondary | action/mode | screenshot-inferred | |
| Masivo (lista de precios) | Sincronizacion masiva | screenshot | Move to secondary | balanza tool | Secondary | action/mode | screenshot-inferred | |
| Registro de eventos | Eventos de balanza | screenshot | Hide by default | balanza log | Low | display-only | screenshot-inferred | Mostrar alertas si hay fallos. |
| Editar series | Administrar series | screenshot | Move to secondary | panel series | Secondary | action | screenshot-inferred | |
| Articulo base | Producto base | screenshot | Move to secondary | variaciones | Secondary | required | screenshot-inferred | |
| Caracteristica 1 | Caracteristica principal | screenshot | Move to secondary | variaciones | Secondary | optional/required for variation | screenshot-inferred | |
| Caracteristica 2 | Caracteristica secundaria | screenshot | Move to secondary | variaciones | Secondary | optional | screenshot-inferred | |
| Previsualizar | Previsualizar variaciones | screenshot | Keep visible in tool | variaciones | Secondary | action | screenshot-inferred | |
| Generar | Generar variaciones | screenshot | Keep visible in tool | variaciones | Secondary | risky action | screenshot-inferred | Requiere preview/confirmacion. |
| Generar informe | Generar informe costo | screenshot | Move to secondary | costo/reporte | Secondary | action | screenshot-inferred | |
| Imprimir | Imprimir informe | screenshot | Move to secondary | costo/reporte | Low | action | screenshot-inferred | |
| Exportar | Exportar informe | screenshot | Move to secondary | costo/reporte | Low | action | screenshot-inferred | |

## Action And Capability Model

| Action / capability | Frequency | Risk | Permission | Modern placement | Confirmation | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Buscar producto | always visible | safe | all users | header/listado | confirmed | Critico para mostrador. |
| Crear producto | always visible | safe | all users | header | confirmed | Abre alta guiada. |
| Editar rapido | always visible | safe/risky depending field | all users | panel lateral | confirmed | Precio, codigo, codigo de barras, estado. |
| Ajustar stock | frequent secondary | risky | all users/role unknown | panel lateral | confirmed | Debe registrar deposito, cantidad y motivo. |
| Editar completo | frequent secondary | safe | all users | panel lateral | confirmed | Formulario completo por secciones. |
| Crear rubro/subrubro | occasional | safe with duplicate risk | all users | selector contextual | confirmed | Con deteccion de duplicados. |
| Crear caracteristica | occasional/expert | medium | all users? | panel avanzado | assumption | Puede desordenar catalogo; necesita guia. |
| Sincronizar balanza | occasional/expert | risky | unknown | panel balanza | assumption | Depende de complemento local. |
| Generar variaciones | expert | risky | unknown | herramienta variaciones | assumption | Preview obligatorio. |
| Manejar series | occasional/expert | medium | unknown | panel series | assumption | |
| Generar informe costo | occasional | safe | unknown | reporte secundario | assumption | |
| Eliminar producto | occasional | destructive | admin/supervisor unknown | menu peligroso | assumption | Confirmacion obligatoria. |
| Duplicar producto | frequent secondary | safe | all users | accion secundaria | assumption | Acelera carga administrativa. |

## Proposed View Structure

### Layout And Viewport Strategy

- First viewport: header compacto con titulo Catalogo de productos, buscador, filtros basicos y boton Crear producto; debajo, listado dominante; a la derecha, panel lateral del producto seleccionado con datos clave y edicion rapida.
- Fixed/sticky areas: buscador/listado header, acciones principales del panel lateral.
- Scrollable areas: listado de productos y detalle completo si se abre.
- Right/left action rail: panel lateral derecho para detalle y acciones.
- Bottom summary/action bar: no necesario para desktop; en mobile, acciones principales pueden ir en barra inferior.
- Rationale: el listado preserva velocidad legacy y el panel lateral reduce cambios de pantalla para consulta/edicion urgente.

### Header

- Purpose: orientar y permitir entrada rapida.
- Content: titulo, buscador, filtros estado/rubro, Crear producto, acciones secundarias de administracion.
- Actions: Crear producto, abrir administracion de catalogos, exportar si aplica.
- Rationale: el usuario nuevo ve una sola puerta de entrada, no muchas pestanas ABM equivalentes.

### Primary Content

- Purpose: encontrar productos y confirmar datos frecuentes.
- Content: tabla de productos con codigo, descripcion, codigo de barras, precio, estado, stock, rubro/subrubro.
- Actions: seleccionar, editar rapido, duplicar, abrir detalle.
- Rationale: consulta y correccion bajo presion deben ocurrir sin abandonar el listado.

### Secondary Content

- Purpose: completar capacidades que aplican solo a algunos productos.
- Content: secciones activables: Venta y codigos, Clasificacion, Stock y depositos, Proveedor y logistica, Balanza, Series, Variaciones, Costos/receta, Fiscal/medidas, Multimedia, Datos tecnicos.
- Disclosure pattern: acordeones con resumen visible y toggles de aplicabilidad.
- Rationale: no usar "Avanzado" generico; cada bloque debe decir para que sirve y mostrar estado cerrado.

### Navigation

- Entry points: menu Articulos > Catalogo.
- Exit points: ventas, compras, etiquetas, reportes, configuracion.
- Related views: administracion de rubros/caracteristicas/depositos puede abrirse en drawer o subvista.
- Rationale: mantener relacion entre producto y catalogos auxiliares.

### Dialogs, Drawers, And Secondary Surfaces

- Surface: Crear producto.
  - Trigger: boton Crear producto.
  - Purpose: alta guiada para usuario no tecnico.
  - Content: pasos/secciones: datos basicos, precio/venta, clasificacion, capacidades opcionales.
  - Actions: Guardar, Guardar y seguir editando, Cancelar.
  - Validation: descripcion, duplicados, precio si se carga, campos de capacidades activadas.
  - Rationale: creacion no ocurre con cliente esperando, por eso puede guiar mejor.

- Surface: Edicion rapida.
  - Trigger: seleccionar producto o boton Editar rapido.
  - Purpose: corregir precio, codigo, codigo de barras, estado y stock sin salir del listado.
  - Content: campos frecuentes y acciones.
  - Actions: Guardar cambios, Ajustar stock, Editar completo.
  - Validation: codigo unico, codigo barras unico, precio valido, cambio de estado con explicacion.
  - Rationale: separa urgencia de configuracion completa.

- Surface: Ajustar stock.
  - Trigger: boton Ajustar stock.
  - Purpose: modificar stock con auditoria.
  - Content: deposito, stock actual, nueva cantidad o diferencia, motivo, observacion.
  - Actions: Confirmar ajuste, Cancelar.
  - Validation: deposito y motivo requeridos, cantidad valida.
  - Rationale: stock no debe ser un input comun porque necesita trazabilidad.

## Interaction And States

- Loading: skeleton de tabla y panel; mantener buscador usable si cache local existe.
- Empty: mensaje "No hay productos con esos filtros" con accion Crear producto.
- Error: error de carga con reintento; no borrar seleccion anterior si existe.
- Permission denied: acciones deshabilitadas con motivo visible.
- Partial data: mostrar indicador "Configuracion incompleta" por seccion.
- Validation: inline por campo y resumen en accion de guardar.
- Unsaved changes: advertir al cambiar de producto, cerrar panel o cancelar.
- Destructive actions: confirmar con consecuencia concreta; eliminar/deshabilitar no deben ser botones primarios.

## Business Rules

- El usuario decide manualmente si un producto usa balanza, series, variaciones, receta/costo, proveedor/logistica o control por deposito.
- Ajustar stock debe registrar motivo/auditoria y deposito.
- Hay un solo precio de venta principal; descuentos pueden variar fuera del precio base.
- Todos los usuarios que cargan productos pueden crear clasificaciones nuevas, con guia y control de duplicados.
- Campos marcados en legacy como requeridos pueden ser opcionales segun aplicabilidad; la UI no debe asumir que todos bloquean alta.

## Defaults, Automation, And Validation

- Safe defaults: habilitado activo, articulo de Compra & Venta, presentacion minima 1, equivalencia UM 1, tipo codigo barra Normal, concepto AFIP Producto si corresponde.
- Suggested editable defaults: rubro/subrubro recientes, proveedor reciente, deposito usual.
- Defaults requiring confirmation: unidad de medida, concepto AFIP, reglas de fiscal/exportacion.
- Decisions that must remain manual: activar capacidades por producto.
- Inline validation: duplicados, precio, codigo, codigo de barras, stock, motivo.
- Action gating: no permitir ajustar stock sin motivo/deposito; no generar variaciones sin preview.
- Post-submit validation: errores de integracion con balanza o backend.
- Recovery from failed submit: conservar datos cargados y mostrar error accionable.

## Data And State Notes

- Core entities: Producto, Categoria/Rubro, Subrubro, Caracteristica, Deposito, Stock, Proveedor, Precio, Serie, Variacion.
- Field groups: basicos, venta/codigos, clasificacion, stock, proveedor/logistica, balanza, series, variaciones, costos, fiscal/medidas, multimedia, tecnicos.
- Arrays/tables: productos, stock por deposito, subrubros, caracteristicas/valores, series, variaciones, eventos balanza, historial/auditoria.

## Open Questions

- Cuales son los campos minimos reales que backend exige para guardar un producto.
- Si rubro/subrubro bloquea alta o solo se recomienda.
- Reglas de Concepto AFIP y unidad de medida.
- Permisos especificos para eliminar, generar variaciones, administrar caracteristicas y sincronizar balanza.
- Estados reales de stock por deposito y formato de auditoria.
- Como se calculan descuentos respecto del precio principal.

## Acceptance Criteria

- La pantalla principal compacta el flujo en un workspace de catalogo, no en multiples ABM equivalentes.
- El primer viewport permite buscar, consultar precio/codigo/estado/stock y acceder a edicion rapida.
- La creacion usa alta guiada y no "Alta Rapida" como camino principal.
- La edicion rapida permite precio, codigo, codigo de barras, estado y ajuste auditado de stock.
- Las capacidades opcionales se activan manualmente por el usuario con paneles claros.
- Rubros/subrubros se pueden crear desde el flujo con control de duplicados.
- Ningun campo legacy identificado queda eliminado sin estar marcado como remove candidate o needs confirmation.

## Source References

- `./product-context.md`
- `./flows/catalogo-articulos.md`
- `./catalogo-productos-main-articulos.png`
- `./catalogo-productos-datos-articulo-detalle.png`
- `./catalogo-productos-rubros.png`
- `./catalogo-productos-caracteristicas.png`
- `./catalogo-productos-depositos.png`
- `./catalogo-productos-series.png`
- `./catalogo-productos-balanza.png`
- `./catalogo-productos-variaciones.png`
- `./catalogo-productos-costo-produccion.png`
