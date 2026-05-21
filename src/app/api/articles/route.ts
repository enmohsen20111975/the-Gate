import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Articles API - Updated

// GET /api/articles - Get all articles
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const source = searchParams.get('source') || ''
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: any = {}
    
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { titleAr: { contains: search } },
        { content: { contains: search } },
        { tags: { contains: search } },
      ]
    }
    
    if (source) {
      where.source = source
    }

    const [articles, total] = await Promise.all([
      db.article.findMany({
        where,
        include: {
          language: true,
          category: true,
        },
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
      }),
      db.article.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: articles,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    })
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch articles' },
      { status: 500 }
    )
  }
}

// POST /api/articles - Create a new article
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Get or create language
    let languageId = body.languageId
    if (!languageId && body.languageCode) {
      const lang = await db.language.upsert({
        where: { code: body.languageCode },
        update: {},
        create: { name: body.languageName || body.languageCode, code: body.languageCode },
      })
      languageId = lang.id
    }

    const article = await db.article.create({
      data: {
        title: body.title,
        titleAr: body.titleAr,
        content: body.content,
        contentHtml: body.contentHtml,
        summary: body.summary,
        sourceUrl: body.sourceUrl,
        imageUrl: body.imageUrl,
        videoUrl: body.videoUrl,
        languageId: languageId,
        categoryId: body.categoryId,
        topicId: body.topicId,
        author: body.author,
        authorBio: body.authorBio,
        tags: body.tags,
        keywords: body.keywords,
        sections: body.sections,
        source: body.source,
        scrapedAt: body.scrapedAt ? new Date(body.scrapedAt) : undefined,
      },
      include: {
        language: true,
        category: true,
      },
    })

    return NextResponse.json({ success: true, data: article })
  } catch (error) {
    console.error('Error creating article:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create article' },
      { status: 500 }
    )
  }
}
