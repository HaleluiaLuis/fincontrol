'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';

// Caminhos públicos (sincronizar com middleware se alterar)
const PUBLIC_PATHS = ['/login'];
const isPublic = (p:string) => PUBLIC_PATHS.includes(p);
import { api } from '@/lib/api';

interface UserSession { id:string; name:string; email:string; role:string; department?:string | null }

interface AuthContextType {
  user: UserSession | null;
  login: (email: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();


  const verify = useCallback(async () => {
    const res = await api<{ id:string; name:string; email:string; role:string; department?:string }>("/api/auth/verify");
    if(res.ok && res.data){ setUser(res.data); }
    setIsLoading(false);
  },[]);

  useEffect(()=>{ verify(); }, [verify]);

  const login: AuthContextType['login'] = async (email) => {
    const res = await api<{ id:string; name:string; email:string; role:string; department?:string }>("/api/auth/login", { method:'POST', json:{ email } });
    if(!res.ok || !res.data) return false;
    setUser(res.data);
    return true;
  };

  const logout: AuthContextType['logout'] = async () => {
    await api('/api/auth/logout', { method:'POST' });
    setUser(null);
  };

  // Redirecionar automaticamente quando não autenticado em rota protegida (após logout via navegação SPA)
  useEffect(()=>{
    if(!isLoading && !user && pathname && !isPublic(pathname)) {
      // Preserva rota para eventual retorno (opcional)
      router.replace('/login?redirect=' + encodeURIComponent(pathname));
    }
  }, [user, isLoading, pathname, router]);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};
