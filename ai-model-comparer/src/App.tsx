import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import Home from '@/pages/Index'
import ComparisonPage from '@/pages/Compare'
import Dashboard from '@/pages/Admin/Dashboard'
import AddModel from '@/pages/Admin/AddModel'
import EditModel from '@/pages/Admin/EditModel'
import Models from '@/pages/Admin/Models'
import AdminSetup from '@/pages/Admin/Setup'
import LoginPage from '@/pages/Login'
import About from '@/pages/About'
import Header from '@/components/Header'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Admin from '@/pages/Admin'
import Categories from '@/pages/Admin/Categories'
import EditCategory from '@/pages/Admin/EditCategory'
import ModelPage from '@/pages/Model'

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
    <>
      <Header />
      <main className="min-h-screen pt-14">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/compare" element={<ComparisonPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/model/:id" element={<ModelPage />} />
          
          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              user ? (isAdmin ? <Dashboard /> : <AdminSetup />) : <Navigate to="/login" />
            }
          />
          <Route
            path="/admin/categories"
            element={
              user ? (isAdmin ? <Categories /> : <AdminSetup />) : <Navigate to="/login" />
            }
          />
          <Route
            path="/admin/categories/new"
            element={
              user ? (isAdmin ? <EditCategory /> : <AdminSetup />) : <Navigate to="/login" />
            }
          />
          <Route
            path="/admin/categories/:id"
            element={
              user ? (isAdmin ? <EditCategory /> : <AdminSetup />) : <Navigate to="/login" />
            }
          />
          <Route
            path="/admin/models"
            element={
              user ? (isAdmin ? <Models /> : <AdminSetup />) : <Navigate to="/login" />
            }
          />
          <Route
            path="/admin/models/new"
            element={
              user ? (isAdmin ? <EditModel /> : <AdminSetup />) : <Navigate to="/login" />
            }
          />
          <Route
            path="/admin/models/:id"
            element={
              user ? (isAdmin ? <EditModel /> : <AdminSetup />) : <Navigate to="/login" />
            }
          />
          <Route
            path="/admin/add"
            element={
              user ? (isAdmin ? <AddModel /> : <AdminSetup />) : <Navigate to="/login" />
            }
          />
          <Route
            path="/admin/edit/:id"
            element={
              user ? (isAdmin ? <EditModel /> : <AdminSetup />) : <Navigate to="/login" />
            }
          />
        </Routes>
      </main>
      <Toaster />
    </>
  )
}

export default App