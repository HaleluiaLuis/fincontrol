export interface PaymentRequestDTO {
	id: string;
	status: string;
	createdAt: string;
	invoiceId?: string;
	requesterId?: string;
	amount?: number;
	description?: string;
}

export interface CreatePaymentRequestDTO {
	supplierId: string;
	categoryId: string;
	description: string;
	amount: number;
	serviceDate?: string;
	dueDate?: string;
	createdById: string;
}

