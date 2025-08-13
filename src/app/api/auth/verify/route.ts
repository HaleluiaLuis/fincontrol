import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';

export async function GET(){
	const store = await cookies();
	const token = store.get('fc_session')?.value;
	if(!token) return NextResponse.json({ ok:false, stage:'no-cookie', error:'Sem sessão' }, { status:401 });
	// Limpeza preguiçosa de sessões expiradas
	try { await prisma.session.deleteMany({ where:{ expiresAt: { lt: new Date() } } }); } catch {}
	const session = await prisma.session.findUnique({ where:{ token }, include:{ user:true } });
	if(!session) return NextResponse.json({ ok:false, stage:'not-found', error:'Sessão inválida' }, { status:401 });
	if(session.expiresAt < new Date()) return NextResponse.json({ ok:false, stage:'expired', error:'Expirada' }, { status:401 });
	if(session.revokedAt) return NextResponse.json({ ok:false, stage:'revoked', error:'Revogada' }, { status:401 });
	return NextResponse.json({ ok:true, data: { id:session.user.id, name:session.user.name, email:session.user.email, role:session.user.role } });
}
