import { ReactNode } from 'react';
import { Card } from '@/components/ui/Card';
import { formatCurrency, formatPercent } from '@/lib/format';

interface KpiCardProps {
  label: string;
  value: number;
  currency?: boolean;
  change?: number; // percentual (-1 = -100%, 0.12 = +12%)
  icon?: ReactNode;
  accent?: 'blue' | 'green' | 'red' | 'yellow' | 'indigo' | 'gray' | 'orange';
  compact?: boolean; // força layout mais denso
}

export function KpiCard({ label, value, currency = false, change, icon, accent = 'blue', compact = false }: KpiCardProps) {
  const positive = (change || 0) > 0;
  const negative = (change || 0) < 0;
  return (
    <Card
      variant="soft"
      accent={accent}
      interactive
      className={`overflow-hidden group h-full ${compact ? 'py-3' : ''}`}
    >
      <div className="flex items-start gap-4">
        {icon && (
          <div className="w-10 h-10 shrink-0 rounded-lg bg-white/70 dark:bg-gray-800/80 flex items-center justify-center shadow-sm ring-1 ring-black/5 dark:ring-white/5 text-gray-700 dark:text-gray-200 group-hover:scale-105 transition-transform">
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-medium tracking-wider text-gray-500 dark:text-gray-400 uppercase line-clamp-1">{label}</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className={`font-semibold tabular-nums text-gray-900 dark:text-gray-50 ${compact ? 'text-lg' : 'text-xl'}`}>
              {currency ? formatCurrency(value) : value.toLocaleString('pt-AO')}
            </span>
            {change !== undefined && (
              <span
                className={`text-xs font-medium px-1.5 py-0.5 rounded-md ring-1 ring-inset tabular-nums whitespace-nowrap ${
                  positive
                    ? 'bg-green-500/10 text-green-600 ring-green-500/30 dark:text-green-400'
                    : negative
                      ? 'bg-red-500/10 text-red-600 ring-red-500/30 dark:text-red-400'
                      : 'bg-gray-500/10 text-gray-600 ring-gray-500/30 dark:text-gray-400'
                }`}
              >
                {formatPercent(change, { sign: true })}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
