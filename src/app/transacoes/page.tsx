'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { TransactionForm } from '@/components/transactions/TransactionForm';
import { TransactionTable } from '@/components/transactions/TransactionTable';
import { useTransactions } from '@/hooks/useTransactions';
import { defaultCategories } from '@/data/mockData';
import { Transaction, TransactionFormData } from '@/types';
import { Button } from '@/components/ui/Button';

export default function TransacoesPage() {
  const { 
    transactions, 
    addTransaction, 
  deleteTransaction
  } = useTransactions();

  const [showForm, setShowForm] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  
  // Resumo removido conforme solicitação – caso volte a ser necessário, recuperar getTransactionsSummary.

  const handleAddTransaction = (transactionData: TransactionFormData) => {
    addTransaction(transactionData);
    setShowForm(false);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowForm(true);
  };

  const handleDeleteTransaction = (transactionId: string) => {
    if (confirm('Tem certeza de que deseja excluir esta transação?')) {
      deleteTransaction(transactionId);
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedTransaction(null);
  };

  const headerActions = (
    <>
      <Button
        variant="soft"
        size="sm"
        iconLeft={<span className="text-base">📤</span>}
        className="!h-9 px-3 gap-1.5 font-medium"
      >
        Exportar
      </Button>
      <Button
        variant="primary"
        size="sm"
        onClick={() => setShowForm(true)}
        iconLeft={<span className="text-base">＋</span>}
        className="!h-9 px-3 gap-1.5 font-medium"
      >
        Nova Transação
      </Button>
    </>
  );

  return (
    <MainLayout 
      title="Gestão de Transações" 
      subtitle="Controle completo de receitas e despesas da instituição"
      actions={headerActions}
    >
  {/* Secção de KPIs removida conforme solicitação */}

      {/* Filtros e Pesquisa */}
      <div className="mb-8 surface p-6 rounded-xl">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-64">
            <input
              type="text"
              placeholder="🔍 Pesquisar transações..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
          </div>
          <div className="flex gap-2">
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="">Todas as categorias</option>
              {defaultCategories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="">Todos os tipos</option>
              <option value="receita">Receitas</option>
              <option value="despesa">Despesas</option>
            </select>
            <input
              type="month"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              defaultValue={new Date().toISOString().slice(0, 7)}
            />
          </div>
        </div>
      </div>

      {/* Tabela de Transações */}
      <TransactionTable
        transactions={transactions}
        categories={defaultCategories}
        onEdit={handleEditTransaction}
        onDelete={handleDeleteTransaction}
      />

      {/* Modal de Formulário */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-8 border w-11/12 md:w-2/3 lg:w-1/2 shadow-2xl rounded-2xl bg-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {selectedTransaction ? 'Editar Transação' : 'Nova Transação'}
              </h3>
              <button
                onClick={closeForm}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <TransactionForm
              onSubmit={handleAddTransaction}
              onCancel={closeForm}
            />
          </div>
        </div>
      )}
    </MainLayout>
  );
}
