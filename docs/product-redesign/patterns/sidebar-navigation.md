# Pattern: Sidebar Navigation

## Purpose

Organizar la navegacion global por areas de negocio y tareas reales, no por tablas tecnicas o pantallas legacy.

El sidebar debe responder: "a que parte del negocio voy?". No debe responder: "que ABM tecnico abro?".

## Current Problem

La navegacion legacy expone demasiados submodulos como destinos equivalentes:

- `ABM`
- `Articulos`
- `Articulos Seriados`
- `Balanza`
- `Caracteristicas`
- `Costo de Produccion`
- `Depositos`
- `Generacion de variaciones`
- `Rubros`
- `Consulta`
- `Consulta Rapida`
- `Etiquetas`

Eso hace que el usuario tenga que conocer la estructura interna antes de poder completar tareas simples, como crear un articulo. Tambien ensucia la navegacion con capacidades que deberian vivir dentro de otros flujos.

## Target Sidebar Structure

### Header

El header del sidebar debe contener solo:

- control para expandir o contraer el sidebar;
- logo o icono del producto;
- nombre del producto;
- selector de empresa/local.

No debe mostrar el usuario como elemento principal. El usuario pertenece al area inferior de cuenta.

### Company / Store Switcher

Usar un componente tipo `TeamSwitcher` de shadcn:

- muestra empresa/local actual;
- abre un `DropdownMenu` o `Popover` con locales disponibles;
- permite cambiar local sin abrir un modal central si la lista es corta;
- si hay muchos locales, el dropdown puede incluir busqueda;
- debe mostrar claramente el local activo.

El switcher debe estar cerca del nombre del producto porque define el contexto de trabajo.

### Primary Navigation

Navegar por areas:

| Area | Purpose |
| --- | --- |
| Ventas | Facturacion, POS, cobro y operaciones de mostrador |
| Catalogo | Articulos, consulta de productos, etiquetas y herramientas de catalogo |
| Clientes | Clientes, datos fiscales y comerciales |
| Caja | Rendiciones, retiros, cierres y control |
| Stock | Depositos, movimientos, ajustes, reposicion y trazabilidad |
| Compras | Compra de mercaderia y recepcion |
| Proveedores | Proveedores y condiciones comerciales |
| Reportes | Consultas, informes y exportaciones |
| Configuracion | Usuarios, permisos, parametros, integraciones y preferencias administrativas |

`ABM` no debe aparecer como categoria principal. Es lenguaje tecnico, no una tarea del usuario.

### Permission-Based Visibility

- El sidebar renderiza solamente areas y destinos que contengan al menos una vista permitida para el usuario activo.
- Un area sin hijos autorizados desaparece completa; no se muestra vacia ni deshabilitada.
- Ocultar un destino y bloquear su apertura deben depender de la misma definicion de permisos.
- El rol vendedor del sandbox ve solamente `Ventas > Facturacion rapida` y `Catalogo > Articulos`.
- El rol administrador del sandbox conserva todos los destinos, incluido el laboratorio interno.
- La visibilidad del sidebar mejora claridad, pero la autorizacion real debe repetirse en backend y acciones sensibles.

### Expand / Collapse Indicators

Todo item de navegacion que tenga hijos desplegables debe mostrar un indicador visual a la derecha.

Reglas:

- Usar chevron derecho/abajo o chevron que rota segun estado.
- Estado cerrado: chevron apunta a la derecha o indica que puede abrirse.
- Estado abierto: chevron apunta hacia abajo o rota para indicar que puede cerrarse.
- El icono debe estar alineado a la derecha del item padre.
- El indicador debe formar parte del boton clickeable del item padre.
- Items sin hijos no deben mostrar chevron.
- El estado activo del item padre no debe ocultar el chevron.

Componentes sugeridos:

- `ChevronRight`
- `ChevronDown`
- `Collapsible`
- `CollapsibleTrigger`
- `CollapsibleContent`

### Collapsible Sidebar

El sidebar completo debe poder colapsarse y expandirse.

Reglas:

- Debe existir un control visible dentro del propio sidebar para colapsarlo/expandirlo.
- Estado expandido: muestra iconos, labels, empresa/local completa, subitems y usuario completo.
- Estado colapsado: conserva iconos principales, mantiene navegacion operable y oculta labels largos.
- En estado colapsado, cada item debe tener tooltip con el nombre del area.
- El item activo debe seguir siendo reconocible en ambos estados.
- Los grupos con hijos deben seguir indicando que son desplegables; si no hay espacio para subitems en colapsado, abrirlos en flyout/popover.
- El selector de empresa/local debe compactarse a icono o avatar del local con tooltip/popover.
- El usuario del footer debe compactarse a avatar/iniciales con dropdown.
- El estado expandido/colapsado debe persistir durante la sesion si la app ya tiene persistencia de preferencias.

No usar:

- Colapsar eliminando navegacion critica.
- Colapsar dejando texto cortado.
- Ocultar el item activo.
- Requerir recargar la vista para expandir o colapsar.

### Catalog Navigation

Dentro de `Catalogo`, la entrada principal debe ser:

- `Articulos`

Acciones o herramientas secundarias pueden aparecer solo si son frecuentes y justificadas:

- `Diseno de etiquetas`
- `Impresion de etiquetas`
- `Consulta rapida`
- `Herramientas de catalogo`

No deben aparecer como navegacion principal del sidebar:

- `Articulos Seriados`
- `Caracteristicas`
- `Rubros`
- `Depositos`
- `Generacion de variaciones`
- `Costo de Produccion`

Estas capacidades deben resolverse dentro de `Articulos`, `Stock`, `Reportes`, `Produccion` o `Configuracion`, segun su trabajo real.

Destino recomendado:

| Legacy item | Target pattern |
| --- | --- |
| `Articulos Seriados` | Filtro `Maneja series` dentro de `Catalogo > Articulos`, badge/columna en la grilla y seccion `Series` en el detalle del articulo |
| `Caracteristicas` | Grupo de campos opcionales dentro del alta/edicion del articulo; administracion de definiciones solo como configuracion secundaria |
| `Rubros` | Selector contextual con creacion inline desde alta/edicion |
| `Depositos` | Vista bajo `Stock` o `Configuracion`; no item principal de catalogo ni subpantalla de Articulos |
| `Generacion de variaciones` | Accion guiada desde articulo base |
| `Costo de Produccion` | Reporte o herramienta de produccion/costo |
| `Etiquetas > Diseno` | `Catalogo > Diseno de etiquetas`, editor visual reutilizable |
| `Etiquetas > Impresion` | `Catalogo > Impresion de etiquetas`, preparacion e impresion de lotes |

`Consulta rapida` tiene una regla especial: puede aparecer como herramienta de Catalogo para administradores, pero el uso de clientes debe abrir un modo kiosco/autoservicio sin sidebar.

`Diseno de etiquetas` e `Impresion de etiquetas` son destinos pares y relacionados, pero no tabs de una misma pantalla: configuran objetos y tareas diferentes. La impresion puede abrir el diseno como flujo secundario cuando no existe ninguna plantilla y volver al lote al finalizar.

### Commercial Documents Navigation

Dentro de `Compras` y `Ventas`, agrupar los comprobantes que comparten el mismo trabajo de consulta bajo `Documentos`.

Destino recomendado:

| Legacy item | Target destination |
| --- | --- |
| Facturas de compra, notas de credito/debito de compra y remitos de compra | `Compras > Documentos`, usando tipo como filtro y dato del documento |
| Facturas de venta, notas de credito/debito de venta y remitos de venta | `Ventas > Documentos`, usando tipo como filtro y dato del documento |
| Ordenes de pago | `Compras > Pagos` |
| Proveedores | `Compras > Proveedores` |
| Recibos/cobranzas | `Ventas > Cobros`; el destino abre la lista de recibos |
| Cuenta corriente / saldos de clientes | `Ventas > Cuenta corriente`; consulta de saldo y movimientos sin acciones de cobro |
| Clientes | `Ventas > Clientes` |
| Factura IMPOS / facturacion rapida | `Ventas > Facturacion rapida / POS`; los comprobantes emitidos se consultan luego en `Documentos` |

No usar `Facturas`, `Notas de Credito`, `Notas de Debito` y `Remitos` como cuatro destinos permanentes cuando solo cambian el filtro y el tipo de creacion del mismo workspace. La compra o venta se resuelve por el area elegida; no agregar un nivel de navegacion para volver a decidirlo.

Para el prototipo actual, la composicion visible esperada es:

- `Compras`: `Documentos`, `Pagos`, `Proveedores`.
- `Ventas`: `Facturacion rapida / POS`, `Documentos`, `Cobros`, `Cuenta corriente`, `Clientes`.

No duplicar `Clientes` y `Proveedores` como destinos globales si ya aparecen dentro de su area comercial. Sus vistas siguen siendo reutilizables desde accesos contextuales.

Ver `../views/documentos-comerciales.md`, `../views/pagos-y-cobros.md` y `../views/cuenta-corriente-clientes.md` para los contratos completos.

## Footer / User Area

El usuario debe vivir abajo del sidebar con un componente tipo `NavUser` de shadcn:

- avatar o iniciales;
- nombre de usuario;
- rol si aporta contexto;
- dropdown de cuenta.

El dropdown de usuario debe contener:

- perfil o cuenta;
- preferencias;
- apariencia: tema claro/oscuro;
- zoom o densidad de interfaz;
- cerrar sesion.

`Cerrar sesion` no debe estar como item grande permanente del sidebar si puede vivir dentro del menu de usuario.

## Zoom And Theme

Por defecto, `zoom` y `tema claro/oscuro` deben vivir dentro del menu de usuario o dentro de `Apariencia`.

Solo deben estar visibles permanentemente si se confirma que se usan con mucha frecuencia durante la operacion diaria, por ejemplo por monitores compartidos, problemas de vision o uso real en mostrador.

## Fast Access Rule

Una accion primaria frecuente no debe exigir atravesar multiples niveles tecnicos.

Para crear un articulo, el camino recomendado es:

1. `Catalogo > Articulos`.
2. `Crear articulo`.

Si hace falta acelerar mas, se puede agregar `Crear articulo` como accion rapida o favorito, pero no como item permanente que compita con `Articulos`.

## Builder Notes

Componentes shadcn esperados:

- `Sidebar`
- `SidebarHeader`
- `SidebarContent`
- `SidebarFooter`
- `SidebarGroup`
- `SidebarMenu`
- `SidebarMenuItem`
- `SidebarMenuButton`
- `SidebarTrigger`
- `SidebarRail`
- `DropdownMenu`
- `Popover` o `Command` si el selector de empresa/local requiere busqueda
- `Tooltip`
- `Avatar`

Componentes de producto sugeridos:

- `ProductBrand`
- `CompanySwitcher`
- `MainNavigation`
- `CatalogNavigationGroup`
- `NavUser`
- `AppearanceMenu`
