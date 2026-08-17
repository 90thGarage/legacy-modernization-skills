"use client"

import { useEffect, useState } from "react"
import { Check, LogIn, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  budgets as initialBudgets,
  categories as initialCategories,
  commercialDocuments as initialCommercialDocuments,
  customerAccountStatements,
  customers as initialCustomers,
  moneyTransactions as initialMoneyTransactions,
  products as initialProducts,
  suppliers as initialSuppliers,
  warehouses as initialWarehouses,
} from "./mock-data"
import type {
  Budget,
  AdvancedInvoicingLayout,
  Category,
  CommercialDocument,
  Customer,
  LabelDesign,
  LabelPrintRow,
  MoneyTransaction,
  PatternViewId,
  POSLayout,
  POSColumnKey,
  Product,
  PrototypeUser,
  Supplier,
  ViewId,
  Warehouse,
} from "./types"
import {
  authenticatePrototypeUser,
  canUserAccess,
  getUserHomeView,
} from "./access-control"
import { AppShell } from "./components/app-shell"
import {
  ArticlesWorkspace,
  CustomersWorkspace,
  SuppliersWorkspace,
  WarehousesWorkspace,
} from "./components/entity-workspaces"
import { CategoriesWorkspace } from "./components/categories-workspace"
import { KioskPriceLookup } from "./components/kiosk-price-lookup"
import { POSWorkspace } from "./components/pos-workspace"
import { AdvancedInvoicingWorkspace } from "./components/advanced-invoicing-workspace"
import { PatternWorkspace } from "./components/pattern-workspaces"
import { CommercialDocumentsWorkspace } from "./components/commercial-documents-workspace"
import {
  defaultSalesInvoicePreferences,
  SalesInvoicePreferencesSheet,
  SalesInvoiceWorkbench,
  type SalesInvoicePreferences,
} from "./components/sales-invoice-workbench"
import { MoneyTransactionsWorkspace } from "./components/money-transactions-workspace"
import { CustomerAccountStatementWorkspace } from "./components/customer-account-statement-workspace"
import { BudgetsWorkspace } from "./components/budgets-workspace"
import { FinancialDashboardWorkspace } from "./components/financial-dashboard-workspace"
import { RolesPermissionsWorkspace } from "./components/roles-permissions-workspace"
import {
  LabelDesignWorkspace,
  LabelPrintWorkspace,
} from "./components/label-workspaces"

function isPatternView(view: ViewId): view is PatternViewId {
  return view.startsWith("pattern-")
}

function LoginScreen({ onLogin }: { onLogin: (user: PrototypeUser) => void }) {
  const [database, setDatabase] = useState("test_maxi")
  const [user, setUser] = useState("admin")
  const [password, setPassword] = useState("infomanager")
  const [loginError, setLoginError] = useState("")

  return (
    <main className="grid h-dvh min-h-dvh bg-background text-foreground lg:grid-cols-[57.5%_42.5%]">
      <section
        className="relative hidden overflow-hidden bg-[#0057ff] text-white lg:block"
      >
        <div className="relative flex h-full flex-col px-[45px] py-14">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/infomanager-login/im-wordmark.svg"
            alt="infomanager"
            className="h-8 w-auto self-start"
          />
          <h1 className="mt-32 max-w-xl text-5xl leading-tight font-semibold tracking-normal">
            Tu negocio,
            <br />
            siempre bajo control.
          </h1>
        </div>
      </section>

      <section className="relative flex min-h-0 items-center justify-center px-6 py-8">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Cambiar tema"
          className="absolute top-6 right-6 size-11 rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
        >
          <Sun className="size-5" />
        </Button>

        <form
          className="grid w-full max-w-[505px] gap-6"
          onSubmit={(event) => {
            event.preventDefault()
            const authenticatedUser = authenticatePrototypeUser(user, password)
            if (!authenticatedUser) {
              setLoginError("Usuario o contraseña incorrectos.")
              return
            }
            onLogin(authenticatedUser)
          }}
        >
          <div className="grid justify-items-center gap-8">
            <div className="grid size-[132px] place-items-center rounded-[12px] bg-[#d8ded3] shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
              <span className="font-sans text-[64px] leading-none font-bold tracking-[-0.06em] text-[#0057ff]">
                im
              </span>
            </div>
          </div>

          <div className="grid gap-5">
            <label className="grid gap-2">
              <span className="font-mono text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Empresa / Base de datos
              </span>
              <Input
                value={database}
                onChange={(event) => setDatabase(event.target.value)}
                placeholder="Ej: nombre_base"
                className="h-12 rounded-[4px] border-[var(--input)] bg-[var(--card)] px-4 text-base text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]"
              />
            </label>
            <label className="grid gap-2">
              <span className="font-mono text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Usuario o email
              </span>
              <Input
                value={user}
                onChange={(event) => {
                  setUser(event.target.value)
                  setLoginError("")
                }}
                placeholder="Usuario o email"
                className="h-12 rounded-[4px] border-[var(--input)] bg-[var(--card)] px-4 text-base text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]"
              />
            </label>
            <label className="grid gap-2">
              <span className="font-mono text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Contrasena
              </span>
              <Input
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value)
                  setLoginError("")
                }}
                type="password"
                placeholder="Contrasena"
                className="h-12 rounded-[4px] border-[var(--input)] bg-[var(--card)] px-4 text-base text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]"
              />
            </label>
            {loginError ? (
              <p role="alert" className="text-sm font-medium text-destructive">
                {loginError}
              </p>
            ) : null}
            <div className="rounded-[4px] border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
              <p className="font-semibold text-foreground">Accesos del prototipo</p>
              <p className="mt-1 font-mono">admin / infomanager</p>
              <p className="font-mono">vendedor / infomanager</p>
            </div>
          </div>

          <Button
            type="submit"
            className="h-12 rounded-[4px] text-base font-semibold"
          >
            <LogIn className="size-5" />
            Ingresar
          </Button>

          <button
            type="button"
            className="justify-self-center font-mono text-xs font-semibold tracking-wider text-muted-foreground uppercase underline underline-offset-4 hover:text-foreground"
          >
            Olvidaste tu contrasena?
          </button>

          <div className="mt-8 flex items-center justify-between text-sm font-semibold text-muted-foreground">
            <button type="button" className="hover:text-foreground">
              Ayuda
            </button>
            <span>by Infomanager</span>
          </div>
        </form>
      </section>
    </main>
  )
}

export function InfoManagerPrototype() {
  const [sessionUser, setSessionUser] = useState<PrototypeUser | null>(null)
  const [activeView, setActiveView] = useState<ViewId>("pos")
  const [posLayout, setPosLayout] = useState<POSLayout>("header-grid")
  const [posColumns, setPosColumns] = useState<POSColumnKey[]>(() => {
    const defaults: POSColumnKey[] = [
      "code",
      "quantity",
      "detail",
      "unitPrice",
      "manualDiscount",
      "promotionalDiscount",
      "amount",
      "actions",
    ]
    if (typeof window === "undefined") return defaults
    try {
      const stored = JSON.parse(localStorage.getItem("infomanager-pos-columns") ?? "[]")
      const allowed = new Set<POSColumnKey>([
        "code",
        "quantity",
        "detail",
        "unit",
        "unitPrice",
        "manualDiscount",
        "promotionalDiscount",
        "discountedPrice",
        "amount",
        "actions",
      ])
      const valid = Array.isArray(stored)
        ? stored.filter((column): column is POSColumnKey => allowed.has(column))
        : []
      return valid.length >= 4 && valid.length <= 10 && new Set(valid).size === valid.length
        ? valid
        : defaults
    } catch {
      return defaults
    }
  })
  const [advancedInvoicingLayout, setAdvancedInvoicingLayout] = useState<AdvancedInvoicingLayout>("guided")
  const [preferencesOpen, setPreferencesOpen] = useState(false)
  const [salesInvoicePreferences, setSalesInvoicePreferences] = useState<SalesInvoicePreferences>(() => {
    if (typeof window === "undefined") return defaultSalesInvoicePreferences
    try {
      const stored = JSON.parse(localStorage.getItem("infomanager-sales-invoice-preferences") ?? "null") as Partial<SalesInvoicePreferences> | null
      return stored ? { ...defaultSalesInvoicePreferences, ...stored } : defaultSalesInvoicePreferences
    } catch {
      return defaultSalesInvoicePreferences
    }
  })
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers)
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers)
  const [warehouses, setWarehouses] = useState<Warehouse[]>(initialWarehouses)
  const [commercialDocuments, setCommercialDocuments] = useState<CommercialDocument[]>(
    initialCommercialDocuments
  )
  const [moneyTransactions, setMoneyTransactions] = useState<MoneyTransaction[]>(
    initialMoneyTransactions
  )
  const [sessionNotice, setSessionNotice] = useState("")
  const [labelDesigns, setLabelDesigns] = useState<LabelDesign[]>([])
  const [labelPrintRows, setLabelPrintRows] = useState<LabelPrintRow[]>([])
  const [selectedLabelDesignId, setSelectedLabelDesignId] = useState("")
  const [labelDesignEnteredFromPrint, setLabelDesignEnteredFromPrint] = useState(false)
  const [accountStatementInitialCustomerId, setAccountStatementInitialCustomerId] = useState("")
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets)

  useEffect(() => {
    if (!sessionNotice) return
    const timeout = window.setTimeout(() => setSessionNotice(""), 3500)
    return () => window.clearTimeout(timeout)
  }, [sessionNotice])

  useEffect(() => {
    localStorage.setItem("infomanager-pos-columns", JSON.stringify(posColumns))
  }, [posColumns])

  useEffect(() => {
    localStorage.setItem("infomanager-sales-invoice-preferences", JSON.stringify(salesInvoicePreferences))
  }, [salesInvoicePreferences])

  const navigateTo = (view: ViewId) => {
    if (!sessionUser || !canUserAccess(sessionUser, view)) {
      setSessionNotice("No tenés permiso para acceder a esa vista.")
      return
    }
    setLabelDesignEnteredFromPrint(false)
    setActiveView(view)
  }

  if (!sessionUser) {
    return (
      <LoginScreen
        onLogin={(user) => {
          setSessionUser(user)
          setActiveView(getUserHomeView(user))
        }}
      />
    )
  }

  if (activeView === "kiosk") {
    return (
      <KioskPriceLookup
        products={products}
        onExit={() => navigateTo("articles")}
      />
    )
  }

  return (
    <AppShell
      activeView={activeView}
      posLayout={posLayout}
      onPosLayoutChange={setPosLayout}
      posColumns={posColumns}
      onPosColumnsChange={setPosColumns}
      advancedInvoicingLayout={advancedInvoicingLayout}
      onAdvancedInvoicingLayoutChange={setAdvancedInvoicingLayout}
      onOpenPreferences={() => setPreferencesOpen(true)}
      user={sessionUser}
      onNavigate={navigateTo}
      onLogout={() => {
        setSessionNotice("")
        setActiveView("pos")
        setSessionUser(null)
      }}
    >
      {activeView === "dashboard" ? (
        <FinancialDashboardWorkspace
          onNavigate={navigateTo}
          onNotify={setSessionNotice}
        />
      ) : null}
      {activeView === "pos" ? (
        <POSWorkspace
          layout={posLayout}
          onLayoutChange={setPosLayout}
          visibleColumns={posColumns}
          products={products}
          customers={customers}
          setCustomers={setCustomers}
          onExit={() => navigateTo("articles")}
        />
      ) : null}
      {activeView === "advanced-invoicing" ? (
        <AdvancedInvoicingWorkspace layout={advancedInvoicingLayout} customers={customers} products={products} />
      ) : null}
      {activeView === "articles" ? (
        <ArticlesWorkspace
          items={products}
          setItems={setProducts}
          categories={categories}
          setCategories={setCategories}
        />
      ) : null}
      {activeView === "categories" ? (
        <CategoriesWorkspace
          categories={categories}
          setCategories={setCategories}
          products={products}
        />
      ) : null}
      {activeView === "customers" ? (
        <CustomersWorkspace
          items={customers}
          setItems={setCustomers}
          onOpenAccountStatement={(customerId) => {
            setAccountStatementInitialCustomerId(customerId)
            navigateTo("customer-account")
          }}
        />
      ) : null}
      {activeView === "suppliers" ? (
        <SuppliersWorkspace items={suppliers} setItems={setSuppliers} />
      ) : null}
      {activeView === "warehouses" ? (
        <WarehousesWorkspace items={warehouses} setItems={setWarehouses} />
      ) : null}
      {activeView === "purchase-invoices" ? (
        <CommercialDocumentsWorkspace
          context="purchase"
          fixedFamily="invoice"
          documents={commercialDocuments}
          setDocuments={setCommercialDocuments}
        />
      ) : null}
      {activeView === "purchase-debit-notes" ? (
        <CommercialDocumentsWorkspace
          context="purchase"
          fixedFamily="debit-note"
          documents={commercialDocuments}
          setDocuments={setCommercialDocuments}
        />
      ) : null}
      {activeView === "purchase-credit-notes" ? (
        <CommercialDocumentsWorkspace
          context="purchase"
          fixedFamily="credit-note"
          documents={commercialDocuments}
          setDocuments={setCommercialDocuments}
        />
      ) : null}
      {activeView === "purchase-delivery-notes" ? (
        <CommercialDocumentsWorkspace
          context="purchase"
          fixedFamily="delivery-note"
          documents={commercialDocuments}
          setDocuments={setCommercialDocuments}
        />
      ) : null}
      {activeView === "sale-invoices" ? (
        <SalesInvoiceWorkbench
          documents={commercialDocuments}
          setDocuments={setCommercialDocuments}
          preferences={salesInvoicePreferences}
        />
      ) : null}
      {activeView === "sale-debit-notes" ? (
        <CommercialDocumentsWorkspace
          context="sale"
          fixedFamily="debit-note"
          documents={commercialDocuments}
          setDocuments={setCommercialDocuments}
        />
      ) : null}
      {activeView === "sale-credit-notes" ? (
        <CommercialDocumentsWorkspace
          context="sale"
          fixedFamily="credit-note"
          documents={commercialDocuments}
          setDocuments={setCommercialDocuments}
        />
      ) : null}
      {activeView === "sale-delivery-notes" ? (
        <CommercialDocumentsWorkspace
          context="sale"
          fixedFamily="delivery-note"
          documents={commercialDocuments}
          setDocuments={setCommercialDocuments}
        />
      ) : null}
      {activeView === "payments" ? (
        <MoneyTransactionsWorkspace
          context="payment"
          transactions={moneyTransactions}
          setTransactions={setMoneyTransactions}
          parties={suppliers.map((supplier) => ({
            id: supplier.id,
            name: supplier.name,
            taxId: supplier.cuit,
          }))}
        />
      ) : null}
      {activeView === "collections" ? (
        <MoneyTransactionsWorkspace
          context="receipt"
          transactions={moneyTransactions}
          setTransactions={setMoneyTransactions}
          parties={customers.map((customer) => ({
            id: customer.id,
            name: customer.name,
            taxId: customer.document || "Sin identificación fiscal",
          }))}
        />
      ) : null}
      {activeView === "customer-account" ? (
        <CustomerAccountStatementWorkspace
          customers={customers}
          statements={customerAccountStatements}
          initialCustomerId={accountStatementInitialCustomerId}
        />
      ) : null}
      {activeView === "budgets" ? (
        <BudgetsWorkspace
          budgets={budgets}
          setBudgets={setBudgets}
          customers={customers}
          products={products}
        />
      ) : null}
      {activeView === "role-settings" ? <RolesPermissionsWorkspace /> : null}
      {activeView === "label-design" ? (
        <LabelDesignWorkspace
          designs={labelDesigns}
          enteredFromPrint={labelDesignEnteredFromPrint}
          onSave={(design) => {
            setLabelDesigns((current) => {
              const exists = current.some((item) => item.id === design.id)
              return exists
                ? current.map((item) => (item.id === design.id ? design : item))
                : [...current, design]
            })
            setSelectedLabelDesignId(design.id)
          }}
          onReturnToPrint={(savedDesignId) => {
            if (savedDesignId) setSelectedLabelDesignId(savedDesignId)
            setLabelDesignEnteredFromPrint(false)
            navigateTo("label-print")
          }}
        />
      ) : null}
      {activeView === "label-print" ? (
        <LabelPrintWorkspace
          products={products}
          designs={labelDesigns}
          selectedDesignId={selectedLabelDesignId}
          onSelectedDesignChange={setSelectedLabelDesignId}
          rows={labelPrintRows}
          onRowsChange={setLabelPrintRows}
          onCreateDesign={() => {
            setLabelDesignEnteredFromPrint(true)
            navigateTo("label-design")
          }}
        />
      ) : null}
      {isPatternView(activeView) ? <PatternWorkspace pattern={activeView} /> : null}

      <SalesInvoicePreferencesSheet
        open={preferencesOpen}
        onOpenChange={setPreferencesOpen}
        preferences={salesInvoicePreferences}
        onPreferencesChange={setSalesInvoicePreferences}
      />

      {sessionNotice ? (
        <div
          role="status"
          className="fixed right-4 bottom-4 z-[70] flex max-w-sm items-center gap-2 rounded-[4px] border bg-popover px-3 py-2 text-xs shadow-xl"
        >
          <Check className="size-4 text-emerald-600" />
          {sessionNotice}
        </div>
      ) : null}
    </AppShell>
  )
}
