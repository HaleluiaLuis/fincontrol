import { apiService, ApiResponse, PaginatedResponse } from './api';
import { Payment, PaymentStatus, CreatePaymentData, UpdatePaymentData } from '@/types/payment';

export interface PaymentFilters {
  status?: PaymentStatus[];
  methods?: string[];
  suppliers?: string[];
  invoices?: string[];
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
}

// Utilitário para converter filtros para parâmetros de query string
function paymentFiltersToParams(filters: PaymentFilters): Record<string, string> {
  const params: Record<string, string> = {};
  
  if (filters.status?.length) {
    params.status = filters.status.join(',');
  }
  if (filters.methods?.length) {
    params.methods = filters.methods.join(',');
  }
  if (filters.suppliers?.length) {
    params.suppliers = filters.suppliers.join(',');
  }
  if (filters.invoices?.length) {
    params.invoices = filters.invoices.join(',');
  }
  if (filters.startDate) {
    params.startDate = filters.startDate.toISOString().split('T')[0];
  }
  if (filters.endDate) {
    params.endDate = filters.endDate.toISOString().split('T')[0];
  }
  if (filters.minAmount !== undefined) {
    params.minAmount = filters.minAmount.toString();
  }
  if (filters.maxAmount !== undefined) {
    params.maxAmount = filters.maxAmount.toString();
  }
  if (filters.search) {
    params.search = filters.search;
  }
  
  return params;
}

export class PaymentsService {
  private readonly baseEndpoint = '/payments';

  // Listar pagamentos com paginação e filtros
  async getPayments(
    page: number = 1,
    limit: number = 10,
    filters?: PaymentFilters
  ): Promise<ApiResponse<PaginatedResponse<Payment>>> {
    const params = {
      page: page.toString(),
      limit: limit.toString(),
      ...(filters ? paymentFiltersToParams(filters) : {}),
    };
    
    return apiService.get<PaginatedResponse<Payment>>(this.baseEndpoint, params);
  }

  // Obter pagamento por ID
  async getPaymentById(id: string): Promise<ApiResponse<Payment>> {
    return apiService.get<Payment>(`${this.baseEndpoint}/${id}`);
  }

  // Criar novo pagamento
  async createPayment(data: CreatePaymentData): Promise<ApiResponse<Payment>> {
    return apiService.post<Payment>(this.baseEndpoint, data);
  }

  // Atualizar pagamento
  async updatePayment(id: string, data: UpdatePaymentData): Promise<ApiResponse<Payment>> {
    return apiService.put<Payment>(`${this.baseEndpoint}/${id}`, data);
  }

  // Deletar pagamento
  async deletePayment(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return apiService.delete<{ success: boolean }>(`${this.baseEndpoint}/${id}`);
  }

  // Aprovar pagamento
  async approvePayment(
    id: string,
    comment?: string
  ): Promise<ApiResponse<Payment>> {
    return apiService.patch<Payment>(`${this.baseEndpoint}/${id}/approve`, {
      comment,
    });
  }

  // Rejeitar pagamento
  async rejectPayment(
    id: string,
    reason: string,
    comment?: string
  ): Promise<ApiResponse<Payment>> {
    return apiService.patch<Payment>(`${this.baseEndpoint}/${id}/reject`, {
      reason,
      comment,
    });
  }

  // Processar pagamento
  async processPayment(
    id: string,
    transactionId: string,
    processedDate?: Date
  ): Promise<ApiResponse<Payment>> {
    return apiService.patch<Payment>(`${this.baseEndpoint}/${id}/process`, {
      transactionId,
      processedDate: processedDate?.toISOString() || new Date().toISOString(),
    });
  }

  // Cancelar pagamento
  async cancelPayment(
    id: string,
    reason: string
  ): Promise<ApiResponse<Payment>> {
    return apiService.patch<Payment>(`${this.baseEndpoint}/${id}/cancel`, {
      reason,
    });
  }

  // Marcar pagamento como falhado
  async failPayment(
    id: string,
    errorMessage: string,
    errorCode?: string
  ): Promise<ApiResponse<Payment>> {
    return apiService.patch<Payment>(`${this.baseEndpoint}/${id}/fail`, {
      errorMessage,
      errorCode,
    });
  }

  // Upload de comprovante
  async uploadReceipt(
    paymentId: string,
    file: File,
    description?: string
  ): Promise<ApiResponse<{ receiptId: string; url: string }>> {
    return apiService.upload<{ receiptId: string; url: string }>(
      `${this.baseEndpoint}/${paymentId}/receipt`,
      file,
      description ? { description } : undefined
    );
  }

  // Remover comprovante
  async removeReceipt(
    paymentId: string,
    receiptId: string
  ): Promise<ApiResponse<{ success: boolean }>> {
    return apiService.delete<{ success: boolean }>(
      `${this.baseEndpoint}/${paymentId}/receipt/${receiptId}`
    );
  }

  // Obter histórico de alterações
  async getPaymentHistory(
    paymentId: string
  ): Promise<ApiResponse<{
    id: string;
    action: string;
    userId: string;
    userName: string;
    timestamp: Date;
    changes?: Record<string, { from: unknown; to: unknown }>;
    comment?: string;
  }[]>> {
    return apiService.get<{
      id: string;
      action: string;
      userId: string;
      userName: string;
      timestamp: Date;
      changes?: Record<string, { from: unknown; to: unknown }>;
      comment?: string;
    }[]>(`${this.baseEndpoint}/${paymentId}/history`);
  }

  // Obter pagamentos agendados
  async getScheduledPayments(): Promise<ApiResponse<Payment[]>> {
    return apiService.get<Payment[]>(`${this.baseEndpoint}/scheduled`);
  }

  // Agendar pagamento
  async schedulePayment(
    id: string,
    scheduledDate: Date
  ): Promise<ApiResponse<Payment>> {
    return apiService.patch<Payment>(`${this.baseEndpoint}/${id}/schedule`, {
      scheduledDate: scheduledDate.toISOString(),
    });
  }

  // Cancelar agendamento
  async unschedulePayment(id: string): Promise<ApiResponse<Payment>> {
    return apiService.patch<Payment>(`${this.baseEndpoint}/${id}/unschedule`, {});
  }

  // Processar pagamentos agendados (usado pelo sistema)
  async processScheduledPayments(): Promise<ApiResponse<{
    processed: number;
    failed: number;
    results: Array<{
      paymentId: string;
      success: boolean;
      error?: string;
    }>;
  }>> {
    return apiService.post<{
      processed: number;
      failed: number;
      results: Array<{
        paymentId: string;
        success: boolean;
        error?: string;
      }>;
    }>(`${this.baseEndpoint}/process-scheduled`, {});
  }

  // Estatísticas de pagamentos
  async getPaymentStats(
    filters?: PaymentFilters
  ): Promise<ApiResponse<{
    total: number;
    pending: number;
    approved: number;
    processed: number;
    failed: number;
    cancelled: number;
    totalAmount: number;
    processedAmount: number;
    pendingAmount: number;
    failedAmount: number;
  }>> {
    const params = filters ? paymentFiltersToParams(filters) : {};
    return apiService.get<{
      total: number;
      pending: number;
      approved: number;
      processed: number;
      failed: number;
      cancelled: number;
      totalAmount: number;
      processedAmount: number;
      pendingAmount: number;
      failedAmount: number;
    }>(`${this.baseEndpoint}/stats`, params);
  }

  // Obter métodos de pagamento disponíveis
  async getPaymentMethods(): Promise<ApiResponse<{
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    fees?: {
      fixed?: number;
      percentage?: number;
    };
  }[]>> {
    return apiService.get<{
      id: string;
      name: string;
      description: string;
      isActive: boolean;
      fees?: {
        fixed?: number;
        percentage?: number;
      };
    }[]>(`${this.baseEndpoint}/methods`);
  }

  // Validar dados bancários
  async validateBankAccount(
    bank: string,
    agency: string,
    account: string,
    accountType: string
  ): Promise<ApiResponse<{
    valid: boolean;
    bankName: string;
    accountHolder?: string;
    errors?: string[];
  }>> {
    return apiService.post<{
      valid: boolean;
      bankName: string;
      accountHolder?: string;
      errors?: string[];
    }>(`${this.baseEndpoint}/validate-bank-account`, {
      bank,
      agency,
      account,
      accountType,
    });
  }

  // Simular taxas de pagamento
  async calculateFees(
    amount: number,
    paymentMethod: string
  ): Promise<ApiResponse<{
    amount: number;
    fees: {
      fixed: number;
      percentage: number;
      total: number;
    };
    netAmount: number;
  }>> {
    return apiService.post<{
      amount: number;
      fees: {
        fixed: number;
        percentage: number;
        total: number;
      };
      netAmount: number;
    }>(`${this.baseEndpoint}/calculate-fees`, {
      amount,
      paymentMethod,
    });
  }

  // Gerar relatório de conciliação
  async generateReconciliationReport(
    startDate: Date,
    endDate: Date,
    format: 'pdf' | 'excel' | 'csv' = 'pdf'
  ): Promise<Blob> {
    const response = await fetch(`${apiService['baseUrl']}${this.baseEndpoint}/reconciliation-report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...apiService['headers'],
      },
      body: JSON.stringify({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        format,
      }),
    });

    if (!response.ok) {
      throw new Error('Erro ao gerar relatório de conciliação');
    }

    return response.blob();
  }
}

// Instância global do serviço de pagamentos
export const paymentsService = new PaymentsService();
