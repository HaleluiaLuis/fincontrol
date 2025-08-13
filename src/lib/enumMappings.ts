// Utilitários de mapeamento entre enums Prisma e labels / status frontend

export const requestStatusLabels: Record<string, string> = {
  PENDENTE: 'Pendente',
  EM_VALIDACAO: 'Em Validação',
  PENDENTE_PRESIDENTE: 'P/ Presidente',
  AUTORIZADA: 'Autorizada',
  REJEITADA: 'Rejeitada',
  REGISTRADA: 'Registrada',
  PENDENTE_PAGAMENTO: 'P/ Pagamento',
  PAGA: 'Paga',
  CANCELADA: 'Cancelada'
};

export const workflowStepLabels: Record<string, string> = {
  GABINETE_CONTRATACAO: 'Gab. Contratação',
  PRESIDENTE: 'Presidente',
  GABINETE_APOIO: 'Gab. Apoio',
  FINANCAS: 'Finanças',
  CONCLUIDO: 'Concluído'
};

export const supplierStatusLabels: Record<string, string> = {
  ATIVO: 'Ativo',
  INATIVO: 'Inativo',
  PENDENTE: 'Pendente',
  BLOQUEADO: 'Bloqueado'
};

export const paymentMethodLabels: Record<string, string> = {
  TRANSFERENCIA_BANCARIA: 'Transferência',
  CHEQUE: 'Cheque',
  NUMERARIO: 'Numeração',
  PIX: 'Pix',
  OUTROS: 'Outros'
};

export function mapEnumLabel<T extends string>(mapping: Record<string,string>, value?: T | null): string {
  if(!value) return '';
  return mapping[value] || value;
}
