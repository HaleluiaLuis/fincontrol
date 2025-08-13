"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Supplier } from '@/types';
import { api } from '@/lib/api';
import { supplierStatusLabels } from '@/lib/enumMappings';

interface SupplierExtended extends Supplier { statusLabel?: string }

interface BackendSupplier {
	id: string;
	name: string;
	email?: string;
	phone?: string;
	address?: string;
	taxId: string;
	bankAccount?: string;
	status: string;
	createdAt: string;
}

interface SuppliersContextValue {
	suppliers: Supplier[];
	loading: boolean;
	error: string | null;
	refresh: () => Promise<void>;
	create: (data: Partial<Supplier>) => Promise<Supplier | null>;
}

const SuppliersContext = createContext<SuppliersContextValue | undefined>(undefined);

export const SuppliersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [suppliers, setSuppliers] = useState<Supplier[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string|null>(null);

	const refresh = useCallback(async () => {
		setLoading(true); setError(null);
		const res = await api<BackendSupplier[]>('/api/suppliers');
		if(!res.ok){ setError(res.error||'Erro'); setLoading(false); return; }
		const mapped: SupplierExtended[] = (res.data||[]).map(s => ({
			id: s.id,
			name: s.name,
			email: s.email || '',
			phone: s.phone || '',
			address: s.address || '',
			taxId: s.taxId,
			bankAccount: s.bankAccount,
			status: (supplierStatusLabels[s.status] ? s.status.toLowerCase() : s.status) as Supplier['status'],
			contact: { email: s.email || '', phone: s.phone || '', address: s.address || '' },
			createdAt: s.createdAt,
			statusLabel: supplierStatusLabels[s.status] || s.status
		}));
		setSuppliers(mapped as Supplier[]);
		setLoading(false);
	},[]);

	useEffect(()=>{ refresh(); }, [refresh]);

	const create: SuppliersContextValue['create'] = useCallback(async (data) => {
		const res = await api<BackendSupplier, typeof data>('/api/suppliers', { method:'POST', json: data });
		if(!res.ok) return null;
		if(res.data) {
			const mapped: SupplierExtended = {
				id: res.data.id,
				name: res.data.name,
				email: res.data.email || '',
				phone: res.data.phone || '',
				address: res.data.address || '',
				taxId: res.data.taxId,
				bankAccount: res.data.bankAccount,
				status: (supplierStatusLabels[res.data.status] ? res.data.status.toLowerCase() : res.data.status) as Supplier['status'],
				contact: { email: res.data.email || '', phone: res.data.phone || '', address: res.data.address || '' },
				createdAt: res.data.createdAt,
				statusLabel: supplierStatusLabels[res.data.status] || res.data.status
			};
			setSuppliers(prev => [mapped, ...prev]);
			return mapped;
		}
		return null;
	},[]);

	return (
		<SuppliersContext.Provider value={{ suppliers, loading, error, refresh, create }}>
			{children}
		</SuppliersContext.Provider>
	);
};

export function useSuppliers(){
	const ctx = useContext(SuppliersContext);
	if(!ctx) throw new Error('useSuppliers deve ser usado dentro de SuppliersProvider');
	return ctx;
}

