// Utilidades básicas de autenticação mock + extensível a Prisma
import { cookies } from 'next/headers';

export interface AuthUser {
	id: string;
	name: string;
	email: string;
	role: string; // manter flexível (string) para mapear com enum Prisma posteriormente
}

const COOKIE_KEY = 'fc_session';

export function getAuthUser(): AuthUser | null {
	// MVP: user em cookie JSON; em produção usar JWT ou sessão server-side
			try {
				const jarUnknown = cookies() as unknown;
				let raw: string | undefined;
				if(jarUnknown && typeof (jarUnknown as { get?: (k:string)=>{ value?:string } }).get === 'function') {
					raw = (jarUnknown as { get: (k:string)=>{ value?:string } }).get(COOKIE_KEY)?.value;
				}
				if(!raw) return null;
				return JSON.parse(raw) as AuthUser;
			} catch { return null; }
}

export function isAuthenticated(): boolean { return !!getAuthUser(); }

export function hasRole(role: string | string[]): boolean {
	const user = getAuthUser();
	if(!user) return false;
	const roles = Array.isArray(role)? role : [role];
	return roles.includes(user.role);
}

export interface RequireAuthOptions { roles?: string[]; }

export function requireAuth(opts: RequireAuthOptions = {}): AuthUser {
	const user = getAuthUser();
	if(!user) throw new Error('Não autenticado');
	if(opts.roles && opts.roles.length>0 && !opts.roles.includes(user.role)) throw new Error('Não autorizado');
	return user;
}

