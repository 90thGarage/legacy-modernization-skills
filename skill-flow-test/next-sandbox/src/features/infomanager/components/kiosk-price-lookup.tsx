"use client"

import { useEffect, useRef, useState } from "react"
import { Camera, CornerDownLeft, LogOut, ScanBarcode, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { money } from "../mock-data"
import type { LookupState, Product } from "../types"
import { ProductImage } from "./shared"

export function KioskPriceLookup({
  products,
  onExit,
}: {
  products: Product[]
  onExit: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState("")
  const [state, setState] = useState<LookupState>({ kind: "idle" })

  const focusInput = () => window.setTimeout(() => inputRef.current?.focus(), 0)

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onExit()
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [onExit])

  useEffect(() => {
    if (state.kind === "idle" || state.kind === "multiple") return
    const timeout = window.setTimeout(() => {
      setState({ kind: "idle" })
      setQuery("")
      focusInput()
    }, 10000)
    return () => window.clearTimeout(timeout)
  }, [state])

  const runSearch = (rawQuery = query) => {
    const normalized = rawQuery.trim().toLocaleLowerCase("es")
    setQuery(rawQuery)
    if (!normalized) {
      setState({ kind: "idle" })
      focusInput()
      return
    }
    const exact = products.find(
      (product) =>
        product.code.toLocaleLowerCase("es") === normalized ||
        product.barcode.toLocaleLowerCase("es") === normalized
    )
    if (exact) {
      setState({ kind: "found", product: exact })
      focusInput()
      return
    }
    const matches = products.filter((product) =>
      product.name.toLocaleLowerCase("es").includes(normalized)
    )
    if (matches.length === 1) setState({ kind: "found", product: matches[0] })
    else if (matches.length > 1) setState({ kind: "multiple", products: matches })
    else setState({ kind: "not-found", query: rawQuery })
    focusInput()
  }

  return (
    <main className="flex h-dvh min-h-0 flex-col overflow-hidden bg-background text-foreground">
      <header className="flex h-16 shrink-0 items-center gap-3 border-b bg-card px-4 sm:px-6">
        <span className="grid size-9 place-items-center rounded-[4px] bg-primary font-mono text-sm font-bold text-primary-foreground">
          IM
        </span>
        <div>
          <div className="text-base font-bold">InfoManager Demo</div>
          <div className="text-xs text-muted-foreground">Casa Central · Consulta de precios</div>
        </div>
        <div className="ml-auto hidden text-right sm:block">
          <div className="font-mono text-[10px] uppercase text-muted-foreground">Lista preconfigurada</div>
          <div className="text-xs font-medium">Publico</div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Salir del modo kiosco"
          title="Salir del modo kiosco (Esc)"
          onClick={onExit}
        >
          <LogOut />
        </Button>
      </header>

      <section className="shrink-0 border-b bg-card px-4 py-4 sm:px-8">
        <div className="mx-auto flex max-w-5xl gap-2">
          <div className="relative flex-1">
            <ScanBarcode className="pointer-events-none absolute top-1/2 left-4 size-7 -translate-y-1/2 text-primary" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                if (state.kind !== "idle") setState({ kind: "idle" })
              }}
              onKeyDown={(event) => event.key === "Enter" && runSearch()}
              placeholder="Escanea el codigo o escribi el producto"
              className="h-16 rounded-[4px] border-2 bg-card pr-14 pl-14 text-lg shadow-sm placeholder:text-base focus-visible:ring-4"
              autoFocus
            />
            <CornerDownLeft className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-muted-foreground" />
          </div>
          <Button
            variant="outline"
            size="icon-lg"
            className="h-16 w-16 rounded-[4px]"
            aria-label="Escanear con camara"
            title="Escanear con camara"
            onClick={() => runSearch("7790895000997")}
          >
            <Camera className="size-6" />
          </Button>
        </div>
        <div className="mx-auto mt-3 flex max-w-5xl flex-wrap items-center gap-2">
          <span className="mr-1 font-mono text-[10px] font-semibold uppercase text-muted-foreground">
            Pruebas del prototipo
          </span>
          {["7790895000997", "ADES", "BALANZA", "218", "NOEXISTE"].map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => runSearch(example)}
              className="rounded-[4px] border bg-card px-2.5 py-1 font-mono text-xs hover:border-primary hover:text-primary"
            >
              {example}
            </button>
          ))}
        </div>
      </section>

      <section className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-8">
        <div className="mx-auto flex min-h-full max-w-5xl items-center justify-center">
          {state.kind === "idle" ? (
            <div className="grid max-w-xl justify-items-center gap-4 text-center">
              <span className="grid size-20 place-items-center rounded-[4px] border bg-card text-primary shadow-sm">
                <ScanBarcode className="size-10" />
              </span>
              <div>
                <h1 className="text-3xl font-semibold sm:text-4xl">Escanea o busca un producto</h1>
                <p className="mt-3 text-base text-muted-foreground">
                  La terminal esta lista para leer el proximo codigo.
                </p>
              </div>
            </div>
          ) : null}

          {state.kind === "found" ? (
            <div className="grid w-full items-center gap-8 lg:grid-cols-[minmax(280px,420px)_1fr]">
              <ProductImage
                src={state.product.image}
                alt={state.product.name}
                className="mx-auto w-full max-w-[420px] bg-card"
              />
              <div className="text-center lg:text-left">
                <div className="font-mono text-xs font-semibold uppercase text-primary">
                  {state.product.presentation}
                </div>
                <h1 className="mt-3 text-3xl leading-tight font-semibold sm:text-4xl">
                  {state.product.name}
                </h1>
                {state.product.salePrice === null ? (
                  <div className="mt-8 rounded-[4px] border border-amber-500/50 bg-amber-500/5 p-5">
                    <div className="text-2xl font-semibold text-amber-800 dark:text-amber-300">
                      Precio no disponible
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Consulta al personal del comercio.
                    </p>
                  </div>
                ) : (
                  <div className="mt-8 font-mono text-5xl font-bold text-primary sm:text-7xl">
                    {money(state.product.salePrice)}
                  </div>
                )}
                {!state.product.image ? (
                  <p className="mt-4 text-sm text-muted-foreground">Imagen no disponible.</p>
                ) : null}
                <p className="mt-6 text-xs text-muted-foreground">
                  La pantalla se reinicia automaticamente en 10 segundos.
                </p>
              </div>
            </div>
          ) : null}

          {state.kind === "multiple" ? (
            <div className="w-full">
              <div className="mb-5 text-center">
                <h1 className="text-3xl font-semibold">Elegí el producto</h1>
                <p className="mt-2 text-muted-foreground">
                  Encontramos {state.products.length} coincidencias para la busqueda.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {state.products.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    className="grid min-h-32 grid-cols-[96px_1fr] items-center gap-4 rounded-[4px] border bg-card p-3 text-left shadow-sm hover:border-primary"
                    onClick={() => {
                      setState({ kind: "found", product })
                      focusInput()
                    }}
                  >
                    <ProductImage src={product.image} alt={product.name} className="w-24" />
                    <span className="min-w-0">
                      <span className="block text-lg font-semibold leading-snug">{product.name}</span>
                      <span
                        className={cn(
                          "mt-2 block font-mono text-xl font-semibold",
                          product.salePrice === null ? "text-amber-700 dark:text-amber-300" : "text-primary"
                        )}
                      >
                        {money(product.salePrice)}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {state.kind === "not-found" ? (
            <div className="grid max-w-xl justify-items-center gap-4 text-center">
              <span className="grid size-20 place-items-center rounded-[4px] border bg-card text-muted-foreground">
                <Search className="size-9" />
              </span>
              <div>
                <h1 className="text-3xl font-semibold sm:text-4xl">Producto no encontrado</h1>
                <p className="mt-3 text-base text-muted-foreground">
                  No hay resultados para <strong className="text-foreground">{state.query}</strong>.
                </p>
                <Button
                  variant="outline"
                  className="mt-6 h-11 rounded-[4px]"
                  onClick={() => {
                    setState({ kind: "idle" })
                    setQuery("")
                    focusInput()
                  }}
                >
                  Buscar otro producto
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  )
}
