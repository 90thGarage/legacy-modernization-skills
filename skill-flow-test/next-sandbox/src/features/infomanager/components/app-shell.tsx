"use client"

import { useEffect, useState, type ReactNode } from "react"
import {
  ALargeSmall,
  Blocks,
  Boxes,
  ChartBar,
  ChartNoAxesCombined,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  CircleUserRound,
  Columns3,
  ClipboardList,
  FileMinus2,
  FilePlus2,
  HandCoins,
  House,
  LayoutTemplate,
  LogOut,
  Menu,
  Moon,
  PackageSearch,
  Printer,
  PanelLeftClose,
  ReceiptText,
  RotateCcw,
  Settings2,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Store,
  Sun,
  Tags,
  Truck,
  Users,
  Warehouse,
  WalletCards,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { canUserAccess } from "../access-control"
import type { AdvancedInvoicingLayout, POSColumnKey, POSLayout, PrototypeUser, ViewId } from "../types"

type ThemePreference = "light" | "dark" | "system"
type TypographyProfile = "normal" | "large" | "extra-large"
type RadiusProfile = "standard" | "rounded"

const posLayoutOptions: { value: POSLayout; shortLabel: string; label: string }[] = [
  { value: "header-grid", shortLabel: "A", label: "Cabecera" },
  { value: "bottom-bar", shortLabel: "B", label: "Minimalista" },
  { value: "receipt-book", shortLabel: "C", label: "Talonario" },
]

const posColumnOptions: { value: POSColumnKey; label: string; description: string }[] = [
  { value: "code", label: "Código", description: "Código interno del artículo" },
  { value: "quantity", label: "Cantidad", description: "Cantidad y controles para sumar o restar" },
  { value: "detail", label: "Detalle", description: "Descripción, código de barras y unidad" },
  { value: "unit", label: "Unidad", description: "Unidad de venta en una columna independiente" },
  { value: "unitPrice", label: "Precio unitario", description: "Precio antes de descuentos" },
  { value: "manualDiscount", label: "Descuento manual", description: "Porcentaje editable por el vendedor" },
  { value: "promotionalDiscount", label: "Descuento promocional", description: "Porcentaje aplicado por promociones" },
  { value: "discountedPrice", label: "Precio con descuento", description: "Precio unitario final" },
  { value: "amount", label: "Importe", description: "Total calculado de la línea" },
  { value: "actions", label: "Acciones", description: "Eliminar el artículo de la venta" },
]

const defaultPOSColumns: POSColumnKey[] = [
  "code",
  "quantity",
  "detail",
  "unitPrice",
  "manualDiscount",
  "promotionalDiscount",
  "amount",
  "actions",
]

const stores = [
  "Casa Central - PV 0004",
  "Sucursal Centro - PV 0007",
  "Deposito Norte",
]

type NavEntry = {
  label: string
  icon: typeof ShoppingCart
  view?: ViewId
  children?: { label: string; view: ViewId; icon: typeof ShoppingCart }[]
}

const navigation: NavEntry[] = [
  {
    label: "Dashboard",
    icon: ChartNoAxesCombined,
    view: "dashboard",
  },
  {
    label: "Ventas",
    icon: ShoppingCart,
    children: [
      { label: "Facturacion rapida", view: "pos", icon: ShoppingCart },
      { label: "Facturacion avanzada", view: "advanced-invoicing", icon: ReceiptText },
      { label: "Presupuestos", view: "budgets", icon: ClipboardList },
      { label: "Facturas", view: "sale-invoices", icon: ReceiptText },
      { label: "Notas de debito", view: "sale-debit-notes", icon: FilePlus2 },
      { label: "Notas de credito", view: "sale-credit-notes", icon: FileMinus2 },
      { label: "Remitos", view: "sale-delivery-notes", icon: Truck },
      { label: "Cobros", view: "collections", icon: HandCoins },
      { label: "Cuenta corriente", view: "customer-account", icon: WalletCards },
      { label: "Clientes", view: "customers", icon: Users },
    ],
  },
  {
    label: "Compras",
    icon: ShoppingBag,
    children: [
      { label: "Facturas", view: "purchase-invoices", icon: ReceiptText },
      { label: "Notas de debito", view: "purchase-debit-notes", icon: FilePlus2 },
      { label: "Notas de credito", view: "purchase-credit-notes", icon: FileMinus2 },
      { label: "Remitos", view: "purchase-delivery-notes", icon: Truck },
      { label: "Pagos", view: "payments", icon: HandCoins },
      { label: "Proveedores", view: "suppliers", icon: Truck },
    ],
  },
  {
    label: "Catalogo",
    icon: Boxes,
    children: [
      { label: "Articulos", view: "articles", icon: PackageSearch },
      { label: "Rubros", view: "categories", icon: Tags },
      { label: "Consulta rapida", view: "kiosk", icon: PackageSearch },
      { label: "Diseño de etiquetas", view: "label-design", icon: Tags },
      { label: "Impresión de etiquetas", view: "label-print", icon: Printer },
    ],
  },
  {
    label: "Stock",
    icon: Warehouse,
    children: [{ label: "Depositos", view: "warehouses", icon: Warehouse }],
  },
]

const patternNavigation: NavEntry[] = [
  { label: "Formulario simple", icon: LayoutTemplate, view: "pattern-form-simple" },
  { label: "Formulario seccionado", icon: Blocks, view: "pattern-form-sectioned" },
  { label: "Consulta y reporte", icon: ChartBar, view: "pattern-report" },
]

const mobilePrimaryNavigation: { label: string; icon: typeof ShoppingCart; view: ViewId }[] = [
  { label: "Inicio", icon: House, view: "dashboard" },
  { label: "Facturar", icon: ShoppingCart, view: "pos" },
  { label: "Articulos", icon: PackageSearch, view: "articles" },
  { label: "Clientes", icon: Users, view: "customers" },
]

function navigationForUser(entries: NavEntry[], user: PrototypeUser): NavEntry[] {
  return entries.reduce<NavEntry[]>((visible, entry) => {
    const children = entry.children?.filter((child) => canUserAccess(user, child.view))
    if (children?.length) {
      visible.push({ ...entry, children })
    } else if (entry.view && canUserAccess(user, entry.view)) {
      visible.push(entry)
    }
    return visible
  }, [])
}

function ThemeController({
  theme,
}: {
  theme: ThemePreference
}) {
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const apply = () => {
      const isDark = theme === "dark" || (theme === "system" && media.matches)
      document.documentElement.classList.toggle("dark", isDark)
      document.documentElement.dataset.theme = theme
      localStorage.setItem("infomanager-theme", theme)
    }

    apply()
    media.addEventListener("change", apply)
    return () => media.removeEventListener("change", apply)
  }, [theme])

  return null
}

function TypographyController({ profile }: { profile: TypographyProfile }) {
  useEffect(() => {
    const rootFontSize =
      profile === "large" ? "20px" : profile === "extra-large" ? "24px" : "16px"

    document.documentElement.dataset.fontProfile = profile
    document.documentElement.style.fontSize = rootFontSize
    localStorage.setItem("infomanager-font-profile", profile)

    return () => {
      delete document.documentElement.dataset.fontProfile
      document.documentElement.style.removeProperty("font-size")
    }
  }, [profile])

  return null
}

function RadiusController({ profile }: { profile: RadiusProfile }) {
  useEffect(() => {
    document.documentElement.dataset.radiusProfile = profile
    localStorage.setItem("infomanager-radius-profile", profile)

    return () => {
      delete document.documentElement.dataset.radiusProfile
    }
  }, [profile])

  return null
}

function ShellSidebar({
  activeView,
  user,
  onNavigate,
  theme,
  onThemeChange,
  radiusProfile,
  onRadiusProfileChange,
  typographyProfile,
  onTypographyProfileChange,
  advancedInvoicingLayout,
  onAdvancedInvoicingLayoutChange,
  onOpenPreferences,
  onOpenPOSSettings,
  onLogout,
}: {
  activeView: ViewId
  user: PrototypeUser
  onNavigate: (view: ViewId) => void
  theme: ThemePreference
  onThemeChange: (theme: ThemePreference) => void
  radiusProfile: RadiusProfile
  onRadiusProfileChange: (profile: RadiusProfile) => void
  typographyProfile: TypographyProfile
  onTypographyProfileChange: (profile: TypographyProfile) => void
  advancedInvoicingLayout?: AdvancedInvoicingLayout
  onAdvancedInvoicingLayoutChange?: (layout: AdvancedInvoicingLayout) => void
  onOpenPreferences: () => void
  onOpenPOSSettings: () => void
  onLogout: () => void
}) {
  const { state, isMobile, setOpenMobile } = useSidebar()
  const [store, setStore] = useState(stores[0])
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    Ventas: true,
    Compras: true,
    Catalogo: true,
    Stock: true,
  })
  const visibleNavigation = navigationForUser(navigation, user)
  const visiblePatternNavigation = navigationForUser(patternNavigation, user)
  const navigate = (view: ViewId) => {
    onNavigate(view)
    if (isMobile) setOpenMobile(false)
  }

  return (
    <Sidebar collapsible="icon" className="border-sidebar-border">
      <SidebarHeader className="gap-1 border-b border-sidebar-border p-2">
        <div className="flex h-10 items-center gap-2 px-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <span className="grid size-7 shrink-0 place-items-center rounded-[4px] bg-primary font-mono text-xs font-bold text-primary-foreground group-data-[collapsible=icon]:hidden">
            IM
          </span>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <div className="truncate text-sm font-bold">InfoManager 5</div>
            <div className="font-mono text-[10px] text-muted-foreground">
              Gestion comercial
            </div>
          </div>
          <SidebarTrigger
            aria-label={isMobile ? "Cerrar navegación" : state === "collapsed" ? "Expandir sidebar" : "Contraer sidebar"}
            title={isMobile ? "Cerrar navegación" : state === "collapsed" ? "Expandir sidebar" : "Contraer sidebar"}
            className="ml-auto size-8 shrink-0 group-data-[collapsible=icon]:mx-auto"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              tooltip={store}
              className="h-12 border border-sidebar-border bg-sidebar-accent/40 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:border-transparent group-data-[collapsible=icon]:bg-transparent"
            >
              <Store className="text-primary" />
              <span className="grid min-w-0 flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate text-xs font-semibold">
                  InfoManager Demo SA
                </span>
                <span className="truncate text-[11px] text-muted-foreground">
                  {store}
                </span>
              </span>
              <ChevronsUpDown className="ml-auto group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start" className="w-64">
            <DropdownMenuLabel>Empresa y local</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {stores.map((item) => (
              <DropdownMenuItem key={item} onSelect={() => setStore(item)}>
                <Store />
                <span className="flex-1">{item}</span>
                {store === item ? <span className="text-primary">Activa</span> : null}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Areas de negocio</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleNavigation.map((entry) => {
                const Icon = entry.icon
                const isParentActive =
                  entry.view === activeView ||
                  entry.children?.some((child) => child.view === activeView)
                const isOpen = expanded[entry.label]

                return (
                  <SidebarMenuItem key={entry.label}>
                    <SidebarMenuButton
                      tooltip={entry.label}
                      isActive={Boolean(isParentActive && !entry.children)}
                      className={cn(entry.children && "font-semibold")}
                      onClick={() => {
                        if (entry.children) {
                          if (state === "collapsed") {
                            navigate(entry.children[0].view)
                          } else {
                            setExpanded((current) => ({
                              ...current,
                              [entry.label]: !current[entry.label],
                            }))
                          }
                        } else if (entry.view) {
                          navigate(entry.view)
                        }
                      }}
                    >
                      <Icon />
                      <span>{entry.label}</span>
                      {entry.children ? (
                        isOpen ? (
                          <ChevronDown className="ml-auto group-data-[collapsible=icon]:hidden" />
                        ) : (
                          <ChevronRight className="ml-auto group-data-[collapsible=icon]:hidden" />
                        )
                      ) : null}
                    </SidebarMenuButton>
                    {entry.children && isOpen ? (
                      <SidebarMenuSub>
                        {entry.children.map((child) => {
                          const ChildIcon = child.icon
                          return (
                            <SidebarMenuSubItem key={child.view}>
                              <SidebarMenuSubButton
                                href="#"
                                isActive={activeView === child.view}
                                onClick={(event) => {
                                  event.preventDefault()
                                  navigate(child.view)
                                }}
                              >
                                <ChildIcon />
                                <span>{child.label}</span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          )
                        })}
                      </SidebarMenuSub>
                    ) : null}
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {visiblePatternNavigation.length ? (
          <SidebarGroup className="border-t border-sidebar-border pt-2">
            <SidebarGroupLabel>Laboratorio UX · Patrones</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {visiblePatternNavigation.map((entry) => {
                  const Icon = entry.icon
                  return (
                    <SidebarMenuItem key={entry.label}>
                      <SidebarMenuButton
                        tooltip={`${entry.label} · patron interno`}
                        isActive={entry.view === activeView}
                        onClick={() => entry.view && navigate(entry.view)}
                      >
                        <Icon />
                        <span>{entry.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : null}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" tooltip={`${user.name} · ${user.roleLabel}`}>
              <span className="grid size-7 shrink-0 place-items-center rounded-[4px] bg-muted font-mono text-xs font-bold">
                {user.initials}
              </span>
              <span className="grid min-w-0 flex-1 text-left leading-tight">
                <span className="truncate text-xs font-semibold">{user.name}</span>
                <span className="truncate text-[11px] text-muted-foreground">
                  {user.roleLabel}
                </span>
              </span>
              <ChevronsUpDown className="ml-auto group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="right"
            align="end"
            className="w-64"
          >
            <DropdownMenuLabel>Cuenta</DropdownMenuLabel>
            <DropdownMenuItem>
              <CircleUserRound /> Perfil
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={onOpenPreferences}>
              <Settings2 /> Preferencias
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={onOpenPOSSettings}>
              <Columns3 /> Configuración POS
            </DropdownMenuItem>
            {user.role === "admin" ? (
              <DropdownMenuItem onSelect={() => navigate("role-settings")}>
                <ShieldCheck /> Roles y permisos
              </DropdownMenuItem>
            ) : null}
            <DropdownMenuSeparator />
            {activeView === "advanced-invoicing" && advancedInvoicingLayout && onAdvancedInvoicingLayoutChange ? (
              <>
                <DropdownMenuLabel>Diseño de facturación avanzada</DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={advancedInvoicingLayout}
                  onValueChange={(value) => onAdvancedInvoicingLayoutChange(value as AdvancedInvoicingLayout)}
                >
                  <DropdownMenuRadioItem value="tabs">A · Pestañas</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="guided">B · Guiada</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="streamlined">C · Esencial</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="paper">D · Comprobante</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="staged">E · Por etapas</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
                <DropdownMenuSeparator />
              </>
            ) : null}
            <DropdownMenuLabel>Apariencia</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={theme}
              onValueChange={(value) => onThemeChange(value as ThemePreference)}
            >
              <DropdownMenuRadioItem value="light">
                <Sun /> Claro
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dark">
                <Moon /> Oscuro
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="system">
                <PanelLeftClose /> Sistema
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Escala de interfaz</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={typographyProfile}
              onValueChange={(value) =>
                onTypographyProfileChange(value as TypographyProfile)
              }
            >
              <DropdownMenuRadioItem value="normal">
                <ALargeSmall />
                <span className="flex min-w-0 flex-1 items-center justify-between gap-3">
                  <span>Normal</span>
                  <span className="font-mono text-[10px] text-muted-foreground">100%</span>
                </span>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="large">
                <ALargeSmall />
                <span className="flex min-w-0 flex-1 items-center justify-between gap-3">
                  <span>Grande</span>
                  <span className="font-mono text-[10px] text-muted-foreground">125%</span>
                </span>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="extra-large">
                <ALargeSmall />
                <span className="flex min-w-0 flex-1 items-center justify-between gap-3">
                  <span>Extra grande</span>
                  <span className="font-mono text-[10px] text-muted-foreground">150%</span>
                </span>
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Esquinas</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={radiusProfile}
              onValueChange={(value) =>
                onRadiusProfileChange(value as RadiusProfile)
              }
            >
              <DropdownMenuRadioItem value="standard">
                <span className="flex min-w-0 flex-1 items-center justify-between gap-3">
                  <span>Estándar</span>
                  <span className="font-mono text-[10px] text-muted-foreground">4 px</span>
                </span>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="rounded">
                <span className="flex min-w-0 flex-1 items-center justify-between gap-3">
                  <span>Redondeado</span>
                  <span className="font-mono text-[10px] text-muted-foreground">12 px</span>
                </span>
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onSelect={onLogout}>
              <LogOut /> Cerrar sesion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

function MobileBottomNavigation({
  activeView,
  user,
  onNavigate,
}: {
  activeView: ViewId
  user: PrototypeUser
  onNavigate: (view: ViewId) => void
}) {
  const { setOpenMobile } = useSidebar()
  const visibleItems = mobilePrimaryNavigation.filter((item) =>
    canUserAccess(user, item.view)
  )
  const moreIsActive = !visibleItems.some((item) => item.view === activeView)

  return (
    <nav
      aria-label="Navegacion principal mobile"
      className="z-30 shrink-0 border-t bg-card pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <div className="grid h-14 auto-cols-fr grid-flow-col">
        {visibleItems.map((item) => {
          const Icon = item.icon
          const isActive = activeView === item.view

          return (
            <button
              key={item.view}
              type="button"
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "relative flex min-w-0 flex-col items-center justify-center gap-0.5 px-1 text-[10px] font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => onNavigate(item.view)}
            >
              {isActive ? <span className="absolute inset-x-4 top-0 h-0.5 bg-primary" /> : null}
              <Icon className="size-[18px]" />
              <span className="truncate">{item.label}</span>
            </button>
          )
        })}
        <button
          type="button"
          aria-current={moreIsActive ? "page" : undefined}
          aria-label="Abrir todas las secciones"
          className={cn(
            "relative flex min-w-0 flex-col items-center justify-center gap-0.5 px-1 text-[10px] font-medium transition-colors",
            moreIsActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
          )}
          onClick={() => setOpenMobile(true)}
        >
          {moreIsActive ? <span className="absolute inset-x-4 top-0 h-0.5 bg-primary" /> : null}
          <Menu className="size-[18px]" />
          <span>Más</span>
        </button>
      </div>
    </nav>
  )
}

function POSConfigurationSheet({
  open,
  onOpenChange,
  columns,
  onColumnsChange,
  layout,
  onLayoutChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  columns: POSColumnKey[]
  onColumnsChange: (columns: POSColumnKey[]) => void
  layout: POSLayout
  onLayoutChange: (layout: POSLayout) => void
}) {
  const visibleCount = columns.length

  const toggleColumn = (column: POSColumnKey, checked: boolean) => {
    if (!checked && visibleCount <= 4) return
    if (checked && visibleCount >= 10) return
    const selected = new Set(columns)
    if (checked) selected.add(column)
    else selected.delete(column)
    onColumnsChange(
      posColumnOptions
        .map((option) => option.value)
        .filter((value) => selected.has(value))
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-[min(94vw,30rem)] flex-col gap-0 p-0 sm:max-w-[30rem]">
        <SheetHeader className="border-b px-5 py-4 text-left">
          <SheetTitle>Configuración POS</SheetTitle>
          <SheetDescription>
            Elegí la distribución y qué información se muestra en la grilla de facturación rápida.
            Los cambios se aplican inmediatamente en este navegador.
          </SheetDescription>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 py-4">
          <section className="mb-4">
            <h3 className="mb-2 text-xs font-semibold">Distribución</h3>
            <div role="group" aria-label="Distribución de facturación rápida" className="grid grid-cols-3 rounded-[4px] border bg-muted/50 p-1">
              {posLayoutOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={layout === option.value}
                  className={cn(
                    "h-9 rounded-[3px] px-2 text-xs font-medium text-muted-foreground",
                    layout === option.value && "bg-card text-foreground shadow-sm"
                  )}
                  onClick={() => onLayoutChange(option.value)}
                >
                  {option.shortLabel} · {option.label}
                </button>
              ))}
            </div>
          </section>

          <div className="mb-3 flex items-center justify-between rounded-[4px] border bg-muted/35 px-3 py-2">
            <div>
              <div className="text-xs font-semibold">Columnas visibles</div>
              <div className="text-[11px] text-muted-foreground">Mínimo 4 · máximo 10</div>
            </div>
            <strong className="font-mono text-lg tabular-nums">{visibleCount}/10</strong>
          </div>

          <div className="divide-y rounded-[4px] border">
            {posColumnOptions.map((option) => {
              const checked = columns.includes(option.value)
              const disabled = checked ? visibleCount <= 4 : visibleCount >= 10
              return (
                <label
                  key={option.value}
                  className={cn(
                    "flex min-h-14 cursor-pointer items-center gap-3 px-3 py-2.5 hover:bg-muted/40",
                    disabled && "cursor-not-allowed opacity-55"
                  )}
                >
                  <Checkbox
                    checked={checked}
                    disabled={disabled}
                    onCheckedChange={(value) => toggleColumn(option.value, value === true)}
                    aria-label={`Mostrar columna ${option.label}`}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium">{option.label}</span>
                    <span className="block text-[11px] leading-4 text-muted-foreground">
                      {option.description}
                    </span>
                  </span>
                </label>
              )
            })}
          </div>
        </div>

        <SheetFooter className="flex-row items-center justify-between border-t bg-card px-5 py-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onColumnsChange(defaultPOSColumns)}
            disabled={defaultPOSColumns.every((column, index) => columns[index] === column)}
          >
            <RotateCcw /> Restablecer
          </Button>
          <Button size="sm" onClick={() => onOpenChange(false)}>Listo</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export function AppShell({
  activeView,
  posLayout,
  onPosLayoutChange,
  posColumns,
  onPosColumnsChange,
  advancedInvoicingLayout,
  onAdvancedInvoicingLayoutChange,
  onOpenPreferences,
  user,
  onNavigate,
  children,
  onLogout,
}: {
  activeView: ViewId
  posLayout?: POSLayout
  onPosLayoutChange?: (layout: POSLayout) => void
  posColumns: POSColumnKey[]
  onPosColumnsChange: (columns: POSColumnKey[]) => void
  advancedInvoicingLayout?: AdvancedInvoicingLayout
  onAdvancedInvoicingLayoutChange?: (layout: AdvancedInvoicingLayout) => void
  onOpenPreferences: () => void
  user: PrototypeUser
  onNavigate: (view: ViewId) => void
  children: ReactNode
  onLogout: () => void
}) {
  const [posSettingsOpen, setPosSettingsOpen] = useState(false)
  const [theme, setTheme] = useState<ThemePreference>(() => {
    if (typeof window === "undefined") return "system"
    const stored = localStorage.getItem("infomanager-theme")
    return stored === "light" || stored === "dark" || stored === "system"
      ? stored
      : "system"
  })
  const [radiusProfile, setRadiusProfile] = useState<RadiusProfile>(() => {
    if (typeof window === "undefined") return "standard"
    return localStorage.getItem("infomanager-radius-profile") === "rounded"
      ? "rounded"
      : "standard"
  })
  const [typographyProfile, setTypographyProfile] = useState<TypographyProfile>(() => {
    if (typeof window === "undefined") return "normal"
    const stored = localStorage.getItem("infomanager-font-profile")
    return stored === "large" || stored === "extra-large" ? stored : "normal"
  })

  return (
    <SidebarProvider
      defaultOpen={false}
      style={{
        "--sidebar-width": "15.5rem",
        "--sidebar-width-icon": "3.25rem",
      } as React.CSSProperties}
      className="text-[0.875rem]"
    >
      <ThemeController theme={theme} />
      <TypographyController profile={typographyProfile} />
      <RadiusController profile={radiusProfile} />
      <ShellSidebar
        activeView={activeView}
        user={user}
        onNavigate={onNavigate}
        theme={theme}
        onThemeChange={setTheme}
        radiusProfile={radiusProfile}
        onRadiusProfileChange={setRadiusProfile}
        typographyProfile={typographyProfile}
        onTypographyProfileChange={setTypographyProfile}
        advancedInvoicingLayout={advancedInvoicingLayout}
        onAdvancedInvoicingLayoutChange={onAdvancedInvoicingLayoutChange}
        onOpenPreferences={onOpenPreferences}
        onOpenPOSSettings={() => setPosSettingsOpen(true)}
        onLogout={onLogout}
      />
      <SidebarInset className="min-w-0 overflow-hidden">
        <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
        <MobileBottomNavigation
          activeView={activeView}
          user={user}
          onNavigate={onNavigate}
        />
      </SidebarInset>
      <POSConfigurationSheet
        open={posSettingsOpen}
        onOpenChange={setPosSettingsOpen}
        columns={posColumns}
        onColumnsChange={onPosColumnsChange}
        layout={posLayout ?? "header-grid"}
        onLayoutChange={onPosLayoutChange ?? (() => undefined)}
      />
    </SidebarProvider>
  )
}
