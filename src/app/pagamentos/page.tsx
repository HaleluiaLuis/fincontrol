"use client";
import { useEffect, useState, useMemo, Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

interface Payment { id:string; invoiceId?:string; amount?:number; method?:string; status?:string; createdAt:string; [k:string]:unknown }

export default function PagamentosPage(){
	const router = useRouter();
	const [data, setData] = useState<Payment[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string|null>(null);
	const [search, setSearch] = useState('');
	const [statusFilter, setStatusFilter] = useState('');

	async function load(){
		setLoading(true); setError(null);
		try {
			const res = await fetch('/api/payments');
			const json = await res.json();
			if(!res.ok) throw new Error(json.error||'Falha ao carregar pagamentos');
			setData(json.data);
		} catch(e: unknown){ setError(e instanceof Error? e.message : 'Erro'); }
		finally { setLoading(false); }
	}
	useEffect(()=>{ load(); },[]);

	const filtered = useMemo(()=> data.filter(p => {
		if(statusFilter && p.status!==statusFilter) return false;
		if(search){ const q = search.toLowerCase(); return (p.id+ (p.invoiceId||'')).toLowerCase().includes(q); }
		return true; }), [data, statusFilter, search]);

	const headerActions = (
		<>
			<Button variant="soft" size="sm" onClick={load} disabled={loading}>{loading? 'Atualizando...' : 'Atualizar'}</Button>
			<Button variant="primary" size="sm" onClick={()=>router.push('/pagamentos/novo')}>Novo Pagamento</Button>
		</>
	);

	return (
		<Suspense fallback={<div className="p-8 text-sm text-text-soft">Carregando pagamentos...</div>}>
		<MainLayout title="Pagamentos" subtitle="Registo e acompanhamento de pagamentos" actions={headerActions}>
			<div className="mb-8 surface p-6 rounded-xl">
				<div className="flex flex-wrap gap-4 items-center">
					<div className="flex-1 min-w-64">
						<input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Pesquisar..." className="field" />
					</div>
					<select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="field w-auto">
						<option value="">Todos status</option>
						<option value="pendente">Pendente</option>
						<option value="processando">Processando</option>
						<option value="pago">Pago</option>
						<option value="falhou">Falhou</option>
					</select>
				</div>
			</div>
			<div className="surface-elevated overflow-hidden">
				<div className="px-6 py-4 border-b border-surface-outline/30 bg-surface-alt flex items-center justify-between">
					<div>
						<h3 className="text-sm font-semibold">Pagamentos</h3>
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
								<th className="px-4 py-2 text-left">Método</th>
								<th className="px-4 py-2 text-left">Status</th>
								<th className="px-4 py-2 text-left">Criado</th>
								<th className="px-4 py-2 text-left">Ações</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-surface-outline/10">
							{loading && <tr><td colSpan={7} className="px-4 py-10 text-center text-text-soft">Carregando...</td></tr>}
							{!loading && filtered.length===0 && <tr><td colSpan={7} className="px-4 py-10 text-center text-text-soft">Nenhum pagamento.</td></tr>}
							{!loading && filtered.map(p => (
								<tr key={p.id} className="row-zebra">
									<td className="px-4 py-2 font-medium">{p.id}</td>
									<td className="px-4 py-2">{p.invoiceId || '—'}</td>
									<td className="px-4 py-2">{p.amount? p.amount.toLocaleString('pt-AO',{style:'currency',currency:'AOA'}) : '—'}</td>
									<td className="px-4 py-2">{p.method || '—'}</td>
									<td className="px-4 py-2"><StatusBadge status={p.status||'pendente'} /></td>
									<td className="px-4 py-2">{new Date(p.createdAt).toLocaleDateString('pt-BR')}</td>
									<td className="px-4 py-2"><button onClick={()=>router.push(`/pagamentos/${p.id}`)} className="action-btn !h-7 px-2.5 text-[11px]">Ver</button></td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</MainLayout>
		</Suspense>
	);
}

function StatusBadge({ status }: { status:string }){
	const map: Record<string,string> = { pendente:'chip chip-amber', processando:'chip chip-indigo', pago:'chip chip-green', falhou:'chip chip-red' };
	return <span className={map[status] || 'chip chip-neutral'}>{status}</span>;
}

