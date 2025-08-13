import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Lista usuários reais do banco (exclui campos sensíveis como password)
export async function GET() {
	try {
		const users = await prisma.user.findMany({
			select: { id: true, name: true, email: true, role: true, department: true, isActive: true, createdAt: true }
		});
		return NextResponse.json({ ok: true, data: users });
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : 'Erro desconhecido';
		return NextResponse.json({ ok: false, error: 'Falha ao obter usuários', details: message }, { status: 500 });
	}
}
