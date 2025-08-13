"use client";
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';
import type { Category } from '@/types';

type BackendCategory = { id:string; name:string; type:'RECEITA'|'DESPESA'|string; color?:string; description?:string };

interface CategoriesContextValue {
  categories: Category[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const CategoriesContext = createContext<CategoriesContextValue | undefined>(undefined);

export const CategoriesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);

  const refresh = useCallback(async () => {
    setLoading(true); setError(null);
    const res = await api<BackendCategory[]>('/api/categories');
    if(!res.ok){ setError(res.error||'Erro'); setLoading(false); return; }
    const mapped: Category[] = (res.data||[]).map(c => ({
      id: c.id,
      name: c.name,
      type: (c.type === 'RECEITA' ? 'receita' : c.type === 'DESPESA' ? 'despesa' : String(c.type).toLowerCase()) as Category['type'],
      color: c.color || '#6366f1',
      description: c.description
    }));
    setCategories(mapped);
    setLoading(false);
  },[]);

  useEffect(()=>{ refresh(); }, [refresh]);

  return (
    <CategoriesContext.Provider value={{ categories, loading, error, refresh }}>
      {children}
    </CategoriesContext.Provider>
  );
};

export function useCategories(){
  const ctx = useContext(CategoriesContext);
  if(!ctx) throw new Error('useCategories deve ser usado dentro de CategoriesProvider');
  return ctx;
}
