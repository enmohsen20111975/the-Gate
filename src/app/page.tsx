'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  ExternalLink,
  Filter,
  Sparkles,
  Database,
  Menu,
  X,
  RefreshCw,
  Loader2
} from 'lucide-react'

// Types
interface Course {
  id: string
  title: string
  titleAr?: string
  description?: string
  descriptionAr?: string
  url: string
  imageUrl?: string
  instructor?: string
  duration?: string
  level?: string
  rating?: number
  enrollments?: string
  price?: string
  certificate: boolean
  isFree: boolean
  featured: boolean
  tags?: string
  categoryId: string
  languageId: string
  platformId: string
  category?: { name: string; nameAr?: string; slug: string }
  language?: { name: string; code: string }
  platform?: { name: string; url: string; slug: string }
}

interface Category {
  id: string
  name: string
  nameAr?: string
  slug: string
  icon?: string
  color?: string
  _count?: { courses: number }
}

interface Language {
  id: string
  name: string
  code: string
  _count?: { courses: number }
}

interface Platform {
  id: string
  name: string
  slug: string
  url: string
  logo?: string
  _count?: { courses: number }
}

// Static data for initial display (used as fallback)
const staticCourses: Course[] = [
  {
    id: '1',
    title: 'CS50\'s Introduction to Computer Science',
    titleAr: 'مقدمة في علوم الحاسوب - CS50',
    description: 'Harvard University\'s introduction to the intellectual enterprises of computer science and the art of programming.',
    descriptionAr: 'مقدمة جامعة هارفارد في مشاريع علوم الحاسوب الفكرية وفن البرمجة.',
    url: 'https://cs50.harvard.edu/x/',
    instructor: 'David J. Malan',
    duration: '12 weeks',
    level: 'beginner',
    rating: 4.9,
    enrollments: '4M+',
    price: 'Free',
    certificate: true,
    isFree: true,
    featured: true,
    categoryId: 'programming',
    languageId: 'en',
    platformId: 'harvard',
    category: { name: 'Programming', nameAr: 'البرمجة', slug: 'programming' },
    language: { name: 'English', code: 'en' },
    platform: { name: 'Harvard Online', url: 'https://online-learning.harvard.edu', slug: 'harvard' }
  },
  {
    id: '2',
    title: 'freeCodeCamp - Full Stack Development',
    titleAr: 'تطوير الويب الشامل - freeCodeCamp',
    description: 'Learn to code for free. Earn certifications. Get hired.',
    descriptionAr: 'تعلم البرمجة مجاناً. احصل على الشهادات. ابدأ عملك.',
    url: 'https://www.freecodecamp.org',
    duration: '3000+ hours',
    level: 'beginner',
    rating: 4.8,
    enrollments: '50M+',
    price: 'Free',
    certificate: true,
    isFree: true,
    featured: true,
    categoryId: 'programming',
    languageId: 'en',
    platformId: 'freecodecamp',
    category: { name: 'Programming', nameAr: 'البرمجة', slug: 'programming' },
    language: { name: 'English', code: 'en' },
    platform: { name: 'freeCodeCamp', url: 'https://www.freecodecamp.org', slug: 'freecodecamp' }
  },
  {
    id: '3',
    title: 'Machine Learning by Andrew Ng',
    titleAr: 'تعلم الآلة مع أندرو إنج',
    description: 'A foundational course in machine learning by Stanford University.',
    descriptionAr: 'دورة أساسية في تعلم الآلة من جامعة ستانفورد.',
    url: 'https://www.coursera.org/learn/machine-learning',
    instructor: 'Andrew Ng',
    duration: '11 weeks',
    level: 'intermediate',
    rating: 4.9,
    enrollments: '5M+',
    price: 'Free to audit',
    certificate: true,
    isFree: true,
    featured: true,
    categoryId: 'datascience',
    languageId: 'en',
    platformId: 'coursera',
    category: { name: 'Data Science', nameAr: 'علم البيانات', slug: 'datascience' },
    language: { name: 'English', code: 'en' },
    platform: { name: 'Coursera', url: 'https://www.coursera.org', slug: 'coursera' }
  },
  {
    id: '4',
    title: 'Khan Academy - Mathematics',
    titleAr: 'أكاديمية خان - الرياضيات',
    description: 'Free world-class education for anyone, anywhere.',
    descriptionAr: 'تعليم مجاني عالمي المستوى لأي شخص في أي مكان.',
    url: 'https://www.khanacademy.org/math',
    duration: 'Self-paced',
    level: 'beginner',
    rating: 4.8,
    price: 'Free',
    certificate: false,
    isFree: true,
    featured: false,
    categoryId: 'math',
    languageId: 'en',
    platformId: 'khanacademy',
    category: { name: 'Mathematics', nameAr: 'الرياضيات', slug: 'math' },
    language: { name: 'English', code: 'en' },
    platform: { name: 'Khan Academy', url: 'https://www.khanacademy.org', slug: 'khanacademy' }
  },
  {
    id: '5',
    title: 'MIT OpenCourseWare - Computer Science',
    titleAr: 'معهد ماساتشوستس - علوم الحاسوب',
    description: 'Free lecture notes, exams, and videos from MIT.',
    descriptionAr: 'محاضرات واختبارات ومقاطع فيديو مجانية من MIT.',
    url: 'https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/',
    duration: 'Self-paced',
    level: 'intermediate',
    rating: 4.9,
    price: 'Free',
    certificate: false,
    isFree: true,
    featured: true,
    categoryId: 'programming',
    languageId: 'en',
    platformId: 'mit',
    category: { name: 'Programming', nameAr: 'البرمجة', slug: 'programming' },
    language: { name: 'English', code: 'en' },
    platform: { name: 'MIT OpenCourseWare', url: 'https://ocw.mit.edu', slug: 'mit' }
  },
  {
    id: '6',
    title: 'edX - Data Science Fundamentals',
    titleAr: 'أساسيات علم البيانات - edX',
    description: 'Learn data science fundamentals from top universities.',
    descriptionAr: 'تعلم أساسيات علم البيانات من أفضل الجامعات.',
    url: 'https://www.edx.org/learn/data-science',
    duration: '8 weeks',
    level: 'beginner',
    rating: 4.7,
    price: 'Free to audit',
    certificate: true,
    isFree: true,
    featured: false,
    categoryId: 'datascience',
    languageId: 'en',
    platformId: 'edx',
    category: { name: 'Data Science', nameAr: 'علم البيانات', slug: 'datascience' },
    language: { name: 'English', code: 'en' },
    platform: { name: 'edX', url: 'https://www.edx.org', slug: 'edx' }
  },
  {
    id: '7',
    title: 'Google Digital Marketing Course',
    titleAr: 'دورة التسويق الرقمي من جوجل',
    description: 'Master the basics of digital marketing with Google\'s free course.',
    descriptionAr: 'أتقن أساسيات التسويق الرقمي مع دورة جوجل المجانية.',
    url: 'https://learndigital.withgoogle.com/digitalgarage',
    duration: '40 hours',
    level: 'beginner',
    rating: 4.6,
    enrollments: '1M+',
    price: 'Free',
    certificate: true,
    isFree: true,
    featured: false,
    categoryId: 'business',
    languageId: 'en',
    platformId: 'google',
    category: { name: 'Business', nameAr: 'الأعمال', slug: 'business' },
    language: { name: 'English', code: 'en' },
    platform: { name: 'Google Digital Garage', url: 'https://learndigital.withgoogle.com', slug: 'google' }
  },
  {
    id: '8',
    title: 'Python for Everybody',
    titleAr: 'بايثون للجميع',
    description: 'Learn to program and analyze data with Python.',
    descriptionAr: 'تعلم البرمجة وتحليل البيانات باستخدام بايثون.',
    url: 'https://www.py4e.com/',
    instructor: 'Charles Severance',
    duration: '8 weeks',
    level: 'beginner',
    rating: 4.8,
    price: 'Free',
    certificate: true,
    isFree: true,
    featured: true,
    categoryId: 'programming',
    languageId: 'en',
    platformId: 'py4e',
    category: { name: 'Programming', nameAr: 'البرمجة', slug: 'programming' },
    language: { name: 'English', code: 'en' },
    platform: { name: 'Py4E', url: 'https://www.py4e.com', slug: 'py4e' }
  },
  {
    id: '9',
    title: 'Coursera - Learning How to Learn',
    titleAr: 'تعلم كيف تتعلم',
    description: 'Powerful mental tools to help you master tough subjects.',
    descriptionAr: 'أدوات ذهنية قوية لمساعدتك على إتقان المواد الصعبة.',
    url: 'https://www.coursera.org/learn/learning-how-to-learn',
    instructor: 'Barbara Oakley',
    duration: '4 weeks',
    level: 'beginner',
    rating: 4.8,
    enrollments: '3M+',
    price: 'Free to audit',
    certificate: true,
    isFree: true,
    featured: false,
    categoryId: 'personal',
    languageId: 'en',
    platformId: 'coursera',
    category: { name: 'Personal Development', nameAr: 'التطور الشخصي', slug: 'personal' },
    language: { name: 'English', code: 'en' },
    platform: { name: 'Coursera', url: 'https://www.coursera.org', slug: 'coursera' }
  },
  {
    id: '10',
    title: 'The Odin Project - Full Stack JavaScript',
    titleAr: 'مشروع أودين - تطوير الويب الكامل',
    description: 'Learn web development for free with this comprehensive curriculum.',
    descriptionAr: 'تعلم تطوير الويب مجاناً مع هذه المنهجية الشاملة.',
    url: 'https://www.theodinproject.com/',
    duration: '1000+ hours',
    level: 'beginner',
    rating: 4.9,
    price: 'Free',
    certificate: false,
    isFree: true,
    featured: true,
    categoryId: 'programming',
    languageId: 'en',
    platformId: 'odin',
    category: { name: 'Programming', nameAr: 'البرمجة', slug: 'programming' },
    language: { name: 'English', code: 'en' },
    platform: { name: 'The Odin Project', url: 'https://www.theodinproject.com', slug: 'odin' }
  },
  {
    id: '11',
    title: 'Duolingo - Learn Languages',
    titleAr: 'دولينجو - تعلم اللغات',
    description: 'Learn a new language for free with the world\'s most-downloaded education app.',
    descriptionAr: 'تعلم لغة جديدة مجاناً مع التطبيق الأكثر تحميلاً في العالم.',
    url: 'https://www.duolingo.com/',
    duration: 'Self-paced',
    level: 'beginner',
    rating: 4.7,
    enrollments: '500M+',
    price: 'Free',
    certificate: false,
    isFree: true,
    featured: false,
    categoryId: 'languages',
    languageId: 'en',
    platformId: 'duolingo',
    category: { name: 'Languages', nameAr: 'اللغات', slug: 'languages' },
    language: { name: 'English', code: 'en' },
    platform: { name: 'Duolingo', url: 'https://www.duolingo.com', slug: 'duolingo' }
  },
  {
    id: '12',
    title: 'مقدمة في البرمجة بلغة Python',
    description: 'دورة تعليمية شاملة لتعلم أساسيات البرمجة بلغة بايثون.',
    url: 'https://www.almentor.net/courses/python-intro',
    duration: '20 hours',
    level: 'beginner',
    rating: 4.6,
    price: 'Free',
    certificate: true,
    isFree: true,
    featured: true,
    categoryId: 'programming',
    languageId: 'ar',
    platformId: 'almentor',
    category: { name: 'Programming', nameAr: 'البرمجة', slug: 'programming' },
    language: { name: 'Arabic', code: 'ar' },
    platform: { name: 'Almentor', url: 'https://www.almentor.net', slug: 'almentor' }
  }
]

const staticCategories: Category[] = [
  { id: 'programming', name: 'Programming', nameAr: 'البرمجة', slug: 'programming', icon: 'Code', color: '#3B82F6' },
  { id: 'datascience', name: 'Data Science', nameAr: 'علم البيانات', slug: 'datascience', icon: 'Database', color: '#10B981' },
  { id: 'math', name: 'Mathematics', nameAr: 'الرياضيات', slug: 'math', icon: 'Calculator', color: '#F59E0B' },
  { id: 'business', name: 'Business', nameAr: 'الأعمال', slug: 'business', icon: 'Briefcase', color: '#EF4444' },
  { id: 'design', name: 'Design', nameAr: 'التصميم', slug: 'design', icon: 'Palette', color: '#8B5CF6' },
  { id: 'languages', name: 'Languages', nameAr: 'اللغات', slug: 'languages', icon: 'Languages', color: '#EC4899' },
  { id: 'personal', name: 'Personal Development', nameAr: 'التطور الشخصي', slug: 'personal', icon: 'Heart', color: '#14B8A6' },
  { id: 'science', name: 'Science', nameAr: 'العلوم', slug: 'science', icon: 'Globe', color: '#6366F1' },
]

const staticLanguages: Language[] = [
  { id: 'en', name: 'English', code: 'en' },
  { id: 'ar', name: 'العربية', code: 'ar' },
  { id: 'fr', name: 'Français', code: 'fr' },
  { id: 'es', name: 'Español', code: 'es' },
  { id: 'de', name: 'Deutsch', code: 'de' },
]

const staticPlatforms: Platform[] = [
  { id: 'coursera', name: 'Coursera', slug: 'coursera', url: 'https://www.coursera.org' },
  { id: 'edx', name: 'edX', slug: 'edx', url: 'https://www.edx.org' },
  { id: 'khanacademy', name: 'Khan Academy', slug: 'khanacademy', url: 'https://www.khanacademy.org' },
  { id: 'freecodecamp', name: 'freeCodeCamp', slug: 'freecodecamp', url: 'https://www.freecodecamp.org' },
  { id: 'mit', name: 'MIT OpenCourseWare', slug: 'mit', url: 'https://ocw.mit.edu' },
  { id: 'harvard', name: 'Harvard Online', slug: 'harvard', url: 'https://online-learning.harvard.edu' },
  { id: 'google', name: 'Google Digital Garage', slug: 'google', url: 'https://learndigital.withgoogle.com' },
  { id: 'odin', name: 'The Odin Project', slug: 'odin', url: 'https://www.theodinproject.com' },
  { id: 'duolingo', name: 'Duolingo', slug: 'duolingo', url: 'https://www.duolingo.com' },
  { id: 'almentor', name: 'Almentor', slug: 'almentor', url: 'https://www.almentor.net' },
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
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all')
  const [selectedLevel, setSelectedLevel] = useState<string>('all')
  const [activeTab, setActiveTab] = useState('courses')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSeeding, setIsSeeding] = useState(false)
  
  // Data from API
  const [courses, setCourses] = useState<Course[]>(staticCourses)
  const [categories, setCategories] = useState<Category[]>(staticCategories)
  const [languages, setLanguages] = useState<Language[]>(staticLanguages)
  const [platforms, setPlatforms] = useState<Platform[]>(staticPlatforms)
  
  // Fetch data from API
  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [coursesRes, categoriesRes, platformsRes, languagesRes] = await Promise.all([
        fetch('/api/courses'),
        fetch('/api/categories'),
        fetch('/api/platforms'),
        fetch('/api/languages'),
      ])
      
      if (coursesRes.ok) {
        const data = await coursesRes.json()
        if (data.success && data.data.length > 0) {
          setCourses(data.data)
        }
      }
      
      if (categoriesRes.ok) {
        const data = await categoriesRes.json()
        if (data.success && data.data.length > 0) {
          setCategories(data.data)
        }
      }
      
      if (platformsRes.ok) {
        const data = await platformsRes.json()
        if (data.success && data.data.length > 0) {
          setPlatforms(data.data)
        }
      }
      
      if (languagesRes.ok) {
        const data = await languagesRes.json()
        if (data.success && data.data.length > 0) {
          setLanguages(data.data)
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])
  
  // Seed database
  const seedDatabase = async () => {
    setIsSeeding(true)
    try {
      const res = await fetch('/api/seed', { method: 'POST' })
      if (res.ok) {
        await fetchData()
      }
    } catch (error) {
      console.error('Error seeding database:', error)
    } finally {
      setIsSeeding(false)
    }
  }
  
  useEffect(() => {
    fetchData()
  }, [fetchData])
  
  // Filter courses
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = searchQuery === '' || 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.titleAr?.includes(searchQuery) ||
        course.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.descriptionAr?.includes(searchQuery) ||
        course.tags?.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesCategory = selectedCategory === 'all' || 
        course.category?.slug === selectedCategory ||
        course.categoryId === selectedCategory
      const matchesLanguage = selectedLanguage === 'all' || 
        course.language?.code === selectedLanguage ||
        course.languageId === selectedLanguage
      const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel
      
      return matchesSearch && matchesCategory && matchesLanguage && matchesLevel
    })
  }, [searchQuery, selectedCategory, selectedLanguage, selectedLevel, courses])

  const featuredCourses = filteredCourses.filter(c => c.featured)
  const regularCourses = filteredCourses.filter(c => !c.featured)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  كورسات مجانية
                </h1>
                <p className="text-xs text-slate-500">Free Courses Hub</p>
              </div>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-xl">
              <div className="relative w-full">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type="search"
                  placeholder="ابحث عن كورس... (Search for a course...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 h-11 bg-slate-100 border-0 focus-visible:ring-emerald-500"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={seedDatabase}
                disabled={isSeeding}
                className="hidden sm:flex"
              >
                {isSeeding ? (
                  <Loader2 className="w-4 h-4 animate-spin ml-2" />
                ) : (
                  <RefreshCw className="w-4 h-4 ml-2" />
                )}
                تحديث البيانات
              </Button>
              
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>

              {/* Stats */}
              <div className="hidden lg:flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold">{courses.length}+ كورس</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold">{platforms.length}+ منصة</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar - Mobile */}
          <div className="md:hidden mt-3">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type="search"
                placeholder="ابحث عن كورس..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 h-11 bg-slate-100 border-0"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed md:sticky top-[73px] md:top-[73px] right-0 h-[calc(100vh-73px)] w-72 bg-white border-l z-40
          transform transition-transform duration-300 md:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
        `}>
          <div className="p-4 space-y-6 overflow-y-auto h-full">
            {/* Categories */}
            <div>
              <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                التصنيفات
              </h3>
              <div className="space-y-1">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'ghost'}
                  className={`w-full justify-start ${selectedCategory === 'all' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
                  onClick={() => setSelectedCategory('all')}
                >
                  <Globe className="w-4 h-4 ml-2" />
                  جميع الكورسات
                </Button>
                {categories.map(cat => (
                  <Button
                    key={cat.id}
                    variant={selectedCategory === cat.id || selectedCategory === cat.slug ? 'default' : 'ghost'}
                    className={`w-full justify-start ${selectedCategory === cat.id || selectedCategory === cat.slug ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
                    onClick={() => setSelectedCategory(cat.slug || cat.id)}
                  >
                    <CategoryIcon icon={cat.icon} className="w-4 h-4 ml-2" />
                    {cat.nameAr || cat.name}
                    {cat._count && (
                      <Badge variant="secondary" className="mr-auto text-xs">
                        {cat._count.courses}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div>
              <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                <Languages className="w-4 h-4" />
                اللغة
              </h3>
              <div className="space-y-1">
                <Button
                  variant={selectedLanguage === 'all' ? 'default' : 'ghost'}
                  className={`w-full justify-start ${selectedLanguage === 'all' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
                  onClick={() => setSelectedLanguage('all')}
                >
                  جميع اللغات
                </Button>
                {languages.map(lang => (
                  <Button
                    key={lang.id}
                    variant={selectedLanguage === lang.id || selectedLanguage === lang.code ? 'default' : 'ghost'}
                    className={`w-full justify-start ${selectedLanguage === lang.id || selectedLanguage === lang.code ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
                    onClick={() => setSelectedLanguage(lang.code || lang.id)}
                  >
                    {lang.name}
                    {lang._count && (
                      <Badge variant="secondary" className="mr-auto text-xs">
                        {lang._count.courses}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            </div>

            {/* Level */}
            <div>
              <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                المستوى
              </h3>
              <div className="space-y-1">
                {[
                  { value: 'all', label: 'جميع المستويات' },
                  { value: 'beginner', label: 'مبتدئ' },
                  { value: 'intermediate', label: 'متوسط' },
                  { value: 'advanced', label: 'متقدم' },
                ].map(level => (
                  <Button
                    key={level.value}
                    variant={selectedLevel === level.value ? 'default' : 'ghost'}
                    className={`w-full justify-start ${selectedLevel === level.value ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
                    onClick={() => setSelectedLevel(level.value)}
                  >
                    {level.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6">
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="bg-slate-100 p-1">
              <TabsTrigger value="courses" className="data-[state=active]:bg-white data-[state=active]:text-emerald-600">
                <BookOpen className="w-4 h-4 ml-2" />
                الكورسات
              </TabsTrigger>
              <TabsTrigger value="platforms" className="data-[state=active]:bg-white data-[state=active]:text-emerald-600">
                <Globe className="w-4 h-4 ml-2" />
                المنصات
              </TabsTrigger>
              <TabsTrigger value="mawdoo3" className="data-[state=active]:bg-white data-[state=active]:text-emerald-600">
                <Database className="w-4 h-4 ml-2" />
                موسوعة موضوع
              </TabsTrigger>
            </TabsList>

          <TabsContent value="courses" className="space-y-6">
            {/* Results Count */}
            <div className="flex items-center justify-between">
              <p className="text-slate-600">
                تم العثور على <span className="font-bold text-emerald-600">{filteredCourses.length}</span> كورس
              </p>
              {(selectedCategory !== 'all' || selectedLanguage !== 'all' || selectedLevel !== 'all' || searchQuery) && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setSelectedCategory('all')
                    setSelectedLanguage('all')
                    setSelectedLevel('all')
                    setSearchQuery('')
                  }}
                >
                  <X className="w-4 h-4 ml-1" />
                  مسح الفلاتر
                </Button>
              )}
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
              </div>
            )}

            {/* Featured Courses */}
            {!isLoading && featuredCourses.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <h2 className="text-xl font-bold text-slate-800">كورسات مميزة</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {featuredCourses.map(course => (
                    <CourseCard key={course.id} course={course} featured />
                  ))}
                </div>
              </div>
            )}

            {/* Regular Courses */}
            {!isLoading && regularCourses.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-4">جميع الكورسات</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {regularCourses.map(course => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {!isLoading && filteredCourses.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-700">لم يتم العثور على كورسات</h3>
                <p className="text-slate-500 mt-2">جرب تغيير معايير البحث أو الفلاتر</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="platforms" className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800">منصات التعلم المجانية</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {platforms.map(platform => {
                const platformCourses = courses.filter(c => 
                  c.platform?.slug === platform.slug || c.platformId === platform.id
                )
                return (
                  <Card key={platform.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="w-5 h-5 text-emerald-600" />
                        {platform.name}
                      </CardTitle>
                      <CardDescription>
                        {platformCourses.length} كورس متاح
                      </CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700">
                        <a href={platform.url} target="_blank" rel="noopener noreferrer">
                          زيارة المنصة
                          <ExternalLink className="w-4 h-4 mr-2" />
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="mawdoo3" className="space-y-6">
            <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Database className="w-6 h-6 text-emerald-600" />
                  موسوعة موضوع - Mawdoo3
                </CardTitle>
                <CardDescription className="text-base">
                  أكبر موسوعة عربية على الإنترنت مع أكثر من 100 مليون زائر شهرياً
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-700 leading-relaxed">
                  موقع موضوع (Mawdoo3) هو أكبر موقع عربي بالعالم، يقدم محتوى عربي غني ومتنوع في جميع المجالات.
                  يحتوي على آلاف المقالات في مختلف التصنيفات مثل العلوم، التقنية، الصحة، الأعمال، والكثير أكثر.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-lg text-center shadow-sm">
                    <div className="text-2xl font-bold text-emerald-600">+100M</div>
                    <div className="text-sm text-slate-600">زائر شهرياً</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg text-center shadow-sm">
                    <div className="text-2xl font-bold text-emerald-600">+1M</div>
                    <div className="text-sm text-slate-600">مقال</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg text-center shadow-sm">
                    <div className="text-2xl font-bold text-emerald-600">+20</div>
                    <div className="text-sm text-slate-600">تصنيف</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg text-center shadow-sm">
                    <div className="text-2xl font-bold text-emerald-600">2009</div>
                    <div className="text-sm text-slate-600">سنة التأسيس</div>
                  </div>
                </div>
                
                {/* Categories from Mawdoo3 */}
                <div className="mt-6">
                  <h3 className="font-bold text-slate-700 mb-3">أهم التصنيفات:</h3>
                  <div className="flex flex-wrap gap-2">
                    {['العلوم', 'التقنية', 'الصحة', 'الأعمال', 'التعليم', 'الفنون', 'الرياضة', 'السياحة'].map(cat => (
                      <Badge key={cat} variant="secondary" className="bg-white">
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700">
                  <a href="https://mawdoo3.com" target="_blank" rel="noopener noreferrer">
                    زيارة موقع موضوع
                    <ExternalLink className="w-4 h-4 mr-2" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
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
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">كورسات مجانية</h3>
              </div>
              <p className="text-slate-400">
                بوابة الكورسات المجانية - تجمع أفضل الكورسات المجانية من جميع أنحاء العالم
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">روابط سريعة</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">الكورسات</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">المنصات</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">موسوعة موضوع</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">المنصات الشريكة</h4>
              <div className="flex flex-wrap gap-2">
                {platforms.slice(0, 5).map(p => (
                  <Badge key={p.id} variant="secondary" className="bg-slate-800">
                    {p.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-500">
            <p>© 2025 كورسات مجانية - جميع الحقوق محفوظة</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Course Card Component
function CourseCard({ course, featured = false }: { course: Course; featured?: boolean }) {
  return (
    <Card className={`group hover:shadow-xl transition-all duration-300 overflow-hidden ${featured ? 'ring-2 ring-amber-200' : ''}`}>
      <div className="relative">
        {featured && (
          <div className="absolute top-2 right-2 z-10">
            <Badge className="bg-amber-500 text-white">
              <Sparkles className="w-3 h-3 ml-1" />
              مميز
            </Badge>
          </div>
        )}
        <div className="h-40 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center overflow-hidden">
          {course.imageUrl ? (
            <img 
              src={course.imageUrl} 
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <GraduationCap className="w-16 h-16 text-slate-300" />
          )}
        </div>
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base line-clamp-2 leading-tight">
              {course.titleAr || course.title}
            </CardTitle>
            {course.titleAr && course.languageId === 'en' && (
              <p className="text-xs text-slate-500 mt-1 line-clamp-1">{course.title}</p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {course.isFree && (
            <Badge variant="outline" className="text-emerald-600 border-emerald-200 text-xs">
              مجاني
            </Badge>
          )}
          {course.certificate && (
            <Badge variant="outline" className="text-blue-600 border-blue-200 text-xs">
              شهادة
            </Badge>
          )}
          {course.level && (
            <Badge variant="outline" className="text-xs">
              {course.level === 'beginner' ? 'مبتدئ' : course.level === 'intermediate' ? 'متوسط' : 'متقدم'}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm text-slate-600 line-clamp-2 mb-3">
          {course.descriptionAr || course.description}
        </p>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          {course.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{course.rating}</span>
            </div>
          )}
          {course.duration && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{course.duration}</span>
            </div>
          )}
          {course.enrollments && (
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{course.enrollments}</span>
            </div>
          )}
        </div>
        {course.instructor && (
          <p className="text-xs text-slate-500 mt-2">
            بواسطة: {course.instructor}
          </p>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700 group/button">
          <a href={course.url} target="_blank" rel="noopener noreferrer">
            ابدأ التعلم
            <ExternalLink className="w-4 h-4 mr-2 group-hover/button:translate-x-[-4px] transition-transform" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
