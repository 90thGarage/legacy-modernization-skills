# Pattern Gallery Implementation Notes

## Current Scope

El laboratorio navegable demuestra tres templates internas:

- Formulario simple.
- Formulario seccionado.
- Consulta y reporte.

`Documento transaccional` fue retirado del laboratorio porque representaba una implementacion particular y no el objetivo de estandarizacion confirmado. Su contrato historico permanece documentado para los flujos que realmente lo necesiten.

## Forms

- El fondo de pagina usa `background`; la franja informativa, las secciones y la barra de finalizacion usan `surface/card`. No se introducen mezclas de color ni opacidad fuera de los tokens del design system.
- Ambos formularios separan identidad/estado de la finalizacion.
- La accion primaria aparece al pie del sentido de carga y permanece visible mediante una barra sticky que tambien informa cambios pendientes.
- El formulario simple evita stepper y usa pocos grupos semanticos.
- El formulario seccionado demuestra identidad, datos comerciales/clasificacion y capacidades opcionales.
- Los ejemplos usan Deposito y Articulo solo para dar forma real a la template; los campos y reglas pertenecen a cada adopcion.

## Reports

- La busqueda ocupa una fila full-width.
- La segunda fila replica el patron confirmado de `Documentos`: `Tabs` a la izquierda y filtros compactos siempre visibles a la derecha.
- Los filtros usan `Tabs`, `Select` y `Checkbox` del mismo sistema; no usan cards, labels superiores, drawer ni popover.
- La franja de indicadores es una capacidad opcional del reporte. La demo muestra cuatro: resultados, total informado, pendientes ARCA y periodo.
- La tabla conserva el ancho dominante y abre detalle en un `Sheet` superpuesto.
- CSV y Excel descargan el resultado filtrado actual. PDF abre una vista imprimible del mismo resultado para guardar como archivo.

## Components Used

- shadcn/ui: `Badge`, `Button`, `Card`, `Checkbox`, `Input`, `Select`, `Sheet`, `Table`, `Tabs` y `Textarea`.
- Composiciones locales: `Field`, `Metric`, `FormCompletionBar` y `PatternFrame`.

## Remaining Gaps

- Cada reporte real debe declarar columnas, agrupaciones, metricas, volumen, permisos y formatos habilitados.
- La descarga Excel de la demo usa HTML compatible con Excel (`.xls`); la integracion productiva puede reemplazarla por el generador oficial de archivos.
- PDF usa la superficie de impresion del navegador para no introducir una dependencia ficticia en el sandbox.
- `Suisse Intl` y `Neue Montreal` siguen sin assets cargados en el sandbox.

## Verification

- `npm run lint`: passed.
- `npm run build`: passed with Next.js 16.2.9.
- Visual verification pending after this structural pass; the front remains available at `http://localhost:3100` for review.
