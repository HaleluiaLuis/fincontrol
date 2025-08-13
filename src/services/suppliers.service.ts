import { serviceGet, servicePost, ServiceResult } from './api';
import type { Supplier } from '@/types';

export function listSuppliers(): Promise<ServiceResult<Supplier[]>> {
	return serviceGet<Supplier[]>('/api/suppliers');
}

export type CreateSupplierInput = Partial<Supplier> & { name:string; taxId:string; };
export function createSupplier(data: CreateSupplierInput): Promise<ServiceResult<Supplier>> {
	return servicePost<Supplier, CreateSupplierInput>('/api/suppliers', data);
}

