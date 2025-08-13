import type { Invoice } from '@/types';
import { serviceGet, servicePost, ServiceResult } from './api';

// Listar faturas
export function listInvoices(): Promise<ServiceResult<Invoice[]>> {
	return serviceGet<Invoice[]>('/api/invoices');
}

// Criar fatura
export type CreateInvoiceInput = Partial<Invoice> & { supplierId:string; description:string; amount:number; issueDate:string; dueDate:string; serviceDate:string; category:string; createdBy:string; };
export function createInvoice(data: CreateInvoiceInput): Promise<ServiceResult<Invoice>> {
	return servicePost<Invoice, CreateInvoiceInput>('/api/invoices', data);
}

// Aprovar fatura (usa rota approvals)
export interface ApproveInvoiceInput { invoiceId:string; userId:string; userName:string; }
interface ApprovePayload extends ApproveInvoiceInput { action:'approve'; }
export function approveInvoiceSvc(data: ApproveInvoiceInput): Promise<ServiceResult<Invoice>> {
	const payload: ApprovePayload = { action:'approve', ...data };
	return servicePost<Invoice, ApprovePayload>('/api/approvals', payload);
}

export interface RejectInvoiceInput extends ApproveInvoiceInput { comments:string; }
interface RejectPayload extends RejectInvoiceInput { action:'reject'; }
export function rejectInvoiceSvc(data: RejectInvoiceInput): Promise<ServiceResult<Invoice>> {
	const payload: RejectPayload = { action:'reject', ...data };
	return servicePost<Invoice, RejectPayload>('/api/approvals', payload);
}

