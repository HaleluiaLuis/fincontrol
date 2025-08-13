// Lista de faturas com informações detalhadas
import { Invoice, Supplier, Category } from '@/types';
import { InvoiceStatusBadge } from './InvoiceStatusBadge';

interface InvoiceListProps {
  invoices: Invoice[];
  suppliers: Supplier[];
  categories: Category[];
  onViewDetails?: (invoice: Invoice) => void;
  // onApprove / onReject / currentUserRole removidos visualmente nesta fase
}

export function InvoiceList({ 
  invoices, 
  suppliers, 
  categories, 
  onViewDetails
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

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  if (invoices.length === 0) {
    return (
      <div className="surface-elevated overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--surface-alt)]">
          <h3 className="text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-100 uppercase">Faturas</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Registro e acompanhamento do ciclo de aprovação</p>
        </div>
        <div className="text-center py-10">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-3 text-sm font-semibold text-gray-900">Nenhuma fatura</h3>
          <p className="mt-1 text-sm text-gray-500">Não há faturas registradas no sistema.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="surface-elevated overflow-hidden">
      <div className="px-4 md:px-6 py-3 md:py-4 border-b border-[var(--border-subtle)] bg-[var(--surface-alt)]">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Faturas</h3>
        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 leading-snug max-w-2xl">Registro e acompanhamento do ciclo de aprovação</p>
      </div>
      <div className="overflow-x-auto md:overflow-x-visible">
    <table className="w-full">
          <thead className="bg-[var(--surface-alt)]">
            <tr>
      <th className="px-3 md:px-4 py-2 text-left text-[10px] md:text-xs font-semibold text-gray-500 uppercase tracking-wide">Fatura</th>
      <th className="px-3 md:px-4 py-2 text-left text-[10px] md:text-xs font-semibold text-gray-500 uppercase tracking-wide">Fornecedor</th>
      <th className="px-3 md:px-4 py-2 text-left text-[10px] md:text-xs font-semibold text-gray-500 uppercase tracking-wide">Valor</th>
      <th className="px-3 md:px-4 py-2 text-left text-[10px] md:text-xs font-semibold text-gray-500 uppercase tracking-wide">Venc.</th>
      <th className="px-3 md:px-4 py-2 text-left text-[10px] md:text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
      <th className="px-3 md:px-4 py-2 text-left text-[10px] md:text-xs font-semibold text-gray-500 uppercase tracking-wide">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)] text-sm">
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="row-zebra align-top">
                <td className="px-3 md:px-4 py-3 align-top whitespace-normal break-words">
                  <div className="font-semibold text-gray-900 leading-tight text-[12px] md:text-[13px]">{invoice.invoiceNumber}</div>
                  <div className="mt-1"><span className="chip chip-indigo !text-[10px] !px-2 !py-1">{getCategoryName(invoice.category)}</span></div>
                </td>
                <td className="px-3 md:px-4 py-3 align-top whitespace-normal break-words text-[12px] md:text-[13px] text-gray-800">
                  {getSupplierName(invoice.supplierId)}
                </td>
                <td className="px-3 md:px-4 py-3 align-top whitespace-nowrap text-[12px] md:text-[13px] font-semibold text-gray-900">
                  {formatCurrency(invoice.amount)}
                </td>
                <td className="px-3 md:px-4 py-3 align-top text-[12px] md:text-[13px]">
                  <div className={isOverdue(invoice.dueDate) ? 'text-red-600 font-semibold space-y-1' : 'text-gray-700 space-y-1'}>
                    <span className="block leading-tight">{formatDate(invoice.dueDate)}</span>
                    {isOverdue(invoice.dueDate) && (
                      <span className="inline-block chip chip-red !text-[9px] !px-2 !py-0.5">Vencida</span>
                    )}
                  </div>
                </td>
                <td className="px-3 md:px-4 py-3 align-top whitespace-normal">
                  <InvoiceStatusBadge status={invoice.status} className="!px-3 !py-1.5 !text-[10px] block" />
                </td>
                <td className="px-3 md:px-4 py-3 align-top whitespace-nowrap text-[11px]">
                  <button
                    onClick={() => onViewDetails?.(invoice)}
                    className="action-btn !h-7 px-2.5 text-[10px] md:text-[11px]"
                    title="Ver fatura"
                  >
                    Ver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
