"use client"

import { useMemo, useState, type Dispatch, type SetStateAction } from "react"
import {
  AlertTriangle,
  Banknote,
  Camera,
  Check,
  ChevronDown,
  ChevronRight,
  CircleCheck,
  Copy,
  CreditCard,
  Eye,
  FileText,
  LockKeyhole,
  Minus,
  PanelBottom,
  PanelTop,
  Plus,
  RotateCcw,
  Scale,
  Search,
  Send,
  Settings2,
  SlidersHorizontal,
  Star,
  TableProperties,
  Trash2,
  WalletCards,
  ReceiptText,
  X,
} from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { money } from "../mock-data"
import type { CommercialDocument, CommercialDocumentLine } from "../types"

export type WorkBlock = "query" | "header" | "body" | "footer"
type EditorMode = "idle" | "create" | "view" | "rectify"
export type SalesInvoiceProfile = "complete" | "quick" | "custom"
type SalesInvoiceLayoutVariant = "contained" | "vertical"

export type HeaderFieldKey =
  | "client"
  | "destination"
  | "jurisdiction"
  | "type"
  | "point"
  | "observations"
  | "currency"
  | "condition"
  | "seller"
  | "priceList"
  | "date"
  | "internalNumber"
  | "company"
  | "costCenter"
  | "batch"
  | "warehouse"
  | "deliveryNote"

export type BodyColumnKey = "code" | "description" | "quantity" | "unitPrice" | "manualDiscount" | "promotionalDiscount" | "vat" | "total" | "actions"
export type FooterMetricKey = "discount" | "net" | "vat" | "internalTaxes" | "perceptions" | "total"
export type FooterActionKey =
  | "cancel"
  | "save"
  | "preview"
  | "emit"
  | "quickCash"
  | "quickElectronicCash"
  | "quickElectronicCard"

export type SalesInvoicePreferences = {
  profile: SalesInvoiceProfile
  visibleBlocks: WorkBlock[]
  headerFields: HeaderFieldKey[]
  bodyColumns: BodyColumnKey[]
  footerMetrics: FooterMetricKey[]
  footerActions: FooterActionKey[]
}

type InvoiceForm = {
  client: string
  taxId: string
  destination: string
  jurisdiction: string
  type: string
  point: string
  observations: string
  currency: string
  condition: string
  seller: string
  priceList: string
  date: string
  internalNumber: string
  company: string
  costCenter: string
  batch: string
  warehouse: string
  deliveryNote: boolean
}

const blockDefinitions: Array<{ key: WorkBlock; label: string; description: string; icon: typeof Search }> = [
  { key: "query", label: "Consulta", description: "Buscar y seleccionar facturas", icon: Search },
  { key: "header", label: "Cabecera", description: "Datos generales del comprobante", icon: PanelTop },
  { key: "body", label: "Cuerpo", description: "Ítems y valores facturados", icon: TableProperties },
  { key: "footer", label: "Pie de página", description: "Resumen y comandos", icon: PanelBottom },
]

const headerFieldDefinitions: Array<{ key: HeaderFieldKey; label: string }> = [
  { key: "client", label: "Cliente" },
  { key: "destination", label: "Destino" },
  { key: "jurisdiction", label: "Jurisdicción" },
  { key: "type", label: "Tipo" },
  { key: "point", label: "Punto de venta" },
  { key: "observations", label: "Observaciones" },
  { key: "currency", label: "Moneda" },
  { key: "condition", label: "Condición de venta" },
  { key: "seller", label: "Vendedor" },
  { key: "priceList", label: "Lista de precios" },
  { key: "date", label: "Fecha" },
  { key: "internalNumber", label: "Número interno" },
  { key: "company", label: "Empresa" },
  { key: "costCenter", label: "Centro de costo" },
  { key: "batch", label: "Lote" },
  { key: "warehouse", label: "Depósito" },
  { key: "deliveryNote", label: "Generar remito" },
]

const bodyColumnDefinitions: Array<{ key: BodyColumnKey; label: string }> = [
  { key: "code", label: "Código" },
  { key: "quantity", label: "Cantidad" },
  { key: "description", label: "Detalle" },
  { key: "unitPrice", label: "Precio unitario" },
  { key: "manualDiscount", label: "Descuento manual" },
  { key: "promotionalDiscount", label: "Descuento promocional" },
  { key: "vat", label: "IVA" },
  { key: "total", label: "Importe" },
  { key: "actions", label: "Acciones" },
]

const footerMetricDefinitions: Array<{ key: FooterMetricKey; label: string }> = [
  { key: "discount", label: "Bonificación" },
  { key: "net", label: "Neto" },
  { key: "vat", label: "IVA 21 %" },
  { key: "internalTaxes", label: "Imp. internos" },
  { key: "perceptions", label: "Percepciones" },
  { key: "total", label: "Total" },
]

const completeFooterActionDefinitions: Array<{ key: FooterActionKey; label: string }> = [
  { key: "cancel", label: "Cancelar" },
  { key: "save", label: "Guardar borrador" },
  { key: "preview", label: "Vista previa" },
  { key: "emit", label: "Emitir factura" },
]

const quickFooterActionDefinitions: Array<{ key: FooterActionKey; label: string }> = [
  { key: "quickCash", label: "Efectivo" },
  { key: "quickElectronicCash", label: "Fac. E · Efectivo" },
  { key: "quickElectronicCard", label: "Fac. E · Tarjeta" },
]

const completeHeaderFields = headerFieldDefinitions.map(({ key }) => key)
const quickHeaderFields: HeaderFieldKey[] = []
const minimalBodyColumns: BodyColumnKey[] = ["code", "quantity", "description", "unitPrice", "manualDiscount", "promotionalDiscount", "total", "actions"]
const completeBodyColumns = minimalBodyColumns
const quickBodyColumns = minimalBodyColumns
const completeFooterMetrics = footerMetricDefinitions.map(({ key }) => key)
const quickFooterMetrics: FooterMetricKey[] = ["net", "vat", "total"]
const completeFooterActions = completeFooterActionDefinitions.map(({ key }) => key)
const quickFooterActions = quickFooterActionDefinitions.map(({ key }) => key)

export const defaultSalesInvoicePreferences: SalesInvoicePreferences = {
  profile: "complete",
  visibleBlocks: blockDefinitions.map(({ key }) => key),
  headerFields: completeHeaderFields,
  bodyColumns: completeBodyColumns,
  footerMetrics: completeFooterMetrics,
  footerActions: completeFooterActions,
}

const emptyForm: InvoiceForm = {
  client: "",
  taxId: "",
  destination: "Electrónico · Interno",
  jurisdiction: "Ninguna",
  type: "Factura",
  point: "PV 0004",
  observations: "",
  currency: "Peso argentino",
  condition: "Cuenta corriente",
  seller: "Natalia Leyva",
  priceList: "Mayorista",
  date: "2026-07-29",
  internalNumber: "A asignar al emitir",
  company: "Empresa 7",
  costCenter: "1",
  batch: "Sin lote",
  warehouse: "1 · Central",
  deliveryNote: false,
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-AR").format(new Date(`${value}T12:00:00`))
}

function formFromDocument(document: CommercialDocument): InvoiceForm {
  return {
    ...emptyForm,
    client: document.partyName,
    taxId: document.partyTaxId,
    point: document.pointOfSale,
    date: document.date,
    internalNumber: document.number,
    observations: document.relatedDocument || "Factura Agosto 2026",
  }
}

function ToggleOption({
  checked,
  label,
  onChange,
}: {
  checked: boolean
  label: string
  onChange: (checked: boolean) => void
}) {
  return (
    <label className={cn(
      "flex min-h-9 cursor-pointer items-center gap-2 rounded-[4px] border px-2.5 py-1.5 text-xs",
      checked ? "border-primary/35 bg-primary/5" : "bg-card text-muted-foreground"
    )}>
      <Checkbox className="shrink-0" checked={checked} onCheckedChange={(value) => onChange(Boolean(value))} />
      <span className="min-w-0 break-words leading-tight">{label}</span>
    </label>
  )
}

function OptionGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-[repeat(auto-fit,minmax(11rem,1fr))] gap-2">{children}</div>
}

function Configurator({
  profile,
  onProfile,
  visibleBlocks,
  onToggleBlock,
  headerFields,
  onToggleHeaderField,
  bodyColumns,
  onToggleBodyColumn,
  footerMetrics,
  onToggleFooterMetric,
  footerActions,
  onToggleFooterAction,
}: {
  profile: SalesInvoiceProfile
  onProfile: (profile: Exclude<SalesInvoiceProfile, "custom">) => void
  visibleBlocks: WorkBlock[]
  onToggleBlock: (key: WorkBlock, checked: boolean) => void
  headerFields: HeaderFieldKey[]
  onToggleHeaderField: (key: HeaderFieldKey, checked: boolean) => void
  bodyColumns: BodyColumnKey[]
  onToggleBodyColumn: (key: BodyColumnKey, checked: boolean) => void
  footerMetrics: FooterMetricKey[]
  onToggleFooterMetric: (key: FooterMetricKey, checked: boolean) => void
  footerActions: FooterActionKey[]
  onToggleFooterAction: (key: FooterActionKey, checked: boolean) => void
}) {
  const quick = profile === "quick"
  const availableFooterActions = quick ? quickFooterActionDefinitions : completeFooterActionDefinitions

  return (
    <section className="grid gap-5">
      <div>
        <div className="flex items-center gap-2"><Settings2 className="size-4 text-primary" /><h3 className="font-semibold">¿Cómo querés cargar las facturas?</h3></div>
        <p className="mt-1 text-xs text-muted-foreground">Elegí una forma de trabajo. Después podés decidir qué información necesitás ver.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <button type="button" onClick={() => onProfile("quick")} className={cn("rounded-[6px] border p-4 text-left", quick ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "bg-card hover:bg-muted/30")}>
          <span className="flex items-center justify-between gap-3"><strong>Facturación rápida</strong>{quick ? <CircleCheck className="size-5 text-primary" /> : null}</span>
          <span className="mt-1 block text-xs text-muted-foreground">Sólo productos, totales y botones para cobrar o emitir.</span>
        </button>
        <button type="button" onClick={() => onProfile("complete")} className={cn("rounded-[6px] border p-4 text-left", !quick ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "bg-card hover:bg-muted/30")}>
          <span className="flex items-center justify-between gap-3"><strong>Facturación completa</strong>{!quick ? <CircleCheck className="size-5 text-primary" /> : null}</span>
          <span className="mt-1 block text-xs text-muted-foreground">Consulta de facturas, datos generales, productos y totales.</span>
        </button>
      </div>

      {quick ? <div className="rounded-[6px] border border-blue-200 bg-blue-50/60 px-4 py-3 text-xs text-blue-900">La vista rápida siempre muestra únicamente <strong>Cuerpo</strong> y <strong>Pie de página</strong>, sin navegación lateral.</div> : null}

      {!quick ? <div className="grid gap-4 xl:grid-cols-2">
        <section className="rounded-[6px] border bg-card p-4">
          <h4 className="font-semibold">Partes de la pantalla</h4><p className="mb-3 text-xs text-muted-foreground">Marcá las áreas que querés tener disponibles.</p>
          <OptionGrid>{blockDefinitions.map(({ key, label }) => <ToggleOption key={key} label={label} checked={visibleBlocks.includes(key)} onChange={(checked) => onToggleBlock(key, checked)} />)}</OptionGrid>
        </section>
        <section className="rounded-[6px] border bg-card p-4">
          <h4 className="font-semibold">Datos generales de la factura</h4><p className="mb-3 text-xs text-muted-foreground">Elegí qué datos aparecen en Cabecera.</p>
          <OptionGrid>{headerFieldDefinitions.map(({ key, label }) => <ToggleOption key={key} label={label} checked={headerFields.includes(key)} onChange={(checked) => onToggleHeaderField(key, checked)} />)}</OptionGrid>
        </section>
      </div> : null}

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="rounded-[6px] border bg-card p-4">
          <h4 className="font-semibold">Columnas de productos</h4><p className="mb-3 text-xs text-muted-foreground">Elegí la información visible en cada renglón.</p>
          <OptionGrid>{bodyColumnDefinitions.filter(({ key }) => key !== "vat").map(({ key, label }) => <ToggleOption key={key} label={label} checked={bodyColumns.includes(key)} onChange={(checked) => onToggleBodyColumn(key, checked)} />)}</OptionGrid>
        </section>
        <section className="rounded-[6px] border bg-card p-4">
          <h4 className="font-semibold">Totales y acciones</h4><p className="mb-3 text-xs text-muted-foreground">Elegí los importes y botones del Pie de página.</p>
          <p className="mb-1.5 font-mono text-[10px] uppercase text-muted-foreground">Importes</p>
          <OptionGrid>{footerMetricDefinitions.map(({ key, label }) => <ToggleOption key={key} label={label} checked={footerMetrics.includes(key)} onChange={(checked) => onToggleFooterMetric(key, checked)} />)}</OptionGrid>
          <p className="mt-4 mb-1.5 font-mono text-[10px] uppercase text-muted-foreground">Botones</p>
          <OptionGrid>{availableFooterActions.map(({ key, label }) => <ToggleOption key={key} label={label} checked={footerActions.includes(key)} onChange={(checked) => onToggleFooterAction(key, checked)} />)}</OptionGrid>
        </section>
      </div>
    </section>
  )
}

export function SalesInvoicePreferencesSheet({
  open,
  onOpenChange,
  preferences,
  onPreferencesChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  preferences: SalesInvoicePreferences
  onPreferencesChange: (preferences: SalesInvoicePreferences) => void
}) {
  const normalizedFooterActions = preferences.profile === "quick" && !preferences.footerActions.some((key) => quickFooterActions.includes(key))
    ? quickFooterActions
    : preferences.footerActions

  const applyProfile = (profile: Exclude<SalesInvoiceProfile, "custom">) => {
    onPreferencesChange({
      profile,
      visibleBlocks: profile === "quick" ? ["body", "footer"] : blockDefinitions.map(({ key }) => key),
      headerFields: profile === "quick" ? quickHeaderFields : completeHeaderFields,
      bodyColumns: profile === "quick" ? quickBodyColumns : completeBodyColumns,
      footerMetrics: profile === "quick" ? quickFooterMetrics : completeFooterMetrics,
      footerActions: profile === "quick" ? quickFooterActions : completeFooterActions,
    })
  }

  const toggle = <Key extends string>(collection: Key[], key: Key, checked: boolean) =>
    checked ? [...new Set([...collection, key])] : collection.filter((item) => item !== key)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent style={{ width: "min(96vw, 80rem)", maxWidth: "80rem" }} className="flex flex-col gap-0 p-0">
        <SheetHeader className="border-b px-5 py-4 text-left">
          <SheetTitle>Preferencias</SheetTitle>
          <SheetDescription>Configuración personal de formularios y superficies de trabajo.</SheetDescription>
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-y-auto p-4 md:p-5">
          <Configurator
            profile={preferences.profile}
            onProfile={applyProfile}
            visibleBlocks={preferences.visibleBlocks}
            onToggleBlock={(key, checked) => onPreferencesChange({ ...preferences, profile: "custom", visibleBlocks: toggle(preferences.visibleBlocks, key, checked) })}
            headerFields={preferences.headerFields}
            onToggleHeaderField={(key, checked) => onPreferencesChange({ ...preferences, profile: "custom", headerFields: toggle(preferences.headerFields, key, checked) })}
            bodyColumns={preferences.bodyColumns}
            onToggleBodyColumn={(key, checked) => onPreferencesChange({ ...preferences, profile: preferences.profile === "quick" ? "quick" : "custom", bodyColumns: toggle(preferences.bodyColumns, key, checked) })}
            footerMetrics={preferences.footerMetrics}
            onToggleFooterMetric={(key, checked) => onPreferencesChange({ ...preferences, profile: preferences.profile === "quick" ? "quick" : "custom", footerMetrics: toggle(preferences.footerMetrics, key, checked) })}
            footerActions={normalizedFooterActions}
            onToggleFooterAction={(key, checked) => onPreferencesChange({ ...preferences, profile: preferences.profile === "quick" ? "quick" : "custom", footerActions: toggle(normalizedFooterActions, key, checked) })}
          />
        </div>
        <SheetFooter className="border-t bg-card px-5 py-3">
          <Button variant="outline" onClick={() => onPreferencesChange(defaultSalesInvoicePreferences)}>Restablecer</Button>
          <Button onClick={() => onOpenChange(false)}><Check /> Guardar preferencias</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

function WorkspaceRegion({
  block,
  children,
  vertical = false,
  expanded = true,
  disabled = false,
  complete = false,
  warning = false,
  summary = "",
  onToggle,
}: {
  block: (typeof blockDefinitions)[number]
  children: React.ReactNode
  vertical?: boolean
  expanded?: boolean
  disabled?: boolean
  complete?: boolean
  warning?: boolean
  summary?: string
  onToggle?: () => void
}) {
  const Icon = block.icon

  if (vertical) {
    return (
      <section className={cn(
        "shrink-0 border-b bg-background",
        expanded && block.key === "body" && "min-h-[520px]",
        block.key === "footer" && "sticky bottom-0 z-20 mt-auto border-t shadow-[0_-4px_12px_rgba(0,0,0,0.06)]"
      )}>
        <button
          type="button"
          disabled={disabled}
          aria-expanded={expanded}
          onClick={onToggle}
          className={cn(
            "flex h-11 w-full min-w-0 items-center gap-2 px-3 text-left transition-colors hover:bg-muted/40",
            expanded && "bg-muted/25",
            disabled && "cursor-not-allowed opacity-40"
          )}
        >
          <Icon className="size-4 shrink-0 text-muted-foreground" />
          <strong className="shrink-0 text-sm">{block.label}</strong>
          {warning ? <Badge variant="outline" className="shrink-0 rounded-[4px] border-amber-500/45 font-mono text-[9px] text-amber-700">Revisar</Badge> : complete ? <Badge variant="outline" className="shrink-0 rounded-[4px] border-emerald-600/35 font-mono text-[9px] text-emerald-700">Completo</Badge> : null}
          <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">{summary}</span>
          <ChevronDown className={cn("size-4 shrink-0 transition-transform", expanded && "rotate-180")} />
        </button>
        {expanded && !disabled ? <div className={cn("bg-background", block.key === "body" && "min-h-[476px]")}>{children}</div> : null}
      </section>
    )
  }

  return (
    <section className={cn(
      "flex flex-col bg-background",
      (block.key === "query" || block.key === "body") ? "min-h-0 flex-1" : "shrink-0",
      block.key === "header" && "border-b",
      block.key === "footer" && "mt-auto border-t"
    )}>
      <div className={cn(
        "bg-background",
        (block.key === "query" || block.key === "body") && "min-h-0 flex-1 overflow-auto",
        block.key === "header" && "max-h-[320px] overflow-auto",
        block.key === "footer" && "shrink-0"
      )}>{children}</div>
    </section>
  )
}

function FormField({ label, required, children, className }: { label: string; required?: boolean; children: React.ReactNode; className?: string }) {
  return (
    <label className={cn("grid min-w-0 gap-1", className)}>
      <span className="font-mono text-[10px] font-semibold uppercase tracking-wide">{label}{required ? <span className="text-destructive"> *</span> : null}</span>
      {children}
    </label>
  )
}

export function SalesInvoiceWorkbench({
  documents,
  setDocuments,
  preferences,
}: {
  documents: CommercialDocument[]
  setDocuments: Dispatch<SetStateAction<CommercialDocument[]>>
  preferences: SalesInvoicePreferences
}) {
  const invoices = useMemo(() => documents.filter((document) => document.context === "sale" && document.family === "invoice"), [documents])
  const [query, setQuery] = useState("")
  const [period, setPeriod] = useState("30")
  const [status, setStatus] = useState("all")
  const [point, setPoint] = useState("all")
  const [includeAnnulled, setIncludeAnnulled] = useState(false)
  const [expandedBlocks, setExpandedBlocks] = useState<WorkBlock[]>(["query"])
  const [layoutVariant, setLayoutVariant] = useState<SalesInvoiceLayoutVariant>("contained")
  const [mode, setMode] = useState<EditorMode>("idle")
  const [activeDocument, setActiveDocument] = useState<CommercialDocument | null>(null)
  const [form, setForm] = useState<InvoiceForm>(emptyForm)
  const [items, setItems] = useState<CommercialDocumentLine[]>([])
  const [manualDiscounts, setManualDiscounts] = useState<Record<string, number>>({})
  const [notice, setNotice] = useState("")
  const [headerError, setHeaderError] = useState("")
  const [bodyError, setBodyError] = useState("")
  const { profile, visibleBlocks, headerFields, bodyColumns, footerMetrics, footerActions } = preferences

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("es")
    const anchor = new Date("2026-07-29T12:00:00")
    return invoices.filter((document) => {
      const searchable = `${document.number} ${document.partyName} ${document.partyTaxId}`.toLocaleLowerCase("es")
      const age = Math.floor((anchor.getTime() - new Date(`${document.date}T12:00:00`).getTime()) / 86_400_000)
      const matchesPeriod = period === "all" || (period === "year" ? document.date.startsWith("2026") : age <= Number(period))
      return (!normalized || searchable.includes(normalized)) &&
        matchesPeriod &&
        (status === "all" || document.status === status) &&
        (point === "all" || document.pointOfSale === point) &&
        (includeAnnulled || !/anulad/i.test(document.status))
    })
  }, [includeAnnulled, invoices, period, point, query, status])

  const statusOptions = [...new Set(invoices.map((document) => document.status))]
  const pointOptions = [...new Set(invoices.map((document) => document.pointOfSale))]
  const readOnly = mode === "view"
  const hasActiveInvoice = profile === "quick" || mode !== "idle"
  const effectiveForm = profile === "quick" && !form.client ? { ...form, client: "Consumidor Final", taxId: "0" } : form
  const headerComplete = Boolean(effectiveForm.client && effectiveForm.date && effectiveForm.point)
  const bodyComplete = items.length > 0
  const promotionalDiscountFor = (item: CommercialDocumentLine) => item.code === "41" ? 5 : 0
  const lineNet = (item: CommercialDocumentLine) => item.quantity * item.unitPrice * (1 - Math.min(100, (manualDiscounts[item.id] ?? 0) + promotionalDiscountFor(item)) / 100)
  const subtotal = items.reduce((sum, item) => sum + lineNet(item), 0)
  const taxes = items.reduce((sum, item) => sum + lineNet(item) * item.vatRate / 100, 0)
  const total = subtotal + taxes

  const expandBlocks = (...keys: WorkBlock[]) => {
    setExpandedBlocks((current) => {
      let next = [...new Set([...current, ...keys])]
      if (keys.includes("header")) next = next.filter((key) => key !== "body")
      if (keys.includes("body")) next = next.filter((key) => key !== "header")
      return next
    })
  }

  const navigateToBlock = (key: WorkBlock) => {
    if (key !== "query" && !hasActiveInvoice) return
    if (key === "header" || key === "body") {
      setExpandedBlocks((current) => current.includes(key)
        ? current.filter((item) => item !== key)
        : [...new Set([...current.filter((item) => item !== (key === "header" ? "body" : "header")), key])])
      return
    }
    setExpandedBlocks((current) => current.includes(key) ? current.filter((item) => item !== key) : [...current, key])
  }

  const updateForm = <Key extends keyof InvoiceForm>(key: Key, value: InvoiceForm[Key]) => {
    setForm((current) => ({ ...current, [key]: value }))
    setHeaderError("")
  }

  const selectDocument = (document: CommercialDocument) => {
    setActiveDocument(document)
    setForm(formFromDocument(document))
    setItems(document.items)
    setManualDiscounts({})
    setMode("view")
    setHeaderError("")
    setBodyError("")
    setExpandedBlocks(profile === "quick" ? ["body", "footer"] : ["query", "body", "footer"])
  }

  const startNew = () => {
    const quick = profile === "quick"
    setActiveDocument(null)
    setForm({
      ...emptyForm,
      client: quick ? "Consumidor Final" : "",
      taxId: quick ? "0" : "",
    })
    setItems([])
    setManualDiscounts({})
    setMode("create")
    setHeaderError("")
    setBodyError("")
    setExpandedBlocks(quick ? ["body", "footer"] : ["header", "footer"])
  }

  const closeEditor = () => {
    if (profile === "quick") {
      setMode("create")
      setActiveDocument(null)
      setForm({ ...emptyForm, client: "Consumidor Final", taxId: "0" })
      setItems([])
      setManualDiscounts({})
      setExpandedBlocks(["body", "footer"])
      return
    }
    setMode("idle")
    setActiveDocument(null)
    setItems([])
    setManualDiscounts({})
    setExpandedBlocks(["query"])
  }

  const continueFromHeader = () => {
    if (!headerComplete) {
      setHeaderError("Falta completar cliente, fecha o punto de venta")
      return
    }
    setHeaderError("")
    expandBlocks("body", "footer")
  }

  const addDemoItem = () => {
    const nextLine = items.length + 1
    const candidates: CommercialDocumentLine[] = [
      { id: `demo-line-${nextLine}-service`, code: "218", description: "Servicio mantenimiento balanza", quantity: 1, unitPrice: 589069, vatRate: 21 },
      { id: `demo-line-${nextLine}-roll`, code: "305", description: "Rollo térmico 80 x 80", quantity: 1, unitPrice: 2404.84, vatRate: 21 },
    ]
    setItems((current) => [...current, candidates[current.length % candidates.length]])
    setBodyError("")
  }

  const updateLine = (id: string, key: "quantity" | "unitPrice", value: number) => {
    setItems((current) => current.map((item) => item.id === id ? { ...item, [key]: Math.max(0, value) } : item))
  }

  const updateManualDiscount = (id: string, value: number) => {
    setManualDiscounts((current) => ({ ...current, [id]: Math.min(100, Math.max(0, value)) }))
  }

  const barcodeFor = (item: CommercialDocumentLine) => ({
    "40": "7790895000997",
    "41": "7790895643835",
    "305": "7799001300305",
  })[item.code] ?? `779000${item.code.padStart(7, "0")}`

  const createDocument = (nextStatus: string) => {
    if (!headerComplete) {
      setHeaderError("Falta completar cliente, fecha o punto de venta")
      expandBlocks("header")
      return
    }
    if (!bodyComplete) {
      setBodyError("Agregá al menos un ítem")
      expandBlocks("body")
      return
    }
    const sequence = invoices.length + 1842
    const created: CommercialDocument = {
      id: `sale-invoice-demo-${sequence}`,
      context: "sale",
      family: "invoice",
      typeLabel: "Factura A",
      date: effectiveForm.date,
      number: nextStatus.startsWith("Borrador") ? `BOR-${String(sequence).padStart(8, "0")}` : `0004-${String(sequence).padStart(8, "0")}`,
      partyName: effectiveForm.client,
      partyTaxId: effectiveForm.taxId || "30-71624518-9",
      subtotal,
      taxes,
      total,
      currency: "ARS",
      status: nextStatus,
      pointOfSale: effectiveForm.point,
      fiscalState: nextStatus.startsWith("Emitida") ? "ARCA · ejemplo" : "Pendiente de emisión",
      items,
      audit: { createdBy: "Administrador Demo", createdAt: "29/07/2026 · simulación" },
    }
    setDocuments((current) => [created, ...current])
    setActiveDocument(created)
    setForm(formFromDocument(created))
    setMode("view")
    setNotice(nextStatus.startsWith("Emitida") ? "Factura emitida en modo demostración" : "Borrador guardado")
  }

  const saveRectification = () => {
    setMode("view")
    setNotice("Rectificación preparada con trazabilidad de auditoría")
  }

  const fieldVisible = (key: HeaderFieldKey) => headerFields.includes(key)
  const effectiveBodyColumns = profile === "custom" ? bodyColumns : minimalBodyColumns
  const columnVisible = (key: BodyColumnKey) => effectiveBodyColumns.includes(key)
  const metricVisible = (key: FooterMetricKey) => footerMetrics.includes(key)
  const effectiveFooterActions = profile === "quick" && !footerActions.some((key) => quickFooterActions.includes(key))
    ? quickFooterActions
    : footerActions
  const actionVisible = (key: FooterActionKey) => effectiveFooterActions.includes(key)
  const primaryHeaderGroupVisible = (["client", "destination", "jurisdiction", "type", "point", "observations"] as HeaderFieldKey[]).some(fieldVisible)
  const commercialHeaderGroupVisible = (["currency", "condition", "seller", "priceList", "warehouse", "deliveryNote"] as HeaderFieldKey[]).some(fieldVisible)
  const administrativeHeaderGroupVisible = (["date", "internalNumber", "company", "costCenter", "batch"] as HeaderFieldKey[]).some(fieldVisible)

  const blockSummary: Record<WorkBlock, string> = {
    query: activeDocument ? `${activeDocument.typeLabel} ${activeDocument.number} · ${activeDocument.partyName} · ${money(activeDocument.total)}` : `${filtered.length} facturas disponibles`,
    header: hasActiveInvoice ? `${form.client || "Sin cliente"} · ${form.type} · ${form.point} · ${form.condition}` : "Creá o seleccioná una factura para comenzar",
    body: bodyComplete ? `${items.length} ítems · Neto ${money(subtotal)} · IVA ${money(taxes)}` : "Sin ítems cargados",
    footer: bodyComplete ? `Total ${money(total)} · ${mode === "view" ? activeDocument?.status || "Emitida" : "Pendiente de emisión"}` : "Pendiente de completar el cuerpo",
  }
  const activeBlocks: WorkBlock[] = profile === "quick" ? ["body", "footer"] : expandedBlocks
  const verticalLayout = layoutVariant === "vertical"

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-background">
      <div className="mx-auto flex min-h-0 w-full max-w-[1680px] flex-1 flex-col">
        <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b px-3 py-2 md:px-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold">Facturas de venta</h2>
              <Badge variant="outline" className="rounded-[4px] font-mono text-[10px]">Prototipo · 4 bloques</Badge>
              <Badge variant="secondary" className="rounded-[4px] font-mono text-[10px]">Perfil {profile === "quick" ? "rápido" : profile === "complete" ? "completo" : "personalizado"}</Badge>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">Consulta, carga y revisión dentro de una única superficie de trabajo.</p>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <div className="flex rounded-[4px] border bg-card p-0.5" aria-label="Variante de distribución">
              <Button size="sm" variant={verticalLayout ? "ghost" : "secondary"} className="h-8 rounded-[3px]" onClick={() => setLayoutVariant("contained")}>A · Ajustada</Button>
              <Button size="sm" variant={verticalLayout ? "secondary" : "ghost"} className="h-8 rounded-[3px]" onClick={() => setLayoutVariant("vertical")}>B · Vertical</Button>
            </div>
            <Button className="rounded-[4px] font-mono" onClick={startNew}><Plus /> Nueva factura</Button>
          </div>
        </header>

        <div className={cn("grid min-h-0 flex-1 overflow-hidden", profile === "quick" || verticalLayout ? "grid-cols-1" : "grid-cols-[108px_minmax(0,1fr)]")}>
        {profile !== "quick" && !verticalLayout ? <nav aria-label="Secciones de la factura" className="flex min-h-0 flex-col gap-1 border-r bg-muted/15 p-2">
          {blockDefinitions.filter(({ key }) => visibleBlocks.includes(key)).map((block) => {
            const Icon = block.icon
            const active = activeBlocks.includes(block.key)
            const disabled = block.key !== "query" && !hasActiveInvoice
            const complete = block.key === "query" ? Boolean(activeDocument) : block.key === "header" ? headerComplete : block.key === "body" ? bodyComplete : headerComplete && bodyComplete
            const warning = block.key === "header" ? Boolean(headerError) : block.key === "body" ? Boolean(bodyError) : false
            return (
              <button
                key={block.key}
                type="button"
                disabled={disabled}
                aria-pressed={active}
                title={disabled ? "Creá o seleccioná una factura para habilitar esta sección" : blockSummary[block.key]}
                onClick={() => navigateToBlock(block.key)}
                className={cn(
                  "relative flex min-h-14 flex-col items-start justify-center gap-1 border-l-2 px-2 text-left text-[10px] transition-colors",
                  active ? "border-primary bg-primary/8 text-primary" : "border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                  disabled && "cursor-not-allowed opacity-35"
                )}
              >
                <span className="flex w-full items-center justify-between gap-1">
                  <Icon className="size-4" />
                  {warning ? <AlertTriangle className="size-3.5 text-amber-600" /> : complete ? <CircleCheck className="size-3.5 text-emerald-600" /> : null}
                </span>
                <strong className="leading-tight">{block.label}</strong>
              </button>
            )
          })}
        </nav> : null}
        <div className={cn("flex min-h-0 flex-col", verticalLayout ? "overflow-y-auto" : "overflow-hidden")}>
        {blockDefinitions.filter(({ key }) => visibleBlocks.includes(key) && (verticalLayout || activeBlocks.includes(key)) && (verticalLayout || key === "query" || hasActiveInvoice)).map((block) => {
          const expanded = activeBlocks.includes(block.key)
          const disabled = block.key !== "query" && !hasActiveInvoice
          const complete = block.key === "query" ? Boolean(activeDocument) : block.key === "header" ? headerComplete : block.key === "body" ? bodyComplete : headerComplete && bodyComplete
          const warning = block.key === "header" ? Boolean(headerError) : block.key === "body" ? Boolean(bodyError) : false
          const regionProps = {
            block,
            vertical: verticalLayout,
            expanded,
            disabled,
            complete,
            warning,
            summary: blockSummary[block.key],
            onToggle: () => navigateToBlock(block.key),
          }

          if (block.key === "query") {
            return (
              <WorkspaceRegion key={block.key} {...regionProps}>
                <div className="grid">
                  <div className="grid gap-2 border-b p-2.5 sm:grid-cols-2 lg:grid-cols-[minmax(260px,1fr)_150px_170px_150px_auto_auto]">
                    <div className="relative">
                      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por número, cliente o CUIT" className="h-9 rounded-[4px] pl-9" />
                    </div>
                    <Select value={period} onValueChange={setPeriod}>
                      <SelectTrigger className="h-9 rounded-[4px]"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="30">Período: 30 d</SelectItem><SelectItem value="90">Período: 90 d</SelectItem><SelectItem value="year">Período: 2026</SelectItem><SelectItem value="all">Período: todo</SelectItem></SelectContent>
                    </Select>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger className="h-9 rounded-[4px]"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="all">Estado: todos</SelectItem>{statusOptions.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent>
                    </Select>
                    <Select value={point} onValueChange={setPoint}>
                      <SelectTrigger className="h-9 rounded-[4px]"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="all">Punto: todos</SelectItem>{pointOptions.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent>
                    </Select>
                    <label className="flex h-9 items-center gap-2 rounded-[4px] border bg-card px-2.5 font-mono text-[10px] font-semibold whitespace-nowrap"><Checkbox checked={includeAnnulled} onCheckedChange={(checked) => setIncludeAnnulled(Boolean(checked))} /> Anulados</label>
                    <Button variant="outline" className="h-9 rounded-[4px]" onClick={() => { setQuery(""); setPeriod("30"); setStatus("all"); setPoint("all"); setIncludeAnnulled(false) }}><RotateCcw /> Limpiar</Button>
                  </div>
                  <div className="overflow-x-auto bg-card">
                    <Table>
                      <TableHeader className="bg-muted/80"><TableRow><TableHead>Fecha</TableHead><TableHead>Número</TableHead><TableHead>Cliente</TableHead><TableHead className="text-right">Total</TableHead><TableHead>Estado</TableHead><TableHead className="w-20 text-right">Acciones</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {filtered.map((document) => (
                          <TableRow key={document.id} className={cn("cursor-pointer", activeDocument?.id === document.id && "bg-primary/5")} onClick={() => selectDocument(document)}>
                            <TableCell className="font-mono text-xs">{formatDate(document.date)}</TableCell>
                            <TableCell className="font-mono text-xs font-semibold">{document.number}</TableCell>
                            <TableCell><div className="font-medium">{document.partyName}</div><div className="font-mono text-[10px] text-muted-foreground">{document.partyTaxId}</div></TableCell>
                            <TableCell className="text-right font-mono font-semibold">{money(document.total)}</TableCell>
                            <TableCell><Badge variant="outline" className="rounded-[4px] font-mono text-[10px] text-emerald-700">{document.status}</Badge></TableCell>
                            <TableCell className="text-right"><Button size="icon-sm" variant="ghost" aria-label={`Abrir ${document.number}`}><Eye /></Button></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </WorkspaceRegion>
            )
          }

          if (block.key === "header") {
            return (
              <WorkspaceRegion key={block.key} {...regionProps}>
                {!hasActiveInvoice ? (
                  <div className="grid min-h-36 place-items-center gap-2 text-center"><FileText className="size-7 text-muted-foreground" /><div><strong>Seleccioná una factura o creá una nueva</strong><p className="text-xs text-muted-foreground">La cabecera se abrirá automáticamente con el contexto correspondiente.</p></div><Button size="sm" onClick={startNew}><Plus /> Nueva factura</Button></div>
                ) : (
                  <div>
                    {readOnly ? <div className="flex items-center gap-2 border-b bg-muted/20 px-3 py-2 text-xs text-muted-foreground"><LockKeyhole className="size-4 shrink-0" /><strong className="text-foreground">Modo consulta.</strong><span>Los datos fiscales están bloqueados; Rectificar habilita una edición controlada.</span></div> : null}
                    <div className="grid lg:grid-flow-col lg:auto-cols-fr lg:divide-x">
                      {primaryHeaderGroupVisible ? <div className="grid content-start gap-2.5 border-b p-3 sm:grid-cols-2 lg:border-b-0">
                        {fieldVisible("client") ? <FormField label="Cliente" required className="sm:col-span-2"><Select disabled={readOnly} value={form.client || undefined} onValueChange={(value) => { updateForm("client", value); updateForm("taxId", value === "Consumidor Final" ? "0" : value.includes("Almacén") ? "30-71624518-9" : "30-70983211-7") }}><SelectTrigger className="h-9 rounded-[4px]"><SelectValue placeholder="Seleccionar cliente" /></SelectTrigger><SelectContent><SelectItem value="Consumidor Final">Consumidor Final</SelectItem><SelectItem value="Almacén San Martín SRL">000184 · Almacén San Martín SRL</SelectItem><SelectItem value="Servicios Industriales NOA SA">000219 · Servicios Industriales NOA SA</SelectItem></SelectContent></Select></FormField> : null}
                        {fieldVisible("destination") ? <FormField label="Destino"><Select disabled={readOnly} value={form.destination} onValueChange={(value) => updateForm("destination", value)}><SelectTrigger className="h-9 rounded-[4px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Electrónico · Interno">Electrónico · Interno</SelectItem><SelectItem value="Comprobante electrónico">Comprobante electrónico</SelectItem></SelectContent></Select></FormField> : null}
                        {fieldVisible("jurisdiction") ? <FormField label="Jurisdicción"><Select disabled={readOnly} value={form.jurisdiction} onValueChange={(value) => updateForm("jurisdiction", value)}><SelectTrigger className="h-9 rounded-[4px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Ninguna">Ninguna</SelectItem><SelectItem value="Tucumán">Tucumán</SelectItem></SelectContent></Select></FormField> : null}
                        {fieldVisible("type") ? <FormField label="Tipo"><Select disabled={readOnly} value={form.type} onValueChange={(value) => updateForm("type", value)}><SelectTrigger className="h-9 rounded-[4px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Factura">Factura</SelectItem></SelectContent></Select></FormField> : null}
                        {fieldVisible("point") ? <FormField label="Punto de venta" required><Select disabled={readOnly} value={form.point} onValueChange={(value) => updateForm("point", value)}><SelectTrigger className="h-9 rounded-[4px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="PV 0004">PV 0004</SelectItem><SelectItem value="PV 0007">PV 0007</SelectItem></SelectContent></Select></FormField> : null}
                        {fieldVisible("observations") ? <FormField label="Observaciones" className="sm:col-span-2"><Textarea disabled={readOnly} value={form.observations} onChange={(event) => updateForm("observations", event.target.value)} className="min-h-14 rounded-[4px]" /></FormField> : null}
                      </div> : null}
                      {commercialHeaderGroupVisible ? <div className="grid content-start gap-2.5 border-b p-3 sm:grid-cols-2 lg:border-b-0">
                        {fieldVisible("currency") ? <FormField label="Moneda"><Select disabled={readOnly} value={form.currency} onValueChange={(value) => updateForm("currency", value)}><SelectTrigger className="h-9 rounded-[4px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Peso argentino">Peso argentino</SelectItem></SelectContent></Select></FormField> : null}
                        {fieldVisible("condition") ? <FormField label="Condición de venta"><Select disabled={readOnly} value={form.condition} onValueChange={(value) => updateForm("condition", value)}><SelectTrigger className="h-9 rounded-[4px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Cuenta corriente">Cuenta corriente</SelectItem><SelectItem value="Contado">Contado</SelectItem></SelectContent></Select></FormField> : null}
                        {fieldVisible("seller") ? <FormField label="Vendedor"><Select disabled={readOnly} value={form.seller} onValueChange={(value) => updateForm("seller", value)}><SelectTrigger className="h-9 rounded-[4px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Natalia Leyva">Natalia Leyva</SelectItem><SelectItem value="Sofía Romero">Sofía Romero</SelectItem></SelectContent></Select></FormField> : null}
                        {fieldVisible("priceList") ? <FormField label="Lista de precios"><Select disabled={readOnly} value={form.priceList} onValueChange={(value) => updateForm("priceList", value)}><SelectTrigger className="h-9 rounded-[4px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Mayorista">Mayorista</SelectItem><SelectItem value="Público">Público</SelectItem></SelectContent></Select></FormField> : null}
                        {fieldVisible("warehouse") ? <FormField label="Depósito" className="sm:col-span-2"><Select disabled={readOnly} value={form.warehouse} onValueChange={(value) => updateForm("warehouse", value)}><SelectTrigger className="h-9 rounded-[4px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="1 · Central">1 · Central</SelectItem><SelectItem value="2 · Norte">2 · Norte</SelectItem></SelectContent></Select></FormField> : null}
                        {fieldVisible("deliveryNote") ? <label className="flex h-9 items-center gap-2 self-end px-1 text-sm sm:col-span-2"><Checkbox disabled={readOnly} checked={form.deliveryNote} onCheckedChange={(value) => updateForm("deliveryNote", Boolean(value))} /> Generar remito automáticamente</label> : null}
                      </div> : null}
                      {administrativeHeaderGroupVisible ? <div className="grid content-start gap-2.5 p-3 sm:grid-cols-2">
                        {fieldVisible("date") ? <FormField label="Fecha" required><Input disabled={readOnly} type="date" value={form.date} onChange={(event) => updateForm("date", event.target.value)} className="h-9 rounded-[4px]" /></FormField> : null}
                        {fieldVisible("internalNumber") ? <FormField label="Número interno"><Input disabled value={form.internalNumber} className="h-9 rounded-[4px]" /></FormField> : null}
                        {fieldVisible("company") ? <FormField label="Empresa"><Input disabled={readOnly} value={form.company} onChange={(event) => updateForm("company", event.target.value)} className="h-9 rounded-[4px]" /></FormField> : null}
                        {fieldVisible("costCenter") ? <FormField label="Centro de costo"><Input disabled={readOnly} value={form.costCenter} onChange={(event) => updateForm("costCenter", event.target.value)} className="h-9 rounded-[4px]" /></FormField> : null}
                        {fieldVisible("batch") ? <FormField label="Lote" className="sm:col-span-2"><Input disabled={readOnly} value={form.batch} onChange={(event) => updateForm("batch", event.target.value)} className="h-9 rounded-[4px]" /></FormField> : null}
                      </div> : null}
                    </div>
                    <div className="flex flex-wrap justify-end gap-2 border-t px-3 py-2">
                      {readOnly ? <Button variant="outline" onClick={() => setMode("rectify")}><SlidersHorizontal /> Rectificar datos</Button> : mode === "rectify" ? <Button variant="outline" onClick={() => { if (activeDocument) { setForm(formFromDocument(activeDocument)); setItems(activeDocument.items) }; setMode("view") }}><X /> Descartar rectificación</Button> : null}
                      <Button onClick={continueFromHeader}>{readOnly ? "Ver cuerpo" : "Continuar al cuerpo"} <ChevronRight /></Button>
                    </div>
                  </div>
                )}
              </WorkspaceRegion>
            )
          }

          if (block.key === "body") {
            return (
              <WorkspaceRegion key={block.key} {...regionProps}>
                {!hasActiveInvoice ? <div className="grid min-h-28 place-items-center text-sm text-muted-foreground">Seleccioná o creá una factura para cargar el cuerpo.</div> : (
                  <div className="flex h-full min-h-0 flex-col">
                    <div className="flex shrink-0 items-center gap-2 border-b p-2">
                      <div className="relative min-w-0 flex-1">
                        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input onKeyDown={(event) => { if (event.key === "Enter" && !readOnly) addDemoItem() }} placeholder="Buscar por código de barras o descripción" className="h-10 rounded-[4px] pl-9 font-mono" />
                      </div>
                      <Button variant="outline" className="h-10 rounded-[4px]" onClick={() => readOnly ? setNotice("Favoritos disponibles al duplicar o rectificar la factura") : addDemoItem()}><Star /> Favoritos</Button>
                      <Button variant="outline" className="h-10 rounded-[4px]" onClick={() => navigateToBlock("header")}><ReceiptText /> Datos de facturación</Button>
                      <Button variant="outline" className="h-10 rounded-[4px]" onClick={() => setNotice("Acciones de caja disponibles para el comprobante actual")}><WalletCards /> Acciones de caja</Button>
                      <Button variant="outline" size="icon-lg" aria-label="Usar cámara" title="Cámara" onClick={() => setNotice("Cámara simulada para lectura de artículos")}><Camera /></Button>
                      <Button variant="outline" size="icon-lg" aria-label="Capturar peso" title="Balanza" onClick={() => setNotice("Balanza simulada: peso estable")}><Scale /></Button>
                    </div>
                    <div className="min-h-0 flex-1 overflow-auto bg-card">
                      <Table className="[&_td]:h-11 [&_td]:border-r [&_td]:px-1 [&_td]:py-0.5 [&_td]:text-center [&_th]:h-8 [&_th]:border-r [&_th]:px-1.5 [&_th]:py-0 [&_th]:text-center">
                        <TableHeader className="sticky top-0 z-10 bg-muted/95">
                          <TableRow>
                            {columnVisible("code") ? <TableHead className="w-20 font-mono text-[10px] uppercase">Código</TableHead> : null}
                            {columnVisible("quantity") ? <TableHead className="w-40 font-mono text-[10px] uppercase">Cantidad</TableHead> : null}
                            {columnVisible("description") ? <TableHead className="min-w-56 font-mono text-[10px] uppercase">Detalle</TableHead> : null}
                            {columnVisible("unitPrice") ? <TableHead className="w-36 font-mono text-[10px] uppercase">Precio unit.</TableHead> : null}
                            {columnVisible("manualDiscount") ? <TableHead className="w-40 font-mono text-[10px] uppercase">Desc. man.</TableHead> : null}
                            {columnVisible("promotionalDiscount") ? <TableHead className="w-28 font-mono text-[10px] uppercase">Desc. promo</TableHead> : null}
                            {columnVisible("vat") ? <TableHead className="w-20 font-mono text-[10px] uppercase">IVA</TableHead> : null}
                            {columnVisible("total") ? <TableHead className="w-40 font-mono text-[10px] uppercase">Importe</TableHead> : null}
                            {columnVisible("actions") ? <TableHead className="w-16 font-mono text-[10px] uppercase">Acciones</TableHead> : null}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {items.length ? items.map((item) => {
                            const manualDiscount = manualDiscounts[item.id] ?? 0
                            const promotionalDiscount = promotionalDiscountFor(item)
                            return <TableRow key={item.id} className="h-11">
                              {columnVisible("code") ? <TableCell className="font-mono text-xs">{item.code}</TableCell> : null}
                              {columnVisible("quantity") ? <TableCell><div className="flex justify-center gap-0.5"><Button disabled={readOnly} size="icon-sm" variant="ghost" className="size-7 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700" onClick={() => updateLine(item.id, "quantity", item.quantity - 1)}><Minus /></Button><Input disabled={readOnly} type="number" min="0" value={item.quantity} onChange={(event) => updateLine(item.id, "quantity", Number(event.target.value))} className="h-7 w-14 rounded-[4px] px-1 text-center font-mono" /><Button disabled={readOnly} size="icon-sm" variant="ghost" className="size-7 bg-emerald-100 text-emerald-700 hover:bg-emerald-200" onClick={() => updateLine(item.id, "quantity", item.quantity + 1)}><Plus /></Button></div></TableCell> : null}
                              {columnVisible("description") ? <TableCell className="text-center leading-tight"><strong className="block text-[11px] uppercase leading-tight">{item.description}</strong><span className="font-mono text-[9px] leading-none text-muted-foreground">{barcodeFor(item)} · Unidad</span></TableCell> : null}
                              {columnVisible("unitPrice") ? <TableCell className="font-mono text-xs">{money(item.unitPrice)}</TableCell> : null}
                              {columnVisible("manualDiscount") ? <TableCell><div className="flex justify-center gap-0.5"><Button disabled={readOnly || manualDiscount === 0} size="icon-sm" variant="ghost" className="size-7 bg-red-50 text-red-600 hover:bg-red-100" onClick={() => updateManualDiscount(item.id, manualDiscount - 1)}><Minus /></Button><Input disabled={readOnly} type="number" min="0" max="100" value={manualDiscount} onChange={(event) => updateManualDiscount(item.id, Number(event.target.value))} className="h-7 w-14 rounded-[4px] px-1 text-center font-mono" /><Button disabled={readOnly || manualDiscount === 100} size="icon-sm" variant="ghost" className="size-7 bg-emerald-100 text-emerald-700 hover:bg-emerald-200" onClick={() => updateManualDiscount(item.id, manualDiscount + 1)}><Plus /></Button></div></TableCell> : null}
                              {columnVisible("promotionalDiscount") ? <TableCell className="font-mono text-xs">{promotionalDiscount}%</TableCell> : null}
                              {columnVisible("vat") ? <TableCell className="font-mono text-xs">{item.vatRate}%</TableCell> : null}
                              {columnVisible("total") ? <TableCell className="font-mono text-xs font-semibold">{money(lineNet(item) * (1 + item.vatRate / 100))}</TableCell> : null}
                              {columnVisible("actions") ? <TableCell><Button disabled={readOnly} size="icon-sm" variant="ghost" className="size-7 bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700" onClick={() => setItems((current) => current.filter(({ id }) => id !== item.id))}><Trash2 /></Button></TableCell> : null}
                            </TableRow>
                          }) : <TableRow><TableCell colSpan={effectiveBodyColumns.length || 1} className="h-28 text-center text-sm text-muted-foreground">Todavía no hay ítems. Buscá un artículo o presioná Enter para agregarlo.</TableCell></TableRow>}
                          {items.length ? Array.from({ length: 14 }, (_, row) => <TableRow key={`empty-body-row-${row}`} className="h-10">{effectiveBodyColumns.map((column) => <TableCell key={column} />)}</TableRow>) : null}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </WorkspaceRegion>
            )
          }

          return (
            <WorkspaceRegion key={block.key} {...regionProps}>
              {!hasActiveInvoice ? <div className="grid min-h-28 place-items-center text-sm text-muted-foreground">El resumen estará disponible al crear o seleccionar una factura.</div> : (
                <div className="overflow-hidden bg-card">
                  <div className="grid gap-px border-b bg-border sm:grid-cols-3 xl:grid-cols-6">
                    {metricVisible("discount") ? <div className="bg-card p-3"><span className="font-mono text-[10px] uppercase text-muted-foreground">Bonificación</span><strong className="mt-1 block font-mono">{money(0)}</strong></div> : null}
                    {metricVisible("net") ? <div className="bg-card p-3"><span className="font-mono text-[10px] uppercase text-muted-foreground">Neto</span><strong className="mt-1 block font-mono">{money(subtotal)}</strong></div> : null}
                    {metricVisible("vat") ? <div className="bg-card p-3"><span className="font-mono text-[10px] uppercase text-muted-foreground">IVA 21 %</span><strong className="mt-1 block font-mono">{money(taxes)}</strong></div> : null}
                    {metricVisible("internalTaxes") ? <div className="bg-card p-3"><span className="font-mono text-[10px] uppercase text-muted-foreground">Imp. internos</span><strong className="mt-1 block font-mono">{money(0)}</strong></div> : null}
                    {metricVisible("perceptions") ? <div className="bg-card p-3"><span className="font-mono text-[10px] uppercase text-muted-foreground">Percepciones</span><strong className="mt-1 block font-mono">{money(0)}</strong></div> : null}
                    {metricVisible("total") ? <div className="bg-card p-3"><span className="font-mono text-[10px] uppercase text-muted-foreground">Total</span><strong className="mt-1 block font-mono text-lg">{money(total)}</strong></div> : null}
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 p-3">
                    {profile === "quick" ? (
                      <div className="grid w-full gap-2 sm:grid-cols-3 xl:ml-auto xl:max-w-3xl">
                        {actionVisible("quickCash") ? <Button disabled={readOnly || !bodyComplete} className="h-14 bg-slate-950 text-white hover:bg-slate-800" onClick={() => createDocument("Emitida · efectivo · demo")}><Banknote /> Efectivo</Button> : null}
                        {actionVisible("quickElectronicCash") ? <Button disabled={readOnly || !bodyComplete} className="h-14" onClick={() => createDocument("Emitida · F.E. efectivo · demo")}><ReceiptText /> Fac. E · Efectivo</Button> : null}
                        {actionVisible("quickElectronicCard") ? <Button disabled={readOnly || !bodyComplete} className="h-14" onClick={() => createDocument("Emitida · F.E. tarjeta · demo")}><CreditCard /> Fac. E · Tarjeta</Button> : null}
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">{readOnly ? <LockKeyhole className="size-4" /> : <CircleCheck className="size-4 text-emerald-600" />}{readOnly ? activeDocument?.status : "Validaciones listas para ejecutar"}</div>
                        <div className="flex flex-wrap justify-end gap-2">
                          {readOnly ? <><Button variant="outline" onClick={() => { setMode("create"); setActiveDocument(null); setForm((current) => ({ ...current, internalNumber: "A asignar al emitir" })) }}><Copy /> Duplicar</Button><Button variant="outline" onClick={() => setMode("rectify")}><SlidersHorizontal /> Rectificar</Button></> : null}
                          {!readOnly && actionVisible("cancel") ? <Button variant="ghost" onClick={closeEditor}>Cancelar</Button> : null}
                          {!readOnly && actionVisible("save") ? <Button variant="outline" onClick={() => mode === "rectify" ? saveRectification() : createDocument("Borrador · demo")}><FileText /> Guardar borrador</Button> : null}
                          {actionVisible("preview") ? <Button variant="outline" onClick={() => setNotice("Vista previa preparada con los datos actuales")}><Eye /> Vista previa</Button> : null}
                          {!readOnly && actionVisible("emit") ? <Button onClick={() => mode === "rectify" ? saveRectification() : createDocument("Emitida · demo")}><Send /> {mode === "rectify" ? "Guardar rectificación" : "Emitir factura"}</Button> : null}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </WorkspaceRegion>
          )
        })}
        </div>
        </div>

        {mode === "rectify" ? <Alert className="shrink-0 rounded-none border-x-0 border-b-0 border-amber-500/45 bg-amber-50/70"><AlertTriangle /><AlertTitle>Rectificación controlada</AlertTitle><AlertDescription>Los cambios se registrarán como una operación auditable. Este prototipo no sobrescribe silenciosamente el comprobante fiscal.</AlertDescription></Alert> : null}
      </div>

      {notice ? <div role="status" className="fixed right-4 bottom-4 z-50 flex max-w-sm items-center gap-2 rounded-[4px] border bg-popover px-3 py-2 text-xs shadow-xl"><Check className="size-4 text-emerald-600" /> {notice}<Button size="icon-sm" variant="ghost" onClick={() => setNotice("")}><X /></Button></div> : null}
    </div>
  )
}
