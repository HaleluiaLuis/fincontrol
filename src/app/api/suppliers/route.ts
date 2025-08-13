import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { invalidateDashboardCache } from '@/lib/reportCache';

export async function GET(request: Request) {
	try {
		const url = new URL(request.url);
		const page = Math.max(1, Number(url.searchParams.get('page')||'1'));
		const pageSize = Math.min(100, Math.max(1, Number(url.searchParams.get('pageSize')||'20')));
		const status = url.searchParams.get('status');
		const type = url.searchParams.get('type');
		const search = url.searchParams.get('q');
			const where: {
				status?: 'ATIVO' | 'INATIVO' | 'PENDENTE' | 'BLOQUEADO';
				supplierType?: 'PRESTADOR_SERVICOS' | 'FORNECEDOR_PRODUTOS' | 'PESSOA_FISICA' | 'PESSOA_JURIDICA';
				OR?: { name?: { contains:string; mode:'insensitive' }; taxId?: { contains:string; mode:'insensitive' } }[];
			} = {};
			if(status){
				const s = status.toUpperCase();
				if(s==='ATIVO'||s==='INATIVO'||s==='PENDENTE'||s==='BLOQUEADO') where.status = s;
			}
				if(type){
					const t = type.toUpperCase();
					if(t==='PRESTADOR_SERVICOS'||t==='FORNECEDOR_PRODUTOS'||t==='PESSOA_FISICA'||t==='PESSOA_JURIDICA') where.supplierType = t as typeof where.supplierType;
				}
		if(search){
			where.OR = [
				{ name: { contains: search, mode:'insensitive' } },
				{ taxId: { contains: search, mode:'insensitive' } }
			];
		}
		const [total, data] = await Promise.all([
			prisma.supplier.count({ where }),
			prisma.supplier.findMany({
				where,
				skip: (page-1)*pageSize,
				take: pageSize,
				orderBy:{ createdAt:'desc' }
			})
		]);
		return NextResponse.json({ ok:true, data, meta:{ page, pageSize, total, pages: Math.ceil(total/pageSize) } });
	} catch {
		return NextResponse.json({ ok:false, error:'Erro ao listar fornecedores' }, { status:500 });
	}
}

export async function POST(request: Request){
	try {
		const body = await request.json();
		if(!body.name || !body.taxId) return NextResponse.json({ ok:false, error:'Nome e NIF são obrigatórios' }, { status:400 });
		const created = await prisma.supplier.create({ data: {
			name: body.name,
			taxId: body.taxId,
			email: body.email || null,
			phone: body.phone || null,
			address: body.address || null,
			bankAccount: body.bankAccount || null,
			supplierType: body.supplierType || 'PESSOA_JURIDICA',
			status: body.status || 'ATIVO',
			contactPerson: body.contactPerson || null,
			website: body.website || null,
			notes: body.notes || null,
		}});
		// Fornecedores influenciam possíveis agregações futuras do dashboard
		invalidateDashboardCache();
		return NextResponse.json({ ok:true, data: created }, { status:201 });
	} catch (err) {
		if(typeof err === 'object' && err && 'code' in err && (err as { code?: string }).code === 'P2002') {
			return NextResponse.json({ ok:false, error:'Fornecedor com este NIF já existe.' }, { status:409 });
		}
		return NextResponse.json({ ok:false, error:'Erro ao criar fornecedor' }, { status:500 });
	}
}
