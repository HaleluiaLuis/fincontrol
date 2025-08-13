import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const paymentRequests = await prisma.paymentRequest.findMany({
      include: {
        supplier: true,
        category: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          }
        },
        approvals: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                role: true,
              }
            }
          },
          orderBy: {
            timestamp: 'desc'
          }
        },
        invoice: {
          include: {
            payment: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ paymentRequests })
  } catch (error) {
    console.error('Error fetching payment requests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payment requests' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      description,
      amount,
      supplierId,
      categoryId,
      serviceDate,
      dueDate,
      contractRef,
      documents,
      createdById
    } = body

    const paymentRequest = await prisma.paymentRequest.create({
      data: {
        description,
        amount,
        supplierId,
        categoryId,
        serviceDate: serviceDate ? new Date(serviceDate) : null,
        dueDate: dueDate ? new Date(dueDate) : null,
        contractRef: contractRef || null,
        documents: documents || null,
        createdById,
        status: 'PENDENTE',
        currentStep: 'GABINETE_CONTRATACAO',
      },
      include: {
        supplier: true,
        category: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          }
        },
      }
    })

    return NextResponse.json({ paymentRequest }, { status: 201 })
  } catch (error) {
    console.error('Error creating payment request:', error)
    return NextResponse.json(
      { error: 'Failed to create payment request' },
      { status: 500 }
    )
  }
}
