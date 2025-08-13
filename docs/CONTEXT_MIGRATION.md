# 🔄 Guia de Migração de Contextos - API Real

## 📋 Status das Migrações

### ✅ Concluído
- **ReportsContext** - Migrado para `reportsService`
- **AuthContext** - Migrado para `authService`

### 🔄 Próximo
- **InvoicesContext** 
- **PaymentsContext**
- **SuppliersContext** 
- **TransactionsContext**

---

## 🧾 InvoicesContext Migration

### Estrutura Atual vs Nova
```typescript
// ANTES (dados mockados)
const [invoices, setInvoices] = useState<Invoice[]>([]);

// DEPOIS (API real)
import { invoicesService, InvoiceFilters } from '@/services';
const [invoices, setInvoices] = useState<Invoice[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
```

### Funções a Migrar

#### 1. Listar Faturas
```typescript
// ANTES
const loadInvoices = () => {
  setInvoices(mockInvoices);
};

// DEPOIS
const loadInvoices = async (filters?: InvoiceFilters, page = 1, limit = 10) => {
  setLoading(true);
  setError(null);
  try {
    const response = await invoicesService.getInvoices(page, limit, filters);
    setInvoices(response.data.data);
  } catch (err) {
    setError(getErrorMessage(err));
  } finally {
    setLoading(false);
  }
};
```

#### 2. Criar Fatura
```typescript
// DEPOIS
const createInvoice = async (data: CreateInvoiceData) => {
  setLoading(true);
  try {
    const response = await invoicesService.createInvoice(data);
    setInvoices(prev => [response.data, ...prev]);
    return response.data;
  } catch (err) {
    setError(getErrorMessage(err));
    throw err;
  } finally {
    setLoading(false);
  }
};
```

#### 3. Aprovar Fatura
```typescript
const approveInvoice = async (id: string, comment?: string) => {
  try {
    const response = await invoicesService.approveInvoice(id, comment);
    setInvoices(prev => prev.map(inv => 
      inv.id === id ? response.data : inv
    ));
  } catch (err) {
    setError(getErrorMessage(err));
  }
};
```

---

## 💰 PaymentsContext Migration

### Funções Principais

#### 1. Listar Pagamentos
```typescript
const loadPayments = async (filters?: PaymentFilters, page = 1) => {
  setLoading(true);
  try {
    const response = await paymentsService.getPayments(page, 10, filters);
    setPayments(response.data.data);
  } catch (err) {
    setError(getErrorMessage(err));
  } finally {
    setLoading(false);
  }
};
```

#### 2. Processar Pagamento
```typescript
const processPayment = async (id: string, transactionId: string) => {
  try {
    const response = await paymentsService.processPayment(id, transactionId);
    setPayments(prev => prev.map(payment => 
      payment.id === id ? response.data : payment
    ));
  } catch (err) {
    setError(getErrorMessage(err));
  }
};
```

#### 3. Agendar Pagamento
```typescript
const schedulePayment = async (id: string, scheduledDate: Date) => {
  try {
    const response = await paymentsService.schedulePayment(id, scheduledDate);
    setPayments(prev => prev.map(payment => 
      payment.id === id ? response.data : payment
    ));
  } catch (err) {
    setError(getErrorMessage(err));
  }
};
```

---

## 🏢 SuppliersContext Migration

### Funções Avançadas

#### 1. Validar CNPJ
```typescript
const validateCNPJ = async (cnpj: string) => {
  try {
    const response = await suppliersService.validateCNPJ(cnpj);
    return response.data;
  } catch (err) {
    setError(getErrorMessage(err));
    return { valid: false, errors: [getErrorMessage(err)] };
  }
};
```

#### 2. Upload de Documento
```typescript
const uploadDocument = async (supplierId: string, file: File, type: string) => {
  try {
    const response = await suppliersService.uploadDocument(supplierId, file, type);
    // Atualizar fornecedor com novo documento
    loadSuppliers();
    return response.data;
  } catch (err) {
    setError(getErrorMessage(err));
    throw err;
  }
};
```

---

## 💸 TransactionsContext Migration

### Funcionalidades Avançadas

#### 1. Categorização Automática
```typescript
const autoCategorizeTrandction = async (id: string) => {
  try {
    const response = await transactionsService.autoCategorizeTrandction(id);
    return response.data;
  } catch (err) {
    setError(getErrorMessage(err));
  }
};
```

#### 2. Importar Transações
```typescript
const importTransactions = async (file: File, format: 'CSV' | 'EXCEL' | 'OFX') => {
  setLoading(true);
  try {
    const response = await transactionsService.importTransactions(file, format);
    loadTransactions(); // Recarregar lista
    return response.data;
  } catch (err) {
    setError(getErrorMessage(err));
    throw err;
  } finally {
    setLoading(false);
  }
};
```

---

## 🎯 Padrão de Migração

### 1. Estados Base
```typescript
const [data, setData] = useState<T[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [pagination, setPagination] = useState({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0
});
```

### 2. Hook de Service
```typescript
import { useServices, getErrorMessage } from '@/services';

export function useContextName() {
  const services = useServices();
  // ... estados e funções
}
```

### 3. Tratamento de Erro Padrão
```typescript
const handleApiCall = async (apiCall: () => Promise<any>) => {
  setLoading(true);
  setError(null);
  try {
    const result = await apiCall();
    return result;
  } catch (err) {
    const message = getErrorMessage(err);
    setError(message);
    throw err;
  } finally {
    setLoading(false);
  }
};
```

### 4. Estados de Loading por Ação
```typescript
const [loadingStates, setLoadingStates] = useState({
  loading: false,
  creating: false,
  updating: false,
  deleting: false,
  approving: false
});

const setSpecificLoading = (key: keyof typeof loadingStates, value: boolean) => {
  setLoadingStates(prev => ({ ...prev, [key]: value }));
};
```

---

## ⚡ Próximos Passos

### 1. Ordem de Migração
1. **InvoicesContext** (já tem tela funcional)
2. **PaymentsContext** (relacionado com faturas)  
3. **SuppliersContext** (usado pelas faturas)
4. **TransactionsContext** (base do sistema)

### 2. Testes após Migração
- [ ] Verificar todas as telas continuam funcionando
- [ ] Testar estados de loading
- [ ] Validar tratamento de erros
- [ ] Confirmar paginação
- [ ] Testar filtros e busca

### 3. Melhorias a Implementar
- [ ] Cache local com React Query
- [ ] Retry automático para falhas
- [ ] Optimistic updates
- [ ] Sincronização em tempo real
- [ ] Notificações de sucesso/erro

---

**🎯 Objetivo**: Completar migração de todos os contextos para APIs reais mantendo toda funcionalidade existente e adicionando estados de loading/erro apropriados.
