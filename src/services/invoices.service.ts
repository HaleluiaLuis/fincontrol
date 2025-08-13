import { apiService, ApiResponse, PaginatedResponse } from './api';
import { Invoice, InvoiceStatus, CreateInvoiceData, UpdateInvoiceData } from '@/types/invoice';

export interface InvoiceFilters {
  status?: InvoiceStatus[];
  suppliers?: string[];
  categories?: string[];
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
}

// Utilitário para converter filtros para parâmetros de query string
function invoiceFiltersToParams(filters: InvoiceFilters): Record<string, string> {
  const params: Record<string, string> = {};
  
  if (filters.status?.length) {
    params.status = filters.status.join(',');
  }
  if (filters.suppliers?.length) {
    params.suppliers = filters.suppliers.join(',');
  }
  if (filters.categories?.length) {
    params.categories = filters.categories.join(',');
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

export class InvoicesService {
  private readonly baseEndpoint = '/invoices';

  // Listar faturas com paginação e filtros
  async getInvoices(
    page: number = 1,
    limit: number = 10,
    filters?: InvoiceFilters
  ): Promise<ApiResponse<PaginatedResponse<Invoice>>> {
    const params = {
      page: page.toString(),
      limit: limit.toString(),
      ...(filters ? invoiceFiltersToParams(filters) : {}),
    };
    
    return apiService.get<PaginatedResponse<Invoice>>(this.baseEndpoint, params);
  }

  // Obter fatura por ID
  async getInvoiceById(id: string): Promise<ApiResponse<Invoice>> {
    return apiService.get<Invoice>(`${this.baseEndpoint}/${id}`);
  }

  // Criar nova fatura
  async createInvoice(data: CreateInvoiceData): Promise<ApiResponse<Invoice>> {
    return apiService.post<Invoice>(this.baseEndpoint, data);
  }

  // Atualizar fatura
  async updateInvoice(id: string, data: UpdateInvoiceData): Promise<ApiResponse<Invoice>> {
    return apiService.put<Invoice>(`${this.baseEndpoint}/${id}`, data);
  }

  // Deletar fatura
  async deleteInvoice(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return apiService.delete<{ success: boolean }>(`${this.baseEndpoint}/${id}`);
  }

  // Aprovar fatura
  async approveInvoice(
    id: string,
    comment?: string
  ): Promise<ApiResponse<Invoice>> {
    return apiService.patch<Invoice>(`${this.baseEndpoint}/${id}/approve`, {
      comment,
    });
  }

  // Rejeitar fatura
  async rejectInvoice(
    id: string,
    reason: string,
    comment?: string
  ): Promise<ApiResponse<Invoice>> {
    return apiService.patch<Invoice>(`${this.baseEndpoint}/${id}/reject`, {
      reason,
      comment,
    });
  }

  // Marcar como paga
  async markAsPaid(
    id: string,
    paymentDate: Date,
    paymentMethod: string,
    transactionId?: string
  ): Promise<ApiResponse<Invoice>> {
    return apiService.patch<Invoice>(`${this.baseEndpoint}/${id}/mark-paid`, {
      paymentDate: paymentDate.toISOString(),
      paymentMethod,
      transactionId,
    });
  }

  // Cancelar fatura
  async cancelInvoice(
    id: string,
    reason: string
  ): Promise<ApiResponse<Invoice>> {
    return apiService.patch<Invoice>(`${this.baseEndpoint}/${id}/cancel`, {
      reason,
    });
  }

  // Upload de anexo
  async uploadAttachment(
    invoiceId: string,
    file: File,
    description?: string
  ): Promise<ApiResponse<{ attachmentId: string; url: string }>> {
    return apiService.upload<{ attachmentId: string; url: string }>(
      `${this.baseEndpoint}/${invoiceId}/attachments`,
      file,
      description ? { description } : undefined
    );
  }

  // Remover anexo
  async removeAttachment(
    invoiceId: string,
    attachmentId: string
  ): Promise<ApiResponse<{ success: boolean }>> {
    return apiService.delete<{ success: boolean }>(
      `${this.baseEndpoint}/${invoiceId}/attachments/${attachmentId}`
    );
  }

  // Obter histórico de alterações
  async getInvoiceHistory(
    invoiceId: string
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
    }[]>(`${this.baseEndpoint}/${invoiceId}/history`);
  }

  // Duplicar fatura
  async duplicateInvoice(
    id: string,
    changes?: Partial<CreateInvoiceData>
  ): Promise<ApiResponse<Invoice>> {
    return apiService.post<Invoice>(`${this.baseEndpoint}/${id}/duplicate`, changes);
  }

  // Gerar PDF da fatura
  async generatePDF(invoiceId: string): Promise<Blob> {
    const response = await fetch(`${apiService['baseUrl']}${this.baseEndpoint}/${invoiceId}/pdf`, {
      headers: apiService['headers'],
    });

    if (!response.ok) {
      throw new Error('Erro ao gerar PDF da fatura');
    }

    return response.blob();
  }

  // Enviar fatura por email
  async sendByEmail(
    invoiceId: string,
    recipients: string[],
    subject?: string,
    message?: string
  ): Promise<ApiResponse<{ sent: boolean; messageId: string }>> {
    return apiService.post<{ sent: boolean; messageId: string }>(
      `${this.baseEndpoint}/${invoiceId}/send-email`,
      {
        recipients,
        subject,
        message,
      }
    );
  }

  // Estatísticas gerais de faturas
  async getInvoiceStats(
    filters?: InvoiceFilters
  ): Promise<ApiResponse<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    paid: number;
    cancelled: number;
    totalAmount: number;
    pendingAmount: number;
    approvedAmount: number;
    paidAmount: number;
  }>> {
    const params = filters ? invoiceFiltersToParams(filters) : {};
    return apiService.get<{
      total: number;
      pending: number;
      approved: number;
      rejected: number;
      paid: number;
      cancelled: number;
      totalAmount: number;
      pendingAmount: number;
      approvedAmount: number;
      paidAmount: number;
    }>(`${this.baseEndpoint}/stats`, params);
  }

  // Buscar faturas próximas ao vencimento
  async getUpcomingInvoices(
    days: number = 30
  ): Promise<ApiResponse<Invoice[]>> {
    return apiService.get<Invoice[]>(`${this.baseEndpoint}/upcoming`, {
      days: days.toString(),
    });
  }

  // Buscar faturas vencidas
  async getOverdueInvoices(): Promise<ApiResponse<Invoice[]>> {
    return apiService.get<Invoice[]>(`${this.baseEndpoint}/overdue`);
  }
}

// Instância global do serviço de faturas
export const invoicesService = new InvoicesService();
