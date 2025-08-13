import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
	try {
		const data = await prisma.payment.findMany({
			orderBy: { createdAt: 'desc' },
			include: { invoice: { include: { supplier: true } }, processedBy: true }
		});
		return NextResponse.json({ ok:true, data });
	} catch {
		return NextResponse.json({ ok:false, error:'Erro ao listar pagamentos' }, { status:500 });
	}
}

export async function POST(request: Request){
	try {
		const body = await request.json();
		const { invoiceId, amount, paidAt, method, processedById } = body;
		if(!invoiceId || !amount || !paidAt || !processedById) {
			return NextResponse.json({ ok:false, error:'Campos obrigatórios: invoiceId, amount, paidAt, processedById' }, { status:400 });
		}
		const created = await prisma.payment.create({
			data: {
				invoiceId,
				amount,
				paidAt: new Date(paidAt),
				method: method || 'TRANSFERENCIA_BANCARIA',
				processedById,
				reference: body.reference || null,
				bankAccount: body.bankAccount || null,
				notes: body.notes || null
			},
			include: { invoice: { include: { supplier: true } }, processedBy: true }
		});
		return NextResponse.json({ ok:true, data: created }, { status:201 });
	} catch {
		return NextResponse.json({ ok:false, error:'Erro ao criar pagamento' }, { status:500 });
	}
}
