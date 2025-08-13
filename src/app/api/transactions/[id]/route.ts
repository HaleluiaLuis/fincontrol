import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

interface ParamsPromise { params: Promise<{ id: string }> }

export async function PATCH(request: NextRequest, { params }: ParamsPromise){
  const { id } = await params;
  try {
    const data = await request.json();
    const { description, amount, categoryId, date, type, status, supplierId } = data;
    const updated = await prisma.transaction.update({
      where:{ id },
      data:{
        ...(description!==undefined && { description }),
        ...(amount!==undefined && { amount }),
        ...(categoryId!==undefined && { categoryId }),
        ...(date && { date: new Date(date) }),
        ...(type && { type }),
        ...(status && { status }),
        ...(supplierId!==undefined && { supplierId })
      },
      include:{ category:true, supplier:true }
    });
    return NextResponse.json({ ok:true, data: updated });
  } catch {
    return NextResponse.json({ ok:false, error:'Erro ao atualizar transação' }, { status:500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: ParamsPromise){
  const { id } = await params;
  try {
    await prisma.transaction.delete({ where:{ id } });
    return NextResponse.json({ ok:true, deleted:true });
  } catch {
    return NextResponse.json({ ok:false, error:'Erro ao deletar transação' }, { status:500 });
  }
}
