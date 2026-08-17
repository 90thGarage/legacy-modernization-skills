# Flow: Gestión de proveedores

## Goal

- Flow ID: `gestion-proveedores`.
- User goal: encontrar, consultar, crear y mantener proveedores usados en compras y pagos.
- Business outcome: contraparte fiscal, comercial y contable confiable para operaciones de compra.
- Documentation status: `inferred`.
- Delivery status: `prototype-built`.
- Evidence: contrato de vista, decisiones del cliente y prototipo; dominio completo de compras no relevado.

## Primary Users

| Role | Job in this flow | Frequency | Pressure | Notes |
| --- | --- | --- | --- | --- |
| Administrativo | Mantener datos fiscales y comerciales | Frecuente | Media | Usuario principal. |
| Compras / tesorería | Consultar proveedor antes de documento o pago | Frecuente | Media/alta | Roles no modelados en prototipo. |

## Current Legacy Flow

| Step | User goal | Legacy surface | Pain / friction | Step classification | Notes |
| --- | --- | --- | --- | --- | --- |
| Buscar | Encontrar proveedor | ABM/Consulta Proveedores | Superficies separadas | expert shortcut | Evidencia limitada. |
| Crear o editar | Preparar proveedor operativo | Formulario legacy | Datos de riesgo mezclados | essential decision | Capturas no disponibles. |

## Target Modern Flow

| Step | Modern behavior | Surface | User decision | Validation / recovery | Notes |
| --- | --- | --- | --- | --- | --- |
| Buscar y filtrar | Encontrar proveedor | Listado dominante | Elegir registro | Limpiar filtros | Acciones visibles. |
| Consultar | Revisar identidad, contacto y configuración | Drawer detalle | Editar o abrir flujo relacionado | Mantener listado | Datos sensibles secundarios. |
| Crear | Completar identidad fiscal y datos mínimos | Drawer guiado | Definir proveedor | Validar identificadores/duplicados | ARCA futura. |
| Configurar | Completar contabilidad, retenciones e impuestos | Secciones del drawer | Confirmar datos de riesgo | Advertencias y permisos | Reglas reales pendientes. |
| Guardar | Persistir intención completa | Barra inferior | Crear o guardar cambios | No ocultar errores dependientes | Prototipo local. |

## Screens / Surfaces

| Surface | Legacy source | Modern destination | Pattern | Status |
| --- | --- | --- | --- | --- |
| Proveedores | ABM/Consulta Proveedores | `SuppliersWorkspace` | list-detail workspace | prototype-built |
| Alta/edición | Formulario legacy no provisto | Drawer guiado | formulario seccionado | prototype-built |

## Entry Points

- `Compras > Proveedores`.
- Documento de compra o pago como entrada contextual futura.

## Exit Points

- Proveedor creado o actualizado.
- Documentos de compra y pagos relacionados.

## Blocking Dependencies

| Dependency | Type | Blocking? | Current status | Notes |
| --- | --- | --- | --- | --- |
| Dominio de compras | flow | yes for production | not mapped | Stock, costo y cuenta corriente. |
| Datos fiscales/retenciones | data / integration | yes | needs-user-validation | Tratados como datos de riesgo. |
| Permisos y baja | permission | yes | needs-user-validation | Historial y auditoría. |

## Data And Rules

- Core entities: Proveedor, Identificación fiscal, Contacto, Cuenta contable, Retención, Impuesto.
- Required data: identidad y estado habilitado; mínimos exactos pendientes.
- Visible business rules: configuración contable, retenciones e impuestos requieren jerarquía y advertencias.
- Recovery behavior: conservar borrador; no eliminar proveedor utilizado sin impacto y alternativa segura.

## UX Decisions

| Decision | Rationale | Confirmation |
| --- | --- | --- |
| Unificar Rápida/Nuevo como `Crear proveedor` | Una intención clara | user-confirmed |
| Tabla dominante con detalle/editor bajo demanda | Reduce carga visual | user-confirmed |
| Tratar configuración fiscal/contable como riesgosa | Puede afectar compras y pagos | user-confirmed |

## Open Questions

| Question | Risk if unresolved | Blocking? |
| --- | --- | --- |
| ¿Qué datos mínimos habilitan compras y pagos? | Proveedor operativo incompleto | yes |
| ¿Cómo funcionan retenciones, impuestos y cuentas por proveedor? | Registración incorrecta | yes |
| ¿Cómo se deshabilita o fusiona un proveedor usado? | Pérdida histórica | yes |

## Views To Build

| View ID | Purpose | Handoff path | Destination | Status |
| --- | --- | --- | --- | --- |
| proveedores | Mantener proveedores | `docs/product-redesign/views/proveedores.md` | `entity-workspaces.tsx` | prototype-built |
