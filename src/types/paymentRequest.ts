export type PaymentRequestStatus = 
  | 'RASCUNHO'           // Criado mas não enviado
  | 'PENDENTE_VALIDACAO' // Aguardando análise do Gabinete de Contratação
  | 'EM_ANALISE'         // Sendo analisado pelo Gabinete de Contratação
  | 'VALIDADO'           // Documentação OK, aguardando decisão do Presidente
  | 'AUTORIZADO'         // Aprovado pelo Presidente, aguarda registro de fatura
  | 'REJEITADO'          // Rejeitado pelo Presidente
  | 'FATURA_REGISTRADA'  // Fatura registrada pelo Gabinete de Apoio
  | 'PENDENTE_PAGAMENTO' // Aguardando pagamento pelo setor Financeiro
  | 'PAGO'               // Pagamento concluído
  | 'CANCELADO';         // Processo cancelado

export type PaymentRequestPriority = 'BAIXA' | 'NORMAL' | 'ALTA' | 'URGENTE';

export type PaymentMethod = 'TRANSFERENCIA_BANCARIA' | 'CHEQUE' | 'DINHEIRO' | 'MULTICAIXA';

export interface PaymentRequestDocument {
  id: string;
  name: string;
  type: 'CONTRATO' | 'FATURA' | 'RECIBO' | 'ORCAMENTO' | 'OUTRO';
  filePath: string;
  uploadDate: Date;
  uploadedBy: string;
  size: number;
  mimeType: string;
}

export interface PaymentRequestItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category: string;
}

export interface PaymentRequestApproval {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: 'VALIDAR' | 'APROVAR' | 'REJEITAR' | 'SOLICITAR_ANALISE';
  comments?: string;
  date: Date;
}

export interface PaymentRequest {
  id: string;
  
  // Informações básicas
  title: string;
  description: string;
  supplierId: string;
  supplierName: string;
  
  // Valores
  items: PaymentRequestItem[];
  subtotal: number;
  tax: number;
  totalAmount: number;
  
  // Status e prioridade
  status: PaymentRequestStatus;
  priority: PaymentRequestPriority;
  
  // Documentos
  documents: PaymentRequestDocument[];
  
  // Fluxo de aprovação
  approvals: PaymentRequestApproval[];
  currentApprover?: string;
  
  // Informações de pagamento
  paymentMethod?: PaymentMethod;
  paymentDate?: Date;
  paymentReference?: string;
  
  // Datas importantes
  requestDate: Date;
  dueDate?: Date;
  
  // Histórico
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  lastModifiedBy: string;
  
  // Observações
  internalNotes?: string;
  publicComments?: string;
  
  // Controle de contrato
  hasValidContract: boolean;
  contractNumber?: string;
  contractExpiryDate?: Date;
}

export interface CreatePaymentRequestData {
  title: string;
  description: string;
  supplierId: string;
  items: Omit<PaymentRequestItem, 'id'>[];
  priority: PaymentRequestPriority;
  dueDate?: Date;
  publicComments?: string;
}

export interface UpdatePaymentRequestData extends Partial<CreatePaymentRequestData> {
  id: string;
  status?: PaymentRequestStatus;
  approvals?: PaymentRequestApproval[];
  currentApprover?: string;
  internalNotes?: string;
}

export interface PaymentRequestFilters {
  search?: string;
  status?: PaymentRequestStatus;
  priority?: PaymentRequestPriority;
  supplierId?: string;
  createdBy?: string;
  dateFrom?: Date;
  dateTo?: Date;
  amountMin?: number;
  amountMax?: number;
  hasValidContract?: boolean;
}

export interface PaymentRequestStats {
  total: number;
  byStatus: Record<PaymentRequestStatus, number>;
  byPriority: Record<PaymentRequestPriority, number>;
  totalAmount: number;
  pendingAmount: number;
  paidAmount: number;
  averageProcessingTime: number;
  approvalRate: number;
  overdueSolicitations: number;
}

export interface PaymentRequestWorkflow {
  currentStep: number;
  totalSteps: number;
  steps: Array<{
    id: string;
    title: string;
    description: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED';
    assignedTo?: string;
    assignedRole?: string;
    completedAt?: Date;
    completedBy?: string;
  }>;
}
