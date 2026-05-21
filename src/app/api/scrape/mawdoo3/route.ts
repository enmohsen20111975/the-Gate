import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'
import { db } from '@/lib/db'

// GET /api/scrape/mawdoo3 - Scrape Mawdoo3 articles
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const action = searchParams.get('action') || 'categories'
    const url = searchParams.get('url')
    const limit = parseInt(searchParams.get('limit') || '10')

    const zai = await ZAI.create()

    if (action === 'categories') {
      // Known Mawdoo3 categories
      const categories = [
        { name: 'العلوم', nameEn: 'Science', slug: 'العلوم', articleCount: 15000 },
        { name: 'التقنية', nameEn: 'Technology', slug: 'التقنية', articleCount: 12000 },
        { name: 'الصحة', nameEn: 'Health', slug: 'الصحة', articleCount: 18000 },
        { name: 'الأعمال', nameEn: 'Business', slug: 'الأعمال', articleCount: 8000 },
        { name: 'التعليم', nameEn: 'Education', slug: 'التعليم', articleCount: 10000 },
        { name: 'الفنون', nameEn: 'Arts', slug: 'الفنون', articleCount: 6000 },
        { name: 'الرياضة', nameEn: 'Sports', slug: 'الرياضة', articleCount: 9000 },
        { name: 'السياحة', nameEn: 'Tourism', slug: 'السياحة', articleCount: 7000 },
        { name: 'الطبخ', nameEn: 'Cooking', slug: 'الطبخ', articleCount: 5000 },
        { name: 'الأم والطفل', nameEn: 'Mother and Child', slug: 'الأم_والطفل', articleCount: 4000 },
        { name: 'الجمال', nameEn: 'Beauty', slug: 'الجمال', articleCount: 3500 },
        { name: 'الدين', nameEn: 'Religion', slug: 'الدين', articleCount: 11000 },
        { name: 'التاريخ', nameEn: 'History', slug: 'التاريخ', articleCount: 8000 },
        { name: 'الأدب', nameEn: 'Literature', slug: 'الأدب', articleCount: 5500 },
        { name: 'المال', nameEn: 'Finance', slug: 'المال', articleCount: 6500 },
        { name: 'الحيوانات', nameEn: 'Animals', slug: 'الحيوانات', articleCount: 4500 },
        { name: 'النباتات', nameEn: 'Plants', slug: 'النباتات', articleCount: 3000 },
        { name: 'حول العالم', nameEn: 'Around the World', slug: 'حول_العالم', articleCount: 7500 },
      ]
      
      return NextResponse.json({
        success: true,
        data: categories,
        total: categories.length
      })
    }

    if (action === 'article' && url) {
      // Scrape a specific article
      const result = await zai.functions.invoke('page_reader', { url })
      
      const articleData = parseMawdoo3Article(result.data, url)
      
      if (articleData) {
        const language = await db.language.upsert({
          where: { code: 'ar' },
          update: {},
          create: { name: 'العربية', code: 'ar' }
        })

        const article = await db.article.create({
          data: {
            title: articleData.title,
            titleAr: articleData.title,
            content: articleData.content,
            contentHtml: articleData.contentHtml,
            summary: articleData.summary,
            sourceUrl: url,
            imageUrl: articleData.imageUrl,
            languageId: language.id,
            source: 'mawdoo3',
            scrapedAt: new Date(),
            tags: articleData.tags?.join(','),
          }
        })

        return NextResponse.json({
          success: true,
          data: article
        })
      }

      return NextResponse.json({
        success: false,
        error: 'Failed to parse article'
      }, { status: 400 })
    }

    if (action === 'search') {
      const query = searchParams.get('q') || ''
      const searchUrl = `https://mawdoo3.com/search?q=${encodeURIComponent(query)}`
      
      const result = await zai.functions.invoke('page_reader', { url: searchUrl })
      const articles = parseSearchResults(result.data?.html || '')
      
      return NextResponse.json({
        success: true,
        data: articles.slice(0, limit),
        query
      })
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action. Use: categories, article, or search'
    }, { status: 400 })

  } catch (error) {
    console.error('Error scraping Mawdoo3:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to scrape Mawdoo3' },
      { status: 500 }
    )
  }
}

// Parse a single Mawdoo3 article
function parseMawdoo3Article(data: any, url: string) {
  if (!data) return null
  
  try {
    const html = data.html || ''
    const title = data.title || extractTitle(html)
    
    // Extract main content
    const contentMatch = html.match(/<div[^>]*class="[^"]*mw-parser-output[^"]*"[^>]*>([\s\S]*?)<\/div>/i)
    const contentHtml = contentMatch ? contentMatch[1] : html
    
    // Clean content
    const content = contentHtml
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
    
    const summary = content.substring(0, 300) + '...'
    
    const imgMatch = html.match(/<img[^>]*src="([^"]+)"[^>]*>/i)
    const imageUrl = imgMatch ? imgMatch[1] : null
    
    const keywordsMatch = html.match(/<meta[^>]*name="keywords"[^>]*content="([^"]+)"/i)
    const tags = keywordsMatch ? keywordsMatch[1].split(',').map(t => t.trim()) : []
    
    return {
      title,
      content,
      contentHtml,
      summary,
      imageUrl,
      tags
    }
  } catch (e) {
    console.error('Error parsing article:', e)
    return null
  }
}

function extractTitle(html: string): string {
  const titleMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/i)
  return titleMatch ? titleMatch[1].trim() : 'مقال بدون عنوان'
}

function parseSearchResults(html: string) {
  const results: { title: string; url: string; summary: string }[] = []
  const linkRegex = /<a[^>]*href="\/([^"]+)"[^>]*>([^<]+)<\/a>/gi
  let match
  
  while ((match = linkRegex.exec(html)) !== null) {
    const slug = match[1]
    const title = match[2].trim()
    
    if (slug && title && !slug.includes(':') && !slug.includes('#')) {
      results.push({
        title,
        url: `https://mawdoo3.com/${slug}`,
        summary: ''
      })
    }
  }
  
  return results
}

// POST - Batch scrape articles
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { urls } = body
    
    if (!urls || !Array.isArray(urls)) {
      return NextResponse.json({
        success: false,
        error: 'Please provide an array of URLs to scrape'
      }, { status: 400 })
    }

    const zai = await ZAI.create()
    const results = []
    
    const language = await db.language.upsert({
      where: { code: 'ar' },
      update: {},
      create: { name: 'العربية', code: 'ar' }
    })

    for (const url of urls.slice(0, 10)) {
      try {
        const result = await zai.functions.invoke('page_reader', { url })
        const articleData = parseMawdoo3Article(result.data, url)
        
        if (articleData) {
          const article = await db.article.create({
            data: {
              title: articleData.title,
              titleAr: articleData.title,
              content: articleData.content,
              contentHtml: articleData.contentHtml,
              summary: articleData.summary,
              sourceUrl: url,
              imageUrl: articleData.imageUrl,
              languageId: language.id,
              source: 'mawdoo3',
              scrapedAt: new Date(),
              tags: articleData.tags?.join(','),
            }
          })
          results.push({ url, success: true, articleId: article.id })
        }
      } catch (e) {
        results.push({ url, success: false, error: 'Failed to scrape' })
      }
      
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    return NextResponse.json({
      success: true,
      scraped: results.length,
      results
    })

  } catch (error) {
    console.error('Error batch scraping:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to batch scrape' },
      { status: 500 }
    )
  }
}
