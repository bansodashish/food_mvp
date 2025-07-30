import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'recent'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    const where: any = {
      isAvailable: true,
    }

    if (category && category !== 'all') {
      where.category = category.toUpperCase()
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    let orderBy: any = { createdAt: 'desc' }
    
    switch (sortBy) {
      case 'price_asc':
        orderBy = { currentPrice: 'asc' }
        break
      case 'price_desc':
        orderBy = { currentPrice: 'desc' }
        break
      case 'expiry':
        orderBy = { expiryDate: 'asc' }
        break
    }

    const items = await prisma.foodItem.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        }
      }
    })

    const total = await prisma.foodItem.count({ where })

    return NextResponse.json({
      items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching food items:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await request.json()
    
    const item = await prisma.foodItem.create({
      data: {
        ...data,
        sellerId: session.user.id,
      },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        }
      }
    })

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error('Error creating food item:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
