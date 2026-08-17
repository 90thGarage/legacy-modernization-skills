"use client"

import {
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react"
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  Camera,
  Check,
  CircleDollarSign,
  CreditCard,
  Landmark,
  Minus,
  Plus,
  ReceiptText,
  RotateCcw,
  Scale,
  Search,
  Smartphone,
  Split,
  Star,
  Trash2,
  UserPlus,
  WalletCards,
} from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import {
  favoriteProductIds,
  initialTicket,
  money,
  paymentMethods,
  sellers,
} from "../mock-data"
import type {
  Customer,
  PaymentMethodName,
  PaymentRow,
  POSColumnKey,
  POSLayout,
  Product,
  TicketItem,
} from "../types"
import { Field, Metric } from "./shared"

const posViewOptions: Array<{ value: POSLayout; label: string }> = [
  { value: "header-grid", label: "A · Cabecera" },
  { value: "bottom-bar", label: "B · Minimalista" },
  { value: "receipt-book", label: "C · Talonario" },
]

function makePaymentRow(method: PaymentMethodName, amount: number): PaymentRow {
  return {
    id: `payment-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    method,
    amount,
    card: "",
    installments: "1 cuota",
    batch: "",
    coupon: "",
    authorization: "",
    reference: "",
  }
}

function PaymentMethodSelect({
  value,
  onValueChange,
}: {
  value: PaymentMethodName
  onValueChange: (value: PaymentMethodName) => void
}) {
  return (
    <Select value={value} onValueChange={(value) => onValueChange(value as PaymentMethodName)}>
      <SelectTrigger className="h-9 w-full rounded-[4px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {paymentMethods.map((method) => (
          <SelectItem key={method} value={method}>
            {method}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function PaymentMethodIcon({ method }: { method: PaymentMethodName }) {
  if (method === "Efectivo") return <Banknote />
  if (method === "Tarjeta") return <CreditCard />
  if (method === "Transferencia") return <Landmark />
  if (method === "Mercado Pago") return <Smartphone />
  return <WalletCards />
}

function PaymentDetailsFields({
  row,
  touch = false,
  onUpdate,
}: {
  row: PaymentRow
  touch?: boolean
  onUpdate: (patch: Partial<PaymentRow>) => void
}) {
  const fieldHeight = touch ? "h-11" : "h-9"
  const needsCard = row.method === "Tarjeta" || row.method === "PayWay"
  const needsReference =
    row.method === "Transferencia" || row.method === "Mercado Pago"

  if (needsCard) {
    return (
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Tarjeta / Procesador" required>
          <Select value={row.card} onValueChange={(value) => onUpdate({ card: value })}>
            <SelectTrigger className={cn("w-full rounded-[4px]", fieldHeight)}>
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Visa">Visa</SelectItem>
              <SelectItem value="Mastercard">Mastercard</SelectItem>
              <SelectItem value="Cabal">Cabal</SelectItem>
              <SelectItem value="PayWay">PayWay</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Plan / Cuotas" required>
          <Select value={row.installments} onValueChange={(value) => onUpdate({ installments: value })}>
            <SelectTrigger className={cn("w-full rounded-[4px]", fieldHeight)}><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="1 cuota">1 cuota</SelectItem>
              <SelectItem value="3 cuotas">3 cuotas</SelectItem>
              <SelectItem value="6 cuotas">6 cuotas</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Autorizacion" required>
          <Input value={row.authorization} onChange={(event) => onUpdate({ authorization: event.target.value })} className={cn("rounded-[4px] font-mono", fieldHeight)} />
        </Field>
        <Field label="Lote">
          <Input value={row.batch} onChange={(event) => onUpdate({ batch: event.target.value })} className={cn("rounded-[4px] font-mono", fieldHeight)} />
        </Field>
        <Field label="Cupon">
          <Input value={row.coupon} onChange={(event) => onUpdate({ coupon: event.target.value })} className={cn("rounded-[4px] font-mono", fieldHeight)} />
        </Field>
      </div>
    )
  }

  if (needsReference) {
    return (
      <Field label="Referencia / Autorizacion" required>
        <Input value={row.reference} onChange={(event) => onUpdate({ reference: event.target.value })} className={cn("rounded-[4px] font-mono", fieldHeight)} />
      </Field>
    )
  }

  return null
}

type TouchPaymentSelection = PaymentMethodName | "Mixto" | null

function TouchPaymentButtons({
  selected,
  onSelect,
  includeMixed = true,
}: {
  selected: TouchPaymentSelection
  onSelect: (method: PaymentMethodName | "Mixto") => void
  includeMixed?: boolean
}) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {paymentMethods.map((method) => (
        <Button
          key={method}
          type="button"
          variant="outline"
          aria-pressed={selected === method}
          className={cn(
            "h-16 flex-col gap-1 rounded-[4px] text-xs sm:h-20 sm:text-sm",
            selected === method && "border-primary bg-primary/5 text-primary ring-1 ring-primary"
          )}
          onClick={() => onSelect(method)}
        >
          <PaymentMethodIcon method={method} />
          {method}
        </Button>
      ))}
      {includeMixed ? (
        <Button
          type="button"
          variant="outline"
          aria-pressed={selected === "Mixto"}
          className={cn(
            "h-16 flex-col gap-1 rounded-[4px] border-dashed text-xs sm:h-20 sm:text-sm",
            selected === "Mixto" && "border-primary bg-primary/5 text-primary ring-1 ring-primary"
          )}
          onClick={() => onSelect("Mixto")}
        >
          <Split />
          Pago mixto
        </Button>
      ) : null}
    </div>
  )
}

function PaymentDialog({
  open,
  total,
  initialMethod,
  purpose,
  onOpenChange,
  onComplete,
}: {
  open: boolean
  total: number
  initialMethod: PaymentMethodName
  purpose: "sale" | "exchange"
  onOpenChange: (open: boolean) => void
  onComplete: (rows: PaymentRow[]) => void
}) {
  const [view, setView] = useState<"touch" | "classic">("touch")
  const [touchStep, setTouchStep] = useState<"method" | "details">("method")
  const [touchSelection, setTouchSelection] = useState<TouchPaymentSelection>(null)
  const [rows, setRows] = useState<PaymentRow[]>(() => [
    makePaymentRow(initialMethod, total),
  ])

  const paid = rows.reduce((sum, row) => sum + (Number(row.amount) || 0), 0)
  const remaining = Math.max(0, total - paid)
  const cashPaid = rows
    .filter((row) => row.method === "Efectivo")
    .reduce((sum, row) => sum + row.amount, 0)
  const change = Math.max(0, paid - total)

  const rowIsComplete = (row: PaymentRow) => {
    if (!(row.amount > 0)) return false
    if (row.method === "Tarjeta" || row.method === "PayWay") {
      return Boolean(row.card && row.installments && row.authorization)
    }
    if (row.method === "Transferencia" || row.method === "Mercado Pago") {
      return Boolean(row.reference)
    }
    return true
  }
  const canConfirm =
    rows.length > 0 &&
    remaining < 0.01 &&
    rows.every(rowIsComplete) &&
    (view === "classic" || (touchSelection !== null && touchStep === "details")) &&
    (view !== "touch" || touchSelection !== "Mixto" || rows.length >= 2)

  const updateRow = <K extends keyof PaymentRow>(
    id: string,
    key: K,
    value: PaymentRow[K]
  ) => {
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, [key]: value } : row))
    )
  }

  const patchRow = (id: string, patch: Partial<PaymentRow>) => {
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, ...patch } : row))
    )
  }

  const selectTouchPayment = (selection: PaymentMethodName | "Mixto") => {
    setTouchSelection(selection)
    setTouchStep("details")
    if (selection === "Mixto") {
      setRows([])
      return
    }
    setRows([makePaymentRow(selection, total)])
  }

  const switchView = (nextView: "touch" | "classic") => {
    setView(nextView)
    if (nextView === "classic" && rows.length === 0) {
      setRows([makePaymentRow(initialMethod, total)])
    }
    if (nextView === "touch" && rows.length > 0) {
      setTouchSelection(rows.length > 1 ? "Mixto" : rows[0].method)
      setTouchStep("details")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-dvh max-h-dvh w-screen max-w-none grid-rows-[auto_minmax(0,1fr)_auto] rounded-none sm:h-auto sm:max-h-[92dvh] sm:w-[min(96vw,900px)] sm:rounded-[4px] sm:max-w-none">
        <DialogHeader className="pr-12">
          <DialogTitle>
            {purpose === "exchange" ? "Cobrar diferencia del cambio" : "Confirmar cobro"}
          </DialogTitle>
          <DialogDescription>
            Completa los medios de pago antes de emitir el comprobante.
          </DialogDescription>
          <div className="mt-3 grid w-full max-w-72 grid-cols-2 rounded-[4px] border bg-muted/60 p-1">
            <button
              type="button"
              className={cn("h-8 rounded-[3px] px-3 text-xs font-medium", view === "touch" && "bg-card text-foreground shadow-sm")}
              aria-pressed={view === "touch"}
              onClick={() => switchView("touch")}
            >
              Vista tactil
            </button>
            <button
              type="button"
              className={cn("h-8 rounded-[3px] px-3 text-xs font-medium", view === "classic" && "bg-card text-foreground shadow-sm")}
              aria-pressed={view === "classic"}
              onClick={() => switchView("classic")}
            >
              Vista clasica
            </button>
          </div>
        </DialogHeader>

        <div className="min-h-0 overflow-y-auto px-5 pb-1">
          {view === "touch" ? (
            <div className="overflow-hidden py-4">
              <div
                className={cn(
                  "flex w-[200%] items-start transition-transform duration-300 ease-out motion-reduce:transition-none",
                  touchStep === "details" && "-translate-x-1/2"
                )}
              >
                <section className="w-1/2 shrink-0 pr-2">
                  <div className="mb-4">
                    <h3 className="text-base font-semibold">¿Como paga?</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Selecciona un medio para continuar.
                    </p>
                  </div>
                  <TouchPaymentButtons selected={touchSelection} onSelect={selectTouchPayment} />
                </section>

                <section className="w-1/2 shrink-0 pl-2">
                  <Button
                    type="button"
                    variant="ghost"
                    className="mb-3 -ml-3 h-9 rounded-[4px]"
                    onClick={() => setTouchStep("method")}
                  >
                    <ArrowLeft /> Cambiar medio de pago
                  </Button>

                  {touchSelection && touchSelection !== "Mixto" && rows[0] ? (
                    <section className="rounded-[4px] border bg-card p-4">
                      <div className="grid items-end gap-4 sm:grid-cols-[minmax(0,1fr)_220px]">
                        <div>
                          <div className="font-mono text-[10px] font-semibold uppercase text-muted-foreground">
                            Medio seleccionado
                          </div>
                          <div className="mt-2 flex items-center gap-2 text-base font-semibold">
                            <PaymentMethodIcon method={rows[0].method} />
                            {rows[0].method}
                          </div>
                        </div>
                        <Field label={rows[0].method === "Efectivo" ? "Importe recibido" : "Monto"}>
                          <Input
                            type="number"
                            min="0"
                            value={rows[0].amount}
                            onChange={(event) => patchRow(rows[0].id, { amount: Number(event.target.value) })}
                            className="h-12 rounded-[4px] text-right font-mono text-lg"
                          />
                        </Field>
                      </div>
                      {rows[0].method !== "Efectivo" ? (
                        <div className="mt-4 border-t pt-4">
                          <PaymentDetailsFields row={rows[0]} touch onUpdate={(patch) => patchRow(rows[0].id, patch)} />
                        </div>
                      ) : null}
                    </section>
                  ) : null}

                  {touchSelection === "Mixto" ? (
                    <section className="rounded-[4px] border bg-card p-4">
                      <div className="mb-4 flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-sm font-semibold">Pago mixto</h3>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Cada medio nuevo toma automaticamente el importe restante.
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-right">
                          <Metric label="Pagado" value={money(paid)} />
                          <Metric label="Restante" value={money(remaining)} strong />
                        </div>
                      </div>

                      <div className="grid gap-3">
                        {rows.map((row, index) => (
                          <section key={row.id} className="rounded-[4px] border bg-muted/20 p-3">
                            <div className="grid items-end gap-3 sm:grid-cols-[minmax(0,1fr)_200px_40px]">
                              <div className="flex min-h-11 items-center gap-2 text-sm font-semibold">
                                <PaymentMethodIcon method={row.method} />
                                {index + 1}. {row.method}
                              </div>
                              <Field label="Monto">
                                <Input
                                  type="number"
                                  min="0"
                                  value={row.amount}
                                  onChange={(event) => patchRow(row.id, { amount: Number(event.target.value) })}
                                  className="h-11 rounded-[4px] text-right font-mono"
                                />
                              </Field>
                              <Button
                                variant="ghost"
                                size="icon-lg"
                                aria-label={`Eliminar ${row.method}`}
                                onClick={() => setRows((current) => current.filter((candidate) => candidate.id !== row.id))}
                              >
                                <Trash2 />
                              </Button>
                            </div>
                            {row.method !== "Efectivo" ? (
                              <div className="mt-3 border-t pt-3">
                                <PaymentDetailsFields row={row} touch onUpdate={(patch) => patchRow(row.id, patch)} />
                              </div>
                            ) : null}
                          </section>
                        ))}
                      </div>

                      <div className="mt-4 border-t pt-4">
                        {rows.length === 0 || remaining > 0.01 ? (
                          <>
                            <p className="mb-3 text-xs font-medium">
                              {rows.length ? `Agregar medio por ${money(remaining)}` : "Elegir primer medio"}
                            </p>
                            <TouchPaymentButtons
                              selected={null}
                              includeMixed={false}
                              onSelect={(method) => {
                                if (method === "Mixto") return
                                setRows((current) => [...current, makePaymentRow(method, remaining)])
                              }}
                            />
                          </>
                        ) : rows.length < 2 ? (
                          <p className="text-xs text-muted-foreground">
                            Modifica el monto del primer medio para asignar el saldo restante a otro.
                          </p>
                        ) : (
                          <div className="flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-400">
                            <Check /> Pago distribuido por completo
                          </div>
                        )}
                      </div>
                    </section>
                  ) : null}
                </section>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 border-b pb-4 sm:grid-cols-4">
                <Metric label="Total" value={money(total)} strong />
                <Metric label="Pagado" value={money(paid)} strong />
                <Metric label="Restante" value={money(remaining)} strong />
                <Metric label="Vuelto" value={money(change)} strong />
              </div>

              <div className="grid gap-3 py-4">
                {rows.map((row, index) => (
                  <section key={row.id} className="rounded-[4px] border bg-card p-3">
                    <div className="grid items-end gap-3 sm:grid-cols-[1fr_160px_32px]">
                      <Field label={`Medio ${index + 1}`}>
                        <PaymentMethodSelect value={row.method} onValueChange={(value) => updateRow(row.id, "method", value)} />
                      </Field>
                      <Field label="Monto">
                        <Input
                          type="number"
                          min="0"
                          value={row.amount}
                          onChange={(event) => updateRow(row.id, "amount", Number(event.target.value))}
                          className="h-9 rounded-[4px] text-right font-mono"
                        />
                      </Field>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={rows.length === 1}
                        aria-label="Eliminar medio de pago"
                        onClick={() => setRows((current) => current.filter((candidate) => candidate.id !== row.id))}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                    {row.method !== "Efectivo" ? (
                      <div className="mt-3 border-t pt-3">
                        <PaymentDetailsFields row={row} onUpdate={(patch) => patchRow(row.id, patch)} />
                      </div>
                    ) : null}
                  </section>
                ))}

                <Button
                  variant="outline"
                  className="justify-start rounded-[4px] border-dashed"
                  onClick={() => setRows((current) => [...current, makePaymentRow("Transferencia", remaining)])}
                >
                  <Plus /> Agregar otro medio de pago
                </Button>
              </div>
            </>
          )}

          {view === "touch" && touchStep === "details" && touchSelection === "Mixto" && rows.length < 2 ? (
            <Alert className="mb-4 rounded-[4px] border-amber-500/50 bg-amber-500/5">
              <Split className="text-amber-600" />
              <AlertTitle>Agrega al menos dos medios de pago</AlertTitle>
              <AlertDescription>
                Si el primero cubre el total, reduce su monto para habilitar el saldo restante.
              </AlertDescription>
            </Alert>
          ) : view === "touch" && touchStep === "details" && !canConfirm ? (
            <Alert className="mb-4 rounded-[4px] border-amber-500/50 bg-amber-500/5">
              <CircleDollarSign className="text-amber-600" />
              <AlertTitle>El cobro todavia no esta completo</AlertTitle>
              <AlertDescription>
                {remaining > 0.01
                  ? `Falta asignar ${money(remaining)}.`
                  : "Completa los datos requeridos del medio de pago."}
              </AlertDescription>
            </Alert>
          ) : view === "classic" && !canConfirm ? (
            <Alert className="mb-4 rounded-[4px] border-amber-500/50 bg-amber-500/5">
              <CircleDollarSign className="text-amber-600" />
              <AlertTitle>El cobro todavia no esta completo</AlertTitle>
              <AlertDescription>
                {remaining > 0.01
                  ? `Falta asignar ${money(remaining)}.`
                  : "Completa los datos requeridos del medio de pago."}
              </AlertDescription>
            </Alert>
          ) : cashPaid > total ? (
            <Alert className="mb-4 rounded-[4px] border-emerald-600/35 bg-emerald-600/5">
              <Banknote className="text-emerald-600" />
              <AlertTitle>Entregar vuelto</AlertTitle>
              <AlertDescription>{money(change)} en efectivo.</AlertDescription>
            </Alert>
          ) : null}
        </div>

        {view === "touch" ? (
          <DialogFooter className="block">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="font-mono text-[10px] font-semibold uppercase text-muted-foreground">
                  Total a cobrar
                </div>
                <strong className="font-mono text-2xl">{money(total)}</strong>
                {change > 0 ? (
                  <div className="mt-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                    Vuelto: {money(change)}
                  </div>
                ) : null}
              </div>
              <div className="flex flex-col-reverse gap-2 sm:flex-row">
                <Button className="h-11" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancelar
                </Button>
                <Button className="h-11" disabled={!canConfirm} onClick={() => onComplete(rows)}>
                  <ReceiptText /> Confirmar y facturar
                </Button>
              </div>
            </div>
          </DialogFooter>
        ) : (
          <DialogFooter>
            <Button className="h-11" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button className="h-11" disabled={!canConfirm} onClick={() => onComplete(rows)}>
              <ReceiptText /> Confirmar y facturar
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}

function CustomerQuickCreate({
  open,
  onOpenChange,
  onSave,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (customer: Customer) => void
}) {
  const [name, setName] = useState("")
  const [vatCategory, setVatCategory] = useState("Consumidor final")
  const [documentType, setDocumentType] = useState("DNI")
  const [document, setDocument] = useState("")
  const [taxTreatment, setTaxTreatment] = useState<Customer["taxTreatment"]>("Exento")
  const [saleCondition, setSaleCondition] = useState("Efectivo")
  const requiresDocument = vatCategory !== "Consumidor final"
  const valid = Boolean(name && (!requiresDocument || document))

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[min(96vw,820px)] gap-0 p-0 sm:max-w-none md:w-[46vw] md:min-w-[720px]">
        <SheetHeader className="border-b px-5 py-4">
          <SheetTitle>Crear cliente desde POS</SheetTitle>
          <SheetDescription>
            El ticket y sus precios se conservan mientras completas el alta minima.
          </SheetDescription>
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nombre o razon social" required className="sm:col-span-2">
              <Input value={name} onChange={(event) => setName(event.target.value)} className="h-10 rounded-[4px]" autoFocus />
            </Field>
            <Field label="Categoria IVA" required>
              <Select value={vatCategory} onValueChange={setVatCategory}>
                <SelectTrigger className="h-10 w-full rounded-[4px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Consumidor final">Consumidor final</SelectItem>
                  <SelectItem value="Responsable inscripto">Responsable inscripto</SelectItem>
                  <SelectItem value="Monotributista">Monotributista</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Tipo de documento" required>
              <Select value={documentType} onValueChange={setDocumentType}>
                <SelectTrigger className="h-10 w-full rounded-[4px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="DNI">DNI</SelectItem>
                  <SelectItem value="CUIT">CUIT</SelectItem>
                  <SelectItem value="CUIL">CUIL</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="CUIT / CUIL / Documento" required={requiresDocument} hint={requiresDocument ? undefined : "Opcional para consumidor final"}>
              <Input value={document} onChange={(event) => setDocument(event.target.value)} className="h-10 rounded-[4px] font-mono" />
            </Field>
            <Field label="Condicion de venta" required>
              <Select value={saleCondition} onValueChange={setSaleCondition}>
                <SelectTrigger className="h-10 w-full rounded-[4px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Efectivo">Efectivo</SelectItem>
                  <SelectItem value="Cuenta corriente">Cuenta corriente</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Tratamiento de impuestos" required className="sm:col-span-2">
              <Select value={taxTreatment} onValueChange={(value) => setTaxTreatment(value as Customer["taxTreatment"])}>
                <SelectTrigger className="h-10 w-full rounded-[4px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Exento">Exento</SelectItem>
                  <SelectItem value="Con impuestos">Con impuestos</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>
          {!valid ? (
            <p className="mt-4 text-xs text-amber-700 dark:text-amber-400">
              Completa el nombre{requiresDocument ? " y el documento fiscal" : ""} para guardar.
            </p>
          ) : null}
        </div>
        <SheetFooter className="flex-row border-t bg-card px-5 py-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button
            className="ml-auto"
            disabled={!valid}
            onClick={() => {
              onSave({
                id: `c-pos-${Date.now()}`,
                code: `C-${Math.floor(500 + Math.random() * 400)}`,
                name,
                documentType,
                document,
                vatCategory,
                saleCondition,
                taxTreatment,
                priceList: vatCategory === "Responsable inscripto" ? "Mayorista" : "Publico",
                phone: "",
                email: "",
                address: "",
                active: true,
              })
              setName("")
              setDocument("")
            }}
          >
            <Check /> Guardar y seleccionar
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

type CashMovement = {
  id: string
  time: string
  type: "Apertura" | "Ingreso" | "Retiro" | "Venta"
  description: string
  amount: number
}

type ExchangeItem = {
  id: string
  productId: string
  quantity: number
}

function CashMovementDialog({
  open,
  currentBalance,
  onOpenChange,
  onSave,
}: {
  open: boolean
  currentBalance: number
  onOpenChange: (open: boolean) => void
  onSave: (movement: Omit<CashMovement, "id" | "time">) => void
}) {
  const [type, setType] = useState<"Ingreso" | "Retiro">("Ingreso")
  const [amount, setAmount] = useState("")
  const [reason, setReason] = useState("")
  const [notes, setNotes] = useState("")
  const signedAmount = (type === "Ingreso" ? 1 : -1) * Number(amount || 0)
  const resultingBalance = currentBalance + signedAmount
  const valid = Number(amount) > 0 && reason.trim().length > 2 && resultingBalance >= 0

  const reset = () => {
    setType("Ingreso")
    setAmount("")
    setReason("")
    setNotes("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[min(94vw,600px)] sm:max-w-none">
        <DialogHeader>
          <DialogTitle>Movimiento de caja</DialogTitle>
          <DialogDescription>
            Registra un ingreso o retiro de efectivo dentro del turno actual.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 px-5 pb-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Tipo de movimiento" required>
              <Select value={type} onValueChange={(value) => setType(value as "Ingreso" | "Retiro")}>
                <SelectTrigger className="h-10 w-full rounded-[4px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ingreso">Ingreso</SelectItem>
                  <SelectItem value="Retiro">Retiro</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Monto" required>
              <div className="relative">
                <span className="absolute top-1/2 left-3 -translate-y-1/2 font-mono text-muted-foreground">$</span>
                <Input
                  type="number"
                  min="0"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  className="h-10 rounded-[4px] pl-7 text-right font-mono"
                  autoFocus
                />
              </div>
            </Field>
          </div>
          <Field label="Motivo" required>
            <Input
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder={type === "Ingreso" ? "Ej. Reposicion de efectivo" : "Ej. Retiro a tesoreria"}
              className="h-10 rounded-[4px]"
            />
          </Field>
          <Field label="Observaciones">
            <Textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Detalle opcional para auditoria"
              className="min-h-20 rounded-[4px]"
            />
          </Field>
          <div className="grid grid-cols-2 gap-4 rounded-[4px] border bg-muted/40 p-3">
            <Metric label="Saldo actual" value={money(currentBalance)} />
            <Metric label="Saldo resultante" value={money(resultingBalance)} strong />
          </div>
          {resultingBalance < 0 ? (
            <p className="text-xs text-destructive">El retiro supera el saldo disponible de la caja.</p>
          ) : null}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button
            disabled={!valid}
            onClick={() => {
              onSave({
                type,
                description: notes.trim() ? `${reason.trim()} · ${notes.trim()}` : reason.trim(),
                amount: signedAmount,
              })
              reset()
            }}
          >
            <Check /> Registrar movimiento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ExchangeDialog({
  open,
  products,
  onOpenChange,
  onPositive,
  onResolved,
}: {
  open: boolean
  products: Product[]
  onOpenChange: (open: boolean) => void
  onPositive: (amount: number) => void
  onResolved: (message: string) => void
}) {
  const [incoming, setIncoming] = useState<ExchangeItem[]>([
    { id: "exchange-in-41", productId: "p-41", quantity: 1 },
  ])
  const [outgoing, setOutgoing] = useState<ExchangeItem[]>([
    { id: "exchange-out-40", productId: "p-40", quantity: 1 },
  ])
  const [incomingSearch, setIncomingSearch] = useState("")
  const [outgoingSearch, setOutgoingSearch] = useState("")
  const productMap = new Map(products.map((product) => [product.id, product]))
  const totalFor = (items: ExchangeItem[]) => items.reduce((sum, item) => {
    const product = productMap.get(item.productId)
    return sum + (product?.salePrice ?? 0) * item.quantity
  }, 0)
  const incomingTotal = totalFor(incoming)
  const outgoingTotal = totalFor(outgoing)
  const balance = outgoingTotal - incomingTotal
  const hasItems = incoming.length > 0 && outgoing.length > 0

  const addFromSearch = (
    query: string,
    items: ExchangeItem[],
    setItems: Dispatch<SetStateAction<ExchangeItem[]>>,
    clear: () => void
  ) => {
    const normalized = query.trim().toLocaleLowerCase("es")
    if (!normalized) return
    const product = products.find((candidate) =>
      candidate.active && candidate.salePrice !== null && (
        candidate.code.toLocaleLowerCase("es") === normalized ||
        candidate.barcode.toLocaleLowerCase("es") === normalized ||
        candidate.name.toLocaleLowerCase("es").includes(normalized)
      )
    )
    if (!product) return
    const existing = items.find((item) => item.productId === product.id)
    setItems((current) => existing
      ? current.map((item) => item.id === existing.id ? { ...item, quantity: item.quantity + 1 } : item)
      : [...current, { id: `exchange-${Date.now()}-${product.id}`, productId: product.id, quantity: 1 }]
    )
    clear()
  }

  const resolve = () => {
    if (balance > 0) {
      onPositive(balance)
    } else if (balance === 0) {
      onResolved("Cambio equilibrado confirmado sin cobro adicional.")
    } else {
      onResolved(`Comprobante negativo preparado por ${money(Math.abs(balance))}.`)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[min(98vw,1120px)] sm:max-w-none">
        <DialogHeader>
          <DialogTitle>Cambio rapido de mercaderia</DialogTitle>
          <DialogDescription>
            Separa lo que devuelve el cliente de lo que se lleva.
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-0 overflow-y-auto px-5 pb-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {[
              { title: "Entrada (Devuelve el Cliente)", items: incoming, setItems: setIncoming, search: incomingSearch, setSearch: setIncomingSearch, total: incomingTotal },
              { title: "Salida (Lleva el Cliente)", items: outgoing, setItems: setOutgoing, search: outgoingSearch, setSearch: setOutgoingSearch, total: outgoingTotal },
            ].map((section) => (
              <section key={section.title} className="overflow-hidden rounded-[4px] border bg-card">
                <div className="border-b p-3">
                  <h3 className="text-sm font-semibold">{section.title}</h3>
                  <div className="relative mt-2">
                    <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={section.search}
                      onChange={(event) => section.setSearch(event.target.value)}
                      onKeyDown={(event) => event.key === "Enter" && addFromSearch(section.search, section.items, section.setItems, () => section.setSearch(""))}
                      className="h-9 rounded-[4px] pr-20 pl-9"
                      placeholder="Descripcion, codigo o barra"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-1/2 right-1 h-7 -translate-y-1/2 rounded-[4px]"
                      onClick={() => addFromSearch(section.search, section.items, section.setItems, () => section.setSearch(""))}
                    >
                      Agregar
                    </Button>
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="grid grid-cols-[minmax(0,1fr)_64px_88px_96px_28px] items-center gap-2 border-b px-3 py-2 text-sm font-medium">
                    <span>Articulo</span>
                    <span className="text-right">Cant.</span>
                    <span className="text-right">Precio</span>
                    <span className="text-right">Importe</span>
                    <span className="sr-only">Acciones</span>
                  </div>
                  {section.items.map((item) => {
                    const product = productMap.get(item.productId)
                    if (!product) return null
                    const unitPrice = product.salePrice ?? 0
                    return (
                      <div
                        key={item.id}
                        className="grid min-w-0 grid-cols-[minmax(0,1fr)_64px_88px_96px_28px] items-center gap-2 border-b px-3 py-2"
                      >
                        <div className="min-w-0">
                          <div className="line-clamp-2 text-sm font-medium leading-4">{product.name}</div>
                          <div className="mt-0.5 truncate font-mono text-[10px] text-muted-foreground">{product.code} · IVA {product.vat}</div>
                        </div>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(event) => section.setItems((current) => current.map((candidate) => candidate.id === item.id ? { ...candidate, quantity: Math.max(1, Number(event.target.value)) } : candidate))}
                          className="h-8 w-16 rounded-[4px] text-right font-mono text-xs"
                        />
                        <span className="min-w-0 truncate text-right font-mono text-[11px]">{money(unitPrice)}</span>
                        <span className="min-w-0 truncate text-right font-mono text-[11px] font-semibold">{money(unitPrice * item.quantity)}</span>
                        <Button variant="ghost" size="icon-sm" aria-label={`Quitar ${product.name}`} onClick={() => section.setItems((current) => current.filter((candidate) => candidate.id !== item.id))}>
                          <Trash2 className="text-destructive" />
                        </Button>
                      </div>
                    )
                  })}
                  {!section.items.length ? (
                    <div className="grid h-20 place-items-center border-b text-xs text-muted-foreground">
                      Agrega un articulo para continuar.
                    </div>
                  ) : null}
                </div>
                <div className="border-t bg-muted/40 p-3 text-right">
                  <span className="mr-3 text-xs text-muted-foreground">Total</span>
                  <strong className="font-mono">{money(section.total)}</strong>
                </div>
              </section>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between rounded-[4px] border bg-muted/45 p-4">
            <div>
              <div className="font-mono text-[10px] uppercase text-muted-foreground">Resultado</div>
              <strong>
                {balance > 0
                  ? "Diferencia a cobrar"
                  : balance === 0
                    ? "Cambio equilibrado"
                    : "Comprobante negativo"}
              </strong>
            </div>
            <span className={cn("font-mono text-2xl font-semibold", balance < 0 && "text-destructive")}>
              {money(Math.abs(balance))}
            </span>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Volver al POS</Button>
          <Button disabled={!hasItems} onClick={resolve}>
            {balance > 0
              ? "Continuar a cobro"
              : balance === 0
                ? "Confirmar cambio"
                : "Generar comprobante negativo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

type TicketLine = {
  ticket: TicketItem
  product: Product
  unitPrice: number
  discountedPrice: number
  amount: number
}

type QuickChargeMode = "cash" | "electronic-cash" | "electronic-card"

function QuickChargeActions({
  disabled,
  onCharge,
  className,
  buttonClassName,
}: {
  disabled: boolean
  onCharge: (mode: QuickChargeMode) => void
  className?: string
  buttonClassName?: string
}) {
  return (
    <div className={cn("grid grid-cols-3 gap-2", className)}>
      <Button
        className={cn("h-14 min-w-0 rounded-[4px] bg-black px-2 text-[11px] font-semibold text-white hover:bg-black/85", buttonClassName)}
        disabled={disabled}
        onClick={() => onCharge("cash")}
      >
        <Banknote className="hidden shrink-0 sm:block" />
        <span className="leading-tight">Efectivo</span>
      </Button>
      <Button
        className={cn("h-14 min-w-0 rounded-[4px] px-2 text-[11px] font-semibold", buttonClassName)}
        disabled={disabled}
        onClick={() => onCharge("electronic-cash")}
      >
        <ReceiptText className="hidden shrink-0 sm:block" />
        <span className="truncate leading-tight">Fac. E · Efectivo</span>
      </Button>
      <Button
        className={cn("h-14 min-w-0 rounded-[4px] px-2 text-[11px] font-semibold", buttonClassName)}
        disabled={disabled}
        onClick={() => onCharge("electronic-card")}
      >
        <CreditCard className="hidden shrink-0 sm:block" />
        <span className="truncate leading-tight">Fac. E · Tarjeta</span>
      </Button>
    </div>
  )
}

const headerGridColumnDefinitions: Record<POSColumnKey, { label: string; width: number; align?: "right" }> = {
  code: { label: "CODIGO", width: 80 },
  detail: { label: "ITEM", width: 340 },
  unit: { label: "UNIDAD", width: 90 },
  quantity: { label: "CANTIDAD", width: 150, align: "right" },
  manualDiscount: { label: "DESC. MAN.", width: 150, align: "right" },
  promotionalDiscount: { label: "DESC. PROMO", width: 125, align: "right" },
  unitPrice: { label: "PRECIO", width: 145, align: "right" },
  discountedPrice: { label: "CON DESC.", width: 145, align: "right" },
  amount: { label: "IMPORTE", width: 165, align: "right" },
  actions: { label: "ACCIONES", width: 285, align: "right" },
}

const headerGridColumnOrder: POSColumnKey[] = [
  "code",
  "detail",
  "unit",
  "quantity",
  "manualDiscount",
  "promotionalDiscount",
  "unitPrice",
  "discountedPrice",
  "amount",
  "actions",
]

function POSGridColumns({ columns }: { columns: POSColumnKey[] }) {
  return (
    <colgroup>
      {columns.map((column) => (
        <col key={column} style={{ width: headerGridColumnDefinitions[column].width }} />
      ))}
    </colgroup>
  )
}

function NumberStepper({
  value,
  min,
  max,
  label,
  onChange,
}: {
  value: number
  min: number
  max?: number
  label: string
  onChange: (value: number) => void
}) {
  const clamp = (nextValue: number) =>
    Math.min(max ?? Number.POSITIVE_INFINITY, Math.max(min, nextValue))

  return (
    <div className="ml-auto flex w-fit items-center gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="h-8 w-7 shrink-0 rounded-[4px] border-0 bg-red-100 p-0 text-red-700 shadow-none hover:bg-red-200 hover:text-red-800 disabled:bg-red-50 disabled:text-red-300"
        disabled={value <= min}
        aria-label={`Restar ${label}`}
        onClick={() => onChange(clamp(value - 1))}
      >
        <Minus />
      </Button>
      <Input
        type="number"
        min={min}
        max={max}
        step="1"
        value={value}
        aria-label={label}
        onChange={(event) => onChange(clamp(Number(event.target.value)))}
        className="h-8 w-14 rounded-[4px] text-center font-mono text-xs [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="h-8 w-7 shrink-0 rounded-[4px] border-0 bg-emerald-100 p-0 text-emerald-700 shadow-none hover:bg-emerald-200 hover:text-emerald-800 disabled:bg-emerald-50 disabled:text-emerald-300"
        disabled={max !== undefined && value >= max}
        aria-label={`Sumar ${label}`}
        onClick={() => onChange(clamp(value + 1))}
      >
        <Plus />
      </Button>
    </div>
  )
}

type BillingDraft = {
  name: string
  documentType: string
  document: string
  vatCategory: string
  saleCondition: string
  priceList: string
  address: string
}

function BillingDetailsSheet({
  open,
  customer,
  customers,
  seller,
  onOpenChange,
  onCustomerChange,
  onSellerChange,
  onCreateCustomer,
  onSave,
}: {
  open: boolean
  customer: Customer | undefined
  customers: Customer[]
  seller: string
  onOpenChange: (open: boolean) => void
  onCustomerChange: (customerId: string) => void
  onSellerChange: (seller: string) => void
  onCreateCustomer: () => void
  onSave: (customer: Customer) => void
}) {
  const [draft, setDraft] = useState<BillingDraft>(() => ({
    name: customer?.name ?? "",
    documentType: customer?.documentType ?? "DNI",
    document: customer?.document ?? "",
    vatCategory: customer?.vatCategory ?? "Consumidor final",
    saleCondition: customer?.saleCondition ?? "Efectivo",
    priceList: customer?.priceList ?? "Publico",
    address: customer?.address ?? "",
  }))

  const requiresIdentification = draft.vatCategory !== "Consumidor final"
  const valid = Boolean(draft.name && (!requiresIdentification || draft.document))
  const status = requiresIdentification
    ? draft.document
      ? "Datos fiscales completos"
      : "Faltan datos fiscales"
    : "Consumidor final"

  const patchDraft = (patch: Partial<BillingDraft>) =>
    setDraft((current) => ({ ...current, ...patch }))

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="gap-0 p-0 data-[side=right]:w-[min(96vw,560px)] data-[side=right]:sm:max-w-[560px]">
        <SheetHeader className="border-b px-5 py-4">
          <SheetTitle>Datos de facturacion</SheetTitle>
          <SheetDescription>
            Completa solamente la informacion necesaria para emitir este comprobante.
          </SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          <section className="border bg-blue-50/40 p-4 dark:bg-blue-950/15">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="font-mono text-[10px] font-semibold uppercase text-muted-foreground">
                  Cliente de la factura
                </div>
                <div className="mt-1 truncate text-base font-semibold">{draft.name || "Sin seleccionar"}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {draft.vatCategory} · Lista {draft.priceList}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Vendedor · {seller}
                </div>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-[4px] px-2 py-1 font-mono text-[10px] font-semibold",
                  status === "Faltan datos fiscales"
                    ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                    : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                )}
              >
                {status}
              </span>
            </div>
          </section>

          <section className="mt-5">
            <h3 className="text-sm font-semibold">Cliente y vendedor</h3>
            <div className="mt-3 grid gap-3">
              <Field label="Cliente">
                <div className="grid grid-cols-[minmax(0,1fr)_2.5rem] gap-2">
                  <Select value={customer?.id} onValueChange={onCustomerChange}>
                    <SelectTrigger className="h-10 min-w-0 rounded-[4px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {customers.map((item) => (
                        <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon-lg" aria-label="Crear cliente" onClick={onCreateCustomer}>
                    <UserPlus />
                  </Button>
                </div>
              </Field>
              <Field label="Vendedor asignado">
                <Select value={seller} onValueChange={onSellerChange}>
                  <SelectTrigger className="h-10 w-full rounded-[4px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {sellers.map((sellerOption) => (
                      <SelectItem key={sellerOption} value={sellerOption}>{sellerOption}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </section>

          <section className="mt-5 border-t pt-5">
            <h3 className="text-sm font-semibold">Identificacion fiscal</h3>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <Field label="Nombre o razon social" required className="sm:col-span-2">
                <Input value={draft.name} onChange={(event) => patchDraft({ name: event.target.value })} className="h-10 rounded-[4px]" />
              </Field>
              <Field label="Categoria IVA" required>
                <Select value={draft.vatCategory} onValueChange={(vatCategory) => patchDraft({ vatCategory })}>
                  <SelectTrigger className="h-10 w-full rounded-[4px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Consumidor final">Consumidor final</SelectItem>
                    <SelectItem value="Responsable inscripto">Responsable inscripto</SelectItem>
                    <SelectItem value="Monotributista">Monotributista</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Tipo de documento">
                <Select value={draft.documentType} onValueChange={(documentType) => patchDraft({ documentType })}>
                  <SelectTrigger className="h-10 w-full rounded-[4px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DNI">DNI</SelectItem>
                    <SelectItem value="CUIT">CUIT</SelectItem>
                    <SelectItem value="CUIL">CUIL</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="CUIT / CUIL / Documento" required={requiresIdentification}>
                <Input value={draft.document} onChange={(event) => patchDraft({ document: event.target.value })} className="h-10 rounded-[4px] font-mono" />
              </Field>
              <Field label="Domicilio fiscal">
                <Input value={draft.address} onChange={(event) => patchDraft({ address: event.target.value })} className="h-10 rounded-[4px]" />
              </Field>
              <Field label="Condicion de venta">
                <Select value={draft.saleCondition} onValueChange={(saleCondition) => patchDraft({ saleCondition })}>
                  <SelectTrigger className="h-10 w-full rounded-[4px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Efectivo">Efectivo</SelectItem>
                    <SelectItem value="Cuenta corriente">Cuenta corriente</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Lista de precios">
                <Input value={draft.priceList} onChange={(event) => patchDraft({ priceList: event.target.value })} className="h-10 rounded-[4px]" />
              </Field>
            </div>
          </section>

          <section className="mt-5 border-t pt-5">
            <h3 className="text-sm font-semibold">Comprobante</h3>
            <div className="mt-3 grid grid-cols-3 divide-x border bg-muted/30 text-center">
              <div className="p-3">
                <div className="font-mono text-[9px] uppercase text-muted-foreground">Tipo</div>
                <div className="mt-1 text-xs font-medium">Factura</div>
              </div>
              <div className="p-3">
                <div className="font-mono text-[9px] uppercase text-muted-foreground">Punto de venta</div>
                <div className="mt-1 font-mono text-xs font-medium">0004</div>
              </div>
              <div className="p-3">
                <div className="font-mono text-[9px] uppercase text-muted-foreground">Emision</div>
                <div className="mt-1 text-xs font-medium">Al confirmar</div>
              </div>
            </div>
          </section>
        </div>

        <SheetFooter className="flex-row border-t bg-card px-5 py-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button
            className="ml-auto"
            disabled={!valid || !customer}
            onClick={() => customer && onSave({ ...customer, ...draft })}
          >
            <Check /> Guardar y usar en esta venta
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

const receiptBookColumnDefinitions: Record<POSColumnKey, { label: string; width: number; align?: "right" }> = {
  code: { label: "CODIGO", width: 90 },
  quantity: { label: "CANTIDAD", width: 160, align: "right" },
  detail: { label: "DETALLE", width: 340 },
  unit: { label: "UNIDAD", width: 105 },
  unitPrice: { label: "PRECIO UNIT.", width: 150, align: "right" },
  manualDiscount: { label: "DESC. MAN.", width: 155, align: "right" },
  promotionalDiscount: { label: "DESC. PROMO", width: 130, align: "right" },
  discountedPrice: { label: "CON DESC.", width: 150, align: "right" },
  amount: { label: "IMPORTE", width: 170, align: "right" },
  actions: { label: "ACCIONES", width: 100, align: "right" },
}

function ReceiptBookColumns({ columns }: { columns: POSColumnKey[] }) {
  return (
    <colgroup>
      {columns.map((column) => (
        <col key={column} style={{ width: receiptBookColumnDefinitions[column].width }} />
      ))}
    </colgroup>
  )
}

function ReceiptBookHeader({
  customer,
  seller,
}: {
  customer: Customer | undefined
  seller: string
}) {
  const billingStatus = customer?.vatCategory === "Consumidor final"
    ? "Consumidor final"
    : customer?.document
      ? "Datos fiscales completos"
      : "Faltan datos fiscales"

  return (
    <header className="grid shrink-0 border-b-2 border-foreground/25 bg-blue-50/25 lg:grid-cols-[minmax(20rem,1.4fr)_minmax(14rem,0.8fr)_minmax(14rem,0.8fr)_minmax(13rem,0.62fr)] dark:bg-blue-950/10">
      <div className="min-w-0 border-b p-3 lg:border-r lg:border-b-0">
        <div className="font-mono text-[9px] font-semibold uppercase text-muted-foreground">Cliente</div>
        <div className="mt-1 truncate text-sm font-semibold">{customer?.name ?? "Sin cliente"}</div>
        <div className="truncate text-[11px] text-muted-foreground">
          {customer?.document || billingStatus} · Lista {customer?.priceList ?? "Publico"}
        </div>
      </div>
      <div className="border-b p-3 lg:border-r lg:border-b-0">
        <div className="font-mono text-[9px] font-semibold uppercase text-muted-foreground">Condicion de venta</div>
        <div className="mt-1 text-sm font-medium">{customer?.saleCondition ?? "Efectivo"}</div>
        <div className="text-[11px] text-muted-foreground">{customer?.vatCategory ?? "Consumidor final"}</div>
      </div>
      <div className="border-b p-3 lg:border-r lg:border-b-0">
        <div className="font-mono text-[9px] font-semibold uppercase text-muted-foreground">Vendedor</div>
        <div className="mt-1 text-sm font-medium">{seller}</div>
        <div className="text-[11px] text-muted-foreground">Asignado a esta venta</div>
      </div>
      <div className="flex min-w-0 flex-col justify-center p-3 text-right">
        <div className="font-mono text-[9px] font-semibold uppercase text-muted-foreground">Factura</div>
        <div className="mt-1 text-[11px] text-muted-foreground">PV 0004 · En preparacion</div>
      </div>
    </header>
  )
}

function ReceiptBookView({
  lines,
  visibleColumns,
  subtotal,
  manualDiscount,
  promotionalDiscount,
  total,
  onUpdateTicket,
  onDeleteLine,
  onCharge,
}: {
  lines: TicketLine[]
  visibleColumns: POSColumnKey[]
  subtotal: number
  manualDiscount: number
  promotionalDiscount: number
  total: number
  onUpdateTicket: (id: string, patch: Partial<TicketItem>) => void
  onDeleteLine: (id: string) => void
  onCharge: (mode: QuickChargeMode) => void
}) {
  const fillerStyle = {
    backgroundImage:
      "repeating-linear-gradient(to bottom, transparent 0, transparent 43px, var(--border) 44px)",
  }
  const minimumTableWidth = visibleColumns.reduce(
    (width, column) => width + receiptBookColumnDefinitions[column].width,
    0
  )
  const showUnitColumn = visibleColumns.includes("unit")

  const renderCell = (column: POSColumnKey, line: TicketLine) => {
    switch (column) {
      case "code":
        return <TableCell key={column} className="font-mono text-xs">{line.product.code}</TableCell>
      case "quantity":
        return (
          <TableCell key={column}>
            <NumberStepper
              value={line.ticket.quantity}
              min={1}
              label={`cantidad de ${line.product.name}`}
              onChange={(quantity) => onUpdateTicket(line.ticket.id, { quantity })}
            />
          </TableCell>
        )
      case "detail":
        return (
          <TableCell key={column} className="whitespace-normal">
            <div className="line-clamp-2 text-xs font-medium leading-4">{line.product.name}</div>
            <div className="font-mono text-[10px] text-muted-foreground">
              {line.product.barcode}{showUnitColumn ? "" : ` · ${line.product.unit}`}
            </div>
          </TableCell>
        )
      case "unit":
        return <TableCell key={column} className="text-xs">{line.product.unit}</TableCell>
      case "unitPrice":
        return <TableCell key={column} className="text-right font-mono text-xs">{money(line.unitPrice)}</TableCell>
      case "manualDiscount":
        return (
          <TableCell key={column}>
            <NumberStepper
              value={line.ticket.manualDiscount}
              min={0}
              max={100}
              label={`descuento manual de ${line.product.name}`}
              onChange={(manualDiscountValue) =>
                onUpdateTicket(line.ticket.id, { manualDiscount: manualDiscountValue })
              }
            />
          </TableCell>
        )
      case "promotionalDiscount":
        return <TableCell key={column} className="text-right font-mono text-xs">{line.ticket.promotionalDiscount}%</TableCell>
      case "discountedPrice":
        return <TableCell key={column} className="text-right font-mono text-xs">{money(line.discountedPrice)}</TableCell>
      case "amount":
        return <TableCell key={column} className="text-right font-mono text-xs font-semibold">{money(line.amount)}</TableCell>
      case "actions":
        return (
          <TableCell key={column} className="text-right">
            <Button
              variant="ghost"
              size="icon-sm"
              className="h-8 w-12 rounded-[4px] border-0 bg-red-100 text-red-700 shadow-none hover:bg-red-200 hover:text-red-800"
              aria-label={`Eliminar ${line.product.name}`}
              onClick={() => onDeleteLine(line.ticket.id)}
            >
              <Trash2 className="text-red-700" />
            </Button>
          </TableCell>
        )
    }
  }

  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-hidden bg-card">
      <div className="relative min-h-0 flex-1 overflow-auto [&_[data-slot=table-container]]:h-full">
        <Table
          className="h-full table-fixed [&_td]:border-r [&_td]:border-border [&_td:last-child]:border-r-0 [&_th]:border-r [&_th]:border-border [&_th:last-child]:border-r-0"
          style={{ minWidth: minimumTableWidth }}
        >
          <ReceiptBookColumns columns={visibleColumns} />
          <TableHeader className="sticky top-0 z-10 bg-muted/95">
            <TableRow className="h-11">
              {visibleColumns.map((column) => {
                const definition = receiptBookColumnDefinitions[column]
                return (
                  <TableHead
                    key={column}
                    className={cn("font-mono text-[9px]", definition.align === "right" && "text-right")}
                  >
                    {definition.label}
                  </TableHead>
                )
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {lines.map((line) => (
              <TableRow key={line.ticket.id} className="h-14">
                {visibleColumns.map((column) => renderCell(column, line))}
              </TableRow>
            ))}
            <TableRow aria-hidden="true" className="h-full border-0 hover:bg-transparent">
              {Array.from({ length: visibleColumns.length }, (_, index) => (
                <TableCell key={index} className="p-0" style={fillerStyle} />
              ))}
            </TableRow>
          </TableBody>
        </Table>
        {!lines.length ? (
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <div className="bg-card/90 px-5 py-3 text-center">
              <strong>Factura vacia</strong>
              <p className="mt-1 text-xs text-muted-foreground">Escanea un codigo o selecciona un favorito.</p>
            </div>
          </div>
        ) : null}
      </div>

      <footer className="grid shrink-0 border-t-2 border-foreground/30 bg-card lg:grid-cols-[minmax(0,1fr)_minmax(43rem,1.1fr)]">
        <div className="grid grid-cols-3 divide-x border-b lg:border-r lg:border-b-0">
          <div className="p-3 text-right">
            <div className="font-mono text-[9px] uppercase text-muted-foreground">Subtotal</div>
            <strong className="font-mono text-sm">{money(subtotal)}</strong>
          </div>
          <div className="p-3 text-right">
            <div className="font-mono text-[9px] uppercase text-muted-foreground">Desc. manual</div>
            <strong className="font-mono text-sm">-{money(manualDiscount)}</strong>
          </div>
          <div className="p-3 text-right">
            <div className="font-mono text-[9px] uppercase text-muted-foreground">Desc. promocion</div>
            <strong className="font-mono text-sm">-{money(promotionalDiscount)}</strong>
          </div>
        </div>
        <div className="grid min-h-24 grid-cols-[minmax(12rem,0.8fr)_minmax(29rem,1.4fr)] items-stretch gap-3 bg-blue-50/60 p-3 dark:bg-blue-950/20">
          <div className="flex min-w-0 flex-col justify-center border-r-2 border-primary/30 pr-4 text-right">
            <div className="font-mono text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Total a pagar</div>
            <strong className="truncate font-mono text-4xl font-semibold tracking-tight">{money(total)}</strong>
          </div>
          <QuickChargeActions
            className="h-full"
            buttonClassName="h-full min-h-16"
            disabled={!lines.length}
            onCharge={onCharge}
          />
        </div>
      </footer>
    </section>
  )
}

function MobilePOSTicket({
  layout,
  lines,
  subtotal,
  discount,
  total,
  onUpdateTicket,
  onDeleteLine,
  onCharge,
}: {
  layout: POSLayout
  lines: TicketLine[]
  subtotal: number
  discount: number
  total: number
  onUpdateTicket: (id: string, patch: Partial<TicketItem>) => void
  onDeleteLine: (id: string) => void
  onCharge: (mode: QuickChargeMode) => void
}) {
  const renderLine = (line: TicketLine) => {
    if (layout === "bottom-bar") {
      return (
        <article key={line.ticket.id} className="border-b bg-card px-3 py-2.5 first:border-t">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3">
            <div className="min-w-0">
              <div className="flex min-w-0 items-center gap-2">
                <span className="shrink-0 font-mono text-[10px] font-semibold text-primary">
                  {line.product.code}
                </span>
                <h3 className="truncate text-sm font-medium">{line.product.name}</h3>
              </div>
              <div className="mt-0.5 truncate font-mono text-[9px] text-muted-foreground">
                {line.product.barcode} · {line.product.unit} · {money(line.discountedPrice)} c/u
              </div>
            </div>
            <strong className="font-mono text-sm">{money(line.amount)}</strong>
          </div>

          <div className="mt-2 grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_2rem] items-end gap-2">
            <div>
              <div className="mb-1 font-mono text-[8px] uppercase text-muted-foreground">Cant.</div>
              <NumberStepper
                value={line.ticket.quantity}
                min={1}
                label={`cantidad de ${line.product.name}`}
                onChange={(quantity) => onUpdateTicket(line.ticket.id, { quantity })}
              />
            </div>
            <div>
              <div className="mb-1 font-mono text-[8px] uppercase text-muted-foreground">Dto. %</div>
              <NumberStepper
                value={line.ticket.manualDiscount}
                min={0}
                max={100}
                label={`descuento manual de ${line.product.name}`}
                onChange={(manualDiscount) =>
                  onUpdateTicket(line.ticket.id, { manualDiscount })
                }
              />
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-destructive"
              aria-label={`Eliminar ${line.product.name}`}
              onClick={() => onDeleteLine(line.ticket.id)}
            >
              <Trash2 />
            </Button>
          </div>
        </article>
      )
    }

    if (layout === "receipt-book") {
      return (
        <article key={line.ticket.id} className="border-b border-dashed border-foreground/35 bg-card px-3 py-3">
          <div className="flex items-center justify-between gap-3 border-b pb-1.5 font-mono text-[9px] text-muted-foreground">
            <span>{line.product.code} · {line.product.barcode}</span>
            <span>IMPORTE</span>
          </div>
          <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 py-2">
            <div className="min-w-0">
              <h3 className="line-clamp-2 text-sm font-semibold uppercase leading-5">
                {line.product.name}
              </h3>
              <div className="mt-1 font-mono text-[10px] text-muted-foreground">
                {line.product.unit} · Unitario {money(line.discountedPrice)}
              </div>
            </div>
            <strong className="font-mono text-base">{money(line.amount)}</strong>
          </div>
          <div className="grid grid-cols-2 gap-3 border-t pt-2">
            <div>
              <div className="mb-1 font-mono text-[8px] uppercase text-muted-foreground">Cantidad</div>
              <NumberStepper
                value={line.ticket.quantity}
                min={1}
                label={`cantidad de ${line.product.name}`}
                onChange={(quantity) => onUpdateTicket(line.ticket.id, { quantity })}
              />
            </div>
            <div>
              <div className="mb-1 font-mono text-[8px] uppercase text-muted-foreground">Descuento %</div>
              <div className="flex items-center justify-end gap-1">
                <NumberStepper
                  value={line.ticket.manualDiscount}
                  min={0}
                  max={100}
                  label={`descuento manual de ${line.product.name}`}
                  onChange={(manualDiscount) =>
                    onUpdateTicket(line.ticket.id, { manualDiscount })
                  }
                />
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="ml-1 text-destructive"
                  aria-label={`Eliminar ${line.product.name}`}
                  onClick={() => onDeleteLine(line.ticket.id)}
                >
                  <Trash2 />
                </Button>
              </div>
            </div>
          </div>
        </article>
      )
    }

    return (
      <article key={line.ticket.id} className="rounded-[4px] border bg-card p-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-semibold text-primary">
                {line.product.code}
              </span>
              <span className="truncate font-mono text-[9px] text-muted-foreground">
                {line.product.barcode}
              </span>
            </div>
            <h3 className="mt-1 line-clamp-2 text-sm leading-5 font-medium">
              {line.product.name}
            </h3>
          </div>
          <div className="shrink-0 text-right">
            <div className="font-mono text-[9px] uppercase text-muted-foreground">
              Importe
            </div>
            <strong className="font-mono text-sm">{money(line.amount)}</strong>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 border-t pt-3">
          <div>
            <div className="mb-1 font-mono text-[9px] uppercase text-muted-foreground">
              Cantidad
            </div>
            <NumberStepper
              value={line.ticket.quantity}
              min={1}
              label={`cantidad de ${line.product.name}`}
              onChange={(quantity) => onUpdateTicket(line.ticket.id, { quantity })}
            />
          </div>
          <div>
            <div className="mb-1 font-mono text-[9px] uppercase text-muted-foreground">
              Descuento %
            </div>
            <NumberStepper
              value={line.ticket.manualDiscount}
              min={0}
              max={100}
              label={`descuento manual de ${line.product.name}`}
              onChange={(manualDiscount) =>
                onUpdateTicket(line.ticket.id, { manualDiscount })
              }
            />
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between border-t pt-2">
          <span className="text-xs text-muted-foreground">
            {line.product.unit} · {money(line.discountedPrice)} c/u
          </span>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-destructive"
            aria-label={`Eliminar ${line.product.name}`}
            onClick={() => onDeleteLine(line.ticket.id)}
          >
            <Trash2 />
          </Button>
        </div>
      </article>
    )
  }

  return (
    <section data-pos-layout={layout} className="flex min-h-0 flex-1 flex-col bg-background">
      <div className={cn("min-h-0 flex-1 overflow-y-auto", layout === "header-grid" && "p-2")}>
        {lines.length ? (
          <div className={cn("grid", layout === "header-grid" && "gap-2")}>
            {lines.map(renderLine)}
          </div>
        ) : (
          <div className="grid min-h-48 place-items-center text-center">
            <div>
              <strong>Ticket vacío</strong>
              <p className="mt-1 text-xs text-muted-foreground">
                Escaneá un código o seleccioná un favorito.
              </p>
            </div>
          </div>
        )}
      </div>

      <footer
        className={cn(
          "shrink-0 border-t bg-card p-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)]",
          layout === "receipt-book" && "border-t-2 border-foreground/35"
        )}
      >
        <div
          className={cn(
            "flex items-end justify-between gap-4",
            "mb-2"
          )}
        >
          <div
            className={cn(
              "font-mono text-[10px] text-muted-foreground"
            )}
          >
            Subtotal {money(subtotal)}
            {discount ? ` · Dto. -${money(discount)}` : ""}
          </div>
          <div
            className={cn(
              "shrink-0 text-right"
            )}
          >
            <div className="font-mono text-[9px] font-semibold uppercase text-muted-foreground">
              Total
            </div>
            <strong className="font-mono text-xl">
              {money(total)}
            </strong>
          </div>
        </div>
        <QuickChargeActions
          buttonClassName="h-12 px-1 text-[9px]"
          disabled={!lines.length}
          onCharge={onCharge}
        />
      </footer>
    </section>
  )
}

export function POSWorkspace({
  layout,
  onLayoutChange,
  visibleColumns,
  products,
  customers,
  setCustomers,
  onExit,
}: {
  layout: POSLayout
  onLayoutChange: (layout: POSLayout) => void
  visibleColumns: POSColumnKey[]
  products: Product[]
  customers: Customer[]
  setCustomers: Dispatch<SetStateAction<Customer[]>>
  onExit: () => void
}) {
  const isMobile = useIsMobile()
  const scannerRef = useRef<HTMLInputElement>(null)
  const [cashOpen, setCashOpen] = useState(false)
  const [initialBalance, setInitialBalance] = useState("50000")
  const [openingSeller, setOpeningSeller] = useState(sellers[0])
  const [openingNotes, setOpeningNotes] = useState("")
  const [ticket, setTicket] = useState<TicketItem[]>(initialTicket)
  const [scanner, setScanner] = useState("")
  const [scanMatches, setScanMatches] = useState<Product[]>([])
  const [favoritesOpen, setFavoritesOpen] = useState(false)
  const [favoritePage, setFavoritePage] = useState(0)
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id ?? "")
  const [selectedSeller, setSelectedSeller] = useState(sellers[0])
  const [customerDrawerOpen, setCustomerDrawerOpen] = useState(false)
  const [billingDrawerOpen, setBillingDrawerOpen] = useState(false)
  const [cashDrawerOpen, setCashDrawerOpen] = useState(false)
  const [exchangeOpen, setExchangeOpen] = useState(false)
  const [cashMovementOpen, setCashMovementOpen] = useState(false)
  const [cashMovements, setCashMovements] = useState<CashMovement[]>([])
  const [notice, setNotice] = useState("Ticket recuperado y listo para continuar.")
  const [quickChargeMode, setQuickChargeMode] = useState<QuickChargeMode>("electronic-cash")
  const [payment, setPayment] = useState<{
    open: boolean
    method: PaymentMethodName
    total: number
    purpose: "sale" | "exchange"
  }>({ open: false, method: "Efectivo", total: 0, purpose: "sale" })

  const productMap = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products]
  )

  const lines = useMemo<TicketLine[]>(() => {
    return ticket.flatMap((item) => {
      const product = productMap.get(item.productId)
      if (!product || product.salePrice === null) return []
      const discount = Math.min(100, item.manualDiscount + item.promotionalDiscount)
      const discountedPrice = product.salePrice * (1 - discount / 100)
      return [
        {
          ticket: item,
          product,
          unitPrice: product.salePrice,
          discountedPrice,
          amount: discountedPrice * item.quantity,
        },
      ]
    })
  }, [productMap, ticket])

  const subtotal = lines.reduce(
    (sum, line) => sum + line.unitPrice * line.ticket.quantity,
    0
  )
  const total = lines.reduce((sum, line) => sum + line.amount, 0)
  const discount = subtotal - total
  const manualDiscount = lines.reduce(
    (sum, line) =>
      sum + line.unitPrice * line.ticket.quantity * (line.ticket.manualDiscount / 100),
    0
  )
  const promotionalDiscount = lines.reduce(
    (sum, line) =>
      sum + line.unitPrice * line.ticket.quantity * (line.ticket.promotionalDiscount / 100),
    0
  )
  const selectedCustomer =
    customers.find((customer) => customer.id === selectedCustomerId) ?? customers[0]
  const cashBalance = cashMovements.reduce((sum, movement) => sum + movement.amount, 0)

  const focusScanner = () => {
    window.setTimeout(() => scannerRef.current?.focus(), 0)
  }

  const addProduct = (product: Product) => {
    if (!product.active) {
      setNotice(`${product.name} esta deshabilitado y no puede agregarse.`)
      focusScanner()
      return
    }
    if (product.salePrice === null) {
      setNotice(`${product.name} no tiene precio y requiere resolucion antes de vender.`)
      focusScanner()
      return
    }
    setTicket((current) => {
      const existing = current.find((item) => item.productId === product.id)
      if (existing) {
        return current.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [
        ...current,
        {
          id: `t-${Date.now()}`,
          productId: product.id,
          quantity: 1,
          manualDiscount: 0,
          promotionalDiscount: 0,
        },
      ]
    })
    setNotice(`${product.name} agregado al ticket.`)
    setScanner("")
    setScanMatches([])
    focusScanner()
  }

  const searchProduct = () => {
    const query = scanner.trim().toLocaleLowerCase("es")
    if (!query) return
    const exact = products.find(
      (product) =>
        product.code.toLocaleLowerCase("es") === query ||
        product.barcode.toLocaleLowerCase("es") === query
    )
    if (exact) {
      addProduct(exact)
      return
    }
    const matches = products.filter((product) =>
      product.name.toLocaleLowerCase("es").includes(query)
    )
    if (matches.length === 1) addProduct(matches[0])
    else if (matches.length > 1) setScanMatches(matches)
    else {
      setNotice(`No encontramos ningun articulo para "${scanner}".`)
      setScanMatches([])
      focusScanner()
    }
  }

  const updateTicket = (id: string, patch: Partial<TicketItem>) => {
    setTicket((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item))
    )
  }

  const openPayment = (
    method: PaymentMethodName,
    amount = total,
    purpose: "sale" | "exchange" = "sale"
  ) => setPayment({ open: true, method, total: amount, purpose })

  const handleQuickCharge = (mode: QuickChargeMode) => {
    setQuickChargeMode(mode)
    openPayment(mode === "electronic-card" ? "Tarjeta" : "Efectivo")
  }

  const favorites = favoriteProductIds
    .map((id) => productMap.get(id))
    .filter((product): product is Product => Boolean(product))
  const pageCount = Math.ceil(favorites.length / 6)
  const visibleFavorites = favorites.slice(favoritePage * 6, favoritePage * 6 + 6)
  const headerGridColumns = headerGridColumnOrder.filter((column) =>
    visibleColumns.includes(column)
  )
  const headerGridMinimumWidth = headerGridColumns.reduce(
    (width, column) => width + headerGridColumnDefinitions[column].width,
    0
  )
  const headerGridQuickActionColumn = headerGridColumns.includes("actions")
    ? "actions"
    : headerGridColumns.at(-1)
  const headerGridTotalColumn = headerGridColumns.includes("amount") && headerGridQuickActionColumn !== "amount"
    ? "amount"
    : headerGridColumns.filter((column) => column !== headerGridQuickActionColumn).at(-1)
  const ticketQuantity = lines.reduce((sum, line) => sum + line.ticket.quantity, 0)

  const renderHeaderGridCell = (column: POSColumnKey, line: TicketLine) => {
    switch (column) {
      case "code":
        return <TableCell key={column} className="font-mono text-xs">{line.product.code}</TableCell>
      case "detail":
        return (
          <TableCell key={column} className="whitespace-normal">
            <div className="line-clamp-2 text-[11px] font-medium leading-4">{line.product.name}</div>
            <div className="font-mono text-[10px] text-muted-foreground">{line.product.barcode}</div>
          </TableCell>
        )
      case "unit":
        return <TableCell key={column} className="text-xs">{line.product.unit}</TableCell>
      case "quantity":
        return (
          <TableCell key={column}>
            <NumberStepper
              value={line.ticket.quantity}
              min={1}
              label={`cantidad de ${line.product.name}`}
              onChange={(quantity) => updateTicket(line.ticket.id, { quantity })}
            />
          </TableCell>
        )
      case "manualDiscount":
        return (
          <TableCell key={column}>
            <NumberStepper
              value={line.ticket.manualDiscount}
              min={0}
              max={100}
              label={`descuento manual de ${line.product.name}`}
              onChange={(manualDiscountValue) =>
                updateTicket(line.ticket.id, { manualDiscount: manualDiscountValue })
              }
            />
          </TableCell>
        )
      case "promotionalDiscount":
        return <TableCell key={column} className="text-right font-mono text-[11px]">{line.ticket.promotionalDiscount}%</TableCell>
      case "unitPrice":
        return <TableCell key={column} className="text-right font-mono text-[11px]">{money(line.unitPrice)}</TableCell>
      case "discountedPrice":
        return <TableCell key={column} className="text-right font-mono text-[11px]">{money(line.discountedPrice)}</TableCell>
      case "amount":
        return <TableCell key={column} className="text-right font-mono text-[11px] font-semibold">{money(line.amount)}</TableCell>
      case "actions":
        return (
          <TableCell key={column} className="text-right">
            <Button
              variant="outline"
              size="icon-sm"
              className="h-8 w-16 rounded-[4px]"
              aria-label={`Eliminar ${line.product.name}`}
              onClick={() => setTicket((current) => current.filter((item) => item.id !== line.ticket.id))}
            >
              <Trash2 className="text-destructive" />
            </Button>
          </TableCell>
        )
    }
  }

  const renderHeaderGridFooterCell = (column: POSColumnKey) => {
    if (column === headerGridQuickActionColumn) {
      return (
        <TableCell key={column} className="px-2">
          <QuickChargeActions
            buttonClassName="h-12 px-1 text-[9px]"
            disabled={!lines.length}
            onCharge={handleQuickCharge}
          />
        </TableCell>
      )
    }

    if (column === headerGridTotalColumn) {
      return (
        <TableCell key={column} className="text-right">
          <div className="font-mono text-[9px] font-semibold uppercase text-muted-foreground">Total</div>
          <strong className="font-mono text-base">{money(total)}</strong>
        </TableCell>
      )
    }

    const metric = column === "quantity"
      ? { label: "Cantidad", value: String(ticketQuantity) }
      : column === "manualDiscount"
        ? { label: "Desc. man.", value: `-${money(manualDiscount)}` }
        : column === "promotionalDiscount"
          ? { label: "Desc. promo", value: `-${money(promotionalDiscount)}` }
          : column === "unitPrice"
            ? { label: "Subtotal", value: money(subtotal) }
            : null

    return (
      <TableCell key={column} className="text-right">
        {metric ? (
          <>
            <div className="font-mono text-[9px] uppercase text-muted-foreground">{metric.label}</div>
            <strong className="font-mono text-xs">{metric.value}</strong>
          </>
        ) : null}
      </TableCell>
    )
  }

  return (
    <div className="relative h-full min-h-0 overflow-hidden bg-background">
      <div
        className={cn(
          "flex h-full min-h-0 flex-col transition duration-200",
          !cashOpen && "pointer-events-none select-none blur-[2px] opacity-55"
        )}
        aria-disabled={!cashOpen}
      >
        <header className="flex min-h-12 shrink-0 flex-wrap items-center justify-between gap-2 border-b bg-background px-3 py-1.5">
          <strong className="text-sm">Facturación rápida</strong>
          <div className="flex items-center gap-3">
            <div role="group" aria-label="Vista de facturación rápida" className="grid grid-cols-3 overflow-hidden rounded-[4px] border bg-muted/35">
              {posViewOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={layout === option.value}
                  className={cn(
                    "h-8 min-w-28 border-r px-3 text-[10px] font-medium text-muted-foreground last:border-r-0 hover:bg-muted/60 hover:text-foreground",
                    layout === option.value && "bg-card text-foreground shadow-sm"
                  )}
                  onClick={() => onLayoutChange(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="hidden items-center gap-2 text-xs text-muted-foreground lg:flex">
              <span className="size-1.5 rounded-full bg-emerald-600" />
              ARCA operativo
            </div>
          </div>
        </header>
        {layout === "header-grid" || (isMobile && layout !== "bottom-bar") ? (
          <section className="shrink-0 border-b bg-muted/20 px-2 py-2 sm:px-3">
            <div className="grid grid-cols-2 items-end gap-2 lg:grid-cols-[minmax(20rem,1.4fr)_minmax(14rem,0.8fr)_minmax(16rem,1fr)] lg:gap-3">
              <div className="col-span-2 grid gap-1 lg:col-span-1">
                <span className="font-mono text-[9px] font-semibold uppercase text-muted-foreground">
                  Cliente
                </span>
                <div className="grid grid-cols-[minmax(0,1fr)_2.5rem] gap-2">
                  <Select value={selectedCustomer?.id} onValueChange={setSelectedCustomerId}>
                    <SelectTrigger className="h-9 w-full min-w-0 rounded-[4px] bg-card"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>{customer.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="icon-lg"
                    aria-label="Crear cliente"
                    onClick={() => setCustomerDrawerOpen(true)}
                  >
                    <UserPlus />
                  </Button>
                </div>
              </div>

              <div className="grid min-w-0 gap-1">
                <span className="font-mono text-[9px] font-semibold uppercase text-muted-foreground">
                  Condicion comercial
                </span>
                <div className="flex h-9 min-w-0 items-center overflow-hidden rounded-[4px] border bg-card px-3 text-xs">
                  <span className="truncate">
                    {selectedCustomer?.vatCategory ?? "Sin categoria"} · Lista {selectedCustomer?.priceList ?? "Publico"}
                  </span>
                </div>
              </div>

              <Field label="Vendedor asignado">
                <Select value={selectedSeller} onValueChange={setSelectedSeller}>
                  <SelectTrigger className="h-9 w-full rounded-[4px] bg-card"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {sellers.map((seller) => <SelectItem key={seller} value={seller}>{seller}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </section>
        ) : null}

        {layout === "receipt-book" && !isMobile ? (
          <ReceiptBookHeader customer={selectedCustomer} seller={selectedSeller} />
        ) : null}

        <section className="shrink-0 border-b bg-card p-2 sm:p-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-0 basis-full lg:min-w-[20rem] lg:flex-1 lg:basis-auto">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                ref={scannerRef}
                value={scanner}
                onChange={(event) => {
                  setScanner(event.target.value)
                  setScanMatches([])
                }}
                onKeyDown={(event) => event.key === "Enter" && searchProduct()}
                placeholder="Buscar por codigo de barras o descripcion"
                className="h-10 rounded-[4px] border-input bg-card pr-3 pl-9 font-mono text-sm"
                autoFocus
              />
              {scanMatches.length ? (
                <div className="absolute inset-x-0 top-[2.75rem] z-30 overflow-hidden rounded-[4px] border bg-popover shadow-xl">
                  {scanMatches.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      className="flex w-full items-center justify-between gap-3 border-b px-3 py-2 text-left last:border-0 hover:bg-muted"
                      onClick={() => addProduct(product)}
                    >
                      <span className="min-w-0 truncate text-sm">{product.name}</span>
                      <span className="shrink-0 font-mono text-xs">{money(product.salePrice)}</span>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <Button
              variant={favoritesOpen ? "secondary" : "outline"}
              className="h-10 rounded-[4px]"
              aria-label="Favoritos"
              title="Favoritos"
              onClick={() => {
                setFavoritesOpen((current) => !current)
                focusScanner()
              }}
            >
              <Star />
              <span className={cn(isMobile && layout === "bottom-bar" && "sr-only")}>
                Favoritos
              </span>
            </Button>
            {!isMobile || layout === "bottom-bar" ? (
              <Button
                variant="outline"
                className="h-10 rounded-[4px]"
                aria-label="Facturacion"
                onClick={() => setBillingDrawerOpen(true)}
              >
                <ReceiptText />
                {isMobile ? "Facturacion" : "Datos de facturacion"}
              </Button>
            ) : null}
            <Button
              variant="outline"
              className="h-10 rounded-[4px]"
              aria-label="Acciones de caja"
              onClick={() => setCashDrawerOpen(true)}
            >
              <WalletCards />
              <span className={cn(layout === "bottom-bar" && isMobile ? "inline" : "hidden min-[380px]:inline")}>
                {layout === "bottom-bar" && isMobile ? "Caja" : "Acciones de caja"}
              </span>
            </Button>
            <Button
              variant="outline"
              size="icon-lg"
              aria-label="Usar camara"
              title="Camara"
              onClick={() => {
                setNotice("Camara simulada: usa los codigos mock en el scanner.")
                focusScanner()
              }}
            >
              <Camera />
            </Button>
            <Button
              variant="outline"
              size="icon-lg"
              aria-label="Capturar peso de balanza"
              title="Balanza"
              onClick={() => {
                setNotice("Balanza simulada: peso estable 0,850 kg.")
                focusScanner()
              }}
            >
              <Scale />
            </Button>
          </div>

          {favoritesOpen ? (
            <div className="mt-3 grid grid-cols-[2rem_1fr_2rem] items-stretch gap-2 border-t pt-3">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Favoritos anteriores"
                disabled={favoritePage === 0}
                onClick={() => setFavoritePage((page) => Math.max(0, page - 1))}
              >
                <ArrowLeft />
              </Button>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
                {visibleFavorites.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    className="grid min-h-16 content-between rounded-[4px] border bg-card px-2.5 py-2 text-left hover:border-primary hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-primary dark:hover:bg-[#06193A]"
                    onClick={() => addProduct(product)}
                  >
                    <span className="line-clamp-2 text-xs leading-4">{product.name}</span>
                    <span className="mt-1 font-mono text-xs font-semibold">
                      {money(product.salePrice)}
                    </span>
                  </button>
                ))}
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Mas favoritos"
                disabled={favoritePage >= pageCount - 1}
                onClick={() => setFavoritePage((page) => Math.min(pageCount - 1, page + 1))}
              >
                <ArrowRight />
              </Button>
            </div>
          ) : null}

          {notice && !notice.startsWith("Caja abierta con saldo inicial") ? (
            <div className="mt-2 flex min-h-5 items-center gap-2 text-xs text-muted-foreground">
              <span className="size-1.5 shrink-0 rounded-full bg-emerald-600" />
              <span className="truncate">{notice}</span>
            </div>
          ) : null}
        </section>

        {isMobile ? (
          <MobilePOSTicket
            layout={layout}
            lines={lines}
            subtotal={subtotal}
            discount={discount}
            total={total}
            onUpdateTicket={updateTicket}
            onDeleteLine={(id) =>
              setTicket((current) => current.filter((item) => item.id !== id))
            }
            onCharge={handleQuickCharge}
          />
        ) : layout !== "header-grid" ? (
          <ReceiptBookView
            lines={lines}
            visibleColumns={visibleColumns}
            subtotal={subtotal}
            manualDiscount={manualDiscount}
            promotionalDiscount={promotionalDiscount}
            total={total}
            onUpdateTicket={updateTicket}
            onDeleteLine={(id) =>
              setTicket((current) => current.filter((item) => item.id !== id))
            }
            onCharge={handleQuickCharge}
          />
        ) : (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-card">
          <section className="flex min-h-0 min-w-0 flex-1 flex-col bg-card">
            <div
              className={cn(
                "relative min-h-0 flex-1 overflow-auto",
                layout === "header-grid" && "[&_[data-slot=table-container]]:h-full"
              )}
            >
              <Table
                className={cn(
                  "table-fixed",
                  layout === "header-grid" &&
                    "h-full [&_td]:border-r [&_td]:border-border [&_td:last-child]:border-r-0 [&_th]:border-r [&_th]:border-border [&_th:last-child]:border-r-0"
                )}
                style={{ minWidth: headerGridMinimumWidth }}
              >
                <POSGridColumns columns={headerGridColumns} />
                <TableHeader className="sticky top-0 z-10 bg-muted/95 backdrop-blur-sm">
                  <TableRow>
                    {headerGridColumns.map((column) => {
                      const definition = headerGridColumnDefinitions[column]
                      return (
                        <TableHead
                          key={column}
                          className={cn(
                            "whitespace-normal font-mono text-[9px] leading-3",
                            definition.align === "right" && "text-right"
                          )}
                        >
                          {definition.label}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lines.length ? (
                    lines.map((line) => (
                      <TableRow key={line.ticket.id} className="h-12">
                        {headerGridColumns.map((column) => renderHeaderGridCell(column, line))}
                      </TableRow>
                    ))
                  ) : layout !== "header-grid" ? (
                    <TableRow>
                      <TableCell colSpan={10} className="h-48 text-center">
                        <strong>Ticket vacio</strong>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Escanea un codigo o selecciona un favorito.
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : null}
                  {layout === "header-grid" ? (
                    <TableRow aria-hidden="true" className="h-full border-0 hover:bg-transparent">
                      {Array.from({ length: headerGridColumns.length }, (_, index) => (
                        <TableCell key={index} className="p-0" />
                      ))}
                    </TableRow>
                  ) : null}
                </TableBody>
              </Table>
              {layout === "header-grid" && !lines.length ? (
                <div className="pointer-events-none absolute inset-0 grid place-items-center">
                  <div className="text-center">
                    <strong>Ticket vacio</strong>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Escanea un codigo o selecciona un favorito.
                    </p>
                  </div>
                </div>
              ) : null}
            </div>

            {layout === "header-grid" ? (
              <div className="shrink-0 border-t bg-muted/40">
                <Table
                  className="table-fixed [&_td]:border-r [&_td]:border-border [&_td:last-child]:border-r-0"
                  style={{ minWidth: headerGridMinimumWidth }}
                >
                  <POSGridColumns columns={headerGridColumns} />
                  <TableFooter className="border-0 bg-transparent">
                    <TableRow className="h-16 border-0 hover:bg-transparent">
                      {headerGridColumns.map(renderHeaderGridFooterCell)}
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            ) : (
              <div className="grid shrink-0 items-stretch border-t bg-card sm:grid-cols-[minmax(9rem,1fr)_minmax(9rem,1fr)_minmax(13rem,1.2fr)_minmax(30rem,1.8fr)]">
                <div className="border-b px-4 py-3 sm:border-r sm:border-b-0">
                  <Metric label="Subtotal" value={money(subtotal)} />
                </div>
                <div className="border-b px-4 py-3 sm:border-r sm:border-b-0">
                  <Metric label="Descuento" value={`-${money(discount)}`} />
                </div>
                <div className="flex items-baseline justify-end gap-2 border-b px-4 py-3 sm:border-r sm:border-b-0">
                  <span className="font-mono text-[10px] font-semibold uppercase text-muted-foreground">
                    Total a pagar
                  </span>
                  <strong className="font-mono text-2xl">{money(total)}</strong>
                </div>
                <div className="p-3">
                  <QuickChargeActions
                    buttonClassName="h-full min-h-12"
                    disabled={!lines.length}
                    onCharge={handleQuickCharge}
                  />
                </div>
              </div>
            )}
          </section>
        </div>
        )}
      </div>

      {!cashOpen ? (
        <div className="absolute inset-0 z-50 grid place-items-center bg-black/45 p-2 backdrop-blur-[2px] sm:p-4">
          <section
            role="dialog"
            aria-labelledby="open-cash-title"
            aria-describedby="open-cash-description"
            className="grid max-h-full w-[min(94vw,640px)] grid-rows-[auto_minmax(0,1fr)_auto] gap-4 overflow-hidden rounded-[4px] border bg-popover text-popover-foreground shadow-2xl"
          >
            <div className="flex flex-col gap-1 border-b px-5 py-4">
              <h2 id="open-cash-title" className="font-heading text-lg font-medium">Abrir caja</h2>
              <p id="open-cash-description" className="text-sm text-muted-foreground">
                Ingresa el saldo inicial para comenzar el turno.
              </p>
            </div>
          <div className="grid min-h-0 gap-4 overflow-y-auto overscroll-contain px-5 pb-2">
            <Field label="Saldo inicial" required>
              <div className="relative">
                <span className="absolute top-1/2 left-3 -translate-y-1/2 font-mono text-lg text-muted-foreground">$</span>
                <Input
                  type="number"
                  min="0"
                  value={initialBalance}
                  onChange={(event) => setInitialBalance(event.target.value)}
                  className="h-14 rounded-[4px] pl-8 text-right font-mono text-xl"
                  autoFocus
                />
              </div>
            </Field>
            <Field label="Vendedor / Cajero" required>
              <Select value={openingSeller} onValueChange={setOpeningSeller}>
                <SelectTrigger className="h-10 w-full rounded-[4px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {sellers.map((seller) => <SelectItem key={seller} value={seller}>{seller}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-[4px] border bg-muted/45 p-3 sm:grid-cols-4">
              <Metric label="Usuario" value="sromero" />
              <Metric label="Local" value="Casa Central" />
              <Metric label="Caja" value="Caja 01" />
              <Metric label="Moneda" value="ARS" />
            </div>
            <Field label="Observaciones">
              <Textarea
                value={openingNotes}
                onChange={(event) => setOpeningNotes(event.target.value)}
                placeholder="Aclaraciones opcionales de apertura"
                className="min-h-20 rounded-[4px]"
              />
            </Field>
          </div>
            <div className="flex flex-col-reverse gap-2 border-t bg-muted/40 px-5 py-4 sm:flex-row sm:justify-end">
              <Button variant="outline" onClick={onExit}>Salir</Button>
            <Button
              disabled={!initialBalance || Number(initialBalance) < 0 || !openingSeller}
              onClick={() => {
                setCashOpen(true)
                setSelectedSeller(openingSeller)
                setCashMovements([{
                  id: `cash-open-${Date.now()}`,
                  time: "08:10",
                  type: "Apertura",
                  description: openingNotes.trim() || "Saldo inicial",
                  amount: Number(initialBalance),
                }])
                setNotice("")
                focusScanner()
              }}
            >
              <WalletCards /> Abrir caja
            </Button>
            </div>
          </section>
        </div>
      ) : null}

      <CustomerQuickCreate
        open={customerDrawerOpen}
        onOpenChange={setCustomerDrawerOpen}
        onSave={(customer) => {
          setCustomers((current) => [customer, ...current])
          setSelectedCustomerId(customer.id)
          setCustomerDrawerOpen(false)
          setNotice(`${customer.name} creado y seleccionado sin perder el ticket.`)
          if (layout !== "header-grid") setBillingDrawerOpen(true)
          else focusScanner()
        }}
      />

      <BillingDetailsSheet
        key={`${billingDrawerOpen}-${selectedCustomerId}`}
        open={billingDrawerOpen}
        customer={selectedCustomer}
        customers={customers}
        seller={selectedSeller}
        onOpenChange={(open) => {
          setBillingDrawerOpen(open)
          if (!open) focusScanner()
        }}
        onCustomerChange={setSelectedCustomerId}
        onSellerChange={setSelectedSeller}
        onCreateCustomer={() => {
          setBillingDrawerOpen(false)
          setCustomerDrawerOpen(true)
        }}
        onSave={(customer) => {
          setCustomers((current) =>
            current.map((item) => (item.id === customer.id ? customer : item))
          )
          setBillingDrawerOpen(false)
          setNotice(`${customer.name}: datos de facturacion actualizados.`)
          focusScanner()
        }}
      />

      <Sheet
        open={cashDrawerOpen}
        onOpenChange={(open) => {
          setCashDrawerOpen(open)
          if (!open) focusScanner()
        }}
      >
        <SheetContent className="w-[min(94vw,420px)] gap-0 p-0 sm:max-w-none">
          <SheetHeader className="border-b px-5 py-4">
            <SheetTitle>Caja y turno</SheetTitle>
            <SheetDescription>
              Administra las operaciones fuera de la venta actual.
            </SheetDescription>
          </SheetHeader>

          <div className="min-h-0 flex-1 overflow-y-auto p-5">
            <section className="rounded-[4px] border bg-muted/35 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-mono text-[10px] font-semibold uppercase text-muted-foreground">
                    Turno actual
                  </div>
                  <div className="mt-1 font-medium">Caja 01</div>
                  <div className="text-xs text-muted-foreground">Abierta desde las 08:10</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-[10px] uppercase text-muted-foreground">Saldo</div>
                  <strong className="font-mono text-lg">{money(cashBalance)}</strong>
                </div>
              </div>
            </section>

            <section className="mt-5 border-t pt-5">
              <h3 className="text-sm font-semibold">Operaciones de caja</h3>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="h-10 rounded-[4px]"
                  onClick={() => {
                    setCashDrawerOpen(false)
                    setExchangeOpen(true)
                  }}
                >
                  <RotateCcw /> Cambio
                </Button>
                <Button
                  variant="outline"
                  className="h-10 rounded-[4px]"
                  onClick={() => {
                    setCashDrawerOpen(false)
                    setCashMovementOpen(true)
                  }}
                >
                  <CircleDollarSign /> Movimiento
                </Button>
              </div>
            </section>

            <section className="mt-5 border-t pt-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Movimientos recientes</h3>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {cashMovements.length} en turno
                </span>
              </div>
              <div className="mt-2">
                {[...cashMovements].reverse().map((movement) => (
                  <div key={movement.id} className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-2 border-t py-3 text-xs">
                    <span className="font-mono text-muted-foreground">{movement.time}</span>
                    <div className="min-w-0">
                      <div className="truncate font-medium">{movement.type}</div>
                      <div className="truncate text-[11px] text-muted-foreground">{movement.description}</div>
                    </div>
                    <span className={cn("font-mono font-medium", movement.amount < 0 ? "text-destructive" : "text-emerald-700 dark:text-emerald-400")}>
                      {movement.amount < 0 ? "-" : "+"}{money(Math.abs(movement.amount))}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <SheetFooter className="border-t bg-card px-5 py-4">
            <Button
              variant="outline"
              className="h-10 w-full rounded-[4px] border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => {
                if (ticket.length) {
                  setNotice("Resuelve el ticket actual antes de cerrar la caja.")
                  setCashDrawerOpen(false)
                } else {
                  setCashDrawerOpen(false)
                  setCashOpen(false)
                }
              }}
            >
              Cerrar caja
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <CashMovementDialog
        open={cashMovementOpen}
        currentBalance={cashBalance}
        onOpenChange={setCashMovementOpen}
        onSave={(movement) => {
          setCashMovements((current) => [...current, {
            ...movement,
            id: `cash-movement-${Date.now()}`,
            time: new Intl.DateTimeFormat("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date()),
          }])
          setCashMovementOpen(false)
          setNotice(`${movement.type} de ${money(Math.abs(movement.amount))} registrado en caja.`)
          focusScanner()
        }}
      />

      <PaymentDialog
        key={`${payment.open}-${payment.method}-${payment.total}-${payment.purpose}`}
        open={payment.open}
        total={payment.total}
        initialMethod={payment.method}
        purpose={payment.purpose}
        onOpenChange={(open) => setPayment((current) => ({ ...current, open }))}
        onComplete={(rows) => {
          setPayment((current) => ({ ...current, open: false }))
          const paidAmount = rows.reduce((sum, row) => sum + row.amount, 0)
          const cashAmount = rows
            .filter((row) => row.method === "Efectivo")
            .reduce((sum, row) => sum + row.amount, 0)
          const netCashAmount = Math.max(0, cashAmount - Math.max(0, paidAmount - payment.total))
          if (netCashAmount > 0) {
            setCashMovements((current) => [...current, {
              id: `cash-sale-${Date.now()}`,
              time: new Intl.DateTimeFormat("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date()),
              type: "Venta",
              description: payment.purpose === "sale"
                ? quickChargeMode === "cash" ? "Venta en efectivo" : "Factura B 0004-00018432"
                : "Diferencia por cambio",
              amount: netCashAmount,
            }])
          }
          if (payment.purpose === "sale") {
            setTicket([])
            setNotice(
              quickChargeMode === "cash"
                ? "Venta en efectivo registrada. Nuevo ticket listo."
                : quickChargeMode === "electronic-card"
                  ? "Factura B 0004-00018432 emitida y cobrada con tarjeta. Nuevo ticket listo."
                  : "Factura B 0004-00018432 emitida y cobrada en efectivo. Nuevo ticket listo."
            )
          } else {
            setNotice("Diferencia del cambio cobrada y movimiento confirmado.")
          }
          focusScanner()
        }}
      />

      <ExchangeDialog
        open={exchangeOpen}
        products={products}
        onOpenChange={(open) => {
          setExchangeOpen(open)
          if (!open) focusScanner()
        }}
        onPositive={(amount) => {
          setExchangeOpen(false)
          openPayment("Efectivo", amount, "exchange")
        }}
        onResolved={(message) => {
          setExchangeOpen(false)
          setNotice(message)
          focusScanner()
        }}
      />
    </div>
  )
}
