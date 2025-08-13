"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
	children: React.ReactNode;
	roles?: string[];      // Permite somente estes roles (se definido)
	redirectTo?: string;   // Caminho para redirecionar se não autorizado
	loadingFallback?: React.ReactNode;
	unauthorizedFallback?: React.ReactNode;
}

interface AuthUser { id:string; name:string; email:string; role:string }

function readUser(): AuthUser | null {
	if (typeof window === 'undefined') return null;
	try {
		const raw = localStorage.getItem('authUser');
		if(!raw) return null;
		return JSON.parse(raw) as AuthUser;
	} catch { return null; }
}

export function ProtectedRoute({ children, roles, redirectTo='/login', loadingFallback=null, unauthorizedFallback=null }: ProtectedRouteProps){
	const router = useRouter();
	const [user, setUser] = useState<AuthUser | null>(null);
	const [ready, setReady] = useState(false);

	useEffect(()=>{
		const u = readUser();
		setUser(u);
		setReady(true);
	},[]);

	// Carregando estado do cliente
	if(!ready) return <>{loadingFallback || <div className="p-6 text-sm text-text-soft">A verificar sessão...</div>}</>;

	// Não autenticado
	if(!user){
		router.push(redirectTo);
		return null;
	}

	// Restrição de roles
	if(roles && roles.length>0 && !roles.includes(user.role)){
		return <>{unauthorizedFallback || <div className="p-6 text-sm text-red-600">Acesso negado</div>}</>;
	}

	return <>{children}</>;
}

