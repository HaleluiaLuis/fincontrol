'use client';

import { usePermissions } from '@/components/auth/ProtectedRoute';
import { Role } from '@/types';
import { ReactNode } from 'react';

interface ConditionalRenderProps {
  children: ReactNode;
  requiredPermissions?: string[];
  requiredRoles?: Role[];
  fallback?: ReactNode;
  mode?: 'all' | 'any'; // all = todas as permissões necessárias, any = pelo menos uma
}

export function ConditionalRender({
  children,
  requiredPermissions = [],
  requiredRoles = [],
  fallback = null,
  mode = 'all'
}: ConditionalRenderProps) {
  const { hasRole, hasAllPermissions, hasAnyPermission, hasAnyRole } = usePermissions();

  // Verificar roles
  if (requiredRoles.length > 0) {
    const roleCheck = mode === 'all' 
      ? requiredRoles.every(role => hasRole(role))
      : hasAnyRole(requiredRoles);
    
    if (!roleCheck) {
      return <>{fallback}</>;
    }
  }

  // Verificar permissões
  if (requiredPermissions.length > 0) {
    const permissionCheck = mode === 'all'
      ? hasAllPermissions(requiredPermissions)
      : hasAnyPermission(requiredPermissions);
    
    if (!permissionCheck) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
}

// Hook para facilitar o uso
export function useConditionalRender() {
  const permissions = usePermissions();

  const canRender = (options: {
    requiredPermissions?: string[];
    requiredRoles?: Role[];
    mode?: 'all' | 'any';
  }) => {
    const { requiredPermissions = [], requiredRoles = [], mode = 'all' } = options;

    // Verificar roles
    if (requiredRoles.length > 0) {
      const roleCheck = mode === 'all' 
        ? requiredRoles.every(role => permissions.hasRole(role))
        : permissions.hasAnyRole(requiredRoles);
      
      if (!roleCheck) return false;
    }

    // Verificar permissões
    if (requiredPermissions.length > 0) {
      const permissionCheck = mode === 'all'
        ? permissions.hasAllPermissions(requiredPermissions)
        : permissions.hasAnyPermission(requiredPermissions);
      
      if (!permissionCheck) return false;
    }

    return true;
  };

  return { canRender, ...permissions };
}
