import { serviceGet, servicePost, ServiceResult } from './api';

export interface Payment { id:string; invoiceId?:string; amount?:number; method?:string; status?:string; createdAt:string; [k:string]:unknown }

export function listPayments(): Promise<ServiceResult<Payment[]>> {
	return serviceGet<Payment[]>('/api/payments');
}

export type CreatePaymentInput = Partial<Payment> & { amount:number; };
export function createPayment(data: CreatePaymentInput): Promise<ServiceResult<Payment>> {
	return servicePost<Payment, CreatePaymentInput>('/api/payments', data);
}

