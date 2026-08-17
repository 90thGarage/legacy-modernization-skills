# 90thSkills

90thSkills ayuda a entender, documentar y modernizar productos legacy con Codex.

La entrada recomendada es el **Asistente de Producto**. Se conversa con lenguaje natural y coordina tres skills especialistas: `planner`, `builder` y `reviewer`.

El repositorio también incluye documentación de producto y un prototipo navegable de InfoManager para probar los flujos sin tocar una aplicación real.

## Para qué sirve

- Consultar cómo funciona hoy un producto o flujo.
- Explorar mejoras antes de documentarlas o construirlas.
- Mantener sincronizados el contexto global, los flujos y su registro.
- Convertir una decisión de producto en un handoff UX implementable.
- Construir y revisar vistas React dentro de un prototipo.

## Inicio rápido

Con el plugin instalado, elegí **Asistente de Producto** desde el selector o escribí `/producto` seguido de un pedido normal.

```txt
/producto ¿Cómo funcionan hoy los cobros?
/producto Tengo una idea para permitir pagos parciales
/producto Dejá documentada la alternativa que elegimos
/producto Llevá esta mejora al prototipo
```

No hace falta elegir modos, completar parámetros ni conocer las otras skills. El asistente interpreta la intención a partir de la conversación.

Si todavía no instalaste el plugin, consultá [Instalación](#instalación).

## Cómo responde el Asistente de Producto

El asistente usa cuatro comportamientos internos. El usuario no necesita conocerlos ni seleccionarlos.

| Lo que pide el usuario | Qué hace el asistente | Qué puede modificar |
| --- | --- | --- |
| “¿Cómo funciona…?” | Lee la documentación y explica el comportamiento actual. | Nada. |
| “Tengo una idea…” | Analiza alternativas, impacto y dependencias. | Nada. |
| “Documentalo” | Registra la decisión y sincroniza los documentos relacionados. | Solo documentación. |
| “Llevalo al prototipo” | Documenta, planifica, construye y revisa la mejora. | Documentación y código del prototipo. |

Una frase como “me gusta esa opción” no autoriza cambios. El asistente ofrece documentarla, llevarla al prototipo o seguir explorando.

Si el pedido es ambiguo, permanece en solo lectura. Si el usuario ya pidió documentar o implementar, no solicita una confirmación redundante.

El comando `/product-modernizer` se conserva como alias compatible. `/producto` es la entrada recomendada para el uso cotidiano.

## Cómo consume la documentación

El asistente empieza por las fuentes que permiten ubicar el pedido dentro del producto:

```txt
docs/ux/flows/README.md
docs/ux/product-context.md
docs/product-redesign/registry.md
```

Después abre solamente los flujos relacionados en `docs/ux/flows/`. Los briefs, handoffs, reviews, capturas y notas de implementación se cargan cuando son relevantes.

El código se inspecciona para comprobar qué hace realmente el prototipo o cuando el usuario pide una implementación.

En sus respuestas y documentos distingue:

- comportamiento documentado;
- comportamiento observado en el prototipo;
- inferencias;
- preguntas abiertas.

Si dos fuentes se contradicen, informa la diferencia. No modifica la documentación canónica para copiar el comportamiento del prototipo sin una decisión del usuario.

### Qué actualiza al documentar un flujo

Una decisión de producto debe quedar sincronizada en:

```txt
docs/ux/product-context.md
docs/ux/flows/<flow-id>.md
docs/product-redesign/registry.md
```

Los artefactos propios de una vista se guardan planos bajo `docs/ux/`:

```txt
docs/ux/<view-name>-ux-brief.md
docs/ux/<view-name>-ui-handoff.md
docs/ux/<view-name>-ui-review.md
docs/ux/<view-name>-implementation-notes.md
```

Solo los documentos de flujo se guardan en `docs/ux/flows/`.

## Cómo convive con las skills especialistas

El Asistente de Producto no reemplaza a `planner`, `builder` ni `reviewer`. Es la puerta de entrada que decide qué parte del proceso necesita el usuario.

Cuando el pedido es solo consultar, idear o documentar, la cadena de implementación no se ejecuta.

Cuando el usuario pide llevar una mejora al prototipo, el recorrido es:

```txt
Asistente de Producto
        ↓
     planner
        ↓
     builder
        ↓
     reviewer
        ↓
     builder correctivo, solo si hay problemas Critical o High
```

- `planner` transforma la decisión de producto en un brief UX y un handoff construible.
- `builder` implementa React desde ese contrato.
- `reviewer` compara el resultado contra el producto, el flujo, el handoff y el sistema visual.
- `builder` vuelve a intervenir únicamente cuando la revisión requiere correcciones importantes.

No son procesos separados ni agentes independientes. Codex coordina las instrucciones de cada skill dentro de la misma tarea.

Los usuarios expertos pueden entrar directamente a cualquier etapa mediante `/planner`, `/builder` o `/reviewer`.

## Uso directo de las skills especialistas

### Planner

Usá `/planner` cuando ya sabés qué pantalla o flujo querés diseñar y necesitás producir el contrato UX.

```txt
/planner Modernizá la facturación de mostrador usando estas capturas legacy
```

`planner` lee el contexto existente, pregunta solo por decisiones bloqueantes y genera:

```txt
docs/ux/<view-name>-ux-brief.md
docs/ux/<view-name>-ui-handoff.md
```

No implementa código.

### Builder

Usá `/builder` cuando ya existe un handoff aprobado y querés construir o corregir una vista React.

```txt
/builder docs/ux/<view-name>-ui-handoff.md -> skill-flow-test/next-sandbox/src/features/<view-name>/
```

Si recibe un review, lo trata como contrato de corrección. Deja sus decisiones y verificaciones en `docs/ux/<view-name>-implementation-notes.md`.

`builder` sigue disponible como skill independiente. El Asistente de Producto no absorbe ni duplica su responsabilidad.

### Reviewer

Usá `/reviewer` cuando ya existe una UI para comparar contra el producto, el flujo, el handoff, las capturas y el feedback disponible.

```txt
/reviewer http://localhost:3000/<view-name> + docs/ux/<view-name>-ui-handoff.md
```

`reviewer` no edita código. Produce `docs/ux/<view-name>-ui-review.md` para que `builder` aplique las correcciones necesarias.

## Instalación

### Codex

Desde la raíz del repositorio:

```bash
./scripts/install-local-plugin.sh
```

El script registra el marketplace local, instala `90thskills` y habilita los comandos del plugin.

Después de instalar, reiniciá Codex o abrí una tarea nueva para actualizar la lista de skills y comandos.

### Claude Code

Claude Code puede usar las mismas skills, pero espera encontrarlas bajo `.claude/skills/`:

```bash
mkdir -p .claude/skills
cp -R skills/product-modernizer .claude/skills/product-modernizer
cp -R skills/shared .claude/skills/shared
cp -R skills/planner .claude/skills/planner
cp -R skills/builder .claude/skills/builder
cp -R skills/reviewer .claude/skills/reviewer
```

Allí se invocan mediante `/product-modernizer`, `/planner`, `/builder` y `/reviewer`. El alias `/producto` pertenece al plugin de Codex.

Para disponer de las skills en todos los proyectos de Claude Code, copialas a `~/.claude/skills/` y reiniciá la aplicación.

## Playground del prototipo

El prototipo está en `skill-flow-test/next-sandbox/` e incluye el shell, el selector de vistas y los workspaces actuales de InfoManager.

Para levantarlo:

```bash
cd skill-flow-test/next-sandbox
npm install
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

Las nuevas features deben vivir en `src/features/<view-name>/`. Las rutas de prueba pertenecen a `src/app/<view-name>/page.tsx` cuando necesitan una URL propia.

Después de construir o corregir una vista, verificá el proyecto:

```bash
npm run lint
npm run build
```

Antes de usar `builder` en un producto real, revisá:

```txt
skills/builder/references/design.md
skills/builder/references/component-library.md
skills/builder/references/product-domain.md
```

## Estructura del repositorio

```txt
.codex-plugin/
  plugin.json

commands/
  producto.md
  product-modernizer.md
  planner.md
  builder.md
  reviewer.md

docs/
  product-redesign/
  ux/
    product-context.md
    flows/

skills/
  product-modernizer/
  shared/
  planner/
  builder/
  reviewer/

skill-flow-test/
  next-sandbox/

scripts/
  install-local-plugin.sh
```

## Referencia de comandos

| Comando | Uso recomendado |
| --- | --- |
| `/producto` | Conversar, consultar, idear, documentar o modernizar un flujo. |
| `/product-modernizer` | Alias experto y compatible del Asistente de Producto. |
| `/planner` | Crear o actualizar un brief UX y un handoff. |
| `/builder` | Implementar un handoff o aplicar un review. |
| `/reviewer` | Revisar una UI y producir un plan de correcciones. |

También podés elegir **Asistente de Producto** desde el selector o invocar `$product-modernizer`, `$planner`, `$builder` y `$reviewer` si la interfaz muestra skills pero no comandos.
