# View: Facturacion Avanzada

## Metadata

- View ID: `facturacion-avanzada`.
- Product area: Ventas / Facturacion.
- Status: draft para prototipo y validacion con cliente.
- Source material:
  - Captura completa del formulario legacy provista el 2026-07-31.
  - Captura ampliada de la cabecera legacy provista el 2026-07-31.
  - Feedback del cliente del 2026-07-31: separar Facturacion Rapida de una superficie de facturacion con mayor complejidad y campos configurables por cliente.
- Related views:
  - `./facturacion-rapida-pos.md`.
  - `./documentos-comerciales.md`.
  - `./clientes.md`.
  - `./catalogo-articulos.md`.
- Related patterns:
  - `../patterns/documento-transaccional.md`.
  - `../patterns/formulario-seccionado.md`.

## Product Job

- Primary user: administrativo, encargado o usuario autorizado que necesita preparar un comprobante con informacion fiscal, comercial, logistica y de control mas detallada que en el POS.
- Primary job: crear y emitir una factura completa sin perder visibilidad sobre cabecera, items e importes.
- Secondary jobs: definir condiciones comerciales, asociar deposito/remito, ingresar datos internos, aplicar descuentos e impuestos, registrar pagos y revisar el resultado antes de emitir.
- Pressure: media. Importa la exactitud y la capacidad de revisar mas que la velocidad extrema del mostrador.
- Success event: el usuario completa solamente los datos habilitados para su organizacion, revisa el documento y emite una factura valida sin depender de la pantalla de Facturacion Rapida.

## Boundary With Facturacion Rapida

Facturacion Rapida y Facturacion Avanzada son dos experiencias distintas sobre el mismo dominio.

| Aspecto | Facturacion Rapida | Facturacion Avanzada |
| --- | --- | --- |
| Trabajo principal | Venta de mostrador y cobro inmediato | Preparacion detallada de un comprobante |
| Usuario principal | Cajero o vendedor | Administrativo o encargado |
| Presion dominante | Velocidad y continuidad | Exactitud, revision y flexibilidad |
| Cantidad de datos | Minimos operativos | Datos fiscales, comerciales, logisticos e internos |
| Configuracion visual | Layout operativo acotado | Bloques, campos y columnas configurables |
| Estado de caja | Gobierna la operacion | No debe gobernar la composicion del documento |

Ambas superficies deben reutilizar las mismas reglas de dominio, calculos, validaciones fiscales, permisos y servicios de emision. La configuracion cambia la presentacion y los valores iniciales; nunca redefine reglas fiscales o de auditoria.

## Fixed Structural Contract

La vista conserva tres zonas estables y en este orden:

1. `Cabecera`: contexto del documento y bloques de datos configurables.
2. `Items`: busqueda, carga y edicion de renglones.
3. `Resumen`: desglose calculado, total dominante y acciones de finalizacion.

El cliente puede configurar las piezas dentro de cada zona, pero no puede mover `Items` por encima de la cabecera ni el `Resumen` al centro de la operacion. Esta estabilidad mantiene un modelo mental comun para soporte, capacitacion y auditoria.

## Desktop Layout

### Alternativas de prototipo

El menu contextual del usuario permite comparar las composiciones sin recargar ni perder el documento en curso:

- `A · Pestañas`: Items y extensiones se organizan mediante pestañas; importes, total y acciones comparten una unica barra inferior sin titulo redundante.
- `B · Guiada`: conserva la version actual y es la alternativa inicial. La grilla permanece visible, las extensiones se expresan como cinco pasos y resumen/acciones comparten una unica franja inferior.
- `C · Esencial`: elimina la barra descriptiva y los bloques de cabecera. La letra fiscal inicia una unica superficie jerarquizada; cliente, comprobante, punto de venta, fecha y moneda forman la primera linea, y los datos administrativos menos frecuentes se abren desde `Mas datos`. Las extensiones usan las pestañas de A.
- `D · Comprobante`: toma como referencia directa la factura fisica. Divide la cabecera en datos del documento a la izquierda y datos del cliente a la derecha, con la letra fiscal montada sobre el eje central. Observaciones conserva formato multilínea sin separar su etiqueta del campo y la cabecera limita su crecimiento para devolver altura útil a la grilla.

El selector existe para validacion de UX y no representa una preferencia funcional del comprobante. Las cuatro alternativas comparten datos, calculos y reglas del documento.

En C no se ofrece `Configurar vista` dentro del comprobante. La seleccion de campos visibles pertenece a la configuracion del perfil del usuario; la pantalla solamente presenta el resultado de esa preferencia.

Observaciones se presenta como un campo multilínea de mayor jerarquia en C. Su altura reduce deliberadamente el area vacia de la grilla sin provocar scroll del workspace.

En D, la familiaridad del comprobante impreso gobierna la jerarquia: receptor y condicion comercial forman una mitad; letra, tipo, numeracion y datos de emision forman la otra. La distribucion desktop reserva aproximadamente 60% del espacio central para cabecera y 40% para Items.

### Viewport contract

- En desktop, Cabecera, Items, Resumen y acciones deben entrar simultaneamente en el alto disponible de la aplicacion.
- El workspace completo no usa scroll vertical.
- La cabecera y el resumen conservan alto intrinseco compacto; Items recibe todo el espacio flexible restante.
- Cuando existen mas renglones que espacio disponible, solamente el cuerpo de la grilla hace scroll.
- La letra fiscal del comprobante se comunica mediante una pieza cuadrada compacta (`A`, `B`, etc.), no mediante una tarjeta o encabezado de gran superficie.
- Los modulos de cabecera usan una composicion asimetrica: Cliente y comprobante domina a la izquierda; Condiciones, Control y Logistica aprovechan la derecha sin igualar artificialmente sus alturas.

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ FACTURACION AVANZADA                    Borrador · Nro. interno 51950660     │
├──────────────────────────────────────────────────────────────────────────────┤
│ CABECERA                                                     [Configurar]    │
│                                                                              │
│ ┌──────────────────────────────┐ ┌──────────────────────┐ ┌───────────────┐ │
│ │ CLIENTE Y COMPROBANTE        │ │ CONDICIONES          │ │ CONTROL       │ │
│ │ Cliente                      │ │ Moneda               │ │ Fecha         │ │
│ │ Destino                      │ │ Condicion de venta   │ │ Nro. interno  │ │
│ │ Tipo / Punto de venta        │ │ Vendedor             │ │ Empresa / CC  │ │
│ │ Jurisdiccion                 │ │ Lista de precios     │ │ Lote          │ │
│ │ Observaciones                │ │                      │ │               │ │
│ └──────────────────────────────┘ └──────────────────────┘ └───────────────┘ │
│                                                                              │
│ ┌──────────────────────────────────────────────────────────────────────────┐ │
│ │ LOGISTICA · Deposito · Generar remito automatico                        │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────────────────────────────────┤
│ ITEMS                                      Buscar articulo   [+ Agregar]     │
│ ┌──────────────────────────────────────────────────────────────────────────┐ │
│ │ Cuenta │ UN │ Cant. │ Precio │ Dto. │ IVA │ Detalle auxiliar │ Importe │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
│ 1 Cobro ✓ │ 2 Impuestos ✓ │ 3 Entrega │ 4 Origen │ 5 Pagos pendiente     │
├──────────────────────────────────────────────────────────────────────────────┤
│ RESUMEN                                                                     │
│ Neto · Bonificacion · IVA · Imp. internos · Percepciones       TOTAL        │
│ [Cancelar] [Guardar borrador] [Vista previa]          [Emitir factura]      │
└──────────────────────────────────────────────────────────────────────────────┘
```

## Header Blocks

### 1. Cliente y comprobante

Es el bloque dominante y ocupa mayor ancho porque sus decisiones condicionan el resto del documento.

| Campo legacy | Etiqueta objetivo | Comportamiento inicial |
| --- | --- | --- |
| Cliente | Cliente | Obligatorio, seleccion con busqueda y contexto fiscal visible |
| Destino | Destino del comprobante | Select configurable |
| Tipo | Tipo de comprobante | Obligatorio; inicia en Factura |
| Pto. de Vta. | Punto de venta | Obligatorio; limitado por permisos/configuracion |
| Numero | Numero | Solo lectura si lo asigna el sistema |
| Jurisdiccion | Jurisdiccion | Opcional/configurable |
| Observac. | Observaciones | Texto libre configurable |
| Letra `A` legacy | Letra del comprobante | Resultado visible, no campo manual cuando se deriva fiscalmente |

### 2. Condiciones comerciales

| Campo legacy | Etiqueta objetivo | Comportamiento inicial |
| --- | --- | --- |
| Moneda | Moneda | Obligatorio; Peso argentino por defecto |
| Tip. Cond. Vta. | Condicion de venta | Obligatorio |
| Vendedor | Vendedor | Sugerido por usuario/cliente |
| Lista Precios | Lista de precios | Sugerida por cliente |
| Autoriza | Autorizar lista/condicion | Accion contextual solo si la regla requiere permiso |

### 3. Logistica

| Campo legacy | Etiqueta objetivo | Comportamiento inicial |
| --- | --- | --- |
| Deposito | Deposito | Select condicionado por empresa/local |
| Genera Remito Automatico | Generar remito automaticamente | Checkbox; puede revelar configuracion adicional |

El bloque puede ocupar una fila horizontal completa para evitar una cuarta columna estrecha. Si esta oculto, los bloques restantes recuperan el espacio.

### 4. Control interno

| Campo legacy | Etiqueta objetivo | Comportamiento inicial |
| --- | --- | --- |
| Fecha | Fecha | Obligatorio |
| Nro. Int. | Numero interno | Solo lectura si lo genera el sistema |
| Emp. | Empresa | Configurable; puede venir bloqueada por contexto |
| C.C. | Centro de costo | Opcional/configurable |
| Lote | Lote | Opcional/configurable |

Es el bloque mas compacto. Sus valores son breves y administrativos.

En C, Numero interno, Empresa, Centro de costo y Lote salen del recorrido principal y se editan mediante `Mas datos`. Fecha permanece visible por su relevancia operativa.

## Modular Configuration Model

La configuracion se aplica en tres niveles:

### Blocks

- Visibilidad de `Cliente y comprobante`, `Condiciones comerciales`, `Logistica` y `Control interno`.
- Orden solamente dentro de la cabecera.
- Ancho recomendado del bloque: dominante, medio o compacto.
- Estado inicial expandido o resumido cuando corresponda.

### Fields

Cada campo configurable admite:

- `visible`: se muestra u oculta.
- `required`: se exige antes de emitir.
- `readOnly`: se muestra sin permitir edicion.
- `defaultValue`: valor inicial permitido por las reglas del dominio.
- `order`: posicion dentro del bloque.

### Item columns and extensions

- Columnas visibles, orden y ancho de la grilla.
- Extensiones habilitadas: Percepciones/Retenciones, Vencimientos, Remitos, Presupuestos y Pagos.
- Campos de detalle por item: cuenta, unidad, cantidad, precio, descuento manual, descuento porcentual, precio final, detalle auxiliar, IVA e importe.

### Guardrails

- Ocultar un dato no evita validarlo cuando una regla fiscal lo requiere: en ese caso debe resolverse mediante un valor seguro, una derivacion o un bloqueo claro.
- Los campos ocultos no dejan espacios vacios; los restantes recomponen la grilla.
- No se permite ocultar simultaneamente todos los datos que identifican cliente y comprobante.
- Cliente, tipo de comprobante, fecha, items, total y accion de emision funcionan como anclajes del flujo.
- La configuracion pertenece a la organizacion/cliente y puede tener valores sugeridos por local o perfil, pero el prototipo inicial no implementa persistencia multiempresa.

## Items Workspace

- La busqueda ocupa una fila propia de ancho completo inmediatamente antes de los encabezados de la grilla, replicando el patron operativo de Facturacion Rapida.
- La busqueda acepta codigo, descripcion o codigo de barras, muestra coincidencias con precio y agrega directamente al seleccionar. Enter agrega una coincidencia exacta o unica.
- No se usa un boton separado `Agregar` para completar la accion normal de busqueda.
- La grilla ocupa todo el ancho disponible y usa scroll horizontal cuando la configuracion habilita muchas columnas.
- La superficie completa de Items conserva divisiones verticales por columna y renglones horizontales en el espacio libre, siguiendo el patron visual de Facturacion Rapida. La grilla no termina visualmente en el ultimo item.
- Los anchos responden al tipo de dato: Articulo y Detalle auxiliar reciben mayor superficie; Unidad, Cantidad, Descuento, IVA y Acciones permanecen compactos. Los inputs numericos no se expanden hasta ocupar toda la columna.
- En la alternativa A, Items y las extensiones se alternan mediante pestañas. La busqueda y la grilla aparecen solamente en Items; cada extension ocupa el mismo espacio central.
- En la alternativa B, Items permanece siempre visible y las extensiones no reemplazan la grilla.
- En B, Cobro, Impuestos, Entrega, Origen y Pagos se muestran permanentemente como una lista de preparacion arriba de la busqueda. Se ocultan controles de edicion, no el estado actual.
- La lista no usa numeracion porque las decisiones no son estrictamente secuenciales. Comunica progreso global y distingue explicitamente `Definido`, `Opcional` y `Falta definir`.
- Una accion `Completar pendientes` abre el primer dato faltante. Valores como `Sin remito` o `Registrar despues` cuentan como definidos solamente despues de una eleccion explicita.
- Seleccionar una etapa abre un editor contextual con una explicacion breve y vuelve a la grilla sin perder el documento.
- Cantidad, precio y descuentos pueden editarse inline si el usuario tiene permiso.
- Los datos menos frecuentes de un renglon se abren como detalle contextual, sin ensanchar indefinidamente la tabla.
- Quitar o modificar un item recalcula resumen y total.
- El prototipo usa datos simulados y no compromete stock real.

## Summary And Completion

El resumen cierra visualmente la grilla que produce los importes.

- Muestra neto, bonificacion, IVA por alicuota, impuestos internos, no gravado, percepciones y total segun configuracion y resultado.
- El total es el valor dominante.
- Acciones secundarias: `Cancelar`, `Guardar borrador` y `Vista previa`.
- Accion principal: `Emitir factura`.
- La barra de finalizacion puede ser sticky para conservar total y accion durante documentos extensos.
- En A y B, importes, total y acciones se unifican para ganar altura util. A omite el titulo `Resumen` y cualquier texto auxiliar que no agregue informacion operativa.
- Emitir valida primero los anclajes y luego las reglas dependientes del tipo de comprobante y cliente.

## Responsive Behavior

- Desktop ancho: composicion asimetrica de cabecera, grilla de items flexible y sin scroll del workspace.
- Desktop medio: Control interno recibe mas ancho que Condiciones comerciales para evitar comprimir fecha, empresa y centro de costo.
- Tablet: las alternativas A y B usan dos columnas de cabecera; Condiciones y Control se reparten la segunda mitad y Logistica ocupa una fila propia. C distribuye campos frecuentes en tres columnas y D apila primero los datos del comprobante y luego los del cliente.
- Tablet y mobile sustituyen la tabla ancha por fichas editables de item. La identidad y el importe permanecen arriba; cantidad, precio, descuento y precio final forman una grilla adaptable; cuenta, unidad e IVA quedan como metadatos compactos. No se exige desplazamiento horizontal para editar un renglon.
- Mobile: los bloques se apilan, el selector de alternativas se reduce a `A`, `B`, `C` y `D`, y la letra fiscal permanece junto al contexto principal del comprobante.
- En mobile, el desglose de impuestos usa desplazamiento horizontal propio, el total ocupa una fila completa y las cuatro acciones se muestran en una grilla de dos columnas. Ningun importe ni accion puede superponerse o salir del viewport.
- Las pestañas de extensiones conservan desplazamiento horizontal propio porque son navegacion secundaria y no datos de edicion.
- El documento puede hacer scroll vertical en tablet y mobile; la barra inferior de total y acciones permanece visible. El contrato sin scroll vertical se aplica solamente al escritorio.
- El orden semantico se conserva en todos los tamaños: Cliente, Condiciones, Logistica, Control, Items y Resumen.

## Prototype Scope

El primer prototipo debe permitir validar:

1. Distincion visible entre Facturacion Rapida y Facturacion Avanzada en la navegacion.
2. Estructura fija Cabecera / Items / Resumen.
3. Reorganizacion automatica al mostrar u ocultar bloques.
4. Configuracion demostrable de campos y columnas mediante un panel local.
5. Carga, edicion y eliminacion de items con recalculo de importes.
6. Extensiones representadas como estados ordenados siempre visibles y edicion contextual.
7. Validacion basica antes de una emision simulada.
8. Comparacion instantanea entre las alternativas desde el menu contextual del usuario.

Fuera del alcance inicial:

- Emision real, CAE o integracion con ARCA.
- Persistencia de configuraciones por tenant/cliente.
- Autorizaciones backend y auditoria real.
- Reglas contables, fiscales, de stock o cuenta corriente definitivas.
- Generacion efectiva de remitos, recibos o notas asociadas.

## Validation Questions

- Que campos son verdaderamente obligatorios en todos los clientes y cuales dependen del rubro/configuracion.
- Si las extensiones se habilitan por organizacion completa, por tipo de comprobante o por perfil de usuario.
- Quien puede configurar la vista y si los usuarios pueden personalizarla sin afectar a otros.
- Si la configuracion necesita variantes por empresa, sucursal o punto de venta.
- Que acciones legacy del lateral y del pie deben permanecer en el primer lanzamiento.
- Como se define y comunica la autorizacion de lista de precios, descuentos y condiciones comerciales.

## Acceptance Criteria For The Draft

- Facturacion Avanzada aparece como destino independiente de Facturacion Rapida.
- Cabecera, Items y Resumen permanecen reconocibles con cualquier configuracion valida.
- Ocultar un bloque o campo recompone el layout sin huecos.
- El usuario puede comprender que la configuracion modifica visibilidad, no reglas fiscales.
- Los datos principales de las capturas legacy tienen una ubicacion objetivo documentada.
- El total y la accion de emision permanecen visibles o facilmente recuperables.
