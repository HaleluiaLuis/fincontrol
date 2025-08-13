export type Role = 'gabinete_contratacao' | 'gabinete_apoio' | 'financas' | 'presidente' | 'admin' | 'user' | 'viewer';

// Prefixos protegidos mapeados para roles permitidas
export const ROLE_REQUIREMENTS: Record<string, Role[]> = {
  '/faturas': ['gabinete_contratacao','gabinete_apoio','financas','presidente','admin'],
  '/fornecedores': ['gabinete_contratacao','gabinete_apoio','admin'],
  '/pagamentos': ['financas','admin'],
  '/solicitacoes': ['gabinete_contratacao','gabinete_apoio','presidente','admin'],
  '/configuracoes': ['admin'],
  '/dashboard': ['gabinete_contratacao','gabinete_apoio','financas','presidente','admin','user','viewer'],
  '/relatorios': ['financas','presidente','admin'],
  '/transacoes': ['financas','admin']
};

export const PROTECTED_PREFIXES = Object.keys(ROLE_REQUIREMENTS);

export function resolvePrefix(pathname: string): string | null {
  for(const pref of PROTECTED_PREFIXES){
    if(pathname === pref || pathname.startsWith(pref + '/')) return pref;
  }
  return null;
}

export function canAccess(role: Role | undefined, pathname: string): boolean {
  const pref = resolvePrefix(pathname);
  if(!pref) return true; // não protegido
  if(!role) return false;
  const allowed = ROLE_REQUIREMENTS[pref];
  return allowed ? allowed.includes(role) : true;
}
