export type SupplierCategory = 'SERVICOS' | 'PRODUTOS' | 'MISTO';
export type SupplierStatus = 'ATIVO' | 'INATIVO' | 'PENDENTE' | 'SUSPENSO';
export type ContractStatus = 'VIGENTE' | 'VENCIDO' | 'SUSPENSO' | 'RESCINDIDO';

export interface SupplierContact {
  id: string;
  name: string;
  position: string;
  phone: string;
  email: string;
  isPrimary: boolean;
}

export interface SupplierContract {
  id: string;
  contractNumber: string;
  description: string;
  startDate: Date;
  endDate: Date;
  value: number;
  status: ContractStatus;
  documentPath?: string;
  observations?: string;
}

export interface SupplierDocument {
  id: string;
  name: string;
  type: 'NIF' | 'ALVARA' | 'CERTIDAO' | 'CONTRATO' | 'OUTRO';
  filePath: string;
  uploadDate: Date;
  expiryDate?: Date;
  isRequired: boolean;
}

export interface SupplierTransaction {
  id: string;
  date: Date;
  type: 'PAGAMENTO' | 'FATURA' | 'CONTRATO';
  description: string;
  value: number;
  reference: string;
  status: 'PENDENTE' | 'CONCLUIDO' | 'CANCELADO';
}

export interface Supplier {
  id: string;
  
  // Dados básicos
  companyName: string;
  tradeName?: string;
  nif: string;
  category: SupplierCategory;
  status: SupplierStatus;
  
  // Endereço
  address: {
    street: string;
    city: string;
    province: string;
    postalCode?: string;
    country: string;
  };
  
  // Contatos
  phone: string;
  email: string;
  website?: string;
  contacts: SupplierContact[];
  
  // Dados bancários
  bankInfo?: {
    bankName: string;
    accountNumber: string;
    iban?: string;
    swift?: string;
  };
  
  // Documentos
  documents: SupplierDocument[];
  
  // Contratos
  contracts: SupplierContract[];
  
  // Histórico
  transactions: SupplierTransaction[];
  
  // Metadados
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  lastModifiedBy: string;
  
  // Observações
  observations?: string;
  internalNotes?: string;
}

export interface CreateSupplierData {
  companyName: string;
  tradeName?: string;
  nif: string;
  category: SupplierCategory;
  address: {
    street: string;
    city: string;
    province: string;
    postalCode?: string;
    country: string;
  };
  phone: string;
  email: string;
  website?: string;
  bankInfo?: {
    bankName: string;
    accountNumber: string;
    iban?: string;
    swift?: string;
  };
  observations?: string;
}

export interface UpdateSupplierData extends Partial<CreateSupplierData> {
  id: string;
  status?: SupplierStatus;
  internalNotes?: string;
}

export interface SupplierFilters {
  search?: string;
  category?: SupplierCategory;
  status?: SupplierStatus;
  province?: string;
  contractStatus?: ContractStatus;
  createdFrom?: Date;
  createdTo?: Date;
}

export interface SupplierStats {
  total: number;
  active: number;
  inactive: number;
  pending: number;
  byCategory: {
    servicos: number;
    produtos: number;
    misto: number;
  };
  byProvince: Array<{
    province: string;
    count: number;
  }>;
  contractsExpiringSoon: number;
  totalTransactionValue: number;
}
