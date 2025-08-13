"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface AuthUser { id:string; name:string; email:string; role:string }

export function UserMenu(){
	const router = useRouter();
	const [user, setUser] = useState<AuthUser | null>(null);
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement | null>(null);

	useEffect(()=>{
		try {
			const raw = localStorage.getItem('authUser');
			if(raw) setUser(JSON.parse(raw));
		} catch {/* noop */}
	},[]);

	useEffect(()=>{
		function handle(e: MouseEvent){
			if(ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
		}
		if(open) window.addEventListener('mousedown', handle);
		return ()=> window.removeEventListener('mousedown', handle);
	},[open]);

	async function logout(){
		try { await fetch('/api/auth/logout', { method:'POST' }); } catch {/* ignore */}
		localStorage.removeItem('authUser');
		router.push('/login');
	}

	if(!user){
		return (
			<button onClick={()=>router.push('/login')} className="action-btn !h-8 px-3 text-[11px]">Login</button>
		);
	}

	const initials = user.name.split(' ').map(p=>p[0]).slice(0,2).join('').toUpperCase();

	return (
		<div className="relative" ref={ref}>
			<button onClick={()=>setOpen(o=>!o)} className="flex items-center gap-2 px-3 h-9 rounded-md bg-surface-alt border border-surface-outline/40 hover:border-surface-outline/70 text-sm font-medium">
				<span className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-semibold">{initials}</span>
				<span className="hidden md:inline-block max-w-[120px] truncate text-text-soft/90">{user.name}</span>
				<svg className={`w-3 h-3 text-text-soft/70 transition ${open?'rotate-180':''}`} viewBox="0 0 20 20" fill="currentColor"><path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"/></svg>
			</button>
			{open && (
				<div className="absolute right-0 mt-2 w-60 surface-elevated border border-surface-outline/40 rounded-md shadow-lg p-3 z-50">
					<div className="flex items-center gap-3 pb-3 mb-3 border-b border-surface-outline/30">
						<div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-semibold">{initials}</div>
						<div className="min-w-0">
							<p className="text-sm font-medium leading-tight truncate">{user.name}</p>
							<p className="text-[11px] text-text-soft/70 truncate">{user.email}</p>
						</div>
					</div>
					<div className="flex flex-wrap gap-1 mb-3">
						<span className="chip chip-indigo !text-[10px]">{user.role}</span>
					</div>
					<ul className="space-y-1 text-sm">
						<li><button onClick={()=>router.push('/configuracoes')} className="w-full text-left px-2 py-1 rounded hover:bg-surface-alt">Configurações</button></li>
						<li><button onClick={()=>router.push('/faturas')} className="w-full text-left px-2 py-1 rounded hover:bg-surface-alt">Faturas</button></li>
					</ul>
					<div className="pt-3 mt-3 border-t border-surface-outline/30">
						<button onClick={logout} className="action-btn w-full !h-8 text-[11px]">Terminar Sessão</button>
					</div>
				</div>
			)}
		</div>
	);
}

