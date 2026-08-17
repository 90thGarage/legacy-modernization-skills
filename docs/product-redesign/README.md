# Product Redesign

Esta carpeta documenta como se materializan los flujos del producto en arquitectura, patrones y contratos de vista. No reemplaza el contexto ni los recorridos canonicos de `docs/ux`.

El objetivo es tener una fuente de verdad incremental para tomar decisiones de UX, alinear pantallas repetidas y dejar handoffs claros para construir despues con `builder`.

## Como usar esta carpeta

- `registry.md`: punto de entrada para cliente y equipo; indice de areas, flujos, vistas, cobertura y estado.
- `product-architecture.md`: modelo general del producto, modulos, entidades y reglas transversales.
- `app-shell.md`: navegacion global, sidebar, pestanas, toolbar y reglas de convivencia entre vistas.
- `typography-profiles.md`: escala proporcional de la interfaz por usuario.
- `interface-radius-profiles.md`: perfiles globales de esquinas por usuario.
- `patterns/`: patrones reutilizables para no redisenar cada vista o navegacion desde cero.
- `pattern-template.md`: contrato base para crear y madurar nuevos patrones.
- `views/`: contrato UX de cada vista o modulo.
- `view-template.md`: plantilla base para sumar nuevas vistas.

## Relacion con `docs/ux`

`docs/ux/product-context.md` conserva la verdad global y `docs/ux/flows/` los recorridos canonicos. Tambien contiene capturas, briefs, handoffs y evidencia historica.

`docs/product-redesign` funciona como capa de arquitectura y detalle:

- consolida decisiones repetibles;
- explica como deben convivir las vistas;
- define patrones transversales;
- baja cada vista a un contrato construible;
- registra preguntas abiertas antes de implementar.

Si un contrato de vista contradice el contexto o el flujo, la contradiccion debe registrarse; no se resuelve silenciosamente desde la vista.

## Regla de actualizacion

Cada vez que acordemos una decision de producto o UX, actualizar en este orden:

1. `docs/ux/product-context.md` si cambia una regla global, entidad, rol o decision transversal.
2. `docs/ux/flows/<flow-id>.md` si cambia el recorrido, sus entradas, salidas, dependencias o riesgos.
3. `registry.md` si cambia cobertura, estado o aparece un nuevo flujo, vista o patron.
4. `product-architecture.md` o `app-shell.md` si cambia la arquitectura o navegacion global.
5. El archivo correspondiente en `patterns/` si la decision se vuelve reutilizable.
6. El archivo correspondiente en `views/` si cambia una superficie concreta.
7. Las notas de implementacion y el estado de entrega despues de construir o revisar el prototipo.

## Principio de redisenio

El redisenio no debe ser cosmetico. Debe separar trabajos del usuario que hoy estan mezclados:

- listar, buscar y comparar;
- consultar contexto de un registro;
- editar campos frecuentes;
- configurar detalles avanzados;
- ejecutar acciones riesgosas;
- saltar a flujos relacionados sin perder el origen.

Cada pantalla debe declarar cual es su trabajo principal y que informacion queda secundaria.

## Madurez de patrones

Los patrones se crean como contratos iniciales y se refinan con vistas reales:

1. `candidate`: hipotesis nacida de un caso.
2. `draft`: contrato util para construir ejemplos y nuevas vistas.
3. `validated`: probado en mas de una vista o flujo.
4. `approved`: comportamiento estable que las nuevas vistas deben reutilizar.

Una vista puede apartarse de un patron, pero debe registrar la variacion y su motivo.
