# Pattern: ABM Compuesto

## Metadata

- Pattern ID: `abm-compuesto`
- Status: draft
- First reference view: Catalogo de articulos
- Related patterns: `abm-simple`, `list-detail-workspace`

## Purpose

Estandarizar el mantenimiento de una entidad que posee varias secciones, colecciones hijas, relaciones o configuraciones que no pueden resolverse con un formulario corto.

Usar cuando exista una entidad principal con datos basicos y capacidades dependientes, por ejemplo articulos con precios, stock, series, atributos, impuestos o proveedores.

No usar para operaciones con totales y transiciones fiscales/contables; esas corresponden a `documento-transaccional`.

## Stable Contract

### Layout

1. Listado dominante con busqueda, filtros y CTA de creacion.
2. Detalle contextual que resume identidad, estado, relaciones y alertas.
3. Alta guiada que persiste primero una identidad minima valida.
4. Secciones avanzadas habilitadas una vez que existe la entidad.
5. Colecciones hijas como tablas o secciones dentro de la edicion, no como ABM desconectados sin retorno.

### Information Hierarchy

- Nivel 1: identidad, estado y campos usados para encontrar/comparar.
- Nivel 2: configuracion frecuente y relaciones principales.
- Nivel 3: opciones avanzadas, integraciones, auditoria e historial.
- Riesgos: dependencias, stock, impuestos y permisos se muestran antes de guardar o eliminar.

### Actions

- Crear, guardar minimo y continuar configurando.
- Editar seccion sin perder el resto del progreso.
- Agregar, editar, ordenar o quitar relaciones hijas.
- Duplicar debe declarar que subestructuras copia.
- Eliminar/deshabilitar debe evaluar dependencias de la entidad y sus hijos.

### Navigation And Return

Las secciones mantienen contexto y estado. Los flujos secundarios vuelven a la entidad y actualizan la seccion de origen. No se abren submodulos tecnicos sin retorno claro.

## Required States

Incluye todos los estados de `abm-simple` y ademas:

- Entidad minima guardada con configuracion incompleta.
- Seccion bloqueada hasta guardar datos obligatorios.
- Coleccion hija vacia, cargando o con error parcial.
- Conflicto entre secciones o dependencia externa.
- Guardado parcial y reintento por seccion.

## Required Decisions Per View

Cada adopcion debe definir identidad minima, orden de secciones, dependencias, guardado atomico o parcial, colecciones hijas, reglas de duplicacion y que configuracion puede quedar incompleta.

## Allowed Variations

- Stepper para una alta secuencial real.
- Tabs para editar secciones pares una vez creada la entidad.
- Vista dedicada en lugar de drawer cuando la complejidad o la profundidad lo exige.
- Lista y grilla como representaciones alternativas de la misma coleccion.

## Not Allowed

- Mostrar todas las secciones simultaneamente sin jerarquia.
- Habilitar hijos que requieren una entidad aun no persistida.
- Convertir cada seccion en una entrada primaria del sidebar.
- Guardar silenciosamente una parte y presentar toda la entidad como completa.
- Duplicar relaciones sensibles sin confirmacion explicita.

## Responsive Contract

En mobile, el editor se vuelve una ruta o sheet de pantalla completa. La navegacion entre secciones permanece visible y el estado de guardado no depende de hover.

## Builder Contract

Extender las composiciones del ABM simple con `SectionNavigation`, `ProgressiveEntityForm`, `ChildCollection` y estados de persistencia parcial. Las secciones y relaciones provienen del contrato de la vista.

## Adoption

| View / flow | Variation | Status | Evidence |
| --- | --- | --- | --- |
| Catalogo de articulos | Lista/grilla, precios, stock, series y caracteristicas | validated candidate | `views/catalogo-articulos.md` y sandbox |
| Proveedores | Configuracion fiscal, contable y retenciones | candidate | `views/proveedores.md` |

## Open Questions

| Question | Affected adopters | Blocking? |
| --- | --- | --- |
| Que secciones pueden guardarse de forma independiente | Cada entidad compuesta | no, se define por vista |
