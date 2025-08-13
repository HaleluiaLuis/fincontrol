import { NextRequest, NextResponse } from 'next/server';
import { ROLE_REQUIREMENTS, PROTECTED_PREFIXES, Role } from '@/lib/rbac';

// Cookie definido no auth.ts (MVP). Futuro: substituir por cookie HttpOnly (ex: 'fc_session') contendo token ou id de sessão persistida.
const SESSION_COOKIE = 'fc_session';

// Rotas totalmente públicas (inclui prefixos)
const PUBLIC_PATHS = [
	'/login',
	'/api/health',
	'/api/auth/login',
	'/api/auth/logout'
];

// Prefixos protegidos (páginas principais da aplicação)
// PROTECTED_PREFIXES importado

// ROLE_REQUIREMENTS agora importado de '@/lib/rbac'

// Interface anterior removida (não usada neste estágio)

// Em middleware (edge) evitamos chamar Prisma; apenas checamos presença de cookie.
// Validação profunda acontece via /api/auth/verify nas páginas/client side.
// Removido lookup servidor; apenas indica autenticado se cookie existir
function hasSession(token: string | undefined){ return !!token; }

function isPublicPath(pathname: string): boolean {
	if(pathname === '/') return false; // homepage tratada conforme necessidade
	return PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'));
}

function needsProtection(pathname: string): boolean {
	return PROTECTED_PREFIXES.some(pref => pathname === pref || pathname.startsWith(pref + '/'));
}

export async function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;

	// Tratar raiz explicitamente: exigir sessão; se autenticado, redirecionar para dashboard
	if(pathname === '/') {
		const token = req.cookies.get(SESSION_COOKIE)?.value;
		if(!hasSession(token)) {
			const loginUrl = new URL('/login', req.url);
			loginUrl.searchParams.set('redirect', '/dashboard');
			return NextResponse.redirect(loginUrl);
		}
		// Já autenticado: evitar mostrar versão pública da raiz (se existir) e centralizar no dashboard
		return NextResponse.redirect(new URL('/dashboard', req.url));
	}

	// Ignorar assets estáticos e _next
	if (pathname.startsWith('/_next') || pathname.startsWith('/favicon') || pathname.startsWith('/assets') || pathname.match(/\.(png|jpg|jpeg|svg|ico|css|js|webp)$/)) {
		return NextResponse.next();
	}

	if (isPublicPath(pathname)) {
		return NextResponse.next();
	}

	if (!needsProtection(pathname)) {
		return NextResponse.next();
	}

		const token = req.cookies.get(SESSION_COOKIE)?.value;
		if (!hasSession(token)) {
		// API -> 401 JSON, Página -> redirect login
		if (pathname.startsWith('/api/')) {
			return NextResponse.json({ ok:false, error:'Não autenticado' }, { status: 401 });
		}
		const loginUrl = new URL('/login', req.url);
		loginUrl.searchParams.set('redirect', pathname);
		return NextResponse.redirect(loginUrl);
	}

		// Verificação de role (MVP baseada em cookie fc_role). Normaliza para minúsculas para evitar mismatch com enums Prisma.
		const rawRole = req.cookies.get('fc_role')?.value;
		const role = rawRole ? rawRole.toLowerCase() as Role : undefined;
		for (const pref of PROTECTED_PREFIXES) {
			if(pathname === pref || pathname.startsWith(pref + '/')) {
				const allowed = ROLE_REQUIREMENTS[pref];
				if(allowed && role && !allowed.includes(role)) {
					if (pathname.startsWith('/api/')) {
						return NextResponse.json({ ok:false, error:'Acesso negado' }, { status:403 });
					}
					return NextResponse.redirect(new URL('/dashboard?denied=1', req.url));
				}
				break;
			}
		}


	return NextResponse.next();
}

// Matcher: aplica em tudo exceto arquivos estáticos (Next ignora _next automaticamente se não listarmos)
export const config = {
	matcher: [
		'/((?!_next/static|_next/image|favicon.ico|assets/|.*\.(?:png|jpg|jpeg|svg|ico|css|js|webp)).*)'
	]
};

