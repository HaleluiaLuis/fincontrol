// Serviço base de API
export { apiService, useApi, ApiError, isApiError, getErrorMessage } from './api';
export type { ApiResponse, PaginatedResponse, ApiErrorData, RequestInterceptor, ResponseInterceptor } from './api';

// Serviço de autenticação
export { authService } from './auth.service';
export type { 
  AuthCredentials, 
  User, 
  AuthResponse, 
  RefreshTokenResponse, 
  ForgotPasswordRequest, 
  ResetPasswordRequest, 
  ChangePasswordRequest, 
  RegisterRequest 
} from './auth.service';

// Serviço de relatórios
export { reportsService } from './reports.service';

// Serviço de faturas
export { invoicesService } from './invoices.service';
export type { InvoiceFilters } from './invoices.service';

// Serviço de pagamentos
export { paymentsService } from './payments.service';
export type { PaymentFilters } from './payments.service';

// Serviço de fornecedores
export { suppliersService } from './suppliers.service';
export type { SupplierFilters } from './suppliers.service';

// Serviço de transações
export { transactionsService } from './transactions.service';
export type { TransactionFilters, CreateTransactionData, UpdateTransactionData } from './transactions.service';

// Importar instâncias para usar internamente
import { apiService } from './api';
import { authService } from './auth.service';
import { reportsService } from './reports.service';
import { invoicesService } from './invoices.service';
import { paymentsService } from './payments.service';
import { suppliersService } from './suppliers.service';
import { transactionsService } from './transactions.service';

// Hook para facilitar o uso de todos os serviços nos componentes
export function useServices() {
  return {
    api: apiService,
    auth: authService,
    reports: reportsService,
    invoices: invoicesService,
    payments: paymentsService,
    suppliers: suppliersService,
    transactions: transactionsService,
  };
}
