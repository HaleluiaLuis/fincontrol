import { apiService, ApiResponse } from './api';

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];
  profile?: {
    avatar?: string;
    phone?: string;
    department?: string;
    position?: string;
  };
  preferences?: {
    language: string;
    timezone: string;
    currency: string;
    dateFormat: string;
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
  };
  lastLogin?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresAt: Date;
}

export interface RefreshTokenResponse {
  token: string;
  expiresAt: Date;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: string;
}

export class AuthService {
  private readonly baseEndpoint = '/auth';
  private user: User | null = null;
  private token: string | null = null;

  constructor() {
    // Tentar recuperar dados do localStorage
    this.loadFromStorage();
  }

  // Login
  async login(credentials: AuthCredentials): Promise<ApiResponse<AuthResponse>> {
    const response = await apiService.post<AuthResponse>(`${this.baseEndpoint}/login`, credentials);
    
    if (response.success && response.data) {
      this.setAuthData(response.data);
    }
    
    return response;
  }

  // Logout
  async logout(): Promise<ApiResponse<{ success: boolean }>> {
    try {
      const response = await apiService.post<{ success: boolean }>(`${this.baseEndpoint}/logout`, {});
      return response;
    } finally {
      this.clearAuthData();
    }
  }

  // Refresh token
  async refreshToken(): Promise<ApiResponse<RefreshTokenResponse>> {
    if (typeof window === 'undefined') {
      throw new Error('RefreshToken only available on client side');
    }
    
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiService.post<RefreshTokenResponse>(`${this.baseEndpoint}/refresh`, {
      refreshToken,
    });

    if (response.success && response.data) {
      this.token = response.data.token;
      apiService.setAuthToken(response.data.token);
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('tokenExpiresAt', response.data.expiresAt.toString());
      }
    }

    return response;
  }

  // Solicitar redefinição de senha
  async forgotPassword(request: ForgotPasswordRequest): Promise<ApiResponse<{ message: string }>> {
    return apiService.post<{ message: string }>(`${this.baseEndpoint}/forgot-password`, request);
  }

  // Redefinir senha
  async resetPassword(request: ResetPasswordRequest): Promise<ApiResponse<{ message: string }>> {
    return apiService.post<{ message: string }>(`${this.baseEndpoint}/reset-password`, request);
  }

  // Alterar senha
  async changePassword(request: ChangePasswordRequest): Promise<ApiResponse<{ message: string }>> {
    return apiService.put<{ message: string }>(`${this.baseEndpoint}/change-password`, request);
  }

  // Registrar novo usuário (admin only)
  async register(request: RegisterRequest): Promise<ApiResponse<User>> {
    return apiService.post<User>(`${this.baseEndpoint}/register`, request);
  }

  // Verificar token
  async verifyToken(): Promise<ApiResponse<{ valid: boolean; user?: User }>> {
    const response = await apiService.get<{ valid: boolean; user?: User }>(`${this.baseEndpoint}/verify`);
    
    if (response.success && response.data?.valid && response.data.user) {
      this.user = response.data.user;
      this.saveToStorage();
    }
    
    return response;
  }

  // Obter perfil do usuário
  async getProfile(): Promise<ApiResponse<User>> {
    const response = await apiService.get<User>(`${this.baseEndpoint}/profile`);
    
    if (response.success && response.data) {
      this.user = response.data;
      this.saveToStorage();
    }
    
    return response;
  }

  // Atualizar perfil
  async updateProfile(data: Partial<Pick<User, 'name' | 'profile' | 'preferences'>>): Promise<ApiResponse<User>> {
    const response = await apiService.put<User>(`${this.baseEndpoint}/profile`, data);
    
    if (response.success && response.data) {
      this.user = response.data;
      this.saveToStorage();
    }
    
    return response;
  }

  // Upload de avatar
  async uploadAvatar(file: File): Promise<ApiResponse<{ avatarUrl: string }>> {
    const response = await apiService.upload<{ avatarUrl: string }>(`${this.baseEndpoint}/avatar`, file);
    
    if (response.success && response.data && this.user) {
      this.user.profile = {
        ...this.user.profile,
        avatar: response.data.avatarUrl,
      };
      this.saveToStorage();
    }
    
    return response;
  }

  // Obter sessões ativas
  async getActiveSessions(): Promise<ApiResponse<Array<{
    id: string;
    deviceInfo: string;
    ipAddress: string;
    location?: string;
    lastActivity: Date;
    isCurrent: boolean;
  }>>> {
    return apiService.get<Array<{
      id: string;
      deviceInfo: string;
      ipAddress: string;
      location?: string;
      lastActivity: Date;
      isCurrent: boolean;
    }>>(`${this.baseEndpoint}/sessions`);
  }

  // Encerrar sessão específica
  async revokeSession(sessionId: string): Promise<ApiResponse<{ success: boolean }>> {
    return apiService.delete<{ success: boolean }>(`${this.baseEndpoint}/sessions/${sessionId}`);
  }

  // Encerrar todas as outras sessões
  async revokeAllOtherSessions(): Promise<ApiResponse<{ revokedCount: number }>> {
    return apiService.post<{ revokedCount: number }>(`${this.baseEndpoint}/revoke-all-sessions`, {});
  }

  // Habilitar 2FA
  async enableTwoFactorAuth(): Promise<ApiResponse<{
    qrCodeUrl: string;
    backupCodes: string[];
  }>> {
    return apiService.post<{
      qrCodeUrl: string;
      backupCodes: string[];
    }>(`${this.baseEndpoint}/2fa/enable`, {});
  }

  // Confirmar 2FA
  async confirmTwoFactorAuth(code: string): Promise<ApiResponse<{ enabled: boolean }>> {
    return apiService.post<{ enabled: boolean }>(`${this.baseEndpoint}/2fa/confirm`, { code });
  }

  // Desabilitar 2FA
  async disableTwoFactorAuth(password: string): Promise<ApiResponse<{ disabled: boolean }>> {
    return apiService.post<{ disabled: boolean }>(`${this.baseEndpoint}/2fa/disable`, { password });
  }

  // Gerar novos códigos de backup
  async generateBackupCodes(): Promise<ApiResponse<{ backupCodes: string[] }>> {
    return apiService.post<{ backupCodes: string[] }>(`${this.baseEndpoint}/2fa/backup-codes`, {});
  }

  // Verificar permissão
  hasPermission(permission: string): boolean {
    return this.user?.permissions?.includes(permission) || false;
  }

  // Verificar role
  hasRole(role: string): boolean {
    return this.user?.role === role;
  }

  // Getters
  getCurrentUser(): User | null {
    return this.user;
  }

  isAuthenticated(): boolean {
    return !!this.token && !!this.user;
  }

  getToken(): string | null {
    return this.token;
  }

  // Métodos privados
  private setAuthData(authData: AuthResponse): void {
    this.user = authData.user;
    this.token = authData.token;
    
    // Configurar token no serviço de API
    apiService.setAuthToken(authData.token);
    
    // Salvar no localStorage (apenas no cliente)
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(authData.user));
      localStorage.setItem('token', authData.token);
      localStorage.setItem('refreshToken', authData.refreshToken);
      localStorage.setItem('tokenExpiresAt', authData.expiresAt.toString());
    }
  }

  private clearAuthData(): void {
    this.user = null;
    this.token = null;
    
    // Limpar token do serviço de API
    apiService.clearAuthToken();
    
    // Limpar localStorage (apenas no cliente)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('tokenExpiresAt');
    }
  }

  private loadFromStorage(): void {
    // Verificar se estamos no lado cliente
    if (typeof window === 'undefined') return;
    
    try {
      const user = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      const tokenExpiresAt = localStorage.getItem('tokenExpiresAt');
      
      if (user && token && tokenExpiresAt) {
        const expiresAt = new Date(tokenExpiresAt);
        
        // Verificar se o token não expirou
        if (expiresAt > new Date()) {
          this.user = JSON.parse(user);
          this.token = token;
          apiService.setAuthToken(token);
        } else {
          // Token expirado, limpar dados
          this.clearAuthData();
        }
      }
    } catch (error) {
      console.warn('Erro ao carregar dados do localStorage:', error);
    }
  }

  private saveToStorage(): void {
    if (typeof window !== 'undefined' && this.user) {
      localStorage.setItem('user', JSON.stringify(this.user));
    }
  }

  // Auto-refresh token quando próximo do vencimento
  private async autoRefreshToken(): Promise<void> {
    if (typeof window === 'undefined') return;
    
    const tokenExpiresAt = localStorage.getItem('tokenExpiresAt');
    if (!tokenExpiresAt) return;

    const expiresAt = new Date(tokenExpiresAt);
    const now = new Date();
    const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);

    // Se o token expira em menos de 5 minutos, tentar renovar
    if (expiresAt <= fiveMinutesFromNow) {
      try {
        await this.refreshToken();
      } catch (error) {
        console.error('Failed to auto-refresh token:', error);
        this.clearAuthData();
      }
    }
  }

  // Iniciar verificação periódica do token
  startTokenRefreshTimer(): void {
    // Verificar a cada 1 minuto
    setInterval(() => {
      if (this.isAuthenticated()) {
        this.autoRefreshToken();
      }
    }, 60000);
  }
}

// Instância global do serviço de autenticação
export const authService = new AuthService();
