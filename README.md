# FinControl - Sistema de Controle de Custos

Sistema de controle financeiro desenvolvido para o **Instituto Superior Politécnico do Bie**, criado como MVP (Produto Mínimo Viável) para gestão de receitas, despesas e controle orçamentário.

## 🏫 Sobre o Projeto

O FinControl é uma aplicação web moderna desenvolvida em Next.js que permite ao Instituto Superior Politécnico do Bie gerenciar suas finanças de forma eficiente e organizada.

### Funcionalidades Principais

- **Dashboard Financeiro**: Visão geral com resumo de receitas, despesas e saldo atual
- **Gestão de Transações**: Cadastro, edição e exclusão de receitas e despesas
- **Sistema de Faturas**: Controle completo de faturas com fluxo hierárquico de aprovação
- **Fluxo de Aprovação**: Sistema personalizado seguindo a hierarquia institucional
- **Categorização**: Sistema de categorias específicas para instituições educacionais
- **Relatórios**: Visualização de transações e faturas por período e categoria
- **Interface Responsiva**: Funciona perfeitamente em desktop e dispositivos móveis
- **Moeda**: Valores em Kwanza Angolano (AOA)

### Categorias Pré-configuradas

**Despesas:**
- Recursos Humanos (salários, benefícios)
- Infraestrutura (energia, água, internet, manutenção)
- Material Didático (livros, softwares educacionais)
- Laboratórios (equipamentos científicos)
- Administrativo (papelaria, seguros)
- Marketing (publicidade, eventos)

**Receitas:**
- Mensalidades dos estudantes
- Taxas de matrícula e inscrição
- Cursos de extensão
- Parcerias e convênios
- Subsídios governamentais

## 🚀 Tecnologias Utilizadas

- **Frontend**: Next.js 15 com App Router
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Componentes**: React 19
- **Build Tool**: Turbopack (para desenvolvimento mais rápido)

## 📋 Fluxo de Aprovação de Faturas

O sistema implementa um fluxo hierárquico personalizado para aprovação de faturas:

1. **Fornecedor** → Entrega fatura após prestação de serviço
2. **Gabinete de Contratação** → Recebe, verifica se há contrato/documentação, inicia validação
3. **Presidente** → Autoriza ou não a continuidade do processo
4. **Gabinete de Apoio** → Registra a fatura autorizada  
5. **Finanças** → Efetua o pagamento
6. **Sistema** → Registra, controla e atualiza os estados e valores pagos/pendentes

### Estados das Faturas

- **Pendente Contratação**: Aguardando verificação do Gabinete de Contratação
- **Pendente Presidente**: Aguardando autorização do Presidente  
- **Aprovada - Aguarda Registro**: Aprovada pelo Presidente, aguardando registro
- **Registrada**: Registrada no Gabinete de Apoio
- **Pendente Pagamento**: Enviada para o departamento de Finanças
- **Paga**: Pagamento efetuado com sucesso
- **Rejeitada**: Rejeitada em qualquer etapa do processo
- **Cancelada**: Fatura cancelada

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn

## 🛠️ Instalação e Execução

1. **Clone o repositório** (se aplicável) ou navegue até a pasta do projeto

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Execute o projeto em modo desenvolvimento**:
   ```bash
   npm run dev
   ```

4. **Acesse a aplicação**:
   Abra [http://localhost:3000](http://localhost:3000) no seu navegador

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router do Next.js
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página inicial (Dashboard)
├── components/            # Componentes React
│   ├── dashboard/         # Componentes do dashboard
│   ├── transactions/      # Componentes de transações
│   └── ui/               # Componentes de UI reutilizáveis
├── data/                 # Dados mock para desenvolvimento
├── hooks/                # Custom hooks
└── types/                # Definições de tipos TypeScript
```

## 💡 Como Usar

### Adicionar Nova Transação

1. Clique no botão "Nova Transação" no header
2. Preencha os dados:
   - **Tipo**: Receita ou Despesa
   - **Categoria**: Selecione uma categoria apropriada
   - **Descrição**: Descrição detalhada da transação
   - **Valor**: Valor em AOA (Kwanza Angolano)
   - **Data**: Data da transação
   - **Status**: Pendente, Confirmada ou Cancelada
3. Clique em "Adicionar Transação"

### Gestão de Faturas

1. Acesse "Gestão de Faturas" no menu principal
2. Visualize o resumo de faturas por status
3. Use os botões de ação para:
   - **Ver Detalhes**: Visualizar informações completas e fluxo de aprovação
   - **Aprovar**: Avançar a fatura para a próxima etapa (conforme seu perfil)
   - **Rejeitar**: Rejeitar a fatura com comentários explicativos
4. Acompanhe o progresso no **Fluxo de Aprovação**

### Visualizar Resumo Financeiro

O dashboard principal mostra:
- **Total de Receitas**: Soma de todas as receitas confirmadas
- **Total de Despesas**: Soma de todas as despesas confirmadas
- **Saldo Atual**: Diferença entre receitas e despesas

### Gerenciar Transações

- **Visualizar**: Todas as transações são listadas na tabela principal
- **Excluir**: Use o botão "Excluir" na linha da transação desejada
- **Filtrar**: As transações são ordenadas por data (mais recentes primeiro)

## 🎯 Próximas Funcionalidades (Roadmap)

- [ ] Integração com banco de dados
- [ ] Sistema de autenticação
- [ ] Relatórios avançados com gráficos
- [ ] Exportação de dados (PDF, Excel)
- [ ] Sistema de aprovação de despesas
- [ ] Planejamento orçamentário
- [ ] Notificações de vencimentos
- [ ] API REST para integração

## 🤝 Contribuição

Este é um projeto MVP. Para contribuições ou sugestões, entre em contato com a equipe de desenvolvimento.

## 📄 Licença

Este projeto foi desenvolvido especificamente para o Instituto Superior Politécnico do Bie.

---

**Instituto Superior Politécnico do Bie** - Sistema de Controle Financeiro v1.0
