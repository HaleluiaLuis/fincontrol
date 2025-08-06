'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { FinancialSummaryCard } from '@/components/dashboard/FinancialSummaryCard';
import { InvoicesSummaryCard } from '@/components/dashboard/InvoicesSummaryCard';
import { TransactionForm } from '@/components/transactions/TransactionForm';
import { TransactionList } from '@/components/transactions/TransactionList';
import { useTransactions } from '@/hooks/useTransactions';
import { useInvoices } from '@/hooks/useInvoices';
import { defaultCategories } from '@/data/mockData';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function Home() {
  const { 
    transactions, 
    addTransaction, 
    deleteTransaction,
    getFinancialSummary 
  } = useTransactions();

  const { getInvoicesSummary } = useInvoices();

  const [showForm, setShowForm] = useState(false);
  const invoicesSummary = getInvoicesSummary();
  const financialSummary = getFinancialSummary(invoicesSummary);

  const headerActions = (
    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
      <Link href="/faturas">
        <Button variant="success" size="sm" className="w-full sm:w-auto text-xs sm:text-sm">
          <span className="sm:hidden">📋 Faturas</span>
          <span className="hidden sm:inline">📋 Gestão de Faturas</span>
        </Button>
      </Link>
      <Button
        onClick={() => setShowForm(!showForm)}
        variant={showForm ? "secondary" : "primary"}
        size="sm"
        className="w-full sm:w-auto text-xs sm:text-sm"
      >
        {showForm ? '✕ Fechar' : '+ Nova Transação'}
      </Button>
    </div>
  );

  return (
    <MainLayout 
      title="Dashboard Financeiro" 
      subtitle="Visão geral do controle de custos do Instituto Superior Politécnico do Bie"
      actions={headerActions}
    >
      {/* Financial Summary */}
      <FinancialSummaryCard summary={financialSummary} />

      {/* Invoices Summary */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 space-y-2 sm:space-y-0">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Resumo de Faturas</h2>
            <p className="text-sm text-gray-600 hidden sm:block">Acompanhe o status das faturas em processamento</p>
          </div>
          <Link href="/faturas" className="inline-flex items-center justify-center px-3 sm:px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
            <span className="sm:hidden">Ver faturas</span>
            <span className="hidden sm:inline">Ver todas as faturas</span>
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
        <InvoicesSummaryCard summary={invoicesSummary} />
      </div>

      {/* Transaction Form */}
      {showForm && (
        <div className="mb-6 sm:mb-8">
          <TransactionForm 
            onSubmit={(transactionData) => {
              addTransaction(transactionData);
              setShowForm(false);
            }}
            onCancel={() => setShowForm(false)}
            categories={defaultCategories}
          />
        </div>
      )}

      {/* Recent Transactions */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 sm:mb-4 space-y-1 sm:space-y-0">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Transações Recentes</h2>
            <p className="text-sm text-gray-600 hidden sm:block">Últimas movimentações financeiras registradas</p>
          </div>
        </div>
        <TransactionList 
          transactions={transactions.slice(0, 10)} // Mostrar apenas as 10 mais recentes
          categories={defaultCategories}
          onDelete={deleteTransaction}
        />
      </div>
    </MainLayout>
  );
}
