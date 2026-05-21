import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/languages - Get all languages
export async function GET() {
  try {
    const languages = await db.language.findMany({
      include: {
        _count: {
          select: { courses: true },
        },
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json({
      success: true,
      data: languages,
    })
  } catch (error) {
    console.error('Error fetching languages:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch languages' },
      { status: 500 }
    )
  }
}

// POST /api/languages - Create a new language
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const language = await db.language.create({
      data: {
        name: body.name,
        code: body.code,
      },
    })

    return NextResponse.json({ success: true, data: language })
  } catch (error) {
    console.error('Error creating language:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create language' },
      { status: 500 }
    )
  }
}
