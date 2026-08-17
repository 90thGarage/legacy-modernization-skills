"use client"

import { useEffect, useMemo, useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import {
  ArrowLeft,
  CalendarIcon,
  Check,
  ChevronRight,
  Download,
  FileSearch,
  Printer,
  Search,
  SlidersHorizontal,
  WalletCards,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
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
import type { Customer, CustomerAccountStatement } from "../types"

type AppliedQuery = {
  customerId: string
  consolidated: boolean
  fromDate: string
  toDate: string
  currency: string
  includeDeliveryNotes: boolean
}

function formatMoney(value: number, currency = "ARS") {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(value)
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-AR").format(
    new Date(`${value}T12:00:00`)
  )
}

function normalizeSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es")
}

function parseDateValue(value: string) {
  const [year, month, day] = value.split("-").map(Number)
  if (!year || !month || !day) return undefined

  const date = new Date(year, month - 1, day)
  return Number.isNaN(date.getTime()) ? undefined : date
}

function toDateValue(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function DatePickerField({
  label,
  value,
  onChange,
}: {
  label: "Desde" | "Hasta"
  value: string
  onChange: (value: string) => void
}) {
  const [open, setOpen] = useState(false)
  const selectedDate = parseDateValue(value)

  return (
    <div className="grid gap-1.5">
      <span className="font-mono text-[11px] font-semibold">{label}</span>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            aria-label={`${label}: ${selectedDate ? format(selectedDate, "dd/MM/yyyy") : "sin fecha"}`}
            className="h-10 w-full justify-between rounded-[4px] px-3 font-mono text-xs font-normal"
          >
            {selectedDate
              ? format(selectedDate, "dd/MM/yyyy")
              : "Seleccionar fecha"}
            <CalendarIcon className="size-4 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align={label === "Desde" ? "start" : "end"}
          className="w-auto rounded-[4px] p-0"
        >
          <Calendar
            mode="single"
            selected={selectedDate}
            defaultMonth={selectedDate}
            locale={es}
            autoFocus
            onSelect={(date) => {
              if (!date) return
              onChange(toDateValue(date))
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

function getLastMovement(statement?: CustomerAccountStatement) {
  if (!statement) return null
  return statement.currencyGroups
    .flatMap((group) => group.movements)
    .sort((left, right) => right.date.localeCompare(left.date))[0] ?? null
}

export function CustomerAccountStatementWorkspace({
  customers,
  statements,
  initialCustomerId,
}: {
  customers: Customer[]
  statements: CustomerAccountStatement[]
  initialCustomerId: string
}) {
  const [accountSearch, setAccountSearch] = useState("")
  const [selectedCustomerId, setSelectedCustomerId] = useState(initialCustomerId)
  const [consolidated, setConsolidated] = useState(true)
  const [fromDate, setFromDate] = useState("2026-06-22")
  const [toDate, setToDate] = useState("2026-07-22")
  const [currency, setCurrency] = useState("all")
  const [includeDeliveryNotes, setIncludeDeliveryNotes] = useState(false)
  const [appliedQuery, setAppliedQuery] = useState<AppliedQuery | null>(null)
  const [conceptQuery, setConceptQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [notice, setNotice] = useState("")

  useEffect(() => {
    if (!notice) return
    const timeout = window.setTimeout(() => setNotice(""), 3200)
    return () => window.clearTimeout(timeout)
  }, [notice])

  const accounts = useMemo(() => {
    const normalized = normalizeSearch(accountSearch.trim())
    return customers
      .filter((customer) => customer.saleCondition === "Cuenta corriente")
      .filter((customer) =>
        normalized
          ? normalizeSearch(
              `${customer.code} ${customer.name} ${customer.document}`
            ).includes(normalized)
          : true
      )
  }, [accountSearch, customers])

  const selectedCustomer = customers.find(
    (customer) => customer.id === selectedCustomerId
  )
  const queriedCustomer = customers.find(
    (customer) => customer.id === appliedQuery?.customerId
  )
  const statement = statements.find(
    (item) => item.customerId === appliedQuery?.customerId
  )
  const invalidPeriod = Boolean(fromDate && toDate && fromDate > toDate)
  const canGenerate = Boolean(
    selectedCustomerId && fromDate && toDate && !invalidPeriod
  )

  const visibleGroups = useMemo(() => {
    if (!statement) return []
    const normalized = normalizeSearch(conceptQuery.trim())
    return statement.currencyGroups
      .map((group) => ({
        ...group,
        movements: normalized
          ? group.movements.filter((movement) =>
              normalizeSearch(`${movement.concept} ${movement.number}`).includes(
                normalized
              )
            )
          : group.movements,
      }))
      .filter((group) => group.movements.length > 0)
  }, [conceptQuery, statement])

  const visibleMovementCount = visibleGroups.reduce(
    (total, group) => total + group.movements.length,
    0
  )

  const openReportDrawer = (customerId: string) => {
    setSelectedCustomerId(customerId)
  }

  const generateReport = () => {
    if (!canGenerate) return
    const query: AppliedQuery = {
      customerId: selectedCustomerId,
      consolidated,
      fromDate,
      toDate,
      currency,
      includeDeliveryNotes,
    }
    setAppliedQuery(query)
    setConceptQuery("")
    setSelectedCustomerId("")
    setLoading(true)
    window.setTimeout(() => setLoading(false), 320)
  }

  return (
    <main className="flex h-full min-h-0 flex-col bg-background p-3 md:p-4">
      <section className="flex min-h-0 flex-1 flex-col overflow-hidden bg-background">
        {appliedQuery ? (
          <ReportSurface
            customer={queriedCustomer}
            query={appliedQuery}
            statement={statement}
            loading={loading}
            conceptQuery={conceptQuery}
            onConceptQueryChange={setConceptQuery}
            visibleGroups={visibleGroups}
            visibleMovementCount={visibleMovementCount}
            onBack={() => {
              setAppliedQuery(null)
              setConceptQuery("")
            }}
            onChangeCriteria={() =>
              setSelectedCustomerId(appliedQuery.customerId)
            }
            onNotice={setNotice}
          />
        ) : (
          <AccountsList
            accounts={accounts}
            allAccountCount={customers.filter(
              (customer) => customer.saleCondition === "Cuenta corriente"
            ).length}
            search={accountSearch}
            onSearchChange={setAccountSearch}
            statements={statements}
            onSelect={openReportDrawer}
          />
        )}
      </section>

      <ReportCriteriaDrawer
        customer={selectedCustomer}
        statement={statements.find(
          (item) => item.customerId === selectedCustomerId
        )}
        open={Boolean(selectedCustomerId)}
        onOpenChange={(open) => {
          if (!open) setSelectedCustomerId("")
        }}
        consolidated={consolidated}
        onConsolidatedChange={setConsolidated}
        fromDate={fromDate}
        onFromDateChange={setFromDate}
        toDate={toDate}
        onToDateChange={setToDate}
        currency={currency}
        onCurrencyChange={setCurrency}
        includeDeliveryNotes={includeDeliveryNotes}
        onIncludeDeliveryNotesChange={setIncludeDeliveryNotes}
        invalidPeriod={invalidPeriod}
        canGenerate={canGenerate}
        loading={loading}
        onGenerate={generateReport}
      />

      {notice ? (
        <div
          role="status"
          className="fixed right-4 bottom-4 z-[80] flex max-w-sm items-center gap-2 rounded-[4px] border bg-popover px-3 py-2 text-xs shadow-xl"
        >
          <Check className="size-4 text-emerald-600" /> {notice}
        </div>
      ) : null}
    </main>
  )
}

function AccountsList({
  accounts,
  allAccountCount,
  search,
  onSearchChange,
  statements,
  onSelect,
}: {
  accounts: Customer[]
  allAccountCount: number
  search: string
  onSearchChange: (value: string) => void
  statements: CustomerAccountStatement[]
  onSelect: (customerId: string) => void
}) {
  return (
    <>
      <div className="flex shrink-0 flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <WalletCards className="size-5 text-primary" />
            <h2 className="text-lg font-semibold">Cuenta corriente de clientes</h2>
            <Badge
              variant="outline"
              className="rounded-[4px] font-mono text-[10px]"
            >
              Datos simulados
            </Badge>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Seleccioná un cliente para generar su estado de cuenta.
          </p>
        </div>
        <span className="font-mono text-[11px] text-muted-foreground">
          {allAccountCount} {allAccountCount === 1 ? "cuenta" : "cuentas"}
        </span>
      </div>

      <div className="relative mt-3 shrink-0">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Buscar por código, cliente o CUIT"
          aria-label="Buscar cuentas corrientes"
          className="h-10 w-full rounded-[4px] bg-card pl-9"
        />
      </div>

      <div className="mt-2 min-h-0 flex-1 overflow-auto rounded-[4px] border bg-card">
        {accounts.length ? (
          <>
          <div className="grid gap-2 p-2 md:hidden">
            {accounts.map((customer) => {
              const statement = statements.find(
                (item) => item.customerId === customer.id
              )
              const lastMovement = getLastMovement(statement)
              return (
                <article
                  key={customer.id}
                  tabIndex={0}
                  role="button"
                  className="rounded-[4px] border bg-background p-3 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={() => onSelect(customer.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault()
                      onSelect(customer.id)
                    }
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-mono text-[10px] text-muted-foreground">
                        {customer.code} · {customer.document || "Sin identificación"}
                      </div>
                      <strong className="mt-1 block truncate text-sm">{customer.name}</strong>
                      <span className="text-[11px] text-muted-foreground">{customer.vatCategory}</span>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="font-mono text-[9px] uppercase text-muted-foreground">Saldo</div>
                      <strong className="font-mono text-sm">
                        {statement
                          ? formatMoney(statement.pesifiedBalance, statement.presentationCurrency)
                          : "Sin datos"}
                      </strong>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t pt-2">
                    <span className="text-[10px] text-muted-foreground">
                      {statement?.movementCount ?? 0} movimientos · {lastMovement ? formatDate(lastMovement.date) : "sin movimientos"}
                    </span>
                    <ChevronRight className="size-4 text-primary" />
                  </div>
                </article>
              )
            })}
          </div>
          <div className="hidden md:block">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-muted/95 backdrop-blur-sm">
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-10 w-[100px] font-mono text-[10px] font-semibold uppercase">
                  Código
                </TableHead>
                <TableHead className="h-10 min-w-[230px] font-mono text-[10px] font-semibold uppercase">
                  Cliente
                </TableHead>
                <TableHead className="h-10 w-[170px] font-mono text-[10px] font-semibold uppercase">
                  CUIT / CUIL
                </TableHead>
                <TableHead className="hidden h-10 w-[150px] font-mono text-[10px] font-semibold uppercase lg:table-cell">
                  Último movimiento
                </TableHead>
                <TableHead className="h-10 w-[100px] text-right font-mono text-[10px] font-semibold uppercase">
                  Movimientos
                </TableHead>
                <TableHead className="h-10 w-[170px] text-right font-mono text-[10px] font-semibold uppercase">
                  Saldo pesificado
                </TableHead>
                <TableHead className="h-10 w-[120px] font-mono text-[10px] font-semibold uppercase">
                  Estado
                </TableHead>
                <TableHead className="h-10 w-[150px] text-right font-mono text-[10px] font-semibold uppercase">
                  Acción
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((customer) => {
                const statement = statements.find(
                  (item) => item.customerId === customer.id
                )
                const lastMovement = getLastMovement(statement)
                return (
                  <TableRow
                    key={customer.id}
                    tabIndex={0}
                    className="h-14 cursor-pointer focus-visible:bg-muted focus-visible:outline-none"
                    onClick={() => onSelect(customer.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault()
                        onSelect(customer.id)
                      }
                    }}
                  >
                    <TableCell className="font-mono text-xs">
                      {customer.code}
                    </TableCell>
                    <TableCell>
                      <strong className="block text-sm">{customer.name}</strong>
                      <span className="text-[11px] text-muted-foreground">
                        {customer.vatCategory}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {customer.document || "—"}
                    </TableCell>
                    <TableCell className="hidden font-mono text-xs lg:table-cell">
                      {lastMovement ? formatDate(lastMovement.date) : "Sin movimientos"}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs">
                      {statement?.movementCount ?? "—"}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm font-semibold">
                      {statement
                        ? formatMoney(
                            statement.pesifiedBalance,
                            statement.presentationCurrency
                          )
                        : "Sin datos"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="rounded-[4px] font-mono text-[10px]"
                      >
                        {customer.active ? "Habilitado" : "Deshabilitado"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-[4px] font-mono text-xs"
                        onClick={(event) => {
                          event.stopPropagation()
                          onSelect(customer.id)
                        }}
                      >
                        Generar reporte <ChevronRight />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          </div>
          </>
        ) : (
          <div className="grid h-full min-h-72 place-items-center px-4 text-center">
            <div className="max-w-md">
              <Search className="mx-auto mb-2 size-6 text-muted-foreground" />
              <strong>
                {allAccountCount
                  ? "No hay cuentas que coincidan con la búsqueda"
                  : "No hay clientes con cuenta corriente configurada"}
              </strong>
              <p className="mt-1 text-xs text-muted-foreground">
                {allAccountCount
                  ? "Probá con otro código, nombre o identificación fiscal."
                  : "Las cuentas aparecerán cuando un cliente tenga esta condición comercial."}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

function ReportCriteriaDrawer({
  customer,
  statement,
  open,
  onOpenChange,
  consolidated,
  onConsolidatedChange,
  fromDate,
  onFromDateChange,
  toDate,
  onToDateChange,
  currency,
  onCurrencyChange,
  includeDeliveryNotes,
  onIncludeDeliveryNotesChange,
  invalidPeriod,
  canGenerate,
  loading,
  onGenerate,
}: {
  customer?: Customer
  statement?: CustomerAccountStatement
  open: boolean
  onOpenChange: (open: boolean) => void
  consolidated: boolean
  onConsolidatedChange: (value: boolean) => void
  fromDate: string
  onFromDateChange: (value: string) => void
  toDate: string
  onToDateChange: (value: string) => void
  currency: string
  onCurrencyChange: (value: string) => void
  includeDeliveryNotes: boolean
  onIncludeDeliveryNotesChange: (value: boolean) => void
  invalidPeriod: boolean
  canGenerate: boolean
  loading: boolean
  onGenerate: () => void
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[min(94vw,480px)] gap-0 p-0 sm:max-w-none">
        <SheetHeader className="shrink-0 border-b px-5 py-4 pr-14">
          <SheetTitle className="text-lg">
            Generar reporte de cuenta corriente
          </SheetTitle>
          <SheetDescription className="sr-only">
            Configurá los criterios del reporte para el cliente seleccionado.
          </SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          <div className="rounded-[4px] border bg-muted/25 p-3">
            <strong className="block text-sm">
              {customer?.name || "Cliente no disponible"}
            </strong>
            <span className="font-mono text-[10px] text-muted-foreground">
              {customer?.code || "—"} · {customer?.document || "Sin identificación fiscal"}
            </span>
            {statement ? (
              <div className="mt-3 flex items-end justify-between gap-3 border-t pt-3">
                <span className="text-xs text-muted-foreground">
                  Saldo pesificado actual
                </span>
                <strong className="font-mono text-base">
                  {formatMoney(
                    statement.pesifiedBalance,
                    statement.presentationCurrency
                  )}
                </strong>
              </div>
            ) : null}
          </div>

          <div className="mt-5 grid gap-4">
            <label className="flex h-10 items-center justify-between gap-3 rounded-[4px] border px-3">
              <span className="text-sm font-medium">Consolidado</span>
              <Checkbox
                checked={consolidated}
                aria-label="Consolidado"
                onCheckedChange={(checked) =>
                  onConsolidatedChange(Boolean(checked))
                }
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <DatePickerField
                label="Desde"
                value={fromDate}
                onChange={onFromDateChange}
              />
              <DatePickerField
                label="Hasta"
                value={toDate}
                onChange={onToDateChange}
              />
            </div>
            {invalidPeriod ? (
              <p className="text-xs text-destructive">
                La fecha desde no puede ser posterior a la fecha hasta.
              </p>
            ) : null}

            <label className="grid gap-1.5" htmlFor="account-currency">
              <span className="font-mono text-[11px] font-semibold">Moneda</span>
              <Select value={currency} onValueChange={onCurrencyChange}>
                <SelectTrigger
                  id="account-currency"
                  className="h-10 w-full rounded-[4px]"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las monedas</SelectItem>
                  <SelectItem value="ARS">Peso argentino</SelectItem>
                </SelectContent>
              </Select>
            </label>

            <label className="flex h-10 items-center justify-between gap-3 rounded-[4px] border px-3">
              <span className="text-sm font-medium">Remitos</span>
              <Checkbox
                checked={includeDeliveryNotes}
                aria-label="Remitos"
                onCheckedChange={(checked) =>
                  onIncludeDeliveryNotesChange(Boolean(checked))
                }
              />
            </label>
          </div>

        </div>

        <SheetFooter className="shrink-0 flex-row justify-end border-t bg-card px-5 py-3">
          <Button
            variant="outline"
            className="rounded-[4px]"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            className="rounded-[4px] font-mono"
            disabled={!canGenerate || loading}
            onClick={onGenerate}
          >
            <FileSearch /> {loading ? "Generando..." : "Generar reporte"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

function ReportSurface({
  customer,
  query,
  statement,
  loading,
  conceptQuery,
  onConceptQueryChange,
  visibleGroups,
  visibleMovementCount,
  onBack,
  onChangeCriteria,
  onNotice,
}: {
  customer?: Customer
  query: AppliedQuery
  statement?: CustomerAccountStatement
  loading: boolean
  conceptQuery: string
  onConceptQueryChange: (value: string) => void
  visibleGroups: CustomerAccountStatement["currencyGroups"]
  visibleMovementCount: number
  onBack: () => void
  onChangeCriteria: () => void
  onNotice: (value: string) => void
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 mb-1 rounded-[4px] text-muted-foreground"
            onClick={onBack}
          >
            <ArrowLeft /> Volver a cuentas corrientes
          </Button>
          <div className="flex items-center gap-2">
            <WalletCards className="size-5 text-primary" />
            <h2 className="truncate text-lg font-semibold">
              {customer?.name || "Estado de cuenta"}
            </h2>
          </div>
          <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
            {customer?.document || "Sin identificación fiscal"} · {formatDate(query.fromDate)}—{formatDate(query.toDate)} · {statement?.movementCount ?? 0} movimientos
          </p>
        </div>
        <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
          <div className="mr-2 text-right">
            <div className="font-mono text-[10px] font-semibold uppercase text-muted-foreground">
              Saldo total pesificado
            </div>
            <strong className="font-mono text-lg">
              {formatMoney(statement?.pesifiedBalance ?? 0)}
            </strong>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-[4px]"
            onClick={onChangeCriteria}
          >
            <SlidersHorizontal /> Cambiar criterios
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-[4px]"
            disabled={!statement}
            onClick={() =>
              onNotice("Impresión simulada preparada para el reporte consultado")
            }
          >
            <Printer /> Imprimir
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-[4px]"
            disabled={!statement}
            onClick={() =>
              onNotice("Exportación simulada preparada con los criterios del reporte")
            }
          >
            <Download /> Exportar
          </Button>
        </div>
      </div>

      <div className="mt-3 flex min-h-0 flex-1 flex-col overflow-hidden rounded-[4px] border bg-card">
        {loading ? (
          <div className="grid min-h-0 flex-1 grid-rows-[auto_1fr]">
            <div className="p-3">
              <Skeleton className="h-9 w-full rounded-[4px]" />
            </div>
            <div className="grid content-start gap-2 p-3 pt-0">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-10 w-full rounded-[4px]"
                />
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="shrink-0 p-3 pb-2">
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={conceptQuery}
                  onChange={(event) => onConceptQueryChange(event.target.value)}
                  placeholder="Filtrar movimientos por concepto"
                  aria-label="Filtrar movimientos por concepto"
                  className="h-9 w-full rounded-[4px] pl-9"
                />
              </div>
              <div className="mt-1 text-right font-mono text-[10px] text-muted-foreground">
                {visibleMovementCount} de {statement?.movementCount ?? 0} movimientos
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-auto px-3">
              {statement?.currencyGroups.length ? (
                visibleGroups.length ? (
                  <div className="overflow-hidden rounded-[4px] border">
                    <Table className="min-w-[960px]">
                      <TableHeader className="sticky top-0 z-10 bg-muted/95 backdrop-blur-sm">
                        <TableRow className="hover:bg-transparent">
                          {[
                            "Pago",
                            "Empresa",
                            "Fecha",
                            "Concepto",
                            "Número",
                            "Días",
                            "Debe",
                            "Haber",
                            "Saldo acumulado",
                          ].map((label) => (
                            <TableHead
                              key={label}
                              className={`h-9 font-mono text-[10px] font-semibold uppercase ${[
                                "Días",
                                "Debe",
                                "Haber",
                                "Saldo acumulado",
                              ].includes(label) ? "text-right" : ""}`}
                            >
                              {label}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {visibleGroups.map((group) => (
                          <AccountGroupRows
                            key={group.currencyCode}
                            group={group}
                            onOpenRelated={(number) =>
                              onNotice(
                                `Detalle relacionado ${number}: navegación simulada; el reporte permanece intacto`
                              )
                            }
                          />
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="grid h-48 place-items-center text-center text-sm text-muted-foreground">
                    <div>
                      <Search className="mx-auto mb-2 size-5" />
                      No hay movimientos que coincidan con el concepto.
                    </div>
                  </div>
                )
              ) : (
                <div className="grid h-56 place-items-center px-4 text-center">
                  <div className="max-w-md">
                    <WalletCards className="mx-auto mb-2 size-6 text-muted-foreground" />
                    <strong>
                      No hay movimientos para el cliente y período seleccionados
                    </strong>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Podés cambiar los criterios y volver a generar el reporte.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex shrink-0 items-center justify-end gap-3 border-t px-3 py-2.5">
              <span className="text-xs text-muted-foreground">
                Saldo total pesificado
              </span>
              <strong className="font-mono text-base">
                {formatMoney(statement?.pesifiedBalance ?? 0)}
              </strong>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function AccountGroupRows({
  group,
  onOpenRelated,
}: {
  group: CustomerAccountStatement["currencyGroups"][number]
  onOpenRelated: (number: string) => void
}) {
  return (
    <>
      <TableRow className="bg-muted/45 hover:bg-muted/45">
        <TableCell colSpan={9} className="h-8 py-1.5 font-semibold">
          {group.currencyLabel}
          <span className="ml-2 font-mono text-[10px] text-muted-foreground">
            {group.currencyCode}
          </span>
        </TableCell>
      </TableRow>
      {group.movements.map((movement) => (
        <TableRow key={movement.id} className="h-10">
          <TableCell className="font-mono text-xs text-muted-foreground">
            {movement.paymentIndicator}
          </TableCell>
          <TableCell className="max-w-[150px] truncate text-xs">
            {movement.companyLabel}
          </TableCell>
          <TableCell className="font-mono text-xs">
            {formatDate(movement.date)}
          </TableCell>
          <TableCell className="min-w-[210px] text-xs">
            {movement.concept}
            {movement.technicalCode ? (
              <span className="ml-1 font-mono text-[10px] text-muted-foreground">
                {movement.technicalCode}
              </span>
            ) : null}
          </TableCell>
          <TableCell className="font-mono text-xs">
            {movement.sourceId ? (
              <button
                type="button"
                className="font-semibold text-primary underline-offset-4 hover:underline"
                onClick={() => onOpenRelated(movement.number)}
              >
                {movement.number}
              </button>
            ) : (
              movement.number
            )}
          </TableCell>
          <TableCell className="text-right font-mono text-xs">
            {movement.days ?? "—"}
          </TableCell>
          <TableCell className="text-right font-mono text-xs">
            {formatMoney(movement.debit, group.currencyCode)}
          </TableCell>
          <TableCell className="text-right font-mono text-xs">
            {formatMoney(movement.credit, group.currencyCode)}
          </TableCell>
          <TableCell className="text-right font-mono text-xs font-semibold">
            {formatMoney(movement.runningBalance, group.currencyCode)}
          </TableCell>
        </TableRow>
      ))}
      <TableRow className="bg-muted/20 hover:bg-muted/20">
        <TableCell
          colSpan={6}
          className="text-right text-xs text-muted-foreground"
        >
          Total {group.currencyLabel}:
        </TableCell>
        <TableCell className="text-right font-mono text-xs font-semibold">
          {formatMoney(group.debitTotal, group.currencyCode)}
        </TableCell>
        <TableCell className="text-right font-mono text-xs font-semibold">
          {formatMoney(group.creditTotal, group.currencyCode)}
        </TableCell>
        <TableCell className="text-right font-mono text-xs font-semibold">
          {formatMoney(group.runningBalanceTotal, group.currencyCode)}
        </TableCell>
      </TableRow>
    </>
  )
}
