import { Role } from '@/types';

// Definição de todas as permissões do sistema
export const PERMISSIONS = {
  // Dashboard
  DASHBOARD_READ: 'dashboard.read',
  
  // Relatórios
  REPORTS_READ: 'reports.read',
  REPORTS_WRITE: 'reports.write',
  REPORTS_EXPORT: 'reports.export',
  
  // Faturas/Invoices
  INVOICES_READ: 'invoices.read',
  INVOICES_WRITE: 'invoices.write',
  INVOICES_APPROVE: 'invoices.approve',
  INVOICES_DELETE: 'invoices.delete',
  
  // Transações
  TRANSACTIONS_READ: 'transactions.read',
  TRANSACTIONS_WRITE: 'transactions.write',
  TRANSACTIONS_DELETE: 'transactions.delete',
  
  // Fornecedores
  SUPPLIERS_READ: 'suppliers.read',
  SUPPLIERS_WRITE: 'suppliers.write',
  SUPPLIERS_DELETE: 'suppliers.delete',
  
  // Solicitações de Pagamento
  PAYMENT_REQUESTS_READ: 'payment_requests.read',
  PAYMENT_REQUESTS_WRITE: 'payment_requests.write',
  PAYMENT_REQUESTS_APPROVE: 'payment_requests.approve',
  PAYMENT_REQUESTS_DELETE: 'payment_requests.delete',
  
  // Pagamentos
  PAYMENTS_READ: 'payments.read',
  PAYMENTS_WRITE: 'payments.write',
  PAYMENTS_EXECUTE: 'payments.execute',
  PAYMENTS_DELETE: 'payments.delete',
  
  // Usuários
  USERS_READ: 'users.read',
  USERS_WRITE: 'users.write',
  USERS_DELETE: 'users.delete',
  
  // Configurações
  SETTINGS_READ: 'settings.read',
  SETTINGS_WRITE: 'settings.write',
  
  // Administração
  ADMIN_ALL: 'admin.all'
} as const;

// Mapeamento de roles para permissões
export const ROLE_PERMISSIONS: Record<Role, string[]> = {
  ADMIN: [
    // Admin tem acesso total
    PERMISSIONS.ADMIN_ALL,
    PERMISSIONS.DASHBOARD_READ,
    PERMISSIONS.REPORTS_READ,
    PERMISSIONS.REPORTS_WRITE,
    PERMISSIONS.REPORTS_EXPORT,
    PERMISSIONS.INVOICES_READ,
    PERMISSIONS.INVOICES_WRITE,
    PERMISSIONS.INVOICES_APPROVE,
    PERMISSIONS.INVOICES_DELETE,
    PERMISSIONS.TRANSACTIONS_READ,
    PERMISSIONS.TRANSACTIONS_WRITE,
    PERMISSIONS.TRANSACTIONS_DELETE,
    PERMISSIONS.SUPPLIERS_READ,
    PERMISSIONS.SUPPLIERS_WRITE,
    PERMISSIONS.SUPPLIERS_DELETE,
    PERMISSIONS.PAYMENT_REQUESTS_READ,
    PERMISSIONS.PAYMENT_REQUESTS_WRITE,
    PERMISSIONS.PAYMENT_REQUESTS_APPROVE,
    PERMISSIONS.PAYMENT_REQUESTS_DELETE,
    PERMISSIONS.PAYMENTS_READ,
    PERMISSIONS.PAYMENTS_WRITE,
    PERMISSIONS.PAYMENTS_EXECUTE,
    PERMISSIONS.PAYMENTS_DELETE,
    PERMISSIONS.USERS_READ,
    PERMISSIONS.USERS_WRITE,
    PERMISSIONS.USERS_DELETE,
    PERMISSIONS.SETTINGS_READ,
    PERMISSIONS.SETTINGS_WRITE
  ],
  
  PRESIDENTE: [
    // Presidente tem acesso a tudo exceto administração de usuários
    PERMISSIONS.DASHBOARD_READ,
    PERMISSIONS.REPORTS_READ,
    PERMISSIONS.REPORTS_WRITE,
    PERMISSIONS.REPORTS_EXPORT,
    PERMISSIONS.INVOICES_READ,
    PERMISSIONS.INVOICES_APPROVE,
    PERMISSIONS.TRANSACTIONS_READ,
    PERMISSIONS.SUPPLIERS_READ,
    PERMISSIONS.PAYMENT_REQUESTS_READ,
    PERMISSIONS.PAYMENT_REQUESTS_APPROVE,
    PERMISSIONS.PAYMENTS_READ,
    PERMISSIONS.PAYMENTS_EXECUTE,
    PERMISSIONS.SETTINGS_READ
  ],
  
  GABINETE_CONTRATACAO: [
    // Gabinete de Contratação focado em fornecedores e contratos
    PERMISSIONS.DASHBOARD_READ,
    PERMISSIONS.REPORTS_READ,
    PERMISSIONS.INVOICES_READ,
    PERMISSIONS.INVOICES_WRITE,
    PERMISSIONS.TRANSACTIONS_READ,
    PERMISSIONS.SUPPLIERS_READ,
    PERMISSIONS.SUPPLIERS_WRITE,
    PERMISSIONS.PAYMENT_REQUESTS_READ,
    PERMISSIONS.PAYMENT_REQUESTS_WRITE,
    PERMISSIONS.PAYMENTS_READ,
    PERMISSIONS.SETTINGS_READ
  ],
  
  GABINETE_APOIO: [
    // Gabinete de Apoio com acesso básico
    PERMISSIONS.DASHBOARD_READ,
    PERMISSIONS.REPORTS_READ,
    PERMISSIONS.INVOICES_READ,
    PERMISSIONS.TRANSACTIONS_READ,
    PERMISSIONS.SUPPLIERS_READ,
    PERMISSIONS.PAYMENT_REQUESTS_READ,
    PERMISSIONS.PAYMENTS_READ,
    PERMISSIONS.SETTINGS_READ
  ],
  
  FINANCAS: [
    // Finanças com foco em transações e pagamentos
    PERMISSIONS.DASHBOARD_READ,
    PERMISSIONS.REPORTS_READ,
    PERMISSIONS.REPORTS_WRITE,
    PERMISSIONS.INVOICES_READ,
    PERMISSIONS.INVOICES_WRITE,
    PERMISSIONS.TRANSACTIONS_READ,
    PERMISSIONS.TRANSACTIONS_WRITE,
    PERMISSIONS.SUPPLIERS_READ,
    PERMISSIONS.PAYMENT_REQUESTS_READ,
    PERMISSIONS.PAYMENT_REQUESTS_WRITE,
    PERMISSIONS.PAYMENTS_READ,
    PERMISSIONS.PAYMENTS_WRITE,
    PERMISSIONS.SETTINGS_READ
  ],
  
  USER: [
    // Usuário básico com acesso limitado
    PERMISSIONS.DASHBOARD_READ,
    PERMISSIONS.REPORTS_READ,
    PERMISSIONS.TRANSACTIONS_READ,
    PERMISSIONS.SETTINGS_READ
  ],
  
  VIEWER: [
    // Visualizador com acesso mínimo (apenas leitura)
    PERMISSIONS.DASHBOARD_READ,
    PERMISSIONS.REPORTS_READ,
    PERMISSIONS.SETTINGS_READ
  ]
};

// Função para obter permissões de um role
export function getPermissionsForRole(role: Role): string[] {
  return ROLE_PERMISSIONS[role] || [];
}

// Função para verificar se um role tem uma permissão específica
export function roleHasPermission(role: Role, permission: string): boolean {
  const permissions = getPermissionsForRole(role);
  return permissions.includes(permission) || permissions.includes(PERMISSIONS.ADMIN_ALL);
}

// Função para verificar se um usuário tem permissão
export function userHasPermission(userPermissions: string[], permission: string): boolean {
  return userPermissions.includes(permission) || userPermissions.includes(PERMISSIONS.ADMIN_ALL);
}
