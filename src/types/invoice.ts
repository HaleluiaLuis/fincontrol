import type { WorkflowStep, ApprovalStep } from './index';

export interface InvoiceLite {
	id: string;
	invoiceNumber: string;
	supplierId: string;
	category: string;
	amount: number;
	status: string; // usando string genérica no mock; alinhar com InvoiceStatus depois
	dueDate: string;
}

export interface InvoiceFull extends InvoiceLite {
	description: string;
	issueDate: string;
	serviceDate: string;
	attachments: string[];
	currentStep: WorkflowStep;
	approvalHistory: ApprovalStep[];
	createdAt: string;
	updatedAt: string;
	createdBy: string;
}

