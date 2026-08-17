"use client"

import {
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import {
  CalendarIcon,
  Check,
  ChevronRight,
  Eye,
  Filter,
  FilePlus2,
  Info,
  Pencil,
  Plus,
  RotateCcw,
  Scale,
  Search,
  SlidersHorizontal,
  Trash2,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
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
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { money } from "../mock-data"
import type { Budget, BudgetLine, BudgetTotals, Customer, Product } from "../types"
import { Field, Metric } from "./shared"

type EditorMode = { kind: "create" } | { kind: "edit"; id: string }

const emptyTotals: BudgetTotals = {
  net: 0,
  bonus: 0,
  vat105: 0,
  vat21: 0,
  vat27: 0,
  otherPerceptions: 0,
  total: 0,
}

function displayDate(value: string) {
  if (!value) return "Seleccionar fecha"
  return format(parseISO(value), "dd/MM/yyyy")
}

function todayString() {
  return "2026-07-22"
}

function recalculate(lines: BudgetLine[]): BudgetTotals {
  const net = lines.reduce((sum, line) => sum + line.finalPrice * line.quantity, 0)
  const total = lines.reduce((sum, line) => sum + line.priceWithVat * line.quantity, 0)
  return {
    ...emptyTotals,
    net,
    vat21: Math.max(0, total - net),
    total,
  }
}

function createDraft(customers: Customer[]): Budget {
  const customer = customers.find((item) => item.active) ?? customers[0]
  return {
    id: "",
    number: "Se asignará al crear",
    internalNumber: "",
    date: todayString(),
    destination: "Mostrador",
    pointOfSale: "PV 0004",
    letter: "X",
    cc: "1",
    validity: "No confirmado · demo",
    customerId: customer?.id ?? "",
    customerName: customer?.name ?? "",
    customerTaxId: customer?.document || "Sin identificación fiscal",
    seller: "Sofía Romero",
    priceList: customer?.priceList ?? "Publico",
    saleCondition: customer?.saleCondition ?? "Efectivo",
    currency: "ARS",
    purchaseOrder: "",
    shift: "",
    observations: "",
    lines: [],
    totals: emptyTotals,
    annulled: false,
    audit: { createdBy: "Sofía Romero", createdAt: "22/07/2026 20:00" },
  }
}

function DatePicker({ value, onChange, label }: { value: string; onChange: (value: string) => void; label: string }) {
  const [open, setOpen] = useState(false)
  const selected = value ? parseISO(value) : undefined

  return (
    <div className="grid min-w-0 gap-1.5">
      <span className="font-mono text-[11px] font-semibold text-foreground">{label}</span>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button type="button" variant="outline" className="h-9 justify-between px-3 font-normal">
            <span>{displayDate(value)}</span>
            <CalendarIcon className="size-4 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selected}
            locale={es}
            onSelect={(date) => {
              if (!date) return
              onChange(format(date, "yyyy-MM-dd"))
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

function BudgetDetail({ budget, onClose, onEdit }: { budget: Budget | null; onClose: () => void; onEdit: (id: string) => void }) {
  return (
    <Sheet open={Boolean(budget)} onOpenChange={(open) => { if (!open) onClose() }}>
      <SheetContent
        className="w-[min(760px,92vw)] max-w-none gap-0 sm:max-w-none"
      >
        {budget ? (
          <>
            <SheetHeader className="border-b pr-12">
              <div className="flex items-center gap-2">
                <SheetTitle>{budget.number}</SheetTitle>
                {budget.annulled ? <Badge variant="destructive">Anulado</Badge> : null}
              </div>
              <SheetDescription>
                Presupuesto del {displayDate(budget.date)} · Datos simulados
              </SheetDescription>
            </SheetHeader>
            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <Metric label="Cliente" value={budget.customerName} />
                <Metric label="CUIT / Documento" value={budget.customerTaxId} />
                <Metric label="Total" value={money(budget.totals.total)} strong />
                <Metric label="Vigencia" value={budget.validity} />
                <Metric label="Vendedor" value={budget.seller} />
                <Metric label="Condición de venta" value={budget.saleCondition} />
              </div>

              <section className="mt-5 overflow-hidden rounded-[4px] border">
                <div className="flex items-center justify-between border-b px-3 py-2">
                  <h3 className="text-sm font-semibold">Artículos</h3>
                  <span className="text-xs text-muted-foreground">{budget.lines.length} ítems</span>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Descripción</TableHead>
                      <TableHead className="text-right">Cantidad</TableHead>
                      <TableHead className="text-right">Importe</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {budget.lines.length ? budget.lines.map((line) => (
                      <TableRow key={line.id}>
                        <TableCell>
                          <div className="font-medium">{line.description}</div>
                          <div className="font-mono text-[11px] text-muted-foreground">{line.code} · {line.unit}</div>
                        </TableCell>
                        <TableCell className="text-right font-mono">{line.quantity}</TableCell>
                        <TableCell className="text-right font-mono font-semibold">{money(line.amount)}</TableCell>
                      </TableRow>
                    )) : (
                      <TableRow><TableCell colSpan={3} className="h-24 text-center text-muted-foreground">Sin artículos cargados</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </section>

              <div className="mt-4 grid gap-4 border-t pt-4 sm:grid-cols-2">
                <div>
                  <h3 className="text-sm font-semibold">Relaciones</h3>
                  <dl className="mt-2 grid gap-2 text-xs">
                    <div><dt className="text-muted-foreground">Facturado</dt><dd>{budget.invoicedRelation ?? "Sin relación"}</dd></div>
                    <div><dt className="text-muted-foreground">Derivado</dt><dd>{budget.derivedRelation ?? "Sin relación"}</dd></div>
                  </dl>
                  <p className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground"><Info className="size-3" />Relaciones representadas como datos de ejemplo.</p>
                </div>
                <details className="text-xs">
                  <summary className="cursor-pointer font-semibold">Datos técnicos y auditoría</summary>
                  <dl className="mt-2 grid gap-2">
                    <div><dt className="text-muted-foreground">Punto de venta</dt><dd>{budget.pointOfSale}</dd></div>
                    <div><dt className="text-muted-foreground">Número interno</dt><dd>{budget.internalNumber || "—"}</dd></div>
                    <div><dt className="text-muted-foreground">Creado por</dt><dd>{budget.audit.createdBy} · {budget.audit.createdAt}</dd></div>
                  </dl>
                </details>
              </div>
            </div>
            <SheetFooter className="border-t bg-background">
              <Button onClick={() => onEdit(budget.id)}><Pencil />Editar presupuesto</Button>
            </SheetFooter>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}

function BudgetList({ budgets, onCreate, onOpen, onEdit }: {
  budgets: Budget[]
  onCreate: () => void
  onOpen: (id: string) => void
  onEdit: (id: string) => void
}) {
  const [search, setSearch] = useState("")
  const [period, setPeriod] = useState("30")
  const [includeAnnulled, setIncludeAnnulled] = useState(false)

  const visible = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("es")
    const cutoff = period === "all" ? null : new Date("2026-07-22T12:00:00")
    if (cutoff) cutoff.setDate(cutoff.getDate() - Number(period))
    return budgets.filter((budget) => {
      const matchesSearch = !query || [budget.number, budget.customerName, budget.customerTaxId]
        .some((value) => value.toLocaleLowerCase("es").includes(query))
      const matchesPeriod = !cutoff || parseISO(budget.date) >= cutoff
      return matchesSearch && matchesPeriod && (includeAnnulled || !budget.annulled)
    })
  }, [budgets, includeAnnulled, period, search])

  function clearFilters() {
    setSearch("")
    setPeriod("30")
    setIncludeAnnulled(false)
  }

  return (
    <main className="flex h-full min-h-0 flex-col bg-background">
      <section className="flex min-h-0 flex-1 flex-col bg-background p-3 md:p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold">Presupuestos</h1>
              <Badge variant="outline" className="rounded-[4px] font-mono text-[10px]">Datos simulados</Badge>
            </div>
            <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">{visible.length} de {budgets.length} presupuestos</p>
          </div>
          <Button className="h-10 rounded-[4px] font-mono" onClick={onCreate}><Plus />Crear presupuesto</Button>
        </div>

        <div className="mt-3 grid min-w-0 gap-2 md:flex md:items-center" aria-label="Búsqueda y filtros de presupuestos">
          <div className="relative min-w-0 flex-1 md:min-w-[320px]">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por número, cliente o CUIT"
              className="h-9 w-full rounded-[4px] bg-card pl-9"
              aria-label="Buscar presupuestos"
            />
          </div>
          <div className="grid grid-cols-2 gap-1.5 md:ml-auto md:flex md:shrink-0 md:items-center md:justify-end">
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="h-9 rounded-[4px]" aria-label="Período"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Período: 7 d</SelectItem>
                  <SelectItem value="30">Período: 30 d</SelectItem>
                  <SelectItem value="90">Período: 90 d</SelectItem>
                  <SelectItem value="all">Período: todos</SelectItem>
                </SelectContent>
              </Select>
              <label className="flex h-9 cursor-pointer items-center gap-2 rounded-[4px] border bg-card px-2.5 font-mono text-[11px] font-semibold whitespace-nowrap">
                <Checkbox checked={includeAnnulled} onCheckedChange={(value) => setIncludeAnnulled(value === true)} />
                Anulados
              </label>
          </div>
        </div>

        <div className="mt-3 min-h-0 flex-1 overflow-auto">
          <div className="grid gap-2 md:hidden">
            {visible.length ? visible.map((budget) => (
              <article
                key={budget.id}
                tabIndex={0}
                role="button"
                className="rounded-[4px] border bg-card p-3 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() => onOpen(budget.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    onOpen(budget.id)
                  }
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-mono text-[10px] text-muted-foreground">
                      {displayDate(budget.date)} · {budget.validity}
                    </div>
                    <div className="mt-1 font-mono text-xs font-semibold">{budget.number}</div>
                    <div className="mt-1 truncate text-sm font-medium">{budget.customerName}</div>
                    <div className="font-mono text-[10px] text-muted-foreground">{budget.customerTaxId}</div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="font-mono text-[9px] uppercase text-muted-foreground">Total</div>
                    <strong className="font-mono text-sm">{money(budget.totals.total)}</strong>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3 border-t pt-2">
                  <span className={cn("truncate text-xs text-muted-foreground", budget.annulled && "text-destructive")}>
                    {budget.annulled ? "Anulado" : budget.invoicedRelation ?? "Sin documento relacionado"}
                  </span>
                  <div className="flex shrink-0 gap-1">
                    <Button variant="ghost" size="icon-sm" aria-label={`Ver ${budget.number}`} onClick={(event) => { event.stopPropagation(); onOpen(budget.id) }}><Eye /></Button>
                    <Button variant="ghost" size="icon-sm" aria-label={`Editar ${budget.number}`} onClick={(event) => { event.stopPropagation(); onEdit(budget.id) }}><Pencil /></Button>
                  </div>
                </div>
              </article>
            )) : (
              <div className="grid min-h-48 place-items-center rounded-[4px] border bg-card p-4 text-center">
                <strong>No hay presupuestos para los filtros aplicados</strong>
              </div>
            )}
          </div>
          <div className="hidden min-w-[900px] overflow-hidden rounded-[4px] border bg-card md:block">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-muted/95 backdrop-blur-sm">
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-9 font-mono text-[10px] font-semibold uppercase">Fecha</TableHead>
                <TableHead className="h-9 font-mono text-[10px] font-semibold uppercase">Número</TableHead>
                <TableHead className="h-9 font-mono text-[10px] font-semibold uppercase">Cliente</TableHead>
                <TableHead className="h-9 font-mono text-[10px] font-semibold uppercase">Vigencia</TableHead>
                <TableHead className="h-9 text-right font-mono text-[10px] font-semibold uppercase">Total</TableHead>
                <TableHead className="h-9 font-mono text-[10px] font-semibold uppercase">Relación</TableHead>
                <TableHead className="sticky right-0 h-9 w-28 bg-muted/95 text-right font-mono text-[10px] font-semibold uppercase">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.length ? visible.map((budget) => (
                <TableRow key={budget.id} tabIndex={0} className="h-11 cursor-pointer focus-visible:bg-muted focus-visible:outline-none" onClick={() => onOpen(budget.id)} onKeyDown={(event) => event.key === "Enter" && onOpen(budget.id)}>
                  <TableCell className="font-mono text-xs">{displayDate(budget.date)}</TableCell>
                  <TableCell className="font-mono text-xs font-semibold">{budget.number}</TableCell>
                  <TableCell>
                    <div className="max-w-[240px] truncate font-medium">{budget.customerName}</div>
                    <div className="font-mono text-[10px] text-muted-foreground">{budget.customerTaxId}</div>
                  </TableCell>
                  <TableCell>
                    <span className={cn("text-xs", budget.annulled && "text-destructive")}>{budget.annulled ? "Anulado" : budget.validity}</span>
                  </TableCell>
                  <TableCell className="text-right font-mono font-semibold">{money(budget.totals.total)}</TableCell>
                  <TableCell className="max-w-52 truncate text-xs text-muted-foreground">{budget.invoicedRelation ?? "—"}</TableCell>
                  <TableCell className="sticky right-0 bg-card py-1.5">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon-sm" aria-label={`Ver ${budget.number}`} onClick={(event) => { event.stopPropagation(); onOpen(budget.id) }}><Eye /></Button>
                      <Button variant="ghost" size="icon-sm" aria-label={`Editar ${budget.number}`} onClick={(event) => { event.stopPropagation(); onEdit(budget.id) }}><Pencil /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-56 text-center">
                    <div className="mx-auto grid max-w-sm justify-items-center gap-2">
                      {budgets.length ? <Filter className="size-6 text-muted-foreground" /> : <FilePlus2 className="size-6 text-muted-foreground" />}
                      <strong>{budgets.length ? "No hay presupuestos para los filtros aplicados" : "Todavía no hay presupuestos"}</strong>
                      <span className="text-xs text-muted-foreground">{budgets.length ? "Cambiá o limpiá los filtros para recuperar resultados." : "Creá el primer presupuesto desde la acción principal."}</span>
                      {budgets.length ? <Button size="sm" variant="outline" className="rounded-[4px]" onClick={clearFilters}><RotateCcw />Limpiar filtros</Button> : <Button size="sm" className="rounded-[4px]" onClick={onCreate}><Plus />Crear presupuesto</Button>}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          </div>
        </div>
      </section>
    </main>
  )
}

function BudgetEditor({ mode, source, customers, products, onCancel, onSave }: {
  mode: EditorMode
  source: Budget
  customers: Customer[]
  products: Product[]
  onCancel: () => void
  onSave: (budget: Budget) => void
}) {
  const [draft, setDraft] = useState<Budget>(() => structuredClone(source))
  const [initial] = useState(() => JSON.stringify(source))
  const [productSearch, setProductSearch] = useState("")
  const [lineDetailId, setLineDetailId] = useState<string | null>(null)
  const [confirmClose, setConfirmClose] = useState(false)
  const [notice, setNotice] = useState("")
  const [saveError, setSaveError] = useState("")
  const dirty = JSON.stringify(draft) !== initial
  const activeCustomers = customers.filter((customer) => customer.active || customer.id === draft.customerId)
  const suggestions = productSearch.trim().length < 2 ? [] : products.filter((product) => product.active && [product.code, product.barcode, product.name]
    .some((value) => value.toLocaleLowerCase("es").includes(productSearch.toLocaleLowerCase("es")))).slice(0, 6)
  const selectedLine = draft.lines.find((line) => line.id === lineDetailId) ?? null

  function update(patch: Partial<Budget>) {
    setDraft((current) => ({ ...current, ...patch }))
  }

  function updateLine(id: string, patch: Partial<BudgetLine>) {
    setDraft((current) => {
      const lines = current.lines.map((line) => {
        if (line.id !== id) return line
        const next = { ...line, ...patch }
        return { ...next, amount: next.priceWithVat * next.quantity }
      })
      return { ...current, lines, totals: recalculate(lines) }
    })
  }

  function addProduct(product: Product) {
    const priceWithVat = product.salePrice ?? 0
    const finalPrice = priceWithVat / 1.21
    const line: BudgetLine = {
      id: `budget-line-${product.id}-${draft.lines.length + 1}`,
      productId: product.id,
      code: product.code,
      description: product.name,
      unit: product.unit,
      unitCount: 1,
      quantity: 1,
      basePrice: finalPrice,
      manualDiscount: 0,
      promotionalDiscount: 0,
      discountPercent: product.discountPercent ?? 0,
      finalPrice,
      vatRate: 21,
      vatType: "G · demo",
      priceWithVat,
      priceList: draft.priceList,
      deliveryDate: draft.date,
      amount: priceWithVat,
    }
    setDraft((current) => {
      const lines = [...current.lines, line]
      return { ...current, lines, totals: recalculate(lines) }
    })
    setProductSearch("")
  }

  function requestClose() {
    if (dirty) setConfirmClose(true)
    else onCancel()
  }

  function save() {
    setSaveError("")
    if (!draft.customerId) {
      setSaveError("Seleccioná un cliente para continuar.")
      return
    }
    try {
      onSave(draft)
    } catch {
      setSaveError("No se pudo guardar. Los datos permanecen en el formulario para reintentar.")
    }
  }

  return (
    <>
      <Sheet open onOpenChange={(open) => { if (!open) requestClose() }}>
        <SheetContent className="w-[min(98vw,1080px)] gap-0 p-0 sm:max-w-none md:min-w-[720px] lg:w-[72vw] lg:min-w-[900px] xl:w-[64vw]">
          <SheetHeader className="shrink-0 border-b px-5 py-4 pr-14">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2"><SheetTitle className="text-lg">{mode.kind === "create" ? "Nuevo presupuesto" : `Editar ${draft.number}`}</SheetTitle><Badge variant="outline" className="font-mono text-[10px]">Datos simulados</Badge></div>
                <SheetDescription>Guardarlo no factura, no reserva stock y no registra movimientos.</SheetDescription>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground"><Check className="size-4" />{dirty ? "Cambios sin guardar" : "Sin cambios pendientes"}</div>
            </div>
          </SheetHeader>

          <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <section className="grid gap-3 rounded-[4px] border p-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Cliente" required className="sm:col-span-2">
            <Select value={draft.customerId} onValueChange={(id) => {
              const customer = customers.find((item) => item.id === id)
              if (!customer) return
              update({ customerId: id, customerName: customer.name, customerTaxId: customer.document || "Sin identificación fiscal", priceList: customer.priceList, saleCondition: customer.saleCondition })
            }}>
              <SelectTrigger className="h-9 w-full"><SelectValue placeholder="Seleccionar cliente" /></SelectTrigger>
              <SelectContent>{activeCustomers.map((customer) => <SelectItem key={customer.id} value={customer.id}>{customer.code} · {customer.name}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <DatePicker label="Fecha" value={draft.date} onChange={(date) => update({ date })} />
          <Field label="Validez">
            <Select value={draft.validity} onValueChange={(validity) => update({ validity })}>
              <SelectTrigger className="h-9 w-full"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="No confirmado · demo">No confirmado · demo</SelectItem><SelectItem value="Vigencia 15 días · demo">15 días · demo</SelectItem><SelectItem value="Vigencia 30 días · demo">30 días · demo</SelectItem></SelectContent>
            </Select>
          </Field>
          <Field label="Vendedor"><Select value={draft.seller} onValueChange={(seller) => update({ seller })}><SelectTrigger className="h-9 w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Sofía Romero">Sofía Romero</SelectItem><SelectItem value="Marcos Díaz">Marcos Díaz</SelectItem><SelectItem value="Lucía Fernández">Lucía Fernández</SelectItem></SelectContent></Select></Field>
          <Field label="Lista de precios"><Select value={draft.priceList} onValueChange={(priceList) => update({ priceList })}><SelectTrigger className="h-9 w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Publico">Publico</SelectItem><SelectItem value="Mayorista">Mayorista</SelectItem><SelectItem value="Corporativa">Corporativa</SelectItem></SelectContent></Select></Field>
          <Field label="Condición de venta"><Select value={draft.saleCondition} onValueChange={(saleCondition) => update({ saleCondition })}><SelectTrigger className="h-9 w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Efectivo">Efectivo</SelectItem><SelectItem value="Cuenta corriente">Cuenta corriente</SelectItem></SelectContent></Select></Field>
          <Field label="Moneda"><Select value={draft.currency} disabled><SelectTrigger className="h-9 w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ARS">Peso argentino</SelectItem></SelectContent></Select></Field>
        </section>

        <section className="mt-4 overflow-visible rounded-[4px] border">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3">
            <div><h2 className="font-semibold">Artículos</h2><p className="text-xs text-muted-foreground">Buscá por código, descripción o código de barras.</p></div>
            <Button variant="outline" size="sm" onClick={() => { setNotice("La integración con balanza permanece como placeholder del prototipo."); window.setTimeout(() => setNotice(""), 3000) }}><Scale />Balanza</Button>
          </div>
          <div className="relative p-3">
            <Search className="pointer-events-none absolute top-1/2 left-6 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={productSearch} onChange={(event) => setProductSearch(event.target.value)} placeholder="Agregar artículo por código, descripción o código de barras" className="h-10 pl-9" />
            {suggestions.length ? (
              <div className="absolute inset-x-3 top-[calc(100%-0.5rem)] z-30 overflow-hidden rounded-[4px] border bg-popover shadow-xl">
                {suggestions.map((product) => (
                  <button key={product.id} type="button" onClick={() => addProduct(product)} className="flex w-full items-center gap-3 border-b px-3 py-2 text-left last:border-0 hover:bg-muted">
                    <span className="font-mono text-xs font-semibold">{product.code}</span><span className="min-w-0 flex-1 truncate text-sm">{product.name}</span><span className="font-mono text-xs">{money(product.salePrice)}</span><ChevronRight className="size-4" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <div className="overflow-x-auto border-t">
            <Table>
              <TableHeader><TableRow><TableHead>Artículo</TableHead><TableHead>Unidad</TableHead><TableHead className="w-28">Cantidad</TableHead><TableHead className="text-right">Precio c/IVA</TableHead><TableHead className="hidden text-right lg:table-cell">Dto. %</TableHead><TableHead className="hidden text-right xl:table-cell">IVA</TableHead><TableHead className="text-right">Importe</TableHead><TableHead className="w-20 text-right">Acc.</TableHead></TableRow></TableHeader>
              <TableBody>
                {draft.lines.length ? draft.lines.map((line) => (
                  <TableRow key={line.id}>
                    <TableCell><div className="font-medium">{line.description}</div><div className="font-mono text-[11px] text-muted-foreground">{line.code}</div></TableCell>
                    <TableCell className="text-xs">{line.unit}</TableCell>
                    <TableCell><Input type="number" min={0.001} step="any" value={line.quantity} onChange={(event) => updateLine(line.id, { quantity: Number(event.target.value) || 0 })} className="h-8 font-mono" aria-label={`Cantidad de ${line.description}`} /></TableCell>
                    <TableCell className="text-right font-mono text-xs">{money(line.priceWithVat)}</TableCell>
                    <TableCell className="hidden text-right font-mono text-xs lg:table-cell">{line.discountPercent}%</TableCell>
                    <TableCell className="hidden text-right font-mono text-xs xl:table-cell">{line.vatRate}%</TableCell>
                    <TableCell className="text-right font-mono font-semibold">{money(line.amount)}</TableCell>
                    <TableCell><div className="flex justify-end"><Button variant="ghost" size="icon-sm" aria-label={`Editar detalle de ${line.description}`} onClick={() => setLineDetailId(line.id)}><SlidersHorizontal /></Button><Button variant="ghost" size="icon-sm" aria-label={`Quitar ${line.description}`} onClick={() => setDraft((current) => { const lines = current.lines.filter((item) => item.id !== line.id); return { ...current, lines, totals: recalculate(lines) } })}><Trash2 /></Button></div></TableCell>
                  </TableRow>
                )) : (
                  <TableRow><TableCell colSpan={8} className="h-32 text-center"><div className="font-semibold">Todavía no hay artículos</div><p className="mt-1 text-sm text-muted-foreground">Usá la búsqueda superior para sumar el primero.</p></TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-4 border-t bg-muted/25 px-4 py-3">
            <span className="text-xs text-muted-foreground">{draft.lines.length} ítems · {draft.lines.reduce((sum, line) => sum + line.quantity, 0)} unidades</span>
            <div className="flex flex-wrap items-end gap-5 text-right"><Metric label="Bonificación" value={money(draft.totals.bonus)} /><Metric label="IVA 21" value={money(draft.totals.vat21)} /><Metric label="Neto" value={money(draft.totals.net)} /><Metric label="Total" value={money(draft.totals.total)} strong /></div>
          </div>
        </section>

        <details className="mt-4 rounded-[4px] border p-4">
          <summary className="cursor-pointer text-sm font-semibold">Entrega, observaciones y datos secundarios</summary>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Destino"><Select value={draft.destination} onValueChange={(destination) => update({ destination })}><SelectTrigger className="h-9 w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Mostrador">Mostrador</SelectItem><SelectItem value="Entrega">Entrega</SelectItem></SelectContent></Select></Field>
            <Field label="Orden de compra"><Input value={draft.purchaseOrder} onChange={(event) => update({ purchaseOrder: event.target.value })} className="h-9" /></Field>
            <Field label="Turno"><Select value={draft.shift || "none"} onValueChange={(shift) => update({ shift: shift === "none" ? "" : shift })}><SelectTrigger className="h-9 w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">Sin turno</SelectItem><SelectItem value="Mañana">Mañana</SelectItem><SelectItem value="Tarde">Tarde</SelectItem></SelectContent></Select></Field>
            <Field label="Punto de venta"><Input value={draft.pointOfSale} onChange={(event) => update({ pointOfSale: event.target.value })} className="h-9" /></Field>
            <Field label="Observaciones" className="sm:col-span-2 lg:col-span-4"><Textarea value={draft.observations} onChange={(event) => update({ observations: event.target.value })} rows={3} /></Field>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Percepciones, vencimientos y trazabilidad quedan como extensiones secundarias hasta validar sus reglas.</p>
        </details>
          </div>

          <SheetFooter className="z-20 shrink-0 flex-row flex-wrap items-center justify-between gap-3 border-t bg-card px-4 py-3">
            <div>{saveError ? <p role="alert" className="text-sm text-destructive">{saveError}</p> : notice ? <p role="status" className="text-sm text-muted-foreground">{notice}</p> : <p className="text-xs text-muted-foreground">{draft.lines.length} ítems preparados</p>}</div>
            <div className="flex items-center gap-3"><span className="font-mono text-sm font-semibold">Total {money(draft.totals.total)}</span><Button variant="outline" onClick={requestClose}>Cancelar</Button><Button onClick={save}>{mode.kind === "create" ? "Crear presupuesto" : "Guardar cambios"}</Button></div>
          </SheetFooter>

          <Sheet open={Boolean(selectedLine)} onOpenChange={(open) => { if (!open) setLineDetailId(null) }}>
            <SheetContent className="sm:max-w-md">
              <SheetHeader><SheetTitle>Detalle del artículo</SheetTitle><SheetDescription>{selectedLine?.description}</SheetDescription></SheetHeader>
              {selectedLine ? <div className="grid gap-4 px-4">
                <Field label="Unidades por presentación"><Input type="number" value={selectedLine.unitCount} onChange={(event) => updateLine(selectedLine.id, { unitCount: Number(event.target.value) || 0 })} /></Field>
                <Field label="Descuento manual"><Input type="number" value={selectedLine.manualDiscount} onChange={(event) => updateLine(selectedLine.id, { manualDiscount: Number(event.target.value) || 0 })} /></Field>
                <Field label="Descuento promocional"><Input type="number" value={selectedLine.promotionalDiscount} onChange={(event) => updateLine(selectedLine.id, { promotionalDiscount: Number(event.target.value) || 0 })} /></Field>
                <Field label="Descuento %"><Input type="number" value={selectedLine.discountPercent} onChange={(event) => updateLine(selectedLine.id, { discountPercent: Number(event.target.value) || 0 })} /></Field>
                <DatePicker label="Fecha de entrega" value={selectedLine.deliveryDate} onChange={(deliveryDate) => updateLine(selectedLine.id, { deliveryDate })} />
                <p className="text-xs text-muted-foreground">La aplicación fiscal y comercial de descuentos se mantiene como placeholder; el prototipo preserva los valores ingresados.</p>
              </div> : null}
              <SheetFooter><Button onClick={() => setLineDetailId(null)}>Cerrar detalle</Button></SheetFooter>
            </SheetContent>
          </Sheet>
        </SheetContent>
      </Sheet>

      <Dialog open={confirmClose} onOpenChange={setConfirmClose}>
        <DialogContent>
          <DialogHeader><DialogTitle>¿Descartar cambios?</DialogTitle><DialogDescription>Los cambios de este presupuesto todavía no fueron guardados.</DialogDescription></DialogHeader>
          <DialogFooter><Button variant="outline" onClick={() => setConfirmClose(false)}>Seguir editando</Button><Button variant="destructive" onClick={onCancel}>Descartar cambios</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export function BudgetsWorkspace({ budgets, setBudgets, customers, products }: {
  budgets: Budget[]
  setBudgets: Dispatch<SetStateAction<Budget[]>>
  customers: Customer[]
  products: Product[]
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [editor, setEditor] = useState<EditorMode | null>(null)
  const selected = budgets.find((budget) => budget.id === selectedId) ?? null
  const source = editor?.kind === "edit" ? budgets.find((budget) => budget.id === editor.id) : editor ? createDraft(customers) : null

  return (
    <>
      <BudgetList budgets={budgets} onCreate={() => setEditor({ kind: "create" })} onOpen={setSelectedId} onEdit={(id) => setEditor({ kind: "edit", id })} />
      <BudgetDetail budget={selected} onClose={() => setSelectedId(null)} onEdit={(id) => { setSelectedId(null); setEditor({ kind: "edit", id }) }} />
      {editor && source ? (
        <BudgetEditor
          key={editor.kind === "edit" ? editor.id : "create"}
          mode={editor}
          source={source}
          customers={customers}
          products={products}
          onCancel={() => setEditor(null)}
          onSave={(draft) => {
            if (editor.kind === "create") {
              const sequence = budgets.reduce((maximum, budget) => Math.max(maximum, Number(budget.number.slice(-8)) || 0), 0) + 1
              const created: Budget = { ...draft, id: `budget-${sequence}`, number: `P-0004-${String(sequence).padStart(8, "0")}`, internalNumber: `PR-${sequence}` }
              setBudgets((current) => [created, ...current])
            } else {
              setBudgets((current) => current.map((budget) => budget.id === editor.id ? { ...draft, audit: { ...draft.audit, updatedBy: "Sofía Romero", updatedAt: "22/07/2026 20:00" } } : budget))
            }
            setEditor(null)
          }}
        />
      ) : null}
    </>
  )
}
