// Dados iniciais mínimos para o MVP
import { Category, Supplier, User, Invoice, Transaction } from '@/types';

export const defaultCategories: Category[] = [
  {
    id: 'desp-001',
    name: 'Recursos Humanos',
    type: 'DESPESA',
    color: '#ef4444',
    description: 'Salários, benefícios e encargos sociais',
    isActive: true,
    createdAt: new Date()
  },
  {
    id: 'desp-002',
    name: 'Infraestrutura',
    type: 'DESPESA',
    color: '#f59e0b',
    description: 'Manutenção, energia, água, internet',
    isActive: true,
    createdAt: new Date()
  },
  {
    id: 'desp-003',
    name: 'Material Didático',
    type: 'DESPESA',
    color: '#8b5cf6',
    description: 'Livros, equipamentos, softwares educacionais',
    isActive: true,
    createdAt: new Date()
  },
  {
    id: 'rec-001',
    name: 'Mensalidades',
    type: 'RECEITA',
    color: '#22c55e',
    description: 'Pagamentos de mensalidades dos estudantes',
    isActive: true,
    createdAt: new Date()
  },
  {
    id: 'rec-002',
    name: 'Matrícula',
    type: 'RECEITA',
    color: '#3b82f6',
    description: 'Taxas de matrícula e inscrição',
    isActive: true,
    createdAt: new Date()
  }
];

// Arrays vazios para evitar erros
export const mockSuppliers: Supplier[] = [];
export const mockUsers: User[] = [];
export const mockInvoices: Invoice[] = [];
export const mockTransactions: Transaction[] = [];
export const sampleTransactions: Transaction[] = [];
