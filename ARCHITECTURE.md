# 🏗️ Weggo Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         WEGGO MARKETPLACE                        │
│                  AI-Powered Second-Hand Platform                 │
└─────────────────────────────────────────────────────────────────┘
                                │
                ┌───────────────┴───────────────┐
                │                               │
        ┌───────▼────────┐            ┌────────▼────────┐
        │   FRONTEND     │            │    BACKEND      │
        │  (Next.js 14)  │◄──────────►│  (API Routes)   │
        └────────────────┘            └─────────────────┘
                │                               │
        ┌───────┴────────┐            ┌────────┴─────────┐
        │                │            │                  │
    ┌───▼───┐      ┌────▼────┐  ┌───▼───┐      ┌──────▼──────┐
    │ Pages │      │Components│  │ AI    │      │  Database   │
    └───────┘      └──────────┘  │Engine │      │ (Future)    │
                                  └───────┘      └─────────────┘
```

---

## Component Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          USER INTERFACE                          │
└─────────────────────────────────────────────────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
┌───────▼────────┐    ┌─────────▼────────┐   ┌────────▼───────┐
│  Navigation    │    │   Main Content   │   │   AI Chatbot   │
│  - Navbar      │    │   - Hero         │   │   (Floating)   │
│  - Search      │    │   - Categories   │   └────────────────┘
│  - Language    │    │   - Feed         │
└────────────────┘    │   - Featured     │
                      └──────────────────┘
```

---

## Data Flow Architecture

```
┌──────────┐         ┌──────────────┐         ┌────────────┐
│  User    │────────►│   Browser    │────────►│  Next.js   │
│ Actions  │         │   (React)    │         │   Server   │
└──────────┘         └──────────────┘         └────────────┘
                            │                        │
                            │                        │
                     ┌──────▼──────┐         ┌──────▼──────┐
                     │   Zustand   │         │ API Routes  │
                     │   (State)   │         │  /api/*     │
                     └─────────────┘         └─────────────┘
                            │                        │
                            │                        │
                     ┌──────▼──────┐         ┌──────▼──────┐
                     │  Local      │         │  External   │
                     │  Storage    │         │  Services   │
                     └─────────────┘         └─────────────┘
```

---

## Page Structure

```
app/
│
├── layout.tsx (Root Layout)
│   ├── Navbar
│   ├── <Page Content>
│   └── AIChatbot
│
├── page.tsx (Home)
│   ├── Hero
│   ├── Categories
│   ├── PersonalizedFeed
│   ├── FeaturedListings
│   ├── HowItWorks
│   └── Footer
│
├── sell/page.tsx (Sell)
│   ├── Form
│   ├── ImageUpload
│   └── AIPricingSuggestion (Modal)
│
├── profile/page.tsx (Profile)
│   ├── UserInfo
│   ├── Stats
│   └── ActiveListings
│
└── favorites/page.tsx (Favorites)
    └── ProductGrid
```

---

## Component Hierarchy

```
App (layout.tsx)
│
├── Navbar
│   ├── Logo
│   ├── SearchBar
│   ├── Navigation Links
│   └── LanguageToggle
│
├── Page Content
│   │
│   ├── Home
│   │   ├── Hero
│   │   │   ├── Title & Description
│   │   │   ├── CTA Buttons
│   │   │   └── FloatingCards
│   │   │
│   │   ├── Categories
│   │   │   └── CategoryCard × 8
│   │   │
│   │   ├── PersonalizedFeed
│   │   │   ├── FilterButtons
│   │   │   └── ProductCard × N
│   │   │
│   │   ├── FeaturedListings
│   │   │   └── ProductCard × N
│   │   │
│   │   └── HowItWorks
│   │       └── StepCard × 4
│   │
│   ├── Sell Page
│   │   ├── FormFields
│   │   ├── ImageUpload
│   │   └── PricingSuggestion (Modal)
│   │
│   ├── Profile Page
│   │   ├── UserCard
│   │   ├── StatsCard
│   │   └── ListingsGrid
│   │
│   └── Favorites Page
│       └── ProductGrid
│
├── Footer
│   ├── Brand Info
│   ├── Quick Links
│   ├── Categories
│   └── Contact Info
│
└── AIChatbot (Floating)
    ├── ChatWindow
    ├── MessageList
    ├── QuickQuestions
    └── InputField
```

---

## State Management

```
Zustand Store (lib/store.ts)
│
├── User State
│   ├── user: User | null
│   └── setUser()
│
├── Favorites
│   ├── favorites: string[]
│   ├── addFavorite()
│   ├── removeFavorite()
│   └── toggleFavorite()
│
├── Language
│   ├── language: 'en' | 'ar'
│   └── setLanguage()
│
├── Search & Filters
│   ├── searchQuery: string
│   ├── filters: object
│   ├── setSearchQuery()
│   ├── setFilters()
│   └── clearFilters()
│
└── UI State
    ├── isChatbotOpen: boolean
    └── setChatbotOpen()
```

---

## API Architecture

```
/api
│
├── /ai-chat (POST)
│   ├── Input: { message, context }
│   ├── Process: AI analysis
│   └── Output: { response, timestamp }
│
├── /pricing (POST)
│   ├── Input: { title, description, category, condition }
│   ├── Process: Market analysis & scraping
│   └── Output: { price, confidence, sources, trend }
│
└── /listings
    ├── GET: Fetch listings with filters
    │   ├── Query: category, location, price range
    │   └── Output: { listings[], total }
    │
    └── POST: Create new listing
        ├── Input: Listing data
        └── Output: { listingId, success }
```

---

## Technology Stack

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND LAYER                          │
├─────────────────────────────────────────────────────────────┤
│  React 18.2       │  Next.js 14    │  TypeScript 5.0       │
│  Tailwind CSS 3.3 │  Framer Motion │  Lucide Icons         │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                     MIDDLEWARE LAYER                         │
├─────────────────────────────────────────────────────────────┤
│  Zustand (State)  │  React Hook Form │  Axios (HTTP)       │
│  React Hot Toast  │  Swiper          │  Clsx              │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                      BACKEND LAYER                           │
├─────────────────────────────────────────────────────────────┤
│  Next.js API Routes  │  TypeScript  │  (Future: Database) │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                         │
├─────────────────────────────────────────────────────────────┤
│  (Future: OpenAI) │ (Future: Puppeteer) │ (Future: Cloud) │
└─────────────────────────────────────────────────────────────┘
```

---

## File Dependencies

```
app/page.tsx
├── components/Hero.tsx
├── components/Categories.tsx
├── components/PersonalizedFeed.tsx
│   └── components/ProductCard.tsx
├── components/FeaturedListings.tsx
│   └── components/ProductCard.tsx
├── components/HowItWorks.tsx
└── components/Footer.tsx

app/sell/page.tsx
├── components/AIPricingSuggestion.tsx
├── react-hook-form
└── app/api/pricing/route.ts

components/Navbar.tsx
├── lucide-react (icons)
├── framer-motion
└── lib/store.ts (state)

components/AIChatbot.tsx
├── framer-motion
├── lucide-react
└── app/api/ai-chat/route.ts
```

---

## Styling Architecture

```
Global Styles (app/globals.css)
│
├── Tailwind Base
│   ├── @tailwind base
│   ├── @tailwind components
│   └── @tailwind utilities
│
├── Custom Utilities
│   ├── .glass-effect
│   ├── .gradient-primary
│   ├── .gradient-accent
│   ├── .hover-lift
│   └── .card-modern
│
├── Animations
│   ├── @keyframes float
│   ├── @keyframes slideUp
│   ├── @keyframes slideDown
│   ├── @keyframes fadeIn
│   └── @keyframes shimmer
│
└── Custom Scrollbar
    ├── ::-webkit-scrollbar
    ├── ::-webkit-scrollbar-track
    └── ::-webkit-scrollbar-thumb
```

---

## Responsive Breakpoints

```
Mobile First Approach

┌─────────────┬──────────────┬──────────────┬──────────────┐
│   Mobile    │   Tablet     │   Desktop    │   Wide       │
│   < 768px   │  768-1024px  │  1024-1280px │  > 1280px    │
├─────────────┼──────────────┼──────────────┼──────────────┤
│ 1 column    │  2 columns   │  3-4 columns │  4 columns   │
│ Stack menu  │  Stack menu  │  Inline menu │  Inline menu │
│ Full width  │  Constrained │  Constrained │  Max-width   │
└─────────────┴──────────────┴──────────────┴──────────────┘

Tailwind Classes:
- Mobile: Default
- Tablet: md:
- Desktop: lg:
- Wide: xl:
```

---

## Security Architecture

```
Current Security Layers:
├── Input Sanitization (React)
├── XSS Protection (React)
├── TypeScript Type Safety
└── Environment Variables

Future Security Layers:
├── Authentication (NextAuth)
├── Authorization (JWT)
├── Rate Limiting
├── CSRF Protection
├── SQL Injection Prevention
├── Image Validation
└── Content Moderation
```

---

## Deployment Architecture

```
Development
    │
    ├── Local (npm run dev)
    │   └── http://localhost:3000
    │
Production
    │
    ├── Build (npm run build)
    │   ├── Optimize assets
    │   ├── Generate static pages
    │   └── Bundle JavaScript
    │
    └── Deploy (Vercel/Custom)
        ├── Edge Network (CDN)
        ├── Serverless Functions
        └── Auto-scaling
```

---

## Feature Modules

```
AI Module
├── Chatbot System
│   ├── Message Handling
│   ├── Response Generation
│   └── Context Management
│
└── Pricing System
    ├── Market Analysis
    ├── Price Calculation
    └── Source Attribution

User Module
├── Profile Management
├── Favorites System
└── Listing Management

Product Module
├── Listing Creation
├── Search & Filter
├── Categories
└── Feed Personalization

Localization Module
├── Language Toggle
├── RTL Support
└── Content Translation
```

---

## Performance Optimization

```
Current Optimizations:
├── Next.js Image Optimization
├── Code Splitting (automatic)
├── CSS Purging (Tailwind)
├── Component Lazy Loading (ready)
└── Animation Performance (GPU)

Future Optimizations:
├── Server-Side Rendering (SSR)
├── Static Generation (SSG)
├── API Caching
├── Image CDN
└── Bundle Analysis
```

---

## Testing Strategy (Future)

```
Unit Tests
├── Component Testing
├── Utility Function Testing
└── API Route Testing

Integration Tests
├── Page Flow Testing
├── Form Submission
└── API Integration

E2E Tests
├── User Journeys
├── Critical Paths
└── Cross-browser Testing
```

---

This architecture is:
- ✅ Scalable
- ✅ Maintainable
- ✅ Modular
- ✅ Type-safe
- ✅ Production-ready

**Ready to build amazing features! 🚀**



