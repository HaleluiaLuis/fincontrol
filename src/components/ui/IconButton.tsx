"use client";
import { ReactNode } from 'react';

interface IconButtonProps {
  ariaLabel: string;
  children: ReactNode;
  onClick?: () => void;
  tooltip?: string;
  active?: boolean;
  size?: 'sm' | 'md';
}

export function IconButton({ ariaLabel, children, onClick, tooltip, active = false, size = 'md' }: IconButtonProps) {
  const dim = size === 'sm' ? 'w-8 h-8' : 'w-9 h-9';
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className={`group relative inline-flex items-center justify-center ${dim} rounded-md ring-1 ring-inset transition-colors
      bg-white/55 dark:bg-gray-800/55 ring-gray-300/50 dark:ring-gray-700/60
      hover:bg-white/80 dark:hover:bg-gray-700/70 hover:ring-gray-400/70 dark:hover:ring-gray-600/70
      text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white
      focus:outline-none focus:ring-2 focus:ring-blue-500/40
      ${active ? 'shadow-inner shadow-black/10 dark:shadow-black/40' : ''}`}
      data-active={active || undefined}
    >
      <span className="pointer-events-none flex items-center justify-center text-current">
        {children}
      </span>
      {tooltip && (
        <span className="absolute z-10 left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 rounded bg-gray-900/90 text-[11px] text-gray-200 whitespace-nowrap opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition shadow-lg ring-1 ring-black/40">
          {tooltip}
        </span>
      )}
    </button>
  );
}

export default IconButton;
