"use client"

import {
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react"
import {
  AlertTriangle,
  Check,
  ChevronDown,
  ClipboardList,
  Download,
  Eye,
  FileMinus2,
  FilePlus2,
  FileText,
  Filter,
  History,
  Plus,
  Printer,
  ReceiptText,
  RotateCcw,
  Search,
  Send,
  Truck,
} from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import type {
  CommercialContext,
  CommercialDocument,
  CommercialDocumentFamily,
  CommercialDocumentLine,
} from "../types"
import { Field, Metric } from "./shared"
import { InvoiceDrawerPrototype } from "./invoice-drawer-prototype"

type QuickFamily = "all" | "invoices" | "notes" | "delivery-notes"

type DraftEntry = {
  family: CommercialDocumentFamily
  originId?: string
}

type EmitDraftPayload = {
  family: "credit-note" | "debit-note"
  origin: CommercialDocument
  reason: string
  observations: string
  items: CommercialDocumentLine[]
  subtotal: number
  taxes: number
  total: number
}

const familyLabel: Record<CommercialDocumentFamily, string> = {
  invoice: "Factura",
  "credit-note": "Nota de crédito",
  "debit-note": "Nota de débito",
  "delivery-note": "Remito",
}

const familyPluralLabel: Record<CommercialDocumentFamily, string> = {
  invoice: "Facturas",
  "credit-note": "Notas de crédito",
  "debit-note": "Notas de débito",
  "delivery-note": "Remitos",
}

const familyIcon = {
  invoice: ReceiptText,
  "credit-note": FileMinus2,
  "debit-note": FilePlus2,
  "delivery-note": Truck,
} satisfies Record<CommercialDocumentFamily, typeof FileText>

const noteReasons: Record<"credit-note" | "debit-note", string[]> = {
  "credit-note": [
    "Devolución parcial · ejemplo",
    "Bonificación · ejemplo",
    "Diferencia de precio · ejemplo",
  ],
  "debit-note": [
    "Intereses · ejemplo",
    "Diferencia de precio · ejemplo",
    "Otro ajuste · ejemplo",
  ],
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-AR").format(
    new Date(`${value}T12:00:00`)
  )
}

function familyMatches(document: CommercialDocument, family: QuickFamily) {
  if (family === "all") return true
  if (family === "invoices") return document.family === "invoice"
  if (family === "notes") {
    return document.family === "credit-note" || document.family === "debit-note"
  }
  return document.family === "delivery-note"
}

function DocumentStatus({ status }: { status: string }) {
  const isPositive = /emit|registr|aplic|recibid|entreg/i.test(status)
  const isWarning = /pendiente|borrador/i.test(status)

  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-[4px] font-mono text-[10px] font-semibold",
        isPositive && "border-emerald-600/35 text-emerald-700 dark:text-emerald-400",
        isWarning && "border-amber-500/45 text-amber-700 dark:text-amber-300"
      )}
    >
      {status}
    </Badge>
  )
}

function NewDocumentMenu({
  onSelect,
  compact = false,
}: {
  onSelect: (family: CommercialDocumentFamily) => void
  compact?: boolean
}) {
  const options: CommercialDocumentFamily[] = [
    "invoice",
    "credit-note",
    "debit-note",
    "delivery-note",
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn("rounded-[4px] font-mono", compact ? "h-8" : "h-10")}
        >
          <Plus /> Nuevo documento <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 rounded-[4px]">
        <DropdownMenuLabel>Tipo disponible en este contexto</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map((family) => {
          const Icon = familyIcon[family]
          return (
            <DropdownMenuItem
              key={family}
              className="items-start gap-2 rounded-[4px] px-2 py-2"
              onSelect={() => onSelect(family)}
            >
              <Icon className="mt-0.5 text-muted-foreground" />
              <span className="grid gap-0.5">
                <strong className="font-medium">{familyLabel[family]}</strong>
                <span className="text-xs leading-4 text-muted-foreground">
                  {family === "invoice"
                    ? "Registrar una nueva operación comercial."
                    : family === "credit-note"
                      ? "Reducir o corregir un importe desde su origen."
                      : family === "debit-note"
                        ? "Incrementar o ajustar un importe desde su origen."
                        : "Registrar entrega o recepción de mercadería."}
                </span>
              </span>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function NewFixedDocumentButton({
  family,
  onSelect,
  compact = false,
}: {
  family: CommercialDocumentFamily
  onSelect: (family: CommercialDocumentFamily) => void
  compact?: boolean
}) {
  const Icon = familyIcon[family]
  const actionLabel =
    family === "delivery-note"
      ? "Nuevo remito"
      : `Nueva ${familyLabel[family].toLocaleLowerCase("es")}`

  return (
    <Button
      className={cn("rounded-[4px] font-mono", compact ? "h-8" : "h-10")}
      onClick={() => onSelect(family)}
    >
      <Icon /> {actionLabel}
    </Button>
  )
}

function CreateNoteMenu({
  onSelect,
  variant = "outline",
  label = "Crear nota",
}: {
  onSelect: (family: "credit-note" | "debit-note") => void
  variant?: "outline" | "ghost"
  label?: string
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} className="rounded-[4px] font-mono">
          <FilePlus2 /> {label} <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-[4px]">
        <DropdownMenuItem
          className="rounded-[4px] py-2"
          onSelect={() => onSelect("credit-note")}
        >
          <FileMinus2 /> Nota de crédito
        </DropdownMenuItem>
        <DropdownMenuItem
          className="rounded-[4px] py-2"
          onSelect={() => onSelect("debit-note")}
        >
          <FilePlus2 /> Nota de débito
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function DetailSheet({
  document,
  onClose,
  onCreateNote,
  onFeedback,
}: {
  document: CommercialDocument | null
  onClose: () => void
  onCreateNote: (family: "credit-note" | "debit-note", originId: string) => void
  onFeedback: (message: string) => void
}) {
  return (
    <Sheet open={Boolean(document)} modal={false} onOpenChange={(open) => !open && onClose()}>
      <SheetContent inline className="min-h-0 min-w-0 flex-1 gap-0 border-t p-0 xl:border-t-0 xl:border-l">
        {document ? (
          <>
            <SheetHeader className="shrink-0 border-b px-5 py-4 pr-14">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <SheetTitle className="text-lg">
                      {document.typeLabel} {document.number}
                    </SheetTitle>
                    <DocumentStatus status={document.status} />
                  </div>
                  <SheetDescription>
                    {document.context === "purchase" ? "Compra" : "Venta"} · {document.partyName}
                  </SheetDescription>
                </div>
                {document.family === "invoice" ? (
                  <CreateNoteMenu
                    onSelect={(family) => onCreateNote(family, document.id)}
                  />
                ) : null}
              </div>
            </SheetHeader>

            <div className="min-h-0 flex-1 overflow-y-auto p-5">
              <div className="grid gap-5">
                <section className="grid grid-cols-2 gap-4 rounded-[4px] border bg-card p-4 md:grid-cols-4">
                  <Metric label="Fecha" value={formatDate(document.date)} />
                  <Metric label="Contraparte" value={document.partyName} />
                  <Metric label="CUIT" value={document.partyTaxId} />
                  <Metric label="Total" value={money(document.total)} strong />
                </section>

                <section className="grid gap-3 rounded-[4px] border bg-card p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
                    <div>
                      <h3 className="font-semibold">Relación y estado</h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Referencias necesarias para comprender el documento.
                      </p>
                    </div>
                    <span className="font-mono text-xs text-muted-foreground">
                      {document.pointOfSale}
                    </span>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Metric
                      label="Documento de origen"
                      value={document.relatedDocument || "Sin relación registrada"}
                    />
                    <Metric
                      label="Estado fiscal"
                      value={document.fiscalState || "Pendiente de contrato real"}
                    />
                  </div>
                </section>

                <section className="overflow-hidden rounded-[4px] border bg-card">
                  <div className="border-b px-4 py-3">
                    <h3 className="font-semibold">Ítems del documento</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Importes y tasas son datos simulados para validar la composición.
                    </p>
                  </div>
                  <Table>
                    <TableHeader className="bg-muted/80">
                      <TableRow>
                        <TableHead className="font-mono text-[10px] uppercase">Código</TableHead>
                        <TableHead className="min-w-[240px] font-mono text-[10px] uppercase">Descripción</TableHead>
                        <TableHead className="text-right font-mono text-[10px] uppercase">Cant.</TableHead>
                        <TableHead className="text-right font-mono text-[10px] uppercase">Precio</TableHead>
                        <TableHead className="text-right font-mono text-[10px] uppercase">IVA</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {document.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-mono text-xs">{item.code}</TableCell>
                          <TableCell>{item.description}</TableCell>
                          <TableCell className="text-right font-mono">{item.quantity}</TableCell>
                          <TableCell className="text-right font-mono">{money(item.unitPrice)}</TableCell>
                          <TableCell className="text-right font-mono">{item.vatRate}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="grid justify-end gap-1 border-t bg-muted/20 px-4 py-3 text-right">
                    <span className="text-xs text-muted-foreground">
                      Subtotal {money(document.subtotal)} · Impuestos {money(document.taxes)}
                    </span>
                    <strong className="font-mono text-lg">{money(document.total)}</strong>
                  </div>
                </section>

                <Alert className="rounded-[4px]">
                  <AlertTriangle />
                  <AlertTitle>Impacto pendiente de validación</AlertTitle>
                  <AlertDescription>
                    Los efectos fiscales, contables, de stock y cuenta corriente no están confirmados para este prototipo.
                  </AlertDescription>
                </Alert>

                <details className="rounded-[4px] border bg-card">
                  <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 font-semibold">
                    <History className="size-4 text-muted-foreground" /> Auditoría
                    <span className="ml-auto font-mono text-[10px] text-muted-foreground">Secundaria</span>
                  </summary>
                  <div className="grid gap-3 border-t px-4 py-3 md:grid-cols-2">
                    <Metric label="Creado por" value={document.audit.createdBy} />
                    <Metric label="Fecha y hora" value={document.audit.createdAt} />
                    {document.audit.updatedBy ? (
                      <Metric label="Última edición" value={document.audit.updatedBy} />
                    ) : null}
                    {document.audit.updatedAt ? (
                      <Metric label="Editado el" value={document.audit.updatedAt} />
                    ) : null}
                  </div>
                </details>
              </div>
            </div>

            <SheetFooter className="shrink-0 flex-row justify-end border-t bg-card px-5 py-3">
              <Button
                variant="outline"
                className="rounded-[4px]"
                onClick={() => onFeedback("Impresión simulada preparada")}
              >
                <Printer /> Imprimir
              </Button>
              <Button
                variant="outline"
                className="rounded-[4px]"
                onClick={() => onFeedback("Exportación simulada preparada")}
              >
                <Download /> Exportar
              </Button>
            </SheetFooter>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}

function DocumentFormSheet({
  context,
  draft,
  invoices,
  onClose,
  onEmit,
}: {
  context: CommercialContext
  draft: DraftEntry
  invoices: CommercialDocument[]
  onClose: () => void
  onEmit: (payload: EmitDraftPayload) => void
}) {
  const initialOrigin = invoices.find((invoice) => invoice.id === draft.originId)
  const [originId, setOriginId] = useState(draft.originId || "")
  const [reason, setReason] = useState("")
  const [observations, setObservations] = useState("")
  const [selectedLineIds, setSelectedLineIds] = useState<string[]>(
    initialOrigin?.items.map((item) => item.id) || []
  )
  const [quantities, setQuantities] = useState<Record<string, number>>(
    initialOrigin
      ? Object.fromEntries(initialOrigin.items.map((item) => [item.id, item.quantity]))
      : {}
  )
  const [confirmOpen, setConfirmOpen] = useState(false)

  const family = draft.family
  const isNote = family === "credit-note" || family === "debit-note"
  const origin = invoices.find((invoice) => invoice.id === originId)
  const contextLabel = context === "purchase" ? "compra" : "venta"

  const chooseOrigin = (nextOriginId: string) => {
    const nextOrigin = invoices.find((invoice) => invoice.id === nextOriginId)
    setOriginId(nextOriginId)
    setSelectedLineIds(nextOrigin?.items.map((item) => item.id) || [])
    setQuantities(
      nextOrigin
        ? Object.fromEntries(nextOrigin.items.map((item) => [item.id, item.quantity]))
        : {}
    )
  }

  const adjustedItems = useMemo(() => {
    if (!origin) return []
    return origin.items
      .filter((item) => selectedLineIds.includes(item.id))
      .map((item) => ({ ...item, quantity: quantities[item.id] || 0 }))
      .filter((item) => item.quantity > 0)
  }, [origin, quantities, selectedLineIds])

  const subtotal = adjustedItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  )
  const taxes = adjustedItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice * (item.vatRate / 100),
    0
  )
  const total = subtotal + taxes
  const canEmit = Boolean(isNote && origin && reason && adjustedItems.length)
  const actionLabel =
    family === "credit-note"
      ? "Emitir nota de crédito"
      : family === "debit-note"
        ? "Emitir nota de débito"
        : family === "invoice"
          ? "Emitir factura"
          : "Confirmar remito"

  const closeForm = () => {
    if (confirmOpen) setConfirmOpen(false)
    onClose()
  }

  if (family === "invoice") {
    return <InvoiceDrawerPrototype embedded context={context} onClose={closeForm} />
  }

  return (
    <>
      <Sheet open modal={false} onOpenChange={(open) => !open && closeForm()}>
        <SheetContent inline className="min-h-0 min-w-0 flex-1 gap-0 border-t p-0 xl:border-t-0 xl:border-l">
          <>
              <SheetHeader className="shrink-0 border-b px-5 py-4 pr-14">
                <div className="flex flex-wrap items-center gap-2">
                  <SheetTitle className="text-lg">
                    Nueva {familyLabel[family].toLocaleLowerCase("es")} de {contextLabel}
                  </SheetTitle>
                  <Badge variant="outline" className="rounded-[4px] font-mono text-[10px]">
                    Prototipo
                  </Badge>
                </div>
                <SheetDescription>
                  El contexto comercial proviene de la navegación y no se vuelve a solicitar.
                </SheetDescription>
              </SheetHeader>

              <div className="min-h-0 flex-1 overflow-y-auto bg-background p-4 md:p-5">
                {isNote ? (
                  <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_310px]">
                    <main className="grid min-w-0 gap-4">
                      <section className="grid gap-4 rounded-[4px] border bg-card p-4">
                        <div className="border-b pb-3">
                          <h3 className="font-semibold">Origen y contraparte</h3>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            El vínculo obligatorio con factura todavía debe validarse con producto.
                          </p>
                        </div>
                        <Field label="Factura de origen" required>
                          <Select value={originId} onValueChange={chooseOrigin}>
                            <SelectTrigger className="h-10 rounded-[4px]">
                              <SelectValue placeholder="Buscar o seleccionar factura" />
                            </SelectTrigger>
                            <SelectContent>
                              {invoices.map((invoice) => (
                                <SelectItem key={invoice.id} value={invoice.id}>
                                  {invoice.typeLabel} {invoice.number} · {invoice.partyName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </Field>
                        {origin ? (
                          <div className="grid gap-3 rounded-[4px] bg-muted/60 p-3 md:grid-cols-3">
                            <Metric label={context === "purchase" ? "Proveedor" : "Cliente"} value={origin.partyName} />
                            <Metric label="CUIT" value={origin.partyTaxId} />
                            <Metric label="Moneda" value={origin.currency} />
                          </div>
                        ) : null}
                      </section>

                      <section className="overflow-hidden rounded-[4px] border bg-card">
                        <div className="border-b px-4 py-3">
                          <h3 className="font-semibold">Ítems a ajustar</h3>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            Seleccioná únicamente los ítems que participan de la nota.
                          </p>
                        </div>
                        {origin ? (
                          <Table>
                            <TableHeader className="bg-muted/80">
                              <TableRow>
                                <TableHead className="w-12" />
                                <TableHead className="min-w-[230px] font-mono text-[10px] uppercase">Ítem</TableHead>
                                <TableHead className="w-24 text-right font-mono text-[10px] uppercase">Cantidad</TableHead>
                                <TableHead className="text-right font-mono text-[10px] uppercase">Precio</TableHead>
                                <TableHead className="text-right font-mono text-[10px] uppercase">IVA</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {origin.items.map((item) => {
                                const selected = selectedLineIds.includes(item.id)
                                return (
                                  <TableRow key={item.id}>
                                    <TableCell>
                                      <Checkbox
                                        checked={selected}
                                        aria-label={`Incluir ${item.description}`}
                                        onCheckedChange={(checked) =>
                                          setSelectedLineIds((current) =>
                                            checked
                                              ? [...current, item.id]
                                              : current.filter((id) => id !== item.id)
                                          )
                                        }
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <div className="font-medium">{item.description}</div>
                                      <div className="font-mono text-[10px] text-muted-foreground">{item.code}</div>
                                    </TableCell>
                                    <TableCell>
                                      <Input
                                        type="number"
                                        min={0}
                                        max={item.quantity}
                                        disabled={!selected}
                                        value={quantities[item.id] ?? item.quantity}
                                        onChange={(event) =>
                                          setQuantities((current) => ({
                                            ...current,
                                            [item.id]: Math.min(item.quantity, Math.max(0, Number(event.target.value))),
                                          }))
                                        }
                                        className="h-8 w-20 rounded-[4px] text-right font-mono"
                                      />
                                    </TableCell>
                                    <TableCell className="text-right font-mono">{money(item.unitPrice)}</TableCell>
                                    <TableCell className="text-right font-mono">{item.vatRate}%</TableCell>
                                  </TableRow>
                                )
                              })}
                            </TableBody>
                          </Table>
                        ) : (
                          <div className="grid h-36 place-items-center p-4 text-center">
                            <div>
                              <ClipboardList className="mx-auto mb-2 size-6 text-muted-foreground" />
                              <strong>Seleccioná una factura</strong>
                              <p className="mt-1 text-xs text-muted-foreground">
                                Los ítems compatibles se mostrarán en esta región.
                              </p>
                            </div>
                          </div>
                        )}
                      </section>

                      <section className="grid gap-4 rounded-[4px] border bg-card p-4 md:grid-cols-2">
                        <Field
                          label="Motivo / subtipo"
                          required
                          hint="Opciones de ejemplo pendientes de validación."
                        >
                          <Select value={reason} onValueChange={setReason}>
                            <SelectTrigger className="h-10 rounded-[4px]"><SelectValue placeholder="Seleccionar motivo" /></SelectTrigger>
                            <SelectContent>
                              {noteReasons[family as "credit-note" | "debit-note"].map((option) => (
                                <SelectItem key={option} value={option}>{option}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </Field>
                        <Field label="Observaciones">
                          <Textarea
                            value={observations}
                            onChange={(event) => setObservations(event.target.value)}
                            placeholder="Detalle opcional"
                            className="min-h-20 rounded-[4px]"
                          />
                        </Field>
                      </section>
                    </main>

                    <aside className="grid gap-4 lg:sticky lg:top-0">
                      <section className="rounded-[4px] border bg-card p-4">
                        <h3 className="border-b pb-3 font-semibold">Resumen de importes</h3>
                        <div className="grid gap-3 pt-3">
                          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span className="font-mono">{money(subtotal)}</span></div>
                          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Impuestos</span><span className="font-mono">{money(taxes)}</span></div>
                          <div className="flex items-end justify-between border-t pt-3"><strong>Total</strong><strong className="font-mono text-xl">{money(total)}</strong></div>
                        </div>
                      </section>
                      <Alert className="rounded-[4px] border-amber-500/45 bg-amber-500/5">
                        <AlertTriangle />
                        <AlertTitle>Impacto de ejemplo</AlertTitle>
                        <AlertDescription>
                          Cálculos, efectos fiscales, stock y cuenta corriente no representan reglas productivas confirmadas.
                        </AlertDescription>
                      </Alert>
                      {!canEmit ? (
                        <p className="rounded-[4px] border border-dashed p-3 text-xs text-muted-foreground">
                          Para habilitar la acción de prueba, elegí origen, motivo y al menos un ítem con cantidad mayor a cero.
                        </p>
                      ) : null}
                    </aside>
                  </div>
                ) : (
                  <div className="mx-auto grid max-w-2xl gap-4">
                    <Alert className="rounded-[4px] border-amber-500/45 bg-amber-500/5">
                      <AlertTriangle />
                      <AlertTitle>Flujo pendiente de contrato</AlertTitle>
                      <AlertDescription>
                        El acceso y el contexto están integrados, pero los campos, estados y efectos de {familyLabel[family].toLocaleLowerCase("es")} todavía no están definidos con evidencia suficiente. La confirmación permanece bloqueada para no inventar reglas.
                      </AlertDescription>
                    </Alert>
                    <section className="grid gap-4 rounded-[4px] border bg-card p-4 md:grid-cols-2">
                      <Field label={context === "purchase" ? "Proveedor" : "Cliente"}>
                        <Input disabled placeholder="Pendiente de contrato de datos" className="h-10 rounded-[4px]" />
                      </Field>
                      <Field label="Fecha">
                        <Input type="date" defaultValue="2026-07-22" disabled className="h-10 rounded-[4px]" />
                      </Field>
                    </section>
                  </div>
                )}
              </div>

              <SheetFooter className="shrink-0 flex-row items-center justify-between border-t bg-card px-5 py-3">
                <span className="hidden text-xs text-muted-foreground sm:block">
                  {isNote ? "Acción fiscal simulada; no afecta sistemas reales." : "Falta contrato funcional para confirmar."}
                </span>
                <div className="ml-auto flex gap-2">
                  <Button variant="outline" className="rounded-[4px]" onClick={closeForm}>Cancelar</Button>
                  <Button
                    className="rounded-[4px] font-mono"
                    disabled={!canEmit}
                    onClick={() => setConfirmOpen(true)}
                  >
                    <Send /> {actionLabel}
                  </Button>
                </div>
              </SheetFooter>
            </>
        </SheetContent>
      </Sheet>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="rounded-[4px] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{actionLabel}?</DialogTitle>
            <DialogDescription>
              Esta confirmación actualiza solamente los datos simulados del prototipo. No genera efectos fiscales, contables, de stock ni dinero.
            </DialogDescription>
          </DialogHeader>
          <Alert className="rounded-[4px]">
            <AlertTriangle />
            <AlertTitle>Reglas pendientes</AlertTitle>
            <AlertDescription>
              El resultado se identificará como demo para no presentarlo como un estado real del producto.
            </AlertDescription>
          </Alert>
          <DialogFooter>
            <Button variant="outline" className="rounded-[4px]" onClick={() => setConfirmOpen(false)}>Volver a revisar</Button>
            <Button
              className="rounded-[4px]"
              onClick={() => {
                if (!origin || !isNote) return
                onEmit({
                  family: family as "credit-note" | "debit-note",
                  origin,
                  reason,
                  observations,
                  items: adjustedItems,
                  subtotal,
                  taxes,
                  total,
                })
                setConfirmOpen(false)
              }}
            >
              <Send /> Confirmar simulación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export function CommercialDocumentsWorkspace({
  context,
  fixedFamily,
  documents,
  setDocuments,
}: {
  context: CommercialContext
  fixedFamily?: CommercialDocumentFamily
  documents: CommercialDocument[]
  setDocuments: Dispatch<SetStateAction<CommercialDocument[]>>
}) {
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [period, setPeriod] = useState("30")
  const [quickFamily, setQuickFamily] = useState<QuickFamily>("all")
  const [exactFamily, setExactFamily] = useState<"all" | CommercialDocumentFamily>("all")
  const [status, setStatus] = useState("all")
  const [pointOfSale, setPointOfSale] = useState("all")
  const [includeAnnulled, setIncludeAnnulled] = useState(false)
  const [selected, setSelected] = useState<CommercialDocument | null>(null)
  const [draft, setDraft] = useState<DraftEntry | null>(null)
  const [notice, setNotice] = useState("")

  useEffect(() => {
    const timeout = window.setTimeout(() => setLoading(false), 320)
    return () => window.clearTimeout(timeout)
  }, [context, fixedFamily])

  useEffect(() => {
    if (!notice) return
    const timeout = window.setTimeout(() => setNotice(""), 3000)
    return () => window.clearTimeout(timeout)
  }, [notice])

  const contextDocuments = useMemo(
    () => documents.filter((document) => document.context === context),
    [context, documents]
  )
  const invoices = useMemo(
    () => contextDocuments.filter((document) => document.family === "invoice"),
    [contextDocuments]
  )
  const scopedDocuments = useMemo(
    () => fixedFamily
      ? contextDocuments.filter((document) => document.family === fixedFamily)
      : contextDocuments,
    [contextDocuments, fixedFamily]
  )
  const statusOptions = useMemo(
    () => [...new Set(scopedDocuments.map((document) => document.status))],
    [scopedDocuments]
  )
  const pointOptions = useMemo(
    () => [...new Set(scopedDocuments.map((document) => document.pointOfSale))],
    [scopedDocuments]
  )

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("es")
    const anchor = new Date("2026-07-22T12:00:00")
    return scopedDocuments.filter((document) => {
      const searchable = `${document.number} ${document.partyName} ${document.partyTaxId}`.toLocaleLowerCase("es")
      const age = Math.floor(
        (anchor.getTime() - new Date(`${document.date}T12:00:00`).getTime()) /
          86_400_000
      )
      const matchesPeriod =
        period === "all" ||
        (period === "year" ? document.date.startsWith("2026") : age <= Number(period))
      return (
        (!normalized || searchable.includes(normalized)) &&
        matchesPeriod &&
        (Boolean(fixedFamily) || familyMatches(document, quickFamily)) &&
        (Boolean(fixedFamily) || exactFamily === "all" || document.family === exactFamily) &&
        (status === "all" || document.status === status) &&
        (pointOfSale === "all" || document.pointOfSale === pointOfSale) &&
        (includeAnnulled || !/anulad/i.test(document.status))
      )
    })
  }, [exactFamily, fixedFamily, includeAnnulled, period, pointOfSale, query, quickFamily, scopedDocuments, status])

  const clearAllFilters = () => {
    setQuery("")
    setPeriod("30")
    setQuickFamily("all")
    setExactFamily("all")
    setStatus("all")
    setPointOfSale("all")
    setIncludeAnnulled(false)
  }

  const startNew = (family: CommercialDocumentFamily, originId?: string) => {
    setSelected(null)
    setDraft({ family, originId })
  }

  const selectDocument = (document: CommercialDocument) => {
    setDraft(null)
    setSelected(document)
  }

  const emitNote = (payload: EmitDraftPayload) => {
    const sequence = documents.filter((document) => document.family === payload.family).length + 218
    const created: CommercialDocument = {
      id: `demo-${payload.family}-${Date.now()}`,
      context,
      family: payload.family,
      typeLabel: familyLabel[payload.family],
      date: "2026-07-22",
      number: `SIM-${context === "purchase" ? "C" : "V"}-${String(sequence).padStart(6, "0")}`,
      partyName: payload.origin.partyName,
      partyTaxId: payload.origin.partyTaxId,
      subtotal: payload.subtotal,
      taxes: payload.taxes,
      total: payload.total,
      currency: "ARS",
      status: "Emitida · demo",
      relatedDocument: `${payload.origin.typeLabel} ${payload.origin.number}`,
      pointOfSale: payload.origin.pointOfSale,
      fiscalState: `Sin efecto real · ${payload.reason}`,
      items: payload.items,
      audit: { createdBy: "Sofía Romero", createdAt: "22/07/2026 · simulación" },
    }
    setDocuments((current) => [created, ...current])
    setDraft(null)
    setSelected(created)
    setNotice(`${created.typeLabel} creada en modo demostración`)
  }

  const contextLabel = context === "purchase" ? "compra" : "venta"
  const partyLabel = context === "purchase" ? "Proveedor" : "Cliente"
  const workspaceTitle = fixedFamily
    ? `${familyPluralLabel[fixedFamily]} de ${contextLabel}`
    : `Documentos de ${contextLabel}`
  const workspaceDescription = fixedFamily
    ? `${filtered.length} de ${scopedDocuments.length} ${familyPluralLabel[fixedFamily].toLocaleLowerCase("es")}`
    : `${filtered.length} de ${contextDocuments.length} documentos · facturas, notas y remitos`
  const sidePanelOpen = Boolean(selected || draft)
  const tableColumns = sidePanelOpen
    ? ["Fecha", "Número", partyLabel, "Total"]
    : ["Fecha", "Número", partyLabel, "Tipo", "Total", "Estado", "Documento relacionado"]

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <div className={cn("flex min-h-0 flex-1 flex-col", sidePanelOpen && "xl:flex-row")}>
      <section className={cn(
        "flex min-h-0 flex-1 flex-col bg-background p-3 md:p-4",
        sidePanelOpen && "max-xl:max-h-[42%] xl:w-[42%] xl:flex-none"
      )}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">{workspaceTitle}</h2>
              <Badge variant="outline" className="rounded-[4px] font-mono text-[10px]">Datos simulados</Badge>
            </div>
            <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
              {workspaceDescription}
            </p>
          </div>
          {fixedFamily ? (
            <NewFixedDocumentButton family={fixedFamily} onSelect={(family) => startNew(family)} />
          ) : (
            <NewDocumentMenu onSelect={(family) => startNew(family)} />
          )}
        </div>

        <div className="relative mt-3 min-w-0">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`Buscar por número, ${partyLabel.toLocaleLowerCase("es")} o CUIT`}
            aria-label={`Buscar documentos por número, ${partyLabel.toLocaleLowerCase("es")} o CUIT`}
            className="h-10 w-full rounded-[4px] bg-card pl-9"
          />
        </div>

        <div
          className="mt-2 grid min-w-0 gap-2 md:flex md:items-center md:justify-between md:gap-3"
          aria-label="Filtros de documentos"
        >
          {!fixedFamily ? <Tabs
            value={quickFamily}
            onValueChange={(value) => setQuickFamily(value as QuickFamily)}
            className="max-w-full shrink-0 gap-0 overflow-x-auto"
          >
            <TabsList className="min-h-11 rounded-[4px] p-2" aria-label="Familia de documento">
              {([
                ["all", "Todos"],
                ["invoices", "Facturas"],
                ["notes", "Notas"],
                ["delivery-notes", "Remitos"],
              ] as const).map(([value, label]) => (
                <TabsTrigger key={value} value={value} className="h-7 rounded-[4px] px-2.5 font-mono">
                  {label}
                  <span className="text-[10px] text-current opacity-70">
                    {contextDocuments.filter((document) => familyMatches(document, value)).length}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs> : null}

          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 md:ml-auto md:flex md:shrink-0 md:items-center md:justify-end">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="h-9 rounded-[4px]" aria-label="Período">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">Período: 30 d</SelectItem>
                <SelectItem value="90">Período: 90 d</SelectItem>
                <SelectItem value="year">Período: 2026</SelectItem>
                <SelectItem value="all">Período: todo</SelectItem>
              </SelectContent>
            </Select>
            {!fixedFamily ? <Select value={exactFamily} onValueChange={(value) => setExactFamily(value as "all" | CommercialDocumentFamily)}>
              <SelectTrigger className="h-9 rounded-[4px]" aria-label="Tipo exacto"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tipo: todos</SelectItem>
                <SelectItem value="invoice">Tipo: factura</SelectItem>
                <SelectItem value="credit-note">Tipo: nota crédito</SelectItem>
                <SelectItem value="debit-note">Tipo: nota débito</SelectItem>
                <SelectItem value="delivery-note">Tipo: remito</SelectItem>
              </SelectContent>
            </Select> : null}
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-9 rounded-[4px]" aria-label="Estado"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Estado: todos</SelectItem>
                {statusOptions.map((option) => <SelectItem key={option} value={option}>Estado: {option}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={pointOfSale} onValueChange={setPointOfSale}>
              <SelectTrigger className="h-9 rounded-[4px]" aria-label="Punto de venta o depósito"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Punto: todos</SelectItem>
                {pointOptions.map((option) => <SelectItem key={option} value={option}>Punto: {option}</SelectItem>)}
              </SelectContent>
            </Select>
            <label className="flex h-9 shrink-0 items-center gap-2 rounded-[4px] border bg-card px-2.5 font-mono text-[11px] font-semibold whitespace-nowrap">
              <Checkbox checked={includeAnnulled} onCheckedChange={(checked) => setIncludeAnnulled(Boolean(checked))} />
              Anulados
            </label>
          </div>
        </div>

        <div className="mt-3 min-h-0 flex-1 overflow-auto">
        <div className="grid gap-2 md:hidden">
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-32 w-full rounded-[4px]" />
            ))
          ) : filtered.length ? (
            filtered.map((document) => (
              <article
                key={document.id}
                tabIndex={0}
                role="button"
                className="rounded-[4px] border bg-card p-3 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() => selectDocument(document)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    selectDocument(document)
                  }
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-mono text-[10px] text-muted-foreground">
                      {formatDate(document.date)}{sidePanelOpen ? "" : ` · ${document.typeLabel}`}
                    </div>
                    <div className="mt-1 font-mono text-xs font-semibold">{document.number}</div>
                    <div className="mt-1 truncate text-sm font-medium">{document.partyName}</div>
                    {!sidePanelOpen ? <div className="font-mono text-[10px] text-muted-foreground">{document.partyTaxId}</div> : null}
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="font-mono text-[9px] uppercase text-muted-foreground">Total</div>
                    <strong className="font-mono text-sm">{money(document.total)}</strong>
                  </div>
                </div>
                {!sidePanelOpen ? <div className="mt-3 flex items-center justify-between gap-3 border-t pt-2">
                  <div className="min-w-0">
                    <DocumentStatus status={document.status} />
                    <div className="mt-1 truncate text-[10px] text-muted-foreground">
                      {document.relatedDocument || "Sin documento relacionado"}
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-1" onClick={(event) => event.stopPropagation()}>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      aria-label={`Ver ${document.typeLabel} ${document.number}`}
                      onClick={() => selectDocument(document)}
                    >
                      <Eye />
                    </Button>
                    {document.family === "invoice" ? (
                      <CreateNoteMenu
                        variant="ghost"
                        label="Nota"
                        onSelect={(family) => startNew(family, document.id)}
                      />
                    ) : null}
                  </div>
                </div> : null}
              </article>
            ))
          ) : (
            <div className="grid min-h-48 place-items-center rounded-[4px] border bg-card p-4 text-center">
              <strong>No hay documentos para los filtros aplicados</strong>
            </div>
          )}
        </div>
        <div className={cn(
          "hidden overflow-hidden rounded-[4px] border bg-card md:block",
          sidePanelOpen ? "w-full min-w-0" : "min-w-[1050px]"
        )}>
          <Table className={sidePanelOpen ? "table-fixed" : undefined}>
            <TableHeader className="sticky top-0 z-10 bg-muted/95 backdrop-blur-sm">
              <TableRow className="hover:bg-transparent">
                {tableColumns.map((label) => (
                  <TableHead
                    key={label}
                    className={cn(
                      "h-9 font-mono text-[10px] font-semibold uppercase",
                      label === "Total" && "text-right",
                      sidePanelOpen && label === "Fecha" && "w-[20%]",
                      sidePanelOpen && label === "Número" && "w-[24%]",
                      sidePanelOpen && label === partyLabel && "w-[36%]",
                      sidePanelOpen && label === "Total" && "w-[20%]"
                    )}
                  >
                    {label}
                  </TableHead>
                ))}
                {!sidePanelOpen ? <TableHead className="sticky right-0 h-9 w-[126px] bg-muted/95 text-right font-mono text-[10px] font-semibold uppercase">Acciones</TableHead> : null}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index} className="h-11">
                    {Array.from({ length: tableColumns.length + (sidePanelOpen ? 0 : 1) }).map((__, cell) => (
                      <TableCell key={cell}><Skeleton className="h-4 w-full max-w-32 rounded-[4px]" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : filtered.length ? (
                filtered.map((document) => (
                  <TableRow
                    key={document.id}
                    tabIndex={0}
                    className="h-11 cursor-pointer focus-visible:bg-muted focus-visible:outline-none"
                    onClick={() => selectDocument(document)}
                    onKeyDown={(event) => event.key === "Enter" && selectDocument(document)}
                  >
                    <TableCell className={cn("font-mono text-xs", sidePanelOpen && "overflow-hidden text-ellipsis")}>{formatDate(document.date)}</TableCell>
                    <TableCell className={cn("font-mono text-xs font-semibold", sidePanelOpen && "overflow-hidden text-ellipsis")}>{document.number}</TableCell>
                    <TableCell className={sidePanelOpen ? "overflow-hidden" : undefined}>
                      <div className={cn("truncate font-medium", !sidePanelOpen && "max-w-[220px]")}>{document.partyName}</div>
                      {!sidePanelOpen ? <div className="font-mono text-[10px] text-muted-foreground">{document.partyTaxId}</div> : null}
                    </TableCell>
                    {!sidePanelOpen ? <TableCell>{document.typeLabel}</TableCell> : null}
                    <TableCell className={cn("text-right font-mono font-semibold", sidePanelOpen && "overflow-hidden text-ellipsis")}>{money(document.total)}</TableCell>
                    {!sidePanelOpen ? <TableCell><DocumentStatus status={document.status} /></TableCell> : null}
                    {!sidePanelOpen ? <TableCell className="max-w-[220px] truncate text-xs text-muted-foreground">{document.relatedDocument || "—"}</TableCell> : null}
                    {!sidePanelOpen ? <TableCell className="sticky right-0 bg-card py-1.5">
                      <div className="flex justify-end gap-1" onClick={(event) => event.stopPropagation()}>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          className="rounded-[4px]"
                          aria-label={`Ver ${document.typeLabel} ${document.number}`}
                          onClick={() => selectDocument(document)}
                        >
                          <Eye />
                        </Button>
                        {document.family === "invoice" ? (
                          <CreateNoteMenu
                            variant="ghost"
                            label="Nota"
                            onSelect={(family) => startNew(family, document.id)}
                          />
                        ) : null}
                      </div>
                    </TableCell> : null}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={tableColumns.length + (sidePanelOpen ? 0 : 1)} className="h-56 text-center">
                    <div className="mx-auto grid max-w-sm justify-items-center gap-2">
                      {scopedDocuments.length ? <Filter className="size-6 text-muted-foreground" /> : <FileText className="size-6 text-muted-foreground" />}
                      <strong>{scopedDocuments.length ? "No hay documentos para los filtros aplicados" : `Todavía no hay ${fixedFamily ? familyPluralLabel[fixedFamily].toLocaleLowerCase("es") : "documentos"}`}</strong>
                      <span className="text-xs text-muted-foreground">
                        {scopedDocuments.length ? "Cambiá o limpiá los filtros sin perder el contexto comercial." : "Creá el primer documento disponible para este contexto."}
                      </span>
                      {scopedDocuments.length ? (
                        <Button size="sm" variant="outline" className="rounded-[4px]" onClick={clearAllFilters}><RotateCcw /> Limpiar filtros</Button>
                      ) : fixedFamily ? (
                        <NewFixedDocumentButton compact family={fixedFamily} onSelect={(family) => startNew(family)} />
                      ) : (
                        <NewDocumentMenu compact onSelect={(family) => startNew(family)} />
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        </div>
      </section>

      <DetailSheet
        document={selected}
        onClose={() => setSelected(null)}
        onCreateNote={(family, originId) => startNew(family, originId)}
        onFeedback={setNotice}
      />

      {draft ? (
        <DocumentFormSheet
          key={`${context}-${draft.family}-${draft.originId || "new"}`}
          context={context}
          draft={draft}
          invoices={invoices}
          onClose={() => setDraft(null)}
          onEmit={emitNote}
        />
      ) : null}
      </div>

      {notice ? (
        <div role="status" className="fixed right-4 bottom-4 z-[80] flex max-w-sm items-center gap-2 rounded-[4px] border bg-popover px-3 py-2 text-xs shadow-xl">
          <Check className="size-4 text-emerald-600" /> {notice}
        </div>
      ) : null}
    </div>
  )
}
