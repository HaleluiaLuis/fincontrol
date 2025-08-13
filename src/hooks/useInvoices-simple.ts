"use client";
import { useCallback, useEffect, useState } from 'react';
import type { Invoice } from '@/types';

interface UseInvoicesSimpleOptions { auto?: boolean; limit?: number; }

interface UseInvoicesSimpleResult {
	invoices: Invoice[];
	loading: boolean;
	error: string | null;
	refresh: () => Promise<void>;
	create: (data: Partial<Invoice> & { supplierId:string; description:string; amount:number; issueDate:string; dueDate:string; serviceDate:string; category:string; createdBy:string; }) => Promise<Invoice | null>;
}

export function useInvoicesSimple(options: UseInvoicesSimpleOptions = {}): UseInvoicesSimpleResult {
	const { auto = true, limit } = options;
	const [invoices, setInvoices] = useState<Invoice[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string|null>(null);

	const refresh = useCallback(async () => {
		setLoading(true); setError(null);
		try {
			const res = await fetch('/api/invoices');
			const json = await res.json();
			if(!res.ok) throw new Error(json.error||'Falha ao carregar faturas');
			const data: Invoice[] = json.data;
			setInvoices(limit ? data.slice(0, limit) : data);
		} catch(e:unknown){ setError(e instanceof Error? e.message : 'Erro'); }
		finally { setLoading(false); }
	},[limit]);

	const create: UseInvoicesSimpleResult['create'] = useCallback(async (data) => {
		try {
			const res = await fetch('/api/invoices', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) });
			const json = await res.json();
			if(!res.ok) throw new Error(json.error||'Erro ao criar fatura');
			setInvoices(prev => [json.data, ...prev].slice(0, limit || prev.length+1));
			return json.data as Invoice;
		} catch(e){ console.error(e); return null; }
	},[limit]);

	useEffect(()=>{ if(auto) refresh(); }, [auto, refresh]);

	return { invoices, loading, error, refresh, create };
}

