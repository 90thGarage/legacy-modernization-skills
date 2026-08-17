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
  CalendarDays,
  Check,
  Download,
  Eye,
  Filter,
  HandCoins,
  History,
  Plus,
  Printer,
  ReceiptText,
  RotateCcw,
  Search,
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
import { Skeleton } from "@/components/ui/skeleton"
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
  MoneyTransaction,
  MoneyTransactionContext,
} from "../types"
import { Field, Metric } from "./shared"

type PartyOption = {
  id: string
  name: string
  taxId: string
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-AR").format(
    new Date(`${value}T12:00:00`)
  )
}

function TransactionStatus({ status }: { status: string }) {
  const isPositive = /registr|emit/i.test(status)
  const isWarning = /borrador|pendiente/i.test(status)

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

function TransactionDetailSheet({
  transaction,
  onClose,
  onFeedback,
}: {
  transaction: MoneyTransaction | null
  onClose: () => void
  onFeedback: (message: string) => void
}) {
  const isPayment = transaction?.context === "payment"

  return (
    <Sheet open={Boolean(transaction)} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-[min(96vw,900px)] gap-0 p-0 sm:max-w-none md:w-[48vw] md:min-w-[720px]">
        {transaction ? (
          <>
            <SheetHeader className="shrink-0 border-b px-5 py-4 pr-14">
              <div className="flex items-center gap-2">
                <SheetTitle className="text-lg">
                  {isPayment ? "Orden de pago" : "Recibo"} {transaction.number}
                </SheetTitle>
                <TransactionStatus status={transaction.status} />
              </div>
              <SheetDescription>
                {transaction.partyName} · {transaction.partyTaxId}
              </SheetDescription>
            </SheetHeader>

            <div className="min-h-0 flex-1 overflow-y-auto p-5">
              <div className="grid gap-5">
                <section className="grid grid-cols-2 gap-4 rounded-[4px] border bg-card p-4 md:grid-cols-4">
                  <Metric label="Fecha" value={formatDate(transaction.date)} />
                  <Metric label={isPayment ? "Proveedor" : "Cliente"} value={transaction.partyName} />
                  <Metric label="CUIT / documento" value={transaction.partyTaxId} />
                  <Metric label="Total" value={money(transaction.total)} strong />
                </section>

                <section className="grid gap-3 rounded-[4px] border bg-card p-4">
                  <div className="border-b pb-3">
                    <h3 className="font-semibold">Detalle y relación</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Información necesaria para reconocer la operación.
                    </p>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Metric label="Detalle" value={transaction.detail} />
                    <Metric label="Documento relacionado" value={transaction.relatedDocument || "Sin relación registrada"} />
                    <Metric label="Empresa / local" value={transaction.location} />
                    <Metric label="Moneda" value={transaction.currency} />
                  </div>
                </section>

                <Alert className="rounded-[4px]">
                  <AlertTriangle />
                  <AlertTitle>Aplicaciones y medios pendientes de validación</AlertTitle>
                  <AlertDescription>
                    El prototipo no inventa imputaciones, retenciones, medios ni efectos contables. Esta operación es solamente demostrativa.
                  </AlertDescription>
                </Alert>

                <details className="rounded-[4px] border bg-card">
                  <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 font-semibold">
                    <History className="size-4 text-muted-foreground" /> Auditoría
                    <span className="ml-auto font-mono text-[10px] text-muted-foreground">Secundaria</span>
                  </summary>
                  <div className="grid gap-3 border-t px-4 py-3 md:grid-cols-2">
                    <Metric label="Creado por" value={transaction.audit.createdBy} />
                    <Metric label="Fecha y hora" value={transaction.audit.createdAt} />
                    {transaction.audit.updatedBy ? <Metric label="Última edición" value={transaction.audit.updatedBy} /> : null}
                    {transaction.audit.updatedAt ? <Metric label="Editado el" value={transaction.audit.updatedAt} /> : null}
                  </div>
                </details>
              </div>
            </div>

            <SheetFooter className="shrink-0 flex-row justify-end border-t bg-card px-5 py-3">
              <Button variant="outline" className="rounded-[4px]" onClick={() => onFeedback("Impresión simulada preparada")}>
                <Printer /> Imprimir
              </Button>
              <Button variant="outline" className="rounded-[4px]" onClick={() => onFeedback("Exportación simulada preparada")}>
                <Download /> Exportar
              </Button>
            </SheetFooter>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}

function TransactionFormSheet({
  context,
  parties,
  onClose,
  onCreate,
}: {
  context: MoneyTransactionContext
  parties: PartyOption[]
  onClose: () => void
  onCreate: (transaction: Omit<MoneyTransaction, "id" | "number" | "audit">) => void
}) {
  const [date, setDate] = useState("2026-07-22")
  const [partyId, setPartyId] = useState("")
  const [total, setTotal] = useState("")
  const [detail, setDetail] = useState("")
  const [observations, setObservations] = useState("")
  const party = parties.find((item) => item.id === partyId)
  const isPayment = context === "payment"
  const actionLabel = isPayment ? "Crear orden de pago" : "Crear recibo"
  const canCreate = Boolean(party && Number(total) > 0 && detail.trim())

  return (
    <Sheet open onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-[min(98vw,960px)] gap-0 p-0 sm:max-w-none md:w-[60vw] md:min-w-[720px]">
        <SheetHeader className="shrink-0 border-b px-5 py-4 pr-14">
          <SheetTitle className="text-lg">
            {isPayment ? "Nueva orden de pago" : "Nuevo recibo"}
          </SheetTitle>
          <SheetDescription>
            {isPayment ? "Compras · proveedor" : "Ventas · cliente"}. El contexto se hereda de la navegación.
          </SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          <div className="grid gap-5">
            <section className="grid gap-4 rounded-[4px] border bg-card p-4 md:grid-cols-2">
              <Field label="Fecha" required>
                <Input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="h-10 rounded-[4px]" />
              </Field>
              <Field label={isPayment ? "Proveedor" : "Cliente"} required>
                <Select value={partyId} onValueChange={setPartyId}>
                  <SelectTrigger className="h-10 rounded-[4px]"><SelectValue placeholder={`Seleccionar ${isPayment ? "proveedor" : "cliente"}`} /></SelectTrigger>
                  <SelectContent>
                    {parties.map((option) => (
                      <SelectItem key={option.id} value={option.id}>{option.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Importe total" required hint="Importe simulado; no genera movimiento real.">
                <Input min="0" step="0.01" type="number" value={total} onChange={(event) => setTotal(event.target.value)} placeholder="0,00" className="h-10 rounded-[4px] font-mono" />
              </Field>
              <Field label="Detalle / concepto" required>
                <Input value={detail} onChange={(event) => setDetail(event.target.value)} placeholder="Motivo breve de la operación" className="h-10 rounded-[4px]" />
              </Field>
              <Field label="Observaciones" className="md:col-span-2">
                <Textarea value={observations} onChange={(event) => setObservations(event.target.value)} placeholder="Información adicional opcional" className="min-h-20 rounded-[4px]" />
              </Field>
            </section>

            <Alert className="rounded-[4px]">
              <AlertTriangle />
              <AlertTitle>Documentos aplicados y medios</AlertTitle>
              <AlertDescription>
                Placeholder de dominio: falta validar aplicaciones parciales/totales, medios, retenciones y efectos contables. El alta crea solamente un borrador de demostración.
              </AlertDescription>
            </Alert>

            <section className="flex flex-wrap items-center justify-between gap-3 rounded-[4px] border bg-muted/30 p-4">
              <div>
                <div className="font-mono text-[10px] font-semibold uppercase text-muted-foreground">Resumen</div>
                <div className="mt-1 text-sm">
                  {party?.name || `Sin ${isPayment ? "proveedor" : "cliente"}`} · {detail || "Sin detalle"}
                </div>
              </div>
              <strong className="font-mono text-xl">{money(Number(total) || 0)}</strong>
            </section>
          </div>
        </div>

        <SheetFooter className="shrink-0 flex-row items-center justify-between border-t bg-card px-5 py-3">
          <span className="text-xs text-muted-foreground">Se guardará como Borrador · demo</span>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-[4px]" onClick={onClose}>Cancelar</Button>
            <Button
              className="rounded-[4px]"
              disabled={!canCreate}
              onClick={() => {
                if (!party || !canCreate) return
                onCreate({
                  context,
                  date,
                  partyName: party.name,
                  partyTaxId: party.taxId,
                  total: Number(total),
                  currency: "ARS",
                  detail: observations.trim() ? `${detail.trim()} · ${observations.trim()}` : detail.trim(),
                  status: "Borrador · demo",
                  location: "Casa Central",
                })
              }}
            >
              <Check /> {actionLabel}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export function MoneyTransactionsWorkspace({
  context,
  transactions,
  setTransactions,
  parties,
}: {
  context: MoneyTransactionContext
  transactions: MoneyTransaction[]
  setTransactions: Dispatch<SetStateAction<MoneyTransaction[]>>
  parties: PartyOption[]
}) {
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [period, setPeriod] = useState("30")
  const [status, setStatus] = useState("all")
  const [location, setLocation] = useState("all")
  const [includeAnnulled, setIncludeAnnulled] = useState(false)
  const [selected, setSelected] = useState<MoneyTransaction | null>(null)
  const [creating, setCreating] = useState(false)
  const [notice, setNotice] = useState("")

  useEffect(() => {
    const timeout = window.setTimeout(() => setLoading(false), 320)
    return () => window.clearTimeout(timeout)
  }, [context])

  useEffect(() => {
    if (!notice) return
    const timeout = window.setTimeout(() => setNotice(""), 3000)
    return () => window.clearTimeout(timeout)
  }, [notice])

  const contextTransactions = useMemo(
    () => transactions.filter((item) => item.context === context),
    [context, transactions]
  )
  const statusOptions = useMemo(
    () => [...new Set(contextTransactions.map((item) => item.status))],
    [contextTransactions]
  )
  const locationOptions = useMemo(
    () => [...new Set(contextTransactions.map((item) => item.location))],
    [contextTransactions]
  )
  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("es")
    const anchor = new Date("2026-07-22T12:00:00")
    return contextTransactions.filter((item) => {
      const searchable = `${item.number} ${item.partyName} ${item.partyTaxId} ${item.detail}`.toLocaleLowerCase("es")
      const age = Math.floor(
        (anchor.getTime() - new Date(`${item.date}T12:00:00`).getTime()) /
          86_400_000
      )
      const matchesPeriod =
        period === "all" ||
        (period === "year" ? item.date.startsWith("2026") : age <= Number(period))

      return (
        (!normalized || searchable.includes(normalized)) &&
        matchesPeriod &&
        (status === "all" || item.status === status) &&
        (location === "all" || item.location === location) &&
        (includeAnnulled || !/anulad/i.test(item.status))
      )
    })
  }, [contextTransactions, includeAnnulled, location, period, query, status])

  const isPayment = context === "payment"
  const title = isPayment ? "Órdenes de pago" : "Recibos"
  const singular = isPayment ? "orden de pago" : "recibo"
  const partyLabel = isPayment ? "Proveedor" : "Cliente"

  const clearAllFilters = () => {
    setQuery("")
    setPeriod("30")
    setStatus("all")
    setLocation("all")
    setIncludeAnnulled(false)
  }

  const createTransaction = (
    payload: Omit<MoneyTransaction, "id" | "number" | "audit">
  ) => {
    const sequence = contextTransactions.length + (isPayment ? 1285 : 9042)
    const created: MoneyTransaction = {
      ...payload,
      id: `demo-${context}-${Date.now()}`,
      number: `${isPayment ? "OP" : "RC"}-SIM-${String(sequence).padStart(6, "0")}`,
      audit: {
        createdBy: "Sofía Romero",
        createdAt: "22/07/2026 · simulación",
      },
    }
    setTransactions((current) => [created, ...current])
    setCreating(false)
    setSelected(created)
    setNotice(`${isPayment ? "Orden de pago" : "Recibo"} creado como borrador de demostración`)
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <section className="flex min-h-0 flex-1 flex-col bg-background p-3 md:p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">{title}</h2>
              <Badge variant="outline" className="rounded-[4px] font-mono text-[10px]">Datos simulados</Badge>
            </div>
            <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
              {filtered.length} de {contextTransactions.length} {title.toLocaleLowerCase("es")}
            </p>
          </div>
          <Button className="h-10 rounded-[4px] font-mono" onClick={() => setCreating(true)}>
            <Plus /> {isPayment ? "Nueva orden de pago" : "Nuevo recibo"}
          </Button>
        </div>

        <div className="mt-3 grid min-w-0 gap-2 md:flex md:items-center" aria-label={`Búsqueda y filtros de ${title.toLocaleLowerCase("es")}`}>
          <div className="relative min-w-0 flex-1 md:min-w-72">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={`Buscar por número, ${partyLabel.toLocaleLowerCase("es")} o CUIT`}
              aria-label={`Buscar ${title.toLocaleLowerCase("es")} por número, ${partyLabel.toLocaleLowerCase("es")} o CUIT`}
              className="h-9 w-full rounded-[4px] bg-card pl-9"
            />
          </div>

          <div className="grid grid-cols-2 gap-1.5 md:flex md:shrink-0 md:items-center md:justify-end">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="h-9 rounded-[4px]" aria-label="Período">
                <CalendarDays className="text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">Período: 30 d</SelectItem>
                <SelectItem value="90">Período: 90 d</SelectItem>
                <SelectItem value="year">Período: 2026</SelectItem>
                <SelectItem value="all">Período: todo</SelectItem>
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-9 rounded-[4px]" aria-label="Estado"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Estado: todos</SelectItem>
                {statusOptions.map((option) => <SelectItem key={option} value={option}>Estado: {option}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="h-9 rounded-[4px]" aria-label="Empresa o local"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Local: todos</SelectItem>
                {locationOptions.map((option) => <SelectItem key={option} value={option}>Local: {option}</SelectItem>)}
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
            filtered.map((transaction) => (
              <article
                key={transaction.id}
                tabIndex={0}
                role="button"
                className="rounded-[4px] border bg-card p-3 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() => setSelected(transaction)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    setSelected(transaction)
                  }
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-mono text-[10px] text-muted-foreground">
                      {formatDate(transaction.date)} · {transaction.location}
                    </div>
                    <div className="mt-1 font-mono text-xs font-semibold">{transaction.number}</div>
                    <div className="mt-1 truncate text-sm font-medium">{transaction.partyName}</div>
                    <div className="font-mono text-[10px] text-muted-foreground">{transaction.partyTaxId}</div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="font-mono text-[9px] uppercase text-muted-foreground">Total</div>
                    <strong className="font-mono text-sm">{money(transaction.total)}</strong>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3 border-t pt-2">
                  <div className="min-w-0">
                    <TransactionStatus status={transaction.status} />
                    <div className="mt-1 truncate text-[10px] text-muted-foreground">
                      {transaction.detail}
                    </div>
                  </div>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    className="shrink-0"
                    aria-label={`Ver ${singular} ${transaction.number}`}
                    onClick={(event) => {
                      event.stopPropagation()
                      setSelected(transaction)
                    }}
                  >
                    <Eye />
                  </Button>
                </div>
              </article>
            ))
          ) : (
            <div className="grid min-h-48 place-items-center rounded-[4px] border bg-card p-4 text-center">
              <strong>No hay {title.toLocaleLowerCase("es")} para los filtros aplicados</strong>
            </div>
          )}
        </div>
        <div className="hidden min-w-[960px] overflow-hidden rounded-[4px] border bg-card md:block">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-muted/95 backdrop-blur-sm">
              <TableRow className="hover:bg-transparent">
                {[
                  "Fecha",
                  "Número",
                  partyLabel,
                  "Total",
                  "Detalle",
                  "Estado",
                  "Documento relacionado",
                ].map((label) => (
                  <TableHead
                    key={label}
                    className={cn(
                      "h-9 font-mono text-[10px] font-semibold uppercase",
                      label === "Total" && "text-right"
                    )}
                  >
                    {label}
                  </TableHead>
                ))}
                <TableHead className="sticky right-0 h-9 w-20 bg-muted/95 text-right font-mono text-[10px] font-semibold uppercase">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index} className="h-11">
                    {Array.from({ length: 8 }).map((__, cell) => (
                      <TableCell key={cell}><Skeleton className="h-4 w-full max-w-32 rounded-[4px]" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : filtered.length ? (
                filtered.map((transaction) => (
                  <TableRow
                    key={transaction.id}
                    tabIndex={0}
                    className="h-11 cursor-pointer focus-visible:bg-muted focus-visible:outline-none"
                    onClick={() => setSelected(transaction)}
                    onKeyDown={(event) => event.key === "Enter" && setSelected(transaction)}
                  >
                    <TableCell className="font-mono text-xs">{formatDate(transaction.date)}</TableCell>
                    <TableCell className="font-mono text-xs font-semibold">{transaction.number}</TableCell>
                    <TableCell>
                      <div className="max-w-[220px] truncate font-medium">{transaction.partyName}</div>
                      <div className="font-mono text-[10px] text-muted-foreground">{transaction.partyTaxId}</div>
                    </TableCell>
                    <TableCell className="text-right font-mono font-semibold">{money(transaction.total)}</TableCell>
                    <TableCell className="max-w-[220px] truncate text-xs">{transaction.detail}</TableCell>
                    <TableCell><TransactionStatus status={transaction.status} /></TableCell>
                    <TableCell className="max-w-[220px] truncate text-xs text-muted-foreground">{transaction.relatedDocument || "—"}</TableCell>
                    <TableCell className="sticky right-0 bg-card py-1.5 text-right">
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        className="rounded-[4px]"
                        aria-label={`Ver ${singular} ${transaction.number}`}
                        onClick={(event) => {
                          event.stopPropagation()
                          setSelected(transaction)
                        }}
                      >
                        <Eye />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-56 text-center">
                    <div className="mx-auto grid max-w-sm justify-items-center gap-2">
                      {contextTransactions.length ? <Filter className="size-6 text-muted-foreground" /> : isPayment ? <HandCoins className="size-6 text-muted-foreground" /> : <ReceiptText className="size-6 text-muted-foreground" />}
                      <strong>{contextTransactions.length ? `No hay ${title.toLocaleLowerCase("es")} para los filtros aplicados` : `Todavía no hay ${title.toLocaleLowerCase("es")}`}</strong>
                      <span className="text-xs text-muted-foreground">
                        {contextTransactions.length ? "Cambiá o limpiá los filtros para recuperar resultados." : `Creá el primer ${singular} desde la acción principal.`}
                      </span>
                      {contextTransactions.length ? (
                        <Button size="sm" variant="outline" className="rounded-[4px]" onClick={clearAllFilters}><RotateCcw /> Limpiar filtros</Button>
                      ) : (
                        <Button size="sm" className="rounded-[4px]" onClick={() => setCreating(true)}><Plus /> {isPayment ? "Nueva orden de pago" : "Nuevo recibo"}</Button>
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

      <TransactionDetailSheet
        transaction={selected}
        onClose={() => setSelected(null)}
        onFeedback={setNotice}
      />

      {creating ? (
        <TransactionFormSheet
          context={context}
          parties={parties}
          onClose={() => setCreating(false)}
          onCreate={createTransaction}
        />
      ) : null}

      {notice ? (
        <div role="status" className="fixed right-4 bottom-4 z-[80] flex max-w-sm items-center gap-2 rounded-[4px] border bg-popover px-3 py-2 text-xs shadow-xl">
          <Check className="size-4 text-emerald-600" /> {notice}
        </div>
      ) : null}
    </div>
  )
}
