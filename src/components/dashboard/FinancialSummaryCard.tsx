// Componente de resumo financeiro responsivo
import { FinancialSummary } from '@/types';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/format';

interface FinancialSummaryCardProps {
  summary: FinancialSummary;
}

export function FinancialSummaryCard({ summary }: FinancialSummaryCardProps) {
  const saldoPositivo = summary.saldo >= 0;
  return (
    <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 mb-6 md:mb-8 auto-rows-fr">
      <Card variant="soft" accent="green" interactive>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium tracking-wider text-green-700 dark:text-green-400 uppercase">Total de Receitas</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-gray-50 tabular-nums">
              {formatCurrency(summary.totalReceitas)}
            </p>
          </div>
          <div className="p-2.5 bg-white/70 dark:bg-gray-800/80 rounded-lg shadow-sm ring-1 ring-black/5 dark:ring-white/10">
            <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m0 0l-4-4m4 4l4-4"/></svg>
          </div>
        </div>
      </Card>
      <Card variant="soft" accent="red" interactive>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium tracking-wider text-red-700 dark:text-red-400 uppercase">Total de Despesas</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-gray-50 tabular-nums">
              {formatCurrency(summary.totalDespesas)}
            </p>
          </div>
          <div className="p-2.5 bg-white/70 dark:bg-gray-800/80 rounded-lg shadow-sm ring-1 ring-black/5 dark:ring-white/10">
            <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18V6m0 0l4 4m-4-4l-4 4"/></svg>
          </div>
        </div>
      </Card>
      <Card variant="soft" accent={saldoPositivo ? 'blue' : 'orange'} interactive>
        <div className="flex items-start justify-between">
          <div>
            <p className={`text-xs font-medium tracking-wider uppercase ${saldoPositivo ? 'text-blue-700 dark:text-blue-400' : 'text-orange-700 dark:text-orange-400'}`}>Saldo Atual</p>
            <p className={`mt-1 text-2xl font-semibold tabular-nums ${saldoPositivo ? 'text-gray-900 dark:text-gray-50' : 'text-gray-900 dark:text-gray-50'}`}>
              {formatCurrency(summary.saldo)}
            </p>
          </div>
            <div className="p-2.5 bg-white/70 dark:bg-gray-800/80 rounded-lg shadow-sm ring-1 ring-black/5 dark:ring-white/10">
            <svg className={`w-5 h-5 ${saldoPositivo ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
          </div>
        </div>
      </Card>
    </div>
  );
}

