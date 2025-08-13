import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

export const runtime = 'nodejs';

const COOKIE_NAME = 'fc_session';
const SESSION_HOURS = 8;

function generateToken(){
	return crypto.randomBytes(24).toString('base64url');
}

export async function POST(request: Request) {
	const { email } = await request.json();
	if(!email) return NextResponse.json({ ok:false, error:'Email requerido' }, { status:400 });
	// Localiza usuário - sem criação automática (endurecido)
	const user = await prisma.user.findUnique({ where:{ email } });
	if(!user){
		return NextResponse.json({ ok:false, error:'Usuário não autorizado' }, { status:401 });
	}
	// Revogar sessões antigas expiradas (limpeza simples)
	await prisma.session.deleteMany({ where:{ userId: user.id, OR:[{ expiresAt: { lt: new Date() } }, { revokedAt: { not: null } }] } });
	const token = generateToken();
	const expiresAt = new Date(Date.now() + SESSION_HOURS*60*60*1000);
	await prisma.session.create({ data: { userId: user.id, token, expiresAt } });

	// Resposta normalizada com chave 'data' para compatibilidade com wrapper api()
	const res = NextResponse.json({ ok:true, data: { id:user.id, name:user.name, email:user.email, role:user.role, department:user.department } });
	res.cookies.set(COOKIE_NAME, token, {
		httpOnly: true,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
		path: '/',
		maxAge: SESSION_HOURS * 60 * 60
	});
	// Cookie adicional com role para RBAC no middleware (MVP; reforçar com assinatura futuramente)
	res.cookies.set('fc_role', user.role, {
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
		path: '/',
		maxAge: SESSION_HOURS * 60 * 60
	});
	return res;
}
