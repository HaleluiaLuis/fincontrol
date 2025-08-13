// Camada base de serviço usando lib/api (fetch wrapper)
import { api as baseApi } from '@/lib/api';

export interface ServiceResult<T> { data?: T; error?: string; ok: boolean; status: number; }

export async function serviceGet<T>(url: string, query?: Record<string, string | number | boolean | undefined>): Promise<ServiceResult<T>> {
	const res = await baseApi<T>(url, { method:'GET', query });
	return { ok: res.ok, data: res.data as T | undefined, error: res.error, status: res.status };
}

export async function servicePost<T, B>(url: string, body: B): Promise<ServiceResult<T>> {
	const res = await baseApi<T, B>(url, { method:'POST', json: body });
	return { ok: res.ok, data: res.data as T | undefined, error: res.error, status: res.status };
}

export async function servicePut<T, B>(url: string, body: B): Promise<ServiceResult<T>> {
	const res = await baseApi<T, B>(url, { method:'PUT', json: body });
	return { ok: res.ok, data: res.data as T | undefined, error: res.error, status: res.status };
}

export async function serviceDelete<T>(url: string): Promise<ServiceResult<T>> {
	const res = await baseApi<T>(url, { method:'DELETE' });
	return { ok: res.ok, data: res.data as T | undefined, error: res.error, status: res.status };
}

