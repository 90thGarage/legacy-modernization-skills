"use client"

import { useMemo, useState } from "react"
import {
  AlertTriangle,
  Barcode,
  BoxSelect,
  Check,
  FilePlus2,
  Focus,
  Grid2X2,
  Info,
  Minus,
  Plus,
  Printer,
  QrCode,
  Save,
  Scale,
  Search,
  Tags,
  Type,
} from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type {
  LabelDesign,
  LabelElement,
  LabelElementKind,
  LabelOrientation,
  LabelPrintRow,
  Product,
} from "../types"

const elementTools: {
  kind: LabelElementKind
  label: string
  icon: typeof Type
}[] = [
  { kind: "text", label: "Agregar texto", icon: Type },
  { kind: "barcode", label: "Código de barras", icon: Barcode },
  { kind: "qr", label: "Código QR", icon: QrCode },
  { kind: "border", label: "Recuadro / borde", icon: BoxSelect },
]

const blankDesign = (): LabelDesign => ({
  id: `label-${crypto.randomUUID()}`,
  name: "",
  widthMm: 50,
  heightMm: 25,
  orientation: "landscape",
  elements: [],
})

function formatCurrency(value: number | null) {
  if (value === null) return "Sin precio"
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 2,
  }).format(value)
}

function LabelElementPreview({ element }: { element: LabelElement }) {
  if (element.kind === "barcode") {
    return (
      <div className="grid gap-0.5 text-center">
        <div
          className="h-8 w-24 bg-foreground"
          style={{
            maskImage:
              "repeating-linear-gradient(90deg,#000 0 2px,transparent 2px 4px,#000 4px 5px,transparent 5px 8px)",
          }}
        />
        <span className="font-mono text-[7px]">7790000000000</span>
      </div>
    )
  }

  if (element.kind === "qr") {
    return (
      <div className="grid size-10 grid-cols-3 gap-0.5 border-2 border-foreground p-0.5">
        {Array.from({ length: 9 }).map((_, index) => (
          <span
            key={index}
            className={index === 4 || index === 7 ? "bg-background" : "bg-foreground"}
          />
        ))}
      </div>
    )
  }

  if (element.kind === "border") {
    return <div className="h-12 w-28 border-2 border-foreground" />
  }

  return <span className="text-xs font-semibold">Nombre del artículo</span>
}

function LabelPreview({
  design,
  selectedElementId,
  onSelectElement,
  product,
}: {
  design: LabelDesign
  selectedElementId?: string
  onSelectElement?: (id: string) => void
  product?: Product
}) {
  const width = design.widthMm > 0 ? design.widthMm : 50
  const height = design.heightMm > 0 ? design.heightMm : 25

  return (
    <div
      className="relative mx-auto w-full max-w-[520px] overflow-hidden border bg-white text-black shadow-sm"
      style={{ aspectRatio: `${width}/${height}` }}
      aria-label={`Vista previa de ${design.name || "diseño sin nombre"}`}
    >
      {design.elements.length === 0 ? (
        <div className="absolute inset-0 grid place-items-center px-4 text-center text-xs text-neutral-500">
          Agregá un elemento desde Herramientas
        </div>
      ) : null}
      {design.elements.map((element) => (
        <button
          key={element.id}
          type="button"
          className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-[2px] p-1 text-left outline-none ${
            selectedElementId === element.id
              ? "ring-2 ring-[#0057ff] ring-offset-1"
              : onSelectElement
                ? "hover:ring-1 hover:ring-[#0057ff]/60"
                : ""
          }`}
          style={{ left: `${element.x}%`, top: `${element.y}%` }}
          onClick={() => onSelectElement?.(element.id)}
          aria-label={`Seleccionar ${element.label}`}
        >
          {product && element.kind === "text" ? (
            <span className="text-xs font-semibold">{product.name}</span>
          ) : product && element.kind === "barcode" ? (
            <div className="grid gap-0.5 text-center">
              <div
                className="h-8 w-24 bg-black"
                style={{
                  maskImage:
                    "repeating-linear-gradient(90deg,#000 0 2px,transparent 2px 4px,#000 4px 5px,transparent 5px 8px)",
                }}
              />
              <span className="font-mono text-[7px]">{product.barcode}</span>
            </div>
          ) : (
            <LabelElementPreview element={element} />
          )}
        </button>
      ))}
    </div>
  )
}

export function LabelDesignWorkspace({
  designs,
  onSave,
  enteredFromPrint,
  onReturnToPrint,
}: {
  designs: LabelDesign[]
  onSave: (design: LabelDesign) => void
  enteredFromPrint: boolean
  onReturnToPrint: (savedDesignId?: string) => void
}) {
  const [draft, setDraft] = useState<LabelDesign>(() => blankDesign())
  const [selectedElementId, setSelectedElementId] = useState<string>()
  const [dirty, setDirty] = useState(false)
  const [zoom, setZoom] = useState(100)
  const [notice, setNotice] = useState("")
  const [errors, setErrors] = useState<{ name?: string; size?: string }>({})
  const [confirmAction, setConfirmAction] = useState<null | (() => void)>(null)

  const selectedElement = draft.elements.find(
    (element) => element.id === selectedElementId
  )

  const mutateDraft = (next: LabelDesign) => {
    setDraft(next)
    setDirty(true)
    setNotice("")
  }

  const runGuarded = (action: () => void) => {
    if (dirty) {
      setConfirmAction(() => action)
      return
    }
    action()
  }

  const startNew = () => {
    setDraft(blankDesign())
    setSelectedElementId(undefined)
    setDirty(false)
    setErrors({})
    setNotice("")
  }

  const loadDesign = (design: LabelDesign) => {
    setDraft(structuredClone(design))
    setSelectedElementId(undefined)
    setDirty(false)
    setErrors({})
    setNotice("")
  }

  const addElement = (kind: LabelElementKind, label: string) => {
    const basePosition: Record<LabelElementKind, { x: number; y: number }> = {
      text: { x: 50, y: 25 },
      barcode: { x: 50, y: 65 },
      qr: { x: 78, y: 55 },
      border: { x: 50, y: 50 },
    }
    const sameKindCount = draft.elements.filter(
      (element) => element.kind === kind
    ).length
    const element: LabelElement = {
      id: `element-${crypto.randomUUID()}`,
      kind,
      label,
      x: Math.min(85, basePosition[kind].x + sameKindCount * 5),
      y: Math.min(80, basePosition[kind].y + sameKindCount * 5),
    }
    mutateDraft({ ...draft, elements: [...draft.elements, element] })
    setSelectedElementId(element.id)
  }

  const save = () => {
    const nextErrors: { name?: string; size?: string } = {}
    if (!draft.name.trim()) nextErrors.name = "Ingresá un nombre para guardar el diseño."
    if (draft.widthMm <= 0 || draft.heightMm <= 0) {
      nextErrors.size = "El ancho y el alto deben ser mayores a cero."
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    const saved = { ...draft, name: draft.name.trim() }
    onSave(saved)
    setDraft(saved)
    setDirty(false)
    setNotice("Diseño guardado y disponible para imprimir.")
    if (enteredFromPrint) onReturnToPrint(saved.id)
  }

  return (
    <main className="flex h-full min-h-0 flex-col bg-muted/25">
      <div className="grid shrink-0 gap-3 border-b bg-background px-3 py-3 sm:flex sm:items-center sm:justify-between sm:px-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-lg font-semibold">
              {draft.name || "Nuevo diseño"}
            </h2>
            <Badge variant="outline">Datos simulados</Badge>
            {dirty ? <Badge variant="secondary">Sin guardar</Badge> : null}
          </div>
          <p className="text-xs text-muted-foreground">
            Diseñá una plantilla reutilizable para las etiquetas del catálogo.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          {enteredFromPrint ? (
            <Button
              variant="outline"
              onClick={() => runGuarded(() => onReturnToPrint())}
            >
              Volver a impresión
            </Button>
          ) : null}
          <Button onClick={save}>
            <Save /> Guardar diseño
          </Button>
        </div>
      </div>

      <div
        data-testid="label-designer-grid"
        className="grid min-h-0 flex-1 gap-3 overflow-y-auto p-3 xl:grid-cols-[200px_minmax(300px,1fr)_190px_210px] lg:grid-cols-[190px_minmax(320px,1fr)_210px]"
      >
        <aside className="flex min-h-0 flex-col overflow-hidden rounded-[4px] border bg-card">
          <section className="grid gap-2 border-b p-3">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-wide text-primary">
              Herramientas
            </h3>
            {elementTools.map((tool) => {
              const Icon = tool.icon
              return (
                <Button
                  key={tool.kind}
                  variant="outline"
                  className="justify-start"
                  onClick={() => addElement(tool.kind, tool.label)}
                >
                  <Icon /> {tool.label}
                </Button>
              )
            })}
          </section>

          <section className="grid gap-2 border-b p-3">
            <label className="grid gap-1">
              <span className="font-mono text-[11px] font-semibold uppercase text-muted-foreground">
                Nombre del diseño
              </span>
              <Input
                value={draft.name}
                onChange={(event) =>
                  mutateDraft({ ...draft, name: event.target.value })
                }
                placeholder="Ej: Góndola 50 × 25"
                aria-invalid={Boolean(errors.name)}
              />
            </label>
            {errors.name ? (
              <p className="text-xs text-destructive">{errors.name}</p>
            ) : null}
          </section>

          <section className="flex min-h-0 flex-1 flex-col gap-2 p-3">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-xs font-semibold uppercase tracking-wide text-primary">
                Diseños
              </h3>
              <Button size="sm" onClick={() => runGuarded(startNew)}>
                <Plus /> Nuevo
              </Button>
            </div>
            <div className="grid min-h-0 gap-1 overflow-y-auto">
              {designs.length ? (
                designs.map((design) => (
                  <button
                    key={design.id}
                    type="button"
                    onClick={() => runGuarded(() => loadDesign(design))}
                    className={`rounded-[4px] border px-2 py-2 text-left text-xs hover:bg-muted ${
                      draft.id === design.id ? "border-primary bg-primary/5" : ""
                    }`}
                  >
                    <span className="block truncate font-semibold">{design.name}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {design.widthMm} × {design.heightMm} mm
                    </span>
                  </button>
                ))
              ) : (
                <div className="grid place-items-center rounded-[4px] border border-dashed p-4 text-center text-xs text-muted-foreground">
                  Todavía no hay diseños guardados.
                </div>
              )}
            </div>
          </section>
        </aside>

        <section className="relative grid min-h-[360px] place-items-center overflow-hidden rounded-[4px] border bg-[#e9edf5] p-8 dark:bg-[#202b40]">
          <div className="absolute top-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-[4px] border bg-card p-1 shadow-sm">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Alejar"
              onClick={() => setZoom((current) => Math.max(50, current - 10))}
            >
              <Minus />
            </Button>
            <span className="w-12 text-center font-mono text-xs">{zoom}%</span>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Acercar"
              onClick={() => setZoom((current) => Math.min(180, current + 10))}
            >
              <Plus />
            </Button>
            <div className="mx-1 h-5 w-px bg-border" />
            <Button variant="ghost" size="sm" onClick={() => setZoom(100)}>
              <Focus /> Ajustar al lienzo
            </Button>
          </div>
          <div
            className="w-full origin-center transition-transform"
            style={{ transform: `scale(${zoom / 100})` }}
          >
            <div className="relative mx-auto max-w-[560px] p-5">
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    "linear-gradient(#9db9ea 1px,transparent 1px),linear-gradient(90deg,#9db9ea 1px,transparent 1px)",
                  backgroundSize: "16px 16px",
                }}
              />
              <div className="relative">
                <LabelPreview
                  design={draft}
                  selectedElementId={selectedElementId}
                  onSelectElement={setSelectedElementId}
                />
              </div>
            </div>
          </div>
        </section>

        <aside className="min-h-0 rounded-[4px] border bg-card p-3">
          <h3 className="border-b pb-2 font-mono text-xs font-semibold uppercase tracking-wide text-primary">
            Propiedades
          </h3>
          {selectedElement ? (
            <div className="grid gap-3 pt-3">
              <div>
                <p className="text-sm font-semibold">{selectedElement.label}</p>
                <p className="text-xs text-muted-foreground">
                  Elemento seleccionado en el lienzo.
                </p>
              </div>
              <Alert>
                <Info />
                <AlertTitle>Placeholder de dominio</AlertTitle>
                <AlertDescription>
                  Las propiedades específicas de cada elemento requieren validación.
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <div className="grid place-items-center py-10 text-center text-xs text-muted-foreground">
              Seleccioná un elemento en el lienzo para editar sus propiedades.
            </div>
          )}
        </aside>

        <aside className="min-h-0 rounded-[4px] border bg-card p-3 lg:col-start-3 xl:col-start-auto">
          <h3 className="border-b pb-2 font-mono text-xs font-semibold uppercase tracking-wide text-primary">
            Configuración de página
          </h3>
          <div className="grid gap-3 pt-3">
            <label className="grid gap-1">
              <span className="font-mono text-[11px] font-semibold uppercase text-muted-foreground">
                Formato
              </span>
              <Select defaultValue="custom">
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="custom">Formato personalizado</SelectItem>
                </SelectContent>
              </Select>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label className="grid gap-1">
                <span className="font-mono text-[11px] font-semibold uppercase text-muted-foreground">
                  Ancho (mm)
                </span>
                <Input
                  type="number"
                  min="1"
                  value={draft.widthMm}
                  onChange={(event) =>
                    mutateDraft({ ...draft, widthMm: Number(event.target.value) })
                  }
                  aria-invalid={Boolean(errors.size)}
                />
              </label>
              <label className="grid gap-1">
                <span className="font-mono text-[11px] font-semibold uppercase text-muted-foreground">
                  Alto (mm)
                </span>
                <Input
                  type="number"
                  min="1"
                  value={draft.heightMm}
                  onChange={(event) =>
                    mutateDraft({ ...draft, heightMm: Number(event.target.value) })
                  }
                  aria-invalid={Boolean(errors.size)}
                />
              </label>
            </div>
            {errors.size ? (
              <p className="text-xs text-destructive">{errors.size}</p>
            ) : null}
            <fieldset className="grid gap-2 rounded-[4px] border p-2">
              <legend className="px-1 font-mono text-[11px] font-semibold uppercase text-muted-foreground">
                Orientación
              </legend>
              {(
                [
                  ["portrait", "Vertical"],
                  ["landscape", "Apaisado"],
                  ["printer", "De la impresora"],
                ] as [LabelOrientation, string][]
              ).map(([value, label]) => (
                <label key={value} className="flex items-center gap-2 text-xs">
                  <input
                    type="radio"
                    name="label-orientation"
                    value={value}
                    checked={draft.orientation === value}
                    onChange={() => mutateDraft({ ...draft, orientation: value })}
                    className="accent-[#0057ff]"
                  />
                  {label}
                </label>
              ))}
            </fieldset>
            {notice ? (
              <div role="status" className="flex items-center gap-2 text-xs text-emerald-700">
                <Check className="size-4" /> {notice}
              </div>
            ) : null}
          </div>
        </aside>
      </div>

      <Dialog open={Boolean(confirmAction)} onOpenChange={(open) => !open && setConfirmAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Descartar cambios sin guardar?</DialogTitle>
            <DialogDescription>
              Los cambios del diseño actual no se podrán recuperar.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmAction(null)}>
              Seguir editando
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                const action = confirmAction
                setConfirmAction(null)
                action?.()
              }}
            >
              Descartar cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}

export function LabelPrintWorkspace({
  products,
  designs,
  selectedDesignId,
  onSelectedDesignChange,
  rows,
  onRowsChange,
  onCreateDesign,
}: {
  products: Product[]
  designs: LabelDesign[]
  selectedDesignId: string
  onSelectedDesignChange: (id: string) => void
  rows: LabelPrintRow[]
  onRowsChange: (rows: LabelPrintRow[]) => void
  onCreateDesign: () => void
}) {
  const [query, setQuery] = useState("")
  const [notice, setNotice] = useState("")

  const visibleProducts = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("es")
    return products
      .filter((product) => product.active)
      .filter((product) =>
        normalized
          ? [product.code, product.name, product.barcode].some((value) =>
              value.toLocaleLowerCase("es").includes(normalized)
            )
          : true
      )
  }, [products, query])

  const selectedDesign = designs.find((design) => design.id === selectedDesignId)
  const rowsWithQuantity = rows.filter((row) => row.quantity > 0)
  const totalLabels = rowsWithQuantity.reduce((total, row) => total + row.quantity, 0)
  const previewProduct = products.find(
    (product) => product.id === rowsWithQuantity[0]?.productId
  )
  const disabledReason = !selectedDesign
    ? "Seleccioná o creá un diseño para continuar."
    : totalLabels === 0
      ? "Cargá al menos una cantidad en la tabla."
      : ""

  const updateRow = (productId: string, patch: Partial<LabelPrintRow>) => {
    const current = rows.find((row) => row.productId === productId)
    if (current) {
      onRowsChange(
        rows.map((row) => (row.productId === productId ? { ...row, ...patch } : row))
      )
    } else {
      onRowsChange([...rows, { productId, quantity: 0, weight: "", ...patch }])
    }
    setNotice("")
  }

  return (
    <main className="flex h-full min-h-0 flex-col gap-3 bg-muted/25 p-3">
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <Printer className="size-5 text-primary" />
        <h2 className="text-lg font-semibold">Impresión de etiquetas</h2>
        <Badge variant="outline">Datos simulados</Badge>
      </div>

      <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[minmax(0,1fr)_300px]">
        <section className="flex min-h-0 flex-col overflow-hidden rounded-[4px] border bg-card">
          <div className="flex shrink-0 flex-wrap items-center gap-2 border-b p-3">
            <div className="relative min-w-0 basis-full sm:min-w-[280px] sm:flex-1 sm:basis-auto">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar por código, descripción o código de barras"
                className="pl-9"
                aria-label="Buscar artículos para imprimir"
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400">
              <Scale className="size-4" />
              Sin balanzas configuradas · no bloquea artículos por unidad
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-auto">
            <Table className="table-fixed sm:table-auto">
              <TableHeader className="sticky top-0 z-10 bg-muted/90 backdrop-blur-sm">
                <TableRow>
                  <TableHead className="w-14 font-mono text-[11px] uppercase sm:w-auto">Código</TableHead>
                  <TableHead className="font-mono text-[11px] uppercase">Descripción</TableHead>
                  <TableHead className="hidden font-mono text-[11px] uppercase md:table-cell">Cód. barras</TableHead>
                  <TableHead className="hidden text-right font-mono text-[11px] uppercase sm:table-cell">Precio vta.</TableHead>
                  <TableHead className="w-20 font-mono text-[11px] uppercase sm:w-28">Cantidad</TableHead>
                  <TableHead className="hidden w-28 font-mono text-[11px] uppercase lg:table-cell">Peso</TableHead>
                  <TableHead className="hidden w-12 text-center lg:table-cell"><Scale className="mx-auto size-4" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleProducts.length ? (
                  visibleProducts.map((product) => {
                    const row = rows.find((item) => item.productId === product.id)
                    return (
                      <TableRow key={product.id}>
                        <TableCell className="font-mono text-xs">{product.code}</TableCell>
                        <TableCell className="min-w-0">
                          <div className="w-full min-w-0 truncate font-medium sm:max-w-[360px]">{product.name}</div>
                          <div className="text-[11px] text-muted-foreground">{product.unit}</div>
                        </TableCell>
                        <TableCell className="hidden font-mono text-xs md:table-cell">{product.barcode}</TableCell>
                        <TableCell className="hidden text-right font-mono text-xs font-semibold sm:table-cell">
                          {formatCurrency(product.salePrice)}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            step="1"
                            value={row?.quantity ?? 0}
                            onChange={(event) =>
                              updateRow(product.id, {
                                quantity: Math.max(0, Number(event.target.value) || 0),
                              })
                            }
                            aria-label={`Cantidad de etiquetas para ${product.name}`}
                            className="w-16 font-mono sm:w-24"
                          />
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <Input
                            value={row?.weight ?? ""}
                            disabled
                            placeholder="—"
                            aria-label={`Peso para ${product.name}, regla pendiente`}
                            title="La regla de peso requiere validación de dominio"
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell className="hidden text-center lg:table-cell">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            disabled
                            title="Integración con balanza pendiente"
                            aria-label="Balanza no configurada"
                          >
                            <Scale />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-40 text-center text-muted-foreground">
                      <Search className="mx-auto mb-2 size-5" />
                      No se encontraron artículos. Probá con otro código o descripción.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t bg-card px-3 py-2 text-xs">
            <span>
              <strong>{visibleProducts.length}</strong> artículo(s) en la lista
            </span>
            <div className="flex items-center gap-4 font-mono">
              <span>Con cantidad: <strong>{rowsWithQuantity.length}</strong></span>
              <span>Total etiquetas: <strong>{totalLabels}</strong></span>
            </div>
          </div>
        </section>

        <aside className="flex min-h-0 flex-col rounded-[4px] border bg-card p-3 lg:sticky lg:top-3">
          <h3 className="border-b pb-2 text-base font-semibold text-primary">Imprimir</h3>
          <div className="grid gap-3 pt-3">
            <label className="grid gap-1">
              <span className="font-mono text-[11px] font-semibold uppercase text-muted-foreground">
                Diseño de etiqueta
              </span>
              {designs.length ? (
                <Select value={selectedDesignId} onValueChange={onSelectedDesignChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar diseño" />
                  </SelectTrigger>
                  <SelectContent>
                    {designs.map((design) => (
                      <SelectItem key={design.id} value={design.id}>
                        {design.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Alert className="border-amber-600/50 text-amber-800 dark:text-amber-300">
                  <AlertTriangle />
                  <AlertTitle>No hay diseños guardados</AlertTitle>
                  <AlertDescription>
                    Creá uno para poder preparar la impresión.
                  </AlertDescription>
                </Alert>
              )}
            </label>
            {!designs.length ? (
              <Button variant="outline" onClick={onCreateDesign}>
                <FilePlus2 /> Crear diseño
              </Button>
            ) : null}
          </div>

          <div className="mt-3 flex min-h-0 flex-1 flex-col gap-2">
            <span className="text-xs font-medium text-muted-foreground">Vista previa</span>
            <div className="grid min-h-[220px] flex-1 place-items-center overflow-hidden rounded-[4px] border bg-muted/30 p-4">
              {selectedDesign ? (
                totalLabels > 0 && previewProduct ? (
                  <div className="grid w-full gap-3">
                    <LabelPreview design={selectedDesign} product={previewProduct} />
                    <p className="text-center text-xs text-muted-foreground">
                      Muestra: {previewProduct.name} · {totalLabels} etiqueta(s)
                    </p>
                  </div>
                ) : (
                  <div className="text-center text-xs text-muted-foreground">
                    <Grid2X2 className="mx-auto mb-2 size-6" />
                    Cargá cantidades en la tabla para completar la vista previa.
                  </div>
                )
              ) : (
                <div className="text-center text-xs text-muted-foreground">
                  <Tags className="mx-auto mb-2 size-6" />
                  Seleccioná un diseño.
                </div>
              )}
            </div>
          </div>

          <div className="mt-3 grid shrink-0 gap-2 border-t pt-3">
            <div className="flex items-center justify-between text-sm">
              <span>Total a imprimir</span>
              <strong className="font-mono text-lg">{totalLabels}</strong>
            </div>
            {disabledReason ? (
              <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
                <Info className="mt-0.5 size-3.5 shrink-0" /> {disabledReason}
              </p>
            ) : null}
            <Button
              disabled={Boolean(disabledReason)}
              onClick={() =>
                setNotice(
                  `Impresión simulada: se abriría el diálogo del sistema para ${totalLabels} etiqueta(s).`
                )
              }
            >
              <Printer /> Imprimir
            </Button>
            <p className="text-center text-[11px] text-muted-foreground">
              Se abrirá el diálogo del sistema para elegir la impresora.
            </p>
            {notice ? (
              <div role="status" className="flex items-start gap-2 rounded-[4px] border border-emerald-600/30 bg-emerald-500/5 p-2 text-xs text-emerald-700 dark:text-emerald-300">
                <Check className="mt-0.5 size-4 shrink-0" /> {notice}
              </div>
            ) : null}
          </div>
        </aside>
      </div>
    </main>
  )
}
