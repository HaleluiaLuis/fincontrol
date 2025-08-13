"use client";
import { useState, useMemo, Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { useSuppliers } from '@/contexts/SuppliersContext';
import { useCategories } from '@/contexts/CategoriesContext';
import { useInvoices } from '@/contexts/InvoicesContext';
import { useAuth } from '@/contexts/AuthContext';

interface FormState {
	supplierId: string;
	description: string;
	amount: string;
	issueDate: string;
	dueDate: string;
	serviceDate: string;
	category: string;
}

const initial: FormState = {
	supplierId: '',
	description: '',
	amount: '',
	issueDate: '',
	dueDate: '',
	serviceDate: '',
	category: '',
};

export default function NovaFaturaPage(){
	const [form, setForm] = useState<FormState>(initial);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string|null>(null);
	const [success, setSuccess] = useState(false);
	const { suppliers } = useSuppliers();
	const { categories } = useCategories();
	const { create } = useInvoices();
	const { user } = useAuth();

	const expenseCategories = useMemo(()=> categories.filter(c=>c.type==='despesa'), [categories]);

	function update<K extends keyof FormState>(key: K, value: FormState[K]){ setForm(f=>({...f,[key]:value})); }

	async function handleSubmit(e: React.FormEvent){
		e.preventDefault();
		setError(null); setSuccess(false); setLoading(true);
		try {
			if(!user) throw new Error('Sessão expirada. Faça login novamente.');
			const payload = {
				supplierId: form.supplierId,
				description: form.description,
				amount: Number(form.amount),
				issueDate: form.issueDate,
				serviceDate: form.serviceDate,
				dueDate: form.dueDate,
				category: form.category,
				createdBy: user.id
			};
			const created = await create(payload);
			if(!created) throw new Error('Falha ao criar fatura');
			setSuccess(true); setForm(initial);
		} catch(e: unknown){ setError(e instanceof Error? e.message : 'Erro inesperado'); }
		finally { setLoading(false); }
	}

	const headerActions = (
		<Button variant="soft" size="sm" onClick={()=>setForm(initial)} disabled={loading}>Limpar</Button>
	);

	return (
		<Suspense fallback={<div className="p-8 text-sm text-text-soft">Carregando formulário...</div>}>
			<MainLayout title="Nova Fatura" subtitle="Registar uma nova fatura no fluxo de aprovação" actions={headerActions}>
				<form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
					<div className="surface-elevated p-6 rounded-lg border border-surface-outline/40 space-y-6">
						<div>
							<h2 className="text-sm font-semibold tracking-wide uppercase text-text-soft/80">Dados Principais</h2>
						</div>
						<div className="grid md:grid-cols-2 gap-5">
							<Field label="Fornecedor">
								<select className="field" value={form.supplierId} onChange={e=>update('supplierId', e.target.value)} required>
									<option value="">Selecione...</option>
									{suppliers.map(s=> <option key={s.id} value={s.id}>{s.name}</option>)}
								</select>
							</Field>
							<Field label="Categoria">
								<select className="field" value={form.category} onChange={e=>update('category', e.target.value)} required>
									<option value="">Selecione...</option>
									{expenseCategories.map(c=> <option key={c.id} value={c.id}>{c.name}</option>)}
								</select>
							</Field>
							<Field label="Descrição" full>
								<textarea className="field min-h-[90px]" value={form.description} onChange={e=>update('description', e.target.value)} required />
							</Field>
							<Field label="Valor (AOA)">
								<input type="number" step="0.01" className="field" value={form.amount} onChange={e=>update('amount', e.target.value)} required />
							</Field>
							<Field label="Data de Emissão">
								<input type="date" className="field" value={form.issueDate} onChange={e=>update('issueDate', e.target.value)} required />
							</Field>
							<Field label="Data de Vencimento">
								<input type="date" className="field" value={form.dueDate} onChange={e=>update('dueDate', e.target.value)} required />
							</Field>
							<Field label="Data do Serviço">
								<input type="date" className="field" value={form.serviceDate} onChange={e=>update('serviceDate', e.target.value)} required />
							</Field>
						</div>
					</div>

					<div className="surface p-6 rounded-lg border border-surface-outline/40 space-y-4">
						<h2 className="text-sm font-semibold tracking-wide uppercase text-text-soft/80">Anexos (Mock)</h2>
						<p className="text-xs text-text-soft">Upload real será implementado após integração de armazenamento. Por agora, anexos não são enviados.</p>
					</div>

					{error && <div className="chip chip-red !py-2 !px-4">{error}</div>}
					{success && <div className="chip chip-green !py-2 !px-4">Fatura criada com sucesso.</div>}

					<div className="flex gap-3">
						<Button type="submit" variant="primary" size="sm" disabled={loading}>{loading? 'Guardando...' : 'Guardar Fatura'}</Button>
						<Button type="button" variant="soft" size="sm" disabled={loading} onClick={()=>setForm(initial)}>Cancelar</Button>
					</div>
				</form>
			</MainLayout>
		</Suspense>
	);
}

function Field({ label, children, full }: { label:string; children:React.ReactNode; full?:boolean }){
	return (
		<label className={`flex flex-col gap-1 ${full? 'md:col-span-2' : ''}`}>
			<span className="text-[11px] font-medium uppercase tracking-wide text-text-soft">{label}</span>
			{children}
		</label>
	);
}

