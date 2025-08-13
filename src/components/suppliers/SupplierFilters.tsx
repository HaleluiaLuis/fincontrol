"use client";
import React, { useEffect, useState } from 'react';

export interface SupplierFiltersState {
	search: string;
	status: string;
}

interface SupplierFiltersProps {
	value: SupplierFiltersState;
	onChange: (value: SupplierFiltersState) => void;
	loading?: boolean;
	className?: string;
}

const STATUS_OPTIONS = [
	{ value:'', label:'Todos os status' },
	{ value:'ativo', label:'Ativo' },
	{ value:'pendente', label:'Pendente' },
	{ value:'inativo', label:'Inativo' }
];

export function SupplierFilters({ value, onChange, loading=false, className='' }: SupplierFiltersProps){
	const [local, setLocal] = useState<SupplierFiltersState>(value);

	useEffect(()=>{ setLocal(value); },[value]);

	function update<K extends keyof SupplierFiltersState>(k:K, v:SupplierFiltersState[K]){
		const next = { ...local, [k]: v };
		setLocal(next);
		onChange(next);
	}

	function reset(){
		const cleared: SupplierFiltersState = { search:'', status:'' };
		setLocal(cleared); onChange(cleared);
	}

	return (
		<div className={`flex flex-wrap gap-4 items-end ${className}`} aria-label="Filtros de fornecedores">
			<div className="flex-1 min-w-64">
				<label className="block text-[11px] font-medium uppercase tracking-wide mb-1 text-text-soft">Pesquisar</label>
				<input
					className="field w-full"
					placeholder="🔍 Nome, NIF ou Email..."
					value={local.search}
					onChange={e=>update('search', e.target.value)}
				/>
			</div>
			<div className="w-48">
				<label className="block text-[11px] font-medium uppercase tracking-wide mb-1 text-text-soft">Status</label>
				<select className="field w-full" value={local.status} onChange={e=>update('status', e.target.value)}>
					{STATUS_OPTIONS.map(o => <option key={o.value||'todos'} value={o.value}>{o.label}</option>)}
				</select>
			</div>
			<div className="flex gap-2 ml-auto">
				<button type="button" onClick={reset} className="action-btn !h-9 px-4 text-[11px]" disabled={loading}>Limpar</button>
			</div>
		</div>
	);
}

import type { Supplier } from '@/types';

export function useSupplierFilters(list: Supplier[]){
	const [filters, setFilters] = useState<SupplierFiltersState>({ search:'', status:'' });
		const filtered = React.useMemo(()=>{
			return list.filter((s: Supplier) => {
				if(filters.status && s.status !== filters.status) return false;
				if(filters.search){
					const q = filters.search.toLowerCase();
					if(!(s.name.toLowerCase().includes(q) || s.taxId.toLowerCase().includes(q) || s.contact.email.toLowerCase().includes(q))) return false;
				}
				return true;
			});
		},[list, filters]);
	return { filters, setFilters, filtered };
}

