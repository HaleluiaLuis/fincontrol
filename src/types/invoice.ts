export type InvoiceStatus = 
  | 'RASCUNHO'           // Fatura criada mas não enviada
  | 'ENVIADA'            // Enviada ao fornecedor
  | 'RECEBIDA'           // Recebida do fornecedor
  | 'EM_VALIDACAO'       // Em processo de validação
  | 'VALIDADA'           // Validada pelo Gabinete
  | 'APROVADA_PAGAMENTO' // Aprovada para pagamento
  | 'PAGA'               // Pagamento executado
  | 'VENCIDA'            // Venceu o prazo
  | 'CONTESTADA'         // Em disputa
  | 'CANCELADA';         // Cancelada

export type InvoiceType = 
  | 'SERVICO'            // Fatura de serviço
  | 'PRODUTO'            // Fatura de produto
  | 'MISTO';             // Misto (serviço + produto)

export type PaymentTerm = 
  | 'A_VISTA'            // À vista
  | '30_DIAS'            // 30 dias
  | '45_DIAS'            // 45 dias
  | '60_DIAS'            // 60 dias
  | '90_DIAS'            // 90 dias
  | 'PERSONALIZADO';     // Prazo personalizado

// Item da fatura (pode vir de uma solicitação)
export interface InvoiceItem {
  id: string;
  description: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discountPercent?: number;
  discountAmount?: number;
  taxPercent?: number;
  taxAmount?: number;
  finalAmount: number;
}

// Documentos anexos à fatura
export interface InvoiceDocument {
  id: string;
  name: string;
  type: 'FATURA_ORIGINAL' | 'RECIBO' | 'ANEXO' | 'CONTRATO' | 'OUTROS';
  filePath: string;
  uploadDate: Date;
  uploadedBy: string;
  size: number;
  mimeType: string;
  isRequired: boolean;
  validated?: boolean;
  validatedBy?: string;
  validationDate?: Date;
}

// Histórico de alterações na fatura
export interface InvoiceAuditLog {
  id: string;
  action: 'CRIADA' | 'EDITADA' | 'STATUS_ALTERADO' | 'DOCUMENTO_ADICIONADO' | 'VALIDADA' | 'REJEITADA';
  description: string;
  userId: string;
  userName: string;
  userRole: string;
  date: Date;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
}

// Interface principal da fatura
export interface Invoice {
  id: string;
  
  // Identificação
  invoiceNumber: string;        // Número da fatura (gerado automaticamente)
  supplierInvoiceNumber?: string; // Número da fatura do fornecedor
  type: InvoiceType;
  status: InvoiceStatus;
  
  // Relacionamentos
  paymentRequestId?: string;    // Solicitação relacionada
  supplierId: string;          // Fornecedor
  supplierName: string;        // Nome do fornecedor (cache)
  contractId?: string;         // Contrato relacionado
  contractNumber?: string;     // Número do contrato (cache)
  
  // Dados da fatura
  issueDate: Date;             // Data de emissão
  dueDate: Date;               // Data de vencimento
  paymentTerm: PaymentTerm;    // Prazo de pagamento
  customPaymentDays?: number;  // Dias personalizados (se PERSONALIZADO)
  
  // Itens e valores
  items: InvoiceItem[];
  subtotal: number;            // Subtotal dos itens
  totalDiscount: number;       // Total de descontos
  totalTax: number;           // Total de impostos
  totalAmount: number;         // Valor final da fatura
  
  // Pagamento
  currency: string;            // Moeda (AOA)
  paymentMethod?: 'TRANSFERENCIA' | 'CHEQUE' | 'DINHEIRO' | 'OUTROS';
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    iban?: string;
    swift?: string;
  };
  
  // Observações e notas
  description?: string;        // Descrição geral
  publicNotes?: string;        // Notas visíveis a todos
  internalNotes?: string;      // Notas internas
  supplierNotes?: string;      // Notas do fornecedor
  
  // Documentos
  documents: InvoiceDocument[];
  
  // Aprovação e validação
  validatedBy?: string;        // Quem validou
  validatedDate?: Date;        // Quando foi validada
  approvedBy?: string;         // Quem aprovou pagamento
  approvedDate?: Date;         // Quando foi aprovada
  
  // Auditoria
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  lastModifiedBy: string;
  auditLog: InvoiceAuditLog[];
  
  // Status de pagamento
  isPaid: boolean;             // Se já foi paga
  paidDate?: Date;            // Data do pagamento
  paidAmount?: number;        // Valor pago
  paymentReference?: string;   // Referência do pagamento
  
  // Controle de vencimento
  isOverdue: boolean;         // Se está vencida
  daysPastDue?: number;       // Dias em atraso
  
  // Integração
  exportedToAccounting?: boolean; // Se foi exportada para contabilidade
  exportDate?: Date;              // Data da exportação
  
  // Workflow
  currentResponsible?: string;    // Responsável atual na cadeia
  nextAction?: string;            // Próxima ação necessária
}

// Dados para criar uma nova fatura
export interface CreateInvoiceData {
  // Pode ser criada a partir de uma solicitação
  paymentRequestId?: string;
  
  // Ou dados manuais
  supplierId: string;
  type: InvoiceType;
  issueDate: Date;
  dueDate: Date;
  paymentTerm: PaymentTerm;
  customPaymentDays?: number;
  
  items: Omit<InvoiceItem, 'id'>[];
  description?: string;
  publicNotes?: string;
  internalNotes?: string;
  
  // Dados do fornecedor (se manual)
  supplierInvoiceNumber?: string;
  bankDetails?: Invoice['bankDetails'];
}

// Dados para atualizar fatura
export interface UpdateInvoiceData {
  id: string;
  supplierInvoiceNumber?: string;
  issueDate?: Date;
  dueDate?: Date;
  paymentTerm?: PaymentTerm;
  customPaymentDays?: number;
  items?: InvoiceItem[];
  status?: InvoiceStatus;
  description?: string;
  publicNotes?: string;
  internalNotes?: string;
  supplierNotes?: string;
  bankDetails?: Invoice['bankDetails'];
  paymentMethod?: Invoice['paymentMethod'];
  validatedBy?: string;
  validatedDate?: Date;
  approvedBy?: string;
  approvedDate?: Date;
}

// Filtros para busca de faturas
export interface InvoiceFilters {
  search?: string;             // Busca por número, fornecedor
  status?: InvoiceStatus;      // Por status
  type?: InvoiceType;          // Por tipo
  supplierId?: string;         // Por fornecedor
  paymentRequestId?: string;   // Por solicitação
  
  // Filtros de data
  issueDateFrom?: Date;        // Data emissão início
  issueDateTo?: Date;          // Data emissão fim
  dueDateFrom?: Date;          // Data vencimento início
  dueDateTo?: Date;            // Data vencimento fim
  
  // Filtros de valor
  amountMin?: number;          // Valor mínimo
  amountMax?: number;          // Valor máximo
  
  // Filtros específicos
  isOverdue?: boolean;         // Apenas vencidas
  isPaid?: boolean;            // Apenas pagas
  paymentTerm?: PaymentTerm;   // Por prazo pagamento
  
  // Responsabilidade
  createdBy?: string;          // Criada por
  currentResponsible?: string; // Responsável atual
}

// Estatísticas das faturas
export interface InvoiceStats {
  total: number;
  byStatus: Record<InvoiceStatus, number>;
  byType: Record<InvoiceType, number>;
  
  // Valores financeiros
  totalAmount: number;         // Valor total de todas as faturas
  paidAmount: number;         // Valor total pago
  pendingAmount: number;      // Valor pendente
  overdueAmount: number;      // Valor em atraso
  
  // Métricas de tempo
  averagePaymentTime: number; // Tempo médio para pagamento (dias)
  averageProcessingTime: number; // Tempo médio de processamento
  
  // Controles
  overdueInvoices: number;    // Quantidade vencidas
  thisMonthInvoices: number;  // Faturas deste mês
  pendingValidation: number;  // Pendentes de validação
  
  // Taxa de eficiência
  onTimePaymentRate: number;  // Taxa de pagamentos no prazo (%)
  validationRate: number;     // Taxa de validação (%)
}

// Workflow da fatura (similar ao payment request)
export interface InvoiceWorkflow {
  currentStep: number;
  totalSteps: number;
  steps: Array<{
    id: string;
    title: string;
    description: string;
    status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
    responsibleRole?: string;
    estimatedDays?: number;
  }>;
}

// Dados para relatórios
export interface InvoiceReportData {
  period: {
    start: Date;
    end: Date;
  };
  summary: InvoiceStats;
  bySupplier: Array<{
    supplierId: string;
    supplierName: string;
    totalInvoices: number;
    totalAmount: number;
    paidAmount: number;
    averagePaymentTime: number;
  }>;
  byMonth: Array<{
    month: string;
    totalInvoices: number;
    totalAmount: number;
    paidAmount: number;
  }>;
  topSuppliers: Array<{
    supplierId: string;
    supplierName: string;
    totalAmount: number;
    invoiceCount: number;
  }>;
}
