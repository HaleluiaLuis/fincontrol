import React from 'react';
import { notFound } from 'next/navigation';

interface PaymentLocal { id:string; invoiceId?:string; amount?:number; method?:string; status?:string; createdAt:string; [k:string]:unknown }

async function fetchPayment(id:string): Promise<PaymentLocal | null>{
	const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/payments`, { cache:'no-store' });
	if(!res.ok) return null;
	const data = await res.json();
	const arr = data.data as PaymentLocal[];
	return arr.find(p=>p.id===id) || null;
}

export default async function PagamentoDetalhePage({ params }: { params: Promise<{ id:string }> }){
	const { id } = await params;
	const payment = await fetchPayment(id);
	if(!payment) return notFound();
	return (
		<div className="max-w-3xl mx-auto py-10 space-y-8">
			<header className="surface p-6 rounded-lg border border-surface-outline/40">
				<h1 className="text-xl font-semibold">Pagamento {payment.id}</h1>
				<p className="text-sm text-text-soft">Status atual: <span className="chip chip-indigo inline-block">{payment.status||'pendente'}</span></p>
			</header>
			<div className="surface-elevated p-6 rounded-lg border border-surface-outline/40 space-y-4 text-sm">
				<Row label="Fatura">{payment.invoiceId || '—'}</Row>
				<Row label="Valor">{payment.amount? payment.amount.toLocaleString('pt-AO',{style:'currency',currency:'AOA'}) : '—'}</Row>
				<Row label="Método">{payment.method || '—'}</Row>
				<Row label="Criado">{new Date(payment.createdAt).toLocaleString('pt-BR')}</Row>
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

