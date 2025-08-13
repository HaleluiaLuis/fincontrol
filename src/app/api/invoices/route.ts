import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { invalidateDashboardCache } from '@/lib/reportCache';

export async function GET(request: Request) {
	try {
		const url = new URL(request.url);
		const page = Math.max(1, Number(url.searchParams.get('page')||'1'));
		const pageSize = Math.min(100, Math.max(1, Number(url.searchParams.get('pageSize')||'20')));
		const status = url.searchParams.get('status');
		const supplierId = url.searchParams.get('supplierId');
		const search = url.searchParams.get('q');
			const where: {
				status?: 'PENDENTE'|'EM_VALIDACAO'|'PENDENTE_PRESIDENTE'|'AUTORIZADA'|'REGISTRADA'|'PENDENTE_PAGAMENTO'|'PAGA'|'CANCELADA'|'REJEITADA';
				supplierId?: string;
				description?: { contains: string; mode: 'insensitive' };
			} = {};
			if(status){
				const s = status.toUpperCase();
				if(['PENDENTE','EM_VALIDACAO','PENDENTE_PRESIDENTE','AUTORIZADA','REGISTRADA','PENDENTE_PAGAMENTO','PAGA','CANCELADA','REJEITADA'].includes(s)) where.status = s as typeof where.status;
			}
		if(supplierId) where.supplierId = supplierId;
		if(search) where.description = { contains: search, mode:'insensitive' };
		const [total, data] = await Promise.all([
			prisma.invoice.count({ where }),
			prisma.invoice.findMany({
				where,
				skip: (page-1)*pageSize,
				take: pageSize,
				orderBy: { createdAt: 'desc' },
				include: { supplier: true, category: true, payment: true }
			})
		]);
		return NextResponse.json({ ok:true, data, meta:{ page, pageSize, total, pages: Math.ceil(total/pageSize) } });
		} catch {
		return NextResponse.json({ ok:false, error:'Erro ao listar faturas' }, { status:500 });
	}
}

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { supplierId, categoryId, description, amount, issueDate, serviceDate, dueDate, registeredById, attachments } = body;
		if(!supplierId || !categoryId || !description || !amount || !issueDate || !serviceDate || !dueDate || !registeredById) {
			return NextResponse.json({ ok:false, error:'Campos obrigatórios incompletos' }, { status:400 });
		}
		const invoiceNumber = `INV-${Date.now()}`;
		const created = await prisma.invoice.create({
			data: {
				invoiceNumber,
				supplierId,
				categoryId,
				description,
				amount,
				issueDate: new Date(issueDate),
				serviceDate: new Date(serviceDate),
				dueDate: new Date(dueDate),
				registeredById,
				attachments: Array.isArray(attachments)? attachments : undefined,
			},
			include: { supplier: true, category: true }
		});
		// Invalida cache do dashboard pois métricas podem mudar
		invalidateDashboardCache();
		return NextResponse.json({ ok:true, data: created }, { status:201 });
		} catch {
		return NextResponse.json({ ok:false, error:'Erro ao criar fatura' }, { status:500 });
	}
}
