"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import type { Transaction } from '@/types';

interface BackendTx { id:string; type:string; description:string; amount:number; date:string; status:string; categoryId?:string; category?:{id:string}; supplierId?:string; }

interface TransactionsContextValue {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  create: (data: Omit<Transaction,'id'|'createdAt'|'updatedAt'>) => Promise<Transaction|null>;
  update: (id:string, data: Partial<Transaction>) => Promise<Transaction|null>;
  remove: (id:string) => Promise<boolean>;
  summary: { totalReceitas:number; totalDespesas:number; saldo:number };
}

const TransactionsContext = createContext<TransactionsContextValue | undefined>(undefined);

function mapTx(t: BackendTx): Transaction {
  return {
    id: t.id,
    type: (t.type.toLowerCase() === 'receita' ? 'receita':'despesa') as Transaction['type'],
    description: t.description,
    amount: Number(t.amount),
    category: t.categoryId || t.category?.id || '',
    date: t.date,
    status: (t.status.toLowerCase() === 'confirmada' ? 'confirmada' : t.status.toLowerCase() === 'cancelada'? 'cancelada':'pendente') as Transaction['status'],
    createdAt: t.date,
    updatedAt: t.date
  };
}

export const TransactionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);

  const refresh = useCallback(async () => {
    setLoading(true); setError(null);
    const res = await api<BackendTx[]>('/api/transactions');
    if(!res.ok){ setError(res.error||'Erro'); setLoading(false); return; }
    setTransactions((res.data||[]).map(mapTx));
    setLoading(false);
  },[]);

  useEffect(()=>{ refresh(); }, [refresh]);

  const create: TransactionsContextValue['create'] = useCallback(async (data) => {
    const payload = {
      type: data.type.toUpperCase(),
      description: data.description,
      amount: data.amount,
      categoryId: data.category,
      date: data.date,
      status: data.status.toUpperCase(),
    };
    const res = await api<BackendTx, typeof payload>('/api/transactions', { method:'POST', json: payload });
    if(!res.ok || !res.data) return null;
    const mapped = mapTx(res.data);
    setTransactions(prev => [mapped, ...prev]);
    return mapped;
  },[]);

  const update: TransactionsContextValue['update'] = useCallback(async (id, data) => {
  const payload: { [k:string]: unknown; type?: string; status?: string; category?: string; categoryId?: string } = { ...data };
  if(typeof payload.type === 'string') payload.type = payload.type.toUpperCase();
  if(typeof payload.status === 'string') payload.status = payload.status.toUpperCase();
  if(typeof payload.category === 'string') { payload.categoryId = payload.category; delete payload.category; }
    const res = await api<BackendTx, typeof payload>(`/api/transactions/${id}`, { method:'PATCH', json: payload });
    if(!res.ok || !res.data) return null;
    const mapped = mapTx(res.data);
    setTransactions(prev => prev.map(t=> t.id===id? mapped : t));
    return mapped;
  },[]);

  const remove: TransactionsContextValue['remove'] = useCallback(async (id) => {
    const res = await api(`/api/transactions/${id}`, { method:'DELETE' });
    if(!res.ok) return false;
    setTransactions(prev => prev.filter(t=>t.id!==id));
    return true;
  },[]);

  const summary = transactions.reduce((acc,t)=>{ if(t.type==='receita') acc.totalReceitas+=t.amount; else acc.totalDespesas+=t.amount; acc.saldo = acc.totalReceitas - acc.totalDespesas; return acc; }, { totalReceitas:0,totalDespesas:0,saldo:0 });

  return (
    <TransactionsContext.Provider value={{ transactions, loading, error, refresh, create, update, remove, summary }}>
      {children}
    </TransactionsContext.Provider>
  );
};

export function useTransactions(){
  const ctx = useContext(TransactionsContext);
  if(!ctx) throw new Error('useTransactions deve ser usado dentro de TransactionsProvider');
  return ctx;
}
