import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rotas que não precisam de autenticação
const publicRoutes = ['/login', '/api/auth/login', '/api/health'];

// Rotas da API que precisam de autenticação
const protectedApiRoutes = [
  '/api/users',
  '/api/transactions',
  '/api/invoices',
  '/api/suppliers',
  '/api/categories',
  '/api/payment-requests',
  '/api/approvals',
  '/api/payments'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Permitir arquivos estáticos
  if (pathname.startsWith('/_next') || pathname.includes('.')) {
    return NextResponse.next();
  }

  // Permitir rotas públicas
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Verificar autenticação para rotas protegidas
  const authUser = request.cookies.get('auth-user')?.value;
  
  // Se não há usuário logado e não é rota pública
  if (!authUser && !publicRoutes.includes(pathname)) {
    // Se é rota API protegida, retornar 401
    if (protectedApiRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }
    
    // Se é rota de página, redirecionar para login
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
  ],
};
