# Flow: Gestión de clientes

## Goal

- Flow ID: `gestion-clientes`.
- User goal: encontrar, consultar, crear y mantener clientes utilizables en ventas y facturación.
- Business outcome: datos fiscales y comerciales confiables sin obligar al POS a cargar el ABM completo.
- Documentation status: `partially-confirmed`.
- Delivery status: `prototype-built`.
- Evidence: capturas, decisiones del cliente, contrato de vista e implementación.

## Primary Users

| Role | Job in this flow | Frequency | Pressure | Notes |
| --- | --- | --- | --- | --- |
| Administrativo | Mantener datos completos | Frecuente | Media | Usuario principal. |
| Cajero / vendedor | Consultar o corregir datos necesarios | Variable | Alta con cliente esperando | Alta contextual vive en otro flujo. |

## Current Legacy Flow

| Step | User goal | Legacy surface | Pain / friction | Step classification | Notes |
| --- | --- | --- | --- | --- | --- |
| Buscar | Encontrar cliente | Consulta/ABM Clientes | Superficies duplicadas | expert shortcut | Tabla densa útil. |
| Crear | Dar de alta cliente | Alta rápida/Nuevo/ARCA | Acciones y alcances solapados | essential decision | Unificar intención. |
| Mantener | Corregir datos | ABM completo | Demasiado peso dentro de POS | essential decision | Separar flujo administrativo. |

## Target Modern Flow

| Step | Modern behavior | Surface | User decision | Validation / recovery | Notes |
| --- | --- | --- | --- | --- | --- |
| Buscar y filtrar | Encontrar por identidad fiscal o comercial | Listado dominante | Elegir cliente | Estado sin resultados permite limpiar | Acciones visibles por fila. |
| Consultar | Abrir resumen fiscal, contacto y comercial | Drawer detalle | Editar, ver cuenta o cerrar | Sin perder listado | Cuenta corriente es flujo relacionado. |
| Crear | Completar identidad mínima y secciones necesarias | Drawer guiado | Datos fiscales/comerciales | Validación temprana y consulta ARCA si existe | No es alta contextual del POS. |
| Editar | Modificar datos con impacto visible | Drawer | Confirmar cambios | Advertir dependencias y auditoría | Baja física pendiente. |

## Screens / Surfaces

| Surface | Legacy source | Modern destination | Pattern | Status |
| --- | --- | --- | --- | --- |
| Clientes | ABM/Consulta Clientes | `CustomersWorkspace` | list-detail workspace | prototype-built |
| Alta/edición | Formularios legacy | Drawer guiado | formulario seccionado | prototype-built |

## Entry Points

- `Ventas > Clientes`.
- Alta/selección contextual desde POS mediante `alta-cliente-en-caja`.

## Exit Points

- Cliente creado o actualizado.
- Cuenta corriente, documentos o cobros del cliente.
- Retorno al POS con cliente seleccionado cuando el origen sea contextual.

## Blocking Dependencies

| Dependency | Type | Blocking? | Current status | Notes |
| --- | --- | --- | --- | --- |
| ARCA y datos fiscales | integration | yes for production | simulated/partial | Condición fiscal impacta facturación. |
| Cuenta corriente y documentos | flow | no for CRUD | prototype | Entradas contextuales. |
| Permisos y política de baja | permission | yes | needs-user-validation | Registros históricos. |

## Data And Rules

- Core entities: Cliente, Identificación fiscal, Domicilio, Contacto, Impuesto, Condición comercial.
- Required data: identidad y tratamiento fiscal suficiente para facturar; mínimos exactos por condición pendientes.
- Visible business rules: `Crear cliente` reemplaza Alta rápida/Nuevo; Consumidor Final puede conservar identificación cargada.
- Recovery behavior: conservar borrador y contexto de origen; no eliminar registros usados sin explicar impacto.

## UX Decisions

| Decision | Rationale | Confirmation |
| --- | --- | --- |
| Tabla dominante y drawers bajo demanda | Prioriza consulta y preserva contexto | user-confirmed |
| Separar ABM completo de alta fiscal contextual | Reduce fricción en caja | user-confirmed |
| Identificación fiscal dentro del alta mínima | Impacta el comprobante | user-confirmed |

## Open Questions

| Question | Risk if unresolved | Blocking? |
| --- | --- | --- |
| ¿Qué datos son obligatorios por condición fiscal? | Cliente no facturable | yes |
| ¿Cómo se actualiza desde ARCA y qué puede editar el usuario? | Datos fiscales inconsistentes | yes |
| ¿Se elimina, deshabilita o fusiona un duplicado? | Pérdida histórica | yes |

## Views To Build

| View ID | Purpose | Handoff path | Destination | Status |
| --- | --- | --- | --- | --- |
| clientes | Mantener clientes completos | `docs/product-redesign/views/clientes.md` | `entity-workspaces.tsx` | prototype-built |
