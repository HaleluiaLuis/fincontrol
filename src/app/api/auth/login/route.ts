import { NextRequest, NextResponse } from 'next/server';
import { Role } from '@/types';

interface LoginRequest {
  email: string;
  password: string;
}

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Mock de usuários para desenvolvimento
const MOCK_USERS: AuthUser[] = [
  {
    id: '1',
    name: 'Administrador Sistema',
    email: 'admin@ispb.edu',
    role: 'ADMIN',
    department: 'TI',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Gabinete Contratação',
    email: 'contratacao@ispb.edu',
    role: 'GABINETE_CONTRATACAO',
    department: 'Contratação',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Presidente ISPB',
    email: 'presidente@ispb.edu',
    role: 'PRESIDENTE',
    department: 'Presidência',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    name: 'Gabinete de Apoio',
    email: 'apoio@ispb.edu',
    role: 'GABINETE_APOIO',
    department: 'Apoio Administrativo',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    name: 'Finanças ISPB',
    email: 'financas@ispb.edu',
    role: 'FINANCAS',
    department: 'Finanças',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();
    const { email, password } = body;

    // Validar entrada
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    // Simular delay de autenticação
    await new Promise(resolve => setTimeout(resolve, 500));

    // Buscar usuário
    const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Usuário desativado' },
        { status: 401 }
      );
    }

    // Mock de verificação de senha
    // Em produção, use bcrypt ou similar
    if (password !== '123456') {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    // Gerar token JWT simulado para desenvolvimento
    const token = `mock-jwt-${Date.now()}-${user.id}`;
    const refreshToken = `mock-refresh-${Date.now()}-${user.id}`;
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

    // Retornar dados no formato esperado pelo serviço
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: [
        'read:dashboard',
        'write:transactions',
        'read:reports',
        user.role === 'ADMIN' ? 'admin:all' : 'user:basic'
      ].filter(Boolean),
      profile: {
        avatar: undefined,
        phone: undefined,
        department: user.department,
        position: user.role
      }
    };

    return NextResponse.json({
      success: true,
      data: {
        user: userData,
        token: token,
        refreshToken: refreshToken,
        expiresAt: expiresAt
      },
      message: 'Login realizado com sucesso'
    });

  } catch (error) {
    console.error('Erro na API de login:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'API de Autenticação FinControl',
    endpoints: {
      POST: 'Login do usuário',
      credentials: {
        admin: { email: 'admin@ispb.edu', password: '123456' },
        contratacao: { email: 'contratacao@ispb.edu', password: '123456' },
        presidente: { email: 'presidente@ispb.edu', password: '123456' },
        apoio: { email: 'apoio@ispb.edu', password: '123456' },
        financas: { email: 'financas@ispb.edu', password: '123456' }
      }
    }
  });
}
