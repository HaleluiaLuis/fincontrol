// Componente de botão reutilizável
import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success' | 'soft';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  iconLeft?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = 'primary', size = 'md', className, disabled, isLoading, iconLeft, children, ...props },
    ref
  ) => {
    const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
      ghost: 'bg-transparent hover:bg-gray-100 focus:ring-gray-500 dark:hover:bg-gray-800/60',
      success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
      // Variante "soft" para harmonizar com os IconButtons translucidos
      soft: 'bg-gray-950/[0.04] dark:bg-white/5 text-gray-800 dark:text-gray-100 shadow-sm hover:bg-gray-950/10 dark:hover:bg-white/10 focus:ring-blue-500 backdrop-blur-sm border border-gray-950/10 dark:border-white/10',
    };

    const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
      sm: 'h-8 px-3 text-xs rounded-md',
      md: 'h-9 px-4 text-sm rounded-md',
      lg: 'h-11 px-6 text-base rounded-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-colors select-none',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background/0',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {iconLeft && <span className="mr-1.5 inline-flex items-center text-base leading-none">{iconLeft}</span>}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
