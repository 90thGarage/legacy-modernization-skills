# Catalogo de productos UI Handoff

## Build Goal

Construir una vista moderna de `Catalogo de productos` que compacte los ABM legacy relacionados en un unico workspace. La vista debe permitir buscar productos, consultar datos clave, editar rapido los campos frecuentes, crear productos con alta guiada y acceder a configuraciones opcionales sin obligar al usuario a navegar por muchas pantallas.

## Product Context References

- Product context: `./product-context.md`
- Flow context: `./flows/catalogo-articulos.md` (`catalogo-productos.md` queda como alias historico).
- Full UX brief: `./catalogo-productos-ux-brief.md`
- Rubros/Subrubros handoff: `./rubros-subrubros-ui-handoff.md`
- Request classification: single-view modernization inside a known flow

## Product UX Intent

- Operational truth to preserve: productos, rubros, subrubros, caracteristicas, depositos, balanza, series, variaciones, costos y datos fiscales siguen existiendo.
- Legacy friction to remove: pestanas ABM separadas al mismo nivel, formularios vacios siempre visibles, campos opcionales mezclados con datos principales.
- Primary workflow improvement: busqueda/listado + panel lateral de consulta/edicion rapida + alta guiada.
- Existing user recognition to preserve: grilla compacta, acciones Nuevo/Editar/Guardar, rubro/subrubro, precio, codigo de barras, deposito y proveedor.
- Training-free adoption requirements: etiquetas claras, secciones por tarea, resumentes cerrados, toggles de aplicabilidad, validacion inline.
- Product-level decisions to preserve: catalogo como workspace unico; alta guiada como camino principal; ABM auxiliares accesibles desde contexto; ajuste de stock auditado.
- Product-level assumptions: permisos finos, reglas fiscales y persistencia exacta de stock siguen abiertos.
- Product-level conflicts or contradictions: ninguno documentado.

## Layout Contract

- Header: titulo `Catalogo de productos`, buscador, filtros basicos, boton `Crear producto`, acciones secundarias.
- Primary region: tabla/listado dominante de productos.
- Secondary region: panel lateral derecho del producto seleccionado con datos clave y edicion rapida.
- Tabs/drawer/accordion: edicion completa y capacidades opcionales en accordion/drawer por tareas.
- Dialogs/modals/secondary surfaces: alta guiada, ajuste de stock, creacion contextual de rubro/subrubro, preview de variaciones.
- Action area: acciones principales visibles en header y panel lateral; acciones destructivas en menu secundario.
- Responsive behavior: en desktop listado + panel lateral; en mobile listado primero y detalle como pantalla/panel deslizable.

## Critical Viewport Contract

- Baseline viewport: 1366x768.
- Must be visible without scroll: buscador, listado con columnas clave, producto seleccionado, precio, codigo/codigo de barras, estado, stock resumido, acciones Editar rapido, Ajustar stock, Crear producto, Editar completo.
- Primary input area: buscador por descripcion, codigo y codigo de barras.
- Primary input placement relative to working list/table: directamente arriba de la tabla.
- Working record/list: tabla compacta con filas de producto.
- Total/status: estado habilitado/deshabilitado y stock resumido del seleccionado.
- Blocking validation: errores del panel rapido y ajuste de stock visibles en el panel/drawer activo.
- Primary completion action: Guardar cambios en edicion rapida o Guardar producto en alta/edicion completa.
- Fixed/sticky areas: header de busqueda y acciones del panel lateral.
- Scrollable areas: tabla, edicion completa, historiales y configuraciones.
- Content allowed below the fold: auditoria, logs, datos tecnicos, reportes, eventos.
- Max layout budget: listado 60-70% ancho desktop; panel lateral 30-40%.
- Secondary actions demotion: Eliminar, exportar, imprimir, sincronizacion masiva y datos tecnicos no deben estar en el nivel principal.

## Capture Inventory

| Capture | Source file / reference | Surface type | Modern destination | Notes |
| --- | --- | --- | --- | --- |
| Articulos principal | `./catalogo-productos-main-articulos.png` | main screen | main view | Base para listado y panel de producto. |
| Campos articulo | `./catalogo-productos-datos-articulo-detalle.png` | form detail | complete edit drawer | Aclara campos opcionales/avanzados. |
| Rubros | `./catalogo-productos-rubros.png` | auxiliary ABM | contextual selector + admin drawer | Rubro/subrubro desde producto. |
| Caracteristicas | `./catalogo-productos-caracteristicas.png` | auxiliary ABM | product capability panel + admin drawer | Valores secundarios. |
| Depositos | `./catalogo-productos-depositos.png` | auxiliary ABM | stock adjustment + admin drawer | Deposito requerido para ajuste. |
| Series | `./catalogo-productos-series.png` | tool/state | optional capability panel | Solo si producto maneja series. |
| Balanza | `./catalogo-productos-balanza.png` | tool/state | optional capability panel + sync tool | Mostrar alerta de complemento local. |
| Variaciones | `./catalogo-productos-variaciones.png` | generation tool | guided variation tool | Preview antes de generar. |
| Costo Produccion | `./catalogo-productos-costo-produccion.png` | report/tool | secondary report/tool | No debe dominar alta comun. |

## Information To Render

### Always Visible

- Buscador de productos.
- Tabla de productos.
- Codigo, descripcion, codigo de barras, precio, estado, stock resumido.
- Panel lateral del producto seleccionado.
- Acciones Crear producto, Editar rapido, Ajustar stock, Editar completo.

### Secondary / Progressive Disclosure

- Clasificacion completa.
- Proveedor y logistica.
- Venta y codigos extendidos.
- Stock por deposito e historial.
- Balanza/PLU.
- Series.
- Variaciones.
- Receta/costo de produccion.
- Fiscal y medidas.
- Multimedia.
- Datos tecnicos/compatibilidad.

### Hidden Unless Requested

- Auditoria de cambios.
- Eventos de balanza.
- Codigos de compatibilidad.
- Fecha de origen.
- Campos de exportacion.
- Comision.
- Metadata de sistema.

### Excluded From UI

No excluir definitivamente ningun campo de negocio todavia. Excluir como patron visual principal:

- Pestanas ABM superiores para cada submodulo.
- "Alta Rapida" como CTA principal.
- Formularios vacios persistentes bajo cada tabla auxiliar.
- Sidebar legacy duplicando todas las subtareas dentro del flujo.

## Field Traceability Matrix

| Legacy item | Modern label | Source | Decision | Render location | Component/pattern | Data key | Requirement | Confirmation | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ABM Articulos | Catalogo de productos | screenshot | always visible | header | title | `view.title` | display-only | assumption | |
| Buscar | Buscar productos | screenshot/user | always visible | header | search input | `query` | required interaction | confirmed | descripcion/codigo/cod barras. |
| Codigo | Codigo | screenshot/user | always visible | table/panel/form | text input | `product.code` | optional/unknown | confirmed | Edicion frecuente. |
| Descripcion | Nombre | screenshot/user | always visible | table/panel/form | text input | `product.name` | required/unknown | confirmed | |
| Cod. Barras | Codigo de barras | screenshot/user | always visible | table/panel/form | text input | `product.barcode` | optional | confirmed | Validar duplicados. |
| Precio Vta. | Precio de venta | screenshot/user | always visible | table/panel | currency input | `product.salePrice` | required to sell/unknown | confirmed | Un precio principal. |
| Habilitado | Habilitado | screenshot/user | always visible | table/panel/form | switch | `product.enabled` | required | confirmed | Default true. |
| Nuevo | Crear producto | screenshot | always visible | header | button | n/a | action | confirmed | Abre alta guiada. |
| Alta Rapida | Alta guiada | screenshot/user | excluded/replaced | header | wizard/sheet | n/a | action | confirmed | No CTA principal como legacy. |
| Editar | Editar completo | screenshot/user | always visible | side panel | button | n/a | action | confirmed | |
| Copiar | Duplicar | screenshot | secondary | side panel menu | menu item | n/a | action | assumption | |
| Grabar | Guardar | screenshot | always visible in edit | forms | button | n/a | action | confirmed | |
| Eliminar | Eliminar | screenshot | hidden unless requested | danger menu | menu item | n/a | action | assumption | Confirmacion. |
| Cancelar | Cancelar | screenshot | secondary | forms | button | n/a | action | assumption | |
| Imagen | Imagen | screenshot | secondary | media section | image uploader | `product.imageUrl` | optional | screenshot-inferred | |
| Archivo | Subir archivo | screenshot | secondary | media section | upload button | n/a | action | screenshot-inferred | |
| Camara | Camara | screenshot | secondary | media section | button | n/a | action | screenshot-inferred | |
| Cod. Fabricante | Codigo fabricante | screenshot | hidden unless requested | advanced data | input | `product.manufacturerCode` | optional | needs user confirmation | |
| Rubro | Rubro | screenshot/user | always visible | panel/form | combobox + create | `product.categoryId` | optional/unknown | confirmed | Crear contextual. |
| SubRubro | Subrubro | screenshot/user | always visible | panel/form | dependent combobox + create | `product.subcategoryId` | optional/unknown | confirmed | |
| Articulo de | Tipo de articulo | screenshot | secondary | guided form | select | `product.articleType` | unknown | assumption | Default Compra & Venta. |
| PLU | PLU | screenshot | secondary | balanza section | input | `product.scale.plu` | required if scale active | confirmed | |
| Codigo de Barras | Codigo de barras | screenshot | always visible | panel/form | input | `product.barcode` | optional | confirmed | Duplicado trace de etiqueta. |
| Tipo Cod. Barra | Tipo de codigo | screenshot | secondary | venta y codigos | select | `product.barcodeType` | optional/default | assumption | Default Normal. |
| Cod. Compatibilidad | Codigo compatibilidad | screenshot | hidden unless requested | technical data | input | `product.compatibilityCode` | optional | needs user confirmation | |
| Fecha de Origen | Fecha de origen | screenshot | hidden unless requested | advanced data | date input | `product.originDate` | optional | needs user confirmation | |
| Proveedor | Proveedor | screenshot | secondary | provider section | combobox | `product.supplierId` | optional | confirmed | |
| Presentacion Minima | Presentacion minima | screenshot | secondary | provider/logistics | number input | `product.minimumPresentation` | optional/default | confirmed | Default 1. |
| Ubicacion en Deposito | Ubicacion | screenshot | secondary | stock/logistics | input | `product.warehouseLocation` | optional | confirmed | |
| Unidad de Medida | Unidad de medida | screenshot/user | secondary | fiscal/measures | select | `product.unitId` | optional/default | confirmed | |
| Equivalencia UM | Equivalencia | screenshot | secondary | fiscal/measures | number input | `product.unitEquivalence` | optional/default | assumption | Default 1. |
| Unid.Med Exportar | Unidad exportacion | screenshot | hidden unless requested | fiscal advanced | select | `product.exportUnitId` | optional | needs user confirmation | |
| Concepto AFIP | Concepto AFIP | screenshot | secondary | fiscal/measures | select | `product.afipConcept` | optional/default | needs user confirmation | Default Producto. |
| Cod. Variacion | Codigo variacion | screenshot | secondary | variations | input | `product.variationCode` | optional | confirmed | |
| Porc. Comision | Comision | screenshot | hidden unless requested | commercial advanced | percent input | `product.commissionPercent` | optional | needs user confirmation | |
| Descripcion Corta | Descripcion corta | screenshot | secondary | advanced data | input | `product.shortDescription` | optional | assumption | |
| Compuesto (Receta) | Usa receta | screenshot/user | secondary | recipe/cost section | switch | `product.hasRecipe` | optional | confirmed | |
| Rubros Codigo | Codigo rubro | screenshot | secondary | category admin | input | `category.code` | required in admin | screenshot-inferred | |
| Rubros Descripcion | Rubro | screenshot/user | secondary | selector/admin | input | `category.name` | required | confirmed | |
| Subrubros | Subrubros | screenshot/user | secondary | selector/admin | table/list | `category.subcategories` | array | confirmed | |
| Caracteristica Descripcion | Caracteristica | screenshot | secondary | characteristics | combobox/table | `characteristic.name` | optional | screenshot-inferred | |
| Valores | Valores | screenshot | secondary | characteristics | table | `characteristic.values` | array | screenshot-inferred | |
| Deposito Descripcion | Deposito | screenshot/user | secondary/required in stock | stock adjustment | select | `stockAdjustment.warehouseId` | required for adjustment | confirmed | |
| Tipo Deposito | Tipo de deposito | screenshot | secondary | warehouse admin | select | `warehouse.type` | optional | screenshot-inferred | |
| Stock | Stock | user | always visible summary | table/panel | badge/number | `product.stockSummary` | display-only | confirmed | Ajuste en operacion formal. |
| Motivo stock | Motivo | user | always visible in adjustment | stock dialog | textarea/select | `stockAdjustment.reason` | required | confirmed | Auditoria. |
| Balanza destino | Balanza destino | screenshot | secondary | scale sync | select | `scaleSync.targetScaleId` | required if sync | screenshot-inferred | |
| Complemento local no detectado | Estado complemento | screenshot | secondary/alert | scale section | alert | `scaleSync.localPluginStatus` | display-only | screenshot-inferred | |
| Series | Series | screenshot | secondary | series section | table | `product.serials` | array | screenshot-inferred | |
| Articulo base | Producto base | screenshot | secondary | variations tool | product selector | `variation.baseProductId` | required | screenshot-inferred | |
| Caracteristica 1 | Caracteristica 1 | screenshot | secondary | variations tool | select | `variation.characteristicOneId` | optional/required | screenshot-inferred | |
| Caracteristica 2 | Caracteristica 2 | screenshot | secondary | variations tool | select | `variation.characteristicTwoId` | optional | screenshot-inferred | |
| Previsualizar | Previsualizar | screenshot | secondary | variations tool | button | n/a | action | screenshot-inferred | |
| Generar | Generar variaciones | screenshot | secondary | variations tool | button | n/a | risky action | screenshot-inferred | Preview primero. |
| Generar informe | Generar informe | screenshot | secondary | cost report | button | n/a | action | screenshot-inferred | |
| Imprimir | Imprimir | screenshot | hidden unless requested | report actions | button | n/a | action | screenshot-inferred | |
| Exportar | Exportar | screenshot | hidden unless requested | report actions | button | n/a | action | screenshot-inferred | |

## Workflow Contract

### Step Model

| Step | Modern behavior | Step type | Component / area | Validation | Notes |
| --- | --- | --- | --- | --- | --- |
| 1. Buscar | Usuario busca por descripcion, codigo o codigo de barras | essential decision | search + product table | empty/error states | Mantener rapido. |
| 2. Seleccionar | Panel lateral muestra resumen del producto | essential decision | side panel | partial data warning | |
| 3. Editar rapido | Modificar precio, codigo, codigo de barras o estado | expert shortcut | quick edit panel | duplicados, precio valido, estado | Guardado inline. |
| 4. Ajustar stock | Abrir mini flujo con deposito, cantidad y motivo | compliance-fiscal/audit | stock dialog/sheet | deposito, motivo, cantidad | No input directo de stock. |
| 5. Crear producto | Alta guiada con datos basicos y secciones por tarea | essential decision | wizard/sheet/full form | basicos + capacidades activas | No "Alta Rapida". |
| 6. Configurar capacidades | Usuario activa paneles manualmente | essential decision | accordions/switches | validacion contextual | Balanza, series, variaciones, receta, proveedor, deposito. |
| 7. Crear clasificacion | Desde selector, crear rubro/subrubro si falta | useful confirmation | create inline drawer | nombre, duplicados, relacion | Permitido a todos. |
| 8. Edicion completa | Abrir todas las secciones del producto | occasional | drawer/full page | por seccion | Para tareas administrativas. |

### Simplifications To Implement

- Legacy steps removed or collapsed: ABM Rubros, Caracteristicas, Depositos, Series, Balanza, Variaciones y Costos dejan de ser pestanas principales para el usuario comun.
- Defaults to apply: habilitado, Compra & Venta, presentacion minima 1, equivalencia 1, codigo barra Normal, concepto AFIP Producto si aplica.
- Technical choices translated to user choices: toggles "Usa balanza", "Maneja series", "Tiene variaciones", "Usa receta/costo", "Asignar proveedor", "Controlar por deposito".
- Validation moved earlier: duplicados, campos faltantes de capacidades activas, motivo de stock.
- User control preserved: usuario decide que capacidades aplican.

### Flow Integration

- Entry points: menu Catalogo / Articulos; accesos desde venta, compra, stock, etiquetas, balanza y reportes.
- Exit points: producto creado o editado queda seleccionado; si el flujo fue invocado desde otra operacion, vuelve con el producto seleccionado.
- Previous flow step: navegacion o invocacion desde otro flujo que requiere producto.
- Next flow step: uso del producto en venta, compra, etiquetas, stock, balanza o reportes.
- Blocking dependencies: permisos finos para destructivas/expertas antes de produccion.
- Existing modern views to modify instead of duplicate: `catalogo-productos` debe ser el workspace principal; no crear ABM auxiliares como rutas primarias duplicadas.
- Integration assumptions: reglas fiscales, stock auditado e integracion de balanza deben mantenerse como supuestos abiertos.

## Component Strategy

- Preferred primitives: table/data grid, search input, side sheet/panel, form sections, accordions, switches, comboboxes with create, dialog/sheet for stock adjustment, alert, badges, dropdown menu.
- Client design system constraints: usar UI operativa densa, no landing, no cards decorativas anidadas.
- shadcn components likely needed: `Table`, `Input`, `Button`, `Sheet`, `Dialog`, `Accordion`, `Switch`, `Select`, `Command`, `Badge`, `Alert`, `DropdownMenu`, `Tabs` only inside edit complete if needed.
- Reusable product components: ProductSearchTable, ProductQuickPanel, GuidedProductForm, CapabilitySection, CategorySelectorWithCreate, StockAdjustmentDialog, PriceEditor, StatusSwitchWithImpact, VariationPreview.
- Components that should not be one-off: selectors de catalogo, ajuste auditado, panel de edicion rapida.
- Density constraints: tabla compacta con altura de fila baja; panel lateral legible; evitar hero/card-heavy.
- Avoid card-heavy layouts when: listados, ABM auxiliares y formularios operativos.
- Avoid: tabs horizontales para todas las capacidades, "Avanzado" generico, esconder acciones urgentes bajo menus.

## Actions And Interactions

- Primary actions: Buscar, Crear producto, Guardar producto, Editar rapido, Guardar cambios rapidos.
- Secondary actions: Editar completo, Ajustar stock, Duplicar, Crear rubro/subrubro, Abrir configuraciones.
- Destructive actions: Eliminar producto, deshabilitar producto, generar variaciones masivas si crea productos, cambios de stock.
- Filters/search/sort: busqueda global; filtros por estado, rubro/subrubro, stock bajo/opcional.
- Selection/bulk actions: no priorizar bulk en MVP salvo seleccion para exportar o operaciones admin.

### Action State Model

| Action | Frequency | Risk | Permission | Enabled when | Disabled reason | Confirmation / recovery |
| --- | --- | --- | --- | --- | --- | --- |
| Buscar | always visible | safe | all users | always | n/a | n/a |
| Crear producto | always visible | safe | all users | always | permiso faltante si aplica | Cancelar conserva aviso de cambios. |
| Guardar producto | always visible in form | safe/risky | all users | cambios validos | campos requeridos/duplicados | Mantener datos si falla. |
| Editar rapido | always visible | safe | all users | producto seleccionado | sin seleccion | n/a |
| Guardar cambios rapidos | frequent | risky | all users | cambios validos | precio/codigo invalido | Mostrar error inline. |
| Ajustar stock | frequent secondary | risky | all users/unknown | producto seleccionado | sin producto/permisos | Confirmar con motivo y auditoria. |
| Editar completo | frequent secondary | safe | all users | producto seleccionado | sin seleccion | n/a |
| Crear rubro/subrubro | occasional | medium | all users | desde selector | nombre duplicado/invalido | Mostrar posibles duplicados. |
| Deshabilitar | occasional | risky | all users/unknown | producto habilitado | reglas negocio | Confirmar impacto en ventas. |
| Eliminar | occasional | destructive | admin/supervisor unknown | producto seleccionado | permiso/relaciones | Confirmacion fuerte. |
| Generar variaciones | expert | risky | unknown | preview generado sin errores | faltan caracteristicas | Confirmar cantidad a crear. |
| Sincronizar balanza | occasional | risky | unknown | balanza configurada/plugin ok | plugin faltante | Mostrar evento y reintento. |

## Roles And Permissions

| Role | Visible information | Allowed actions | Disabled/hidden actions | UI behavior |
| --- | --- | --- | --- | --- |
| Mostrador | clave del producto, precio, codigo, estado, stock | buscar, editar rapido, ajustar stock con motivo, crear producto | eliminar puede ocultarse | UI prioriza rapidez y claridad. |
| Administrativo | todas las secciones | alta guiada, edicion completa, catalogos auxiliares | destructivas segun permiso | Puede usar configuracion completa. |
| Administrador | datos tecnicos, auditoria | todas | n/a | Acceso a administracion avanzada. |
| Soporte | logs, compatibilidad | diagnostico | edicion segun permiso | Datos tecnicos secundarios. |

## Dialogs, Drawers, And Secondary Surfaces

```txt
Surface: Alta guiada de producto
Trigger: Crear producto
Modern pattern: Sheet ancho o pagina de detalle si el flujo requiere espacio
Purpose: Crear producto sin conocer todos los ABM
Content: Datos basicos, precio/venta, clasificacion, capacidades opcionales, resumen de validacion
Actions: Guardar, Guardar y seguir editando, Cancelar
Validation: descripcion, duplicados, precio si cargado, campos de capacidades activas
Data received from parent: valores por defecto, filtros actuales
Data returned to parent: producto creado y seleccionado
Close/cancel behavior: advertir cambios sin guardar
Required states: loading defaults, validation, duplicate warning, failed save
```

```txt
Surface: Panel lateral de edicion rapida
Trigger: seleccionar producto / Editar rapido
Modern pattern: persistent side panel
Purpose: Resolver consulta y cambios urgentes
Content: nombre, codigo, codigo barras, precio, estado, stock resumen, rubro/subrubro, alertas
Actions: Guardar cambios, Ajustar stock, Editar completo, Duplicar
Validation: precio, codigo unico, codigo barras unico, estado
Data received from parent: producto seleccionado
Data returned to parent: cambios guardados
Close/cancel behavior: si hay cambios, confirmar descarte
Required states: no selection, loading, stale product, failed save
```

```txt
Surface: Ajuste de stock
Trigger: Ajustar stock
Modern pattern: Dialog or sheet
Purpose: Modificar stock con trazabilidad
Content: deposito, stock actual, nueva cantidad o diferencia, motivo obligatorio, observacion
Actions: Confirmar ajuste, Cancelar
Validation: deposito requerido, motivo requerido, cantidad valida
Data received from parent: producto y stock por deposito
Data returned to parent: stock actualizado y registro de auditoria
Close/cancel behavior: cancelar sin cambios
Required states: loading warehouses, validation, failed submit
```

```txt
Surface: Crear rubro/subrubro contextual
Trigger: opcion "Crear" dentro del selector
Modern pattern: inline popover/drawer
Purpose: Agregar clasificacion sin salir del producto
Content: nombre, rubro padre si subrubro, posibles duplicados
Actions: Crear y seleccionar, Cancelar
Validation: nombre requerido, duplicado, relacion padre
Data received from parent: query actual, rubro seleccionado
Data returned to parent: rubro/subrubro creado
Close/cancel behavior: vuelve al selector
Required states: duplicate warning, failed create
```

```txt
Surface: Variaciones
Trigger: activar "Tiene variaciones" o accion desde edicion completa
Modern pattern: guided tool in drawer/full panel
Purpose: Generar productos variantes desde producto base
Content: producto base, caracteristica 1, caracteristica 2 opcional, preview de combinaciones
Actions: Previsualizar, Generar
Validation: caracteristicas validas, sin duplicados
Data received from parent: producto base
Data returned to parent: variantes creadas
Close/cancel behavior: no generar sin confirmacion
Required states: empty characteristics, preview, duplicate conflicts, failed generate
```

## Required States

- Loading: tabla, panel, alta guiada y selectores con skeleton/spinner discreto.
- Empty: sin productos, sin resultados, sin rubros/subrubros, sin series, sin eventos.
- Error: carga fallida, guardado fallido, sincronizacion fallida.
- Permission denied: accion visible deshabilitada con tooltip/mensaje si el usuario espera verla.
- Partial data: producto incompleto o capacidad activa sin campos requeridos.
- Validation: inline y resumen por seccion.
- Failed submit: conservar datos, mostrar reintentar.
- Unsaved changes: dialog al cambiar seleccion/cerrar.
- Conflicting update: avisar producto actualizado por otro usuario y ofrecer recargar/conservar.
- Stale data: badge de datos desactualizados si aplica.

## Defaults, Validation, And Recovery Contract

- Safe auto-filled defaults: `enabled=true`, `articleType=Compra & Venta`, `minimumPresentation=1`, `unitEquivalence=1`, `barcodeType=Normal`.
- Suggested editable defaults: ultimo rubro usado, ultimo deposito usado, proveedor reciente.
- Defaults requiring confirmation: `afipConcept=Producto`, unidad de medida, rubro/subrubro requerido.
- Manual-only decisions: activar balanza, series, variaciones, receta/costo, proveedor/logistica, control por deposito.
- Inline validation: descripcion, codigo, codigo de barras, precio, motivo de stock, deposito, duplicados.
- Validation summary: mostrar por seccion en alta/edicion completa.
- Action gating: stock sin motivo bloquea; generar variaciones sin preview bloquea; sincronizar balanza sin destino/plugin bloquea.
- Failed submit recovery: no limpiar formulario ni perder cambios.
- Data that must never be lost on failure: datos de alta, cambios de precio/codigo, motivo de stock escrito.

## Data Shape

### Entities

```txt
Entity: Product
Purpose in view: item central del catalogo
Relationship to other entities: pertenece a rubro/subrubro, puede tener proveedor, stock, caracteristicas, series, variaciones, configuracion de balanza y receta
```

```txt
Entity: Category
Purpose in view: clasificar productos
Relationship to other entities: contiene subcategorias
```

```txt
Entity: Warehouse
Purpose in view: mostrar y ajustar stock por deposito
Relationship to other entities: tiene stock por producto
```

```txt
Entity: StockAdjustment
Purpose in view: registrar cambios de stock con auditoria
Relationship to other entities: pertenece a producto, deposito y usuario
```

```txt
Entity: Characteristic
Purpose in view: atributos y base de variaciones
Relationship to other entities: tiene valores y puede asignarse a producto
```

### Fields

```txt
Field key: product.id
Modern label: ID
Type: string
Required: yes
Nullable: no
Source legacy item: Codigo/id interno
Display format: plain
Validation or constraints: unique
Fallback when missing: no render
```

```txt
Field key: product.code
Modern label: Codigo
Type: string
Required: unknown
Nullable: yes
Source legacy item: Codigo
Display format: plain
Validation or constraints: unique if present
Fallback when missing: "Sin codigo"
```

```txt
Field key: product.name
Modern label: Nombre
Type: string
Required: yes/unknown backend
Nullable: no
Source legacy item: Descripcion
Display format: plain
Validation or constraints: non-empty
Fallback when missing: "Producto sin nombre"
```

```txt
Field key: product.barcode
Modern label: Codigo de barras
Type: string
Required: no
Nullable: yes
Source legacy item: Cod. Barras / Codigo de Barras
Display format: plain
Validation or constraints: unique if present
Fallback when missing: "Sin codigo de barras"
```

```txt
Field key: product.salePrice
Modern label: Precio de venta
Type: number
Required: unknown; required to sell
Nullable: yes
Source legacy item: Precio Vta.
Display format: currency ARS
Validation or constraints: >= 0
Fallback when missing: "$ 0,00" or "Sin precio" per business rule
```

```txt
Field key: product.enabled
Modern label: Habilitado
Type: boolean
Required: yes
Nullable: no
Source legacy item: Habilitado
Display format: badge/switch
Validation or constraints: deshabilitar may require confirmation
Fallback when missing: false
```

```txt
Field key: product.stockSummary
Modern label: Stock
Type: number/object
Required: no
Nullable: yes
Source legacy item: user-confirmed stock
Display format: number + status
Validation or constraints: display-only in quick panel
Fallback when missing: "Sin stock cargado"
```

```txt
Field key: product.categoryId
Modern label: Rubro
Type: string
Required: unknown
Nullable: yes
Source legacy item: Rubro
Display format: category name
Validation or constraints: existing or created contextual
Fallback when missing: "Sin rubro"
```

```txt
Field key: product.subcategoryId
Modern label: Subrubro
Type: string
Required: unknown
Nullable: yes
Source legacy item: SubRubro
Display format: subcategory name
Validation or constraints: belongs to category
Fallback when missing: "Sin subrubro"
```

```txt
Field key: product.supplierId
Modern label: Proveedor
Type: string
Required: no
Nullable: yes
Source legacy item: Proveedor
Display format: supplier name
Validation or constraints: existing supplier
Fallback when missing: "Sin proveedor"
```

```txt
Field key: stockAdjustment.reason
Modern label: Motivo
Type: string
Required: yes
Nullable: no
Source legacy item: user requirement
Display format: textarea/select
Validation or constraints: non-empty
Fallback when missing: block submit
```

### Arrays / Tables

```txt
Array key: products
Row identity: product.id
Columns: codigo, nombre, codigo de barras, precio, estado, stock, rubro/subrubro
Default sort: nombre asc or codigo asc; needs confirmation
Empty state: "No hay productos con esos filtros"
Row actions: seleccionar, editar rapido, duplicar, mas acciones
Bulk actions: not required for MVP
```

```txt
Array key: product.stockByWarehouse
Row identity: warehouseId
Columns: deposito, stock actual, ubicacion
Default sort: deposito
Empty state: "Sin stock por deposito"
Row actions: ajustar
Bulk actions: none
```

```txt
Array key: category.subcategories
Row identity: subcategory.id
Columns: codigo, descripcion
Default sort: descripcion
Empty state: "Sin subrubros"
Row actions: editar
Bulk actions: none
```

```txt
Array key: product.serials
Row identity: serial.id or serial.number
Columns: numero, estado, deposito
Default sort: numero
Empty state: "Sin series"
Row actions: agregar, editar, quitar
Bulk actions: import/export optional
```

```txt
Array key: variation.previewRows
Row identity: generatedSku/tempId
Columns: combinacion, nombre propuesto, codigo, precio, estado
Default sort: combinacion
Empty state: "Previsualiza antes de generar"
Row actions: editar propuesta, excluir
Bulk actions: generar seleccionadas
```

### Status Values

```txt
Status key: product.enabled
Allowed values: true, false
Modern labels: Habilitado, Deshabilitado
Visual treatment: green/neutral badge and switch
Business meaning: producto disponible o no para operar/vender
```

```txt
Status key: product.completionStatus
Allowed values: complete, incomplete, needsAttention
Modern labels: Completo, Incompleto, Revisar
Visual treatment: badge + section alerts
Business meaning: datos suficientes segun reglas configuradas
```

```txt
Status key: scaleSync.localPluginStatus
Allowed values: detected, missing, error, unknown
Modern labels: Complemento conectado, Complemento no detectado, Error, Sin verificar
Visual treatment: alert in scale section
Business meaning: capacidad de sincronizar con balanza
```

### Derived / Display-Only Values

```txt
Value: stock total
Derived from: sum(product.stockByWarehouse.quantity)
Display rule: show in table/panel; edits only through StockAdjustment
```

```txt
Value: classification label
Derived from: category.name + subcategory.name
Display rule: "Rubro / Subrubro" or fallback if missing
```

```txt
Value: product quick warnings
Derived from: missing price, disabled, no barcode, incomplete active capability
Display rule: show compact alerts in side panel
```

### Example Data Notes

Mock data should include:

- Producto normal con precio, codigo de barras, habilitado y stock.
- Producto sin codigo de barras.
- Producto deshabilitado.
- Producto con stock en multiples depositos.
- Producto con balanza activa y plugin missing.
- Producto con variaciones/series activas.
- Rubros con y sin subrubros.
- Caso de busqueda sin resultados.
- Caso de validacion por codigo duplicado.
- Caso de ajuste de stock fallido.

## Visible Business Rules

- Stock se ajusta con operacion auditada, no con edicion directa del numero.
- Un producto tiene un precio de venta principal.
- El usuario decide manualmente las capacidades aplicables.
- Los usuarios con permiso pueden crear rubro/subrubro desde el flujo, con control de duplicados y retorno seleccionado. El contrato detallado vive en `rubros-subrubros-ui-handoff.md`.
- No asumir que todos los campos con asterisco legacy son obligatorios globales.

## Do Not Include

- No recrear tabs legacy superiores como navegacion principal de este flujo.
- No usar "Alta Rapida" como accion destacada principal.
- No poner todos los campos del articulo visibles al mismo tiempo en el primer viewport.
- No permitir cambio directo de stock sin motivo/auditoria.
- No esconder edicion de precio/codigo/estado/stock dentro de edicion completa.
- No eliminar campos legacy sin dejarlos como secundarios, ocultos o abiertos para confirmacion.

## UX Intent

- Header/listado: mantiene velocidad operativa para usuarios acostumbrados a grillas, pero con busqueda clara y acciones principales visibles.
- Panel lateral: reduce navegacion para consulta y edicion urgente, especialmente cuando hay cliente esperando.
- Alta guiada: baja carga cognitiva para usuarios poco tecnologicos y evita que todos los campos opcionales parezcan obligatorios.
- Capacidades opcionales: cada bloque tiene nombre de tarea y resumen visible, para que el usuario sepa cuando abrirlo.
- Ajuste de stock: conserva rapidez desde el panel, pero protege trazabilidad con motivo y deposito.

## Open Assumptions

- Backend permite guardar productos con set minimo todavia no confirmado.
- Rubro/subrubro puede ser recomendado o requerido; falta regla final.
- Concepto AFIP y unidad de medida pueden defaultarse, pero requieren validacion fiscal.
- Permisos para acciones destructivas y expertas no estan definidos.
- Reglas exactas de balanza, series y variaciones deben confirmarse con dominio/backend.
- Descuentos viven fuera del precio base y no requieren multiples listas en este flujo.

## Acceptance Criteria

- The implementation follows this handoff before the full UX brief.
- The view uses a single `Catalogo de productos` workspace.
- The first viewport satisfies search + list + selected product quick panel.
- Quick edit covers price, code, barcode, enabled state and stock adjustment entry.
- Stock adjustment requires warehouse and reason/audit before submit.
- Product creation uses a guided flow with optional capability sections.
- Rubro/subrubro creation is available contextually with duplicate detection, preserves the product draft, and returns the created value selected.
- Optional product capabilities are activated manually and do not clutter the base form.
- Every identified legacy item appears in the traceability matrix.
- Visual implementation is dense, operational, and not card-heavy.

## Source References

- Full UX brief: `./catalogo-productos-ux-brief.md`
- Product context: `./product-context.md`
- Flow context: `./flows/catalogo-articulos.md`.
- Legacy screenshots / captures:
  - `./catalogo-productos-main-articulos.png`
  - `./catalogo-productos-datos-articulo-detalle.png`
  - `./catalogo-productos-rubros.png`
  - `./catalogo-productos-caracteristicas.png`
  - `./catalogo-productos-depositos.png`
  - `./catalogo-productos-series.png`
  - `./catalogo-productos-balanza.png`
  - `./catalogo-productos-variaciones.png`
  - `./catalogo-productos-costo-produccion.png`
