# Pattern: Formulario Seccionado

## Metadata

- Pattern ID: `formulario-seccionado`
- Status: draft
- First reference view: Crear articulo
- Related patterns: `formulario-simple`, `abm-compuesto`

## Purpose

Estandarizar formularios de alta o edicion que necesitan varias secciones porque combinan decisiones obligatorias, configuracion dependiente o capacidades opcionales.

## Stable Contract

### Layout

1. Header informativo con tarea, entidad y estado.
2. Secciones en el orden en que el usuario puede decidir y completar la carga.
3. Identidad y datos obligatorios antes que configuraciones opcionales.
4. Capacidades condicionales visibles solo cuando aplican y con su consecuencia explicita.
5. Barra inferior compartida con progreso/validacion, cancelar y finalizacion.

### Stepper Contract

- Cuando exista una secuencia real, el stepper se ubica horizontalmente arriba del formulario activo; no reserva una columna lateral permanente.
- Los pasos se representan mediante puntos numerados conectados y distribuidos sobre todo el ancho util del contenedor, respetando solamente su padding interno.
- Hover y foco sobre cada punto muestran un tooltip con el nombre y los datos incluidos en ese paso.
- Los pasos bloqueados siguen siendo enfocables para explicar qué contienen y qué condición los habilita; `aria-disabled` comunica que todavía no navegan.
- No se muestra nombre, progreso, instruccion ni comentario persistente debajo de los puntos. Toda explicacion contextual del stepper vive en el tooltip o en el contenido del formulario.
- El formulario usa todo el ancho disponible debajo del stepper y conserva la barra de acciones al pie.
- En mobile no depender del hover para navegar: los numeros y el estado activo permanecen visibles; el tooltip tambien se obtiene por foco.

### Section Rules

- Una seccion responde una pregunta concreta del formulario.
- Tabs se usan para grupos pares; stepper solamente cuando existe una secuencia obligatoria real.
- Una seccion no reserva una columna lateral cuando su contenido termina.
- Guardado parcial debe declarar claramente que parte queda incompleta.

## Required States

Incluye los estados de `formulario-simple` y ademas:

- Seccion incompleta o bloqueada por dependencia.
- Capacidad opcional activada/desactivada.
- Error parcial sin perder otras secciones.
- Entidad minima persistida pendiente de configuracion.

## Not Allowed

- Presentar todas las opciones con la misma jerarquia.
- Convertir cada seccion en otro destino del sidebar.
- Guardar silenciosamente una parte y comunicar que toda la entidad esta completa.
- Mantener la finalizacion arriba mientras el usuario completa secciones hacia abajo.

## Builder Contract

Reutilizar los controles de `formulario-simple`, `FormSection`, capacidades condicionales y `FormCompletionBar`. Cada adopcion define orden, obligatoriedad, dependencias y politica de guardado.

## Adoption

| View / flow | Variation | Status | Evidence |
| --- | --- | --- | --- |
| Catalogo de articulos | Identificacion, venta/clasificacion y capacidades opcionales | candidate | Sandbox y `views/catalogo-articulos.md` |
