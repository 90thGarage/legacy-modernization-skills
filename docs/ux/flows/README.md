# Flujos de producto

Esta carpeta es la fuente canónica de los recorridos de usuario de InfoManager 5. Cada archivo explica un objetivo de punta a punta; los contratos de `docs/product-redesign/views/` detallan las superficies que participan sin reemplazar al flujo.

## Cómo leer la documentación

- `docs/ux/product-context.md` contiene usuarios, entidades, reglas y decisiones globales.
- `docs/ux/flows/<flow-id>.md` describe entradas, pasos, salidas, dependencias y preguntas de un recorrido.
- `docs/product-redesign/views/<view-id>.md` especifica el comportamiento de una pantalla, drawer o diálogo.
- `docs/product-redesign/registry.md` permite revisar cobertura y navegar todo el producto.

## Evidencia

Cada afirmación relevante debe poder reconocerse como una de estas categorías:

- `user-confirmed`: decisión explícita del cliente en conversación.
- `legacy-confirmed`: visible en una captura o material del sistema existente.
- `prototype-confirmed`: comportamiento comprobable en el prototipo actual.
- `document-inferred`: inferencia conservadora basada en contratos y decisiones existentes.
- `code-inferred`: inferencia conservadora basada en la implementación.
- `needs-user-validation`: comportamiento o regla que todavía debe confirmar el cliente.

Una inferencia nunca debe presentarse como regla fiscal, contable, de stock, permisos o movimiento de dinero confirmada.

## Estados

Se registran dos ejes independientes:

- Documentación: `inferred`, `partially-confirmed` o `user-confirmed`.
- Entrega: `not-planned`, `planned`, `prototype-partial`, `prototype-simulated`, `prototype-built`, `reviewed` o `production-validated`.

`prototype-partial` indica que solo existe una parte del recorrido. `prototype-simulated` indica que la interaccion puede probarse, pero no ejecuta la integracion o efecto real.

Que una interacción exista en el prototipo no significa que su regla de negocio esté validada para producción.

## Ciclo de actualización

1. Clasificar el pedido como flujo nuevo, extensión, corrección o dependencia.
2. Leer contexto global, flujo objetivo y flujos relacionados.
3. Actualizar primero el recorrido, sus riesgos y preguntas abiertas.
4. Actualizar después los contratos de vista afectados.
5. Implementar o corregir el prototipo.
6. Revisar el recorrido completo y actualizar su estado de entrega.
7. Mantener `product-context.md` y `registry.md` sincronizados.

## Criterio para crear un flujo

Crear un archivo cuando existe un objetivo de usuario reconocible, con entrada, resultado y reglas propias. No crear flujos separados para cada ruta técnica, variante visual o patrón reutilizable. Por ejemplo, facturas, notas y remitos comparten superficies, mientras pagos y cobros conservan flujos separados porque mueven dinero en direcciones y contextos diferentes.
