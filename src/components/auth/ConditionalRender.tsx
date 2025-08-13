"use client";
import React from 'react';

interface ConditionalRenderProps {
	children: React.ReactNode;
	roles?: string[];            // Renderiza se user.role estiver nesta lista
	excludeRoles?: string[];     // Não renderiza se user.role estiver nesta lista
	when?: boolean;              // Condição adicional
	fallback?: React.ReactNode;  // Conteúdo alternativo
}

function getCurrentUser(): { id:string; name:string; email:string; role:string } | null {
	if (typeof window === 'undefined') return null;
	try {
		const raw = localStorage.getItem('authUser');
		if (!raw) return null;
		return JSON.parse(raw);
	} catch { return null; }
}

export function ConditionalRender({ children, roles, excludeRoles, when=true, fallback=null }: ConditionalRenderProps){
	const user = getCurrentUser();
	if(!when) return <>{fallback}</>;
	if(roles && roles.length > 0){
		if(!user || !roles.includes(user.role)) return <>{fallback}</>;
	}
	if(excludeRoles && excludeRoles.length > 0){
		if(user && excludeRoles.includes(user.role)) return <>{fallback}</>;
	}
	return <>{children}</>;
}

