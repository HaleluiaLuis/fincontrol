import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { RequestStatus, WorkflowStep } from '@prisma/client';
import { invalidateDashboardCache } from '@/lib/reportCache';

export async function POST(request: Request) {
	const body = await request.json();
	const { invoiceId, action, userId, comments } = body as { invoiceId?:string; action?:string; userId?:string; comments?:string };
	if(!invoiceId || !action || !userId) return NextResponse.json({ ok:false, error:'invoiceId, action, userId são requeridos' }, { status:400 });
	try {
		// Verificar existência
		const invoice = await prisma.invoice.findUnique({ where:{ id: invoiceId } });
		if(!invoice) return NextResponse.json({ ok:false, error:'Fatura não encontrada' }, { status:404 });

		// Determinar próximo status e step
		let nextStatus: RequestStatus = invoice.status as RequestStatus;
		let nextStep: WorkflowStep = invoice.currentStep as WorkflowStep;

		const act = action.toLowerCase();
		if(act === 'aprovado' || act === 'aprovado_parcial') {
			// Fluxo simplificado: GABINETE_CONTRATACAO -> PRESIDENTE -> GABINETE_APOIO -> FINANCAS
			switch(invoice.currentStep) {
				case 'GABINETE_CONTRATACAO':
					nextStep = 'PRESIDENTE';
					nextStatus = 'PENDENTE_PRESIDENTE';
					break;
				case 'PRESIDENTE':
					nextStep = 'GABINETE_APOIO';
					nextStatus = 'AUTORIZADA';
					break;
				case 'GABINETE_APOIO':
					nextStep = 'FINANCAS';
					nextStatus = 'PENDENTE_PAGAMENTO';
					break;
				case 'FINANCAS':
					nextStep = 'CONCLUIDO';
					nextStatus = 'PAGA';
					break;
				default:
					break;
			}
		} else if(act === 'rejeitado') {
			nextStatus = 'REJEITADA';
			nextStep = invoice.currentStep as WorkflowStep; // permanece onde rejeitou
		}

		// Cria registro de aprovação
		const approval = await prisma.approval.create({
			data: {
				invoiceId,
				step: invoice.currentStep as WorkflowStep,
				action: act === 'rejeitado' ? 'REJEITADO' : 'APROVADO',
				userId,
				comments,
			}
		});

		const updated = await prisma.invoice.update({
			where:{ id: invoiceId },
			data: { status: nextStatus, currentStep: nextStep },
		});

		await prisma.auditLog.create({ data: {
			action: action.toUpperCase(),
			entity: 'Invoice',
			entityId: invoiceId,
			userId,
			metadata: { comments, fromStatus: invoice.status, toStatus: nextStatus, fromStep: invoice.currentStep, toStep: nextStep, approvalId: approval.id }
		}});

		// Invalida cache de dashboard (status/contagens podem mudar)
		invalidateDashboardCache();
		return NextResponse.json({ ok:true, data: updated });
	} catch {
		return NextResponse.json({ ok:false, error:'Erro ao processar aprovação' }, { status:500 });
	}
}
