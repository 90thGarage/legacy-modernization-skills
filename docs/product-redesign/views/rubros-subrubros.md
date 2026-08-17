# View Contract: Rubros Y Subrubros

## Purpose

Administrar la clasificacion jerarquica de articulos mediante rubros y subrubros, preservando la relacion padre-hijo y permitiendo alta contextual desde el formulario de Articulos.

## Product Placement

- Area: Catalogo.
- Entrada administrativa: `Catalogo > Rubros`, visible para perfiles con permiso de mantenimiento.
- Entrada relacionada: accion `Administrar rubros` desde `Catalogo > Articulos`.
- Entrada contextual: comboboxes Rubro/Subrubro del alta o edicion de articulo.
- No crear un destino independiente para Subrubros.
- `Catalogo > Rubros` y la entrada contextual reutilizan el mismo workspace y estado; no son implementaciones distintas.

## Pattern Composition

- `abm-jerarquico` para padre/hijos.
- `list-detail-workspace` para busqueda, tabla y drawer.
- `formulario-seccionado` para datos del rubro + coleccion de subrubros.
- `search-filter-bar` para listado.

## Builder Handoff

El contrato completo de implementacion, estados, datos, trazabilidad y criterios de aceptacion vive en:

`../../ux/rubros-subrubros-ui-handoff.md`

## Adoption Status

- Status: draft.
- Evidence: tres capturas legacy de ABM Rubros y definicion del usuario del 2026-07-22.
- Blocking domain questions: significado de Subrubro, codigos de compatibilidad, permisos y politica de baja.
