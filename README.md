# 90thSkills

Playground local para entender, documentar y modernizar productos legacy con Codex.

El repo trae un asistente de producto y tres skills especialistas:

- `product-modernizer`: se presenta como **Asistente de Producto**; entiende el producto, explora ideas, mantiene su documentacion y coordina modernizaciones completas.
- `planner`: planifica la experiencia UX y genera artefactos de handoff.
- `builder`: construye una vista React/Next desde el handoff.
- `reviewer`: revisa la UI generada y escribe un plan de correcciones.

Tambien incluye un proyecto Next limpio en `skill-flow-test/next-sandbox/` para probar el flujo completo sin tocar una app real.

## Primeros pasos despues de clonar

### Si usas Codex

Desde la raiz del repo:

```bash
./scripts/install-local-plugin.sh
```

Ese script:

- crea o actualiza un marketplace local para Codex;
- registra el plugin;
- instala `90thskills`;
- habilita `/producto` como entrada recomendada y conserva `/product-modernizer`, `/planner`, `/builder` y `/reviewer` para uso experto.

Despues de instalar, reinicia Codex o abre un thread nuevo para que aparezcan los comandos.

### Si usas Claude Code

El script anterior es solo para Codex. Claude Code puede usar las mismas skills, pero espera otra ubicacion:

```txt
.claude/skills/<skill-name>/SKILL.md
```

Para instalarlas dentro del proyecto clonado:

```bash
mkdir -p .claude/skills
cp -R skills/product-modernizer .claude/skills/product-modernizer
cp -R skills/shared .claude/skills/shared
cp -R skills/planner .claude/skills/planner
cp -R skills/builder .claude/skills/builder
cp -R skills/reviewer .claude/skills/reviewer
```

Despues, en Claude Code deberian poder invocarse como:

```txt
/product-modernizer
/planner
/builder
/reviewer
```

Si queres tenerlas disponibles para todos tus proyectos en Claude Code, copialas a:

```txt
~/.claude/skills/
```

Notas:

- `.codex-plugin/` y `commands/` son parte de la instalacion como plugin de Codex.
- Claude Code descubre skills desde `.claude/skills/` o `~/.claude/skills/`.
- Si no aparecen despues de copiarlas, reinicia Claude Code.

## Preparar el playground Next

El sandbox esta en:

```txt
skill-flow-test/next-sandbox/
```

Para levantarlo:

```bash
cd skill-flow-test/next-sandbox
npm install
npm run dev
```

Abrir:

```txt
http://localhost:3000
```

Este proyecto esta pensado como destino de prueba para `builder`. No tiene pantallas de negocio cargadas; las vistas generadas deberian ir en:

```txt
skill-flow-test/next-sandbox/src/features/<view-name>/
```

Y las rutas de prueba en:

```txt
skill-flow-test/next-sandbox/src/app/<view-name>/page.tsx
```

## Donde se guardan los documentos UX

El contexto de producto vive en:

```txt
docs/ux/product-context.md
docs/ux/flows/<flow-id>.md
```

`product-context.md` es el harness global del producto. Los archivos en `docs/ux/flows/` profundizan flujos grandes o criticos.

Las skills guardan los artefactos de vista planos en:

```txt
docs/ux/
```

Con este formato:

```txt
docs/ux/<view-name>-ux-brief.md
docs/ux/<view-name>-ui-handoff.md
docs/ux/<view-name>-ui-review.md
docs/ux/<view-name>-implementation-notes.md
```

No se crea una carpeta por vista.

## Flujo recomendado

### 1. Crear o mantener el contexto de producto

Antes de modernizar muchas pantallas, conviene dejar un harness de producto:

```txt
docs/ux/product-context.md
```

Ese archivo concentra:

- tipos de usuario y permisos;
- entidades principales;
- journeys y flujos existentes;
- problemas actuales del producto;
- reglas globales de UX;
- patrones reutilizables;
- decisiones ya tomadas;
- preguntas abiertas.

Para flujos grandes, agregar:

```txt
docs/ux/flows/<flow-id>.md
```

El contexto global evita que cada pantalla vuelva a entrevistar roles, entidades, permisos, lenguaje y reglas transversales.

### 2. Hablar con el Asistente de Producto

El Asistente de Producto es la entrada recomendada para entender el producto, pensar mejoras, mantener la documentacion o reconstruir un flujo. No hace falta elegir un modo ni aprender una sintaxis especial.

Ejemplos:

```txt
/producto ¿Como funcionan hoy los cobros?
/producto Tengo una idea para permitir pagos parciales
/producto Deja documentada la alternativa que elegimos
/producto Lleva esta mejora al prototipo en skill-flow-test/next-sandbox
```

El asistente interpreta la intencion a partir de la conversacion:

- las preguntas y las ideas son de solo lectura;
- solamente modifica documentacion cuando se lo pedis de forma explicita;
- cuando le pedis llevar algo al prototipo, documenta primero y coordina `planner`, `builder` y `reviewer`;
- si la revision encuentra problemas Critical o High, vuelve a usar `builder` con el plan de correcciones.

El comando `/product-modernizer` sigue disponible como alias experto compatible.

### 3. Usar `planner` manualmente

`planner` es la skill de UX. Sirve para entender una pantalla legacy, replantear su experiencia dentro del producto y dejar un contrato claro para construirla.

Si existe `docs/ux/product-context.md`, `planner` debe leerlo antes de entrevistar y no debe preguntar datos ya resueltos por el contexto de producto.

Lo ideal es pasarle una captura de la pantalla que queres modernizar. Si el flujo tiene mas de una vista, modal, popup, confirmacion, estado de error, drawer o paso secundario, conviene pasarle todas esas capturas juntas.

Tambien ayuda explicar:

- que hace la pantalla;
- quien la usa;
- que acciones son frecuentes;
- que datos no se pueden perder;
- que cosas del legacy son obligatorias y cuales son friccion historica;
- que pasa antes y despues de ese flujo.

Ejemplo:

```txt
/planner Quiero modernizar la pantalla de facturacion mostrador. Te paso capturas de la pantalla principal, el buscador de articulos y el modal de pago.
```

`planner` no deberia construir codigo. Primero hace preguntas de producto/UX, de a una por vez. Hay que responderlas con el mayor contexto posible. Cuando haya suficiente informacion, genera:

```txt
docs/ux/<view-name>-ux-brief.md
docs/ux/<view-name>-ui-handoff.md
```

El archivo importante para construir es el `ui-handoff`.

### 4. Usar `builder`

`builder` toma el handoff generado por `planner` y lo convierte en una vista React/Next usando las convenciones del proyecto destino.

Si el handoff referencia `docs/ux/product-context.md` o `docs/ux/flows/<flow-id>.md`, `builder` debe leerlos y respetar lenguaje, roles, permisos, patrones reutilizables y dependencias del flujo.

Para probar en el sandbox:

```txt
/builder docs/ux/<view-name>-ui-handoff.md -> skill-flow-test/next-sandbox/src/features/<view-name>/
```

Pedile tambien que agregue la ruta:

```txt
skill-flow-test/next-sandbox/src/app/<view-name>/page.tsx
```

`builder` debe dejar notas en:

```txt
docs/ux/<view-name>-implementation-notes.md
```

Despues de construir, corre:

```bash
cd skill-flow-test/next-sandbox
npm run lint
npm run build
```

### 5. Usar `reviewer`

`reviewer` revisa la UI generada contra:

- el contexto de producto;
- el flow file, si existe;
- el handoff;
- el brief UX, si existe;
- las capturas legacy;
- la captura o URL de la UI nueva;
- feedback del usuario.

No edita codigo. Escribe un plan de correcciones para que despues lo ejecute `builder`.

Ejemplo:

```txt
/reviewer http://localhost:3000/<view-name> + docs/ux/<view-name>-ui-handoff.md
```

El resultado esperado:

```txt
docs/ux/<view-name>-ui-review.md
```

Si hay que corregir la implementacion:

```txt
/builder docs/ux/<view-name>-ui-handoff.md + docs/ux/<view-name>-ui-review.md -> skill-flow-test/next-sandbox/src/features/<view-name>/
```

## Estructura del repo

```txt
.codex-plugin/
  plugin.json

commands/
  producto.md
  product-modernizer.md
  planner.md
  builder.md
  reviewer.md

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

## Configuracion del builder

Antes de usar `builder` en un proyecto real, conviene revisar:

```txt
skills/builder/references/design.md
skills/builder/references/component-library.md
skills/builder/references/product-domain.md
```

Esos archivos describen el sistema visual, componentes disponibles y lenguaje de negocio que `builder` debe respetar.

Assets de referencia pueden ir en:

```txt
skills/builder/assets/
```

## Comandos disponibles

Cuando el plugin esta instalado:

```txt
/producto
/product-modernizer
/planner
/builder
/reviewer
```

Si los slash commands no aparecen despues de instalar, reinicia Codex y abre un thread nuevo. Tambien podes elegir **Asistente de Producto** desde el selector o invocar las skills escribiendo `$product-modernizer`, `$planner`, `$builder` o `$reviewer`.
