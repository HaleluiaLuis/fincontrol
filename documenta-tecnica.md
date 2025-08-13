## Escopo do Sistema

### 1. Visão Geral
O sistema permitirá a gestão completa do ciclo de vida das solicitações de pagamento, incluindo:
- Cadastro e gestão de fornecedores
- Criação e tramitação de solicitações de pagamento
- Validação documental e contratual
- Aprovação hierárquica
- Registro de faturas
- Execução de pagamentos
- Auditoria e relatórios

### 2. Perfis de Usuários e Responsabilidades

#### 2.1 **Gabinete de Contratação**
**Responsabilidades:**
- Receber solicitações de pagamento
- Verificar existência de contratos vigentes
- Validar documentação necessária
- Cadastrar novos fornecedores
- Classificar fornecedores por tipo (serviços/produtos)
- Manter base de dados de fornecedores atualizada
- Iniciar processo de validação das solicitações

**Funcionalidades Específicas:**
- Módulo de cadastro de fornecedores com campos para:
  - Dados fiscais (NIF, razão social, endereço)
  - Categoria (prestador de serviços/fornecedor de produtos)
  - Documentos contratuais
  - Histórico de transações
- Dashboard de solicitações pendentes de validação
- Sistema de alertas para contratos próximos ao vencimento

#### 2.2 **Presidente**
**Responsabilidades:**
- Autorizar solicitações validadas
- Rejeitar solicitações com justificativa
- Solicitar análise adicional quando necessário
- Supervisionar o fluxo geral de aprovações

**Funcionalidades Específicas:**
- Painel executivo com resumo de solicitações pendentes
- Visualização de histórico de decisões
- Relatórios gerenciais de gastos por categoria
- Sistema de delegação temporária de autorização

#### 2.3 **Gabinete de Apoio**
**Responsabilidades:**
- Registrar faturas autorizadas pelo Presidente
- Digitalizar e arquivar documentação
- Manter registro cronológico de todas as faturas
- Preparar documentação para o setor de Finanças

**Funcionalidades Específicas:**
- Módulo de registro de faturas com:
  - Upload de documentos digitalizados
  - Numeração sequencial automática
  - Vinculação com solicitação original
- Sistema de busca avançada de faturas
- Geração de relatórios de faturas registradas

#### 2.4 **Finanças**
**Responsabilidades:**
- Executar pagamentos das solicitações aprovadas
- Registrar comprovantes de pagamento
- Conciliar pagamentos com faturas
- Gerar relatórios financeiros

**Funcionalidades Específicas:**
- Interface de processamento de pagamentos
- Integração com sistema bancário (se aplicável)
- Registro de métodos de pagamento (transferência, cheque, etc.)
- Dashboard de pagamentos pendentes e realizados
- Relatórios de fluxo de caixa

### 3. Fluxo de Trabalho Principal

```
Solicitação Iniciada
    ↓
Gabinete de Contratação (Verifica documentação)
    ↓
Documentação OK? 
    → Sim: Encaminha para Presidente
    → Não: Devolve para Correção
    ↓
Decisão do Presidente
    → Autoriza: Segue para Gabinete de Apoio
    → Rejeita: Solicitação Cancelada
    → Análise: Retorna para Verificação
    ↓
Gabinete de Apoio (Registra Fatura)
    ↓
Finanças (Efetua Pagamento)
    ↓
Processo Concluído
```

### 4. Funcionalidades Gerais do Sistema

#### 4.1 **Módulo de Solicitações**
- Criação de solicitações com anexo de documentos
- Estados: Pendente, Em Análise, Autorizada, Rejeitada, Paga
- Histórico completo de tramitação
- Comentários e justificativas em cada etapa

#### 4.2 **Dashboard e Relatórios**
- Dashboard personalizado por perfil
- Relatórios de:
  - Gastos por período
  - Gastos por fornecedor
  - Tempo médio de tramitação
  - Taxa de aprovação/rejeição
  - Pagamentos pendentes

#### 4.3 **Notificações e Alertas**
- Notificações por email/sistema para:
  - Nova solicitação recebida
  - Solicitação aprovada/rejeitada
  - Pagamento realizado
  - Documentos pendentes

#### 4.4 **Segurança e Auditoria**
- Log de todas as ações realizadas
- Controle de acesso baseado em perfis
- Backup automático de dados
- Trilha de auditoria completa

### 5. Matriz de Permissões Detalhada

| Funcionalidade | Gabinete Contratação | Presidente | Gabinete Apoio | Finanças |
|---|---|---|---|---|
| **Fornecedores** |||||
| Cadastrar | ✅ | ❌ | ❌ | ❌ |
| Editar | ✅ | ❌ | ✅ | ❌ |
| Visualizar | ✅ | ✅ | ✅ | ✅ |
| **Solicitações** |||||
| Criar | ✅ | ❌ | ✅ | ❌ |
| Validar Documentos | ✅ | ❌ | ❌ | ❌ |
| Autorizar | ❌ | ✅ | ❌ | ❌ |
| Visualizar | ✅ | ✅ | ✅ | ✅ |
| **Faturas** |||||
| Registrar | ❌ | ❌ | ✅ | ❌ |
| Editar | ❌ | ❌ | ✅ | ❌ |
| Visualizar | ✅ | ✅ | ✅ | ✅ |
| **Pagamentos** |||||
| Processar | ❌ | ❌ | ❌ | ✅ |
| Visualizar | ✅ | ✅ | ✅ | ✅ |

### 6. Requisitos Técnicos Sugeridos

- **Interface Web Responsiva** para acesso via computador e dispositivos móveis
- **Base de Dados Relacional** para garantir integridade dos dados
- **Sistema de Backup** automático diário
- **Autenticação Segura** com senhas fortes e possibilidade de autenticação em dois fatores
- **API REST** para possíveis integrações futuras
- **Geração de PDFs** para relatórios e comprovantes

### 7. Benefícios Esperados

- **Transparência:** Visibilidade completa do status de cada solicitação
- **Eficiência:** Redução do tempo de tramitação
- **Controle:** Aprovação hierárquica e rastreabilidade total
- **Economia:** Melhor gestão dos recursos financeiros
- **Conformidade:** Documentação completa para auditorias
- **Análise:** Dados para tomada de decisão estratégica

### 8. Permissões por Perfil (Resumo)

| Perfil | Pode Ver | Pode Editar | Pode Autorizar |
|---|---|---|---|
| Gabinete de Apoio | ✅ | ✅ | ❌ |
| Gabinete de Contratação | ✅ | ✅ | ❌ |
| Presidente | ✅ | ❌ | ✅ |
| Finanças | ✅ | ✅ (pagamento) | ❌ |

---

**Documento criado em:** 2025-08-12  
**Autor:** HaleluiaLuis  
**Versão:** 1.0