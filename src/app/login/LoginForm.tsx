"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const SEED_EMAILS = [
	'admin@ispobie.ao',
	'contratacao@ispobie.ao',
	'presidente@ispobie.ao',
	'apoio@ispobie.ao',
	'financas@ispobie.ao',
	'viewer@ispobie.ao'
];

export function LoginForm(){
	const router = useRouter();
	const { login, isLoading: authLoading, user } = useAuth();
	const params = useSearchParams();
	const [email, setEmail] = useState('');
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string|null>(null);
	const [autoRedirected, setAutoRedirected] = useState(false);

	// Se já autenticado, redireciona imediatamente (evita piscar tela login)
	useEffect(()=>{
		if(user && !autoRedirected){
			const redirect = params.get('redirect');
			router.replace(redirect && redirect.startsWith('/') ? redirect : '/dashboard');
			setAutoRedirected(true);
		}
	},[user, params, router, autoRedirected]);

	// Prefill padrão
	useEffect(()=>{ if(!email) setEmail('admin@ispobie.ao'); }, [email]);

	const doLogin = useCallback(async () => {
		if(!email) { setError('Informe o email'); return; }
		setError(null); setSubmitting(true);
		try {
			const ok = await login(email.trim().toLowerCase());
			if(!ok) throw new Error('Email não autorizado ou sessão inválida');
			const redirect = params.get('redirect');
			router.replace(redirect && redirect.startsWith('/') ? redirect : '/dashboard');
		} catch(e: unknown){
			setError(e instanceof Error ? e.message : 'Erro inesperado');
		} finally { setSubmitting(false); }
	},[email, login, params, router]);

	async function handleSubmit(e: React.FormEvent){
		e.preventDefault();
		await doLogin();
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-6" noValidate>
			<div className="space-y-2">
				<h2 className="text-xl font-semibold tracking-tight">Acesso Seguro</h2>
				<p className="text-sm text-text-soft">Insira o email institucional para iniciar a sessão.</p>
			</div>
			<div className="space-y-5 surface-elevated p-6 rounded-xl border border-surface-outline/40">
				<div className="flex flex-col gap-1">
					<label htmlFor="email" className="text-[11px] font-medium uppercase tracking-wide text-text-soft">Email Institucional</label>
					<input
						id="email"
						type="email"
						autoComplete="username"
						className="field"
						placeholder="admin@ispobie.ao"
						value={email}
						onChange={e=>setEmail(e.target.value)}
						required
						disabled={submitting || authLoading}
						autoFocus
					/>
				</div>
				<div className="space-y-2">
					<p className="text-[11px] font-medium uppercase tracking-wide text-text-soft">Selecione rápido</p>
					<div className="flex flex-wrap gap-2">
						{SEED_EMAILS.map(se => (
							<button
								key={se}
								type="button"
								onClick={()=>setEmail(se)}
								className={`chip !text-[10px] ${email===se? 'chip-indigo' : 'chip-gray'}`}
								disabled={submitting}
							>{se.split('@')[0]}</button>
						))}
					</div>
				</div>
				{error && <div className="chip chip-red !py-2 !px-3 text-xs" role="alert">{error}</div>}
				<button
					type="submit"
					disabled={submitting || authLoading}
					className="action-btn w-full !h-11 text-sm font-semibold tracking-wide"
				>
					{(submitting || authLoading) ? 'Validando...' : 'Entrar'}
				</button>
				<p className="text-[10px] text-text-soft/70 leading-relaxed">MVP sem senha. A sessão é criada no servidor (cookie httpOnly). Use qualquer um dos perfis de teste.</p>
			</div>
			<p className="text-[10px] text-text-soft/60 leading-relaxed">Problemas para entrar? Verifique se os seeds foram executados (prisma/seed.ts) e se o cookie não está bloqueado pelo navegador.</p>
		</form>
	);
}

