import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import ComparisonTable from '@/components/ComparisonTable'
import AdminPage from '@/pages/Admin'
import LoginPage from '@/pages/Login'
import IndexPage from '@/pages/Index'
import UpdateModels from './pages/Admin/UpdateModels'
import AddModel from './pages/Admin/AddModel'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import Header from '@/components/Header'

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Header />
            <Routes>
              <Route path="/" element={<IndexPage />} />
              {/* Handle both /compare and /comparison routes */}
              <Route path="/comparison" element={
                <main className="container mx-auto py-8">
                  <ComparisonTable />
                </main>
              } />
              <Route path="/compare" element={<Navigate to="/comparison" replace />} />
              <Route path="/login" element={
                <main className="container mx-auto py-8">
                  <LoginPage />
                </main>
              } />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/update-models"
                element={
                  <ProtectedRoute>
                    <main className="container mx-auto py-8">
                      <UpdateModels />
                    </main>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/add-model"
                element={
                  <ProtectedRoute>
                    <main className="container mx-auto py-8">
                      <AddModel />
                    </main>
                  </ProtectedRoute>
                }
              />
              {/* Catch all route for 404s */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}
