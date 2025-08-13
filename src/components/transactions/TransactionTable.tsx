import { Transaction, Category } from '@/types';

interface TransactionTableProps {
  transactions: Transaction[];
  categories: Category[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transactionId: string) => void;
}

export function TransactionTable({ 
  transactions, 
  categories, 
  onEdit, 
  onDelete 
}: TransactionTableProps) {
  const getCategoryName = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.name || 'Sem categoria';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-AO', { 
      style: 'currency', 
      currency: 'AOA' 
    }).format(amount);
  };

  return (
    <div className="surface-elevated overflow-hidden">
      <div className="px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--surface-alt)]">
        <h3 className="text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-100 uppercase">Lista de Transações</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Histórico completo de receitas e despesas</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[var(--border-subtle)]">
          <thead className="bg-[var(--surface-alt)]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descrição
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoria
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="row-zebra">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(transaction.date).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {transaction.description}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="chip chip-indigo">{getCategoryName(transaction.category)}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {transaction.type === 'receita' && <span className="chip chip-green">Receita</span>}
                  {transaction.type === 'despesa' && <span className="chip chip-red">Despesa</span>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <span className="text-sm font-semibold text-strong">
                    {transaction.type === 'receita' ? '+' : '-'} {formatCurrency(transaction.amount)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => onEdit(transaction)} className="action-btn !h-7 px-2.5 text-[11px]">Editar</button>
                    <button onClick={() => onDelete(transaction.id)} className="action-btn !h-7 px-2.5 text-[11px]">Excluir</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {transactions.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-strong mb-1">Nenhuma transação encontrada</h3>
            <p className="text-sm text-gray-500">Comece criando sua primeira transação.</p>
          </div>
        )}
      </div>
    </div>
  );
}
