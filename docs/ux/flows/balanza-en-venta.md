# Flow: Balanza en venta

## Goal

- Flow ID: `balanza-en-venta`
- User goal: vender productos pesables capturando kilos/gramos desde balanza.
- Business outcome: cargar cantidad/peso correcto, precio correcto y evitar etiqueta previa cuando aplique.
- Documentation status: `partially-confirmed`.
- Delivery status: `prototype-built` with simulated hardware.
- Evidence: `demo-confirmed` for product behavior; `needs-user-validation` for local hardware and actual usage.

## Primary Users

| Role | Job in this flow | Frequency | Pressure | Notes |
| --- | --- | --- | --- | --- |
| Cajero / mostrador | Seleccionar producto, capturar peso y sumar item | needs-user-validation | Alta en rubros pesables | Verduleria, fiambreria, autoservicio. |
| Administrador / soporte | Configurar modelos, conexion, PLU y precios | demo-confirmed | Variable | Depende de marca/modelo/API. |

## Current Legacy Flow

| Step | User goal | Legacy surface | Pain / friction | Step classification | Notes |
| --- | --- | --- | --- | --- | --- |
| Seleccionar producto | Elegir item pesable | POS/balanza | No se cubrio busqueda real | essential decision | Producto debe estar configurado. |
| Pesar | Capturar kilos/gramos | Balanza conectada | Depende de cable/red/Wi-Fi/modelo | hardware-gated | Kretz/Systel mencionadas en minuta previa. |
| Calcular precio | Usar peso y precio | Sistema | PLU/modelo puede afectar | essential decision | Puede evitar etiqueta previa. |
| Actualizar precios | Enviar/recibir precios con balanza | Config balanza | Depende de tecnologia/API | integration-gated | No siempre disponible. |

## Target Modern Flow

| Step | Modern behavior | Surface | User decision | Validation / recovery | Notes |
| --- | --- | --- | --- | --- | --- |
| Detectar estado balanza | Mostrar si esta disponible | POS hardware status | Continuar o usar fallback | Sin conexion, modelo no soportado | Estado visible. |
| Cargar producto pesable | Seleccionar producto y leer peso | POS item entry | Confirmar item/peso | Peso invalido/no leido | Fallback manual si permitido. |
| Agregar item | Calcular subtotal y sumar al carrito | Carrito | Confirmar cantidad/precio | PLU/precio faltante | No bloquear sin mensaje. |
| Sincronizar precios | Actualizar PLU/precios cuando aplique | Configuracion secundaria | Ejecutar sync | Depende modelo/API | No todo modelo soporta. |

## Screens / Surfaces

| Surface | Legacy source | Modern destination | Pattern | Status |
| --- | --- | --- | --- | --- |
| Balanza en venta | Demo IM5 | Hardware-aware item input | main view / panel | prototype-simulated |
| Configuracion balanza/precios | Demo IM5 | Configuracion secundaria | route / panel | prototype-built |

## Entry Points

- Producto pesable dentro de POS.
- Configuracion de balanza desde ABM/articulos o settings.

## Exit Points

- Item pesable agregado al carrito.
- Error de hardware/fallback.
- Precios actualizados segun modelo.

## Blocking Dependencies

| Dependency | Type | Blocking? | Current status | Notes |
| --- | --- | --- | --- | --- |
| Modelos y APIs soportados | integration | yes | partial | Kretz/Systel mencionados; detalle pendiente. |
| Fallback cuando balanza falla | business rule | yes | open | Manual? bloquear? |
| Uso real por rubro | research | no | needs-user-validation | Frecuencia pendiente. |

## Data And Rules

- Core entities: Producto, Balanza, Peso, PLU, Precio, Venta.
- Required data: producto pesable, peso, precio.
- Optional data: modelo, credenciales, conexion, PLU.
- Derived data: subtotal por peso.
- Visible business rules: algunas balanzas permiten actualizar precios; otras no.
- Validation rules: peso valido, balanza conectada, producto configurado.
- Recovery behavior: mostrar error y fallback permitido.

## UX Decisions

| Decision | Rationale | Confirmation |
| --- | --- | --- |
| Estado de balanza debe ser visible | Hardware puede fallar o no estar conectado | demo-inferred |
| No asumir misma UX para todos los modelos | Soporte depende de marca/API | demo-confirmed |

## Open Questions

| Question | Risk if unresolved | Blocking? |
| --- | --- | --- |
| Que hace el cajero si la balanza no responde | Flujo puede quedar bloqueado | yes |
| Que modelos usan clientes reales y con que conexion | UI/configuracion incorrecta | yes |
| Se permite peso manual | Riesgo operativo/fraude | yes |

## Evidence

| Claim | Source | Confidence |
| --- | --- | --- |
| IM5 conecta con modelos de clientes actuales | minuta tecnica 2026-07-08 | demo-confirmed |
| Producto se selecciona, se pesa y se captura kilo/gramo | minuta tecnica 2026-07-08 | demo-confirmed |
| Falta validacion en local real | cobertura guia 2026-07-08 | needs-user-validation |

## Views To Build

| View ID | Purpose | Handoff path | Destination | Status |
| --- | --- | --- | --- | --- |
| balanza-en-venta | Venta de productos pesables | `docs/product-redesign/views/facturacion-rapida-pos.md` | `pos-workspace.tsx` | prototype-built |
