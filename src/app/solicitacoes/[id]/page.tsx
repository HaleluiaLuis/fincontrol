import React from 'react';
import { notFound } from 'next/navigation';

interface PaymentRequest { id:string; status:string; createdAt:string; invoiceId?:string; requesterId?:string; amount?:number }

async function fetchRequest(id:string): Promise<PaymentRequest | null>{
	const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/payment-requests`, { cache:'no-store' });
	if(!res.ok) return null;
	const data = await res.json();
	const arr = data.data as PaymentRequest[];
	return arr.find(r=>r.id===id) || null;
}

export default async function SolicitacaoDetalhePage({ params }: { params: Promise<{ id:string }> }){
	const { id } = await params;
	const req = await fetchRequest(id);
	if(!req) return notFound();
	return (
		<div className="max-w-3xl mx-auto py-10 space-y-8">
			<header className="surface p-6 rounded-lg border border-surface-outline/40">
				<h1 className="text-xl font-semibold">Solicitação {req.id}</h1>
				<p className="text-sm text-text-soft">Status atual: <span className="chip chip-indigo inline-block">{req.status}</span></p>
			</header>
			<div className="surface-elevated p-6 rounded-lg border border-surface-outline/40 space-y-4 text-sm">
				<Row label="Fatura">{req.invoiceId || '—'}</Row>
				<Row label="Valor">{req.amount? req.amount.toLocaleString('pt-AO',{style:'currency',currency:'AOA'}) : '—'}</Row>
				<Row label="Criado">{new Date(req.createdAt).toLocaleString('pt-BR')}</Row>
				<Row label="Status">{req.status}</Row>
			</div>
		</div>
	);
}

function Row({ label, children }: { label:string; children:React.ReactNode }){
	return (
		<div className="flex justify-between gap-6 py-2 border-b border-surface-outline/20 last:border-0">
			<span className="text-text-soft/80 uppercase text-[11px] font-medium tracking-wide">{label}</span>
			<span className="font-medium text-sm">{children}</span>
		</div>
	);
}

