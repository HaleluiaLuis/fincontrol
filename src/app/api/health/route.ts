import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Buscar estatísticas básicas
    const [userCount, supplierCount, categoryCount] = await Promise.all([
      prisma.user.count(),
      prisma.supplier.count(),
      prisma.category.count(),
    ])

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
      },
      take: 5
    })

    return NextResponse.json({
      status: 'connected',
      counts: {
        users: userCount,
        suppliers: supplierCount,
        categories: categoryCount,
      },
      sampleUsers: users,
    })
  } catch (error) {
    console.error('Database connection error:', error)
    return NextResponse.json(
      { error: 'Failed to connect to database' },
      { status: 500 }
    )
  }
}
