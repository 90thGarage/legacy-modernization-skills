"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Check,
  Copy,
  LockKeyhole,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

type PermissionAction = "view" | "create" | "edit" | "delete"
type EditorTab = "details" | "permissions" | "members"

type AreaPermission = Record<PermissionAction, boolean>

type PrototypeRole = {
  id: string
  name: string
  description: string
  color: string
  system: boolean
  permissions: Record<string, AreaPermission>
  sensitivePermissions: Record<string, boolean>
  memberIds: string[]
}

type NewRoleDraft = Pick<PrototypeRole, "name" | "description" | "color">

type PermissionArea = {
  id: string
  label: string
  description: string
  actions: PermissionAction[]
}

type PermissionGroup = {
  id: string
  label: string
  areas: PermissionArea[]
}

const permissionActions: { id: PermissionAction; label: string }[] = [
  { id: "view", label: "Ver" },
  { id: "create", label: "Crear" },
  { id: "edit", label: "Modificar" },
  { id: "delete", label: "Eliminar" },
]

const permissionGroups: PermissionGroup[] = [
  {
    id: "sales",
    label: "Ventas",
    areas: [
      { id: "pos", label: "Facturación rápida", description: "Ventas de mostrador y cobro inmediato.", actions: ["view", "create", "edit", "delete"] },
      { id: "advanced-invoicing", label: "Facturación avanzada", description: "Comprobantes con datos fiscales y comerciales completos.", actions: ["view", "create", "edit", "delete"] },
      { id: "budgets", label: "Presupuestos", description: "Consulta y preparación de presupuestos.", actions: ["view", "create", "edit", "delete"] },
      { id: "sale-invoices", label: "Facturas", description: "Listado y administración de facturas emitidas.", actions: ["view", "create", "edit", "delete"] },
      { id: "sale-debit-notes", label: "Notas de débito", description: "Ajustes que incrementan importes facturados.", actions: ["view", "create", "edit", "delete"] },
      { id: "sale-credit-notes", label: "Notas de crédito", description: "Ajustes que reducen o corrigen importes facturados.", actions: ["view", "create", "edit", "delete"] },
      { id: "sale-delivery-notes", label: "Remitos", description: "Documentos vinculados a entrega de mercadería.", actions: ["view", "create", "edit", "delete"] },
      { id: "collections", label: "Cobros", description: "Recibos y aplicación de cobranzas.", actions: ["view", "create", "edit", "delete"] },
      { id: "customers", label: "Clientes", description: "Datos fiscales, comerciales y de contacto.", actions: ["view", "create", "edit", "delete"] },
    ],
  },
  {
    id: "purchases",
    label: "Compras",
    areas: [
      { id: "purchase-invoices", label: "Facturas", description: "Listado y administración de facturas recibidas.", actions: ["view", "create", "edit", "delete"] },
      { id: "purchase-debit-notes", label: "Notas de débito", description: "Ajustes de proveedores que incrementan importes facturados.", actions: ["view", "create", "edit", "delete"] },
      { id: "purchase-credit-notes", label: "Notas de crédito", description: "Ajustes de proveedores que reducen o corrigen importes facturados.", actions: ["view", "create", "edit", "delete"] },
      { id: "purchase-delivery-notes", label: "Remitos", description: "Documentos vinculados a recepción de mercadería.", actions: ["view", "create", "edit", "delete"] },
      { id: "payments", label: "Pagos", description: "Órdenes de pago y movimientos asociados.", actions: ["view", "create", "edit", "delete"] },
      { id: "suppliers", label: "Proveedores", description: "Datos fiscales y comerciales de proveedores.", actions: ["view", "create", "edit", "delete"] },
    ],
  },
  {
    id: "catalog",
    label: "Catálogo y stock",
    areas: [
      { id: "articles", label: "Artículos", description: "Catálogo, precios y configuración de productos.", actions: ["view", "create", "edit", "delete"] },
      { id: "categories", label: "Rubros", description: "Clasificación jerárquica de artículos.", actions: ["view", "create", "edit", "delete"] },
      { id: "labels", label: "Etiquetas", description: "Diseño e impresión de etiquetas.", actions: ["view", "create", "edit", "delete"] },
      { id: "warehouses", label: "Depósitos", description: "Ubicaciones y disponibilidad de stock.", actions: ["view", "create", "edit", "delete"] },
    ],
  },
  {
    id: "management",
    label: "Administración",
    areas: [
      { id: "dashboard", label: "Dashboard financiero", description: "Indicadores y situación financiera general.", actions: ["view"] },
      { id: "customer-account", label: "Cuenta corriente", description: "Saldos y movimientos de clientes.", actions: ["view", "create", "edit"] },
      { id: "role-settings", label: "Roles y permisos", description: "Creación de roles y asignación de accesos.", actions: ["view", "create", "edit", "delete"] },
    ],
  },
]

const sensitivePermissionDefinitions = [
  { id: "authorize-discounts", label: "Autorizar descuentos", description: "Permite superar los límites comerciales definidos para el usuario." },
  { id: "issue-electronic-invoices", label: "Emitir factura electrónica", description: "Autoriza operaciones fiscales que solicitan CAE a ARCA." },
  { id: "correct-cash-closings", label: "Corregir rendiciones", description: "Permite modificar diferencias y cierres de caja ya registrados." },
  { id: "retry-arca", label: "Reintentar comprobantes pendientes", description: "Permite volver a enviar comprobantes que quedaron pendientes de ARCA." },
  { id: "manage-roles", label: "Administrar roles", description: "Permite crear roles y cambiar permisos de otros usuarios." },
]

const roleColors = ["#0057FF", "#7C3AED", "#059669", "#D97706", "#DC2626", "#475569"]

const emptyRoleDescription = "Definí qué puede ver y hacer este rol dentro de InfoManager."

const prototypeMembers = [
  { id: "user-admin", name: "Administrador Demo", username: "admin", initials: "AD" },
  { id: "user-seller", name: "Vendedor Demo", username: "vendedor", initials: "VD" },
  { id: "user-cashier", name: "María Elena Paz", username: "mepaz", initials: "MP" },
  { id: "user-owner", name: "Nicolás Rivas", username: "nrivas", initials: "NR" },
]

function makeEmptyPermissions() {
  return Object.fromEntries(
    permissionGroups.flatMap((group) => group.areas).map((area) => [
      area.id,
      { view: false, create: false, edit: false, delete: false },
    ])
  ) as Record<string, AreaPermission>
}

function makeAllPermissions() {
  return Object.fromEntries(
    permissionGroups.flatMap((group) => group.areas).map((area) => [
      area.id,
      {
        view: area.actions.includes("view"),
        create: area.actions.includes("create"),
        edit: area.actions.includes("edit"),
        delete: area.actions.includes("delete"),
      },
    ])
  ) as Record<string, AreaPermission>
}

function buildInitialRoles(): PrototypeRole[] {
  const adminPermissions = makeAllPermissions()
  const sellerPermissions = makeEmptyPermissions()
  sellerPermissions.pos = { view: true, create: true, edit: false, delete: false }
  sellerPermissions.budgets = { view: true, create: true, edit: true, delete: false }
  sellerPermissions.articles = { view: true, create: false, edit: false, delete: false }
  sellerPermissions.customers = { view: true, create: true, edit: false, delete: false }

  const cashierPermissions = makeEmptyPermissions()
  cashierPermissions.pos = { view: true, create: true, edit: true, delete: false }
  cashierPermissions.articles = { view: true, create: false, edit: false, delete: false }
  cashierPermissions.customers = { view: true, create: true, edit: false, delete: false }
  cashierPermissions.collections = { view: true, create: true, edit: false, delete: false }

  const readOnlyPermissions = makeEmptyPermissions()
  ;["dashboard", "sale-invoices", "sale-debit-notes", "sale-credit-notes", "sale-delivery-notes", "articles", "customers", "customer-account"].forEach((areaId) => {
    readOnlyPermissions[areaId].view = true
  })

  return [
    {
      id: "administrator",
      name: "Administrador",
      description: "Acceso total al producto y a su configuración.",
      color: "#0057FF",
      system: true,
      permissions: adminPermissions,
      sensitivePermissions: Object.fromEntries(sensitivePermissionDefinitions.map((permission) => [permission.id, true])),
      memberIds: ["user-admin"],
    },
    {
      id: "seller",
      name: "Vendedor",
      description: "Puede vender, preparar presupuestos y consultar el catálogo.",
      color: "#7C3AED",
      system: false,
      permissions: sellerPermissions,
      sensitivePermissions: {
        "authorize-discounts": false,
        "issue-electronic-invoices": true,
        "correct-cash-closings": false,
        "retry-arca": false,
        "manage-roles": false,
      },
      memberIds: ["user-seller"],
    },
    {
      id: "cashier",
      name: "Caja",
      description: "Operación de mostrador con acceso limitado a datos maestros.",
      color: "#059669",
      system: false,
      permissions: cashierPermissions,
      sensitivePermissions: {
        "authorize-discounts": false,
        "issue-electronic-invoices": true,
        "correct-cash-closings": false,
        "retry-arca": false,
        "manage-roles": false,
      },
      memberIds: ["user-cashier"],
    },
    {
      id: "read-only",
      name: "Solo lectura",
      description: "Consulta información sin crear ni modificar registros.",
      color: "#475569",
      system: false,
      permissions: readOnlyPermissions,
      sensitivePermissions: Object.fromEntries(sensitivePermissionDefinitions.map((permission) => [permission.id, false])),
      memberIds: ["user-owner"],
    },
  ]
}

function loadSavedRoles() {
  if (typeof window === "undefined") return buildInitialRoles()
  try {
    const stored = window.localStorage.getItem("infomanager-prototype-roles")
    return stored ? (JSON.parse(stored) as PrototypeRole[]) : buildInitialRoles()
  } catch {
    return buildInitialRoles()
  }
}

function PermissionCheckbox({
  checked,
  disabled,
  label,
  onCheckedChange,
}: {
  checked: boolean
  disabled: boolean
  label: string
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <label className={cn("flex items-center gap-2", disabled && "cursor-not-allowed opacity-45")}>
      <Checkbox
        checked={checked}
        disabled={disabled}
        aria-label={label}
        onCheckedChange={(value) => onCheckedChange(value === true)}
      />
      <span className="text-xs lg:sr-only">{label}</span>
    </label>
  )
}

export function RolesPermissionsWorkspace() {
  const [roles, setRoles] = useState<PrototypeRole[]>(loadSavedRoles)
  const [savedRoles, setSavedRoles] = useState<PrototypeRole[]>(loadSavedRoles)
  const [selectedRoleId, setSelectedRoleId] = useState(() => loadSavedRoles()[1]?.id ?? "administrator")
  const [activeTab, setActiveTab] = useState<EditorTab>("permissions")
  const [permissionQuery, setPermissionQuery] = useState("")
  const [notice, setNotice] = useState("")
  const [isCreateRoleOpen, setIsCreateRoleOpen] = useState(false)
  const [newRoleDraft, setNewRoleDraft] = useState<NewRoleDraft>({
    name: "Nuevo rol",
    description: emptyRoleDescription,
    color: roleColors[0],
  })

  const selectedRole = roles.find((role) => role.id === selectedRoleId) ?? roles[0]
  const isDirty = JSON.stringify(roles) !== JSON.stringify(savedRoles)

  useEffect(() => {
    if (!notice) return
    const timeout = window.setTimeout(() => setNotice(""), 3000)
    return () => window.clearTimeout(timeout)
  }, [notice])

  const filteredPermissionGroups = useMemo(() => {
    const normalizedQuery = permissionQuery.trim().toLocaleLowerCase("es")
    if (!normalizedQuery) return permissionGroups
    return permissionGroups
      .map((group) => ({
        ...group,
        areas: group.areas.filter((area) =>
          `${group.label} ${area.label} ${area.description}`.toLocaleLowerCase("es").includes(normalizedQuery)
        ),
      }))
      .filter((group) => group.areas.length)
  }, [permissionQuery])

  const updateSelectedRole = (updater: (role: PrototypeRole) => PrototypeRole) => {
    if (!selectedRole || selectedRole.system) return
    setRoles((current) => current.map((role) => role.id === selectedRole.id ? updater(role) : role))
  }

  const toggleAreaPermission = (areaId: string, action: PermissionAction, checked: boolean) => {
    updateSelectedRole((role) => {
      const nextArea = { ...role.permissions[areaId], [action]: checked }
      if (action === "view" && !checked) {
        nextArea.create = false
        nextArea.edit = false
        nextArea.delete = false
      } else if (action !== "view" && checked) {
        nextArea.view = true
      }
      return { ...role, permissions: { ...role.permissions, [areaId]: nextArea } }
    })
  }

  const openCreateRole = () => {
    const suffix = roles.filter((role) => role.name.startsWith("Nuevo rol")).length + 1
    setNewRoleDraft({
      name: suffix === 1 ? "Nuevo rol" : `Nuevo rol ${suffix}`,
      description: emptyRoleDescription,
      color: roleColors[0],
    })
    setIsCreateRoleOpen(true)
  }

  const createRole = () => {
    const roleName = newRoleDraft.name.trim()
    if (!roleName) return

    const role: PrototypeRole = {
      id: `role-${Date.now()}`,
      name: roleName,
      description: newRoleDraft.description.trim() || emptyRoleDescription,
      color: newRoleDraft.color,
      system: false,
      permissions: makeEmptyPermissions(),
      sensitivePermissions: Object.fromEntries(sensitivePermissionDefinitions.map((permission) => [permission.id, false])),
      memberIds: [],
    }
    setRoles((current) => [...current, role])
    setSelectedRoleId(role.id)
    setActiveTab("permissions")
    setIsCreateRoleOpen(false)
  }

  const duplicateSelectedRole = () => {
    if (!selectedRole) return
    const duplicate: PrototypeRole = {
      ...selectedRole,
      id: `role-${Date.now()}`,
      name: `${selectedRole.name} · copia`,
      system: false,
      permissions: Object.fromEntries(Object.entries(selectedRole.permissions).map(([key, value]) => [key, { ...value }])),
      sensitivePermissions: { ...selectedRole.sensitivePermissions },
      memberIds: [],
    }
    setRoles((current) => [...current, duplicate])
    setSelectedRoleId(duplicate.id)
    setActiveTab("permissions")
  }

  const deleteSelectedRole = () => {
    if (!selectedRole || selectedRole.system || selectedRole.memberIds.length) return
    const remaining = roles.filter((role) => role.id !== selectedRole.id)
    setRoles(remaining)
    setSelectedRoleId(remaining[0]?.id ?? "")
  }

  const saveRoles = () => {
    window.localStorage.setItem("infomanager-prototype-roles", JSON.stringify(roles))
    setSavedRoles(roles)
    setNotice("Roles y permisos guardados en el prototipo.")
  }

  const discardChanges = () => {
    setRoles(savedRoles)
    if (!savedRoles.some((role) => role.id === selectedRoleId)) {
      setSelectedRoleId(savedRoles[0]?.id ?? "")
    }
  }

  if (!selectedRole) return null

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden bg-muted/20">
      <div className="grid min-h-0 min-w-0 flex-1 md:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="flex min-h-0 min-w-0 flex-col overflow-hidden border-b bg-card md:border-r md:border-b-0">
          <div className="flex h-12 shrink-0 items-center justify-between border-b px-3">
            <div>
              <h2 className="text-sm font-semibold">Roles</h2>
              <p className="text-[10px] text-muted-foreground">{roles.length} configurados</p>
            </div>
            <Button size="icon-sm" variant="outline" aria-label="Crear rol" onClick={openCreateRole}>
              <Plus />
            </Button>
          </div>

          <div className="flex min-h-0 gap-2 overflow-x-auto p-2 md:grid md:flex-1 md:content-start md:overflow-y-auto">
            {roles.map((role) => (
              <button
                key={role.id}
                type="button"
                className={cn(
                  "flex min-w-44 items-center gap-2 rounded-[4px] border px-3 py-2 text-left md:min-w-0",
                  selectedRole.id === role.id ? "border-primary bg-primary/5" : "border-transparent hover:bg-muted"
                )}
                onClick={() => setSelectedRoleId(role.id)}
              >
                <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: role.color }} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-semibold">{role.name}</span>
                  <span className="block truncate text-[10px] text-muted-foreground">{role.memberIds.length} usuarios</span>
                </span>
                {role.system ? <LockKeyhole className="size-3.5 shrink-0 text-muted-foreground" /> : null}
              </button>
            ))}
          </div>
        </aside>

        <main className="flex min-h-0 min-w-0 flex-col bg-background">
          <div className="flex min-h-14 shrink-0 flex-wrap items-center justify-between gap-2 border-b bg-card px-3 py-2 md:px-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className="size-3 shrink-0 rounded-full" style={{ backgroundColor: selectedRole.color }} />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-base font-semibold">{selectedRole.name}</h2>
                  {selectedRole.system ? <Badge variant="outline" className="h-5 font-mono text-[9px]">Sistema</Badge> : null}
                </div>
                <p className="truncate text-[10px] text-muted-foreground">{selectedRole.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Button variant="outline" size="sm" onClick={duplicateSelectedRole}><Copy />Duplicar</Button>
              <Button
                variant="outline"
                size="icon-sm"
                aria-label="Eliminar rol"
                disabled={selectedRole.system || selectedRole.memberIds.length > 0}
                onClick={deleteSelectedRole}
              >
                <Trash2 />
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as EditorTab)} className="flex min-h-0 flex-1 flex-col gap-0">
            <div className="shrink-0 overflow-x-auto border-b bg-card px-3 md:px-4">
              <TabsList variant="line" className="h-10 min-w-max">
                <TabsTrigger value="permissions">Permisos</TabsTrigger>
                <TabsTrigger value="members">Usuarios <Badge className="h-4 min-w-4 px-1 font-mono text-[9px]">{selectedRole.memberIds.length}</Badge></TabsTrigger>
                <TabsTrigger value="details">Datos del rol</TabsTrigger>
              </TabsList>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              {activeTab === "details" ? (
                <div className="mx-auto grid w-full max-w-4xl gap-5 p-4 md:p-6">
                  {selectedRole.system ? (
                    <div className="flex items-start gap-2 rounded-[4px] border bg-muted/30 p-3 text-xs text-muted-foreground">
                      <LockKeyhole className="mt-0.5 size-4 shrink-0" />
                      El rol Administrador pertenece al sistema. Podés consultar su alcance, pero no modificarlo.
                    </div>
                  ) : null}

                  <section className="grid gap-4 rounded-[4px] border bg-card p-4">
                    <div>
                      <h3 className="text-sm font-semibold">Identidad del rol</h3>
                      <p className="text-xs text-muted-foreground">El nombre será visible al asignar usuarios y revisar auditorías.</p>
                    </div>
                    <label className="grid gap-1.5">
                      <span className="font-mono text-[11px] font-semibold">Nombre del rol <span className="text-destructive">*</span></span>
                      <Input
                        value={selectedRole.name}
                        disabled={selectedRole.system}
                        className="h-10"
                        onChange={(event) => updateSelectedRole((role) => ({ ...role, name: event.target.value }))}
                      />
                    </label>
                    <label className="grid gap-1.5">
                      <span className="font-mono text-[11px] font-semibold">Descripción</span>
                      <Textarea
                        value={selectedRole.description}
                        disabled={selectedRole.system}
                        className="min-h-20 resize-none"
                        onChange={(event) => updateSelectedRole((role) => ({ ...role, description: event.target.value }))}
                      />
                    </label>
                  </section>

                  <section className="grid gap-4 rounded-[4px] border bg-card p-4">
                    <div>
                      <h3 className="text-sm font-semibold">Color identificador</h3>
                      <p className="text-xs text-muted-foreground">Ayuda a reconocer el rol en usuarios, permisos y registros de actividad.</p>
                    </div>
                    <div className="flex flex-wrap gap-2" role="group" aria-label="Color del rol">
                      {roleColors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          disabled={selectedRole.system}
                          aria-label={`Usar color ${color}`}
                          aria-pressed={selectedRole.color === color}
                          className={cn("grid size-10 place-items-center rounded-[4px] border-2", selectedRole.color === color ? "border-foreground" : "border-transparent")}
                          style={{ backgroundColor: color }}
                          onClick={() => updateSelectedRole((role) => ({ ...role, color }))}
                        >
                          {selectedRole.color === color ? <Check className="size-4 text-white" /> : null}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 rounded-[4px] border bg-muted/20 p-3">
                      <span className="grid size-9 place-items-center rounded-[4px] text-xs font-bold text-white" style={{ backgroundColor: selectedRole.color }}>{selectedRole.name.slice(0, 2).toLocaleUpperCase("es")}</span>
                      <div>
                        <div className="text-sm font-semibold">{selectedRole.name || "Sin nombre"}</div>
                        <div className="text-[10px] text-muted-foreground">{selectedRole.memberIds.length} usuarios asignados</div>
                      </div>
                    </div>
                  </section>
                </div>
              ) : null}

              {activeTab === "permissions" ? (
                <div className="grid gap-5 p-3 md:p-5">
                  <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
                    <div>
                      <h3 className="text-sm font-semibold">Acceso por área</h3>
                      <p className="mt-1 text-xs text-muted-foreground"><strong>Ver</strong> hace visible la sección en la navegación. Crear, Modificar y Eliminar controlan qué operaciones quedan habilitadas dentro de ella.</p>
                    </div>
                    <div className="relative w-full xl:w-80">
                      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input value={permissionQuery} onChange={(event) => setPermissionQuery(event.target.value)} placeholder="Buscar permisos" className="h-9 pl-9" />
                    </div>
                  </div>

                  {selectedRole.system ? (
                    <div className="flex items-start gap-2 rounded-[4px] border bg-muted/30 p-3 text-xs text-muted-foreground">
                      <LockKeyhole className="mt-0.5 size-4 shrink-0" />
                      El rol Administrador tiene todos los permisos y no puede restringirse.
                    </div>
                  ) : null}

                  {filteredPermissionGroups.length ? filteredPermissionGroups.map((group) => (
                    <section key={group.id} className="overflow-hidden rounded-[4px] border bg-card">
                      <div className="border-b bg-muted/25 px-3 py-2">
                        <h4 className="font-mono text-[11px] font-semibold uppercase tracking-wide">{group.label}</h4>
                      </div>

                      <div className="hidden lg:block">
                        <div className="grid grid-cols-[minmax(240px,1fr)_repeat(4,88px)] border-b bg-muted/10 px-3 py-2 font-mono text-[10px] font-semibold uppercase text-muted-foreground">
                          <span>Área del producto</span>
                          {permissionActions.map((action) => <span key={action.id} className="text-center">{action.label}</span>)}
                        </div>
                        {group.areas.map((area) => (
                          <div key={area.id} className="grid min-h-16 grid-cols-[minmax(240px,1fr)_repeat(4,88px)] items-center border-b px-3 py-2 last:border-b-0">
                            <div className="min-w-0 pr-4">
                              <div className="text-sm font-medium">{area.label}</div>
                              <div className="truncate text-[10px] text-muted-foreground">{area.description}</div>
                            </div>
                            {permissionActions.map((action) => (
                              <div key={action.id} className="grid place-items-center">
                                <PermissionCheckbox
                                  checked={selectedRole.permissions[area.id]?.[action.id] ?? false}
                                  disabled={selectedRole.system || !area.actions.includes(action.id)}
                                  label={`${action.label} ${area.label}`}
                                  onCheckedChange={(checked) => toggleAreaPermission(area.id, action.id, checked)}
                                />
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>

                      <div className="divide-y lg:hidden">
                        {group.areas.map((area) => (
                          <div key={area.id} className="grid gap-3 p-3">
                            <div>
                              <div className="text-sm font-medium">{area.label}</div>
                              <div className="text-[10px] text-muted-foreground">{area.description}</div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              {permissionActions.map((action) => (
                                <div key={action.id} className={cn("rounded-[4px] border p-2", !area.actions.includes(action.id) && "bg-muted/30")}>
                                  <PermissionCheckbox
                                    checked={selectedRole.permissions[area.id]?.[action.id] ?? false}
                                    disabled={selectedRole.system || !area.actions.includes(action.id)}
                                    label={action.label}
                                    onCheckedChange={(checked) => toggleAreaPermission(area.id, action.id, checked)}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )) : (
                    <div className="rounded-[4px] border border-dashed p-8 text-center text-sm text-muted-foreground">No encontramos permisos con esa búsqueda.</div>
                  )}

                  <section className="overflow-hidden rounded-[4px] border bg-card">
                    <div className="border-b bg-muted/25 px-3 py-2">
                      <h4 className="font-mono text-[11px] font-semibold uppercase tracking-wide">Acciones sensibles</h4>
                    </div>
                    <div className="grid lg:grid-cols-2">
                      {sensitivePermissionDefinitions.map((permission) => (
                        <label key={permission.id} className="flex min-h-20 items-start gap-3 border-b p-3 last:border-b-0 lg:border-r lg:nth-[2n]:border-r-0">
                          <Checkbox
                            checked={selectedRole.sensitivePermissions[permission.id] ?? false}
                            disabled={selectedRole.system}
                            onCheckedChange={(value) => updateSelectedRole((role) => ({
                              ...role,
                              sensitivePermissions: { ...role.sensitivePermissions, [permission.id]: value === true },
                            }))}
                          />
                          <span>
                            <span className="block text-sm font-medium">{permission.label}</span>
                            <span className="mt-1 block text-[10px] text-muted-foreground">{permission.description}</span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </section>
                </div>
              ) : null}

              {activeTab === "members" ? (
                <div className="mx-auto grid w-full max-w-4xl gap-4 p-4 md:p-6">
                  <div>
                    <h3 className="text-sm font-semibold">Usuarios asignados</h3>
                    <p className="mt-1 text-xs text-muted-foreground">Seleccioná quién recibirá los accesos de este rol. En el producto final, cada cambio deberá quedar auditado.</p>
                  </div>
                  <section className="divide-y overflow-hidden rounded-[4px] border bg-card">
                    {prototypeMembers.map((member) => {
                      const checked = selectedRole.memberIds.includes(member.id)
                      return (
                        <label key={member.id} className="flex items-center gap-3 p-3 hover:bg-muted/30">
                          <Checkbox
                            checked={checked}
                            disabled={selectedRole.system}
                            onCheckedChange={(value) => updateSelectedRole((role) => ({
                              ...role,
                              memberIds: value === true
                                ? [...role.memberIds, member.id]
                                : role.memberIds.filter((id) => id !== member.id),
                            }))}
                          />
                          <span className="grid size-9 shrink-0 place-items-center rounded-[4px] bg-muted font-mono text-xs font-bold">{member.initials}</span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium">{member.name}</span>
                            <span className="block truncate font-mono text-[10px] text-muted-foreground">@{member.username}</span>
                          </span>
                          {checked ? <Badge variant="outline" className="hidden font-mono text-[9px] sm:inline-flex">Asignado</Badge> : null}
                        </label>
                      )
                    })}
                  </section>
                </div>
              ) : null}
            </div>
          </Tabs>

          <footer className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t bg-card px-3 py-2 md:px-4">
            <div className="min-w-0 text-[10px] text-muted-foreground">
              {selectedRole.system ? "Rol protegido del sistema" : isDirty ? "Hay cambios sin guardar" : "Todos los cambios están guardados"}
              {selectedRole.memberIds.length && !selectedRole.system ? ` · ${selectedRole.memberIds.length} usuarios asignados` : ""}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" disabled={!isDirty} onClick={discardChanges}>Descartar</Button>
              <Button size="sm" disabled={!isDirty || !selectedRole.name.trim()} onClick={saveRoles}><ShieldCheck />Guardar cambios</Button>
            </div>
          </footer>
        </main>
      </div>

      {notice ? (
        <div role="status" className="fixed right-4 bottom-20 z-[80] flex items-center gap-2 rounded-[4px] border bg-popover px-3 py-2 text-xs shadow-xl md:bottom-4">
          <Check className="size-4 text-emerald-600" />
          {notice}
        </div>
      ) : null}

      <Dialog open={isCreateRoleOpen} onOpenChange={setIsCreateRoleOpen}>
        <DialogContent className="gap-0 sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Crear nuevo rol</DialogTitle>
            <DialogDescription>
              Definí su identidad. Después podrás configurar qué puede ver y hacer dentro del producto.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={(event) => { event.preventDefault(); createRole() }}>
            <div className="grid gap-5 px-5 py-4">
              <label className="grid gap-1.5">
                <span className="font-mono text-[11px] font-semibold">Nombre del rol <span className="text-destructive">*</span></span>
                <Input
                  autoFocus
                  value={newRoleDraft.name}
                  className="h-10"
                  placeholder="Ej.: Supervisor de catálogo"
                  onChange={(event) => setNewRoleDraft((current) => ({ ...current, name: event.target.value }))}
                />
              </label>

              <label className="grid gap-1.5">
                <span className="font-mono text-[11px] font-semibold">Descripción</span>
                <Textarea
                  value={newRoleDraft.description}
                  className="min-h-20 resize-none"
                  onChange={(event) => setNewRoleDraft((current) => ({ ...current, description: event.target.value }))}
                />
              </label>

              <div className="grid gap-2">
                <div>
                  <div className="font-mono text-[11px] font-semibold">Color identificador</div>
                  <p className="mt-0.5 text-xs text-muted-foreground">Ayuda a reconocer el rol al asignar usuarios y revisar permisos.</p>
                </div>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Color del nuevo rol">
                  {roleColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      aria-label={`Usar color ${color}`}
                      aria-pressed={newRoleDraft.color === color}
                      className={cn("grid size-10 place-items-center rounded-[4px] border-2", newRoleDraft.color === color ? "border-foreground" : "border-transparent")}
                      style={{ backgroundColor: color }}
                      onClick={() => setNewRoleDraft((current) => ({ ...current, color }))}
                    >
                      {newRoleDraft.color === color ? <Check className="size-4 text-white" /> : null}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-3 rounded-[4px] border bg-muted/20 p-3">
                  <span className="grid size-9 place-items-center rounded-[4px] text-xs font-bold text-white" style={{ backgroundColor: newRoleDraft.color }}>
                    {(newRoleDraft.name.trim() || "NR").slice(0, 2).toLocaleUpperCase("es")}
                  </span>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{newRoleDraft.name.trim() || "Nuevo rol"}</div>
                    <div className="text-[10px] text-muted-foreground">0 usuarios asignados</div>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateRoleOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={!newRoleDraft.name.trim()}><Plus />Crear rol</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
