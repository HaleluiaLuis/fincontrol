"use client";
import { useCallback, useEffect, useState } from 'react';
import type { Category } from '@/types';

interface UseCategoriesOptions { auto?: boolean; }

interface UseCategoriesResult {
	categories: Category[];
	loading: boolean;
	error: string | null;
	refresh: () => Promise<void>;
}

export function useCategories(opts: UseCategoriesOptions = {}): UseCategoriesResult {
	const { auto = true } = opts;
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string|null>(null);

	const refresh = useCallback(async () => {
		setLoading(true); setError(null);
		try {
			const res = await fetch('/api/categories');
			const json = await res.json();
			if(!res.ok) throw new Error(json.error||'Falha ao carregar categorias');
			setCategories(json.data);
		} catch(e:unknown){ setError(e instanceof Error? e.message : 'Erro'); }
		finally { setLoading(false); }
	},[]);

	useEffect(()=>{ if(auto) refresh(); }, [auto, refresh]);

	return { categories, loading, error, refresh };
}

