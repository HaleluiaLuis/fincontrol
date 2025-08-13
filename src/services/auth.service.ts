import { servicePost, ServiceResult } from './api';
import type { AuthUser } from '@/lib/auth';

interface LoginPayload { email: string; }

export async function login(email: string): Promise<ServiceResult<AuthUser>> {
	return servicePost<AuthUser, LoginPayload>('/api/auth/login', { email });
}

export async function logout(): Promise<ServiceResult<{ success: true }>> {
	return servicePost<{ success: true }, Record<string, never>>('/api/auth/logout', {} as Record<string, never>);
}

