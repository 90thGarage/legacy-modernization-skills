"use client"

// PROTOTYPE: Three drawer treatments for the guided invoice form, switchable via ?variant=.

import { useMemo, useState } from "react"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Circle,
  Eye,
  PackageSearch,
  Save,
  Search,
  Send,
  Trash2,
} from "lucide-react"

import {
  PrototypeSwitcher,
  type PrototypeVariantOption,
} from "@/components/prototype-switcher"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import type { CommercialContext } from "../types"
import { Field, Metric } from "./shared"

type InvoiceDrawerVariant = "compact" | "wide" | "takeover"

const variants: PrototypeVariantOption<InvoiceDrawerVariant>[] = [
  { value: "compact", label: "Drawer compacto por etapas" },
  { value: "wide", label: "Drawer ancho con grilla" },
  { value: "takeover", label: "Drawer takeover guiado" },
]

const preparation = [
  { label: "Cobro", detail: "1 cuota · 30 días", ready: true },
  { label: "Impuestos", detail: "Fijo aplica", ready: true },
  { label: "Entrega", detail: "Sin definir", ready: false },
  { label: "Origen", detail: "Sin vincular", ready: true, optional: true },
  { label: "Pagos", detail: "Sin definir", ready: false },
]

const steps = ["Cabecera", "Ítems", "Preparación", "Cierre"]

function readVariant(): InvoiceDrawerVariant {
  if (typeof window === "undefined") return "compact"
  const candidate = new URLSearchParams(window.location.search).get("variant")
  return variants.some((variant) => variant.value === candidate)
    ? (candidate as InvoiceDrawerVariant)
    : "compact"
}

function HeaderFields({ partyLabel }: { partyLabel: string }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Field label={partyLabel} required className="sm:col-span-2">
        <Select defaultValue="san-martin">
          <SelectTrigger className="h-9 w-full rounded-[4px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="san-martin">000184 · Almacén San Martín SRL</SelectItem>
            <SelectItem value="noa">000219 · Servicios Industriales NOA SA</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <Field label="Tipo" required>
        <Select defaultValue="invoice">
          <SelectTrigger className="h-9 w-full rounded-[4px]"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="invoice">Factura A</SelectItem></SelectContent>
        </Select>
      </Field>
      <Field label="Punto de venta" required>
        <Select defaultValue="00002">
          <SelectTrigger className="h-9 w-full rounded-[4px]"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="00002">PV 00002</SelectItem></SelectContent>
        </Select>
      </Field>
      <Field label="Condición de venta">
        <Select defaultValue="account">
          <SelectTrigger className="h-9 w-full rounded-[4px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="account">Cuenta corriente</SelectItem>
            <SelectItem value="cash">Contado</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <Field label="Fecha" required>
        <Input type="date" defaultValue="2026-07-29" className="h-9 rounded-[4px]" />
      </Field>
      <Field label="Observaciones" className="sm:col-span-2">
        <Textarea defaultValue="Factura Agosto 2026" className="min-h-16 rounded-[4px]" />
      </Field>
    </div>
  )
}

function PreparationCards({ compact = false }: { compact?: boolean }) {
  return (
    <div className={cn("grid gap-2", compact ? "sm:grid-cols-2" : "grid-cols-5")}>
      {preparation.map((item) => (
        <button
          key={item.label}
          type="button"
          className="flex min-w-0 items-center gap-2 rounded-[4px] border bg-card p-2.5 text-left hover:bg-muted/50"
        >
          {item.ready ? (
            <CheckCircle2 className={cn("size-4 shrink-0", item.optional ? "text-muted-foreground" : "text-emerald-600")} />
          ) : (
            <Circle className="size-4 shrink-0 text-amber-500" />
          )}
          <span className="min-w-0 flex-1">
            <span className="block truncate text-xs font-semibold">{item.label}</span>
            <span className="block truncate text-[10px] text-muted-foreground">{item.detail}</span>
          </span>
          <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" />
        </button>
      ))}
    </div>
  )
}

function ItemCard({
  quantity,
  setQuantity,
  price,
  setPrice,
  discount,
  setDiscount,
}: {
  quantity: number
  setQuantity: (value: number) => void
  price: number
  setPrice: (value: number) => void
  discount: number
  setDiscount: (value: number) => void
}) {
  return (
    <div className="rounded-[4px] border bg-card p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <strong>Abono Pro · Agosto 2026</strong>
          <div className="font-mono text-[10px] text-muted-foreground">ABONO-PRO · Abono mensual</div>
        </div>
        <Button type="button" variant="ghost" size="icon-sm" aria-label="Quitar artículo"><Trash2 /></Button>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <Field label="Cantidad">
          <Input type="number" min={1} value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} className="h-9 text-right font-mono" />
        </Field>
        <Field label="Precio unitario">
          <Input type="number" value={price} onChange={(event) => setPrice(Number(event.target.value))} className="h-9 text-right font-mono" />
        </Field>
        <Field label="Descuento %">
          <Input type="number" min={0} max={100} value={discount} onChange={(event) => setDiscount(Number(event.target.value))} className="h-9 text-right font-mono" />
        </Field>
      </div>
    </div>
  )
}

function CompactVariant({
  partyLabel,
  onClose,
  quantity,
  setQuantity,
  price,
  setPrice,
  discount,
  setDiscount,
  net,
  vat,
  total,
  onCommit,
}: PrototypeVariantProps) {
  const [step, setStep] = useState(0)

  return (
    <>
      <SheetHeader className="shrink-0 border-b px-5 py-4 pr-14">
        <div className="flex items-center gap-2">
          <SheetTitle className="text-lg">Nueva factura de venta</SheetTitle>
          <Badge variant="outline" className="font-mono text-[10px]">Prototipo · compacto</Badge>
        </div>
        <SheetDescription>Una sola etapa ocupa el drawer; la información anterior queda resumida.</SheetDescription>
      </SheetHeader>

      <div className="grid grid-cols-4 border-b bg-muted/25 px-4 py-2">
        {steps.map((label, index) => (
          <button
            key={label}
            type="button"
            className={cn(
              "flex min-w-0 items-center gap-2 rounded-[4px] px-2 py-2 text-left",
              step === index && "bg-card shadow-sm ring-1 ring-border"
            )}
            onClick={() => setStep(index)}
          >
            <span className={cn("grid size-5 shrink-0 place-items-center rounded-full border font-mono text-[10px]", index < step && "border-emerald-600 bg-emerald-600 text-white")}>
              {index < step ? <Check className="size-3" /> : index + 1}
            </span>
            <span className="truncate text-xs font-semibold">{label}</span>
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto bg-background p-4 md:p-5">
        {step === 0 ? (
          <section className="mx-auto grid max-w-2xl gap-4">
            <div>
              <h3 className="font-semibold">Datos de cabecera</h3>
              <p className="text-xs text-muted-foreground">Los campos secundarios no compiten con la carga de ítems.</p>
            </div>
            <HeaderFields partyLabel={partyLabel} />
          </section>
        ) : null}
        {step === 1 ? (
          <section className="mx-auto grid max-w-2xl gap-3">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input className="h-10 pl-9" placeholder="Buscar por código de barras o descripción" />
            </div>
            <ItemCard {...{ quantity, setQuantity, price, setPrice, discount, setDiscount }} />
          </section>
        ) : null}
        {step === 2 ? (
          <section className="mx-auto grid max-w-2xl gap-3">
            <div>
              <h3 className="font-semibold">Preparación del comprobante</h3>
              <p className="text-xs text-muted-foreground">Completá únicamente las definiciones que faltan.</p>
            </div>
            <PreparationCards compact />
          </section>
        ) : null}
        {step === 3 ? (
          <section className="mx-auto grid max-w-2xl gap-4">
            <div className="rounded-[4px] border bg-card p-4">
              <h3 className="border-b pb-3 font-semibold">Revisión y cierre</h3>
              <div className="grid gap-3 pt-4 sm:grid-cols-3">
                <Metric label="Neto" value={money(net)} />
                <Metric label="IVA 21 %" value={money(vat)} />
                <Metric label="Total" value={money(total)} />
              </div>
            </div>
            <div className="rounded-[4px] border border-amber-500/40 bg-amber-500/5 p-3 text-xs text-muted-foreground">
              Entrega y pagos continúan pendientes. La emisión final permanece como simulación.
            </div>
          </section>
        ) : null}
      </div>

      <SheetFooter className="shrink-0 flex-row items-center border-t bg-card px-5 py-3">
        <Button variant="outline" onClick={onClose}>Cancelar</Button>
        <div className="ml-auto flex gap-2">
          {step > 0 ? <Button variant="ghost" onClick={() => setStep((current) => current - 1)}><ArrowLeft />Anterior</Button> : null}
          {step < steps.length - 1 ? (
            <Button onClick={() => setStep((current) => current + 1)}>Continuar<ArrowRight /></Button>
          ) : (
            <Button onClick={onCommit}><Send />Emitir factura</Button>
          )}
        </div>
      </SheetFooter>
    </>
  )
}

function WideVariant({
  partyLabel,
  onClose,
  quantity,
  setQuantity,
  price,
  setPrice,
  discount,
  setDiscount,
  net,
  vat,
  total,
  onCommit,
}: PrototypeVariantProps) {
  return (
    <>
      <SheetHeader className="shrink-0 border-b px-4 py-3 pr-14">
        <div className="flex items-center gap-2">
          <SheetTitle className="text-base">Nueva factura de venta</SheetTitle>
          <Badge variant="outline" className="font-mono text-[10px]">Prototipo · ancho</Badge>
        </div>
        <SheetDescription>La vista guiada completa se adapta a un drawer de mayor ancho.</SheetDescription>
      </SheetHeader>

      <div className="flex min-h-0 flex-1 flex-col gap-2 bg-background p-2.5">
        <section className="grid shrink-0 gap-2 rounded-[4px] border bg-card p-2.5 xl:grid-cols-[1.25fr_1fr_0.9fr]">
          <div className="grid gap-2 sm:grid-cols-2">
            <Field label={partyLabel} required className="sm:col-span-2">
              <Select defaultValue="san-martin"><SelectTrigger className="h-8"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="san-martin">000184 · Almacén San Martín SRL</SelectItem></SelectContent></Select>
            </Field>
            <Field label="Tipo" required><Select defaultValue="invoice"><SelectTrigger className="h-8"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="invoice">Factura A</SelectItem></SelectContent></Select></Field>
            <Field label="Punto de venta" required><Select defaultValue="00002"><SelectTrigger className="h-8"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="00002">PV 00002</SelectItem></SelectContent></Select></Field>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <Field label="Moneda"><Select defaultValue="ars"><SelectTrigger className="h-8"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ars">Peso argentino</SelectItem></SelectContent></Select></Field>
            <Field label="Condición"><Select defaultValue="account"><SelectTrigger className="h-8"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="account">Cuenta corriente</SelectItem></SelectContent></Select></Field>
            <Field label="Vendedor"><Input className="h-8" defaultValue="Natalia Leyva" /></Field>
            <Field label="Lista de precios"><Input className="h-8" defaultValue="Mayorista" /></Field>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
            <Field label="Fecha" required><Input type="date" className="h-8" defaultValue="2026-07-29" /></Field>
            <Field label="Depósito"><Select defaultValue="central"><SelectTrigger className="h-8"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="central">1 · Central</SelectItem></SelectContent></Select></Field>
          </div>
        </section>

        <section className="shrink-0 rounded-[4px] border bg-card p-2">
          <div className="mb-2 flex items-center justify-between">
            <strong className="text-xs">Preparación del comprobante</strong>
            <Button variant="ghost" size="xs">Completar pendientes<ChevronRight /></Button>
          </div>
          <PreparationCards />
        </section>

        <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[4px] border bg-card">
          <div className="relative shrink-0 border-b p-1.5">
            <Search className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="h-9 pl-9" placeholder="Buscar por código de barras o descripción" />
          </div>
          <div className="min-h-0 flex-1 overflow-auto">
            <Table className="min-w-[920px]">
              <TableHeader className="sticky top-0 bg-muted/95">
                <TableRow>
                  <TableHead>Artículo</TableHead><TableHead>Cuenta</TableHead><TableHead>Unidad</TableHead><TableHead>Cantidad</TableHead><TableHead>Precio unit.</TableHead><TableHead>Dto. %</TableHead><TableHead>IVA</TableHead><TableHead className="text-right">Importe</TableHead><TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell><strong>Abono Pro · Agosto 2026</strong><div className="font-mono text-[10px] text-muted-foreground">ABONO-PRO</div></TableCell>
                  <TableCell>Abono mensual</TableCell>
                  <TableCell className="font-mono">UN</TableCell>
                  <TableCell><Input type="number" min={1} value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} className="h-8 w-20 text-right" /></TableCell>
                  <TableCell><Input type="number" value={price} onChange={(event) => setPrice(Number(event.target.value))} className="h-8 w-28 text-right" /></TableCell>
                  <TableCell><Input type="number" value={discount} onChange={(event) => setDiscount(Number(event.target.value))} className="h-8 w-20 text-right" /></TableCell>
                  <TableCell className="text-right font-mono">21%</TableCell>
                  <TableCell className="text-right font-mono font-semibold">{money(total)}</TableCell>
                  <TableCell><Button variant="ghost" size="icon-sm"><Trash2 /></Button></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </section>
      </div>

      <SheetFooter className="shrink-0 flex-row items-center gap-4 border-t bg-card px-4 py-2.5">
        <div className="hidden flex-1 grid-cols-3 gap-4 lg:grid">
          <Metric label="Neto" value={money(net)} /><Metric label="IVA 21 %" value={money(vat)} /><Metric label="Total" value={money(total)} />
        </div>
        <Button variant="ghost" onClick={onClose}>Cancelar</Button>
        <Button variant="outline"><Save />Guardar borrador</Button>
        <Button variant="outline"><Eye />Vista previa</Button>
        <Button onClick={onCommit}><Send />Emitir factura</Button>
      </SheetFooter>
    </>
  )
}

function TakeoverVariant({
  partyLabel,
  onClose,
  quantity,
  setQuantity,
  price,
  setPrice,
  discount,
  setDiscount,
  net,
  vat,
  total,
  onCommit,
}: PrototypeVariantProps) {
  const [active, setActive] = useState(1)

  return (
    <>
      <SheetHeader className="shrink-0 border-b px-5 py-3 pr-14">
        <div className="flex items-center gap-2">
          <SheetTitle className="text-lg">Nueva factura de venta</SheetTitle>
          <Badge variant="outline" className="font-mono text-[10px]">Prototipo · takeover</Badge>
        </div>
        <SheetDescription>El drawer conserva el origen en Documentos, pero funciona como un workspace dedicado.</SheetDescription>
      </SheetHeader>

      <div className="grid min-h-0 flex-1 bg-background lg:grid-cols-[230px_minmax(0,1fr)]">
        <aside className="hidden border-r bg-muted/20 p-3 lg:flex lg:flex-col">
          <div className="mb-4 rounded-[4px] border bg-card p-3">
            <div className="font-mono text-[9px] uppercase text-muted-foreground">Borrador actual</div>
            <strong className="mt-1 block">Factura A</strong>
            <span className="text-xs text-muted-foreground">Almacén San Martín SRL</span>
          </div>
          <nav className="grid gap-1">
            {steps.map((label, index) => (
              <button
                key={label}
                type="button"
                onClick={() => setActive(index)}
                className={cn("flex items-center gap-2 rounded-[4px] px-3 py-2.5 text-left text-sm", active === index ? "bg-card font-semibold shadow-sm ring-1 ring-border" : "text-muted-foreground hover:bg-card/70")}
              >
                {index < active ? <CheckCircle2 className="size-4 text-emerald-600" /> : <span className="grid size-4 place-items-center rounded-full border font-mono text-[9px]">{index + 1}</span>}
                {label}
              </button>
            ))}
          </nav>
          <div className="mt-auto rounded-[4px] border bg-card p-3">
            <Metric label="Total actual" value={money(total)} />
            <div className="mt-2 text-[10px] text-amber-700">2 definiciones pendientes</div>
          </div>
        </aside>

        <main className="min-h-0 overflow-y-auto p-4">
          <div className="mx-auto grid max-w-6xl gap-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold">Composición completa</h3>
                <p className="text-xs text-muted-foreground">Todos los bloques permanecen accesibles; el rail indica el foco actual.</p>
              </div>
              <Badge variant="outline" className="font-mono text-[10px]">Perfil · completo</Badge>
            </div>

            <section className={cn("rounded-[4px] border bg-card p-4", active === 0 && "ring-2 ring-primary/35")} onClick={() => setActive(0)}>
              <div className="mb-3 flex items-center justify-between border-b pb-2"><strong>Cabecera</strong><Badge variant="outline">6 campos visibles</Badge></div>
              <HeaderFields partyLabel={partyLabel} />
            </section>

            <section className={cn("rounded-[4px] border bg-card p-3", active === 2 && "ring-2 ring-primary/35")} onClick={() => setActive(2)}>
              <div className="mb-2 flex items-center justify-between"><strong>Preparación</strong><span className="text-xs text-muted-foreground">3 de 5 definidos</span></div>
              <PreparationCards />
            </section>

            <section className={cn("grid gap-3 rounded-[4px] border bg-card p-3", active === 1 && "ring-2 ring-primary/35")} onClick={() => setActive(1)}>
              <div className="relative">
                <PackageSearch className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input className="h-10 pl-9" placeholder="Buscar y agregar artículo" />
              </div>
              <ItemCard {...{ quantity, setQuantity, price, setPrice, discount, setDiscount }} />
            </section>

            <section className={cn("rounded-[4px] border bg-card p-4", active === 3 && "ring-2 ring-primary/35")} onClick={() => setActive(3)}>
              <div className="grid gap-3 sm:grid-cols-3"><Metric label="Neto" value={money(net)} /><Metric label="IVA 21 %" value={money(vat)} /><Metric label="Total" value={money(total)} /></div>
            </section>
          </div>
        </main>
      </div>

      <SheetFooter className="shrink-0 flex-row items-center justify-end border-t bg-card px-5 py-3">
        <Button variant="ghost" onClick={onClose}>Cancelar</Button>
        <Button variant="outline"><Save />Guardar borrador</Button>
        <Button onClick={onCommit}><Send />Emitir factura</Button>
      </SheetFooter>
    </>
  )
}

type PrototypeVariantProps = {
  partyLabel: string
  onClose: () => void
  quantity: number
  setQuantity: (value: number) => void
  price: number
  setPrice: (value: number) => void
  discount: number
  setDiscount: (value: number) => void
  net: number
  vat: number
  total: number
  onCommit: () => void
}

export function InvoiceDrawerPrototype({
  context,
  onClose,
  embedded = false,
}: {
  context: CommercialContext
  onClose: () => void
  embedded?: boolean
}) {
  const [variant, setVariant] = useState<InvoiceDrawerVariant>(readVariant)
  const [quantity, setQuantity] = useState(1)
  const [price, setPrice] = useState(589_069)
  const [discount, setDiscount] = useState(30)
  const [notice, setNotice] = useState("")

  const totals = useMemo(() => {
    const net = quantity * price * (1 - discount / 100)
    const vat = net * 0.21
    return { net, vat, total: net + vat }
  }, [discount, price, quantity])

  const changeVariant = (next: InvoiceDrawerVariant) => {
    setVariant(next)
    const url = new URL(window.location.href)
    url.searchParams.set("variant", next)
    window.history.replaceState(window.history.state, "", url)
  }

  const common: PrototypeVariantProps = {
    partyLabel: context === "purchase" ? "Proveedor" : "Cliente",
    onClose,
    quantity,
    setQuantity,
    price,
    setPrice,
    discount,
    setDiscount,
    ...totals,
    onCommit: () => {
      setNotice("Emisión simulada: este prototipo no genera efectos reales.")
      window.setTimeout(() => setNotice(""), 2800)
    },
  }

  const widthClass =
    variant === "compact"
      ? "w-[min(96vw,880px)] sm:max-w-none md:w-[54vw] md:min-w-[720px]"
      : variant === "wide"
        ? "w-[96vw] sm:max-w-none md:min-w-[96vw] xl:w-[78vw] xl:min-w-[78vw]"
        : "w-[98vw] sm:max-w-none md:min-w-[98vw]"

  return (
    <>
      <Sheet open modal={!embedded} onOpenChange={(open) => !open && onClose()}>
        <SheetContent
          inline={embedded}
          className={cn(
            embedded ? "min-h-0 min-w-0 flex-1 gap-0 border-t p-0 xl:border-t-0 xl:border-l" : widthClass,
            !embedded && "gap-0 p-0"
          )}
        >
          {variant === "compact" ? <CompactVariant {...common} /> : null}
          {variant === "wide" ? <WideVariant {...common} /> : null}
          {variant === "takeover" ? <TakeoverVariant {...common} /> : null}
          <PrototypeSwitcher current={variant} options={variants} onChange={changeVariant} />
        </SheetContent>
      </Sheet>

      {notice ? (
        <div role="status" className="fixed right-4 bottom-4 z-[100] flex items-center gap-2 rounded-[4px] border bg-popover px-3 py-2 text-xs shadow-xl">
          <Check className="size-4 text-emerald-600" /> {notice}
        </div>
      ) : null}
    </>
  )
}
