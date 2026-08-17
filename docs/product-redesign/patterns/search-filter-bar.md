# Pattern: Search And Filter Bar

## Use When

Usar este patron en cualquier listado operativo que permita buscar y reducir una coleccion mediante uno o mas criterios.

Ejemplos actuales:

- Documentos de compra y venta.
- Ordenes de pago.
- Recibos.
- Cuenta corriente de clientes, como variante de consulta manual con filtro local de movimientos.
- Futuros listados administrativos con filtros aplicados a una misma tabla.

## UX Contract

El grupo de tabs debe distinguirse del fondo de pagina como una superficie unica. Usa `card` en tema claro y `muted` en tema oscuro; el tab activo suma una segunda superficie neutral y borde. No usar el azul primario como relleno para resolver esta jerarquia.

El contenedor reserva 8 px de padding en sus cuatro lados; el tab activo no toca los bordes superior ni inferior de la superficie agrupadora.

La cabecera de consulta usa dos filas independientes cuando existen `Tabs` de alcance o cuando el grupo de filtros no entra junto al ancho minimo legible del buscador:

```text
[ Buscar por numero, contraparte o identificacion fiscal                         ]
[ Tabs de alcance ]                 [ Periodo ][ Tipo ][ Estado ][ Punto ][ Anulados ]
```

Para listados sin `Tabs` cuyos filtros entren junto al ancho minimo legible del buscador, usar la variante compacta de una sola fila:

```text
[ Buscar por numero, contraparte o identificacion fiscal ][ Periodo ][ Estado ][ Local ][ Anulados ]
```

En esta variante, la busqueda ocupa el espacio flexible disponible y los filtros conservan ancho de contenido. No dejar una segunda fila que contenga solamente uno o dos controles alineados a la derecha.

### Fila 1: busqueda

- En la variante completa, la busqueda ocupa todo el ancho disponible y vive sola arriba de la barra de filtros.
- En la variante compacta, comparte fila con los filtros secundarios y ocupa todo el espacio restante sin comprimir sus placeholders de forma ilegible.
- El placeholder explica que valores admite; no necesita un titulo visual `Buscar` encima.
- Debe tener un nombre accesible explicito mediante `aria-label` o un label oculto para lectores de pantalla.

### Fila 2: filtros

- Es una unica fila compacta.
- Los `Tabs` de alcance rapido, cuando existen, se ubican a la izquierda.
- El grupo de filtros se ubica a la derecha.
- Entre ambos grupos se usa distribucion `space-between`.
- Cada control ajusta su ancho al contenido visible (`fit-content`).
- Los controles nunca se estiran para completar el espacio disponible ni se reparten el ancho con `flex: 1`.
- El espacio libre pertenece a la separacion entre `Tabs` y el grupo de filtros, no al ancho interno de los controles.
- No se muestran titulos individuales encima de cada control.
- El valor visible identifica el criterio, por ejemplo `Periodo: 30 d`, `Estado: todos` o `Punto: todos`.
- Cada control conserva un nombre accesible inequivoco aunque el texto visible ya identifique su funcion.
- Los cambios se aplican al instante y el conteo de resultados se actualiza sin un boton `Aplicar`.
- Si no hay `Tabs` y el grupo entra junto al ancho minimo legible del buscador, se integra en la misma fila.

### Tabs de alcance

- Usar el componente `Tabs` (`TabsList` + `TabsTrigger`) cuando los valores representan subconjuntos pares de la misma coleccion.
- No recrear este control con `Button`.
- No usar `ToggleGroup`: el alcance activo es uno y controla el contenido de la tabla asociada.
- Los tabs pueden incluir conteos breves sin convertirlos en badges protagonistas.

## Surface Contract

- Titulo/CTA, busqueda, barra de filtros y tabla pertenecen al mismo bloque visual de trabajo.
- No insertar un divisor horizontal entre filtros y tabla.
- No cambiar el color de fondo entre la cabecera de consulta y el area que contiene la tabla.
- Busqueda, barra de filtros y tabla comparten exactamente el mismo gutter horizontal.
- La separacion vertical entre busqueda, filtros y tabla usa el espaciado compacto del sistema; no se simula una nueva seccion mediante padding doble.
- La tabla puede conservar su propio borde para delimitar filas y columnas, pero no debe parecer otra superficie desconectada de los controles que la modifican.

## Visibility Contract

- Los filtros nunca se ocultan detras de `Mas filtros`, iconos sin texto, popover, dropdown, drawer, sheet o modal.
- No dividir los criterios frecuentes entre una barra visible y otra superficie secundaria.
- En desktop y tablet, busqueda y filtros deben permanecer dentro del primer viewport junto con el inicio de la tabla.
- Si un ancho reducido no admite todos los controles, conservar la fila y permitir desplazamiento horizontal compacto con todos los criterios en el mismo orden; no reemplazarlos por una accion que los oculte.
- Un criterio excepcional que no pueda mostrarse bajo este contrato debe validarse y documentarse antes de incorporarlo.

## Accessibility Contract

- El buscador tiene nombre accesible y conserva contraste de placeholder.
- Cada `Select` tiene `aria-label` o label oculto equivalente.
- Los tabs exponen semantica `tablist`/`tab`, seleccion unica y navegacion por teclado.
- El checkbox tiene label asociado y clickeable.
- El orden de foco sigue el orden visual: busqueda, tabs y luego filtros de izquierda a derecha.
- El estado seleccionado nunca depende solo del color.

## Builder Contract

Composicion recomendada:

- `SearchRow`: `Input` full-width con icono opcional para la variante completa; `flex: 1` dentro de la fila para la variante compacta.
- `FilterBar`: contenedor horizontal con `justify-between`.
- `ScopeTabs`: grupo opcional alineado a la izquierda.
- `FilterGroup`: grupo compacto de ancho contenido alineado a la derecha.
- Controles compactos de altura consistente y radio definido por el sistema visual.
- `SearchRow`, `FilterBar` y tabla dentro del mismo contenedor de superficie y padding.

Este patron gobierna la disposicion. Cada vista define los criterios y sus reglas de dominio.
