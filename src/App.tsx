import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { ThemeProvider } from './components/theme-provider'
import { Toaster } from './components/ui/toaster'
import { useEffect, useState } from 'react'
import { supabase, safeSupabaseCall } from './lib/supabase'

// Lazy load pages
import Home from './pages/Index'
import Compare from './pages/Compare'

function Navigation({ isAdmin }: { isAdmin: boolean }) {
  return (
    <nav className="flex gap-8 text-gray-400">
      <Link 
        to="/compare" 
        className="relative py-1 hover:text-white transition-colors group"
      >
        השוואת מודלים
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
      </Link>
      <Link 
        to="/about"
        className="relative py-1 hover:text-white transition-colors group"
      >
        אודות
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
      </Link>
      <Link 
        to="/contact"
        className="relative py-1 hover:text-white transition-colors group"
      >
        צור קשר
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
      </Link>
      {isAdmin && (
        <Link 
          to="/admin"
          className="relative py-1 hover:text-white transition-colors group"
        >
          ניהול
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
        </Link>
      )}
    </nav>
  )
}

function Layout() {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    async function checkAdmin() {
      const adminStatus = await safeSupabaseCall(async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return false

        const { data } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single()
        
        return !!data?.is_admin
      }, false)

      setIsAdmin(adminStatus)
    }
    
    checkAdmin()
  }, [])

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-b from-[#0A0B14] via-[#0d0e1a] to-[#0A0B14] text-white">
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#0A0B14]/80 border-b border-gray-800/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-12">
              <Link to="/" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                AI Model Comparer
              </Link>
              <Navigation isAdmin={isAdmin} />
            </div>
          </div>
        </div>
      </header>

      <main className="pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/about" element={
            <div className="container mx-auto px-4 py-8">
              <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-400 inline-block text-transparent bg-clip-text">
                אודות
              </h1>
              <p className="text-gray-400">
                עמוד זה בבנייה...
              </p>
            </div>
          } />
          <Route path="/contact" element={
            <div className="container mx-auto px-4 py-8">
              <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-400 inline-block text-transparent bg-clip-text">
                צור קשר
              </h1>
              <p className="text-gray-400">
                עמוד זה בבנייה...
              </p>
            </div>
          } />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
      <Toaster />
    </ThemeProvider>
  )
}
