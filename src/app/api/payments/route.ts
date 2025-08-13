import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser, createUnauthorizedResponse } from '@/lib/auth'

export async function GET(request: NextRequest) {
  // Verificar autenticação
  const user = getAuthenticatedUser(request);
  if (!user) {
    return createUnauthorizedResponse();
  }

  try {
    const payments = await prisma.payment.findMany({
      include: {
        invoice: {
          include: {
            supplier: true,
            category: true,
          }
        },
        processedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      },
      orderBy: {
        paidAt: 'desc'
      }
    })

    return NextResponse.json({ payments })
  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      invoiceId,
      amount,
      paidAt,
      method,
      reference,
      bankAccount,
      notes,
      processedById
    } = body

    const payment = await prisma.payment.create({
      data: {
        invoiceId,
        amount,
        paidAt: new Date(paidAt),
        method: method || 'TRANSFERENCIA_BANCARIA',
        reference: reference || null,
        bankAccount: bankAccount || null,
        notes: notes || null,
        processedById,
      },
      include: {
        invoice: {
          include: {
            supplier: true,
            category: true,
          }
        },
        processedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    })

    return NextResponse.json({ payment }, { status: 201 })
  } catch (error) {
    console.error('Error creating payment:', error)
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    )
  }
}
