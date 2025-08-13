// Sistema simples de permissões baseado em papéis (role-based) com possibilidade de expandir para regras específicas

export type Permission =
	| 'invoice.view' | 'invoice.create' | 'invoice.approve' | 'invoice.reject'
	| 'payment.view' | 'payment.create' | 'payment.process'
	| 'request.view' | 'request.create' | 'request.approve' | 'request.reject'
	| 'supplier.view' | 'supplier.create' | 'supplier.update'
	| 'report.view'
	| 'admin.manage_users';

// Mapeamento de roles para permissões (MVP; alinhar com enum UserRole do Prisma posteriormente)
const rolePermissions: Record<string, Permission[]> = {
	admin: ['invoice.view','invoice.create','invoice.approve','invoice.reject','payment.view','payment.create','payment.process','request.view','request.create','request.approve','request.reject','supplier.view','supplier.create','supplier.update','report.view','admin.manage_users'],
	gabinete_contratacao: ['invoice.view','invoice.create','request.view','request.create','request.approve','request.reject','supplier.view','report.view'],
	presidente: ['invoice.view','invoice.approve','invoice.reject','request.view','request.approve','request.reject','report.view'],
	gabinete_apoio: ['invoice.view','invoice.create','payment.view','request.view','report.view'],
	financas: ['invoice.view','payment.view','payment.process','report.view'],
	user: ['invoice.view','request.view','supplier.view','report.view'],
	viewer: ['report.view']
};

export function getPermissionsForRole(role?: string): Permission[] { return role? rolePermissions[role] || [] : []; }
export function can(role: string | undefined, permission: Permission): boolean { return getPermissionsForRole(role).includes(permission); }
export function any(role: string | undefined, permissions: Permission[]): boolean { return permissions.some(p=>can(role,p)); }
export function all(role: string | undefined, permissions: Permission[]): boolean { return permissions.every(p=>can(role,p)); }

export interface PermissionCheck {
	can: (perm: Permission) => boolean;
	any: (...perms: Permission[]) => boolean;
	all: (...perms: Permission[]) => boolean;
	list: Permission[];
}

export function buildPermissionChecker(role?: string): PermissionCheck {
	return {
		can: (perm) => can(role, perm),
		any: (...perms) => perms.some(p=>can(role,p)),
		all: (...perms) => perms.every(p=>can(role,p)),
		list: getPermissionsForRole(role)
	};
}

