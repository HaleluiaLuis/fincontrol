import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';

const COOKIE_NAME = 'fc_session';

export async function POST() {
	const cookieStore = await cookies();
	const token = cookieStore.get(COOKIE_NAME)?.value;
	if(token){
		await prisma.session.updateMany({ where:{ token }, data:{ revokedAt: new Date() } });
	}
	const res = NextResponse.json({ ok:true, loggedOut:true });
	// Deletar cookie com mesmos atributos seguros usados no set
	res.cookies.set(COOKIE_NAME, '', {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
		expires: new Date(0),
		maxAge: 0
	});
	res.cookies.set('fc_role', '', {
		path: '/',
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
		expires: new Date(0),
		maxAge: 0
	});
	return res;
}
