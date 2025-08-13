import React from 'react';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

// Implementação server-side usando Prisma. Removida tipagem estrita para evitar conflito com PageProps gerada.
export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }){
	const { id } = await params;
	if(!id) return notFound();
	const invoice = await prisma.invoice.findUnique({
		where:{ id },
		include:{ supplier:true, category:true }
	});
	if(!invoice) return notFound();

	const amountNumber = Number(invoice.amount);

	return (
		<div className="space-y-6">
			<header className="surface p-4 rounded-lg border border-surface-outline/40">
				<h1 className="text-xl font-semibold">Fatura {invoice.invoiceNumber}</h1>
				<p className="text-sm text-text-soft">Estado atual: <span className="chip chip-neutral inline-block">{invoice.status}</span></p>
			</header>
			<div className="grid md:grid-cols-3 gap-4">
				<div className="surface-elevated p-4 rounded-lg border border-surface-outline/30 md:col-span-2 space-y-2 text-sm">
					<div className="flex justify-between"><span>Fornecedor:</span><strong>{invoice.supplier?.name}</strong></div>
					<div className="flex justify-between"><span>Categoria:</span><span>{invoice.category?.name}</span></div>
					<div className="flex justify-between"><span>Descrição:</span><span>{invoice.description}</span></div>
					<div className="flex justify-between"><span>Valor:</span><strong>{amountNumber.toLocaleString('pt-AO',{ style:'currency', currency:'AOA'})}</strong></div>
					<div className="flex justify-between"><span>Emissão:</span><span>{new Date(invoice.issueDate).toLocaleDateString('pt-BR')}</span></div>
					<div className="flex justify-between"><span>Vencimento:</span><span>{new Date(invoice.dueDate).toLocaleDateString('pt-BR')}</span></div>
					<div className="flex justify-between"><span>Serviço:</span><span>{new Date(invoice.serviceDate).toLocaleDateString('pt-BR')}</span></div>
				</div>
				<div className="surface-elevated p-4 rounded-lg border border-surface-outline/30 space-y-3">
					<h2 className="font-medium">Histórico de Aprovação</h2>
					<ul className="space-y-2 text-xs">
						<li className="text-text-soft">(Histórico ainda não implementado)</li>
					</ul>
				</div>
			</div>
		</div>
	);
}
