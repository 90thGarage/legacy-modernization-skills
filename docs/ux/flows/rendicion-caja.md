# Flow: Rendicion y control de caja

## Goal

- Flow ID: `rendicion-caja`
- User goal: abrir, retirar y cerrar caja declarando medios para control administrativo.
- Business outcome: comparar lo declarado por cajero contra lo registrado por sistema y detectar diferencias.
- Documentation status: `partially-confirmed`.
- Delivery status: `prototype-built`.
- Evidence: `demo-confirmed` for types and purpose; `needs-user-validation` for daily use and correction pain.

## Primary Users

| Role | Job in this flow | Frequency | Pressure | Notes |
| --- | --- | --- | --- | --- |
| Cajero | Cargar rendicion inicial/parcial/final | needs-user-validation | Media | Declara dinero/medios. |
| Dueno / administrador | Controlar faltantes, sobrantes y medios mal imputados | demo-confirmed | Media/alta | Puede no estar en negocio todo el dia. |

## Current Legacy Flow

| Step | User goal | Legacy surface | Pain / friction | Step classification | Notes |
| --- | --- | --- | --- | --- | --- |
| Rendicion inicial | Registrar efectivo inicial para vuelto | Rendicion | No se cubrio validacion real | essential decision | Antes de cobrar. |
| Rendicion parcial | Registrar retiro durante turno | Rendicion | Permisos/correcciones pendientes | risky | Dueño/admin retira efectivo. |
| Rendicion final | Declarar entrega al cierre | Rendicion | Puede haber medios mal imputados | essential decision | Efectivo, cupones, transferencias, cheques, retenciones. |
| Control administrativo | Comparar declarado vs sistema | Papel/listado trabajo | Correccion segun permisos | permission-gated | Detecta faltantes/sobrantes. |
| Listado | Ver movimientos por fecha | Listado rendiciones | En IM5 usuario ve propias rendiciones | useful confirmation | Filtro de otros usuarios existia en otra version. |

## Target Modern Flow

| Step | Modern behavior | Surface | User decision | Validation / recovery | Notes |
| --- | --- | --- | --- | --- | --- |
| Abrir caja | Registrar inicial con medios configurados | Rendicion inicial | Importes iniciales | Campos segun configuracion | Debe ser rapido antes de vender. |
| Registrar retiro | Parcial con motivo/importe | Rendicion parcial | Cuanto se retira | Permiso, saldo disponible | Auditoria clara. |
| Cerrar caja | Declarar medios y comparar | Rendicion final | Confirmar declarado | Diferencias, medios cruzados | Mostrar faltante/sobrante. |
| Revisar listado | Filtrar por fecha/usuario segun permiso | Listado | Ver propias o todas | Permisos | Falta regla final. |

## Screens / Surfaces

| Surface | Legacy source | Modern destination | Pattern | Status |
| --- | --- | --- | --- | --- |
| Rendicion inicial/parcial/final | Demo IM5 | Flow de rendicion | main view / dialog | prototype-built |
| Listado de rendiciones | Demo IM5 | Listado con filtros | route / table | prototype-partial |
| Papel de trabajo | Demo IM5 | Resumen comparativo | panel / export | not-planned |

## Entry Points

- Acceso lateral desde POS.
- Inicio de turno.
- Retiro durante turno.
- Cierre de turno/dia/periodo.

## Exit Points

- Caja habilitada para cobrar.
- Retiro registrado.
- Rendicion final enviada a administracion.
- Correccion segun permisos.

## Blocking Dependencies

| Dependency | Type | Blocking? | Current status | Notes |
| --- | --- | --- | --- | --- |
| Medios de rendicion parametrizados | data | yes | partial | Dependen del cliente/rubro. |
| Permisos de correccion | permission | yes | open | No detallado. |
| Ver propias vs todos usuarios | permission | no | partial | IM5 actual propias; otra version otros usuarios. |

## Data And Rules

- Core entities: Rendicion, Caja, Usuario, Medio de pago/rendicion, Movimiento.
- Required data: tipo, usuario, fecha, importes por medio.
- Optional data: observacion, correccion, filtro usuario.
- Derived data: faltante, sobrante, medio mal imputado.
- Visible business rules: parcial representa retiro; final compara contra sistema.
- Validation rules: medios definidos por parametrizacion.
- Recovery behavior: corregir segun permiso manteniendo auditoria.

## UX Decisions

| Decision | Rationale | Confirmation |
| --- | --- | --- |
| Separar inicial/parcial/final | Cada tipo responde a un momento operativo distinto | demo-confirmed |
| Mostrar comparacion declarado vs sistema | Es el objetivo administrativo del flujo | demo-confirmed |
| Permisos deben controlar correccion | Riesgo de caja | demo-confirmed / open detail |

## Open Questions

| Question | Risk if unresolved | Blocking? |
| --- | --- | --- |
| Quien puede corregir rendiciones | Riesgo de auditoria/caja | yes |
| Que medios son obligatorios por rubro | Form incompleto o ruidoso | no |
| Como se resuelve diferencia final | Flujo podria quedar sin cierre | yes |

## Evidence

| Claim | Source | Confidence |
| --- | --- | --- |
| Rendicion inicial/parcial/final explicadas | minuta tecnica 2026-07-08 | demo-confirmed |
| Sistema compara declarado vs registrado | minuta tecnica 2026-07-08 | demo-confirmed |
| Falta uso real y criterios de exito | cobertura guia 2026-07-08 | needs-user-validation |

## Views To Build

| View ID | Purpose | Handoff path | Destination | Status |
| --- | --- | --- | --- | --- |
| rendicion-caja | Apertura, retiro, cierre y control de caja | `docs/product-redesign/views/facturacion-rapida-pos.md` | `pos-workspace.tsx` | prototype-built |
