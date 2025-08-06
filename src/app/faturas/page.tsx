'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { InvoicesSummaryCard } from '@/components/dashboard/InvoicesSummaryCard';
import { InvoiceList } from '@/components/invoices/InvoiceList';
import { WorkflowTracker } from '@/components/invoices/WorkflowTracker';
import { useInvoices } from '@/hooks/useInvoices';
import { mockSuppliers, defaultCategories } from '@/data/mockData';
import { Invoice } from '@/types';
import { Button } from '@/components/ui/Button';

export default function FaturasPage() {
  const { 
    invoices, 
    approveInvoice, 
    rejectInvoice,
    getInvoicesSummary,
    getOverdueInvoices
  } = useInvoices();

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentUserRole] = useState('administrador'); // Simulando usuário logado
  
  const invoicesSummary = getInvoicesSummary();
  const overdueInvoices = getOverdueInvoices();

  const handleViewDetails = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowModal(true);
  };

  const handleApprove = (invoiceId: string) => {
    // Simular dados do usuário atual
    approveInvoice(invoiceId, 'user-001', 'Usuário Atual', 'Aprovado via sistema');
  };

  const handleReject = (invoiceId: string, comments: string) => {
    // Simular dados do usuário atual
    rejectInvoice(invoiceId, 'user-001', 'Usuário Atual', comments);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedInvoice(null);
  };

  const headerActions = (
    <>
      <Button variant="secondary" size="sm">
        📤 Exportar Relatório
      </Button>
      <Button variant="primary" size="sm">
        + Nova Fatura
      </Button>
    </>
  );

  return (
    <MainLayout 
      title="Gestão de Faturas" 
      subtitle="Sistema de controle de faturas com fluxo hierárquico de aprovação"
      actions={headerActions}
    >
      {/* Summary Cards */}
      <InvoicesSummaryCard summary={invoicesSummary} />

      {/* Alertas de Faturas Vencidas */}
      {overdueInvoices.length > 0 && (
        <div className="mb-8 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-6 shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="h-6 w-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-semibold text-red-800 mb-1">
                ⚠️ Atenção: {overdueInvoices.length} fatura(s) vencida(s)
              </h3>
              <div className="text-sm text-red-700">
                <p className="mb-2">
                  Há faturas que já passaram da data de vencimento. 
                  Verifique e processe com urgência para evitar penalidades.
                </p>
                <div className="flex space-x-4">
                  <Button variant="danger" size="sm">
                    Ver Faturas Vencidas
                  </Button>
                  <Button variant="secondary" size="sm">
                    Gerar Relatório
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Faturas */}
      <InvoiceList 
        invoices={invoices}
        suppliers={mockSuppliers}
        categories={defaultCategories}
        onViewDetails={handleViewDetails}
        onApprove={handleApprove}
        onReject={handleReject}
        currentUserRole={currentUserRole}
      />

      {/* Modal de Detalhes */}
      {showModal && selectedInvoice && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-8 border w-11/12 md:w-4/5 lg:w-3/5 shadow-2xl rounded-2xl bg-white">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Detalhes da Fatura: {selectedInvoice.invoiceNumber}
                </h3>
                <p className="text-gray-600 mt-1">Informações completas e fluxo de aprovação</p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Informações da Fatura */}
            <div className="mb-8 bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-xl border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">📋 Informações da Fatura</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Fornecedor</p>
                  <p className="text-base font-semibold text-gray-900">
                    {mockSuppliers.find(s => s.id === selectedInvoice.supplierId)?.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Valor</p>
                  <p className="text-xl font-bold text-green-600">
                    {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(selectedInvoice.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Data de Vencimento</p>
                  <p className="text-base font-semibold text-gray-900">
                    {new Date(selectedInvoice.dueDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Categoria</p>
                  <p className="text-base font-semibold text-gray-900">
                    {defaultCategories.find(c => c.id === selectedInvoice.category)?.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Data de Emissão</p>
                  <p className="text-base text-gray-900">
                    {new Date(selectedInvoice.issueDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Data do Serviço</p>
                  <p className="text-base text-gray-900">
                    {new Date(selectedInvoice.serviceDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <p className="text-sm font-medium text-gray-500 mb-2">Descrição</p>
                <p className="text-base text-gray-900 bg-white p-3 rounded-lg border">{selectedInvoice.description}</p>
              </div>
            </div>

            {/* Fluxo de Aprovação */}
            <WorkflowTracker invoice={selectedInvoice} />

            <div className="mt-8 flex justify-end space-x-4">
              <Button variant="secondary" onClick={closeModal}>
                Fechar
              </Button>
              <Button variant="primary">
                📄 Ver Documentos
              </Button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
