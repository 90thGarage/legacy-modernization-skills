# 90thSkills

Playground local para modernizar pantallas legacy con Codex.

El repo trae tres skills:

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
- habilita los comandos `/planner`, `/builder` y `/reviewer`.

Despues de instalar, reinicia Codex o abre un thread nuevo para que aparezcan los comandos.

### Si usas Claude Code

El script anterior es solo para Codex. Claude Code puede usar las mismas skills, pero espera otra ubicacion:

```txt
.claude/skills/<skill-name>/SKILL.md
```

Para instalarlas dentro del proyecto clonado:

```bash
mkdir -p .claude/skills
cp -R skills/planner .claude/skills/planner
cp -R skills/builder .claude/skills/builder
cp -R skills/reviewer .claude/skills/reviewer
```

Despues, en Claude Code deberian poder invocarse como:

```txt
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

Las skills guardan los artefactos planos en:

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

### 1. Usar `planner`

`planner` es la skill de UX. Sirve para entender una pantalla legacy, replantear su experiencia dentro del producto y dejar un contrato claro para construirla.

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

### 2. Usar `builder`

`builder` toma el handoff generado por `planner` y lo convierte en una vista React/Next usando las convenciones del proyecto destino.

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

### 3. Usar `reviewer`

`reviewer` revisa la UI generada contra:

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
  planner.md
  builder.md
  reviewer.md

skills/
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
/planner
/builder
/reviewer
```

Si los slash commands no aparecen despues de instalar, reinicia Codex y abre un thread nuevo. Tambien podes invocar las skills escribiendo `$planner`, `$builder` o `$reviewer` si la UI muestra skills pero no comandos.
