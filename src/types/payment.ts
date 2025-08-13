export interface PaymentDTO {
	id: string;
	invoiceId?: string;
	amount?: number;
	method?: string;
	status?: string;
	createdAt: string;
}

export interface CreatePaymentDTO {
	invoiceId?: string;
	amount: number;
	method?: string;
	reference?: string;
}

