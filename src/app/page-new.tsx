'use client';

import { useState } from 'react';
import { FinancialSummaryCard } from '@/components/dashboard/FinancialSummaryCard';
import { TransactionForm } from '@/components/transactions/TransactionForm';
import { TransactionList } from '@/components/transactions/TransactionList';
import { useTransactions } from '@/hooks/useTransactions';
import { defaultCategories } from '@/data/mockData';

export default function Home() {
  const { 
    transactions, 
    addTransaction, 
    deleteTransaction,
    getFinancialSummary 
  } = useTransactions();

  const [showForm, setShowForm] = useState(false);
  const financialSummary = getFinancialSummary();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">FinControl</h1>
              <p className="text-gray-600">Sistema de Controle de Custos - Instituto Superior Politécnico do Bie</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              {showForm ? 'Fechar Formulário' : 'Nova Transação'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Financial Summary */}
        <FinancialSummaryCard summary={financialSummary} />

        {/* Transaction Form */}
        {showForm && (
          <div className="mb-8">
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
        <TransactionList 
          transactions={transactions.slice(0, 10)} // Mostrar apenas as 10 mais recentes
          categories={defaultCategories}
          onDelete={deleteTransaction}
        />
      </main>
    </div>
  );
}
