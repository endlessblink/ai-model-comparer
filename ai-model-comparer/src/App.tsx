import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import Home from '@/pages/Index'
import ComparisonPage from '@/pages/Compare'
import Dashboard from '@/pages/Admin/Dashboard'
import AddModel from '@/pages/Admin/AddModel'
import AdminSetup from '@/pages/Admin/Setup'
import Header from '@/components/Header'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

function App() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        checkAdminStatus(session.user.id)
      }
      setIsLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        checkAdminStatus(session.user.id)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkAdminStatus = async (userId: string) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', userId)
        .single()

      setIsAdmin(profile?.is_admin ?? false)
    } catch (error) {
      console.error('Error checking admin status:', error)
      setIsAdmin(false)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-4 mt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/compare" element={<ComparisonPage />} />
          <Route 
            path="/admin" 
            element={isAdmin ? <Dashboard /> : <Navigate to="/" />} 
          />
          <Route 
            path="/admin/add" 
            element={isAdmin ? <AddModel /> : <Navigate to="/" />} 
          />
          <Route 
            path="/admin/setup" 
            element={isAdmin ? <AdminSetup /> : <Navigate to="/" />} 
          />
          <Route path="/about" element={(
            <div className="container mx-auto px-4 py-8">
              <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-400 inline-block text-transparent bg-clip-text">
                אודות
              </h1>
              <p className="text-gray-400">
                עמוד זה בבנייה...
              </p>
            </div>
          )} />
          <Route path="/contact" element={(
            <div className="container mx-auto px-4 py-8">
              <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-400 inline-block text-transparent bg-clip-text">
                צור קשר
              </h1>
              <p className="text-gray-400">
                עמוד זה בבנייה...
              </p>
            </div>
          )} />
        </Routes>
      </main>
      <Toaster />
    </div>
  )
}

export default App