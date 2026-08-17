# UI Review: View Pattern Gallery

## Verdict

Status: Pending visual confirmation

Summary: El laboratorio fue redefinido para demostrar formularios de carga y reportes. La vista transaccional anterior fue retirada. El reporte adopta la barra de busqueda/filtros ya confirmada en `Documentos`, suma indicadores opcionales y exportacion del resultado visible.

## Inputs

- Referencia de filtros: captura `Documentos de compra`, 2026-07-22 20:14.
- Referencia de indicadores: captura de franja `Resultados / Total informado / Pendientes ARCA / Periodo`, 2026-07-22 20:15.
- Correcciones explicitas: estandarizar formularios y reportes; no crear otro lenguaje de filtros para reportes.
- Implementacion: `skill-flow-test/next-sandbox/src/features/infomanager/components/pattern-workspaces.tsx`.

## Required Structure

### Formulario simple

- Header informativo.
- Pocos grupos de campos.
- Validacion inline.
- Finalizacion al pie, visible y ultima en el sentido de carga.

### Formulario seccionado

- Secciones semanticas en orden de decision.
- Obligatorio antes que opcional.
- Capacidades condicionales sin abrir submodulos desconectados.
- Finalizacion comun al pie.

### Consulta y reporte

- Titulo, alcance y exportaciones arriba.
- Busqueda full-width.
- Tabs a la izquierda y filtros compactos visibles a la derecha.
- Franja opcional de hasta cuatro indicadores, sin cards.
- Tabla dominante con detalle contextual superpuesto.
- CSV, Excel y PDF usan el mismo resultado filtrado.

## Acceptance Checks

- El sidebar del laboratorio muestra solamente `Formulario simple`, `Formulario seccionado` y `Consulta y reporte`.
- No aparece `Documento transaccional` como template del laboratorio.
- Los filtros de reporte usan los mismos componentes, orden y densidad que `Documentos`.
- Busqueda, filtros e indicadores no desplazan innecesariamente la tabla.
- La franja de indicadores se entiende como opcional, no como dashboard obligatorio.
- CSV y Excel descargan archivos; PDF abre una vista imprimible del resultado actual.
- Cambiar filtros actualiza tabla, cantidad, total, pendientes y exportaciones de forma coherente.
- El detalle no reduce permanentemente el ancho de la tabla ni pierde filtros.
- Los formularios no ubican la unica accion de finalizacion en el header.

## Remaining Review

La comprobacion visual final queda para la revision en `http://localhost:3100`, especialmente en 1280 x 720 y 1920 x 1080.
