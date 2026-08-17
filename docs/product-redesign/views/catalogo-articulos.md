# View: Catalogo / ABM Articulos

## Metadata

- View ID: `catalogo-articulos`
- Product area: Catalogo
- Status: draft
- Source material:
  - Screenshot provided on 2026-07-10.
  - Existing context in `../../ux/product-context.md`.
  - Existing handoff in `../../ux/catalogo-productos-ui-handoff.md`.
- Related legacy views: ABM Articulos, Articulos Seriados, Rubros, Depositos, Caracteristicas, Balanza, Variaciones, Costo Produccion.
- Related patterns:
  - `../patterns/list-detail-workspace.md`
  - `../patterns/sidebar-navigation.md`

## Product Job

- Primary user: administrativo, encargado o usuario de mostrador con permisos de catalogo.
- Primary job: buscar, consultar y mantener articulos/productos.
- Secondary jobs: crear producto, editar precio/codigo/estado, clasificar, configurar proveedor/logistica, stock, balanza, series, variaciones y receta/costo.
- Frequency: busqueda y consulta frecuentes; alta y configuracion segun rubro; edicion rapida puede ocurrir con presion de cliente esperando.
- Pressure: claridad y velocidad para busqueda/consulta; precision y trazabilidad para stock, precio y configuraciones.
- Success event: el usuario encuentra o actualiza el articulo correcto sin perder contexto y sin abrir pantallas innecesarias.

## Current UX Problem

La vista actual combina grilla de articulos y formulario completo del producto seleccionado en el mismo plano.

Problemas principales:

- El acceso desde navegacion requiere demasiados niveles para una tarea frecuente como crear un articulo.
- `ABM` aparece como agrupador navegable, aunque es una estructura tecnica y no una tarea.
- Capacidades como `Articulos Seriados`, `Caracteristicas`, `Rubros`, `Depositos`, `Generacion de variaciones` y `Costo de Produccion` aparecen como destinos principales, aunque pertenecen al flujo de articulos, stock, reportes o configuracion.
- El listado pierde altura y deja de ser la superficie dominante.
- El detalle aparece siempre, aunque el usuario solo quiera buscar o comparar.
- Las tabs inferiores mezclan secciones del producto seleccionado con navegacion de la vista.
- La relacion entre acciones superiores y registro seleccionado depende de memoria del usuario.
- `Alta Rapida` y `Nuevo` compiten como dos entradas distintas para crear un articulo.
- El alta completa no esta guiada: al crear un registro, el usuario cae en un formulario amplio con tabs y debe descubrir que completar y donde guardar.
- El boton de guardado queda lejos del recorrido del formulario y no explica si el producto ya puede crearse con los datos minimos.
- Campos frecuentes y avanzados compiten visualmente.
- Configuraciones de baja frecuencia aparecen antes de que el usuario las necesite.

Lo util a preservar:

- Grilla compacta.
- Busqueda visible.
- Columnas clave: codigo, descripcion, codigo de barras, precio.
- Acciones por registro, si ayudan a editar o eliminar sin abrir primero el detalle.
- Acciones conocidas: nuevo, editar, copiar, guardar, eliminar, cancelar.
- Lenguaje del dominio: articulo, rubro, subrubro, deposito, proveedor, PLU, codigo de barras.

## Target UX Decision

Usar `list-detail workspace`.

La grilla de articulos debe ser la superficie principal y ocupar el ancho disponible. Al seleccionar un articulo, se abre o actualiza un drawer lateral derecho superpuesto con resumen y acciones contextuales. No debe existir una columna fija permanente de detalle dentro del layout. La edicion completa no debe estar siempre visible: debe abrirse bajo demanda.

Esta decision permite que convivan tres niveles:

1. Listado para buscar y comparar productos.
2. Drawer lateral contextual para consulta rapida y edicion frecuente.
3. Vista/drawer completo para configuracion profunda.

Para creacion, `Alta Rapida` y `Nuevo` deben unificarse en un solo flujo: `Crear articulo`. Ese flujo abre un drawer ancho de alta guiada. El primer paso contiene los datos minimos que hoy aparecen en alta rapida; los pasos posteriores contienen datos complementarios.

Para navegacion, `Catalogo > Articulos` debe ser la entrada principal. Desde esa vista se resuelven creacion, filtros, seriados, caracteristicas, rubros, variaciones y configuraciones relacionadas sin exigir que el usuario navegue por subpantallas tecnicas.

`Articulos Seriados` no debe ser una vista separada para el trabajo diario: debe ser un filtro/capacidad del listado de articulos. `Caracteristicas` no debe ser una pantalla de alta independiente para el usuario comun: debe aparecer como un grupo de campos opcionales dentro del alta/edicion del articulo.

## Navigation Contract

Recommended entry:

1. Sidebar: `Catalogo`.
2. Item: `Articulos`.
3. Header CTA: `Crear articulo`.

Sidebar items:

| Legacy item | Target destination | Rationale |
| --- | --- | --- |
| `ABM` | Remove as visible grouping | Es lenguaje tecnico, no una tarea del usuario. |
| `Articulos` | Keep as primary catalog entry | Es la puerta principal para buscar, crear y mantener productos. |
| `Articulos Seriados` | Filter/capability inside Articulos | Seriado es una condicion del producto, no una vista primaria. Debe verse como filtro `Maneja series` y seccion `Series` del detalle. |
| `Caracteristicas` | Field group inside article creation/edit + secondary admin configuration if needed | Son atributos del producto y deben completarse contextualmente como campos del articulo. |
| `Rubros` | Selector contextual + administracion jerarquica secundaria | Clasificacion disponible desde alta/edicion sin salir del flujo; contrato en `./rubros-subrubros.md`. |
| `Depositos` | Dedicated Stock/Configuracion view + stock section inside article details | Deposito pertenece a stock/logistica, no al menu principal de ABM articulos. Ver `./depositos.md`. |
| `Balanza` | Capability/tool inside Articulos or Catalog tools | Depende de si es configuracion por producto o herramienta operativa frecuente. |
| `Generacion de variaciones` | Guided action from a base article | Requiere contexto de articulo base. |
| `Costo de Produccion` | Report/tool in Reportes or Produccion | No debe competir con alta/mantenimiento de articulos. |
| `Consulta Rapida` | Tool with kiosk/autoservicio mode | Puede ser una herramienta de mostrador/kiosco, no parte de ABM. Ver `./consulta-rapida-autoservicio.md`. |
| `Etiquetas > Diseno` | `Catalogo > Diseno de etiquetas` | Editor visual de plantillas reutilizables. Ver `./diseno-etiquetas.md`. |
| `Etiquetas > Impresion` | `Catalogo > Impresion de etiquetas` | Preparacion e impresion de lotes por articulo. Ver `./impresion-etiquetas.md`. |

Fast creation rule:

- La creacion de articulo no debe requerir mas de dos decisiones de navegacion: entrar a `Catalogo > Articulos` y tocar `Crear articulo`.
- Si el cliente necesita acceso aun mas rapido, usar favoritos o accion rapida, no duplicar una ruta tecnica en el sidebar.

## Layout Contract

Header:

- Titulo `Catalogo de articulos` o `Catalogo de productos`.
- Busqueda por descripcion, codigo y codigo de barras.
- Filtros principales: estado, rubro/subrubro, `Maneja series`, stock bajo si aplica.
- Control de visualizacion: `Lista` y `Grilla`.
- CTA principal: `Crear articulo`.

Primary region:

- La vista debe permitir cambiar entre dos modos del mismo resultado filtrado:
  - `Lista`: tabla densa para mantenimiento operativo, comparacion rapida y acciones frecuentes.
  - `Grilla`: cards visuales para explorar productos por imagen, precio y promociones/descuentos.
- El cambio de visualizacion no debe resetear busqueda, filtros, seleccion ni paginacion si aplica.

List mode:

- Tabla densa de articulos como modo operativo principal.
- Columnas base: codigo, descripcion, codigo de barras, precio venta, estado, stock/resumen si esta disponible y badge/indicador de seriado cuando aplique.
- Columna final `Acciones` con tres botones visibles: `Editar`, `Duplicar` y `Eliminar`, segun permisos.
- No usar menu de tres puntos para estas acciones principales en desktop.
- En mobile o viewport angosto puede colapsar, pero la tabla desktop debe mostrar los tres botones.
- Orden y paginacion sin ocupar demasiado espacio vertical.

Grid mode:

- Grilla de cards de productos.
- Cada card debe mostrar imagen/foto del articulo o placeholder limpio si no hay imagen.
- Cada card debe mostrar nombre, precio de venta y descuento/promocion si existe.
- Estado o alerta solo aparece si afecta la operacion: sin precio, sin stock, deshabilitado o seriado.
- La card completa abre el drawer lateral del articulo, igual que click en fila.
- Las acciones frecuentes deben seguir disponibles: editar, duplicar y eliminar, sin depender de menu de tres puntos en desktop.
- La grilla no reemplaza el drawer de detalle ni abre una pagina distinta.
- No usar cards decorativas grandes: deben ser cards de producto densas, escaneables y con imagen protagonista.

Filter sidebar:

- En modo grilla, los filtros deben poder ubicarse en una barra lateral del area de resultados.
- La barra lateral de filtros debe incluir como minimo: rubro/subrubro, estado, seriados/no seriados, stock y precio/descuento si aplica.
- En modo lista, los filtros pueden quedar compactos en el header si eso preserva densidad.
- En mobile o viewport angosto, la barra lateral de filtros se convierte en sheet/drawer.
- Los filtros laterales no deben ocupar espacio cuando el usuario vuelve a lista si reducen demasiado la tabla.

Context drawer:

- Drawer/sheet lateral derecho del articulo seleccionado, abierto bajo demanda.
- Debe usar el mismo ancho que el drawer de alta/edicion.
- Ancho desktop recomendado: 45-50vw.
- Ancho minimo recomendado: 720px cuando el viewport lo permita.
- Ancho maximo recomendado: 960px.
- No ocupa una columna fija dentro del grid principal.
- La tabla debe recuperar todo el ancho disponible cuando el drawer esta cerrado.
- Resumen: nombre, codigo, codigo de barras, precio, estado, rubro/subrubro, imagen si aporta reconocimiento.
- Alertas: deshabilitado, sin precio, stock bajo, configuracion incompleta, duplicados si aplica.
- Acciones: `Editar rapido`, `Editar completo`, `Ajustar stock`, `Duplicar`, menu de mas acciones.

Full edit surface:

- Drawer ancho para alta guiada y edicion completa en desktop.
- El drawer de alta/edicion no debe usar el ancho default chico de shadcn.
- En desktop debe ocupar aproximadamente 45-50% del viewport, con `min-width` suficiente para formularios de dos columnas cuando aplique.
- El drawer debe conservar contexto del catalogo y no ocupar la vista principal completa salvo que el viewport sea angosto.
- Secciones por tarea, no tabs legacy obligatorias:
  - Datos basicos.
  - Precio y venta.
  - Clasificacion.
  - Proveedor y logistica.
  - Stock/depositos.
  - Balanza/PLU.
  - Series.
  - Caracteristicas.
  - Variaciones.
  - Receta/costo.
  - Fiscal/medidas.
  - Datos tecnicos/auditoria.

Responsive behavior:

- Desktop: tabla full-width; click en fila abre drawer lateral derecho superpuesto.
- Tablet/mobile: tabla primero; detalle como sheet o pantalla; alta/edicion como pantalla completa.

List surface:

- Titulo, CTA, busqueda, filtros y tabla pertenecen a una misma superficie, sin divisor ni cambio de fondo entre toolbar y resultados.
- La busqueda y todos los controles de filtro o visualizacion tienen la misma altura visual.
- No mostrar el contador redundante `X de Y registros` debajo del titulo.

## Guided Creation Drawer

El flujo de alta debe resolver dos problemas a la vez: permitir crear un articulo con pocos datos y permitir completar detalles sin abandonar el contexto.

Entry point:

- Un unico CTA en el header: `Crear articulo`.
- `Alta Rapida` y `Nuevo` no deben existir como caminos separados compitiendo en la misma toolbar.

Surface:

- Drawer ancho en desktop.
- Ancho desktop recomendado: 60-72vw.
- Ancho minimo recomendado: 760px cuando el viewport lo permita.
- Ancho maximo recomendado: 1180px para conservar legibilidad sin extender excesivamente las líneas.
- Pantalla completa en mobile/tablet angosto.
- Stepper horizontal compacto con puntos numerados arriba del formulario.
- Resumen fijo o compacto del articulo en curso cuando ya exista descripcion.

Internal layout:

- El drawer debe tener dos franjas verticales: stepper compacto arriba y formulario activo debajo.
- Los puntos se distribuyen sobre todo el ancho util de la franja, sin nombre, progreso ni comentarios persistentes debajo; hover o foco explica qué datos contiene cada paso.
- Los pasos bloqueados explican mediante tooltip que primero deben guardarse los datos mínimos.
- El formulario activo recibe todo el ancho disponible y no compite con una columna lateral permanente.
- Los campos del formulario deben poder organizarse en una o dos columnas segun ancho, priorizando legibilidad sobre densidad.
- Labels, inputs y selects no deben cortarse ni superponerse.

Step model:

| Step | Purpose | Fields / content | Required to save? |
| --- | --- | --- | --- |
| 1. Datos minimos | Crear un articulo valido sin recorrer todo el formulario | Descripcion, rubro, subrubro, tipo de producto, moneda, articulo de, IVA y cuentas contables si son obligatorias o no pueden inferirse, imagen/foto opcional | yes, excepto imagen |
| 2. Precio y venta | Dejarlo listo para vender | Precio de venta, precio de compra, listas de precio, moneda/IVA si no quedo cerrado en paso 1 | no, salvo regla del negocio |
| 3. Identificacion y logistica | Completar datos operativos frecuentes | Codigo, codigo de barras, proveedor, presentacion minima, ubicacion, unidad de medida, concepto AFIP | no, salvo regla del negocio |
| 4. Caracteristicas y detalles opcionales | Activar capacidades y atributos que no aplican a todos los articulos | Caracteristicas, depositos, unidades de venta, receta, PLU/balanza, series, variaciones | no |

Step 1 strict scope:

- El paso 1 debe contener solamente los datos minimos necesarios para crear el articulo.
- La imagen/foto del articulo debe estar disponible en paso 1 como campo opcional, porque ayuda a reconocer el producto en catalogo, POS y consulta rapida.
- La ausencia de imagen nunca debe bloquear `Guardar` ni `Guardar y completar detalles`.
- El campo de imagen debe permitir subir archivo, tomar foto si el dispositivo lo permite, eliminar/reemplazar imagen y ver preview.
- No incluir caracteristicas del articulo en paso 1.
- No incluir series, depositos, unidades de venta, PLU/balanza, variaciones ni receta en paso 1.
- Si precio de venta o codigo de barras se consideran necesarios para dejarlo vendible, pueden estar en pasos 2/3 y no deben bloquear la creacion minima salvo regla explicita del negocio.
- El builder debe mostrar claramente cuales campos del paso 1 estan incompletos cuando `Guardar` no se habilita.

Image behavior:

- La imagen es un dato recomendado, no obligatorio.
- Debe mostrarse como preview compacta dentro del alta/edicion y como thumbnail o placeholder en el drawer de detalle cuando aporte reconocimiento.
- Si no hay imagen, usar placeholder limpio por categoria o iniciales; no mostrar imagen rota.
- En consulta rapida/autoservicio, la misma imagen alimenta la foto grande del resultado.
- En POS, la imagen no debe ocupar espacio dentro del ticket, salvo futuras vistas de busqueda visual o favoritos con imagen.

Characteristics field group:

- Debe aparecer como grupo de campos dentro del paso `Caracteristicas y detalles opcionales` o dentro de la edicion completa del articulo.
- No debe aparecer dentro de `Datos minimos`.
- Debe usar las caracteristicas configuradas del negocio como campos seleccionables, por ejemplo `Hits`, `Acabado`, `Aspecto`, `Grupo de color`.
- Si una caracteristica no aplica, debe poder quedar vacia sin ocupar una vista completa.
- Si se permite crear una nueva caracteristica o valor, debe abrir una creacion contextual secundaria y volver al articulo con el valor seleccionado.
- La administracion completa de definiciones de caracteristicas queda como configuracion secundaria, no como navegacion principal de Catalogo.

Series behavior:

- `Maneja series` debe ser un filtro del listado y una capacidad del articulo.
- El listado debe permitir ver `Todos`, `Seriados` y `No seriados`.
- Los articulos seriados deben mostrar un badge/indicador en la tabla y en el drawer contextual.
- La carga o administracion de series vive dentro del detalle/edicion del articulo, no como pantalla separada de catalogo.

Footer actions:

- En modo creacion:
  - `Cancelar`: cierra con confirmacion si hay cambios.
  - `Guardar`: habilitado cuando el paso 1 obligatorio esta completo. Guarda el articulo y vuelve al catalogo con ese articulo seleccionado.
  - `Guardar y completar detalles`: habilitado cuando el paso 1 obligatorio esta completo. Guarda el articulo y avanza al paso 2 dentro del mismo drawer.
  - `Siguiente`: permite avanzar a pasos opcionales sin guardar solo si la experiencia conserva el borrador; si no hay borrador, explicar que primero debe guardarse el minimo.
- En modo edicion:
  - El articulo ya existe, por lo tanto todos los pasos deben ser navegables.
  - `Guardar cambios` debe estar disponible para cualquier paso con cambios validos.
  - No bloquear la edicion de pasos 2, 3 o 4 por validaciones del paso 1 si el articulo ya tiene los datos minimos existentes.
  - `Anterior` / `Siguiente` o click directo en el stepper deben permitir moverse entre pasos.

No usar dentro del drawer:

- Otro boton llamado `Crear articulo`; ese label queda reservado para el CTA que abre el flujo.
- Tabs legacy como navegacion principal del alta.
- Un formulario completo sin progreso ni jerarquia.
- Drawer angosto que obligue a comprimir inputs o cortar labels.
- Columna de pasos con el mismo peso visual o mas ancho que la columna de campos.

Validation behavior:

- Los campos obligatorios del paso 1 deben marcarse claramente.
- `Guardar` y `Guardar y completar detalles` permanecen deshabilitados hasta completar obligatorios.
- Si todos los obligatorios visibles del paso 1 estan completos y el boton sigue deshabilitado, la UI debe mostrar que campo/regla falta; no puede quedar sin explicacion.
- En creacion, el boton `Guardar y completar detalles` es la manera clara de pasar de los datos minimos a los pasos complementarios despues de crear el articulo.
- En edicion, el usuario debe poder entrar a cualquier paso del drawer y modificar campos opcionales.
- Si una cuenta contable, IVA o rubro puede venir por defecto, mostrar el valor sugerido y permitir editarlo.
- Si el usuario intenta cerrar con cambios, pedir confirmacion.
- Si falla el guardado, conservar todo lo ingresado y mostrar el error dentro del drawer.

## Interaction Contract

| Trigger | Result | Surface | Returns to origin? | Notes |
| --- | --- | --- | --- | --- |
| Click en fila | Selecciona articulo y abre/muestra resumen | Drawer lateral contextual | yes | No cambia de vista y no agrega columna fija al layout. |
| Buscar | Filtra tabla | Header/listado | yes | Debe aceptar texto, codigo y codigo de barras. |
| Cambiar visualizacion | Alterna lista/grilla | Header/listado | yes | No debe perder busqueda, filtros ni seleccion. |
| Filtro Maneja series | Filtra articulos por condicion seriada | Header/listado | yes | Opciones: todos, seriados, no seriados. |
| Filtrar desde sidebar | Refina grilla visual | Sidebar de filtros | yes | En grilla, filtros laterales por rubro, estado, series, stock y precio/descuento. |
| Click en card | Selecciona articulo y abre/muestra resumen | Drawer lateral contextual | yes | Mismo comportamiento que click en fila. |
| Crear articulo | Inicia alta guiada | Drawer ancho | yes | Unifica `Alta Rapida` y `Nuevo`; al guardar, vuelve al catalogo con el articulo seleccionado. |
| Guardar en paso 1 | Crea articulo con datos minimos | Drawer ancho | yes | El boton se llama `Guardar`, no `Crear articulo`. |
| Guardar y completar detalles | Crea articulo y avanza a datos complementarios | Drawer ancho | yes | Evita obligar a completar todo para crear el registro. |
| Click en paso del stepper durante creacion | Navega si hay borrador o articulo guardado | Drawer ancho | yes | Si no hay articulo guardado, debe explicar que primero se guarda el minimo. |
| Click en paso del stepper durante edicion | Navega directamente a ese paso | Drawer ancho | yes | Todos los pasos deben ser editables si el articulo ya existe. |
| Accion Editar en fila | Selecciona articulo y abre edicion | Drawer ancho | yes | Boton visible en la fila; debe abrir todos los pasos editables, no solo datos minimos. |
| Accion Duplicar en fila | Selecciona articulo y crea copia editable | Drawer ancho | yes | Boton visible en la fila; debe abrir el mismo flujo de duplicacion que el drawer contextual. |
| Accion Eliminar en fila | Selecciona articulo y abre confirmacion | Dialog | yes | Boton visible en la fila; debe ser la misma confirmacion que desde el drawer/menu. |
| Editar rapido | Habilita campos frecuentes | Drawer lateral contextual | yes | Precio, codigo, codigo de barras, estado y rubro si se confirma. |
| Guardar rapido | Guarda solo cambios del drawer contextual | Drawer lateral contextual | yes | Mantener seleccion y feedback visible. |
| Editar completo | Abre configuracion completa | Drawer ancho/vista dedicada | yes | Para secciones largas y avanzadas. |
| Ajustar stock | Pide deposito, cantidad y motivo | Dialog/sheet | yes | No editar stock directo como campo simple. |
| Crear rubro desde selector | Crea clasificacion faltante | Drawer/modal contextual | yes | Vuelve con rubro seleccionado. |
| Crear subrubro desde selector | Crea hijo dentro del rubro seleccionado | Drawer contextual | yes | Preserva el borrador completo y vuelve con rubro/subrubro seleccionados. |
| Crear caracteristica/valor desde articulo | Crea atributo faltante | Drawer/modal contextual | yes | Vuelve al articulo con el campo actualizado. |
| Duplicar | Crea copia editable | Drawer/vista dedicada | yes | Debe evitar duplicar codigo/codigo de barras sin validacion. |
| Eliminar | Pide confirmacion con impacto | Dialog | yes | Accion secundaria y permission-gated. |
| Deshabilitar | Cambia disponibilidad del articulo | Drawer/form + confirmacion si hay impacto | yes | Debe explicar impacto en venta. |

## Information Architecture

### Always Visible

- Busqueda.
- Filtros principales, incluyendo `Maneja series`.
- Listado.
- Columna de acciones por fila con botones visibles para `Editar`, `Duplicar` y `Eliminar`.
- Codigo.
- Descripcion.
- Codigo de barras.
- Precio de venta.
- Estado habilitado/deshabilitado.
- Indicador de seriado cuando aplique.
- Producto seleccionado solo cuando el drawer contextual esta abierto.
- Acciones frecuentes del seleccionado.

### Contextual / Secondary

- Imagen.
- Rubro/subrubro extendido.
- Proveedor.
- Presentacion minima.
- Ubicacion en deposito.
- Unidad de medida.
- Caracteristicas del articulo.
- PLU.
- Stock por deposito.
- Series.
- Variaciones.
- Receta/costo.
- Concepto AFIP.

### Hidden Unless Requested

- Codigos de compatibilidad.
- Fecha de origen.
- Campos de exportacion.
- Comision.
- Auditoria.
- Logs de balanza.
- Datos tecnicos de integracion.

### Candidate To Remove From Primary Surface

No eliminar datos de negocio todavia. Si removerlos del primer viewport:

- Formulario completo persistente debajo de la tabla.
- Columna fija permanente de detalle a la derecha del listado.
- Tabs inferiores como forma principal de navegar detalle.
- Acciones destructivas en toolbar principal.
- Menu de tres puntos para `Editar`, `Duplicar` y `Eliminar` cuando esas son las acciones principales de la fila.
- `Alta Rapida` o `Nuevo` como flujos separados compitiendo con `Crear articulo`.
- Boton `Crear articulo` dentro del drawer de alta/edicion.
- `Articulos Seriados` como vista principal separada para la busqueda cotidiana.
- `Caracteristicas` como pantalla de carga independiente cuando el usuario esta creando/editando un articulo.

## Actions

| Action | Frequency | Risk | Placement | Confirmation | Permission |
| --- | --- | --- | --- | --- | --- |
| Buscar | alta | baja | header | no | todos |
| Filtrar seriados | media | baja | header/filtros | no | todos |
| Crear articulo | media | media | header | no, abre drawer guiado | segun permiso |
| Guardar | alta/media | media | drawer/footer de formulario activo | no | segun permiso |
| Guardar y completar detalles | media | media | drawer/footer paso 1 | no | segun permiso |
| Editar desde fila | alta/media | media | boton visible en columna acciones | no | segun permiso |
| Duplicar desde fila | baja/media | media | boton visible en columna acciones | confirmar si duplica datos sensibles | segun permiso |
| Eliminar desde fila | baja | destructiva | boton visible en columna acciones | si | admin/permiso |
| Editar rapido | alta/media | media | drawer contextual | no, salvo impacto | segun permiso |
| Editar completo | media | media | drawer contextual | no | segun permiso |
| Ajustar stock | media | alta | drawer contextual | requiere motivo | segun permiso |
| Duplicar | baja/media | media | menu contextual/drawer | confirmar si duplica datos sensibles | segun permiso |
| Deshabilitar | baja/media | media/alta | drawer o menu | si hay impacto | segun permiso |

## States

- Loading: mostrar tabla skeleton o estado de carga sin desplazar header.
- Empty: explicar que no hay articulos y ofrecer crear articulo.
- No selection: tabla visible a ancho completo; drawer cerrado; no mostrar columna vacia de seleccion.
- Selected: drawer lateral contextual abierto con resumen y acciones.
- Creating step 1: drawer abierto con datos minimos y acciones `Guardar` / `Guardar y completar detalles` deshabilitadas hasta completar obligatorios; si estan deshabilitadas debe verse la causa exacta.
- Creating details: despues de guardar el minimo, drawer mantiene stepper y permite navegar datos complementarios.
- Editing: todos los pasos del drawer son navegables y editables; bloquear cambio de seleccion o advertir por cambios sin guardar.
- Validation error: mostrar errores junto al campo y resumen si el formulario es largo.
- Save success: feedback no intrusivo; mantener seleccion.
- Save failure: conservar datos ingresados y explicar recuperacion.
- Permission denied: mostrar accion deshabilitada con motivo, o esconder si el rol nunca puede usarla.
- Unsaved changes: confirmar antes de cerrar drawer, cambiar registro o navegar.

## Builder Handoff

- Components needed:
  - `ListDetailWorkspace`
  - `WorkspaceHeader`
  - `ProductTable`
  - `ProductGrid`
  - `ProductCard`
  - `CatalogViewToggle`
  - `CatalogFilterSidebar`
  - `RowActions`
  - `ProductDetailDrawer`
  - `ProductQuickEdit`
  - `GuidedProductDrawer`
  - `ProductCreationStepper`
  - `ProductFullEditDrawer`
  - `ProductCharacteristicsFields`
  - `SerializedProductFilter`
  - `StockAdjustmentDialog`
  - `CategorySelectorWithCreate`
- Data needed:
  - productos con codigo, descripcion, codigo de barras, precio, descuento si aplica, estado, stock/resumen, rubro/subrubro e imagen opcional.
  - permisos por accion.
  - errores de validacion.
  - estados de guardado.
  - definicion de obligatorios del paso 1.
  - imagen/foto opcional del articulo y estado `sin imagen`.
  - defaults para IVA, moneda, cuentas contables, tipo de producto y articulo de.
  - flag `handlesSerials` o equivalente para filtro/indicador de seriado.
  - definiciones de caracteristicas aplicables y valores disponibles.
- Reusable pattern: `list-detail-workspace`.
- Must preserve:
  - densidad operativa;
  - busqueda visible;
  - alternancia lista/grilla;
  - filtros laterales en grilla;
  - lenguaje de articulo/producto;
  - acceso a configuraciones avanzadas.
- Must avoid:
  - formulario completo persistente bajo tabla;
  - columna fija persistente de detalle al lado de la tabla;
  - tabs inferiores para todo el detalle;
  - acciones del seleccionado en toolbar global sin contexto;
  - menu de tres puntos para acciones principales de fila;
  - drawer de detalle mas angosto que el drawer de alta/edicion;
  - dos caminos competidores para crear articulos;
  - CTA `Crear articulo` dentro del drawer;
  - drawer de alta/edicion con ancho default chico;
  - stepper ocupando tanto o mas espacio que el formulario;
  - caracteristicas dentro del paso `Datos minimos`;
  - boton `Guardar` o `Guardar y completar detalles` deshabilitado sin indicar que validacion falta;
  - modo edicion que solo deja editar el paso 1 o impide navegar a pasos opcionales;
  - vistas separadas para seriados o caracteristicas cuando el usuario esta trabajando dentro de articulos;
  - UI card-heavy o de marketing;
  - grilla de cards que oculte acciones frecuentes o no abra el mismo drawer contextual.

## Open Questions

| Question | Why it matters | Blocking? |
| --- | --- | --- |
| Que otras vistas repiten exactamente este patron de grilla + formulario inferior | Define alcance del patron reutilizable | no |
| Que campos se editan con mas frecuencia desde el catalogo | Define contenido real de edicion rapida | yes before final build |
| Que validaciones bloquean guardar articulo | Evita errores tardios y estados falsos | yes |
| Que roles pueden editar precio, stock, borrar o deshabilitar | Define acciones visibles y permisos | yes |
| La palabra principal debe ser articulo o producto en la UI final | Afecta consistencia de lenguaje | no |
| Cuentas contables, IVA, moneda y articulo de pueden venir siempre por defecto | Define si son campos visibles en paso 1 o valores sugeridos editables | yes before final build |
| Que caracteristicas son globales, por rubro o por tipo de articulo | Define que campos mostrar en el alta y evita llenar el drawer con atributos irrelevantes | yes before final build |
| Que reglas exactas hacen que un articulo sea seriado | Define el filtro, el badge y la seccion Series | yes before final build |
