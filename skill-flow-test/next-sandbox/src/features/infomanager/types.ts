export type PatternViewId =
  | "pattern-form-simple"
  | "pattern-form-sectioned"
  | "pattern-report"

export type ViewId =
  | "dashboard"
  | "pos"
  | "advanced-invoicing"
  | "purchase-invoices"
  | "purchase-debit-notes"
  | "purchase-credit-notes"
  | "purchase-delivery-notes"
  | "sale-invoices"
  | "sale-debit-notes"
  | "sale-credit-notes"
  | "sale-delivery-notes"
  | "payments"
  | "collections"
  | "customer-account"
  | "budgets"
  | "articles"
  | "categories"
  | "label-design"
  | "label-print"
  | "customers"
  | "suppliers"
  | "warehouses"
  | "kiosk"
  | "role-settings"
  | PatternViewId

export type UserRole = "admin" | "seller"

export type PrototypeUser = {
  id: string
  username: string
  name: string
  initials: string
  role: UserRole
  roleLabel: string
}

export type DashboardFilters = {
  companyIds: string[]
  consolidated: boolean
  businessUnitId: string | null
  dateFrom: string
  dateTo: string
  currency: "ARS"
}

export type DashboardMetricKey =
  | "availability"
  | "receivables"
  | "overdueReceivables"
  | "payables"
  | "netPosition"

export type DashboardMetric = {
  key: DashboardMetricKey
  label: string
  value: number
  trendPercent: number | null
  contextLabel: string
  sparkline: number[]
}

export type FinancialTimingStatus =
  | "current"
  | "due-soon"
  | "overdue"
  | "critical"

export type PartyBalance = {
  id: string
  kind: "customer" | "supplier"
  name: string
  balance: number
  overdueAmount: number
  nextDueDate: string | null
  agingDays: number | null
  status: FinancialTimingStatus
  taxId?: string
  vatCategory?: string
  phone?: string
  address?: string
}

export type AgingBucket = {
  id: string
  label: string
  minDays: number | null
  maxDays: number | null
  amount: number
  percentage: number
  count: number
  status: FinancialTimingStatus
}

export type AvailabilityAccount = {
  id: string
  code?: string
  name: string
  type: "bank" | "cash" | "other"
  balance: number
  committedNext7Days: number
  updatedAt: string
  status: "fresh" | "stale" | "error"
}

export type ResultPoint = {
  date: string
  income: number
  expense: number
  result: number
}

export type DashboardDetailType =
  | "customer"
  | "supplier"
  | "aging"
  | "availability"
  | "result"

export type DashboardAlert = {
  id: string
  severity: "critical" | "warning" | "info"
  title: string
  description: string
  amount?: number
  count?: number
  detailType: DashboardDetailType
  targetId?: string
}

export type SourceFreshness = {
  source: "receivables" | "payables" | "availability" | "aging" | "result"
  status: "fresh" | "stale" | "partial" | "error"
  updatedAt: string | null
  message?: string
}

export type DashboardSnapshot = {
  generatedAt: string
  filters: DashboardFilters
  metrics: DashboardMetric[]
  customerBalances: PartyBalance[]
  supplierBalances: PartyBalance[]
  receivableAging: AgingBucket[]
  payableAging: AgingBucket[]
  availabilityAccounts: AvailabilityAccount[]
  resultSeries: ResultPoint[]
  alerts: DashboardAlert[]
  freshness: SourceFreshness[]
  legacyAlternativeTotals?: {
    receivables?: number
    payables?: number
  }
}

export type DashboardCompany = {
  id: string
  code: string
  name: string
  allowed: boolean
  active: boolean
}

export type DashboardBusinessUnit = {
  id: string
  companyId?: string
  code: string
  name: string
}

export type LabelOrientation = "portrait" | "landscape" | "printer"

export type LabelElementKind = "text" | "barcode" | "qr" | "border"

export type LabelElement = {
  id: string
  kind: LabelElementKind
  label: string
  x: number
  y: number
}

export type LabelDesign = {
  id: string
  name: string
  widthMm: number
  heightMm: number
  orientation: LabelOrientation
  elements: LabelElement[]
}

export type LabelPrintRow = {
  productId: string
  quantity: number
  weight: string
}

export type Product = {
  id: string
  code: string
  barcode: string
  name: string
  categoryId: string
  subcategoryId?: string
  salePrice: number | null
  discountPercent?: number
  purchasePrice: number
  stock: number
  active: boolean
  handlesSerials: boolean
  image?: string
  type: string
  currency: string
  soldAs: string
  vat: string
  accountingAccount: string
  supplier: string
  presentation: string
  unit: string
  location: string
  afipConcept: string
  characteristics: Record<string, string>
}

export type Subcategory = {
  id: string
  categoryId: string
  code: string
  name: string
  compatibilityCode?: string
  active: boolean
  articleCount: number
}

export type Category = {
  id: string
  code: string
  name: string
  compatibilityCode?: string
  active: boolean
  subcategories: Subcategory[]
  directArticleCount: number
  totalArticleCount: number
  audit: {
    createdBy: string
    createdAt: string
    updatedBy?: string
    updatedAt?: string
  }
}

export type Customer = {
  id: string
  code: string
  name: string
  documentType: string
  document: string
  vatCategory: string
  saleCondition: string
  taxTreatment: "Exento" | "Con impuestos"
  priceList: string
  phone: string
  email: string
  address: string
  active: boolean
}

export type BudgetLine = {
  id: string
  productId: string
  code: string
  description: string
  unit: string
  unitCount: number
  quantity: number
  basePrice: number
  manualDiscount: number
  promotionalDiscount: number
  discountPercent: number
  finalPrice: number
  vatRate: number
  vatType: string
  priceWithVat: number
  priceList: string
  deliveryDate: string
  amount: number
}

export type BudgetTotals = {
  net: number
  bonus: number
  vat105: number
  vat21: number
  vat27: number
  otherPerceptions: number
  total: number
}

export type Budget = {
  id: string
  number: string
  internalNumber: string
  date: string
  destination: string
  pointOfSale: string
  letter: string
  cc: string
  validity: string
  customerId: string
  customerName: string
  customerTaxId: string
  seller: string
  priceList: string
  saleCondition: string
  currency: "ARS"
  purchaseOrder: string
  shift: string
  observations: string
  lines: BudgetLine[]
  totals: BudgetTotals
  annulled: boolean
  invoicedRelation?: string
  derivedRelation?: string
  audit: {
    createdBy: string
    createdAt: string
    updatedBy?: string
    updatedAt?: string
  }
}

export type Supplier = {
  id: string
  code: string
  name: string
  cuit: string
  vatCategory: string
  phone: string
  email: string
  active: boolean
  accountingAccount: string
  expenseAccount: string
  retentionCategory: string
  taxTreatment: "Exento" | "Con impuestos"
  address: string
}

export type Warehouse = {
  id: string
  code: string
  name: string
  type: "ORIGEN" | "DESTINO"
  company: string
  pointOfSale: string
  address: string
  costCenter: string
}

export type TicketItem = {
  id: string
  productId: string
  quantity: number
  manualDiscount: number
  promotionalDiscount: number
}

export type PaymentMethodName =
  | "Efectivo"
  | "Tarjeta"
  | "Transferencia"
  | "Mercado Pago"
  | "PayWay"

export type POSLayout = "header-grid" | "bottom-bar" | "receipt-book"

export type POSColumnKey =
  | "code"
  | "quantity"
  | "detail"
  | "unit"
  | "unitPrice"
  | "manualDiscount"
  | "promotionalDiscount"
  | "discountedPrice"
  | "amount"
  | "actions"

export type AdvancedInvoicingLayout = "tabs" | "guided" | "streamlined" | "paper" | "staged"

export type PaymentRow = {
  id: string
  method: PaymentMethodName
  amount: number
  card: string
  installments: string
  batch: string
  coupon: string
  authorization: string
  reference: string
}

export type LookupState =
  | { kind: "idle" }
  | { kind: "found"; product: Product }
  | { kind: "multiple"; products: Product[] }
  | { kind: "not-found"; query: string }

export type CommercialContext = "purchase" | "sale"

export type CommercialDocumentFamily =
  | "invoice"
  | "credit-note"
  | "debit-note"
  | "delivery-note"

export type CommercialDocumentLine = {
  id: string
  code: string
  description: string
  quantity: number
  unitPrice: number
  vatRate: number
}

export type CommercialDocument = {
  id: string
  context: CommercialContext
  family: CommercialDocumentFamily
  typeLabel: string
  date: string
  number: string
  partyName: string
  partyTaxId: string
  total: number
  subtotal: number
  taxes: number
  currency: "ARS"
  status: string
  relatedDocument?: string
  pointOfSale: string
  fiscalState?: string
  items: CommercialDocumentLine[]
  audit: {
    createdBy: string
    createdAt: string
    updatedBy?: string
    updatedAt?: string
  }
}

export type MoneyTransactionContext = "payment" | "receipt"

export type MoneyTransaction = {
  id: string
  context: MoneyTransactionContext
  date: string
  number: string
  partyName: string
  partyTaxId: string
  total: number
  currency: "ARS"
  detail: string
  status: string
  relatedDocument?: string
  location: string
  audit: {
    createdBy: string
    createdAt: string
    updatedBy?: string
    updatedAt?: string
  }
}

export type AccountMovement = {
  id: string
  paymentIndicator: string
  companyLabel: string
  date: string
  concept: string
  technicalCode?: string
  number: string
  days: number | null
  debit: number
  credit: number
  runningBalance: number
  currencyCode: string
  sourceType?: "document" | "receipt" | "delivery-note"
  sourceId?: string
}

export type AccountCurrencyGroup = {
  currencyCode: string
  currencyLabel: string
  movements: AccountMovement[]
  debitTotal: number
  creditTotal: number
  runningBalanceTotal: number
}

export type CustomerAccountStatement = {
  customerId: string
  movementCount: number
  currencyGroups: AccountCurrencyGroup[]
  pesifiedBalance: number
  presentationCurrency: "ARS"
  queriedAt: string
}
