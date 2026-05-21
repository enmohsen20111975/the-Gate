import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

// GET /api/mawdoo3 - Scrape Mawdoo3 content
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const url = searchParams.get('url') || 'https://mawdoo3.com'
    const action = searchParams.get('action') || 'read'

    const zai = await ZAI.create()

    if (action === 'read') {
      // Read a specific page
      const result = await zai.functions.invoke('page_reader', { url })
      
      return NextResponse.json({
        success: true,
        data: {
          title: result.data?.title,
          url: result.data?.url,
          content: result.data?.html,
          text: result.data?.text,
          publishedTime: result.data?.publishedTime,
        },
      })
    } else if (action === 'search') {
      // Search Mawdoo3
      const query = searchParams.get('q') || ''
      const searchUrl = `https://mawdoo3.com/search?q=${encodeURIComponent(query)}`
      
      const result = await zai.functions.invoke('page_reader', { url: searchUrl })
      
      return NextResponse.json({
        success: true,
        data: {
          query,
          searchUrl,
          results: result.data,
        },
      })
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action. Use "read" or "search"',
    }, { status: 400 })
  } catch (error) {
    console.error('Error scraping Mawdoo3:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to scrape Mawdoo3' },
      { status: 500 }
    )
  }
}
