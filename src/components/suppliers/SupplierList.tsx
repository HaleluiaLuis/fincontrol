"use client";
import React from 'react';
import { Supplier } from '@/types';
import { Badge } from '@/components/ui/Badge';

interface SupplierListProps {
	suppliers: Supplier[];
	loading?: boolean;
	error?: string | null;
	onReload?: () => void;
	onView?: (supplier: Supplier) => void;
	onEdit?: (supplier: Supplier) => void;
}

function StatusBadge({ status }: { status: Supplier['status'] }){
	const map: Partial<Record<Supplier['status'], { label:string; variant: 'green' | 'amber' | 'red' }>> = {
		ativo: { label:'Ativo', variant:'green' },
		pendente: { label:'Pendente', variant:'amber' },
		inativo: { label:'Inativo', variant:'red' }
	};
	const cfg = map[status];
	if(!cfg){
		return <Badge size="sm" variant="amber">Desconhecido</Badge>;
	}
	return <Badge size="sm" variant={cfg.variant}>{cfg.label}</Badge>;
}

export function SupplierList({ suppliers, loading=false, error, onReload, onView, onEdit }: SupplierListProps){
	return (
		<div className="surface-elevated overflow-hidden">
			<div className="px-6 py-4 border-b border-surface-outline/30 bg-surface-alt flex items-center justify-between">
				<div>
					<h3 className="text-sm font-semibold">Lista de Fornecedores</h3>
					<p className="text-xs text-text-soft">Registos: {suppliers.length}</p>
				</div>
				{onReload && <button onClick={onReload} className="action-btn !h-8 px-3 text-[11px]" disabled={loading}>{loading? '...' : 'Recarregar'}</button>}
			</div>
			{error && <div className="p-4 text-sm text-red-600">{error}</div>}
			<div className="overflow-x-auto">
				<table className="min-w-full divide-y divide-surface-outline/20 text-sm">
					<thead className="bg-surface-alt text-[11px] uppercase text-text-soft">
						<tr>
							<th className="px-6 py-3 text-left font-medium">Fornecedor</th>
							<th className="px-6 py-3 text-left font-medium">Contato</th>
							<th className="px-6 py-3 text-left font-medium">Criado</th>
							<th className="px-6 py-3 text-left font-medium">Status</th>
							<th className="px-6 py-3 text-center font-medium">Ações</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-surface-outline/10">
						{loading && <tr><td colSpan={5} className="px-6 py-10 text-center text-text-soft">Carregando...</td></tr>}
						{!loading && suppliers.length===0 && <tr><td colSpan={5} className="px-6 py-10 text-center text-text-soft">Nenhum fornecedor.</td></tr>}
						{!loading && suppliers.map(s => (
							<tr key={s.id} className="row-zebra">
								<td className="px-6 py-4">
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold shadow-inner ring-1 ring-white/15">
											{s.name.charAt(0).toUpperCase()}
										</div>
										<div className="min-w-0">
											<p className="font-medium leading-tight truncate">{s.name}</p>
											<p className="text-xs text-text-soft truncate">{s.taxId}</p>
										</div>
									</div>
								</td>
								<td className="px-6 py-4 text-sm">
									<p className="leading-tight">{s.contact?.email || s.email || '—'}</p>
									<p className="text-xs text-text-soft">{s.contact?.phone || s.phone || ''}</p>
								</td>
								<td className="px-6 py-4 text-xs text-text-soft">{new Date(s.createdAt).toLocaleDateString('pt-BR')}</td>
								<td className="px-6 py-4"><StatusBadge status={s.status} /></td>
								<td className="px-6 py-4 text-center">
									<div className="flex justify-center gap-2">
										{onView && <button onClick={()=>onView(s)} className="action-btn !h-7 px-2.5 text-[11px]">Ver</button>}
										{onEdit && <button onClick={()=>onEdit(s)} className="action-btn !h-7 px-2.5 text-[11px]">Editar</button>}
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

