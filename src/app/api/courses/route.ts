import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/courses - Get all courses with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const language = searchParams.get('language') || ''
    const level = searchParams.get('level') || ''
    const featured = searchParams.get('featured')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: any = {}
    
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { titleAr: { contains: search } },
        { description: { contains: search } },
        { descriptionAr: { contains: search } },
        { tags: { contains: search } },
      ]
    }
    
    if (category) {
      where.category = { slug: category }
    }
    
    if (language) {
      where.language = { code: language }
    }
    
    if (level) {
      where.level = level
    }
    
    if (featured === 'true') {
      where.featured = true
    }

    const [courses, total] = await Promise.all([
      db.course.findMany({
        where,
        include: {
          category: true,
          language: true,
          platform: true,
        },
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
      }),
      db.course.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: courses,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    })
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch courses' },
      { status: 500 }
    )
  }
}

// POST /api/courses - Create a new course
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const course = await db.course.create({
      data: {
        title: body.title,
        titleAr: body.titleAr,
        description: body.description,
        descriptionAr: body.descriptionAr,
        url: body.url,
        imageUrl: body.imageUrl,
        instructor: body.instructor,
        duration: body.duration,
        level: body.level,
        rating: body.rating,
        enrollments: body.enrollments,
        price: body.price,
        certificate: body.certificate || false,
        isFree: body.isFree !== false,
        featured: body.featured || false,
        tags: body.tags,
        categoryId: body.categoryId,
        languageId: body.languageId,
        platformId: body.platformId,
      },
      include: {
        category: true,
        language: true,
        platform: true,
      },
    })

    return NextResponse.json({ success: true, data: course })
  } catch (error) {
    console.error('Error creating course:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create course' },
      { status: 500 }
    )
  }
}
