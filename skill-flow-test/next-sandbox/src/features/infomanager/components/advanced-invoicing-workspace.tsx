"use client"

import { useMemo, useState, type ReactNode } from "react"
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Circle,
  Eye,
  FileCheck2,
  Info,
  RotateCcw,
  Save,
  Search,
  Settings2,
  Trash2,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { money } from "../mock-data"
import type { AdvancedInvoicingLayout, Customer, Product } from "../types"
import { Field, Metric } from "./shared"

type HeaderBlock = "commercial" | "logistics" | "control"
type FieldKey =
  | "destination"
  | "jurisdiction"
  | "observations"
  | "currency"
  | "saleCondition"
  | "seller"
  | "priceList"
  | "warehouse"
  | "automaticDeliveryNote"
  | "internalNumber"
  | "company"
  | "costCenter"
  | "batch"
type ColumnKey = "account" | "unit" | "quantity" | "unitPrice" | "discount" | "finalPrice" | "auxiliary" | "vat" | "amount"
type WorkflowStepId = "terms" | "taxes" | "delivery" | "source" | "payments"
type StagedStepId = "document" | "items" | "conditions" | "review"

const stagedStepOrder: StagedStepId[] = ["document", "items", "conditions", "review"]

type InvoiceLine = {
  id: string
  productId: string
  code: string
  account: string
  description: string
  unit: string
  quantity: number
  unitPrice: number
  discountPercent: number
  vatRate: number
  auxiliary: string
}

const blockLabels: Record<HeaderBlock, string> = {
  commercial: "Condiciones comerciales",
  logistics: "Logística",
  control: "Control interno",
}

const extensionDetails: Record<string, { title: string; description: string }> = {
  perceptions: { title: "Percepciones y retenciones", description: "Carga y revisión de percepciones asociadas al comprobante." },
  "due-dates": { title: "Vencimientos", description: "Organización de cuotas y fechas para operaciones a cuenta corriente." },
  "delivery-notes": { title: "Remitos", description: "Asociación o generación de remitos desde la factura." },
  budgets: { title: "Presupuestos", description: "Vinculación de presupuestos de origen y su trazabilidad." },
  payments: { title: "Pagos", description: "Registro de uno o varios medios de pago asociados a la factura." },
}

const fieldGroups: { title: string; fields: { key: FieldKey; label: string }[] }[] = [
  {
    title: "Cliente y comprobante",
    fields: [
      { key: "destination", label: "Destino" },
      { key: "jurisdiction", label: "Jurisdicción" },
      { key: "observations", label: "Observaciones" },
    ],
  },
  {
    title: "Condiciones comerciales",
    fields: [
      { key: "currency", label: "Moneda" },
      { key: "saleCondition", label: "Condición de venta" },
      { key: "seller", label: "Vendedor" },
      { key: "priceList", label: "Lista de precios" },
    ],
  },
  {
    title: "Logística",
    fields: [
      { key: "warehouse", label: "Depósito" },
      { key: "automaticDeliveryNote", label: "Generar remito automáticamente" },
    ],
  },
  {
    title: "Control interno",
    fields: [
      { key: "internalNumber", label: "Número interno" },
      { key: "company", label: "Empresa" },
      { key: "costCenter", label: "Centro de costo" },
      { key: "batch", label: "Lote" },
    ],
  },
]

const columnLabels: Record<ColumnKey, string> = {
  account: "Cuenta",
  unit: "Unidad",
  quantity: "Cantidad",
  unitPrice: "Precio unitario",
  discount: "Descuento",
  finalPrice: "Precio final",
  auxiliary: "Detalle auxiliar",
  vat: "IVA",
  amount: "Importe",
}

const initialBlocks: Record<HeaderBlock, boolean> = {
  commercial: true,
  logistics: true,
  control: true,
}

const initialFields: Record<FieldKey, boolean> = {
  destination: true,
  jurisdiction: true,
  observations: true,
  currency: true,
  saleCondition: true,
  seller: true,
  priceList: true,
  warehouse: true,
  automaticDeliveryNote: true,
  internalNumber: true,
  company: true,
  costCenter: true,
  batch: true,
}

const initialColumns: Record<ColumnKey, boolean> = {
  account: true,
  unit: true,
  quantity: true,
  unitPrice: true,
  discount: true,
  finalPrice: true,
  auxiliary: true,
  vat: true,
  amount: true,
}

const initialLine: InvoiceLine = {
  id: "legacy-line-1",
  productId: "legacy-abono",
  code: "ABONO-PRO",
  account: "Abono mensual",
  description: "Abono Pro · Agosto 2026",
  unit: "UN",
  quantity: 1,
  unitPrice: 589069,
  discountPercent: 30,
  vatRate: 21,
  auxiliary: "Servicio mensual",
}

const gridFillerStyle = {
  backgroundImage:
    "repeating-linear-gradient(to bottom, transparent 0, transparent 47px, var(--border) 48px)",
}

function FieldCard({
  title,
  className,
  children,
}: {
  title: string
  className?: string
  children: ReactNode
}) {
  return (
    <section className={cn("min-w-0 rounded-[4px] border bg-card", className)}>
      <h2 className="sr-only">{title}</h2>
      <div className="p-3">{children}</div>
    </section>
  )
}

function ConfigToggle({
  label,
  checked,
  disabled,
  onChange,
}: {
  label: string
  checked: boolean
  disabled?: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label className={cn("flex items-center gap-3 rounded-[4px] border px-3 py-2.5 text-sm", disabled && "bg-muted/40 text-muted-foreground")}>
      <Checkbox checked={checked} disabled={disabled} onCheckedChange={(value) => onChange(value === true)} />
      <span className="min-w-0 flex-1">{label}</span>
      {disabled ? <Badge variant="outline" className="font-mono text-[9px]">Anclaje</Badge> : null}
    </label>
  )
}

function IssuedInvoiceDialog({
  open,
  onOpenChange,
  fiscalLetter,
  documentType,
  pointOfSale,
  date,
  currency,
  seller,
  warehouse,
  destination,
  jurisdiction,
  customer,
  saleCondition,
  priceList,
  observations,
  dueDays,
  automaticDeliveryNote,
  linkedBudget,
  paymentConfigured,
  paymentMethod,
  hasPerceptions,
  lines,
  totals,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  fiscalLetter: string
  documentType: string
  pointOfSale: string
  date: string
  currency: string
  seller: string
  warehouse: string
  destination: string
  jurisdiction: string
  customer?: Customer
  saleCondition: string
  priceList: string
  observations: string
  dueDays: string
  automaticDeliveryNote: boolean
  linkedBudget: string
  paymentConfigured: boolean
  paymentMethod: string
  hasPerceptions: boolean
  lines: InvoiceLine[]
  totals: { discount: number; net: number; vat: number; total: number; quantity: number }
}) {
  const issuedNumber = `${pointOfSale}-00001842`
  const displayDate = date.split("-").reverse().join("/")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[min(94dvh,980px)] w-[min(97vw,1540px)] max-w-none grid-rows-[auto_minmax(0,1fr)_auto] gap-0 overflow-hidden p-0 sm:max-h-[94dvh] sm:max-w-none" showCloseButton={false}>
        <DialogHeader className="flex-row items-center gap-3 border-b border-emerald-200 bg-emerald-50 px-5 py-3 text-left dark:border-emerald-900 dark:bg-emerald-950/50">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-emerald-600 text-white"><CheckCircle2 className="size-6" /></span>
          <div className="min-w-0 flex-1">
            <DialogTitle className="text-base text-emerald-950 dark:text-emerald-100">Factura emitida correctamente</DialogTitle>
            <DialogDescription className="mt-0.5 text-xs text-emerald-800 dark:text-emerald-300">Comprobante {issuedNumber} · La emisión y sus efectos se encuentran simulados en este prototipo.</DialogDescription>
          </div>
          <Badge className="hidden border-emerald-300 bg-white text-emerald-800 sm:inline-flex dark:bg-emerald-950 dark:text-emerald-200" variant="outline">Emitida · demo</Badge>
        </DialogHeader>

        <div className="min-h-0 overflow-y-auto bg-muted/20 p-3">
          <section aria-label="Comprobante emitido" className="relative mx-auto min-h-full max-w-[1480px] overflow-hidden rounded-[4px] border bg-card shadow-sm">
            <div className="grid lg:grid-cols-2">
              <section className="border-b p-4 lg:border-r lg:border-b-0 lg:pr-10">
                <div className="flex items-start justify-between gap-3 border-b pb-3">
                  <div><div className="flex items-center gap-2"><h3 className="text-xl font-semibold">{documentType}</h3><Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-800">Emitida</Badge></div><p className="mt-1 font-mono text-[11px] text-muted-foreground">PV {pointOfSale} · N° {issuedNumber}</p></div>
                  <div className="text-right"><div className="font-mono text-[9px] uppercase text-muted-foreground">Fecha de emisión</div><strong className="font-mono text-sm">{displayDate}</strong></div>
                </div>
                <dl className="mt-4 grid gap-x-5 gap-y-3 text-xs sm:grid-cols-2">
                  <div><dt className="font-mono text-[9px] font-semibold uppercase text-muted-foreground">Moneda</dt><dd className="mt-1 font-medium">{currency === "ARS" ? "$ · Peso argentino" : "US$ · Dólar estadounidense"}</dd></div>
                  <div><dt className="font-mono text-[9px] font-semibold uppercase text-muted-foreground">Vendedor</dt><dd className="mt-1 font-medium">{seller}</dd></div>
                  <div><dt className="font-mono text-[9px] font-semibold uppercase text-muted-foreground">Destino</dt><dd className="mt-1 font-medium">{destination}</dd></div>
                  <div><dt className="font-mono text-[9px] font-semibold uppercase text-muted-foreground">Jurisdicción</dt><dd className="mt-1 font-medium">{jurisdiction}</dd></div>
                  <div><dt className="font-mono text-[9px] font-semibold uppercase text-muted-foreground">Entrega</dt><dd className="mt-1 font-medium">{automaticDeliveryNote ? `Remito desde ${warehouse}` : "Sin remito"}</dd></div>
                  <div><dt className="font-mono text-[9px] font-semibold uppercase text-muted-foreground">Origen</dt><dd className="mt-1 font-medium">{linkedBudget || "Sin documento vinculado"}</dd></div>
                </dl>
              </section>

              <section className="border-b p-4 lg:pl-10">
                <div className="flex items-start justify-between gap-3 border-b pb-3"><div><h3 className="text-sm font-semibold">Datos del cliente</h3><p className="mt-0.5 text-xs text-muted-foreground">Receptor del comprobante</p></div><Badge variant="outline" className="font-mono text-[9px]">{customer?.vatCategory ?? "Sin condición fiscal"}</Badge></div>
                <div className="py-3"><div className="text-base font-semibold">{customer?.code} · {customer?.name}</div><dl className="mt-3 grid gap-x-5 gap-y-2 text-xs sm:grid-cols-2"><div><dt className="font-mono text-[9px] font-semibold uppercase text-muted-foreground">CUIT</dt><dd className="mt-0.5 font-mono">{customer?.document}</dd></div><div><dt className="font-mono text-[9px] font-semibold uppercase text-muted-foreground">Domicilio</dt><dd className="mt-0.5">{customer?.address}</dd></div><div><dt className="font-mono text-[9px] font-semibold uppercase text-muted-foreground">Teléfono</dt><dd className="mt-0.5">{customer?.phone}</dd></div><div><dt className="font-mono text-[9px] font-semibold uppercase text-muted-foreground">Condición IVA</dt><dd className="mt-0.5">{customer?.vatCategory}</dd></div></dl></div>
                <dl className="grid gap-x-5 gap-y-2 border-t pt-3 text-xs sm:grid-cols-2"><div><dt className="font-mono text-[9px] font-semibold uppercase text-muted-foreground">Condición de venta</dt><dd className="mt-0.5 font-medium">{saleCondition}{saleCondition === "Cuenta corriente" ? ` · ${dueDays} días` : ""}</dd></div><div><dt className="font-mono text-[9px] font-semibold uppercase text-muted-foreground">Lista de precios</dt><dd className="mt-0.5 font-medium">{priceList}</dd></div><div><dt className="font-mono text-[9px] font-semibold uppercase text-muted-foreground">Pago</dt><dd className="mt-0.5 font-medium">{paymentConfigured ? paymentMethod : "Pendiente · cobrar desde Cobros"}</dd></div><div><dt className="font-mono text-[9px] font-semibold uppercase text-muted-foreground">Percepciones</dt><dd className="mt-0.5 font-medium">{hasPerceptions ? "Con carga adicional" : "No aplica"}</dd></div></dl>
                {observations ? <div className="mt-3 border-t pt-3"><div className="font-mono text-[9px] font-semibold uppercase text-muted-foreground">Observaciones</div><p className="mt-1 text-xs">{observations}</p></div> : null}
              </section>
            </div>

            <div className="absolute top-4 left-1/2 z-10 hidden size-20 -translate-x-1/2 place-items-center border-2 bg-card shadow-sm lg:grid"><div className="text-center"><div className="font-mono text-3xl font-bold">{fiscalLetter}</div><div className="mt-1 font-mono text-[8px] font-semibold">CÓD. 01</div></div></div>

            <section className="border-t-0">
              <div className="flex items-center justify-between border-b bg-muted/20 px-4 py-2"><div><h3 className="text-sm font-semibold">Ítems facturados</h3><p className="text-[10px] text-muted-foreground">Cantidad total {totals.quantity.toLocaleString("es-AR")}</p></div><Badge variant="outline" className="font-mono text-[9px]">{lines.length} {lines.length === 1 ? "renglón" : "renglones"}</Badge></div>
              <div className="overflow-x-auto">
                <Table className="min-w-[920px] table-fixed"><TableHeader><TableRow><TableHead className="w-[30%]">Artículo</TableHead><TableHead className="w-[15%]">Cuenta</TableHead><TableHead className="w-[8%] text-right">Cantidad</TableHead><TableHead className="w-[13%] text-right">Precio unit.</TableHead><TableHead className="w-[9%] text-right">Dto.</TableHead><TableHead className="w-[8%] text-right">IVA</TableHead><TableHead className="w-[17%] text-right">Importe</TableHead></TableRow></TableHeader><TableBody>{lines.map((line) => { const net = line.unitPrice * line.quantity * (1 - line.discountPercent / 100); const amount = net * (1 + line.vatRate / 100); return <TableRow key={line.id}><TableCell><div className="font-medium">{line.description}</div><div className="font-mono text-[9px] text-muted-foreground">{line.code}{line.auxiliary ? ` · ${line.auxiliary}` : ""}</div></TableCell><TableCell className="text-xs">{line.account}</TableCell><TableCell className="text-right font-mono">{line.quantity}</TableCell><TableCell className="text-right font-mono">{money(line.unitPrice)}</TableCell><TableCell className="text-right font-mono">{line.discountPercent}%</TableCell><TableCell className="text-right font-mono">{line.vatRate}%</TableCell><TableCell className="text-right font-mono font-semibold">{money(amount)}</TableCell></TableRow> })}</TableBody></Table>
              </div>
            </section>

            <section className="grid gap-4 border-t bg-muted/10 px-4 py-3 sm:grid-cols-4"><Metric label="Bonificación" value={money(totals.discount)} /><Metric label="Neto" value={money(totals.net)} /><Metric label="IVA" value={money(totals.vat)} /><div className="border-t pt-3 text-right sm:border-t-0 sm:border-l sm:pt-0 sm:pl-4"><div className="font-mono text-[9px] font-semibold uppercase text-muted-foreground">Total emitido</div><div className="font-mono text-xl font-bold">{money(totals.total)}</div></div></section>
          </section>
        </div>

        <DialogFooter className="flex-row items-center justify-between px-4 py-3">
          <div className="hidden text-xs text-muted-foreground sm:block">La factura quedó disponible en Ventas → Documentos.</div>
          <DialogClose asChild><Button>Cerrar comprobante</Button></DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function AdvancedInvoicingWorkspace({
  layout,
  customers,
  products,
}: {
  layout: AdvancedInvoicingLayout
  customers: Customer[]
  products: Product[]
}) {
  const defaultCustomer = customers.find((customer) => customer.id === "c-2") ?? customers.find((customer) => customer.active) ?? customers[0]
  const [configOpen, setConfigOpen] = useState(false)
  const [internalDataOpen, setInternalDataOpen] = useState(false)
  const [blocks, setBlocks] = useState(initialBlocks)
  const [fields, setFields] = useState(initialFields)
  const [columns, setColumns] = useState(initialColumns)
  const [customerId, setCustomerId] = useState(defaultCustomer?.id ?? "")
  const [destination, setDestination] = useState("Comprobante electrónico · Interno")
  const [documentType, setDocumentType] = useState("Factura")
  const [pointOfSale, setPointOfSale] = useState("00002")
  const [jurisdiction, setJurisdiction] = useState("Ninguna")
  const [observations, setObservations] = useState("Factura Agosto 2026")
  const [currency, setCurrency] = useState("ARS")
  const [saleCondition, setSaleCondition] = useState(defaultCustomer?.saleCondition ?? "Cuenta corriente")
  const [seller, setSeller] = useState("Natalia Leyva")
  const [priceList, setPriceList] = useState(defaultCustomer?.priceList ?? "Abono Pro")
  const [warehouse, setWarehouse] = useState("Central")
  const [automaticDeliveryNote, setAutomaticDeliveryNote] = useState(false)
  const [date, setDate] = useState("2026-07-29")
  const [company, setCompany] = useState("Empresa 7")
  const [costCenter, setCostCenter] = useState("1")
  const [batch, setBatch] = useState("")
  const [lines, setLines] = useState<InvoiceLine[]>([initialLine])
  const [productQuery, setProductQuery] = useState("")
  const [activeExtension, setActiveExtension] = useState("items")
  const [workflowStep, setWorkflowStep] = useState<WorkflowStepId | null>(null)
  const [dueDays, setDueDays] = useState("30")
  const [hasPerceptions, setHasPerceptions] = useState(false)
  const [deliveryConfigured, setDeliveryConfigured] = useState(false)
  const [linkedBudget, setLinkedBudget] = useState("")
  const [paymentStatus, setPaymentStatus] = useState("Pendiente")
  const [paymentConfigured, setPaymentConfigured] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("Transferencia")
  const [linkBudgetEnabled, setLinkBudgetEnabled] = useState(false)
  const [stagedStep, setStagedStep] = useState<StagedStepId>("document")
  const [stagedTouched, setStagedTouched] = useState<Record<StagedStepId, boolean>>({
    document: false,
    items: false,
    conditions: false,
    review: false,
  })
  const [issueSuccessOpen, setIssueSuccessOpen] = useState(false)
  const [notice, setNotice] = useState("")
  const [error, setError] = useState("")

  const activeCustomer = customers.find((customer) => customer.id === customerId)
  const visibleBlockCount = 1 + Object.values(blocks).filter(Boolean).length
  const hiddenFieldCount = Object.values(fields).filter((visible) => !visible).length
  const hiddenColumnCount = Object.values(columns).filter((visible) => !visible).length
  const visibleItemColumnCount = 2 + Object.values(columns).filter(Boolean).length

  const totals = useMemo(() => {
    return lines.reduce(
      (result, line) => {
        const base = line.unitPrice * line.quantity
        const discount = base * (line.discountPercent / 100)
        const net = base - discount
        const vat = net * (line.vatRate / 100)
        return {
          base: result.base + base,
          discount: result.discount + discount,
          net: result.net + net,
          vat: result.vat + vat,
          total: result.total + net + vat,
          quantity: result.quantity + line.quantity,
        }
      },
      { base: 0, discount: 0, net: 0, vat: 0, total: 0, quantity: 0 }
    )
  }, [lines])

  const productSuggestions = useMemo(() => {
    const query = productQuery.trim().toLocaleLowerCase("es")
    if (!query) return []
    return products
      .filter((product) =>
        product.active &&
        product.salePrice !== null &&
        [product.code, product.barcode, product.name].some((value) =>
          value.toLocaleLowerCase("es").includes(query)
        )
      )
      .slice(0, 6)
  }, [productQuery, products])

  const workflowSteps: {
    id: WorkflowStepId
    label: string
    detail: string
    status: "defined" | "optional" | "missing"
    statusLabel: "Definido" | "Opcional" | "Falta definir"
  }[] = [
    {
      id: "terms",
      label: "Cobro",
      detail: saleCondition === "Cuenta corriente" ? `1 cuota · ${dueDays} días` : saleCondition,
      status: "defined",
      statusLabel: "Definido",
    },
    {
      id: "taxes",
      label: "Impuestos",
      detail: hasPerceptions ? "Con percepciones" : "No aplica",
      status: "defined",
      statusLabel: "Definido",
    },
    {
      id: "delivery",
      label: "Entrega",
      detail: deliveryConfigured ? (automaticDeliveryNote ? "Remito automático" : "Sin remito") : "Sin definir",
      status: deliveryConfigured ? "defined" : "missing",
      statusLabel: deliveryConfigured ? "Definido" : "Falta definir",
    },
    {
      id: "source",
      label: "Origen",
      detail: linkedBudget || "Sin vincular",
      status: linkedBudget ? "defined" : "optional",
      statusLabel: linkedBudget ? "Definido" : "Opcional",
    },
    {
      id: "payments",
      label: "Pagos",
      detail: paymentConfigured ? (paymentStatus === "Registrado" ? "Pago registrado" : "Registrar después") : "Sin definir",
      status: paymentConfigured ? "defined" : "missing",
      statusLabel: paymentConfigured ? "Definido" : "Falta definir",
    },
  ]
  const activeWorkflowStep = workflowSteps.find((step) => step.id === workflowStep) ?? null
  const definedWorkflowStepCount = workflowSteps.filter((step) => step.status !== "missing").length
  const firstMissingWorkflowStep = workflowSteps.find((step) => step.status === "missing") ?? null
  const stagedDocumentValid = Boolean(customerId && documentType && pointOfSale && date && currency && saleCondition)
  const stagedItemsValid = lines.length > 0 && lines.every((line) => line.quantity > 0 && line.unitPrice >= 0)
  const stagedConditionsValid =
    (saleCondition !== "Cuenta corriente" || Number(dueDays) > 0) &&
    (!automaticDeliveryNote || Boolean(warehouse)) &&
    (!linkBudgetEnabled || Boolean(linkedBudget.trim())) &&
    (!paymentConfigured || Boolean(paymentMethod))
  const stagedValidity: Record<StagedStepId, boolean> = {
    document: stagedDocumentValid,
    items: stagedItemsValid,
    conditions: stagedConditionsValid,
    review: stagedDocumentValid && stagedItemsValid && stagedConditionsValid,
  }
  const stagedSteps: { id: StagedStepId; label: string; description: string }[] = [
    { id: "document", label: "Documento", description: "Cliente y datos base" },
    { id: "items", label: "Ítems", description: `${lines.length} ${lines.length === 1 ? "artículo" : "artículos"}` },
    { id: "conditions", label: "Condiciones", description: saleCondition === "Cuenta corriente" ? `Vence en ${dueDays || "—"} días` : saleCondition },
    { id: "review", label: "Revisión", description: "Control y emisión" },
  ]

  const showBlock = (block: HeaderBlock) => blocks[block]
  const showField = (field: FieldKey) => fields[field]

  const selectCustomer = (id: string) => {
    const customer = customers.find((candidate) => candidate.id === id)
    setCustomerId(id)
    if (customer) {
      setSaleCondition(customer.saleCondition)
      setPriceList(customer.priceList)
    }
  }

  const updateLine = (id: string, patch: Partial<InvoiceLine>) => {
    setLines((current) => current.map((line) => (line.id === id ? { ...line, ...patch } : line)))
  }

  const addProduct = (product: Product) => {
    if (product.salePrice === null) return
    const salePrice = product.salePrice
    const vatRate = Number.parseFloat(product.vat) || 21
    setLines((current) => [
      ...current,
      {
        id: `advanced-line-${Date.now()}`,
        productId: product.id,
        code: product.code,
        account: product.accountingAccount || "Ventas",
        description: product.name,
        unit: product.unit || "UN",
        quantity: 1,
        unitPrice: salePrice / (1 + vatRate / 100),
        discountPercent: product.discountPercent ?? 0,
        vatRate,
        auxiliary: "",
      },
    ])
    setProductQuery("")
    setError("")
  }

  const submitProductSearch = () => {
    const query = productQuery.trim().toLocaleLowerCase("es")
    const exact = productSuggestions.find((product) =>
      product.code.toLocaleLowerCase("es") === query ||
      product.barcode.toLocaleLowerCase("es") === query
    )
    const match = exact ?? (productSuggestions.length === 1 ? productSuggestions[0] : null)
    if (match) {
      addProduct(match)
    } else if (!productSuggestions.length && query) {
      setError(`No encontramos artículos para “${productQuery.trim()}”.`)
    }
  }

  const resetConfiguration = () => {
    setBlocks(initialBlocks)
    setFields(initialFields)
    setColumns(initialColumns)
  }

  const useEssentialPreset = () => {
    setBlocks({ commercial: true, logistics: false, control: true })
    setFields({
      ...initialFields,
      destination: false,
      jurisdiction: false,
      observations: true,
      warehouse: false,
      automaticDeliveryNote: false,
      internalNumber: true,
      company: false,
      costCenter: false,
      batch: false,
    })
    setColumns({
      ...initialColumns,
      account: false,
      unit: false,
      finalPrice: false,
      auxiliary: false,
    })
  }

  const emit = () => {
    if (!customerId) {
      setError("Seleccioná un cliente antes de emitir.")
      return
    }
    if (!lines.length) {
      setError("Agregá al menos un ítem antes de emitir.")
      return
    }
    setError("")
    setNotice("Emisión simulada: la factura quedó lista para validación fiscal.")
    setIssueSuccessOpen(true)
    window.setTimeout(() => setNotice(""), 4000)
  }

  const stagedValidationMessage = (step: StagedStepId) => {
    if (step === "document") return "Completá cliente, tipo, punto de venta, fecha, moneda y condición de venta."
    if (step === "items") return "Agregá al menos un ítem y revisá que cantidad y precio sean válidos."
    if (saleCondition === "Cuenta corriente" && Number(dueDays) <= 0) return "Definí el primer vencimiento de la cuenta corriente."
    if (automaticDeliveryNote && !warehouse) return "Seleccioná el depósito desde el que se generará el remito."
    if (linkBudgetEnabled && !linkedBudget.trim()) return "Indicá qué presupuesto origina esta factura."
    if (paymentConfigured && !paymentMethod) return "Seleccioná el medio de pago."
    return "Revisá las condiciones necesarias para esta factura."
  }

  const goToStagedStep = (nextStep: StagedStepId) => {
    const nextIndex = stagedStepOrder.indexOf(nextStep)
    const firstInvalid = stagedStepOrder.slice(0, nextIndex).find((step) => !stagedValidity[step])

    if (firstInvalid) {
      setStagedTouched((current) => ({ ...current, [firstInvalid]: true }))
      setStagedStep(firstInvalid)
      setError(stagedValidationMessage(firstInvalid))
      return
    }

    setStagedTouched((current) => ({ ...current, [stagedStep]: true }))
    setStagedStep(nextStep)
    setError("")
  }

  const advanceStagedStep = () => {
    if (!stagedValidity[stagedStep]) {
      setStagedTouched((current) => ({ ...current, [stagedStep]: true }))
      setError(stagedValidationMessage(stagedStep))
      return
    }

    const currentIndex = stagedStepOrder.indexOf(stagedStep)
    const nextStep = stagedStepOrder[currentIndex + 1]
    setStagedTouched((current) => ({ ...current, [stagedStep]: true }))
    setError("")
    if (nextStep) setStagedStep(nextStep)
  }

  const emitStagedInvoice = () => {
    const firstInvalid = stagedStepOrder.slice(0, 3).find((step) => !stagedValidity[step])
    setStagedTouched({ document: true, items: true, conditions: true, review: true })

    if (firstInvalid) {
      setStagedStep(firstInvalid)
      setError(stagedValidationMessage(firstInvalid))
      return
    }

    emit()
  }

  const fiscalLetter = activeCustomer?.vatCategory === "Responsable inscripto" ? "A" : "B"
  const issuedInvoiceDialog = (
    <IssuedInvoiceDialog
      open={issueSuccessOpen}
      onOpenChange={setIssueSuccessOpen}
      fiscalLetter={fiscalLetter}
      documentType={documentType}
      pointOfSale={pointOfSale}
      date={date}
      currency={currency}
      seller={seller}
      warehouse={warehouse}
      destination={destination}
      jurisdiction={jurisdiction}
      customer={activeCustomer}
      saleCondition={saleCondition}
      priceList={priceList}
      observations={observations}
      dueDays={dueDays}
      automaticDeliveryNote={automaticDeliveryNote}
      linkedBudget={linkedBudget}
      paymentConfigured={paymentConfigured}
      paymentMethod={paymentMethod}
      hasPerceptions={hasPerceptions}
      lines={lines}
      totals={totals}
    />
  )

  if (layout === "staged") {
    const stagedStepIndex = stagedStepOrder.indexOf(stagedStep)
    const stagedReady = stagedValidity.review

    return (
      <div data-testid="advanced-invoicing-workspace-staged" className="flex h-full min-h-0 flex-col overflow-hidden bg-muted/20">
        <section className="shrink-0 border-b bg-card" aria-label="Factura avanzada por etapas">
          <div className="flex min-h-14 flex-wrap items-center justify-between gap-3 px-4 py-2">
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid size-10 shrink-0 place-items-center rounded-[4px] border border-emerald-300 bg-emerald-100 font-mono text-xl font-bold text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-100">
                {fiscalLetter}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-sm font-semibold">Nueva {documentType.toLocaleLowerCase("es")}</h2>
                  <Badge variant="outline" className="h-5 border-amber-300 bg-amber-50 px-1.5 text-[10px] text-amber-800">Borrador</Badge>
                  <span className="font-mono text-[10px] text-muted-foreground">Interno 51950660</span>
                </div>
                <p className="truncate text-[11px] text-muted-foreground">
                  {activeCustomer?.name ?? "Sin cliente"} · PV {pointOfSale} · {currency}
                </p>
              </div>
            </div>
            <div className="hidden items-center gap-5 text-right lg:flex">
              <div><div className="font-mono text-[9px] uppercase text-muted-foreground">Neto</div><div className="font-mono text-xs font-semibold">{money(totals.net)}</div></div>
              <div><div className="font-mono text-[9px] uppercase text-muted-foreground">IVA</div><div className="font-mono text-xs font-semibold">{money(totals.vat)}</div></div>
              <div className="border-l pl-5"><div className="font-mono text-[9px] uppercase text-muted-foreground">Total</div><div className="font-mono text-base font-bold">{money(totals.total)}</div></div>
            </div>
          </div>

          <nav className="grid grid-cols-4 border-t" aria-label="Etapas de la factura">
            {stagedSteps.map((step, index) => {
              const isCurrent = stagedStep === step.id
              const hasError = stagedTouched[step.id] && !stagedValidity[step.id]
              const isComplete = stagedValidity[step.id] && (stagedTouched[step.id] || index < stagedStepIndex)
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => goToStagedStep(step.id)}
                  aria-current={isCurrent ? "step" : undefined}
                  className={cn(
                    "group relative flex min-w-0 items-center justify-center gap-2 border-r px-2 py-2 text-left last:border-r-0 hover:bg-muted/60",
                    isCurrent && "bg-primary/5",
                    hasError && "bg-destructive/5"
                  )}
                >
                  <span className={cn(
                    "grid size-6 shrink-0 place-items-center rounded-full border font-mono text-[10px] font-semibold",
                    isCurrent && "border-primary bg-primary text-primary-foreground",
                    !isCurrent && isComplete && "border-emerald-300 bg-emerald-50 text-emerald-700",
                    !isCurrent && hasError && "border-destructive bg-destructive/10 text-destructive",
                    !isCurrent && !isComplete && !hasError && "bg-background text-muted-foreground"
                  )}>
                    {!isCurrent && isComplete ? <CheckCircle2 className="size-3.5" /> : !isCurrent && hasError ? <AlertCircle className="size-3.5" /> : index + 1}
                  </span>
                  <span className="hidden min-w-0 sm:block">
                    <span className={cn("block truncate text-[11px] font-semibold", isCurrent && "text-primary", hasError && "text-destructive")}>{step.label}</span>
                    <span className="block truncate text-[9px] text-muted-foreground">{hasError ? "Requiere atención" : step.description}</span>
                  </span>
                  {isCurrent ? <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary" /> : null}
                </button>
              )
            })}
          </nav>
        </section>

        <main className="min-h-0 flex-1 overflow-y-auto p-3 lg:p-4">
          {error && !stagedValidity[stagedStep] ? (
            <div className="mx-auto mb-3 flex max-w-7xl items-start gap-2 rounded-[4px] border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <div><strong className="block">Hay datos pendientes en {stagedSteps[stagedStepIndex].label}</strong><span>{error}</span></div>
            </div>
          ) : null}

          {stagedStep === "document" ? (
            <div className="mx-auto grid max-w-7xl gap-3 xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)]">
              <section className="rounded-[4px] border bg-card">
                <div className="border-b px-4 py-3"><h3 className="text-sm font-semibold">Cliente y comprobante</h3><p className="mt-0.5 text-xs text-muted-foreground">Estos datos determinan la letra fiscal y las reglas de la factura.</p></div>
                <div className="grid gap-3 p-4 sm:grid-cols-6">
                  <Field label="Cliente" required className="sm:col-span-6">
                    <Select value={customerId} onValueChange={selectCustomer}>
                      <SelectTrigger className={cn("w-full", stagedTouched.document && !customerId && "border-destructive")}><SelectValue placeholder="Seleccionar cliente" /></SelectTrigger>
                      <SelectContent>{customers.filter((customer) => customer.active).map((customer) => <SelectItem key={customer.id} value={customer.id}>{customer.code} · {customer.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </Field>
                  <Field label="Tipo" required className="sm:col-span-2"><Select value={documentType} onValueChange={setDocumentType}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Factura">Factura</SelectItem><SelectItem value="Nota de débito">Nota de débito</SelectItem><SelectItem value="Nota de crédito">Nota de crédito</SelectItem></SelectContent></Select></Field>
                  <Field label="Punto de venta" required className="sm:col-span-2"><Select value={pointOfSale} onValueChange={setPointOfSale}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="00002">PV 00002</SelectItem><SelectItem value="00004">PV 00004</SelectItem></SelectContent></Select></Field>
                  <Field label="Fecha" required className="sm:col-span-2"><Input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></Field>
                  <Field label="Destino" className="sm:col-span-3"><Select value={destination} onValueChange={setDestination}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Comprobante electrónico · Interno">Electrónico · Interno</SelectItem><SelectItem value="Comprobante electrónico · ARCA">Electrónico · ARCA</SelectItem></SelectContent></Select></Field>
                  <Field label="Jurisdicción" className="sm:col-span-3"><Select value={jurisdiction} onValueChange={setJurisdiction}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Ninguna">Ninguna</SelectItem><SelectItem value="Tucumán">Tucumán</SelectItem><SelectItem value="Convenio multilateral">Convenio multilateral</SelectItem></SelectContent></Select></Field>
                  <Field label="Observaciones" className="sm:col-span-6"><Textarea value={observations} onChange={(event) => setObservations(event.target.value)} className="min-h-20 resize-none" /></Field>
                </div>
              </section>

              <div className="grid content-start gap-3">
                <section className="rounded-[4px] border bg-card">
                  <div className="border-b px-4 py-3"><h3 className="text-sm font-semibold">Condiciones comerciales</h3><p className="mt-0.5 text-xs text-muted-foreground">Definen precios y condiciones iniciales; los vencimientos se completan después.</p></div>
                  <div className="grid gap-3 p-4 sm:grid-cols-2">
                    <Field label="Moneda" required><Select value={currency} onValueChange={setCurrency}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ARS">Peso argentino</SelectItem><SelectItem value="USD">Dólar estadounidense</SelectItem></SelectContent></Select></Field>
                    <Field label="Condición de venta" required><Select value={saleCondition} onValueChange={setSaleCondition}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Cuenta corriente">Cuenta corriente</SelectItem><SelectItem value="Efectivo">Efectivo</SelectItem><SelectItem value="Otros">Otros</SelectItem></SelectContent></Select></Field>
                    <Field label="Vendedor"><Select value={seller} onValueChange={setSeller}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Natalia Leyva">Natalia Leyva</SelectItem><SelectItem value="Sofía Romero">Sofía Romero</SelectItem><SelectItem value="Marcos Díaz">Marcos Díaz</SelectItem></SelectContent></Select></Field>
                    <Field label="Lista de precios"><Select value={priceList} onValueChange={setPriceList}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Abono Pro">Abono Pro</SelectItem><SelectItem value="Mayorista">Mayorista</SelectItem><SelectItem value="Publico">Público</SelectItem><SelectItem value="Corporativa">Corporativa</SelectItem></SelectContent></Select></Field>
                  </div>
                </section>

                <details className="rounded-[4px] border bg-card">
                  <summary className="cursor-pointer px-4 py-3 text-sm font-semibold">Datos administrativos <span className="ml-2 font-normal text-muted-foreground">Uso interno</span></summary>
                  <div className="grid gap-3 border-t p-4 sm:grid-cols-3">
                    <Field label="Número interno" className="sm:col-span-3"><Input value="51950660" readOnly className="bg-muted font-mono" /></Field>
                    <Field label="Empresa"><Select value={company} onValueChange={setCompany}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Empresa 7">Empresa 7</SelectItem><SelectItem value="Empresa 1">Empresa 1</SelectItem></SelectContent></Select></Field>
                    <Field label="Centro de costo"><Input value={costCenter} onChange={(event) => setCostCenter(event.target.value)} /></Field>
                    <Field label="Lote"><Input value={batch} onChange={(event) => setBatch(event.target.value)} placeholder="Sin lote" /></Field>
                  </div>
                </details>
              </div>
            </div>
          ) : null}

          {stagedStep === "items" ? (
            <section className="mx-auto flex min-h-[560px] max-w-[1600px] flex-col overflow-hidden rounded-[4px] border bg-card">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b px-3 py-2">
                <div><h3 className="text-sm font-semibold">Ítems de la factura</h3><p className="text-[11px] text-muted-foreground">{documentType} {fiscalLetter} · {activeCustomer?.name} · Lista {priceList}</p></div>
                <Badge variant="outline" className="font-mono text-[10px]">{lines.length} {lines.length === 1 ? "ítem" : "ítems"}</Badge>
              </div>
              <div className="relative z-20 border-b bg-muted/10 p-2">
                <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={productQuery} onChange={(event) => { setProductQuery(event.target.value); setError("") }} onKeyDown={(event) => event.key === "Enter" && submitProductSearch()} placeholder="Buscar por código de barras o descripción" className="bg-background pl-9 font-mono" autoFocus />
                {productSuggestions.length ? (
                  <div className="absolute inset-x-2 top-[calc(100%+0.25rem)] z-40 overflow-hidden rounded-[4px] border bg-popover shadow-xl">
                    {productSuggestions.map((product) => <button key={product.id} type="button" className="flex w-full items-center justify-between gap-3 border-b px-3 py-2 text-left last:border-0 hover:bg-muted" onClick={() => addProduct(product)}><span className="min-w-0 truncate text-sm"><span className="mr-2 font-mono text-[10px] text-muted-foreground">{product.code}</span>{product.name}</span><span className="shrink-0 font-mono text-xs">{money(product.salePrice)}</span></button>)}
                  </div>
                ) : null}
              </div>
              <div className="min-h-0 flex-1 overflow-auto">
                <Table className="min-w-[980px] table-fixed">
                  <TableHeader className="sticky top-0 z-10 bg-muted/95"><TableRow><TableHead className="w-[34%]">Artículo</TableHead><TableHead className="w-[10%] text-right">Cantidad</TableHead><TableHead className="w-[14%] text-right">Precio unit.</TableHead><TableHead className="w-[10%] text-right">Dto. %</TableHead><TableHead className="w-[8%] text-right">IVA</TableHead><TableHead className="w-[18%] text-right">Importe</TableHead><TableHead className="w-[6%] text-right">Acc.</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {lines.map((line) => {
                      const net = line.unitPrice * line.quantity * (1 - line.discountPercent / 100)
                      const amount = net * (1 + line.vatRate / 100)
                      return <TableRow key={line.id} className="h-14"><TableCell><div className="font-medium">{line.description}</div><div className="font-mono text-[10px] text-muted-foreground">{line.code} · {line.account} · {line.unit}</div></TableCell><TableCell><Input type="number" min="0.01" step="0.01" value={line.quantity} onChange={(event) => updateLine(line.id, { quantity: Number(event.target.value) || 0 })} className={cn("ml-auto h-8 max-w-24 text-right font-mono", stagedTouched.items && line.quantity <= 0 && "border-destructive")} /></TableCell><TableCell><Input type="number" min="0" step="0.01" value={line.unitPrice} onChange={(event) => updateLine(line.id, { unitPrice: Number(event.target.value) || 0 })} className="ml-auto h-8 max-w-32 text-right font-mono" /></TableCell><TableCell><Input type="number" min="0" max="100" step="0.1" value={line.discountPercent} onChange={(event) => updateLine(line.id, { discountPercent: Math.min(100, Number(event.target.value) || 0) })} className="ml-auto h-8 max-w-24 text-right font-mono" /></TableCell><TableCell className="text-right font-mono">{line.vatRate}%</TableCell><TableCell className="text-right font-mono text-sm font-semibold">{money(amount)}</TableCell><TableCell className="text-right"><Button variant="ghost" size="icon-sm" aria-label={`Quitar ${line.description}`} onClick={() => setLines((current) => current.filter((candidate) => candidate.id !== line.id))}><Trash2 /></Button></TableCell></TableRow>
                    })}
                  </TableBody>
                </Table>
                {!lines.length ? <div className="grid min-h-72 place-items-center text-center"><div><strong>No hay ítems cargados</strong><p className="mt-1 text-xs text-muted-foreground">Buscá un artículo para comenzar.</p></div></div> : null}
              </div>
              <div className="grid shrink-0 gap-4 border-t bg-muted/15 px-4 py-2 text-right sm:grid-cols-[1fr_auto_auto_auto] sm:items-center"><span className="text-left text-xs text-muted-foreground">Cantidad total <strong className="font-mono text-foreground">{totals.quantity.toLocaleString("es-AR")}</strong></span><Metric label="Bonificación" value={money(totals.discount)} /><Metric label="Neto" value={money(totals.net)} /><Metric label="Total con IVA" value={money(totals.total)} /></div>
            </section>
          ) : null}

          {stagedStep === "conditions" ? (
            <div className="mx-auto max-w-7xl">
              <div className="mb-3"><h3 className="text-base font-semibold">Condiciones necesarias</h3><p className="mt-0.5 text-xs text-muted-foreground">La pantalla muestra solamente las decisiones que pueden afectar esta factura.</p></div>
              <div className="grid gap-3 lg:grid-cols-2">
                {saleCondition === "Cuenta corriente" ? (
                  <section className={cn("rounded-[4px] border bg-card", stagedTouched.conditions && Number(dueDays) <= 0 && "border-destructive")}>
                    <div className="flex items-start justify-between gap-3 border-b px-4 py-3"><div><h4 className="text-sm font-semibold">Vencimiento</h4><p className="mt-0.5 text-xs text-muted-foreground">Requerido porque la venta es a cuenta corriente.</p></div><Badge variant="outline" className="border-amber-300 bg-amber-50 text-[9px] text-amber-800">REQUERIDO</Badge></div>
                    <div className="p-4"><Field label="Primer vencimiento"><div className="flex max-w-sm items-center gap-2"><Input type="number" min="1" value={dueDays} onChange={(event) => setDueDays(event.target.value)} className="max-w-28 text-right font-mono" /><span className="text-sm text-muted-foreground">días desde la emisión</span></div></Field></div>
                  </section>
                ) : (
                  <section className="flex items-start gap-3 rounded-[4px] border bg-card p-4"><CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" /><div><h4 className="text-sm font-semibold">Sin vencimientos</h4><p className="mt-1 text-xs text-muted-foreground">La condición de venta “{saleCondition}” no necesita un plan de cuotas.</p></div></section>
                )}

                <section className="flex items-start gap-3 rounded-[4px] border bg-card p-4"><CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" /><div><h4 className="text-sm font-semibold">Impuestos calculados</h4><p className="mt-1 text-xs text-muted-foreground">IVA {lines.map((line) => `${line.vatRate}%`).filter((rate, index, values) => values.indexOf(rate) === index).join(", ") || "sin alícuota"} según los ítems. No hace falta volver a configurarlo.</p></div></section>

                <section className="rounded-[4px] border bg-card">
                  <label className="flex cursor-pointer items-start gap-3 px-4 py-3"><Checkbox checked={automaticDeliveryNote} onCheckedChange={(value) => { setAutomaticDeliveryNote(value === true); setDeliveryConfigured(true) }} /><span className="min-w-0 flex-1"><span className="block text-sm font-semibold">Generar remito</span><span className="mt-0.5 block text-xs text-muted-foreground">Activá esta opción únicamente si la factura también documenta una entrega.</span></span><Badge variant="outline" className="text-[9px]">OPCIONAL</Badge></label>
                  {automaticDeliveryNote ? <div className="border-t p-4"><Field label="Depósito de salida" required><Select value={warehouse} onValueChange={setWarehouse}><SelectTrigger className="max-w-md"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Central">1 · Central</SelectItem><SelectItem value="Depósito Norte">2 · Depósito Norte</SelectItem></SelectContent></Select></Field></div> : null}
                </section>

                <section className={cn("rounded-[4px] border bg-card", stagedTouched.conditions && linkBudgetEnabled && !linkedBudget.trim() && "border-destructive")}>
                  <label className="flex cursor-pointer items-start gap-3 px-4 py-3"><Checkbox checked={linkBudgetEnabled} onCheckedChange={(value) => { setLinkBudgetEnabled(value === true); if (value !== true) setLinkedBudget("") }} /><span className="min-w-0 flex-1"><span className="block text-sm font-semibold">Vincular presupuesto de origen</span><span className="mt-0.5 block text-xs text-muted-foreground">Conserva la trazabilidad cuando la factura nace de una propuesta previa.</span></span><Badge variant="outline" className="text-[9px]">OPCIONAL</Badge></label>
                  {linkBudgetEnabled ? <div className="border-t p-4"><Field label="Presupuesto" required><Input value={linkedBudget} onChange={(event) => setLinkedBudget(event.target.value)} placeholder="Ej: P-0004-00000128" className="max-w-md font-mono" /></Field></div> : null}
                </section>

                <section className="rounded-[4px] border bg-card">
                  <label className="flex cursor-pointer items-start gap-3 px-4 py-3"><Checkbox checked={hasPerceptions} onCheckedChange={(value) => setHasPerceptions(value === true)} /><span className="min-w-0 flex-1"><span className="block text-sm font-semibold">Agregar percepciones o retenciones</span><span className="mt-0.5 block text-xs text-muted-foreground">Solo para ajustes que no puedan derivarse del cliente y de los ítems.</span></span><Badge variant="outline" className="text-[9px]">OPCIONAL</Badge></label>
                  {hasPerceptions ? <div className="border-t p-4 text-xs text-muted-foreground">Carga manual habilitada · En esta prueba el importe permanece en {money(0)}.</div> : null}
                </section>

                <section className="rounded-[4px] border bg-card">
                  <label className="flex cursor-pointer items-start gap-3 px-4 py-3"><Checkbox checked={paymentConfigured} onCheckedChange={(value) => { setPaymentConfigured(value === true); setPaymentStatus(value === true ? "Registrado" : "Pendiente") }} /><span className="min-w-0 flex-1"><span className="block text-sm font-semibold">Registrar un pago ahora</span><span className="mt-0.5 block text-xs text-muted-foreground">Si no se activa, la factura queda disponible para cobrar desde Cobros.</span></span><Badge variant="outline" className="text-[9px]">OPCIONAL</Badge></label>
                  {paymentConfigured ? <div className="border-t p-4"><Field label="Medio de pago" required><Select value={paymentMethod} onValueChange={setPaymentMethod}><SelectTrigger className="max-w-md"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Efectivo">Efectivo</SelectItem><SelectItem value="Transferencia">Transferencia</SelectItem><SelectItem value="Tarjeta">Tarjeta</SelectItem><SelectItem value="Mercado Pago">Mercado Pago</SelectItem></SelectContent></Select></Field></div> : null}
                </section>
              </div>
            </div>
          ) : null}

          {stagedStep === "review" ? (
            <div className="mx-auto max-w-7xl">
              <div className={cn("mb-3 flex items-start gap-3 rounded-[4px] border p-3", stagedReady ? "border-emerald-300 bg-emerald-50/60" : "border-destructive/30 bg-destructive/5")}>
                {stagedReady ? <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-700" /> : <AlertCircle className="mt-0.5 size-5 shrink-0 text-destructive" />}
                <div><h3 className="text-sm font-semibold">{stagedReady ? "Factura lista para emitir" : "La factura todavía tiene datos pendientes"}</h3><p className="mt-0.5 text-xs text-muted-foreground">{stagedReady ? "Revisá el resultado y los efectos antes de confirmar la emisión." : "Volvé a las etapas señaladas para completar la información obligatoria."}</p></div>
              </div>
              <div className="grid gap-3 lg:grid-cols-2">
                <section className="rounded-[4px] border bg-card"><div className="flex items-center justify-between border-b px-4 py-3"><h4 className="text-sm font-semibold">Documento</h4><Button variant="ghost" size="sm" onClick={() => setStagedStep("document")}>Editar</Button></div><dl className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 p-4 text-xs"><dt className="text-muted-foreground">Cliente</dt><dd className="font-medium">{activeCustomer?.name}</dd><dt className="text-muted-foreground">Comprobante</dt><dd>{documentType} {fiscalLetter} · PV {pointOfSale}</dd><dt className="text-muted-foreground">Fecha</dt><dd>{date}</dd><dt className="text-muted-foreground">Condición</dt><dd>{saleCondition}</dd><dt className="text-muted-foreground">Vendedor</dt><dd>{seller}</dd></dl></section>
                <section className="rounded-[4px] border bg-card"><div className="flex items-center justify-between border-b px-4 py-3"><h4 className="text-sm font-semibold">Condiciones aplicadas</h4><Button variant="ghost" size="sm" onClick={() => setStagedStep("conditions")}>Editar</Button></div><ul className="grid gap-2 p-4 text-xs"><li className="flex justify-between gap-3"><span className="text-muted-foreground">Vencimiento</span><strong>{saleCondition === "Cuenta corriente" ? `${dueDays} días` : "No aplica"}</strong></li><li className="flex justify-between gap-3"><span className="text-muted-foreground">Entrega</span><strong>{automaticDeliveryNote ? `Remito desde ${warehouse}` : "Sin remito"}</strong></li><li className="flex justify-between gap-3"><span className="text-muted-foreground">Origen</span><strong>{linkBudgetEnabled ? linkedBudget : "Sin vincular"}</strong></li><li className="flex justify-between gap-3"><span className="text-muted-foreground">Pago</span><strong>{paymentConfigured ? paymentMethod : "Cobrar después"}</strong></li><li className="flex justify-between gap-3"><span className="text-muted-foreground">Percepciones</span><strong>{hasPerceptions ? "Carga adicional" : "No aplica"}</strong></li></ul></section>
                <section className="overflow-hidden rounded-[4px] border bg-card lg:col-span-2"><div className="flex items-center justify-between border-b px-4 py-3"><div><h4 className="text-sm font-semibold">Ítems</h4><p className="text-[11px] text-muted-foreground">{lines.length} {lines.length === 1 ? "artículo" : "artículos"} · Cantidad {totals.quantity.toLocaleString("es-AR")}</p></div><Button variant="ghost" size="sm" onClick={() => setStagedStep("items")}>Editar</Button></div><div className="divide-y">{lines.map((line) => { const net = line.unitPrice * line.quantity * (1 - line.discountPercent / 100); const amount = net * (1 + line.vatRate / 100); return <div key={line.id} className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-5 px-4 py-2 text-xs"><span className="truncate"><strong>{line.description}</strong><span className="ml-2 font-mono text-[9px] text-muted-foreground">{line.code}</span></span><span className="font-mono text-muted-foreground">{line.quantity} × {money(line.unitPrice)}</span><strong className="font-mono">{money(amount)}</strong></div> })}</div></section>
                <section className="rounded-[4px] border bg-card p-4 lg:col-span-2"><div className="grid gap-4 sm:grid-cols-4"><Metric label="Bonificación" value={money(totals.discount)} /><Metric label="Neto" value={money(totals.net)} /><Metric label="IVA" value={money(totals.vat)} /><div className="border-t pt-3 text-right sm:border-t-0 sm:border-l sm:pt-0 sm:pl-4"><div className="font-mono text-[9px] uppercase text-muted-foreground">Total a emitir</div><div className="font-mono text-xl font-bold">{money(totals.total)}</div></div></div></section>
              </div>
            </div>
          ) : null}
        </main>

        <footer className="z-20 grid shrink-0 gap-2 border-t bg-card px-3 py-2 shadow-[0_-8px_24px_rgba(0,0,0,0.04)] sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div className="min-w-0">
            <p className={cn("truncate text-xs", error && !stagedValidity[stagedStep] ? "text-destructive" : notice ? "text-emerald-700" : "text-muted-foreground")}>{(!stagedValidity[stagedStep] && error) || notice || (stagedStep === "review" ? "La emisión registrará el comprobante y sus efectos asociados." : `Etapa ${stagedStepIndex + 1} de ${stagedSteps.length} · ${stagedSteps[stagedStepIndex].description}`)}</p>
            <div className="mt-0.5 flex items-baseline gap-2 lg:hidden"><span className="font-mono text-[9px] uppercase text-muted-foreground">Total</span><strong className="font-mono text-base">{money(totals.total)}</strong></div>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button variant="ghost" size="sm">Cancelar</Button>
            <Button variant="outline" size="sm" onClick={() => setNotice("Borrador guardado localmente en la demostración.")}><Save />Guardar borrador</Button>
            {stagedStepIndex > 0 ? <Button variant="outline" size="sm" onClick={() => { setError(""); setStagedStep(stagedStepOrder[stagedStepIndex - 1]) }}><ArrowLeft />Anterior</Button> : null}
            {stagedStep === "review" ? <><Button variant="outline" size="sm" onClick={() => setNotice("Vista previa simulada preparada.")}><Eye />Vista previa</Button><Button size="sm" onClick={emitStagedInvoice}><FileCheck2 />Emitir factura</Button></> : <Button size="sm" onClick={advanceStagedStep}>Continuar<ArrowRight /></Button>}
          </div>
        </footer>
        {issuedInvoiceDialog}
      </div>
    )
  }

  return (
    <div data-testid="advanced-invoicing-workspace" className="flex h-full min-h-0 flex-col overflow-hidden bg-muted/20">
      <div className={cn(
        "min-h-0 flex-1 overflow-y-auto p-2 lg:grid lg:gap-2 lg:overflow-hidden",
        layout === "paper"
          ? "lg:grid-rows-[clamp(326px,37vh,360px)_minmax(0,1fr)]"
          : "lg:grid-rows-[auto_minmax(0,1fr)]"
      )}>
        {layout === "tabs" || layout === "guided" ? (
        <section aria-labelledby="advanced-header-title" className="overflow-hidden rounded-[4px] border bg-card">
          <div className="flex min-h-12 flex-wrap items-center justify-between gap-2 border-b px-3 py-1.5">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="grid size-10 shrink-0 place-items-center rounded-[4px] border border-emerald-300 bg-emerald-100 font-mono text-xl font-bold text-emerald-950 shadow-sm dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-100" aria-label={`Comprobante tipo ${fiscalLetter}`}>
                {fiscalLetter}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 id="advanced-header-title" className="text-sm font-semibold">{documentType}</h2>
                  <Badge variant="outline" className="h-5 border-amber-300 bg-amber-50 px-1.5 text-[10px] text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">Borrador</Badge>
                  <span className="font-mono text-[11px] text-muted-foreground">Interno 51950660</span>
                </div>
                <p className="truncate text-[11px] text-muted-foreground">{activeCustomer?.name ?? "Sin cliente"} · PV {pointOfSale}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden text-[11px] text-muted-foreground xl:inline">{visibleBlockCount} módulos visibles</span>
              <Button variant="outline" size="sm" className="h-8" onClick={() => setConfigOpen(true)}>
                <Settings2 />
                Configurar
                {hiddenFieldCount + hiddenColumnCount > 0 ? <Badge className="ml-1 h-5 min-w-5 justify-center px-1.5">{hiddenFieldCount + hiddenColumnCount}</Badge> : null}
              </Button>
            </div>
          </div>

          <div className="grid gap-2 p-2 md:grid-cols-2 lg:grid-cols-12">
            <FieldCard title="Cliente y comprobante" className="md:col-span-1 lg:col-span-5">
              <div className="grid gap-2 sm:grid-cols-6">
                <Field label="Cliente" required className="gap-1 sm:col-span-6">
                  <Select value={customerId} onValueChange={selectCustomer}>
                    <SelectTrigger className="h-8 w-full"><SelectValue placeholder="Seleccionar cliente" /></SelectTrigger>
                    <SelectContent>{customers.filter((customer) => customer.active).map((customer) => <SelectItem key={customer.id} value={customer.id}>{customer.code} · {customer.name}</SelectItem>)}</SelectContent>
                  </Select>
                </Field>
                {showField("destination") ? <Field label="Destino" className="gap-1 sm:col-span-3"><Select value={destination} onValueChange={setDestination}><SelectTrigger className="h-8 w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Comprobante electrónico · Interno">Electrónico · Interno</SelectItem><SelectItem value="Comprobante electrónico · ARCA">Electrónico · ARCA</SelectItem></SelectContent></Select></Field> : null}
                {showField("jurisdiction") ? <Field label="Jurisdicción" className="gap-1 sm:col-span-3"><Select value={jurisdiction} onValueChange={setJurisdiction}><SelectTrigger className="h-8 w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Ninguna">Ninguna</SelectItem><SelectItem value="Tucumán">Tucumán</SelectItem><SelectItem value="Convenio multilateral">Convenio multilateral</SelectItem></SelectContent></Select></Field> : null}
                <Field label="Tipo" required className="gap-1 sm:col-span-2"><Select value={documentType} onValueChange={setDocumentType}><SelectTrigger className="h-8 w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Factura">Factura</SelectItem><SelectItem value="Nota de débito">Nota de débito</SelectItem><SelectItem value="Nota de crédito">Nota de crédito</SelectItem></SelectContent></Select></Field>
                <Field label="Punto de venta" required className="gap-1 sm:col-span-2"><Select value={pointOfSale} onValueChange={setPointOfSale}><SelectTrigger className="h-8 w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="00002">PV 00002</SelectItem><SelectItem value="00004">PV 00004</SelectItem></SelectContent></Select></Field>
                {showField("observations") ? <Field label="Observaciones" className="gap-1 sm:col-span-2"><Input value={observations} onChange={(event) => setObservations(event.target.value)} className="h-8" /></Field> : null}
              </div>
            </FieldCard>

            <div className="grid min-w-0 gap-2 md:col-span-1 lg:col-span-7">
              <div className="grid min-w-0 gap-2 md:grid-cols-2 lg:grid-cols-7">
                {showBlock("commercial") ? (
                  <FieldCard title="Condiciones comerciales" className="md:col-span-1 lg:col-span-3 2xl:col-span-4">
                    <div className="grid gap-2 sm:grid-cols-2">
                      {showField("currency") ? <Field label="Moneda" className="gap-1"><Select value={currency} onValueChange={setCurrency}><SelectTrigger className="h-8 w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ARS">Peso argentino</SelectItem><SelectItem value="USD">Dólar estadounidense</SelectItem></SelectContent></Select></Field> : null}
                      {showField("saleCondition") ? <Field label="Condición de venta" className="gap-1"><Select value={saleCondition} onValueChange={setSaleCondition}><SelectTrigger className="h-8 w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Cuenta corriente">Cuenta corriente</SelectItem><SelectItem value="Efectivo">Efectivo</SelectItem><SelectItem value="Otros">Otros</SelectItem></SelectContent></Select></Field> : null}
                      {showField("seller") ? <Field label="Vendedor" className="gap-1"><Select value={seller} onValueChange={setSeller}><SelectTrigger className="h-8 w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Natalia Leyva">Natalia Leyva</SelectItem><SelectItem value="Sofía Romero">Sofía Romero</SelectItem><SelectItem value="Marcos Díaz">Marcos Díaz</SelectItem></SelectContent></Select></Field> : null}
                      {showField("priceList") ? <Field label="Lista de precios" className="gap-1"><Select value={priceList} onValueChange={setPriceList}><SelectTrigger className="h-8 w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Abono Pro">Abono Pro</SelectItem><SelectItem value="Mayorista">Mayorista</SelectItem><SelectItem value="Publico">Público</SelectItem><SelectItem value="Corporativa">Corporativa</SelectItem></SelectContent></Select></Field> : null}
                    </div>
                  </FieldCard>
                ) : null}

                {showBlock("control") ? (
                  <FieldCard title="Control interno" className="md:col-span-1 lg:col-span-4 2xl:col-span-3">
                    <div className="grid gap-2 sm:grid-cols-6">
                      <Field label="Fecha" required className="gap-1 sm:col-span-3"><Input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="h-8" /></Field>
                      {showField("internalNumber") ? <Field label="Número interno" className="gap-1 sm:col-span-3"><Input value="51950660" readOnly className="h-8 bg-muted font-mono" /></Field> : null}
                      {showField("company") ? <Field label="Empresa" className="gap-1 sm:col-span-2"><Select value={company} onValueChange={setCompany}><SelectTrigger className="h-8 w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Empresa 7">Empresa 7</SelectItem><SelectItem value="Empresa 1">Empresa 1</SelectItem></SelectContent></Select></Field> : null}
                      {showField("costCenter") ? <Field label="C. costo" className="gap-1 sm:col-span-2"><Input value={costCenter} onChange={(event) => setCostCenter(event.target.value)} className="h-8" /></Field> : null}
                      {showField("batch") ? <Field label="Lote" className="gap-1 sm:col-span-2"><Input value={batch} onChange={(event) => setBatch(event.target.value)} placeholder="Sin lote" className="h-8" /></Field> : null}
                    </div>
                  </FieldCard>
                ) : null}
              </div>

              {showBlock("logistics") ? (
                <section className="grid min-w-0 items-end gap-2 rounded-[4px] border bg-card px-3 py-2 md:col-span-2 lg:col-span-1 lg:grid-cols-[auto_minmax(160px,280px)_minmax(260px,1fr)]">
                  <div className="self-center pr-2"><h3 className="text-sm font-semibold">Logística</h3><p className="text-[10px] text-muted-foreground">Entrega</p></div>
                  {showField("warehouse") ? <Field label="Depósito" className="gap-1"><Select value={warehouse} onValueChange={setWarehouse}><SelectTrigger className="h-8 w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Central">1 · Central</SelectItem><SelectItem value="Depósito Norte">2 · Depósito Norte</SelectItem></SelectContent></Select></Field> : <span />}
                  {showField("automaticDeliveryNote") ? <label className="flex h-8 items-center gap-2 rounded-[4px] border px-3 text-xs"><Checkbox checked={automaticDeliveryNote} onCheckedChange={(value) => { setAutomaticDeliveryNote(value === true); setDeliveryConfigured(true) }} /><span>Generar remito automáticamente</span></label> : null}
                </section>
              ) : null}
            </div>
          </div>
        </section>
        ) : layout === "streamlined" ? (
          <section aria-label="Datos del comprobante" className="rounded-[4px] border bg-card p-2">
            <div className="grid min-w-0 items-end gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-[44px_minmax(240px,2fr)_minmax(130px,1fr)_minmax(120px,0.8fr)_minmax(145px,0.9fr)_minmax(110px,0.7fr)]">
              <div className="flex min-w-0 items-end gap-2 sm:col-span-2 md:col-span-3 lg:hidden">
                <div className="grid size-11 shrink-0 place-items-center rounded-[4px] border border-emerald-300 bg-emerald-100 font-mono text-xl font-bold text-emerald-950 shadow-sm dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-100" aria-label={`Comprobante tipo ${fiscalLetter}`}>
                  {fiscalLetter}
                </div>
                <Field label="Cliente" required className="min-w-0 flex-1 gap-1">
                  <Select value={customerId} onValueChange={selectCustomer}>
                    <SelectTrigger className="h-8 w-full"><SelectValue placeholder="Seleccionar cliente" /></SelectTrigger>
                    <SelectContent>{customers.filter((customer) => customer.active).map((customer) => <SelectItem key={customer.id} value={customer.id}>{customer.code} · {customer.name}</SelectItem>)}</SelectContent>
                  </Select>
                </Field>
              </div>
              <div className="hidden size-11 place-items-center self-end rounded-[4px] border border-emerald-300 bg-emerald-100 font-mono text-xl font-bold text-emerald-950 shadow-sm dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-100 lg:grid" aria-label={`Comprobante tipo ${fiscalLetter}`}>
                {fiscalLetter}
              </div>
              <Field label="Cliente" required className="hidden min-w-0 gap-1 lg:grid">
                <Select value={customerId} onValueChange={selectCustomer}>
                  <SelectTrigger className="h-8 w-full"><SelectValue placeholder="Seleccionar cliente" /></SelectTrigger>
                  <SelectContent>{customers.filter((customer) => customer.active).map((customer) => <SelectItem key={customer.id} value={customer.id}>{customer.code} · {customer.name}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="Comprobante" required className="min-w-0 gap-1">
                <Select value={documentType} onValueChange={setDocumentType}><SelectTrigger className="h-8 w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Factura">Factura</SelectItem><SelectItem value="Nota de débito">Nota de débito</SelectItem><SelectItem value="Nota de crédito">Nota de crédito</SelectItem></SelectContent></Select>
              </Field>
              <Field label="Punto de venta" required className="min-w-0 gap-1">
                <Select value={pointOfSale} onValueChange={setPointOfSale}><SelectTrigger className="h-8 w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="00002">PV 00002</SelectItem><SelectItem value="00004">PV 00004</SelectItem></SelectContent></Select>
              </Field>
              <Field label="Fecha" required className="min-w-0 gap-1"><Input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="h-8" /></Field>
              <Field label="Moneda" className="min-w-0 gap-1">
                <Select value={currency} onValueChange={setCurrency}><SelectTrigger className="h-8 w-full font-mono"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ARS">$ · ARS</SelectItem><SelectItem value="USD">US$ · USD</SelectItem></SelectContent></Select>
              </Field>
            </div>

            <div className="mt-2 grid min-w-0 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              <Field label="Condición de venta" className="min-w-0 gap-1"><Select value={saleCondition} onValueChange={setSaleCondition}><SelectTrigger className="h-8 w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Cuenta corriente">Cuenta corriente</SelectItem><SelectItem value="Efectivo">Efectivo</SelectItem><SelectItem value="Otros">Otros</SelectItem></SelectContent></Select></Field>
              <Field label="Lista de precios" className="min-w-0 gap-1"><Select value={priceList} onValueChange={setPriceList}><SelectTrigger className="h-8 w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Abono Pro">Abono Pro</SelectItem><SelectItem value="Mayorista">Mayorista</SelectItem><SelectItem value="Publico">Público</SelectItem><SelectItem value="Corporativa">Corporativa</SelectItem></SelectContent></Select></Field>
              <Field label="Vendedor" className="min-w-0 gap-1"><Select value={seller} onValueChange={setSeller}><SelectTrigger className="h-8 w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Natalia Leyva">Natalia Leyva</SelectItem><SelectItem value="Sofía Romero">Sofía Romero</SelectItem><SelectItem value="Marcos Díaz">Marcos Díaz</SelectItem></SelectContent></Select></Field>
              <Field label="Depósito" className="min-w-0 gap-1"><Select value={warehouse} onValueChange={setWarehouse}><SelectTrigger className="h-8 w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Central">1 · Central</SelectItem><SelectItem value="Depósito Norte">2 · Depósito Norte</SelectItem></SelectContent></Select></Field>
              <Field label="Destino" className="min-w-0 gap-1"><Select value={destination} onValueChange={setDestination}><SelectTrigger className="h-8 w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Comprobante electrónico · Interno">Electrónico · Interno</SelectItem><SelectItem value="Comprobante electrónico · ARCA">Electrónico · ARCA</SelectItem></SelectContent></Select></Field>
              <Field label="Jurisdicción" className="min-w-0 gap-1"><Select value={jurisdiction} onValueChange={setJurisdiction}><SelectTrigger className="h-8 w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Ninguna">Ninguna</SelectItem><SelectItem value="Tucumán">Tucumán</SelectItem><SelectItem value="Convenio multilateral">Convenio multilateral</SelectItem></SelectContent></Select></Field>
            </div>

            <div className="mt-2 grid min-w-0 items-end gap-2 border-t pt-2 sm:grid-cols-[minmax(220px,1fr)_auto_auto]">
              <Field label="Observaciones" className="min-w-0 gap-1"><Textarea value={observations} onChange={(event) => setObservations(event.target.value)} className="h-16 min-h-16 resize-none rounded-[4px]" /></Field>
              <label className="flex h-8 items-center gap-2 rounded-[4px] border px-3 text-xs"><Checkbox checked={automaticDeliveryNote} onCheckedChange={(value) => { setAutomaticDeliveryNote(value === true); setDeliveryConfigured(true) }} /><span>Generar remito</span></label>
              <Button variant="outline" size="sm" className="h-8" onClick={() => setInternalDataOpen(true)}>
                Más datos
              </Button>
            </div>
          </section>
        ) : (
          <section aria-label="Cabecera inspirada en comprobante físico" className="min-h-0 overflow-hidden rounded-[4px] border border-foreground/25 bg-card">
            <div className="grid h-full min-h-0 lg:grid-cols-2">
              <div className="order-2 flex min-h-0 flex-col border-b border-foreground/25 p-3 lg:border-b-0">
                <div className="flex items-start justify-between gap-3 border-b pb-2 lg:pl-10">
                  <div>
                    <h2 className="text-sm font-semibold">Datos del cliente</h2>
                    <p className="text-[10px] text-muted-foreground">Receptor del comprobante</p>
                  </div>
                  <Badge variant="outline" className="font-mono text-[9px]">{activeCustomer?.vatCategory ?? "Sin categoría"}</Badge>
                </div>

                <Field label="Cliente" required className="mt-2.5 min-w-0 gap-1 lg:pl-10">
                  <Select value={customerId} onValueChange={selectCustomer}>
                    <SelectTrigger className="h-8 w-full"><SelectValue placeholder="Seleccionar cliente" /></SelectTrigger>
                    <SelectContent>{customers.filter((customer) => customer.active).map((customer) => <SelectItem key={customer.id} value={customer.id}>{customer.code} · {customer.name}</SelectItem>)}</SelectContent>
                  </Select>
                </Field>

                <dl className="mt-2.5 grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1 border-y bg-muted/15 px-2 py-1.5 text-[10px] sm:grid-cols-[auto_minmax(0,1fr)_auto_minmax(0,1fr)]">
                  <dt className="font-mono font-semibold text-muted-foreground uppercase">Domicilio</dt><dd className="truncate">{activeCustomer?.address || "Sin domicilio"}</dd>
                  <dt className="font-mono font-semibold text-muted-foreground uppercase">{activeCustomer?.documentType || "Documento"}</dt><dd className="font-mono">{activeCustomer?.document || "Sin informar"}</dd>
                  <dt className="font-mono font-semibold text-muted-foreground uppercase">Cond. IVA</dt><dd className="truncate">{activeCustomer?.vatCategory || "Sin informar"}</dd>
                  <dt className="font-mono font-semibold text-muted-foreground uppercase">Teléfono</dt><dd>{activeCustomer?.phone || "Sin informar"}</dd>
                </dl>

                <div className="mt-2.5 grid gap-3 sm:grid-cols-2">
                  <Field label="Condición de venta" className="min-w-0 gap-1"><Select value={saleCondition} onValueChange={setSaleCondition}><SelectTrigger className="h-8 w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Cuenta corriente">Cuenta corriente</SelectItem><SelectItem value="Efectivo">Efectivo</SelectItem><SelectItem value="Otros">Otros</SelectItem></SelectContent></Select></Field>
                  <Field label="Lista de precios" className="min-w-0 gap-1"><Select value={priceList} onValueChange={setPriceList}><SelectTrigger className="h-8 w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Abono Pro">Abono Pro</SelectItem><SelectItem value="Mayorista">Mayorista</SelectItem><SelectItem value="Publico">Público</SelectItem><SelectItem value="Corporativa">Corporativa</SelectItem></SelectContent></Select></Field>
                </div>

                <Field label="Observaciones" className="mt-2.5 gap-1">
                  <Textarea value={observations} onChange={(event) => setObservations(event.target.value)} className="h-14 min-h-14 resize-none rounded-[4px] 2xl:h-20 2xl:min-h-20" />
                </Field>
              </div>

              <div className="order-1 relative flex min-h-0 flex-col border-b border-foreground/25 p-3 lg:border-r lg:border-b-0">
                <div className="absolute top-3 -right-8 z-10 hidden size-16 place-items-center rounded-[2px] border-2 border-foreground/70 bg-card shadow-sm lg:grid" aria-label={`Comprobante tipo ${fiscalLetter}`}>
                  <span className="font-mono text-3xl leading-none font-bold">{fiscalLetter}</span>
                  <span className="-mt-3 font-mono text-[7px] font-semibold uppercase">Cód. 01</span>
                </div>

                <div className="flex min-h-16 items-start gap-3 border-b pb-2 lg:pr-9">
                  <div className="grid size-12 shrink-0 place-items-center rounded-[2px] border-2 border-foreground/70 bg-card shadow-sm lg:hidden" aria-label={`Comprobante tipo ${fiscalLetter}`}>
                    <span className="font-mono text-2xl leading-none font-bold">{fiscalLetter}</span>
                    <span className="-mt-2 font-mono text-[6px] font-semibold uppercase">Cód. 01</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Select value={documentType} onValueChange={setDocumentType}>
                        <SelectTrigger className="h-9 w-48 border-0 px-0 text-lg font-bold shadow-none focus-visible:ring-0"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="Factura">Factura</SelectItem><SelectItem value="Nota de débito">Nota de débito</SelectItem><SelectItem value="Nota de crédito">Nota de crédito</SelectItem></SelectContent>
                      </Select>
                      <Badge variant="outline" className="h-5 border-amber-300 bg-amber-50 px-1.5 text-[9px] text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">Borrador</Badge>
                    </div>
                    <p className="font-mono text-[10px] text-muted-foreground">PV {pointOfSale} · Nº a asignar al emitir</p>
                  </div>
                </div>

                <div className="mt-2.5 grid min-w-0 gap-x-3 gap-y-2.5 sm:grid-cols-3">
                  <Field label="Punto de venta" required className="min-w-0 gap-1"><Select value={pointOfSale} onValueChange={setPointOfSale}><SelectTrigger className="h-8 w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="00002">PV 00002</SelectItem><SelectItem value="00004">PV 00004</SelectItem></SelectContent></Select></Field>
                  <Field label="Fecha de emisión" required className="min-w-0 gap-1"><Input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="h-8" /></Field>
                  <Field label="Moneda" className="min-w-0 gap-1"><Select value={currency} onValueChange={setCurrency}><SelectTrigger className="h-8 w-full font-mono"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ARS">$ · ARS</SelectItem><SelectItem value="USD">US$ · USD</SelectItem></SelectContent></Select></Field>
                </div>

                <div className="mt-2.5 grid min-w-0 gap-x-3 gap-y-2.5 sm:grid-cols-2">
                  <Field label="Vendedor" className="min-w-0 gap-1"><Select value={seller} onValueChange={setSeller}><SelectTrigger className="h-8 w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Natalia Leyva">Natalia Leyva</SelectItem><SelectItem value="Sofía Romero">Sofía Romero</SelectItem><SelectItem value="Marcos Díaz">Marcos Díaz</SelectItem></SelectContent></Select></Field>
                  <Field label="Depósito" className="min-w-0 gap-1"><Select value={warehouse} onValueChange={setWarehouse}><SelectTrigger className="h-8 w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Central">1 · Central</SelectItem><SelectItem value="Depósito Norte">2 · Depósito Norte</SelectItem></SelectContent></Select></Field>
                  <Field label="Destino" className="min-w-0 gap-1"><Select value={destination} onValueChange={setDestination}><SelectTrigger className="h-8 w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Comprobante electrónico · Interno">Electrónico · Interno</SelectItem><SelectItem value="Comprobante electrónico · ARCA">Electrónico · ARCA</SelectItem></SelectContent></Select></Field>
                  <Field label="Jurisdicción" className="min-w-0 gap-1"><Select value={jurisdiction} onValueChange={setJurisdiction}><SelectTrigger className="h-8 w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Ninguna">Ninguna</SelectItem><SelectItem value="Tucumán">Tucumán</SelectItem><SelectItem value="Convenio multilateral">Convenio multilateral</SelectItem></SelectContent></Select></Field>
                </div>

                <div className="mt-2.5 flex flex-wrap items-center justify-end gap-2.5 border-t pt-2.5">
                  <label className="flex h-8 items-center gap-2 rounded-[4px] border px-3 text-xs"><Checkbox checked={automaticDeliveryNote} onCheckedChange={(value) => { setAutomaticDeliveryNote(value === true); setDeliveryConfigured(true) }} /><span>Generar remito</span></label>
                  <Button variant="outline" size="sm" className="h-8" onClick={() => setInternalDataOpen(true)}>Más datos</Button>
                </div>
              </div>
            </div>
          </section>
        )}

        <section aria-label="Ítems" className="mt-2 flex min-h-[300px] flex-col overflow-visible rounded-[4px] border bg-card lg:mt-0 lg:min-h-0 lg:overflow-hidden">
          {layout !== "guided" ? (
            <Tabs value={activeExtension} onValueChange={setActiveExtension} className="shrink-0 gap-0">
              <div className="overflow-x-auto overflow-y-hidden border-b px-2 pt-0.5">
                <TabsList variant="line" className="h-8 min-w-max">
                  <TabsTrigger value="items" className="gap-1.5">
                    Ítems
                    <Badge className="h-4 min-w-4 justify-center px-1 font-mono text-[9px]">{lines.length}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="perceptions">Percepciones</TabsTrigger>
                  <TabsTrigger value="due-dates">Vencimientos</TabsTrigger>
                  <TabsTrigger value="delivery-notes">Remitos</TabsTrigger>
                  <TabsTrigger value="budgets">Presupuestos</TabsTrigger>
                  <TabsTrigger value="payments">Pagos</TabsTrigger>
                </TabsList>
              </div>
            </Tabs>
          ) : null}

          {layout === "guided" ? (
            <section aria-labelledby="invoice-preparation-title" className="shrink-0 border-b bg-muted/10">
              <div className="flex min-h-8 flex-col items-start justify-between gap-1 border-b px-3 py-1 sm:flex-row sm:items-center sm:gap-3">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <h3 id="invoice-preparation-title" className="truncate text-xs font-semibold">Preparación del comprobante</h3>
                  <Badge variant="outline" className="h-5 shrink-0 bg-background px-1.5 font-mono text-[9px]">
                    {definedWorkflowStepCount} de {workflowSteps.length} definidos
                  </Badge>
                </div>
                {firstMissingWorkflowStep ? (
                  <Button variant="ghost" size="sm" className="h-6 shrink-0 self-end px-2 text-[10px] sm:self-auto" onClick={() => setWorkflowStep(firstMissingWorkflowStep.id)}>
                    Completar pendientes
                    <ChevronRight className="size-3" />
                  </Button>
                ) : (
                  <span className="flex shrink-0 items-center gap-1 text-[10px] font-medium text-emerald-700 dark:text-emerald-400"><CheckCircle2 className="size-3.5" />Listo para emitir</span>
                )}
              </div>
              <div className="grid grid-cols-1 divide-y min-[430px]:grid-cols-2 min-[430px]:divide-x min-[430px]:divide-y-0 sm:grid-cols-5">
                {workflowSteps.map((step) => (
                  <button
                    key={step.id}
                    type="button"
                    className="group flex min-w-0 items-center gap-2 px-3 py-1.5 text-left hover:bg-muted"
                    onClick={() => setWorkflowStep(step.id)}
                  >
                    <span className={cn(
                      "grid size-5 shrink-0 place-items-center rounded-full border",
                      step.status === "defined" && "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
                      step.status === "optional" && "border-border bg-muted text-muted-foreground",
                      step.status === "missing" && "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300"
                    )}>
                      {step.status === "defined" ? <CheckCircle2 className="size-3.5" /> : step.status === "optional" ? <Info className="size-3" /> : <Circle className="size-3" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex min-w-0 items-center gap-1.5">
                        <span className="truncate text-[11px] font-semibold">{step.label}</span>
                        <span className={cn(
                          "shrink-0 rounded-[3px] px-1 py-0.5 font-mono text-[8px] font-semibold uppercase",
                          step.status === "defined" && "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
                          step.status === "optional" && "bg-muted text-muted-foreground",
                          step.status === "missing" && "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                        )}>{step.statusLabel}</span>
                      </span>
                      <span className="block truncate text-[9px] text-muted-foreground">{step.detail}</span>
                    </span>
                    <ChevronRight className="size-3 shrink-0 text-muted-foreground group-hover:text-foreground" />
                  </button>
                ))}
              </div>
            </section>
          ) : null}

          {layout === "guided" || activeExtension === "items" ? (
            <>
          <div className="relative z-20 shrink-0 border-b bg-muted/10 p-1">
            <div className="relative min-w-0">
                <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={productQuery}
                  onChange={(event) => {
                    setProductQuery(event.target.value)
                    setError("")
                  }}
                  onKeyDown={(event) => event.key === "Enter" && submitProductSearch()}
                  placeholder="Buscar por código de barras o descripción"
                  aria-label="Buscar artículo para agregar"
                  className="h-8 bg-background pr-3 pl-8 font-mono text-xs"
                  autoFocus
                />
                {productSuggestions.length ? (
                  <div className="absolute inset-x-0 top-[calc(100%+0.3rem)] z-40 overflow-hidden rounded-[4px] border bg-popover shadow-xl">
                    {productSuggestions.map((product) => (
                      <button
                        key={product.id}
                        type="button"
                        className="flex w-full items-center justify-between gap-3 border-b px-3 py-2 text-left last:border-0 hover:bg-muted"
                        onClick={() => addProduct(product)}
                      >
                        <span className="min-w-0 truncate text-sm"><span className="mr-2 font-mono text-[10px] text-muted-foreground">{product.code}</span>{product.name}</span>
                        <span className="shrink-0 font-mono text-xs">{money(product.salePrice)}</span>
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
          </div>

          <div data-testid="advanced-items-scroll" className="relative min-h-0 flex-1 overflow-visible lg:overflow-auto lg:[&_[data-slot=table-container]]:h-full">
            <div className="divide-y lg:hidden">
              {lines.length ? lines.map((line) => {
                const net = line.unitPrice * line.quantity * (1 - line.discountPercent / 100)
                const amount = net * (1 + line.vatRate / 100)
                return (
                  <article key={line.id} className="grid gap-3 p-3">
                    <div className="flex min-w-0 items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold">{line.description}</h3>
                        <p className="font-mono text-[10px] text-muted-foreground">{line.code}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        {columns.amount ? <strong className="font-mono text-sm tabular-nums">{money(amount)}</strong> : null}
                        <Button variant="ghost" size="icon-sm" aria-label={`Quitar ${line.description}`} onClick={() => setLines((current) => current.filter((candidate) => candidate.id !== line.id))}><Trash2 /></Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                      {columns.quantity ? <Field label="Cantidad" className="gap-1"><Input type="number" min="0.01" step="0.01" value={line.quantity} onChange={(event) => updateLine(line.id, { quantity: Number(event.target.value) || 0 })} aria-label={`Cantidad de ${line.description}`} className="h-8 appearance-none text-right font-mono text-xs [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" /></Field> : null}
                      {columns.unitPrice ? <Field label="Precio unit." className="gap-1"><Input type="number" min="0" step="0.01" value={line.unitPrice} onChange={(event) => updateLine(line.id, { unitPrice: Number(event.target.value) || 0 })} aria-label={`Precio unitario de ${line.description}`} className="h-8 appearance-none text-right font-mono text-xs [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" /></Field> : null}
                      {columns.discount ? <Field label="Dto. %" className="gap-1"><Input type="number" min="0" max="100" step="0.1" value={line.discountPercent} onChange={(event) => updateLine(line.id, { discountPercent: Math.min(100, Number(event.target.value) || 0) })} aria-label={`Descuento de ${line.description}`} className="h-8 appearance-none text-right font-mono text-xs [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" /></Field> : null}
                      {columns.finalPrice ? <div className="grid content-end gap-1"><span className="font-mono text-[11px] font-semibold">Precio final</span><span className="flex h-8 items-center justify-end rounded-[4px] border bg-muted/20 px-2 font-mono text-xs">{money(line.unitPrice * (1 - line.discountPercent / 100))}</span></div> : null}
                    </div>

                    {columns.auxiliary ? <Field label="Detalle auxiliar" className="gap-1"><Input value={line.auxiliary} onChange={(event) => updateLine(line.id, { auxiliary: event.target.value })} aria-label={`Detalle auxiliar de ${line.description}`} className="h-8" /></Field> : null}

                    <dl className="flex flex-wrap gap-x-4 gap-y-1 border-t pt-2 text-[10px] text-muted-foreground">
                      {columns.account ? <><dt className="font-mono font-semibold uppercase">Cuenta</dt><dd className="text-foreground">{line.account}</dd></> : null}
                      {columns.unit ? <><dt className="font-mono font-semibold uppercase">Unidad</dt><dd className="font-mono text-foreground">{line.unit}</dd></> : null}
                      {columns.vat ? <><dt className="font-mono font-semibold uppercase">IVA</dt><dd className="font-mono text-foreground">{line.vatRate}%</dd></> : null}
                    </dl>
                  </article>
                )
              }) : null}
            </div>

            <div className="hidden h-full lg:block">
            <Table className={cn(
              "h-full table-fixed [&_td]:border-r [&_td]:border-border [&_td:last-child]:border-r-0 [&_th]:border-r [&_th]:border-border [&_th:last-child]:border-r-0",
              layout === "streamlined" || layout === "paper" ? "min-w-[1080px]" : "min-w-[1180px] 2xl:min-w-[1100px]"
            )}>
                    <colgroup>
                      <col className="w-[20%]" />
                      {columns.account ? <col className="w-[11%]" /> : null}
                      {columns.unit ? <col className="w-[5%]" /> : null}
                      {columns.quantity ? <col className="w-[6%]" /> : null}
                      {columns.unitPrice ? <col className="w-[8%]" /> : null}
                      {columns.discount ? <col className="w-[6%]" /> : null}
                      {columns.finalPrice ? <col className="w-[10%]" /> : null}
                      {columns.auxiliary ? <col className="w-[16%]" /> : null}
                      {columns.vat ? <col className="w-[5%]" /> : null}
                      {columns.amount ? <col className="w-[9%]" /> : null}
                      <col className="w-[4%]" />
                    </colgroup>
                    <TableHeader className="sticky top-0 z-10 bg-muted/95 backdrop-blur-sm">
                      <TableRow>
                        <TableHead>Artículo</TableHead>
                        {columns.account ? <TableHead>Cuenta</TableHead> : null}
                        {columns.unit ? <TableHead>Unidad</TableHead> : null}
                        {columns.quantity ? <TableHead className="text-right">Cantidad</TableHead> : null}
                        {columns.unitPrice ? <TableHead className="text-right">Precio unit.</TableHead> : null}
                        {columns.discount ? <TableHead className="text-right">Dto. %</TableHead> : null}
                        {columns.finalPrice ? <TableHead className="text-right">Precio final</TableHead> : null}
                        {columns.auxiliary ? <TableHead>Detalle auxiliar</TableHead> : null}
                        {columns.vat ? <TableHead className="text-right">IVA</TableHead> : null}
                        {columns.amount ? <TableHead className="text-right">Importe</TableHead> : null}
                        <TableHead className="text-right">Acc.</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lines.length ? lines.map((line) => {
                        const net = line.unitPrice * line.quantity * (1 - line.discountPercent / 100)
                        const amount = net * (1 + line.vatRate / 100)
                        return (
                          <TableRow key={line.id} className="h-12">
                            <TableCell><div className="font-medium">{line.description}</div><div className="font-mono text-[10px] text-muted-foreground">{line.code}</div></TableCell>
                            {columns.account ? <TableCell className="text-xs">{line.account}</TableCell> : null}
                            {columns.unit ? <TableCell className="font-mono text-xs">{line.unit}</TableCell> : null}
                            {columns.quantity ? <TableCell><Input type="number" min="0.01" step="0.01" value={line.quantity} onChange={(event) => updateLine(line.id, { quantity: Number(event.target.value) || 0 })} aria-label={`Cantidad de ${line.description}`} className="ml-auto h-8 w-full max-w-20 appearance-none text-right font-mono text-xs [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" /></TableCell> : null}
                            {columns.unitPrice ? <TableCell><Input type="number" min="0" step="0.01" value={line.unitPrice} onChange={(event) => updateLine(line.id, { unitPrice: Number(event.target.value) || 0 })} aria-label={`Precio unitario de ${line.description}`} className="ml-auto h-8 w-full max-w-28 appearance-none text-right font-mono text-xs [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" /></TableCell> : null}
                            {columns.discount ? <TableCell><Input type="number" min="0" max="100" step="0.1" value={line.discountPercent} onChange={(event) => updateLine(line.id, { discountPercent: Math.min(100, Number(event.target.value) || 0) })} aria-label={`Descuento de ${line.description}`} className="ml-auto h-8 w-full max-w-20 appearance-none text-right font-mono text-xs [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" /></TableCell> : null}
                            {columns.finalPrice ? <TableCell className="text-right font-mono text-xs">{money(line.unitPrice * (1 - line.discountPercent / 100))}</TableCell> : null}
                            {columns.auxiliary ? <TableCell><Input value={line.auxiliary} onChange={(event) => updateLine(line.id, { auxiliary: event.target.value })} aria-label={`Detalle auxiliar de ${line.description}`} className="h-8 w-full min-w-0" /></TableCell> : null}
                            {columns.vat ? <TableCell className="text-right font-mono text-xs">{line.vatRate}%</TableCell> : null}
                            {columns.amount ? <TableCell className="text-right font-mono text-sm font-semibold">{money(amount)}</TableCell> : null}
                            <TableCell className="text-right"><Button variant="ghost" size="icon-sm" aria-label={`Quitar ${line.description}`} onClick={() => setLines((current) => current.filter((candidate) => candidate.id !== line.id))}><Trash2 /></Button></TableCell>
                          </TableRow>
                        )
                      }) : null}
                      <TableRow aria-hidden="true" className="h-full border-0 hover:bg-transparent">
                        {Array.from({ length: visibleItemColumnCount }, (_, index) => (
                          <TableCell key={index} className="p-0" style={gridFillerStyle} />
                        ))}
                      </TableRow>
                    </TableBody>
            </Table>
            </div>
            {!lines.length ? (
              <div className="pointer-events-none absolute inset-x-0 top-10 bottom-0 grid place-items-center">
                <div className="bg-card/90 px-5 py-3 text-center">
                  <strong>No hay ítems cargados</strong>
                  <p className="mt-1 text-xs text-muted-foreground">Buscá por código o descripción para comenzar.</p>
                </div>
              </div>
            ) : null}
          </div>

              {layout !== "guided" ? (
                <div className="flex shrink-0 items-center justify-between border-t bg-muted/20 px-3 py-1.5 text-[11px] text-muted-foreground">
                  <span>Total cantidad: <strong className="font-mono text-foreground">{totals.quantity.toLocaleString("es-AR")}</strong></span>
                  <span>Neto <strong className="font-mono text-foreground">{money(totals.net)}</strong></span>
                </div>
              ) : null}
            </>
          ) : (
            <div className="min-h-0 flex-1 overflow-auto p-3">
              <div className="flex min-h-28 items-start gap-3 rounded-[4px] border border-dashed bg-muted/10 p-4">
                <Info className="mt-0.5 size-4 shrink-0 text-primary" />
                <div>
                  <h3 className="text-sm font-semibold">{extensionDetails[activeExtension]?.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{extensionDetails[activeExtension]?.description}</p>
                  <Badge variant="outline" className="mt-3 font-mono text-[9px]">Extensión configurable · placeholder</Badge>
                </div>
              </div>
            </div>
          )}
        </section>

      </div>

      {layout === "guided" ? (
        <div className="z-20 grid shrink-0 grid-cols-1 gap-2 border-t bg-card px-2 py-2 shadow-[0_-8px_24px_rgba(0,0,0,0.04)] sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-x-3 sm:gap-y-1 sm:px-3 sm:py-1.5 2xl:flex 2xl:py-2">
          <div className="hidden min-w-20 shrink-0 2xl:block">
            <h2 id="advanced-summary-title" className="text-sm font-semibold">Resumen</h2>
            <p className={cn("truncate text-[9px]", error ? "text-destructive" : notice ? "text-emerald-700 dark:text-emerald-400" : "text-muted-foreground")}>{error || notice || "Impuestos e importes"}</p>
          </div>
          <div className="flex min-w-0 flex-1 gap-6 overflow-x-auto pb-1 [&>*]:min-w-24 sm:grid sm:grid-cols-5 sm:gap-x-3 sm:overflow-visible sm:pb-0 sm:[&>*]:min-w-0">
            <Metric label="Bonificación" value={money(totals.discount)} />
            <Metric label="Neto" value={money(totals.net)} />
            <Metric label="IVA 21 %" value={money(totals.vat)} />
            <Metric label="Imp. internos" value={money(0)} />
            <Metric label="Percepciones" value={money(0)} />
          </div>
          <div className="flex shrink-0 items-center justify-between border-t pt-2 sm:block sm:min-w-40 sm:border-t-0 sm:border-l sm:px-3 sm:pt-0 sm:text-right">
            <div className="font-mono text-[9px] font-semibold tracking-wide text-muted-foreground uppercase">Total</div>
            <div className="font-mono text-lg font-bold tabular-nums">{money(totals.total)}</div>
          </div>
          <div className="grid grid-cols-2 gap-2 border-t pt-2 sm:col-span-2 sm:flex sm:shrink-0 sm:items-center sm:justify-end sm:pt-1 2xl:col-span-1 2xl:border-t-0 2xl:border-l 2xl:pt-0 2xl:pl-3">
            <Button variant="ghost" size="sm" className="w-full sm:w-auto">Cancelar</Button>
            <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => setNotice("Borrador guardado localmente en la demostración.")}><Save />Guardar borrador</Button>
            <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => setNotice("Vista previa simulada preparada.")}><Eye />Vista previa</Button>
            <Button size="sm" className="w-full sm:w-auto" onClick={emit}><FileCheck2 />Emitir factura</Button>
          </div>
        </div>
      ) : (
        <div className="z-20 grid shrink-0 grid-cols-1 gap-2 border-t bg-card px-2 py-2 shadow-[0_-8px_24px_rgba(0,0,0,0.04)] sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-x-3 sm:gap-y-1 sm:px-3 sm:py-1.5 2xl:flex 2xl:py-2">
          <div className="flex min-w-0 flex-1 gap-6 overflow-x-auto pb-1 [&>*]:min-w-24 sm:grid sm:grid-cols-5 sm:gap-x-3 sm:overflow-visible sm:pb-0 sm:[&>*]:min-w-0">
            <Metric label="Bonificación" value={money(totals.discount)} />
            <Metric label="Neto" value={money(totals.net)} />
            <Metric label="IVA 21 %" value={money(totals.vat)} />
            <Metric label="Imp. internos" value={money(0)} />
            <Metric label="Percepciones" value={money(0)} />
          </div>
          <div className="flex shrink-0 items-center justify-between border-t pt-2 sm:block sm:min-w-40 sm:border-t-0 sm:border-l sm:px-3 sm:pt-0 sm:text-right">
            <div className="font-mono text-[9px] font-semibold tracking-wide text-muted-foreground uppercase">Total</div>
            <div className="font-mono text-lg font-bold tabular-nums">{money(totals.total)}</div>
          </div>
          <div className="grid grid-cols-2 gap-2 border-t pt-2 sm:col-span-2 sm:flex sm:shrink-0 sm:items-center sm:justify-end sm:pt-1 2xl:col-span-1 2xl:border-t-0 2xl:border-l 2xl:pt-0 2xl:pl-3">
            <Button variant="ghost" size="sm" className="w-full sm:w-auto">Cancelar</Button>
            <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => setNotice("Borrador guardado localmente en la demostración.")}><Save />Guardar borrador</Button>
            <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => setNotice("Vista previa simulada preparada.")}><Eye />Vista previa</Button>
            <Button size="sm" className="w-full sm:w-auto" onClick={emit}><FileCheck2 />Emitir factura</Button>
          </div>
        </div>
      )}

      <Sheet open={layout === "guided" && Boolean(workflowStep)} onOpenChange={(open) => { if (!open) setWorkflowStep(null) }}>
        <SheetContent className="w-[min(94vw,460px)] gap-0 p-0 sm:max-w-none">
          {activeWorkflowStep ? (
            <>
              <SheetHeader className="border-b pr-14">
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "grid size-8 place-items-center rounded-full border",
                    activeWorkflowStep.status === "defined" && "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
                    activeWorkflowStep.status === "optional" && "bg-muted text-muted-foreground",
                    activeWorkflowStep.status === "missing" && "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300"
                  )}>{activeWorkflowStep.status === "defined" ? <CheckCircle2 className="size-4" /> : activeWorkflowStep.status === "optional" ? <Info className="size-4" /> : <Circle className="size-4" />}</span>
                  <div><SheetTitle>{activeWorkflowStep.label}</SheetTitle><SheetDescription>{activeWorkflowStep.detail}</SheetDescription></div>
                </div>
              </SheetHeader>
              <div className="min-h-0 flex-1 overflow-y-auto p-4">
                <div className="mb-5 flex gap-3 rounded-[4px] border bg-muted/30 p-3 text-xs text-muted-foreground">
                  <Info className="mt-0.5 size-4 shrink-0 text-primary" />
                  <p>{workflowStep === "terms" ? "Definí cuándo se cobra esta factura. Si es a cuenta corriente, indicá el primer vencimiento." : workflowStep === "taxes" ? "Revisá solamente los impuestos adicionales que no se calculan automáticamente desde los ítems." : workflowStep === "delivery" ? "Indicá desde qué depósito sale la mercadería y si la factura debe generar un remito." : workflowStep === "source" ? "Vinculá un presupuesto solamente cuando esta factura provenga de una propuesta comercial previa." : "Registrá el pago ahora o dejalo pendiente para cobrarlo desde el flujo de Cobros."}</p>
                </div>

                {workflowStep === "terms" ? (
                  <div className="grid gap-4">
                    <Field label="Condición de venta"><Select value={saleCondition} onValueChange={setSaleCondition}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Cuenta corriente">Cuenta corriente</SelectItem><SelectItem value="Efectivo">Efectivo</SelectItem><SelectItem value="Otros">Otros</SelectItem></SelectContent></Select></Field>
                    {saleCondition === "Cuenta corriente" ? <Field label="Primer vencimiento"><div className="flex items-center gap-2"><Input type="number" min="0" value={dueDays} onChange={(event) => setDueDays(event.target.value)} /><span className="shrink-0 text-sm text-muted-foreground">días desde la emisión</span></div></Field> : null}
                  </div>
                ) : null}

                {workflowStep === "taxes" ? (
                  <label className="flex items-start gap-3 rounded-[4px] border p-3"><Checkbox checked={hasPerceptions} onCheckedChange={(value) => setHasPerceptions(value === true)} /><span><span className="block text-sm font-medium">Aplicar percepciones o retenciones</span><span className="mt-1 block text-xs text-muted-foreground">Habilita la carga manual cuando el tratamiento fiscal del cliente lo requiera.</span></span></label>
                ) : null}

                {workflowStep === "delivery" ? (
                  <div className="grid gap-4">
                    <Field label="Depósito"><Select value={warehouse} onValueChange={setWarehouse}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Central">1 · Central</SelectItem><SelectItem value="Depósito Norte">2 · Depósito Norte</SelectItem></SelectContent></Select></Field>
                    <Field label="Documento de entrega" hint="Definí explícitamente si esta factura debe generar un remito."><Select value={deliveryConfigured ? (automaticDeliveryNote ? "automatic" : "none") : ""} onValueChange={(value) => { setAutomaticDeliveryNote(value === "automatic"); setDeliveryConfigured(true) }}><SelectTrigger className="w-full"><SelectValue placeholder="Seleccionar una opción" /></SelectTrigger><SelectContent><SelectItem value="none">Sin remito</SelectItem><SelectItem value="automatic">Generar remito automáticamente</SelectItem></SelectContent></Select></Field>
                  </div>
                ) : null}

                {workflowStep === "source" ? <Field label="Presupuesto de origen" hint="Dejalo vacío si la factura no proviene de un presupuesto."><Input value={linkedBudget} onChange={(event) => setLinkedBudget(event.target.value)} placeholder="Ej: P-0004-00000128" /></Field> : null}

                {workflowStep === "payments" ? (
                  <Field label="Estado del pago"><Select value={paymentConfigured ? paymentStatus : ""} onValueChange={(value) => { setPaymentStatus(value); setPaymentConfigured(true) }}><SelectTrigger className="w-full"><SelectValue placeholder="Seleccionar una opción" /></SelectTrigger><SelectContent><SelectItem value="Pendiente">Registrar después</SelectItem><SelectItem value="Registrado">Pago registrado</SelectItem></SelectContent></Select></Field>
                ) : null}
              </div>
              <SheetFooter className="border-t"><Button variant="outline" onClick={() => setWorkflowStep(null)}>Cancelar</Button><Button onClick={() => { setNotice(`${activeWorkflowStep.label} actualizado.`); setWorkflowStep(null) }}>Aplicar</Button></SheetFooter>
            </>
          ) : null}
        </SheetContent>
      </Sheet>

      <Sheet open={(layout === "streamlined" || layout === "paper") && internalDataOpen} onOpenChange={setInternalDataOpen}>
        <SheetContent className="w-[min(94vw,440px)] gap-0 p-0 sm:max-w-none">
          <SheetHeader className="border-b pr-14">
            <SheetTitle>Más datos del comprobante</SheetTitle>
            <SheetDescription>Información administrativa de uso menos frecuente.</SheetDescription>
          </SheetHeader>
          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Número interno" className="sm:col-span-2"><Input value="51950660" readOnly className="bg-muted font-mono" /></Field>
              <Field label="Empresa"><Select value={company} onValueChange={setCompany}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Empresa 7">Empresa 7</SelectItem><SelectItem value="Empresa 1">Empresa 1</SelectItem></SelectContent></Select></Field>
              <Field label="Centro de costo"><Input value={costCenter} onChange={(event) => setCostCenter(event.target.value)} /></Field>
              <Field label="Lote" className="sm:col-span-2"><Input value={batch} onChange={(event) => setBatch(event.target.value)} placeholder="Sin lote" /></Field>
            </div>
          </div>
          <SheetFooter className="border-t"><Button onClick={() => setInternalDataOpen(false)}>Aplicar</Button></SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet open={configOpen} onOpenChange={setConfigOpen}>
        <SheetContent className="w-[min(94vw,520px)] gap-0 p-0 sm:max-w-none">
          <SheetHeader className="border-b pr-14">
            <SheetTitle>Configurar Facturación avanzada</SheetTitle>
            <SheetDescription>Mostrá u ocultá piezas para probar cómo se recompone la vista. La configuración no modifica reglas fiscales.</SheetDescription>
          </SheetHeader>
          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={resetConfiguration}>Vista completa</Button>
              <Button variant="outline" size="sm" onClick={useEssentialPreset}>Vista esencial</Button>
            </div>

            <div className="mt-5 grid gap-5">
              <section>
                <h3 className="text-sm font-semibold">Bloques de cabecera</h3>
                <p className="mt-1 text-xs text-muted-foreground">Cliente y comprobante permanece como anclaje del flujo.</p>
                <div className="mt-3 grid gap-2">
                  <ConfigToggle label="Cliente y comprobante" checked disabled onChange={() => undefined} />
                  {(Object.keys(blockLabels) as HeaderBlock[]).map((block) => <ConfigToggle key={block} label={blockLabels[block]} checked={blocks[block]} onChange={(checked) => setBlocks((current) => ({ ...current, [block]: checked }))} />)}
                </div>
              </section>

              {fieldGroups.map((group) => (
                <section key={group.title}>
                  <h3 className="text-sm font-semibold">Campos · {group.title}</h3>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {group.fields.map((field) => <ConfigToggle key={field.key} label={field.label} checked={fields[field.key]} onChange={(checked) => setFields((current) => ({ ...current, [field.key]: checked }))} />)}
                  </div>
                </section>
              ))}

              <section>
                <h3 className="text-sm font-semibold">Columnas de ítems</h3>
                <p className="mt-1 text-xs text-muted-foreground">Artículo y acciones permanecen visibles para conservar la operación básica.</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {(Object.keys(columnLabels) as ColumnKey[]).map((column) => <ConfigToggle key={column} label={columnLabels[column]} checked={columns[column]} disabled={column === "quantity" || column === "amount"} onChange={(checked) => setColumns((current) => ({ ...current, [column]: checked }))} />)}
                </div>
              </section>
            </div>
          </div>
          <SheetFooter className="flex-row items-center justify-between border-t">
            <Button variant="ghost" size="sm" onClick={resetConfiguration}><RotateCcw />Restablecer</Button>
            <Button size="sm" onClick={() => setConfigOpen(false)}>Aplicar a la demo</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      {issuedInvoiceDialog}
    </div>
  )
}
