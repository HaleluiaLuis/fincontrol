import { PrismaClient, UserRole, SupplierStatus, SupplierType, TransactionType } from '@prisma/client';

const prisma = new PrismaClient();

async function main(){
	console.log('> Seeding dados iniciais...');

	// Users básicos
	const admin = await prisma.user.upsert({
		where: { email: 'admin@ispobie.ao' },
		create: {
			name: 'Administrador',
			email: 'admin@ispobie.ao',
			role: UserRole.ADMIN,
			department: 'Financeiro'
		},
		update: {}
	});

	const rolesSeeds: { email:string; name:string; role: UserRole; department?:string }[] = [
		{ email:'contratacao@ispobie.ao', name:'Gab Contratação', role: UserRole.GABINETE_CONTRATACAO, department:'Gabinete Contratação' },
		{ email:'presidente@ispobie.ao', name:'Presidente', role: UserRole.PRESIDENTE, department:'Presidência' },
		{ email:'apoio@ispobie.ao', name:'Gab Apoio', role: UserRole.GABINETE_APOIO, department:'Gabinete Apoio' },
		{ email:'financas@ispobie.ao', name:'Finanças', role: UserRole.FINANCAS, department:'Finanças' },
		{ email:'viewer@ispobie.ao', name:'Visualizador', role: UserRole.VIEWER, department:'Diretoria' },
	];
	for(const u of rolesSeeds){
		await prisma.user.upsert({
			where:{ email: u.email },
			create:{ name: u.name, email: u.email, role: u.role, department: u.department },
			update:{}
		});
	}

	// Categories
	const categoriesData = [
		{ name: 'Serviços Acadêmicos', type: TransactionType.DESPESA, color:'#6366f1' },
		{ name: 'Manutenção', type: TransactionType.DESPESA, color:'#f59e0b' },
		{ name: 'Receitas Mensalidades', type: TransactionType.RECEITA, color:'#10b981' },
	];
		for(const cat of categoriesData){
			const exists = await prisma.category.findFirst({ where:{ name: cat.name, type: cat.type } });
			if(!exists){
				await prisma.category.create({ data: cat });
			}
		}

	const categories = await prisma.category.findMany();

	// Suppliers
	const supplier = await prisma.supplier.upsert({
		where:{ taxId: '5401234567' },
		create: {
			name:'Fornecedor Exemplo',
			taxId:'5401234567',
			email:'fornecedor@example.com',
			phone:'+244 900 000 000',
			supplierType: SupplierType.PESSOA_JURIDICA,
			status: SupplierStatus.ATIVO
		},
		update:{}
	});

	// Invoice exemplo
	const cat = categories[0];
	const existingInv = await prisma.invoice.findFirst();
	if(!existingInv){
		await prisma.invoice.create({
			data: {
				invoiceNumber: 'INV-SEED-001',
				supplierId: supplier.id,
				categoryId: cat.id,
				description: 'Serviço acadêmico inicial',
				amount: 150000,
				issueDate: new Date(),
				serviceDate: new Date(),
				dueDate: new Date(Date.now()+ 7*24*60*60*1000),
				registeredById: admin.id
			}
		});
	}

	console.log('> Seed concluído');
}

main().catch(e => {
	console.error(e);
	process.exit(1);
}).finally(async () => {
	await prisma.$disconnect();
});

