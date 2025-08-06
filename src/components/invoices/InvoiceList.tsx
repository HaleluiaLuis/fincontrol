// Lista de faturas com informações detalhadas
import { Invoice, Supplier, Category } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { InvoiceStatusBadge } from './InvoiceStatusBadge';

interface InvoiceListProps {
  invoices: Invoice[];
  suppliers: Supplier[];
  categories: Category[];
  onViewDetails?: (invoice: Invoice) => void;
  onApprove?: (invoiceId: string) => void;
  onReject?: (invoiceId: string, comments: string) => void;
  currentUserRole?: string;
}

export function InvoiceList({ 
  invoices, 
  suppliers, 
  categories, 
  onViewDetails,
  onApprove,
  onReject,
  currentUserRole = 'administrador'
}: InvoiceListProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getSupplierName = (supplierId: string) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    return supplier?.name || 'Fornecedor não encontrado';
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || 'Categoria não encontrada';
  };

  const canUserActOnInvoice = (invoice: Invoice) => {
    switch (currentUserRole) {
      case 'gabinete_contratacao':
        return invoice.currentStep === 'gabinete_contratacao';
      case 'presidente':
        return invoice.currentStep === 'presidente';
      case 'gabinete_apoio':
        return invoice.currentStep === 'gabinete_apoio';
      case 'financas':
        return invoice.currentStep === 'financas';
      case 'administrador':
        return true;
      default:
        return false;
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  if (invoices.length === 0) {
    return (
      <Card title="Faturas">
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma fatura</h3>
          <p className="mt-1 text-sm text-gray-500">
            Não há faturas registradas no sistema.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Faturas">
      {/* Mobile view */}
      <div className="block lg:hidden space-y-4">
        {invoices.map((invoice) => (
          <div key={invoice.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {invoice.invoiceNumber}
                </h4>
                <p className="text-xs text-gray-500 truncate">
                  {getSupplierName(invoice.supplierId)}
                </p>
              </div>
              <div className="ml-2 flex-shrink-0">
                <InvoiceStatusBadge status={invoice.status} />
              </div>
            </div>
            
            <div className="text-sm text-gray-600 mb-2 truncate">
              {invoice.description}
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {getCategoryName(invoice.category)}
              </span>
              <span className={`font-medium ${isOverdue(invoice.dueDate) ? 'text-red-600' : 'text-gray-600'}`}>
                {formatDate(invoice.dueDate)}
                {isOverdue(invoice.dueDate) && ' (Vencida)'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-gray-900">
                {formatCurrency(invoice.amount)}
              </span>
              <div className="flex space-x-1">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onViewDetails?.(invoice)}
                  className="text-xs px-2 py-1"
                >
                  Ver
                </Button>
                
                {canUserActOnInvoice(invoice) && (
                  <>
                    {onApprove && (
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => onApprove(invoice.id)}
                        className="text-xs px-2 py-1"
                      >
                        ✓
                      </Button>
                    )}
                    {onReject && (
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => {
                          const comments = prompt('Comentários sobre a rejeição:');
                          if (comments !== null) {
                            onReject(invoice.id, comments);
                          }
                        }}
                        className="text-xs px-2 py-1"
                      >
                        ✗
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop view */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fatura
              </th>
              <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fornecedor
              </th>
              <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descrição
              </th>
              <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor
              </th>
              <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vencimento
              </th>
              <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-gray-50">
                <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {invoice.invoiceNumber}
                    </div>
                    <div className="text-sm text-gray-500">
                      {getCategoryName(invoice.category)}
                    </div>
                  </div>
                </td>
                <td className="px-4 xl:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="max-w-xs truncate">
                    {getSupplierName(invoice.supplierId)}
                  </div>
                </td>
                <td className="px-4 xl:px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs lg:max-w-sm truncate">
                    {invoice.description}
                  </div>
                </td>
                <td className="px-4 xl:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {formatCurrency(invoice.amount)}
                </td>
                <td className="px-4 xl:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className={isOverdue(invoice.dueDate) ? 'text-red-600 font-medium' : ''}>
                    {formatDate(invoice.dueDate)}
                    {isOverdue(invoice.dueDate) && (
                      <span className="block text-xs text-red-500">Vencida</span>
                    )}
                  </div>
                </td>
                <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                  <InvoiceStatusBadge status={invoice.status} />
                </td>
                <td className="px-4 xl:px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-1 xl:space-x-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => onViewDetails?.(invoice)}
                      className="text-xs xl:text-sm px-2 xl:px-3"
                    >
                      <span className="lg:hidden">Ver</span>
                      <span className="hidden lg:inline">Ver Detalhes</span>
                    </Button>
                    
                    {canUserActOnInvoice(invoice) && (
                      <>
                        {onApprove && (
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => onApprove(invoice.id)}
                            className="text-xs xl:text-sm px-2 xl:px-3"
                          >
                            <span className="lg:hidden">✓</span>
                            <span className="hidden lg:inline">Aprovar</span>
                          </Button>
                        )}
                        {onReject && (
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => {
                              const comments = prompt('Comentários sobre a rejeição:');
                              if (comments !== null) {
                                onReject(invoice.id, comments);
                              }
                            }}
                            className="text-xs xl:text-sm px-2 xl:px-3"
                          >
                            <span className="lg:hidden">✗</span>
                            <span className="hidden lg:inline">Rejeitar</span>
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
