# Escala de interfaz por usuario

## Objetivo

Permitir que cada usuario amplíe la interfaz completa sin alterar las proporciones con las que fue diseñada cada vista.

## Perfiles

| Perfil | Escala | Uso |
| --- | ---: | --- |
| Normal | 100% | Tamaños actuales del producto. |
| Grande | 125% | Amplía la interfaz completa a 1,25 veces su tamaño base. |
| Extra grande | 150% | Amplía la interfaz completa a 1,5 veces su tamaño base. |

La preferencia pertenece al usuario, se conserva entre sesiones y se aplica a toda la aplicación. En el prototipo se persiste localmente; en producto debe guardarse en las preferencias del usuario.

## Ubicación de la configuración

La selección vive en el menú del usuario, dentro de `Escala de interfaz`, junto a las preferencias de apariencia y densidad. El cambio se aplica inmediatamente y no requiere recargar la vista.

## Regla de escala

- No se usa `zoom` ni una transformación visual de la aplicación.
- Cada perfil cambia el tamaño raíz del sistema: 16 px, 20 px o 24 px.
- Tipografías, íconos, paddings, márgenes, gaps y dimensiones expresadas con tokens `rem` crecen desde la misma base.
- Los breakpoints y el tamaño real del viewport no cambian.
- La composición responsive sigue perteneciendo a cada vista.
- Tablas, formularios, menús y paneles conservan su posicionamiento y sus mecanismos de scroll originales.

## Criterios de aceptación

1. El usuario puede alternar entre 100%, 125% y 150% desde su menú.
2. La selección se mantiene al volver a ingresar.
3. Un componente medido en 150% conserva la relación entre sus tokens de texto, padding, íconos, alto y ancho.
4. Ningún perfil utiliza `zoom` ni introduce reglas particulares que deformen componentes.
5. El tamaño y los breakpoints del viewport permanecen sin cambios.
6. El perfil normal conserva exactamente la distribución y tamaños actuales.
