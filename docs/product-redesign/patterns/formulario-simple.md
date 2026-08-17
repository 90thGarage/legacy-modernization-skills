# Pattern: Formulario Simple

## Metadata

- Pattern ID: `formulario-simple`
- Status: draft
- First reference view: Crear deposito
- Related patterns: `formulario-seccionado`, `list-detail-workspace`

## Purpose

Estandarizar formularios breves para crear o editar una entidad con pocos campos y una unica decision de finalizacion.

El patron describe solamente la superficie de carga. El listado, la consulta y la eliminacion pertenecen al workspace que abre el formulario.

## Stable Contract

### Layout

1. Header informativo con tarea, entidad y estado de guardado; no contiene la finalizacion.
2. Uno o pocos bloques de campos agrupados por significado, usando el ancho disponible sin estirar inputs innecesariamente.
3. Validacion junto al campo y resumen solo cuando existen errores distribuidos.
4. Barra inferior, ultima en orden visual y DOM, con cambios pendientes, cancelar y accion especifica: `Crear deposito`, `Guardar cliente`, etc.

### Components

- `Field` para label, obligatoriedad, ayuda y error.
- `Input`, `Select`, `Checkbox`, `Textarea` y controles del design system.
- `FormSection` solamente cuando existe una agrupacion semantica real.
- `FormCompletionBar` compartida para estado y finalizacion.

## Required States

- Nuevo/borrador.
- Validacion por campo.
- Guardando.
- Guardado.
- Error recuperable sin perder datos.
- Cambios sin guardar al cancelar o cerrar.
- Solo lectura por estado o permiso.

## Allowed Variations

- Drawer, dialog o pagina segun el contexto y el espacio necesario.
- Una o dos columnas en anchos acotados; hasta cuatro para campos cortos en desktop.
- Accion secundaria contextual antes de guardar cuando no interrumpe la secuencia.

## Not Allowed

- Usar un stepper para una carga corta.
- Colocar la unica accion de guardado en el header.
- Distribuir campos para rellenar huecos sin relacion semantica.
- Usar `Guardar` si la accion real puede nombrarse como `Crear deposito` o `Actualizar cliente`.

## Builder Contract

La adopcion aporta campos, validaciones, permisos, accion final y destino de retorno. La estructura, densidad, errores y barra de finalizacion se reutilizan.

## Adoption

| View / flow | Variation | Status | Evidence |
| --- | --- | --- | --- |
| Depositos | Dos grupos: identidad y asignacion | candidate | Sandbox y `views/depositos.md` |

