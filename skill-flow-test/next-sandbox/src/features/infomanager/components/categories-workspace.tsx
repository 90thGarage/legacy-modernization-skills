"use client"

import {
  useState,
  type Dispatch,
  type SetStateAction,
} from "react"
import {
  AlertTriangle,
  Check,
  ChevronDown,
  ChevronsUpDown,
  Edit3,
  Eye,
  Plus,
  Save,
  Search,
  Tags,
  Trash2,
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
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
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
import { cn } from "@/lib/utils"
import type { Category, Product, Subcategory } from "../types"
import { Field, Metric, SectionHeading, StatusText } from "./shared"

const editorClass =
  "w-[min(98vw,1180px)] gap-0 p-0 sm:max-w-none md:min-w-[760px] lg:w-[72vw] lg:min-w-[980px] xl:w-[64vw]"
const detailClass =
  "w-[min(96vw,960px)] gap-0 p-0 sm:max-w-none md:w-[48vw] md:min-w-[720px]"

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function categoryUsage(category: Category, products: Product[]) {
  return products.filter((product) => product.categoryId === category.id).length
}

function childUsage(child: Subcategory, products: Product[]) {
  return products.filter((product) => product.subcategoryId === child.id).length
}

type CategoryFormMode = "create" | "edit"

export function CategoryEditorSheet({
  open,
  mode,
  category,
  categories,
  products,
  appendBlankChild = false,
  onOpenChange,
  onSave,
}: {
  open: boolean
  mode: CategoryFormMode
  category?: Category
  categories: Category[]
  products: Product[]
  appendBlankChild?: boolean
  onOpenChange: (open: boolean) => void
  onSave: (category: Category, createdChildId?: string) => void
}) {
  const createInitialDraft = () => {
    const base: Category = category
      ? structuredClone(category)
      : {
          id: "",
          code: "",
          name: "",
          active: true,
          subcategories: [],
          directArticleCount: 0,
          totalArticleCount: 0,
          audit: { createdBy: "admin", createdAt: new Date().toISOString() },
        }
    if (appendBlankChild) {
      base.subcategories.push({
        id: `new-${makeId("sub")}`,
        categoryId: base.id,
        code: String(base.subcategories.length + 1),
        name: "",
        active: true,
        articleCount: 0,
      })
    }
    return base
  }
  const [draft, setDraft] = useState<Category>(createInitialDraft)
  const [dirty, setDirty] = useState(appendBlankChild)
  const [confirmClose, setConfirmClose] = useState(false)
  const [childQuery, setChildQuery] = useState("")
  const [lastNewChildId, setLastNewChildId] = useState<string | undefined>(() =>
    appendBlankChild ? draft.subcategories.at(-1)?.id : undefined
  )

  const categoryDuplicate = categories.find(
    (item) =>
      item.id !== draft.id &&
      (item.name.trim().toLocaleLowerCase("es") ===
        draft.name.trim().toLocaleLowerCase("es") ||
        item.code.trim().toLocaleLowerCase("es") ===
          draft.code.trim().toLocaleLowerCase("es"))
  )
  const childDuplicates = draft.subcategories.filter((child, index, all) =>
    all.some(
      (candidate, candidateIndex) =>
        candidateIndex !== index &&
        candidate.name.trim() &&
        candidate.name.trim().toLocaleLowerCase("es") ===
          child.name.trim().toLocaleLowerCase("es")
    )
  )
  const missingChildren = draft.subcategories.filter(
    (child) => !child.code.trim() || !child.name.trim()
  )
  const canSave =
    Boolean(draft.code.trim() && draft.name.trim()) &&
    !categoryDuplicate &&
    childDuplicates.length === 0 &&
    missingChildren.length === 0

  const updateDraft = (patch: Partial<Category>) => {
    setDraft((current) => ({ ...current, ...patch }))
    setDirty(true)
  }

  const requestClose = () => {
    if (dirty) setConfirmClose(true)
    else onOpenChange(false)
  }

  const addChild = () => {
    const id = `new-${makeId("sub")}`
    setLastNewChildId(id)
    updateDraft({
      subcategories: [
        ...draft.subcategories,
        {
          id,
          categoryId: draft.id,
          code: String(draft.subcategories.length + 1),
          name: "",
          active: true,
          articleCount: 0,
        },
      ],
    })
  }

  const updateChild = (id: string, patch: Partial<Subcategory>) => {
    updateDraft({
      subcategories: draft.subcategories.map((child) =>
        child.id === id ? { ...child, ...patch } : child
      ),
    })
  }

  const removeChild = (child: Subcategory) => {
    if (childUsage(child, products) > 0) return
    updateDraft({
      subcategories: draft.subcategories.filter((item) => item.id !== child.id),
    })
  }

  const visibleChildren = draft.subcategories.filter((child) =>
    `${child.code} ${child.name}`
      .toLocaleLowerCase("es")
      .includes(childQuery.trim().toLocaleLowerCase("es"))
  )

  const save = () => {
    if (!canSave) return
    const categoryId = draft.id || makeId("cat")
    let createdChildId: string | undefined
    const subcategories = draft.subcategories.map((child) => {
      const childId = child.id.startsWith("new-") ? makeId("sub") : child.id
      if (child.id === lastNewChildId) createdChildId = childId
      return { ...child, id: childId, categoryId }
    })
    onSave({
      ...draft,
      id: categoryId,
      code: draft.code.trim(),
      name: draft.name.trim(),
      subcategories,
      totalArticleCount: categoryUsage({ ...draft, id: categoryId }, products),
      audit: {
        ...draft.audit,
        updatedBy: "admin",
        updatedAt: new Date().toISOString(),
      },
    }, createdChildId)
    setDirty(false)
    onOpenChange(false)
  }

  return (
    <>
      <Sheet open={open} onOpenChange={(next) => !next && requestClose()}>
        <SheetContent className={editorClass} showCloseButton={false}>
          <SheetHeader className="border-b px-5 py-4">
            <SheetTitle>{mode === "create" ? "Nuevo rubro" : `Editar ${category?.name ?? "rubro"}`}</SheetTitle>
            <SheetDescription>
              Completa el rubro y sus subrubros como una sola carga.
            </SheetDescription>
          </SheetHeader>

          <div className="min-h-0 flex-1 overflow-y-auto p-5 lg:p-6">
            <div className="grid gap-6">
              <section className="grid gap-4">
                <SectionHeading
                  title="Datos del rubro"
                  description="Identifica la familia principal que usarán los artículos."
                />
                <div className="grid gap-4 sm:grid-cols-[180px_1fr_180px]">
                  <Field label="Código" required>
                    <Input
                      value={draft.code}
                      onChange={(event) => updateDraft({ code: event.target.value })}
                      className="h-10 rounded-[4px] font-mono"
                    />
                  </Field>
                  <Field label="Nombre" required>
                    <Input
                      value={draft.name}
                      onChange={(event) => updateDraft({ name: event.target.value })}
                      className="h-10 rounded-[4px]"
                      placeholder="Ej. Cerveza"
                    />
                  </Field>
                  <Field label="Estado">
                    <label className="flex h-10 items-center gap-2 rounded-[4px] border px-3">
                      <Checkbox
                        checked={draft.active}
                        onCheckedChange={(checked) => updateDraft({ active: checked === true })}
                      />
                      <span>{draft.active ? "Habilitado" : "Deshabilitado"}</span>
                    </label>
                  </Field>
                </div>
                <details className="rounded-[4px] border bg-muted/15 px-3 py-2">
                  <summary className="flex cursor-pointer list-none items-center gap-2 text-xs font-semibold">
                    <ChevronDown className="size-4" /> Configuración técnica
                  </summary>
                  <Field label="Código de compatibilidad" className="mt-3 max-w-md">
                    <Input
                      value={draft.compatibilityCode ?? ""}
                      onChange={(event) =>
                        updateDraft({ compatibilityCode: event.target.value })
                      }
                      className="h-10 rounded-[4px] font-mono"
                    />
                  </Field>
                </details>
                {categoryDuplicate ? (
                  <Alert className="rounded-[4px] border-amber-500/50 bg-amber-500/5">
                    <AlertTriangle className="text-amber-600" />
                    <AlertTitle>Posible rubro duplicado</AlertTitle>
                    <AlertDescription>
                      Ya existe {categoryDuplicate.code} · {categoryDuplicate.name}. Usa ese registro o cambia código y nombre.
                    </AlertDescription>
                  </Alert>
                ) : null}
              </section>

              <section className="grid gap-3 border-t pt-5">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <SectionHeading
                    title={`Subrubros (${draft.subcategories.length})`}
                    description="Marca o clasificación dentro del rubro."
                  />
                  {draft.subcategories.length ? (
                    <Button type="button" variant="outline" className="rounded-[4px]" onClick={addChild}>
                      <Plus /> Agregar subrubro
                    </Button>
                  ) : null}
                </div>
                {draft.subcategories.length > 8 ? (
                  <div className="relative max-w-md">
                    <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={childQuery}
                      onChange={(event) => setChildQuery(event.target.value)}
                      className="h-9 rounded-[4px] pl-9"
                      placeholder="Buscar subrubro"
                    />
                  </div>
                ) : null}
                {draft.subcategories.length ? (
                  <div className="overflow-hidden rounded-[4px] border">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/70 hover:bg-muted/70">
                          <TableHead className="h-9 w-28 font-mono text-[10px] uppercase">Código</TableHead>
                          <TableHead className="h-9 font-mono text-[10px] uppercase">Nombre</TableHead>
                          <TableHead className="h-9 w-44 font-mono text-[10px] uppercase">Compatibilidad</TableHead>
                          <TableHead className="h-9 w-24 text-right font-mono text-[10px] uppercase">Artículos</TableHead>
                          <TableHead className="h-9 w-28 font-mono text-[10px] uppercase">Estado</TableHead>
                          <TableHead className="h-9 w-16 text-right font-mono text-[10px] uppercase">Acción</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {visibleChildren.map((child) => {
                          const usage = childUsage(child, products)
                          const duplicate = childDuplicates.some((item) => item.id === child.id)
                          return (
                            <TableRow key={child.id} className={cn("h-12", duplicate && "bg-amber-500/5")}>
                              <TableCell className="py-1.5">
                                <Input
                                  value={child.code}
                                  onChange={(event) => updateChild(child.id, { code: event.target.value })}
                                  className="h-8 rounded-[4px] font-mono"
                                />
                              </TableCell>
                              <TableCell className="py-1.5">
                                <Input
                                  autoFocus={child.id === lastNewChildId}
                                  value={child.name}
                                  onChange={(event) => updateChild(child.id, { name: event.target.value })}
                                  className="h-8 rounded-[4px]"
                                  placeholder="Nombre o marca"
                                />
                              </TableCell>
                              <TableCell className="py-1.5">
                                <Input
                                  value={child.compatibilityCode ?? ""}
                                  onChange={(event) => updateChild(child.id, { compatibilityCode: event.target.value })}
                                  className="h-8 rounded-[4px] font-mono"
                                  placeholder="Opcional"
                                />
                              </TableCell>
                              <TableCell className="py-1.5 text-right font-mono text-xs">{usage}</TableCell>
                              <TableCell className="py-1.5">
                                <Checkbox
                                  checked={child.active}
                                  aria-label={`Estado de ${child.name || "subrubro"}`}
                                  onCheckedChange={(checked) => updateChild(child.id, { active: checked === true })}
                                />
                              </TableCell>
                              <TableCell className="py-1.5 text-right">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon-sm"
                                  disabled={usage > 0}
                                  title={usage > 0 ? "No se puede quitar porque tiene artículos asociados" : "Quitar subrubro"}
                                  onClick={() => removeChild(child)}
                                >
                                  <Trash2 />
                                </Button>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-[4px] border border-dashed bg-muted/20 px-4 py-4">
                    <div>
                      <strong className="text-sm">Todavía no agregaste subrubros</strong>
                      <p className="text-xs text-muted-foreground">Puedes guardar el rubro vacío o sumar marcas ahora.</p>
                    </div>
                    <Button type="button" variant="outline" className="rounded-[4px]" onClick={addChild}>
                      <Plus /> Agregar subrubro
                    </Button>
                  </div>
                )}
                {childDuplicates.length ? (
                  <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
                    Hay nombres de subrubro repetidos dentro de este rubro.
                  </p>
                ) : null}
              </section>
            </div>
          </div>

          <SheetFooter className="flex-row flex-wrap items-center border-t bg-card px-5 py-3">
            <span className="text-xs text-muted-foreground">
              {dirty ? "Cambios sin guardar" : "Sin cambios pendientes"}
            </span>
            <div className="ml-auto flex gap-2">
              <Button variant="outline" className="rounded-[4px]" onClick={requestClose}>Cancelar</Button>
              <Button disabled={!canSave} className="rounded-[4px]" onClick={save}>
                <Save /> {mode === "create" ? "Crear rubro" : "Guardar cambios"}
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Dialog open={confirmClose} onOpenChange={setConfirmClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Descartar cambios</DialogTitle>
            <DialogDescription>Los datos cargados en el rubro y sus subrubros se perderán.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmClose(false)}>Seguir editando</Button>
            <Button variant="destructive" onClick={() => { setConfirmClose(false); setDirty(false); onOpenChange(false) }}>
              Descartar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function SearchableClassificationSelect({
  value,
  label,
  placeholder,
  disabled,
  options,
  onChange,
  createLabel,
  onCreate,
}: {
  value?: string
  label: string
  placeholder: string
  disabled?: boolean
  options: { id: string; code: string; name: string }[]
  onChange: (value: string) => void
  createLabel?: string
  onCreate?: () => void
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const selected = options.find((option) => option.id === value)
  const filtered = options.filter((option) =>
    `${option.code} ${option.name}`.toLocaleLowerCase("es").includes(query.toLocaleLowerCase("es"))
  )
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-label={label}
          disabled={disabled}
          className="h-10 w-full justify-between rounded-[4px] px-3 font-normal"
        >
          <span className={cn("truncate", !selected && "text-muted-foreground")}>
            {selected ? `${selected.code} · ${selected.name}` : placeholder}
          </span>
          <ChevronsUpDown className="size-4 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] p-2">
        <div className="relative">
          <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(event) => setQuery(event.target.value)} className="h-9 rounded-[4px] pl-8" placeholder="Buscar" />
        </div>
        <div className="max-h-52 overflow-y-auto py-1">
          {filtered.length ? filtered.map((option) => (
            <button
              type="button"
              key={option.id}
              className="flex w-full items-center gap-2 rounded-[4px] px-2 py-2 text-left text-sm hover:bg-muted"
              onClick={() => { onChange(option.id); setOpen(false); setQuery("") }}
            >
              <Check className={cn("size-4", option.id === value ? "opacity-100" : "opacity-0")} />
              <span className="font-mono text-xs text-muted-foreground">{option.code}</span>
              <span>{option.name}</span>
            </button>
          )) : <p className="px-2 py-4 text-center text-xs text-muted-foreground">No hay coincidencias</p>}
        </div>
        {onCreate ? (
          <Button type="button" variant="ghost" className="w-full justify-start rounded-[4px] border-t" onClick={() => { setOpen(false); onCreate() }}>
            <Plus /> {createLabel}
          </Button>
        ) : null}
      </PopoverContent>
    </Popover>
  )
}

export function ClassificationFields({
  categories,
  setCategories,
  products,
  categoryId,
  subcategoryId,
  onCategoryChange,
  onSubcategoryChange,
}: {
  categories: Category[]
  setCategories: Dispatch<SetStateAction<Category[]>>
  products: Product[]
  categoryId: string
  subcategoryId?: string
  onCategoryChange: (categoryId: string) => void
  onSubcategoryChange: (subcategoryId?: string) => void
}) {
  const [editor, setEditor] = useState<"category" | "subcategory" | null>(null)
  const [clearedMessage, setClearedMessage] = useState(false)
  const selectedCategory = categories.find((category) => category.id === categoryId)
  const availableCategories = categories.filter((category) => category.active)
  const availableChildren = selectedCategory?.subcategories.filter((child) => child.active) ?? []

  const changeCategory = (nextId: string) => {
    const childBelongs = categories
      .find((category) => category.id === nextId)
      ?.subcategories.some((child) => child.id === subcategoryId)
    if (subcategoryId && !childBelongs) {
      onSubcategoryChange(undefined)
      setClearedMessage(true)
    } else setClearedMessage(false)
    onCategoryChange(nextId)
  }

  const upsert = (saved: Category) => {
    setCategories((current) => {
      const exists = current.some((category) => category.id === saved.id)
      return exists
        ? current.map((category) => category.id === saved.id ? saved : category)
        : [saved, ...current]
    })
  }

  return (
    <>
      <Field label="Rubro" required>
        <SearchableClassificationSelect
          value={categoryId}
          label="Rubro"
          placeholder="Buscar rubro"
          options={availableCategories}
          onChange={changeCategory}
          createLabel="Crear rubro"
          onCreate={() => setEditor("category")}
        />
      </Field>
      <Field
        label="Subrubro"
        hint={!categoryId ? "Primero selecciona un rubro" : availableChildren.length ? "Marca o clasificación" : "Este rubro no tiene subrubros"}
      >
        <SearchableClassificationSelect
          value={subcategoryId}
          label="Subrubro"
          placeholder={!categoryId ? "Primero selecciona un rubro" : availableChildren.length ? "Buscar subrubro" : "Sin subrubros"}
          disabled={!categoryId}
          options={availableChildren}
          onChange={(value) => onSubcategoryChange(value)}
          createLabel={selectedCategory ? `Crear subrubro en ${selectedCategory.name}` : undefined}
          onCreate={selectedCategory ? () => setEditor("subcategory") : undefined}
        />
      </Field>
      {clearedMessage ? (
        <p className="text-xs text-amber-700 sm:col-span-2 dark:text-amber-400">
          El subrubro se limpió porque no pertenece al nuevo rubro.
        </p>
      ) : null}

      {editor === "category" ? (
        <CategoryEditorSheet
          open
          mode="create"
          categories={categories}
          products={products}
          onOpenChange={(open) => !open && setEditor(null)}
          onSave={(saved) => { upsert(saved); onCategoryChange(saved.id); onSubcategoryChange(undefined); setEditor(null) }}
        />
      ) : null}
      {editor === "subcategory" && selectedCategory ? (
        <CategoryEditorSheet
          open
          mode="edit"
          category={selectedCategory}
          categories={categories}
          products={products}
          appendBlankChild
          onOpenChange={(open) => !open && setEditor(null)}
          onSave={(saved, childId) => { upsert(saved); onCategoryChange(saved.id); onSubcategoryChange(childId); setEditor(null) }}
        />
      ) : null}
    </>
  )
}

export function CategoriesWorkspace({
  categories,
  setCategories,
  products,
}: {
  categories: Category[]
  setCategories: Dispatch<SetStateAction<Category[]>>
  products: Product[]
}) {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("all")
  const [selected, setSelected] = useState<Category | null>(null)
  const [editor, setEditor] = useState<{ mode: CategoryFormMode; category?: Category } | null>(null)
  const [impactTarget, setImpactTarget] = useState<Category | null>(null)

  const filtered = categories.filter((category) => {
    const matchesQuery = `${category.code} ${category.name}`.toLocaleLowerCase("es").includes(query.trim().toLocaleLowerCase("es"))
    const matchesStatus = status === "all" || (status === "active" ? category.active : !category.active)
    return matchesQuery && matchesStatus
  })

  const upsert = (saved: Category) => {
    setCategories((current) => current.some((category) => category.id === saved.id)
      ? current.map((category) => category.id === saved.id ? saved : category)
      : [saved, ...current])
    setSelected(saved)
  }

  const disable = (category: Category) => {
    const saved = { ...category, active: false }
    setCategories((current) => current.map((item) => item.id === category.id ? saved : item))
    setImpactTarget(null)
    setSelected(saved)
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <section className="shrink-0 border-b bg-card px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Rubros</h2>
            <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">{filtered.length} de {categories.length} rubros</p>
          </div>
          <Button className="h-10 rounded-[4px] font-mono" onClick={() => setEditor({ mode: "create" })}>
            <Plus /> Crear rubro
          </Button>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <div className="relative min-w-[260px] flex-1">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por código o rubro" className="h-10 rounded-[4px] pl-9" />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-10 w-full rounded-[4px] sm:w-auto sm:min-w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Estado: todos</SelectItem>
              <SelectItem value="active">Habilitados</SelectItem>
              <SelectItem value="inactive">Deshabilitados</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      <div className="min-h-0 flex-1 overflow-auto p-3 md:p-4">
        <div className="overflow-hidden rounded-[4px] border bg-card">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-muted/95">
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-9 w-14 font-mono text-[10px] uppercase sm:w-28">Código</TableHead>
                <TableHead className="h-9 font-mono text-[10px] uppercase">Rubro</TableHead>
                <TableHead className="hidden h-9 w-28 text-right font-mono text-[10px] uppercase sm:table-cell">Subrubros</TableHead>
                <TableHead className="hidden h-9 w-28 text-right font-mono text-[10px] uppercase sm:table-cell">Artículos</TableHead>
                <TableHead className="hidden h-9 w-32 font-mono text-[10px] uppercase md:table-cell">Estado</TableHead>
                <TableHead className="sticky right-0 h-9 w-28 bg-muted/95 text-right font-mono text-[10px] uppercase sm:w-36">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length ? filtered.map((category) => {
                const usage = categoryUsage(category, products)
                return (
                  <TableRow key={category.id} tabIndex={0} className="h-11 cursor-pointer" onClick={() => setSelected(category)} onKeyDown={(event) => event.key === "Enter" && setSelected(category)}>
                    <TableCell className="font-mono text-xs">{category.code}</TableCell>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="hidden text-right font-mono sm:table-cell">{category.subcategories.length}</TableCell>
                    <TableCell className="hidden text-right font-mono sm:table-cell">{usage}</TableCell>
                    <TableCell className="hidden md:table-cell"><StatusText active={category.active} /></TableCell>
                    <TableCell className="sticky right-0 bg-card text-right">
                      <div className="flex justify-end gap-1" onClick={(event) => event.stopPropagation()}>
                        <Button variant="ghost" size="icon-sm" title="Ver" onClick={() => setSelected(category)}><Eye /></Button>
                        <Button variant="ghost" size="icon-sm" title="Editar" onClick={() => setEditor({ mode: "edit", category })}><Edit3 /></Button>
                        <Button variant="ghost" size="icon-sm" title={usage ? "Revisar impacto" : "Eliminar"} onClick={() => setImpactTarget(category)}><Trash2 /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              }) : (
                <TableRow><TableCell colSpan={6} className="h-52 text-center"><Tags className="mx-auto mb-2 size-6 text-muted-foreground" /><strong>No hay rubros con esos filtros</strong><p className="mt-1 text-xs text-muted-foreground">Limpia la búsqueda o crea un rubro nuevo.</p></TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Sheet open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent className={detailClass}>
          {selected ? (
            <>
              <SheetHeader className="border-b px-5 py-4">
                <div className="flex items-center gap-2"><SheetTitle>{selected.name}</SheetTitle><Badge variant="outline" className="rounded-[4px]">{selected.code}</Badge></div>
                <SheetDescription>Rubro y clasificaciones disponibles para los artículos.</SheetDescription>
              </SheetHeader>
              <div className="min-h-0 flex-1 overflow-y-auto p-5">
                <div className="grid gap-5">
                  <div className="grid grid-cols-3 gap-4">
                    <Metric label="Estado" value={<StatusText active={selected.active} />} />
                    <Metric label="Subrubros" value={selected.subcategories.length} />
                    <Metric label="Artículos" value={categoryUsage(selected, products)} />
                  </div>
                  <section className="grid gap-3 border-t pt-4">
                    <SectionHeading title="Subrubros" description="Marca o clasificación dentro del rubro." />
                    {selected.subcategories.length ? (
                      <div className="overflow-hidden rounded-[4px] border">
                        <Table><TableHeader><TableRow className="bg-muted/70"><TableHead className="h-9 font-mono text-[10px] uppercase">Código</TableHead><TableHead className="h-9 font-mono text-[10px] uppercase">Nombre</TableHead><TableHead className="h-9 text-right font-mono text-[10px] uppercase">Artículos</TableHead></TableRow></TableHeader><TableBody>
                          {selected.subcategories.map((child) => <TableRow key={child.id}><TableCell className="font-mono text-xs">{child.code}</TableCell><TableCell>{child.name}</TableCell><TableCell className="text-right font-mono">{childUsage(child, products)}</TableCell></TableRow>)}
                        </TableBody></Table>
                      </div>
                    ) : <p className="rounded-[4px] border border-dashed p-4 text-sm text-muted-foreground">Este rubro todavía no tiene subrubros.</p>}
                  </section>
                  {selected.compatibilityCode ? <details className="rounded-[4px] border px-3 py-2"><summary className="cursor-pointer text-xs font-semibold">Configuración técnica</summary><p className="mt-2 font-mono text-xs">Código de compatibilidad: {selected.compatibilityCode}</p></details> : null}
                </div>
              </div>
              <SheetFooter className="flex-row border-t bg-card px-5 py-3">
                <Button variant="outline" onClick={() => setImpactTarget(selected)}>{categoryUsage(selected, products) ? "Deshabilitar" : "Eliminar"}</Button>
                <Button className="ml-auto" onClick={() => { setSelected(null); setEditor({ mode: "edit", category: selected }) }}><Edit3 /> Editar rubro</Button>
              </SheetFooter>
            </>
          ) : null}
        </SheetContent>
      </Sheet>

      {editor ? (
        <CategoryEditorSheet
          open
          mode={editor.mode}
          category={editor.category}
          categories={categories}
          products={products}
          onOpenChange={(open) => !open && setEditor(null)}
          onSave={(saved) => { upsert(saved); setEditor(null) }}
        />
      ) : null}

      <Dialog open={Boolean(impactTarget)} onOpenChange={(open) => !open && setImpactTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{impactTarget && categoryUsage(impactTarget, products) ? "No se puede eliminar este rubro" : "Eliminar rubro"}</DialogTitle>
            <DialogDescription>
              {impactTarget && categoryUsage(impactTarget, products)
                ? `${impactTarget.name} tiene ${categoryUsage(impactTarget, products)} artículo(s) asociado(s). Puedes deshabilitarlo para nuevas cargas sin perder el historial.`
                : `Se eliminará ${impactTarget?.name ?? "el rubro"} y sus subrubros del prototipo.`}
            </DialogDescription>
          </DialogHeader>
          {impactTarget && categoryUsage(impactTarget, products) ? <Alert className="mx-5 rounded-[4px] border-amber-500/50 bg-amber-500/5"><AlertTriangle className="text-amber-600" /><AlertTitle>Reasignación pendiente</AlertTitle><AlertDescription>La reasignación masiva queda como acción futura; esta demo conserva las asociaciones.</AlertDescription></Alert> : null}
          <DialogFooter>
            <Button variant="outline" onClick={() => setImpactTarget(null)}>Cancelar</Button>
            {impactTarget && categoryUsage(impactTarget, products) ? (
              <Button onClick={() => disable(impactTarget)}>Deshabilitar rubro</Button>
            ) : (
              <Button variant="destructive" onClick={() => { if (!impactTarget) return; setCategories((current) => current.filter((category) => category.id !== impactTarget.id)); setImpactTarget(null); setSelected(null) }}><Trash2 /> Eliminar</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
