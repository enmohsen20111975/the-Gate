'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  ArrowRight, 
  Clock, 
  Eye, 
  Heart, 
  Share2, 
  Bookmark,
  ChevronRight,
  BookOpen,
  Printer
} from 'lucide-react'

interface Article {
  id: string
  title: string
  titleAr?: string
  content?: string
  contentHtml?: string
  summary?: string
  imageUrl?: string
  author?: string
  views: number
  likes: number
  tags?: string
  source?: string
  sourceUrl?: string
  createdAt: string
  category?: { name: string; nameAr?: string }
}

export default function ArticlePage() {
  const params = useParams()
  const router = useRouter()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchArticle(params.id as string)
    }
  }, [params.id])

  const fetchArticle = async (id: string) => {
    try {
      const res = await fetch(`/api/articles/${id}`)
      if (res.ok) {
        const data = await res.json()
        setArticle(data.data)
      }
    } catch (error) {
      console.error('Error fetching article:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share && article) {
      await navigator.share({
        title: article.titleAr || article.title,
        url: window.location.href,
      })
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center" dir="rtl">
        <div className="animate-pulse space-y-4 w-full max-w-4xl p-8">
          <div className="h-8 bg-slate-200 rounded w-3/4"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          <div className="h-64 bg-slate-200 rounded"></div>
          <div className="space-y-2">
            <div className="h-4 bg-slate-200 rounded"></div>
            <div className="h-4 bg-slate-200 rounded w-5/6"></div>
            <div className="h-4 bg-slate-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-700">المقال غير موجود</h2>
          <Button className="mt-4" onClick={() => router.push('/')}>
            العودة للرئيسية
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => router.push('/')}>
              <ArrowRight className="w-4 h-4 ml-2" />
              العودة
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handlePrint}>
                <Printer className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleShare}>
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <span className="hover:text-emerald-600 cursor-pointer" onClick={() => router.push('/')}>
              الرئيسية
            </span>
            <ChevronRight className="w-4 h-4" />
            {article.category && (
              <>
                <span className="hover:text-emerald-600 cursor-pointer">
                  {article.category.nameAr || article.category.name}
                </span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
            <span className="text-slate-700 font-medium truncate max-w-[200px]">
              {article.titleAr || article.title}
            </span>
          </div>

          {/* Article Header */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-3xl font-bold leading-tight">
                {article.titleAr || article.title}
              </CardTitle>
              
              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-slate-500">
                {article.author && (
                  <div className="flex items-center gap-1">
                    <span>الكاتب:</span>
                    <span className="font-medium text-slate-700">{article.author}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(article.createdAt).toLocaleDateString('ar-EG')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{article.views} مشاهدة</span>
                </div>
                {article.source && (
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                    {article.source === 'mawdoo3' ? 'موسوعة موضوع' : article.source}
                  </Badge>
                )}
              </div>

              {/* Tags */}
              {article.tags && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {article.tags.split(',').map((tag, i) => (
                    <Badge key={i} variant="outline" className="hover:bg-emerald-50">
                      {tag.trim()}
                    </Badge>
                  ))}
                </div>
              )}
            </CardHeader>

            {/* Featured Image */}
            {article.imageUrl && (
              <div className="aspect-video bg-slate-100 overflow-hidden">
                <img 
                  src={article.imageUrl} 
                  alt={article.titleAr || article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <CardContent className="prose prose-lg max-w-none">
              {/* Summary */}
              {article.summary && (
                <div className="bg-emerald-50 border-r-4 border-emerald-500 p-4 mb-6 rounded-lg">
                  <p className="text-emerald-800 font-medium mb-0">{article.summary}</p>
                </div>
              )}

              {/* Article Content */}
              {article.contentHtml ? (
                <div 
                  dangerouslySetInnerHTML={{ __html: article.contentHtml }}
                  className="article-content"
                />
              ) : (
                <div className="whitespace-pre-wrap leading-relaxed">
                  {article.content}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-center gap-4 py-6 border-t">
            <Button 
              variant={liked ? "default" : "outline"} 
              className={`gap-2 ${liked ? 'bg-red-500 hover:bg-red-600' : ''}`}
              onClick={() => setLiked(!liked)}
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-white' : ''}`} />
              {liked ? 'أعجبني' : 'إعجاب'}
            </Button>
            <Button 
              variant={bookmarked ? "default" : "outline"} 
              className={`gap-2 ${bookmarked ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
              onClick={() => setBookmarked(!bookmarked)}
            >
              <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-white' : ''}`} />
              {bookmarked ? 'محفوظ' : 'حفظ'}
            </Button>
            <Button variant="outline" className="gap-2" onClick={handleShare}>
              <Share2 className="w-5 h-5" />
              مشاركة
            </Button>
          </div>
        </div>
      </main>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          header, .no-print {
            display: none !important;
          }
          main {
            padding: 0 !important;
          }
          .prose {
            font-size: 12pt !important;
          }
        }
      `}</style>
    </div>
  )
}
