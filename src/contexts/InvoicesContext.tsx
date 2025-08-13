"use client";
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { Invoice } from '@/types';
import { api } from '@/lib/api';

// Mapeamentos temporários entre enums Prisma (maíusculas) e tipos frontend (minúsculas)
const statusMap: Record<string, Invoice['status']> = {
	PENDENTE: 'pendente_contratacao',
	EM_VALIDACAO: 'pendente_contratacao',
	PENDENTE_PRESIDENTE: 'pendente_presidente',
	AUTORIZADA: 'aprovada_registro',
	REGISTRADA: 'registrada',
	PENDENTE_PAGAMENTO: 'pendente_pagamento',
	PAGA: 'paga',
	CANCELADA: 'cancelada',
	REJEITADA: 'rejeitada'
};

const stepMap: Record<string, Invoice['currentStep']> = {
	GABINETE_CONTRATACAO: 'gabinete_contratacao',
	PRESIDENTE: 'presidente',
	GABINETE_APOIO: 'gabinete_apoio',
	FINANCAS: 'financas',
	CONCLUIDO: 'concluido'
};

interface BackendInvoice {
	id: string;
	invoiceNumber: string;
	supplierId: string;
	categoryId?: string;
	description: string;
	amount: string | number;
	issueDate: string;
	dueDate: string;
	serviceDate: string;
	attachments?: unknown;
	status: string;
	currentStep: string;
	createdAt: string;
	updatedAt: string;
	registeredById?: string;
	category?: { id: string };
}

interface EnrichedInvoice extends Invoice { statusLabel:string; stepLabel:string }

interface InvoiceHistoryEntryApproval {
	type: 'approval';
	id: string;
	step: string;
	action: string;
	comments?: string | null;
	at: string;
	user: { id:string; name:string; email?:string; role?:string };
}
interface InvoiceHistoryEntryLog {
	type: 'log';
	id: string;
	action: string;
	metadata: unknown;
	at: string;
	user: { id:string; name:string; email?:string; role?:string } | null;
}
type InvoiceHistoryEntry = InvoiceHistoryEntryApproval | InvoiceHistoryEntryLog;

interface RawApproval { id:string; step:string; action:string; comments?:string|null; timestamp:string; user:{ id:string; name:string; role?:string } }
interface RawLog { id:string; action:string; metadata:unknown; createdAt:string; user?:{ id:string; name:string; email?:string; role?:string } }

function humanize(value:string){
	return value.replace(/_/g,' ').toLowerCase().replace(/\b\w/g,c=>c.toUpperCase());
}

function transform(apiInvoice: BackendInvoice): EnrichedInvoice {
	const status = statusMap[apiInvoice.status] || 'pendente_contratacao';
	const step = stepMap[apiInvoice.currentStep] || 'gabinete_contratacao';
	return {
		id: apiInvoice.id,
		invoiceNumber: apiInvoice.invoiceNumber,
		supplierId: apiInvoice.supplierId,
		description: apiInvoice.description,
		amount: Number(apiInvoice.amount),
		issueDate: apiInvoice.issueDate,
		dueDate: apiInvoice.dueDate,
		serviceDate: apiInvoice.serviceDate,
		category: apiInvoice.categoryId || apiInvoice.category?.id || '',
		attachments: Array.isArray(apiInvoice.attachments) ? apiInvoice.attachments : [],
		status,
		currentStep: step,
		approvalHistory: [],
		createdAt: apiInvoice.createdAt,
		updatedAt: apiInvoice.updatedAt,
		createdBy: apiInvoice.registeredById || '',
		statusLabel: humanize(status),
		stepLabel: humanize(step)
	};
}

interface InvoicesContextValue {
	invoices: EnrichedInvoice[];
	loading: boolean;
	error: string | null;
	refresh: () => Promise<void>;
	create: (data: Partial<Invoice> & { supplierId:string; description:string; amount:number; issueDate:string; dueDate:string; serviceDate:string; category:string; createdBy:string; }) => Promise<EnrichedInvoice | null>;
	approving: boolean;
	approve: (id:string, user:{ id:string; name:string }) => Promise<EnrichedInvoice | null>;
	reject: (id:string, user:{ id:string; name:string }, comments:string) => Promise<EnrichedInvoice | null>;
		histories: Record<string, { approvals:RawApproval[]; logs:RawLog[]; timeline: InvoiceHistoryEntry[] }|undefined>;
	loadingHistory: Record<string, boolean>;
	loadHistory: (invoiceId: string) => Promise<InvoiceHistoryEntry[] | null>;
}

const InvoicesContext = createContext<InvoicesContextValue | undefined>(undefined);

export const InvoicesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [invoices, setInvoices] = useState<EnrichedInvoice[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string|null>(null);
	const [approving, setApproving] = useState(false);
		const [histories, setHistories] = useState<InvoicesContextValue['histories']>({});
	const [loadingHistory, setLoadingHistory] = useState<Record<string, boolean>>({});

	const refresh = useCallback(async () => {
		setLoading(true); setError(null);
		const res = await api<BackendInvoice[]>('/api/invoices');
		if(!res.ok){ setError(res.error||'Erro'); setLoading(false); return; }
		setInvoices((res.data||[]).map(transform));
		setLoading(false);
	},[]);

	useEffect(()=>{ refresh(); }, [refresh]);

	const create: InvoicesContextValue['create'] = useCallback(async (data) => {
		// Montar payload conforme rota backend espera
		const payload = {
			supplierId: data.supplierId,
			categoryId: data.category,
			description: data.description,
			amount: data.amount,
			issueDate: data.issueDate,
			serviceDate: data.serviceDate,
			dueDate: data.dueDate,
			registeredById: data.createdBy,
		};
		const res = await api<BackendInvoice, typeof payload>('/api/invoices', { method:'POST', json: payload });
		if(!res.ok){ return null; }
		if(res.data) {
			const inv = transform(res.data);
			setInvoices(prev => [inv, ...prev]);
			return inv;
		}
		return null;
	},[]);

	const approve: InvoicesContextValue['approve'] = useCallback(async (id, user) => {
		setApproving(true);
		const res = await api<BackendInvoice>('/api/approvals', { method:'POST', json:{ action:'aprovado', invoiceId:id, userId:user.id } });
		setApproving(false);
		if(!res.ok || !res.data) return null;
		const inv = transform(res.data);
		setInvoices(prev => prev.map(i => i.id===id? inv : i));
		// Invalida histórico em cache para forçar refresh (aprovação gera novo passo)
		setHistories(h => ({ ...h, [id]: undefined }));
		return inv;
	},[]);

	const reject: InvoicesContextValue['reject'] = useCallback(async (id, user, comments) => {
		setApproving(true);
		const res = await api<BackendInvoice>('/api/approvals', { method:'POST', json:{ action:'rejeitado', invoiceId:id, userId:user.id, comments } });
		setApproving(false);
		if(!res.ok || !res.data) return null;
		const inv = transform(res.data);
		setInvoices(prev => prev.map(i => i.id===id? inv : i));
		setHistories(h => ({ ...h, [id]: undefined }));
		return inv;
	},[]);

	const loadHistory: InvoicesContextValue['loadHistory'] = useCallback(async (invoiceId: string) => {
		if(histories[invoiceId]) return histories[invoiceId]!.timeline;
		setLoadingHistory(s=>({ ...s, [invoiceId]: true }));
		const res = await api<{ approvals:RawApproval[]; logs:RawLog[]; timeline: InvoiceHistoryEntry[] }>(`/api/invoices/${invoiceId}/history`);
		setLoadingHistory(s=>({ ...s, [invoiceId]: false }));
		if(!res.ok || !res.data) return null;
		setHistories(h=> ({ ...h, [invoiceId]: res.data }));
		return res.data.timeline;
	},[histories]);

	return (
		<InvoicesContext.Provider value={{ invoices, loading, error, refresh, create, approving, approve, reject, histories, loadingHistory, loadHistory }}>
			{children}
		</InvoicesContext.Provider>
	);
};

export function useInvoices(){
	const ctx = useContext(InvoicesContext);
	if(!ctx) throw new Error('useInvoices deve ser usado dentro de InvoicesProvider');
	return ctx;
}

