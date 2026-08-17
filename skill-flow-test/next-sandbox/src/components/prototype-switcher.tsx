"use client"

import { useEffect } from "react"
import { ArrowLeft, ArrowRight, FlaskConical } from "lucide-react"

import { Button } from "@/components/ui/button"

export type PrototypeVariantOption<T extends string> = {
  value: T
  label: string
}

export function PrototypeSwitcher<T extends string>({
  current,
  options,
  onChange,
}: {
  current: T
  options: PrototypeVariantOption<T>[]
  onChange: (variant: T) => void
}) {
  const currentIndex = Math.max(
    0,
    options.findIndex((option) => option.value === current)
  )

  const cycle = (direction: -1 | 1) => {
    const nextIndex = (currentIndex + direction + options.length) % options.length
    onChange(options[nextIndex].value)
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (
        target?.matches("input, textarea, select, [contenteditable='true']") ||
        (event.key !== "ArrowLeft" && event.key !== "ArrowRight")
      ) {
        return
      }

      event.preventDefault()
      cycle(event.key === "ArrowLeft" ? -1 : 1)
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  })

  if (process.env.NODE_ENV === "production") return null

  return (
    <div className="fixed bottom-20 left-1/2 z-[90] flex -translate-x-1/2 items-center gap-1 rounded-full border border-slate-700 bg-slate-950 p-1 text-white shadow-2xl">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="rounded-full text-white hover:bg-white/15 hover:text-white"
        onClick={() => cycle(-1)}
        aria-label="Ver variante anterior"
      >
        <ArrowLeft />
        <span className="sr-only">Ver variante anterior</span>
      </Button>
      <div className="flex min-w-52 items-center justify-center gap-2 px-3 text-xs font-medium">
        <FlaskConical className="size-3.5 text-sky-300" />
        <span>
          {currentIndex + 1}/{options.length} · {options[currentIndex].label}
        </span>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="rounded-full text-white hover:bg-white/15 hover:text-white"
        onClick={() => cycle(1)}
        aria-label="Ver variante siguiente"
      >
        <ArrowRight />
        <span className="sr-only">Ver variante siguiente</span>
      </Button>
    </div>
  )
}
