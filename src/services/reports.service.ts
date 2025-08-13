import { serviceGet, ServiceResult } from './api';

export interface DashboardSnapshot { totalFaturas:number; pendentes:number; aprovadas:number; pagas:number; valorPendente:number; valorPago:number; }
export interface PaymentStatusSummary { pendentes:number; emProcessamento:number; pagos:number; atrasados:number; }

export function getDashboard(): Promise<ServiceResult<DashboardSnapshot>> {
	return serviceGet<DashboardSnapshot>('/api/reports/dashboard');
}

export function getPaymentStatus(): Promise<ServiceResult<PaymentStatusSummary>> {
	return serviceGet<PaymentStatusSummary>('/api/reports/payment-status');
}

// Tipagem parcial do financial summary (expandir conforme necessidade real)
interface FinancialSummaryPartial { totalReceitas:number; totalDespesas:number; saldo:number; }
export function getFinancialSummary(): Promise<ServiceResult<FinancialSummaryPartial>> {
	return serviceGet<FinancialSummaryPartial>('/api/reports/financial');
}

