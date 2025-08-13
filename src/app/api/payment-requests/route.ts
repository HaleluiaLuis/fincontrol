import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
	try {
		const data = await prisma.paymentRequest.findMany({
			orderBy:{ createdAt: 'desc' },
			include:{ supplier:true, category:true, createdBy:true, invoice:true }
		});
		return NextResponse.json({ ok:true, data });
	} catch {
		return NextResponse.json({ ok:false, error:'Erro ao listar solicitações' }, { status:500 });
	}
}

export async function POST(request: Request){
	try {
		const body = await request.json();
		const { supplierId, categoryId, description, amount, createdById } = body;
		if(!supplierId || !categoryId || !description || !amount || !createdById) {
			return NextResponse.json({ ok:false, error:'Campos obrigatórios faltando' }, { status:400 });
		}
		const created = await prisma.paymentRequest.create({
			data: {
				supplierId,
				categoryId,
				description,
				amount,
				createdById,
				status: 'PENDENTE',
				currentStep: 'GABINETE_CONTRATACAO'
			},
			include: { supplier:true, category:true, createdBy:true }
		});
		return NextResponse.json({ ok:true, data: created }, { status:201 });
	} catch {
		return NextResponse.json({ ok:false, error:'Erro ao criar solicitação' }, { status:500 });
	}
}
