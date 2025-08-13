import { describe, it, expect } from 'vitest';
import { canAccess, ROLE_REQUIREMENTS, Role } from '@/lib/rbac';

// Rotas a validar (usar prefixos principais)
const routes = Object.keys(ROLE_REQUIREMENTS);

// Conjunto de roles
const roles: Role[] = ['admin','presidente','financas','gabinete_contratacao','gabinete_apoio','user','viewer'];

describe('RBAC matrix', () => {
  it('admin deve acessar todas as rotas', () => {
    for(const r of routes){
      expect(canAccess('admin', r)).toBe(true);
    }
  });

  it('perfis específicos respeitam restrições', () => {
    // presidente não deve acessar fornecedores/pagamentos/transacoes/configuracoes
    expect(canAccess('presidente','/fornecedores')).toBe(false);
    expect(canAccess('presidente','/pagamentos')).toBe(false);
    expect(canAccess('presidente','/transacoes')).toBe(false);
    expect(canAccess('presidente','/configuracoes')).toBe(false);
    expect(canAccess('presidente','/relatorios')).toBe(true);

    // financas deve acessar pagamentos, relatorios, transacoes; não fornecedores, solicitacoes, configuracoes
    expect(canAccess('financas','/pagamentos')).toBe(true);
    expect(canAccess('financas','/relatorios')).toBe(true);
    expect(canAccess('financas','/transacoes')).toBe(true);
    expect(canAccess('financas','/fornecedores')).toBe(false);
    expect(canAccess('financas','/solicitacoes')).toBe(false);
    expect(canAccess('financas','/configuracoes')).toBe(false);

    // gabinete_contratacao: sem pagamentos, relatorios, transacoes, configuracoes
    expect(canAccess('gabinete_contratacao','/faturas')).toBe(true);
    expect(canAccess('gabinete_contratacao','/fornecedores')).toBe(true);
    expect(canAccess('gabinete_contratacao','/solicitacoes')).toBe(true);
    expect(canAccess('gabinete_contratacao','/pagamentos')).toBe(false);
    expect(canAccess('gabinete_contratacao','/relatorios')).toBe(false);
    expect(canAccess('gabinete_contratacao','/transacoes')).toBe(false);
    expect(canAccess('gabinete_contratacao','/configuracoes')).toBe(false);

    // gabinete_apoio: similar a contratacao
    expect(canAccess('gabinete_apoio','/fornecedores')).toBe(true);
    expect(canAccess('gabinete_apoio','/faturas')).toBe(true);
    expect(canAccess('gabinete_apoio','/solicitacoes')).toBe(true);
    expect(canAccess('gabinete_apoio','/pagamentos')).toBe(false);
    expect(canAccess('gabinete_apoio','/relatorios')).toBe(false);
    expect(canAccess('gabinete_apoio','/transacoes')).toBe(false);
    expect(canAccess('gabinete_apoio','/configuracoes')).toBe(false);

    // user e viewer apenas dashboard
    for(const r of routes){
      if(r === '/dashboard'){
        expect(canAccess('user', r)).toBe(true);
        expect(canAccess('viewer', r)).toBe(true);
      } else {
        expect(canAccess('user', r)).toBe(false);
        expect(canAccess('viewer', r)).toBe(false);
      }
    }
  });

  it('rota não protegida deve permitir todos', () => {
    for(const role of roles){
      expect(canAccess(role, '/qualquer-coisa-publica')).toBe(true);
    }
  });

  it('sem role não acessa prefixos protegidos', () => {
    for(const r of routes){
      expect(canAccess(undefined, r)).toBe(false);
    }
  });
});
