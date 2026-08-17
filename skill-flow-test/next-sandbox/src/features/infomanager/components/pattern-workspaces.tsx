"use client"

import { useMemo, useState, type ReactNode } from "react"
import {
  Blocks,
  Check,
  Eye,
  FileSpreadsheet,
  FileText,
  Filter,
  LayoutTemplate,
  Printer,
  RotateCcw,
  Search,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
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
import type { PatternViewId } from "../types"
import { Field, Metric } from "./shared"

const patternMeta: Record<
  PatternViewId,
  { label: string; description: string; example: string }
> = {
  "pattern-form-simple": {
    label: "Formulario simple",
    description: "Carga breve, una sola tarea y finalizacion al pie.",
    example: "Referencia estructural: Crear deposito",
  },
  "pattern-form-sectioned": {
    label: "Formulario seccionado",
    description: "Carga extensa agrupada por decisiones y capacidades.",
    example: "Referencia estructural: Crear articulo",
  },
  "pattern-report": {
    label: "Consulta y reporte",
    description: "Filtros compartidos, resultados, indicadores y exportacion consistente.",
    example: "Referencia estructural: Comprobantes por periodo",
  },
}

function PatternFrame({
  pattern,
  children,
}: {
  pattern: PatternViewId
  children: ReactNode
}) {
  const meta = patternMeta[pattern]

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <section className="shrink-0 border-b bg-card px-4 py-2.5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <Badge variant="outline" className="rounded-[4px] border-primary/35 text-primary">
            Laboratorio UX · draft
          </Badge>
          <strong className="text-sm">{meta.label}</strong>
          <span className="text-xs text-muted-foreground">{meta.description}</span>
          <span className="ml-auto font-mono text-[10px] text-muted-foreground">
            {meta.example}
          </span>
        </div>
      </section>
      <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
    </div>
  )
}

function FormCompletionBar({
  saved,
  entityLabel,
  onSave,
}: {
  saved: boolean
  entityLabel: string
  onSave: () => void
}) {
  return (
    <footer className="shrink-0 border-t bg-card px-3 py-2.5 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] md:px-4">
      <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2 text-xs">
          {saved ? (
            <Check className="size-4 shrink-0 text-emerald-600" />
          ) : (
            <span className="size-2 shrink-0 rounded-full bg-amber-500" />
          )}
          <strong>{saved ? `${entityLabel} guardado` : "Cambios sin guardar"}</strong>
          <span className="text-muted-foreground">
            {saved ? "· La vista queda lista para volver o continuar" : "· Revisa los campos obligatorios antes de finalizar"}
          </span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline">Cancelar</Button>
          <Button onClick={onSave} disabled={saved}>
            <Check /> {saved ? "Guardado" : `Crear ${entityLabel.toLocaleLowerCase("es")}`}
          </Button>
        </div>
      </div>
    </footer>
  )
}

function SimpleFormPattern() {
  const [saved, setSaved] = useState(false)

  return (
    <PatternFrame pattern="pattern-form-simple">
      <div className="flex h-full min-h-0 flex-col bg-background">
        <div className="min-h-0 flex-1 overflow-auto">
          <div className="mx-auto grid max-w-[1500px] gap-3 p-3 md:p-4">
            <header className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <LayoutTemplate className="size-5 text-primary" />
                  <h2 className="text-lg font-semibold">Crear deposito</h2>
                  <Badge variant="outline" className="rounded-[4px]">{saved ? "Guardado" : "Borrador"}</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Formulario corto para una entidad con pocos datos y una unica finalizacion.
                </p>
              </div>
            </header>

            <Card className="rounded-[4px] py-0">
              <CardHeader className="border-b px-4 py-3">
                <CardTitle className="text-sm">Datos principales</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
                <Field label="Codigo" required>
                  <Input defaultValue="DEP-03" disabled={saved} className="h-10 rounded-[4px] font-mono" />
                </Field>
                <Field label="Nombre" required className="xl:col-span-2">
                  <Input defaultValue="Deposito secundario" disabled={saved} className="h-10 rounded-[4px]" />
                </Field>
                <Field label="Tipo" required>
                  <Select defaultValue="ORIGEN" disabled={saved}>
                    <SelectTrigger className="h-10 w-full rounded-[4px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ORIGEN">Origen</SelectItem>
                      <SelectItem value="DESTINO">Destino</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </CardContent>
            </Card>

            <Card className="rounded-[4px] py-0">
              <CardHeader className="border-b px-4 py-3">
                <CardTitle className="text-sm">Ubicacion y asignacion</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
                <Field label="Empresa" required>
                  <Select defaultValue="demo" disabled={saved}>
                    <SelectTrigger className="h-10 w-full rounded-[4px]"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="demo">InfoManager Demo SA</SelectItem></SelectContent>
                  </Select>
                </Field>
                <Field label="Punto de venta">
                  <Select defaultValue="0004" disabled={saved}>
                    <SelectTrigger className="h-10 w-full rounded-[4px]"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="0004">Casa Central · PV 0004</SelectItem></SelectContent>
                  </Select>
                </Field>
                <Field label="Centro de costo">
                  <Input placeholder="Sin asignar" disabled={saved} className="h-10 rounded-[4px]" />
                </Field>
                <Field label="Direccion" className="md:col-span-2 xl:col-span-3">
                  <Input defaultValue="Ruta 9 km 1286" disabled={saved} className="h-10 rounded-[4px]" />
                </Field>
              </CardContent>
            </Card>
          </div>
        </div>
        <FormCompletionBar saved={saved} entityLabel="Deposito" onSave={() => setSaved(true)} />
      </div>
    </PatternFrame>
  )
}

function SectionedFormPattern() {
  const [saved, setSaved] = useState(false)

  return (
    <PatternFrame pattern="pattern-form-sectioned">
      <div className="flex h-full min-h-0 flex-col bg-background">
        <div className="min-h-0 flex-1 overflow-auto">
          <div className="mx-auto grid max-w-[1500px] gap-3 p-3 md:p-4">
            <header>
              <div className="flex items-center gap-2">
                <Blocks className="size-5 text-primary" />
                <h2 className="text-lg font-semibold">Crear articulo</h2>
                <Badge variant="outline" className="rounded-[4px]">{saved ? "Guardado" : "Borrador"}</Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Formulario extenso dividido por decisiones; cada seccion puede variar sin cambiar el cierre comun.
              </p>
            </header>

            <Card className="rounded-[4px] py-0">
              <CardHeader className="border-b px-4 py-3"><CardTitle className="text-sm">1. Identificacion</CardTitle></CardHeader>
              <CardContent className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
                <Field label="Codigo" required><Input defaultValue="ART-1042" disabled={saved} className="h-10 rounded-[4px] font-mono" /></Field>
                <Field label="Descripcion" required className="md:col-span-1 xl:col-span-2"><Input defaultValue="Producto de ejemplo" disabled={saved} className="h-10 rounded-[4px]" /></Field>
                <Field label="Codigo de barras"><Input placeholder="Opcional" disabled={saved} className="h-10 rounded-[4px] font-mono" /></Field>
              </CardContent>
            </Card>

            <Card className="rounded-[4px] py-0">
              <CardHeader className="border-b px-4 py-3"><CardTitle className="text-sm">2. Venta y clasificacion</CardTitle></CardHeader>
              <CardContent className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
                <Field label="Precio de venta" required><Input defaultValue="12500,00" disabled={saved} className="h-10 rounded-[4px] text-right font-mono" /></Field>
                <Field label="IVA" required>
                  <Select defaultValue="21" disabled={saved}><SelectTrigger className="h-10 w-full rounded-[4px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="21">21%</SelectItem><SelectItem value="10.5">10,5%</SelectItem><SelectItem value="0">Exento</SelectItem></SelectContent></Select>
                </Field>
                <Field label="Rubro" required><Input defaultValue="Bebidas" disabled={saved} className="h-10 rounded-[4px]" /></Field>
                <Field label="Subrubro"><Input defaultValue="Sin alcohol" disabled={saved} className="h-10 rounded-[4px]" /></Field>
              </CardContent>
            </Card>

            <Card className="rounded-[4px] py-0">
              <CardHeader className="border-b px-4 py-3"><CardTitle className="text-sm">3. Capacidades opcionales</CardTitle></CardHeader>
              <CardContent className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
                <label className="flex h-10 items-center gap-2 rounded-[4px] border px-3 text-sm"><Checkbox disabled={saved} /> Maneja numeros de serie</label>
                <label className="flex h-10 items-center gap-2 rounded-[4px] border px-3 text-sm"><Checkbox disabled={saved} /> Se vende por peso</label>
                <label className="flex h-10 items-center gap-2 rounded-[4px] border px-3 text-sm"><Checkbox defaultChecked disabled={saved} /> Controla stock</label>
                <Field label="Observaciones" className="md:col-span-2 xl:col-span-3"><Textarea placeholder="Informacion interna opcional" disabled={saved} className="min-h-20 resize-none rounded-[4px]" /></Field>
              </CardContent>
            </Card>
          </div>
        </div>
        <FormCompletionBar saved={saved} entityLabel="Articulo" onSave={() => setSaved(true)} />
      </div>
    </PatternFrame>
  )
}

type ReportType = "Factura A" | "Factura B" | "Nota de credito" | "Remito"
type ReportStatus = "Emitido" | "Pendiente ARCA" | "Anulado" | "Recibido"
type ReportFamily = "all" | "invoices" | "notes" | "delivery-notes"

type ReportRow = {
  id: string
  date: string
  type: ReportType
  number: string
  customer: string
  status: ReportStatus
  pointOfSale: string
  total: number
}

const reportRows: ReportRow[] = [
  { id: "r-1", date: "22/07/2026", type: "Factura A", number: "0004-00001842", customer: "Almacen San Martin SRL", status: "Emitido", pointOfSale: "PV 0004", total: 18911.61 },
  { id: "r-2", date: "22/07/2026", type: "Factura B", number: "0004-00001843", customer: "Maria Elena Paz", status: "Emitido", pointOfSale: "PV 0004", total: 8240 },
  { id: "r-3", date: "21/07/2026", type: "Nota de credito", number: "0004-00000216", customer: "Comercial Norte SA", status: "Emitido", pointOfSale: "PV 0004", total: 15631.08 },
  { id: "r-4", date: "21/07/2026", type: "Factura A", number: "Interno 1844", customer: "Distribuidora Oeste", status: "Pendiente ARCA", pointOfSale: "PV 0007", total: 98450.5 },
  { id: "r-5", date: "20/07/2026", type: "Factura B", number: "0004-00001841", customer: "Consumidor Final", status: "Anulado", pointOfSale: "PV 0004", total: 4200 },
  { id: "r-6", date: "19/07/2026", type: "Remito", number: "R-0004-000091", customer: "Mercado Central SRL", status: "Recibido", pointOfSale: "PV 0007", total: 49680 },
]

function reportFamilyMatches(row: ReportRow, family: ReportFamily) {
  if (family === "all") return true
  if (family === "invoices") return row.type.startsWith("Factura")
  if (family === "notes") return row.type === "Nota de credito"
  return row.type === "Remito"
}

function escapeDelimited(value: string | number) {
  return `"${String(value).replaceAll('"', '""')}"`
}

function escapeHtml(value: string | number) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}

function triggerDownload(contents: BlobPart, type: string, filename: string) {
  const url = URL.createObjectURL(new Blob([contents], { type }))
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = filename
  anchor.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 0)
}

function exportCsv(rows: ReportRow[]) {
  const header = ["Fecha", "Tipo", "Numero", "Cliente", "Estado", "Punto", "Total"]
  const body = rows.map((row) => [row.date, row.type, row.number, row.customer, row.status, row.pointOfSale, row.total.toFixed(2)])
  const csv = [header, ...body].map((values) => values.map(escapeDelimited).join(";")).join("\n")
  triggerDownload(`\ufeff${csv}`, "text/csv;charset=utf-8", "comprobantes-por-periodo.csv")
}

function exportExcel(rows: ReportRow[]) {
  const cells = rows.map((row) => `<tr><td>${escapeHtml(row.date)}</td><td>${escapeHtml(row.type)}</td><td>${escapeHtml(row.number)}</td><td>${escapeHtml(row.customer)}</td><td>${escapeHtml(row.status)}</td><td>${escapeHtml(row.pointOfSale)}</td><td>${row.total.toFixed(2)}</td></tr>`).join("")
  const html = `<html><head><meta charset="utf-8"></head><body><table><thead><tr><th>Fecha</th><th>Tipo</th><th>Numero</th><th>Cliente</th><th>Estado</th><th>Punto</th><th>Total</th></tr></thead><tbody>${cells}</tbody></table></body></html>`
  triggerDownload(html, "application/vnd.ms-excel;charset=utf-8", "comprobantes-por-periodo.xls")
}

function printReport(rows: ReportRow[]) {
  const printWindow = window.open("", "_blank", "width=1100,height=800")
  if (!printWindow) return false
  printWindow.opener = null
  const cells = rows.map((row) => `<tr><td>${escapeHtml(row.date)}</td><td>${escapeHtml(row.type)}</td><td>${escapeHtml(row.number)}</td><td>${escapeHtml(row.customer)}</td><td>${escapeHtml(row.status)}</td><td>${escapeHtml(row.pointOfSale)}</td><td style="text-align:right">${escapeHtml(money(row.total))}</td></tr>`).join("")
  printWindow.document.write(`<html><head><title>Comprobantes por periodo</title><style>body{font-family:Arial,sans-serif;padding:24px}h1{font-size:20px}p{color:#666}table{width:100%;border-collapse:collapse;margin-top:20px;font-size:12px}th,td{border-bottom:1px solid #ddd;padding:8px;text-align:left}th{background:#f3f3f3}@media print{button{display:none}}</style></head><body><h1>Comprobantes por periodo</h1><p>${rows.length} resultados · generado el 22/07/2026</p><table><thead><tr><th>Fecha</th><th>Tipo</th><th>Numero</th><th>Cliente</th><th>Estado</th><th>Punto</th><th>Total</th></tr></thead><tbody>${cells}</tbody></table><script>window.onload=()=>window.print()</script></body></html>`)
  printWindow.document.close()
  return true
}

function ReportPattern() {
  const [query, setQuery] = useState("")
  const [family, setFamily] = useState<ReportFamily>("all")
  const [period, setPeriod] = useState("30")
  const [type, setType] = useState("all")
  const [status, setStatus] = useState("all")
  const [pointOfSale, setPointOfSale] = useState("all")
  const [includeAnnulled, setIncludeAnnulled] = useState(false)
  const [selected, setSelected] = useState<ReportRow | null>(null)
  const [exportNotice, setExportNotice] = useState("")

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("es")
    return reportRows.filter((row) => {
      const matchesQuery = !normalized || `${row.number} ${row.customer}`.toLocaleLowerCase("es").includes(normalized)
      const matchesFamily = reportFamilyMatches(row, family)
      const matchesType = type === "all" || row.type === type
      const matchesStatus = status === "all" || row.status === status
      const matchesPoint = pointOfSale === "all" || row.pointOfSale === pointOfSale
      const matchesAnnulled = includeAnnulled || row.status !== "Anulado"
      return matchesQuery && matchesFamily && matchesType && matchesStatus && matchesPoint && matchesAnnulled
    })
  }, [family, includeAnnulled, pointOfSale, query, status, type])

  const total = filtered.reduce((sum, row) => sum + row.total, 0)
  const pending = filtered.filter((row) => row.status === "Pendiente ARCA").length

  const clearFilters = () => {
    setQuery("")
    setFamily("all")
    setPeriod("30")
    setType("all")
    setStatus("all")
    setPointOfSale("all")
    setIncludeAnnulled(false)
  }

  const notifyExport = (message: string) => {
    setExportNotice(message)
    window.setTimeout(() => setExportNotice(""), 2500)
  }

  return (
    <PatternFrame pattern="pattern-report">
      <div className="flex h-full min-h-0 flex-col bg-background p-3 md:p-4">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">Comprobantes por periodo</h2>
              <Badge variant="outline" className="rounded-[4px] font-mono text-[10px]">Datos simulados</Badge>
            </div>
            <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
              {filtered.length} de {reportRows.length} resultados · consulta sin modificacion de datos
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-1.5">
            <Button variant="outline" className="h-9 rounded-[4px]" onClick={() => { exportCsv(filtered); notifyExport(`CSV exportado · ${filtered.length} filas`) }}><FileText /> CSV</Button>
            <Button variant="outline" className="h-9 rounded-[4px]" onClick={() => { exportExcel(filtered); notifyExport(`Excel exportado · ${filtered.length} filas`) }}><FileSpreadsheet /> Excel</Button>
            <Button variant="outline" className="h-9 rounded-[4px]" onClick={() => { if (printReport(filtered)) notifyExport(`Vista PDF preparada · ${filtered.length} filas`) }}><Printer /> PDF</Button>
          </div>
        </header>

        <div className="relative mt-3 min-w-0">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por numero o cliente" aria-label="Buscar resultados por numero o cliente" className="h-10 w-full rounded-[4px] bg-card pl-9" />
        </div>

        <div className="mt-2 flex min-w-0 items-center justify-between gap-3 overflow-x-auto pb-1" aria-label="Filtros del reporte">
          <Tabs value={family} onValueChange={(value) => setFamily(value as ReportFamily)} className="shrink-0 gap-0">
            <TabsList className="min-h-11 rounded-[4px] p-2" aria-label="Familia de comprobante">
              {([ ["all", "Todos"], ["invoices", "Facturas"], ["notes", "Notas"], ["delivery-notes", "Remitos"] ] as const).map(([value, label]) => (
                <TabsTrigger key={value} value={value} className="h-7 rounded-[4px] px-2.5 font-mono">
                  {label}<span className="text-[10px] text-current opacity-70">{reportRows.filter((row) => reportFamilyMatches(row, value)).length}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="ml-auto flex shrink-0 items-center justify-end gap-1.5">
            <Select value={period} onValueChange={setPeriod}><SelectTrigger className="h-9 rounded-[4px]" aria-label="Periodo"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="30">Periodo: 30 d</SelectItem><SelectItem value="90">Periodo: 90 d</SelectItem><SelectItem value="year">Periodo: 2026</SelectItem></SelectContent></Select>
            <Select value={type} onValueChange={setType}><SelectTrigger className="h-9 rounded-[4px]" aria-label="Tipo"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Tipo: todos</SelectItem>{["Factura A", "Factura B", "Nota de credito", "Remito"].map((option) => <SelectItem key={option} value={option}>Tipo: {option}</SelectItem>)}</SelectContent></Select>
            <Select value={status} onValueChange={setStatus}><SelectTrigger className="h-9 rounded-[4px]" aria-label="Estado"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Estado: todos</SelectItem>{["Emitido", "Pendiente ARCA", "Recibido", "Anulado"].map((option) => <SelectItem key={option} value={option}>Estado: {option}</SelectItem>)}</SelectContent></Select>
            <Select value={pointOfSale} onValueChange={setPointOfSale}><SelectTrigger className="h-9 rounded-[4px]" aria-label="Punto"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Punto: todos</SelectItem><SelectItem value="PV 0004">Punto: PV 0004</SelectItem><SelectItem value="PV 0007">Punto: PV 0007</SelectItem></SelectContent></Select>
            <label className="flex h-9 shrink-0 items-center gap-2 rounded-[4px] border bg-card px-2.5 font-mono text-[11px] font-semibold whitespace-nowrap"><Checkbox checked={includeAnnulled} onCheckedChange={(checked) => setIncludeAnnulled(Boolean(checked))} />Anulados</label>
          </div>
        </div>

        <section className="mt-2 grid shrink-0 grid-cols-2 gap-x-6 gap-y-3 border-y bg-muted/25 px-3 py-3 md:grid-cols-4" aria-label="Indicadores del reporte">
          <Metric label="Resultados" value={filtered.length} strong />
          <Metric label="Total informado" value={money(total)} strong />
          <Metric label="Pendientes ARCA" value={pending} strong />
          <Metric label="Periodo" value={period === "30" ? "Últimos 30 días" : period === "90" ? "Últimos 90 días" : "Año 2026"} />
        </section>

        <div className="mt-3 min-h-0 flex-1 overflow-auto">
          <div className="min-w-[960px] overflow-hidden rounded-[4px] border bg-card">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-muted/95 backdrop-blur-sm">
                <TableRow className="hover:bg-transparent">
                  {["Fecha", "Tipo", "Numero", "Cliente", "Estado", "Punto", "Total"].map((label) => <TableHead key={label} className={cn("h-9 font-mono text-[10px] font-semibold uppercase", label === "Total" && "text-right")}>{label}</TableHead>)}
                  <TableHead className="sticky right-0 h-9 w-20 bg-muted/95 text-right font-mono text-[10px] font-semibold uppercase">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length ? filtered.map((row) => (
                  <TableRow key={row.id} tabIndex={0} className="h-11 cursor-pointer" onClick={() => setSelected(row)} onKeyDown={(event) => event.key === "Enter" && setSelected(row)}>
                    <TableCell className="font-mono text-xs">{row.date}</TableCell><TableCell>{row.type}</TableCell><TableCell className="font-mono text-xs">{row.number}</TableCell><TableCell className="font-medium">{row.customer}</TableCell>
                    <TableCell><Badge variant="outline" className={cn("rounded-[4px] font-mono text-[10px]", row.status === "Pendiente ARCA" && "border-amber-500/45 text-amber-700", row.status === "Anulado" && "text-muted-foreground")}>{row.status}</Badge></TableCell>
                    <TableCell className="font-mono text-xs">{row.pointOfSale}</TableCell><TableCell className="text-right font-mono font-semibold">{money(row.total)}</TableCell>
                    <TableCell className="sticky right-0 bg-card text-right"><Button size="icon-sm" variant="ghost" aria-label={`Ver ${row.type} ${row.number}`} onClick={(event) => { event.stopPropagation(); setSelected(row) }}><Eye /></Button></TableCell>
                  </TableRow>
                )) : (
                  <TableRow><TableCell colSpan={8} className="h-56 text-center"><div className="mx-auto grid max-w-sm justify-items-center gap-2"><Filter className="size-6 text-muted-foreground" /><strong>No hay resultados</strong><span className="text-xs text-muted-foreground">Cambia los filtros sin perder el contexto del reporte.</span><Button size="sm" variant="outline" onClick={clearFilters}><RotateCcw /> Limpiar filtros</Button></div></TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {exportNotice ? <div role="status" className="fixed right-4 bottom-4 z-[70] flex items-center gap-2 rounded-[4px] border bg-popover px-3 py-2 text-xs shadow-xl"><Check className="size-4 text-emerald-600" />{exportNotice}</div> : null}

        <Sheet open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
          <SheetContent className="w-[min(96vw,640px)] sm:max-w-none">
            {selected ? <><SheetHeader className="border-b px-5 py-4"><SheetTitle>{selected.type} {selected.number}</SheetTitle><SheetDescription>Detalle contextual sin perder filtros, indicadores ni posicion de la tabla.</SheetDescription></SheetHeader><div className="grid gap-5 p-5"><div className="grid grid-cols-2 gap-4"><Metric label="Cliente" value={selected.customer} /><Metric label="Fecha" value={selected.date} /><Metric label="Estado" value={selected.status} /><Metric label="Total" value={money(selected.total)} strong /></div><Button>Abrir comprobante</Button></div></> : null}
          </SheetContent>
        </Sheet>
      </div>
    </PatternFrame>
  )
}

export function PatternWorkspace({ pattern }: { pattern: PatternViewId }) {
  if (pattern === "pattern-form-simple") return <SimpleFormPattern />
  if (pattern === "pattern-form-sectioned") return <SectionedFormPattern />
  return <ReportPattern />
}
