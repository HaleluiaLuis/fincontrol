// Dashboard com cards de resumo das faturas
import { Card } from '@/components/ui/Card';

interface InvoicesSummaryCardProps {
  summary: {
    totalPendentes: number;
    totalAprovadas: number;
    totalPagas: number;
    valorPendente: number;
    valorAprovado: number;
    valorPago: number;
  };
}

export function InvoicesSummaryCard({ summary }: InvoicesSummaryCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
      {/* Faturas Pendentes */}
      <Card className="bg-yellow-50 border-yellow-200 overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-medium text-yellow-600 truncate">Faturas Pendentes</p>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-800">
              {summary.totalPendentes}
            </p>
            <p className="text-xs sm:text-sm text-yellow-700 mt-1 truncate">
              {formatCurrency(summary.valorPendente)}
            </p>
          </div>
          <div className="p-2 sm:p-3 bg-yellow-100 rounded-full flex-shrink-0 ml-2">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </Card>

      {/* Faturas Aprovadas */}
      <Card className="bg-blue-50 border-blue-200 overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-medium text-blue-600 truncate">Faturas Aprovadas</p>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-800">
              {summary.totalAprovadas}
            </p>
            <p className="text-xs sm:text-sm text-blue-700 mt-1 truncate">
              {formatCurrency(summary.valorAprovado)}
            </p>
          </div>
          <div className="p-2 sm:p-3 bg-blue-100 rounded-full flex-shrink-0 ml-2">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </Card>

      {/* Faturas Pagas */}
      <Card className="bg-green-50 border-green-200 overflow-hidden sm:col-span-2 lg:col-span-1">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-medium text-green-600 truncate">Faturas Pagas</p>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-800">
              {summary.totalPagas}
            </p>
            <p className="text-xs sm:text-sm text-green-700 mt-1 truncate">
              {formatCurrency(summary.valorPago)}
            </p>
          </div>
          <div className="p-2 sm:p-3 bg-green-100 rounded-full flex-shrink-0 ml-2">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      </Card>
    </div>
  );
}
