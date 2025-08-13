import { Transaction, Category } from '@/types';
import Link from 'next/link';

interface RecentTransactionsProps {
  transactions: Transaction[];
  categories: Category[];
  limit?: number;
}

// Componente compacto para exibir transações recentes na dashboard
export function RecentTransactions({ transactions, categories, limit = 8 }: RecentTransactionsProps) {
  const items = transactions.slice(0, limit);

  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || 'Sem categoria';

  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(value);

  if (items.length === 0) {
    return (
      <div className="surface p-6 rounded-xl mb-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold tracking-wide text-gray-800 uppercase">Transações Recentes</h2>
            <p className="text-xs text-gray-500 mt-1">Últimas movimentações registradas</p>
          </div>
        </div>
        <div className="text-center py-10 text-sm text-gray-500">Nenhuma transação ainda.</div>
      </div>
    );
  }

  return (
    <div className="surface p-6 rounded-xl mb-10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-gray-800 uppercase">Transações Recentes</h2>
          <p className="text-xs text-gray-500 mt-1">Resumo das últimas {items.length} movimentações</p>
        </div>
        <Link href="/transacoes" className="action-btn !h-8 px-3 text-[11px]">Ver todas</Link>
      </div>
      <ul className="divide-y divide-[var(--border-subtle)]">
        {items.map(tx => {
          const receita = tx.type === 'RECEITA';
          return (
            <li key={tx.id} className="py-3 flex items-center gap-4 text-sm">
              <div className={`w-10 h-10 flex items-center justify-center rounded-lg text-xs font-semibold shrink-0 ${receita ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}> {receita ? '+' : '-'} </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{tx.description}</p>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="chip chip-indigo !text-[11px] !py-0.5">{getCategoryName(tx.categoryId || '')}</span>
                  <span className="text-[11px] text-gray-500">{new Date(tx.date).toLocaleDateString('pt-BR')}</span>
                  {tx.status !== 'CONFIRMADA' && (
                    <span className={`chip !text-[11px] !py-0.5 ${tx.status === 'PENDENTE' ? 'chip-amber' : tx.status === 'CANCELADA' ? 'chip-red' : 'chip-indigo'}`}>{tx.status.toLowerCase()}</span>
                  )}
                </div>
              </div>
              <div className={`text-sm font-semibold tabular-nums text-right ${receita ? 'text-green-600' : 'text-red-600'}`}>
                {receita ? '+' : '-'} {formatCurrency(Number(tx.amount))}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
