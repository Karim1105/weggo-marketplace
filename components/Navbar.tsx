'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Search, Heart, User, Plus, Globe, LogIn, LogOut } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isArabic, setIsArabic] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me')
      const data = await res.json()
      if (data.success) {
        setUser(data.user)
      }
    } catch (error) {
      // Not authenticated
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      toast.success('Logged out successfully')
      router.push('/')
      router.refresh()
    } catch (error) {
      toast.error('Logout failed')
    }
  }

  const toggleLanguage = () => {
    setIsArabic(!isArabic)
    document.documentElement.dir = !isArabic ? 'rtl' : 'ltr'
    document.documentElement.lang = !isArabic ? 'ar' : 'en'
  }

  return (
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
            isScrolled 
              ? 'bg-white/60 backdrop-blur-xl shadow-xl border-b border-white/10' 
              : 'bg-transparent'
          }`}
        >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24 min-h-[96px]">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 2 }}
              className="text-2xl lg:text-3xl font-black leading-none tracking-tight py-2"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent'
              }}
            >
              Weggo
            </motion.div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isArabic ? "ابحث عن أي شيء..." : "Search for anything..."}
                className="w-full pl-12 pr-6 py-4 rounded-2xl border border-gray-200/50 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-300 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
              />
            </div>
          </div>

           {/* Desktop Navigation */}
           <div className="hidden md:flex items-center space-x-4">
             <button
               onClick={toggleLanguage}
               className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors"
             >
               <Globe className="w-5 h-5" />
               <span className="text-sm font-medium">{isArabic ? 'EN' : 'عربي'}</span>
             </button>

             <Link
               href="/browse"
               className="group flex items-center space-x-2 border-2 border-primary-500/50 text-primary-600 px-6 py-3 rounded-2xl font-bold hover:bg-gradient-to-r hover:from-primary-50 hover:to-accent-50 transition-all hover:-translate-y-1 shadow-lg hover:shadow-xl"
             >
               <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
               <span>{isArabic ? 'تصفح' : 'Browse'}</span>
             </Link>

             {user ? (
               <>
                 <Link
                   href="/sell"
                   className="group flex items-center space-x-2 gradient-primary text-white px-6 py-3 rounded-2xl font-bold hover:shadow-xl transition-all hover:-translate-y-1 shadow-lg"
                 >
                   <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                   <span>{isArabic ? 'بيع' : 'Sell'}</span>
                 </Link>

                 <Link
                   href="/favorites"
                   className="p-2.5 hover:bg-gray-100 rounded-full transition-colors relative"
                 >
                   <Heart className="w-6 h-6 text-gray-700" />
                 </Link>

                 <Link
                   href="/profile"
                   className="p-2.5 hover:bg-gray-100 rounded-full transition-colors"
                 >
                   <User className="w-6 h-6 text-gray-700" />
                 </Link>

                 <button
                   onClick={handleLogout}
                   className="p-2.5 hover:bg-gray-100 rounded-full transition-colors"
                   title="Logout"
                 >
                   <LogOut className="w-6 h-6 text-gray-700" />
                 </button>
               </>
             ) : (
               <>
                 <Link
                   href="/login"
                   className="group flex items-center space-x-2 border-2 border-primary-500 text-primary-600 px-6 py-3 rounded-2xl font-bold hover:bg-gradient-to-r hover:from-primary-50 hover:to-accent-50 transition-all hover:-translate-y-1 shadow-lg hover:shadow-xl"
                 >
                   <LogIn className="w-5 h-5 group-hover:scale-110 transition-transform" />
                   <span>Login</span>
                 </Link>

                 <Link
                   href="/register"
                   className="group flex items-center space-x-2 gradient-primary text-white px-6 py-3 rounded-2xl font-bold hover:shadow-xl transition-all hover:-translate-y-1 shadow-lg"
                 >
                   <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
                   <span>Sign Up</span>
                 </Link>
               </>
             )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isArabic ? "ابحث عن أي شيء..." : "Search for anything..."}
              className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/10 bg-white/60 backdrop-blur-xl"
          >
           <div className="px-4 py-6 space-y-4">
             <Link
               href="/browse"
               onClick={() => setIsMobileMenuOpen(false)}
               className="flex items-center justify-center space-x-2 border-2 border-primary-500 text-primary-600 px-6 py-3 rounded-full font-semibold hover:bg-primary-50 transition-all"
             >
               <Search className="w-5 h-5" />
               <span>{isArabic ? 'تصفح' : 'Browse'}</span>
             </Link>

             {user ? (
               <>
                 <Link
                   href="/sell"
                   onClick={() => setIsMobileMenuOpen(false)}
                   className="flex items-center justify-center space-x-2 gradient-primary text-white px-6 py-3 rounded-full font-semibold"
                 >
                   <Plus className="w-5 h-5" />
                   <span>{isArabic ? 'بيع' : 'Sell'}</span>
                 </Link>

                 <Link
                   href="/favorites"
                   onClick={() => setIsMobileMenuOpen(false)}
                   className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors"
                 >
                   <Heart className="w-5 h-5" />
                   <span>{isArabic ? 'المفضلة' : 'Favorites'}</span>
                 </Link>

                 <Link
                   href="/profile"
                   onClick={() => setIsMobileMenuOpen(false)}
                   className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors"
                 >
                   <User className="w-5 h-5" />
                   <span>{isArabic ? 'الملف الشخصي' : 'Profile'}</span>
                 </Link>

                 <button
                   onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }}
                   className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors w-full"
                 >
                   <LogOut className="w-5 h-5" />
                   <span>Logout</span>
                 </button>
               </>
             ) : (
               <>
                 <Link
                   href="/login"
                   onClick={() => setIsMobileMenuOpen(false)}
                   className="flex items-center justify-center space-x-2 border-2 border-primary-500 text-primary-600 px-6 py-3 rounded-full font-semibold hover:bg-primary-50 transition-all"
                 >
                   <LogIn className="w-5 h-5" />
                   <span>Login</span>
                 </Link>

                 <Link
                   href="/register"
                   onClick={() => setIsMobileMenuOpen(false)}
                   className="flex items-center justify-center space-x-2 gradient-primary text-white px-6 py-3 rounded-full font-semibold"
                 >
                   <User className="w-5 h-5" />
                   <span>Sign Up</span>
                 </Link>
               </>
             )}

              <button
                onClick={() => { toggleLanguage(); setIsMobileMenuOpen(false); }}
                className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors w-full"
              >
                <Globe className="w-5 h-5" />
                <span>{isArabic ? 'English' : 'عربي'}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

