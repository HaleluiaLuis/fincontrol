"use client";
import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

interface FormState {
	name: string; email: string; phone: string; address: string; taxId: string; bankAccount: string;
}
const initial: FormState = { name:'', email:'', phone:'', address:'', taxId:'', bankAccount:'' };

export default function NovoFornecedorPage(){
	const [form, setForm] = useState<FormState>(initial);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string|null>(null);
	const [success, setSuccess] = useState(false);
	const router = useRouter();

	function update<K extends keyof FormState>(k:K, v:FormState[K]){ setForm(f=>({...f,[k]:v})); }

	async function handleSubmit(e: React.FormEvent){
		e.preventDefault();
		setError(null); setSuccess(false); setLoading(true);
		try {
			const res = await fetch('/api/suppliers', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) });
			const data = await res.json();
			if(!res.ok) throw new Error(data.error||'Erro ao criar fornecedor');
			setSuccess(true);
			setTimeout(()=> router.push('/fornecedores'), 800);
		} catch(e: unknown){
			setError(e instanceof Error? e.message : 'Erro inesperado');
		} finally { setLoading(false); }
	}

	return (
		<MainLayout title="Novo Fornecedor" subtitle="Cadastrar um novo fornecedor" actions={<Button size="sm" variant="soft" onClick={()=>router.back()}>Voltar</Button>}>
			<form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
				<div className="surface-elevated p-6 rounded-lg border border-surface-outline/40 space-y-6">
					<div className="grid md:grid-cols-2 gap-5">
						<Field label="Nome" required>
							<input className="field" value={form.name} onChange={e=>update('name', e.target.value)} required />
						</Field>
						<Field label="Email" required>
							<input type="email" className="field" value={form.email} onChange={e=>update('email', e.target.value)} required />
						</Field>
						<Field label="Telefone">
							<input className="field" value={form.phone} onChange={e=>update('phone', e.target.value)} />
						</Field>
						<Field label="NIF" required>
							<input className="field" value={form.taxId} onChange={e=>update('taxId', e.target.value)} required />
						</Field>
						<Field label="Conta Bancária">
							<input className="field" value={form.bankAccount} onChange={e=>update('bankAccount', e.target.value)} />
						</Field>
						<Field label="Endereço" full>
							<textarea className="field min-h-[80px]" value={form.address} onChange={e=>update('address', e.target.value)} />
						</Field>
					</div>
				</div>
				{error && <div className="chip chip-red !py-2 !px-4">{error}</div>}
				{success && <div className="chip chip-green !py-2 !px-4">Fornecedor criado.</div>}
				<div className="flex gap-3">
					<Button type="submit" variant="primary" size="sm" disabled={loading}>{loading? 'Guardando...' : 'Guardar'}</Button>
					<Button type="button" variant="soft" size="sm" onClick={()=>setForm(initial)} disabled={loading}>Limpar</Button>
				</div>
			</form>
		</MainLayout>
	);
}

function Field({ label, children, required, full }: { label:string; children:React.ReactNode; required?:boolean; full?:boolean }){
	return (
		<label className={`flex flex-col gap-1 ${full? 'md:col-span-2':''}`}> 
			<span className="text-[11px] font-medium uppercase tracking-wide text-text-soft">{label}{required && <span className="text-red-600"> *</span>}</span>
			{children}
		</label>
	);
}

