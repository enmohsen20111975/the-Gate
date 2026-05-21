'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Search, 
  GraduationCap, 
  Globe, 
  BookOpen, 
  Code, 
  Palette, 
  Briefcase, 
  Heart, 
  Calculator,
  Languages,
  Star,
  Clock,
  Users,
  Eye,
  Menu,
  X,
  RefreshCw,
  Loader2,
  Database,
  FileText,
  Video,
  Headphones,
  Pen,
  ChevronRight,
  Flame,
  Sparkles,
  Download,
  ArrowRight,
  Play,
  BookMarked
} from 'lucide-react'

// Types
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
  category?: { name: string; nameAr?: string; slug: string }
  createdAt: string
}

interface Category {
  id: string
  name: string
  nameAr?: string
  slug: string
  icon?: string
  color?: string
  _count?: { articles: number; courses: number }
}

// Sample articles with full content
const sampleArticles: Article[] = [
  {
    id: '1',
    title: 'مقدمة في البرمجة بلغة بايثون',
    titleAr: 'مقدمة في البرمجة بلغة بايثون',
    summary: 'تعلم أساسيات البرمجة باستخدام لغة بايثون من الصفر حتى الاحتراف. هذا الدليل الشامل يغطي المتغيرات، الدوال، الحلقات، والكائنات.',
    content: `# مقدمة في البرمجة بلغة بايثون

بايثون هي واحدة من أكثر لغات البرمجة شعبية في العالم، وتُستخدم في مجالات متعددة مثل تطوير الويب، تحليل البيانات، الذكاء الاصطناعي، والأتمتة.

## لماذا بايثون؟

1. **سهلة التعلم**: بناء جملة واضح وبسيط
2. **متعددة الاستخدامات**: تعمل على ويندوز، ماك، ولينكس
3. **مجتمع ضخم**: مكتبات وأدوات متعددة
4. **طلب عالي في سوق العمل**

## أول برنامج لك

\`\`\`python
print("مرحباً بالعالم!")
\`\`\`

## المتغيرات

\`\`\`python
name = "أحمد"
age = 25
price = 19.99
is_active = True
\`\`\`

## الدوال

\`\`\`python
def greet(name):
    return f"مرحباً، {name}!"

message = greet("محمد")
print(message)  # مرحباً، محمد!
\`\`\`

## الحلقات

\`\`\`python
for i in range(5):
    print(f"الرقم {i}")
\`\`\`

## الشروط

\`\`\`python
age = 18
if age >= 18:
    print("أنت بالغ")
else:
    print("أنت قاصر")
\`\`\`

## القوائم

\`\`\`python
fruits = ["تفاح", "موز", "برتقال"]
for fruit in fruits:
    print(fruit)
\`\`\`

## القواميس

\`\`\`python
person = {
    "name": "أحمد",
    "age": 25,
    "city": "القاهرة"
}
print(person["name"])  # أحمد
\`\`\`

هذا كان مجرد مقدمة بسيطة. في الدروس القادمة سنتعمق أكثر في لغة بايثون ونتعلم موضوعات متقدمة مثل البرمجة الكائنية والتعامل مع الملفات وقواعد البيانات.`,
    views: 15420,
    likes: 892,
    tags: 'برمجة, بايثون, تعلم, مبتدئين',
    category: { name: 'Programming', nameAr: 'البرمجة', slug: 'programming' },
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'كيف تبدأ في تعلم اللغة الإنجليزية',
    titleAr: 'كيف تبدأ في تعلم اللغة الإنجليزية',
    summary: 'دليل شامل للمبتدئين لتعلم اللغة الإنجليزية من الصفر. نصائح عملية وموارد مجانية.',
    content: `# كيف تبدأ في تعلم اللغة الإنجليزية

تعلم اللغة الإنجليزية يفتح لك أبواباً كثيرة في الحياة المهنية والشخصية.

## الخطوة الأولى: حدد هدفك

اسأل نفسك: لماذا أريد تعلم الإنجليزية؟
- للعمل
- للسفر
- للدراسة
- للمتعة

## الخطوة الثانية: ابدأ بالأساسيات

### الحروف والنطق
تعلم نطق الحروف بشكل صحيح

### الكلمات الشائعة
ابدأ بتعلم 100-500 كلمة شائعة مثل:
- Hello / مرحباً
- Goodbye / وداعاً
- Thank you / شكراً
- Please / من فضلك
- Yes / No / نعم / لا

### القواعد الأساسية
- الأزمنة (الماضي، الحاضر، المستقبل)
- الضمائر (I, You, He, She, It, We, They)
- الجمل البسيطة

## الخطوة الثالثة: الممارسة اليومية

- استمع لبودكاست بالإنجليزية
- شاهد أفلام بالترجمة
- تحدث مع نفسك
- اكتب يومياتك بالإنجليزية

## موارد مجانية مقترحة

1. **Duolingo** - تطبيق رائع للمبتدئين
2. **BBC Learning English** - دروس مجانية
3. **YouTube** - قنوات تعليمية كثيرة

## نصيحة أخيرة

الصبر هو مفتاح النجاح. لا تستسلم! التعلم يحتاج وقت وممارسة مستمرة.`,
    views: 28350,
    likes: 1456,
    tags: 'لغات, إنجليزي, تعلم, مبتدئين',
    category: { name: 'Languages', nameAr: 'اللغات', slug: 'languages' },
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'أساسيات التسويق الرقمي',
    titleAr: 'أساسيات التسويق الرقمي',
    summary: 'دليلك الشامل لفهم التسويق الرقمي وأدواته. تعلم كيف تصل لعملائك عبر الإنترنت.',
    content: `# أساسيات التسويق الرقمي

التسويق الرقمي أصبح ضرورة لكل عمل في العصر الحديث.

## ما هو التسويق الرقمي؟

استخدام القنوات الرقمية للوصول إلى العملاء والترويج للمنتجات والخدمات.

## قنوات التسويق الرقمي

### 1. تحسين محركات البحث (SEO)
- تحسين محتوى موقعك
- بناء روابط خلفية
- البحث عن الكلمات المفتاحية

### 2. التسويق عبر المحتوى
- المدونات
- الفيديوهات
- الإنفوجرافيك

### 3. التسويق عبر وسائل التواصل
- فيسبوك
- إنستغرام
- تويتر
- لينكد إن

### 4. الإعلانات المدفوعة
- Google Ads
- Facebook Ads
- Display Ads

### 5. التسويق عبر البريد الإلكتروني
- النشرات البريدية
- الحملات الترويجية

## كيف تبدأ؟

1. حدد جمهورك المستهدف
2. اختر القنوات المناسبة
3. أنشئ محتوى قيم
4. قس النتائج
5. حسّن باستمرار`,
    views: 12450,
    likes: 678,
    tags: 'تسويق, رقمي, أعمال, SEO',
    category: { name: 'Business', nameAr: 'الأعمال', slug: 'business' },
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'الصحة النفسية في الحياة اليومية',
    titleAr: 'الصحة النفسية في الحياة اليومية',
    summary: 'نصائح عملية للحفاظ على صحتك النفسية وتحسين جودة حياتك.',
    content: `# الصحة النفسية في الحياة اليومية

الصحة النفسية لا تقل أهمية عن الصحة الجسدية.

## علامات التوتر

- صعوبة في النوم
- فقدان الشهية أو الإفراط في الأكل
- العصبية والتوتر
- صعوبة التركيز

## طرق للتحسن

### 1. التمارين الرياضية
30 دقيقة يومياً تحسن مزاجك

### 2. النوم الكافي
7-9 ساعات للبالغين

### 3. التأمل واليوجا
10 دقائق يومياً تصنع فرقاً

### 4. التواصل الاجتماعي
تحدث مع الأصدقاء والعائلة

### 5. التقليل من وسائل التواصل
حدد وقتاً محدداً للتصفح

## متى تطلب المساعدة؟

- إذا استمرت الأعراض لأكثر من أسبوعين
- إذا أثرت على عملك وحياتك اليومية
- إذا شعرت باليأس المستمر

لا تخجل من طلب المساعدة من مختص.`,
    views: 19870,
    likes: 1023,
    tags: 'صحة, نفسية, حياة, نصائح',
    category: { name: 'Health', nameAr: 'الصحة', slug: 'health' },
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'تعلم تصميم الجرافيك من الصفر',
    titleAr: 'تعلم تصميم الجرافيك من الصفر',
    summary: 'دليل شامل للمبتدئين في عالم التصميم الجرافيكي. ابدأ رحلتك الإبداعية الآن.',
    content: `# تعلم تصميم الجرافيك من الصفر

التصميم الجرافيكي مهارة مطلوبة في عصرنا الرقمي.

## أساسيات التصميم

### الألوان
- دائرة الألوان
- الألوان المتممة
- الألوان المتشابهة
- درجات الحرارة (الساخنة والباردة)

### الخطوط
- اختيار الخط المناسب
- التسلسل الهرمي للنص
- المسافات بين الحروف

### التخطيط (Layout)
- الشبكة (Grid)
- المحاذاة
- المسافة البيضاء

## أدوات التصميم

### للمبتدئين (مجانية)
- **Canva** - سهل الاستخدام
- **Figma** - ممتاز للتصميم التفاعلي
- **GIMP** - بديل مجاني لفوتوشوب

### للمحترفين
- **Adobe Photoshop** - للصور
- **Adobe Illustrator** - للرسومات
- **Adobe InDesign** - للنشر

## كيف تبدأ؟

1. تعلم الأساسيات النظرية
2. اختر أداة واتقنها
3. طبق بالتقليد أولاً
4. طور أسلوبك الخاص
5. ابنِ معرض أعمالك`,
    views: 21340,
    likes: 1156,
    tags: 'تصميم, جرافيك, إبداع, مبتدئين',
    category: { name: 'Design', nameAr: 'التصميم', slug: 'design' },
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    title: 'الاستثمار للمبتدئين',
    titleAr: 'الاستثمار للمبتدئين',
    summary: 'دليلك الأول لفهم عالم الاستثمار. كيف تبدأ بمبلغ صغير وتبني ثروتك.',
    content: `# الاستثمار للمبتدئين

الاستثمار هو طريقة لجعل أموالك تنمو بمرور الوقت.

## لماذا الاستثمار مهم؟

- التغلب على التضخم
- بناء ثروة طويلة المدى
- تحقيق الأهداف المالية
- الأمان المالي للمستقبل

## أنواع الاستثمار

### 1. الأسهم
شراء حصة في شركة. عوائد عالية لكن مخاطرة أعلى.

### 2. السندات
إقراض أموال لحكومة أو شركة. عوائد أقل لكن أكثر أماناً.

### 3. الصناديق الاستثمارية
استثمار جماعي في محفظة متنوعة.

### 4. العقارات
شراء عقارات للتأجير أو البيع.

### 5. الذهب والمعادن الثمينة
ملاذ آمن في أوقات الأزمات.

## قواعد ذهبية

1. **لا تستثمر ما لا تستطيع خسارته**
2. **نوّع استثماراتك**
3. **فكر طويل المدى**
4. **ابدأ مبكراً**
5. **تعلم باستمرار**

## كيف تبدأ بمبلغ صغير؟

- استخدم تطبيقات الاستثمار
- ابدأ بصناديق المؤشرات (ETF)
- استثمر شهرياً بشكل منتظم`,
    views: 16780,
    likes: 892,
    tags: 'مال, استثمار, مبتدئين, ثروة',
    category: { name: 'Finance', nameAr: 'المال', slug: 'finance' },
    createdAt: new Date().toISOString(),
  },
]

const categories: Category[] = [
  { id: 'programming', name: 'Programming', nameAr: 'البرمجة', slug: 'programming', icon: 'Code', color: '#3B82F6', _count: { articles: 150, courses: 45 } },
  { id: 'languages', name: 'Languages', nameAr: 'اللغات', slug: 'languages', icon: 'Languages', color: '#EC4899', _count: { articles: 80, courses: 25 } },
  { id: 'business', name: 'Business', nameAr: 'الأعمال', slug: 'business', icon: 'Briefcase', color: '#EF4444', _count: { articles: 120, courses: 30 } },
  { id: 'health', name: 'Health', nameAr: 'الصحة', slug: 'health', icon: 'Heart', color: '#14B8A6', _count: { articles: 90, courses: 20 } },
  { id: 'design', name: 'Design', nameAr: 'التصميم', slug: 'design', icon: 'Palette', color: '#8B5CF6', _count: { articles: 65, courses: 18 } },
  { id: 'finance', name: 'Finance', nameAr: 'المال', slug: 'finance', icon: 'Calculator', color: '#F59E0B', _count: { articles: 75, courses: 22 } },
  { id: 'science', name: 'Science', nameAr: 'العلوم', slug: 'science', icon: 'Globe', color: '#6366F1', _count: { articles: 200, courses: 35 } },
]

// Category Icon Component
function CategoryIcon({ icon, className }: { icon?: string; className?: string }) {
  const iconMap: Record<string, React.ReactNode> = {
    'Code': <Code className={className} />,
    'Database': <Database className={className} />,
    'Calculator': <Calculator className={className} />,
    'Briefcase': <Briefcase className={className} />,
    'Palette': <Palette className={className} />,
    'Languages': <Languages className={className} />,
    'Heart': <Heart className={className} />,
    'Globe': <Globe className={className} />,
  }
  return <>{iconMap[icon || 'Globe']}</>
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [activeTab, setActiveTab] = useState('home')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [articles] = useState<Article[]>(sampleArticles)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'article'>('list')
  
  // Filter articles
  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const matchesSearch = searchQuery === '' || 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.titleAr?.includes(searchQuery) ||
        article.summary?.includes(searchQuery) ||
        article.tags?.includes(searchQuery)
      
      const matchesCategory = selectedCategory === 'all' || 
        article.category?.slug === selectedCategory
      
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory, articles])

  const popularArticles = useMemo(() => {
    return [...articles].sort((a, b) => b.views - a.views)
  }, [articles])

  // Open article
  const handleOpenArticle = useCallback((article: Article) => {
    setSelectedArticle(article)
    setViewMode('article')
    setIsSidebarOpen(false)
  }, [])

  // Close article
  const handleCloseArticle = useCallback(() => {
    setSelectedArticle(null)
    setViewMode('list')
  }, [])

  // Handle category click
  const handleCategoryClick = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId)
    setActiveTab('home')
    setViewMode('list')
    setIsSidebarOpen(false)
  }, [])

  // Article View
  if (viewMode === 'article' && selectedArticle) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white" dir="rtl">
        <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                onClick={handleCloseArticle}
                className="gap-2 hover:bg-emerald-50"
              >
                <ArrowRight className="w-4 h-4" />
                العودة للمقالات
              </Button>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 gap-1">
                <BookMarked className="w-3 h-3" />
                قراءة داخل الموقع
              </Badge>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <article className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-lg">
              <CardHeader className="border-b bg-gradient-to-r from-emerald-50 to-teal-50 rounded-t-lg">
                <div className="flex items-center gap-2 mb-4">
                  {selectedArticle.category && (
                    <Badge 
                      className="text-white px-3 py-1"
                      style={{ 
                        backgroundColor: categories.find(c => c.slug === selectedArticle.category?.slug)?.color || '#6366F1' 
                      }}
                    >
                      {selectedArticle.category.nameAr || selectedArticle.category.name}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-3xl font-bold leading-tight text-slate-800">
                  {selectedArticle.titleAr || selectedArticle.title}
                </CardTitle>
                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-slate-500">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4 text-emerald-500" />
                    <span>{selectedArticle.views.toLocaleString()} مشاهدة</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span>{selectedArticle.likes} إعجاب</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span>آخر تحديث: اليوم</span>
                  </div>
                </div>
                {selectedArticle.tags && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {selectedArticle.tags.split(',').map((tag, i) => (
                      <Badge key={i} variant="outline" className="hover:bg-emerald-50 cursor-pointer">
                        {tag.trim()}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardHeader>
              <CardContent className="p-6 md:p-8">
                {selectedArticle.summary && (
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-r-4 border-emerald-500 p-4 mb-8 rounded-lg">
                    <p className="text-emerald-800 font-medium text-lg mb-0">{selectedArticle.summary}</p>
                  </div>
                )}
                <div className="prose prose-lg max-w-none">
                  <div className="whitespace-pre-wrap leading-relaxed text-slate-700 text-lg font-[system-ui]">
                    {selectedArticle.content}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-slate-50 rounded-b-lg p-6">
                <div className="flex flex-wrap gap-3 w-full justify-between items-center">
                  <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                      <Heart className="w-4 h-4" />
                      أعجبني
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <BookMarked className="w-4 h-4" />
                      حفظ
                    </Button>
                  </div>
                  <Button 
                    onClick={handleCloseArticle}
                    className="bg-emerald-600 hover:bg-emerald-700 gap-2"
                  >
                    العودة للمقالات
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>

            {/* Related Articles */}
            <div className="mt-8">
              <h3 className="text-xl font-bold text-slate-800 mb-4">مقالات ذات صلة</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {articles
                  .filter(a => a.id !== selectedArticle.id && a.category?.slug === selectedArticle.category?.slug)
                  .slice(0, 2)
                  .map(article => (
                    <Card 
                      key={article.id}
                      className="cursor-pointer hover:shadow-lg transition-all hover:ring-2 hover:ring-emerald-200"
                      onClick={() => handleOpenArticle(article)}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{article.titleAr}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-slate-600 line-clamp-2">{article.summary}</p>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          </article>
        </main>

        <footer className="bg-slate-900 text-white py-6 mt-auto">
          <div className="container mx-auto px-4 text-center">
            <p className="text-slate-400">© 2025 المكتبة التعليمية - جميع الحقوق محفوظة</p>
          </div>
        </footer>
      </div>
    )
  }

  // Main List View
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <button 
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              onClick={() => { setViewMode('list'); setSelectedCategory('all'); }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  المكتبة التعليمية
                </h1>
                <p className="text-xs text-slate-500">كل المحتوى في مكان واحد</p>
              </div>
            </button>

            <div className="flex-1 max-w-xl mx-4">
              <div className="relative w-full">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type="search"
                  placeholder="ابحث في المقالات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 h-11 bg-slate-100 border-0 focus-visible:ring-emerald-500 focus-visible:bg-white transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hidden sm:flex gap-1">
                <FileText className="w-3 h-3" />
                {articles.length} مقال
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className={`
          fixed md:sticky top-[65px] right-0 h-[calc(100vh-65px)] w-72 bg-white border-l z-40
          transform transition-transform duration-300 md:translate-x-0 overflow-y-auto
          ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
        `}>
          <div className="p-4 space-y-6">
            <div>
              <h3 className="font-bold text-slate-700 mb-3">التصنيفات</h3>
              <div className="space-y-1">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'ghost'}
                  className={`w-full justify-start ${selectedCategory === 'all' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
                  onClick={() => handleCategoryClick('all')}
                >
                  <Globe className="w-4 h-4 ml-2" />
                  جميع المقالات
                </Button>
                {categories.map(cat => (
                  <Button
                    key={cat.id}
                    variant={selectedCategory === cat.slug ? 'default' : 'ghost'}
                    className={`w-full justify-start ${selectedCategory === cat.slug ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
                    onClick={() => handleCategoryClick(cat.slug)}
                  >
                    <CategoryIcon icon={cat.icon} className="w-4 h-4 ml-2" />
                    {cat.nameAr || cat.name}
                    <Badge variant="secondary" className="mr-auto text-xs">
                      {cat._count?.articles || 0}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500" />
                الأكثر قراءة
              </h3>
              <div className="space-y-2">
                {popularArticles.slice(0, 5).map((article, i) => (
                  <button
                    key={article.id}
                    onClick={() => handleOpenArticle(article)}
                    className="w-full text-right p-3 rounded-lg hover:bg-emerald-50 text-sm transition-colors border border-transparent hover:border-emerald-200"
                  >
                    <span className="text-emerald-600 font-bold ml-1">{i + 1}.</span>
                    {article.titleAr || article.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-slate-100 p-1 mb-6">
              <TabsTrigger value="home" className="data-[state=active]:bg-white data-[state=active]:text-emerald-600">
                <BookOpen className="w-4 h-4 ml-2" />
                المقالات
              </TabsTrigger>
              <TabsTrigger value="courses" className="data-[state=active]:bg-white data-[state=active]:text-emerald-600">
                <GraduationCap className="w-4 h-4 ml-2" />
                الكورسات
              </TabsTrigger>
            </TabsList>

            {/* Articles Tab */}
            <TabsContent value="home" className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <p className="text-slate-600">
                  <span className="font-bold text-emerald-600">{filteredArticles.length}</span> مقال متاح
                  {selectedCategory !== 'all' && (
                    <span className="mr-2">
                      في قسم <Badge className="bg-emerald-100 text-emerald-700">
                        {categories.find(c => c.slug === selectedCategory)?.nameAr}
                      </Badge>
                    </span>
                  )}
                </p>
                {selectedCategory !== 'all' && (
                  <Button variant="outline" size="sm" onClick={() => setSelectedCategory('all')} className="gap-2">
                    <X className="w-4 h-4" />
                    مسح الفلتر
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map(article => (
                  <Card 
                    key={article.id} 
                    className="group hover:shadow-xl transition-all duration-300 cursor-pointer hover:ring-2 hover:ring-emerald-200 border-0 shadow-md"
                    onClick={() => handleOpenArticle(article)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <Badge 
                          style={{ backgroundColor: categories.find(c => c.slug === article.category?.slug)?.color || '#6366F1' }}
                          className="text-white"
                        >
                          {article.category?.nameAr || article.category?.name || 'عام'}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Eye className="w-3 h-3" />
                          {article.views.toLocaleString()}
                        </div>
                      </div>
                      <CardTitle className="text-lg line-clamp-2 mt-2 group-hover:text-emerald-600 transition-colors">
                        {article.titleAr || article.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <p className="text-sm text-slate-600 line-clamp-3">
                        {article.summary}
                      </p>
                      {article.tags && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {article.tags.split(',').slice(0, 3).map((tag, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{tag.trim()}</Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 group-hover:bg-emerald-700 gap-2">
                        اقرأ المقال
                        <ChevronRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {filteredArticles.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-700">لا توجد مقالات</h3>
                  <p className="text-slate-500 mt-2">جرب تغيير البحث أو الفلتر</p>
                  <Button 
                    variant="outline" 
                    className="mt-4" 
                    onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                  >
                    مسح الفلاتر
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Courses Tab */}
            <TabsContent value="courses" className="space-y-6">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border-2 border-emerald-200">
                <div className="flex items-center gap-3 mb-4">
                  <GraduationCap className="w-8 h-8 text-emerald-600" />
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">الكورسات التعليمية</h2>
                    <p className="text-slate-600">دروس كاملة داخل الموقع</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                  {categories.map(cat => (
                    <Card 
                      key={cat.id} 
                      className="hover:shadow-lg transition-all cursor-pointer hover:ring-2 hover:ring-emerald-200 border-0 shadow-md"
                      onClick={() => handleCategoryClick(cat.slug)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-12 h-12 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: cat.color + '20' }}
                          >
                            <CategoryIcon icon={cat.icon} className="w-6 h-6" style={{ color: cat.color }} />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{cat.nameAr || cat.name}</CardTitle>
                            <CardDescription>{cat._count?.courses || 0} كورس متاح</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-slate-600 mb-3">
                          تعلم {cat.nameAr} من الصفر حتى الاحتراف مع كورسات مجانية
                        </p>
                        <div className="flex gap-2">
                          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                            <Video className="w-3 h-3 ml-1" />
                            فيديو
                          </Badge>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                            <FileText className="w-3 h-3 ml-1" />
                            نصوص
                          </Badge>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          className="w-full bg-emerald-600 hover:bg-emerald-700 gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCategoryClick(cat.slug);
                            setActiveTab('home');
                          }}
                        >
                          استعرض المقالات
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">المكتبة التعليمية</h3>
              </div>
              <p className="text-slate-400">
                بوابة تعليمية شاملة - كل المحتوى في مكان واحد
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">التصنيفات</h4>
              <div className="flex flex-wrap gap-2">
                {categories.slice(0, 6).map(cat => (
                  <Badge 
                    key={cat.id} 
                    variant="secondary" 
                    className="bg-slate-800 cursor-pointer hover:bg-slate-700"
                    onClick={() => handleCategoryClick(cat.slug)}
                  >
                    {cat.nameAr || cat.name}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">إحصائيات</h4>
              <div className="space-y-2 text-slate-400">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-500" />
                  <span>{articles.length}+ مقال</span>
                </div>
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-emerald-500" />
                  <span>150+ درس فيديو</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-500">
            <p>© 2025 المكتبة التعليمية - جميع الحقوق محفوظة</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
