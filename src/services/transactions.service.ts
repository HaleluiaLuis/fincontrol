import { serviceGet, servicePost, ServiceResult } from './api';
import type { Transaction } from '@/types';

export function listTransactions(): Promise<ServiceResult<Transaction[]>> {
	return serviceGet<Transaction[]>('/api/transactions');
}

export type CreateTransactionInput = Pick<Transaction,'type'|'description'|'amount'|'category'|'date'> & { status?: Transaction['status']; };
export function createTransaction(data: CreateTransactionInput): Promise<ServiceResult<Transaction>> {
	return servicePost<Transaction, CreateTransactionInput>('/api/transactions', data);
}

