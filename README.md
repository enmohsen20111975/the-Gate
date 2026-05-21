# 📚 المكتبة التعليمية - The Gate

> بوابة تعليمية شاملة تحتوي على الكورسات المجانية والمقالات العربية - كل المحتوى في مكان واحد

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Prisma](https://img.shields.io/badge/Prisma-ORM-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC)

## 🌟 المميزات

- ✅ **محتوى داخلي كامل** - لا حاجة لمغادرة الموقع
- ✅ **مقالات عربية** - محتوى تعليمي عربي أصيل
- ✅ **تكامل مع موسوعة موضوع** - جلب المقالات من أكبر موسوعة عربية
- ✅ **كورسات مجانية** - دروس تعليمية داخل الموقع
- ✅ **بحث متقدم** - فلترة حسب التصنيف واللغة
- ✅ **تصميم متجاوب** - يعمل على جميع الأجهزة

## 🚀 البدء السريع

```bash
# تثبيت التبعيات
bun install

# تشغيل قاعدة البيانات
bun run db:push

# تشغيل المشروع
bun run dev
```

## 📁 هيكل المشروع

```
src/
├── app/
│   ├── page.tsx              # الصفحة الرئيسية
│   ├── articles/[id]/        # صفحة المقال
│   └── api/
│       ├── articles/         # API المقالات
│       ├── courses/          # API الكورسات
│       ├── categories/       # API التصنيفات
│       ├── platforms/        # API المنصات
│       ├── languages/        # API اللغات
│       ├── seed/             # تهيئة البيانات
│       └── scrape/
│           └── mawdoo3/      # جلب من موسوعة موضوع
├── components/ui/            # مكونات UI
├── lib/
│   └── db.ts                 # اتصال قاعدة البيانات
└── prisma/
    └── schema.prisma         # هيكل قاعدة البيانات
```

## 📊 قاعدة البيانات

### الجداول الرئيسية:

- **Article** - المقالات مع المحتوى الكامل
- **Course** - الكورسات التعليمية
- **Lesson** - دروس الكورسات
- **Category** - التصنيفات
- **Language** - اللغات المدعومة
- **Platform** - منصات التعلم
- **Topic** - مواضيع المقالات

## 🔌 APIs

| Endpoint | Method | الوصف |
|----------|--------|-------|
| `/api/articles` | GET, POST | المقالات |
| `/api/articles/[id]` | GET, PUT, DELETE | مقال واحد |
| `/api/courses` | GET, POST | الكورسات |
| `/api/categories` | GET, POST | التصنيفات |
| `/api/platforms` | GET, POST | المنصات |
| `/api/languages` | GET, POST | اللغات |
| `/api/scrape/mawdoo3` | GET, POST | جلب من موسوعة موضوع |
| `/api/seed` | POST | تهيئة البيانات |

## 📖 الاستخدام

### إضافة مقال جديد

```bash
curl -X POST http://localhost:3000/api/articles \
  -H "Content-Type: application/json" \
  -d '{
    "title": "عنوان المقال",
    "content": "محتوى المقال...",
    "languageCode": "ar"
  }'
```

### جلب مقالات من موسوعة موضوع

```bash
# جلب التصنيفات
curl "http://localhost:3000/api/scrape/mawdoo3?action=categories"

# جلب مقال محدد
curl "http://localhost:3000/api/scrape/mawdoo3?action=article&url=https://mawdoo3.com/..."
```

## 🎨 التصنيفات المتاحة

- 🖥️ البرمجة (Programming)
- 🌐 اللغات (Languages)
- 💼 الأعمال (Business)
- ❤️ الصحة (Health)
- 🎨 التصميم (Design)
- 💰 المال (Finance)
- 🔬 العلوم (Science)

## 🛠️ التقنيات المستخدمة

- **Frontend**: Next.js 16, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Database**: Prisma ORM, SQLite
- **Scraping**: z-ai-web-dev-sdk

## 📝 الترخيص

MIT License

## 👨‍💻 المساهمة

نرحب بالمساهمات! يرجى فتح Issue أو Pull Request.

---

**صنع بـ ❤️ للمجتمع العربي**
