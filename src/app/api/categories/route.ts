import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
	try {
		const data = await prisma.category.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } });
		return NextResponse.json({ ok: true, data });
	} catch {
		return NextResponse.json({ ok:false, error:'Erro ao listar categorias' }, { status:500 });
	}
}
