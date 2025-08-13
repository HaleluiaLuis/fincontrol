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
    const invoices = await prisma.invoice.findMany({
      include: {
        supplier: true,
        category: true,
        registeredBy: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        payment: true,
        paymentRequest: {
          include: {
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
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ invoices })
  } catch (error) {
    console.error('Error fetching invoices:', error)
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      invoiceNumber,
      supplierId,
      description,
      amount,
      issueDate,
      dueDate,
      serviceDate,
      categoryId,
      attachments,
      registeredById,
      paymentRequestId
    } = body

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        supplierId,
        description,
        amount,
        issueDate: new Date(issueDate),
        dueDate: new Date(dueDate),
        serviceDate: new Date(serviceDate),
        categoryId,
        attachments: attachments || null,
        registeredById,
        paymentRequestId: paymentRequestId || null,
      },
      include: {
        supplier: true,
        category: true,
        registeredBy: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        payment: true,
      }
    })

    return NextResponse.json({ invoice }, { status: 201 })
  } catch (error) {
    console.error('Error creating invoice:', error)
    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    )
  }
}
