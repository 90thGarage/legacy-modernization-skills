"use client"

import {
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react"
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  Grid2X2,
  List,
  PackagePlus,
  Plus,
  Save,
  Search,
  ShieldAlert,
  Trash2,
  Upload,
  Warehouse as WarehouseIcon,
} from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { money } from "../mock-data"
import type { Category, Customer, Product, Supplier, Warehouse } from "../types"
import {
  Field,
  Metric,
  ProductImage,
  RowActions,
  SectionHeading,
  StatusText,
} from "./shared"
import { ClassificationFields } from "./categories-workspace"

type EditorMode = "create" | "edit" | "duplicate"

type Column<T> = {
  label: string
  className?: string
  render: (item: T) => ReactNode
}

type DetailActions = {
  edit: () => void
  duplicate: () => void
  remove: () => void
}

const drawerClass =
  "w-[min(96vw,960px)] gap-0 p-0 sm:max-w-none md:w-[48vw] md:min-w-[720px]"
const editorDrawerClass =
  "w-[min(98vw,1180px)] gap-0 p-0 sm:max-w-none md:min-w-[760px] lg:w-[72vw] lg:min-w-[980px] xl:w-[64vw]"

function nextId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function CompactSelect({
  value,
  onValueChange,
  placeholder,
  options,
  className,
}: {
  value: string
  onValueChange: (value: string) => void
  placeholder: string
  options: string[]
  className?: string
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={cn("h-10 w-full rounded-[4px] data-[size=default]:h-10", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function Stepper({
  steps,
  activeStep,
  availableSteps,
  onStepChange,
}: {
  steps: { label: string; details: string }[]
  activeStep: number
  availableSteps: number[]
  onStepChange: (step: number) => void
}) {
  return (
    <nav aria-label="Pasos del formulario" className="w-full">
      <div className="flex items-center">
        {steps.map((step, index) => {
          const enabled = availableSteps.includes(index)
          const active = activeStep === index
          const completed = index < activeStep
          return (
            <div key={step.label} className={cn("flex items-center", index < steps.length - 1 && "flex-1")}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    aria-current={active ? "step" : undefined}
                    aria-disabled={!enabled}
                    aria-label={`Paso ${index + 1}: ${step.label}`}
                    onClick={() => enabled && onStepChange(index)}
                    className={cn(
                      "grid size-7 shrink-0 place-items-center rounded-full border font-mono text-[11px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      active && "border-primary bg-primary text-primary-foreground",
                      completed && "border-primary bg-primary/10 text-primary",
                      !active && !completed && "bg-card text-muted-foreground",
                      enabled ? "cursor-pointer hover:border-primary hover:text-primary" : "cursor-not-allowed opacity-50"
                    )}
                  >
                    {index + 1}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-72 rounded-[4px] p-3">
                  <p className="font-semibold">{index + 1}. {step.label}</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">{step.details}</p>
                  {!enabled ? <p className="mt-1 text-xs">Se habilita después de guardar los datos mínimos.</p> : null}
                </TooltipContent>
              </Tooltip>
              {index < steps.length - 1 ? <span aria-hidden="true" className={cn("mx-2 h-px flex-1 bg-border", completed && "bg-primary/50")} /> : null}
            </div>
          )
        })}
      </div>
    </nav>
  )
}

function DeleteDialog({
  open,
  label,
  entityName,
  onOpenChange,
  onConfirm,
}: {
  open: boolean
  label: string
  entityName: string
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Eliminar {entityName}</DialogTitle>
          <DialogDescription>
            Se eliminara <strong className="text-foreground">{label}</strong> de
            los datos del prototipo. Esta accion no afecta ningun sistema real.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            <Trash2 /> Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function EntityWorkspace<T extends { id: string }>({
  title,
  createLabel,
  entityName,
  items,
  setItems,
  columns,
  getLabel,
  getSearchText,
  searchPlaceholder,
  toolbarFilters,
  filterItem,
  renderPrimary,
  renderDetail,
  renderEditor,
}: {
  title: string
  createLabel: string
  entityName: string
  items: T[]
  setItems: Dispatch<SetStateAction<T[]>>
  columns: Column<T>[]
  getLabel: (item: T) => string
  getSearchText: (item: T) => string
  searchPlaceholder: string
  toolbarFilters?: ReactNode
  filterItem?: (item: T) => boolean
  renderPrimary?: (props: {
    items: T[]
    columns: Column<T>[]
    openDetail: (item: T) => void
    actionsFor: (item: T) => DetailActions
  }) => ReactNode
  renderDetail: (item: T, actions: DetailActions) => ReactNode
  renderEditor: (props: {
    mode: EditorMode
    item?: T
    onCancel: () => void
    onSave: (item: T, keepOpen: boolean) => T
  }) => ReactNode
}) {
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<T | null>(null)
  const [editor, setEditor] = useState<{
    mode: EditorMode
    item?: T
  } | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<T | null>(null)

  const filteredItems = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("es")
    return items.filter((item) => {
      const matchesSearch =
        !query || getSearchText(item).toLocaleLowerCase("es").includes(query)
      return matchesSearch && (filterItem ? filterItem(item) : true)
    })
  }, [filterItem, getSearchText, items, search])

  const openEditor = (mode: EditorMode, item?: T) => {
    setSelected(null)
    setEditor({ mode, item })
  }

  const saveItem = (item: T, keepOpen: boolean) => {
    setItems((current) => {
      const exists = current.some((candidate) => candidate.id === item.id)
      return exists
        ? current.map((candidate) => (candidate.id === item.id ? item : candidate))
        : [item, ...current]
    })
    if (!keepOpen) {
      setEditor(null)
      setSelected(item)
    }
    return item
  }

  const actionsFor = (item: T): DetailActions => ({
    edit: () => openEditor("edit", item),
    duplicate: () => openEditor("duplicate", item),
    remove: () => {
      setSelected(null)
      setDeleteTarget(item)
    },
  })

  return (
    <div className="flex h-full min-h-0 flex-col bg-card">
      <section className="shrink-0 px-4 pt-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">{title}</h2>
          <Button className="h-10 rounded-[4px] font-mono" onClick={() => openEditor("create")}>
            <Plus /> {createLabel}
          </Button>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <div className="relative min-w-[260px] flex-1 md:max-w-xl">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={searchPlaceholder}
              className="h-10 rounded-[4px] bg-card pl-9"
            />
          </div>
          {toolbarFilters}
        </div>
      </section>

      {renderPrimary ? (
        renderPrimary({
          items: filteredItems,
          columns,
          openDetail: setSelected,
          actionsFor,
        })
      ) : (
        <div className="min-h-0 flex-1 overflow-auto p-3 md:p-4">
          <div className="grid gap-2 md:hidden">
            {filteredItems.length ? (
              filteredItems.map((item) => (
                <article
                  key={item.id}
                  tabIndex={0}
                  role="button"
                  className="rounded-[4px] border bg-card p-3 text-left outline-none transition hover:border-primary focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={() => setSelected(item)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault()
                      setSelected(item)
                    }
                  }}
                >
                  <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                    {columns.map((column, index) => (
                      <div
                        key={column.label}
                        className={cn("min-w-0", index === 1 && "col-span-2")}
                      >
                        <div className="font-mono text-[9px] font-semibold uppercase text-muted-foreground">
                          {column.label}
                        </div>
                        <div className="mt-0.5 min-w-0 truncate text-sm">
                          {column.render(item)}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 border-t pt-2">
                    <RowActions
                      onEdit={() => openEditor("edit", item)}
                      onDuplicate={() => openEditor("duplicate", item)}
                      onDelete={() => setDeleteTarget(item)}
                    />
                  </div>
                </article>
              ))
            ) : (
              <EmptyResults />
            )}
          </div>
          <div className="hidden min-w-[880px] overflow-hidden rounded-[4px] border bg-card md:block">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-muted/95 backdrop-blur-sm">
                <TableRow className="hover:bg-transparent">
                  {columns.map((column) => (
                    <TableHead
                      key={column.label}
                      className={cn(
                        "h-9 font-mono text-[10px] font-semibold uppercase",
                        column.className
                      )}
                    >
                      {column.label}
                    </TableHead>
                  ))}
                  <TableHead className="sticky right-0 h-9 w-[112px] bg-muted/95 text-right font-mono text-[10px] font-semibold uppercase">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.length ? (
                  filteredItems.map((item) => (
                    <TableRow
                      key={item.id}
                      tabIndex={0}
                      className="h-11 cursor-pointer focus-visible:bg-muted focus-visible:outline-none"
                      onClick={() => setSelected(item)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") setSelected(item)
                      }}
                    >
                      {columns.map((column) => (
                        <TableCell
                          key={column.label}
                          className={cn("py-2 text-xs", column.className)}
                        >
                          {column.render(item)}
                        </TableCell>
                      ))}
                      <TableCell className="sticky right-0 bg-card py-1.5">
                        <RowActions
                          onEdit={() => openEditor("edit", item)}
                          onDuplicate={() => openEditor("duplicate", item)}
                          onDelete={() => setDeleteTarget(item)}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length + 1}
                      className="h-48 text-center"
                    >
                      <div className="mx-auto grid max-w-sm justify-items-center gap-2">
                        <Search className="size-6 text-muted-foreground" />
                        <strong>No hay resultados</strong>
                        <span className="text-xs text-muted-foreground">
                          Revisa la busqueda o los filtros activos.
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      <Sheet open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent className={drawerClass}>
          {selected ? renderDetail(selected, actionsFor(selected)) : null}
        </SheetContent>
      </Sheet>

      <Sheet open={Boolean(editor)} onOpenChange={(open) => !open && setEditor(null)}>
        <SheetContent className={editorDrawerClass}>
          {editor
            ? renderEditor({
                mode: editor.mode,
                item: editor.item,
                onCancel: () => setEditor(null),
                onSave: saveItem,
              })
            : null}
        </SheetContent>
      </Sheet>

      <DeleteDialog
        open={Boolean(deleteTarget)}
        label={deleteTarget ? getLabel(deleteTarget) : ""}
        entityName={entityName}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={() => {
          if (!deleteTarget) return
          setItems((current) => current.filter((item) => item.id !== deleteTarget.id))
          setDeleteTarget(null)
        }}
      />
    </div>
  )
}

const articleSteps = [
  { label: "Datos minimos", details: "Descripción, rubro, subrubro, tipo de producto, moneda, artículo de, IVA y cuenta contable." },
  { label: "Precio y venta", details: "Precio de venta, precio de compra, lista de precios y estado de venta." },
  { label: "Identificacion y logistica", details: "Código, código de barras, proveedor, presentación, unidad, ubicación y concepto AFIP." },
  { label: "Caracteristicas y detalles", details: "Series, características, depósito principal y stock inicial." },
]

function blankProduct(source?: Product, duplicate = false): Product {
  if (source) {
    return {
      ...source,
      id: duplicate ? "" : source.id,
      code: duplicate ? "" : source.code,
      barcode: duplicate ? "" : source.barcode,
      name: duplicate ? `Copia de ${source.name}` : source.name,
    }
  }

  return {
    id: "",
    code: "",
    barcode: "",
    name: "",
    categoryId: "",
    subcategoryId: undefined,
    salePrice: null,
    purchasePrice: 0,
    stock: 0,
    active: true,
    handlesSerials: false,
    type: "Producto",
    currency: "ARS",
    soldAs: "Mercaderia",
    vat: "21%",
    accountingAccount: "Ventas mercaderias",
    supplier: "",
    presentation: "Unidad",
    unit: "Unidad",
    location: "",
    afipConcept: "Productos",
    characteristics: {},
  }
}

function ArticleEditor({
  mode,
  item,
  categories,
  setCategories,
  products,
  onCancel,
  onSave,
}: {
  mode: EditorMode
  item?: Product
  categories: Category[]
  setCategories: Dispatch<SetStateAction<Category[]>>
  products: Product[]
  onCancel: () => void
  onSave: (item: Product, keepOpen: boolean) => Product
}) {
  const [form, setForm] = useState(() => blankProduct(item, mode === "duplicate"))
  const [step, setStep] = useState(0)
  const [persisted, setPersisted] = useState(mode === "edit")
  const missing = [
    !form.name && "Descripcion",
    !form.categoryId && "Rubro",
    !form.type && "Tipo de producto",
    !form.currency && "Moneda",
    !form.soldAs && "Articulo de",
    !form.vat && "IVA",
    !form.accountingAccount && "Cuenta contable",
  ].filter(Boolean) as string[]
  const validMinimum = missing.length === 0
  const availableSteps = persisted ? [0, 1, 2, 3] : [0]

  const update = <K extends keyof Product>(key: K, value: Product[K]) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const persist = (keepOpen: boolean) => {
    if (!validMinimum) return
    const saved = onSave(
      {
        ...form,
        id: form.id || nextId("p"),
        code: form.code || `A-${Math.floor(400 + Math.random() * 500)}`,
      },
      keepOpen
    )
    setForm(saved)
    if (keepOpen) {
      setPersisted(true)
      setStep(1)
    }
  }

  const title =
    mode === "create"
      ? "Alta guiada de articulo"
      : mode === "duplicate"
        ? "Duplicar articulo"
        : "Editar articulo"

  return (
    <>
      <SheetHeader className="border-b px-5 py-4">
        <SheetTitle>{title}</SheetTitle>
        <SheetDescription>
          {form.name || "Completa los datos minimos para guardar el articulo."}
        </SheetDescription>
      </SheetHeader>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="shrink-0 border-b bg-muted/25 px-5 py-3">
          <Stepper
            steps={articleSteps}
            activeStep={step}
            availableSteps={availableSteps}
            onStepChange={setStep}
          />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5 lg:px-6">
          {step === 0 ? (
            <div className="grid gap-5">
              <SectionHeading
                title="Datos minimos"
                description="La foto ayuda a reconocer el articulo, pero nunca bloquea el guardado."
              />
              <div className="grid gap-4 lg:grid-cols-[160px_1fr]">
                <div className="grid content-start gap-2">
                  <ProductImage
                    src={form.image}
                    alt={form.name || "Articulo"}
                    className="w-full"
                  />
                  <Input
                    id="article-image"
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="sr-only"
                    onChange={(event) => {
                      const file = event.target.files?.[0]
                      if (file) update("image", URL.createObjectURL(file))
                    }}
                  />
                  <Button asChild variant="outline" className="rounded-[4px]">
                    <label htmlFor="article-image" className="cursor-pointer">
                      <Upload /> {form.image ? "Reemplazar" : "Subir foto"}
                    </label>
                  </Button>
                  {form.image ? (
                    <Button
                      variant="ghost"
                      className="rounded-[4px]"
                      onClick={() => update("image", undefined)}
                    >
                      <Trash2 /> Eliminar foto
                    </Button>
                  ) : null}
                </div>
                <div className="grid content-start gap-4 sm:grid-cols-2">
                  <Field label="Descripcion" required className="sm:col-span-2">
                    <Input
                      value={form.name}
                      onChange={(event) => update("name", event.target.value)}
                      className="h-10 rounded-[4px]"
                      placeholder="Nombre comercial del articulo"
                    />
                  </Field>
                  <ClassificationFields
                    categories={categories}
                    setCategories={setCategories}
                    products={products}
                    categoryId={form.categoryId}
                    subcategoryId={form.subcategoryId}
                    onCategoryChange={(value) => update("categoryId", value)}
                    onSubcategoryChange={(value) => update("subcategoryId", value)}
                  />
                  <Field label="Tipo de producto" required>
                    <CompactSelect
                      value={form.type}
                      onValueChange={(value) => update("type", value)}
                      placeholder="Seleccionar"
                      options={["Producto", "Producto seriado", "Servicio"]}
                    />
                  </Field>
                  <Field label="Moneda" required>
                    <CompactSelect
                      value={form.currency}
                      onValueChange={(value) => update("currency", value)}
                      placeholder="Seleccionar"
                      options={["ARS", "USD"]}
                    />
                  </Field>
                  <Field label="Articulo de" required>
                    <CompactSelect
                      value={form.soldAs}
                      onValueChange={(value) => update("soldAs", value)}
                      placeholder="Seleccionar"
                      options={["Mercaderia", "Bien de uso", "Servicio"]}
                    />
                  </Field>
                  <Field label="IVA" required>
                    <CompactSelect
                      value={form.vat}
                      onValueChange={(value) => update("vat", value)}
                      placeholder="Seleccionar"
                      options={["21%", "10.5%", "Exento"]}
                    />
                  </Field>
                  <Field label="Cuenta contable" required className="sm:col-span-2">
                    <CompactSelect
                      value={form.accountingAccount}
                      onValueChange={(value) => update("accountingAccount", value)}
                      placeholder="Seleccionar cuenta"
                      options={[
                        "Ventas mercaderias",
                        "Ventas equipamiento",
                        "Servicios tecnicos",
                      ]}
                    />
                  </Field>
                </div>
              </div>
              {!validMinimum ? (
                <Alert className="rounded-[4px] border-amber-500/50 bg-amber-500/5">
                  <AlertTriangle className="text-amber-600" />
                  <AlertTitle>Faltan datos obligatorios</AlertTitle>
                  <AlertDescription>{missing.join(", ")}.</AlertDescription>
                </Alert>
              ) : (
                <Alert className="rounded-[4px] border-emerald-600/35 bg-emerald-600/5">
                  <Check className="text-emerald-600" />
                  <AlertTitle>Datos minimos completos</AlertTitle>
                  <AlertDescription>
                    Ya puedes guardar. La imagen sigue siendo opcional.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          ) : null}

          {step === 1 ? (
            <div className="grid gap-5">
              <SectionHeading title="Precio y venta" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Precio de venta">
                  <Input
                    type="number"
                    value={form.salePrice ?? ""}
                    onChange={(event) =>
                      update(
                        "salePrice",
                        event.target.value ? Number(event.target.value) : null
                      )
                    }
                    className="h-10 rounded-[4px] font-mono"
                  />
                </Field>
                <Field label="Precio de compra">
                  <Input
                    type="number"
                    value={form.purchasePrice}
                    onChange={(event) => update("purchasePrice", Number(event.target.value))}
                    className="h-10 rounded-[4px] font-mono"
                  />
                </Field>
                <Field label="Lista de precio">
                  <CompactSelect
                    value="Publico"
                    onValueChange={() => undefined}
                    placeholder="Seleccionar"
                    options={["Publico", "Mayorista", "Corporativa"]}
                  />
                </Field>
                <Field label="Estado de venta">
                  <CompactSelect
                    value={form.active ? "Habilitado" : "Deshabilitado"}
                    onValueChange={(value) => update("active", value === "Habilitado")}
                    placeholder="Seleccionar"
                    options={["Habilitado", "Deshabilitado"]}
                  />
                </Field>
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="grid gap-5">
              <SectionHeading title="Identificacion y logistica" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Codigo">
                  <Input
                    value={form.code}
                    onChange={(event) => update("code", event.target.value)}
                    className="h-10 rounded-[4px] font-mono"
                    placeholder="Se genera si queda vacio"
                  />
                </Field>
                <Field label="Codigo de barras">
                  <Input
                    value={form.barcode}
                    onChange={(event) => update("barcode", event.target.value)}
                    className="h-10 rounded-[4px] font-mono"
                  />
                </Field>
                <Field label="Proveedor">
                  <Input
                    value={form.supplier}
                    onChange={(event) => update("supplier", event.target.value)}
                    className="h-10 rounded-[4px]"
                  />
                </Field>
                <Field label="Presentacion minima">
                  <Input
                    value={form.presentation}
                    onChange={(event) => update("presentation", event.target.value)}
                    className="h-10 rounded-[4px]"
                  />
                </Field>
                <Field label="Unidad de medida">
                  <CompactSelect
                    value={form.unit}
                    onValueChange={(value) => update("unit", value)}
                    placeholder="Seleccionar"
                    options={["Unidad", "Kilogramo", "Litro", "Servicio"]}
                  />
                </Field>
                <Field label="Ubicacion">
                  <Input
                    value={form.location}
                    onChange={(event) => update("location", event.target.value)}
                    className="h-10 rounded-[4px]"
                  />
                </Field>
                <Field label="Concepto AFIP" className="sm:col-span-2">
                  <CompactSelect
                    value={form.afipConcept}
                    onValueChange={(value) => update("afipConcept", value)}
                    placeholder="Seleccionar"
                    options={["Productos", "Servicios", "Productos y servicios"]}
                  />
                </Field>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="grid gap-5">
              <SectionHeading
                title="Caracteristicas y detalles opcionales"
                description="Estas capacidades no forman parte del alta minima."
              />
              <label className="flex items-start gap-3 rounded-[4px] border p-3">
                <Checkbox
                  checked={form.handlesSerials}
                  onCheckedChange={(checked) => update("handlesSerials", checked === true)}
                />
                <span>
                  <strong className="block text-sm">Maneja series</strong>
                  <span className="text-xs text-muted-foreground">
                    Registra numero de serie individual al ingresar y vender.
                  </span>
                </span>
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Caracteristica: Acabado">
                  <Input
                    value={form.characteristics.Acabado ?? ""}
                    onChange={(event) =>
                      update("characteristics", {
                        ...form.characteristics,
                        Acabado: event.target.value,
                      })
                    }
                    className="h-10 rounded-[4px]"
                  />
                </Field>
                <Field label="Caracteristica: Color">
                  <Input
                    value={form.characteristics.Color ?? ""}
                    onChange={(event) =>
                      update("characteristics", {
                        ...form.characteristics,
                        Color: event.target.value,
                      })
                    }
                    className="h-10 rounded-[4px]"
                  />
                </Field>
                <Field label="Deposito principal">
                  <CompactSelect
                    value="Deposito principal"
                    onValueChange={() => undefined}
                    placeholder="Seleccionar"
                    options={["Deposito principal", "Salon de ventas", "Sucursal Centro"]}
                  />
                </Field>
                <Field label="Stock inicial">
                  <Input
                    type="number"
                    value={form.stock}
                    onChange={(event) => update("stock", Number(event.target.value))}
                    className="h-10 rounded-[4px] font-mono"
                  />
                </Field>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <SheetFooter className="flex-row flex-wrap items-center justify-between border-t bg-card px-5 py-3">
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-[4px]" onClick={onCancel}>
            Cancelar
          </Button>
          {step > 0 ? (
            <Button
              variant="ghost"
              className="rounded-[4px]"
              onClick={() => setStep((current) => Math.max(0, current - 1))}
            >
              <ArrowLeft /> Anterior
            </Button>
          ) : null}
        </div>
        <div className="ml-auto flex flex-wrap justify-end gap-2">
          {step === 0 && !persisted && mode !== "edit" ? (
            <>
              <Button
                variant="outline"
                disabled={!validMinimum}
                className="h-10 rounded-[4px] font-mono"
                onClick={() => persist(false)}
              >
                <Save /> Guardar
              </Button>
              <Button
                disabled={!validMinimum}
                className="h-10 rounded-[4px] font-mono"
                onClick={() => persist(true)}
              >
                <PackagePlus /> Guardar y completar detalles
              </Button>
            </>
          ) : (
            <>
              {step < articleSteps.length - 1 ? (
                <Button
                  variant="outline"
                  className="rounded-[4px]"
                  onClick={() => setStep((current) => current + 1)}
                >
                  Siguiente <ArrowRight />
                </Button>
              ) : null}
              <Button
                disabled={!validMinimum}
                className="h-10 rounded-[4px] font-mono"
                onClick={() => persist(false)}
              >
                <Save /> Guardar cambios
              </Button>
            </>
          )}
        </div>
      </SheetFooter>
    </>
  )
}

function ArticleDetail({
  item,
  actions,
  categories,
}: {
  item: Product
  actions: DetailActions
  categories: Category[]
}) {
  const category = categories.find((candidate) => candidate.id === item.categoryId)
  const subcategory = category?.subcategories.find(
    (candidate) => candidate.id === item.subcategoryId
  )
  const warning = !item.active
    ? "El articulo esta deshabilitado para la venta."
    : item.salePrice === null
      ? "Falta definir el precio de venta."
      : item.stock <= 3
        ? "Stock bajo en el deposito principal."
        : null

  return (
    <>
      <SheetHeader className="border-b px-5 py-4">
        <SheetTitle>{item.name}</SheetTitle>
        <SheetDescription>
          Articulo {item.code} · {category?.name ?? "Sin rubro"} / {subcategory?.name ?? "Sin subrubro"}
        </SheetDescription>
      </SheetHeader>
      <div className="min-h-0 flex-1 overflow-y-auto p-5">
        <div className="grid gap-5">
          <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
            <ProductImage src={item.image} alt={item.name} className="w-full" />
            <div className="grid grid-cols-2 content-start gap-x-4 gap-y-5">
              <Metric label="Precio de venta" value={money(item.salePrice)} strong />
              <Metric
                label="Estado"
                value={<StatusText active={item.active} />}
              />
              <Metric label="Codigo de barras" value={item.barcode || "Sin codigo"} />
              <Metric label="Stock" value={`${item.stock} ${item.unit}`} />
              <Metric label="IVA" value={item.vat} />
              <Metric
                label="Series"
                value={item.handlesSerials ? "Maneja series" : "No seriado"}
              />
            </div>
          </div>
          {warning ? (
            <Alert className="rounded-[4px] border-amber-500/50 bg-amber-500/5">
              <ShieldAlert className="text-amber-600" />
              <AlertTitle>Atencion operativa</AlertTitle>
              <AlertDescription>{warning}</AlertDescription>
            </Alert>
          ) : null}
          <section className="grid gap-3 border-t pt-4">
            <SectionHeading title="Clasificacion y logistica" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Metric label="Proveedor" value={item.supplier || "Sin proveedor"} />
              <Metric label="Presentacion" value={item.presentation} />
              <Metric label="Ubicacion" value={item.location || "Sin ubicacion"} />
              <Metric label="Cuenta contable" value={item.accountingAccount} />
            </div>
          </section>
          <section className="grid gap-3 border-t pt-4">
            <SectionHeading title="Caracteristicas" />
            <div className="grid gap-4 sm:grid-cols-2">
              {Object.entries(item.characteristics).map(([key, value]) => (
                <Metric key={key} label={key} value={value} />
              ))}
            </div>
          </section>
        </div>
      </div>
      <SheetFooter className="flex-row flex-wrap border-t bg-card px-5 py-3">
        <Button variant="outline" className="rounded-[4px]" onClick={actions.duplicate}>
          Duplicar
        </Button>
        <Button variant="destructive" className="rounded-[4px]" onClick={actions.remove}>
          <Trash2 /> Eliminar
        </Button>
        <Button className="ml-auto rounded-[4px]" onClick={actions.edit}>
          Editar articulo
        </Button>
      </SheetFooter>
    </>
  )
}

type ArticleViewMode = "list" | "grid"

function EmptyResults() {
  return (
    <div className="mx-auto grid max-w-sm justify-items-center gap-2 py-16 text-center">
      <Search className="size-6 text-muted-foreground" />
      <strong>No hay resultados</strong>
      <span className="text-xs text-muted-foreground">
        Revisa la busqueda o los filtros activos.
      </span>
    </div>
  )
}

function ArticleListTable({
  items,
  columns,
  openDetail,
  actionsFor,
}: {
  items: Product[]
  columns: Column<Product>[]
  openDetail: (item: Product) => void
  actionsFor: (item: Product) => DetailActions
}) {
  return (
    <div className="min-h-0 flex-1 overflow-auto p-3 md:p-4">
      <div className="min-w-[880px] overflow-hidden rounded-[4px] border bg-card">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-muted/95 backdrop-blur-sm">
            <TableRow className="hover:bg-transparent">
              {columns.map((column) => (
                <TableHead
                  key={column.label}
                  className={cn(
                    "h-9 font-mono text-[10px] font-semibold uppercase",
                    column.className
                  )}
                >
                  {column.label}
                </TableHead>
              ))}
              <TableHead className="h-9 w-[112px] text-right font-mono text-[10px] font-semibold uppercase">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length ? (
              items.map((item) => (
                <TableRow
                  key={item.id}
                  tabIndex={0}
                  className="h-11 cursor-pointer focus-visible:bg-muted focus-visible:outline-none"
                  onClick={() => openDetail(item)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") openDetail(item)
                  }}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={column.label}
                      className={cn("py-2 text-xs", column.className)}
                    >
                      {column.render(item)}
                    </TableCell>
                  ))}
                  <TableCell className="py-1.5">
                    <RowActions
                      onEdit={actionsFor(item).edit}
                      onDuplicate={actionsFor(item).duplicate}
                      onDelete={actionsFor(item).remove}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="h-48">
                  <EmptyResults />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function ArticleFilterSidebar({
  categoryFilter,
  setCategoryFilter,
  seriesFilter,
  setSeriesFilter,
  statusFilter,
  setStatusFilter,
  stockFilter,
  setStockFilter,
  priceFilter,
  setPriceFilter,
  categories,
}: {
  categoryFilter: string
  setCategoryFilter: (value: string) => void
  seriesFilter: string
  setSeriesFilter: (value: string) => void
  statusFilter: string
  setStatusFilter: (value: string) => void
  stockFilter: string
  setStockFilter: (value: string) => void
  priceFilter: string
  setPriceFilter: (value: string) => void
  categories: string[]
}) {
  return (
    <aside className="hidden w-[220px] shrink-0 border-r bg-muted/30 p-4 lg:block">
      <div className="grid gap-5">
        <div>
          <h3 className="text-sm font-semibold">Filtros</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Refinan la grilla visual sin tapar los productos.
          </p>
        </div>

        <Field label="Rubro">
          <CompactSelect
            value={categoryFilter}
            onValueChange={setCategoryFilter}
            placeholder="Todos"
            options={["Todos", ...categories]}
          />
        </Field>
        <Field label="Estado">
          <CompactSelect
            value={statusFilter}
            onValueChange={setStatusFilter}
            placeholder="Todos"
            options={["Todos", "Habilitados", "Deshabilitados"]}
          />
        </Field>
        <Field label="Series">
          <CompactSelect
            value={seriesFilter}
            onValueChange={setSeriesFilter}
            placeholder="Todos"
            options={["Todos", "Seriados", "No seriados"]}
          />
        </Field>
        <Field label="Stock">
          <CompactSelect
            value={stockFilter}
            onValueChange={setStockFilter}
            placeholder="Todos"
            options={["Todos", "Con stock", "Stock bajo", "Sin stock"]}
          />
        </Field>
        <Field label="Precio">
          <CompactSelect
            value={priceFilter}
            onValueChange={setPriceFilter}
            placeholder="Todos"
            options={["Todos", "Con precio", "Sin precio", "Con descuento"]}
          />
        </Field>
      </div>
    </aside>
  )
}

function ArticleCard({
  item,
  openDetail,
  actions,
  classificationLabel,
}: {
  item: Product
  openDetail: (item: Product) => void
  actions: DetailActions
  classificationLabel: string
}) {
  return (
    <Card
      size="sm"
      tabIndex={0}
      role="button"
      className="min-w-0 cursor-pointer rounded-[4px] py-0 transition hover:ring-primary/40 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      onClick={() => openDetail(item)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          openDetail(item)
        }
      }}
    >
      <div className="relative bg-muted">
        <ProductImage
          src={item.image}
          alt={item.name}
          className="aspect-[4/3] h-auto w-full rounded-b-none border-0 object-cover md:aspect-auto md:h-[190px]"
        />
        {item.discountPercent ? (
          <Badge className="absolute bottom-2 left-2 rounded-[4px] bg-emerald-600 font-mono text-[10px] text-white">
            {item.discountPercent}% OFF
          </Badge>
        ) : null}
      </div>
      <CardContent className="grid min-w-0 gap-2 p-2.5 md:p-3">
        <div className="min-h-[34px] md:min-h-[42px]">
          <h3
            className="text-xs leading-4 font-medium md:text-sm md:leading-5"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {item.name}
          </h3>
          <p className="mt-0.5 truncate font-mono text-[9px] text-muted-foreground md:text-[11px]">
            {item.code} · {item.barcode || "Sin codigo"}
          </p>
        </div>
        <div className="grid min-w-0 gap-1 sm:flex sm:items-end sm:justify-between sm:gap-2">
          <div>
            <p className="font-mono text-[9px] text-muted-foreground md:text-[11px]">Precio</p>
            <p className="truncate text-base font-semibold md:text-lg">{money(item.salePrice)}</p>
          </div>
          <StatusText active={item.active} />
        </div>
        <div className="flex min-w-0 items-center justify-between gap-1 border-t pt-2 text-[10px] md:text-xs">
          <span className={cn("shrink-0", item.stock <= 3 ? "font-semibold text-amber-700 dark:text-amber-400" : "")}>
            Stock {item.stock}
          </span>
          <span className="truncate text-right">{item.handlesSerials ? "Seriado" : classificationLabel}</span>
        </div>
        <RowActions
          onEdit={actions.edit}
          onDuplicate={actions.duplicate}
          onDelete={actions.remove}
        />
      </CardContent>
    </Card>
  )
}

function ArticleCatalogSurface({
  viewMode,
  items,
  columns,
  openDetail,
  actionsFor,
  categoryFilter,
  setCategoryFilter,
  seriesFilter,
  setSeriesFilter,
  statusFilter,
  setStatusFilter,
  stockFilter,
  setStockFilter,
  priceFilter,
  setPriceFilter,
  categories,
  categoryEntities,
}: {
  viewMode: ArticleViewMode
  items: Product[]
  columns: Column<Product>[]
  openDetail: (item: Product) => void
  actionsFor: (item: Product) => DetailActions
  categoryFilter: string
  setCategoryFilter: (value: string) => void
  seriesFilter: string
  setSeriesFilter: (value: string) => void
  statusFilter: string
  setStatusFilter: (value: string) => void
  stockFilter: string
  setStockFilter: (value: string) => void
  priceFilter: string
  setPriceFilter: (value: string) => void
  categories: string[]
  categoryEntities: Category[]
}) {
  if (viewMode === "list") {
    return (
      <ArticleListTable
        items={items}
        columns={columns}
        openDetail={openDetail}
        actionsFor={actionsFor}
      />
    )
  }

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      <ArticleFilterSidebar
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        seriesFilter={seriesFilter}
        setSeriesFilter={setSeriesFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        stockFilter={stockFilter}
        setStockFilter={setStockFilter}
        priceFilter={priceFilter}
        setPriceFilter={setPriceFilter}
        categories={categories}
      />
      <div className="min-h-0 flex-1 overflow-auto p-3 md:p-4">
        {items.length ? (
          <div className="grid grid-cols-2 gap-2 md:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] md:gap-4">
            {items.map((item) => (
              <ArticleCard
                key={item.id}
                item={item}
                openDetail={openDetail}
                actions={actionsFor(item)}
                classificationLabel={
                  categoryEntities
                    .find((category) => category.id === item.categoryId)
                    ?.subcategories.find((child) => child.id === item.subcategoryId)?.name ??
                  "Sin subrubro"
                }
              />
            ))}
          </div>
        ) : (
          <EmptyResults />
        )}
      </div>
    </div>
  )
}

export function ArticlesWorkspace({
  items,
  setItems,
  categories,
  setCategories,
}: {
  items: Product[]
  setItems: Dispatch<SetStateAction<Product[]>>
  categories: Category[]
  setCategories: Dispatch<SetStateAction<Category[]>>
}) {
  const isMobile = useIsMobile()
  const [viewMode, setViewMode] = useState<ArticleViewMode>("list")
  const [categoryFilter, setCategoryFilter] = useState("Todos")
  const [seriesFilter, setSeriesFilter] = useState("Todos")
  const [statusFilter, setStatusFilter] = useState("Todos")
  const [stockFilter, setStockFilter] = useState("Todos")
  const [priceFilter, setPriceFilter] = useState("Todos")

  const categoryNames = useMemo(
    () => categories.filter((category) => category.active).map((category) => category.name).sort(),
    [categories]
  )

  return (
    <EntityWorkspace
      title="Catalogo de articulos"
      createLabel="Crear articulo"
      entityName="articulo"
      items={items}
      setItems={setItems}
      getLabel={(item) => item.name}
      getSearchText={(item) => `${item.code} ${item.barcode} ${item.name}`}
      searchPlaceholder="Buscar por descripcion, codigo o codigo de barras"
      filterItem={(item) => {
        const categoryMatches =
          categoryFilter === "Todos" ||
          categories.find((category) => category.id === item.categoryId)?.name === categoryFilter
        const seriesMatches =
          seriesFilter === "Todos" ||
          (seriesFilter === "Seriados" && item.handlesSerials) ||
          (seriesFilter === "No seriados" && !item.handlesSerials)
        const statusMatches =
          statusFilter === "Todos" ||
          (statusFilter === "Habilitados" && item.active) ||
          (statusFilter === "Deshabilitados" && !item.active)
        const stockMatches =
          stockFilter === "Todos" ||
          (stockFilter === "Con stock" && item.stock > 0) ||
          (stockFilter === "Stock bajo" && item.stock > 0 && item.stock <= 3) ||
          (stockFilter === "Sin stock" && item.stock === 0)
        const priceMatches =
          priceFilter === "Todos" ||
          (priceFilter === "Con precio" && item.salePrice !== null) ||
          (priceFilter === "Sin precio" && item.salePrice === null) ||
          (priceFilter === "Con descuento" && Boolean(item.discountPercent))
        return (
          categoryMatches &&
          seriesMatches &&
          statusMatches &&
          stockMatches &&
          priceMatches
        )
      }}
      toolbarFilters={
        <>
          <div className="hidden h-10 rounded-[4px] border bg-card p-0.5 md:flex">
            <Button
              type="button"
              size="sm"
              variant={viewMode === "list" ? "secondary" : "ghost"}
              className="h-9 rounded-[4px]"
              onClick={() => setViewMode("list")}
            >
              <List /> Lista
            </Button>
            <Button
              type="button"
              size="sm"
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              className="h-9 rounded-[4px]"
              onClick={() => setViewMode("grid")}
            >
              <Grid2X2 /> Grilla
            </Button>
          </div>
          {viewMode === "list" ? (
            <>
              <CompactSelect
                value={seriesFilter}
                onValueChange={setSeriesFilter}
                placeholder="Maneja series"
                options={["Todos", "Seriados", "No seriados"]}
                className="w-40"
              />
              <CompactSelect
                value={statusFilter}
                onValueChange={setStatusFilter}
                placeholder="Estado"
                options={["Todos", "Habilitados", "Deshabilitados"]}
                className="w-40"
              />
            </>
          ) : null}
        </>
      }
      columns={[
        {
          label: "Codigo",
          className: "w-[86px] font-mono",
          render: (item) => item.code,
        },
        {
          label: "Descripcion",
          className: "min-w-[280px] font-medium",
          render: (item) => item.name,
        },
        {
          label: "Codigo de barras",
          className: "w-[150px] font-mono",
          render: (item) => item.barcode || "-",
        },
        {
          label: "Precio venta",
          className: "w-[128px] text-right font-mono",
          render: (item) => money(item.salePrice),
        },
        {
          label: "Stock",
          className: "w-[80px] text-right font-mono",
          render: (item) => (
            <span className={item.stock <= 3 ? "font-semibold text-amber-700 dark:text-amber-400" : ""}>
              {item.stock}
            </span>
          ),
        },
        {
          label: "Series",
          className: "w-[92px]",
          render: (item) => (item.handlesSerials ? "Seriado" : "No"),
        },
        {
          label: "Estado",
          className: "w-[110px]",
          render: (item) => <StatusText active={item.active} />,
        },
      ]}
      renderPrimary={({ items: filteredItems, columns, openDetail, actionsFor }) => (
        <ArticleCatalogSurface
          viewMode={isMobile ? "grid" : viewMode}
          items={filteredItems}
          columns={columns}
          openDetail={openDetail}
          actionsFor={actionsFor}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          seriesFilter={seriesFilter}
          setSeriesFilter={setSeriesFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          stockFilter={stockFilter}
          setStockFilter={setStockFilter}
          priceFilter={priceFilter}
          setPriceFilter={setPriceFilter}
          categories={categoryNames}
          categoryEntities={categories}
        />
      )}
      renderDetail={(item, actions) => <ArticleDetail item={item} actions={actions} categories={categories} />}
      renderEditor={(props) => (
        <ArticleEditor
          {...props}
          categories={categories}
          setCategories={setCategories}
          products={items}
        />
      )}
    />
  )
}

const customerSteps = [
  { label: "Identificacion fiscal", details: "Nombre, categoría IVA, tipo y número de documento, tratamiento fiscal y condición de venta." },
  { label: "Condiciones comerciales", details: "Lista de precios, condición de venta y configuración comercial frecuente." },
  { label: "Contacto y domicilios", details: "Teléfono, email y domicilio principal." },
  { label: "Clasificacion y opcionales", details: "Estado y datos complementarios de clasificación." },
]

function blankCustomer(source?: Customer, duplicate = false): Customer {
  if (source) {
    return {
      ...source,
      id: duplicate ? "" : source.id,
      code: duplicate ? "" : source.code,
      name: duplicate ? `Copia de ${source.name}` : source.name,
      document: duplicate ? "" : source.document,
    }
  }
  return {
    id: "",
    code: "",
    name: "",
    documentType: "CUIT",
    document: "",
    vatCategory: "Consumidor final",
    saleCondition: "Efectivo",
    taxTreatment: "Exento",
    priceList: "Publico",
    phone: "",
    email: "",
    address: "",
    active: true,
  }
}

function CustomerEditor({
  mode,
  item,
  onCancel,
  onSave,
}: {
  mode: EditorMode
  item?: Customer
  onCancel: () => void
  onSave: (item: Customer, keepOpen: boolean) => Customer
}) {
  const [form, setForm] = useState(() => blankCustomer(item, mode === "duplicate"))
  const [step, setStep] = useState(0)
  const [persisted, setPersisted] = useState(mode === "edit")

  const documentRequired = form.vatCategory !== "Consumidor final"
  const missing = [
    !form.name && "Nombre o razon social",
    !form.vatCategory && "Categoria IVA",
    !form.documentType && "Tipo de documento",
    documentRequired && !form.document && "CUIT / CUIL / Documento",
    !form.taxTreatment && "Tratamiento de impuestos",
    !form.saleCondition && "Condicion de venta",
  ].filter(Boolean) as string[]
  const validMinimum = missing.length === 0

  const update = <K extends keyof Customer>(key: K, value: Customer[K]) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const persist = (keepOpen: boolean) => {
    if (!validMinimum) return
    const saved = onSave(
      {
        ...form,
        id: form.id || nextId("c"),
        code: form.code || `C-${Math.floor(400 + Math.random() * 500)}`,
      },
      keepOpen
    )
    setForm(saved)
    if (keepOpen) {
      setPersisted(true)
      setStep(1)
    }
  }

  const title =
    mode === "create"
      ? "Alta guiada de cliente"
      : mode === "duplicate"
        ? "Duplicar cliente"
        : "Editar cliente"

  return (
    <>
      <SheetHeader className="border-b px-5 py-4">
        <SheetTitle>{title}</SheetTitle>
        <SheetDescription>
          {form.name || "La identificacion fiscal define como se factura al cliente."}
        </SheetDescription>
      </SheetHeader>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="shrink-0 border-b bg-muted/25 px-5 py-3">
          <Stepper
            steps={customerSteps}
            activeStep={step}
            availableSteps={persisted ? [0, 1, 2, 3] : [0]}
            onStepChange={setStep}
          />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-5 lg:px-6">
          {step === 0 ? (
            <div className="grid gap-5">
              <SectionHeading
                title="Identificacion fiscal"
                description="Consumidor final puede conservar CUIT, CUIL o documento cuando se informa."
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nombre o razon social" required className="sm:col-span-2">
                  <Input
                    value={form.name}
                    onChange={(event) => update("name", event.target.value)}
                    className="h-10 rounded-[4px]"
                  />
                </Field>
                <Field label="Categoria IVA" required>
                  <CompactSelect
                    value={form.vatCategory}
                    onValueChange={(value) => update("vatCategory", value)}
                    placeholder="Seleccionar"
                    options={[
                      "Consumidor final",
                      "Responsable inscripto",
                      "Monotributista",
                      "Exento",
                    ]}
                  />
                </Field>
                <Field label="Tipo de documento" required>
                  <CompactSelect
                    value={form.documentType}
                    onValueChange={(value) => update("documentType", value)}
                    placeholder="Seleccionar"
                    options={["CUIT", "CUIL", "DNI", "Pasaporte"]}
                  />
                </Field>
                <Field
                  label="CUIT / CUIL / Documento"
                  required={documentRequired}
                  hint={documentRequired ? undefined : "Opcional para consumidor final"}
                >
                  <Input
                    value={form.document}
                    onChange={(event) => update("document", event.target.value)}
                    className="h-10 rounded-[4px] font-mono"
                    placeholder="00-00000000-0"
                  />
                </Field>
                <Field label="Condicion de venta" required>
                  <CompactSelect
                    value={form.saleCondition}
                    onValueChange={(value) => update("saleCondition", value)}
                    placeholder="Seleccionar"
                    options={["Efectivo", "Cuenta corriente", "Transferencia"]}
                  />
                </Field>
                <Field label="Tratamiento de impuestos" required className="sm:col-span-2">
                  <CompactSelect
                    value={form.taxTreatment}
                    onValueChange={(value) =>
                      update("taxTreatment", value as Customer["taxTreatment"])
                    }
                    placeholder="Seleccionar"
                    options={["Exento", "Con impuestos"]}
                  />
                </Field>
              </div>
              <Alert
                className={cn(
                  "rounded-[4px]",
                  form.taxTreatment === "Exento"
                    ? "border-emerald-600/35 bg-emerald-600/5"
                    : "border-blue-600/35 bg-blue-600/5"
                )}
              >
                <ShieldAlert />
                <AlertTitle>
                  {form.taxTreatment === "Exento"
                    ? "Cliente exento"
                    : "Impuestos aplicables"}
                </AlertTitle>
                <AlertDescription>
                  {form.taxTreatment === "Exento"
                    ? "No se aplicaran percepciones adicionales al facturar."
                    : "La configuracion fiscal se revisara antes de emitir el comprobante."}
                </AlertDescription>
              </Alert>
              {!validMinimum ? (
                <Alert className="rounded-[4px] border-amber-500/50 bg-amber-500/5">
                  <AlertTriangle className="text-amber-600" />
                  <AlertTitle>Faltan datos obligatorios</AlertTitle>
                  <AlertDescription>{missing.join(", ")}.</AlertDescription>
                </Alert>
              ) : null}
            </div>
          ) : null}
          {step === 1 ? (
            <div className="grid gap-5">
              <SectionHeading title="Condiciones comerciales" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Lista de precios">
                  <CompactSelect
                    value={form.priceList}
                    onValueChange={(value) => update("priceList", value)}
                    placeholder="Seleccionar"
                    options={["Publico", "Mayorista", "Corporativa"]}
                  />
                </Field>
                <Field label="Condicion de venta">
                  <CompactSelect
                    value={form.saleCondition}
                    onValueChange={(value) => update("saleCondition", value)}
                    placeholder="Seleccionar"
                    options={["Efectivo", "Cuenta corriente", "Transferencia"]}
                  />
                </Field>
                <Field label="Vendedor habitual">
                  <CompactSelect
                    value="Sofia Romero"
                    onValueChange={() => undefined}
                    placeholder="Seleccionar"
                    options={["Sofia Romero", "Marcos Diaz", "Lucia Fernandez"]}
                  />
                </Field>
                <Field label="Cuenta contable">
                  <CompactSelect
                    value="Deudores por ventas"
                    onValueChange={() => undefined}
                    placeholder="Seleccionar"
                    options={["Deudores por ventas", "Consumidores finales"]}
                  />
                </Field>
              </div>
            </div>
          ) : null}
          {step === 2 ? (
            <div className="grid gap-5">
              <SectionHeading title="Contacto y domicilios" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Email">
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(event) => update("email", event.target.value)}
                    className="h-10 rounded-[4px]"
                  />
                </Field>
                <Field label="Telefono">
                  <Input
                    value={form.phone}
                    onChange={(event) => update("phone", event.target.value)}
                    className="h-10 rounded-[4px]"
                  />
                </Field>
                <Field label="Domicilio legal" className="sm:col-span-2">
                  <Textarea
                    value={form.address}
                    onChange={(event) => update("address", event.target.value)}
                    className="rounded-[4px]"
                  />
                </Field>
              </div>
            </div>
          ) : null}
          {step === 3 ? (
            <div className="grid gap-5">
              <SectionHeading title="Clasificacion y datos opcionales" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Rubro">
                  <CompactSelect
                    value="Comercio"
                    onValueChange={() => undefined}
                    placeholder="Seleccionar"
                    options={["Comercio", "Industria", "Servicios", "Particular"]}
                  />
                </Field>
                <Field label="Zona">
                  <CompactSelect
                    value="Tucuman"
                    onValueChange={() => undefined}
                    placeholder="Seleccionar"
                    options={["Tucuman", "NOA", "Nacional"]}
                  />
                </Field>
                <Field label="Estado">
                  <CompactSelect
                    value={form.active ? "Habilitado" : "Deshabilitado"}
                    onValueChange={(value) => update("active", value === "Habilitado")}
                    placeholder="Seleccionar"
                    options={["Habilitado", "Deshabilitado"]}
                  />
                </Field>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <SheetFooter className="flex-row flex-wrap items-center border-t bg-card px-5 py-3">
        <Button variant="outline" className="rounded-[4px]" onClick={onCancel}>
          Cancelar
        </Button>
        {step > 0 ? (
          <Button variant="ghost" className="rounded-[4px]" onClick={() => setStep(step - 1)}>
            <ArrowLeft /> Anterior
          </Button>
        ) : null}
        <div className="ml-auto flex gap-2">
          {step === 0 && !persisted && mode !== "edit" ? (
            <>
              <Button
                variant="outline"
                disabled={!validMinimum}
                className="h-10 rounded-[4px] font-mono"
                onClick={() => persist(false)}
              >
                <Save /> Guardar
              </Button>
              <Button
                disabled={!validMinimum}
                className="h-10 rounded-[4px] font-mono"
                onClick={() => persist(true)}
              >
                Guardar y completar detalles
              </Button>
            </>
          ) : (
            <>
              {step < customerSteps.length - 1 ? (
                <Button variant="outline" onClick={() => setStep(step + 1)}>
                  Siguiente <ArrowRight />
                </Button>
              ) : null}
              <Button disabled={!validMinimum} onClick={() => persist(false)}>
                <Save /> Guardar cambios
              </Button>
            </>
          )}
        </div>
      </SheetFooter>
    </>
  )
}

function CustomerDetail({
  item,
  actions,
  onOpenAccountStatement,
}: {
  item: Customer
  actions: DetailActions
  onOpenAccountStatement?: (customerId: string) => void
}) {
  return (
    <>
      <SheetHeader className="border-b px-5 py-4">
        <SheetTitle>{item.name}</SheetTitle>
        <SheetDescription>Cliente {item.code}</SheetDescription>
      </SheetHeader>
      <div className="min-h-0 flex-1 overflow-y-auto p-5">
        <div className="grid gap-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Metric label="Estado" value={<StatusText active={item.active} />} />
            <Metric label="Categoria IVA" value={item.vatCategory} />
            <Metric label={item.documentType} value={item.document || "No informado"} />
            <Metric label="Condicion de venta" value={item.saleCondition} />
            <Metric label="Lista de precios" value={item.priceList} />
            <Metric label="Impuestos" value={item.taxTreatment} />
          </div>
          <Alert
            className={cn(
              "rounded-[4px]",
              item.taxTreatment === "Exento"
                ? "border-emerald-600/35 bg-emerald-600/5"
                : "border-blue-600/35 bg-blue-600/5"
            )}
          >
            <ShieldAlert />
            <AlertTitle>Tratamiento fiscal</AlertTitle>
            <AlertDescription>
              {item.taxTreatment === "Exento"
                ? "No se aplican percepciones adicionales."
                : "Cliente sujeto a impuestos y percepciones configuradas."}
            </AlertDescription>
          </Alert>
          <section className="grid gap-4 border-t pt-4 sm:grid-cols-2">
            <Metric label="Telefono" value={item.phone || "No informado"} />
            <Metric label="Email" value={item.email || "No informado"} />
            <Metric label="Domicilio" value={item.address || "No informado"} />
          </section>
        </div>
      </div>
      <SheetFooter className="flex-row flex-wrap border-t bg-card px-5 py-3">
        {onOpenAccountStatement ? (
          <Button
            variant="outline"
            onClick={() => onOpenAccountStatement(item.id)}
          >
            Ver cuenta corriente
          </Button>
        ) : null}
        <Button variant="outline" onClick={actions.duplicate}>Duplicar</Button>
        <Button variant="destructive" onClick={actions.remove}><Trash2 /> Eliminar</Button>
        <Button className="ml-auto" onClick={actions.edit}>Editar cliente</Button>
      </SheetFooter>
    </>
  )
}

export function CustomersWorkspace({
  items,
  setItems,
  onOpenAccountStatement,
}: {
  items: Customer[]
  setItems: Dispatch<SetStateAction<Customer[]>>
  onOpenAccountStatement?: (customerId: string) => void
}) {
  const [vatFilter, setVatFilter] = useState("Todas")
  const [statusFilter, setStatusFilter] = useState("Todos")
  return (
    <EntityWorkspace
      title="Clientes"
      createLabel="Crear cliente"
      entityName="cliente"
      items={items}
      setItems={setItems}
      getLabel={(item) => item.name}
      getSearchText={(item) =>
        `${item.code} ${item.name} ${item.document} ${item.phone} ${item.email}`
      }
      searchPlaceholder="Buscar por nombre, codigo, CUIT/CUIL o documento"
      filterItem={(item) =>
        (vatFilter === "Todas" || item.vatCategory === vatFilter) &&
        (statusFilter === "Todos" ||
          (statusFilter === "Habilitados" && item.active) ||
          (statusFilter === "Deshabilitados" && !item.active))
      }
      toolbarFilters={
        <>
          <CompactSelect
            value={vatFilter}
            onValueChange={setVatFilter}
            placeholder="Categoria IVA"
            options={["Todas", "Consumidor final", "Responsable inscripto", "Monotributista"]}
            className="w-48"
          />
          <CompactSelect
            value={statusFilter}
            onValueChange={setStatusFilter}
            placeholder="Estado"
            options={["Todos", "Habilitados", "Deshabilitados"]}
            className="w-40"
          />
        </>
      }
      columns={[
        { label: "Codigo", className: "w-[92px] font-mono", render: (item) => item.code },
        { label: "Razon social / Nombre", className: "min-w-[250px] font-medium", render: (item) => item.name },
        { label: "CUIT / CUIL / Documento", className: "w-[170px] font-mono", render: (item) => item.document || "-" },
        { label: "Categoria IVA", className: "w-[170px]", render: (item) => item.vatCategory },
        { label: "Condicion de venta", className: "w-[150px]", render: (item) => item.saleCondition },
        { label: "Estado", className: "w-[110px]", render: (item) => <StatusText active={item.active} /> },
      ]}
      renderDetail={(item, actions) => (
        <CustomerDetail
          item={item}
          actions={actions}
          onOpenAccountStatement={onOpenAccountStatement}
        />
      )}
      renderEditor={(props) => <CustomerEditor {...props} />}
    />
  )
}

const supplierSteps = [
  { label: "Identificacion fiscal", details: "Razón social, CUIT y categoría IVA." },
  { label: "Configuracion contable", details: "Cuenta contable, cuenta de gasto y tratamiento de compras." },
  { label: "Contacto y ubicacion", details: "Teléfono, email y domicilio principal." },
  { label: "Retenciones e impuestos", details: "Categoría de retención y tratamiento impositivo." },
  { label: "Datos opcionales", details: "Estado y configuración complementaria del proveedor." },
]

function blankSupplier(source?: Supplier, duplicate = false): Supplier {
  if (source) {
    return {
      ...source,
      id: duplicate ? "" : source.id,
      code: duplicate ? "" : source.code,
      name: duplicate ? `Copia de ${source.name}` : source.name,
      cuit: duplicate ? "" : source.cuit,
    }
  }
  return {
    id: "",
    code: "",
    name: "",
    cuit: "",
    vatCategory: "Responsable inscripto",
    phone: "",
    email: "",
    active: true,
    accountingAccount: "Proveedores mercaderias",
    expenseAccount: "Compras para reventa",
    retentionCategory: "No aplica",
    taxTreatment: "Con impuestos",
    address: "",
  }
}

function SupplierEditor({
  mode,
  item,
  onCancel,
  onSave,
}: {
  mode: EditorMode
  item?: Supplier
  onCancel: () => void
  onSave: (item: Supplier, keepOpen: boolean) => Supplier
}) {
  const [form, setForm] = useState(() => blankSupplier(item, mode === "duplicate"))
  const [step, setStep] = useState(0)
  const [persisted, setPersisted] = useState(mode === "edit")

  const missing = [
    !form.name && "Razon social",
    !form.cuit && "CUIT",
    !form.vatCategory && "Categoria IVA",
  ].filter(Boolean) as string[]
  const validMinimum = missing.length === 0

  const update = <K extends keyof Supplier>(key: K, value: Supplier[K]) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const persist = (keepOpen: boolean) => {
    if (!validMinimum) return
    const saved = onSave(
      {
        ...form,
        id: form.id || nextId("s"),
        code: form.code || `P-${Math.floor(60 + Math.random() * 300)}`,
      },
      keepOpen
    )
    setForm(saved)
    if (keepOpen) {
      setPersisted(true)
      setStep(1)
    }
  }

  const title =
    mode === "create"
      ? "Alta guiada de proveedor"
      : mode === "duplicate"
        ? "Duplicar proveedor"
        : "Editar proveedor"

  return (
    <>
      <SheetHeader className="border-b px-5 py-4">
        <SheetTitle>{title}</SheetTitle>
        <SheetDescription>
          {form.name || "Completa la identidad fiscal antes de configurar compras y pagos."}
        </SheetDescription>
      </SheetHeader>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="shrink-0 border-b bg-muted/25 px-5 py-3">
          <Stepper
            steps={supplierSteps}
            activeStep={step}
            availableSteps={persisted ? [0, 1, 2, 3, 4] : [0]}
            onStepChange={setStep}
          />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-5 lg:px-6">
          {step === 0 ? (
            <div className="grid gap-5">
              <SectionHeading title="Identificacion fiscal" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nombre o razon social" required className="sm:col-span-2">
                  <Input
                    value={form.name}
                    onChange={(event) => update("name", event.target.value)}
                    className="h-10 rounded-[4px]"
                  />
                </Field>
                <Field label="CUIT" required>
                  <Input
                    value={form.cuit}
                    onChange={(event) => update("cuit", event.target.value)}
                    className="h-10 rounded-[4px] font-mono"
                    placeholder="00-00000000-0"
                  />
                </Field>
                <Field label="Categoria IVA" required>
                  <CompactSelect
                    value={form.vatCategory}
                    onValueChange={(value) => update("vatCategory", value)}
                    placeholder="Seleccionar"
                    options={["Responsable inscripto", "Monotributista", "Exento"]}
                  />
                </Field>
                <Field label="Proveedor habilitado" className="sm:col-span-2">
                  <CompactSelect
                    value={form.active ? "Habilitado" : "Deshabilitado"}
                    onValueChange={(value) => update("active", value === "Habilitado")}
                    placeholder="Seleccionar"
                    options={["Habilitado", "Deshabilitado"]}
                  />
                </Field>
              </div>
              {!validMinimum ? (
                <Alert className="rounded-[4px] border-amber-500/50 bg-amber-500/5">
                  <AlertTriangle className="text-amber-600" />
                  <AlertTitle>Faltan datos obligatorios</AlertTitle>
                  <AlertDescription>{missing.join(", ")}.</AlertDescription>
                </Alert>
              ) : null}
            </div>
          ) : null}
          {step === 1 ? (
            <div className="grid gap-5">
              <SectionHeading
                title="Configuracion contable"
                description="Estos datos impactan compras, gastos y registracion contable."
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Cuenta contable">
                  <CompactSelect
                    value={form.accountingAccount}
                    onValueChange={(value) => update("accountingAccount", value)}
                    placeholder="Seleccionar"
                    options={["Proveedores mercaderias", "Proveedores servicios"]}
                  />
                </Field>
                <Field label="Cuenta de gasto">
                  <CompactSelect
                    value={form.expenseAccount}
                    onValueChange={(value) => update("expenseAccount", value)}
                    placeholder="Seleccionar"
                    options={["Compras para reventa", "Mantenimiento", "Insumos de venta"]}
                  />
                </Field>
                <Field label="Tipo de persona">
                  <CompactSelect
                    value="Juridica"
                    onValueChange={() => undefined}
                    placeholder="Seleccionar"
                    options={["Juridica", "Fisica"]}
                  />
                </Field>
                <Field label="Sujeto a rendicion">
                  <CompactSelect
                    value="No"
                    onValueChange={() => undefined}
                    placeholder="Seleccionar"
                    options={["No", "Si"]}
                  />
                </Field>
              </div>
            </div>
          ) : null}
          {step === 2 ? (
            <div className="grid gap-5">
              <SectionHeading title="Contacto y ubicacion" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Telefono">
                  <Input value={form.phone} onChange={(event) => update("phone", event.target.value)} className="h-10 rounded-[4px]" />
                </Field>
                <Field label="Email">
                  <Input type="email" value={form.email} onChange={(event) => update("email", event.target.value)} className="h-10 rounded-[4px]" />
                </Field>
                <Field label="Domicilio" className="sm:col-span-2">
                  <Textarea value={form.address} onChange={(event) => update("address", event.target.value)} className="rounded-[4px]" />
                </Field>
              </div>
            </div>
          ) : null}
          {step === 3 ? (
            <div className="grid gap-5">
              <SectionHeading
                title="Retenciones e impuestos"
                description="La seleccion queda visible porque afecta compras y pagos."
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Tratamiento de impuestos">
                  <CompactSelect
                    value={form.taxTreatment}
                    onValueChange={(value) =>
                      update("taxTreatment", value as Supplier["taxTreatment"])
                    }
                    placeholder="Seleccionar"
                    options={["Exento", "Con impuestos"]}
                  />
                </Field>
                <Field label="Categoria de retencion">
                  <CompactSelect
                    value={form.retentionCategory}
                    onValueChange={(value) => update("retentionCategory", value)}
                    placeholder="Seleccionar"
                    options={[
                      "No aplica",
                      "Ganancias - Bienes",
                      "IIBB Convenio Multilateral",
                    ]}
                  />
                </Field>
                {form.taxTreatment === "Con impuestos" ? (
                  <>
                    <Field label="Codigo de impuesto">
                      <Input defaultValue="IIBB-TUC" className="h-10 rounded-[4px] font-mono" />
                    </Field>
                    <Field label="Alicuota">
                      <Input type="number" defaultValue="3.5" className="h-10 rounded-[4px] font-mono" />
                    </Field>
                  </>
                ) : (
                  <Alert className="rounded-[4px] border-emerald-600/35 bg-emerald-600/5 sm:col-span-2">
                    <Check className="text-emerald-600" />
                    <AlertTitle>Sin impuestos aplicables</AlertTitle>
                    <AlertDescription>
                      No se aplicaran percepciones adicionales en compras o pagos.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          ) : null}
          {step === 4 ? (
            <div className="grid gap-5">
              <SectionHeading title="Datos opcionales" />
              <Field label="Observaciones internas">
                <Textarea className="min-h-28 rounded-[4px]" placeholder="Notas operativas del proveedor" />
              </Field>
            </div>
          ) : null}
        </div>
      </div>
      <SheetFooter className="flex-row flex-wrap items-center border-t bg-card px-5 py-3">
        <Button variant="outline" onClick={onCancel}>Cancelar</Button>
        {step > 0 ? (
          <Button variant="ghost" onClick={() => setStep(step - 1)}><ArrowLeft /> Anterior</Button>
        ) : null}
        <div className="ml-auto flex gap-2">
          {step === 0 && !persisted && mode !== "edit" ? (
            <>
              <Button variant="outline" disabled={!validMinimum} onClick={() => persist(false)}>
                <Save /> Guardar
              </Button>
              <Button disabled={!validMinimum} onClick={() => persist(true)}>
                Guardar y completar detalles
              </Button>
            </>
          ) : (
            <>
              {step < supplierSteps.length - 1 ? (
                <Button variant="outline" onClick={() => setStep(step + 1)}>
                  Siguiente <ArrowRight />
                </Button>
              ) : null}
              <Button disabled={!validMinimum} onClick={() => persist(false)}>
                <Save /> Guardar cambios
              </Button>
            </>
          )}
        </div>
      </SheetFooter>
    </>
  )
}

function SupplierDetail({ item, actions }: { item: Supplier; actions: DetailActions }) {
  return (
    <>
      <SheetHeader className="border-b px-5 py-4">
        <SheetTitle>{item.name}</SheetTitle>
        <SheetDescription>Proveedor {item.code}</SheetDescription>
      </SheetHeader>
      <div className="min-h-0 flex-1 overflow-y-auto p-5">
        <div className="grid gap-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Metric label="Estado" value={<StatusText active={item.active} />} />
            <Metric label="CUIT" value={item.cuit} />
            <Metric label="Categoria IVA" value={item.vatCategory} />
            <Metric label="Impuestos" value={item.taxTreatment} />
          </div>
          <Alert className="rounded-[4px] border-blue-600/35 bg-blue-600/5">
            <ShieldAlert />
            <AlertTitle>Configuracion de riesgo</AlertTitle>
            <AlertDescription>
              {item.accountingAccount} · {item.expenseAccount} · {item.retentionCategory}
            </AlertDescription>
          </Alert>
          <section className="grid gap-4 border-t pt-4 sm:grid-cols-2">
            <Metric label="Telefono" value={item.phone || "No informado"} />
            <Metric label="Email" value={item.email || "No informado"} />
            <Metric label="Domicilio" value={item.address || "No informado"} />
          </section>
        </div>
      </div>
      <SheetFooter className="flex-row border-t bg-card px-5 py-3">
        <Button variant="outline" onClick={actions.duplicate}>Duplicar</Button>
        <Button variant="destructive" onClick={actions.remove}><Trash2 /> Eliminar</Button>
        <Button className="ml-auto" onClick={actions.edit}>Editar proveedor</Button>
      </SheetFooter>
    </>
  )
}

export function SuppliersWorkspace({
  items,
  setItems,
}: {
  items: Supplier[]
  setItems: Dispatch<SetStateAction<Supplier[]>>
}) {
  const [vatFilter, setVatFilter] = useState("Todas")
  const [statusFilter, setStatusFilter] = useState("Todos")
  return (
    <EntityWorkspace
      title="Proveedores"
      createLabel="Crear proveedor"
      entityName="proveedor"
      items={items}
      setItems={setItems}
      getLabel={(item) => item.name}
      getSearchText={(item) => `${item.code} ${item.name} ${item.cuit} ${item.phone} ${item.email}`}
      searchPlaceholder="Buscar por nombre, codigo, CUIT, telefono o email"
      filterItem={(item) =>
        (vatFilter === "Todas" || item.vatCategory === vatFilter) &&
        (statusFilter === "Todos" ||
          (statusFilter === "Habilitados" && item.active) ||
          (statusFilter === "Deshabilitados" && !item.active))
      }
      toolbarFilters={
        <>
          <CompactSelect
            value={vatFilter}
            onValueChange={setVatFilter}
            placeholder="Categoria IVA"
            options={["Todas", "Responsable inscripto", "Monotributista", "Exento"]}
            className="w-48"
          />
          <CompactSelect
            value={statusFilter}
            onValueChange={setStatusFilter}
            placeholder="Estado"
            options={["Todos", "Habilitados", "Deshabilitados"]}
            className="w-40"
          />
        </>
      }
      columns={[
        { label: "Codigo", className: "w-[92px] font-mono", render: (item) => item.code },
        { label: "Nombre / Razon social", className: "min-w-[250px] font-medium", render: (item) => item.name },
        { label: "CUIT", className: "w-[150px] font-mono", render: (item) => item.cuit },
        { label: "Categoria IVA", className: "w-[170px]", render: (item) => item.vatCategory },
        { label: "Telefono", className: "w-[135px]", render: (item) => item.phone },
        { label: "Email", className: "min-w-[210px]", render: (item) => item.email },
        { label: "Estado", className: "w-[110px]", render: (item) => <StatusText active={item.active} /> },
      ]}
      renderDetail={(item, actions) => <SupplierDetail item={item} actions={actions} />}
      renderEditor={(props) => <SupplierEditor {...props} />}
    />
  )
}

function blankWarehouse(source?: Warehouse, duplicate = false): Warehouse {
  if (source) {
    return {
      ...source,
      id: duplicate ? "" : source.id,
      code: duplicate ? "" : source.code,
      name: duplicate ? `Copia de ${source.name}` : source.name,
    }
  }
  return {
    id: "",
    code: "",
    name: "",
    type: "ORIGEN",
    company: "InfoManager Demo SA",
    pointOfSale: "Casa Central - PV 0004",
    address: "",
    costCenter: "",
  }
}

function WarehouseEditor({
  mode,
  item,
  onCancel,
  onSave,
}: {
  mode: EditorMode
  item?: Warehouse
  onCancel: () => void
  onSave: (item: Warehouse, keepOpen: boolean) => Warehouse
}) {
  const [form, setForm] = useState(() => blankWarehouse(item, mode === "duplicate"))
  const missing = [
    !form.code && "Codigo",
    !form.name && "Descripcion",
    !form.type && "Tipo",
    !form.company && "Empresa",
    !form.pointOfSale && "Punto de venta",
  ].filter(Boolean) as string[]
  const valid = missing.length === 0

  const update = <K extends keyof Warehouse>(key: K, value: Warehouse[K]) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const title =
    mode === "create"
      ? "Nuevo deposito"
      : mode === "duplicate"
        ? "Duplicar deposito"
        : "Editar deposito"

  return (
    <>
      <SheetHeader className="border-b px-5 py-4">
        <SheetTitle>{title}</SheetTitle>
        <SheetDescription>
          {form.name || "Configura la ubicacion operativa y su relacion contable."}
        </SheetDescription>
      </SheetHeader>
      <div className="min-h-0 flex-1 overflow-y-auto p-5">
        <div className="grid gap-5">
          <SectionHeading title="Datos principales" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Codigo" required>
              <Input
                value={form.code}
                onChange={(event) => update("code", event.target.value)}
                className="h-10 rounded-[4px] font-mono"
                placeholder="DEP-00"
              />
            </Field>
            <Field label="Descripcion" required>
              <Input
                value={form.name}
                onChange={(event) => update("name", event.target.value)}
                className="h-10 rounded-[4px]"
              />
            </Field>
            <Field label="Tipo de deposito" required>
              <CompactSelect
                value={form.type}
                onValueChange={(value) => update("type", value as Warehouse["type"])}
                placeholder="Seleccionar"
                options={["ORIGEN", "DESTINO"]}
              />
            </Field>
            <Field label="Empresa" required>
              <CompactSelect
                value={form.company}
                onValueChange={(value) => update("company", value)}
                placeholder="Seleccionar"
                options={["InfoManager Demo SA", "Comercial Norte SRL"]}
              />
            </Field>
            <Field label="Punto de venta" required className="sm:col-span-2">
              <CompactSelect
                value={form.pointOfSale}
                onValueChange={(value) => update("pointOfSale", value)}
                placeholder="Seleccionar"
                options={["Casa Central - PV 0004", "Sucursal Centro - PV 0007"]}
              />
            </Field>
            <Field label="Domicilio" className="sm:col-span-2">
              <Textarea
                value={form.address}
                onChange={(event) => update("address", event.target.value)}
                className="rounded-[4px]"
              />
            </Field>
          </div>
          <section className="grid gap-4 border-t pt-4">
            <SectionHeading
              title="Centro de costo"
              description="La configuracion es visible y editable; no depende de doble click."
            />
            <Field label="Centro de costo">
              <CompactSelect
                value={form.costCenter}
                onValueChange={(value) => update("costCenter", value)}
                placeholder="Sin asignar"
                options={["Stock central", "Ventas local", "Sucursal Centro", "Sin asignar"]}
              />
            </Field>
          </section>
          {!valid ? (
            <Alert className="rounded-[4px] border-amber-500/50 bg-amber-500/5">
              <AlertTriangle className="text-amber-600" />
              <AlertTitle>Faltan datos obligatorios</AlertTitle>
              <AlertDescription>{missing.join(", ")}.</AlertDescription>
            </Alert>
          ) : null}
        </div>
      </div>
      <SheetFooter className="flex-row border-t bg-card px-5 py-3">
        <Button variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button
          className="ml-auto"
          disabled={!valid}
          onClick={() =>
            onSave({ ...form, id: form.id || nextId("w") }, false)
          }
        >
          <Save /> {mode === "edit" ? "Guardar cambios" : "Guardar deposito"}
        </Button>
      </SheetFooter>
    </>
  )
}

function WarehouseDetail({ item, actions }: { item: Warehouse; actions: DetailActions }) {
  return (
    <>
      <SheetHeader className="border-b px-5 py-4">
        <SheetTitle>{item.name}</SheetTitle>
        <SheetDescription>Deposito {item.code}</SheetDescription>
      </SheetHeader>
      <div className="min-h-0 flex-1 overflow-y-auto p-5">
        <div className="grid gap-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Metric label="Tipo" value={item.type} />
            <Metric label="Empresa" value={item.company} />
            <Metric label="Punto de venta" value={item.pointOfSale} />
            <Metric label="Centro de costo" value={item.costCenter || "Sin asignar"} />
            <Metric label="Domicilio" value={item.address || "No informado"} />
          </div>
          <Alert className="rounded-[4px] border-blue-600/35 bg-blue-600/5">
            <WarehouseIcon className="text-primary" />
            <AlertTitle>Relacion operativa</AlertTitle>
            <AlertDescription>
              Este deposito puede usarse como {item.type.toLocaleLowerCase("es")} en movimientos de stock.
            </AlertDescription>
          </Alert>
        </div>
      </div>
      <SheetFooter className="flex-row border-t bg-card px-5 py-3">
        <Button variant="outline" onClick={actions.duplicate}>Duplicar</Button>
        <Button variant="destructive" onClick={actions.remove}><Trash2 /> Eliminar</Button>
        <Button className="ml-auto" onClick={actions.edit}>Editar deposito</Button>
      </SheetFooter>
    </>
  )
}

export function WarehousesWorkspace({
  items,
  setItems,
}: {
  items: Warehouse[]
  setItems: Dispatch<SetStateAction<Warehouse[]>>
}) {
  const [typeFilter, setTypeFilter] = useState("Todos")
  return (
    <EntityWorkspace
      title="Depositos"
      createLabel="Nuevo deposito"
      entityName="deposito"
      items={items}
      setItems={setItems}
      getLabel={(item) => item.name}
      getSearchText={(item) => `${item.code} ${item.name} ${item.type} ${item.company} ${item.pointOfSale}`}
      searchPlaceholder="Buscar por codigo, descripcion, tipo, empresa o punto de venta"
      filterItem={(item) => typeFilter === "Todos" || item.type === typeFilter}
      toolbarFilters={
        <CompactSelect
          value={typeFilter}
          onValueChange={setTypeFilter}
          placeholder="Tipo"
          options={["Todos", "ORIGEN", "DESTINO"]}
          className="w-40"
        />
      }
      columns={[
        { label: "Codigo", className: "w-[110px] font-mono", render: (item) => item.code },
        { label: "Descripcion", className: "min-w-[250px] font-medium", render: (item) => item.name },
        { label: "Tipo", className: "w-[110px]", render: (item) => item.type },
        { label: "Empresa", className: "min-w-[210px]", render: (item) => item.company },
        { label: "Punto de venta", className: "min-w-[220px]", render: (item) => item.pointOfSale },
        { label: "Centro de costo", className: "min-w-[160px]", render: (item) => item.costCenter || "-" },
      ]}
      renderDetail={(item, actions) => <WarehouseDetail item={item} actions={actions} />}
      renderEditor={(props) => <WarehouseEditor {...props} />}
    />
  )
}
