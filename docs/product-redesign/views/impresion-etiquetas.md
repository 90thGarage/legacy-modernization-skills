# View: Impresion de Etiquetas

## Metadata

- View ID: `impresion-etiquetas`
- Product area: Catalogo / Etiquetas
- Status: draft
- Source material:
  - Captura `Impresion de Etiquetas` provista el 2026-07-22.
  - Conversacion de redisenio del 2026-07-22.
- Related views:
  - `./diseno-etiquetas.md`
  - `./catalogo-articulos.md`
- Related patterns:
  - `../patterns/search-filter-bar.md`
  - `../patterns/sidebar-navigation.md`

## Product Job

- Primary user: administrativo, encargado, soporte o usuario operativo autorizado.
- Primary job: buscar articulos, definir cuantas etiquetas necesita y ejecutar una impresion usando un diseno guardado.
- Secondary jobs: ingresar peso cuando corresponda, revisar la vista previa y reconocer bloqueos de diseno, balanza o impresora.
- Frequency: variable por rubro; puede ser frecuente en comercios que rotulan productos, precios, peso o produccion propia.
- Pressure: media/alta cuando el usuario prepara muchas etiquetas. Debe poder reconocer el lote y su cantidad total sin revisar pantallas adicionales.
- Success event: se abre el dialogo de impresion del sistema con un diseno seleccionado y el total esperado de etiquetas.

## Scope

La vista conserva el modelo actual:

1. Busqueda de articulos arriba de la tabla.
2. Tabla operativa con articulo, precio, cantidad y peso.
3. Resumen del lote al pie.
4. Rail derecho con diseno, vista previa y accion `Imprimir`.
5. Impresion mediante el dialogo del sistema.

Queda fuera de alcance:

- Editar el contenido visual del diseno.
- Configurar drivers, impresoras o balanzas.
- Inventar calculos de peso, cantidad, copias, margenes, columnas o paginas.
- Ejecutar una impresion silenciosa sin confirmacion del sistema.

## Navigation Contract

Entrada principal:

1. Sidebar: `Catalogo`.
2. Item: `Impresion de etiquetas`.

Destino relacionado:

- `Catalogo > Diseno de etiquetas`.

Si no hay disenos, la vista no se convierte en un editor. Debe mostrar una accion directa `Crear diseno` que abre la vista correspondiente. Al guardar desde ese origen, se recomienda volver a impresion con el nuevo diseno disponible y seleccionado.

## Current Structure To Preserve

### Header

- Titulo `Impresion de etiquetas`.
- No agregar un segundo CTA de impresion en el header: la accion vive en el rail con su contexto y previsualizacion.

### Search and working list

- Busqueda por codigo, descripcion o codigo de barras.
- Estado de balanza visible junto a la busqueda cuando afecta el flujo.
- Tabla dominante con columnas:
  - `Codigo`.
  - `Descripcion`.
  - `Cod. barras`.
  - `Precio vta.`.
  - `Cantidad`.
  - `Peso`.
  - Indicador/accion de balanza observado en la captura; regla pendiente.
- Estado vacio `No se encontraron articulos`.

Supuesto de prototipo: la busqueda muestra los articulos coincidentes en la tabla y una cantidad mayor a cero los incorpora al lote de impresion. La mecanica exacta de seleccion debe validarse con el producto real.

### Batch summary

Pie siempre visible:

- Cantidad de articulos en la lista.
- Cantidad de articulos con cantidad mayor a cero.
- Total de etiquetas.

Los conteos deben actualizarse al modificar cantidad o peso.

### Print rail

- Titulo `Imprimir`.
- Selector `Diseno de etiqueta` cuando existan disenos.
- Estado sin disenos con acceso a `Diseno de etiquetas`.
- `Vista previa`.
- Mensaje cuando no hay diseno: `Selecciona un diseno`.
- Mensaje cuando no hay cantidades: `Carga cantidades en la tabla para imprimir`.
- CTA `Imprimir`.
- Aclaracion: se abrira el dialogo del sistema para elegir impresora.

## Small UX Improvements

El flujo base no cambia. Las mejoras propuestas son:

1. Convertir el aviso sin disenos en una accion directa `Crear diseno`, sin obligar al usuario a recordar la ruta.
2. Mantener el rail de impresion visible mientras la tabla tiene scroll.
3. Explicar por que `Imprimir` esta deshabilitado mediante un mensaje junto al boton.
4. Actualizar la vista previa en cuanto hay diseno y al menos un articulo con cantidad.
5. Mostrar en la vista previa un articulo representativo del lote, sin intentar representar todas las paginas.
6. Mantener los totales del lote visibles al pie de la tabla.
7. Tratar el aviso de balanza como contextual: no debe bloquear articulos que no requieren peso hasta validar la regla real.

No agregar un wizard de impresion, modal previo, filtros ocultos, configuracion avanzada de impresora ni seleccion automatica irreversible.

## Interaction Contract

| Trigger | Result | Surface | Notes |
| --- | --- | --- | --- |
| Escribir codigo/descripcion/codigo de barras | Actualiza articulos coincidentes | Tabla | Debounce y backend pendientes. |
| Cambiar cantidad | Actualiza lote y total de etiquetas | Fila + resumen | Cantidad valida pendiente. |
| Cambiar peso | Actualiza datos del articulo pesable | Fila + preview | Unidad y calculo pendientes. |
| Usar balanza | Obtiene peso si existe integracion | Fila | Hardware y fallback pendientes. |
| Elegir diseno | Actualiza vista previa | Rail derecho | No cambia cantidades cargadas. |
| `Crear diseno` | Abre Diseno de etiquetas | Vista relacionada | Debe conservar el lote si la navegacion actual lo permite. |
| `Imprimir` | Abre dialogo de impresion del sistema | Sistema operativo | Requiere diseno y total mayor a cero. |

## Action Gating

`Imprimir` permanece deshabilitado cuando:

- no existe o no se selecciono un diseno;
- el total de etiquetas es cero;
- hay un dato obligatorio invalido en una fila;
- existe un bloqueo real de impresora o permisos, cuando ese contrato se confirme.

El motivo debe mostrarse junto al boton. No usar solamente opacidad o color para comunicarlo.

## Field Traceability

| Legacy item | Target decision | Modern location | Status |
| --- | --- | --- | --- |
| Impresion de Etiquetas | Keep visible | Header | confirmed by screenshot |
| Buscar por codigo, descripcion o cod. de barras | Keep visible | Above table | confirmed by screenshot |
| Sin balanzas configuradas | Keep as contextual warning | Search row | confirmed by screenshot |
| Codigo | Keep visible | Table | confirmed by screenshot |
| Descripcion | Keep visible | Table | confirmed by screenshot |
| Cod. barras | Keep visible | Table | confirmed by screenshot |
| Precio vta. | Keep visible | Table | confirmed by screenshot |
| Cantidad | Keep visible/editable | Table | confirmed by screenshot |
| Peso | Keep visible/editable when applicable | Table | confirmed by screenshot |
| Indicador de balanza | Needs confirmation | Table | screenshot-inferred |
| No se encontraron articulos | Keep as empty state | Table | confirmed by screenshot |
| Articulos en la lista | Keep visible | Table footer | confirmed by screenshot |
| Con cantidad | Keep visible | Table footer | confirmed by screenshot |
| Total etiquetas | Keep visible | Table footer | confirmed by screenshot |
| Diseno de etiqueta | Keep visible | Print rail | confirmed by screenshot |
| No hay disenos cargados | Keep as blocking state | Print rail | confirmed by screenshot |
| Vista previa | Keep visible | Print rail | confirmed by screenshot |
| Selecciona un diseno | Keep as preview empty state | Preview | confirmed by screenshot |
| Carga cantidades en la tabla | Keep as action guidance | Print rail | confirmed by screenshot |
| Imprimir | Keep as primary action | Print rail | confirmed by screenshot |
| Dialogo del sistema | Keep as consequence explanation | Below action | confirmed by screenshot |

## States

- Loading articles: conservar search, tabla y rail; mostrar skeleton compacto.
- Empty search: `No se encontraron articulos` y permitir corregir busqueda.
- Articles loaded, no quantity: tabla disponible, total cero e impresion bloqueada.
- No saved designs: bloqueo claro y accion `Crear diseno`.
- Design selected, no batch: vista previa vacia guiada e impresion bloqueada.
- Ready: diseno seleccionado, total mayor a cero, preview disponible e impresion habilitada.
- Scale unavailable: aviso contextual y alternativa manual si el dominio la permite.
- Invalid row: error junto a cantidad/peso; conservar el resto del lote.
- Opening system dialog: evitar doble click sin borrar el lote.
- Print canceled: regresar con lote y diseno intactos.
- Print error: explicar que no se imprimio y permitir reintentar.
- Permission denied: ocultar destino o mostrar vista de solo lectura sin accion, segun contrato futuro.

## Layout Contract

Desktop:

- Tabla como region principal y scrollable.
- Rail de impresion a la derecha, compacto y visible.
- Busqueda directamente encima de la tabla que controla.
- Resumen pegado al pie de la region de resultados.
- La accion `Imprimir`, el diseno activo, el bloqueo y el total deben reconocerse en el primer viewport.

Tablet:

- Tabla primero.
- Rail puede pasar debajo o a un panel lateral, pero el resumen y la accion no deben quedar desconectados del lote.
- Mantener campos de cantidad y peso operables tactilmente.

Mobile:

- Requiere validacion antes de prometer impresion operativa completa.
- Si se representa, usar lista densa por articulo y resumen/accion sticky; no reducir la tabla hasta volverla ilegible.

## Data Contract

### LabelDesign

- id.
- name.
- widthMm.
- heightMm.
- orientation.
- preview representation.
- availability/status if the backend exposes it.

### PrintableArticle

- id.
- code.
- description.
- barcode.
- salePrice.
- quantity.
- weight.
- requiresWeight or equivalent, pending confirmation.
- scale eligibility/status, pending confirmation.

### PrintBatch

- selectedDesignId.
- article rows.
- articleCount.
- rowsWithQuantity.
- totalLabels.

No definir formula de `totalLabels` para articulos por peso hasta confirmar la regla real. Para articulos simples, el prototipo puede asumir que la cantidad representa copias.

## Acceptance Criteria

1. Se accede desde `Catalogo > Impresion de etiquetas`.
2. La busqueda, tabla, resumen, preview y accion principal permanecen reconocibles como en la captura.
3. La tabla permite preparar un lote sin abrir pantallas por articulo.
4. No se puede imprimir sin diseno ni con total cero, y el motivo es visible.
5. Si no hay disenos, existe acceso directo a `Crear diseno`.
6. La vista previa refleja el diseno y un articulo del lote cuando hay datos suficientes.
7. Cancelar o fallar la impresion no borra el lote.
8. La impresion abre el dialogo del sistema; no se inventa seleccion automatica de impresora.
9. Balanza, peso y calculo de copias quedan como reglas pendientes cuando no estan documentados.

## Open Domain Questions

- Si la busqueda muestra resultados o agrega articulos individualmente al lote.
- Reglas y limites de cantidad.
- Relacion exacta entre peso, cantidad y numero de etiquetas.
- Cuando se exige balanza y si existe ingreso manual de peso.
- Comportamiento de precio, vencimiento, lote o receta dentro de la etiqueta.
- Impresoras soportadas, formatos de pagina, margenes y multiples columnas.
- Permisos para imprimir y auditoria de impresiones.
- Persistencia del lote al navegar hacia Diseno de etiquetas.

