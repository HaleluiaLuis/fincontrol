"use client";
import React, { useEffect, useState } from 'react';

export interface PaymentRequestFiltersState {
	search: string;
	status: string;
	dateFrom: string;
	dateTo: string;
}

interface PaymentRequestFiltersProps {
	value: PaymentRequestFiltersState;
	onChange: (state: PaymentRequestFiltersState) => void;
	loading?: boolean;
	compact?: boolean;
	statuses?: { value: string; label: string }[];
}

const DEFAULT_STATUSES = [
	{ value: '', label: 'Todos status' },
	{ value: 'pendente', label: 'Pendente' },
	{ value: 'aprovada', label: 'Aprovada' },
	{ value: 'rejeitada', label: 'Rejeitada' }
];

export function PaymentRequestFilters({ value, onChange, loading=false, compact=false, statuses=DEFAULT_STATUSES }: PaymentRequestFiltersProps){
	const [local, setLocal] = useState<PaymentRequestFiltersState>(value);

		useEffect(()=>{ setLocal(value); },[value]);

	function update<K extends keyof PaymentRequestFiltersState>(key: K, val: PaymentRequestFiltersState[K]){
		const next = { ...local, [key]: val } as PaymentRequestFiltersState;
		setLocal(next);
		onChange(next);
	}

	function reset(){
		const cleared: PaymentRequestFiltersState = { search:'', status:'', dateFrom:'', dateTo:'' };
		setLocal(cleared); onChange(cleared);
	}

	return (
		<div className={`flex flex-wrap gap-4 ${compact? 'items-center':'items-end'}`} aria-label="Filtros de solicitações">
			<div className="flex-1 min-w-60">
				<label className="block text-[11px] font-medium uppercase tracking-wide mb-1 text-text-soft">Pesquisar</label>
				<input
					className="field w-full"
					placeholder="🔍 ID ou Fatura..."
					value={local.search}
					onChange={e=>update('search', e.target.value)}
				/>
			</div>
			<div className="w-44">
				<label className="block text-[11px] font-medium uppercase tracking-wide mb-1 text-text-soft">Status</label>
				<select className="field w-full" value={local.status} onChange={e=>update('status', e.target.value)}>
					{statuses.map(s => <option key={s.value||'all'} value={s.value}>{s.label}</option>)}
				</select>
			</div>
			{!compact && (
				<>
					<div className="w-40">
						<label className="block text-[11px] font-medium uppercase tracking-wide mb-1 text-text-soft">De</label>
						<input type="date" className="field w-full" value={local.dateFrom} onChange={e=>update('dateFrom', e.target.value)} />
					</div>
					<div className="w-40">
						<label className="block text-[11px] font-medium uppercase tracking-wide mb-1 text-text-soft">Até</label>
						<input type="date" className="field w-full" value={local.dateTo} onChange={e=>update('dateTo', e.target.value)} />
					</div>
				</>
			)}
			<div className="flex gap-2 ml-auto">
				<button onClick={reset} className="action-btn !h-9 px-4 text-[11px]" disabled={loading}>Limpar</button>
			</div>
		</div>
	);
}

export function usePaymentRequestFilter(list: { id:string; invoiceId?:string; createdAt:string; status:string; amount?:number }[]){
	const [filters, setFilters] = useState<PaymentRequestFiltersState>({ search:'', status:'', dateFrom:'', dateTo:'' });
	const filtered = React.useMemo(()=>{
		return list.filter(item => {
			if(filters.status && item.status !== filters.status) return false;
			if(filters.search){
				const q = filters.search.toLowerCase();
				if(!(item.id + (item.invoiceId||'')).toLowerCase().includes(q)) return false;
			}
			if(filters.dateFrom){ if(new Date(item.createdAt) < new Date(filters.dateFrom)) return false; }
			if(filters.dateTo){ if(new Date(item.createdAt) > new Date(filters.dateTo+'T23:59:59')) return false; }
			return true;
		});
	},[list, filters]);
	return { filters, setFilters, filtered };
}

