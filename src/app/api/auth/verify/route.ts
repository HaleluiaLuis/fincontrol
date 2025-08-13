import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Verificar se há token no header Authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Token não fornecido',
          data: { valid: false } 
        },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    // Para o mock, vamos apenas verificar se o token não está vazio
    // Em uma implementação real, você verificaria a validade do JWT
    if (token && token.length > 10) {
      // Mock do usuário - em uma implementação real, decodificaria do token
      const mockUser = {
        id: '1',
        email: 'admin@ispbie.ao',
        name: 'Administrador Sistema',
        role: 'ADMIN',
        permissions: ['VIEW_DASHBOARD', 'MANAGE_USERS', 'APPROVE_PAYMENTS'],
        profile: {
          avatar: undefined,
          phone: '+244 900 000 000',
          department: 'Administração',
          position: 'Administrador do Sistema'
        }
      };

      return NextResponse.json({
        success: true,
        data: { 
          valid: true,
          user: mockUser
        },
        message: 'Token válido'
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Token inválido',
          data: { valid: false } 
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor',
        data: { valid: false } 
      },
      { status: 500 }
    );
  }
}
