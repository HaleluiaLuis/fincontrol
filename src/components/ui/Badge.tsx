import React from 'react';

// Componente genérico de Badge/Chip alinhado às classes utilitárias definidas em globals.css
// Uso: <Badge variant="green">Pago</Badge>
//      <Badge variant="amber" icon="⚠">Pendente</Badge>
//      <Badge as="button" onClick={...} variant="red" size="sm">Remover</Badge>

type BadgeVariant = 'blue' | 'green' | 'amber' | 'red' | 'indigo';
type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends React.HTMLAttributes<HTMLElement> {
	children: React.ReactNode;
	variant?: BadgeVariant;
	size?: BadgeSize;
	icon?: React.ReactNode;           // Ícone opcional (emoji ou componente)
	as?: 'span' | 'div' | 'button' | 'a';
	interactive?: boolean;            // Adiciona estilos de foco/hover para interações
}

const variantClass: Record<BadgeVariant, string> = {
	blue: 'chip-blue',
	green: 'chip-green',
	amber: 'chip-amber',
	red: 'chip-red',
	indigo: 'chip-indigo'
};

const sizeClass: Record<BadgeSize, string> = {
	sm: 'text-[10px] px-2 py-1',
	md: '' // já definido no .chip
};

export const Badge: React.FC<BadgeProps> = ({
	children,
	variant = 'indigo',
	size = 'md',
	icon,
	as = 'span',
	interactive = false,
	className = '',
	...rest
}) => {
	const Component: keyof JSX.IntrinsicElements = as;
	const base = 'chip';
	const variantCls = variantClass[variant];
	const sizeCls = sizeClass[size];
	const interactiveCls = interactive ? 'cursor-pointer hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500/50 transition' : '';
	return (
		<Component
			className={`${base} ${variantCls} ${sizeCls} ${interactiveCls} ${className}`.trim()}
			role={as === 'button' ? undefined : 'status'}
			{...rest}
		>
			{icon && <span className="text-xs leading-none">{icon}</span>}
			{children}
		</Component>
	);
};

export default Badge;

