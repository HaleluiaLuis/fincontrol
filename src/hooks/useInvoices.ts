// Hook para gerenciar faturas
'use client';

import { useState } from 'react';
import { Invoice, InvoiceFormData, ApprovalStep, WorkflowStep } from '@/types';
import { mockInvoices } from '@/data/mockData';
import { nextInvoiceId, nextApprovalId } from '@/lib/id';

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);

  // Função para adicionar nova fatura
  const addInvoice = (invoiceData: InvoiceFormData) => {
    const newInvoice: Invoice = {
      ...invoiceData,
      id: nextInvoiceId(),
      status: 'pendente_contratacao',
      currentStep: 'gabinete_contratacao',
      approvalHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setInvoices(prev => [newInvoice, ...prev]);
  };

  // Função para aprovar uma fatura
  const approveInvoice = (invoiceId: string, userId: string, userName: string, comments?: string) => {
    setInvoices(prev => 
      prev.map(invoice => {
        if (invoice.id !== invoiceId) return invoice;

        const approvalStep: ApprovalStep = {
          id: nextApprovalId(),
          step: invoice.currentStep,
          action: 'aprovado',
          userId,
          userName,
          comments,
          timestamp: new Date().toISOString()
        };

        // Determinar próximo passo
        let nextStep: WorkflowStep;
        let nextStatus: Invoice['status'];

        switch (invoice.currentStep) {
          case 'gabinete_contratacao':
            nextStep = 'presidente';
            nextStatus = 'pendente_presidente';
            break;
          case 'presidente':
            nextStep = 'gabinete_apoio';
            nextStatus = 'aprovada_registro';
            break;
          case 'gabinete_apoio':
            nextStep = 'financas';
            nextStatus = 'pendente_pagamento';
            break;
          case 'financas':
            nextStep = 'concluido';
            nextStatus = 'paga';
            break;
          default:
            nextStep = 'concluido';
            nextStatus = 'paga';
        }

        return {
          ...invoice,
          status: nextStatus,
          currentStep: nextStep,
          approvalHistory: [...invoice.approvalHistory, approvalStep],
          updatedAt: new Date().toISOString()
        };
      })
    );
  };

  // Função para rejeitar uma fatura
  const rejectInvoice = (invoiceId: string, userId: string, userName: string, comments: string) => {
    setInvoices(prev => 
      prev.map(invoice => {
        if (invoice.id !== invoiceId) return invoice;

        const approvalStep: ApprovalStep = {
          id: nextApprovalId(),
          step: invoice.currentStep,
          action: 'rejeitado',
          userId,
          userName,
          comments,
          timestamp: new Date().toISOString()
        };

        return {
          ...invoice,
          status: 'rejeitada',
          approvalHistory: [...invoice.approvalHistory, approvalStep],
          updatedAt: new Date().toISOString()
        };
      })
    );
  };

  // Função para registrar fatura no Gabinete de Apoio
  const registerInvoice = (invoiceId: string, userId: string, userName: string, comments?: string) => {
    setInvoices(prev => 
      prev.map(invoice => {
        if (invoice.id !== invoiceId) return invoice;

        const approvalStep: ApprovalStep = {
          id: nextApprovalId(),
          step: 'gabinete_apoio',
          action: 'aprovado',
          userId,
          userName,
          comments,
          timestamp: new Date().toISOString()
        };

        return {
          ...invoice,
          status: 'registrada',
          currentStep: 'financas',
          approvalHistory: [...invoice.approvalHistory, approvalStep],
          updatedAt: new Date().toISOString()
        };
      })
    );
  };

  // Função para marcar como paga
  const markAsPaid = (invoiceId: string, userId: string, userName: string, comments?: string) => {
    setInvoices(prev => 
      prev.map(invoice => {
        if (invoice.id !== invoiceId) return invoice;

        const approvalStep: ApprovalStep = {
          id: nextApprovalId(),
          step: 'financas',
          action: 'aprovado',
          userId,
          userName,
          comments,
          timestamp: new Date().toISOString()
        };

        return {
          ...invoice,
          status: 'paga',
          currentStep: 'concluido',
          approvalHistory: [...invoice.approvalHistory, approvalStep],
          updatedAt: new Date().toISOString()
        };
      })
    );
  };

  // Estatísticas das faturas
  const getInvoicesSummary = () => {
    const totalPendentes = invoices.filter(i => 
      ['pendente_contratacao', 'pendente_presidente', 'aprovada_registro', 'registrada', 'pendente_pagamento'].includes(i.status)
    ).length;

    const totalAprovadas = invoices.filter(i => 
      ['registrada', 'pendente_pagamento'].includes(i.status)
    ).length;

    const totalPagas = invoices.filter(i => i.status === 'paga').length;

    const valorPendente = invoices
      .filter(i => ['pendente_contratacao', 'pendente_presidente', 'aprovada_registro'].includes(i.status))
      .reduce((sum, i) => sum + i.amount, 0);

    const valorAprovado = invoices
      .filter(i => ['registrada', 'pendente_pagamento'].includes(i.status))
      .reduce((sum, i) => sum + i.amount, 0);

    const valorPago = invoices
      .filter(i => i.status === 'paga')
      .reduce((sum, i) => sum + i.amount, 0);

    return {
      totalPendentes,
      totalAprovadas,
      totalPagas,
      valorPendente,
      valorAprovado,
      valorPago
    };
  };

  // Filtrar por status
  const getInvoicesByStatus = (status: Invoice['status']) => {
    return invoices.filter(invoice => invoice.status === status);
  };

  // Filtrar por etapa do fluxo
  const getInvoicesByStep = (step: WorkflowStep) => {
    return invoices.filter(invoice => invoice.currentStep === step);
  };

  // Filtrar faturas vencidas
  const getOverdueInvoices = () => {
    const today = new Date();
    return invoices.filter(invoice => {
      const dueDate = new Date(invoice.dueDate);
      return dueDate < today && !['paga', 'cancelada', 'rejeitada'].includes(invoice.status);
    });
  };

  return {
    invoices,
    addInvoice,
    approveInvoice,
    rejectInvoice,
    registerInvoice,
    markAsPaid,
    getInvoicesSummary,
    getInvoicesByStatus,
    getInvoicesByStep,
    getOverdueInvoices,
  };
}
