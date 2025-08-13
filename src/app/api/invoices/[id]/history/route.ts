import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

// Ajuste: Tipos recentes do Next podem tratar params como Promise. Aceitamos Promise e aguardamos.
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id:string }> }){
  const { id } = await params;
  try {
    const [logs, approvals] = await Promise.all([
      prisma.auditLog.findMany({
        where:{ entity: 'Invoice', entityId: id },
        orderBy:{ createdAt: 'asc' },
        select:{ id:true, action:true, metadata:true, createdAt:true, user:{ select:{ id:true, name:true, email:true, role:true } } }
      }),
      prisma.approval.findMany({
        where:{ invoiceId: id },
        orderBy:{ timestamp: 'asc' },
        select:{ id:true, step:true, action:true, comments:true, timestamp:true, user:{ select:{ id:true, name:true, role:true } } }
      })
    ]);
    // Normaliza em uma linha do tempo única
    const timeline = [
      ...approvals.map(a=>({
        type:'approval' as const,
        id:a.id,
        step:a.step,
        action:a.action,
        comments:a.comments,
        at:a.timestamp,
        user:a.user
      })),
      ...logs.map(l=>({
        type:'log' as const,
        id:l.id,
        action:l.action,
        metadata:l.metadata,
        at:l.createdAt,
        user:l.user
      }))
    ].sort((a,b)=> new Date(a.at).getTime() - new Date(b.at).getTime());
    return NextResponse.json({ ok:true, data: { approvals, logs, timeline } });
  } catch {
    return NextResponse.json({ ok:false, error:'Erro ao obter histórico' }, { status:500 });
  }
}
