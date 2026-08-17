# View: Diseno de Etiquetas

## Metadata

- View ID: `diseno-etiquetas`
- Product area: Catalogo / Etiquetas
- Status: draft
- Source material:
  - Captura del editor `Nuevo Diseno` provista el 2026-07-22.
  - Conversacion de redisenio del 2026-07-22.
- Related views:
  - `./impresion-etiquetas.md`
  - `./catalogo-articulos.md`
- Related patterns:
  - `../patterns/sidebar-navigation.md`

## Product Job

- Primary user: administrativo, encargado o soporte con permisos para configurar etiquetas.
- Primary job: crear y guardar un diseno reutilizable de etiqueta para luego imprimirlo con datos de articulos.
- Secondary jobs: elegir formato y medidas, agregar elementos al lienzo, ajustar sus propiedades, cambiar zoom y reutilizar disenos existentes.
- Frequency: ocasional; la impresion puede ser frecuente, pero el diseno se prepara y reutiliza.
- Pressure: media. El usuario necesita precision visual y dimensional, pero no una experiencia grafica profesional compleja.
- Success event: el usuario guarda un diseno valido, reconocible y disponible en `Catalogo > Impresion de etiquetas`.

## Scope

Esta vista conserva el modelo actual de editor visual:

1. Herramientas y disenos a la izquierda.
2. Lienzo central con reglas, grilla y zoom.
3. Propiedades del elemento seleccionado.
4. Configuracion de pagina a la derecha.
5. Accion explicita `Guardar diseno`.

Queda fuera de alcance:

- Seleccionar articulos o cantidades para imprimir.
- Elegir impresora o ejecutar impresion.
- Inventar formatos, lenguajes de impresora, margenes, DPI o reglas de codigo de barras no visibles en la evidencia.
- Reemplazar el editor por un wizard o formulario sin lienzo.

## Navigation Contract

Entrada principal:

1. Sidebar: `Catalogo`.
2. Item: `Diseno de etiquetas`.

Destinos relacionados dentro de Catalogo:

- `Articulos`.
- `Impresion de etiquetas`.
- `Consulta rapida` cuando corresponda.

`Diseno de etiquetas` e `Impresion de etiquetas` son dos destinos distintos porque representan trabajos diferentes: configurar una plantilla e imprimir un lote. No deben mezclarse en una unica pantalla con tabs que oculten el contexto actual.

Si el usuario llega desde `Impresion de etiquetas` porque no existe ningun diseno, al guardar debe poder volver a impresion con el nuevo diseno disponible. Esta continuidad es una mejora UX; no cambia las reglas del diseno.

## Current Structure To Preserve

### Header

- Titulo del diseno actual: `Nuevo diseno` o nombre guardado.
- CTA principal `Guardar diseno`.

### Left rail: tools and designs

Herramientas visibles:

- `Agregar texto`.
- `Codigo de barras`.
- `Codigo QR`.
- `Recuadro / borde`.

Gestion del diseno:

- Campo `Nombre del diseno`.
- Seccion `Disenos`.
- Accion `Nuevo`.
- Lista de disenos guardados.
- Estado vacio `No hay disenos`.

### Canvas

- Lienzo central dominante.
- Grilla visible.
- Reglas horizontal y vertical con medidas.
- Controles de zoom `-`, porcentaje actual y `+`.
- Seleccion y manipulacion de elementos dentro de los limites de la etiqueta.

### Properties panel

- Titulo `Propiedades`.
- Sin seleccion: mensaje `Selecciona un elemento en el lienzo para editar sus propiedades`.
- Con seleccion: mostrar solo las propiedades correspondientes al tipo de elemento seleccionado.

No documentar propiedades concretas de texto, codigo de barras, QR o borde hasta contar con evidencia del panel seleccionado.

### Page configuration

- `Formato`.
- `Ancho (mm)`.
- `Alto (mm)`.
- `Orientacion`:
  - `Vertical`.
  - `Apaisado`.
  - `De la impresora`.

## Small UX Improvements

El flujo y la distribucion general se conservan. Las mejoras permitidas son acotadas:

1. Agregar `Ajustar al lienzo` junto a los controles de zoom para evitar porcentajes poco manejables y recuperar rapidamente toda la etiqueta.
2. Mostrar un indicador discreto `Sin guardar` cuando cambian nombre, pagina o elementos.
3. Validar nombre, ancho y alto junto al campo antes de guardar; no esperar a una alerta final generica.
4. Mantener el boton `Guardar diseno` siempre visible en el primer viewport.
5. Al cambiar de diseno o crear uno nuevo con cambios pendientes, confirmar antes de descartar.
6. En el estado sin disenos, mantener `Nuevo` como accion directa y no agregar una pantalla intermedia.
7. Mantener la configuracion de pagina visible; no ocultarla en un drawer o menu de configuracion.

No incorporar autosave, historial de versiones, alineacion inteligente, capas, plantillas remotas ni propiedades nuevas sin validacion de producto.

## Interaction Contract

| Trigger | Result | Surface | Notes |
| --- | --- | --- | --- |
| `Nuevo` | Prepara un diseno vacio | Editor actual | Conserva formato por defecto solo si esa regla existe. |
| Elegir diseno guardado | Carga su lienzo y configuracion | Mismo editor | Confirmar si hay cambios sin guardar. |
| Agregar texto | Inserta un elemento de texto | Canvas | Propiedades exactas pendientes. |
| Agregar codigo de barras | Inserta el elemento correspondiente | Canvas | Simbologia y datos vinculados pendientes. |
| Agregar codigo QR | Inserta el elemento correspondiente | Canvas | Contenido y validacion pendientes. |
| Agregar recuadro/borde | Inserta elemento grafico | Canvas | Estilos disponibles pendientes. |
| Seleccionar elemento | Muestra sus propiedades | Panel Propiedades | No mostrar propiedades de otros tipos. |
| Cambiar formato/medidas/orientacion | Actualiza limites y previsualizacion | Configuracion de pagina + canvas | Advertir si un cambio deja elementos fuera del area. |
| Zoom `-` / `+` | Cambia escala visual | Canvas | No cambia medidas reales. |
| `Ajustar al lienzo` | Calcula zoom para ver la etiqueta completa | Canvas | Mejora UX propuesta. |
| `Guardar diseno` | Valida y persiste la plantilla | Header | No imprime. |

## Field Traceability

| Legacy item | Target decision | Modern location | Status |
| --- | --- | --- | --- |
| Nuevo Diseno | Keep visible as current design identity | Header | confirmed by screenshot |
| Guardar Diseno | Keep as primary action | Header | confirmed by screenshot |
| Herramientas | Keep visible | Left rail | confirmed by screenshot |
| Agregar Texto | Keep visible | Left rail | confirmed by screenshot |
| Codigo de Barras | Keep visible | Left rail | confirmed by screenshot |
| Codigo QR | Keep visible | Left rail | confirmed by screenshot |
| Recuadro / Borde | Keep visible | Left rail | confirmed by screenshot |
| Nombre del Diseno | Keep visible | Left rail | confirmed by screenshot |
| Disenos | Keep visible | Left rail | confirmed by screenshot |
| + Nuevo | Keep visible | Left rail | confirmed by screenshot |
| No hay disenos | Keep as empty state | Saved designs area | confirmed by screenshot |
| Zoom - / porcentaje / + | Keep visible | Above canvas | confirmed by screenshot |
| Reglas y grilla | Keep visible | Canvas | confirmed by screenshot |
| Propiedades | Keep visible | Right inspector | confirmed by screenshot |
| Prompt sin seleccion | Keep visible | Properties empty state | confirmed by screenshot |
| Formato | Keep visible | Page configuration | confirmed by screenshot |
| Ancho (mm) | Keep visible | Page configuration | confirmed by screenshot |
| Alto (mm) | Keep visible | Page configuration | confirmed by screenshot |
| Vertical / Apaisado / De la impresora | Keep visible | Page configuration | confirmed by screenshot |
| Propiedades por elemento | Needs confirmation | Properties panel | not visible in supplied capture |

## States

- New design: lienzo vacio, nombre inicial y configuracion de pagina visible.
- Saved design selected: lienzo y configuracion cargados.
- No saved designs: mensaje y accion `Nuevo` disponibles.
- No selected element: panel Propiedades con instruccion breve.
- Element selected: propiedades contextuales del tipo.
- Invalid page configuration: error inline; guardar bloqueado.
- Unsaved changes: indicador visible y confirmacion antes de abandonar/cambiar.
- Saving: bloquear doble accion y conservar el lienzo.
- Save error: mantener todo el trabajo y permitir reintentar.
- Permission denied: editor de solo lectura o destino no visible, segun contrato futuro.

## Builder Contract

- Mantener editor de cuatro zonas en desktop.
- El canvas recibe la mayor parte del ancho y alto disponible.
- Rails laterales pueden tener scroll interno; no deben empujar el CTA fuera del primer viewport.
- En tablet, Herramientas y Propiedades pueden convertirse en paneles laterales alternables, manteniendo el canvas como centro.
- No afirmar soporte mobile para edicion precisa hasta validar manipulacion tactil.
- Usar datos simulados solo para disenos y elementos; no simular impresion desde esta vista.

## Acceptance Criteria

1. Se accede desde `Catalogo > Diseno de etiquetas`.
2. Herramientas, canvas, propiedades y configuracion de pagina conservan la estructura reconocible de la captura.
3. Se puede iniciar, nombrar y guardar un diseno.
4. El canvas puede ajustarse al espacio disponible sin cambiar sus medidas reales.
5. Cambios invalidos o sin guardar se comunican antes de perder trabajo.
6. El diseno guardado queda disponible para `Impresion de etiquetas`.
7. No se inventan propiedades, formatos ni reglas de impresora no documentadas.

## Open Domain Questions

- Propiedades editables de cada tipo de elemento.
- Fuentes, tamanos, alineaciones, rotacion, colores y orden de capas disponibles.
- Simbologias y fuentes de datos para codigo de barras y QR.
- Formatos predefinidos y limites validos de ancho/alto.
- Comportamiento cuando un cambio de pagina deja elementos fuera del area.
- Permisos para crear, editar, duplicar o eliminar disenos.
- Persistencia, alcance por empresa/local y compatibilidad con IM4.

