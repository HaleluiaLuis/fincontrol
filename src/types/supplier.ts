export interface SupplierLite {
	id: string;
	name: string;
	taxId: string;
	status: 'ativo' | 'inativo' | 'pendente' | string; // inclui possíveis futuros
	createdAt: string;
}

export interface SupplierFull extends SupplierLite {
	email?: string;
	phone?: string;
	address?: string;
	bankAccount?: string;
	contact?: {
		email: string;
		phone: string;
		address: string;
	};
}

