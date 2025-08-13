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
    const suppliers = await prisma.supplier.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ suppliers })
  } catch (error) {
    console.error('Error fetching suppliers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch suppliers' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, taxId, email, phone, address, status, bankAccount, supplierType } = body

    const supplier = await prisma.supplier.create({
      data: {
        name,
        taxId,
        email,
        phone,
        address,
        status: status || 'ATIVO',
        bankAccount,
        supplierType: supplierType || 'PESSOA_JURIDICA',
      },
    })

    return NextResponse.json({ supplier }, { status: 201 })
  } catch (error) {
    console.error('Error creating supplier:', error)
    return NextResponse.json(
      { error: 'Failed to create supplier' },
      { status: 500 }
    )
  }
}
