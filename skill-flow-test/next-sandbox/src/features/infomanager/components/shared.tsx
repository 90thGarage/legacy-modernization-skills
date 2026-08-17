"use client"

import type { ReactNode } from "react"
import { Copy, Edit3, ImageIcon, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export function Field({
  label,
  required,
  hint,
  error,
  className,
  children,
}: {
  label: string
  required?: boolean
  hint?: string
  error?: string
  className?: string
  children: ReactNode
}) {
  return (
    <label className={cn("grid min-w-0 gap-1.5", className)}>
      <span className="font-mono text-[11px] font-semibold text-foreground">
        {label}
        {required ? <span className="ml-1 text-destructive">*</span> : null}
      </span>
      {children}
      {error ? (
        <span className="text-xs text-destructive">{error}</span>
      ) : hint ? (
        <span className="text-xs text-muted-foreground">{hint}</span>
      ) : null}
    </label>
  )
}

export function StatusText({
  active,
  activeLabel = "Habilitado",
  inactiveLabel = "Deshabilitado",
}: {
  active: boolean
  activeLabel?: string
  inactiveLabel?: string
}) {
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap text-xs">
      <span
        aria-hidden="true"
        className={cn(
          "size-1.5 rounded-full",
          active ? "bg-emerald-600" : "bg-muted-foreground"
        )}
      />
      {active ? activeLabel : inactiveLabel}
    </span>
  )
}

export function ProductImage({
  src,
  alt,
  className,
}: {
  src?: string
  alt: string
  className?: string
}) {
  if (!src) {
    return (
      <div
        className={cn(
          "flex aspect-square items-center justify-center rounded-[4px] border bg-muted text-muted-foreground",
          className
        )}
        role="img"
        aria-label={`${alt}, sin imagen`}
      >
        <ImageIcon className="size-7" />
      </div>
    )
  }

  return (
    // External mock imagery keeps the prototype self-contained from a data perspective.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={cn(
        "aspect-square rounded-[4px] border object-cover",
        className
      )}
    />
  )
}

function ActionButton({
  label,
  destructive,
  onClick,
  children,
}: {
  label: string
  destructive?: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant={destructive ? "destructive" : "ghost"}
          size="icon-sm"
          aria-label={label}
          onClick={(event) => {
            event.stopPropagation()
            onClick()
          }}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

export function RowActions({
  onEdit,
  onDuplicate,
  onDelete,
}: {
  onEdit: () => void
  onDuplicate: () => void
  onDelete: () => void
}) {
  return (
    <div className="flex items-center justify-end gap-0.5">
      <ActionButton label="Editar" onClick={onEdit}>
        <Edit3 />
      </ActionButton>
      <ActionButton label="Duplicar" onClick={onDuplicate}>
        <Copy />
      </ActionButton>
      <ActionButton label="Eliminar" destructive onClick={onDelete}>
        <Trash2 />
      </ActionButton>
    </div>
  )
}

export function SectionHeading({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <div className="border-b pb-3">
      <h3 className="text-sm font-semibold">{title}</h3>
      {description ? (
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  )
}

export function Metric({
  label,
  value,
  strong,
}: {
  label: string
  value: ReactNode
  strong?: boolean
}) {
  return (
    <div className="grid gap-0.5">
      <span className="font-mono text-[10px] font-semibold uppercase text-muted-foreground">
        {label}
      </span>
      <span className={cn("text-sm", strong && "text-lg font-semibold")}>
        {value}
      </span>
    </div>
  )
}
