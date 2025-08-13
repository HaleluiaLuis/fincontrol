"use client";

import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { useEffect, useState } from 'react';
import { Supplier } from '@/types';

interface BackendSupplier { id:string; name:string; email?:string; phone?:string; address?:string; taxId:string; bankAccount?:string|null; status:string; createdAt:string }
import { useRouter } from 'next/navigation';
import { SupplierFilters, useSupplierFilters } from '@/components/suppliers/SupplierFilters';
import { SupplierList } from '@/components/suppliers/SupplierList';

export default function FornecedoresPage() {
  const router = useRouter();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);
  const { filters, setFilters, filtered } = useSupplierFilters(suppliers);

  async function loadSuppliers(){
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/suppliers', { credentials:'include' });
      const data = await res.json();
      if(!res.ok) throw new Error(data.error||'Falha ao carregar fornecedores');
  const normalized: Supplier[] = (data.data||[] as BackendSupplier[]).map((s: BackendSupplier) => ({
        id: s.id,
        name: s.name,
        email: s.email || '',
        phone: s.phone || '',
        address: s.address || '',
        taxId: s.taxId,
        bankAccount: s.bankAccount || undefined,
        status: String(s.status||'').toLowerCase() as Supplier['status'],
        contact: { email: s.email || '', phone: s.phone || '', address: s.address || '' },
        createdAt: s.createdAt
      }));
      setSuppliers(normalized);
    } catch(e: unknown){
      setError(e instanceof Error? e.message : 'Erro inesperado');
    } finally { setLoading(false); }
  }
  useEffect(()=>{ loadSuppliers(); },[]);

  // Filtro agora gerido via hook useSupplierFilters

  const headerActions = (
    <>
      <Button
        variant="soft"
        size="sm"
        iconLeft={<span className="text-base">�</span>}
        className="!h-9 px-3 gap-1.5 font-medium"
        onClick={loadSuppliers}
        disabled={loading}
      >
        {loading? 'Atualizando...' : 'Atualizar'}
      </Button>
      <Button
        variant="primary"
        size="sm"
        iconLeft={<span className="text-base">＋</span>}
        className="!h-9 px-3 gap-1.5 font-medium"
        onClick={()=>router.push('/fornecedores/novo')}
      >
        Novo Fornecedor
      </Button>
    </>
  );

  return (
    <MainLayout 
      title="Gestão de Fornecedores" 
      subtitle="Cadastro e controle de fornecedores e prestadores de serviços"
      actions={headerActions}
    >
  {/* Secção de KPIs removida conforme solicitação */}

      <div className="mb-8 surface p-6 rounded-xl">
        <SupplierFilters value={filters} onChange={setFilters} loading={loading} />
      </div>
      <SupplierList suppliers={filtered} loading={loading} error={error} onReload={loadSuppliers} />
    </MainLayout>
  );
}
