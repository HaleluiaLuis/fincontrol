import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Verificar se há usuário autenticado (opcional para logout)
    getAuthenticatedUser(request);
    
    // Em uma implementação real, você poderia invalidar o token no servidor
    // Por enquanto, apenas retornamos sucesso
    return NextResponse.json({
      success: true,
      message: 'Logout realizado com sucesso'
    });
  } catch (error) {
    console.error('Erro no logout:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor',
        message: 'Erro ao fazer logout' 
      },
      { status: 500 }
    );
  }
}
