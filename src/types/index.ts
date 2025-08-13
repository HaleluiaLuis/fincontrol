// Tipos de dados para o sistema de controle financeiro

export interface Transaction {
  id: string;
  type: 'receita' | 'despesa';
  description: string;
  amount: number;
  category: string; // armazenamos apenas id da categoria
  date: string; // ISO date
  status: 'pendente' | 'confirmada' | 'cancelada';
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'receita' | 'despesa';
  color: string;
  description?: string;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  taxId: string; // NIF ou equivalente
  bankAccount?: string;
  status: 'ativo' | 'inativo' | 'pendente';
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  createdAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  supplierId: string;
  description: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  serviceDate: string;
  category: string;
  attachments: string[]; // URLs dos documentos
  
  // Fluxo de aprovação
  status: InvoiceStatus;
  currentStep: WorkflowStep;
  approvalHistory: ApprovalStep[];
  
  // Controle
  createdAt: string;
  updatedAt: string;
  createdBy: string; // ID do usuário que criou
}

export type InvoiceStatus = 
  | 'pendente_contratacao'     // Aguardando verificação do Gabinete de Contratação
  | 'pendente_presidente'      // Aguardando autorização do Presidente
  | 'rejeitada'               // Rejeitada em qualquer etapa
  | 'aprovada_registro'       // Aprovada, aguardando registro no Gabinete de Apoio
  | 'registrada'              // Registrada no Gabinete de Apoio
  | 'pendente_pagamento'      // Enviada para Finanças
  | 'paga'                    // Pagamento efetuado
  | 'cancelada';              // Cancelada

export type WorkflowStep = 
  | 'gabinete_contratacao'
  | 'presidente'
  | 'gabinete_apoio'
  | 'financas'
  | 'concluido';

export interface ApprovalStep {
  id: string;
  step: WorkflowStep;
  action: 'aprovado' | 'rejeitado' | 'solicitado_correcao';
  userId: string;
  userName: string;
  comments?: string;
  timestamp: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'gabinete_contratacao' | 'presidente' | 'gabinete_apoio' | 'financas' | 'admin' | 'user' | 'viewer';
  department?: string;
  createdAt: string;
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
