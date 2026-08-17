# Flow: Consulta rápida de precios en autoservicio

## Goal

- Flow ID: `consulta-rapida-autoservicio`.
- User goal: escanear o buscar un producto y comprender su precio sin asistencia.
- Business outcome: consulta rápida en salón con lista de precios controlada y sin exponer funciones administrativas.
- Documentation status: `partially-confirmed`.
- Delivery status: `prototype-built`.
- Evidence: captura legacy, decisión del cliente, contrato de vista y prototipo.

## Primary Users

| Role | Job in this flow | Frequency | Pressure | Notes |
| --- | --- | --- | --- | --- |
| Cliente del comercio | Consultar precio | Alta en terminal dedicada | Alta | No debe ver administración. |
| Administrador / soporte | Configurar y probar terminal | Ocasional | Media | Modo administrativo separado. |

## Current Legacy Flow

| Step | User goal | Legacy surface | Pain / friction | Step classification | Notes |
| --- | --- | --- | --- | --- | --- |
| Abrir consulta | Preparar terminal | Consulta rápida legacy | Puede convivir con controles administrativos | legacy workaround | Captura disponible. |
| Escanear/buscar | Encontrar producto | Input y resultado | Estados incompletos | essential decision | Lector/cámara reales pendientes. |

## Target Modern Flow

| Step | Modern behavior | Surface | User decision | Validation / recovery | Notes |
| --- | --- | --- | --- | --- | --- |
| Preparar terminal | Abrir modo kiosco sin shell y lista bloqueada | Kiosco | Ninguna para cliente | Estado de terminal visible | Admin configura fuera. |
| Escanear o escribir | Buscar por código, barras o descripción | Input siempre enfocado | Método de entrada | Fallback manual si hardware falla | Camino principal: lector. |
| Resolver coincidencia | Mostrar producto o lista simple | Resultado | Elegir si hay múltiples | No encontrado/sin precio/sin imagen claros | Precio dominante. |
| Reiniciar | Volver a Terminal lista tras inactividad | Kiosco | Ninguna | Nueva entrada cancela timeout | 8–12 s sugeridos, por validar. |

## Screens / Surfaces

| Surface | Legacy source | Modern destination | Pattern | Status |
| --- | --- | --- | --- | --- |
| Kiosco | Consulta rápida legacy | `KioskPriceLookup` | kiosk price lookup | prototype-built |
| Administración/prueba | Inferido | Vista con shell | main view | partially built |

## Entry Points

- `Catálogo > Consulta rápida` para prueba administrativa.
- Ruta o pantalla dedicada para kiosco.

## Exit Points

- Reinicio automático para la siguiente consulta.
- Salida administrativa hacia Artículos en el prototipo.

## Blocking Dependencies

| Dependency | Type | Blocking? | Current status | Notes |
| --- | --- | --- | --- | --- |
| Lista de precios | data / permission | yes | mock/preconfigured | Cliente no puede cambiarla. |
| Lector/cámara | integration | no with fallback | simulated | Dispositivos reales pendientes. |
| Configuración de terminal | data | yes for deployment | not mapped | Local, timeout y pantalla completa. |

## Data And Rules

- Core entities: Producto, Precio, Lista de precios, Terminal.
- Required data: identidad del producto y precio disponible; imagen/presentación opcionales.
- Visible business rules: no inventar precio; no mostrar stock, costo, códigos internos ni acciones administrativas al cliente.
- Recovery behavior: permitir nueva búsqueda y volver a listo tras error o inactividad.

## UX Decisions

| Decision | Rationale | Confirmation |
| --- | --- | --- |
| Kiosco sin shell administrativo | Protege navegación y simplifica uso | user-confirmed |
| Input siempre enfocado y precio protagonista | Optimiza consulta autónoma | user-confirmed |
| Lista de precios bloqueada en modo cliente | Evita resultados inconsistentes | user-confirmed |

## Open Questions

| Question | Risk if unresolved | Blocking? |
| --- | --- | --- |
| ¿Cómo se asigna lista, local y terminal? | Precio incorrecto | yes |
| ¿Qué hardware y sufijo usa cada lector/cámara? | Escaneo inestable | yes for deployment |
| ¿Qué timeout y comportamiento necesita el comercio real? | Mala experiencia en salón | no for prototype |

## Views To Build

| View ID | Purpose | Handoff path | Destination | Status |
| --- | --- | --- | --- | --- |
| consulta-rapida-autoservicio | Consultar precio en kiosco | `docs/product-redesign/views/consulta-rapida-autoservicio.md` | `kiosk-price-lookup.tsx` | prototype-built |
