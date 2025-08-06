// Dados iniciais para o MVP - simulando um banco de dados
import { Transaction, Category, Supplier, Invoice, User } from '@/types';

export const defaultCategories: Category[] = [
  // Categorias de Despesas
  {
    id: 'desp-001',
    name: 'Recursos Humanos',
    type: 'despesa',
    color: '#ef4444',
    description: 'Salários, benefícios e encargos sociais'
  },
  {
    id: 'desp-002',
    name: 'Infraestrutura',
    type: 'despesa',
    color: '#f59e0b',
    description: 'Manutenção, energia, água, internet'
  },
  {
    id: 'desp-003',
    name: 'Material Didático',
    type: 'despesa',
    color: '#8b5cf6',
    description: 'Livros, equipamentos, softwares educacionais'
  },
  {
    id: 'desp-004',
    name: 'Laboratórios',
    type: 'despesa',
    color: '#ec4899',
    description: 'Equipamentos e materiais para laboratórios'
  },
  {
    id: 'desp-005',
    name: 'Administrativo',
    type: 'despesa',
    color: '#6b7280',
    description: 'Papelaria, serviços administrativos, seguros'
  },
  {
    id: 'desp-006',
    name: 'Marketing',
    type: 'despesa',
    color: '#14b8a6',
    description: 'Publicidade, eventos, material promocional'
  },
  {
    id: 'desp-007',
    name: 'Serviços Terceirizados',
    type: 'despesa',
    color: '#f97316',
    description: 'Limpeza, segurança, consultoria'
  },

  // Categorias de Receitas
  {
    id: 'rec-001',
    name: 'Mensalidades',
    type: 'receita',
    color: '#22c55e',
    description: 'Pagamentos de mensalidades dos estudantes'
  },
  {
    id: 'rec-002',
    name: 'Matrícula',
    type: 'receita',
    color: '#3b82f6',
    description: 'Taxas de matrícula e inscrição'
  },
  {
    id: 'rec-003',
    name: 'Cursos Extras',
    type: 'receita',
    color: '#f59e0b',
    description: 'Cursos de extensão e capacitação'
  },
  {
    id: 'rec-004',
    name: 'Parcerias',
    type: 'receita',
    color: '#8b5cf6',
    description: 'Receitas de parcerias e convênios'
  },
  {
    id: 'rec-005',
    name: 'Subsídios',
    type: 'receita',
    color: '#06b6d4',
    description: 'Apoios governamentais e doações'
  }
];

export const mockSuppliers: Supplier[] = [
  {
    id: 'supp-001',
    name: 'Construtora Luanda Sul',
    email: 'contato@luandasul.ao',
    phone: '+244 923 456 789',
    address: 'Rua Amílcar Cabral, 123, Luanda',
    taxId: '5417038913',
    bankAccount: 'BAI-0123456789',
    status: 'ativo',
    contact: {
      email: 'contato@luandasul.ao',
      phone: '+244 923 456 789',
      address: 'Rua Amílcar Cabral, 123, Luanda'
    },
    createdAt: '2024-01-15T08:00:00Z'
  },
  {
    id: 'supp-002', 
    name: 'Tecnologia & Sistemas Lda',
    email: 'vendas@tecsistemas.ao',
    phone: '+244 912 345 678',
    address: 'Av. 4 de Fevereiro, 567, Luanda',
    taxId: '5417038914',
    bankAccount: 'BFA-9876543210',
    status: 'ativo',
    contact: {
      email: 'vendas@tecsistemas.ao',
      phone: '+244 912 345 678',
      address: 'Av. 4 de Fevereiro, 567, Luanda'
    },
    createdAt: '2024-02-10T10:30:00Z'
  },
  {
    id: 'supp-003',
    name: 'Fornecimentos Educacionais Angola',
    email: 'comercial@feducangola.ao', 
    phone: '+244 934 567 890',
    address: 'Rua da Missão, 89, Benguela',
    taxId: '5417038915',
    bankAccount: 'BIC-5544332211',
    status: 'pendente',
    contact: {
      email: 'comercial@feducangola.ao',
      phone: '+244 934 567 890',
      address: 'Rua da Missão, 89, Benguela'
    },
    createdAt: '2024-01-20T14:15:00Z'
  },
  {
    id: 'supp-004',
    name: 'Serviços de Limpeza Bie',
    email: 'admin@limpezabie.ao',
    phone: '+244 945 678 901',
    address: 'Bairro Sede, Kuito, Bié',
    taxId: '5417038916', 
    bankAccount: 'SOL-1122334455',
    status: 'ativo',
    contact: {
      email: 'admin@limpezabie.ao',
      phone: '+244 945 678 901',
      address: 'Bairro Sede, Kuito, Bié'
    },
    createdAt: '2024-03-05T09:45:00Z'
  }
];

export const mockUsers: User[] = [
  {
    id: 'user-001',
    name: 'João Silva',
    email: 'j.silva@ispobie.ao',
    role: 'gabinete_contratacao',
    department: 'Gabinete de Contratação'
  },
  {
    id: 'user-002',
    name: 'Maria Santos',
    email: 'm.santos@ispobie.ao',
    role: 'presidente',
    department: 'Presidência'
  },
  {
    id: 'user-003',
    name: 'Pedro Costa',
    email: 'p.costa@ispobie.ao',
    role: 'gabinete_apoio',
    department: 'Gabinete de Apoio'
  },
  {
    id: 'user-004',
    name: 'Ana Ferreira',
    email: 'a.ferreira@ispobie.ao',
    role: 'financas',
    department: 'Finanças'
  }
];

export const mockInvoices: Invoice[] = [
  {
    id: 'inv-001',
    invoiceNumber: 'TE-2025-001',
    supplierId: 'sup-001',
    description: 'Licenças de software educacional',
    amount: 1250000.00, // 1.25M AOA
    issueDate: '2025-02-01',
    dueDate: '2025-03-01',
    serviceDate: '2025-01-15',
    category: 'desp-003',
    attachments: ['fatura_te_001.pdf', 'contrato_licencas.pdf'],
    status: 'pendente_presidente',
    currentStep: 'presidente',
    approvalHistory: [
      {
        id: 'app-001',
        step: 'gabinete_contratacao',
        action: 'aprovado',
        userId: 'user-001',
        userName: 'João Silva',
        comments: 'Documentação verificada e aprovada. Contrato válido.',
        timestamp: '2025-02-02T10:30:00Z'
      }
    ],
    createdAt: '2025-02-01T09:00:00Z',
    updatedAt: '2025-02-02T10:30:00Z',
    createdBy: 'user-001'
  },
  {
    id: 'inv-002',
    invoiceNumber: 'EB-2025-002',
    supplierId: 'sup-002',
    description: 'Fornecimento de energia elétrica - Janeiro 2025',
    amount: 600000.00, // 600K AOA
    issueDate: '2025-02-01',
    dueDate: '2025-02-15',
    serviceDate: '2025-01-31',
    category: 'desp-002',
    attachments: ['fatura_energia_jan.pdf'],
    status: 'paga',
    currentStep: 'concluido',
    approvalHistory: [
      {
        id: 'app-002',
        step: 'gabinete_contratacao',
        action: 'aprovado',
        userId: 'user-001',
        userName: 'João Silva',
        comments: 'Fatura de energia recorrente aprovada.',
        timestamp: '2025-02-01T11:00:00Z'
      },
      {
        id: 'app-003',
        step: 'presidente',
        action: 'aprovado',
        userId: 'user-002',
        userName: 'Maria Santos',
        comments: 'Autorizado para pagamento.',
        timestamp: '2025-02-01T14:00:00Z'
      },
      {
        id: 'app-004',
        step: 'gabinete_apoio',
        action: 'aprovado',
        userId: 'user-003',
        userName: 'Pedro Costa',
        comments: 'Fatura registrada no sistema.',
        timestamp: '2025-02-02T09:00:00Z'
      }
    ],
    createdAt: '2025-02-01T08:30:00Z',
    updatedAt: '2025-02-02T16:00:00Z',
    createdBy: 'user-001'
  },
  {
    id: 'inv-003',
    invoiceNumber: 'LB-2025-003',
    supplierId: 'sup-003',
    description: 'Serviços de limpeza - Fevereiro 2025',
    amount: 400000.00, // 400K AOA
    issueDate: '2025-02-05',
    dueDate: '2025-03-05',
    serviceDate: '2025-02-28',
    category: 'desp-007',
    attachments: ['fatura_limpeza_fev.pdf'],
    status: 'pendente_contratacao',
    currentStep: 'gabinete_contratacao',
    approvalHistory: [],
    createdAt: '2025-02-05T10:00:00Z',
    updatedAt: '2025-02-05T10:00:00Z',
    createdBy: 'user-001'
  }
];

export const sampleTransactions: Transaction[] = [
  {
    id: 'trans-001',
    type: 'receita',
    description: 'Mensalidades Janeiro 2025',
    amount: 7500000, // 7.5M AOA
    category: 'rec-001',
    date: '2025-01-15',
    status: 'confirmada',
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z'
  },
  {
    id: 'trans-002',
    type: 'despesa',
    description: 'Salários Professores Janeiro',
    amount: 4000000, // 4M AOA
    category: 'desp-001',
    date: '2025-01-30',
    status: 'confirmada',
    createdAt: '2025-01-30T14:00:00Z',
    updatedAt: '2025-01-30T14:00:00Z'
  },
  {
    id: 'trans-003',
    type: 'despesa',
    description: 'Fornecimento de energia elétrica - Janeiro 2025',
    amount: 600000, // 600K AOA
    category: 'desp-002',
    date: '2025-02-01',
    status: 'confirmada',
    createdAt: '2025-02-01T09:00:00Z',
    updatedAt: '2025-02-02T16:00:00Z'
  },
  {
    id: 'trans-004',
    type: 'receita',
    description: 'Matrículas Semestre 2025.1',
    amount: 2500000, // 2.5M AOA
    category: 'rec-002',
    date: '2025-02-10',
    status: 'confirmada',
    createdAt: '2025-02-10T11:00:00Z',
    updatedAt: '2025-02-10T11:00:00Z'
  }
];
