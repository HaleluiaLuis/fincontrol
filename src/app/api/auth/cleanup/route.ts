import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// DELETE /api/auth/cleanup
// Remove sessões expiradas ou revogadas
export async function DELETE() {
  try {
    const now = new Date();
    const result = await prisma.session.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: now } },
          { revokedAt: { not: null } }
        ]
      }
    });
    return NextResponse.json({ ok: true, removed: result.count });
  } catch {
    return NextResponse.json({ ok:false, error:'Falha ao limpar sessões' }, { status:500 });
  }
}

// GET /api/auth/cleanup
// Retorna contagem de sessões ativas
export async function GET(){
  try {
    const now = new Date();
    const active = await prisma.session.count({ where:{ expiresAt: { gt: now }, revokedAt: null } });
    return NextResponse.json({ ok:true, active });
  } catch {
    return NextResponse.json({ ok:false, error:'Falha ao consultar sessões' }, { status:500 });
  }
}
