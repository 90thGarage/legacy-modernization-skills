# View: Consulta Rapida / Autoservicio

## Metadata

- View ID: `consulta-rapida-autoservicio`
- Product area: Catalogo / Ventas / Autoservicio
- Status: draft
- Source material:
  - Screenshot provided on 2026-07-10.
- Related legacy views: Consulta Rapida Articulos.
- Related patterns:
  - `../patterns/sidebar-navigation.md`

## Product Job

- Primary user: cliente del comercio en modo autoservicio.
- Secondary user: comercio/admin que configura o prueba la terminal.
- Primary job: consultar rapidamente el precio de un producto.
- Entry methods: lector de codigo de barras conectado, camara o escritura manual por nombre/codigo/codigo de barras.
- Frequency: alta si se usa como terminal de pasillo/salon.
- Pressure: velocidad, claridad y autonomia; el cliente no debe necesitar asistencia.
- Success event: el cliente escanea o busca un producto y ve foto, descripcion y precio claro.

## Current UX Assessment

La vista actual esta conceptualmente cerca de lo necesario:

- Tiene input de escaneo/busqueda grande.
- Permite buscar por lector/codigo y aparentemente por descripcion.
- Tiene area para fotografia.
- Tiene estado vacio tipo terminal lista.
- Mantiene lista de precios activa.

Problemas o riesgos a resolver:

- Si la usan clientes, el shell administrativo completo molesta y expone navegacion interna.
- El precio debe ser el protagonista del resultado.
- La lista de precios no deberia poder cambiarse desde el modo cliente.
- La pantalla debe estar siempre lista para escanear, con input enfocado.
- Debe haber estados grandes y simples para no encontrado, sin precio, sin conexion o lector/camara no disponible.
- Despues de mostrar un resultado, debe volver automaticamente al estado listo tras inactividad.
- El prototipo/build no sirve si queda solo en estado `Terminal lista` sin datos mockeados para probar busqueda y resultado.

## Target UX Decision

La vista debe tener dos modos:

1. `Modo kiosco/autoservicio`: pantalla limpia para clientes, sin sidebar, tabs, usuario, acciones administrativas ni configuraciones editables.
2. `Modo administracion/prueba`: accesible desde el sistema para configurar lista de precios, probar lector/camara y validar resultados.

El modo principal a optimizar es el modo kiosco/autoservicio.

## Navigation Contract

Admin entry:

- Puede aparecer bajo `Catalogo` como `Consulta rapida`.
- Tambien puede aparecer bajo `Ventas` si el comercio lo entiende como herramienta de salon/mostrador.

Kiosk entry:

- Debe poder abrirse como ruta/pantalla dedicada sin shell administrativo.
- Debe soportar pantalla completa o instalacion en dispositivo dedicado.
- No debe mostrar sidebar, tabs abiertas, usuario, zoom, modo claro ni cierre de sesion.

Decision recomendada:

- Mantener `Consulta rapida` como herramienta secundaria de Catalogo para administradores.
- Agregar modo `kiosco` como superficie limpia para uso de clientes.

## Kiosk Layout Contract

Header:

- Logo/nombre del comercio o marca.
- Opcional: nombre de sucursal/local.
- No mostrar usuario administrativo.
- No mostrar navegacion interna.

Primary input:

- Input grande y dominante.
- Placeholder claro: `Escanea el codigo o escribi el producto`.
- Debe aceptar codigo interno, codigo de barras y descripcion.
- El input debe mantenerse enfocado por defecto.
- El lector de codigo de barras debe poder escribir sin que el usuario haga click.
- Camara como accion secundaria visible si esta disponible.

Price list:

- En modo kiosco, la lista de precios debe estar bloqueada o preconfigurada.
- No mostrar selector editable al cliente.
- Si es necesario informar la lista, mostrarla como texto secundario: `Lista: Mayorista`, `Lista: Publico`, etc.
- En modo administracion/prueba, permitir elegir lista de precios si el usuario tiene permiso.

Result area:

- Debe ocupar el centro visual.
- No debe verse como un rectangulo vacio gigante sin contenido accionable durante el test.
- En estado listo, mostrar una instruccion simple y ejemplos de prueba solo en modo administracion/demo.
- Cuando hay producto encontrado, mostrar:
  - foto grande del articulo;
  - descripcion/nombre;
  - precio como elemento mas grande de la pantalla;
  - presentacion/unidad si aplica;
  - mensaje simple si no hay foto.
- No mostrar datos tecnicos, stock, codigos internos ni acciones administrativas al cliente.

Demo/test affordance:

- En builds de prototipo, incluir productos mockeados y una forma clara de probarlos.
- En modo kiosco real no mostrar una lista administrativa de mocks.
- En modo administracion/demo, debajo del input o en un panel discreto, mostrar ejemplos clickeables como:
  - `7790895000997`;
  - `ADES`;
  - `GIN`;
  - `BALANZA`.
- Click en un ejemplo debe llenar/buscar y mostrar el estado correspondiente.
- El builder debe implementar al menos un resultado encontrado, multiples resultados, sin precio y no encontrado.

Idle / reset behavior:

- Estado inicial: `Terminal lista`.
- Luego de mostrar producto, volver automaticamente al estado inicial despues de un tiempo configurable de inactividad.
- Tiempo sugerido inicial: 8-12 segundos.
- Si el usuario empieza a escanear/escribir antes del timeout, limpiar resultado y buscar nuevo producto.

## Admin / Test Layout Contract

El modo administracion puede usar el shell del producto.

Debe permitir:

- seleccionar lista de precios activa;
- probar lector;
- probar camara;
- ver estado de terminal;
- abrir modo kiosco;
- configurar timeout de reset si existe;
- validar producto no encontrado / sin precio / sin imagen.

No debe mezclar controles administrativos dentro del modo kiosco.

## Search Behavior

| Input | Behavior | Notes |
| --- | --- | --- |
| Codigo de barras por lector | Buscar inmediatamente al recibir Enter/sufijo del lector | Camino principal. |
| Codigo escrito | Buscar por codigo exacto o coincidencia segura | Evitar mostrar multiples resultados confusos en kiosco. |
| Descripcion escrita | Buscar por texto | Si hay multiples resultados, mostrar lista simple y grande. |
| Camara | Escanear codigo si hay permiso/dispositivo | Fallback, no camino principal. |

Multiple matches:

- Si hay varios resultados por descripcion, mostrar una lista simple con nombre, foto mini y precio.
- Permitir elegir un producto tocando/clickeando.
- Mantener texto grande y targets amplios.

## State Model

| State | UI Behavior |
| --- | --- |
| Terminal lista | Input enfocado, mensaje grande `Escanea o busca un producto`. |
| Buscando | Feedback breve, sin bloquear lector. |
| Producto encontrado | Foto, descripcion y precio enorme. |
| Multiples resultados | Lista simple de productos para elegir. |
| Producto no encontrado | Mensaje grande `Producto no encontrado`; volver a listo tras timeout. |
| Sin precio | Mostrar producto y mensaje claro `Precio no disponible`; no inventar precio. |
| Sin foto | Mostrar placeholder limpio, no imagen rota. |
| Lector/camara no disponible | Mensaje de estado visible; permitir escritura manual. |
| Sin conexion / error | Mensaje simple y accion de reintento si aplica. |

## Mock Data Contract

Todo prototipo o build inicial debe incluir datos locales suficientes para testear la vista sin backend.

Products:

| Codigo | Codigo barras | Descripcion | Precio | Unidad/presentacion | Imagen | State to test |
| --- | --- | --- | --- | --- | --- | --- |
| 40 | 7790895000997 | ACONCAGUA GIN VERDE LIMA Y LIMON 750C | 10931.08 | Botella 750 cc | placeholder/product image | encontrado |
| 41 | 7790895643835 | ADES MANZANA X 1000 | 1782.43 | Unidad 1 L | placeholder/product image | encontrado |
| 70 | 7790123451000 | ANDES BLANCA X 1000 | 2126.05 | Unidad 1 L | placeholder/product image | encontrado |
| 93 | 7799001301220 | BALANZA DIGITAL KRETZ NOVA | 268000 | Unidad | placeholder/product image | encontrado |
| 218 | 7790000000218 | SERVICIO MANTENIMIENTO BALANZA | null | Servicio tecnico | no image | sin precio |

Search examples:

- Buscar `7790895000997` debe mostrar Aconcagua.
- Buscar `ADES` debe mostrar Ades.
- Buscar `BALANZA` debe mostrar multiples resultados o permitir elegir entre Balanza Digital y Servicio Mantenimiento Balanza.
- Buscar `NOEXISTE` debe mostrar `Producto no encontrado`.
- Buscar un producto sin imagen debe mostrar placeholder limpio.
- Buscar un producto con precio `null` debe mostrar `Precio no disponible`.

Mock image rule:

- Si no hay imagen real, usar placeholder visual del producto, no una imagen rota.
- Para el prototipo se puede usar un bloque con iniciales/categoria o una imagen mock generica por categoria.
- La ausencia de imagen debe poder probarse explicitamente.

## Information Architecture

### Always Visible In Kiosk

- Marca/comercio.
- Input de escaneo/busqueda.
- Estado de terminal.
- Resultado actual o estado listo.

### Visible On Result

- Foto.
- Descripcion.
- Precio.
- Unidad/presentacion si aplica.

### Admin Only

- Selector de lista de precios.
- Configuracion de camara/lector.
- Timeout.
- Diagnostico de dispositivo.
- Usuario/sesion.

### Must Not Show To Customer

- Sidebar administrativo.
- Tabs internas.
- Usuario administrativo.
- Stock.
- Costo.
- Codigos tecnicos.
- Acciones de editar, crear o eliminar.
- Selector editable de lista de precios.

## Actions

| Action | Mode | Frequency | Placement | Notes |
| --- | --- | --- | --- | --- |
| Escanear codigo | Kiosk | alta | input principal | Debe funcionar sin click previo. |
| Escribir busqueda | Kiosk | media | input principal | Texto grande. |
| Usar camara | Kiosk/Admin | baja/media | accion secundaria | Solo si disponible. |
| Elegir resultado | Kiosk | media si busca por descripcion | lista de resultados | Targets grandes. |
| Cambiar lista de precios | Admin | baja | admin/test mode | No en kiosco. |
| Abrir modo kiosco | Admin | baja | admin/test mode | Pantalla limpia. |
| Reintentar | Kiosk | baja | estado de error | Solo cuando aplica. |

## Visual Direction

- Experiencia: autoservicio/kiosco.
- Densidad: baja/media, con objetivos grandes.
- Tipografia: precio y resultado muy grandes.
- Ritmo visual: una tarea por pantalla.
- Tono: simple, directo, sin jerga administrativa.
- Contraste: alto, legible a distancia.
- Interaccion: input siempre listo, minimo toque/click.

## Builder Handoff

- Components needed:
  - `KioskPriceLookup`
  - `PriceLookupInput`
  - `ProductResultDisplay`
  - `ProductResultList`
  - `KioskIdleState`
  - `DeviceStatus`
  - `AdminPriceLookupSettings`
- Data needed:
  - producto: descripcion, precio, imagen, unidad/presentacion, codigos buscables.
  - lista de precios activa.
  - estado de lector/camara.
  - timeout de reset.
  - mock products listed in `Mock Data Contract`.
  - demo/test search examples for admin mode.
- Must preserve:
  - busqueda por lector/codigo/descripcion;
  - foto, descripcion y precio;
  - estado terminal lista.
- Must avoid:
  - shell administrativo en modo kiosco;
  - selector editable de lista de precios para clientes;
  - datos tecnicos o acciones administrativas;
  - precio pequeno;
  - requerir click antes de escanear;
  - entregar la vista sin datos mockeados testeables;
  - estado idle como unica experiencia visible del prototipo.

## Open Questions

| Question | Why it matters | Blocking? |
| --- | --- | --- |
| La terminal corre siempre en dispositivo dedicado o dentro del sistema con usuario logueado | Define si kiosco necesita ruta publica/protegida y timeout de sesion | yes before final build |
| La lista de precios se fija por local, terminal o usuario | Define configuracion y que se muestra al cliente | yes |
| El lector envia Enter/sufijo al escanear | Define comportamiento de busqueda inmediata | yes |
| Que pasa si hay multiples productos por descripcion | Define lista de resultados o requerir coincidencia exacta | no |
| Cuanto tiempo debe permanecer visible un resultado | Define timeout por defecto | no |
