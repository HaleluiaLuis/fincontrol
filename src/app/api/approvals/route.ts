import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const paymentRequestId = searchParams.get('paymentRequestId')
    const userId = searchParams.get('userId')
    
    const whereClause: Prisma.ApprovalWhereInput = {}

    if (paymentRequestId) {
      whereClause.paymentRequestId = paymentRequestId
    }

    if (userId) {
      whereClause.userId = userId
    }

    const approvals = await prisma.approval.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          }
        },
        paymentRequest: {
          select: {
            id: true,
            description: true,
            amount: true,
            status: true,
            currentStep: true,
          }
        }
      },
      orderBy: {
        timestamp: 'desc'
      }
    })

    return NextResponse.json({ approvals })
  } catch (error) {
    console.error('Error fetching approvals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch approvals' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      paymentRequestId,
      step,
      action,
      userId,
      comments,
      attachments
    } = body

    // Criar a aprovação
    const approval = await prisma.approval.create({
      data: {
        paymentRequestId,
        step,
        action,
        userId,
        comments: comments || null,
        attachments: attachments || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          }
        }
      }
    })

    // Atualizar o status da solicitação de pagamento baseado na aprovação
    let newStatus: 'PENDENTE' | 'EM_VALIDACAO' | 'PENDENTE_PRESIDENTE' | 'AUTORIZADA' | 'REJEITADA' | 'REGISTRADA' | 'PENDENTE_PAGAMENTO' | 'PAGA' | 'CANCELADA' = 'PENDENTE'
    let nextStep: 'GABINETE_CONTRATACAO' | 'PRESIDENTE' | 'GABINETE_APOIO' | 'FINANCAS' = step

    if (action === 'APROVADO') {
      switch (step) {
        case 'GABINETE_CONTRATACAO':
          nextStep = 'PRESIDENTE'
          newStatus = 'PENDENTE_PRESIDENTE'
          break
        case 'PRESIDENTE':
          nextStep = 'GABINETE_APOIO'
          newStatus = 'AUTORIZADA'
          break
        case 'GABINETE_APOIO':
          nextStep = 'FINANCAS'
          newStatus = 'REGISTRADA'
          break
        case 'FINANCAS':
          newStatus = 'PENDENTE_PAGAMENTO'
          break
      }
    } else if (action === 'REJEITADO') {
      newStatus = 'REJEITADA'
    }

    // Atualizar a solicitação de pagamento
    await prisma.paymentRequest.update({
      where: { id: paymentRequestId },
      data: {
        status: newStatus,
        currentStep: nextStep,
      }
    })

    return NextResponse.json({ approval }, { status: 201 })
  } catch (error) {
    console.error('Error creating approval:', error)
    return NextResponse.json(
      { error: 'Failed to create approval' },
      { status: 500 }
    )
  }
}
