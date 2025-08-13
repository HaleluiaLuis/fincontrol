import { sampleTransactions, mockInvoices, mockSuppliers, defaultCategories } from '@/data/mockData';

const toMonthKey = (date: string) => date.slice(0,7);

export function getFinancialSummary(period?: string) {
  const tx = period ? sampleTransactions.filter(t => toMonthKey(t.date) === period) : sampleTransactions;
  const totalReceitas = tx.filter(t=>t.type==='receita').reduce((s,t)=>s+t.amount,0);
  const totalDespesas = tx.filter(t=>t.type==='despesa').reduce((s,t)=>s+t.amount,0);
  const saldo = totalReceitas - totalDespesas;
  return { period: period || 'all', totalReceitas, totalDespesas, saldo };
}

export function getInvoicesStatusSummary() {
  const groups: Record<string,{count:number,amount:number}> = {};
  for (const inv of mockInvoices) {
    if(!groups[inv.status]) groups[inv.status] = {count:0, amount:0};
    groups[inv.status].count++; groups[inv.status].amount += inv.amount;
  }
  const total = mockInvoices.length;
  return { total, statuses: groups };
}

export function getCategoryBreakdown() {
  const map: Record<string,{id:string,name:string,type:string,total:number}> = {};
  for (const cat of defaultCategories) map[cat.id] = { id:cat.id, name:cat.name, type:cat.type, total:0 };
  for (const t of sampleTransactions) {
    if(map[t.category]) map[t.category].total += t.amount;
  }
  return Object.values(map).filter(c=>c.total>0).sort((a,b)=>b.total-a.total);
}

export function getSuppliersSummary() {
  const map: Record<string,{id:string,name:string,totalInvoices:number,totalAmount:number}> = {};
  for (const s of mockSuppliers) map[s.id] = { id:s.id, name:s.name, totalInvoices:0, totalAmount:0 };
  for (const inv of mockInvoices) { const s = map[inv.supplierId]; if(s){ s.totalInvoices++; s.totalAmount += inv.amount; } }
  return Object.values(map).filter(s=>s.totalInvoices>0).sort((a,b)=>b.totalAmount-a.totalAmount);
}

export function getMonthlyComparison(year?: number) {
  const months: Record<string,{receitas:number,despesas:number}> = {};
  for (const t of sampleTransactions) {
    if(year && new Date(t.date).getFullYear()!==year) continue;
    const key = toMonthKey(t.date);
    if(!months[key]) months[key] = {receitas:0, despesas:0};
    if(t.type==='receita') months[key].receitas += t.amount; else months[key].despesas += t.amount;
  }
  return Object.entries(months).sort((a,b)=> a[0].localeCompare(b[0])).map(([month,vals])=>({month,...vals}));
}

export function getCashFlow(year?: number) {
  const mc = getMonthlyComparison(year);
  let running = 0;
  return mc.map(m=>{ running += (m.receitas - m.despesas); return {...m, saldo: running}; });
}

export function getDashboardSnapshot() {
  return {
    financial: getFinancialSummary(),
    invoices: getInvoicesStatusSummary(),
    categories: getCategoryBreakdown().slice(0,5),
    suppliers: getSuppliersSummary().slice(0,5),
    cashFlow: getCashFlow().slice(-3)
  };
}

export function getScheduleUpcoming(limit=10) {
  const today = new Date();
  const upcoming = mockInvoices
    .filter(i=> new Date(i.dueDate) >= today)
    .map(i=> ({ id:i.id, invoiceNumber:i.invoiceNumber, dueDate:i.dueDate, amount:i.amount, status:i.status }))
    .sort((a,b)=> a.dueDate.localeCompare(b.dueDate))
    .slice(0,limit);
  return upcoming;
}

export function exportReport(type: string) {
  switch(type) {
    case 'financial': return getFinancialSummary();
    case 'invoices': return getInvoicesStatusSummary();
    case 'categories': return getCategoryBreakdown();
    case 'suppliers': return getSuppliersSummary();
    case 'cash-flow': return getCashFlow();
    default: return { message: 'Tipo de exportação não suportado', type };
  }
}

// Status de pagamento (agrupado) considerando invoices mock
export function getPaymentStatusSummary() {
  const today = new Date();
  let pendentes = 0, aprovadas = 0, pagas = 0, rejeitadas = 0, canceladas = 0, vencidas = 0;
  let valorPendentes = 0, valorAprovadas = 0, valorPagas = 0, valorVencidas = 0;

  for (const inv of mockInvoices) {
    const due = new Date(inv.dueDate);
    const isOverdue = due < today && !['paga','cancelada','rejeitada'].includes(inv.status);
    if (isOverdue) { vencidas++; valorVencidas += inv.amount; }
    switch(inv.status) {
      case 'pendente_contratacao':
      case 'pendente_presidente':
      case 'aprovada_registro':
        pendentes++; valorPendentes += inv.amount; break;
      case 'registrada':
      case 'pendente_pagamento':
        aprovadas++; valorAprovadas += inv.amount; break;
      case 'paga':
        pagas++; valorPagas += inv.amount; break;
      case 'rejeitada':
        rejeitadas++; break;
      case 'cancelada':
        canceladas++; break;
    }
  }
  const total = mockInvoices.length;
  return {
    total,
    counts: { pendentes, aprovadas, pagas, vencidas, rejeitadas, canceladas },
    valores: { pendentes: valorPendentes, aprovadas: valorAprovadas, pagas: valorPagas, vencidas: valorVencidas },
    updatedAt: new Date().toISOString()
  };
}
