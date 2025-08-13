// Sistema de Pagamentos - Tipos TypeScript
// Fase 2: Operacional - Execução Financeira

export type PaymentStatus = 
  | 'PENDENTE'           // Aguardando processamento
  | 'AGENDADO'           // Agendado para data futura
  | 'EM_PROCESSAMENTO'   // Sendo processado pelo banco
  | 'PROCESSADO'         // Processado com sucesso
  | 'FALHADO'            // Falha no processamento
  | 'CANCELADO'          // Cancelado pelo usuário
  | 'REVERTIDO'          // Estornado/revertido
  | 'EM_ANALISE';        // Em análise de conformidade

export type PaymentMethod = 
  | 'TRANSFERENCIA_BANCARIA'  // Transferência bancária
  | 'TED'                     // TED - Transferência Eletrônica Disponível
  | 'PIX'                     // PIX (se disponível em Angola futuramente)
  | 'CHEQUE'                  // Pagamento em cheque
  | 'DINHEIRO'               // Pagamento em dinheiro
  | 'CARTAO_CORPORATIVO';    // Cartão corporativo

export type PaymentPriority = 
  | 'BAIXA'     // Baixa prioridade
  | 'NORMAL'    // Prioridade normal
  | 'ALTA'      // Alta prioridade  
  | 'URGENTE';  // Urgente (mesmo dia)

export type PaymentType = 
  | 'FATURA'           // Pagamento de fatura
  | 'FORNECEDOR'       // Pagamento direto a fornecedor
  | 'FUNCIONARIO'      // Pagamento a funcionário
  | 'IMPOSTO'          // Pagamento de impostos
  | 'SERVICO_PUBLICO'  // Serviços públicos
  | 'OUTROS';          // Outros pagamentos

export type CashFlowType = 
  | 'ENTRADA'    // Entrada de dinheiro
  | 'SAIDA';     // Saída de dinheiro

export type BankAccountType = 
  | 'CORRENTE'   // Conta corrente
  | 'POUPANCA'   // Conta poupança
  | 'SALARIO'    // Conta salário
  | 'DEPOSITO';  // Conta depósito

// Informações bancárias
export interface BankAccount {
  id: string;
  accountName: string;
  bankName: string;
  bankCode?: string;
  accountNumber: string;
  accountType: BankAccountType;
  balance: number;
  isActive: boolean;
  isDefault: boolean;
  currency: 'AOA' | 'USD' | 'EUR';
  createdAt: Date;
  updatedAt: Date;
}

// Dados bancários do beneficiário
export interface BeneficiaryBankData {
  bankName: string;
  bankCode?: string;
  accountNumber: string;
  accountName: string;
  accountType: BankAccountType;
  swiftCode?: string;
  iban?: string;
  branch?: string;
  currency: 'AOA' | 'USD' | 'EUR';
}

// Comprovante de pagamento
export interface PaymentReceipt {
  id: string;
  receiptNumber: string;
  filePath: string;
  fileType: 'PDF' | 'IMAGE' | 'XML';
  uploadDate: Date;
  uploadedBy: string;
  isVerified: boolean;
  verifiedBy?: string;
  verificationDate?: Date;
}

// Log de auditoria de pagamento
export interface PaymentAuditLog {
  id: string;
  action: 'CRIADO' | 'AGENDADO' | 'PROCESSADO' | 'FALHADO' | 'CANCELADO' | 'REVERTIDO';
  description: string;
  userId: string;
  userName: string;
  userRole: string;
  date: Date;
  ipAddress?: string;
  previousValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
}

// Taxa de câmbio (para pagamentos em moeda estrangeira)
export interface ExchangeRate {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  date: Date;
  source: 'BANCO_CENTRAL' | 'BANCO_COMERCIAL' | 'MANUAL';
}

// Interface principal do pagamento
export interface Payment {
  id: string;
  
  // Identificação
  paymentNumber: string;           // Número único do pagamento
  externalReference?: string;      // Referência externa (banco)
  type: PaymentType;
  status: PaymentStatus;
  priority: PaymentPriority;
  
  // Relacionamentos
  invoiceId?: string;              // Fatura relacionada
  invoiceNumber?: string;          // Número da fatura (cache)
  paymentRequestId?: string;       // Solicitação relacionada
  supplierId?: string;             // Fornecedor beneficiário
  supplierName?: string;           // Nome do fornecedor (cache)
  
  // Dados financeiros
  amount: number;                  // Valor a pagar
  currency: 'AOA' | 'USD' | 'EUR'; // Moeda
  exchangeRate?: ExchangeRate;     // Taxa de câmbio (se aplicável)
  amountInBaseCurrency: number;    // Valor na moeda base (AOA)
  
  // Taxas e deduções
  bankFee?: number;                // Taxa bancária
  exchangeFee?: number;            // Taxa de câmbio
  otherFees?: number;              // Outras taxas
  totalDeductions: number;         // Total de deduções
  netAmount: number;               // Valor líquido pago
  
  // Método de pagamento
  paymentMethod: PaymentMethod;
  
  // Contas bancárias
  sourceAccount: BankAccount;      // Conta de origem
  beneficiaryBankData: BeneficiaryBankData; // Dados bancários do beneficiário
  
  // Datas
  createdAt: Date;                 // Data de criação
  scheduledDate?: Date;            // Data agendada
  processedDate?: Date;            // Data de processamento
  expectedDate?: Date;             // Data esperada de conclusão
  dueDate?: Date;                  // Data limite
  
  // Observações
  description?: string;            // Descrição do pagamento
  internalNotes?: string;          // Notas internas
  publicNotes?: string;            // Observações públicas
  rejectionReason?: string;        // Motivo de rejeição (se aplicável)
  
  // Aprovações
  approvedBy?: string;             // Aprovado por
  approvalDate?: Date;             // Data da aprovação
  approvalNotes?: string;          // Notas da aprovação
  
  // Documentos
  receipts: PaymentReceipt[];      // Comprovantes
  
  // Sistema
  auditLog: PaymentAuditLog[];     // Histórico de auditoria
  createdBy: string;               // Criado por
  lastModifiedBy?: string;         // Última modificação por
  lastModifiedAt?: Date;           // Data da última modificação
  
  // Flags computadas
  isOverdue: boolean;              // Está atrasado
  canBeCancelled: boolean;         // Pode ser cancelado
  requiresApproval: boolean;       // Requer aprovação
}

// Filtros para busca de pagamentos
export interface PaymentFilters {
  status?: PaymentStatus[];
  method?: PaymentMethod[];
  type?: PaymentType[];
  priority?: PaymentPriority[];
  dateFrom?: Date;
  dateTo?: Date;
  amountFrom?: number;
  amountTo?: number;
  supplierId?: string;
  bankAccountId?: string;
  search?: string;
}

// Estatísticas de pagamentos
export interface PaymentStats {
  totalPayments: number;
  pendingPayments: number;
  processedPayments: number;
  failedPayments: number;
  totalAmount: number;
  pendingAmount: number;
  processedAmount: number;
  averageAmount: number;
  overduePayments: number;
  scheduledPayments: number;
}

// Fluxo de caixa
export interface CashFlowEntry {
  id: string;
  date: Date;
  type: CashFlowType;
  amount: number;
  currency: 'AOA' | 'USD' | 'EUR';
  category: string;
  description: string;
  paymentId?: string;
  invoiceId?: string;
  bankAccountId: string;
  balance: number; // Saldo após esta transação
  createdAt: Date;
  createdBy: string;
}

// Relatório de fluxo de caixa
export interface CashFlowReport {
  period: {
    startDate: Date;
    endDate: Date;
  };
  openingBalance: number;
  closingBalance: number;
  totalInflow: number;
  totalOutflow: number;
  netCashFlow: number;
  entries: CashFlowEntry[];
  summary: {
    byCategory: Record<string, number>;
    byMonth: Record<string, number>;
    byBankAccount: Record<string, number>;
  };
}

// Dados para criar pagamento
export interface CreatePaymentData {
  type: PaymentType;
  priority: PaymentPriority;
  invoiceId?: string;
  paymentRequestId?: string;
  supplierId?: string;
  amount: number;
  currency: 'AOA' | 'USD' | 'EUR';
  paymentMethod: PaymentMethod;
  sourceAccountId: string;
  beneficiaryBankData: BeneficiaryBankData;
  scheduledDate?: Date;
  description?: string;
  internalNotes?: string;
  publicNotes?: string;
}

// Dados para atualizar pagamento
export interface UpdatePaymentData {
  id: string;
  priority?: PaymentPriority;
  scheduledDate?: Date;
  description?: string;
  internalNotes?: string;
  publicNotes?: string;
  paymentMethod?: PaymentMethod;
  beneficiaryBankData?: BeneficiaryBankData;
  status?: PaymentStatus;
  externalReference?: string;
  processedDate?: Date;
  bankFee?: number;
  totalDeductions?: number;
  netAmount?: number;
  approvedBy?: string;
  approvalDate?: Date;
  approvalNotes?: string;
  rejectionReason?: string;
}

// Dados para processar pagamento
export interface ProcessPaymentData {
  paymentId: string;
  externalReference?: string;
  processedDate: Date;
  bankFee?: number;
  exchangeFee?: number;
  otherFees?: number;
  receiptFile?: File;
}

// Configurações do sistema de pagamentos
export interface PaymentSystemConfig {
  dailyLimit: number;
  monthlyLimit: number;
  singlePaymentLimit: number;
  approvalThreshold: number;
  defaultCurrency: 'AOA' | 'USD' | 'EUR';
  workingDays: number[];
  cutoffTime: string; // HH:MM
  enableScheduling: boolean;
  enableMultiCurrency: boolean;
  requireReceiptUpload: boolean;
}

// Workflow de aprovação de pagamento
export interface PaymentWorkflow {
  paymentId: string;
  currentStep: number;
  totalSteps: number;
  steps: {
    stepNumber: number;
    name: string;
    description: string;
    requiredRole: string;
    completedAt?: Date;
    completedBy?: string;
    notes?: string;
    isActive: boolean;
    isCompleted: boolean;
  }[];
}

export default Payment;
