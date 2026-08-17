# Rubros y Subrubros — Implementation Notes

## Resultado

Se implemento el handoff `rubros-subrubros-ui-handoff.md` en el sandbox de InfoManager y se integro la clasificacion jerarquica con el alta/edicion de articulos.

## Archivos principales

- `skill-flow-test/next-sandbox/src/features/infomanager/components/categories-workspace.tsx`
- `skill-flow-test/next-sandbox/src/features/infomanager/components/entity-workspaces.tsx`
- `skill-flow-test/next-sandbox/src/features/infomanager/mock-data.ts`
- `skill-flow-test/next-sandbox/src/features/infomanager/types.ts`
- `skill-flow-test/next-sandbox/src/features/infomanager/components/app-shell.tsx`
- `skill-flow-test/next-sandbox/src/features/infomanager/index.tsx`

## Decisiones implementadas

- `Catalogo > Rubros` es un workspace administrativo propio; Subrubros no es un destino independiente.
- El listado de rubros ocupa todo el ancho y muestra codigo, nombre, cantidad de hijos, cantidad de articulos, estado y acciones.
- Ver, crear y editar usan drawers superpuestos; no existe formulario persistente debajo de la tabla.
- El editor guarda rubro y varios subrubros como una sola intencion, con finalizacion sticky al pie.
- Codigo de compatibilidad se mantiene en configuracion tecnica secundaria.
- Los subrubros muestran su uso y no pueden quitarse inline cuando tienen articulos asociados.
- Eliminar un rubro en uso queda bloqueado y ofrece deshabilitarlo conservando el historial.
- `Product.categoryId` y `Product.subcategoryId` son la fuente de verdad. Los labels visibles se derivan de `Category` y `Subcategory`.
- El formulario de articulo usa selectores buscables dependientes: Subrubro se bloquea hasta elegir Rubro y solo lista hijos compatibles.
- La creacion contextual reutiliza el editor jerarquico, conserva el borrador completo del articulo y vuelve con el nuevo valor seleccionado.
- Los duplicados de rubro por codigo/nombre y de subrubro por nombre dentro del padre bloquean el guardado con explicacion visible.

## Datos simulados

Se incorporaron rubros y marcas representativas para Cerveza, Bebidas espirituosas, Jugos, Equipamiento, Servicios, Libreria y Embalaje. Los productos existentes se migraron a IDs estables.

## Supuestos conservadores

- Rubro es obligatorio en el alta de articulo.
- Subrubro es opcional y no expone una regla configurable de obligatoriedad.
- Los permisos finos no estan modelados; el prototipo expone las acciones administrativas al usuario demo.
- La reasignacion masiva se comunica como paso futuro y no se simula.
- La persistencia es local al estado del prototipo; no se conecta a backend.
- Se conserva el lenguaje `Subrubro` y la ayuda `Marca o clasificacion dentro del rubro`; no se renombra globalmente a Marca.

## Verificacion

- `npm run lint`: correcto.
- `npm run build`: correcto.
- Navegacion y tabla de Rubros: verificado en `http://localhost:3100/` a 1280x720.
- Alta de rubro con subrubro inline: verificada.
- Seleccion dependiente Rubro/Subrubro en Articulos: verificada.
- Creacion contextual de subrubro con retorno seleccionado y borrador preservado: verificada.
- Consola del navegador: sin errores.

## Pendientes de dominio

- Confirmar si todos los Subrubros representan marcas.
- Confirmar obligatoriedad real de Rubro/Subrubro por tipo de articulo.
- Confirmar semantica de codigos de compatibilidad.
- Definir permisos para alta, edicion, deshabilitacion, eliminacion y reasignacion.
- Definir si existe borrado fisico en produccion o solo deshabilitacion.
