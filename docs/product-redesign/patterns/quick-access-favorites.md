# Pattern: Quick Access Favorites

## Use When

Usar este patron cuando una vista operativa necesita que el usuario agregue items frecuentes sin salir de la tarea principal.

Ejemplos:

- POS / facturacion rapida.
- Pedidos rapidos.
- Reposicion o movimientos frecuentes.
- Cualquier flujo donde "favoritos" acelera una accion repetida.

## UX Principle

Favoritos debe acelerar una accion frecuente, no convertirse en una segunda navegacion ni ocupar el protagonismo del flujo.

El usuario debe poder:

1. Ver hasta 6 accesos frecuentes sin abrir una pantalla nueva.
2. Reconocer item + precio rapidamente.
3. Agregar el item con un click/tap.
4. Volver automaticamente al foco del flujo principal.

## Layout Contract

Desktop:

- Ubicar favoritos como banda compacta o panel plegable cercano al input principal.
- Mostrar hasta 6 favoritos visibles en la primera linea o primer bloque.
- Si hay mas de 6 favoritos, usar paginacion, scroll horizontal discreto o buscador dentro del panel.
- No usar una columna fija permanente si reduce el ancho del ticket, tabla o tarea principal.
- El panel abierto debe poder cerrarse sin perder el ticket ni el foco del scanner/input.

Mobile/tablet:

- Favoritos puede abrirse como sheet inferior o panel colapsable.
- Mostrar 2 a 4 items por vista segun ancho.
- Mantener el CTA de agregar como todo el card/tile, no un boton pequeno dentro.

## Card Contract

Cada favorito debe ser una tile compacta, no una card grande.

Contenido:

- Nombre del item.
- Precio.
- Estado solo si afecta la accion: sin precio, sin stock, deshabilitado.

Text:

- Nombre en tipografia mas chica que el item del ticket.
- Nombre puede ocupar hasta 2 renglones.
- Si sigue sin entrar, truncar al final del segundo renglon.
- Precio siempre visible y alineado para escaneo rapido.
- No usar tags decorativos ni metadatos secundarios dentro del tile.

Sizing:

- Height compacta y estable.
- Minimo tactil/clickable suficiente.
- Misma altura para todos los favoritos visibles.
- El contenido interno no debe cambiar el alto del tile.

Recommended desktop density:

- 6 favoritos visibles como objetivo.
- 3 por fila si el ancho es medio.
- 6 en una linea si el ancho lo permite sin achicar demasiado el texto.
- Si el layout no permite 6 sin degradar legibilidad, mostrar 4 y dejar paginacion/overflow claro.

## Interaction Contract

| Interaction | Behavior |
| --- | --- |
| Click favorito | Agrega item al flujo principal y devuelve foco al input/scanner |
| Favorito sin precio | No agrega directo; abre estado de resolucion o muestra motivo |
| Favorito sin stock si aplica | Puede bloquear o advertir segun regla del modulo |
| Buscar favorito | Filtra dentro del set de favoritos sin alterar busqueda principal |
| Paginacion/overflow | Mantiene el flujo principal intacto |

## Anti-Patterns

- Cards grandes que permiten ver solo 2 o 3 items cuando hay espacio para 6.
- Nombre en una sola linea que corta productos indistinguibles.
- Favoritos como columna permanente que desplaza la tabla/ticket.
- Repetir descripcion, rubro, stock, proveedor u otros datos secundarios.
- Tags decorativos dentro del tile.
- Perder foco del scanner/input despues de agregar un favorito.

## Builder Notes

El builder debe tratar favoritos como componente reutilizable:

- `QuickAccessFavorites`
- `FavoriteTile`
- `FavoriteSearch`
- `FavoritePagination`

Props esperadas:

- `items`
- `maxVisible = 6`
- `onSelect`
- `variant = "compact"`
- `showPrice = true`
- `returnFocusTarget`
