# Roles y permisos - Implementation Notes

## Status

- Implementado el 2026-08-03 como extensión interactiva de la configuración del prototipo InfoManager.
- Entrada: menú del usuario administrador, junto a `Perfil`, `Preferencias` y las opciones de apariencia.
- Componente: `../../skill-flow-test/next-sandbox/src/features/infomanager/components/roles-permissions-workspace.tsx`.
- Flow context: `./flows/roles-y-permisos.md`. Todavia no existe un `roles-permissions-ui-handoff.md`; esta implementación sigue el pedido de la conversación, las capturas de referencia de Discord y `product-context.md`.

## Product context applied

- `Usuario / permiso` se conserva como entidad del producto.
- La configuración de roles queda disponible solamente para el usuario administrador del prototipo.
- Se mantiene la separación entre visibilidad y operación: un rol puede ver una sección sin poder crear, modificar o eliminar registros.
- Los cambios destructivos, fiscales y de auditoría se expresan además como permisos sensibles.
- La interfaz aclara que `Ver` controla la aparición de la sección en la navegación.

## Implemented behavior

- Lista de roles existentes con nombre, color, cantidad de usuarios y estado de sistema.
- Creación mediante un modal previo: abrir o cancelar no altera la lista; confirmar nombre, descripción y color recién incorpora el rol y abre su pestaña `Permisos`.
- Duplicación directa de roles existentes.
- Eliminación disponible solamente para roles editables sin usuarios asignados.
- Pestaña `Datos del rol` con nombre, descripción, color y vista previa.
- Pestaña `Permisos` con:
  - búsqueda;
  - agrupación por Ventas, Compras, Catálogo y stock, y Administración;
  - capacidades independientes `Ver`, `Crear`, `Modificar` y `Eliminar`;
  - dependencia automática: habilitar una operación habilita `Ver`; quitar `Ver` quita las operaciones dependientes;
  - permisos sensibles para descuentos, factura electrónica, rendiciones, ARCA y administración de roles.
- Pestaña `Usuarios` para asignar miembros al rol.
- Orden de navegación orientado a la tarea principal: `Permisos`, `Usuarios` y, como tercera opción, `Datos del rol`.
- Guardado local del prototipo mediante `localStorage`.
- Rol `Administrador` protegido y visible en modo de consulta.

## Responsive behavior

- Desktop: lista lateral fija y matriz compacta de permisos.
- Tablet: lista lateral y permisos presentados como fichas de cuatro capacidades para evitar recortes.
- Mobile: roles en carrusel horizontal, editor apilado, fichas de permisos en dos columnas y barra de guardado siempre visible.

## shadcn and design system

- Componentes reutilizados: `Button`, `Badge`, `Checkbox`, `Dialog`, `Input`, `Tabs` y `Textarea`.
- Se conservaron radio de 4 px, densidad operativa, superficies neutras y azul primario del sistema existente.
- No se modificaron tokens ni estilos globales.
- Se reutiliza la tipografía ya configurada en el prototipo; no se agregaron fuentes nuevas.

## Assumptions and data gaps

- La taxonomía exacta de permisos de InfoManager continúa marcada como pendiente en `product-context.md`.
- Las áreas y capacidades se derivaron de la navegación actual del prototipo; deben validarse con producto antes de conectarlas al backend.
- Los permisos sensibles son una propuesta conservadora basada en riesgos ya documentados, no un contrato definitivo.
- Los usuarios, roles y cantidades son datos simulados.
- Guardar la configuración todavía no modifica `access-control.ts`; se evita presentar una maqueta como control de seguridad real.
- Falta definir herencia de roles, múltiples roles por usuario, prioridades, alcance por empresa/local y registro de auditoría.

## Verification

- Acceso desde el menú del administrador: pass.
- El rol Vendedor muestra `Ver Artículos` habilitado y `Crear Artículos` deshabilitado: pass.
- Abrir `Nuevo rol` mantiene intacta la lista hasta confirmar: pass.
- Cancelar el modal no crea un rol: pass.
- Confirmar crea el rol, lo selecciona y abre `Permisos`: pass.
- Modal de creación en `1440 x 900` y `390 x 844`, sin overflow horizontal y con acciones visibles: pass.
- `1440 x 900`: sin overflow horizontal y acción de guardado visible: pass.
- `768 x 1024`: cuatro capacidades visibles mediante fichas y sin overflow horizontal: pass.
- `390 x 844`: sin overflow horizontal y acción de guardado dentro del viewport: pass.
- `npm run lint`: pass.
- `npx tsc --noEmit`: pass.
- `npm run build`: pass.
