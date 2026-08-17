# App Shell And Navigation

## Purpose

Definir como conviven las vistas dentro del producto: sidebar, pestanas, toolbar, busqueda, acciones globales y transiciones entre flujos.

Patrones relacionados:

- `patterns/sidebar-navigation.md`
- `patterns/list-detail-workspace.md`

## Current Problem To Avoid

El legacy usa muchas pestanas y accesos equivalentes. Eso hace que cada modulo parezca una ventana tecnica independiente, aunque muchas tareas pertenecen al mismo flujo operativo.

El redisenio debe diferenciar:

- navegacion global del producto;
- navegacion local dentro de un area;
- detalle contextual de un registro;
- acciones del registro seleccionado;
- flujos secundarios que devuelven informacion al origen.

## Shell Regions

| Region | Owns | Should Not Own |
| --- | --- | --- |
| Sidebar | Areas principales del producto y accesos frecuentes por rol | Acciones de un registro seleccionado |
| Sidebar header | Control de expandir/contraer, marca del producto, nombre del producto y empresa/local activo | Usuario, logout, tema, zoom |
| Sidebar footer | Usuario, cuenta, preferencias, tema, zoom y logout | Navegacion principal del negocio |
| View header | Titulo de la vista, busqueda principal, filtros, CTA principal | Acciones destructivas ocultas sin contexto |
| Primary workspace | Lista, tablero, formulario o flujo principal | Detalles avanzados que no afectan la tarea primaria |
| Context drawer / sheet | Registro seleccionado, resumen, acciones contextuales | Navegacion global o columna fija permanente que reduzca el listado |
| Modal/dialog | Confirmaciones, decisiones bloqueantes, flujos cortos | Edicion larga o navegacion completa |

## Sidebar Rule

El sidebar debe llevar a areas de producto, no a cada subformulario tecnico.

Ejemplos:

- `Ventas`
- `Catalogo`
- `Clientes`
- `Caja`
- `Stock`
- `Compras`
- `Proveedores`
- `Reportes`
- `Configuracion`

Para documentos comerciales, la composicion recomendada es:

| Area | Primary destinations | Notes |
| --- | --- | --- |
| Compras | `Documentos`, `Pagos`, `Proveedores` | Facturas, notas de credito/debito y remitos son filtros/tipos dentro de `Documentos`; proveedores se mantiene como destino propio dentro del contexto de compras. |
| Ventas | `Facturacion rapida / POS`, `Presupuestos`, `Documentos`, `Cobros`, `Cuenta corriente`, `Clientes` | POS sigue siendo el flujo operativo; Presupuestos administra propuestas comerciales sin efectos al guardar; los comprobantes se consultan en `Documentos`; cuenta corriente consulta saldo/movimientos sin registrar cobros; clientes mantiene su destino de administracion. |

No crear subitems permanentes separados para `Facturas`, `Notas de Credito`, `Notas de Debito` y `Remitos` cuando todos llevan al mismo trabajo de listado. Tampoco mezclar `Ordenes de Pago` o `Recibos` dentro de `Documentos`: representan movimiento de dinero y requieren contexto propio.

`Compras > Pagos` abre el listado operativo de ordenes de pago. `Ventas > Cobros` abre el listado operativo de recibos. Ambos reutilizan la estructura de listado, filtros, detalle y alta definida en `views/pagos-y-cobros.md`.

`Ventas > Cuenta corriente` abre la consulta de saldo y movimientos de un cliente definida en `views/cuenta-corriente-clientes.md`. Es una vista de lectura; cualquier operacion de cobro permanece en `Ventas > Cobros`.

`Ventas > Presupuestos` abre el listado y la creacion/edicion definidos en `views/presupuestos.md`. Permanece separado de `Documentos` porque guardar un presupuesto solamente persiste una propuesta comercial: no factura, no fiscaliza, no reserva stock y no afecta cuenta corriente.

Dentro de `Catalogo`, no conviene que `Rubros`, `Caracteristicas`, `Depositos`, `Balanza`, `Series` y `Variaciones` compitan como destinos principales para todos los usuarios. Deben aparecer como secciones contextuales, herramientas secundarias o administracion avanzada segun el caso.

La composicion documentada de Catalogo incluye:

- `Articulos` como entrada principal del catalogo.
- `Diseno de etiquetas` para crear y guardar plantillas visuales.
- `Impresion de etiquetas` para buscar articulos, preparar cantidades y ejecutar la impresion.
- `Consulta rapida` cuando corresponda al perfil; su modo cliente abre sin shell administrativo.

Diseno e impresion permanecen como destinos separados porque uno configura una plantilla reutilizable y el otro prepara un lote operativo. Deben enlazarse cuando falta un diseno, sin fusionarse en una unica vista.

`ABM` no debe aparecer como agrupador principal. Es una estructura tecnica del sistema, no una tarea del usuario.

La navegacion de catalogo debe privilegiar `Articulos` como entrada principal. Desde ahi se accede a crear, editar, filtrar seriados, configurar caracteristicas, trabajar variaciones o abrir herramientas relacionadas.

## Sidebar Composition Rule

El sidebar debe tener tres zonas claras:

| Zone | Content | Component direction |
| --- | --- | --- |
| Header | Logo/icono, nombre del producto, empresa/local activo | `ProductBrand` + `CompanySwitcher` |
| Content | Navegacion por areas de negocio y favoritos si aplican | `SidebarGroup` + `SidebarMenu` |
| Footer | Usuario, preferencias, apariencia, zoom y cerrar sesion | `NavUser` + `DropdownMenu` |

El usuario no debe estar arriba compitiendo con la empresa/local activa. Arriba vive el contexto de trabajo; abajo vive la cuenta.

El shell no agrega una barra superior persistente para repetir el titulo de la vista. Cada workspace resuelve su propio header y sus acciones contextuales; así recupera altura operativa y evita una segunda jerarquia visual.

## Sidebar Expand / Collapse Rule

El sidebar completo debe ser colapsable.

- Debe haber un trigger visible dentro del header del sidebar para alternar expandido/colapsado.
- Expandido: muestra labels, subitems, empresa/local completa y usuario completo.
- Colapsado: mantiene iconos, tooltips, item activo reconocible, empresa/local compacta y usuario compacto.
- Submenus en colapsado deben abrirse como flyout/popover si no hay espacio para mostrar hijos inline.
- No se debe perder acceso a ninguna area principal al colapsar.

Todo item del sidebar que despliega subitems debe mostrar un chevron a la derecha.

- Cerrado: chevron hacia la derecha o estado equivalente.
- Abierto: chevron hacia abajo o rotado.
- El chevron debe estar alineado a la derecha y no reemplazar el icono principal del area.
- Items sin hijos no muestran chevron.
- El estado seleccionado o activo debe mantener visible el indicador.

## Company / Store Switcher Rule

El cambio de empresa/local debe ser un componente dedicado en el header del sidebar, similar al `TeamSwitcher` de shadcn.

- Si hay pocos locales, usar `DropdownMenu`.
- Si hay muchos locales, usar `Popover` con `Command`/busqueda.
- El local activo debe ser visible sin abrir el menu.
- Evitar modal central para cambio simple de local, salvo que el flujo requiera confirmacion o carga compleja.

## User / Appearance Rule

El usuario debe resolverse con un componente inferior tipo `NavUser`.

El menu de usuario debe incluir:

- perfil/cuenta;
- preferencias;
- tema claro/oscuro;
- zoom o densidad;
- cerrar sesion.

`Zoom` y `Modo Claro` no deben ocupar espacio permanente en el sidebar salvo que se confirme que se usan constantemente durante la operacion diaria.

## Prototype Roles And Access

El sandbox representa permisos con dos usuarios hardcodeados para validar navegacion y alcance visual. No constituye autenticacion ni autorizacion productiva.

| Usuario | Contrasena | Rol | Vistas permitidas |
| --- | --- | --- | --- |
| `admin` | `infomanager` | Administrador | Todas las vistas y el laboratorio interno del prototipo |
| `vendedor` | `infomanager` | Vendedor | `Ventas > Facturacion rapida` y `Catalogo > Articulos` |

Contrato del prototipo:

- El login valida solamente estas combinaciones hardcodeadas.
- El usuario vendedor ve dos destinos: `Facturacion rapida` y `Articulos`, dentro de sus areas correspondientes.
- Grupos sin destinos permitidos y el laboratorio UX no se renderizan para vendedor.
- El footer identifica usuario y rol activos.
- La misma regla que filtra el sidebar bloquea intentos de navegacion interna a vistas no permitidas.
- Al iniciar sesion ambos perfiles ingresan en `Facturacion rapida`.
- Cerrar sesion elimina el usuario activo y vuelve al login.
- En producto real, el backend debe validar permisos en rutas, acciones y datos; ocultar navegacion por si solo no es seguridad.

## Tab Rule

Las pestanas superiores deben representar vistas abiertas o contextos de trabajo importantes. No deben usarse para exponer cada propiedad secundaria de una entidad.

Las tabs dentro de una vista solo se justifican cuando las secciones son pares reales y el usuario necesita alternar entre ellas con frecuencia. Para detalle de registro, preferir secciones, accordions o navegacion local dentro del drawer contextual.

## Action Placement Rule

| Action Type | Placement |
| --- | --- |
| Crear nuevo registro | View header |
| Buscar / filtrar | View header, pegado al listado |
| Accion frecuente del registro seleccionado | Drawer/sheet contextual del registro |
| Accion rapida por fila | Columna final de acciones en la tabla, usando iconos/menu compacto |
| Guardar cambios de un formulario activo | Dentro del drawer/form activo, sticky si es largo |
| Accion destructiva | Menu secundario contextual + confirmacion |
| Accion masiva | Toolbar de seleccion, visible solo cuando hay seleccion multiple |
| Flujo externo relacionado | Link/boton secundario que declare si abre drawer, modal o nueva vista |

La columna de acciones por fila no debe crear flujos alternativos. Si una fila ofrece `Editar`, debe abrir la misma edicion que se abre desde el drawer contextual del registro seleccionado. Si ofrece `Eliminar`, debe abrir la misma confirmacion contextual que se abre desde el drawer o menu del registro.

## Returning To Origin

Cuando una vista abre un flujo secundario para crear o seleccionar informacion, el sistema debe declarar que vuelve al origen.

Ejemplos:

- Crear rubro desde producto: vuelve al producto con el rubro seleccionado.
- Crear cliente desde venta: vuelve a la venta con el cliente seleccionado.
- Ajustar stock desde producto: vuelve al producto y actualiza stock/resumen.
- Ver comprobante desde venta: puede abrir detalle, pero debe conservar el contexto de venta.

## Responsive Rule

En desktop, el patron base para mantenimiento administrativo es `listado full-width + drawer lateral contextual bajo demanda`.

El detalle de un registro no debe implementarse como columna fija persistente al lado de la tabla, salvo que una vista lo declare explicitamente como split view. Por defecto, el drawer se abre al seleccionar una fila y se cierra sin alterar la estructura principal del listado.

En mobile/tablet angosto:

- la lista queda como primer nivel;
- el detalle se abre como pantalla o sheet;
- las acciones principales quedan sticky dentro del detalle;
- no se fuerza tabla ancha si el caso de uso real no lo soporta.
