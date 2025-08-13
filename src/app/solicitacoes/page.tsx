"use client";
import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { PaymentRequestFilters, usePaymentRequestFilter } from '@/components/solicitacoes/PaymentRequestFilters';

interface PaymentRequest { id:string; status:string; createdAt:string; invoiceId?:string; requesterId?:string; amount?:number }

export default function SolicitacoesPage(){
	const router = useRouter();
	const [items, setItems] = useState<PaymentRequest[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string|null>(null);
	const { filters, setFilters, filtered } = usePaymentRequestFilter(items);

	async function load(){
		setLoading(true); setError(null);
		try {
			const res = await fetch('/api/payment-requests');
			const json = await res.json();
			if(!res.ok) throw new Error(json.error||'Falha ao carregar');
			setItems(json.data);
		} catch(e: unknown){ setError(e instanceof Error? e.message : 'Erro'); }
		finally { setLoading(false); }
	}
	useEffect(()=>{ load(); },[]);



	const headerActions = (
		<>
			<Button size="sm" variant="soft" onClick={load} disabled={loading}>{loading? 'Atualizando...' : 'Atualizar'}</Button>
			<Button size="sm" variant="primary" onClick={()=>router.push('/solicitacoes/novo')}>Nova Solicitação</Button>
		</>
	);

	return (
		<MainLayout title="Solicitações de Pagamento" subtitle="Pedidos para iniciar processos de pagamento" actions={headerActions}>
			<div className="mb-8 surface p-6 rounded-xl">
				<PaymentRequestFilters value={filters} onChange={setFilters} loading={loading} />
			</div>
			<div className="surface-elevated overflow-hidden">
				<div className="px-6 py-4 border-b border-surface-outline/30 bg-surface-alt flex items-center justify-between">
					<div>
						<h3 className="text-sm font-semibold">Solicitações</h3>
						<p className="text-xs text-text-soft">Total: {filtered.length}</p>
					</div>
				</div>
				{error && <div className="p-4 text-sm text-red-600">{error}</div>}
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-surface-outline/20 text-sm">
						<thead className="bg-surface-alt text-[11px] uppercase text-text-soft">
							<tr>
								<th className="px-4 py-2 text-left">ID</th>
								<th className="px-4 py-2 text-left">Fatura</th>
								<th className="px-4 py-2 text-left">Valor</th>
								<th className="px-4 py-2 text-left">Status</th>
								<th className="px-4 py-2 text-left">Criado</th>
								<th className="px-4 py-2 text-left">Ações</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-surface-outline/10">
							{loading && <tr><td colSpan={6} className="px-4 py-10 text-center text-text-soft">Carregando...</td></tr>}
							{!loading && filtered.length===0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-text-soft">Nenhuma solicitação.</td></tr>}
							{!loading && filtered.map(r => (
								<tr key={r.id} className="row-zebra">
									<td className="px-4 py-2 font-medium">{r.id}</td>
									<td className="px-4 py-2">{r.invoiceId || '—'}</td>
									<td className="px-4 py-2">{r.amount? r.amount.toLocaleString('pt-AO',{style:'currency',currency:'AOA'}) : '—'}</td>
									<td className="px-4 py-2"><StatusBadge status={r.status} /></td>
									<td className="px-4 py-2">{new Date(r.createdAt).toLocaleDateString('pt-BR')}</td>
									<td className="px-4 py-2"><button onClick={()=>router.push(`/solicitacoes/${r.id}`)} className="action-btn !h-7 px-2.5 text-[11px]">Ver</button></td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</MainLayout>
	);
}

function StatusBadge({ status }: { status:string }){
	const map: Record<string,string> = { pendente:'chip chip-amber', aprovada:'chip chip-green', rejeitada:'chip chip-red' };
	return <span className={map[status] || 'chip chip-neutral'}>{status}</span>;
}

