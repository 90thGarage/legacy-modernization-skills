# Product Context

## Research Status

- Current version: `documentation-harness-v0.2` (2026-08-17).
- Initial research sources:
  - `../../../im-redesign/templates/skills/ux-context/research/minuta-tecnica-demo-im5-2026-07-08.md` (`demo-confirmed`).
  - `../../../im-redesign/templates/skills/ux-context/research/cobertura-guia-demo-im5-2026-07-08.md` (`needs-user-validation` / `open-question`).
- Additional evidence: decisiones del cliente registradas en `docs/product-redesign/registry.md`, contratos de `docs/product-redesign/views/`, briefs/handoffs de `docs/ux/`, notas de implementacion y comportamiento observable en `skill-flow-test/next-sandbox`.
- Local purpose: fuente global de verdad para consultar el producto, analizar ideas nuevas, mantener flujos y orientar el prototipo.
- Documentation model: ver `docs/ux/flows/README.md`. La confianza documental y el estado de entrega son ejes separados.
- Strong prototype coverage: acceso demo, navegacion, dashboard financiero, POS y sus subflujos, catalogo, clientes, proveedores, depositos, rubros, documentos, pagos/cobros, cuenta corriente, presupuestos, etiquetas, consulta rapida y roles/permisos.
- Partial domain coverage: estados y efectos fiscales, contabilidad, stock real, compras end-to-end, cuenta corriente operativa, permisos efectivos, hardware e integraciones.
- Future coverage: produccion/costo, transferencias y ajustes de stock, cola operativa de ARCA y comportamiento real con usuarios bajo presion.
- Source confidence: alta para el comportamiento del prototipo; variable para reglas de produccion. Todo dato inferido debe conservar su etiqueta y pregunta abierta.

## Product Summary

- Product: InfoManager 5 (`demo-confirmed`).
- Industry / business type: software de gestion comercial y operativa para comercios chicos y medianos (`demo-confirmed`).
- Current legacy system: InfoManager 4, aplicacion de escritorio compatible con Windows (`demo-confirmed`).
- Modernization goal: migrar a web, celular y tablet sin romper reglas fiscales, operativas, hardware ni base de datos compartida con IM4 (`demo-confirmed`).
- Main operational pressure: venta rapida/POS en mostrador, con cliente pagando en el momento y posibles restricciones de caja, ARCA, pagos, stock y balanza (`demo-confirmed`).

## Users And Roles

| Role | Main jobs | Frequency | Pressure | Permissions / limits | Notes |
| --- | --- | --- | --- | --- | --- |
| Cajero / mostrador | Facturar rapido, elegir cliente, cargar productos, cobrar, imprimir, resolver cambios y rendiciones | `needs-user-validation` | Alta en hora pico (`needs-user-validation`) | Permisos para descuentos, editar, borrar, rendir y corregir caja (`demo-confirmed`) | La demo no valida atajos, volumen ni errores reales. |
| Vendedor | Atender en salon, quedar asociado a ventas o cotizaciones, cobrar comisiones | `demo-confirmed` | Media | Puede ser sugerido por usuario o seleccionado por cajera segun rubro (`demo-confirmed`) | En algunos rubros no se usa vendedor. |
| Administrador / encargado | Configurar clientes, impuestos, articulos, permisos, caja, rendiciones y auditoria | `demo-confirmed` | Media/alta | Puede ver mas opciones y corregir segun permiso (`demo-confirmed`) | La demo se hizo con usuario administrador. |
| Dueno | Controlar caja, retiros, faltantes/sobrantes y ventas | `demo-confirmed` | Media/alta | Acceso a rendiciones y control administrativo (`demo-confirmed`) | Necesita visibilidad cuando no esta en el negocio. |
| Administrativo | Validar datos fiscales, cargar clientes, controlar impuestos, facturacion completa o cuenta corriente futura | `demo-confirmed` / `future-scope` | Media | Permisos y responsabilidades pendientes de detalle (`open-question`) | Falta entrevista operativa. |
| Soporte / implementador | Configurar formatos, integraciones, balanza, certificados, licencia y parametros | `demo-inferred` | Variable | Acceso tecnico segun permisos (`open-question`) | No fue foco de la demo. |

## Business Domain

- Business vocabulary to preserve: venta, factura electronica, consumidor final, cliente, vendedor, articulo, rubro, subrubro, percepcion, Ingresos Brutos, IVA, ARCA, CAE, rendicion, cambio, balanza, PLU, stock, cuenta corriente (`demo-confirmed`).
- Technical terms to translate carefully: venta interna / informal, comprobante pendiente en lote, factura electronica, medio de rendicion, alta automatizada con ARCA (`demo-confirmed`).
- Terms to avoid: renombrar conceptos fiscales o de caja sin validacion; convertir estados fiscales en etiquetas genericas (`needs-user-validation`).
- Critical business concepts: fiscalizacion ARCA, certificado/licencia, percepciones, topes de consumidor final, permisos, auditoria por usuario/fecha/hora, stock, caja y pagos (`demo-confirmed`).

## Core Entities

| Entity | Meaning | Key fields | Common statuses | Related entities | Notes |
| --- | --- | --- | --- | --- | --- |
| Venta | Operacion de mostrador o comprobante de venta | cliente, vendedor, items, pagos, total, estado fiscal | interna grabada, enviada a ARCA, pendiente en lote, anulada (`demo-inferred`) | Cliente, Producto, Pago, Caja, ARCA | Estados exactos pendientes de confirmacion. |
| Cliente | Persona o entidad que compra | condicion fiscal, documento/CUIT, domicilio, impuestos, condiciones comerciales | consumidor final, responsable inscripto, monotributista, exento, identificado (`demo-confirmed`) | Venta, Impuesto, Cuenta corriente | ABM tiene mas datos que POS necesita. |
| Producto / articulo | Item vendido o gestionado | codigo, descripcion, precio, rubro, stock, PLU, serie/lote | activo, seriado, pesable, con receta (`demo-inferred`) | Venta, Stock, Rubro, Balanza | ABM articulos parcialmente cubierto. |
| Pago | Medio usado para cancelar la venta | medio, importe, plan, banco/billetera, confirmacion | efectivo, tarjeta, transferencia, Mercado Pago pendiente/confirmado (`demo-confirmed`) | Venta, Caja, ARCA | Multipago soportado. |
| Comprobante fiscal | Resultado fiscal de una venta | numero, CAE, vencimiento, QR, estado ARCA | emitido, pendiente en lote, sin CAE por falla (`demo-confirmed` / `demo-inferred`) | Venta, Cliente, ARCA | Falta estado formal exacto. |
| Rendicion | Control de caja por turno/retiro/cierre | tipo, usuario, fecha, medios declarados, diferencias | inicial, parcial, final (`demo-confirmed`) | Caja, Pago, Usuario | Listado actual muestra propias rendiciones en IM5. |
| Balanza | Hardware para productos pesables | modelo, conexion, PLU, peso, precio | conectada, no conectada, actualizable (`demo-inferred`) | Producto, Venta | Depende de marca/modelo/API. |
| Stock | Existencia afectada por venta, cambios, produccion o compras | producto, deposito, cantidad, movimiento | descontado, ajustado, producido (`demo-confirmed` / `future-scope`) | Producto, Cambio, Produccion, Compra | Reglas completas pendientes. |
| Usuario / permiso | Identidad y restricciones de operacion | usuario, perfil, vendedor asignado, permisos | admin, ventas/admin, usuario con permisos limitados (`demo-confirmed`) | Venta, Rendicion, Auditoria | Detalle fino pendiente. |
| Proveedor | Persona o entidad que abastece al comercio | razon social, CUIT, estado, impuestos, retenciones, configuracion contable | habilitado, deshabilitado (`prototype-confirmed`) | Documento de compra, Pago | Reglas fiscales y contables pendientes. |
| Documento comercial | Factura, nota o remito de compra o venta | contexto, familia, numero, contraparte, fecha, items, total, estado | estados reales pendientes (`prototype-confirmed` / `needs-user-validation`) | Cliente, Proveedor, Pago, Cobro, Stock, ARCA | La UI comparte estructura sin igualar efectos de dominio. |
| Presupuesto | Propuesta comercial sin efectos al guardarse | cliente, vigencia, condiciones, items, totales | borrador/vigente/vencido a validar (`prototype-confirmed`) | Cliente, Producto, Documento de venta | Conversion pendiente. |
| Cuenta corriente | Saldo y movimientos de una contraparte | periodo, moneda, movimientos, debitos, creditos, saldo | calculada/actualizada a validar (`prototype-confirmed`) | Cliente, Documento, Recibo | La vista actual es de solo lectura. |
| Deposito | Ubicacion operativa de stock | codigo, nombre, empresa/local, centro de costo, estado | habilitado, deshabilitado (`prototype-confirmed`) | Stock, Producto, Documento | Relaciones exactas pendientes. |
| Rubro / Subrubro | Clasificacion jerarquica de articulos | codigo, nombre, padre, estado, uso | activo, deshabilitado (`prototype-confirmed`) | Producto | Subrubro no existe sin Rubro. |
| Diseno de etiqueta | Plantilla reutilizable para imprimir datos de articulos | nombre, pagina, elementos, propiedades | borrador/guardado a validar (`prototype-confirmed`) | Producto, Lote de impresion | Persistencia real y formatos pendientes. |

## Current Product Problems

- Hard-to-find flows: varias capacidades viven como ventanas o accesos laterales; falta validar navegacion real por favoritos, menu o memoria (`needs-user-validation`).
- Slow workflows: alta completa de cliente desde POS puede ser pesada, especialmente en celular/tablet (`demo-confirmed` as observation, `needs-user-validation` operationally).
- Duplicated surfaces: IM5 tiene facturacion rapida y otra ventana futura/completa para cuenta corriente/factura/listado (`demo-confirmed`).
- Legacy workarounds: facturar internamente cuando ARCA falla y registrar despues en lote (`demo-confirmed`).
- Risky or unclear operations: descuentos, cambios, pagos con Mercado Pago, venta informal, factura pendiente, rendicion editable y percepciones mal configuradas (`demo-confirmed`).
- Training / adoption problems: no se relevaron atajos, errores reales ni criterios de exito con usuarios operativos (`open-question`).

## Modernization Principles

- Product-level UX principles: organizar por flujos operativos, no por modulo tecnico; preservar reglas fiscales, caja, stock y hardware (`demo-confirmed`).
- Operational strengths to preserve: POS rapido, consumidor final por defecto, lector/camara/balanza, favoritos, multipago, rendicion, registro/auditoria (`demo-confirmed`).
- Legacy friction to remove: abrir ABM completo de cliente para una necesidad fiscal minima en caja (`demo-confirmed` as UX observation).
- Decisions that should become defaults: Consumidor Final al iniciar venta; vendedor sugerido si el usuario lo tiene asignado; formatos/medios por configuracion (`demo-confirmed`).
- Decisions that must remain manual: seleccionar cliente fiscal, elegir medio de pago, autorizar descuentos, confirmar cambios, corregir rendicion, emitir/fiscalizar cuando corresponde (`demo-confirmed` / `open-question` for permission detail).

## Global UX Rules

- Navigation: perfiles de ventas/admin pueden entrar directo a facturacion de ventas (`demo-confirmed`); navegacion real, favoritos de menu y multiples pestanas quedan pendientes (`open-question`).
- Search / lookup: productos se cargan por lector, descripcion, camara o favoritos; clientes se eligen de grilla/listado o alta manual/ARCA (`demo-confirmed`).
- Data entry: POS debe pedir solo datos necesarios para vender; ABM completo conserva datos comerciales, impositivos, contactos, acuerdos y domicilios (`demo-confirmed`).
- Validation: reglas fiscales, topes de consumidor final, datos impositivos, certificado/licencia y percepciones deben bloquear o advertir temprano (`demo-confirmed` / `open-question` for exact blockers).
- Error recovery: si falla ARCA, la venta puede quedar interna/pendiente en lote sin CAE ni numero fiscal (`demo-confirmed`).
- Empty / loading / partial states: no cubierto en la demo; definir despues (`open-question`).
- Destructive actions: editar/borrar y correcciones deben depender de permisos y auditoria (`demo-confirmed`).
- Audit / fiscal / compliance: cada registro guarda usuario, fecha y hora de creacion, edicion o borrado (`demo-confirmed`).
- Mobile / responsive: IM5 apunta a celular/tablet, con camara y posible balanza Wi-Fi; uso real por dispositivo pendiente (`demo-confirmed` / `needs-user-validation`).
- Space and hierarchy: las vistas deben recuperar el ancho disponible cuando termina un panel contextual; no se reservan columnas vacias mientras el trabajo principal continua. En formularios secuenciales, la accion de finalizacion sigue al ultimo dato requerido y puede permanecer visible en una barra inferior sticky.

## Navigation Model

- Main product areas: Dashboard, Ventas, Compras, Catalogo y Stock (`prototype-confirmed`).
- Ventas: Facturacion rapida, Facturacion avanzada, Presupuestos, documentos por familia, Cobros, Cuenta corriente y Clientes.
- Compras: documentos por familia, Pagos y Proveedores.
- Catalogo: Articulos, Rubros, Consulta rapida, Diseno de etiquetas e Impresion de etiquetas.
- Stock: Depositos. Transferencias, ajustes y produccion/costo todavia no tienen un flujo moderno completo.
- Primary navigation: el sidebar se organiza por areas de negocio; ambos perfiles demo entran directamente a POS.
- Secondary navigation: acciones contextuales desde POS a cliente, cambio y caja; desde Clientes a Cuenta corriente; desde Impresion a Diseno de etiquetas; desde Articulos a Rubros.
- Cross-flow rule: cuando una tarea secundaria crea o selecciona un registro, debe volver al origen conservando el borrador y aplicar el resultado cuando sea seguro.
- Access rule: sidebar y navegacion programatica consumen la misma regla de acceso; la implementacion actual es una simulacion y no reemplaza autorizacion backend.

## Main User Journeys

| Journey | Primary role | Goal | Current pain | Target outcome | Related flows |
| --- | --- | --- | --- | --- | --- |
| Acceso al trabajo | Todo usuario | Entrar a la empresa y vista permitidas | Sesion y base real no integradas | Acceso coherente por rol y contexto | acceso-y-sesion, roles-y-permisos |
| Control financiero | Dueno / administrador | Detectar posicion, vencimientos y riesgos | Formulas y permisos pendientes | Dashboard de lectura con detalle contextual | dashboard-financiero |
| Venta mostrador rapida | Cajero / mostrador | Cargar productos, cobrar y emitir o registrar venta | Falta validar hora pico, atajos y recuperacion de errores | POS de primer viewport con cliente, items, total, pago y estado fiscal claros | facturacion-rapida-pos, cobro-y-fiscalizacion |
| Cliente fiscal en caja | Cajero / administrativo | Identificar cliente para factura A, monotributo, exento o tope consumidor final | Alta completa puede ser pesada en POS | Alta fiscal minima o consulta ARCA sin abrir ABM completo | alta-cliente-en-caja |
| Cobro y fiscalizacion | Cajero | Elegir medio(s), confirmar pago y fiscalizar cuando corresponde | Estados de ARCA y fallas deben ser claros | Flujo de pago con estado fiscal visible y recuperacion | cobro-y-fiscalizacion, factura-pendiente-arca |
| Cambio simple de mostrador | Cajero / encargado | Cambiar producto y ajustar diferencia/stock | No reemplaza nota de credito en casos mayores | Flujo acotado para cambio simple con diferencia y stock | cambios-producto |
| Control de caja | Cajero / dueno / administrador | Abrir, retirar y cerrar caja; comparar declarado vs sistema | Falta validar correcciones reales y permisos | Rendicion inicial/parcial/final con diferencias claras | rendicion-caja |
| Producto pesable | Cajero / mostrador | Capturar peso desde balanza y vender productos por kilo/gramo | Depende de modelo/conexion; falta uso real en local | Balanza integrada al item entry y estado de hardware claro | balanza-en-venta |
| Comprobante detallado | Administrativo / encargado | Preparar y emitir una factura completa | Campos y extensiones legacy compiten | Cabecera, items y resumen configurables con reglas comunes | facturacion-avanzada |
| Propuesta comercial | Vendedor / administrativo | Crear y mantener presupuesto | Guardar puede confundirse con facturar | Presupuesto sin efectos hasta conversion explicita | presupuestos-venta |
| Documentacion comercial | Administrativo | Consultar o generar factura, nota o remito | Formularios y destinos duplicados | Workspace adaptable por compra/venta y tipo | documentos-comerciales |
| Movimiento de dinero administrativo | Administrativo / tesoreria | Registrar pago o cobro fuera del POS | Reglas de imputacion incompletas | Flujos separados con superficies coherentes | pagos-proveedores, cobros-clientes |
| Estado de cuenta | Administrativo / dueno | Explicar el saldo de un cliente | Cuenta corriente y Saldos duplicables | Consulta de solo lectura con criterios y movimientos | cuenta-corriente-clientes |
| Mantenimiento de contrapartes | Administrativo | Mantener clientes y proveedores | ABM completos y consultas fragmentados | Listados dominantes con edicion bajo demanda | gestion-clientes, gestion-proveedores |
| Mantenimiento de articulos | Administrativo / encargado | Crear, clasificar y configurar productos | ABM y submodulos parcialmente cubiertos | Catalogo/articulos con clasificacion, etiquetas, series, balanza y caracteristicas | catalogo-articulos |
| Clasificacion de articulos | Administrativo | Mantener rubros e hijos | Padre e hijos pueden perder contexto | ABM jerarquico con retorno a Articulos | rubros-subrubros |
| Consulta de precio | Cliente / soporte | Obtener precio sin asistencia | Shell y estados administrativos interfieren | Kiosco dedicado con input siempre listo | consulta-rapida-autoservicio |
| Etiquetado | Operativo / administrativo | Disenar plantilla y luego imprimir un lote | Configuracion y operacion mezclables | Dos flujos relacionados con retorno contextual | diseno-etiquetas, impresion-etiquetas |

## Flow Inventory

| Flow | Documentation | Delivery | Primary users | Main dependencies | Notes |
| --- | --- | --- | --- | --- | --- |
| [`acceso-y-sesion`](flows/acceso-y-sesion.md) | partially-confirmed | prototype-built | Todo usuario | identidad, empresa/base, permisos | Credenciales y sesion reales pendientes. |
| [`roles-y-permisos`](flows/roles-y-permisos.md) | inferred | prototype-built | Administrador | usuarios, roles, auditoria, backend auth | UI demo no aplica seguridad real. |
| [`dashboard-financiero`](flows/dashboard-financiero.md) | partially-confirmed | prototype-built | Dueno, administrador | formulas, empresas, documentos | Solo lectura; formulas pendientes. |
| [`facturacion-rapida-pos`](flows/facturacion-rapida-pos.md) | partially-confirmed | prototype-built | Cajero, mostrador | caja, productos, cliente, pagos, ARCA | Falta validar uso bajo presion. |
| [`alta-cliente-en-caja`](flows/alta-cliente-en-caja.md) | partially-confirmed | prototype-built | Cajero, administrativo | ARCA, condicion fiscal, topes | Minimos fiscales pendientes. |
| [`cobro-y-fiscalizacion`](flows/cobro-y-fiscalizacion.md) | partially-confirmed | prototype-built | Cajero | medios, ARCA, impresora | Estados exactos pendientes. |
| [`factura-pendiente-arca`](flows/factura-pendiente-arca.md) | partially-confirmed | prototype-partial | Cajero, administrador | certificado, conexion, cola | Falta workspace de reintento. |
| [`cambios-producto`](flows/cambios-producto.md) | partially-confirmed | prototype-built | Cajero, encargado | stock, pagos, permisos, notas | No cubre casos mayores. |
| [`rendicion-caja`](flows/rendicion-caja.md) | partially-confirmed | prototype-built | Cajero, dueno | medios, auditoria, permisos | Operacion real pendiente de validar. |
| [`balanza-en-venta`](flows/balanza-en-venta.md) | partially-confirmed | prototype-built | Cajero, mostrador | hardware, PLU, precio | Hardware simulado. |
| [`facturacion-avanzada`](flows/facturacion-avanzada.md) | partially-confirmed | prototype-built | Administrativo, encargado | fiscal, stock, pagos, remitos | Emision real no integrada. |
| [`presupuestos-venta`](flows/presupuestos-venta.md) | partially-confirmed | prototype-built | Vendedor, administrativo | cliente, precios, conversion | Guardar no genera efectos. |
| [`documentos-comerciales`](flows/documentos-comerciales.md) | partially-confirmed | prototype-built | Administrativo | tipos, estados, fiscal, stock, contabilidad | Compra/venta comparten UI, no efectos. |
| [`pagos-proveedores`](flows/pagos-proveedores.md) | inferred | prototype-built | Administrativo, tesoreria | deuda, medios, aprobacion | Registro simulado. |
| [`cobros-clientes`](flows/cobros-clientes.md) | inferred | prototype-built | Cajero, administrativo | cuenta, medios, imputacion | Registro simulado. |
| [`cuenta-corriente-clientes`](flows/cuenta-corriente-clientes.md) | partially-confirmed | prototype-built | Administrativo, dueno | documentos, recibos, saldos | Consulta de solo lectura. |
| [`gestion-clientes`](flows/gestion-clientes.md) | partially-confirmed | prototype-built | Administrativo | datos fiscales, ARCA, permisos | ABM completo separado del alta en caja. |
| [`gestion-proveedores`](flows/gestion-proveedores.md) | inferred | prototype-built | Administrativo | datos fiscales, compras, pagos | Dominio completo de compras pendiente. |
| [`catalogo-articulos`](flows/catalogo-articulos.md) | partially-confirmed | prototype-built | Administrativo, encargado | rubros, stock, series, balanza | `catalogo-productos` queda como alias. |
| [`rubros-subrubros`](flows/rubros-subrubros.md) | partially-confirmed | prototype-built | Administrativo | articulos, politica de baja | Arquitectura jerarquica confirmada. |
| [`gestion-depositos`](flows/gestion-depositos.md) | partially-confirmed | prototype-built | Administrativo, stock | stock, local, centro de costo | Movimientos fuera de alcance. |
| [`consulta-rapida-autoservicio`](flows/consulta-rapida-autoservicio.md) | partially-confirmed | prototype-built | Cliente, soporte | precios, terminal, lector/camara | Kiosco sin shell. |
| [`diseno-etiquetas`](flows/diseno-etiquetas.md) | partially-confirmed | prototype-built | Administrativo, soporte | formatos, propiedades, permisos | Persistencia local. |
| [`impresion-etiquetas`](flows/impresion-etiquetas.md) | partially-confirmed | prototype-built | Operativo, administrativo | diseno, impresora, balanza | Impresion real depende del sistema. |

### Future Or Unmapped Scope

| Area | Current status | Why it is not a documented current flow |
| --- | --- | --- |
| Compra end-to-end | partial domain evidence | Existen documentos, pagos y proveedores en el prototipo, pero falta el recorrido completo y sus efectos de stock/costo/cuenta. |
| Produccion y costo | future-scope | Solo aparece como capacidad relacionada de Articulos. |
| Transferencias y ajustes de stock | not mapped | Depositos existe como maestro; los movimientos no fueron relevados. |
| Cola operativa de ARCA | prototype-partial | El POS representa el pendiente, pero no existe todavia la gestion completa de reintentos. |

## Reusable Product Patterns

| Pattern | Use when | Shared behavior | Related flows | Notes |
| --- | --- | --- | --- | --- |
| POS critical viewport | Venta mostrador y cobro rapido | Cliente actual, item entry, carrito/lista, total, medio de pago y estado fiscal visibles | facturacion-rapida-pos, cobro-y-fiscalizacion | Validar atajos y layout con cajeros. |
| Alta contextual minima | Una venta requiere crear dato faltante sin abandonar flujo | Capturar minimo necesario, consultar ARCA si aplica, guardar y volver seleccionado | alta-cliente-en-caja | No reemplaza ABM completo. |
| Fiscal state and recovery | ARCA/certificado/licencia puede fallar | Estado visible, consecuencia clara, pendiente/reintento, no perder venta | cobro-y-fiscalizacion, factura-pendiente-arca | Estados exactos pendientes. |
| Audit-aware correction | Cambios, descuentos, rendiciones o stock requieren trazabilidad | Permisos, motivo/contexto, usuario/fecha/hora, recuperacion | cambios-producto, rendicion-caja | Detalle de permisos pendiente. |
| Hardware-aware input | Lector, camara, balanza o impresora participan en el flujo | Estado de dispositivo, fallback manual, no bloquear sin mensaje | facturacion-rapida-pos, balanza-en-venta | Depende de rubro/modelo. |
| Formulario simple | Una creacion o edicion necesita pocos campos y una unica finalizacion | Campos agrupados, validacion inline y accion especifica al pie | gestion-depositos y futuras cargas breves | Contrato en `docs/product-redesign/patterns/formulario-simple.md`. |
| Formulario seccionado | Una carga extensa combina decisiones, secciones o capacidades opcionales | Orden de carga claro, secciones semanticas y finalizacion comun al pie | catalogo-articulos, gestion-clientes, gestion-proveedores | Contrato en `docs/product-redesign/patterns/formulario-seccionado.md`. |
| ABM jerarquico | Una clasificacion padre contiene hijos que no tienen sentido sin su contexto | Listado dominante de padres, drawer con datos + coleccion hija y alta contextual | rubros-subrubros | Contrato en `docs/product-redesign/patterns/abm-jerarquico.md`. |
| ABM simple | Entidad con pocos campos y relaciones limitadas | Listado dominante, detalle contextual, formulario corto y baja segura | gestion-depositos y futuros maestros simples | Contrato inicial en `docs/product-redesign/patterns/abm-simple.md`. |
| ABM compuesto | Entidad con secciones, hijos o configuracion dependiente | Identidad minima, edicion progresiva, hijos contextuales y guardado explicito | catalogo-articulos, gestion-proveedores | Contrato inicial en `docs/product-redesign/patterns/abm-compuesto.md`. |
| Documento transaccional | Operacion con cabecera, items, importes y estados | Total y bloqueos visibles, transiciones explicitas, trazabilidad y recuperacion | facturacion-avanzada, presupuestos-venta, documentos-comerciales | Reglas por documento todavia requieren evidencia. |
| Consulta y reporte | Lectura, filtro, comparacion, resumen o exportacion | Filtros persistentes, resultados dominantes, detalle contextual y exportacion coherente | dashboard-financiero, cuenta-corriente-clientes | Prioridades y formulas reales pendientes. |

## Permissions And Risk Model

| Capability | Risk | Allowed roles | Confirmation / recovery | Notes |
| --- | --- | --- | --- | --- |
| Editar o borrar registros | destructive | Segun permisos | Auditoria usuario/fecha/hora | `demo-confirmed`; detalle pendiente. |
| Aplicar descuentos | risky | Usuario autorizado | Mostrar autorizacion o bloqueo | `demo-confirmed`; frecuencia pendiente. |
| Facturar electronicamente | irreversible / fiscal | Cajero autorizado / sistema configurado | CAE, QR, vencimiento; si falla queda pendiente | `demo-confirmed`. |
| Registrar venta interna/informal | risky / fiscal | Segun politica del comercio | No entra en informes ARCA si se eligio informal | `demo-confirmed`; requiere claridad UX. |
| Cambiar producto | risky | Cajero/encargado segun permiso | Compara precios, ajusta stock, cobra/devuelve diferencia | `demo-confirmed`. |
| Corregir rendicion | risky | Segun permisos | Comparar declarado vs sistema, registrar correccion | `demo-confirmed`; detalle pendiente. |
| Ajustar o afectar stock | risky | Segun flujo y permiso | Stock descontado por venta/cambio/produccion/compras | `demo-confirmed` / `future-scope`. |

## Known Legacy Anti-Patterns

- Abrir ABM completo cuando el flujo necesita solo datos minimos para continuar (`demo-confirmed`).
- Tratar falla fiscal como un detalle secundario aunque define si el comprobante tiene CAE/numero (`demo-confirmed`).
- Ocultar diferencias de caja o medios mal imputados hasta control administrativo (`demo-inferred`).
- Disenar desde modulos pendientes de IM4 sin evidencia operativa de IM5 (`future-scope`).
- Asumir uso de teclado, atajos o hora pico sin entrevista real (`needs-user-validation`).

## Decisions Already Made

| Decision | Applies to | Rationale | Status |
| --- | --- | --- | --- |
| IM5 debe soportar web, celular y tablet | Producto completo | Objetivo de migracion desde IM4 escritorio | demo-confirmed |
| IM4 e IM5 comparten base de datos | Producto completo | Compatibilidad y migracion gradual | demo-confirmed |
| Venta rapida arranca con Consumidor Final | facturacion-rapida-pos | Reduce pasos para venta comun | demo-confirmed |
| Perfil ventas/admin entra directo a facturacion | Navegacion / POS | Optimiza acceso al flujo principal | demo-confirmed |
| Usuario con vendedor asignado sugiere ese vendedor | Facturacion | Evita carga repetida cuando corresponde | demo-confirmed |
| Falla ARCA permite venta interna pendiente en lote | cobro-y-fiscalizacion | No perder operacion si falla conexion/certificado | demo-confirmed |
| Rendiciones se dividen en inicial, parcial y final | rendicion-caja | Control de caja por apertura/retiro/cierre | demo-confirmed |
| Los formularios secuenciales terminan con la accion primaria al pie del flujo y no en el header | Producto completo | Mantiene una direccion de avance intuitiva y evita obligar al usuario a volver hacia arriba | user-confirmed |
| Las secciones recuperan el ancho completo al terminar un panel contextual | Producto completo | Evita columnas muertas y aprovecha el espacio operativo disponible | user-confirmed |
| Los importes derivados de una tabla cierran esa tabla y no ocupan un resumen lateral sin funcion independiente | Documentos transaccionales y superficies operativas con items | Conserva el ancho de trabajo, mantiene juntos causa y resultado y evita duplicar el total dominante de la finalizacion | user-confirmed |
| Los reportes reutilizan la estructura de busqueda y filtros de Documentos; sus indicadores son opcionales y exportan el resultado actual | Consultas, reportes y listados de control | Evita inventar filtros por reporte y mantiene coherencia entre consulta, indicadores, tabla y archivos exportados | user-confirmed |
| Rubros y subrubros forman una jerarquia administrada en una sola superficie; Articulos usa selectores dependientes y puede crear clasificaciones sin perder su borrador | Catalogo, Articulos y futuras clasificaciones | Mantiene el contexto padre-hijo, evita ABM tecnicos desconectados y reduce abandonos durante el alta de articulos | user-confirmed |

## Open Product Questions

| Question | Risk if unresolved | Affected flows | Blocking? |
| --- | --- | --- | --- |
| Cuales son exactamente los estados de venta/factura en IM5 | UI puede mostrar estados incorrectos o incompletos | cobro-y-fiscalizacion, factura-pendiente-arca | yes |
| Donde se ve una factura pendiente por ARCA, quien la reintenta y que acciones permite | Pendientes fiscales pueden quedar invisibles | factura-pendiente-arca | yes |
| Como se corrige item, cantidad o descuento mal aplicado antes de cobrar | POS puede bloquear correcciones frecuentes | facturacion-rapida-pos | yes |
| Que validaciones concretas bloquean cobro o emision | Riesgo fiscal/operativo | facturacion-rapida-pos, cobro-y-fiscalizacion | yes |
| Que datos minimos pide alta rapida de cliente por condicion fiscal | Alta contextual puede ser insuficiente | alta-cliente-en-caja | yes |
| Que reglas de saldo, imputacion y vencimiento usa cuenta corriente | Evitar mostrar saldos incorrectos | cuenta-corriente-clientes, cobros-clientes, documentos-comerciales | yes |
| Cual es el flujo completo de compras y su impacto en stock/costo/cuenta corriente | No se puede modelar compra end-to-end | documentos-comerciales, pagos-proveedores, gestion-proveedores | yes |
| Que formulas, permisos y dimensiones usa el dashboard financiero | No presentar indicadores incorrectos o sensibles | dashboard-financiero | yes |
| Como se aplican pagos y cobros a documentos, anticipos y diferencias | Riesgo de saldos y movimientos incorrectos | pagos-proveedores, cobros-clientes, cuenta-corriente-clientes | yes |
| Que estados y efectos tiene cada documento comercial | Riesgo fiscal, contable y de stock | documentos-comerciales, facturacion-avanzada | yes |
| Cual es la taxonomia y alcance efectivo de roles | Navegacion y operaciones inconsistentes | acceso-y-sesion, roles-y-permisos | yes |
| Que atajos usa el cajero sin mirar | No romper memoria muscular | facturacion-rapida-pos | yes before final UI |
| Que frena en hora pico y cuantos items por venta | Diseno podria optimizar lo incorrecto | facturacion-rapida-pos | yes before final UI |

## Next Research Agenda

### Preguntas para Natalia / producto

1. Confirmar estados formales de venta/factura: interna, enviada a ARCA, pendiente en lote, anulada, pago pendiente, pago confirmado.
2. Explicar cola/lote de ARCA: ubicacion, permisos, reintentos, errores y acciones.
3. Listar validaciones bloqueantes de cobro/emision.
4. Definir alta minima de cliente por factura A, monotributo, exento y consumidor final identificado.
5. Delimitar cuenta corriente en IM5: venta, saldo, recibos, notas, pagos parciales.
6. Recorrer compras/proveedores de punta a punta.
7. Priorizar consultas/reportes indispensables.
8. Confirmar permisos finos para descuentos, borrar, corregir rendicion, cambiar productos y reintentar ARCA.

### Preguntas para usuarios operativos reales

1. Frecuencia real por tarea y volumen por hora/dia.
2. Atajos y secuencias que no se pueden romper.
3. Errores recientes concretos y costo operativo.
4. Que necesitan ver bajo presion.
5. Como retoman operaciones interrumpidas.
6. Que haria que la pantalla quede claramente mejor, en palabras del usuario.
