# Pattern: List-Detail Workspace

## Use When

Usar este patron cuando una vista legacy muestra:

- una grilla/listado de registros;
- un formulario persistente del registro seleccionado;
- tabs o paneles inferiores con datos del mismo registro;
- acciones globales que en realidad afectan al item seleccionado.

Ejemplos probables:

- ABM Articulos.
- ABM Clientes.
- Proveedores.
- Rubros/subrubros.
- Depositos.
- Usuarios/permisos.
- Listados administrativos con detalle editable.

## UX Problem

El patron legacy mezcla dos trabajos:

1. Buscar, comparar y seleccionar registros.
2. Consultar o editar un registro especifico.

Cuando ambos viven al mismo nivel visual, el usuario pierde espacio de lista, recibe informacion que no pidio y no siempre entiende que acciones afectan al registro seleccionado.

## Target Structure

| Layer | Purpose | Content |
| --- | --- | --- |
| View header | Encontrar y crear | Titulo, busqueda, filtros, CTA principal |
| Primary list | Comparar, seleccionar y actuar rapido | Tabla densa con columnas clave y columna final de acciones |
| Context drawer / sheet | Entender y actuar sobre seleccionado | Resumen, estado, acciones frecuentes, edicion rapida |
| Full edit surface | Configurar en profundidad | Secciones completas, validacion, guardado |
| Secondary flows | Resolver tareas relacionadas | Dialogs, drawers o vistas dedicadas con retorno al origen |

## Layout Contract

Desktop:

- listado ocupa el ancho disponible de la vista;
- el detalle contextual aparece como `Sheet`/drawer lateral derecho superpuesto al hacer click en un registro;
- no se reserva una columna fija permanente para el detalle;
- si no hay seleccion, no debe quedar una columna vacia o placeholder a la derecha;
- edicion rapida ocurre dentro del drawer contextual;
- edicion completa abre drawer ancho o vista dedicada;
- la tabla puede tener una columna final de acciones compactas para editar, duplicar o eliminar sin depender de abrir primero el drawer.

Row actions:

- Cuando las acciones principales por fila son pocas y conocidas, mostrarlas como botones visibles.
- Para editar, duplicar y eliminar, preferir tres botones compactos con icono y tooltip.
- No esconder acciones principales detras de un menu de tres puntos en desktop si la vista define esas acciones como frecuentes.
- En mobile o anchos muy reducidos, la vista puede colapsarlas en un menu, pero desktop debe priorizar acciones visibles.

Drawer sizing:

- Detail drawer: debe usar el mismo ancho que el drawer de creacion/edicion cuando muestra acciones y edicion rapida del registro.
- Creation/edit drawer: debe ser ancho, porque contiene formularios multi-campo.
- En desktop, el drawer de detalle ocupa aproximadamente 45-50vw. Los formularios seccionados de alta/edicion pueden ocupar 60-72vw, con minimo util de 760px y maximo cercano a 1180px cuando el viewport lo permita.
- El ancho default chico de shadcn no es suficiente para formularios operativos.
- Si el drawer incluye stepper, usar la variante horizontal compacta de `formulario-seccionado.md` arriba del formulario; no reservar una columna lateral.

Mobile/tablet angosto:

- listado primero;
- tap en registro abre detalle como pantalla/sheet;
- acciones quedan dentro del detalle;
- filtros deben ser accesibles sin ocupar toda la altura.

Filter bar:

- Aplicar `search-filter-bar.md`: usar dos filas cuando existen Tabs o tres o mas filtros; sin Tabs y con hasta dos filtros, integrar busqueda y filtros en una sola fila compacta.
- Los filtros rapidos que representan subconjuntos pares de una misma coleccion usan `Tabs` a la izquierda, no botones ni `ToggleGroup`.
- Los demas filtros forman un grupo compacto a la derecha, con distribucion `space-between` entre ambos grupos.
- Cada control usa ancho de contenido; no se estira con `flex: 1` para completar la fila.
- Busqueda, filtros y tabla comparten superficie, fondo y gutter horizontal; no hay divisor entre la barra y los resultados.
- El titulo, CTA, busqueda, filtros y tabla forman una misma tarea y una misma superficie; no separar un supuesto header mediante linea, panel o cambio de color de fondo.
- Busqueda, selects, tabs o controles equivalentes de la misma barra usan una altura visual uniforme.
- La vista completa no se encierra en una card o borde exterior. La tabla es el bloque que lleva borde, radio de 4 px y fondo de superficie, con el mismo gutter lateral que header, busqueda y filtros.
- El header de tabla usa altura compacta, labels mono en mayusculas y fondo `muted`; las filas operativas mantienen altura consistente de 44 px aproximadamente.
- Cuando existe una columna final de acciones, permanece visible al desplazar horizontalmente y conserva el fondo de la tabla.
- No mostrar titulos encima de cada control; su valor visible identifica el criterio y el nombre accesible completa la semantica.
- Nunca usar `Mas filtros`, popover, drawer o modal para ocultar criterios.
- Los cambios se aplican al instante y la tabla debe seguir visible en el primer viewport.

## Interaction Contract

| Interaction | Behavior |
| --- | --- |
| Click row | Selecciona registro y abre/actualiza drawer lateral derecho contextual |
| Accion Editar en fila | Selecciona registro y abre la misma edicion disponible desde el drawer contextual |
| Accion Eliminar en fila | Selecciona registro y abre la misma confirmacion destructiva disponible desde el drawer/menu |
| Double click / Enter | Abre edicion rapida o detalle, segun convencion de producto |
| Crear | Abre alta guiada en drawer ancho o formulario dedicado |
| Editar rapido | Habilita campos frecuentes dentro del drawer contextual |
| Editar completo | Abre superficie larga con todas las secciones |
| Guardar | Guarda solo el formulario activo |
| Cancelar | Descarta cambios del formulario activo sin perder seleccion |
| Eliminar/deshabilitar | Confirmacion contextual con impacto visible |
| Abrir flujo relacionado | Conserva origen y vuelve con datos actualizados |

## Information Rules

Siempre visible:

- identidad del registro;
- estado principal;
- campos usados para comparar;
- acciones frecuentes;
- columna de acciones compacta si acelera trabajo repetido sin duplicar flujos.

Secundario:

- configuraciones opcionales;
- datos tecnicos;
- auditoria;
- historiales;
- integraciones;
- acciones raras.

No usar:

- formulario completo persistente debajo de la tabla;
- columna fija permanente para mostrar el detalle del registro seleccionado;
- drawer de creacion/edicion angosto que corte campos, labels o selects;
- drawer contextual de detalle mas angosto que el drawer de alta/edicion cuando ambos pertenecen a la misma entidad;
- tabs inferiores con todas las secciones del registro;
- toolbar global para acciones que solo aplican al seleccionado;
- acciones por fila que abren experiencias distintas a las del drawer/contexto;
- menu de tres puntos para acciones principales de fila cuando hay espacio para mostrar botones directos;
- cards decorativas que reducen densidad operativa.

## Builder Notes

El builder debe tratar este patron como componente reutilizable:

- `ListDetailWorkspace`
- `WorkspaceHeader`
- `DataGrid`
- `RowActions`
- `ContextDrawer`
- `QuickEditSection`
- `FullEditDrawer`
- `RelatedFlowDialog`

Cada vista debe pasar columnas, acciones, secciones y reglas propias.
