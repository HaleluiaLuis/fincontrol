// Teste do Sistema de Permissões - FinControl
// Execute este arquivo no console do navegador para testar as permissões

console.log('=== TESTE DO SISTEMA DE PERMISSÕES FINCONTROL ===');

// Função para testar login e verificar permissões
async function testUserPermissions(email, password, expectedRole) {
  console.log(`\n🔍 Testando usuário: ${email} (${expectedRole})`);
  
  try {
    // Fazer login
    const loginResponse = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });
    
    const loginData = await loginResponse.json();
    
    if (!loginResponse.ok) {
      console.error(`❌ Erro no login: ${loginData.error}`);
      return;
    }
    
    console.log(`✅ Login bem-sucedido`);
    console.log(`👤 Usuário: ${loginData.data.user.name}`);
    console.log(`🏷️ Role: ${loginData.data.user.role}`);
    console.log(`🔑 Permissões:`, loginData.data.user.permissions);
    
    // Verificar permissões específicas
    const permissions = loginData.data.user.permissions;
    
    // Permissões esperadas para cada menu
    const menuPermissions = [
      { item: 'Dashboard', permission: 'dashboard.read' },
      { item: 'Relatórios', permission: 'reports.read' },
      { item: 'Faturas', permission: 'invoices.read' },
      { item: 'Transações', permission: 'transactions.read' },
      { item: 'Fornecedores', permission: 'suppliers.read' },
      { item: 'Solicitações', permission: 'payment_requests.read' },
      { item: 'Pagamentos', permission: 'payments.read' },
    ];
    
    console.log('\n📋 Itens de menu acessíveis:');
    menuPermissions.forEach(({ item, permission }) => {
      const hasPermission = permissions.includes(permission) || permissions.includes('admin.all');
      console.log(`${hasPermission ? '✅' : '❌'} ${item} (${permission})`);
    });
    
    // Fazer logout
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${loginData.data.token}`,
      }
    });
    
    console.log('🚪 Logout realizado');
    
  } catch (error) {
    console.error(`❌ Erro no teste: ${error.message}`);
  }
}

// Lista de usuários para teste
const testUsers = [
  { email: 'admin@ispb.edu', password: '123456', role: 'ADMIN' },
  { email: 'presidente@ispb.edu', password: '123456', role: 'PRESIDENTE' },
  { email: 'contratacao@ispb.edu', password: '123456', role: 'GABINETE_CONTRATACAO' },
  { email: 'apoio@ispb.edu', password: '123456', role: 'GABINETE_APOIO' },
  { email: 'financas@ispb.edu', password: '123456', role: 'FINANCAS' }
];

// Executar testes para todos os usuários
async function runAllTests() {
  console.log('🚀 Iniciando testes de permissões...\n');
  
  for (const user of testUsers) {
    await testUserPermissions(user.email, user.password, user.role);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Aguardar 1 segundo entre testes
  }
  
  console.log('\n✅ Todos os testes concluídos!');
}

// Executar automaticamente
runAllTests();

// Também exportar função para teste manual
window.testPermissions = {
  testUser: testUserPermissions,
  runAll: runAllTests,
  users: testUsers
};

console.log('\n💡 Dica: Use window.testPermissions.testUser(email, password, role) para testar um usuário específico');
