"use client";
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { api } from '@/lib/api';

export interface Payment { id:string; invoiceId?:string; amount?:number; method?:string; status?:string; createdAt:string; [k:string]:unknown }

interface PaymentsContextValue {
	payments: Payment[];
	loading: boolean;
	error: string | null;
	refresh: () => Promise<void>;
	create: (data: Partial<Payment>) => Promise<Payment | null>;
}

const PaymentsContext = createContext<PaymentsContextValue | undefined>(undefined);

export const PaymentsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [payments, setPayments] = useState<Payment[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string|null>(null);

	const refresh = useCallback( async () => {
		setLoading(true); setError(null);
		const res = await api<Payment[]>('/api/payments');
		if(!res.ok){ setError(res.error||'Erro'); setLoading(false); return; }
		setPayments(res.data||[]);
		setLoading(false);
	},[]);

	useEffect(()=>{ refresh(); }, [refresh]);

	const create: PaymentsContextValue['create'] = useCallback(async (data) => {
		const res = await api<Payment, typeof data>('/api/payments', { method:'POST', json: data });
		if(!res.ok) return null;
		if(res.data) setPayments(prev => [res.data as Payment, ...prev]);
		return res.data as Payment;
	},[]);

	return (
		<PaymentsContext.Provider value={{ payments, loading, error, refresh, create }}>
			{children}
		</PaymentsContext.Provider>
	);
};

export function usePayments(){
	const ctx = useContext(PaymentsContext);
	if(!ctx) throw new Error('usePayments deve ser usado dentro de PaymentsProvider');
	return ctx;
}

