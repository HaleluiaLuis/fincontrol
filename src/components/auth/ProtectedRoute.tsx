'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Role } from '@/types';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
  requiredRoles?: Role[];
  fallback?: React.ReactNode;
}

export function ProtectedRoute({
  children,
  requiredPermissions = [],
  requiredRoles = [],
  fallback
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Mostrar loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Não autenticado
  if (!isAuthenticated || !user) {
    return null; // useEffect vai redirecionar
  }

  // Verificar roles necessários
  if (requiredRoles.length > 0 && !requiredRoles.includes(user.role as Role)) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-red-100 mb-4">
            <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Acesso Negado</h3>
          <p className="text-sm text-gray-600 mb-4">
            Você não possui as permissões necessárias para acessar esta página.
          </p>
          <p className="text-xs text-gray-500">
            Seu perfil: <span className="font-medium">{user.role}</span>
          </p>
        </div>
      </div>
    );
  }

  // Verificar permissões necessárias
  if (requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every(permission => 
      user.permissions.includes(permission)
    );

    if (!hasAllPermissions) {
      return fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-yellow-100 mb-4">
              <svg className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0-6V9m0 0a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Permissões Insuficientes</h3>
            <p className="text-sm text-gray-600 mb-4">
              Você não possui as permissões necessárias para esta funcionalidade.
            </p>
            <div className="text-xs text-gray-500">
              <p>Permissões necessárias:</p>
              <ul className="mt-1 space-y-1">
                {requiredPermissions.map(permission => (
                  <li key={permission} className="font-mono bg-gray-100 px-2 py-1 rounded">
                    {permission}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}

// Hook para verificar permissões em componentes
export function usePermissions() {
  const { user } = useAuth();
  
  const hasPermission = (permission: string): boolean => {
    return user?.permissions.includes(permission) || false;
  };

  const hasRole = (role: Role): boolean => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: Role[]): boolean => {
    return user ? roles.includes(user.role as Role) : false;
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every(permission => hasPermission(permission));
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  };

  return {
    hasPermission,
    hasRole,
    hasAnyRole,
    hasAllPermissions,
    hasAnyPermission,
    userPermissions: user?.permissions || [],
    userRole: user?.role
  };
}
