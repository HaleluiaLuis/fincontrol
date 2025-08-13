import prisma from '@/lib/prisma';

export async function dbFinancialSummary(period?: string){
  const where: { date?: { gte: Date; lt: Date } } = {};
  if(period){
    const [y,m] = period.split('-').map(Number);
    if(!isNaN(y) && !isNaN(m)){
      const start = new Date(Date.UTC(y, m-1, 1));
      const end = new Date(Date.UTC(y, m, 1));
      where.date = { gte: start, lt: end };
    }
  }
  const tx = await prisma.transaction.findMany({ where, select:{ amount:true, type:true } });
  const totalReceitas = tx.filter(t=>t.type==='RECEITA').reduce((s,t)=>s+Number(t.amount),0);
  const totalDespesas = tx.filter(t=>t.type==='DESPESA').reduce((s,t)=>s+Number(t.amount),0);
  return { period: period||'all', totalReceitas, totalDespesas, saldo: totalReceitas-totalDespesas };
}

export async function dbInvoicesStatusSummary(){
  const invoices = await prisma.invoice.findMany({ select:{ status:true, amount:true } });
  const groups: Record<string,{count:number,amount:number}> = {};
  for(const inv of invoices){
    const key = inv.status;
    if(!groups[key]) groups[key]={count:0,amount:0};
    groups[key].count++; groups[key].amount += Number(inv.amount);
  }
  return { total: invoices.length, statuses: groups };
}

export async function dbCategoryBreakdown(){
  const tx = await prisma.transaction.groupBy({ by:['categoryId'], _sum:{ amount:true } });
  const catIds = tx.map(t=>t.categoryId).filter(Boolean) as string[];
  if(catIds.length===0) return [];
  const cats = await prisma.category.findMany({ where:{ id:{ in: catIds } }, select:{ id:true, name:true, type:true } });
  return tx
    .map(g=> ({ id:g.categoryId!, name: cats.find(c=>c.id===g.categoryId)?.name||'Sem categoria', type: cats.find(c=>c.id===g.categoryId)?.type || 'DESPESA', total: Number(g._sum.amount)||0 }))
    .filter(c=>c.total>0)
    .sort((a,b)=> b.total - a.total);
}

export async function dbSuppliersSummary(){
  const invAgg = await prisma.invoice.groupBy({ by:['supplierId'], _count:{ _all:true }, _sum:{ amount:true } });
  if(invAgg.length===0) return [];
  const supplierIds = invAgg.map(i=>i.supplierId).filter(Boolean) as string[];
  const sup = await prisma.supplier.findMany({ where:{ id:{ in: supplierIds } }, select:{ id:true, name:true } });
  return invAgg.map(a=> ({ id:a.supplierId!, name: sup.find(s=>s.id===a.supplierId)?.name || 'Fornecedor', totalInvoices: a._count._all, totalAmount: Number(a._sum.amount)||0 }))
    .sort((a,b)=> b.totalAmount - a.totalAmount);
}

export async function dbMonthlyComparison(year?: number){
  const where: { date?: { gte: Date; lt: Date } } = {};
  if(year){
    const start = new Date(Date.UTC(year,0,1));
    const end = new Date(Date.UTC(year+1,0,1));
    where.date = { gte:start, lt:end };
  }
  const tx = await prisma.transaction.findMany({ where, select:{ date:true, type:true, amount:true } });
  const months: Record<string,{receitas:number,despesas:number}> = {};
  for(const t of tx){
    const d = new Date(t.date);
    const key = d.toISOString().slice(0,7);
    if(!months[key]) months[key]={receitas:0,despesas:0};
    if(t.type==='RECEITA') months[key].receitas += Number(t.amount); else months[key].despesas += Number(t.amount);
  }
  return Object.entries(months).sort((a,b)=> a[0].localeCompare(b[0])).map(([month,vals])=>({month,...vals}));
}

export async function dbCashFlow(year?: number){
  const mc = await dbMonthlyComparison(year);
  let running = 0;
  return mc.map(m=> { running += (m.receitas - m.despesas); return { ...m, saldo: running }; });
}

export async function dbScheduleUpcoming(limit=10){
  const today = new Date();
  const invoices = await prisma.invoice.findMany({ where:{ dueDate:{ gte: today } }, orderBy:{ dueDate:'asc' }, take: limit, select:{ id:true, invoiceNumber:true, dueDate:true, amount:true, status:true } });
  return invoices.map(i=> ({ id:i.id, invoiceNumber:i.invoiceNumber, dueDate: i.dueDate.toISOString(), amount: Number(i.amount), status: i.status }));
}

export async function dbPaymentStatusSummary(){
  const invoices = await prisma.invoice.findMany({ select:{ status:true, amount:true, dueDate:true } });
  const today = new Date();
  let pendentes=0, aprovadas=0, pagas=0, rejeitadas=0, canceladas=0, vencidas=0;
  let valorPendentes=0, valorAprovadas=0, valorPagas=0, valorVencidas=0;
  for(const inv of invoices){
    const due = inv.dueDate;
    const isOverdue = due < today && !['PAGA','CANCELADA','REJEITADA'].includes(inv.status);
    if(isOverdue){ vencidas++; valorVencidas += Number(inv.amount); }
    switch(inv.status){
      case 'PENDENTE':
      case 'EM_VALIDACAO':
      case 'PENDENTE_PRESIDENTE':
        pendentes++; valorPendentes += Number(inv.amount); break;
      case 'AUTORIZADA':
      case 'REGISTRADA':
      case 'PENDENTE_PAGAMENTO':
        aprovadas++; valorAprovadas += Number(inv.amount); break;
      case 'PAGA': pagas++; valorPagas += Number(inv.amount); break;
      case 'REJEITADA': rejeitadas++; break;
      case 'CANCELADA': canceladas++; break;
    }
  }
  return { total: invoices.length, counts:{ pendentes, aprovadas, pagas, vencidas, rejeitadas, canceladas }, valores:{ pendentes:valorPendentes, aprovadas:valorAprovadas, pagas:valorPagas, vencidas:valorVencidas } };
}

export async function dbDashboardSnapshot(){
  const [financial, invoices, categories, suppliers, cashFlow] = await Promise.all([
    dbFinancialSummary(),
    dbInvoicesStatusSummary(),
    dbCategoryBreakdown().then(r=> r.slice(0,5)),
    dbSuppliersSummary().then(r=> r.slice(0,5)),
    dbCashFlow().then(r=> r.slice(-3))
  ]);
  return { financial, invoices, categories, suppliers, cashFlow };
}

export async function dbExportReport(type: string){
  switch(type){
    case 'financial': return dbFinancialSummary();
    case 'invoices': return dbInvoicesStatusSummary();
    case 'categories': return dbCategoryBreakdown();
    case 'suppliers': return dbSuppliersSummary();
    case 'cash-flow': return dbCashFlow();
    default: return { message:'Tipo de exportação não suportado', type };
  }
}
