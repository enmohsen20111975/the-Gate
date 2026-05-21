import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/platforms - Get all platforms
export async function GET() {
  try {
    const platforms = await db.platform.findMany({
      include: {
        _count: {
          select: { courses: true },
        },
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json({
      success: true,
      data: platforms,
    })
  } catch (error) {
    console.error('Error fetching platforms:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch platforms' },
      { status: 500 }
    )
  }
}

// POST /api/platforms - Create a new platform
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const platform = await db.platform.create({
      data: {
        name: body.name,
        slug: body.slug,
        url: body.url,
        logo: body.logo,
        description: body.description,
      },
    })

    return NextResponse.json({ success: true, data: platform })
  } catch (error) {
    console.error('Error creating platform:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create platform' },
      { status: 500 }
    )
  }
}
