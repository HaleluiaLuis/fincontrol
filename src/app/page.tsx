'use client';

import { useState, Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { FinancialSummaryCard } from '@/components/dashboard/FinancialSummaryCard';
import { TransactionForm } from '@/components/transactions/TransactionForm';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { useTransactions } from '@/contexts/TransactionsContext';
import { useInvoices } from '@/contexts/InvoicesContext';
import { useCategories } from '@/contexts/CategoriesContext';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function Home() {
  const { transactions, create, summary } = useTransactions();
  const { invoices } = useInvoices();
  const { categories } = useCategories();

  const [showForm, setShowForm] = useState(false);
  const invoicesSummary = (()=>{
    const totalPendentes = invoices.filter(i=> ['pendente_contratacao','pendente_presidente','aprovada_registro','registrada','pendente_pagamento'].includes(i.status)).length;
    const totalAprovadas = invoices.filter(i=> ['registrada','pendente_pagamento'].includes(i.status)).length;
    const totalPagas = invoices.filter(i=> i.status==='paga').length;
    const valorPendente = invoices.filter(i=> ['pendente_contratacao','pendente_presidente','aprovada_registro'].includes(i.status)).reduce((s,i)=>s+i.amount,0);
    const valorAprovado = invoices.filter(i=> ['registrada','pendente_pagamento'].includes(i.status)).reduce((s,i)=>s+i.amount,0);
    const valorPago = invoices.filter(i=> i.status==='paga').reduce((s,i)=>s+i.amount,0);
    return { totalPendentes, totalAprovadas, totalPagas, valorPendente, valorAprovado, valorPago };
  })();
  const financialSummary = { ...summary, periodo:{ inicio:'', fim:'' }, faturas: invoicesSummary };

  const headerActions = (
    <>
      <Link href="/faturas">
        <Button
          variant="soft"
          size="sm"
          className="font-medium gap-1.5 !h-9 px-3 backdrop-blur-md"
          iconLeft={<span className="text-base">📋</span>}
        >
          Gestão de Faturas
        </Button>
      </Link>
      <Button
        onClick={() => setShowForm(!showForm)}
        variant={showForm ? 'soft' : 'primary'}
        size="sm"
        className="font-medium gap-1.5 !h-9 px-3"
        iconLeft={showForm ? <span className="text-base">✕</span> : <span className="text-base">＋</span>}
      >
        {showForm ? 'Fechar' : 'Nova Transação'}
      </Button>
    </>
  );

  // Secção de KPIs removida conforme solicitação

  return (
    <Suspense fallback={<div className="p-8 text-sm text-text-soft">Carregando dashboard...</div>}>
    <MainLayout
      title="Dashboard Financeiro"
      subtitle="Visão geral do controle de custos do Instituto Superior Politécnico do Bie"
      actions={headerActions}
    >
  {/* Secção de KPIs removida */}

      <FinancialSummaryCard summary={financialSummary} />

      {/* Resumo de Faturas (versão compacta) */}
      <section className="surface p-6 rounded-xl mb-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-sm font-semibold tracking-wide text-gray-800 uppercase">Resumo de Faturas</h2>
            <p className="text-xs text-gray-500 mt-1">Movimento e status atuais</p>
          </div>
          <Link href="/faturas" className="action-btn !h-8 px-3 text-[11px]">Ver todas</Link>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--surface-alt)] border border-[var(--border-subtle)]">
            <div className="w-9 h-9 flex items-center justify-center rounded-md bg-amber-50 text-amber-600 text-sm">⏳</div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-medium tracking-wide text-gray-500 uppercase">Pendentes</p>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-semibold text-gray-900 tabular-nums">{invoicesSummary.totalPendentes}</span>
              </div>
            </div>
            <span className="chip chip-amber !text-[11px] !py-0.5">Em aprovação</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--surface-alt)] border border-[var(--border-subtle)]">
            <div className="w-9 h-9 flex items-center justify-center rounded-md bg-indigo-50 text-indigo-600 text-sm">🗂️</div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-medium tracking-wide text-gray-500 uppercase">Aprovadas</p>
              <span className="text-lg font-semibold text-gray-900 tabular-nums">{invoicesSummary.totalAprovadas}</span>
            </div>
            <span className="chip chip-indigo !text-[11px] !py-0.5">Prontas</span>
          </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--surface-alt)] border border-[var(--border-subtle)]">
            <div className="w-9 h-9 flex items-center justify-center rounded-md bg-green-50 text-green-600 text-sm">✅</div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-medium tracking-wide text-gray-500 uppercase">Pagas</p>
              <span className="text-lg font-semibold text-gray-900 tabular-nums">{invoicesSummary.totalPagas}</span>
            </div>
            <span className="chip chip-green !text-[11px] !py-0.5">Liquidadas</span>
          </div>
        </div>
      </section>

      {showForm && (
        <section className="mb-6">
          <TransactionForm
            onSubmit={(transactionData) => {
              create({ ...transactionData });
              setShowForm(false);
            }}
            onCancel={() => setShowForm(false)}
            categories={categories}
          />
        </section>
      )}

      <RecentTransactions
        transactions={transactions}
        categories={categories}
        limit={8}
      />
  </MainLayout>
  </Suspense>
  );
}
