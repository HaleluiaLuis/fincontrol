"use client";
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { api } from '@/lib/api';
import { requestStatusLabels } from '@/lib/enumMappings';

export interface PaymentRequest { id:string; status:string; statusLabel:string; createdAt:string; invoiceId?:string; requesterId?:string; amount?:number }

interface BackendPaymentRequest { id:string; status:string; createdAt:string; invoiceId?:string; requesterId?:string; amount?:number }

function transform(pr: BackendPaymentRequest): PaymentRequest {
	// status continua armazenado como código original; label separado
	return { ...pr, status: pr.status, statusLabel: requestStatusLabels[pr.status] || pr.status };
}

interface PaymentRequestsContextValue {
	requests: PaymentRequest[];
	loading: boolean;
	error: string | null;
	refresh: () => Promise<void>;
	create: (data: Partial<PaymentRequest>) => Promise<PaymentRequest | null>;
}

const PaymentRequestsContext = createContext<PaymentRequestsContextValue | undefined>(undefined);

export const PaymentRequestsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [requests, setRequests] = useState<PaymentRequest[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string|null>(null);

	const refresh = useCallback(async () => {
		setLoading(true); setError(null);
		const res = await api<BackendPaymentRequest[]>('/api/payment-requests');
		if(!res.ok){ setError(res.error||'Erro'); setLoading(false); return; }
		setRequests((res.data||[]).map(transform));
		setLoading(false);
	},[]);

	useEffect(()=>{ refresh(); }, [refresh]);

	const create: PaymentRequestsContextValue['create'] = useCallback(async (data) => {
		const res = await api<BackendPaymentRequest, typeof data>('/api/payment-requests', { method:'POST', json: data });
		if(!res.ok) return null;
		if(res.data) {
			const transformed = transform(res.data);
			setRequests(prev => [transformed, ...prev]);
			return transformed;
		}
		return null;
	},[]);

	return (
		<PaymentRequestsContext.Provider value={{ requests, loading, error, refresh, create }}>
			{children}
		</PaymentRequestsContext.Provider>
	);
};

export function usePaymentRequests(){
	const ctx = useContext(PaymentRequestsContext);
	if(!ctx) throw new Error('usePaymentRequests deve ser usado dentro de PaymentRequestsProvider');
	return ctx;
}

