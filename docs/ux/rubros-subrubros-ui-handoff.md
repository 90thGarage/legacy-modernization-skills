# Rubros Y Subrubros UI Handoff

## Build Goal

Construir la administracion jerarquica de rubros y subrubros para clasificar articulos, reemplazando el ABM legacy de tabla superior + formulario inferior por un workspace de listado dominante y edicion contextual.

La misma implementacion debe permitir crear un rubro o subrubro desde el formulario de un articulo sin perder lo cargado y volver con la nueva clasificacion seleccionada.

## Product Context References

- Product context: `./product-context.md`
- Related catalog handoff: `./catalogo-productos-ui-handoff.md`
- Product view contract: `../product-redesign/views/catalogo-articulos.md`
- Reusable patterns:
  - `../product-redesign/patterns/abm-jerarquico.md`
  - `../product-redesign/patterns/list-detail-workspace.md`
  - `../product-redesign/patterns/formulario-seccionado.md`

## Source Captures

| Capture | Surface | Evidence extracted |
| --- | --- | --- |
| `Captura de pantalla 2026-07-22 a la(s) 9.11.01 p. m..png` | ABM Rubros legacy | Lista de rubros; codigo, descripcion y cantidad de subrubros; datos del rubro y tabla de subrubros en una division persistente. |
| `Captura de pantalla 2026-07-22 a la(s) 9.11.56 p. m..png` | Rubro seleccionado | Rubro CERVEZA con 25 subrubros; subrubros actuan como clasificaciones semejantes a marcas. |
| `Captura de pantalla 2026-07-22 a la(s) 9.12.25 p. m..png` | Alta de rubro | Datos del rubro, codigo de compatibilidad, coleccion vacia de subrubros y accion Agregar. |

Source limitation: las capturas muestran estructura y campos, pero no confirman reglas de compatibilidad, permisos, reasignacion ni borrado fisico. Esas reglas permanecen configurables y no deben inventarse en la UI.

## Product UX Intent

- Preservar: rubro, subrubro, codigos, codigo de compatibilidad, conteo de subrubros y relacion con articulos.
- Mejorar: separar buscar/comparar de crear/editar; evitar modos globales y formularios persistentes; mantener el contexto del articulo durante una creacion rapida.
- Lenguaje: conservar `Rubro` y `Subrubro`. Mostrar ayuda `Marca o clasificacion dentro del rubro` mientras no se confirme que todos los subrubros son marcas.
- Navegacion: `Catalogo > Rubros` es el workspace administrativo para usuarios autorizados y tambien puede abrirse desde Articulos y sus selectores. Subrubros no aparece como destino independiente.

## Builder Delivery Scope

Implementar en el sandbox de InfoManager:

- Tipos `Category`, `Subcategory` y clasificacion por IDs en `src/features/infomanager/types.ts`.
- Datos simulados de rubros, subrubros y conteos en `mock-data.ts` o modulo equivalente.
- `CategoriesWorkspace` en un componente dedicado; no agregarlo dentro del archivo grande de Articulos.
- Entrada `Catalogo > Rubros` en el app shell, condicionable por permiso.
- Tabla de rubros, detail drawer y create/edit drawer jerarquico.
- Comboboxes dependientes Rubro/Subrubro dentro del alta y edicion de Articulo.
- Creacion contextual desde ambos comboboxes, reutilizando el mismo formulario de Rubros y preservando el borrador del Articulo.
- Confirmaciones de baja/deshabilitacion y estado bloqueado por asociaciones.

No modificar reportes, documentos, POS ni otras areas fuera de la integracion necesaria con Articulos y Catalogo.

## Component Strategy

- Reutilizar `Button`, `Badge`, `Input`, `Checkbox`, `Select`/combobox, `Sheet`, `Table`, `AlertDialog`, `Skeleton`, `Tooltip` y `Textarea` existentes.
- Reutilizar la barra de busqueda/filtro y la densidad de las tablas actuales de `Documentos` y Articulos.
- Extraer composiciones locales con responsabilidad clara: `CategoryTable`, `CategoryDetail`, `CategoryForm`, `SubcategoryEditor` y `ClassificationFields`.
- `ClassificationFields` recibe opciones, IDs seleccionados, reglas de obligatoriedad, permisos de creacion y callbacks; no debe depender directamente de datos mock.
- No crear botones, cards, badges o inputs alternativos al design system.

## Information Architecture

### Workspace De Rubros

Header:

- Titulo `Rubros`.
- Texto secundario con cantidad visible y total.
- CTA principal `Crear rubro`.

Search/filter bar:

- Busqueda full-width por codigo o nombre.
- Filtro compacto `Estado: todos / habilitados / deshabilitados`.
- Sin tabs salvo que futuras evidencias definan subconjuntos pares utiles.
- Busqueda, filtro y tabla comparten fondo, gutter y patron de `search-filter-bar`.

Primary table:

| Column | Requirement | Notes |
| --- | --- | --- |
| Codigo | required | Mono, ordenable. |
| Rubro | required | Nombre de negocio. |
| Subrubros | derived | Cantidad de hijos. |
| Articulos | derived | Cantidad de articulos asociados directa o indirectamente. |
| Estado | required | Habilitado/deshabilitado. |
| Acciones | required | Ver/editar y deshabilitar o eliminar segun impacto y permiso. Sticky a la derecha. |

La tabla ocupa todo el ancho. Click o Enter abre un `Sheet`/drawer derecho superpuesto. No se reserva una columna fija ni un formulario inferior.

### Detail Drawer

- Titulo y codigo del rubro.
- Estado.
- Cantidad de subrubros.
- Cantidad de articulos asociados.
- Lista resumida/buscable de subrubros con cantidad de articulos por hijo.
- Configuracion tecnica, como `Codigo de compatibilidad`, en disclosure secundario.
- Acciones `Editar`, `Deshabilitar` y `Eliminar` solamente cuando corresponde.

### Create/Edit Drawer

Ancho desktop: 60-72vw, minimo util 760px y maximo cercano a 1180px. En mobile/tablet se convierte en pantalla completa.

Section 1 — Datos del rubro:

- Codigo.
- Nombre.
- Estado en edicion; un alta comienza habilitada por defecto.
- Codigo de compatibilidad en `Configuracion tecnica`, no como campo protagonista.

Section 2 — Subrubros:

- Titulo `Subrubros` y contador.
- Ayuda `Marca o clasificacion dentro del rubro`.
- Busqueda interna cuando hay mas de ocho filas.
- CTA `Agregar subrubro`.
- Tabla editable: codigo, nombre, codigo de compatibilidad, articulos asociados, estado y acciones.
- Una fila nueva recibe foco en `Nombre`.
- El usuario puede agregar, editar y quitar varias filas antes de finalizar el rubro.
- Empty state compacto: `Todavia no agregaste subrubros` + CTA; no usar un panel vacio de gran altura.

Footer sticky:

- Estado `Cambios sin guardar`, validacion o guardado.
- `Cancelar`.
- `Crear rubro` en alta.
- `Guardar cambios` en edicion.

No colocar la finalizacion en el header.

## Article Form Integration

En la seccion `Clasificacion` del formulario de articulos:

1. `Rubro` usa combobox buscable y es obligatorio.
2. `Subrubro` usa combobox dependiente y muestra solo hijos del rubro seleccionado.
3. Hasta elegir rubro, Subrubro esta deshabilitado con `Primero selecciona un rubro`.
4. Si el rubro no tiene hijos, mostrar `Este rubro no tiene subrubros`.
5. Subrubro es opcional por defecto; cada adopcion puede requerirlo mediante `category.requiresSubcategory`.
6. Cambiar rubro limpia un subrubro incompatible y muestra `El subrubro se limpio porque no pertenece al nuevo rubro`.
7. El valor guardado es el ID de rubro/subrubro, no el label visible.

Contextual creation:

- El combobox de Rubro ofrece `Crear rubro` si el usuario tiene permiso.
- El combobox de Subrubro ofrece `Crear subrubro en <Rubro>` si existe padre seleccionado y el usuario tiene permiso.
- La creacion abre el mismo drawer en modo contextual; no navega a otro modulo.
- El borrador completo del articulo permanece intacto.
- Al guardar, el drawer se cierra, refresca opciones y devuelve el nuevo rubro/subrubro seleccionado.
- Cancelar vuelve al articulo sin modificar su clasificacion.
- Posibles duplicados se muestran antes de crear y ofrecen seleccionar el existente.

## Workflow Contract

| Trigger | Result | Surface | Return/context |
| --- | --- | --- | --- |
| Abrir Catalogo > Rubros | Muestra lista de padres | Workspace administrativo | Entrada directa para mantenimiento completo. |
| Abrir Administrar rubros desde Articulos | Muestra la misma lista | Workspace de Rubros | Conserva filtros de Articulos y permite volver. |
| Crear rubro | Abre alta jerarquica | Drawer ancho | Vuelve a lista o selector origen. |
| Click/Enter en rubro | Abre detalle | Drawer superpuesto | Tabla y filtros permanecen intactos. |
| Editar rubro | Abre editor con hijos | Mismo drawer ancho | No crea otra ruta visual. |
| Agregar subrubro | Inserta fila editable | Seccion Subrubros | Foco en nombre. |
| Quitar hijo nuevo | Lo elimina del borrador | Inline | Sin confirmacion si nunca fue persistido. |
| Quitar hijo persistido sin usos | Pide confirmacion | AlertDialog | Explica efecto. |
| Quitar padre/hijo con usos | Bloquea eliminacion | Inline + dialog informativo | Ofrece deshabilitar o iniciar reasignacion. |
| Crear desde Articulo | Abre editor contextual | Drawer sobre el formulario | Retorna valor creado y preserva borrador. |
| Cambiar Rubro del articulo | Recalcula opciones hijas | Formulario articulo | Limpia hijo incompatible con explicacion. |

## Data Shape

### Category

```ts
type Category = {
  id: string
  code: string
  name: string
  compatibilityCode?: string
  active: boolean
  requiresSubcategory: boolean
  subcategories: Subcategory[]
  directArticleCount: number
  totalArticleCount: number
  audit: {
    createdBy: string
    createdAt: string
    updatedBy?: string
    updatedAt?: string
  }
}
```

### Subcategory

```ts
type Subcategory = {
  id: string
  categoryId: string
  code: string
  name: string
  compatibilityCode?: string
  active: boolean
  articleCount: number
}
```

### Product Classification

```ts
type ProductClassification = {
  categoryId: string
  subcategoryId?: string
}
```

Data constraints:

- `Category.code` y `Category.name` deben validar duplicados de acuerdo con reglas del backend.
- `Subcategory.code` y `Subcategory.name` validan duplicados dentro de `categoryId`, salvo contrato distinto del dominio.
- `subcategoryId`, cuando existe, debe pertenecer a `categoryId`.
- Counts son derivados/display-only.
- Las mutaciones deben aceptar padre + hijos en un unico payload de intencion o exponer rollback/recuperacion si el backend persiste por pasos.

Sandbox migration:

- El tipo `Product` actual conserva `category` y `subcategory` como strings. Builder debe introducir `categoryId` y `subcategoryId` como fuente de verdad.
- Durante la migracion de datos simulados, mapear los labels existentes a IDs estables y derivar los textos visibles desde las colecciones de clasificacion.
- No mantener dos fuentes editables de verdad. Los labels pueden existir solamente como valores derivados o snapshots de lectura.

## Field Traceability

| Legacy item | Modern label | Decision | Location | Data key | Requirement |
| --- | --- | --- | --- | --- | --- |
| Buscar | Buscar por codigo o rubro | Keep visible | Workspace | `query` | UI state |
| Nuevo | Crear rubro | Keep visible | Header | action | permission-gated |
| Editar | Editar | Keep contextual | Row/detail | action | permission-gated |
| Grabar | Crear rubro / Guardar cambios | Rename and move | Footer | action | required |
| Eliminar | Eliminar / Deshabilitar | Contextualize | Row/detail/dialog | action | impact-gated |
| Cancelar | Cancelar | Keep | Footer | action | required |
| Codigo rubro | Codigo | Keep | Datos del rubro | `category.code` | required |
| Descripcion rubro | Nombre | Rename | Datos del rubro | `category.name` | required |
| Cod. compatibilidad rubro | Codigo de compatibilidad | Secondary | Configuracion tecnica | `category.compatibilityCode` | optional/unknown |
| Cantidad Subrubros | Subrubros | Keep derived | Table/detail | `category.subcategories.length` | derived |
| Agregar | Agregar subrubro | Keep explicit | Child section | action | permission-gated |
| Codigo subrubro | Codigo | Keep | Child row | `subcategory.code` | required |
| Descripcion subrubro | Nombre | Rename | Child row | `subcategory.name` | required |
| Cod. compat. subrubro | Codigo de compatibilidad | Secondary | Child row/advanced | `subcategory.compatibilityCode` | optional/unknown |
| Seleccion fila rubro | Ver detalle | Make explicit | Table row | `selectedCategoryId` | UI state |

## Required States

- Loading skeleton preserving table structure.
- Empty initial with `Crear rubro`.
- No search results with filter reset.
- Detail selected.
- Creating new parent with zero or multiple new children.
- Editing parent and children.
- Duplicate category/subcategory suggestion.
- Validation errors inline and summary only when distributed.
- Saving without losing inputs.
- Save failure with retry.
- Unsaved changes confirmation.
- Category/subcategory disabled but historical use visible.
- Delete allowed, delete blocked by article associations, and reassignment entry point.
- Permission denied with reason.
- Contextual creation returning to Article.

## Do Not Include

- Label `ABM Rubros` in user-facing UI; use `Rubros`.
- Persistent split with list on top and edit form below.
- Global mode toolbar `Nuevo / Editar / Grabar / Eliminar / Cancelar`.
- Subrubros as independent sidebar item or independent top-level ABM.
- Giant empty child table when no subrubros exist.
- Compatibility codes in the primary hierarchy without confirmed operational use.
- Delete enabled for records with associated articles.
- Obligar a navegar al workspace completo cuando el usuario solo necesita crear una clasificacion desde un Articulo.

## Acceptance Criteria

- Rubros table uses the full available width and shows code, name, child count, article count, state and actions.
- No edit form is permanently visible under or beside the table.
- Create/edit uses a wide drawer or full-screen mobile surface with Datos del rubro, Subrubros and sticky footer.
- Multiple subrubros can be prepared before the first final save of a new rubro.
- Empty child state is compact and actionable.
- Selecting Rubro in Article filters Subrubro options; changing parent clears an incompatible child with visible explanation.
- Contextual creation preserves every unsaved Article field and returns the created value selected.
- Duplicate names are detected before creation.
- Deleting an in-use parent or child is blocked and offers deshabilitar/reasignar according to permissions.
- Codigo de compatibilidad remains available but secondary until its business purpose is confirmed.
- Desktop, tablet and mobile preserve the same hierarchy and finalization order.

## Open Assumptions For Integration

- Confirmar si `Subrubro` siempre significa marca. Hasta entonces no renombrar la entidad globalmente.
- Confirmar semantica y obligatoriedad de codigos de compatibilidad.
- Confirmar si borrado fisico existe o si todos los registros con historia solo se deshabilitan.
- Confirmar quien puede crear clasificaciones desde Articulos y quien puede reasignar usos.
- Confirmar si Rubro es obligatorio para todos los articulos y que rubros requieren Subrubro.
