"use client";
import { useState, Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

interface FormState { invoiceId:string; amount:string; method:string; }
const initial: FormState = { invoiceId:'', amount:'', method:'' };

export default function NovoPagamentoPage(){
	const router = useRouter();
	const [form, setForm] = useState<FormState>(initial);
	const [loading,setLoading] = useState(false);
	const [error,setError] = useState<string|null>(null);
	const [success,setSuccess] = useState(false);

	function update<K extends keyof FormState>(k:K,v:FormState[K]){ setForm(f=>({...f,[k]:v})); }

	async function submit(e:React.FormEvent){
		e.preventDefault(); setLoading(true); setError(null); setSuccess(false);
		try {
			const res = await fetch('/api/payments', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ ...form, amount:Number(form.amount), status:'pendente' }) });
			const data = await res.json(); if(!res.ok) throw new Error(data.error||'Erro');
			setSuccess(true); setTimeout(()=> router.push('/pagamentos'), 800);
		} catch(e:unknown){ setError(e instanceof Error? e.message:'Erro'); }
		finally { setLoading(false); }
	}

	return (
		<Suspense fallback={<div className="p-8 text-sm text-text-soft">Carregando formulário...</div>}>
		<MainLayout title="Novo Pagamento" subtitle="Registrar pagamento manual" actions={<Button size="sm" variant="soft" onClick={()=>router.back()}>Voltar</Button>}>
			<form onSubmit={submit} className="max-w-lg space-y-8">
				<div className="surface-elevated p-6 rounded-lg border border-surface-outline/40 space-y-6">
					<div className="grid gap-5">
						<Field label="ID da Fatura">
							<input className="field" value={form.invoiceId} onChange={e=>update('invoiceId', e.target.value)} placeholder="inv-001" />
						</Field>
						<Field label="Valor (AOA)" required>
							<input type="number" className="field" value={form.amount} onChange={e=>update('amount', e.target.value)} required />
						</Field>
						<Field label="Método" required>
							<select className="field" value={form.method} onChange={e=>update('method', e.target.value)} required>
								<option value="">Selecione...</option>
								<option value="transferencia">Transferência</option>
								<option value="cheque">Cheque</option>
								<option value="dinheiro">Dinheiro</option>
							</select>
						</Field>
					</div>
				</div>
				{error && <div className="chip chip-red !py-2 !px-4">{error}</div>}
				{success && <div className="chip chip-green !py-2 !px-4">Pagamento criado.</div>}
				<div className="flex gap-3">
					<Button type="submit" variant="primary" size="sm" disabled={loading}>{loading? 'Guardando...' : 'Guardar'}</Button>
					<Button type="button" variant="soft" size="sm" disabled={loading} onClick={()=>setForm(initial)}>Limpar</Button>
				</div>
			</form>
		</MainLayout>
		</Suspense>
	);
}

function Field({ label, children, required }: { label:string; children:React.ReactNode; required?:boolean }){
	return (
		<label className="flex flex-col gap-1">
			<span className="text-[11px] font-medium uppercase tracking-wide text-text-soft">{label}{required && <span className="text-red-600"> *</span>}</span>
			{children}
		</label>
	);
}

