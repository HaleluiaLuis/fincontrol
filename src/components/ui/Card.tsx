// Componente de Card reutilizável
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'soft' | 'tonal';
  accent?: 'blue' | 'green' | 'red' | 'yellow' | 'indigo' | 'gray' | 'orange';
  interactive?: boolean;
}

const accentMap: Record<string, string> = {
  blue: 'from-blue-500/20 to-blue-400/5 border-blue-500/30',
  green: 'from-green-500/20 to-green-400/5 border-green-500/30',
  red: 'from-red-500/20 to-red-400/5 border-red-500/30',
  yellow: 'from-yellow-500/25 to-yellow-400/5 border-yellow-500/30',
  indigo: 'from-indigo-500/20 to-indigo-400/5 border-indigo-500/30',
  gray: 'from-gray-500/15 to-gray-400/5 border-gray-600/30',
  orange: 'from-orange-500/20 to-orange-400/5 border-orange-500/30'
};

export function Card({
  children,
  className = '',
  title,
  description,
  variant = 'default',
  accent = 'gray',
  interactive = false
}: CardProps) {
  const base = 'rounded-xl border p-5 md:p-6 transition-shadow relative';
  const palette = variant === 'default'
    ? 'bg-white border-gray-200 dark:bg-gray-900/80 dark:border-gray-800'
    : variant === 'soft'
      ? `bg-gradient-to-br ${accentMap[accent]} border dark:bg-gray-900/60 backdrop-blur-sm`
      : `bg-gray-50/80 dark:bg-gray-900/60 border-gray-200/60 dark:border-gray-800/60 backdrop-blur-sm`;
  const hover = interactive ? 'hover:shadow-lg hover:border-gray-300/80 dark:hover:border-gray-700/80' : '';

  return (
    <div className={`${base} ${palette} ${hover} ${className}`}>
      {(title || description) && (
        <div className="mb-4">
          {title && <h3 className="text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-100 uppercase">{title}</h3>}
          {description && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{description}</p>}
        </div>
      )}
      {children}
    </div>
  );
}

