'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function UserMenu() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!user) return null;

  const getRoleDisplayName = (role: string) => {
    const roleNames = {
      ADMIN: 'Administrador',
      GABINETE_CONTRATACAO: 'Gabinete Contratação',
      PRESIDENTE: 'Presidente',
      GABINETE_APOIO: 'Gabinete de Apoio',
      FINANCAS: 'Finanças',
      USER: 'Usuário',
      VIEWER: 'Visualizador'
    };
    return roleNames[role as keyof typeof roleNames] || role;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 text-sm bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 p-2 hover:bg-gray-50"
      >
        <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white font-medium text-sm">
            {user.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="hidden md:block text-left">
          <div className="font-medium text-gray-900">{user.name}</div>
          <div className="text-xs text-gray-600">{getRoleDisplayName(user.role)}</div>
        </div>
        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg py-2 z-50 border border-gray-200">
          {/* Informações do usuário */}
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="font-medium text-gray-900">{user.name}</div>
                <div className="text-sm text-gray-600">{user.email}</div>
                <div className="text-xs text-blue-600 font-medium">
                  {getRoleDisplayName(user.role)}
                </div>
              </div>
            </div>
          </div>

          {/* Departamento */}
          <div className="px-4 py-2 border-b border-gray-200">
            <div className="text-xs text-gray-500">Departamento</div>
            <div className="text-sm text-gray-900">{user.profile?.department || 'Não informado'}</div>
          </div>

          {/* Permissões */}
          <div className="px-4 py-2 border-b border-gray-200">
            <div className="text-xs text-gray-500 mb-2">Permissões ({user.permissions.length})</div>
            <div className="max-h-32 overflow-y-auto">
              <div className="grid grid-cols-1 gap-1">
                {user.permissions.slice(0, 6).map((permission) => (
                  <div key={permission} className="text-xs bg-gray-100 rounded px-2 py-1 font-mono">
                    {permission}
                  </div>
                ))}
                {user.permissions.length > 6 && (
                  <div className="text-xs text-gray-500 italic">
                    +{user.permissions.length - 6} mais...
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="py-1">
            <button
              onClick={() => {
                setIsOpen(false);
                // Aqui você pode adicionar navegação para perfil
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <svg className="mr-3 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Meu Perfil
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                // Aqui você pode adicionar navegação para configurações
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <svg className="mr-3 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Configurações
            </button>
            <div className="border-t border-gray-200 my-1"></div>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <svg className="mr-3 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sair
            </button>
          </div>
        </div>
      )}

      {/* Overlay para fechar o menu */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
}
