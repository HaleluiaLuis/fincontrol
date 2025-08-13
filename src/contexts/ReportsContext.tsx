"use client";
import React, { createContext, useContext, useState, useCallback } from 'react';

interface DashboardSnapshot { totalFaturas:number; pendentes:number; aprovadas:number; pagas:number; valorPendente:number; valorPago:number; }
interface PaymentStatus { pendentes:number; emProcessamento:number; pagos:number; atrasados:number; }

interface ReportsContextValue {
	dashboard?: DashboardSnapshot;
	paymentStatus?: PaymentStatus;
	loading: boolean;
	error: string | null;
	loadDashboard: () => Promise<void>;
	loadPaymentStatus: () => Promise<void>;
}

const ReportsContext = createContext<ReportsContextValue | undefined>(undefined);

export const ReportsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [dashboard, setDashboard] = useState<DashboardSnapshot | undefined>();
	const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | undefined>();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string|null>(null);

	const loadDashboard = useCallback(async () => {
		setLoading(true); setError(null);
		try {
			const res = await fetch('/api/reports/dashboard');
			const json = await res.json();
			if(!res.ok) throw new Error(json.error||'Falha ao carregar dashboard');
			setDashboard(json.data);
		} catch(e){ setError(e instanceof Error? e.message : 'Erro'); }
		finally { setLoading(false); }
	},[]);

	const loadPaymentStatus = useCallback(async () => {
		setLoading(true); setError(null);
		try {
			const res = await fetch('/api/reports/payment-status');
			const json = await res.json();
			if(!res.ok) throw new Error(json.error||'Falha ao carregar status de pagamentos');
			setPaymentStatus(json.data);
		} catch(e){ setError(e instanceof Error? e.message : 'Erro'); }
		finally { setLoading(false); }
	},[]);

	return (
		<ReportsContext.Provider value={{ dashboard, paymentStatus, loading, error, loadDashboard, loadPaymentStatus }}>
			{children}
		</ReportsContext.Provider>
	);
};

export function useReports(){
	const ctx = useContext(ReportsContext);
	if(!ctx) throw new Error('useReports deve ser usado dentro de ReportsProvider');
	return ctx;
}

