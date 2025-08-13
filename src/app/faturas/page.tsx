'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { InvoiceList } from '@/components/invoices/InvoiceList';
import { WorkflowTracker } from '@/components/invoices/WorkflowTracker';
import { useInvoices } from '@/contexts/InvoicesContext';
import { useSuppliers } from '@/contexts/SuppliersContext';
import { useCategories } from '@/contexts/CategoriesContext';
import { Invoice } from '@/types';
import { Button } from '@/components/ui/Button';

export default function FaturasPage() {
  const { invoices, loadHistory, histories, loadingHistory } = useInvoices();
  const { suppliers } = useSuppliers();
  const { categories } = useCategories();

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showModal, setShowModal] = useState(false);
  
  // Efeito para carregar histórico ao abrir modal
  useEffect(() => {
    if (showModal && selectedInvoice) {
      loadHistory(selectedInvoice.id);
    }
  }, [showModal, selectedInvoice, loadHistory]);
  
  const overdueInvoices = invoices.filter(inv => {
    const due = new Date(inv.dueDate);
    const today = new Date();
    return due < today && !['paga','cancelada','rejeitada'].includes(inv.status);
  });

  const handleViewDetails = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowModal(true);
  };


  const closeModal = () => {
    setShowModal(false);
    setSelectedInvoice(null);
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
        iconLeft={<span className="text-base">＋</span>}
        className="!h-9 px-3 gap-1.5 font-medium"
      >
        Nova Fatura
      </Button>
    </>
  );

  return (
    <MainLayout 
      title="Gestão de Faturas" 
      subtitle="Sistema de controle de faturas com fluxo hierárquico de aprovação"
      actions={headerActions}
    >
  {/* Secção de resumo removida conforme solicitação */}

      {/* Alertas de Faturas Vencidas - adaptado ao novo padrão surface/chip */}
      {overdueInvoices.length > 0 && (
        <div className="mb-8 surface p-6 flex items-start gap-5">
          <div className="chip chip-red !text-base !px-4 !py-3 font-semibold">⚠️</div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold tracking-wide text-red-700 dark:text-red-400 uppercase">
              {overdueInvoices.length} fatura(s) vencida(s)
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
              Existem faturas além do vencimento. Priorize a análise para evitar penalidades e otimizar o fluxo de aprovação.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="action-btn !h-8 px-3 text-[11px]">Ver vencidas</button>
              <button className="action-btn !h-8 px-3 text-[11px]">Relatório</button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Faturas */}
      <InvoiceList 
        invoices={invoices}
        suppliers={suppliers}
        categories={categories}
        onViewDetails={handleViewDetails}
      />

      {/* Modal de Detalhes */}
  {showModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-8 surface-elevated w-11/12 md:w-4/5 lg:w-3/5">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Detalhes da Fatura: {selectedInvoice.invoiceNumber}
                </h3>
                <p className="text-gray-600 mt-1 text-sm">Informações completas e fluxo de aprovação</p>
              </div>
              <button
                onClick={closeModal}
                className="app-icon-btn-sm hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Informações da Fatura */}
            <div className="mb-8 surface p-6">
              <h4 className="text-xs font-semibold tracking-wide text-gray-700 dark:text-gray-300 uppercase mb-5">Informações da Fatura</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Fornecedor</p>
                  <p className="text-base font-semibold text-gray-900">
                    {suppliers.find(s => s.id === selectedInvoice.supplierId)?.name}
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
                  <div className="mt-1">
                    <span className="chip chip-indigo">
                      {categories.find(c => c.id === selectedInvoice.category)?.name}
                    </span>
                  </div>
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
                <p className="text-base text-gray-900 bg-white p-3 rounded-lg border border-[var(--border-subtle)]">{selectedInvoice.description}</p>
              </div>
            </div>

            {/* Fluxo de Aprovação */}
            <WorkflowTracker invoice={selectedInvoice} />

            {/* Histórico de Eventos / Aprovações */}
            <div className="mt-8 surface p-6">
              <h4 className="text-xs font-semibold tracking-wide text-gray-700 dark:text-gray-300 uppercase mb-5 flex items-center gap-2">
                <span>Histórico</span>
                {loadingHistory[selectedInvoice.id] && <span className="chip chip-gray !text-[10px] animate-pulse">Carregando...</span>}
              </h4>
              {(!histories[selectedInvoice.id] && loadingHistory[selectedInvoice.id]) && (
                <p className="text-sm text-gray-500">Obtendo histórico...</p>
              )}
              {histories[selectedInvoice.id] && histories[selectedInvoice.id]!.timeline.length === 0 && !loadingHistory[selectedInvoice.id] && (
                <p className="text-sm text-gray-500">Nenhum evento registrado ainda.</p>
              )}
              {histories[selectedInvoice.id] && histories[selectedInvoice.id]!.timeline.length > 0 && (
                <ol className="relative border-l border-gray-300 dark:border-gray-600 ml-2">
                  {histories[selectedInvoice.id]!.timeline.map(entry => {
                    const isApproval = entry.type === 'approval';
                    const dateLabel = new Date(entry.at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
                    if (isApproval) {
                      const approval = entry as typeof entry & { type: 'approval'; step: string; action: string; comments?: string | null; user:{ id:string; name:string } };
                      return (
                        <li key={approval.id} className="mb-6 ml-4">
                          <div className="absolute w-3 h-3 bg-indigo-500 rounded-full -left-[7px] top-1.5 border border-white dark:border-gray-900" />
                          <div className="flex flex-col gap-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="chip chip-green !px-2 !py-0.5 !text-[10px]">Aprovação</span>
                              <span className="chip chip-indigo !px-2 !py-0.5 !text-[10px]">{approval.step.replace(/_/g,' ').toLowerCase()}</span>
                              <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300">{dateLabel}</span>
                            </div>
                            <p className="text-sm text-gray-800 dark:text-gray-100">
                              <strong>{approval.user?.name || 'Usuário'}</strong> {approval.action === 'aprovado' ? 'aprovou' : approval.action === 'rejeitado' ? 'rejeitou' : approval.action} a etapa
                              {approval.comments ? <span className="text-gray-600"> — {approval.comments}</span> : null}
                            </p>
                          </div>
                        </li>
                      );
                    } else {
                      const log = entry as typeof entry & { type:'log'; action:string; user: { id:string; name:string } | null };
                      return (
                        <li key={log.id} className="mb-6 ml-4">
                          <div className="absolute w-3 h-3 bg-gray-400 dark:bg-gray-500 rounded-full -left-[7px] top-1.5 border border-white dark:border-gray-900" />
                          <div className="flex flex-col gap-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="chip chip-gray !px-2 !py-0.5 !text-[10px]">Log</span>
                              <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300">{dateLabel}</span>
                            </div>
                            <p className="text-sm text-gray-800 dark:text-gray-100">
                              {log.user?.name ? <strong>{log.user.name}</strong> : 'Sistema'} realizou ação: {log.action}
                            </p>
                          </div>
                        </li>
                      );
                    }
                  })}
                </ol>
              )}
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button onClick={closeModal} className="action-btn !h-8 px-3 text-[11px]">Fechar</button>
              <button className="action-btn !h-8 px-3 text-[11px] flex items-center gap-1">📄 <span>Ver Documentos</span></button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
