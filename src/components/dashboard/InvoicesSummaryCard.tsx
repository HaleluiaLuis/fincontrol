// Dashboard com cards resumo de faturas (refatorado para novo padrão report-card / accents)
import { formatCurrency } from '@/lib/format';

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
  return (
    <div className="grid gap-5 md:grid-cols-3 mb-8">
      {/* Pendentes */}
      <div className="report-card accent-amber">
        <div className="flex items-start justify-between">
          <div>
            <h4><span>⏳</span> Pendentes</h4>
            <p className="text-[0.66rem] tracking-wide uppercase font-medium mt-1">Quantidade</p>
            <div className="mt-1 text-2xl font-semibold text-strong tabular-nums">{summary.totalPendentes}</div>
            <div className="mt-3"><span className="chip chip-amber">{formatCurrency(summary.valorPendente)}</span></div>
          </div>
        </div>
      </div>
      {/* Aprovadas */}
      <div className="report-card accent-indigo">
        <div className="flex items-start justify-between">
          <div>
            <h4><span>🗂️</span> Aprovadas</h4>
            <p className="text-[0.66rem] tracking-wide uppercase font-medium mt-1">Quantidade</p>
            <div className="mt-1 text-2xl font-semibold text-strong tabular-nums">{summary.totalAprovadas}</div>
            <div className="mt-3"><span className="chip chip-indigo">{formatCurrency(summary.valorAprovado)}</span></div>
          </div>
        </div>
      </div>
      {/* Pagas */}
      <div className="report-card accent-green">
        <div className="flex items-start justify-between">
          <div>
            <h4><span>✅</span> Pagas</h4>
            <p className="text-[0.66rem] tracking-wide uppercase font-medium mt-1">Quantidade</p>
            <div className="mt-1 text-2xl font-semibold text-strong tabular-nums">{summary.totalPagas}</div>
            <div className="mt-3"><span className="chip chip-green">{formatCurrency(summary.valorPago)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

