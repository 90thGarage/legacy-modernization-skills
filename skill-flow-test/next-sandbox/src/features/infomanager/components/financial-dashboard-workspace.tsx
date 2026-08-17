"use client"

import { useMemo, useState } from "react"
import {
  ArrowRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Download,
  RefreshCw,
  TriangleAlert,
} from "lucide-react"
import {
  Area,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Checkbox } from "@/components/ui/checkbox"
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
import { cn } from "@/lib/utils"
import {
  dashboardBusinessUnits,
  dashboardCompanies,
  dashboardSnapshot,
} from "../dashboard-mock-data"
import type {
  AgingBucket,
  AvailabilityAccount,
  DashboardMetric,
  DashboardSnapshot,
  FinancialTimingStatus,
  PartyBalance,
  ViewId,
} from "../types"

const currency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
})

const compactCurrency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  notation: "compact",
  maximumFractionDigits: 1,
})

const resultChartConfig = {
  income: { label: "Ingresos", color: "#16a34a" },
  expense: { label: "Egresos", color: "#64748b" },
  result: { label: "Resultado", color: "#0057ff" },
} satisfies ChartConfig

const agingChartConfig = {
  amount: { label: "Monto", color: "#0057ff" },
} satisfies ChartConfig

const statusLabels: Record<FinancialTimingStatus, string> = {
  current: "Al día",
  "due-soon": "Vence pronto",
  overdue: "1–30 días",
  critical: "+30 días",
}

const statusColors: Record<FinancialTimingStatus, string> = {
  current: "#16a34a",
  "due-soon": "#e17b00",
  overdue: "#dc2626",
  critical: "#991b1b",
}

const periodLabels = {
  "30": "Últimos 30 días",
  "90": "Últimos 90 días",
  "365": "Últimos 12 meses",
} as const

type PeriodKey = keyof typeof periodLabels

type DetailSelection =
  | { kind: "party"; party: PartyBalance }
  | { kind: "aging"; bucket: AgingBucket; direction: "receivable" | "payable" }
  | { kind: "account"; account: AvailabilityAccount }
  | { kind: "result" }
  | { kind: "metric"; metric: DashboardMetric }

function formatDate(value: string | null) {
  if (!value) return "Sin fecha"
  return new Intl.DateTimeFormat("es-AR").format(new Date(`${value}T12:00:00`))
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value))
}

function scaleSnapshot(snapshot: DashboardSnapshot, factor: number, companyIds: string[]) {
  const scale = (value: number) => Math.round(value * factor)
  const paraguayOnly = companyIds.length === 1 && companyIds[0] === "company-6"
  const cuyoOnly = companyIds.length === 1 && companyIds[0] === "company-5"

  return {
    ...snapshot,
    metrics: snapshot.metrics.map((metric) => ({ ...metric, value: scale(metric.value) })),
    customerBalances: snapshot.customerBalances.map((party) => ({
      ...party,
      balance: scale(party.balance),
      overdueAmount: scale(party.overdueAmount),
    })),
    supplierBalances: paraguayOnly
      ? []
      : snapshot.supplierBalances.map((party) => ({
          ...party,
          balance: scale(party.balance),
          overdueAmount: scale(party.overdueAmount),
        })),
    receivableAging: snapshot.receivableAging.map((bucket) => ({
      ...bucket,
      amount: scale(bucket.amount),
    })),
    payableAging: snapshot.payableAging.map((bucket) => ({
      ...bucket,
      amount: scale(bucket.amount),
    })),
    availabilityAccounts: snapshot.availabilityAccounts.map((account, index) => ({
      ...account,
      balance: scale(account.balance),
      committedNext7Days: scale(account.committedNext7Days),
      status: cuyoOnly && index === 0 ? ("error" as const) : account.status,
    })),
    resultSeries: snapshot.resultSeries.map((point) => ({
      ...point,
      income: scale(point.income),
      expense: scale(point.expense),
      result: scale(point.result),
    })),
    freshness: snapshot.freshness.map((source) =>
      cuyoOnly && source.source === "availability"
        ? {
            ...source,
            status: "error" as const,
            message: "Disponibilidades sin actualizar para Cuyo.",
          }
        : source
    ),
  }
}

function ModuleTitle({
  title,
  subtitle,
  total,
}: {
  title: string
  subtitle: string
  total?: number
}) {
  return (
    <div className="flex min-w-0 items-start justify-between gap-3 border-b px-3.5 py-3">
      <div className="min-w-0">
        <h2 className="truncate text-sm font-semibold">{title}</h2>
        <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{subtitle}</p>
      </div>
      {total != null ? (
        <p className="shrink-0 font-mono text-base font-semibold tabular-nums">
          {compactCurrency.format(total)}
        </p>
      ) : null}
    </div>
  )
}

function PartyBalanceCard({
  title,
  subtitle,
  rows,
  emptyLabel,
  onSelect,
}: {
  title: string
  subtitle: string
  rows: PartyBalance[]
  emptyLabel: string
  onSelect: (party: PartyBalance) => void
}) {
  const topRows = rows.slice(0, 5)
  const total = rows.reduce((sum, row) => sum + row.balance, 0)
  const max = Math.max(...topRows.map((row) => row.balance), 1)

  return (
    <Card className="min-h-[18rem] min-w-0 overflow-hidden rounded-[4px] py-0 xl:min-h-0">
      <ModuleTitle title={title} subtitle={subtitle} total={total} />
      <CardContent className="flex min-h-0 flex-1 flex-col gap-2.5 p-3.5">
        {topRows.length ? (
          topRows.map((row) => (
            <button
              key={row.id}
              type="button"
              className="group grid min-h-0 flex-1 content-center gap-1 text-left"
              onClick={() => onSelect(row)}
            >
              <span className="flex min-w-0 items-center justify-between gap-2 text-[11px]">
                <span className="truncate font-medium group-hover:text-primary">{row.name}</span>
                <span className="shrink-0 font-mono tabular-nums">{compactCurrency.format(row.balance)}</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2 flex-1 overflow-hidden rounded-[2px] bg-muted">
                  <span
                    className="block h-full rounded-[2px]"
                    style={{
                      width: `${Math.max((row.balance / max) * 100, 5)}%`,
                      backgroundColor: statusColors[row.status],
                    }}
                  />
                </span>
                <span className="w-[4.75rem] truncate text-right font-mono text-[9px] text-muted-foreground">
                  {statusLabels[row.status]}
                </span>
              </span>
            </button>
          ))
        ) : (
          <div className="grid flex-1 place-items-center text-center text-xs text-muted-foreground">
            {emptyLabel}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ResultCard({
  series,
  onOpen,
}: {
  series: DashboardSnapshot["resultSeries"]
  onOpen: () => void
}) {
  const last = series.at(-1)

  return (
    <Card className="min-h-[18rem] min-w-0 overflow-hidden rounded-[4px] py-0 xl:col-span-2 xl:min-h-0">
      <div className="flex items-start justify-between gap-3 border-b px-3.5 py-3">
        <div>
          <h2 className="text-sm font-semibold">Resultado · ingresos vs. egresos</h2>
          <p className="mt-0.5 text-[11px] text-muted-foreground">Evolución mensual del alcance seleccionado</p>
        </div>
        <Button variant="ghost" size="xs" className="rounded-[4px] text-[10px]" onClick={onOpen}>
          Detalle <ArrowRight />
        </Button>
      </div>
      <CardContent className="flex min-h-0 flex-1 flex-col p-0">
        {last ? (
          <div className="grid shrink-0 grid-cols-3 divide-x border-b bg-muted/25 px-1 py-2">
            {([
              ["Ingresos", last.income, "text-emerald-700 dark:text-emerald-400"],
              ["Egresos", last.expense, "text-slate-600 dark:text-slate-300"],
              ["Resultado", last.result, "text-primary"],
            ] as const).map(([label, value, color]) => (
              <div key={label} className="px-3">
                <p className="font-mono text-[9px] uppercase text-muted-foreground">{label}</p>
                <p className={cn("mt-0.5 font-mono text-sm font-semibold tabular-nums", color)}>
                  {compactCurrency.format(value)}
                </p>
              </div>
            ))}
          </div>
        ) : null}
        <ChartContainer config={resultChartConfig} className="min-h-[12rem] w-full flex-1 aspect-auto px-1 pt-2">
          <ComposedChart accessibilityLayer data={series} margin={{ top: 8, right: 14, bottom: 4, left: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={7}
              minTickGap={24}
              tickFormatter={(value) =>
                new Intl.DateTimeFormat("es-AR", { month: "short" }).format(new Date(`${value}T12:00:00`))
              }
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={46}
              tickFormatter={(value) => `${Math.round(Number(value) / 1_000_000)} M`}
            />
            <ReferenceLine y={0} stroke="var(--border)" />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(_, payload) => {
                    const date = payload?.[0]?.payload?.date
                    return date
                      ? new Intl.DateTimeFormat("es-AR", { month: "long", year: "numeric" }).format(new Date(`${date}T12:00:00`))
                      : "Período"
                  }}
                  formatter={(value, name) => (
                    <div className="flex min-w-40 justify-between gap-4">
                      <span className="text-muted-foreground">
                        {resultChartConfig[String(name) as keyof typeof resultChartConfig]?.label ?? String(name)}
                      </span>
                      <span className="font-mono font-semibold">{currency.format(Number(value))}</span>
                    </div>
                  )}
                />
              }
            />
            <Area dataKey="income" type="monotone" fill="var(--color-income)" fillOpacity={0.13} stroke="var(--color-income)" strokeWidth={1.5} />
            <Area dataKey="expense" type="monotone" fill="var(--color-expense)" fillOpacity={0.09} stroke="var(--color-expense)" strokeWidth={1.5} />
            <Line dataKey="result" type="monotone" stroke="var(--color-result)" strokeWidth={2.5} dot={false} />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

function AgingDonutCard({
  title,
  subtitle,
  buckets,
  direction,
  onSelect,
}: {
  title: string
  subtitle: string
  buckets: AgingBucket[]
  direction: "receivable" | "payable"
  onSelect: (bucket: AgingBucket) => void
}) {
  const total = buckets.reduce((sum, bucket) => sum + bucket.amount, 0)
  const overdue = buckets
    .filter((bucket) => bucket.status === "overdue" || bucket.status === "critical")
    .reduce((sum, bucket) => sum + bucket.amount, 0)

  return (
    <Card className="min-h-[18rem] min-w-0 overflow-hidden rounded-[4px] py-0 xl:min-h-0">
      <ModuleTitle title={title} subtitle={subtitle} />
      <CardContent className="flex min-h-0 flex-1 flex-col p-3">
        <div className="relative min-h-[10rem] flex-1">
          <ChartContainer config={agingChartConfig} className="h-full w-full aspect-auto">
            <PieChart accessibilityLayer>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(value, _name, item) => (
                      <div className="grid min-w-40 gap-1">
                        <span className="font-medium">{item.payload.label}</span>
                        <span className="flex justify-between gap-4 text-muted-foreground">
                          <span>Monto</span>
                          <span className="font-mono text-foreground">{currency.format(Number(value))}</span>
                        </span>
                        <span className="flex justify-between gap-4 text-muted-foreground">
                          <span>Participación</span>
                          <span className="font-mono text-foreground">{Number(item.payload.percentage).toFixed(1)}%</span>
                        </span>
                      </div>
                    )}
                  />
                }
              />
              <Pie
                data={buckets}
                dataKey="amount"
                nameKey="label"
                innerRadius="58%"
                outerRadius="86%"
                paddingAngle={2}
                strokeWidth={0}
                onClick={(entry) => onSelect(entry.payload as AgingBucket)}
              >
                {buckets.map((bucket) => (
                  <Cell key={bucket.id} fill={statusColors[bucket.status]} className="cursor-pointer" />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
          <div className="pointer-events-none absolute inset-0 grid place-content-center text-center">
            <p className="font-mono text-xl font-semibold tabular-nums">{compactCurrency.format(total)}</p>
            <p className="text-[10px] text-muted-foreground">total pendiente</p>
          </div>
        </div>
        <div className="grid shrink-0 grid-cols-2 gap-x-3 gap-y-1.5 border-t pt-2.5">
          {buckets.map((bucket) => (
            <button
              key={bucket.id}
              type="button"
              className="flex min-w-0 items-center gap-1.5 text-left text-[10px] hover:text-primary"
              onClick={() => onSelect(bucket)}
            >
              <span className="size-2 shrink-0 rounded-[2px]" style={{ backgroundColor: statusColors[bucket.status] }} />
              <span className="truncate">{bucket.label}</span>
              <span className="ml-auto shrink-0 font-mono">{bucket.percentage.toFixed(0)}%</span>
            </button>
          ))}
        </div>
        <p className="mt-2 shrink-0 text-center text-[10px] text-muted-foreground">
          Vencido: <strong className="font-mono text-foreground">{compactCurrency.format(overdue)}</strong>
          <span className="sr-only"> · {direction === "receivable" ? "por cobrar" : "por pagar"}</span>
        </p>
      </CardContent>
    </Card>
  )
}

function AvailabilityCard({
  accounts,
  onSelect,
}: {
  accounts: AvailabilityAccount[]
  onSelect: (account: AvailabilityAccount) => void
}) {
  const total = accounts.reduce((sum, account) => sum + account.balance, 0)
  const max = Math.max(...accounts.map((account) => account.balance), 1)
  const groupData = (["bank", "cash", "other"] as const).map((type) => ({
    type,
    label: type === "bank" ? "Bancos" : type === "cash" ? "Cajas" : "Otras",
    value: accounts.filter((account) => account.type === type).reduce((sum, account) => sum + account.balance, 0),
    color: type === "bank" ? "#0057ff" : type === "cash" ? "#16a34a" : "#64748b",
  }))

  return (
    <Card className="min-h-[18rem] min-w-0 overflow-hidden rounded-[4px] py-0 xl:col-span-2 xl:min-h-0">
      <ModuleTitle title="Disponibilidades" subtitle="Saldos por cuenta y tipo" total={total} />
      <CardContent className="grid flex-1 gap-4 p-3.5 md:min-h-0 md:grid-cols-[0.72fr_1.28fr]">
        <div className="flex flex-col justify-center border-b pb-3 md:min-h-0 md:border-r md:border-b-0 md:pr-4 md:pb-0">
          <p className="font-mono text-[9px] uppercase text-muted-foreground">Composición</p>
          <p className="mt-1 font-mono text-3xl font-semibold tabular-nums">{compactCurrency.format(total)}</p>
          <div className="mt-5 grid gap-3">
            {groupData.map((group) => (
              <div key={group.type} className="grid grid-cols-[3.5rem_1fr_auto] items-center gap-2 text-[10px]">
                <span className="text-muted-foreground">{group.label}</span>
                <span className="h-2.5 overflow-hidden rounded-[2px] bg-muted">
                  <span
                    className="block h-full rounded-[2px]"
                    style={{ width: `${total ? (group.value / total) * 100 : 0}%`, backgroundColor: group.color }}
                  />
                </span>
                <span className="min-w-14 text-right font-mono">{compactCurrency.format(group.value)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-center gap-2.5 md:min-h-0">
          {accounts.map((account) => (
            <button
              key={account.id}
              type="button"
              className="group grid gap-1 text-left"
              onClick={() => onSelect(account)}
            >
              <span className="flex min-w-0 justify-between gap-3 text-[11px]">
                <span className="truncate font-medium group-hover:text-primary">{account.name}</span>
                <span className="shrink-0 font-mono tabular-nums">{compactCurrency.format(account.balance)}</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2 flex-1 overflow-hidden rounded-[2px] bg-muted">
                  <span
                    className={cn("block h-full rounded-[2px]", account.status === "fresh" ? "bg-primary" : "bg-amber-600")}
                    style={{ width: `${Math.max((account.balance / max) * 100, 4)}%` }}
                  />
                </span>
                <span className={cn("w-20 text-right font-mono text-[9px]", account.status === "fresh" ? "text-muted-foreground" : "text-amber-700 dark:text-amber-400")}>{account.status === "fresh" ? "Actualizada" : account.status === "stale" ? "Desactualizada" : "Error"}</span>
              </span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function DetailSheet({
  selection,
  onOpenChange,
  onNavigate,
  resultSeries,
}: {
  selection: DetailSelection | null
  onOpenChange: (open: boolean) => void
  onNavigate: (view: ViewId) => void
  resultSeries: DashboardSnapshot["resultSeries"]
}) {
  const title = !selection
    ? "Detalle financiero"
    : selection.kind === "party"
      ? selection.party.name
      : selection.kind === "aging"
        ? `${selection.direction === "receivable" ? "Facturas de clientes" : "Facturas de proveedores"} · ${selection.bucket.label}`
        : selection.kind === "account"
          ? selection.account.name
          : selection.kind === "metric"
            ? selection.metric.label
            : "Resultado detallado"

  const destination = selection?.kind === "party"
    ? selection.party.kind === "customer" ? "customers" : "suppliers"
    : selection?.kind === "aging"
      ? selection.direction === "receivable" ? "customer-account" : "purchase-invoices"
      : selection?.kind === "account"
        ? "payments"
        : null

  return (
    <Sheet open={Boolean(selection)} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 sm:max-w-[42rem]">
        <SheetHeader className="border-b pr-12">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>Detalle de solo lectura para el alcance activo.</SheetDescription>
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-auto p-4">
          {selection?.kind === "party" ? (
            <div className="grid gap-5">
              <div className="grid grid-cols-2 gap-3 border-b pb-4">
                <div><p className="font-mono text-[10px] uppercase text-muted-foreground">Saldo</p><p className="mt-1 text-lg font-semibold">{currency.format(selection.party.balance)}</p></div>
                <div><p className="font-mono text-[10px] uppercase text-muted-foreground">Vencido</p><p className="mt-1 text-lg font-semibold">{currency.format(selection.party.overdueAmount)}</p></div>
                <div><p className="font-mono text-[10px] uppercase text-muted-foreground">Próximo vencimiento</p><p className="mt-1">{formatDate(selection.party.nextDueDate)}</p></div>
                <div><p className="font-mono text-[10px] uppercase text-muted-foreground">Estado</p><p className="mt-1">{statusLabels[selection.party.status]}</p></div>
              </div>
              <div className="grid gap-3 text-sm sm:grid-cols-2">
                <div><p className="text-xs text-muted-foreground">CUIT</p><p>{selection.party.taxId ?? "Sin dato"}</p></div>
                <div><p className="text-xs text-muted-foreground">Condición de IVA</p><p>{selection.party.vatCategory ?? "Sin dato"}</p></div>
                <div><p className="text-xs text-muted-foreground">Teléfono</p><p>{selection.party.phone ?? "Sin dato"}</p></div>
                <div><p className="text-xs text-muted-foreground">Domicilio</p><p>{selection.party.address ?? "Sin dato"}</p></div>
              </div>
            </div>
          ) : null}
          {selection?.kind === "aging" ? (
            <div className="grid grid-cols-3 gap-3">
              <div><p className="font-mono text-[10px] uppercase text-muted-foreground">Monto</p><p className="mt-1 font-semibold">{currency.format(selection.bucket.amount)}</p></div>
              <div><p className="font-mono text-[10px] uppercase text-muted-foreground">Participación</p><p className="mt-1 font-semibold">{selection.bucket.percentage.toFixed(1)}%</p></div>
              <div><p className="font-mono text-[10px] uppercase text-muted-foreground">Comprobantes</p><p className="mt-1 font-semibold">{selection.bucket.count}</p></div>
            </div>
          ) : null}
          {selection?.kind === "account" ? (
            <div className="grid grid-cols-2 gap-3">
              <div><p className="font-mono text-[10px] uppercase text-muted-foreground">Saldo</p><p className="mt-1 text-lg font-semibold">{currency.format(selection.account.balance)}</p></div>
              <div><p className="font-mono text-[10px] uppercase text-muted-foreground">Código</p><p className="mt-1">{selection.account.code ?? "Sin código"}</p></div>
              <div><p className="font-mono text-[10px] uppercase text-muted-foreground">Tipo</p><p className="mt-1 capitalize">{selection.account.type}</p></div>
              <div><p className="font-mono text-[10px] uppercase text-muted-foreground">Actualización</p><p className="mt-1">{formatDateTime(selection.account.updatedAt)}</p></div>
            </div>
          ) : null}
          {selection?.kind === "result" ? (
            <Table>
              <TableHeader><TableRow><TableHead>Período</TableHead><TableHead className="text-right">Ingresos</TableHead><TableHead className="text-right">Egresos</TableHead><TableHead className="text-right">Resultado</TableHead></TableRow></TableHeader>
              <TableBody>{[...resultSeries].reverse().map((row) => <TableRow key={row.date}><TableCell>{formatDate(row.date)}</TableCell><TableCell className="text-right font-mono">{currency.format(row.income)}</TableCell><TableCell className="text-right font-mono">{currency.format(row.expense)}</TableCell><TableCell className="text-right font-mono font-semibold">{currency.format(row.result)}</TableCell></TableRow>)}</TableBody>
            </Table>
          ) : null}
        </div>
        <SheetFooter className="border-t">
          {destination ? (
            <Button className="rounded-[4px]" onClick={() => onNavigate(destination)}>
              Abrir módulo relacionado <ArrowRight />
            </Button>
          ) : (
            <Button variant="secondary" className="rounded-[4px]" onClick={() => onOpenChange(false)}>Cerrar</Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export function FinancialDashboardWorkspace({
  onNavigate,
  onNotify,
}: {
  onNavigate: (view: ViewId) => void
  onNotify: (message: string) => void
}) {
  const [companyIds, setCompanyIds] = useState<string[]>(dashboardSnapshot.filters.companyIds)
  const [draftCompanyIds, setDraftCompanyIds] = useState<string[]>(companyIds)
  const [companyPickerOpen, setCompanyPickerOpen] = useState(false)
  const [businessUnitId, setBusinessUnitId] = useState(dashboardSnapshot.filters.businessUnitId ?? "all")
  const [period, setPeriod] = useState<PeriodKey>("365")
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(dashboardSnapshot.generatedAt)
  const [selection, setSelection] = useState<DetailSelection | null>(null)

  const companyFactor = useMemo(() => {
    if (companyIds.length > 1) return 1 + (companyIds.length - 1) * 0.42
    const index = dashboardCompanies.findIndex((company) => company.id === companyIds[0])
    return 0.72 + Math.max(index, 0) * 0.055
  }, [companyIds])
  const unitFactor = businessUnitId === "unit-2" ? 0.82 : businessUnitId === "unit-3" ? 0.64 : 1
  const snapshot = useMemo(
    () => scaleSnapshot(dashboardSnapshot, companyFactor * unitFactor, companyIds),
    [companyFactor, unitFactor, companyIds]
  )

  const visibleSeries = period === "365"
    ? snapshot.resultSeries
    : period === "90"
      ? snapshot.resultSeries.slice(-4)
      : snapshot.resultSeries.slice(-2)
  const selectedCompanyLabel = companyIds.length === 1
    ? dashboardCompanies.find((company) => company.id === companyIds[0])?.name ?? "Empresa"
    : `${companyIds.length} empresas · Consolidado`
  const sourceIssue = snapshot.freshness.find((source) => source.status !== "fresh")

  const refresh = () => {
    if (refreshing) return
    setRefreshing(true)
    window.setTimeout(() => {
      setLastUpdated(new Date().toISOString())
      setRefreshing(false)
      onNotify("Dashboard actualizado sin perder el alcance seleccionado.")
    }, 800)
  }

  return (
    <main className="h-full min-h-0 overflow-auto bg-background xl:overflow-hidden">
      <div className="flex min-h-full w-full flex-col gap-2.5 p-3 sm:p-4 lg:p-5 xl:h-full xl:min-h-0">
        <header className="grid shrink-0 items-center gap-2.5 rounded-[4px] border bg-card p-2.5 xl:grid-cols-[minmax(13rem,0.75fr)_minmax(35rem,1.6fr)_auto]">
          <div className="min-w-0 px-1">
            <p className="font-mono text-[9px] font-semibold uppercase tracking-wider text-primary">Control financiero</p>
            <h1 className="truncate text-xl font-semibold tracking-tight">Dashboard financiero</h1>
          </div>

          <div className="flex min-w-0 flex-wrap items-center gap-1.5 xl:flex-nowrap">
            <Popover
              open={companyPickerOpen}
              onOpenChange={(open) => {
                setCompanyPickerOpen(open)
                if (open) setDraftCompanyIds(companyIds)
              }}
            >
              <PopoverTrigger asChild>
                <Button variant="outline" className="min-w-44 flex-1 justify-between rounded-[4px] xl:max-w-56">
                  <span className="flex min-w-0 items-center gap-2"><Building2 className="size-3.5 text-primary" /><span className="truncate">{selectedCompanyLabel}</span></span>
                  <ChevronDown className="size-3.5 text-muted-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-80 rounded-[4px] p-0">
                <div className="border-b p-3"><p className="text-sm font-semibold">Empresas incluidas</p><p className="text-xs text-muted-foreground">Seleccioná una o más para consolidar.</p></div>
                <div className="grid max-h-72 gap-1 overflow-auto p-2">
                  {dashboardCompanies.map((company) => (
                    <label key={company.id} className="flex cursor-pointer items-center gap-3 rounded-[4px] px-2 py-2 hover:bg-muted">
                      <Checkbox
                        checked={draftCompanyIds.includes(company.id)}
                        onCheckedChange={(checked) => setDraftCompanyIds((current) => checked ? [...current, company.id] : current.filter((id) => id !== company.id))}
                      />
                      <span className="min-w-0 flex-1 truncate text-sm">{company.code} · {company.name}</span>
                    </label>
                  ))}
                </div>
                <div className="flex justify-end gap-2 border-t p-2">
                  <Button variant="ghost" size="sm" className="rounded-[4px]" onClick={() => setCompanyPickerOpen(false)}>Cancelar</Button>
                  <Button size="sm" className="rounded-[4px]" disabled={!draftCompanyIds.length} onClick={() => { setCompanyIds(draftCompanyIds); setCompanyPickerOpen(false) }}>Aplicar</Button>
                </div>
              </PopoverContent>
            </Popover>

            <Select value={businessUnitId} onValueChange={setBusinessUnitId}>
              <SelectTrigger className="min-w-40 flex-1 rounded-[4px] xl:max-w-52"><SelectValue placeholder="Unidad" /></SelectTrigger>
              <SelectContent>{dashboardBusinessUnits.map((unit) => <SelectItem key={unit.id} value={unit.id}>{unit.code} · {unit.name}</SelectItem>)}</SelectContent>
            </Select>

            <Select value={period} onValueChange={(value) => setPeriod(value as PeriodKey)}>
              <SelectTrigger className="min-w-40 flex-1 rounded-[4px] xl:max-w-48"><CalendarDays className="size-3.5 text-muted-foreground" /><SelectValue /></SelectTrigger>
              <SelectContent>{Object.entries(periodLabels).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent>
            </Select>

            <Badge variant="outline" className="h-8 rounded-[4px] px-2 font-mono text-[10px]">ARS</Badge>
          </div>

          <div className="flex items-center justify-end gap-1.5">
            <Badge variant="outline" className={cn("hidden h-8 rounded-[4px] font-mono text-[9px] 2xl:flex", sourceIssue && "border-amber-500/50 text-amber-700 dark:text-amber-400")}>
              {sourceIssue ? <TriangleAlert className="size-3.5" /> : <CheckCircle2 className="size-3.5 text-emerald-600" />}
              {sourceIssue ? "1 fuente desactualizada" : `Actualizado ${formatDateTime(lastUpdated)}`}
            </Badge>
            <Button variant="outline" className="rounded-[4px]" onClick={() => onNotify("Exportación demo con los filtros activos.")}><Download /> <span className="hidden 2xl:inline">Exportar</span></Button>
            <Button className="rounded-[4px]" disabled={refreshing} onClick={refresh}><RefreshCw className={cn(refreshing && "animate-spin")} /> <span className="hidden 2xl:inline">Actualizar</span></Button>
          </div>
        </header>

        <section className="grid gap-2.5 md:grid-cols-2 xl:min-h-0 xl:flex-1 xl:grid-cols-4 xl:grid-rows-2">
          <PartyBalanceCard
            title="Clientes"
            subtitle="Saldos por cobrar"
            rows={snapshot.customerBalances}
            emptyLabel="No hay saldos de clientes para este alcance."
            onSelect={(party) => setSelection({ kind: "party", party })}
          />
          <ResultCard series={visibleSeries} onOpen={() => setSelection({ kind: "result" })} />
          <PartyBalanceCard
            title="Proveedores"
            subtitle="Saldos por pagar"
            rows={snapshot.supplierBalances}
            emptyLabel="No hay saldos de proveedores para este alcance."
            onSelect={(party) => setSelection({ kind: "party", party })}
          />
          <AgingDonutCard
            title="Facturas impagas · clientes"
            subtitle="Distribución por antigüedad"
            buckets={snapshot.receivableAging}
            direction="receivable"
            onSelect={(bucket) => setSelection({ kind: "aging", bucket, direction: "receivable" })}
          />
          <AvailabilityCard
            accounts={snapshot.availabilityAccounts}
            onSelect={(account) => setSelection({ kind: "account", account })}
          />
          <AgingDonutCard
            title="Facturas impagas · proveedores"
            subtitle="Distribución por antigüedad"
            buckets={snapshot.payableAging}
            direction="payable"
            onSelect={(bucket) => setSelection({ kind: "aging", bucket, direction: "payable" })}
          />
        </section>
      </div>

      <DetailSheet
        selection={selection}
        onOpenChange={(open) => { if (!open) setSelection(null) }}
        onNavigate={onNavigate}
        resultSeries={visibleSeries}
      />
    </main>
  )
}
