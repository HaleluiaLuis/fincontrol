import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { invalidateDashboardCache } from '@/lib/reportCache';

export async function GET(request: Request){
	try {
		const url = new URL(request.url);
		const page = Math.max(1, Number(url.searchParams.get('page')||'1'));
		const pageSize = Math.min(100, Math.max(1, Number(url.searchParams.get('pageSize')||'20')));
		const type = url.searchParams.get('type');
		const status = url.searchParams.get('status');
		const categoryId = url.searchParams.get('categoryId');
		const from = url.searchParams.get('from');
		const to = url.searchParams.get('to');
				const where: {
					type?: 'RECEITA' | 'DESPESA';
					status?: 'PENDENTE' | 'CONFIRMADA' | 'CANCELADA';
					categoryId?: string;
					date?: { gte?: Date; lte?: Date };
				} = {};
				if(type){
					const t = type.toUpperCase();
					if(t === 'RECEITA' || t === 'DESPESA') where.type = t as 'RECEITA' | 'DESPESA';
				}
				if(status){
					const s = status.toUpperCase();
					if(s === 'PENDENTE' || s === 'CONFIRMADA' || s === 'CANCELADA') where.status = s as 'PENDENTE' | 'CONFIRMADA' | 'CANCELADA';
				}
		if(categoryId) where.categoryId = categoryId;
		if(from || to){
			where.date = {};
			if(from) where.date.gte = new Date(from);
			if(to) where.date.lte = new Date(to);
		}
		const [total, data] = await Promise.all([
			prisma.transaction.count({ where }),
			prisma.transaction.findMany({
				where,
				skip: (page-1)*pageSize,
				take: pageSize,
				orderBy:{ date:'desc' },
				include:{ category:true, supplier:true, createdBy:true }
			})
		]);
		return NextResponse.json({ ok:true, data, meta:{ page, pageSize, total, pages: Math.ceil(total/pageSize) } });
	} catch {
		return NextResponse.json({ ok:false, error:'Erro ao listar transações' }, { status:500 });
	}
}

export async function POST(request: Request){
	try {
		const data = await request.json();
		const { type, description, amount, categoryId, date, supplierId, createdById } = data;
		if(!type || !description || !amount || !categoryId || !date) {
			return NextResponse.json({ ok:false, error:'Campos obrigatórios: type, description, amount, categoryId, date' }, { status:400 });
		}
		const created = await prisma.transaction.create({
			data: {
				type,
				description,
				amount,
				date: new Date(date),
				categoryId,
				supplierId: supplierId || null,
				createdById: createdById || null,
				status: 'CONFIRMADA'
			},
			include:{ category:true, supplier:true }
		});
		// Invalida cache dashboard (fluxo financeiro muda)
		invalidateDashboardCache();
		return NextResponse.json({ ok:true, data: created }, { status:201 });
	} catch {
		return NextResponse.json({ ok:false, error:'Erro ao criar transação' }, { status:500 });
	}
}
