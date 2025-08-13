import { defaultCategories, mockInvoices, mockSuppliers, mockUsers } from '@/data/mockData';
import { Invoice, ApprovalStep, WorkflowStep } from '@/types';
import { nextInvoiceId, nextApprovalId } from '@/lib/id';

// Clones mutáveis (simples para MVP antes do banco real)
export const categories = [...defaultCategories];
export const invoices: Invoice[] = [...mockInvoices];
export const suppliers = [...mockSuppliers];
export const users = [...mockUsers];

// Funções de fluxo de aprovação (baseadas no hook useInvoices)
export function getNextStep(step: WorkflowStep): { next: WorkflowStep; status: Invoice['status'] } {
  switch(step){
    case 'gabinete_contratacao': return { next: 'presidente', status: 'pendente_presidente' };
    case 'presidente': return { next: 'gabinete_apoio', status: 'aprovada_registro' };
    case 'gabinete_apoio': return { next: 'financas', status: 'pendente_pagamento' };
    case 'financas': return { next: 'concluido', status: 'paga' };
    default: return { next: 'concluido', status: 'paga' };
  }
}

export function approveInvoice(invoiceId: string, userId: string, userName: string, comments?: string) {
  const inv = invoices.find(i=>i.id===invoiceId);
  if(!inv) throw new Error('Fatura não encontrada');
  const approval: ApprovalStep = { id: nextApprovalId(), step: inv.currentStep, action: 'aprovado', userId, userName, comments, timestamp: new Date().toISOString() };
  const { next, status } = getNextStep(inv.currentStep);
  inv.status = status;
  inv.currentStep = next;
  inv.approvalHistory.push(approval);
  inv.updatedAt = new Date().toISOString();
  return inv;
}

export function rejectInvoice(invoiceId: string, userId: string, userName: string, comments: string) {
  const inv = invoices.find(i=>i.id===invoiceId);
  if(!inv) throw new Error('Fatura não encontrada');
  const approval: ApprovalStep = { id: nextApprovalId(), step: inv.currentStep, action: 'rejeitado', userId, userName, comments, timestamp: new Date().toISOString() };
  inv.status = 'rejeitada';
  inv.approvalHistory.push(approval);
  inv.updatedAt = new Date().toISOString();
  return inv;
}

export function createInvoice(data: Partial<Invoice> & { supplierId:string; description:string; amount:number; issueDate:string; dueDate:string; serviceDate:string; category:string; createdBy:string; }) {
  const newInv: Invoice = {
    id: nextInvoiceId(),
    invoiceNumber: data.invoiceNumber || `INV-${Date.now()}`,
    supplierId: data.supplierId,
    description: data.description,
    amount: data.amount,
    issueDate: data.issueDate,
    dueDate: data.dueDate,
    serviceDate: data.serviceDate,
    category: data.category,
    attachments: data.attachments || [],
    status: 'pendente_contratacao',
    currentStep: 'gabinete_contratacao',
    approvalHistory: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: data.createdBy,
  };
  invoices.unshift(newInv);
  return newInv;
}
