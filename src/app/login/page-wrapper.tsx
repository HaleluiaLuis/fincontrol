import React from 'react';

interface LoginPageWrapperProps { children: React.ReactNode }

export function LoginPageWrapper({ children }: LoginPageWrapperProps){
	return (
		<div className="min-h-screen flex">
			<div className="hidden lg:flex flex-col justify-between w-1/2 p-12 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white relative overflow-hidden">
				<div className="absolute inset-0 opacity-10 pointer-events-none" style={{backgroundImage:'radial-gradient(circle at 25% 25%, #fff 2%, transparent 60%)'}} />
				<header className="relative z-10">
					<h1 className="text-3xl font-bold tracking-tight">FinControl</h1>
					<p className="mt-2 text-indigo-100 max-w-md text-sm leading-relaxed">Gestão integrada de faturas, fluxos de aprovação e relatórios financeiros para o Instituto Superior Politécnico do Bié.</p>
				</header>
				<footer className="relative z-10 text-xs text-indigo-200">
					© {new Date().getFullYear()} FinControl • MVP
				</footer>
			</div>
			<div className="flex-1 flex items-center justify-center p-6 md:p-10 bg-[var(--surface)]">
				<div className="w-full max-w-sm">{children}</div>
			</div>
		</div>
	);
}

