// Componente de resumo financeiro
import { FinancialSummary } from '@/types';
import { Card } from '@/components/ui/Card';

interface FinancialSummaryCardProps {
  summary: FinancialSummary;
}

export function FinancialSummaryCard({ summary }: FinancialSummaryCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <Card className="bg-green-50 border-green-200 overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-medium text-green-600 truncate">Total de Receitas</p>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-800 truncate">
              {formatCurrency(summary.totalReceitas)}
            </p>
          </div>
          <div className="p-2 sm:p-3 bg-green-100 rounded-full flex-shrink-0 ml-2">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        </div>
      </Card>

      <Card className="bg-red-50 border-red-200 overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-medium text-red-600 truncate">Total de Despesas</p>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-red-800 truncate">
              {formatCurrency(summary.totalDespesas)}
            </p>
          </div>
          <div className="p-2 sm:p-3 bg-red-100 rounded-full flex-shrink-0 ml-2">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </div>
        </div>
      </Card>

      <Card className={`overflow-hidden ${summary.saldo >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'}`}>
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <p className={`text-xs sm:text-sm font-medium truncate ${summary.saldo >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
              Saldo Atual
            </p>
            <p className={`text-lg sm:text-xl lg:text-2xl font-bold truncate ${summary.saldo >= 0 ? 'text-blue-800' : 'text-orange-800'}`}>
              {formatCurrency(summary.saldo)}
            </p>
          </div>
          <div className={`p-2 sm:p-3 rounded-full flex-shrink-0 ml-2 ${summary.saldo >= 0 ? 'bg-blue-100' : 'bg-orange-100'}`}>
            <svg 
              className={`w-5 h-5 sm:w-6 sm:h-6 ${summary.saldo >= 0 ? 'text-blue-600' : 'text-orange-600'}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
      </Card>
    </div>
  );
}
