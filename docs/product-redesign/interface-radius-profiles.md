# Perfiles de esquinas por usuario

La preferencia global `Esquinas` permite que cada usuario elija la terminacion visual de los componentes sin alterar su tamaño ni la distribución de las vistas.

## Perfiles

| Perfil | Radio global | Uso |
| --- | ---: | --- |
| Estándar | 4 px | Mantiene la apariencia actual del producto. |
| Redondeado | 12 px | Suaviza las esquinas de los componentes. |

Los valores son fijos en pixeles y no cambian al modificar la escala tipografica.

## Alcance

La preferencia se aplica mediante el token global `--radius` a botones, campos, selectores, tarjetas, menus, modales, tablas y demas contenedores que utilicen el radio estandar del sistema.

Todos los tamaños y variantes de botón deben usar el mismo valor del perfil. Un botón compacto no puede reducir o limitar el radio elegido por el usuario.

No debe cambiar formas con significado propio:

- avatares y botones circulares;
- indicadores redondos;
- etiquetas y badges diseñados como pildoras.

El prototipo también redirige los usos heredados de `rounded-[4px]` al token global para que las vistas existentes respondan a la configuracion sin tener que reescribir cada componente.

## Persistencia

La seleccion pertenece al usuario y debe conservarse entre sesiones. El prototipo la persiste localmente con la clave `infomanager-radius-profile`; en el producto real debe guardarse como preferencia del perfil.
