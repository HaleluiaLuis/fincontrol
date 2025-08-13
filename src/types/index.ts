// Tipos de dados para o sistema de controle financeiro
import { Prisma, $Enums } from '@prisma/client'

// Exportar tipos do Prisma
export type User = Prisma.UserGetPayload<Record<string, never>>
export type Supplier = Prisma.SupplierGetPayload<Record<string, never>>
export type Category = Prisma.CategoryGetPayload<Record<string, never>>
export type Transaction = Prisma.TransactionGetPayload<Record<string, never>>
export type PaymentRequest = Prisma.PaymentRequestGetPayload<Record<string, never>>
export type Invoice = Prisma.InvoiceGetPayload<Record<string, never>>
export type Approval = Prisma.ApprovalGetPayload<Record<string, never>>
export type Payment = Prisma.PaymentGetPayload<Record<string, never>>
export type Notification = Prisma.NotificationGetPayload<Record<string, never>>
export type AuditLog = Prisma.AuditLogGetPayload<Record<string, never>>

// Enums do Prisma
export type Role = $Enums.UserRole
export type RequestStatus = $Enums.RequestStatus
export type WorkflowStep = $Enums.WorkflowStep
export type TransactionStatus = $Enums.TransactionStatus
export type TransactionType = $Enums.TransactionType
export type PaymentMethod = $Enums.PaymentMethod
export type ApprovalAction = $Enums.ApprovalAction
export type SupplierStatus = $Enums.SupplierStatus
export type SupplierType = $Enums.SupplierType

// Legacy compatibility
export type InvoiceStatus = RequestStatus

// Tipos com relacionamentos
export type InvoiceWithDetails = Prisma.InvoiceGetPayload<{
  include: {
    supplier: true
    category: true
    createdBy: true
    registeredBy: true
    approvals: {
      include: {
        user: true
      }
    }
    payment: true
  }
}>

export type PaymentRequestWithDetails = Prisma.PaymentRequestGetPayload<{
  include: {
    supplier: true
    category: true
    createdBy: true
    approvals: {
      include: {
        user: true
      }
    }
    invoice: true
  }
}>

export type TransactionWithDetails = Prisma.TransactionGetPayload<{
  include: {
    category: true
    supplier: true
    createdBy: true
  }
}>

// Tipos para formulários (novos)
export interface CreateInvoiceData {
  invoiceNumber: string
  supplierId: string
  description: string
  amount: number
  issueDate: string
  dueDate: string
  serviceDate: string
  categoryId: string
  attachments: string[]
  createdById: string
}

export interface CreatePaymentRequestData {
  supplierId: string
  description: string
  amount: number
  requestDate: string
  categoryId: string
  attachments: string[]
  createdById: string
}

export interface CreateTransactionData {
  type: TransactionType
  description: string
  amount: number
  categoryId: string
  supplierId?: string
  date: string
  createdById: string
}

export interface FinancialSummary {
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
  periodo: {
    inicio: string;
    fim: string;
  };
  // Estatísticas de faturas
  faturas: {
    totalPendentes: number;
    totalAprovadas: number;
    totalPagas: number;
    valorPendente: number;
    valorAprovado: number;
    valorPago: number;
  };
}

export interface MonthlyReport {
  mes: string;
  ano: number;
  receitas: number;
  despesas: number;
  saldo: number;
  transacoes: Transaction[];
  faturas: Invoice[];
}

export type TransactionFormData = Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>;
export type InvoiceFormData = Omit<Invoice, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'currentStep' | 'approvalHistory'>;

export interface DashboardMetrics {
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
  crescimentoMensal: number;
  principaisCategorias: CategoryMetric[];
  transacoesRecentes: Transaction[];
}

export interface CategoryMetric {
  category: Category;
  total: number;
  percentage: number;
  transactions: number;
}
