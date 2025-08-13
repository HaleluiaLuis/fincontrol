import { NextRequest } from 'next/server';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export function getAuthenticatedUser(request: NextRequest): AuthenticatedUser | null {
  try {
    // Verificar se há token no header Authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    
    // Para o mock, vamos apenas verificar se o token não está vazio
    // Em uma implementação real, você decodificaria e verificaria o JWT
    if (token && token.length > 10) {
      // Mock do usuário - em uma implementação real, decodificaria do token
      return {
        id: '1',
        email: 'admin@ispb.edu',
        name: 'Administrador Sistema',
        role: 'ADMIN'
      };
    }

    return null;
  } catch (error) {
    console.error('Erro ao verificar autenticação:', error);
    return null;
  }
}

export function createUnauthorizedResponse() {
  return Response.json(
    { 
      success: false, 
      error: 'Token de autenticação não fornecido ou inválido',
      message: 'Acesso não autorizado' 
    },
    { status: 401 }
  );
}
